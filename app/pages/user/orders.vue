<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <div class="min-h-screen bg-linear-to-b from-neutral-50 to-neutral-100 py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-neutral-900 mb-2">Đơn Hàng Của Tôi</h1>
        <p class="text-neutral-600">Quản lý các đơn hàng của bạn</p>
      </div>

      <div class="bg-white rounded-2xl shadow-lg p-12 text-center">
        <div class="mb-6">
          <svg class="w-24 h-24 mx-auto text-neutral-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2z"></path>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-neutral-900 mb-2">Chưa có đơn hàng</h2>
        <p class="text-neutral-600 mb-6">Bạn chưa có đơn hàng nào. Hãy khám phá các sản phẩm thú vị!</p>
        <NuxtLink to="/" class="inline-block px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors">
          Khám Phá Sản Phẩm
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
