// Tela de status/Atualizar como modal centralizado de altura fixa (Bia, 17/11): trocar de status não faz a janela
// pular de tamanho; o conteúdo rola por dentro.
{ const st = document.createElement('style'); st.textContent = `
#editor.ss-modal{align-items:stretch!important;justify-content:center!important;padding:0!important;background:var(--bg)!important}
#editor.ss-modal .ed-body{position:relative!important;width:min(640px,100%)!important;height:100%!important;max-height:none!important;margin:0 auto!important;border-radius:0!important;border:0!important;box-shadow:none!important;padding:max(14px,env(safe-area-inset-top)) 16px max(20px,env(safe-area-inset-bottom))!important;overflow-y:auto!important;overscroll-behavior:contain;align-content:start!important;justify-content:stretch;bottom:auto!important;top:auto!important;transform:none!important}
#editor.ss-modal .ed-body::before{display:none!important}
#editor.ss-modal .ed-body > *{flex-shrink:0!important}#editor.ss-modal .ss-chips{min-height:36px;overflow-y:hidden}
#editor.ss-modal .ss-title{font-size:1.1rem;font-weight:900;color:var(--ink);min-height:40px;display:flex;align-items:center;padding-right:52px;margin:0 0 .35rem}
#editor.ss-modal .ed-body > .up-x,#editor.ss-modal .ed-body > #ss-x{top:max(14px,env(safe-area-inset-top))!important}
@keyframes ssPop{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:none}}`; TR.append(st); }
{ let tm = 0; const sync = () => { const ed = TR.querySelector('#editor'); if (!ed) return; ed.classList.toggle('ss-modal', !ed.hidden && !!ed.querySelector('.ss-chips')); const b = ed.querySelector('.ed-body'); if (ed.classList.contains('ss-modal') && b && !b.querySelector(':scope > .ss-title')) { const t = document.createElement('div'); t.className = 'ss-title'; t.textContent = 'Diário de leitura'; b.prepend(t); } };
  new MutationObserver(() => { try { sync(); } catch {} }).observe(TR, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] }); }
// troca de status sem salto: mantém a rolagem no topo e só anima na primeira abertura
{ let was = false; new MutationObserver(() => { const ed = TR.querySelector('#editor'); if (!ed) return; const on = ed.classList.contains('ss-modal') && !ed.hidden;
    if (on && !was) { const b = ed.querySelector('.ed-body'); if (b && b.animate) b.animate([{ opacity: 0, transform: 'scale(.985)' }, { opacity: 1, transform: 'none' }], { duration: 160, easing: 'ease-out' }); }
    was = on; }).observe(TR, { subtree: true, attributes: true, attributeFilter: ['class', 'hidden'] }); }
