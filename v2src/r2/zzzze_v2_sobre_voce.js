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
  return out;
}
{ const _vb = v3Build; v3Build = function (v, d) { const r = _vb.apply(this, arguments);
    try { const body = v && v.querySelector('.sl-body'), dest = body && body.querySelector(':scope > .v3pane[data-k=sobre]'); if (!dest) return r;
      let c = dest.querySelector(':scope > .v3eu'); if (!(d && d.self) || S.v3prev) { if (c) c.remove(); return r; }
      const it = v3EuData(); if (!it.length) { if (c) c.remove(); return r; }
      const html = '<h4>Seu jeito de ler</h4><div class="g">' + it.map(([k, b, s]) => '<div class="i"><small>' + esc(k) + '</small><b>' + esc(b) + '</b><span>' + esc(s) + '</span></div>').join('') + '</div>';
      if (!c) { c = document.createElement('section'); c.className = 'v3eu'; c.setAttribute('aria-label', 'Seu jeito de ler'); }
      if (c.dataset.h !== html) { c.innerHTML = html; c.dataset.h = html; }
      const n = dest.querySelector(':scope > .v3num'); const want = n ? n.nextElementSibling : dest.firstElementChild; if (want !== c) (n ? n.after(c) : dest.prepend(c));
    } catch (err) { console.warn('Seu jeito de ler', err); } return r; }; }
