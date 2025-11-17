<script setup lang="ts">
import { useSessionStore } from "@/stores/session";

const { animateOnScroll } = useScrollAnimation();

onMounted(() => {
  animateOnScroll('[data-animate-sub-heading]', 'animate-slideRight', 400, false);
  animateOnScroll('[data-animate-main-heading]', 'animate-slideRight', 200, false);
  animateOnScroll('[data-animate-description]', 'animate-slideRight', 0, false);
});

const sessionStore = useSessionStore();
const { t } = useI18n();
const { locale } = useI18n();
const router = useRouter();

const handleSignIn = () => {
  sessionStore.setAuthModalPage('signin');
  const localePrefix = locale.value === 'vi' ? '' : `/${locale.value}`;
  router.push(`${localePrefix}/auth?auth=signin`);
};

const handleSignUp = () => {
  sessionStore.setAuthModalPage('signup');
  const localePrefix = locale.value === 'vi' ? '' : `/${locale.value}`;
  router.push(`${localePrefix}/auth?auth=signup`);
};
</script>

<template>
  <section id="contact">
    <div class="container my-20">
      <div class="flex flex-col w-full gap-10 lg:flex-row">
        <!-- thông tin liên hệ -->
        <div
          class="flex h-[515px] flex-col items-center justify-center flex-1 w-full px-10 py-20 border border-dotted border-p-600 gap-9"
        >
          <!-- tiêu đề -->
          <div>
            <h2 data-animate-sub-heading class="sub_heading">{{ $t('contact.mainHeading') }}</h2>
            <h1 data-animate-main-heading class="main_heading">{{ $t('contact.subheading') }}</h1>
          </div>

          <!-- địa chỉ -->
          <div data-animate-description class="contact-info">
            <div>
              <UIcon name="i-lucide-building-2" class="w-4 h-4 text-accent-100" />
              <h1>{{ $t('common.home') }}</h1>
            </div>

            <p>{{ $t('contact.address') }}</p>
          </div>

          <!-- email -->
          <div data-animate-description class="contact-info">
            <div>
              <UIcon name="i-lucide-mail" class="w-4 h-4 text-accent-100" />
              <h1>{{ $t('common.account') }}</h1>
            </div>

            <p>konomi@email.com</p>
          </div>

          <!-- số điện thoại -->
          <div data-animate-description class="contact-info">
            <div>
              <UIcon name="i-lucide-phone" class="w-4 h-4 text-accent-100" />
              <h1>{{ $t('footer.hotline') }}</h1>
            </div>

            <p>{{ $t('contact.phone') }}</p>
          </div>
        </div>

        <!-- form đăng nhập -->
        <div
          class="relative text-center flex flex-col items-center w-full flex-1 h-[515px] px-10 py-20 gap-9 border border-p-600 overflow-clip"
        >
          <!-- heading -->
          <div>
            <h2 data-animate-sub-heading class="sub_heading">{{ $t('contact.community.title') }}</h2>
            <h1 data-animate-main-heading class="main_heading">{{ $t('contact.community.subtitle') }}</h1>
          </div>

          <p data-animate-description>  {{ $t('contact.community.description') }}</p>

          <!-- 2 nút đăng nhập & đăng ký -->
          <div data-animate-description class="flex gap-3">
            <Button
              :label="$t('common.login')"
              variant="secondary"
              size="sm"
              @click="handleSignIn"
            />
            <Button
              :label="$t('common.signup')"
              variant="primary"
              size="sm"
              @click="handleSignUp"
            />
          </div>

          <p data-animate-description class="text-sm text-neutral-600">{{ $t('contact.community.noAccount') }}</p>

          <!-- hình decor -->
          <NuxtImg
            src="/images/contact.png"
            alt="decor"
            class="absolute -bottom-20 -right-20 w-[400px] opacity-10 -z-10"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@import "@/assets/css/main.css";

.contact-info {
  @apply w-full;

  > div {
    @apply flex items-center gap-2 px-2 py-2 bg-primary-900;
  }

  h1 {
    @apply text-accent-200 capitalize;
  }

  p {
    @apply mt-2 text-base;
  }
}
</style>
