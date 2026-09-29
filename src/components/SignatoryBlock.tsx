import React from 'react';
import { SignatoryConfig } from '../types';

interface SignatoryBlockProps {
  config: SignatoryConfig;
}

export const SignatoryBlock: React.FC<SignatoryBlockProps> = ({ config }) => {
  return (
    <div className="mt-12 pt-6 border-t border-slate-200 page-break-inside-avoid print:mt-8">
      <div className="grid grid-cols-2 gap-8 text-center text-xs text-slate-900 leading-relaxed">
        {/* Left: Kepala Sekolah */}
        <div className="flex flex-col items-center justify-between">
          <div>
            <p className="text-slate-600">Mengetahui,</p>
            <p className="font-bold">
              Kepala {config.schoolName || 'Sekolah Dasar'}
            </p>
          </div>
          <div className="h-20 my-2 flex items-center justify-center">
            {/* Signature blank space */}
            <span className="text-[10px] text-slate-300 italic no-print">(Tanda Tangan & Cap)</span>
          </div>
          <div>
            <p className="font-bold underline uppercase tracking-wide">
              {config.principalName || '...................................................'}
            </p>
            <p className="text-slate-600 font-mono text-[11px] mt-0.5">
              NIP. {config.principalNip || '.........................................'}
            </p>
          </div>
        </div>

        {/* Right: Guru Mata Pelajaran */}
        <div className="flex flex-col items-center justify-between">
          <div>
            <p className="text-slate-600">{config.cityAndDate || '........................, ..................... 2026'}</p>
            <p className="font-bold">
              Guru Pendidikan Agama Islam & BP
            </p>
          </div>
          <div className="h-20 my-2 flex items-center justify-center">
            {/* Signature blank space */}
            <span className="text-[10px] text-slate-300 italic no-print">(Tanda Tangan Guru)</span>
          </div>
          <div>
            <p className="font-bold underline uppercase tracking-wide">
              {config.teacherName || '...................................................'}
            </p>
            <p className="text-slate-600 font-mono text-[11px] mt-0.5">
              NIP. {config.teacherNip || '.........................................'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
