<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { locale, setLocale, locales } = useI18n()
const isOpen = ref(false)

type LanguageCode = 'vi' | 'en' | 'ja' | 'de'

const languages = [
  { code: 'vi' as LanguageCode, name: 'Tiếng Việt', icon: '🇻🇳' },
  { code: 'en' as LanguageCode, name: 'English', icon: '🇺🇸' },
  { code: 'ja' as LanguageCode, name: '日本語', icon: '🇯🇵' },
  { code: 'de' as LanguageCode, name: 'Deutsch', icon: '🇩🇪' },
]

const currentLanguage = computed(() => 
  languages.find(lang => lang.code === (locale.value as LanguageCode)) || languages[0]
)

const selectLanguage = (code: LanguageCode) => {
  // Set locale globally
  setLocale(code)
  isOpen.value = false
  
  // Get current path without locale prefix
  let currentPath = route.path
  
  // Remove locale prefix if exists (vi, en, ja, de at the start)
  const localePattern = /^\/(vi|en|ja|de)(\/|$)/
  currentPath = currentPath.replace(localePattern, '/')
  
  // Navigate with new locale
  if (code === 'vi') {
    // Default locale - no prefix
    router.push(currentPath === '/' ? '/' : currentPath)
  } else {
    // Other locales - add prefix
    const path = currentPath === '/' ? '' : currentPath
    router.push(`/${code}${path}`)
  }
}

const closeDropdown = () => {
  isOpen.value = false
}
</script>

<template>
  <div class="relative inline-block">
    <UButton 
      :label="currentLanguage?.name"
      variant="soft"
      @click="isOpen = !isOpen"
      class="language-button hidden md:inline-flex"
    >
      <template #leading>
        <span class="text-lg">{{ currentLanguage?.icon }}</span>
      </template>
    </UButton>

    <!-- Mobile: Icon only button -->
    <button
      @click="isOpen = !isOpen"
      class="md:hidden p-2 text-primary-625 hover:bg-gray-100 rounded-lg transition-colors"
    >
      <UIcon name="i-lucide-languages" class="w-5 h-5" />
    </button>
    
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute left-5 right-3 md:top-full md:right-0 md:bottom-auto md:mt-2 w-max bg-white border border-neutral-200 rounded-md shadow-md z-50 overflow-hidden"
      >
        <button
          v-for="lang in languages"
          :key="lang.code"
          @click="selectLanguage(lang.code)"
          class="w-full px-3 py-2.5 flex items-center gap-2.5 hover:bg-neutral-50 transition-colors text-left text-sm font-medium"
          :class="{ 'bg-primary-50 text-primary-600': lang.code === locale, 'text-neutral-700': lang.code !== locale }"
        >
          <span class="text-base">{{ lang.icon }}</span>
          <span class="flex-1 text-xs">{{ lang.name }}</span>
          <UIcon
            v-if="lang.code === locale"
            name="i-lucide-check"
            class="w-3.5 h-3.5 text-primary-600 shrink-0"
          />
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
select {
  font-family: inherit;
}
</style>
