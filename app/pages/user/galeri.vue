<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Header -->
    <header class="bg-blue-900 text-white p-4 md:px-6 sticky top-0 z-40 flex items-center shadow-md justify-between">
      <h1 class="text-lg md:text-xl font-bold">Galeri Saya</h1>
    </header>

    <main class="max-w-xl md:max-w-2xl mx-auto space-y-1">
      
      <!-- Profil Header Responsif -->
      <section class="bg-white p-6 md:p-8 border-b border-slate-200 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4 md:gap-6">
        <img :src="user.foto || defaultAvatar" class="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-slate-100 shadow-sm shrink-0" />
        
        <div class="flex-1 w-full">
          <h2 class="text-base md:text-lg font-bold text-slate-800">&#64;{{ user.username || 'username' }}</h2>
          <p class="text-xs md:text-sm text-slate-500 italic mt-1">"{{ user.quotes || 'bismillah ayo bisa' }}"</p>
          
          <!-- Statistik -->
          <div class="flex gap-8 mt-4 text-slate-800 border-t border-slate-100 pt-4 justify-center md:justify-start">
            <div class="text-center md:text-left">
              <p class="font-black text-lg md:text-xl">{{ userPosts.length }}</p>
              <p class="text-[10px] md:text-xs text-slate-500 uppercase font-semibold">Kiriman</p>
            </div>
            <div class="text-center md:text-left">
              <p class="font-black text-lg md:text-xl">{{ totalLikes }}</p>
              <p class="text-[10px] md:text-xs text-slate-500 uppercase font-semibold">Total Suka</p>
            </div>
          </div>
        </div>
      </section>

      <!-- State Loading -->
      <div v-if="isLoading" class="p-8 text-center space-y-2">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
        <p class="text-xs text-slate-500 font-semibold">Memuat galeri kiriman...</p>
      </div>

      <!-- Feed / Grid Postingan User -->
      <section v-else-if="userPosts.length > 0" class="grid grid-cols-3 md:grid-cols-4 gap-0.5 bg-slate-200">
        <div 
          v-for="post in userPosts" 
          :key="post.id" 
          @click="openPostDetail(post)"
          class="aspect-square relative group cursor-pointer overflow-hidden bg-white"
        >
          <img :src="post.gambar" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
          
          <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 group-active:opacity-100 flex items-center justify-center gap-4 transition-opacity duration-200">
            <span class="text-white text-xs md:text-sm font-bold flex items-center gap-1">
              ❤️ {{ post.likes_count }}
            </span>
            <span class="text-white text-xs md:text-sm font-bold flex items-center gap-1">
              💬 {{ post.comments_count }}
            </span>
          </div>
        </div>
      </section>

      <!-- State Kosong -->
      <div v-else class="bg-white p-12 text-center text-slate-400 space-y-2">
        <svg class="w-12 h-12 mx-auto stroke-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <p class="text-xs font-semibold">Belum ada postingan. Tekan tombol + di bawah untuk mengunggah foto!</p>
      </div>

    </main>

    <!-- MODAL DETAIL POSTINGAN (DENGAN TITIK 3 HAPUS POST) -->
    <div v-if="selectedPost" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div class="bg-white rounded-3xl max-w-sm md:max-w-md w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        <!-- Header Modal + Menu Options (Titik 3) -->
        <div class="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <div class="flex items-center gap-2.5">
            <img :src="selectedPost.user_foto || defaultAvatar" class="w-8 h-8 rounded-full object-cover border border-slate-200" />
            <div>
              <p class="text-xs font-bold text-slate-800">&#64;{{ selectedPost.user_username }}</p>
              <p class="text-[10px] text-slate-400">{{ formatDate(selectedPost.tanggal_upload) }}</p>
            </div>
          </div>

          <div class="flex items-center gap-1">
            <!-- Tombol Options Titik 3 -->
            <div class="relative">
              <button 
                @click.stop="isOptionMenuOpen = !isOptionMenuOpen" 
                class="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-200/60 transition"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                </svg>
              </button>

              <!-- Dropdown Menu Options -->
              <div 
                v-if="isOptionMenuOpen" 
                class="absolute right-0 top-8 bg-white border border-slate-100 shadow-xl rounded-xl py-1.5 w-36 z-30 animate-fade-in"
              >
                <button 
                  @click="confirmDeletePost(selectedPost)" 
                  class="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  Hapus Post
                </button>
              </div>
            </div>

            <!-- Tombol Tutup Modal -->
            <button @click="selectedPost = null" class="text-slate-400 hover:text-slate-600 p-1.5">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Scrollable Body -->
        <div class="overflow-y-auto flex-1 space-y-3 p-4">
          <div class="rounded-2xl overflow-hidden bg-slate-900 aspect-square">
            <img :src="selectedPost.gambar" class="w-full h-full object-contain" />
          </div>

          <div class="flex items-center justify-between pt-1">
            <button 
              @click="toggleLikePost(selectedPost)" 
              class="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition active:scale-95 cursor-pointer"
              :class="selectedPost.is_liked ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
            >
              <span>{{ selectedPost.is_liked ? '❤️ Suka' : '🤍 Sukai' }}</span>
              <span class="bg-white/80 px-1.5 py-0.5 rounded-full text-[10px] shadow-xs">{{ selectedPost.likes_count }}</span>
            </button>

            <span class="text-xs text-slate-500 font-medium">💬 {{ selectedPost.comments_count }} Komentar</span>
          </div>

          <div v-if="selectedPost.caption" class="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700">
            <span class="font-bold text-slate-900 mr-1">&#64;{{ selectedPost.user_username }}:</span>
            <span>{{ selectedPost.caption }}</span>
          </div>

          <div class="space-y-2 pt-2 border-t border-slate-100">
            <h4 class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Komentar</h4>
            
            <div v-if="selectedPost.comments && selectedPost.comments.length > 0" class="space-y-2">
              <div v-for="c in selectedPost.comments" :key="c.id" class="flex gap-2.5 items-start text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <img :src="c.user_foto || defaultAvatar" class="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5" />
                <div class="flex-1">
                  <p class="font-bold text-slate-800 text-[11px]">&#64;{{ c.username }}</p>
                  <p class="text-slate-600 mt-0.5 text-[11px]">{{ c.teks }}</p>
                </div>
              </div>
            </div>
            
            <p v-else class="text-[11px] text-slate-400 italic text-center py-2">Belum ada komentar. Jadilah yang pertama!</p>
          </div>
        </div>

        <!-- Input Komentar Baru -->
        <div class="p-3 bg-slate-50 border-t border-slate-100 shrink-0">
          <form @submit.prevent="submitComment" class="flex gap-2">
            <input 
              v-model="newCommentText" 
              type="text" 
              placeholder="Tulis komentar..." 
              required
              class="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
            />
            <button 
              type="submit" 
              :disabled="isSubmittingComment" 
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition disabled:opacity-50"
            >
              Kirim
            </button>
          </form>
        </div>

      </div>
    </div>

    <!-- MODAL KONFIRMASI HAPUS POSTINGAN (DENGAN LOADING & ANTI-SPAM) -->
    <div 
      v-if="isDeleteModalOpen" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in"
      @click.self="!isDeletingPost && cancelDeletePost()"
    >
      <div class="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center relative animate-fade-in">
        <!-- Tombol Tutup (X) -->
        <button 
          @click="cancelDeletePost" 
          :disabled="isDeletingPost"
          class="absolute right-4 top-4 text-slate-400 hover:text-slate-600 disabled:opacity-40"
        >
          ✕
        </button>

        <!-- Icon Tempat Sampah -->
        <div class="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </div>

        <div>
          <h3 class="text-base font-bold text-slate-800">Hapus Postingan?</h3>
          <p class="text-xs text-slate-500 mt-1 leading-relaxed">
            Apakah Anda yakin ingin menghapus postingan ini? Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>

        <!-- Pesan Error (jika gagal) -->
        <p v-if="deletePostError" class="text-xs text-rose-500 font-semibold">{{ deletePostError }}</p>

        <!-- Tombol Aksi Batal & Hapus -->
        <div class="flex gap-2 pt-2">
          <button 
            @click="cancelDeletePost" 
            :disabled="isDeletingPost"
            class="flex-1 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition disabled:opacity-50 cursor-pointer"
          >
            Batal
          </button>
          <button 
            @click="executeDeletePost" 
            :disabled="isDeletingPost"
            class="flex-1 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 rounded-xl transition shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg v-if="isDeletingPost" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isDeletingPost ? 'Menghapus...' : 'Ya, Hapus' }}</span>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

definePageMeta({ layout: 'user' })

const config = useRuntimeConfig()
const API_BASE = config.public.apiBase
const authToken = useCookie('auth_token')

const defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'
const isLoading = ref(true)

const user = reactive({
  username: '',
  quotes: '',
  foto: ''
})

const userPosts = ref([])
const selectedPost = ref(null)
const isOptionMenuOpen = ref(false)
const newCommentText = ref('')
const isSubmittingComment = ref(false)

// STATE MODAL HAPUS POSTINGAN & LOADING
const isDeleteModalOpen = ref(false)
const postToDelete = ref(null)
const isDeletingPost = ref(false)
const deletePostError = ref('')

const totalLikes = computed(() => {
  return userPosts.value.reduce((acc, curr) => acc + (curr.likes_count || 0), 0)
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  const d = new Date(dateString)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

const fetchData = async () => {
  isLoading.value = true
  try {
    const userData = await $fetch(`${API_BASE}/api/auth/me/`, {
      headers: { Authorization: `Bearer ${authToken.value}` }
    })
    user.username = userData.username
    user.quotes = userData.quotes
    user.foto = userData.foto

    const posts = await $fetch(`${API_BASE}/api/user-api/posts/me/`, {
      headers: { Authorization: `Bearer ${authToken.value}` }
    })
    userPosts.value = posts
  } catch (err) {
    console.error('Gagal memuat data galeri:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (!authToken.value) {
    return navigateTo('/login')
  }
  fetchData()
  window.addEventListener('click', () => {
    isOptionMenuOpen.value = false
  })
})

const openPostDetail = (post) => {
  selectedPost.value = { ...post }
  isOptionMenuOpen.value = false
}

// BUKA MODAL KONFIRMASI HAPUS
const confirmDeletePost = (post) => {
  postToDelete.value = post
  deletePostError.value = ''
  isDeleteModalOpen.value = true
  isOptionMenuOpen.value = false
}

// BATAL HAPUS POST
const cancelDeletePost = () => {
  if (isDeletingPost.value) return
  isDeleteModalOpen.value = false
  postToDelete.value = null
  deletePostError.value = ''
}

// EKSEKUSI HAPUS POST KE SERVER DENGAN LOADING & ANTI-SPAM
const executeDeletePost = async () => {
  if (!postToDelete.value || isDeletingPost.value) return

  isDeletingPost.value = true
  deletePostError.value = ''

  try {
    await $fetch(`${API_BASE}/api/user-api/posts/${postToDelete.value.id}/`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken.value}` }
    })

    userPosts.value = userPosts.value.filter(p => p.id !== postToDelete.value.id)
    selectedPost.value = null
    isDeleteModalOpen.value = false
    postToDelete.value = null
  } catch (err) {
    deletePostError.value = err.data?.message || 'Gagal menghapus postingan. Silakan coba lagi.'
  } finally {
    isDeletingPost.value = false
  }
}

const toggleLikePost = async (post) => {
  try {
    const res = await $fetch(`${API_BASE}/api/user-api/posts/${post.id}/like/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken.value}` }
    })

    selectedPost.value.is_liked = res.is_liked
    selectedPost.value.likes_count = res.likes_count

    const target = userPosts.value.find(p => p.id === post.id)
    if (target) {
      target.is_liked = res.is_liked
      target.likes_count = res.likes_count
    }
  } catch (err) {
    console.error('Gagal menyukai postingan:', err)
  }
}

const submitComment = async () => {
  if (!newCommentText.value.trim() || !selectedPost.value) return
  isSubmittingComment.value = true

  try {
    const addedComment = await $fetch(`${API_BASE}/api/user-api/posts/${selectedPost.value.id}/comments/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken.value}` },
      body: { teks: newCommentText.value.trim() }
    })

    if (!selectedPost.value.comments) {
      selectedPost.value.comments = []
    }
    selectedPost.value.comments.push(addedComment)
    selectedPost.value.comments_count += 1

    const target = userPosts.value.find(p => p.id === selectedPost.value.id)
    if (target) {
      target.comments_count += 1
    }

    newCommentText.value = ''
  } catch (err) {
    console.error('Gagal menambahkan komentar:', err)
  } finally {
    isSubmittingComment.value = false
  }
}
</script>