<template>
  <div>
    <!-- Welcome Banner Section -->
    <div
      class="mb-8 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div class="relative z-10">
        <span
          class="text-xs font-semibold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
          Dashboard Overview
        </span>
        <h2 class="text-2xl lg:text-3xl font-extrabold mt-3 tracking-tight">Selamat Datang, Admin! 👋</h2>
        <p class="text-slate-300 text-sm mt-1 max-w-xl">
          Kelola informasi sekolah, publikasi berita, pengumuman penting, dan data SD YWKA dengan mudah dan cepat dari
          satu panel terpusat.
        </p>
      </div>
      <div class="relative z-10 flex gap-3">
        <NuxtLink to="/admin/berita"
          class="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-amber-500/20 flex items-center gap-2">
          <span>+ Tulis Berita</span>
        </NuxtLink>
      </div>
      <!-- Background decorative glow -->
      <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none">
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="text-center py-20 text-gray-500 font-medium">
      Memuat ringkasan sistem...
    </div>

    <!-- Content Statistics Cards -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      <!-- Card Berita -->
      <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition group">
        <div class="flex items-center justify-between mb-4">
          <div
            class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
            <NewspaperIcon class="w-6 h-6" />
          </div>
          <span class="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">Aktif</span>
        </div>
        <p class="text-sm font-medium text-gray-500">Total Berita</p>
        <h3 class="text-3xl font-extrabold text-gray-900 mt-1">{{ stats?.total_berita || 0 }}</h3>
      </div>

      <!-- Card Pengumuman -->
      <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition group">
        <div class="flex items-center justify-between mb-4">
          <div
            class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
            <MegaphoneIcon class="w-6 h-6" />
          </div>
          <span class="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">Publikasi</span>
        </div>
        <p class="text-sm font-medium text-gray-500">Total Pengumuman</p>
        <h3 class="text-3xl font-extrabold text-gray-900 mt-1">{{ stats?.total_pengumuman || 0 }}</h3>
      </div>

      <!-- Card Guru & SDM -->
      <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition group">
        <div class="flex items-center justify-between mb-4">
          <div
            class="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
            <UsersIcon class="w-6 h-6" />
          </div>
          <span class="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">Pegawai</span>
        </div>
        <p class="text-sm font-medium text-gray-500">Total Guru & Staf</p>
        <h3 class="text-3xl font-extrabold text-gray-900 mt-1">{{ stats?.total_guru || 0 }}</h3>
      </div>

      <!-- Card Galeri -->
      <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition group">
        <div class="flex items-center justify-between mb-4">
          <div
            class="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
            <PhotoIcon class="w-6 h-6" />
          </div>
          <span class="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">Dokumentasi</span>
        </div>
        <p class="text-sm font-medium text-gray-500">Total Album Galeri</p>
        <!-- Perbaikan: Dukungan lengkap fallback multi-key response Django -->
        <h3 class="text-3xl font-extrabold text-gray-900 mt-1">
          {{ stats?.total_galeri ?? stats?.total_album ?? stats?.total_album_galeri ?? stats?.total_galeri_album ??
            stats?.total_album_foto ?? stats?.total_albums ?? stats?.data?.total_galeri ?? 0 }}
        </h3>
      </div>
    </div>

    <!-- Quick Shortcuts & Recent Info Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Berita List -->
      <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-bold text-gray-800 text-lg">Berita Terbaru</h3>
          <NuxtLink to="/admin/berita" class="text-xs font-semibold text-amber-600 hover:text-amber-700">Lihat Semua →
          </NuxtLink>
        </div>

        <div v-if="stats?.recent_berita && stats.recent_berita.length > 0" class="space-y-4">
          <div v-for="item in stats.recent_berita" :key="item.id"
            class="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-gray-400 text-xs">
                <img v-if="item.gambar" :src="item.gambar" class="w-full h-full object-cover" />
                <span v-else>YW</span>
              </div>
              <div>
                <h4 class="text-sm font-bold text-gray-800 line-clamp-1">{{ item.judul }}</h4>
                <p class="text-xs text-gray-500">{{ item.kategori }} • {{ new
                  Date(item.tanggal_upload).toLocaleDateString('id-ID') }}</p>
              </div>
            </div>
            <span v-if="item.is_featured"
              class="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">Headline</span>
          </div>
        </div>
        <div v-else class="text-center py-10 text-gray-400 text-sm">
          Belum ada data berita.
        </div>
      </div>

      <!-- Quick Shortcuts Card -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
        <div>
          <h3 class="font-bold text-gray-800 text-lg mb-4">Akses Cepat</h3>
          <div class="space-y-2.5">
            <NuxtLink to="/admin/berita"
              class="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-amber-50 hover:text-amber-900 transition text-sm font-medium text-gray-700">
              <span>+ Kelola Berita Sekolah</span>
              <span>›</span>
            </NuxtLink>
            <NuxtLink to="/admin/pengumuman"
              class="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-amber-50 hover:text-amber-900 transition text-sm font-medium text-gray-700">
              <span>+ Buat Pengumuman Baru</span>
              <span>›</span>
            </NuxtLink>
            <NuxtLink to="/admin/guru"
              class="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-amber-50 hover:text-amber-900 transition text-sm font-medium text-gray-700">
              <span>+ Tambah Data Guru / Staf</span>
              <span>›</span>
            </NuxtLink>
            <NuxtLink to="/admin/galeri"
              class="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-amber-50 hover:text-amber-900 transition text-sm font-medium text-gray-700">
              <span>+ Unggah Foto Dokumentasi</span>
              <span>›</span>
            </NuxtLink>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-gray-100 text-center">
          <p class="text-xs text-gray-400">SD YWKA Bandung • Versi 1.0.0</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { NewspaperIcon, MegaphoneIcon, UsersIcon, PhotoIcon } from '@heroicons/vue/24/outline'

definePageMeta({ layout: 'admin' })

// Ambil runtime configuration dari nuxt.config.ts / .env
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase

// 1. Ambil token dari cookie auth_token yang diset saat login
const token = useCookie('auth_token')

const API_URL = `${API_BASE}/api/admin-api/dashboard-stats/`

// 2. Sertakan token ke dalam request header Authorization dengan pembungkus computed
const { data: stats, pending, refresh } = await useFetch(API_URL, {
  watch: false,
  lazy: true,
  headers: computed(() => ({
    Authorization: token.value ? `Bearer ${token.value}` : ''
  })),
  default: () => ({
    total_berita: 0,
    total_pengumuman: 0,
    total_guru: 0,
    total_galeri: 0,
    total_album: 0,
    recent_berita: []
  })
})

// Memastikan data statistik ter-refresh secara real-time saat halaman dimuat
onMounted(() => {
  refresh()
})
</script>