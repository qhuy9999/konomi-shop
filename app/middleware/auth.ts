import { defineNuxtRouteMiddleware } from '#app'
import type { RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

/**
 * Middleware để kiểm tra auth status
 * Cung cấp isAuthenticated flag cho pages
 */
export default defineNuxtRouteMiddleware((to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  // Store access là an toàn ở đây (callback context)
  const authStore = useAuthStore()
  
  // Không cần làm gì, chỉ expose store access cho pages
  // Pages sẽ sử dụng: const authStore = useAuthStore(); authStore.accessToken
})
