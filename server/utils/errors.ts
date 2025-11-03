/**
 * Custom Error Classes for better error handling & type safety
 */

/**
 * ValidationError - thrown when request validation fails
 * Used by validateRequest() helper from shared/schemas/auth
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

/**
 * AuthError - thrown by auth service for auth-related failures
 * e.g., invalid credentials, user already exists
 */
export class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthError'
  }
}

/**
 * DatabaseError - thrown for database operation failures
 */
export class DatabaseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DatabaseError'
  }
}

/**
 * RateLimitError - thrown when rate limit exceeded
 * Used by otp.service.ts for OTP rate limiting
 */
export class RateLimitError extends Error {
  retryAfterSeconds: number

  constructor(message: string, retryAfterSeconds: number = 60) {
    super(message)
    this.name = 'RateLimitError'
    this.retryAfterSeconds = retryAfterSeconds
  }
}
