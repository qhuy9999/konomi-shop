<template>
  <div class="relative">
    <UButton 
      :label="currentLanguage?.name"
      variant="soft"
      @click="isOpen = !isOpen"
      class="language-button"
    >
      <template #leading>
        <span class="text-lg">{{ currentLanguage?.icon }}</span>
      </template>
    </UButton>
    
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
        class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden"
      >
        <button
          v-for="lang in languages"
          :key="lang.code"
          @click="selectLanguage(lang.code)"
          class="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-100 transition-colors text-left"
          :class="{ 'bg-gray-50': lang.code === locale }"
        >
          <span class="text-xl">{{ lang.icon }}</span>
          <span class="flex-1">{{ lang.name }}</span>
          <UIcon
            v-if="lang.code === locale"
            name="i-lucide-check"
            class="w-4 h-4 text-indigo-600 font-semibold"
          />
        </button>
      </div>
    </Transition>

    <!-- Backdrop to close dropdown -->
    <div
      v-if="isOpen"
      class="fixed inset-0 z-40"
      @click="closeDropdown"
    />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { locale, setLocale, locales } = useI18n()
const isOpen = ref(false)

type LanguageCode = 'vi' | 'en' | 'ja' | 'de'

const languages = [
  { code: 'vi' as LanguageCode, name: 'Tiếng Việt', icon: '🇻🇳' },
  { code: 'en' as LanguageCode, name: 'English', icon: '🇬🇧' },
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

<style scoped>
select {
  font-family: inherit;
}
</style>
