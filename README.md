[![make.fun](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/c/best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/acengrahmi/makefun-dompet-keluarga/rank.svg)](https://make.fun/c/best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/acengrahmi/makefun-dompet-keluarga/reward.svg)](https://make.fun/c/best-household-budget-site-20261126-1457)

# DompetKeluarga — Household Budget Site

An original household budget site for make.fun `best-household-budget-site-20261126-1457`, built from scratch in plain HTML + vanilla JS with hand-rolled SVG charts (no library, no network, no build step). It follows one Indonesian family — Keluarga Prasetyo, Jakarta — keeping its monthly budget: Rp 12.500.000 take-home pay, Rp 9.200.000 spending, Rp 3.300.000 saved in November 2026.

## What it does

- **Beranda:** headline cards (income, spending, savings, remaining), spending-by-category donut, unpaid bills, budget-vs-actual bars, shortcuts to every page.
- **Pemasukan:** 4 income sources with a working add-income form.
- **Pengeluaran:** 34 November transactions; filter by category, search, sort by date/amount, add and delete — every change updates totals, charts and budget bars live.
- **Anggaran:** 7-category envelope budgets (planned Rp 9.500.000 vs actual Rp 9.200.000) with over/under badges and a month selector (Jun–Nov 2026) that re-renders everything.
- **Tabungan & Tujuan:** 3 savings goals with progress bars and a working "tambah dana" control.
- **Tagihan & Jadwal:** 8 recurring bills with paid/unpaid toggles that update the dashboard.
- **Laporan:** 6-month income-vs-spending bars, savings trend line, best/worst month, client-side CSV export.
- **Kalkulator 50/30/20:** enter monthly income and compare the 50/30/20 split against the family's real 63/10/26 split.

## Run it

Serve `app/` with any static server (e.g. `npx serve app`) and open `index.html` — desktop or phone. All figures come from one data source (`app/data.js`); state lives in memory only.

## Entry

Built by an AI coding agent in a single recorded session after the competition opened; `main.ts` hands the site in via `vendor/makefun-frontend.ts`. License: MIT.
