// Generates banner, terminal, rpg and zen SVGs (dark + light) from one palette.
// Run: node scripts/build-svgs.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { PAL, ACCENT, MONO, SANS, SERIF, W, esc, frame } from './palette.mjs';

const OUT = new URL('../assets/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });
const { coral, teal } = ACCENT;

/* ---------- 1. banner ---------- */
function banner(p) {
  const H = 290;
  const css = `
.d{stroke-dasharray:1 1;stroke-dashoffset:0;fill:none;stroke-linecap:round;stroke-linejoin:round;animation:draw 1s cubic-bezier(.5,0,.3,1) both}
@keyframes draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
.tag{font:400 21px ${SANS};fill:${p.muted};letter-spacing:.5px;animation:fade .7s ease-out 2.3s both}
@keyframes fade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}`;
  const body = `
<path class="d" pathLength="1" stroke="${coral}" stroke-width="10" style="animation-duration:1.1s;animation-delay:.1s"
 d="M410 102C396 84 348 82 346 112C344 140 410 134 411 160C412 190 360 192 343 170"/>
<path class="d" pathLength="1" stroke="${teal}" stroke-width="10" style="animation-duration:.8s;animation-delay:1.1s"
 d="M470 50C468 98 465 138 472 164C476 177 490 179 501 169"/>
<path class="d" pathLength="1" stroke="${teal}" stroke-width="10" style="animation-duration:.4s;animation-delay:1.8s"
 d="M444 96C464 92 486 94 504 90"/>
<path class="d" pathLength="1" stroke="${p.muted}" stroke-width="3" style="animation-duration:.5s;animation-delay:1.9s"
 d="M330 204C362 196 382 212 420 203S482 197 512 205"/>
<text class="tag" x="420" y="250" text-anchor="middle">data &amp; analytics engineer · builds the tools too</text>`;
  return frame(H, p, p.bg, 'st — data and analytics engineer, builds the tools too', css, body);
}

/* ---------- 2. terminal ---------- */
function terminal(p) {
  const CW = 8.4;
  const rows = [
    ['cmd', 'whoami'],
    ['out', 'st — data & analytics engineer. finance data by day, full-stack tools by night'],
    ['cmd', 'cat stack.txt'],
    ['out', 'SQL · Spark · Python · TypeScript · React · Postgres · Power BI'],
    ['cmd', 'ls ~/work'],
    ['out', 'st-km/  homie/  opex-forge/  control-room/  packaging-sim/'],
    ['cmd', 'echo $MOTTO'],
    ['out', "relax, you're doing fine"],
  ];
  const css = `
text{font:14px ${MONO};fill:${p.text};white-space:pre}
.ti{font:13px ${MONO};fill:${p.muted}}
.cv{transform:translateX(var(--w));animation:type var(--d) steps(var(--n),end) var(--t) both}
@keyframes type{from{transform:translateX(0)}to{transform:translateX(var(--w))}}
.cur{animation:appear .01s linear var(--t) both}
.blink{animation:blink 1.1s steps(1) infinite}
@keyframes appear{from{opacity:0}to{opacity:1}}
@keyframes blink{0%,50%{opacity:1}50.01%,100%{opacity:0}}`;
  let y = 80, t = 0.5, out = '';
  const covers = [];
  rows.forEach(([kind, s], i) => {
    const n = [...s].length + (kind === 'cmd' ? 2 : 0);
    const per = kind === 'cmd' ? 0.06 : 0.014;
    const d = +(n * per).toFixed(2);
    if (kind === 'cmd') out += `<text xml:space="preserve" x="24" y="${y}"><tspan fill="${coral}">$</tspan> ${esc(s)}</text>\n`;
    else out += `<text xml:space="preserve" x="24" y="${y}">${esc(s)}</text>\n`;
    covers.push(`<rect class="cv" x="24" y="${y - 17}" width="800" height="24" fill="${p.panel}" style="--w:${Math.ceil(n * CW + 8)}px;--n:${n};--d:${d}s;--t:${t.toFixed(2)}s"/>`);
    t += d + (kind === 'cmd' ? 0.25 : 0.35);
    y += kind === 'cmd' ? 26 : 34;
  });
  const cy = y; // last prompt line
  const body = `
<line x1="0" y1="44" x2="${W}" y2="44" stroke="${p.border}"/>
<circle cx="26" cy="22" r="6" fill="#ff5f56"/><circle cx="46" cy="22" r="6" fill="#ffbd2e"/><circle cx="66" cy="22" r="6" fill="#27c93f"/>
<text class="ti" x="420" y="27" text-anchor="middle">st@github: ~</text>
${out}${covers.join('\n')}
<g class="cur" style="--t:${t.toFixed(2)}s"><text x="24" y="${cy}" fill="${coral}" style="fill:${coral}">$</text>
<rect class="blink" x="42" y="${cy - 14}" width="8" height="18" fill="${coral}"/></g>`;
  return frame(cy + 30, p, p.panel, 'terminal: whoami, stack, work, motto', css, body);
}

/* ---------- 2b. work card (main quests) ---------- */
function work(p) {
  const tiles = [
    ['st-km', 'Finance data knowledge base: month-end P&L close, multi-step cost allocation cascades, GL reconciliation to zero diff, 20+ agent runbooks', ['Spark SQL', 'Data modeling', 'Reconciliation', 'Data QA'], '220 commits'],
    ['homie', 'Live PWA for a two-person home: shopping, fridge, recipes, chores with EXP, shared finance', ['React + TS', 'Supabase / Postgres', 'RPC-only writes', 'CI on Vercel'], '362 commits'],
    ['opex-forge', 'OpEx data engineering handbook: allocation, reconciliation and validation patterns on a mock plant dataset', ['Python', 'SQL patterns', '3D plant view'], '78 commits'],
    ['control-room', 'Multi-agent control dashboard: task board, handoffs, golden test harness with an 18-check phone run', ['JS', 'Agent orchestration', 'Test harness'], 'golden 18/18'],
    ['packaging-sim', '3D packaging simulator with automated geometry checks (IoU ≥ 0.97) and Playwright e2e', ['Three.js', 'TypeScript', 'Playwright'], '72 commits'],
  ];
  const PX = 32, GAP = 16, NW = (W - 64 - GAP) / 2, TOP = 58, PAD = 18;
  const wrap = (s, max) => { const out = []; let cur = ''; for (const w of s.split(' ')) { if ((cur + ' ' + w).trim().length > max) { out.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); } out.push(cur); return out; };
  const css = `
.nm{font:700 16px ${SANS};fill:${coral}}
.ds{font:13px ${SANS};fill:${p.text}}
.st{font:12px ${MONO};fill:${p.muted}}
.tg{font:11px ${SANS};fill:${p.muted}}
.l{font:600 11px ${MONO};fill:${p.muted};letter-spacing:2px}
.t{animation:slide .55s ease-out both}
@keyframes slide{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`;
  let body = `<text class="l" x="${PX}" y="36">MAIN QUESTS</text>\n`;
  let y = TOP, rowH = 0, idx = 0;
  tiles.forEach(([name, desc, tags, stat], i) => {
    const wide = i === tiles.length - 1 && i % 2 === 0;
    const tw = wide ? W - 64 : NW;
    const x = PX + (wide ? 0 : (i % 2) * (NW + GAP));
    const lines = wrap(desc, Math.floor((tw - 2 * PAD) / 6.6));
    const py = 40 + lines.length * 18 + 4;
    const lay = []; let cx = PAD, cr = 0;
    tags.forEach((t) => { const w = Math.ceil(t.length * 5.9 + 12); if (cx + w > tw - PAD) { cx = PAD; cr++; } lay.push([t, cx, cr, w]); cx += w + 6; });
    const h = py + (cr + 1) * 28 - 6 + 16;
    let g = `<g class="t" style="animation-delay:${(0.2 + idx * 0.15).toFixed(2)}s"><rect x="${x}" y="${y}" width="${tw}" height="${h}" rx="10" fill="${p.bg}" stroke="${p.border}"/>
<text class="nm" x="${x + PAD}" y="${y + 28}">${esc(name)}</text><text class="st" x="${x + tw - PAD}" y="${y + 28}" text-anchor="end">${esc(stat)}</text>\n`;
    lines.forEach((l, k) => { g += `<text class="ds" x="${x + PAD}" y="${y + 52 + k * 18}">${esc(l)}</text>\n`; });
    lay.forEach(([t, lx, lr, w]) => {
      g += `<rect x="${x + lx}" y="${y + py + lr * 28}" width="${w}" height="22" rx="11" fill="${p.panel}" stroke="${p.border}"/><text class="tg" x="${x + lx + w / 2}" y="${y + py + lr * 28 + 15}" text-anchor="middle">${esc(t)}</text>\n`;
    });
    body += g + '</g>\n';
    rowH = Math.max(rowH, h); idx++;
    if (i % 2 === 1 || wide) { y += rowH + GAP; rowH = 0; }
  });
  return frame(y - GAP + 28, p, p.panel, 'Main quests: st-km, homie, opex-forge, control-room, packaging-sim', css, body);
}

/* ---------- 3. RPG character sheet ---------- */
function rpg(p) {
  const stats = [['SQL / Spark', 95], ['Reconciliation & QA', 90], ['Data modeling', 85], ['Python', 80], ['TypeScript / React', 75], ['Postgres / Supabase', 70], ['Chill', 100]];
  const chips = ['Spark SQL', 'Delta', 'Power BI', 'Supabase', 'Vercel', 'Playwright', 'Three.js', 'ffmpeg', 'Claude / Codex agents'];
  const badges = ['Reconciles to zero', 'Shipped a live PWA', '20+ agent runbooks', 'Still relaxed'];
  const H = 526, TW = 200, X0 = 190, RX = 470;
  const css = `
.h{font:700 24px ${SANS};fill:${p.text}}
.s{font:14px ${SANS};fill:${p.text}}
.l{font:600 11px ${MONO};fill:${p.muted};letter-spacing:2px}
.v{font:13px ${MONO};fill:${p.muted}}
.bar{transform-box:fill-box;transform-origin:left center;animation:grow 1.2s cubic-bezier(.2,.7,.2,1) both}
@keyframes grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.q{animation:slide .5s ease-out both}
@keyframes slide{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}
.b{transform-box:fill-box;transform-origin:center;animation:pop .45s cubic-bezier(.3,1.5,.5,1) both}
@keyframes pop{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:none}}`;
  let b = `
<text class="h" x="32" y="48">st<tspan fill="${coral}"> · Lv. 2026</tspan></text>
<text class="s" x="32" y="74" style="fill:${p.muted}">Class  <tspan style="fill:${teal}" font-weight="600">Data &amp; Analytics Engineer</tspan></text>
<line x1="32" y1="94" x2="${W - 32}" y2="94" stroke="${p.border}"/>
<text class="l" x="32" y="124">STATS</text><text class="l" x="${RX}" y="124">TOOLBELT</text>
<line x1="446" y1="112" x2="446" y2="388" stroke="${p.border}"/>`;
  stats.forEach(([n, v], i) => {
    const y = 156 + 36 * i, chill = n === 'Chill';
    b += `<text class="s" x="32" y="${y + 5}">${esc(n)}</text>
<rect x="${X0}" y="${y - 5}" width="${TW}" height="10" rx="5" fill="${p.track}"/>
<rect class="bar" x="${X0}" y="${y - 5}" width="${TW * v / 100}" height="10" rx="5" fill="${chill ? 'url(#chill)' : coral}" style="animation-delay:${(0.3 + i * 0.12).toFixed(2)}s"/>
<text class="v" x="${X0 + TW + 12}" y="${y + 4}">${v}</text>\n`;
  });
  const CWD = 163;
  chips.forEach((n, i) => {
    const last = i === chips.length - 1, r = last ? 4 : Math.floor(i / 2), c = last ? 0 : i % 2;
    const x = RX + c * (CWD + 12), w = last ? 2 * CWD + 12 : CWD, y = 142 + 46 * r;
    b += `<g class="q" style="animation-delay:${(0.5 + i * 0.1).toFixed(2)}s"><rect x="${x}" y="${y}" width="${w}" height="32" rx="8" fill="${p.bg}" stroke="${p.border}"/>
<circle cx="${x + 16}" cy="${y + 16}" r="4" fill="${teal}"/><text class="s" x="${x + 30}" y="${y + 21}" style="font-size:13px">${esc(n)}</text></g>\n`;
  });
  b += `<line x1="32" y1="424" x2="${W - 32}" y2="424" stroke="${p.border}"/>
<text class="l" x="32" y="454">ACHIEVEMENTS</text>\n`;
  let x = 32;
  badges.forEach((n, i) => {
    const w = Math.ceil(28 + n.length * 7 + 16);
    b += `<g class="b" style="animation-delay:${(1.2 + i * 0.15).toFixed(2)}s"><rect x="${x}" y="468" width="${w}" height="32" rx="16" fill="${p.bg}" stroke="${p.border}"/>
<circle cx="${x + 17}" cy="484" r="4" fill="${coral}"/><text class="s" x="${x + 29}" y="489" style="font-size:13px">${esc(n)}</text></g>\n`;
    x += w + 12;
  });
  b = `<defs><linearGradient id="chill" x1="0" x2="1"><stop offset="0" stop-color="${teal}"/><stop offset="1" stop-color="#7fe0d2"/></linearGradient></defs>` + b;
  return frame(H, p, p.panel, 'Character sheet: stats, toolbelt, achievements', css, b);
}

/* ---------- 5. zen ---------- */
function zen(p) {
  const H = 300;
  const css = `
.z{font:400 32px ${SERIF};fill:${p.text};animation:fade 3.2s ease-in-out .3s both}
.n{font:400 15px ${SERIF};fill:${p.muted};font-style:italic;animation:fade 3s ease-in-out 2.2s both}
@keyframes fade{from{opacity:0}to{opacity:1}}`;
  const body = `<text class="z" x="420" y="148" text-anchor="middle">relax, you're doing fine.</text>
<text class="n" x="420" y="190" text-anchor="middle">— st</text>`;
  return frame(H, p, p.zen, "relax, you're doing fine.", css, body);
}

for (const mode of ['dark', 'light']) {
  const p = PAL[mode];
  const files = { banner, terminal, work, rpg, zen };
  for (const [name, fn] of Object.entries(files)) writeFileSync(`${OUT}${name}-${mode}.svg`, fn(p));
}
console.log('wrote banner/terminal/work/rpg/zen x dark/light');
