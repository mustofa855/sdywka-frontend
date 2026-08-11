<!-- FILE: frontend/app/pages/admin/berita/index.vue -->
<template>
  <div>
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <span class="text-xs font-semibold uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          Modul Publikasi
        </span>
        <h2 class="text-2xl lg:text-3xl font-extrabold text-slate-900 mt-2">Manajemen Berita & Kegiatan</h2>
        <p class="text-slate-500 text-sm">Kelola postingan artikel, berita utama, serta kegiatan sekolah.</p>
      </div>

      <button 
        @click="openModalTambah" 
        class="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 shrink-0"
      >
        <span>+ Tambah Berita Baru</span>
      </button>
    </div>

    <!-- Filter & Search Bar -->
    <div class="bg-white rounded-2xl border border-slate-100 p-4 mb-6 shadow-sm flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
      <div class="w-full lg:w-80 shrink-0">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Cari judul atau isi berita..." 
          class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
        />
      </div>

      <!-- Filter Kategori Row -->
      <div class="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none w-full lg:w-auto">
        <button 
          v-for="kat in kategoriList" 
          :key="kat"
          @click="selectedKategori = kat"
          :class="[
            'px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 border',
            selectedKategori === kat 
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
              : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
          ]"
        >
          {{ kat }}
        </button>
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <!-- Loading State -->
      <div v-if="pending" class="text-center py-20 text-slate-400 font-medium">
        Memuat data berita...
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredBerita.length === 0" class="text-center py-20 text-slate-400">
        <p class="text-base font-semibold">Tidak ada data berita ditemukan</p>
        <p class="text-xs mt-1">Coba ubah kata kunci pencarian atau buat berita baru.</p>
      </div>

      <!-- Table View -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-100 bg-slate-50/50 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              <th class="py-4 px-6">Berita</th>
              <th class="py-4 px-6">Kategori</th>
              <th class="py-4 px-6">Headline</th>
              <th class="py-4 px-6">Tanggal Upload</th>
              <th class="py-4 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-sm">
            <tr v-for="item in filteredBerita" :key="item.id" class="hover:bg-slate-50/60 transition">
              <!-- Judul & Thumbnail -->
              <td class="py-4 px-6">
                <div class="flex items-center gap-4">
                  <img 
                    :src="item.gambar || '/placeholder.png'" 
                    alt="Thumbnail" 
                    class="w-16 h-12 rounded-lg object-cover border border-slate-100 bg-slate-100 flex-shrink-0"
                  />
                  <div>
                    <p class="font-bold text-slate-900 line-clamp-1 max-w-md">{{ item.judul }}</p>
                    <p class="text-xs text-slate-400 line-clamp-1 max-w-md mt-0.5">{{ item.ringkasan || 'Tidak ada ringkasan' }}</p>
                  </div>
                </div>
              </td>

              <!-- Kategori dengan Badge Warna Rapi -->
              <td class="py-4 px-6 whitespace-nowrap">
                <span 
                  :class="[
                    'px-3 py-1 rounded-lg text-xs font-semibold inline-block border',
                    item.kategori === 'Kegiatan Siswa' ? 'bg-blue-50 text-blue-700 border-blue-200/60' :
                    item.kategori === 'Prestasi' ? 'bg-amber-50 text-amber-700 border-amber-200/60' :
                    item.kategori === 'Akademik' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' :
                    item.kategori === 'Pengumuman' ? 'bg-purple-50 text-purple-700 border-purple-200/60' :
                    'bg-slate-100 text-slate-700 border-slate-200/60'
                  ]"
                >
                  {{ item.kategori }}
                </span>
              </td>

              <!-- Featured Badge -->
              <td class="py-4 px-6 whitespace-nowrap">
                <span 
                  v-if="item.is_featured" 
                  class="px-3 py-1 bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold"
                >
                  Headline
                </span>
                <span v-else class="text-slate-400 text-xs">-</span>
              </td>

              <!-- Tanggal -->
              <td class="py-4 px-6 text-xs text-slate-500 whitespace-nowrap">
                {{ formatTanggal(item.tanggal_upload) }}
              </td>

              <!-- Action Buttons -->
              <td class="py-4 px-6 text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-2">
                  <button 
                    @click="openModalEdit(item)" 
                    class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition"
                  >
                    Edit
                  </button>
                  <button 
                    @click="konfirmasiHapus(item)" 
                    class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold rounded-lg text-xs transition"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL FORM (TAMBAH / EDIT) -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 lg:p-8 shadow-2xl space-y-6">
        <div class="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 class="text-lg font-bold text-slate-900">
            {{ isEditMode ? 'Edit Berita' : 'Tambah Berita Baru' }}
          </h3>
          <button @click="closeModal" class="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
        </div>

        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Judul Berita</label>
            <input 
              v-model="form.judul" 
              type="text" 
              required 
              placeholder="Masukkan judul berita..."
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Kategori</label>
              <select 
                v-model="form.kategori" 
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
              >
                <option value="Kegiatan Siswa">Kegiatan Siswa</option>
                <option value="Prestasi">Prestasi</option>
                <option value="Akademik">Akademik</option>
                <option value="Pengumuman">Pengumuman</option>
              </select>
            </div>

            <div class="flex items-center pt-6">
              <label class="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  v-model="form.is_featured" 
                  class="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-500" 
                />
                <span class="text-sm font-semibold text-slate-700">Tandai sebagai Berita Utama (Headline)</span>
              </label>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Gambar Sampul / Banner</label>
            <input 
              type="file" 
              @change="handleFileUpload" 
              accept="image/*"
              class="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
            />
            <div v-if="imagePreview" class="mt-3">
              <img :src="imagePreview" alt="Preview" class="w-full h-40 object-cover rounded-xl border border-slate-200" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Ringkasan Singkat</label>
            <textarea 
              v-model="form.ringkasan" 
              rows="2" 
              placeholder="Tuliskan ringkasan singkat untuk ditampilkan di kartu depan..."
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
            ></textarea>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Isi Berita Lengkap</label>
            <textarea 
              v-model="form.isi" 
              rows="6" 
              required
              placeholder="Tuliskan isi berita lengkap di sini..."
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
            ></textarea>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button 
              type="button" 
              @click="closeModal" 
              class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
            >
              Batal
            </button>
            <button 
              type="submit" 
              :disabled="saving"
              class="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {{ saving ? 'Menyimpan...' : (isEditMode ? 'Simpan Perubahan' : 'Terbitkan Berita') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL KONFIRMASI HAPUS -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl text-center space-y-4">
        <div class="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
          !
        </div>
        <h3 class="text-lg font-bold text-slate-900">Hapus Berita Ini?</h3>
        <p class="text-xs text-slate-500">
          Apakah Anda yakin ingin menghapus berita "<span class="font-semibold text-slate-800">{{ selectedItemToDelete?.judul }}</span>"? Tindakan ini tidak dapat dibatalkan.
        </p>
        <div class="flex justify-center gap-3 pt-2">
          <button 
            @click="showDeleteModal = false" 
            class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
          >
            Batal
          </button>
          <button 
            @click="hapusBerita" 
            :disabled="deleting"
            class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-rose-600/20 disabled:opacity-50"
          >
            {{ deleting ? 'Menghapus...' : 'Ya, Hapus Data' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

definePageMeta({ layout: 'admin' })

// Ambil runtime configuration dari nuxt.config.ts / .env
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase

const API_BASE_URL = `${API_BASE}/api/admin-api/berita/`

// Cookie JWT Token Authentication
const token = useCookie('auth_token')

// Header Authorization Dinamis
const getAuthHeaders = () => ({
  Authorization: token.value ? `Bearer ${token.value}` : ''
})

const searchQuery = ref('')
const selectedKategori = ref('Semua')
const kategoriList = ['Semua', 'Kegiatan Siswa', 'Prestasi', 'Akademik', 'Pengumuman']

const showModal = ref(false)
const isEditMode = ref(false)
const saving = ref(false)
const editingId = ref(null)

const showDeleteModal = ref(false)
const selectedItemToDelete = ref(null)
const deleting = ref(false)

const imageFile = ref(null)
const imagePreview = ref(null)

const form = reactive({
  judul: '',
  kategori: 'Kegiatan Siswa',
  ringkasan: '',
  isi: '',
  is_featured: false
})

// Fetch berita dari API backend dengan menyertakan Token JWT
const { data: beritaData, pending, refresh } = await useFetch(API_BASE_URL, {
  headers: computed(() => getAuthHeaders()),
  watch: false,
  lazy: true
})

// Filter berita berdasarkan kata kunci dan kategori
const filteredBerita = computed(() => {
  if (!beritaData.value || !Array.isArray(beritaData.value)) return []
  return beritaData.value.filter(item => {
    const matchSearch = item.judul.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                        (item.ringkasan && item.ringkasan.toLowerCase().includes(searchQuery.value.toLowerCase()))
    const matchKategori = selectedKategori.value === 'Semua' || item.kategori === selectedKategori.value
    return matchSearch && matchKategori
  })
})

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    imageFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

const openModalTambah = () => {
  isEditMode.value = false
  editingId.value = null
  form.judul = ''
  form.kategori = 'Kegiatan Siswa'
  form.ringkasan = ''
  form.isi = ''
  form.is_featured = false
  imageFile.value = null
  imagePreview.value = null
  showModal.value = true
}

const openModalEdit = (item) => {
  isEditMode.value = true
  editingId.value = item.id
  form.judul = item.judul
  form.kategori = item.kategori
  form.ringkasan = item.ringkasan || ''
  form.isi = item.isi
  form.is_featured = item.is_featured
  imageFile.value = null
  imagePreview.value = item.gambar
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const submitForm = async () => {
  saving.value = true
  try {
    const formData = new FormData()
    formData.append('judul', form.judul)
    formData.append('kategori', form.kategori)
    formData.append('ringkasan', form.ringkasan)
    formData.append('isi', form.isi)
    formData.append('is_featured', form.is_featured)

    if (imageFile.value) {
      formData.append('gambar', imageFile.value)
    }

    if (isEditMode.value) {
      await $fetch(`${API_BASE_URL}${editingId.value}/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: formData
      })
    } else {
      await $fetch(API_BASE_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData
      })
    }

    closeModal()
    refresh()
  } catch (error) {
    alert('Gagal menyimpan berita. Silakan periksa kembali server Django Anda.')
    console.error(error)
  } finally {
    saving.value = false
  }
}

const konfirmasiHapus = (item) => {
  selectedItemToDelete.value = item
  showDeleteModal.value = true
}

const hapusBerita = async () => {
  if (!selectedItemToDelete.value) return
  deleting.value = true
  try {
    await $fetch(`${API_BASE_URL}${selectedItemToDelete.value.id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    showDeleteModal.value = false
    refresh()
  } catch (error) {
    alert('Gagal menghapus berita.')
    console.error(error)
  } finally {
    deleting.value = false
  }
}

const formatTanggal = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}
</script>