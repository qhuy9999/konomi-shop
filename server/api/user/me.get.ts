/**
 * GET /api/user/me
 * 
 * Get current user information from JWT token
 * Auth middleware will run first and set event.context.user
 * 
 * @returns { user: AuthUser }
 */
export default defineEventHandler(async (event) => {
  try {
    // ✅ Middleware đã verify token và set user vào context
    const user = event.context.user

    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized - User not found in context',
      })
    }

    return {
      statusCode: 200,
      success: true,
      user,
    }
  } catch (error: unknown) {
    console.error('❌ Error when calling getMe:', error)

    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: 'Unknown error while fetching user information',
    })
  }
})
