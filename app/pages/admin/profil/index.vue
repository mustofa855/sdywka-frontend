<script setup>
import { ref, reactive, onMounted } from 'vue'

definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Manajemen Profil, Banner & Akun - Admin SD YWKA REL HOMY SCHOOL'
})

const getBaseUrl = () => {
  const config = useRuntimeConfig()
  let baseUrl = config.public.apiBase || 'http://localhost:8000'
  baseUrl = baseUrl.replace(/\/$/, '')
  if (!baseUrl.endsWith('/api')) {
    baseUrl = `${baseUrl}/api`
  }
  return baseUrl
}

const getAuthHeaders = () => {
  const token = useCookie('auth_token').value || useCookie('access_token').value || (process.client ? localStorage.getItem('access_token') : '')
  return {
    Authorization: token ? (token.startsWith('Bearer ') ? token : `Bearer ${token}`) : ''
  }
}

// Active Tab ('sekolah' | 'banner' | 'akun')
const activeTab = ref('sekolah')

// Toast State
const toast = reactive({
  show: false,
  message: '',
  type: 'success'
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
const loadingProfil = ref(true)
const submittingProfil = ref(false)

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
    triggerToast('Gagal memuat data profil sekolah', 'error')
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

    // FIX PERBAIKAN: Endpoint backend admin-api/profil/ tidak menerima ID di URL
    await $fetch(`${baseUrl}/admin-api/profil/`, {
      method: 'POST',
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
// 2. STATE & LOGIC: HERO BANNER (SLIDER UTAMA)
// -------------------------------------------------------------
const banners = ref([])
const loadingBanner = ref(true)
const submittingBanner = ref(false)
const showBannerModal = ref(false)
const editingBannerId = ref(null)

const bannerForm = reactive({
  tag: 'Selamat Datang',
  judul: '',
  isi: '',
  link: '/profil',
  teks_tombol: 'Mulai Mengenal Kami',
  is_active: true
})

const bannerImageFile = ref(null)
const bannerImagePreview = ref(null)

const fetchBanners = async () => {
  loadingBanner.value = true
  try {
    const baseUrl = getBaseUrl()
    const data = await $fetch(`${baseUrl}/admin-api/hero/`, {
      headers: getAuthHeaders()
    })
    banners.value = Array.isArray(data) ? data : []
  } catch (err) {
    console.error('Gagal memuat banner:', err)
    triggerToast('Gagal memuat data hero banner', 'error')
  } finally {
    loadingBanner.value = false
  }
}

const openBannerModal = (item = null) => {
  if (item) {
    editingBannerId.value = item.id
    bannerForm.tag = item.tag || 'Selamat Datang'
    bannerForm.judul = item.judul || ''
    bannerForm.isi = item.isi || ''
    bannerForm.link = item.link || '/profil'
    bannerForm.teks_tombol = item.teks_tombol || 'Mulai Mengenal Kami'
    bannerForm.is_active = item.is_active ?? true
    bannerImagePreview.value = item.gambar || null
  } else {
    editingBannerId.value = null
    bannerForm.tag = 'Selamat Datang'
    bannerForm.judul = ''
    bannerForm.isi = ''
    bannerForm.link = '/profil'
    bannerForm.teks_tombol = 'Mulai Mengenal Kami'
    bannerForm.is_active = true
    bannerImagePreview.value = null
  }
  bannerImageFile.value = null
  showBannerModal.value = true
}

const handleBannerImage = (e) => {
  const file = e.target.files[0]
  if (file) {
    bannerImageFile.value = file
    bannerImagePreview.value = URL.createObjectURL(file)
  }
}

const saveBanner = async () => {
  if (!bannerForm.judul) {
    triggerToast('Judul banner wajib diisi!', 'error')
    return
  }

  submittingBanner.value = true
  try {
    const baseUrl = getBaseUrl()
    const formData = new FormData()
    formData.append('tag', bannerForm.tag)
    formData.append('judul', bannerForm.judul)
    formData.append('isi', bannerForm.isi)
    formData.append('link', bannerForm.link)
    formData.append('teks_tombol', bannerForm.teks_tombol)
    formData.append('is_active', bannerForm.is_active ? 'true' : 'false')

    if (bannerImageFile.value) {
      formData.append('gambar', bannerImageFile.value)
    }

    const targetUrl = editingBannerId.value 
      ? `${baseUrl}/admin-api/hero/${editingBannerId.value}/`
      : `${baseUrl}/admin-api/hero/`

    await $fetch(targetUrl, {
      method: editingBannerId.value ? 'PUT' : 'POST',
      headers: getAuthHeaders(),
      body: formData
    })

    triggerToast(editingBannerId.value ? 'Banner berhasil diperbarui!' : 'Banner baru berhasil ditambahkan!')
    showBannerModal.value = false
    await fetchBanners()
  } catch (err) {
    console.error('Gagal menyimpan banner:', err)
    triggerToast('Gagal menyimpan banner', 'error')
  } finally {
    submittingBanner.value = false
  }
}

const deleteBanner = async (id) => {
  if (!confirm('Apakah Anda yakin ingin menghapus banner ini?')) return
  try {
    const baseUrl = getBaseUrl()
    await $fetch(`${baseUrl}/admin-api/hero/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    triggerToast('Banner berhasil dihapus')
    await fetchBanners()
  } catch (err) {
    console.error('Gagal menghapus banner:', err)
    triggerToast('Gagal menghapus banner', 'error')
  }
}

// -------------------------------------------------------------
// 3. STATE & LOGIC: AKUN ADMIN LOGGED IN
// -------------------------------------------------------------
const loadingUser = ref(true)
const submittingUser = ref(false)

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
      userForm.nama_lengkap = me.nama_lengkap || me.nama || ''
      userForm.email = me.email || ''
      userForm.motto = me.motto || me.quotes || ''
      currentFotoUrl.value = me.foto || me.foto_profil || null
    }
  } catch (err) {
    console.error('Gagal memuat data user:', err)
    triggerToast('Gagal memuat akun pengguna', 'error')
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
    }

    await $fetch(`${baseUrl}/auth/me/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: formData
    })

    triggerToast('Akun pribadi berhasil diperbarui!')
    userForm.password = ''
    fotoProfilFile.value = null
    fotoProfilPreview.value = null
    await fetchCurrentUser()
  } catch (err) {
    console.error('Gagal memperbarui akun:', err)
    triggerToast('Gagal menyimpan perubahan akun admin', 'error')
  } finally {
    submittingUser.value = false
  }
}

onMounted(() => {
  fetchProfilSekolah()
  fetchBanners()
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
        <span class="mr-3 text-lg">{{ toast.type === 'success' ? '✅' : '⚠️' }}</span>
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
          Manajemen Profil, Banner & Akun
        </h1>
        <p class="text-slate-500 text-xs sm:text-sm mt-1">
          Kelola informasi profil sekolah, banner promosi utama, dan akun admin Anda.
        </p>
      </div>

      <!-- TABS NAVIGATION -->
      <div class="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 self-start md:self-auto gap-1">
        <button
          @click="activeTab = 'sekolah'"
          :class="[
            'px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2',
            activeTab === 'sekolah' ? 'bg-slate-900 text-amber-400 shadow-md' : 'text-slate-600 hover:text-slate-900'
          ]"
        >
          <span>Profil Sekolah</span>
        </button>

        <button
          @click="activeTab = 'banner'"
          :class="[
            'px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2',
            activeTab === 'banner' ? 'bg-slate-900 text-amber-400 shadow-md' : 'text-slate-600 hover:text-slate-900'
          ]"
        >
          <span>Hero Banner</span>
        </button>

        <button
          @click="activeTab = 'akun'"
          :class="[
            'px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2',
            activeTab === 'akun' ? 'bg-slate-900 text-amber-400 shadow-md' : 'text-slate-600 hover:text-slate-900'
          ]"
        >
          <span>Akun Saya</span>
        </button>
      </div>
    </div>

    <!-- TAB 1: PROFIL SEKOLAH -->
    <div v-show="activeTab === 'sekolah'">
      <div class="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div class="p-6 border-b border-slate-100">
          <h2 class="text-lg font-extrabold text-slate-900">Informasi Profil Sekolah</h2>
          <p class="text-xs text-slate-500">Ubah Sejarah, Visi, dan Misi yang tampil di website utama</p>
        </div>

        <div v-if="loadingProfil" class="p-12 text-center text-slate-400">
          <div class="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p class="text-xs font-semibold">Memuat data profil...</p>
        </div>

        <form v-else @submit.prevent="saveProfilSekolah" class="p-6 sm:p-8 space-y-6">
          <div>
            <label class="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-2">Nama Sekolah</label>
            <input 
              v-model="profilForm.nama_sekolah" 
              type="text" 
              required
              class="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-amber-500 text-sm font-semibold text-slate-800 outline-none"
            />
          </div>

          <div>
            <label class="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-2">Sejarah Sekolah</label>
            <textarea 
              v-model="profilForm.sejarah" 
              rows="5"
              class="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-amber-500 text-sm text-slate-800 outline-none"
            ></textarea>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-2">Visi Sekolah</label>
            <textarea 
              v-model="profilForm.visi" 
              rows="3"
              class="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-amber-500 text-sm text-slate-800 outline-none"
            ></textarea>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-2">Misi Sekolah</label>
            <textarea 
              v-model="profilForm.misi" 
              rows="6"
              class="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-amber-500 text-sm text-slate-800 outline-none"
            ></textarea>
          </div>

          <div class="pt-4 border-t border-slate-100 flex justify-end">
            <button 
              type="submit" 
              :disabled="submittingProfil"
              class="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold rounded-2xl shadow-lg transition-all text-sm"
            >
              {{ submittingProfil ? 'Menyimpan...' : 'Simpan Profil Sekolah' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- TAB 2: HERO BANNER MANAGEMENT -->
    <div v-show="activeTab === 'banner'">
      <div class="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div class="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 class="text-lg font-extrabold text-slate-900">Banner Beranda Utama</h2>
            <p class="text-xs text-slate-500">Kelola gambar banner dan teks promosi di halaman beranda</p>
          </div>
          <button 
            @click="openBannerModal()" 
            class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-xl text-xs shadow-md transition-all"
          >
            + Tambah Banner Baru
          </button>
        </div>

        <div v-if="loadingBanner" class="p-12 text-center text-slate-400">
          <div class="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p class="text-xs font-semibold">Memuat daftar banner...</p>
        </div>

        <div v-else-if="banners.length === 0" class="p-12 text-center text-slate-400">
          <p class="text-sm font-semibold">Belum ada banner utama yang ditambahkan.</p>
        </div>

        <div v-else class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            v-for="item in banners" 
            :key="item.id" 
            class="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex flex-col"
          >
            <div class="h-44 bg-slate-800 relative">
              <img 
                v-if="item.gambar" 
                :src="item.gambar" 
                alt="Hero Banner" 
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                Tidak ada gambar
              </div>
              <span 
                :class="item.is_active ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'" 
                class="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase shadow-md"
              >
                {{ item.is_active ? 'Aktif' : 'Non-Aktif' }}
              </span>
            </div>
            
            <div class="p-4 flex-1 flex flex-col justify-between">
              <div>
                <span class="text-[10px] font-extrabold uppercase text-amber-600 tracking-wider">{{ item.tag }}</span>
                <h3 class="text-base font-bold text-slate-900 mt-1">{{ item.judul }}</h3>
                <p class="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">{{ item.isi }}</p>
              </div>

              <div class="pt-4 mt-4 border-t border-slate-200/80 flex items-center justify-between">
                <span class="text-[11px] font-mono text-slate-400">Link: {{ item.link }}</span>
                <div class="flex items-center space-x-2">
                  <button 
                    @click="openBannerModal(item)" 
                    class="px-3 py-1.5 bg-slate-900 text-amber-400 hover:bg-slate-800 text-xs font-bold rounded-lg transition-all"
                  >
                    Edit
                  </button>
                  <button 
                    @click="deleteBanner(item.id)" 
                    class="px-3 py-1.5 bg-rose-600 text-white hover:bg-rose-700 text-xs font-bold rounded-lg transition-all"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 3: AKUN SAYA -->
    <div v-show="activeTab === 'akun'">
      <div class="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div class="p-6 border-b border-slate-100">
          <h2 class="text-lg font-extrabold text-slate-900">Pengaturan Akun Saya</h2>
          <p class="text-xs text-slate-500">Kelola foto profil, nama, email, dan kata sandi login</p>
        </div>

        <div v-if="loadingUser" class="p-12 text-center text-slate-400">
          <div class="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p class="text-xs font-semibold">Memuat data pengguna...</p>
        </div>

        <form v-else @submit.prevent="saveUserAccount" class="p-6 sm:p-8 space-y-6">
          <div class="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 p-6 bg-slate-50 rounded-2xl border border-slate-200/70">
            <div class="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-800 flex items-center justify-center flex-shrink-0">
              <img 
                v-if="fotoProfilPreview || currentFotoUrl" 
                :src="fotoProfilPreview || currentFotoUrl" 
                alt="Foto Profil"
                class="w-full h-full object-cover"
              />
              <span v-else class="text-slate-400 text-2xl font-bold">A</span>
            </div>

            <div class="space-y-2 text-center sm:text-left flex-1">
              <h3 class="text-sm font-extrabold text-slate-900">Foto Profil Admin</h3>
              <p class="text-xs text-slate-500">Format yang didukung: JPG, PNG, WEBP. Maksimal 5MB.</p>
              
              <label class="inline-flex items-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm transition-all">
                Pilih Foto Baru
                <input type="file" accept="image/*" class="hidden" @change="handleFotoChange" />
              </label>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-2">Username</label>
              <input :value="userForm.username" type="text" disabled class="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-100 text-slate-500 text-sm font-semibold outline-none cursor-not-allowed" />
            </div>

            <div>
              <label class="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-2">Nama Lengkap</label>
              <input v-model="userForm.nama_lengkap" type="text" required class="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-amber-500 text-sm font-semibold text-slate-800 outline-none" />
            </div>

            <div>
              <label class="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-2">Alamat Email</label>
              <input v-model="userForm.email" type="email" class="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-amber-500 text-sm font-semibold text-slate-800 outline-none" />
            </div>

            <div>
              <label class="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-2">Kata Sandi Baru (Opsional)</label>
              <input v-model="userForm.password" type="password" placeholder="••••••••" class="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-amber-500 text-sm font-semibold text-slate-800 outline-none" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-2">Motto / Kutipan Kerja</label>
            <textarea v-model="userForm.motto" rows="3" class="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-amber-500 text-sm text-slate-800 outline-none"></textarea>
          </div>

          <div class="pt-4 border-t border-slate-100 flex justify-end">
            <button 
              type="submit" 
              :disabled="submittingUser"
              class="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold rounded-2xl shadow-lg transition-all text-sm"
            >
              {{ submittingUser ? 'Menyimpan...' : 'Simpan Akun Saya' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL FORM HERO BANNER -->
    <Transition name="fade">
      <div v-if="showBannerModal" class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5 overflow-y-auto max-h-[90vh]">
          <div class="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 class="text-lg font-extrabold text-slate-900">
              {{ editingBannerId ? 'Edit Hero Banner' : 'Tambah Hero Banner Baru' }}
            </h3>
            <button @click="showBannerModal = false" class="text-slate-400 hover:text-slate-800 font-bold text-sm">✕</button>
          </div>

          <form @submit.prevent="saveBanner" class="space-y-4">
            <div>
              <label class="block text-xs font-bold uppercase text-slate-700 mb-1">Tagline Kecil</label>
              <input v-model="bannerForm.tag" type="text" placeholder="Contoh: Selamat Datang" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none" />
            </div>

            <div>
              <label class="block text-xs font-bold uppercase text-slate-700 mb-1">Judul Banner Utama</label>
              <input v-model="bannerForm.judul" type="text" required placeholder="Judul Banner" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none" />
            </div>

            <div>
              <label class="block text-xs font-bold uppercase text-slate-700 mb-1">Deskripsi / Isi Paragraf</label>
              <textarea v-model="bannerForm.isi" rows="3" placeholder="Deskripsi singkat banner..." class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none"></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold uppercase text-slate-700 mb-1">Teks Tombol</label>
                <input v-model="bannerForm.teks_tombol" type="text" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none" />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase text-slate-700 mb-1">Link Target</label>
                <input v-model="bannerForm.link" type="text" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase text-slate-700 mb-1">Gambar Banner</label>
              <div class="flex items-center space-x-4">
                <div v-if="bannerImagePreview" class="w-20 h-14 bg-slate-100 rounded-lg overflow-hidden border">
                  <img :src="bannerImagePreview" class="w-full h-full object-cover" />
                </div>
                <input type="file" accept="image/*" @change="handleBannerImage" class="text-xs text-slate-600" />
              </div>
            </div>

            <div class="flex items-center space-x-2 pt-2">
              <input v-model="bannerForm.is_active" type="checkbox" id="isActive" class="w-4 h-4 rounded text-amber-500" />
              <label for="isActive" class="text-xs font-bold text-slate-700">Tampilkan Banner Ini di Beranda (Status Aktif)</label>
            </div>

            <div class="pt-4 border-t flex justify-end space-x-3">
              <button type="button" @click="showBannerModal = false" class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl">Batal</button>
              <button type="submit" :disabled="submittingBanner" class="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold rounded-xl shadow-md">
                {{ submittingBanner ? 'Menyimpan...' : 'Simpan Banner' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>