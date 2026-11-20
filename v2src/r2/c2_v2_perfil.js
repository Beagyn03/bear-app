// v2 Perfil refeito (Bia, 19/11, branch livroverso-2).
//  Seu perfil: foto com anel colorido, nome, @ · lendo, frase em serifa; números (lidos, na fila, amizades, meta) que abrem as listas;
//  Editar perfil | Compartilhar | •••; "Seu DNA literário" (gêneros dos lidos); Top 5 em leque. O cabeçalho e a grade de números
//  antigos ficam escondidos (os botões deles continuam funcionando por trás: foto, Ajustes, •••); páginas, nota e resenhas
//  continuam em Estatísticas ("Ver estatísticas").
//  Perfil de amizade: cartão "Vocês combinam N%" (livros em comum + gêneros parecidos), os livros em comum e o DNA lado a lado.
//  O DNA da amizade vem do resumo publicado (shelf.stats.dna), que passa a levar os gêneros (só porcentagens, sem títulos).
//  19/11 (Bia: "a barra ficou cópia do outro app"): a barra do DNA saiu. No lugar, "Seu jeito de ler": um título de
//  personalidade pelos gêneros (sem gênero gramatical), uma linha explicando, até 3 traços tirados dos dados reais
//  (tamanho dos livros, hora das sessões, notas, trechos, formato, abandonos, ritmo, autor, releituras, órbita), os gêneros
//  como selos e "Compartilhar" (imagem 1080×1350, só texto). No perfil de amizade: o jeito de ler dela/dele e
//  "Vocês combinam em: …" dentro do cartão de afinidade.
const V2DNA_CO = ['#7e63c9', '#b8442a', '#e45f9b', '#2e8b57', '#c9b79f'];
function v2Genre(e) { const g = e.genre || (e.meta && (e.meta.cat || e.meta.genre)) || ''; return String(g).split(/[\/,;›>]/)[0].trim(); }
function v2DnaOf(list) {
  const c = new Map(); list.forEach((e) => { const g = v2Genre(e); if (g) c.set(g, (c.get(g) || 0) + 1); });
  const tot = [...c.values()].reduce((a, b) => a + b, 0); if (tot < 2) return null;
  const top = [...c.entries()].sort((a, b) => b[1] - a[1]); const main = top.slice(0, 4), rest = top.slice(4).reduce((a, x) => a + x[1], 0);
  const out = main.map(([g, n]) => [g, Math.round(n / tot * 100)]); if (rest) out.push(['Outros', Math.round(rest / tot * 100)]);
  return { n: tot, parts: out };
}
{ const _ms = myStatsSnap; myStatsSnap = function () { const r = _ms.apply(this, arguments); try { const d = v2DnaOf(lib().filter((e) => e.status === 'LIDO')); if (d) r.dna = d.parts; } catch {} return r; }; }
const v2DnaBar = (parts, cmap) => `<div class="bar2">${parts.map(([g, p]) => `<i style="width:${p}%;background:${cmap(g)}" title="${esc(g)} ${p}%"></i>`).join('')}</div>`;
{ const st = document.createElement('style'); st.textContent = `
#shelflist.v2pf .yo-top .yo-av{outline:3px solid #e0ad3a;outline-offset:3px}
#shelflist.v2pf .yo-top .yo-id b{font-family:var(--v2-disp);font-size:1.35rem}
#shelflist.v2pf .yo-nums > .v2-zero{display:none!important}
#shelflist.v2pf .yo-top.v2-old,#shelflist.v2pf .yo-nums.v2-old{display:none!important}
.v2pv{padding:.4rem .1rem 0;margin-bottom:.4rem}
.v2pv .top{display:flex;align-items:center;gap:.85rem}
.v2pv .avx{width:78px;height:78px;border-radius:50%;padding:3px;border:0;background:conic-gradient(#e0ad3a,#ff8fc8,#7e63c9,#6fd3ff,#e0ad3a);flex:none;cursor:pointer}
.v2pv .avx span{display:grid;place-items:center;width:100%;height:100%;border-radius:50%;border:3px solid var(--bg,#fbf6ee);background:#c46f2e center/cover no-repeat;color:#fff;font-size:1.8rem;font-weight:900}
.v2pv .nm{flex:1;min-width:0}.v2pv .nm h2{margin:0;font-family:var(--v2-disp);font-size:1.5rem;line-height:1.1;color:var(--ink)}
.v2pv .nm small{display:block;margin-top:.2rem;font-size:.8rem;color:var(--ink-2);font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.v2pv q{display:block;margin:.8rem 0 0;font-family:var(--v2-disp);font-style:italic;font-size:1rem;line-height:1.4;color:var(--ink);quotes:"“" "”"}
.v2pv .nums{display:flex;flex-wrap:wrap;gap:.3rem 1.1rem;margin-top:.85rem}
.v2pv .nums button{border:0;background:none;padding:0;font:inherit;color:var(--ink);text-align:left;cursor:pointer}
.v2pv .nums b{font-size:1.1rem;font-variant-numeric:tabular-nums}.v2pv .nums small{margin-left:.25rem;font-size:.78rem;color:var(--ink-2);font-weight:800}
.v2pv .nums .lk{color:var(--acc);font-size:.78rem;font-weight:900}
.v2pv .acts{display:flex;gap:.5rem;margin-top:.9rem}
.v2pv .acts button{flex:1;display:flex;justify-content:center;align-items:center;gap:.4rem;height:44px;border-radius:14px;border:1.5px solid var(--line);background:var(--panel);font:inherit;font-weight:900;font-size:.86rem;color:var(--ink)}
.v2pv .acts .p{background:var(--acc);border-color:var(--acc);color:var(--on-acc,#fff)}
.v2pv .acts .sq{flex:0 0 44px}
.v2pv .acts svg{width:18px;height:18px}
.v2jl{position:relative;overflow:hidden;margin:1rem 0 .4rem;padding:1rem 1rem .95rem;border:1px solid var(--line);border-radius:var(--v2-r);box-shadow:var(--v2-sh);
  background:radial-gradient(120% 90% at 100% 0,color-mix(in srgb,#7e63c9 22%,transparent),transparent 60%),linear-gradient(160deg,color-mix(in srgb,var(--acc) 12%,var(--panel)),var(--panel) 70%)}
.v2jl::after{content:"✦";position:absolute;right:.9rem;top:.6rem;font-size:1.1rem;color:#e0ad3a;opacity:.85}
.v2jl .ey{font-size:.66rem;font-weight:900;letter-spacing:.12em;color:var(--acc)}
.v2jl h3{margin:.3rem 2rem 0 0;font-family:var(--v2-disp);font-size:1.55rem;line-height:1.12;color:var(--ink)}
.v2jl .sub{margin:.35rem 0 0;font-size:.82rem;line-height:1.35;color:var(--ink-2);font-weight:700}
.v2jl ul{list-style:none;margin:.75rem 0 0;padding:0;display:grid;gap:.35rem}
.v2jl li{display:flex;align-items:center;gap:.5rem;font-size:.9rem;font-weight:800;color:var(--ink)}.v2jl li::before{content:"";width:7px;height:7px;border-radius:50%;background:#e0ad3a;box-shadow:0 0 0 3px color-mix(in srgb,#e0ad3a 25%,transparent);flex:none}
.v2jl .ft{display:flex;align-items:center;gap:.5rem;margin-top:.85rem}
.v2jl .sel{display:flex;flex-wrap:wrap;gap:.3rem;flex:1;min-width:0}.v2jl .sel span{border:1px solid var(--line);background:var(--panel);border-radius:99px;padding:.22rem .6rem;font-size:.72rem;font-weight:900;color:var(--ink-2)}
.v2jl .sh{flex:none;border:0;border-radius:99px;background:var(--acc);color:var(--on-acc,#fff);font:inherit;font-weight:900;font-size:.8rem;padding:.5rem .9rem;cursor:pointer}
.v2jl .pg{height:8px;border-radius:99px;background:var(--line);overflow:hidden;margin:.7rem 0 .3rem}.v2jl .pg i{display:block;height:100%;background:linear-gradient(90deg,var(--acc),#e0ad3a)}
.v2jl .pgt{font-size:.74rem;font-weight:900;color:var(--ink-2)}
.v2afi .cm{margin-top:.55rem;font-size:.8rem;font-weight:700;color:#e4dcff}.v2afi .cm b{color:#ffd6a3;font-family:var(--v2-disp);font-size:.95rem}
.v2afi{margin:1rem 0 .4rem;padding:.9rem;border-radius:var(--v2-r);background:linear-gradient(135deg,#2a1f4a,#4a3585);color:#fff;box-shadow:var(--v2-sh)}
.v2afi .t{display:flex;align-items:center;gap:.7rem}.v2afi .t b{font-family:var(--v2-disp);font-size:1.1rem}.v2afi .t small{display:block;color:#d9cffc;font-size:.76rem;font-weight:700;margin-top:.1rem}
.v2afi .pc{margin-left:auto;font-family:var(--v2-disp);font-size:2rem;font-weight:700;color:#ffd6a3}
.v2afi .row{display:flex;gap:.45rem;overflow-x:auto;margin-top:.7rem;padding-bottom:.2rem}.v2afi .row .v2a-cv{width:46px;height:68px;border-radius:4px;flex:none;box-shadow:0 0 0 2px rgba(255,214,163,.55)}
.v2afi .vs{display:grid;gap:.25rem;margin-top:.5rem}.v2afi .vs div{display:grid;grid-template-columns:52px 1fr;gap:.5rem;align-items:center;font-size:.72rem;font-weight:900;color:#ddd5ff}.v2afi .vs .bar2{margin:0;height:10px;background:rgba(255,255,255,.15)}
/* Top 5 em leque */
#shelflist.v2pf .t5-row{position:relative;display:block!important;height:170px;margin:.3rem 0 .8rem;overflow:visible!important}
#shelflist.v2pf .t5-row .t5-bk{position:absolute!important;bottom:0;width:88px!important;transform-origin:50% 120%;transition:transform .2s;padding:0!important}
#shelflist.v2pf .t5-row .t5-bk:hover{transform:translateY(-10px) rotate(0)!important;z-index:9}
#shelflist.v2pf .t5-row .t5-bk:nth-child(1){left:calc(50% - 44px - 128px);transform:rotate(-14deg);z-index:1}
#shelflist.v2pf .t5-row .t5-bk:nth-child(2){left:calc(50% - 44px - 66px);transform:rotate(-7deg);z-index:2}
#shelflist.v2pf .t5-row .t5-bk:nth-child(3){left:calc(50% - 44px);transform:translateY(-6px);z-index:3}
#shelflist.v2pf .t5-row .t5-bk:nth-child(4){left:calc(50% - 44px + 66px);transform:rotate(7deg);z-index:2}
#shelflist.v2pf .t5-row .t5-bk:nth-child(5){left:calc(50% - 44px + 128px);transform:rotate(14deg);z-index:1}
#shelflist.v2pf .t5-row .t5-bk em{position:absolute;left:-6px;top:-8px;z-index:2;width:22px;height:22px;border-radius:50%;background:var(--ink);color:var(--bg,#fff);font-style:normal;font-size:.7rem;font-weight:900;display:grid;place-items:center;border:2px solid var(--bg,#fff)}
#shelflist.v2pf .t5-row .t5-bk small,#shelflist.v2pf .t5-row .t5-bk b{display:none!important}
`; TR.append(st); }
function v2pvOwnHTML(d, v) {
  const L = lib(), lidos = L.filter((e) => e.status === 'LIDO').length, fila = L.filter((e) => e.status === 'QUERO').length;
  const fr = ((typeof SOC !== 'undefined' && SOC.fr && SOC.fr.friends) || []).length, y = todayISO().slice(0, 4), goal = Number((db.yearGoals || {})[y]) || 0;
  const feitos = L.filter((e) => e.status === 'LIDO' && String(e.finishedAt || '').startsWith(y)).length;
  const old = v.querySelector('.yo-av'), photo = old && old.style.backgroundImage, name = d.displayName || NAME || '', R = reading();
  const bio = d.bio || (typeof socialProfile !== 'undefined' && socialProfile && socialProfile.bio) || '';
  return `<section class="v2pv"><div class="top"><button type="button" class="avx" data-p="photo" aria-label="Trocar foto"><span style="${photo ? 'background-image:' + esc(photo) : ''}">${photo ? '' : esc(initial(name))}</span></button>
    <div class="nm"><h2>${esc(name)}</h2><small>@${esc(d.handle || '')}${R ? ' · lendo ' + esc(R.e.title) : ''}</small></div></div>
    ${bio ? `<q>${esc(bio)}</q>` : ''}
    <div class="nums"><button type="button" data-p="lidos"><b>${lidos}</b><small>lidos</small></button><button type="button" data-p="fila"><b>${fila}</b><small>na fila</small></button>${fr ? `<button type="button" data-p="amigos"><b>${fr}</b><small>${fr === 1 ? 'amizade' : 'amizades'}</small></button>` : ''}${goal ? `<button type="button" data-p="meta"><b>${feitos}/${goal}</b><small>meta</small></button>` : ''}<button type="button" data-p="stats" class="lk">Ver estatísticas ›</button></div>
    <div class="acts"><button type="button" data-p="edit">Editar perfil</button><button type="button" class="p" data-p="share">Compartilhar</button><button type="button" class="sq" data-p="more" aria-label="Mais opções do perfil">${V2SVG('dots', 18)}</button></div></section>`;
}
function v2pvBind(h, v, d) {
  h.addEventListener('click', (ev) => { const b = ev.target.closest('[data-p]'); if (!b) return; const k = b.dataset.p;
    const numBtn = (re) => [...v.querySelectorAll('.yo-nums > *')].find((x) => re.test(x.textContent));
    if (k === 'photo') { const p = v.querySelector('#yo-photo'); return p ? p.click() : (v.hidden = true, S.ajMode = 'perfil', goTab('perfil')); }
    if (k === 'lidos') { const n = numBtn(/lidos/); return n ? n.click() : goTab('estante'); }
    if (k === 'fila') { const n = numBtn(/quero ler/); return n ? n.click() : goTab('estante'); }
    if (k === 'amigos') return openFriendsV3();
    if (k === 'meta') { try { return openGoalsV4(); } catch { return goTab('progresso'); } }
    if (k === 'stats') return goTab('progresso');
    if (k === 'edit') { v.hidden = true; S.ajMode = 'perfil'; return goTab('perfil'); }
    if (k === 'share') { const url = location.origin + location.pathname, text = `Me encontre no Livroverso: @${d.handle}`;
      if (navigator.share) return navigator.share({ title: 'Livroverso', text, url }).catch(() => {});
      try { navigator.clipboard.writeText(text + ' ' + url); toast('Link do perfil copiado'); } catch { toast(text); } return; }
    if (k === 'more') return popMenu(b, [
      { label: 'Ajustes', sub: 'tema, avisos, dados e conta', fn: () => { const a = v.querySelector('.v2-ajpill'); if (a) a.click(); else { v.hidden = true; S.ajMode = 'sistema'; goTab('perfil'); } } },
      { label: 'Organizar meu perfil', sub: 'o que aparece: leituras, estantes, conquistas e avaliações', fn: () => socialSettingsSheet('perfil') },
      { label: 'Moldura e selo', fn: () => flairSheet() },
    ]);
  });
}
// ----- Seu jeito de ler -----
// título pelo gênero principal (sem gênero gramatical); pares fortes ganham um título próprio
const V2ARQ = { 'Fantasia': 'Passaporte para outros mundos', 'Romance': 'Coração de romance', 'Suspense e mistério': 'Mente de detetive', 'Ficção científica': 'Olhos no futuro',
  'Terror': 'Coleção de arrepios', 'Jovem adulto': 'Sede de aventura', 'Clássicos': 'Olhar de clássico', 'Ficção': 'Colecionando vidas', 'Biografia': 'Gente que vira história',
  'História': 'Viagem no tempo', 'Autoajuda': 'Em construção constante', 'Poesia': 'Alma de verso', 'HQ e mangá': 'Quadro a quadro', 'Não ficção': 'Curiosidade sem fim' };
const V2ARQ2 = [[['Fantasia', 'Romance'], 'Coração de dragão'], [['Suspense e mistério', 'Terror'], 'Alma de reviravoltas'], [['Romance', 'Jovem adulto'], 'Borboletas no estômago'],
  [['Ficção científica', 'Fantasia'], 'Mapa de universos'], [['Biografia', 'História'], 'Memória viva'], [['Não ficção', 'Autoajuda'], 'Curiosidade sem fim'], [['Suspense e mistério', 'Romance'], 'Coração em suspense']];
const v2Low = (g) => String(g || '').toLowerCase();
// parts: [[gênero, %], …] do maior para o menor ("Outros"/"Outro" não contam para o título)
function v2ArqOf(parts) {
  const P = (parts || []).filter(([g]) => g && !/^outros?$/i.test(g)); if (!P.length) return null;
  const [g1, p1] = P[0], g2 = P[1] && P[1][1] >= 20 ? P[1][0] : null;
  if (p1 < 35) return { t: 'Leitura sem fronteiras', s: 'você circula entre ' + P.slice(0, 3).map(([g]) => v2Low(g)).join(', ').replace(/, ([^,]*)$/, ' e $1') + ', sem gênero dono' };
  const pair = g2 && V2ARQ2.find(([k]) => k.includes(g1) && k.includes(g2));
  const t = pair ? pair[1] : V2ARQ[g1] || 'Alma de ' + v2Low(g1);
  const s = g2 ? `${v2Low(g1)} e ${v2Low(g2)} puxam a maior parte das suas leituras` : `${v2Low(g1)} puxa ${p1}% das suas leituras`;
  return { t, s };
}
function v2GenreCounts() { const c = new Map(); lib().filter((e) => e.status === 'LIDO').forEach((e) => { const g = v2Genre(e); if (g && !/^outros?$/i.test(g)) c.set(g, (c.get(g) || 0) + 1); }); return c; }
// traços: cada um só aparece com dado por trás; ficam os 3 mais fortes
function v2Traits() {
  const L = lib(), lidos = L.filter((e) => e.status === 'LIDO'), out = [];
  const pg = lidos.map((e) => Number(e.totalPages) || 0).filter((n) => n > 20);
  if (pg.length >= 3) { const a = pg.reduce((x, y) => x + y, 0) / pg.length; if (a > 420) out.push(['prefere livros longos', 1 + (a - 420) / 100]); else if (a < 260) out.push(['gosta de livros curtos e certeiros', 1 + (260 - a) / 60]); }
  const hrs = (db.focus || []).map((f) => f && f.start && new Date(f.start)).filter((d) => d && !isNaN(d)).map((d) => d.getHours());
  if (hrs.length >= 5) { const nt = hrs.filter((h) => h >= 20 || h < 5).length / hrs.length, mn = hrs.filter((h) => h >= 5 && h < 12).length / hrs.length;
    if (nt >= 0.5) out.push(['lê mais à noite', 1 + nt]); else if (mn >= 0.5) out.push(['lê mais de manhã', 1 + mn]); }
  const notas = lidos.map((e) => e.review && Number(e.review.paws)).filter((n) => n > 0);
  if (notas.length >= 3) { const a = notas.reduce((x, y) => x + y, 0) / notas.length; if (a >= 4.3) out.push(['se apaixona fácil', 1.2 + (a - 4.3)]); else if (a <= 3.4) out.push(['exigente nas notas', 1.2 + (3.4 - a)]); }
  const nq = L.reduce((a, e) => a + (e.quotes || []).length, 0); if (nq >= 15) out.push(['coleciona trechos', 1 + nq / 50]);
  const fm = L.filter((e) => e.status === 'LIDO' || e.status === 'LENDO').map((e) => e.format).filter(Boolean);
  if (fm.length >= 4) { const eb = fm.filter((f) => f === 'EBOOK').length / fm.length, au = fm.filter((f) => f === 'AUDIO').length / fm.length;
    if (eb > 0.5) out.push(['lê mais no e-book', 0.8 + eb / 2]); else if (au > 0.5) out.push(['ouve mais do que lê', 0.9 + au / 2]); }
  const ab = L.filter((e) => e.status === 'ABANDONEI').length; if (ab >= 3 && ab >= lidos.length * 0.1) out.push(['abandona sem culpa', 1 + ab / 20]);
  const y = todayISO().slice(0, 4), noAno = lidos.filter((e) => String(e.finishedAt || '').startsWith(y)).length, meses = Math.max(1, new Date().getMonth() + 1);
  if (noAno / meses >= 3) out.push(['devora livros', 1 + noAno / meses / 5]);
  const au = new Map(); lidos.forEach((e) => { const a = String(e.author || '').split(',')[0].trim(); if (a) au.set(a, (au.get(a) || 0) + 1); });
  const ta = [...au.entries()].sort((a, b) => b[1] - a[1])[0]; if (ta && ta[1] >= 3) out.push(['fiel a ' + ta[0], 1 + ta[1] / 5]);
  if (L.some((e) => Number(e.rereading) > 0)) out.push(['relê os favoritos', 1.1]);
  try { const o = orbStats(); if (o.best >= 14) out.push([`constância de órbita: ${o.best} dias seguidos`, 1 + o.best / 60]); } catch {}
  return out.sort((a, b) => b[1] - a[1]).slice(0, 3).map((x) => x[0]);
}
function v2JeitoData() {
  const c = v2GenreCounts(), n = [...c.values()].reduce((a, b) => a + b, 0);
  if (n < 5) return { n };
  const parts = [...c.entries()].sort((a, b) => b[1] - a[1]).map(([g, k]) => [g, Math.round(k / n * 100)]);
  return { n, parts, arq: v2ArqOf(parts), traits: v2Traits() };
}
function v2JeitoHTML(J) {
  if (!J.parts) return `<section class="v2jl" data-k="v2jl-${J.n}"><div class="ey">SEU JEITO DE LER</div><p class="sub" style="font-size:.9rem;color:var(--ink)">Seu jeito de ler aparece depois de 5 livros lidos com gênero.</p><div class="pg"><i style="width:${Math.min(100, J.n * 20)}%"></i></div><div class="pgt">${J.n} de 5</div></section>`;
  const sel = J.parts.slice(0, 3).map(([g]) => `<span>${esc(g)}</span>`).join('') + (J.parts.length > 3 ? `<span>+${J.parts.length - 3}</span>` : '');
  return `<section class="v2jl"><div class="ey">SEU JEITO DE LER</div><h3>${esc(J.arq.t)}</h3><p class="sub">${esc(J.arq.s)}</p>
    ${J.traits.length ? `<ul>${J.traits.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
    <div class="ft"><div class="sel">${sel}</div><button type="button" class="sh" data-jl="share">Compartilhar</button></div></section>`;
}
// imagem para postar: 1080×1350, só texto, no roxo e dourado do app
async function v2JeitoShare(J) {
  const W = 1080, H = 1350, c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
  const gr = x.createLinearGradient(0, 0, W, H); gr.addColorStop(0, '#2a1f4a'); gr.addColorStop(.6, '#4a3585'); gr.addColorStop(1, '#7e4a8c'); x.fillStyle = gr; x.fillRect(0, 0, W, H);
  x.fillStyle = '#fff'; for (let i = 0; i < 90; i++) { x.globalAlpha = Math.random() * .6 + .2; x.fillRect(Math.random() * W, Math.random() * H, 3, 3); } x.globalAlpha = 1;
  const wrap = (txt, maxW, lh, y0, font, color, x0 = 90) => { x.font = font; x.fillStyle = color; const ws = String(txt).split(' '); let line = '', y = y0;
    ws.forEach((w) => { const t = line ? line + ' ' + w : w; if (x.measureText(t).width > maxW && line) { x.fillText(line, x0, y); line = w; y += lh; } else line = t; }); if (line) x.fillText(line, x0, y); return y + lh; };
  x.fillStyle = '#e0ad3a'; x.font = '900 34px Nunito, sans-serif'; x.fillText('MEU JEITO DE LER', 90, 200);
  let y = wrap(J.arq.t, 900, 104, 330, '700 92px Georgia, serif', '#fff');
  y = wrap(J.arq.s, 900, 52, y + 10, '700 38px Nunito, sans-serif', '#d9cffc');
  y += 40; J.traits.forEach((t) => { x.fillStyle = '#e0ad3a'; x.beginPath(); x.arc(104, y - 14, 10, 0, Math.PI * 2); x.fill(); y = wrap(t, 840, 60, y, '800 44px Nunito, sans-serif', '#fff', 136) + 10; });
  y += 30; let px = 90; x.font = '900 32px Nunito, sans-serif';
  J.parts.slice(0, 3).forEach(([g]) => { const w = x.measureText(g).width + 56; if (px + w > W - 90) return; x.fillStyle = 'rgba(255,255,255,.14)'; x.beginPath(); x.roundRect(px, y, w, 64, 32); x.fill(); x.fillStyle = '#fff'; x.fillText(g, px + 28, y + 43); px += w + 16; });
  x.fillStyle = '#ffd6a3'; x.font = '700 40px Georgia, serif'; x.fillText('Livroverso', 90, 1280);
  const blob = await new Promise((r) => c.toBlob(r, 'image/png')); if (!blob) return toast('Não consegui gerar a imagem');
  const file = new File([blob], 'livroverso-jeito-de-ler.png', { type: 'image/png' });
  try { if (navigator.canShare && navigator.canShare({ files: [file] })) return await navigator.share({ files: [file], title: 'Meu jeito de ler' }); } catch {}
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = file.name; document.body.append(a); a.click(); a.remove(); toast('Imagem salva');
}
function v2Afi(d) {
  const sh = d.shelf || {}, theirs = [...(sh.lidos || []), ...(sh.potinho || []), ...((d.reading || sh.reading) || [])];
  if (!theirs.length) return '';
  const mine = new Map(lib().filter((e) => e.status !== 'QUERO').map((e) => [normT(e.title), e]));
  const seen = new Set(), both = theirs.filter((b) => { const k = normT(b.title); if (seen.has(k) || !mine.has(k)) return false; seen.add(k); return true; });
  const myD = v2DnaOf(lib().filter((e) => e.status === 'LIDO')), thD = sh.stats && sh.stats.dna;
  let gs = 0; if (myD && thD) { const a = new Map(myD.parts), b = new Map(thD); const keys = new Set([...a.keys(), ...b.keys()]); let mn = 0, mx = 0; keys.forEach((k) => { mn += Math.min(a.get(k) || 0, b.get(k) || 0); mx += Math.max(a.get(k) || 0, b.get(k) || 0); }); gs = mx ? mn / mx : 0; }
  const uniq = new Set(theirs.map((b) => normT(b.title))).size, ts = both.length / Math.max(8, uniq);
  if (!both.length && !gs) return '';
  const pc = Math.max(5, Math.min(95, Math.round(100 * (thD && myD ? 0.6 * Math.min(1, ts * 1.4) + 0.4 * gs : Math.min(1, ts * 1.4)))));
  // jeito de ler da amizade (pelo resumo publicado) e os gêneros que as duas contas têm em comum
  const thArq = thD && v2ArqOf(thD), nome = esc((d.displayName || '').split(' ')[0] || '');
  const mineG = myD ? new Set(myD.parts.map(([g]) => g).filter((g) => !/^outros?$/i.test(g))) : new Set();
  const emComum = thD ? thD.map(([g]) => g).filter((g) => mineG.has(g)).slice(0, 3).map(v2Low) : [];
  return `<section class="v2afi"><div class="t"><span><b>Vocês combinam</b><small>${both.length ? `${both.length} ${both.length === 1 ? 'livro' : 'livros'} em comum` : 'gostos de leitura parecidos'}</small></span><span class="pc">${pc}%</span></div>
    ${both.length ? `<div class="row">${both.slice(0, 10).map((b) => cvh(b.title, b.cover, 'v2a-cv')).join('')}</div>` : ''}
    ${thArq ? `<div class="cm">Jeito de ler${nome ? ' de ' + nome : ''}: <b>${esc(thArq.t)}</b></div>` : ''}
    ${emComum.length ? `<div class="cm">Vocês combinam em: ${esc(emComum.join(', '))}</div>` : ''}</section>`;
}
{ let tm = 0;
  const put = () => { const v = $('#shelflist'); if (!v || v.hidden) return; const top = v.querySelector('.yo-top'); if (!top) { v.classList.remove('v2pf'); return; }
    let d = S.fpData; const mine = v.classList.contains('mine-page');
    if (mine && (!d || !d.self)) { const sm = top.querySelector('.yo-id small'), nm = top.querySelector('.yo-id b'); d = { self: true, handle: (typeof socialProfile !== 'undefined' && socialProfile && socialProfile.handle) || String(sm ? sm.textContent : '').replace(/^@/, '').trim(), displayName: (typeof socialProfile !== 'undefined' && socialProfile && socialProfile.displayName) || (nm ? nm.textContent.trim() : NAME) }; }
    if (!d) return;
    v.classList.add('v2pf');
    if (d.self) {
      top.classList.add('v2-old'); v.querySelector('.yo-nums')?.classList.add('v2-old');
      const html = v2pvOwnHTML(d, v), key = d.handle + '|' + html.length; let h = v.querySelector('.v2pv');
      if (!h || h.dataset.k !== key) { const w = document.createElement('div'); w.innerHTML = html; const n = w.firstElementChild; n.dataset.k = key; v2pvBind(n, v, d); if (h) h.replaceWith(n); else top.before(n); }
      const J = v2JeitoData(), jh = v2JeitoHTML(J); let x = v.querySelector('.v2jl');
      if (!x || x.dataset.h !== String(jh.length) + '|' + jh.slice(-80)) {
        const w = document.createElement('div'); w.innerHTML = jh; const n = w.firstElementChild; n.dataset.h = String(jh.length) + '|' + jh.slice(-80);
        n.addEventListener('click', (ev) => { if (ev.target.closest('[data-jl=share]')) v2JeitoShare(v2JeitoData()); });
        if (x) x.replaceWith(n); else (v.querySelector('.v2pv') || v.querySelector('.yo-nums')).after(n); } // logo abaixo do cabeçalho
      else if (x.previousElementSibling !== v.querySelector('.v2pv') && v.querySelector('.v2pv')) v.querySelector('.v2pv').after(x);
    } else if (!v.querySelector('.v2afi') && !v.dataset.v2afi) {
      v.querySelectorAll('.yo-nums > *').forEach((c) => { const b = c.querySelector('b, strong') || c; if (/^\s*(0|–|—|-)\s*$/.test(b.textContent || '')) c.classList.add('v2-zero'); });
      v.dataset.v2afi = d.handle; const html = v2Afi(d); if (html) { const w = document.createElement('div'); w.innerHTML = html; (v.querySelector('.yo-nums') || top).after(w.firstElementChild); try { paintCv(v); } catch {} }
    }
  };
  new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; put(); }, 60); }).observe(TR, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] }); }
// ao abrir outro perfil, refaz o cartão de afinidade
{ const _fp = friendPage; friendPage = function () { const v = $('#shelflist'); if (v) delete v.dataset.v2afi; return _fp.apply(this, arguments); }; }
