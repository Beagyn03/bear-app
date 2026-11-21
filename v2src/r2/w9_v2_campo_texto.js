// Campos de comentário (Bia, 21/11): crescem sozinhos com o texto (até ~8 linhas, depois rolam) e têm "expandir", que abre o
// texto em tela cheia para ler e corrigir; "Concluir" devolve ao campo, com o cursor no mesmo lugar. Vale para os textareas do
// app (Atualizar página, Encerrar, Terminei, posts, trechos, anotações); campos curtos (até 80 letras) ficam como estão.
const W9CSS = `
.v4grow{overflow-y:hidden;resize:none}.v4grow.v4grow-max{overflow-y:auto}
.v4xbtn{position:absolute;z-index:2;width:40px;height:40px;display:grid;place-items:center;border:0;border-radius:12px;background:color-mix(in srgb,var(--panel) 80%,transparent);color:var(--ink-2);cursor:pointer;-webkit-tap-highlight-color:transparent}
.v4xbtn svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
.v4xfull{position:fixed;inset:0;z-index:9600;display:flex;flex-direction:column;gap:.6rem;padding:calc(12px + env(safe-area-inset-top)) max(16px,env(safe-area-inset-right)) calc(12px + env(safe-area-inset-bottom)) max(16px,env(safe-area-inset-left));background:var(--bg,#111);color:var(--ink)}
.v4xfull header{display:flex;align-items:center;justify-content:space-between;gap:.6rem}.v4xfull header b{font-size:1.05rem}
.v4xfull textarea{flex:1;width:100%;box-sizing:border-box;padding:.9rem;border-radius:14px;border:1px solid var(--line);background:var(--panel);color:var(--ink);font:inherit;font-size:1.05rem;line-height:1.5;resize:none}
.v4xfull .ok{min-height:44px;padding:0 1.2rem;border:0;border-radius:99px;background:var(--acc);color:#fff;font:inherit;font-weight:900;cursor:pointer}

.v4caprow{display:grid;grid-template-columns:auto 84px;align-items:center;gap:4px 10px;margin:10px 0 2px}.v4caprow label{font-weight:800;font-size:.9rem}.v4caprow label small{font-weight:600;opacity:.7}
.v4caprow input{min-width:0;text-align:center;min-height:40px}.v4caprow > small{grid-column:1/-1;font-size:.78rem}
[data-a$=mic].v4dict-on{animation:v4dictP 1.1s ease-in-out infinite}
@keyframes v4dictP{0%{box-shadow:0 0 0 0 color-mix(in srgb,var(--acc) 55%,transparent)}70%{box-shadow:0 0 0 12px transparent}100%{box-shadow:0 0 0 0 transparent}}
@media (prefers-reduced-motion: reduce){[data-a$=mic].v4dict-on{animation:none;box-shadow:0 0 0 3px var(--acc)}}
.v4dict-hint{display:block;margin:.35rem .2rem 0;font-size:.78rem;font-weight:700;color:var(--ink-2,var(--ink2))}
`;
{ const st = document.createElement('style'); st.textContent = W9CSS; TR.append(st); }
{ const ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>';
  const LH = (ta) => parseFloat(getComputedStyle(ta).lineHeight) || 20;
  const grow = (ta) => { if (!ta.isConnected) return; const max = LH(ta) * 8 + 24; ta.style.height = 'auto'; const h = Math.min(ta.scrollHeight + 2, max); ta.style.height = h + 'px'; ta.classList.toggle('v4grow-max', ta.scrollHeight + 2 > max); place(ta); };
  const place = (ta) => { const b = ta._v4x; if (!b || !b.isConnected) return; b.style.top = (ta.offsetTop + 4) + 'px'; b.style.left = (ta.offsetLeft + ta.offsetWidth - 44) + 'px'; };
  const open = (ta) => { const s0 = ta.selectionStart, s1 = ta.selectionEnd; const w = document.createElement('div'); w.className = 'v4xfull'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-modal', 'true'); w.setAttribute('aria-label', 'Texto em tela cheia');
    w.innerHTML = '<header><b>Seu texto</b><button type="button" class="ok">Concluir</button></header><textarea aria-label="Texto"></textarea>';
    const big = w.querySelector('textarea'); big.value = ta.value; if (ta.maxLength > 0) big.maxLength = ta.maxLength; (ta.closest('.v4ler') || ta.getRootNode() || TR).append(w);
    big.focus(); try { big.setSelectionRange(s0 ?? big.value.length, s1 ?? big.value.length); } catch {}
    const done = () => { const a = big.selectionStart, z = big.selectionEnd; ta.value = big.value; ta.dispatchEvent(new Event('input', { bubbles: true })); w.remove(); ta.focus(); try { ta.setSelectionRange(a, z); } catch {} grow(ta); };
    w.querySelector('.ok').addEventListener('click', done); w.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') { ev.stopPropagation(); done(); } }); };
  const setup = (ta) => { if (ta._v4g || ta.closest('.v4xfull')) return; if (ta.maxLength > 0 && ta.maxLength <= 80) return; ta._v4g = 1; ta.classList.add('v4grow');
    ta.addEventListener('input', () => grow(ta)); const par = ta.parentElement; if (par && getComputedStyle(par).position === 'static') par.style.position = 'relative';
    const b = document.createElement('button'); b.type = 'button'; b.className = 'v4xbtn'; b.setAttribute('aria-label', 'Expandir o texto'); b.innerHTML = ICON;
    b.addEventListener('click', (ev) => { ev.preventDefault(); ev.stopPropagation(); open(ta); }); ta._v4x = b; ta.after(b); ta.style.paddingRight = 'max(' + (getComputedStyle(ta).paddingRight || '0px') + ', 44px)';
    requestAnimationFrame(() => grow(ta)); };
  const roots = () => [TR, ...[...TR.children].filter((n) => n.shadowRoot).map((n) => n.shadowRoot)];
  const seen = new WeakSet();
  const scan = () => roots().forEach((r) => { if (r !== TR && !seen.has(r)) { seen.add(r); const st = document.createElement('style'); st.textContent = W9CSS; r.append(st); new MutationObserver(scan).observe(r, { childList: true, subtree: true }); }
    r.querySelectorAll('textarea').forEach(setup); });
  new MutationObserver(scan).observe(TR, { childList: true, subtree: true });
  // valor trocado por código (ditado, foto) também ajusta a altura
  const desc = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value');
  if (desc && desc.set) Object.defineProperty(HTMLTextAreaElement.prototype, 'value', { configurable: true, get() { return desc.get.call(this); }, set(v) { desc.set.call(this, v); if (this._v4g) requestAnimationFrame(() => grow(this)); } });
  window.addEventListener('resize', () => roots().forEach((r) => r.querySelectorAll('textarea.v4grow').forEach(place)));
  scan(); }
