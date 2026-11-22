// Alvos de toque de pelo menos 44 px (teste de estresse, 21/11): "Escreva sobre sua leitura…" (31 px), Desafio da semana (22 px),
// "Mais votados ›" (16 px) e "Completar" da Biblioteca (22 px). O desenho não muda: a área de toque cresce para fora do texto.
{ const CSS = '.cin{min-height:44px}.cdes{min-height:44px}.qft button,.tip .lnk{position:relative}.qft button::after,.tip .lnk::after{content:"";position:absolute;inset:-14px -8px}';
  const put = (r) => { try { if (r && !r.querySelector('style[data-alvo]')) { const st = document.createElement('style'); st.dataset.alvo = '1'; st.textContent = CSS; r.append(st); } } catch {} };
  put(TR); const seen = new WeakSet();
  const scan = () => { TR.querySelectorAll('*').forEach((h) => { const r = h.shadowRoot; if (r && !seen.has(r)) { seen.add(r); put(r); } }); };
  scan(); setInterval(scan, 1500); }
