# Planning — Peta & Tracking Kit Gajah FELDA 2026

Peta satu halaman untuk 42 rancangan FELDA yang terlibat dalam pembekalan Kit Gajah (FarmGuard / SM Mammoth, Walkie Talkie, Hailer, Blinker), berserta status permintaan sebut harga.

## Repo

| | |
|---|---|
| GitHub | https://github.com/shafik86/RancanganFelda-KitGajah |
| SSH remote | `git@github.com:shafik86/RancanganFelda-KitGajah.git` |
| Branch | `main` |
| GitHub Pages | https://shafik86.github.io/RancanganFelda-KitGajah/ (aktifkan di Settings → Pages → `main` / root) |

> ⚠ Repo ini **public**. `data.js` dan xlsx tracking mengandungi nama & no. telefon contact person.

## Struktur fail

| Fail | Kegunaan |
|---|---|
| `index.html` | Struktur page + ikon SVG |
| `style.css` | Semua gaya (desktop & mobile) |
| `app.js` | Logik peta (Leaflet), senarai, penapis, status |
| `data.js` | **Data 42 rancangan** — fail yang perlu dikemas kini |
| `Ringkasan Sebut Harga Kit Gajah FELDA 2026 - HQ.pdf` | Sumber utama: kit, no. sebut harga, jumlah RM, status (21 Okt 2026) |
| `Tracking FELDA ORDER FARMGUARD 2026.xlsx` | Contact, no. tel, alamat, catatan |
| `RANCANGAN_FELDA_KIT_GAJAH_2026.xlsx` | Senarai nama rancangan |
| `FarmGuard_KitGajah_FELDA_2026.kml` | Koordinat rancangan |

## Peraturan data

- **Status** (dikenal pasti ikut kata kunci dalam `statusKey()`, `app.js`)
  - `Belum menerima permintaan` → **Pending**
  - mengandungi `PO` / `purchase order` / `pesanan belian` → **PO diterima**
  - mengandungi `selesai` / `delivered` / `diserahkan` / `barang telah dihantar` → **Dihantar**
  - selain itu (cth. `Sebut harga telah dihantar`) → **Requested**
  - Status yang belum ada rancangan tidak dipapar dalam penapis & legend.
- **Kit** = `null` bermaksud kuantiti belum ditetapkan (dipapar sebagai `—`).
- **lokasi.keyakinan**: `H` tinggi, `M` sederhana, `L` rendah (⚠ perlu semak di lapangan).
- Peta asas guna tiles **Esri** (tiada API key, boleh buka terus dari fail). Jangan guna `tile.openstreetmap.org` (disekat bila buka via `file://`) atau CARTO (perlu API key).

## Status semasa (21 Okt 2026)

| | |
|---|---|
| Rancangan | 42 (8 wilayah) |
| Pending | 16 — Johor Bahru (11), Sahabat (5) |
| Requested | 26 — Segamat, Trolak, Kuantan, Terengganu, Gua Musang, Jengka |
| Kit | SM Mammoth 94 · Walkie Talkie 60 · Hailer 30 · Blinker 123 |
| Jumlah sebut harga | RM 241,915.00 |

## Tindakan seterusnya

### Selesai (21 Okt 2026)

- [x] **Air Tawar 01** — koordinat disahkan dengan OSM "Ayer Tawar 1" (~120 m); keyakinan Rendah → Sederhana
- [x] **Lasah** — dialih ke OSM "Felda Lasah, Sungai Siput" (4.9239, 101.0658); titik lama (Kampung Lasah) ~9 km tersasar; keyakinan Rendah → Sederhana
- [x] **Chalok Barat** — OSM (kampung FELDA + masjid) sepakat; koordinat felda.gov.my dianggap tersilap; keyakinan Sederhana → Tinggi
- [x] Status seterusnya disediakan: **PO diterima** & **Dihantar** (auto ikut kata kunci)

### Perlu tindakan manual

- [ ] **Aktifkan GitHub Pages** — perlu log masuk GitHub (Settings → Pages → Deploy from a branch → `main` / root). Tak boleh dibuat melalui SSH.
- [ ] **Nitar 01** — sahkan kuantiti (tiada dalam Lampiran 1) dan wilayah (Johor Bahru vs Segamat; Nitar 02 di bawah Segamat). Tiada sumber awam yang menyatakannya.
- [ ] **Bukit Sagu 2/3** — tiada titik dalam GeoNames/OSM; minta koordinat dari pejabat rancangan atau Wilayah Kuantan.
- [ ] Kemas kini status bila Johor Bahru & Sahabat buat permintaan.

## Cara kemas kini & push

1. Ubah `data.js` (status, kit, contact, dll.).
2. Buka `index.html` dalam browser untuk semak.
3. Push:

```bash
git add -A
git commit -m "Kemas kini status"
git push
```
