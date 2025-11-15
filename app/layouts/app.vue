<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <header class="bg-white border-b h-16">
      <div class="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <NuxtLink to="/" class="font-bold text-blue-600">Konomi</NuxtLink>
        <button @click="userMenuOpen = !userMenuOpen" class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold">
          {{ currentUser?.firstName?.charAt(0).toUpperCase() || 'U' }}
        </button>
        <div v-if="userMenuOpen" class="absolute right-4 top-16 bg-white border rounded-lg shadow-lg w-48 py-2">
          <NuxtLink to="/user/profile" class="block px-4 py-2 text-sm hover:bg-gray-50">Profile</NuxtLink>
          <NuxtLink to="/user/orders" class="block px-4 py-2 text-sm hover:bg-gray-50">Orders</NuxtLink>
          <button @click="handleLogout" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Logout</button>
        </div>
      </div>
    </header>
    <main class="flex-1">
      <slot />
    </main>
<!-- Footer -->
    <footer class="bg-white shadow-footer z-50 border-t border-neutral-200">
      <div class="container mx-auto px-4 py-12">
        <!-- Footer Grid -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <!-- Liên Hệ -->
          <div>
            <h4 class="font-semibold text-gray-900 mb-4">📞 Liên Hệ</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li><a href="tel:+84123456789" class="hover:text-blue-600">Hotline: +84 (0)123 456 789</a></li>
              <li><a href="mailto:support@konomi.com" class="hover:text-blue-600">Email: support@konomi.com</a></li>
              <li><a href="#" class="hover:text-blue-600">Văn phòng: 123 Đường ABC, Tp. HCM</a></li>
              <li><a href="#" class="hover:text-blue-600">Giờ làm việc: 8:00 - 22:00 hàng ngày</a></li>
            </ul>
          </div>

          <!-- Hướng Dẫn Mua Hàng -->
          <div>
            <h4 class="font-semibold text-gray-900 mb-4">🛒 Hướng Dẫn Mua Hàng</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li><a href="#" class="hover:text-blue-600">Cách tìm kiếm sản phẩm</a></li>
              <li><a href="#" class="hover:text-blue-600">Cách đặt hàng</a></li>
              <li><a href="#" class="hover:text-blue-600">Phương thức thanh toán</a></li>
              <li><a href="#" class="hover:text-blue-600">Các khuyến mãi & ưu đãi</a></li>
            </ul>
          </div>

          <!-- Giao Hàng & Hoàn Trả -->
          <div>
            <h4 class="font-semibold text-gray-900 mb-4">📦 Giao Hàng & Hoàn Trả</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li><a href="#" class="hover:text-blue-600">Chính sách giao hàng</a></li>
              <li><a href="#" class="hover:text-blue-600">Phí vận chuyển</a></li>
              <li><a href="#" class="hover:text-blue-600">Chính sách hoàn trả & đổi trả</a></li>
              <li><a href="#" class="hover:text-blue-600">Theo dõi đơn hàng</a></li>
            </ul>
          </div>

          <!-- Điều Khoản & Chính Sách -->
          <div>
            <h4 class="font-semibold text-gray-900 mb-4">📋 Điều Khoản & Chính Sách</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li><a href="#" class="hover:text-blue-600">Điều khoản sử dụng</a></li>
              <li><a href="#" class="hover:text-blue-600">Chính sách bảo mật</a></li>
              <li><a href="#" class="hover:text-blue-600">Chính sách cookies</a></li>
              <li><a href="#" class="hover:text-blue-600">Về chúng tôi</a></li>
            </ul>
          </div>
        </div>

        <!-- Divider -->
        <div class="border-t border-neutral-200 pt-8">
          <div class="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <p>&copy; 2025 Konomi Shop. All rights reserved.</p>
            <div class="flex gap-6 mt-4 md:mt-0">
              <a href="#" class="hover:text-blue-600">Facebook</a>
              <a href="#" class="hover:text-blue-600">Twitter</a>
              <a href="#" class="hover:text-blue-600">Instagram</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
const userMenuOpen = ref(false)
const authStore = useAuthStore()
const currentUser = computed(() => authStore.currentUser)

const handleLogout = async () => {
  await authStore.logout()
  userMenuOpen.value = false
  router.push('/')
}

onMounted(() => {
  document.addEventListener('click', () => {
    userMenuOpen.value = false
  })
})
</script>
