import { signIn } from '../../services/auth.service'
import { signInSchema, validateRequest } from '../../../shared/schemas/auth'
import { defineEventHandler, readBody, createError, setCookie } from 'h3'
import { parseJwtTime } from '../../utils/jwtTime'

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
    // Get & validate input
    let body
    try {
      body = await readBody(event)
    } catch {
      throw new Error('Invalid JSON format in request body')
    }

    // Validate request body với Zod schema
    // - Kiểm tra username: non-empty
    // - Kiểm tra password: non-empty
    const validatedData = validateRequest(signInSchema, body)

    // Logic for sign in and compare the passwords
    const result = await signIn(validatedData)

    // Check if email verification is required
    if (!result.success && result.requiresEmailVerification) {
      throw createError({
        statusCode: 403,
        message: result.message,
        data: {
          requiresEmailVerification: true,
          userId: result.userId,
          email: result.email,
          resendOTP: result.resendOTP,
          canResendAt: result.canResendAt,
        },
      })
    }

    // If sign in was unsuccessful for other reasons
    if (!result.success) {
      throw createError({
        statusCode: 401,
        message: result.message || 'Sign in failed',
      })
    }

    // Get refresh token TTL from .env (default 7 days)
    const refreshTokenExpires = process.env.JWT_REFRESH_EXPIRES_IN || '7d'

    // Set refresh token as httpOnly cookie: gửi refresh token trong cookie cho client
    if (result.refreshToken) {
      setCookie(event, 'refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: parseJwtTime(refreshTokenExpires), // in seconds
        path: '/',
      })
    }

    // Return access token and user info (không trả refresh token chỉ trả access token trong response body)
    return {
      statusCode: 200,
      success: true,
      message: result.message,
      accessToken: result.accessToken,
      user: result.user,
    }
  } catch (error: unknown) {
    // Determine status code based on error type
    let statusCode = 500
    let message = 'Sign in failed'

    // Validation errors → 400 Bad Request
    if (error instanceof ValidationError) {
      statusCode = 400
      message = (error as Error).message
    }
    // JSON parse errors → 400 Bad Request
    else if (error instanceof SyntaxError) {
      statusCode = 400
      message = 'Invalid JSON format in request body'
    }
    // HTTP errors from createError() - pass through
    else if (error instanceof Error && 'statusCode' in error) {
      throw error
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
