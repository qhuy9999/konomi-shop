import prisma from '@@/prisma/prisma'

export default defineNitroPlugin((nitroApp) => {
  console.log('[PLUGIN] Session cleanup scheduler initialized')

  let intervalId: NodeJS.Timeout | null = null

  // Cleanup function
  const cleanupExpiredSessions = async () => {
    try {
      const now = new Date()
      const result = await prisma.session.deleteMany({
        where: {
          expiresAt: {
            lt: now, // less than now = expired
          },
        },
      })

      if (result.count > 0) {
        console.log(`[CLEANUP] Deleted ${result.count} expired sessions at ${now.toISOString()}`)
      }
    } catch (error) {
      console.error('[CLEANUP] Error deleting expired sessions:', error)
    }
  }

  // Helper function để start cleanup scheduler
  const startCleanupScheduler = async () => {
    try {
      // Chạy cleanup ngay lần đầu (với delay để Prisma connect xong)
      setTimeout(async () => {
        await cleanupExpiredSessions()
      }, 2000) // 2 giây delay

      // Schedule cleanup mỗi 1 giờ (3600000ms)
      intervalId = setInterval(async () => {
        await cleanupExpiredSessions()
      }, 60 * 60 * 1000) // 1 hour

      console.log('[CLEANUP] Scheduler started successfully')
    } catch (error) {
      console.error('[CLEANUP] Error starting scheduler:', error)
    }
  }

  // Start scheduler khi plugin load xong
  startCleanupScheduler()

  // Cleanup interval khi server shutdown
  nitroApp.hooks.hook('close', async () => {
    if (intervalId) {
      clearInterval(intervalId)
    }
    console.log('[CLEANUP] Session cleanup scheduler stopped')
  })
})