# DuitPos — PWA

Versi web dari DuitPos. Bisa diakses lewat browser dan di-"Add to Home
Screen" di iPhone biar kayak app beneran (fullscreen, ada icon sendiri).
Data disimpan di browser (localStorage) — per device/browser sendiri-sendiri,
belum ada sinkronisasi.

## Coba lokal dulu (opsional)

```bash
npm install
npm run dev
```

Buka link yang muncul di terminal (biasanya `http://localhost:5173`).

## Deploy ke GitHub + Vercel

1. **Push ke GitHub** — bikin repo baru, terus dari folder ini:

   ```bash
   git init
   git add .
   git commit -m "Initial commit DuitPos web"
   git branch -M main
   git remote add origin <url-repo-github-kamu>
   git push -u origin main
   ```

2. **Deploy di Vercel**
   - Buka [vercel.com](https://vercel.com) → New Project → import repo GitHub kamu
   - Framework Preset: Vercel bakal otomatis kedeteksi **Vite** — biarin default aja
   - Build Command: `npm run build` (default)
   - Output Directory: `dist` (default)
   - Klik Deploy

   Selesai, dapet URL kayak `duitpos-xxxx.vercel.app`. Setiap kali kamu push ke GitHub, Vercel auto-deploy ulang.

## Install ke Home Screen iPhone

1. Buka URL Vercel-nya di **Safari** (harus Safari, bukan Chrome, biar fitur Add to Home Screen jalan penuh di iOS)
2. Tap ikon **Share** (kotak dengan panah ke atas)
3. Pilih **"Add to Home Screen"**
4. Icon DuitPos muncul di Home Screen, buka fullscreen kayak app native

## Kekurangan dibanding versi native (Expo)

- Notifikasi push kurang reliable di iOS PWA
- Nggak bisa masuk App Store
- Data cuma tersimpan di 1 browser/device, kalau ganti HP atau clear data Safari, data ilang (bisa ditambah export/import manual kalau perlu)

## Struktur folder

```
src/App.jsx           tab navigation utama
src/screens/           5 layar sesuai roadmap
src/components/        Card, BarChart, SplitBar
src/storage.js         baca/tulis ke localStorage
src/theme.js           warna & format Rupiah
vite.config.js         konfigurasi PWA (manifest, service worker)
```
