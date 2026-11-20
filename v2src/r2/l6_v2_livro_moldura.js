// Página do livro + Moldura/selo + #editor limpo (Bia, 20/11).
// G. Aba Minha leitura: o cartão Status deixa de ter seletor (duplicava o menu do livro) e o botão da ação principal
//    ("Ler agora"/"Atualizar leitura"/"Avaliar" de quem já leu), que já estão no topo; vira texto "Lendo · pág. X de Y · Z%".
//    Os números (início, fim, dias, pág./dia, focos) ficam. Mudar a situação só pelo "•••".
// H. Aba Comunidade: sai o cartão "Convidar alguém para ler junto" (Ler junto fica no "•••" e no Hoje).
// N. Moldura e selo saem da v2: sem item em Editar perfil/menus, sem editor, sem moldura no avatar nem selo no nome.
//    As escolhas salvas não são apagadas, só não são usadas.
// + #editor limpo: ao fechar, sai tudo que uma folha anterior deixou fora do .ed-body e as classes extras.
{ const st = document.createElement('style'); st.textContent = `
#shelflist .bp-card:has(> .bp-btn[data-a=buddy]){display:none!important}
#shelflist .bp-card .bp-btn.pri[data-a=now],#shelflist .bp-card .bp-btn.pri[data-a=upd]{display:none!important}
#shelflist .bp-row .v6sttxt{font-weight:800;color:var(--ink);font-size:.9rem;text-align:right}
#aj-flair,#pf-flair,.fd-badge{display:none!important}
[data-avh].framed{--frame:none!important}
`; TR.append(st); }
{ // G: cartão Status como texto
  const fix = () => { const v = $('#shelflist'); if (!v || v.hidden) return;
    v.querySelectorAll('select.bp-st:not([data-v6])').forEach((sel) => { sel.dataset.v6 = '1'; const card = sel.closest('.bp-card'); const lbl = sel.options[sel.selectedIndex] ? sel.options[sel.selectedIndex].text : '';
      const small = card && card.querySelector('.bp-small'), pct = card && card.querySelector('.rc-prog em');
      const t = document.createElement('span'); t.className = 'v6sttxt'; t.textContent = [lbl, small ? small.textContent.replace(/^página/, 'pág.') : '', pct ? pct.textContent : ''].filter(Boolean).join(' · ');
      sel.style.display = 'none'; sel.after(t); const lab = sel.parentElement && sel.parentElement.querySelector(':scope > span'); if (lab && /status/i.test(lab.textContent)) lab.textContent = 'Situação';
      if (small) small.style.display = 'none';
      // quem já leu: o "Avaliar/Editar" do cartão da avaliação repete a ação principal ("Minha avaliação")
      if (sel.value === 'LIDO') v.querySelectorAll('.bp-card .bp-link[data-a=rate]').forEach((b) => { b.style.display = 'none'; });
    }); };
  let tm = 0; new MutationObserver(() => { if (!tm) tm = setTimeout(() => { tm = 0; fix(); }, 60); }).observe($('#shelflist') || TR, { childList: true, subtree: true });
}
{ // N: moldura e selo
  try { flairSheet = function () { toast('Moldura e selo saíram desta versão'); }; } catch {}
  try { editFrames = function () {}; } catch {}
  try { paintFlairs = function () { TR.querySelectorAll('[data-avh].framed').forEach((n) => n.classList.remove('framed')); TR.querySelectorAll('.fd-badge').forEach((n) => n.remove()); }; } catch {}
  const _pm = popMenu; popMenu = function (anchor, items) { return _pm.call(this, anchor, (items || []).filter((x) => !(x && /^Moldura e selo/.test(String(x.label || ''))))); };
}
{ // #editor: nada de uma folha vaza para a próxima
  const ed = $('#editor'); if (ed) { const keep = new Set([...ed.children]), base = new Set([...ed.classList]);
    const prune = () => { [...ed.children].forEach((c) => { if (!keep.has(c)) c.remove(); }); [...ed.classList].forEach((c) => { if (!base.has(c) && c !== 'ntpage') ed.classList.remove(c); }); const b = ed.querySelector('.ed-body'); if (b) { b.removeAttribute('style'); b.className = 'ed-body'; } };
    new MutationObserver(() => { if (ed.hidden) prune(); }).observe(ed, { attributes: true, attributeFilter: ['hidden'] }); }
}
