import { signOut } from '@@/server/services/auth.service'
import { defineEventHandler, getCookie, deleteCookie, createError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    // Lấy refresh token từ cookie
    const refreshToken = getCookie(event, 'refreshToken')
    
    if (!refreshToken) {
      throw createError({
        statusCode: 400,
        message: 'Refresh token not found',
      })
    }

    // Gọi service để xóa session
    const result = await signOut(refreshToken)

    // Xóa cookie
    deleteCookie(event, 'refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    })

    return {
      statusCode: 200,
      success: true,
      message: result.message,
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw createError({
        statusCode: 400,
        message: error.message || 'Error signing out',
      })
    }
    throw createError({
      statusCode: 500,
      message: 'Unknown error while signing out',
    })
  }
})