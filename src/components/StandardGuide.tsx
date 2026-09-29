import React from 'react';
import { BookMarked, CheckCircle2, Heart, Sparkles, Brain, Users } from 'lucide-react';

export const StandardGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <BookMarked className="w-5 h-5 text-teal-700" />
          <span>Standar Kurikulum Nasional & Pedagogi EduCraft AI</span>
        </h2>
        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
          Sistem EduCraft AI menyusun Rencana Pelaksanaan Pembelajaran (RPP) Mendalam dan Paket Bahan Ajar berdasarkan integrasi prinsip pembelajaran mendalam terkini, Panca Cinta, serta Profil Pelajar.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/50">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-teal-700" />
              <h3 className="text-sm font-bold text-teal-900">1. Prinsip Mindful</h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              <strong>Memahami (Eksplorasi Awal):</strong> Memulai dengan Mindful Moment, menyadari pengalaman pribadi, mengaitkan batin murid dengan topik, dan memicu rasa ingin tahu melalui pertanyaan inkuiri pemantik.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <h3 className="text-sm font-bold text-amber-900">2. Prinsip Joyful</h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              <strong>Mengaplikasikan (Kegiatan Inti):</strong> Belajar secara menyenangkan, kolaboratif, dan dinamis melalui pembuatan produk kelompok berbasis pilihan kreatif (poster, drama, infografis, rekaman digital).
            </p>
          </div>

          <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/50">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4 text-sky-700" />
              <h3 className="text-sm font-bold text-sky-900">3. Prinsip Meaningful</h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              <strong>Merefleksikan (Penutup):</strong> Mengaitkan hikmah esensial materi pelajaran dengan kehidupan nyata, komitmen kebaikan pribadi, pembiasaan akhlak mulia, dan cita-cita masa depan.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3">
          Struktur Integrasi 2 Bagian Wajib EduCraft AI
        </h3>

        <div className="space-y-4 text-xs text-slate-700">
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70">
            <h4 className="font-bold text-slate-900 text-xs mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
              <span>BAGIAN 1: Perencanaan Pembelajaran Mendalam (Format RPP Presisi)</span>
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Header Resmi: Mata Pelajaran, Fase, Target Kelas, Elemen, Materi Pokok, Pertemuan</li>
              <li>Dimensi Profil Pelajar: Keimanan & Ketakwaan, Penalaran Kritis, Kreativitas, Kolaborasi</li>
              <li>Dimensi Panca Cinta: Cinta Allah & Rasul, Cinta Ilmu, Cinta Diri & Sesama Manusia</li>
              <li>Pusat Kurikulum dan Pembelajaran: CP Asli Supabase, TP Asli Supabase, ATP Asli Supabase</li>
              <li>Praktik Pedagogis, Kemitraan Pembelajaran, Lingkungan Pembelajaran (Fisik, Virtual, Budaya)</li>
              <li>Pemanfaatan Digital (Canva, Slides, Padlet, dll.)</li>
              <li>Langkah Pembelajaran: 1. Memahami (Mindful), 2. Mengaplikasikan (Joyful), 3. Merefleksikan (Meaningful)</li>
              <li>Asesmen Formatif Awal, Formatif Proses, dan Asesmen Akhir + Tindak Lanjut</li>
              <li>Rubrik Penilaian Holistik: Produk Kelompok, Refleksi Individu, dan Lembar Observasi Guru</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70">
            <h4 className="font-bold text-slate-900 text-xs mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
              <span>BAGIAN 2: Paket Materi & Bahan Ajar Lengkap (Siap Ajar)</span>
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li><strong>1. Ringkasan Materi Guru & Siswa:</strong> Teks bacaan naratif, komunikatif, dan memikat sesuai usia anak</li>
              <li><strong>2. Lembar Kerja Peserta Didik (LKPD):</strong> Panduan tugas kelompok dan instruksi produk nyata</li>
              <li><strong>3. Kartu Pertanyaan Inkuiri & Refleksi:</strong> Kartu pemicu nalar dan batin untuk diskusi kelas mendalam</li>
              <li><strong>4. Panduan Kemitraan Orang Tua:</strong> Lembar catatan ringkas untuk dibawa pulang guna memperkuat pembiasaan di rumah</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
