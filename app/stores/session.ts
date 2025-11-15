/**
 * Session Store (Pinia)
 * Manages session UI state: loading, errors, modals, etc
 * NOT persisted (cleared on page reload)
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface AuthError {
  field?: string
  message: string
  code?: string
}

export const useSessionStore = defineStore('session', () => {
  // ============ Auth Modal State ============

  // Current page in auth modal (signin, signup, otp-verify, forgot-password, reset-password, verify-otp-email)
  const authModalPage = ref<'signin' | 'signup' | 'otp-verify' | 'forgot-password' | 'reset-password' | 'verify-otp-email'>('signin')

  // Pending user ID for OTP verification (after signup)
  const pendingUserId = ref<number | null>(null)
  const pendingEmail = ref<string | null>(null)

  // Loading state during auth submission
  const isAuthLoading = ref(false)

  // Show address fields in signup form
  const showAddressFields = ref(false)

  // ============ Error State ============

  // Signin errors
  const signInErrors = ref<Record<string, AuthError>>({
    username: { message: '' },
    password: { message: '' },
    general: { message: '' },
  })

  // Signup errors
  const signUpErrors = ref<Record<string, AuthError>>({
    username: { message: '' },
    email: { message: '' },
    password: { message: '' },
    firstName: { message: '' },
    lastName: { message: '' },
    phoneNumber: { message: '' },
    general: { message: '' },
  })

  // ============ Actions ============

  /**
   * Set signin page
   */
  const goToSignIn = () => {
    authModalPage.value = 'signin'
    clearSignUpErrors()
  }

  /**
   * Set signup page
   */
  const goToSignUp = () => {
    authModalPage.value = 'signup'
    clearSignInErrors()
  }

  /**
   * Toggle address fields visibility
   */
  const toggleAddressFields = () => {
    showAddressFields.value = !showAddressFields.value
  }

  /**
   * Set auth loading state
   */
  const setAuthLoading = (loading: boolean) => {
    isAuthLoading.value = loading
  }

  /**
   * Set signin error for a field
   */
  const setSignInError = (field: string, message: string) => {
    if (!signInErrors.value[field]) {
      signInErrors.value[field] = { message: '' }
    }
    signInErrors.value[field].message = message
  }

  /**
   * Clear signin errors
   */
  const clearSignInErrors = () => {
    Object.keys(signInErrors.value).forEach(key => {
      const error = signInErrors.value[key]
      if (error) {
        error.message = ''
      }
    })
  }

  /**
   * Set signup error for a field
   */
  const setSignUpError = (field: string, message: string) => {
    if (!signUpErrors.value[field]) {
      signUpErrors.value[field] = { message: '' }
    }
    signUpErrors.value[field].message = message
  }

  /**
   * Clear signup errors
   */
  const clearSignUpErrors = () => {
    Object.keys(signUpErrors.value).forEach(key => {
      const error = signUpErrors.value[key]
      if (error) {
        error.message = ''
      }
    })
  }

  /**
   * Clear all auth errors
   */
  const clearAllAuthErrors = () => {
    clearSignInErrors()
    clearSignUpErrors()
  }

  /**
   * Reset auth modal state
   * Called when auth completes or user closes modal
   */
  const resetAuthModal = () => {
    authModalPage.value = 'signin'
    showAddressFields.value = false
    clearAllAuthErrors()
    isAuthLoading.value = false
    pendingUserId.value = null
    pendingEmail.value = null
  }

  /**
   * Close OTP modal but keep pending data
   * So user can reopen modal if they accidentally closed it
   */
  const closeOTPModal = () => {
    authModalPage.value = 'signin'
    clearAllAuthErrors()
    isAuthLoading.value = false
    // DON'T clear pendingUserId and pendingEmail
  }

  // ============ OTP Verification Actions ============

  /**
   * Set auth modal page (for direct page setting)
   */
  const setAuthModalPage = (page: 'signin' | 'signup' | 'otp-verify' | 'forgot-password' | 'reset-password' | 'verify-otp-email') => {
    authModalPage.value = page
  }

  /**
   * Go to OTP verification page
   */
  const goToOTPVerify = (userId: number, email: string) => {
    authModalPage.value = 'otp-verify'
    pendingUserId.value = userId
    pendingEmail.value = email
    clearAllAuthErrors()
  }

  // ============ Forgot Password Actions ============

  /**
   * Go to forgot password page
   */
  const goToForgotPassword = () => {
    authModalPage.value = 'forgot-password'
    clearAllAuthErrors()
  }

  /**
   * Go to reset password page
   */
  const goToResetPassword = (email: string) => {
    authModalPage.value = 'reset-password'
    pendingEmail.value = email
    clearAllAuthErrors()
  }

  return {
    // State
    authModalPage,
    isAuthLoading,
    showAddressFields,
    signInErrors,
    signUpErrors,
    pendingUserId,
    pendingEmail,

    // Actions
    goToSignIn,
    goToSignUp,
    toggleAddressFields,
    setAuthLoading,
    setSignInError,
    clearSignInErrors,
    setSignUpError,
    clearSignUpErrors,
    clearAllAuthErrors,
    setAuthModalPage,
    goToOTPVerify,
    goToForgotPassword,
    goToResetPassword,
    resetAuthModal,
    closeOTPModal,
  }
})
