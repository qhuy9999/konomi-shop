<script setup lang="ts">
import { ref } from "vue";
import { useSessionStore } from "@/stores/session";

// Stores
const sessionStore = useSessionStore();

// Mobile menu state
const mobileMenuOpen = ref(false);

// Navigation links
const navLinks = [
  { label: "Trang Chủ", href: "/" },
  { label: "Sản Phẩm", href: "#products" },
  { label: "Về Chúng Tôi", href: "#about" },
  { label: "Liên Hệ", href: "#contact" },
];

// Close menu when clicking a link
const closeMenu = () => {
  mobileMenuOpen.value = false;
};

// Handle Sign In button
const handleSignIn = () => {
  sessionStore.setAuthModalPage('signin');
};

// Handle Sign Up button
const handleSignUp = () => {
  sessionStore.setAuthModalPage('signup');
};
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white shadow-md shadow-accent-100">
      <div class="flex items-center justify-between px-4 md:px-8">
        <!-- Logo -->
        <div class="flex items-center justify-center py-4">
          <NuxtImg src="images/logo.png" alt="logo" class="w-16 h-16" />
          <NuxtLink to="/" class="text-2xl font-bold text-primary-600">
            Konomi Shop
          </NuxtLink>
        </div>

        <!-- Desktop Navigation (md+) -->
        <nav
          class="hidden lg:flex items-center gap-6 pr-4"
        >
          <NuxtLink
            v-for="link in navLinks"
            :key="link.href"
            :to="link.href"
            class="text-neutral-700 hover:text-primary-600 transition-colors font-medium"
          >
            {{ link.label }}
          </NuxtLink>

          <!-- Auth Buttons -->
          <div class="flex gap-3 ml-auto pl-4 border-l border-neutral-200">
            <Button
              label="Đăng Nhập"
              to="/auth?auth=signin"
              variant="secondary"
              size="sm"
              @click="handleSignIn"
            />
            <Button
              label="Đăng Ký"
              to="/auth?auth=signup"
              variant="primary"
              size="sm"
              @click="handleSignUp"
            />
          </div>
        </nav>

        <!-- Mobile Menu Button (sm only) -->
        <button
          class="lg:hidden px-0 py-0 border-0 p-2 text-neutral-700 hover:text-primary-600 transition-colors"
          @click="mobileMenuOpen = !mobileMenuOpen"
          aria-label="Toggle menu"
        >
          <UIcon
            :name="mobileMenuOpen ? 'i-lucide-x' : 'i-lucide-menu'"
            class="w-12 h-12"
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
          class="lg:hidden bg-neutral-50 border-t border-neutral-200"
        >
          <div class="py-4 flex flex-col items-center justify-center gap-1">
            <!-- Nav Links - Centered -->
            <div class="grid grid-cols-2 sm:flex sm:flex-row sm:justify-center gap-3 w-full">
              <NuxtLink
                v-for="link in navLinks"
                :key="link.href"
                :to="link.href"
                class="px-4 py-2 text-neutral-700 hover:bg-primary-50 hover:text-primary-600 rounded-md transition-colors font-medium whitespace-nowrap text-center"
                @click="closeMenu"
              >
                {{ link.label }}
              </NuxtLink>
            </div>

            <!-- Mobile Auth Buttons - Centered on sm-md, Horizontal on md+ -->
            <div class="grid grid-cols-2 sm:flex sm:flex-row sm:items-center gap-3 w-auto">
              <Button
                label="Đăng Nhập"
                to="/auth?auth=signin"
                variant="secondary"
                size="sm"
                @click="handleSignIn; closeMenu()"
              />
              <Button
                label="Đăng Ký"
                to="/auth?auth=signup"
                variant="primary"
                size="sm"
                @click="handleSignUp; closeMenu()"
              />
            </div>
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
