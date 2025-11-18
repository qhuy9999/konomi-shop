import prisma from '../../prisma/prisma'
import crypto from 'crypto'
import { parseJwtTime } from '../utils/jwtTime'
import { sendOTPEmail } from './email.service'

const OTP_EXPIRES_IN = process.env.OTP_EXPIRES_IN || '5m'
const OTP_RATE_LIMIT_WINDOW = parseInt(process.env.OTP_RATE_LIMIT_WINDOW_MIN || '15') // minutes
const OTP_RATE_LIMIT_MAX = parseInt(process.env.OTP_RATE_LIMIT_MAX || '3') // max requests per window

/**
 * Custom error for rate limit violations
 */
export class RateLimitError extends Error {
  constructor(
    message: string,
    public readonly retryAfterSeconds: number
  ) {
    super(message)
    this.name = 'RateLimitError'
  }
}

/**
 * Generate 6-digit random OTP
 */
export const generateOTP = (): string => {
  return crypto.randomInt(100000, 999999).toString()
}

/**
 * Check if user has exceeded OTP creation rate limit
 * Uses rolling window: count OTPs created in last N minutes
 * 
 * @param userId - User ID
 * @returns { isAllowed: boolean, retryAfterSeconds?: number }
 */
const checkOTPRateLimit = async (userId: number): Promise<{
  isAllowed: boolean
  retryAfterSeconds?: number
}> => {
  try {
    // Calculate time window (last N minutes)
    const windowStartTime = new Date(
      Date.now() - OTP_RATE_LIMIT_WINDOW * 60 * 1000
    )

    // Count OTP creations for this user in the rolling window
    const recentOTPCount = await prisma.otp.count({
      where: {
        userId,
        type: 'EMAIL_VERIFICATION',
        createdAt: {
          gte: windowStartTime,
        },
      },
    })

    if (recentOTPCount >= OTP_RATE_LIMIT_MAX) {
      // Find oldest OTP in window to calculate retry time
      const oldestOTP = await prisma.otp.findFirst({
        where: {
          userId,
          type: 'EMAIL_VERIFICATION',
          createdAt: {
            gte: windowStartTime,
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
        select: {
          createdAt: true,
        },
      })

      // Calculate seconds until oldest OTP falls outside the window
      const retryAfterTime = new Date(
        oldestOTP!.createdAt.getTime() + OTP_RATE_LIMIT_WINDOW * 60 * 1000
      )
      const retryAfterSeconds = Math.ceil(
        (retryAfterTime.getTime() - Date.now()) / 1000
      )

      return {
        isAllowed: false,
        retryAfterSeconds: Math.max(1, retryAfterSeconds),
      }
    }

    return { isAllowed: true }
  } catch (error) {
    // Log the error for debugging
    console.error('❌ Error checking OTP rate limit:', error)
    // If there's a database error, fail safely by not rate limiting
    // This prevents blocking users if database is temporarily down
    throw new Error(`Failed to check OTP rate limit: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Create and send OTP for email verification
 * Includes rate limiting to prevent email bombing
 * 
 * @param userId - User ID
 * @param email - User email
 * @returns Success message and expiration time
 * @throws RateLimitError if rate limit exceeded (HTTP 429)
 * @throws Error for other failures
 */
export const createAndSendOTP = async (userId: number, email: string) => {
  try {
    // Check rate limit BEFORE creating OTP
    const rateLimit = await checkOTPRateLimit(userId)
    if (!rateLimit.isAllowed) {
      const retryAfter = rateLimit.retryAfterSeconds || 60
      throw new RateLimitError(
        `Too many OTP requests. Please try again in ${retryAfter} seconds`,
        retryAfter
      )
    }

    // Generate new OTP code
    const code = generateOTP()

    // Atomic transaction: delete old OTPs and create new one in single unit
    // Prevents race condition where concurrent requests create multiple OTPs
    const otp = await prisma.$transaction(async (tx) => {
      // Delete old OTPs for this user (within transaction)
      await tx.otp.deleteMany({
        where: {
          userId,
          type: 'EMAIL_VERIFICATION',
        },
      })

      // Create OTP record in database (within transaction)
      const newOtp = await tx.otp.create({
        data: {
          userId,
          email,
          code,
          type: 'EMAIL_VERIFICATION',
          expiresAt: new Date(Date.now() + parseJwtTime(OTP_EXPIRES_IN)),
          attempts: 0,
        },
      })

      return newOtp
    })

    // Send email via Mailtrap (after transaction succeeds)
    await sendOTPEmail(email, code, OTP_EXPIRES_IN)

    return {
      success: true,
      message: 'OTP has been sent to your email',
      expiresIn: OTP_EXPIRES_IN,
    }
  } catch (error: unknown) {
    // Re-throw rate limit errors as-is (will be handled distinctly in endpoint)
    if (error instanceof RateLimitError) {
      throw error
    }

    if (error instanceof Error) {
      throw new Error(error.message || 'Error creating OTP')
    }
    throw new Error('Unknown error when creating OTP')
  }
}

/**
 * Verify OTP and mark email as verified
 * 
 * @param userId - User ID
 * @param code - OTP code entered by user
 * @returns User info with emailVerified = true
 */
export const verifyOTP = async (userId: number, code: string) => {
  try {
    if (!code) {
      throw new Error('OTP code cannot be empty')
    }

    // Find OTP record
    const otp = await prisma.otp.findFirst({
      where: {
        userId,
        code,
        type: 'EMAIL_VERIFICATION',
        usedAt: null, // Not used yet
      },
    })

    if (!otp) {
      throw new Error('Invalid or non-existent OTP code')
    }

    // Check if expired
    if (otp.expiresAt < new Date()) {
      throw new Error('OTP code has expired. Please request a new one')
    }

    // Atomic increment-and-check: increment attempts and check limit in one operation
    // This prevents race condition where concurrent requests bypass the limit
    // Mark OTP as used and update user atomically
    const user = await prisma.$transaction(async (tx) => {
      await tx.otp.update({
        where: { id: otp.id },
        data: {
          usedAt: new Date(),
        },
      })

      return tx.user.update({
        where: { id: userId },
        data: {
          emailVerified: true,
        },
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          emailVerified: true,
        },
      })
    })

    console.log(`[OTP] Email verified for user ${userId}`)

    return {
      success: true,
      message: 'Email verification successful',
      user,
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || 'Error verifying OTP')
    }
    throw new Error('Unknown error when verifying OTP')
  }
}

/**
 * Increment failed OTP attempts
 * Used when user enters wrong code
 * 
 * @param userId - User ID
 */
export const incrementOTPAttempts = async (userId: number) => {
  try {
    const otp = await prisma.otp.findFirst({
      where: {
        userId,
        type: 'EMAIL_VERIFICATION',
        usedAt: null,
      },
    })

    if (otp) {
      await prisma.otp.update({
        where: { id: otp.id },
        data: {
          attempts: otp.attempts + 1,
        },
      })

      console.log(`[OTP] Failed attempt ${otp.attempts + 1} for user ${userId}`)
    }
  } catch (error) {
    console.error('❌ Error incrementing OTP attempts:', error)
  }
}

/**
 * Check if user has pending OTP verification
 * 
 * @param userId - User ID
 * @returns OTP record or null
 */
export const getPendingOTP = async (userId: number) => {
  try {
    const otp = await prisma.otp.findFirst({
      where: {
        userId,
        type: 'EMAIL_VERIFICATION',
        usedAt: null,
      },
    })

    return otp
  } catch (error) {
    console.error('❌ Error getting pending OTP:', error)
    return null
  }
}

/**
 * Check if existing OTP is still valid (not expired)
 * If valid, don't send a new one
 * If expired, create and send new OTP
 * 
 * This prevents spamming the user with emails on every signin attempt
 * Only resend OTP if the previous one has expired
 * 
 * @param userId - User ID
 * @param email - User email
 * @returns Object with { shouldResend: boolean, canResendAt?: Date, message: string }
 */
export const checkAndResendOTP = async (
  userId: number,
  email: string
): Promise<{
  shouldResend: boolean
  canResendAt?: Date
  message: string
  expiresIn?: string
}> => {
  try {
    // Check if there's a pending OTP for this user
    const pendingOTP = await prisma.otp.findFirst({
      where: {
        userId,
        type: 'EMAIL_VERIFICATION',
        usedAt: null,
      },
    })

    // If no pending OTP, create and send new one
    if (!pendingOTP) {
      console.log(`[OTP] No pending OTP for user ${userId}, creating new one`)
      await createAndSendOTP(userId, email)
      return {
        shouldResend: true,
        message: 'OTP has been sent to your email',
        expiresIn: OTP_EXPIRES_IN,
      }
    }

    // Check if existing OTP is expired
    const now = new Date()
    if (pendingOTP.expiresAt < now) {
      // OTP expired, create and send new one
      console.log(`[OTP] Previous OTP for user ${userId} expired, creating new one`)
      await createAndSendOTP(userId, email)
      return {
        shouldResend: true,
        message: 'Previous OTP expired. New OTP has been sent to your email',
        expiresIn: OTP_EXPIRES_IN,
      }
    }

    // OTP is still valid, don't send a new one
    console.log(
      `[OTP] Valid OTP exists for user ${userId}, not resending until expiration`
    )
    return {
      shouldResend: false,
      canResendAt: pendingOTP.expiresAt,
      message: `OTP already sent to your email. Please check your inbox. Can request new OTP after ${pendingOTP.expiresAt.toLocaleString()}`,
    }
  } catch (error: unknown) {
    // Re-throw RateLimitError as-is
    if (error instanceof RateLimitError) {
      throw error
    }
    
    if (error instanceof Error) {
      throw new Error(error.message || 'Error checking OTP')
    }
    throw new Error('Unknown error when checking OTP')
  }
}
