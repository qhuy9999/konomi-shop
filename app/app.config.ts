export default defineAppConfig({
  ui: {
    icons: {
      arrowDown: "i-lucide-arrow-down",
      arrowLeft: "i-lucide-arrow-left",
      arrowRight: "i-lucide-arrow-right",
      arrowUp: "i-lucide-arrow-up",
      caution: "i-lucide-circle-alert",
      check: "i-lucide-check",
      chevronDoubleLeft: "i-lucide-chevrons-left",
      chevronDoubleRight: "i-lucide-chevrons-right",
      chevronDown: "i-lucide-chevron-down",
      chevronLeft: "i-lucide-chevron-left",
      chevronRight: "i-lucide-chevron-right",
      chevronUp: "i-lucide-chevron-up",
      close: "i-lucide-x",
      copy: "i-lucide-copy",
      copyCheck: "i-lucide-copy-check",
      dark: "i-lucide-moon",
      ellipsis: "i-lucide-ellipsis",
      error: "i-lucide-circle-x",
      external: "i-lucide-arrow-up-right",
      eye: "i-lucide-eye",
      eyeOff: "i-lucide-eye-off",
      file: "i-lucide-file",
      folder: "i-lucide-folder",
      folderOpen: "i-lucide-folder-open",
      hash: "i-lucide-hash",
      info: "i-lucide-info",
      light: "i-lucide-sun",
      loading: "i-lucide-loader-circle",
      menu: "i-lucide-menu",
      minus: "i-lucide-minus",
      panelClose: "i-lucide-panel-left-close",
      panelOpen: "i-lucide-panel-left-open",
      plus: "i-lucide-plus",
      reload: "i-lucide-rotate-ccw",
      search: "i-lucide-search",
      stop: "i-lucide-square",
      success: "i-lucide-circle-check",
      system: "i-lucide-monitor",
      tip: "i-lucide-lightbulb",
      upload: "i-lucide-upload",
      warning: "i-lucide-triangle-alert",
    },
    progress: {
      slots: {
        root: "gap-2",
        base: "relative overflow-hidden rounded-full",
        indicator: "rounded-full size-full transition-all duration-200 ease-out",
        status: "flex text-dimmed transition-all duration-200",
        steps: "grid items-end text-accent-100",
        step: "truncate text-end row-start-1 col-start-1 transition-opacity",
      },
      variants: {
        animation: {
          carousel: "",
          "carousel-inverse": "",
          swing: "",
          elastic: "",
        },
        color: {
          primary: {
            indicator: "bg-primary-500",
            // steps: 'text-primary-50',
          },
          secondary: {
            indicator: "bg-secondary",
            steps: "text-secondary",
          },
          success: {
            indicator: "bg-success",
            steps: "text-success",
          },
          info: {
            indicator: "bg-info",
            steps: "text-info",
          },
          warning: {
            indicator: "bg-warning",
            steps: "text-warning",
          },
          error: {
            indicator: "bg-error",
            steps: "text-error",
          },
          neutral: {
            indicator: "bg-inverted",
            steps: "text-inverted",
          },
        },
        size: {
          "2xs": {
            status: "text-xs",
            steps: "text-xs",
          },
          xs: {
            status: "text-xs",
            steps: "text-xs",
          },
          sm: {
            status: "text-sm",
            steps: "text-sm",
          },
          md: {
            status: "text-sm",
            steps: "text-sm",
          },
          lg: {
            status: "text-sm",
            steps: "text-sm",
          },
          xl: {
            status: "text-base",
            steps: "text-base",
          },
          "2xl": {
            status: "text-base",
            steps: "text-base",
          },
        },
        step: {
          active: {
            step: "opacity-100",
          },
          first: {
            step: "opacity-100 text-muted",
          },
          other: {
            step: "opacity-0",
          },
          last: {
            step: "",
          },
        },
        orientation: {
          horizontal: {
            root: "w-full flex flex-col",
            base: "w-full",
            status: "flex-row items-center justify-end min-w-fit",
          },
          vertical: {
            root: "h-full flex flex-row-reverse",
            base: "h-full",
            status: "flex-col justify-end min-h-fit",
          },
        },
        inverted: {
          true: {
            status: "self-end",
          },
        },
      },
      compoundVariants: [
        {
          inverted: true,
          orientation: "horizontal",
          class: {
            step: "text-start",
            status: "flex-row-reverse",
          },
        },
        {
          inverted: true,
          orientation: "vertical",
          class: {
            steps: "items-start",
            status: "flex-col-reverse",
          },
        },
        {
          orientation: "horizontal",
          size: "2xs",
          class: "h-px",
        },
        {
          orientation: "horizontal",
          size: "xs",
          class: "h-0.5",
        },
        {
          orientation: "horizontal",
          size: "sm",
          class: "h-1",
        },
        {
          orientation: "horizontal",
          size: "md",
          class: "h-2",
        },
        {
          orientation: "horizontal",
          size: "lg",
          class: "h-3",
        },
        {
          orientation: "horizontal",
          size: "xl",
          class: "h-4",
        },
        {
          orientation: "horizontal",
          size: "2xl",
          class: "h-5",
        },
        {
          orientation: "vertical",
          size: "2xs",
          class: "w-px",
        },
        {
          orientation: "vertical",
          size: "xs",
          class: "w-0.5",
        },
        {
          orientation: "vertical",
          size: "sm",
          class: "w-1",
        },
        {
          orientation: "vertical",
          size: "md",
          class: "w-2",
        },
        {
          orientation: "vertical",
          size: "lg",
          class: "w-3",
        },
        {
          orientation: "vertical",
          size: "xl",
          class: "w-4",
        },
        {
          orientation: "vertical",
          size: "2xl",
          class: "w-5",
        },
        {
          orientation: "horizontal",
          animation: "carousel",
          class: {
            indicator:
              "data-[state=indeterminate]:animate-[carousel_2s_ease-in-out_infinite] data-[state=indeterminate]:rtl:animate-[carousel-rtl_2s_ease-in-out_infinite]",
          },
        },
        {
          orientation: "vertical",
          animation: "carousel",
          class: {
            indicator:
              "data-[state=indeterminate]:animate-[carousel-vertical_2s_ease-in-out_infinite]",
          },
        },
        {
          orientation: "horizontal",
          animation: "carousel-inverse",
          class: {
            indicator:
              "data-[state=indeterminate]:animate-[carousel-inverse_2s_ease-in-out_infinite] data-[state=indeterminate]:rtl:animate-[carousel-inverse-rtl_2s_ease-in-out_infinite]",
          },
        },
        {
          orientation: "vertical",
          animation: "carousel-inverse",
          class: {
            indicator:
              "data-[state=indeterminate]:animate-[carousel-inverse-vertical_2s_ease-in-out_infinite]",
          },
        },
        {
          orientation: "horizontal",
          animation: "swing",
          class: {
            indicator:
              "data-[state=indeterminate]:animate-[swing_2s_ease-in-out_infinite]",
          },
        },
        {
          orientation: "vertical",
          animation: "swing",
          class: {
            indicator:
              "data-[state=indeterminate]:animate-[swing-vertical_2s_ease-in-out_infinite]",
          },
        },
        {
          orientation: "horizontal",
          animation: "elastic",
          class: {
            indicator:
              "data-[state=indeterminate]:animate-[elastic_2s_ease-in-out_infinite]",
          },
        },
        {
          orientation: "vertical",
          animation: "elastic",
          class: {
            indicator:
              "data-[state=indeterminate]:animate-[elastic-vertical_2s_ease-in-out_infinite]",
          },
        },
      ],
      defaultVariants: {
        animation: "carousel",
        color: "primary",
        size: "md",
      },
    },
  },
});
