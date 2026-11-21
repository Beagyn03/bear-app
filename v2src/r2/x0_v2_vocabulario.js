// Vocabulário único (Bia, 20/11; glossário aprovado): os textos dos blocos v2 já foram trocados na fonte.
// Aqui ficam só as frases que ainda moram no código antigo (fora de v2src/r2) e aparecem em telas que a v2 abre.
// Troca só texto de interface (curto, fora de posts, trechos, mensagens e campos), e para sozinha se algo redesenhar em laço.
{ const RX = [[/\b(à|na|da|À|Na|Da) minha biblioteca\b/g, '$1 Biblioteca'], [/\bMinha biblioteca\b/g, 'Biblioteca'], [/Personalizar Início/g, 'Personalizar Hoje'],
    [/Só amigos\b/g, 'Só amizades'], [/Retomar leitura/g, 'Voltar a ler'], [/Desistir de vez/g, 'Desistir'], [/\b(na|da|à) Estante\b(?!s)/g, '$1 Biblioteca'],
    [/Adicionar à estante/g, 'Adicionar à Biblioteca'], [/^Estou lendo$/g, 'Lendo'], [/\bNa estante ·/g, 'Na Biblioteca ·'], [/^(↺ )?Tentar de novo$/g, '$1Voltar a ler'],
    [/Obrigada por ter lido com a gente\./g, 'Que bom que você leu com a gente.'], [/Denúncia enviada\. Obrigado!/g, 'Denúncia enviada. Vamos analisar.'], [/Open Library/g, 'Livroverso']]; // (Bia, 21/11; "Tentar de novo" do baú e dos menus antigos de abandonados: reteste da noite; frases neutras e fonte interna: teste real)
  const QUICK = /minha biblioteca|Personalizar Início|Só amigos|Retomar leitura|Desistir de vez| Estante\b|Adicionar à estante|^Estou lendo$|Na estante ·|^(↺ )?Tentar de novo$|Obrigada por ter lido|Obrigado!|Open Library/i;
  const SKIP = '#fd-retry,#v3pf-retry,textarea,input,[contenteditable],.rd-tx,.rd-body,.rd-text,.v2rv-tx,blockquote,.q-tx,.bq-t,.msg,.bub,.ms-b,.bd-msg,script,style';
  let n = 0, t0 = Date.now(), off = 0;
  const fix = (node) => { const s = node.nodeValue; if (!s || s.length > 240 || !QUICK.test(s)) return; const p = node.parentElement; if (!p || p.closest(SKIP)) return;
    let v = s; RX.forEach(([a, b]) => { v = v.replace(a, b); }); if (v !== s) { node.nodeValue = v; n++; } };
  const attr = (el) => ['aria-label', 'title', 'placeholder'].forEach((k) => { const s = el.getAttribute && el.getAttribute(k); if (s && QUICK.test(s)) { let v = s; RX.forEach(([a, b]) => { v = v.replace(a, b); }); if (v !== s) el.setAttribute(k, v); } });
  const walk = (root) => { if (root.nodeType === 3) return fix(root); if (root.nodeType !== 1 && root.nodeType !== 11) return; if (root.nodeType === 1) attr(root);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT); let x; while ((x = w.nextNode())) { if (x.nodeType === 3) fix(x); else attr(x); } };
  const mo = new MutationObserver((ms) => { if (off > Date.now()) return; if (Date.now() - t0 > 1000) { t0 = Date.now(); n = 0; }
    ms.forEach((m) => { if (m.type === 'characterData') fix(m.target); else m.addedNodes.forEach(walk); });
    if (n > 300) { off = Date.now() + 3000; console.warn('vocabulário: muitas trocas seguidas, pausa de 3 s'); } });
  [TR, document.body].forEach((r) => { try { walk(r); mo.observe(r, { childList: true, subtree: true, characterData: true }); } catch {} }); }
