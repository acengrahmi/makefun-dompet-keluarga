// router.js — Rute hash sederhana: #/ , #/pemasukan, #/pengeluaran, dst.
// Setiap rute memanggil satu fungsi render dari views.js dan menandai
// tautan aktif di navigasi.

import { renderDashboard, renderIncome, renderExpenses, renderBudget, renderSavings, renderBills, renderReports, renderCalculator } from './views.js';

const ROUTES = {
  '': renderDashboard,
  pemasukan: renderIncome,
  pengeluaran: renderExpenses,
  anggaran: renderBudget,
  tabungan: renderSavings,
  tagihan: renderBills,
  laporan: renderReports,
  kalkulator: renderCalculator,
};

export function currentRoute() {
  const hash = window.location.hash || '#/';
  const path = hash.replace(/^#\/?/, '').split('?')[0];
  return ROUTES[path] ? path : '';
}

export function renderRoute(state) {
  const route = currentRoute();
  const view = ROUTES[route];
  const app = document.getElementById('app');
  app.innerHTML = view(state);
  document.querySelectorAll('.mainnav a').forEach((a) => {
    a.classList.toggle('active', a.dataset.route === route);
  });
  window.scrollTo(0, 0);
  return route;
}

export function goTo(route) {
  window.location.hash = '#/' + route;
}
