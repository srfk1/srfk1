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
<text class="tag" x="420" y="250" text-anchor="middle">data engineer · motion &amp; game tinkerer</text>`;
  return frame(H, p, p.bg, 'st — data engineer, motion and game tinkerer', css, body);
}

/* ---------- 2. terminal ---------- */
function terminal(p) {
  const CW = 8.4;
  const rows = [
    ['cmd', 'whoami'],
    ['out', 'st — data engineer by day, motion & game tinkerer by night'],
    ['cmd', 'cat stack.txt'],
    ['out', 'SQL · Python · TypeScript · Three.js · SVG · ffmpeg'],
    ['cmd', 'ls projects/'],
    ['out', 'home-pwa/  motion-studio/  game-studio/  packaging-sim/  de-handbook/'],
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
  return frame(cy + 30, p, p.panel, 'terminal: whoami, stack, projects, motto', css, body);
}

/* ---------- 3. RPG character sheet ---------- */
function rpg(p) {
  const stats = [['SQL', 90], ['Python', 80], ['TypeScript', 70], ['Motion/SVG', 75], ['Game Dev', 50], ['Chill', 100]];
  const quests = [
    ['Home PWA for two — live', 1], ['Code-rendered motion video studio', 1], ['3D packaging simulator (Three.js)', 1],
    ['Data engineering handbook (mock data)', 1], ['Indie game studio — in progress', 0],
  ];
  const badges = ['Shipped a live PWA', 'Video from pure code', 'Zero-diff reconciler', 'Still relaxed'];
  const H = 486, TW = 230, X0 = 150;
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
<text class="s" x="32" y="74" style="fill:${p.muted}">Class  <tspan style="fill:${teal}" font-weight="600">Data Engineer / Motion Tinkerer</tspan></text>
<line x1="32" y1="94" x2="${W - 32}" y2="94" stroke="${p.border}"/>
<text class="l" x="32" y="124">STATS</text><text class="l" x="460" y="124">QUESTS</text>
<line x1="436" y1="112" x2="436" y2="344" stroke="${p.border}"/>`;
  stats.forEach(([n, v], i) => {
    const y = 160 + 38 * i, chill = n === 'Chill';
    b += `<text class="s" x="32" y="${y + 5}">${n}</text>
<rect x="${X0}" y="${y - 5}" width="${TW}" height="10" rx="5" fill="${p.track}"/>
<rect class="bar" x="${X0}" y="${y - 5}" width="${TW * v / 100}" height="10" rx="5" fill="${chill ? 'url(#chill)' : coral}" style="animation-delay:${(0.3 + i * 0.12).toFixed(2)}s"/>
<text class="v" x="${X0 + TW + 14}" y="${y + 4}">${v}</text>\n`;
  });
  quests.forEach(([n, done], i) => {
    const y = 160 + 38 * i, dl = (0.6 + i * 0.15).toFixed(2);
    b += `<g class="q" style="animation-delay:${dl}s">` + (done
      ? `<circle cx="468" cy="${y}" r="8" fill="${teal}"/><path d="M464.5 ${y}l2.5 2.5 4.5-5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
      : `<circle cx="468" cy="${y}" r="7" fill="none" stroke="${coral}" stroke-width="2" stroke-dasharray="3 3"/>`) +
      `<text class="s" x="488" y="${y + 5}">${esc(n)}</text></g>\n`;
  });
  b += `<line x1="32" y1="384" x2="${W - 32}" y2="384" stroke="${p.border}"/>
<text class="l" x="32" y="414">ACHIEVEMENTS</text>\n`;
  let x = 32;
  badges.forEach((n, i) => {
    const w = Math.ceil(28 + n.length * 7 + 16);
    b += `<g class="b" style="animation-delay:${(1.2 + i * 0.15).toFixed(2)}s"><rect x="${x}" y="428" width="${w}" height="32" rx="16" fill="${p.bg}" stroke="${p.border}"/>
<circle cx="${x + 17}" cy="444" r="4" fill="${coral}"/><text class="s" x="${x + 29}" y="449" style="font-size:13px">${esc(n)}</text></g>\n`;
    x += w + 12;
  });
  b = `<defs><linearGradient id="chill" x1="0" x2="1"><stop offset="0" stop-color="${teal}"/><stop offset="1" stop-color="#7fe0d2"/></linearGradient></defs>` + b;
  return frame(H, p, p.panel, 'RPG character sheet: stats, quests, achievements', css, b);
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
  const files = { banner, terminal, rpg, zen };
  for (const [name, fn] of Object.entries(files)) writeFileSync(`${OUT}${name}-${mode}.svg`, fn(p));
}
console.log('wrote banner/terminal/rpg/zen x dark/light');
