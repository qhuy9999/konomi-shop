<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <header class="bg-white border-b h-16">
      <div class="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <NuxtLink to="/" class="font-bold text-blue-600">Konomi</NuxtLink>
        <div class="flex items-center gap-4">
          <LanguageSwitcher />
          <button @click="userMenuOpen = !userMenuOpen" class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold">
            {{ currentUser?.firstName?.charAt(0).toUpperCase() || 'U' }}
          </button>
        <div v-if="userMenuOpen" class="absolute right-4 top-16 bg-white border rounded-lg shadow-lg w-48 py-2">
          <NuxtLink to="/user/profile" class="block px-4 py-2 text-sm hover:bg-gray-50">Profile</NuxtLink>
          <NuxtLink to="/user/orders" class="block px-4 py-2 text-sm hover:bg-gray-50">Orders</NuxtLink>
          <button @click="handleLogout" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Logout</button>
        </div>
        </div>
      </div>
    </header>
    <main class="flex-1">
      <slot />
    </main>
    <!-- Footer -->
    <Footer />
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
