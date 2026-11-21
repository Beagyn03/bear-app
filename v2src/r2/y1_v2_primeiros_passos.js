// Primeiros passos (Bia, 21/11; protótipo v170): cartão no topo do Hoje com 4 etapas em sequência. Só a atual em destaque;
// "Pular esta etapa"; etapas futuras abrem direto ("abrir"); puladas ficam "pulada · fazer agora". × fecha (reabre em Ajustes › Ajuda).
// Cada etapa abre um caminho guiado nas telas reais (bloco y2). As dicas por evento aparecem uma vez cada, mesmo fora da ordem.
// "Completar seu perfil" fica como convite no Você.
{ const st = document.createElement('style'); st.textContent = `
.ppc{display:grid;gap:.55rem;margin:2px 0 14px;padding:14px;border:1px solid var(--line);border-radius:18px;background:var(--panel);color:var(--ink)}
.ppc .h{display:flex;align-items:center;gap:.5rem}.ppc .h b{flex:1;font-family:var(--v2-disp,inherit);font-size:1.12rem}.ppc .h small{color:var(--ink-2);font-weight:800;font-size:.8rem}
.ppc .x{width:40px;height:40px;display:grid;place-items:center;border:0;border-radius:12px;background:none;color:var(--ink);opacity:.7;cursor:pointer}
.ppc svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
.ppc .bar{height:5px;border-radius:9px;background:color-mix(in srgb,var(--ink) 10%,transparent);overflow:hidden}.ppc .bar i{display:block;height:100%;background:var(--acc);border-radius:9px}
.ppc .st{display:flex;align-items:center;gap:.65rem;min-height:44px;border-top:1px solid var(--line);padding-top:.5rem}
.ppc .st:first-of-type{border-top:0}
.ppc .n{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;flex:none;font-weight:900;font-size:.82rem;border:1.5px solid var(--line);color:var(--ink-2)}
.ppc .st.cur .n{background:var(--acc);border-color:var(--acc);color:var(--on-acc,#fff)}.ppc .st.ok .n{background:color-mix(in srgb,#3c9a63 85%,transparent);border-color:transparent;color:#fff}
.ppc .st .t{flex:1;min-width:0;font-weight:800;font-size:.95rem}.ppc .st .t small{display:block;font-weight:600;font-size:.8rem;color:var(--ink-2);margin-top:1px}
.ppc .st .r{border:0;background:none;color:var(--ink-2);font:inherit;font-weight:800;font-size:.8rem;min-height:40px;padding:0 4px;cursor:pointer}
.ppc .st .r.go{color:var(--acc)}
.ppc .acts{display:flex;flex-wrap:wrap;gap:.45rem;margin:.1rem 0 0 2.4rem}
.ppc .acts button{min-height:44px;padding:0 1rem;border-radius:99px;border:1.5px solid var(--line);background:none;color:var(--ink);font:inherit;font-weight:800;font-size:.88rem;cursor:pointer}
.ppc .acts button.p{background:var(--acc);border-color:var(--acc);color:var(--on-acc,#fff)}
.ppc .skip{justify-self:start;margin-left:2.4rem;border:0;background:none;color:var(--ink-2);font:inherit;font-size:.8rem;font-weight:700;text-decoration:underline;min-height:36px;padding:0;cursor:pointer}
.ppc .done{margin:0;color:var(--ink-2);font-size:.88rem}
.ppinv{display:flex;align-items:center;gap:.7rem;width:100%;margin:.6rem 0;padding:.75rem .9rem;border:1px dashed var(--line);border-radius:14px;background:none;color:var(--ink);font:inherit;text-align:left;cursor:pointer;min-height:56px}
.ppinv b{display:block;font-size:.92rem}.ppinv small{display:block;font-size:.78rem;color:var(--ink-2)}.ppinv svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.9;flex:none}
`; TR.append(st); }
const PP_ST = [
  ['biblio', 'Monte sua Biblioteca', 'traga de outro app ou busque o primeiro'],
  ['ler', 'Comece a ler', 'o livro vai para o Hoje; Ler abre a sessão'],
  ['fim', 'Termine um livro', 'e avalie, se quiser: a nota é opcional'],
  ['gente', 'Encontre sua gente', 'comente sem spoiler, peça amizade, leia junto'],
];
const ppArr = (k) => { const p = ppS() || {}; return Array.isArray(p[k]) ? p[k] : []; };
function ppCur() { const d = ppArr('done'), s = ppArr('skip'); const c = PP_ST.find(([k]) => !d.includes(k) && !s.includes(k)); return c ? c[0] : null; }
function ppActs(k) {
  const L = lib(), quero = L.some((e) => e.status === 'QUERO' || e.status === 'HIBERNANDO'), lendo = L.some((e) => e.status === 'LENDO');
  if (k === 'biblio') return [['imp', 'Trazer de outro app', 1], ['busca1', 'Buscar um livro']];
  if (k === 'ler') return lendo ? [['hoje2', 'Ver meu livro no Hoje', 1], ['busca2', 'Buscar uma nova leitura']] : quero ? [['bib2', 'Começar um livro da Biblioteca', 1], ['busca2', 'Buscar uma nova leitura']] : [['busca2', 'Buscar uma nova leitura', 1]];
  if (k === 'fim') return (lendo || lib().length) ? [['fim', 'Ver como terminar um livro', 1]] : [['busca2', 'Buscar uma nova leitura', 1]];
  if (k === 'gente') return [['gente', 'Encontrar minha gente', 1]];
  return [];
}
function ppCardHTML() {
  const p = ppS(); if (!p || !p.on || p.off) return '';
  const d = ppArr('done'), s = ppArr('skip'), cur = ppCur(), n = d.length, ns = s.length;
  const X = `<button type="button" class="x" data-pp="off" aria-label="Fechar Primeiros passos">${v4ic('x', 18)}</button>`;
  if (!cur && !ns) return `<section class="ppc" aria-label="Primeiros passos"><div class="h"><b>Tudo pronto</b>${X}</div><p class="done">Você já sabe o essencial. O guia fica em Ajustes › Ajuda, se quiser rever.</p></section>`;
  const rows = PP_ST.map(([k, t, sub], i) => {
    const ok = d.includes(k), sk = s.includes(k), on = k === cur;
    const right = ok ? '<span class="r">feito</span>' : sk ? `<button type="button" class="r go" data-pp="redo" data-k="${k}">pulada · fazer agora</button>` : on ? '' : `<button type="button" class="r" data-pp="open" data-k="${k}">abrir</button>`;
    let h = `<div class="st${on ? ' cur' : ''}${ok ? ' ok' : ''}"><span class="n" aria-hidden="true">${ok ? v4ic('ok', 16) : i + 1}</span><span class="t">${esc(t)}${on ? `<small>${esc(sub)}</small>` : ''}</span>${right}</div>`;
    if (on) h += `<div class="acts">${ppActs(k).map(([g, l, pri]) => `<button type="button" class="${pri ? 'p' : ''}" data-pp="go" data-g="${g}" data-k="${k}">${esc(l)}</button>`).join('')}</div><button type="button" class="skip" data-pp="skip" data-k="${k}">Pular esta etapa</button>`;
    return h; }).join('');
  const lab = cur ? `etapa ${PP_ST.findIndex(([k]) => k === cur) + 1} de 4` : `${n} de 4`;
  return `<section class="ppc" aria-label="Primeiros passos"><div class="h"><b>Primeiros passos</b><small>${lab}${ns ? ` · ${ns} pulada${ns > 1 ? 's' : ''}` : ''}</small>${X}</div>
    <div class="bar" role="progressbar" aria-label="${n} de 4 etapas feitas" aria-valuemin="0" aria-valuemax="4" aria-valuenow="${n}"><i style="width:${Math.round(((n + ns) / 4) * 100)}%"></i></div>${rows}</section>`;
}
// o cartão entra no topo do Hoje (mesmo lugar do cartão do dia), dentro da chave do Hoje
{ const _h = v3HeroHTML; v3HeroHTML = function () { let c = ''; try { c = ppCardHTML(); } catch {} return c + _h.apply(this, arguments); }; }
ppRepaint = function () { const old = TR.querySelector('#lista:not(.lista-snap) .ppc'), html = ppCardHTML();
  if (old) { if (!html) old.remove(); else { const t = document.createElement('div'); t.innerHTML = html; old.replaceWith(t.firstElementChild); } } };
// "Comece por aqui" antigo some enquanto o cartão está aberto (mesmas ações, em dobro)
{ const st = document.createElement('style'); st.textContent = '#lista.ppon [data-in=comece]{display:none!important}'; TR.append(st);
  new MutationObserver(() => { const l = TR.querySelector('#lista:not(.lista-snap)'); if (!l) return; const on = !!l.querySelector('.ppc'); if (l.classList.contains('ppon') !== on) l.classList.toggle('ppon', on); }).observe(TR, { childList: true, subtree: true }); }
function ppDone(k, how) { const d = ppArr('done'), s = ppArr('skip').filter((x) => x !== k); if (how === 'skip') { if (!d.includes(k) && !ppArr('skip').includes(k)) s.push(k); ppPut({ skip: s }); return; }
  if (!d.includes(k)) d.push(k); ppPut({ done: d, skip: s }); }
TR.addEventListener('click', (ev) => {
  const b = ev.target.closest && ev.target.closest('[data-pp]'); if (!b) return; ev.stopPropagation(); ev.preventDefault();
  const a = b.dataset.pp, k = b.dataset.k;
  if (a === 'off') { ppPut({ off: 1 }); toast('Primeiros passos fechado. Reabra em Ajustes › Ajuda.'); return; }
  if (a === 'skip') { ppDone(k, 'skip'); return; }
  if (a === 'open' || a === 'redo') { const s = ppArr('skip').filter((x) => x !== k), d = ppArr('done');
    // abrir uma etapa futura: as anteriores ficam puladas (dá para voltar a elas)
    const i = PP_ST.findIndex(([x]) => x === k); PP_ST.slice(0, i).forEach(([x]) => { if (!d.includes(x) && !s.includes(x)) s.push(x); });
    ppPut({ skip: s }); return; }
  if (a === 'go') { try { ppGuide(b.dataset.g, k); } catch (e) { console.warn('guia', e); } }
}, true);
// etapas que se completam sozinhas (pelo que a pessoa faz, mesmo fora do guia)
setInterval(() => { const p = ppS(); if (!p || !p.on || p.off || (typeof ppG !== 'undefined' && ppG)) return; let L; try { L = lib(); } catch { return; } const d = ppArr('done');
  // o Top 3 do primeiro acesso não conclui a etapa 1 (ela é trazer ou buscar livros)
  if (!d.includes('biblio') && L.some((e) => !e.fromTop3)) ppDone('biblio');
  if (!d.includes('fim') && L.some((e) => e.status === 'LIDO' && e.finishedAt && p.at && e.finishedAt >= p.at)) ppDone('fim');
}, 2500);
// ---------- dicas por evento: uma vez cada, mesmo fora da ordem ----------
const PP_TIPS = {
  livro: ['Seu primeiro livro', 'Na Biblioteca, segure a capa para mudar o status ou pôr numa estante.'],
  lendo: ['Seu livro está no Hoje', 'O cartão mostra seu progresso. Ler abre a sessão de leitura.'],
  sessao: ['Ecos', 'Frases de quem já passou por esta página aparecem na sessão. Em Deixar um eco, você deixa o seu.'],
  terminei: ['Sua avaliação', 'Aparece na Comunidade do livro e em Minha leitura. No ••• dela, edite ou apague.'],
};
// dicas por evento só depois do primeiro acesso e nunca por causa de uma importação (teste real 21/11, itens 2 e 5)
const ppQuiet = () => { const p = ppS() || {}; if (p.fs && p.fs !== 'ok') return true; if (Date.now() - (S.ppImpAt || 0) < 20000) return true;
  return !!document.querySelector('.lvdlg-bg, .ppab, .sheet') || !!TR.querySelector('#shelflist:not([hidden]) #gs-ok'); };
function ppTip(k) { const p = ppS(); if (!p || !p.on || (typeof ppG !== 'undefined' && ppG) || ppQuiet()) return; const T = ppArr('tips'); if (T.includes(k)) return; T.push(k); ppPut({ tips: T });
  const [t, x] = PP_TIPS[k]; try { ppBalloon({ t, x, btns: [['Entendi', () => ppClose()]], solo: true }); } catch {} }
{ let n0 = null, l0 = null, f0 = null;
  setInterval(() => { const p = ppS(); if (!p || !p.on) return; let L; try { L = lib(); } catch { return; }
    const n = L.length, l = L.filter((e) => e.status === 'LENDO').length, f = L.filter((e) => e.status === 'LIDO' && e.review).length;
    if (n0 !== null && (typeof ppG === 'undefined' || !ppG) && !ppQuiet()) {
      if (n0 === 0 && n > 0) ppTip('livro');
      else if (l > l0) ppTip('lendo');
      else if (f > f0) ppTip('terminei');
    }
    n0 = n; l0 = l; f0 = f;
    const eco = ppFind('[data-a=ecoed]'); if (eco && (typeof ppG === 'undefined' || !ppG) && !ppQuiet()) ppTip('sessao');
  }, 1500); }
// ---------- Completar seu perfil: convite no Você ----------
function ppPerfilOk() { const q = (db.prefs || {}).perfil || {}; return !!q.ok; }
function ppInv() { const p = ppS(); if (!p || !p.on || p.perfOff || ppPerfilOk()) return;
  const pb = TR.querySelector('.v3pb'); if (!pb || !pb.offsetParent || pb.parentElement.querySelector('.ppinv')) return;
  const b = document.createElement('button'); b.type = 'button'; b.className = 'ppinv';
  b.innerHTML = `${v4ic('pen', 18)}<span style="flex:1"><b>Complete seu perfil</b><small>foto, frase, gêneros, idiomas… tudo opcional</small></span>${v4ic('chev', 16)}`;
  b.addEventListener('click', () => ppPerfil()); pb.after(b); }
{ let tm = 0; new MutationObserver(() => { if (!tm) tm = setTimeout(() => { tm = 0; ppInv(); }, 200); }).observe(TR, { childList: true, subtree: true }); setInterval(ppInv, 1500); }
const PP_PERF = [
  ['foto', 'Foto e frase', 'aparecem no seu perfil · quem vê: quem pode ver seu perfil'],
  ['generos', 'Gêneros favoritos', 'vieram do primeiro acesso; deixam o Para você mais certeiro'],
  ['idiomas', 'Idiomas em que você lê', 'o Para você mostra edições nesses idiomas · só você vê'],
  ['formatos', 'Formatos', 'livro físico, e-book, audiolivro · só você vê'],
  ['cidade', 'Cidade e estado', 'opcional; ajuda em empréstimos e presentes · por enquanto só você vê'],
  ['desejos', 'Link da sua lista de desejos', 'ex.: Amazon: quem comprar por ali envia direto para você, sem a loja mostrar seu endereço (pode aparecer no rastreio) · por enquanto só você vê'],
];
function ppPerfil() {
  const q = { ...((db.prefs || {}).perfil || {}) }, tg = ((db.prefs || {}).taste || {}).genres || [];
  const ov = document.createElement('div'); ov.className = 'ppab ppperf'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Complete seu perfil'); ppVars(ov);
  ov.style.cssText += ';place-items:start center;overflow:auto';
  const chips = (k, L) => `<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">${L.map((x) => { const on = (q[k] || []).includes(x); return `<button type="button" data-ch="${k}" data-v="${esc(x)}" aria-pressed="${on}" style="min-height:40px;padding:0 .9rem;border-radius:99px;border:1.5px solid ${on ? 'var(--ppacc)' : 'var(--ppline)'};background:${on ? 'color-mix(in srgb,var(--ppacc) 20%,transparent)' : 'none'};color:inherit;font:inherit;font-weight:800;font-size:.85rem;cursor:pointer">${esc(x)}</button>`; }).join('')}</div>`;
  const inp = (k, ph, lab, type) => `<input data-f="${k}" type="${type || 'text'}" aria-label="${esc(lab)}" placeholder="${esc(ph)}" value="${esc(q[k] || '')}" style="margin-top:8px;width:100%;min-height:44px;padding:0 .8rem;border-radius:12px;border:1.5px solid var(--ppline);background:transparent;color:inherit;font:inherit">`;
  const ctl = { foto: `<button type="button" data-go="perfil" style="margin-top:8px;min-height:44px;padding:0 1rem;border-radius:99px;border:1.5px solid var(--ppline);background:none;color:inherit;font:inherit;font-weight:800;cursor:pointer">Editar foto e frase</button>`,
    generos: `<div style="margin-top:6px;font-size:.9rem">${tg.length ? esc(tg.join(', ')) : 'nenhum ainda'}</div><button type="button" data-go="gostos" style="margin-top:8px;min-height:44px;padding:0 1rem;border-radius:99px;border:1.5px solid var(--ppline);background:none;color:inherit;font:inherit;font-weight:800;cursor:pointer">Escolher gêneros</button>`,
    idiomas: chips('idiomas', ['Português', 'Inglês', 'Espanhol', 'Francês']), formatos: chips('formatos', ['Livro físico', 'E-book', 'Audiolivro']),
    cidade: inp('cidade', 'Ex.: Goiânia, GO', 'Cidade e estado'), desejos: inp('desejos', 'https://…', 'Link da lista de desejos', 'url') };
  const cnt = () => [((socialProfile || {}).avatarUrl || (socialProfile || {}).bio) ? 1 : 0, tg.length ? 1 : 0, (q.idiomas || []).length ? 1 : 0, (q.formatos || []).length ? 1 : 0, q.cidade ? 1 : 0, q.desejos ? 1 : 0].reduce((a, b) => a + b, 0);
  ov.innerHTML = `<div class="in" style="text-align:left;justify-items:stretch;gap:10px;padding:calc(18px + env(safe-area-inset-top)) 0 24px">
    <div style="display:flex;align-items:center;gap:8px"><h2 style="flex:1;font-size:1.3rem">Complete seu perfil</h2><button type="button" data-x aria-label="Fechar" style="width:44px;height:44px;border:0;background:none;color:inherit;cursor:pointer">${v4ic('x', 20)}</button></div>
    <p style="font-size:.9rem">Tudo aqui é opcional. Nunca pedimos seu endereço.</p><small id="ppcnt" style="font-weight:800;opacity:.8">${cnt()} de ${PP_PERF.length} preenchidos</small>
    ${PP_PERF.map(([k, t, s]) => `<div style="padding:12px;border:1px solid var(--ppline);border-radius:14px;background:var(--pppan)"><b style="display:block">${esc(t)}</b><small style="display:block;opacity:.75;margin-top:2px">${esc(s)}</small>${ctl[k]}</div>`).join('')}
    <div style="display:flex;gap:8px;margin-top:6px"><button type="button" data-sk style="flex:1;min-height:48px;border-radius:99px;border:1.5px solid var(--ppline);background:none;color:inherit;font:inherit;font-weight:800;cursor:pointer">Pular por agora</button><button type="button" class="ok" data-ok style="flex:1">Salvar</button></div></div>`;
  ov.querySelectorAll('svg').forEach((s) => { s.style.cssText += ';fill:none;stroke:currentColor;stroke-width:1.9'; });
  const close = () => { document.removeEventListener('keydown', key, true); ov.remove(); };
  const key = (ev) => { if (ev.key === 'Escape') { ev.stopPropagation(); close(); } };
  const keep = (ok) => { ov.querySelectorAll('[data-f]').forEach((i) => { q[i.dataset.f] = i.value.trim(); }); db.prefs = { ...(db.prefs || {}), perfil: { ...q, ...(ok ? { ok: 1 } : {}) } }; try { save(); } catch {} };
  ov.addEventListener('click', (ev) => { const t = ev.target.closest('button'); if (!t) return;
    if (t.dataset.ch) { const k = t.dataset.ch, v = t.dataset.v, L = new Set(q[k] || []); L.has(v) ? L.delete(v) : L.add(v); q[k] = [...L]; const on = L.has(v); t.setAttribute('aria-pressed', on); t.style.borderColor = on ? 'var(--ppacc)' : 'var(--ppline)'; t.style.background = on ? 'color-mix(in srgb,var(--ppacc) 20%,transparent)' : 'none'; ov.querySelector('#ppcnt').textContent = cnt() + ' de ' + PP_PERF.length + ' preenchidos'; return; }
    if (t.dataset.go === 'perfil') { keep(); close(); S.ajMode = 'perfil'; goTab('perfil'); return; }
    if (t.dataset.go === 'gostos') { keep(); close(); openTaste(); return; }
    if ('x' in t.dataset) return close();
    if ('sk' in t.dataset) { keep(); close(); ppPut({ perfOff: 1 }); return; }
    if ('ok' in t.dataset) { keep(true); close(); toast('Perfil salvo'); TR.querySelectorAll('.ppinv').forEach((x) => x.remove()); } });
  ov.addEventListener('input', (ev) => { if (ev.target.dataset.f) { q[ev.target.dataset.f] = ev.target.value.trim(); ov.querySelector('#ppcnt').textContent = cnt() + ' de ' + PP_PERF.length + ' preenchidos'; } });
  document.addEventListener('keydown', key, true); document.body.append(ov); ov.querySelector('[data-x]').focus({ preventScroll: true });
}
