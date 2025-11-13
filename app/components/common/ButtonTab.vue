<script setup lang="ts">
interface Tab {
  id: string;
  label: string;
  labelShort?: string;
  icon?: string;
}

interface Props {
  tabs: Tab[];
  modelValue: string;
  variant?: "default" | "underline" | "filled";
  showDivider?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "default",
  showDivider: true,
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const handleTabClick = (tabId: string) => {
  emit("update:modelValue", tabId);
};
</script>

<template>
  <div class="button-tab-wrapper">
    <!-- Tab Buttons Navigation -->
    <div class="tabs-nav">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="[
          'tab-button',
          { active: modelValue === tab.id },
          `variant-${variant}`,
        ]"
        @click="handleTabClick(tab.id)"
      >
        <UIcon v-if="tab.icon" :name="tab.icon" class="w-5 h-5" />
        <span class="hidden md:inline">{{ tab.label }}</span>
        <span v-if="tab.labelShort" class="md:hidden">{{
          tab.labelShort
        }}</span>
        <span v-else class="md:hidden">{{ tab.label }}</span>
      </button>
    </div>
    <!-- Divider -->
    <hr v-if="showDivider" class="border-t border-dotted mt-2" />
  </div>
</template>

<style scoped>
@import "@/assets/css/main.css";

.button-tab-wrapper {
  @apply w-full;
}

.tabs-nav {
  @apply flex items-center justify-center gap-2 mx-auto flex-nowrap overflow-x-auto;
}

.tab-button {
  @apply inline-flex items-center whitespace-nowrap;
  @apply px-3 md:px-4 lg:px-6;
  @apply text-xs md:text-sm font-medium lg:text-2xl lg:gap-3;
  @apply text-accent-200 bg-primary-800 rounded-t-lg;
  @apply transition-all duration-200;
  @apply cursor-pointer hover:bg-primary-700;
  @apply border-0;

  /* Active state */
  &.active {
    @apply bg-primary-675 shadow-md text-accent-175;
    @apply hover:bg-primary-700 ring-2 ring-offset-3 ring-primary-525;
  }

  /* Variant: underline */
  &.variant-underline {
    @apply bg-transparent border-b-2 border-transparent;
    @apply text-neutral-600 hover:text-neutral-800;

    &.active {
      @apply border-b-primary-625 text-primary-625;
      @apply ring-0;
    }
  }

  /* Variant: filled */
  &.variant-filled {
    @apply rounded-full px-4 py-2;
    @apply bg-primary-100 text-primary-800;

    &.active {
      @apply bg-primary-625 text-white;
    }
  }
}
</style>
