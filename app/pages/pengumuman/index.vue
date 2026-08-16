<script setup>
import { ref, computed } from 'vue'

// Base URL & Request URL Nuxt
const config = useRuntimeConfig()
const BACKEND_URL = config.public.apiBase
const url = useRequestURL()

// --- OPTIMASI SEO & META TAGS ---
const seoTitle = 'Pengumuman Resmi - SD YWKA REL HOMY SCHOOL Bandung'
const seoDescription = 'Pusat informasi resmi, surat edaran kedinasan, instruksi sekolah, dan agenda kegiatan penting SD YWKA REL HOMY SCHOOL Bandung.'
const seoImage = `${url.origin}/default-og-image.jpg`
const canonicalUrl = `${url.origin}/pengumuman`

useSeoMeta({
  title: seoTitle,
  ogTitle: seoTitle,
  description: seoDescription,
  ogDescription: seoDescription,
  ogImage: seoImage,
  ogUrl: canonicalUrl,
  ogType: 'website',
  ogSiteName: 'SD YWKA REL HOMY SCHOOL',
  twitterCard: 'summary_large_image',
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
  twitterImage: seoImage,
})

// Mengambil data dari REST API Django Backend
const { data: daftarPengumuman, pending: loading, error } = await useFetch(`${BACKEND_URL}/api/pengumuman/`)

// State Filter & Search
const searchQuery = ref('')
const selectedCategory = ref('Semua')
const selectedPriority = ref('Semua')

// State Pagination
const currentPage = ref(1)
const itemsPerPage = ref(6)

// State Modal Quick View
const activeModalData = ref(null)

// Daftar Kategori
const kategoriList = ref(['Semua', 'Surat Edaran', 'Akademik & Ujian', 'Kegiatan', 'Keuangan'])

// Computed Filtering
const filteredPengumuman = computed(() => {
  if (!daftarPengumuman.value) return []
  return daftarPengumuman.value.filter(item => {
    const matchCat = selectedCategory.value === 'Semua' || item.kategori === selectedCategory.value
    const matchPrio = selectedPriority.value === 'Semua' || item.prioritas === selectedPriority.value
    
    const query = searchQuery.value.toLowerCase().trim()
    const matchSearch = !query || 
      item.judul.toLowerCase().includes(query) || 
      (item.ringkasan && item.ringkasan.toLowerCase().includes(query)) ||
      (item.target && item.target.toLowerCase().includes(query))

    return matchCat && matchPrio && matchSearch
  })
})

// Computed Pagination
const totalPages = computed(() => {
  return Math.ceil(filteredPengumuman.value.length / itemsPerPage.value) || 1
})

const paginatedPengumuman = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredPengumuman.value.slice(start, end)
})

// DYNAMIC STRUCTURED DATA (BreadcrumbList + CollectionPage ItemList)
const schemaJsonLd = computed(() => {
  const itemsList = (filteredPengumuman.value || []).map((item, index) => ({
    '@type': 'ListItem',
    'position': index + 1,
    'url': `${url.origin}/pengumuman/${item.id}`,
    'name': item.judul
  }))

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Beranda',
          'item': url.origin
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'Pengumuman Resmi',
          'item': canonicalUrl
        }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': seoTitle,
      'description': seoDescription,
      'url': canonicalUrl,
      'publisher': {
        '@type': 'EducationalOrganization',
        'name': 'SD YWKA REL HOMY SCHOOL',
        'logo': `${url.origin}/favicon.ico`
      },
      'mainEntity': {
        '@type': 'ItemList',
        'itemListElement': itemsList
      }
    }
  ]
})

useHead({
  link: [
    { rel: 'canonical', href: canonicalUrl }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: computed(() => JSON.stringify(schemaJsonLd.value))
    }
  ]
})

const formatTanggal = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const formatTanggalISO = (dateStr) => {
  if (!dateStr) return new Date().toISOString()
  return new Date(dateStr).toISOString()
}

const resetPage = () => {
  currentPage.value = 1
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 300, behavior: 'smooth' })
    }
  }
}

const openQuickView = (item) => {
  activeModalData.value = item
}

const closeModal = () => {
  activeModalData.value = null
}
</script>

<template>
  <div class="bg-slate-50 min-h-screen text-slate-800 pb-20">
    
    <!-- 1. HERO HEADER SECTION -->
    <header class="bg-slate-900 text-white py-12 md:py-16 border-b border-slate-800 relative overflow-hidden">
      <div class="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <span class="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-widest mb-3">
          📢 PUSAT INFORMASI RESMI
        </span>
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          PENGUMUMAN <span class="text-amber-400">SEKOLAH</span>
        </h1>
        <p class="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mt-3 font-normal leading-relaxed">
          Informasi kedinasan, edaran resmi, dan instruksi kegiatan terbaru bagi wali murid dan peserta didik <span class="font-medium text-slate-100">SD YWKA REL HOMY SCHOOL</span>.
        </p>
      </div>
    </header>

    <!-- 2. SEARCH & FILTER TOOLBAR -->
    <section aria-label="Filter dan Pencarian Pengumuman" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-20">
      <div class="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 space-y-4">
        
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <!-- Live Search Bar -->
          <div class="relative w-full md:w-80">
            <input 
              v-model="searchQuery"
              @input="resetPage"
              type="text" 
              aria-label="Cari kata kunci pengumuman"
              placeholder="Cari pengumuman atau edaran..."
              class="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
            />
            <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <button v-if="searchQuery" @click="searchQuery = ''; resetPage()" aria-label="Hapus Pencarian" class="absolute right-3 top-3 text-slate-400 hover:text-slate-600 text-xs font-bold">
              ✕
            </button>
          </div>

          <!-- Priority Filter Buttons -->
          <nav aria-label="Filter Prioritas Pengumuman" class="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">Status:</span>
            <button 
              @click="selectedPriority = 'Semua'; resetPage()"
              :class="['px-3 py-1.5 rounded-xl text-xs font-semibold transition-all', selectedPriority === 'Semua' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900']"
            >
              Semua
            </button>
            <button 
              @click="selectedPriority = 'Mendesak'; resetPage()"
              :class="['px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5', selectedPriority === 'Mendesak' ? 'bg-red-600 text-white shadow-sm' : 'bg-red-50 text-red-700 border border-red-200/60 hover:bg-red-100']"
            >
              <span class="w-2 h-2 rounded-full bg-red-500"></span> Mendesak
            </button>
            <button 
              @click="selectedPriority = 'Penting'; resetPage()"
              :class="['px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5', selectedPriority === 'Penting' ? 'bg-amber-500 text-slate-900 shadow-sm font-bold' : 'bg-amber-50 text-amber-800 border border-amber-200/60 hover:bg-amber-100']"
            >
              <span class="w-2 h-2 rounded-full bg-amber-500"></span> Penting
            </button>
          </nav>
        </div>

        <!-- Category Filter Chips -->
        <nav aria-label="Filter Kategori Pengumuman" class="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
          <span class="text-xs font-semibold text-slate-400 mr-2 uppercase tracking-wider">Kategori:</span>
          <button
            v-for="(kat, idx) in kategoriList"
            :key="idx"
            @click="selectedCategory = kat; resetPage()"
            :class="[
              'px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all',
              selectedCategory === kat 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            ]"
          >
            {{ kat }}
          </button>
        </nav>

      </div>
    </section>

    <!-- 3. LIST PENGUMUMAN GRID -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      
      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="i in 4" :key="i" class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm animate-pulse space-y-3">
          <div class="h-4 bg-slate-200 rounded w-1/4"></div>
          <div class="h-6 bg-slate-200 rounded w-3/4"></div>
          <div class="h-4 bg-slate-200 rounded w-1/2"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-sm">
        <div class="text-3xl mb-2">⚠️</div>
        <h2 class="font-bold text-slate-800 text-base">Gagal Memuat Pengumuman</h2>
        <p class="text-xs text-slate-500 mt-1">Gagal terhubung dengan server API backend Django.</p>
      </div>

      <!-- Data Tampil -->
      <div v-else-if="filteredPengumuman.length > 0" class="space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <article 
            v-for="item in paginatedPengumuman" 
            :key="item.id"
            class="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group"
          >
            <div>
              <!-- Priority Top Accent Line -->
              <div :class="[
                'h-1.5 w-full',
                item.prioritas === 'Mendesak' ? 'bg-red-500' :
                item.prioritas === 'Penting' ? 'bg-amber-400' :
                'bg-slate-900'
              ]"></div>

              <div class="p-6">
                <!-- Badges Row -->
                <div class="flex items-center justify-between gap-2 mb-3">
                  <div class="flex items-center gap-2">
                    <span :class="[
                      'px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider',
                      item.prioritas === 'Mendesak' ? 'bg-red-100 text-red-700 border border-red-200' :
                      item.prioritas === 'Penting' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                      'bg-slate-100 text-slate-700 border border-slate-200/80'
                    ]">
                      {{ item.prioritas }}
                    </span>
                    <span class="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2.5 py-1 rounded-md border border-slate-200/80">
                      {{ item.kategori }}
                    </span>
                  </div>
                  <time :datetime="formatTanggalISO(item.tanggal || item.tanggal_dibuat)" class="text-[11px] font-semibold text-slate-400">
                    📅 {{ formatTanggal(item.tanggal || item.tanggal_dibuat) }}
                  </time>
                </div>

                <!-- Title -->
                <NuxtLink :to="`/pengumuman/${item.id}`">
                  <h2 class="text-base sm:text-lg font-bold text-slate-900 group-hover:text-slate-700 transition-colors leading-snug mb-2">
                    {{ item.judul }}
                  </h2>
                </NuxtLink>

                <!-- Target Tag -->
                <p v-if="item.target" class="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60 inline-block mb-3">
                  🎯 Target: {{ item.target }}
                </p>

                <!-- Summary -->
                <p class="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {{ item.ringkasan || item.isi_pengumuman }}
                </p>
              </div>
            </div>

            <!-- Card Action Footer -->
            <div class="px-6 pb-5 pt-3 flex items-center justify-between border-t border-slate-100">
              <button 
                @click="openQuickView(item)" 
                class="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1"
              >
                  Pratinjau
              </button>
              
              <NuxtLink 
                :to="`/pengumuman/${item.id}`" 
                class="inline-flex items-center text-xs font-bold text-slate-900 group-hover:translate-x-1 transition-transform gap-1"
              >
                Baca Selengkapnya &rarr;
              </NuxtLink>
            </div>
          </article>
        </div>

        <!-- Pagination Controls -->
        <nav v-if="totalPages > 1" aria-label="Navigasi Halaman Pengumuman" class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200/80">
          <p class="text-xs font-medium text-slate-500">
            Menampilkan <span class="font-bold text-slate-800">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> - 
            <span class="font-bold text-slate-800">{{ Math.min(currentPage * itemsPerPage, filteredPengumuman.length) }}</span> 
            dari <span class="font-bold text-slate-800">{{ filteredPengumuman.length }}</span> pengumuman
          </p>

          <div class="flex items-center gap-2">
            <button 
              @click="goToPage(currentPage - 1)" 
              :disabled="currentPage === 1"
              aria-label="Halaman Sebelumnya"
              class="px-3.5 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-900 hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-700 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-1"
            >
              &larr; Prev
            </button>

            <div class="flex items-center gap-1">
              <button
                v-for="p in totalPages"
                :key="p"
                @click="goToPage(p)"
                :aria-label="`Pergi ke halaman ${p}`"
                :class="[
                  'w-8 h-8 rounded-xl text-xs font-bold transition-all flex items-center justify-center',
                  currentPage === p
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                ]"
              >
                {{ p }}
              </button>
            </div>

            <button 
              @click="goToPage(currentPage + 1)" 
              :disabled="currentPage === totalPages"
              aria-label="Halaman Selanjutnya"
              class="px-3.5 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-900 hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-700 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-1"
            >
              Next &rarr;
            </button>
          </div>
        </nav>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-sm my-6">
        <div class="text-3xl mb-2">🔍</div>
        <h2 class="font-bold text-slate-800 text-base">Pengumuman tidak ditemukan</h2>
        <p class="text-xs text-slate-500 mt-1">Coba sesuaikan kata kunci atau filter prioritas / kategori Anda.</p>
      </div>

    </main>

    <!-- 4. QUICK VIEW MODAL -->
    <Teleport to="body">
      <div v-if="activeModalData" class="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6">
        <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" @click="closeModal"></div>

        <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden transform transition-all flex flex-col max-h-[90vh] z-10 border border-slate-200">
          
          <button @click="closeModal" aria-label="Tutup Modal" class="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 rounded-full transition-colors">
            ✕
          </button>

          <div class="p-6 border-b border-slate-100 bg-slate-50/50">
            <span :class="[
              'px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider inline-block mb-2',
              activeModalData.prioritas === 'Mendesak' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-800'
            ]">
              {{ activeModalData.prioritas }} • {{ activeModalData.kategori }}
            </span>
            <h2 class="text-xl font-extrabold text-slate-900 leading-snug">{{ activeModalData.judul }}</h2>
            <time :datetime="formatTanggalISO(activeModalData.tanggal || activeModalData.tanggal_dibuat)" class="text-xs text-slate-400 mt-1 block">
              📅 {{ formatTanggal(activeModalData.tanggal || activeModalData.tanggal_dibuat) }}
            </time>
          </div>

          <div class="p-6 overflow-y-auto space-y-4 text-sm text-slate-700 leading-relaxed">
            <p class="whitespace-pre-wrap">{{ activeModalData.isi_pengumuman || activeModalData.ringkasan }}</p>
          </div>

          <div class="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <button @click="closeModal" class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors">
              Tutup
            </button>
            
            <NuxtLink 
              :to="`/pengumuman/${activeModalData.id}`" 
              class="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
            >
              Halaman Detail Penuh &rarr;
            </NuxtLink>
          </div>

        </div>
      </div>
    </Teleport>

  </div>
</template>