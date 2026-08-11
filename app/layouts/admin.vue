<template>
  <div class="flex h-screen overflow-hidden bg-slate-100 font-sans text-slate-800">
    <!-- SIDEBAR -->
    <aside class="w-64 bg-slate-950 text-slate-300 flex flex-col flex-shrink-0 h-screen border-r border-slate-800 z-20">
      <!-- Header / Logo Admin -->
      <div class="p-6 border-b border-slate-800/80 flex items-center gap-3">
        <img src="/assets/logo-ywka.png" alt="Logo SD YWKA"
          class="w-10 h-10 object-contain p-1 bg-white/10 rounded-xl shadow-lg shadow-amber-500/10 shrink-0" />
        <div>
          <h1 class="font-extrabold text-white text-sm tracking-wide">ADMIN PANEL</h1>
          <p class="text-[11px] text-slate-400 font-medium">SD YWKA Official</p>
        </div>
      </div>

      <!-- Navigation Menu -->
      <nav class="flex-1 overflow-y-auto p-4 space-y-6 custom-sidebar-scroll">
        <!-- GROUP 1: MENU UTAMA -->
        <div>
          <p class="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Menu Utama</p>
          <div class="space-y-1">
            <NuxtLink to="/admin"
              exact-active-class="bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 hover:text-white transition">
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>Dashboard</span>
            </NuxtLink>

            <NuxtLink to="/admin/berita"
              active-class="bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 hover:text-white transition">
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <span>Manajemen Berita</span>
            </NuxtLink>

            <NuxtLink to="/admin/event"
              active-class="bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 hover:text-white transition">
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Manajemen Event</span>
            </NuxtLink>

            <NuxtLink to="/admin/pengumuman"
              active-class="bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 hover:text-white transition">
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span>Pengumuman</span>
            </NuxtLink>

            <NuxtLink to="/admin/guru"
              active-class="bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 hover:text-white transition">
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>Data Guru & SDM</span>
            </NuxtLink>

            <NuxtLink to="/admin/galeri"
              active-class="bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 hover:text-white transition">
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Galeri Foto & Video</span>
            </NuxtLink>
          </div>
        </div>

        <!-- GROUP 2: SISTEM KEHADIRAN -->
        <div>
          <p class="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Sistem Kehadiran</p>
          <div class="space-y-1">
            <NuxtLink to="/admin/presensi/scan"
              active-class="bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 hover:text-white transition">
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              <span>Scan QR Code</span>
            </NuxtLink>

            <NuxtLink to="/admin/presensi/riwayat"
              active-class="bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 hover:text-white transition">
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span>Riwayat Kehadiran</span>
            </NuxtLink>
          </div>
        </div>

        <!-- GROUP 3: SISTEM & PENGATURAN -->
        <div>
          <p class="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Sistem & Pengaturan</p>
          <div class="space-y-1">
            <NuxtLink to="/admin/profil"
              active-class="bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 hover:text-white transition">
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h5m-5 0V11m0 0h5m-5 0H7m5 0v10" />
              </svg>
              <span>Profil & Banner</span>
            </NuxtLink>

            <!-- MENU BARU: USER & KARTU QR -->
            <NuxtLink to="/admin/users"
              active-class="bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 hover:text-white transition">
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
              <span>User & Kartu QR</span>
            </NuxtLink>

            <NuxtLink to="/admin/manajemen-users"
              active-class="bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 hover:text-white transition">
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Manajemen User</span>
            </NuxtLink>

            <NuxtLink to="/" target="_blank" rel="noopener noreferrer"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 hover:text-white transition text-slate-400 mt-2">
              <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span>Lihat Website Utama</span>
            </NuxtLink>
          </div>
        </div>
      </nav>

      <!-- PROFILE BOTTOM -->
      <div class="p-4 border-t border-slate-800">
        <button @click="showLogoutModal = true" type="button"
          class="w-full flex items-center justify-between bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 hover:border-slate-700 transition group text-left cursor-pointer">
          <div class="flex items-center gap-3 overflow-hidden">
            <img v-if="userMe?.foto" :src="userMe.foto" alt="Avatar"
              class="w-8 h-8 rounded-lg object-cover shrink-0 shadow-md border border-slate-700" />
            <div v-else
              class="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-bold text-slate-950 text-xs shrink-0 shadow-md uppercase">
              {{ getInitial(userMe?.nama || userMe?.username) }}
            </div>

            <div class="overflow-hidden">
              <p class="text-xs font-bold text-white truncate group-hover:text-amber-400 transition">
                {{ userMe?.nama || userMe?.username || 'Administrator' }}
              </p>
              <p class="text-[10px] text-slate-400 truncate">Administrator</p>
            </div>
          </div>

          <svg class="w-4 h-4 text-slate-500 group-hover:text-red-400 transition shrink-0" fill="none"
            stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </aside>

    <!-- KONTEN UTAMA -->
    <div class="flex-1 flex flex-col h-screen overflow-y-auto">
      <header
        class="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div class="flex items-center gap-2">
          <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-xs font-bold text-slate-600 uppercase tracking-wider">Panel Kontrol Admin Aktif</span>
        </div>
      </header>

      <main class="p-6 lg:p-8 flex-1">
        <slot />
      </main>
    </div>

    <!-- MODAL LOGOUT -->
    <Teleport to="body">
      <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
        <div v-if="showLogoutModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
          @click.self="showLogoutModal = false">
          <div
            class="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center space-y-5">
            <div
              class="w-14 h-14 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>

            <div>
              <h3 class="text-lg font-bold text-white mb-1">Konfirmasi Logout</h3>
              <p class="text-sm text-slate-400">Apakah anda yakin untuk logout?</p>
            </div>

            <div class="flex items-center gap-3 pt-2">
              <button @click="showLogoutModal = false" :disabled="isLoggingOut" type="button"
                class="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition disabled:opacity-50">
                Tidak
              </button>
              <button @click="handleLogout" :disabled="isLoggingOut" type="button"
                class="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 disabled:opacity-50">
                <span v-if="isLoggingOut"
                  class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>{{ isLoggingOut ? 'Keluar...' : 'Ya' }}</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// MENCEGAH SEO / INDEXING ENGINE PADA SELURUH HALAMAN DENGAN LAYOUT ADMIN
useHead({
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

const config = useRuntimeConfig()
const API_BASE = config.public.apiBase

const showLogoutModal = ref(false)
const isLoggingOut = ref(false)

const token = useCookie('auth_token')
const refreshToken = useCookie('refresh_token')
const authUser = useCookie('auth_user')

// PERBAIKAN: Gunakan `watch: false` agar useFetch TIDAK otomatis memanggil API /api/auth/me/ saat token dikosongkan pada proses logout
const { data: userMe } = await useFetch(`${API_BASE}/api/auth/me/`, {
  headers: computed(() => ({
    Authorization: token.value ? `Bearer ${token.value}` : ''
  })),
  lazy: true,
  watch: false,
  default: () => null
})

const getInitial = (name) => {
  if (!name) return 'AD'
  const words = name.trim().split(' ')
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

const handleLogout = async () => {
  isLoggingOut.value = true
  try {
    if (refreshToken.value) {
      await $fetch(`${API_BASE}/api/auth/logout/`, {
        method: 'POST',
        headers: {
          Authorization: token.value ? `Bearer ${token.value}` : ''
        },
        body: { refresh: refreshToken.value }
      })
    }
  } catch (err) {
    console.warn('Pesan penutupan sesi:', err)
  } finally {
    // Bersihkan seluruh cookie autentikasi
    token.value = null
    refreshToken.value = null
    authUser.value = null
    isLoggingOut.value = false
    showLogoutModal.value = false
    await navigateTo('/login', { replace: true })
  }
}
</script>

<style scoped>
.custom-sidebar-scroll::-webkit-scrollbar {
  width: 5px;
}

.custom-sidebar-scroll::-webkit-scrollbar-track {
  background: #020617;
}

.custom-sidebar-scroll::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 10px;
}

.custom-sidebar-scroll::-webkit-scrollbar-thumb:hover {
  background: #f59e0b;
}

.custom-sidebar-scroll {
  scrollbar-width: thin;
  scrollbar-color: #1e293b #020617;
}
</style>