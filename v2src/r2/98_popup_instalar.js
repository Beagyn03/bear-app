// Popup para instalar o app (Bia, 17/11): quem abre o link no navegador (sem o app instalado) vê, depois de alguns segundos,
// um cartão no rodapé com "Instalar". Usa o installApp() que já existia (pedido nativo no Android; passo a passo no iPhone).
// "Agora não" esconde para sempre (Bia, 18/11): instalar continua no menu lateral. Não aparece com o app já instalado nem enquanto há uma tela por cima.
{ const st = document.createElement('style'); st.textContent = `
.inst-pop{position:fixed;left:12px;right:12px;bottom:calc(78px + env(safe-area-inset-bottom));z-index:9000;display:grid;grid-template-columns:52px minmax(0,1fr);gap:.75rem;align-items:center;max-width:460px;margin:0 auto;padding:.85rem .9rem;border-radius:20px;background:#2e0b33;color:#fff;box-shadow:0 10px 30px rgba(0,0,0,.35);font-family:Nunito,system-ui,sans-serif;animation:instIn .35s cubic-bezier(.2,1.2,.4,1)}
@keyframes instIn{from{transform:translateY(30px);opacity:0}to{transform:none;opacity:1}}
.inst-pop img{width:52px;height:52px;border-radius:14px}
.inst-pop b{display:block;font-size:.98rem}.inst-pop small{display:block;font-size:.78rem;opacity:.85;line-height:1.3;margin-top:.15rem}
.inst-pop .inst-bt{grid-column:1/-1;display:flex;gap:.5rem;justify-content:flex-end;margin-top:.15rem}
.inst-pop button{border:0;border-radius:99px;font:inherit;font-weight:900;font-size:.85rem;padding:.55rem 1.1rem;cursor:pointer}
.inst-pop .inst-no{background:none;color:#fff;opacity:.8}.inst-pop .inst-yes{background:#f0b84a;color:#2a1709}
`; document.head.append(st); }
{ const KEY = 'lv.instPop', DAYS = 7;
  const show = () => {
    try { if (appInstalled()) return; } catch { return; }
    let last = 0; try { last = Number(localStorage.getItem(KEY)) || 0; } catch {}
    if (last || document.querySelector('.inst-pop')) return; // já respondeu uma vez: não volta
    // não atrapalha telas por cima (diário, folhas, tour)
    const busy = document.querySelector('.sheet') || (TR.querySelector('#editor') && !TR.querySelector('#editor').hidden) || document.querySelector('.tour, .tr-ov');
    if (busy) return setTimeout(show, 8000);
    const w = document.createElement('div'); w.className = 'inst-pop'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-label', 'Instalar o Livroverso');
    w.innerHTML = '<img src="icon-192.png" alt=""><span><b>Instale o Livroverso</b><small>Abre como app no seu celular, funciona sem internet e te avisa na hora de ler.</small></span><div class="inst-bt"><button type="button" class="inst-no">Agora não</button><button type="button" class="inst-yes">Instalar</button></div>';
    const close = () => { try { localStorage.setItem(KEY, String(Date.now())); } catch {} w.remove(); };
    w.querySelector('.inst-no').addEventListener('click', close);
    w.querySelector('.inst-yes').addEventListener('click', () => { close(); try { installApp(); } catch {} });
    document.body.append(w);
  };
  setTimeout(show, 4000);
  window.addEventListener('appinstalled', () => { document.querySelector('.inst-pop')?.remove(); }); }
// se o diário ou outra tela abrir por cima, o popup sai da frente (sem contar como "Agora não")
{ const ed = TR.querySelector('#editor'); if (ed) new MutationObserver(() => { if (!ed.hidden) document.querySelector('.inst-pop')?.remove(); }).observe(ed, { attributes: true, attributeFilter: ['hidden'] }); }
