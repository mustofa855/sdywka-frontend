<template>
  <div class="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
    <h1 class="text-8xl font-black text-amber-500 mb-2">
      {{ error?.statusCode || 404 }}
    </h1>
    <h2 class="text-2xl font-bold mb-3 text-slate-200">
      {{ error?.statusCode === 404 ? 'Halaman Tidak Ditemukan' : 'Terjadi Kesalahan Server' }}
    </h2>
    <p class="text-slate-400 mb-8 max-w-md text-center">
      Maaf, halaman yang kamu tuju tidak tersedia atau terjadi kendala teknis.
    </p>
    <button 
      @click="handleError" 
      class="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition"
    >
      Kembali ke Dashboard
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  error: Object
})

const handleError = () => {
  // Fungsi built-in Nuxt untuk reset error dan redirect
  clearError({ redirect: '/admin' })
}
</script>