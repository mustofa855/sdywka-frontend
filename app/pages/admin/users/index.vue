<template>
  <div class="p-6 md:p-8 min-h-screen">

    <!-- ============================================================ -->
    <!-- HEADER & CONTROL -->
    <!-- ============================================================ -->
    <div class="print:hidden">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">

        <div>
          <h1
            class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2"
          >
            <span
              class="p-2 bg-amber-500 text-slate-950 rounded-xl shadow-md shadow-amber-500/20 inline-flex"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                />
              </svg>
            </span>

            Daftar User & Kartu QR Presensi
          </h1>

          <p class="text-sm text-slate-500 mt-1">
            Kelola pengguna, tampilkan kartu presensi digital, serta cetak kartu secara selektif.
          </p>
        </div>

        <!-- ACTION -->
        <div class="flex items-center gap-2 flex-wrap">

          <button
            @click="cetakSelektif"
            :disabled="selectedUserIds.length === 0"
            class="px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg transition"
            :class="
              selectedUserIds.length > 0
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
            "
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4h2m2 4h6a2 2 0 002-2v-4H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>

            <span>
              Cetak Dipilih ({{ selectedUserIds.length }})
            </span>
          </button>

          <button
            @click="refreshUsers"
            class="p-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl transition shadow-sm"
            title="Refresh Data"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>

        </div>
      </div>

      <!-- ========================================================== -->
      <!-- SEARCH & FILTER -->
      <!-- ========================================================== -->
      <div
        class="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 mb-6 flex flex-col md:flex-row items-center justify-between gap-4"
      >

        <div class="flex items-center gap-3 w-full md:w-auto flex-1">

          <div class="relative flex-1 max-w-md">
            <svg
              class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>

            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari nama, username, atau NIP..."
              class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
            />
          </div>

          <select
            v-model="roleFilter"
            class="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
          >
            <option value="Semua">Semua Peran</option>
            <option value="admin">Administrator</option>
            <option value="guru">Guru / Pengajar</option>
            <option value="staf">Staf / Tata Usaha</option>
          </select>

        </div>

        <div
          class="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100"
        >
          <label
            class="inline-flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700 hover:text-amber-600 transition"
          >
            <input
              type="checkbox"
              :checked="isAllSelected"
              @change="toggleSelectAll"
              class="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 border-slate-300"
            />

            <span>
              Pilih Semua ({{ filteredUsers.length }})
            </span>
          </label>
        </div>

      </div>
    </div>

    <!-- ============================================================ -->
    <!-- LOADING -->
    <!-- ============================================================ -->
    <div
      v-if="isLoading"
      class="py-20 text-center print:hidden"
    >
      <div
        class="inline-block w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"
      ></div>

      <p class="mt-4 text-slate-500 font-medium text-sm">
        Memuat daftar pengguna & kartu...
      </p>
    </div>

    <!-- ============================================================ -->
    <!-- EMPTY -->
    <!-- ============================================================ -->
    <div
      v-else-if="filteredUsers.length === 0"
      class="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm print:hidden"
    >
      <div
        class="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4"
      >
        <svg
          class="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      </div>

      <h3 class="text-lg font-bold text-slate-800">
        Tidak ada pengguna ditemukan
      </h3>

      <p class="text-slate-500 text-sm mt-1">
        Coba sesuaikan kata kunci pencarian atau filter Anda.
      </p>
    </div>

    <!-- ============================================================ -->
    <!-- WEB CARD -->
    <!-- ============================================================ -->
    <div
      v-else
      class="print:hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >

      <div
        v-for="user in filteredUsers"
        :key="user.id"
        class="bg-white rounded-3xl overflow-hidden border-2 transition duration-300 shadow-sm hover:shadow-xl relative flex flex-col justify-between"
        :class="
          selectedUserIds.includes(user.id)
            ? 'border-amber-500 ring-4 ring-amber-500/10'
            : 'border-slate-200/80 hover:border-slate-300'
        "
      >

        <!-- CHECKBOX -->
        <div class="absolute top-3 left-3 z-10">
          <label
            class="p-2 bg-white/90 backdrop-blur-md rounded-xl shadow-md flex items-center gap-2 cursor-pointer border border-slate-200 hover:bg-white transition"
          >
            <input
              type="checkbox"
              :value="user.id"
              v-model="selectedUserIds"
              class="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 border-slate-300"
            />

            <span class="text-[11px] font-bold text-slate-700">
              Pilih
            </span>
          </label>
        </div>

        <!-- CARD CONTENT -->
        <div
          class="bg-white p-5 flex flex-col items-center text-center relative overflow-hidden"
        >

          <!-- CARD HEADER -->
          <div
            class="w-full bg-slate-950 text-white rounded-2xl p-3 mb-4 shadow-md border border-slate-800 relative overflow-hidden"
          >
            <div class="flex items-center justify-center gap-2">

              <img
                src="/assets/logo-ywka.png"
                alt="Logo YWKA"
                class="w-7 h-7 object-contain bg-white/10 p-0.5 rounded-lg shrink-0"
              />

              <div class="text-left">
                <p
                  class="text-[11px] font-extrabold tracking-wider text-amber-400 leading-none"
                >
                  SD YWKA REL HOMY SCHOOL
                </p>

                <p
                  class="text-[9px] font-medium text-slate-300 leading-tight"
                >
                  KARTU PRESENSI DIGITAL
                </p>
              </div>

            </div>
          </div>

          <!-- FOTO -->
          <div class="relative mb-3">

            <div
              class="w-20 h-20 rounded-2xl ring-4 ring-amber-500/20 overflow-hidden shadow-lg mx-auto bg-slate-100"
            >
              <img
                :src="
                  user.foto ||
                  user.profil?.foto_profil ||
                  '/media/default-profile/profile-picture.png'
                "
                :alt="user.nama || user.username"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
            </div>

            <span
              class="absolute -bottom-1 -right-1 px-2 py-0.5 text-[9px] font-extrabold rounded-md shadow-md capitalize"
              :class="
                user.is_staff
                  ? 'bg-purple-600 text-white'
                  : 'bg-amber-500 text-slate-950'
              "
            >
              {{ user.is_staff ? 'Admin' : 'User' }}
            </span>

          </div>

          <!-- USER INFO -->
          <h3
            class="font-extrabold text-slate-900 text-base leading-snug line-clamp-1 px-2"
          >
            {{
              user.nama ||
              user.guru_profile?.nama ||
              user.username
            }}
          </h3>

          <p
            class="text-xs font-semibold text-amber-600 mt-0.5 line-clamp-1"
          >
            {{
              user.jabatan ||
              user.guru_profile?.jabatan ||
              'Anggota Staf'
            }}
          </p>

          <p
            class="text-[11px] text-slate-400 font-mono mt-0.5"
          >
            NIP/ID:
            {{
              user.nip ||
              user.guru_profile?.nip ||
              '-'
            }}
          </p>

          <!-- QR -->
          <div
            class="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-2xl inline-flex flex-col items-center shadow-inner"
          >

            <img
              :src="getQrCodeUrl(user.qr_uuid || user.id)"
              alt="QR Presensi"
              class="w-32 h-32 object-contain rounded-lg"
            />

            <div
              class="mt-2 px-3 py-1 bg-slate-900 text-amber-400 font-mono text-xs font-bold rounded-lg tracking-widest shadow-sm"
            >
              ID:
              {{ user.qr_uuid || user.id }}
            </div>

          </div>

        </div>

        <!-- BUTTON -->
        <div
          class="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2"
        >

          <button
            @click="cetakSatuUser(user)"
            class="flex-1 py-2 px-3 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
          >
            <svg
              class="w-4 h-4 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4h2m2 4h6a2 2 0 002-2v-4H9a2 2 0 002 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>

            <span>Print Card</span>
          </button>

          <button
            @click="downloadCardImage(user)"
            class="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>

            <span>Download</span>
          </button>

        </div>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- PRINT AREA -->
    <!-- -->
    <!-- 3 KOLOM x 3 BARIS = 9 KARTU / HALAMAN -->
    <!-- ============================================================ -->
    <div class="print-area">

      <div
        v-for="(pageUsers, pageIndex) in paginatedPrintableUsers"
        :key="`print-page-${pageIndex}`"
        class="print-page"
      >

        <div class="print-grid">

          <div
            v-for="user in pageUsers"
            :key="`print-card-${user.id}`"
            class="print-card"
          >

            <!-- ================================================== -->
            <!-- HEADER CARD -->
            <!-- ================================================== -->
            <div class="print-card-header">

              <img
                src="/assets/logo-ywka.png"
                alt="Logo YWKA"
                class="print-card-logo"
              />

              <div class="print-card-header-text">

                <p class="print-header-title">
                  SD YWKA REL HOMY SCHOOL
                </p>

                <p class="print-header-sub">
                  KARTU PRESENSI DIGITAL
                </p>

              </div>

            </div>

            <!-- ================================================== -->
            <!-- FOTO -->
            <!-- ================================================== -->
            <div class="print-avatar-wrapper">

              <div class="print-avatar-box">

                <img
                  :src="
                    user.foto ||
                    user.profil?.foto_profil ||
                    '/media/default-profile/profile-picture.png'
                  "
                  :alt="user.nama || user.username"
                  class="print-avatar-img"
                  @error="handleImageError"
                />

              </div>

              <span
                class="print-badge"
                :class="
                  user.is_staff
                    ? 'badge-admin'
                    : 'badge-user'
                "
              >
                {{ user.is_staff ? 'Admin' : 'User' }}
              </span>

            </div>

            <!-- ================================================== -->
            <!-- NAMA -->
            <!-- ================================================== -->
            <div class="print-user-info">

              <h3 class="print-user-name">
                {{
                  user.nama ||
                  user.guru_profile?.nama ||
                  user.username
                }}
              </h3>

              <p class="print-user-role">
                {{
                  user.jabatan ||
                  user.guru_profile?.jabatan ||
                  'Anggota Staf'
                }}
              </p>

              <p class="print-user-nip">
                NIP/ID:
                {{
                  user.nip ||
                  user.guru_profile?.nip ||
                  '-'
                }}
              </p>

            </div>

            <!-- ================================================== -->
            <!-- QR -->
            <!-- ================================================== -->
            <div class="print-qr-box">

              <img
                :src="getQrCodeUrl(user.qr_uuid || user.id)"
                alt="QR Presensi"
                class="print-qr-img"
              />

              <div class="print-qr-id">
                ID:
                {{ user.qr_uuid || user.id }}
              </div>

            </div>

          </div>

        </div>
      </div>

    </div>

  </div>
</template>


<script setup>
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'admin'
})

/* ================================================================
   API
   ================================================================ */

const getBaseUrl = () => {
  const config = useRuntimeConfig()
  let baseUrl = config.public.apiBase
  baseUrl = baseUrl.replace(/\/$/, '')
  if (!baseUrl.endsWith('/api')) {
    baseUrl = `${baseUrl}/api`
  }
  return baseUrl
}

const token = useCookie('auth_token')

const getAuthHeaders = () => ({
  Authorization: token.value
    ? `Bearer ${token.value}`
    : ''
})


/* ================================================================
   STATE
   ================================================================ */

const searchQuery = ref('')
const roleFilter = ref('Semua')

const selectedUserIds = ref([])

const printableUsers = ref([])


/* ================================================================
   FETCH USERS
   ================================================================ */

const {
  data: usersData,
  pending: isLoading,
  refresh: refreshUsers
} = await useFetch(() => `${getBaseUrl()}/admin-api/users/`, {
  headers: computed(() => getAuthHeaders()),
  watch: false,
  lazy: true
})


/* ================================================================
   USERS
   ================================================================ */

const users = computed(() => {
  if (
    !usersData.value ||
    !Array.isArray(usersData.value)
  ) {
    return []
  }

  return usersData.value
})


/* ================================================================
   FILTER USERS
   ================================================================ */

const filteredUsers = computed(() => {

  return users.value.filter(user => {

    const q = searchQuery.value
      ? searchQuery.value.toLowerCase().trim()
      : ''

    const nama = (
      user.nama ||
      user.guru_profile?.nama ||
      user.username ||
      ''
    ).toLowerCase()

    const username = (
      user.username ||
      ''
    ).toLowerCase()

    const nip = (
      user.nip ||
      user.guru_profile?.nip ||
      ''
    ).toLowerCase()

    const matchesSearch =
      nama.includes(q) ||
      username.includes(q) ||
      nip.includes(q)

    if (roleFilter.value === 'Semua') {
      return matchesSearch
    }

    if (roleFilter.value === 'admin') {
      return matchesSearch && user.is_staff === true
    }

    return (
      matchesSearch &&
      (
        user.roles?.includes(roleFilter.value) ||
        user.role_type === roleFilter.value
      )
    )
  })
})


/* ================================================================
   PRINT PAGINATION
   ================================================================
   
   1 halaman = 9 kartu
   3 kolom x 3 baris
   ================================================================ */

const paginatedPrintableUsers = computed(() => {

  const pages = []

  const list = printableUsers.value

  for (
    let i = 0;
    i < list.length;
    i += 9
  ) {
    pages.push(
      list.slice(i, i + 9)
    )
  }

  return pages
})


/* ================================================================
   SELECT ALL
   ================================================================ */

const isAllSelected = computed(() => {

  if (filteredUsers.value.length === 0) {
    return false
  }

  return filteredUsers.value.every(
    user =>
      selectedUserIds.value.includes(user.id)
  )
})


const toggleSelectAll = () => {

  if (isAllSelected.value) {

    selectedUserIds.value = []

  } else {

    selectedUserIds.value =
      filteredUsers.value.map(
        user => user.id
      )
  }
}


/* ================================================================
   QR CODE
   ================================================================ */

const getQrCodeUrl = (uuidCode) => {

  const code =
    uuidCode || '000000'

  return (
    'https://api.qrserver.com/v1/create-qr-code/' +
    `?size=250x250&data=USER-UUID-${encodeURIComponent(code)}`
  )
}


/* ================================================================
   IMAGE ERROR
   ================================================================ */

const handleImageError = (event) => {

  if (
    event?.target &&
    event.target.src.indexOf(
      '/media/default-profile/profile-picture.png'
    ) === -1
  ) {
    event.target.src =
      '/media/default-profile/profile-picture.png'
  }
}


/* ================================================================
   WAIT FOR IMAGES
   ================================================================
   
   Penting supaya QR dan foto sudah selesai dimuat
   sebelum dialog print dibuka.
   ================================================================ */

const waitForPrintImages = async () => {

  await new Promise(resolve => {

    requestAnimationFrame(() => {

      const images =
        Array.from(
          document.querySelectorAll(
            '.print-area img'
          )
        )

      if (images.length === 0) {
        resolve()
        return
      }

      let loaded = 0

      const checkDone = () => {

        loaded++

        if (loaded >= images.length) {
          resolve()
        }
      }

      images.forEach(img => {

        if (img.complete) {

          checkDone()

        } else {

          img.addEventListener(
            'load',
            checkDone,
            { once: true }
          )

          img.addEventListener(
            'error',
            checkDone,
            { once: true }
          )
        }
      })

      /*
       * Fallback apabila image remote terlalu lama.
       */
      setTimeout(resolve, 4000)
    })
  })

  /*
   * Beri browser waktu melakukan repaint
   * sebelum print.
   */
  await new Promise(
    resolve =>
      requestAnimationFrame(() =>
        requestAnimationFrame(resolve)
      )
  )
}


/* ================================================================
   PRINT SELECTED
   ================================================================ */

const cetakSelektif = async () => {

  if (
    selectedUserIds.value.length === 0
  ) {
    return
  }

  printableUsers.value =
    users.value.filter(user =>
      selectedUserIds.value.includes(
        user.id
      )
    )

  await nextTick()

  await waitForPrintImages()

  window.print()
}


/* ================================================================
   PRINT SINGLE USER
   ================================================================ */

const cetakSatuUser = async (user) => {

  printableUsers.value = [user]

  await nextTick()

  await waitForPrintImages()

  window.print()
}


/* ================================================================
   AFTER PRINT
   ================================================================ */

if (import.meta.client) {

  window.addEventListener(
    'afterprint',
    () => {

      /*
       * Kosongkan area print setelah
       * dialog print selesai.
       */
      printableUsers.value = []
    }
  )
}


/* ================================================================
   DOWNLOAD
   ================================================================ */

const downloadCardImage = (user) => {

  const qrUrl =
    getQrCodeUrl(
      user.qr_uuid || user.id
    )

  const namaUser = (
    user.nama ||
    user.username ||
    'User'
  ).replace(
    /\s+/g,
    '_'
  )

  const link =
    document.createElement('a')

  link.href = qrUrl

  link.download =
    `Kartu_QR_${namaUser}_${user.qr_uuid || user.id}.png`

  document.body.appendChild(link)

  link.click()

  document.body.removeChild(link)
}

</script>


<style scoped>

/* ================================================================
   DEFAULT PRINT AREA
   ================================================================ */

.print-area {
  display: none;
}


/* ================================================================
   PRINT
   ================================================================ */

@media print {

  /* ==============================================================
     PRINT COLOR
     ============================================================== */

  *,
  *::before,
  *::after {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }


  /* ==============================================================
     A4
     
     Margin kecil supaya 3x3 kartu dapat masuk dengan nyaman.
     ============================================================== */

  @page {
    size: A4 portrait;
    margin: 5mm;
  }


  /* ==============================================================
     RESET NUXT / LAYOUT
     ============================================================== */

  :global(html),
  :global(body),
  :global(#__nuxt),
  :global(#__nuxt > div),
  :global(main) {
    width: 100% !important;
    min-width: 0 !important;

    margin: 0 !important;
    padding: 0 !important;

    background: #ffffff !important;

    overflow: visible !important;
  }


  /* ==============================================================
     HIDE LAYOUT
     ============================================================== */

  :global(aside),
  :global(nav),
  :global(header),
  :global(footer),
  :global(.sidebar),
  .print\:hidden {
    display: none !important;
  }


  /* ==============================================================
     PRINT AREA
     ============================================================== */

  .print-area {
    display: block !important;

    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }


  /* ==============================================================
     PRINT PAGE
     
     Setiap page = satu halaman A4.
     ============================================================== */

  .print-page {
    width: 100% !important;

    height: 287mm !important;

    margin: 0 !important;
    padding: 0 !important;

    box-sizing: border-box !important;

    page-break-after: always !important;
    break-after: page !important;

    overflow: hidden !important;
  }


  .print-page:last-child {
    page-break-after: auto !important;
    break-after: auto !important;
  }


  /* ==============================================================
     GRID 3 x 3
     
     A4:
     width 210mm
     margin kiri/kanan 5mm
     usable width = 200mm
     
     3 kartu:
     (200 - 2*3) / 3 = 64.67mm
     ============================================================== */

  .print-grid {
    width: 100% !important;
    height: 100% !important;

    display: grid !important;

    grid-template-columns:
      repeat(3, 1fr) !important;

    grid-template-rows:
      repeat(3, 1fr) !important;

    column-gap: 3mm !important;
    row-gap: 3mm !important;

    box-sizing: border-box !important;
  }


  /* ==============================================================
     PRINT CARD
     
     Card web mempunyai:
     - white background
     - rounded 3xl
     - border
     - shadow
     
     Di print shadow dibuat lebih ringan tetapi struktur
     dan proporsinya tetap sama.
     ============================================================== */

  .print-card {

    width: 100% !important;
    height: 100% !important;

    min-width: 0 !important;
    min-height: 0 !important;

    box-sizing: border-box !important;

    background: #ffffff !important;

    border: 1.2px solid #e2e8f0 !important;

    border-radius: 7mm !important;

    padding: 3.2mm !important;

    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;

    text-align: center !important;

    overflow: hidden !important;

    position: relative !important;

    box-shadow:
      0 1.5mm 3mm rgba(15, 23, 42, 0.10) !important;

    break-inside: avoid !important;
    page-break-inside: avoid !important;
  }


  /* ==============================================================
     HEADER HITAM
     ============================================================== */

  .print-card-header {

    width: 100% !important;

    min-height: 15mm !important;

    box-sizing: border-box !important;

    background: #020617 !important;

    color: #ffffff !important;

    border-radius: 4mm !important;

    padding: 2.4mm 2.5mm !important;

    margin: 0 0 3mm 0 !important;

    display: flex !important;

    align-items: center !important;

    justify-content: center !important;

    gap: 2mm !important;

    flex-shrink: 0 !important;
  }


  /* ==============================================================
     LOGO
     ============================================================== */

  .print-card-logo {

    width: 7mm !important;
    height: 7mm !important;

    min-width: 7mm !important;
    min-height: 7mm !important;

    object-fit: contain !important;

    background: rgba(
      255,
      255,
      255,
      0.10
    ) !important;

    padding: 0.5mm !important;

    border-radius: 1.5mm !important;

    flex-shrink: 0 !important;
  }


  /* ==============================================================
     HEADER TEXT
     ============================================================== */

  .print-card-header-text {
    min-width: 0 !important;
    text-align: left !important;
  }


  .print-header-title {

    font-size: 2.7mm !important;

    font-weight: 900 !important;

    color: #fbbf24 !important;

    line-height: 1 !important;

    letter-spacing: 0.04em !important;

    margin: 0 !important;

    white-space: nowrap !important;
  }


  .print-header-sub {

    font-size: 2.05mm !important;

    font-weight: 600 !important;

    color: #cbd5e1 !important;

    line-height: 1.1 !important;

    margin: 0.7mm 0 0 0 !important;

    white-space: nowrap !important;
  }


  /* ==============================================================
     AVATAR
     ============================================================== */

  .print-avatar-wrapper {

    position: relative !important;

    margin: 2mm 0 2.5mm 0 !important;

    flex-shrink: 0 !important;
  }


  .print-avatar-box {

    width: 18mm !important;
    height: 18mm !important;

    border-radius: 4mm !important;

    overflow: hidden !important;

    background: #f1f5f9 !important;

    box-shadow:
      0 0 0 1.2mm
      rgba(245, 158, 11, 0.20) !important;
  }


  .print-avatar-img {

    display: block !important;

    width: 100% !important;
    height: 100% !important;

    object-fit: cover !important;
  }


  /* ==============================================================
     BADGE
     ============================================================== */

  .print-badge {

    position: absolute !important;

    right: -2mm !important;
    bottom: -1mm !important;

    padding: 0.6mm 1.8mm !important;

    font-size: 2mm !important;

    line-height: 1 !important;

    font-weight: 800 !important;

    border-radius: 1.2mm !important;

    text-transform: capitalize !important;

    box-shadow:
      0 0.5mm 1mm rgba(15, 23, 42, 0.20) !important;

    white-space: nowrap !important;
  }


  .badge-admin {

    background: #9333ea !important;

    color: #ffffff !important;
  }


  .badge-user {

    background: #f59e0b !important;

    color: #020617 !important;
  }


  /* ==============================================================
     USER INFO
     ============================================================== */

  .print-user-info {

    width: 100% !important;

    min-width: 0 !important;

    padding: 0 1mm !important;

    margin: 0 0 2.5mm 0 !important;

    flex-shrink: 0 !important;
  }


  .print-user-name {

    width: 100% !important;

    font-size: 3.25mm !important;

    font-weight: 800 !important;

    color: #0f172a !important;

    line-height: 1.15 !important;

    margin: 0 !important;

    white-space: nowrap !important;

    overflow: hidden !important;

    text-overflow: ellipsis !important;
  }


  .print-user-role {

    width: 100% !important;

    font-size: 2.45mm !important;

    font-weight: 700 !important;

    color: #d97706 !important;

    line-height: 1.15 !important;

    margin: 1mm 0 0 0 !important;

    white-space: nowrap !important;

    overflow: hidden !important;

    text-overflow: ellipsis !important;
  }


  .print-user-nip {

    font-size: 2.2mm !important;

    font-family:
      monospace,
      monospace !important;

    color: #64748b !important;

    line-height: 1.1 !important;

    margin: 0.8mm 0 0 0 !important;

    white-space: nowrap !important;
  }


  /* ==============================================================
     QR BOX
     
     QR dibuat proporsional terhadap card web.
     ============================================================== */

  .print-qr-box {

    width: 100% !important;

    padding: 2.2mm !important;

    box-sizing: border-box !important;

    background: #f8fafc !important;

    border: 1px solid #e2e8f0 !important;

    border-radius: 4mm !important;

    display: flex !important;

    flex-direction: column !important;

    align-items: center !important;

    justify-content: center !important;

    margin-top: auto !important;

    flex-shrink: 0 !important;
  }


  .print-qr-img {

    width: 24mm !important;
    height: 24mm !important;

    object-fit: contain !important;

    display: block !important;

    border-radius: 1.5mm !important;
  }


  /* ==============================================================
     QR ID
     ============================================================== */

  .print-qr-id {

    margin-top: 1.5mm !important;

    padding: 0.9mm 2.5mm !important;

    background: #0f172a !important;

    color: #fbbf24 !important;

    font-family:
      monospace,
      monospace !important;

    font-size: 2.35mm !important;

    font-weight: 800 !important;

    line-height: 1 !important;

    border-radius: 1.5mm !important;

    letter-spacing: 0.04em !important;

    white-space: nowrap !important;
  }


  /* ==============================================================
     PASTIKAN TIDAK ADA ELEMEN WEB YANG IKUT PRINT
     ============================================================== */

  button,
  input,
  select,
  textarea {
    display: none !important;
  }

}


/* ================================================================
   PRINT MODE - KHUSUS LAYAR KECIL
   ================================================================ */

@media print and (max-width: 800px) {

  @page {
    size: A4 portrait;
    margin: 5mm;
  }

}

</style>