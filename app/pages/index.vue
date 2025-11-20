<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const showContact = computed(() => !authStore.isAuthenticated)
</script>

<template>
  <Hero />
  <PartnerLogo />
  <Product />
  <Slogan />
  <HoneyCombFeature />
  <LazyBestSellerCarousel />
  <Status />
  <Story />
  <!-- Contact: Lazy loaded only when user is not authenticated -->
  <LazyContact v-if="showContact" />
</template>
