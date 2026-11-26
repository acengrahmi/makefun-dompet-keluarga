// data.js — Data contoh Keluarga Prasetyo, Jakarta.
// Semua angka dalam rupiah dan konsisten antar halaman: pemasukan, pengeluaran,
// anggaran, tabungan, dan tagihan bulan November 2026 dijumlahkan dari data yang
// sama di sini. Bulan Juni–Oktober 2026 tersimpan sebagai ringkasan kategori.

export const HOUSEHOLD = {
  name: 'Keluarga Prasetyo',
  city: 'Jakarta',
  members: '2 dewasa + 2 anak (Andi, 10 thn · Rani, 7 thn)',
  takeHome: 12500000,
};

export const CATEGORIES = [
  { id: 'belanja',    label: 'Belanja Harian',  color: '#0f766e', short: 'Belanja' },
  { id: 'transport',  label: 'Transportasi',    color: '#b45309', short: 'Transport' },
  { id: 'tagihan',    label: 'Tagihan',         color: '#1d4ed8', short: 'Tagihan' },
  { id: 'pendidikan', label: 'Pendidikan',      color: '#7c3aed', short: 'Pendidikan' },
  { id: 'hiburan',    label: 'Hiburan',         color: '#db2777', short: 'Hiburan' },
  { id: 'kesehatan',  label: 'Kesehatan',      color: '#059669', short: 'Kesehatan' },
  { id: 'lainnya',    label: 'Lainnya',         color: '#64748b', short: 'Lainnya' },
];

export const MONTHS = [
  { key: '2026-06', label: 'Juni 2026' },
  { key: '2026-07', label: 'Juli 2026' },
  { key: '2026-08', label: 'Agustus 2026' },
  { key: '2026-09', label: 'September 2026' },
  { key: '2026-10', label: 'Oktober 2026' },
  { key: '2026-11', label: 'November 2026' },
];

export const CURRENT_MONTH = '2026-11';

// Anggaran yang direncanakan per kategori (sama setiap bulan).
export const PLANNED = {
  belanja: 3000000,
  transport: 1200000,
  tagihan: 2000000,
  pendidikan: 1500000,
  hiburan: 800000,
  kesehatan: 600000,
  lainnya: 400000,
};

// Realisasi per kategori untuk bulan Juni–Oktober 2026 (ringkasan).
export const MONTHLY_ACTUALS = {
  '2026-06': { belanja: 3100000, transport: 1300000, tagihan: 2050000, pendidikan: 1500000, hiburan: 1100000, kesehatan: 650000, lainnya: 500000 },
  '2026-07': { belanja: 2950000, transport: 1200000, tagihan: 2000000, pendidikan: 1500000, hiburan: 900000, kesehatan: 550000, lainnya: 400000 },
  '2026-08': { belanja: 2800000, transport: 1100000, tagihan: 1980000, pendidikan: 1500000, hiburan: 800000, kesehatan: 400000, lainnya: 350000 },
  '2026-09': { belanja: 3200000, transport: 1250000, tagihan: 2100000, pendidikan: 1600000, hiburan: 1000000, kesehatan: 700000, lainnya: 450000 },
  '2026-10': { belanja: 2900000, transport: 1150000, tagihan: 1990000, pendidikan: 1500000, hiburan: 850000, kesehatan: 450000, lainnya: 300000 },
};

// Pemasukan per bulan (gaji + penghasilan sampingan).
export const MONTHLY_INCOME = {
  '2026-06': 12000000,
  '2026-07': 12500000,
  '2026-08': 12500000,
  '2026-09': 13000000,
  '2026-10': 12500000,
  '2026-11': 12500000,
};

// Pemasukan bulan November 2026 — total Rp 12.500.000.
export const INCOME_NOV = [
  { id: 'inc-1', date: '2026-11-05', source: 'Gaji Budi Prasetyo', detail: 'Gaji pokok, PT Maju Bersama', amount: 9500000 },
  { id: 'inc-2', date: '2026-11-05', source: 'Tunjangan transport', detail: 'Tunjangan bulanan kantor', amount: 1000000 },
  { id: 'inc-3', date: '2026-11-12', source: 'Gaji Sari Prasetyo', detail: 'Desain lepas, 2 proyek', amount: 1500000 },
  { id: 'inc-4', date: '2026-11-20', source: 'Jualan online', detail: 'Kue kering & camilan', amount: 500000 },
];

// Pengeluaran bulan November 2026 — total Rp 9.200.000.
// Belanja Harian 2.850.000 · Transportasi 1.150.000 · Tagihan 1.980.000 ·
// Pendidikan 1.500.000 · Hiburan 950.000 · Kesehatan 420.000 · Lainnya 350.000.
export const EXPENSES_NOV = [
  { id: 'exp-01', date: '2026-11-01', category: 'belanja', note: 'Pasar tradisional, sayur & lauk', amount: 350000 },
  { id: 'exp-02', date: '2026-11-02', category: 'transport', note: 'Bensin motor', amount: 150000 },
  { id: 'exp-03', date: '2026-11-03', category: 'belanja', note: 'Supermarket, kebutuhan dapur', amount: 425000 },
  { id: 'exp-04', date: '2026-11-03', category: 'pendidikan', note: 'SPP Andi, bulan November', amount: 750000 },
  { id: 'exp-05', date: '2026-11-04', category: 'tagihan', note: 'Listrik PLN', amount: 580000 },
  { id: 'exp-06', date: '2026-11-05', category: 'transport', note: 'Tol & parkir', amount: 120000 },
  { id: 'exp-07', date: '2026-11-05', category: 'pendidikan', note: 'SPP Rani, bulan November', amount: 500000 },
  { id: 'exp-08', date: '2026-11-06', category: 'belanja', note: 'Sayur & buah', amount: 180000 },
  { id: 'exp-09', date: '2026-11-06', category: 'tagihan', note: 'Internet & TV kabel', amount: 350000 },
  { id: 'exp-10', date: '2026-11-07', category: 'hiburan', note: 'Nonton bioskop berempat', amount: 250000 },
  { id: 'exp-11', date: '2026-11-08', category: 'belanja', note: 'Supermarket, stok mingguan', amount: 520000 },
  { id: 'exp-12', date: '2026-11-08', category: 'kesehatan', note: 'Obat & vitamin', amount: 120000 },
  { id: 'exp-13', date: '2026-11-09', category: 'transport', note: 'Bensin motor', amount: 150000 },
  { id: 'exp-14', date: '2026-11-10', category: 'tagihan', note: 'Air PDAM', amount: 180000 },
  { id: 'exp-15', date: '2026-11-10', category: 'pendidikan', note: 'Buku & alat tulis', amount: 150000 },
  { id: 'exp-16', date: '2026-11-11', category: 'lainnya', note: 'Hadiah ulang tahun tetangga', amount: 200000 },
  { id: 'exp-17', date: '2026-11-12', category: 'belanja', note: 'Pasar, ikan & ayam', amount: 300000 },
  { id: 'exp-18', date: '2026-11-12', category: 'tagihan', note: 'Iuran RT & keamanan', amount: 150000 },
  { id: 'exp-19', date: '2026-11-13', category: 'transport', note: 'Ojek online, antar anak les', amount: 180000 },
  { id: 'exp-20', date: '2026-11-14', category: 'hiburan', note: 'Makan di luar, akhir pekan', amount: 400000 },
  { id: 'exp-21', date: '2026-11-15', category: 'belanja', note: 'Supermarket, kebutuhan dapur', amount: 450000 },
  { id: 'exp-22', date: '2026-11-15', category: 'tagihan', note: 'BPJS Kesehatan keluarga', amount: 420000 },
  { id: 'exp-23', date: '2026-11-16', category: 'transport', note: 'Bensin motor', amount: 150000 },
  { id: 'exp-24', date: '2026-11-16', category: 'kesehatan', note: 'Periksa gigi Rani', amount: 300000 },
  { id: 'exp-25', date: '2026-11-17', category: 'pendidikan', note: 'Les renang Andi', amount: 100000 },
  { id: 'exp-26', date: '2026-11-18', category: 'tagihan', note: 'Pulsa & paket data', amount: 200000 },
  { id: 'exp-27', date: '2026-11-19', category: 'belanja', note: 'Warung & kebutuhan dapur', amount: 175000 },
  { id: 'exp-28', date: '2026-11-19', category: 'lainnya', note: 'Perawatan rumah, ganti lampu', amount: 150000 },
  { id: 'exp-29', date: '2026-11-20', category: 'transport', note: 'Servis motor bulanan', amount: 250000 },
  { id: 'exp-30', date: '2026-11-21', category: 'hiburan', note: 'Langganan streaming film', amount: 150000 },
  { id: 'exp-31', date: '2026-11-21', category: 'tagihan', note: 'Langganan aplikasi belajar', amount: 100000 },
  { id: 'exp-32', date: '2026-11-22', category: 'belanja', note: 'Supermarket, stok mingguan', amount: 450000 },
  { id: 'exp-33', date: '2026-11-23', category: 'hiburan', note: 'Mainan anak', amount: 150000 },
  { id: 'exp-34', date: '2026-11-24', category: 'transport', note: 'Tol & parkir', amount: 150000 },
];

// Tujuan tabungan — iuran bulan November 2026 total Rp 3.300.000,
// tepat sama dengan sisa pemasukan setelah pengeluaran (Rp 12.500.000 − 9.200.000).
export const SAVINGS_GOALS = [
  { id: 'goal-darurat', name: 'Dana Darurat', target: 10000000, saved: 6500000, monthly: 1000000, note: 'Target 4 bulan biaya hidup, disimpan di rekening terpisah.' },
  { id: 'goal-liburan', name: 'Liburan Keluarga', target: 5000000, saved: 3200000, monthly: 800000, note: 'Liburan ke Yogyakarta, Lebaran tahun depan.' },
  { id: 'goal-rumah', name: 'DP Rumah', target: 50000000, saved: 12000000, monthly: 1500000, note: 'Uang muka rumah pertama, target tercapai 2028.' },
];

// Tagihan berulang bulan November 2026. "paid" bisa diubah dari halaman Tagihan
// dan langsung mengubah ringkasan di Beranda.
export const BILLS = [
  { id: 'bill-spp-andi', name: 'SPP Andi', amount: 750000, due: 3, paid: true },
  { id: 'bill-spp-rani', name: 'SPP Rani', amount: 500000, due: 3, paid: true },
  { id: 'bill-listrik', name: 'Listrik PLN', amount: 580000, due: 5, paid: true },
  { id: 'bill-internet', name: 'Internet & TV kabel', amount: 350000, due: 10, paid: true },
  { id: 'bill-air', name: 'Air PDAM', amount: 180000, due: 12, paid: true },
  { id: 'bill-rt', name: 'Iuran RT & keamanan', amount: 150000, due: 20, paid: false },
  { id: 'bill-bpjs', name: 'BPJS Kesehatan', amount: 420000, due: 15, paid: true },
  { id: 'bill-pulsa', name: 'Pulsa & paket data', amount: 200000, due: 25, paid: false },
];

// ---- Pembantu kecil ----

export function rupiah(n) {
  return 'Rp ' + Math.round(n).toLocaleString('id-ID');
}

export function rupiahShort(n) {
  if (n >= 1000000) return 'Rp ' + (n / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + ' jt';
  if (n >= 1000) return 'Rp ' + Math.round(n / 1000) + ' rb';
  return rupiah(n);
}

export function monthLabel(key) {
  const found = MONTHS.find((m) => m.key === key);
  return found ? found.label : key;
}

export function categoryById(id) {
  return CATEGORIES.find((c) => c.id === id) || { id, label: id, color: '#64748b', short: id };
}

export function sumAmounts(rows) {
  return rows.reduce((total, row) => total + row.amount, 0);
}

export function actualsForMonth(key) {
  if (key === CURRENT_MONTH) {
    const out = {};
    for (const cat of CATEGORIES) out[cat.id] = 0;
    for (const exp of EXPENSES_NOV) out[exp.category] += exp.amount;
    return out;
  }
  return { ...MONTHLY_ACTUALS[key] };
}

export function incomeForMonth(key) {
  if (key === CURRENT_MONTH) return sumAmounts(INCOME_NOV);
  return MONTHLY_INCOME[key] || 0;
}

export function spendingForMonth(key) {
  return sumAmounts(Object.values(actualsForMonth(key)).map((amount) => ({ amount })));
}

export function plannedTotal() {
  return sumAmounts(Object.values(PLANNED).map((amount) => ({ amount })));
}
