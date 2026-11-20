// Histórico de leituras (Bia, 18/11): uma página só, com duas abas: "Adicionar livros" (Montar meu histórico, com importar CSV)
// e "Completar dados" (Ajustar leituras). Depois de importar um arquivo, sugere a aba Completar dados se faltou alguma coisa.
{ const st = document.createElement('style'); st.textContent = `
.hl-seg{display:grid;grid-template-columns:1fr 1fr;gap:.25rem;background:var(--panel);border:1px solid var(--line);border-radius:999px;padding:.2rem;margin:.1rem 0 .8rem}
.hl-seg button{border:0;background:none;border-radius:999px;height:36px;font:inherit;font-weight:800;font-size:.86rem;color:var(--ink-2);cursor:pointer}
.hl-seg button.on{background:var(--acc);color:var(--on-acc,#fff)}
`; TR.append(st); }
const HL_T = { add: 'Montar meu histórico', fix: 'Ajustar leituras' };
openHistLeituras = function (tab) { if (tab === 'fix') openFixReads(); else openHistory(); };
function hlPaint() {
  const v = $('#shelflist'); if (!v || v.hidden) return; const top = v.querySelector('.sl-body > .sl-top'); if (!top) return;
  const b = top.querySelector('b'); if (!b) return; const t = b.textContent.trim();
  const tab = t === HL_T.add ? 'add' : t === HL_T.fix ? 'fix' : (t === 'Histórico de leituras' && top.dataset.hl) || null; if (!tab) return;
  if (top.dataset.hl === tab && top.nextElementSibling && top.nextElementSibling.classList.contains('hl-seg')) return;
  top.dataset.hl = tab; if (t !== 'Histórico de leituras') b.textContent = 'Histórico de leituras';
  let miss = 0; try { const c = fxCount(); miss = c.ini + c.fim + c.pag; } catch {}
  v.querySelector('.hl-seg')?.remove();
  const seg = document.createElement('div'); seg.className = 'hl-seg';
  seg.innerHTML = '<button type="button" data-t="add" class="' + (tab === 'add' ? 'on' : '') + '">Adicionar livros</button><button type="button" data-t="fix" class="' + (tab === 'fix' ? 'on' : '') + '">Completar dados' + (miss ? ' · ' + miss : '') + '</button>';
  seg.addEventListener('click', (ev) => { const x = ev.target.closest('button'); if (!x || x.dataset.t === tab) return; openHistLeituras(x.dataset.t); });
  top.after(seg);
}
{ let tm = 0; new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; hlPaint(); }, 40); }).observe(TR, { childList: true, subtree: true }); }
// depois de importar: se faltou data, página ou nota nos lidos, sugere a aba Completar dados
window.lvAfterImport = (n) => {
  if (!n) return; let c = null; try { c = fxCount(); } catch { return; } const miss = c.ini + c.fim + c.pag; if (!miss) return;
  const parts = [c.ini ? c.ini + ' sem data de início' : '', c.fim ? c.fim + ' sem data de fim' : '', c.pag ? c.pag + ' sem páginas' : ''].filter(Boolean).join(', ');
  setTimeout(() => sheetList('Faltou completar alguns lidos (' + parts + ')', [{ label: 'Completar agora', fn: () => openHistLeituras('fix') }], 'Depois'), 2600);
};
