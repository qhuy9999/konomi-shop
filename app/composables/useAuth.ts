/**
 * useAuth composable
 * Manages authentication state, tokens, and user data
 * Supports both client-side and server-side rendering
 */

import { ref, computed } from 'vue'

// Auth state
const authToken = ref<string | null>(null)
const refreshToken = ref<string | null>(null)
const currentUser = ref<any>(null)
const isAuthenticated = computed(() => !!authToken.value)

/**
 * Store auth tokens in localStorage (client-side only)
 */
const storeTokens = (accessToken: string, refreshTkn?: string) => {
  if (typeof window === 'undefined') return

  authToken.value = accessToken
  localStorage.setItem('auth_token', accessToken)

  if (refreshTkn) {
    refreshToken.value = refreshTkn
    localStorage.setItem('refresh_token', refreshTkn)
  }
}

/**
 * Load auth tokens from localStorage
 */
const loadTokens = () => {
  if (typeof window === 'undefined') return

  const token = localStorage.getItem('auth_token')
  const rToken = localStorage.getItem('refresh_token')

  if (token) {
    authToken.value = token
  }
  if (rToken) {
    refreshToken.value = rToken
  }
}

/**
 * Store current user data
 */
const setCurrentUser = (user: any) => {
  currentUser.value = user
  if (typeof window !== 'undefined') {
    localStorage.setItem('current_user', JSON.stringify(user))
  }
}

/**
 * Load current user from localStorage
 */
const loadCurrentUser = () => {
  if (typeof window === 'undefined') return

  const userStr = localStorage.getItem('current_user')
  if (userStr) {
    try {
      currentUser.value = JSON.parse(userStr)
    } catch {
      console.error('Failed to parse current user')
    }
  }
}

/**
 * Clear all auth data
 */
const clearAuth = () => {
  authToken.value = null
  refreshToken.value = null
  currentUser.value = null

  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('current_user')
  }
}

/**
 * Initialize auth state on mount
 */
const initializeAuth = () => {
  loadTokens()
  loadCurrentUser()
}

export const useAuth = () => {
  return {
    // State
    authToken,
    refreshToken,
    currentUser,
    isAuthenticated,

    // Methods
    storeTokens,
    loadTokens,
    setCurrentUser,
    loadCurrentUser,
    clearAuth,
    initializeAuth,
  }
}
