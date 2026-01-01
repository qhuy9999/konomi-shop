<template>
  <UApp>
    <!-- Preload common icons - hidden but rendered for caching -->
    <div class="sr-only" aria-hidden="true">
      <UIcon name="i-lucide-menu" />
      <UIcon name="i-lucide-x" />
      <UIcon name="i-lucide-chevron-down" />
      <UIcon name="i-lucide-user" />
      <UIcon name="i-lucide-languages" />
      <UIcon name="i-lucide-check" />
      <UIcon name="i-lucide-shopping-bag" />
      <UIcon name="i-lucide-settings" />
      <UIcon name="i-lucide-log-out" />
      <UIcon name="i-custom-controller" />
      <UIcon name="i-custom-chevron-double-right" />
      <UIcon name="i-custom-chevron-double-left" />
    </div>

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
