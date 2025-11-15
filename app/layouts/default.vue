<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useSessionStore } from "@/stores/session";
import { useAuthStore } from "@/stores/auth";

// Stores
const sessionStore = useSessionStore();
const authStore = useAuthStore();
const router = useRouter();

// Computed
const isAuthenticated = computed(() => !!authStore.accessToken);
const currentUser = computed(() => authStore.currentUser);

// Mobile menu state
const mobileMenuOpen = ref(false);
const userMenuOpen = ref(false);

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

// Handle Logout
const handleLogout = async () => {
  await authStore.logout();
  userMenuOpen.value = false;
  router.push('/?auth=signin');
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

          <!-- Auth Section -->
          <div class="flex gap-3 ml-auto pl-4 border-l border-neutral-200">
            <!-- If Authenticated: User Menu -->
            <div v-if="isAuthenticated" class="relative">
              <button 
                @click="userMenuOpen = !userMenuOpen"
                class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <div class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {{ currentUser?.firstName?.charAt(0).toUpperCase() || 'U' }}
                </div>
                <span class="text-sm font-medium text-neutral-700 hidden sm:block">
                  {{ currentUser?.firstName }}
                </span>
                <UIcon name="i-lucide-chevron-down" class="w-4 h-4 text-neutral-500" />
              </button>

              <!-- User Dropdown Menu -->
              <transition
                enter-active-class="transition duration-150"
                enter-from-class="opacity-0 -translate-y-2"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition duration-150"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-2"
              >
                <div 
                  v-show="userMenuOpen"
                  class="absolute right-0 mt-2 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg py-2 z-50"
                >
                  <NuxtLink 
                    to="/user/profile" 
                    class="block px-4 py-2 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                    @click="userMenuOpen = false"
                  >
                    <UIcon name="i-lucide-user" class="w-4 h-4 inline mr-2" />
                    Hồ Sơ
                  </NuxtLink>
                  <NuxtLink 
                    to="/user/orders" 
                    class="block px-4 py-2 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                    @click="userMenuOpen = false"
                  >
                    <UIcon name="i-lucide-shopping-bag" class="w-4 h-4 inline mr-2" />
                    Đơn Hàng
                  </NuxtLink>
                  <NuxtLink 
                    to="/user/settings" 
                    class="block px-4 py-2 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                    @click="userMenuOpen = false"
                  >
                    <UIcon name="i-lucide-settings" class="w-4 h-4 inline mr-2" />
                    Cài Đặt
                  </NuxtLink>
                  <div class="border-t border-neutral-200 my-1"></div>
                  <button 
                    @click="handleLogout"
                    class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <UIcon name="i-lucide-log-out" class="w-4 h-4 inline mr-2" />
                    Đăng Xuất
                  </button>
                </div>
              </transition>
            </div>

            <!-- If Not Authenticated: Auth Buttons -->
            <template v-else>
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
            </template>
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

            <!-- Mobile Auth Section -->
            <div class="w-full border-t border-neutral-200 pt-4 mt-4">
              <!-- If Authenticated: User Info + Menu -->
              <div v-if="isAuthenticated" class="space-y-3">
                <div class="px-4 py-3 bg-primary-50 rounded-lg">
                  <p class="text-sm font-semibold text-primary-900">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</p>
                  <p class="text-xs text-primary-700">{{ currentUser?.email }}</p>
                </div>
                <NuxtLink 
                  to="/user/profile" 
                  class="block px-4 py-2 text-sm text-neutral-700 hover:bg-primary-50 rounded-md transition-colors"
                  @click="closeMenu"
                >
                  Hồ Sơ
                </NuxtLink>
                <NuxtLink 
                  to="/user/orders" 
                  class="block px-4 py-2 text-sm text-neutral-700 hover:bg-primary-50 rounded-md transition-colors"
                  @click="closeMenu"
                >
                  Đơn Hàng
                </NuxtLink>
                <NuxtLink 
                  to="/user/settings" 
                  class="block px-4 py-2 text-sm text-neutral-700 hover:bg-primary-50 rounded-md transition-colors"
                  @click="closeMenu"
                >
                  Cài Đặt
                </NuxtLink>
                <button 
                  @click="handleLogout; closeMenu()"
                  class="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors text-left"
                >
                  Đăng Xuất
                </button>
              </div>

              <!-- If Not Authenticated: Auth Buttons -->
              <template v-else>
                <div class="grid grid-cols-2 gap-3">
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
              </template>
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
