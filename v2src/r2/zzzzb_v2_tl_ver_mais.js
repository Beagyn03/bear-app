// ---------- v2: anotação longa recolhida com "Ver mais" (Bia, 26/11) ----------
// No histórico do Atualizar leitura (constelação), anotação, trecho ou comentário longo ocupava a tela inteira.
// Agora o texto mostra até 6 linhas; "Ver mais" abre tudo e "Ver menos" recolhe. As linhas da constelação são refeitas.
// Vale nos dois lugares onde o histórico aparece: a página Atualizar da v2 (#v6hist, dentro da raiz do v4; o v6Css copia
// para lá as regras "#editor .cs…") e o #editor antigo.
{ const st = document.createElement('style'); st.textContent = `
#editor .cs-n .tl-c p.tlx{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:6;line-clamp:6;overflow:hidden}
#editor .cs-n .tl-c p.tlx.open{display:block;-webkit-line-clamp:unset;line-clamp:unset;overflow:visible}
#editor .cs-n .tl-c .tlx-b{display:inline-block;margin-top:.3rem;border:0;background:none;padding:.2rem 0;font:inherit;font-size:.82rem;font-weight:800;color:var(--acc);cursor:pointer}
`; TR.append(st); }
function tlxFit(root) {
  if (!root) return; const redo = new Set();
  root.querySelectorAll('.cs-n .tl-c p:not([data-tlx])').forEach((p) => {
    if (!p.offsetParent) return; // ainda invisível: mede depois
    p.dataset.tlx = '1'; p.classList.add('tlx');
    if (p.scrollHeight <= p.clientHeight + 2) { p.classList.remove('tlx'); return; } // cabe: fica como estava
    const tl = p.closest('.tl'); if (tl) redo.add(tl);
    const b = document.createElement('button'); b.type = 'button'; b.className = 'tlx-b'; b.textContent = 'Ver mais';
    b.addEventListener('click', (ev) => { ev.stopPropagation(); const open = p.classList.toggle('open'); b.textContent = open ? 'Ver menos' : 'Ver mais';
      try { csLines(p.closest('.tl')); } catch {} });
    p.after(b);
  });
  // o texto encolheu: as linhas da constelação (svg absoluto com a altura antiga) precisam ser refeitas, senão a página fica
  // com um trecho vazio embaixo e a linha desce até ele (Bia 26/11)
  redo.forEach((tl) => { try { csLines(tl); } catch {} });
}
// #editor antigo (raiz TR)
{ let tm = 0; new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; const ed = TR.querySelector('#editor'); if (ed && !ed.hidden) tlxFit(ed); }, 60); }).observe(TR, { childList: true, subtree: true }); }
// página Atualizar da v2: o histórico é repintado dentro de #v6hist
{ const _hp = v6HistPaint; const seen = new WeakSet();
  v6HistPaint = function (H) { const r = _hp.apply(this, arguments);
    try { requestAnimationFrame(() => tlxFit(H));
      if (H && !seen.has(H)) { seen.add(H); let tm = 0; new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; tlxFit(H); }, 60); }).observe(H, { childList: true, subtree: true }); }
    } catch (err) { console.warn('ver mais', err); } return r; }; }
