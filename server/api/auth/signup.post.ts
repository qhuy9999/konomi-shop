import { signUp } from '../../services/auth.service'
import { signUpSchema, validateRequest } from '../../../shared/schemas/auth'
import { defineEventHandler, readBody, createError } from 'h3'

/**
 * ValidationError class - same as in shared/schemas/auth
 * Used to distinguish validation errors from other errors
 * Returns 400 Bad Request instead of 500 Internal Server Error
 */
class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export default defineEventHandler(async (event) => {
  try {
    // Đọc request body
    let body
    try {
      body = await readBody(event)
    } catch {
      throw new Error('Invalid JSON format in request body')
    }

    // Validate request body với Zod schema
    // - Kiểm tra required fields
    // - Kiểm tra format (email, password strength, etc)
    // - Sanitize & coerce dữ liệu
    const validatedData = validateRequest(signUpSchema, body)

    // Gọi sign up service với dữ liệu đã validate
    const result = await signUp(validatedData)

    return {
      statusCode: 201,
      ...result,
    }
  } catch (error: unknown) {
    // Determine status code based on error type
    let statusCode = 500
    let message = 'Sign up failed'

    // Validation errors → 400 Bad Request
    if (error instanceof ValidationError) {
      statusCode = 400
      message = error.message
    }
    // JSON parse errors → 400 Bad Request
    else if (error instanceof SyntaxError) {
      statusCode = 400
      message = 'Invalid JSON format in request body'
    }
    // Other known errors with messages → 500 Internal Server Error
    else if (error instanceof Error) {
      statusCode = 500
      message = error.message
    }
    // Unknown errors → 500 Internal Server Error
    else {
      statusCode = 500
      message = 'An unexpected error occurred'
    }

    throw createError({
      statusCode,
      message,
    })
  }
})
