// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@pinia/nuxt", "nuxt-simple-sitemap"],
  css: ["@/assets/css/main.css"],

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
      },
      include: ["**/*.ts", "**/*.d.ts", "**/*.tsx", "**/*.vue"],
      exclude: ["node_modules"],
    },
  },

  pinia: {
    storesDirs: ["@/stores/**"],
  },

  runtimeConfig: {
    // private keys: only available on server-side
    JWT_TOKEN_KEY: process.env.JWT_TOKEN_KEY,
    REFRESH_TOKEN_KEY: process.env.REFRESH_TOKEN_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    nodemailer: {
      from: '"Konomi Shop App" <noreply@app.com>',
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
  },
});
