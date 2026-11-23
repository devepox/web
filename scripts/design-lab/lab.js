// Design lab: injects the brand wordmark ([data-wordmark]) and the foil E ([data-e]) from the site's own paths,
// then sets window.ready once fonts are loaded (render.js waits for it).
const STOPS = [['0', '#BFE3FF'], ['0.2', '#E2FFF4'], ['0.4', '#8FC9FF'], ['0.58', '#7FF5D0'], ['0.78', '#E4FBFF'], ['1', '#A8F0E0']].map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('');
const E = '169.2,39 1336,39 1336,59.8 189.5,59.8 182.2,85.8 1336,85.8 1336,106.6 177,106.6 169.7,132.6 1336,132.6 1336,153.4 138,153.4';
(async () => {
  const src = await (await fetch('/site/src/components/brand/wordmark-path.ts')).text();
  const d = src.match(/WORDMARK_PATH = '([^']+)'/)[1], vb = src.match(/WORDMARK_VIEWBOX = '([^']+)'/)[1];
  document.body.insertAdjacentHTML('afterbegin', `<svg width="0" height="0" style="position:absolute"><defs>
    <linearGradient id="lf" x1="0" y1="0" x2="1" y2="1">${STOPS}</linearGradient>
    <linearGradient id="lfe" gradientUnits="userSpaceOnUse" x1="138" y1="9.3" x2="336" y2="193">${STOPS}</linearGradient>
    <pattern id="lg" patternUnits="userSpaceOnUse" width="3" height="3" patternTransform="rotate(-35)"><rect width="0.81" height="3" fill="#fff" fill-opacity="0.22"/></pattern></defs></svg>`);
  document.querySelectorAll('[data-wordmark]').forEach(el => { const fill = el.dataset.wordmark === 'ink' ? '#0B0C0F' : el.dataset.wordmark === 'white' ? '#F2F5F9' : 'url(#lf)';
    el.innerHTML = `<svg viewBox="${vb}" style="display:block;width:100%;height:auto"><path d="${d}" fill="${fill}"/></svg>`; });
  document.querySelectorAll('[data-e]').forEach(el => { el.innerHTML = `<svg viewBox="138 39 198 114.4" overflow="visible" style="display:block;width:100%;height:auto"><polygon points="${E}" fill="url(#lfe)"/><polygon points="${E}" fill="url(#lg)"/></svg>`; });
  await document.fonts.ready; await new Promise(r => setTimeout(r, 200)); window.ready = true;
})();
