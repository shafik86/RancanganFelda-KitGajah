# Planning — Peta & Tracking Kit Gajah FELDA 2026

Peta satu halaman untuk 42 rancangan FELDA yang terlibat dalam pembekalan Kit Gajah (FarmGuard / SM Mammoth, Walkie Talkie, Hailer, Blinker), berserta status permintaan sebut harga.

## Repo

| | |
|---|---|
| GitHub | https://github.com/shafik86/RancanganFelda-KitGajah |
| SSH remote | `git@github.com:shafik86/RancanganFelda-KitGajah.git` |
| Branch | `main` |
| GitHub Pages | https://shafik86.github.io/RancanganFelda-KitGajah/ (auto dikemas kini setiap kali push ke `main`) |

> ⚠ Repo ini **public**. `data.js` dan xlsx tracking mengandungi nama & no. telefon contact person.

## Struktur fail

| Fail | Kegunaan |
|---|---|
| `index.html` | Struktur page + ikon SVG |
| `style.css` | Semua gaya (desktop & mobile) |
| `app.js` | Logik peta (Leaflet), senarai, penapis, status |
| `data.js` | **Data 42 rancangan** — fail yang perlu dikemas kini |
| `Tracking FELDA ORDER FARMGUARD 2026.xlsx` | **Sumber utama**: senarai & no. rancangan, kit (Lampiran 1), status, contact, no. tel, alamat, catatan |
| `Ringkasan Sebut Harga Kit Gajah FELDA 2026 - HQ.pdf` | No. sebut harga & jumlah RM (21 Okt 2026) |
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

## Status semasa (24 Okt 2026)

| | |
|---|---|
| Rancangan | 42 (8 wilayah) |
| Pending | 12 — Johor Bahru (6), Segamat (1: Nitar 01), Sahabat (5) |
| Requested | 30 — Johor Bahru (Air Tawar 04, Lok Heng Timur, Pasak, Tenggaroh Selatan 01), Segamat, Trolak, Kuantan, Terengganu, Gua Musang, Jengka |
| Kit | SM Mammoth 97 · Walkie Talkie 62 · Hailer 31 · Blinker 126 (ikut Excel tracking) |
| Jumlah sebut harga | RM 267,670.00 (30 rancangan; dipapar dalam sidebar). Tidak termasuk Extended Warranty Nitar 02 (RM1,600) & quotation Kerani KG4 (RM9,700) |

## Tindakan seterusnya

### Selesai (21 Okt 2026)

- [x] **GitHub Pages** aktif — https://shafik86.github.io/RancanganFelda-KitGajah/
- [x] **Air Tawar 01** — koordinat disahkan dengan OSM "Ayer Tawar 1" (~120 m); keyakinan Rendah → Sederhana
- [x] **Lasah** — dialih ke OSM "Felda Lasah, Sungai Siput" (4.9239, 101.0658); titik lama (Kampung Lasah) ~9 km tersasar; keyakinan Rendah → Sederhana
- [x] **Chalok Barat** — OSM (kampung FELDA + masjid) sepakat; koordinat felda.gov.my dianggap tersilap; keyakinan Sederhana → Tinggi
- [x] **Nitar 01** — dipindah ke **Wilayah Segamat** (no. 11), kit 3/2/1/3; **Kalabakan dibuang** (kuantitinya sebenarnya milik Nitar 01). Dikemas kini dalam `data.js`, Excel tracking & Excel rancangan.
- [x] **Tenggaroh Selatan 01** — sebut harga ND/FWJB/Q/2026-10211 (RM7,450) dihantar kepada En. Badrul; contact, alamat & catatan semua rancangan disegerakkan dengan Excel tracking
- [x] Status seterusnya disediakan: **PO diterima** & **Dihantar** (auto ikut kata kunci)

### Selesai (24 Okt 2026)

- [x] **Johor Bahru** — sebut harga dihantar: Air Tawar 04 (ND/FWJB/Q/2026-10231, RM10,450), Lok Heng Timur (ND/FWJB/Q/2026-10232, RM1,550), Pasak (ND/FWJB/Q/2026-10241, RM6,000, FarmGuard sahaja)
- [x] **Nitar 02** — R2 ND/FWSG/Q/2026-10191R2 (RM13,450) + Extended Warranty ND/FWSG/Q/2026-10231R1 (RM1,600)
- [x] **Chiku 01, Chiku 03, Perasu** — R2 (RM6,945 setiap satu)

### Perlu tindakan manual

- [ ] **PDF HQ belum dikemas kini** — PDF masih letak Nitar 01 di Johor Bahru dengan kuantiti kosong. Betul: **Wilayah Segamat, 3/2/1/3** (sudah dibetulkan dalam kedua-dua Excel & peta).
- [ ] **Bukit Sagu 2/3** — tiada titik dalam GeoNames/OSM; minta koordinat dari pejabat rancangan atau Wilayah Kuantan.
- [ ] Kemas kini status bila Johor Bahru & Sahabat buat permintaan.

## Cara kemas kini & push

1. Ubah `data.js` (status, kit, contact, dll.), kemudian tukar `?v=` pada tag `<script>` dalam `index.html` (cth. `?v=20261022`) supaya browser tak guna versi cache.
2. Buka `index.html` dalam browser untuk semak.
3. Push:

```bash
git add -A
git commit -m "Kemas kini status"
git push
```
