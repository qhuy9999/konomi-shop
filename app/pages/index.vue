<script setup lang="ts">
import { ref, computed } from "vue";

const { logoList } = useProducts();
const { videoConfig } = useVideoContent()
const { features } = useFeatures()

// ============ PRODUCTS TABS - Custom Implementation ============
const activeTab = ref<"matcha" | "white-tea" | "oolong" | "black-tea">(
  "matcha"
);

const tabs = [
  { id: "matcha", label: "Trà Matcha", icon: "i-lucide-moon" },
  { id: "white-tea", label: "Trà Trắng", icon: "i-lucide-sun" },
  { id: "oolong", label: "Trà Ô Long", icon: "i-lucide-cloud" },
  { id: "black-tea", label: "Trà Đen", icon: "i-lucide-star" },
];

// ============ FEATURES - Responsive Pentagon/Honeycomb Layout ============
// SM: Vertical (1 column)
// MD-LG: Honeycomb (3 on top, 2 on bottom)
// 5 items total
const featureRows = computed(() => {
  // Desktop: 3-2 layout (honeycomb)
  return {
    topRow: features.slice(0, 3),    // Items 1, 2, 3
    bottomRow: features.slice(3, 5), // Items 4, 5
  }
})
</script>

<template>
  <!----------------- 
        Hero 
    ------------------>
  <section
    id="hero"
    class="h-screen max-h-125 bg-linear-to-t from-primary-200 to-white overflow-y-clip lg:max-w-full"
  >
    <div
      class="container relative flex items-center justify-center w-full h-full md:justify-start xl:justify-start"
    >
      <div
        class="absolute bottom-0 right-0 overflow-hidden z-0 md:top-1/2 md:-translate-y-1/2 xl:top-1/2 xl:-translate-y-1/2"
      >
        <NuxtImg
          src="/images/hero_img.png"
          alt="Tea specialty showcase - beautiful organic tea leaves and traditional brewing method"
          class="h-full 2xl:mask-[linear-gradient(to_left,transparent,black_10%)]"
        />
      </div>

      <!-- nội dung chính -->
      <div
        class="flex flex-col items-center justify-center z-10 gap-9 md:items-start xl:items-start"
      >
        <div>
          <h2
            class="mb-2 text-xs font-semibold text-center uppercase leading-none tracking-wider md:text-start xl:text-start"
          >
            hơn
            <span class="text-sm text-gradient">một trăm</span> hương
            vị trà
          </h2>
          <h1
            data-aos="zoom-in"
            data-aos-delay="100"
            class="text-5xl leading-none tracking-wide text-center capitalize font-lobster md:text-6xl lg:text-7xl"
          >
            Trà Đặc Biệt Chế Tác
          </h1>
        </div>

        <p class="max-w-xl px-4 text-center md:text-start xl:text-start">
          Sứ mệnh của chúng tôi là mang đến cho bạn sự yên bình và kết nối thông
          qua các hương vị trà được chọn lọc cẩn thận và được tạo ra để nâng cao
          trải nghiệm hàng ngày và sức khoẻ toàn diện cho bạn.
        </p>
        <button>
          <NuxtLink to="/#products" class="btn">
            <span>Tìm Hiểu Sản Phẩm</span>
            <UIcon name="i-custom-right-arrow" />
          </NuxtLink>
        </button>
      </div>
    </div>
  </section>

  <!----------------- 
        Partner Logos 
    ------------------>
  <section id="partner-logos">
    <div class="container">
      <!-- heading -->
      <div data-aos="fade-right" class="mt-10">
        <h2 class="sub_heading">Có mặt tại</h2>
        <h1 class="main_heading">
          Những Nhà Phân Phối <span class="text-gradient">Uy Tín</span>
        </h1>
      </div>
      <!-- logos -->
      <div
        class="flex mt-9 md:mt-16 mask-[linear-gradient(to_right,transparent,black,transparent)]"
      >
        <div
          v-for="(logo, index) in logoList"
          :key="index"
          class="flex flex-none logos-wrapper gap-14 pl-14"
        >
          <!-- ✅ Use <img> for SVG logos (no ipx optimization) -->
          <!-- If PNG: use <NuxtImg> instead -->
          <NuxtImg
            :src="`images/partner-logos/${logo.fileName}`"
            :alt="logo.alt"
            loading="lazy"
            class="logo-ticker-image h-16 w-auto object-contain"
          />
        </div>
      </div>
    </div>
  </section>

  <!------------- Products ------------->
  <section id="products">
    <div class="container">
      <div class="flex flex-col gap-9">
        <!-- heading -->
        <div data-aos="fade-right">
          <h2 class="sub_heading">Tìm hiểu</h2>
          <h1 class="main_heading">
            sản phẩm <span class="text-gradient">trà ngon</span>
          </h1>
        </div>

        <!-- ============ CUSTOM TABS ============ -->
        <div class="products-tabs ">
          <!-- Tab Buttons -->
          <div class="tabs-nav">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              :class="['tab-button', { active: activeTab === tab.id }]"
              @click="activeTab = tab.id as typeof activeTab"
            >
              <UIcon :name="tab.icon" class="w-5 h-5" />
              <span>{{ tab.label }}</span>
            </button>
          </div>
          <hr class="border-t border-dotted mt-2" />
          <!-- Tab Content - Using v-show for smooth transitions -->
          <div class="tabs-content">
            <!-- Matcha Tab -->
            <div v-show="activeTab === 'matcha'">
              <div
                class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-2"
              >
                <NuxtImg
                  src="/images/product_1.jpg"
                  alt="Matcha Magic - Premium matcha tea powder"
                  class="w-full h-auto rounded-lg"
                />
                <div class="space-y-4">
                  <h3 class="sub_heading">Matcha Magic</h3>
                  <h4 class="main_heading">
                    Khám phá những lợi ích tiềm năng của "vàng xanh" từ Nhật Bản
                  </h4>
                  <p>
                    Sẵn sàng nâng cao sức khỏe của bạn? Hãy làm quen với matcha,
                    loại bột màu xanh lá cây rực rỡ đang làm khuynh đảo thế giới
                    chăm sóc sức khỏe. Chứa đầy chất chống oxy hóa và chất dinh
                    dưỡng, matcha cung cấp nguồn năng lượng mạnh mẽ mà không gây
                    bồn chồn, nhờ sự kết hợp độc đáo giữa caffeine và
                    L-theanine.
                    <br />
                    Loại trà này không chỉ tăng cường sự tập trung và trao đổi
                    chất mà còn thêm hương vị thơm ngon cho sinh tố, đồ nướng và
                    cà phê latte. Hãy đắm mình vào thế giới matcha!
                  </p>
                  <button>
                    <NuxtLink
                      to="/products?category=matcha"
                      class="btn inline-flex"
                    >
                      Xem Sản Phẩm Matcha
                      <UIcon name="i-custom-right-arrow" />
                    </NuxtLink>
                  </button>
                </div>
              </div>
            </div>

            <!-- White Tea Tab -->
            <div v-show="activeTab === 'white-tea'">
              <div
                class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-2"
              >
                <NuxtImg
                  src="/images/product_2.jpg"
                  alt="White Tea - Premium white tea leaves"
                  class="w-full h-auto rounded-lg"
                />
                <div class="space-y-4">
                  <h3 class="sub_heading">Tinh chất tinh tế từ trà trắng</h3>
                  <h4 class="main_heading">
                    Hành trình khám phá hương vị tinh khiết nhất từ thiên nhiên
                  </h4>
                  <p>
                    Trà trắng, được tôn sùng vì sự nhẹ nhàng và tinh tế của nó,
                    được chế biến từ lá non và nụ của cây Camellia sinensis. Với
                    hương hoa nhẹ nhàng và vị ngọt tự nhiên, loại trà này mang
                    đến trải nghiệm nhẹ nhàng nhưng sảng khoái. Giàu chất chống
                    oxy hóa và ít caffeine, trà trắng không chỉ làm hài lòng
                    khẩu vị mà còn hỗ trợ sức khỏe.
                  </p>
                  <button>
                    <NuxtLink
                      to="/products?category=white-tea"
                      class="btn inline-flex"
                    >
                      Xem Sản Phẩm Trà Trắng
                      <UIcon name="i-custom-right-arrow" />
                    </NuxtLink>
                  </button>
                </div>
              </div>
            </div>

            <!-- Oolong Tab -->
            <div v-show="activeTab === 'oolong'">
              <div
                class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-2"
              >
                <NuxtImg
                  src="/images/product_3.jpg"
                  alt="Oolong Tea - Premium oolong tea leaves"
                  class="w-full h-auto rounded-lg"
                />
                <div class="space-y-4">
                  <h3 class="sub_heading">Cuộc cách mạng trà ô long</h3>
                  <h4 class="main_heading">
                    Mở khóa bí mật của loại trà lành mạnh nhất từ thiên nhiên
                  </h4>
                  <p>
                    Bạn có tò mò về bí quyết trường thọ không? Hãy tìm đến trà ô
                    long! Thức uống cổ xưa này, được tôn sùng trong nhiều nền
                    văn hóa trên thế giới, chứa đầy chất chống oxy hóa mạnh mẽ
                    có thể thúc đẩy quá trình trao đổi chất, tăng cường chức
                    năng não và thúc đẩy sức khỏe tim mạch.
                  </p>
                  <button>
                    <NuxtLink
                      to="/products?category=oolong"
                      class="btn inline-flex"
                    >
                      Xem Sản Phẩm Trà Ô Long
                      <UIcon name="i-custom-right-arrow" />
                    </NuxtLink>
                  </button>
                </div>
              </div>
            </div>

            <!-- Black Tea Tab -->
            <div v-show="activeTab === 'black-tea'">
              <div
                class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-2"
              >
                <NuxtImg
                  src="/images/product_4.png"
                  alt="Black Tea - Premium black tea leaves"
                  class="w-full h-auto rounded-lg"
                />
                <div class="space-y-4">
                  <h3 class="sub_heading">
                    Đánh thức các giác quan cùng trà đen
                  </h3>
                  <h4 class="main_heading">
                    Hương vị đậm đà truyền thống vượt thời gian
                  </h4>
                  <p>
                    Hãy thưởng thức hương vị đậm đà, mạnh mẽ của trà đen, được
                    chế tác hoàn hảo cho khẩu vị sành điệu. Mỗi ngụm trà mang
                    đến sự pha trộn hài hòa giữa hương vị sâu lắng và hương thơm
                    sảng khoái, khiến đây trở thành lựa chọn lý tưởng cho cả
                    nghi lễ buổi sáng và giờ nghỉ trưa.
                  </p>
                  <button>
                    <NuxtLink
                      to="/products?category=black-tea"
                      class="btn inline-flex"
                    >
                      Xem Sản Phẩm Trà Đen
                      <UIcon name="i-custom-right-arrow" />
                    </NuxtLink>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

   <!----------------- 
        Slogan
    ------------------>
    <section
      id="slogan"
      class="mb-5 overflow-clip"
    >
      <div
        class="relative min-w-full h-[30vh] max-h-[276px] overflow-hidden flex justify-center items-center"
      >
        <!-- Video Background with NuxtImg for poster -->
        <video
          :poster="videoConfig.poster"
          autoplay
          loop
          muted
          class="absolute inset-0 min-w-full min-h-full -z-10 md:top-[-20%] md:left-[-50%] md:translate-x-1/2 object-cover"
        >
          <source
            :src="videoConfig.src"
            type="video/mp4"
          />
          <!-- Fallback text for browsers that don't support video -->
          Your browser does not support the video tag.
        </video>

        <!-- Text Content with AOS animation -->
        <p
          class="px-4 text-base tracking-wide text-center text-white md:text-2xl lg:text-3xl font-medium"
          :style="{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)' }"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Chỉ những lá trà ngon nhất mới được đưa vào sản phẩm của chúng tôi,
          <br class="hidden lg:block" />
          đảm bảo mỗi ngụm trà đều mang hương vị tinh khiết và tuyệt hảo.
        </p>
      </div>
    </section>

        <!----------------- 
        Features - Pentagon Clip-path with Responsive Layout
        SM: Vertical (1 column)
        MD-LG: Honeycomb (3 on top, 2 centered on bottom)
    ------------------>
    <section id="features" class="py-10">
      <div class="px-30 md:px-[1rem]">
        <!-- Section Heading -->
        <div data-aos="fade-right" class="text-center mb-16">
          <h2 class="sub_heading">Tại sao chọn chúng tôi?</h2>
          <h1 class="main_heading">
            Sự <span class="text-gradient">Độc Đáo</span> Từ
            <br />
            Konomi Shop
          </h1>
        </div>

        <!-- Features Grid Container -->
        <!-- SM: flex-col (vertical)
             MD+: grid with honeycomb layout (3-2) -->
        <div class="w-full">
          <!-- Top Row: 3 Features (Desktop Honeycomb Top) -->
          <div class="flex flex-col md:gap-8 md:grid md:grid-cols-3 lg:gap-8 lg:mb-0">
            <div
              v-for="(feature, index) in featureRows.topRow"
              :key="feature.id"
              :data-aos="`zoom-in`"
              :data-aos-delay="`${index * 100}`"
              class="feature-card-pentagon group"
            >
              <!-- Pentagon Clip-path Container -->
              <div
                class="relative h-64 md:h-72 lg:h-80 overflow-hidden"
                :style="{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }"
              >
                <!-- Background Image -->
                <div
                  class="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                  :style="{ backgroundImage: feature.bgImage }"
                />
                <!-- Dark Overlay Filter -->
                <div class="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />

                <!-- Content: Icon + Title + Description -->
                <div class="absolute inset-0 h-full flex flex-col items-center justify-center px-6 text-center text-white">
                  <!-- Icon + Title (Co lại + lên trên khi hover) -->
                  <div class="feature-header relative flex flex-col items-center justify-center transition-all duration-500 ease-out">
                    <UIcon
                      :name="feature.icon"
                      class="w-12 h-12 text-primary-300 mb-2 transition-all duration-500"
                    />
                    <h3 class="font-bold text-lg md:text-base lg:text-lg leading-tight transition-all duration-500">
                      {{ feature.title }}
                    </h3>
                  </div>

                  <!-- Description (Hiển thị từ dưới lên khi hover) -->
                  <p class="feature-description absolute bottom-0 left-0 right-0 px-6 py-6 text-sm leading-snug opacity-0 transition-all duration-500 ease-out">
                    {{ feature.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Row: 2 Features (Desktop Honeycomb Centered) -->
          <div class="flex flex-col md:gap-8 md:grid md:grid-cols-2 lg:gap-8 md:mt-12 lg:mt-16 lg:ml-[calc(25%+16px)]">
            <div
              v-for="(feature, index) in featureRows.bottomRow"
              :key="feature.id"
              :data-aos="`zoom-in`"
              :data-aos-delay="`${(3 + index) * 100}`"
              class="feature-card-pentagon group"
            >
              <!-- Pentagon Clip-path Container -->
              <div
                class="relative h-64 md:h-72 lg:h-80 overflow-hidden"
                :style="{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }"
              >
                <!-- Background Image -->
                <div
                  class="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                  :style="{ backgroundImage: feature.bgImage }"
                />
                <!-- Dark Overlay Filter -->
                <div class="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />

                <!-- Content: Icon + Title + Description -->
                <div class="absolute inset-0 h-full flex flex-col items-center justify-center px-6 text-center text-white">
                  <!-- Icon + Title (Co lại + lên trên khi hover) -->
                  <div class="feature-header relative flex flex-col items-center justify-center transition-all duration-500 ease-out">
                    <UIcon
                      :name="feature.icon"
                      class="w-12 h-12 text-primary-300 mb-2 transition-all duration-500"
                    />
                    <h3 class="font-bold text-lg md:text-base lg:text-lg leading-tight transition-all duration-500">
                      {{ feature.title }}
                    </h3>
                  </div>

                  <!-- Description (Hiển thị từ dưới lên khi hover) -->
                  <p class="feature-description absolute bottom-0 left-0 right-0 px-6 py-6 text-sm leading-snug opacity-0 transition-all duration-500 ease-out">
                    {{ feature.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
</template>

<style scoped>
/* Video background responsive adjustments - Slogan */
@media (max-width: 768px) {
  video {
    object-position: center;
  }
}

@media (min-width: 1024px) {
  video {
    object-position: center bottom;
  }
}

/* ============ FEATURES - Pentagon Clip-path Styling ============ */

/* Base pentagon card styling */
.feature-card-pentagon {
  cursor: pointer;
  transition: all 300ms ease-out;
}

/* Mobile: Vertical stack (1 column) */
@media (max-width: 767px) {
  .feature-card-pentagon {
    width: 100%;
  }
  
  /* Mobile: Hide description */
  .feature-description {
    display: none !important;
  }
}

/* Tablet & Desktop: Honeycomb layout with hover animations */
@media (min-width: 768px) {
  .feature-card-pentagon {
    transition: all 300ms ease-out;
  }

  .feature-card-pentagon:hover {
    filter: drop-shadow(0 20px 25px rgba(0, 0, 0, 0.15));
    transform: translateY(-8px);
  }
  
  /* Tablet: Text sizes */
  .feature-card-pentagon h3 {
    font-size: 1rem; /* base */
  }

  .feature-card-pentagon p {
    font-size: 0.75rem; /* xs */
  }

  /* Feature header - positioned to allow transform */
  .feature-header {
    will-change: transform;
    position: relative;
    z-index: 10;
  }

  /* Hover animations */
  /* Icon & Title: Co nhỏ + lên trên */
  .feature-card-pentagon:hover .feature-header {
    transform: translateY(-24px) scale(0.9) !important;
  }

  /* Description styling */
  .feature-description {
    will-change: opacity, transform;
    z-index: 5;
  }

  /* Description: Hiển thị từ dưới lên */
  .feature-card-pentagon:hover .feature-description {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }

  /* Default: Description ẩn dưới */
  .feature-description {
    opacity: 0;
    transform: translateY(16px);
  }
}

/* Large screens: Enhanced animations */
@media (min-width: 1024px) {
  .feature-card-pentagon {
    transition: all 300ms ease-out;
  }

  .feature-card-pentagon:hover {
    filter: drop-shadow(0 25px 50px rgba(0, 0, 0, 0.25));
    transform: translateY(-16px);
  }
  
  /* Desktop: Text sizes */
  .feature-card-pentagon h3 {
    font-size: 1.125rem; /* lg */
  }

  .feature-card-pentagon p {
    font-size: 0.875rem; /* sm */
  }

  /* Feature header - positioned to allow transform */
  .feature-header {
    will-change: transform;
    position: relative;
    z-index: 10;
  }

  /* Hover animations - More dramatic on desktop */
  /* Icon & Title: Co nhỏ + lên trên nhiều hơn */
  .feature-card-pentagon:hover .feature-header {
    transform: translateY(-36px) scale(0.85) !important;
  }

  /* Description styling */
  .feature-description {
    will-change: opacity, transform;
    z-index: 5;
  }

  /* Description: Hiển thị từ dưới lên */
  .feature-card-pentagon:hover .feature-description {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }

  /* Default: Description ẩn dưới */
  .feature-description {
    opacity: 0;
    transform: translateY(20px);
  }
}

/* Pentagon overlay effects */
.feature-card-pentagon:hover > div:first-child {
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
}
</style>
