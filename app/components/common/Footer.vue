<template>
  <footer class="bg-white shadow-footer z-50 border-t border-neutral-200">
    <div class="container mx-auto px-4 py-12">
      <!-- Footer Grid -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <!-- Liên Hệ -->
        <div>
          <h4 class="font-semibold text-gray-900 mb-4">📞 {{ $t('footer.contact') }}</h4>
          <ul class="space-y-2 text-sm text-gray-600">
            <li><a href="tel:+84123456789" class="hover:text-blue-600">{{ $t('footer.hotline') }}: +84 (0)123 456 789</a></li>
            <li><a href="mailto:support@konomi.com" class="hover:text-blue-600">{{ $t('footer.email') }}: support@konomi.com</a></li>
            <li><a href="#" class="hover:text-blue-600">{{ $t('footer.office') }}: 123 Đường ABC, Tp. HCM</a></li>
            <li><a href="#" class="hover:text-blue-600">{{ $t('footer.hours') }}: 8:00 - 22:00</a></li>
          </ul>
        </div>

        <!-- Hướng Dẫn Mua Hàng -->
        <div>
          <h4 class="font-semibold text-gray-900 mb-4">🛒 {{ $t('footer.guide') }}</h4>
          <ul class="space-y-2 text-sm text-gray-600">
            <li><a href="#" class="hover:text-blue-600">{{ $t('footer.search') }}</a></li>
            <li><a href="#" class="hover:text-blue-600">{{ $t('footer.order') }}</a></li>
            <li><a href="#" class="hover:text-blue-600">{{ $t('footer.payment') }}</a></li>
            <li><a href="#" class="hover:text-blue-600">{{ $t('footer.promotions') }}</a></li>
          </ul>
        </div>

        <!-- Giao Hàng & Hoàn Trả -->
        <div>
          <h4 class="font-semibold text-gray-900 mb-4">📦 {{ $t('footer.shipping') }}</h4>
          <ul class="space-y-2 text-sm text-gray-600">
            <li><a href="#" class="hover:text-blue-600">{{ $t('footer.policy') }}</a></li>
            <li><a href="#" class="hover:text-blue-600">{{ $t('footer.fees') }}</a></li>
            <li><a href="#" class="hover:text-blue-600">{{ $t('footer.returns') }}</a></li>
            <li><a href="#" class="hover:text-blue-600">{{ $t('footer.tracking') }}</a></li>
          </ul>
        </div>

        <!-- Điều Khoản & Chính Sách -->
        <div>
          <h4 class="font-semibold text-gray-900 mb-4">📋 {{ $t('footer.terms') }}</h4>
          <ul class="space-y-2 text-sm text-gray-600">
            <li><a href="#" class="hover:text-blue-600">{{ $t('footer.termsOfUse') }}</a></li>
            <li><a href="#" class="hover:text-blue-600">{{ $t('footer.privacy') }}</a></li>
            <li><a href="#" class="hover:text-blue-600">{{ $t('footer.cookies') }}</a></li>
            <li><a href="#" class="hover:text-blue-600">{{ $t('footer.about') }}</a></li>
          </ul>
        </div>
      </div>

      <!-- Divider -->
      <div class="border-t border-neutral-200 pt-8">
        <div class="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p>&copy; {{ $t('footer.copyright') }}</p>
          <div class="flex gap-6 mt-4 md:mt-0">
            <a href="#" class="hover:text-blue-600">Facebook</a>
            <a href="#" class="hover:text-blue-600">Twitter</a>
            <a href="#" class="hover:text-blue-600">Instagram</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Ensure i18n is reactive when locale changes
const { locale } = useI18n()
</script>
