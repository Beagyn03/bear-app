// Excluir estante pede confirmação na folha do app antes (Bia, 20/11: "excluir estante não confirma nada").
// Continua com "Desfazer" depois; a confirmação vem pelo confirm() do x1, que vira folha do app.
window.addEventListener('click', (ev) => {
  const p = ev.composedPath ? ev.composedPath() : [], b = p.find((n) => n && n.dataset && n.dataset.a === 'v5shdel'); if (!b) return;
  const box = b.closest('.sheet, .v4sheet, [role=dialog], .sh') || b.parentElement, h = box && box.querySelector('h3'), nm = h ? h.textContent.trim() : '';
  if (!confirm(`Excluir a estante${nm ? ' “' + nm + '”' : ''}? Os livros continuam em Livros, com status, notas e progresso.`)) { ev.stopPropagation(); ev.preventDefault(); }
}, true);
