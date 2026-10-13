# Panduan Deploy & Sinkronisasi EduCraft AI ke GitHub Pages

Aplikasi **EduCraft AI** telah disiapkan dengan sinkronisasi penuh antara **RPP Mendalam**, **Bahan Ajar Siap Ajar**, dan **Tujuan Pembelajaran (TP)** yang diambil langsung dari data Supabase (khususnya kolom **`tp hasil analisis`**) serta disesuaikan secara presisi berdasarkan **Fase** dan **Kelas**.

---

## Yang Telah Diperbarui & Disinkronkan:
1. **Pengambilan TP dari Kolom `tp hasil analisis` Supabase**:
   - Sistem kini memprioritaskan ekstraksi Tujuan Pembelajaran (TP) dari kolom **`tp hasil analisis`** (serta variasi penamaan seperti `tp_hasil_analisis`, `tp hasil analisa`, `tp_analisis`, dsb.).
   - Bila data Supabase Anda memiliki kolom ini, TP tersebut otomatis diambil sebagai konten utama penyusunan RPP & Bahan Ajar.
2. **Presisi Fase & Tingkat Kelas**:
   - Sistem melakukan kalibrasi dan validasi presisi otomatis antara Fase (Fase A s.d. Fase D) dan Kelas (Kelas I s.d. Kelas IX).
   - Penambahan filter **Tingkat Kelas** di samping filter **Fase** dan **Elemen**, memudahkan guru menyaring materi sesuai jenjang yang diajar.
3. **Penyelarasan CP (Capaian Pembelajaran)**:
   - Capaian Pembelajaran dicocokkan secara presisi berdasarkan kombinasi Elemen, Fase, dan Tingkat Kelas.
4. **Penyusunan Ulang Folder `/docs` & `/dist` untuk GitHub Pages**:
   - Seluruh berkas *production bundle* terbaru telah dikompilasi secara bersih ke dalam folder `docs/` dan `dist/`.

---

## 3 Langkah Mudah Memperbarui Halaman GitHub Anda:

Jalankan perintah berikut di terminal komputer Anda (di dalam folder repository proyek):

```bash
git add .
git commit -m "fix: Sinkronkan Tujuan Pembelajaran dan Bahan Ajar terbaru ke GitHub Pages"
git push origin main
```
*(Gunakan `git push origin master` jika branch utama Anda adalah `master`).*

Setelah berhasil di-push:
1. Buka situs GitHub Pages Anda: `https://USERNAME.github.io/NAMA_REPO/`.
2. Lakukan **Hard Refresh** pada browser Anda untuk membersihkan cache berkas lama:
   - **Windows / Linux**: Tekan `Ctrl + F5` atau `Ctrl + Shift + R`.
   - **Mac**: Tekan `Cmd + Shift + R`.
3. Halaman GitHub Pages Anda akan langsung menampilkan **Tujuan Pembelajaran** dan **Bahan Ajar** yang persis, serasi, dan tersinkronkan 100% seperti di preview ini!

---

## Pilihan Pengaturan di GitHub Pages (Settings > Pages):

### METODE 1: Melalui Folder `/docs` (Sangat Direkomendasikan & Cepat)
1. Buka repository Anda di GitHub.
2. Klik tab **Settings** > menu **Pages** di sebelah kiri.
3. Pada bagian **Build and deployment**:
   - **Source**: Pilih `Deploy from a branch`
   - **Branch**: Pilih `main` (atau `master`)
   - **Folder**: Pilih `/docs`
4. Klik **Save**. Web Anda akan langsung aktif dalam hitungan detik!

### METODE 2: Otomatis via GitHub Actions
Jika Anda memilih opsi **GitHub Actions** pada menu Pages, GitHub Actions akan menjalankan workflow `.github/workflows/deploy.yml` yang otomatis mem-build dari kode sumber.

---
*EduCraft AI - Generator RPP Mendalam & Bahan Ajar PAI*
