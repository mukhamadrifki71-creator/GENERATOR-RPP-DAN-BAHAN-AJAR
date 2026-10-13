# Panduan Deploy & Sinkronisasi EduCraft AI ke GitHub Pages

Aplikasi **EduCraft AI** telah disiapkan dengan sinkronisasi penuh antara **RPP Mendalam**, **Bahan Ajar Siap Ajar**, dan **Tujuan Pembelajaran (TP)** serta didukung 2 metode deploy ke **GitHub Pages** agar 100% tampil persis seperti di layar preview ini.

---

## Yang Telah Diperbaiki & Disinkronkan:
1. **Kesinkronan Penuh Tujuan Pembelajaran (TP)**:
   - Versi default awal kini dipastikan **Q.S. Al-Hujurat/49: 13, Kelas IV** (Elemen Al-Qur'an dan Hadis) lengkap dengan RPP dan Bahan Ajar yang senada.
   - Pilihan materi yang dipilih (baik dari Supabase maupun katalog) kini otomatis disimpan secara persisten di browser (`localStorage`), sehingga saat Anda membuka kembali halaman web di GitHub, Tujuan Pembelajaran yang tampil adalah versi yang tepat dan tidak melompat ke materi lain.
2. **Pencegahan Redireksi Putih pada Root GitHub Pages**:
   - Berkas `index.html` dan folder `/docs` kini dilengkapi script pengarah instan (*zero-delay redirect*) sehingga baik menggunakan metode folder `/docs` maupun `/ (root)`, aplikasi langsung tayang tanpa jeda.
3. **Penyusunan Ulang Folder `/docs` & `/dist`**:
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
