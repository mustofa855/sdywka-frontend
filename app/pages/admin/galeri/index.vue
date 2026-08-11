<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <span class="text-xs font-semibold uppercase tracking-widest text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
          Dokumentasi & Galeri Media
        </span>
        <h2 class="text-2xl lg:text-3xl font-extrabold text-slate-900 mt-2">Manajemen Galeri & Video</h2>
        <p class="text-slate-500 text-sm">Kelola album foto kegiatan sekolah serta koleksi video dokumentasi YouTube.</p>
      </div>

      <!-- Action Button Group (Tampil Berdasarkan Tab Aktif) -->
      <div class="flex items-center gap-3">
        <button 
          v-if="activeTab === 'album'"
          @click="openModalTambahAlbum" 
          class="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
        >
          <span>+ Tambah Album Foto</span>
        </button>

        <button 
          v-if="activeTab === 'video'"
          @click="openModalTambahVideo" 
          class="px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2"
        >
          <span>+ Tambah Video Baru</span>
        </button>
      </div>
    </div>

    <!-- Tab Navigation & Filter Bar -->
    <div class="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
      <!-- Tab Switcher (Album vs Video) -->
      <div class="flex items-center bg-slate-100 p-1 rounded-xl w-full md:w-auto">
        <button 
          @click="activeTab = 'album'"
          :class="[
            'flex-1 md:flex-none px-6 py-2 rounded-lg text-xs font-bold transition',
            activeTab === 'album' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
          ]"
        >
          🖼️ Album Foto ({{ albumsList.length }})
        </button>
        <button 
          @click="activeTab = 'video'"
          :class="[
            'flex-1 md:flex-none px-6 py-2 rounded-lg text-xs font-bold transition',
            activeTab === 'video' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
          ]"
        >
          🎥 Video Dokumentasi ({{ videosList.length }})
        </button>
      </div>

      <!-- Input Pencarian & Dropdown Kategori -->
      <div class="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
        <input 
          v-model="searchQuery" 
          type="text" 
          :placeholder="activeTab === 'album' ? 'Cari album foto...' : 'Cari video...'"
          class="w-full sm:w-64 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
        />

        <select 
          v-model="selectedKategori"
          class="w-full sm:w-auto px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
        >
          <option value="Semua">Semua Kategori</option>
          <option value="Prestasi & Lomba">Prestasi & Lomba</option>
          <option value="MPLS & Orientasi">MPLS & Orientasi</option>
          <option value="Keagamaan">Keagamaan</option>
          <option value="Ekskul & Seni">Ekskul & Seni</option>
        </select>
      </div>
    </div>


    <!-- ========================================== -->
    <!-- TAB 1: GRID ALBUM FOTO                     -->
    <!-- ========================================== -->
    <div v-if="activeTab === 'album'">
      <!-- Loading State -->
      <div v-if="pendingAlbums" class="text-center py-20 text-slate-400 font-medium">
        Memuat data album foto...
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredAlbums.length === 0" class="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400">
        <p class="text-base font-semibold">Tidak ada album foto ditemukan</p>
        <p class="text-xs mt-1">Gunakan kata kunci lain atau tambahkan album galeri foto baru.</p>
      </div>

      <!-- Grid Cards View -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="album in filteredAlbums" 
          :key="album.id" 
          class="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between group"
        >
          <div>
            <!-- Gambar Cover & Badge Jumlah Foto -->
            <div class="relative h-48 bg-slate-100 overflow-hidden">
              <img 
                :src="formatImageUrl(album.cover)" 
                :alt="album.judul"
                class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                @error="(e) => e.target.src = 'https://placehold.co/600x400/f1f5f9/475569?text=Galeri+SD+YWKA'"
              />
              <span class="absolute top-3 left-3 px-3 py-1 bg-slate-900/80 backdrop-blur-md text-white rounded-lg text-[10px] font-bold uppercase tracking-wider">
                {{ album.kategori }}
              </span>
              <span class="absolute bottom-3 right-3 px-3 py-1 bg-amber-500 text-slate-950 font-extrabold rounded-lg text-xs shadow-md">
                📸 {{ album.jumlah_foto ?? album.fotos?.length ?? 0 }} Foto
              </span>
            </div>

            <!-- Detail Teks Album -->
            <div class="p-5 space-y-2">
              <p class="text-xs text-slate-400 font-medium">{{ formatTanggal(album.tanggal) }}</p>
              <h3 class="font-extrabold text-slate-900 text-lg leading-snug line-clamp-1">{{ album.judul }}</h3>
              <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {{ album.deskripsi || 'Tidak ada deskripsi tambahan.' }}
              </p>
            </div>
          </div>

          <!-- Tombol Aksi Card -->
          <div class="p-5 pt-0 flex items-center justify-between border-t border-slate-50 mt-4 pt-4">
            <button 
              @click="openKelolaFoto(album)"
              class="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-xl text-xs transition flex items-center gap-1.5"
            >
              <span>🖼️ Kelola Foto</span>
            </button>

            <div class="flex items-center gap-2">
              <button 
                @click="openModalEditAlbum(album)" 
                class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
              >
                Edit
              </button>
              <button 
                @click="konfirmasiHapusAlbum(album)" 
                class="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold rounded-xl text-xs transition"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- ========================================== -->
    <!-- TAB 2: GRID VIDEO DOKUMENTASI YOUTUBE     -->
    <!-- ========================================== -->
    <div v-if="activeTab === 'video'">
      <!-- Loading State -->
      <div v-if="pendingVideos" class="text-center py-20 text-slate-400 font-medium">
        Memuat data video galeri...
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredVideos.length === 0" class="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400">
        <p class="text-base font-semibold">Tidak ada video dokumentasi ditemukan</p>
        <p class="text-xs mt-1">Gunakan kata kunci lain atau tambahkan link YouTube video baru.</p>
      </div>

      <!-- Video Grid View -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="video in filteredVideos" 
          :key="video.id" 
          class="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between"
        >
          <div>
            <!-- Frame Player Video YouTube -->
            <div class="relative w-full aspect-video bg-black">
              <iframe 
                :src="video.embed_url" 
                title="YouTube video player" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen
                class="w-full h-full"
              ></iframe>
            </div>

            <!-- Detail Info Video -->
            <div class="p-5 space-y-2">
              <div class="flex items-center justify-between gap-2">
                <span class="px-2.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-100 rounded-md text-[10px] font-bold uppercase">
                  {{ video.kategori }}
                </span>
                <span class="text-xs text-slate-400 font-medium">{{ formatTanggal(video.tanggal) }}</span>
              </div>
              <h3 class="font-extrabold text-slate-900 text-base leading-snug line-clamp-2 mt-1">{{ video.judul }}</h3>
            </div>
          </div>

          <!-- Tombol Aksi Video -->
          <div class="p-5 pt-0 flex items-center justify-end gap-2 border-t border-slate-50 mt-2 pt-3">
            <button 
              @click="openModalEditVideo(video)" 
              class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
            >
              Edit Video
            </button>
            <button 
              @click="konfirmasiHapusVideo(video)" 
              class="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold rounded-xl text-xs transition"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>


    <!-- ========================================== -->
    <!-- MODAL 1: FORM TAMBAH / EDIT ALBUM FOTO     -->
    <!-- ========================================== -->
    <Teleport to="body">
      <div v-if="showAlbumModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
        <div class="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 lg:p-8 shadow-2xl space-y-6">
          <div class="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 class="text-lg font-bold text-slate-900">
              {{ isEditAlbum ? 'Edit Album Galeri' : 'Tambah Album Foto Baru' }}
            </h3>
            <button @click="showAlbumModal = false" class="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
          </div>

          <form @submit.prevent="submitAlbumForm" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Judul Album Kegiatan</label>
              <input 
                v-model="albumForm.judul" 
                type="text" 
                required 
                placeholder="Contoh: Dokumentasi Pelepasan Siswa Kelas 6"
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Kategori Album</label>
                <select 
                  v-model="albumForm.kategori" 
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                >
                  <option value="Prestasi & Lomba">Prestasi & Lomba</option>
                  <option value="MPLS & Orientasi">MPLS & Orientasi</option>
                  <option value="Keagamaan">Keagamaan</option>
                  <option value="Ekskul & Seni">Ekskul & Seni</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Tanggal Kegiatan</label>
                <input 
                  v-model="albumForm.tanggal" 
                  type="date" 
                  required
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Foto Sampul (Cover Album)</label>
              <input 
                type="file" 
                @change="handleCoverUpload" 
                accept="image/*"
                class="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
              />
              <div v-if="coverPreview" class="mt-3">
                <img :src="formatImageUrl(coverPreview)" alt="Preview Cover" class="w-full h-40 object-cover rounded-xl border border-slate-200" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Deskripsi Album</label>
              <textarea 
                v-model="albumForm.deskripsi" 
                rows="3" 
                placeholder="Deskripsi singkat mengenai isi album foto kegiatan ini..."
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
              ></textarea>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button 
                type="button" 
                @click="showAlbumModal = false" 
                class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
              >
                Batal
              </button>
              <button 
                type="submit" 
                :disabled="savingAlbum"
                class="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                {{ savingAlbum ? 'Menyimpan...' : (isEditAlbum ? 'Simpan Perubahan' : 'Terbitkan Album') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>


    <!-- ========================================== -->
    <!-- MODAL 2: KELOLA FOTO-FOTO DALAM ALBUM      -->
    <!-- ========================================== -->
    <Teleport to="body">
      <div v-if="showKelolaFotoModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
        <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 lg:p-8 shadow-2xl space-y-6">
          <!-- Header Modal -->
          <div class="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-widest bg-purple-50 text-purple-700 px-2.5 py-1 rounded-md border border-purple-200">
                Manajemen Isi Album
              </span>
              <h3 class="text-xl font-extrabold text-slate-900 mt-1">
                {{ selectedAlbumDetail?.judul }}
              </h3>
            </div>
            <button @click="closeKelolaFoto" class="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
          </div>

          <!-- Section 1: Form Upload Foto Item Baru -->
          <div class="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl space-y-3">
            <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider">+ Upload Foto Baru ke Album Ini</h4>
            
            <form @submit.prevent="submitUploadFotoItem" class="flex flex-col sm:flex-row items-end gap-3">
              <div class="flex-1 w-full">
                <label class="block text-[11px] font-semibold text-slate-600 mb-1">Pilih File Foto</label>
                <input 
                  type="file" 
                  ref="fotoItemFileInput"
                  @change="handleFotoItemFile" 
                  accept="image/*"
                  required
                  class="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-100 file:text-purple-800 hover:file:bg-purple-200"
                />
              </div>

              <div class="flex-1 w-full">
                <label class="block text-[11px] font-semibold text-slate-600 mb-1">Keterangan Foto (Opsional)</label>
                <input 
                  v-model="fotoItemForm.keterangan" 
                  type="text" 
                  placeholder="Contoh: Sesi foto bersama pimpinan"
                  class="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
              </div>

              <button 
                type="submit" 
                :disabled="uploadingFoto"
                class="w-full sm:w-auto px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-purple-600/20 disabled:opacity-50 whitespace-nowrap"
              >
                {{ uploadingFoto ? 'Mengunggah...' : 'Upload Foto' }}
              </button>
            </form>
          </div>

          <!-- Section 2: Grid List Foto Item dalam Album -->
          <div class="space-y-3">
            <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Daftar Foto ({{ selectedAlbumDetail?.fotos?.length || 0 }})
            </h4>

            <div v-if="!selectedAlbumDetail?.fotos || selectedAlbumDetail.fotos.length === 0" class="text-center py-10 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              Belum ada foto yang diunggah dalam album ini.
            </div>

            <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <div 
                v-for="foto in selectedAlbumDetail.fotos" 
                :key="foto.id" 
                class="relative group bg-slate-100 rounded-xl overflow-hidden border border-slate-200 aspect-square"
              >
                <img 
                  :src="formatImageUrl(foto.gambar)" 
                  alt="Foto Item" 
                  class="w-full h-full object-cover"
                  @error="(e) => e.target.src = 'https://placehold.co/600x400/f1f5f9/475569?text=Galeri+SD+YWKA'"
                />
                <div class="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition flex flex-col justify-between p-2 text-white text-xs">
                  <p class="text-[10px] line-clamp-2 leading-tight">{{ foto.keterangan || 'Tanpa keterangan' }}</p>
                  <button 
                    @click="hapusFotoItem(foto.id)" 
                    class="w-full py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-[10px] transition"
                  >
                    Hapus Foto
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end border-t border-slate-100 pt-4">
            <button 
              type="button" 
              @click="closeKelolaFoto" 
              class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </Teleport>


    <!-- ========================================== -->
    <!-- MODAL 3: FORM TAMBAH / EDIT VIDEO GALERI   -->
    <!-- ========================================== -->
    <Teleport to="body">
      <div v-if="showVideoModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
        <div class="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 lg:p-8 shadow-2xl space-y-6">
          <div class="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 class="text-lg font-bold text-slate-900">
              {{ isEditVideo ? 'Edit Video Galeri' : 'Tambah Video Dokumentasi' }}
            </h3>
            <button @click="showVideoModal = false" class="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
          </div>

          <form @submit.prevent="submitVideoForm" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Judul Video</label>
              <input 
                v-model="videoForm.judul" 
                type="text" 
                required 
                placeholder="Contoh: Highlight Profil SD YWKA Rel Homy School"
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Kategori Video</label>
                <select 
                  v-model="videoForm.kategori" 
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                >
                  <option value="MPLS & Orientasi">MPLS & Orientasi</option>
                  <option value="Prestasi & Lomba">Prestasi & Lomba</option>
                  <option value="Keagamaan">Keagamaan</option>
                  <option value="Ekskul & Seni">Ekskul & Seni</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Tanggal Terbit</label>
                <input 
                  v-model="videoForm.tanggal" 
                  type="date" 
                  required
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">URL Embed YouTube</label>
              <input 
                v-model="videoForm.embed_url" 
                type="url" 
                required 
                placeholder="https://www.youtube.com/watch?v=XXXXX atau https://youtu.be/XXXXX"
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
              />
              <p class="text-[11px] text-slate-400 mt-1">Sistem akan secara otomatis memformat link YouTube biasa menjadi URL embed yang valid.</p>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button 
                type="button" 
                @click="showVideoModal = false" 
                class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
              >
                Batal
              </button>
              <button 
                type="submit" 
                :disabled="savingVideo"
                class="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-rose-600/20 disabled:opacity-50"
              >
                {{ savingVideo ? 'Menyimpan...' : (isEditVideo ? 'Simpan Perubahan' : 'Simpan Video') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>


    <!-- ========================================== -->
    <!-- MODAL 4: KONFIRMASI HAPUS DATA             -->
    <!-- ========================================== -->
    <Teleport to="body">
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
        <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl text-center space-y-4">
          <div class="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
            ⚠️
          </div>
          <h3 class="text-lg font-bold text-slate-900">Hapus Data Ini?</h3>
          <p class="text-xs text-slate-500">
            Apakah Anda yakin ingin menghapus {{ deleteTargetType === 'album' ? 'album' : 'video' }} "<span class="font-semibold text-slate-800">{{ itemToDelete?.judul }}</span>"? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div class="flex justify-center gap-3 pt-2">
            <button 
              @click="showDeleteModal = false" 
              class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
            >
              Batal
            </button>
            <button 
              @click="eksekusiHapus" 
              :disabled="deleting"
              class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-rose-600/20 disabled:opacity-50"
            >
              {{ deleting ? 'Menghapus...' : 'Ya, Hapus Data' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>


    <!-- ========================================== -->
    <!-- MODAL 5: CUSTOM ALERT NOTIFIKASI DIALOG   -->
    <!-- ========================================== -->
    <Teleport to="body">
      <div v-if="alertDialog.show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
        <div class="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-5 text-center">
          <div 
            class="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-xl"
            :class="[
              alertDialog.type === 'danger' ? 'bg-rose-50 text-rose-600 border border-rose-100' : '',
              alertDialog.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : '',
              alertDialog.type === 'info' ? 'bg-amber-50 text-amber-600 border border-amber-100' : ''
            ]"
          >
            <span v-if="alertDialog.type === 'danger'">⚠️</span>
            <span v-else-if="alertDialog.type === 'success'">✅</span>
            <span v-else>ℹ️</span>
          </div>

          <div>
            <h3 class="text-base font-extrabold text-slate-900">{{ alertDialog.title }}</h3>
            <p class="text-xs text-slate-500 mt-1.5 leading-relaxed">{{ alertDialog.message }}</p>
          </div>

          <button 
            type="button" 
            @click="alertDialog.show = false" 
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
import { ref, reactive, computed, onMounted } from 'vue'

// Terapkan layout khusus admin
definePageMeta({ layout: 'admin' })

// Ambil runtime configuration dari nuxt.config.ts / .env
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase

// API Endpoints konsisten dengan Django URL pattern (Memastikan Trailing Slash '/')
const ALBUM_API_URL = `${API_BASE}/api/admin-api/galeri/album/`
const VIDEO_API_URL = `${API_BASE}/api/admin-api/galeri/video/`
const FOTO_DELETE_BASE_URL = `${API_BASE}/api/admin-api/galeri/foto/`

// Pembacaan Cookie Token JWT Login
const token = useCookie('auth_token')

// Helper Fungsi Pembentuk Authorization Header Dinamis
const getAuthHeaders = () => {
  return {
    Authorization: token.value ? `Bearer ${token.value}` : ''
  }
}

// Helper Format Gambar (Menangani path relatif /media/... dari Django Backend)
const formatImageUrl = (url) => {
  if (!url) return 'https://placehold.co/600x400/f1f5f9/475569?text=Galeri+SD+YWKA'
  if (typeof url !== 'string') return 'https://placehold.co/600x400/f1f5f9/475569?text=Galeri+SD+YWKA'
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url
  }
  if (url.startsWith('/')) return `${API_BASE}${url}`
  return `${API_BASE}/${url}`
}

// State Navigasi Tab & Filter
const activeTab = ref('album') // Switcher: 'album' | 'video'
const searchQuery = ref('')
const selectedKategori = ref('Semua')

// State Modal Alert Kustom
const alertDialog = reactive({
  show: false,
  title: '',
  message: '',
  type: 'info'
})

const showAlert = (title, message, type = 'info') => {
  alertDialog.title = title
  alertDialog.message = message
  alertDialog.type = type
  alertDialog.show = true
}

// ========================================================
// 1. FETCH DATA ALBUM & VIDEO (Dengan Reactivity Token JWT)
// ========================================================
const { data: albumData, pending: pendingAlbums, refresh: refreshAlbums } = await useFetch(ALBUM_API_URL, {
  headers: computed(() => getAuthHeaders()),
  watch: false,
  lazy: true
})

const { data: videoData, pending: pendingVideos, refresh: refreshVideos } = await useFetch(VIDEO_API_URL, {
  headers: computed(() => getAuthHeaders()),
  watch: false,
  lazy: true
})

// Memastikan Sinkronisasi Real-Time Saat Halaman Dimuat di Client
onMounted(() => {
  refreshAlbums()
  refreshVideos()
})

// Computed List Data Array (Mendukung data biasa array [...] maupun paginated object { results: [...] })
const albumsList = computed(() => {
  if (!albumData.value) return []
  if (Array.isArray(albumData.value)) return albumData.value
  if (Array.isArray(albumData.value.results)) return albumData.value.results
  return []
})

const videosList = computed(() => {
  if (!videoData.value) return []
  if (Array.isArray(videoData.value)) return videoData.value
  if (Array.isArray(videoData.value.results)) return videoData.value.results
  return []
})

// Filtered Album Berdasarkan Kata Kunci & Kategori
const filteredAlbums = computed(() => {
  return albumsList.value.filter(item => {
    const matchSearch = item.judul.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                        (item.deskripsi && item.deskripsi.toLowerCase().includes(searchQuery.value.toLowerCase()))
    const matchKategori = selectedKategori.value === 'Semua' || item.kategori === selectedKategori.value
    return matchSearch && matchKategori
  })
})

// Filtered Video Berdasarkan Kata Kunci & Kategori
const filteredVideos = computed(() => {
  return videosList.value.filter(item => {
    const matchSearch = item.judul.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchKategori = selectedKategori.value === 'Semua' || item.kategori === selectedKategori.value
    return matchSearch && matchKategori
  })
})


// ========================================================
// 2. LOGIKA & MANAJEMEN MODAL ALBUM FOTO
// ========================================================
const showAlbumModal = ref(false)
const isEditAlbum = ref(false)
const savingAlbum = ref(false)
const editingAlbumId = ref(null)

const coverFile = ref(null)
const coverPreview = ref(null)

const albumForm = reactive({
  judul: '',
  kategori: 'Prestasi & Lomba',
  tanggal: new Date().toISOString().split('T')[0],
  deskripsi: ''
})

const handleCoverUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    coverFile.value = file
    coverPreview.value = URL.createObjectURL(file)
  }
}

const openModalTambahAlbum = () => {
  isEditAlbum.value = false
  editingAlbumId.value = null
  albumForm.judul = ''
  albumForm.kategori = 'Prestasi & Lomba'
  albumForm.tanggal = new Date().toISOString().split('T')[0]
  albumForm.deskripsi = ''
  coverFile.value = null
  coverPreview.value = null
  showAlbumModal.value = true
}

const openModalEditAlbum = (album) => {
  isEditAlbum.value = true
  editingAlbumId.value = album.id
  albumForm.judul = album.judul || ''
  albumForm.kategori = album.kategori || 'Prestasi & Lomba'
  albumForm.tanggal = album.tanggal || new Date().toISOString().split('T')[0]
  albumForm.deskripsi = album.deskripsi || ''
  coverFile.value = null
  coverPreview.value = album.cover || null
  showAlbumModal.value = true
}

const submitAlbumForm = async () => {
  savingAlbum.value = true
  try {
    const formData = new FormData()
    formData.append('judul', albumForm.judul)
    formData.append('kategori', albumForm.kategori)
    formData.append('tanggal', albumForm.tanggal)
    if (albumForm.deskripsi) formData.append('deskripsi', albumForm.deskripsi)
    if (coverFile.value) formData.append('cover', coverFile.value)

    if (isEditAlbum.value) {
      // Menggunakan PATCH untuk partial update agar cover tidak terhapus jika tidak ada file baru
      await $fetch(`${ALBUM_API_URL}${editingAlbumId.value}/`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: formData
      })
      showAlert('Berhasil', 'Album foto berhasil diperbarui.', 'success')
    } else {
      await $fetch(ALBUM_API_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData
      })
      showAlert('Berhasil Ditambahkan', 'Album foto baru berhasil diterbitkan.', 'success')
    }

    showAlbumModal.value = false
    await refreshAlbums()
  } catch (error) {
    showAlert('Gagal Menyimpan', 'Gagal menyimpan data album foto. Mohon periksa koneksi atau input Anda.', 'danger')
    console.error(error)
  } finally {
    savingAlbum.value = false
  }
}


// ========================================================
// 3. LOGIKA KELOLA FOTO-FOTO ITEM DALAM ALBUM
// ========================================================
const showKelolaFotoModal = ref(false)
const selectedAlbumDetail = ref(null)
const uploadingFoto = ref(false)
const fotoItemFileInput = ref(null)

const fotoItemFile = ref(null)
const fotoItemForm = reactive({
  keterangan: ''
})

const handleFotoItemFile = (event) => {
  const file = event.target.files[0]
  if (file) {
    fotoItemFile.value = file
  }
}

const openKelolaFoto = (album) => {
  selectedAlbumDetail.value = album
  fotoItemFile.value = null
  fotoItemForm.keterangan = ''
  showKelolaFotoModal.value = true
}

const closeKelolaFoto = () => {
  showKelolaFotoModal.value = false
  selectedAlbumDetail.value = null
}

const refreshSelectedAlbumDetail = async () => {
  if (!selectedAlbumDetail.value) return
  try {
    const updatedAlbum = await $fetch(`${ALBUM_API_URL}${selectedAlbumDetail.value.id}/`, {
      headers: getAuthHeaders()
    })
    selectedAlbumDetail.value = updatedAlbum
    await refreshAlbums()
  } catch (err) {
    console.error('Gagal memperbarui detail album:', err)
  }
}

const submitUploadFotoItem = async () => {
  if (!fotoItemFile.value || !selectedAlbumDetail.value) {
    showAlert('Peringatan', 'Pilih file foto terlebih dahulu.', 'info')
    return
  }

  uploadingFoto.value = true
  try {
    const formData = new FormData()
    formData.append('gambar', fotoItemFile.value)
    if (fotoItemForm.keterangan) {
      formData.append('keterangan', fotoItemForm.keterangan)
    }

    await $fetch(`${ALBUM_API_URL}${selectedAlbumDetail.value.id}/upload-foto/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData
    })

    fotoItemFile.value = null
    fotoItemForm.keterangan = ''
    if (fotoItemFileInput.value) fotoItemFileInput.value.value = ''

    showAlert('Foto Terunggah', 'Foto baru berhasil ditambahkan ke dalam album.', 'success')
    await refreshSelectedAlbumDetail()
  } catch (error) {
    showAlert('Gagal Mengunggah', 'Gagal mengunggah foto ke album.', 'danger')
    console.error(error)
  } finally {
    uploadingFoto.value = false
  }
}

const hapusFotoItem = async (fotoId) => {
  try {
    await $fetch(`${FOTO_DELETE_BASE_URL}${fotoId}/`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    showAlert('Berhasil', 'Foto berhasil dihapus dari album.', 'success')
    await refreshSelectedAlbumDetail()
  } catch (error) {
    showAlert('Gagal Menghapus', 'Gagal menghapus foto dari album.', 'danger')
    console.error(error)
  }
}


// ========================================================
// 4. LOGIKA & MANAJEMEN MODAL VIDEO DOKUMENTASI
// ========================================================
const showVideoModal = ref(false)
const isEditVideo = ref(false)
const savingVideo = ref(false)
const editingVideoId = ref(null)

const videoForm = reactive({
  judul: '',
  kategori: 'MPLS & Orientasi',
  tanggal: new Date().toISOString().split('T')[0],
  embed_url: ''
})

const openModalTambahVideo = () => {
  isEditVideo.value = false
  editingVideoId.value = null
  videoForm.judul = ''
  videoForm.kategori = 'MPLS & Orientasi'
  videoForm.tanggal = new Date().toISOString().split('T')[0]
  videoForm.embed_url = ''
  showVideoModal.value = true
}

const openModalEditVideo = (video) => {
  isEditVideo.value = true
  editingVideoId.value = video.id
  videoForm.judul = video.judul || ''
  videoForm.kategori = video.kategori || 'MPLS & Orientasi'
  videoForm.tanggal = video.tanggal || new Date().toISOString().split('T')[0]
  videoForm.embed_url = video.embed_url || ''
  showVideoModal.value = true
}

const submitVideoForm = async () => {
  savingVideo.value = true
  try {
    const payload = {
      judul: videoForm.judul,
      kategori: videoForm.kategori,
      tanggal: videoForm.tanggal,
      embed_url: videoForm.embed_url
    }

    if (isEditVideo.value) {
      await $fetch(`${VIDEO_API_URL}${editingVideoId.value}/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: payload
      })
      showAlert('Berhasil', 'Data video berhasil diperbarui.', 'success')
    } else {
      await $fetch(VIDEO_API_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: payload
      })
      showAlert('Berhasil Ditambahkan', 'Video baru berhasil ditambahkan.', 'success')
    }

    showVideoModal.value = false
    await refreshVideos()
  } catch (error) {
    showAlert('Gagal Menyimpan', 'Gagal menyimpan data video. Pastikan format URL YouTube valid.', 'danger')
    console.error(error)
  } finally {
    savingVideo.value = false
  }
}


// ========================================================
// 5. MODAL KONFIRMASI & EKSEKUSI HAPUS (ALBUM / VIDEO)
// ========================================================
const showDeleteModal = ref(false)
const deleteTargetType = ref('album') // 'album' | 'video'
const itemToDelete = ref(null)
const deleting = ref(false)

const konfirmasiHapusAlbum = (album) => {
  deleteTargetType.value = 'album'
  itemToDelete.value = album
  showDeleteModal.value = true
}

const konfirmasiHapusVideo = (video) => {
  deleteTargetType.value = 'video'
  itemToDelete.value = video
  showDeleteModal.value = true
}

const eksekusiHapus = async () => {
  if (!itemToDelete.value) return
  deleting.value = true
  try {
    if (deleteTargetType.value === 'album') {
      await $fetch(`${ALBUM_API_URL}${itemToDelete.value.id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })
      showAlert('Berhasil Dihapus', 'Album foto beserta seluruh isinya telah dihapus.', 'success')
      await refreshAlbums()
    } else {
      await $fetch(`${VIDEO_API_URL}${itemToDelete.value.id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })
      showAlert('Berhasil Dihapus', 'Video dokumentasi telah dihapus.', 'success')
      await refreshVideos()
    }
    showDeleteModal.value = false
  } catch (error) {
    showAlert('Gagal Menghapus', 'Gagal menghapus data dari server.', 'danger')
    console.error(error)
  } finally {
    deleting.value = false
  }
}


// ========================================================
// 6. HELPER FORMAT TANGGAL
// ========================================================
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