// Início sem leitura em andamento: "Sortear" ao lado de Começar a ler / Buscar outro, e os três botões menores numa linha.
{ const st = document.createElement('style'); st.textContent = `
.v3-next .v3-next-b{flex-wrap:nowrap!important;gap:.35rem!important;margin-top:.55rem!important}
.v3-next .v3-next-b .v3-ic{width:34px!important;height:34px!important;padding:0!important;display:grid;place-items:center;flex:none}.v3-next .v3-next-b .v3-ic svg{width:18px;height:18px}
.v3-next .v3-next-b button{height:32px!important;min-height:0!important;padding:0 .7rem!important;font-size:.76rem!important;border-radius:99px!important;white-space:nowrap;width:auto!important;flex:none}
`; TR.append(st); }
TR.addEventListener('click', (ev) => {
  if (!(ev.target.closest && ev.target.closest('#v3-sort'))) return;
  ev.stopPropagation();
  if (lib().filter((e) => e.status === 'QUERO').length < 2) return toast('Coloque pelo menos 2 livros em Quero ler para sortear');
  sortShelf('QUERO');
});
