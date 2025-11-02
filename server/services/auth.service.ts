import prisma from '@@/prisma/prisma'
import * as argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { parseJwtTime } from '../utils/jwtTime'
import { createAndSendOTP, checkAndResendOTP } from './otp.service'

// Load từ .env
const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m'
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d'

interface SignUpInput {
  username: string
  password: string
  email: string
  firstName: string
  lastName: string
}

interface SignInInput {
  username: string
  password: string
}

// === SIGN UP ===
export const signUp = async (data: SignUpInput) => {
  try {
    // Validate input
    if (!data.username || !data.password || !data.email || !data.firstName || !data.lastName) {
      throw new Error('Missing username, password, email, firstName, and lastName')
    }

    // Check username exists
    const duplicate = await prisma.user.findUnique({
      where: { username: data.username },
    })

    if (duplicate) {
      throw new Error('Username already exists')
    }

    // Check email exists
    const emailExists = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (emailExists) {
      throw new Error('Email already exists')
    }

    // Hash password
    const hashedPassword = await argon2.hash(data.password, {
      type: argon2.argon2id,
      memoryCost: 4096,
      timeCost: 3,
    });

    // Create user (emailVerified = false by default)
    const user = await prisma.user.create({
      data: {
        username: data.username,
        password: hashedPassword,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        emailVerified: false, // Start as unverified
      },
    })

    // Create and send OTP
    await createAndSendOTP(user.id, user.email)

    return {
      success: true,
      message: 'Sign up successful. Please check your email to verify',
      userId: user.id,
      email: user.email,
      requiresEmailVerification: true,
      user: {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      emailVerified: false,
      },
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || 'Error occurred during sign up')
    }
    throw new Error('Unknown error occurred during sign up')
  }
}

// === SIGN IN ===
export const signIn = async (data: SignInInput) => {
  try {
    // Validate input
    if (!data.username || !data.password) {
      throw new Error('Missing username or password')
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { username: data.username },
    })

    if (!user) {
      throw new Error('User not found')
    }

    // Check if email is verified
    if (!user.emailVerified) {
      // Check if we should resend OTP or if one is already valid
      const otpCheckResult = await checkAndResendOTP(user.id, user.email)
      
      return {
        success: false,
        message: otpCheckResult.message,
        requiresEmailVerification: true,
        userId: user.id,
        email: user.email,
        resendOTP: otpCheckResult.shouldResend,
        canResendAt: otpCheckResult.canResendAt,
      }
    }

    // Verify password
    const passwordCorrect = await argon2.verify(user.password, data.password)

    if (!passwordCorrect) {
      throw new Error('Username or password is incorrect')
    }

    // Create access token
    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_ACCESS_SECRET as string,
      { expiresIn: JWT_ACCESS_EXPIRES_IN } as jwt.SignOptions
    )

    // Create refresh token
    const refreshToken = crypto.randomBytes(64).toString('hex')

    // Create session
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + parseJwtTime(JWT_REFRESH_EXPIRES_IN)),
      },
    })

    return {
      success: true,
      message: `User ${user.firstName} ${user.lastName} has logged in!`,
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || 'Error occurred during sign in')
    }
    throw new Error('Unknown error occurred during sign in')
  }
}

// === SIGN OUT ===
export const signOut = async (refreshToken: string) => {
  try {
    if (!refreshToken) {
      throw new Error('Refresh token is required')
    }

    // Delete session
    await prisma.session.deleteMany({
      where: { refreshToken },
    })

    return {
      success: true,
      message: 'Logged out successfully',
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || 'Error occurred during sign out')
    }
    throw new Error('Unknown error occurred during sign out')
  }
}

// === REFRESH TOKEN ===
export const refreshTokenService = async (token: string) => {
  try {
    if (!token) {
      throw new Error('Refresh token is required')
    }

    // Get session
    const session = await prisma.session.findUnique({
      where: { refreshToken: token },
    })

    if (!session) {
      throw new Error('Invalid or expired token')
    }

    // Check expiration
    if (session.expiresAt < new Date()) {
      await prisma.session.delete({
        where: { id: session.id },
      })
      throw new Error('Token has expired')
    }

    // Create new access token
    const accessToken = jwt.sign(
      { userId: session.userId },
      process.env.JWT_ACCESS_SECRET as string,  // ✅ Fix env variable name
      { expiresIn: JWT_ACCESS_EXPIRES_IN } as jwt.SignOptions  // ✅ Use correct constant
    )

    return {
      success: true,
      accessToken,
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || 'Error occurred during token refresh')
    }
    throw new Error('Unknown error occurred during token refresh')
  }
}