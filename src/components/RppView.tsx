import React from 'react';
import { parseMarkdownToHtml } from '../utils/documentExport';
import { SignatoryBlock } from './SignatoryBlock';
import { SignatoryConfig } from '../types';
import { Copy, Check, FileDown, Printer, Heart, Sparkles, Brain, Users } from 'lucide-react';

interface RppViewProps {
  rppMarkdown: string;
  onCopy: () => void;
  copied: boolean;
  onPrint: () => void;
  onExportWord: () => void;
  signatoryConfig: SignatoryConfig;
}

export const RppView: React.FC<RppViewProps> = ({
  rppMarkdown,
  onCopy,
  copied,
  onPrint,
  onExportWord,
  signatoryConfig,
}) => {
  const htmlContent = parseMarkdownToHtml(rppMarkdown);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Action Toolbar */}
      <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-600"></div>
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            BAGIAN 1: Perencanaan Pembelajaran Mendalam (Format RPP Presisi)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-teal-700" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Tersalin' : 'Salin Markdown'}</span>
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
            <span>Cetak RPP</span>
          </button>
        </div>
      </div>

      {/* Pedagogical Principle Badges Overview */}
      <div className="p-4 bg-gradient-to-r from-teal-50/50 via-slate-50 to-amber-50/30 border-b border-slate-200 no-print">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-white/80 rounded-lg border border-teal-100">
            <span className="font-bold text-teal-900 block mb-0.5">1. Mindful (Memahami)</span>
            <p className="text-slate-600 text-[11px]">
              Siswa menyadari pengalaman pribadi, mengawali dengan refleksi hening dan keterkaitan batin terhadap topik.
            </p>
          </div>
          <div className="p-3 bg-white/80 rounded-lg border border-amber-100">
            <span className="font-bold text-amber-900 block mb-0.5">2. Joyful (Mengaplikasikan)</span>
            <p className="text-slate-600 text-[11px]">
              Belajar melalui kolaborasi kelompok yang menyenangkan, penuh kreasi visual, drama, atau karya digital nyata.
            </p>
          </div>
          <div className="p-3 bg-white/80 rounded-lg border border-sky-100">
            <span className="font-bold text-sky-900 block mb-0.5">3. Meaningful (Merefleksikan)</span>
            <p className="text-slate-600 text-[11px]">
              Murid mengaitkan hikmah pelajaran dengan kehidupan nyata, komitmen kebaikan, serta bekal masa depan.
            </p>
          </div>
        </div>
      </div>

      {/* Rendered Document Body */}
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
