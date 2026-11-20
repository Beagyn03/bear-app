// Atualizar leitura mais simples (Bia, 17/11): o progresso em cima; embaixo três ações claras — Anotação, Trecho e
// Comentar — e cada uma abre só o que precisa. As datas viram uma linha discreta que abre quando a pessoa quiser.
{ const st = document.createElement('style'); st.textContent = `
#editor .up-dates.lz-hide{display:none!important}
.lz-dt{display:flex;justify-content:space-between;align-items:center;font-size:.76rem;font-weight:700;color:var(--ink-2);margin:-.1rem 0 .3rem}
#editor .lz-dt button{border:0!important;background:none!important;color:var(--acc)!important;font:inherit!important;font-weight:800!important;padding:0!important;height:auto!important;min-height:0!important;box-shadow:none!important}
.lz-acts{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.4rem;margin:.5rem 0 .2rem}
#editor .lz-acts button{min-width:0;white-space:normal;text-align:center;display:grid;justify-items:center;gap:.15rem;border:1.5px solid var(--line)!important;background:var(--panel)!important;color:var(--ink)!important;border-radius:14px!important;padding:.55rem .3rem!important;height:auto!important;min-height:0!important;font:inherit!important;font-size:.8rem!important;font-weight:800!important;box-shadow:none!important}
#editor .lz-acts button span{font-size:1.05rem;line-height:1}#editor .lz-acts button small{display:block;font-size:.64rem;font-weight:700;color:var(--ink-2)}
#editor .lz-acts button.on{border-color:var(--acc)!important;background:color-mix(in srgb,var(--acc) 14%,var(--panel))!important}
.lz-pane{display:grid;gap:.35rem;margin:.3rem 0 .2rem}.lz-pane[hidden]{display:none!important}
.lz-pane textarea{width:100%;box-sizing:border-box;border:1px solid var(--line);border-radius:12px;background:var(--panel);color:var(--ink);font:inherit;font-size:.9rem;padding:.55rem .65rem;min-height:72px;resize:vertical}
.lz-pane .lz-row{display:flex;gap:.5rem;align-items:center;justify-content:space-between;font-size:.76rem;color:var(--ink-2);font-weight:700}
.lz-pane input[type=number]{width:80px;height:34px;border:1px solid var(--line);border-radius:10px;background:var(--panel);color:var(--ink);font:inherit;padding:0 .5rem}
#editor .lz-pane .lz-ok{height:36px!important;min-height:0!important;border-radius:10px!important;border:0!important;background:var(--acc)!important;color:var(--on-acc,#fff)!important;font:inherit!important;font-weight:800!important;padding:0 .9rem!important;box-shadow:none!important}
#editor .up-note.lz-hide{display:none!important}#editor .up-note .up-fe{display:none!important}
.lz-fe{display:flex;flex-wrap:wrap;gap:.3rem;align-items:center;margin:.1rem 0 .2rem}.lz-fe:empty,.lz-fe[hidden]{display:none!important}
.lz-fe span{border:1px solid var(--acc);color:var(--acc);border-radius:99px;padding:.15rem .55rem;font-size:.74rem;font-weight:800}
#editor.ss-modal .ed-body > *{min-width:0;max-width:100%}`; TR.append(st); }
{ let tm = 0; const put = () => {
    const ed = TR.querySelector('#editor'); if (!ed || ed.hidden) return; const body = ed.querySelector('.ed-body'); if (!body || !body.querySelector('#up-save') || body.querySelector('.lz-acts')) return;
    const note = body.querySelector('.up-note'), dates = body.querySelector('.up-dates'); if (!note) return;
    const R = (() => { try { return reading(); } catch { return null; } })(); if (!R) return; const e = R.e;
    // 'Terminei o livro' abre o status Lido novo (datas, nota, resenha…)
    const fin = body.querySelector('#up-fin'); if (fin) fin.addEventListener('click', (ev) => { ev.stopImmediatePropagation(); ev.preventDefault(); statusSheet(e, 'LIDO'); }, true);
    // datas discretas
    if (dates && !body.querySelector('.lz-dt')) { dates.classList.add('lz-hide'); const ini = (dates.querySelector('.ud-ini') || {}).value;
      const dl = document.createElement('div'); dl.className = 'lz-dt'; dl.innerHTML = '<span>' + (ini ? 'Comecei em ' + ini.slice(8, 10) + '/' + ini.slice(5, 7) : 'Sem data de início') + ' · leitura de hoje</span><button type="button">Mudar datas</button>';
      dates.before(dl); dl.querySelector('button').addEventListener('click', () => { dates.classList.remove('lz-hide'); dl.remove(); }); }
    // três ações
    const acts = document.createElement('div'); acts.className = 'lz-acts';
    acts.innerHTML = '<button type="button" data-p="nota"><span><i class=v3e data-i=pen></i></span>Anotação<small>só você vê</small></button><button type="button" data-p="trecho"><span>❝</span>Trecho<small>guardar uma frase</small></button><button type="button" data-p="emo"><span><i class=v3e data-i=heart></i></span>Emoções<small>até 3</small></button><button type="button" data-p="coment"><span><i class=v3e data-i=reply></i></span>Comentar<small>vai para a Comunidade</small></button>';
    const pNota = document.createElement('div'); pNota.className = 'lz-pane'; pNota.hidden = true;
    pNota.innerHTML = '<textarea maxlength="2000" placeholder="Uma anotação sobre o livro (só você vê)"></textarea><div class="lz-row"><span>fica salva no livro</span></div>';
    const tn = pNota.querySelector('textarea'); tn.value = e.note || ''; tn.addEventListener('input', () => { e.note = tn.value.trim() ? tn.value : undefined; if (!e.note) delete e.note; save(); });
    const pTr = document.createElement('div'); pTr.className = 'lz-pane'; pTr.hidden = true;
    pTr.innerHTML = '<textarea maxlength="600" placeholder="Copie aqui o trecho que você gostou"></textarea><div class="lz-row"><label>pág. <input type="number" min="1" class="lz-pg"></label><button type="button" class="lz-ok">Salvar trecho</button></div>';
    const rng = body.querySelector('#up-r'); pTr.querySelector('.lz-pg').value = (rng && rng.value) || R.now || '';
    pTr.querySelector('.lz-ok').addEventListener('click', () => { const t = pTr.querySelector('textarea').value.trim(); if (!t) return toast('Escreva o trecho');
      e.quotes = [...(e.quotes || []), { t, p: Number(pTr.querySelector('.lz-pg').value) || null, at: new Date().toISOString() }].slice(-200); save(); pTr.querySelector('textarea').value = ''; toast('Trecho salvo'); });
    const feRow = document.createElement('div'); feRow.className = 'lz-fe';
    const paintFe = () => { const N = S.upNote || { fe: [] }; feRow.innerHTML = (N.fe || []).map((k) => '<span>' + esc((QT_FEELS.find((x) => x[0] === k) || [, k])[1]) + '</span>').join(''); };
    const pFe = document.createElement('div'); pFe.className = 'lz-pane'; pFe.hidden = true;
    const drawFe = () => { const N = S.upNote || (S.upNote = { text: '', fe: [], vis: 'public', sp: false }); const pick = N.fe || (N.fe = []);
      pFe.innerHTML = QT_GROUPS.map(([g, list]) => '<div class="fe-gt">' + esc(g) + '</div><div class="fe-grid">' + list.map(([k, n]) => '<button type="button" data-f="' + k + '" class="' + (pick.includes(k) ? 'on' : '') + '">' + esc(n) + '</button>').join('') + '</div>').join('') + '<small class="fe-cnt">' + pick.length + ' de 3 · como você está se sentindo nesta parte?</small>';
      pFe.querySelectorAll('[data-f]').forEach((b) => b.addEventListener('click', () => { const k = b.dataset.f; if (pick.includes(k)) N.fe = pick.filter((x) => x !== k); else if (pick.length < 3) pick.push(k); else return toast('Até 3 emoções');
        drawFe(); paintFe(); acts.querySelector('[data-p=emo] small').textContent = N.fe.length ? N.fe.length + ' escolhida' + (N.fe.length > 1 ? 's' : '') : 'até 3'; })); };
    note.classList.add('lz-hide'); note.before(acts); acts.after(feRow); feRow.after(pNota); pNota.after(pTr); pTr.after(pFe); paintFe();
    const panes = { nota: pNota, trecho: pTr, emo: pFe };
    acts.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => { const k = b.dataset.p, was = b.classList.contains('on');
      acts.querySelectorAll('button').forEach((x) => x.classList.remove('on')); pNota.hidden = true; pTr.hidden = true; pFe.hidden = true; feRow.hidden = false; note.classList.add('lz-hide');
      if (was) return; b.classList.add('on'); if (k === 'coment') { note.classList.remove('lz-hide'); note.querySelector('textarea')?.focus(); } else if (k === 'emo') { drawFe(); pFe.hidden = false; feRow.hidden = true; } else { panes[k].hidden = false; panes[k].querySelector('textarea').focus(); } }));
    if (e.note) { /* mostra que já tem anotação */ acts.querySelector('[data-p=nota] small').textContent = 'tem anotação'; }
  };
  new MutationObserver(() => { try { put(); } catch {} }).observe(TR, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] }); }

{ const st = document.createElement('style'); st.textContent = '.fe-grid{display:flex;flex-wrap:wrap;gap:.4rem;margin:.4rem 0 .3rem}.fe-grid button{border:1.5px solid var(--line);background:var(--panel);color:var(--ink);border-radius:99px;padding:.45rem .8rem;font:inherit;font-size:.86rem;font-weight:800;cursor:pointer}.fe-grid button.on{background:var(--acc);border-color:var(--acc);color:var(--on-acc,#fff)}.fe-cnt{display:block;text-align:right;font-size:.72rem;color:var(--ink-2);margin-bottom:.5rem}'; document.head.append(st); }
// as emoções agora abrem dentro do #editor (raiz do app): o estilo precisa estar lá também
{ const st = document.createElement('style'); st.textContent = `#editor .fe-grid{display:flex;flex-wrap:wrap;gap:.35rem;margin:.1rem 0 .2rem}
#editor .fe-grid button{border:1.5px solid var(--line)!important;background:var(--panel)!important;color:var(--ink)!important;border-radius:99px!important;padding:.35rem .75rem!important;height:auto!important;min-height:0!important;font:inherit!important;font-size:.82rem!important;font-weight:800!important;box-shadow:none!important;cursor:pointer}
#editor .fe-grid button.on{background:var(--acc)!important;border-color:var(--acc)!important;color:var(--on-acc,#fff)!important}
#editor .fe-gt{font-size:.66rem;font-weight:900;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-2);margin:.35rem 0 .15rem}
#editor .fe-cnt{display:block;font-size:.72rem;font-weight:700;color:var(--ink-2)}`; TR.append(st); }
