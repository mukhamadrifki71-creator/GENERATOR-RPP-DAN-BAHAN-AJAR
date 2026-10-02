import React, { useState, useEffect } from 'react';
import { MasterAtpRecord, GenerationOptions } from '../types';
import {
  Database,
  Code,
  SlidersHorizontal,
  CheckCircle2,
  RefreshCw,
  Search,
  Sparkles,
  Settings,
  HelpCircle,
  ShieldCheck,
  Eye,
  EyeOff,
  Trash2,
  Lock,
} from 'lucide-react';

interface AtpInputStationProps {
  currentAtp: MasterAtpRecord;
  setCurrentAtp: (atp: MasterAtpRecord) => void;
  options: GenerationOptions;
  setOptions: React.Dispatch<React.SetStateAction<GenerationOptions>>;
  onGenerate: () => void;
  isLoading: boolean;
  catalogItems: MasterAtpRecord[];
  setCatalogItems: React.Dispatch<React.SetStateAction<MasterAtpRecord[]>>;
  isSupabaseConnected: boolean;
  onRefreshSupabase: (url: string, key: string, table: string, cpTable?: string) => Promise<boolean>;
  onDisconnectSupabase?: () => void;
  supabaseError: string;
}

export const AtpInputStation: React.FC<AtpInputStationProps> = ({
  currentAtp,
  setCurrentAtp,
  options,
  setOptions,
  onGenerate,
  isLoading,
  catalogItems,
  setCatalogItems,
  isSupabaseConnected,
  onRefreshSupabase,
  onDisconnectSupabase,
  supabaseError,
}) => {
  // Only 2 simple modes: 'catalog' (from Supabase) and 'json' (quick paste)
  const [inputMode, setInputMode] = useState<'catalog' | 'json'>('catalog');
  const [jsonInput, setJsonInput] = useState<string>('');
  const [jsonError, setJsonError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterFase, setFilterFase] = useState<string>('all');
  const [filterElemen, setFilterElemen] = useState<string>('all');

  // Supabase credentials state - loaded directly from persistent localStorage
  const [showConfig, setShowConfig] = useState<boolean>(() => {
    // Keep config hidden if credentials already exist
    const hasKey = !!localStorage.getItem('educraft_sb_key');
    const hasCached = !!localStorage.getItem('educraft_cached_catalog');
    return !(hasKey || hasCached);
  });
  const [sbUrl, setSbUrl] = useState<string>(() => localStorage.getItem('educraft_sb_url') || '');
  const [sbKey, setSbKey] = useState<string>(() => localStorage.getItem('educraft_sb_key') || '');
  const [sbTable, setSbTable] = useState<string>(() => localStorage.getItem('educraft_sb_table') || 'master_atp_pai');
  const [sbCpTable, setSbCpTable] = useState<string>(() => localStorage.getItem('educraft_sb_cp_table') || 'master_cp_pai');
  const [sbLoading, setSbLoading] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [showKey, setShowKey] = useState<boolean>(false);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');

  // Update and immediately persist credentials to localStorage
  const handleUrlChange = (val: string) => {
    let clean = val.trim();
    const m = clean.match(/supabase\.com\/dashboard\/project\/([a-zA-Z0-9_-]+)/i);
    if (m && m[1]) clean = `https://${m[1]}.supabase.co`;
    clean = clean.replace(/\/rest\/v1.*$/i, '');
    setSbUrl(clean);
    localStorage.setItem('educraft_sb_url', clean);
  };

  const handleKeyChange = (val: string) => {
    const clean = val.trim().replace(/^['"]|['"]$/g, '');
    setSbKey(clean);
    localStorage.setItem('educraft_sb_key', clean);
  };

  const handleTableChange = (val: string) => {
    const clean = val.trim();
    setSbTable(clean);
    localStorage.setItem('educraft_sb_table', clean);
  };

  const handleCpTableChange = (val: string) => {
    const clean = val.trim();
    setSbCpTable(clean);
    localStorage.setItem('educraft_sb_cp_table', clean);
  };

  const handleSync = async () => {
    if (!sbUrl.trim() || !sbKey.trim()) {
      setShowConfig(true);
      return;
    }
    setSbLoading(true);
    setSaveSuccessMsg('');
    const success = await onRefreshSupabase(
      sbUrl.trim(),
      sbKey.trim(),
      sbTable.trim(),
      sbCpTable.trim()
    );
    setSbLoading(false);
    if (success) {
      setShowConfig(false);
      setSaveSuccessMsg('✓ Data dan Kunci Supabase berhasil disimpan permanen!');
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    }
  };

  const handleDisconnect = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kunci Supabase yang tersimpan dari browser ini?')) {
      setSbUrl('');
      setSbKey('');
      setSbTable('master_atp_pai');
      setSbCpTable('master_cp_pai');
      if (onDisconnectSupabase) {
        onDisconnectSupabase();
      }
      setShowConfig(true);
    }
  };

  // Filter catalog
  const filteredCatalog = catalogItems.filter((item) => {
    const matchSearch =
      (item.tujuan_pembelajaran || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.capaian_pembelajaran || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.elemen || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.target_kelas || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchFase = filterFase === 'all' || item.fase === filterFase;
    const matchElemen = filterElemen === 'all' || item.elemen === filterElemen;
    return matchSearch && matchFase && matchElemen;
  });

  const handleParseJson = () => {
    setJsonError('');
    if (!jsonInput.trim()) {
      setJsonError('Silakan masukkan teks JSON data dari Supabase.');
      return;
    }
    try {
      const parsed = JSON.parse(jsonInput);
      let recordList: any[] = [];
      if (Array.isArray(parsed)) {
        if (parsed.length === 0) throw new Error('Array JSON kosong.');
        recordList = parsed;
      } else if (typeof parsed === 'object' && parsed !== null) {
        recordList = [parsed];
      }

      const formatted: MasterAtpRecord[] = recordList.map((r, i) => ({
        id: r.id || `json-${i}`,
        fase: r.fase || 'Fase B',
        elemen: r.elemen || 'Al-Qur\'an dan Hadis',
        capaian_pembelajaran: r.capaian_pembelajaran || r.cp || '',
        tujuan_pembelajaran: r.tujuan_pembelajaran || r.tp || '',
        target_kelas: r.target_kelas || r.kelas || 'Kelas IV',
        no_atp: String(r.no_atp || r.nomor || `${i + 1}.1`),
        alur_tujuan_pembelajaran: r.alur_tujuan_pembelajaran || r.atp || r.tujuan_pembelajaran || '',
      }));

      if (formatted.length > 0) {
        setCatalogItems(formatted);
        setCurrentAtp(formatted[0]);
        setInputMode('catalog');
        setJsonError('');
      }
    } catch (e: any) {
      setJsonError('Gagal memproses JSON: ' + (e.message || 'Periksa kembali format JSON'));
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden no-print">
      {/* Top Banner: Mode & Supabase Status */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex flex-wrap items-center gap-2">
              <Database className="w-4 h-4 text-teal-700" />
              <span>Katalog ATP PAI (Data Supabase)</span>
              {isSupabaseConnected ? (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Terhubung ({catalogItems.length} Materi)</span>
                  </span>
                  <span className="text-[10px] text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1" title="Kunci tersimpan permanen di browser ini">
                    <ShieldCheck className="w-3 h-3 text-teal-600" />
                    <span>Kunci Tersimpan Permanen</span>
                  </span>
                  <button
                    onClick={handleSync}
                    disabled={sbLoading}
                    className="text-[10px] font-medium text-teal-800 hover:text-teal-900 bg-white border border-teal-200 hover:bg-teal-50 px-2 py-0.5 rounded-md inline-flex items-center gap-1 transition-colors shadow-2xs cursor-pointer"
                    title="Tarik data terbaru dari Supabase tanpa perlu mengisi ulang kunci"
                  >
                    <RefreshCw className={`w-3 h-3 ${sbLoading ? 'animate-spin text-teal-600' : ''}`} />
                    <span>{sbLoading ? 'Menyinkronkan...' : 'Sinkron Ulang'}</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-medium text-amber-800 bg-amber-100/70 border border-amber-200 px-2 py-0.5 rounded-full">
                    Katalog Standar (84 Data)
                  </span>
                  <button
                    onClick={() => setShowConfig(true)}
                    className="text-[10px] font-semibold text-teal-800 hover:underline cursor-pointer"
                  >
                    + Hubungkan Supabase
                  </button>
                </div>
              )}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih materi dari database Supabase Anda untuk langsung menyusun RPP Mendalam & Bahan Ajar.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Simple Mode Toggle */}
            <div className="inline-flex p-1 bg-slate-200/80 rounded-lg text-xs font-medium">
              <button
                onClick={() => setInputMode('catalog')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  inputMode === 'catalog'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Katalog Supabase
              </button>
              <button
                onClick={() => setInputMode('json')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  inputMode === 'json'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tempel JSON
              </button>
            </div>

            <button
              onClick={() => setShowConfig(!showConfig)}
              className="p-1.5 text-xs text-slate-600 hover:text-teal-800 bg-white border border-slate-200 rounded-lg shadow-2xs hover:bg-slate-50 transition-colors flex items-center gap-1 cursor-pointer"
              title={showConfig ? 'Tutup Pengaturan' : 'Pengaturan Koneksi Supabase'}
            >
              <Settings className="w-4 h-4" />
              <span className="text-[11px] font-medium hidden sm:inline">
                {isSupabaseConnected ? 'Kunci Tersimpan' : 'Atur Kunci'}
              </span>
            </button>
          </div>
        </div>

        {/* Compact Supabase Connection Bar */}
        {showConfig && (
          <div className="mt-4 pt-3 border-t border-slate-200/80 bg-white p-3.5 rounded-lg border border-teal-200 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-teal-700" />
                <span>Koneksi Supabase Anda:</span>
                <span className="text-[10px] font-normal text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Otomatis Tersimpan Permanen</span>
                </span>
              </span>
              <div className="flex items-center gap-2">
                {sbKey && (
                  <button
                    onClick={handleDisconnect}
                    className="text-[11px] text-rose-600 hover:text-rose-800 hover:underline flex items-center gap-1 cursor-pointer"
                    title="Hapus kunci tersimpan dari browser"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Hapus Kunci</span>
                  </button>
                )}
                <button
                  onClick={() => setShowHelp(!showHelp)}
                  className="text-[11px] text-teal-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>{showHelp ? 'Tutup Petunjuk' : 'Di mana cari URL & Key?'}</span>
                </button>
              </div>
            </div>

            {saveSuccessMsg && (
              <div className="mb-2.5 p-2 bg-emerald-50 border border-emerald-200 rounded text-[11px] text-emerald-800 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            {showHelp && (
              <div className="mb-3 p-2.5 bg-teal-50 border border-teal-200 rounded text-[11px] text-slate-700 space-y-1">
                <p>1. Buka <strong>Supabase Dashboard &gt; Project Settings &gt; API</strong>.</p>
                <p>2. Salin <strong>Project URL</strong> (contoh: <code className="bg-white px-1 py-0.5 rounded text-teal-900">https://xyz.supabase.co</code>).</p>
                <p>3. Salin <strong>Project API Keys</strong> baris <strong>anon / public</strong>.</p>
                <p>4. Nama tabel default: <code className="bg-white px-1 py-0.5 rounded text-teal-900">master_atp_pai</code>.</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
              <div className="sm:col-span-4">
                <label className="text-[10px] text-slate-500 font-semibold mb-0.5 block">
                  Project URL Supabase:
                </label>
                <input
                  type="text"
                  placeholder="https://xyz.supabase.co"
                  value={sbUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600"
                />
              </div>

              <div className="sm:col-span-3">
                <div className="flex items-center justify-between mb-0.5">
                  <label className="text-[10px] text-slate-500 font-semibold block">
                    API Key (Anon / Public):
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="text-[10px] text-slate-500 hover:text-teal-700 flex items-center gap-0.5 cursor-pointer"
                    title={showKey ? 'Sembunyikan kunci' : 'Tampilkan kunci'}
                  >
                    {showKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showKey ? 'Tutup' : 'Lihat'}</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    placeholder="eyJhbGciOi..."
                    value={sbKey}
                    onChange={(e) => handleKeyChange(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md font-mono focus:outline-none focus:ring-1 focus:ring-teal-600 pr-7"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <Lock className="w-3 h-3" />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] text-slate-500 font-semibold mb-0.5 block">
                  Tabel ATP:
                </label>
                <input
                  type="text"
                  placeholder="master_atp_pai"
                  value={sbTable}
                  onChange={(e) => handleTableChange(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md font-mono focus:outline-none focus:ring-1 focus:ring-teal-600"
                  title="Nama tabel Tujuan Pembelajaran (ATP) di Supabase"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] text-teal-800 font-semibold mb-0.5 block">
                  Tabel CP (Opsional):
                </label>
                <input
                  type="text"
                  placeholder="master_cp_pai"
                  value={sbCpTable}
                  onChange={(e) => handleCpTableChange(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md font-mono focus:outline-none focus:ring-1 focus:ring-teal-600"
                  title="Nama tabel Capaian Pembelajaran jika berada di tabel terpisah"
                />
              </div>

              <div className="sm:col-span-1 flex items-end">
                <button
                  onClick={handleSync}
                  disabled={sbLoading}
                  className="w-full px-2 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 disabled:bg-slate-400 rounded-md transition-colors flex items-center justify-center gap-1 whitespace-nowrap shadow-2xs h-[30px] cursor-pointer"
                  title="Tarik data ATP dan Capaian Pembelajaran dari Supabase"
                >
                  {sbLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                  <span>{sbLoading ? '...' : 'Tarik'}</span>
                </button>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] text-slate-500">
              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Kunci Anda tersimpan permanen di browser ini. Anda tidak perlu memasukkannya lagi saat membuka aplikasi berikutnya.</span>
              </span>
              {isSupabaseConnected && (
                <button
                  onClick={() => setShowConfig(false)}
                  className="text-slate-600 hover:text-slate-900 underline font-semibold self-end sm:self-auto cursor-pointer"
                >
                  Tutup Panel
                </button>
              )}
            </div>

            <p className="mt-2 text-[10px] text-slate-500 leading-relaxed">
              💡 <strong>Integrasi CP:</strong> Capaian Pembelajaran (CP) dapat tergabung dalam tabel ATP (kolom <code className="text-teal-900 bg-slate-100 px-1 py-0.2 rounded">capaian_pembelajaran</code>/<code className="text-teal-900 bg-slate-100 px-1 py-0.2 rounded">cp</code>) atau dari tabel terpisah (misal: <code className="text-teal-900 bg-slate-100 px-1 py-0.2 rounded">master_cp_pai</code>). Sistem otomatis mendeteksi dan menghubungkan keduanya.
            </p>

            {supabaseError && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs">
                {supabaseError.includes('RLS_BLOCKED') ? (
                  <>
                    <div className="flex items-start gap-2 mb-1.5">
                      <span className="text-amber-700 font-bold text-sm">⚠️</span>
                      <div>
                        <p className="font-bold text-amber-900 text-xs">
                          Data Terbaca 0 Baris (Terblokir Row Level Security / RLS di Supabase)
                        </p>
                        <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                          Tabel Anda sebenarnya sudah berisi data, namun Supabase secara default memblokir pembacaan via API publik tanpa kebijakan (policy) izin baca.
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 bg-slate-900 text-slate-100 p-2.5 rounded font-mono text-[11px] flex items-center justify-between gap-2 overflow-x-auto">
                      <span>ALTER TABLE {sbTable || 'master_atp_pai'} DISABLE ROW LEVEL SECURITY;</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `ALTER TABLE ${sbTable || 'master_atp_pai'} DISABLE ROW LEVEL SECURITY;\nCREATE POLICY "Izinkan baca ${sbTable || 'master_atp_pai'}" ON ${sbTable || 'master_atp_pai'} FOR SELECT USING (true);`
                          );
                          setCopiedSql(true);
                          setTimeout(() => setCopiedSql(false), 2500);
                        }}
                        className="px-2.5 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded text-[11px] shrink-0 font-sans font-semibold transition-colors"
                      >
                        {copiedSql ? '✓ Tersalin!' : 'Salin Perintah SQL'}
                      </button>
                    </div>

                    <div className="mt-2 text-[11px] text-slate-700 space-y-1">
                      <p>
                        <strong>Langkah Perbaikan (1 Menit):</strong>
                      </p>
                      <ol className="list-decimal pl-5 space-y-0.5 text-slate-600">
                        <li>Buka <strong>Supabase Dashboard &gt; SQL Editor</strong>.</li>
                        <li>Tempelkan perintah di atas, lalu klik <strong>Run</strong>.</li>
                        <li>Kembali ke sini dan klik tombol <strong>"Tarik"</strong> lagi. Data akan langsung muncul!</li>
                      </ol>
                    </div>
                  </>
                ) : (
                  <div className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold text-sm">❌</span>
                    <div>
                      <p className="font-bold text-rose-900 text-xs">Koneksi Supabase Belum Berhasil</p>
                      <p className="text-slate-700 text-[11px] mt-0.5 whitespace-pre-line leading-relaxed">
                        {supabaseError}
                      </p>
                      <p className="text-slate-500 text-[10px] mt-1.5">
                        💡 <em>Tips:</em> Anda juga dapat langsung menyalin teks JSON dari Supabase Table Editor dan menempelkannya pada tab <strong>Tempel JSON</strong> di atas.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mode 1: Catalog View (Directly displaying Supabase Data) */}
      {inputMode === 'catalog' && (
        <div className="p-4 sm:p-5 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari materi, TP, surah di Supabase Anda..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={filterFase}
                onChange={(e) => setFilterFase(e.target.value)}
                aria-label="Filter Fase Pembelajaran"
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
              >
                <option value="all">Semua Fase</option>
                <option value="Fase A">Fase A (Kelas 1-2)</option>
                <option value="Fase B">Fase B (Kelas 3-4)</option>
                <option value="Fase C">Fase C (Kelas 5-6)</option>
                <option value="Fase D">Fase D (SMP)</option>
              </select>
              <select
                value={filterElemen}
                onChange={(e) => setFilterElemen(e.target.value)}
                aria-label="Filter Elemen PAI"
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
              >
                <option value="all">Semua Elemen</option>
                <option value="Al-Qur'an dan Hadis">Al-Qur'an & Hadis</option>
                <option value="Akidah">Akidah</option>
                <option value="Akhlak">Akhlak</option>
                <option value="Fikih">Fikih</option>
                <option value="Sejarah Peradaban Islam">SPI</option>
              </select>
            </div>
          </div>

          {filteredCatalog.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-500">
              Tidak ada materi yang sesuai dengan pencarian atau filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
              {filteredCatalog.map((item, idx) => {
                const isSelected =
                  currentAtp.tujuan_pembelajaran === item.tujuan_pembelajaran &&
                  currentAtp.target_kelas === item.target_kelas;
                return (
                  <div
                    key={item.id || `${item.no_atp}-${idx}`}
                    onClick={() => setCurrentAtp(item)}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-teal-700 bg-teal-50/70 ring-1 ring-teal-700'
                        : 'border-slate-200 hover:border-teal-400 bg-white hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="font-semibold text-teal-800">
                        {item.fase} · {item.target_kelas}
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">
                        ATP {item.no_atp}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-900 mb-1 line-clamp-1">
                      {item.elemen}
                    </div>
                    <div className="mb-1">
                      <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wide block">
                        TP:
                      </span>
                      <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed font-medium">
                        {item.tujuan_pembelajaran}
                      </p>
                    </div>
                    {item.capaian_pembelajaran && (
                      <div className="mt-1 pt-1 border-t border-slate-100">
                        <span className="text-[10px] font-semibold text-slate-500 block">
                          CP Supabase:
                        </span>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {item.capaian_pembelajaran}
                        </p>
                      </div>
                    )}
                    {isSelected && (
                      <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-teal-800">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Materi terpilih untuk disusun</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Paste JSON View */}
      {inputMode === 'json' && (
        <div className="p-4 sm:p-5 border-b border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-teal-700" />
              <span>Tempel Hasil Copy JSON dari Supabase (Single Object atau Array)</span>
            </label>
            <button
              onClick={() => {
                setJsonInput(
                  JSON.stringify(
                    [
                      {
                        fase: 'Fase B',
                        elemen: "Al-Qur'an dan Hadis",
                        capaian_pembelajaran:
                          "Peserta didik mampu membaca surah pendek Al-Qur'an dan memahami hukum tajwid.",
                        tujuan_pembelajaran:
                          'Membaca Q.S. Al-Hujurat/49: 13 dengan tartil dan memahami nilai saling menghargai keragaman.',
                        target_kelas: 'Kelas IV',
                        no_atp: '4.1',
                        alur_tujuan_pembelajaran:
                          'Melafalkan ayat dengan kaidah tajwid dan menyusun komitmen saling menghargai.',
                      },
                    ],
                    null,
                    2
                  )
                );
              }}
              className="text-xs text-teal-700 hover:text-teal-800 hover:underline"
            >
              Isi Contoh JSON
            </button>
          </div>
          <textarea
            rows={5}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder={`[\n  {\n    "fase": "Fase B",\n    "elemen": "Akidah",\n    "capaian_pembelajaran": "...",\n    "tujuan_pembelajaran": "...",\n    "target_kelas": "Kelas IV",\n    "no_atp": "4.2",\n    "alur_tujuan_pembelajaran": "..."\n  }\n]`}
            className="w-full p-3 font-mono text-xs bg-slate-900 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          {jsonError && (
            <p className="text-xs text-rose-600 font-medium mt-1.5">{jsonError}</p>
          )}
          <div className="mt-3 flex justify-end">
            <button
              onClick={handleParseJson}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors shadow-2xs"
            >
              Muat ke Katalog
            </button>
          </div>
        </div>
      )}

      {/* Selected Data Summary & Pedagogical Customizer */}
      <div className="p-4 sm:p-5 bg-white">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
              <span className="font-bold text-slate-800">{currentAtp.fase}</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-teal-800">{currentAtp.target_kelas}</span>
              <span aria-hidden="true">·</span>
              <span className="font-medium text-slate-700">{currentAtp.elemen}</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400 font-mono">No. ATP: {currentAtp.no_atp}</span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wide block mb-0.5">
                Capaian Pembelajaran (CP dari Supabase):
              </span>
              <p className="text-xs text-slate-700 leading-relaxed bg-teal-50/60 p-2.5 rounded-lg border border-teal-200/70 font-medium">
                {currentAtp.capaian_pembelajaran || '(Capaian Pembelajaran sesuai Kurikulum Nasional)'}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block mb-0.5">
                Tujuan Pembelajaran (TP dari Supabase):
              </span>
              <p className="text-sm font-bold text-slate-900 leading-snug">
                {currentAtp.tujuan_pembelajaran}
              </p>
            </div>
          </div>

          {/* Trigger Generate Button */}
          <button
            onClick={onGenerate}
            disabled={isLoading}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 disabled:bg-slate-400 rounded-lg shadow-sm hover:shadow transition-all inline-flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-teal-200" />
                <span>Menyusun RPP & Bahan Ajar...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-teal-200" />
                <span>Susun RPP Mendalam Sekarang</span>
              </>
            )}
          </button>
        </div>

        {/* Pedagogical Fine-tuning Expandable */}
        <details className="mt-4 pt-3 border-t border-slate-100 group">
          <summary className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer list-none flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-teal-700" />
              <span>Opsi Tambahan: Waktu & Strategi Mengajar (Opsional)</span>
            </span>
            <span className="text-[11px] text-teal-700 group-open:rotate-180 transition-transform">▼</span>
          </summary>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Alokasi Waktu Pertemuan
              </label>
              <input
                type="text"
                value={options.duration}
                onChange={(e) => setOptions({ ...options, duration: e.target.value })}
                placeholder="1 x 3 jam pelajaran (105 Menit)"
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Strategi Pedagogis
              </label>
              <select
                value={options.pedagogicalStrategy}
                onChange={(e) => setOptions({ ...options, pedagogicalStrategy: e.target.value })}
                aria-label="Pilihan Strategi Pedagogis"
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              >
                <option value="Storytelling Reflektif & Diskusi Kasus">Storytelling Reflektif & Kasus</option>
                <option value="Problem-Based Learning (PBL) Berorientasi Akhlak">Problem-Based Learning (PBL)</option>
                <option value="Inkuiri Terbimbing & Gallery Walk">Inkuiri Terbimbing & Gallery Walk</option>
                <option value="Model Pembelajaran Saintifik & Role Play">Saintifik & Bermain Peran</option>
                <option value="Project-Based Learning (PjBL) Karya Nyata">Project-Based Learning (PjBL)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Pemanfaatan Digital
              </label>
              <input
                type="text"
                value={options.digitalTool}
                onChange={(e) => setOptions({ ...options, digitalTool: e.target.value })}
                placeholder="Canva Edukasi, Google Slides, Padlet"
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};
