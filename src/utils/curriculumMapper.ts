import { MasterAtpRecord } from '../types';

/**
 * Normalizes string for key comparison by removing spaces, underscores, dashes, dots
 */
export function cleanKey(s: string): string {
  return (s || '').toLowerCase().replace(/[\s_\-.]/g, '');
}

/**
 * Normalizes string for value comparison (alphanumeric only)
 */
export function normText(s: string): string {
  return (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Ultra-robust helper to extract fields from Supabase regardless of exact column casing,
 * spaces (e.g., 'tp hasil analisis'), underscores (e.g., 'tp_hasil_analisis'), or naming variations.
 */
export function extractField(r: any, patterns: string[]): string {
  if (!r || typeof r !== 'object') return '';
  const keys = Object.keys(r);

  // 1. First priority: Exact key or normalized key equality (ignoring spaces, underscores, dashes, dots, case)
  for (const pattern of patterns) {
    if (r[pattern] !== undefined && r[pattern] !== null && String(r[pattern]).trim() !== '') {
      return String(r[pattern]).trim();
    }
    const targetClean = cleanKey(pattern);
    const matchedKey = keys.find((k) => cleanKey(k) === targetClean);
    if (
      matchedKey &&
      r[matchedKey] !== undefined &&
      r[matchedKey] !== null &&
      String(r[matchedKey]).trim() !== ''
    ) {
      return String(r[matchedKey]).trim();
    }
  }

  // 2. Second priority: Substring match on normalized key
  for (const pattern of patterns) {
    const targetClean = cleanKey(pattern);
    if (targetClean.length < 3) continue;
    const substringKey = keys.find((k) => cleanKey(k).includes(targetClean));
    if (
      substringKey &&
      r[substringKey] !== undefined &&
      r[substringKey] !== null &&
      String(r[substringKey]).trim() !== ''
    ) {
      return String(r[substringKey]).trim();
    }
  }

  // 3. Third priority: Regex heuristic for composite phrases (e.g. 'tp' + 'analis' or 'tp' + 'hasil')
  for (const pattern of patterns) {
    if (pattern.includes('analis') || pattern.includes('hasil')) {
      const fuzzyKey = keys.find(
        (k) =>
          ((k.toLowerCase().includes('tp') || k.toLowerCase().includes('tujuan')) &&
            (k.toLowerCase().includes('analis') || k.toLowerCase().includes('hasil')))
      );
      if (
        fuzzyKey &&
        r[fuzzyKey] !== undefined &&
        r[fuzzyKey] !== null &&
        String(r[fuzzyKey]).trim() !== ''
      ) {
        return String(r[fuzzyKey]).trim();
      }
    }
  }

  return '';
}

/**
 * Accurately extracts list of grade numbers (1..12) from arbitrary string.
 * Handles Roman numerals (I..XII) with strict boundaries so 'I' does not match 'III' or 'IV',
 * and handles combined ranges like 'Kelas 3-4', 'Kelas III / IV', 'Fase B (Kelas 3-4)'.
 */
export function extractGradeNumbers(s: string): number[] {
  if (!s) return [];
  const str = s.toLowerCase();
  const grades = new Set<number>();

  // 1. Combined multi-class ranges
  if (/(\b|kelas\s*|\(|^)(1|i)\s*[-/&,]\s*(2|ii)(\b|\)|$)/i.test(str)) {
    grades.add(1);
    grades.add(2);
  }
  if (/(\b|kelas\s*|\(|^)(3|iii)\s*[-/&,]\s*(4|iv)(\b|\)|$)/i.test(str)) {
    grades.add(3);
    grades.add(4);
  }
  if (/(\b|kelas\s*|\(|^)(5|v)\s*[-/&,]\s*(6|vi)(\b|\)|$)/i.test(str)) {
    grades.add(5);
    grades.add(6);
  }
  if (/(\b|kelas\s*|\(|^)(7|vii)\s*[-/&,]\s*(8|viii|9|ix)(\b|\)|$)/i.test(str)) {
    grades.add(7);
    grades.add(8);
    grades.add(9);
  }

  // 2. Strict Roman numeral matching (order strictly from longest to shortest)
  if (/\bviii\b|kelas\s*viii|kls\s*viii/i.test(str)) grades.add(8);
  else if (/\bvii\b|kelas\s*vii|kls\s*vii/i.test(str)) grades.add(7);
  else if (/\bvi\b|kelas\s*vi|kls\s*vi/i.test(str)) grades.add(6);
  else if (/\biv\b|kelas\s*iv|kls\s*iv/i.test(str)) grades.add(4);
  else if (/\bix\b|kelas\s*ix|kls\s*ix/i.test(str)) grades.add(9);
  else if (/\biii\b|kelas\s*iii|kls\s*iii/i.test(str)) grades.add(3);
  else if (/\bii\b|kelas\s*ii|kls\s*ii/i.test(str)) grades.add(2);
  else if (/\bv\b|kelas\s*v\b|kls\s*v\b/i.test(str)) grades.add(5);
  else if (/\bi\b|kelas\s*i\b|kls\s*i\b/i.test(str)) grades.add(1);

  // 3. Arabic numeral matching
  const arabicRegex = /(?:kelas|kls|grade|class|\b)\s*([1-9]|1[0-2])\b/gi;
  let match;
  while ((match = arabicRegex.exec(str)) !== null) {
    const num = parseInt(match[1], 10);
    if (num >= 1 && num <= 12) {
      grades.add(num);
    }
  }

  // 4. Standalone number check (e.g. "3", "4", "III", "IV")
  const trimmed = str.trim();
  if (/^[1-9]$/.test(trimmed)) {
    grades.add(parseInt(trimmed, 10));
  } else if (trimmed === 'i') grades.add(1);
  else if (trimmed === 'ii') grades.add(2);
  else if (trimmed === 'iii') grades.add(3);
  else if (trimmed === 'iv') grades.add(4);
  else if (trimmed === 'v') grades.add(5);
  else if (trimmed === 'vi') grades.add(6);
  else if (trimmed === 'vii') grades.add(7);
  else if (trimmed === 'viii') grades.add(8);
  else if (trimmed === 'ix') grades.add(9);

  return Array.from(grades);
}

/**
 * Precision calibration of Fase and Kelas based on Kurikulum Merdeka standards.
 * Prioritizes rawFase if present so Supabase total Fase counts are 100% synchronized,
 * detects grades (Kelas I - VI) from rawKelas, and accurately handles multi-class ranges.
 */
export function precisionFaseAndKelas(
  rawFase: string,
  rawKelas: string,
  noAtp: string = ''
): { fase: string; target_kelas: string } {
  const normF = normText(rawFase);
  const normK = normText(rawKelas);
  const normNo = (noAtp || '').trim().toLowerCase();

  // 1. Identify if rawFase specifies a known Phase (Highest Priority)
  let detectedFase = '';
  if (normF.includes('faseb') || normF === 'b' || /\b(fase\s*b|fase-b|fase_b)\b/i.test(rawFase)) {
    detectedFase = 'Fase B';
  } else if (normF.includes('fasea') || normF === 'a' || /\b(fase\s*a|fase-a|fase_a)\b/i.test(rawFase)) {
    detectedFase = 'Fase A';
  } else if (normF.includes('fasec') || normF === 'c' || /\b(fase\s*c|fase-c|fase_c)\b/i.test(rawFase)) {
    detectedFase = 'Fase C';
  } else if (normF.includes('fased') || normF === 'd' || /\b(fase\s*d|fase-d|fase_d)\b/i.test(rawFase)) {
    detectedFase = 'Fase D';
  } else if (normF.includes('fasee') || normF === 'e' || /\b(fase\s*e|fase-e|fase_e)\b/i.test(rawFase)) {
    detectedFase = 'Fase E';
  } else if (normF.includes('fasef') || normF === 'f' || /\b(fase\s*f|fase-f|fase_f)\b/i.test(rawFase)) {
    detectedFase = 'Fase F';
  }

  // 2. Extract grades from rawKelas
  const grades = extractGradeNumbers(rawKelas);

  // 3. If Fase was NOT provided in rawFase, deduce Fase from grades or noAtp
  if (!detectedFase) {
    if (grades.includes(1) || grades.includes(2)) {
      detectedFase = 'Fase A';
    } else if (grades.includes(3) || grades.includes(4)) {
      detectedFase = 'Fase B';
    } else if (grades.includes(5) || grades.includes(6)) {
      detectedFase = 'Fase C';
    } else if (grades.includes(7) || grades.includes(8) || grades.includes(9)) {
      detectedFase = 'Fase D';
    } else if (grades.includes(10)) {
      detectedFase = 'Fase E';
    } else if (grades.includes(11) || grades.includes(12)) {
      detectedFase = 'Fase F';
    } else if (normNo) {
      if (normNo.startsWith('1.') || normNo.startsWith('2.')) {
        detectedFase = 'Fase A';
      } else if (normNo.startsWith('3.') || normNo.startsWith('4.')) {
        detectedFase = 'Fase B';
      } else if (normNo.startsWith('5.') || normNo.startsWith('6.')) {
        detectedFase = 'Fase C';
      } else if (normNo.startsWith('7.') || normNo.startsWith('8.') || normNo.startsWith('9.')) {
        detectedFase = 'Fase D';
      }
    }
  }

  // Fallback if still unknown
  if (!detectedFase) {
    detectedFase = 'Fase B';
  }

  // 4. Now determine target_kelas aligned with detectedFase
  let detectedKelas = '';

  if (detectedFase === 'Fase B') {
    if (grades.includes(3) && grades.includes(4)) {
      detectedKelas = 'Kelas III / IV';
    } else if (grades.includes(3)) {
      detectedKelas = 'Kelas III';
    } else if (grades.includes(4)) {
      detectedKelas = 'Kelas IV';
    } else if (normK.includes('kelas3') || normK.includes('kls3') || normK.includes('kelasiii') || normK.includes('tiga')) {
      detectedKelas = 'Kelas III';
    } else if (normK.includes('kelas4') || normK.includes('kls4') || normK.includes('kelasiv') || normK.includes('empat')) {
      detectedKelas = 'Kelas IV';
    } else if (normNo.startsWith('3.') || normNo.startsWith('3-') || normNo.startsWith('3_')) {
      detectedKelas = 'Kelas III';
    } else if (normNo.startsWith('4.') || normNo.startsWith('4-') || normNo.startsWith('4_')) {
      detectedKelas = 'Kelas IV';
    } else {
      // If Fase B but no specific grade 3 or 4 distinction, default to range so it matches both filters
      detectedKelas = rawKelas.trim() && !/^(fase|b|sd)$/i.test(rawKelas.trim()) ? rawKelas.trim() : 'Kelas III / IV';
    }
  } else if (detectedFase === 'Fase A') {
    if (grades.includes(1) && grades.includes(2)) {
      detectedKelas = 'Kelas I / II';
    } else if (grades.includes(1)) {
      detectedKelas = 'Kelas I';
    } else if (grades.includes(2)) {
      detectedKelas = 'Kelas II';
    } else if (normNo.startsWith('1.') || normNo.startsWith('1-')) {
      detectedKelas = 'Kelas I';
    } else if (normNo.startsWith('2.') || normNo.startsWith('2-')) {
      detectedKelas = 'Kelas II';
    } else {
      detectedKelas = rawKelas.trim() && !/^(fase|a|sd)$/i.test(rawKelas.trim()) ? rawKelas.trim() : 'Kelas I / II';
    }
  } else if (detectedFase === 'Fase C') {
    if (grades.includes(5) && grades.includes(6)) {
      detectedKelas = 'Kelas V / VI';
    } else if (grades.includes(5)) {
      detectedKelas = 'Kelas V';
    } else if (grades.includes(6)) {
      detectedKelas = 'Kelas VI';
    } else if (normNo.startsWith('5.') || normNo.startsWith('5-')) {
      detectedKelas = 'Kelas V';
    } else if (normNo.startsWith('6.') || normNo.startsWith('6-')) {
      detectedKelas = 'Kelas VI';
    } else {
      detectedKelas = rawKelas.trim() && !/^(fase|c|sd)$/i.test(rawKelas.trim()) ? rawKelas.trim() : 'Kelas V / VI';
    }
  } else if (detectedFase === 'Fase D') {
    if (grades.includes(7)) detectedKelas = 'Kelas VII';
    else if (grades.includes(8)) detectedKelas = 'Kelas VIII';
    else if (grades.includes(9)) detectedKelas = 'Kelas IX';
    else detectedKelas = rawKelas.trim() ? rawKelas.trim() : 'Kelas VII / VIII / IX';
  } else {
    detectedKelas = rawKelas.trim() ? rawKelas.trim() : 'Kelas III / IV';
  }

  return {
    fase: detectedFase,
    target_kelas: detectedKelas,
  };
}

/**
 * Intelligent filter matcher for Fase (supports 'Fase A', 'A', 'FASE A', etc.)
 */
export function matchFase(itemFase: string, filterFase: string): boolean {
  if (!filterFase || filterFase === 'all') return true;
  if (!itemFase) return false;
  const i = normText(itemFase);
  const f = normText(filterFase);
  if (!i || !f) return false;
  if (i === f) return true;

  // Extract letter (e.g. 'faseb' -> 'b', 'b' -> 'b')
  const letterF = f.replace(/fase/g, '').trim();
  const letterI = i.replace(/fase/g, '').trim();
  if (letterF && letterI && letterF === letterI) return true;

  // Strict letter check
  if (letterF && (letterF === 'a' || letterF === 'b' || letterF === 'c' || letterF === 'd')) {
    if (letterI === letterF) return true;
    if (i === `fase${letterF}`) return true;
    const regex = new RegExp(`(^|[^a-z])${letterF}([^a-z]|$)`, 'i');
    return regex.test(itemFase);
  }

  return i.includes(f) || f.includes(i);
}

/**
 * Intelligent filter matcher for Kelas (supports Roman, Arabic, ranges, etc.)
 */
export function matchKelas(itemKelas: string, filterKelas: string): boolean {
  if (!filterKelas || filterKelas === 'all') return true;
  const filterGrades = extractGradeNumbers(filterKelas);
  if (filterGrades.length === 0) return true;

  const itemGrades = extractGradeNumbers(itemKelas);
  if (itemGrades.length === 0) {
    // Fallback exact or normalized string matching
    const i = normText(itemKelas);
    const f = normText(filterKelas);
    return i === f || i.includes(f) || f.includes(i);
  }

  // Match if any grade overlaps
  return itemGrades.some((g) => filterGrades.includes(g));
}

/**
 * Intelligent filter matcher for Elemen (handles variations like Al-Qur'an & Hadis, Fiqih vs Fikih, etc.)
 */
export function matchElemen(itemElemen: string, filterElemen: string): boolean {
  if (!filterElemen || filterElemen === 'all') return true;
  const i = normText(itemElemen);
  const f = normText(filterElemen);
  if (i === f) return true;

  // Group equivalence
  const isQuranI = i.includes('quran') || i.includes('hadis') || i.includes('hadits');
  const isQuranF = f.includes('quran') || f.includes('hadis') || f.includes('hadits');
  if (isQuranI && isQuranF) return true;

  const isAkidahI = i.includes('akidah') || i.includes('aqidah');
  const isAkidahF = f.includes('akidah') || f.includes('aqidah');
  if (isAkidahI && isAkidahF) return true;

  const isAkhlakI = i.includes('akhlak') || i.includes('akhlaq');
  const isAkhlakF = f.includes('akhlak') || f.includes('akhlaq');
  if (isAkhlakI && isAkhlakF) return true;

  const isFikihI = i.includes('fikih') || i.includes('fiqih');
  const isFikihF = f.includes('fikih') || f.includes('fiqih');
  if (isFikihI && isFikihF) return true;

  const isSejarahI =
    i.includes('sejarah') ||
    i.includes('tarikh') ||
    i.includes('spi') ||
    i.includes('ski') ||
    i.includes('kebudayaan') ||
    i.includes('peradaban');
  const isSejarahF =
    f.includes('sejarah') ||
    f.includes('tarikh') ||
    f.includes('spi') ||
    f.includes('ski') ||
    f.includes('kebudayaan') ||
    f.includes('peradaban');
  if (isSejarahI && isSejarahF) return true;

  return i.includes(f) || f.includes(i);
}

/**
 * Maps a single raw Supabase row into MasterAtpRecord with highest priority given to
 * "tp hasil analisis", extracting Materi Pokok / Lingkup Materi, and full precision alignment for Fase and Kelas.
 */
export function mapSupabaseRowToAtp(
  r: any,
  idx: number,
  cpDataList: any[] = []
): MasterAtpRecord {
  // 1. Extract Tujuan Pembelajaran (TP) with priority on "tp hasil analisis"
  const tpAnalisis = extractField(r, [
    'tp_hasil_analisis',
    'tp hasil analisis',
    'tp_hasil_analisa',
    'tp hasil analisa',
    'tp_analisis',
    'tp analisis',
    'tp_analisa',
    'tp analisa',
    'hasil_analisis_tp',
    'hasil analisis tp',
    'hasil_analisis',
    'hasil analisis',
    'hasil_analisa',
    'tp_hasil',
    'hasil_tp',
    'tujuan_pembelajaran_hasil_analisis',
    'tujuan pembelajaran hasil analisis',
    'tujuan_pembelajaran_analisis',
    'analisis_tujuan_pembelajaran',
    'tujuan_analisis',
    'analisis_tp',
    'tp_final',
    'tp_revisi',
  ]);

  const tpFallback = extractField(r, [
    'tujuan_pembelajaran',
    'tujuan pembelajaran',
    'tp',
    'tujuan',
    'deskripsi_tp',
    'tujuan_pembelajaran_atp',
  ]);

  // Primary: "tp hasil analisis", Secondary fallback: standard TP column
  const tp = tpAnalisis || tpFallback;

  // 2. Extract Materi Pokok / Lingkup Materi
  const materi = extractField(r, [
    'materi',
    'materi_pokok',
    'lingkup_materi',
    'nama_materi',
    'judul_materi',
    'topik',
    'topik_pembelajaran',
    'tema',
    'judul',
    'pokok_bahasan',
    'bab',
    'sub_materi',
    'pokok_materi',
  ]);

  const lingkupMateri = extractField(r, [
    'lingkup_materi',
    'lingkup materi',
    'lingkup',
    'cakupan_materi',
  ]) || materi;

  const semester = extractField(r, ['semester', 'smt', 'smt_1', 'smt_2']);
  const alokasiWaktu = extractField(r, ['alokasi_waktu', 'jp', 'jam_pelajaran', 'waktu']);

  // 3. Precision-align Fase and Kelas
  const rawFase = extractField(r, [
    'fase',
    'fase_pembelajaran',
    'tingkat_fase',
    'jenjang_fase',
    'fase_kurikulum',
    'fase_atp',
    'fase_kelas',
    'nama_fase',
    'fase_tp',
    'fase_cp',
    'fase_sd',
    'phase',
    'kode_fase',
  ]);
  const rawKelas = extractField(r, [
    'target_kelas',
    'kelas',
    'tingkat_kelas',
    'jenjang',
    'tingkat',
    'kls',
    'grade',
    'class',
    'rombel',
    'nama_kelas',
    'kelas_target',
  ]);
  const rawNoAtp = extractField(r, ['no_atp', 'nomor_atp', 'nomor', 'no', 'urutan', 'kode']);
  const no_atp = rawNoAtp || `${idx + 1}.1`;

  const { fase, target_kelas } = precisionFaseAndKelas(rawFase, rawKelas, no_atp);

  // 4. Elemen
  const elemen =
    extractField(r, ['elemen', 'elemen_pembelajaran', 'bidang', 'aspek', 'komponen']) ||
    "Al-Qur'an dan Hadis";

  // 5. Capaian Pembelajaran (CP)
  let cp = extractField(r, [
    'capaian_pembelajaran',
    'capaian pembelajaran',
    'cp',
    'capaian',
    'deskripsi_cp',
    'capaian_fase',
    'cp_elemen',
    'cp_fase',
    'capaian_pembelajaran_elemen',
    'capaian_pembelajaran_fase',
    'teks_cp',
    'deskripsi',
    'kompetensi',
    'kompetensi_inti',
    'kd',
  ]);

  // If CP is missing in row, match from separate CP table if present
  if (!cp && Array.isArray(cpDataList) && cpDataList.length > 0) {
    const cpId = r.id_cp || r.cp_id || r.kode_cp;
    let matchedCp = null;

    if (cpId) {
      matchedCp = cpDataList.find(
        (c) =>
          String(c.id) === String(cpId) ||
          String(c.kode_cp) === String(cpId) ||
          String(c.kode) === String(cpId)
      );
    }

    // High-precision: Elemen + Fase + Kelas
    if (!matchedCp && elemen && fase && target_kelas) {
      matchedCp = cpDataList.find(
        (c) =>
          normText(extractField(c, ['elemen', 'elemen_pembelajaran', 'bidang'])) === normText(elemen) &&
          normText(extractField(c, ['fase', 'fase_pembelajaran'])) === normText(fase) &&
          normText(extractField(c, ['target_kelas', 'kelas', 'tingkat_kelas'])) === normText(target_kelas)
      );
    }

    // Precision: Elemen + Fase
    if (!matchedCp && elemen && fase) {
      matchedCp = cpDataList.find(
        (c) =>
          normText(extractField(c, ['elemen', 'elemen_pembelajaran', 'bidang'])) === normText(elemen) &&
          normText(extractField(c, ['fase', 'fase_pembelajaran'])) === normText(fase)
      );
    }

    // Fallback: Elemen alone
    if (!matchedCp && elemen) {
      matchedCp = cpDataList.find(
        (c) =>
          normText(extractField(c, ['elemen', 'elemen_pembelajaran', 'bidang'])) === normText(elemen)
      );
    }

    if (matchedCp) {
      cp = extractField(matchedCp, [
        'capaian_pembelajaran',
        'capaian pembelajaran',
        'cp',
        'capaian',
        'deskripsi_cp',
        'deskripsi',
        'teks_cp',
      ]);
    }
  }

  // 6. ATP alur
  const atp =
    extractField(r, [
      'alur_tujuan_pembelajaran',
      'alur tujuan pembelajaran',
      'atp',
      'alur',
      'alur_pembelajaran',
    ]) || tp;

  return {
    id: r.id ? String(r.id) : `sb-${idx + 1}`,
    fase,
    target_kelas,
    elemen,
    no_atp,
    materi: materi || undefined,
    lingkup_materi: lingkupMateri || undefined,
    semester: semester || undefined,
    alokasi_waktu: alokasiWaktu || undefined,
    capaian_pembelajaran:
      cp ||
      `Peserta didik mampu memahami dan merefleksikan nilai-nilai ajaran Islam pada elemen ${elemen} (${fase} - ${target_kelas}) sesuai ketetapan Kurikulum Nasional.`,
    tujuan_pembelajaran:
      tp || 'Mencapai pemahaman dan pengamalan ajaran Islam sesuai alur tujuan pembelajaran.',
    tp_hasil_analisis: tpAnalisis || undefined,
    alur_tujuan_pembelajaran: atp,
  };
}
