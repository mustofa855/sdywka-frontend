<template>
  <div>
    <div class="flex justify-between items-end mb-6">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Riwayat Kehadiran</h2>
        <p class="text-sm text-slate-500">Rekap data kedatangan guru, staf & siswa (Retensi tersimpan 1 tahun).</p>
      </div>
      <div class="flex items-center gap-3">
        <!-- Tombol Export Excel -->
        <button 
          @click="downloadExcel" 
          :disabled="downloading"
          class="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition shadow-sm flex items-center gap-2 disabled:opacity-50"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {{ downloading ? 'Mendownload...' : 'Export Excel' }}
        </button>

        <!-- Tombol Refresh Data -->
        <button @click="fetchRiwayat" class="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-800 transition shadow-sm flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Data
        </button>
      </div>
    </div>

    <!-- Filter & Search Box -->
    <div class="bg-white p-4 rounded-t-2xl border border-slate-200/60 border-b-0 flex gap-4">
      <input 
        v-model="searchQuery" 
        @input="fetchRiwayat"
        type="text" 
        placeholder="Cari nama atau NIP/Username..." 
        class="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm w-72 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
      >
      <select 
        v-model="peranFilter" 
        @change="fetchRiwayat"
        class="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-amber-500"
      >
        <option value="">Semua Peran</option>
        <option value="Guru">Guru & Staf</option>
        <option value="Siswa">Siswa</option>
      </select>
    </div>

    <!-- Tabel Data -->
    <div class="bg-white rounded-b-2xl border border-slate-200/60 overflow-hidden shadow-sm">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
            <th class="px-6 py-4 font-bold">Pengguna</th>
            <th class="px-6 py-4 font-bold">Tanggal</th>
            <th class="px-6 py-4 font-bold">Jam Masuk</th>
            <th class="px-6 py-4 font-bold">Jam Pulang</th>
            <th class="px-6 py-4 font-bold">Peran</th>
            <th class="px-6 py-4 font-bold text-center">Status</th>
          </tr>
        </thead>
        <tbody class="text-sm divide-y divide-slate-100">
          <tr v-if="loading">
            <td colspan="6" class="text-center py-8 text-slate-400 font-medium">Loading data presensi...</td>
          </tr>
          <tr v-else-if="riwayatList.length === 0">
            <td colspan="6" class="text-center py-8 text-slate-400 font-medium">Belum ada riwayat presensi tercatat.</td>
          </tr>
          <tr v-for="item in riwayatList" :key="item.id" class="hover:bg-slate-50 transition">
            <td class="px-6 py-4">
              <div class="font-bold text-slate-800">{{ item.nama_pengguna }}</div>
              <div class="text-xs text-slate-500">{{ item.sub_info }}</div>
            </td>
            <td class="px-6 py-4 font-mono text-slate-600 font-medium">
              {{ item.tanggal_formatted || '-' }}
            </td>
            <td class="px-6 py-4 font-mono text-slate-600">{{ item.waktu_formatted }}</td>
            <td class="px-6 py-4 font-mono">
              <span :class="item.waktu_pulang_formatted !== '-' ? 'text-emerald-600 font-bold' : 'text-slate-400 italic'">
                {{ item.waktu_pulang_formatted }}
              </span>
            </td>
            <td class="px-6 py-4">
              <span class="px-2.5 py-1 rounded-md text-xs font-semibold"
                :class="item.peran && item.peran.includes('Guru') ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600'">
                {{ item.peran }}
              </span>
            </td>
            <td class="px-6 py-4 text-center">
              <span 
                class="px-3 py-1 rounded-full text-xs font-bold border"
                :class="item.status === 'Hadir Tepat Waktu' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-700 border-amber-200'">
                {{ item.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Footer Info -->
      <div class="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
        <span>Menampilkan {{ riwayatList.length }} data presensi</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({ layout: 'admin' })

const riwayatList = ref([])
const loading = ref(false)
const downloading = ref(false)
const searchQuery = ref('')
const peranFilter = ref('')

const getBaseUrl = () => {
  const config = useRuntimeConfig()
  let baseUrl = config.public.apiBase
  baseUrl = baseUrl.replace(/\/$/, '')
  if (!baseUrl.endsWith('/api')) {
    baseUrl = `${baseUrl}/api`
  }
  return baseUrl
}

const getAuthToken = () => {
  const authToken = useCookie('auth_token')
  return authToken.value || (process.client ? localStorage.getItem('access_token') : '')
}

const fetchRiwayat = async () => {
  loading.value = true
  try {
    const baseUrl = getBaseUrl()
    const token = getAuthToken()

    const response = await $fetch(`${baseUrl}/admin-api/presensi/riwayat/`, {
      method: 'GET',
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
      params: {
        search: searchQuery.value,
        peran: peranFilter.value
      }
    })

    riwayatList.value = response
  } catch (err) {
    console.error("Gagal memuat riwayat presensi:", err)
  } finally {
    loading.value = false
  }
}

// Fungsi Download Excel
const downloadExcel = async () => {
  downloading.value = true
  try {
    const baseUrl = getBaseUrl()
    const token = getAuthToken()

    const params = new URLSearchParams()
    if (searchQuery.value) params.append('search', searchQuery.value)
    if (peranFilter.value) params.append('peran', peranFilter.value)

    const downloadUrl = `${baseUrl}/admin-api/presensi/export-excel/?${params.toString()}`

    const res = await fetch(downloadUrl, {
      method: 'GET',
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    })

    if (!res.ok) throw new Error('Gagal mengunduh berkas Excel.')

    const blob = await res.blob()
    const blobUrl = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = `Riwayat_Presensi_${new Date().toISOString().slice(0,10)}.xlsx`
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(blobUrl)
  } catch (err) {
    console.error("Gagal mengunduh Excel:", err)
    alert("Terjadi kesalahan saat mengunduh data Excel presensi.")
  } finally {
    downloading.value = false
  }
}

onMounted(() => {
  fetchRiwayat()
})
</script>