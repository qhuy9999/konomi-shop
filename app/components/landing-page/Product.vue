<script setup lang="ts">
const { animateOnScroll } = useScrollAnimation();

onMounted(() => {
  animateOnScroll("[data-animate-sub-heading]", "animate-slideRight", 0, false);
  animateOnScroll(
    "[data-animate-main-heading]",
    "animate-slideRight",
    300,
    false
  );
  animateOnScroll(
    "[data-animate-description]",
    "animate-slideRight",
    600,
    false
  );
  animateOnScroll("[data-animate-image]", "animate-fadeIn", 1000, false);
  animateOnScroll("[data-animate-button]", "animate-fadeIn", 800, false);
});

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
</script>

<template>
  <section id="products">
    <div class="container">
      <div class="flex flex-col gap-7">
        <!-- heading -->
        <div data-aos="fade-right">
          <h2 data-animate-sub-heading class="sub_heading">Tìm hiểu</h2>
          <h1 data-animate-main-heading class="main_heading">
            sản phẩm <span class="text-gradient">trà ngon</span>
          </h1>
        </div>

        <!-- ============ CUSTOM TABS ============ -->
        <div class="products-tabs">
          <!-- Tab Buttons Component -->
          <ButtonTab
            :tabs="tabs"
            :model-value="activeTab"
            @update:model-value="activeTab = $event as typeof activeTab"
            variant="default"
          />

          <div class="tabs-content">
            <!-- Matcha Tab -->
            <div v-show="activeTab === 'matcha'">
              <div
                class="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-8 items-center py-2"
              >
                <NuxtImg
                  data-animate-image
                  src="/images/product_1.jpg"
                  alt="Matcha Magic - Premium matcha tea powder"
                  class="w-full h-auto rounded-lg"
                />
                <div>
                  <h4 data-animate-sub-heading class="products-sub_heading">
                    Matcha Magic
                  </h4>
                  <h5 data-animate-main-heading class="products-main_heading">
                    Khám phá những lợi ích tiềm năng của "vàng xanh" từ Nhật Bản
                  </h5>
                  <p data-animate-description>
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
                  <Button
                    label="Xem Sản Phẩm Matcha"
                    to="/products?category=matcha"
                    variant="accent"
                    size="md"
                    icon="i-lucide-arrow-right"
                    data-animate-button
                  />
                </div>
              </div>
            </div>
            <!-- White Tea Tab -->
            <div v-show="activeTab === 'white-tea'">
              <div
                class="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-8 items-center py-2"
              >
                <NuxtImg
                  src="/images/product_2.jpg"
                  alt="White Tea - Premium white tea leaves"
                  class="w-full h-auto rounded-lg"
                />
                <div>
                  <h3 class="products-sub_heading">
                    Tinh chất tinh tế từ trà trắng
                  </h3>
                  <h4 class="products-main_heading">
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
                  <Button
                    label="Xem Sản Phẩm Trà Trắng"
                    to="/products?category=white-tea"
                    variant="accent"
                    size="md"
                    icon="i-lucide-arrow-right"
                    data-animate-button
                  />
                </div>
              </div>
            </div>

            <!-- Oolong Tab -->
            <div v-show="activeTab === 'oolong'">
              <div
                class="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-8 items-center py-2"
              >
                <NuxtImg
                  src="/images/product_3.jpg"
                  alt="Oolong Tea - Premium oolong tea leaves"
                  class="w-full h-auto rounded-lg"
                />
                <div>
                  <h3 class="products-sub_heading">
                    Cuộc cách mạng trà ô long
                  </h3>
                  <h4 class="products-main_heading">
                    Mở khóa bí mật của loại trà lành mạnh nhất từ thiên nhiên
                  </h4>
                  <p>
                    Bạn có tò mò về bí quyết trường thọ không? Hãy tìn đến trà ô
                    long! Thức uống cổ xưa này, được tôn sùng trong nhiều nền
                    văn hóa trên thế giới, chứa đầy chất chống oxy hóa mạnh mẽ
                    có thể thúc đẩy quá trình trao đổi chất, tăng cường chức
                    năng não và thúc đẩy sức khỏe tim mạch.
                  </p>
                  <Button
                    label="Xem Sản Phẩm Trà Ô Long"
                    to="/products?category=oolong"
                    variant="accent"
                    size="md"
                    icon="i-lucide-arrow-right"
                    data-animate-button
                  />
                </div>
              </div>
            </div>

            <!-- Black Tea Tab -->
            <div v-show="activeTab === 'black-tea'">
              <div
                class="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-8 items-center py-2"
              >
                <NuxtImg
                  src="/images/product_4.png"
                  alt="Black Tea - Premium black tea leaves"
                  class="w-full h-auto rounded-lg"
                />
                <div>
                  <h3 class="products-sub_heading">
                    Đánh thức các giác quan cùng trà đen
                  </h3>
                  <h4 class="products-main_heading">
                    Hương vị đậm đà truyền thống vượt thời gian
                  </h4>
                  <p>
                    Hãy thưởng thức hương vị đậm đà, mạnh mẽ của trà đen, được
                    chế tác hoàn hảo cho khẩu vị sành điệu. Mỗi ngụm trà mang
                    đến sự pha trộn hài hòa giữa hương vị sâu lắng và hương thơm
                    sảng khoái, khiến đây trở thành lựa chọn lý tưởng cho cả
                    nghi lễ buổi sáng và giờ nghỉ trưa.
                  </p>
                  <Button
                    label="Xem Sản Phẩm Trà Đen"
                    to="/products?category=black-tea"
                    variant="accent"
                    size="md"
                    icon="i-lucide-arrow-right"
                    data-animate-button
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@import "@/assets/css/main.css";

.products-sub_heading {
  @apply text-primary-625 text-sm md:text-base font-medium uppercase;
}
.products-main_heading {
  @apply text-accent-775 text-2xl md:text-3xl lg:text-4xl font-lobster capitalize font-semibold;
}
</style>
