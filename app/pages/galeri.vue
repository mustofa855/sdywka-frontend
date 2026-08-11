<!-- FILE: pages/galeri.vue -->
<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

useHead({
  title: 'Galeri & Dokumentasi Kegiatan - SD YWKA Bandung',
  meta: [
    { name: 'description', content: 'Kumpulan foto dokumentasi prestasi, kegiatan pembelajaran, dan momen berharga siswa SD YWKA Bandung.' }
  ]
})

const config = useRuntimeConfig()
const BACKEND_URL = config.public.apiBase 

// Helper Resolve URL Gambar Media
const getImageUrl = (path) => {
  if (!path) return ''
  if (typeof path !== 'string') return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${BACKEND_URL}${path.startsWith('/') ? '' : '/'}${path}`
}

// State Utama
const activeContentType = ref('foto') // 'foto' | 'video'
const selectedCategory = ref('Semua')
const searchQuery = ref('')

// State Pagination
const currentPage = ref(1)
const itemsPerPage = 6

// Reset ke halaman 1 jika filter berubah
watch([selectedCategory, searchQuery, activeContentType], () => {
  currentPage.value = 1
})

// State Alur Galeri: Album Aktif & Lightbox Foto
const selectedAlbum = ref(null)
const selectedPhotoIndex = ref(null)

// Kategori List
const kategoriList = ['Semua', 'Prestasi & Lomba', 'MPLS & Orientasi', 'Keagamaan', 'Ekskul & Seni']

// Fetch data dari Backend Django
const { data: apiGaleri } = await useFetch(`${BACKEND_URL}/api/galeri/`)

// Data Fallback jika API Kosong / Down
const defaultAlbums = [
  {
    id: 'alb-001',
    judul: 'Juara 1 Turnamen Futsal Hermono Cup 2026',
    kategori: 'Prestasi & Lomba',
    tanggal: '2026-04-26',
    cover: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    deskripsi: 'Tim Futsal SD YWKA berhasil meraih Juara 1 pada ajang Turnamen Futsal Hermono Cup 2026 tingkat SD se-Kota Bandung.',
    foto: [
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517649763962-0c6232661c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 'alb-002',
    judul: 'Kegiatan MPLS Ramah Anak Hari Ke-1 SD YWKA',
    kategori: 'MPLS & Orientasi',
    tanggal: '2026-07-15',
    cover: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
    deskripsi: 'Masa Pengenalan Lingkungan Sekolah (MPLS) hari pertama diisi dengan perkenalan guru, tur keliling sekolah, dan ice breaking yang seru.',
    foto: [
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80'
    ]
  }
]

// Data Album Computed
const albumList = computed(() => {
  if (apiGaleri.value && apiGaleri.value.albums && Array.isArray(apiGaleri.value.albums)) {
    return apiGaleri.value.albums.map(item => ({
      id: item.id,
      judul: item.judul,
      kategori: item.kategori,
      tanggal: item.tanggal,
      cover: getImageUrl(item.cover),
      deskripsi: item.deskripsi,
      foto: item.fotos ? item.fotos.map(f => getImageUrl(typeof f === 'string' ? f : f.gambar)) : []
    }))
  }
  return defaultAlbums
})

// Data Video Computed
const videoList = computed(() => {
  if (apiGaleri.value && apiGaleri.value.videos && Array.isArray(apiGaleri.value.videos)) {
    return apiGaleri.value.videos
  }
  return [
    {
      id: 'vid-001',
      judul: 'Aftermath Video Highlight MPLS SD YWKA 2026',
      kategori: 'MPLS & Orientasi',
      tanggal: '2026-07-16',
      embed_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    }
  ]
})

// Computed Filtering Album
const filteredAlbums = computed(() => {
  return albumList.value.filter(item => {
    const matchCat = selectedCategory.value === 'Semua' || item.kategori === selectedCategory.value
    const matchSearch = !searchQuery.value || (item.judul && item.judul.toLowerCase().includes(searchQuery.value.toLowerCase()))
    return matchCat && matchSearch
  })
})

// Computed Total Halaman & Data Terpaginasi
const totalPages = computed(() => {
  return Math.ceil(filteredAlbums.value.length / itemsPerPage) || 1
})

const paginatedAlbums = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredAlbums.value.slice(start, start + itemsPerPage)
})

// Navigasi Pindah Halaman
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    if (typeof window !== 'undefined') {
      const el = document.getElementById('galeri-list-top')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      } else {
        window.scrollTo({ top: 300, behavior: 'smooth' })
      }
    }
  }
}

const formatTanggal = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// Navigasi Aksi Album & Lightbox
const openAlbum = (album) => {
  selectedAlbum.value = album
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 300, behavior: 'smooth' })
  }
}

const closeAlbum = () => {
  selectedAlbum.value = null
}

const openLightbox = (index) => {
  selectedPhotoIndex.value = index
}

const closeLightbox = () => {
  selectedPhotoIndex.value = null
}

const nextImage = () => {
  if (selectedAlbum.value && selectedAlbum.value.foto.length > 0) {
    selectedPhotoIndex.value = (selectedPhotoIndex.value + 1) % selectedAlbum.value.foto.length
  }
}

const prevImage = () => {
  if (selectedAlbum.value && selectedAlbum.value.foto.length > 0) {
    selectedPhotoIndex.value = (selectedPhotoIndex.value - 1 + selectedAlbum.value.foto.length) % selectedAlbum.value.foto.length
  }
}

// Navigasi Keyboard
const handleKeydown = (event) => {
  if (selectedPhotoIndex.value !== null && selectedAlbum.value) {
    if (event.key === 'ArrowRight') nextImage()
    else if (event.key === 'ArrowLeft') prevImage()
    else if (event.key === 'Escape') closeLightbox()
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<template>
  <div class="bg-slate-50 min-h-screen text-slate-800 pb-20">
    
    <!-- 1. HERO HEADER SECTION -->
    <section class="bg-slate-900 text-white py-12 md:py-16 border-b border-slate-800 relative overflow-hidden">
      <div class="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <span class="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-widest mb-3">
          📸 DOKUMENTASI & MOMEN
        </span>
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          GALERI <span class="text-amber-400">KEGIATAN</span>
        </h1>
        <p class="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mt-3 font-normal leading-relaxed">
          Rekam jejak prestasi, keceriaan peserta didik, serta ragam kegiatan edukatif di <span class="font-medium text-slate-100">SD YWKA Bandung</span>.
        </p>
      </div>
    </section>

    <!-- 2. TOOLBAR (TAB SWITCHER & FILTER) -->
    <section v-if="!selectedAlbum" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-20">
      <div class="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 space-y-4">
        
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <!-- Switcher Foto vs Video -->
          <div class="flex items-center bg-slate-100 p-1 rounded-xl w-full md:w-auto">
            <button 
              @click="activeContentType = 'foto'"
              :class="['flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2', activeContentType === 'foto' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900']"
            >
              📷 Album Foto ({{ albumList.length }})
            </button>
            <button 
              @click="activeContentType = 'video'"
              :class="['flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2', activeContentType === 'video' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900']"
            >
              🎬 Video Dokumentasi ({{ videoList.length }})
            </button>
          </div>

          <!-- Live Search Bar -->
          <div class="relative w-full md:w-80">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Cari album / kegiatan..."
              class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
            />
            <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <!-- Filter Category Chips -->
        <div v-if="activeContentType === 'foto'" class="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
          <span class="text-xs font-semibold text-slate-400 mr-2 uppercase tracking-wider">Kategori:</span>
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
        </div>

      </div>
    </section>

    <!-- 3. MAIN CONTENT SECTION -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <div id="galeri-list-top"></div>

      <!-- KONDISI A: TAMPILAN DETAIL ALBUM -->
      <div v-if="selectedAlbum" class="space-y-6">
        <div class="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <button 
            @click="closeAlbum"
            class="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 text-xs font-bold rounded-xl transition-all"
          >
            &larr; Kembali ke Daftar Album
          </button>
          <span class="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60">
            {{ selectedAlbum.kategori }}
          </span>
        </div>

        <div class="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-3">
          <p class="text-xs font-semibold text-slate-400">📅 {{ formatTanggal(selectedAlbum.tanggal) }}</p>
          <h2 class="text-2xl md:text-3xl font-extrabold text-slate-900">{{ selectedAlbum.judul }}</h2>
          <p class="text-sm text-slate-600 leading-relaxed max-w-4xl">{{ selectedAlbum.deskripsi }}</p>
        </div>

        <div>
          <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            📷 Foto Dokumentasi ({{ selectedAlbum.foto.length }} Foto) - Klik foto untuk memperbesar
          </h3>

          <div v-if="selectedAlbum.foto.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div 
              v-for="(fotoUrl, fIdx) in selectedAlbum.foto" 
              :key="fIdx"
              @click="openLightbox(fIdx)"
              class="aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer relative border border-slate-200/80"
            >
              <img 
                :src="fotoUrl" 
                :alt="`${selectedAlbum.judul} - ${fIdx + 1}`"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-95 group-hover:opacity-100"
              />
              <div class="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span class="bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5">
                  🔍 Perbesar Foto
                </span>
              </div>
            </div>
          </div>
          <div v-else class="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-sm">
            <p class="text-xs text-slate-500">Belum ada foto dalam album ini.</p>
          </div>
        </div>
      </div>

      <!-- KONDISI B: DAFTAR GRID UTAMA -->
      <div v-else>
        <!-- ALBUM FOTO GRID -->
        <div v-if="activeContentType === 'foto'">
          <div v-if="filteredAlbums.length > 0" class="space-y-8">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div 
                v-for="album in paginatedAlbums" 
                :key="album.id"
                @click="openAlbum(album)"
                class="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div class="relative aspect-video overflow-hidden bg-slate-900">
                    <img 
                      :src="album.cover || (album.foto && album.foto[0])" 
                      :alt="album.judul"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-95 group-hover:opacity-100"
                    />
                    <span class="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-amber-300 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-slate-700">
                      {{ album.kategori }}
                    </span>
                    <span class="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-md flex items-center gap-1.5">
                      📷 {{ album.foto ? album.foto.length : 0 }} Foto
                    </span>
                  </div>

                  <div class="p-5">
                    <p class="text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
                      📅 {{ formatTanggal(album.tanggal) }}
                    </p>
                    <h3 class="text-base font-bold text-slate-900 group-hover:text-slate-700 transition-colors line-clamp-2 leading-snug">
                      {{ album.judul }}
                    </h3>
                    <p class="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                      {{ album.deskripsi }}
                    </p>
                  </div>
                </div>

                <div class="px-5 pb-5 pt-0 flex items-center text-xs font-bold text-slate-900 group-hover:translate-x-1 transition-transform">
                  Buka Album &rarr;
                </div>
              </div>
            </div>

            <!-- KOMPONEN PAGINASI -->
            <div v-if="totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200/80">
              <p class="text-xs font-medium text-slate-500">
                Menampilkan <span class="font-bold text-slate-800">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> - 
                <span class="font-bold text-slate-800">{{ Math.min(currentPage * itemsPerPage, filteredAlbums.length) }}</span> 
                dari <span class="font-bold text-slate-800">{{ filteredAlbums.length }}</span> album
              </p>

              <div class="flex items-center gap-2">
                <button 
                  @click="goToPage(currentPage - 1)" 
                  :disabled="currentPage === 1"
                  class="px-3.5 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-900 hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-700 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-1"
                >
                  &larr; Prev
                </button>

                <div class="flex items-center gap-1">
                  <button
                    v-for="p in totalPages"
                    :key="p"
                    @click="goToPage(p)"
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
                  class="px-3.5 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-900 hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-700 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-1"
                >
                  Next &rarr;
                </button>
              </div>
            </div>
          </div>

          <div v-else class="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-sm my-6">
            <div class="text-3xl mb-2">🔍</div>
            <h3 class="font-bold text-slate-800">Album tidak ditemukan</h3>
            <p class="text-xs text-slate-500 mt-1">Coba ganti kata kunci pencarian atau kategori yang Anda pilih.</p>
          </div>
        </div>

        <!-- VIDEO DOKUMENTASI GRID -->
        <div v-else-if="activeContentType === 'video'">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="vid in videoList" :key="vid.id" class="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div class="aspect-video w-full bg-slate-900">
                <iframe 
                  :src="vid.embed_url || vid.embedUrl" 
                  class="w-full h-full"
                  frameborder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowfullscreen
                ></iframe>
              </div>
              <div class="p-5">
                <span class="text-[10px] font-bold uppercase bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200">
                  {{ vid.kategori }}
                </span>
                <h3 class="text-base font-bold text-slate-900 mt-2">{{ vid.judul }}</h3>
                <p class="text-xs text-slate-400 mt-1">📅 {{ formatTanggal(vid.tanggal) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>

    <!-- 4. LIGHTBOX MODAL FULLSCREEN -->
    <div v-if="selectedPhotoIndex !== null && selectedAlbum" class="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200">
      <div class="flex items-center justify-between text-white border-b border-slate-800 pb-4 max-w-7xl mx-auto w-full">
        <div>
          <span class="text-xs font-semibold text-amber-400 uppercase tracking-widest">{{ selectedAlbum.judul }}</span>
          <h3 class="text-base sm:text-lg font-bold leading-tight truncate max-w-md sm:max-w-2xl">Foto {{ selectedPhotoIndex + 1 }} dari {{ selectedAlbum.foto.length }}</h3>
        </div>
        
        <button @click="closeLightbox" class="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-colors">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="relative flex-1 flex items-center justify-center my-4 max-w-5xl mx-auto w-full">
        <button 
          v-if="selectedAlbum.foto.length > 1"
          @click="prevImage"
          class="absolute left-2 sm:left-4 z-10 p-3 bg-slate-900/80 hover:bg-amber-500 hover:text-slate-900 text-white rounded-full backdrop-blur-md transition-all shadow-lg"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <img 
          :src="selectedAlbum.foto[selectedPhotoIndex]" 
          :alt="selectedAlbum.judul"
          class="max-h-[65vh] sm:max-h-[75vh] w-auto object-contain rounded-2xl shadow-2xl border border-slate-800"
        />

        <button 
          v-if="selectedAlbum.foto.length > 1"
          @click="nextImage"
          class="absolute right-2 sm:right-4 z-10 p-3 bg-slate-900/80 hover:bg-amber-500 hover:text-slate-900 text-white rounded-full backdrop-blur-md transition-all shadow-lg"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div class="max-w-7xl mx-auto w-full space-y-3 text-center">
        <p class="text-xs text-slate-400 max-w-xl mx-auto">
          {{ selectedAlbum.deskripsi }}
        </p>
        <div class="flex items-center justify-center space-x-2">
          <span class="text-xs font-semibold text-amber-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
            Foto {{ selectedPhotoIndex + 1 }} / {{ selectedAlbum.foto.length }}
          </span>
        </div>
      </div>
    </div>

  </div>
</template>