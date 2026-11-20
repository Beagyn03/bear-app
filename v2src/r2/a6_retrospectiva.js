// Retrospectiva da leitura (Bia, 18/11): ao concluir o livro, abre em tela cheia como stories (toque para avançar):
// abertura, ritmo, o que ficou (emoções, nota, ressaca), personagens, trecho e, no fim, a imagem para postar,
// com tema, formato (story ou post) e o que mostrar. Fica guardada no topo do Histórico do diário.
{ const st = document.createElement('style'); st.textContent = `
.rt{position:fixed;inset:0;z-index:9000;display:flex;justify-content:center;background:#05040c;font-family:Nunito,system-ui,sans-serif;-webkit-user-select:none;user-select:none}
.rt-ph{position:relative;width:100%;max-width:480px;height:100%;overflow:hidden;color:#fff;background:radial-gradient(130% 90% at 50% 0,#3b2a6b 0,#1a1436 45%,#0c0a1c 100%)}
.rt-sky{position:absolute;inset:0;pointer-events:none}.rt-sky i{position:absolute;width:2px;height:2px;border-radius:50%;background:#fff;animation:rtTw 3s ease-in-out infinite}
@keyframes rtTw{0%,100%{opacity:.2}50%{opacity:1}}
.rt-bars{position:absolute;top:calc(10px + env(safe-area-inset-top));left:12px;right:12px;display:flex;gap:4px;z-index:5}.rt-bars i{flex:1;height:3px;border-radius:3px;background:#ffffff40;overflow:hidden}.rt-bars i b{display:block;height:100%;width:0;background:#fff}.rt-bars i.f b{width:100%}.rt-bars i.c b{width:100%;transition:width .35s}
.rt-x{position:absolute;top:calc(22px + env(safe-area-inset-top));right:12px;z-index:6;width:38px;height:38px;border:0;border-radius:50%;background:#ffffff1a;color:#fff;font-size:1.3rem;cursor:pointer}
.rt-sl{position:absolute;inset:0;padding:calc(64px + env(safe-area-inset-top)) 24px calc(28px + env(safe-area-inset-bottom));display:flex;flex-direction:column;z-index:2}
.rt-k{font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:#cfc4ff;font-weight:900}
.rt-t{font-family:Georgia,'Times New Roman',serif;font-weight:700;font-size:1.95rem;line-height:1.12;margin:.4rem 0 .2rem}.rt-t i{font-weight:400}
.rt-s{font-size:.95rem;color:#ddd5ff;font-weight:700;margin-top:.3rem}
.rt-mid{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center}
.rt-emo{display:flex!important;flex-wrap:wrap;justify-content:center;align-items:center;gap:.6rem;height:auto!important;margin:1.2rem 0 .4rem!important}.rt-emo span{position:static!important}
.rt-md{gap:1rem!important;padding:.6rem 1rem!important}.rt-md small{margin:0!important;font-size:.72rem!important;letter-spacing:.08em;text-transform:uppercase;font-weight:900;color:#cfc4ff}.rt-md b{display:block;font-size:1.15rem!important}
.rt-star{position:relative;width:74px;height:74px;flex:none;display:grid;place-items:center;filter:drop-shadow(0 4px 10px rgba(0,0,0,.35))}
.rt-star::before,.rt-star::after{content:"";position:absolute;-webkit-mask:var(--star);mask:var(--star)}.rt-star::before{inset:0;background:var(--so)}.rt-star::after{inset:5px;background:var(--sg)}
.rt-star b{position:relative;z-index:1;margin-top:6px;font-size:1.25rem!important;font-weight:900;color:#2a1709;text-shadow:0 0 4px rgba(255,255,255,.9)}
.rt-star.t-5{--sg:linear-gradient(135deg,#ffe29a,#ff9fd0 38%,#c2a0ff 66%,#8fe0ff);--so:#b04fc8;filter:drop-shadow(0 0 12px rgba(255,143,200,.7))}.rt-star.t-ouro{--sg:linear-gradient(160deg,#fff3c2,#f4c94a 50%,#d8961c);--so:#a86a0c;filter:drop-shadow(0 0 12px rgba(242,201,76,.6))}
.rt-star.t-prata{--sg:linear-gradient(160deg,#ffffff,#dde1e6 50%,#a3abb5);--so:#6c7480}.rt-star.t-bronze{--sg:linear-gradient(160deg,#ffdcbd,#e59d62 50%,#b5672f);--so:#86441a}
.rt{--star:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 1.6l3.15 6.55 7.2.95-5.3 5 1.38 7.15L12 17.8l-6.43 3.45 1.38-7.15-5.3-5 7.2-.95z' stroke='%23000' stroke-width='1.6' stroke-linejoin='round'/%3E%3C/svg%3E") center/contain no-repeat}
.rt-rv{flex:0 1 auto;min-height:0;margin-top:.7rem;padding:.9rem 1rem;border-radius:18px;background:#ffffff10;overflow-y:auto;opacity:0;animation:rtUp .6s .7s ease forwards}.rt-rv small{display:block;font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;font-weight:900;color:#cfc4ff;margin-bottom:.35rem}.rt-rv p{margin:0;font-size:.98rem;line-height:1.5;white-space:pre-line;color:#f3efff}
.rt-mid .rt-rt{max-height:100%;margin:.4rem 0}.rt-calnote{margin:.2rem 0 0;font-size:.82rem;color:#bfb4f2;text-align:center;line-height:1.35}
.rt-mid .rt-pc b{font-size:2.3rem}.rt-mid .rt-q{font-size:1.45rem}
.rt-cv{height:min(46vh,420px);width:auto;max-width:74%;aspect-ratio:2/3;margin:1rem auto;border-radius:5px 10px 10px 5px;background:#2a2340 center/cover;box-shadow:0 0 0 3px var(--g,#f2c94c),0 0 44px var(--gg,rgba(242,201,76,.55)),0 18px 30px rgba(0,0,0,.5);animation:rtIn 1s cubic-bezier(.2,.9,.3,1.2) both;display:grid;place-items:center;text-align:center;font:900 1rem/1.1 Nunito;padding:.5rem;color:#fff}
@keyframes rtIn{from{transform:rotate(-200deg) scale(.2);opacity:0}to{transform:rotate(-4deg) scale(1);opacity:1}}
.rt-nums{display:grid;grid-template-columns:repeat(3,1fr);gap:.55rem;margin-top:auto}.rt-nums div{background:#ffffff14;border:1px solid #ffffff22;border-radius:16px;padding:.7rem .2rem;text-align:center}.rt-nums b{display:block;font-size:1.6rem;color:#f2c94c;font-weight:900}.rt-nums small{font-size:.72rem;color:#ddd5ff;font-weight:700}
.rt-tap{font-size:.74rem;color:#bfb4f2;text-align:center;margin-top:.8rem}
.rt-rt{width:100%;height:auto;margin:1rem 0 .4rem;overflow:visible}
.rt-rt .ln{stroke-dasharray:var(--L);stroke-dashoffset:var(--L);animation:rtDraw 1.8s .3s ease forwards}@keyframes rtDraw{to{stroke-dashoffset:0}}
.rt-rt .pt{opacity:0;animation:rtPop .4s ease forwards}@keyframes rtPop{from{opacity:0;transform:scale(0)}to{opacity:1;transform:scale(1)}}
.rt-f{display:flex;gap:.6rem;align-items:center;background:#ffffff12;border-radius:14px;padding:.6rem .8rem;margin-top:.5rem;font-size:.9rem;opacity:0;animation:rtUp .5s ease forwards}.rt-f span{font-size:1.2rem}.rt-f b{color:#f2c94c}
@keyframes rtUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
.rt-emo{position:relative;height:210px;margin:1rem 0}.rt-emo span{position:absolute;border-radius:99px;display:grid;place-items:center;font-weight:900;text-align:center;box-shadow:0 6px 18px rgba(0,0,0,.3);padding:.3rem;line-height:1.1;opacity:0;animation:rtPop .5s cubic-bezier(.2,.9,.3,1.4) forwards}
.rt-md{display:flex;align-items:center;gap:.8rem;background:#ffffff12;border-radius:18px;padding:.75rem .9rem;margin-top:.6rem;opacity:0;animation:rtUp .5s .5s ease forwards}.rt-md .m{width:62px;height:62px;flex:none;border-radius:50%;display:grid;place-items:center;font:900 1.3rem Nunito;color:#3a2600;background:radial-gradient(circle at 35% 30%,#fff6c7,var(--g,#f2c94c) 45%,#00000055)}
.rt-md b{font-size:1rem}.rt-md small{display:block;color:#ddd5ff;font-size:.8rem;margin-top:.15rem}
.rt-pc{margin-top:1.4rem;padding:1rem 1.1rem;border-radius:18px;background:#ffffff12;opacity:0;animation:rtUp .6s ease forwards}.rt-pc small{display:block;color:#cfc4ff;font-weight:800;font-size:.74rem;letter-spacing:.06em;text-transform:uppercase}.rt-pc b{display:block;font-family:Georgia,serif;font-size:1.7rem;margin-top:.2rem}
.rt-q{font-family:Georgia,serif;font-style:italic;font-size:1.3rem;line-height:1.4;margin-top:1.4rem;padding:1rem 1.1rem;border-left:3px solid #f2c94c;background:#ffffff0d;border-radius:0 14px 14px 0;opacity:0;animation:rtUp .6s .2s ease forwards}.rt-q small{display:block;font-family:Nunito;font-style:normal;font-size:.76rem;color:#cfc4ff;margin-top:.6rem;font-weight:800}
.rt-ed{position:absolute;inset:0;z-index:7;background:#efe7da;color:#2a2118;overflow-y:auto;padding:calc(18px + env(safe-area-inset-top)) 16px calc(96px + env(safe-area-inset-bottom))}
.rt-ed h3{margin:0 0 .6rem;font-size:1.05rem}.rt-ed .rt-x{background:#0000000d;color:#2a2118;top:calc(12px + env(safe-area-inset-top))}
.rt-pv{display:block;margin:0 auto .8rem;max-width:70%;max-height:44vh;border-radius:12px;box-shadow:0 10px 24px rgba(0,0,0,.25)}
.rt-ed h4{margin:.8rem 0 .4rem;font-size:.7rem;letter-spacing:.08em;text-transform:uppercase;color:#7b6b5a}
.rt-ch{display:flex;gap:.35rem;flex-wrap:wrap}.rt-ch button{border:1.5px solid #e8dccb;background:#fffaf3;color:#2a2118;border-radius:99px;padding:.35rem .75rem;font:inherit;font-size:.8rem;font-weight:800;cursor:pointer}.rt-ch button.on{border-color:#c46f2e;background:#c46f2e;color:#fff}
.rt-sw{display:flex;gap:.5rem}.rt-sw button{width:34px;height:34px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 1.5px #e8dccb;cursor:pointer;padding:0}.rt-sw button.on{box-shadow:0 0 0 3px #c46f2e}
.rt-tabs{display:flex;border-bottom:1.5px solid #e2d6c3;margin:.2rem 0 .5rem}.rt-tabs button{flex:1;border:0;background:none;font:inherit;font-weight:900;font-size:.9rem;color:#7b6b5a;padding:.55rem 0;border-bottom:2.5px solid transparent;margin-bottom:-1.5px;cursor:pointer}.rt-tabs button.on{color:#c46f2e;border-bottom-color:#c46f2e}
.rt-ths{display:grid;grid-template-columns:repeat(auto-fill,minmax(78px,1fr));gap:.6rem .4rem;padding-top:.4rem}.rt-ths button{display:grid;justify-items:center;gap:.3rem;border:0;background:none;font:inherit;cursor:pointer;padding:0}.rt-ths i{width:46px;height:46px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 1.5px #e2d6c3}.rt-ths span{font-size:.72rem;font-weight:800;color:#2a2118;text-align:center;line-height:1.15}.rt-ths button.on i{box-shadow:0 0 0 3px #c46f2e}.rt-ths button.on span{color:#c46f2e}
.rt-2{display:grid;grid-template-columns:1fr 1fr;gap:.45rem}.rt-cvmsg{font-size:.8rem;color:#7b6b5a;margin:0 0 .45rem;line-height:1.35}.rt-ed select.rt-in{appearance:auto}
.rt-in{width:100%;box-sizing:border-box;border:1.5px solid #e2d6c3;border-radius:12px;background:#fffaf3;color:#2a2118;font:inherit;font-size:.92rem;padding:.55rem .7rem;resize:vertical}.rt-ed h4 span{font-weight:700;text-transform:none;letter-spacing:0}.rt-note{font-size:.74rem;color:#7b6b5a;margin:.7rem 0 0}
.rt-ac{position:absolute;left:0;right:0;bottom:0;padding:22px 16px calc(16px + env(safe-area-inset-bottom));background:linear-gradient(rgba(239,231,218,0),#efe7da 32%);display:grid;grid-template-columns:1fr 1.3fr;gap:.6rem;z-index:8}
.rt-ac button{border-radius:99px;padding:.8rem;font:inherit;font-weight:900;font-size:.92rem;border:1.5px solid #e8dccb;background:#fffaf3;color:#2a2118;cursor:pointer}.rt-ac button.p{background:#c46f2e;border-color:#c46f2e;color:#fff}
.cs-fin{background:radial-gradient(120% 140% at 0 0,#3b2a6b,#14102a 70%)!important;color:#fff!important;border:0!important}.cs-fin .tl-ct,.cs-fin b{color:#fff!important}.cs-fin .cs-w{color:#cfc4ff!important}
.cs-fin .cs-mini{display:flex;gap:.35rem;flex-wrap:wrap;margin:.45rem 0 .55rem}.cs-fin .cs-mini span{background:#ffffff1a;border-radius:9px;padding:.2rem .5rem;font-size:.72rem;font-weight:800}
.cs-retro{display:block;width:100%;border:0!important;border-radius:99px!important;padding:.55rem!important;font:inherit!important;font-weight:900!important;font-size:.84rem!important;background:linear-gradient(90deg,#f2c94c,#e2a92c)!important;color:#2a1a00!important;cursor:pointer;min-height:0!important;height:auto!important}
`; TR.append(st); }

const RT_DIA = (n) => n + (n === 1 ? ' dia' : ' dias');
const RT_PICK = (arr, seed) => arr[Math.abs([...String(seed)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7)) % arr.length];
const RT_MEDAL = (p) => (p >= 5 ? ['#f2c94c', 'rgba(242,201,76,.6)'] : p >= 4.5 ? ['#e8b84a', 'rgba(232,184,74,.5)'] : p >= 4 ? ['#cfd6e0', 'rgba(207,214,224,.45)'] : p >= 3 ? ['#d49a6a', 'rgba(212,154,106,.45)'] : p ? ['#9aa0a8', 'rgba(154,160,168,.35)'] : ['#b69cff', 'rgba(182,156,255,.45)']);
const RT_FR = { 0.5: 'Socorro, o que foi isso?', 1: 'Não foi pra mim', 1.5: 'Quase abandonei', 2: 'Fraquinho', 2.5: 'Teve seus momentos', 3: 'Bom, mas não marcou', 3.5: 'Gostei bastante', 4: 'Muito bom!', 4.5: 'Quase perfeito', 5: 'Favorito da vida!' };
function retroData(e) {
  const d10 = (x) => String(x || '').slice(0, 10), DAY = 864e5;
  const logs = (e.readLog || []).filter((l) => l && l.date && Number(l.pages) > 0);
  const byDay = new Map(); logs.forEach((l) => byDay.set(d10(l.date), (byDay.get(d10(l.date)) || 0) + Number(l.pages)));
  const ds = [...byDay.keys()].sort();
  const ini = d10(e.startedAt) || ds[0] || d10(e.finishedAt), fim = d10(e.finishedAt) || ds[ds.length - 1] || ini;
  const noPeriod = !e.startedAt && !ds.length;
  const days = noPeriod ? 0 : ini && fim ? Math.max(1, Math.round((Date.parse(fim) - Date.parse(ini)) / DAY) + 1) : Math.max(1, ds.length);
  const pages = Number(e.totalPages) || (() => { try { return readingInfo(e).total || 0; } catch { return 0; } })();
  let best = null; byDay.forEach((p, d) => { if (!best || p > best.p) best = { d, p }; });
  let gap = 0; for (let i = 1; i < ds.length; i++) gap = Math.max(gap, Math.round((Date.parse(ds[i]) - Date.parse(ds[i - 1])) / DAY));
  const hrs = logs.filter((l) => l.at).map((l) => new Date(l.at).getHours());
  const PER = [['de madrugada', (h) => h < 5], ['de manhã', (h) => h >= 5 && h < 12], ['à tarde', (h) => h >= 12 && h < 18], ['à noite', (h) => h >= 18]];
  let per = null; if (hrs.length >= 2) { const c = PER.map(([n, f]) => [n, hrs.filter(f).length]).sort((a, b) => b[1] - a[1]); if (c[0][1] >= Math.ceil(hrs.length / 2)) per = c[0][0]; }
  let meta = null; try { const dl = tlEvents(e), hit = dl.filter((x) => x.ok).length, n = dl.filter((x) => x.inDue && !x.off && x.per).length; if (n && hit) meta = { hit, n: Math.max(n, hit) }; } catch {} // só aparece se bateu a meta em algum dia
  const cnt = new Map(), add = (k, w) => k && cnt.set(k, (cnt.get(k) || 0) + w);
  (e.diary || []).forEach((x) => (x.fe || []).forEach((k) => add(k, 1))); (e.quotes || []).forEach((x) => (x.f || []).forEach((k) => add(k, 1))); ((e.fin || {}).fe || []).forEach((k) => add(k, 2));
  const emo = [...cnt.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k, n]) => ({ k, n, name: (QT_FEELS.find((y) => y[0] === k) || [, k])[1] }));
  const rv = (() => { try { return reviewOfLib(e) || {}; } catch { return e.review || {}; } })();
  const fin = e.fin || {}, qs = (e.quotes || []).filter((x) => x && x.t), q = fin.q || (qs.length ? { t: qs[qs.length - 1].t, p: qs[qs.length - 1].p } : null);
  // rota: progresso acumulado por dia de leitura
  let acc = 0; const pts = ds.map((d) => { acc += byDay.get(d); return { d, p: byDay.get(d), acc }; });
  const per0 = (() => { try { return new Map(tlEvents(e).map((x) => [x.d, x.ok])); } catch { return new Map(); } })(); pts.forEach((x) => { x.ok = !!per0.get(x.d); });
  return { e, ini, fim, days, pages, perDay: pages && days ? Math.round(pages / days) : 0, best, gap, per, meta, emo, paws: Number(rv.paws) || 0, texto: rv.texto || '', ressaca: rv.ressaca, fav: fin.fav, hate: fin.hate, q, pts };
}
function rtRouteSVG(D, w, h, anim) {
  // começa no zero (dia em que começou) e sobe a cada dia de leitura; cada ponto mostra o dia e as páginas
  const P0 = D.pts; if (!P0.length) return rtCalSVG(D, w, anim);
  const P = (D.ini && D.ini < P0[0].d) || P0.length === 1 ? [{ d: D.ini && D.ini < P0[0].d ? D.ini : P0[0].d, p: 0, acc: 0, st: 1 }, ...P0] : P0;
  const max = Math.max(1, P[P.length - 1].acc), maxP = Math.max(1, ...P.map((x) => x.p)), T = 34, B = 46, Lp = 22, Rp = 26;
  const xy = P.map((x, i) => [Lp + (w - Lp - Rp) * (i / (P.length - 1)), T + (h - T - B) * (1 - x.acc / max)]);
  let L = 0; for (let i = 1; i < xy.length; i++) L += Math.hypot(xy[i][0] - xy[i - 1][0], xy[i][1] - xy[i - 1][1]);
  const few = P.length <= 7, dd = (d) => d.slice(8, 10) + '/' + d.slice(5, 7);
  // datas embaixo: a primeira encosta à esquerda, a última à direita, as do meio centradas; pula a que encostaria na vizinha
  const LW = 38, n1 = xy.length - 1, ext = (i) => (i === 0 ? [xy[0][0], xy[0][0] + LW] : i === n1 ? [xy[n1][0] - LW, xy[n1][0]] : [xy[i][0] - LW / 2, xy[i][0] + LW / 2]);
  let right = -99; const lastL = ext(n1)[0];
  const lbl = xy.map((p, i) => { if (i === n1) return true; if (i > 0 && !few) return false; const [a, b] = ext(i); if (i === 0 || (a >= right + 6 && b <= lastL - 6)) { right = b; return true; } return false; });
  return '<svg class="rt-rt" viewBox="0 0 ' + w + ' ' + h + '" style="--L:' + Math.ceil(L) + '">'
    + '<line x1="' + Lp + '" x2="' + (w - Rp) + '" y1="' + (h - B) + '" y2="' + (h - B) + '" stroke="#ffffff33" stroke-dasharray="3 5"/>'
    + '<polyline class="' + (anim ? 'ln' : '') + '" points="' + xy.map((p) => p.map((n) => n.toFixed(1)).join(',')).join(' ') + '" fill="none" stroke="#b69cff" stroke-opacity=".8" stroke-width="2.4" stroke-linejoin="round"/>'
    + xy.map((p, i) => { const x = P[i], r = x.st ? 4 : 4 + 7 * (x.p / maxP), dl = (0.3 + 1.8 * i / xy.length).toFixed(2), last = i === xy.length - 1, anc = i === 0 ? 'start' : last ? 'end' : 'middle';
      return '<g class="' + (anim ? 'pt' : '') + '" style="animation-delay:' + dl + 's;transform-origin:' + p[0].toFixed(1) + 'px ' + p[1].toFixed(1) + 'px">'
        + '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="' + r.toFixed(1) + '" fill="' + (x.ok ? '#f2c94c' : '#b69cff') + '"' + (x.ok ? ' filter="drop-shadow(0 0 6px #f2c94c)"' : '') + '/>'
        + (few && !x.st ? '<text x="' + p[0].toFixed(1) + '" y="' + (p[1] - r - 7).toFixed(1) + '" text-anchor="' + anc + '" fill="#fff" font-size="12" font-weight="900">+' + x.p + '</text>' : '')
        + (lbl[i] ? '<text x="' + p[0].toFixed(1) + '" y="' + (h - B + 20) + '" text-anchor="' + anc + '" fill="' + (last ? '#f2c94c' : '#cfc4ff') + '" font-size="11.5" font-weight="800">' + (x.st ? 'início' : dd(x.d)) + '</text>' : '')
        + '</g>'; }).join('')
    + '<text x="' + (w - Rp) + '" y="' + (h - 6) + '" text-anchor="end" fill="#f2c94c" font-size="11" font-weight="900">' + max + ' páginas</text></svg>';
}
function retroSlides(D) {
  const e = D.e, ttl = esc(e.title), S0 = [], [g, gg] = RT_MEDAL(D.paws), ab = ['Fim. Mas toda história continua em quem leu.', 'Pouso confirmado no último capítulo.'];
  S0.push('<div class="rt-sl" style="--g:' + g + ';--gg:' + gg + '"><span class="rt-k">Sua retrospectiva</span><div class="rt-t">Você terminou<br><i>' + ttl + '</i></div><div class="rt-s">' + esc(RT_PICK(ab, e.id + D.fim)) + '</div>'
    + '<div class="rt-mid"><div class="rt-cv" style="' + (e.cover ? 'background-image:url(&quot;' + esc(String(e.cover)) + '&quot;);color:transparent' : '') + '">' + ttl + '</div></div>'
    + (D.days ? '<div class="rt-nums"><div><b data-n="' + D.days + '">0</b><small>' + (D.days === 1 ? 'dia' : 'dias') + '</small></div><div><b data-n="' + D.pages + '">0</b><small>páginas</small></div><div><b data-n="' + D.perDay + '">0</b><small>pág. por dia</small></div></div>' : '<div class="rt-nums" style="grid-template-columns:1fr 1fr"><div><b data-n="' + D.pages + '">0</b><small>páginas</small></div><div><b>' + (D.fim ? D.fim.slice(8, 10) + '/' + D.fim.slice(5, 7) : '—') + '</b><small>terminou em</small></div></div>') + '<div class="rt-tap">toque para continuar ›</div></div>');
  const fast = D.days <= 3, slow = D.days > 21, pausa = D.gap > 7;
  const rtT = fast ? RT_PICK(['Devorado em ' + RT_DIA(D.days), 'Leu como quem foge do Michael Myers'], e.id) : pausa ? 'No meio do caminho tinha uma pausa' : slow ? 'Sem pressa: ' + D.days + ' dias de companhia' : RT_PICK([D.days + ' dias, do primeiro capítulo ao fim', 'Uma jornada de ' + D.days + ' dias'], e.id);
  const dd = (d) => d.slice(8, 10) + '/' + d.slice(5, 7);
  const facts = [D.ini && D.fim ? ['📅', 'De <b>' + dd(D.ini) + '</b> a <b>' + dd(D.fim) + '</b>'] : null, D.perDay ? ['📖', 'Média de <b>' + D.perDay + ' páginas</b> por dia'] : null,
    D.best && D.pts.length > 1 ? ['🔥', 'Maior dia: <b>' + dd(D.best.d) + ', ' + D.best.p + ' páginas</b>'] : null, D.per ? [D.per === 'à noite' || D.per === 'de madrugada' ? '🌙' : '☀️', 'Você leu mais <b>' + D.per + '</b>'] : null,
    D.meta ? ['★', 'Meta do dia batida em <b>' + D.meta.hit + ' de ' + D.meta.n + '</b> dias'] : null, pausa ? ['⏸', 'Uma pausa de <b>' + D.gap + ' dias</b> e você voltou'] : null].filter(Boolean).slice(0, 4);
  if (D.days) S0.push('<div class="rt-sl"><span class="rt-k">Seu ritmo</span><div class="rt-t">' + esc(rtT) + '</div>' + (pausa || fast ? '<div class="rt-s">' + RT_DIA(D.days) + ', do primeiro capítulo ao fim</div>' : '')
    + '<div class="rt-mid">' + rtRouteSVG(D, 320, 300, true) + '</div><div>' + facts.map((f, i) => '<div class="rt-f" style="animation-delay:' + (1.6 + i * 0.2) + 's"><span>' + f[0] + '</span><div>' + f[1] + '</div></div>').join('') + '</div></div>');
  if (D.emo.length || D.paws || D.ressaca || D.texto) {
    const top = (D.emo[0] || {}).name || '', t = /tens|choq|surpre|plot/i.test(top) ? 'Até o Sherlock ficaria surpreso' : /amei|amor|apaix/i.test(top) ? 'Amor à primeira página' : 'Esse livro te deixou…';
    const COL = ['#ff8fab', '#9b8cff', '#f2c94c', '#66d1b5'], mx = Math.max(1, ...D.emo.map((x) => x.n)), tier = D.paws >= 5 ? '5' : D.paws >= 4 ? 'ouro' : D.paws >= 3 ? 'prata' : 'bronze';
    S0.push('<div class="rt-sl"><span class="rt-k">O que ficou</span><div class="rt-t">' + esc(D.emo.length ? t : 'Sua avaliação') + '</div>'
      + '<div class="rt-mid">' + (D.emo.length ? '<div class="rt-emo">' + D.emo.map((x, i) => { const s = Math.round((D.emo.length === 1 ? 128 : 112) * (0.72 + 0.28 * x.n / mx)); return '<span style="width:' + s + 'px;height:' + s + 'px;background:' + COL[i] + ';color:' + (i >= 2 ? '#2a1a00' : '#fff') + ';font-size:' + (s > 100 ? 0.98 : 0.8) + 'rem;animation-delay:' + (0.2 + i * 0.18) + 's">' + esc(x.name) + '</span>'; }).join('') + '</div>' : '')
      + (D.paws ? '<div class="rt-md"><div class="rt-star t-' + tier + '"><b>' + String(D.paws).replace('.', ',') + '</b></div><div><small>sua nota</small><b>' + esc(RT_FR[D.paws] || 'Sua nota') + '</b></div></div>' : '')
      + (D.texto ? '<div class="rt-rv"><small>Sua resenha</small><p>' + esc(D.texto) + '</p></div>' : '')
      + (D.ressaca ? '<div class="rt-f" style="animation-delay:.9s"><span>' + (D.ressaca === 'curou' ? '💊' : '🌊') + '</span><div>' + (D.ressaca === 'curou' ? 'Curou sua <b>ressaca literária</b>' : 'Te deixou de <b>ressaca literária</b>') + '</div></div>' : '') + '</div></div>');
  }
  if (D.fav || D.hate) S0.push('<div class="rt-sl"><span class="rt-k">Personagens</span><div class="rt-mid">' + (D.fav ?'<div class="rt-pc"><small>Seu coração ficou com</small><b>' + esc(D.fav) + '</b></div>' : '') + (D.hate ? '<div class="rt-pc" style="animation-delay:.5s"><small>E quem você amou odiar</small><b>' + esc(D.hate) + '</b></div>' : '') + '</div></div>');
  if (D.q) S0.push('<div class="rt-sl"><span class="rt-k">A frase que ficou</span><div class="rt-t">A frase que você levou com você</div><div class="rt-mid"><div class="rt-q">“' + esc(D.q.t) + '”<small>' + (D.q.p ? 'pág. ' + D.q.p : 'seu trecho') + '</small></div></div></div>');
  return S0;
}
// ---------- imagem para postar (canvas) ----------
// temas da imagem: fundo, cores, decoração e a fonte que combina (a pessoa pode trocar a fonte na aba Texto)
const RT_THEMES = {
  blur: { name: 'Capa desfocada', bg: ['#2a1f3a', '#0e0a16'], ink: '#ffffff', sub: '#efe8fa', acc: '#f2c94c', box: 'rgba(255,255,255,.13)', blur: 1, dark: 1, font: 'classica' },
  app: { name: 'Livroverso', bg: ['#f6efe4', '#f6efe4'], ink: '#2a2118', sub: '#7b6b5a', acc: '#c46f2e', box: 'rgba(42,33,24,.07)', font: 'classica', sw: '#f6efe4' },
  app2: { name: 'Caramelo', bg: ['#c46f2e', '#c46f2e'], ink: '#ffffff', sub: '#fde8d6', acc: '#ffe08a', box: 'rgba(255,255,255,.16)', dark: 1, font: 'classica', sw: '#c46f2e' },
  noite: { name: 'Noite estrelada', bg: ['#3b2a6b', '#0c0a1c'], ink: '#ffffff', sub: '#cfc4ff', acc: '#f2c94c', box: 'rgba(255,255,255,.09)', deco: 'stars', dark: 1, font: 'classica' },
  romance: { name: 'Romântico', bg: ['#ffb3c7', '#8c2f5a'], ink: '#ffffff', sub: '#ffe6ee', acc: '#fff3b0', box: 'rgba(255,255,255,.18)', deco: 'hearts', dark: 1, font: 'romantica' },
  terror: { name: 'Terror', bg: ['#2b0a0d', '#050304'], ink: '#f3e9e6', sub: '#cfb1ac', acc: '#ff3b47', box: 'rgba(255,255,255,.08)', deco: 'drips', dark: 1, font: 'terror' },
  fantasia: { name: 'Fantasia', bg: ['#1d3d5a', '#0a1020'], ink: '#fff6e0', sub: '#e6d8b2', acc: '#e9c46a', box: 'rgba(255,255,255,.10)', deco: 'magic', dark: 1, font: 'fantasia' },
  sol: { name: 'Pôr do sol', bg: ['#ff9a5a', '#7b2d6b'], ink: '#ffffff', sub: '#ffe3d0', acc: '#ffe08a', box: 'rgba(255,255,255,.14)', deco: 'stars', dark: 1, font: 'classica' },
  capa: { name: 'Cores da capa', bg: ['#5a1212', '#121212'], ink: '#ffffff', sub: '#e9dccf', acc: '#f2c94c', box: 'rgba(255,255,255,.10)', deco: 'stars', dark: 1, font: 'moderna' },
  menta: { name: 'Menta', bg: ['#d7f0e4', '#5f9c84'], ink: '#0f2a21', sub: '#2d5546', acc: '#ffffff', box: 'rgba(255,255,255,.35)', font: 'moderna' },
};
const RT_FONTS = {
  classica: { name: 'Clássica', fam: '"Playfair Display", Georgia, serif', w: '700', it: 'italic 700' },
  moderna: { name: 'Moderna', fam: 'Nunito, "Segoe UI", sans-serif', w: '900', it: '900' },
  romantica: { name: 'Romântica', fam: '"Dancing Script", cursive', w: '700', it: '700' },
  terror: { name: 'Terror', fam: 'Creepster, cursive', w: '400', it: '400' },
  fantasia: { name: 'Fantasia', fam: 'Cinzel, serif', w: '700', it: '700' },
  manuscrita: { name: 'Manuscrita', fam: 'Caveat, cursive', w: '700', it: '700' },
};
const RT_FONTS_URL = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Dancing+Script:wght@700&family=Creepster&family=Cinzel:wght@700&family=Caveat:wght@700&display=swap';
function rtFontsReady(k) { if (!document.querySelector('link[data-rtf]')) { const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = RT_FONTS_URL; l.dataset.rtf = '1'; document.head.append(l); }
  const F = RT_FONTS[k] || RT_FONTS.classica; return Promise.race([Promise.all([document.fonts.load(F.w + ' 60px ' + F.fam), document.fonts.load(F.it + ' 60px ' + F.fam)]).catch(() => {}), new Promise((r) => setTimeout(r, 2500))]); }
const RT_LOGO = {}; ['claro', 'escuro'].forEach((k) => { const im = new Image(); im.src = 'img/logo_' + k + '.webp'; RT_LOGO[k] = im; });
function rtImgCors(src) { return new Promise((res) => { if (!src) return res(null); const im = new Image(); im.crossOrigin = 'anonymous'; let done = false; const end = (v) => { if (!done) { done = true; res(v); } }; im.onload = () => { try { const c = document.createElement('canvas'); c.width = c.height = 4; const x = c.getContext('2d'); x.drawImage(im, 0, 0, 4, 4); const d = x.getImageData(0, 0, 4, 4).data; let r = 0, g = 0, b = 0; for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; } im._avg = [r / 16, g / 16, b / 16]; end(im); } catch { end(null); } }; im.onerror = () => end(null); im.src = src; setTimeout(() => end(null), 6000); }); }
// capa para a imagem: a do livro (quando a fonte permite usar), senão a do ISBN na Open Library; a pessoa também pode enviar uma foto
async function rtLoadCover(e) { const tries = []; if (e && e.cover) tries.push(String(e.cover).replace(/^http:/, 'https:')); if (e && e.isbn) tries.push('https://covers.openlibrary.org/b/isbn/' + e.isbn + '-L.jpg?default=false');
  for (const u of tries) { const im = await rtImgCors(u); if (im && im.naturalWidth > 20) return im; } return null; }
function rtImgFile(file) { return new Promise((res) => { const r = new FileReader(); r.onload = () => rtImgCors(r.result).then(res); r.onerror = () => res(null); r.readAsDataURL(file); }); }
function rtWrap(x, t, maxW, maxL) { const words = String(t).split(/\s+/), L = []; let cur = ''; for (const w of words) { const n = cur ? cur + ' ' + w : w; if (x.measureText(n).width > maxW && cur) { L.push(cur); cur = w; if (L.length === maxL) break; } else cur = n; } if (L.length < maxL && cur) L.push(cur); else if (L.length === maxL && cur && !L.includes(cur)) L[maxL - 1] = L[maxL - 1].replace(/\s*\S*$/, '') + '…'; return L; }
const RT_LAYOUTS = { classico: 'Clássico', minimal: 'Minimalista', polaroid: 'Polaroid', diario: 'Diário' };
function rtDraw(D, O, cover) {
  const W = 1080, H = O.fmt === 'post' ? 1350 : 1920, c = document.createElement('canvas'); c.width = W; c.height = H * 2; const x = c.getContext('2d');
  const LY = O.layout || 'classico';
  let T = { ...RT_THEMES[O.theme] }; if (O.theme === 'capa' && cover && cover._avg) { const [r, g, b] = cover._avg; T.bg = ['rgb(' + [r, g, b].map((v) => Math.round(v * 0.75)).join(',') + ')', 'rgb(' + [r, g, b].map((v) => Math.round(v * 0.18)).join(',') + ')']; }
  if (LY === 'diario') T = { bg: ['#f5ecda', '#eadcc2'], ink: '#2b2420', sub: '#6b5d50', acc: '#b5523b', box: 'rgba(43,36,32,.06)', deco: 'paper', font: 'manuscrita' };
  const FN = RT_FONTS[O.font || T.font] || RT_FONTS.classica, K = O.size || 1, CS = O.csize || 1;
  let s0 = 7; const rnd = () => ((s0 = (s0 * 9301 + 49297) % 233280) / 233280);
  // fundo + decoração do tema (numa tela à parte; o conteúdo é desenhado sem fundo e depois centralizado)
  const bgPaint = (x) => { const gr = x.createLinearGradient(0, 0, W * 0.3, H); gr.addColorStop(0, T.bg[0]); gr.addColorStop(1, T.bg[1]); x.fillStyle = gr; x.fillRect(0, 0, W, H); s0 = 7;
    if (T.blur && cover) { const k = Math.max(W / cover.width, H / cover.height) * 1.25, iw = cover.width * k, ih = cover.height * k; x.save(); x.filter = 'blur(48px) saturate(1.2)'; x.drawImage(cover, (W - iw) / 2, (H - ih) / 2, iw, ih); x.restore();
      const ov = x.createLinearGradient(0, 0, 0, H); ov.addColorStop(0, 'rgba(16,10,26,.45)'); ov.addColorStop(1, 'rgba(16,10,26,.78)'); x.fillStyle = ov; x.fillRect(0, 0, W, H); }
    if (T.deco === 'paper') { x.strokeStyle = 'rgba(70,110,170,.16)'; x.lineWidth = 2; for (let yy = 150; yy < H; yy += 64) { x.beginPath(); x.moveTo(0, yy); x.lineTo(W, yy); x.stroke(); } x.strokeStyle = 'rgba(200,70,70,.35)'; x.beginPath(); x.moveTo(110, 0); x.lineTo(110, H); x.stroke();
      for (let i = 0; i < 2600; i++) { x.globalAlpha = 0.035; x.fillStyle = rnd() < 0.5 ? '#000' : '#fff'; x.fillRect(rnd() * W, rnd() * H, 2, 2); } x.globalAlpha = 1; }
    if (T.deco === 'stars') for (let i = 0; i < 90; i++) { x.globalAlpha = 0.25 + rnd() * 0.7; x.fillStyle = '#fff'; x.beginPath(); x.arc(rnd() * W, rnd() * H, 0.8 + rnd() * 2.2, 0, 7); x.fill(); }
    if (T.deco === 'hearts') { const heart = (cx, cy, s) => { x.beginPath(); x.moveTo(cx, cy + s * 0.35); x.bezierCurveTo(cx - s, cy - s * 0.35, cx - s * 0.45, cy - s, cx, cy - s * 0.45); x.bezierCurveTo(cx + s * 0.45, cy - s, cx + s, cy - s * 0.35, cx, cy + s * 0.35); x.fill(); };
      for (let i = 0; i < 34; i++) { x.globalAlpha = 0.1 + rnd() * 0.25; x.fillStyle = rnd() < 0.5 ? '#ffffff' : '#ff6f9c'; heart(rnd() * W, rnd() * H, 14 + rnd() * 46); }
      const gl = x.createRadialGradient(W / 2, H * 0.32, 40, W / 2, H * 0.32, W * 0.7); gl.addColorStop(0, 'rgba(255,255,255,.22)'); gl.addColorStop(1, 'rgba(255,255,255,0)'); x.globalAlpha = 1; x.fillStyle = gl; x.fillRect(0, 0, W, H); }
    if (T.deco === 'drips') { for (let i = 0; i < 4; i++) { const f = x.createRadialGradient(rnd() * W, H * (0.75 + rnd() * 0.25), 20, W / 2, H, W * 0.9); f.addColorStop(0, 'rgba(200,200,210,.10)'); f.addColorStop(1, 'rgba(200,200,210,0)'); x.fillStyle = f; x.fillRect(0, 0, W, H); }
      x.globalAlpha = 1; x.fillStyle = '#7a0b12'; x.fillRect(0, 0, W, 26); let px = 0; while (px < W) { const w = 26 + rnd() * 50, len = 30 + Math.pow(rnd(), 2) * 260; x.beginPath(); x.moveTo(px, 20); x.lineTo(px + w, 20); x.lineTo(px + w * 0.62, 20 + len); x.arc(px + w / 2, 20 + len, w * 0.14, 0, Math.PI); x.lineTo(px + w * 0.38, 20 + len); x.closePath(); x.fill(); x.beginPath(); x.arc(px + w / 2, 20 + len + w * 0.12, w * 0.17, 0, 7); x.fill(); px += w + rnd() * 30; }
      const vg = x.createRadialGradient(W / 2, H / 2, W * 0.35, W / 2, H / 2, W * 1.1); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.6)'); x.fillStyle = vg; x.fillRect(0, 0, W, H); }
    if (T.deco === 'magic') { const mx = W * 0.88, my = 74; const g = x.createRadialGradient(mx, my, 30, mx, my, 260); g.addColorStop(0, 'rgba(255,236,170,.45)'); g.addColorStop(1, 'rgba(255,236,170,0)'); x.fillStyle = g; x.fillRect(0, 0, W, H);
      x.fillStyle = '#fbeec4'; x.beginPath(); x.arc(mx, my, 46, 0, 7); x.fill(); x.fillStyle = T.bg[0]; x.beginPath(); x.arc(mx + 20, my - 12, 41, 0, 7); x.fill();
      const spark = (cx, cy, r) => { x.beginPath(); for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4, rr = k % 2 ? r * 0.22 : r; x.lineTo(cx + rr * Math.cos(a), cy + rr * Math.sin(a)); } x.closePath(); x.fill(); };
      for (let i = 0; i < 40; i++) { x.globalAlpha = 0.3 + rnd() * 0.6; x.fillStyle = rnd() < 0.6 ? '#f3d27a' : '#ffffff'; spark(rnd() * W, rnd() * H, 6 + rnd() * 18); } x.globalAlpha = 1;
      const mist = x.createLinearGradient(0, H * 0.7, 0, H); mist.addColorStop(0, 'rgba(120,200,190,0)'); mist.addColorStop(1, 'rgba(120,200,190,.18)'); x.fillStyle = mist; x.fillRect(0, 0, W, H); }
    x.globalAlpha = 1; };
  const SANS = (w, s) => w + ' ' + s + 'px Nunito, "Segoe UI", sans-serif', DISP = (it, s) => (it ? FN.it : FN.w) + ' ' + Math.round(s * K) + 'px ' + FN.fam;
  const post = O.fmt === 'post', e = D.e, [mg] = RT_MEDAL(D.paws); let y = post ? 90 : 130;
  let hd = ''; try { hd = socialProfile && socialProfile.handle ? '@' + socialProfile.handle : ''; } catch {}
  x.textAlign = 'center'; if (hd && O.show.user !== false) { x.fillStyle = T.sub; x.font = SANS(800, 30); x.fillText(hd, W / 2, y); y += post ? 70 : 84; }
  const head = (O.head ?? 'Leitura concluída').trim();
  if (head) { x.fillStyle = T.ink; if (LY === 'minimal') { x.font = SANS(900, Math.round((post ? 40 : 46) * K)); x.letterSpacing = '10px'; } else x.font = DISP(false, post ? 70 : 84);
    rtWrap(x, LY === 'minimal' ? head.toUpperCase() : head, W - 120, 2).forEach((l) => { x.fillText(l, W / 2, y); y += Math.round((post ? 76 : 92) * K); }); x.letterSpacing = '0px'; y += post ? -26 : -22; }
  y += post ? 40 : 56;
  // capa (tamanho escolhido pela pessoa); sem imagem utilizável, uma capa desenhada com o título
  const cw = Math.round((post ? 300 : 420) * CS), ch = Math.round(cw * 1.5), cx = (W - cw) / 2, cy0 = y;
  const drawCover = (dx, dy) => { if (cover) { const ir = cover.width / cover.height, tr = cw / ch; let sx = 0, sy = 0, sw = cover.width, sh = cover.height; if (ir > tr) { sw = cover.height * tr; sx = (cover.width - sw) / 2; } else { sh = cover.width / tr; sy = (cover.height - sh) / 2; } x.drawImage(cover, sx, sy, sw, sh, dx, dy, cw, ch); } else { const g = x.createLinearGradient(dx, dy, dx + cw, dy + ch); g.addColorStop(0, T.dark ? '#3a2d55' : '#e7d6bd'); g.addColorStop(1, T.dark ? '#1a1430' : '#c9ad87'); x.fillStyle = g; x.fillRect(dx, dy, cw, ch);
    x.strokeStyle = T.dark ? 'rgba(255,255,255,.35)' : 'rgba(43,36,32,.35)'; x.lineWidth = 3; x.strokeRect(dx + 18, dy + 18, cw - 36, ch - 36); x.fillStyle = T.dark ? '#fff' : '#2b2420'; x.font = DISP(false, Math.round(cw / 8.5)); const L = rtWrap(x, e.title, cw - 70, 4); L.forEach((l, i) => x.fillText(l, dx + cw / 2, dy + ch * 0.42 + (i - (L.length - 1) / 2) * cw / 7));
    if (e.author) { x.font = SANS(800, Math.round(cw / 16)); x.fillText(e.author, dx + cw / 2, dy + ch - 50); } } };
  if (LY === 'polaroid') { const pad = 26, fw = cw + pad * 2, fh = ch + pad + 130, fx0 = (W - fw) / 2;
    x.save(); x.translate(W / 2, cy0 + fh / 2); x.rotate(-0.045); x.translate(-W / 2, -(cy0 + fh / 2)); x.shadowColor = 'rgba(0,0,0,.35)'; x.shadowBlur = 40; x.shadowOffsetY = 14; x.fillStyle = '#fbfaf6'; x.fillRect(fx0, cy0, fw, fh); x.shadowBlur = 0; x.shadowOffsetY = 0;
    drawCover(fx0 + pad, cy0 + pad); x.fillStyle = '#3a3330'; x.font = '700 ' + Math.round(54 * CS) + 'px Caveat, cursive'; x.fillText(rtWrap(x, e.title, fw - 60, 1)[0] || '', W / 2, cy0 + pad + ch + 82); x.restore(); y = cy0 + fh + (post ? 60 : 84); }
  else if (LY === 'diario') { x.save(); x.translate(W / 2, cy0 + ch / 2); x.rotate(0.03); x.translate(-W / 2, -(cy0 + ch / 2)); x.shadowColor = 'rgba(60,40,20,.3)'; x.shadowBlur = 24; x.shadowOffsetY = 8; x.fillStyle = '#fff'; x.fillRect(cx, cy0, cw, ch); x.shadowBlur = 0; x.shadowOffsetY = 0; drawCover(cx, cy0);
    const tape = (tx, ty, rot) => { x.save(); x.translate(tx, ty); x.rotate(rot); x.fillStyle = 'rgba(214,170,120,.72)'; x.fillRect(-80, -24, 160, 48); x.fillStyle = 'rgba(255,255,255,.25)'; for (let k = -80; k < 80; k += 22) x.fillRect(k, -24, 9, 48); x.restore(); };
    tape(cx + 10, cy0 + 10, -0.7); tape(cx + cw - 10, cy0 + 10, 0.7); x.restore(); y = cy0 + ch + (post ? 70 : 100); }
  else { if (LY === 'minimal') { x.save(); x.shadowColor = 'rgba(0,0,0,.3)'; x.shadowBlur = 30; x.shadowOffsetY = 12; x.fillStyle = '#000'; x.fillRect(cx, cy0, cw, ch); x.restore(); }
    else { x.save(); x.shadowColor = O.show.nota && D.paws ? mg : 'rgba(0,0,0,.5)'; x.shadowBlur = 60; x.fillStyle = mg; x.fillRect(cx - 8, cy0 - 8, cw + 16, ch + 16); x.restore(); }
    drawCover(cx, cy0); y = cy0 + ch + (post ? 70 : 100); }
  // título e autora (no Polaroid, o título já vai escrito na moldura)
  if (LY !== 'polaroid') { x.fillStyle = T.ink; if (LY === 'minimal') { x.font = SANS(900, Math.round((post ? 44 : 52) * K)); } else x.font = DISP(true, post ? 54 : 66); rtWrap(x, e.title, W - 160, 2).forEach((l) => { x.fillText(l, W / 2, y); y += Math.round((post ? 62 : 76) * K); }); }
  x.fillStyle = T.sub; x.font = SANS(800, 32); if (e.author) { x.fillText(e.author, W / 2, y); y += post ? 56 : 66; }
  if (O.show.nota && D.paws) { const sz = (post ? 50 : 60) * (LY === 'minimal' ? 0.75 : 1), gap = 14, x0 = (W - (sz * 5 + gap * 4)) / 2, cy = y - 8;
    const star = (cx, cy, r) => { x.beginPath(); for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? r * 0.45 : r; x.lineTo(cx + rr * Math.cos(a), cy + rr * Math.sin(a)); } x.closePath(); };
    for (let k = 0; k < 5; k++) { const cx = x0 + k * (sz + gap) + sz / 2, fill = Math.max(0, Math.min(1, D.paws - k));
      star(cx, cy, sz / 2); x.fillStyle = T.dark ? 'rgba(255,255,255,.22)' : 'rgba(42,33,24,.15)'; x.fill();
      if (fill > 0) { x.save(); star(cx, cy, sz / 2); x.clip(); x.fillStyle = LY === 'diario' ? T.acc : '#f5b82e'; x.fillRect(cx - sz / 2, cy - sz / 2, sz * fill, sz); x.restore(); } }
    y += post ? 56 : 74; }
  const line = String(O.line || '').trim(); if (line) { x.fillStyle = T.ink; x.font = DISP(true, post ? 46 : 54); rtWrap(x, line, W - 180, 2).forEach((l) => { x.fillText(l, W / 2, y); y += Math.round((post ? 50 : 58) * K); }); y += 16; }
  const box = (bx, by, bw, bh) => { x.fillStyle = T.box; x.beginPath(); x.roundRect(bx, by, bw, bh, 26); x.fill(); };
  const it3 = D.days ? [[D.days, D.days === 1 ? 'dia' : 'dias'], [D.pages, 'páginas'], D.meta ? [D.meta.hit + '/' + D.meta.n, 'metas do dia'] : [D.perDay, 'pág. por dia']] : [[D.pages, 'páginas'], [D.fim ? D.fim.slice(8, 10) + '/' + D.fim.slice(5, 7) + '/' + D.fim.slice(0, 4) : '—', 'terminou em']];
  if (O.show.nums && LY === 'classico') { const bw = 270, gap = 24, x0 = (W - (bw * 3 + gap * 2)) / 2;
    it3.forEach(([n, l], i) => { box(x0 + i * (bw + gap), y, bw, 130); x.fillStyle = T.acc; x.font = SANS(900, 52); x.fillText(String(n), x0 + i * (bw + gap) + bw / 2, y + 66); x.fillStyle = T.sub; x.font = SANS(700, 26); x.fillText(l, x0 + i * (bw + gap) + bw / 2, y + 106); }); y += post ? 160 : 180; }
  else if (O.show.nums) { x.fillStyle = T.sub; x.font = LY === 'diario' ? '700 40px Caveat, cursive' : SANS(800, 30); if (LY === 'minimal') x.letterSpacing = '3px'; x.fillText(it3.map(([n, l]) => n + ' ' + l).join('   ·   '), W / 2, y + 10); x.letterSpacing = '0px'; y += post ? 70 : 84; }
  if (O.show.rota && D.pts.length > 1 && !post && LY !== 'polaroid') { const P = D.pts, max = Math.max(1, P[P.length - 1].acc), maxP = Math.max(1, ...P.map((p) => p.p)), w = 760, h = LY === 'minimal' ? 140 : 200, ox = (W - w) / 2;
    const xy = P.map((p, i) => [ox + w * (i / (P.length - 1)), y + h - h * (p.acc / max)]); x.strokeStyle = T.dark ? 'rgba(255,255,255,.55)' : 'rgba(120,80,50,.5)'; x.lineWidth = LY === 'minimal' ? 2 : 4; x.lineJoin = 'round'; x.beginPath(); xy.forEach((p, i) => (i ? x.lineTo(...p) : x.moveTo(...p))); x.stroke();
    xy.forEach((p, i) => { x.fillStyle = P[i].ok ? '#f2c94c' : T.acc; x.shadowColor = P[i].ok ? '#f2c94c' : 'transparent'; x.shadowBlur = P[i].ok ? 20 : 0; x.beginPath(); x.arc(p[0], p[1], (LY === 'minimal' ? 4 : 7) + (LY === 'minimal' ? 5 : 11) * (P[i].p / maxP), 0, 7); x.fill(); }); x.shadowBlur = 0; y += h + 70; }
  const feel = (O.feel || []).map((k) => (QT_FEELS.find((q) => q[0] === k) || [, k])[1]);
  if (O.show.emo && feel.length) { x.font = SANS(800, 30); const ws = feel.map((n) => x.measureText(n).width + 50), tot = ws.reduce((a, b) => a + b, 0) + 16 * (ws.length - 1); let ex = (W - tot) / 2;
    feel.forEach((n, i) => { x.fillStyle = T.box; x.beginPath(); x.roundRect(ex, y - 40, ws[i], 58, 29); x.fill(); x.fillStyle = T.ink; x.textAlign = 'left'; x.fillText(n, ex + 25, y); ex += ws[i] + 16; }); x.textAlign = 'center'; y += 76; }
  const fav = String(O.fav || '').trim(), hate = String(O.hate || '').trim();
  if (O.show.pers && (fav || hate)) { x.font = SANS(800, 30); x.fillStyle = T.sub; if (fav) { x.fillText('Personagem favorito: ' + fav, W / 2, y); y += 46; } if (hate) { x.fillText('Amei odiar: ' + hate, W / 2, y); y += 46; } y += 20; }
  const qt = String(O.qt || '').trim();
  if (O.show.trecho && qt) { x.fillStyle = T.ink; x.font = DISP(true, post ? 36 : 42); const L = rtWrap(x, O.qq === false ? qt : '“' + qt + '”', W - 200, post ? 4 : 6); L.forEach((l) => { x.fillText(l, W / 2, y); y += Math.round((post ? 48 : 56) * K); }); }
  // composição: fundo e conteúdo (encolhe se não couber)
  const F = document.createElement('canvas'); F.width = W; F.height = H; const fx = F.getContext('2d'); bgPaint(fx);
  { const room = H - 190, ch2 = Math.min(c.height, Math.ceil(y + 30)); if (y > room) { const k = room / y; fx.drawImage(c, 0, 0, W, ch2, (W - W * k) / 2, 10, W * k, ch2 * k); } else fx.drawImage(c, 0, 0, W, ch2, 0, Math.round((room - y) / 2), W, ch2); }
  // a marca fica no rodapé, centralizada; não dá para trocar nem tirar
  const lg = RT_LOGO[T.dark ? 'escuro' : 'claro']; if (lg && lg.complete && lg.naturalWidth) { const lh = 92, lw = lh * lg.naturalWidth / lg.naturalHeight; fx.drawImage(lg, (W - lw) / 2, H - lh - 46, lw, lh); }
  else { fx.textAlign = 'center'; fx.fillStyle = T.sub; fx.font = 'italic 700 40px Georgia, serif'; fx.fillText('Livroverso', W / 2, H - 66); }
  return F;
}
function openRetro(e, auto, opt) {
  if (!e) return; TR.querySelector('.rt')?.remove();
  const D = retroData(e), slides = retroSlides(D), N = slides.length + 1; let i = 0;
  const hl0 = D.q ? [D.q.t, true] : D.texto ? [D.texto, false] : (() => { const c = (e.diary || []).filter((d) => d && d.text).pop(); return c ? [c.text, true] : ['', true]; })();
  const O = { theme: e.cover ? 'blur' : 'noite', layout: 'classico', csize: 1, fmt: 'story', head: 'Leitura concluída', line: '', size: 1, font: null, qt: hl0[0], qq: hl0[1], fav: D.fav || '', hate: D.hate || '', feel: D.emo.slice(0, 3).map((m) => m.k), upCover: null,
    show: { user: true, nota: true, nums: true, rota: true, trecho: !!hl0[0], emo: D.emo.length > 0, pers: !!(D.fav || D.hate) } };
  const rt = document.createElement('div'); rt.className = 'rt'; rt.innerHTML = '<div class="rt-ph"><div class="rt-sky">' + Array.from({ length: 46 }, () => '<i style="left:' + (Math.random() * 100).toFixed(1) + '%;top:' + (Math.random() * 100).toFixed(1) + '%;animation-delay:' + (Math.random() * 3).toFixed(2) + 's;' + (Math.random() < 0.2 ? 'width:3px;height:3px' : '') + '"></i>').join('') + '</div><div class="rt-bars">' + Array.from({ length: N }, () => '<i><b></b></i>').join('') + '</div><button type="button" class="rt-x" aria-label="Fechar">×</button><div class="rt-st"></div></div>';
  TR.append(rt); const ph = rt.querySelector('.rt-ph'), stage = rt.querySelector('.rt-st');
  const close = () => { rt.remove(); };
  let cover = null, coverP = rtLoadCover(e).then((im) => (cover = im));
  const count = () => stage.querySelectorAll('[data-n]').forEach((b) => { const n = Number(b.dataset.n) || 0, t0 = performance.now(); const f = (t) => { const k = Math.min(1, (t - t0) / 1100); b.textContent = Math.round(n * (1 - Math.pow(1 - k, 3))).toLocaleString('pt-BR'); if (k < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); });
  const editor = () => {
    const TH = Object.entries(RT_THEMES).filter(([k]) => k !== 'blur' || e.cover);
    const sw = (k, t) => (k === 'blur' ? 'url(&quot;' + esc(String(e.cover)) + '&quot;) center/cover' : k === 'capa' ? 'linear-gradient(#8a2a2a,#121212)' : t.sw || 'linear-gradient(' + t.bg[0] + ',' + t.bg[1] + ')');
    const cut = (t, n) => (t.length > n ? t.slice(0, n) + '…' : t);
    const HL = [['', 'Nenhum', '', true], ...(e.quotes || []).filter((q) => q && q.t).slice().reverse().map((q, i) => ['q' + i, 'Trecho: ' + cut(q.t, 46), q.t, true]),
      ...(D.texto ? [['rv', 'Sua resenha', D.texto, false]] : []), ...(e.diary || []).filter((d) => d && d.text).slice().reverse().map((d, i) => ['c' + i, 'Comentário: ' + cut(d.text, 42), d.text, true])];
    stage.innerHTML = '<div class="rt-ed"><button type="button" class="rt-x" aria-label="Fechar">×</button><h3>Montar para postar</h3><img class="rt-pv" alt="Prévia da imagem">'
      + '<div class="rt-tabs"><button type="button" data-tab="tema" class="on">Modelo</button><button type="button" data-tab="texto">Texto</button><button type="button" data-tab="cont">Conteúdo</button></div>'
      + '<div class="rt-pane" data-p="tema"><h4>Modelo</h4><div class="rt-ch" data-g="layout">' + Object.entries(RT_LAYOUTS).map(([k, n]) => '<button type="button" data-v="' + k + '">' + n + '</button>').join('') + '</div>'
      + '<h4>Tema <span class="rt-dnote">(o Diário usa papel)</span></h4><div class="rt-ths">' + TH.map(([k, t]) => '<button type="button" data-th="' + k + '"><i style="background:' + sw(k, t) + '"></i><span>' + esc(t.name) + '</span></button>').join('') + '</div>'
      + '<h4>Tamanho da capa</h4><div class="rt-ch" data-g="csize"><button type="button" data-v="0.75">Pequena</button><button type="button" data-v="1">Média</button><button type="button" data-v="1.2">Grande</button></div>'
      + '<h4>Imagem da capa</h4><p class="rt-cvmsg"></p><div class="rt-ch"><button type="button" class="rt-up">Enviar uma foto da capa</button><button type="button" class="rt-reset" hidden>Voltar à capa do livro</button></div><input type="file" accept="image/*" class="rt-file" hidden></div>'
      + '<div class="rt-pane" data-p="texto" hidden><h4>Fonte</h4><div class="rt-ch" data-g="font">' + Object.entries(RT_FONTS).map(([k, f]) => '<button type="button" data-v="' + k + '" style="font-family:' + esc(f.fam) + ';font-weight:' + f.w + '">' + esc(f.name) + '</button>').join('') + '</div>'
      + '<h4>Tamanho do texto</h4><div class="rt-ch" data-g="size"><button type="button" data-v="0.85">Pequeno</button><button type="button" data-v="1">Médio</button><button type="button" data-v="1.15">Grande</button></div>'
      + '<h4>Título</h4><input class="rt-in" data-k="head" maxlength="40" value="Leitura concluída">'
      + '<h4>Sua frase <span>(opcional)</span></h4><input class="rt-in" data-k="line" maxlength="80" placeholder="Ex.: ' + esc(RT_FR[D.paws] || 'Que livro!') + '">'
      + '<h4>Texto em destaque</h4><select class="rt-in rt-hl">' + HL.map(([k, n]) => '<option value="' + k + '">' + esc(n) + '</option>').join('') + '</select><textarea class="rt-in" data-k="qt" maxlength="400" rows="3" placeholder="Escolha acima ou escreva aqui" style="margin-top:.4rem"></textarea>'
      + '<h4>Personagens</h4><div class="rt-2"><input class="rt-in" data-k="fav" maxlength="60" placeholder="Favorito"><input class="rt-in" data-k="hate" maxlength="60" placeholder="Que amei odiar"></div>'
      + '<p class="rt-note">A marca Livroverso fica sempre no rodapé.</p></div>'
      + '<div class="rt-pane" data-p="cont" hidden><h4>Formato</h4><div class="rt-ch" data-g="fmt"><button type="button" data-v="story">Story</button><button type="button" data-v="post">Post</button></div><h4>Mostrar</h4><div class="rt-ch" data-g="show">'
      + [['user', 'Seu @', 1], ['nota', 'Nota', D.paws], ['nums', 'Números', 1], ['rota', 'Ritmo', D.pts.length > 1], ['trecho', 'Texto em destaque', 1], ['emo', 'Sentimentos', 1], ['pers', 'Personagens', 1]].filter((z) => z[2]).map(([k, n]) => '<button type="button" data-v="' + k + '">' + n + '</button>').join('')
      + '</div><h4>Sentimentos <span>(até 3)</span></h4><div class="rt-ch" data-g="feel">' + QT_PICK.map(([k, n]) => '<button type="button" data-v="' + k + '">' + esc(n) + '</button>').join('') + '</div></div>'
      + '</div><div class="rt-ac"><button type="button" data-a="save">Salvar imagem</button><button type="button" class="p" data-a="share">Compartilhar</button></div>';
    const ed = stage.querySelector('.rt-ed'), pv = ed.querySelector('.rt-pv'); let cur = null, seq = 0;
    // valores iniciais dos campos
    ed.querySelectorAll('.rt-in[data-k]').forEach((i) => { if (O[i.dataset.k] != null) i.value = O[i.dataset.k]; });
    { const hs = ed.querySelector('.rt-hl'), m = HL.find((h) => h[2] && h[2] === O.qt); hs.value = m ? m[0] : ''; }
    const on = (sel, f) => ed.querySelectorAll(sel).forEach((b) => b.classList.toggle('on', !!f(b)));
    const sync = () => {
      on('[data-th]', (b) => b.dataset.th === O.theme); on('[data-g=layout] button', (b) => b.dataset.v === O.layout); on('[data-g=csize] button', (b) => Number(b.dataset.v) === O.csize);
      on('[data-g=font] button', (b) => b.dataset.v === (O.font || (O.layout === 'diario' ? 'manuscrita' : RT_THEMES[O.theme].font))); on('[data-g=size] button', (b) => Number(b.dataset.v) === (O.size || 1));
      on('[data-g=fmt] button', (b) => b.dataset.v === O.fmt); on('[data-g=show] button', (b) => !!O.show[b.dataset.v]); on('[data-g=feel] button', (b) => O.feel.includes(b.dataset.v));
      ed.querySelector('.rt-ths').style.opacity = O.layout === 'diario' ? '.45' : ''; ed.querySelector('.rt-dnote').hidden = O.layout !== 'diario';
      ed.querySelector('.rt-cvmsg').textContent = O.upCover ? 'Usando a foto que você enviou.' : cover ? 'Usando a capa do livro.' : 'A capa deste livro não pôde ser usada na imagem. Envie uma foto da capa (ou um print) para ela aparecer.';
      ed.querySelector('.rt-reset').hidden = !O.upCover; };
    const paint = async () => { const my = ++seq; sync(); await coverP; await rtFontsReady(O.font || (O.layout === 'diario' ? 'manuscrita' : RT_THEMES[O.theme].font)); if (my !== seq) return; cur = rtDraw(D, O, O.upCover || cover); pv.src = cur.toDataURL('image/jpeg', 0.8); sync(); };
    ed.querySelectorAll('.rt-tabs button').forEach((b) => b.addEventListener('click', () => { ed.querySelectorAll('.rt-tabs button').forEach((x) => x.classList.toggle('on', x === b)); ed.querySelectorAll('.rt-pane').forEach((p) => { p.hidden = p.dataset.p !== b.dataset.tab; }); }));
    ed.querySelectorAll('[data-th]').forEach((b) => b.addEventListener('click', () => { O.theme = b.dataset.th; O.font = null; if (O.layout === 'diario') O.layout = 'classico'; paint(); }));
    ed.querySelectorAll('[data-g=layout] button').forEach((b) => b.addEventListener('click', () => { O.layout = b.dataset.v; O.font = null; paint(); }));
    ed.querySelectorAll('[data-g=csize] button').forEach((b) => b.addEventListener('click', () => { O.csize = Number(b.dataset.v); paint(); }));
    ed.querySelectorAll('[data-g=font] button').forEach((b) => b.addEventListener('click', () => { O.font = b.dataset.v; paint(); }));
    ed.querySelectorAll('[data-g=size] button').forEach((b) => b.addEventListener('click', () => { O.size = Number(b.dataset.v); paint(); }));
    ed.querySelectorAll('[data-g=fmt] button').forEach((b) => b.addEventListener('click', () => { O.fmt = b.dataset.v; paint(); }));
    ed.querySelectorAll('[data-g=show] button').forEach((b) => b.addEventListener('click', () => { const k = b.dataset.v; O.show[k] = !O.show[k]; paint(); }));
    ed.querySelectorAll('[data-g=feel] button').forEach((b) => b.addEventListener('click', () => { const k = b.dataset.v; if (O.feel.includes(k)) O.feel = O.feel.filter((y) => y !== k); else if (O.feel.length < 3) O.feel = [...O.feel, k]; else return toast('Até 3 sentimentos'); O.show.emo = O.feel.length > 0; paint(); }));
    ed.querySelector('.rt-hl').addEventListener('change', (ev) => { const h = HL.find((z) => z[0] === ev.target.value) || HL[0]; O.qt = h[2]; O.qq = h[3]; ed.querySelector('[data-k=qt]').value = h[2]; O.show.trecho = !!h[2]; paint(); });
    // personagens escritos aqui também ficam guardados no livro (aparecem na retrospectiva e na avaliação)
    { let tm = 0; ed.querySelectorAll('.rt-in[data-k]').forEach((i) => i.addEventListener('input', () => { const k = i.dataset.k; O[k] = i.value;
      if (k === 'qt') O.show.trecho = !!i.value.trim(); if (k === 'fav' || k === 'hate') { O.show.pers = !!(O.fav || O.hate); const fin = { ...(e.fin || {}) }; const v = i.value.trim(); if (v) fin[k] = v; else delete fin[k]; e.fin = fin; save(); }
      clearTimeout(tm); tm = setTimeout(paint, 250); })); }
    const file = ed.querySelector('.rt-file'); ed.querySelector('.rt-up').addEventListener('click', () => file.click());
    file.addEventListener('change', async () => { const f = file.files && file.files[0]; if (!f) return; const im = await rtImgFile(f); file.value = ''; if (!im) return toast('Não consegui abrir essa imagem'); O.upCover = im; paint(); });
    ed.querySelector('.rt-reset').addEventListener('click', () => { O.upCover = null; paint(); });
    ed.querySelector('.rt-x').addEventListener('click', close);
    const blob = () => new Promise((res) => cur.toBlob((b) => res(b), 'image/png'));
    const name = 'livroverso-' + normT(e.title).replace(/\s+/g, '-').slice(0, 40) + '.png';
    const dl = async () => { const b = await blob(); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name; document.body.append(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500); toast('Imagem salva'); };
    stage.parentElement.querySelector('.rt-ac [data-a=save]').addEventListener('click', dl);
    stage.parentElement.querySelector('.rt-ac [data-a=share]').addEventListener('click', async () => { try { const b = await blob(), f = new File([b], name, { type: 'image/png' }); if (navigator.canShare && navigator.canShare({ files: [f] })) await navigator.share({ files: [f], title: e.title }); else await dl(); } catch (err) { if (err && err.name !== 'AbortError') dl(); } });
    paint();
  };
  const go = (k) => { i = Math.max(0, Math.min(N - 1, k)); rt.querySelectorAll('.rt-bars i').forEach((b, j) => { b.className = j < i ? 'f' : j === i ? 'c' : ''; });
    if (i === N - 1) return editor(); stage.innerHTML = slides[i]; count(); };
  rt.querySelector('.rt-x').addEventListener('click', close);
  ph.addEventListener('click', (ev) => { if (i === N - 1 || ev.target.closest('.rt-x, .rt-ed, .rt-ac')) return; const r = ph.getBoundingClientRect(); go(ev.clientX - r.left < r.width * 0.3 ? i - 1 : i + 1); });
  go(opt && opt.edit ? N - 1 : 0);
}
// no Histórico do diário: "Leitura concluída" no topo, com o botão da retrospectiva
TR.addEventListener('click', (ev) => { const b = ev.target.closest && ev.target.closest('.cs-retro'); if (!b) return; ev.stopPropagation(); const e = byId(b.dataset.id) || S.tlE; if (e) openRetro(e); }, true);
// sem páginas registradas dia a dia (livro marcado como lido direto): calendário do período, do primeiro ao último dia
function rtCalSVG(D, w, anim) {
  if (!D.ini || !D.fim) return '';
  const DAY = 864e5, t0 = Date.parse(D.ini + 'T12:00:00Z'), n = Math.min(63, Math.max(1, D.days)), first = new Date(t0).getUTCDay();
  const cols = 7, cell = Math.floor((w - 16) / cols), rows = Math.ceil((first + n) / cols), h = 40 + rows * cell + 10;
  const WD = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  let s = '<svg class="rt-rt rt-cal" viewBox="0 0 ' + w + ' ' + h + '">' + WD.map((d, i) => '<text x="' + (8 + i * cell + cell / 2) + '" y="22" text-anchor="middle" fill="#cfc4ff" font-size="12" font-weight="900">' + d + '</text>').join('');
  for (let k = 0; k < n; k++) { const pos = first + k, cx = 8 + (pos % cols) * cell + cell / 2, cy = 40 + Math.floor(pos / cols) * cell + cell / 2, d = new Date(t0 + k * DAY), end = k === 0 || k === n - 1;
    s += '<g class="' + (anim ? 'pt' : '') + '" style="animation-delay:' + (0.15 + 1.4 * k / n).toFixed(2) + 's;transform-origin:' + cx + 'px ' + cy + 'px"><circle cx="' + cx + '" cy="' + cy + '" r="' + (cell / 2 - 5) + '" fill="' + (end ? '#f2c94c' : '#b69cff') + '" fill-opacity="' + (end ? 1 : 0.35) + '"' + (end ? ' filter="drop-shadow(0 0 6px #f2c94c)"' : '') + '/>'
      + '<text x="' + cx + '" y="' + (cy + 5) + '" text-anchor="middle" fill="' + (end ? '#2a1a00' : '#fff') + '" font-size="14" font-weight="900">' + d.getUTCDate() + '</text></g>'; }
  return s + '</svg><p class="rt-calnote">Registre as páginas durante a leitura e aqui aparece o seu ritmo dia a dia.</p>';
}
