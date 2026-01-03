<script setup lang="ts">
const { animateOnScroll } = useScrollAnimation();
const { t, locale } = useI18n();

// Compute locale prefix for product links
const getProductLink = (category: string): string => {
  const localePrefix = locale.value === 'vi' ? '' : `/${locale.value}`;
  return `${localePrefix}/products?category=${category}`;
};

onMounted(() => {
  animateOnScroll("[data-animate-sub-heading]", "animate-slideRight", 0, false);
  animateOnScroll(
    "[data-animate-main-heading]",
    "animate-slideRight",
    300,
    false
  );
  animateOnScroll(
    "[data-animate-description]",
    "animate-slideRight",
    600,
    false
  );
  animateOnScroll("[data-animate-image]", "animate-fadeIn", 1000, false);
  animateOnScroll("[data-animate-button]", "animate-fadeIn", 800, false);
});

// ============ PRODUCTS TABS - Custom Implementation ============
const activeTab = ref<"peppermintTea" | "chamomileTea" | "lemonGinger" | "earlGrey">(
  "peppermintTea"
);

const tabs = computed(() => [
  { id: "peppermintTea", label: t('product.tabs.peppermintTea'), icon: "i-lucide-moon" },
  { id: "chamomileTea", label: t('product.tabs.chamomileTea'), icon: "i-lucide-sun" },
  { id: "lemonGinger", label: t('product.tabs.lemonGinger'), icon: "i-lucide-cloud" },
  { id: "earlGrey", label: t('product.tabs.earlGrey'), icon: "i-lucide-star" },
]);
</script>

<template>
  <section id="products">
    <div class="container">
      <div class="flex flex-col gap-7">
      <!-- heading -->
      <div data-aos="fade-right">
        <h2 data-animate-sub-heading class="sub_heading">{{ $t('product.subheading') }}</h2>
        <h1 data-animate-main-heading class="main_heading">
          {{ $t('product.mainHeading') }}
        </h1>
      </div>        <!-- ============ CUSTOM TABS ============ -->
        <div class="products-tabs">
          <!-- Tab Buttons Component -->
          <ButtonTab
            :tabs="tabs"
            :model-value="activeTab"
            @update:model-value="activeTab = $event as typeof activeTab"
            variant="default"
          />

          <div class="tabs-content">
            <!-- Specialty Tab -->
            <div v-show="activeTab === 'peppermintTea'">
              <div
                class="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-8 items-center py-2"
              >
                <NuxtImg
                  data-animate-image
                  src="/images/product_1.jpg"
                  alt="Peppermint Tea"
                  class="w-full h-auto rounded-lg"
                />
                <div>
                  <h4 data-animate-sub-heading class="products-sub_heading">
                    {{ $t('product.featured.subtitle') }}
                  </h4>
                  <h5 data-animate-main-heading class="products-main_heading">
                    {{ $t('product.featured.title') }}
                  </h5>
                  <p data-animate-description>
                    {{ $t('product.featured.description') }}
                  </p>
                  <Button
                    :label="$t('product.featured.cta')"
                    :to="getProductLink('peppermintTea')"
                    variant="accent"
                    size="md"
                    icon="i-custom-chevron-double-right"
                    data-animate-button
                    class="mt-2"
                  />
                </div>
              </div>
            </div>
            <!-- Chamomile Tea Tab -->
            <div v-show="activeTab === 'chamomileTea'">
              <div
                class="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-8 items-center py-2"
              >
                <NuxtImg
                  data-animate-image
                  src="/images/product_2.jpg"
                  alt="Chamomile Tea"
                  class="w-full h-auto rounded-lg"
                />
                <div>
                  <h3 data-animate-sub-heading class="products-sub_heading">
                    {{ $t('product.featured.subtitle') }}
                  </h3>
                  <h4 data-animate-main-heading class="products-main_heading">
                    {{ $t('product.tabs.chamomileTea') }}
                  </h4>
                  <p data-animate-description>
                    {{ $t('product.featured.description') }}
                  </p>
                  <Button
                    :label="$t('product.featured.cta')"
                    :to="getProductLink('chamomileTea')"
                    variant="accent"
                    size="md"
                    icon="i-custom-chevron-double-right"
                    data-animate-button
                    class="mt-2"
                  />
                </div>
              </div>
            </div>

            <!-- Arabica Tab -->
            <div v-show="activeTab === 'lemonGinger'">
              <div
                class="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-8 items-center py-2"
              >
                <NuxtImg
                  data-animate-image
                  src="/images/product_3.jpg"
                  alt="Lemon Ginger Tea"
                  class="w-full h-auto rounded-lg"
                />
                <div>
                  <h3 data-animate-sub-heading class="products-sub_heading">
                    {{ $t('product.featured.subtitle') }}
                  </h3>
                  <h4 data-animate-main-heading class="products-main_heading">
                    {{ $t('product.tabs.lemonGinger') }}
                  </h4>
                  <p data-animate-description>
                    {{ $t('product.featured.description') }}
                  </p>
                  <Button
                    :label="$t('product.featured.cta')"
                    :to="getProductLink('lemonGinger')"
                    variant="accent"
                    size="md"
                    icon="i-custom-chevron-double-right"
                    data-animate-button
                    class="mt-2"
                  />
                </div>
              </div>
            </div>

            <!-- Earl Grey Tab -->
            <div v-show="activeTab === 'earlGrey'">
              <div
                class="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-8 items-center py-2"
              >
                <NuxtImg
                  data-animate-image
                  src="/images/product_4.jpg"
                  alt="Earl Grey Tea"
                  class="w-full h-auto rounded-lg"
                />
                <div>
                  <h3 data-animate-sub-heading class="products-sub_heading">
                    {{ $t('product.featured.subtitle') }}
                  </h3>
                  <h4 data-animate-main-heading class="products-main_heading">
                    {{ $t('product.tabs.earlGrey') }}
                  </h4>
                  <p data-animate-description>
                    {{ $t('product.featured.description') }}
                  </p>
                  <Button
                    :label="$t('product.featured.cta')"
                    :to="getProductLink('earlGrey')"
                    variant="accent"
                    size="md"
                    icon="i-custom-chevron-double-right"
                    data-animate-button
                    class="mt-2"
                  />
                </div>
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

.products-sub_heading {
  @apply text-primary-625 text-sm md:text-base font-medium uppercase;
}
.products-main_heading {
  @apply text-accent-775 text-2xl md:text-3xl lg:text-4xl font-lobster capitalize font-semibold;
}
</style>
