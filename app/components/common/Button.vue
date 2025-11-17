<script setup lang="ts">
type Variant = "primary" | "secondary" | "accent";
type Size = "sm" | "md" | "lg";

interface Props {
  label: string;
  to?: string;
  icon?: string;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "md",
  icon: "i-lucide-arrow-right",
  disabled: false,
  to: undefined,
});

const emit = defineEmits<{
  click: [event: MouseEvent]
}>();

// Variant styles
const variantClasses: Record<Variant, string> = {
  primary:
    "bg-primary-925 hover:bg-primary-700 text-accent-200 border-primary-925 hover:border-primary-700",
  secondary:
    "bg-neutral-200 hover:bg-neutral-300 text-neutral-950 border-neutral-200 hover:border-neutral-300",
  accent:
    "bg-accent-400 hover:bg-accent-400/80 text-primary-850 border-primary-700 hover:text-primary-800",
};

// Size styles
const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-2 text-xs md:text-sm gap-1 lg:px-4 lg:py-2",
  md: "px-4 py-2 text-sm md:text-base gap-2 lg:px-6 lg:py-3",
  lg: "px-6 py-3 text-base md:text-lg gap-3 lg:px-9 lg:py-4",
};

// Icon sizes
const iconSizeClasses: Record<Size, string> = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

// Icon color mapping per variant
const iconColorClasses: Record<Variant, string> = {
  primary: "text-accent-200", // Vàng
  secondary: "text-neutral-950", // Xám tối
  accent: "text-primary-800 hover:text-primary-800", // Xanh tối
};

const buttonClass = computed(() => {
  return `
    relative
    flex items-center justify-center gap-2 
    font-medium tracking-wider
    border
    transition-all duration-300 ease-out
    hover:shadow-lg hover:scale-105
    active:scale-95
    w-fit
    overflow-hidden
    ${variantClasses[props.variant]}
    ${sizeClasses[props.size]}
    ${
      props.disabled
        ? "opacity-50 cursor-not-allowed hover:scale-100"
        : "cursor-pointer"
    }
  `;
});
</script>

<template>
  <!-- If has 'to' prop, render as NuxtLink -->
  <NuxtLink
    v-if="props.to"
    :to="props.to"
    :class="buttonClass"
    :aria-disabled="disabled"
  >
    <span>{{ label }}</span>
    <UIcon v-if="icon" :name="icon" :class="iconColorClasses[props.variant]" />
  </NuxtLink>

  <!-- Otherwise render as button -->
  <button
    v-else
    :class="buttonClass"
    :aria-disabled="disabled"
    :disabled="disabled"
    @click="emit('click', $event)"
  >
    <span>{{ label }}</span>
    <UIcon v-if="icon" :name="icon" :class="iconColorClasses[props.variant]" />
  </button>
</template>

<style scoped>
@import "@/assets/css/main.css";

/* Ripple effect on hover */
::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background-color: rgba(21, 157, 66, 0.05);
  transform: translate(-50%, -50%);
  transition: width 0.6s ease-out, height 0.6s ease-out;
  pointer-events: none;
  z-index: 1;
}

:hover::before {
  width: 300px;
  height: 300px;
}
</style>
