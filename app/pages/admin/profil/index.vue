<script setup>
import { ref, reactive, onMounted } from 'vue'

definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Manajemen Profil & Akun - Admin SD YWKA Bandung'
})

const getBaseUrl = () => {
  const config = useRuntimeConfig()
  let baseUrl = config.public.apiBase
  baseUrl = baseUrl.replace(/\/$/, '')
  if (!baseUrl.endsWith('/api')) {
    baseUrl = `${baseUrl}/api`
  }
  return baseUrl
}

// Mengambil token JWT dari cookie yang konsisten dengan halaman berita/event/guru
const token = useCookie('auth_token')

const getAuthHeaders = () => {
  // Fallback membaca auth_token atau access_token jika ada
  const activeToken = token.value || useCookie('access_token').value
  return {
    Authorization: activeToken ? `Bearer ${activeToken}` : ''
  }
}

// Active Tab ('sekolah' | 'akun')
const activeTab = ref('sekolah')

// Loading & Submitting States
const loadingProfil = ref(true)
const loadingUser = ref(true)
const submittingProfil = ref(false)
const submittingUser = ref(false)

// Toast Alert State
const toast = reactive({
  show: false,
  message: '',
  type: 'success' // 'success' | 'error'
})

const triggerToast = (msg, type = 'success') => {
  toast.message = msg
  toast.type = type
  toast.show = true
  setTimeout(() => {
    toast.show = false
  }, 4000)
}

// -------------------------------------------------------------
// 1. STATE & LOGIC: PROFIL SEKOLAH
// -------------------------------------------------------------
const profilForm = reactive({
  id: null,
  nama_sekolah: '',
  sejarah: '',
  visi: '',
  misi: ''
})

const fetchProfilSekolah = async () => {
  loadingProfil.value = true
  try {
    const baseUrl = getBaseUrl()
    const res = await $fetch(`${baseUrl}/admin-api/profil/`, {
      headers: getAuthHeaders()
    })
    
    // Jika response berupa array atau object tunggal
    const data = Array.isArray(res) ? res[0] : res
    if (data) {
      profilForm.id = data.id || null
      profilForm.nama_sekolah = data.nama_sekolah || ''
      profilForm.sejarah = data.sejarah || ''
      profilForm.visi = data.visi || ''
      profilForm.misi = data.misi || ''
    }
  } catch (err) {
    console.error('Gagal memuat data profil sekolah:', err)
    triggerToast('Gagal memuat data profil sekolah dari server', 'error')
  } finally {
    loadingProfil.value = false
  }
}

const saveProfilSekolah = async () => {
  submittingProfil.value = true
  try {
    const baseUrl = getBaseUrl()
    const payload = {
      nama_sekolah: profilForm.nama_sekolah,
      sejarah: profilForm.sejarah,
      visi: profilForm.visi,
      misi: profilForm.misi
    }

    const targetUrl = profilForm.id 
      ? `${baseUrl}/admin-api/profil/${profilForm.id}/` 
      : `${baseUrl}/admin-api/profil/`

    await $fetch(targetUrl, {
      method: profilForm.id ? 'PUT' : 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: payload
    })

    triggerToast('Profil sekolah berhasil diperbarui!')
    await fetchProfilSekolah()
  } catch (err) {
    console.error('Gagal memperbarui profil sekolah:', err)
    triggerToast('Gagal menyimpan perubahan profil sekolah', 'error')
  } finally {
    submittingProfil.value = false
  }
}

// -------------------------------------------------------------
// 2. STATE & LOGIC: AKUN ADMIN LOGGED IN
// -------------------------------------------------------------
const userForm = reactive({
  id: null,
  username: '',
  nama_lengkap: '',
  email: '',
  motto: '',
  password: ''
})

const currentFotoUrl = ref(null)
const fotoProfilFile = ref(null)
const fotoProfilPreview = ref(null)

const fetchCurrentUser = async () => {
  loadingUser.value = true
  try {
    const baseUrl = getBaseUrl()
    const me = await $fetch(`${baseUrl}/auth/me/`, {
      headers: getAuthHeaders()
    })

    if (me) {
      userForm.id = me.id
      userForm.username = me.username || ''
      userForm.nama_lengkap = me.nama_lengkap || me.nama || me.first_name || ''
      userForm.email = me.email || ''
      userForm.motto = me.motto || me.quotes || ''
      currentFotoUrl.value = me.foto || me.foto_profil || me.avatar || null
    }
  } catch (err) {
    console.error('Gagal memuat data user:', err)
    triggerToast('Gagal memuat data akun pengguna', 'error')
  } finally {
    loadingUser.value = false
  }
}

const handleFotoChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      triggerToast('Ukuran foto tidak boleh lebih dari 5MB', 'error')
      return
    }
    fotoProfilFile.value = file
    fotoProfilPreview.value = URL.createObjectURL(file)
  }
}

const saveUserAccount = async () => {
  if (!userForm.id) return
  submittingUser.value = true

  try {
    const baseUrl = getBaseUrl()
    const formData = new FormData()
    formData.append('nama_lengkap', userForm.nama_lengkap)
    formData.append('email', userForm.email)
    formData.append('motto', userForm.motto)
    
    if (userForm.password && userForm.password.trim() !== '') {
      formData.append('password', userForm.password)
    }

    if (fotoProfilFile.value) {
      formData.append('foto_profil', fotoProfilFile.value)
      formData.append('foto', fotoProfilFile.value)
    }

    await $fetch(`${baseUrl}/admin-api/users/${userForm.id}/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: formData
    })

    triggerToast('Data akun pribadi berhasil diperbarui!')
    userForm.password = '' // Reset input password
    fotoProfilFile.value = null
    fotoProfilPreview.value = null
    
    // Refresh user data
    await fetchCurrentUser()
  } catch (err) {
    console.error('Gagal memperbarui akun:', err)
    triggerToast('Gagal menyimpan perubahan akun admin', 'error')
  } finally {
    submittingUser.value = false
  }
}

// Lifecycle Hooks
onMounted(() => {
  fetchProfilSekolah()
  fetchCurrentUser()
})
</script>

<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
    
    <!-- TOAST NOTIFICATION -->
    <Transition name="fade">
      <div 
        v-if="toast.show" 
        :class="[
          'fixed top-5 right-5 z-50 flex items-center p-4 rounded-2xl shadow-xl text-sm font-semibold border max-w-md transition-all',
          toast.type === 'success' ? 'bg-emerald-900 text-emerald-100 border-emerald-700' : 'bg-rose-900 text-rose-100 border-rose-700'
        ]"
      >
        <span class="mr-3 text-lg">
          {{ toast.type === 'success' ? '✅' : '⚠️' }}
        </span>
        <p class="flex-1">{{ toast.message }}</p>
        <button @click="toast.show = false" class="ml-4 text-xs opacity-70 hover:opacity-100">✕</button>
      </div>
    </Transition>

    <!-- HEADER TITLE -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80">
      <div>
        <div class="flex items-center space-x-2 text-amber-600 font-extrabold uppercase text-xs tracking-wider mb-1">
          <span>Pengaturan Sistem</span>
          <span>•</span>
          <span>Administrator</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Manajemen Profil & Akun
        </h1>
        <p class="text-slate-500 text-xs sm:text-sm mt-1">
          Kelola informasi publik profil sekolah SD YWKA dan perbarui data kredensial akun pribadi Anda.
        </p>
      </div>

      <!-- NAVIGATION TABS SWITCHER -->
      <div class="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 self-start md:self-auto">
        <button
          @click="activeTab = 'sekolah'"
          :class="[
            'px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center space-x-2',
            activeTab === 'sekolah' 
              ? 'bg-slate-900 text-amber-400 shadow-md' 
              : 'text-slate-600 hover:text-slate-900'
          ]"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span>Profil Sekolah</span>
        </button>

        <button
          @click="activeTab = 'akun'"
          :class="[
            'px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center space-x-2',
            activeTab === 'akun' 
              ? 'bg-slate-900 text-amber-400 shadow-md' 
              : 'text-slate-600 hover:text-slate-900'
          ]"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>Akun Saya</span>
        </button>
      </div>
    </div>

    <!-- TAB 1: MANAJEMEN PROFIL SEKOLAH -->
    <div v-show="activeTab === 'sekolah'">
      <div class="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
        
        <div class="p-6 border-b border-slate-100 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="p-2.5 bg-amber-500/10 text-amber-600 rounded-2xl">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
              </svg>
            </div>
            <div>
              <h2 class="text-lg font-extrabold text-slate-900">Informasi Profil Sekolah</h2>
              <p class="text-xs text-slate-500">Ubah Sejarah, Visi, dan Misi yang akan tampil di halaman utama guest</p>
            </div>
          </div>
        </div>

        <!-- LOADING STATE -->
        <div v-if="loadingProfil" class="p-12 text-center text-slate-400">
          <div class="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p class="text-xs font-semibold">Memuat data profil sekolah...</p>
        </div>

        <!-- FORM PROFIL SEKOLAH -->
        <form v-else @submit.prevent="saveProfilSekolah" class="p-6 sm:p-8 space-y-6">
          
          <!-- Nama Sekolah -->
          <div>
            <label class="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-2">
              Nama Sekolah
            </label>
            <input 
              v-model="profilForm.nama_sekolah" 
              type="text" 
              required
              placeholder="Contoh: SD YWKA REL HOMY SCHOOL BANDUNG"
              class="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm font-semibold text-slate-800 outline-none transition-all"
            />
          </div>

          <!-- Sejarah Sekolah -->
          <div>
            <label class="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-2">
              Sejarah & Latar Belakang
            </label>
            <textarea 
              v-model="profilForm.sejarah" 
              rows="6"
              placeholder="Tuliskan sejarah singkat berdirinya sekolah..."
              class="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm leading-relaxed text-slate-800 outline-none transition-all"
            ></textarea>
          </div>

          <!-- Visi Sekolah -->
          <div>
            <label class="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-2">
              Visi Utama Sekolah
            </label>
            <textarea 
              v-model="profilForm.visi" 
              rows="3"
              placeholder="Tuliskan Visi Utama Sekolah..."
              class="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm font-medium leading-relaxed text-slate-800 outline-none transition-all"
            ></textarea>
          </div>

          <!-- Misi Sekolah -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="block text-xs font-bold uppercase text-slate-700 tracking-wider">
                Misi Sekolah
              </label>
              <span class="text-[11px] text-amber-600 font-semibold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                💡 Gunakan baris baru (Enter) untuk memisahkan setiap poin misi
              </span>
            </div>
            <textarea 
              v-model="profilForm.misi" 
              rows="7"
              placeholder="1. Menyelenggarakan pendidikan holistik...&#10;2. Mengembangkan potensi akademis...&#10;3. Membentuk generasi..."
              class="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm leading-relaxed text-slate-800 outline-none transition-all"
            ></textarea>
          </div>

          <!-- SUBMIT BUTTON -->
          <div class="pt-4 border-t border-slate-100 flex justify-end">
            <button 
              type="submit" 
              :disabled="submittingProfil"
              class="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 text-sm"
            >
              <svg v-if="submittingProfil" class="w-4 h-4 animate-spin text-amber-400" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ submittingProfil ? 'Menyimpan Perubahan...' : 'Simpan Profil Sekolah' }}</span>
            </button>
          </div>

        </form>
      </div>
    </div>

    <!-- TAB 2: MANAJEMEN AKUN ADMIN LOGGED IN -->
    <div v-show="activeTab === 'akun'">
      <div class="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
        
        <div class="p-6 border-b border-slate-100 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="p-2.5 bg-blue-500/10 text-blue-600 rounded-2xl">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 class="text-lg font-extrabold text-slate-900">Pengaturan Akun Saya</h2>
              <p class="text-xs text-slate-500">Kelola identitas, foto profil, dan kata sandi login admin Anda</p>
            </div>
          </div>
        </div>

        <!-- LOADING STATE -->
        <div v-if="loadingUser" class="p-12 text-center text-slate-400">
          <div class="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p class="text-xs font-semibold">Memuat data pengguna...</p>
        </div>

        <!-- FORM MANAJEMEN AKUN -->
        <form v-else @submit.prevent="saveUserAccount" class="p-6 sm:p-8 space-y-6">
          
          <!-- UNGGAH FOTO PROFIL (AVATAR) -->
          <div class="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 p-6 bg-slate-50 rounded-2xl border border-slate-200/70">
            <div class="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-800 flex items-center justify-center flex-shrink-0">
              <img 
                v-if="fotoProfilPreview || currentFotoUrl" 
                :src="fotoProfilPreview || currentFotoUrl" 
                alt="Foto Profil"
                class="w-full h-full object-cover"
              />
              <svg v-else class="w-12 h-12 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>

            <div class="space-y-2 text-center sm:text-left flex-1">
              <h3 class="text-sm font-extrabold text-slate-900">Foto Profil Admin</h3>
              <p class="text-xs text-slate-500">Format yang didukung: JPG, PNG, WEBP. Maksimal 5MB.</p>
              
              <label class="inline-flex items-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm transition-all">
                <svg class="w-4 h-4 mr-2 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Pilih Foto Baru
                <input type="file" accept="image/*" class="hidden" @change="handleFotoChange" />
              </label>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <!-- Username (Readonly) -->
            <div>
              <label class="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-2">
                Username (Sistem)
              </label>
              <input 
                :value="userForm.username" 
                type="text" 
                disabled
                class="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-100 text-slate-500 font-semibold text-sm outline-none cursor-not-allowed"
              />
            </div>

            <!-- Nama Lengkap -->
            <div>
              <label class="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-2">
                Nama Lengkap
              </label>
              <input 
                v-model="userForm.nama_lengkap" 
                type="text" 
                required
                placeholder="Masukkan nama lengkap"
                class="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm font-semibold text-slate-800 outline-none transition-all"
              />
            </div>

            <!-- Email -->
            <div>
              <label class="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-2">
                Alamat Email
              </label>
              <input 
                v-model="userForm.email" 
                type="email" 
                placeholder="admin@sdywka.sch.id"
                class="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm font-semibold text-slate-800 outline-none transition-all"
              />
            </div>

            <!-- Password Baru (Opsional) -->
            <div>
              <label class="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-2">
                Kata Sandi Baru <span class="text-slate-400 font-normal lowercase">(kosongkan jika tidak diubah)</span>
              </label>
              <input 
                v-model="userForm.password" 
                type="password" 
                placeholder="••••••••"
                class="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm font-semibold text-slate-800 outline-none transition-all"
              />
            </div>

          </div>

          <!-- Motto / Bio Singkat -->
          <div>
            <label class="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-2">
              Motto / Kutipan Kerja
            </label>
            <textarea 
              v-model="userForm.motto" 
              rows="3"
              placeholder="Contoh: Mengabdi dengan ikhlas untuk kemajuan generasi penerus bangsa."
              class="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm leading-relaxed text-slate-800 outline-none transition-all"
            ></textarea>
          </div>

          <!-- SUBMIT BUTTON -->
          <div class="pt-4 border-t border-slate-100 flex justify-end">
            <button 
              type="submit" 
              :disabled="submittingUser"
              class="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 text-sm"
            >
              <svg v-if="submittingUser" class="w-4 h-4 animate-spin text-amber-400" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ submittingUser ? 'Menyimpan Akun...' : 'Simpan Akun Saya' }}</span>
            </button>
          </div>

        </form>
      </div>
    </div>

  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>