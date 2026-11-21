// Modais de verdade (reteste da noite, 21/11): com a tela de login, uma folha ou um diálogo aberto, o Tab focava botões do app
// escondido atrás, e um script de teste clicou num botão de uma tela escondida. Agora:
// - login (#auth-gate), folhas (.sheet) e diálogos de fora do app (.lvdlg-bg) deixam o app inteiro inerte (sem foco, sem clique) e escondido do leitor de tela;
// - diálogos do próprio app (.v10dlg, dentro do shadow root) deixam inerte tudo o que está ao lado deles;
// - telas escondidas com o atributo hidden ficam inertes enquanto escondidas.
{ const host = TR.host || null;
  const MODAL_OUT = '#auth-gate, body > .sheet, body > .lvdlg-bg';
  let tm = 0;
  const sync = () => { tm = 0;
    try {
      const out = !!document.querySelector(MODAL_OUT);
      if (host) { if (out) { host.inert = true; host.setAttribute('aria-hidden', 'true'); } else if (host.inert) { host.inert = false; host.removeAttribute('aria-hidden'); } }
      document.querySelectorAll('body > .inst-pop').forEach((n) => { n.inert = out; }); // o aviso de instalar também sai do Tab
      const dlg = TR.querySelector(':scope > .v10dlg');
      [...TR.children].forEach((n) => { if (n.tagName === 'STYLE' || n.tagName === 'LINK') return; const want = !!dlg && n !== dlg; if (want && !n.inert) { n.inert = true; n.dataset.lvInert = '1'; } else if (!want && n.dataset.lvInert) { n.inert = false; delete n.dataset.lvInert; } });
      TR.querySelectorAll('[hidden]').forEach((n) => { if (!n.inert) { n.inert = true; n.dataset.lvHid = '1'; } });
      TR.querySelectorAll('[data-lv-hid]:not([hidden])').forEach((n) => { n.inert = false; delete n.dataset.lvHid; });
    } catch (e) { console.warn('modal inerte', e); } };
  const kick = () => { if (!tm) tm = setTimeout(sync, 30); };
  new MutationObserver(kick).observe(document.body, { childList: true });
  new MutationObserver(kick).observe(TR, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
  setTimeout(sync, 500); }
