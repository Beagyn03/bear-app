// Nota em todas as capas do app (pedido da Bia, 15/11), no mesmo jeito das Leituras por mês:
// 5 patas = contorno dourado com brilho furta-cor, reflexo e estrelinhas; 4,5 ouro; 4 prata; 3 a 3,5 bronze; abaixo de 3 ferro.
// Vale para qualquer capa de um livro que você leu e avaliou (pela sua nota), em qualquer tela. As Leituras por mês já têm o próprio.
{ const st = document.createElement('style'); st.textContent = `
.cv.rt{position:relative}
.cv.rt-5{box-shadow:0 0 0 2px #f6c94a,0 0 10px 1px rgba(246,201,74,.6)!important}
.cv.rt-ouro{box-shadow:0 0 0 1.5px #d4a520,0 0 7px rgba(212,165,32,.4)!important}
.cv.rt-prata{box-shadow:0 0 0 1.5px #b9c1c8,0 0 6px rgba(185,193,200,.45)!important}
.cv.rt-bronze{box-shadow:0 0 0 1.5px #b0703a!important}
.cv.rt-ferro{box-shadow:0 0 0 1.5px #6b7177!important}
.cv.rt-5::before,.cv.rt-ouro::before,.cv.rt-prata::before{content:'';position:absolute;inset:0;z-index:2;pointer-events:none;border-radius:inherit;background:linear-gradient(115deg,transparent 38%,rgba(255,255,255,.5) 50%,transparent 62%);background-size:250% 100%;animation:ys5Shine 3.4s ease-in-out infinite}
.cv.rt-ouro::before,.cv.rt-prata::before{background:linear-gradient(115deg,transparent 42%,rgba(255,255,255,.3) 50%,transparent 58%);background-size:250% 100%;animation-duration:5.5s}
.cv.rt-prata::before{animation-delay:1.5s}
.cv.rt-5 .rt-sp{position:absolute;z-index:3;pointer-events:none;line-height:1;font-size:10px;color:#ffd75e;text-shadow:0 0 4px rgba(255,215,94,.95);animation:ys5Tw 1.8s ease-in-out infinite}
.cv.rt-5 .rt-sp.a{top:3px;right:4px}.cv.rt-5 .rt-sp.b{top:16%;left:5px;font-size:7px;animation-delay:.6s;color:#ffb3dc}.cv.rt-5 .rt-sp.c{bottom:18%;right:5px;font-size:7px;animation-delay:1.2s;color:#cfe9ff}
@keyframes ys5Shine{0%,55%{background-position:150% 0}100%{background-position:-100% 0}}
@keyframes ys5Tw{0%,100%{opacity:.15;transform:scale(.6) rotate(0)}50%{opacity:1;transform:scale(1.15) rotate(20deg)}}
@media (prefers-reduced-motion:reduce){.cv.rt::before,.cv.rt .rt-sp{animation:none}}
`; TR.append(st); }
{
  let map = null, at = 0;
  const rates = () => { // título normalizado → sua nota (só livros lidos e avaliados); refeito no máximo a cada 1,5 s
    if (map && Date.now() - at < 1500) return map; map = new Map(); at = Date.now();
    try { for (const e of lib()) { if (e.status !== 'LIDO') continue; const p = (reviewOfLib(e) || {}).paws || 0; if (p) map.set(normT(e.title), p); } } catch {}
    return map;
  };
  const tier = (p) => (p >= 5 ? '5' : p >= 4.5 ? 'ouro rt-45' : p >= 4 ? 'ouro' : p >= 3 ? 'prata' : p ? 'bronze' : '');
  const _cvh = cvh;
  cvh = function (title, coverUrl, cls = '', style = '') {
    const h = _cvh.apply(this, arguments);
    if (/\bys-cv\b/.test(cls || '')) return h; // Leituras por mês: já tem o destaque dela
    const t = tier(rates().get(normT(title || '')) || 0); if (!t) return h;
    const sp = t === '5' ? '<span class="rt-sp a">✦</span><span class="rt-sp b">✦</span><span class="rt-sp c">✦</span>' : '';
    return h.replace('<span class="cv ', `<span class="cv rt rt-${t} `).replace(/<\/span>$/, sp + '</span>');
  };
}
