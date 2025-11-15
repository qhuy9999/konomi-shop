/**
 * Auth Store (Pinia)
 * Manages authentication state: tokens, user data, auth status
 * Persists to localStorage for session survival
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // ============ State ============

  // Token state
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)

  // User state
  const currentUser = ref<{
    id: number
    username: string
    email: string
    firstName: string
    lastName: string
    emailVerified: boolean
    phone?: string
    billingStreet?: string
    billingCity?: string
    billingProvince?: string
    billingZipCode?: string
    billingCountry?: string
    deliveryStreet?: string
    deliveryCity?: string
    deliveryProvince?: string
    deliveryZipCode?: string
    deliveryCountry?: string
  } | null>(null)

  // ============ Computed ============

  const isAuthenticated = computed(() => !!accessToken.value)

  const isEmailVerified = computed(() => currentUser.value?.emailVerified ?? false)

  // ============ Private Helpers ============

  /**
   * Load tokens from localStorage
   * Called on app initialization
   */
  const loadTokensFromStorage = () => {
    if (typeof window === 'undefined') return

    const token = localStorage.getItem('auth_token')
    const rToken = localStorage.getItem('refresh_token')

    if (token) {
      accessToken.value = token
    }
    if (rToken) {
      refreshToken.value = rToken
    }
  }

  /**
   * Load user from localStorage
   * Called on app initialization
   */
  const loadUserFromStorage = () => {
    if (typeof window === 'undefined') return

    const userStr = localStorage.getItem('current_user')
    if (userStr) {
      try {
        currentUser.value = JSON.parse(userStr)
      } catch {
        console.error('Failed to parse current user from storage')
        localStorage.removeItem('current_user')
      }
    }
  }

  /**
   * Persist tokens to localStorage
   */
  const persistTokens = () => {
    if (typeof window === 'undefined') return

    if (accessToken.value) {
      localStorage.setItem('auth_token', accessToken.value)
    }
    if (refreshToken.value) {
      localStorage.setItem('refresh_token', refreshToken.value)
    }
  }

  /**
   * Persist user to localStorage
   */
  const persistUser = () => {
    if (typeof window === 'undefined') return

    if (currentUser.value) {
      localStorage.setItem('current_user', JSON.stringify(currentUser.value))
    }
  }

  /**
   * Clear all storage
   */
  const clearStorage = () => {
    if (typeof window === 'undefined') return

    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('current_user')
  }

  // ============ Public Actions ============

  /**
   * Set tokens after successful login
   * @param token - Access token (JWT)
   * @param rToken - Refresh token
   */
  const setTokens = (token: string, rToken?: string) => {
    accessToken.value = token
    if (rToken) {
      refreshToken.value = rToken
    }
    persistTokens()
  }

  /**
   * Set current user after login
   */
  const setCurrentUser = (user: any) => {
    currentUser.value = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      emailVerified: user.emailVerified ?? false,
    }
    persistUser()
  }

  /**
   * Update user email verification status
   */
  const verifyEmail = () => {
    if (currentUser.value) {
      currentUser.value.emailVerified = true
      persistUser()
    }
  }

  /**
   * Initialize auth state on app startup
   * Load from localStorage
   */
  const initialize = () => {
    loadTokensFromStorage()
    loadUserFromStorage()
  }

  /**
   * Logout - clear all auth data
   */
  const logout = () => {
    accessToken.value = null
    refreshToken.value = null
    currentUser.value = null
    clearStorage()
  }

  /**
   * Refresh access token
   * Called when token expires
   */
  const refreshAccessToken = async (newToken: string) => {
    accessToken.value = newToken
    persistTokens()
  }

  /**
   * Update user profile
   * Used when user updates their info
   */
  const updateUserProfile = (updates: Partial<typeof currentUser.value>) => {
    if (currentUser.value) {
      currentUser.value = {
        ...currentUser.value,
        ...updates,
      }
      persistUser()
    }
  }

  return {
    // State
    accessToken,
    refreshToken,
    currentUser,

    // Computed
    isAuthenticated,
    isEmailVerified,

    // Actions
    setTokens,
    setCurrentUser,
    verifyEmail,
    initialize,
    logout,
    refreshAccessToken,
    updateUserProfile,

    // Private (for testing)
    loadTokensFromStorage,
    loadUserFromStorage,
  }
})
