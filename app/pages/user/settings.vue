<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <div class="min-h-screen bg-linear-to-b from-neutral-50 to-neutral-100 py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-neutral-900 mb-2">Cài Đặt</h1>
        <p class="text-neutral-600">Quản lý các tùy chọn cá nhân của bạn</p>
      </div>

      <div class="bg-white rounded-2xl shadow-lg p-12 text-center">
        <div class="mb-6">
          <svg class="w-24 h-24 mx-auto text-neutral-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-neutral-900 mb-2">Cài Đặt Sắp Có</h2>
        <p class="text-neutral-600 mb-6">Tính năng cài đặt đang được phát triển. Vui lòng quay lại sau!</p>
        <NuxtLink to="/user/profile" class="inline-block px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors">
          Quay Lại Hồ Sơ
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
