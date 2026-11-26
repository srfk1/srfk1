// Shared palette + font stacks. Edit here; both variants stay in sync.
export const PAL = {
  dark:  { bg: '#0d1117', panel: '#161b22', text: '#e6edf3', muted: '#8b949e', border: '#30363d', track: '#262c36', zen: '#0d1117' },
  light: { bg: '#ffffff', panel: '#f6f8fa', text: '#1f2328', muted: '#656d76', border: '#d0d7de', track: '#e3e8ee', zen: '#f4efe6' },
};
export const ACCENT = { coral: '#ff7a59', teal: '#2bb3a3', cream: '#f4efe6' };
export const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
export const SANS = "-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";
export const SERIF = "Georgia, 'Times New Roman', serif";
export const W = 840;
export const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Wrap card body in the common frame (rounded bg + border on top).
export function frame(h, p, fill, label, css, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${h}" width="${W}" height="${h}" role="img" aria-label="${esc(label)}">
<title>${esc(label)}</title>
<style>
${css}
@media (prefers-reduced-motion: reduce){*{animation:none!important}}
</style>
<rect width="${W}" height="${h}" rx="12" fill="${fill}"/>
${body}
<rect x=".5" y=".5" width="${W - 1}" height="${h - 1}" rx="11.5" fill="none" stroke="${p.border}"/>
</svg>
`;
}
