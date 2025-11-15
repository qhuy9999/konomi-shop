<script setup lang="ts">
const { logoList } = useProducts();
const { animateOnScroll } = useScrollAnimation();

onMounted(() => {
  animateOnScroll('[data-animate-sub-heading]', 'animate-slideRight', 0, false);
  animateOnScroll('[data-animate-main-heading]', 'animate-slideRight', 300, false);
});

// Duplicate logos để tạo seamless marquee
const marqueeLogos = computed(() => [...logoList.value, ...logoList.value]);
</script>

<template>
  <section id="partner-logos">
    <div class="container">
      <!-- heading -->
      <div data-aos="fade-right" class="mt-10">
        <h2 data-animate-sub-heading class="sub_heading">Có mặt tại</h2>
        <h1 data-animate-main-heading class="main_heading">
          Những Nhà Phân Phối <span class="text-gradient">Uy Tín</span>
        </h1>
      </div>
      <!-- logos marquee -->
      <div
        class="mt-9 md:mt-16 overflow-hidden"
        style="mask: linear-gradient(to right, transparent, black 10%, black 90%, transparent)"
      >
        <div class="marquee-container">
          <div v-for="(logo, index) in marqueeLogos" :key="index" class="marquee-item">
            <NuxtImg
              :src="`images/partner-logos/${logo.fileName}`"
              :alt="logo.alt"
              loading="lazy"
              class="logo-ticker-image h-16 w-auto object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.marquee-container {
  display: flex;
  gap: 3.5rem;
  padding-left: 3.5rem;
  animation: scroll-left 60s linear infinite;
  will-change: transform;
}

.marquee-item {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

@keyframes scroll-left {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-100%));
  }
}

/* Pause on hover (optional) */
.marquee-container:hover {
  animation-play-state: paused;
}
</style>
