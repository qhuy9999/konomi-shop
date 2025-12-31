<script setup lang="ts">
type Variant = "primary" | "secondary" | "accent" | "secondaryV1" | "tertiary";
type Size = "sm" | "md" | "lg";

interface Props {
  label?: string;
  to?: string;
  icon?: string;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
}

const appConfig = useAppConfig();

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "md",
  icon: "i-custom-chevron-double-right",
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
  secondaryV1:
    "bg-neutral-100 hover:bg-neutral-200 text-neutral-850 border-neutral-100 hover:border-neutral-200",
  tertiary:
    "bg-primary-100 hover:bg-primary-150 border-primary-700 rounded-lg transition-colors",
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
  secondaryV1: "text-neutral-850", // Nâu nhạt,
  tertiary: "text-primary-625", // Xanh nhạt
};

const buttonClass = computed(() => {
  // Only apply padding from sizeClasses when there's a label
  const sizeClass = props.label ? sizeClasses[props.size] : 'gap-0 p-2';
  
  return `
    relative
    flex items-center justify-center
    font-medium tracking-wider
    border
    transition-all duration-300 ease-out
    hover:scale-105 shadow-xl hover:shadow-2xl transition-shadow
    active:scale-95
    w-fit
    overflow-hidden
    ${sizeClass}
    ${variantClasses[props.variant]}
    ${
      props.disabled
        ? "opacity-50 cursor-not-allowed hover:scale-100"
        : "cursor-pointer"
    }
  `;
});

// Icon class - full size when no label, normal size when has label
const iconClass = computed(() => {
  if (!props.label) {
    return "w-7 h-7";
  }
  return iconSizeClasses[props.size];
});
</script>

<template>
  <NuxtLink
    v-if="props.to"
    :to="props.to"
    :class="buttonClass"
    :aria-disabled="disabled"
  >
    <span v-if="label">{{ label }}</span>
    <UIcon v-if="icon" :name="icon" :class="[iconColorClasses[props.variant], iconClass]" />
  </NuxtLink>

  <!-- Otherwise render as button -->
  <button
    v-else
    :class="buttonClass"
    :aria-disabled="disabled"
    :disabled="disabled"
    @click="emit('click', $event)"
  >
    <span v-if="label">{{ label }}</span>
    <UIcon v-if="icon" :name="icon" :class="[iconColorClasses[props.variant], iconClass]" />
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
