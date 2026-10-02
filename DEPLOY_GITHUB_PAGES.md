# Panduan Deploy EduCraft AI ke GitHub Pages

Aplikasi **EduCraft AI** telah disiapkan dengan 2 metode deploy ke **GitHub Pages** agar 100% pasti berhasil dan tidak mengalami layar putih / error 404.

---

## Mengapa Sebelumnya Halaman Tidak Muncul? (Sudah Diperbaiki)
1. **Konflik Dependency pada GitHub Actions**: Sebelumnya proses `npm install` di GitHub Actions gagal karena bentrok peer dependency antara Vite dan esbuild. Sekarang sudah ditambahkan `.npmrc` dengan `legacy-peer-deps=true` dan berkas `package-lock.json` yang bersih.
2. **Pengaturan Default GitHub Pages**: Secara default, GitHub Pages mengarahkan ke folder *root* (`/`). Jika folder root disajikan tanpa dikompilasi, browser tidak dapat membaca file TypeScript (`.tsx`). Sekarang kami telah menyediakan folder **`/docs`** yang langsung berisi file web siap saji!

---

## Cara Deploy (Pilih Salah Satu Metode yang Anda Sukai):

### METODE 1: Paling Mudah & Cepat (Lewat Folder `/docs`) — DIREKOMENDASIKAN
Metode ini tidak memerlukan build tambahan di GitHub Actions karena folder `docs/` sudah otomatis ter-compile dan siap tayang.

1. Buka repository Anda di GitHub: `https://github.com/USERNAME_ANDA/NAMA_REPO`.
2. Klik tab **Settings** (Pengaturan).
3. Di menu sebelah kiri, pilih **Pages** (di bagian *Code and automation*).
4. Pada bagian **Build and deployment**:
   - **Source**: Pilih **Deploy from a branch**
   - **Branch**: Pilih **main** (atau **master**)
   - **Folder**: Ubah dari `/ (root)` menjadi **`/docs`**
5. Klik tombol **Save**.
6. Tunggu 1–2 menit, lalu segarkan halaman. Alamat web Anda akan muncul:
   👉 **`https://USERNAME_ANDA.github.io/NAMA_REPO/`**

---

### METODE 2: Otomatis via GitHub Actions
Jika Anda ingin GitHub otomatis mem-build setiap kali Anda melakukan `git push`:

1. Buka repository Anda di GitHub: `https://github.com/USERNAME_ANDA/NAMA_REPO`.
2. Klik tab **Settings** > menu **Pages**.
3. Pada bagian **Build and deployment > Source**, pilih **GitHub Actions**.
4. GitHub Actions akan secara otomatis menjalankan workflow `.github/workflows/deploy.yml` yang sudah kami perbaiki.
5. Anda dapat memantau prosesnya di tab **Actions** pada repository Anda.

---

## Perintah Git untuk Mengunggah Perbaikan Ini ke GitHub:
Jalankan di terminal proyek Anda:
```bash
git add .
git commit -m "fix: Perbaiki konfigurasi deploy GitHub Pages & folder docs"
git push origin main
```
*(Ganti `main` dengan nama branch Anda jika menggunakan `master`).*

---
*EduCraft AI - Generator RPP Mendalam & Bahan Ajar PAI*
