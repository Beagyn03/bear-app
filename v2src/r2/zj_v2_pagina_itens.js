// ---------- Página dos itens = página salva (Bia, 22/11) ----------
// No "Atualizar leitura" (#editor), emoções e comentário iam para o diário com a página do controle deslizante
// (#up-r), mas o progresso é salvo pelo número (#up-n), que no modo % arredonda e, se der igual à página atual,
// nem salva. Resultado: "Emoções · pág. 108" com o livro em 81. Antes de qualquer outro tratamento do clique
// (fase de captura no TR, acima do #editor), o controle passa a valer exatamente a página que vai ser salva.
// O "Salvar trecho" do painel guarda a página do campo dele; se essa página for a do controle e ainda não estiver
// salva, a página é salva junto (o mesmo que tocar em Salvar).
{ const upPage = (ed) => {
    const n = ed.querySelector('#up-n'), r = ed.querySelector('#up-r'); if (!n || !r) return null;
    const total = Number(r.max) || 0, pct = !!ed.querySelector('.up-seg [data-m=pct].on') && !ed.classList.contains('tempo');
    const v = Math.max(0, Math.round(Number(n.value) || 0));
    return Math.min(total, pct ? Math.round((Math.min(100, v) / 100) * total) : v);
  };
  TR.addEventListener('click', (ev) => {
    const ed = TR.querySelector('#editor'); if (!ed || ed.hidden || !ev.target.closest) return;
    const t = ev.target.closest('#up-save, #up-fin, .lz-ok'); if (!t || !ed.contains(t) || t.disabled) return;
    const r = ed.querySelector('#up-r'); if (!r) return;
    if (t.id === 'up-save') { if (ed.classList.contains('tempo')) return; const p = upPage(ed); if (p != null && String(p) !== String(r.value)) r.value = p; return; }
    if (t.classList.contains('lz-ok')) {
      const R = (() => { try { return reading(); } catch { return null; } })(); if (!R) return;
      const pane = t.closest('.lz-pane'), pgIn = pane && pane.querySelector('.lz-pg'), qp = pgIn ? Number(pgIn.value) || 0 : 0;
      const sv = ed.querySelector('#up-save'), slider = Number(r.value) || 0;
      if (!sv || sv.disabled || !qp || qp !== slider || slider === R.now) return;
      // no modo % o número arredonda: o trecho e o controle ficam na página que vai ser salva de fato
      const p = upPage(ed); if (p != null && p !== qp) { pgIn.value = p; r.value = p; }
      // o trecho é guardado pelo próprio botão; logo depois, salva a página junto
      setTimeout(() => { try { if (!ed.hidden && ed.contains(sv) && !sv.disabled) sv.click(); } catch {} }, 0);
    }
  }, true);
}
