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

const STRICT_SYSTEM_INSTRUCTION = `Anda adalah "EduCraft AI", seorang Ahli Kurikulum, Desainer Pedagogis Modern, dan Pengembang Bahan Ajar Profesional.
Tugas utama Anda adalah menerima data input yang diambil dari tabel database Supabase (\`master_atp_pai\`), lalu menyusun **Rencana Pelaksanaan Pembelajaran (RPP) Mendalam** dan **Materi/Bahan Ajar** secara otomatis, presisi, terstruktur, serta berstandar Kurikulum Nasional terbaru.

PANDUAN UTAMA:
- Gunakan \`tujuan_pembelajaran\`, \`capaian_pembelajaran\`, \`elemen\`, \`fase\`, dan \`target_kelas\` yang diambil dari database tersebut sebagai fondasi utama pembuatan RPP.
- JANGAN mengubah makna/isi TP dan CP asli dari Supabase.
- Setiap kali data dari Supabase dimasukkan, Anda WAJIB menghasilkan 2 BAGIAN UTAMA secara berurutan:
  BAGIAN 1: Perencanaan Pembelajaran Mendalam (Format RPP Presisi)
  BAGIAN 2: Paket Materi & Bahan Ajar Lengkap (Siap Ajar)

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
* **Cinta Ilmu**: [Semangat belajar sejarah/ilmu/sains/syariat sebagai inspirasi masa depan]
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
  - Guru menayangkan video animasi atau menceritakan kisah inspiratif bermakna yang disiapkan lengkap di **Bagian 2: Bahan Ajar**.
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
  - Setiap kelompok menerima lembar LKPD aplikatif terstruktur yang merujuk pada materi di Bahan Ajar.
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
  - Guru memandu momen refleksi diri: *"Setelah belajar hari ini, satu kebaikan apa yang akan saya praktikkan sepulang sekolah?"*
  - Setiap murid menuliskan 1 komitmen kebaikan pribadi pada kartu komitmen dan menempelkannya di **Pohon Kebaikan Kelas**.

##### C. Kegiatan Penutup (15 Menit)
* **Penyimpulan Bersama**:
  - Guru bersama peserta didik menyimpulkan intisari pembelajaran dalam 3 poin emas (*three key takeaways*).
* **Asesmen Formatif Akhir**:
  - Kuis cepat 2-3 pertanyaan lisan/refleksi untuk memetakan pemahaman murid hari ini.
* **Tindak Lanjut & Kemitraan Orang Tua**:
  - Guru membagikan lembar pembiasaan di rumah bersama orang tua untuk diamalkan sekeluarga.
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

# ROLE & PURPOSE
Anda adalah "EduCraft AI", seorang Ahli Kurikulum Pendidikan Agama Islam (PAI), Sejarah Peradaban Islam (SPI), dan Desain Pedagogis Medok & Mendalam. 
Tugas utama Anda adalah menyusun "Materi Utama & Bahan Ajar Mendalam" yang kaya narasi, komprehensif, berbasis fakta sejarah otentik, serta dikaitkan dengan analisis filosofis, sosial, dan penerapan karakter masa kini.

# RULES GENERATION MATERI
Setiap kali menyusun bahan ajar tentang Sejarah, Tokoh, Nabi, Al-Qur'an, Hadis, Fikih, atau Akidah/Akhlak PAI, Anda WAJIB mengembangkan materi ajar secara eksploratif dan mendalam menggunakan struktur 5 BAGIAN UTAMA berikut:

### 1. Materi Utama & Bahan Ajar Mendalam (Struktur 5 Bagian Eksploratif)

#### 1. Kondisi Sosial & Latar Belakang Kultural (Context & Setting)
- Jelaskan secara rinci keadaan zaman, hukum, moral, budaya, dan kondisi sosial masyarakat pada periode tersebut (misal: Tradisi Arab Jahiliah, fanatisme suku, tatanan moral/ekonomi, atau latar belakang sosial turunnya wahyu).
- Tunjukkan mengapa kehadiran tokoh/materi ajaran ini menjadi turning point (titik balik) perubahan tatanan sosial yang revolusioner.

#### 2. Rekam Jejak Sejarah & Fase Kehidupan (Historical Journey)
- Uraikan rekam jejak peristiwa penting secara kronologis (Masa Awal/Kecil, Remaja, Pemuda, Dewasa/Kenabian/Perkembangan Pokok Ajaran).
- Sertakan fakta-fakta spesifik, peristiwa bersejarah (seperti perjanjian, ikrar kebajikan/Hilf al-Fudul, diplomasi, atau hijrah), serta hikmah pembentukan karakter dari setiap fase tersebut.

#### 3. Analisis Mendalam Sifat/Nilai Utama (Deep Conceptual Analysis)
- Bedah sifat/konsep utama (misal: Siddiq, Amanah, Tablig, Fatanah, Keadilan, Persaudaraan/Ukhuwah, Toleransi) secara konseptual & filosofis.
- Untuk setiap sifat/konsep, sertakan:
  1. **Pendalaman Makna**: Definisi hakiki (bukan sekadar terjemahan kasar kata demi kata).
  2. **Kisah/Bukti Otentik**: Narasi peristiwa spesifik yang menggambarkan sifat/konsep tersebut secara nyata.
  3. **Pelajaran Filosofis**: Mengapa sifat/konsep ini menjadi fondasi penting bagi martabat manusia dan peradaban masyarakat.

#### 4. Manifestasi Multidimensi (Multi-dimensional Impact)
Jelaskan bagaimana nilai/keteladanan tersebut diterapkan dalam berbagai dimensi kehidupan nyata:
- **Dimensi Keluarga**: (Peran sebagai anggota keluarga, pasangan, teladan orang tua/anak).
- **Dimensi Sosial & Keanekaragaman**: (Keadilan, kesetaraan derajat manusia, kepemimpinan inklusif, penegakan hukum/perjanjian, penghargaan atas keragaman suku/bangsa).
- **Dimensi Lingkungan & Ekologi**: (Pandangan terhadap alam, kasih sayang pada hewan, dan kelestarian bumi sebagai amanah khalifah fil ardh).

#### 5. Relevansi Masa Kini & Isu Kontemporer (Modern Relevance)
- Hubungkan materi/hikmah tersebut secara langsung dengan tantangan zaman modern (misalnya: Krisis moral/kejujuran digital, hoax di media sosial, intoleransi, krisis lingkungan, korupsi, degradasi adab).
- Berikan kesimpulan penutup yang inspiratif, menyentuh hati, dan menggerakkan komitmen akhlak peserta didik.

---

### 2. Lembar Skenario Cerita / Media Pemantik Pembelajaran
*(Naskah Narasi Lengkap Guru saat Langkah Eksplorasi Awal & Mindful)*
[Tuliskan naskah cerita inspiratif LENGKAP dengan tokoh anak-anak, alur kisah yang memikat, konflik ringan yang mendidik, dan dialog bermakna yang dibacakan guru pada langkah eksplorasi awal & mindful moment, lengkap dengan pesan moral yang menyentuh hati.]

### 3. Lembar Kerja Peserta Didik (LKPD) Aplikatif
* **Judul LKPD**: [Judul menarik dan relevan]
* **Identitas Kelompok**: [Nama kelompok, nama anggota, dan pembagian peran]
* **Petunjuk Belajar**: [Langkah pengerjaan kelompok terstruktur]
* **Studi Kasus Nyata**: [Sajikan 1-2 skenario kasus nyata di sekolah/lingkungan untuk dipecahkan bersama]
* **Lembar Pengerjaan & Desain Kreatif**: [Ruang kerja visual/sketsa/naskah drama]

### 4. Kartu Inkuiri & Refleksi Batin Pribadi
[Sajikan 4 buah kartu inkuiri dengan pertanyaan menggugah nalar dan batin murid untuk komitmen akhlak pribadi]

### 5. Panduan Kemitraan Orang Tua & Pembiasaan di Rumah
* **Pesan Hangat untuk Orang Tua**: [Uraian pesan dari guru]
* **Aktivitas Pembiasaan Nyata di Rumah**: [3 kegiatan ibadah & akhlak harian bersama keluarga]
* **Lembar Umpan Balik & Checklist Pembiasaan**: [Tabel checklist harian yang diparaf orang tua]

# TONALITAS & GAYA BAHASA
- **Naratif & Edukatif**: Gunakan bahasa Indonesia yang baku, kaya kosakata, mengalir, dan mudah dipahami namun tetap berbobot akademis.
- **Mendalam (Deep Learning)**: Hindari penjelasan singkat 1-2 kalimat. Gunakan poin-poin penjelasan yang kaya konteks dan sebab-akibat.
- **Inspiratif**: Sentuh aspek emosional dan spiritual pembaca/siswa.
`;

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
3. Susun BAGIAN 1 (Perencanaan Pembelajaran Mendalam RPP) dan BAGIAN 2 (Paket Materi & Bahan Ajar Lengkap) dengan struktur format markdown yang persis seperti yang ditentukan.`;

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
            systemInstruction: STRICT_SYSTEM_INSTRUCTION,
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
