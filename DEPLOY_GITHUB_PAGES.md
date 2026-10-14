# Panduan Pembaruan Data & Membuka EduCraft AI di GitHub Pages

Aplikasi **EduCraft AI** telah diperbarui secara menyeluruh:
1. **Jumlah Tujuan Pembelajaran (TP)**: Kini telah ditingkatkan dan dilengkapi secara utuh menjadi **120 TP** (sebelumnya 98 TP).
2. **Keseimbangan Fase & Kelas**:
   - **Fase A (Kelas I & II)**: 40 TP (20 TP Kelas I + 20 TP Kelas II)
   - **Fase B (Kelas III & IV)**: 40 TP (20 TP Kelas III + 20 TP Kelas IV)
   - **Fase C (Kelas V & VI)**: 40 TP (20 TP Kelas V + 20 TP Kelas VI)
   - **Total**: **120 TP Lengkap (Kelas 1–6 SD)**
3. **Penyebab Mengapa di GitHub Pages Sebelumnya Muncul 98 TP**:
   - Domain GitHub Pages (`https://username.github.io/`) memiliki penyimpanan lokal (*localStorage*) browser yang terpisah dari domain preview AI Studio.
   - Tanpa kredensial Supabase di GitHub Pages, aplikasi menggunakan katalog bawaan offline yang sebelumnya hanya berisi 98 baris.
   - Kini, katalog bawaan offline telah diperbarui menjadi **120 TP**, sehingga saat dibuka di GitHub Pages pertama kali tanpa internet/database pun, jumlah TP langsung **120 TP lengkap**!
4. **Sinkronisasi Otomatis dengan Supabase di GitHub Pages**:
   - Jika Anda memiliki tabel sendiri di Supabase, Anda cukup mengklik tombol **"Hubungkan Supabase"** di halaman GitHub Pages Anda, masukkan URL Project & Anon Key, lalu klik **"Simpan & Sinkronkan"**.
   - Kunci akan tersimpan secara aman di browser Anda dan aplikasi akan otomatis melakukan *auto-sync* setiap kali halaman dibuka.
   - Tersedia juga opsi **"Tempel JSON Supabase"** untuk menyalin data dari Supabase Table Editor dalam 1 klik tanpa kendala CORS.

---

## 🚀 3 Langkah Mengunggah Pembaruan ke GitHub

Jalankan perintah berikut di terminal komputer Anda (di folder repositori proyek):

```bash
git add .
git commit -m "feat: Perbarui katalog TP lengkap 120 TP dan perbaiki sinkronisasi GitHub Pages"
git push origin main
```
*(Catatan: Gunakan `git push origin master` jika branch utama repositori Anda bernama `master`).*

---

## ⚙️ Pengaturan di GitHub Pages (Settings > Pages)

Jika Anda menyajikan situs via folder `/docs`:
1. Buka repositori Anda di GitHub > klik tab **Settings**.
2. Di menu samping kiri, klik **Pages**.
3. Di bagian **Build and deployment**:
   - **Source**: Pilih **`Deploy from a branch`**
   - **Branch**: Pilih **`main`** (atau `master`)
   - **Folder**: Pilih **`/docs`**
4. Klik **Save**.
5. Tunggu 30–60 detik, lalu buka alamat GitHub Pages Anda.

---

## 💡 Tips Jika Tampilan Belum Berubah (Cache Browser)

Jika di browser Anda jumlah TP masih menampilkan 98 karena cache lama tersimpan:
1. Lakukan **Hard Refresh**:
   - **Windows / Linux**: Tekan `Ctrl + F5` atau `Ctrl + Shift + R`
   - **Mac**: Tekan `Cmd + Shift + R`
2. Atau klik tombol **"Kembalikan Katalog Master (120 TP)"** di menu input ATP aplikasi untuk memperbarui data cache seketika.
