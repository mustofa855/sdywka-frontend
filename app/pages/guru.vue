<!-- FILE: pages/guru.vue -->
<script setup>
import { ref, computed } from 'vue'

useHead({
  title: 'Guru dan Staf - SD YWKA REL HOMY SCHOOL Bandung',
  meta: [
    { name: 'description', content: 'Daftar Tenaga Pendidik dan Kependidikan SD YWKA REL HOMY SCHOOL Bandung yang profesional, kompeten, dan berdedikasi.' }
  ]
})

const config = useRuntimeConfig()
const BACKEND_URL = config.public.apiBase 

// Fetch Data Guru
const { data: daftarGuruRaw, pending, error } = await useFetch(`${BACKEND_URL}/api/guru/`)
const daftarGuru = computed(() => daftarGuruRaw.value || [])

// Filter & Search State
const searchQuery = ref('')
const selectedCategory = ref('Semua')

// Modal State
const isModalOpen = ref(false)
const selectedGuru = ref(null)

const kategoriList = ref([
  'Semua', 'Pimpinan', 'Wali Kelas', 'Guru Mata Pelajaran', 'Tahsin & Tahfidz', 'Staf & TU'
])

const statistikSdm = ref([
  { label: 'Tenaga Pendidik', value: '25+', icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z' },
  { label: 'Kualifikasi S1 & S2', value: '100%', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z' },
  { label: 'Pengajar Tahsin / Tahfidz', value: 'Bersertifikat', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { label: 'Rasio Guru : Siswa', value: '1 : 15', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' }
])

// Penanganan Safe Filtering agar tidak crash jika terdapat atribut bernilai null
const filteredGuru = computed(() => {
  return daftarGuru.value.filter(guru => {
    const matchCategory = selectedCategory.value === 'Semua' || guru.kategori === selectedCategory.value
    const query = searchQuery.value.toLowerCase().trim()
    
    const matchSearch = !query || 
      (guru.nama && guru.nama.toLowerCase().includes(query)) ||
      (guru.jabatan && guru.jabatan.toLowerCase().includes(query)) ||
      (guru.mapel && guru.mapel.toLowerCase().includes(query)) ||
      (guru.asal_kampus && guru.asal_kampus.toLowerCase().includes(query))

    return matchCategory && matchSearch
  })
})

const getImageUrl = (foto) => {
  if (!foto) return null
  if (foto.startsWith('http://') || foto.startsWith('https://')) return foto
  return `${BACKEND_URL}${foto.startsWith('/') ? '' : '/'}${foto}`
}

const getInitials = (name) => {
  if (!name) return 'YW'
  const cleanName = name.replace(/[^a-zA-Z\s]/g, '').trim()
  if (!cleanName) return 'YW'
  const parts = cleanName.split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return parts[0].substring(0, 2).toUpperCase()
}

// Buka Tutup Modal
const openDetailModal = (guru) => {
  selectedGuru.value = guru
  isModalOpen.value = true
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden' 
  }
}

const closeDetailModal = () => {
  isModalOpen.value = false
  setTimeout(() => { selectedGuru.value = null }, 300)
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'auto'
  }
}
</script>

<template>
  <div class="bg-slate-50 min-h-screen text-slate-800 pb-20">
    
    <!-- 1. HERO HEADER SECTION -->
    <section class="bg-slate-900 text-white py-12 md:py-16 border-b border-slate-800 relative overflow-hidden">
      <div class="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <span class="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-widest mb-3">
          👥 SDM & TENAGA PENDIDIK
        </span>
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          GURU DAN STAF <span class="text-amber-400">SD YWKA</span>
        </h1>
        <p class="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mt-3 font-normal leading-relaxed">
          Mengenal para pendidik berdedikasi tinggi yang siap membimbing, mendidik, dan menginspirasi putra-putri Anda dalam suasana <span class="font-medium text-slate-100">REL HOMY</span>.
        </p>
      </div>
    </section>

    <!-- 2. FLOATING STATISTICS -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-20 mb-8">
      <div class="bg-white rounded-2xl shadow-sm p-5 sm:p-6 flex flex-wrap md:flex-nowrap justify-between gap-6 border border-slate-200/80">
        <div v-for="(stat, idx) in statistikSdm" :key="idx" class="flex items-center gap-4 w-full md:w-auto">
          <div class="w-11 h-11 bg-slate-100 text-slate-800 rounded-xl flex items-center justify-center border border-slate-200/60 shadow-sm shrink-0">
            <svg class="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="stat.icon" />
            </svg>
          </div>
          <div>
            <div class="text-xl md:text-2xl font-extrabold text-slate-900">{{ stat.value }}</div>
            <div class="text-xs text-slate-500 font-medium">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 3. SEARCH & FILTER TOOLBAR -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <div class="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 space-y-4 mb-8">
        <div class="relative max-w-2xl mx-auto">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Cari nama guru, jabatan, atau mata pelajaran..." 
            class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all" 
          />
          <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-slate-100">
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

      <p class="text-slate-500 mb-6 text-xs sm:text-sm font-semibold">
        Menampilkan <strong class="text-slate-900 font-bold">{{ filteredGuru.length }}</strong> tenaga pendidik & kependidikan
      </p>

      <!-- 4. GRID DAFTAR GURU & STAF -->
      <div v-if="filteredGuru.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="guru in filteredGuru" 
          :key="guru.id" 
          class="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
          @click="openDetailModal(guru)"
        >
          <div>
            <div class="h-1.5 bg-slate-200 group-hover:bg-amber-400 transition-colors"></div>
            
            <div class="p-6 text-center">
              <div class="relative w-28 h-28 mx-auto mb-4 rounded-full p-1 bg-slate-100 group-hover:bg-amber-300 transition-colors shadow-inner">
                <img v-if="guru.foto" :src="getImageUrl(guru.foto)" :alt="guru.nama" class="w-full h-full object-cover rounded-full" />
                <div v-else class="w-full h-full rounded-full bg-slate-900 text-amber-300 font-extrabold text-2xl flex items-center justify-center">{{ getInitials(guru.nama) }}</div>
              </div>

              <h3 class="text-base font-bold text-slate-900 leading-snug group-hover:text-slate-700 transition-colors">
                {{ guru.nama }}{{ guru.gelar ? `, ${guru.gelar}` : '' }}
              </h3>

              <div class="mt-2">
                <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/80">
                  {{ guru.jabatan }}
                </span>
              </div>

              <p v-if="guru.mapel" class="text-xs font-medium text-slate-500 mt-3 flex items-center justify-center">
                {{ guru.mapel }}
              </p>
            </div>
          </div>

          <div class="bg-slate-50 p-3 border-t border-slate-100 text-center group-hover:bg-slate-100 transition-colors">
            <span class="text-xs font-bold text-slate-900 flex items-center justify-center gap-1">
              Lihat Profil Detail
              <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      <div v-else class="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-sm my-6">
        <div class="text-3xl mb-2">🔍</div>
        <h3 class="font-bold text-slate-800">Guru / Staf tidak ditemukan</h3>
        <p class="text-xs text-slate-500 mt-1">Coba sesuaikan kata kunci pencarian atau kategori yang dipilih.</p>
      </div>
    </section>

    <!-- 5. MODAL DETAIL GURU -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6">
        <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" @click="closeDetailModal"></div>
        
        <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden transform transition-all flex flex-col max-h-[90vh] z-10 border border-slate-200">
          
          <button @click="closeDetailModal" class="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-white/70 hover:bg-white text-slate-500 hover:text-slate-900 rounded-full backdrop-blur-md transition-colors shadow-sm">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <div class="relative bg-slate-900 pt-12 pb-16 px-6 text-center">
            <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px]"></div>
            <div class="relative z-10 w-24 h-24 mx-auto rounded-full p-1 bg-white shadow-md mb-[-4rem]">
              <img v-if="selectedGuru?.foto" :src="getImageUrl(selectedGuru.foto)" alt="Foto" class="w-full h-full object-cover rounded-full" />
              <div v-else class="w-full h-full rounded-full bg-slate-100 text-slate-700 font-bold text-2xl flex items-center justify-center border border-slate-200">
                {{ getInitials(selectedGuru?.nama) }}
              </div>
            </div>
          </div>

          <div class="pt-16 pb-6 px-6 sm:px-8 overflow-y-auto">
            <div class="text-center mb-6">
              <h2 class="text-2xl font-extrabold text-slate-900">
                {{ selectedGuru?.nama }}{{ selectedGuru?.gelar ? `, ${selectedGuru.gelar}` : '' }}
              </h2>
              <span class="inline-block px-3 py-1 mt-2 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                {{ selectedGuru?.jabatan }}
              </span>
            </div>

            <div class="space-y-4">
              <div v-if="selectedGuru?.asal_kampus || selectedGuru?.pendidikan_terakhir" class="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 border-b border-slate-200 pb-2">Latar Belakang Akademik</h4>
                <div class="space-y-2">
                  <div class="flex justify-between items-start text-sm">
                    <span class="text-slate-500">Pendidikan</span>
                    <span class="font-semibold text-slate-800 text-right">{{ selectedGuru?.pendidikan_terakhir || '-' }}</span>
                  </div>
                  <div class="flex justify-between items-start text-sm">
                    <span class="text-slate-500">Asal Kampus</span>
                    <span class="font-semibold text-slate-800 text-right">{{ selectedGuru?.asal_kampus || '-' }}</span>
                  </div>
                </div>
              </div>

              <div class="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 border-b border-slate-200 pb-2">Informasi Tugas</h4>
                <div class="space-y-2">
                  <div class="flex justify-between items-start text-sm">
                    <span class="text-slate-500">Mata Pelajaran</span>
                    <span class="font-medium text-slate-800 text-right">{{ selectedGuru?.mapel || '-' }}</span>
                  </div>
                  <div class="flex justify-between items-start text-sm">
                    <span class="text-slate-500">Kategori</span>
                    <span class="font-medium text-slate-800 text-right">{{ selectedGuru?.kategori || '-' }}</span>
                  </div>
                </div>
              </div>

              <div v-if="selectedGuru?.motto" class="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200/60 text-center relative">
                <p class="text-sm font-medium text-amber-900 italic relative z-10 px-4">
                  "{{ selectedGuru.motto }}"
                </p>
              </div>
            </div>
          </div>
          
          <div class="bg-slate-50 p-4 border-t border-slate-100 text-center">
            <button @click="closeDetailModal" class="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors">
              Tutup
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>