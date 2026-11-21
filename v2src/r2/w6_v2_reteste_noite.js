// Reteste da noite (21/11):
// - apagar eco, mensagem e resposta abriam só um balão com o verbo, sem dizer o que se perde: agora abrem a folha do app
//   com título, o que se perde e Apagar/Cancelar (mesmo padrão das outras confirmações);
// - estante vazia mandava tocar em "+ Adicionar", que não existe nas telas novas: aponta para ••• › Adicionar livros.
{ const INFO = {
    'Apagar este eco': ['Apagar eco?', 'O eco sai da página para todo mundo, junto com as curtidas. Não dá para desfazer.'],
    'Apagar mensagem': ['Apagar mensagem?', 'A mensagem some da conversa para as duas pessoas. Não dá para desfazer.'],
    'Apagar resposta': ['Apagar resposta?', 'A resposta some da conversa para todo mundo. Não dá para desfazer.'] };
  const _ask = v9Ask;
  v9Ask = function (anchor, label, fn) {
    const it = INFO[label]; if (!it || typeof lvDialog !== 'function') return _ask.apply(this, arguments);
    lvDialog({ title: it[0], html: '<p style="margin:.4rem 0 0;line-height:1.45">' + esc(it[1]) + '</p>', actions: [{ label: 'Apagar', cls: 'dng', fn: () => { try { fn(); } catch (e) { console.warn('apagar', e); } } }, { label: 'Cancelar' }] }); }; }
{ const RX = [[/Estante vazia\. Toque em “\+ Adicionar”\./, 'Estante vazia. Toque em ••• › Adicionar livros.'],
    [/Toque em “\+ Adicionar” para colocar livros\./, 'Toque em ••• › Adicionar livros para colocar livros.']];
  const fix = (n) => { const s = n.nodeValue; if (!s || s.indexOf('+ Adicionar”') < 0) return; let v = s; RX.forEach(([a, b]) => { v = v.replace(a, b); }); if (v !== s) n.nodeValue = v; };
  const walk = (r) => { if (r.nodeType === 3) return fix(r); if (r.nodeType !== 1 && r.nodeType !== 11) return; const w = document.createTreeWalker(r, NodeFilter.SHOW_TEXT); let x; while ((x = w.nextNode())) fix(x); };
  const mo = new MutationObserver((ms) => ms.forEach((m) => { if (m.type === 'characterData') fix(m.target); else m.addedNodes.forEach(walk); }));
  [TR, document.body].forEach((r) => { try { walk(r); mo.observe(r, { childList: true, subtree: true, characterData: true }); } catch {} });
  // página de uma estante sua, vazia: diz onde adicionar
  const page = () => { const v = TR.querySelector('#shelflist'); if (!v || v.hidden) return; const e = v.querySelector('.sl-empty'); if (!e || e.dataset.lvHint || !/^Nenhum livro aqui ainda\.?$/.test(e.textContent.trim()) || !v.querySelector('.v6dots')) return; e.dataset.lvHint = '1'; e.textContent = 'Nenhum livro aqui ainda. Toque em ••• › Adicionar livros.'; };
  let tm = 0; new MutationObserver(() => { if (!tm) tm = setTimeout(() => { tm = 0; page(); }, 120); }).observe(TR, { childList: true, subtree: true }); }
