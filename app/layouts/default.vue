<script setup lang="ts">
import { ref } from 'vue'

// Mobile menu state
const mobileMenuOpen = ref(false)

// Navigation links
const navLinks = [
  { label: 'Trang Chủ', href: '/' },
  { label: 'Sản Phẩm', href: '#products' },
  { label: 'Về Chúng Tôi', href: '#about' },
  { label: 'Liên Hệ', href: '#contact' },
]

// Close menu when clicking a link
const closeMenu = () => {
  mobileMenuOpen.value = false
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white shadow-md shadow-accent-100">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center justify-center py-4">
          <NuxtImg src="images/logo.png" alt="logo" class="w-16 h-16" />
          <NuxtLink to="/" class="text-2xl font-bold text-primary-600">
            Konomi Shop
          </NuxtLink>
        </div>

        <!-- Desktop Navigation (md+) -->
        <nav class="hidden md:flex items-center gap-8">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.href"
            :to="link.href"
            class="text-neutral-700 hover:text-primary-600 transition-colors font-medium"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>

        <!-- Mobile Menu Button (sm only) -->
        <button
          class="md:hidden p-2 text-neutral-700 hover:text-primary-600 transition-colors"
          @click="mobileMenuOpen = !mobileMenuOpen"
          aria-label="Toggle menu"
        >
          <UIcon
            :name="mobileMenuOpen ? 'i-lucide-x' : 'i-custom-menu-icon'"
          />
        </button>
      </div>

      <!-- Mobile Navigation Dropdown (sm only) -->
      <transition
        enter-active-class="transition duration-200"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-200"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <nav
          v-show="mobileMenuOpen"
          class="md:hidden bg-neutral-50 border-t border-neutral-200"
        >
          <div class="container py-4 flex flex-col gap-3">
            <NuxtLink
              v-for="link in navLinks"
              :key="link.href"
              :to="link.href"
              class="px-4 py-2 text-neutral-700 hover:bg-primary-50 hover:text-primary-600 rounded-md transition-colors font-medium"
              @click="closeMenu"
            >
              {{ link.label }}
            </NuxtLink>
          </div>
        </nav>
      </transition>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer (Optional) -->
    <footer class="bg-white shadow-footer z-50">
      <div class="container text-center">
        <p>&copy; 2025 Konomi Shop. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Smooth transitions */
</style>
