// Avaliação em página inteira (Bia, 16/11): capa no topo, título, autor, status, datas de início e de conclusão,
// depois as patas, a resenha (campo grande) e as demais opções; Salvar fixo embaixo. "Até onde vai o spoiler" sai: o app usa o progresso.
{ const st = document.createElement('style'); st.textContent = `
.sheet.rt-full{align-items:stretch!important;justify-content:stretch!important;padding:0!important;background:var(--bg)!important;backdrop-filter:none!important}
.sheet.rt-full > .box{position:fixed!important;inset:0!important;max-width:none!important;width:100%!important;max-height:none!important;height:100dvh!important;border-radius:0!important;margin:0!important;overflow-y:auto!important;padding:0 1rem calc(7.5rem + env(safe-area-inset-bottom))!important;background:var(--bg)!important;box-shadow:none!important;animation:none!important}
.sheet.rt-full > .box{display:block!important}
.sheet.rt-full .box > form{height:auto!important;max-height:none!important;overflow:visible!important;width:100%!important;max-width:560px!important;margin:0 auto!important;box-sizing:border-box}
.rtf-top{position:sticky;top:0;z-index:3;display:flex;align-items:center;justify-content:space-between;gap:.5rem;padding:.7rem 0 .5rem;background:var(--bg)}
.rtf-top b{font-size:1rem}.rtf-x{border:1px solid var(--line);background:var(--panel);color:var(--ink);border-radius:99px;padding:.35rem .85rem;font:inherit;font-weight:800}
.rtf-hd{display:grid;grid-template-columns:96px 1fr;grid-template-rows:auto;column-gap:.9rem;align-items:center;justify-items:start;text-align:left;margin:.3rem 0 .5rem}
.rtf-info{display:flex;flex-direction:column;align-items:flex-start;gap:.25rem;min-width:0}.rtf-info .rtf-cat{padding-left:0!important}
.rtf-hd .cv{display:grid;place-items:center;text-align:center;padding:.6rem;color:#fff;font-weight:900;font-size:1rem!important;line-height:1.15;background-color:var(--c);background-size:cover;background-position:center;text-shadow:0 1px 3px rgba(0,0,0,.4);width:96px;height:144px;border-radius:6px 10px 10px 6px;box-shadow:0 8px 18px rgba(0,0,0,.28);margin-bottom:0;font-size:.8rem}
.rtf-hd b{font-size:1.2rem;line-height:1.25}.rtf-hd small{font-size:.88rem;color:var(--ink-2);font-weight:700}
.rtf-st{display:inline-block;margin-top:.25rem;font-size:.75rem;font-weight:800;border:1px solid var(--line);border-radius:99px;padding:.15rem .7rem;background:var(--panel)}
.sheet.rt-full .rate-h{display:none!important}
.sheet.rt-full .rate-dates{display:grid!important;grid-template-columns:1fr 1fr;gap:.6rem}
.sheet.rt-full .rate-dates input{width:100%}
.sheet.rt-full .rt-dates{display:none!important}
.sheet.rt-full textarea{min-height:11rem!important;background:var(--panel)!important;color:var(--ink)!important;border:1px solid var(--line)!important;font-size:.95rem!important;line-height:1.5!important}
.rtf-acts{display:flex;gap:.4rem}.rtf-ed{border:0;background:var(--acc);color:var(--on-acc,#fff);border-radius:99px;padding:.4rem .95rem;font:inherit;font-weight:800}
.sheet.rt-full form{align-content:start!important;min-height:0!important;height:auto!important}.rtf-hd > *,.rtf-view > *{align-self:start}.rtf-view .rv-tags{align-items:flex-start}
.sheet.rt-view form > :not(.rtf-top):not(.rtf-hd):not(.rtf-view){display:none!important}
.rtf-view{display:grid;gap:.8rem;margin-top:.4rem}.rtf-view .rv-paws{text-align:center;font-size:1.5rem;font-weight:900;color:var(--acc)}
.rtf-view .rv-dates{display:grid;grid-template-columns:1fr 1fr;gap:.6rem}.rtf-view .rv-dates div{border:1px solid var(--line);background:var(--panel);border-radius:12px;padding:.5rem .7rem}.rtf-view .rv-dates small{display:block;font-size:.72rem;font-weight:800;color:var(--ink-2)}.rtf-view .rv-dates b{font-size:.95rem}
.rtf-view .rv-txt{white-space:pre-line;line-height:1.55;font-size:.95rem;border:1px solid var(--line);background:var(--panel);border-radius:14px;padding:.85rem .95rem;margin:0}
.rtf-view .rv-tags{display:flex;flex-wrap:wrap;gap:.35rem}.rtf-view .rv-tags span{font-size:.75rem;font-weight:800;border:1px solid var(--line);border-radius:99px;padding:.15rem .65rem;color:var(--ink-2)}
.sheet .rtf-cat{border:0!important;background:none!important;box-shadow:none!important;color:var(--acc)!important;font:inherit;font-weight:800;font-size:.85rem!important;padding:.3rem .5rem!important;margin-top:.1rem;min-height:0!important;width:auto!important}
.rv-sec{display:grid;gap:.45rem;margin-top:.4rem}.rv-sec h4{margin:.2rem 0 0;font-size:1rem}
.rv-q{margin:0;border-left:3px solid var(--acc);background:var(--panel);border-radius:0 12px 12px 0;padding:.55rem .8rem;font-style:italic;line-height:1.5}.rv-q small{display:block;font-style:normal;font-weight:800;color:var(--ink-2);font-size:.72rem;margin-top:.2rem}
.rv-note{margin:0;border:1px solid var(--line);background:var(--panel);border-radius:12px;padding:.55rem .8rem;white-space:pre-line}.rv-note small{display:block;font-weight:800;color:var(--ink-2);font-size:.72rem}
.rv-empty{margin:0;font-size:.86rem;color:var(--ink-2)}
.rv-add{justify-self:start;border:1.5px dashed var(--line);background:none;color:var(--ink);border-radius:12px;padding:.45rem .9rem;font:inherit;font-weight:800}
.rv-c{border:1px solid var(--line);background:var(--panel);border-radius:12px;padding:.5rem .75rem}.rv-c small{color:var(--ink-2)}.rv-c p{margin:.2rem 0 0;white-space:pre-line}
.rtf-st.st-lido,.rtf-st.st-concluido{background:#2f8a52!important;border-color:#2f8a52!important;color:#fff!important}
.rtf-lb{font-weight:800;font-size:.9rem;margin:.4rem 0 -.2rem}
.sheet.rt-full .rt-ress .yn{flex-wrap:wrap}.sheet.rt-full .rt-ress .yn button{padding:0 .85rem!important;font-size:.84rem}
.sheet.rt-full .rtf-rs{flex:1 1 200px;max-width:260px;height:42px;border-radius:12px;border:1px solid var(--line);background:var(--panel);color:var(--ink);font:inherit;font-weight:700;padding:0 .7rem}
.sheet.rt-full .rt-btns{position:fixed;left:0;right:0;bottom:0;z-index:4;padding:.55rem 1rem calc(.55rem + env(safe-area-inset-bottom));background:var(--bg);border-top:1px solid var(--line);max-width:none;margin:0;display:flex!important;justify-content:flex-end;gap:.5rem}
.sheet.rt-full .rt-btns button{min-height:40px!important;height:40px!important;padding:0 1.2rem!important;font-size:.92rem!important;width:auto!important;flex:none!important;border-radius:12px!important;margin:0!important}
.sheet.rt-full .rt-btns .primary{min-width:120px}
`; document.head.append(st); }
{ const _rf = rateForm; rateForm = function (b) {
  const r = _rf.apply(this, arguments);
  try {
    const wrap = [...document.querySelectorAll('body > .sheet')].pop(), form = wrap && wrap.querySelector('form.form'); if (!form || wrap.classList.contains('rt-full')) return r;
    wrap.classList.add('rt-full');
    const libE = lib().find((x) => x === b) || lib().find((x) => normT(x.title) === normT(b.title));
    const stK = (libE && libE.status) || b.status, stTxt = (typeof LIB_LABEL !== 'undefined' && LIB_LABEL[stK]) || ({ CONCLUIDO: 'Lido', LENDO: 'Lendo', PAUSADO: 'Pausado', NAO_INICIADO: 'Quero ler' })[stK] || '';
    const cover = (libE && libE.cover) || b.cover || null, author = (libE && libE.author) || b.author || '';
    const top = document.createElement('div'); top.className = 'rtf-top'; top.innerHTML = '<b>' + (b.review && b.review.paws ? 'Sua avaliação' : 'Avaliar') + '</b><button type="button" class="rtf-x">Fechar</button>';
    const hd = document.createElement('div'); hd.className = 'rtf-hd'; hd.innerHTML = cvh(b.title, cover, '') + '<div class="rtf-info"><b>' + esc(b.title) + '</b>' + (author ? '<small>' + esc(author) + '</small>' : '') + (stTxt ? '<span class="rtf-st st-' + esc(String(stK || '').toLowerCase()) + '">' + esc(stTxt) + '</span>' : '') + '<button type="button" class="rtf-cat">Ver no catálogo ›</button></div>';
    form.prepend(top, hd);
    top.querySelector('.rtf-x').addEventListener('click', () => wrap.remove());
    hd.querySelector('.rtf-cat').addEventListener('click', () => { wrap.remove(); try { if (libE) openBookPage(libE); else openAnyBook(b.title, author || null, cover); } catch (err) { console.warn('catálogo', err); } });
    // avaliação já salva: abre para ler; "Editar avaliação" no topo abre o formulário
    const rv = b.review || {};
    if (rv.paws || rv.texto || rv.frase) {
      wrap.classList.add('rt-view');
      const [ds, de] = (() => { const i = form.querySelector('.rate-dates input[name=ini]'), f = form.querySelector('.rate-dates input[name=fim]'); return [i && i.value, f && f.value]; })();
      const view = document.createElement('div'); view.className = 'rtf-view';
      view.innerHTML = (rv.paws ? '<div class="rv-paws">' + esc(pawTxt(rv.paws)) + '</div>' : '')
        + '<div class="rv-dates"><div><small>Comecei em</small><b>' + (ds ? fmt(ds) : '—') + '</b></div><div><small>Terminei em</small><b>' + (de ? fmt(de) : '—') + '</b></div></div>'
        + (rv.texto ? '<p class="rv-txt">' + esc(rv.texto) + '</p>' : rv.frase ? '<p class="rv-txt">' + esc(rv.frase) + '</p>' : '')
        + '<div class="rv-tags">' + [rv.spoiler ? 'Tem spoiler' : '', rv.share === false ? 'Só você vê' : rv.vis === 'friends' ? 'Só amizades veem' : 'Toda a comunidade vê', rv.ressaca === 'curou' ? 'Curou minha ressaca' : rv.ressaca ? 'Me deu ressaca' : ''].filter(Boolean).map((t) => '<span>' + t + '</span>').join('') + '</div>';
      hd.after(view);
      // embaixo da avaliação: trechos (e anotação) do livro e os comentários que a avaliação recebeu
      const qs = libE ? [...(libE.quotes || [])].sort((a, z) => (a.p || 99999) - (z.p || 99999)) : [];
      const tq = document.createElement('section'); tq.className = 'rv-sec';
      tq.innerHTML = '<h4>Trechos</h4>' + (libE && libE.note ? '<p class="rv-note"><small>Anotação</small>' + esc(libE.note) + '</p>' : '')
        + (qs.length ? qs.map((q) => '<blockquote class="rv-q">' + esc(q.t) + (q.p ? '<small>pág. ' + q.p + '</small>' : '') + '</blockquote>').join('') : '<p class="rv-empty">Nenhum trecho salvo deste livro.</p>')
        + (libE ? '<button type="button" class="rv-add">+ Salvar trecho</button>' : '');
      view.append(tq);
      tq.querySelector('.rv-add')?.addEventListener('click', () => { wrap.remove(); try { saveQuote(libE); } catch {} });
      if (rv.share !== false && libE && connected() && socialProfile) {
        const cm = document.createElement('section'); cm.className = 'rv-sec'; cm.innerHTML = '<h4>Comentários</h4><p class="rv-empty">Carregando…</p>'; view.append(cm);
        (async () => {
          try {
            const u = await sapi('GET', '/v1/users/' + encodeURIComponent(socialProfile.handle)); const mineRv = u.status === 200 && u.data && (u.data.reviews || []).find((x) => x.libId === libE.id || normT(x.title) === normT(libE.title));
            if (!mineRv) { cm.querySelector('.rv-empty').textContent = 'Sua avaliação ainda não foi publicada. Ela aparece para os outros depois de sincronizar.'; return; }
            const c = await sapi('GET', '/v1/reviews/' + encodeURIComponent(mineRv.id) + '/comments'); const items = c.status === 200 && c.data ? c.data.items || [] : [];
            cm.innerHTML = '<h4>Comentários' + (items.length ? ' · ' + items.length : '') + '</h4>' + (items.length ? items.map((x) => '<div class="rv-c"><b>' + esc((x.user && x.user.displayName) || '') + '</b> <small>@' + esc((x.user && x.user.handle) || '') + '</small><p>' + esc(x.text) + '</p></div>').join('') : '<p class="rv-empty">Ninguém comentou ainda.</p>');
          } catch { cm.querySelector('.rv-empty') && (cm.querySelector('.rv-empty').textContent = 'Não consegui carregar os comentários agora.'); }
        })();
      }
      const x = top.querySelector('.rtf-x'), acts = document.createElement('span'); acts.className = 'rtf-acts';
      acts.innerHTML = '<button type="button" class="rtf-ed">Editar avaliação</button>'; x.before(acts); acts.append(x);
      acts.querySelector('.rtf-ed').addEventListener('click', () => { wrap.classList.remove('rt-view'); view.remove(); acts.querySelector('.rtf-ed').remove(); top.querySelector('b').textContent = 'Editar avaliação'; wrap.querySelector('.box').scrollTop = 0; });
    }
    // datas sempre à vista, logo depois do cabeçalho; depois as patas; resenha com título
    const dates = form.querySelector('.rate-dates'), nota = form.querySelector('.rate-nota');
    if (dates) { dates.hidden = false; hd.after(dates); }
    if (nota) (dates || hd).after(nota);
    const ta = form.querySelector('textarea'), tl = ta && ta.closest('label');
    if (tl) { const lb = document.createElement('div'); lb.className = 'rtf-lb'; lb.textContent = 'Resenha'; tl.before(lb); ta.rows = 8; ta.placeholder = 'O que você achou? Conte do seu jeito (opcional)'; }
    // até onde vai o spoiler: o app já sabe (livro lido = até o final; lendo = até a página atual), não pergunta
    const spSel = form.querySelector('select[aria-label="Até onde vai o spoiler"]');
    if (spSel) { const box = spSel.parentElement, num = box.querySelector('input[type=number]'); box.style.setProperty('display', 'none', 'important');
      const pg = libE ? (() => { try { return libProgress(libE) || 0; } catch { return 0; } })() : 0;
      if (stK === 'LIDO' || stK === 'CONCLUIDO') spSel.value = 'end'; else if (pg > 0 && num) { spSel.value = 'page'; num.value = String(pg); } else spSel.value = 'yes'; }
    // spoiler em destaque: cartão com aviso, fica vermelho quando marcado
    { const spLb = [...form.querySelectorAll('label')].find((l) => /Tem spoiler/.test(l.textContent) && l.querySelector('input[type=checkbox]'));
      if (spLb) { const ck = spLb.querySelector('input[type=checkbox]'); spLb.classList.add('rtf-sp'); const sync = () => spLb.classList.toggle('on', ck.checked); ck.addEventListener('change', sync); sync();
        [...(spLb.parentElement || spLb).querySelectorAll('button')].filter((b) => b.textContent.trim() === '?').forEach((b) => b.style.setProperty('display', 'none', 'important'));
        if (!spLb.querySelector('.rtf-sp-h')) spLb.insertAdjacentHTML('beforeend', '<small class="rtf-sp-h">Marque se a resenha conta algo da história. Quem não leu verá um aviso antes.</small>'); } }
    // compartilhar vira o contrário: avaliação é visível por padrão; quem quiser marca como privada
    const shareLb = [...form.querySelectorAll('label.ck-row')].find((l) => /Compartilhar com meus amigos/.test(l.textContent));
    if (shareLb) { const shareCk = shareLb.querySelector('input'); const pv = document.createElement('label'); pv.className = 'ck-row'; pv.innerHTML = '<input type="checkbox"><span>Avaliação privada <small style="opacity:.7;font-weight:600">(só você vê)</small></span>';
      const pk = pv.querySelector('input'); pk.checked = !shareCk.checked; pk.addEventListener('change', () => { shareCk.checked = !pk.checked; }); shareLb.after(pv); shareLb.style.setProperty('display', 'none', 'important'); }
    // ressaca: lista suspensa (nem um nem outro / me deu / curou) no lugar dos dois botões; os botões originais ficam escondidos e guardam o valor
    const yn = form.querySelector('.yn');
    if (yn) {
      const btns = () => [...yn.querySelectorAll('button')], cur = () => { const i = btns().findIndex((x) => x.classList.contains('on')); return i === 0 ? 'deu' : i === 1 ? 'curou' : ''; };
      const pick = document.createElement('div'); pick.className = 'rtf-rs2'; pick.setAttribute('role', 'group'); pick.setAttribute('aria-label', 'Ressaca literária');
      pick.innerHTML = '<button type="button" data-v="deu"><b>Me deu ressaca</b><small>fiquei sem conseguir ler outro</small></button><button type="button" data-v="curou"><b>Curou minha ressaca</b><small>me tirou do bloqueio</small></button>';
      const paint = () => { const c = cur(); pick.querySelectorAll('button').forEach((b) => { const on = b.dataset.v === c; b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); }); };
      pick.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => { const want = b.dataset.v === cur() ? '' : b.dataset.v, now = cur();
        if (want === now) return; if (!want) btns()[now === 'deu' ? 0 : 1].click(); else btns()[want === 'deu' ? 0 : 1].click(); setTimeout(paint, 0); }));
      yn.style.setProperty('display', 'none', 'important'); yn.after(pick); paint();
    }
    try { paintCv(wrap); } catch {}
    wrap.querySelector('.box').scrollTop = 0;
  } catch (err) { console.warn('avaliação em página', err); }
  return r;
}; }
// Recarregar o app com a avaliação aberta volta para ela (Bia, 16/11): guarda o livro e o modo (ler/editar) na sessão.
{ const K = 'bear.rateOpen';
  const _rf2 = rateForm; rateForm = function (b) {
    const r = _rf2.apply(this, arguments);
    try {
      const wrap = [...document.querySelectorAll('body > .sheet.rt-full')].pop(); if (!wrap) return r;
      const put = () => { try { sessionStorage.setItem(K, JSON.stringify({ id: b.id || null, t: b.title, ed: !wrap.classList.contains('rt-view') })); } catch {} };
      put(); wrap.querySelector('.rtf-ed')?.addEventListener('click', () => setTimeout(put, 0));
      const tm = setInterval(() => { if (!wrap.isConnected) { clearInterval(tm); try { const c = JSON.parse(sessionStorage.getItem(K) || 'null'); if (c && c.t === b.title) sessionStorage.removeItem(K); } catch {} } }, 400);
    } catch {}
    return r;
  };
  setTimeout(() => {
    let c = null; try { c = JSON.parse(sessionStorage.getItem(K) || 'null'); } catch {} if (!c) return;
    const e = lib().find((x) => (c.id && x.id === c.id && normT(x.title) === normT(c.t))) || lib().find((x) => normT(x.title) === normT(c.t));
    if (!e) { try { sessionStorage.removeItem(K); } catch {} return; }
    try { rateForm(e, { logs: [] }, () => renderHome(todayISO())); if (c.ed) setTimeout(() => document.querySelector('.sheet.rt-full .rtf-ed')?.click(), 50); } catch (err) { console.warn('reabrir avaliação', err); }
  }, 1800);
}

{ const st = document.createElement('style'); st.textContent = `.rtf-rs2{display:grid;grid-template-columns:1fr 1fr;gap:.5rem;width:100%}
.rtf-rs2 button{display:grid;gap:.15rem;text-align:left;border:1.5px solid var(--line);background:var(--panel);color:var(--ink);border-radius:14px;padding:.6rem .7rem;font:inherit;cursor:pointer}
.rtf-rs2 button b{font-size:.86rem}.rtf-rs2 button small{font-size:.7rem;color:var(--ink-2);font-weight:600}
.rtf-rs2 button[data-v=deu].on{border-color:#7a5cd6;background:color-mix(in srgb,#7a5cd6 16%,var(--panel))}
.rtf-rs2 button[data-v=curou].on{border-color:#2f8a52;background:color-mix(in srgb,#2f8a52 16%,var(--panel))}
.rt-ress,.rt-ress:has(.rtf-rs2){flex-wrap:wrap}
label.rtf-sp{display:grid!important;grid-template-columns:auto 1fr;align-items:center;column-gap:.55rem;border:1.5px solid #d9822b;background:color-mix(in srgb,#d9822b 12%,var(--panel));border-radius:14px;padding:.6rem .75rem;font-weight:800;margin:.2rem 0}
label.rtf-sp input{width:20px;height:20px;accent-color:#c0392b}
label.rtf-sp .rtf-sp-h{grid-column:2;font-size:.72rem;font-weight:600;color:var(--ink-2)}
label.rtf-sp.on{border-color:#c0392b;background:color-mix(in srgb,#c0392b 16%,var(--panel))}`; document.head.append(st); }
