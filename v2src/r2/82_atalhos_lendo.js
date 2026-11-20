// Atalhos no cartão "Lendo agora" (Bia, 17/11): Atualizar, Foco e Concluir, sempre à mão.
{ const st = document.createElement('style'); st.textContent = `
.v3-quick{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.4rem;margin-top:.6rem;width:100%}
.v3-quick button{display:flex;align-items:center;justify-content:center;gap:.35rem;height:38px;border-radius:12px;border:1.5px solid var(--line);background:var(--panel);color:var(--ink);font:inherit;font-size:.82rem;font-weight:800;cursor:pointer;min-width:0;white-space:nowrap}
.v3-now .due-cards{border-top:1px solid var(--line);padding-top:.5rem;margin-top:.65rem}.v3-now .due-ln{margin-top:.35rem!important;font-size:.74rem!important}.v3-now .due-ln:not(:has(+ *)):first-of-type{}
.v3-now .due-ln:has(> span:empty){justify-content:center!important;margin-top:.45rem!important}.v3-now .due-ln > span:empty{display:none}
.v3-now .due-ln:has(> span:empty) button{width:100%!important;height:38px!important;border:1.5px dashed var(--acc)!important;border-radius:12px!important;text-align:center;font-size:.82rem!important;background:color-mix(in srgb,var(--acc) 6%,transparent)!important}
.v3-quick button.pri{background:var(--acc);border-color:var(--acc);color:var(--on-acc,#fff)}
.v3-quick button.ok{border-color:#2f8a52;color:#2f8a52}
.v3-quick svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;flex:none}`; TR.append(st); }
{ let tm = 0; const SV = (d) => '<svg viewBox="0 0 24 24" aria-hidden="true">' + d + '</svg>';
  const put = () => {
    const R = (() => { try { return reading(); } catch { return null; } })(); if (!R || !R.e || R.e.status !== 'LENDO') return;
    TR.querySelectorAll('.v3-now:not(.empty)').forEach((card) => { if (card.querySelector('.v3-quick')) return;
      const q = document.createElement('div'); q.className = 'v3-quick';
      q.innerHTML = '<button type="button" class="pri" data-q="upd">' + SV('<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 6l4 4"/>') + 'Atualizar</button>'
        + '<button type="button" data-q="foco">' + SV('<circle cx="12" cy="13" r="7"/><path d="M12 10v3l2 2M9 3h6"/>') + 'Foco</button>'
        + '<button type="button" class="ok" data-q="fim">' + SV('<path d="M5 12l5 5L20 7"/>') + 'Concluir</button>';
      const ln = card.querySelector('.due-cards') || card.querySelector('.due-ln'); if (ln) ln.before(q); else card.append(q);
      q.querySelectorAll('button').forEach((b) => b.addEventListener('click', (ev) => { ev.stopPropagation(); const k = b.dataset.q, R2 = reading(); if (!R2) return;
        if (k === 'upd') { if (S.madrugada) return wakeBear('upd'); return editLeitura(); }
        if (k === 'foco') return startFocus();
        if (k === 'fim') return statusSheet(R2.e, 'LIDO'); }));
    });
  };
  new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(put, 80); }).observe(TR, { childList: true, subtree: true }); setTimeout(put, 1500); }

// a linha do prazo pode chegar depois dos atalhos: mantém os atalhos acima dela
{ let tm = 0; new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(() => TR.querySelectorAll('.v3-now:not(.empty)').forEach((c) => { const q = c.querySelector('.v3-quick'), ln = c.querySelector('.due-cards') || c.querySelector('.due-ln'); if (q && ln && (q.compareDocumentPosition(ln) & Node.DOCUMENT_POSITION_PRECEDING)) ln.before(q); }), 120); }).observe(TR, { childList: true, subtree: true }); }
