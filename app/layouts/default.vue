<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const isMobileMenuOpen = ref(false)
const isLoginModalOpen = ref(false)
const showScrollTop = ref(false)

const authToken = useCookie('auth_token')
const authUser = useCookie('auth_user')

const user = computed(() => {
  if (!authUser.value) return null
  try {
    return typeof authUser.value === 'string' ? JSON.parse(authUser.value) : authUser.value
  } catch (e) {
    return null
  }
})

const isLoggedIn = computed(() => !!authToken.value && !!user.value)

const displayName = computed(() => {
  if (!user.value) return ''
  return user.value.nama_lengkap || user.value.nama || user.value.username || 'Pengguna'
})

const userPortalPath = computed(() => {
  if (!user.value || !user.value.roles) return '/user/'
  if (user.value.roles.includes('admin')) return '/admin/'
  return '/user/'
})

// Fungsi & Listener Scroll untuk Tombol Kembali ke Atas
const handleScroll = () => {
  if (typeof window !== 'undefined') {
    showScrollTop.value = window.scrollY > 300
  }
}

const scrollToTop = () => {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleScroll)
  }
})

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const openLoginModal = () => {
  isLoginModalOpen.value = true
  closeMobileMenu()
}

const closeLoginModal = () => {
  isLoginModalOpen.value = false
}

// Data Sosial Media & Kontak
const whatsappNumber = '62895344044455'
const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Halo%20Admin%20SD%20YWKA%20Bandung,%20saya%20ingin%20bertanya`

const socialLinks = [
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/sdywkaofficial?igsh=N254MWZxNmNsdTY2',
    hoverClass: 'hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-rose-500/20'
  },
  {
    name: 'TikTok',
    url: 'https://www.tiktok.com/@sdywkabandung?_r=1&_t=ZS-98DMVsngf6z',
    hoverClass: 'hover:bg-slate-800 hover:text-white hover:border-slate-700 hover:shadow-lg hover:shadow-slate-900/30'
  },
  {
    name: 'YouTube',
    url: 'https://youtube.com/@sdywkabandung?si=wC0LLoQbd1swADAH',
    hoverClass: 'hover:bg-red-600 hover:text-white hover:border-red-600 hover:shadow-lg hover:shadow-red-600/30'
  },
  {
    name: 'WhatsApp',
    url: whatsappUrl,
    hoverClass: 'hover:bg-emerald-600 hover:text-white hover:border-emerald-600 hover:shadow-lg hover:shadow-emerald-600/30'
  }
]
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 relative">
    
    <!-- TOP BAR SOSIAL MEDIA & KONTAK (DESKTOP) -->
    <div class="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800 hidden md:block">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <div class="flex items-center space-x-6">
          <a :href="whatsappUrl" target="_blank" rel="noopener noreferrer" class="flex items-center gap-1.5 hover:text-emerald-400 transition-colors">
            <svg class="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            <span>+62 895-3440-44455</span>
          </a>
          <span class="text-slate-600">|</span>
          <span class="text-slate-400">Jl. Rajawali I No. 5, Kota Bandung</span>
        </div>

        <div class="flex items-center space-x-3">
          <span class="text-slate-400 text-[11px] font-medium mr-1">Ikuti Kami:</span>
          <!-- Instagram -->
          <a href="https://www.instagram.com/sdywkaofficial?igsh=N254MWZxNmNsdTY2" target="_blank" rel="noopener noreferrer" title="Instagram SD YWKA" class="w-6 h-6 rounded-full bg-slate-800 hover:bg-rose-600 flex items-center justify-center text-slate-300 hover:text-white transition-all">
            <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
          <!-- TikTok -->
          <a href="https://www.tiktok.com/@sdywkabandung?_r=1&_t=ZS-98DMVsngf6z" target="_blank" rel="noopener noreferrer" title="TikTok SD YWKA" class="w-6 h-6 rounded-full bg-slate-800 hover:bg-black hover:border hover:border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-all">
            <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.29-2.52.73-5.06 2.66-6.68 1.3-1.1 2.98-1.69 4.69-1.65.17 0 .34.01.51.03v4.07c-.45-.09-.92-.1-1.37-.02-.87.14-1.68.64-2.17 1.38-.61.88-.73 2.05-.33 3.03.38.98 1.28 1.69 2.32 1.83 1.05.15 2.12-.22 2.81-1.03.62-.71.93-1.65.91-2.59.02-4.14.01-8.28.02-12.42z"/></svg>
          </a>
          <!-- YouTube -->
          <a href="https://youtube.com/@sdywkabandung?si=wC0LLoQbd1swADAH" target="_blank" rel="noopener noreferrer" title="YouTube SD YWKA" class="w-6 h-6 rounded-full bg-slate-800 hover:bg-red-600 flex items-center justify-center text-slate-300 hover:text-white transition-all">
            <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          </a>
        </div>
      </div>
    </div>

    <!-- Navbar Header Responsif -->
    <header class="bg-white shadow-sm border-b border-slate-200/80 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center h-16">

        <!-- KIRI: Logo YWKA -->
        <div class="flex-shrink-0 flex items-center">
          <NuxtLink to="/" class="text-2xl font-extrabold text-blue-800 tracking-tight flex items-center gap-2">
            <img src="/logo-ywka.png" alt="Logo YWKA" class="h-8 md:h-10 w-auto" />
          </NuxtLink>
        </div>

        <!-- TENGAH: Menu Navigasi Desktop -->
        <nav class="hidden md:flex space-x-6 lg:space-x-8 text-xs lg:text-sm font-semibold text-slate-600">
          <NuxtLink to="/" class="hover:text-slate-900 py-5 transition-colors"
            exact-active-class="text-slate-900 font-bold border-b-2 border-amber-400">Beranda</NuxtLink>
          <NuxtLink to="/profil" class="hover:text-slate-900 py-5 transition-colors"
            exact-active-class="text-slate-900 font-bold border-b-2 border-amber-400">Profil</NuxtLink>
          <NuxtLink to="/guru" class="hover:text-slate-900 py-5 transition-colors"
            exact-active-class="text-slate-900 font-bold border-b-2 border-amber-400">Data Guru</NuxtLink>
          <NuxtLink to="/berita" class="hover:text-slate-900 py-5 transition-colors"
            exact-active-class="text-slate-900 font-bold border-b-2 border-amber-400">Berita</NuxtLink>
          <NuxtLink to="/pengumuman" class="hover:text-slate-900 py-5 transition-colors"
            exact-active-class="text-slate-900 font-bold border-b-2 border-amber-400">Pengumuman</NuxtLink>
          <NuxtLink to="/agenda" class="hover:text-slate-900 py-5 transition-colors"
            exact-active-class="text-slate-900 font-bold border-b-2 border-amber-400">Agenda & Event</NuxtLink>
          <NuxtLink to="/galeri" class="hover:text-slate-900 py-5 transition-colors"
            exact-active-class="text-slate-900 font-bold border-b-2 border-amber-400">Galeri</NuxtLink>
        </nav>

        <!-- KANAN: Login / Status User (Desktop) & Tombol Hamburger (Mobile) -->
        <div class="flex items-center space-x-3">
          <!-- Tombol Login / Dashboard Desktop -->
          <div class="hidden md:block flex-shrink-0">
            <template v-if="!isLoggedIn">
              <button
                @click="openLoginModal"
                class="inline-flex items-center bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow gap-2 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-amber-400" viewBox="0 0 24 24">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path fill="currentColor"
                    d="M10.3 7.7a.984.984 0 0 0 0 1.4l1.9 1.9H3c-.55 0-1 .45-1 1s.45 1 1 1h9.2l-1.9 1.9a.984.984 0 0 0 0 1.4c.39.39 1.01.39 1.4 0l3.59-3.59a.996.996 0 0 0 0-1.41L11.7 7.7a.984.984 0 0 0-1.4 0M20 19h-7c-.55 0-1 .45-1 1s.45 1 1 1h7c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-7c-.55 0-1 .45-1 1s.45 1 1 1h7z" />
                </svg>
                <span>Login Portal</span>
              </button>
            </template>

            <!-- Jika Pengguna Sudah Login -->
            <NuxtLink v-else :to="userPortalPath"
              class="inline-flex items-center bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow">
              <svg class="w-4 h-4 mr-1.5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {{ displayName }}
            </NuxtLink>
          </div>

          <!-- Tombol Hamburger Mobile -->
          <button @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="md:hidden text-slate-700 hover:text-slate-900 p-2 focus:outline-none" aria-label="Toggle Menu">
            <svg v-if="!isMobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

      </div>

      <!-- MENU NAVIGASI MOBILE -->
      <transition name="slide-down">
        <div v-if="isMobileMenuOpen"
          class="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 shadow-lg">
          <NuxtLink to="/" @click="closeMobileMenu"
            class="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            exact-active-class="bg-slate-900 text-white font-bold">Beranda</NuxtLink>
          <NuxtLink to="/profil" @click="closeMobileMenu"
            class="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            exact-active-class="bg-slate-900 text-white font-bold">Profil</NuxtLink>
          <NuxtLink to="/guru" @click="closeMobileMenu"
            class="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            exact-active-class="bg-slate-900 text-white font-bold">Data Guru</NuxtLink>
          <NuxtLink to="/berita" @click="closeMobileMenu"
            class="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            exact-active-class="bg-slate-900 text-white font-bold">Berita</NuxtLink>
          <NuxtLink to="/pengumuman" @click="closeMobileMenu"
            class="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            exact-active-class="bg-slate-900 text-white font-bold">Pengumuman</NuxtLink>
          <NuxtLink to="/agenda" @click="closeMobileMenu"
            class="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            exact-active-class="bg-slate-900 text-white font-bold">Agenda & Event</NuxtLink>
          <NuxtLink to="/galeri" @click="closeMobileMenu"
            class="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            exact-active-class="bg-slate-900 text-white font-bold">Galeri</NuxtLink>

          <!-- Tombol Trigger Modal di Mobile -->
          <div class="pt-4 border-t border-slate-100">
            <template v-if="!isLoggedIn">
              <button
                @click="openLoginModal"
                class="w-full flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-amber-400" viewBox="0 0 24 24">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path fill="currentColor"
                    d="M10.3 7.7a.984.984 0 0 0 0 1.4l1.9 1.9H3c-.55 0-1 .45-1 1s.45 1 1 1h9.2l-1.9 1.9a.984.984 0 0 0 0 1.4c.39.39 1.01.39 1.4 0l3.59-3.59a.996.996 0 0 0 0-1.41L11.7 7.7a.984.984 0 0 0-1.4 0M20 19h-7c-.55 0-1 .45-1 1s.45 1 1 1h7c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-7c-.55 0-1 .45-1 1s.45 1 1 1h7z" />
                </svg>
                <span>Login Portal</span>
              </button>
            </template>

            <NuxtLink v-else :to="userPortalPath" @click="closeMobileMenu"
              class="w-full flex items-center justify-center bg-blue-900 hover:bg-blue-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all">
              <svg class="w-4 h-4 mr-2 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {{ displayName }}
            </NuxtLink>
          </div>
        </div>
      </transition>
    </header>

    <main class="flex-grow w-full">
      <slot />
    </main>

    <!-- MODAL POPUP PILIHAN LOGIN PORTAL -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="isLoginModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <!-- Backdrop Overlay -->
          <div
            class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            @click="closeLoginModal"
          ></div>

          <!-- Dialog Box -->
          <div class="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 z-10 overflow-hidden border border-slate-100">
            <!-- Tombol Close (X) -->
            <button
              @click="closeLoginModal"
              class="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Tutup Modal"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- Header Modal -->
            <div class="text-center mb-6">
              <div class="w-12 h-12 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-slate-900">Pilih Portal Login</h3>
              <p class="text-xs text-slate-500 mt-1">Silakan pilih jenis layanan yang ingin Anda akses</p>
            </div>

            <!-- Body / Pilihan Akses -->
            <div class="space-y-3">
              <!-- Opsi 1: Web Sekolah (Internal) -->
              <NuxtLink
                to="/login"
                @click="closeLoginModal"
                class="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 hover:border-blue-600 hover:bg-blue-50/50 transition-all group"
              >
                <div class="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m0 0v-5a2 2 0 012-2h2a2 2 0 012 2v5" />
                  </svg>
                </div>
                <div class="flex-grow">
                  <div class="text-sm font-bold text-slate-800 group-hover:text-blue-900 flex items-center justify-between">
                    <span>Web Sekolah</span>
                    <span class="text-[10px] bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">Internal</span>
                  </div>
                  <p class="text-xs text-slate-500 mt-0.5">Guru, Admin, & Kelola Konten</p>
                </div>
              </NuxtLink>

              <!-- Opsi 2: Presensi Presentia (Eksternal) -->
              <a
                href="https://sdywkabdg.presentia.id/"
                target="_blank"
                rel="noopener noreferrer"
                @click="closeLoginModal"
                class="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 hover:border-emerald-600 hover:bg-emerald-50/50 transition-all group"
              >
                <div class="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div class="flex-grow">
                  <div class="text-sm font-bold text-slate-800 group-hover:text-emerald-900 flex items-center justify-between">
                    <span class="flex items-center gap-1">
                      Presensi (Presentia)
                      <svg class="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </span>
                    <span class="text-[10px] bg-emerald-100 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">Umum</span>
                  </div>
                  <p class="text-xs text-slate-500 mt-0.5">Absensi Harian Siswa, Guru, & Staf</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- FOOTER RESPONSIF DAN PROFESIONAL -->
    <footer class="bg-slate-900 text-slate-300 pt-12 md:pt-16 pb-12 border-t border-slate-800 relative overflow-hidden">
      <div
        class="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]">
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

          <!-- Kolom 1: Profil Singkat & Tombol Icon Media Sosial -->
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <div class="flex-shrink-0 flex items-center">
                <NuxtLink to="/" class="text-2xl font-extrabold text-blue-800 tracking-tight flex items-center">
                  <img src="/logo-ywka.png" alt="Logo YWKA" class="h-8 md:h-10 w-auto" />
                </NuxtLink>
              </div>
              <span class="text-amber-400 font-extrabold text-base tracking-wide leading-tight">
                SD YWKA REL HOMY
                <span class="block text-gray-300 font-extrabold text-sm tracking-wide">
                  SCHOOL BANDUNG
                </span>
              </span>
            </div>
            <p class="text-xs text-slate-400 leading-relaxed">
              Mewujudkan Pendidikan Holistik yang Religius, Inovatif, Ramah Anak, dan Berkarakter Unggul dengan konsep
              <strong class="text-amber-400">REL HOMY SCHOOL</strong>.
            </p>

            <!-- TAMPILAN ICON SOSIAL MEDIA DI FOOTER -->
            <div class="pt-2">
              <span class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Media Sosial Resmi</span>
              <div class="flex items-center gap-2.5">
                <!-- Instagram -->
                <a
                  href="https://www.instagram.com/sdywkaofficial?igsh=N254MWZxNmNsdTY2"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram SD YWKA Official"
                  class="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/80 text-slate-300 flex items-center justify-center transition-all duration-300 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 hover:text-white hover:border-transparent hover:scale-110 hover:shadow-lg hover:shadow-rose-500/20 group"
                  title="Instagram SD YWKA Official"
                >
                  <svg class="w-5 h-5 fill-current transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                <!-- TikTok -->
                <a
                  href="https://www.tiktok.com/@sdywkabandung?_r=1&_t=ZS-98DMVsngf6z"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok SD YWKA Bandung"
                  class="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/80 text-slate-300 flex items-center justify-center transition-all duration-300 hover:bg-black hover:text-white hover:border-slate-600 hover:scale-110 hover:shadow-lg hover:shadow-slate-900/40 group"
                  title="TikTok SD YWKA Bandung"
                >
                  <svg class="w-5 h-5 fill-current transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.29-2.52.73-5.06 2.66-6.68 1.3-1.1 2.98-1.69 4.69-1.65.17 0 .34.01.51.03v4.07c-.45-.09-.92-.1-1.37-.02-.87.14-1.68.64-2.17 1.38-.61.88-.73 2.05-.33 3.03.38.98 1.28 1.69 2.32 1.83 1.05.15 2.12-.22 2.81-1.03.62-.71.93-1.65.91-2.59.02-4.14.01-8.28.02-12.42z"/>
                  </svg>
                </a>

                <!-- YouTube -->
                <a
                  href="https://youtube.com/@sdywkabandung?si=wC0LLoQbd1swADAH"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube SD YWKA Bandung"
                  class="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/80 text-slate-300 flex items-center justify-center transition-all duration-300 hover:bg-red-600 hover:text-white hover:border-transparent hover:scale-110 hover:shadow-lg hover:shadow-red-600/30 group"
                  title="YouTube SD YWKA Bandung"
                >
                  <svg class="w-5 h-5 fill-current transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>

                <!-- WhatsApp Direct Link -->
                <a
                  :href="whatsappUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp Official SD YWKA"
                  class="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/80 text-slate-300 flex items-center justify-center transition-all duration-300 hover:bg-emerald-600 hover:text-white hover:border-transparent hover:scale-110 hover:shadow-lg hover:shadow-emerald-600/30 group"
                  title="WhatsApp Official SD YWKA"
                >
                  <svg class="w-5 h-5 fill-current transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <!-- Kolom 2: Navigasi Cepat -->
          <div>
            <h4 class="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Tautan Cepat</h4>
            <ul class="space-y-2 text-xs font-medium">
              <li>
                <NuxtLink to="/profil" class="hover:text-amber-400 transition-colors">Profil Sekolah</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/guru" class="hover:text-amber-400 transition-colors">Tenaga Pendidik</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/berita" class="hover:text-amber-400 transition-colors">Berita & Informasi</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/agenda" class="hover:text-amber-400 transition-colors">Agenda & Kegiatan</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/galeri" class="hover:text-amber-400 transition-colors">Galeri Dokumentasi</NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Kolom 3: Kontak & Alamat -->
          <div>
            <h4 class="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Kontak Kami</h4>
            <ul class="space-y-2.5 text-xs text-slate-400 leading-relaxed">
              <li class="flex items-start gap-2.5">
                <span class="text-amber-400">📍</span>
                <span>Jl. Rajawali I No. 5, Kel. Dunguscariang, Kec. Andir, Kota Bandung - 40184</span>
              </li>
              <li class="flex items-center gap-2.5">
                <span class="text-amber-400">📞</span>
                <span>(022) 6011234</span>
              </li>
              <li class="flex items-center gap-2.5">
                <svg class="w-4 h-4 text-emerald-400 flex-shrink-0 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <a :href="whatsappUrl" target="_blank" rel="noopener noreferrer" class="hover:text-emerald-400 transition-colors font-medium">
                  +62 895-3440-44455
                </a>
              </li>
              <li class="flex items-center gap-2.5">
                <span class="text-amber-400">✉️</span>
                <span>sdywkabandung@gmail.com</span>
              </li>
            </ul>
          </div>

          <!-- Kolom 4: Jam Operasional -->
          <div>
            <h4 class="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Jam Sekolah</h4>
            <ul class="space-y-2 text-xs text-slate-400">
              <li class="flex justify-between">
                <span>Senin - Kamis:</span>
                <span class="text-amber-400 font-semibold">07.00 - 14.00 WIB</span>
              </li>
              <li class="flex justify-between">
                <span>Jumat:</span>
                <span class="text-amber-400 font-semibold">07.00 - 11.30 WIB</span>
              </li>
              <li class="flex justify-between">
                <span>Sabtu & Minggu:</span>
                <span class="text-slate-500">Libur</span>
              </li>
            </ul>
          </div>

        </div>

        <!-- Copyright -->
        <div class="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 sm:pr-20">
          <p>&copy; 2026 SD YWKA REL HOMY SCHOOL Bandung. All rights reserved.</p>
        </div>
      </div>
    </footer>

    <!-- FLOATING ACTIONS (POJOK KANAN BAWAH) -->
    
    <!-- 1. FLOATING BACK TO TOP BUTTON (DI ATAS WA) -->
    <transition name="fade">
      <button
        v-if="showScrollTop"
        @click="scrollToTop"
        aria-label="Kembali ke Atas"
        class="fixed bottom-24 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-slate-900/90 backdrop-blur border border-slate-700/80 text-amber-400 shadow-2xl hover:bg-slate-800 hover:text-amber-300 hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none group"
        title="Kembali ke Atas"
      >
        <svg class="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </transition>

    <!-- 2. FLOATING WHATSAPP BUTTON -->
    <div class="fixed bottom-6 right-6 z-50 flex items-center group">
      <!-- Tooltip Label Saat Hover -->
      <a
        :href="whatsappUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="mr-3 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-xl border border-slate-800 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 hidden sm:flex items-center gap-2 pointer-events-none group-hover:pointer-events-auto"
      >
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>Chat CS WhatsApp SD YWKA</span>
      </a>

      <!-- Tombol Utama WA -->
      <a
        :href="whatsappUrl"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hubungi SD YWKA via WhatsApp"
        class="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-green-400 text-white shadow-2xl shadow-emerald-600/50 hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none"
      >
        <!-- Efek Pendar Pulse -->
        <span class="absolute -inset-1 rounded-full bg-emerald-500 opacity-75 animate-ping pointer-events-none"></span>

        <!-- Icon WhatsApp SVG -->
        <svg class="w-7 h-7 fill-current relative z-10" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      </a>
    </div>

  </div>
</template>

<style scoped>
/* Animasi Fade In / Out untuk Tombol Floating Back to Top */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.9);
}

/* Animasi Transisi Modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: all 0.25s ease-out;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}

/* Animasi Slide Down (Mobile Navigation) */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.25s ease-out;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>