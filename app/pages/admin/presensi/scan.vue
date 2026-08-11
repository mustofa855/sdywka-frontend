<template>
  <div class="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
    <h2 class="text-2xl font-bold text-slate-800 mb-2">Scanner Presensi Admin</h2>
    <p class="text-slate-500 mb-6">Arahkan QR Code pengguna ke kamera untuk mencatat presensi Masuk / Pulang.</p>

    <div class="aspect-square w-full max-w-md mx-auto overflow-hidden rounded-2xl border-4 border-dashed border-amber-400 bg-slate-900 relative shadow-inner">
      
      <!-- Kamera QR Stream -->
      <ClientOnly>
        <qrcode-stream v-if="!scanResult && !errorMessage" @detect="onDetect" @error="onError"></qrcode-stream>
        <template #fallback>
          <div class="flex items-center justify-center h-full text-slate-400 font-medium">
            Meminta akses kamera...
          </div>
        </template>
      </ClientOnly>

      <!-- ANIMASI FITUR 2: Sinar Laser Scanning pada Kamera -->
      <div v-if="!scanResult && !errorMessage && !loading" class="absolute inset-0 pointer-events-none overflow-hidden z-10">
        <div class="w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#f59e0b] animate-scan"></div>
        <!-- Target Frame Corners -->
        <div class="absolute inset-12 border-2 border-amber-400/30 rounded-xl pointer-events-none"></div>
      </div>

      <!-- ANIMASI FITUR 3: Loading Selesai Scan -->
      <Transition name="fade">
        <div v-if="loading" class="absolute inset-0 bg-slate-900/85 backdrop-blur-sm flex flex-col items-center justify-center text-white z-20">
          <div class="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p class="text-sm font-bold tracking-wide animate-pulse">Memproses presensi...</p>
        </div>
      </Transition>

      <!-- ANIMASI FITUR 3: Overlay Hasil BERHASIL Scan (Masuk / Pulang) -->
      <Transition name="pop">
        <div v-if="scanResult" 
          class="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center z-30 backdrop-blur-md"
          :class="scanResult.type === 'pulang' ? 'bg-indigo-600/95' : 'bg-emerald-600/95'">
          
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

      <!-- ANIMASI FITUR 3: Overlay Hasil GAGAL Scan -->
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
import { ref, onUnmounted } from 'vue'
import { QrcodeStream } from 'vue-qrcode-reader'

definePageMeta({ layout: 'admin' })

const scanResult = ref(null)
const errorMessage = ref(null)
const loading = ref(false)
let autoResetTimer = null

// Fungsi pemanggil timer reset 3 detik
const triggerAutoReset = () => {
  if (autoResetTimer) clearTimeout(autoResetTimer)
  autoResetTimer = setTimeout(() => {
    resetScan()
  }, 3000)
}

const onDetect = async (detectedCodes) => {
  if (detectedCodes.length > 0 && !loading.value) {
    const rawValue = String(detectedCodes[0].rawValue).trim()
    
    loading.value = true
    errorMessage.value = null
    scanResult.value = null
    
    try {
      const config = useRuntimeConfig()
      
      let baseUrl = config.public.apiBase
      baseUrl = baseUrl.replace(/\/$/, '')
      if (!baseUrl.endsWith('/api')) {
        baseUrl = `${baseUrl}/api`
      }

      const authToken = useCookie('auth_token')
      const token = authToken.value || (process.client ? localStorage.getItem('access_token') : '')

      const response = await $fetch(`${baseUrl}/admin-api/presensi/scan/`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        },
        body: { uuid: rawValue }
      })

      scanResult.value = response
      triggerAutoReset() // Jalankan hitung mundur 3 detik
    } catch (err) {
      console.error("Gagal mencatat presensi:", err)
      if (err.data && err.data.message) {
        errorMessage.value = err.data.message
      } else if (err.data && err.data.detail) {
        errorMessage.value = err.data.detail
      } else {
        errorMessage.value = "Terjadi kesalahan jaringan atau sistem."
      }
      triggerAutoReset() // Jalankan hitung mundur 3 detik meski gagal
    } finally {
      loading.value = false
    }
  }
}

const onError = (err) => {
  console.error("Gagal membuka kamera:", err)
  errorMessage.value = "Tidak dapat mengoperasikan kamera perangkat."
  triggerAutoReset()
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
/* Animasi Laser Scanning Vertical Line */
@keyframes scan {
  0% { transform: translateY(0); }
  50% { transform: translateY(380px); }
  100% { transform: translateY(0); }
}

.animate-scan {
  animation: scan 2.2s ease-in-out infinite;
}

/* Animasi Pop-in Modal Notifikasi */
.pop-enter-active, .pop-leave-active {
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pop-enter-from, .pop-leave-to {
  opacity: 0;
  transform: scale(0.85);
}

/* Transisi Fade */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>