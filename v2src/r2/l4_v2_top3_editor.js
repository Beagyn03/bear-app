// Editor do Top 3 (Bia, 20/11): sai o "Seu top 5" antigo (setas e ×, sem como trocar). Três posições com capa, título e emoções;
// tocar numa posição abre "Trocar" (seus lidos, com filtro, ou qualquer livro pela busca) e o escolhido entra no lugar;
// posição vazia = "+ Escolher livro"; ↑↓ discretos para reordenar; Salvar/Cancelar. Quem tinha 5 vê os 3 primeiros e os
// outros 2 continuam guardados (o app usa a lista para indicar leituras).
{ const st0 = document.createElement('style'); st0.textContent = '.v6t3 .pos{width:30px;flex:none;font-family:var(--f-disp,serif);font-weight:900;color:var(--acc);font-size:18px}.v6t3 .li{align-items:center}.v6t3 .emo{display:flex;flex-wrap:wrap;gap:4px;margin-top:3px}.v6t3 .emo em{font-style:normal;font-size:11px;font-weight:800;border:1px solid var(--line);border-radius:99px;padding:1px 7px;color:var(--ink2)}.v6t3 .ud{display:flex;flex-direction:column;gap:2px;margin-left:auto}.v6t3 .ud button{width:30px;height:24px;border:0;background:none;color:var(--ink3);font-size:15px;line-height:1}.v6t3 .ud button:disabled{opacity:.25}.v6t3 .empty3{border:1.5px dashed var(--line);border-radius:14px;padding:16px 12px;text-align:center;font-weight:800;color:var(--acc);width:100%;background:none}.v6pk .li .cv,.v6t3 .li .cv{width:34px!important;height:51px!important;font-size:0!important;padding:0!important;flex:none}';
  TR.append(st0); }
{ const emoOf = (b) => { try { const e = lib().find((x) => normT(x.title) === normT(b.title)); return e && typeof v3Emo === 'function' ? (v3Emo(e) || []).slice(0, 3) : []; } catch { return []; } };
  const cover = (b) => { try { const e = lib().find((x) => normT(x.title) === normT(b.title)); return v4cv(e || { title: b.title, cover: b.cover || null }, '', 'width:34px;height:51px;font-size:0;padding:0;'); } catch { return ''; } };
  const reopen = () => { const st = v4State(); st.v5 = st.v5 || {}; v5Sheet('v6top', st.v5); };
  editTop5 = function () {
    const st = v4State(), all = top5Books(); st.v6T = all.slice(0, 3).map((b) => ({ title: b.title, author: b.author || null, cover: b.cover || null })); st.v6X = all.slice(3).map((b) => ({ title: b.title, author: b.author || null, cover: b.cover || null }));
    v5Sheet('v6top', {});
  };
  const _sh = v4SheetHTML; v4SheetHTML = function (k) {
    const st = v4State(), T = st.v6T || [];
    if (k === 'v6top') {
      const rows = [0, 1, 2].map((i) => { const b = T[i];
        if (!b) return `<div class="li"><span class="pos">${i + 1}º</span><button class="empty3" data-a="v6tpick" data-i="${i}">+ Escolher livro</button></div>`;
        const em = emoOf(b);
        return `<div class="li"><span class="pos">${i + 1}º</span><button class="li" style="flex:1;border:0;padding:0;background:none;min-width:0;gap:10px;display:flex;text-align:left" data-a="v6tpick" data-i="${i}">${cover(b)}<span class="t" style="min-width:0">${esc(b.title)}<small>${esc(b.author || '')} · tocar para trocar</small>${em.length ? `<span class="emo">${em.map((n) => '<em>' + esc(n) + '</em>').join('')}</span>` : ''}</span></button><span class="ud"><button data-a="v6tmv" data-i="${i}" data-d="-1" aria-label="Subir" ${i === 0 ? 'disabled' : ''}>↑</button><button data-a="v6tmv" data-i="${i}" data-d="1" aria-label="Descer" ${i >= T.length - 1 ? 'disabled' : ''}>↓</button></span></div>`; }).join('');
      return `<h3>Seu Top 3</h3><p class="mut" style="margin:0 0 8px">Os 3 livros que mais marcaram você. Aparecem no seu perfil e o app usa para indicar leituras.</p><div class="list v6t3">${rows}</div>
        <div class="row" style="gap:8px;margin-top:14px"><button class="btn s" style="flex:1" data-a="v6tcancel">Cancelar</button><button class="btn p" style="flex:2" data-a="v6tsave">Salvar</button></div>`;
    }
    if (k === 'v6toppick') {
      const i = st.v6Ti || 0, q = normT(st.v6Tq || ''), used = new Set(T.filter((b, j) => b && j !== i).map((b) => normT(b.title)));
      const L = lib().filter((e) => e.status === 'LIDO' && !used.has(normT(e.title)) && (!q || normT(e.title + ' ' + (e.author || '')).includes(q)))
        .sort((a, b) => ((reviewOfLib(b) || {}).paws || 0) - ((reviewOfLib(a) || {}).paws || 0) || String(b.finishedAt || '').localeCompare(String(a.finishedAt || ''))).slice(0, 40);
      const list = L.map((e) => { const p = (reviewOfLib(e) || {}).paws; return `<button class="li" data-a="v6tset" data-id="${esc(e.id)}">${cover(e)}<span class="t">${esc(e.title)}<small>${esc(e.author || '')}${p ? ' · ★ ' + String(p).replace('.', ',') : ''}</small></span></button>`; }).join('');
      return `<h3>${T[i] ? 'Trocar o ' + (i + 1) + 'º lugar' : 'Escolher o ' + (i + 1) + 'º lugar'}</h3>
        <label class="srch" style="display:flex;gap:8px;align-items:center;border:1.5px solid var(--line);border-radius:12px;padding:8px 10px;margin-bottom:6px"><input data-v6tq value="${esc(st.v6Tq || '')}" placeholder="Filtrar seus lidos" style="border:0;background:none;outline:0;font:inherit;flex:1;color:var(--ink)"></label>
        <div class="list v6pk" data-v6tl>${list || '<p class="mut" style="padding:8px 4px">Nenhum lido com esse nome.</p>'}</div>
        <div class="row" style="gap:8px;margin-top:10px"><button class="btn s" style="flex:1" data-a="v6tback">Voltar</button><button class="btn s" style="flex:2" data-a="v6tsearch">Buscar outro livro</button></div>`;
    }
    return _sh.apply(this, arguments);
  };
  const arm = () => { const R = v4Root(); if (!R || R.dataset.v6t) return; R.dataset.v6t = 1;
    R.addEventListener('input', (ev) => { const inp = ev.target.closest && ev.target.closest('[data-v6tq]'); if (!inp) return; ev.stopPropagation(); const st = v4State(); st.v6Tq = inp.value;
      const box = R.querySelector('[data-v6tl]'); if (!box) return; const tmp = document.createElement('div'); tmp.innerHTML = v4SheetHTML('v6toppick'); const nb = tmp.querySelector('[data-v6tl]'); if (nb) { box.innerHTML = nb.innerHTML;  } }, true);
    R.addEventListener('click', (ev) => { const b = ev.target.closest('[data-a]'); if (!b) return; const a = b.dataset.a; if (!/^v6t/.test(a)) return; ev.stopPropagation();
      const st = v4State(), T = st.v6T || (st.v6T = []);
      if (a === 'v6tpick') { st.v6Ti = +b.dataset.i; st.v6Tq = ''; st.sheet = 'v6toppick'; return v4Draw(); }
      if (a === 'v6tback') { st.sheet = 'v6top'; return v4Draw(); }
      if (a === 'v6tmv') { const i = +b.dataset.i, j = i + +b.dataset.d; if (j < 0 || j >= T.length) return; [T[i], T[j]] = [T[j], T[i]]; return v4Draw(); }
      if (a === 'v6tset') { const e = lib().find((x) => x.id === b.dataset.id); if (e) { const i = Math.min(st.v6Ti || 0, T.length); T[i] = { title: e.title, author: e.author || null, cover: e.cover || null }; } st.sheet = 'v6top'; return v4Draw(); }
      if (a === 'v6tsearch') { const i = st.v6Ti || 0; v5SheetClose(); setTimeout(() => { try { searchSheet({ title: 'Um livro do seu Top 3', onPick: (it) => { if (it && it.title) { const T2 = v4State().v6T || []; T2[Math.min(i, T2.length)] = { title: String(it.title).slice(0, 200), author: it.author || null, cover: it.cover || null }; v4State().v6T = T2; } setTimeout(reopen, 60); } }); } catch { reopen(); } }, 40); return; }
      if (a === 'v6tcancel') return v5SheetClose();
      if (a === 'v6tsave') { const keep = T.filter(Boolean), X = (st.v6X || []).filter((b) => !keep.some((k) => normT(k.title) === normT(b.title)));
        setTop5([...keep, ...X]); try { publishSnapshot(); } catch {} v5SheetClose(); toast('Top 3 salvo');
        const v = $('#shelflist'); if (v && !v.hidden && v.classList.contains('mine-page')) { try { openMyProfile(); } catch {} } }
    }, true); };
  const _vs = v5Sheet; v5Sheet = function () { const r = _vs.apply(this, arguments); try { arm(); } catch {} return r; };
}
