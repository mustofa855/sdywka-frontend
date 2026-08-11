<!-- FILE: frontend/app/pages/admin/event/index.vue -->
<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <span class="text-xs font-semibold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Modul Agenda & Kegiatan
        </span>
        <h2 class="text-2xl lg:text-3xl font-extrabold text-slate-900 mt-2">Manajemen Event & Acara</h2>
        <p class="text-slate-500 text-sm">Kelola daftar acara sekolah, jadwal kegiatan, lokasi, serta poster promosi.</p>
      </div>

      <button 
        @click="openModalTambah" 
        class="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 shrink-0"
      >
        <span>+ Buat Event Baru</span>
      </button>
    </div>

    <!-- Filter & Search Bar -->
    <div class="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
      <div class="w-full lg:w-80 shrink-0">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Cari judul atau lokasi acara..." 
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
        Memuat data event & acara...
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredEvent.length === 0" class="text-center py-20 text-slate-400">
        <p class="text-base font-semibold">Tidak ada data event ditemukan</p>
        <p class="text-xs mt-1">Coba ubah pencarian atau buat event baru.</p>
      </div>

      <!-- Table View -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-100 bg-slate-50/50 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              <th class="py-4 px-6">Event & Poster</th>
              <th class="py-4 px-6">Kategori</th>
              <th class="py-4 px-6">Status</th>
              <th class="py-4 px-6">Waktu & Tanggal</th>
              <th class="py-4 px-6">Lokasi</th>
              <th class="py-4 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-sm">
            <tr v-for="item in filteredEvent" :key="item.id" class="hover:bg-slate-50/60 transition">
              <!-- Judul & Poster -->
              <td class="py-4 px-6">
                <div class="flex items-center gap-4">
                  <img 
                    :src="item.poster || '/placeholder.png'" 
                    alt="Poster" 
                    class="w-16 h-12 rounded-lg object-cover border border-slate-100 bg-slate-100 flex-shrink-0"
                  />
                  <div>
                    <div class="flex items-center gap-2">
                      <span v-if="item.is_featured" class="text-amber-500 font-bold text-xs" title="Featured Event">⭐</span>
                      <p class="font-bold text-slate-900 line-clamp-1 max-w-xs">{{ item.judul }}</p>
                    </div>
                    <p class="text-xs text-slate-400 line-clamp-1 max-w-xs mt-0.5">{{ item.penyelenggara }}</p>
                  </div>
                </div>
              </td>

              <!-- Kategori Badge -->
              <td class="py-4 px-6 whitespace-nowrap">
                <span class="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">
                  {{ item.kategori }}
                </span>
              </td>

              <!-- Status Badge -->
              <td class="py-4 px-6 whitespace-nowrap">
                <span 
                  :class="[
                    'px-3 py-1 rounded-lg text-xs font-bold border',
                    item.status === 'Akan Datang' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    item.status === 'Berlangsung' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    item.status === 'Selesai' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                    'bg-rose-50 text-rose-700 border-rose-200'
                  ]"
                >
                  {{ item.status }}
                </span>
              </td>

              <!-- Waktu & Tanggal -->
              <td class="py-4 px-6 text-xs text-slate-600 whitespace-nowrap">
                <p class="font-bold text-slate-800">{{ formatTanggal(item.tanggal_mulai) }}</p>
                <p class="text-slate-400 mt-0.5">{{ item.waktu }}</p>
              </td>

              <!-- Lokasi -->
              <td class="py-4 px-6 text-xs text-slate-600 whitespace-nowrap">
                <span class="font-medium text-slate-700">📍 {{ item.lokasi }}</span>
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

    <!-- TELEPORT 1: MODAL FORM (TAMBAH / EDIT) -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
        <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 lg:p-8 shadow-2xl space-y-6">
          <div class="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 class="text-lg font-bold text-slate-900">
              {{ isEditMode ? 'Edit Event / Acara' : 'Buat Event Baru' }}
            </h3>
            <button @click="closeModal" class="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
          </div>

          <form @submit.prevent="submitForm" class="space-y-4">
            <!-- Judul -->
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Judul Event / Acara</label>
              <input 
                v-model="form.judul" 
                type="text" 
                required 
                placeholder="Contoh: Peringatan Hari Kemerdekaan RI Ke-81"
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
              />
            </div>

            <!-- Kategori & Status -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Kategori</label>
                <select 
                  v-model="form.kategori" 
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                >
                  <option value="Akademik">Akademik & Ujian</option>
                  <option value="Keagamaan">Keagamaan & PHBI</option>
                  <option value="Seni & Olahraga">Seni & Olahraga</option>
                  <option value="Peringatan Hari Besar">Peringatan Hari Besar</option>
                  <option value="Rapat & Pertemuan">Rapat & Pertemuan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Status Acara</label>
                <select 
                  v-model="form.status" 
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                >
                  <option value="Akan Datang">Akan Datang</option>
                  <option value="Berlangsung">Berlangsung</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Dibatalkan">Dibatalkan</option>
                </select>
              </div>
            </div>

            <!-- Tanggal & Jam -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Tanggal Mulai</label>
                <input 
                  v-model="form.tanggal_mulai" 
                  type="date" 
                  required 
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Tanggal Selesai (Opsional)</label>
                <input 
                  v-model="form.tanggal_selesai" 
                  type="date" 
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Waktu / Jam</label>
                <input 
                  v-model="form.waktu" 
                  type="text" 
                  required
                  placeholder="Contoh: 08:00 - 12:00 WIB"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
              </div>
            </div>

            <!-- Lokasi & Penyelenggara -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Lokasi Tempat</label>
                <input 
                  v-model="form.lokasi" 
                  type="text" 
                  required 
                  placeholder="Contoh: Lapangan Utama SD YWKA"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Penyelenggara / Panitia</label>
                <input 
                  v-model="form.penyelenggara" 
                  type="text" 
                  required 
                  placeholder="Contoh: Panitia PHBI SD YWKA"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
              </div>
            </div>

            <!-- Link Pendaftaran & Featured -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Link Pendaftaran (Opsional)</label>
                <input 
                  v-model="form.link_pendaftaran" 
                  type="url" 
                  placeholder="https://forms.google.com/..."
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
              </div>

              <div class="flex items-center pt-6">
                <label class="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    v-model="form.is_featured" 
                    class="w-5 h-5 text-amber-500 rounded border-slate-300 focus:ring-amber-500" 
                  />
                  <span class="text-sm font-semibold text-slate-700">Tandai sebagai Event Unggulan ⭐</span>
                </label>
              </div>
            </div>

            <!-- Poster Gambar -->
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Poster / Gambar Banner Acara</label>
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

            <!-- Ringkasan Singkat -->
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Ringkasan Singkat</label>
              <textarea 
                v-model="form.ringkasan" 
                rows="2" 
                placeholder="Tuliskan deskripsi singkat event..."
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
              ></textarea>
            </div>

            <!-- Deskripsi Lengkap -->
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Deskripsi Lengkap / Rundown Acara</label>
              <textarea 
                v-model="form.deskripsi" 
                rows="5" 
                required
                placeholder="Tuliskan rincian susunan acara, syarat pendaftaran, atau instruksi peserta..."
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
                {{ saving ? 'Menyimpan...' : (isEditMode ? 'Simpan Perubahan' : 'Terbitkan Event') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- TELEPORT 2: MODAL KONFIRMASI HAPUS -->
    <Teleport to="body">
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
        <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl text-center space-y-4">
          <div class="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
            ⚠️
          </div>
          <h3 class="text-lg font-bold text-slate-900">Hapus Event Ini?</h3>
          <p class="text-xs text-slate-500">
            Apakah Anda yakin ingin menghapus event "<span class="font-semibold text-slate-800">{{ selectedItemToDelete?.judul }}</span>"? Data yang dihapus tidak dapat dikembalikan.
          </p>
          <div class="flex justify-center gap-3 pt-2">
            <button 
              @click="showDeleteModal = false" 
              class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
            >
              Batal
            </button>
            <button 
              @click="hapusEvent" 
              :disabled="deleting"
              class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-rose-600/20 disabled:opacity-50"
            >
              {{ deleting ? 'Menghapus...' : 'Ya, Hapus Data' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- TELEPORT 3: MODAL ALERT NOTIFIKASI KUSTOM -->
    <Teleport to="body">
      <div v-if="modalDialog.show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
        <div class="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-5 text-center">
          <div 
            class="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-xl"
            :class="[
              modalDialog.type === 'danger' ? 'bg-rose-50 text-rose-600 border border-rose-100' : '',
              modalDialog.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : '',
              modalDialog.type === 'info' ? 'bg-amber-50 text-amber-600 border border-amber-100' : ''
            ]"
          >
            <span v-if="modalDialog.type === 'danger'">⚠️</span>
            <span v-else-if="modalDialog.type === 'success'">✅</span>
            <span v-else>ℹ️</span>
          </div>

          <div>
            <h3 class="text-base font-extrabold text-slate-900">{{ modalDialog.title }}</h3>
            <p class="text-xs text-slate-500 mt-1.5 leading-relaxed">{{ modalDialog.message }}</p>
          </div>

          <button 
            type="button" 
            @click="modalDialog.show = false" 
            class="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-amber-500/20"
          >
            OK
          </button>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

definePageMeta({ layout: 'admin' })

// Ambil runtime configuration dari nuxt.config.ts / .env
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase

const API_BASE_URL = `${API_BASE}/api/admin-api/event/`

// Cookie JWT Token Authentication
const token = useCookie('auth_token')

const getAuthHeaders = () => ({
  Authorization: token.value ? `Bearer ${token.value}` : ''
})

const searchQuery = ref('')
const selectedKategori = ref('Semua')
const kategoriList = ['Semua', 'Akademik', 'Keagamaan', 'Seni & Olahraga', 'Peringatan Hari Besar', 'Rapat & Pertemuan', 'Lainnya']

const showModal = ref(false)
const isEditMode = ref(false)
const saving = ref(false)
const editingId = ref(null)

const showDeleteModal = ref(false)
const selectedItemToDelete = ref(null)
const deleting = ref(false)

const imageFile = ref(null)
const imagePreview = ref(null)

const modalDialog = reactive({
  show: false,
  title: '',
  message: '',
  type: 'info'
})

const showAlert = (title, message, type = 'info') => {
  modalDialog.title = title
  modalDialog.message = message
  modalDialog.type = type
  modalDialog.show = true
}

const getTodayString = () => new Date().toISOString().split('T')[0]

const form = reactive({
  judul: '',
  kategori: 'Akademik',
  status: 'Akan Datang',
  tanggal_mulai: getTodayString(),
  tanggal_selesai: '',
  waktu: '08:00 WIB - Selesai',
  lokasi: 'SD YWKA',
  penyelenggara: 'SD YWKA',
  link_pendaftaran: '',
  is_featured: false,
  ringkasan: '',
  deskripsi: ''
})

// Fetch Event dari Backend API dengan token JWT
const { data: eventData, pending, refresh } = await useFetch(API_BASE_URL, {
  headers: computed(() => getAuthHeaders()),
  watch: false,
  lazy: true
})

// Filter & Searching Data
const filteredEvent = computed(() => {
  if (!eventData.value || !Array.isArray(eventData.value)) return []
  return eventData.value.filter(item => {
    const matchSearch = item.judul.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                        (item.lokasi && item.lokasi.toLowerCase().includes(searchQuery.value.toLowerCase()))
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
  form.kategori = 'Akademik'
  form.status = 'Akan Datang'
  form.tanggal_mulai = getTodayString()
  form.tanggal_selesai = ''
  form.waktu = '08:00 WIB - Selesai'
  form.lokasi = 'SD YWKA'
  form.penyelenggara = 'SD YWKA'
  form.link_pendaftaran = ''
  form.is_featured = false
  form.ringkasan = ''
  form.deskripsi = ''
  imageFile.value = null
  imagePreview.value = null
  showModal.value = true
}

const openModalEdit = (item) => {
  isEditMode.value = true
  editingId.value = item.id
  form.judul = item.judul
  form.kategori = item.kategori
  form.status = item.status
  form.tanggal_mulai = item.tanggal_mulai
  form.tanggal_selesai = item.tanggal_selesai || ''
  form.waktu = item.waktu
  form.lokasi = item.lokasi
  form.penyelenggara = item.penyelenggara
  form.link_pendaftaran = item.link_pendaftaran || ''
  form.is_featured = item.is_featured
  form.ringkasan = item.ringkasan || ''
  form.deskripsi = item.deskripsi
  imageFile.value = null
  imagePreview.value = item.poster
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
    formData.append('status', form.status)
    formData.append('tanggal_mulai', form.tanggal_mulai)
    if (form.tanggal_selesai) formData.append('tanggal_selesai', form.tanggal_selesai)
    formData.append('waktu', form.waktu)
    formData.append('lokasi', form.lokasi)
    formData.append('penyelenggara', form.penyelenggara)
    if (form.link_pendaftaran) formData.append('link_pendaftaran', form.link_pendaftaran)
    formData.append('is_featured', form.is_featured)
    formData.append('ringkasan', form.ringkasan)
    formData.append('deskripsi', form.deskripsi)

    if (imageFile.value) {
      formData.append('poster', imageFile.value)
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
    showAlert('Gagal Menyimpan', 'Gagal menyimpan data event. Periksa kembali server Django Anda.', 'danger')
    console.error(error)
  } finally {
    saving.value = false
  }
}

const konfirmasiHapus = (item) => {
  selectedItemToDelete.value = item
  showDeleteModal.value = true
}

const hapusEvent = async () => {
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
    showAlert('Gagal Menghapus', 'Gagal menghapus event.', 'danger')
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