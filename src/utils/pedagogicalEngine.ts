import { MasterAtpRecord, GenerationOptions } from '../types';

interface TopicKnowledge {
  cleanTitle: string;
  domain: 'quran_hadis' | 'akidah' | 'akhlak' | 'fikih' | 'sejarah';
  section1Title: string;
  section2Title: string;
  section3Title: string;
  section4Title: string;
  section5Title: string;
  dalilText: string;
  dalilMeaning: string;
  contextAndSetting: string;
  conceptAnalysis: {
    title: string;
    points: string[];
  }[];
  multiDimensionalImpact: {
    keluarga: string;
    sosial: string;
    lingkungan: string;
  };
  modernRelevance: string;
  storyTitle: string;
  storyBody: string;
  storyMoral: string[];
  lkpdTitle: string;
  lkpdCase: string;
  lkpdQuestions: string[];
  inquiryCards: {
    title: string;
    prompt: string;
  }[];
  parentGuideTasks: string[];
  parentHabitChecklist: string[];
}

function analyzeTopic(atp: MasterAtpRecord): TopicKnowledge {
  const elemLower = (atp.elemen || '').toLowerCase();
  const tpLower = (atp.tujuan_pembelajaran || '').toLowerCase();
  const cpLower = (atp.capaian_pembelajaran || '').toLowerCase();

  // 1. Strict Domain Detection prioritizing the curriculum Element
  let domain: 'quran_hadis' | 'akidah' | 'akhlak' | 'fikih' | 'sejarah' = 'akhlak';
  if (elemLower.includes('qur') || elemLower.includes('hadis') || elemLower.includes('hadits')) {
    domain = 'quran_hadis';
  } else if (elemLower.includes('akidah') || elemLower.includes('aqidah')) {
    domain = 'akidah';
  } else if (elemLower.includes('fikih') || elemLower.includes('fiqih')) {
    domain = 'fikih';
  } else if (elemLower.includes('sejarah') || elemLower.includes('spi') || elemLower.includes('ski') || elemLower.includes('tarikh') || elemLower.includes('kebudayaan')) {
    domain = 'sejarah';
  } else if (elemLower.includes('akhlak')) {
    domain = 'akhlak';
  } else {
    // Fallback from TP and CP keywords
    if (tpLower.includes('surah') || tpLower.includes('ayat') || tpLower.includes('tajwid') || tpLower.includes('hadis') || tpLower.includes('qur') || tpLower.includes('tartil')) {
      domain = 'quran_hadis';
    } else if (tpLower.includes('salat') || tpLower.includes('shalat') || tpLower.includes('wudu') || tpLower.includes('wudhu') || tpLower.includes('bersuci') || tpLower.includes('zakat') || tpLower.includes('puasa')) {
      domain = 'fikih';
    } else if (tpLower.includes('iman') || tpLower.includes('asmaul husna') || tpLower.includes('malaikat') || tpLower.includes('tauhid')) {
      domain = 'akidah';
    } else if (tpLower.includes('kisah') || tpLower.includes('nabi') || tpLower.includes('rasul') || tpLower.includes('hijrah')) {
      domain = 'sejarah';
    }
  }

  // 2. Extract clean title
  let cleanTitle = atp.tujuan_pembelajaran;
  if (cleanTitle.includes(':')) {
    cleanTitle = cleanTitle.split(':')[0].trim();
  }
  cleanTitle = cleanTitle
    .replace(/^(Peserta didik mampu|Murid dapat|Mampu|Dapat|Memahami|Menjelaskan|Mempraktikkan|Mengenal|Meneladani|Membaca)\s+/i, '')
    .trim();
  if (!cleanTitle) cleanTitle = atp.elemen;
  cleanTitle = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);

  // 3. Domain-specific synthesized content and customized templates
  if (domain === 'quran_hadis') {
    // Check specific surah/hadis cases
    let dalilText = 'وَرَتِّلِ الْقُرْاٰنَ تَرْتِيْلًاۗ (QS. Al-Muzzammil: 4) & خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ (HR. Bukhari)';
    let dalilMeaning = '"Dan bacalah Al-Qur\'an itu dengan perlahan-lahan (tartil)." (QS. Al-Muzzammil: 4) serta sabda Nabi saw.: "Sebaik-baik kalian adalah orang yang belajar Al-Qur\'an dan mengajarkannya." (HR. Bukhari)';
    let specificContext = `Pembelajaran materi ${cleanTitle} adalah sarana utama bagi peserta didik untuk membina interaksi yang akrab dengan firman Allah Swt. dan sabda Rasulullah saw. Melalui pembacaan yang fasih, pemahaman makhraj huruf, kaidah hukum tajwid yang tartil, dan tadabur ayat, murid tidak hanya memperoleh pahala ibadah tilawah, melainkan juga menanamkan kompas moral ilahi dalam sanubarinya.`;

    if (tpLower.includes('hujurat') || tpLower.includes('49: 13') || tpLower.includes('49:13')) {
      dalilText = 'يٰٓاَيُّهَا النَّاسُ اِنَّا خَلَقْنٰكُمْ مِّنْ ذَكَرٍ وَّاُنْثٰى وَجَعَلْنٰكُمْ شُعُوْبًا وَّقَبَاۤىِٕلَ لِتَعَارَفُوْا ۚ اِنَّ اَكْرَمَكُمْ عِنْدَ اللّٰهِ اَتْقٰىكُمْ ۗاِنَّ اللّٰهَ عَلِيْمٌ خَبِيْرٌ (QS. Al-Hujurat: 13)';
      dalilMeaning = '"Wahai manusia! Sungguh, Kami telah menciptakan kamu dari seorang laki-laki dan seorang perempuan, kemudian Kami jadikan kamu berbangsa-bangsa dan bersuku-suku agar kamu saling mengenal. Sungguh, yang paling mulia di antara kamu di sisi Allah ialah orang yang paling bertakwa. Sungguh, Allah Maha Mengetahui, Mahateliti." (QS. Al-Hujurat: 13)';
      specificContext = `Surah Al-Hujurat ayat 13 diturunkan sebagai piagam kesetaraan dan kerukunan umat manusia. Pada masa peristiwa Fathu Makkah, ketika Bilal bin Rabah r.a. mengumandangkan azan di atas Ka'bah, sebagian orang mencibir latar belakang warna kulitnya. Ayat agung ini turun menegaskan bahwa seluruh manusia bersaudara dari satu asal (Adam dan Hawa), keragaman suku bangsa adalah kehendak Allah untuk saling mengenal (lita'arafu), dan derajat kemuliaan di hadapan Allah hanya diukur dari ketakwaannya.`;
    } else if (tpLower.includes('tin') || tpLower.includes('at-tin')) {
      dalilText = 'وَالتِّيْنِ وَالزَّيْتُوْنِ ۙ وَطُوْرِ سِيْنِيْنَ ۙ وَهٰذَا الْبَلَدِ الْاَمِيْنِ ۙ لَقَدْ خَلَقْنَا الْاِنْسَانَ فِيْٓ اَحْسَنِ تَقْوِيْمٍ ۖ (QS. At-Tin: 1-4)';
      dalilMeaning = '"Demi buah Tin dan buah Zaitun, demi gunung Sinai, dan demi negeri (Mekah) yang aman ini. Sungguh, Kami telah menciptakan manusia dalam bentuk yang sebaik-baiknya." (QS. At-Tin: 1-4)';
      specificContext = `Surah At-Tin diawali dengan sumpah Allah Swt. atas empat tempat dan simbol kemuliaan wahyu para nabi terdahulu. Surah ini menegaskan hakikat martabat manusia yang diciptakan dalam bentuk fisik, akal, dan jiwa yang paling sempurna (ahsan taqwim), sekaligus peringatan agar manusia tidak terjerumus ke derajat yang paling rendah (asfala safilin) karena meninggalkan iman dan amal saleh.`;
    } else if (tpLower.includes('maun') || tpLower.includes("ma'un")) {
      dalilText = 'اَرَءَيْتَ الَّذِيْ يُكَذِّبُ بِالدِّيْنِ ۗ فَذٰلِكَ الَّذِيْ يَدُعُّ الْيَتِيْمَ ۙ وَلَا يَحُضُّ عَلٰى طَعَامِ الْمِسْكِيْنِ ۗ (QS. Al-Ma\'un: 1-3)';
      dalilMeaning = '"Tahukah kamu orang yang mendustakan agama? Maka itulah orang yang menghardik anak yatim, dan tidak mendorong memberi makan orang miskin." (QS. Al-Ma\'un: 1-3)';
      specificContext = `Surah Al-Ma'un memberikan peringatan keras bahwa kesalehan ritual salat tidak ada artinya jika pelakunya lalai dari kepedulian sosial, gemar menghardik anak yatim, enggan menolong orang miskin, serta bersikap riya' (pamer). Surah ini menuntun murid menjadi muslim yang berjiwa dermawan dan penyayang.`;
    }

    return {
      cleanTitle,
      domain,
      section1Title: 'Latar Belakang & Asbabun Nuzul / Asbabul Wurud (Context & Setting)',
      section2Title: 'Teks Suci (Lafal Arab & Terjemahan), Kosa Kata (Mufradat) & Kaidah Tajwid / Makhraj',
      section3Title: 'Analisis Tafsir & Kandungan Makna Utama Ayat / Hadis',
      section4Title: 'Manifestasi Multidimensi Pengamalan Pesan Ayat / Hadis (Multi-dimensional Impact)',
      section5Title: 'Relevansi Masa Kini & Renungan Hati Generasi Digital (Modern Relevance)',
      dalilText,
      dalilMeaning,
      contextAndSetting: specificContext,
      conceptAnalysis: [
        {
          title: 'Kaidah Makharijul Huruf & Hukum Tajwid Pokok',
          points: [
            `Ketepatan melafalkan setiap huruf hijaiyah sesuai makhraj aslinya (al-halq, al-lisan, asy-syafatain, al-khaisyum) agar bunyi ayat terjaga kesuciannya.`,
            `Penerapan hukum bacaan tartil secara cermat: ghunnah musyaddadah, panjang mad thabi'i, pantulan qalqalah, dan aturan waqaf / ibtida'.`,
            `Membiasakan intonasi tilawah yang tenang, khusyuk, dan berirama tertib tanpa tergesa-gesa.`,
          ],
        },
        {
          title: 'Telaah Kosa Kata Kunci (Mufradat) & Tafsir Ayat / Hadis',
          points: [
            `Memahami makna kata demi kata secara mendalam sehingga peserta didik mengerti apa yang dibaca dan dilafalkan.`,
            `Menggali pesan utama: perintah menegakkan ketakwaan, menjunjung tinggi nilai persaudaraan, dan menjauhi perbuatan dosa.`,
            `Mengambil ibrah dan hukum syariat yang terkandung di dalam teks suci untuk diterapkan dalam kehidupan nyata.`,
          ],
        },
        {
          title: 'Pembiasaan Hafalan Tartil & Adab terhadap Al-Qur\'an',
          points: [
            `Menerapkan metode menghafal berulang (*tikrar*) dan memperdengarkan bacaan kepada teman sebaya (*tasmik*).`,
            `Menjaga adab mulia: berwudu sebelum menyentuh mushaf, menghadap kiblat, dan mengawali dengan ta'awudz serta basmalah.`,
          ],
        },
      ],
      multiDimensionalImpact: {
        keluarga: `Menghidupkan suasana rumah dengan lantunan Al-Qur'an dan mutiara hadis ba'da magrib, menghadirkan ketenangan batin (*sakinah*) bagi seluruh anggota keluarga.`,
        sosial: `Mengamalkan pesan kasih sayang, persaudaraan, dan saling menghargai antarteman di sekolah tanpa membedakan latar belakang.`,
        lingkungan: `Merawat alam semesta ciptaan Allah Swt. sebagai wujud ketaatan terhadap firman-Nya di dalam Al-Qur'an.`,
      },
      modernRelevance: `Di era informasi digital yang serba cepat dan rentan terhadap konten negatif, membiasakan tilawah dan tadabur ${cleanTitle} menjadi penuntun cahaya yang menjaga kejernihan akal, ketenteraman jiwa, dan kemuliaan akhlak generasi muda.`,
      storyTitle: `Lentera Cahaya Al-Qur'an di Rumah Rayyan`,
      storyBody: `Sore itu, rintik hujan membasahi jendela kelas. Rayyan, seorang anak yang tekun dan bersuara merdu, sedang duduk bersama sahabatnya, Danu. Danu tampak gelisah karena merasa kesulitan melafalkan bacaan ayat Al-Qur'an yang baru saja dipelajari terkait ${cleanTitle}. Huruf-hurufnya kerap tertukar dan panjang pendeknya belum teratur.\n\nMelihat Danu bersedih, Rayyan tidak menertawakannya. Sambil tersenyum ramah, Rayyan mendekati Danu dan berkata: "Danu, jangan berkecil hati ya. Rasulullah saw. pernah bersabda bahwa orang yang membaca Al-Qur'an dengan terbata-bata dan bersusah payah mempelajarinya justru mendapatkan dua pahala kebaikan dari Allah!"\n\nMendengar hal itu, mata Danu berbinar kembali. Dengan penuh kesabaran, Rayyan membimbing Danu mengulang lafal ayat demi ayat, memperhatikan makhraj huruf dan tanda waqafnya dengan tartil. Ketika Danu berhasil melafalkan ayat dengan lancar, wajahnya berseri-seri penuh kegembiraan.\n\nIbu Guru yang memperhatikan keikhlasan Rayyan dan semangat pantang menyerah Danu memberikan pujian hangat: "Masya Allah, inilah bukti cinta Al-Qur'an yang sejati. Kalian tidak hanya belajar membaca firman-Nya, tetapi juga langsung mengamalkan akhlak Al-Qur'an dengan saling menolong dalam kebaikan."`,
      storyMoral: [
        `Belajar membaca dan memahami Al-Qur'an membutuhkan kesabaran, ketekunan, dan niat yang ikhlas karena Allah Swt.`,
        `Membantu teman yang sedang kesulitan belajar adalah wujud nyata mengamalkan ajaran Al-Qur'an.`,
        `Setiap huruf Al-Qur'an yang dilafalkan dengan tartil bernilai pahala berlipat ganda dan mendatangkan kedamaian hati.`,
      ],
      lkpdTitle: `Eksplorasi Tilawah, Tajwid & Tadabur: ${cleanTitle}`,
      lkpdCase: `Studi Kasus Pembelajaran: Saat kegiatan tadarus Al-Qur'an di sekolah, ada seorang teman yang membaca ayat-ayat materi ${cleanTitle} secara sangat terburu-buru dan tidak memperhatikan panjang-pendek bacaan (mad) serta tanda waqaf sehingga mengubah arti dari ayat tersebut.\n\nTugas Kelompok:\n1. Jelaskan mengapa membaca Al-Qur'an diwajibkan secara tartil dan berhati-hati sesuai kaidah tajwid!\n2. Bagaimana cara kelompok kalian mengajak teman tersebut untuk memperbaiki bacaannya dengan cara yang santun dan memotivasi?`,
      lkpdQuestions: [
        `Salinlah teks ayat/hadis pokok materi ${cleanTitle} dalam tulisan Arab yang rapi beserta terjemahannya!`,
        `Identifikasi 3 hukum tajwid atau kaidah makhraj huruf yang terdapat pada ayat/hadis tersebut!`,
        `Tuliskan 3 pesan pokok dan hikmah yang dapat kamu petik untuk diamalkan dalam pergaulan di sekolah!`,
      ],
      inquiryCards: [
        {
          title: 'Kartu 1 (Koneksi Batin)',
          prompt: `Bagaimana perasaan hatimu saat membaca ayat suci Al-Qur'an dengan perlahan, tartil, dan menghayati artinya?`,
        },
        {
          title: 'Kartu 2 (Tadabur Makna)',
          prompt: `Satu pesan mulia apa dari materi ${cleanTitle} yang paling ingin kamu amalkan hari ini?`,
        },
        {
          title: 'Kartu 3 (Adab Tilawah)',
          prompt: `Apakah kamu sudah membiasakan diri berwudu, menghadap kiblat, dan memulai membaca Al-Qur'an dengan ta'awudz serta basmalah?`,
        },
        {
          title: 'Kartu 4 (Komitmen Diri)',
          prompt: `Tuliskan tekadmu untuk menyetorkan bacaan tartil atau hafalan ayat ini kepada orang tuamu di rumah!`,
        },
      ],
      parentGuideTasks: [
        `Mendengarkan dan menyimak lantunan tilawah ananda saat melafalkan materi ${cleanTitle} di rumah.`,
        `Memberikan apresiasi dan motivasi hangat atas ketekunan ananda dalam mempelajari Al-Qur'an dan Hadis.`,
        `Membiasakan waktu hening tanpa gawai (gadget) selepas magrib untuk tadarus Al-Qur'an bersama keluarga.`,
      ],
      parentHabitChecklist: [
        `Membaca Al-Qur'an / Iqra dengan tartil ba'da magrib/subuh`,
        `Menjaga adab terhadap mushaf Al-Qur'an (meletakkan di tempat bersih & suci)`,
        `Menerapkan pesan kebaikan materi dalam interaksi di rumah`,
        `Mendoakan kebaikan untuk kedua orang tua sehabis membaca Al-Qur'an`,
      ],
    };
  }

  if (domain === 'fikih') {
    return {
      cleanTitle,
      domain,
      section1Title: 'Latar Belakang & Urgensi Syariat Ibadah (Context & Setting)',
      section2Title: 'Dalil Pokok, Syarat Wajib, & Syarat Sah Pelaksanaan Ibadah',
      section3Title: 'Analisis Rukun, Urutan Tata Cara Tertib, Tuma\'ninah, & Hal-hal yang Membatalkan',
      section4Title: 'Manifestasi & Hikmah Ibadah (Multi-dimensional Impact)',
      section5Title: 'Relevansi Masa Kini & Fikih Aplikatif Keseharian Siswa (Modern Relevance)',
      dalilText: 'يٰٓاَيُّهَا الَّذِيْنَ اٰمَنُوْا... وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ (QS. Al-Baqarah: 43) & بُنِيَ الْإِسْلَامُ عَلَى خَمْسٍ (HR. Bukhari & Muslim)',
      dalilMeaning: '"Dan laksanakanlah salat, tunaikanlah zakat, dan rukuklah beserta orang-orang yang rukuk." (QS. Al-Baqarah: 43) serta sabda Nabi saw.: "Islam dibangun di atas lima perkara..." (HR. Bukhari & Muslim)',
      contextAndSetting: `Fikih ibadah mengenai ${cleanTitle} merupakan pedoman syariat Islam yang mengatur bagaimana seorang hamba menghadap, menyembah, dan menyucikan diri di hadapan Sang Maha Pencipta. Ajaran ${cleanTitle} mendidik ketertiban lahir dan batin, menjunjung tinggi kebersihan raga, memupuk kebersamaan dalam saf jemaah, serta melatih kedisiplinan waktu hidup sejak dini.`,
      conceptAnalysis: [
        {
          title: 'Syarat Wajib dan Syarat Sah Pelaksanaan',
          points: [
            `Memahami ketentuan yang harus dipenuhi sebelum ibadah dimulai (beragama Islam, balig/tamyiz, suci dari hadas dan najis, menutup aurat, dan menghadap kiblat).`,
            `Mengetahui perbedaan mendasar antara air yang suci menyucikan (*thahir muthahhir*) dengan air yang terkena najis (*mutanajjis*).`,
            `Memastikan kesucian badan, pakaian, dan tempat ibadah sebagai syarat mutlak diterimanya penghambaan.`,
          ],
        },
        {
          title: 'Rukun Pokok, Urutan Tata Cara Tertib, & Tuma\'ninah',
          points: [
            `Memahami setiap rukun pokok yang wajib ada dan tidak boleh ditinggalkan; apabila tertinggal secara sengaja maka ibadah tidak sah.`,
            `Mempraktikkan setiap langkah gerakan dan bacaan secara tertib, benar, dan tuma'ninah (tenang sejenak tanpa tergesa-gesa).`,
            `Melengkapi ibadah dengan amalan sunnah yang dianjurkan Rasulullah saw. untuk menyempurnakan pahala.`,
          ],
        },
        {
          title: 'Hal-Hal yang Membatalkan & Kesalahan Umum',
          points: [
            `Mengenali hal-hal yang membatalkan ibadah agar senantiasa berhati-hati dan khusyuk saat beribadah.`,
            `Menghindari kesalahan umum: bercanda saat ibadah, bergerak berlebihan, atau membaca lafal tanpa memenuhi hukumnya.`,
          ],
        },
      ],
      multiDimensionalImpact: {
        keluarga: `Membiasakan salat berjemaah di rumah bersama keluarga, saling mengingatkan waktu ibadah dengan penuh kelembutan.`,
        sosial: `Menumbuhkan rasa kesetaraan saat berdiri merapatkan saf di masjid tanpa memandang perbedaan status sosial dan kekayaan.`,
        lingkungan: `Mendidik kesadaran hidup bersih, hemat menggunakan air saat bersuci, dan merawat kebersihan tempat ibadah.`,
      },
      modernRelevance: `Di tengah kesibukan jadwal dan godaan gawai digital, ketelatenan mengamalkan ${cleanTitle} mendidik anak memiliki manajemen waktu yang tangguh, melatih fokus konsentrasi, serta menjaga kebersihan dan kesehatan jasmani-ruhani setiap hari.`,
      storyTitle: `Langkah Tertib dan Gemercik Air Wudu Bilal`,
      storyBody: `Suara azan berkumandang merdu dari musala sekolah. Waktu istirahat telah tiba, saatnya seluruh murid kelas IV melaksanakan salat zuhur berjemaah. Bilal bersama teman-temannya bergegas menuju tempat wudu.\n\nDi tempat wudu, Bilal melihat temannya, Zaki, membuka kran air terlalu deras hingga air memercik ke mana-mana. Zaki juga membasuh mukanya dengan sangat cepat dan terburu-buru, bahkan bagian ujung sikunya belum terbasahi air secara merata.\n\nBilal dengan sopan mendekati Zaki lalu mengecilkan kran airnya: "Zaki, kran airnya kita hemat yuk. Rasulullah saw. mengajarkan kita agar tidak boros air saat berwudu, meskipun kita berwudu di sungai yang mengalir deras. Selain itu, siku tangan kita harus dibasuh secara merata agar wudu kita sah dan salat kita diterima Allah Swt."\n\nZaki tertegun mendengar penjelasan Bilal yang santun. Ia melihat sikunya yang masih kering, lalu tersenyum penuh terima kasih: "Terima kasih banyak, Bilal, sudah mengingatkanku. Mari kita berwudu dengan tertib dan tenang bersama-sama." Keduanya pun berwudu dengan tertib dan melangkah ke musala dengan hati yang tenang dan bersih.`,
      storyMoral: [
        `Ibadah harus dilakukan secara tertib, teliti, dan tuma'ninah sesuai tuntunan Rasulullah saw.`,
        `Islam mengajarkan hidup hemat dan melarang membuang-buang air meski saat bersuci.`,
        `Mengingatkan teman dalam kebaikan harus dilakukan dengan tutur kata yang santun dan penuh kasih sayang.`,
      ],
      lkpdTitle: `Panduan Praktik & Analisis Fikih: ${cleanTitle}`,
      lkpdCase: `Studi Kasus Fikih: Salman sedang berwudu untuk salat berjemaah di sekolah. Karena tergesa-gesa ingin mendapatkan saf pertama, Salman lupa membasuh telinganya dan saat salat ia bergerak menggaruk-garuk kepalanya lebih dari tiga kali berturut-turut sambil menoleh ke temannya.\n\nTugas Kelompok:\n1. Berdasarkan hukum fikih, apakah wudu dan salat Salman sah? Jelaskan alasannya!\n2. Urutkan kembali tata cara ${cleanTitle} yang benar dan rukun-rukunnya dari awal hingga akhir!`,
      lkpdQuestions: [
        `Sebutkan 3 syarat sah dan 3 rukun utama yang wajib ada dalam pelaksanaan ${cleanTitle}!`,
        `Jelaskan mengapa tuma'ninah (ketenangan gerak) sangat penting dalam ibadah salat!`,
        `Demonstrasikan secara bergantian di depan kelompokmu tata cara praktik ${cleanTitle} yang benar!`,
      ],
      inquiryCards: [
        {
          title: 'Kartu 1 (Kesiapan Hati)',
          prompt: `Apakah kamu sudah membiasakan diri berniat ikhlas semata-mata karena Allah Swt. sebelum memulai ibadah?`,
        },
        {
          title: 'Kartu 2 (Kekhusyukan & Disiplin)',
          prompt: `Apa yang kamu lakukan agar pikiranmu tidak melayang ke permainan saat sedang beribadah menghadap Allah?`,
        },
        {
          title: 'Kartu 3 (Kebersihan Lahir Batin)',
          prompt: `Bagaimana caramu menjaga kebersihan pakaian dan alat salatmu di rumah dan di sekolah?`,
        },
        {
          title: 'Kartu 4 (Tantangan Pembiasaan)',
          prompt: `Tuliskan tekadmu untuk tidak menunda-nunda waktu salat ketika azan sudah berkumandang!`,
        },
      ],
      parentGuideTasks: [
        `Mendampingi dan mengamati secara langsung praktik ${cleanTitle} ananda di rumah untuk memastikan rukun dan syaratnya terpenuhi.`,
        `Membiasakan salat berjemaah di rumah bersama seluruh anggota keluarga minimal satu kali setiap hari.`,
        `Memberikan keteladanan dengan langsung menghentikan aktivitas saat mendengar panggilan azan.`,
      ],
      parentHabitChecklist: [
        `Salat lima waktu tepat pada waktunya`,
        `Menyempurnakan wudu dan tidak boros menggunakan air`,
        `Merapikan sajadah, mukena/sarung, dan peci setelah digunakan`,
        `Berdoa dengan khusyuk sehabis melaksanakan salat`,
      ],
    };
  }

  if (domain === 'akidah') {
    return {
      cleanTitle,
      domain,
      section1Title: 'Hakikat Keimanan & Kebutuhan Fitrah Manusia (Context & Setting)',
      section2Title: 'Dalil Naqli (Al-Qur\'an & Sunnah) serta Bukti Kauniyah di Alam Semesta',
      section3Title: 'Analisis Konseptual Rukun Iman / Asmaul Husna',
      section4Title: 'Manifestasi Multidimensi Keyakinan Tauhid (Multi-dimensional Impact)',
      section5Title: 'Relevansi Masa Kini & Keteguhan Hati Generasi Digital (Modern Relevance)',
      dalilText: 'شَهِدَ اللّٰهُ اَنَّهٗ لَآ اِلٰهَ اِلَّا هُوَۙ وَالْمَلٰۤىِٕكَةُ وَاُولُوا الْعِلْمِ (QS. Ali \'Imran: 18) & قُلْ هُوَ اللّٰهُ اَحَدٌ (QS. Al-Ikhlas: 1)',
      dalilMeaning: '"Allah menyatakan bahwa tidak ada tuhan selain Dia; (demikian pula) para malaikat dan orang-orang berilmu yang menegakkan keadilan..." (QS. Ali \'Imran: 18) serta "Katakanlah (Muhammad), Dialah Allah, Yang Maha Esa." (QS. Al-Ikhlas: 1)',
      contextAndSetting: `Pembelajaran akidah mengenai ${cleanTitle} adalah fondasi spiritual yang paling mendasar dalam membangun bangunan kepribadian seorang muslim (*ushuluddin*). Keyakinan tauhid yang lurus membersihkan akal dan jiwa manusia dari belenggu ketakutan pada takhayul dan keputusasaan, menumbuhkan kesadaran bahwa hidup manusia bermakna luhur, diawasi oleh Sang Maha Melihat, dan dipertanggungjawabkan di hadapan-Nya kelak.`,
      conceptAnalysis: [
        {
          title: 'Konsep Tauhid & Hakikat Keyakinan yang Benar',
          points: [
            `Meyakini dengan sepenuh hati (*tashdiq bil qalbi*), mengucapkan dengan lisan (*iqrar bil lisan*), dan membuktikan dengan amal nyata (*'amal bil arkan*).`,
            `Menolak segala bentuk kemusyrikan, kesombongan diri, dan ketergantungan palsu kepada selain Allah Swt.`,
            `Memahami dalil naqli serta dalil aqli (bukti keteraturan alam semesta) yang menunjukkan kebenaran ajaran ${cleanTitle}.`,
          ],
        },
        {
          title: 'Mendalami Makna dan Hikmah Keimanan',
          points: [
            `Membedah kandungan makna mulia di balik ajaran ${cleanTitle} dan bagaimana keimanan ini melahirkan ketenangan batin.`,
            `Menumbuhkan sifat muraqabatullah: kesadaran mendalam bahwa Allah senantiasa mengawasi gerak-gerik hamba-Nya kapan pun dan di mana pun.`,
            `Meyakini bahwa setiap nikmat, rezeki, dan ujian datang atas kebijaksanaan dan kasih sayang Allah Swt.`,
          ],
        },
        {
          title: 'Refleksi Karakter: Meneladani Sifat-Sifat Luhur',
          points: [
            `Mengejawantahkan pemahaman tentang ${cleanTitle} ke dalam perilaku sehari-hari: jujur, rendah hati, dan berani membela kebenaran.`,
            `Menjadi pribadi yang berakhlak mulia dan menebarkan kedamaian karena hanya mengharap rida Allah Swt.`,
          ],
        },
      ],
      multiDimensionalImpact: {
        keluarga: `Menjadikan rumah tangga bersendikan ketakwaan, membiasakan dialog tauhid yang mengagumi ciptaan Allah, dan mengajarkan kejujuran sejak kecil.`,
        sosial: `Menumbuhkan sikap adil, tidak menindas yang lemah, dan menghargai sesama manusia sebagai sama-sama hamba Allah Swt.`,
        lingkungan: `Menjaga alam semesta sebagai bentangan ayat-ayat kauniyah yang memperlihatkan keindahan dan kesempurnaan ciptaan Allah.`,
      },
      modernRelevance: `Di zaman modern yang serba instan dan penuh godaan, akidah yang kokoh tentang ${cleanTitle} menyelamatkan generasi muda dari krisis jati diri, perasaan hampa, serta godaan berbuat curang saat tidak ada orang lain yang melihat.`,
      storyTitle: `Bintang Kejujuran di Bawah Naungan Al-Bashir`,
      storyBody: `Malam itu langit desa begitu cerah, bertabur bintang-bintang yang berkilauan. Fatih dan kakeknya sedang duduk santai di teras rumah setelah menunaikan salat isya berjemaah. Fatih mengagumi hamparan bintang di langit yang luas tanpa tiang penyangga.\n\n"Kek, siapakah yang menyalakan dan menjaga jutaan bintang di langit itu agar tidak bertabrakan?" tanya Fatih penuh rasa takjub.\n\nKakek tersenyum penuh kasih dan merangkul pundak Fatih: "Fatih cucuku, Dialah Allah Swt., Tuhan Yang Maha Esa, Al-Khaliq Yang Maha Menciptakan dan Al-Qayyum Yang Maha Mengurus seluruh alam semesta. Allah juga memiliki sifat Al-Bashir (Maha Melihat) dan Al-Alim (Maha Mengetahui). Tak sehelai daun pun yang gugur di bumi ini melainkan dalam pengetahuan-Nya."\n\nKakek lalu mengingatkan Fatih tentang peristiwa siang tadi di sekolah, saat Fatih menemukan uang sepuluh ribu rupiah di dekat kantin dan langsung menyerahkannya ke guru piket meskipun tidak ada yang melihatnya: "Tindakanmu tadi siang adalah buah dari iman di dalam dadamu. Kamu tahu bahwa meskipun manusia tidak melihat, Allah senantiasa melihat kejujuran hatimu." Fatih tersenyum bahagia, merasakan betapa hangat dan tenangnya hidup dengan meyakini kehadiran Allah di setiap helaan napasnya.`,
      storyMoral: [
        `Keteraturan alam semesta dan langit bertabur bintang adalah bukti nyata kebesaran Allah Swt.`,
        `Iman yang sejati melahirkan kejujuran batin (*muraqabatullah*), baik saat berada di keramaian maupun saat sendirian.`,
        `Mengenal sifat-sifat Allah membuat hati senantiasa tenang, damai, dan terlindung dari perbuatan buruk.`,
      ],
      lkpdTitle: `Refleksi Tauhid & Penguatan Akidah: ${cleanTitle}`,
      lkpdCase: `Studi Kasus Akidah: Ketika ujian sekolah berlangsung, guru pengawas sedang keluar ruangan sebentar untuk mengambil lembar soal susulan. Sebagian teman mengajak Farhan untuk membuka catatan dan menyontek bersama karena tidak ada orang dewasa yang mengawasi.\n\nTugas Analisis:\n1. Jika Farhan mengimani materi ${cleanTitle} dengan sungguh-sungguh, apa yang seharusnya ia katakan dan lakukan?\n2. Sebutkan nama sifat Allah atau malaikat yang mencatat perbuatan manusia yang berkaitan erat dengan peristiwa tersebut!`,
      lkpdQuestions: [
        `Tuliskan dalil naqli pokok beserta artinya yang mendasari keimanan kita terhadap ${cleanTitle}!`,
        `Jelaskan 3 bukti nyata dalam kehidupan sehari-hari bahwa seseorang benar-benar mengimani materi ini!`,
        `Buatlah sebuah peta konsep (*mind map*) kreatif yang menggambarkan keterkaitan keimanan ini dengan pembentukan akhlak mulia!`,
      ],
      inquiryCards: [
        {
          title: 'Kartu 1 (Kekaguman Tauhid)',
          prompt: `Ketika kamu melihat keindahan alam dan keajaiban tubuhmu sendiri, apakah kamu merasakan betapa Maha Kuasanya Allah Swt.?`,
        },
        {
          title: 'Kartu 2 (Pengawasan Batin)',
          prompt: `Apakah kamu tetap menjaga kejujuran dan kesantunan perkataanmu saat tidak ada guru atau orang tua yang melihatmu?`,
        },
        {
          title: 'Kartu 3 (Rasa Syukur)',
          prompt: `Sebutkan satu nikmat terbesar dari Allah hari ini yang paling ingin kamu syukuri dengan ucapan alhamdulillah!`,
        },
        {
          title: 'Kartu 4 (Harapan & Tawakal)',
          prompt: `Doa apa yang senantiasa kamu panjatkan agar Allah menjaga keimanan dan keteguhan hatimu hingga akhir hayat?`,
        },
      ],
      parentGuideTasks: [
        `Mengajak ananda berdialog ringan mengenai tanda-tanda kebesaran Allah di alam sekitar (*tadabbur alam*).`,
        `Menanamkan nilai kejujuran berbasis keimanan (*Allah Maha Melihat dan Maha Mendengar*) dalam setiap pembicaraan di rumah.`,
        `Membiasakan melafalkan kalimat thayyibah (Basmalah, Hamdalah, Subhanallah, Istighfar) saat menghadapi berbagai peristiwa sehari-hari.`,
      ],
      parentHabitChecklist: [
        `Mengawali dan mengakhiri setiap perbuatan baik dengan basmalah dan hamdalah`,
        `Berbicara jujur dan berani mengakui kesalahan tanpa berbohong`,
        `Menjaga salat dan berserah diri kepada Allah saat menghadapi kesulitan`,
        `Menghindari perkataan kasar dan menyakiti sesama makhluk ciptaan Allah`,
      ],
    };
  }

  if (domain === 'sejarah') {
    return {
      cleanTitle,
      domain,
      section1Title: 'Kondisi Sosial Zaman & Latar Belakang Kultural (Context & Setting)',
      section2Title: 'Rekam Jejak Sejarah & Kronologi Peristiwa Penting',
      section3Title: 'Analisis Mendalam Nilai Kepemimpinan & Keteladanan Tokoh',
      section4Title: 'Manifestasi Multidimensi Ibrah Sejarah (Multi-dimensional Impact)',
      section5Title: 'Relevansi Masa Kini & Inspirasi Generasi Penerus Bangsa (Modern Relevance)',
      dalilText: 'لَقَدْ كَانَ لَكُمْ فِيْ رَسُوْلِ اللّٰهِ اُسْوَةٌ حَسَنَةٌ (QS. Al-Ahzab: 21) & لَقَدْ جَاۤءَكُمْ رَسُوْلٌ مِّنْ اَنْفُسِكُمْ (QS. At-Taubah: 128)',
      dalilMeaning: '"Sungguh, telah ada pada (diri) Rasulullah itu suri teladan yang baik bagimu (yaitu) bagi orang yang mengharap (rahmat) Allah dan (kedatangan) hari Kiamat..." (QS. Al-Ahzab: 21)',
      contextAndSetting: `Pembelajaran sejarah peradaban Islam mengenai ${cleanTitle} adalah napak tilas perjuangan agung para nabi, rasul, dan sahabat mulia yang meletakkan dasar peradaban yang beradab. Sebelum peristiwa ini terjadi, masyarakat terbelenggu dalam kegelapan moral dan fanatisme golongan. Perjuangan ${cleanTitle} hadir membuktikan bahwa kebenaran, kesabaran, keadilan, dan keteguhan iman akan selalu memenangkan pertempuran moral melawan kezaliman.`,
      conceptAnalysis: [
        {
          title: 'Latar Belakang Zaman & Tantangan Awal Perjuangan',
          points: [
            `Memahami situasi sosial, politik, dan budaya yang dihadapi tokoh pada masa awal mula perjuangan ${cleanTitle}.`,
            `Mengidentifikasi rintangan berat: pemboikotan ekonomi, intimidasi, dan cemoohan yang dihadapi dengan ketabahan luar biasa.`,
            `Keteladanan dalam membalas kejahatan dengan kebaikan dan tidak pernah membalas dendam secara membabi buta.`,
          ],
        },
        {
          title: 'Strategi Dakwah, Diplomasi Damai & Kepemimpinan Berkeadilan',
          points: [
            `Mempelajari langkah-langkah strategis yang ditempuh tokoh (musyawarah, diplomasi damai, persaudaraan kaum Muhajirin dan Anshar).`,
            `Meneladani sifat kepemimpinan yang amanah, melayani rakyat (*khadimul ummah*), serta mengutamakan keselamatan dan hak-hak kaum rentan.`,
            `Kecerdasan menyelesaikan konflik secara damai tanpa pertumpahan darah.`,
          ],
        },
        {
          title: 'Ibrah (Pelajaran Berharga) bagi Generasi Masa Kini',
          points: [
            `Menarik benang merah nilai keteladanan: keuletan, pengorbanan, kepedulian sosial, dan kesetiaan pada janji.`,
            `Menjadikan sejarah cermin inspirasi kepemimpinan dan integritas hidup sehari-hari.`,
          ],
        },
      ],
      multiDimensionalImpact: {
        keluarga: `Meneladani kelembutan nabi/sahabat dalam mengayomi keluarga, membantu pekerjaan rumah tangga, dan mendidik anak-anak dengan penuh kasih sayang.`,
        sosial: `Membangun kerukunan dalam kebinekaan suku, agama, dan budaya sebagaimana dicontohkan dalam Piagam Madinah.`,
        lingkungan: `Meneladani adab nabi yang melarang merusak pepohonan, mencemari sumber air, dan melarang menyiksa hewan.`,
      },
      modernRelevance: `Di tengah krisis keteladanan saat ini, meneladani sejarah perjuangan ${cleanTitle} memberikan kompas moral bagi pelajar untuk tumbuh menjadi generasi penerus bangsa yang jujur, berjiwa ksatria, pantang menyerah, dan berakhlak mulia.`,
      storyTitle: `Langkah Teguh Menjemput Fajar Kemenangan`,
      storyBody: `Ruang kelas tampak hening saat Pak Guru mulai mengisahkan lembaran bersejarah tentang ${cleanTitle}. Di tengah terik padang pasir dan ancaman kaum yang memusuhi dakwah kebenaran, langkah para nabi dan pejuang Islam tidak pernah surut sedikit pun.\n\n"Anak-anakku," tutur Pak Guru dengan suara bergetar haru, "pernahkah kalian membayangkan betapa beratnya meninggalkan tanah tumpah darah, rumah halaman, dan harta benda demi mempertahankan keyakinan kepada Allah? Namun, tidak ada sedikit pun keluh kesah yang keluar dari bibir mereka. Yang ada hanyalah keyakinan mutlak bahwa Allah senantiasa membersamai orang-orang yang sabar dan bertakwa."\n\nKetika kota Madinah menyambut kedatangan kaum Muhajirin, pemandangan luar biasa terjadi. Kaum Anshar menyambut mereka bukan dengan curiga, melainkan dengan pelukan persaudaraan yang tulus. Mereka membagi tempat tinggal, makanan, dan ladang kurma dengan penuh kerelaan. Persaudaraan yang dilandasi iman ini berhasil menyatukan suku-suku yang selama ratusan tahun sebelumnya saling berperang.\n\nSalma, seorang siswi yang menyimak di baris depan, mengacungkan tangannya: "Pak Guru, berarti persaudaraan sejati itu tidak memandang asal usul suku ya, Pak?" Pak Guru tersenyum bangga: "Tepat sekali Salma. Islam mengajarkan bahwa kita semua adalah satu tubuh, yang saling menguatkan dalam kebaikan dan takwa."`,
      storyMoral: [
        `Perjuangan menegakkan kebenaran membutuhkan keikhlasan, ketabahan, dan pengorbanan.`,
        `Persaudaraan sejati yang dilandasi iman dan kasih sayang mampu menyatukan perbedaan yang paling tajam sekalipun.`,
        `Pemimpin yang mulia adalah pemimpin yang paling rendah hati dan melayani sesama dengan adil.`,
      ],
      lkpdTitle: `Jejak Sejarah & Peta Keteladanan: ${cleanTitle}`,
      lkpdCase: `Studi Kasus Sejarah: Pada masa perjuangan dakwah nabi, beliau kerap dicaci maki, dilempari kotoran, dan ditawari harta melimpah agar menghentikan seruan kebenaran. Namun, nabi menolak tawaran tersebut dan justru mendoakan orang-orang yang menzaliminya agar mendapat hidayah.\n\nTugas Kelompok:\n1. Nilai karakter apa saja yang dapat kita teladani dari sikap nabi dalam menghadapi cacian dan rintangan tersebut?\n2. Bagaimana cara kalian menerapkan sikap sabar dan pemaaf tersebut jika diejek atau diperlakukan tidak adil oleh orang lain di sekolah?`,
      lkpdQuestions: [
        `Tuliskan garis waktu (*timeline*) peristiwa penting dalam sejarah ${cleanTitle}!`,
        `Sebutkan 3 sifat teladan utama tokoh sejarah yang kita pelajari hari ini beserta contoh perilakunya!`,
        `Rancanglah sebuah naskah bermain peran (*role play*) singkat berdurasi 3 menit yang memperagakan salah satu adegan inspiratif peristiwa ini!`,
      ],
      inquiryCards: [
        {
          title: 'Kartu 1 (Kecintaan kepada Rasul/Nabi)',
          prompt: `Bagaimana perasaan cintamu kepada Rasulullah saw. dan para sahabat setelah mengetahui beratnya pengorbanan mereka demi sampainya Islam kepada kita?`,
        },
        {
          title: 'Kartu 2 (Keteguhan Sikap)',
          prompt: `Apakah kamu berani membela temanmu yang diperlakukan tidak adil meskipun kamu ditentang oleh teman-teman yang lain?`,
        },
        {
          title: 'Kartu 3 (Jiwa Pemaaf)',
          prompt: `Siapakah orang yang pernah berbuat salah kepadamu yang ingin kamu maafkan dengan tulus hari ini seperti teladan nabi?`,
        },
        {
          title: 'Kartu 4 (Cita-cita Peradaban)',
          prompt: `Kebaikan besar apa yang ingin kamu persembahkan bagi agama, bangsa, dan negaramu saat kamu dewasa kelak?`,
        },
      ],
      parentGuideTasks: [
        `Membacakan atau menyimak kembali kisah teladan sejarah ${cleanTitle} bersama ananda sebelum tidur.`,
        `Mendiskusikan pesan moral dan keteladanan tokoh sejarah dalam menyelesaikan persoalan kehidupan sehari-hari.`,
        `Mengajarkan kecintaan kepada Rasulullah saw. dan para sahabat melalui lantunan selawat dan kisah inspiratif.`,
      ],
      parentHabitChecklist: [
        `Membaca selawat kepada Nabi Muhammad saw. setiap hari`,
        `Meneladani sifat sabar dan tidak membalas keburukan dengan keburukan`,
        `Suka memaafkan kesalahan teman dan saudara di rumah`,
        `Menjaga kerukunan dan tolong-menolong dengan tetangga sekitar`,
      ],
    };
  }

  // Default: Akhlak
  return {
    cleanTitle,
    domain,
    section1Title: 'Realitas Pergaulan & Urgensi Keluhuran Budi Pekerti (Context & Setting)',
    section2Title: 'Dalil Teladan Rasulullah saw. & Definisi Hakiki Sifat Mulia',
    section3Title: 'Analisis Konseptual Karakter Terpuji vs Bahaya Sifat Tercela Lawannya',
    section4Title: 'Manifestasi Multidimensi Karakter Luhur (Multi-dimensional Impact)',
    section5Title: 'Relevansi Masa Kini & Menjawab Krisis Adab Digital (Modern Relevance)',
    dalilText: 'وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ (QS. Al-Qalam: 4) & إِنَّمَا بُعِثْتُ لِأُتَمِّمَ مَكَارِمَ الْأَخْلَاقِ (HR. Ahmad & Baihaqi)',
    dalilMeaning: '"Dan sesungguhnya engkau (Muhammad) benar-benar berbudi pekerti yang luhur." (QS. Al-Qalam: 4) serta sabda Nabi saw.: "Sesungguhnya aku diutus hanyalah untuk menyempurnakan kemuliaan akhlak." (HR. Ahmad & Baihaqi)',
    contextAndSetting: `Pendidikan akhlak mulia mengenai ${cleanTitle} adalah muara dari seluruh rangkaian ibadah dan akidah dalam ajaran Islam (*makarim al-akhlaq*). Tanpa akhlak yang terpuji, ibadah seseorang kehilangan ruh dan manfaat sosialnya. Di tengah pergaulan masyarakat yang majemuk, penanaman ${cleanTitle} mendidik peserta didik agar memiliki kepekaan nurani, keluhuran budi pekerti, kejujuran bersikap, serta rasa hormat kepada yang lebih tua dan kasih sayang kepada yang lebih muda.`,
    conceptAnalysis: [
      {
        title: 'Hakikat & Kedudukan Sifat Mulia dalam Islam',
        points: [
          `Memahami bahwa akhlak terpuji (*akhlak mahmudah*) bukan sekadar kepura-puraan lahiriah, melainkan cerminan kebersihan hati dan ketulusan niat.`,
          `Mengenal dalil naqli dari Al-Qur'an dan Sunnah yang mewajibkan penerapan ${cleanTitle} dalam kehidupan sehari-hari.`,
          `Membedakan secara tegas antara perbuatan terpuji yang mendatangkan rida Allah dengan perbuatan tercela (*akhlak madzmumah*) yang merusak diri dan sesama.`,
        ],
      },
      {
        title: 'Bentuk-Bentuk Pengamalan Nyata di Sekolah, Rumah, & Masyarakat',
        points: [
          `Membiasakan budaya 5S: Senyum, Salam, Sapa, Sopan, dan Santun kepada guru, orang tua, dan seluruh warga sekolah.`,
          `Menunjukkan empati nyata: mendengarkan teman saat berbicara, menolong yang kesusahan tanpa pamrih, dan tidak mengejek kekurangan orang lain.`,
          `Menjaga lisan dari perkataan dusta, ghibah (menggunjing), mencaci, dan menyebarkan kabar bohong di dunia nyata maupun media sosial.`,
        ],
      },
      {
        title: 'Hikmah dan Keberkahan Akhlak Mulia',
        points: [
          `Mendapatkan kecintaan dari Allah Swt. dan dihormati oleh sesama manusia.`,
          `Menjadi pemberat timbangan amal kebaikan di hari kiamat (*tsaqil fil mizan*).`,
          `Mewujudkan lingkungan belajar yang aman, nyaman, inklusif, dan bebas dari perundungan (*bullying*).`,
        ],
      },
    ],
    multiDimensionalImpact: {
      keluarga: `Menunjukkan bakti (*birrul walidain*) kepada kedua orang tua, bertutur kata lembut, mencium tangan saat berpamitan, dan membantu pekerjaan rumah tangga.`,
      sosial: `Menjaga keharmonisan pertemanan tanpa membeda-bedakan latar belakang suku, agama, dan tingkat ekonomi, serta aktif tolong-menolong dalam kebaikan (*ta'awun*).`,
      lingkungan: `Merawat kebersihan lingkungan, tidak membuang sampah sembarangan, dan menyayangi binatang sebagai bentuk kasih sayang semesta (*rahmatan lil 'alamin*).`,
    },
    modernRelevance: `Di era digital dan media sosial yang rawan ujaran kebencian, perundungan siber (*cyberbullying*), dan penurunan adab, pengamalan ${cleanTitle} menjadi pelindung moral yang membimbing generasi muda agar tetap berintegritas, santun dalam berkomentar, dan bijak dalam bermedia sosial.`,
    storyTitle: `Bunga Kebaikan dan Senyuman di Kelas Ahmad`,
    storyBody: `Pagi yang cerah di SD Budi Luhur. Ahmad melangkah riang memasuki gerbang sekolah. Sambil tersenyum ramah, ia menyapa Pak Satpam dan mencium tangan Ibu Guru yang menyambut di depan pintu gerbang: "Assalamu'alaikum Ibu Guru, selamat pagi!"\n\nDi dalam kelas, suasana tiba-tiba menjadi riuh. Ternyata kotak pensil milik Wayan terjatuh dan pensil warnanya berserakan di bawah bangku. Beberapa anak tidak sengaja menendangnya saat berjalan. Wayan tampak panik dan membungkuk memungut pensilnya satu per satu dengan wajah sedih.\n\nMelihat hal itu, Ahmad tidak tinggal diam. Ia segera berlutut dan membantu Wayan memungut pensil-pensil yang berserakan dengan cekatan. Siti dan Danu yang melihat tindakan Ahmad segera ikut membantu. Dalam hitungan detik, seluruh pensil warna telah kembali tersusun rapi di dalam kotak pensil Wayan.\n\nWayan menatap Ahmad dan teman-temannya dengan mata berbinar penuh rasa terima kasih: "Ahmad, Siti, Danu, terima kasih banyak ya. Kalian sangat baik hati." Ahmad tersenyum tulus: "Sama-sama Wayan. Kita kan teman sekelas, sudah kewajiban kita untuk saling tolong-menolong dan menjaga perasaan satu sama lain."\n\nIbu Guru yang melihat peristiwa indah itu merasa bangga dan bersyukur: "Masya Allah anak-anakku, inilah cerminan akhlak mulia yang diajarkan Islam. Kebaikan kecil yang kalian lakukan dengan tulus adalah sedekah berharga yang memperindah suasana kelas kita."`,
    storyMoral: [
      `Menolong sesama tanpa pamrih adalah wujud nyata akhlak terpuji yang dicintai Allah Swt.`,
      `Sapaan yang ramah, senyuman hangat, dan tutur kata santun adalah sedekah yang paling mudah namun berharga.`,
      `Perbedaan latar belakang suku atau budaya tidak menjadi penghalang untuk saling menyayangi dan bekerja sama.`,
    ],
    lkpdTitle: `Penerapan Akhlak Mulia: ${cleanTitle}`,
    lkpdCase: `Studi Kasus Moral: Saat jam istirahat, kamu melihat seorang temanmu sedang diejek oleh beberapa murid lain karena nilai ulangannya kurang memuaskan dan pakaiannya terlihat basah terkena tumpahan kuah makanan. Teman tersebut tampak menahan tangis di sudut koridor.\n\nTugas Kelompok:\n1. Berdasarkan nilai luhur ${cleanTitle}, tindakan terpuji apa yang seharusnya kelompok kalian lakukan untuk menolong dan menghibur teman tersebut?\n2. Mengapa ajaran Islam melarang keras perbuatan mengejek, merendahkan, atau menindas sesama teman? Sebutkan akibat buruknya!`,
    lkpdQuestions: [
      `Tuliskan dalil hadis pokok tentang kemuliaan akhlak beserta artinya!`,
      `Sebutkan 3 contoh konkret penerapan ${cleanTitle} di lingkungan sekolah dan 3 contoh di lingkungan rumah!`,
      `Buatlah sebuah poster ajakan kebaikan (*campaign poster*) sederhana yang berisi pesan menolak perundungan dan mengutamakan kasih sayang!`,
    ],
    inquiryCards: [
      {
        title: 'Kartu 1 (Kebaikan Spontan)',
        prompt: `Kebaikan kecil apa yang sudah kamu lakukan hari ini yang membuat orang lain tersenyum bahagia?`,
      },
      {
        title: 'Kartu 2 (Adab Berteman)',
        prompt: `Apakah kamu selalu mendengarkan dengan penuh perhatian saat temanmu sedang berbicara atau mengemukakan pendapat?`,
      },
      {
        title: 'Kartu 3 (Bakti kepada Orang Tua)',
        prompt: `Kapan terakhir kali kamu memeluk dan mencium tangan kedua orang tuamu sambil berterima kasih atas kasih sayang mereka?`,
      },
      {
        title: 'Kartu 4 (Tantangan Akhlak Mulia)',
        prompt: `Tuliskan satu kebiasaan buruk yang ingin kamu tinggalkan mulai hari ini agar menjadi anak yang lebih saleh/salihah!`,
      },
    ],
    parentGuideTasks: [
      `Membiasakan budaya saling menyapa dengan salam dan senyuman di lingkungan keluarga setiap hari.`,
      `Memberikan contoh nyata tutur kata santun, tidak membentak, dan saling memaafkan saat terjadi perselisihan kecil di rumah.`,
      `Memberikan apresiasi dan pelukan hangat saat ananda menunjukkan sikap peduli, jujur, dan berbakti kepada orang tua.`,
    ],
    parentHabitChecklist: [
      `Mencium tangan orang tua saat hendak berangkat dan pulang sekolah`,
      `Berbicara lemah lembut dan tidak memotong pembicaraan orang tua`,
      `Membantu merapikan tempat tidur dan perlengkapan sekolah sendiri`,
      `Mendoakan kedua orang tua setiap selesai salat`,
    ],
  };
}

export function generateDeterministicRpp(
  atp: MasterAtpRecord,
  options: GenerationOptions
): string {
  const k = analyzeTopic(atp);
  const duration = options.duration || '1 x 3 jam pelajaran (105 Menit)';
  const strategy = options.pedagogicalStrategy || 'Storytelling Reflektif, Inkuiri Terbimbing, & Diskusi Kasus';
  const digitalTool = options.digitalTool || 'Canva Edukasi, Google Slides, Padlet';

  return `### PERENCANAAN PEMBELAJARAN
**[Mata Pelajaran: Pendidikan Agama Islam dan Budi Pekerti]**
**[${atp.fase}] [${atp.target_kelas}]**

* **Satuan Pendidikan**: Sekolah Dasar (SD)
* **Kelas / Semester**: ${atp.target_kelas} / Semester 1 & 2
* **Elemen Pembelajaran**: ${atp.elemen}
* **Materi Pokok**: ${k.cleanTitle}
* **Alokasi Waktu**: ${duration}

#### Dimensi Profil Lulusan / Profil Pelajar Pancasila
* **Keimanan dan Ketakwaan terhadap Tuhan YME & Berakhlak Mulia**:
  - Peserta didik mengawali dan mengakhiri kegiatan belajar dengan berdoa khusyuk: *"Rabbi zidnii 'ilmaa warzuqnii fahmaa"*.
  - Menumbuhkan rasa syukur dan takzim atas petunjuk Allah Swt. dalam materi ${k.cleanTitle}.
  - Meneladani akhlak Rasulullah saw. dengan membiasakan tutur kata santun dan kasih sayang antarsesama.
* **Penalaran Kritis**:
  - Mengidentifikasi dalil, pesan moral, dan hikmah mendalam yang terkandung dalam ${k.cleanTitle}.
  - Menganalisis studi kasus nyata di lingkungan sekolah dan menemukan solusi bijak berbasis nilai-nilai Islam.
  - Membedakan perbuatan yang diridai Allah dan perbuatan tercela dengan argumentasi yang santun dan logis.
* **Kreativitas**:
  - Mengekspresikan pemahaman materi melalui karya visual kreatif (poster digital/infografis Canva, peta konsep, atau komik mini).
  - Menyusun dan memperagakan simulasi bermain peran (*role-play*) penerapan materi dalam pergaulan sehari-hari.
* **Kolaborasi / Gotong Royong**:
  - Bekerja sama secara aktif, setara, dan inklusif dalam kelompok kecil untuk menuntaskan lembar kerja (*LKPD*).
  - Saling berbagi tugas, menyimak pendapat teman dengan takzim, serta saling menguatkan dalam kebaikan (*ta'awun*).

#### Dimensi Panca Cinta
* **Cinta kepada Allah dan Rasul-Nya**:
  - Menjadikan firman Allah Swt. dan sunnah Rasulullah saw. sebagai pedoman utama berperilaku dan berniat ikhlas dalam setiap tindakan.
* **Cinta Ilmu**:
  - Menumbuhkan gairah membaca (*iqra'*), rasa ingin tahu mendalam, dan ketekunan mempelajari ajaran Islam sebagai bekal masa depan.
* **Cinta Diri dan Sesama Manusia**:
  - Menghargai martabat diri sendiri sebagai hamba Allah dan memperlakukan sesama dengan belas kasih, keadilan, serta toleransi (*tasamuh*).
* **Cinta Tanah Air dan Lingkungan**:
  - Menjaga kerukunan dalam kebinekaan bangsa Indonesia dan merawat kelestarian alam sebagai amanah khalifah fil ardh.

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
* **Peran Guru**: Fasilitator inspiratif yang menuntun (*scaffolding*), menyajikan narasi bermakna, dan memantik nalar kritis peserta didik.
* **Diferensiasi Pembelajaran**:
  - *Diferensiasi Konten*: Menyediakan bahan ajar terstruktur, teks dalil berjenjang, dan kartu bergambar pemantik.
  - *Diferensiasi Proses*: Pendampingan intensif bagi murid yang memerlukan bimbingan khusus dan tantangan inkuiri bagi murid cepat tanggap.
  - *Diferensiasi Produk*: Memberikan kebebasan bentuk penyajian hasil karya kelompok (poster visual, naskah bermain peran, atau buklet resume).

#### Kemitraan Pembelajaran
* Melibatkan orang tua/wali melalui lembar dialog keluarga (*Family Dialogue Sheet*) dan pembiasaan ibadah harian di rumah yang tercantum pada **Bagian 2: Panduan Kemitraan Orang Tua**.

#### Lingkungan Pembelajaran
* **Ruang Fisik**: Pengaturan meja belajar kelompok melingkar (*round table*) guna mendorong partisipasi aktif dan interaksi hangat.
* **Ruang Virtual**: Memanfaatkan proyektor/layar digital untuk menayangkan visual materi, kuis interaktif, dan lembar kerja daring.
* **Budaya Belajar**: Membudayakan 5S (Senyum, Salam, Sapa, Sopan, Santun), menyimak saat teman berbicara, dan berani berpendapat.

#### Pemanfaatan Digital
* Media presentasi interaktif Canva / Slide Edukasi untuk visualisasi dalil dan konsep materi.
* Platform kolaborasi kreatif: ${digitalTool}.

---
*Perencanaan Pembelajaran Mendalam*

#### Langkah-langkah Pembelajaran

##### A. Kegiatan Pendahuluan (15 Menit)
* **Pengondisian Spiritual & Pembukaan Kelas**:
  - Guru mengucapkan salam islami yang hangat dan menyapa seluruh murid dengan senyuman penuh perhatian (*caring presence*).
  - Salah seorang murid memimpin doa sebelum belajar dengan khusyuk (*"Rabbi zidnii 'ilmaa warzuqnii fahmaa"*).
  - Melafalkan ayat suci Al-Qur'an atau Asmaul Husna secara bersama-sama untuk mengondisikan ketenangan batin kelas (*tahsinul qira'ah*).
* **Presensi & Pengondisian Kelas Empatis**:
  - Mengecek kehadiran siswa sambil melakukan *emotional check-in* (menanyakan kabar dan perasaan hati murid hari ini dengan stiker ekspresi).
  - Memastikan kerapian seragam, kebersihan lantai di sekitar meja, serta kesiapan buku dan alat tulis.
* **Apersepsi Berdiferensiasi & Motivasi Belajar**:
  - Guru mengaitkan pembelajaran pekan lalu dengan pengalaman nyata murid di rumah terkait topik ${k.cleanTitle}.
  - Menyampaikan Tujuan Pembelajaran (TP) dengan bahasa ramah anak: *"Hari ini kita akan menjelajah dan mendalami ${k.cleanTitle} agar kita menjadi anak yang dicintai Allah dan teman-teman."*
  - Melakukan *ice-breaking* ceria islami (Tepuk Anak Saleh / Tepuk Cinta Rasul) untuk menyalakan semangat dan konsentrasi belajar.

##### B. Kegiatan Inti (75 Menit)

###### Tahap 1: Memahami (Eksplorasi Awal & Mindful) — 20 Menit
* **Aktivitas Mindful Moment (Latihan Kesadaran Penuh & Hening Sejenak)**:
  - Guru memandu teknik hening sejenak **STOP** (*Stop, Take a breath, Observe, Proceed*) untuk menghadirkan konsentrasi penuh.
  - Murid diajak merenungkan nikmat Allah Swt., menyadari keteraturan napas, dan menyiapkan pikiran yang jernih untuk menerima ilmu.
* **Penyampaian Narasi & Media Pemantik (Terhubung Langsung ke Bahan Ajar)**:
  - Guru menceritakan kisah inspiratif **"${k.storyTitle}"** yang tercantum lengkap pada **Bagian 2: Lembar Skenario Cerita**.
  - Guru membacakan dalil pokok: **${k.dalilText}** beserta artinya, murid menyimak secara seksama (*istima'*), lalu mengulangi pelafalan dengan tartil.
  - Guru menampilkan gambar atau infografis pemantik yang menggambarkan situasi nyata terkait ${k.cleanTitle}.
* **Inkuiri Kritis & Pertanyaan Pemantik (HOTS)**:
  - Guru mengajukan pertanyaan pemantik tingkat tinggi:
    - *"Mengapa Allah Swt. dan Rasulullah saw. memerintahkan kita untuk mengamalkan ${k.cleanTitle}?"*
    - *"Apa dampaknya bagi suasana kelas dan keluarga kita jika nilai ini tidak kita terapkan?"*
  - Murid diberi waktu berpikir mandiri (*think*), berpasangan mendiskusikan jawaban (*pair*), lalu berbagi gagasan di kelas (*share*).

###### Tahap 2: Mengaplikasikan (Kolaborasi Kelompok & Joyful) — 35 Menit
* **Pembentukan Kelompok & Diferensiasi Pembelajaran**:
  - Murid dibagi ke dalam kelompok heterogen (4-5 murid per kelompok) dengan pembagian peran terstruktur (Ketua, Pencatat, Desainer, Juru Bicara).
  - Guru menyediakan opsi diferensiasi produk sesuai minat: Kelompok Visual (poster/infografis), Kelompok Kinestetik/Verbal (simulasi bermain peran), dan Kelompok Literasi (komik mini/resume berhikmah).
* **Pengerjaan Lembar Kerja Peserta Didik (LKPD)**:
  - Setiap kelompok menerima **LKPD Aplikatif: ${k.lkpdTitle}** sebagaimana tercantum lengkap pada **Bagian 2: Lembar Kerja Peserta Didik**.
  - Murid mendiskusikan studi kasus nyata: *${k.lkpdCase.slice(0, 120)}...* dan menyusun solusi kreatif bersama tim.
* **Fasilitasi Guru & Scaffolding**:
  - Guru berkeliling mengunjungi setiap kelompok, mengamati dinamika kerja sama, memberikan pendampingan bagi yang kesulitan, dan memberikan penguatan positif.
  - Menyelipkan *energizer* singkat bernuansa riang untuk menjaga suasana tetap ceria dan bersemangat (*joyful learning*).

###### Tahap 3: Merefleksikan (Presentasi, Peer Feedback, & Meaningful) — 20 Menit
* **Pameran Karya & Uji Publik (Gallery Walk & Showcase)**:
  - Setiap kelompok memamerkan hasil karyanya di dinding/meja kelas melalui teknik *Gallery Walk*.
  - Anggota kelompok berkunjung ke stan kelompok lain, menyimak penjelasan, serta memberikan stiker bintang apresiasi dan umpan balik santun (*peer feedback*).
  - Kelompok bermain peran menampilkan simulasi di depan kelas dengan durasi 3 menit disambut tepuk tangan hangat.
* **Konfirmasi & Penguatan Konsep oleh Guru**:
  - Guru mengapresiasi dedikasi seluruh murid, meluruskan miskonsepsi (jika ada), dan mempertegas kesimpulan pokok materi secara runtut.
* **Refleksi Batin Mendalam (Meaningful Connection)**:
  - Setiap murid mengisi **Kartu Inkuiri & Refleksi Batin Pribadi** yang tercantum pada **Bagian 2: Kartu Inkuiri**.
  - Murid merenungkan pertanyaan refleksi diri: *"Setelah mempelajari materi ini, satu kebaikan nyata apa yang akan saya lakukan mulai hari ini?"*
  - Murid menempelkan kartu komitmen di **Pohon Kebaikan Kelas**.

##### C. Kegiatan Penutup (15 Menit)
* **Penyimpulan Bersama**:
  - Guru bersama murid merangkum intisari pembelajaran dalam 3 poin emas (*three key takeaways*).
* **Asesmen Formatif Akhir**:
  - Kuis cepat 2-3 pertanyaan lisan/refleksi untuk memetakan ketercapaian tujuan pembelajaran hari ini.
* **Tindak Lanjut & Pembiasaan di Rumah**:
  - Guru membagikan lembar **Panduan Kemitraan Orang Tua & Pembiasaan di Rumah** (Bagian 2) untuk diamalkan bersama keluarga di rumah.
  - Menginformasikan topik pembelajaran untuk pertemuan berikutnya.
* **Doa Penutup & Berpamitan Santun**:
  - Membaca doa *Kafaratul Majelis* bersama-sama: *"Subhaanaka Allaahumma wabihamdika, asyhadu allaa ilaaha illaa Anta, astaghfiruka wa atuubu ilaik"*.
  - Menutup dengan salam dan saling bersalaman dengan guru penuh takzim.

---
*Pusat Kurikulum dan Pembelajaran*

#### Asesmen Pembelajaran
* **Asesmen Formatif Awal (Diagnostik)**: Pertanyaan lisan pemantik untuk memetakan kesiapan dan pemahaman awal murid tentang ${k.cleanTitle}.
* **Asesmen Formatif Proses (Berkala)**: Lembar observasi keaktifan diskusi kelompok dan penilaian antarteman (*peer assessment*) saat Gallery Walk.
* **Asesmen Sumatif Lingkup Materi (Produk & Unjuk Kerja)**: Penilaian produk karya kelompok berdasarkan rubrik holistik dan lembar refleksi individu.

#### Tindak Lanjut Pembelajaran
* **Pengayaan**: Tugas inkuiri lanjutan bagi murid berkemampuan tinggi untuk meneliti kisah atau dalil tambahan dan menyusun artikel pendek/vlog edukasi.
* **Remedial**: Bimbingan perorangan terfokus (*scaffolding*) atau tutor sebaya dengan media visual pendukung bagi murid yang belum mencapai kriteria ketuntasan.

#### Rubrik Penilaian Holistik

##### 1. Rubrik Penilaian Produk Kolaboratif Kelompok (${k.cleanTitle})
| Aspek Penilaian | Sangat Berkembang (Skor 4) | Cakap (Skor 3) | Berkembang (Skor 2) | Baru Memulai (Skor 1) |
| :--- | :--- | :--- | :--- | :--- |
| **Ketepatan Konsep & Dalil** | Memuat seluruh konsep ${k.cleanTitle} secara utuh, benar, mendalam, dan relevan dengan dalil syariat. | Memuat sebagian besar konsep materi dengan tepat dan benar. | Konsep materi cukup, namun masih terdapat 1-2 bagian yang kurang tepat. | Konsep materi belum jelas dan banyak terdapat kekeliruan konsep. |
| **Kreativitas & Estetika** | Desain visual sangat memikat, orisinal, rapi, perpaduan warna harmonis, dan mudah dipahami. | Desain menarik, pesan terbaca jelas, dan tata letak rapi. | Desain cukup sederhana, kerapian masih perlu ditingkatkan. | Desain kurang rapi, pesan sulit terbaca atau tidak terorganisir. |
| **Dinamika Kolaborasi** | Semua anggota aktif berkontribusi, saling membantu, menghargai peran, dan kerja tim solid. | Sebagian besar anggota aktif berkontribusi dengan pembagian tugas yang baik. | Hanya separuh anggota yang aktif bekerja, koordinasi kurang lancar. | Dikerjakan sepihak oleh 1–2 orang saja, tidak terlihat kerja sama. |
| **Keterampilan Presentasi** | Penyampaian sangat percaya diri, artikulasi jelas, bahasa santun, dan mampu menjawab pertanyaan dengan tepat. | Penyampaian jelas, cukup percaya diri, dan komunikatif. | Penyampaian ragu-ragu, artikulasi kurang jelas, atau membaca catatan terus. | Tidak percaya diri, suara tidak terdengar, dan pasif saat ditanya. |

##### 2. Rubrik Penilaian Refleksi Batin Individu
| Aspek Penilaian | Sangat Berkembang (Skor 4) | Cakap (Skor 3) | Berkembang (Skor 2) | Baru Memulai (Skor 1) |
| :--- | :--- | :--- | :--- | :--- |
| **Kedalaman Pemahaman** | Menguraikan hikmah ${k.cleanTitle} dengan sangat mendalam dan mengaitkannya dengan pengalaman nyata. | Menyebutkan hikmah materi dengan tepat dan memberikan contoh keseharian. | Menuliskan intisari materi secara umum tanpa kaitan kehidupan nyata. | Belum mampu mengidentifikasi hikmah utama materi pembelajaran. |
| **Komitmen Aksi Nyata** | Menuliskan rencana tindakan konkret yang terukur, realistis, dan berorientasi pembiasaan akhlak mulia. | Menuliskan rencana tindakan nyata yang baik namun masih bersifat umum. | Menuliskan tekad kebaikan secara singkat tanpa langkah konkret. | Tidak menuliskan komitmen atau hanya menyalin tulisan teman. |

---

## BAGIAN 2: PAKET MATERI & BAHAN AJAR LENGKAP

### 1. Materi Utama & Bahan Ajar Mendalam (Struktur 5 Bagian Eksploratif)
**Mendalami dan Menghayati: ${k.cleanTitle}**

#### 1. ${k.section1Title}
- ${k.contextAndSetting}

#### 2. ${k.section2Title}
- **Lafal Dalil Naqli**: ${k.dalilText}
- **Terjemahan & Makna Otentik**: ${k.dalilMeaning}

#### 3. ${k.section3Title}
${k.conceptAnalysis
  .map(
    (c, i) => `##### ${i + 1}. ${c.title}
${c.points.map((p) => `- ${p}`).join('\n')}`
  )
  .join('\n\n')}

#### 4. ${k.section4Title}
- **Dimensi Keluarga**:
  - ${k.multiDimensionalImpact.keluarga}
- **Dimensi Sosial & Keanekaragaman**:
  - ${k.multiDimensionalImpact.sosial}
- **Dimensi Lingkungan & Ekologi**:
  - ${k.multiDimensionalImpact.lingkungan}

#### 5. ${k.section5Title}
- **Menjawab Tantangan Masa Kini**:
  - ${k.modernRelevance}
- **Simpulan Menggerakkan**:
  - Mempelajari dan mengamalkan ${k.cleanTitle} bukan sekadar menghafal teori di kelas, melainkan menghidupkan kembali mutiara ajaran suci dalam setiap tarikan napas, tutur kata santun, dan karya nyata kita hari ini.

---

### 2. Lembar Skenario Cerita / Media Pemantik Pembelajaran
*(Naskah Narasi Lengkap Guru saat Langkah Eksplorasi Awal & Mindful)*

**Judul Cerita: "${k.storyTitle}"**

${k.storyBody}

**Pesan Moral Cerita:**
${k.storyMoral.map((m) => `- ${m}`).join('\n')}

---

### 3. Lembar Kerja Peserta Didik (LKPD) Aplikatif
**Mata Pelajaran**: Pendidikan Agama Islam dan Budi Pekerti  
**Materi / Fase**: ${k.cleanTitle} / ${atp.fase} (${atp.target_kelas})  
**Judul LKPD**: ${k.lkpdTitle}  
**Nama Kelompok**: __________________________________________  
**Nama Anggota Kelompok**:  
1. _________________________________ (Ketua)  
2. _________________________________ (Pencatat)  
3. _________________________________ (Desainer)  
4. _________________________________ (Juru Bicara)  
5. _________________________________ (Anggota)  

#### A. Petunjuk Pengerjaan:
1. Bacalah basmalah sebelum memulai kegiatan kelompok.
2. Cermati teks materi pokok dan kisah inspiratif **"${k.storyTitle}"**.
3. Diskusikan studi kasus nyata di bawah ini bersama anggota kelompokmu secara kompak dan santun.
4. Buatlah produk karya kreatif kelompok sesuai pilihan (Poster Visual / Naskah Simulasi Peran / Buklet Resume).

#### B. Studi Kasus Nyata:
*Kasus Nyata*: ${k.lkpdCase}

#### C. Pertanyaan Analisis & Pemecahan Masalah:
${k.lkpdQuestions.map((q, idx) => `${idx + 1}. ${q}`).join('\n')}

#### D. Lembar Desain Karya Kreatif Kelompok:
*(Gambarkan sketsa poster atau tuliskan naskah dialog singkat di kotak berikut)*
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

---

### 4. Kartu Inkuiri & Refleksi Batin Pribadi
*(Gunting dan simpanlah kartu ini sebagai pengingat komitmen akhlakmu)*

${k.inquiryCards
  .map(
    (card) => `* **${card.title}**:
  *"${card.prompt}"*`
  )
  .join('\n')}

---

### 5. Panduan Kemitraan Orang Tua & Pembiasaan di Rumah
*Assalamu'alaikum Warahmatullahi Wabarakatuh*  
Yth. Bapak/Ibu Orang Tua / Wali Peserta Didik di Rumah,

Hari ini putra/putri tercinta kita di kelas ${atp.target_kelas} telah mempelajari materi mulia tentang: **"${k.cleanTitle}"**.  
Ilmu yang diajarkan di sekolah hanya akan berakar kuat apabila dipupuk dan dicontohkan secara nyata dalam kehidupan keluarga di rumah.

**Panduan Kegiatan Bersama di Rumah**:
${k.parentGuideTasks.map((t, idx) => `${idx + 1}. ${t}`).join('\n')}

**Lembar Pemantauan Pembiasaan Rumah (Mohon Diparaf & Dikembalikan ke Guru)**:
* Nama Peserta Didik: __________________________________________________
* Hari / Tanggal: _____________________________________________________
* Checklist Pembiasaan:
${k.parentHabitChecklist.map((ch) => `  - [ ] ${ch}`).join('\n')}
* Catatan Kasih Sayang Orang Tua:  
  ____________________________________________________________________  
* Tanda Tangan Orang Tua / Wali: ( ___________________________ )`;
}
