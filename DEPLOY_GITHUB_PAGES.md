# Panduan Mengatasi & Membuka EduCraft AI di GitHub Pages

Aplikasi **EduCraft AI** kini telah diperbarui secara tuntas agar dapat dibuka secara lancar di **GitHub Pages** tanpa kendala halaman kosong, 404, atau perulangan pengalihan (*infinite redirect / ERR_TOO_MANY_REDIRECTS*).

---

## 🔍 Penyebab Masalah Sebelumnya & Solusinya

1. **Penyebab Tidak Bisa Dibuka / Error 404 / Blank**:
   - Sebelumnya, terdapat skrip pengalihan di bagian `<head>` berkas HTML yang mencoba mengarahkan URL ke `./docs/`.
   - Ketika GitHub Pages diatur untuk menyajikan folder `/docs`, URL halaman yang dibuka adalah `https://USERNAME.github.io/REPO/`. Karena folder `/docs` sudah menjadi direktori utama (root) di GitHub Pages, pengalihan kembali ke `./docs/` mengakibatkan browser mencari folder `/docs/docs/` yang tidak ada (menghasilkan **404 Not Found** atau perulangan pengalihan tak berujung).
2. **Solusi yang Diterapkan**:
   - Seluruh berkas *production bundle* di folder `docs/` dan `dist/` telah dikompilasi secara bersih tanpa skrip pengalihan yang merusak.
   - Konfigurasi `base: './'` pada Vite memastikan seluruh berkas Javascript, CSS, dan font dimuat secara relatif dan kompatibel dengan segala bentuk URL repositori GitHub.
   - Penambahan berkas `.nojekyll` di folder `docs/` dan `public/` untuk mencegah pemblokiran berkas oleh parser bawaan Jekyll GitHub.
   - Penyesuaian `404.html` cerdas yang mencegah pengalihan berulang (anti-loop redirect).

---

## 🚀 3 Langkah Mengunggah Pembaruan ke GitHub

Jalankan perintah berikut di terminal komputer Anda (di dalam folder repository proyek):

```bash
git add .
git commit -m "fix: Perbaikan tuntas membuka di GitHub Pages (bebas redirect 404)"
git push origin main
```
*(Catatan: Gunakan `git push origin master` jika branch utama repositori Anda bernama `master`).*

---

## ⚙️ Cara Mengatur GitHub Pages di Repositori Anda

Buka repositori Anda di GitHub melalui browser, lalu:

### OPSI 1: Deploy dari Folder `/docs` (Paling Cepat & Sangat Direkomendasikan)
1. Di halaman repositori GitHub, klik tab **Settings** (ikon gerigi).
2. Di menu sebelah kiri, klik **Pages**.
3. Di bawah judul **Build and deployment**:
   - **Source**: Pilih **`Deploy from a branch`**
   - **Branch**: Pilih **`main`** (atau `master`)
   - **Folder**: Ubah dari `/ (root)` menjadi **`/docs`**
4. Klik tombol **Save**.
5. Tunggu sekitar 30–60 detik hingga muncul pesan hijau di bagian atas:
   > *"Your site is live at https://USERNAME.github.io/REPO_NAME/"*

### OPSI 2: Deploy Otomatis via GitHub Actions
Jika Anda lebih suka menggunakan GitHub Actions:
1. Buka tab **Settings** > **Pages**.
2. Pada bagian **Build and deployment** > **Source**: Pilih **`GitHub Actions`**.
3. Workflow bawaan `.github/workflows/deploy.yml` yang sudah tersedia di proyek ini akan otomatis mem-build dan mempublikasikan aplikasi setiap kali Anda melakukan `git push`.

---

## 💡 Tips Jika Masih Muncul Tampilan Lama / Cache

Jika sebelumnya Anda pernah membuka halaman tersebut dan masih melihat error atau tampilan lama:
1. **Hard Refresh** browser:
   - **Windows / Linux**: Tekan `Ctrl + F5` atau `Ctrl + Shift + R`
   - **Mac**: Tekan `Cmd + Shift + R`
2. Atau coba buka tautan melalui jendela **Incognito / Private Browsing**.
3. Halaman aplikasi EduCraft AI akan langsung terbuka sempurna dengan katalog 98 Tujuan Pembelajaran (Fase A, B, C, Kelas 1-6) dan fitur pembuatan RPP serta Bahan Ajar yang siap digunakan!
