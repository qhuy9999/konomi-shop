import { defineEventHandler, readBody } from 'h3'
import { getUserFromToken } from '../../utils/jwt'
import prisma from '../../../prisma/prisma'

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

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phoneNumber,
        billingStreet: body.billingStreet,
        billingCity: body.billingCity,
        billingProvince: body.billingProvince,
        billingZipCode: body.billingZipCode,
        billingCountry: body.billingCountry,
        deliveryStreet: body.deliveryStreet,
        deliveryCity: body.deliveryCity,
        deliveryProvince: body.deliveryProvince,
        deliveryZipCode: body.deliveryZipCode,
        deliveryCountry: body.deliveryCountry,
      },
    })

    return {
      statusCode: 200,
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        emailVerified: updatedUser.emailVerified,
        phoneNumber: updatedUser.phone,
        billingStreet: updatedUser.billingStreet,
        billingCity: updatedUser.billingCity,
        billingProvince: updatedUser.billingProvince,
        billingZipCode: updatedUser.billingZipCode,
        billingCountry: updatedUser.billingCountry,
        deliveryStreet: updatedUser.deliveryStreet,
        deliveryCity: updatedUser.deliveryCity,
        deliveryProvince: updatedUser.deliveryProvince,
        deliveryZipCode: updatedUser.deliveryZipCode,
        deliveryCountry: updatedUser.deliveryCountry,
      },
    }
  } catch (error: unknown) {
    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }
    
    const message = error instanceof Error ? error.message : 'Failed to update profile'
    throw createError({
      statusCode: 500,
      message,
    })
  }
})
