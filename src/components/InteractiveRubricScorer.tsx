import React, { useState } from 'react';
import { Plus, Trash2, Award, CheckCircle, Calculator, FileDown, Printer } from 'lucide-react';
import { MasterAtpRecord } from '../types';

interface GroupScoreItem {
  id: string;
  name: string;
  isiMateri: number; // 4: Sangat Berkembang, 3: Cakap, 2: Berkembang, 1: Baru Memulai
  kreativitas: number;
  kolaborasi: number;
  presentasi: number;
  notes: string;
}

interface StudentRefleksiItem {
  id: string;
  name: string;
  pemahamanIsi: number;
  kejelasanTulisan: number;
  kejujuran: number;
  partisipasi: 'Aktif' | 'Pasif';
  sikap: string;
}

interface InteractiveRubricScorerProps {
  atpData: MasterAtpRecord;
}

export const InteractiveRubricScorer: React.FC<InteractiveRubricScorerProps> = ({ atpData }) => {
  const [activeSubTab, setActiveSubTab] = useState<'kelompok' | 'refleksi'>('kelompok');

  // Initial group evaluations
  const [groups, setGroups] = useState<GroupScoreItem[]>([
    {
      id: 'g-1',
      name: 'Kelompok 1 (Abu Bakar)',
      isiMateri: 4,
      kreativitas: 4,
      kolaborasi: 3,
      presentasi: 4,
      notes: 'Penyampaian materi sangat runtut dan poster kreatif.',
    },
    {
      id: 'g-2',
      name: 'Kelompok 2 (Umar bin Khattab)',
      isiMateri: 3,
      kreativitas: 3,
      kolaborasi: 4,
      presentasi: 3,
      notes: 'Semua anggota sangat aktif bekerja sama.',
    },
    {
      id: 'g-3',
      name: 'Kelompok 3 (Utsman bin Affan)',
      isiMateri: 4,
      kreativitas: 3,
      kolaborasi: 3,
      presentasi: 3,
      notes: 'Penjelasan dalil dan contoh nyata sangat baik.',
    },
  ]);

  // Initial individual reflection evaluations
  const [students, setStudents] = useState<StudentRefleksiItem[]>([
    {
      id: 's-1',
      name: 'Ahmad Faiz',
      pemahamanIsi: 4,
      kejelasanTulisan: 4,
      kejujuran: 4,
      partisipasi: 'Aktif',
      sikap: 'Sangat santun dan aktif bertanya',
    },
    {
      id: 's-2',
      name: 'Siti Nur Aisyah',
      pemahamanIsi: 4,
      kejelasanTulisan: 3,
      kejujuran: 4,
      partisipasi: 'Aktif',
      sikap: 'Menghargai teman saat berpendapat',
    },
    {
      id: 's-3',
      name: 'Muhammad Rizky',
      pemahamanIsi: 3,
      kejelasanTulisan: 3,
      kejujuran: 3,
      partisipasi: 'Aktif',
      sikap: 'Tekun menyelesaikan tugas tepat waktu',
    },
  ]);

  const addGroup = () => {
    const newId = `g-${Date.now()}`;
    setGroups([
      ...groups,
      {
        id: newId,
        name: `Kelompok ${groups.length + 1}`,
        isiMateri: 3,
        kreativitas: 3,
        kolaborasi: 3,
        presentasi: 3,
        notes: '',
      },
    ]);
  };

  const removeGroup = (id: string) => {
    setGroups(groups.filter((g) => g.id !== id));
  };

  const updateGroup = (id: string, field: keyof GroupScoreItem, value: any) => {
    setGroups(
      groups.map((g) => (g.id === id ? { ...g, [field]: value } : g))
    );
  };

  const addStudent = () => {
    const newId = `s-${Date.now()}`;
    setStudents([
      ...students,
      {
        id: newId,
        name: `Siswa ${students.length + 1}`,
        pemahamanIsi: 3,
        kejelasanTulisan: 3,
        kejujuran: 3,
        partisipasi: 'Aktif',
        sikap: 'Santun dan tertib',
      },
    ]);
  };

  const removeStudent = (id: string) => {
    setStudents(students.filter((s) => s.id !== id));
  };

  const updateStudent = (id: string, field: keyof StudentRefleksiItem, value: any) => {
    setStudents(
      students.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const getPredikat = (total: number, max: number) => {
    const percent = (total / max) * 100;
    if (percent >= 88) return { label: 'Sangat Berkembang', color: 'text-teal-800 bg-teal-50' };
    if (percent >= 75) return { label: 'Cakap', color: 'text-sky-800 bg-sky-50' };
    if (percent >= 60) return { label: 'Berkembang', color: 'text-amber-800 bg-amber-50' };
    return { label: 'Baru Memulai', color: 'text-rose-800 bg-rose-50' };
  };

  const printRubricReport = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header bar */}
      <div className="p-4 sm:p-5 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-teal-700" />
            <span>Instrumen Penilaian Autentik & Rubrik Berjalan</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gunakan rubrik standar dari RPP untuk menilai produk kelompok dan refleksi individu murid secara langsung.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex p-1 bg-slate-200/80 rounded-lg text-xs font-medium">
            <button
              onClick={() => setActiveSubTab('kelompok')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeSubTab === 'kelompok'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. Produk Kelompok
            </button>
            <button
              onClick={() => setActiveSubTab('refleksi')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeSubTab === 'refleksi'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. Refleksi & Observasi Murid
            </button>
          </div>
          <button
            onClick={printRubricReport}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg no-print flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Rekap</span>
          </button>
        </div>
      </div>

      {/* Subtab 1: Group Evaluation */}
      {activeSubTab === 'kelompok' && (
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs text-slate-600">
              <span className="font-semibold text-slate-800">Skala Penilaian:</span> 4 = Sangat Berkembang, 3 = Cakap, 2 = Berkembang, 1 = Baru Memulai (Skor Maksimal: 16)
            </div>
            <button
              onClick={addGroup}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors no-print"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Kelompok</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700">
                  <th className="p-2.5 font-semibold">Nama Kelompok</th>
                  <th className="p-2.5 font-semibold text-center">Isi/Materi (1-4)</th>
                  <th className="p-2.5 font-semibold text-center">Kreativitas (1-4)</th>
                  <th className="p-2.5 font-semibold text-center">Kolaborasi (1-4)</th>
                  <th className="p-2.5 font-semibold text-center">Presentasi (1-4)</th>
                  <th className="p-2.5 font-semibold text-center">Total & Predikat</th>
                  <th className="p-2.5 font-semibold">Catatan Kualitatif</th>
                  <th className="p-2.5 text-center no-print">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {groups.map((group) => {
                  const total = group.isiMateri + group.kreativitas + group.kolaborasi + group.presentasi;
                  const predikat = getPredikat(total, 16);
                  return (
                    <tr key={group.id} className="hover:bg-slate-50/50">
                      <td className="p-2.5 font-medium text-slate-900 min-w-36">
                        <input
                          type="text"
                          value={group.name}
                          onChange={(e) => updateGroup(group.id, 'name', e.target.value)}
                          className="w-full px-2 py-1 bg-transparent border border-transparent hover:border-slate-200 focus:border-teal-600 rounded text-xs"
                        />
                      </td>
                      <td className="p-2.5 text-center">
                        <select
                          value={group.isiMateri}
                          onChange={(e) => updateGroup(group.id, 'isiMateri', Number(e.target.value))}
                          aria-label={`Skor Isi/Materi untuk ${group.name}`}
                          className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-semibold"
                        >
                          <option value={4}>4 (Sangat Berkembang)</option>
                          <option value={3}>3 (Cakap)</option>
                          <option value={2}>2 (Berkembang)</option>
                          <option value={1}>1 (Baru Memulai)</option>
                        </select>
                      </td>
                      <td className="p-2.5 text-center">
                        <select
                          value={group.kreativitas}
                          onChange={(e) => updateGroup(group.id, 'kreativitas', Number(e.target.value))}
                          aria-label={`Skor Kreativitas untuk ${group.name}`}
                          className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-semibold"
                        >
                          <option value={4}>4 (Sangat Berkembang)</option>
                          <option value={3}>3 (Cakap)</option>
                          <option value={2}>2 (Berkembang)</option>
                          <option value={1}>1 (Baru Memulai)</option>
                        </select>
                      </td>
                      <td className="p-2.5 text-center">
                        <select
                          value={group.kolaborasi}
                          onChange={(e) => updateGroup(group.id, 'kolaborasi', Number(e.target.value))}
                          aria-label={`Skor Kolaborasi untuk ${group.name}`}
                          className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-semibold"
                        >
                          <option value={4}>4 (Sangat Berkembang)</option>
                          <option value={3}>3 (Cakap)</option>
                          <option value={2}>2 (Berkembang)</option>
                          <option value={1}>1 (Baru Memulai)</option>
                        </select>
                      </td>
                      <td className="p-2.5 text-center">
                        <select
                          value={group.presentasi}
                          onChange={(e) => updateGroup(group.id, 'presentasi', Number(e.target.value))}
                          aria-label={`Skor Presentasi untuk ${group.name}`}
                          className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-semibold"
                        >
                          <option value={4}>4 (Sangat Berkembang)</option>
                          <option value={3}>3 (Cakap)</option>
                          <option value={2}>2 (Berkembang)</option>
                          <option value={1}>1 (Baru Memulai)</option>
                        </select>
                      </td>
                      <td className="p-2.5 text-center whitespace-nowrap">
                        <div className="font-bold text-slate-900 font-mono">{total} / 16</div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block mt-0.5 ${predikat.color}`}>
                          {predikat.label}
                        </span>
                      </td>
                      <td className="p-2.5 min-w-44">
                        <input
                          type="text"
                          value={group.notes}
                          onChange={(e) => updateGroup(group.id, 'notes', e.target.value)}
                          placeholder="Umpan balik guru..."
                          className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs"
                        />
                      </td>
                      <td className="p-2.5 text-center no-print">
                        <button
                          onClick={() => removeGroup(group.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                          title="Hapus baris"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab 2: Individual Reflection Evaluation */}
      {activeSubTab === 'refleksi' && (
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs text-slate-600">
              <span className="font-semibold text-slate-800">Skor Refleksi & Sikap Individu:</span> Nilai Pemahaman Isi, Kejelasan Tulisan, Kejujuran & Pengamatan Guru.
            </div>
            <button
              onClick={addStudent}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors no-print"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Siswa</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700">
                  <th className="p-2.5 font-semibold">Nama Siswa</th>
                  <th className="p-2.5 font-semibold text-center">Pemahaman Nilai (1-4)</th>
                  <th className="p-2.5 font-semibold text-center">Kejelasan Tulisan (1-4)</th>
                  <th className="p-2.5 font-semibold text-center">Kejujuran Refleksi (1-4)</th>
                  <th className="p-2.5 font-semibold text-center">Partisipasi Observasi</th>
                  <th className="p-2.5 font-semibold">Catatan Sikap & Ketekunan</th>
                  <th className="p-2.5 text-center no-print">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student) => {
                  const total = student.pemahamanIsi + student.kejelasanTulisan + student.kejujuran;
                  const predikat = getPredikat(total, 12);
                  return (
                    <tr key={student.id} className="hover:bg-slate-50/50">
                      <td className="p-2.5 font-medium text-slate-900 min-w-36">
                        <input
                          type="text"
                          value={student.name}
                          onChange={(e) => updateStudent(student.id, 'name', e.target.value)}
                          className="w-full px-2 py-1 bg-transparent border border-transparent hover:border-slate-200 focus:border-teal-600 rounded text-xs"
                        />
                      </td>
                      <td className="p-2.5 text-center">
                        <select
                          value={student.pemahamanIsi}
                          onChange={(e) => updateStudent(student.id, 'pemahamanIsi', Number(e.target.value))}
                          aria-label={`Skor Pemahaman Nilai untuk ${student.name}`}
                          className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-semibold"
                        >
                          <option value={4}>4 (Sangat Mendalam)</option>
                          <option value={3}>3 (Cukup Mengaitkan)</option>
                          <option value={2}>2 (Menyebutkan Saja)</option>
                          <option value={1}>1 (Belum Menguasai)</option>
                        </select>
                      </td>
                      <td className="p-2.5 text-center">
                        <select
                          value={student.kejelasanTulisan}
                          onChange={(e) => updateStudent(student.id, 'kejelasanTulisan', Number(e.target.value))}
                          aria-label={`Skor Kejelasan Tulisan untuk ${student.name}`}
                          className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-semibold"
                        >
                          <option value={4}>4 (Runtut & Jelas)</option>
                          <option value={3}>3 (Cukup Jelas)</option>
                          <option value={2}>2 (Kurang Runtut)</option>
                          <option value={1}>1 (Tidak Menjawab)</option>
                        </select>
                      </td>
                      <td className="p-2.5 text-center">
                        <select
                          value={student.kejujuran}
                          onChange={(e) => updateStudent(student.id, 'kejujuran', Number(e.target.value))}
                          aria-label={`Skor Kejujuran Refleksi untuk ${student.name}`}
                          className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-semibold"
                        >
                          <option value={4}>4 (Sangat Sungguh-sungguh)</option>
                          <option value={3}>3 (Cukup Serius)</option>
                          <option value={2}>2 (Kurang Serius)</option>
                          <option value={1}>1 (Asal-asalan)</option>
                        </select>
                      </td>
                      <td className="p-2.5 text-center">
                        <select
                          value={student.partisipasi}
                          onChange={(e) => updateStudent(student.id, 'partisipasi', e.target.value as any)}
                          aria-label={`Partisipasi Observasi untuk ${student.name}`}
                          className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-semibold"
                        >
                          <option value="Aktif">Aktif</option>
                          <option value="Pasif">Pasif</option>
                        </select>
                      </td>
                      <td className="p-2.5 min-w-44">
                        <input
                          type="text"
                          value={student.sikap}
                          onChange={(e) => updateStudent(student.id, 'sikap', e.target.value)}
                          placeholder="Kerja sama, ketekunan, adab..."
                          className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs"
                        />
                      </td>
                      <td className="p-2.5 text-center no-print">
                        <button
                          onClick={() => removeStudent(student.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                          title="Hapus baris"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
