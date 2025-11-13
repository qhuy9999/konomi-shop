<script setup lang="ts">
interface Product {
  id: string;
  name: string;
  category: "black-tea" | "white-tea" | "oolong" | "matcha";
  description: string;
  img: string;
  price?: number;
}

interface FilterTab {
  label: string;
  labelShort: string;
  value: "" | "black-tea" | "white-tea" | "oolong" | "matcha";
}

// Data
const products: Product[] = [
  {
    id: "1",
    name: "Black Tea Premium",
    category: "black-tea",
    description: "Trà đen chất lượng cao từ các vùng núi",
    img: "/images/products/blacktea1.jpg",
    price: 150000,
  },
  {
    id: "2",
    name: "White Tea Deluxe",
    category: "white-tea",
    description: "Trà trắng tinh tế với hương thơm tự nhiên",
    img: "/images/products/whitetea1.jpg",
    price: 180000,
  },
  {
    id: "3",
    name: "Oolong Classic",
    category: "oolong",
    description: "Trà ô long truyền thống từ Đài Loan",
    img: "/images/products/oolong1.jpg",
    price: 160000,
  },
  {
    id: "4",
    name: "Matcha Premium",
    category: "matcha",
    description: "Bột trà matcha organic nguyên chất",
    img: "/images/products/matcha1.jpg",
    price: 200000,
  },
  {
    id: "5",
    name: "Black Tea Blend",
    category: "black-tea",
    description: "Hỗn hợp trà đen với hoa và gia vị",
    img: "/images/products/blacktea2.jpg",
    price: 140000,
  },
  {
    id: "6",
    name: "White Tea Organic",
    category: "white-tea",
    description: "Trà trắng organic từ những lá non",
    img: "/images/products/whitetea2.jpg",
    price: 170000,
  },
  {
    id: "7",
    name: "Oolong Premium",
    category: "oolong",
    description: "Ô long cao cấp hương hoa đậm đà",
    img: "/images/products/oolong2.jpg",
    price: 190000,
  },
  {
    id: "8",
    name: "Matcha Ceremonial",
    category: "matcha",
    description: "Matcha cấp độ lễ tân từ Nhật Bản",
    img: "/images/products/matcha2.jpg",
    price: 250000,
  },
];

const filters: FilterTab[] = [
  { label: "Tất cả sản phẩm", labelShort: "Tất cả", value: "" },
  { label: "Trà đen", labelShort: "Đen", value: "black-tea" },
  { label: "Trà trắng", labelShort: "Trắng", value: "white-tea" },
  { label: "Trà ô long", labelShort: "Ô long", value: "oolong" },
  { label: "Trà matcha", labelShort: "Matcha", value: "matcha" },
];

// Composables & State
const route = useRoute();
const router = useRouter();
const { animateOnScroll, animateMultiple } = useScrollAnimation({
  delay: 100,
  once: false,
});
const activeCategory = computed(() => (route.query.category as string) || "");

// Computed - Transform filters to ButtonTab format
const filterTabs = computed(() =>
  filters.map((f) => ({
    id: f.value || "all",
    label: f.label,
    labelShort: f.labelShort,
  }))
);

// Computed - Filtered products
const filteredProducts = computed(() => {
  if (!activeCategory.value) return products;
  return products.filter(
    (product) => product.category === activeCategory.value
  );
});

// Lifecycle
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
          <h2 class="sub_heading" data-animate="subHeading">Shop with us</h2>
          <h1 class="main_heading" data-animate="mainHeading">
            Tất cả sản phẩm
          </h1>
        </div>
        <p
          data-animate="description"
          class="max-w-lg mt-2 text-xs text-neutral-500"
        >
          Cho dù bạn là người đam mê trà lâu năm hay mới bước chân vào thế giới
          trà, chúng tôi ở đây để giúp bạn khám phá loại trà pha trộn yêu thích
          tiếp theo của mình. Khám phá bộ sưu tập của chúng tôi và trải nghiệm
          nghệ thuật pha trà trong từng ngụm.
        </p>
      </div>

      <!-- filter tabs -->
      <ButtonTab
        :tabs="filterTabs"
        :model-value="activeCategory || 'all'"
        @update:model-value="
          router.push($event === 'all' ? '/products' : `?category=${$event}`)
        "
        variant="default"
        :show-divider="true"
      />

      <!-- sản phẩm -->
      <section v-if="filteredProducts.length > 0" class="mt-3 mb-4">
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            data-animate="card"
          >
            <ProductCard :product="product" />
          </div>
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
