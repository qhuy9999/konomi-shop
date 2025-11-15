<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useSessionStore } from '@/stores/session'
import { useToastStore } from '@/stores/toast'

// ============ Stores ============
const authStore = useAuthStore()
const sessionStore = useSessionStore()
const toastStore = useToastStore()

// ============ Router & Route ============
const router = useRouter()
const route = useRoute()

// ============ Computed State (from URL query param) ============
// Get current page from URL query param (?auth=signin|signup|otp-verify|forgot-password|reset-password|verify-otp-email)
// Fallback to session store for backward compatibility
const currentPage = computed(() => {
  const pageParam = route.query.auth as string | undefined
  if (pageParam && ['signin', 'signup', 'otp-verify', 'forgot-password', 'reset-password', 'verify-otp-email'].includes(pageParam)) {
    return pageParam as any
  }
  return sessionStore.authModalPage
})
const isLoading = computed(() => sessionStore.isAuthLoading)
const showAddressFields = computed(() => sessionStore.showAddressFields)
const signInErrors = computed(() => sessionStore.signInErrors)
const signUpErrors = computed(() => sessionStore.signUpErrors)
const pendingEmail = computed(() => sessionStore.pendingEmail)
const pendingUserId = computed(() => sessionStore.pendingUserId)

// ============ Form State (local) ============

// SignIn Form
const signInForm = reactive({
  username: '',
  password: '',
})

// SignUp Form
const signUpForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  // Address fields
  billingStreet: '',
  billingCity: '',
  billingProvince: '',
  billingZipCode: '',
  billingCountry: '',
  // Delivery address
  deliveryStreet: '',
  deliveryCity: '',
  deliveryProvince: '',
  deliveryZipCode: '',
  deliveryCountry: '',
})

// OTP Verify Form
const otpForm = reactive({
  code: '',
})

// Forgot Password Form
const forgotPasswordForm = reactive({
  email: '',
})

// Reset Password Form
const resetPasswordForm = reactive({
  code: '',
  password: '',
  confirmPassword: '',
})

// Verify OTP Email Form (để user nhập email để xác nhận lại)
const verifyOTPEmailForm = reactive({
  email: '',
})

// ============ Validation ============

/**
 * Validate SignIn Form
 */
const validateSignIn = (): boolean => {
  sessionStore.clearSignInErrors()

  let isValid = true

  if (!signInForm.username.trim()) {
    sessionStore.setSignInError('username', 'Username hoặc email bắt buộc')
    isValid = false
  }

  if (!signInForm.password.trim()) {
    sessionStore.setSignInError('password', 'Mật khẩu bắt buộc')
    isValid = false
  }

  return isValid
}

/**
 * Validate SignUp Form
 */
const validateSignUp = (): boolean => {
  sessionStore.clearSignUpErrors()

  let isValid = true

  // Username validation
  if (!signUpForm.username.trim()) {
    sessionStore.setSignUpError('username', 'Username bắt buộc')
    isValid = false
  } else if (signUpForm.username.length < 3) {
    sessionStore.setSignUpError('username', 'Username phải có ít nhất 3 ký tự')
    isValid = false
  } else if (signUpForm.username.length > 20) {
    sessionStore.setSignUpError('username', 'Username không được vượt quá 20 ký tự')
    isValid = false
  } else if (!/^[a-zA-Z0-9_-]+$/.test(signUpForm.username)) {
    sessionStore.setSignUpError('username', 'Username chỉ chứa chữ, số, _, -')
    isValid = false
  }

  // Email validation
  if (!signUpForm.email.trim()) {
    sessionStore.setSignUpError('email', 'Email bắt buộc')
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signUpForm.email)) {
    sessionStore.setSignUpError('email', 'Email không hợp lệ')
    isValid = false
  }

  // Password validation
  if (!signUpForm.password.trim()) {
    sessionStore.setSignUpError('password', 'Mật khẩu bắt buộc')
    isValid = false
  } else if (signUpForm.password.length < 8) {
    sessionStore.setSignUpError('password', 'Mật khẩu phải có ít nhất 8 ký tự')
    isValid = false
  } else if (!/[A-Z]/.test(signUpForm.password)) {
    sessionStore.setSignUpError('password', 'Mật khẩu phải chứa ít nhất 1 chữ hoa')
    isValid = false
  } else if (!/[0-9]/.test(signUpForm.password)) {
    sessionStore.setSignUpError('password', 'Mật khẩu phải chứa ít nhất 1 chữ số')
    isValid = false
  }

  // Confirm password validation
  if (!signUpForm.confirmPassword.trim()) {
    sessionStore.setSignUpError('confirmPassword', 'Xác nhận mật khẩu bắt buộc')
    isValid = false
  } else if (signUpForm.password !== signUpForm.confirmPassword) {
    sessionStore.setSignUpError('confirmPassword', 'Mật khẩu xác nhận không khớp')
    isValid = false
  }

  // FirstName validation
  if (!signUpForm.firstName.trim()) {
    sessionStore.setSignUpError('firstName', 'Tên bắt buộc')
    isValid = false
  } else if (signUpForm.firstName.length < 2) {
    sessionStore.setSignUpError('firstName', 'Tên phải có ít nhất 2 ký tự')
    isValid = false
  }

  // LastName validation
  if (!signUpForm.lastName.trim()) {
    sessionStore.setSignUpError('lastName', 'Họ bắt buộc')
    isValid = false
  } else if (signUpForm.lastName.length < 2) {
    sessionStore.setSignUpError('lastName', 'Họ phải có ít nhất 2 ký tự')
    isValid = false
  }

  // PhoneNumber validation (optional)
  if (signUpForm.phoneNumber && !/^[0-9+\-\s()]*$/.test(signUpForm.phoneNumber)) {
    sessionStore.setSignUpError('phoneNumber', 'Số điện thoại không hợp lệ')
    isValid = false
  } else if (signUpForm.phoneNumber && signUpForm.phoneNumber.length > 20) {
    sessionStore.setSignUpError('phoneNumber', 'Số điện thoại không được vượt quá 20 ký tự')
    isValid = false
  }

  return isValid
}

// ============ Form Handlers ============

/**
 * Handle SignIn Submit
 */
const handleSignIn = async () => {
  if (!validateSignIn()) return

  sessionStore.setAuthLoading(true)

  try {
    const response = await $fetch<any>('/api/auth/signin', {
      method: 'POST',
      body: {
        username: signInForm.username,
        password: signInForm.password,
      },
    })

    // Success - store tokens and user in Pinia
    if (response.accessToken) {
      authStore.setTokens(response.accessToken, response.refreshToken)
      if (response.user) {
        authStore.setCurrentUser(response.user)
      }

      console.log('✅ Sign in successful')

      toastStore.success('Đăng nhập thành công!', {
        title: '✅ Welcome',
      })

      // Reset form
      signInForm.username = ''
      signInForm.password = ''

      // Reset session state
      sessionStore.resetAuthModal()

      // Redirect to profile page
      await navigateTo('/user/profile')
    }
  } catch (error: any) {
    // Handle 403: Email not verified - show OTP verification
    if (error.status === 403 && error.data?.data?.requiresEmailVerification) {
      const errorData = error.data.data
      sessionStore.goToOTPVerify(errorData.userId, errorData.email)
      
      // Show notification with OTP info
      if (errorData.resendOTP === false && errorData.canResendAt) {
        const canResendTime = new Date(errorData.canResendAt).toLocaleTimeString('vi-VN')
        toastStore.warning(
          `Email chưa được xác thực. Bạn có thể gửi lại OTP vào lúc ${canResendTime}`,
          { title: '📧 Email Not Verified', duration: 7000 }
        )
      } else {
        toastStore.warning(
          'Email chưa được xác thực. Vui lòng kiểm tra email của bạn hoặc gửi lại OTP',
          { title: '📧 Email Not Verified', duration: 6000 }
        )
      }
    } else {
      // Other errors
      const message = error.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.'
      sessionStore.setSignInError('general', message)
      toastStore.error(message, { title: '❌ Sign In Failed' })
    }
  } finally {
    sessionStore.setAuthLoading(false)
  }
}

/**
 * Handle SignUp Submit
 */
const handleSignUp = async () => {
  if (!validateSignUp()) return

  sessionStore.setAuthLoading(true)

  try {
    const response = await $fetch<any>('/api/auth/signup', {
      method: 'POST',
      body: {
        username: signUpForm.username,
        email: signUpForm.email,
        password: signUpForm.password,
        firstName: signUpForm.firstName,
        lastName: signUpForm.lastName,
        phoneNumber: signUpForm.phoneNumber || undefined,
        // Address fields
        billingStreet: signUpForm.billingStreet || undefined,
        billingCity: signUpForm.billingCity || undefined,
        billingProvince: signUpForm.billingProvince || undefined,
        billingZipCode: signUpForm.billingZipCode || undefined,
        billingCountry: signUpForm.billingCountry || undefined,
        // Delivery address
        deliveryStreet: signUpForm.deliveryStreet || undefined,
        deliveryCity: signUpForm.deliveryCity || undefined,
        deliveryProvince: signUpForm.deliveryProvince || undefined,
        deliveryZipCode: signUpForm.deliveryZipCode || undefined,
        deliveryCountry: signUpForm.deliveryCountry || undefined,
      },
    })

    console.log('✅ Sign up successful')

    // Show toast notification FIRST
    toastStore.success('Đăng ký thành công!', {
      title: '✅ Success',
    })

    // Go to OTP verification page (with route param)
    if (response.userId && response.email) {
      sessionStore.goToOTPVerify(response.userId, response.email)
      
      // Show OTP info toast AFTER page change
      await new Promise(resolve => setTimeout(resolve, 300))
      toastStore.info('Mã OTP đã được gửi tới email của bạn', {
        title: '📧 Email Verification',
        duration: 5000,
      })
    }

    // Reset forms
    resetSignUpForm()
  } catch (error: any) {
    const message = error.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.'
    sessionStore.setSignUpError('general', message)
    toastStore.error(message, { title: '❌ Signup Error' })
  } finally {
    sessionStore.setAuthLoading(false)
  }
}

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
        userId: sessionStore.pendingUserId,
        code: otpForm.code,
      },
    })

    toastStore.success('Xác nhận email thành công!', {
      title: '✅ Email Verified',
    })

    // Reset and go back to signin (with route param)
    otpForm.code = ''
    navigateToPage('signin')
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
        userId: sessionStore.pendingUserId,
      },
    })

    toastStore.success('Mã OTP mới đã được gửi', {
      title: '📧 Resent',
    })
  } catch (error: any) {
    const message = error.data?.message || 'Gửi lại OTP thất bại'
    toastStore.error(message, { title: '❌ Error' })
  } finally {
    sessionStore.setAuthLoading(false)
  }
}

/**
 * Handle Forgot Password
 */
const handleForgotPassword = async () => {
  if (!forgotPasswordForm.email.trim()) {
    toastStore.error('Vui lòng nhập email', { title: '⚠️ Validation' })
    return
  }

  sessionStore.setAuthLoading(true)

  try {
    await $fetch<any>('/api/auth/forgot-password', {
      method: 'POST',
      body: {
        email: forgotPasswordForm.email,
      },
    })

    toastStore.success('Hướng dẫn reset mật khẩu đã được gửi', {
      title: '📧 Email Sent',
    })

    // Go to reset password page (with route param)
    sessionStore.goToResetPassword(forgotPasswordForm.email)
    navigateToPage('reset-password')
    forgotPasswordForm.email = ''
  } catch (error: any) {
    const message = error.data?.message || 'Gửi email thất bại'
    toastStore.error(message, { title: '❌ Error' })
  } finally {
    sessionStore.setAuthLoading(false)
  }
}

/**
 * Handle Reset Password
 */
const handleResetPassword = async () => {
  if (!resetPasswordForm.code.trim()) {
    toastStore.error('Vui lòng nhập mã xác nhận', { title: '⚠️ Validation' })
    return
  }

  if (!resetPasswordForm.password.trim()) {
    toastStore.error('Vui lòng nhập mật khẩu mới', { title: '⚠️ Validation' })
    return
  }

  if (resetPasswordForm.password !== resetPasswordForm.confirmPassword) {
    toastStore.error('Mật khẩu xác nhận không khớp', { title: '⚠️ Validation' })
    return
  }

  sessionStore.setAuthLoading(true)

  try {
    await $fetch<any>('/api/auth/reset-password', {
      method: 'POST',
      body: {
        email: sessionStore.pendingEmail,
        code: resetPasswordForm.code,
        password: resetPasswordForm.password,
      },
    })

    toastStore.success('Mật khẩu đã được cập nhật!', {
      title: '✅ Success',
    })

    // Reset and go back to signin (with route param)
    resetPasswordForm.code = ''
    resetPasswordForm.password = ''
    resetPasswordForm.confirmPassword = ''
    navigateToPage('signin')
  } catch (error: any) {
    const message = error.data?.message || 'Cập nhật mật khẩu thất bại'
    toastStore.error(message, { title: '❌ Error' })
  } finally {
    sessionStore.setAuthLoading(false)
  }
}

/**
 * Handle Verify OTP Email (user nhập email để request resend OTP)
 */
const handleVerifyOTPEmail = async () => {
  if (!verifyOTPEmailForm.email.trim()) {
    toastStore.error('Vui lòng nhập email', { title: '⚠️ Validation' })
    return
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(verifyOTPEmailForm.email)) {
    toastStore.error('Email không hợp lệ', { title: '⚠️ Validation' })
    return
  }

  sessionStore.setAuthLoading(true)

  try {
    // Call API để lấy user ID từ email
    const response = await $fetch<any>('/api/auth/request-verify-email', {
      method: 'POST',
      body: {
        email: verifyOTPEmailForm.email,
      },
    })

    toastStore.success('Mã OTP đã được gửi đến email của bạn', {
      title: '📧 OTP Sent',
    })

    // Set pending user và chuyển sang OTP verify page
    sessionStore.goToOTPVerify(response.userId, verifyOTPEmailForm.email)
    verifyOTPEmailForm.email = ''
  } catch (error: any) {
    const message = error.data?.message || 'Gửi OTP thất bại'
    toastStore.error(message, { title: '❌ Error' })
  } finally {
    sessionStore.setAuthLoading(false)
  }
}

/**
 * Reset SignUp Form
 */
const resetSignUpForm = () => {
  signUpForm.username = ''
  signUpForm.email = ''
  signUpForm.password = ''
  signUpForm.confirmPassword = ''
  signUpForm.firstName = ''
  signUpForm.lastName = ''
  signUpForm.phoneNumber = ''
  signUpForm.billingStreet = ''
  signUpForm.billingCity = ''
  signUpForm.billingProvince = ''
  signUpForm.billingZipCode = ''
  signUpForm.billingCountry = ''
  signUpForm.deliveryStreet = ''
  signUpForm.deliveryCity = ''
  signUpForm.deliveryProvince = ''
  signUpForm.deliveryZipCode = ''
  signUpForm.deliveryCountry = ''
}

/**
 * Navigate to page (update URL query param)
 */
const navigateToPage = (page: string) => {
  router.push({
    query: {
      ...route.query,
      auth: page,
    },
  })
  sessionStore.setAuthModalPage(page as any)
}

/**
 * Switch to SignUp page
 */
const goToSignUp = () => {
  navigateToPage('signup')
}

/**
 * Switch back to SignIn page
 */
const goToSignIn = () => {
  navigateToPage('signin')
  resetSignUpForm()
}

/**
 * Toggle address fields
 */
const toggleAddressFields = () => {
  sessionStore.toggleAddressFields()
}
</script>

<template>
  <section id="auth-modal" class="py-20">
    <div class="container">
      <!-- Book-style container -->
      <div class="book-container">
        <!-- Page 1: SignIn -->
        <div
          :class="[
            'book-page page-signin',
            { 'active': currentPage === 'signin', 'prev': currentPage !== 'signin' }
          ]"
        >
          <div class="page-content">
            <!-- Header -->
            <div class="mb-10">
              <h2 class="sub_heading">Chào mừng quay lại</h2>
              <h1 class="main_heading">Đăng Nhập</h1>
            </div>

            <!-- Error Message -->
            <div
              v-if="signInErrors.general?.message"
              class="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm"
            >
              {{ signInErrors.general?.message }}
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSignIn" class="space-y-6">
              <!-- Username Input -->
              <div>
                <label class="block text-sm font-medium mb-2">
                  Tên đăng nhập hoặc Email
                </label>
                <input
                  v-model="signInForm.username"
                  type="text"
                  placeholder="Nhập username hoặc email"
                  :class="[
                    'w-full px-4 py-3 border rounded-lg transition-colors',
                    signInErrors.username?.message
                      ? 'border-red-500 bg-red-50'
                      : 'border-primary-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-200'
                  ]"
                  :disabled="isLoading"
                />
                <p v-if="signInErrors.username?.message" class="mt-1 text-sm text-red-600">
                  {{ signInErrors.username?.message }}
                </p>
              </div>

              <!-- Password Input -->
              <div>
                <label class="block text-sm font-medium mb-2">Mật khẩu</label>
                <input
                  v-model="signInForm.password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  :class="[
                    'w-full px-4 py-3 border rounded-lg transition-colors',
                    signInErrors.password?.message
                      ? 'border-red-500 bg-red-50'
                      : 'border-primary-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-200'
                  ]"
                  :disabled="isLoading"
                />
                <p v-if="signInErrors.password?.message" class="mt-1 text-sm text-red-600">
                  {{ signInErrors.password?.message }}
                </p>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="isLoading"
                class="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isLoading ? 'Đang xử lý...' : 'Đăng Nhập' }}
              </button>
            </form>

            <!-- Forgot Password Link -->
            <div class="mt-6 space-y-3 text-center">
              <button
                @click="navigateToPage('forgot-password')"
                type="button"
                class="block w-full text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Quên mật khẩu?
              </button>
              <button
                @click="navigateToPage('verify-otp-email')"
                type="button"
                class="block w-full text-accent-600 hover:text-accent-700 text-sm font-medium"
              >
                Xác nhận Email lại
              </button>
              <!-- Show button to reopen OTP modal only if there's pending OTP -->
              <button
                v-if="pendingUserId && pendingEmail"
                @click="sessionStore.setAuthModalPage('otp-verify')"
                type="button"
                class="block w-full text-yellow-600 hover:text-yellow-700 text-sm font-medium"
              >
                📧 Mở lại Modal OTP
              </button>
            </div>
          </div>

          <!-- Signup CTA -->
          <div class="page-footer">
            <p class="text-center mb-4">Chưa có tài khoản?</p>
            <button
              @click="goToSignUp"
              type="button"
              class="w-full py-3 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 font-semibold rounded-lg transition-colors"
            >
              Tạo Tài Khoản Mới
            </button>
          </div>
        </div>

        <!-- Page 2: SignUp -->
        <div
          :class="[
            'book-page page-signup',
            { 'active': currentPage === 'signup', 'next': currentPage !== 'signup' }
          ]"
        >
          <div class="page-content">
            <!-- Header -->
            <div class="mb-8">
              <h2 class="sub_heading">Bắt đầu ngay</h2>
              <h1 class="main_heading">Đăng Ký</h1>
            </div>

            <!-- Error Message -->
            <div
              v-if="signUpErrors.general?.message"
              class="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm"
            >
              {{ signUpErrors.general?.message }}
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSignUp" class="space-y-4">
              <!-- Username -->
              <div>
                <label class="block text-xs font-medium mb-1">Tên đăng nhập *</label>
                <input
                  v-model="signUpForm.username"
                  type="text"
                  placeholder="3-20 ký tự"
                  :class="[
                    'w-full px-3 py-2 border rounded-lg text-sm transition-colors',
                    signUpErrors.username?.message
                      ? 'border-red-500 bg-red-50'
                      : 'border-primary-300 focus:border-primary-600'
                  ]"
                  :disabled="isLoading"
                />
                <p v-if="signUpErrors.username?.message" class="mt-1 text-xs text-red-600">
                  {{ signUpErrors.username?.message }}
                </p>
              </div>

              <!-- Email -->
              <div>
                <label class="block text-xs font-medium mb-1">Email *</label>
                <input
                  v-model="signUpForm.email"
                  type="email"
                  placeholder="example@email.com"
                  :class="[
                    'w-full px-3 py-2 border rounded-lg text-sm transition-colors',
                    signUpErrors.email?.message
                      ? 'border-red-500 bg-red-50'
                      : 'border-primary-300 focus:border-primary-600'
                  ]"
                  :disabled="isLoading"
                />
                <p v-if="signUpErrors.email?.message" class="mt-1 text-xs text-red-600">
                  {{ signUpErrors.email?.message }}
                </p>
              </div>

              <!-- Password -->
              <div>
                <label class="block text-xs font-medium mb-1">Mật khẩu *</label>
                <input
                  v-model="signUpForm.password"
                  type="password"
                  placeholder="Min 8 ký tự, 1 chữ hoa, 1 số"
                  :class="[
                    'w-full px-3 py-2 border rounded-lg text-sm transition-colors',
                    signUpErrors.password?.message
                      ? 'border-red-500 bg-red-50'
                      : 'border-primary-300 focus:border-primary-600'
                  ]"
                  :disabled="isLoading"
                />
                <p v-if="signUpErrors.password?.message" class="mt-1 text-xs text-red-600">
                  {{ signUpErrors.password?.message }}
                </p>
              </div>

              <!-- Confirm Password -->
              <div>
                <label class="block text-xs font-medium mb-1">Xác nhận mật khẩu *</label>
                <input
                  v-model="signUpForm.confirmPassword"
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  :class="[
                    'w-full px-3 py-2 border rounded-lg text-sm transition-colors',
                    signUpErrors.confirmPassword?.message
                      ? 'border-red-500 bg-red-50'
                      : 'border-primary-300 focus:border-primary-600'
                  ]"
                  :disabled="isLoading"
                />
                <p v-if="signUpErrors.confirmPassword?.message" class="mt-1 text-xs text-red-600">
                  {{ signUpErrors.confirmPassword?.message }}
                </p>
              </div>

              <!-- First Name -->
              <div>
                <label class="block text-xs font-medium mb-1">Tên *</label>
                <input
                  v-model="signUpForm.firstName"
                  type="text"
                  placeholder="Tên của bạn"
                  :class="[
                    'w-full px-3 py-2 border rounded-lg text-sm transition-colors',
                    signUpErrors.firstName?.message
                      ? 'border-red-500 bg-red-50'
                      : 'border-primary-300 focus:border-primary-600'
                  ]"
                  :disabled="isLoading"
                />
                <p v-if="signUpErrors.firstName?.message" class="mt-1 text-xs text-red-600">
                  {{ signUpErrors.firstName?.message }}
                </p>
              </div>

              <!-- Last Name -->
              <div>
                <label class="block text-xs font-medium mb-1">Họ *</label>
                <input
                  v-model="signUpForm.lastName"
                  type="text"
                  placeholder="Họ của bạn"
                  :class="[
                    'w-full px-3 py-2 border rounded-lg text-sm transition-colors',
                    signUpErrors.lastName?.message
                      ? 'border-red-500 bg-red-50'
                      : 'border-primary-300 focus:border-primary-600'
                  ]"
                  :disabled="isLoading"
                />
                <p v-if="signUpErrors.lastName?.message" class="mt-1 text-xs text-red-600">
                  {{ signUpErrors.lastName?.message }}
                </p>
              </div>

              <!-- Phone Number -->
              <div>
                <label class="block text-xs font-medium mb-1">Số điện thoại (Tuỳ chọn)</label>
                <input
                  v-model="signUpForm.phoneNumber"
                  type="tel"
                  placeholder="(+84) 123 456 789"
                  :class="[
                    'w-full px-3 py-2 border rounded-lg text-sm transition-colors',
                    signUpErrors.phoneNumber?.message
                      ? 'border-red-500 bg-red-50'
                      : 'border-primary-300 focus:border-primary-600'
                  ]"
                  :disabled="isLoading"
                />
                <p v-if="signUpErrors.phoneNumber?.message" class="mt-1 text-xs text-red-600">
                  {{ signUpErrors.phoneNumber?.message }}
                </p>
              </div>

              <!-- Address Fields Toggle -->
              <div class="pt-2">
                <button
                  type="button"
                  @click="toggleAddressFields"
                  class="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  {{ showAddressFields ? '▼ Ẩn' : '▶ Thêm' }} địa chỉ (Tuỳ chọn)
                </button>
              </div>

              <!-- Billing Address (Collapsible) -->
              <div v-if="showAddressFields" class="space-y-3 pt-2 border-t border-neutral-200">
                <p class="text-xs font-semibold text-neutral-700">Địa chỉ thanh toán</p>
                <div class="grid grid-cols-2 gap-3">
                  <input
                    v-model="signUpForm.billingStreet"
                    type="text"
                    placeholder="Địa chỉ"
                    class="col-span-2 px-3 py-2 border border-primary-300 rounded-lg text-xs"
                  />
                  <input
                    v-model="signUpForm.billingCity"
                    type="text"
                    placeholder="Thành phố"
                    class="px-3 py-2 border border-primary-300 rounded-lg text-xs"
                  />
                  <input
                    v-model="signUpForm.billingProvince"
                    type="text"
                    placeholder="Tỉnh/Thành"
                    class="px-3 py-2 border border-primary-300 rounded-lg text-xs"
                  />
                  <input
                    v-model="signUpForm.billingZipCode"
                    type="text"
                    placeholder="Mã bưu điện"
                    class="px-3 py-2 border border-primary-300 rounded-lg text-xs"
                  />
                  <input
                    v-model="signUpForm.billingCountry"
                    type="text"
                    placeholder="Quốc gia"
                    class="px-3 py-2 border border-primary-300 rounded-lg text-xs"
                  />
                </div>

                <p class="text-xs font-semibold text-neutral-700 pt-2">Địa chỉ giao hàng (Nếu khác)</p>
                <div class="grid grid-cols-2 gap-3">
                  <input
                    v-model="signUpForm.deliveryStreet"
                    type="text"
                    placeholder="Địa chỉ"
                    class="col-span-2 px-3 py-2 border border-primary-300 rounded-lg text-xs"
                  />
                  <input
                    v-model="signUpForm.deliveryCity"
                    type="text"
                    placeholder="Thành phố"
                    class="px-3 py-2 border border-primary-300 rounded-lg text-xs"
                  />
                  <input
                    v-model="signUpForm.deliveryProvince"
                    type="text"
                    placeholder="Tỉnh/Thành"
                    class="px-3 py-2 border border-primary-300 rounded-lg text-xs"
                  />
                  <input
                    v-model="signUpForm.deliveryZipCode"
                    type="text"
                    placeholder="Mã bưu điện"
                    class="px-3 py-2 border border-primary-300 rounded-lg text-xs"
                  />
                  <input
                    v-model="signUpForm.deliveryCountry"
                    type="text"
                    placeholder="Quốc gia"
                    class="px-3 py-2 border border-primary-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="isLoading"
                class="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {{ isLoading ? 'Đang xử lý...' : 'Đăng Ký' }}
              </button>
            </form>
          </div>

          <!-- Back to SignIn -->
          <div class="page-footer">
            <p class="text-center mb-4 text-sm">Đã có tài khoản?</p>
            <button
              @click="goToSignIn"
              type="button"
              class="w-full py-3 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 font-semibold rounded-lg transition-colors text-sm"
            >
              Quay Lại Đăng Nhập
            </button>
          </div>
        </div>

        <!-- Page 3: OTP Verification -->
        <div
          :class="[
            'book-page page-otp-verify',
            { 'active': currentPage === 'otp-verify', 'next': currentPage === 'otp-verify' ? '' : 'next' }
          ]"
        >
          <div class="page-content">
            <!-- Header -->
            <div class="mb-10">
              <h2 class="sub_heading">Xác nhận Email</h2>
              <h1 class="main_heading">Nhập Mã OTP</h1>
            </div>

            <p class="text-neutral-600 mb-6 text-sm">
              Mã xác nhận 6 chữ số đã được gửi đến email:
              <br />
              <strong>{{ pendingEmail }}</strong>
            </p>

            <!-- Form -->
            <form @submit.prevent="handleVerifyOTP" class="space-y-6">
              <!-- OTP Code Input -->
              <div>
                <label class="block text-sm font-medium mb-2">Mã OTP</label>
                <input
                  v-model="otpForm.code"
                  type="text"
                  placeholder="Nhập 6 chữ số"
                  maxlength="6"
                  :class="[
                    'w-full px-4 py-3 border rounded-lg transition-colors text-center text-2xl font-bold tracking-widest',
                    'border-primary-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-200'
                  ]"
                  :disabled="isLoading"
                />
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="isLoading"
                class="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isLoading ? 'Đang xử lý...' : 'Xác Nhận' }}
              </button>
            </form>

            <!-- Resend OTP -->
            <div class="mt-6 text-center">
              <button
                @click="handleResendOTP"
                type="button"
                :disabled="isLoading"
                class="text-primary-600 hover:text-primary-700 text-sm font-medium disabled:opacity-50"
              >
                Gửi lại mã OTP
              </button>
            </div>
          </div>

          <!-- Back Button -->
          <div class="page-footer">
            <button
              @click="navigateToPage('signin')"
              type="button"
              class="w-full py-3 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 font-semibold rounded-lg transition-colors"
            >
              Quay Lại
            </button>
          </div>
        </div>

        <!-- Page 4: Forgot Password -->
        <div
          :class="[
            'book-page page-forgot-password',
            { 'active': currentPage === 'forgot-password' }
          ]"
        >
          <div class="page-content">
            <!-- Header -->
            <div class="mb-10">
              <h2 class="sub_heading">Quên mật khẩu?</h2>
              <h1 class="main_heading">Khôi Phục Mật Khẩu</h1>
            </div>

            <p class="text-neutral-600 mb-6 text-sm">
              Nhập email của bạn để nhận hướng dẫn khôi phục mật khẩu
            </p>

            <!-- Form -->
            <form @submit.prevent="handleForgotPassword" class="space-y-6">
              <!-- Email Input -->
              <div>
                <label class="block text-sm font-medium mb-2">Email</label>
                <input
                  v-model="forgotPasswordForm.email"
                  type="email"
                  placeholder="Nhập email của bạn"
                  :class="[
                    'w-full px-4 py-3 border rounded-lg transition-colors',
                    'border-primary-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-200'
                  ]"
                  :disabled="isLoading"
                />
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="isLoading"
                class="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isLoading ? 'Đang xử lý...' : 'Gửi Hướng Dẫn' }}
              </button>
            </form>
          </div>

          <!-- Back to SignIn -->
          <div class="page-footer">
            <button
              @click="navigateToPage('signin')"
              type="button"
              class="w-full py-3 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 font-semibold rounded-lg transition-colors"
            >
              Quay Lại Đăng Nhập
            </button>
          </div>
        </div>

        <!-- Page 5: Reset Password -->
        <div
          :class="[
            'book-page page-reset-password',
            { 'active': currentPage === 'reset-password' }
          ]"
        >
          <div class="page-content">
            <!-- Header -->
            <div class="mb-10">
              <h2 class="sub_heading">Đặt Lại Mật Khẩu</h2>
              <h1 class="main_heading">Mật Khẩu Mới</h1>
            </div>

            <p class="text-neutral-600 mb-6 text-sm">
              Nhập mã xác nhận từ email và mật khẩu mới
            </p>

            <!-- Form -->
            <form @submit.prevent="handleResetPassword" class="space-y-6">
              <!-- OTP Code Input -->
              <div>
                <label class="block text-sm font-medium mb-2">Mã Xác Nhận</label>
                <input
                  v-model="resetPasswordForm.code"
                  type="text"
                  placeholder="Nhập mã từ email"
                  :class="[
                    'w-full px-4 py-3 border rounded-lg transition-colors',
                    'border-primary-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-200'
                  ]"
                  :disabled="isLoading"
                />
              </div>

              <!-- New Password Input -->
              <div>
                <label class="block text-sm font-medium mb-2">Mật Khẩu Mới</label>
                <input
                  v-model="resetPasswordForm.password"
                  type="password"
                  placeholder="Mật khẩu mới"
                  :class="[
                    'w-full px-4 py-3 border rounded-lg transition-colors',
                    'border-primary-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-200'
                  ]"
                  :disabled="isLoading"
                />
              </div>

              <!-- Confirm Password Input -->
              <div>
                <label class="block text-sm font-medium mb-2">Xác Nhận Mật Khẩu</label>
                <input
                  v-model="resetPasswordForm.confirmPassword"
                  type="password"
                  placeholder="Xác nhận mật khẩu"
                  :class="[
                    'w-full px-4 py-3 border rounded-lg transition-colors',
                    'border-primary-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-200'
                  ]"
                  :disabled="isLoading"
                />
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="isLoading"
                class="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isLoading ? 'Đang xử lý...' : 'Cập Nhật Mật Khẩu' }}
              </button>
            </form>
          </div>

          <!-- Back to SignIn -->
          <div class="page-footer">
            <button
              @click="navigateToPage('signin')"
              type="button"
              class="w-full py-3 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 font-semibold rounded-lg transition-colors"
            >
              Quay Lại Đăng Nhập
            </button>
          </div>
        </div>

        <!-- Page 6: Verify OTP Email -->
        <div
          :class="[
            'book-page page-verify-otp-email',
            { 'active': currentPage === 'verify-otp-email', 'next': currentPage !== 'verify-otp-email' }
          ]"
        >
          <div class="page-content">
            <!-- Header -->
            <div class="mb-8">
              <h2 class="sub_heading">Xác nhận tài khoản</h2>
              <h1 class="main_heading">Cấp Lại OTP</h1>
            </div>

            <p class="text-neutral-600 mb-6 text-sm">
              Nhập email của tài khoản cần xác nhận để nhận mã OTP mới
            </p>

            <!-- Form -->
            <form @submit.prevent="handleVerifyOTPEmail" class="space-y-6">
              <!-- Email Input -->
              <div>
                <label class="block text-sm font-medium mb-2">Email</label>
                <input
                  v-model="verifyOTPEmailForm.email"
                  type="email"
                  placeholder="Nhập email của tài khoản"
                  :class="[
                    'w-full px-4 py-3 border rounded-lg transition-colors',
                    'border-primary-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-200'
                  ]"
                  :disabled="isLoading"
                />
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="isLoading"
                class="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isLoading ? 'Đang xử lý...' : 'Gửi OTP' }}
              </button>
            </form>
          </div>

          <!-- Back to SignIn -->
          <div class="page-footer">
            <button
              @click="navigateToPage('signin')"
              type="button"
              class="w-full py-3 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 font-semibold rounded-lg transition-colors"
            >
              Quay Lại Đăng Nhập
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@import "@/assets/css/main.css";

/* Book Container */
.book-container {
  @apply relative w-full max-w-2xl mx-auto;
  perspective: 1000px;
}

/* Book Pages */
.book-page {
  @apply w-full bg-white rounded-2xl shadow-2xl p-8 lg:p-12;
  @apply transition-all duration-500 ease-in-out;
  min-height: 600px;
  display: flex;
  flex-direction: column;

  /* Hidden state for transitions */
  opacity: 0;
  transform: translateX(100%) rotateY(45deg);
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;

  &.active {
    opacity: 1;
    transform: translateX(0) rotateY(0);
    pointer-events: auto;
    position: relative;
  }

  &.prev {
    transform: translateX(-100%) rotateY(-45deg);
  }

  &.next {
    transform: translateX(100%) rotateY(45deg);
  }
}

.page-content {
  @apply flex-1;
}

.page-footer {
  @apply mt-8 pt-8 border-t border-neutral-200;
}

/* Page-specific styles */
.page-signin,
.page-signup,
.page-otp-verify,
.page-forgot-password,
.page-reset-password,
.page-verify-otp-email {
  &.active {
    animation: slideIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .book-page {
    @apply p-6;
    min-height: 500px;
  }

  .book-container {
    @apply max-w-full;
  }
}
</style>
