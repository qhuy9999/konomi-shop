<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { useSessionStore } from "@/stores/session";
import { useToastStore } from "@/stores/toast";

// ============ Stores ============
const authStore = useAuthStore();
const sessionStore = useSessionStore();
const toastStore = useToastStore();

// ============ i18n ============
const { t } = useI18n();

// ============ Router & Route ============
const router = useRouter();
const route = useRoute();

// ============ Computed State (from URL query param) ============
// Get current page from URL query param (?auth=signin|signup|otp-verify|forgot-password|reset-password|verify-otp-email)
// Fallback to session store for backward compatibility
const currentPage = computed(() => {
  const pageParam = route.query.auth as string | undefined;
  if (
    pageParam &&
    [
      "signin",
      "signup",
      "otp-verify",
      "forgot-password",
      "reset-password",
      "verify-otp-email",
    ].includes(pageParam)
  ) {
    return pageParam as any;
  }
  return sessionStore.authModalPage;
});
const isLoading = computed(() => sessionStore.isAuthLoading);
const showAddressFields = computed(() => sessionStore.showAddressFields);
const signInErrors = computed(() => sessionStore.signInErrors);
const signUpErrors = computed(() => sessionStore.signUpErrors);
const pendingEmail = computed(() => sessionStore.pendingEmail);
const pendingUserId = computed(() => sessionStore.pendingUserId);

// ============ Form State (local) ============

// SignIn Form
const signInForm = reactive({
  username: "",
  password: "",
});

// SignUp Form
const signUpForm = reactive({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  // Address fields
  billingStreet: "",
  billingCity: "",
  billingProvince: "",
  billingZipCode: "",
  billingCountry: "",
  // Delivery address
  deliveryStreet: "",
  deliveryCity: "",
  deliveryProvince: "",
  deliveryZipCode: "",
  deliveryCountry: "",
});

// OTP Verify Form
const otpForm = reactive({
  code: "",
});

// Forgot Password Form
const forgotPasswordForm = reactive({
  email: "",
});

// Reset Password Form
const resetPasswordForm = reactive({
  code: "",
  password: "",
  confirmPassword: "",
});

// Verify OTP Email Form (để user nhập email để xác nhận lại)
const verifyOTPEmailForm = reactive({
  email: "",
});

// ============ Validation ============

/**
 * Validate SignIn Form
 */
const validateSignIn = (): boolean => {
  sessionStore.clearSignInErrors();

  let isValid = true;

  if (!signInForm.username.trim()) {
    sessionStore.setSignInError(
      "username",
      t("auth.validation.usernameRequired")
    );
    isValid = false;
  }

  if (!signInForm.password.trim()) {
    sessionStore.setSignInError(
      "password",
      t("auth.validation.passwordRequired")
    );
    isValid = false;
  }

  return isValid;
};

/**
 * Validate SignUp Form
 */
const validateSignUp = (): boolean => {
  sessionStore.clearSignUpErrors();

  let isValid = true;

  // Username validation
  if (!signUpForm.username.trim()) {
    sessionStore.setSignUpError(
      "username",
      t("auth.validation.usernameRequired")
    );
    isValid = false;
  } else if (signUpForm.username.length < 3) {
    sessionStore.setSignUpError(
      "username",
      t("auth.validation.usernameMinLength")
    );
    isValid = false;
  } else if (signUpForm.username.length > 20) {
    sessionStore.setSignUpError(
      "username",
      t("auth.validation.usernameMaxLength")
    );
    isValid = false;
  } else if (!/^[a-zA-Z0-9_-]+$/.test(signUpForm.username)) {
    sessionStore.setSignUpError(
      "username",
      t("auth.validation.usernameInvalid")
    );
    isValid = false;
  }

  // Email validation
  if (!signUpForm.email.trim()) {
    sessionStore.setSignUpError("email", t("auth.validation.emailRequired"));
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signUpForm.email)) {
    sessionStore.setSignUpError("email", t("auth.validation.emailInvalid"));
    isValid = false;
  }

  // Password validation
  if (!signUpForm.password.trim()) {
    sessionStore.setSignUpError(
      "password",
      t("auth.validation.passwordRequired")
    );
    isValid = false;
  } else if (signUpForm.password.length < 8) {
    sessionStore.setSignUpError(
      "password",
      t("auth.validation.passwordMinLength")
    );
    isValid = false;
  } else if (!/[A-Z]/.test(signUpForm.password)) {
    sessionStore.setSignUpError(
      "password",
      t("auth.validation.passwordRequireUppercase")
    );
    isValid = false;
  } else if (!/[0-9]/.test(signUpForm.password)) {
    sessionStore.setSignUpError(
      "password",
      t("auth.validation.passwordRequireNumber")
    );
    isValid = false;
  }

  // Confirm password validation
  if (!signUpForm.confirmPassword.trim()) {
    sessionStore.setSignUpError(
      "confirmPassword",
      t("auth.validation.confirmPasswordRequired")
    );
    isValid = false;
  } else if (signUpForm.password !== signUpForm.confirmPassword) {
    sessionStore.setSignUpError(
      "confirmPassword",
      t("auth.validation.passwordMismatch")
    );
    isValid = false;
  }

  // FirstName validation
  if (!signUpForm.firstName.trim()) {
    sessionStore.setSignUpError(
      "firstName",
      t("auth.validation.firstNameRequired")
    );
    isValid = false;
  } else if (signUpForm.firstName.length < 2) {
    sessionStore.setSignUpError(
      "firstName",
      t("auth.validation.firstNameMinLength")
    );
    isValid = false;
  }

  // LastName validation
  if (!signUpForm.lastName.trim()) {
    sessionStore.setSignUpError(
      "lastName",
      t("auth.validation.lastNameRequired")
    );
    isValid = false;
  } else if (signUpForm.lastName.length < 2) {
    sessionStore.setSignUpError(
      "lastName",
      t("auth.validation.lastNameMinLength")
    );
    isValid = false;
  }

  // PhoneNumber validation (optional)
  if (
    signUpForm.phoneNumber &&
    !/^[0-9+\-\s()]*$/.test(signUpForm.phoneNumber)
  ) {
    sessionStore.setSignUpError(
      "phoneNumber",
      t("auth.validation.phoneInvalid")
    );
    isValid = false;
  } else if (signUpForm.phoneNumber && signUpForm.phoneNumber.length > 20) {
    sessionStore.setSignUpError(
      "phoneNumber",
      t("auth.validation.phoneInvalid")
    );
    isValid = false;
  }

  return isValid;
};

// ============ Form Handlers ============

/**
 * Handle SignIn Submit
 */
const handleSignIn = async () => {
  if (!validateSignIn()) return;

  sessionStore.setAuthLoading(true);

  try {
    const response = await $fetch<any>("/api/auth/signin", {
      method: "POST",
      body: {
        username: signInForm.username,
        password: signInForm.password,
      },
    });

    // Success - store tokens and user in Pinia
    if (response.accessToken) {
      authStore.setTokens(response.accessToken, response.refreshToken);
      if (response.user) {
        authStore.setCurrentUser(response.user);
      }

      console.log("✅ Sign in successful");

      toastStore.success("Đăng nhập thành công!", {
        title: "✅ Welcome",
      });

      // Reset form
      signInForm.username = "";
      signInForm.password = "";

      // Reset session state
      sessionStore.resetAuthModal();

      // Redirect to profile page
      await navigateTo("/user/profile");
    }
  } catch (error: any) {
    // Handle 403: Email not verified - show OTP verification
    if (error.status === 403 && error.data?.data?.requiresEmailVerification) {
      const errorData = error.data.data;
      sessionStore.goToOTPVerify(errorData.userId, errorData.email);

      // Show notification with OTP info
      if (errorData.resendOTP === false && errorData.canResendAt) {
        const canResendTime = new Date(
          errorData.canResendAt
        ).toLocaleTimeString("vi-VN");
        toastStore.warning(
          `Email chưa được xác thực. Bạn có thể gửi lại OTP vào lúc ${canResendTime}`,
          { title: "📧 Email Not Verified", duration: 7000 }
        );
      } else {
        toastStore.warning(
          "Email chưa được xác thực. Vui lòng kiểm tra email của bạn hoặc gửi lại OTP",
          { title: "📧 Email Not Verified", duration: 6000 }
        );
      }
    } else {
      // Other errors
      const message =
        error.data?.message || "Đăng nhập thất bại. Vui lòng thử lại.";
      sessionStore.setSignInError("general", message);
      toastStore.error(message, { title: "❌ Sign In Failed" });
    }
  } finally {
    sessionStore.setAuthLoading(false);
  }
};

/**
 * Handle SignUp Submit
 */
const handleSignUp = async () => {
  if (!validateSignUp()) return;

  sessionStore.setAuthLoading(true);

  try {
    const response = await $fetch<any>("/api/auth/signup", {
      method: "POST",
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
    });

    console.log("✅ Sign up successful");

    // Show toast notification FIRST
    toastStore.success("Đăng ký thành công!", {
      title: "✅ Success",
    });

    // Go to OTP verification page (with route param)
    if (response.userId && response.email) {
      sessionStore.goToOTPVerify(response.userId, response.email);

      // Show OTP info toast AFTER page change
      await new Promise((resolve) => setTimeout(resolve, 300));
      toastStore.info("Mã OTP đã được gửi tới email của bạn", {
        title: "📧 Email Verification",
        duration: 5000,
      });
    }

    // Reset forms
    resetSignUpForm();
  } catch (error: any) {
    const message =
      error.data?.message || "Đăng ký thất bại. Vui lòng thử lại.";
    sessionStore.setSignUpError("general", message);
    toastStore.error(message, { title: "❌ Signup Error" });
  } finally {
    sessionStore.setAuthLoading(false);
  }
};

/**
 * Handle OTP Verification
 */
const handleVerifyOTP = async () => {
  if (!otpForm.code.trim()) {
    toastStore.error("Vui lòng nhập mã OTP", { title: "⚠️ Validation" });
    return;
  }

  sessionStore.setAuthLoading(true);

  try {
    const response = await $fetch<any>("/api/auth/verify-otp", {
      method: "POST",
      body: {
        userId: sessionStore.pendingUserId,
        code: otpForm.code,
      },
    });

    toastStore.success("Xác nhận email thành công!", {
      title: "✅ Email Verified",
    });

    // Reset and go back to signin (with route param)
    otpForm.code = "";
    navigateToPage("signin");
  } catch (error: any) {
    const message = error.data?.message || "Xác nhận OTP thất bại";
    toastStore.error(message, { title: "❌ OTP Error" });
  } finally {
    sessionStore.setAuthLoading(false);
  }
};

/**
 * Handle Resend OTP
 */
const handleResendOTP = async () => {
  sessionStore.setAuthLoading(true);

  try {
    await $fetch<any>("/api/auth/resend-otp", {
      method: "POST",
      body: {
        userId: sessionStore.pendingUserId,
      },
    });

    toastStore.success("Mã OTP mới đã được gửi", {
      title: "📧 Resent",
    });
  } catch (error: any) {
    const message = error.data?.message || "Gửi lại OTP thất bại";
    toastStore.error(message, { title: "❌ Error" });
  } finally {
    sessionStore.setAuthLoading(false);
  }
};

/**
 * Handle Forgot Password
 */
const handleForgotPassword = async () => {
  if (!forgotPasswordForm.email.trim()) {
    toastStore.error("Vui lòng nhập email", { title: "⚠️ Validation" });
    return;
  }

  sessionStore.setAuthLoading(true);

  try {
    await $fetch<any>("/api/auth/forgot-password", {
      method: "POST",
      body: {
        email: forgotPasswordForm.email,
      },
    });

    toastStore.success("Hướng dẫn reset mật khẩu đã được gửi", {
      title: "📧 Email Sent",
    });

    // Go to reset password page (with route param)
    sessionStore.goToResetPassword(forgotPasswordForm.email);
    navigateToPage("reset-password");
    forgotPasswordForm.email = "";
  } catch (error: any) {
    const message = error.data?.message || "Gửi email thất bại";
    toastStore.error(message, { title: "❌ Error" });
  } finally {
    sessionStore.setAuthLoading(false);
  }
};

/**
 * Handle Reset Password
 */
const handleResetPassword = async () => {
  if (!resetPasswordForm.code.trim()) {
    toastStore.error("Vui lòng nhập mã xác nhận", { title: "⚠️ Validation" });
    return;
  }

  if (!resetPasswordForm.password.trim()) {
    toastStore.error("Vui lòng nhập mật khẩu mới", { title: "⚠️ Validation" });
    return;
  }

  if (resetPasswordForm.password !== resetPasswordForm.confirmPassword) {
    toastStore.error("Mật khẩu xác nhận không khớp", {
      title: "⚠️ Validation",
    });
    return;
  }

  sessionStore.setAuthLoading(true);

  try {
    await $fetch<any>("/api/auth/reset-password", {
      method: "POST",
      body: {
        email: sessionStore.pendingEmail,
        code: resetPasswordForm.code,
        password: resetPasswordForm.password,
      },
    });

    toastStore.success("Mật khẩu đã được cập nhật!", {
      title: "✅ Success",
    });

    // Reset and go back to signin (with route param)
    resetPasswordForm.code = "";
    resetPasswordForm.password = "";
    resetPasswordForm.confirmPassword = "";
    navigateToPage("signin");
  } catch (error: any) {
    const message = error.data?.message || "Cập nhật mật khẩu thất bại";
    toastStore.error(message, { title: "❌ Error" });
  } finally {
    sessionStore.setAuthLoading(false);
  }
};

/**
 * Handle Verify OTP Email (user nhập email để request resend OTP)
 */
const handleVerifyOTPEmail = async () => {
  if (!verifyOTPEmailForm.email.trim()) {
    toastStore.error("Vui lòng nhập email", { title: "⚠️ Validation" });
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(verifyOTPEmailForm.email)) {
    toastStore.error("Email không hợp lệ", { title: "⚠️ Validation" });
    return;
  }

  sessionStore.setAuthLoading(true);

  try {
    // Call API để lấy user ID từ email
    const response = await $fetch<any>("/api/auth/request-verify-email", {
      method: "POST",
      body: {
        email: verifyOTPEmailForm.email,
      },
    });

    toastStore.success("Mã OTP đã được gửi đến email của bạn", {
      title: "📧 OTP Sent",
    });

    // Set pending user và chuyển sang OTP verify page
    sessionStore.goToOTPVerify(response.userId, verifyOTPEmailForm.email);
    verifyOTPEmailForm.email = "";
  } catch (error: any) {
    const message = error.data?.message || "Gửi OTP thất bại";
    toastStore.error(message, { title: "❌ Error" });
  } finally {
    sessionStore.setAuthLoading(false);
  }
};

/**
 * Reset SignUp Form
 */
const resetSignUpForm = () => {
  signUpForm.username = "";
  signUpForm.email = "";
  signUpForm.password = "";
  signUpForm.confirmPassword = "";
  signUpForm.firstName = "";
  signUpForm.lastName = "";
  signUpForm.phoneNumber = "";
  signUpForm.billingStreet = "";
  signUpForm.billingCity = "";
  signUpForm.billingProvince = "";
  signUpForm.billingZipCode = "";
  signUpForm.billingCountry = "";
  signUpForm.deliveryStreet = "";
  signUpForm.deliveryCity = "";
  signUpForm.deliveryProvince = "";
  signUpForm.deliveryZipCode = "";
  signUpForm.deliveryCountry = "";
};

/**
 * Navigate to page (update URL query param)
 */
const navigateToPage = (page: string) => {
  router.push({
    query: {
      ...route.query,
      auth: page,
    },
  });
  sessionStore.setAuthModalPage(page as any);
};

/**
 * Switch to SignUp page
 */
const goToSignUp = () => {
  navigateToPage("signup");
};

/**
 * Switch back to SignIn page
 */
const goToSignIn = () => {
  navigateToPage("signin");
  resetSignUpForm();
};

/**
 * Toggle address fields
 */
const toggleAddressFields = () => {
  sessionStore.toggleAddressFields();
};
</script>

<template>
  <section id="auth-modal">
    <div class="container py-4">
      <!-- Book-style container -->
      <div class="book-container">
        <!-- Page 1: SignIn -->
        <div
          v-if="currentPage === 'signin'"
          :class="[
            'book-page page-signin',
            {
              active: currentPage === 'signin',
              prev: currentPage !== 'signin',
            },
          ]"
        >
          <div class="page-content">
            <!-- hình decor -->
            <NuxtImg
              src="/images/contact-bg-1.jpg"
              alt="Contact us Konomi Shop"
              class="absolute inset-0 w-full h-full opacity-8 -z-10 object-cover"
            />
            <!-- Header -->
            <div class="mb-10">
              <h2 class="sub_heading">{{ t("auth.signin") }}</h2>
              <h1 class="main_heading">{{ t("auth.signInTitle") }}</h1>
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
                  {{ t("auth.username") }}
                </label>
                <input
                  v-model="signInForm.username"
                  type="text"
                  :placeholder="t('auth.username')"
                  :class="[
                    'w-full px-4 py-3 border rounded-lg transition-colors',
                    signInErrors.username?.message
                      ? 'border-red-500 bg-red-50'
                      : 'border-primary-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-200',
                  ]"
                  :disabled="isLoading"
                />
                <p
                  v-if="signInErrors.username?.message"
                  class="mt-1 text-sm text-red-600"
                >
                  {{ signInErrors.username?.message }}
                </p>
              </div>

              <!-- Password Input -->
              <div>
                <label class="block text-sm font-medium mb-2">{{
                  t("auth.password")
                }}</label>
                <input
                  v-model="signInForm.password"
                  type="password"
                  :placeholder="t('auth.password')"
                  :class="[
                    'w-full px-4 py-3 border rounded-lg transition-colors',
                    signInErrors.password?.message
                      ? 'border-red-500 bg-red-50'
                      : 'border-primary-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-200',
                  ]"
                  :disabled="isLoading"
                />
                <p
                  v-if="signInErrors.password?.message"
                  class="mt-1 text-sm text-red-600"
                >
                  {{ signInErrors.password?.message }}
                </p>
              </div>

              <!-- Submit Button -->
              <div class="flex justify-center">
                <!-- <button
                  type="submit"
                  :disabled="isLoading"
                  class="px-12 py-3 bg-primary-900 hover:bg-primary-600 text-accent-200 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ isLoading ? t('common.processing') : t('auth.signInButton') }}
                </button> -->
                <Button
                  :label="
                    isLoading ? t('common.processing') : t('auth.signInButton')
                  "
                  type="submit"
                  variant="secondary"
                  size="sm"
                  :disabled="isLoading"
                />
              </div>
            </form>

            <!-- Forgot Password Link -->
            <div class="mt-6 space-y-3 text-center">
              <button
                @click="navigateToPage('forgot-password')"
                type="button"
                class="text-primary-900 hover:text-primary-600 border-0 border-b border-dashed border-primary-900 hover:border-primary-600 text-sm font-medium"
              >
                {{ t("auth.forgotPassword") }}
              </button>
              <br />
              <button
                @click="navigateToPage('verify-otp-email')"
                type="button"
                class="text-accent-600 hover:text-accent-700 border-0 border-b border-dashed border-accent-600 hover:border-accent-700 text-sm font-medium"
              >
                {{ t("auth.verifyEmailAgain") }}
              </button>
              <!-- Show button to reopen OTP modal only if there's pending OTP -->
              <br v-if="pendingUserId && pendingEmail" />
              <button
                v-if="pendingUserId && pendingEmail"
                @click="sessionStore.setAuthModalPage('otp-verify')"
                type="button"
                class="text-yellow-600 hover:text-yellow-700 text-sm font-medium"
              >
                {{ t("auth.reopenOTPModal") }}
              </button>
            </div>
          </div>

          <!-- Signup CTA -->
          <div class="page-footer">
            <p class="text-center mb-4">{{ t("auth.noAccount") }}</p>
            <div class="flex justify-center">
              <!-- <button
                @click="goToSignUp"
                type="button"
                class="px-8 py-3 border-2 bg-accent-400 hover:bg-accent-400/80 text-primary-850 border-primary-700 hover:text-primary-800 font-semibold transition-colors"
              >
                {{ t('auth.signUpButton') }}
              </button> -->
              <Button
                :label="t('auth.signUpButton')"
                @click="goToSignUp"
                variant="primary"
                size="sm"
              />
            </div>
          </div>
        </div>

        <!-- Page 2: SignUp -->
        <div
          v-if="currentPage === 'signup'"
          :class="[
            'book-page page-signup',
            {
              active: currentPage === 'signup',
              next: currentPage !== 'signup',
            },
          ]"
        >
          <div class="page-content">
            <!-- hình decor -->
            <NuxtImg
              src="/images/contact-bg-1.jpg"
              alt="Contact us Konomi Shop"
              class="absolute inset-0 w-full h-full opacity-8 -z-10 object-cover"
            />
            <!-- Header -->
            <div class="mb-8">
              <h2 class="sub_heading">{{ t("auth.signup") }}</h2>
              <h1 class="main_heading">{{ t("auth.signUpTitle") }}</h1>
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
                <label class="block text-xs font-medium mb-1"
                  >{{ t("auth.username") }} *</label
                >
                <input
                  v-model="signUpForm.username"
                  type="text"
                  :placeholder="t('auth.username')"
                  :class="[
                    'w-full px-3 py-2 border rounded-lg text-sm transition-colors',
                    signUpErrors.username?.message
                      ? 'border-red-500 bg-red-50'
                      : 'border-primary-300 focus:border-primary-600',
                  ]"
                  :disabled="isLoading"
                />
                <p
                  v-if="signUpErrors.username?.message"
                  class="mt-1 text-xs text-red-600"
                >
                  {{ signUpErrors.username?.message }}
                </p>
              </div>

              <!-- Email -->
              <div>
                <label class="block text-xs font-medium mb-1"
                  >{{ t("auth.email") }} *</label
                >
                <input
                  v-model="signUpForm.email"
                  type="email"
                  placeholder="example@email.com"
                  :class="[
                    'w-full px-3 py-2 border rounded-lg text-sm transition-colors',
                    signUpErrors.email?.message
                      ? 'border-red-500 bg-red-50'
                      : 'border-primary-300 focus:border-primary-600',
                  ]"
                  :disabled="isLoading"
                />
                <p
                  v-if="signUpErrors.email?.message"
                  class="mt-1 text-xs text-red-600"
                >
                  {{ signUpErrors.email?.message }}
                </p>
              </div>

              <!-- Password -->
              <div>
                <label class="block text-xs font-medium mb-1"
                  >{{ t("auth.password") }} *</label
                >
                <input
                  v-model="signUpForm.password"
                  type="password"
                  placeholder="Min 8 characters, 1 uppercase, 1 number"
                  :class="[
                    'w-full px-3 py-2 border rounded-lg text-sm transition-colors',
                    signUpErrors.password?.message
                      ? 'border-red-500 bg-red-50'
                      : 'border-primary-300 focus:border-primary-600',
                  ]"
                  :disabled="isLoading"
                />
                <p
                  v-if="signUpErrors.password?.message"
                  class="mt-1 text-xs text-red-600"
                >
                  {{ signUpErrors.password?.message }}
                </p>
              </div>

              <!-- Confirm Password -->
              <div>
                <label class="block text-xs font-medium mb-1"
                  >{{ t("auth.confirmPassword") }} *</label
                >
                <input
                  v-model="signUpForm.confirmPassword"
                  type="password"
                  :placeholder="t('auth.confirmPassword')"
                  :class="[
                    'w-full px-3 py-2 border rounded-lg text-sm transition-colors',
                    signUpErrors.confirmPassword?.message
                      ? 'border-red-500 bg-red-50'
                      : 'border-primary-300 focus:border-primary-600',
                  ]"
                  :disabled="isLoading"
                />
                <p
                  v-if="signUpErrors.confirmPassword?.message"
                  class="mt-1 text-xs text-red-600"
                >
                  {{ signUpErrors.confirmPassword?.message }}
                </p>
              </div>

              <!-- First Name -->
              <div>
                <label class="block text-xs font-medium mb-1"
                  >{{ t("auth.firstName") }} *</label
                >
                <input
                  v-model="signUpForm.firstName"
                  type="text"
                  :placeholder="t('auth.firstName')"
                  :class="[
                    'w-full px-3 py-2 border rounded-lg text-sm transition-colors',
                    signUpErrors.firstName?.message
                      ? 'border-red-500 bg-red-50'
                      : 'border-primary-300 focus:border-primary-600',
                  ]"
                  :disabled="isLoading"
                />
                <p
                  v-if="signUpErrors.firstName?.message"
                  class="mt-1 text-xs text-red-600"
                >
                  {{ signUpErrors.firstName?.message }}
                </p>
              </div>

              <!-- Last Name -->
              <div>
                <label class="block text-xs font-medium mb-1"
                  >{{ t("auth.lastName") }} *</label
                >
                <input
                  v-model="signUpForm.lastName"
                  type="text"
                  :placeholder="t('auth.lastName')"
                  :class="[
                    'w-full px-3 py-2 border rounded-lg text-sm transition-colors',
                    signUpErrors.lastName?.message
                      ? 'border-red-500 bg-red-50'
                      : 'border-primary-300 focus:border-primary-600',
                  ]"
                  :disabled="isLoading"
                />
                <p
                  v-if="signUpErrors.lastName?.message"
                  class="mt-1 text-xs text-red-600"
                >
                  {{ signUpErrors.lastName?.message }}
                </p>
              </div>

              <!-- Phone Number -->
              <div>
                <label class="block text-xs font-medium mb-1">{{
                  t("auth.phoneNumberOptional")
                }}</label>
                <input
                  v-model="signUpForm.phoneNumber"
                  type="tel"
                  :placeholder="t('auth.phoneNumber')"
                  :class="[
                    'w-full px-3 py-2 border rounded-lg text-sm transition-colors',
                    signUpErrors.phoneNumber?.message
                      ? 'border-red-500 bg-red-50'
                      : 'border-primary-300 focus:border-primary-600',
                  ]"
                  :disabled="isLoading"
                />
                <p
                  v-if="signUpErrors.phoneNumber?.message"
                  class="mt-1 text-xs text-red-600"
                >
                  {{ signUpErrors.phoneNumber?.message }}
                </p>
              </div>

              <!-- Address Fields Toggle -->
              <button
                type="button"
                @click="toggleAddressFields"
                class="text-xs font-medium text-accent-600 hover:text-accent-700 border-0 border-b border-dashed border-accent-600 hover:border-accent-700 transition-colors"
              >
                {{
                  showAddressFields
                    ? t("auth.hideAddress")
                    : t("auth.showAddress")
                }}
              </button>

              <!-- Billing Address (Collapsible) -->
              <div v-if="showAddressFields">
                <p class="text-xs font-semibold text-neutral-700">
                  {{ t("auth.billingAddress") }}
                </p>
                <div class="grid grid-cols-2 gap-3">
                  <input
                    v-model="signUpForm.billingStreet"
                    type="text"
                    :placeholder="t('auth.streetAddress')"
                    class="col-span-2 px-3 py-2 border border-primary-300 rounded-lg text-xs"
                  />
                  <input
                    v-model="signUpForm.billingCity"
                    type="text"
                    :placeholder="t('auth.city')"
                    class="px-3 py-2 border border-primary-300 rounded-lg text-xs"
                  />
                  <input
                    v-model="signUpForm.billingProvince"
                    type="text"
                    :placeholder="t('auth.province')"
                    class="px-3 py-2 border border-primary-300 rounded-lg text-xs"
                  />
                  <input
                    v-model="signUpForm.billingZipCode"
                    type="text"
                    :placeholder="t('auth.zipCode')"
                    class="px-3 py-2 border border-primary-300 rounded-lg text-xs"
                  />
                  <input
                    v-model="signUpForm.billingCountry"
                    type="text"
                    :placeholder="t('auth.country')"
                    class="px-3 py-2 border border-primary-300 rounded-lg text-xs"
                  />
                </div>

                <p class="text-xs font-semibold text-neutral-700 pt-2">
                  {{ t("auth.deliveryAddress") }}
                </p>
                <div class="grid grid-cols-2 gap-3">
                  <input
                    v-model="signUpForm.deliveryStreet"
                    type="text"
                    :placeholder="t('auth.streetAddress')"
                    class="col-span-2 px-3 py-2 border border-primary-300 rounded-lg text-xs"
                  />
                  <input
                    v-model="signUpForm.deliveryCity"
                    type="text"
                    :placeholder="t('auth.city')"
                    class="px-3 py-2 border border-primary-300 rounded-lg text-xs"
                  />
                  <input
                    v-model="signUpForm.deliveryProvince"
                    type="text"
                    :placeholder="t('auth.province')"
                    class="px-3 py-2 border border-primary-300 rounded-lg text-xs"
                  />
                  <input
                    v-model="signUpForm.deliveryZipCode"
                    type="text"
                    :placeholder="t('auth.zipCode')"
                    class="px-3 py-2 border border-primary-300 rounded-lg text-xs"
                  />
                  <input
                    v-model="signUpForm.deliveryCountry"
                    type="text"
                    :placeholder="t('auth.country')"
                    class="px-3 py-2 border border-primary-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <!-- Submit Button -->
              <div class="flex justify-center mt-6">
                <!-- <button
                  type="submit"
                  :disabled="isLoading"
                  class="px-12 py-3 bg-primary-900 hover:bg-primary-600 text-accent-200 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ isLoading ? t('common.processing') : t('auth.signUpButton') }}
                </button> -->
                <Button
                  :label="
                    isLoading ? t('common.processing') : t('auth.signUpButton')
                  "
                  type="submit"
                  variant="primary"
                  size="sm"
                  :disabled="isLoading"
                />
              </div>
            </form>
          </div>

          <!-- Back to SignIn -->
          <div class="page-footer">
            <p class="text-center mb-4 text-sm">{{ t("auth.haveAccount") }}</p>
            <div class="flex justify-center">
              <!-- <button
                @click="goToSignIn"
                type="button"
                class="px-8 py-3 border-2 bg-accent-400 hover:bg-accent-400/80 text-primary-850 border-primary-700 hover:text-primary-800 font-semibold transition-colors text-sm"
              >
                {{ t('auth.signInButton') }}
              </button> -->
              <Button
                :label="t('auth.signInButton')"
                @click="goToSignIn"
                variant="secondary"
                size="sm"
              />
            </div>
          </div>
        </div>

        <!-- Page 3: OTP Verification -->
        <div
          v-if="currentPage === 'otp-verify'"
          :class="[
            'book-page page-otp-verify',
            {
              active: currentPage === 'otp-verify',
              next: currentPage === 'otp-verify' ? '' : 'next',
            },
          ]"
        >
          <div class="page-content">
            <!-- hình decor -->
            <NuxtImg
              src="/images/contact-bg-1.jpg"
              alt="Contact us Konomi Shop"
              class="absolute inset-0 w-full h-full opacity-8 -z-10 object-cover"
            />
            <!-- Header -->
            <div class="mb-10">
              <h2 class="sub_heading">{{ t("auth.signin") }}</h2>
              <h1 class="main_heading">{{ t("auth.otpTitle") }}</h1>
            </div>

            <p class="text-neutral-600 mb-6 text-sm">
              {{ t("auth.otpCodeSentTo") }}
              <br />
              <strong>{{ pendingEmail }}</strong>
            </p>

            <!-- Form -->
            <form @submit.prevent="handleVerifyOTP" class="space-y-6">
              <!-- OTP Code Input -->
              <div>
                <label class="block text-sm font-medium mb-2">{{
                  t("auth.otpCode")
                }}</label>
                <input
                  v-model="otpForm.code"
                  type="text"
                  :placeholder="t('auth.otpPlaceholder')"
                  maxlength="6"
                  :class="[
                    'w-full px-4 py-3 border rounded-lg transition-colors text-center text-2xl font-bold tracking-widest',
                    'border-primary-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-200',
                  ]"
                  :disabled="isLoading"
                />
              </div>

              <!-- Submit Button -->
              <div class="flex justify-center">
                <!-- <button
                  type="submit"
                  :disabled="isLoading"
                  class="px-12 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ isLoading ? t('common.processing') : t('auth.otpVerifyButton') }}
                </button> -->
                <Button
                  :label="
                    isLoading
                      ? t('common.processing')
                      : t('auth.otpVerifyButton')
                  "
                  type="submit"
                  variant="primary"
                  size="sm"
                  :disabled="isLoading"
                />
              </div>
            </form>

            <!-- Resend OTP -->
            <div class="mt-6 text-center">
              <!-- <button
                @click="handleResendOTP"
                type="button"
                :disabled="isLoading"
                class="text-primary-600 hover:text-primary-700 text-sm font-medium disabled:opacity-50"
              >
                {{ t('auth.otpResendButton') }}
              </button> -->
              <Button
                :label="t('auth.otpResendButton')"
                @click="handleResendOTP"
                variant="primary"
                size="sm"
                :disabled="isLoading"
              />
            </div>
          </div>

          <!-- Back Button -->
          <div class="page-footer">
            <div class="flex justify-center">
              <!-- <button
                @click="navigateToPage('signin')"
                type="button"
                class="px-8 py-3 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 font-semibold transition-colors"
              >
                {{ t('auth.backButton') }}
              </button> -->
              <Button
                :label="t('auth.backButton')"
                @click="navigateToPage('signin')"
                variant="secondary"
                size="sm"
              />
            </div>
          </div>
        </div>

        <!-- Page 4: Forgot Password -->
        <div
          v-if="currentPage === 'forgot-password'"
          :class="[
            'book-page page-forgot-password',
            { active: currentPage === 'forgot-password' },
          ]"
        >
          <div class="page-content">
            <!-- hình decor -->
            <NuxtImg
              src="/images/contact-bg-1.jpg"
              alt="Contact us Konomi Shop"
              class="absolute inset-0 w-full h-full opacity-8 -z-10 object-cover"
            />
            <!-- Header -->
            <div class="mb-10">
              <h2 class="sub_heading">{{ t("auth.forgotPasswordTitle") }}</h2>
              <h1 class="main_heading">{{ t("auth.resetPasswordTitle") }}</h1>
            </div>

            <p class="text-neutral-600 mb-6 text-sm">
              {{ t("auth.forgotPasswordDescription") }}
            </p>

            <!-- Form -->
            <form @submit.prevent="handleForgotPassword" class="space-y-6">
              <!-- Email Input -->
              <div>
                <label class="block text-sm font-medium mb-2">{{
                  t("auth.email")
                }}</label>
                <input
                  v-model="forgotPasswordForm.email"
                  type="email"
                  :placeholder="t('auth.email')"
                  :class="[
                    'w-full px-4 py-3 border rounded-lg transition-colors',
                    'border-primary-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-200',
                  ]"
                  :disabled="isLoading"
                />
              </div>

              <!-- Submit Button -->
              <div class="flex justify-center">
                <!-- <button
                  type="submit"
                  :disabled="isLoading"
                  class="px-12 py-3 bg-primary-900 hover:bg-primary-600 text-accent-200 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ isLoading ? t('common.processing') : t('auth.forgotPasswordButton') }}
                </button> -->
                <Button
                  :label="
                    isLoading
                      ? t('common.processing')
                      : t('auth.forgotPasswordButton')
                  "
                  type="submit"
                  variant="primary"
                  size="sm"
                  :disabled="isLoading"
                />
              </div>
            </form>
          </div>

          <!-- Back to SignIn -->
          <div class="page-footer">
            <div class="flex justify-center">
              <!-- <button
                @click="navigateToPage('signin')"
                type="button"
                class="px-8 py-3 border-2 bg-accent-400 hover:bg-accent-400/80 text-primary-850 border-primary-700 hover:text-primary-800 font-semibold transition-colors"
              >
                {{ t('auth.backToSignIn') }}
              </button> -->
              <Button
                :label="t('auth.backToSignIn')"
                @click="navigateToPage('signin')"
                variant="secondary"
                size="sm"
              />
            </div>
          </div>
        </div>

        <!-- Page 5: Reset Password -->
        <div
          v-if="currentPage === 'reset-password'"
          :class="[
            'book-page page-reset-password',
            { active: currentPage === 'reset-password' },
          ]"
        >
          <div class="page-content">
            <!-- hình decor -->
            <NuxtImg
              src="/images/contact-bg-1.jpg"
              alt="Contact us Konomi Shop"
              class="absolute inset-0 w-full h-full opacity-5 -z-10 object-cover"
            />
            <!-- Header -->
            <div class="mb-10">
              <h2 class="sub_heading">{{ t("auth.resetPasswordTitle") }}</h2>
              <h1 class="main_heading">{{ t("auth.newPassword") }}</h1>
            </div>

            <p class="text-neutral-600 mb-6 text-sm">
              {{ t("auth.resetPasswordDescription") }}
            </p>

            <!-- Form -->
            <form @submit.prevent="handleResetPassword" class="space-y-6">
              <!-- OTP Code Input -->
              <div>
                <label class="block text-sm font-medium mb-2">{{
                  t("auth.resetCode")
                }}</label>
                <input
                  v-model="resetPasswordForm.code"
                  type="text"
                  :placeholder="t('auth.resetCode')"
                  :class="[
                    'w-full px-4 py-3 border rounded-lg transition-colors',
                    'border-primary-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-200',
                  ]"
                  :disabled="isLoading"
                />
              </div>

              <!-- New Password Input -->
              <div>
                <label class="block text-sm font-medium mb-2">{{
                  t("auth.newPassword")
                }}</label>
                <input
                  v-model="resetPasswordForm.password"
                  type="password"
                  :placeholder="t('auth.newPassword')"
                  :class="[
                    'w-full px-4 py-3 border rounded-lg transition-colors',
                    'border-primary-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-200',
                  ]"
                  :disabled="isLoading"
                />
              </div>

              <!-- Confirm Password Input -->
              <div>
                <label class="block text-sm font-medium mb-2">{{
                  t("auth.confirmNewPassword")
                }}</label>
                <input
                  v-model="resetPasswordForm.confirmPassword"
                  type="password"
                  :placeholder="t('auth.confirmNewPassword')"
                  :class="[
                    'w-full px-4 py-3 border rounded-lg transition-colors',
                    'border-primary-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-200',
                  ]"
                  :disabled="isLoading"
                />
              </div>

              <!-- Submit Button -->
              <div class="flex justify-center">
                <!-- <button
                  type="submit"
                  :disabled="isLoading"
                  class="px-12 py-3 bg-primary-900 hover:bg-primary-600 text-accent-200 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ isLoading ? t('common.processing') : t('auth.resetPasswordButton') }}
                </button> -->
                <Button
                  :label="
                    isLoading
                      ? t('common.processing')
                      : t('auth.resetPasswordButton')
                  "
                  type="submit"
                  variant="primary"
                  size="sm"
                  :disabled="isLoading"
                />
              </div>
            </form>
          </div>

          <!-- Back to SignIn -->
          <div class="page-footer">
            <div class="flex justify-center">
              <!-- <button
                @click="navigateToPage('signin')"
                type="button"
                class="px-8 py-3 border-2 bg-accent-400 hover:bg-accent-400/80 text-primary-850 border-primary-700 hover:text-primary-800 font-semibold transition-colors"
              >
                {{ t('auth.backToSignIn') }}
              </button> -->
              <Button
                :label="t('auth.backToSignIn')"
                @click="navigateToPage('signin')"
                variant="secondary"
                size="sm"
              />
            </div>
          </div>
        </div>

        <!-- Page 6: Verify OTP Email -->
        <div
          v-if="currentPage === 'verify-otp-email'"
          :class="[
            'book-page page-verify-otp-email',
            {
              active: currentPage === 'verify-otp-email',
              next: currentPage !== 'verify-otp-email',
            },
          ]"
        >
          <div class="page-content">
            <!-- hình decor -->
            <NuxtImg
              src="/images/contact-bg-1.jpg"
              alt="Contact us Konomi Shop"
              class="absolute inset-0 w-full h-full opacity-8 -z-10 object-cover"
            />
            <!-- Header -->
            <div class="mb-8">
              <h2 class="sub_heading">{{ t("auth.signin") }}</h2>
              <h1 class="main_heading">{{ t("auth.verifyEmailAgain") }}</h1>
            </div>

            <p class="text-neutral-600 mb-6 text-sm">
              {{ t("auth.forgotPasswordDescription") }}
            </p>

            <!-- Form -->
            <form @submit.prevent="handleVerifyOTPEmail" class="space-y-6">
              <!-- Email Input -->
              <div>
                <label class="block text-sm font-medium mb-2">{{
                  t("auth.email")
                }}</label>
                <input
                  v-model="verifyOTPEmailForm.email"
                  type="email"
                  :placeholder="t('auth.email')"
                  :class="[
                    'w-full px-4 py-3 border rounded-lg transition-colors',
                    'border-primary-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-200',
                  ]"
                  :disabled="isLoading"
                />
              </div>

              <!-- Submit Button -->
              <div class="flex justify-center">
                <!-- <button
                  type="submit"
                  :disabled="isLoading"
                  class="px-12 py-3 bg-primary-900 hover:bg-primary-600 text-accent-200 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ isLoading ? t('common.processing') : t('auth.otpResendButton') }}
                </button> -->
                <Button
                  :label="
                    isLoading
                      ? t('common.processing')
                      : t('auth.otpResendButton')
                  "
                  type="submit"
                  variant="primary"
                  size="sm"
                  :disabled="isLoading"
                />
              </div>
            </form>
          </div>

          <!-- Back to SignIn -->
          <div class="page-footer">
            <div class="flex justify-center">
              <!-- <button
                @click="navigateToPage('signin')"
                type="button"
                class="px-8 py-3 border-2 bg-accent-400 hover:bg-accent-400/80 text-primary-850 border-primary-700 hover:text-primary-800 font-semibold transition-colors"
              >
                {{ t('auth.backToSignIn') }}
              </button> -->
              <Button
                :label="t('auth.backToSignIn')"
                @click="navigateToPage('signin')"
                variant="secondary"
                size="sm"
              />
            </div>
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
  display: flex;
  flex-direction: column;

  /* Page is always visible when rendered */
  opacity: 1;
  transform: translateX(0) rotateY(0);
  pointer-events: auto;
  position: relative;
  
  animation: slideIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.page-content {
  @apply flex-1;
}

.page-footer {
  @apply mt-8 pt-8 border-t border-neutral-200;
}

/* Page-specific styles */
.page-signin,
.page-otp-verify,
.page-forgot-password,
.page-verify-otp-email {
  min-height: 450px;
}

.page-signup,
.page-reset-password {
  min-height: 650px;
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
