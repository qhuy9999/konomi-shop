import jwt from 'jsonwebtoken'
import type { H3Event } from 'h3'

/**
 * Extract user info from JWT token in Authorization header
 */
export const getUserFromToken = async (event: H3Event) => {
  try {
    // Get token from Authorization header
    const authHeader = getHeader(event, 'authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.slice(7)
    const secret = process.env.JWT_ACCESS_SECRET

    if (!secret) {
      console.error('JWT_ACCESS_SECRET not configured')
      return null
    }

    // Verify and decode token
    const decoded = jwt.verify(token, secret) as { userId: number }
    return { id: decoded.userId }
  } catch (error) {
    console.error('Invalid token:', error instanceof Error ? error.message : 'Unknown error')
    return null
  }
}
