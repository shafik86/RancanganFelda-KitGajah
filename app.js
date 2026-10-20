// Peta & tracking Kit Gajah FELDA 2026. Data dalam data.js (RANCANGAN).

const WIL_COLORS = {
  "Johor Bahru": "#c62828",
  "Segamat":     "#ef6c00",
  "Trolak":      "#7b1fa2",
  "Kuantan":     "#b58900",
  "Terengganu":  "#0277bd",
  "Gua Musang":  "#283593",
  "Jengka":      "#2e7d32",
  "Sahabat":     "#d81b60",
};
const WILAYAH = Object.keys(WIL_COLORS);

const STATUS = {
  none:  { label: "Belum ada permintaan",   color: "#8a8f8c", bg: "#eeeeec" },
  draft: { label: "Draf siap, belum hantar", color: "#c2410c", bg: "#ffedd5" },
  sent:  { label: "Dihantar / dalam proses", color: "#1d4ed8", bg: "#dbeafe" },
  done:  { label: "Selesai",                 color: "#15803d", bg: "#dcfce7" },
  other: { label: "Lain-lain",               color: "#57534e", bg: "#f5f5f4" },
};

// Classify the free-text status from the tracking sheet. Order matters:
// "belum dihantar" must be caught as draft before the generic "dihantar".
function statusKey(s) {
  s = (s || "").toLowerCase();
  if (!s || s.includes("belum ada")) return "none";
  if (s.includes("draf") || s.includes("belum dihantar")) return "draft";
  if (/selesai|diterima|delivered|diserahkan|barang (telah |sudah )?(dihantar|sampai)/.test(s)) return "done";
  if (/dihantar|hantar|\bpo\b|pesanan|order|proses/.test(s)) return "sent";
  return "other";
}

const CONF_LABEL = { H: "Tinggi", M: "Sederhana", L: "Rendah" };
const KIT = [
  ["mammoth", "SM Mammoth"],
  ["walkie", "Walkie Talkie"],
  ["hailer", "Hailer"],
  ["blinker", "Blinker"],
];

const DATA = RANCANGAN.map(r => ({ ...r, sk: statusKey(r.status), low: r.lokasi.keyakinan === "L" }));

let colorMode = "wilayah";
let openWil = null;
let activeNo = null;

const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const fmt = n => n.toLocaleString("ms-MY");
const sum = (rows, k) => rows.reduce((t, r) => t + (r.kit[k] || 0), 0);
const colorOf = r => colorMode === "status" ? STATUS[r.sk].color : WIL_COLORS[r.wilayah];
const badge = r => `<span class="badge" style="color:${STATUS[r.sk].color};background:${STATUS[r.sk].bg}">${STATUS[r.sk].label}</span>`;
const telDigits = t => (t || "").replace(/\D/g, "");
const ico = name => `<svg class="ico"><use href="#i-${name}"/></svg>`;

// ---------- Map ----------
const map = L.map("map", { zoomControl: false });
L.control.zoom({ position: "topright" }).addTo(map);

// Esri tiles: no API key, and work when the page is opened via file://
// (tile.openstreetmap.org blocks requests without a Referer; CARTO now needs a key)
const esri = name => L.tileLayer(`https://server.arcgisonline.com/ArcGIS/rest/services/${name}/MapServer/tile/{z}/{y}/{x}`, {
  maxZoom: 19, attribution: "Tiles &copy; Esri"
});
const street = esri("World_Street_Map");
const topo = esri("World_Topo_Map");
const sat = esri("World_Imagery");
street.addTo(map);
L.control.layers({ "Peta jalan": street, "Topografi": topo, "Satelit": sat }, null, { position: "topright" }).addTo(map);
L.control.scale({ imperial: false, position: "bottomright" }).addTo(map);

const legend = L.control({ position: "bottomleft" });
legend.onAdd = () => L.DomUtil.create("div", "legend");
legend.addTo(map);

function renderLegend() {
  const el = legend.getContainer();
  if (colorMode === "status") {
    const used = Object.keys(STATUS).filter(k => DATA.some(r => r.sk === k));
    el.innerHTML = "<b>Status</b><br>" + used.map(k => `<i style="background:${STATUS[k].color}"></i>${STATUS[k].label}`).join("<br>");
  } else {
    el.innerHTML = "<b>Wilayah</b><br>" + WILAYAH.map(w => `<i style="background:${WIL_COLORS[w]}"></i>${w}`).join("<br>");
  }
}

function popupHtml(r) {
  const tel = telDigits(r.tel);
  const kit = KIT.map(([k, label]) =>
    `<div class="${k === "mammoth" ? "hl" : ""}"><b>${r.kit[k]}</b><span>${label}</span></div>`).join("");
  return `<div class="pop">
    <div class="pop-title">${r.no}. FELDA ${esc(r.rancangan)}${r.low ? " ⚠" : ""}</div>
    <div class="pop-wil" style="color:${WIL_COLORS[r.wilayah]}">Wilayah ${esc(r.wilayah)} · ${esc(r.daerah)}, ${esc(r.negeri)}</div>
    ${badge(r)}

    <h4>Kit untuk dihantar</h4>
    <div class="kit">${kit}</div>

    <h4>Tracking</h4>
    <table>
      <tr><td>Status</td><td>${esc(r.status) || "—"}</td></tr>
      ${r.contact ? `<tr><td>Contact</td><td>${esc(r.contact)}</td></tr>` : ""}
      ${tel ? `<tr><td>No. tel</td><td><a class="tel" href="tel:+${tel}">${ico("phone")} ${esc(r.tel)}</a><br><a class="tel" href="https://wa.me/${tel}" target="_blank" rel="noopener">${ico("chat")} WhatsApp</a></td></tr>` : ""}
      ${r.alamat ? `<tr><td>Alamat</td><td>${esc(r.alamat)}</td></tr>` : ""}
    </table>
    ${r.catatan ? `<div class="catatan">${esc(r.catatan)}</div>` : ""}

    <h4>Lokasi</h4>
    <table>
      <tr><td>Koordinat</td><td>${r.lat.toFixed(6)}, ${r.lng.toFixed(6)}</td></tr>
      <tr><td>Keyakinan</td><td>${CONF_LABEL[r.lokasi.keyakinan]}</td></tr>
      <tr><td>Sumber</td><td>${esc(r.lokasi.sumber)}</td></tr>
    </table>
    ${r.lokasi.nota ? `<div class="note">${esc(r.lokasi.nota)}</div>` : ""}

    <div class="links">
      <a href="https://www.google.com/maps/dir/?api=1&destination=${r.lat},${r.lng}" target="_blank" rel="noopener">${ico("nav")}Navigasi</a>
      <a class="alt" href="https://www.waze.com/ul?ll=${r.lat},${r.lng}&navigate=yes" target="_blank" rel="noopener">${ico("car")}Waze</a>
    </div>
  </div>`;
}

const iconOf = r => L.divIcon({
  className: "",
  html: `<div class="pin${r.low ? " low" : ""}" style="background:${colorOf(r)}">${r.no}</div>`,
  iconSize: [26, 26], iconAnchor: [13, 13], popupAnchor: [0, -12]
});

DATA.forEach(r => {
  r.marker = L.marker([r.lat, r.lng], { icon: iconOf(r), title: `FELDA ${r.rancangan}` })
    .bindPopup(() => popupHtml(r), { maxWidth: 320 })
    .bindTooltip(`${r.no}. ${r.rancangan} · ${r.kit.mammoth} SM Mammoth`, { direction: "top", offset: [0, -12] })
    .on("click", () => setActive(r.no));
});

const boundsOf = rows => L.latLngBounds(rows.map(r => [r.lat, r.lng]));
const VIEWS = {
  all:   () => boundsOf(DATA),
  sem:   () => boundsOf(DATA.filter(r => r.negeri !== "Sabah")),
  sabah: () => boundsOf(DATA.filter(r => r.negeri === "Sabah")),
};
const fit = b => map.fitBounds(b, { padding: [40, 40], maxZoom: 13 });

// ---------- Sidebar ----------
const $list = document.getElementById("list");
const $search = document.getElementById("search");
const $filter = document.getElementById("filter");
const $status = document.getElementById("statusFilter");

WILAYAH.forEach(w => $filter.insertAdjacentHTML("beforeend", `<option>${w}</option>`));
Object.entries(STATUS).forEach(([k, s]) => {
  const n = DATA.filter(r => r.sk === k).length;
  if (n) $status.insertAdjacentHTML("beforeend", `<option value="${k}">${s.label} (${n})</option>`);
});

// While searching or filtering, every matching group is shown open
const showAllActive = () => !!($search.value.trim() || $filter.value || $status.value);

function visibleRows() {
  const q = $search.value.trim().toLowerCase();
  return DATA.filter(r =>
    (!$filter.value || r.wilayah === $filter.value) &&
    (!$status.value || r.sk === $status.value) &&
    (!q || `${r.no} ${r.rancangan} ${r.daerah} ${r.negeri} ${r.wilayah} ${r.contact} ${r.status}`.toLowerCase().includes(q)));
}

function renderStats(rows) {
  document.getElementById("tMammoth").textContent = fmt(sum(rows, "mammoth"));
  document.getElementById("tWalkie").textContent = fmt(sum(rows, "walkie"));
  document.getElementById("tHailer").textContent = fmt(sum(rows, "hailer"));
  document.getElementById("tBlinker").textContent = fmt(sum(rows, "blinker"));

  document.getElementById("tWilayah").textContent = new Set(rows.map(r => r.wilayah)).size;
  document.getElementById("tRancangan").textContent = rows.length;
  // Pending = anything not yet completed
  const pending = rows.filter(r => r.sk !== "done");
  document.getElementById("tPending").textContent = pending.length;
  const draft = pending.filter(r => r.sk === "draft").length;
  const none = pending.filter(r => r.sk === "none").length;
  document.getElementById("tPendingSub").textContent = `${draft} draf · ${none} belum minta`;
  const low = rows.filter(r => r.low).length;
  document.getElementById("subStats").textContent = [
    rows.length < DATA.length ? `Ditapis: ${rows.length} daripada ${DATA.length} rancangan` : "",
    low ? `⚠ ${low} lokasi perlu semak` : "",
  ].filter(Boolean).join(" · ");
}

function render() {
  const rows = visibleRows();
  DATA.forEach(r => rows.includes(r) ? r.marker.addTo(map) : r.marker.remove());
  renderStats(rows);

  if (!rows.length) { $list.innerHTML = `<div class="empty">Tiada rancangan sepadan.</div>`; return; }
  const showAll = showAllActive();
  $list.innerHTML = WILAYAH.map(w => {
    const g = rows.filter(r => r.wilayah === w);
    if (!g.length) return "";
    const open = showAll || openWil === w;
    return `<section class="group${open ? " open" : ""}" data-wil="${w}">
      <button class="ghead" type="button" aria-expanded="${open}">
        <span class="dot" style="background:${WIL_COLORS[w]}"></span>
        <span><span class="gname">Wilayah ${w}</span>
          <span class="gsub">${g.length} rancangan · ${fmt(sum(g, "mammoth"))} SM Mammoth</span></span>
        <span class="chev">›</span>
      </button>
      <div class="gbody">
      ${g.map(r => `<div class="item${r.no === activeNo ? " active" : ""}" data-no="${r.no}">
        <span class="num" style="background:${colorOf(r)}">${r.no}</span>
        <div class="body">
          <div class="name">${esc(r.rancangan)}</div>
          <div class="sub">${esc(r.daerah)}, ${esc(r.negeri)}${r.low ? ` · <span class="warn">⚠ Semak</span>` : ""}</div>
          ${badge(r)}
        </div>
        <span class="qty${r.kit.mammoth ? "" : " zero"}"><b>${r.kit.mammoth}</b>SM Mammoth</span>
      </div>`).join("")}
      </div>
    </section>`;
  }).join("");
}

function setActive(no) {
  activeNo = no;
  const r = DATA.find(d => d.no === no);
  if (openWil !== r.wilayah) { openWil = r.wilayah; render(); }
  $list.querySelectorAll(".item").forEach(el => el.classList.toggle("active", +el.dataset.no === no));
  const el = $list.querySelector(`.item[data-no="${no}"]`);
  if (el) el.scrollIntoView({ block: "nearest", behavior: "smooth" });
}

$list.addEventListener("click", e => {
  const head = e.target.closest(".ghead");
  if (head) {
    if (showAllActive()) return;
    const w = head.parentElement.dataset.wil;
    // Accordion: opening one wilayah closes the others
    openWil = openWil === w ? null : w;
    render();
    if (openWil) fit(boundsOf(DATA.filter(r => r.wilayah === w)));
    return;
  }
  const el = e.target.closest(".item");
  if (!el) return;
  const r = DATA.find(d => d.no === +el.dataset.no);
  setActive(r.no);
  // On mobile the list covers the map, so get out of the way
  if (isMobile()) setSidebar(false);
  map.flyTo([r.lat, r.lng], 13, { duration: 0.8 });
  map.once("moveend", () => r.marker.openPopup());
});

function refit() {
  render();
  const rows = visibleRows();
  if (rows.length && ($filter.value || $status.value)) fit(boundsOf(rows));
}
$search.addEventListener("input", render);
$filter.addEventListener("change", refit);
$status.addEventListener("change", refit);

document.querySelectorAll("[data-view]").forEach(b =>
  b.addEventListener("click", () => fit(VIEWS[b.dataset.view]())));

function setColorMode(mode) {
  colorMode = mode;
  document.querySelectorAll("[data-mode]").forEach(x => x.classList.toggle("on", x.dataset.mode === mode));
  DATA.forEach(r => r.marker.setIcon(iconOf(r)));
  renderLegend();
  render();
}
document.querySelectorAll("[data-mode]").forEach(b =>
  b.addEventListener("click", () => setColorMode(b.dataset.mode)));

// ---------- Sidebar open/close & mobile bottom bar ----------
const isMobile = () => matchMedia("(max-width: 760px)").matches;
const $nav = act => document.querySelector(`#bottomNav [data-act="${act}"]`);

function setSidebar(open) {
  document.body.classList.toggle("sb-closed", !open);
  $nav("map").classList.toggle("on", !open);
  $nav("search").classList.toggle("on", open);
  map.invalidateSize();
}
document.getElementById("closeSidebar").addEventListener("click", () => setSidebar(false));
document.getElementById("openSidebar").addEventListener("click", () => setSidebar(true));

document.getElementById("bottomNav").addEventListener("click", e => {
  const b = e.target.closest("button");
  if (!b) return;
  const act = b.dataset.act;
  if (act === "search") {
    setSidebar(true);
    $search.focus();
    return;
  }
  setSidebar(false);
  if (act !== "map") fit(VIEWS[act]());
});

// Mobile starts on the map; desktop starts with the list open
setSidebar(!isMobile());
renderLegend();
render();
setColorMode(colorMode);
// Semenanjung by default; Sabah is ~1,500 km away and would shrink the view
map.invalidateSize();
fit(VIEWS.sem());
window.addEventListener("load", () => { map.invalidateSize(); fit(VIEWS.sem()); });
