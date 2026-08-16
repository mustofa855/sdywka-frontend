<template>
  <div class="bg-slate-50 min-h-screen font-sans text-slate-800 flex flex-col items-center relative">
    
    <!-- 1. INDIKATOR LOADING ATAS SAAT PINDAH HALAMAN / JARINGAN LEMOT -->
    <div v-if="isNavigating" class="fixed top-0 left-0 right-0 z-50 h-1 bg-blue-100 overflow-hidden">
      <div class="h-full bg-blue-600 animate-pulse rounded-full w-full"></div>
    </div>

    <!-- FLOATING BADGE INDIKATOR NAVIGASI -->
    <div 
      v-if="isNavigating" 
      class="fixed top-4 right-4 z-50 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-2 rounded-full shadow-lg flex items-center gap-2 animate-bounce"
    >
      <svg class="animate-spin h-3.5 w-3.5 text-blue-400" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>Memuat Halaman...</span>
    </div>

    <!-- Area Konten Utama -->
    <div class="w-full max-w-xl md:max-w-3xl lg:max-w-4xl pb-32 min-h-screen bg-slate-50 shadow-sm">
      <slot />
    </div>

    <!-- Hidden File Input untuk Tombol Posting Foto (Mendukung iPhone/HEIC) -->
    <input 
      type="file" 
      ref="postFileInputRef" 
      @change="handlePhotoSelected" 
      accept="image/png, image/jpeg, image/jpg, image/heic, image/heif, image/*" 
      class="hidden" 
    />

    <!-- Bottom Navigation Bar (Dikunci saat isNavigating untuk Mencegah Spam Klik) -->
    <nav 
      class="fixed bottom-0 w-full max-w-xl md:max-w-3xl lg:max-w-4xl bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_25px_-5px_rgba(0,0,0,0.1)] z-40 rounded-t-2xl px-3 py-2 left-1/2 -translate-x-1/2 transition-all"
      :class="{ 'pointer-events-none opacity-90': isNavigating }"
    >
      <div class="flex justify-around items-center">
        <!-- Menu Beranda -->
        <NuxtLink 
          to="/user" 
          class="flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all duration-200"
          :class="isHomeActive ? 'text-blue-700 font-bold bg-blue-50 shadow-sm' : 'text-slate-400 hover:text-slate-600'"
        >
          <svg v-if="targetRoute !== '/user'" class="w-6 h-6" :class="isHomeActive ? 'stroke-[2.5]' : 'stroke-2'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
          <svg v-else class="animate-spin w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-[10px]">Beranda</span>
        </NuxtLink>

        <!-- Menu Guru -->
        <NuxtLink 
          to="/user/gurustaf" 
          class="flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all duration-200"
          :class="isGuruActive ? 'text-blue-700 font-bold bg-blue-50 shadow-sm' : 'text-slate-400 hover:text-slate-600'"
        >
          <svg v-if="!targetRoute.startsWith('/user/gurustaf')" class="w-6 h-6" :class="isGuruActive ? 'stroke-[2.5]' : 'stroke-2'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          <svg v-else class="animate-spin w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-[10px]">Guru</span>
        </NuxtLink>

        <!-- TOMBOL POSTING FOTO -->
        <button 
          @click="triggerPostPicker" 
          :disabled="isNavigating"
          class="flex flex-col items-center justify-center bg-blue-600 hover:bg-blue-700 active:scale-95 text-white p-3 rounded-2xl shadow-lg shadow-blue-500/30 transition-all -mt-5 disabled:opacity-60 disabled:cursor-not-allowed"
          title="Buat Postingan Foto"
        >
          <svg class="w-6 h-6 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path>
          </svg>
        </button>

        <!-- Menu Galeri -->
        <NuxtLink 
          to="/user/galeri" 
          class="flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all duration-200"
          :class="isGaleriActive ? 'text-blue-700 font-bold bg-blue-50 shadow-sm' : 'text-slate-400 hover:text-slate-600'"
        >
          <svg v-if="!targetRoute.startsWith('/user/galeri')" class="w-6 h-6" :class="isGaleriActive ? 'stroke-[2.5]' : 'stroke-2'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <svg v-else class="animate-spin w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-[10px]">Galeri</span>
        </NuxtLink>

        <!-- Menu Profil -->
        <NuxtLink 
          to="/user/profil" 
          class="flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all duration-200"
          :class="isProfilActive ? 'text-blue-700 font-bold bg-blue-50 shadow-sm' : 'text-slate-400 hover:text-slate-600'"
        >
          <svg v-if="!targetRoute.startsWith('/user/profil')" class="w-6 h-6" :class="isProfilActive ? 'stroke-[2.5]' : 'stroke-2'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          <svg v-else class="animate-spin w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-[10px]">Profil</span>
        </NuxtLink>
      </div>
    </nav>

    <!-- MODAL POSTING FOTO -->
    <div v-if="isUploadModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-4 overflow-hidden">
      <div class="bg-white rounded-3xl max-w-sm sm:max-w-md w-full shadow-2xl flex flex-col max-h-[85vh] my-auto overflow-hidden border border-slate-100 relative">
        
        <!-- OVERLAY LOADING POSTING (Ketik User Klik 'Bagikan') -->
        <div v-if="isSubmittingPost" class="absolute inset-0 z-20 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-6 text-center animate-fade-in">
          <div class="relative flex items-center justify-center">
            <div class="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
            <svg class="w-5 h-5 text-blue-600 absolute" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <div>
            <h4 class="text-sm font-bold text-slate-900">Mengunggah Kiriman...</h4>
            <p class="text-xs text-slate-500 mt-1">Mohon tunggu sebentar, file Anda sedang dikirim ke server.</p>
          </div>
        </div>

        <!-- Header -->
        <div class="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
          <h3 class="text-sm font-bold text-slate-800">Buat Kiriman Baru</h3>
          <button 
            @click="cancelPostModal" 
            :disabled="isSubmittingPost"
            class="text-slate-400 hover:text-slate-600 p-1 rounded-lg disabled:opacity-40"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="p-4 space-y-3 overflow-y-auto flex-1 min-h-0">
          <div class="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 flex items-center justify-center max-h-[220px] sm:max-h-[260px] w-full min-h-[160px]">
            <!-- Spinner saat mengonversi HEIC -->
            <div v-if="isConvertingHeic" class="flex flex-col items-center gap-2 text-white p-4">
              <svg class="animate-spin h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="text-xs font-medium">Memproses foto iPhone...</span>
            </div>

            <img v-else-if="previewImage" :src="previewImage" class="max-h-[220px] sm:max-h-[260px] w-full object-contain" />
            
            <button 
              v-if="!isConvertingHeic && !isSubmittingPost"
              @click="triggerPostPicker" 
              class="absolute top-2 right-2 bg-black/75 hover:bg-black text-white text-[10px] font-semibold px-3 py-1.5 rounded-full backdrop-blur-md transition shadow-sm"
            >
              Ganti
            </button>
          </div>

          <!-- Input Caption -->
          <div>
            <textarea 
              v-model="postCaption" 
              rows="3" 
              :disabled="isSubmittingPost"
              placeholder="Tulis caption kiriman Anda..." 
              class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition resize-none disabled:opacity-60"
            ></textarea>
          </div>

          <p v-if="uploadError" class="text-xs text-rose-500 font-semibold text-center">{{ uploadError }}</p>
        </div>

        <!-- Tombol Aksi -->
        <div class="p-3.5 bg-slate-50 border-t border-slate-100 flex gap-3 shrink-0">
          <button 
            @click="cancelPostModal" 
            :disabled="isSubmittingPost"
            class="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100 transition disabled:opacity-50"
          >
            Batal
          </button>
          <button 
            @click="submitPost" 
            :disabled="isSubmittingPost || isConvertingHeic" 
            class="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50 active:scale-95"
          >
            <svg v-if="isSubmittingPost" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isSubmittingPost ? 'Mengunggah...' : 'Bagikan' }}</span>
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Pencegahan SEO: Blokir indexing pada seluruh halaman privat/user portal
useHead({
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase
const authToken = useCookie('auth_token')

// STATE INDIKATOR LOADING NAVIGASI UNTUK JARINGAN LEMOT & ANTI-SPAM
const isNavigating = ref(false)
const targetRoute = ref('')

onMounted(() => {
  // Deteksi ketika rute mulai berpindah
  router.beforeEach((to, from) => {
    if (to.path !== from.path) {
      isNavigating.value = true
      targetRoute.value = to.path
    }
  })

  // Deteksi ketika perpindahan rute selesai
  router.afterEach(() => {
    isNavigating.value = false
    targetRoute.value = ''
  })

  // Tangani jika navigasi error / dibatalkan
  router.onError(() => {
    isNavigating.value = false
    targetRoute.value = ''
  })
})

// NORMALISASI PATH: Menghapus trailing slash (misal /user/ menjadi /user)
const normalizedPath = computed(() => route.path.replace(/\/$/, '') || '/')

// Pengecekan status aktif menu secara fleksibel & presisi
const isHomeActive = computed(() => normalizedPath.value === '/user')
const isGuruActive = computed(() => normalizedPath.value.startsWith('/user/gurustaf'))
const isGaleriActive = computed(() => normalizedPath.value.startsWith('/user/galeri'))
const isProfilActive = computed(() => normalizedPath.value.startsWith('/user/profil'))

const postFileInputRef = ref(null)
const selectedFile = ref(null)
const previewImage = ref(null)
const postCaption = ref('')
const isUploadModalOpen = ref(false)
const isSubmittingPost = ref(false)
const isConvertingHeic = ref(false)
const uploadError = ref('')

const triggerPostPicker = () => {
  if (postFileInputRef.value) {
    postFileInputRef.value.value = null
    postFileInputRef.value.click()
  }
}

const handlePhotoSelected = async (event) => {
  let file = event.target.files[0]
  if (!file) return

  uploadError.value = ''
  postCaption.value = ''
  isUploadModalOpen.value = true

  // Cek apakah file dari iPhone berformat HEIC / HEIF
  const isHeic = file.type.includes('heic') || 
                 file.type.includes('heif') || 
                 file.name.toLowerCase().endsWith('.heic') || 
                 file.name.toLowerCase().endsWith('.heif')

  if (isHeic) {
    isConvertingHeic.value = true
    try {
      // Import dinamis library heic2any
      const heic2any = (await import('heic2any')).default
      
      const convertedBlob = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.8
      })

      const blobResult = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob
      
      // Ubah nama file menjadi ekstensi .jpg
      const newFileName = file.name.replace(/\.(heic|HEIC|heif|HEIF)$/, '.jpg')
      file = new File([blobResult], newFileName, { type: 'image/jpeg' })
    } catch (err) {
      console.error('Gagal mengonversi foto HEIC:', err)
      uploadError.value = 'Gagal memproses foto dari iPhone. Silakan pilih foto lain.'
      isConvertingHeic.value = false
      return
    } finally {
      isConvertingHeic.value = false
    }
  }

  selectedFile.value = file
  previewImage.value = URL.createObjectURL(file)
}

const cancelPostModal = () => {
  if (isSubmittingPost.value) return // Cegah tutup modal saat sedang mengunggah
  isUploadModalOpen.value = false
  selectedFile.value = null
  previewImage.value = null
  postCaption.value = ''
  isConvertingHeic.value = false
}

const submitPost = async () => {
  if (!selectedFile.value || isSubmittingPost.value) return
  if (!authToken.value) {
    return navigateTo('/login')
  }

  isSubmittingPost.value = true
  uploadError.value = ''

  const formData = new FormData()
  formData.append('gambar', selectedFile.value)
  if (postCaption.value.trim()) {
    formData.append('caption', postCaption.value.trim())
  }

  try {
    await $fetch(`${API_BASE}/api/user-api/posts/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken.value}` },
      body: formData
    })

    cancelPostModal()
    
    // PERBAIKAN NAVIGASI: Arahkan ke Beranda (/user) dan perbarui halaman
    if (normalizedPath.value === '/user') {
      window.location.reload()
    } else {
      await navigateTo('/user')
      window.location.reload()
    }
  } catch (err) {
    uploadError.value = err.data?.message || 'Gagal mengunggah postingan.'
  } finally {
    isSubmittingPost.value = false
  }
}
</script>