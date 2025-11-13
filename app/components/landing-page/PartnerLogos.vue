<script setup lang="ts">
const { logoList } = useProducts();
</script>
<template>
  <section id="partner-logos">
    <div class="container">
      <!-- heading -->
      <div data-aos="fade-right" class="mt-10">
        <h2 class="sub_heading">Có mặt tại</h2>
        <h1 class="main_heading">
          Những Nhà Phân Phối <span class="text-gradient">Uy Tín</span>
        </h1>
      </div>
      <!-- logos -->
      <div
        class="flex mt-9 md:mt-16 mask-[linear-gradient(to_right,transparent,black,transparent)]"
      >
        <div
          v-for="(logo, index) in logoList"
          :key="index"
          class="flex flex-none logos-wrapper gap-14 pl-14"
        >
          <!-- ✅ Use <img> for SVG logos (no ipx optimization) -->
          <!-- If PNG: use <NuxtImg> instead -->
          <NuxtImg
            :src="`images/partner-logos/${logo.fileName}`"
            :alt="logo.alt"
            loading="lazy"
            class="logo-ticker-image h-16 w-auto object-contain"
          />
        </div>
      </div>
    </div>
  </section>
</template>
