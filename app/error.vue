<script setup lang="ts">
import type { NuxtError } from '#app'

interface ErrorData {
  message?: string
  [key: string]: any
}

interface CustomNuxtError extends NuxtError {
  data?: ErrorData
}

const props = defineProps({
  error: Object as () => CustomNuxtError,
})

// Check if development mode (simple approach)
const isDev = typeof window !== 'undefined' && window.location?.hostname === 'localhost'

const handleReset = () => {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-red-600 mb-2">
          {{ error?.statusCode }}
        </h1>
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">
          {{ error?.statusMessage || 'Lỗi' }}
        </h2>

        <!-- Display custom message if available -->
        <div v-if="error?.data" class="text-gray-600 mb-6">
          <p>{{ error.data.message || 'Đã xảy ra lỗi. Vui lòng thử lại.' }}</p>
        </div>

        <!-- Error details for debugging (dev only) -->
        <details v-if="isDev" class="text-left mb-6">
          <summary class="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
            Chi tiết lỗi
          </summary>
          <pre class="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">{{ error }}</pre>
        </details>

        <!-- Actions -->
        <div class="flex gap-4">
          <button
            @click="handleReset"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Quay lại trang chủ
          </button>
          <NuxtLink
            to="/"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition text-center"
          >
            Home
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
