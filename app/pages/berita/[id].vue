<script setup>
import { ref, computed } from 'vue'

const route = useRoute()
const config = useRuntimeConfig()
const BACKEND_URL = config.public.apiBase
const url = useRequestURL()

// 1. Fetch data detail berita berdasarkan ID/UUID
const { data: berita, pending: loadingDetail, error } = await useFetch(`${BACKEND_URL}/api/berita/${route.params.id}/`)

// 2. Fetch seluruh berita untuk Sidebar "Berita Lainnya"
const { data: listBerita } = await useFetch(`${BACKEND_URL}/api/berita/`)

// Helper URL Gambar agar mengarah ke Django
const dapatkanUrlGambar = (pathGambar) => {
  if (!pathGambar) return ''
  if (pathGambar.startsWith('http')) return pathGambar
  return `${BACKEND_URL}${pathGambar}`
}

// Helper Format Tanggal Indonesia Lengkap (contoh: Rabu, 22 Juli 2026)
const formatTanggalLengkap = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// Helper Waktu ISO untuk atribut datetime HTML & Schema SEO
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

// Estimasi Waktu Baca
const estimasiWaktuBaca = computed(() => {
  if (!berita.value || !berita.value.isi) return '1 min baca'
  const kata = berita.value.isi.trim().split(/\s+/).length
  const menit = Math.max(1, Math.ceil(kata / 200))
  return `${menit} menit baca`
})

// Inisial Penulis untuk Avatar Fallback
const inisialPenulis = computed(() => {
  const nama = berita.value?.penulis_nama || 'Humas SD YWKA'
  const kata = nama.trim().split(/\s+/)
  if (kata.length >= 2) {
    return (kata[0][0] + kata[1][0]).toUpperCase()
  }
  return nama.substring(0, 2).toUpperCase()
})

// Filter agar berita yang sedang dibaca TIDAK muncul ganda di sidebar
const beritaLainnya = computed(() => {
  if (!listBerita.value) return []
  return listBerita.value.filter(item => item.id !== route.params.id).slice(0, 5)
})

// State & Fungsi Copy Link (Share)
const showShareToast = ref(false)
const salinTautan = () => {
  if (process.client) {
    navigator.clipboard.writeText(window.location.href)
    showShareToast.value = true
    setTimeout(() => {
      showShareToast.value = false
    }, 3000)
  }
}

// Fungsi Cetak
const cetakBerita = () => {
  if (process.client) {
    window.print()
  }
}

// --- OPTIMASI SEO & META TAGS ---
const seoTitle = computed(() => berita.value ? `${berita.value.judul} - SD YWKA REL HOMY SCHOOL` : 'Detail Berita - SD YWKA REL HOMY SCHOOL')
const seoDescription = computed(() => {
  if (!berita.value) return 'Baca berita dan informasi terbaru dari SD YWKA REL HOMY SCHOOL.'
  if (berita.value.ringkasan) return berita.value.ringkasan
  return berita.value.isi ? berita.value.isi.substring(0, 160).replace(/\n/g, ' ') : 'Berita terkini SD YWKA REL HOMY SCHOOL.'
})
const seoImage = computed(() => berita.value?.gambar ? dapatkanUrlGambar(berita.value.gambar) : `${url.origin}/default-og-image.jpg`)
const seoAuthor = computed(() => berita.value?.penulis_nama || 'Humas SD YWKA REL HOMY SCHOOL')
const seoPublishedTime = computed(() => formatTanggalISO(berita.value?.tanggal_upload))

useSeoMeta({
  title: seoTitle,
  ogTitle: seoTitle,
  description: seoDescription,
  ogDescription: seoDescription,
  ogImage: seoImage,
  ogUrl: url.href,
  ogType: 'article',
  ogSiteName: 'SD YWKA REL HOMY SCHOOL',
  articlePublishedTime: seoPublishedTime,
  articleAuthor: seoAuthor,
  articleSection: computed(() => berita.value?.kategori || 'Berita'),
  twitterCard: 'summary_large_image',
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
  twitterImage: seoImage,
})

useHead({
  link: [
    { rel: 'canonical', href: url.href }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: computed(() => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        'headline': berita.value?.judul || '',
        'image': [seoImage.value],
        'datePublished': seoPublishedTime.value,
        'dateModified': seoPublishedTime.value,
        'author': [{
          '@type': 'Person',
          'name': seoAuthor.value
        }],
        'publisher': {
          '@type': 'Organization',
          'name': 'SD YWKA REL HOMY SCHOOL',
          'logo': {
            '@type': 'ImageObject',
            'url': `${url.origin}/favicon.ico`
          }
        },
        'description': seoDescription.value,
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': url.href
        }
      }))
    }
  ]
})
</script>

<template>
  <div class="bg-slate-50 min-h-screen text-slate-800 pb-20">
    
    <!-- 1. HERO HEADER / BREADCRUMB -->
    <header class="bg-slate-900 text-white py-8 border-b border-slate-800 print:hidden relative overflow-hidden">
      <div class="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4 relative z-10">
        
        <!-- Tombol Kembali -->
        <NuxtLink 
          to="/berita" 
          class="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold rounded-xl border border-slate-700 transition-all group"
        >
          <svg class="w-4 h-4 group-hover:-translate-x-1 transition-transform text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Daftar Berita
        </NuxtLink>

        <!-- Breadcrumb Info -->
        <nav aria-label="Breadcrumb" class="text-xs text-slate-400 font-medium hidden sm:flex items-center gap-2">
          <NuxtLink to="/berita" class="hover:underline text-slate-300">Berita</NuxtLink>
          <span>&rsaquo;</span>
          <span class="text-amber-400 font-semibold">{{ berita?.kategori || 'Artikel' }}</span>
        </nav>

      </div>
    </header>

    <!-- 2. KONTEN UTAMA -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12">
      
      <!-- State Loading Skeleton -->
      <div v-if="loadingDetail" class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        <div class="lg:col-span-8 bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm animate-pulse space-y-6">
          <div class="h-6 bg-slate-200 rounded w-1/4"></div>
          <div class="h-10 bg-slate-200 rounded w-5/6"></div>
          <div class="h-80 bg-slate-200 rounded-2xl w-full"></div>
          <div class="space-y-3">
            <div class="h-4 bg-slate-200 rounded w-full"></div>
            <div class="h-4 bg-slate-200 rounded w-full"></div>
            <div class="h-4 bg-slate-200 rounded w-3/4"></div>
          </div>
        </div>
        <div class="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm animate-pulse space-y-4">
          <div class="h-6 bg-slate-200 rounded w-1/2 mb-4"></div>
          <div v-for="n in 3" :key="n" class="flex gap-4">
            <div class="w-20 h-16 bg-slate-200 rounded-xl shrink-0"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-slate-200 rounded w-full"></div>
              <div class="h-3 bg-slate-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- State Error / Berita Tidak Ditemukan -->
      <div v-else-if="error || !berita" class="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-sm max-w-2xl mx-auto">
        <div class="text-3xl mb-3">📰</div>
        <h2 class="text-2xl font-extrabold text-slate-900 mb-2">Berita Tidak Ditemukan</h2>
        <p class="text-slate-500 text-sm mb-6">Artikel berita ini mungkin telah dihapus atau tautan yang Anda tuju salah.</p>
        <NuxtLink to="/berita" class="inline-flex items-center px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm">
          Lihat Berita Lainnya
        </NuxtLink>
      </div>

      <!-- GRID LAYOUT BILA BERITA TERSEDIA -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        
        <!-- KOLOM KIRI: DETIL ARTIKEL UTAMA -->
        <article class="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden print:shadow-none print:border-none">
          <div class="p-6 sm:p-10 md:p-12">
            
            <!-- Category & Reading Time Badge -->
            <div class="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div class="flex items-center gap-2">
                <span class="bg-slate-100 text-slate-800 font-semibold text-xs px-3 py-1 rounded-md border border-slate-200/80 uppercase tracking-wider">
                  {{ berita.kategori || 'Kegiatan' }}
                </span>
                <span class="text-xs text-slate-400 font-medium">
                  &bull; {{ formatWaktuRelatif(berita.tanggal_upload) }}
                </span>
              </div>

              <span class="text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200/60 flex items-center gap-1.5">
                📖 {{ estimasiWaktuBaca }}
              </span>
            </div>

            <!-- Judul Berita Utama (H1) -->
            <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-6">
              {{ berita.judul }}
            </h1>

            <!-- Meta Penulis & Tanggal -->
            <div class="flex items-center justify-between border-y border-slate-100 py-4 mb-8 text-xs sm:text-sm text-slate-500">
              <div class="flex items-center gap-3">
                <!-- Foto Profil Penulis -->
                <img 
                  v-if="berita.penulis_foto" 
                  :src="dapatkanUrlGambar(berita.penulis_foto)" 
                  :alt="`Foto Penulis ${berita.penulis_nama || 'Humas SD YWKA'}`" 
                  loading="lazy"
                  class="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0 shadow-sm"
                />
                <div 
                  v-else 
                  class="w-10 h-10 rounded-full bg-slate-900 text-amber-400 font-bold flex items-center justify-center text-xs shrink-0 shadow-sm"
                >
                  {{ inisialPenulis }}
                </div>

                <div>
                  <p class="font-bold text-slate-900 leading-none">{{ berita.penulis_nama || 'Humas SD YWKA' }}</p>
                  <time :datetime="formatTanggalISO(berita.tanggal_upload)" class="text-[11px] text-slate-400 mt-1 block">
                    {{ formatTanggalLengkap(berita.tanggal_upload) }}
                  </time>
                </div>
              </div>

              <!-- Tombol Aksi (Share & Print) -->
              <div class="flex items-center gap-2 print:hidden">
                <button 
                  @click="salinTautan" 
                  title="Bagikan Artikel"
                  aria-label="Bagikan Artikel"
                  class="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
                <button 
                  @click="cetakBerita" 
                  title="Cetak Artikel"
                  aria-label="Cetak Artikel"
                  class="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Gambar Utama Berita -->
            <div v-if="berita.gambar" class="mb-8 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/80">
              <img 
                :src="dapatkanUrlGambar(berita.gambar)" 
                :alt="berita.judul"
                fetchpriority="high"
                class="w-full max-h-[480px] object-cover"
              />
            </div>

            <!-- Ringkasan Singkat (Highlight) -->
            <div v-if="berita.ringkasan" class="p-4 sm:p-5 rounded-2xl bg-slate-50 border-l-4 border-amber-400 mb-8">
              <p class="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed italic">
                "{{ berita.ringkasan }}"
              </p>
            </div>

            <!-- Isi Lengkap Artikel -->
            <div class="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base space-y-4 whitespace-pre-line">
              {{ berita.isi }}
            </div>

          </div>
        </article>

        <!-- KOLOM KANAN: SIDEBAR BERITA LAINNYA -->
        <aside class="lg:col-span-4 space-y-6 print:hidden">
          <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
            <h2 class="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-amber-400"></span>
              Berita Terbaru Lainnya
            </h2>

            <div v-if="beritaLainnya.length > 0" class="space-y-4">
              <article 
                v-for="item in beritaLainnya" 
                :key="item.id"
                class="group flex items-start gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
              >
                <div class="w-20 h-16 bg-slate-900 rounded-xl overflow-hidden shrink-0 border border-slate-200/60">
                  <img 
                    v-if="item.gambar" 
                    :src="dapatkanUrlGambar(item.gambar)" 
                    :alt="item.judul"
                    loading="lazy"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div v-else class="w-full h-full bg-slate-900 flex items-center justify-center text-[10px] text-slate-500 font-bold">
                    YWKA
                  </div>
                </div>

                <div class="flex-1 min-w-0">
                  <time :datetime="formatTanggalISO(item.tanggal_upload)" class="text-[10px] text-slate-400 font-semibold block">
                    {{ formatWaktuRelatif(item.tanggal_upload) }}
                  </time>
                  <NuxtLink :to="`/berita/${item.id}`" class="block mt-0.5">
                    <h3 class="text-xs font-bold text-slate-900 group-hover:text-slate-700 transition-colors line-clamp-2 leading-snug">
                      {{ item.judul }}
                    </h3>
                  </NuxtLink>
                </div>
              </article>
            </div>

            <div v-else class="text-xs text-slate-400 py-4 text-center">
              Belum ada berita lainnya.
            </div>
          </div>
        </aside>

      </div>
    </main>

    <!-- TOAST NOTIFIKASI SALIN LINK -->
    <Teleport to="body">
      <div 
        v-if="showShareToast" 
        class="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-xs font-bold flex items-center gap-2 border border-slate-800 animate-in fade-in slide-in-from-bottom-4"
      >
        <span>✅ Tautan berhasil disalin ke clipboard!</span>
      </div>
    </Teleport>

  </div>
</template>