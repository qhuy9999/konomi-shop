<script setup lang="ts">
definePageMeta({
  layout: "default",
});

const { t, locale } = useI18n();

// Entertainment sections
const sections = [
  {
    id: "game",
    type: "entertainment.game.type",
    title: "entertainment.game.title",
    icon: "i-custom-controller",
  },
  {
    id: "news",
    type: "entertainment.news.type",
    title: "entertainment.news.title",
    icon: "i-custom-newspaper",
  },
  {
    id: "story",
    type: "entertainment.story.type",
    title: "entertainment.story.title",
    icon: "i-custom-file-earmark-text-fill",
  },
];

const activeSection = ref("game");

// Navigate to section
const selectSection = (sectionId: string) => {
  activeSection.value = sectionId;
};
</script>

<template>
  <div class="min-h-screen bg-linear-to-b from-neutral-50 to-white">
    <!-- Header -->
    <div
      class="bg-linear-to-r from-primary-925 via-primary-850 to-primary-800 py-12 md:py-16"
    >
      <div class="container">
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
          {{ t("entertainment.title") }}
        </h1>
        <p class="text-lg text-accent-200 max-w-2xl">
          {{ t("entertainment.subtitle") }}
        </p>
      </div>
    </div>

    <!-- Section Navigation -->
    <div class="container py-8">
      <div class="flex gap-4 overflow-x-auto pb-4 md:pb-0">
        <UTooltip
          v-for="section in sections"
          :key="section.id"
          :text="t(section.title)"
          :shortcuts="[]"
        >
          <button
            @click="selectSection(section.id)"
            :class="[
              'flex items-center gap-2 px-3 md:px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap',
              activeSection === section.id
                ? 'bg-primary-925 text-accent-200 shadow-lg'
                : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300',
            ]"
          >
            <UIcon :name="section.icon" class="w-5 h-5" />
            <span class="hidden md:inline">{{ t(section.type) }}</span>
          </button>
        </UTooltip>
      </div>
    </div>

    <!-- Content -->
    <div class="container py-0">
      <!-- Game Section -->
      <section v-if="activeSection === 'game'">
        <EntertainmentGame />
      </section>

      <!-- News Section (Placeholder) -->
      <section v-if="activeSection === 'news'" class="animate-fadeIn">
        <div class="text-center py-20">
          <UIcon
            name="i-custom-newspaper"
            class="w-16 h-16 text-primary-600 mx-auto mb-4"
          />
          <h2 class="text-2xl font-bold text-neutral-800 mb-2">
            {{ t("entertainment.news.title") }}
          </h2>
          <p class="text-neutral-600">{{ t("entertainment.comingSoon") }}</p>
        </div>
      </section>

      <!-- Story Section (Placeholder) -->
      <section v-if="activeSection === 'story'" class="animate-fadeIn">
        <div class="text-center py-20">
          <UIcon
            name="i-custom-file-earmark-text-fill"
            class="w-16 h-16 text-primary-600 mx-auto mb-4"
          />
          <h2 class="text-2xl font-bold text-neutral-800 mb-2">
            {{ t("entertainment.story.title") }}
          </h2>
          <p class="text-neutral-600">{{ t("entertainment.comingSoon") }}</p>
        </div>
      </section>
    </div>
    <div class="flex justify-center mb-6 md:my-12">
      <Button
        :label="$t('common.backToFirstPage')"
        :to="`${locale === 'vi' ? '' : `/${locale}`}/`"
        variant="secondaryV1"
        size="sm"
        icon="i-custom-chevron-double-left"
      />
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
