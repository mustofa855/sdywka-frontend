<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'

const route = useRoute()
const pengumumanId = route.params.id

// Base URL Backend Django
const config = useRuntimeConfig()
const BACKEND_URL = config.public.apiBase || 'http://localhost:8000'

// Fetch data spesifik berdasarkan ID
const { data: pengumuman, pending, error } = await useFetch(
  `${BACKEND_URL}/api/pengumuman/${pengumumanId}/`
)

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
// MODAL PREVIEW DOKUMEN LOGIC
// ----------------------------------------------------------------

const showDocumentModal = ref(false)
const documentPreviewUrl = ref('')
const documentLoading = ref(false)
const documentDownloading = ref(false)

// Deteksi Format File Lampiran
const docFileType = computed(() => {
  if (!pengumuman.value?.lampiran) return 'pdf'
  const sourceUrl = String(pengumuman.value.lampiran).trim()
  const extMatch = sourceUrl.match(/\.([a-zA-Z0-9]+)(\?.*)?$/)
  return extMatch ? extMatch[1].toLowerCase() : 'pdf'
})

// Normalisasi URL File
const getDocumentUrl = () => {
  if (!pengumuman.value?.lampiran) return ''

  let lampiran = String(pengumuman.value.lampiran).trim()

  lampiran = lampiran
    .replace(/^http\/\//i, 'http://')
    .replace(/^https\/\//i, 'https://')

  const lastHttpIndex = Math.max(
    lampiran.lastIndexOf('http://'),
    lampiran.lastIndexOf('https://')
  )

  if (lastHttpIndex > 0) {
    lampiran = lampiran.substring(lastHttpIndex)
  }

  if (
    lampiran.startsWith('http://') ||
    lampiran.startsWith('https://')
  ) {
    return lampiran
  }

  const baseUrl = BACKEND_URL.replace(/\/api\/?$/, '').replace(/\/$/, '')
  const filePath = lampiran.startsWith('/')
    ? lampiran
    : `/${lampiran}`

  return `${baseUrl}${filePath}`
}

// Buka Modal Dokumen
const openDocumentModal = async () => {
  if (!pengumuman.value?.lampiran) return

  documentLoading.value = true
  showDocumentModal.value = true

  if (documentPreviewUrl.value && documentPreviewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(documentPreviewUrl.value)
  }
  documentPreviewUrl.value = ''

  const targetUrl = getDocumentUrl()

  try {
    const response = await fetch(targetUrl)
    if (response.ok) {
      const blob = await response.blob()
      documentPreviewUrl.value = window.URL.createObjectURL(blob)
    } else {
      documentPreviewUrl.value = targetUrl
    }
  } catch (err) {
    console.error('Gagal mengambil blob preview dokumen:', err)
    documentPreviewUrl.value = targetUrl
  } finally {
    documentLoading.value = false
  }
}

// Tutup Modal Dokumen
const closeDocumentModal = () => {
  showDocumentModal.value = false
  if (documentPreviewUrl.value && documentPreviewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(documentPreviewUrl.value)
  }
  documentPreviewUrl.value = ''
  documentLoading.value = false
}

// Buka Dokumen di Tab Baru
const openInNewTab = () => {
  const targetUrl = documentPreviewUrl.value || getDocumentUrl()
  if (targetUrl) {
    window.open(targetUrl, '_blank', 'noopener,noreferrer')
  }
}

// Unduh Dokumen
const downloadDocument = async () => {
  const rawUrl = getDocumentUrl()
  if (!rawUrl || documentDownloading.value) return

  documentDownloading.value = true

  try {
    const response = await fetch(rawUrl)

    if (!response.ok) {
      throw new Error(`Gagal mengunduh dokumen: ${response.status}`)
    }

    const blob = await response.blob()
    const objectUrl = window.URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = objectUrl

    const originalPath = rawUrl.split('?')[0]
    const originalName = originalPath.split('/').pop()

    link.download = originalName || `dokumen-pengumuman.${docFileType.value}`

    document.body.appendChild(link)
    link.click()
    link.remove()

    setTimeout(() => {
      window.URL.revokeObjectURL(objectUrl)
    }, 1000)
  } catch (downloadError) {
    console.error('Gagal mengunduh dokumen:', downloadError)
    window.open(rawUrl, '_blank', 'noopener,noreferrer')
  } finally {
    documentDownloading.value = false
  }
}

// ----------------------------------------------------------------
// SEO OPTIMIZATION LOGIC
// ----------------------------------------------------------------

const pageTitle = computed(() => {
  return pengumuman.value?.judul
    ? `${pengumuman.value.judul} - SD YWKA REL HOMY SCHOOL`
    : 'Detail Pengumuman - SD YWKA REL HOMY SCHOOL'
})

const pageDescription = computed(() => {
  if (!pengumuman.value) {
    return 'Pengumuman resmi dan informasi terbaru dari SD YWKA REL HOMY SCHOOL Bandung.'
  }

  const rawText =
    pengumuman.value.ringkasan ||
    pengumuman.value.isi_pengumuman ||
    ''

  const cleanText = rawText.replace(/<[^>]*>?/gm, '').trim()

  return cleanText.length > 160
    ? cleanText.substring(0, 157) + '...'
    : cleanText
})

const publishDate = computed(() => {
  return pengumuman.value
    ? (pengumuman.value.tanggal || pengumuman.value.tanggal_dibuat)
    : null
})

const canonicalUrl = computed(() => {
  return `https://sdywkabandung.sch.id/pengumuman/${pengumumanId}`
})

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogType: 'article',
  ogUrl: canonicalUrl,
  ogSiteName: 'SD YWKA REL HOMY SCHOOL',
  twitterCard: 'summary_large_image',
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
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
            'name': 'SD YWKA REL HOMY SCHOOL',
            'url': 'https://sdywkabandung.sch.id'
          },
          'publisher': {
            '@type': 'EducationalOrganization',
            'name': 'SD YWKA REL HOMY SCHOOL',
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

// Shortcut Keyboard ESC untuk Menutup Modal
if (process.client) {
  const handleEscape = (event) => {
    if (event.key === 'Escape' && showDocumentModal.value) {
      closeDocumentModal()
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleEscape)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleEscape)
  })
}
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
          class="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all cursor-pointer"
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

        <h2 class="text-2xl font-extrabold text-slate-900 mb-2">
          Gagal Memuat Pengumuman
        </h2>

        <p class="text-slate-500 text-sm mb-6">
          Dokumen yang Anda cari tidak ditemukan atau terjadi kesalahan pada server.
        </p>

        <NuxtLink 
          to="/pengumuman" 
          class="inline-flex items-center px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
        >
          Lihat Pengumuman Lainnya
        </NuxtLink>
      </div>

      <!-- Detail Card Pengumuman -->
      <article 
        v-else-if="pengumuman" 
        class="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden print:shadow-none print:border-none print:rounded-none"
      >
        <div :class="[
          'h-1.5 w-full',
          pengumuman.prioritas === 'Mendesak'
            ? 'bg-red-500'
            : pengumuman.prioritas === 'Penting'
              ? 'bg-amber-400'
              : 'bg-slate-900'
        ]"></div>

        <div class="p-6 sm:p-10 md:p-12">
          <header class="mb-6">
            <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
              <div class="flex flex-wrap items-center gap-2">
                <span :class="[
                  'px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider',
                  pengumuman.prioritas === 'Mendesak'
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : pengumuman.prioritas === 'Penting'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-slate-100 text-slate-800 border border-slate-200/80'
                ]">
                  {{ pengumuman.prioritas }}
                </span>

                <span class="bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1 rounded-lg border border-slate-200/80">
                  {{ pengumuman.kategori }}
                </span>
              </div>

              <time 
                :datetime="pengumuman.tanggal || pengumuman.tanggal_dibuat" 
                class="text-xs font-medium text-slate-500 flex items-center gap-1.5"
              >
                📅 {{ formatTanggalLengkap(pengumuman.tanggal || pengumuman.tanggal_dibuat) }}
              </time>
            </div>

            <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-6">
              {{ pengumuman.judul }}
            </h1>

            <div class="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm">
              <span class="text-slate-500">🎯 Ditujukan Untuk:</span>
              <span class="font-bold text-slate-800">
                {{ pengumuman.target || 'Seluruh Sivitas Akademika' }}
              </span>
            </div>
          </header>

          <section class="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-wrap space-y-4">
            {{ pengumuman.isi_pengumuman || pengumuman.ringkasan }}
          </section>

          <footer class="mt-12 pt-6 border-t border-slate-100 text-xs sm:text-sm text-slate-500 italic">
            Demikian pengumuman resmi ini kami sampaikan agar dapat menjadi perhatian bersama. Atas kerja sama Bapak/Ibu, kami ucapkan terima kasih.
            <br>
            <strong class="text-slate-800 not-italic block mt-2 font-bold">
              — Manajemen SD YWKA REL HOMY SCHOOL
            </strong>
          </footer>
        </div>

        <!-- Section Lampiran Berkas -->
        <section 
          v-if="pengumuman.lampiran" 
          class="bg-emerald-50/50 border-t border-emerald-100 p-6 sm:p-10 print:hidden"
        >
          <h2 class="text-xs font-bold text-emerald-800 mb-4 uppercase tracking-wider">
            Berkas Lampiran Tersedia
          </h2>

          <div class="bg-white border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div class="flex items-center gap-4">
              <div class="w-11 h-11 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center text-xl shrink-0">
                📄
              </div>

              <div>
                <p class="font-bold text-slate-800 text-sm">
                  {{ pengumuman.judul }} - Lampiran
                </p>

                <p class="text-xs text-emerald-600 font-medium mt-0.5 uppercase">
                  Dokumen Lampiran (.{{ docFileType }})
                </p>
              </div>
            </div>

            <!-- TOMBOL BUKA MODAL PRATINJAU DOKUMEN -->
            <button
              type="button"
              @click="openDocumentModal"
              class="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm w-full sm:w-auto cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <!-- SVG Icon telah diperbaiki dengan path heroicons yang valid -->
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>Lihat Dokumen</span>
            </button>
          </div>
        </section>

      </article>
    </main>

    <!-- =========================================================
         MODAL PREVIEW DOKUMEN (TELEPORT TO BODY)
         ========================================================= -->
    <Teleport to="body">
      <div
        v-if="showDocumentModal"
        class="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm"
        @click.self="closeDocumentModal"
      >
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-[1400px] h-[96vh] flex flex-col overflow-hidden">

          <!-- Modal Header -->
          <div class="shrink-0 flex items-center justify-between gap-4 px-4 sm:px-6 py-3 border-b border-slate-200 bg-white">
            <div class="min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="inline-flex items-center px-2.5 py-1 rounded-md bg-amber-50 text-amber-600 border border-amber-200 text-[10px] font-bold uppercase tracking-wider">
                  Pratinjau Dokumen
                </span>

                <span 
                  v-if="docFileType"
                  class="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-bold uppercase"
                >
                  {{ docFileType }}
                </span>
              </div>

              <h3 class="text-sm sm:text-base lg:text-lg font-bold text-slate-900 truncate">
                {{ pengumuman?.judul }} - Lampiran
              </h3>
            </div>

            <button
              type="button"
              @click="closeDocumentModal"
              class="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-2xl font-bold transition cursor-pointer"
              aria-label="Tutup modal"
              title="Tutup"
            >
              &times;
            </button>
          </div>

          <!-- Modal Body -->
          <div class="flex-1 min-h-0 bg-slate-100 p-2 sm:p-3 overflow-hidden">
            <div class="w-full h-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex items-center justify-center">

              <!-- State Loading -->
              <div
                v-if="documentLoading"
                class="flex flex-col items-center justify-center gap-3 text-slate-500 font-medium text-sm"
              >
                <div class="w-10 h-10 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>
                <span>Memuat isi dokumen...</span>
              </div>

              <template v-else-if="documentPreviewUrl">
                <!-- Preview PDF -->
                <iframe
                  v-if="docFileType === 'pdf'"
                  :src="`${documentPreviewUrl}#toolbar=0&navpanes=0&scrollbar=0`"
                  title="Pratinjau Dokumen PDF"
                  class="w-full h-full border-0"
                ></iframe>

                <!-- Preview Gambar (JPG, JPEG, PNG, WEBP) -->
                <div 
                  v-else-if="['jpg', 'jpeg', 'png', 'webp'].includes(docFileType)"
                  class="w-full h-full flex items-center justify-center bg-slate-50 p-3 sm:p-5 overflow-auto"
                >
                  <img 
                    :src="documentPreviewUrl" 
                    class="max-w-full max-h-full object-contain rounded-lg shadow-sm border border-slate-200 bg-white" 
                    alt="Pratinjau Dokumen"
                  />
                </div>

                <!-- Format File Tidak Didukung Pratinjau Langsung (Word / Docx / DLL) -->
                <div 
                  v-else 
                  class="w-full h-full flex flex-col items-center justify-center text-center px-6 sm:px-10 space-y-4 bg-slate-50"
                >
                  <div class="w-20 h-20 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-5xl">
                    📄
                  </div>

                  <div>
                    <h4 class="text-base text-slate-800 font-bold">
                      Format File (.{{ docFileType }}) Tidak Mendukung Pratinjau Langsung
                    </h4>

                    <p class="text-xs text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
                      Format file ini dapat diunduh untuk dibuka pada aplikasi pendukung di perangkat Anda.
                    </p>
                  </div>

                  <button 
                    type="button"
                    @click="downloadDocument" 
                    class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-md inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>⬇️ Unduh Dokumen</span>
                  </button>
                </div>
              </template>

              <!-- State Kosong / Error -->
              <div 
                v-else 
                class="w-full h-full flex flex-col items-center justify-center text-center px-6 bg-slate-50"
              >
                <div class="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-3xl">
                  📄
                </div>

                <h4 class="text-sm font-bold text-slate-800 mt-4">
                  Dokumen Tidak Dapat Ditampilkan
                </h4>

                <p class="text-xs text-slate-500 mt-1 max-w-sm">
                  Pratinjau dokumen tidak tersedia. Silakan gunakan tombol unduh file.
                </p>
              </div>

            </div>
          </div>

          <!-- Modal Footer -->
          <div class="shrink-0 border-t border-slate-200 bg-white px-4 sm:px-6 py-3">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div class="text-xs text-slate-400">
                Format:
                <strong class="uppercase text-slate-700">
                  {{ docFileType || 'Dokumen' }}
                </strong>
              </div>

              <div class="flex flex-wrap items-center justify-end gap-2">
                <!-- Buka Tab Baru -->
                <button 
                  type="button"
                  @click="openInNewTab" 
                  v-if="documentPreviewUrl"
                  class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  🔗 Buka Tab Baru
                </button>

                <!-- Tombol Unduh -->
                <button
                  type="button"
                  @click="downloadDocument"
                  :disabled="documentDownloading"
                  class="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition shadow-md shadow-amber-500/20 cursor-pointer disabled:cursor-not-allowed"
                >
                  <svg
                    v-if="!documentDownloading"
                    class="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14a2 2 0 002-2v-2M3 17v2a2 2 0 002 2"
                    />
                  </svg>

                  <svg
                    v-else
                    class="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>

                  <span>{{ documentDownloading ? 'Mengunduh...' : 'Unduh File' }}</span>
                </button>

                <!-- Tutup Modal -->
                <button
                  type="button"
                  @click="closeDocumentModal"
                  class="inline-flex items-center justify-center px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Teleport>

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