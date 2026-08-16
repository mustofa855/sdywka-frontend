<!-- FILE: pages/login.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  layout: false
})

useHead({
  title: 'Login - SD YWKA REL HOMY SCHOOL',
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap' }
  ]
})

const router = useRouter()
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase

// State Form Login
const identifier = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

// State Multi-Role Modal
const showRoleModal = ref(false)
const userRoles = ref([])
const loggedInUser = ref(null)

// Inisialisasi Cookie
const authToken = useCookie('auth_token')
const refreshToken = useCookie('refresh_token')
const authUser = useCookie('auth_user')

// Helper: Bersihkan cookie jika token tidak valid/kadaluwarsa
const clearAuthCookies = () => {
  authToken.value = null
  refreshToken.value = null
  authUser.value = null
}

// Helper Navigasi Berdasarkan Role
const navigateToRole = (role) => {
  showRoleModal.value = false
  const targetRole = String(role).toLowerCase()

  if (targetRole === 'admin') {
    router.push('/admin/')
  } else if (targetRole === 'staf' || targetRole === 'guru') {
    router.push('/user/')
  } else {
    router.push('/')
  }
}

// OTOMATIS CEK SESI USER SAAT HALAMAN LOGIN DIBUKA
onMounted(async () => {
  if (!authToken.value && !refreshToken.value) {
    return
  }

  isLoading.value = true
  try {
    // 1. Coba verifikasi token aktif ke endpoint /api/auth/me/
    const resMe = await $fetch(`${API_BASE}/api/auth/me/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken.value}`
      }
    })

    if (resMe) {
      const roles = resMe.roles || ['guru']
      const userData = {
        id: resMe.id,
        username: resMe.username,
        email: resMe.email,
        nama_lengkap: resMe.nama_lengkap || resMe.nama || resMe.username,
        nama: resMe.nama || resMe.username,
        roles: roles,
        foto_profil: resMe.foto
      }
      authUser.value = JSON.stringify(userData)
      loggedInUser.value = userData

      if (roles.length > 1) {
        userRoles.value = roles
        showRoleModal.value = true
      } else {
        navigateToRole(roles[0])
      }
      return
    }
  } catch (err) {
    // 2. Jika token access expired, coba auto refresh token!
    if (refreshToken.value) {
      try {
        const resRefresh = await $fetch(`${API_BASE}/api/auth/refresh/`, {
          method: 'POST',
          body: { refresh: refreshToken.value }
        })

        if (resRefresh && resRefresh.access) {
          authToken.value = resRefresh.access

          // Ambil kembali data user terbaru dengan token baru
          const resMeNew = await $fetch(`${API_BASE}/api/auth/me/`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${resRefresh.access}`
            }
          })

          const roles = resMeNew.roles || ['guru']
          const userData = {
            id: resMeNew.id,
            username: resMeNew.username,
            email: resMeNew.email,
            nama_lengkap: resMeNew.nama_lengkap || resMeNew.nama || resMeNew.username,
            nama: resMeNew.nama || resMeNew.username,
            roles: roles,
            foto_profil: resMeNew.foto
          }
          authUser.value = JSON.stringify(userData)
          loggedInUser.value = userData

          if (roles.length > 1) {
            userRoles.value = roles
            showRoleModal.value = true
          } else {
            navigateToRole(roles[0])
          }
          return
        }
      } catch (refreshErr) {
        clearAuthCookies()
      }
    } else {
      clearAuthCookies()
    }
  } finally {
    isLoading.value = false
  }
})

// HANDLE SUBMIT LOGIN DENGAN PENGATURAN COOKIE DINAMIS
const handleLogin = async () => {
  if (!identifier.value || !password.value) {
    errorMessage.value = 'Silakan isi NIP/Username dan Kata Sandi.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const res = await $fetch(`${API_BASE}/api/auth/login/`, {
      method: 'POST',
      body: {
        identifier: identifier.value,
        password: password.value
      }
    })

    const cookieOptions = rememberMe.value
      ? { maxAge: 60 * 60 * 24 * 7, path: '/' }
      : { path: '/' }

    useCookie('auth_token', cookieOptions).value = res.access
    useCookie('refresh_token', cookieOptions).value = res.refresh
    useCookie('auth_user', cookieOptions).value = JSON.stringify(res.user)

    loggedInUser.value = res.user
    userRoles.value = res.user.roles || ['guru']

    if (userRoles.value.length > 1) {
      showRoleModal.value = true
    } else {
      navigateToRole(userRoles.value[0])
    }

  } catch (err) {
    if (err.data && err.data.message) {
      errorMessage.value = err.data.message
    } else {
      errorMessage.value = 'Gagal terhubung ke server. Pastikan backend Django berjalan.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="h-screen w-full bg-[#F8FAFC] flex flex-col justify-center items-center p-4 font-['Outfit',sans-serif] antialiased selection:bg-blue-100 selection:text-blue-900 relative overflow-hidden">
    
    <!-- Ambient Background Glows -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none z-0 flex items-center justify-center">
      <div class="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-[100px]"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-[100px]"></div>
    </div>

    <!-- FLOATING BACK BUTTON -->
    <NuxtLink to="/" class="absolute top-4 left-4 sm:top-6 sm:left-6 z-50 group flex items-center gap-2 px-3.5 py-2 bg-white/80 hover:bg-white backdrop-blur-md border border-slate-200/60 rounded-full shadow-sm hover:shadow transition-all duration-200">
      <svg class="w-4 h-4 text-slate-500 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
      </svg>
      <span class="text-xs font-semibold text-slate-600 group-hover:text-slate-900 pr-0.5">Kembali</span>
    </NuxtLink>

    <!-- Main Content Box -->
    <div class="w-full max-w-[380px] relative z-10">
      
      <!-- 1. HEADER LOGO -->
      <div class="flex flex-col items-center mb-5">
        <div class="w-13 h-13 bg-white rounded-2xl flex items-center justify-center p-2.5 shadow-[0_4px_16px_rgb(0,0,0,0.04)] border border-slate-100/80 mb-3 relative">
          <span class="absolute -top-1 -right-1 flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
          </span>
          <img src="/logo-ywka.png" alt="Logo YWKA" class="w-10 h-10 object-contain" onerror="this.src='https://via.placeholder.com/40'" />
        </div>
        <h1 class="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">SD YWKA REL HOMY SCHOOL Bandung</h1>
        <p class="text-xs font-medium text-slate-500">Sistem Informasi Terpadu</p>
      </div>

      <!-- 2. LOGIN CARD -->
      <div class="bg-white rounded-2xl p-6 sm:p-7 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.05)] border border-slate-100/80">
        
        <div class="mb-5">
          <h2 class="text-lg font-bold text-slate-900 tracking-tight">Selamat Datang</h2>
          <p class="text-xs text-slate-500 font-medium mt-1 leading-relaxed">Masukkan NIP / Username Anda untuk melanjutkan.</p>
        </div>

        <!-- Alert Error -->
        <div v-if="errorMessage" class="mb-4 p-3 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold rounded-xl flex items-start gap-2">
          <svg class="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Form Login -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          
          <!-- Input NIP / Username -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">NIP / Username</label>
            <div class="relative">
              <input 
                v-model="identifier" 
                type="text" 
                placeholder="Masukkan NIP atau Username" 
                required
                class="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
            </div>
          </div>

          <!-- Input Password -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1.5">Kata Sandi</label>
            <div class="relative">
              <input 
                v-model="password" 
                :type="showPassword ? 'text' : 'password'" 
                placeholder="••••••••" 
                required
                class="w-full pl-3.5 pr-10 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
              <button 
                type="button" 
                @click="showPassword = !showPassword" 
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                <svg v-if="!showPassword" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.038 10.038 0 013.682-.863c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m-1.393-2.393A3 3 0 0012 9a3 3 0 004.242 4.242M3 3l18 18" />
                </svg>
              </button>
            </div>
          </div>

          <!-- CHECKBOX REMEMBER ME -->
          <div class="flex items-center justify-between pt-0.5">
            <label class="flex items-center gap-2 cursor-pointer group">
              <input 
                v-model="rememberMe" 
                type="checkbox" 
                class="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500/20 cursor-pointer accent-slate-900" 
              />
              <span class="text-xs font-semibold text-slate-600 group-hover:text-slate-900 select-none">Ingat Saya</span>
            </label>
          </div>

          <!-- Tombol Submit -->
          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full mt-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg v-if="isLoading" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isLoading ? 'Memproses Sesi...' : 'Masuk ke Sistem' }}</span>
          </button>
        </form>

      </div>

      <!-- FOOTER TEXT -->
      <p class="text-[11px] text-center text-slate-400 font-medium mt-6">
        &copy; 2026 SD YWKA REL HOMY SCHOOL. All rights reserved.
      </p>

    </div>

    <!-- MODAL PILIH ROLE -->
    <Teleport to="body">
      <div v-if="showRoleModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
          <h3 class="text-base font-bold text-slate-900 mb-1">Pilih Akses Portal</h3>
          <p class="text-xs text-slate-500 mb-4">Akun Anda memiliki akses lebih dari satu role. Silakan pilih portal tujuan:</p>
          
          <div class="space-y-2">
            <button 
              v-for="role in userRoles" 
              :key="role"
              @click="navigateToRole(role)"
              class="w-full text-left px-4 py-3 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 rounded-xl transition-all flex items-center justify-between group"
            >
              <span class="text-xs font-bold text-slate-800 capitalize group-hover:text-blue-700">
                Portal {{ role === 'admin' ? 'Administrator' : role === 'staf' ? 'Staf & TU' : 'Guru & Pengajar' }}
              </span>
              <svg class="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>