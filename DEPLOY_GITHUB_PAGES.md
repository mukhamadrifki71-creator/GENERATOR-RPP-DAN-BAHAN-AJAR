# Panduan Deploy EduCraft AI ke GitHub Pages

Aplikasi **EduCraft AI** telah disesuaikan secara penuh agar dapat berjalan langsung di **GitHub Pages** (Hosting Statis Gratis dari GitHub).

---

## Yang Telah Dikonfigurasi Otomatis:
1. **Base Path Relatif (`base: './'`)**: Aset CSS, JS, dan gambar otomatis dapat diakses meskipun berada di subfolder repository (misal: `https://username.github.io/nama-repo/`).
2. **Koneksi Langsung ke Supabase (Client-Side REST)**: Di GitHub Pages, aplikasi dapat langsung menarik data dari Supabase tanpa memerlukan server perantara (mendukung CORS).
3. **Penyusunan RPP & 5 Pilar Bahan Ajar Offline/Client-Side**: Mesin penyusun materi berjalan langsung di browser pengguna.
4. **File `.nojekyll`**: Memastikan GitHub Pages tidak memblokir file aset Vite.
5. **File `404.html`**: Mendukung refresh halaman dan navigasi tanpa error 404.
6. **Workflow GitHub Actions (`.github/workflows/deploy.yml`)**: Otomatis membangun (*build*) dan mempublikasikan aplikasi setiap kali Anda melakukan push ke branch `main` atau `master`.

---

## Langkah Singkat Mengonlinekan ke GitHub Pages:

### Langkah 1: Buat Repository di GitHub
1. Buka [GitHub](https://github.com) dan masuk ke akun Anda.
2. Buat repository baru, misalnya dengan nama: `educraft-ai` (bisa Public).

### Langkah 2: Unggah / Push Kode ke Repository
Jalankan perintah berikut di terminal komputer Anda (di dalam folder proyek):
```bash
git init
git add .
git commit -m "feat: Siap deploy ke GitHub Pages"
git branch -M main
git remote add origin https://github.com/USERNAME_ANDA/educraft-ai.git
git push -u origin main
```

### Langkah 3: Aktifkan GitHub Pages via GitHub Actions
1. Buka halaman repository Anda di GitHub: `https://github.com/USERNAME_ANDA/educraft-ai`.
2. Klik tab **Settings** (Pengaturan).
3. Di bilah sisi kiri, klik menu **Pages** (di bawah bagian *Code and automation*).
4. Pada bagian **Build and deployment > Source**, ubah dari *"Deploy from a branch"* menjadi **"GitHub Actions"**.
5. Selesai! GitHub Actions (`.github/workflows/deploy.yml`) akan otomatis bekerja dalam 1-2 menit.

### Langkah 4: Buka Website Anda
Setelah proses deploy selesai, website Anda akan langsung online dan dapat diakses di:
👉 **`https://USERNAME_ANDA.github.io/educraft-ai/`**

---
*EduCraft AI - Siap digunakan oleh seluruh guru di mana saja!*
