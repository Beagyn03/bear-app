// Tela única de status (Bia, 17/11): no topo do "Atualizar" e das ações de status do menu do livro, a fileira
// Lendo · Lido · Pausado · Quero ler · Abandonei; o conteúdo muda conforme o chip e só salva ao confirmar.
// Lendo = atualizar leitura de sempre; Lido = avaliação (Terminei); Pausado/Quero ler/Abandonei = painéis curtos.
{ const st = document.createElement('style'); st.textContent = `
.ss-dates{display:grid;grid-template-columns:1fr 1fr;gap:.45rem}.ss-dates label{display:grid;gap:.15rem;font-size:.7rem;font-weight:800;color:var(--ink-2)}
.ss-nd{display:flex!important;align-items:center;gap:.4rem;font-size:.78rem!important;font-weight:700!important;color:var(--ink-2)!important;margin:.35rem 0 .1rem}
.ss-nota{display:grid;gap:.1rem;margin:.3rem 0 .5rem}.ss-stars{display:flex;gap:.1rem}.ss-stars button{border:0!important;background:none!important;padding:.1rem!important;width:40px!important;height:40px!important;min-height:0!important;box-shadow:none!important;line-height:0}
.ss-stars svg{width:32px;height:32px;display:block}.ss-fr{font-size:.74rem;font-weight:700;color:var(--ink-2);padding-left:.2rem}
.ss-nrow{display:flex;align-items:center;justify-content:space-between;gap:.5rem}
.ss-nvb{flex:none;border:1.5px dashed var(--acc)!important;background:none!important;color:var(--acc)!important;border-radius:12px!important;height:auto!important;min-height:0!important;padding:.4rem .55rem!important;font:inherit!important;font-size:.74rem!important;font-weight:800!important;max-width:110px;line-height:1.15;box-shadow:none!important}
.ss-nvb.has{border-style:solid!important}.ss-nvs{display:flex;flex-wrap:wrap;gap:.3rem;margin:-.2rem 0 .4rem}.ss-nvs:empty{display:none}
.ss-nvs .nv-tag{display:inline-flex;align-items:center;gap:.3rem;border:1px solid var(--line);border-radius:99px;padding:.12rem .5rem;font-size:.7rem;font-weight:800}
.ss-lb{display:grid;gap:.2rem;font-size:.7rem;font-weight:800;color:var(--ink-2);margin:.2rem 0 .15rem}
.ss-rv{width:100%;box-sizing:border-box;border:1px solid var(--line);border-radius:12px;background:var(--panel);color:var(--ink);font:inherit;font-size:.88rem;padding:.5rem .65rem;resize:vertical;min-height:64px}
.ss-rvc{display:block;text-align:right;font-size:.66rem;color:var(--ink-2);min-height:.8rem}
.ss-ck{display:flex!important;flex-wrap:wrap;align-items:center;gap:.4rem;font-size:.82rem!important;font-weight:800!important;color:var(--ink)!important;margin:.15rem 0}.ss-ck small{font-weight:600;font-size:.68rem;color:var(--ink-2)}.ss-ck[hidden]{display:none!important}
.ss-rs{display:grid;grid-template-columns:1fr 1fr;gap:.4rem;margin-bottom:.6rem}.ss-rs button{border:1.5px solid var(--line)!important;background:var(--panel)!important;color:var(--ink)!important;border-radius:12px!important;height:38px!important;min-height:0!important;font:inherit!important;font-size:.78rem!important;font-weight:800!important;box-shadow:none!important}
.ss-rs button.on[data-r=deu]{border-color:#7a5cd6!important;background:color-mix(in srgb,#7a5cd6 18%,var(--panel))!important}.ss-rs button.on[data-r=curou]{border-color:#2f8a52!important;background:color-mix(in srgb,#2f8a52 18%,var(--panel))!important}
.ss-go.green{background:#2f8a52!important;border-color:#2f8a52!important;color:#fff!important}
.ss-chips{display:flex;gap:.25rem;overflow-x:auto;scrollbar-width:none;margin:.1rem -.2rem .6rem;padding:0 .2rem}.ss-chips::-webkit-scrollbar{display:none}
.ss-chips button{flex:1 1 auto;white-space:nowrap;border:1.5px solid var(--line)!important;background:var(--panel)!important;color:var(--ink-2)!important;border-radius:99px!important;height:32px!important;min-height:0!important;padding:0 .45rem!important;font:inherit!important;font-size:.72rem!important;font-weight:800!important;cursor:pointer;box-shadow:none!important}
.ss-chips button.on{color:#fff!important}
.ss-chips button.on[data-s=LENDO]{background:var(--acc)!important;border-color:var(--acc)!important;color:var(--on-acc,#fff)!important}
.ss-chips button.on[data-s=LIDO]{background:#2f8a52!important;border-color:#2f8a52!important}
.ss-chips button.on[data-s=HIBERNANDO]{background:#7a5cd6!important;border-color:#7a5cd6!important}
.ss-chips button.on[data-s=QUERO]{background:#c9962b!important;border-color:#c9962b!important}
.ss-chips button.on[data-s=ABANDONEI]{background:#8a7f78!important;border-color:#8a7f78!important}
.ss-hd{display:flex;align-items:center;gap:.6rem;margin:0 2.2rem .55rem 0}.ss-hd b{font-size:.98rem;color:var(--ink);line-height:1.2}.ss-hd small{display:block;font-size:.74rem;color:var(--ink-2);font-weight:700}
.ss-p{display:grid;gap:.5rem}.ss-p p{margin:0;font-size:.86rem;color:var(--ink-2);line-height:1.4}.ss-p p b{color:var(--ink)}
.ss-p label{display:grid;gap:.2rem;font-size:.72rem;font-weight:800;color:var(--ink-2)}
.ss-p input[type=date]{height:38px!important;min-height:0!important;border:1px solid var(--line);border-radius:10px;background:var(--panel);color:var(--ink);font:inherit;font-size:.86rem;padding:0 .55rem}
.ss-p textarea{min-height:64px;border:1px solid var(--line);border-radius:10px;background:var(--panel);color:var(--ink);font:inherit;font-size:.88rem;padding:.5rem .6rem;resize:vertical}
.ss-p .ss-cnt{justify-self:end;font-size:.66rem;color:var(--ink-2);margin-top:-.3rem}
.ss-p .ss-sp{display:flex!important;grid-template-columns:none;align-items:center;gap:.45rem;font-size:.82rem;color:var(--ink)}.ss-p .ss-sp input{width:18px;height:18px}
.ss-go{height:44px!important;min-height:0!important;border:0!important;border-radius:14px!important;background:var(--acc)!important;color:var(--on-acc,#fff)!important;font:inherit!important;font-weight:800!important;font-size:.92rem!important;cursor:pointer}
.ss-go.gray{background:#8a7f78!important;color:#fff!important}.ss-go.purple{background:#7a5cd6!important;color:#fff!important}.ss-go.gold{background:#c9962b!important;color:#fff!important}
.ss-link{border:0!important;background:none!important;color:var(--acc)!important;font:inherit!important;font-weight:800!important;font-size:.82rem!important;padding:.2rem 0!important;height:auto!important;min-height:0!important;justify-self:center;cursor:pointer;box-shadow:none!important}`; TR.append(st); }
const SS_LIST = [['LENDO', 'Lendo'], ['LIDO', 'Lido'], ['HIBERNANDO', 'Pausado'], ['QUERO', 'Quero ler'], ['ABANDONEI', 'Abandonei']];
const ssChips = (cur) => '<div class="ss-chips" role="tablist" aria-label="Status do livro">' + SS_LIST.map(([k, n]) => '<button type="button" role="tab" data-s="' + k + '"' + (k === cur ? ' class="on" aria-selected="true"' : '') + '>' + n + '</button>').join('') + '</div>';
// abre a atualização de leitura de um livro (o do Hoje ou outro em andamento)
function ssOpenUpdate(e) {
  const R = (() => { try { return reading(); } catch { return null; } })();
  if (R && R.e.id === e.id) return S.madrugada ? wakeBear('upd') : editLeitura();
  const tt = db.toca || (db.toca = {}), prev = tt.currentId; tt.currentId = e.id; try { editLeitura(); } finally { tt.currentId = prev; }
}
function statusSheet(e, want, after) {
  if (!e) return; after = after || (() => { try { const v = $('#shelflist'); if (!v.hidden && S.listRedraw) S.listRedraw(); refresh(); } catch {} });
  if (want === 'LENDO') { closeEd(); if (e.status === 'LENDO') return ssOpenUpdate(e); }
  const ed = $('#editor'); ed.classList.add('compact');
  const info = (() => { try { return readingInfo(e); } catch { return { now: 0, total: 0 }; } })(), pg = info.now || 0, tot = info.total || Number(e.totalPages) || 0, today = todayISO();
  const stLbl = { LENDO: 'lendo', LIDO: 'lido', HIBERNANDO: 'pausado', QUERO: 'na fila', ABANDONEI: 'abandonado' }[e.status] || '';
  const rv0 = ((typeof reviewOfLib === 'function' ? reviewOfLib(e) : e.review) || {});
  let cur = want, nota = Number(rv0.paws) || 0, niv = { ...(rv0.niveis || {}) }, ress = rv0.ressaca === 'deu' || rv0.ressaca === 'curou' ? rv0.ressaca : (rv0.ressaca === true ? 'deu' : null);
  const done = (msg) => { closeEd(); save(); try { after(); } catch {} try { renderHome(todayISO()); } catch {} if (msg) toast(msg); };
  const apply = (s) => { setLibStatus(e, s); if (e.status !== s) return false; return true; }; // livro de meta: setLibStatus avisa e não troca
  const draw = () => {
    let p = '';
    if (cur === 'LENDO') p = '<p>' + (e.status === 'LENDO' ? 'Você já está lendo este livro.' : 'Volta para <b>Lendo</b>' + (pg ? ', de onde parou (pág. ' + pg + ')' : '') + '.') + '</p><button type="button" class="ss-go" data-a="lendo">' + (e.status === 'LENDO' ? 'Atualizar leitura' : 'Começar a ler') + '</button>';
    else if (cur === 'LIDO') p = '<div class="ss-dates"><label>Comecei em<input type="date" class="ss-ini" max="' + today + '" value="' + esc(e.startedAt || '') + '"></label><label>Terminei em<input type="date" class="ss-fim" max="' + today + '" value="' + esc(e.finishedAt || today) + '"></label></div>'
      + '<label class="ss-nd"><input type="checkbox" class="ss-ndk"' + (e.noDate ? ' checked' : '') + '> Não lembro as datas</label>'
      + '<div class="ss-nrow"><div class="ss-nota"><div class="ss-stars"></div><small class="ss-fr"></small></div><button type="button" class="ss-nvb"></button></div><div class="ss-nvs"></div>'
      + '<label class="ss-lb">Resenha (opcional)<textarea class="ss-rv" maxlength="2000" rows="3" placeholder="O que você achou?">' + esc(rv0.texto || '') + '</textarea></label><small class="ss-rvc"></small>'
      + '<label class="ss-ck ss-rsp"><input type="checkbox" class="ss-rspk"' + (rv0.spoiler ? ' checked' : '') + '> Contém spoiler <small>quem não leu vê um aviso antes</small></label>'
      + '<label class="ss-ck"><input type="checkbox" class="ss-prv"' + (rv0.share === false ? ' checked' : '') + '> Avaliação privada <small>só você vê</small></label>'
      + '<div class="ss-lb">Ressaca literária</div><div class="ss-rs"><button type="button" data-r="deu"' + (rv0.ressaca === 'deu' ? ' class="on"' : '') + '>Me deu ressaca</button><button type="button" data-r="curou"' + (rv0.ressaca === 'curou' ? ' class="on"' : '') + '>Curou minha ressaca</button></div>'
      + '<button type="button" class="ss-go green" data-a="lido">Marcar como lido</button>';
    else if (cur === 'HIBERNANDO') p = '<p>Pausar na <b>pág. ' + pg + '</b>' + (tot ? ' de ' + tot : '') + '. Você retoma de onde parou quando quiser.</p><button type="button" class="ss-go purple" data-a="pausar">Pausar leitura</button>';
    else if (cur === 'QUERO') p = '<p>Volta para a fila do <b>Quero ler</b>.' + (pg ? ' O progresso (pág. ' + pg + ') fica guardado.' : '') + '</p><button type="button" class="ss-go gold" data-a="fila">Voltar para a fila</button>';
    else if (cur === 'ABANDONEI') p = '<label>Parei em<input type="date" class="ss-dt" max="' + today + '" value="' + esc(e.abandonedAt || today) + '"></label>'
      + '<label>Motivo (opcional)<textarea class="ss-mot" maxlength="280" placeholder="Ex.: ritmo lento, não era o momento…">' + esc(e.abandonReason || '') + '</textarea></label><small class="ss-cnt"></small>'
      + '<label class="ss-sp" hidden><input type="checkbox" class="ss-spk"' + (e.abandonSpoiler ? ' checked' : '') + '> Contém spoiler</label>'
      + '<button type="button" class="ss-go gray" data-a="abandonar">Marcar como abandonado</button><button type="button" class="ss-link" data-a="abav">Marcar e avaliar também</button>';
    ed.querySelector('.ed-body').innerHTML = '<button type="button" class="up-x" id="ss-x" aria-label="Fechar">×</button>'
      + '<div class="ss-hd">' + cvh(e.title, e.cover, 'ss-cv', 'width:40px;height:60px;flex:none;font-size:.4rem') + '<div><b>' + esc(e.title) + '</b><small>' + esc(stLbl) + (pg && e.status !== 'QUERO' ? ' · pág. ' + pg : '') + '</small></div></div>'
      + ssChips(cur) + '<div class="ss-p">' + p + '</div>';
    try { paintCv(ed); } catch {}
    ed.querySelector('#ss-x').addEventListener('click', closeEd);
    ed.querySelectorAll('.ss-chips button').forEach((b) => b.addEventListener('click', () => { const s = b.dataset.s; if (s === 'LENDO' && e.status === 'LENDO') { closeEd(); return ssOpenUpdate(e); } cur = s; draw(); }));
    const stars = ed.querySelector('.ss-stars');
    if (stars) { const FR = { 0.5: 'Socorro, o que foi isso?', 1: 'Não foi pra mim', 1.5: 'Quase abandonei', 2: 'Fraquinho', 2.5: 'Teve seus momentos', 3: 'Bom, mas não marcou', 3.5: 'Gostei bastante', 4: 'Muito bom!', 4.5: 'Quase perfeito', 5: 'Favorito da vida!' };
      const ds = () => { stars.replaceChildren(...[1, 2, 3, 4, 5].map((i) => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'nota ' + i); b.append(paw(pawFill(nota, i)));
          b.addEventListener('click', () => { nota = nota === i ? i - 0.5 : (i === 1 && nota === 0.5) ? 0 : i; ds(); }); return b; }));
        ed.querySelector('.ss-fr').textContent = nota ? 'nota ' + String(nota).replace('.', ',') + ' · ' + FR[nota] : 'Sua nota (opcional) · toque 2× = meia'; };
      ds();
      const nvb = ed.querySelector('.ss-nvb'), nvs = ed.querySelector('.ss-nvs');
      const pNv = () => { const ks = (typeof NIVEIS !== 'undefined' ? NIVEIS : []).filter(([k]) => niv[k] > 0); nvb.textContent = ks.length ? 'Níveis do enredo · ' + ks.length : '+ Níveis do enredo'; nvb.classList.toggle('has', ks.length > 0);
        nvs.innerHTML = ks.map(([k, n]) => '<span class="nv-tag">' + esc(n) + (typeof nivDots === 'function' ? nivDots(niv[k]) : ' ' + niv[k]) + '</span>').join(''); };
      nvb.addEventListener('click', () => { const sh = document.createElement('div'); sh.className = 'sheet nv-sheet'; const tmp = { ...niv };
        const dr = () => { sh.innerHTML = '<div class="box"><h3>Níveis do enredo</h3><p class="hint">Quanto o livro tem de cada coisa. Toque de novo para tirar.</p><div class="nv-list">' + NIVEIS.map(([k, n]) => '<div class="nv-row"><b>' + esc(n) + '</b><div class="nv-lv">' + [1, 2, 3, 4, 5].map((i) => '<button type="button" data-k="' + k + '" data-n="' + i + '"' + ((tmp[k] || 0) >= i ? ' class="on"' : '') + '>' + i + '</button>').join('') + '</div></div>').join('') + '</div><button type="button" class="primary nv-ok">Pronto</button></div>';
          sh.querySelectorAll('.nv-lv button').forEach((x) => x.addEventListener('click', () => { const k = x.dataset.k, n = Number(x.dataset.n); if (tmp[k] === n) delete tmp[k]; else tmp[k] = n; dr(); }));
          sh.querySelector('.nv-ok').addEventListener('click', () => { niv = tmp; pNv(); sh.remove(); }); };
        sh.addEventListener('click', (ev) => { if (ev.target === sh) sh.remove(); }); dr(); document.body.append(sh); });
      pNv();
      ed.querySelectorAll('.ss-rs button').forEach((b) => b.addEventListener('click', () => { ress = ress === b.dataset.r ? null : b.dataset.r; ed.querySelectorAll('.ss-rs button').forEach((x) => x.classList.toggle('on', x.dataset.r === ress)); }));
      const rvt = ed.querySelector('.ss-rv'), rvc = ed.querySelector('.ss-rvc'), rsp = ed.querySelector('.ss-rsp');
      const uRv = () => { rvc.textContent = rvt.value.length ? rvt.value.length + '/2000' : ''; }; rvt.addEventListener('input', uRv); uRv();
      const nd = ed.querySelector('.ss-ndk'), di = ed.querySelectorAll('.ss-dates input'); const syncNd = () => di.forEach((x) => { x.disabled = nd.checked; x.closest('label').style.opacity = nd.checked ? '.4' : ''; }); nd.addEventListener('change', syncNd); syncNd(); }
    const mot = ed.querySelector('.ss-mot');
    if (mot) { const cnt = ed.querySelector('.ss-cnt'), sp = ed.querySelector('.ss-sp'); const upd = () => { cnt.textContent = mot.value.length ? mot.value.length + '/280' : ''; sp.hidden = !mot.value.trim(); }; mot.addEventListener('input', upd); upd(); }
    const act = (a) => {
      if (a === 'lendo') { if (e.status === 'LENDO') { closeEd(); return ssOpenUpdate(e); } closeEd(); try { startReading(e); } catch { if (apply('LENDO')) done('Voltou para Lendo'); } return; }
      if (a === 'lido' || a === 'lidoav') {
        const nd = !!(ed.querySelector('.ss-ndk') || {}).checked, ini = (ed.querySelector('.ss-ini') || {}).value || '', fim = (ed.querySelector('.ss-fim') || {}).value || today;
        if (!nd && ini && fim && ini > fim) return toast('O início precisa ser antes do fim');
        const now = Number(e.currentPage) || pg;
        if (tot && now < tot) { if (!nd) e.readLog = [...(e.readLog || []), { id: uid(), date: today, pages: tot - now }]; e.currentPage = tot; }
        if (!apply('LIDO')) return;
        if (nd) { delete e.startedAt; delete e.finishedAt; e.noDate = true; } else { if (ini) e.startedAt = ini; e.finishedAt = fim > today ? today : fim; delete e.noDate; }
        const texto = ((ed.querySelector('.ss-rv') || {}).value || '').trim().slice(0, 2000), spk = !!(ed.querySelector('.ss-rspk') || {}).checked, prv = !!(ed.querySelector('.ss-prv') || {}).checked;
        const cleanNiv = Object.fromEntries(Object.entries(niv).filter(([, n]) => n > 0));
        if (nota || texto || ress || Object.keys(cleanNiv).length || prv) {
          let rv = (typeof reviewOfLib === 'function' ? reviewOfLib(e) : e.review); if (!rv) rv = e.review = { paws: 0, mel: [], frase: '' };
          rv.paws = nota; if (texto) rv.texto = texto; else delete rv.texto; rv.spoiler = spk; if (spk) rv.spoilerKind = 'end'; else delete rv.spoilerKind;
          rv.share = !prv; if (ress) rv.ressaca = ress; else delete rv.ressaca; if (Object.keys(cleanNiv).length) rv.niveis = cleanNiv; else delete rv.niveis;
          try { publishReview(e); } catch {} }
        if (a === 'lidoav') { save(); closeEd(); return rateForm(e, { logs: [] }, () => { try { after(); } catch {} }); }
        return done('Marcado como lido' + (nota ? ' · nota ' + String(nota).replace('.', ',') : ''));
      }
      if (a === 'pausar') { if (apply('HIBERNANDO')) done('Leitura pausada na pág. ' + pg); return; }
      if (a === 'fila') { if (apply('QUERO')) done('De volta ao Quero ler'); return; }
      if (a === 'abandonar' || a === 'abav') {
        const dt = ed.querySelector('.ss-dt').value || today, m = mot ? mot.value.trim().slice(0, 280) : '', spk = !!(ed.querySelector('.ss-spk') || {}).checked;
        if (!apply('ABANDONEI')) return;
        e.abandonedAt = dt > today ? today : dt; if (m) { e.abandonReason = m; e.abandonSpoiler = spk; } else { delete e.abandonReason; delete e.abandonSpoiler; } delete e.finishedAt;
        if (a === 'abav') { save(); closeEd(); return rateForm(e, { logs: [] }, () => { try { after(); } catch {} }); }
        done('Marcado como abandonado');
      }
    };
    ed.querySelectorAll('[data-a]').forEach((b) => b.addEventListener('click', () => act(b.dataset.a)));
  };
  draw(); ed.hidden = false;
}
// "Atualizar leitura": a mesma fileira no topo (Lendo marcado); os outros chips levam à tela única
{ let tm = 0; const put = () => {
    const ed = TR.querySelector('#editor'); if (!ed || ed.hidden) return; const h = ed.querySelector('.ed-body > .up-h'); if (!h || ed.querySelector('.ss-chips')) return;
    const R = (() => { try { return reading(); } catch { return null; } })(); if (!R) return; const e = R.e;
    const w = document.createElement('div'); w.innerHTML = ssChips('LENDO'); const ch = w.firstChild; const sub = ed.querySelector('.ed-body > .up-s'); (sub || h).after(ch);
    { const sub2 = ed.querySelector('.ed-body > .up-s'), info = (() => { try { return readingInfo(e); } catch { return { now: 0 }; } })(); const hd = document.createElement('div'); hd.className = 'ss-hd'; hd.innerHTML = cvh(e.title, e.cover, 'ss-cv', 'width:40px;height:60px;flex:none;font-size:.4rem') + '<div><b>' + esc(e.title) + '</b><small>lendo · pág. ' + (info.now || 0) + (info.total ? ' de ' + info.total : '') + '</small></div>'; h.before(hd); h.style.display = 'none'; if (sub2) sub2.style.display = 'none'; try { paintCv(hd); } catch {} }
    ch.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => { if (b.dataset.s !== 'LENDO') statusSheet(e, b.dataset.s); }));
  };
  new MutationObserver(() => { try { put(); } catch {} }).observe(TR, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] }); }
// Avaliação: "Não lembro as datas" (apaga as datas e marca noDate)
{ const st = document.createElement('style'); st.textContent = '.rtf-nd{display:flex;align-items:center;gap:.4rem;font-size:.76rem;font-weight:700;color:var(--ink-2);margin:-.2rem 0 .45rem;cursor:pointer}.rtf-nd input{width:16px;height:16px;margin:0}.rate-dates.nd input{opacity:.4;pointer-events:none}'; document.head.append(st);
  const _rf = rateForm; rateForm = function (b) {
    const r = _rf.apply(this, arguments);
    try {
      const wrap = [...document.querySelectorAll('body > .sheet')].pop(), form = wrap && wrap.querySelector('form'); if (!form) return r;
      const dates = form.querySelector('.rate-dates'); if (!dates || form.querySelector('.rtf-nd')) return r;
      const e = lib().find((x) => x === b || x.id === b.id) || b;
      const lb = document.createElement('label'); lb.className = 'rtf-nd'; lb.innerHTML = '<input type="checkbox"' + (e.noDate ? ' checked' : '') + '> Não lembro as datas'; dates.after(lb);
      const ck = lb.querySelector('input'), ins = [...dates.querySelectorAll('input[type=date]')]; let keep = ins.map((i) => i.value);
      const sync = () => { dates.classList.toggle('nd', ck.checked); if (ck.checked) { keep = ins.map((i) => i.value); ins.forEach((i) => { i.value = ''; }); } else ins.forEach((i, k) => { if (!i.value) i.value = keep[k] || ''; }); };
      ck.addEventListener('change', sync); if (ck.checked) sync();
      form.addEventListener('submit', () => { try { if (ck.checked) { delete e.startedAt; delete e.finishedAt; delete e.dateApprox; e.noDate = true; } else delete e.noDate; save(); } catch {} });
    } catch (err) { console.warn('não lembro as datas', err); }
    return r;
  }; }
