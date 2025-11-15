<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "~/app.config";

const { animateOnScroll } = useScrollAnimation();

onMounted(() => {
  animateOnScroll('[data-animate-sub-heading]', 'animate-slideRight', 400, false);
  animateOnScroll('[data-animate-main-heading]', 'animate-slideRight', 200, false);
  animateOnScroll('[data-animate-description]', 'animate-slideRight', 800, false);
  animateOnScroll("[data-animate-sub-heading-swiper]", "animate-fadeIn", 900, false);
  animateOnScroll("[data-animate-description-swiper]", "animate-fadeIn", 900, false);
  
  // Setup progress bar animation observer (trigger on scroll)
  setupProgressBarObserver();
});

// Setup observer for progress bars
const setupProgressBarObserver = () => {
  const section = document.querySelector('#best-sellers');
  if (!section) return;
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Reset animated values before starting animation
          Object.keys(animatedProgressValues.value).forEach((productId) => {
            animatedProgressValues.value[productId] = [0, 0, 0, 0];
          });
          // Trigger animation
          animateProgressValues();
        }
      });
    },
    { threshold: 0.3 }
  );
  
  observer.observe(section);
};

// Animate progress values with stagger and requestAnimationFrame
const animateProgressValues = () => {
  const duration = 1200; // 1.2 seconds
  const startTime = Date.now();
  
  Object.keys(progressValues.value).forEach((productId) => {
    progressValues.value[productId]?.forEach((targetValue, index) => {
      const delay = (index + 1) * 150; // Stagger: 150ms between each
      
      setTimeout(() => {
        const animateValue = () => {
          const elapsed = Date.now() - startTime - delay;
          const progress = Math.min(elapsed / duration, 1);
          
          // Easing function: ease-out-quad
          const easeProgress = easeOutQuad(progress);
          const currentValue = Math.round(targetValue * easeProgress);
          
          if (animatedProgressValues.value[productId]) {
            animatedProgressValues.value[productId][index] = currentValue;
          }
          
          if (progress < 1) {
            requestAnimationFrame(animateValue);
          } else {
            if (animatedProgressValues.value[productId]) {
              animatedProgressValues.value[productId][index] = targetValue;
            }
          }
        };
        
        requestAnimationFrame(animateValue);
      }, delay);
    });
  });
};

// Easing function: ease-out-quad
const easeOutQuad = (t: number): number => {
  return 1 - (1 - t) * (1 - t);
};

// Progress values for each product
const progressValues = ref<Record<string, number[]>>({
  product1: [94, 93, 90, 95],
  product2: [96, 97, 90, 89],
  product3: [85, 95, 88, 99],
  product4: [83, 89, 97, 99],
});

// Animated progress values (for animation from 0 to target)
const animatedProgressValues = ref<Record<string, number[]>>({
  product1: [0, 0, 0, 0],
  product2: [0, 0, 0, 0],
  product3: [0, 0, 0, 0],
  product4: [0, 0, 0, 0],
});

const getProgressValue = (productId: string, index: number): number => {
  return (progressValues.value[productId]?.[index] ?? 0) as number;
};

const setProgressValue = (productId: string, index: number, value: number) => {
  if (progressValues.value[productId]) {
    progressValues.value[productId][index] = value;
  }
};

// Create ref wrapper for each progress value
const createProgressRef = (productId: string, index: number) => {
  return computed({
    get: () => getProgressValue(productId, index),
    set: (value: number) => setProgressValue(productId, index, value),
  });
};

// Pre-compute all progress refs for products
const productProgressRefs = computed(() => {
  const refs: Record<string, any[]> = {};
  products.forEach((product) => {
    refs[product.id] = [
      createProgressRef(product.id, 0),
      createProgressRef(product.id, 1),
      createProgressRef(product.id, 2),
      createProgressRef(product.id, 3),
    ];
  });
  return refs;
});

// Safe getter for progress values
const getProductProgress = (productId: string, index: number): number => {
  return animatedProgressValues.value[productId]?.[index] ?? 0;
};

interface Product {
  id: "product1" | "product2" | "product3" | "product4";
  name: string;
  description: string;
  image: string;
}

const products: Product[] = [
  {
    id: "product1" as const,
    name: "Peppermint Velvet",
    description:
      "Mỗi ngụm mang đến sự pha trộn hài hòa giữa hương vị đậm đà và hương thơm sảng khoái, khiến đây trở thành lựa chọn lý tưởng cho cả nghi lễ buổi sáng và giờ nghỉ giải lao buổi chiều. Trải nghiệm sự ấm áp dễ chịu và những phẩm chất tràn đầy năng lượng đã khiến trà đen trở thành thức uống cổ điển được yêu thích trong nhiều thế kỷ.",
    image: "/images/products/matcha1.jpg",
  },
  {
    id: "product2" as const,
    name: "Chamomile Bliss",
    description:
      "Mỗi ngụm mang đến sự pha trộn hài hòa giữa hương vị đậm đà và hương thơm sảng khoái, khiến đây trở thành lựa chọn lý tưởng cho cả nghi lễ buổi sáng và giờ nghỉ giải lao buổi chiều. Trải nghiệm sự ấm áp dễ chịu và những phẩm chất tràn đầy năng lượng đã khiến trà đen trở thành thức uống cổ điển được yêu thích trong nhiều thế kỷ.",
    image: "/images/products/blacktea1.jpg",
  },
  {
    id: "product3" as const,
    name: "Lemon Ginger Zest",
    description:
      "Mỗi ngụm mang đến sự pha trộn hài hòa giữa hương vị đậm đà và hương thơm sảng khoái, khiến đây trở thành lựa chọn lý tưởng cho cả nghi lễ buổi sáng và giờ nghỉ giải lao buổi chiều. Trải nghiệm sự ấm áp dễ chịu và những phẩm chất tràn đầy năng lượng đã khiến trà đen trở thành thức uống cổ điển được yêu thích trong nhiều thế kỷ.",
    image: "/images/products/whitetea1.jpg",
  },
  {
    id: "product4" as const,
    name: "Mystic Earl Grey",
    description:
      "Mỗi ngụm mang đến sự pha trộn hài hòa giữa hương vị đậm đà và hương thơm sảng khoái, khiến đây trở thành lựa chọn lý tưởng cho cả nghi lễ buổi sáng và giờ nghỉ giải lao buổi chiều. Trải nghiệm sự ấm áp dễ chịu và những phẩm chất tràn đầy năng lượng đã khiến trà đen trở thành thức uống cổ điển được yêu thích trong nhiều thế kỷ.",
    image: "/images/products/oolong1.jpg",
  },
] as const;

const modules = [Navigation, Autoplay, Pagination];

const paginationConfig = {
  clickable: true,
  dynamicBullets: false,
};
</script>

<template>
  <section id="best-sellers">
    <div class="container py-0">
      <!-- tiêu đề -->
      <div class="flex flex-col items-start md:items-center lg:items-start">
        <div data-aos="fade-right">
          <h2 data-animate-sub-heading class="sub_heading">Khách hàng yêu thích</h2>
          <h2 data-animate-main-heading class="main_heading">
            Những Sản Phẩm <span class="text-gradient">Bán Chạy Nhất</span>
          </h2>
        </div>

        <p data-animate-description>
          Khám phá những sản phẩm bán chạy nhất của chúng tôi, nơi chất lượng
          kết hợp hương vị trong mỗi tách trà. Hãy tham gia cùng hàng ngàn khách
          hàng hài lòng đã biến những hỗn hợp này thành sở thích của họ và nâng
          tầm thời gian uống trà của bạn ngay hôm nay!
        </p>
      </div>

      <!-- carousel sản phẩm  -->
      <div class="relative">
        <Swiper
          :modules="modules"
          :slides-per-view="1"
          :space-between="20"
          :autoplay="{ delay: 5000, disableOnInteraction: false }"
          :pagination="paginationConfig"
          loop
          class="best-sellers-swiper"
        >
          <!-- @ts-ignore -->
          <SwiperSlide v-for="(product) in (products as any)" :key="product.id">
            <div class="flex flex-col lg:flex-row items-center justify-between">
              <!-- phần bên trái -->
              <div class="flex-1 best-product--left">
                <div class="best-product-info">
                  <h3 data-animate-sub-heading-swiper>{{ product.name }}</h3>
                  <p data-animate-description-swiper>{{ product.description }}</p>
                </div>

                <!-- thanh tiến trình -->
                <div class="benefit-bars">
                  <!-- hàng trên -->
                  <div class="grid grid-cols-2 gap-4 mt-3">
                    <div data-progress>
                      <h4 class="text-xs sm-md:text-sm text-accent-750">
                        Tăng cường năng lượng và tập trung
                      </h4>
                      <div class="flex items-center gap-2">
                        <UProgress
                          :model-value="(getProductProgress(product.id, 0) as any)"
                          :max="100"
                          color="primary"
                          class="flex-1 progress-bar"
                        />
                        <span
                          class="text-xs font-semibold text-primary-600 min-w-fit mr-3"
                          >{{ getProductProgress(product.id, 0) }}%</span
                        >
                      </div>
                    </div>
                    <div data-progress>
                      <h4 class="text-xs sm-md:text-sm text-accent-750">
                        Giàu chất chống oxy hoá
                      </h4>
                      <div class="flex items-center gap-2">
                        <UProgress
                          :model-value="(getProductProgress(product.id, 1) as any)"
                          :max="100"
                          color="primary"
                          class="flex-1 progress-bar"
                        />
                        <span
                          class="text-xs font-semibold text-primary-600 min-w-fit mr-3"
                          >{{ getProductProgress(product.id, 1) }}%</span
                        >
                      </div>
                    </div>
                  </div>
                  <!-- hàng dưới -->
                  <div class="grid grid-cols-2 gap-4">
                    <div data-progress>
                      <h4 class="text-xs sm-md:text-sm text-accent-750">
                        Tăng cường trao đổi chất
                      </h4>
                      <div class="flex items-center gap-2">
                        <UProgress
                          :model-value="(getProductProgress(product.id, 2) as any)"
                          :max="100"
                          color="primary"
                          class="flex-1 progress-bar"
                        />
                        <span
                          class="text-xs font-semibold text-primary-600 min-w-fit mr-3"
                          >{{ getProductProgress(product.id, 2) }}%</span
                        >
                      </div>
                    </div>
                    <div data-progress>
                      <h4 class="text-xs sm-md:text-sm text-accent-750">
                        Thúc đẩy sự bình tĩnh và thư giãn
                      </h4>
                      <div class="flex items-center gap-2">
                        <UProgress
                          :model-value="(getProductProgress(product.id, 3) as any)"
                          :max="100"
                          color="primary"
                          class="flex-1 progress-bar"
                        />
                        <span
                          class="text-xs font-semibold text-primary-600 min-w-fit mr-3"
                          >{{ getProductProgress(product.id, 3) }}%</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- phần bên phải -->
              <div data-animate-description-swiper class="mt-2">
                <img :src="product.image" :alt="product.name" />
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  </section>
</template>

<style scoped>
@import "@/assets/css/main.css";

.best-product-info {
  @apply mt-4 md:mt-9;

  h3 {
    @apply text-lg font-semibold text-primary-625 md:text-2xl;
  }

  p {
    @apply max-w-lg mt-4;
  }
}

.benefit-bars {
  .progress-title {
    @apply text-sm;
  }

  .best-product--left {
    @apply p-4 lg:pl-0 lg:pr-8;
  }
}

#best-sellers img {
  @apply max-w-[400px] h-[250px] md:h-[50vh] max-h-[700px] lg:rounded-tl-[80px] lg:rounded-bl-[80px] object-cover;
}

/* Swiper styles */
:deep(.swiper) {
  @apply w-full;
}

/* Pagination dots */
:deep(.swiper-pagination) {
  @apply flex gap-2 justify-center items-center pt-4;
  position: relative;
}

:deep(.swiper-pagination-bullet) {
  @apply w-2.5 h-2.5 cursor-pointer bg-accent-550 transition-all duration-300;
}

:deep(.swiper-pagination-bullet-active) {
  @apply w-3 h-3;
  background-color: var(--color-accent-400);
}

/* Progress bar animation */
:deep(.progress-bar) {
  @apply transition-all duration-700 ease-out;
}

[data-progress] {
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
}

[data-progress]:nth-child(1) {
  animation-delay: 0.2s;
}

[data-progress]:nth-child(2) {
  animation-delay: 0.4s;
}

[data-progress]:nth-child(3) {
  animation-delay: 0.6s;
}

[data-progress]:nth-child(4) {
  animation-delay: 0.8s;
}

.progress-animated :deep(.progress-bar) {
  animation: progressFill 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes progressFill {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
}
</style>
