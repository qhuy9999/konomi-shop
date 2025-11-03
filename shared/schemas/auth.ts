import { z } from 'zod'

/**
 * ValidationError class - imported from server utils
 * Thrown when request validation fails against Zod schemas
 */
class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

/**
 * Sign Up Schema - Dùng cho cả Frontend & Backend
 * Frontend: Validate user input trước khi gửi
 * Backend: Validate request body, chống bypass từ Postman/curl
 */
export const signUpSchema = z.object({
  username: z
    .string()
    .min(3, 'Username phải có ít nhất 3 ký tự')
    .max(20, 'Username không được quá 20 ký tự')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username chỉ chứa chữ, số, gạch dưới, gạch ngang'),

  email: z
    .string()
    .email('Email không hợp lệ')
    .min(5, 'Email quá ngắn')
    .max(255, 'Email quá dài')
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .max(128, 'Mật khẩu không được quá 128 ký tự')
    .regex(/[A-Z]/, 'Mật khẩu phải chứa ít nhất 1 chữ hoa')
    .regex(/[a-z]/, 'Mật khẩu phải chứa ít nhất 1 chữ thường')
    .regex(/[0-9]/, 'Mật khẩu phải chứa ít nhất 1 chữ số'),

  firstName: z
    .string()
    .max(50, 'Tên không được quá 50 ký tự')
    .optional()
    .default(''),

  lastName: z
    .string()
    .max(50, 'Họ không được quá 50 ký tự')
    .optional()
    .default(''),
})

export type SignUpRequest = z.infer<typeof signUpSchema>

/**
 * Sign In Schema
 */
export const signInSchema = z.object({
  username: z
    .string()
    .min(3, 'Username phải có ít nhất 3 ký tự')
    .max(20, 'Username không được quá 20 ký tự'),

  password: z
    .string()
    .min(1, 'Mật khẩu không được để trống'),
})

export type SignInRequest = z.infer<typeof signInSchema>

/**
 * Verify OTP Schema
 */
export const verifyOTPSchema = z.object({
  userId: z
    .number()
    .int('User ID phải là số nguyên')
    .positive('User ID phải là số dương'),

  code: z
    .string()
    .length(6, 'OTP phải có đúng 6 chữ số')
    .regex(/^\d+$/, 'OTP chỉ chứa chữ số'),
})

export type VerifyOTPRequest = z.infer<typeof verifyOTPSchema>

/**
 * Resend OTP Schema
 */
export const resendOTPSchema = z.object({
  userId: z
    .number()
    .int('User ID phải là số nguyên')
    .positive('User ID phải là số dương'),
})

export type ResendOTPRequest = z.infer<typeof resendOTPSchema>

/**
 * Generic Validation Helper - Dùng cho tất cả schemas
 * @param schema - Zod schema để validate
 * @param data - Dữ liệu cần validate
 * @returns Validated data nếu hợp lệ
 * @throws ValidationError với chi tiết validation nếu không hợp lệ
 */
export const validateRequest = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  const result = schema.safeParse(data)

  if (!result.success) {
    const errors = result.error.issues
      .map((issue: z.ZodIssue) => {
        const path = issue.path.join('.') || 'root'
        return `${path}: ${issue.message}`
      })
      .join('; ')

    throw new ValidationError(`Validation failed: ${errors}`)
  }

  return result.data
}
