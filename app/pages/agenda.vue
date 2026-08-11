<!-- FILE: pages/agenda.vue -->
<script setup>
import { ref, computed } from 'vue'

// Alias rute agar rute /agenda maupun /events keduanya berfungsi dengan baik
definePageMeta({
  alias: '/agenda'
})

// Ambil runtime configuration dari nuxt.config.ts / .env
const config = useRuntimeConfig()
const BACKEND_URL = config.public.apiBase

// ----------------------------------------------------------------
// STATE & FILTER LOGIC
// ----------------------------------------------------------------

// State Filter & Search
const searchQuery = ref('')
const selectedCategory = ref('Semua')
const selectedStatus = ref('Semua')

// Kategori Agenda (Sesuai dengan KATEGORI_CHOICES pada Model Event Backend)
const kategoriList = [
  'Semua',
  'Akademik',
  'Keagamaan',
  'Seni & Olahraga',
  'Peringatan Hari Besar',
  'Rapat & Pertemuan',
  'Lainnya'
]

// Status List (Sesuai dengan STATUS_CHOICES pada Model Event Backend)
const statusList = [
  'Semua',
  'Akan Datang',
  'Berlangsung',
  'Selesai',
  'Dibatalkan'
]

// Modal State
const isModalOpen = ref(false)
const selectedEvent = ref(null)

// Fetch Data Agenda/Event dari API Django REST Framework menggunakan baseURL dinamis
const { data: rawEvents, pending: loading } = await useFetch('/api/event/', {
  baseURL: BACKEND_URL,
  query: computed(() => ({
    kategori: selectedCategory.value !== 'Semua' ? selectedCategory.value : undefined,
    status: selectedStatus.value !== 'Semua' ? selectedStatus.value : undefined,
    search: searchQuery.value ? searchQuery.value : undefined
  })),
  watch: [selectedCategory, selectedStatus, searchQuery]
})

// Fallback Data jika API Backend belum terisi / offline
const defaultEvents = [
  {
    id: '1',
    judul: 'Pelaksanaan Penilaian Tengah Semester (PTS) Ganjil',
    kategori: 'Akademik',
    status: 'Akan Datang',
    tanggal_mulai: '2026-09-14',
    tanggal_selesai: '2026-09-19',
    waktu: '07:30 - 12:00 WIB',
    lokasi: 'Ruang Kelas SD YWKA Bandung',
    penyelenggara: 'Tim Kurikulum SD YWKA',
    ringkasan: 'Kegiatan evaluasi pembelajaran pertengahan semester ganjil.',
    deskripsi: 'Kegiatan evaluasi pembelajaran pertengahan semester untuk mengukur capaian kompetensi peserta didik pada semester ganjil. Diharapkan seluruh siswa hadir tepat waktu.',
    poster: null,
    link_pendaftaran: null,
    is_featured: true
  },
  {
    id: '2',
    judul: 'Kajian Rutin & Mabit Siswa Kelas 5 & 6 (Tahsin & Tahfidz)',
    kategori: 'Keagamaan',
    status: 'Akan Datang',
    tanggal_mulai: '2026-08-21',
    tanggal_selesai: '2026-08-22',
    waktu: '16:00 - 07:00 WIB',
    lokasi: 'Musholla & Aula SD YWKA',
    penyelenggara: 'Tim Imtaq & Keagamaan YWKA',
    ringkasan: 'Pembiasaan ibadah malam dan murajaah hafalan Al-Qur\'an.',
    deskripsi: 'Pembiasaan ibadah malam, murajaah hafalan Juz 30 & 29, serta penguatan karakter akhlakul karimah bagi siswa kelas tinggi.',
    poster: null,
    link_pendaftaran: null,
    is_featured: false
  },
  {
    id: '3',
    judul: 'Lomba Peringatan HUT RI & Class Meeting YWKA',
    kategori: 'Peringatan Hari Besar',
    status: 'Selesai',
    tanggal_mulai: '2026-08-18',
    tanggal_selesai: '2026-08-19',
    waktu: '08:00 - 13:00 WIB',
    lokasi: 'Lapangan Olahraga SD YWKA',
    penyelenggara: 'Panitia Kesiswaan',
    ringkasan: 'Rangkaian lomba ketangkasan, seni, dan kekompakan antar kelas.',
    deskripsi: 'Rangkaian lomba ketangkasan, seni, dan kekompakan dalam rangka memeriahkan peringatan Kemerdekaan Republik Indonesia.',
    poster: null,
    link_pendaftaran: null,
    is_featured: false
  }
]

// Priority Data: Gunakan data API jika tidak null/undefined, jika error/null gunakan defaultEvents
const listEvents = computed(() => {
  if (rawEvents.value && Array.isArray(rawEvents.value)) {
    return rawEvents.value
  }
  return defaultEvents
})

// Helper URL Poster (Dengan penanganan aman garis miring /)
const getPosterUrl = (posterPath) => {
  if (!posterPath) return null
  if (posterPath.startsWith('http://') || posterPath.startsWith('https://')) {
    return posterPath
  }
  const cleanPath = posterPath.startsWith('/') ? posterPath : `/${posterPath}`
  const cleanBase = BACKEND_URL.endsWith('/') ? BACKEND_URL.slice(0, -1) : BACKEND_URL
  return `${cleanBase}${cleanPath}`
}

// Helper Format Tanggal & Waktu
const formatTanggalIndo = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const formatTanggalRange = (startStr, endStr) => {
  if (!startStr) return ''
  if (!endStr || startStr === endStr) {
    return formatTanggalIndo(startStr)
  }
  const start = new Date(startStr)
  const end = new Date(endStr)
  
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${start.getDate()} - ${end.getDate()} ${end.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`
  }
  return `${start.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`
}

const getDayName = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('id-ID', { weekday: 'long' })
}

const getDayNumber = (dateStr) => {
  if (!dateStr) return '01'
  const d = new Date(dateStr)
  return d.getDate().toString().padStart(2, '0')
}

const getMonthYear = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
}

// Style Badge Berdasarkan Status
const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Akan Datang':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'Berlangsung':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'Selesai':
      return 'bg-slate-100 text-slate-500 border-slate-200'
    case 'Dibatalkan':
      return 'bg-rose-50 text-rose-700 border-rose-200'
    default:
      return 'bg-slate-100 text-slate-600 border-slate-200'
  }
}

// Computed Filtered List untuk penanganan pencarian/filter lokal
const filteredEvents = computed(() => {
  return listEvents.value.filter(item => {
    const matchCat = selectedCategory.value === 'Semua' || item.kategori === selectedCategory.value
    const matchStatus = selectedStatus.value === 'Semua' || item.status === selectedStatus.value
    
    const query = searchQuery.value.toLowerCase().trim()
    const matchSearch = !query || 
      (item.judul && item.judul.toLowerCase().includes(query)) ||
      (item.ringkasan && item.ringkasan.toLowerCase().includes(query)) ||
      (item.deskripsi && item.deskripsi.toLowerCase().includes(query)) ||
      (item.lokasi && item.lokasi.toLowerCase().includes(query))

    return matchCat && matchStatus && matchSearch
  })
})

// Modal Actions
const openDetail = (event) => {
  selectedEvent.value = event
  isModalOpen.value = true
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden'
  }
}

const closeModal = () => {
  isModalOpen.value = false
  setTimeout(() => { selectedEvent.value = null }, 200)
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'auto'
  }
}

// ----------------------------------------------------------------
// SEO OPTIMIZATION LOGIC
// ----------------------------------------------------------------

const pageTitle = 'Agenda & Kegiatan Sekolah - SD YWKA REL HOMY SCHOOL Bandung'
const pageDescription = 'Jadwal agenda acara, kegiatan akademik, keagamaan, perlombaan, dan kalender kegiatan terbaru SD YWKA Bandung.'
const canonicalUrl = 'https://sdywkabandung.sch.id/agenda'

// Dynamic Meta Tags (Open Graph, Twitter)
useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogType: 'website',
  ogUrl: canonicalUrl,
  ogSiteName: 'SD YWKA Bandung',
  twitterCard: 'summary_large_image',
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
})

// Canonical Link & Schema.org JSON-LD Structured Data
useHead({
  link: [
    { rel: 'canonical', href: canonicalUrl }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: computed(() => {
        const eventsList = filteredEvents.value.map((event) => {
          return {
            '@type': 'Event',
            'name': event.judul,
            'description': event.ringkasan || event.deskripsi,
            'startDate': event.tanggal_mulai,
            'endDate': event.tanggal_selesai || event.tanggal_mulai,
            'eventStatus': event.status === 'Dibatalkan' 
              ? 'https://schema.org/EventCancelled' 
              : 'https://schema.org/EventScheduled',
            'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode',
            'location': {
              '@type': 'Place',
              'name': event.lokasi || 'SD YWKA Bandung',
              'address': {
                '@type': 'PostalAddress',
                'streetAddress': 'Jl. Stasiun Barat No. 1',
                'addressLocality': 'Bandung',
                'addressRegion': 'Jawa Barat',
                'addressCountry': 'ID'
              }
            },
            'organizer': {
              '@type': 'EducationalOrganization',
              'name': event.penyelenggara || 'SD YWKA Bandung',
              'url': 'https://sdywkabandung.sch.id'
            },
            'image': getPosterUrl(event.poster) || 'https://sdywkabandung.sch.id/logo.png'
          }
        })

        return JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          'name': 'Agenda & Kegiatan SD YWKA Bandung',
          'itemListElement': eventsList.map((evt, idx) => ({
            '@type': 'ListItem',
            'position': idx + 1,
            'item': evt
          }))
        })
      })
    }
  ]
})
</script>

<template>
  <main class="bg-slate-50 min-h-screen text-slate-800 pb-20">
    
    <!-- 1. HERO HEADER SECTION -->
    <header class="bg-slate-900 text-white py-12 md:py-16 border-b border-slate-800 relative overflow-hidden">
      <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <span class="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-widest mb-3">
          📅 KALENDER & JADWAL
        </span>
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          AGENDA & <span class="text-amber-400">KEGIATAN</span>
        </h1>
        <p class="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mt-3 font-normal leading-relaxed">
          Pantau seluruh jadwal kegiatan akademik, keagamaan, lomba, serta acara penting peserta didik di <span class="font-medium text-slate-100">SD YWKA Bandung</span>.
        </p>
      </div>
    </header>

    <!-- 2. SEARCH & FILTER TOOLBAR -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-20" aria-label="Filter Agenda">
      <div class="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 space-y-4">
        
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          
          <!-- Status Switcher Tabs -->
          <div class="flex items-center bg-slate-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
            <button 
              v-for="st in statusList"
              :key="st"
              @click="selectedStatus = st"
              :class="[
                'px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap',
                selectedStatus === st ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              ]"
            >
              {{ st }}
            </button>
          </div>

          <!-- Search Bar Input -->
          <div class="relative w-full md:w-80">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Cari agenda atau lokasi..."
              aria-label="Cari agenda atau lokasi"
              class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
            />
            <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

        </div>

        <!-- Filter Category Chips -->
        <div class="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
          <span class="text-xs font-semibold text-slate-400 mr-2 uppercase tracking-wider">Kategori:</span>
          <button
            v-for="(kat, idx) in kategoriList"
            :key="idx"
            @click="selectedCategory = kat"
            :class="[
              'px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all',
              selectedCategory === kat 
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            ]"
          >
            {{ kat }}
          </button>
        </div>

      </div>
    </section>

    <!-- 3. MAIN AGENDA LIST SECTION -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8" aria-label="Daftar Agenda Kegiatan">
      
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-20 text-slate-500 font-semibold text-sm">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent mb-3"></div>
        <p>Memuat agenda kegiatan dari server...</p>
      </div>

      <!-- Content Grid -->
      <div v-else-if="filteredEvents.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <article 
          v-for="event in filteredEvents" 
          :key="event.id"
          @click="openDetail(event)"
          class="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
        >
          <div>
            <!-- Poster Header Preview (Jika Ada) -->
            <div v-if="event.poster" class="h-44 w-full overflow-hidden relative bg-slate-100">
              <img 
                :src="getPosterUrl(event.poster)" 
                :alt="event.judul" 
                loading="lazy"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span v-if="event.is_featured" class="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow uppercase tracking-wider">
                ⭐ Unggulan
              </span>
            </div>

            <div class="p-6">
              <!-- Top Header Badge & Date Block -->
              <div class="flex items-start justify-between gap-4 mb-4">
                
                <!-- Date Box Badge -->
                <div class="bg-slate-900 text-white px-3.5 py-2 rounded-xl text-center shadow-sm shrink-0 border border-slate-800">
                  <time :datetime="event.tanggal_mulai" class="block text-2xl font-black leading-none text-amber-400">{{ getDayNumber(event.tanggal_mulai) }}</time>
                  <span class="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mt-0.5">{{ getMonthYear(event.tanggal_mulai) }}</span>
                </div>

                <!-- Badges Category & Status -->
                <div class="flex flex-col items-end gap-1.5">
                  <span class="bg-slate-100 text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-md border border-slate-200">
                    {{ event.kategori }}
                  </span>
                  
                  <span 
                    :class="['text-[10px] font-extrabold px-2 py-0.5 rounded border flex items-center gap-1', getStatusBadgeClass(event.status)]"
                  >
                    <span v-if="event.status === 'Berlangsung' || event.status === 'Akan Datang'" class="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                    {{ event.status }}
                  </span>
                </div>

              </div>

              <!-- Title & Ringkasan -->
              <h2 class="font-bold text-slate-900 text-base group-hover:text-amber-600 transition-colors leading-snug mb-2">
                {{ event.judul }}
              </h2>

              <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                {{ event.ringkasan || event.deskripsi }}
              </p>

              <!-- Metadata List -->
              <div class="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span class="truncate">{{ formatTanggalRange(event.tanggal_mulai, event.tanggal_selesai) }}</span>
                </div>

                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="truncate">{{ event.waktu || '08:00 WIB - Selesai' }}</span>
                </div>

                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span class="truncate">{{ event.lokasi || 'SD YWKA Bandung' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer Link Action -->
          <div class="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900">
            <span>Detail Agenda</span>
            <span class="group-hover:translate-x-1 transition-transform text-amber-500">&rarr;</span>
          </div>

        </article>

      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-sm my-6">
        <div class="text-4xl mb-3">📅</div>
        <h3 class="font-bold text-slate-800 text-lg">Agenda tidak ditemukan</h3>
        <p class="text-xs text-slate-500 mt-1">Coba sesuaikan kata kunci, status, atau kategori filter yang Anda pilih.</p>
        <button 
          @click="searchQuery = ''; selectedCategory = 'Semua'; selectedStatus = 'Semua'" 
          class="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
        >
          Reset Filter
        </button>
      </div>

    </section>

    <!-- 4. MODAL DETAIL AGENDA -->
    <Teleport to="body">
      <div v-if="isModalOpen && selectedEvent" class="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
        <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" @click="closeModal"></div>

        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all flex flex-col max-h-[90vh] z-10 border border-slate-200">
          
          <button @click="closeModal" aria-label="Tutup Modal" class="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-slate-900/50 hover:bg-slate-900 text-white rounded-full transition-colors backdrop-blur-md">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Modal Header dengan Gambar Poster jika ada -->
          <div v-if="selectedEvent.poster" class="h-48 w-full relative bg-slate-900 overflow-hidden">
            <img :src="getPosterUrl(selectedEvent.poster)" :alt="selectedEvent.judul" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
            <div class="absolute bottom-4 left-6 right-6">
              <span class="inline-block bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider mb-1">
                {{ selectedEvent.kategori }}
              </span>
              <h2 class="text-lg font-extrabold text-white leading-snug drop-shadow-sm">
                {{ selectedEvent.judul }}
              </h2>
            </div>
          </div>

          <div v-else class="bg-slate-900 text-white p-6 sm:p-8 relative">
            <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px]"></div>
            <div class="relative z-10">
              <span class="inline-block bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider mb-2">
                {{ selectedEvent.kategori }}
              </span>
              <h2 class="text-xl sm:text-2xl font-extrabold text-white leading-snug">
                {{ selectedEvent.judul }}
              </h2>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="p-6 sm:p-8 overflow-y-auto space-y-5 text-xs sm:text-sm">
            
            <!-- Detail Metadata Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <div>
                <span class="text-slate-400 font-semibold block text-[11px] uppercase">Tanggal & Hari</span>
                <p class="font-bold text-slate-800 mt-0.5">
                  {{ formatTanggalRange(selectedEvent.tanggal_mulai, selectedEvent.tanggal_selesai) }}
                </p>
                <p class="text-slate-500 text-xs">{{ getDayName(selectedEvent.tanggal_mulai) }}</p>
              </div>

              <div>
                <span class="text-slate-400 font-semibold block text-[11px] uppercase">Waktu</span>
                <p class="font-bold text-slate-800 mt-0.5">
                  {{ selectedEvent.waktu || '08:00 WIB - Selesai' }}
                </p>
              </div>

              <div>
                <span class="text-slate-400 font-semibold block text-[11px] uppercase">Lokasi Acara</span>
                <p class="font-bold text-slate-800 mt-0.5">
                  {{ selectedEvent.lokasi || 'SD YWKA Bandung' }}
                </p>
              </div>

              <div>
                <span class="text-slate-400 font-semibold block text-[11px] uppercase">Penyelenggara</span>
                <p class="font-semibold text-slate-800 mt-0.5">{{ selectedEvent.penyelenggara || 'SD YWKA Bandung' }}</p>
              </div>
            </div>

            <!-- Deskripsi Detail -->
            <div>
              <h3 class="font-bold text-slate-900 text-sm mb-2 border-b border-slate-100 pb-1">Deskripsi & Rincian Kegiatan</h3>
              <p class="text-slate-600 leading-relaxed whitespace-pre-line text-xs sm:text-sm">
                {{ selectedEvent.deskripsi }}
              </p>
            </div>

            <!-- Link Pendaftaran jika tersedia -->
            <div v-if="selectedEvent.link_pendaftaran" class="pt-2">
              <a 
                :href="selectedEvent.link_pendaftaran" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs transition-colors shadow-sm"
              >
                <span>Formulir Pendaftaran / Pendaftaran Online</span>
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

          </div>

          <!-- Modal Footer -->
          <div class="bg-slate-50 p-4 border-t border-slate-100 text-right">
            <button @click="closeModal" class="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors">
              Tutup Modal
            </button>
          </div>

        </div>
      </div>
    </Teleport>

  </main>
</template>