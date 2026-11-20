// v2 Perfil refeito como no protótipo v3 (Bia, 19/11/2026, branch livroverso-2; protótipo versão 127: voce(), perfilx()).
//  Cabeçalho igual para o seu perfil e o de outra pessoa: foto, nome, "@usuário · N amizades", frase, "Lendo Título X% · Título Y%",
//  botões (seu: Editar · Compartilhar · olho "ver como as amizades veem" · engrenagem; outra pessoa: Amizade/Adicionar · Mensagem ·
//  Ler junto e o "•••") e os números numa linha só: lidos · abandonos · páginas · mais longo (sem avaliações, ecos e posts:
//  esses foram para Estatísticas › Na comunidade, que só a própria pessoa vê).
//  Seu perfil: "Minha leitura" com atalhos (Metas, Estatísticas, Órbita, Empréstimos, Presentes; sem Conquistas).
//  Abas: Sobre (jeito de ler + Top 3 em pódio com emoções) · Estantes (estantes e leituras do perfil) · Desejos · Atividade.
//  Funções do app: sem Comunidade some amizades, Compartilhar e o olho; sem Empréstimos e presentes some Desejos e os atalhos;
//  sem Metas/Órbita somem os atalhos. Sem conquistas e sem urso.
//  Os blocos antigos do perfil continuam sendo montados por baixo; este bloco esconde o cabeçalho antigo e redistribui as seções.
{ const st = document.createElement('style'); st.textContent = `
#shelflist.v3pf-on .sl-body > .yo-top,#shelflist.v3pf-on .sl-body > .yo-nums,#shelflist.v3pf-on .sl-body > .v2pv,#shelflist.v3pf-on .sl-body > .v3-sh.t5-h,
#shelflist.v3pf-on .sl-body > .t5-row,#shelflist.v3pf-on .sl-body > .t5-empty,#shelflist.v3pf-on .sl-body > .ex-wish,#shelflist.v3pf-on .sl-body > .v2ptabs,#shelflist.v3pf-on .sl-body > .fr-acts{display:none!important}
.v3pf{display:grid;justify-items:center;text-align:center;gap:.2rem;padding:.4rem 0 .2rem;position:relative}
.v3pf .v3av{width:84px;height:84px;border-radius:50%;padding:3px;border:0;background:linear-gradient(135deg,#e0ad3a,#c2569a,#5b6fd6);cursor:pointer}
.v3pf .v3av > *{width:100%!important;height:100%!important;border-radius:50%!important;border:3px solid var(--bg);box-sizing:border-box;display:grid;place-items:center;overflow:hidden;font-size:1.8rem;font-weight:900;background:var(--acc);color:var(--on-acc,#fff)}
.v3pf .v3av img{width:100%;height:100%;object-fit:cover}
.v3pf h2{margin:.35rem 0 0;font-family:var(--v2-disp,inherit);font-size:1.45rem;line-height:1.15}
.v3pf .v3h{font-size:.84rem;color:var(--ink-2)}.v3pf .v3h button{border:0;background:none;padding:0;font:inherit;color:var(--ink);cursor:pointer}.v3pf .v3h button b{font-weight:900}
.v3pf q{display:block;font-family:var(--v2-disp,serif);font-style:italic;font-size:.95rem;color:var(--ink);margin:.25rem 1rem 0;quotes:'“' '”'}
.v3lag{display:flex;flex-wrap:wrap;justify-content:center;gap:.15rem .4rem;font-size:.8rem;color:var(--ink-2);margin-top:.25rem}
.v3lag button{border:0;background:none;padding:0;font:inherit;color:var(--ink);font-weight:800;cursor:pointer}.v3lag i{font-style:normal;color:var(--acc);font-weight:900}.v3lag em{font-style:normal;color:var(--line)}
.v3pb{display:flex;gap:.4rem;justify-content:center;flex-wrap:wrap;margin-top:.65rem}
.v3pb button{display:inline-flex;align-items:center;gap:.35rem;border:1.5px solid var(--line);background:var(--panel);color:var(--ink);border-radius:99px;padding:.45rem .85rem;font:inherit;font-size:.82rem;font-weight:800;cursor:pointer}
.v3pb button.p{background:var(--acc);border-color:var(--acc);color:var(--on-acc,#fff)}.v3pb button.ic{padding:.45rem .6rem}
.v3prev{display:inline-flex;align-items:center;gap:.35rem;font-size:.8rem;font-weight:800;color:var(--acc)}
.v3pf .v2pxm{top:.2rem;right:.2rem}
.v3num{display:grid;grid-template-columns:1fr 1.1fr 1.1fr 1.6fr;border:1px solid var(--line);background:var(--panel);border-radius:16px;margin:.8rem 0 .2rem;overflow:hidden}
.v3num > button{border:0;border-right:1px solid var(--line);background:none;padding:.55rem .3rem;font:inherit;color:var(--ink);cursor:pointer;min-width:0;text-align:center}
.v3num > button:last-child{border-right:0}.v3num b{display:block;font-size:1.05rem;font-weight:900;white-space:nowrap}
.v3num small{display:block;font-size:.66rem;color:var(--ink-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.v3hubh{display:flex;align-items:baseline;gap:.4rem;margin:1rem 0 .45rem}.v3hubh b{font-family:var(--v2-disp,inherit);font-size:1.05rem}.v3hubh small{font-size:.74rem;color:var(--ink-2)}
.v3hub{display:grid;grid-template-columns:repeat(6,1fr);gap:.45rem}
.v3hub button{grid-column:span 2;display:grid;justify-items:center;gap:.1rem;border:1px solid var(--line);background:var(--panel);border-radius:14px;padding:.6rem .3rem;font:inherit;color:var(--ink);cursor:pointer;min-width:0}
.v3pi{width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex:none}.v3hub .v3pi{color:var(--acc)}.v3pb .v3pi{color:currentColor}.v3prev{display:inline-flex;align-items:center;gap:.35rem}.v3hub button b{font-size:.78rem}.v3hub button small{font-size:.68rem;color:var(--ink-2)}
.v3hub.n5 button:nth-child(n+4){grid-column:span 3}.v3hub.n4 button,.v3hub.n2 button{grid-column:span 3}.v3hub.n1 button{grid-column:span 6}
.v3tabs{display:flex;margin:1.1rem 0 .9rem;border-bottom:1px solid var(--line);position:sticky;top:0;background:var(--bg);z-index:2}
.v3tabs button{flex:1;border:0;background:none;padding:.65rem 0 .55rem;font:inherit;font-size:.84rem;font-weight:800;color:var(--ink-2);border-bottom:2px solid transparent;margin-bottom:-1px;cursor:pointer;white-space:nowrap}
.v3tabs button.on{color:var(--ink);border-bottom-color:var(--acc)}
.v3pane[hidden]{display:none!important}
.v3h2{display:flex;justify-content:space-between;align-items:baseline;margin:1.1rem 0 .4rem}.v3h2 b{font-family:var(--v2-disp,inherit);font-size:1.05rem}
.v3h2 button{border:0;background:none;color:var(--acc);font:inherit;font-size:.8rem;font-weight:800;cursor:pointer;padding:0}
.v3tp3{display:grid;grid-template-columns:1fr 1.25fr 1fr;align-items:end;gap:.5rem;margin:.4rem 0 .2rem}
.v3tp{display:grid;justify-items:center;gap:.3rem;border:0;background:none;padding:0;font:inherit;color:var(--ink);cursor:pointer;position:relative;min-width:0}
.v3tp .pos{font-size:.74rem;font-weight:900;color:var(--ink-2)}.v3tp.one .pos{color:#c9961f}
.v3tp .cv{width:84px!important;height:126px!important;border-radius:3px 7px 7px 3px!important;font-size:.5rem!important;box-shadow:0 8px 16px rgba(0,0,0,.18)}
.v3tp.one .cv{width:108px!important;height:162px!important;box-shadow:0 10px 26px rgba(201,150,31,.35)}
.v3tp.one::before{content:"";position:absolute;inset:18px -6px 26px;border-radius:50%;background:radial-gradient(circle,rgba(224,173,58,.32),transparent 70%);z-index:-1}
.v3tp .emo{display:flex;flex-wrap:wrap;justify-content:center;gap:.2rem}.v3tp .emo em{font-style:normal;font-size:.62rem;font-weight:800;border-radius:99px;padding:.1rem .45rem;background:color-mix(in srgb,var(--acc) 12%,var(--panel));color:var(--acc)}
.v3tpe{border:1px dashed var(--line);border-radius:14px;padding:.9rem;font-size:.84rem;color:var(--ink-2);text-align:center;width:100%;background:none;font-family:inherit;cursor:pointer}
.v3chips{display:flex;gap:.35rem;flex-wrap:wrap;margin:0 0 .7rem}
.v3chips button{border:1.5px solid var(--line);background:var(--panel);color:var(--ink);border-radius:99px;padding:.3rem .75rem;font:inherit;font-size:.78rem;font-weight:800;cursor:pointer}
.v3chips button.on{background:var(--ink);border-color:var(--ink);color:var(--bg)}
.v3at{display:grid;grid-template-columns:44px minmax(0,1fr);gap:.7rem;border:1px solid var(--line);background:var(--panel);border-radius:14px;padding:.65rem .7rem;margin-bottom:.55rem}
.v3at .cv{width:44px!important;height:66px!important;border-radius:3px 6px 6px 3px!important;font-size:.4rem!important}
.v3at > div{min-width:0}.v3at .pill{display:inline-block;font-size:.7rem;font-weight:900;border-radius:99px;padding:.1rem .5rem;background:color-mix(in srgb,var(--acc) 12%,var(--panel));color:var(--acc)}
.v3at .pill.pr{background:color-mix(in srgb,#2e8b57 12%,var(--panel));color:#2e8b57}
.v3at b{display:block;font-size:.88rem;margin-top:.2rem}.v3at p{margin:.2rem 0 0;font-size:.84rem;line-height:1.4}.v3at small{display:block;font-size:.72rem;color:var(--ink-2);margin-top:.2rem}
.v3com{border:1px solid var(--line);background:var(--panel);border-radius:18px;padding:.8rem .9rem;margin:1rem 0}
.v3com h4{margin:0 0 .1rem;font-size:1rem}.v3com > small{display:block;font-size:.74rem;color:var(--ink-2);margin-bottom:.6rem}
.v3com .g{display:grid;grid-template-columns:repeat(4,1fr);gap:.4rem}.v3com .g div{text-align:center}.v3com .g b{display:block;font-size:1.2rem;font-weight:900}.v3com .g span{font-size:.7rem;color:var(--ink-2)}
:host(.v2off-comunidade) .v3com{display:none!important}
`; TR.append(st); }
// ---------- dados ----------
const v3Fmt = (n) => (n == null || n === '' ? '–' : Number(n) >= 10000 ? (Math.round(Number(n) / 100) / 10).toLocaleString('pt-BR') + ' mil' : Number(n).toLocaleString('pt-BR'));
const v3Emo = (e) => { const c = new Map(); ((e && e.quotes) || []).forEach((q) => (q.f || []).forEach((k) => c.set(k, (c.get(k) || 0) + 1)));
  const lab = (k) => { try { const x = QT_FEELS.find((y) => y[0] === k); return x ? x[1] : null; } catch { return null; } };
  return [...c.entries()].sort((a, b) => b[1] - a[1]).map(([k]) => lab(k)).filter(Boolean).slice(0, 2); };
// o resumo publicado leva as emoções do Top e o número de amizades (para o perfil visto pelas amizades)
{ const _ps3 = profShelvesSnap; profShelvesSnap = function (snapshot) { _ps3.apply(this, arguments);
  try { if (snapshot.shelf && Array.isArray(snapshot.shelf.potinho)) snapshot.shelf.potinho = snapshot.shelf.potinho.map((b) => { const e = lib().find((x) => normT(x.title) === normT(b.title)); return { ...b, emo: v3Emo(e) }; }); } catch {}
  try { if (snapshot.shelf && snapshot.shelf.stats) snapshot.shelf.stats.am = ((SOC.fr && SOC.fr.friends) || []).length; } catch {} }; }
function v3Data(d) {
  if (d.self) { const s = myStatsSnap(), L = lib();
    return { lidos: s.lidos, aband: s.aband, pags: s.paginas, maior: s.maior, am: ((SOC.fr && SOC.fr.friends) || []).length,
      lendo: L.filter((e) => e.status === 'LENDO').slice(0, 3).map((e) => ({ title: e.title, pct: readingInfo(e).pct, id: e.id })),
      top: (() => { try { return top5Books().slice(0, 3).map((b) => ({ ...b, emo: v3Emo(lib().find((x) => normT(x.title) === normT(b.title))) })); } catch { return []; } })() }; }
  const sh = d.shelf || {}, s = sh.stats || {}, c = sh.counts || {};
  return { lidos: s.lidos != null ? s.lidos : c.LIDO, aband: s.aband != null ? s.aband : c.ABANDONEI, pags: s.paginas, maior: s.maior, am: s.am,
    lendo: (d.reading || []).slice(0, 3).map((b) => ({ title: b.title, pct: b.pct, author: b.author, cover: b.cover })), top: sh.top5 ? (sh.potinho || []).slice(0, 3) : [] };
}
// ---------- montagem ----------
function v3Head(v, d, x) {
  const m = v2Mods(), self = !!d.self, prev = self && S.v3prev, oldTop = v.querySelector('.sl-body > .yo-top'), pv = v.querySelector('.sl-body > .v2pv');
  const av = (oldTop && oldTop.querySelector('.yo-av')) || (pv && pv.querySelector('.avx > *'));
  const bio = d.bio || (self ? String(((db.prefs || {}).bio) || '') : '') || (oldTop && (oldTop.querySelector('.yo-bio, .yo-frase, q') || {}).textContent) || '';
  const isFr = !self && (d.isFriend || ((SOC.fr && SOC.fr.friends) || []).some((f) => f.handle === d.handle));
  const amz = m.comunidade && x.am != null ? ' · <button type="button" data-v3="amigos"><b>' + x.am + '</b> ' + (x.am === 1 ? 'amizade' : 'amizades') + '</button>' : '';
  const lag = x.lendo.length ? '<div class="v3lag"><span>Lendo</span>' + x.lendo.map((b, i) => (i ? '<em>·</em>' : '') + '<button type="button" data-lag="' + i + '">' + esc(b.title) + ' <i>' + Math.round(Number(b.pct) || 0) + '%</i></button>').join('') + '</div>' : '';
  const btns = self ? (prev ? '<span class="v3prev">' + v3pi('eye', 15) + 'Vendo como as amizades veem</span><button type="button" data-v3="prev">Sair</button>'
      : '<button type="button" data-v3="edit">' + v3pi('pen', 15) + 'Editar</button>' + (m.comunidade ? '<button type="button" data-v3="share">' + v3pi('send', 15) + 'Compartilhar</button><button type="button" class="ic" data-v3="prev" aria-label="Ver como as amizades veem" title="Ver como as amizades veem">' + v3pi('eye', 17) + '</button>' : '') + '<button type="button" class="ic" data-v3="aj" aria-label="Ajustes" title="Ajustes">' + v3pi('gear', 17) + '</button>')
    : (isFr ? '<button type="button" data-v3="amz">' + v3pi('ok', 15) + 'Amizade</button>' : '<button type="button" class="p" data-v3="add">' + v3pi('plus', 15) + 'Adicionar</button>') + (m.comunidade ? '<button type="button" data-v3="msg">' + v3pi('reply', 15) + 'Mensagem</button>' : '') + (isFr ? '<button type="button" data-v3="junto">' + v3pi('friends', 15) + 'Ler junto</button>' : '');
  const maior = x.maior && x.maior.p ? '<button type="button" data-v3="maior"><b>' + v3Fmt(x.maior.p) + ' pág.</b><small>mais longo · ' + esc(x.maior.t || '') + '</small></button>' : '<button type="button"><b>–</b><small>mais longo</small></button>';
  return '<div class="v3pf-top"></div><span class="v3av" data-v3="photo"></span><h2>' + esc(d.displayName || '@' + d.handle) + '</h2><div class="v3h">@' + esc(d.handle) + amz + '</div>'
    + (bio ? '<q>' + esc(bio) + '</q>' : '') + lag + '<div class="v3pb">' + btns + '</div>'
    + '<div class="v3num" style="width:100%"><button type="button" data-v3="lidos"><b>' + v3Fmt(x.lidos) + '</b><small>lidos</small></button><button type="button" data-v3="aband"><b>' + v3Fmt(x.aband) + '</b><small>abandonos</small></button><button type="button" data-v3="pags"><b>' + v3Fmt(x.pags) + '</b><small>páginas</small></button>' + maior + '</div>';
}
const V3PI = {"meta":"<circle cx=\"12\" cy=\"12\" r=\"8.5\"/><circle cx=\"12\" cy=\"12\" r=\"4.5\"/><circle cx=\"12\" cy=\"12\" r=\"1\" fill=\"currentColor\"/>","stats":"<path d=\"M4 20h16M6.5 20v-6M11 20V8M15.5 20v-9M20 20V4\"/>","orb":"<circle cx=\"12\" cy=\"12\" r=\"4\"/><ellipse cx=\"12\" cy=\"12\" rx=\"10\" ry=\"3.6\" transform=\"rotate(-18 12 12)\"/>","swap":"<path d=\"M4 8h14l-3-3M20 16H6l3 3\"/>","gift":"<rect x=\"3.5\" y=\"9\" width=\"17\" height=\"11\" rx=\"1.5\"/><path d=\"M2.5 9h19M12 9v11M12 9C10 5 6.5 5 6.5 7.2S10 9 12 9zM12 9c2-4 5.5-4 5.5-1.8S14 9 12 9z\"/>","pen":"<path d=\"M4 20l1-4L16 5l3 3L8 19z\"/>","send":"<path d=\"M20.5 3.5 3.5 10.5l7 2.5 2.5 7z\"/><path d=\"M20.5 3.5 10.5 13\"/>","eye":"<path d=\"M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/>","gear":"<circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7\"/>","ok":"<circle cx=\"12\" cy=\"12\" r=\"8.5\"/><path d=\"M8 12.3l2.7 2.7L16.2 9.5\"/>","plus":"<path d=\"M12 5v14M5 12h14\"/>","reply":"<path d=\"M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v7a2.5 2.5 0 0 1-2.5 2.5H10l-5 4z\"/>","friends":"<circle cx=\"9\" cy=\"8\" r=\"3.5\"/><path d=\"M2.5 20c.5-3.5 3-5.5 6.5-5.5s6 2 6.5 5.5M16 4.5a3.5 3.5 0 0 1 0 7M18 14.8c2 .7 3.2 2.5 3.5 5.2\"/>"};
const v3pi = (k, w) => '<svg class="v3pi" viewBox="0 0 24 24" aria-hidden="true"' + (w ? ' style="width:' + w + 'px;height:' + w + 'px"' : '') + '>' + (V3PI[k] || '') + '</svg>';
function v3Hub() {
  const m = v2Mods(); let s = {}; try { s = myStatsSnap(); } catch {}
  const loans = (() => { try { return lib().filter((e) => e.ex && e.ex.loan).length; } catch { return 0; } })(), gifts = (() => { try { return gfList().length; } catch { return 0; } })();
  const H = [['metas', 'meta', 'Metas', s.meta ? s.meta.feitos + '/' + s.meta.alvo : 'definir', m.metas], ['stats', 'stats', 'Estatísticas', todayISO().slice(0, 4), true],
    ['orbita', 'orb', 'Órbita', (() => { try { const n = streakNow(); return n ? n + (n === 1 ? ' dia' : ' dias') : 'hoje'; } catch { return ''; } })(), m.orbita],
    ['emprest', 'swap', 'Empréstimos', loans ? loans + ' fora' : 'nenhum', m.emprest], ['presentes', 'gift', 'Presentes', gifts ? String(gifts) : 'nenhum', m.emprest]].filter((x) => x[4]);
  return '<div class="v3hubh"><b>Minha leitura</b><small>só você vê</small></div><div class="v3hub n' + H.length + '">' + H.map(([k, i, n, sm]) => '<button type="button" data-hub="' + k + '">' + v3pi(i, 20) + '<b>' + n + '</b><small>' + esc(sm) + '</small></button>').join('') + '</div>';
}
function v3Top3(x, self) {
  const T = x.top || [];
  if (!T.length) return self ? '<button type="button" class="v3tpe" data-v3="top5">Escolha os 3 livros que mais marcaram você</button>' : '<p class="v2wempty">Ainda sem Top 3.</p>';
  const order = [[1, 2], [0, 3], [2, 1]].filter(([i]) => T[i]);
  return '<div class="v3tp3">' + order.map(([i]) => { const b = T[i]; return '<button type="button" class="v3tp' + (i === 0 ? ' one' : '') + '" data-top="' + i + '" aria-label="' + (i + 1) + 'º lugar: ' + esc(b.title) + '"><span class="pos">' + (i === 0 ? '✦ ' : '') + (i + 1) + 'º</span>' + cvh(b.title, b.cover, '') + '<span class="emo">' + (b.emo || []).map((n) => '<em>' + esc(n) + '</em>').join('') + '</span></button>'; }).join('') + '</div>';
}
function v3Ativ(d, host) {
  const f = S.v3atf || 'tudo', self = !!d.self; let L = [];
  if (self) { lib().forEach((e) => { const r = reviewOfLib(e); if (r && (r.paws || String(r.texto || '').trim()) && r.share !== false) L.push({ k: 'aval', t: e.title, c: e.cover, pill: 'Avaliou' + (r.paws ? ' ★ ' + String(r.paws).replace('.', ',') : ''), tx: String(r.texto || '').trim(), at: e.finishedAt || e.statusAt || '' }); });
    lib().filter((e) => e.status === 'LENDO').forEach((e) => L.push({ k: 'prog', t: e.title, c: e.cover, pill: 'Lendo · ' + Math.round(readingInfo(e).pct || 0) + '%', tx: '', at: (e.readLog && e.readLog.length ? e.readLog[e.readLog.length - 1].date : e.startedAt) || '' })); }
  else { (d.reviews || []).forEach((r) => L.push({ k: 'aval', t: (r.book && r.book.title) || r.title || '', c: (r.book && r.book.cover) || r.cover || null, pill: 'Avaliou' + (r.paws ? ' ★ ' + String(r.paws).replace('.', ',') : ''), tx: r.spoiler ? 'Tem spoiler: abra o livro para ver.' : String(r.text || r.body || '').trim(), at: String(r.updatedAt || r.createdAt || '').slice(0, 10) }));
    (d.reading || []).forEach((b) => L.push({ k: 'prog', t: b.title, c: b.cover, pill: 'Lendo · ' + Math.round(Number(b.pct) || 0) + '%', tx: '', at: '' })); }
  L.sort((a, b) => String(b.at).localeCompare(String(a.at)));
  const V = L.filter((x) => f === 'tudo' || x.k === f);
  host.innerHTML = '<div class="v3chips">' + [['tudo', 'Tudo'], ['aval', 'Avaliações'], ['prog', 'Progresso']].map(([k, n]) => '<button type="button" data-af="' + k + '" class="' + (f === k ? 'on' : '') + '">' + n + '</button>').join('') + '</div>'
    + (V.length ? V.slice(0, 40).map((x) => '<div class="v3at">' + cvh(x.t, x.c, '') + '<div><span class="pill' + (x.k === 'prog' ? ' pr' : '') + '">' + esc(x.pill) + '</span><b>' + esc(x.t) + '</b>' + (x.tx ? '<p>' + esc(x.tx.slice(0, 280)) + '</p>' : '') + (x.at ? '<small>' + exD(x.at) + '</small>' : '') + '</div></div>').join('') : '<p class="v2wempty">Nada por aqui ainda.</p>');
  try { paintCv(host); } catch {}
  host.querySelectorAll('[data-af]').forEach((b) => b.addEventListener('click', () => { S.v3atf = b.dataset.af; v3Ativ(d, host); }));
}
function v3Build(v, d) {
  const body = v.querySelector('.sl-body'); if (!body) return;
  const m = v2Mods(), self = !!d.self, x = v3Data(d), key = d.handle + '|' + (self ? 1 : 0);
  if (S.v3pfH !== d.handle) { S.v3pfH = d.handle; S.v3tab = 'sobre'; S.v3prev = false; }
  const tabsOk = [['sobre', 'Sobre'], ['est', 'Estantes'], ['des', 'Desejos'], ['ativ', 'Atividade']].filter(([k]) => k !== 'des' || m.emprest);
  if (!tabsOk.some(([k]) => k === S.v3tab)) S.v3tab = 'sobre';
  v.classList.add('v3pf-on');
  // cabeçalho
  let hd = body.querySelector(':scope > .v3pf');
  const sig = JSON.stringify([key, x, S.v3prev, m, d.displayName, d.bio, d.isFriend]);
  if (!hd) { hd = document.createElement('section'); hd.className = 'v3pf'; }
  const top = body.querySelector(':scope > .sl-top'); if ((top ? top.nextElementSibling : body.firstElementChild) !== hd) (top ? top.after(hd) : body.prepend(hd));
  if (hd.dataset.sig !== sig) { hd.dataset.sig = sig; hd.innerHTML = v3Head(v, d, x);
    const avs = (body.querySelector(':scope > .yo-top .yo-av')) || (body.querySelector(':scope > .v2pv .avx > *'));
    const slot = hd.querySelector('.v3av'); if (avs) slot.append(avs.cloneNode(true)); else slot.innerHTML = '<span>' + esc(String(d.displayName || d.handle || '?').charAt(0).toUpperCase()) + '</span>';
    v3Wire(v, d, hd, x); }
  // Minha leitura
  let hub = body.querySelector(':scope > .v3hubw');
  if (self && !S.v3prev) { if (!hub) { hub = document.createElement('section'); hub.className = 'v3hubw'; } if (hd.nextElementSibling !== hub) hd.after(hub);
    const hs = JSON.stringify([m, gfList().length]); if (hub.dataset.sig !== hs) { hub.dataset.sig = hs; hub.innerHTML = v3Hub(); hub.querySelectorAll('[data-hub]').forEach((b) => b.addEventListener('click', () => v3Go(v, d, b.dataset.hub))); } }
  else hub && hub.remove();
  // abas
  let tb = body.querySelector(':scope > .v3tabs');
  if (!tb) { tb = document.createElement('div'); tb.className = 'v3tabs'; tb.setAttribute('role', 'tablist'); }
  const tsig = tabsOk.map((t) => t[0]).join(',');
  if (tb.dataset.sig !== tsig) { tb.dataset.sig = tsig; tb.innerHTML = tabsOk.map(([k, n]) => '<button type="button" role="tab" data-t="' + k + '">' + n + '</button>').join('');
    tb.querySelectorAll('[data-t]').forEach((b) => b.addEventListener('click', () => { S.v3tab = b.dataset.t; v3Build(v, S.fpData); const t = tb.getBoundingClientRect().top; if (t < 60) v.scrollTop += t - 60; })); }
  // o que fica entre o cabeçalho e as abas: o cartão "Vocês combinam" da amizade
  const afterHead = [...body.querySelectorAll(':scope > .v2afi, :scope > .cm-btn')];
  let anchor = hub && hub.isConnected ? hub : hd; afterHead.forEach((el) => { if (anchor.nextElementSibling !== el) anchor.after(el); anchor = el; });
  if (anchor.nextElementSibling !== tb) anchor.after(tb);
  tb.querySelectorAll('[data-t]').forEach((b) => { const on = b.dataset.t === S.v3tab; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
  // painéis
  const pane = (k) => { let p = body.querySelector(':scope > .v3pane[data-k=' + k + ']'); if (!p) { p = document.createElement('section'); p.className = 'v3pane'; p.dataset.k = k; body.append(p); } p.hidden = S.v3tab !== k; return p; };
  const pS = pane('sobre'), pE = pane('est'), pD = pane('des'), pA = pane('ativ');
  let last = tb; [pS, pE, pD, pA].forEach((p) => { if (last.nextElementSibling !== p) last.after(p); last = p; });
  // Sobre: jeito de ler + Top 3
  const jl = body.querySelector(':scope > .v2jl'); if (jl && jl.parentElement !== pS) pS.prepend(jl);
  let t3 = pS.querySelector('.v3t3w'); if (!t3) { t3 = document.createElement('div'); t3.className = 'v3t3w'; pS.append(t3); }
  const t3s = JSON.stringify([x.top, self, S.v3prev]); if (t3.dataset.sig !== t3s) { t3.dataset.sig = t3s;
    t3.innerHTML = '<div class="v3h2"><b>Top 3</b>' + (self && !S.v3prev && x.top.length ? '<button type="button" data-v3="top5">Editar</button>' : '') + '</div>' + v3Top3(x, self);
    try { paintCv(t3); } catch {}
    t3.querySelectorAll('[data-top]').forEach((b) => b.addEventListener('click', () => { const t = x.top[+b.dataset.top]; if (!t) return; const e = self && lib().find((y) => normT(y.title) === normT(t.title)); if (e) openBookPage(e); else openAnyBook(t.title, t.author, t.cover); }));
    t3.querySelectorAll('[data-v3=top5]').forEach((b) => b.addEventListener('click', () => { try { editTop5(); } catch { try { openTaste(); } catch {} } })); }
  // Estantes: tudo o que sobrar do perfil antigo (estantes, lidos recentes, leituras por mês)
  const KEEP = ['sl-top', 'v3pf', 'v3hubw', 'v3tabs', 'v3pane', 'v2afi', 'cm-btn', 'yo-top', 'yo-nums', 'v2pv', 'ex-wish', 'v2ptabs', 'fr-acts', 'v2sus', 't5-row', 't5-empty', 'fr-unf'];
  [...body.children].forEach((el) => { if (KEEP.some((c) => el.classList.contains(c)) || el.classList.contains('t5-h')) return; pE.append(el); });
  if (!pE.children.length) pE.innerHTML = '<p class="v2wempty">' + (self ? 'Suas estantes aparecem aqui. Escolha quais mostrar em Ajustes › Organizar meu perfil.' : 'Nenhuma estante no perfil.') + '</p>';
  else pE.querySelector(':scope > .v2wempty')?.remove();
  // Desejos (bloco f0)
  if (S.v3tab === 'des' && (!pD.querySelector('.v2wish') || pD.dataset.h !== d.handle)) { pD.dataset.h = d.handle; pD.innerHTML = ''; v2WishPaint(v, d, pD); }
  // Atividade
  if (S.v3tab === 'ativ' && pA.dataset.h !== d.handle + '|' + (S.v3atf || '')) { pA.dataset.h = d.handle + '|' + (S.v3atf || ''); v3Ativ(d, pA); }
  // a faixa de conta suspensa fica logo abaixo do cabeçalho
  const sus = body.querySelector(':scope > .v2sus'); if (sus && hd.nextElementSibling !== sus) hd.after(sus); if (sus) sus.hidden = !!S.v3prev;
}
function v3Old(v, sel) { const b = v.querySelector('.sl-body > .v2pv ' + sel) || v.querySelector('.sl-body > .yo-top ' + sel); if (b) { b.click(); return true; } return false; }
function v3Go(v, d, k) {
  if (k === 'metas') { try { openGoalsV4(); } catch {} return; }
  if (k === 'stats') { if (!v3Old(v, '[data-p=stats]')) { v.hidden = true; goTab('progresso'); } return; }
  if (k === 'orbita') { try { openOrbita(); } catch {} return; }
  if (k === 'presentes') return openGifts();
  if (k === 'emprest') { v.hidden = true; goTab('estante'); setTimeout(() => { const b = TR.querySelector('#lista .esn-seg [data-own=emp]'); if (b && !b.classList.contains('on')) b.click(); else if (!b) toast('Nenhum livro emprestado agora'); }, 700); }
}
function v3Wire(v, d, hd, x) {
  const on = (k, fn) => hd.querySelectorAll('[data-v3=' + k + ']').forEach((b) => b.addEventListener('click', fn));
  on('edit', () => v3Old(v, '[data-p=edit]'));
  on('share', () => { if (!v3Old(v, '[data-p=share]')) toast('Link do perfil copiado'); });
  on('prev', () => { S.v3prev = !S.v3prev; if (S.v3prev && S.v3tab === 'des') S.v3tab = 'sobre'; v3Build(v, d); });
  on('aj', () => { const aj = [...v.querySelectorAll('.sl-body > .yo-top button')].find((b) => /Ajustes/.test(b.textContent) || /Ajustes/.test(b.getAttribute('aria-label') || '')); if (aj) aj.click(); else { v.hidden = true; goTab('perfil'); } });
  on('photo', () => { if (d.self && !S.v3prev) v3Old(v, '[data-p=photo]'); });
  on('amigos', () => { if (d.self) v3Old(v, '[data-p=amigos]'); });
  on('lidos', () => { if (d.self) { if (!v3Old(v, '[data-p=lidos]')) try { openStatusList('LIDO', 'Lidos'); } catch {} } });
  on('aband', () => { if (d.self) try { openAbandoned('perfil'); } catch {} });
  on('pags', () => { if (d.self) v3Go(v, d, 'stats'); });
  on('maior', () => { if (!x.maior) return; const e = d.self && lib().find((y) => normT(y.title) === normT(x.maior.t)); if (e) openBookPage(e); else openAnyBook(x.maior.t); });
  hd.querySelectorAll('[data-lag]').forEach((b) => b.addEventListener('click', () => { const t = x.lendo[+b.dataset.lag]; if (!t) return; const e = t.id && byId(t.id); if (e) openBookPage(e); else openAnyBook(t.title, t.author, t.cover); }));
  on('msg', () => { try { openChat(d.handle); } catch { toast('Mensagens: abra pelo menu'); } });
  on('junto', () => { const f = ((SOC.fr && SOC.fr.friends) || []).find((y) => y.handle === d.handle); if (f) friendReadTogether(f); });
  on('amz', () => { const f = ((SOC.fr && SOC.fr.friends) || []).find((y) => y.handle === d.handle); if (!f) return; popMenu(hd.querySelector('[data-v3=amz]'), [{ label: 'Desfazer amizade', danger: true, fn: () => friendUnfriend(f, () => { v.hidden = true; }) }]); });
  on('add', async () => { const r = await sapi('POST', '/v1/friends/requests', { handle: d.handle }).catch(() => null); toast(r && r.status < 300 ? 'Pedido de amizade enviado' : 'Não consegui agora'); });
}
// liga o perfil novo sempre que o perfil (seu ou de outra pessoa) está na tela
{ let tm = 0; const put = () => { const v = $('#shelflist'), d = S.fpData;
    if (!v || v.hidden || !d || !d.handle) { v && v.classList.remove('v3pf-on'); return; }
    const body = v.querySelector('.sl-body'); if (!body || !(body.querySelector(':scope > .yo-top') || body.querySelector(':scope > .v2pv'))) { v.classList.remove('v3pf-on'); return; }
    try { v3Build(v, d); } catch (err) { console.warn('perfil v3', err); } };
  new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; put(); }, 90); }).observe(TR, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] }); }
// Estatísticas › Na comunidade (só a própria pessoa vê; some sem Comunidade)
{ let tm = 0, cache = null, at = 0; const put = async () => { if (S.tab !== 'progresso') return; const box = TR.querySelector('#lista'); if (!box || box.querySelector('.v3com') || !v2Mods().comunidade) return;
    const y = todayISO().slice(0, 4), card = document.createElement('section'); card.className = 'v3com'; box.append(card);
    const loc = (() => { try { return lib().filter((e) => { const r = reviewOfLib(e); return r && r.share !== false && String(r.texto || '').trim() && String(e.finishedAt || '').slice(0, 4) === y; }).length; } catch { return 0; } })();
    const paint = (s) => { card.innerHTML = '<h4>Na comunidade</h4><small>em ' + y + ' · só você vê</small><div class="g">'
      + [[s ? s.reviews : loc, 'avaliações'], [s ? s.posts : null, 'posts'], [s ? s.comments : null, 'comentários'], [s ? s.ecos : null, 'ecos']].map(([n, l]) => '<div><b>' + (n == null ? '–' : v3Fmt(n)) + '</b><span>' + l + '</span></div>').join('') + '</div>'; };
    paint(cache);
    if (!cache || Date.now() - at > 120e3) { try { const r = await sapi('GET', '/v1/me/community-stats'); if (r && r.status === 200 && r.data) { cache = r.data; at = Date.now(); if (card.isConnected) paint(cache); } } catch {} } };
  new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; put(); }, 200); }).observe(TR, { childList: true, subtree: true }); }
