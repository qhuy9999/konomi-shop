<script setup lang="ts">
// Counter values
const counters = [
  { target: 100, suffix: '+', label: 'Hương Vị Pha Chế' },
  { target: 500000, suffix: '+', label: 'Sản Phẩm Bán Ra Toàn Thế Giới', format: 'k' },
  { target: 4.9, suffix: '+', label: 'Điểm Đánh Giá Từ Khách Hàng' },
];

const counterValues = reactive(counters.map(c => ({ ...c, current: 0 })));

// Animate counters when scrolled into view
onMounted(() => {
  const countersElement = document.querySelector('[data-counter]');
  if (countersElement) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Reset counter values trước khi animate
            counterValues.forEach(c => c.current = 0);
            // Trigger animation
            animateCounters();
          }
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(countersElement);
  }
});

// Animate counter from 0 to target
const animateCounters = () => {
  counterValues.forEach((counter) => {
    const increment = counter.target / 50; // 50 steps
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= counter.target) {
        counter.current = counter.target;
        clearInterval(interval);
      } else {
        counter.current = Math.round(current * 10) / 10;
      }
    }, 30);
  });
};

// Format counter display
const formatCounter = (counter: any) => {
  let value = counter.current;
  if (counter.format === 'k') {
    value = (value / 1000).toFixed(0) + 'k';
  } else if (typeof value === 'number' && !Number.isInteger(value)) {
    value = value.toFixed(1);
  }
  return `${value}${counter.suffix}`;
};
</script>

<template>
  <section
    id="stats"
    class="relative mt-5 bg-fixed bg-center bg-no-repeat bg-cover bg-[url(/images/statsBg.jpg)]"
  >
    <!-- overlay -->
    <div class="absolute inset-0 bg-p-950/95"></div>

    <!-- nội dung -->
    <div
      class="container relative z-10 flex flex-col items-center justify-center px-4 py-20 lg:py-28 gap-14 lg:gap-32 md:flex-row"
      data-counter
    >
      <div v-for="(counter, idx) in counterValues" :key="idx" class="stats-item">
        <h1 class="counter">{{ formatCounter(counter) }}</h1>
        <h2>{{ counter.label }}</h2>
      </div>

      <svg
        v-if="counterValues.length > 1"
        viewBox="-1 -1 3 137"
        width="3"
        height="137"
        class="hidden md:block"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="lineGradient"
            x1="0"
            y1="0"
            x2="-5.90104e-06"
            y2="135"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="white" stop-opacity="0" />
            <stop offset="0.494792" stop-color="white" />
            <stop offset="1" stop-color="white" stop-opacity="0" />
          </linearGradient>
        </defs>
        <line
          x1="0.5"
          y1="0"
          x2="0.5"
          y2="135"
          stroke="url(#lineGradient)"
          stroke-opacity="0.3"
          fill="none"
        />
      </svg>
    </div>
  </section>
</template>

<style scoped>
@import "@/assets/css/main.css";

.stats-item {
  h1 {
    @apply text-6xl lg:text-8xl font-lobster text-center tracking-wider leading-none font-bold text-transparent bg-clip-text bg-[linear-gradient(24deg,rgba(255,255,255,1)_40%,rgba(121,220,180,1)_100%)];
  }

  h2 {
    @apply mt-2 text-xs text-center lg:text-base text-accent-100;
  }
}
</style>
