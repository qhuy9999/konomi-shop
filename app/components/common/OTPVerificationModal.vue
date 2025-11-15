<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useSessionStore } from '@/stores/session'
import { useToastStore } from '@/stores/toast'

const sessionStore = useSessionStore()
const toastStore = useToastStore()

const isLoading = computed(() => sessionStore.isAuthLoading)
const pendingEmail = computed(() => sessionStore.pendingEmail)
const pendingUserId = computed(() => sessionStore.pendingUserId)

const otpForm = reactive({
  code: '',
})

/**
 * Handle OTP Verification
 */
const handleVerifyOTP = async () => {
  if (!otpForm.code.trim()) {
    toastStore.error('Vui lòng nhập mã OTP', { title: '⚠️ Validation' })
    return
  }

  sessionStore.setAuthLoading(true)

  try {
    const response = await $fetch<any>('/api/auth/verify-otp', {
      method: 'POST',
      body: {
        userId: pendingUserId.value,
        code: otpForm.code,
      },
    })

    toastStore.success('Xác nhận email thành công! Bây giờ bạn có thể đăng nhập.', {
      title: '✅ Email Verified',
      duration: 5000,
    })

    // Reset form
    otpForm.code = ''
    
    // Close OTP modal (reset to signin page)
    sessionStore.resetAuthModal()
  } catch (error: any) {
    const message = error.data?.message || 'Xác nhận OTP thất bại'
    toastStore.error(message, { title: '❌ OTP Error' })
  } finally {
    sessionStore.setAuthLoading(false)
  }
}

/**
 * Handle Resend OTP
 */
const handleResendOTP = async () => {
  sessionStore.setAuthLoading(true)

  try {
    await $fetch<any>('/api/auth/resend-otp', {
      method: 'POST',
      body: {
        userId: pendingUserId.value,
      },
    })

    toastStore.success('Mã OTP mới đã được gửi đến email của bạn', {
      title: '📧 OTP Resent',
    })
  } catch (error: any) {
    // Handle 429 Rate Limit (too many requests)
    if (error.status === 429) {
      const retryAfterSeconds = error.data?.retryAfter || 60
      const minutes = Math.floor(retryAfterSeconds / 60)
      const seconds = retryAfterSeconds % 60
      
      let timeText = ''
      if (minutes > 0) {
        timeText = `${minutes} phút ${seconds} giây`
      } else {
        timeText = `${seconds} giây`
      }
      
      const message = `Bạn đã gửi quá nhiều OTP. Vui lòng chờ ${timeText} để gửi lại.`
      toastStore.warning(message, {
        title: '⏱️ Quá nhiều yêu cầu',
        duration: 8000,
      })
    } else {
      const message = error.data?.message || 'Gửi lại OTP thất bại'
      toastStore.error(message, { title: '❌ Error' })
    }
  } finally {
    sessionStore.setAuthLoading(false)
  }
}

/**
 * Close modal without verification
 */
const closeModal = () => {
  otpForm.code = ''
  sessionStore.closeOTPModal()
}
</script>

<template>
  <!-- Modal Overlay -->
  <Transition name="fade">
    <div
      v-if="sessionStore.authModalPage === 'otp-verify' && sessionStore.pendingEmail"
      class="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
    >
      <!-- Modal Content (click outside doesn't close) -->
      <div
        class="relative bg-white rounded-xl shadow-2xl p-8 max-w-md w-full animate-slideUp z-50"
      >
        <!-- Header -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-neutral-900">Xác Nhận Email</h2>
          <p class="text-sm text-neutral-500 mt-2">
            Mã OTP đã được gửi đến email của bạn
          </p>
        </div>

        <!-- Email Display -->
        <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p class="text-sm text-neutral-600">
            Email: <strong class="text-blue-700">{{ pendingEmail }}</strong>
          </p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleVerifyOTP" class="space-y-6">
          <!-- OTP Code Input -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Mã OTP (6 chữ số)
            </label>
            <input
              v-model="otpForm.code"
              type="text"
              placeholder="000000"
              maxlength="6"
              pattern="[0-9]{6}"
              class="w-full px-4 py-3 border border-primary-300 rounded-lg transition-colors text-center text-2xl font-bold tracking-widest focus:border-primary-600 focus:ring-2 focus:ring-primary-200 disabled:opacity-50 placeholder:text-neutral-300"
              :disabled="isLoading"
              autofocus
            />
            <p class="text-xs text-neutral-500 mt-2 text-center">
              Kiểm tra email của bạn để lấy mã OTP
            </p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading || !otpForm.code"
            class="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isLoading ? 'Đang xử lý...' : 'Xác Nhận Email' }}
          </button>
        </form>

        <!-- Resend OTP Link -->
        <div class="mt-6 text-center border-t border-neutral-200 pt-6">
          <p class="text-sm text-neutral-600 mb-3">Không nhận được mã?</p>
          <button
            @click="handleResendOTP"
            type="button"
            :disabled="isLoading"
            class="text-primary-600 hover:text-primary-700 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Gửi lại OTP
          </button>
        </div>

        <!-- Close Button -->
        <button
          @click="closeModal"
          type="button"
          class="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 transition-colors z-10"
          title="Đóng"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Fade transition for backdrop */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
