<script setup lang="ts">
import { computed } from 'vue'
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()

const toasts = computed(() => toastStore.toasts)

/**
 * Get icon based on toast type
 */
const getIcon = (type: string) => {
  const icons: Record<string, string> = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  }
  return icons[type] || '•'
}

/**
 * Get colors based on type
 */
const getColors = (type: string): { bg: string; text: string; icon: string; border: string } => {
  const defaultColors = {
    bg: 'bg-blue-50',
    text: 'text-blue-900',
    icon: 'text-blue-600',
    border: 'border-blue-200',
  }

  const colorMap: Record<string, { bg: string; text: string; icon: string; border: string }> = {
    success: {
      bg: 'bg-green-50',
      text: 'text-green-900',
      icon: 'text-green-600',
      border: 'border-green-200',
    },
    error: {
      bg: 'bg-red-50',
      text: 'text-red-900',
      icon: 'text-red-600',
      border: 'border-red-200',
    },
    warning: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-900',
      icon: 'text-yellow-600',
      border: 'border-yellow-200',
    },
    info: defaultColors,
  }
  return colorMap[type] || defaultColors
}
</script>

<template>
  <div class="fixed bottom-20 right-6 z-999 pointer-events-none">
    <!-- Toast list -->
    <div class="space-y-3 flex flex-col gap-3">
      <Transition
        v-for="toast in toasts"
        :key="toast.id"
        name="toast-slide"
      >
        <div
          :class="[
            'pointer-events-auto',
            'flex items-start gap-3',
            'min-w-80 max-w-sm',
            'p-4 rounded-lg border',
            'shadow-lg backdrop-blur-sm',
            'animate-fadeIn',
            getColors(toast.type)['bg'],
            getColors(toast.type)['text'],
            getColors(toast.type)['border'],
          ]"
        >
          <!-- Icon -->
          <div :class="['text-xl font-bold shrink-0 mt-0.5', getColors(toast.type)['icon']]">
            {{ getIcon(toast.type) }}
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <!-- Title (optional) -->
            <h4 v-if="toast.title" class="font-semibold text-sm mb-1">
              {{ toast.title }}
            </h4>
            <!-- Message -->
            <p class="text-sm overflow-wrap-break-word">
              {{ toast.message }}
            </p>
          </div>

          <!-- Close button -->
          <button
            class="shrink-0 text-lg leading-none opacity-70 hover:opacity-100 transition-opacity"
            @click="toastStore.removeToast(toast.id)"
          >
            ✕
          </button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
/* Slide transition for toasts */
.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.3s ease-out;
}

.toast-slide-enter-from {
  transform: translateX(400px);
  opacity: 0;
}

.toast-slide-leave-to {
  transform: translateX(400px);
  opacity: 0;
}

/* Responsive */
@media (max-width: 640px) {
  :deep(.min-w-80) {
    min-width: auto;
    width: calc(100vw - 24px);
  }

  :deep(.max-w-sm) {
    max-width: 100%;
  }
}
</style>
