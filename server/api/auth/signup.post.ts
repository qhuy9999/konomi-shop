import { signUp } from '../../services/auth.service'
import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const result = await signUp(body)

    return {
      statusCode: 201,
      ...result,
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw createError({
        statusCode: 400,
        message: error.message,
      })
    }
    throw createError({
      statusCode: 400,
      message: 'Sign up failed',
    })
  }
})
