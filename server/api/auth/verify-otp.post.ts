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

import { verifyOTP } from '../../services/otp.service'
import { verifyOTPSchema, validateRequest } from '../../../shared/schemas/auth'
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

    // Validate request body với Zod schema
    // - Kiểm tra userId là number dương
    // - Kiểm tra code có 6 chữ số
    const validatedData = validateRequest(verifyOTPSchema, body)

    // Verify OTP với dữ liệu đã validate
    const result = await verifyOTP(validatedData.userId, validatedData.code)

    return {
      statusCode: 200,
      ...result,
    }
  } catch (error: unknown) {
    // Determine status code based on error type
    let statusCode = 500
    let message = 'Error verifying OTP'

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
