<!-- FILE: frontend/app/pages/admin/guru/index.vue -->
<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <span class="text-xs font-semibold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Struktur Organisasi & Tenaga Pendidik
        </span>
        <h2 class="text-2xl lg:text-3xl font-extrabold text-slate-900 mt-2">Manajemen Guru & SDM</h2>
        <p class="text-slate-500 text-sm">Kelola profil guru, pimpinan sekolah, wali kelas, serta staf tata usaha.</p>
      </div>

      <button 
        @click="openModalTambah" 
        class="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
      >
        <span>+ Tambah SDM Baru</span>
      </button>
    </div>

    <!-- Filter & Search Bar -->
    <div class="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
      <div class="w-full md:w-80">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Cari nama, NIP, atau mata pelajaran..." 
          class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
        />
      </div>

      <div class="flex flex-wrap items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
        <button 
          v-for="kat in kategoriOptions" 
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
        Memuat data Guru & SDM...
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredGuru.length === 0" class="text-center py-20 text-slate-400">
        <p class="text-base font-semibold">Tidak ada data SDM ditemukan</p>
        <p class="text-xs mt-1">Gunakan kata kunci pencarian lain atau tambahkan tenaga pendidik baru.</p>
      </div>

      <!-- Table View -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-100 bg-slate-50/50 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              <th class="py-4 px-6">Urutan (Role) & Foto</th>
              <th class="py-4 px-6">Nama & NIP</th>
              <th class="py-4 px-6">Jabatan & Kategori</th>
              <th class="py-4 px-6">Pendidikan & Kampus</th>
              <th class="py-4 px-6">Bidang Tugas / Mapel</th>
              <th class="py-4 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-sm">
            <tr v-for="item in filteredGuru" :key="item.id" class="hover:bg-slate-50/60 transition">
              <!-- Role & Foto -->
              <td class="py-4 px-6 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <span class="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-200" title="Urutan Role">
                    {{ item.role }}
                  </span>
                  <img 
                    :src="item.foto || '/images/default-avatar.png'" 
                    :alt="item.nama"
                    class="w-10 h-10 rounded-xl object-cover border border-slate-200 bg-slate-100" 
                    @error="(e) => e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(item.nama) + '&background=0D8ABC&color=fff'"
                  />
                </div>
              </td>

              <!-- Nama, Gelar & NIP -->
              <td class="py-4 px-6">
                <div>
                  <p class="font-bold text-slate-900">
                    {{ item.nama }}{{ item.gelar ? `, ${item.gelar}` : '' }}
                  </p>
                  <p class="text-xs text-slate-400 mt-0.5">NIP/NIY: <span class="text-slate-600 font-medium">{{ item.nip || '-' }}</span></p>
                </div>
              </td>

              <!-- Jabatan & Kategori Badge -->
              <td class="py-4 px-6 whitespace-nowrap">
                <div class="space-y-1">
                  <p class="text-xs font-semibold text-slate-800">{{ item.jabatan }}</p>
                  <span 
                    :class="[
                      'inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold border',
                      item.badgeColor || item.badge_color || 'bg-slate-100 text-slate-700 border-slate-200'
                    ]"
                  >
                    {{ item.kategori }}
                  </span>
                </div>
              </td>

              <!-- Pendidikan & Kampus -->
              <td class="py-4 px-6">
                <div class="text-xs">
                  <p class="font-bold text-slate-700">{{ item.pendidikan_terakhir || '-' }}</p>
                  <p class="text-slate-400 text-[11px] line-clamp-1">{{ item.asal_kampus || '-' }}</p>
                </div>
              </td>

              <!-- Mapel / Tugas -->
              <td class="py-4 px-6 whitespace-nowrap text-xs text-slate-600 font-medium">
                {{ item.mapel || '-' }}
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

    <!-- TELEPORT 1: MODAL FORM (TAMBAH / EDIT SDM) -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
        <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 lg:p-8 shadow-2xl space-y-6">
          <div class="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 class="text-lg font-bold text-slate-900">
              {{ isEditMode ? 'Edit Data Guru / SDM' : 'Tambah SDM Baru' }}
            </h3>
            <button @click="closeModal" class="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
          </div>

          <form @submit.prevent="submitForm" class="space-y-4">
            <div v-if="!isEditMode" class="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
              ℹ️ Menambahkan SDM baru secara otomatis akan membuatkan akun User login dengan <strong>Username default</strong> (berdasarkan Nama Lengkap) dan <strong>Password default:</strong> <code class="font-mono bg-amber-100 px-1 rounded">sdywka1234</code>.
            </div>

            <!-- Nama & Gelar -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="md:col-span-2">
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Nama Lengkap</label>
                <input 
                  v-model="form.nama" 
                  type="text" 
                  required 
                  placeholder="Contoh: Mustofa Firdaus"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Gelar (Opsional)</label>
                <input 
                  v-model="form.gelar" 
                  type="text" 
                  placeholder="Contoh: S.Kom., M.Pd."
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
              </div>
            </div>

            <!-- NIP & Urutan Role -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">NIP / NIY</label>
                <input 
                  v-model="form.nip" 
                  type="text" 
                  placeholder="Nomor Induk Pegawai"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Urutan Tampilan (Role ID)</label>
                <input 
                  v-model.number="form.role" 
                  type="number" 
                  required 
                  min="1"
                  placeholder="1 = Kepala Sekolah, 2 = Wakil, dst."
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
              </div>
            </div>

            <!-- Kategori & Jabatan -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Kategori SDM</label>
                <select 
                  v-model="form.kategori" 
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                >
                  <option value="Pimpinan">Pimpinan (Kepala/Wakil Sekolah)</option>
                  <option value="Wali Kelas">Wali Kelas</option>
                  <option value="Guru Mata Pelajaran">Guru Mata Pelajaran</option>
                  <option value="Tahsin & Tahfidz">Tahsin & Tahfidz</option>
                  <option value="Staf & TU">Staf & Tata Usaha</option>
                  <option value="Office Boy">Office Boy (OB)</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Jabatan Resmi</label>
                <input 
                  v-model="form.jabatan" 
                  type="text" 
                  required 
                  placeholder="Contoh: Wali Kelas 1A / Guru TIK"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
              </div>
            </div>

            <!-- Pendidikan & Asal Kampus -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Pendidikan Terakhir</label>
                <input 
                  v-model="form.pendidikan_terakhir" 
                  type="text" 
                  placeholder="Contoh: S1 Teknik Informatika"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Asal Kampus / Sekolah</label>
                <input 
                  v-model="form.asal_kampus" 
                  type="text" 
                  placeholder="Contoh: Universitas Pasundan"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
              </div>
            </div>

            <!-- Mapel / Tugas & Warna Badge -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Bidang Tugas / Mata Pelajaran</label>
                <input 
                  v-model="form.mapel" 
                  type="text" 
                  placeholder="Contoh: TIK Kelas 1-6"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Class Tailwind Badge Warna</label>
                <input 
                  v-model="form.badge_color" 
                  type="text" 
                  placeholder="Contoh: bg-blue-900 text-amber-300"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
              </div>
            </div>

            <!-- Motto Kerja -->
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Motto / Kutipan Kerja</label>
              <textarea 
                v-model="form.motto" 
                rows="2" 
                placeholder="Motto atau kutipan kerja..."
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
              ></textarea>
            </div>

            <!-- Foto Profil SDM -->
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Foto Profil SDM</label>
              <input 
                type="file" 
                @change="handleFileUpload" 
                accept="image/*"
                class="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
              />
              <div v-if="imagePreview" class="mt-3">
                <img :src="imagePreview" alt="Preview Foto" class="w-24 h-24 object-cover rounded-xl border border-slate-200" />
              </div>
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
                {{ saving ? 'Menyimpan...' : (isEditMode ? 'Simpan Perubahan' : 'Simpan Data SDM') }}
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
          <h3 class="text-lg font-bold text-slate-900">Hapus Data SDM Ini?</h3>
          <p class="text-xs text-slate-500">
            Apakah Anda yakin ingin menghapus data "<span class="font-semibold text-slate-800">{{ selectedItemToDelete?.nama }}</span>"? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div class="flex justify-center gap-3 pt-2">
            <button 
              @click="showDeleteModal = false" 
              class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
            >
              Batal
            </button>
            <button 
              @click="hapusGuru" 
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

const API_BASE_URL = `${API_BASE}/api/admin-api/guru/`

const token = useCookie('auth_token')

const getAuthHeaders = () => ({
  Authorization: token.value ? `Bearer ${token.value}` : ''
})

const searchQuery = ref('')
const selectedKategori = ref('Semua')
const kategoriOptions = ['Semua', 'Pimpinan', 'Wali Kelas', 'Guru Mata Pelajaran', 'Tahsin & Tahfidz', 'Staf & TU', 'Office Boy']

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

const form = reactive({
  nama: '',
  gelar: '',
  nip: '',
  role: 1,
  kategori: 'Guru Mata Pelajaran',
  jabatan: '',
  pendidikan_terakhir: '',
  asal_kampus: '',
  mapel: '',
  badge_color: 'bg-blue-900 text-amber-300',
  motto: ''
})

const { data: guruData, pending, refresh } = await useFetch(API_BASE_URL, {
  headers: computed(() => getAuthHeaders()),
  watch: false,
  lazy: true
})

const filteredGuru = computed(() => {
  if (!guruData.value || !Array.isArray(guruData.value)) return []
  return guruData.value.filter(item => {
    const matchSearch = item.nama.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                        (item.nip && item.nip.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
                        (item.mapel && item.mapel.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
                        (item.jabatan && item.jabatan.toLowerCase().includes(searchQuery.value.toLowerCase()))
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
  form.nama = ''
  form.gelar = ''
  form.nip = ''
  form.role = 1
  form.kategori = 'Guru Mata Pelajaran'
  form.jabatan = ''
  form.pendidikan_terakhir = ''
  form.asal_kampus = ''
  form.mapel = ''
  form.badge_color = 'bg-blue-900 text-amber-300'
  form.motto = ''
  imageFile.value = null
  imagePreview.value = null
  showModal.value = true
}

const openModalEdit = (item) => {
  isEditMode.value = true
  editingId.value = item.id
  form.nama = item.nama || ''
  form.gelar = item.gelar || ''
  form.nip = item.nip || ''
  form.role = item.role || 1
  form.kategori = item.kategori || 'Guru Mata Pelajaran'
  form.jabatan = item.jabatan || ''
  form.pendidikan_terakhir = item.pendidikan_terakhir || ''
  form.asal_kampus = item.asal_kampus || ''
  form.mapel = item.mapel || ''
  form.badge_color = item.badge_color || 'bg-blue-900 text-amber-300'
  form.motto = item.motto || ''
  imageFile.value = null
  imagePreview.value = item.foto || null
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const submitForm = async () => {
  saving.value = true
  try {
    const formData = new FormData()
    formData.append('nama', form.nama)
    if (form.gelar) formData.append('gelar', form.gelar)
    if (form.nip) formData.append('nip', form.nip)
    formData.append('role', form.role)
    formData.append('kategori', form.kategori)
    formData.append('jabatan', form.jabatan)
    if (form.pendidikan_terakhir) formData.append('pendidikan_terakhir', form.pendidikan_terakhir)
    if (form.asal_kampus) formData.append('asal_kampus', form.asal_kampus)
    if (form.mapel) formData.append('mapel', form.mapel)
    if (form.badge_color) formData.append('badge_color', form.badge_color)
    if (form.motto) formData.append('motto', form.motto)

    if (imageFile.value) {
      formData.append('foto', imageFile.value)
    }

    if (isEditMode.value) {
      await $fetch(`${API_BASE_URL}${editingId.value}/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: formData
      })
      showAlert('Berhasil', 'Data SDM berhasil diperbarui.', 'success')
    } else {
      await $fetch(API_BASE_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData
      })
      showAlert('Berhasil Ditambahkan', 'Data SDM baru berhasil ditambahkan dan akun user telah otomatis dibuat dengan password default: sdywka1234', 'success')
    }

    closeModal()
    refresh()
  } catch (error) {
    showAlert('Gagal Menyimpan', 'Gagal menyimpan data guru/SDM. Mohon periksa kembali input Anda.', 'danger')
    console.error(error)
  } finally {
    saving.value = false
  }
}

const konfirmasiHapus = (item) => {
  selectedItemToDelete.value = item
  showDeleteModal.value = true
}

const hapusGuru = async () => {
  if (!selectedItemToDelete.value) return
  deleting.value = true
  try {
    await $fetch(`${API_BASE_URL}${selectedItemToDelete.value.id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    showDeleteModal.value = false
    showAlert('Berhasil', 'Data SDM berhasil dihapus.', 'success')
    refresh()
  } catch (error) {
    showAlert('Gagal Menghapus', 'Gagal menghapus data SDM.', 'danger')
    console.error(error)
  } finally {
    deleting.value = false
  }
}
</script>