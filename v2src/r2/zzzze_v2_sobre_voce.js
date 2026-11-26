// ---------- v2: aba Sobre com o jeito de ler da pessoa (Bia, 26/11) ----------
// "No Sobre a gente tem que trazer coisas interessantes sobre a pessoa: gênero favorito, quem ela mais lê…"
// Cartão "Seu jeito de ler" logo depois dos números: gênero favorito, autoria favorita, formato, melhor leitura do ano,
// tamanho médio e quanto tempo leva para terminar. Só aparece o que tem dado (livros lidos). Seu perfil, fora da prévia.
{ const st = document.createElement('style'); st.textContent = `
.v3pane > .v3eu{margin:0 0 1rem;background:var(--panel);border:1px solid var(--line);border-radius:18px;padding:.85rem .9rem}
.v3eu h4{margin:0 0 .6rem;font-size:.82rem;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-2)}
.v3eu .g{display:grid;grid-template-columns:1fr 1fr;gap:.55rem}
.v3eu .i{min-width:0;border-radius:14px;background:color-mix(in srgb,var(--ink) 5%,var(--panel));padding:.6rem .7rem}
.v3eu .i small{display:block;font-size:.72rem;font-weight:800;color:var(--ink-2)}
.v3eu .i b{display:block;margin-top:.15rem;font-size:1rem;line-height:1.2;color:var(--ink);overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.v3eu .i span{display:block;margin-top:.15rem;font-size:.76rem;color:var(--ink-2)}
`; TR.append(st); }
function v3EuData() {
  const L = lib(), lidos = L.filter((e) => e.status === 'LIDO'), y = todayISO().slice(0, 4);
  const paws = (e) => { try { return Number((reviewOfLib(e) || {}).paws) || 0; } catch { return 0; } };
  const top = (m) => [...m.entries()].sort((a, b) => b[1].n - a[1].n || b[1].s - a[1].s)[0];
  const out = [];
  // gênero favorito: o que mais aparece nos lidos (nota desempata)
  const G = new Map(); lidos.forEach((e) => { let g = ''; try { g = v2Genre(e); } catch {} if (!g || /^outros?$/i.test(g)) return; const x = G.get(g) || { n: 0, s: 0 }; x.n++; x.s += paws(e); G.set(g, x); });
  const g = top(G); if (g && g[1].n >= 2) out.push(['Gênero favorito', g[0], g[1].n + ' livros lidos']);
  // autoria favorita: quem mais leu (pelo menos 2 livros); nota média junto
  const A = new Map(); lidos.forEach((e) => { const a = String(e.author || '').split(/[,;&]| e /)[0].trim(); if (!a) return; const x = A.get(a) || { n: 0, s: 0, r: 0 }; x.n++; const p = paws(e); if (p) { x.s += p; x.r++; } A.set(a, x); });
  const a = top(A); if (a && a[1].n >= 2) out.push(['Autoria favorita', a[0], a[1].n + ' livros' + (a[1].r ? ' · nota ' + (a[1].s / a[1].r).toFixed(1).replace('.', ',') : '')]);
  // formato
  const F = { FISICO: 'Livro físico', EBOOK: 'E-book', AUDIO: 'Audiolivro' }, fc = {}; lidos.forEach((e) => { const k = F[e.format] ? e.format : 'FISICO'; fc[k] = (fc[k] || 0) + 1; });
  const fk = Object.keys(fc).sort((p, q) => fc[q] - fc[p])[0]; if (fk && lidos.length >= 3) out.push(['Formato', F[fk], Math.round((fc[fk] / lidos.length) * 100) + '% das leituras']);
  // melhor leitura do ano
  const best = lidos.filter((e) => String(e.finishedAt || '').slice(0, 4) === y && paws(e) > 0).sort((p, q) => paws(q) - paws(p) || String(q.finishedAt).localeCompare(String(p.finishedAt)))[0];
  if (best) out.push(['Melhor de ' + y, best.title, 'nota ' + String(paws(best)).replace('.', ',')]);
  // tamanho médio e tempo para terminar
  const pg = lidos.map((e) => Number(e.totalPages) || 0).filter((n) => n > 0); if (pg.length >= 3) out.push(['Tamanho médio', Math.round(pg.reduce((s, n) => s + n, 0) / pg.length) + ' páginas', pg.length + ' livros com páginas']);
  const dd = lidos.map((e) => { const s = Date.parse(String(e.startedAt || '').slice(0, 10)), f = Date.parse(String(e.finishedAt || '').slice(0, 10)); return s && f && f >= s ? Math.round((f - s) / 864e5) + 1 : 0; }).filter((n) => n > 0 && n < 400).sort((p, q) => p - q);
  if (dd.length >= 3) { const m = dd[dd.length >> 1]; out.push(['Para terminar', m + (m === 1 ? ' dia' : ' dias'), 'na média de ' + dd.length + ' livros']); }
  // (Bia 26/11: "faltou editora preferida e mais coisas sobre mim")
  // editora favorita
  const P = new Map(); lidos.forEach((e) => { const pb = String(e.publisher || (e.meta && e.meta.pub) || '').replace(/s*(editora|ltda.?|s.?a.?)s*/gi, ' ').trim(); if (!pb) return; const k = pb.toLowerCase(); const x = P.get(k) || { n: 0, s: 0, nome: pb }; x.n++; x.s += paws(e); P.set(k, x); });
  const pbt = [...P.values()].sort((a, b) => b.n - a.n || b.s - a.s)[0]; if (pbt && pbt.n >= 2) out.splice(2, 0, ['Editora favorita', pbt.nome, pbt.n + ' livros lidos']);
  // nota média
  const notas = lidos.map(paws).filter((n) => n > 0); if (notas.length >= 3) out.push(['Nota média', (notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(1).replace('.', ','), 'em ' + notas.length + ' avaliações']);
  // sentimento que mais aparece (diário e trechos)
  const FE = new Map(); L.forEach((e) => { (e.diary || []).forEach((x) => (x && x.fe || []).forEach((k) => FE.set(k, (FE.get(k) || 0) + 1))); (e.quotes || []).forEach((q) => (q && q.f || []).forEach((k) => FE.set(k, (FE.get(k) || 0) + 1))); });
  const fe = [...FE.entries()].sort((a, b) => b[1] - a[1])[0]; if (fe && fe[1] >= 2) { let nome = fe[0]; try { const f = QT_FEELS.find((y) => y[0] === fe[0]); if (f) nome = f[1]; } catch {} out.push(['Sente mais', nome, fe[1] + ' vezes nas anotações']); }
  // mês em que mais termina livros
  const MES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'], M = new Array(12).fill(0);
  lidos.forEach((e) => { const m = Number(String(e.finishedAt || '').slice(5, 7)); if (m >= 1 && m <= 12 && !e.noDate) M[m - 1]++; });
  const mx = Math.max(...M); if (mx >= 2) { const i = M.indexOf(mx); out.push(['Mês que mais lê', MES[i], mx + ' livros terminados']); }
  // mais rápido
  const rap = lidos.map((e) => { const a = Date.parse(String(e.startedAt || '').slice(0, 10)), f = Date.parse(String(e.finishedAt || '').slice(0, 10)); return { e, d: a && f && f >= a ? Math.round((f - a) / 864e5) + 1 : 0 }; }).filter((x) => x.d > 0 && (Number(x.e.totalPages) || 0) >= 150).sort((a, b) => a.d - b.d)[0];
  if (rap) out.push(['Mais rápido', rap.e.title, rap.d === 1 ? 'em 1 dia' : 'em ' + rap.d + ' dias']);
  // ressaca e releituras
  const res = lidos.filter((e) => { try { return (reviewOfLib(e) || {}).ressaca === 'deu'; } catch { return false; } }); if (res.length) out.push(['Deram ressaca', res.length === 1 ? res[0].title : res.length + ' livros', res.length === 1 ? 'o único até agora' : 'o último: ' + res[res.length - 1].title]);
  const rel = L.filter((e) => (Number(e.rereading) || 0) > 0); if (rel.length) out.push(['Releituras', rel.length === 1 ? rel[0].title : rel.length + ' livros', rel.length === 1 ? 'relido' : 'que você leu de novo']);
  return out;
}
{ const _vb = v3Build; v3Build = function (v, d) { const r = _vb.apply(this, arguments);
    try { const body = v && v.querySelector('.sl-body'); if (!body || !d) return r;
      // (Bia 26/11) visita e "como as amizades veem" também têm o Sobre (aba top): lá o cartão vem do resumo publicado
      const mine = !!d.self && !S.v3prev, dest = body.querySelector(':scope > .v3pane[data-k=' + (mine ? 'sobre' : 'top') + ']'); if (!dest) return r;
      body.querySelectorAll('.v3pane > .v3eu').forEach((x) => { if (x.parentElement !== dest) x.remove(); });
      let c = dest.querySelector(':scope > .v3eu');
      const it = d.self ? v3EuData() : (d.shelf && Array.isArray(d.shelf.eu) ? d.shelf.eu.filter((x) => Array.isArray(x) && x.length === 3).slice(0, 14) : []);
      if (!it.length) { if (c) c.remove(); return r; }
      const html = '<h4>' + (mine ? 'Seu jeito de ler' : 'Jeito de ler') + '</h4><div class="g">' + it.map(([k, b, s]) => '<div class="i"><small>' + esc(k) + '</small><b>' + esc(b) + '</b><span>' + esc(s) + '</span></div>').join('') + '</div>';
      if (!c) { c = document.createElement('section'); c.className = 'v3eu'; c.setAttribute('aria-label', 'Seu jeito de ler'); }
      if (c.dataset.h !== html) { c.innerHTML = html; c.dataset.h = html; }
      const n = dest.querySelector(':scope > .v3num'); const want = n ? n.nextElementSibling : dest.firstElementChild; if (want !== c) (n ? n.after(c) : dest.prepend(c));
    } catch (err) { console.warn('Seu jeito de ler', err); } return r; }; }
// o resumo publicado leva o cartão (só textos curtos), salvo se a pessoa escondeu a leitura do perfil
{ const _ps = profShelvesSnap; profShelvesSnap = function (snapshot) { const r = _ps.apply(this, arguments);
    try { const pv = (socialProfile && socialProfile.privacy) || {}; if (snapshot && snapshot.shelf) { if (pv.reading === false) delete snapshot.shelf.eu; else snapshot.shelf.eu = v3EuData().map((x) => x.map((t) => String(t).slice(0, 80))); } } catch (err) { console.warn('jeito de ler no resumo', err); }
    return r; }; }
