/**
 * Composable: useFeatures
 * Manages feature cards data with pentagon clip-path styling
 * Reference: https://bennettfeely.com/clippy/
 */

export interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide icon name
  bgImage: string;
  bgColor: string;
}

export const useFeatures = () => {
  // ✅ 5 Feature Cards - Pentagon Layout
  const features: FeatureCard[] = [
    {
      id: "premium-source",
      title: "Nguồn Cung Cao Cấp",
      description:
        "Chúng tôi tự hào sản xuất trà ngay tại Hoa Kỳ, sử dụng nguyên liệu chất lượng cao từ các trang trại địa phương.",
      icon: "i-lucide-leaf",
      bgImage: "url(/images/benefit_1.jpg)",
      bgColor: "from-primary-100 to-primary-200",
    },
    {
      id: "unique-flavor",
      title: "Hương Vị Và Pha Chế Độc Đáo",
      description:
        "Sản phẩm độc quyền của chúng tôi gồm các loại trà được với hương vị độc đáo, được chế tác để làm hài lòng mọi khẩu vị.",
      icon: "i-lucide-palette",
      bgImage: "url(/images/benefit_2.jpg)",
      bgColor: "from-secondary-100 to-secondary-200",
    },
    {
      id: "health-focus",
      title: "Tập Trung Vào Sức Khỏe",
      description:
        "Hãy thưởng thức các loại trà tốt cho sức khỏe của chúng tôi, được pha chế cẩn thận để hỗ trợ trí óc, cơ thể và tâm hồn của bạn.",
      icon: "i-lucide-heart",
      bgImage: "url(/images/benefit_3.jpg)",
      bgColor: "from-accent-100 to-accent-200",
    },
    {
      id: "personalized-experience",
      title: "Trải Nghiệm Cá Nhân Hoá",
      description:
        "Trải nghiệm dịch vụ được cá nhân hóa với mọi đơn hàng, phù hợp với sở thích và nhu cầu trà riêng của bạn.",
      icon: "i-lucide-user-check",
      bgImage: "",
      bgColor: "from-warning-100 to-warning-200",
    },
    {
      id: "sustainability",
      title: "Cam Kết Bền Vững",
      description:
        "Chúng tôi cam kết bảo vệ môi trường thông qua các phương pháp nông nghiệp bền vững và bao bì thân thiện với eco.",
      icon: "i-lucide-sprout",
      bgImage: "url(/images/benefit_4.jpg)",
      bgColor: "from-success-100 to-success-200",
    },
  ];

  return {
    features,
  };
};
