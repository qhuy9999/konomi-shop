<script setup lang="ts">
const { animateOnScroll } = useScrollAnimation();

onMounted(() => {
  animateOnScroll(
    "[data-animate-sub-heading]",
    "animate-slideRight",
    200,
    false
  );
  animateOnScroll(
    "[data-animate-main-heading]",
    "animate-slideRight",
    400,
    false
  );
  animateOnScroll(
    "[data-animate-description]",
    "animate-slideRight",
    800,
    false
  );
});
</script>

<template>
  <section id="story">
    <!-- lớp chứa hình nền -->
    <div
      class="flex justify-end h-screen max-h-[1100px]w-full max-w-none bg-[url(/images/aboutUsImg.jpg)] bg-no-repeat bg-center bg-cover"
    >
      <!-- lớp overlay chiếm 2/3 màn hình -->
      <div class="w-full h-full bg-primary-1000/40">
        <div
          class="container relative flex items-center justify-center h-full md:justify-end 2xl:justify-center"
        >
          <!-- watermark -->
          <div
            class="absolute hidden translate-y-1/4 md:right-1/3 lg:top-1/4 lg:right-1/3 2xl:right-1/2 md:block"
          >
            <h1
              class="uppercase -rotate-90 text-[120px] text-center leading-[148px] font-bold text-primary-50 opacity-20"
            >
              KONOMI<br />
              SHOP
            </h1>
          </div>

          <!-- nội dung chính -->
          <div class="relative 2xl:left-50">
            <h2 data-animate-sub-heading class="story_sub_heading">{{ $t('story.subheading') }}</h2>
            <h1 data-animate-main-heading class="story_main_heading">
              {{ $t('story.mainHeading') }}
            </h1>

            <p data-animate-description class="text-primary-50 max-w-80">
              {{ $t('story.content') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@import "@/assets/css/main.css";

.story_sub_heading {
  @apply text-sm text-primary-500 md:text-base font-medium uppercase;
}
.story_main_heading {
  @apply text-2xl text-accent-550 md:text-3xl lg:text-4xl font-lobster font-semibold;
}
</style>
