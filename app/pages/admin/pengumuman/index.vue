<!-- FILE: frontend/app/pages/admin/pengumuman/index.vue -->
<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <span class="text-xs font-semibold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          Pusat Informasi & Surat Edaran
        </span>
        <h2 class="text-2xl lg:text-3xl font-extrabold text-slate-900 mt-2">Manajemen Pengumuman</h2>
        <p class="text-slate-500 text-sm">Kelola surat edaran, jadwal ujian, serta informasi resmi untuk orang tua dan siswa.</p>
      </div>

      <button 
        @click="openModalTambah" 
        class="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
      >
        <span>+ Buat Pengumuman Baru</span>
      </button>
    </div>

    <!-- Filter & Search Bar -->
    <div class="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
      <div class="w-full md:w-80">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Cari kata kunci pengumuman..." 
          class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
        />
      </div>

      <div class="flex flex-wrap items-center gap-2 w-full md:w-auto">
        <button 
          v-for="kat in kategoriList" 
          :key="kat"
          @click="selectedKategori = kat"
          :class="[
            'px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap',
            selectedKategori === kat 
              ? 'bg-slate-900 text-white' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
        Memuat data pengumuman...
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredPengumuman.length === 0" class="text-center py-20 text-slate-400">
        <p class="text-base font-semibold">Tidak ada data pengumuman ditemukan</p>
        <p class="text-xs mt-1">Gunakan kata kunci lain atau tambahkan pengumuman baru.</p>
      </div>

      <!-- Table View -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-100 bg-slate-50/50 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              <th class="py-4 px-6">Pengumuman & Target</th>
              <th class="py-4 px-6">Kategori</th>
              <th class="py-4 px-6">Prioritas</th>
              <th class="py-4 px-6">Tanggal Diterbitkan</th>
              <th class="py-4 px-6">Lampiran File</th>
              <th class="py-4 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-sm">
            <tr v-for="item in filteredPengumuman" :key="item.id" class="hover:bg-slate-50/60 transition">
              <!-- Judul, Target & Pinned status -->
              <td class="py-4 px-6">
                <div class="flex items-start gap-2">
                  <span v-if="item.is_pinned" class="text-amber-500 font-bold text-base" title="Pengumuman Disematkan">📌</span>
                  <div>
                    <p class="font-bold text-slate-900 line-clamp-1 max-w-md">{{ item.judul }}</p>
                    <p class="text-xs text-slate-400 mt-0.5">Target: <span class="text-slate-600 font-medium">{{ item.target }}</span></p>
                  </div>
                </div>
              </td>

              <!-- Kategori -->
              <td class="py-4 px-6 whitespace-nowrap">
                <span class="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">
                  {{ item.kategori }}
                </span>
              </td>

              <!-- Prioritas Badge -->
              <td class="py-4 px-6 whitespace-nowrap">
                <span 
                  :class="[
                    'px-3 py-1 rounded-lg text-xs font-bold border',
                    item.prioritas === 'Mendesak' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                    item.prioritas === 'Penting' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                    'bg-slate-100 text-slate-600 border-slate-200'
                  ]"
                >
                  {{ item.prioritas }}
                </span>
              </td>

              <!-- Tanggal Diterbitkan -->
              <td class="py-4 px-6 text-xs text-slate-500 whitespace-nowrap">
                {{ formatTanggal(item.tanggal) }}
              </td>

              <!-- File Lampiran -->
              <td class="py-4 px-6 whitespace-nowrap">
                <a 
                  v-if="item.lampiran" 
                  :href="item.lampiran" 
                  target="_blank" 
                  class="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg border border-blue-200 transition"
                >
                  <span>📄 Unduh File</span>
                </a>
                <span v-else class="text-slate-400 text-xs italic">Tidak Ada</span>
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
              {{ isEditMode ? 'Edit Pengumuman' : 'Buat Pengumuman Baru' }}
            </h3>
            <button @click="closeModal" class="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
          </div>

          <form @submit.prevent="submitForm" class="space-y-4">
            <!-- Judul -->
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Judul Pengumuman</label>
              <input 
                v-model="form.judul" 
                type="text" 
                required 
                placeholder="Contoh: Surat Edaran Ujian Akhir Semester (PAS)"
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
              />
            </div>

            <!-- Kategori & Prioritas -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Kategori</label>
                <select 
                  v-model="form.kategori" 
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                >
                  <option value="Surat Edaran">Surat Edaran</option>
                  <option value="Akademik & Ujian">Akademik & Ujian</option>
                  <option value="Kegiatan">Kegiatan</option>
                  <option value="Keuangan">Keuangan</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Tingkat Prioritas</label>
                <select 
                  v-model="form.prioritas" 
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                >
                  <option value="Biasa">Biasa</option>
                  <option value="Penting">Penting</option>
                  <option value="Mendesak">Mendesak</option>
                </select>
              </div>
            </div>

            <!-- Tanggal Diterbitkan & Target Audiens -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Tanggal Pengumuman</label>
                <input 
                  v-model="form.tanggal" 
                  type="date" 
                  required 
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Target Audiens</label>
                <input 
                  v-model="form.target" 
                  type="text" 
                  required 
                  placeholder="Contoh: Wali Murid Kelas 1-6 / Seluruh Siswa"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
              </div>
            </div>

            <!-- Option Pinned -->
            <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <p class="text-xs font-bold text-slate-800">Sematkan Pengumuman (Pinned)</p>
                <p class="text-[11px] text-slate-500">Pengumuman disematkan akan selalu berada di posisi teratas halaman.</p>
              </div>
              <input 
                type="checkbox" 
                v-model="form.is_pinned" 
                class="w-5 h-5 text-amber-500 rounded border-slate-300 focus:ring-amber-500" 
              />
            </div>

            <!-- File Lampiran PDF -->
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">File Lampiran PDF / Dokumen (Opsional)</label>
              <input 
                type="file" 
                @change="handleFileUpload" 
                accept=".pdf,.doc,.docx"
                class="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p v-if="existingFileUrl && !selectedFile" class="text-xs text-emerald-600 mt-2 font-medium">
                ✓ File lampiran terpasang: <a :href="existingFileUrl" target="_blank" class="underline font-bold">Lihat File</a>
              </p>
            </div>

            <!-- Ringkasan -->
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Ringkasan Singkat</label>
              <textarea 
                v-model="form.ringkasan" 
                rows="2" 
                placeholder="Tuliskan ringkasan singkat pengumuman..."
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
              ></textarea>
            </div>

            <!-- Isi Lengkap -->
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Isi Pengumuman Lengkap</label>
              <textarea 
                v-model="form.isi_pengumuman" 
                rows="5" 
                required
                placeholder="Tuliskan detail pengumuman secara lengkap di sini..."
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
                {{ saving ? 'Menyimpan...' : (isEditMode ? 'Simpan Perubahan' : 'Terbitkan Pengumuman') }}
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
          <h3 class="text-lg font-bold text-slate-900">Hapus Pengumuman Ini?</h3>
          <p class="text-xs text-slate-500">
            Apakah Anda yakin ingin menghapus pengumuman "<span class="font-semibold text-slate-800">{{ selectedItemToDelete?.judul }}</span>"? Data yang dihapus tidak dapat dikembalikan.
          </p>
          <div class="flex justify-center gap-3 pt-2">
            <button 
              @click="showDeleteModal = false" 
              class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
            >
              Batal
            </button>
            <button 
              @click="hapusPengumuman" 
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

const API_BASE_URL = `${API_BASE}/api/admin-api/pengumuman/`

// Cookie JWT Token Authentication
const token = useCookie('auth_token')

// Header Authorization Dinamis
const getAuthHeaders = () => ({
  Authorization: token.value ? `Bearer ${token.value}` : ''
})

const searchQuery = ref('')
const selectedKategori = ref('Semua')
const kategoriList = ['Semua', 'Surat Edaran', 'Akademik & Ujian', 'Kegiatan', 'Keuangan']

const showModal = ref(false)
const isEditMode = ref(false)
const saving = ref(false)
const editingId = ref(null)

const showDeleteModal = ref(false)
const selectedItemToDelete = ref(null)
const deleting = ref(false)

const selectedFile = ref(null)
const existingFileUrl = ref(null)

// Modal Alert Kustom
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
  kategori: 'Surat Edaran',
  prioritas: 'Biasa',
  tanggal: getTodayString(),
  target: 'Wali Murid & Siswa',
  is_pinned: false,
  ringkasan: '',
  isi_pengumuman: ''
})

// Fetch pengumuman dari Backend API dengan token JWT
const { data: pengumumanData, pending, refresh } = await useFetch(API_BASE_URL, {
  headers: computed(() => getAuthHeaders()),
  watch: false,
  lazy: true
})

// Filter & Searching Data
const filteredPengumuman = computed(() => {
  if (!pengumumanData.value || !Array.isArray(pengumumanData.value)) return []
  return pengumumanData.value.filter(item => {
    const matchSearch = item.judul.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                        (item.ringkasan && item.ringkasan.toLowerCase().includes(searchQuery.value.toLowerCase()))
    const matchKategori = selectedKategori.value === 'Semua' || item.kategori === selectedKategori.value
    return matchSearch && matchKategori
  })
})

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
  }
}

const openModalTambah = () => {
  isEditMode.value = false
  editingId.value = null
  form.judul = ''
  form.kategori = 'Surat Edaran'
  form.prioritas = 'Biasa'
  form.tanggal = getTodayString()
  form.target = 'Wali Murid & Siswa'
  form.is_pinned = false
  form.ringkasan = ''
  form.isi_pengumuman = ''
  selectedFile.value = null
  existingFileUrl.value = null
  showModal.value = true
}

const openModalEdit = (item) => {
  isEditMode.value = true
  editingId.value = item.id
  form.judul = item.judul
  form.kategori = item.kategori
  form.prioritas = item.prioritas
  form.tanggal = item.tanggal
  form.target = item.target
  form.is_pinned = item.is_pinned
  form.ringkasan = item.ringkasan || ''
  form.isi_pengumuman = item.isi_pengumuman
  selectedFile.value = null
  existingFileUrl.value = item.lampiran
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
    formData.append('prioritas', form.prioritas)
    formData.append('tanggal', form.tanggal)
    formData.append('target', form.target)
    formData.append('is_pinned', form.is_pinned)
    formData.append('ringkasan', form.ringkasan)
    formData.append('isi_pengumuman', form.isi_pengumuman)

    if (selectedFile.value) {
      formData.append('lampiran', selectedFile.value)
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
    showAlert('Gagal Menyimpan', 'Gagal menyimpan pengumuman. Mohon periksa kembali server backend Django Anda.', 'danger')
    console.error(error)
  } finally {
    saving.value = false
  }
}

const konfirmasiHapus = (item) => {
  selectedItemToDelete.value = item
  showDeleteModal.value = true
}

const hapusPengumuman = async () => {
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
    showAlert('Gagal Menghapus', 'Gagal menghapus data pengumuman.', 'danger')
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