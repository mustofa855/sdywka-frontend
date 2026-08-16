<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const config = useRuntimeConfig()
const BACKEND_URL = config.public.apiBase

// Fetch Data dari API Backend Django
const { data: daftarBerita } = await useFetch(`${BACKEND_URL}/api/berita/`)
const { data: daftarPengumuman } = await useFetch(`${BACKEND_URL}/api/pengumuman/`)
const { data: daftarGuru } = await useFetch(`${BACKEND_URL}/api/guru/`)
const { data: dataHero } = await useFetch(`${BACKEND_URL}/api/hero/`)
const { data: daftarEvent } = await useFetch(`${BACKEND_URL}/api/event/`)

// Helper URL Gambar
const dapatkanUrlGambar = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${BACKEND_URL}${path}`
}

// ==========================================
// KONFIGURASI SEO & META DATA (SEARCH ENGINE OPTIMIZATION)
// ==========================================
const seoTitle = 'SD YWKA REL HOMY SCHOOL - Sekolah Dasar Ramah Anak & Berakhlak Mulia'
const seoDescription = 'Official Website SD YWKA REL HOMY SCHOOL. Membentuk generasi cerdas, kreatif, dan berakhlak mulia melalui pendidikan berkualitas dan lingkungan belajar yang ramah anak.'

// Gambar thumbnail default untuk Open Graph (diambil dari hero slider pertama atau fallback)
const seoImage = computed(() => {
  if (dataHero.value && dataHero.value.length > 0 && dataHero.value[0].gambar) {
    return dapatkanUrlGambar(dataHero.value[0].gambar)
  }
  return '/images/og-default.jpg'
})

// Implementation Metadata SEO Nuxt 3
useSeoMeta({
  title: seoTitle,
  ogTitle: seoTitle,
  description: seoDescription,
  ogDescription: seoDescription,
  ogImage: () => seoImage.value,
  ogType: 'website',
  ogLocale: 'id_ID',
  twitterCard: 'summary_large_image',
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
  twitterImage: () => seoImage.value,
})

// Font & Schema Structured Data (JSON-LD untuk Google Search)
useHead({
  htmlAttrs: {
    lang: 'id'
  },
  link: [
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap' }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'EducationalOrganization',
        'name': 'SD YWKA REL HOMY SCHOOL',
        'description': seoDescription,
        'url': 'https://sdywkabandung.sch.id',
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': 'Bandung',
          'addressRegion': 'Jawa Barat',
          'addressCountry': 'ID'
        }
      })
    }
  ]
})

// Helper Format Tanggal Indonesia
const formatTanggal = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const getTanggalPenting = (dateStr, type = 'day') => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  if (type === 'day') return d.toLocaleDateString('id-ID', { day: '2-digit' })
  if (type === 'month') return d.toLocaleDateString('id-ID', { month: 'short' })
  return '-'
}

// ==========================================
// KODE HERO SECTION (PERTAHANKAN LOGIKANYA)
// ==========================================
const currentIndex = ref(0)
let slideInterval = null

const carouselItems = computed(() => {
  let welcomeSlide = {
    isWelcome: true,
    tag: 'Official Website',
    judul: 'SD YWKA REL HOMY SCHOOL',
    isi: 'Membentuk Generasi Cerdas, Kreatif, dan Berakhlak Mulia melalui pendidikan berkualitas dan lingkungan belajar yang ramah anak.',
    gambar: null, 
    link: '/profil',
    teksTombol: 'Mulai Mengenal Kami'
  }

  if (dataHero.value && dataHero.value.length > 0) {
    const hero = dataHero.value[0]
    welcomeSlide = {
      ...welcomeSlide,
      tag: hero.tag || welcomeSlide.tag,
      judul: hero.judul || welcomeSlide.judul,
      isi: hero.isi || welcomeSlide.isi,
      gambar: hero.gambar || null,
      link: hero.link || '/profil',
      teksTombol: hero.teks_tombol || 'Mulai Mengenal Kami'
    }
  }

  if (!daftarBerita.value || daftarBerita.value.length === 0) {
    return [welcomeSlide]
  }

  const newsSlides = daftarBerita.value.slice(0, 3).map(berita => ({
    isWelcome: false,
    tag: 'Berita Terkini',
    judul: berita.judul,
    isi: berita.isi,
    gambar: berita.gambar,
    link: `/berita/${berita.id}`,
    teksTombol: 'Baca Selengkapnya'
  }))

  return [welcomeSlide, ...newsSlides]
})

const nextSlide = () => {
  if (carouselItems.value && currentIndex.value < carouselItems.value.length - 1) {
    currentIndex.value++
  } else {
    currentIndex.value = 0 
  }
}

const prevSlide = () => {
  if (carouselItems.value && currentIndex.value > 0) {
    currentIndex.value--
  } else if (carouselItems.value) {
    currentIndex.value = carouselItems.value.length - 1
  }
}

onMounted(() => {
  slideInterval = setInterval(nextSlide, 7000)
})

onUnmounted(() => {
  if (slideInterval) clearInterval(slideInterval)
})

// ==========================================
// DATA COMPUTED SECTION LAINNYA
// ==========================================
// 1. Hot News & 3 Berita Terbaru
const hotNews = computed(() => {
  if (!daftarBerita.value || daftarBerita.value.length === 0) return null
  return daftarBerita.value.find(b => b.is_featured) || daftarBerita.value[0]
})

const beritaTerbaru = computed(() => {
  if (!daftarBerita.value) return []
  const filtered = daftarBerita.value.filter(b => b.id !== hotNews.value?.id)
  return (filtered.length > 0 ? filtered : daftarBerita.value).slice(0, 3)
})

// 2. 3 Event Mendatang
const eventAkanDatang = computed(() => {
  if (!daftarEvent.value) return []
  return daftarEvent.value.slice(0, 3)
})

// 3. Pengumuman Terbaru
const pengumumanTerbaru = computed(() => {
  if (!daftarPengumuman.value) return []
  return daftarPengumuman.value.slice(0, 3)
})

// 4. Data Guru (8 Orang)
const delapanGuru = computed(() => {
  if (!daftarGuru.value) return []
  return daftarGuru.value.slice(0, 8)
})
</script>

<template>
  <div class="bg-[#F8FAFC] min-h-screen pb-24 font-['Plus_Jakarta_Sans',sans-serif]">

    <!-- SECTION 1: HERO CAROUSEL MODERN -->
    <section class="w-full relative group">
      <div v-if="carouselItems && carouselItems.length > 0" class="relative w-full h-[85vh] min-h-[550px] max-h-[750px] overflow-hidden bg-slate-900">
        
        <!-- Background Slider -->
        <Transition name="fade">
          <div :key="'bg-' + currentIndex" class="absolute inset-0">
            <img 
              v-if="carouselItems[currentIndex].gambar" 
              :src="dapatkanUrlGambar(carouselItems[currentIndex].gambar)" 
              class="w-full h-full object-cover scale-105 animate-slow-zoom select-none pointer-events-none"
              :alt="carouselItems[currentIndex].judul || 'Slide Background SD YWKA'"
            />
            <div v-else class="w-full h-full bg-gradient-to-br from-blue-900 via-slate-800 to-slate-900"></div>
            
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-transparent"></div>
            <div class="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/40 to-transparent"></div>
          </div>
        </Transition>

        <!-- KONTEN SLIDE -->
        <div class="absolute inset-0 z-10 flex items-center justify-start w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 mt-8">
          <Transition name="slide-up" mode="out-in">
            <div :key="'content-' + currentIndex" class="w-full max-w-3xl">
              
              <!-- Badge -->
              <span 
                :class="carouselItems[currentIndex].isWelcome ? 'bg-blue-600 text-white' : 'bg-orange-500 text-white'"
                class="inline-flex items-center gap-2 text-xs md:text-sm font-bold px-4 py-1.5 rounded-full tracking-widest uppercase shadow-lg shadow-black/20 mb-4 md:mb-6"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                {{ carouselItems[currentIndex].tag }}
              </span>
              
              <!-- Judul H1 / H2 untuk SEO -->
              <h1 
                v-if="currentIndex === 0"
                class="font-extrabold text-white leading-tight md:leading-[1.1] mb-4 md:mb-6 drop-shadow-lg tracking-tight text-4xl md:text-5xl lg:text-6xl line-clamp-3"
              >
                {{ carouselItems[currentIndex].judul }}
              </h1>
              <h2 
                v-else
                class="font-extrabold text-white leading-tight md:leading-[1.1] mb-4 md:mb-6 drop-shadow-lg tracking-tight text-3xl md:text-4xl lg:text-5xl line-clamp-3"
              >
                {{ carouselItems[currentIndex].judul }}
              </h2>
              
              <!-- Deskripsi -->
              <p class="text-base md:text-lg lg:text-xl text-slate-300 mb-8 md:mb-10 line-clamp-3 leading-relaxed font-medium">
                {{ carouselItems[currentIndex].isi }}
              </p>
              
              <!-- Tombol Utama -->
              <div class="block">
                <NuxtLink 
                  :to="carouselItems[currentIndex].link" 
                  :class="carouselItems[currentIndex].isWelcome ? 'bg-white text-blue-700 hover:bg-slate-50' : 'bg-blue-600 text-white hover:bg-blue-700'"
                  class="inline-flex items-center justify-center px-8 py-3.5 rounded-full font-bold text-sm md:text-base transition-all duration-300 shadow-xl hover:-translate-y-1 hover:shadow-2xl"
                >
                  {{ carouselItems[currentIndex].teksTombol }}
                </NuxtLink>
              </div>

            </div>
          </Transition>
        </div>

        <!-- Glassmorphism Navigasi -->
        <button @click="prevSlide" aria-label="Slide Sebelumnya" class="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
          <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button @click="nextSlide" aria-label="Slide Selanjutnya" class="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
          <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </button>
        
        <!-- Indikator Dinamis -->
        <div class="absolute bottom-6 left-0 right-0 flex justify-center space-x-2.5 z-20">
          <button 
            v-for="(_, index) in carouselItems" 
            :key="index"
            @click="currentIndex = index"
            :class="currentIndex === index ? 'w-10 bg-blue-500' : 'w-2.5 bg-white/40 hover:bg-white/70'"
            class="h-2.5 rounded-full transition-all duration-500 ease-out shadow-sm"
            :aria-label="`Pilih slide ${index + 1}`"
          ></button>
        </div>
      </div>
    </section>

    <!-- SECTION 2: HOT NEWS & 3 BERITA TERBARU -->
    <section class="max-w-7xl mx-auto px-6 mt-16 md:mt-20">
      <div class="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
        <div>
          <span class="text-xs font-extrabold text-blue-600 uppercase tracking-widest block mb-1">Kabar Sekolah</span>
          <h2 class="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">Berita & Informasi Terkini</h2>
        </div>
        <NuxtLink to="/berita" class="group flex items-center text-blue-600 font-bold hover:text-blue-700 transition-colors">
          Lihat Semua Berita
          <svg class="w-5 h-5 ml-1.5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- KIRI: HOT NEWS / FEATURED ARTICLE (7 COLS) -->
        <div v-if="hotNews" class="lg:col-span-7 flex flex-col">
          <article class="bg-white rounded-3xl border border-slate-100 shadow-lg overflow-hidden flex flex-col h-full group hover:shadow-xl transition-all duration-300">
            <div class="relative h-64 md:h-80 overflow-hidden bg-slate-900">
              <img 
                v-if="hotNews.gambar" 
                :src="dapatkanUrlGambar(hotNews.gambar)" 
                :alt="hotNews.judul" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div v-else class="w-full h-full bg-gradient-to-br from-blue-700 to-slate-900 flex items-center justify-center text-white text-lg font-bold">
                SD YWKA REL HOMY SCHOOL
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              
              <!-- Badge Hot News -->
              <div class="absolute top-4 left-4 flex gap-2">
                <span class="bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md animate-pulse">
                  🔥 Hot News
                </span>
                <span class="bg-blue-600/90 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {{ hotNews.kategori }}
                </span>
              </div>

              <div class="absolute bottom-4 left-4 right-4 text-slate-200 text-xs flex items-center gap-4">
                <time :datetime="hotNews.tanggal_upload">{{ formatTanggal(hotNews.tanggal_upload) }}</time>
                <span>{{ hotNews.penulis_nama || 'Humas YWKA' }}</span>
              </div>
            </div>

            <div class="p-6 md:p-8 flex flex-col flex-grow justify-between">
              <div>
                <h3 class="text-xl md:text-2xl font-extrabold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors leading-snug">
                  {{ hotNews.judul }}
                </h3>
                <p class="text-slate-600 text-sm md:text-base line-clamp-3 leading-relaxed mb-6">
                  {{ hotNews.ringkasan || hotNews.isi }}
                </p>
              </div>

              <NuxtLink 
                :to="`/berita/${hotNews.id}`" 
                class="inline-flex items-center text-blue-600 font-bold text-sm hover:text-blue-800 transition-colors"
              >
                Baca Artikel Selengkapnya
                <svg class="w-4 h-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </NuxtLink>
            </div>
          </article>
        </div>

        <!-- KANAN: 3 BERITA TERBARU LAINNYA (5 COLS) -->
        <div class="lg:col-span-5 flex flex-col gap-4">
          <article 
            v-for="item in beritaTerbaru" 
            :key="item.id"
            class="bg-white p-4 md:p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300 flex gap-4 items-center group"
          >
            <div class="w-24 h-24 md:w-28 md:h-28 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100 relative">
              <img 
                v-if="item.gambar" 
                :src="dapatkanUrlGambar(item.gambar)" 
                :alt="item.judul" 
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div v-else class="w-full h-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                YWKA
              </div>
            </div>

            <div class="flex-grow min-w-0">
              <div class="flex items-center gap-2 mb-1.5">
                <span class="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md uppercase">
                  {{ item.kategori }}
                </span>
                <time :datetime="item.tanggal_upload" class="text-[11px] text-slate-400 font-medium">
                  {{ formatTanggal(item.tanggal_upload) }}
                </time>
              </div>

              <h3 class="text-sm md:text-base font-bold text-slate-800 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
                {{ item.judul }}
              </h3>

              <NuxtLink 
                :to="`/berita/${item.id}`" 
                class="text-xs font-semibold text-slate-500 group-hover:text-blue-600 transition-colors flex items-center mt-2"
              >
                Baca selengkapnya &rarr;
              </NuxtLink>
            </div>
          </article>
        </div>

      </div>
    </section>

    <!-- SECTION 3: 3 EVENT / AGENDA MENDATANG -->
    <section class="max-w-7xl mx-auto px-6 mt-20">
      <div class="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
        <div class="absolute -right-10 -bottom-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="flex flex-col md:flex-row md:justify-between md:items-end mb-10 gap-4 relative z-10">
          <div>
            <span class="text-xs font-extrabold text-amber-400 uppercase tracking-widest block mb-1">Agenda Sekolah</span>
            <h2 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Event & Kegiatan Mendatang</h2>
          </div>
          <NuxtLink to="/agenda" class="inline-flex items-center text-amber-400 hover:text-amber-300 font-bold text-sm transition-colors">
            Lihat Kalender Agenda
            <svg class="w-4 h-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </NuxtLink>
        </div>

        <div v-if="eventAkanDatang.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <div 
            v-for="event in eventAkanDatang" 
            :key="event.id"
            class="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:bg-white/15 transition-all duration-300 group"
          >
            <div>
              <div class="flex justify-between items-start mb-4">
                <!-- Tanggal Badge -->
                <div class="bg-amber-400 text-slate-900 rounded-xl px-3 py-1.5 text-center font-extrabold min-w-[55px]">
                  <span class="block text-lg leading-none">{{ getTanggalPenting(event.tanggal_mulai, 'day') }}</span>
                  <span class="block text-[10px] uppercase font-bold text-slate-800 mt-0.5">{{ getTanggalPenting(event.tanggal_mulai, 'month') }}</span>
                </div>
                <!-- Status Badge -->
                <span class="text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30">
                  {{ event.status }}
                </span>
              </div>

              <span class="text-xs text-amber-300 font-bold uppercase tracking-wider block mb-1">{{ event.kategori }}</span>
              <h3 class="text-lg font-bold text-white mb-3 group-hover:text-amber-300 transition-colors line-clamp-2">
                {{ event.judul }}
              </h3>
              
              <div class="space-y-1.5 text-xs text-slate-300 mb-6">
                <p class="flex items-center gap-2">
                  <span>⏰</span> {{ event.waktu }}
                </p>
                <p class="flex items-center gap-2">
                  <span>📍</span> {{ event.lokasi }}
                </p>
              </div>
            </div>

            <NuxtLink 
              to="/agenda" 
              class="w-full py-2.5 rounded-xl bg-white/10 hover:bg-amber-400 hover:text-slate-900 text-white font-bold text-xs text-center transition-all duration-300 border border-white/10"
            >
              Detail Acara
            </NuxtLink>
          </div>
        </div>

        <div v-else class="text-center py-12 text-slate-400 text-sm">
          Belum ada jadwal event mendatang saat ini.
        </div>

      </div>
    </section>

    <!-- SECTION 4: PENGUMUMAN RESMI -->
    <section class="max-w-5xl mx-auto px-6 mt-20">
      <div class="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
        <div>
          <span class="text-xs font-extrabold text-blue-600 uppercase tracking-widest block mb-1">Informasi Resmi</span>
          <h2 class="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">Pengumuman Terbaru</h2>
        </div>
        <NuxtLink to="/pengumuman" class="group flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors">
          Lihat Semua
          <svg class="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </NuxtLink>
      </div>
      
      <div class="flex flex-col gap-4">
        <article 
          v-for="pengumuman in pengumumanTerbaru" 
          :key="pengumuman.id"
          class="group bg-white rounded-2xl p-5 md:p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col md:flex-row gap-5 md:items-center relative overflow-hidden"
        >
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 transform scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom"></div>
          
          <div class="flex-shrink-0 bg-blue-50/50 rounded-xl p-3 text-center min-w-[80px] border border-blue-50">
            <span class="block text-2xl font-black text-blue-600 leading-none">
              {{ getTanggalPenting(pengumuman.tanggal || pengumuman.tanggal_dibuat, 'day') }}
            </span>
            <span class="block text-xs font-bold text-slate-500 uppercase mt-1">
              {{ getTanggalPenting(pengumuman.tanggal || pengumuman.tanggal_dibuat, 'month') }}
            </span>
          </div>

          <div class="flex-grow">
            <div class="flex items-center gap-2 mb-1">
              <span 
                :class="{
                  'bg-red-100 text-red-700': pengumuman.prioritas === 'Mendesak',
                  'bg-amber-100 text-amber-800': pengumuman.prioritas === 'Penting',
                  'bg-blue-100 text-blue-700': pengumuman.prioritas === 'Biasa'
                }"
                class="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase"
              >
                {{ pengumuman.prioritas || 'Informasi' }}
              </span>
              <span class="text-xs font-medium text-slate-400">Target: {{ pengumuman.target || 'Umum' }}</span>
            </div>

            <h3 class="text-lg font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{{ pengumuman.judul }}</h3>
            <p class="text-slate-500 text-sm line-clamp-2 md:line-clamp-1 leading-relaxed">{{ pengumuman.ringkasan || pengumuman.isi_pengumuman }}</p>
          </div>

          <NuxtLink :to="`/pengumuman`" class="flex-shrink-0 inline-flex items-center justify-center md:justify-end text-sm font-bold text-blue-600 group-hover:text-blue-700">
            <span>Detail</span>
            <svg class="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </NuxtLink>
        </article>
      </div>
    </section>

    <!-- SECTION 5: DATA GURU & TENAGA PENDIDIK (8 GURU) -->
    <section class="max-w-7xl mx-auto px-6 mt-24">
      <div class="text-center mb-12">
        <span class="text-xs font-extrabold text-orange-500 tracking-widest uppercase mb-2 block">Profil SD YWKA</span>
        <h2 class="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">Tenaga Pendidik & Kependidikan</h2>
        <p class="text-slate-500 mt-2 text-sm max-w-xl mx-auto">Guru dan staf berpengalaman yang siap membimbing siswa menjadi pribadi yang berakhlak mulia dan berprestasi.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div 
          v-for="guru in delapanGuru" 
          :key="guru.id"
          class="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:-translate-y-1.5 hover:shadow-[0_12px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 text-center group flex flex-col justify-between"
        >
          <div>
            <!-- Foto Avatar Guru -->
            <div class="relative w-24 h-24 mx-auto mb-4">
              <div class="absolute inset-0 bg-blue-100 rounded-full scale-105 group-hover:bg-blue-200 transition-colors"></div>
              
              <img 
                v-if="guru.foto" 
                :src="dapatkanUrlGambar(guru.foto)" 
                :alt="`Foto ${guru.nama}`"
                class="relative w-full h-full object-cover rounded-full shadow-md border-2 border-white"
              />
              <div 
                v-else 
                class="relative w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-md"
              >
                {{ guru.nama ? guru.nama.charAt(0) : 'G' }}
              </div>
            </div>

            <!-- Nama & Gelar -->
            <h3 class="text-base font-extrabold text-slate-800 mb-0.5 line-clamp-1">
              {{ guru.nama }}{{ guru.gelar ? `, ${guru.gelar}` : '' }}
            </h3>
            
            <!-- Jabatan -->
            <p class="text-xs font-semibold text-blue-600 mb-3 line-clamp-1">{{ guru.jabatan }}</p>

            <!-- Tag Mapel / Bidang -->
            <div 
              v-if="guru.mapel && guru.mapel.trim() !== ''" 
              class="inline-flex items-center px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[11px] font-medium text-slate-600 max-w-full truncate"
            >
              <svg class="w-3 h-3 mr-1 text-orange-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span class="truncate">{{ guru.mapel }}</span>
            </div>
          </div>

          <!-- Motto Singkat (Jika Ada) -->
          <p v-if="guru.motto" class="mt-4 text-[11px] text-slate-400 italic line-clamp-2">
            "{{ guru.motto }}"
          </p>
        </div>
      </div>

      <div class="text-center mt-12">
        <NuxtLink to="/guru" class="inline-flex items-center justify-center px-8 py-3.5 rounded-full border-2 border-blue-100 text-blue-600 font-bold hover:bg-blue-50 transition-colors">
          Lihat Seluruh Tenaga Pendidik
        </NuxtLink>
      </div>
    </section>

  </div>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s ease-out;
}
.slide-up-enter-from {
  transform: translateY(15px);
  opacity: 0;
}
.slide-up-leave-to {
  transform: translateY(-15px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes slowZoom {
  0% { transform: scale(1); }
  100% { transform: scale(1.08); }
}
.animate-slow-zoom {
  animation: slowZoom 25s ease-out forwards;
}
</style>