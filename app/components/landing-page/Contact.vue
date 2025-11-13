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
              <img src="./assets/building.svg" alt="building" class="size-4" />
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
              <img src="./assets/mail.svg" alt="building" class="size-4" />
              <h1>Email</h1>
            </div>

            <p>test.service@example.com</p>
          </div>

          <!-- số điện thoại -->
          <div class="contact-info">
            <div>
              <img src="./assets/phone.svg" alt="building" class="size-4" />
              <h1>Điện Thoại</h1>
            </div>

            <p>(+1) 823 456 789</p>
          </div>
        </div>

        <!-- form đăng ký theo dõi -->
        <div
          class="relative text-center flex flex-col items-center w-full flex-1 h-[515px] px-10 py-20 gap-9 border border-p-600 overflow-clip"
        >
          <!-- heading -->
          <div>
            <h2 class="sub_heading">Cập nhập bản tin</h2>
            <h1 class="main_heading">Đăng ký theo dõi</h1>
          </div>

          <p>Đăng ký nhận bản tin của chúng tôi và cập nhật thông tin.</p>

          <!-- email input -->
          <div
            class="flex items-center justify-center gap-2 w-[350px] md:w-[350px] py-3 border border-primary-600"
          >
            <UIcon name="i-lucide-mail" class="w-6 h-6" />
            <input
              type="email"
              placeholder="Nhập địa chỉ email của bạn"
              class="w-[300px] text-base"
            />
          </div>

          <!-- nút theo dõi -->
          <button class="flex-none border-primary-600 w-[350px] md:w-[350px]">
            <div class="capitalize btn bg-primary-600 hover:bg-primary-700">
              <span class="w-max text-center">Đồng Ý Theo Dõi</span>
            </div>
          </button>

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
