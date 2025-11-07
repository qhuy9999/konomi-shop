/**
 * useProducts Composable
 * Product data & partner logos management
 */

export interface Product {
  name: string
  img: string
  description: string
  category: 'blacktea' | 'matcha' | 'oolong' | 'whitetea'
}

export interface PartnerLogo {
  fileName: string
  alt: string
}

export const useProducts = () => {
  // ===== Product List =====
  const productList: Ref<Product[]> = ref([
    {
      name: 'Midnight Spice',
      img: '/products/blacktea1.jpg',
      description:
        'Một sự pha trộn đậm đà với quế, bạch đậu khấu và chút hương đinh hương.',
      category: 'blacktea',
    },
    {
      name: 'Golden Earl',
      img: '/products/blacktea2.jpg',
      description:
        'Một biến tấu từ trà Earl Grey cổ điển với chút ngọt ngào của mật ong.',
      category: 'blacktea',
    },
    {
      name: 'Smoky Reverie',
      img: '/products/blacktea3.jpg',
      description: 'Trà đen đậm đà với hương khói, thoảng vị mạch nha và đất.',
      category: 'blacktea',
    },
    {
      name: 'Citrus Infusion',
      img: '/products/blacktea4.jpg',
      description: 'Trà đen tươi sáng với hương cam, chanh và cam bergamot rực rỡ.',
      category: 'blacktea',
    },
    {
      name: 'Zen Matcha',
      img: '/products/matcha1.jpg',
      description:
        'Matcha nguyên chất từ Nhật Bản, với vị đắng nhẹ và hậu vị ngọt.',
      category: 'matcha',
    },
    {
      name: 'Emerald Harmony',
      img: '/products/oolong1.jpg',
      description:
        'Trà oolong bán oxi hóa với hương hoa và vị trái cây tinh tế.',
      category: 'oolong',
    },
    {
      name: 'White Peony',
      img: '/products/whitetea1.jpg',
      description:
        'Trà trắng tinh tế với vị nhẹ nhàng, ngọt tự nhiên và hương hoa.',
      category: 'whitetea',
    },
    {
      name: 'Spring Blossom',
      img: '/products/whitetea2.jpg',
      description:
        'Trà trắng cao cấp với hương hoa anh đào và vị tươi mát.',
      category: 'whitetea',
    },
  ])

  // ===== Partner Logos =====
  const partnerLogos: Ref<PartnerLogo[]> = ref([
    { fileName: 'costco.png', alt: 'Costco Logo' },
    { fileName: 'kroger.png', alt: 'Kroger Logo' },
    { fileName: 'meijer.png', alt: 'Meijer Logo' },
    { fileName: 'publix.png', alt: 'Publix Logo' },
    { fileName: 'safeway.png', alt: 'Safeway Logo' },
    { fileName: 'target.png', alt: 'Target Logo' },
    { fileName: 'walmart.png', alt: 'Walmart Logo' },
    { fileName: 'wegmans.png', alt: 'Wegmans Logo' },
    { fileName: 'whole-foods.png', alt: 'Whole Foods Logo' },
  ])

  // ===== Generate Duplicated Logos (for carousel effect) =====
  const logoList = computed(() => {
    const duplicated: PartnerLogo[] = []
    for (let i = 0; i < 2; i++) {
      duplicated.push(...partnerLogos.value)
    }
    return duplicated
  })

  // ===== Utility Functions =====
  const getProductsByCategory = (category: Product['category']) => {
    return computed(() =>
      productList.value.filter((p) => p.category === category)
    )
  }

  const getProductByName = (name: string) => {
    return computed(() => productList.value.find((p) => p.name === name))
  }

  return {
    productList,
    partnerLogos,
    logoList,
    getProductsByCategory,
    getProductByName,
  }
}
