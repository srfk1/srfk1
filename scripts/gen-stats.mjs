// Language card from `gh api`. Aggregate only: no repo names ever leave memory.
// Run: node scripts/gen-stats.mjs [login]   (needs `gh auth login`)
import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { PAL, ACCENT, MONO, SANS, W, esc, frame } from './palette.mjs';

const LOGIN = process.argv[2] || 'srfk1';
const OUT = new URL('../assets/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });
const gh = (...a) => execFileSync('gh', ['api', ...a], { encoding: 'utf8', maxBuffer: 64 << 20 });

const repos = gh('user/repos?affiliation=owner&per_page=100', '--paginate',
  '--jq', '.[] | select(.fork == false) | select(.owner.login == "' + LOGIN + '") | .full_name')
  .split('\n').filter(Boolean);

const bytes = {};
for (const r of repos) {
  const langs = JSON.parse(gh(`repos/${r}/languages`));
  for (const [k, v] of Object.entries(langs)) bytes[k] = (bytes[k] || 0) + v;
}
const total = Object.values(bytes).reduce((a, b) => a + b, 0) || 1;
const all = Object.entries(bytes).sort((a, b) => b[1] - a[1]);
const top = all.slice(0, 6).map(([n, v]) => ({ n, pct: v / total * 100 }));
const COLORS = [ACCENT.coral, ACCENT.teal, '#e8b04a', '#6e9ef5', '#b48ef0', '#9aa4b2'];

function card(p) {
  const H = 190, X = 32, BW = W - 64;
  const css = `
.n{font:14px ${SANS};fill:${p.text}}
.m{font:13px ${MONO};fill:${p.muted}}
.l{font:600 11px ${MONO};fill:${p.muted};letter-spacing:2px}
.bar{transform-box:fill-box;transform-origin:left center;animation:grow 1.2s cubic-bezier(.2,.7,.2,1) both}
@keyframes grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}`;
  let segs = '', x = X;
  top.forEach((t, i) => { const w = BW * t.pct / 100; segs += `<rect x="${x.toFixed(2)}" y="52" width="${w.toFixed(2)}" height="14" fill="${COLORS[i]}"/>`; x += w; });
  let legend = '';
  top.forEach((t, i) => {
    const cx = X + (i % 3) * 260, cy = 104 + Math.floor(i / 3) * 28;
    legend += `<circle cx="${cx + 5}" cy="${cy - 4}" r="5" fill="${COLORS[i]}"/><text class="n" x="${cx + 18}" y="${cy}">${esc(t.n)}</text><text class="m" x="${cx + 168}" y="${cy}">${t.pct.toFixed(1)}%</text>`;
  });
  const body = `<defs><clipPath id="bc"><rect x="${X}" y="52" width="${BW}" height="14" rx="7"/></clipPath></defs>
<text class="l" x="${X}" y="36">LANGUAGES</text>
<rect x="${X}" y="52" width="${BW}" height="14" rx="7" fill="${p.track}"/>
<g clip-path="url(#bc)"><g class="bar">${segs}</g></g>
${legend}
<text class="m" x="${X}" y="170">${repos.length} repositories · ${all.length} languages</text>`;
  return frame(H, p, p.panel, `Languages: ${top.map(t => t.n).join(', ')}`, css, body);
}

for (const mode of ['dark', 'light']) writeFileSync(`${OUT}langs-${mode}.svg`, card(PAL[mode]));
console.log(`${repos.length} repositories, ${all.length} languages`);
console.log(top.map(t => `${t.n} ${t.pct.toFixed(1)}%`).join(' | '));
