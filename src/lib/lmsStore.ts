import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MOCK_MAPEL } from "./mockData";

export interface SoalPilgan {
  id: number;
  pertanyaan: string;
  pilihan: string[];
  kunci: number;
}

export interface PertemuanItem {
  id: string;
  nomor: number;
  judul: string;
  tipe: "REGULER" | "UTS" | "UAS";
  tanggal: string;
  durasiMenit?: number;
  petunjukUjian?: string;
  materi?: {
    judul: string;
    tipe: "DOKUMEN" | "VIDEO" | "RINGKASAN";
    ringkasan: string;
    kontenLengkap: string;
    fileUrl?: string;
    sudahDibaca: boolean;
  };
  tugas?: {
    id: string;
    judul: string;
    tipe: "PILIHAN_GANDA" | "ESSAY" | "UJIAN_UTS" | "UJIAN_UAS";
    deskripsi: string;
    soalPilgan?: SoalPilgan[];
    pertanyaanEssay?: string;
    sudahDikerjakan: boolean;
    nilai?: number | null;
    jawabanSiswa?: any;
    tanggalSubmit?: string;
  };
  presensi: {
    hadir: boolean;
    waktuHadir?: string | null;
  };
}

export interface MapelLMS {
  id: string;
  kode: string;
  nama: string;
  tingkat: string;
  jurusan: string;
  guruNama: string;
  guruNuptk: string;
  jadwal: string;
  ruang: string;
  pertemuanList: PertemuanItem[];
}

// Data awal lengkap pertemuan per mata pelajaran
const SEED_PERTEMUAN_BIOLOGI: PertemuanItem[] = [
  {
    id: "bio-p1",
    nomor: 1,
    judul: "Pertemuan 1: Struktur Sel & Organel Kehidupan",
    tipe: "REGULER",
    tanggal: "Senin, 04 Agustus 2026",
    materi: {
      judul: "Modul Ajar Bab 1: Sel Hewan dan Tumbuhan",
      tipe: "DOKUMEN",
      ringkasan: "Memahami membran plasma, nukleus, mitokondria, dan perbedaan mendasar sel eukariotik.",
      kontenLengkap:
        "Sel adalah unit struktural dan fungsional terkecil penyusun makhluk hidup. Organel penting meliputi mitokondria sebagai pusat respirasi seluler penghasil ATP, ribosom untuk sintesis protein, retikulum endoplasma, dan badan golgi yang berfungsi dalam sekresi sel. Sel tumbuhan memiliki dinding sel dari selulosa, kloroplas untuk fotosintesis, dan vakuola berukuran besar.",
      sudahDibaca: true,
    },
    tugas: {
      id: "bio-t1",
      judul: "Latihan Pilihan Ganda: Karakteristik Organel Sel",
      tipe: "PILIHAN_GANDA",
      deskripsi: "Jawablah 3 butir pertanyaan evaluasi pemahaman mengenai fungsi organel sel di bawah ini.",
      soalPilgan: [
        {
          id: 1,
          pertanyaan: "Organel sel yang berperan sebagai 'the powerhouse of cell' (penghasil energi ATP) adalah...",
          pilihan: ["Ribosom", "Mitokondria", "Lisosom", "Badan Golgi"],
          kunci: 1,
        },
        {
          id: 2,
          pertanyaan: "Bagian sel yang hanya dijumpai pada sel tumbuhan dan tidak ada pada sel hewan adalah...",
          pilihan: ["Mitokondria dan Membran Sel", "Dinding Sel dan Kloroplas", "Ribosom dan Vakuola Kecil", "Nukleus dan Retikulum Endoplasma"],
          kunci: 1,
        },
        {
          id: 3,
          pertanyaan: "Fungsi utama ribosom dalam sitoplasma sel adalah untuk...",
          pilihan: ["Fotosintesis", "Sintesis Protein", "Pencernaan Intraseluler", "Menyimpan Cadangan Makanan"],
          kunci: 1,
        },
      ],
      sudahDikerjakan: true,
      nilai: 100,
      tanggalSubmit: "04 Agustus 2026, 09:15 WIB",
    },
    presensi: {
      hadir: true,
      waktuHadir: "04 Agustus 2026, 07:28 WIB",
    },
  },
  {
    id: "bio-p2",
    nomor: 2,
    judul: "Pertemuan 2: Siklus Sel, Mitosis & Meiosis",
    tipe: "REGULER",
    tanggal: "Senin, 11 Agustus 2026",
    materi: {
      judul: "Modul Ajar Bab 2: Tahapan Pembelahan Sel",
      tipe: "DOKUMEN",
      ringkasan: "Penjelasan interfase, profase, metafase, anafase, dan telofase serta proses reduksi kromosom meiosis.",
      kontenLengkap:
        "Mitosis menghasilkan 2 sel anakan dengan jumlah kromosom diploid (2n) yang identik dengan sel induk, bertujuan untuk pertumbuhan dan regenerasi jaringan. Sebaliknya, Meiosis berlangsung dalam dua putaran pembelahan dan menghasilkan 4 sel gamet haploid (n) dengan variasi genetik akibat peristiwa pindah silang (crossing over) pada profase I.",
      sudahDibaca: true,
    },
    tugas: {
      id: "bio-t2",
      judul: "Tugas Essay: Perbedaan Signifikan Mitosis dan Meiosis",
      tipe: "ESSAY",
      deskripsi: "Jelaskan perbedaan mitosis dan meiosis ditinjau dari jumlah sel anakan, sifat kromosom, dan tujuan biologisnya.",
      pertanyaanEssay: "Jelaskan dengan terperinci perbedaan pokok antara pembelahan mitosis dan meiosis pada organisme eukariotik!",
      sudahDikerjakan: false,
      nilai: null,
    },
    presensi: {
      hadir: true,
      waktuHadir: "11 Agustus 2026, 07:25 WIB",
    },
  },
  {
    id: "bio-p3",
    nomor: 3,
    judul: "Pertemuan 3: Hukum Mendel I & II (Pewarisan Sifat)",
    tipe: "REGULER",
    tanggal: "Senin, 18 Agustus 2026",
    materi: {
      judul: "Modul Ajar Bab 3: Prinsip Persilangan Monohibrid & Dihibrid",
      tipe: "DOKUMEN",
      ringkasan: "Hukum Segregasi Bebas Mendel I dan Hukum Asortasi Bebas Mendel II pada kacang ercis (Pisum sativum).",
      kontenLengkap:
        "Hukum I Mendel menyatakan bahwa pada pembentukan gamet, pasangan alel akan memisah secara bebas (segregasi). Persilangan monohibrid dominan penuh menghasilkan rasio fenotipe F2 yaitu 3:1. Hukum II Mendel menyatakan bahwa alel dari lokus yang berbeda berpadu secara bebas saat fertilisasi, menghasilkan rasio fenotipe F2 dihibrid 9:3:3:1.",
      sudahDibaca: false,
    },
    tugas: {
      id: "bio-t3",
      judul: "Latihan Soal: Persilangan Dihibrid Tanaman",
      tipe: "PILIHAN_GANDA",
      deskripsi: "Selesaikan 3 soal kalkulasi rasio fenotipe persilangan dihibrid menurut aturan Hukum Mendel.",
      soalPilgan: [
        {
          id: 1,
          pertanyaan: "Rasio perbandingan fenotipe keturunan F2 pada persilangan dihibrid dominan penuh adalah...",
          pilihan: ["3 : 1", "9 : 3 : 3 : 1", "1 : 2 : 1", "12 : 3 : 1"],
          kunci: 1,
        },
        {
          id: 2,
          pertanyaan: "Persilangan antara tanaman berbiji bulat kuning (BbKk) dengan sesamanya akan menghasilkan gamet sebanyak...",
          pilihan: ["2 macam", "4 macam (BK, Bk, bK, bk)", "8 macam", "16 macam"],
          kunci: 1,
        },
        {
          id: 3,
          pertanyaan: "Hukum segregasi bebas terjadi pada saat tahapan...",
          pilihan: ["Fertilisasi", "Pembentukan Gamet (Gametogenesis)", "Masa Pertumbuhan Embrional", "Interfase G1"],
          kunci: 1,
        },
      ],
      sudahDikerjakan: false,
    },
    presensi: {
      hadir: false,
    },
  },
  {
    id: "bio-p4",
    nomor: 4,
    judul: "Pertemuan 4: Pola-pola Hereditas & Tautan Genetik",
    tipe: "REGULER",
    tanggal: "Senin, 25 Agustus 2026",
    materi: {
      judul: "Modul Ajar Bab 4: Tautan Kelamin & Gen Letal",
      tipe: "DOKUMEN",
      ringkasan: "Karakteristik penyakit menurun terpaut kromosom X seperti buta warna dan hemofilia.",
      kontenLengkap:
        "Gen yang terpaut kromosom seks X pada manusia diturunkan secara bersilang (criss-cross inheritance). Seorang wanita karier hemofilia (X^H X^h) menikah dengan pria normal (X^H Y) memiliki peluang melahirkan anak laki-laki hemofilia sebesar 50% dari total anak laki-laki, atau 25% dari total seluruh anak.",
      sudahDibaca: false,
    },
    tugas: {
      id: "bio-t4",
      judul: "Tugas Kasus: Analisis Pedigree / Silsilah Keluarga Hemofilia",
      tipe: "ESSAY",
      deskripsi: "Tuliskan genotipe masing-masing anggota keluarga berdasarkan diagram silsilah pewarisan gen terpaut seks.",
      pertanyaanEssay: "Seorang pria normal menikah dengan wanita pembawa sifat hemofilia. Analisislah kemungkinan genotipe dan fenotipe seluruh anak yang akan dilahirkan!",
      sudahDikerjakan: false,
    },
    presensi: {
      hadir: false,
    },
  },
  {
    id: "bio-p5",
    nomor: 5,
    judul: "Pertemuan 5: Mutasi Genetik & Ragam Aberasi Kromosom",
    tipe: "REGULER",
    tanggal: "Senin, 01 September 2026",
    materi: {
      judul: "Modul Ajar Bab 5: Mutasi Alami, Mutagen Buatan & Dampaknya",
      tipe: "DOKUMEN",
      ringkasan: "Mekanisme delesi, duplikasi, translokasi, aneuploidi (sindrom Down, Turner, Klinefelter).",
      kontenLengkap:
        "Mutasi merupakan perubahan urutan nukleotida DNA atau struktur kromosom. Mutasi gen dapat berupa substitusi basa nitrogen (transisi atau transversi), delesi, maupun insersi. Mutasi kromosom dapat mengubah struktur (inversi, translokasi, katenasi) atau jumlah kromosom (aneuploidi misal trisomi 21 pada Sindrom Down).",
      sudahDibaca: false,
    },
    tugas: {
      id: "bio-t5",
      judul: "Latihan Pilihan Ganda: Dampak Mutasi Genetik",
      tipe: "PILIHAN_GANDA",
      deskripsi: "Jawablah 3 pertanyaan mengenai agen mutagen dan kelainan mutasi.",
      soalPilgan: [
        {
          id: 1,
          pertanyaan: "Kelainan genetik akibat trisomi pada kromosom nomor 21 dinamakan...",
          pilihan: ["Sindrom Klinefelter", "Sindrom Down", "Sindrom Turner", "Sindrom Jacob"],
          kunci: 1,
        },
        {
          id: 2,
          pertanyaan: "Zat kimia seperti kolkisin dapat memicu terjadinya mutasi berupa...",
          pilihan: ["Delesi gen", "Poliploidi pada tanaman", "Translokasi resiprokal", "Penyakit anemia sel sabit"],
          kunci: 1,
        },
        {
          id: 3,
          pertanyaan: "Perubahan basa nitrogen purin dengan purin lainnya (misal Adenin menjadi Guanin) disebut mutasi...",
          pilihan: ["Transversi", "Transisi", "Delesi rangka", "Duplikasi"],
          kunci: 1,
        },
      ],
      sudahDikerjakan: false,
    },
    presensi: {
      hadir: false,
    },
  },
  {
    id: "bio-p6",
    nomor: 6,
    judul: "Pertemuan 6: Penilaian Tengah Semester (UTS) Berbasis CBT",
    tipe: "UTS",
    tanggal: "Senin, 22 September 2026",
    durasiMenit: 60,
    petunjukUjian:
      "Ujian Tengah Semester Semester Ganjil. Ujian ini menguji pemahaman materi Bab 1 sampai Bab 5. Waktu pengerjaan adalah 60 menit dengan pengacakan soal. Pastikan koneksi internet stabil dan kerjakan secara mandiri dengan jujur.",
    tugas: {
      id: "bio-uts",
      judul: "Penilaian Tengah Semester (UTS) Biologi Kelas XII",
      tipe: "UJIAN_UTS",
      deskripsi: "Evaluasi sumatif materi Sel, Pembelahan Sel, Hukum Mendel, dan Pola Hereditas.",
      soalPilgan: [
        {
          id: 1,
          pertanyaan: "Dalam siklus respirasi aerob, tempat berlangsungnya siklus Krebs di dalam sel adalah...",
          pilihan: ["Sitoplasma", "Matriks Mitokondria", "Membran Luar Mitokondria", "Krista Mitokondria"],
          kunci: 1,
        },
        {
          id: 2,
          pertanyaan: "Pada persilangan dihibrid AaBb x AaBb, proporsi keturunan yang bergenotipe homozigot resesif (aabb) adalah...",
          pilihan: ["1/16", "3/16", "9/16", "4/16"],
          kunci: 0,
        },
        {
          id: 3,
          pertanyaan: "Peristiwa pindah silang (crossing over) antara kromatid bukan saudara terjadi pada tahap...",
          pilihan: ["Profase I (Pakiten)", "Metafase I", "Anafase II", "Telofase I"],
          kunci: 0,
        },
        {
          id: 4,
          pertanyaan: "Seorang anak laki-laki buta warna memperoleh gen buta warna dari...",
          pilihan: ["Ayahnya saja", "Ibunya saja", "Bisa dari Ayah atau Ibu", "Kedua orang tuanya bersamaan"],
          kunci: 1,
        },
        {
          id: 5,
          pertanyaan: "Dua kromosom homolog yang mengalami patah kemudian saling bertukar segmen non-homolog disebut...",
          pilihan: ["Delesi", "Inversi", "Translokasi", "Duplikasi"],
          kunci: 2,
        },
      ],
      sudahDikerjakan: false,
      nilai: null,
    },
    presensi: {
      hadir: false,
    },
  },
  {
    id: "bio-p7",
    nomor: 7,
    judul: "Pertemuan 7: Bioteknologi Konvensional & Modern",
    tipe: "REGULER",
    tanggal: "Senin, 06 Oktober 2026",
    materi: {
      judul: "Modul Ajar Bab 6: Fermentasi, Kultur Jaringan & DNA Rekombinan",
      tipe: "DOKUMEN",
      ringkasan: "Penerapan mikroorganisme pangan dan rekayasa genetika insulin manusia.",
      kontenLengkap:
        "Bioteknologi konvensional memanfaatkan mikroorganisme secara langsung tanpa rekayasa genetika (seperti Rhizopus oryzae untuk tempe, Saccharomyces cerevisiae untuk roti). Bioteknologi modern melibatkan manipulasi DNA rekombinan, plasmid bakteri, enzim restriksi endonuklease, dan DNA ligase untuk memproduksi hormon insulin atau tanaman transgenik.",
      sudahDibaca: false,
    },
    tugas: {
      id: "bio-t7",
      judul: "Tugas Essay: Manfaat & Dampak Etis Rekayasa Genetika",
      tipe: "ESSAY",
      deskripsi: "Kemukakan analisis Anda tentang dampak tanaman transgenik bagi keseimbangan ekosistem dan keanekaragaman hayati.",
      pertanyaanEssay: "Jelaskan proses pembuatan insulin manusia menggunakan bakteri Escherichia coli dan analisis potensi dampaknya bagi bidang medis!",
      sudahDikerjakan: false,
    },
    presensi: {
      hadir: false,
    },
  },
  {
    id: "bio-p8",
    nomor: 8,
    judul: "Pertemuan 8: Penilaian Akhir Semester (UAS) Berbasis CBT",
    tipe: "UAS",
    tanggal: "Senin, 01 Desember 2026",
    durasiMenit: 90,
    petunjukUjian:
      "Ujian Akhir Semester (UAS) Asesmen Sumatif Komprehensif. Waktu pengerjaan 90 menit. Meliputi seluruh materi Biologi Semester Ganjil.",
    tugas: {
      id: "bio-uas",
      judul: "Penilaian Akhir Semester (UAS) Biologi Terpadu",
      tipe: "UJIAN_UAS",
      deskripsi: "Evaluasi akhir kompetensi mata pelajaran Biologi Kelas XII.",
      soalPilgan: [
        {
          id: 1,
          pertanyaan: "Enzim yang digunakan sebagai 'gunting biologi' untuk memotong rantai DNA pada sekuens spesifik adalah...",
          pilihan: ["DNA Ligase", "Enzim Restriksi Endonuklease", "DNA Polimerase", "Amilase"],
          kunci: 1,
        },
        {
          id: 2,
          pertanyaan: "Tahap sintesis protein yang melibatkan pembacaan kodon mRNA oleh tRNA di ribosom disebut...",
          pilihan: ["Transkripsi", "Translasi", "Replikasi", "Elongasi DNA"],
          kunci: 1,
        },
        {
          id: 3,
          pertanyaan: "Pada wanita penderita sindrom Turner, kariotipe kromosom yang terbentuk adalah...",
          pilihan: ["47, XXY", "45, XO", "47, XYY", "47, XXX"],
          kunci: 1,
        },
      ],
      sudahDikerjakan: false,
      nilai: null,
    },
    presensi: {
      hadir: false,
    },
  },
];

// Inisialisasi awal 5 kelas resmi
const INITIAL_CLASSES: MapelLMS[] = MOCK_MAPEL.map((m) => {
  return {
    id: m.id,
    kode: m.kode,
    nama: m.nama,
    tingkat: m.tingkat,
    jurusan: m.jurusan,
    guruNama: m.guruNama,
    guruNuptk: m.guruNuptk,
    jadwal: m.jadwal,
    ruang: m.ruang,
    pertemuanList: m.id === "mapel-1" ? SEED_PERTEMUAN_BIOLOGI : generateGenericMeetings(m.nama, m.guruNama),
  };
});

function generateGenericMeetings(mapelNama: string, guru: string): PertemuanItem[] {
  return [
    {
      id: `${mapelNama}-p1`,
      nomor: 1,
      judul: `Pertemuan 1: Kontrak Belajar & Konsep Dasar ${mapelNama}`,
      tipe: "REGULER",
      tanggal: "Senin, 04 Agustus 2026",
      materi: {
        judul: `Modul Pengenalan ${mapelNama}`,
        tipe: "DOKUMEN",
        ringkasan: `Penjelasan ruang lingkup dan alur pembelajaran ${mapelNama} semester ganjil.`,
        kontenLengkap: `Selamat datang di ruang pembelajaran ${mapelNama}. Dalam modul ini dibahas ruang lingkup kurikulum merdeka bersama guru pengampu ${guru}. Siswa diharapkan aktif mengikuti setiap sesi diskusi dan menyelesaikan modul tugas tepat waktu.`,
        sudahDibaca: true,
      },
      tugas: {
        id: `${mapelNama}-t1`,
        judul: `Latihan Pemahaman Awal ${mapelNama}`,
        tipe: "PILIHAN_GANDA",
        deskripsi: "Jawablah pertanyaan orientasi mata pelajaran.",
        soalPilgan: [
          {
            id: 1,
            pertanyaan: `Apa tujuan utama pembelajaran mata pelajaran ${mapelNama}?`,
            pilihan: [
              "Mengembangkan kompetensi nalar kritis dan literasi sains",
              "Sekadar menghafal rumus",
              "Mengisi waktu luang sekolah",
              "Tidak memiliki tujuan spesifik",
            ],
            kunci: 0,
          },
        ],
        sudahDikerjakan: true,
        nilai: 100,
        tanggalSubmit: "04 Agustus 2026, 09:30 WIB",
      },
      presensi: {
        hadir: true,
        waktuHadir: "04 Agustus 2026, 07:15 WIB",
      },
    },
    {
      id: `${mapelNama}-p2`,
      nomor: 2,
      judul: `Pertemuan 2: Pendalaman Materi Bab 1 ${mapelNama}`,
      tipe: "REGULER",
      tanggal: "Senin, 11 Agustus 2026",
      materi: {
        judul: `Modul Lanjutan Bab 1`,
        tipe: "DOKUMEN",
        ringkasan: "Teori utama, studi literatur, dan penerapan praktis dalam kehidupan sehari-hari.",
        kontenLengkap: `Kajian mendalam mengenai prinsip analitis ${mapelNama}. Pelajari seluruh studi kasus dan diskusikan bersama rekan sekelas saat sesi tatap muka.`,
        sudahDibaca: false,
      },
      tugas: {
        id: `${mapelNama}-t2`,
        judul: `Tugas Essay Analisis Kasus`,
        tipe: "ESSAY",
        deskripsi: "Ketik analisis kritis Anda mengenai studi literatur yang telah disediakan.",
        pertanyaanEssay: `Jelaskan bagaimana konsep utama dalam ${mapelNama} dapat diaplikasikan untuk menyelesaikan tantangan di lingkungan sekitar!`,
        sudahDikerjakan: false,
      },
      presensi: {
        hadir: false,
      },
    },
    {
      id: `${mapelNama}-p6`,
      nomor: 6,
      judul: `Pertemuan 6: Penilaian Tengah Semester (UTS) ${mapelNama}`,
      tipe: "UTS",
      tanggal: "Senin, 22 September 2026",
      durasiMenit: 60,
      petunjukUjian: `Asesmen Sumatif Tengah Semester CBT ${mapelNama}. Durasi 60 menit. Kerjakan dengan teliti dan jujur.`,
      tugas: {
        id: `${mapelNama}-uts`,
        judul: `Ujian Tengah Semester CBT ${mapelNama}`,
        tipe: "UJIAN_UTS",
        deskripsi: "Penilaian sumatif tengah semester kurikulum merdeka.",
        soalPilgan: [
          {
            id: 1,
            pertanyaan: `Prinsip fundamental dari pokok bahasan ${mapelNama} semester ini adalah...`,
            pilihan: ["Penerapan metode ilmiah yang sistematis", "Pengabaian data empiris", "Teori tanpa verifikasi", "Semua salah"],
            kunci: 0,
          },
          {
            id: 2,
            pertanyaan: "Dalam menyelesaikan permasalahan secara ilmiah, langkah pertama yang dilakukan adalah...",
            pilihan: ["Merumuskan masalah dan hipotesis", "Langsung menarik kesimpulan", "Mempublikasikan hasil tanpa uji", "Menghapus variabel kontrol"],
            kunci: 0,
          },
        ],
        sudahDikerjakan: false,
      },
      presensi: {
        hadir: false,
      },
    },
    {
      id: `${mapelNama}-p8`,
      nomor: 8,
      judul: `Pertemuan 8: Penilaian Akhir Semester (UAS) ${mapelNama}`,
      tipe: "UAS",
      tanggal: "Senin, 01 Desember 2026",
      durasiMenit: 90,
      petunjukUjian: `Asesmen Akhir Semester CBT ${mapelNama}. Durasi 90 menit. Evaluasi menyeluruh capaian pembelajaran.`,
      tugas: {
        id: `${mapelNama}-uas`,
        judul: `Ujian Akhir Semester CBT ${mapelNama}`,
        tipe: "UJIAN_UAS",
        deskripsi: "Evaluasi sumatif akhir semester ganjil.",
        soalPilgan: [
          {
            id: 1,
            pertanyaan: "Refleksi pembelajaran menyeluruh membuktikan bahwa ketekunan belajar menghasilkan...",
            pilihan: ["Capaian kompetensi unggul dan integritas tinggi", "Penurunan pemahaman", "Ketidakpastian hasil", "Semua salah"],
            kunci: 0,
          },
        ],
        sudahDikerjakan: false,
      },
      presensi: {
        hadir: false,
      },
    },
  ];
}

interface LMSState {
  classes: MapelLMS[];
  selectedClassId: string | null;
  enrolledMapelIds: string[];
  selectClass: (id: string | null) => void;
  markMateriSelesai: (mapelId: string, pertemuanId: string) => void;
  submitTugasPilgan: (mapelId: string, pertemuanId: string, skor: number) => void;
  submitTugasEssay: (mapelId: string, pertemuanId: string, jawabanText: string) => void;
  submitPresensiPertemuan: (mapelId: string, pertemuanId: string) => void;
  submitUjianCBT: (mapelId: string, pertemuanId: string, skor: number) => void;
  joinClassByCode: (code: string) => { success: boolean; message: string };
}

export const useLMSStore = create<LMSState>()(
  persist(
    (set, get) => ({
      classes: INITIAL_CLASSES,
      selectedClassId: null,
      enrolledMapelIds: ["mapel-1", "mapel-2", "mapel-3", "mapel-4", "mapel-5"],

      selectClass: (id) => set({ selectedClassId: id }),

      markMateriSelesai: (mapelId, pertemuanId) => {
        set((state) => ({
          classes: state.classes.map((cls) => {
            if (cls.id !== mapelId) return cls;
            return {
              ...cls,
              pertemuanList: cls.pertemuanList.map((p) => {
                if (p.id !== pertemuanId || !p.materi) return p;
                return {
                  ...p,
                  materi: {
                    ...p.materi,
                    sudahDibaca: true,
                  },
                };
              }),
            };
          }),
        }));
      },

      submitTugasPilgan: (mapelId, pertemuanId, skor) => {
        set((state) => ({
          classes: state.classes.map((cls) => {
            if (cls.id !== mapelId) return cls;
            return {
              ...cls,
              pertemuanList: cls.pertemuanList.map((p) => {
                if (p.id !== pertemuanId || !p.tugas) return p;
                return {
                  ...p,
                  tugas: {
                    ...p.tugas,
                    sudahDikerjakan: true,
                    nilai: skor,
                    tanggalSubmit: new Date().toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    }) + " WIB",
                  },
                };
              }),
            };
          }),
        }));
      },

      submitTugasEssay: (mapelId, pertemuanId, jawabanText) => {
        set((state) => ({
          classes: state.classes.map((cls) => {
            if (cls.id !== mapelId) return cls;
            return {
              ...cls,
              pertemuanList: cls.pertemuanList.map((p) => {
                if (p.id !== pertemuanId || !p.tugas) return p;
                return {
                  ...p,
                  tugas: {
                    ...p.tugas,
                    sudahDikerjakan: true,
                    nilai: 95, // Nilai default sementara guru memeriksa
                    jawabanSiswa: jawabanText,
                    tanggalSubmit: new Date().toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    }) + " WIB",
                  },
                };
              }),
            };
          }),
        }));
      },

      submitPresensiPertemuan: (mapelId, pertemuanId) => {
        const nowStr =
          new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }) +
          ", " +
          new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }) +
          " WIB";

        set((state) => ({
          classes: state.classes.map((cls) => {
            if (cls.id !== mapelId) return cls;
            return {
              ...cls,
              pertemuanList: cls.pertemuanList.map((p) => {
                if (p.id !== pertemuanId) return p;
                return {
                  ...p,
                  presensi: {
                    hadir: true,
                    waktuHadir: nowStr,
                  },
                };
              }),
            };
          }),
        }));
      },

      submitUjianCBT: (mapelId, pertemuanId, skor) => {
        set((state) => ({
          classes: state.classes.map((cls) => {
            if (cls.id !== mapelId) return cls;
            return {
              ...cls,
              pertemuanList: cls.pertemuanList.map((p) => {
                if (p.id !== pertemuanId || !p.tugas) return p;
                return {
                  ...p,
                  tugas: {
                    ...p.tugas,
                    sudahDikerjakan: true,
                    nilai: skor,
                    tanggalSubmit: new Date().toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    }) + " WIB",
                  },
                };
              }),
            };
          }),
        }));
      },

      joinClassByCode: (code) => {
        const trimmed = code.trim().toUpperCase();
        if (!trimmed) {
          return { success: false, message: "Kode kelas tidak boleh kosong." };
        }

        // Cek apakah ada kelas yang kodenya cocok
        const matched = get().classes.find(
          (c) => c.kode.toUpperCase().includes(trimmed) || trimmed.includes(c.kode.toUpperCase())
        );

        if (!matched) {
          return {
            success: false,
            message: `Kode kelas "${trimmed}" tidak ditemukan. Pastikan Anda menerima kode resmi dari dewan guru.`,
          };
        }

        if (get().enrolledMapelIds.includes(matched.id)) {
          return {
            success: true,
            message: `Anda sudah terdaftar di kelas ${matched.nama}.`,
          };
        }

        set((state) => ({
          enrolledMapelIds: [...state.enrolledMapelIds, matched.id],
        }));

        return {
          success: true,
          message: `Berhasil bergabung ke kelas ${matched.nama} (${matched.guruNama}).`,
        };
      },
    }),
    {
      name: "sman2buba_lms_store",
    }
  )
);
