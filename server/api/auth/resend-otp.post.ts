/**
 * POST /api/auth/resend-otp
 * 
 * Resend OTP code if expired or user requests
 * 
 * Request body:
 * {
 *   "userId": 1
 * }
 * 
 * Response:
 * {
 *   "statusCode": 200,
 *   "success": true,
 *   "message": "OTP has been sent to your email",
 *   "expiresIn": "5m"
 * }
 */

import { checkAndResendOTP } from '../../services/otp.service'
import prisma from '@@/prisma/prisma'
import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Validate input
    if (!body?.userId) {
      throw createError({
        statusCode: 400,
        message: 'userId cannot be empty',
      })
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: body.userId },
      select: {
        id: true,
        email: true,
        emailVerified: true,
      },
    })

    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'User does not exist',
      })
    }

    // Check if already verified
    if (user.emailVerified) {
      throw createError({
        statusCode: 400,
        message: 'Email has already been verified',
      })
    }

    // Check and resend OTP (smart logic - only sends if expired or doesn't exist)
    const result = await checkAndResendOTP(user.id, user.email)

    // If OTP wasn't sent (still valid), return 429 (Too Many Requests)
    if (!result.shouldResend) {
      throw createError({
        statusCode: 429,
        message: result.message,
        data: {
          resendOTP: false,
          canResendAt: result.canResendAt,
        },
      })
    }

    // OTP was sent successfully
    return {
      statusCode: 200,
      success: true,
      message: result.message,
      expiresIn: result.expiresIn,
    }
  } catch (error: unknown) {
    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    if (error instanceof Error) {
      throw createError({
        statusCode: 400,
        message: error.message,
      })
    }

    throw createError({
      statusCode: 500,
      message: 'Error sending OTP',
    })
  }
})
