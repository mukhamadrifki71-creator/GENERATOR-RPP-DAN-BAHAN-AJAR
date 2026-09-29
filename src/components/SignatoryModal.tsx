import React from 'react';
import { SignatoryConfig } from '../types';
import { UserCheck, X, Save, Building2, Calendar } from 'lucide-react';

interface SignatoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SignatoryConfig;
  onSave: (config: SignatoryConfig) => void;
}

export const SignatoryModal: React.FC<SignatoryModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
}) => {
  const [formData, setFormData] = React.useState<SignatoryConfig>(config);

  React.useEffect(() => {
    setFormData(config);
  }, [config]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Pengaturan Pengesahan Dokumen
              </h3>
              <p className="text-xs text-slate-500">
                Tanda tangan resmi Guru PAI & Kepala Sekolah pada RPP & Bahan Ajar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* Guru PAI Section */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-600" />
              <span>Data Guru PAI & Budi Pekerti</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Nama Lengkap & Gelar
                </label>
                <input
                  type="text"
                  required
                  value={formData.teacherName}
                  onChange={(e) =>
                    setFormData({ ...formData, teacherName: e.target.value })
                  }
                  placeholder="Contoh: MUKHAMAD RIFKI, S.Pd.I."
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/20 font-medium text-slate-900"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  NIP Guru PAI
                </label>
                <input
                  type="text"
                  value={formData.teacherNip}
                  onChange={(e) =>
                    setFormData({ ...formData, teacherNip: e.target.value })
                  }
                  placeholder="19900101 202012 1 005 (atau -)"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/20 font-mono text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Kepala Sekolah Section */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-600" />
              <span>Data Kepala Sekolah</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Nama Kepala Sekolah & Gelar
                </label>
                <input
                  type="text"
                  required
                  value={formData.principalName}
                  onChange={(e) =>
                    setFormData({ ...formData, principalName: e.target.value })
                  }
                  placeholder="Contoh: Drs. H. AHMAD SYUKRI, M.Pd."
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/20 font-medium text-slate-900"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  NIP Kepala Sekolah
                </label>
                <input
                  type="text"
                  value={formData.principalNip}
                  onChange={(e) =>
                    setFormData({ ...formData, principalNip: e.target.value })
                  }
                  placeholder="19750512 199903 1 002 (atau -)"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/20 font-mono text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* School Name & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-slate-600 font-medium mb-1 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-slate-400" />
                <span>Nama Satuan Pendidikan</span>
              </label>
              <input
                type="text"
                value={formData.schoolName}
                onChange={(e) =>
                  setFormData({ ...formData, schoolName: e.target.value })
                }
                placeholder="Contoh: SDN 1 Sumber Makmur"
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/20 text-slate-800"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>Kota & Tanggal Pengesahan</span>
              </label>
              <input
                type="text"
                value={formData.cityAndDate}
                onChange={(e) =>
                  setFormData({ ...formData, cityAndDate: e.target.value })
                }
                placeholder="Contoh: Jakarta, 29 September 2026"
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/20 text-slate-800"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Pengesahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
