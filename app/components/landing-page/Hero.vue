<script setup lang="ts">
const { animateOnScroll } = useScrollAnimation();

onMounted(() => {
  animateOnScroll('[data-animate-sub-heading]', 'animate-slideRight', 400, false);
  animateOnScroll('[data-animate-main-heading]', 'animate-slideRight', 200, false);
  animateOnScroll('[data-animate-description]', 'animate-slideRight', 0, false);
  animateOnScroll('[data-animate-button]', 'animate-fadeIn', 800, false);
});
</script>


<template>
  <section
    id="hero"
    class="h-screen max-h-125 bg-linear-to-t from-primary-200 to-white overflow-y-clip lg:max-w-full"
  >
    <div
      class="container relative flex items-center justify-center w-full h-full md:justify-start xl:justify-start"
    >
      <div
        class="absolute bottom-0 right-0 overflow-hidden z-0 md:top-1/2 md:-translate-y-1/2 xl:top-1/2 xl:-translate-y-1/2"
      >
        <NuxtImg
          src="/images/hero_img.png"
          alt="Tea specialty showcase - beautiful organic tea leaves and traditional brewing method"
          class="h-full 2xl:mask-[linear-gradient(to_left,transparent,black_10%)]"
        />
      </div>

      <!-- nội dung chính -->
      <div
        class="flex flex-col items-center justify-center z-10 gap-9 md:items-start xl:items-start"
      >
        <div>
          <h2
          data-animate-sub-heading
            class="mb-2 text-xs font-semibold text-center uppercase leading-none tracking-wider md:text-start xl:text-start"
          >
            hơn
            <span class="text-sm text-gradient">một trăm</span> hương vị trà
          </h2>
          <h1
            data-animate-main-heading
            class="text-5xl leading-none tracking-wide text-center capitalize font-lobster md:text-6xl lg:text-7xl"
          >
            Trà Đặc Biệt Chế Tác
          </h1>
        </div>

        <p data-animate-description class="max-w-xl px-4 text-center md:text-start xl:text-start">
          Sứ mệnh của chúng tôi là mang đến cho bạn sự yên bình và kết nối thông
          qua các hương vị trà được chọn lọc cẩn thận và được tạo ra để nâng cao
          trải nghiệm hàng ngày và sức khoẻ toàn diện cho bạn.
        </p>

        <Button
          label="Tìm Hiểu Sản Phẩm"
          to="/#products"
          variant="accent"
          size="md"
          icon="i-lucide-arrow-right"
          data-animate-button
        />
      </div>
    </div>
  </section>
</template>
