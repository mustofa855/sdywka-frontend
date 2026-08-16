<template>
  <div class="min-h-screen bg-slate-50 pb-20">
    <!-- Header -->
    <header class="bg-blue-900 text-white p-4 md:px-6 sticky top-0 z-30 flex justify-between items-center shadow-md">
      <h1 class="text-lg md:text-xl font-bold tracking-wide">Beranda YWKA</h1>
    </header>

    <main class="max-w-xl md:max-w-2xl mx-auto p-4 md:p-6 space-y-5">
      
      <!-- Kartu Identitas & QR Code -->
      <section class="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-slate-100 flex items-center justify-between">
        <div class="flex items-center gap-3 md:gap-4">
          <img :src="user.foto || defaultAvatar" alt="Profil" class="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border border-slate-200" />
          <div>
            <h2 class="text-sm md:text-base font-bold text-slate-800">&#64;{{ user.username || 'user' }}</h2>
            <p class="text-[11px] md:text-xs text-slate-500 italic mt-0.5">"{{ user.quotes || 'bismillah ayo bisa' }}"</p>
          </div>
        </div>

        <div class="flex flex-col items-center">
          <div class="p-1.5 border border-dashed border-slate-300 rounded-lg bg-slate-50">
            <ClientOnly>
              <qrcode-vue :value="user.qr_uuid || 'N/A'" :size="45" level="L" />
            </ClientOnly>
          </div>
          <span class="text-[8px] md:text-[9px] text-slate-400 mt-1 font-bold uppercase tracking-wider">Scan Presensi</span>
        </div>
      </section>

      <!-- ========================================== -->
      <!-- SECTION INSTAGRAM NOTES (HORIZONTAL BAR)   -->
      <!-- ========================================== -->
      <section class="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <div class="flex items-center justify-between mb-2 px-1">
          <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Notes</span>
          <span class="text-[10px] text-blue-600 font-semibold flex items-center gap-1">🕒 Otomatis Hilang</span>
        </div>

        <!-- Horizontal Scrollable Bar dengan Padding Top secukupnya -->
        <div class="flex items-start gap-4 overflow-x-auto pb-2 pt-2 scrollbar-none">
          
          <!-- Tombol Buat Note Saya (Avatar + Icon Plus) -->
          <div class="flex flex-col items-center shrink-0 w-20 cursor-pointer group" @click="openCreateNoteModal">
            <!-- Bubble Slot (Dibuat h-10 agar sejajar presisi dengan note lain) -->
            <div class="h-10 flex items-end justify-center relative w-full mb-1.5">
              <div class="bg-slate-800 text-white text-[9px] font-semibold px-2 py-1 rounded-full whitespace-nowrap shadow-xs relative z-10 group-hover:bg-blue-600 transition">
                Buat Note
                <!-- Panah Gelembung Bawah -->
                <div class="w-1.5 h-1.5 bg-slate-800 rotate-45 absolute -bottom-0.5 left-1/2 -translate-x-1/2 z-0 group-hover:bg-blue-600"></div>
              </div>
            </div>

            <!-- Avatar Slot -->
            <div class="relative w-14 h-14">
              <img :src="user.foto || defaultAvatar" class="w-14 h-14 rounded-full object-cover border-2 border-dashed border-blue-400 p-0.5 group-hover:scale-105 transition" />
              <div class="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 border-2 border-white shadow-xs">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path>
                </svg>
              </div>
            </div>

            <!-- Label Username -->
            <span class="text-[10px] font-semibold text-slate-600 text-center truncate max-w-full mt-1.5">Anda</span>
          </div>

          <!-- Daftar Note Pengguna Lain / Saya yang Aktif -->
          <div 
            v-for="note in textStatuses" 
            :key="note.id" 
            @click="openNoteDetail(note)"
            class="flex flex-col items-center shrink-0 w-20 cursor-pointer group"
          >
            <!-- Bubble Slot (Dibuat h-10 agar tinggi slot konsisten) -->
            <div class="h-10 flex items-end justify-center relative w-full mb-1.5">
              <div class="bg-white border border-slate-200 shadow-sm rounded-xl px-2 py-1 text-[10px] text-slate-800 font-medium text-center line-clamp-2 max-w-[80px] leading-tight relative z-10 group-hover:border-blue-400 group-hover:scale-105 transition">
                {{ note.teks }}
                <!-- Panah Gelembung Bawah -->
                <div class="w-1.5 h-1.5 bg-white border-b border-r border-slate-200 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2 group-hover:border-blue-400"></div>
              </div>
            </div>

            <!-- Avatar User -->
            <div class="relative w-14 h-14">
              <img :src="note.user_foto || defaultAvatar" class="w-14 h-14 rounded-full object-cover border-2 border-blue-500 p-0.5 shadow-sm group-hover:scale-105 transition" />
            </div>
            
            <!-- Label Username -->
            <span class="text-[10px] font-semibold text-slate-700 text-center truncate max-w-full mt-1.5">
              &#64;{{ note.username }}
            </span>
          </div>

        </div>
      </section>

      <!-- ========================================== -->
      <!-- TIMELINE FEED POSTINGAN (FOTO & CAPTION)  -->
      <!-- ========================================== -->
      <section class="space-y-4">
        <!-- Loading State Feed -->
        <div v-if="isLoadingFeed" class="bg-white rounded-2xl p-8 text-center space-y-2 border border-slate-100">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
          <p class="text-xs text-slate-500 font-semibold">Memuat feed postingan...</p>
        </div>

        <!-- Post Feed Looping -->
        <template v-else-if="feed.length > 0">
          <article v-for="post in feed" :key="post.id" class="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-slate-100">
            
            <!-- Post Header + Menu Titik 3 -->
            <div class="flex items-center justify-between mb-3 relative">
              <div class="flex items-center gap-3">
                <img :src="post.user_foto || defaultAvatar" class="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover border border-slate-100" />
                <div>
                  <p class="text-xs md:text-sm font-bold text-slate-800">&#64;{{ post.user_username }}</p>
                  <p class="text-[10px] md:text-xs text-slate-400">{{ formatDate(post.tanggal_upload) }}</p>
                </div>
              </div>

              <!-- Tombol Titik 3 (Option Action) -->
              <div class="relative">
                <button 
                  @click.stop="togglePostMenu(post.id)"
                  class="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                  </svg>
                </button>

                <!-- Dropdown Menu Options -->
                <div 
                  v-if="activePostMenuId === post.id" 
                  class="absolute right-0 top-8 bg-white border border-slate-100 shadow-xl rounded-xl py-1.5 w-36 z-20 animate-fade-in"
                >
                  <button 
                    v-if="post.user_username === user.username"
                    @click="confirmDeletePost(post)" 
                    class="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Hapus Post
                  </button>
                  <span v-else class="block px-3 py-1.5 text-[11px] text-slate-400 italic">Tidak ada opsi</span>
                </div>
              </div>

            </div>

            <!-- Caption & Foto Post -->
            <p v-if="post.caption" class="text-xs md:text-sm text-slate-700 mb-3 whitespace-pre-line leading-relaxed">{{ post.caption }}</p>
            <div v-if="post.gambar" class="rounded-xl overflow-hidden mb-3 border border-slate-100 bg-black/5 aspect-square max-h-96 flex items-center justify-center">
              <img :src="post.gambar" class="w-full h-full object-cover" />
            </div>
            
            <!-- Interaksi Postingan -->
            <div class="flex items-center gap-5 border-t border-slate-100 pt-3">
              <button 
                @click="toggleLikePost(post)"
                class="flex items-center gap-1.5 text-xs md:text-sm font-semibold transition active:scale-95 cursor-pointer"
                :class="post.is_liked ? 'text-rose-600' : 'text-slate-500 hover:text-rose-500'"
              >
                <svg 
                  class="w-5 h-5 md:w-6 md:h-6 transition-transform" 
                  :class="post.is_liked ? 'fill-rose-600 stroke-rose-600' : 'fill-none stroke-slate-400'" 
                  stroke-width="2" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
                <span>{{ post.likes_count }} Suka</span>
              </button>

              <button 
                @click="post.showComments = !post.showComments"
                class="flex items-center gap-1.5 text-xs md:text-sm text-slate-500 hover:text-blue-600 font-semibold transition active:scale-95 cursor-pointer"
              >
                <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                <span>{{ post.comments_count }} Komentar</span>
              </button>
            </div>

            <!-- Seksi Komentar -->
            <div v-if="post.showComments" class="mt-3 pt-3 border-t border-slate-100 space-y-3">
              <div v-if="post.comments && post.comments.length > 0" class="space-y-2">
                <div v-for="c in post.comments" :key="c.id" class="text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-start gap-2">
                  <img :src="c.user_foto || defaultAvatar" class="w-5 h-5 rounded-full object-cover shrink-0 mt-0.5" />
                  <div class="flex-1">
                    <span class="font-bold text-slate-800 block">&#64;{{ c.username }}</span>
                    <span class="text-slate-600 mt-0.5 block">{{ c.teks }}</span>
                  </div>
                </div>
              </div>
              <p v-else class="text-[11px] text-slate-400 italic py-1">Belum ada komentar.</p>

              <form @submit.prevent="addComment(post)" class="flex gap-2 items-center pt-1">
                <input 
                  v-model="post.newCommentText" 
                  type="text" 
                  placeholder="Tulis komentar..." 
                  required
                  class="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                />
                <button 
                  type="submit"
                  :disabled="!post.newCommentText?.trim()" 
                  class="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl transition disabled:opacity-40 cursor-pointer"
                >
                  Kirim
                </button>
              </form>
            </div>

          </article>
        </template>

        <div v-else class="bg-white rounded-2xl p-12 text-center text-slate-400 space-y-2 border border-slate-100">
          <svg class="w-12 h-12 mx-auto stroke-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
          <p class="text-xs font-semibold">Belum ada postingan di beranda.</p>
        </div>
      </section>

    </main>

    <!-- ========================================== -->
    <!-- MODAL 1: BUAT NOTE BARU                    -->
    <!-- ========================================== -->
    <div v-if="isCreateNoteModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4" @click.self="isCreateNoteModalOpen = false">
      <div class="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4 animate-fade-in">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 class="text-sm font-bold text-slate-800">Bagikan Note Baru</h3>
          <button @click="isCreateNoteModalOpen = false" class="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <div class="space-y-3">
          <textarea 
            v-model="newNoteText" 
            rows="3" 
            placeholder="Apa yang sedang Anda pikirkan? (Maksimal 120 karakter)..." 
            maxlength="120"
            class="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs md:text-sm focus:outline-none focus:border-blue-500"
          ></textarea>
          <p class="text-[10px] text-slate-400 text-right">{{ newNoteText.length }}/120 Karakter</p>
        </div>

        <div class="flex gap-2 justify-end pt-2">
          <button @click="isCreateNoteModalOpen = false" class="px-4 py-2 text-xs font-bold text-slate-500 rounded-xl hover:bg-slate-100">
            Batal
          </button>
          <button 
            @click="handlePublishStatus" 
            :disabled="!newNoteText.trim() || isPublishingStatus" 
            class="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl transition"
          >
            Posting
          </button>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- MODAL 2: TAMPILAN DETAIL NOTE & HAPUS NOTE -->
    <!-- ========================================== -->
    <div v-if="selectedNote" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4" @click.self="selectedNote = null">
      <div class="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center animate-fade-in relative">
        <button @click="selectedNote = null" class="absolute right-4 top-4 text-slate-400 hover:text-slate-600">✕</button>
        
        <img :src="selectedNote.user_foto || defaultAvatar" class="w-16 h-16 rounded-full object-cover border-2 border-blue-500 mx-auto" />
        
        <div>
          <h3 class="text-sm font-bold text-slate-800">&#64;{{ selectedNote.username }}</h3>
          <p class="text-[10px] text-slate-400">{{ selectedNote.waktu }}</p>
        </div>

        <div class="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-xs text-blue-950 font-medium leading-relaxed">
          "{{ selectedNote.teks }}"
        </div>

        <!-- Suka & Hapus Actions -->
        <div class="flex items-center justify-center gap-3 pt-2">
          <button 
            @click="toggleLikeNote(selectedNote)" 
            class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition active:scale-95"
            :class="selectedNote.is_liked ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600'"
          >
            <span>{{ selectedNote.is_liked ? '❤️' : '🤍' }}</span>
            <span>{{ selectedNote.likes_count }} Suka</span>
          </button>

          <!-- Tombol Hapus Note jika Milik Sendiri -->
          <button 
            v-if="selectedNote.username === user.username"
            @click="deleteNote(selectedNote)" 
            class="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition flex items-center gap-1"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            Hapus
          </button>
        </div>

      </div>
    </div>

    <!-- ========================================== -->
    <!-- MODAL 3: KONFIRMASI HAPUS POSTINGAN       -->
    <!-- ========================================== -->
    <div 
      v-if="isDeletePostModalOpen" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
      @click.self="!isDeletingPost && cancelDeletePost()"
    >
      <div class="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center animate-fade-in relative">
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
import { ref, reactive, onMounted } from 'vue'
import QrcodeVue from 'qrcode.vue'

definePageMeta({ layout: 'user' })

const config = useRuntimeConfig()
const API_BASE = config.public.apiBase
const authToken = useCookie('auth_token')

const defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'
const isLoadingFeed = ref(true)

const user = reactive({
  username: '',
  quotes: '',
  foto: '',
  qr_uuid: ''
})

const isCreateNoteModalOpen = ref(false)
const newNoteText = ref('')
const isPublishingStatus = ref(false)

const textStatuses = ref([])
const selectedNote = ref(null)

const feed = ref([])
const activePostMenuId = ref(null)

// STATE MODAL HAPUS POSTINGAN & ANTI-SPAM LOADING
const isDeletePostModalOpen = ref(false)
const postToDelete = ref(null)
const isDeletingPost = ref(false)
const deletePostError = ref('')

const formatDate = (dateString) => {
  if (!dateString) return 'Baru saja'
  const d = new Date(dateString)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

const togglePostMenu = (postId) => {
  activePostMenuId.value = activePostMenuId.value === postId ? null : postId
}

const fetchDashboardData = async () => {
  if (!authToken.value) {
    return navigateTo('/login')
  }

  isLoadingFeed.value = true
  try {
    // 1. Data User
    const userData = await $fetch(`${API_BASE}/api/auth/me/`, {
      headers: { Authorization: `Bearer ${authToken.value}` }
    })
    user.username = userData.username
    user.quotes = userData.quotes
    user.foto = userData.foto
    user.qr_uuid = userData.qr_uuid

    // 2. Data Notes
    const notesData = await $fetch(`${API_BASE}/api/user-api/notes/`, {
      headers: { Authorization: `Bearer ${authToken.value}` }
    })
    textStatuses.value = Array.isArray(notesData) ? notesData : (notesData?.results || [])

    // 3. Data Feed Postingan
    const postsData = await $fetch(`${API_BASE}/api/user-api/posts/`, {
      headers: { Authorization: `Bearer ${authToken.value}` }
    })
    const actualPosts = Array.isArray(postsData) ? postsData : (postsData?.results || [])

    feed.value = actualPosts.map(post => ({
      ...post,
      showComments: false,
      newCommentText: ''
    }))

  } catch (err) {
    console.error('Gagal mengambil data beranda:', err)
  } finally {
    isLoadingFeed.value = false
  }
}

onMounted(() => {
  fetchDashboardData()
  // Tutup dropdown menu jika klik sembarang tempat
  window.addEventListener('click', () => {
    activePostMenuId.value = null
  })
})

// MODALS NOTES
const openCreateNoteModal = () => {
  newNoteText.value = ''
  isCreateNoteModalOpen.value = true
}

const openNoteDetail = (note) => {
  selectedNote.value = { ...note }
}

const handlePublishStatus = async () => {
  if (!newNoteText.value.trim() || isPublishingStatus.value) return
  isPublishingStatus.value = true

  try {
    const newNote = await $fetch(`${API_BASE}/api/user-api/notes/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken.value}` },
      body: { teks: newNoteText.value.trim() }
    })

    textStatuses.value.unshift(newNote)
    isCreateNoteModalOpen.value = false
    newNoteText.value = ''
  } catch (err) {
    alert('Gagal memposting note.')
  } finally {
    isPublishingStatus.value = false
  }
}

const toggleLikeNote = async (statusItem) => {
  try {
    const res = await $fetch(`${API_BASE}/api/user-api/notes/${statusItem.id}/like/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken.value}` }
    })
    statusItem.is_liked = res.is_liked
    statusItem.likes_count = res.likes_count
    
    const target = textStatuses.value.find(n => n.id === statusItem.id)
    if (target) {
      target.is_liked = res.is_liked
      target.likes_count = res.likes_count
    }
  } catch (err) {
    alert('Gagal menyukai note.')
  }
}

const deleteNote = async (noteItem) => {
  if (!confirm('Apakah Anda yakin ingin menghapus note ini?')) return

  try {
    await $fetch(`${API_BASE}/api/user-api/notes/${noteItem.id}/`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken.value}` }
    })

    textStatuses.value = textStatuses.value.filter(n => n.id !== noteItem.id)
    selectedNote.value = null
  } catch (err) {
    alert('Gagal menghapus note.')
  }
}

// POST ACTIONS
const toggleLikePost = async (post) => {
  try {
    const res = await $fetch(`${API_BASE}/api/user-api/posts/${post.id}/like/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken.value}` }
    })
    post.is_liked = res.is_liked
    post.likes_count = res.likes_count
  } catch (err) {
    alert('Gagal menyukai postingan.')
  }
}

// MEMBUKA MODAL KONFIRMASI HAPUS POSTINGAN (MENGGANTIKAN ALERT)
const confirmDeletePost = (post) => {
  postToDelete.value = post
  deletePostError.value = ''
  isDeletePostModalOpen.value = true
  activePostMenuId.value = null // Tutup dropdown menu option
}

// BATAL HAPUS POST
const cancelDeletePost = () => {
  if (isDeletingPost.value) return // Cegah tutup modal saat proses hapus berjalan
  isDeletePostModalOpen.value = false
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

    // Filter postingan yang telah dihapus dari feed
    feed.value = feed.value.filter(p => p.id !== postToDelete.value.id)
    
    // Tutup Modal
    isDeletePostModalOpen.value = false
    postToDelete.value = null
  } catch (err) {
    deletePostError.value = err.data?.message || 'Gagal menghapus postingan. Silakan coba lagi.'
  } finally {
    isDeletingPost.value = false
  }
}

const addComment = async (post) => {
  if (!post.newCommentText || !post.newCommentText.trim()) return

  try {
    const addedComment = await $fetch(`${API_BASE}/api/user-api/posts/${post.id}/comments/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken.value}` },
      body: { teks: post.newCommentText.trim() }
    })

    if (!post.comments) post.comments = []
    post.comments.push(addedComment)
    post.comments_count += 1
    post.newCommentText = ''
  } catch (err) {
    alert('Gagal mengirim komentar.')
  }
}
</script>