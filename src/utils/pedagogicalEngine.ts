import { MasterAtpRecord, GenerationOptions } from '../types';

export function generateDeterministicRpp(
  atp: MasterAtpRecord,
  options: GenerationOptions
): string {
  const materiTitle = atp.tujuan_pembelajaran.includes(':')
    ? atp.tujuan_pembelajaran.split(':')[0].replace(/^(Membaca|Memahami|Mengenal|Menjelaskan|Mempraktikkan)\s+/i, '')
    : atp.elemen + ' - ' + atp.tujuan_pembelajaran.slice(0, 45);

  const duration = options.duration || '1 x 3 jam pelajaran (105 Menit)';
  const strategy = options.pedagogicalStrategy || 'Storytelling Reflektif & Diskusi Kasus';
  const digitalTool = options.digitalTool || 'Canva Edukasi, Google Slides, Padlet';

  return `### PERENCANAAN PEMBELAJARAN
**[Mata Pelajaran: Pendidikan Agama Islam dan Budi Pekerti]**
**[${atp.fase}] [${atp.target_kelas}]**

* **Satuan Pendidikan**: Sekolah Dasar (SD)
* **Kelas / Semester**: ${atp.target_kelas} / Semester 1 & 2
* **Elemen Pembelajaran**: ${atp.elemen}
* **Materi Pokok**: ${materiTitle}
* **Alokasi Waktu**: ${duration}

#### Dimensi Profil Lulusan / Profil Pelajar Pancasila
* **Keimanan dan Ketakwaan terhadap Tuhan YME & Berakhlak Mulia**:
  - Peserta didik membiasakan diri mengawali dan mengakhiri kegiatan belajar dengan berdoa secara khusyuk.
  - Menumbuhkan rasa kagum dan syukur atas petunjuk Allah Swt. melalui ajaran ${materiTitle}.
  - Meneladani sifat-sifat mulia Rasulullah saw. dalam berinteraksi dengan sesama teman tanpa membedakan latar belakang.
* **Penalaran Kritis**:
  - Peserta didik mengidentifikasi pesan-pesan pokok dan hikmah yang terkandung dalam ${materiTitle}.
  - Menganalisis persoalan nyata di lingkungan sekolah/rumah dan menemukan solusi bijak berbasis nilai-nilai Islam.
  - Mampu membedakan perbuatan terpuji (*akhlak mahmudah*) dan tercela (*akhlak madzmumah*) dengan argumen yang santun.
* **Kreativitas**:
  - Mengekspresikan pemahaman materi melalui pembuatan media visual kreatif (infografis, mind map, atau poster pesan islami).
  - Merancang skenario simulasi / bermain peran (*role play*) adab pergaulan sehari-hari yang bernilai ibadah.
* **Kolaborasi / Gotong Royong**:
  - Bekerja sama secara aktif dan inklusif dalam kelompok kecil untuk menyelesaikan tugas pembelajaran.
  - Saling berbagi peran, mendengarkan pandangan teman dengan takzim, serta saling menguatkan dalam kebaikan (*ta'awun*).

#### Dimensi Panca Cinta
* **Cinta kepada Allah dan Rasul-Nya**:
  - Menjadikan firman Allah Swt. dan sunnah Rasulullah saw. sebagai pedoman utama berperilaku dan berniat ikhlas dalam setiap tindakan.
* **Cinta Ilmu**:
  - Menumbuhkan gairah membaca (*iqra'*), rasa penasaran ilmiah, dan ketekunan dalam mendalami ajaran Islam sebagai bekal masa depan.
* **Cinta Diri dan Sesama Manusia**:
  - Menghargai martabat diri sendiri sebagai hamba Allah dan memperlakukan orang lain dengan kasih sayang, kesetaraan, serta toleransi (*tasamuh*).
* **Cinta Tanah Air dan Lingkungan**:
  - Merawat kerukunan hidup dalam bingkai kebinekaan bangsa Indonesia dan menjaga kelestarian alam ciptaan Allah Swt.

---
*Pusat Kurikulum dan Pembelajaran*

#### Capaian Pembelajaran (CP)
${atp.capaian_pembelajaran}

#### Tujuan Pembelajaran (TP)
${atp.tujuan_pembelajaran}

#### Alur Tujuan Pembelajaran (ATP)
${atp.alur_tujuan_pembelajaran} (No. ATP: ${atp.no_atp})

#### Praktik Pedagogis
* **Strategi Utama**: ${strategy}
* **Peran Guru**: Fasilitator inspiratif yang menuntun (*scaffolding*), menyajikan narasi bermakna, dan memantik pemikiran mendalam murid.
* **Diferensiasi Pembelajaran**: 
  - *Diferensiasi Konten*: Menyediakan teks bacaan berjenjang, rekaman audio lafal ayat/kisah, dan kartu bergambar.
  - *Diferensiasi Proses*: Pendampingan intensif bagi murid yang memerlukan bimbingan khusus dan tantangan inkuiri mandiri bagi murid cepat tanggap.
  - *Diferensiasi Produk*: Murid bebas memilih bentuk pelaporan tugas (poster visual, rekaman hafalan bercerita, atau simulasi bermain peran).

#### Kemitraan Pembelajaran
* Melibatkan orang tua/wali melalui lembar dialog keluarga (*Family Dialogue Sheet*) dan pembiasaan ibadah harian di rumah.

#### Lingkungan Pembelajaran
* **Ruang Fisik**: Pengaturan meja belajar formasi tapal kuda / kelompok melingkar (*round table*) guna mendorong partisipasi aktif dan interaksi hangat.
* **Ruang Virtual**: Memanfaatkan proyektor/layar digital untuk menayangkan visual materi, kuis interaktif, dan lembar kerja daring.
* **Budaya Belajar**: Membudayakan 5S (Senyum, Salam, Sapa, Sopan, Santun), mendengarkan saat teman berbicara, dan tidak takut salah dalam mengemukakan pendapat.

#### Pemanfaatan Digital
* Media presentasi interaktif Canva / PowerPoint Edukasi untuk visualisasi dalil dan kisah.
* Platform kolaborasi kreatif: ${digitalTool}.

---
*Perencanaan Pembelajaran Mendalam*

#### Langkah-langkah Pembelajaran

##### A. Kegiatan Pendahuluan (15 Menit)
* **Pengondisian Spiritual & Keberkahan Belajar**:
  - Guru mengucapkan salam islami yang hangat dan menatap seluruh murid dengan senyuman penuh perhatian (*caring presence*).
  - Salah seorang murid (bergiliran/ketua kelas) memimpin doa sebelum belajar dengan khusyuk: *"Rabbi zidnii 'ilmaa warzuqnii fahmaa"*.
  - Melafalkan ayat suci Al-Qur'an atau Asmaul Husna secara bersama-sama untuk menyucikan niat dan mengondisikan ketenangan batin kelas.
* **Presensi Empatis & Penataan Kelas**:
  - Guru mengecek kehadiran murid sambil melakukan *emotional check-in*: menanyakan kabar dan perasaan murid hari ini dengan stiker ekspresi wajah.
  - Memastikan kerapian seragam muslim/muslimah, kebersihan lantai di sekitar bangku, serta kesiapan buku dan alat tulis.
* **Apersepsi Berdiferensiasi & Pertanyaan Pemantik**:
  - Guru mengaitkan pembelajaran pekan lalu dengan pengalaman nyata murid di rumah: *"Siapa yang kemarin melihat atau mengalami peristiwa yang membuat kalian bersyukur?"*
  - Guru menyampaikan Tujuan Pembelajaran (TP) hari ini dengan bahasa ramah anak: *"Hari ini kita akan menjelajah dan memahami ${materiTitle} agar kita menjadi anak yang dicintai Allah dan teman-teman."*
  - Melakukan *ice-breaking* tepuk ceria islami (misal: Tepuk Anak Saleh / Tepuk Cinta Rasul) untuk membangkitkan fokus dan kegembiraan belajar.

##### B. Kegiatan Inti (75 Menit)

###### Tahap 1: Memahami (Eksplorasi Awal & Mindful) — 20 Menit
* **Aktivitas Mindful Moment (Latihan Kesadaran Penuh & Hening Sejenak)**:
  - Guru mengajak murid duduk tegak dengan rileks, meletakkan tangan di atas paha, dan memejamkan mata secara perlahan.
  - Menerapkan teknik hening **STOP**:
    - **S (Stop)**: Hentikan semua gerakan dan percakapan.
    - **T (Take a breath)**: Tarik napas dalam perlahan melalui hidung sambil mengingat keagungan Allah, lalu hembuskan dengan rasa syukur.
    - **O (Observe)**: Sadari detak jantung, nikmat panca indra, dan rasa damai di dalam hati.
    - **P (Proceed)**: Buka mata perlahan dengan pikiran yang segar dan siap menerima mutiara ilmu.
* **Penyampaian Narasi & Media Pemantik Bermakna**:
  - Guru menayangkan video animasi atau menceritakan kisah inspiratif yang dirancang khusus pada **Bagian 2: Bahan Ajar** tentang ${materiTitle}.
  - Guru melafalkan ayat/dalil pokok dengan makhraj dan kaidah tajwid yang fasih, murid menyimak dengan takzim (*istima'*), lalu menirukan pelafalan secara tartil.
  - Guru menunjukkan infografis atau gambar visual pemantik yang menggambarkan situasi nyata di masyarakat terkait materi.
* **Inkuiri Kritis & Dialog Pemantik**:
  - Guru mengajukan pertanyaan pemantik tingkat tinggi (HOTS):
    - *"Mengapa Allah Swt. menurunkan ajaran tentang ${materiTitle} kepada kita?"*
    - *"Apa yang akan terjadi di sekolah kita jika semua orang tidak peduli pada nilai kebaikan ini?"*
  - Murid diberikan kesempatan berpikir mandiri (*think*), berpasangan mendiskusikan jawaban (*pair*), lalu menyampaikan gagasan di kelas (*share*).

###### Tahap 2: Mengaplikasikan (Kolaborasi Kelompok & Joyful) — 35 Menit
* **Pembentukan Kelompok Kolaboratif Berdiferensiasi**:
  - Guru membagi murid ke dalam kelompok heterogen (4-5 murid per kelompok) dengan nama-nama sahabat nabi atau sifat mulia.
  - Setiap anggota kelompok memilih peran tanggung jawab: Ketua Tim, Pencatat Ide, Desainer Kreatif, dan Juru Bicara (*Speaker*).
* **Opsi Diferensiasi Produk Belajar Sesuai Minat**:
  - **Kelompok Visual**: Merancang poster ajakan / infografis warna-warni tentang pengamalan ${materiTitle} menggunakan kertas karton atau Canva Edukasi.
  - **Kelompok Verbal & Kinestetik**: Menyusun skenario singkat dan berlatih bermain peran (*role-play*) memperagakan situasi nyata penerapan materi dalam pergaulan sekolah.
  - **Kelompok Literasi & Cerita**: Menyusun rangkuman komik mini atau buklet cerita bergambar mengenai hikmah mengamalkan ${materiTitle}.
* **Pengerjaan Lembar Kerja Peserta Didik (LKPD)**:
  - Guru membagikan LKPD Terstruktur yang merujuk langsung pada materi di Bahan Ajar.
  - Murid berdiskusi aktif, saling bertukar pikiran, dan memecahkan studi kasus nyata yang tertuang dalam LKPD.
* **Fasilitasi Guru & Scaffolding**:
  - Guru berkeliling mengunjungi setiap kelompok, mengamati dinamika kerja sama, memberikan bimbingan bagi kelompok yang mengalami kesulitan, dan memberikan pujian tulus atas usaha murid.
  - Menyelipkan *energizer* singkat bernuansa riang untuk menjaga suasana tetap ceria, antusias, dan bebas dari kebosanan (*joyful learning*).

###### Tahap 3: Merefleksikan (Presentasi, Peer Feedback, & Meaningful) — 20 Menit
* **Pameran Karya & Uji Publik (Gallery Walk & Showcase)**:
  - Setiap kelompok menata hasil karyanya di meja atau dinding kelas.
  - Dua anggota kelompok bertugas sebagai pemandu stan yang menjelaskan karya, sementara anggota lainnya berkunjung ke stan kelompok lain (*Gallery Walk*).
  - Pengunjung memberikan bintang apresiasi dan menuliskan catatan umpan balik positif (*peer feedback*) pada secarik kertas kecil (*sticky notes*) dengan kata-kata santun.
  - Kelompok bermain peran menampilkan simulasi di depan kelas dengan durasi 3-4 menit disambut tepuk tangan meriah.
* **Konfirmasi & Penguatan Konsep oleh Guru**:
  - Guru memberikan apresiasi menyeluruh atas dedikasi dan kreativitas setiap kelompok.
  - Meluruskan miskonsepsi (jika ada), mempertegas hukum/kaidah syariat, dan menyimpulkan poin-poin utama materi secara runtut.
* **Refleksi Batin Mendalam (Meaningful Connection)**:
  - Guru memandu momen hening refleksi diri dengan pertanyaan yang menggugah nurani:
    - *"Setelah mempelajari materi ini, perubahan baik apa yang ingin kamu lakukan mulai hari ini?"*
    - *"Bagaimana ilmu ini membuatmu menjadi hamba Allah yang lebih taat dan teman yang lebih baik?"*
  - Setiap murid menuliskan 1 komitmen kebaikan pribadi pada kartu komitmen dan menempelkannya di **Pohon Kebaikan Kelas**.

##### C. Kegiatan Penutup (15 Menit)
* **Penyimpulan Bersama**:
  - Guru bersama murid merangkum intisari pembelajaran dalam bentuk 3 poin emas (*three key takeaways*).
* **Asesmen Formatif Akhir**:
  - Guru memberikan kuis cepat (2-3 pertanyaan lisan / kartu refleksi) untuk mengukur ketercapaian tujuan pembelajaran hari ini.
* **Tindak Lanjut & Pembiasaan di Rumah**:
  - Guru membagikan Lembar Kemitraan Orang Tua untuk dibaca dan diamalkan bersama keluarga di rumah.
  - Menginformasikan topik pembelajaran yang akan dibahas pada pertemuan berikutnya agar murid bersemangat menyambutnya.
* **Doa Penutup & Berpamitan Santun**:
  - Membaca doa *Kafaratul Majelis* bersama-sama: *"Subhaanaka Allaahumma wabihamdika, asyhadu allaa ilaaha illaa Anta, astaghfiruka wa atuubu ilaik"*.
  - Menutup dengan salam dan saling bersalaman dengan guru penuh takzim.

---
*Pusat Kurikulum dan Pembelajaran*

#### Asesmen Pembelajaran
* **Asesmen Formatif Awal (Diagnostik)**:
  - Pertanyaan lisan diagnostik dan kuis pemantik awal untuk memetakan kesiapan, minat, dan gaya belajar peserta didik terhadap ${materiTitle}.
* **Asesmen Formatif Proses (Formatif Berkala)**:
  - Lembar observasi keterlibatan diskusi kelompok (kolaborasi, kepemimpinan, dan keaktifan bertanya).
  - Penilaian antarteman (*peer assessment*) saat kegiatan pameran karya (*Gallery Walk*).
* **Asesmen Sumatif Lingkup Materi (Produk & Unjuk Kerja)**:
  - Penilaian produk kelompok (poster / infografis / naskah bermain peran) berdasarkan rubrik holistik kurikulum nasional.
  - Penilaian lembar refleksi diri dan komitmen akhlak individu.

#### Tindak Lanjut Pembelajaran
* **Pengayaan**:
  - Bagi murid yang telah melampaui capaian pembelajaran, diberikan tugas inkuiri lanjutan: meneliti kisah sahabat nabi atau ayat lain yang berkaitan dan membuat artikel pendek/vlog edukasi.
* **Remedial**:
  - Bagi murid yang belum mencapai kriteria ketuntasan tujuan, diberikan bimbingan terfokus (*scaffolding*) perorangan atau tutor sebaya dengan media visual pendukung.

#### Rubrik Penilaian Holistik

##### 1. Rubrik Penilaian Produk Kolaboratif Kelompok
| Aspek Penilaian | Sangat Berkembang (Skor 4) | Cakap (Skor 3) | Berkembang (Skor 2) | Baru Memulai (Skor 1) |
| :--- | :--- | :--- | :--- | :--- |
| **Ketepatan Isi & Dalil** | Memuat seluruh konsep utama secara lengkap, runtut, mendalam, dan relevan dengan dalil/syariat. | Memuat sebagian besar konsep utama dengan tepat dan benar. | Konsep materi cukup, namun masih terdapat 1-2 bagian yang kurang tepat. | Konsep materi belum jelas dan banyak terdapat kekeliruan konsep. |
| **Kreativitas & Estetika** | Desain visual sangat menarik, orisinal, tata letak rapi, penggunaan warna harmonis dan memikat. | Desain menarik, pesan terbaca jelas, dan tata letak rapi. | Desain cukup sederhana, kerapian masih perlu ditingkatkan. | Desain kurang rapi, pesan sulit terbaca atau tidak terorganisir. |
| **Dinamika Kolaborasi** | Semua anggota aktif berkontribusi, saling membantu, menghargai peran, dan kerja tim solid. | Sebagian besar anggota aktif berkontribusi dengan pembagian tugas yang baik. | Hanya separuh anggota yang aktif bekerja, koordinasi kurang lancar. | Dikerjakan secara sepihak oleh 1–2 orang saja, tidak terlihat kerja sama. |
| **Keterampilan Presentasi** | Penyampaian sangat percaya diri, artikulasi jelas, bahasa santun, dan mampu menjawab pertanyaan dengan tepat. | Penyampaian jelas, cukup percaya diri, dan komunikatif. | Penyampaian ragu-ragu, artikulasi kurang jelas, atau membaca catatan terus. | Tidak percaya diri, suara tidak terdengar, dan pasif saat ditanya. |

##### 2. Rubrik Penilaian Refleksi Batin Individu
| Aspek Penilaian | Sangat Berkembang (Skor 4) | Cakap (Skor 3) | Berkembang (Skor 2) | Baru Memulai (Skor 1) |
| :--- | :--- | :--- | :--- | :--- |
| **Kedalaman Pemahaman** | Menguraikan hikmah materi dengan sangat mendalam dan mengaitkannya dengan pengalaman nyata. | Menyebutkan hikmah materi dengan tepat dan memberikan contoh keseharian. | Menuliskan intisari materi secara umum tanpa kaitan kehidupan nyata. | Belum mampu mengidentifikasi hikmah utama materi pembelajaran. |
| **Komitmen Aksi Nyata** | Menuliskan rencana tindakan konkret yang terukur, realistis, dan berorientasi pembiasaan akhlak mulia. | Menuliskan rencana tindakan nyata yang baik namun masih bersifat umum. | Menuliskan tekad kebaikan secara singkat tanpa langkah konkret. | Tidak menuliskan komitmen atau hanya menyalin tulisan teman. |

---

## BAGIAN 2: PAKET MATERI & BAHAN AJAR LENGKAP

### 1. Materi Utama & Bahan Ajar Mendalam (Struktur 5 Bagian Eksploratif)
**Mendalami dan Menghayati: ${materiTitle}**

#### 1. Kondisi Sosial & Latar Belakang Kultural (Context & Setting)
- **Kondisi Zaman & Realitas Sosial**: Sebelum hadirnya tuntunan syariat dan teladan akhlak mulia ini, masyarakat berada dalam cengkeraman fanatisme golongan (*ashabiyah*), relasi kuasa yang menindas kaum rentan, serta ketiadaan tatanan hukum yang adil. Nilai kemanusiaan kerap diukur dari nasab suku, kekayaan bendawi, atau kekuatan fisik semata.
- **Titik Balik (Turning Point)**: Kehadiran ajaran ${materiTitle} menjadi momentum peradaban yang memutus mata rantai kezaliman tersebut. Wahyu Allah Swt. dan teladan kenabian merombak tatanan sosial dengan menegaskan bahwa seluruh manusia berkedudukan setara di hadapan Sang Pencipta, di mana derajat kemuliaan hanya ditentukan oleh ketakwaan batin dan kemanfaatan nyata bagi sesama ciptaan (*khairunnas anfa'uhum linnas*).

#### 2. Rekam Jejak Sejarah & Fase Kehidupan (Historical Journey)
- **Fase Awal & Pembentukan Karakter**: Sejak usia dini, para nabi dan generasi pembaharu ditempa dengan integritas mutlak, ketekunan menggembala (melatih kepemimpinan sabar dan kepekaan sosial), serta menjaga kesucian diri dari polusi moral lingkungannya.
- **Fase Ikrar Kebajikan & Diplomasi Damai**: Terlibat aktif dalam peristiwa bersejarah pembelaan hak-hak kaum lemah (seperti ikrar kebajikan *Hilf al-Fudul* di Makkah) dan peristiwa peletakan batu Hajar Aswad yang membuktikan kecerdasan resolusi konflik yang adil tanpa menumpahkan darah.
- **Fase Perjuangan & Pelembagaan Tatanan Madani**: Menghadapi pemboikotan, diskriminasi, dan fitnah dengan keagungan akhlak serta diplomasi bermartabat hingga terwujudnya Piagam Madinah (*Mitsaq al-Madinah*) sebagai piagam kesetaraan hak warga majemuk pertama di dunia.

#### 3. Analisis Mendalam Sifat/Nilai Utama (Deep Conceptual Analysis)
- **A. Nilai As-Siddiq & Al-Amanah (Integritas Hakiki & Akuntabilitas)**:
  1. *Pendalaman Makna*: Bukan sekadar benar dalam ucapan lisan, melainkan keselarasan mutlak antara getaran nurani, ucapan kata, dan gerak perbuatan nyata tanpa kepura-puraan (*riya'*).
  2. *Kisah/Bukti Otentik*: Gelar *Al-Amin* (Yang Terpercaya) yang dianugerahkan oleh kawan maupun lawan bahkan jauh sebelum masa kerasulan, di mana penduduk menitipkan harta berharga karena keyakinan tak tergoyahkan atas kejujurannya.
  3. *Pelajaran Filosofis*: Integritas adalah modal sosial tertinggi (*highest social capital*). Tanpa kejujuran dan amanah, sistem sosial, transaksi ekonomi, dan hubungan antarmanusia akan runtuh ke jurang kecurigaan dan kehancuran.
- **B. Nilai Tablig & Al-Fatanah (Komunikasi Hikmah & Kecerdasan Beradab)**:
  1. *Pendalaman Makna*: Kemampuan menyampaikan kebenaran secara santun (*qaulan layyina*), argumentatif (*qaulan baligha*), dan solutif (*fatanah*), bukan dengan pemaksaan apalagi kekerasan fisik.
  2. *Kisah/Bukti Otentik*: Kebijaksanaan saat peristiwa pembebasan kota Makkah (*Fathu Makkah*), memberikan jaminan keselamatan dan memaafkan seluruh pihak yang dulu memusuhi tanpa dendam politik sedikit pun.
  3. *Pelajaran Filosofis*: Kecerdasan sejati (*al-aql*) adalah kecerdasan yang dibimbing wahyu untuk menghidupkan kemaslahatan publik dan merawat kedamaian semesta (*rahmatan lil 'alamin*).

#### 4. Manifestasi Multidimensi (Multi-dimensional Impact)
- **Dimensi Keluarga**:
  - Mewujudkan keluarga sebagai madrasah pertama yang dipenuhi kasih sayang (*mawaddah wa rahmah*), mendengarkan pandangan anak dengan takzim, serta mencontohkan pembagian tugas rumah tangga secara adil dan rendah hati.
- **Dimensi Sosial & Keanekaragaman**:
  - Membangun persaudaraan kemanusiaan (*ukhuwah insaniyah*) dan persaudaraan sebangsa (*ukhuwah wathaniyah*). Menghormati hak tetangga yang berbeda keyakinan, menjamin keadilan hukum tanpa pandang bulu, serta melindungi kaum dhuafa.
- **Dimensi Lingkungan & Ekologi**:
  - Menjaga kelestarian alam sebagai wujud penghambaan kepada Allah Swt. Melarang pemborosan air saat berwudu meskipun di sungai yang mengalir, menanam pohon sebagai sedekah jariyah abadi, dan memperlakukan satwa dengan belas kasih.

#### 5. Relevansi Masa Kini & Isu Kontemporer (Modern Relevance)
- **Menjawab Krisis Kejujuran Digital & Fenomena Hoax**:
  - Di era disrupsi informasi dan media sosial, nilai kejujuran (*siddiq*) dan tabayun menjadi perisai vital dari racun berita bohong, ujaran kebencian, dan fitnah digital.
- **Resolusi Polarisasi & Menjaga Kerukunan Bangsa**:
  - Semangat persaudaraan dan dialog santun membimbing generasi muda Indonesia untuk merawat kerukunan Bhinneka Tunggal Ika serta menolak ekstremisme.
- **Simpulan Menggerakkan**:
  - Mengamalkan ajaran ${materiTitle} bukan sekadar menghafal fakta sejarah masa silam, melainkan menghidupkan kembali ruh peradaban agung dalam setiap tarikan napas, tutur kata, dan karya nyata kita hari ini.

---

### 2. Lembar Skenario Cerita / Media Pemantik Pembelajaran
*(Naskah Narasi Lengkap Guru saat Langkah Eksplorasi Awal & Mindful)*

**Judul Cerita: "Pelangi Indah di Kelas Ahmad"**
Di sebuah desa yang asri, terdapat sebuah sekolah dasar tempat Ahmad dan kawan-kawannya belajar. Di kelas Ahmad, anak-anak berasal dari berbagai latar belakang: ada Wayan yang ramah dari Bali, Siti yang bersuara merdu dari Sunda, Ucok yang pemberani dari Batak, dan Ahmad yang suka menolong.

Suatu hari, saat jam istirahat, bekal makanan Wayan terjatuh dan berserakan di lantai. Wayan tampak sedih dan menunduk malu. Melihat hal itu, Ahmad tidak menertawakannya. Ahmad segera menghampiri Wayan, membantunya merapikan kotak bekal yang jatuh, lalu berkata dengan tersenyum tulus: *"Wayan, jangan sedih ya. Ini aku bawa roti panggang dan kurma yang cukup banyak, kita makan bersama-sama yuk!"*

Melihat kebaikan Ahmad, Siti dan Ucok pun mendekat dan ikut berbagi buah jeruk dan air minum mereka. Suasana yang tadinya murung berubah menjadi penuh tawa dan kehangatan. 

Ibu Guru Fatimah yang memperhatikan dari kejauhan tersenyum haru lalu berkata kepada anak-anak: *"Anak-anakku yang saleh dan salihah, apa yang kalian lakukan hari ini adalah wujud nyata dari ajaran Islam tentang saling mengasihi dan menghargai. Allah menciptakan kita berbeda-beda bukan untuk saling mengejek atau berselisih, melainkan agar kita saling melengkapi bagaikan warna-warni pelangi di langit yang indah."*

**Pesan Moral Cerita**:
- Kebaikan hati dan rasa peduli mampu meruntuhkan segala perbedaan.
- Orang yang paling mulia adalah orang yang paling lembut hatinya dan bermanfaat bagi sekitarnya.

### 3. Lembar Kerja Peserta Didik (LKPD) Aplikatif
**Mata Pelajaran**: Pendidikan Agama Islam dan Budi Pekerti  
**Materi / Fase**: ${materiTitle} / ${atp.fase} (${atp.target_kelas})  
**Nama Kelompok**: __________________________________________  
**Nama Anggota Kelompok**:  
1. _________________________________ (Ketua)  
2. _________________________________ (Pencatat)  
3. _________________________________ (Desainer)  
4. _________________________________ (Juru Bicara)  
5. _________________________________ (Anggota)  

#### A. Petunjuk Pengerjaan:
1. Bacalah basmalah sebelum memulai kegiatan kelompok.
2. Cermati teks materi dan kisah inspiratif "Pelangi Indah di Kelas Ahmad".
3. Diskusikan dan jawablah pertanyaan analisis studi kasus di bawah ini dengan kerja sama yang kompak.
4. Buatlah produk karya kreatif sesuai dengan pilihan kelompokmu (Poster / Role-Play / Buklet).

#### B. Studi Kasus Nyata:
*Kasus*: Di sekolahmu, ada murid baru pindahan dari daerah lain yang logat bicaranya berbeda dan terlihat pendiam karena belum memiliki teman bermain. Sebagian anak menjauhinya karena menganggapnya aneh.  
*Tugas Diskusi*:
1. Jika kalian berada di posisi Ahmad, sikap islami apa yang akan kelompok kalian lakukan pertama kali untuk menyambut teman baru tersebut?
2. Sebutkan 2 dalil atau alasan mengapa ajaran Islam melarang kita mencela atau menjauhi orang yang berbeda dengan kita!
3. Susunlah rencana kegiatan bermain bersama agar teman baru tersebut merasa diterima dan bahagia di sekolah kita!

#### C. Lembar Desain Karya Kreatif Kelompok:
*(Gambarkan sketsa karya poster kelompokmu atau tuliskan dialog naskah singkat simulasi di kotak berikut)*
\`\`\`
+--------------------------------------------------------------------------+
|                                                                          |
|                     [ RUANG KARYA KREATIF KELOMPOK ]                     |
|                                                                          |
|                                                                          |
|                                                                          |
|                                                                          |
+--------------------------------------------------------------------------+
\`\`\`

### 4. Kartu Inkuiri & Refleksi Batin Pribadi
Gunting dan simpanlah kartu ini sebagai pengingat komitmen akhlakmu:

* **Kartu Inkuiri 1 (Koneksi Spiritual)**:
  *"Kapan terakhir kali kamu menolong orang lain dengan diam-diam tanpa mengharapkan ucapan terima kasih atau pujian manusia?"*
* **Kartu Inkuiri 2 (Kecerdasan Empati)**:
  *"Bagaimana perasaanmu jika kamu berada di posisi orang yang dihargai dan dirangkul saat sedang kesulitan?"*
* **Kartu Inkuiri 3 (Tantangan Kebaikan Hari Ini)**:
  *"Tuliskan satu nama temanmu yang ingin kamu sapa dengan senyuman dan kata-kata manis hari ini!"*
* **Kartu Inkuiri 4 (Ikhtiar Istiqamah)**:
  *"Doa apa yang kamu panjatkan kepada Allah Swt. agar hatimu senantiasa dijauhkan dari sifat sombong dan iri dengki?"*

### 5. Panduan Kemitraan Orang Tua & Pembiasaan di Rumah
*Assalamu'alaikum Warahmatullahi Wabarakatuh*  
Yth. Bapak/Ibu Orang Tua / Wali Peserta Didik di Rumah,

Hari ini putra/putri tercinta kita di kelas ${atp.target_kelas} telah mempelajari materi mulia tentang: **"${materiTitle}"**.  
Ilmu yang diajarkan di sekolah hanya akan berakar kuat apabila dipupuk dan dicontohkan secara nyata dalam kehidupan keluarga di rumah. 

**Panduan Kegiatan Bersama di Rumah**:
1. **Dialog Hati ke Hati (5-10 Menit)**: Ajak ananda berbincang santai sesudah salat magrib/isya mengenai pengalaman berbuat kebaikan di sekolah hari ini.
2. **Teladan Sikap Santun**: Berikan contoh tutur kata yang lemah lembut, saling memaafkan di rumah, dan menghargai tetangga sekitar.
3. **Apresiasi Positif**: Berikan pelukan hangat dan pujian saat ananda menunjukkan sikap mandiri, jujur, atau peduli kepada saudaranya.

**Lembar Pemantauan Pembiasaan Rumah (Mohon Diparaf & Dikembalikan ke Guru)**:
* Nama Peserta Didik: __________________________________________________
* Hari / Tanggal: _____________________________________________________
* Checklist Pembiasaan:
  - [ ] Salat fardhu berjemaah tepat waktu
  - [ ] Berbicara santun kepada orang tua dan anggota keluarga
  - [ ] Membantu pekerjaan rumah tanpa mengeluh
  - [ ] Membaca Al-Qur'an / mengulang materi PAI
* Catatan Kasih Sayang Orang Tua:  
  ____________________________________________________________________  
* Tanda Tangan Orang Tua / Wali: ( ___________________________ )`;
}
