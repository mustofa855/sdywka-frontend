<template>
  <div class="min-h-screen bg-slate-50 pb-20">
    <!-- Header Mobile/Desktop -->
    <header class="bg-blue-900 text-white p-4 md:px-6 sticky top-0 z-40 flex items-center justify-between shadow-md">
      <div>
        <h1 class="text-lg md:text-xl font-bold">Guru, Staf & Pengguna</h1>
        <p class="text-[11px] md:text-xs text-blue-200">Direktori seluruh civitas dan pengguna SD YWKA</p>
      </div>
    </header>

    <main class="max-w-xl md:max-w-4xl mx-auto p-4 md:p-6 space-y-5">
      <!-- Kolom Pencarian -->
      <div class="bg-white rounded-2xl p-2.5 shadow-sm border border-slate-100 flex gap-2 items-center px-4">
        <svg class="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Cari nama, username, jabatan, atau bio..." 
          class="w-full bg-transparent py-2 text-sm outline-none text-slate-700 placeholder-slate-400"
        >
      </div>

      <!-- State Loading -->
      <div v-if="isLoading" class="text-center py-12 space-y-3">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
        <p class="text-xs font-semibold text-slate-500">Memuat daftar pengajar, staf & pengguna...</p>
      </div>

      <!-- State Error -->
      <div v-else-if="errorMessage" class="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-2xl text-center text-xs font-medium">
        {{ errorMessage }}
      </div>

      <!-- State Kosong / Tidak Ditemukan -->
      <div v-else-if="filteredUsers.length === 0" class="bg-white p-8 rounded-2xl text-center border border-slate-100 text-slate-500 text-xs">
        Tidak ada data pengguna yang sesuai dengan pencarian Anda.
      </div>

      <!-- List User (Responsive Grid) -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          v-for="user in filteredUsers" 
          :key="user.id" 
          @click="openUserDetail(user)"
          class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer"
        >
          <div>
            <div class="flex items-start gap-3.5">
              <!-- Foto Profil / Avatar -->
              <img 
                :src="user.foto || getFallbackAvatar(user.nama)" 
                :alt="user.nama"
                class="w-14 h-14 rounded-full object-cover border-2 border-slate-100 shrink-0 shadow-sm"
              />
              
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <h3 class="text-sm md:text-base font-bold text-slate-800 truncate group-hover:text-blue-900 transition-colors">
                    {{ user.nama }}
                  </h3>
                </div>
                
                <p class="text-xs font-semibold text-blue-600 truncate">
                  &#64;{{ user.username }}
                </p>

                <p v-if="user.jabatan" class="text-[11px] font-medium text-slate-500 mt-0.5 truncate">
                  💼 {{ user.jabatan }}
                </p>
              </div>

              <!-- Tombol Aksi / Detail -->
              <button 
                title="Lihat Profil & Postingan"
                class="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 group-hover:border-blue-100 transition shrink-0 self-start"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>

            <!-- TAMPILAN BIO / QUOTES -->
            <blockquote 
              class="mt-3.5 relative bg-gradient-to-r from-slate-50 to-blue-50/30 border-l-2 border-blue-500 rounded-r-xl p-2.5 pl-3 flex gap-2 items-start"
            >
              <svg class="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
              </svg>
              <p class="text-[11px] md:text-xs text-slate-600 italic leading-relaxed line-clamp-2">"{{ user.quotes }}"</p>
            </blockquote>
          </div>
        </div>
      </div>
    </main>

    <!-- MODAL 1: DETAIL USER & POSTINGAN USER -->
    <div 
      v-if="isUserModalOpen" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      @click.self="closeUserModal"
    >
      <div class="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-100">
        
        <!-- Modal Header Profil User -->
        <div class="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-5 md:p-6 relative">
          <button 
            @click="closeUserModal" 
            class="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          <div v-if="selectedUser" class="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <img 
              :src="selectedUser.foto || getFallbackAvatar(selectedUser.nama)" 
              :alt="selectedUser.nama" 
              class="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-white/20 shadow-md shrink-0"
            />
            <div class="text-center sm:text-left flex-1 min-w-0">
              <h2 class="text-lg md:text-xl font-bold truncate">
                {{ selectedUser.nama }}
              </h2>
              <p class="text-xs text-blue-200 mt-0.5 font-semibold">&#64;{{ selectedUser.username }}</p>
              <p class="text-xs text-amber-300 font-medium mt-0.5">💼 {{ selectedUser.jabatan }}</p>
              
              <div class="mt-2.5 text-xs text-blue-100 bg-white/10 px-3 py-2 rounded-xl italic">
                "{{ selectedUser.quotes }}"
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Body / Content Postingan User -->
        <div v-if="selectedUser" class="p-5 md:p-6 overflow-y-auto space-y-4 flex-1 bg-slate-50/50">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              Postingan  ({{ userPosts.length }})
            </h3>
          </div>

          <!-- If Loading Posts -->
          <div v-if="isLoadingUserPosts" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
            <p class="text-xs text-slate-400 mt-2">Memuat postingan karya...</p>
          </div>

          <!-- Jika User Belum Punya Postingan -->
          <div 
            v-else-if="userPosts.length === 0" 
            class="bg-white rounded-2xl p-8 text-center border border-slate-100 space-y-2"
          >
            <div class="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
              </svg>
            </div>
            <p class="text-xs font-semibold text-slate-600">Belum Ada Postingan</p>
            <p class="text-[11px] text-slate-400">Pengguna ini belum mengunggah postingan foto apa pun.</p>
          </div>

          <!-- Grid Postingan User -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div 
              v-for="post in userPosts" 
              :key="post.id"
              @click="openPostDetail(post)"
              class="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div class="relative w-full h-36 bg-slate-100 rounded-xl overflow-hidden mb-2">
                  <img 
                    v-if="post.gambar" 
                    :src="post.gambar" 
                    alt="Post" 
                    class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center text-slate-400 text-xs font-medium">
                    Tanpa Foto
                  </div>
                </div>

                <p class="text-xs text-slate-700 font-medium line-clamp-2 leading-snug">
                  {{ post.caption || 'Tanpa keterangan' }}
                </p>
              </div>

              <div class="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-50">
                <div class="flex items-center gap-3">
                  <span class="flex items-center gap-1 font-semibold" :class="post.is_liked ? 'text-rose-500' : 'text-slate-400'">
                    ❤️ {{ post.likes_count || 0 }}
                  </span>
                  <span class="flex items-center gap-1 font-semibold text-slate-500">
                    💬 {{ post.comments_count || (post.comments ? post.comments.length : 0) }}
                  </span>
                </div>
                <span>{{ formatDate(post.tanggal_upload) }}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- MODAL 2: DETAIL FEEDS POSTINGAN (INTERAKSI LIKE & KOMENTAR SANA) -->
    <div 
      v-if="isPostModalOpen" 
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
      @click.self="closePostModal"
    >
      <div class="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-100">
        
        <!-- Header Post Modal -->
        <div class="p-3.5 px-4 bg-white border-b border-slate-100 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <button 
              @click="closePostModal"
              class="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition"
              title="Kembali"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <img 
              :src="selectedPost.user_foto || getFallbackAvatar(selectedPost.user_nama)" 
              alt="User" 
              class="w-9 h-9 rounded-full object-cover border border-slate-200"
            />
            <div>
              <h4 class="text-xs font-bold text-slate-800 leading-tight">{{ selectedPost.user_nama }}</h4>
              <p class="text-[10px] text-slate-400">&#64;{{ selectedPost.user_username }} &bull; {{ formatDate(selectedPost.tanggal_upload) }}</p>
            </div>
          </div>

          <button 
            @click="closePostModal"
            class="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 transition"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Scrollable Content Feeds -->
        <div class="overflow-y-auto flex-1 space-y-3 bg-slate-50/40 p-4">
          
          <!-- Foto Post Utama -->
          <div v-if="selectedPost.gambar" class="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
            <img 
              :src="selectedPost.gambar" 
              alt="Detail Post" 
              class="w-full max-h-[380px] object-contain"
            />
          </div>

          <!-- Tombol Interaksi Suka (Like) -->
          <div class="flex items-center justify-between pt-1">
            <button 
              @click="toggleLikePost(selectedPost)" 
              class="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full transition active:scale-95 cursor-pointer shadow-xs"
              :class="selectedPost.is_liked ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'"
            >
              <span>{{ selectedPost.is_liked ? '❤️ Suka' : '🤍 Sukai' }}</span>
              <span class="bg-white/80 px-2 py-0.5 rounded-full text-[10px] shadow-xs">{{ selectedPost.likes_count || 0 }}</span>
            </button>

            <span class="text-xs text-slate-500 font-medium">💬 {{ selectedPost.comments_count || (selectedPost.comments ? selectedPost.comments.length : 0) }} Komentar</span>
          </div>

          <!-- Caption -->
          <div v-if="selectedPost.caption" class="bg-white p-3.5 rounded-2xl border border-slate-100 text-xs text-slate-700 leading-relaxed shadow-xs">
            <span class="font-bold text-slate-900 mr-1.5">&#64;{{ selectedPost.user_username }}:</span>
            <span>{{ selectedPost.caption }}</span>
          </div>

          <!-- Section Komentar -->
          <div class="space-y-2.5 pt-2 border-t border-slate-200">
            <h4 class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Diskusi & Komentar</h4>
            
            <div v-if="selectedPost.comments && selectedPost.comments.length > 0" class="space-y-2">
              <div v-for="c in selectedPost.comments" :key="c.id" class="flex gap-2.5 items-start text-xs bg-white p-3 rounded-2xl border border-slate-100 shadow-xs">
                <img :src="c.user_foto || getFallbackAvatar(c.user_nama)" class="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 border border-slate-100" />
                <div class="flex-1">
                  <p class="font-bold text-slate-800 text-[11px]">&#64;{{ c.username }}</p>
                  <p class="text-slate-600 mt-0.5 text-[11px] leading-snug">{{ c.teks }}</p>
                </div>
              </div>
            </div>
            
            <p v-else class="text-[11px] text-slate-400 italic text-center py-4 bg-white rounded-2xl border border-slate-100">
              Belum ada komentar. Berikan apresiasi atau saran pertama Anda!
            </p>
          </div>
        </div>

        <!-- Form Tambah Komentar Baru -->
        <div class="p-3 bg-white border-t border-slate-100 shrink-0">
          <form @submit.prevent="submitComment" class="flex gap-2">
            <input 
              v-model="newCommentText" 
              type="text" 
              placeholder="Tulis komentar ramah..." 
              required
              class="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition"
            />
            <button 
              type="submit" 
              :disabled="isSubmittingComment" 
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-2xl text-xs font-bold transition disabled:opacity-50 shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <span>Kirim</span>
            </button>
          </form>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

definePageMeta({ layout: 'user' })

const config = useRuntimeConfig()
const API_BASE = config.public.apiBase
const authToken = useCookie('auth_token')

const users = ref([])
const searchQuery = ref('')
const isLoading = ref(true)
const errorMessage = ref('')

const isUserModalOpen = ref(false)
const selectedUser = ref(null)
const userPosts = ref([])
const isLoadingUserPosts = ref(false)

const isPostModalOpen = ref(false)
const selectedPost = ref(null)
const newCommentText = ref('')
const isSubmittingComment = ref(false)

const getFallbackAvatar = (name) => {
  const seed = name ? encodeURIComponent(name) : 'user'
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const d = new Date(dateString)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

const fetchUsers = async () => {
  isLoading.value = true
  errorMessage.value = ''

  if (!authToken.value) {
    navigateTo('/login')
    return
  }

  try {
    const data = await $fetch(`${API_BASE}/api/user-api/users/`, {
      headers: { 
        Authorization: `Bearer ${authToken.value}` 
      }
    })
    users.value = data
  } catch (err) {
    console.error('Gagal memuat direktori user:', err)
    errorMessage.value = 'Gagal memuat daftar pengguna. Sesi Anda mungkin telah habis.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchUsers()
})

const filteredUsers = computed(() => {
  if (!searchQuery.value.trim()) return users.value
  const q = searchQuery.value.toLowerCase()
  return users.value.filter(u => 
    (u.nama && u.nama.toLowerCase().includes(q)) ||
    (u.username && u.username.toLowerCase().includes(q)) ||
    (u.jabatan && u.jabatan.toLowerCase().includes(q)) ||
    (u.quotes && u.quotes.toLowerCase().includes(q))
  )
})

const openUserDetail = async (user) => {
  selectedUser.value = user
  isUserModalOpen.value = true
  isLoadingUserPosts.value = true
  userPosts.value = []

  try {
    const posts = await $fetch(`${API_BASE}/api/user-api/posts/?user_id=${user.id}`, {
      headers: { Authorization: `Bearer ${authToken.value}` }
    })
    userPosts.value = posts
  } catch (err) {
    console.error('Gagal memuat postingan pengguna:', err)
  } finally {
    isLoadingUserPosts.value = false
  }
}

const closeUserModal = () => {
  isUserModalOpen.value = false
  selectedUser.value = null
  userPosts.value = []
}

const openPostDetail = (post) => {
  selectedPost.value = { ...post }
  isPostModalOpen.value = true
}

const closePostModal = () => {
  isPostModalOpen.value = false
  selectedPost.value = null
}

const toggleLikePost = async (post) => {
  try {
    const res = await $fetch(`${API_BASE}/api/user-api/posts/${post.id}/like/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken.value}` }
    })

    if (selectedPost.value && selectedPost.value.id === post.id) {
      selectedPost.value.is_liked = res.is_liked
      selectedPost.value.likes_count = res.likes_count
    }

    const target = userPosts.value.find(p => p.id === post.id)
    if (target) {
      target.is_liked = res.is_liked
      target.likes_count = res.likes_count
    }
  } catch (err) {
    alert('Gagal menyukai postingan.')
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
    selectedPost.value.comments_count = (selectedPost.value.comments_count || 0) + 1

    const target = userPosts.value.find(p => p.id === selectedPost.value.id)
    if (target) {
      target.comments_count = (target.comments_count || 0) + 1
    }

    newCommentText.value = ''
  } catch (err) {
    alert('Gagal mengirimkan komentar.')
  } finally {
    isSubmittingComment.value = false
  }
}
</script>