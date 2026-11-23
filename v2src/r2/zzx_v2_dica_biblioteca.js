// Dica da Biblioteca em balão flutuante (Bia, 23/11): não ocupa espaço na lista. Aparece por cima do conteúdo, perto do
// rodapé (acima da barra de abas), quando a pessoa entra na Biblioteca › Livros (Grade ou Prateleira). "Entendi" fecha só
// agora (volta na próxima entrada); "Não ver mais" nunca mais (db.prefs.tipBib, sincronizado). Fecha sozinho ao rolar ou ao
// sair da aba. Só opacidade e deslocamento (transform): nada da página muda de lugar.
{
  const st = document.createElement('style'); st.textContent = `
.v8tipb{position:fixed;left:max(16px,env(safe-area-inset-left,0px));right:max(16px,env(safe-area-inset-right,0px));z-index:60;max-width:520px;margin:0 auto;display:grid;gap:8px;padding:12px 14px 10px;border-radius:16px;background:#221a40!important;color:#f3ecff;box-shadow:0 10px 28px rgba(0,0,0,.35);font-size:13px;line-height:1.4;opacity:0;transform:translateY(10px);transition:opacity .22s ease,transform .22s ease;pointer-events:none}
.v8tipb.on{opacity:1;transform:none;pointer-events:auto}
.v8tipb,.v8tipb > span{color:#f3ecff!important}.v8tipb b{color:#fff!important}.v8tipb .ac button{color:#e4dbff!important}.v8tipb .ac button.p{color:#2a2050!important}.v8tipb .ac{display:flex;justify-content:flex-end;gap:4px}
.v8tipb .ac button{min-height:40px;padding:0 12px;border:0;border-radius:12px;background:none;color:#d9ccff;font:inherit;font-weight:800;cursor:pointer}
.v8tipb .ac button.p{background:#f3ecff;color:#2a2050}
@media (prefers-reduced-motion: reduce){.v8tipb{transition:none}}`; TR.append(st);
  let el = null, lastTab = '', shownFor = '', readyAt = 0, shownAt = 0;
  const off = () => !!((db.prefs || {}).tipBib);
  const ok = () => { try { const S5 = v5S(); if (!(S.tab === 'estante' && S5.tab === 'livros' && !S5.sub && !(typeof SHX_MODE !== 'undefined' && SHX_MODE))) return false;
      // página por cima (livro, avaliação…) ou folha/menu aberto: a dica sai (QA 23/11)
      const v = $('#shelflist'); if (v && !v.hidden && !v.classList.contains('tabroot')) return false;
      if ([...TR.querySelectorAll('.pop, .sheet, .v4sheet, [role=dialog]')].some((n) => n !== el && !(el && el.contains(n)) && n.getClientRects().length)) return false;
      try { if (v4State().sheet) return false; } catch {}
      return true; } catch { return false; } };
  const hide = () => { if (!el) return; const n = el; el = null; n.classList.remove('on'); setTimeout(() => n.remove(), 250); };
  const show = () => {
    if (el || off() || !ok()) return; const v = $('#shelflist'); if (v && !v.hidden && !v.classList.contains('tabroot')) return;
    const prat = (() => { try { return shView() === 'prat'; } catch { return false; } })();
    el = document.createElement('div'); el.className = 'v8tipb'; el.setAttribute('role', 'status');
    el.innerHTML = `<span><b>Dica:</b> ${prat ? 'toque na lombada para ver a capa; segure para as opções.' : 'toque na capa para abrir o livro; segure para atualizar, terminar ou mudar o status sem abrir.'}</span><span class="ac"><button type="button" data-t="nunca">Não ver mais</button><button type="button" class="p" data-t="ok">Entendi</button></span>`;
    const tb = $('#tabbar'), r = tb && tb.getClientRects().length ? tb.getBoundingClientRect() : null; el.style.bottom = Math.round((r ? innerHeight - r.top : 72) + 12) + 'px';
    el.addEventListener('click', (ev) => { const b = ev.target.closest('[data-t]'); if (!b) return; ev.stopPropagation(); if (b.dataset.t === 'nunca') { db.prefs = { ...(db.prefs || {}), tipBib: 1 }; try { save(); } catch {} } hide(); });
    TR.append(el); requestAnimationFrame(() => requestAnimationFrame(() => el && el.classList.add('on')));
  };
  // entrada na aba: mostra uma vez por entrada, depois que a tela assentou
  setInterval(() => { const t = S.tab || ''; if (t !== lastTab) { lastTab = t; hide(); shownFor = t === 'estante' ? 'wait' : ''; readyAt = Date.now() + 900; }
    if (shownFor === 'wait' && Date.now() > readyAt && ok()) { shownFor = 'done'; show(); shownAt = Date.now(); }
    if (el && !ok()) hide(); }, 250);
  const onScr = (ev) => { if (!el || Date.now() - shownAt < 700) return; try { if (ev && ev.composedPath && ev.composedPath().includes(el)) return; } catch {} hide(); }; // rolar fecha (o evento não atravessa a raiz da interface: ouvir nas duas)
  addEventListener('scroll', onScr, true); TR.addEventListener('scroll', onScr, true); addEventListener('touchmove', onScr, { capture: true, passive: true }); addEventListener('wheel', onScr, { capture: true, passive: true });
  addEventListener('visibilitychange', () => { if (document.hidden) hide(); });
}
