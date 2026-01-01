<script setup lang="ts">
import { ref, computed } from "vue";
import { useSessionStore } from "@/stores/session";
import { useAuthStore } from "@/stores/auth";

// i18n
const { locale } = useI18n();

// Stores & Router (auto-imported by Nuxt)
const sessionStore = useSessionStore();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

// Computed
const isAuthenticated = computed(() => !!authStore.accessToken);
const currentUser = computed(() => authStore.currentUser);

// Mobile menu state
const mobileMenuOpen = ref(false);
const userMenuOpen = ref(false);
const skipObserverUpdate = ref(false); // Skip observer hash updates

// Navigation links - include locale prefix
const navLinks = computed(() => {
  const localePrefix = locale.value === "vi" ? "" : `/${locale.value}`;
  return [
    { label: $t("nav.home"), href: `${localePrefix}/` },
    { label: $t("nav.products"), href: `${localePrefix}/#products` },
    { label: $t("nav.about"), href: `${localePrefix}/#features` },
    { label: $t("nav.contact"), href: `${localePrefix}/#contact` },
  ];
});

// Close menu when clicking a link
const closeMenu = () => {
  mobileMenuOpen.value = false;
};

// Check if link is active (dựa trên hash)
const isActive = (href: string) => {
  // Extract hash from href (e.g., "/#products" -> "#products")
  const hashPart = href.includes("#") ? href.substring(href.indexOf("#")) : "";

  // Current hash from route
  const currentHash = route.hash;

  // Chỉ active nếu có hash match (không active HOME khi load trang lần đầu)
  return hashPart && currentHash === hashPart;
};

// Observe sections and update hash when scrolling
let observer: IntersectionObserver | null = null;

const observeSections = () => {
  // Cleanup previous observer
  if (observer) {
    observer.disconnect();
  }

  const sectionIds = ["products", "features", "contact"];

  observer = new IntersectionObserver(
    (entries) => {
      // Skip observer updates when navigating to home
      if (skipObserverUpdate.value) {
        return;
      }

      // Find the section closest to the top that is intersecting
      const intersectingEntries = entries.filter(
        (entry) => entry.isIntersecting
      );

      if (intersectingEntries.length > 0) {
        // Sort by distance from top - pick the one closest to top
        const topSection = intersectingEntries.sort(
          (a, b) =>
            a.boundingClientRect.top - b.boundingClientRect.top
        )[0];

        if (topSection) {
          router.push({ hash: `#${topSection.target.id}` }).catch(() => {});
        }
      }
    },
    { threshold: 0.3 }
  );

  // Observe all section elements
  sectionIds.forEach((id) => {
    const element = document.getElementById(id);
    if (element) observer!.observe(element);
  });
};

onMounted(() => {
  // Wait for DOM to be fully ready before observing
  nextTick(() => {
    observeSections();
  });
});

onUnmounted(() => {
  // Cleanup observer when component unmounts
  if (observer) {
    observer.disconnect();
    observer = null;
  }
});

// Watch route changes to re-setup observer when navigating back to home
watch(
  () => route.path,
  () => {
    nextTick(() => {
      observeSections();
    });
  }
);

// Handle home click - navigate to home and scroll to top
const handleHomeClick = (e: MouseEvent) => {
  e.preventDefault();
  const localePrefix = locale.value === "vi" ? "" : `/${locale.value}`;
  const homePath = `${localePrefix}/`;

  // Set skip flag to prevent observer auto-hash update
  skipObserverUpdate.value = true;

  // Navigate to home first
  router
    .push(homePath)
    .then(() => {
      // After navigation, scroll to top smoothly
      nextTick(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Clear skip flag after scroll completes
        setTimeout(() => {
          skipObserverUpdate.value = false;
        }, 500);
      });
    })
    .catch(() => {
      // If already on home page, just scroll
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Clear skip flag after scroll completes
      setTimeout(() => {
        skipObserverUpdate.value = false;
      }, 500);
    });
};

// Handle Logout
const handleLogout = async () => {
  await authStore.logout();
  userMenuOpen.value = false;
  const localePrefix = locale.value === "vi" ? "" : `/${locale.value}`;
  router.push(`${localePrefix}/?auth=signin`);
};
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white shadow-md shadow-accent-100">
      <div class="flex items-center justify-between px-4 md:px-8">
        <!-- Logo -->
        <div class="flex items-center justify-center py-4">
          <NuxtImg
            src="images/tea-leaves-logo.png"
            alt="logo"
            class="w-16 h-16"
          />
          <NuxtLink
            :to="`${locale === 'vi' ? '' : `/${locale}`}/`"
            class="text-2xl font-bold text-primary-600"
          >
            Konomi Shop
          </NuxtLink>
        </div>

        <!-- Desktop Navigation (md+) -->
        <nav class="hidden lg:flex items-center gap-6 pr-4">
          <!-- HOME link with custom scroll handler -->
          <a
            href="#"
            @click="handleHomeClick"
            :class="{
              'text-primary-600 border-b-2 border-dashed border-primary-600 pb-1':
                !route.hash,
              'text-neutral-700 hover:text-primary-600': route.hash,
            }"
            class="transition-colors font-medium cursor-pointer"
          >
            {{ $t("nav.home") }}
          </a>

          <!-- Other nav links -->
          <NuxtLink
            v-for="link in navLinks.slice(1)"
            :key="link.href"
            :to="link.href"
            :class="{
              'text-primary-600 border-b-2 border-dashed border-primary-600 pb-1':
                isActive(link.href),
              'text-neutral-700 hover:text-primary-600': !isActive(link.href),
            }"
            class="transition-colors font-medium"
          >
            {{ link.label }}
          </NuxtLink>

          <!-- Auth Section -->
          <div
            class="flex items-center justify-center gap-3 ml-auto pl-4 border-l border-neutral-200"
          >
            <!-- Language Switcher -->
            <LanguageSwitcher />

            <!-- Entertainment Button -->
            <UTooltip
              :delay-duration="0"
              :text="
                $t('common.entertainment') || 'Entertainment, News And Sharing'
              "
              :shortcuts="[]"
              :popper="{ placement: 'bottom' }"
            >
              <Button
                :to="`${locale === 'vi' ? '' : `/${locale}`}/entertainment`"
                variant="tertiary"
                icon="i-custom-controller"
                size="lg"
              />
            </UTooltip>

            <!-- If Authenticated: User Menu -->
            <div v-if="isAuthenticated" class="relative">
              <button
                @click="userMenuOpen = !userMenuOpen"
                class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <div
                  class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold"
                >
                  {{ currentUser?.firstName?.charAt(0).toUpperCase() || "U" }}
                </div>
                <span
                  class="text-sm font-medium text-neutral-700 hidden sm:block"
                >
                  {{ currentUser?.firstName }}
                </span>
                <UIcon
                  name="i-lucide-chevron-down"
                  class="w-4 h-4 text-neutral-500"
                />
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
                    <UIcon
                      name="i-lucide-shopping-bag"
                      class="w-4 h-4 inline mr-2"
                    />
                    Đơn Hàng
                  </NuxtLink>
                  <NuxtLink
                    to="/user/settings"
                    class="block px-4 py-2 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                    @click="userMenuOpen = false"
                  >
                    <UIcon
                      name="i-lucide-settings"
                      class="w-4 h-4 inline mr-2"
                    />
                    Cài Đặt
                  </NuxtLink>
                  <div class="border-t border-neutral-200 my-1"></div>
                  <button
                    @click="handleLogout"
                    class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <UIcon
                      name="i-lucide-log-out"
                      class="w-4 h-4 inline mr-2"
                    />
                    Đăng Xuất
                  </button>
                </div>
              </transition>
            </div>

            <!-- If Not Authenticated: Auth Buttons -->
            <template v-else>
              <Button
                :label="$t('common.login')"
                :to="`${locale === 'vi' ? '' : `/${locale}`}/auth?auth=signin`"
                variant="secondary"
                size="sm"
              />
              <Button
                :label="$t('common.signup')"
                :to="`${locale === 'vi' ? '' : `/${locale}`}/auth?auth=signup`"
                variant="primary"
                size="sm"
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
            <div
              class="grid grid-cols-2 sm:flex sm:flex-row sm:justify-center gap-3 w-full"
            >
              <!-- HOME link with custom scroll handler -->
              <a
                href="#"
                @click="handleHomeClick"
                :class="{
                  'bg-primary-50 text-primary-600 border-b-2 border-dashed border-primary-600':
                    !route.hash,
                  'text-neutral-700 hover:bg-primary-50 hover:text-primary-600':
                    route.hash,
                }"
                class="px-4 py-2 rounded-md transition-colors font-medium whitespace-nowrap text-center cursor-pointer"
              >
                {{ $t("nav.home") }}
              </a>

              <!-- Other nav links -->
              <NuxtLink
                v-for="link in navLinks.slice(1)"
                :key="link.href"
                :to="link.href"
                :class="{
                  'bg-primary-50 text-primary-600 border-b-2 border-dashed border-primary-600':
                    isActive(link.href),
                  'text-neutral-700 hover:bg-primary-50 hover:text-primary-600':
                    !isActive(link.href),
                }"
                class="px-4 py-2 rounded-md transition-colors font-medium whitespace-nowrap text-center"
                @click="closeMenu"
              >
                {{ link.label }}
              </NuxtLink>
            </div>

            <!-- Language Switcher (Mobile) -->
            <div class="w-full border-t border-neutral-200 pt-4 mt-4">
              <!-- 3 buttons inline: Language + Entertainment + Auth buttons (only if not authenticated) -->
              <div
                v-if="!isAuthenticated"
                class="flex items-center justify-center gap-2 flex-wrap"
              >
                <LanguageSwitcher />
                <UTooltip
                  :delay-duration="0"
                  :text="
                    $t('common.entertainment') ||
                    'Entertainment, News And Sharing'
                  "
                  :shortcuts="[]"
                  :popper="{ placement: 'bottom' }"
                >
                  <Button
                    :to="`${locale === 'vi' ? '' : `/${locale}`}/entertainment`"
                    variant="tertiary"
                    icon="i-custom-controller"
                    size="lg"
                  />
                </UTooltip>

                <Button
                  :label="$t('common.login')"
                  :to="`${
                    locale === 'vi' ? '' : `/${locale}`
                  }/auth?auth=signin`"
                  variant="secondary"
                  size="sm"
                  @click="closeMenu()"
                />
                <Button
                  :label="$t('common.signup')"
                  :to="`${
                    locale === 'vi' ? '' : `/${locale}`
                  }/auth?auth=signup`"
                  variant="primary"
                  size="sm"
                  @click="closeMenu()"
                />
              </div>

              <!-- If Authenticated: User Info + Menu -->
              <div v-if="isAuthenticated" class="space-y-3">
                <div class="px-4 py-3 bg-primary-50 rounded-lg">
                  <p class="text-sm font-semibold text-primary-900">
                    {{ currentUser?.firstName }} {{ currentUser?.lastName }}
                  </p>
                  <p class="text-xs text-primary-700">
                    {{ currentUser?.email }}
                  </p>
                </div>
                <div class="flex items-center justify-center gap-2 flex-wrap">
                  <LanguageSwitcher />
                  <UTooltip
                    :delay-duration="0"
                    :text="
                      $t('common.entertainment') ||
                      'Entertainment, News And Sharing'
                    "
                    :shortcuts="[]"
                    :popper="{ placement: 'bottom' }"
                  >
                    <Button
                      :to="`${
                        locale === 'vi' ? '' : `/${locale}`
                      }/entertainment`"
                      variant="tertiary"
                      icon="i-custom-controller"
                      size="lg"
                    />
                  </UTooltip>
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
                  @click="
                    handleLogout;
                    closeMenu();
                  "
                  class="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors text-left"
                >
                  Đăng Xuất
                </button>
              </div>
            </div>
          </div>
        </nav>
      </transition>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white shadow-footer z-50 border-t border-accent-50">
      <div class="w-full px-4 pt-6 pb-4">
        <!-- Footer Grid -->
        <div
          class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 max-w-7xl mx-auto text-center md:text-left"
        >
          <!-- Liên Hệ -->
          <div>
            <h4 class="font-semibold text-neutral-1000 mb-4">
              {{ $t("footer.contact") }}
            </h4>
            <ul class="space-y-2 text-sm text-neutral-800">
              <li>
                <a
                  href="tel:+84123456789"
                  class="text-primary-600 hover:text-neutral-700"
                  >{{ $t("footer.hotline") }}: +84 (0)123 456 789</a
                >
              </li>
              <li>
                <a
                  href="mailto:konomi@email.com"
                  class="text-primary-600 hover:text-neutral-700"
                  >{{ $t("footer.email") }}: konomi@email.com</a
                >
              </li>
              <li>
                <a href="#" class="text-primary-600 hover:text-neutral-700"
                  >{{ $t("footer.office") }}: 123 ABC Street, IOP City</a
                >
              </li>
              <li>
                <a href="#" class="text-primary-600 hover:text-neutral-700"
                  >{{ $t("footer.hours") }}: 8:00 - 22:00</a
                >
              </li>
            </ul>
          </div>

          <!-- Hướng Dẫn Mua Hàng -->
          <div>
            <h4 class="font-semibold text-neutral-1000 mb-4">
              {{ $t("footer.guide") }}
            </h4>
            <ul class="space-y-2 text-sm text-neutral-800">
              <li>
                <a href="#" class="text-primary-600 hover:text-neutral-700">{{
                  $t("footer.search")
                }}</a>
              </li>
              <li>
                <a href="#" class="text-primary-600 hover:text-neutral-700">{{
                  $t("footer.order")
                }}</a>
              </li>
              <li>
                <a href="#" class="text-primary-600 hover:text-neutral-700">{{
                  $t("footer.payment")
                }}</a>
              </li>
              <li>
                <a href="#" class="text-primary-600 hover:text-neutral-700">{{
                  $t("footer.promotions")
                }}</a>
              </li>
            </ul>
          </div>

          <!-- Giao Hàng & Hoàn Trả -->
          <div>
            <h4 class="font-semibold text-neutral-1000 mb-4">
              {{ $t("footer.shipping") }}
            </h4>
            <ul class="space-y-2 text-sm text-neutral-800">
              <li>
                <a href="#" class="text-primary-600 hover:text-neutral-700">{{
                  $t("footer.policy")
                }}</a>
              </li>
              <li>
                <a href="#" class="text-primary-600 hover:text-neutral-700">{{
                  $t("footer.fees")
                }}</a>
              </li>
              <li>
                <a href="#" class="text-primary-600 hover:text-neutral-700">{{
                  $t("footer.returns")
                }}</a>
              </li>
              <li>
                <a href="#" class="text-primary-600 hover:text-neutral-700">{{
                  $t("footer.tracking")
                }}</a>
              </li>
            </ul>
          </div>

          <!-- Điều Khoản & Chính Sách -->
          <div>
            <h4 class="font-semibold text-neutral-1000 mb-4">
              {{ $t("footer.terms") }}
            </h4>
            <ul class="space-y-2 text-sm text-neutral-800">
              <li>
                <a href="#" class="text-primary-600 hover:text-neutral-700">{{
                  $t("footer.termsOfUse")
                }}</a>
              </li>
              <li>
                <a href="#" class="text-primary-600 hover:text-neutral-700">{{
                  $t("footer.privacy")
                }}</a>
              </li>
              <li>
                <a href="#" class="text-primary-600 hover:text-neutral-700">{{
                  $t("footer.cookies")
                }}</a>
              </li>
              <li>
                <a href="#" class="text-primary-600 hover:text-neutral-700">{{
                  $t("footer.about")
                }}</a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Divider -->
        <div class="border-t border-neutral-200 pt-3 max-w-7xl mx-auto">
          <div
            class="flex flex-col md:flex-row justify-around items-center font-bold text-sm text-neutral-1000"
          >
            <p>&copy; {{ $t("footer.copyright") }}</p>
            <div class="flex gap-6 md:mt-0">
              <a href="#" class="text-primary-600 hover:text-neutral-700"
                >Facebook</a
              >
              <a href="#" class="text-primary-600 hover:text-neutral-700"
                >Twitter</a
              >
              <a href="#" class="text-primary-600 hover:text-neutral-700"
                >Instagram</a
              >
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
