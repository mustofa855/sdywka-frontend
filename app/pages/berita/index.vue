<script setup>
import { ref, computed } from 'vue'

const config = useRuntimeConfig()
const BACKEND_URL = config.public.apiBase
const url = useRequestURL()

// --- OPTIMASI SEO & META TAGS ---
const seoTitle = 'Berita & Kegiatan - SD YWKA REL HOMY SCHOOL Bandung'
const seoDescription = 'Kumpulan berita terkini, artikel akademik, dokumentasi kegiatan siswa, dan prestasi SD YWKA REL HOMY SCHOOL Bandung.'
const seoImage = `${url.origin}/default-og-image.jpg`
const canonicalUrl = `${url.origin}/berita`

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

// State untuk Filter & Search
const searchQuery = ref('')
const selectedCategory = ref('Semua')

const kategoriList = [
  'Semua',
  'Kegiatan Siswa',
  'Prestasi',
  'Akademik',
  'Pengumuman'
]

// Fetch data berita dari backend Django REST Framework secara reaktif
const { data: listBerita, pending: loading } = await useFetch(`${BACKEND_URL}/api/berita/`, {
  query: computed(() => ({
    kategori: selectedCategory.value !== 'Semua' ? selectedCategory.value : undefined,
    search: searchQuery.value ? searchQuery.value : undefined
  })),
  watch: [selectedCategory, searchQuery]
})

// DYNAMIC STRUCTURED DATA (BreadcrumbList + CollectionPage ItemList)
const schemaJsonLd = computed(() => {
  const itemsList = (listBerita.value || []).map((item, index) => ({
    '@type': 'ListItem',
    'position': index + 1,
    'url': `${url.origin}/berita/${item.id}`,
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
          'name': 'Berita & Kegiatan',
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

// Helper untuk mendapatkan URL gambar yang valid
const dapatkanUrlGambar = (pathGambar) => {
  if (!pathGambar) return ''
  if (pathGambar.startsWith('http')) return pathGambar
  return `${BACKEND_URL}${pathGambar}`
}

// Helper Format Tanggal Indonesia
const formatTanggal = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

// Helper Waktu ISO untuk atribut datetime HTML
const formatTanggalISO = (dateStr) => {
  if (!dateStr) return new Date().toISOString()
  return new Date(dateStr).toISOString()
}

// Helper Waktu Relatif Sederhana
const formatWaktuRelatif = (tanggalStr) => {
  if (!tanggalStr) return '-'
  const sekarang = new Date()
  const tanggalUpload = new Date(tanggalStr)
  const selisihMs = sekarang - tanggalUpload
  
  const detik = Math.floor(selisihMs / 1000)
  const menit = Math.floor(detik / 60)
  const jam = Math.floor(menit / 60)
  const hari = Math.floor(jam / 24)
  
  if (hari > 0) return `${hari} hari lalu`
  if (jam > 0) return `${jam} jam lalu`
  if (menit > 0) return `${menit} menit lalu`
  return 'Baru saja'
}

// Berita Utama (Headline / is_featured atau item pertama)
const featuredNews = computed(() => {
  if (!listBerita.value || listBerita.value.length === 0) return null
  return listBerita.value.find(b => b.is_featured) || listBerita.value[0]
})

// Berita Lainnya (Di luar featured news)
const otherNews = computed(() => {
  if (!listBerita.value || listBerita.value.length === 0) return []
  if (!featuredNews.value) return listBerita.value
  return listBerita.value.filter(b => b.id !== featuredNews.value.id)
})
</script>

<template>
  <div class="bg-slate-50 min-h-screen text-slate-800 pb-20">
    
    <!-- 1. HERO HEADER -->
    <header class="bg-slate-900 text-white py-12 md:py-16 border-b border-slate-800 relative overflow-hidden">
      <div class="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <span class="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-widest mb-3">
          📰 INFORMASI & DOKUMENTASI
        </span>
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          BERITA & <span class="text-amber-400">KEGIATAN</span>
        </h1>
        <p class="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mt-3 font-normal leading-relaxed">
          Ikuti perkembangan informasi terbaru, prestasi, dan ragam aktivitas seru peserta didik di <span class="font-medium text-slate-100">SD YWKA REL HOMY SCHOOL</span>.
        </p>
      </div>
    </header>

    <!-- 2. SEARCH & FILTER SECTION -->
    <section aria-label="Filter Berita" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-20">
      <div class="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <!-- Filter Kategori Buttons -->
        <nav aria-label="Kategori Berita" class="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            v-for="(kat, idx) in kategoriList"
            :key="idx"
            @click="selectedCategory = kat"
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

        <!-- Search Input Bar -->
        <div class="relative w-full md:w-80">
          <input 
            v-model="searchQuery"
            type="text" 
            aria-label="Cari kata kunci berita"
            placeholder="Cari kata kunci berita..."
            class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
          />
          <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

      </div>
    </section>

    <!-- 3. KONTEN UTAMA BERITA -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-20 text-slate-500 font-semibold text-sm">
        Memuat data berita dari server...
      </div>

      <div v-else-if="listBerita && listBerita.length > 0" class="space-y-10">
        
        <!-- FEATURED HEADLINE -->
        <article v-if="featuredNews" class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center hover:shadow-md transition-all duration-200">
          
          <div class="lg:col-span-7 bg-slate-900 relative h-64 sm:h-80 lg:h-[360px]">
            <img 
              v-if="featuredNews.gambar"
              :src="dapatkanUrlGambar(featuredNews.gambar)" 
              :alt="featuredNews.judul"
              fetchpriority="high"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full bg-slate-900 flex items-center justify-center p-8 text-center">
              <span class="text-slate-600 font-extrabold text-2xl uppercase tracking-widest">SD YWKA NEWS</span>
            </div>
            <span class="absolute top-3 left-3 bg-amber-500 text-slate-900 font-bold text-[11px] px-3 py-1 rounded-md shadow-sm z-10">
              Utama
            </span>
          </div>

          <div class="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div class="flex items-center space-x-2 text-xs text-slate-400 font-medium mb-3">
                <span class="bg-slate-100 text-slate-800 font-semibold px-2.5 py-0.5 rounded-md border border-slate-200/80">
                  {{ featuredNews.kategori }}
                </span>
                <span>&bull;</span>
                <time :datetime="formatTanggalISO(featuredNews.tanggal_upload)">
                  {{ formatWaktuRelatif(featuredNews.tanggal_upload) }}
                </time>
              </div>

              <NuxtLink :to="`/berita/${featuredNews.id}`" class="group">
                <h2 class="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-slate-700 transition-colors leading-snug mb-3">
                  {{ featuredNews.judul }}
                </h2>
              </NuxtLink>

              <p class="text-slate-500 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-6">
                {{ featuredNews.ringkasan || featuredNews.isi }}
              </p>
            </div>

            <NuxtLink 
              :to="`/berita/${featuredNews.id}`" 
              class="inline-flex items-center text-slate-900 font-bold text-xs hover:translate-x-1 transition-transform gap-1"
            >
              Baca Selengkapnya &rarr;
            </NuxtLink>
          </div>

        </article>

        <!-- GRID BERITA LAINNYA -->
        <section v-if="otherNews.length > 0" aria-label="Berita Terkait">
          <h2 class="text-base font-bold text-slate-900 border-l-4 border-amber-400 pl-3 mb-6">
            Berita Terkait Lainnya
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <article 
              v-for="berita in otherNews" 
              :key="berita.id"
              class="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div class="h-48 bg-slate-900 relative overflow-hidden">
                  <img 
                    v-if="berita.gambar" 
                    :src="dapatkanUrlGambar(berita.gambar)" 
                    :alt="berita.judul"
                    loading="lazy"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div v-else class="w-full h-full bg-slate-900 flex items-center justify-center">
                    <svg class="w-10 h-10 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <span class="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-md border border-slate-700">
                    {{ berita.kategori }}
                  </span>
                </div>

                <div class="p-5">
                  <time :datetime="formatTanggalISO(berita.tanggal_upload)" class="text-[11px] text-slate-400 font-semibold block mb-1">
                    📅 {{ formatTanggal(berita.tanggal_upload) }}
                  </time>
                  <NuxtLink :to="`/berita/${berita.id}`">
                    <h3 class="font-bold text-slate-900 text-base line-clamp-2 group-hover:text-slate-700 transition-colors leading-snug mb-2">
                      {{ berita.judul }}
                    </h3>
                  </NuxtLink>
                  <p class="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                    {{ berita.ringkasan || berita.isi }}
                  </p>
                </div>
              </div>

              <div class="px-5 pb-5 pt-0">
                <NuxtLink :to="`/berita/${berita.id}`" class="text-xs font-bold text-slate-900 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Baca Artikel &rarr;
                </NuxtLink>
              </div>

            </article>
          </div>
        </section>

      </div>

      <!-- State Jika Berita Tidak Ditemukan -->
      <div v-else class="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-sm my-6">
        <div class="text-3xl mb-2">🔍</div>
        <h3 class="font-bold text-slate-800">Berita tidak ditemukan</h3>
        <p class="text-xs text-slate-500 mt-1">Coba sesuaikan kata kunci atau kategori yang Anda pilih.</p>
        <button @click="searchQuery = ''; selectedCategory = 'Semua'" class="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-sm">
          Reset Filter
        </button>
      </div>

    </main>

  </div>
</template>