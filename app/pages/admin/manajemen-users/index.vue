<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <span class="text-xs font-semibold uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          Modul Keamanan & Hak Akses
        </span>
        <h2 class="text-2xl lg:text-3xl font-extrabold text-slate-900 mt-2">Manajemen User & Akun</h2>
        <p class="text-slate-500 text-sm">Kelola kredensial pengguna, profil terhubung, serta hak akses administrator & portal multi-role.</p>
      </div>

      <button 
        @click="openModalTambah" 
        class="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
      >
        <span>+ Tambah User Baru</span>
      </button>
    </div>

    <!-- Filter & Search Bar -->
    <div class="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
      <div class="w-full md:w-96">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Cari username, nama lengkap, atau email..." 
          class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
        />
      </div>

      <div class="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
        <button 
          v-for="role in roleList" 
          :key="role"
          @click="selectedRole = role"
          :class="[
            'px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap',
            selectedRole === role 
              ? 'bg-slate-900 text-white' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          ]"
        >
          {{ role }}
        </button>
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <!-- Loading State -->
      <div v-if="pending" class="text-center py-20 text-slate-400 font-medium">
        Memuat data user & akun...
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredUsers.length === 0" class="text-center py-20 text-slate-400">
        <p class="text-base font-semibold">Tidak ada data user ditemukan</p>
        <p class="text-xs mt-1">Coba ubah kata kunci pencarian atau tambahkan user baru.</p>
      </div>

      <!-- Table View -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-100 bg-slate-50/50 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              <th class="py-4 px-6">Pengguna</th>
              <th class="py-4 px-6">Email</th>
              <th class="py-4 px-6">Hak Akses Portal</th>
              <th class="py-4 px-6">Motto / Bio</th>
              <th class="py-4 px-6">Status</th>
              <th class="py-4 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-sm">
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-slate-50/60 transition">
              <!-- Avatar & Nama Pengguna -->
              <td class="py-4 px-6">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-800 shadow-sm overflow-hidden relative">
                    <img 
                      v-if="user.profil?.foto_profil" 
                      :src="user.profil.foto_profil" 
                      @error="(e) => e.target.style.display = 'none'"
                      class="w-full h-full object-cover absolute inset-0 z-10" 
                      alt="Avatar" 
                    />
                    <span class="relative z-0">{{ getInitials(getNamaLengkap(user)) }}</span>
                  </div>
                  <div>
                    <p class="font-bold text-slate-900 line-clamp-1 max-w-xs">{{ getNamaLengkap(user) }}</p>
                    <p class="text-xs text-slate-400 font-mono mt-0.5">@{{ user.username }}</p>
                  </div>
                </div>
              </td>

              <!-- Email -->
              <td class="py-4 px-6 text-xs text-slate-600">
                {{ user.email || '-' }}
              </td>

              <!-- Hak Akses (Badges Multi-Role) -->
              <td class="py-4 px-6">
                <div class="flex flex-wrap items-center gap-1.5">
                  <span 
                    v-if="user.is_staff" 
                    class="px-2.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-[11px] font-bold inline-flex items-center gap-1"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                    Admin
                  </span>
                  
                  <span 
                    v-if="getUserSecondaryRole(user) === 'guru'" 
                    class="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-[11px] font-bold inline-flex items-center gap-1"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    Guru
                  </span>

                  <span 
                    v-else-if="getUserSecondaryRole(user) === 'staf'" 
                    class="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-bold inline-flex items-center gap-1"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Staf / TU
                  </span>

                  <span 
                    v-else 
                    class="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-semibold inline-flex items-center gap-1"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    User biasa
                  </span>
                </div>
              </td>

              <!-- Motto / Bio -->
              <td class="py-4 px-6">
                <p class="text-xs text-slate-500 italic line-clamp-1 max-w-xs">
                  "{{ user.profil?.motto || user.guru_profile?.motto || 'Belum ada motto' }}"
                </p>
              </td>

              <!-- Status Aktif -->
              <td class="py-4 px-6">
                <span 
                  v-if="user.is_active" 
                  class="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-bold"
                >
                  Aktif
                </span>
                <span 
                  v-else 
                  class="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-bold"
                >
                  Nonaktif
                </span>
              </td>

              <!-- Action Buttons -->
              <td class="py-4 px-6 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button 
                    @click="openModalEdit(user)" 
                    class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition"
                  >
                    Edit
                  </button>
                  <button 
                    @click="konfirmasiHapus(user)" 
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

    <!-- TELEPORT 1: MODAL FORM (TAMBAH / EDIT USER) -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
        <div class="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 lg:p-8 shadow-2xl space-y-6">
          <div class="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 class="text-lg font-bold text-slate-900">
              {{ isEditMode ? 'Edit Akun Pengguna' : 'Tambah User Baru' }}
            </h3>
            <button @click="closeModal" class="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
          </div>

          <form @submit.prevent="submitForm" class="space-y-4">
            <!-- Username & Email -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Username *</label>
                <input 
                  v-model="form.username" 
                  type="text" 
                  required 
                  placeholder="misal: zayn"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email</label>
                <input 
                  v-model="form.email" 
                  type="email" 
                  placeholder="nama@email.com"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
              </div>
            </div>

            <!-- Nama Lengkap & Password -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Nama Lengkap</label>
                <input 
                  v-model="form.nama_lengkap" 
                  type="text" 
                  placeholder="Nama Lengkap"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Password {{ isEditMode ? '(Opsional)' : '*' }}
                </label>
                <input 
                  v-model="form.password" 
                  type="password" 
                  :required="!isEditMode"
                  placeholder="••••••••"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
                <p v-if="isEditMode" class="text-[11px] text-slate-400 mt-1">Kosongkan jika tidak ingin merubah password.</p>
              </div>
            </div>

            <!-- MULTI-ROLE SELECTION -->
            <div class="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label class="block text-xs font-bold text-slate-800 uppercase tracking-wider">Pengaturan Hak Akses & Role Portal</label>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <!-- Checkbox Admin -->
                <label class="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer hover:border-amber-400 transition">
                  <div>
                    <p class="text-xs font-bold text-slate-900">Akses Administrator</p>
                    <p class="text-[11px] text-slate-500">Izin masuk Dashboard Admin</p>
                  </div>
                  <input 
                    type="checkbox" 
                    v-model="form.is_staff" 
                    class="w-5 h-5 text-amber-500 rounded border-slate-300 focus:ring-amber-500" 
                  />
                </label>

                <!-- Status Aktif -->
                <label class="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer hover:border-emerald-400 transition">
                  <div>
                    <p class="text-xs font-bold text-slate-900">Status Akun Aktif</p>
                    <p class="text-[11px] text-slate-500">Bisa login ke aplikasi</p>
                  </div>
                  <input 
                    type="checkbox" 
                    v-model="form.is_active" 
                    class="w-5 h-5 text-emerald-500 rounded border-slate-300 focus:ring-emerald-500" 
                  />
                </label>
              </div>

              <!-- Selection Role Portal Sekunder -->
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1.5">Pilih Portal Pengguna / Role Sekunder:</label>
                <div class="grid grid-cols-3 gap-2">
                  <button 
                    type="button" 
                    @click="form.role_type = 'guru'"
                    :class="[
                      'py-2 px-3 rounded-lg text-xs font-bold border transition text-center',
                      form.role_type === 'guru' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    ]"
                  >
                    Guru / Pengajar
                  </button>
                  <button 
                    type="button" 
                    @click="form.role_type = 'staf'"
                    :class="[
                      'py-2 px-3 rounded-lg text-xs font-bold border transition text-center',
                      form.role_type === 'staf' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    ]"
                  >
                    Staf / TU
                  </button>
                  <button 
                    type="button" 
                    @click="form.role_type = 'user'"
                    :class="[
                      'py-2 px-3 rounded-lg text-xs font-bold border transition text-center',
                      form.role_type === 'user' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    ]"
                  >
                    User Biasa
                  </button>
                </div>
                <p class="text-[11px] text-slate-500 mt-1.5">
                  💡 *Jika centang Administrator DANKAN memilih Role Sekunder, akun ini secara otomatis menjadi MULTI-ROLE dan akan memunculkan modal pilihan portal saat login.*
                </p>
              </div>
            </div>

            <!-- Motto / Bio -->
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Motto / Bio Singkat</label>
              <textarea 
                v-model="form.motto" 
                rows="2" 
                placeholder="Tuliskan motto atau kata motivasi..."
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
              ></textarea>
            </div>

            <!-- Foto Profil Avatar -->
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Foto Profil / Avatar</label>
              <input 
                type="file" 
                @change="handleFileUpload" 
                accept="image/*"
                class="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
              />
              <div v-if="avatarPreview" class="mt-3 flex items-center gap-3">
                <img :src="avatarPreview" alt="Preview Avatar" class="w-14 h-14 object-cover rounded-xl border border-slate-200" />
                <span class="text-xs text-slate-500">Preview foto profil terpilih</span>
              </div>
            </div>

            <!-- Actions -->
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
                {{ saving ? 'Menyimpan...' : (isEditMode ? 'Simpan Perubahan' : 'Buat User Baru') }}
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
          <h3 class="text-lg font-bold text-slate-900">Hapus User Ini?</h3>
          <p class="text-xs text-slate-500">
            Apakah Anda yakin ingin menghapus akun "<span class="font-semibold text-slate-800">@{{ selectedUserToDelete?.username }}</span>"? Semua data hak akses terkait user ini akan dihapus permanen.
          </p>
          <div class="flex justify-center gap-3 pt-2">
            <button 
              @click="showDeleteModal = false" 
              class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
            >
              Batal
            </button>
            <button 
              @click="hapusUser" 
              :disabled="deleting"
              class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-rose-600/20 disabled:opacity-50"
            >
              {{ deleting ? 'Menghapus...' : 'Ya, Hapus Akun' }}
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

const API_BASE_URL = `${API_BASE}/api/admin-api/users/`

const token = useCookie('auth_token')

const getAuthHeaders = () => ({
  Authorization: token.value ? `Bearer ${token.value}` : ''
})

const searchQuery = ref('')
const selectedRole = ref('Semua')
const roleList = ['Semua', 'Administrator', 'User biasa']

const showModal = ref(false)
const isEditMode = ref(false)
const saving = ref(false)
const editingId = ref(null)

const showDeleteModal = ref(false)
const selectedUserToDelete = ref(null)
const deleting = ref(false)

const avatarFile = ref(null)
const avatarPreview = ref(null)

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
  username: '',
  email: '',
  nama_lengkap: '',
  password: '',
  is_staff: false,
  is_active: true,
  role_type: 'guru',
  motto: ''
})

const { data: usersData, pending, refresh } = await useFetch(API_BASE_URL, {
  headers: computed(() => getAuthHeaders()),
  watch: false,
  lazy: true
})

const getNamaLengkap = (user) => {
  if (user.guru_profile && user.guru_profile.nama) {
    return user.guru_profile.nama
  }
  const full = `${user.first_name || ''} ${user.last_name || ''}`.trim()
  return full || user.username
}

const getUserSecondaryRole = (user) => {
  if (user.guru_profile) {
    const kat = (user.guru_profile.kategori || '').toLowerCase()
    return (kat.includes('staf') || kat.includes('tu')) ? 'staf' : 'guru'
  }
  return user.profil?.role_type || 'user'
}

const getInitials = (name) => {
  if (!name) return 'U'
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

const filteredUsers = computed(() => {
  if (!usersData.value || !Array.isArray(usersData.value)) return []
  return usersData.value.filter(user => {
    const nama = getNamaLengkap(user).toLowerCase()
    const uname = user.username.toLowerCase()
    const email = (user.email || '').toLowerCase()
    const q = searchQuery.value.toLowerCase()

    const matchSearch = nama.includes(q) || uname.includes(q) || email.includes(q)
    
    let matchRole = true
    if (selectedRole.value === 'Administrator') {
      matchRole = user.is_staff === true
    } else if (selectedRole.value === 'User biasa') {
      matchRole = user.is_staff === false
    }

    return matchSearch && matchRole
  })
})

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    avatarFile.value = file
    avatarPreview.value = URL.createObjectURL(file)
  }
}

const openModalTambah = () => {
  isEditMode.value = false
  editingId.value = null
  form.username = ''
  form.email = ''
  form.nama_lengkap = ''
  form.password = ''
  form.is_staff = false
  form.is_active = true
  form.role_type = 'guru'
  form.motto = ''
  avatarFile.value = null
  avatarPreview.value = null
  showModal.value = true
}

const openModalEdit = (user) => {
  isEditMode.value = true
  editingId.value = user.id
  form.username = user.username
  form.email = user.email || ''
  form.nama_lengkap = getNamaLengkap(user)
  form.password = ''
  form.is_staff = user.is_staff
  form.is_active = user.is_active
  form.role_type = getUserSecondaryRole(user)
  form.motto = user.profil?.motto || user.guru_profile?.motto || ''
  avatarFile.value = null
  avatarPreview.value = user.profil?.foto_profil || null
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const submitForm = async () => {
  saving.value = true
  try {
    const formData = new FormData()
    formData.append('username', form.username)
    formData.append('email', form.email)
    formData.append('nama_lengkap', form.nama_lengkap)
    formData.append('is_staff', form.is_staff)
    formData.append('is_active', form.is_active)
    formData.append('role_type', form.role_type)
    formData.append('motto', form.motto)

    if (form.password) {
      formData.append('password', form.password)
    }

    if (avatarFile.value) {
      formData.append('foto_profil', avatarFile.value)
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
    showAlert('Berhasil!', `Data user berhasil ${isEditMode.value ? 'diperbarui' : 'ditambahkan'}.`, 'success')
  } catch (error) {
    showAlert('Gagal Menyimpan', 'Gagal menyimpan data user. Pastikan username belum digunakan.', 'danger')
    console.error(error)
  } finally {
    saving.value = false
  }
}

const konfirmasiHapus = (user) => {
  selectedUserToDelete.value = user
  showDeleteModal.value = true
}

const hapusUser = async () => {
  if (!selectedUserToDelete.value) return
  deleting.value = true
  try {
    await $fetch(`${API_BASE_URL}${selectedUserToDelete.value.id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    showDeleteModal.value = false
    refresh()
    showAlert('Berhasil', 'User telah dihapus.', 'success')
  } catch (error) {
    showAlert('Gagal Menghapus', 'Gagal menghapus user dari sistem.', 'danger')
    console.error(error)
  } finally {
    deleting.value = false
  }
}
</script>