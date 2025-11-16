<script setup lang="ts">
const { t } = useI18n();

interface ProductImage {
  id: string;
  i18nKey: string;
  img: string;
  price: number;
}

interface ProductCategory {
  category: "specialty" | "espresso" | "arabica" | "robusta";
  products: ProductImage[];
}

interface FilterTab {
  label: string;
  labelShort: string;
  value: "" | "specialty" | "espresso" | "arabica" | "robusta";
}

// Data - Grouped by category with multiple products per category
const productsByCategory: ProductCategory[] = [
  {
    category: "specialty",
    products: [
      {
        id: "1",
        i18nKey: "bestSellers.products.0",
        img: "/images/products/matcha1.jpg",
        price: 150000,
      },
      {
        id: "1b",
        i18nKey: "bestSellers.products.0",
        img: "/images/products/matcha2.jpg",
        price: 150000,
      },
      {
        id: "1c",
        i18nKey: "bestSellers.products.0",
        img: "/images/products/matcha3.jpg",
        price: 150000,
      },
    ],
  },
  {
    category: "espresso",
    products: [
      {
        id: "2",
        i18nKey: "bestSellers.products.1",
        img: "/images/products/blacktea1.jpg",
        price: 180000,
      },
      {
        id: "2b",
        i18nKey: "bestSellers.products.1",
        img: "/images/products/blacktea2.jpg",
        price: 180000,
      },
      {
        id: "2c",
        i18nKey: "bestSellers.products.1",
        img: "/images/products/blacktea3.jpg",
        price: 180000,
      },
    ],
  },
  {
    category: "arabica",
    products: [
      {
        id: "3",
        i18nKey: "bestSellers.products.2",
        img: "/images/products/whitetea1.jpg",
        price: 160000,
      },
      {
        id: "3b",
        i18nKey: "bestSellers.products.2",
        img: "/images/products/whitetea2.jpg",
        price: 160000,
      },
      {
        id: "3c",
        i18nKey: "bestSellers.products.2",
        img: "/images/products/whitetea3.jpg",
        price: 160000,
      },
    ],
  },
  {
    category: "robusta",
    products: [
      {
        id: "4",
        i18nKey: "bestSellers.products.3",
        img: "/images/products/oolong1.jpg",
        price: 200000,
      },
      {
        id: "4b",
        i18nKey: "bestSellers.products.3",
        img: "/images/products/oolong2.jpg",
        price: 200000,
      },
      {
        id: "4c",
        i18nKey: "bestSellers.products.3",
        img: "/images/products/oolong3.jpg",
        price: 200000,
      },
    ],
  },
];

// Computed getters for i18n
const getProductName = (i18nKey: string): string => {
  return t(`${i18nKey}.name`);
};

const getProductDescription = (i18nKey: string): string => {
  return t(`${i18nKey}.description`);
};

// Format price based on current locale
const formatPrice = (price: number): string => {
  const currencyMap: Record<string, { locale: string; currency: string }> = {
    vi: { locale: "vi-VN", currency: "VND" },
    en: { locale: "en-US", currency: "USD" },
    ja: { locale: "ja-JP", currency: "JPY" },
    de: { locale: "de-DE", currency: "EUR" },
  };

  const config = currencyMap[locale.value] || currencyMap["vi"];
  
  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: config.currency,
  }).format(price);
};

// Create short labels for mobile - remove "Trà" prefix and use only the tea name
const createShortLabel = (fullLabel: string): string => {
  // Remove common prefixes: "Trà ", "Tea ", "Tee "
  let cleaned = fullLabel
    .replace(/^(Trà |Tea |Tee |trà |tea |tee )/i, '')
    .trim();
  
  // For Japanese text, use first 3 chars; for others, use first 4 chars
  if (cleaned.match(/[\u3040-\u309F\u30A0-\u30FF]/)) {
    return cleaned.substring(0, 3);
  }
  return cleaned.substring(0, 4);
};

const filters: FilterTab[] = [
  { 
    label: t('product.tabs.specialty'), 
    labelShort: '', 
    value: "specialty" 
  },
  { 
    label: t('product.tabs.espresso'), 
    labelShort: '', 
    value: "espresso" 
  },
  { 
    label: t('product.tabs.arabica'), 
    labelShort: '', 
    value: "arabica" 
  },
  { 
    label: t('product.tabs.robusta'), 
    labelShort: '', 
    value: "robusta" 
  },
];

// Composables & State
const route = useRoute();
const router = useRouter();
const { locale } = useI18n();
const { animateOnScroll, animateMultiple } = useScrollAnimation({
  delay: 100,
  once: false,
});
const activeCategory = computed(() => (route.query.category as string) || "");

// Computed - Get locale prefix
const getLocalePrefix = (): string => {
  return locale.value === 'vi' ? '' : `/${locale.value}`;
};

// Computed - Transform filters to ButtonTab format
const filterTabs = computed(() =>
  filters.map((f) => ({
    id: f.value || "all",
    label: f.label,
    labelShort: f.labelShort,
  }))
);

// Computed - Filtered products by category
const filteredProducts = computed(() => {
  if (!activeCategory.value) return productsByCategory;
  return productsByCategory.filter(
    (item) => item.category === activeCategory.value
  );
});

onMounted(() => {
  animateMultiple([
    {
      selector: '[data-animate="subHeading"]',
      animationClass: "animate-slideRight",
      delay: 0,
      once: false,
    },
    {
      selector: '[data-animate="mainHeading"]',
      animationClass: "animate-slideRight",
      delay: 200,
      once: false,
    },
    {
      selector: '[data-animate="description"]',
      animationClass: "animate-slideRight",
      delay: 400,
      once: false,
    },
    {
      selector: '[data-animate="icon"]',
      animationClass: "animate-pop",
      delay: 300,
      once: true,
    },
    {
      selector: '[data-animate="card"]',
      animationClass: "animate-zoomIn",
      delay: 0,
      once: true,
    },
  ]);
});

// Watch filter changes - re-animate cards when category changes
watch(
  () => activeCategory.value,
  () => {
    nextTick(() => {
      // Animate cards ngay khi filter thay đổi
      animateOnScroll('[data-animate="card"]', "animate-zoomIn", 100, true);
    });
  }
);
</script>

<template>
  <section id="products">
    <main class="container py-0">
      <!-- banner -->
      <NuxtImg
        src="/images/banner1.jpg"
        alt="Sản phẩm trà cao cấp"
        loading="lazy"
        class="w-full h-[350px] object-cover shadow-xl animate-fadeIn"
      />

      <!-- tiêu đề -->
      <div class="mt-4 md:mt-9">
        <div>
          <h2 class="sub_heading" data-animate="subHeading">{{ $t('product.subheading') }}</h2>
          <h1 class="main_heading" data-animate="mainHeading">
            {{ $t('product.mainHeading') }}
          </h1>
        </div>
        <p
          data-animate="description"
          class="max-w-lg mt-2 text-xs text-neutral-500"
        >
          {{ $t('product.featured.description') }}
        </p>
      </div>

      <!-- filter tabs -->
      <ButtonTab
        :tabs="filterTabs"
        :model-value="activeCategory || 'all'"
        @update:model-value="
          router.push($event === 'all' ? `${getLocalePrefix()}/products` : `${getLocalePrefix()}/products?category=${$event}`)
        "
        variant="default"
        :show-divider="true"
      />

      <!-- sản phẩm -->
      <section v-if="filteredProducts.length > 0" class="mt-3 mb-4">
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          <!-- Loop through categories -->
          <template v-for="category in filteredProducts" :key="category.category">
            <!-- Loop through products in each category -->
            <div
              v-for="product in category.products"
              :key="product.id"
              data-animate="card"
              class="group h-full"
            >
              <div
                class="relative overflow-hidden rounded-lg bg-neutral-100 shadow-sm hover:shadow-lg transition-shadow h-full"
              >
                <!-- Image -->
                <NuxtImg
                  :src="product.img"
                  :alt="getProductName(product.i18nKey)"
                  width="400"
                  height="300"
                  class="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <!-- Overlay -->
                <div
                  class="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4"
                >
                  <div class="space-y-2">
                    <h3 class="text-white font-semibold text-base line-clamp-2">
                      {{ getProductName(product.i18nKey) }}
                    </h3>
                    <p class="text-neutral-200 text-xs line-clamp-2">
                      {{ getProductDescription(product.i18nKey) }}
                    </p>
                    <div class="flex items-center justify-between pt-2">
                      <span class="text-accent-400 font-bold text-sm">
                        {{ formatPrice(product.price) }}
                      </span>
                      <button
                        class="px-3 py-1 bg-primary-500 hover:bg-primary-600 text-white text-xs rounded transition-colors"
                      >
                        {{ $t('common.addToCart') }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </section>

      <!-- empty state -->
      <div
        v-else
        class="flex flex-col items-center justify-center py-16 text-center"
      >
        <p class="text-neutral-500 text-sm md:text-base">
          Không có sản phẩm nào trong danh mục này
        </p>
      </div>
    </main>
  </section>
</template>
