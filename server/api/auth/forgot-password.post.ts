import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '../../../prisma/prisma'
import { createAndSendOTP } from '../../services/otp.service'

/**
 * POST /api/auth/forgot-password
 * Send password reset OTP to user's email
 *
 * Request:
 * {
 *   "email": "user@example.com"
 * }
 *
 * Response (Success - 200):
 * {
 *   "statusCode": 200,
 *   "success": true,
 *   "message": "Password reset OTP has been sent to your email",
 *   "email": "user@example.com"
 * }
 *
 * Response (User not found - 404):
 * {
 *   "statusCode": 404,
 *   "message": "User not found with this email"
 * }
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email } = body

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw createError({
        statusCode: 400,
        message: 'Invalid email address',
      })
    }

    // Check if user exists with this email
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'User not found with this email',
      })
    }

    // Send OTP to email for password reset
    await createAndSendOTP(user.id, email)

    return {
      statusCode: 200,
      success: true,
      message: 'Password reset OTP has been sent to your email',
      email,
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to send password reset email',
    })
  }
})
