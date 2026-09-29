import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  Search, 
  CheckCircle2, 
  ShieldCheck, 
  Users, 
  Trophy, 
  BookOpen, 
  School, 
  Calendar,
  FileCheck,
  Award,
  ChevronRight,
  Compass,
  Laptop
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-24 pb-20 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 bg-hero-gradient">
        {/* Decorative Background Elements */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-sky-200/40 via-sky-300/20 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-100/80 border border-sky-200 text-sky-800 text-xs sm:text-sm font-bold shadow-xs backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-sky-500 animate-ping" />
                <span>Penerimaan Peserta Didik Baru (PPDB) 2027/2028 Telah Dibuka</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Mewujudkan Generasi <span className="bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-500 bg-clip-text text-transparent">Unggul & Berkarakter</span> Mulia
              </h1>

              {/* Sub-headline */}
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Selamat datang di portal resmi <strong>SMA Negeri 2 Buay Bahuga</strong>, Kabupaten Way Kanan. Institusi pendidikan terakreditasi unggul yang memadukan keunggulan akademik, teknologi, dan pembinaan budi pekerti luhur.
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/ppdb"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 shadow-lg shadow-sky-500/30 hover:shadow-sky-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group"
                >
                  <Sparkles className="w-5 h-5 text-sky-200" />
                  <span>Daftar Siswa Baru (PPDB)</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/ppdb/cek-status"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-base font-bold text-slate-700 bg-white border border-slate-200 hover:border-sky-300 hover:text-sky-600 hover:bg-sky-50/50 shadow-xs transition-all"
                >
                  <Search className="w-4 h-4 text-slate-500" />
                  <span>Cek Status Pendaftaran</span>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs sm:text-sm text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Akreditasi A Unggul (BAN-S/M)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>Tanpa Biaya Pendaftaran (Gratis)</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Glowing Aura */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-sky-400 to-cyan-300 rounded-3xl blur-xl opacity-40 animate-pulse" />

                {/* Card Container */}
                <div className="relative rounded-3xl bg-white border border-sky-100 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
                  
                  {/* Top Header Card */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Profil Singkat</span>
                      <h2 className="text-lg font-extrabold text-slate-900">SMAN 2 Buay Bahuga</h2>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                      Aktif Beroperasi
                    </span>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100/80">
                      <School className="w-5 h-5 text-sky-600 mb-1.5" />
                      <div className="text-xs text-slate-500 font-medium">Kurikulum</div>
                      <div className="text-sm font-bold text-slate-900">Merdeka Belajar</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100/80">
                      <Laptop className="w-5 h-5 text-sky-600 mb-1.5" />
                      <div className="text-xs text-slate-500 font-medium">Digitalisasi</div>
                      <div className="text-sm font-bold text-slate-900">Lab CBT & E-Learning</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100/80">
                      <Trophy className="w-5 h-5 text-sky-600 mb-1.5" />
                      <div className="text-xs text-slate-500 font-medium">Prestasi</div>
                      <div className="text-sm font-bold text-slate-900">OSN & O2SN Daerah</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100/80">
                      <Users className="w-5 h-5 text-sky-600 mb-1.5" />
                      <div className="text-xs text-slate-500 font-medium">Ekstrakurikuler</div>
                      <div className="text-sm font-bold text-slate-900">12+ Pilihan Minat</div>
                    </div>
                  </div>

                  {/* PPDB Info Box */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-600 to-sky-700 text-white space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-sky-200">
                      <span>Periode Berjalan</span>
                      <span>Kuota: 180 Siswa</span>
                    </div>
                    <div className="font-extrabold text-base sm:text-lg">
                      PPDB 2027/2028 - Gelombang 1
                    </div>
                    <p className="text-xs text-sky-100 leading-snug">
                      Pendaftaran online terbuka untuk Jalur Zonasi, Afirmasi, Prestasi, dan Reguler.
                    </p>
                  </div>

                  <Link
                    href="/ppdb"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold transition shadow-sm"
                  >
                    <span>Pelajari Alur & Syarat Lengkap</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. STATISTIK KEUNGGULAN SEKOLAH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-sky-600">450+</div>
            <div className="text-sm font-bold text-slate-800">Siswa Aktif</div>
            <div className="text-xs text-slate-500">Tersebar di Fase E & F</div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-sky-600">32+</div>
            <div className="text-sm font-bold text-slate-800">Pendidik & Staf</div>
            <div className="text-xs text-slate-500">Kualifikasi S1 & S2</div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-sky-600">100%</div>
            <div className="text-sm font-bold text-slate-800">Tingkat Kelulusan</div>
            <div className="text-xs text-slate-500">Lolos SNBP & SNBT</div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-sky-600">A</div>
            <div className="text-sm font-bold text-slate-800">Akreditasi Sekolah</div>
            <div className="text-xs text-slate-500">Unggul & Terpercaya</div>
          </div>
        </div>
      </section>

      {/* 3. SAMBUTAN KEPALA SEKOLAH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          {/* Subtle Decorative Rings */}
          <div className="absolute right-0 bottom-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Principal Visual Badge */}
            <div className="lg:col-span-4 flex flex-col items-center text-center space-y-3">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-sky-400/40 bg-sky-900/60 flex items-center justify-center shadow-xl text-sky-200 overflow-hidden">
                <School className="w-16 h-16 sm:w-20 sm:h-20 text-sky-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Drs. H. Mulyadi, M.Pd.</h3>
                <p className="text-xs text-sky-300 font-medium">Kepala SMAN 2 Buay Bahuga</p>
                <p className="text-[11px] text-slate-400">NIP. 19680512 199303 1 005</p>
              </div>
            </div>

            {/* Principal Message Content */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-sky-500/20 text-sky-300 text-xs font-semibold uppercase tracking-wider">
                <span>Sambutan Pimpinan Sekolah</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                &ldquo;Pendidikan Bermutu Adalah Pondasi Masa Depan Generasi Bangsa&rdquo;
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
                Assalamu’alaikum Warahmatullahi Wabarakatuh, Tabik Pun!
                <br /><br />
                Puji syukur kita panjatkan ke hadirat Tuhan Yang Maha Kuasa. Selamat datang di portal resmi SMA Negeri 2 Buay Bahuga. Kami berkomitmen untuk terus meningkatkan mutu pembelajaran, melengkapi sarana teknologi, serta membentuk karakter siswa yang cerdas, beretika, dan mandiri.
                <br /><br />
                Melalui digitalisasi layanan termasuk sistem PPDB online ini, kami berupaya memberikan pelayanan pendidikan yang transparan, mudah, dan akuntabel bagi seluruh masyarakat Buay Bahuga dan sekitarnya.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. ALUR PPDB 4 LANGKAH MUDAH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-sky-600 uppercase tracking-widest bg-sky-100/70 px-3 py-1 rounded-full">
            Alur Penerimaan Peserta Didik Baru
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
            4 Langkah Mudah Mendaftar Online
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Calon siswa dan orang tua dapat mendaftar dengan praktis langsung melalui smartphone tanpa perlu mengantre.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-300 transition group space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-black text-xl group-hover:bg-sky-600 group-hover:text-white transition">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900">Siapkan Berkas</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Siapkan foto/scan dokumen prasyarat: Kartu Keluarga (KK), Pas Foto 3x4, dan Surat Keterangan Lulus (SKL) SMP.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-300 transition group space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-black text-xl group-hover:bg-sky-600 group-hover:text-white transition">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900">Isi Form Online</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Lengkapi biodata siswa, asal sekolah, dan data orang tua/wali serta unggah berkas yang telah disiapkan.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-300 transition group space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-black text-xl group-hover:bg-sky-600 group-hover:text-white transition">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900">Verifikasi Panitia</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Panitia PPDB memeriksa kelengkapan berkas fisik & digital secara seksama dan transparan.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-300 transition group space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-black text-xl group-hover:bg-sky-600 group-hover:text-white transition">
              4
            </div>
            <h3 className="text-base font-bold text-slate-900">Cetak Bukti Lapor Diri</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cek hasil kelulusan berkas dan unduh Bukti Pendaftaran PDF ber-QR Code untuk registrasi ulang di sekolah.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/ppdb"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold shadow-md shadow-sky-600/20 transition"
          >
            <span>Mulai Pendaftaran Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 5. KEUNGGULAN SEKOLAH */}
      <section className="bg-slate-100/70 py-20 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-14">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-widest bg-sky-100 px-3 py-1 rounded-full">
              Fasilitas & Program Unggulan
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
              Mengapa Memilih SMAN 2 Buay Bahuga?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
              Didukung sarana prasarana representatif dan tenaga pengajar profesional untuk kenyamanan belajar siswa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
                <Laptop className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Laboratorium Komputer & CBT</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Dilengkapi puluhan perangkat PC modern dengan koneksi internet cepat untuk asesmen berbasis komputer dan literasi digital.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Perpustakaan & Pojok Baca</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Koleksi ribuan buku pelajaran, referensi ilmiah, serta buku fiksi penunjang minat baca siswa dalam suasana tenang dan nyaman.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Bimbingan Karir & PTN</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Pendampingan intensif bagi siswa kelas XII untuk menembus Perguruan Tinggi Negeri (PTN) dan kedinasan melalui jalur prestasi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-500 p-8 sm:p-14 text-white shadow-xl shadow-sky-500/20 text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold max-w-2xl mx-auto leading-tight">
            Siap Menjadi Bagian Dari Keluarga Besar SMAN 2 Buay Bahuga?
          </h2>
          <p className="text-sm sm:text-base text-sky-100 max-w-xl mx-auto leading-relaxed">
            Daftarkan diri Anda sekarang pada periode PPDB yang sedang dibuka. Kuota penerimaan terbatas untuk tiap gelombang.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/ppdb"
              className="px-8 py-4 rounded-2xl bg-white text-sky-700 font-extrabold text-base shadow-md hover:bg-sky-50 active:scale-95 transition"
            >
              Isi Formulir Pendaftaran
            </Link>
            <Link
              href="/tentang"
              className="px-6 py-4 rounded-2xl bg-sky-700/60 hover:bg-sky-700 text-white font-bold text-base transition border border-sky-400/40"
            >
              Jelajahi Profil Sekolah
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
