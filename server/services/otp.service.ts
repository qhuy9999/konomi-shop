import prisma from '@@/prisma/prisma'
import crypto from 'crypto'
import { parseJwtTime } from '../utils/jwtTime'
import { sendOTPEmail } from './email.service'

const OTP_EXPIRES_IN = process.env.OTP_EXPIRES_IN || '5m'
const OTP_MAX_ATTEMPTS = parseInt(process.env.OTP_MAX_ATTEMPTS || '3')

/**
 * Generate 6-digit random OTP
 */
export const generateOTP = (): string => {
  return crypto.randomInt(100000, 999999).toString()
}

/**
 * Create and send OTP for email verification
 * 
 * @param userId - User ID
 * @param email - User email
 * @returns Success message and expiration time
 */
export const createAndSendOTP = async (userId: number, email: string) => {
  try {
    // Delete old OTPs for this user
    await prisma.otp.deleteMany({
      where: {
        userId,
        type: 'EMAIL_VERIFICATION',
      },
    })

    // Generate new OTP code
    const code = generateOTP()

    // Create OTP record in database
    const otp = await prisma.otp.create({
      data: {
        userId,
        email,
        code,
        type: 'EMAIL_VERIFICATION',
        expiresAt: new Date(Date.now() + parseJwtTime(OTP_EXPIRES_IN)),
        attempts: 0,
      },
    })

    console.log(`[OTP] Generated OTP for user ${userId}: ${code}`)

    // Send email via Mailtrap
    await sendOTPEmail(email, code, OTP_EXPIRES_IN)

    return {
      success: true,
      message: 'OTP has been sent to your email',
      expiresIn: OTP_EXPIRES_IN,
    }
  } catch (error: unknown) {
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

    // Check max attempts
    if (otp.attempts >= OTP_MAX_ATTEMPTS) {
      throw new Error(`You have entered the wrong code too many times (${OTP_MAX_ATTEMPTS}). Please request a new OTP`)
    }

    // Mark OTP as used
    await prisma.otp.update({
      where: { id: otp.id },
      data: {
        usedAt: new Date(),
      },
    })

    // Update user - set emailVerified to true
    const user = await prisma.user.update({
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
    if (error instanceof Error) {
      throw new Error(error.message || 'Error checking OTP')
    }
    throw new Error('Unknown error when checking OTP')
  }
}
