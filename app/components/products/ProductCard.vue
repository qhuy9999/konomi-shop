<script setup lang="ts">
interface Product {
  id: string;
  name: string;
  category: "black-tea" | "white-tea" | "oolong" | "matcha";
  description: string;
  img: string;
  price?: number;
}

defineProps<{
  product: Product;
}>();

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};
</script>

<template>
  <div class="group h-full">
    <div
      class="relative overflow-hidden rounded-lg bg-neutral-100 shadow-sm hover:shadow-lg transition-shadow"
    >
      <!-- Image -->
      <NuxtImg
        :src="product.img"
        :alt="product.name"
        width="400"
        height="300"
        class="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
      />

      <!-- Overlay -->
      <div
        class="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4"
      >
        <div class="space-y-2">
          <h3 class="text-white font-semibold text-base line-clamp-2">
            {{ product.name }}
          </h3>
          <p class="text-neutral-200 text-xs line-clamp-2">
            {{ product.description }}
          </p>
          <div
            v-if="product.price"
            class="flex items-center justify-between pt-2"
          >
            <span class="text-accent-400 font-bold text-sm">
              {{ formatPrice(product.price) }}
            </span>
            <button
              class="px-3 py-1 bg-primary-500 hover:bg-primary-600 text-white text-xs rounded transition-colors"
            >
              Thêm
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
