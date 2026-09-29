import pptxgen from 'pptxgenjs';
import { MasterAtpRecord, SignatoryConfig } from '../types';

export async function exportToPowerPoint(
  title: string,
  atpData: MasterAtpRecord,
  signatoryConfig: SignatoryConfig,
  splitSections?: {
    summaryMateri?: string;
    lkpd?: string;
    kartuInkuiri?: string;
    kemitraan?: string;
  }
) {
  const pptx = new pptxgen();

  // Set presentation properties
  pptx.layout = 'LAYOUT_16x9';
  pptx.title = `Bahan Ajar PPT - ${atpData.elemen} ${atpData.target_kelas}`;
  pptx.author = signatoryConfig.teacherName || 'Guru PAI & BP';
  pptx.company = signatoryConfig.schoolName || 'Kementerian Pendidikan & Kebudayaan';

  const TEAL_PRIMARY = '0F766E';
  const TEAL_DARK = '134E4A';
  const TEAL_LIGHT = 'F0FDFA';
  const AMBER_ACCENT = 'D97706';
  const SLATE_DARK = '0F172A';
  const SLATE_MUTED = '475569';
  const WHITE = 'FFFFFF';

  // ==========================================
  // SLIDE 1: Title Slide (Cover Islami Modern)
  // ==========================================
  const slide1 = pptx.addSlide();
  slide1.background = { color: TEAL_DARK };

  // Decorative Accent bar
  slide1.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 0.4,
    h: 7.5,
    fill: { color: AMBER_ACCENT },
    line: { color: AMBER_ACCENT },
  });

  slide1.addText('PENDIDIKAN AGAMA ISLAM & BUDI PEKERTI', {
    x: 0.8,
    y: 1.0,
    w: 11.5,
    h: 0.5,
    fontSize: 14,
    bold: true,
    color: AMBER_ACCENT,
    fontFace: 'Calibri',
    charSpacing: 2,
  });

  slide1.addText(`${atpData.elemen} · ${atpData.target_kelas} (${atpData.fase})`, {
    x: 0.8,
    y: 1.6,
    w: 11.5,
    h: 1.0,
    fontSize: 28,
    bold: true,
    color: WHITE,
    fontFace: 'Calibri',
  });

  // Goal box
  slide1.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 2.8,
    w: 11.5,
    h: 1.8,
    fill: { color: '1A5D57' },
    line: { color: '2DD4BF', width: 1 },
    rectRadius: 0.1,
  });

  slide1.addText('TUJUAN PEMBELAJARAN (TP):', {
    x: 1.1,
    y: 3.0,
    w: 11.0,
    h: 0.35,
    fontSize: 11,
    bold: true,
    color: '5EEAD4',
    fontFace: 'Calibri',
  });

  slide1.addText(atpData.tujuan_pembelajaran, {
    x: 1.1,
    y: 3.4,
    w: 11.0,
    h: 1.0,
    fontSize: 14,
    color: WHITE,
    fontFace: 'Calibri',
    lineSpacing: 20,
  });

  // Footer metadata
  slide1.addText(
    `${signatoryConfig.schoolName || 'Satuan Pendidikan'} | Pengampu: ${signatoryConfig.teacherName} (NIP. ${signatoryConfig.teacherNip})`,
    {
      x: 0.8,
      y: 6.5,
      w: 11.5,
      h: 0.4,
      fontSize: 11,
      color: '99F6E4',
      fontFace: 'Calibri',
    }
  );

  // ==========================================
  // SLIDE 2: Capaian & Alur Pembelajaran
  // ==========================================
  const slide2 = pptx.addSlide();
  slide2.background = { color: 'F8FAFC' };

  // Header banner
  slide2.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.33,
    h: 1.0,
    fill: { color: TEAL_PRIMARY },
  });
  slide2.addText('Fondasi Kurikulum: Capaian & Alur Pembelajaran', {
    x: 0.8,
    y: 0.25,
    w: 11.5,
    h: 0.5,
    fontSize: 20,
    bold: true,
    color: WHITE,
    fontFace: 'Calibri',
  });

  // Card Left: CP
  slide2.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 1.4,
    w: 5.6,
    h: 5.2,
    fill: { color: WHITE },
    line: { color: 'CBD5E1', width: 1 },
    rectRadius: 0.1,
  });
  slide2.addText('CAPAIAN PEMBELAJARAN (CP)', {
    x: 1.1,
    y: 1.7,
    w: 5.0,
    h: 0.4,
    fontSize: 14,
    bold: true,
    color: TEAL_PRIMARY,
  });
  slide2.addText(atpData.capaian_pembelajaran, {
    x: 1.1,
    y: 2.2,
    w: 5.0,
    h: 4.0,
    fontSize: 12,
    color: SLATE_DARK,
    lineSpacing: 20,
  });

  // Card Right: ATP
  slide2.addShape(pptx.ShapeType.roundRect, {
    x: 6.8,
    y: 1.4,
    w: 5.7,
    h: 5.2,
    fill: { color: WHITE },
    line: { color: 'CBD5E1', width: 1 },
    rectRadius: 0.1,
  });
  slide2.addText(`ALUR TUJUAN PEMBELAJARAN (ATP #${atpData.no_atp})`, {
    x: 7.1,
    y: 1.7,
    w: 5.1,
    h: 0.4,
    fontSize: 14,
    bold: true,
    color: AMBER_ACCENT,
  });
  slide2.addText(
    [
      { text: 'Alur Kegiatan Pokok:\n', options: { bold: true } },
      { text: `${atpData.alur_tujuan_pembelajaran || atpData.tujuan_pembelajaran}\n\n` },
      { text: 'Target Fase / Kelas:\n', options: { bold: true } },
      { text: `${atpData.fase} - ${atpData.target_kelas}\n\n` },
      { text: 'Elemen Pendidikan Agama Islam:\n', options: { bold: true } },
      { text: `${atpData.elemen}` },
    ],
    {
      x: 7.1,
      y: 2.2,
      w: 5.1,
      h: 4.0,
      fontSize: 12,
      color: SLATE_DARK,
      lineSpacing: 18,
    }
  );

  // ==========================================
  // SLIDE 3: Dimensi Profil Pelajar & Panca Cinta
  // ==========================================
  const slide3 = pptx.addSlide();
  slide3.background = { color: 'F8FAFC' };

  slide3.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.33,
    h: 1.0,
    fill: { color: TEAL_PRIMARY },
  });
  slide3.addText('Karakter: Profil Pelajar & Dimensi Panca Cinta', {
    x: 0.8,
    y: 0.25,
    w: 11.5,
    h: 0.5,
    fontSize: 20,
    bold: true,
    color: WHITE,
    fontFace: 'Calibri',
  });

  // Box 1: Profil Pelajar Pancasila
  slide3.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 1.4,
    w: 5.6,
    h: 5.2,
    fill: { color: WHITE },
    line: { color: 'CBD5E1', width: 1 },
    rectRadius: 0.1,
  });
  slide3.addText('PROFIL PELAJAR PANCASILA', {
    x: 1.1,
    y: 1.7,
    w: 5.0,
    h: 0.4,
    fontSize: 14,
    bold: true,
    color: TEAL_PRIMARY,
  });
  slide3.addText(
    [
      { text: '• Beriman & Bertakwa kepada Tuhan YME:\n', options: { bold: true } },
      { text: '  Menghayati nilai spiritual materi sebagai wujud ketaatan ibadah.\n\n' },
      { text: '• Penalaran Kritis:\n', options: { bold: true } },
      { text: '  Menganalisis sebab-akibat, membedakan benar-salah, & berargumen santun.\n\n' },
      { text: '• Kreativitas:\n', options: { bold: true } },
      { text: '  Mengekspresikan hikmah pelajaran lewat karya visual & bermain peran.\n\n' },
      { text: '• Gotong Royong / Kolaborasi:\n', options: { bold: true } },
      { text: '  Saling membantu dalam kelompok tanpa membedakan latar belakang.' },
    ],
    {
      x: 1.1,
      y: 2.2,
      w: 5.0,
      h: 4.2,
      fontSize: 11,
      color: SLATE_DARK,
      lineSpacing: 16,
    }
  );

  // Box 2: Dimensi Panca Cinta
  slide3.addShape(pptx.ShapeType.roundRect, {
    x: 6.8,
    y: 1.4,
    w: 5.7,
    h: 5.2,
    fill: { color: WHITE },
    line: { color: 'CBD5E1', width: 1 },
    rectRadius: 0.1,
  });
  slide3.addText('DIMENSI PANCA CINTA ISLAMI', {
    x: 7.1,
    y: 1.7,
    w: 5.1,
    h: 0.4,
    fontSize: 14,
    bold: true,
    color: AMBER_ACCENT,
  });
  slide3.addText(
    [
      { text: '1. Cinta kepada Allah & Rasul-Nya:\n', options: { bold: true } },
      { text: '   Menjadikan syariat dan akhlak Rasulullah saw. sebagai pedoman utama.\n\n' },
      { text: '2. Cinta Ilmu:\n', options: { bold: true } },
      { text: '   Rasa haus akan kebenaran dan tekun membaca serta mendalami hikmah.\n\n' },
      { text: '3. Cinta Diri & Sesama Manusia:\n', options: { bold: true } },
      { text: '   Menjaga kehormatan diri dan menebar kasih sayang bagi seluruh makhluk.\n\n' },
      { text: '4. Cinta Tanah Air & Lingkungan:\n', options: { bold: true } },
      { text: '   Menjaga kedamaian keragaman bangsa serta merawat kelestarian alam.' },
    ],
    {
      x: 7.1,
      y: 2.2,
      w: 5.1,
      h: 4.2,
      fontSize: 11,
      color: SLATE_DARK,
      lineSpacing: 16,
    }
  );

  // ==========================================
  // SLIDE 4: Skenario 1 - Mindful Moment
  // ==========================================
  const slide4 = pptx.addSlide();
  slide4.background = { color: 'F8FAFC' };

  slide4.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.33,
    h: 1.0,
    fill: { color: TEAL_PRIMARY },
  });
  slide4.addText('Tahap 1: Memahami (Eksplorasi Awal & Mindful)', {
    x: 0.8,
    y: 0.25,
    w: 11.5,
    h: 0.5,
    fontSize: 20,
    bold: true,
    color: WHITE,
    fontFace: 'Calibri',
  });

  slide4.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 1.4,
    w: 11.7,
    h: 5.2,
    fill: { color: WHITE },
    line: { color: 'CBD5E1', width: 1 },
    rectRadius: 0.1,
  });

  slide4.addText(
    [
      { text: 'Aktivitas 1: Mindful Moment (Penyadaran Diri Penuh)\n', options: { bold: true, fontSize: 13, color: TEAL_PRIMARY } },
      { text: '• Murid diajak hening sejenak dengan teknik STOP (Stop, Take a breath, Observe, Proceed).\n' },
      { text: '• Menyadarkan nikmat bernapas, akal budi, dan kesempatan belajar dari Allah Swt.\n\n' },
      { text: 'Aktivitas 2: Penyampaian Narasi / Media Pemantik\n', options: { bold: true, fontSize: 13, color: TEAL_PRIMARY } },
      { text: '• Guru menayangkan video / membacakan kisah inspiratif yang menggugah emosi positif murid.\n' },
      { text: '• Membacakan dalil pokok dengan tartil dan mengaitkannya dengan peristiwa nyata di lingkungan anak.\n\n' },
      { text: 'Aktivitas 3: Pertanyaan Pemantik & Inkuiri Kritis (HOTS)\n', options: { bold: true, fontSize: 13, color: TEAL_PRIMARY } },
      { text: '• "Mengapa Allah menciptakan kita beraneka ragam dan bagaimana sikap terbaik kita?"\n' },
      { text: '• Murid menuliskan rasa ingin tahu mereka pada kartu inkuiri untuk dibahas bersama kelompok.' },
    ],
    {
      x: 1.2,
      y: 1.7,
      w: 11.0,
      h: 4.6,
      fontSize: 12,
      color: SLATE_DARK,
      lineSpacing: 18,
    }
  );

  // ==========================================
  // SLIDE 5: Skenario 2 - Kolaborasi Joyful
  // ==========================================
  const slide5 = pptx.addSlide();
  slide5.background = { color: 'F8FAFC' };

  slide5.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.33,
    h: 1.0,
    fill: { color: TEAL_PRIMARY },
  });
  slide5.addText('Tahap 2: Mengaplikasikan (Kolaborasi Kelompok & Joyful)', {
    x: 0.8,
    y: 0.25,
    w: 11.5,
    h: 0.5,
    fontSize: 20,
    bold: true,
    color: WHITE,
    fontFace: 'Calibri',
  });

  slide5.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 1.4,
    w: 11.7,
    h: 5.2,
    fill: { color: WHITE },
    line: { color: 'CBD5E1', width: 1 },
    rectRadius: 0.1,
  });

  slide5.addText(
    [
      { text: '1. Pembagian Tim Berdiferensiasi Produk (4-5 Murid per Tim):\n', options: { bold: true, fontSize: 13, color: AMBER_ACCENT } },
      { text: '• Tim Visual: Mendesain Poster / Infografis nilai materi di Canva / kertas manila bergambar.\n' },
      { text: '• Tim Verbal/Kinestetik: Bermain peran (role-play) simulasi adab dan tolong-menolong.\n' },
      { text: '• Tim Literasi: Menyusun rangkuman hikmah dan komitmen aksi nyata sehari-hari.\n\n' },
      { text: '2. Pengerjaan Lembar Kerja Peserta Didik (LKPD):\n', options: { bold: true, fontSize: 13, color: AMBER_ACCENT } },
      { text: '• Setiap kelompok mendiskusikan studi kasus nyata yang tertuang di lembar LKPD.\n' },
      { text: '• Guru hadir sebagai fasilitator (scaffolding), membimbing kelompok yang memerlukan panduan tambahan.\n\n' },
      { text: '3. Prinsip Joyful Learning:\n', options: { bold: true, fontSize: 13, color: AMBER_ACCENT } },
      { text: '• Suasana kelas penuh semangat, antusiasme, saling mengapresiasi ide, dan bebas dari rasa cemas.' },
    ],
    {
      x: 1.2,
      y: 1.7,
      w: 11.0,
      h: 4.6,
      fontSize: 12,
      color: SLATE_DARK,
      lineSpacing: 18,
    }
  );

  // ==========================================
  // SLIDE 6: Skenario 3 - Refleksi Meaningful
  // ==========================================
  const slide6 = pptx.addSlide();
  slide6.background = { color: 'F8FAFC' };

  slide6.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.33,
    h: 1.0,
    fill: { color: TEAL_PRIMARY },
  });
  slide6.addText('Tahap 3: Merefleksikan (Presentasi & Meaningful Learning)', {
    x: 0.8,
    y: 0.25,
    w: 11.5,
    h: 0.5,
    fontSize: 20,
    bold: true,
    color: WHITE,
    fontFace: 'Calibri',
  });

  slide6.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 1.4,
    w: 11.7,
    h: 5.2,
    fill: { color: WHITE },
    line: { color: 'CBD5E1', width: 1 },
    rectRadius: 0.1,
  });

  slide6.addText(
    [
      { text: '1. Pameran Hasil Karya (Gallery Walk & Peer Feedback):\n', options: { bold: true, fontSize: 13, color: TEAL_PRIMARY } },
      { text: '• Setiap tim memajang karyanya, anggota lain berkeliling memberikan stiker bintang apresiasi.\n' },
      { text: '• Umpan balik dilakukan dengan adab yang santun: menyebutkan kelebihan karya sebelum saran.\n\n' },
      { text: '2. Penguatan Konsep oleh Guru:\n', options: { bold: true, fontSize: 13, color: TEAL_PRIMARY } },
      { text: '• Guru meluruskan miskonsepsi, memvalidasi pemahaman syariat, dan memberikan penghargaan atas usaha seluruh tim.\n\n' },
      { text: '3. Lembar Refleksi Diri & Komitmen Pribadi:\n', options: { bold: true, fontSize: 13, color: TEAL_PRIMARY } },
      { text: '• "Apa satu kebaikan konkret yang akan saya lakukan hari ini sepulang sekolah?"\n' },
      { text: '• Murid menempelkan catatan tekad kebaikan pada Pohon Akhlak di dinding kelas.' },
    ],
    {
      x: 1.2,
      y: 1.7,
      w: 11.0,
      h: 4.6,
      fontSize: 12,
      color: SLATE_DARK,
      lineSpacing: 18,
    }
  );

  // ==========================================
  // SLIDE 7: Bahan Ajar - Ringkasan Materi Pokok
  // ==========================================
  const slide7 = pptx.addSlide();
  slide7.background = { color: 'F8FAFC' };

  slide7.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.33,
    h: 1.0,
    fill: { color: TEAL_PRIMARY },
  });
  slide7.addText(`Bahan Ajar: Ringkasan Materi & Hikmah Pokok`, {
    x: 0.8,
    y: 0.25,
    w: 11.5,
    h: 0.5,
    fontSize: 20,
    bold: true,
    color: WHITE,
    fontFace: 'Calibri',
  });

  slide7.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 1.4,
    w: 11.7,
    h: 5.2,
    fill: { color: WHITE },
    line: { color: 'CBD5E1', width: 1 },
    rectRadius: 0.1,
  });

  const summaryText = splitSections?.summaryMateri
    ? splitSections.summaryMateri.replace(/###/g, '').slice(0, 800)
    : `${atpData.tujuan_pembelajaran}\n\nMateri ini mengajarkan kita tentang pentingnya memahami tuntunan ajaran Islam dalam kehidupan sehari-hari, meneladani akhlak mulia para nabi dan rasul, serta membangun hubungan yang harmonis dengan Allah Swt. (hablun minallah) dan sesama manusia (hablun minannas).`;

  slide7.addText('INTISARI PELAJARAN UNTUK MURID:', {
    x: 1.2,
    y: 1.7,
    w: 11.0,
    h: 0.4,
    fontSize: 13,
    bold: true,
    color: TEAL_PRIMARY,
  });

  slide7.addText(summaryText, {
    x: 1.2,
    y: 2.2,
    w: 11.0,
    h: 4.2,
    fontSize: 11.5,
    color: SLATE_DARK,
    lineSpacing: 18,
  });

  // ==========================================
  // SLIDE 8: Lembar Pengesahan Resmi
  // ==========================================
  const slide8 = pptx.addSlide();
  slide8.background = { color: 'F8FAFC' };

  slide8.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.33,
    h: 1.0,
    fill: { color: TEAL_PRIMARY },
  });
  slide8.addText('Pengesahan Perangkat Ajar & Bahan Tayang', {
    x: 0.8,
    y: 0.25,
    w: 11.5,
    h: 0.5,
    fontSize: 20,
    bold: true,
    color: WHITE,
    fontFace: 'Calibri',
  });

  // Quote
  slide8.addShape(pptx.ShapeType.roundRect, {
    x: 1.5,
    y: 1.5,
    w: 10.33,
    h: 1.5,
    fill: { color: TEAL_LIGHT },
    line: { color: TEAL_PRIMARY, width: 1 },
    rectRadius: 0.1,
  });
  slide8.addText(
    '"Sebaik-baik manusia di antaramu adalah yang paling banyak membawa manfaat bagi sesamanya." (HR. Thabrani)',
    {
      x: 1.8,
      y: 1.8,
      w: 9.7,
      h: 0.9,
      fontSize: 13,
      italic: true,
      align: 'center',
      color: TEAL_DARK,
    }
  );

  // Signatory Box Left: Kepala Sekolah
  slide8.addShape(pptx.ShapeType.roundRect, {
    x: 1.8,
    y: 3.4,
    w: 4.5,
    h: 3.3,
    fill: { color: WHITE },
    line: { color: 'CBD5E1', width: 1 },
    rectRadius: 0.1,
  });
  slide8.addText(
    [
      { text: 'Mengetahui,\n', options: { fontSize: 11, color: SLATE_MUTED } },
      { text: `Kepala ${signatoryConfig.schoolName || 'Sekolah Dasar'}\n\n\n\n`, options: { bold: true, fontSize: 12 } },
      { text: `${signatoryConfig.principalName}\n`, options: { bold: true, underline: { style: 'sng' }, fontSize: 12 } },
      { text: `NIP. ${signatoryConfig.principalNip}`, options: { fontSize: 11, color: SLATE_MUTED } },
    ],
    {
      x: 2.0,
      y: 3.6,
      w: 4.1,
      h: 2.9,
      align: 'center',
      lineSpacing: 16,
    }
  );

  // Signatory Box Right: Guru PAI
  slide8.addShape(pptx.ShapeType.roundRect, {
    x: 7.0,
    y: 3.4,
    w: 4.5,
    h: 3.3,
    fill: { color: WHITE },
    line: { color: 'CBD5E1', width: 1 },
    rectRadius: 0.1,
  });
  slide8.addText(
    [
      { text: `${signatoryConfig.cityAndDate}\n`, options: { fontSize: 11, color: SLATE_MUTED } },
      { text: `Guru Pendidikan Agama Islam & BP\n\n\n\n`, options: { bold: true, fontSize: 12 } },
      { text: `${signatoryConfig.teacherName}\n`, options: { bold: true, underline: { style: 'sng' }, fontSize: 12 } },
      { text: `NIP. ${signatoryConfig.teacherNip}`, options: { fontSize: 11, color: SLATE_MUTED } },
    ],
    {
      x: 7.2,
      y: 3.6,
      w: 4.1,
      h: 2.9,
      align: 'center',
      lineSpacing: 16,
    }
  );

  // Save the presentation file
  const filename = `${title.replace(/[^a-zA-Z0-9_\u0600-\u06FF-]/g, '_')}_BahanAjar.pptx`;
  await pptx.writeFile({ fileName: filename });
}
