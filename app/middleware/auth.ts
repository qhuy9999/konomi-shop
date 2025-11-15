import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import type { RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

/**
 * Middleware để kiểm tra auth status
 * Cung cấp isAuthenticated flag cho pages
 */
export default defineNuxtRouteMiddleware((to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  const authStore = useAuthStore()
  
  // Expose auth status để pages có thể sử dụng
  // Pages sẽ sử dụng: const authStore = useAuthStore(); authStore.accessToken
})
