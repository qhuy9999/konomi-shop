/**
 * POST /api/auth/resend-otp
 * 
 * Resend OTP code if expired or user requests
 * Includes rate limiting to prevent email bombing
 * 
 * Request body:
 * {
 *   "userId": 1
 * }
 * 
 * Response Success (200):
 * {
 *   "statusCode": 200,
 *   "success": true,
 *   "message": "OTP has been sent to your email",
 *   "expiresIn": "5m"
 * }
 * 
 * Response Rate Limited (429):
 * {
 *   "statusCode": 429,
 *   "message": "Too many OTP requests. Please try again in X seconds",
 *   "retryAfter": 60
 * }
 */

import { checkAndResendOTP, RateLimitError } from '../../services/otp.service'
import { resendOTPSchema, validateRequest } from '../../../shared/schemas/auth'
import prisma from '../../../prisma/prisma'
import { defineEventHandler, readBody, createError } from 'h3'

/**
 * ValidationError class - same as in shared/schemas/auth
 * Used to distinguish validation errors from other errors
 * Returns 400 Bad Request instead of 500 Internal Server Error
 */
class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Use Zod schema validation (comprehensive + error details)
    // This automatically handles type coercion and validation
    const validatedData = validateRequest(resendOTPSchema, body)

    const userId = validatedData.userId

    // Get user with validated userId
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
    // Handle rate limit errors (429 Too Many Requests)
    if (error instanceof RateLimitError) {
      throw createError({
        statusCode: 429,
        message: error.message,
        data: {
          retryAfter: error.retryAfterSeconds,
        },
      })
    }

    // Determine status code based on error type
    let statusCode = 500
    let message = 'Error sending OTP'

    // HTTP errors from createError() - pass through
    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }
    // Validation errors → 400 Bad Request
    else if (error instanceof ValidationError) {
      statusCode = 400
      message = (error as Error).message
    }
    // JSON parse errors → 400 Bad Request
    else if (error instanceof SyntaxError) {
      statusCode = 400
      message = 'Invalid JSON format in request body'
    }
    // Other known errors → 500 Internal Server Error
    else if (error instanceof Error) {
      statusCode = 500
      message = error.message
    }
    // Unknown errors → 500 Internal Server Error
    else {
      statusCode = 500
      message = 'An unexpected error occurred'
    }

    throw createError({
      statusCode,
      message,
    })
  }
})
