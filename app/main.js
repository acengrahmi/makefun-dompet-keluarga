// main.js — Titik masuk situs. State hanya di memori (tidak ada localStorage,
// cookie, atau service worker): tutup tab dan semua catatan tambahan hilang,
// data contoh kembali seperti semula.

import { INCOME_NOV, EXPENSES_NOV, SAVINGS_GOALS, BILLS, MONTHS, CURRENT_MONTH } from './data.js';
import * as dataModule from './data.js';
import { renderRoute, currentRoute } from './router.js';

const state = {
  month: CURRENT_MONTH,
  income: INCOME_NOV.map((r) => ({ ...r })),
  expenses: EXPENSES_NOV.map((r) => ({ ...r })),
  goals: SAVINGS_GOALS.map((g) => ({ ...g })),
  bills: BILLS.map((b) => ({ ...b })),
  expenseFilter: { category: 'semua', query: '', sort: 'date-desc' },
  calcIncome: 12500000,
};

function refresh() {
  renderRoute(state);
}

function buildMonthSelect() {
  const select = document.getElementById('month-select');
  select.innerHTML = MONTHS.map((m) => '<option value="' + m.key + '">' + m.label + '</option>').join('');
  select.value = state.month;
  select.addEventListener('change', () => {
    state.month = select.value;
    refresh();
  });
}

function bindGlobalEvents() {
  document.addEventListener('submit', (event) => {
    const form = event.target;
    event.preventDefault();
    if (form.id === 'income-form') {
      const data = new FormData(form);
      state.income.push({
        id: 'inc-' + Date.now(),
        date: String(data.get('date')),
        source: String(data.get('source')).trim(),
        detail: String(data.get('detail')).trim() || 'Pemasukan tambahan',
        amount: Math.max(0, Number(data.get('amount')) || 0),
      });
      refresh();
    }
    if (form.id === 'expense-form') {
      const data = new FormData(form);
      state.expenses.push({
        id: 'exp-' + Date.now(),
        date: String(data.get('date')),
        category: String(data.get('category')),
        note: String(data.get('note')).trim(),
        amount: Math.max(0, Number(data.get('amount')) || 0),
      });
      refresh();
    }
    if (form.id === 'calc-form') {
      const data = new FormData(form);
      const income = Math.max(100000, Number(data.get('income')) || 12500000);
      state.calcIncome = income;
      refresh();
    }
    if (form.classList.contains('add-funds')) {
      const data = new FormData(form);
      const amount = Math.max(0, Number(data.get('amount')) || 0);
      const goal = state.goals.find((g) => g.id === form.dataset.goal);
      if (goal && amount > 0) goal.saved += amount;
      refresh();
    }
  });

  document.addEventListener('click', (event) => {
    const delIncome = event.target.closest('[data-delete-income]');
    if (delIncome) {
      state.income = state.income.filter((r) => r.id !== delIncome.dataset.deleteIncome);
      refresh();
      return;
    }
    const delExpense = event.target.closest('[data-delete-expense]');
    if (delExpense) {
      state.expenses = state.expenses.filter((r) => r.id !== delExpense.dataset.deleteExpense);
      refresh();
      return;
    }
    const toggleBill = event.target.closest('[data-toggle-bill]');
    if (toggleBill) {
      const bill = state.bills.find((b) => b.id === toggleBill.dataset.toggleBill);
      if (bill) bill.paid = !bill.paid;
      refresh();
      return;
    }
    if (event.target.id === 'export-csv') {
      downloadCsv();
    }
  });

  document.addEventListener('change', (event) => {
    const target = event.target;
    if (target.id === 'filter-category') {
      state.expenseFilter.category = target.value;
      refresh();
    }
    if (target.id === 'filter-sort') {
      state.expenseFilter.sort = target.value;
      refresh();
    }
    if (target.id === 'budget-month') {
      state.month = target.value;
      const select = document.getElementById('month-select');
      if (select) select.value = state.month;
      refresh();
    }
  });

  document.addEventListener('input', (event) => {
    if (event.target.id === 'filter-query') {
      state.expenseFilter.query = event.target.value;
      const route = currentRoute();
      if (route === 'pengeluaran') {
        // Render ulang tanpa kehilangan fokus pada kolom pencarian.
        const value = event.target.value;
        const start = event.target.selectionStart;
        refresh();
        const again = document.getElementById('filter-query');
        if (again) {
          again.focus();
          again.setSelectionRange(start, start);
          void value;
        }
      }
    }
  });

  window.addEventListener('hashchange', refresh);
}

// Unduh laporan 6 bulan sebagai CSV, dibuat di peramban dari data yang sama
// dengan grafik di halaman Laporan.
function downloadCsv() {
  const { MONTHS, incomeForMonth, actualsForMonth, CATEGORIES, monthLabel } = window.__dkData;
  const lines = ['Bulan,Pemasukan,Pengeluaran,Ditabung'];
  for (const m of MONTHS) {
    const actuals = actualsForMonth(m.key);
    const spending = Object.values(actuals).reduce((s, v) => s + v, 0);
    const income = incomeForMonth(m.key);
    lines.push([monthLabel(m.key), income, spending, income - spending].join(','));
  }
  lines.push('');
  lines.push('Kategori November 2026,Anggaran,Rencana,Realisasi');
  const { PLANNED } = window.__dkData;
  const novActuals = actualsForMonth('2026-11');
  for (const c of CATEGORIES) {
    lines.push(['"' + c.label + '"', PLANNED[c.id], novActuals[c.id]].join(','));
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'laporan-dompet-keluarga-jun-nov-2026.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Data dibagikan ke pengekspor CSV lewat satu objek global kecil.
window.__dkData = dataModule;

buildMonthSelect();
bindGlobalEvents();
refresh();
