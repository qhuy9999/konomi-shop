<template>
  <UApp>
      <!-- Toast Notifications -->
    <ToastNotification />

    <!-- OTP Verification Modal: Lazy loaded (only shown conditionally) -->
    <LazyOTPVerificationModal />

    <!-- Main Layout -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import ToastNotification from '@/components/common/ToastNotification.vue'

const authStore = useAuthStore()

/**
 * Initialize auth store from localStorage on app startup
 */
onMounted(() => {
  authStore.initialize()
})
</script>
