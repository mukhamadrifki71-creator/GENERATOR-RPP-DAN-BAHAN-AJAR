import React, { useState } from 'react';
import { parseMarkdownToHtml, splitGeneratedContent } from '../utils/documentExport';
import { SignatoryBlock } from './SignatoryBlock';
import { SignatoryConfig } from '../types';
import {
  Copy,
  Check,
  FileDown,
  Printer,
  BookOpen,
  ClipboardList,
  HelpCircle,
  Home,
  Presentation,
  Sparkles,
  Layers,
} from 'lucide-react';

interface BahanAjarViewProps {
  bahanAjarMarkdown: string;
  onCopy: () => void;
  copied: boolean;
  onPrint: () => void;
  onExportWord: () => void;
  onExportPptx: () => void;
  signatoryConfig: SignatoryConfig;
}

export const BahanAjarView: React.FC<BahanAjarViewProps> = ({
  bahanAjarMarkdown,
  onCopy,
  copied,
  onPrint,
  onExportWord,
  onExportPptx,
  signatoryConfig,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'all' | 'deep_material' | 'story' | 'lkpd' | 'cards' | 'parents'
  >('all');
  const [pptxLoading, setPptxLoading] = useState<boolean>(false);

  // Extract sections
  const sections = splitGeneratedContent(bahanAjarMarkdown);

  let currentMarkdown = bahanAjarMarkdown;
  if (activeSubTab === 'deep_material') {
    currentMarkdown = sections.summaryMateri || bahanAjarMarkdown;
  } else if (activeSubTab === 'story') {
    currentMarkdown = sections.scenarioCerita || '### 2. Lembar Skenario Cerita / Media Pemantik Pembelajaran\n\n*(Naskah cerita pemantik termuat di tampilan Semua Komponen)*';
  } else if (activeSubTab === 'lkpd') {
    currentMarkdown = sections.lkpd || '### 3. Lembar Kerja Peserta Didik (LKPD) Aplikatif\n\n*(LKPD siap pakai termuat di tampilan Semua Komponen)*';
  } else if (activeSubTab === 'cards') {
    currentMarkdown = sections.kartuInkuiri || '### 4. Kartu Inkuiri & Refleksi Batin Pribadi\n\n*(Kartu inkuiri termuat di tampilan Semua Komponen)*';
  } else if (activeSubTab === 'parents') {
    currentMarkdown = sections.kemitraan || '### 5. Panduan Kemitraan Orang Tua & Pembiasaan di Rumah\n\n*(Panduan orang tua termuat di tampilan Semua Komponen)*';
  }

  const htmlContent = parseMarkdownToHtml(currentMarkdown);

  const handleExportPpt = async () => {
    setPptxLoading(true);
    try {
      await onExportPptx();
    } finally {
      setPptxLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Action Toolbar */}
      <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            BAGIAN 2: Paket Materi & Bahan Ajar Mendalam (EduCraft AI)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* PowerPoint Export Button */}
          <button
            onClick={handleExportPpt}
            disabled={pptxLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 disabled:bg-slate-400 rounded-lg transition-colors shadow-2xs"
            title="Download slide presentasi Microsoft PowerPoint (.pptx)"
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>{pptxLoading ? 'Menyiapkan Slide...' : 'Ekspor ke PowerPoint (.pptx)'}</span>
          </button>

          <button
            onClick={onCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-teal-700" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Tersalin' : 'Salin Bahan Ajar'}</span>
          </button>

          <button
            onClick={onExportWord}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <FileDown className="w-3.5 h-3.5 text-teal-700" />
            <span>Unduh Word (.doc)</span>
          </button>

          <button
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Paket</span>
          </button>
        </div>
      </div>

      {/* 5 Komponen Quick Filter Bar */}
      <div className="p-3 bg-slate-100/70 border-b border-slate-200 flex flex-wrap items-center gap-1.5 no-print">
        <span className="text-xs font-semibold text-slate-600 mr-1 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-slate-500" />
          <span>Tinjau Komponen:</span>
        </span>
        <button
          onClick={() => setActiveSubTab('all')}
          className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
            activeSubTab === 'all'
              ? 'bg-white text-slate-900 shadow-xs font-semibold ring-1 ring-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Semua Komponen
        </button>
        <button
          onClick={() => setActiveSubTab('deep_material')}
          className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors flex items-center gap-1 ${
            activeSubTab === 'deep_material'
              ? 'bg-white text-teal-900 shadow-xs font-semibold ring-1 ring-teal-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Materi Eksploratif 5 Bagian: Konteks Sosial, Rekam Sejarah, Analisis Konseptual, Manifestasi Multidimensi, Relevansi Modern"
        >
          <BookOpen className="w-3 h-3 text-teal-700" />
          <span>1. Materi Mendalam (5 Bagian)</span>
        </button>
        <button
          onClick={() => setActiveSubTab('story')}
          className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors flex items-center gap-1 ${
            activeSubTab === 'story'
              ? 'bg-white text-indigo-900 shadow-xs font-semibold ring-1 ring-indigo-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3 h-3 text-indigo-600" />
          <span>2. Skenario Cerita</span>
        </button>
        <button
          onClick={() => setActiveSubTab('lkpd')}
          className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors flex items-center gap-1 ${
            activeSubTab === 'lkpd'
              ? 'bg-white text-amber-900 shadow-xs font-semibold ring-1 ring-amber-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ClipboardList className="w-3 h-3 text-amber-600" />
          <span>3. LKPD Aplikatif</span>
        </button>
        <button
          onClick={() => setActiveSubTab('cards')}
          className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors flex items-center gap-1 ${
            activeSubTab === 'cards'
              ? 'bg-white text-sky-900 shadow-xs font-semibold ring-1 ring-sky-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <HelpCircle className="w-3 h-3 text-sky-600" />
          <span>4. Kartu Inkuiri</span>
        </button>
        <button
          onClick={() => setActiveSubTab('parents')}
          className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors flex items-center gap-1 ${
            activeSubTab === 'parents'
              ? 'bg-white text-rose-900 shadow-xs font-semibold ring-1 ring-rose-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Home className="w-3 h-3 text-rose-600" />
          <span>5. Kemitraan Orang Tua</span>
        </button>
      </div>

      {/* Rendered Body */}
      <div className="p-6 sm:p-8">
        <div
          className="curriculum-prose max-w-none text-slate-800"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
        {/* Official Signatures Block */}
        <SignatoryBlock config={signatoryConfig} />
      </div>
    </div>
  );
};
