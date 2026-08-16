<script setup>
import { ref, computed } from 'vue'

const config = useRuntimeConfig()
const apiBase = config.public?.apiBase || ''

// 1. SEO META TAGS OPTIMIZATION (Nuxt 3 useSeoMeta)
useSeoMeta({
  title: 'Profil SD YWKA REL HOMY SCHOOL Bandung | Sekolah Dasar Swasta Unggul',
  ogTitle: 'Profil Resmi SD YWKA REL HOMY SCHOOL Bandung',
  description: 'Profil resmi, Sejarah, Visi Misi, Core Values JUARA, Akreditasi A, Struktur Organisasi, dan Fasilitas SD YWKA REL HOMY SCHOOL Bandung.',
  ogDescription: 'Profil resmi, Sejarah, Visi Misi, Core Values JUARA, Akreditasi A, Struktur Organisasi, dan Fasilitas SD YWKA REL HOMY SCHOOL Bandung.',
  keywords: 'SD YWKA REL HOMY SCHOOL, SD YWKA REL HOMY SCHOOL, Sekolah Dasar Bandung, SD Swasta Andir Bandung, Sekolah Kurikulum Merdeka Bandung, SD Tahfidz Bandung',
  ogType: 'website',
  ogLocale: 'id_ID',
  twitterCard: 'summary_large_image',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
})

// 2. STRUCTURED DATA / JSON-LD SCHEMA.ORG FOR SEO
useHead({
  link: [
    { rel: 'canonical', href: 'https://sdywka.sch.id/profil' }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ElementarySchool',
        'name': 'SD YWKA REL HOMY SCHOOL Bandung',
        'alternateName': 'SD YWKA REL HOMY SCHOOL',
        'url': 'https://sdywka.sch.id/profil',
        'logo': 'https://sdywka.sch.id/logo.png',
        'description': 'Sekolah Dasar Swasta Terakreditasi A di Bandung dengan Kurikulum Merdeka dan Penguatan Karakter Imtaq (Tahsin & Tahfidz).',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': 'Jl. Rajawali I No. 5, Kel. Dunguscariang, Kec. Andir',
          'addressLocality': 'Kota Bandung',
          'addressRegion': 'Jawa Barat',
          'postalCode': '40184',
          'addressCountry': 'ID'
        },
        'telephone': '+62895344044455',
        'priceRange': '$$',
        'sameAs': [
          'https://wa.me/62895344044455'
        ]
      })
    }
  ]
})

// Fetch Data Profil & Guru
const { data: apiProfil } = await useFetch(`${apiBase}/api/profil/`, {
  transform: (res) => (Array.isArray(res) ? res[0] : res),
  lazy: true
})

const { data: listGuru } = await useFetch(`${apiBase}/api/guru/`, { lazy: true })

const kepalaSekolah = computed(() => {
  if (!listGuru.value || !Array.isArray(listGuru.value)) return null
  return listGuru.value.find(g => g.role === 1) || 
         listGuru.value.find(g => g.jabatan?.toLowerCase().includes('kepala sekolah'))
})

// Format nama kepala sekolah beserta gelarnya jika ada
const namaKepalaSekolah = computed(() => {
  if (!kepalaSekolah.value?.nama) return ''
  const nama = kepalaSekolah.value.nama.trim()
  const gelar = kepalaSekolah.value.gelar?.trim()
  return gelar ? `${nama}, ${gelar}` : nama
})

const imageError = ref(false)

const fotoKepalaSekolahUrl = computed(() => {
  if (!kepalaSekolah.value?.foto) return null
  const fotoPath = kepalaSekolah.value.foto
  if (fotoPath.startsWith('http://') || fotoPath.startsWith('https://')) return fotoPath
  const cleanApiBase = apiBase.replace(/\/$/, '')
  const cleanPath = fotoPath.startsWith('/') ? fotoPath : `/${fotoPath}`
  return `${cleanApiBase}${cleanPath}`
})

const handleImageError = () => {
  imageError.value = true
}

const identitasSekolah = ref([
  { label: 'Nama Sekolah', value: 'SD YWKA REL HOMY SCHOOL', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { label: 'NPSN', value: '20219588', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { label: 'Status Sekolah', value: 'Swasta (Bawah Naungan Yayasan YWKA / PT KAI)', icon: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z' },
  { label: 'Akreditasi', value: 'Terakreditasi A (Unggul)', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z' },
  { label: 'Kurikulum', value: 'Kurikulum Merdeka & Penguatan karakter Imtaq (Tahsin/Tahfidz)', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { label: 'Alamat', value: 'Jl. Rajawali I No. 5, Kel. Dunguscariang, Kec. Andir, Kota Bandung - 40184', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' }
])

// CORE VALUES JUARA
const coreValuesJUARA = ref([
  {
    huruf: 'J',
    judul: 'Jujur',
    deskripsi: 'Menanamkan nilai kejujuran, integritas, dan keterbukaan dalam setiap perkataan maupun perbuatan siswa.',
    gradient: 'from-amber-500 to-amber-600',
    border: 'hover:border-amber-400',
    badge: 'bg-amber-100 text-amber-900 border-amber-200'
  },
  {
    huruf: 'U',
    judul: 'Unggul',
    deskripsi: 'Mendorong siswa untuk selalu berprestasi tinggi dalam bidang akademik, non-akademik, dan spiritual.',
    gradient: 'from-blue-600 to-indigo-600',
    border: 'hover:border-blue-400',
    badge: 'bg-blue-100 text-blue-900 border-blue-200'
  },
  {
    huruf: 'A',
    judul: 'Adaptif',
    deskripsi: 'Membentuk pribadi yang fleksibel, cepat beradaptasi dengan perkembangan teknologi digital dan era global.',
    gradient: 'from-emerald-500 to-teal-600',
    border: 'hover:border-emerald-400',
    badge: 'bg-emerald-100 text-emerald-900 border-emerald-200'
  },
  {
    huruf: 'R',
    judul: 'Responsif',
    deskripsi: 'Cepat tanggap, peka, serta memiliki kepedulian sosial yang tinggi terhadap lingkungan sekitar.',
    gradient: 'from-purple-600 to-violet-600',
    border: 'hover:border-purple-400',
    badge: 'bg-purple-100 text-purple-900 border-purple-200'
  },
  {
    huruf: 'A',
    judul: 'Akhlaqul Karimah',
    deskripsi: 'Berperilaku santun, beradab, berakhlak mulia, serta konsisten beribadah berdasarkan Al-Qur\'an.',
    gradient: 'from-rose-500 to-pink-600',
    border: 'hover:border-rose-400',
    badge: 'bg-rose-100 text-rose-900 border-rose-200'
  }
])

// CORE VALUES REL HOMY
const coreValues = ref([
  { 
    title: 'Religius (REL)', 
    desc: 'Membentuk peserta didik yang beriman, bertaqwa, terbiasa beribadah, serta memiliki pemahaman Tahsin & Tahfidz Al-Qur\'an sejak dini.', 
    bgBadge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
  },
  { 
    title: 'Educative', 
    desc: 'Menyelenggarakan proses pembelajaran modern, berpusat pada siswa (student-centered), inovatif, dan berteknologi tinggi.', 
    bgBadge: 'bg-blue-50 text-blue-800 border-blue-200',
    icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
  },
  { 
    title: 'Loving', 
    desc: 'Menciptakan lingkungan yang penuh kasih sayang, kepedulian antar sesama, empati, dan pembentukan karakter akhlakul karimah.', 
    bgBadge: 'bg-rose-50 text-rose-800 border-rose-200',
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
  },
  { 
    title: 'Homy SCHOOL', 
    desc: 'Suasana belajar yang aman, nyaman, ramah anak, dan ramah lingkungan bagaikan di rumah sendiri.', 
    bgBadge: 'bg-amber-50 text-amber-800 border-amber-200',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
  }
])

const misiList = ref([
  'Menyelenggarakan pendidikan holistik berbasis nilai-nilai keislaman, moral, dan etika luhur.',
  'Mengembangkan potensi akademis dan non-akademis siswa secara optimal melalui pembelajaran inovatif dan berbasis TIK.',
  'Membentuk generasi pembelajar yang berkarakter Religius, Cerdas, Mandiri, Berwawasan Global, dan Peduli Lingkungan.',
  'Menyediakan lingkungan belajar yang ramah anak (Homy), kondusif, aman, dan penuh kasih sayang (Loving).',
  'Memperkuat kolaborasi yang bersinergi antara sekolah, orang tua, yayasan, dan masyarakat.'
])

const strukturOrganisasi = ref([
  {
    kategori: 'Pimpinan Yayasan & Komite',
    anggota: [
      { jabatan: 'Pembina Yayasan YWKA', nama: 'BPS YWKA Pusat / Perumka PT KAI', roleClass: 'bg-slate-900 text-white' },
      { jabatan: 'Ketua Pengurus YWKA Cabang', nama: 'Pengurus Cabang YWKA Bandung', roleClass: 'bg-slate-900 text-white' },
      { jabatan: 'Ketua Komite Sekolah', nama: 'Perwakilan Orang Tua Siswa', roleClass: 'bg-amber-700 text-white' }
    ]
  },
  {
    kategori: 'Pimpinan & Manajemen Sekolah',
    anggota: [
      { jabatan: 'Kepala Sekolah', nama: 'Pimpinan SD YWKA REL HOMY SCHOOL', roleClass: 'bg-slate-900 text-white' },
      { jabatan: 'Koordinator Kurikulum & Akademik', name: 'Tim Kurikulum YWKA', roleClass: 'bg-slate-800 text-white' },
      { jabatan: 'Koordinator Kesiswaan & Ekstrakurikuler', name: 'Tim Kesiswaan YWKA', roleClass: 'bg-slate-800 text-white' },
      { jabatan: 'Koordinator Keagamaan & Tahfidz', name: 'Tim Imtaq & Tahsin', roleClass: 'bg-slate-800 text-white' }
    ]
  }
])

const fasilitasList = ref([
  { title: 'Ruang Kelas Nyaman & Interactive', desc: 'Dilengkapi pendingin ruangan (AC), proyektor multimedia, dan tata letak meja fleksibel.', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { title: 'Laboratorium TIK / Komputer', desc: 'Perangkat komputer modern untuk pembelajaran literasi digital dan pemrograman dasar sejak dini.', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { title: 'Ruang Tahfidz & Musholla', desc: 'Area khusus yang tenang dan kondusif untuk kegiatan pembiasaan ibadah, Tahsin, dan Tahfidz Al-Qur\'an.', icon: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z' },
  { title: 'Perpustakaan & Reading Corner', desc: 'Koleksi buku bacaan anak, literasi edukatif, serta sudut baca nyaman untuk menumbuhkan minat baca.', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { title: 'Lapangan Olahraga Serbaguna', desc: 'Fasilitas area terbuka untuk olahraga Futsal, Basket, Bulutangkis, dan kegiatan upacara/senam.', icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z' },
  { title: 'Kantin Sehat & Area Ramah Anak', desc: 'Menyediakan makanan higienis terlindungi, serta area bermain terbuka yang aman dan diawasi.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' }
])
</script>

<template>
  <main class="bg-slate-50 min-h-screen text-slate-800 pb-20 selection:bg-amber-500 selection:text-slate-900">
    
    <!-- 1. HERO HEADER SECTION (TIDAK DIUBAH SAMA SEKALI) -->
    <section class="bg-slate-900 text-white py-12 md:py-16 border-b border-slate-800 relative overflow-hidden">
      <div class="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <span class="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-widest mb-3">
          🏛️ MENGENAL LEBIH DEKAT
        </span>
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          PROFIL <span class="text-amber-400">SD YWKA</span> REL HOMY SCHOOL
        </h1>
        <p class="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mt-3 font-normal leading-relaxed">
          Mewujudkan Pendidikan Holistik yang Religius, Inovatif, Ramah Anak, dan Berkarakter Unggul (<span class="font-medium text-slate-100">REL HOMY SCHOOL</span>).
        </p>
      </div>
    </section>

    <!-- 2. SAMBUTAN KEPALA SEKOLAH -->
    <section class="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 overflow-hidden">
        <div class="grid grid-cols-1 lg:grid-cols-12 items-center">
          
          <div class="lg:col-span-5 bg-gradient-to-b from-slate-900 via-slate-850 to-slate-950 p-8 sm:p-12 text-center flex flex-col justify-center items-center relative h-full">
            <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px]"></div>
            
            <div class="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full p-1.5 bg-gradient-to-tr from-amber-500 via-amber-300 to-amber-600 shadow-2xl mb-6">
              <div class="w-full h-full rounded-full bg-slate-900 overflow-hidden flex items-center justify-center border-4 border-slate-900 relative">
                <img 
                  v-if="fotoKepalaSekolahUrl && !imageError" 
                  :src="fotoKepalaSekolahUrl" 
                  :alt="`Foto Kepala Sekolah ${namaKepalaSekolah || 'SD YWKA REL HOMY SCHOOL'}`"
                  @error="handleImageError"
                  width="208"
                  height="208"
                  loading="eager"
                  class="w-full h-full object-cover object-top"
                />
                <svg v-else class="w-20 h-20 text-slate-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            </div>

            <h3 class="text-xl font-bold text-white tracking-wide">
              {{ namaKepalaSekolah || 'Kepala Sekolah SD YWKA' }}
            </h3>
            <p class="text-amber-400 text-xs font-semibold mt-1 uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
              {{ kepalaSekolah?.jabatan || 'SD YWKA REL HOMY SCHOOL BANDUNG' }}
            </p>
          </div>

          <div class="lg:col-span-7 p-6 sm:p-10 lg:p-12 bg-white">
            <div class="flex items-center space-x-2 text-amber-600 font-extrabold uppercase tracking-widest text-xs mb-3">
              <span class="w-8 h-1 bg-amber-500 rounded-full"></span>
              <span>Kata Sambutan</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-black text-slate-900 mb-6 leading-tight">
              Selamat Datang di SD YWKA REL HOMY SCHOOL
            </h2>
            
            <div class="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              <template v-if="kepalaSekolah?.motto">
                <p class="whitespace-pre-line italic text-slate-700 border-l-4 border-amber-500 pl-4 py-1">
                  <span class="text-3xl font-serif text-amber-500 leading-none">"</span>{{ kepalaSekolah.motto }}
                </p>
              </template>
              <template v-else>
                <p>
                  <span class="text-2xl font-serif text-amber-500 leading-none">"</span>Assalamu’alaikum Warahmatullahi Wabarakatuh.
                  Selamat datang di portal resmi SD YWKA REL HOMY SCHOOL Bandung. Kami berkomitmen untuk mendampingi setiap tumbuh kembang putra-putri Bapak/Ibu dengan fondasi akhlakul karimah dan keunggulan akademis.
                </p>
                <p>
                  Melalui pilar utama <strong class="text-slate-900 font-semibold">JUARA</strong> dan konsep <strong class="text-slate-900 font-semibold">REL HOMY (Religius, Educative, Loving, Homy)</strong>, kami menciptakan suasana belajar yang aman, nyaman bagaikan di rumah sendiri, namun tetap berstandar tinggi dalam pembentukan karakter unggul, penguasaan TIK, serta penanaman Al-Qur'an.
                </p>
              </template>
            </div>

            <div class="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p class="text-xs text-slate-400 uppercase tracking-wider font-semibold">Motto Kami</p>
                <p class="text-sm font-bold text-slate-900 italic mt-0.5">"Mendidik dengan Hati, Membentuk Generasi Berprestasi"</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- 3. SEJARAH & LATAR BELAKANG SEKOLAH -->
    <section class="py-12 bg-white border-y border-slate-200/80">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto text-center mb-10">
          <span class="text-xs font-bold uppercase tracking-widest text-amber-600">Jejak Langkah</span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Sejarah & Latar Belakang SD YWKA REL HOMY SCHOOL</h2>
          <div class="w-12 h-1 bg-amber-500 mx-auto mt-3 rounded-full"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div class="space-y-4 text-slate-600 leading-relaxed text-sm sm:text-base">
            <template v-if="apiProfil?.sejarah">
              <p class="whitespace-pre-line leading-relaxed">{{ apiProfil.sejarah }}</p>
            </template>
            <template v-else>
              <p>
                <strong class="text-slate-900">SD YWKA REL HOMY SCHOOL</strong> didirikan di bawah naungan <strong class="text-slate-900">Yayasan Wanita Kereta Api (YWKA)</strong>, sebuah lembaga sosial pendidikan yang berakar kuat dari keluarga besar Kereta Api Indonesia (PT KAI). Berlokasi strategis di kawasan Andir, Kota Bandung, sekolah ini telah menjadi rumah belajar bagi ribuan alumni selama berdekade-dekade.
              </p>
              <p>
                Seiring berkembangnya zaman, SD YWKA terus bertransformasi dengan mengadopsi tagline <strong class="text-slate-900 font-semibold">REL HOMY SCHOOL</strong> dan berpedoman pada karakter <strong class="text-amber-600 font-bold">JUARA</strong>. Konsep ini memadukan nilai keagamaan yang kuat, inovasi kurikulum modern, serta suasana belajar yang hangat.
              </p>
            </template>
          </div>

          <div class="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800">
            <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl"></div>
            <h3 class="text-lg font-extrabold text-amber-400 mb-5 flex items-center tracking-wide">
              <svg class="w-6 h-6 mr-2 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              Keunggulan Utama SD YWKA
            </h3>
            <ul class="space-y-3.5 text-sm text-slate-300">
              <li class="flex items-start">
                <span class="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">&check;</span>
                <span><strong>Bina Karakter Islami (JUARA):</strong> Pembiasaan Sholat Dhuha, Dzuhur Berjamaah, Tahsin, & Tahfidz rutin.</span>
              </li>
              <li class="flex items-start">
                <span class="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">&check;</span>
                <span><strong>Penguatan Teknologi (TIK):</strong> Pengenalan komputer dan literasi digital sejak kelas dasar.</span>
              </li>
              <li class="flex items-start">
                <span class="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">&check;</span>
                <span><strong>Suasana Belajar Homy:</strong> Pendekatan ramah anak yang membuat siswa merasa aman dan nyaman.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. VISI, MISI, CORE VALUES JUARA & REL HOMY -->
    <section class="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      <!-- VISI SEKOLAH REDESIGN -->
      <div class="relative rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white p-8 sm:p-14 shadow-2xl overflow-hidden border border-slate-800">
        <div class="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
        <div class="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl"></div>
        
        <div class="relative z-10 text-center max-w-4xl mx-auto space-y-4">
          <span class="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-extrabold bg-amber-500/15 text-amber-400 border border-amber-500/30 uppercase tracking-widest shadow-sm">
            ⭐ VISI UTAMA SEKOLAH
          </span>
          
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight text-white font-serif tracking-wide pt-2">
            "{{ apiProfil?.visi || 'Terwujudnya Generasi Peserta Didik yang Religius, Cerdas, Berkarakter Unggul, Bermartabat, dan Berwawasan Global dalam Suasana Belajar yang Homy.' }}"
          </h2>
          
          <div class="pt-4 flex items-center justify-center space-x-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
            <span>SD YWKA REL HOMY SCHOOL</span>
            <span>•</span>
            <span class="text-amber-400">REL HOMY SCHOOL</span>
          </div>
        </div>
      </div>

      <!-- CORE VALUES JUARA -->
      <div>
        <div class="text-center max-w-2xl mx-auto mb-10">
          <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 uppercase tracking-widest mb-2">
            Nilai Karakter Utama
          </span>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900">CORE VALUE : <span class="text-amber-600">J U A R A</span></h2>
          <p class="text-slate-500 text-xs sm:text-sm mt-2">Landasan Karakter Unggul Peserta Didik SD YWKA REL HOMY SCHOOL</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          <article 
            v-for="(val, idx) in coreValuesJUARA" 
            :key="idx"
            :class="['bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group', val.border]"
          >
            <div>
              <div class="flex items-center justify-between mb-4">
                <div :class="['w-12 h-12 rounded-2xl bg-gradient-to-br text-white font-black text-2xl flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform', val.gradient]">
                  {{ val.huruf }}
                </div>
                <span :class="['px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border', val.badge]">
                  JUARA
                </span>
              </div>
              <h3 class="text-lg font-extrabold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
                {{ val.judul }}
              </h3>
              <p class="text-slate-600 text-xs leading-relaxed">
                {{ val.deskripsi }}
              </p>
            </div>
          </article>
        </div>
      </div>

      <!-- CORE VALUES REL HOMY SCHOOL -->
      <div>
        <div class="text-center max-w-2xl mx-auto mb-10">
          <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-700 uppercase tracking-widest mb-2">
            Filosofi Pembelajaran
          </span>
          <h3 class="text-2xl sm:text-3xl font-black text-slate-900">4 Pilar "REL HOMY SCHOOL"</h3>
          <p class="text-slate-500 text-xs sm:text-sm mt-2">Prinsip Lingkungan Belajar Kondusif dan Ramah Anak</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <article 
            v-for="(val, idx) in coreValues" 
            :key="idx" 
            class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div class="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center mb-4 shadow-sm">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="val.icon" />
                </svg>
              </div>
              <span :class="['inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 border', val.bgBadge]">
                {{ val.title }}
              </span>
              <p class="text-slate-600 text-xs sm:text-sm leading-relaxed mt-1">{{ val.desc }}</p>
            </div>
          </article>
        </div>
      </div>

      <!-- MISI SEKOLAH REDESIGN -->
      <div class="bg-white rounded-3xl p-8 sm:p-12 shadow-xl shadow-slate-200/50 border border-slate-200/80">
        <div class="flex items-center space-x-3 mb-8">
          <div class="w-2 h-8 bg-amber-500 rounded-full"></div>
          <div>
            <h3 class="text-2xl font-black text-slate-900">Misi SD YWKA REL HOMY SCHOOL</h3>
            <p class="text-slate-500 text-xs sm:text-sm mt-0.5">Langkah Strategis dalam Mewujudkan Visi & Karakter JUARA</p>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4">
          <template v-if="apiProfil?.misi">
            <div 
              v-for="(misi, index) in apiProfil.misi.split('\n').filter(m => m.trim() !== '')" 
              :key="index" 
              class="flex items-start bg-slate-50 hover:bg-amber-50/40 p-5 rounded-2xl border border-slate-100 hover:border-amber-300/60 transition-all duration-200 group"
            >
              <span class="flex-shrink-0 w-9 h-9 rounded-xl bg-slate-900 group-hover:bg-amber-500 text-amber-400 group-hover:text-slate-950 font-black flex items-center justify-center text-sm mr-4 shadow-md transition-colors">
                {{ index + 1 }}
              </span>
              <p class="text-slate-700 text-sm sm:text-base font-medium self-center leading-relaxed group-hover:text-slate-900">
                {{ misi }}
              </p>
            </div>
          </template>

          <template v-else>
            <div 
              v-for="(misi, index) in misiList" 
              :key="index" 
              class="flex items-start bg-slate-50 hover:bg-amber-50/40 p-5 rounded-2xl border border-slate-100 hover:border-amber-300/60 transition-all duration-200 group"
            >
              <span class="flex-shrink-0 w-9 h-9 rounded-xl bg-slate-900 group-hover:bg-amber-500 text-amber-400 group-hover:text-slate-950 font-black flex items-center justify-center text-sm mr-4 shadow-md transition-colors">
                {{ index + 1 }}
              </span>
              <p class="text-slate-700 text-sm sm:text-base font-medium self-center leading-relaxed group-hover:text-slate-900">
                {{ misi }}
              </p>
            </div>
          </template>
        </div>
      </div>

    </section>

    <!-- 5. IDENTITAS & LEGALITAS SEKOLAH -->
    <section class="py-12 md:py-16 bg-slate-100/80 border-y border-slate-200/80">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-10">
          <span class="text-xs font-extrabold uppercase tracking-widest text-amber-600">Data Legalitas</span>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">Identitas Resmi Sekolah</h2>
          <p class="text-slate-500 text-xs sm:text-sm mt-1">Data Administrasi dan Kelembagaan SD YWKA REL HOMY SCHOOL</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="(item, idx) in identitasSekolah" 
            :key="idx" 
            class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 flex items-start space-x-4 hover:shadow-md transition-shadow"
          >
            <div class="p-3 rounded-xl bg-slate-900 text-amber-400 flex-shrink-0 shadow-sm">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
              </svg>
            </div>
            <div>
              <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">{{ item.label }}</p>
              <p class="text-slate-900 font-extrabold text-sm sm:text-base mt-1 leading-snug">{{ item.value }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. STRUKTUR ORGANISASI -->
    <section class="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10">
        <span class="text-xs font-extrabold uppercase tracking-widest text-amber-600">Manajemen</span>
        <h2 class="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">Struktur Organisasi</h2>
        <p class="text-slate-500 text-xs sm:text-sm mt-1">Tata Kelola Manajemen SD YWKA REL HOMY SCHOOL</p>
      </div>

      <div class="space-y-8">
        <div v-for="(grup, gIdx) in strukturOrganisasi" :key="gIdx" class="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200/80">
          <h3 class="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-4 mb-6 flex items-center">
            <span class="w-3 h-3 rounded-full bg-amber-500 mr-3"></span>
            {{ grup.kategori }}
          </h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div v-for="(st, sIdx) in grup.anggota" :key="sIdx" class="bg-slate-50 rounded-2xl p-4 border border-slate-200/70 flex flex-col justify-between hover:border-slate-300 hover:shadow-sm transition-all">
              <span :class="['inline-block px-2.5 py-1 rounded-lg text-[11px] font-bold mb-3 self-start', st.roleClass]">
                {{ st.jabatan }}
              </span>
              <p class="text-slate-900 font-extrabold text-sm">
                {{ st.jabatan === 'Kepala Sekolah' && namaKepalaSekolah ? namaKepalaSekolah : (st.nama || st.name) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 7. FASILITAS UNGGULAN SEKOLAH -->
    <section class="py-12 md:py-16 bg-white border-t border-slate-200/80">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <span class="text-amber-600 font-extrabold text-xs uppercase tracking-widest block mb-1">Kenyamanan Belajar Siswa</span>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900">Fasilitas Penunjang SD YWKA</h2>
          <div class="w-12 h-1 bg-amber-500 mx-auto mt-3 rounded-full"></div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <article v-for="(fas, fIdx) in fasilitasList" :key="fIdx" class="p-6 rounded-2xl bg-slate-50 border border-slate-200/60 hover:shadow-xl hover:border-amber-300/50 transition-all duration-300 group">
            <div class="w-12 h-12 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center mb-5 shadow-md group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="fas.icon" />
              </svg>
            </div>
            <h3 class="text-base font-extrabold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">{{ fas.title }}</h3>
            <p class="text-slate-600 text-xs sm:text-sm leading-relaxed">{{ fas.desc }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- 8. CALL TO ACTION -->
    <section class="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white py-12 border-t border-slate-800 relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
        <div class="text-center sm:text-left">
          <h2 class="text-xl sm:text-2xl font-black">Tertarik Menjadi Bagian dari SD YWKA REL HOMY SCHOOL?</h2>
          <p class="text-slate-300 text-xs sm:text-sm mt-1">Mari bergabung bersama keluarga besar SD YWKA REL HOMY SCHOOL.</p>
        </div>
        <a 
          href="https://wa.me/62895344044455" 
          target="_blank" 
          rel="noopener noreferrer" 
          aria-label="Hubungi PPDB SD YWKA REL HOMY SCHOOL via WhatsApp"
          class="inline-flex items-center bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-7 py-3.5 rounded-2xl transition-all duration-200 shadow-xl hover:shadow-amber-500/20 text-sm transform hover:-translate-y-0.5"
        >
          <svg class="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
          Hubungi PPDB / Informasi
        </a>
      </div>
    </section>

  </main>
</template>