import nodemailer from 'nodemailer'

/**
 * Mailtrap SMTP Configuration
 * 
 * Get credentials from: https://mailtrap.io/
 * 1. Login to Mailtrap
 * 2. Go to Email Testing → Inboxes
 * 3. Click on your inbox
 * 4. Go to Integrations → Nodemailer
 * 5. Copy Host, Port, User, Password
 */

// Cached transporter instance
let cachedTransporter: nodemailer.Transporter | null = null

/**
 * Get or create nodemailer transporter with lazy initialization
 * Calls useRuntimeConfig() inside function (not at module level)
 * Caches transporter after first initialization
 */
const getTransporter = () => {
  if (cachedTransporter) {
    return cachedTransporter
  }

  const config = useRuntimeConfig()

  cachedTransporter = nodemailer.createTransport({
    host: config.nodemailer.host || 'smtp.mailtrap.io',
    port: config.nodemailer.port || 2525,
    auth: {
      user: config.nodemailer.auth.user,
      pass: config.nodemailer.auth.pass,
    },
  })

  return cachedTransporter
}

/**
 * Send OTP verification email
 * 
 * @param toEmail - Recipient email
 * @param otp - 6-digit OTP code
 * @param expiresIn - Expiration time (e.g., "5m")
 */
export const sendOTPEmail = async (
  toEmail: string,
  otp: string,
  expiresIn: string
) => {
  try {
    const config = useRuntimeConfig()
    const transporter = getTransporter()

    const mailOptions = {
      from: config.nodemailer.from,
      to: toEmail,
      subject: '[Konomi Shop] Verify your email',
      html: generateOTPEmailTemplate(otp, expiresIn),
    }

    const result = await transporter.sendMail(mailOptions)

    console.log(`✅ Email sent successfully`)
    console.log(`📧 Message ID: ${result.messageId}`)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('❌ Error sending OTP email:', error)
    throw new Error('Error sending OTP email')
  }
}

/**
 * HTML template for OTP email
 */
const generateOTPEmailTemplate = (otp: string, expiresIn: string): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
        }
        .header {
          text-align: center;
          padding: 20px 0;
          border-bottom: 3px solid #007bff;
        }
        .header h1 {
          color: #007bff;
          margin: 0;
          font-size: 28px;
        }
        .content {
          background-color: white;
          padding: 30px;
          margin: 20px 0;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .otp-section {
          text-align: center;
          margin: 30px 0;
        }
        .otp-code {
          font-size: 36px;
          font-weight: bold;
          color: #007bff;
          letter-spacing: 5px;
          background-color: #f0f0f0;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          font-family: 'Courier New', monospace;
        }
        .expires-info {
          font-size: 14px;
          color: #666;
          margin-top: 20px;
        }
        .warning {
          background-color: #fff3cd;
          border: 1px solid #ffc107;
          color: #856404;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
          font-size: 13px;
        }
        .footer {
          text-align: center;
          padding: 20px;
          border-top: 1px solid #eee;
          font-size: 12px;
          color: #999;
        }
        .btn {
          display: inline-block;
          padding: 12px 30px;
          background-color: #007bff;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🛍️ Konomi Shop</h1>
        </div>

        <div class="content">
          <h2>Verify Your Email</h2>
          
          <p>Hello,</p>
          
          <p>Thank you for signing up for Konomi Shop. To complete your registration, please verify your email using the OTP code below:</p>

          <div class="otp-section">
            <p>Your OTP code is:</p>
            <div class="otp-code">${otp}</div>
            <div class="expires-info">
              ⏰ This code will expire in <strong>${expiresIn}</strong>
            </div>
          </div>

          <div class="warning">
            <strong>⚠️ Important Notice:</strong>
            <ul>
              <li>Do not share this OTP code with anyone</li>
              <li>Konomi Shop will never request OTP via email</li>
              <li>Konomi Shop will never ask you to provide your OTP via email or phone</li>            </ul>
          </div>

          <p>If you encounter any issues, please contact us at:</p>
          <p>
            📧 Email: <a href="mailto:support@konomi-shop.com">support@konomi-shop.com</a><br>
            🌐 Website: <a href="https://konomi-shop.com">konomi-shop.com</a>
          </p>
        </div>

        <div class="footer">
          <p>&copy; 2025 Konomi Shop. All rights reserved.</p>
          <p>This is an automated email, please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Send password reset email (for future use)
 */
export const sendPasswordResetEmail = async (
  toEmail: string,
  resetToken: string
) => {
  try {
    const config = useRuntimeConfig()
    const transporter = getTransporter()

    // Get app URL from runtime config (consistent with runtime loading)
    const appUrl = config.public.appUrl || config.public.NUXT_PUBLIC_APP_URL
    if (!appUrl) {
      throw new Error('APP_URL (public.appUrl) is not defined in runtime config')
    }

    const resetLink = `${appUrl}/reset-password?token=${resetToken}`

    const mailOptions = {
      from: config.nodemailer.from,
      to: toEmail,
      subject: '[Konomi Shop] Reset your password',
      html: `
      <p>Please click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      `,
    }

    const result = await transporter.sendMail(mailOptions)
    console.log(`✅ Password reset email sent successfully`)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('❌ Error sending password reset email:', error)
    throw new Error('Error sending password reset email')
  }
}

/**
 * Verify Mailtrap connection (health check)
 */
export const verifyMailtrapConnection = async () => {
  try {
    const transporter = getTransporter()
    await transporter.verify()
    console.log('✅ Mailtrap connection verified')
    return { success: true, message: 'Connected to Mailtrap' }
  } catch (error) {
    console.error('❌ Mailtrap connection failed:', error)
    throw new Error('Unable to connect to Mailtrap')
  }
}
