<script setup>
import { computed } from 'vue'

const route = useRoute()
const pengumumanId = route.params.id

// Base URL Backend Django
const config = useRuntimeConfig()
const BACKEND_URL = config.public.apiBase

// Fetch data spesifik berdasarkan ID
const { data: pengumuman, pending, error } = await useFetch(`${BACKEND_URL}/api/pengumuman/${pengumumanId}/`)

const formatTanggalLengkap = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const printPage = () => {
  if (process.client) {
    window.print()
  }
}

// ----------------------------------------------------------------
// SEO OPTIMIZATION LOGIC
// ----------------------------------------------------------------

// 1. Dynamic Page Title & Meta Description
const pageTitle = computed(() => {
  return pengumuman.value?.judul 
    ? `${pengumuman.value.judul} - SD YWKA Bandung` 
    : 'Detail Pengumuman - SD YWKA Bandung'
})

const pageDescription = computed(() => {
  if (!pengumuman.value) return 'Pengumuman resmi dan informasi terbaru dari SD YWKA REL HOMY SCHOOL Bandung.'
  const rawText = pengumuman.value.ringkasan || pengumuman.value.isi_pengumuman || ''
  const cleanText = rawText.replace(/<[^>]*>?/gm, '').trim()
  return cleanText.length > 160 ? cleanText.substring(0, 157) + '...' : cleanText
})

const publishDate = computed(() => {
  return pengumuman.value ? (pengumuman.value.tanggal || pengumuman.value.tanggal_dibuat) : null
})

// Canonical URL Dynamic
const canonicalUrl = computed(() => {
  return `https://sdywkabandung.sch.id/pengumuman/${pengumumanId}`
})

// 2. Comprehensive Meta Tags (Open Graph, Twitter Cards, Description)
useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogType: 'article',
  ogUrl: canonicalUrl,
  ogSiteName: 'SD YWKA Bandung',
  twitterCard: 'summary_large_image',
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
})

// 3. Schema.org JSON-LD Structured Data & Link Canonical
useHead({
  link: [
    { rel: 'canonical', href: canonicalUrl }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: computed(() => {
        if (!pengumuman.value) return ''
        return JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          'headline': pengumuman.value.judul,
          'description': pageDescription.value,
          'datePublished': publishDate.value,
          'dateModified': publishDate.value,
          'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': canonicalUrl.value
          },
          'author': {
            '@type': 'Organization',
            'name': 'SD YWKA Bandung',
            'url': 'https://sdywkabandung.sch.id'
          },
          'publisher': {
            '@type': 'EducationalOrganization',
            'name': 'SD YWKA Bandung',
            'logo': {
              '@type': 'ImageObject',
              'url': 'https://sdywkabandung.sch.id/logo.png'
            }
          },
          'articleSection': pengumuman.value.kategori || 'Pengumuman Resmi'
        })
      })
    }
  ]
})
</script>

<template>
  <div class="bg-slate-50 min-h-screen text-slate-800 pb-20">
    
    <!-- 1. HERO TOP BAR HEADER -->
    <header class="bg-slate-900 text-white py-8 border-b border-slate-800 print:hidden relative overflow-hidden">
      <div class="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4 relative z-10">
        
        <NuxtLink 
          to="/pengumuman" 
          class="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold rounded-xl border border-slate-700 transition-all group"
        >
          <svg class="w-4 h-4 group-hover:-translate-x-1 transition-transform text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Daftar Pengumuman
        </NuxtLink>

        <button 
          v-if="!pending && pengumuman"
          @click="printPage"
          class="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Cetak Dokumen
        </button>

      </div>
    </header>

    <!-- 2. KONTEN UTAMA -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12">
      
      <!-- Loading State -->
      <div v-if="pending" class="bg-white rounded-2xl p-8 sm:p-12 shadow-sm border border-slate-200/80 animate-pulse">
        <div class="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
        <div class="h-10 bg-slate-200 rounded w-3/4 mb-6"></div>
        <div class="space-y-3">
          <div class="h-4 bg-slate-200 rounded w-full"></div>
          <div class="h-4 bg-slate-200 rounded w-full"></div>
          <div class="h-4 bg-slate-200 rounded w-5/6"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-sm">
        <div class="text-4xl mb-3">⚠️</div>
        <h2 class="text-2xl font-extrabold text-slate-900 mb-2">Gagal Memuat Pengumuman</h2>
        <p class="text-slate-500 text-sm mb-6">Dokumen yang Anda cari tidak ditemukan atau terjadi kesalahan pada server.</p>
        <NuxtLink to="/pengumuman" class="inline-flex items-center px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm">
          Lihat Pengumuman Lainnya
        </NuxtLink>
      </div>

      <!-- Detail Card Pengumuman (Semantic HTML: <article>) -->
      <article v-else-if="pengumuman" class="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden print:shadow-none print:border-none print:rounded-none">
        
        <div :class="[
          'h-1.5 w-full',
          pengumuman.prioritas === 'Mendesak' ? 'bg-red-500' :
          pengumuman.prioritas === 'Penting' ? 'bg-amber-400' :
          'bg-slate-900'
        ]"></div>

        <div class="p-6 sm:p-10 md:p-12">
          
          <header class="mb-6">
            <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
              <div class="flex flex-wrap items-center gap-2">
                <span :class="[
                  'px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider',
                  pengumuman.prioritas === 'Mendesak' ? 'bg-red-100 text-red-700 border border-red-200' :
                  pengumuman.prioritas === 'Penting' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                  'bg-slate-100 text-slate-800 border border-slate-200/80'
                ]">
                  {{ pengumuman.prioritas }}
                </span>

                <span class="bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1 rounded-lg border border-slate-200/80">
                  {{ pengumuman.kategori }}
                </span>
              </div>

              <time :datetime="pengumuman.tanggal || pengumuman.tanggal_dibuat" class="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                📅 {{ formatTanggalLengkap(pengumuman.tanggal || pengumuman.tanggal_dibuat) }}
              </time>
            </div>

            <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-6">
              {{ pengumuman.judul }}
            </h1>

            <div class="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm">
              <span class="text-slate-500">🎯 Ditujukan Untuk:</span>
              <span class="font-bold text-slate-800">{{ pengumuman.target || 'Seluruh Sivitas Akademika' }}</span>
            </div>
          </header>

          <section class="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-wrap space-y-4">
            {{ pengumuman.isi_pengumuman || pengumuman.ringkasan }}
          </section>

          <footer class="mt-12 pt-6 border-t border-slate-100 text-xs sm:text-sm text-slate-500 italic">
            Demikian pengumuman resmi ini kami sampaikan agar dapat menjadi perhatian bersama. Atas kerja sama Bapak/Ibu, kami ucapkan terima kasih.
            <br>
            <strong class="text-slate-800 not-italic block mt-2 font-bold">— Manajemen SD YWKA Bandung</strong>
          </footer>

        </div>

        <!-- Section Lampiran -->
        <section v-if="pengumuman.lampiran" class="bg-emerald-50/50 border-t border-emerald-100 p-6 sm:p-10 print:hidden">
          <h2 class="text-xs font-bold text-emerald-800 mb-4 uppercase tracking-wider">Berkas Lampiran Tersedia</h2>
          
          <div class="bg-white border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div class="flex items-center gap-4">
              <div class="w-11 h-11 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center text-xl shrink-0">
                📄
              </div>
              <div>
                <p class="font-bold text-slate-800 text-sm">{{ pengumuman.judul }} - Lampiran</p>
                <p class="text-xs text-emerald-600 font-medium mt-0.5">Format PDF / Berkas Resmi</p>
              </div>
            </div>
            
            <a 
              :href="BACKEND_URL + pengumuman.lampiran" 
              target="_blank" 
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm w-full sm:w-auto"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Unduh Dokumen
            </a>
          </div>
        </section>

      </article>

    </main>
  </div>
</template>

<style>
@media print {
  body {
    background-color: white !important;
  }
  .bg-slate-50 {
    background-color: white !important;
  }
}
</style>