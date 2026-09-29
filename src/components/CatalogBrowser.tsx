import React, { useState } from 'react';
import { MasterAtpRecord } from '../types';
import { Search, Sparkles, BookOpen, Database, CheckCircle2 } from 'lucide-react';

interface CatalogBrowserProps {
  catalogItems: MasterAtpRecord[];
  isSupabaseConnected: boolean;
  onSelectAtp: (atp: MasterAtpRecord) => void;
  onGenerateDirect: (atp: MasterAtpRecord) => void;
  onOpenConfig: () => void;
}

export const CatalogBrowser: React.FC<CatalogBrowserProps> = ({
  catalogItems,
  isSupabaseConnected,
  onSelectAtp,
  onGenerateDirect,
  onOpenConfig,
}) => {
  const [search, setSearch] = useState<string>('');
  const [faseFilter, setFaseFilter] = useState<string>('all');
  const [elemenFilter, setElemenFilter] = useState<string>('all');

  const filtered = catalogItems.filter((item) => {
    const matchSearch =
      (item.tujuan_pembelajaran || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.capaian_pembelajaran || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.elemen || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.target_kelas || '').toLowerCase().includes(search.toLowerCase());
    const matchFase = faseFilter === 'all' || item.fase === faseFilter;
    const matchElemen = elemenFilter === 'all' || item.elemen === elemenFilter;
    return matchSearch && matchFase && matchElemen;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Database className="w-5 h-5 text-teal-700" />
              <span>Katalog ATP PAI (Supabase master_atp_pai)</span>
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Daftar materi pembelajaran yang diambil langsung dari database Supabase Anda. Klik salah satu kartu untuk langsung menyusun RPP Mendalam dan Bahan Ajar.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isSupabaseConnected ? (
              <span className="text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Terhubung ke Supabase ({catalogItems.length} Materi)</span>
              </span>
            ) : (
              <button
                onClick={onOpenConfig}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>Atur Koneksi Supabase</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter controls */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari materi, TP, surah..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/20"
            />
          </div>
          <div>
            <select
              value={faseFilter}
              onChange={(e) => setFaseFilter(e.target.value)}
              aria-label="Filter Fase Pembelajaran"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
            >
              <option value="all">Semua Fase (Fase A - D)</option>
              <option value="Fase A">Fase A (Kelas 1-2 SD)</option>
              <option value="Fase B">Fase B (Kelas 3-4 SD)</option>
              <option value="Fase C">Fase C (Kelas 5-6 SD)</option>
              <option value="Fase D">Fase D (Kelas 7-9 SMP)</option>
            </select>
          </div>
          <div>
            <select
              value={elemenFilter}
              onChange={(e) => setElemenFilter(e.target.value)}
              aria-label="Filter Elemen PAI"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
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
      </div>

      {/* Grid of Catalog Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-xs text-slate-500">
          Tidak ada data materi yang cocok dengan pencarian.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item, idx) => (
            <div
              key={item.id || `${item.no_atp}-${idx}`}
              className="bg-white p-5 rounded-xl border border-slate-200 hover:border-teal-500/80 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                      {item.fase}
                    </span>
                    <span className="font-semibold text-slate-800">{item.target_kelas}</span>
                  </div>
                  <span className="font-mono text-slate-400">ATP #{item.no_atp}</span>
                </div>

                <div className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>{item.elemen}</span>
                </div>

                <div className="mb-3">
                  <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wide block mb-0.5">
                    Tujuan Pembelajaran (TP dari Supabase):
                  </span>
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
                  className="text-xs font-semibold text-slate-700 hover:text-teal-800 py-1.5 transition-colors"
                >
                  Pilih ke Generator
                </button>
                <button
                  onClick={() => onGenerateDirect(item)}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-200" />
                  <span>Susun RPP</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
