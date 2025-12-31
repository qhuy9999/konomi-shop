<script setup lang="ts">
import { ref, computed } from 'vue'

const { t } = useI18n()
const route = useRoute()

const videoRef = ref<HTMLVideoElement>()
const isPlaying = ref(false)

const gameFeatures = [
  {
    id: 1,
    icon: 'i-lucide-sparkles',
    title: 'entertainment.game.feature1.title',
    description: 'entertainment.game.feature1.description',
  },
  {
    id: 2,
    icon: 'i-lucide-users',
    title: 'entertainment.game.feature2.title',
    description: 'entertainment.game.feature2.description',
  },
  {
    id: 3,
    icon: 'i-lucide-trophy',
    title: 'entertainment.game.feature3.title',
    description: 'entertainment.game.feature3.description',
  },
  {
    id: 4,
    icon: 'i-lucide-zap',
    title: 'entertainment.game.feature4.title',
    description: 'entertainment.game.feature4.description',
  },
]

const toggleVideo = () => {
  if (videoRef.value) {
    if (isPlaying.value) {
      videoRef.value.pause()
    } else {
      videoRef.value.play()
    }
    isPlaying.value = !isPlaying.value
  }
}
</script>

<template>
  <div class="space-y-20">
    <section class="space-y-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Left: Content -->
        <div class="space-y-6">
          <div class="space-y-2">
            <p class="text-primary-600 font-semibold uppercase tracking-wider">
              {{ t('entertainment.game.badge') }}
            </p>
            <h2 class="text-4xl lg:text-5xl font-bold text-neutral-900">
              {{ t('entertainment.game.title') }}
            </h2>
            <p class="text-xl text-neutral-600">
              {{ t('entertainment.game.subtitle') }}
            </p>
          </div>

          <p class="text-lg text-neutral-700 leading-relaxed max-w-lg">
            {{ t('entertainment.game.description') }}
          </p>

          <div class="flex gap-4 pt-4">
            <Button
              :label="t('entertainment.game.playCTA')"
              to="#"
              variant="primary"
              size="sm"
            />  
            <Button
              :label="t('entertainment.game.learnMore')"
              to="#"
              variant="secondary"
              size="sm"
            />
          </div>
        </div>

        <!-- Right: Video/Image Placeholder -->
        <div class="relative bg-linear-to-br from-primary-100 to-accent-100 rounded-2xl overflow-hidden aspect-video">
          <video
            ref="videoRef"
            class="w-full h-full object-cover"
            muted
            loop
            autoplay
            playsinline
            poster="/images/entertainment/game-bg.jpg"
          >
            <source src="/images/entertainment/game-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <!-- Play Button Overlay (if not autoplaying) -->
          <button
            @click="toggleVideo"
            class="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors group"
            v-if="!isPlaying"
          >
            <UIcon name="i-lucide-play" class="w-16 h-16 text-white group-hover:scale-110 transition-transform" />
          </button>

          <!-- Stats Overlay -->
          <div class="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black to-transparent p-6 text-white">
            <div class="grid grid-cols-3 gap-4">
              <div class="text-center">
                <p class="text-2xl font-bold">10K+</p>
                <p class="text-sm opacity-80">{{ t('entertainment.game.players') }}</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-bold">4.9/5</p>
                <p class="text-sm opacity-80">{{ t('entertainment.game.rating') }}</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-bold">24/7</p>
                <p class="text-sm opacity-80">{{ t('entertainment.game.uptime') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="space-y-12">
      <div class="text-center space-y-4">
        <h3 class="text-3xl lg:text-4xl font-bold text-neutral-900">
          {{ t('entertainment.game.features.title') }}
        </h3>
        <p class="text-lg text-neutral-600 max-w-2xl mx-auto">
          {{ t('entertainment.game.features.subtitle') }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div
          v-for="feature in gameFeatures"
          :key="feature.id"
          class="group bg-white p-8 rounded-xl border border-neutral-200 hover:border-primary-600 hover:shadow-lg transition-all"
        >
          <div class="w-12 h-12 bg-linear-to-br from-primary-100 to-accent-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <UIcon :name="feature.icon" class="w-6 h-6 text-primary-600" />
          </div>
          <h4 class="font-bold text-neutral-900 mb-3">
            {{ t(feature.title) }}
          </h4>
          <p class="text-neutral-600 text-sm leading-relaxed">
            {{ t(feature.description) }}
          </p>
        </div>
      </div>
    </section>

    <!-- Gameplay Section -->
    <section class="bg-linear-to-r from-primary-50 to-accent-50 rounded-2xl p-12 md:p-16 space-y-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Left: Image Placeholder -->
        <div class="bg-linear-to-br from-primary-200 to-accent-200 rounded-xl aspect-video flex items-center justify-center">
          <div class="text-center text-white space-y-4">
            <UIcon name="i-lucide-image" class="w-16 h-16 mx-auto opacity-50" />
            <p class="opacity-75">{{ t('entertainment.game.imagePlaceholder') }}</p>
          </div>
        </div>

        <!-- Right: Content -->
        <div class="space-y-6">
          <h3 class="text-3xl font-bold text-neutral-900">
            {{ t('entertainment.game.gameplay.title') }}
          </h3>
          <p class="text-neutral-700 text-lg leading-relaxed">
            {{ t('entertainment.game.gameplay.description') }}
          </p>

          <ul class="space-y-4">
            <li v-for="i in 3" :key="i" class="flex items-start gap-3">
              <UIcon name="i-lucide-check-circle" class="w-6 h-6 text-accent-400 shrink-0 mt-1" />
              <span class="text-neutral-700">
                {{ t(`entertainment.game.gameplay.point${i}`) }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Community Section -->
    <section class="bg-linear-to-r from-primary-900 via-primary-800 to-accent-900 rounded-2xl p-12 md:p-16 text-white text-center space-y-8">
      <div class="space-y-4">
        <h3 class="text-3xl lg:text-4xl font-bold">
          {{ t('entertainment.game.community.title') }}
        </h3>
        <p class="text-lg text-accent-100 max-w-2xl mx-auto">
          {{ t('entertainment.game.community.subtitle') }}
        </p>
      </div>

      <div class="flex gap-4 justify-center flex-wrap">
        <button class="px-8 py-3 bg-accent-400 text-neutral-900 font-semibold rounded-lg hover:bg-accent-300 transition-colors">
          {{ t('entertainment.game.community.joinCommunity') }}
        </button>
        <button class="px-8 py-3 border-2 border-accent-400 text-accent-400 font-semibold rounded-lg hover:bg-accent-400 hover:text-neutral-900 transition-colors">
          {{ t('entertainment.game.community.discord') }}
        </button>
      </div>
    </section>
  </div>
</template>
