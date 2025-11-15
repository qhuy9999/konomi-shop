import { defineEventHandler, readBody } from 'h3'
import { getUserFromToken } from '../../utils/jwt'
import prisma from '../../../prisma/prisma'
import * as argon2 from 'argon2'

export default defineEventHandler(async (event) => {
  try {
    // Verify auth
    const user = await getUserFromToken(event)
    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized',
      })
    }

    // Get request body
    const body = await readBody(event)

    if (!body.currentPassword || !body.newPassword) {
      throw createError({
        statusCode: 400,
        message: 'Current password and new password are required',
      })
    }

    // Get user from DB to verify current password
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    })

    if (!dbUser) {
      throw createError({
        statusCode: 404,
        message: 'User not found',
      })
    }

    // Verify current password
    const isPasswordValid = await argon2.verify(dbUser.password, body.currentPassword)
    if (!isPasswordValid) {
      throw createError({
        statusCode: 400,
        message: 'Current password is incorrect',
      })
    }

    // Hash new password
    const hashedPassword = await argon2.hash(body.newPassword, {
      type: argon2.argon2id,
      memoryCost: 12288,
      timeCost: 3,
    })

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
      },
    })

    return {
      statusCode: 200,
      success: true,
      message: 'Password changed successfully',
    }
  } catch (error: unknown) {
    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }
    
    const message = error instanceof Error ? error.message : 'Failed to change password'
    throw createError({
      statusCode: 500,
      message,
    })
  }
})
