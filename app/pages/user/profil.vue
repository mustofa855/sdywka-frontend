<template>
  <div class="min-h-screen bg-slate-50 pb-20">
    <!-- Header dengan Tombol Logout -->
    <header class="bg-blue-900 text-white p-4 md:px-6 sticky top-0 z-50 flex items-center justify-between shadow-md">
      <h1 class="text-lg md:text-xl font-bold">Profil Pengguna</h1>
      
      <!-- Tombol Logout Header -->
      <button 
        @click="isConfirmLogoutModalOpen = true"
        class="text-xs md:text-sm bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
        title="Keluar dari akun"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
        </svg>
        <span>Logout</span>
      </button>
    </header>

    <!-- State Loading saat Memuat Data Profil -->
    <div v-if="isLoadingProfile" class="max-w-xl md:max-w-2xl mx-auto p-8 text-center space-y-4">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
      <p class="text-xs font-semibold text-slate-500">Memuat data profil...</p>
    </div>

    <main v-else class="max-w-xl md:max-w-2xl mx-auto p-4 md:p-6 space-y-4">
      <!-- Kartu Profil Utama -->
      <section class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center relative">
        <div class="relative mb-3">
          <img 
            :src="user.foto || defaultAvatar" 
            alt="Profil" 
            class="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-slate-100 shadow-sm" 
          />
          <button 
            @click="isConfirmAvatarModalOpen = true"
            class="absolute bottom-0 right-0 bg-blue-600 text-white p-2.5 rounded-full shadow-md hover:bg-blue-700 transition active:scale-95 cursor-pointer"
            title="Ganti Foto Profil"
          >
            <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h0.93a2 2 0 001.664-.89l0.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l0.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </button>
          
          <input 
            type="file" 
            ref="fileInputRef" 
            @change="handleAvatarSelected" 
            accept="image/*" 
            class="hidden" 
          />
        </div>

        <h2 class="text-lg md:text-xl font-bold text-slate-800">{{ user.nama || 'Pengguna' }}</h2>
        <p class="text-xs md:text-sm text-blue-600 font-semibold mb-1">&#64;{{ user.username }}</p>
        <p class="text-xs md:text-sm text-slate-500 italic px-4">"{{ user.quotes || 'Belum ada quotes' }}"</p>
      </section>

      <!-- Informasi Akun -->
      <section class="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100 space-y-3">
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Informasi Akun</h3>
        
        <div class="space-y-3">
          <!-- Username -->
          <div class="flex justify-between items-center p-3.5 bg-slate-50 rounded-xl">
            <div>
              <span class="text-[10px] text-slate-400 font-bold uppercase block">Username</span>
              <span class="text-sm font-semibold text-slate-700">&#64;{{ user.username }}</span>
            </div>
            <button 
              @click="isConfirmUsernameModalOpen = true"
              class="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition cursor-pointer"
            >
              Ubah Username
            </button>
          </div>

          <!-- Quotes -->
          <div class="flex justify-between items-center p-3.5 bg-slate-50 rounded-xl">
            <div class="pr-2">
              <span class="text-[10px] text-slate-400 font-bold uppercase block">Quotes / Slogan</span>
              <span class="text-sm font-semibold text-slate-700">"{{ user.quotes || '-' }}"</span>
            </div>
            <button 
              @click="isConfirmQuotesModalOpen = true"
              class="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition shrink-0 cursor-pointer"
            >
              Ubah Quotes
            </button>
          </div>

          <!-- Password -->
          <div class="flex justify-between items-center p-3.5 bg-slate-50 rounded-xl">
            <div>
              <span class="text-[10px] text-slate-400 font-bold uppercase block">Password</span>
              <span class="text-sm font-semibold text-slate-700">••••••••</span>
            </div>
            <button 
              @click="isConfirmPasswordModalOpen = true"
              class="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition cursor-pointer"
            >
              Ubah Password
            </button>
          </div>
        </div>
      </section>

      <!-- Kartu Presensi Digital -->
      <section class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-4">
        <div>
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Kartu Presensi Digital</h3>
          <p class="text-xs text-slate-500 mt-0.5">Tunjukkan QR ini ke scanner petugas</p>
        </div>

        <div class="p-4 bg-white border-2 border-slate-900 rounded-3xl shadow-inner inline-block">
          <ClientOnly>
            <qrcode-vue :value="user.qr_uuid || 'N/A'" :size="180" level="H" />
          </ClientOnly>
        </div>

        <div class="space-y-1">
          <h4 class="text-base md:text-lg font-bold text-slate-900">{{ user.nama || 'Pengguna' }}</h4>
          <p class="text-xs font-semibold text-slate-500">&#64;{{ user.username }}</p>
          <div class="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider mt-1">
            UUID: {{ user.uuid_short || '-----' }}
          </div>
        </div>
      </section>
    </main>

    <!-- MODAL: Notifikasi (Pengganti Alert) -->
    <div v-if="noticeModal.isOpen" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl space-y-4 text-center">
        <div 
          :class="noticeModal.isError ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'" 
          class="w-12 h-12 rounded-full flex items-center justify-center mx-auto"
        >
          <svg v-if="noticeModal.isError" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 class="text-base font-bold text-slate-800">{{ noticeModal.title }}</h3>
        <p class="text-xs text-slate-600 leading-relaxed">{{ noticeModal.message }}</p>
        <button 
          @click="noticeModal.isOpen = false" 
          class="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer"
        >
          Mengerti
        </button>
      </div>
    </div>

    <!-- MODAL: Konfirmasi Logout -->
    <div v-if="isConfirmLogoutModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div class="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl space-y-4 text-center">
        <div class="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
        </div>
        <h3 class="text-base font-bold text-slate-800">Konfirmasi Logout</h3>
        <p class="text-xs text-slate-600">Apakah Anda yakin ingin keluar dari akun ini?</p>
        <div class="flex gap-3 pt-2">
          <button @click="isConfirmLogoutModalOpen = false" class="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition cursor-pointer">Batal</button>
          <button @click="handleLogout" :disabled="isLoggingOut" class="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50">
            <span v-if="isLoggingOut">Proses...</span>
            <span v-else>Keluar</span>
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL: Ganti Foto Profil -->
    <div v-if="isConfirmAvatarModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div class="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl space-y-4 text-center">
        <h3 class="text-base font-bold text-slate-800">Ganti Foto Profil</h3>
        <p class="text-xs text-slate-600">Apakah Anda ingin mengganti foto profil Anda?</p>
        <div class="flex gap-3 pt-2">
          <button @click="isConfirmAvatarModalOpen = false" class="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition">Tidak</button>
          <button @click="triggerFileInput" class="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition">Ya</button>
        </div>
      </div>
    </div>

    <!-- MODAL: Konfirmasi Username -->
    <div v-if="isConfirmUsernameModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div class="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl space-y-4 text-center">
        <h3 class="text-base font-bold text-slate-800">Ubah Username</h3>
        <p class="text-xs text-slate-600">Apakah Anda ingin mengubah username Anda?</p>
        <div class="flex gap-3 pt-2">
          <button @click="isConfirmUsernameModalOpen = false" class="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition">Tidak</button>
          <button @click="openUsernameFormModal" class="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition">Ya</button>
        </div>
      </div>
    </div>

    <!-- MODAL: Form Username Baru -->
    <div v-if="isUsernameFormModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div class="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl space-y-4">
        <h3 class="text-base font-bold text-slate-800">Masukkan Username Baru</h3>
        <form @submit.prevent="handleUsernameChange" class="space-y-3">
          <div>
            <label class="text-[11px] font-bold text-slate-500 uppercase block mb-1">Username Baru</label>
            <input v-model="tempUsername" type="text" placeholder="Masukkan username baru" required class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-blue-500" />
          </div>
          <p v-if="formError" class="text-[11px] text-rose-500 font-semibold">{{ formError }}</p>
          <div class="flex gap-3 pt-2">
            <button type="button" @click="isUsernameFormModalOpen = false" class="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition">Batal</button>
            <button type="submit" :disabled="isSubmitting" class="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition disabled:opacity-50">
              {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL: Konfirmasi Quotes -->
    <div v-if="isConfirmQuotesModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div class="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl space-y-4 text-center">
        <h3 class="text-base font-bold text-slate-800">Ubah Quotes / Slogan</h3>
        <p class="text-xs text-slate-600">Apakah Anda ingin mengubah quotes / slogan Anda?</p>
        <div class="flex gap-3 pt-2">
          <button @click="isConfirmQuotesModalOpen = false" class="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition">Tidak</button>
          <button @click="openQuotesFormModal" class="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition">Ya</button>
        </div>
      </div>
    </div>

    <!-- MODAL: Form Quotes Baru -->
    <div v-if="isQuotesFormModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div class="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl space-y-4">
        <h3 class="text-base font-bold text-slate-800">Edit Quotes / Slogan</h3>
        <form @submit.prevent="handleQuotesChange" class="space-y-3">
          <div>
            <label class="text-[11px] font-bold text-slate-500 uppercase block mb-1">Quotes / Slogan Baru</label>
            <input v-model="tempQuotes" type="text" placeholder="Masukkan slogan favoritmu" required class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-blue-500" />
          </div>
          <p v-if="formError" class="text-[11px] text-rose-500 font-semibold">{{ formError }}</p>
          <div class="flex gap-3 pt-2">
            <button type="button" @click="isQuotesFormModalOpen = false" class="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition">Batal</button>
            <button type="submit" :disabled="isSubmitting" class="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition disabled:opacity-50">
              {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL: Konfirmasi Password -->
    <div v-if="isConfirmPasswordModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div class="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl space-y-4 text-center">
        <h3 class="text-base font-bold text-slate-800">Ubah Password</h3>
        <p class="text-xs text-slate-600">Apakah Anda yakin ingin mengubah password Anda?</p>
        <div class="flex gap-3 pt-2">
          <button @click="isConfirmPasswordModalOpen = false" class="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition">Tidak</button>
          <button @click="openPasswordFormModal" class="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition">Ya</button>
        </div>
      </div>
    </div>

    <!-- MODAL: Form Password Baru -->
    <div v-if="isPasswordFormModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div class="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl space-y-4">
        <h3 class="text-base font-bold text-slate-800">Masukkan Password Baru</h3>
        <form @submit.prevent="handlePasswordChange" class="space-y-3">
          <div>
            <label class="text-[11px] font-bold text-slate-500 uppercase block mb-1">Password Baru</label>
            <input v-model="passwordForm.newPassword" type="password" placeholder="Minimal 6 karakter" required class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label class="text-[11px] font-bold text-slate-500 uppercase block mb-1">Konfirmasi Password Baru</label>
            <input v-model="passwordForm.confirmPassword" type="password" placeholder="Ulangi password baru" required class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500" />
          </div>
          <p v-if="errorMessage" class="text-[11px] text-rose-500 font-semibold">{{ errorMessage }}</p>
          <div class="flex gap-3 pt-2">
            <button type="button" @click="isPasswordFormModalOpen = false" class="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition">Batal</button>
            <button type="submit" :disabled="isSubmitting" class="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition disabled:opacity-50">
              {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import QrcodeVue from 'qrcode.vue'

definePageMeta({ layout: 'user' })

const config = useRuntimeConfig()
const API_BASE = config.public.apiBase

const authToken = useCookie('auth_token')
const refreshToken = useCookie('refresh_token')
const authUser = useCookie('auth_user')

const isLoggingOut = ref(false)
const isLoadingProfile = ref(true)
const isSubmitting = ref(false)
const formError = ref('')
const errorMessage = ref('')

const defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'

const user = reactive({
  nama: 'Memuat...',
  username: '',
  quotes: '',
  foto: '',
  qr_uuid: '',
  uuid_short: ''
})

const fileInputRef = ref(null)

// Modal Alert Custom
const noticeModal = reactive({
  isOpen: false,
  title: '',
  message: '',
  isError: false
})

const showNotice = (title, message, isError = false) => {
  noticeModal.title = title
  noticeModal.message = message
  noticeModal.isError = isError
  noticeModal.isOpen = true
}

// Modal Form States
const isConfirmLogoutModalOpen = ref(false)
const isConfirmAvatarModalOpen = ref(false)
const isConfirmUsernameModalOpen = ref(false)
const isUsernameFormModalOpen = ref(false)
const isConfirmQuotesModalOpen = ref(false)
const isQuotesFormModalOpen = ref(false)
const isConfirmPasswordModalOpen = ref(false)
const isPasswordFormModalOpen = ref(false)

const tempUsername = ref('')
const tempQuotes = ref('')

const passwordForm = reactive({
  newPassword: '',
  confirmPassword: ''
})

// --- PEMICU MODAL YANG DIPERBAIKI ---
const triggerFileInput = () => {
  isConfirmAvatarModalOpen.value = false
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}

const openUsernameFormModal = () => {
  isConfirmUsernameModalOpen.value = false
  tempUsername.value = user.username || ''
  formError.value = ''
  isUsernameFormModalOpen.value = true
}

const openQuotesFormModal = () => {
  isConfirmQuotesModalOpen.value = false
  tempQuotes.value = user.quotes || ''
  formError.value = ''
  isQuotesFormModalOpen.value = true
}

const openPasswordFormModal = () => {
  isConfirmPasswordModalOpen.value = false
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  errorMessage.value = ''
  isPasswordFormModalOpen.value = true
}

// --- 1. AMBIL DATA PROFIL ---
const fetchUserProfile = async () => {
  isLoadingProfile.value = true

  if (authUser.value) {
    try {
      const parsedUser = typeof authUser.value === 'string' ? JSON.parse(authUser.value) : authUser.value
      if (parsedUser) {
        user.nama = parsedUser.nama_lengkap || parsedUser.nama || parsedUser.username || 'Pengguna'
        user.username = parsedUser.username || ''
        user.foto = parsedUser.foto_profil || parsedUser.foto || ''
      }
    } catch (e) {
      console.warn('Gagal membaca cookie auth_user:', e)
    }
  }

  if (!authToken.value) return navigateTo('/login')

  try {
    const data = await $fetch(`${API_BASE}/api/auth/me/`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${authToken.value}` }
    })

    user.nama = data.nama || data.nama_lengkap || 'Pengguna'
    user.username = data.username || ''
    user.quotes = data.quotes || 'bismillah ayo bisa'
    user.foto = data.foto || ''
    user.qr_uuid = data.qr_uuid || `USER-${data.id}`
    user.uuid_short = data.uuid_short || String(data.id).padStart(6, '0')
  } catch (err) {
    console.error('Gagal mengambil profil:', err)
    const statusCode = err.statusCode || err.response?.status || err.status
    if (statusCode === 401) {
      authToken.value = null
      authUser.value = null
      refreshToken.value = null
      navigateTo('/login')
    }
  } finally {
    isLoadingProfile.value = false
  }
}

onMounted(() => {
  fetchUserProfile()
})

// --- 2. LOGOUT ---
const handleLogout = async () => {
  isLoggingOut.value = true
  try {
    if (refreshToken.value) {
      await $fetch(`${API_BASE}/api/auth/logout/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken.value}` },
        body: { refresh: refreshToken.value }
      })
    }
  } catch (err) {
    console.warn('Backend logout warning:', err)
  } finally {
    authToken.value = null
    refreshToken.value = null
    authUser.value = null
    isLoggingOut.value = false
    isConfirmLogoutModalOpen.value = false
    navigateTo('/login')
  }
}

// --- 3. UBAH FOTO PROFIL ---
const handleAvatarSelected = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  const formData = new FormData()
  formData.append('foto', file)

  try {
    const data = await $fetch(`${API_BASE}/api/auth/me/`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${authToken.value}` },
      body: formData
    })
    
    user.foto = data.foto || data.foto_profil || user.foto
    
    if (authUser.value) {
      try {
        const parsed = typeof authUser.value === 'string' ? JSON.parse(authUser.value) : authUser.value
        parsed.foto_profil = user.foto
        authUser.value = parsed
      } catch (e) {}
    }

    showNotice('Berhasil', 'Foto profil berhasil diperbarui!', false)
  } catch (err) {
    showNotice('Gagal', err.data?.message || 'Gagal mengunggah foto profil. Pastikan ukuran foto tidak terlalu besar.', true)
  } finally {
    if (event.target) event.target.value = ''
  }
}

// --- 4. UBAH USERNAME ---
const handleUsernameChange = async () => {
  if (!tempUsername.value.trim()) return
  isSubmitting.value = true
  formError.value = ''

  try {
    const data = await $fetch(`${API_BASE}/api/auth/me/`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${authToken.value}` },
      body: { username: tempUsername.value.trim() }
    })
    user.username = data.username

    if (authUser.value) {
      try {
        const parsed = typeof authUser.value === 'string' ? JSON.parse(authUser.value) : authUser.value
        parsed.username = data.username
        authUser.value = parsed
      } catch (e) {}
    }

    isUsernameFormModalOpen.value = false
    showNotice('Berhasil', 'Username berhasil diperbarui!', false)
  } catch (err) {
    formError.value = err.data?.message || 'Gagal memperbarui username.'
  } finally {
    isSubmitting.value = false
  }
}

// --- 5. UBAH QUOTES ---
const handleQuotesChange = async () => {
  isSubmitting.value = true
  formError.value = ''

  try {
    const data = await $fetch(`${API_BASE}/api/auth/me/`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${authToken.value}` },
      body: { quotes: tempQuotes.value }
    })
    user.quotes = data.quotes
    isQuotesFormModalOpen.value = false
    showNotice('Berhasil', 'Quotes / Slogan berhasil diperbarui!', false)
  } catch (err) {
    formError.value = err.data?.message || 'Gagal memperbarui quotes.'
  } finally {
    isSubmitting.value = false
  }
}

// --- 6. UBAH PASSWORD ---
const handlePasswordChange = async () => {
  if (passwordForm.newPassword.length < 6) {
    errorMessage.value = 'Password minimal 6 karakter!'
    return
  }
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    errorMessage.value = 'Konfirmasi password tidak cocok!'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    await $fetch(`${API_BASE}/api/auth/me/`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${authToken.value}` },
      body: { password: passwordForm.newPassword }
    })
    isPasswordFormModalOpen.value = false
    showNotice('Berhasil', 'Password akun Anda berhasil diubah!', false)
  } catch (err) {
    errorMessage.value = err.data?.message || 'Gagal memperbarui password.'
  } finally {
    isSubmitting.value = false
  }
}
</script>