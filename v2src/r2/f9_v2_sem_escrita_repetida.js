// Fim dos laços de redesenho (Bia, 20/11): vários blocos antigos regravam o MESMO valor (hidden, aria-*, classe, data-*)
// a cada mudança na tela, e cada regravação gera um aviso de mudança que acorda outro bloco, num laço sem fim
// (medido: 48 a 166 mudanças/s com a tela parada; perfil com abas trocando aria-selected sem parar).
// Aqui a escrita só acontece quando o valor muda de verdade; o resultado na tela é idêntico.
{ const EP = Element.prototype, _sa = EP.setAttribute, _ra = EP.removeAttribute;
  EP.setAttribute = function (n, v) { if (this.getAttribute(n) === String(v)) return; return _sa.call(this, n, v); };
  EP.removeAttribute = function (n) { if (!this.hasAttribute(n)) return; return _ra.call(this, n); };
  const TL = DOMTokenList.prototype, _add = TL.add, _rem = TL.remove, _tog = TL.toggle;
  TL.add = function (...t) { const need = t.filter((x) => !this.contains(x)); if (need.length) _add.apply(this, need); };
  TL.remove = function (...t) { const need = t.filter((x) => this.contains(x)); if (need.length) _rem.apply(this, need); };
  TL.toggle = function (t, force) { const has = this.contains(t); if (force === undefined) return _tog.call(this, t); if (!!force === has) return has; return _tog.call(this, t, force); };
  const hd = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'hidden');
  if (hd && hd.set) Object.defineProperty(HTMLElement.prototype, 'hidden', { ...hd, set(v) { if (!!v === !!this.hidden && typeof v !== 'string') return; hd.set.call(this, v); } });

}
// o "•••" antigo do topo saiu (topo só com marca, lupa e sino): dois blocos antigos brigavam pelo hidden dele
{ const kill = () => { const b = TR.querySelector('#g-imore'); if (b && !b.dataset.v3off) { b.dataset.v3off = '1'; b.style.display = 'none'; Object.defineProperty(b, 'hidden', { get: () => true, set: () => {} }); } };
  kill(); new MutationObserver(() => kill()).observe(TR, { childList: true, subtree: true }); setTimeout(kill, 800); }
// textContent igual em nó que só tem texto (saudação, nome no topo, contadores): não troca o nó de texto à toa
{ const td = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent');
  if (td && td.set) Object.defineProperty(Node.prototype, 'textContent', { ...td, set(v) { const s = v == null ? '' : String(v); if (this.nodeType === 1 && this.childNodes.length === 1 && this.firstChild.nodeType === 3 && this.firstChild.data === s) return; td.set.call(this, v); } }); }
