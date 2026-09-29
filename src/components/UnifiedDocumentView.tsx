import React, { useState } from 'react';
import { parseMarkdownToHtml } from '../utils/documentExport';
import { SignatoryBlock } from './SignatoryBlock';
import { MasterAtpRecord, SignatoryConfig } from '../types';
import { Copy, Check, FileDown, Printer, FileText, Presentation } from 'lucide-react';

interface UnifiedDocumentViewProps {
  markdown: string;
  atpData: MasterAtpRecord;
  onCopy: () => void;
  copied: boolean;
  onPrint: () => void;
  onExportWord: () => void;
  onExportMarkdown: () => void;
  onExportPptx: () => void;
  signatoryConfig: SignatoryConfig;
}

export const UnifiedDocumentView: React.FC<UnifiedDocumentViewProps> = ({
  markdown,
  atpData,
  onCopy,
  copied,
  onPrint,
  onExportWord,
  onExportMarkdown,
  onExportPptx,
  signatoryConfig,
}) => {
  const [pptxLoading, setPptxLoading] = useState<boolean>(false);
  const htmlContent = parseMarkdownToHtml(markdown);

  const handleExportPpt = async () => {
    setPptxLoading(true);
    try {
      await onExportPptx();
    } finally {
      setPptxLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden print-container">
      {/* Top Toolbar (Hidden on Print) */}
      <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 no-print">
        <div>
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
            Dokumen Resmi Terpadu (RPP Mendalam & Paket Bahan Ajar Lengkap)
          </span>
          <span className="text-[11px] text-slate-500">
            Standar Pusat Kurikulum dan Pembelajaran · PAI & BP {atpData.fase} {atpData.target_kelas}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* PowerPoint export */}
          <button
            onClick={handleExportPpt}
            disabled={pptxLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 disabled:bg-slate-400 rounded-lg transition-colors shadow-2xs"
            title="Download slide presentasi Microsoft PowerPoint (.pptx)"
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>{pptxLoading ? 'Menyiapkan...' : 'Ekspor PowerPoint (.pptx)'}</span>
          </button>

          <button
            onClick={onCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-teal-700" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Tersalin' : 'Salin Semua'}</span>
          </button>
          <button
            onClick={onExportMarkdown}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-teal-700" />
            <span>Unduh .md</span>
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
            <span>Cetak / PDF Resmi</span>
          </button>
        </div>
      </div>

      {/* Official Document Print Header */}
      <div className="p-6 sm:p-10">
        <div className="text-center pb-6 border-b-2 border-slate-800 mb-8">
          <p className="text-xs uppercase tracking-widest text-slate-600 font-semibold mb-1">
            KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI
          </p>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            PUSAT KURIKULUM DAN PEMBELAJARAN
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            PERENCANAAN PEMBELAJARAN MENDALAM & PAKET BAHAN AJAR PAI DAN BUDI PEKERTI
          </p>
          <div className="mt-3 flex items-center justify-center gap-3 text-xs text-slate-500 font-mono">
            <span>FASE: {atpData.fase}</span>
            <span aria-hidden="true">·</span>
            <span>KELAS: {atpData.target_kelas}</span>
            <span aria-hidden="true">·</span>
            <span>NO. ATP: {atpData.no_atp}</span>
          </div>
        </div>

        {/* Content Body */}
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
