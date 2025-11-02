import { signIn } from '../../services/auth.service'
import { defineEventHandler, readBody, createError, setCookie } from 'h3'
import {parseJwtTime} from '../../utils/jwtTime'

export default defineEventHandler(async (event) => {
  try {
    // Get Input - validate JSON body first
    let body
    try {
      body = await readBody(event)
    } catch {
      throw new Error('Invalid JSON format in request data')
    }

    // Validate required fields
    if (!body || typeof body !== 'object') {
      throw new Error('Request body must be an object')
    }

    if (!body.username || !body.password) {
      throw new Error('Missing username or password')
    }
    
    // Logic for sign in and compare the passwords
    const result = await signIn(body)

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
    if (error instanceof Error) {
      throw createError({
        statusCode: 400,
        message: error.message,
      })
    }
    throw createError({
      statusCode: 400,
      message: 'Sign in failed',
    })
  }
})
