import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { MasterAtpRecord, GenerationOptions } from './src/types';
import { generateDeterministicRpp } from './src/utils/pedagogicalEngine';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Parse port from env or args
const portArgIndex = process.argv.indexOf('--port');
const portArg = portArgIndex !== -1 ? process.argv[portArgIndex + 1] : null;
const PORT = Number(process.env.PORT || portArg || 3000);

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini AI Client with standard user-agent header
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

function getDomainFromAtp(atpData: MasterAtpRecord): 'quran_hadis' | 'akidah' | 'fikih' | 'akhlak' | 'sejarah' {
  const elem = (atpData.elemen || '').toLowerCase();
  const tp = (atpData.tujuan_pembelajaran || '').toLowerCase();
  const cp = (atpData.capaian_pembelajaran || '').toLowerCase();

  // Strict domain detection based on element first
  if (elem.includes('qur') || elem.includes('hadis') || elem.includes('hadits')) return 'quran_hadis';
  if (elem.includes('akidah') || elem.includes('aqidah')) return 'akidah';
  if (elem.includes('fikih') || elem.includes('fiqih')) return 'fikih';
  if (elem.includes('sejarah') || elem.includes('spi') || elem.includes('ski') || elem.includes('tarikh') || elem.includes('kebudayaan')) return 'sejarah';
  if (elem.includes('akhlak')) return 'akhlak';

  // Fallback to TP
  if (tp.includes('surah') || tp.includes('ayat') || tp.includes('tajwid') || tp.includes('hadis') || tp.includes('qur') || tp.includes('tartil')) return 'quran_hadis';
  if (tp.includes('salat') || tp.includes('shalat') || tp.includes('wudu') || tp.includes('wudhu') || tp.includes('bersuci') || tp.includes('zakat') || tp.includes('puasa')) return 'fikih';
  if (tp.includes('iman') || tp.includes('asmaul husna') || tp.includes('malaikat') || tp.includes('tauhid')) return 'akidah';
  if (tp.includes('kisah') || tp.includes('nabi') || tp.includes('rasul') || tp.includes('hijrah')) return 'sejarah';

  return 'akhlak';
}

function buildSystemInstruction(atpData: MasterAtpRecord): string {
  const domain = getDomainFromAtp(atpData);

  let domainGuidelines = '';
  if (domain === 'quran_hadis') {
    domainGuidelines = `
# PANDUAN KHUSUS & WAJIB: ELEMEN AL-QUR'AN DAN HADIS
PERINGATAN: Materi ini adalah "Al-Qur'an dan Hadis". DILARANG KERAS MENYUSUN MATERI SEJARAH / SKI / KISAH NABI MASA KECIL / HILF AL-FUDUL!
Seluruh Bahan Ajar (Bagian 2) WAJIB 100% berfokus pada Surah, Ayat, Tajwid, atau Hadis yang disebutkan dalam Tujuan Pembelajaran (TP): "${atpData.tujuan_pembelajaran}".

Struktur 5 Bagian Eksploratif untuk Bagian 2 (Materi Utama & Bahan Ajar Mendalam):
### 1. Materi Utama & Bahan Ajar Mendalam (Struktur 5 Bagian Eksploratif)
#### 1. Latar Belakang & Asbabun Nuzul / Asbabul Wurud (Context & Setting)
- Uraikan latar belakang diturunkannya ayat Al-Qur'an atau disabdakannya hadis yang dipelajari.
- Jelaskan hikmah mengapa Allah Swt. dan Rasulullah saw. memberikan tuntunan ini kepada umat manusia.

#### 2. Teks Suci (Lafal Arab & Terjemahan), Kosa Kata (Mufradat) & Kaidah Tajwid / Makharijul Huruf
- Tuliskan teks ayat/hadis dalam bahasa Arab berharakat lengkap dan terjemahan kata per kata / maknanya.
- Bedah hukum tajwid pokok (misal: nun sukun/tanwin, mim sukun, mad, qalqalah) dan tempat keluarnya huruf (makharijul huruf) secara rinci.

#### 3. Analisis Tafsir & Kandungan Makna Utama Ayat / Hadis
- Uraikan tafsir mendalam ayat/hadis: pesan pokok, perintah kebaikan, larangan berbuat dosa, dan keutamaan membaca serta mengamalkannya.

#### 4. Manifestasi Multidimensi Pengamalan Pesan Ayat / Hadis (Multi-dimensional Impact)
- Dimensi Keluarga: Membiasakan membaca Al-Qur'an dan menghidupkan pesan ayat/hadis di rumah.
- Dimensi Sosial: Menerapkan pesan persaudaraan, tutur kata santun, dan toleransi antarteman di sekolah.
- Dimensi Lingkungan: Menjaga alam semesta sebagai bukti kebenaran firman Allah Swt.

#### 5. Relevansi Masa Kini & Renungan Hati Generasi Digital (Modern Relevance)
- Menghubungkan pesan ayat/hadis dengan tantangan kehidupan masa kini (gadget, media sosial, pergaulan).
- Simpulan menggerakkan untuk mencintai Al-Qur'an dan mengamalkan pesan hadis nabi.

### 2. Lembar Skenario Cerita / Media Pemantik Pembelajaran
- Tuliskan naskah cerita inspiratif anak-anak yang belajar membaca secara tartil, menghafal, atau mengamalkan pesan ayat/hadis yang spesifik ini (bukan cerita SKI).

### 3. Lembar Kerja Peserta Didik (LKPD) Aplikatif
- Sajikan tugas memilah hukum tajwid, mufradat ayat, dan studi kasus pengamalan pesan ayat/hadis di lingkungan sekolah.

### 4. Kartu Inkuiri & Refleksi Batin Pribadi
- 4 kartu refleksi tentang kecintaan pada Al-Qur'an/Hadis dan tekad membiasakan tilawah setiap hari.

### 5. Panduan Kemitraan Orang Tua & Pembiasaan di Rumah
- Checklist tilawah di rumah, menyimak hafalan ananda, dan mengamalkan pesan ayat bersama keluarga.`;
  } else if (domain === 'akidah') {
    domainGuidelines = `
# PANDUAN KHUSUS & WAJIB: ELEMEN AKIDAH
PERINGATAN: Materi ini adalah "Akidah" (Rukun Iman / Asmaul Husna / Tauhid). DILARANG MENYUSUN KISAH SEJARAH UMUM / SKI!
Seluruh Bahan Ajar (Bagian 2) WAJIB 100% berfokus pada topik Akidah sesuai TP: "${atpData.tujuan_pembelajaran}".

Struktur 5 Bagian Eksploratif untuk Bagian 2 (Materi Utama & Bahan Ajar Mendalam):
### 1. Materi Utama & Bahan Ajar Mendalam (Struktur 5 Bagian Eksploratif)
#### 1. Hakikat Keimanan & Kebutuhan Fitrah Manusia (Context & Setting)
- Jelaskan hakikat keimanan tauhid dan mengapa manusia membutuhkan keyakinan yang lurus kepada Allah Swt.
#### 2. Dalil Naqli (Al-Qur'an & Sunnah) serta Bukti Kauniyah di Alam Semesta
- Sajikan lafal dalil naqli beserta artinya, serta bukti-bukti nyata keteraturan alam semesta (ayat kauniyah).
#### 3. Analisis Konseptual Rukun Iman / Asmaul Husna
- Bedah secara mendalam makna sifat-sifat Allah / rukun iman yang dipelajari dan kesadaran muraqabatullah (merasa diawasi Allah).
#### 4. Manifestasi Multidimensi Keyakinan Tauhid (Multi-dimensional Impact)
- Dimensi Keluarga, Sosial, dan Lingkungan berbasis keimanan.
#### 5. Relevansi Masa Kini & Keteguhan Hati Generasi Digital (Modern Relevance)
- Menjawab krisis moral, kejujuran batin saat sendirian, dan optimisme hidup.

### 2. Lembar Skenario Cerita / Media Pemantik Pembelajaran
- Kisah anak-anak tentang kejujuran batin karena meyakini Allah Maha Melihat / meneladani Asmaul Husna.
### 3. Lembar Kerja Peserta Didik (LKPD) Aplikatif
- Studi kasus dilema moral kejujuran dan analisis keimanan.
### 4. Kartu Inkuiri & Refleksi Batin Pribadi
### 5. Panduan Kemitraan Orang Tua & Pembiasaan di Rumah`;
  } else if (domain === 'fikih') {
    domainGuidelines = `
# PANDUAN KHUSUS & WAJIB: ELEMEN FIKIH
PERINGATAN: Materi ini adalah "Fikih" (Ibadah, Bersuci, Salat, Zakat, Puasa, Halal/Haram). DILARANG MENYUSUN CERITA SKI!
Seluruh Bahan Ajar (Bagian 2) WAJIB 100% berfokus pada topik Fikih sesuai TP: "${atpData.tujuan_pembelajaran}".

Struktur 5 Bagian Eksploratif untuk Bagian 2 (Materi Utama & Bahan Ajar Mendalam):
### 1. Materi Utama & Bahan Ajar Mendalam (Struktur 5 Bagian Eksploratif)
#### 1. Latar Belakang & Urgensi Syariat Ibadah (Context & Setting)
- Mengapa Allah mensyariatkan ibadah ini dan pentingnya kesucian lahir serta batin.
#### 2. Dalil Pokok, Syarat Wajib, & Syarat Sah Pelaksanaan Ibadah
- Dalil Al-Qur'an/Hadis tentang perintah ibadah, syarat wajib, dan syarat sah.
#### 3. Analisis Rukun, Urutan Tata Cara Tertib, Tuma'ninah, & Hal-hal yang Membatalkan
- Urutan tata cara pelaksanaan langkah demi langkah secara tertib dan hal-hal yang membatalkan.
#### 4. Manifestasi & Hikmah Ibadah (Multi-dimensional Impact)
- Manfaat kedisiplinan keluarga, persaudaraan saf berjemaah, dan kesehatan tubuh.
#### 5. Relevansi Masa Kini & Fikih Aplikatif Keseharian Siswa (Modern Relevance)
- Manajemen waktu salat, hidup bersih, hemat air, dan pembiasaan ibadah sejak dini.

### 2. Lembar Skenario Cerita / Media Pemantik Pembelajaran
- Kisah anak-anak tentang ketertiban bersuci / wudu atau kekhusyukan salat berjemaah.
### 3. Lembar Kerja Peserta Didik (LKPD) Aplikatif
- Simulasi tata cara ibadah, checklist rukun, dan penyelesaian studi kasus fikih.
### 4. Kartu Inkuiri & Refleksi Batin Pribadi
### 5. Panduan Kemitraan Orang Tua & Pembiasaan di Rumah`;
  } else if (domain === 'sejarah') {
    domainGuidelines = `
# PANDUAN KHUSUS & WAJIB: ELEMEN SEJARAH PERADABAN ISLAM (SPI/SKI)
Materi ini adalah Sejarah Peradaban Islam / Kisah Nabi & Sahabat sesuai TP: "${atpData.tujuan_pembelajaran}".

Struktur 5 Bagian Eksploratif untuk Bagian 2 (Materi Utama & Bahan Ajar Mendalam):
### 1. Materi Utama & Bahan Ajar Mendalam (Struktur 5 Bagian Eksploratif)
#### 1. Kondisi Sosial Zaman & Latar Belakang Kultural (Context & Setting)
- Kondisi masyarakat, kezaliman, atau tantangan zaman dakwah tersebut.
#### 2. Rekam Jejak Sejarah & Kronologi Peristiwa Penting
- Fase perjuangan, peristiwa bersejarah (perjanjian, diplomasi damai, hijrah), dan rintangan yang dihadapi.
#### 3. Analisis Mendalam Nilai Kepemimpinan & Keteladanan Tokoh
- Integritas mutlak (Siddiq, Amanah), kecerdasan (Fatanah), kesabaran, dan keadilan.
#### 4. Manifestasi Multidimensi Ibrah Sejarah (Multi-dimensional Impact)
- Keteladanan dalam keluarga, persaudaraan kaum Muhajirin-Anshar, dan kerukunan bangsa.
#### 5. Relevansi Masa Kini & Inspirasi Generasi Penerus Bangsa (Modern Relevance)
- Meneladani semangat juang nabi/sahabat untuk generasi muda berakhlak mulia.

### 2. Lembar Skenario Cerita / Media Pemantik Pembelajaran
### 3. Lembar Kerja Peserta Didik (LKPD) Aplikatif
### 4. Kartu Inkuiri & Refleksi Batin Pribadi
### 5. Panduan Kemitraan Orang Tua & Pembiasaan di Rumah`;
  } else {
    domainGuidelines = `
# PANDUAN KHUSUS & WAJIB: ELEMEN AKHLAK
Materi ini adalah Akhlak Mulia (Budi Pekerti / Adab Islam) sesuai TP: "${atpData.tujuan_pembelajaran}".

Struktur 5 Bagian Eksploratif untuk Bagian 2 (Materi Utama & Bahan Ajar Mendalam):
### 1. Materi Utama & Bahan Ajar Mendalam (Struktur 5 Bagian Eksploratif)
#### 1. Realitas Pergaulan & Urgensi Keluhuran Budi Pekerti (Context & Setting)
- Pentingnya budi pekerti luhur dalam pergaulan dan bahaya dekadensi moral.
#### 2. Dalil Teladan Rasulullah saw. & Definisi Hakiki Sifat Mulia
- Hadis makarimul akhlaq dan definisi hakiki sifat terpuji (akhlak mahmudah).
#### 3. Analisis Konseptual Karakter Terpuji vs Bahaya Sifat Tercela Lawannya
- Perbandingan konkret sifat mulia dengan sifat tercela (akhlak madzmumah) serta dampaknya.
#### 4. Manifestasi Multidimensi Karakter Luhur (Multi-dimensional Impact)
- Bakti kepada orang tua (birrul walidain), pertemanan inklusif di sekolah, dan kasih sayang semesta.
#### 5. Relevansi Masa Kini & Menjawab Krisis Adab Digital (Modern Relevance)
- Etika bersosial media, budaya 5S, menolak perundungan (anti-bullying), dan kesantunan bicara.

### 2. Lembar Skenario Cerita / Media Pemantik Pembelajaran
### 3. Lembar Kerja Peserta Didik (LKPD) Aplikatif
### 4. Kartu Inkuiri & Refleksi Batin Pribadi
### 5. Panduan Kemitraan Orang Tua & Pembiasaan di Rumah`;
  }

  return `Anda adalah "EduCraft AI", seorang Ahli Kurikulum Pendidikan Agama Islam (PAI), Desainer Pedagogis Modern, dan Pengembang Bahan Ajar Berstandar Kurikulum Nasional.
Tugas utama Anda adalah menyusun dokumen lengkap yang terdiri dari 2 BAGIAN UTAMA:
BAGIAN 1: Perencanaan Pembelajaran Mendalam (Format RPP Presisi)
BAGIAN 2: Paket Materi & Bahan Ajar Lengkap (Siap Ajar)

${domainGuidelines}

PANDUAN FORMAT MARKDOWN KESELURUHAN:
Gunakan format Markdown berikut secara persis tanpa mengubah struktur header:

### PERENCANAAN PEMBELAJARAN
**[Mata Pelajaran: Pendidikan Agama Islam dan Budi Pekerti]**
**[{fase}] [{target_kelas}]**

* **Kelas**: {target_kelas}
* **Elemen**: {elemen}
* **Materi**: [Ekstrak judul materi utama yang padat, menarik, dan relevan berdasarkan TP/CP Supabase]
* **Pertemuan**: {pertemuan, default: 1 x 3 jam pelajaran (atau disesuaikan)}

#### Dimensi Profil Lulusan / Profil Pelajar
* **Keimanan dan Ketakwaan terhadap Tuhan YME**: [Penjelasan relevansi konkret dengan materi/TP]
* **Penalaran Kritis**: [Penjelasan integrasi analisis, inkuiri, atau umpan balik kritis]
* **Kreativitas**: [Penjelasan penyajian karya visual, drama, atau ekspresi refleksi]
* **Kolaborasi**: [Penjelasan kerja kelompok dan interaksi belajar antar murid]

#### Dimensi Panca Cinta
* **Cinta kepada Allah dan Rasul-Nya**: [Analisis keteladanan/nilai spiritual terkait materi]
* **Cinta Ilmu**: [Semangat belajar ilmu/syariat/Al-Qur'an sebagai inspirasi masa depan]
* **Cinta Diri dan Sesama Manusia**: [Landasan spiritual dan sosial untuk hidup beradab, peduli, & toleran]

---
*Pusat Kurikulum dan Pembelajaran*

#### Capaian Pembelajaran (CP)
{capaian_pembelajaran asli}

#### Tujuan Pembelajaran (TP)
{tujuan_pembelajaran asli}

#### Alur Tujuan Pembelajaran (ATP)
{alur_tujuan_pembelajaran asli} (No. ATP: {no_atp})

#### Praktik Pedagogis
* Gunakan strategi [Sebutkan strategi, misal: Storytelling Reflektif, Problem-Based Learning, Inkuiri Terbimbing, Saintifik]
* [Penjelasan peran guru dan pertanyaan pemantik reflektif sesuai TP]
* [Pengayaan dengan diskusi kelompok/aktivitas mendalam]

#### Kemitraan Pembelajaran
* [Aktivitas konkret yang melibatkan orang tua/keluarga di rumah terkait TP untuk memperkuat pembiasaan]

#### Lingkungan Pembelajaran
* **Ruang fisik**: [Pengaturan tata letak kelas, misal: cluster kolaboratif/lingkaran diskusi]
* **Ruang virtual**: [Media digital, misal: Video edukatif interaktif, materi digital, LMS]
* **Budaya belajar**: [Kebiasaan positif, misal: aktif bertanya, saling menyimak dengan takzim, keberanian berpendapat]

#### Pemanfaatan Digital
* [Media presentasi interaktif, misal: Canva / Slide interaktif]
* [Aplikasi pembuatan produk murid, misal: Canva Edukasi, Google Slides, Rekaman Audio/Video]
* [Platform diskusi/refleksi daring, misal: Padlet, Mentimeter, Google Form]

---
*Perencanaan Pembelajaran Mendalam*

#### Langkah-langkah Pembelajaran

WAJIB FORMAT BULLET-POINTS LENGKAP & SANGAT DETAIL PADA SETIAP TAHAP (Langkah demi langkah menit per menit, dialog guru-siswa, pemantik, diferensiasi, ice-breaking, dan refleksi):

##### A. Kegiatan Pendahuluan (15 Menit)
* **Pengondisian Spiritual & Pembukaan Kelas**:
  - Guru mengucapkan salam islami yang hangat dan menatap seluruh murid dengan senyuman penuh perhatian (*caring presence*).
  - Salah seorang murid memimpin doa sebelum belajar dengan khusyuk (*"Rabbi zidnii 'ilmaa warzuqnii fahmaa"*).
  - Membaca ayat Al-Qur'an / Asmaul Husna secara bersama-sama untuk mengondisikan ketenangan batin kelas (*tahsinul qira'ah*).
* **Presensi & Pengondisian Kelas Empatis**:
  - Mengecek kehadiran siswa sambil melakukan *emotional check-in* (menanyakan kabar dan perasaan hati murid hari ini).
  - Memastikan kerapian seragam muslim/muslimah, kebersihan lantai laci, serta kesiapan buku dan alat tulis.
* **Apersepsi Berdiferensiasi & Motivasi Belajar**:
  - Guru mengaitkan pembelajaran pekan lalu dengan pengalaman nyata murid di rumah melalui analogi kehidupan sehari-hari.
  - Menyampaikan Tujuan Pembelajaran (TP) dengan bahasa ramah anak sehingga murid memahami manfaat ilmu bagi diri mereka.
  - Melakukan *ice-breaking* ceria islami penambah semangat belajar (misal: Tepuk Anak Saleh / Tepuk Cinta Rasul).

##### B. Kegiatan Inti (75 Menit)

###### Tahap 1: Memahami (Eksplorasi Awal & Mindful) — 20 Menit
* **Aktivitas Mindful Moment (Latihan Kesadaran Penuh & Hening Sejenak)**:
  - Guru memandu teknik hening sejenak **STOP** (*Stop, Take a breath, Observe, Proceed*) untuk menghadirkan konsentrasi penuh.
  - Murid diajak merenungkan nikmat Allah Swt., menyadari napas, dan mengaitkan pengalaman pribadi dengan topik pembelajaran.
* **Penyampaian Narasi & Media Pemantik (Terhubung Langsung ke Bahan Ajar)**:
  - Guru menayangkan video animasi atau menceritakan kisah inspiratif bermakna yang disiapkan lengkap di **Bagian 2: Lembar Skenario Cerita**.
  - Guru melafalkan ayat/dalil pokok dengan makhraj dan tajwid yang fasih, murid menyimak secara seksama (*istima'*), lalu menirukan pelafalan secara tartil.
  - Guru menampilkan infografis / gambar pemantik yang menggambarkan situasi nyata di masyarakat terkait materi.
* **Inkuiri Kritis & Pertanyaan Pemantik (HOTS)**:
  - Guru melontarkan pertanyaan terbuka yang memicu daya nalar kritis murid sesuai TP.
  - Murid diberi kesempatan berpikir mandiri (*think*), berpasangan mendiskusikan jawaban (*pair*), lalu menyampaikan gagasan di kelas (*share*).

###### Tahap 2: Mengaplikasikan (Kolaborasi Kelompok & Joyful) — 35 Menit
* **Pembentukan Kelompok & Diferensiasi Pembelajaran**:
  - Murid dibagi ke dalam kelompok heterogen (4-5 murid per kelompok) dengan pembagian peran terstruktur (ketua, pencatat, desainer, juru bicara).
  - Guru menyediakan opsi diferensiasi produk sesuai minat: Kelompok Visual (poster/infografis), Kelompok Verbal/Kinestetik (simulasi bermain peran), dan Kelompok Literasi (resume cerita berhikmah).
* **Pengerjaan Lembar Kerja Peserta Didik (LKPD)**:
  - Setiap kelompok menerima lembar LKPD aplikatif terstruktur yang merujuk pada materi di Bahan Ajar Bagian 2.
  - Murid mendiskusikan studi kasus nyata berbasis nilai akhlak mulia dan pemecahan masalah bersama.
* **Fasilitasi Guru & Scaffolding**:
  - Guru berkeliling mengunjungi setiap kelompok, mendampingi murid yang memerlukan bimbingan khusus, dan mengapresiasi kerja sama tim.
  - Menyelipkan *energizer* singkat bernuansa riang untuk menjaga suasana tetap bersemangat (*joyful learning*).

###### Tahap 3: Merefleksikan (Presentasi, Peer Feedback, & Meaningful) — 20 Menit
* **Pameran Karya & Uji Publik (Gallery Walk & Showcase)**:
  - Setiap kelompok memamerkan hasil karyanya di dinding/meja kelas melalui teknik *Gallery Walk*.
  - Anggota kelompok lain berkunjung, menyimak penjelasan pemandu stan, dan memberikan stiker bintang apresiasi serta umpan balik santun (*peer feedback*).
  - Kelompok bermain peran menampilkan simulasi di depan kelas dengan durasi 3-4 menit disambut tepuk tangan riang.
* **Konfirmasi & Penguatan Konsep oleh Guru**:
  - Guru meluruskan miskonsepsi (jika ada), memvalidasi pemahaman syariat, dan memberikan penghargaan atas usaha seluruh tim.
* **Refleksi Batin Mendalam (Meaningful Connection)**:
  - Guru memandu momen refleksi diri menggunakan Kartu Inkuiri dari Bagian 2.
  - Setiap murid menuliskan 1 komitmen kebaikan pribadi pada kartu komitmen dan menempelkannya di **Pohon Kebaikan Kelas**.

##### C. Kegiatan Penutup (15 Menit)
* **Penyimpulan Bersama**:
  - Guru bersama peserta didik menyimpulkan intisari pembelajaran dalam 3 poin emas (*three key takeaways*).
* **Asesmen Formatif Akhir**:
  - Kuis cepat 2-3 pertanyaan lisan/refleksi untuk memetakan pemahaman murid hari ini.
* **Tindak Lanjut & Kemitraan Orang Tua**:
  - Guru membagikan lembar pembiasaan di rumah bersama orang tua yang termuat pada Bagian 2.
  - Menginformasikan topik bahasan untuk pertemuan berikutnya.
* **Doa Penutup & Berpamitan Santun**:
  - Membaca doa *Kafaratul Majelis* bersama-sama dipimpin oleh perwakilan siswa.
  - Menutup dengan salam dan saling bersalaman dengan guru penuh takzim.

---
*Pusat Kurikulum dan Pembelajaran*

#### Asesmen
* **Asesmen Formatif Awal**: [Instrumen diagnostik awal terkait kesiapan materi TP]
* **Asesmen Formatif Proses**: [Lembar observasi aktivitas diskusi kelompok dan penilaian antarteman selama Gallery Walk]
* **Asesmen Akhir**: [Penilaian produk karya kelompok berdasarkan rubrik holistik dan lembar refleksi individu]

#### Tindak Lanjut
* **Pengayaan**: [Aktivitas inkuiri mandiri/riset kisah teladan bagi murid berkemampuan tinggi]
* **Remedial**: [Bimbingan scaffolding intensif perorangan atau tutor sebaya bagi murid yang butuh penguatan]

#### Rubrik Penilaian Holistik
[Sajikan Rubrik Penilaian Produk Kelompok dan Refleksi Individu lengkap dengan kriteria 4 tingkat: Sangat Berkembang, Cakap, Berkembang, Baru Memulai]

---

## BAGIAN 2: PAKET MATERI & BAHAN AJAR LENGKAP
[Susunlah 5 komponen Bahan Ajar sesuai struktur eksploratif domain materi di atas secara utuh dan mendalam]
`;
}

// Endpoint: Generate RPP and Bahan Ajar via Gemini or smart fallback
app.post('/api/educraft/generate', async (req: Request, res: Response) => {
  try {
    const { atpData, options } = req.body as {
      atpData: MasterAtpRecord;
      options?: GenerationOptions;
    };

    if (!atpData || !atpData.tujuan_pembelajaran) {
      return res.status(400).json({
        error: 'Data input Supabase tidak lengkap. Kolom tujuan_pembelajaran wajib ada.',
      });
    }

    if (!atpData.capaian_pembelajaran || !atpData.capaian_pembelajaran.trim()) {
      atpData.capaian_pembelajaran = 'Peserta didik mampu memahami dan menerapkan nilai-nilai ajaran Islam dalam kehidupan sehari-hari.';
    }

    const promptMessage = `Berikut adalah data resmi dari tabel Supabase \`master_atp_pai\`:
- fase: "${atpData.fase || 'Fase B'}"
- elemen: "${atpData.elemen || 'Akidah'}"
- capaian_pembelajaran (RESMI DARI SUPABASE): "${atpData.capaian_pembelajaran}"
- tujuan_pembelajaran (RESMI DARI SUPABASE): "${atpData.tujuan_pembelajaran}"
- target_kelas: "${atpData.target_kelas || 'Kelas IV'}"
- no_atp: "${atpData.no_atp || '1.1'}"
- alur_tujuan_pembelajaran: "${atpData.alur_tujuan_pembelajaran || atpData.tujuan_pembelajaran}"

Catatan Tambahan Guru (opsional):
- Alokasi Waktu/Pertemuan: ${options?.duration || '1 x 3 jam pelajaran (atau disesuaikan)'}
- Preferensi Strategi Pedagogis: ${options?.pedagogicalStrategy || 'Storytelling Reflektif / Inkuiri Terbimbing'}
- Pemanfaatan Digital: ${options?.digitalTool || 'Canva Edukasi, Google Slides, Padlet'}
${options?.partnerNotes ? `- Catatan Kemitraan: ${options.partnerNotes}` : ''}

INSTRUKSI KHUSUS & WAJIB:
1. PADA BAGIAN "#### Capaian Pembelajaran (CP)": Salin dan tuliskan teks Capaian Pembelajaran secara utuh dan persis sebagaimana dari Supabase: "${atpData.capaian_pembelajaran}". JANGAN DIUBAH ATAU DIPARAFRASE.
2. PADA BAGIAN "#### Tujuan Pembelajaran (TP)": Salin teks: "${atpData.tujuan_pembelajaran}".
3. KESINKRONAN MUTLAK ANTARA RPP (BAGIAN 1) DAN BAHAN AJAR (BAGIAN 2):
   Seluruh isi BAGIAN 2 (Paket Materi & Bahan Ajar Lengkap) — meliputi:
   - 1. Materi Utama & Kajian Mendalam
   - 2. Lembar Skenario Cerita Pemantik
   - 3. Lembar Kerja Peserta Didik (LKPD) Aplikatif
   - 4. Kartu Inkuiri & Refleksi Batin Pribadi
   - 5. Panduan Kemitraan Orang Tua & Pembiasaan di Rumah
   WAJIB 100% SINKRON DAN SPESIFIK MEMBAHAS TOPIK TP: "${atpData.tujuan_pembelajaran}" (Elemen: ${atpData.elemen}).
   DILARANG KERAS menggunakan cerita, studi kasus, atau materi yang melenceng atau generik.
   Judul cerita pada Bagian 2 harus sama persis dengan judul cerita yang disebutkan pada langkah kegiatan inti Bagian 1.
4. Susun BAGIAN 1 dan BAGIAN 2 dengan struktur format markdown yang persis seperti yang ditentukan.`;

    let generatedMarkdown = '';
    let generationSource = 'gemini';

    const safeOptions: GenerationOptions = options || {
      duration: '1 x 3 jam pelajaran (105 Menit)',
      pedagogicalStrategy: 'Storytelling Reflektif & Diskusi Kasus',
      digitalTool: 'Canva Edukasi, Google Slides, Padlet',
    };

    if (process.env.GEMINI_API_KEY) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: promptMessage,
          config: {
            systemInstruction: buildSystemInstruction(atpData),
            temperature: 0.7,
          },
        });
        generatedMarkdown = response.text || '';
      } catch (geminiError) {
        console.warn('Gemini API call failed, using high-quality pedagogical fallback engine:', geminiError);
        generatedMarkdown = generateDeterministicRpp(atpData, safeOptions);
        generationSource = 'engine_fallback';
      }
    } else {
      console.log('No GEMINI_API_KEY provided in environment, using high-quality pedagogical engine.');
      generatedMarkdown = generateDeterministicRpp(atpData, safeOptions);
      generationSource = 'engine_fallback';
    }

    if (!generatedMarkdown.trim()) {
      generatedMarkdown = generateDeterministicRpp(atpData, safeOptions);
      generationSource = 'engine_fallback';
    }

    return res.json({
      success: true,
      source: generationSource,
      markdown: generatedMarkdown,
      atpData,
    });
  } catch (error: any) {
    console.error('Error generating EduCraft RPP:', error);
    return res.status(500).json({
      error: 'Terjadi kegagalan saat menyusun RPP: ' + (error?.message || 'Unknown error'),
    });
  }
});

// Endpoint: Test or fetch from live Supabase instance with smart URL normalization & CP table discovery
app.post('/api/supabase/fetch-atp', async (req: Request, res: Response) => {
  try {
    const {
      supabaseUrl,
      supabaseAnonKey,
      tableName = 'master_atp_pai',
      cpTableName = 'master_cp_pai',
      limit = 1000,
    } = req.body;

    if (!supabaseUrl || !supabaseAnonKey) {
      return res.status(400).json({ error: 'Supabase URL dan Anon Key wajib diisi.' });
    }

    let rawUrl = (supabaseUrl || '').trim();
    let targetTable = (tableName || 'master_atp_pai').trim();
    let targetCpTable = (cpTableName || 'master_cp_pai').trim();

    // 1. Auto-detect if user pasted Supabase Dashboard URL instead of API URL
    const dashboardMatch = rawUrl.match(/supabase\.com\/dashboard\/project\/([a-zA-Z0-9_-]+)/i);
    if (dashboardMatch && dashboardMatch[1]) {
      const projectRef = dashboardMatch[1];
      rawUrl = `https://${projectRef}.supabase.co`;
    }

    // 2. Strip /rest/v1 or trailing path from the base URL if user included it
    rawUrl = rawUrl.replace(/\/rest\/v1.*$/i, '');
    rawUrl = rawUrl.replace(/\/+$/, '');

    // Ensure it starts with https://
    if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
      rawUrl = 'https://' + rawUrl;
    }

    // 3. Clean table names
    targetTable = targetTable.replace(/^public\./i, '').replace(/^\/+|\/+$/g, '');
    if (!targetTable) targetTable = 'master_atp_pai';

    targetCpTable = targetCpTable.replace(/^public\./i, '').replace(/^\/+|\/+$/g, '');

    const authHeaders = {
      apikey: supabaseAnonKey.trim(),
      Authorization: `Bearer ${supabaseAnonKey.trim()}`,
      'Content-Type': 'application/json',
    };

    // 4. Discover all public tables from Supabase OpenAPI spec
    let discoveredTables: string[] = [];
    try {
      const metaRes = await fetch(`${rawUrl}/rest/v1/`, {
        method: 'GET',
        headers: authHeaders,
      });
      if (metaRes.ok) {
        const spec: any = await metaRes.json();
        if (spec && spec.definitions) {
          discoveredTables = Object.keys(spec.definitions);
        } else if (spec && spec.paths) {
          discoveredTables = Object.keys(spec.paths)
            .map((p: string) => p.replace(/^\//, ''))
            .filter((p: string) => p && !p.includes('/'));
        }
      }
    } catch (e) {
      console.log('OpenAPI discovery skipped:', e);
    }

    // 5. Query primary ATP table
    const endpoint = `${rawUrl}/rest/v1/${targetTable}?select=*&limit=${limit}`;
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: authHeaders,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let parsedError: any = null;
      try {
        parsedError = JSON.parse(errorText);
      } catch {
        parsedError = null;
      }

      if (response.status === 404 && parsedError?.code === 'PGRST125') {
        return res.status(404).json({
          error: `PGRST125: Jalur request URL tidak valid di Supabase.
1. Pastikan Supabase URL berformat: https://[id-project].supabase.co (tanpa /rest/v1 di belakangnya). URL yang dicoba: ${rawUrl}
2. Pastikan tabel '${targetTable}' benar-benar ada di database Supabase Anda (skema 'public').
3. Tips Cepat: Anda juga bisa membuka Supabase > Table Editor > master_atp_pai, klik Export / Copy JSON, lalu tempel di tab 'Tempel JSON Supabase'.`,
          endpointUsed: endpoint,
        });
      }

      return res.status(response.status).json({
        error: `Supabase status ${response.status}: ${parsedError?.message || errorText}`,
        details: parsedError,
        endpointUsed: endpoint,
      });
    }

    const data = await response.json();

    // 6. Attempt to fetch Capaian Pembelajaran (CP) table if exists
    // Priority: targetCpTable -> discovered table matching cp/capaian
    let cpData: any[] = [];
    let cpTableUsed: string = '';

    const potentialCpTables = [
      targetCpTable,
      ...discoveredTables.filter(
        (t) =>
          t.toLowerCase().includes('cp') ||
          t.toLowerCase().includes('capaian') ||
          t.toLowerCase().includes('kompetensi')
      ),
      'master_cp_pai',
      'cp_pai',
      'capaian_pembelajaran',
      'master_cp',
      'cp',
    ];

    // Remove duplicates and exclude current targetTable
    const uniqueCpTables = Array.from(new Set(potentialCpTables)).filter(
      (t) => t && t.toLowerCase() !== targetTable.toLowerCase()
    );

    for (const candidateTable of uniqueCpTables) {
      try {
        const cpEndpoint = `${rawUrl}/rest/v1/${candidateTable}?select=*&limit=500`;
        const cpRes = await fetch(cpEndpoint, {
          method: 'GET',
          headers: authHeaders,
        });
        if (cpRes.ok) {
          const fetchedCp = await cpRes.json();
          if (Array.isArray(fetchedCp) && fetchedCp.length > 0) {
            cpData = fetchedCp;
            cpTableUsed = candidateTable;
            console.log(`Found CP table in Supabase: ${candidateTable} (${fetchedCp.length} rows)`);
            break;
          }
        }
      } catch (cpErr) {
        // continue search
      }
    }

    const detectedColumns = Array.isArray(data) && data.length > 0 ? Object.keys(data[0]) : [];

    return res.json({
      success: true,
      count: data.length,
      data,
      cpData,
      cpTableUsed,
      discoveredTables,
      detectedColumns,
    });
  } catch (error: any) {
    console.error('Error fetching Supabase data:', error);
    return res.status(500).json({ error: error?.message || 'Gagal menghubungi Supabase.' });
  }
});

// Dev vs Prod Vite Mounting
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  // Explicitly bind to 0.0.0.0 for external ingress compatibility in containers
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EduCraft AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
