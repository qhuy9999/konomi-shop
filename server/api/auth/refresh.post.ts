import { refreshTokenService } from '@@/server/services/auth.service'
import { defineEventHandler, getCookie, createError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    // Lấy refresh token từ cookie
    const refreshToken = getCookie(event, 'refreshToken')

    if (!refreshToken) {
      throw createError({
        statusCode: 401,
        message: 'Refresh token not found',
      })
    }

    // Tạo access token mới
    const result = await refreshTokenService(refreshToken)

    return {
      statusCode: 200,
      success: true,
      accessToken: result.accessToken,
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw createError({
        statusCode: 401,
        message: error.message || 'Error refreshing token',
      })
    }
    throw createError({
      statusCode: 500,
      message: 'Unknown error while refreshing token',
    })
  }
})