<!-- FILE: layouts/default.vue -->
<script setup>
import { ref, computed } from 'vue'

const isMobileMenuOpen = ref(false)
const isLoginModalOpen = ref(false)

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

const scrollToTop = () => {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

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
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
    <!-- Navbar Header Responsif -->
    <header class="bg-white shadow-sm border-b border-slate-200/80 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center h-16">

        <!-- KIRI: Logo YWKA -->
        <div class="flex-shrink-0 flex items-center">
          <NuxtLink to="/" class="text-2xl font-extrabold text-blue-800 tracking-tight flex items-center">
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

    <!-- FOOTER RESPONSIF -->
    <footer class="bg-slate-900 text-slate-300 pt-12 md:pt-16 pb-8 border-t border-slate-800 relative overflow-hidden">
      <div
        class="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]">
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

          <!-- Kolom 1: Profil Singkat -->
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <div class="flex-shrink-0 flex items-center">
                <NuxtLink to="/" class="text-2xl font-extrabold text-blue-800 tracking-tight flex items-center">
                  <img src="/logo-ywka.png" alt="Logo YWKA" class="h-8 md:h-10 w-auto" />
                </NuxtLink>
              </div>
              <span class=" text-amber-400 font-extrabold text-base tracking-wide">
                SD YWKA REL HOMY
                <span class=" text-gray-300 font-extrabold text-base tracking-wide">
                  SCHOOL BANDUNG
                </span>
              </span>
            </div>
            <p class="text-xs text-slate-400 leading-relaxed">
              Mewujudkan Pendidikan Holistik yang Religius, Inovatif, Ramah Anak, dan Berkarakter Unggul dengan konsep
              <strong class="text-amber-400">REL HOMY SCHOOL</strong>.
            </p>
          </div>

          <!-- Kolom 2: Navigasi Cepat -->
          <div>
            <h4 class="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Tautan
              Cepat</h4>
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
            <h4 class="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Kontak
              Kami</h4>
            <ul class="space-y-2 text-xs text-slate-400 leading-relaxed">
              <li class="flex items-start gap-2">
                <span>📍</span>
                <span>Jl. Rajawali I No. 5, Kel. Dunguscariang, Kec. Andir, Kota Bandung - 40184</span>
              </li>
              <li class="flex items-center gap-2">
                <span>📞</span>
                <span>(022) 6011234 / +62 895-3440-44455</span>
              </li>
              <li class="flex items-center gap-2">
                <span>✉️</span>
                <span>sdywkabandung@gmail.com</span>
              </li>
            </ul>
          </div>

          <!-- Kolom 4: Jam Operasional -->
          <div>
            <h4 class="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Jam
              Sekolah</h4>
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

        <!-- Copyright & Back to Top -->
        <div
          class="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; 2026 SD YWKA REL HOMY SCHOOL Bandung. All rights reserved.</p>
          <button @click="scrollToTop"
            class="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold transition-colors">
            Kembali ke Atas &uarr;
          </button>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
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