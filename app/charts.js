// charts.js — Grafik SVG buatan tangan, tanpa pustaka dan tanpa jaringan.
// Donat, batang berkelompok, dan garis tren; semua fungsi mengembalikan string SVG.

function svgOpen(width, height, label) {
  return '<svg viewBox="0 0 ' + width + ' ' + height + '" width="100%" role="img" aria-label="' + label + '" preserveAspectRatio="xMidYMid meet">';
}

function polar(cx, cy, radius, angleDeg) {
  const angle = ((angleDeg - 90) * Math.PI) / 180;
  return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
}

function arcPath(cx, cy, radius, startAngle, endAngle) {
  const [sx, sy] = polar(cx, cy, radius, startAngle);
  const [ex, ey] = polar(cx, cy, radius, endAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return 'M ' + sx.toFixed(2) + ' ' + sy.toFixed(2) + ' A ' + radius + ' ' + radius + ' 0 ' + large + ' 1 ' + ex.toFixed(2) + ' ' + ey.toFixed(2);
}

// Donat pengeluaran per kategori, lengkap dengan legenda di samping.
export function donutChart(segments, size) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  const cx = 110;
  const cy = 110;
  const radius = 84;
  const stroke = 30;
  let angle = 0;
  let arcs = '';
  for (const seg of segments) {
    const sweep = (seg.value / total) * 360;
    if (seg.value <= 0) continue;
    const start = angle;
    const end = angle + sweep;
    // Potongan kecil agar tiap irisan terpisah rapi.
    const gap = sweep > 4 ? 1.2 : 0;
    arcs += '<path d="' + arcPath(cx, cy, radius, start + gap, end - gap) + '" fill="none" stroke="' + seg.color + '" stroke-width="' + stroke + '" stroke-linecap="butt"/>';
    angle = end;
  }
  let legend = '';
  for (const seg of segments) {
    const pct = Math.round((seg.value / total) * 100);
    legend += '<li><span class="dot" style="background:' + seg.color + '"></span><span class="leg-label">' + seg.label + '</span><span class="leg-value">' + pct + '%</span></li>';
  }
  const center = '<text x="' + cx + '" y="' + (cy - 6) + '" text-anchor="middle" class="donut-total">' + totalLabel(total) + '</text>'
    + '<text x="' + cx + '" y="' + (cy + 16) + '" text-anchor="middle" class="donut-sub">total belanja</text>';
  return '<div class="donut-wrap">' + svgOpen(220, 220, 'Donat pengeluaran per kategori') + arcs + center + '</svg>'
    + '<ul class="donut-legend">' + legend + '</ul></div>';
}

function totalLabel(total) {
  if (total >= 1000000) return 'Rp ' + (total / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + ' jt';
  return 'Rp ' + total.toLocaleString('id-ID');
}

// Batang berkelompok: pemasukan vs pengeluaran per bulan.
export function groupedBarChart(points) {
  const width = 640;
  const height = 260;
  const padL = 64;
  const padB = 30;
  const padT = 18;
  const max = Math.max(...points.flatMap((p) => [p.income, p.spending])) * 1.08;
  const chartW = width - padL - 16;
  const chartH = height - padT - padB;
  const slot = chartW / points.length;
  const barW = Math.min(30, slot / 3.2);
  let bars = '';
  let labels = '';
  points.forEach((p, i) => {
    const x0 = padL + i * slot + slot / 2;
    const hInc = (p.income / max) * chartH;
    const hSpend = (p.spending / max) * chartH;
    bars += '<rect x="' + (x0 - barW - 3).toFixed(1) + '" y="' + (padT + chartH - hInc).toFixed(1) + '" width="' + barW + '" height="' + hInc.toFixed(1) + '" rx="3" fill="#0f766e"><title>Pemasukan ' + p.label + ': Rp ' + p.income.toLocaleString('id-ID') + '</title></rect>';
    bars += '<rect x="' + (x0 + 3).toFixed(1) + '" y="' + (padT + chartH - hSpend).toFixed(1) + '" width="' + barW + '" height="' + hSpend.toFixed(1) + '" rx="3" fill="#db2777"><title>Pengeluaran ' + p.label + ': Rp ' + p.spending.toLocaleString('id-ID') + '</title></rect>';
    labels += '<text x="' + x0.toFixed(1) + '" y="' + (height - 8) + '" text-anchor="middle" class="axis-label">' + p.label + '</text>';
  });
  let grid = '';
  for (let g = 0; g <= 4; g++) {
    const y = padT + (chartH * g) / 4;
    const val = max * (1 - g / 4);
    grid += '<line x1="' + padL + '" y1="' + y.toFixed(1) + '" x2="' + (width - 16) + '" y2="' + y.toFixed(1) + '" class="grid-line"/>';
    grid += '<text x="' + (padL - 8) + '" y="' + (y + 4).toFixed(1) + '" text-anchor="end" class="axis-label">' + Math.round(val / 1000000) + ' jt</text>';
  }
  return svgOpen(width, height, 'Batang pemasukan dan pengeluaran per bulan')
    + grid + bars + labels
    + '<line x1="' + padL + '" y1="' + (padT + chartH) + '" x2="' + (width - 16) + '" y2="' + (padT + chartH) + '" class="axis-line"/></svg>'
    + '<p class="chart-key"><span><i style="background:#0f766e"></i>Pemasukan</span><span><i style="background:#db2777"></i>Pengeluaran</span></p>';
}

// Garis tren tabungan (sisa) per bulan, dengan titik dan label nilai.
export function savingsLineChart(points) {
  const width = 640;
  const height = 240;
  const padL = 56;
  const padB = 30;
  const padT = 24;
  const max = Math.max(...points.map((p) => p.saved)) * 1.15;
  const chartW = width - padL - 24;
  const chartH = height - padT - padB;
  const step = points.length > 1 ? chartW / (points.length - 1) : chartW;
  const coords = points.map((p, i) => [padL + i * step, padT + chartH - (p.saved / max) * chartH]);
  let grid = '';
  for (let g = 0; g <= 3; g++) {
    const y = padT + (chartH * g) / 3;
    const val = max * (1 - g / 3);
    grid += '<line x1="' + padL + '" y1="' + y.toFixed(1) + '" x2="' + (width - 24) + '" y2="' + y.toFixed(1) + '" class="grid-line"/>';
    grid += '<text x="' + (padL - 8) + '" y="' + (y + 4).toFixed(1) + '" text-anchor="end" class="axis-label">' + (val / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + ' jt</text>';
  }
  const line = coords.map((c, i) => (i === 0 ? 'M ' : 'L ') + c[0].toFixed(1) + ' ' + c[1].toFixed(1)).join(' ');
  const area = line + ' L ' + coords[coords.length - 1][0].toFixed(1) + ' ' + (padT + chartH) + ' L ' + coords[0][0].toFixed(1) + ' ' + (padT + chartH) + ' Z';
  let dots = '';
  let labels = '';
  coords.forEach((c, i) => {
    dots += '<circle cx="' + c[0].toFixed(1) + '" cy="' + c[1].toFixed(1) + '" r="5" fill="#0f766e" stroke="#fff" stroke-width="2"><title>' + points[i].label + ': Rp ' + points[i].saved.toLocaleString('id-ID') + ' ditabung</title></circle>';
    labels += '<text x="' + c[0].toFixed(1) + '" y="' + (c[1] - 10).toFixed(1) + '" text-anchor="middle" class="axis-label strong">' + (points[i].saved / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + ' jt</text>';
    labels += '<text x="' + c[0].toFixed(1) + '" y="' + (height - 8) + '" text-anchor="middle" class="axis-label">' + points[i].label + '</text>';
  });
  return svgOpen(width, height, 'Garis tren tabungan per bulan')
    + grid
    + '<path d="' + area + '" fill="#0f766e" opacity="0.10"/>'
    + '<path d="' + line + '" fill="none" stroke="#0f766e" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>'
    + dots + labels + '</svg>';
}

// Batang anggaran: rencana vs realisasi per kategori, dengan lencana lebih/kurang.
export function budgetBars(rows) {
  let out = '<ul class="budget-list">';
  for (const row of rows) {
    const pct = row.planned > 0 ? Math.round((row.actual / row.planned) * 100) : 0;
    const over = row.actual > row.planned;
    const diff = row.actual - row.planned;
    const barPct = Math.min(100, pct);
    out += '<li class="budget-row">'
      + '<div class="budget-head"><span class="budget-cat"><span class="dot" style="background:' + row.color + '"></span>' + row.label + '</span>'
      + '<span class="budget-nums">' + rupiahShort(row.actual) + ' <span class="muted">dari ' + rupiahShort(row.planned) + '</span></span></div>'
      + '<div class="budget-track"><div class="budget-fill' + (over ? ' over' : '') + '" style="width:' + barPct + '%"></div></div>'
      + '<div class="budget-foot"><span class="budget-pct">' + pct + '% terpakai</span>'
      + '<span class="badge ' + (over ? 'badge-over' : 'badge-under') + '">' + (over ? 'Lebih ' + rupiahShort(diff) : diff === 0 ? 'Pas rencana' : 'Sisa ' + rupiahShort(-diff)) + '</span></div>'
      + '</li>';
  }
  return out + '</ul>';
}

function rupiahShort(n) {
  if (n >= 1000000) return 'Rp ' + (n / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + ' jt';
  if (n >= 1000) return 'Rp ' + Math.round(n / 1000) + ' rb';
  return 'Rp ' + n.toLocaleString('id-ID');
}

// Batang perbandingan sederhana untuk kalkulator 50/30/20.
export function splitBar(parts) {
  const total = parts.reduce((sum, p) => sum + p.value, 0) || 1;
  let segs = '';
  for (const p of parts) {
    const pct = (p.value / total) * 100;
    if (pct <= 0) continue;
    segs += '<div class="split-seg" style="width:' + pct.toFixed(1) + '%;background:' + p.color + '" title="' + p.label + ': ' + pct.toFixed(0) + '%"></div>';
  }
  return '<div class="split-bar" role="img" aria-label="Pembagian anggaran">' + segs + '</div>';
}
