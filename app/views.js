// views.js — Setiap halaman dirender dari state (data.js) menjadi HTML.
// Semua angka dijumlahkan dari data yang sama, jadi dashboard, anggaran,
// laporan, dan kalkulator selalu konsisten.

import { CATEGORIES, PLANNED, SAVINGS_GOALS, BILLS, MONTHS, CURRENT_MONTH, rupiah, rupiahShort, monthLabel, categoryById, sumAmounts, actualsForMonth, incomeForMonth, plannedTotal } from './data.js';
import { donutChart, groupedBarChart, savingsLineChart, budgetBars, splitBar } from './charts.js';

function esc(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function pageHead(title, intro) {
  return '<section class="page-head"><h1>' + title + '</h1><p>' + intro + '</p></section>';
}

function statCard(label, value, sub, tone) {
  return '<article class="stat ' + (tone || '') + '"><span class="stat-label">' + label + '</span><strong class="stat-value">' + value + '</strong><span class="stat-sub">' + sub + '</span></article>';
}

function monthSummary(month) {
  const income = incomeForMonth(month);
  const actuals = actualsForMonth(month);
  const spending = sumAmounts(Object.values(actuals).map((amount) => ({ amount })));
  const saved = income - spending;
  const planned = plannedTotal();
  return { income, spending, saved, planned, actuals };
}

// ---------- Beranda / Dashboard ----------

export function renderDashboard(state) {
  const month = state.month;
  const s = monthSummary(month);
  const unpaid = state.bills.filter((b) => !b.paid);
  const unpaidTotal = sumAmounts(unpaid);
  const donutSegs = CATEGORIES.map((c) => ({ label: c.label, value: s.actuals[c.id], color: c.color }));
  const budgetRows = CATEGORIES.map((c) => ({ label: c.label, color: c.color, planned: PLANNED[c.id], actual: s.actuals[c.id] }));
  const nextBill = unpaid.slice().sort((a, b) => a.due - b.due)[0];

  let billsHtml = '';
  if (unpaid.length === 0) {
    billsHtml = '<p class="empty-note">Semua tagihan bulan ini sudah lunas. Bagus sekali!</p>';
  } else {
    billsHtml = '<ul class="bill-mini">' + unpaid.slice(0, 4).map((b) =>
      '<li><span>' + esc(b.name) + ' <small>jatuh tempo tgl ' + b.due + '</small></span><strong>' + rupiah(b.amount) + '</strong></li>'
    ).join('') + '</ul>';
  }

  return pageHead('Beranda Keluarga Prasetyo',
    'Ringkasan keuangan ' + monthLabel(month) + ' — pemasukan Rp 12.500.000, pengeluaran tercatat, dan tabungan yang sudah dialokasikan.')
    + '<section class="stats-grid">'
    + statCard('Pemasukan', rupiah(s.income), monthLabel(month), 'tone-green')
    + statCard('Pengeluaran', rupiah(s.spending), 'dari ' + CATEGORIES.length + ' kategori', 'tone-pink')
    + statCard('Ditabung', rupiah(s.saved), 'dana darurat + liburan + DP rumah', 'tone-blue')
    + statCard('Sisa anggaran', rupiah(s.planned - s.spending), 'dari rencana ' + rupiahShort(s.planned), s.planned - s.spending >= 0 ? 'tone-green' : 'tone-pink')
    + '</section>'
    + '<section class="grid-2">'
    + '<article class="card"><h2>Pengeluaran per kategori</h2><p class="card-sub">Donat ' + monthLabel(month) + ' — klik kategori di <a href="#/pengeluaran">Pengeluaran</a> untuk melihat transaksinya.</p>' + donutChart(donutSegs) + '</article>'
    + '<article class="card"><h2>Tagihan yang belum dibayar</h2><p class="card-sub">' + unpaid.length + ' tagihan · total ' + rupiah(unpaidTotal) + (nextBill ? ' · paling dekat: ' + esc(nextBill.name) + ' tgl ' + nextBill.due : '') + '</p>' + billsHtml + '<p><a class="btn" href="#/tagihan">Lihat semua tagihan →</a></p></article>'
    + '</section>'
    + '<section class="card"><h2>Anggaran vs realisasi — ' + monthLabel(month) + '</h2><p class="card-sub">Rencana belanja ' + rupiahShort(s.planned) + ' · sudah terpakai ' + rupiahShort(s.spending) + ' (' + Math.round((s.spending / s.planned) * 100) + '%)</p>' + budgetBars(budgetRows) + '<p><a class="btn" href="#/anggaran">Buka halaman Anggaran →</a></p></section>'
    + '<section class="card"><h2>Jalan pintas</h2><div class="quick-links">'
    + '<a href="#/pemasukan">＋ Catat pemasukan</a><a href="#/pengeluaran">＋ Catat pengeluaran</a><a href="#/tabungan">＋ Tambah tabungan</a><a href="#/kalkulator">Hitung 50/30/20</a><a href="#/laporan">Laporan 6 bulan</a>'
    + '</div></section>';
}

// ---------- Pemasukan ----------

export function renderIncome(state) {
  const rows = state.income;
  const total = sumAmounts(rows);
  const list = rows.map((r) =>
    '<tr><td>' + r.date.slice(8) + ' Nov</td><td><strong>' + esc(r.source) + '</strong><br><small class="muted">' + esc(r.detail) + '</small></td><td class="num">' + rupiah(r.amount) + '</td><td><button class="btn-ghost" data-delete-income="' + r.id + '">Hapus</button></td></tr>'
  ).join('');
  return pageHead('Pemasukan — November 2026',
    'Gaji dan penghasilan sampingan keluarga. Total bulan ini ' + rupiah(total) + ' — tambah pemasukan baru lewat formulir di bawah, total langsung berubah.')
    + '<section class="stats-grid">' + statCard('Total pemasukan', rupiah(total), 'November 2026', 'tone-green')
    + statCard('Gaji tetap', rupiah(10500000), 'Budi + tunjangan transport', '')
    + statCard('Penghasilan sampingan', rupiah(total - 10500000), 'Desain lepas + jualan online', 'tone-blue') + '</section>'
    + '<section class="card"><h2>Daftar pemasukan</h2><div class="table-wrap"><table class="tbl"><thead><tr><th>Tanggal</th><th>Sumber</th><th class="num">Jumlah</th><th></th></tr></thead><tbody>' + list + '</tbody></table></div></section>'
    + '<section class="card"><h2>Tambah pemasukan</h2>'
    + '<form id="income-form" class="form-grid"><label>Sumber<input name="source" required maxlength="60" placeholder="cth. Bonus proyek"></label>'
    + '<label>Detail<input name="detail" maxlength="80" placeholder="cth. Proyek desain logo"></label>'
    + '<label>Tanggal<input name="date" type="date" value="2026-11-26" required></label>'
    + '<label>Jumlah (Rp)<input name="amount" type="number" min="1000" step="1000" required placeholder="500000"></label>'
    + '<button class="btn" type="submit">Simpan pemasukan</button></form>'
    + '<p class="form-note">Disimpan hanya di memori halaman ini — tutup tab dan catatan tambahan hilang, data contoh kembali seperti semula.</p></section>';
}

// ---------- Pengeluaran ----------

export function renderExpenses(state) {
  const f = state.expenseFilter;
  let rows = state.expenses.slice();
  if (f.category !== 'semua') rows = rows.filter((r) => r.category === f.category);
  if (f.query) {
    const q = f.query.toLowerCase();
    rows = rows.filter((r) => r.note.toLowerCase().includes(q) || categoryById(r.category).label.toLowerCase().includes(q));
  }
  rows.sort((a, b) => f.sort === 'amount-desc' ? b.amount - a.amount : f.sort === 'amount-asc' ? a.amount - b.amount : b.date.localeCompare(a.date));
  const total = sumAmounts(rows);
  const grandTotal = sumAmounts(state.expenses);
  const options = ['<option value="semua">Semua kategori</option>'].concat(CATEGORIES.map((c) =>
    '<option value="' + c.id + '"' + (f.category === c.id ? ' selected' : '') + '>' + c.label + '</option>')).join('');
  const list = rows.map((r) => {
    const cat = categoryById(r.category);
    return '<tr><td>' + r.date.slice(8) + ' Nov 2026</td><td><span class="cat-chip" style="--chip:' + cat.color + '">' + cat.label + '</span></td><td>' + esc(r.note) + '</td><td class="num">' + rupiah(r.amount) + '</td><td><button class="btn-ghost" data-delete-expense="' + r.id + '">Hapus</button></td></tr>';
  }).join('');
  return pageHead('Pengeluaran — November 2026',
    rows.length + ' transaksi ditampilkan · total ' + rupiah(total) + ' dari ' + rupiah(grandTotal) + ' bulan ini. Saring, cari, urutkan, atau tambah pengeluaran baru.')
    + '<section class="card"><div class="filter-row">'
    + '<label>Kategori<select id="filter-category">' + options + '</select></label>'
    + '<label>Cari<input id="filter-query" type="search" placeholder="cth. supermarket, bensin…" value="' + esc(f.query) + '"></label>'
    + '<label>Urutkan<select id="filter-sort">'
    + '<option value="date-desc"' + (f.sort === 'date-desc' ? ' selected' : '') + '>Tanggal terbaru</option>'
    + '<option value="amount-desc"' + (f.sort === 'amount-desc' ? ' selected' : '') + '>Jumlah terbesar</option>'
    + '<option value="amount-asc"' + (f.sort === 'amount-asc' ? ' selected' : '') + '>Jumlah terkecil</option>'
    + '</select></label></div>'
    + '<div class="table-wrap"><table class="tbl"><thead><tr><th>Tanggal</th><th>Kategori</th><th>Catatan</th><th class="num">Jumlah</th><th></th></tr></thead><tbody>'
    + (list || '<tr><td colspan="5" class="empty-note">Tidak ada transaksi yang cocok. Ubah saringan atau kata kunci.</td></tr>')
    + '</tbody></table></div>'
    + '<p class="table-total">Total yang ditampilkan: <strong>' + rupiah(total) + '</strong></p></section>'
    + '<section class="card"><h2>Tambah pengeluaran</h2>'
    + '<form id="expense-form" class="form-grid"><label>Kategori<select name="category">' + CATEGORIES.map((c) => '<option value="' + c.id + '">' + c.label + '</option>').join('') + '</select></label>'
    + '<label>Catatan<input name="note" required maxlength="80" placeholder="cth. Belanja sayur di pasar"></label>'
    + '<label>Tanggal<input name="date" type="date" value="2026-11-26" required></label>'
    + '<label>Jumlah (Rp)<input name="amount" type="number" min="1000" step="1000" required placeholder="100000"></label>'
    + '<button class="btn" type="submit">Simpan pengeluaran</button></form>'
    + '<p class="form-note">Pengeluaran baru langsung masuk ke total, donat Beranda, dan batang Anggaran.</p></section>';
}

// ---------- Anggaran ----------

export function renderBudget(state) {
  const month = state.month;
  const s = monthSummary(month);
  const rows = CATEGORIES.map((c) => ({ label: c.label, color: c.color, planned: PLANNED[c.id], actual: s.actuals[c.id] }));
  const over = rows.filter((r) => r.actual > r.planned);
  const under = s.planned - s.spending;
  const monthOptions = MONTHS.map((m) => '<option value="' + m.key + '"' + (m.key === month ? ' selected' : '') + '>' + m.label + '</option>').join('');
  return pageHead('Anggaran — ' + monthLabel(month),
    'Amplop belanja per kategori. Rencana ' + rupiah(s.planned) + ' · terpakai ' + rupiah(s.spending) + ' (' + Math.round((s.spending / s.planned) * 100) + '%) · ' + (under >= 0 ? 'masih sisa ' + rupiah(under) : 'kelebihan ' + rupiah(-under)) + '.')
    + '<section class="stats-grid">'
    + statCard('Rencana belanja', rupiah(s.planned), monthLabel(month), '')
    + statCard('Sudah terpakai', rupiah(s.spending), Math.round((s.spending / s.planned) * 100) + '% dari rencana', over.length ? 'tone-pink' : 'tone-green')
    + statCard('Sisa anggaran', rupiah(Math.max(0, under)), under >= 0 ? 'masih dalam rencana' : 'melewati rencana', under >= 0 ? 'tone-green' : 'tone-pink')
    + statCard('Kategori melewati batas', String(over.length), over.length ? over.map((r) => r.label).join(', ') : 'tidak ada — semua aman', over.length ? 'tone-pink' : 'tone-green')
    + '</section>'
    + '<section class="card"><div class="filter-row"><label>Lihat bulan lain<select id="budget-month">' + monthOptions + '</select></label></div>'
    + budgetBars(rows)
    + '<p class="card-sub">Hiburan melewati rencana Rp 150.000 bulan ini — ditutup dari sisa Belanja Harian dan Kesehatan, jadi total tetap di bawah rencana.</p></section>'
    + '<section class="card"><h2>Cara keluarga ini memakai amplop</h2><ul class="tips"><li><strong>Belanja Harian</strong> dibatasi Rp 100.000 per hari — belanja pasar tiap 3 hari sekali.</li><li><strong>Hiburan</strong> boleh lewat sedikit asal total bulanan tidak lewat Rp 9.500.000.</li><li>Setiap tanggal 25, sisa anggaran dipindahkan ke <a href="#/tabungan">Dana Darurat</a>.</li></ul></section>';
}

// ---------- Tabungan & Tujuan ----------

export function renderSavings(state) {
  const goals = state.goals;
  const totalSaved = sumAmounts(goals.map((g) => ({ amount: g.saved })));
  const totalTarget = sumAmounts(goals.map((g) => ({ amount: g.target })));
  const totalMonthly = sumAmounts(goals.map((g) => ({ amount: g.monthly })));
  const cards = goals.map((g) => {
    const pct = Math.round((g.saved / g.target) * 100);
    const left = g.target - g.saved;
    const monthsLeft = Math.ceil(left / g.monthly);
    return '<article class="card goal-card"><h2>' + esc(g.name) + '</h2><p class="card-sub">' + esc(g.note) + '</p>'
      + '<p class="goal-nums"><strong>' + rupiah(g.saved) + '</strong> <span class="muted">dari ' + rupiah(g.target) + '</span></p>'
      + '<div class="budget-track"><div class="budget-fill" style="width:' + pct + '%"></div></div>'
      + '<p class="goal-meta">' + pct + '% tercapai · sisa ' + rupiah(left) + ' · iuran ' + rupiah(g.monthly) + '/bulan · selesai sekitar ' + monthsLeft + ' bulan lagi</p>'
      + '<form class="add-funds" data-goal="' + g.id + '"><label>Tambah dana (Rp)<input type="number" name="amount" min="1000" step="1000" required placeholder="100000"></label><button class="btn" type="submit">Tambah dana</button></form>'
      + '</article>';
  }).join('');
  return pageHead('Tabungan & Tujuan',
    'Tiga tujuan keluarga: total sudah terkumpul ' + rupiah(totalSaved) + ' dari target ' + rupiah(totalTarget) + ' (' + Math.round((totalSaved / totalTarget) * 100) + '%). Iuran bulan November 2026 total ' + rupiah(totalMonthly) + ' — sama dengan sisa pemasukan bulan ini.')
    + '<section class="stats-grid">'
    + statCard('Total terkumpul', rupiah(totalSaved), Math.round((totalSaved / totalTarget) * 100) + '% dari semua target', 'tone-blue')
    + statCard('Iuran bulan ini', rupiah(totalMonthly), 'November 2026', 'tone-green')
    + statCard('Target terdekat', 'Liburan Keluarga', 'kurang Rp 1.800.000 lagi', '')
    + '</section>'
    + '<section class="grid-2">' + cards + '</section>'
    + '<section class="card"><h2>Aturan main tabungan keluarga</h2><ul class="tips"><li>Dana Darurat tidak boleh dipakai kecuali darurat sungguhan — sakit, atau penghasilan berhenti.</li><li>Iuran dipotong di awal bulan, begitu gaji masuk, sebelum belanja apa pun.</li><li>Kalau ada sisa anggaran tanggal 25, semuanya masuk Dana Darurat.</li></ul></section>';
}

// ---------- Tagihan & Jadwal ----------

export function renderBills(state) {
  const bills = state.bills.slice().sort((a, b) => a.due - b.due);
  const paid = bills.filter((b) => b.paid);
  const unpaid = bills.filter((b) => !b.paid);
  const paidTotal = sumAmounts(paid);
  const unpaidTotal = sumAmounts(unpaid);
  const rows = bills.map((b) =>
    '<tr><td><strong>' + esc(b.name) + '</strong></td><td>tgl ' + b.due + '</td><td class="num">' + rupiah(b.amount) + '</td>'
    + '<td><span class="badge ' + (b.paid ? 'badge-under' : 'badge-over') + '">' + (b.paid ? 'Lunas' : 'Belum dibayar') + '</span></td>'
    + '<td><button class="btn-ghost" data-toggle-bill="' + b.id + '">' + (b.paid ? 'Batalkan lunas' : 'Tandai lunas') + '</button></td></tr>'
  ).join('');
  return pageHead('Tagihan & Jadwal — November 2026',
    'Tagihan berulang keluarga. ' + paid.length + ' dari ' + bills.length + ' sudah lunas (' + rupiah(paidTotal) + ') · ' + unpaid.length + ' belum (' + rupiah(unpaidTotal) + '). Geser statusnya, ringkasan di Beranda ikut berubah.')
    + '<section class="stats-grid">'
    + statCard('Sudah lunas', rupiah(paidTotal), paid.length + ' tagihan', 'tone-green')
    + statCard('Belum dibayar', rupiah(unpaidTotal), unpaid.length + ' tagihan', unpaid.length ? 'tone-pink' : 'tone-green')
    + statCard('Jatuh tempo terdekat', unpaid.length ? esc(unpaid.slice().sort((a, b) => a.due - b.due)[0].name) : '—', unpaid.length ? 'tgl ' + unpaid.slice().sort((a, b) => a.due - b.due)[0].due + ' November' : 'semua lunas', '')
    + '</section>'
    + '<section class="card"><h2>Semua tagihan bulan ini</h2><div class="table-wrap"><table class="tbl"><thead><tr><th>Tagihan</th><th>Jatuh tempo</th><th class="num">Jumlah</th><th>Status</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>'
    + '<p class="card-sub">Tagihan dibayar lewat m-banking tiap tanggal jatuh tempo; bukti bayar disimpan di map “Tagihan 2026” di rumah.</p></section>';
}

// ---------- Laporan ----------

export function renderReports(state) {
  const points = MONTHS.map((m) => {
    const actuals = actualsForMonth(m.key);
    const spending = sumAmounts(Object.values(actuals).map((amount) => ({ amount })));
    return { label: m.label.replace(' 2026', ''), income: incomeForMonth(m.key), spending, saved: incomeForMonth(m.key) - spending };
  });
  const best = points.slice().sort((a, b) => b.saved - a.saved)[0];
  const worst = points.slice().sort((a, b) => a.saved - b.saved)[0];
  const avgSaved = Math.round(points.reduce((s, p) => s + p.saved, 0) / points.length);
  const avgSpending = Math.round(points.reduce((s, p) => s + p.spending, 0) / points.length);
  const rows = points.map((p) =>
    '<tr><td><strong>' + p.label + ' 2026</strong></td><td class="num">' + rupiah(p.income) + '</td><td class="num">' + rupiah(p.spending) + '</td><td class="num"><strong>' + rupiah(p.saved) + '</strong></td></tr>'
  ).join('');
  return pageHead('Laporan — Juni sampai November 2026',
    'Enam bulan terakhir: rata-rata ditabung ' + rupiah(avgSaved) + ' per bulan dari rata-rata belanja ' + rupiah(avgSpending) + '. Bulan paling hemat ' + best.label + ' (' + rupiah(best.saved) + ' ditabung), paling boros ' + worst.label + ' (' + rupiah(worst.saved) + ' ditabung).')
    + '<section class="stats-grid">'
    + statCard('Bulan paling hemat', best.label + ' 2026', rupiah(best.saved) + ' ditabung', 'tone-green')
    + statCard('Bulan paling boros', worst.label + ' 2026', rupiah(worst.saved) + ' ditabung', 'tone-pink')
    + statCard('Rata-rata ditabung', rupiah(avgSaved), 'per bulan, 6 bulan terakhir', 'tone-blue')
    + statCard('Total ditabung 6 bln', rupiah(points.reduce((s, p) => s + p.saved, 0)), 'Juni–November 2026', '')
    + '</section>'
    + '<section class="card"><h2>Pemasukan vs pengeluaran per bulan</h2>' + groupedBarChart(points) + '</section>'
    + '<section class="card"><h2>Tren tabungan per bulan</h2><p class="card-sub">Sisa pemasukan setelah semua pengeluaran — inilah yang masuk ke tiga tujuan tabungan.</p>' + savingsLineChart(points) + '</section>'
    + '<section class="card"><h2>Tabel bulanan</h2><div class="table-wrap"><table class="tbl"><thead><tr><th>Bulan</th><th class="num">Pemasukan</th><th class="num">Pengeluaran</th><th class="num">Ditabung</th></tr></thead><tbody>' + rows + '</tbody></table></div>'
    + '<p><button class="btn" id="export-csv">Unduh laporan sebagai CSV</button> <span class="form-note">File dibuat langsung di peramban dari data di halaman ini.</span></p></section>';
}

// ---------- Kalkulator 50/30/20 ----------

export function renderCalculator(state) {
  const income = state.calcIncome;
  const need = Math.round(income * 0.5);
  const want = Math.round(income * 0.3);
  const save = income - need - want;
  const s = monthSummary(CURRENT_MONTH);
  const actualNeed = s.actuals.belanja + s.actuals.transport + s.actuals.tagihan + s.actuals.pendidikan + s.actuals.kesehatan;
  const actualWant = s.actuals.hiburan + s.actuals.lainnya;
  const actualSave = s.saved;
  const pct = (v) => Math.round((v / income) * 100) + '%';
  function compareRow(label, ideal, idealPct, actual, actualPct, color) {
    const diff = actual - ideal;
    const note = diff > 0 ? 'lebih ' + rupiah(diff) + ' dari ideal' : diff < 0 ? 'kurang ' + rupiah(-diff) + ' dari ideal' : 'pas dengan ideal';
    return '<tr><td><span class="dot" style="background:' + color + '"></span> ' + label + '</td><td class="num">' + rupiah(ideal) + ' (' + idealPct + ')</td><td class="num">' + rupiah(actual) + ' (' + actualPct + ')</td><td>' + note + '</td></tr>';
  }
  return pageHead('Kalkulator 50/30/20',
    'Aturan sederhana: 50% pemasukan untuk kebutuhan, 30% untuk keinginan, 20% untuk tabungan. Masukkan pemasukan bulananmu, lalu bandingkan dengan pembagian Keluarga Prasetyo bulan November 2026.')
    + '<section class="card"><h2>Hitung pembagianmu</h2>'
    + '<form id="calc-form" class="form-grid"><label>Pemasukan bulanan (Rp)<input name="income" type="number" min="100000" step="100000" value="' + income + '" required></label>'
    + '<button class="btn" type="submit">Hitung pembagian</button></form>'
    + '<div class="calc-result"><p class="calc-total">Dari <strong>' + rupiah(income) + '</strong> per bulan:</p>'
    + splitBar([
      { label: 'Kebutuhan 50%', value: need, color: '#0f766e' },
      { label: 'Keinginan 30%', value: want, color: '#db2777' },
      { label: 'Tabungan 20%', value: save, color: '#1d4ed8' },
    ])
    + '<div class="split-key"><span><i style="background:#0f766e"></i>Kebutuhan 50% — <strong>' + rupiah(need) + '</strong></span><span><i style="background:#db2777"></i>Keinginan 30% — <strong>' + rupiah(want) + '</strong></span><span><i style="background:#1d4ed8"></i>Tabungan 20% — <strong>' + rupiah(save) + '</strong></span></div></div></section>'
    + '<section class="card"><h2>Bandingkan dengan Keluarga Prasetyo — November 2026</h2><p class="card-sub">Pemasukan Rp 12.500.000 · kebutuhan Rp 7.900.000 (63%) · keinginan Rp 1.300.000 (10%) · ditabung Rp 3.300.000 (26%).</p>'
    + '<div class="table-wrap"><table class="tbl"><thead><tr><th>Pos</th><th class="num">Ideal 50/30/20</th><th class="num">Nyata keluarga</th><th>Selisih</th></tr></thead><tbody>'
    + compareRow('Kebutuhan', need, '50%', actualNeed, pct(actualNeed), '#0f766e')
    + compareRow('Keinginan', want, '30%', actualWant, pct(actualWant), '#db2777')
    + compareRow('Tabungan', save, '20%', actualSave, pct(actualSave), '#1d4ed8')
    + '</tbody></table></div>'
    + '<p class="card-sub">Penilaian: kebutuhan keluarga ini 13 poin di atas ideal karena SPP dua anak dan tagihan rumah, tapi keinginan jauh di bawah — jadi tabungan malah 6 poin di atas target. Pola yang sehat untuk keluarga dengan dua anak sekolah.</p></section>';
}
