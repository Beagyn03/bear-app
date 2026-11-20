// Estantes no perfil: uma regra só (Bia, 20/11). Estante criada pela pessoa aparece no perfil se "Quem vê = Pública" (s.priv
// falso). A tela "O que aparece no meu perfil" › Escolher estantes liga/desliga esse mesmo "Quem vê", e a ordem de lá é a do
// perfil. Na primeira vez, a escolha antiga (prefs.profShelves) vira a verdade: o que estava marcado fica pública, o resto
// fica "só você"; depois disso vale só s.priv. Listas automáticas (Melhores avaliados, Lidos recentes...) seguem na tela.
// Perfil real, prévia ("como as amizades veem") e resumo publicado usam a mesma regra.
{ const isSh = (k) => String(k).startsWith('sh:');
  const mine = () => (db.shelves || []).filter((s) => !s.arch);
  const migrate = () => { db.prefs = db.prefs || {}; if (db.prefs.v6privMig) return; const p = db.prefs.profShelves;
    if (Array.isArray(p)) mine().forEach((s) => { s.priv = !p.includes('sh:' + s.id); });
    db.prefs.v6privMig = 1; try { save(); } catch {} };
  // profShelves sempre espelha s.priv (mantém a ordem escolhida; pública nova entra no fim)
  const sync = () => { db.prefs = db.prefs || {}; const p = Array.isArray(db.prefs.profShelves) ? db.prefs.profShelves : (typeof PROF_SH_DEFAULT !== 'undefined' ? PROF_SH_DEFAULT.slice() : []);
    const pub = new Set(mine().filter((s) => !s.priv).map((s) => 'sh:' + s.id));
    const kept = p.filter((k) => !isSh(k) || pub.has(k)), extra = [...pub].filter((k) => !kept.includes(k));
    db.prefs.profShelves = [...kept, ...extra]; };
  window.v6ProfOrder = () => { sync(); return db.prefs.profShelves.filter(isSh).map((k) => mine().find((s) => 'sh:' + s.id === k)).filter(Boolean); };
  try { migrate(); sync(); } catch {}
  const _ps = profShelvesSnap; profShelvesSnap = function () { try { migrate(); sync(); } catch {} return _ps.apply(this, arguments); };
  // "Quem vê" mudado pela folha da estante (v5priv) ou pelo formulário: o perfil acompanha
  const _vs = v5Sheet; v5Sheet = function () { const r = _vs.apply(this, arguments); try { const R = v4Root(); if (R && !R.dataset.v6pv) { R.dataset.v6pv = 1; R.addEventListener('click', (ev) => { const b = ev.target.closest('[data-a]'); if (b && /^v5(priv|shdel|arch|unarch)/.test(b.dataset.a)) setTimeout(() => { try { sync(); save(); publishSnapshotSoon(); } catch {} }, 200); }, true); } } catch {} return r; };
  // tela "O que aparece no meu perfil": marcar estante = pública; sem Conquistas; toggles do protótipo
  const st = document.createElement('style'); st.textContent = `
body > .sheet form.pv2 input[type=checkbox]{appearance:none;-webkit-appearance:none;width:38px;height:22px;border-radius:99px;background:color-mix(in srgb,var(--ink,#2a2233) 22%,transparent);position:relative;flex:none;cursor:pointer;transition:background .15s;margin:0 12px 0 0!important}
body > .sheet form.pv2 input[type=checkbox]::after{content:"";position:absolute;left:3px;top:3px;width:16px;height:16px;border-radius:50%;background:#fff;transition:left .15s}
body > .sheet form.pv2 input[type=checkbox]:checked{background:var(--acc,#c46f2e)}body > .sheet form.pv2 input[type=checkbox]:checked::after{left:19px}
body > .sheet form.pv2 .v6hide{display:none!important}
body > .sheet form.pv2 label:has(> input[type=checkbox]){display:flex!important;align-items:center;gap:0}
body > .sheet form.pv2 input[type=checkbox]::before{display:none!important}`; document.head.append(st);
  const _ss = socialSettingsSheet; socialSettingsSheet = async function () { try { migrate(); sync(); } catch {} const r = await _ss.apply(this, arguments);
    const form = document.querySelector('body > .sheet form.pv2'); if (!form) return r;
    [...form.querySelectorAll('.ck-row, .pv2-shr, label')].forEach((x) => { if (/^\s*Conquistas/.test(x.textContent)) x.classList.add('v6hide'); });
    form.querySelectorAll('.pv2-sh input[data-k]').forEach((i) => { const k = i.dataset.k; if (!isSh(k)) return; const s = mine().find((x) => 'sh:' + x.id === k); if (s) i.checked = !s.priv;
      i.addEventListener('change', () => { const s2 = mine().find((x) => 'sh:' + x.id === k); if (s2) { s2.priv = !i.checked; save(); } }); });
    form.addEventListener('submit', () => { try { sync(); save(); } catch {} });
    return r; };
  // prévia: só as estantes públicas, na ordem do perfil, sem nenhum controle de dono
  const _vb = v3Build; v3Build = function (v, d) { const r = _vb.apply(this, arguments);
    try { const body = v.querySelector('.sl-body'), pE = body && body.querySelector(':scope > .v3pane[data-k=est]'); if (!pE || !d || !d.self) return r;
      if (!S.v3prev) { if (pE.dataset.v6pv) { delete pE.dataset.v6pv; delete pE.dataset.mysig; } return r; }
      const L = window.v6ProfOrder(), sig = JSON.stringify(L.map((s) => [s.id, (s.bookIds || []).length]));
      if (pE.dataset.v6pv === sig && pE.querySelector(':scope > [data-v6pv]')) return r; pE.dataset.v6pv = sig;
      const card = (s) => { const B = v5ShBooks(s), lid = B.filter((e) => e.status === 'LIDO').length;
        return '<div class="pshelf"><div class="hd"><b>' + esc(s.name) + '</b><small>' + plural(B.length, 'livro', 'livros') + (lid ? ' · ' + plural(lid, 'lido', 'lidos') : '') + '</small></div><div class="covers">' + B.slice(0, 7).map((e) => '<span class="scv">' + cvh(e.title, e.cover, '') + '</span>').join('') + '</div></div>'; };
      pE.innerHTML = L.length ? '<div class="v4psh" data-v6pv="1">' + L.map(card).join('') + '</div>' : '<p class="v2wempty" data-v6pv="1">Nenhuma estante no perfil.</p>';
      try { paintCv(pE); } catch {}
    } catch (err) { console.warn('prévia estantes', err); }
    return r; };
  // prévia só leitura: some qualquer controle de dono que ainda sobre
  const s2 = document.createElement('style'); s2.textContent = `
.sl-body.v6prev .v4mysh-bar,.sl-body.v6prev [data-v3=top5],.sl-body.v6prev .v2wadd,.sl-body.v6prev .v2tip,.sl-body.v6prev [data-del],.sl-body.v6prev .v3hubw,.sl-body.v6prev .v3tpe,.sl-body.v6prev .rd-more,.sl-body.v6prev [data-tip]{display:none!important}
.sl-body.v6noread .v3lag{display:none!important}`; TR.append(s2);
}
