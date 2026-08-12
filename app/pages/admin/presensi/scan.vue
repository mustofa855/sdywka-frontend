<template>
  <div class="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Scanner Presensi Admin</h2>
        <p class="text-slate-500 text-sm">Arahkan QR Code pengguna ke kamera untuk mencatat presensi Masuk / Pulang.</p>
      </div>
      <button 
        @click="reloadCamera" 
        class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
        title="Muat ulang kamera"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span>Reset Kamera</span>
      </button>
    </div>

    <!-- AREA STREAM KAMERA -->
    <div class="aspect-square w-full max-w-md mx-auto overflow-hidden rounded-2xl border-4 border-dashed border-amber-400 bg-slate-900 relative shadow-inner flex items-center justify-center">
      
      <!-- Stream Kamera (Hanya tampil jika kamera aktif & tidak ada error perangkat) -->
      <ClientOnly>
        <qrcode-stream 
          v-if="cameraActive && !cameraError && !scanResult" 
          @detect="onDetect" 
          @error="onCameraError"
          @camera-on="onCameraReady"
        ></qrcode-stream>
        <template #fallback>
          <div class="flex flex-col items-center justify-center p-6 text-slate-400 text-center">
            <div class="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p class="font-medium text-sm">Memuat komponen scanner...</p>
          </div>
        </template>
      </ClientOnly>

      <!-- OVERLAY ERROR PERANGKAT / KAMERA GAGAL BUKA -->
      <div v-if="cameraError" class="absolute inset-0 bg-slate-900/95 p-6 flex flex-col items-center justify-center text-center z-20">
        <div class="w-14 h-14 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mb-3">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-white mb-1">Kamera Tidak Aktif</h3>
        <p class="text-xs text-slate-300 max-w-xs mb-4 leading-relaxed">{{ cameraError }}</p>
        <button 
          @click="reloadCamera" 
          class="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-lg transition-all"
        >
          Coba Buka Kamera Lagi
        </button>
      </div>

      <!-- ANIMASI LASER SCANNING -->
      <div v-if="cameraActive && !cameraError && !scanResult && !loading" class="absolute inset-0 pointer-events-none overflow-hidden z-10">
        <div class="w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#f59e0b] animate-scan"></div>
        <div class="absolute inset-12 border-2 border-amber-400/40 rounded-xl pointer-events-none"></div>
      </div>

      <!-- OVERLAY LOADING PROSES SCAN -->
      <Transition name="fade">
        <div v-if="loading" class="absolute inset-0 bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center text-white z-20">
          <div class="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p class="text-sm font-bold tracking-wide animate-pulse">Memproses presensi...</p>
        </div>
      </Transition>

      <!-- OVERLAY RESULT: BERHASIL -->
      <Transition name="pop">
        <div 
          v-if="scanResult" 
          class="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center z-30 backdrop-blur-md"
          :class="scanResult.type === 'pulang' ? 'bg-indigo-600/95' : 'bg-emerald-600/95'"
        >
          <div class="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-3 animate-bounce shadow-lg">
            <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h3 class="text-2xl font-black tracking-wider uppercase">
            {{ scanResult.type === 'pulang' ? 'PRESENSI PULANG' : 'PRESENSI HADIR' }}
          </h3>
          <p class="text-xl font-bold mt-1">{{ scanResult.nama_pengguna }}</p>

          <div class="mt-3 bg-white/20 px-4 py-2 rounded-xl text-sm font-mono font-medium border border-white/30 shadow-sm">
            <template v-if="scanResult.type === 'pulang'">
              Jam Pulang: {{ scanResult.waktu_pulang }} WIB
            </template>
            <template v-else>
              {{ scanResult.data?.status || scanResult.status_kehadiran }} ({{ scanResult.data?.waktu_formatted || scanResult.waktu_scan }})
            </template>
          </div>

          <p class="text-xs text-white/80 mt-4 font-medium flex items-center gap-1">
            <svg class="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Kamera otomatis siap dalam 3 detik...
          </p>
        </div>
      </Transition>

      <!-- OVERLAY RESULT: GAGAL PRESENSI (RESPON BACKEND) -->
      <Transition name="pop">
        <div v-if="errorMessage" class="absolute inset-0 bg-rose-600/95 backdrop-blur-md flex flex-col items-center justify-center text-white p-6 text-center z-30">
          <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3 animate-pulse">
            <span class="text-3xl font-bold">✕</span>
          </div>
          <h3 class="text-xl font-bold uppercase tracking-wider">Gagal Presensi</h3>
          <p class="text-sm mt-2 font-medium px-2 leading-relaxed">{{ errorMessage }}</p>

          <p class="text-xs text-rose-100/80 mt-4 font-medium flex items-center gap-1">
            <svg class="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Kamera otomatis siap dalam 3 detik...
          </p>
        </div>
      </Transition>

    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted, nextTick } from 'vue'
import { QrcodeStream } from 'vue-qrcode-reader'

definePageMeta({ layout: 'admin' })

const scanResult = ref(null)
const errorMessage = ref(null)
const cameraError = ref(null)
const cameraActive = ref(true)
const loading = ref(false)
let autoResetTimer = null

const getBaseUrl = () => {
  const config = useRuntimeConfig()
  let baseUrl = config.public.apiBase || 'http://localhost:8000'
  baseUrl = baseUrl.replace(/\/$/, '')
  if (!baseUrl.endsWith('/api')) {
    baseUrl = `${baseUrl}/api`
  }
  return baseUrl
}

const getAuthToken = () => {
  const cookieToken = useCookie('auth_token').value || useCookie('access_token').value
  if (cookieToken) return cookieToken
  if (process.client) {
    return localStorage.getItem('access_token') || localStorage.getItem('auth_token') || ''
  }
  return ''
}

const triggerAutoReset = () => {
  if (autoResetTimer) clearTimeout(autoResetTimer)
  autoResetTimer = setTimeout(() => {
    resetScan()
  }, 3000)
}

const onCameraReady = () => {
  cameraError.value = null
}

const onCameraError = (err) => {
  console.error("Gagal membuka kamera:", err)
  if (err.name === 'NotAllowedError') {
    cameraError.value = "Izin akses kamera ditolak. Izinkan akses kamera pada browser Anda."
  } else if (err.name === 'NotFoundError') {
    cameraError.value = "Tidak menemukan perangkat kamera pada perangkat ini."
  } else if (err.name === 'NotSupportedError') {
    cameraError.value = "Kamera membutuhkan koneksi aman (HTTPS atau localhost)."
  } else {
    cameraError.value = "Gagal mengoperasikan kamera. Pastikan kamera tidak dipakai aplikasi lain."
  }
}

const reloadCamera = async () => {
  cameraActive.value = false
  cameraError.value = null
  scanResult.value = null
  errorMessage.value = null
  await nextTick()
  cameraActive.value = true
}

const onDetect = async (detectedCodes) => {
  if (!detectedCodes || detectedCodes.length === 0 || loading.value) return

  const rawValue = String(detectedCodes[0].rawValue).trim()
  if (!rawValue) return

  loading.value = true
  errorMessage.value = null
  scanResult.value = null

  try {
    const baseUrl = getBaseUrl()
    const token = getAuthToken()

    const response = await $fetch(`${baseUrl}/admin-api/presensi/scan/`, {
      method: 'POST',
      headers: {
        'Authorization': token ? (token.startsWith('Bearer ') ? token : `Bearer ${token}`) : '',
        'Content-Type': 'application/json'
      },
      body: { uuid: rawValue }
    })

    scanResult.value = response
    triggerAutoReset()
  } catch (err) {
    console.error("Gagal mencatat presensi:", err)
    if (err.data && err.data.message) {
      errorMessage.value = err.data.message
    } else if (err.data && err.data.detail) {
      errorMessage.value = err.data.detail
    } else {
      errorMessage.value = "Terjadi kesalahan jaringan atau QR tidak terdaftar."
    }
    triggerAutoReset()
  } finally {
    loading.value = false
  }
}

const resetScan = () => {
  if (autoResetTimer) clearTimeout(autoResetTimer)
  scanResult.value = null
  errorMessage.value = null
  loading.value = false
}

onUnmounted(() => {
  if (autoResetTimer) clearTimeout(autoResetTimer)
})
</script>

<style scoped>
@keyframes scan {
  0% { transform: translateY(0); }
  50% { transform: translateY(380px); }
  100% { transform: translateY(0); }
}

.animate-scan {
  animation: scan 2.2s ease-in-out infinite;
}

.pop-enter-active, .pop-leave-active {
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pop-enter-from, .pop-leave-to {
  opacity: 0;
  transform: scale(0.85);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>