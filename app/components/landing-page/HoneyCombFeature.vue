<script setup lang="ts">
const { features: baseFeatures } = useFeatures();
const { animateOnScroll } = useScrollAnimation();
const { t } = useI18n();

// Map base features with i18n translations
const features = computed(() => {
  const featureKeys = ['premium-source', 'unique-flavor', 'health-focus', 'personalized-experience', 'sustainability'];
  return baseFeatures.map((feature, index) => ({
    ...feature,
    title: t(`features.items.${index}.title`),
    description: t(`features.items.${index}.description`),
  }));
});

const featureRows = computed(() => {
  // Desktop: 3-2 layout (honeycomb)
  return {
    topRow: features.value.slice(0, 3), // Items 1, 2, 3
    bottomRow: features.value.slice(3, 5), // Items 4, 5
  };
});

onMounted(() => {
  animateOnScroll('[data-counter-1]', 'animate-fadeIn', 100, false);
  animateOnScroll('[data-counter-2]', 'animate-fadeIn', 200, false);
  animateOnScroll('[data-counter-3]', 'animate-fadeIn', 300, false);
  animateOnScroll('[data-counter-4]', 'animate-fadeIn', 400, false);
});
</script>
<template>
  <section id="features" class="py-10">
    <div class="features_container">
      <!-- Section Heading (XS-SM: Full width hexagon, SM-MD+: Inside grid) -->
      <div class="sm-md:hidden w-full flex items-center justify-center">
        <div
          class="w-full max-w-fullflex items-center justify-center"
          :style="{
            clipPath:
              'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          }"
        >
          <div
            class="w-full bg-primary-50 py-20 px-4 flex items-center justify-center text-center"
            data-aos="fade-right"
          >
            <div class="features_container_heading">
              <h2 class="sub_heading">{{ $t('features.subHeading') }}</h2>
              <h1 class="main_heading">
                <span class="text-gradient">{{ $t('features.mainHeadingHighlight') }}</span> {{ $t('features.mainHeading') }}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <!-- Features Grid Container -->
      <!-- XS-SM: flex-col (vertical, 1 column)
             SM-MD+: 6-column grid where top=3 items (2 cols each), bottom=2 items (2 cols each) offset -->
      <div class="features_container_content">
        <!-- Top-left feature (features[0]) - 2 cols -->
        <div
          v-if="features[0]"
          :data-aos="`zoom-in`"
          :data-aos-delay="`0`"
          class="group w-full sm-md:col-span-2"
          data-counter-1
        >
          <div
            class="relative h-64 md:h-72 lg:h-80 overflow-hidden"
            :style="{
              clipPath:
                'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            }"
          >
            <div
              class="features_container_content_image"
              :style="{ backgroundImage: features[0].bgImage }"
            />
            <div class="features_container_content_filter" />
            <div class="features_container_content_main-content">
              <div class="features_container_content_icon-title">
                <UIcon
                  :name="features[0].icon"
                  class="features_container_content_icon"
                />
                <h3 class="features_container_content_title">
                  {{ features[0].title }}
                </h3>
              </div>
              <p class="features_container_content_description">
                {{ features[0].description }}
              </p>
            </div>
          </div>
        </div>

        <!-- Heading (top-center, SM-MD+ only) - 2 cols -->
        <div
          class="hidden bg-primary-50 sm-md:col-span-2 sm-md:flex items-center justify-center text-center px-2"
          :style="{
            clipPath:
              'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          }"
        >
          <div data-aos="fade-right" class="features_container_heading">
            <h2 class="sub_heading">{{ $t('features.subHeading') }}</h2>
            <h1 class="main_heading">
              <span class="text-gradient">{{ $t('features.mainHeadingHighlight') }}</span> {{ $t('features.mainHeading') }}
            </h1>
          </div>
        </div>

        <!-- Top-right feature (features[1]) - 2 cols -->
        <div
          v-if="features[1]"
          :data-aos="`zoom-in`"
          :data-aos-delay="`100`"
          class="group w-full sm-md:col-span-2"
          data-counter-2
        >
          <div
            class="relative h-64 md:h-72 lg:h-80 overflow-hidden"
            :style="{
              clipPath:
                'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            }"
          >
            <div
              class="features_container_content_image"
              :style="{ backgroundImage: features[1].bgImage }"
            />
            <div class="features_container_content_filter" />
            <div class="features_container_content_main-content">
              <div class="features_container_content_icon-title">
                <UIcon
                  :name="features[1].icon"
                  class="features_container_content_icon"
                />
                <h3 class="features_container_content_title">
                  {{ features[1].title }}
                </h3>
              </div>
              <p class="features_container_content_description">
                {{ features[1].description }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Row - Separate 6-column grid for 2 items with equal size to top row items -->
      <div class="sm-md:-mt-8 md:-mt-10 lg:-mt-12">
        <div class="features_container_content">
          <!-- Offset spacer (1 col, SM-MD+ only) -->
          <div class="hidden sm-md:block sm-md:col-span-1"></div>

          <!-- Bottom-left feature (features[2]) - 2 cols, offset by spacer -->
          <div
            v-if="features[2]"
            :data-aos="`zoom-in`"
            :data-aos-delay="`200`"
            class="group w-full sm-md:col-span-2 sm-md:-mt-8"
            data-counter-3
          >
            <div
              class="relative h-64 md:h-72 lg:h-80 overflow-hidden"
              :style="{
                clipPath:
                  'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              }"
            >
              <div
                class="features_container_content_image"
                :style="{ backgroundImage: features[2].bgImage }"
              />
              <div class="features_container_content_filter" />
              <div class="features_container_content_main-content">
                <div class="features_container_content_icon-title">
                  <UIcon
                    :name="features[2].icon"
                    class="features_container_content_icon"
                  />
                  <h3 class="features_container_content_title">
                    {{ features[2].title }}
                  </h3>
                </div>
                <p class="features_container_content_description">
                  {{ features[2].description }}
                </p>
              </div>
            </div>
          </div>

          <!-- Bottom-right feature (features[4]) - 2 cols -->
          <div
            v-if="features[4]"
            :data-aos="`zoom-in`"
            :data-aos-delay="`400`"
            class="group w-full sm-md:col-span-2 sm-md:-mt-8"
            data-counter-4
          >
            <div
              class="relative h-64 md:h-72 lg:h-80 overflow-hidden"
              :style="{
                clipPath:
                  'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              }"
            >
              <div
                class="features_container_content_image"
                :style="{ backgroundImage: features[4].bgImage }"
              />
              <div class="features_container_content_filter" />
              <div class="features_container_content_main-content">
                <div class="features_container_content_icon-title">
                  <UIcon
                    :name="features[4].icon"
                    class="features_container_content_icon"
                  />
                  <h3 class="features_container_content_title">
                    {{ features[4].title }}
                  </h3>
                </div>
                <p class="features_container_content_description">
                  {{ features[4].description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@import "@/assets/css/main.css";

.features_container {
  @apply xs:px-15 sm-md:px-5;
}

.features_container_heading {
  @apply text-center;
}

.features_container_content {
  @apply flex flex-col sm-md:grid sm-md:grid-cols-6;
}

.features_container_content_image {
  @apply absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110;
}

.features_container_content_filter {
  @apply absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300;
}

.features_container_content_main-content {
  @apply absolute inset-0 h-full flex flex-col items-center justify-center text-center text-primary-400 font-lobster;
}

.features_container_content_icon-title {
  @apply flex flex-col items-center justify-start transition-all duration-500 ease-out group-hover:scale-95 group-hover:md:scale-85 group-hover:lg:scale-95 group-hover:-translate-y-15 group-hover:lg:-translate-y-18;
}

.features_container_content_icon {
  @apply w-12 h-12 text-primary-300 mb-2 transition-all duration-500;
}

.features_container_content_title {
  @apply font-bold text-xl leading-tight transition-all duration-500;
}

.features_container_content_description {
  @apply absolute text-primary-100 top-18 px-6 py-6 text-sm sm-md:top-18 md:top-20 md:text-base leading-snug opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 lg:top-13 group-hover:lg:translate-y-1/2 translate-y-4 md:translate-y-4 lg:translate-y-10;
}
</style>
