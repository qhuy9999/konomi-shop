/**
 * server/plugins/verify-mailtrap.ts
 * 
 * Verify Mailtrap connection khi server start
 */

import { verifyMailtrapConnection } from '../services/email.service'

export default defineNitroPlugin(async () => {
  if (process.env.NODE_ENV === 'development') {
    try {
      console.log('📧 Verifying Mailtrap connection...')
      await verifyMailtrapConnection()
      console.log('✅ Mailtrap is ready for sending emails')
    } catch (error) {
      console.error('❌ Mailtrap connection failed:', error)
      console.warn('⚠️  Email sending is disabled. Check your .env configuration.')
    }
  }
})
