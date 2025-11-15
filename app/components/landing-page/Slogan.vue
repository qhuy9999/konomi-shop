<script setup lang="ts">
const { videoConfig } = useVideoContent();
const { animateOnScroll } = useScrollAnimation();

onMounted(() => {
  animateOnScroll('[data-slogan]', 'animate-fadeIn', 600, false);
});
</script>

<template>
  <section data-slogan id="slogan" class="overflow-clip">
    <div
      class="relative min-w-full h-[30vh] max-h-[276px] overflow-hidden flex justify-center items-center"
    >
      <!-- Video Background with NuxtImg for poster -->
      <video
        :poster="videoConfig.poster"
        autoplay
        loop
        muted
        class="absolute inset-0 min-w-full min-h-full -z-10 md:top-[-20%] md:left-[-50%] md:translate-x-1/2 object-cover"
      >
        <source :src="videoConfig.src" type="video/mp4" />
        <!-- Fallback text for browsers that don't support video -->
        Your browser does not support the video tag.
      </video>

      <!-- Text Content with AOS animation -->
      <p
        class="px-4 text-base tracking-wide text-center text-white md:text-2xl lg:text-3xl font-medium"
        :style="{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)' }"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        Chỉ những lá trà ngon nhất mới được đưa vào sản phẩm của chúng tôi,
        <br class="hidden lg:block" />
        đảm bảo mỗi ngụm trà đều mang hương vị tinh khiết và tuyệt hảo.
      </p>
    </div>
  </section>
</template>

<style scoped>
/* Video background responsive adjustments - Slogan */
@media (max-width: 768px) {
  video {
    object-position: center;
  }
}

@media (min-width: 1024px) {
  video {
    object-position: center bottom;
  }
}
</style>
