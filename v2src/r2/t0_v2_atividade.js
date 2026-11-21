// Atividade do seu perfil igual ao protótipo (Bia, 20/11; auditoria protótipo × app):
// filtros Tudo · Comentários · Avaliações · Ecos · Progresso; cada item é um cartão com capa, etiqueta do tipo
// (Lendo · pág., Eco · pág., Avaliou ★★★★★, Comentou, Terminou, Indicou), o texto, "quando · quem vê" e o ••• (editar/apagar).
// Dados reais: seus posts e avaliações publicadas (GET /v1/rede?user=), seus ecos (GET /v1/me/echoes) e a estante
// (lendo agora; terminou). Sem rede, cai na lista anterior. Na prévia "como as amizades veem" não há •••.
{ const st = document.createElement('style'); st.textContent = `
.v8atc{display:flex;flex-wrap:nowrap;justify-content:space-between;gap:.25rem;margin:.2rem 0 .7rem}
.v8atc button{flex:0 1 auto;min-width:0;white-space:nowrap;border:1px solid var(--line);background:none;color:var(--ink-2);border-radius:99px;padding:.35rem .45rem;font:inherit;font-size:.69rem;font-weight:800;cursor:pointer}
.v8atc button.on{background:var(--ink);border-color:var(--ink);color:var(--bg)}
.v8mp{display:flex;gap:.75rem;align-items:flex-start;padding:.75rem;border:1px solid var(--line);border-radius:16px;background:var(--panel);margin-bottom:.55rem}
.v8mp .pcv{flex:none;border:0;background:none;padding:0;cursor:pointer}.v8mp .pcv .cv{width:48px!important;height:72px!important;font-size:.45rem!important}
.v8mp .tx{flex:1;min-width:0}.v8mp p{margin:.35rem 0 .25rem;font-size:.88rem;line-height:1.4;color:var(--ink);overflow-wrap:anywhere}
.v8mp small{display:block;font-size:.72rem;color:var(--ink-2);font-weight:700}
.v8mp .mo{flex:none;border:0;background:none;color:var(--ink-2);font:inherit;font-weight:900;font-size:1rem;width:30px;height:30px;cursor:pointer}
.v8pa{display:inline-flex;align-items:center;gap:.3rem;font-size:.74rem;font-weight:900;padding:.18rem .55rem;border-radius:99px}
.v8pa.le{background:color-mix(in srgb,#8b6fd6 18%,transparent);color:#b9a8f0}
.v8pa.av2{background:color-mix(in srgb,var(--acc) 16%,transparent);color:var(--acc)}.v8pa .st{letter-spacing:1px}.v8pa .st u{text-decoration:none;opacity:.3}
.v8pa.te{background:color-mix(in srgb,#5fb88a 16%,transparent);color:#5fb88a}
.v8pa.co{background:color-mix(in srgb,#4fa3c7 16%,transparent);color:#7cc0de}
.v8pa.in{background:color-mix(in srgb,#d98bc0 18%,transparent);color:#e7a3d0}
.v8pa.ab{background:color-mix(in srgb,#e2766b 16%,transparent);color:#e2766b}
.v8pa.pa{background:color-mix(in srgb,#8fa6c9 16%,transparent);color:#a9bddb}
.v8pa.eco{background:color-mix(in srgb,#ffd68c 14%,transparent);color:#f0c46a}.v8pa .mst2{display:inline-block;width:9px;height:9px;border-radius:50%;background:#ffe2a8;box-shadow:0 0 7px 2px rgba(255,214,140,.6)}
`; TR.append(st); }
{ const _prev = v3Ativ;
  // ecos só se leem na sessão, na página certa (Bia, 21/11): no modo "Vendo como as amizades veem" não há filtro nem card de eco
  const F = () => [['tudo', 'Tudo'], ['coment', 'Comentários'], ['aval', 'Avaliações'], ['ecos', 'Ecos'], ['prog', 'Progresso']].filter(([k]) => (k !== 'coment' || vFn('comunidade')) && (k !== 'ecos' || (vFn('ecos') && !S.v3prev)));
  const stars = (p) => { const n = Math.round(Number(p) || 0); return '<span class="st">' + '★'.repeat(n) + '<u>' + '★'.repeat(5 - n) + '</u></span>'; };
  const byTitle = (t) => { try { return lib().find((e) => normT(e.title) === normT(t || '')); } catch { return null; } };
  const quem = (v) => v === 'friends' ? 'só amizades' : v === 'rede' ? 'toda a comunidade' : v === 'local' ? '' : 'todos';
  const fromApi = (it) => {
    const b = it.book || {}, pg = it.page || null, pct = it.readerPct;
    if (it.type === 'review') {
      const s = it.bookStatus;
      const pill = s === 'ABANDONEI' ? ['ab', 'Abandonou' + (pct != null ? ' com ' + Math.round(pct) + '%' : '')] : s === 'HIBERNANDO' ? ['pa', 'Pausou' + (pct != null ? ' com ' + Math.round(pct) + '%' : '')] : ['av2', 'Avaliou ' + (it.paws ? stars(it.paws) : '')];
      return { f: 'aval', c: pill[0], a: pill[1], t: b.title, cv: b.cover, tx: it.text || '', at: it.createdAt, v: 'public', it };
    }
    if (it.kind === 'rec') return { f: 'coment', c: 'in', a: it.book2 ? 'Indicou ' + esc(it.book2.title) : 'Indicou', t: b.title, cv: b.cover, tx: it.text || '', at: it.createdAt, v: it.visibility, it };
    if (it.kind === 'quote') return { f: 'coment', c: 'le', a: 'Trecho' + (pg ? ' · pág. ' + pg : ''), t: b.title, cv: b.cover, tx: it.quote ? '“' + it.quote + '”' : it.text || '', at: it.createdAt, v: it.visibility, it };
    if (pct === 100) return { f: 'prog', c: 'te', a: 'Terminou', t: b.title, cv: b.cover, tx: it.text || '', at: it.createdAt, v: it.visibility, it };
    if (pg || pct != null) return { f: 'prog', c: 'le', a: 'Lendo' + (pg ? ' · pág. ' + pg : ' · ' + Math.round(pct) + '%'), t: b.title, cv: b.cover, tx: it.text || '', at: it.createdAt, v: it.visibility, it };
    return { f: 'coment', c: 'co', a: 'Comentou', t: b.title, cv: b.cover, tx: it.text || '', at: it.createdAt, v: it.visibility, it };
  };
  const local = () => { const L = []; let lb = []; try { lb = lib(); } catch {}
    lb.filter((e) => e.status === 'LENDO').forEach((e) => { let p = 0, now = 0; try { const r = readingInfo(e); p = r.pct || 0; now = r.now || 0; } catch {} const last = e.readLog && e.readLog.length ? e.readLog[e.readLog.length - 1].date : e.startedAt;
      L.push({ f: 'prog', c: 'le', a: 'Lendo' + (now ? ' · pág. ' + now : ' · ' + Math.round(p) + '%'), t: e.title, cv: e.cover, tx: '', at: last || '', v: 'local', e }); });
    lb.filter((e) => e.status === 'LIDO' && e.finishedAt && e.startedAt).forEach((e) => { let n = 0; try { n = Math.max(1, between(e.startedAt, e.finishedAt) + 1); } catch {}
      L.push({ f: 'prog', c: 'te', a: 'Terminou', t: e.title, cv: e.cover, tx: n ? 'Terminei em ' + n + (n === 1 ? ' dia.' : ' dias.') : '', at: e.finishedAt, v: 'local', e }); });
    return L; };
  const when = (iso) => { if (!iso) return ''; try { return /T/.test(iso) ? relTime(iso) : exD(iso); } catch { return String(iso).slice(0, 10); } };
  async function load(force) {
    const me = (typeof socialProfile !== 'undefined' && socialProfile && socialProfile.handle) || '';
    const c = S.v8atv; if (!force && c && c.me === me && Date.now() - c.t < 60000) return c;
    const out = { me, t: Date.now(), api: null, ecos: [] };
    if (me && vFn('comunidade')) { try { const r = await sapi('GET', '/v1/rede?user=' + encodeURIComponent(me)); if (r.status === 200 && r.data) out.api = (r.data.items || []).filter((x) => x && (x.type === 'post' || x.type === 'review') && (x.mine || (x.user && x.user.handle === me))); } catch {} }
    if (vFn('ecos')) { try { const r = await sapi('GET', '/v1/me/echoes'); if (r.status === 200 && r.data) out.ecos = r.data.items || []; } catch {} }
    S.v8atv = out; return out; }
  v3Ativ = function (d, host) {
    if (!d || !d.self) return _prev.apply(this, arguments);
    const f0 = S.v3atf || 'tudo', ro = !!S.v3prev, f = F().some(([k]) => k === f0) ? f0 : 'tudo';
    const paint = (c) => {
      if (!host.isConnected) return;
      let L = local(); if (c && c.api) L = L.concat(c.api.map(fromApi));
      else { // sem resposta da API: as avaliações da estante (como antes), para a aba não ficar vazia
        try { lib().forEach((e) => { const r = e.status === 'LIDO' ? reviewOfLib(e) : null; if (r && (r.paws || String(r.texto || '').trim()) && r.share !== false) L.push({ f: 'aval', c: 'av2', a: 'Avaliou ' + (r.paws ? stars(r.paws) : ''), t: e.title, cv: e.cover, tx: String(r.texto || '').trim(), at: e.finishedAt || e.statusAt || '', v: 'local', e }); }); } catch {} }
      if (c && !ro) L = L.concat((c.ecos || []).map((x) => { const e = byTitle(x.title); return { f: 'ecos', c: 'eco', a: '<span class="mst2"></span>Eco · pág. ' + x.page + ((typeof v9EcoStat === 'function' && v9EcoStat(x)) ? ' · ' + v9EcoStat(x) : ''), t: x.title, cv: e && e.cover, tx: '“' + (x.text || '') + '”', at: x.createdAt, v: 'rede', eco: x }; }));
      if (ro) { const pv = (socialProfile && socialProfile.privacy) || {}; L = L.filter((x) => x.v !== 'local' || (x.f === 'prog' && pv.reading !== false)); }
      L.sort((a, b) => String(b.at || '').localeCompare(String(a.at || '')));
      const V = L.filter((x) => f === 'tudo' || x.f === f).slice(0, 40);
      const html = '<div class="v8atc">' + F().map(([k, n]) => '<button type="button" data-af="' + k + '" class="' + (f === k ? 'on' : '') + '">' + n + '</button>').join('') + '</div>'
        + (V.length ? V.map((x, i) => '<div class="v8mp"><button type="button" class="pcv" data-bk="' + i + '" aria-label="' + esc(x.t || '') + '">' + cvh(x.t || '', x.cv || null, '') + '</button><div class="tx"><span class="v8pa ' + x.c + '">' + x.a + '</span>' + (x.tx ? '<p>' + esc(x.tx.slice(0, 280)) + '</p>' : '<p>' + esc(x.t || '') + '</p>') + '<small>' + [when(x.at), quem(x.v)].filter(Boolean).join(' · ') + '</small></div>' + (ro ? '' : '<button type="button" class="mo" data-mo="' + i + '" aria-label="Opções">•••</button>') + '</div>').join('')
          : '<p class="v2wempty">' + (c ? 'Nada por aqui ainda.' : 'Carregando sua atividade…') + '</p>');
      if (host.dataset.v8 === html) return; host.dataset.v8 = html; host.innerHTML = html; try { paintCv(host); } catch {}
      host.querySelectorAll('[data-af]').forEach((b) => b.addEventListener('click', () => { S.v3atf = b.dataset.af; v3Ativ(d, host); }));
      host.querySelectorAll('[data-bk]').forEach((b) => b.addEventListener('click', () => { const x = V[+b.dataset.bk]; const e = (x && x.e) || byTitle(x && x.t); if (e) try { openBookPage(e); } catch {} }));
      host.querySelectorAll('[data-mo]').forEach((b) => b.addEventListener('click', async () => { const x = V[+b.dataset.mo]; if (!x) return;
        if (x.it) { try { return v6Sheet('v6my', { it: x.it }); } catch {} return; }
        if (x.eco) { return v9Ask(b, 'Apagar este eco', async () => { try { const r = await sapi('DELETE', '/v1/echoes/' + encodeURIComponent(x.eco.id)); if (r.status < 300) { S.v4myEcos = null; try { V4ECO.clear(); } catch {} toast('Eco apagado'); const c2 = await load(true); paint(c2); } else toast('Não consegui apagar agora'); } catch { toast('Não consegui apagar agora'); } }); }
        if (x.e) { try { v5Menu(x.e); } catch { try { bookMenu(x.e); } catch {} } } }));
    };
    if (f === 'ecos' && typeof v4AtivEcos === 'function') { delete host.dataset.v8; return v4AtivEcos(d, host); }
    const c = S.v8atv; paint(c && Date.now() - c.t < 60000 ? c : null);
    load(false).then(paint).catch(() => {});
  };
}
