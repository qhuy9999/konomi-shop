import jwt from 'jsonwebtoken'
import { defineEventHandler, createError, getHeader } from 'h3'
import prisma from '../../prisma/prisma'

interface DecodedToken {
  userId: number
  iat?: number
  exp?: number
}

export interface AuthUser {
  id: number
  username: string
  email: string
  firstName: string | null
  lastName: string | null
}

/**
 * Global Auth Middleware
 * 
 * Runs automatically for routes matching the pattern
 * - /api/user/** (user endpoints)
 * - /api/admin/** (admin endpoints)
 * - /api/seller/** (seller endpoints)
 * 
 * Other routes are not affected (signup, signin, public, etc.)
 */
export default defineEventHandler(async (event) => {
  const path = event.node.req.url || ''

  // ✅ Apply middleware chỉ cho protected routes
  const protectedPaths = [
    '/api/user',
    '/api/admin',
    '/api/seller',
    '/api/products/create',
    '/api/products/update',
  ]

  const isProtectedRoute = protectedPaths.some((route) => path.startsWith(route))

  if (!isProtectedRoute) {
    // Skip middleware cho public routes
    return
  }

  try {
    // 1. Lấy token từ Authorization header
    const authHeader = getHeader(event, 'authorization')

    if (!authHeader) {
      throw createError({
        statusCode: 401,
        message: 'Access token not found',
      })
    }

    // 2. Parse "Bearer <token>"
    const token = authHeader.split(' ')[1]

    if (!token) {
      throw createError({
        statusCode: 401,
        message: 'Invalid Authorization header format (Bearer <token>)',
      })
    }

    // 3. Verify JWT token
    let decodedToken: DecodedToken
    try {
      decodedToken = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET as string
      ) as DecodedToken
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw createError({
          statusCode: 403,
          message: 'Access token has expired',
        })
      }
      throw createError({
        statusCode: 403,
        message: 'Access token is invalid',
      })
    }

    if (!decodedToken.userId) {
      throw createError({
        statusCode: 401,
        message: 'Token does not contain userId',
      })
    }

    // 4. Lấy user từ database
    const user = await prisma.user.findUnique({
      where: { id: decodedToken.userId },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    })

    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'User not found',
      })
    }

    // 5. Attach user vào event context
    event.context.user = user as AuthUser

  } catch (error: unknown) {
    // Re-throw if already a createError
    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    console.error('🔐 Auth middleware error:', error)
    throw createError({
      statusCode: 500,
      message: 'Unknown error while verifying token',
    })
  }
})
