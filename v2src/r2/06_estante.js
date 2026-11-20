// Página da estante (rodada 2): ordenar e sortear ficam só no "•••" do topo (padrão do app); a barra mostra só a contagem.
{ const st = document.createElement('style'); st.textContent = `
.esv-bar #esv-sort,.esv-bar [data-lot]{display:none!important}
.es4-r [data-lot]{display:none!important}
`; TR.append(st); }
