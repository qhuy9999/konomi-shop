<script setup lang="ts">
import { useSessionStore } from "@/stores/session";

const sessionStore = useSessionStore();

const handleSignIn = () => {
  sessionStore.setAuthModalPage('signin');
};

const handleSignUp = () => {
  sessionStore.setAuthModalPage('signup');
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
          <div data-aos="fade-down">
            <h2 class="sub_heading">Có câu hỏi?</h2>
            <h1 class="main_heading">Liên hệ tea station tại</h1>
          </div>

          <!-- địa chỉ -->
          <div class="contact-info">
            <div>
              <UIcon name="i-lucide-building-2" class="w-4 h-4" />
              <h1>Địa Chỉ</h1>
            </div>

            <p>
              123 Phan Đình Phùng, Phường 1, Quận Tân Bình, Thành phố Hồ Chí
              Minh, VN
            </p>
          </div>

          <!-- email -->
          <div class="contact-info">
            <div>
              <UIcon name="i-lucide-mail" class="w-4 h-4" />
              <h1>Email</h1>
            </div>

            <p>test.service@example.com</p>
          </div>

          <!-- số điện thoại -->
          <div class="contact-info">
            <div>
              <UIcon name="i-lucide-phone" class="w-4 h-4" />
              <h1>Điện Thoại</h1>
            </div>

            <p>(+1) 823 456 789</p>
          </div>
        </div>

        <!-- form đăng nhập -->
        <div
          class="relative text-center flex flex-col items-center w-full flex-1 h-[515px] px-10 py-20 gap-9 border border-p-600 overflow-clip"
        >
          <!-- heading -->
          <div>
            <h2 class="sub_heading">Tham gia cộng đồng</h2>
            <h1 class="main_heading">Thành Viên Konomi Shop</h1>
          </div>

          <p>Trở thành thành viên Konomi Shop sẽ giúp bạn nhận ưu đãi độc quyền. Đăng nhập để truy cập tài khoản của bạn hoặc tạo tài khoản mới.</p>

          <!-- 2 nút đăng nhập & đăng ký -->
          <div class="flex gap-3">
            <Button
              label="Đăng Nhập"
              to="/auth?auth=signin"
              variant="secondary"
              size="sm"
              @click="handleSignIn"
            />
            <Button
              label="Đăng Ký"
              to="/auth?auth=signup"
              variant="primary"
              size="sm"
              @click="handleSignUp"
            />
          </div>

          <p class="text-sm text-neutral-600">Chưa có tài khoản? Đăng ký ngay!</p>

          <!-- hình decor -->
          <NuxtImg
            src="/images/contact.png"
            alt="decor"
            class="absolute -bottom-20 -right-20 w-[400px] opacity-15 -z-10"
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
    @apply flex items-center gap-2 px-2 py-2 bg-primary-600;
  }

  h1 {
    @apply text-white capitalize;
  }

  p {
    @apply mt-2 text-base;
  }
}
</style>
