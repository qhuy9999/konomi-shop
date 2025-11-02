/**
 * POST /api/auth/verify-otp
 * 
 * Verify OTP code after registration
 * 
 * Request body:
 * {
 *   "userId": 1,
 *   "code": "123456"
 * }
 * 
 * Response:
 * {
 *   "statusCode": 200,
 *   "success": true,
 *   "message": "Email verified successfully",
 *   "user": { id, username, email, firstName, lastName, emailVerified }
 * }
 */

import { verifyOTP, incrementOTPAttempts } from '../../services/otp.service'
import { defineEventHandler, readBody, createError } from 'h3'

interface VerifyOTPInput {
  userId: number
  code: string
}

export default defineEventHandler(async (event) => {
  let body: VerifyOTPInput | null = null

  try {
    body = await readBody(event)

    // Validate input
    if (!body?.userId || !body?.code) {
      throw createError({
        statusCode: 400,
        message: 'userId and code are required',
      })
    }

    // Verify OTP
    const result = await verifyOTP(body.userId, body.code)

    return {
      statusCode: 200,
      ...result,
    }
  } catch (error: unknown) {
    // Increment failed attempts on error
    if (body?.userId) {
      await incrementOTPAttempts(body.userId).catch(console.error)
    }

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
      message: 'Error verifying OTP',
    })
  }
})
