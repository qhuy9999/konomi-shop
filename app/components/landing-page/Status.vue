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
    >
      <div class="stats-item">
        <h1 class="counter">100+</h1>
        <h2>Hương Vị Pha Chế</h2>
      </div>

      <svg
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

      <div class="stats-item">
        <h1 class="counter">500k+</h1>
        <h2>Sản Phẩm Bán Ra Toàn Thế Giới</h2>
      </div>

      <svg
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

      <div class="stats-item">
        <h1 class="counter">4.9+</h1>
        <h2>Điểm Đánh Giá Từ Khách Hàng</h2>
      </div>
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
