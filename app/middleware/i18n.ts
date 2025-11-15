export default defineNuxtRouteMiddleware((to, from) => {
  const { locale, setLocale } = useI18n()
  
  // Extract locale từ route
  const params = to.params as any
  const localeFromRoute = params.locale || 'vi'
  
  // Nếu locale trong route khác với locale hiện tại, set lại
  if (localeFromRoute !== locale.value) {
    setLocale(localeFromRoute)
  }
})
