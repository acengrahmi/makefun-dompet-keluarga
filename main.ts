// DompetKeluarga — entri best-household-budget-site-20261126-1457 (Node 22, pustaka standar saja).
// Situsnya adalah berkas statis di app/ (index.html + modul ES + CSS, tanpa langkah
// build): dibuka di peramban desktop maupun telepon dan bekerja tanpa satu pun
// permintaan jaringan. Program ini menyerahkan situs itu: menyalin app/ dan
// screenshots/ dari samping berkas ini ke /output lalu menulis /output/dossier.json,
// ringkasan yang dibaca juri (tangkapan layar, berkas & byte muatan pertama, dan
// sumber situs), dengan pustaka make.fun yang disalin dari kit tanpa diubah.
// Di luar kontainer penilai, MAKEFUN_OUTPUT_DIR menggantikan /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// Batas penilai sendiri (reference/gate.json): hanya text_max_bytes yang membentuk
// byte dossier; batas lain menolak entri yang penilai pun akan tolak (lebih dari
// 4 tangkapan layar atau satu di atas 256 KiB; lebih dari 993 berkas & direktori
// di app/ atau 16 MiB berkas app/: app/ dihitung berdampingan dengan batas 1000
// entri /output itu sendiri, bersama screenshots/ dan dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);
