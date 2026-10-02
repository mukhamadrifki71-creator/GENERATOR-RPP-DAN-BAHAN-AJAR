import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AtpInputStation } from './components/AtpInputStation';
import { RppView } from './components/RppView';
import { BahanAjarView } from './components/BahanAjarView';
import { UnifiedDocumentView } from './components/UnifiedDocumentView';
import { InteractiveRubricScorer } from './components/InteractiveRubricScorer';
import { CatalogBrowser } from './components/CatalogBrowser';
import { StandardGuide } from './components/StandardGuide';
import { SignatoryModal } from './components/SignatoryModal';
import { MASTER_ATP_PAI_CATALOG } from './data/masterAtpSamples';
import {
  MasterAtpRecord,
  GenerationOptions,
  GenerationResult,
  SignatoryConfig,
} from './types';
import { generateDeterministicRpp } from './utils/pedagogicalEngine';
import heroImage from './assets/images/hero_educraft_curriculum_1790647077742.jpg';
import {
  splitGeneratedContent,
  exportToWordDoc,
  exportToMarkdownFile,
} from './utils/documentExport';
import { exportToPowerPoint } from './utils/powerpointExport';
import {
  Sparkles,
  FileText,
  BookOpen,
  Award,
  Printer,
  AlertCircle,
  Presentation,
  UserCheck,
} from 'lucide-react';

const DEFAULT_INITIAL_ATP = MASTER_ATP_PAI_CATALOG[5]; // Q.S. Al-Hujurat/49: 13, Kelas IV
const DEFAULT_INITIAL_OPTIONS: GenerationOptions = {
  duration: '1 x 3 jam pelajaran (105 Menit)',
  pedagogicalStrategy: 'Storytelling Reflektif & Diskusi Kasus',
  digitalTool: 'Canva Edukasi, Google Slides, Padlet',
  partnerNotes: '',
};

const DEFAULT_SIGNATORY: SignatoryConfig = {
  teacherName: 'MUKHAMAD RIFKI, S.Pd.I.',
  teacherNip: '19900101 202012 1 005',
  principalName: 'Drs. H. AHMAD SYUKRI, M.Pd.',
  principalNip: '19750512 199903 1 002',
  schoolName: 'SD NEGERI 1 SUMBER MAKMUR',
  cityAndDate: `Jakarta, ${new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })}`,
};

// Robust helper to extract fields from Supabase regardless of exact column casing or naming variations
function extractField(r: any, patterns: string[]): string {
  if (!r || typeof r !== 'object') return '';
  for (const pattern of patterns) {
    if (r[pattern] !== undefined && r[pattern] !== null && String(r[pattern]).trim() !== '') {
      return String(r[pattern]).trim();
    }
  }
  const keys = Object.keys(r);
  for (const pattern of patterns) {
    const foundKey = keys.find(
      (k) =>
        k.toLowerCase() === pattern.toLowerCase() ||
        k.toLowerCase().includes(pattern.toLowerCase())
    );
    if (foundKey && r[foundKey] !== undefined && r[foundKey] !== null && String(r[foundKey]).trim() !== '') {
      return String(r[foundKey]).trim();
    }
  }
  return '';
}

export default function App() {
  const [activeNavTab, setActiveNavTab] = useState<string>('generator');

  // Load cached Supabase items if user already synced earlier
  const [catalogItems, setCatalogItems] = useState<MasterAtpRecord[]>(() => {
    const cached = localStorage.getItem('educraft_cached_catalog');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return MASTER_ATP_PAI_CATALOG;
  });

  const [currentAtp, setCurrentAtp] = useState<MasterAtpRecord>(() => {
    const cached = localStorage.getItem('educraft_cached_catalog');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
      } catch {}
    }
    return DEFAULT_INITIAL_ATP;
  });

  const [options, setOptions] = useState<GenerationOptions>(DEFAULT_INITIAL_OPTIONS);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Supabase live integration state (persisted across page reloads and browser sessions)
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(() => {
    return !!(localStorage.getItem('educraft_sb_key') || localStorage.getItem('educraft_cached_catalog'));
  });
  const [supabaseError, setSupabaseError] = useState<string>('');

  const handleDisconnectSupabase = () => {
    localStorage.removeItem('educraft_sb_url');
    localStorage.removeItem('educraft_sb_key');
    localStorage.removeItem('educraft_sb_table');
    localStorage.removeItem('educraft_sb_cp_table');
    localStorage.removeItem('educraft_cached_catalog');
    setCatalogItems(MASTER_ATP_PAI_CATALOG);
    setCurrentAtp(DEFAULT_INITIAL_ATP);
    setIsSupabaseConnected(false);
    setSupabaseError('');
  };

  // Signatory State (Teacher and Principal information)
  const [isSignatoryOpen, setIsSignatoryOpen] = useState<boolean>(false);
  const [signatoryConfig, setSignatoryConfig] = useState<SignatoryConfig>(() => {
    const saved = localStorage.getItem('educraft_signatory_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return DEFAULT_SIGNATORY;
  });

  const handleSaveSignatory = (newConfig: SignatoryConfig) => {
    setSignatoryConfig(newConfig);
    localStorage.setItem('educraft_signatory_config', JSON.stringify(newConfig));
  };

  // Pre-seed generationResult so the full RPP and teaching material displays immediately
  const [generationResult, setGenerationResult] = useState<GenerationResult>({
    rawMarkdown: generateDeterministicRpp(DEFAULT_INITIAL_ATP, DEFAULT_INITIAL_OPTIONS),
    source: 'engine_fallback',
    atpData: DEFAULT_INITIAL_ATP,
    createdAt: 'Siap Ajar',
  });

  const [resultSubTab, setResultSubTab] = useState<'rpp' | 'bahan_ajar' | 'unified' | 'rubric'>('rpp');
  const [copied, setCopied] = useState<boolean>(false);

  // Function to fetch rows from user's Supabase database (supports local proxy and GitHub Pages direct fetch)
  const handleRefreshSupabase = async (
    url: string,
    key: string,
    table = 'master_atp_pai',
    cpTable = 'master_cp_pai'
  ): Promise<boolean> => {
    setSupabaseError('');
    try {
      let data: any = null;

      // Clean inputs thoroughly
      let rawUrl = (url || '').trim().replace(/^['"]|['"]$/g, '');
      const cleanKey = (key || '').trim().replace(/^['"]|['"]$/g, '').replace(/[\r\n\t\s]/g, '');

      if (!rawUrl || !cleanKey) {
        throw new Error('URL Supabase dan API Key (Anon) wajib diisi.');
      }

      // Auto-detect dashboard URL vs API URL
      const dashMatch = rawUrl.match(/supabase\.com\/dashboard\/project\/([a-zA-Z0-9_-]+)/i);
      if (dashMatch && dashMatch[1]) {
        rawUrl = `https://${dashMatch[1]}.supabase.co`;
      } else if (/^[a-zA-Z0-9_-]{15,35}$/.test(rawUrl)) {
        rawUrl = `https://${rawUrl}.supabase.co`;
      } else {
        rawUrl = rawUrl.replace(/\/rest\/v1.*$/i, '').replace(/\/+$/, '');
        if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
          rawUrl = 'https://' + rawUrl;
        }
      }

      let cleanTable = table.replace(/^public\./i, '').replace(/^\/+|\/+$/g, '').trim() || 'master_atp_pai';
      let cleanCpTable = (cpTable || '').replace(/^public\./i, '').replace(/^\/+|\/+$/g, '').trim() || 'master_cp_pai';

      const isStaticHost =
        typeof window !== 'undefined' &&
        (window.location.hostname.includes('github.io') ||
          (window.location.hostname === 'localhost' && window.location.port !== '3000'));

      // 1. Try server-side proxy route first ONLY when running on Node.js full-stack server
      if (!isStaticHost) {
        try {
          const res = await fetch('/api/supabase/fetch-atp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              supabaseUrl: rawUrl,
              supabaseAnonKey: cleanKey,
              tableName: cleanTable,
              cpTableName: cleanCpTable,
              limit: 1000,
            }),
          });

          if (res.ok) {
            data = await res.json();
          }
        } catch {
          // Fall back to direct browser fetch
        }
      }

      // 2. Direct client-side Supabase REST call (runs directly from user's browser via CORS)
      if (!data || !data.data) {
        const authHeaders = {
          apikey: cleanKey,
          Authorization: `Bearer ${cleanKey}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        };

        // 2a. Discover tables via OpenAPI spec to detect correct table name automatically
        let discoveredTables: string[] = [];
        try {
          const metaRes = await fetch(`${rawUrl}/rest/v1/`, {
            method: 'GET',
            headers: authHeaders,
          });
          if (metaRes.ok) {
            const spec: any = await metaRes.json();
            if (spec?.definitions) {
              discoveredTables = Object.keys(spec.definitions);
            } else if (spec?.paths) {
              discoveredTables = Object.keys(spec.paths)
                .map((p: string) => p.replace(/^\//, ''))
                .filter((p: string) => p && !p.includes('/'));
            }
          }
        } catch {
          // discovery optional
        }

        // Auto-match ATP table name if user's input doesn't match exactly
        if (discoveredTables.length > 0) {
          const exactMatch = discoveredTables.find((t) => t.toLowerCase() === cleanTable.toLowerCase());
          if (exactMatch) {
            cleanTable = exactMatch;
          } else {
            const atpCandidate = discoveredTables.find((t) => t.toLowerCase().includes('atp'));
            if (atpCandidate) cleanTable = atpCandidate;
          }

          const cpExact = discoveredTables.find((t) => t.toLowerCase() === cleanCpTable.toLowerCase());
          if (cpExact) {
            cleanCpTable = cpExact;
          } else {
            const cpCandidate = discoveredTables.find(
              (t) =>
                (t.toLowerCase().includes('cp') || t.toLowerCase().includes('capaian')) &&
                t.toLowerCase() !== cleanTable.toLowerCase()
            );
            if (cpCandidate) cleanCpTable = cpCandidate;
          }
        }

        // 2b. Query primary ATP table directly
        let directRes: Response;
        try {
          directRes = await fetch(`${rawUrl}/rest/v1/${cleanTable}?select=*&limit=1000`, {
            method: 'GET',
            headers: authHeaders,
          });
        } catch (networkErr: any) {
          throw new Error(
            `Koneksi ke Supabase gagal (Network / CORS Error):\n` +
            `1. Pastikan URL Supabase benar (${rawUrl}).\n` +
            `2. Jika Anda menggunakan Supabase Free Tier, proyek mungkin sedang dijeda (Paused) karena tidak aktif. Buka Supabase Dashboard dan klik "Restore project".\n` +
            `3. Pastikan ekstensi adblocker di browser Anda tidak memblokir domain supabase.co.`
          );
        }

        if (!directRes.ok) {
          const errText = await directRes.text();
          let parsed: any = null;
          try {
            parsed = JSON.parse(errText);
          } catch {}

          if (directRes.status === 401 || directRes.status === 403) {
            throw new Error(
              `Autentikasi Supabase Ditolak (Status ${directRes.status}). ` +
              `Pastikan Anda menyalin "anon public" API key (bukan service role) dari Project Settings > API di Supabase.`
            );
          }

          if (directRes.status === 404) {
            const hint = discoveredTables.length > 0
              ? `Tabel yang terdeteksi di database Anda: ${discoveredTables.join(', ')}.`
              : `Pastikan nama tabel sesuai di Supabase Table Editor.`;
            throw new Error(`Tabel '${cleanTable}' tidak ditemukan di Supabase (Status 404). ${hint}`);
          }

          throw new Error(`Supabase error (${directRes.status}): ${parsed?.message || errText}`);
        }

        const rows = await directRes.json();

        // 2c. Query CP table if available
        let cpRows: any[] = [];
        if (cleanCpTable) {
          try {
            const cpRes = await fetch(`${rawUrl}/rest/v1/${cleanCpTable}?select=*&limit=500`, {
              method: 'GET',
              headers: authHeaders,
            });
            if (cpRes.ok) {
              const parsedCp = await cpRes.json();
              if (Array.isArray(parsedCp)) cpRows = parsedCp;
            }
          } catch {
            // CP table optional
          }
        }

        data = {
          data: rows,
          cpData: cpRows,
        };
      }

      if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
        const cpDataList: any[] = Array.isArray(data.cpData) ? data.cpData : [];
        const norm = (s: string) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

        const mappedRows: MasterAtpRecord[] = data.data.map((r: any, idx: number) => {
          let cp = extractField(r, [
            'capaian_pembelajaran',
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

          const tp = extractField(r, [
            'tujuan_pembelajaran',
            'tp',
            'tujuan',
            'deskripsi_tp',
            'tujuan_pembelajaran_atp',
            'materi',
          ]);

          const fase = extractField(r, ['fase', 'fase_pembelajaran', 'tingkat_fase']) || 'Fase B';
          const elemen = extractField(r, ['elemen', 'elemen_pembelajaran', 'bidang', 'aspek']) || 'Pendidikan Agama Islam';
          const target_kelas = extractField(r, ['target_kelas', 'kelas', 'tingkat_kelas', 'jenjang']) || 'Kelas IV';
          const no_atp = extractField(r, ['no_atp', 'nomor_atp', 'nomor', 'no', 'urutan']) || `${idx + 1}.1`;
          const atp = extractField(r, ['alur_tujuan_pembelajaran', 'atp', 'alur', 'alur_pembelajaran']) || tp;

          // If CP is missing in ATP row, try to match from separate CP table (if available)
          if (!cp && cpDataList.length > 0) {
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

            if (!matchedCp && elemen && fase) {
              matchedCp = cpDataList.find(
                (c) =>
                  norm(extractField(c, ['elemen', 'elemen_pembelajaran'])) === norm(elemen) &&
                  norm(extractField(c, ['fase', 'fase_pembelajaran'])) === norm(fase)
              );
            }

            if (!matchedCp && elemen) {
              matchedCp = cpDataList.find(
                (c) => norm(extractField(c, ['elemen', 'elemen_pembelajaran'])) === norm(elemen)
              );
            }

            if (matchedCp) {
              cp = extractField(matchedCp, [
                'capaian_pembelajaran',
                'cp',
                'capaian',
                'deskripsi_cp',
                'deskripsi',
                'teks_cp',
              ]);
            }
          }

          return {
            id: r.id || `sb-${idx}`,
            fase,
            elemen,
            capaian_pembelajaran:
              cp ||
              'Peserta didik mampu memahami dan menerapkan nilai-nilai ajaran Islam dalam kehidupan sehari-hari.',
            tujuan_pembelajaran: tp,
            target_kelas,
            no_atp,
            alur_tujuan_pembelajaran: atp,
          };
        });

        setCatalogItems(mappedRows);
        setCurrentAtp(mappedRows[0]);
        setIsSupabaseConnected(true);
        localStorage.setItem('educraft_sb_url', url);
        localStorage.setItem('educraft_sb_key', key);
        localStorage.setItem('educraft_sb_table', table);
        if (cpTable) localStorage.setItem('educraft_sb_cp_table', cpTable);
        localStorage.setItem('educraft_cached_catalog', JSON.stringify(mappedRows));

        // Automatically update initial RPP with the first synced Supabase record
        setGenerationResult({
          rawMarkdown: generateDeterministicRpp(mappedRows[0], options),
          source: 'engine_fallback',
          atpData: mappedRows[0],
          createdAt: 'Tersinkron Supabase',
        });

        return true;
      } else {
        throw new Error(
          'RLS_BLOCKED: Data terbaca 0 baris dari Supabase meskipun tabel memiliki data. Hal ini terjadi karena fitur Row Level Security (RLS) di Supabase memblokir akses baca API anon.'
        );
      }
    } catch (err: any) {
      console.error('Supabase fetch error:', err);
      setSupabaseError(err.message || 'Koneksi ke Supabase gagal.');
      return false;
    }
  };

  // Trigger generation function via server API with fallback
  const handleGenerate = async (atpToUse = currentAtp) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const response = await fetch('/api/educraft/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          atpData: atpToUse,
          options,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      setGenerationResult({
        rawMarkdown: data.markdown,
        source: data.source,
        atpData: atpToUse,
        createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      });
      setActiveNavTab('generator');
    } catch (err: any) {
      console.warn('API generation failed, generating instant deterministic RPP:', err);
      const fallbackMarkdown = generateDeterministicRpp(atpToUse, options);
      setGenerationResult({
        rawMarkdown: fallbackMarkdown,
        source: 'engine_fallback',
        atpData: atpToUse,
        createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      });
      setActiveNavTab('generator');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const splitContent = splitGeneratedContent(generationResult.rawMarkdown);

  const handleExportPptx = async () => {
    await exportToPowerPoint(
      `BahanAjar_${generationResult.atpData.target_kelas}_${generationResult.atpData.elemen}`,
      generationResult.atpData,
      signatoryConfig,
      splitContent
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Strict Top Bar */}
      <Header
        activeTab={activeNavTab}
        setActiveTab={setActiveNavTab}
        onPrint={handlePrint}
        hasResult={!!generationResult}
        onOpenSignatory={() => setIsSignatoryOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Hero Section Banner */}
        {activeNavTab === 'generator' && (
          <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs no-print bg-slate-900">
            <div className="absolute inset-0 z-0">
              <img
                src={heroImage}
                alt="Studio Kurikulum EduCraft AI"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center filter brightness-90"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-slate-900/40" />
            </div>

            <div className="relative z-10 p-6 sm:p-8 md:p-10 max-w-3xl text-white">
              <div className="flex items-center gap-2 text-xs text-teal-300 font-medium mb-2 tracking-wide uppercase">
                <span>Pusat Kurikulum & Desain Pedagogis PAI</span>
                <span aria-hidden="true">·</span>
                <span>Berbasis Data Supabase</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Penyusun RPP Mendalam & Paket Bahan Ajar PAI Otomatis
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl">
                Langkah pembelajaran ultra-detail dengan bullet-points terstruktur (Mindful, Joyful, Meaningful), narasi ajar kaya makna, pengesahan resmi Guru PAI & Kepala Sekolah, serta ekspor Word dan PowerPoint (.pptx).
              </p>
            </div>
          </div>
        )}

        {/* Global Error Banner */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between no-print">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => setErrorMsg('')}
              className="font-semibold text-rose-900 hover:underline ml-4"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Navigation Tab: GENERATOR */}
        {activeNavTab === 'generator' && (
          <div className="space-y-6">
            {/* Streamlined Input Station */}
            <AtpInputStation
              currentAtp={currentAtp}
              setCurrentAtp={setCurrentAtp}
              options={options}
              setOptions={setOptions}
              onGenerate={() => handleGenerate(currentAtp)}
              isLoading={isLoading}
              catalogItems={catalogItems}
              setCatalogItems={setCatalogItems}
              isSupabaseConnected={isSupabaseConnected}
              onRefreshSupabase={handleRefreshSupabase}
              onDisconnectSupabase={handleDisconnectSupabase}
              supabaseError={supabaseError}
            />

            {/* Generated Results Presentation */}
            <div className="space-y-4">
              {/* Result Section Header & Tab Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 no-print">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Hasil Dokumen:</span>
                  <span className="text-xs font-bold text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded">
                    {generationResult.atpData.target_kelas} · {generationResult.atpData.elemen}
                  </span>
                  {/* Info Pengesahan Terpasang */}
                  <button
                    onClick={() => setIsSignatoryOpen(true)}
                    className="text-[11px] text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full flex items-center gap-1 hover:bg-teal-100 transition-colors"
                    title="Klik untuk mengubah tanda tangan pengesahan"
                  >
                    <UserCheck className="w-3 h-3 text-teal-700" />
                    <span>Pengesahan: {signatoryConfig.teacherName.split(',')[0]}</span>
                  </button>
                </div>

                {/* Result Sub-tabs */}
                <div className="inline-flex p-1 bg-slate-200/80 rounded-lg text-xs font-medium self-start sm:self-auto">
                  <button
                    onClick={() => setResultSubTab('rpp')}
                    className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                      resultSubTab === 'rpp'
                        ? 'bg-white text-slate-900 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-teal-700" />
                    <span>Bagian 1: RPP Mendalam</span>
                  </button>
                  <button
                    onClick={() => setResultSubTab('bahan_ajar')}
                    className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                      resultSubTab === 'bahan_ajar'
                        ? 'bg-white text-slate-900 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                    <span>Bagian 2: Paket Bahan Ajar</span>
                  </button>
                  <button
                    onClick={() => setResultSubTab('unified')}
                    className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                      resultSubTab === 'unified'
                        ? 'bg-white text-slate-900 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-700" />
                    <span>Dokumen Cetak Utuh</span>
                  </button>
                  <button
                    onClick={() => setResultSubTab('rubric')}
                    className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                      resultSubTab === 'rubric'
                        ? 'bg-white text-slate-900 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5 text-sky-700" />
                    <span>Penilai Rubrik</span>
                  </button>
                </div>
              </div>

              {/* SubTab Views */}
              {resultSubTab === 'rpp' && (
                <RppView
                  rppMarkdown={splitContent.rppMarkdown}
                  onCopy={() => handleCopy(splitContent.rppMarkdown)}
                  copied={copied}
                  onPrint={handlePrint}
                  onExportWord={() =>
                    exportToWordDoc(
                      `RPP_${generationResult.atpData.target_kelas}_${generationResult.atpData.elemen}`,
                      splitContent.rppMarkdown,
                      signatoryConfig
                    )
                  }
                  signatoryConfig={signatoryConfig}
                />
              )}

              {resultSubTab === 'bahan_ajar' && (
                <BahanAjarView
                  bahanAjarMarkdown={splitContent.bahanAjarMarkdown}
                  onCopy={() => handleCopy(splitContent.bahanAjarMarkdown)}
                  copied={copied}
                  onPrint={handlePrint}
                  onExportWord={() =>
                    exportToWordDoc(
                      `BahanAjar_${generationResult.atpData.target_kelas}_${generationResult.atpData.elemen}`,
                      splitContent.bahanAjarMarkdown,
                      signatoryConfig
                    )
                  }
                  onExportPptx={handleExportPptx}
                  signatoryConfig={signatoryConfig}
                />
              )}

              {resultSubTab === 'unified' && (
                <UnifiedDocumentView
                  markdown={generationResult.rawMarkdown}
                  atpData={generationResult.atpData}
                  onCopy={() => handleCopy(generationResult.rawMarkdown)}
                  copied={copied}
                  onPrint={handlePrint}
                  onExportWord={() =>
                    exportToWordDoc(
                      `RPP_Lengkap_${generationResult.atpData.target_kelas}_${generationResult.atpData.elemen}`,
                      generationResult.rawMarkdown,
                      signatoryConfig
                    )
                  }
                  onExportMarkdown={() =>
                    exportToMarkdownFile(
                      `RPP_Lengkap_${generationResult.atpData.target_kelas}_${generationResult.atpData.elemen}`,
                      generationResult.rawMarkdown
                    )
                  }
                  onExportPptx={handleExportPptx}
                  signatoryConfig={signatoryConfig}
                />
              )}

              {resultSubTab === 'rubric' && (
                <InteractiveRubricScorer atpData={generationResult.atpData} />
              )}
            </div>
          </div>
        )}

        {/* Navigation Tab: KATALOG ATP PAI */}
        {activeNavTab === 'catalog' && (
          <CatalogBrowser
            catalogItems={catalogItems}
            isSupabaseConnected={isSupabaseConnected}
            onSelectAtp={(atp) => {
              setCurrentAtp(atp);
              setActiveNavTab('generator');
            }}
            onGenerateDirect={(atp) => {
              setCurrentAtp(atp);
              handleGenerate(atp);
            }}
            onOpenConfig={() => {
              setActiveNavTab('generator');
            }}
          />
        )}

        {/* Navigation Tab: PENILAI RUBRIK */}
        {activeNavTab === 'rubric-tool' && (
          <div className="space-y-4">
            <InteractiveRubricScorer atpData={currentAtp} />
          </div>
        )}

        {/* Navigation Tab: PANDUAN FORMAT */}
        {activeNavTab === 'guide' && <StandardGuide />}
      </main>

      {/* Modal Pengesahan Guru & Kepala Sekolah */}
      <SignatoryModal
        isOpen={isSignatoryOpen}
        onClose={() => setIsSignatoryOpen(false)}
        config={signatoryConfig}
        onSave={handleSaveSignatory}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">EduCraft AI</span>
            <span>· Generator RPP Mendalam & Bahan Ajar PAI</span>
          </div>
          <div>
            <span>Data Terintegrasi Supabase: </span>
            <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-700">master_atp_pai</code>
          </div>
        </div>
      </footer>
    </div>
  );
}
