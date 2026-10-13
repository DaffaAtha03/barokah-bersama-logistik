# Website CV. Barokah Bersama Logistik

Website statis (HTML, CSS, JavaScript) untuk GitHub Pages. Hosting gratis, tanpa server, tanpa build.
Bahasa: Indonesia, Inggris, Arab (kanan ke kiri), dan Mandarin.

## Cara memasang di GitHub Pages

1. Buat akun di github.com, lalu klik **New repository**.
2. Beri nama repository, misalnya `bbl-logistik`. Pilih **Public**.
3. Klik **uploading an existing file**, lalu seret **seluruh isi folder ini** (index.html, css, js, assets, dan seterusnya) ke halaman upload. `index.html` harus berada di lapisan paling atas repository. Klik **Commit changes**.
4. Buka **Settings > Pages**. Pada **Source** pilih **Deploy from a branch**, branch **main**, folder **/ (root)**, lalu **Save**.
5. Tunggu 1 sampai 3 menit. Alamat situs muncul di halaman yang sama: `https://USERNAME.github.io/bbl-logistik/`.

Domain sendiri (misalnya bbl-logistik.co.id) bisa dipasang di **Settings > Pages > Custom domain**.

## Struktur folder

```
index.html           Halaman utama (isi teks bahasa Indonesia, untuk mesin pencari)
404.html             Halaman jika alamat tidak ditemukan
.nojekyll            Agar GitHub Pages menyajikan file apa adanya
css/style.css        Seluruh tampilan, warna ada di bagian :root
js/config.js         DATA PERUSAHAAN: kontak, alamat, NIB, nama pimpinan
js/fleet-data.js     Daftar jenis armada dan foto
js/i18n.js           Mesin ganti bahasa
js/main.js           Menu, tab armada, form WhatsApp, peta
js/lang/id|en|ar|zh.js   Semua teks per bahasa
assets/img/          Logo, foto hero, foto pimpinan, foto armada
```

## Yang paling sering diubah

- **Nomor telepon, email, alamat, nama pimpinan:** `js/config.js`.
- **Teks halaman:** `js/lang/id.js` (dan en, ar, zh). Setiap teks punya kunci yang sama di keempat file.
- **Tambah foto armada:** taruh file di `assets/img/fleet/`, lalu tambahkan di `js/fleet-data.js` (isi `src`, `w` lebar, `h` tinggi dalam piksel).
- **Tambah jenis armada baru:** tambah satu blok di `js/fleet-data.js` dan satu teks `fleet.<id>` di keempat file bahasa.
- **Tambah bahasa baru:** salin `js/lang/en.js` menjadi file baru, terjemahkan, tambahkan `<script>` di `index.html` dan satu tombol di header. Untuk bahasa kanan ke kiri, tambahkan juga di `META` pada `js/i18n.js`.
- **Warna:** variabel di bagian `:root` pada `css/style.css`.

## Hal yang perlu diperiksa sebelum dipublikasikan

- **Nama pimpinan** sengaja dikosongkan di `config.js`. Isi jika ingin ditampilkan, atau ubah `showLeader` menjadi `false` untuk menyembunyikan foto.
- **Nomor NIB** dibaca dari gambar dokumen. Cocokkan dengan dokumen asli, atau ubah `showNib` menjadi `false`.
- **Status izin usaha:** pada dokumen OSS, Izin Usaha tercatat "belum berlaku efektif" sampai komitmen dipenuhi. Pastikan statusnya sudah efektif sebelum mencantumkannya di bagian Legalitas.
- **Jangan unggah KTP atau NPWP pribadi** ke repository publik. Situs ini hanya menampilkan nama dokumen, bukan salinannya.
- **Gambar pratinjau di WhatsApp/Facebook:** ganti `og:image` di `index.html` dengan alamat lengkap, misalnya `https://USERNAME.github.io/bbl-logistik/assets/img/hero.jpg`.
- **Foto armada** diambil dari PDF dan resolusinya rendah. Foto asli yang lebih tajam akan membuat tampilan jauh lebih baik.
- **Form kontak** membuka WhatsApp dengan pesan yang sudah terisi, jadi tidak butuh server.

## Mencoba di komputer

Buka `index.html` langsung di browser, atau jalankan `python -m http.server` di folder ini lalu buka http://localhost:8000.
