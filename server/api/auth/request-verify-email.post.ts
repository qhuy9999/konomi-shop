/**
 * POST /api/auth/request-verify-email
 * 
 * Request OTP for email verification (user enters email to resend OTP)
 * Finds user by email and sends OTP if user exists and email not verified
 * 
 * Request body:
 * {
 *   "email": "user@example.com"
 * }
 * 
 * Response Success (200):
 * {
 *   "statusCode": 200,
 *   "success": true,
 *   "userId": 1,
 *   "email": "user@example.com",
 *   "message": "OTP has been sent to your email"
 * }
 * 
 * Response Error (404):
 * {
 *   "statusCode": 404,
 *   "message": "User not found with this email"
 * }
 * 
 * Response Error (400):
 * {
 *   "statusCode": 400,
 *   "message": "Email already verified"
 * }
 */

import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '../../../prisma/prisma'
import { createAndSendOTP } from '../../services/otp.service'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email } = body

    // Validation
    if (!email || typeof email !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        data: { message: 'Email is required' }
      })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        data: { message: 'Invalid email format' }
      })
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        data: { message: 'User not found with this email' }
      })
    }

    // Check if email already verified
    if (user.emailVerified) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        data: { message: 'Email is already verified' }
      })
    }

    // Send OTP
    await createAndSendOTP(user.id, user.email)

    return {
      statusCode: 200,
      success: true,
      userId: user.id,
      email: user.email,
      message: 'OTP has been sent to your email'
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('[request-verify-email] Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      data: { message: 'An error occurred while processing your request' }
    })
  }
})
