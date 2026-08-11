export default defineNuxtRouteMiddleware((to, from) => {
  // 1. Ambil cookie autentikasi
  const token = useCookie('auth_token')
  const authUserCookie = useCookie('auth_user')

  // Jika token sudah tidak ada (misal setelah logout), bersihkan cookie auth_user secara otomatis
  if (!token.value) {
    authUserCookie.value = null
  }

  // 2. Parse data user dari cookie dengan aman
  let user: { roles?: string[] } | null = null
  if (authUserCookie.value) {
    try {
      user = typeof authUserCookie.value === 'string' 
        ? JSON.parse(authUserCookie.value) 
        : authUserCookie.value
    } catch (error) {
      user = null
      authUserCookie.value = null
    }
  }

  // Sesi login valid HANYA jika ada token DAN data user
  const isLoggedIn = !!token.value && !!user
  const userRoles = user?.roles || []

  // 3. Deteksi Prefix Rute / Halaman Tujuan
  const isAdminRoute = to.path.startsWith('/admin')
  const isUserRoute = to.path.startsWith('/user')
  const isLoginRoute = to.path === '/login' || to.path === '/login/'

  // --- LOGIKA PROTEKSI & REDIRECT ---

  // SKENARIO A: Belum Login tapi mencoba akses halaman Admin atau User
  if (!isLoggedIn && (isAdminRoute || isUserRoute)) {
    return navigateTo('/login')
  }

  // SKENARIO B: Sudah Login tapi mencoba buka halaman /login lagi
  if (isLoggedIn && isLoginRoute) {
    if (userRoles.includes('admin')) {
      return navigateTo('/admin')
    } else if (userRoles.includes('guru') || userRoles.includes('staf') || userRoles.includes('user')) {
      return navigateTo('/user')
    }
    return navigateTo('/')
  }

  // SKENARIO C: Proteksi Khusus Portal Admin (/admin/*)
  if (isAdminRoute) {
    if (!userRoles.includes('admin')) {
      // Jika bukan Admin (misal hanya Guru/Staf), lempar ke portal User
      return navigateTo('/user')
    }
  }

  // SKENARIO D: Proteksi Portal User (/user/*)
  if (isUserRoute) {
    const hasUserAccess = userRoles.some(role => ['guru', 'staf', 'user', 'admin'].includes(role))
    if (!hasUserAccess) {
      return navigateTo('/login')
    }
  }
})