import React from 'react';
import { Printer, Sparkles, UserCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onPrint: () => void;
  hasResult: boolean;
  onOpenSignatory: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onPrint,
  hasResult,
  onOpenSignatory,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-700 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              <span className="font-amiri text-xl">إ</span>
            </div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('generator');
              }}
              className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5"
            >
              <span>EduCraft AI</span>
              <span className="text-xs font-normal text-teal-800 bg-teal-50 border border-teal-200/60 rounded px-1.5 py-0.5">PAI</span>
            </a>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('generator')}
              className={`transition-colors pb-1 border-b-2 text-left ${
                activeTab === 'generator'
                  ? 'text-teal-800 border-teal-700 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Generator RPP
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`transition-colors pb-1 border-b-2 text-left ${
                activeTab === 'catalog'
                  ? 'text-teal-800 border-teal-700 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Katalog ATP PAI
            </button>
            <button
              onClick={() => setActiveTab('rubric-tool')}
              className={`transition-colors pb-1 border-b-2 text-left ${
                activeTab === 'rubric-tool'
                  ? 'text-teal-800 border-teal-700 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Penilai Rubrik
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`transition-colors pb-1 border-b-2 text-left ${
                activeTab === 'guide'
                  ? 'text-teal-800 border-teal-700 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Format Standar
            </button>
          </nav>

          {/* Action Zone */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Tombol Pengesahan Resmi */}
            <button
              onClick={onOpenSignatory}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors whitespace-nowrap shadow-2xs"
              title="Atur Nama & NIP Guru PAI serta Kepala Sekolah"
            >
              <UserCheck className="w-3.5 h-3.5 text-teal-700" />
              <span className="hidden sm:inline">Pengesahan</span>
              <span className="sm:hidden">TTD</span>
            </button>

            {hasResult && (
              <button
                onClick={onPrint}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
                title="Cetak format A4 resmi"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak / PDF</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('generator')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors whitespace-nowrap shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-200" />
              <span>Susun RPP Baru</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
