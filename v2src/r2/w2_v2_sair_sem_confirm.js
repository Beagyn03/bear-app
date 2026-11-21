// Sair da conta sem a janela do navegador (Bia, 20/11: "não consigo sair da conta"; regra: nunca confirm() nativo).
// logout() da produção também chamava confirm() (eram duas janelas do navegador seguidas); aqui a confirmação é só a do app.
// O toque em "Sair da conta" abre a confirmação do app (um item "Sair da conta" no menu); o segundo toque sai.
TR.addEventListener('click', (ev) => {
  const b = ev.target.closest && ev.target.closest('#aj-out'); if (!b) return;
  ev.stopPropagation(); ev.preventDefault();
  v9Ask(b, 'Sair da conta (seus dados continuam guardados)', () => { const c = window.confirm; window.confirm = () => true; try { logout(); } catch (e) { console.warn('sair', e); } finally { window.confirm = c; } });
}, true);
