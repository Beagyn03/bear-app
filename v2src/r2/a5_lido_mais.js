// Tela de Lido (Bia, 18/11): "Mais sobre a leitura", fechado por padrão, com personagem favorito, personagem que amou odiar,
// como o livro te deixou (até 3 emoções), trecho favorito (escolhe dos salvos ou escreve outro) e a ressaca literária.
// Tudo opcional; vai em e.fin e alimenta a retrospectiva. Ao marcar como lido, a retrospectiva abre sozinha.
{ const st = document.createElement('style'); st.textContent = `
#editor .ss-more{margin:.2rem 0 .9rem;border:1.5px solid var(--line);border-radius:14px;background:var(--panel);overflow:hidden}
#editor .ss-more > summary{list-style:none;display:flex;align-items:center;gap:.5rem;padding:.7rem .85rem;cursor:pointer;font-weight:900;font-size:.9rem;color:var(--ink)}
#editor .ss-more > summary::-webkit-details-marker{display:none}
#editor .ss-more > summary small{display:block;font-weight:700;font-size:.72rem;color:var(--ink-2)}
#editor .ss-more > summary i{margin-left:auto;font-style:normal;color:var(--acc);transition:transform .2s}#editor .ss-more[open] > summary i{transform:rotate(90deg)}
#editor .ss-mb{padding:0 .85rem .85rem;display:grid;gap:.75rem}
#editor .ss-mb .ss-lb{margin:0}
#editor .ss-pp{display:grid;grid-template-columns:1fr 1fr;gap:.5rem}
#editor .ss-pp label{display:grid;gap:.2rem;font-size:.74rem;font-weight:800;color:var(--ink-2)}
#editor .ss-pp input,#editor .ss-qn textarea,#editor .ss-qn input{width:100%;box-sizing:border-box;border:1px solid var(--line);border-radius:10px;background:var(--bg);color:var(--ink);font:inherit;font-size:.86rem;padding:.5rem .6rem}
#editor .ss-fe{display:flex;flex-wrap:wrap;gap:.35rem}
#editor .ss-fe button{border:1.5px solid var(--line)!important;background:var(--bg)!important;color:var(--ink)!important;border-radius:99px!important;padding:.3rem .65rem!important;font:inherit!important;font-size:.76rem!important;font-weight:800!important;min-height:0!important;height:auto!important;box-shadow:none!important}
#editor .ss-fe button.on{background:var(--acc)!important;border-color:var(--acc)!important;color:var(--on-acc,#fff)!important}
#editor .ss-qs{display:grid;gap:.35rem}
#editor .ss-qs button{display:block;text-align:left;border:1.5px solid var(--line)!important;background:var(--bg)!important;color:var(--ink)!important;border-radius:12px!important;padding:.5rem .65rem!important;font:inherit!important;font-style:italic!important;font-size:.82rem!important;line-height:1.35!important;min-height:0!important;height:auto!important;box-shadow:none!important}
#editor .ss-qs button small{display:block;font-style:normal;font-size:.68rem;font-weight:800;color:var(--ink-2);margin-top:.15rem}
#editor .ss-qs button.on{border-color:var(--acc)!important;background:color-mix(in srgb,var(--acc) 10%,var(--bg))!important}
#editor .ss-qn{display:grid;grid-template-columns:1fr 5.5rem;gap:.4rem}#editor .ss-qn textarea{min-height:3.2rem;resize:vertical}
#editor .ss-h{font-size:.74rem;font-weight:800;color:var(--ink-2);margin-bottom:.3rem}
`; TR.append(st); }
{ const ed = $('#editor'); let tm = 0;
  const mount = () => {
    const go = ed.querySelector('.ss-go[data-a="lido"]'); if (ed.hidden || !go || ed.querySelector('.ss-more')) return;
    const e = S.tlE; if (!e) return; const F = e.fin || {}, N = { fe: [...(F.fe || [])], q: F.q ? { ...F.q } : null };
    const qs = (e.quotes || []).filter((x) => x && x.t);
    const fill = !!(F.fav || F.hate || (F.fe || []).length || F.q || (reviewOfLib(e) || {}).ressaca);
    const d = document.createElement('details'); d.className = 'ss-more'; if (fill) d.open = true;
    d.innerHTML = '<summary><span>Mais sobre a leitura<small>personagens, emoções, trecho favorito e ressaca</small></span><i>›</i></summary><div class="ss-mb">'
      + '<div class="ss-pp"><label>Personagem favorito<input type="text" class="ss-fav" maxlength="60" placeholder="Quem ganhou seu coração" value="' + esc(F.fav || '') + '"></label>'
      + '<label>Personagem que amei odiar<input type="text" class="ss-hate" maxlength="60" placeholder="Quem você não perdoa" value="' + esc(F.hate || '') + '"></label></div>'
      + '<div><div class="ss-h">Como o livro te deixou <span style="font-weight:700">(até 3)</span></div><div class="ss-fe">' + QT_PICK.map(([k, n]) => '<button type="button" data-f="' + k + '" class="' + (N.fe.includes(k) ? 'on' : '') + '">' + esc(n) + '</button>').join('') + '</div></div>'
      + '<div><div class="ss-h">Trecho favorito</div><div class="ss-qs">' + qs.slice(-6).reverse().map((x) => '<button type="button" data-t="' + esc(x.t) + '" data-p="' + (x.p || '') + '" class="' + (N.q && N.q.t === x.t ? 'on' : '') + '">“' + esc(x.t.length > 140 ? x.t.slice(0, 140) + '…' : x.t) + '”' + (x.p ? '<small>pág. ' + x.p + '</small>' : '') + '</button>').join('') + '</div>'
      + '<div class="ss-qn" style="margin-top:.4rem"><textarea class="ss-qt" maxlength="600" placeholder="' + (qs.length ? 'Ou escreva outro trecho' : 'Uma frase que você levou com você') + '">' + esc(N.q && !qs.some((x) => x.t === N.q.t) ? N.q.t : '') + '</textarea><input type="number" class="ss-qp" min="1" inputmode="numeric" placeholder="pág."></div></div>'
      + '</div>';
    go.before(d);
    // a ressaca entra no bloco
    const mb = d.querySelector('.ss-mb'), rl = [...ed.querySelectorAll('.ss-p > .ss-lb')].find((x) => /Ressaca/.test(x.textContent)), rs = ed.querySelector('.ss-p > .ss-rs');
    if (rl && rs) { const w = document.createElement('div'); w.append(rl, rs); mb.append(w); }
    d.querySelectorAll('.ss-fe button').forEach((b) => b.addEventListener('click', () => { const k = b.dataset.f; if (N.fe.includes(k)) N.fe = N.fe.filter((y) => y !== k); else if (N.fe.length < 3) N.fe.push(k); else return toast('Até 3 emoções'); b.classList.toggle('on', N.fe.includes(k)); }));
    d.querySelectorAll('.ss-qs button').forEach((b) => b.addEventListener('click', () => { const on = !b.classList.contains('on'); d.querySelectorAll('.ss-qs button').forEach((x) => x.classList.remove('on')); b.classList.toggle('on', on); N.q = on ? { t: b.dataset.t, p: Number(b.dataset.p) || undefined } : null; if (on) d.querySelector('.ss-qt').value = ''; }));
    d.querySelector('.ss-qt').addEventListener('input', () => d.querySelectorAll('.ss-qs button').forEach((x) => x.classList.remove('on')));
    // ao marcar como lido: guarda tudo antes da tela fechar e abre a retrospectiva
    go.addEventListener('click', () => {
      S.rtNoRate = Date.now();
      const fav = d.querySelector('.ss-fav').value.trim(), hate = d.querySelector('.ss-hate').value.trim(), qt = d.querySelector('.ss-qt').value.trim(), qp = Number(d.querySelector('.ss-qp').value) || undefined;
      let q = N.q; if (qt) { q = { t: qt.slice(0, 600), p: qp }; if (!(e.quotes || []).some((x) => x.t === q.t)) e.quotes = [...(e.quotes || []), { t: q.t, p: qp, at: new Date().toISOString() }]; }
      const fin = { ...(e.fin || {}) }; fav ? fin.fav = fav : delete fin.fav; hate ? fin.hate = hate : delete fin.hate; N.fe.length ? fin.fe = N.fe : delete fin.fe; q ? fin.q = q : delete fin.q;
      if (Object.keys(fin).length) e.fin = fin; else delete e.fin; save();
      // espera o que abrir por cima (conquista nova, avaliação) ser fechado; desiste depois de 3 minutos
      const t0 = Date.now(), tick = () => { try { if (e.status !== 'LIDO') return; const busy = !$('#editor').hidden || document.querySelector('.sheet') || TR.querySelector('.sheet');
        if (!busy) return openRetro(e, true); if (Date.now() - t0 < 180000) setTimeout(tick, 400); } catch (err) { console.warn('retro', err); } };
      setTimeout(tick, 450);
    }, true);
  };
  new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; mount(); }, 40); }).observe(ed, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
}
// quem marca como lido pela tela de Lido já deu nota e resenha ali: não abre a avaliação de novo (abre a retrospectiva)
{ const _rf = rateForm; rateForm = function () { if (S.rtNoRate && Date.now() - S.rtNoRate < 2000) { S.rtNoRate = 0; return; } return _rf.apply(this, arguments); }; }
