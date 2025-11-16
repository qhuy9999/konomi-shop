// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },  // ✅ Keep this for Nuxt DevTools
  modules: ["@pinia/nuxt", "@nuxt/ui", "@nuxt/image", "@nuxtjs/i18n"],
  css: ["@/assets/css/main.css"],

  icon: {
    mode: "svg",
    customCollections: [
      {
        prefix: "custom",
        dir: "./app/assets/icons",
      },
    ],
  },

  components: [
    {
      path: "@/components",
      pathPrefix: false,
      global: true,
      extensions: ["vue"],
    },
  ],

  app: {
    head: {
      title: "Konomi-Shop - Website selling food, drink, and groceries",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },

        // SEO cơ bản
        {
          name: "description",
          content: "Website selling food, drink, and groceries",
        },
        { name: "keywords", content: "Nuxt3, SEO, Vue3, Tailwind" },

        // Social sharing (Open Graph)
        { property: "og:title", content: "Dự án Nuxt 3" },
        {
          property: "og:description",
          content: "Website demo Nuxt 3 chuẩn SEO",
        },
        {
          property: "og:image",
          content: "https://cdn.example.com/og-image.png",
        },
        { property: "og:type", content: "website" },

        // Twitter Card
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "Dự án Nuxt 3" },
        {
          name: "twitter:description",
          content: "Website demo Nuxt 3 chuẩn SEO",
        },
        {
          name: "twitter:image",
          content: "https://cdn.example.com/og-image.png",
        },
      ],
      link: [{ rel: "canonical", href: "https://example.com/page-demo" }],
    },
  },

  typescript: {
    includeWorkspace: true,
    tsConfig: {
      compilerOptions: {
        target: "ES2020",
        module: "ESNext",
        moduleResolution: "Node",
        types: ["@types/node", "nuxt"],
        esModuleInterop: true,
        strict: true,
        sourceMap: true,
        sourceRoot: "/",
      },
      include: ["**/*.ts", "**/*.d.ts", "**/*.tsx", "**/*.vue"],
      exclude: ["node_modules"],
    },
  },

  // ✅ Auto-import composables
  imports: {
    dirs: [
      "composables", // composables/*.ts
      "composables/**", // composables/**/*.ts
    ],
  },

  pinia: {
    storesDirs: ["@/stores/**"],
  },

  i18n: {
    locales: [
      { code: 'vi', language: 'vi-VN', name: 'Tiếng Việt', iso: 'vi' },
      { code: 'en', language: 'en-US', name: 'English', iso: 'en' },
      { code: 'ja', language: 'ja-JP', name: '日本語', iso: 'ja' },
      { code: 'de', language: 'de-DE', name: 'Deutsch', iso: 'de' },
    ],
    defaultLocale: 'vi',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
    vueI18n: '~/i18n.config.ts',
  },

  runtimeConfig: {
    // private keys: only available on server-side
    JWT_TOKEN_KEY: process.env.JWT_TOKEN_KEY,
    REFRESH_TOKEN_KEY: process.env.REFRESH_TOKEN_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    nodemailer: {
      from: `"Konomi Shop" <${
        process.env.MAILTRAP_FROM_EMAIL || "noreply@Konomi-shop.com"
      }>`,
      host: process.env.MAILTRAP_HOST,
      port: Number(process.env.MAILTRAP_PORT),
      secure: false,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    },
    sitemap: {
      hostname: "https://example.com",
      gzip: true,
      exclude: ["/secret", "/admin/**"],
      routes: [
        "/page/1",
        "/page/2",
        {
          url: "/page/3",
          changefreq: "daily",
          priority: 1,
          lastmod: "2017-06-30T13:30:00.000Z",
        },
      ],
    },

    // public keys: available on both client and server
    public: {
      appUrl: process.env.NUXT_PUBLIC_APP_URL || "http://localhost:3000",
      // or
      NUXT_PUBLIC_APP_URL: process.env.NUXT_PUBLIC_APP_URL,
    },
  },
});
