/**
 * Icon Preload Plugin
 * Eagerly loads icon library collection to prevent FOUT on first page load
 */

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    // Import and cache icon collection at app startup
    // This ensures icons are available immediately without lazy loading
    import('@iconify-json/lucide/icons.json').catch(() => {
      // Gracefully handle if import fails
      console.warn('Icon collection preload failed, will lazy load instead')
    })
  }
})
