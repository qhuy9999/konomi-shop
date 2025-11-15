<script setup lang="ts">
import { computed, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useToastStore } from '~/stores/toast'

const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()
const currentUser = computed(() => authStore.currentUser)

// UI states
const isEditMode = ref(false)
const showChangePasswordModal = ref(false)
const isLoadingEdit = ref(false)
const isLoadingPassword = ref(false)

// Edit form
const editForm = reactive({
  username: currentUser.value?.username || '',
  email: currentUser.value?.email || '',
  firstName: currentUser.value?.firstName || '',
  lastName: currentUser.value?.lastName || '',
  phoneNumber: currentUser.value?.phoneNumber || '',
  billingStreet: currentUser.value?.billingStreet || '',
  billingCity: currentUser.value?.billingCity || '',
  billingProvince: currentUser.value?.billingProvince || '',
  billingZipCode: currentUser.value?.billingZipCode || '',
  billingCountry: currentUser.value?.billingCountry || '',
  deliveryStreet: currentUser.value?.deliveryStreet || '',
  deliveryCity: currentUser.value?.deliveryCity || '',
  deliveryProvince: currentUser.value?.deliveryProvince || '',
  deliveryZipCode: currentUser.value?.deliveryZipCode || '',
  deliveryCountry: currentUser.value?.deliveryCountry || '',
})

// Password form
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// Enter edit mode
const handleEnterEditMode = (): void => {
  if (currentUser.value) {
    editForm.username = currentUser.value.username
    editForm.email = currentUser.value.email
    editForm.firstName = currentUser.value.firstName
    editForm.lastName = currentUser.value.lastName
    editForm.phoneNumber = currentUser.value.phoneNumber || ''
    editForm.billingStreet = currentUser.value.billingStreet || ''
    editForm.billingCity = currentUser.value.billingCity || ''
    editForm.billingProvince = currentUser.value.billingProvince || ''
    editForm.billingZipCode = currentUser.value.billingZipCode || ''
    editForm.billingCountry = currentUser.value.billingCountry || ''
    editForm.deliveryStreet = currentUser.value.deliveryStreet || ''
    editForm.deliveryCity = currentUser.value.deliveryCity || ''
    editForm.deliveryProvince = currentUser.value.deliveryProvince || ''
    editForm.deliveryZipCode = currentUser.value.deliveryZipCode || ''
    editForm.deliveryCountry = currentUser.value.deliveryCountry || ''
  }
  isEditMode.value = true
}

// Cancel edit mode
const handleCancelEdit = (): void => {
  isEditMode.value = false
}

// Save profile
const handleSaveProfile = async (): Promise<void> => {
  if (!editForm.firstName.trim() || !editForm.lastName.trim()) {
    toastStore.error('Tên và họ không được để trống', { title: '⚠️ Validation' })
    return
  }

  isLoadingEdit.value = true
  try {
    const response = await $fetch<any>('/api/user/update-profile', {
      method: 'PUT',
      body: editForm,
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    })

    // Update auth store
    authStore.setCurrentUser(response.user)
    isEditMode.value = false

    toastStore.success('Cập nhật thông tin thành công!', {
      title: '✅ Success',
    })
  } catch (error: any) {
    // Handle token expiration
    if (error.status === 403 && error.data?.message?.includes('expired')) {
      try {
        // Try to refresh token
        const refreshResponse = await $fetch<any>('/api/auth/refresh', {
          method: 'POST',
        })

        if (refreshResponse.accessToken) {
          // Update token in auth store
          authStore.setTokens(refreshResponse.accessToken)

          // Retry the save request with new token
          const retryResponse = await $fetch<any>('/api/user/update-profile', {
            method: 'PUT',
            body: editForm,
            headers: {
              Authorization: `Bearer ${refreshResponse.accessToken}`,
            },
          })

          authStore.setCurrentUser(retryResponse.user)
          isEditMode.value = false

          toastStore.success('Cập nhật thông tin thành công!', {
            title: '✅ Success',
          })
          return
        }
      } catch (refreshError: any) {
        // Refresh failed - redirect to login
        toastStore.error('Phiên làm việc hết hạn. Vui lòng đăng nhập lại.', { title: '❌ Session Expired' })
        await authStore.logout()
        navigateTo('/?auth=signin')
        return
      }
    }

    const message = error.data?.message || 'Cập nhật thất bại'
    toastStore.error(message, { title: '❌ Error' })
  } finally {
    isLoadingEdit.value = false
  }
}

// Change password
const handleChangePassword = async (): Promise<void> => {
  if (!passwordForm.currentPassword.trim()) {
    toastStore.error('Vui lòng nhập mật khẩu hiện tại', { title: '⚠️ Validation' })
    return
  }

  if (!passwordForm.newPassword.trim()) {
    toastStore.error('Vui lòng nhập mật khẩu mới', { title: '⚠️ Validation' })
    return
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    toastStore.error('Mật khẩu xác nhận không khớp', { title: '⚠️ Validation' })
    return
  }

  if (passwordForm.newPassword.length < 8) {
    toastStore.error('Mật khẩu mới phải có ít nhất 8 ký tự', { title: '⚠️ Validation' })
    return
  }

  isLoadingPassword.value = true
  try {
    await $fetch('/api/user/change-password', {
      method: 'POST',
      body: {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      },
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    })

    showChangePasswordModal.value = false
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''

    toastStore.success('Đổi mật khẩu thành công!', {
      title: '✅ Success',
    })
  } catch (error: any) {
    // Handle token expiration
    if (error.status === 403 && error.data?.message?.includes('expired')) {
      try {
        // Try to refresh token
        const refreshResponse = await $fetch<any>('/api/auth/refresh', {
          method: 'POST',
        })

        if (refreshResponse.accessToken) {
          // Update token in auth store
          authStore.setTokens(refreshResponse.accessToken)

          // Retry the password change request with new token
          await $fetch('/api/user/change-password', {
            method: 'POST',
            body: {
              currentPassword: passwordForm.currentPassword,
              newPassword: passwordForm.newPassword,
            },
            headers: {
              Authorization: `Bearer ${refreshResponse.accessToken}`,
            },
          })

          showChangePasswordModal.value = false
          passwordForm.currentPassword = ''
          passwordForm.newPassword = ''
          passwordForm.confirmPassword = ''

          toastStore.success('Đổi mật khẩu thành công!', {
            title: '✅ Success',
          })
          return
        }
      } catch (refreshError: any) {
        // Refresh failed - redirect to login
        toastStore.error('Phiên làm việc hết hạn. Vui lòng đăng nhập lại.', { title: '❌ Session Expired' })
        await authStore.logout()
        navigateTo('/?auth=signin')
        return
      }
    }

    const message = error.data?.message || 'Đổi mật khẩu thất bại'
    toastStore.error(message, { title: '❌ Error' })
  } finally {
    isLoadingPassword.value = false
  }
}

// Logout handler
const handleLogout = async (): Promise<void> => {
  await authStore.logout()
  navigateTo('/?auth=signin')
}
</script>

<template>
  <div class="min-h-screen bg-linear-to-b from-neutral-50 to-neutral-100 py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-neutral-900 mb-2">Hồ Sơ Người Dùng</h1>
        <p class="text-neutral-600">Quản lý thông tin cá nhân của bạn</p>
      </div>

      <!-- Profile Card -->
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <!-- Profile Header with Avatar -->
        <div class="bg-linear-to-r from-primary-600 to-primary-800 px-8 py-12">
          <div class="flex items-start gap-6">
            <!-- Avatar -->
            <div class="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span class="text-4xl font-bold text-primary-600">
                {{ currentUser?.firstName?.charAt(0).toUpperCase() }}{{ currentUser?.lastName?.charAt(0).toUpperCase() }}
              </span>
            </div>

            <!-- User Name & Role -->
            <div class="flex-1 text-white pt-2">
              <h2 class="text-3xl font-bold mb-2">
                {{ currentUser?.firstName }} {{ currentUser?.lastName }}
              </h2>
              <p class="text-primary-100">Thành viên Konomi Shop</p>
            </div>

            <!-- Edit Mode Toggle Button -->
            <div v-if="!isEditMode">
              <button 
                @click="handleEnterEditMode"
                class="px-4 py-2 bg-white text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-colors"
              >
                ✏️ Chỉnh Sửa
              </button>
            </div>
          </div>
        </div>

        <!-- Profile Content -->
        <div class="p-8 space-y-8">
          <!-- Basic Info Section -->
          <section>
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-2xl font-bold text-neutral-900">📝 Thông Tin Cơ Bản</h3>
              <div v-if="isEditMode" class="flex gap-3">
                <button 
                  @click="handleCancelEdit"
                  class="px-4 py-2 border border-neutral-300 rounded-lg font-medium hover:bg-neutral-50 transition-colors"
                >
                  Hủy
                </button>
                <button 
                  @click="handleSaveProfile"
                  :disabled="isLoadingEdit"
                  class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium disabled:opacity-50 transition-colors"
                >
                  {{ isLoadingEdit ? 'Đang lưu...' : '💾 Lưu Thay Đổi' }}
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Username (Locked) -->
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">Tên Người Dùng 🔒 Admin Only</label>
                <input 
                  :value="editForm.username"
                  disabled
                  type="text" 
                  class="w-full px-4 py-2 border border-neutral-300 rounded-lg bg-neutral-100 text-neutral-600 cursor-not-allowed"
                />
              </div>

              <!-- Email (Locked) -->
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">Email 🔒 Admin Only</label>
                <input 
                  :value="editForm.email"
                  disabled
                  type="email" 
                  class="w-full px-4 py-2 border border-neutral-300 rounded-lg bg-neutral-100 text-neutral-600 cursor-not-allowed"
                />
              </div>

              <!-- First Name -->
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">Tên</label>
                <input 
                  v-model="editForm.firstName"
                  :disabled="!isEditMode"
                  type="text" 
                  class="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-600 disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-600"
                />
              </div>

              <!-- Last Name -->
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">Họ</label>
                <input 
                  v-model="editForm.lastName"
                  :disabled="!isEditMode"
                  type="text" 
                  class="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-600 disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-600"
                />
              </div>

              <!-- Phone Number -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-neutral-700 mb-2">Số Điện Thoại</label>
                <input 
                  v-model="editForm.phoneNumber"
                  :disabled="!isEditMode"
                  type="tel" 
                  class="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-600 disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-600"
                />
              </div>
            </div>
          </section>

          <!-- Billing Address Section -->
          <section class="border-t border-neutral-200 pt-8">
            <h3 class="text-2xl font-bold text-neutral-900 mb-6">🏠 Địa Chỉ Thanh Toán</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Street -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-neutral-700 mb-2">Địa Chỉ</label>
                <input 
                  v-model="editForm.billingStreet"
                  :disabled="!isEditMode"
                  type="text" 
                  class="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-600 disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-600"
                />
              </div>

              <!-- City -->
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">Thành Phố</label>
                <input 
                  v-model="editForm.billingCity"
                  :disabled="!isEditMode"
                  type="text" 
                  class="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-600 disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-600"
                />
              </div>

              <!-- Province -->
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">Tỉnh/Thành Phố</label>
                <input 
                  v-model="editForm.billingProvince"
                  :disabled="!isEditMode"
                  type="text" 
                  class="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-600 disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-600"
                />
              </div>

              <!-- Zip Code -->
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">Mã Bưu Điện</label>
                <input 
                  v-model="editForm.billingZipCode"
                  :disabled="!isEditMode"
                  type="text" 
                  class="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-600 disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-600"
                />
              </div>

              <!-- Country -->
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">Quốc Gia</label>
                <input 
                  v-model="editForm.billingCountry"
                  :disabled="!isEditMode"
                  type="text" 
                  class="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-600 disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-600"
                />
              </div>
            </div>
          </section>

          <!-- Delivery Address Section -->
          <section class="border-t border-neutral-200 pt-8">
            <h3 class="text-2xl font-bold text-neutral-900 mb-6">📦 Địa Chỉ Giao Hàng</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Street -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-neutral-700 mb-2">Địa Chỉ</label>
                <input 
                  v-model="editForm.deliveryStreet"
                  :disabled="!isEditMode"
                  type="text" 
                  class="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-600 disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-600"
                />
              </div>

              <!-- City -->
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">Thành Phố</label>
                <input 
                  v-model="editForm.deliveryCity"
                  :disabled="!isEditMode"
                  type="text" 
                  class="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-600 disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-600"
                />
              </div>

              <!-- Province -->
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">Tỉnh/Thành Phố</label>
                <input 
                  v-model="editForm.deliveryProvince"
                  :disabled="!isEditMode"
                  type="text" 
                  class="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-600 disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-600"
                />
              </div>

              <!-- Zip Code -->
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">Mã Bưu Điện</label>
                <input 
                  v-model="editForm.deliveryZipCode"
                  :disabled="!isEditMode"
                  type="text" 
                  class="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-600 disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-600"
                />
              </div>

              <!-- Country -->
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">Quốc Gia</label>
                <input 
                  v-model="editForm.deliveryCountry"
                  :disabled="!isEditMode"
                  type="text" 
                  class="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-600 disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-600"
                />
              </div>
            </div>
          </section>

          <!-- Account Actions -->
          <section class="border-t border-neutral-200 pt-8">
            <h3 class="text-2xl font-bold text-neutral-900 mb-6">⚙️ Hành Động Tài Khoản</h3>

            <div class="flex flex-col sm:flex-row gap-4">
              <button 
                @click="showChangePasswordModal = true"
                class="flex-1 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold transition-colors"
              >
                🔐 Đổi Mật Khẩu
              </button>
              <button 
                @click="handleLogout"
                class="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
              >
                🚪 Đăng Xuất
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>

  <!-- Change Password Modal -->
  <Teleport to="body">
    <transition name="modal">
      <div v-if="showChangePasswordModal" class="fixed inset-0 bg-neutral-900 bg-opacity-90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full">
          <!-- Modal Header -->
          <div class="border-b border-neutral-200 p-6">
            <h2 class="text-2xl font-bold text-neutral-900">🔐 Đổi Mật Khẩu</h2>
            <p class="text-neutral-600 text-sm mt-1">Cập nhật mật khẩu để bảo vệ tài khoản của bạn</p>
          </div>

          <!-- Modal Content -->
          <div class="p-6">
            <form @submit.prevent="handleChangePassword" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">Mật Khẩu Hiện Tại</label>
                <input 
                  v-model="passwordForm.currentPassword" 
                  type="password" 
                  placeholder="Nhập mật khẩu hiện tại" 
                  class="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-600"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">Mật Khẩu Mới</label>
                <input 
                  v-model="passwordForm.newPassword" 
                  type="password" 
                  placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)" 
                  class="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-600"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">Xác Nhận Mật Khẩu</label>
                <input 
                  v-model="passwordForm.confirmPassword" 
                  type="password" 
                  placeholder="Xác nhận mật khẩu mới" 
                  class="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-600"
                />
              </div>

              <!-- Modal Footer -->
              <div class="flex gap-4 pt-6 border-t border-neutral-200">
                <button type="button" @click="showChangePasswordModal = false" class="flex-1 px-4 py-2 border border-neutral-300 rounded-lg font-medium hover:bg-neutral-50">
                  Hủy
                </button>
                <button type="submit" :disabled="isLoadingPassword" class="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium disabled:opacity-50">
                  {{ isLoadingPassword ? 'Đang xử lý...' : 'Đổi Mật Khẩu' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>