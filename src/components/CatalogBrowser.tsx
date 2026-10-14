import React, { useState } from 'react';
import { MasterAtpRecord } from '../types';
import { matchFase, matchKelas, matchElemen } from '../utils/curriculumMapper';
import {
  Search,
  Sparkles,
  BookOpen,
  Database,
  CheckCircle2,
  LayoutGrid,
  Table,
  ArrowRight,
  FilterX,
} from 'lucide-react';

interface CatalogBrowserProps {
  catalogItems: MasterAtpRecord[];
  isSupabaseConnected: boolean;
  onSelectAtp: (atp: MasterAtpRecord) => void;
  onGenerateDirect: (atp: MasterAtpRecord) => void;
  onOpenConfig: () => void;
  onRestoreMasterCatalog?: () => void;
}

export const CatalogBrowser: React.FC<CatalogBrowserProps> = ({
  catalogItems,
  isSupabaseConnected,
  onSelectAtp,
  onGenerateDirect,
  onOpenConfig,
  onRestoreMasterCatalog,
}) => {
  const [search, setSearch] = useState<string>('');
  const [faseFilter, setFaseFilter] = useState<string>('all');
  const [kelasFilter, setKelasFilter] = useState<string>('all');
  const [elemenFilter, setElemenFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Intelligent filter matcher that supports Roman, Arabic, and fuzzy text
  const filtered = catalogItems.filter((item) => {
    const matchSearch =
      (item.tujuan_pembelajaran || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.materi || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.lingkup_materi || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.capaian_pembelajaran || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.elemen || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.target_kelas || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.no_atp || '').toLowerCase().includes(search.toLowerCase());

    const matchF = matchFase(item.fase, faseFilter);
    const matchK = matchKelas(item.target_kelas, kelasFilter);
    const matchE = matchElemen(item.elemen, elemenFilter);

    return matchSearch && matchF && matchK && matchE;
  });

  const isFiltered =
    faseFilter !== 'all' ||
    kelasFilter !== 'all' ||
    elemenFilter !== 'all' ||
    search.trim() !== '';

  const handleResetFilter = () => {
    setFaseFilter('all');
    setKelasFilter('all');
    setElemenFilter('all');
    setSearch('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Database className="w-5 h-5 text-teal-700" />
              <span>Katalog Materi & ATP PAI (Supabase)</span>
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Daftar materi pembelajaran lengkap yang tersinkronisasi langsung dari database Supabase Anda. Anda dapat menyaring berdasarkan Fase dan Tingkat Kelas secara presisi.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isSupabaseConnected ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>Supabase Aktif ({catalogItems.length} TP)</span>
                </span>
                <button
                  onClick={onOpenConfig}
                  title="Ubah URL atau Kunci Supabase"
                  className="text-xs font-medium text-slate-600 hover:text-teal-700 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer hover:border-teal-300"
                >
                  Ubah Kunci
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                  <span>Katalog Bawaan ({catalogItems.length} TP)</span>
                </span>
                <button
                  onClick={onOpenConfig}
                  className="text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Hubungkan Supabase</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filter controls */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari materi pokok, TP, surah..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
            />
          </div>
          <div>
            <select
              value={faseFilter}
              onChange={(e) => setFaseFilter(e.target.value)}
              aria-label="Filter Fase Pembelajaran"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
            >
              <option value="all">Semua Fase ({catalogItems.length})</option>
              <option value="Fase A">
                Fase A (Kelas 1-2 SD: {catalogItems.filter((i) => matchFase(i.fase, 'Fase A')).length})
              </option>
              <option value="Fase B">
                Fase B (Kelas 3-4 SD: {catalogItems.filter((i) => matchFase(i.fase, 'Fase B')).length})
              </option>
              <option value="Fase C">
                Fase C (Kelas 5-6 SD: {catalogItems.filter((i) => matchFase(i.fase, 'Fase C')).length})
              </option>
            </select>
          </div>
          <div>
            <select
              value={kelasFilter}
              onChange={(e) => setKelasFilter(e.target.value)}
              aria-label="Filter Tingkat Kelas"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
            >
              <option value="all">Semua Kelas ({catalogItems.length})</option>
              <option value="Kelas I">
                Kelas I ({catalogItems.filter((i) => matchKelas(i.target_kelas, 'Kelas I')).length})
              </option>
              <option value="Kelas II">
                Kelas II ({catalogItems.filter((i) => matchKelas(i.target_kelas, 'Kelas II')).length})
              </option>
              <option value="Kelas III">
                Kelas III ({catalogItems.filter((i) => matchKelas(i.target_kelas, 'Kelas III')).length})
              </option>
              <option value="Kelas IV">
                Kelas IV ({catalogItems.filter((i) => matchKelas(i.target_kelas, 'Kelas IV')).length})
              </option>
              <option value="Kelas V">
                Kelas V ({catalogItems.filter((i) => matchKelas(i.target_kelas, 'Kelas V')).length})
              </option>
              <option value="Kelas VI">
                Kelas VI ({catalogItems.filter((i) => matchKelas(i.target_kelas, 'Kelas VI')).length})
              </option>
            </select>
          </div>
          <div>
            <select
              value={elemenFilter}
              onChange={(e) => setElemenFilter(e.target.value)}
              aria-label="Filter Elemen PAI"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
            >
              <option value="all">Semua Elemen PAI</option>
              <option value="Al-Qur'an dan Hadis">Al-Qur'an dan Hadis</option>
              <option value="Akidah">Akidah</option>
              <option value="Akhlak">Akhlak</option>
              <option value="Fikih">Fikih</option>
              <option value="Sejarah Peradaban Islam">Sejarah Peradaban Islam</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Badges for Fase A, B, C and Kelas III, IV */}
        {(() => {
          const countFaseA = catalogItems.filter((i) => matchFase(i.fase, 'Fase A')).length;
          const countFaseB = catalogItems.filter((i) => matchFase(i.fase, 'Fase B')).length;
          const countFaseC = catalogItems.filter((i) => matchFase(i.fase, 'Fase C')).length;
          const countKelas3 = catalogItems.filter((i) => matchKelas(i.target_kelas, 'Kelas III')).length;
          const countKelas4 = catalogItems.filter((i) => matchKelas(i.target_kelas, 'Kelas IV')).length;

          return (
            <div className="mt-3 p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-bold text-slate-800 flex items-center gap-1 mr-1">
                  <span>📚 Total: {catalogItems.length} TP</span>
                  {catalogItems.length >= 80 && (
                    <span className="text-[10px] bg-teal-100 text-teal-800 font-semibold px-1.5 py-0.5 rounded">
                      ✓ Lengkap Kelas 1-6 SD
                    </span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setFaseFilter('all');
                    setKelasFilter('all');
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    faseFilter === 'all' && kelasFilter === 'all'
                      ? 'bg-teal-700 text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Semua ({catalogItems.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFaseFilter('Fase A');
                    setKelasFilter('all');
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    faseFilter === 'Fase A' && kelasFilter === 'all'
                      ? 'bg-teal-700 text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Fase A ({countFaseA})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFaseFilter('Fase B');
                    setKelasFilter('all');
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    faseFilter === 'Fase B' && kelasFilter === 'all'
                      ? 'bg-teal-700 text-white font-bold ring-2 ring-teal-500/30'
                      : 'bg-white border border-teal-300 text-teal-900 font-semibold hover:bg-teal-50'
                  }`}
                >
                  Fase B (Total: {countFaseB})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFaseFilter('Fase C');
                    setKelasFilter('all');
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    faseFilter === 'Fase C' && kelasFilter === 'all'
                      ? 'bg-teal-700 text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Fase C ({countFaseC})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFaseFilter('Fase B');
                    setKelasFilter('Kelas III');
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    kelasFilter === 'Kelas III'
                      ? 'bg-amber-600 text-white font-bold'
                      : 'bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100'
                  }`}
                >
                  Kelas III ({countKelas3})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFaseFilter('Fase B');
                    setKelasFilter('Kelas IV');
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    kelasFilter === 'Kelas IV'
                      ? 'bg-amber-600 text-white font-bold'
                      : 'bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100'
                  }`}
                >
                  Kelas IV ({countKelas4})
                </button>
              </div>

              {onRestoreMasterCatalog && (
                <button
                  type="button"
                  onClick={onRestoreMasterCatalog}
                  title="Muat ulang seluruh Tujuan Pembelajaran resmi Kurikulum Merdeka PAI SD (Fase A, B, C)"
                  className="text-[11px] font-semibold text-teal-800 bg-white border border-teal-300 hover:bg-teal-50 px-2 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>⚡ Muat Master Lengkap (120 TP)</span>
                </button>
              )}
            </div>
          );
        })()}

        {/* Status & View Mode Switcher */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="font-semibold text-slate-800">
              Menampilkan {filtered.length} dari {catalogItems.length} materi
            </span>
            {isFiltered && (
              <button
                onClick={handleResetFilter}
                className="text-teal-700 hover:text-teal-900 underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <FilterX className="w-3 h-3" />
                <span>Reset Filter</span>
              </button>
            )}
          </div>

          <div className="inline-flex p-1 bg-slate-100 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-teal-700" />
              <span>Kartu Grid</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table className="w-3.5 h-3.5 text-teal-700" />
              <span>Tabel Lengkap ({filtered.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-xs text-slate-500 space-y-2">
          <p className="font-semibold text-slate-700 text-sm">Tidak ada materi yang cocok dengan pencarian atau filter Anda.</p>
          <p>Cobalah menyetel ulang filter atau menggunakan kata kunci pencarian lain.</p>
          {isFiltered && (
            <button
              onClick={handleResetFilter}
              className="mt-2 px-3 py-1.5 bg-teal-50 border border-teal-200 text-teal-800 rounded-lg font-semibold cursor-pointer"
            >
              Tampilkan Semua Materi ({catalogItems.length})
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid of Catalog Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item, idx) => (
            <div
              key={item.id || `${item.no_atp}-${idx}`}
              className="bg-white p-5 rounded-xl border border-slate-200 hover:border-teal-500/80 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                      {item.fase}
                    </span>
                    <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      {item.target_kelas}
                    </span>
                  </div>
                  <span className="font-mono text-slate-400">ATP #{item.no_atp}</span>
                </div>

                <div className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>{item.elemen}</span>
                </div>

                {/* Materi Pokok / Lingkup Materi */}
                {(item.materi || item.lingkup_materi) && (
                  <div className="mb-2.5 p-2 bg-amber-50/80 border border-amber-200 rounded-lg">
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide block mb-0.5">
                      Materi Pokok / Lingkup Materi:
                    </span>
                    <p className="text-xs font-bold text-amber-950">
                      {item.materi || item.lingkup_materi}
                    </p>
                  </div>
                )}

                <div className="mb-3">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wide">
                      Tujuan Pembelajaran (TP):
                    </span>
                    {item.tp_hasil_analisis && (
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.2 rounded border border-emerald-200 shrink-0">
                        tp hasil analisis
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed font-semibold">
                    {item.tujuan_pembelajaran}
                  </p>
                </div>

                <div className="mb-4">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide block mb-0.5">
                    Capaian Pembelajaran (CP dari Supabase):
                  </span>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed bg-slate-50 p-2 rounded border border-slate-100">
                    {item.capaian_pembelajaran}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectAtp(item)}
                  className="text-xs font-semibold text-slate-700 hover:text-teal-800 py-1.5 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Pilih ke Generator</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </button>
                <button
                  onClick={() => onGenerateDirect(item)}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-200" />
                  <span>Susun RPP</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Full Curriculum Data Table View */
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                  <th className="p-3 w-16">No ATP</th>
                  <th className="p-3 w-28">Fase / Kelas</th>
                  <th className="p-3 w-36">Elemen</th>
                  <th className="p-3 w-48">Materi Pokok</th>
                  <th className="p-3 min-w-[240px]">Tujuan Pembelajaran (TP)</th>
                  <th className="p-3 min-w-[200px]">Capaian Pembelajaran (CP)</th>
                  <th className="p-3 w-32 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item, idx) => (
                  <tr
                    key={item.id || `${item.no_atp}-${idx}`}
                    className="hover:bg-teal-50/40 transition-colors"
                  >
                    <td className="p-3 font-mono font-bold text-slate-600 align-top">
                      {item.no_atp}
                    </td>
                    <td className="p-3 align-top">
                      <span className="font-bold text-teal-800 block">{item.fase}</span>
                      <span className="text-slate-600 text-[11px] block">{item.target_kelas}</span>
                    </td>
                    <td className="p-3 font-semibold text-slate-800 align-top">
                      {item.elemen}
                    </td>
                    <td className="p-3 align-top">
                      {item.materi || item.lingkup_materi ? (
                        <span className="font-bold text-amber-950 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded block text-[11px]">
                          {item.materi || item.lingkup_materi}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">-</span>
                      )}
                    </td>
                    <td className="p-3 align-top">
                      <div className="flex items-center gap-1.5 mb-1">
                        {item.tp_hasil_analisis && (
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.2 rounded border border-emerald-200">
                            tp hasil analisis
                          </span>
                        )}
                      </div>
                      <p className="text-slate-800 font-medium leading-relaxed">
                        {item.tujuan_pembelajaran}
                      </p>
                    </td>
                    <td className="p-3 align-top text-slate-600 line-clamp-3 leading-relaxed text-[11px]">
                      {item.capaian_pembelajaran}
                    </td>
                    <td className="p-3 align-top text-center space-y-1.5">
                      <button
                        onClick={() => onSelectAtp(item)}
                        className="w-full px-2.5 py-1 text-[11px] font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded transition-colors cursor-pointer"
                      >
                        Pilih
                      </button>
                      <button
                        onClick={() => onGenerateDirect(item)}
                        className="w-full px-2.5 py-1 text-[11px] font-bold text-white bg-teal-700 hover:bg-teal-800 rounded transition-colors inline-flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                      >
                        <Sparkles className="w-3 h-3 text-teal-200" />
                        <span>RPP</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
