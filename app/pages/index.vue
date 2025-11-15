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
  <BestSellerCarousel />
  <Status />
  <Story />
  <!-- Contact chỉ hiển thị khi chưa đăng nhập -->
  <Contact v-if="showContact" />
</template>
