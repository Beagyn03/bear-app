// Ditar em todo campo de texto livre (Bia, 21/11): anotação, trecho, comentário, avaliação, post e resposta, mensagem, conversa do
// Ler junto, eco, frase do perfil, diário. Usa o mesmo v4Dictate (para sozinho, pontuação falada, "Ouvindo…"). Campos que já têm
// microfone ficam como estão. Fora: busca, @, e-mail, senha, números, datas, links e campos curtos.
const WA_CSS = `
.wa-mic{position:absolute;z-index:2;width:40px;height:40px;display:grid;place-items:center;border:0;border-radius:12px;background:color-mix(in srgb,var(--panel,#fff) 80%,transparent);color:var(--ink-2,#6e5a47);cursor:pointer;-webkit-tap-highlight-color:transparent}
.wa-mic svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
.wa-mic.v4dict-on{color:var(--acc,#9c5216);animation:v4dictP 1.1s ease-in-out infinite}
@keyframes v4dictP{0%{box-shadow:0 0 0 0 color-mix(in srgb,var(--acc,#9c5216) 55%,transparent)}70%{box-shadow:0 0 0 12px transparent}100%{box-shadow:0 0 0 0 transparent}}
@media (prefers-reduced-motion: reduce){.wa-mic.v4dict-on{animation:none;box-shadow:0 0 0 3px var(--acc,#9c5216)}}
`;
{ const MIC = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/></svg>';
  const NOPE = /busc|procur|search|handle|arroba|usuario|usuário|e-?mail|senha|pass|login|isbn|cap\b|capit|p[aá]g|page|ano\b|year|data|date|url|link|nome|name|cidade|estado|cep/i;
  const WANT = /mensagem|escrev|respond|respost|coment|conte|diga|frase|trecho|anota|eco|achou|pens|sinta|sentiu|recado|post/i;
  const isText = (el) => {
    if (el.closest('.v4xfull')) return false;
    if (el.disabled || el.readOnly) return false;
    if (el.tagName === 'TEXTAREA') { const k = [el.id, el.name, el.placeholder, el.getAttribute('aria-label')].join(' '); return !(el.maxLength > 0 && el.maxLength < 40) && !/busc|procur|search|isbn/i.test(k); }
    if (el.tagName !== 'INPUT') return false;
    const ty = (el.getAttribute('type') || 'text').toLowerCase(); if (ty !== 'text') return false;
    const im = (el.getAttribute('inputmode') || '').toLowerCase(); if (/numeric|decimal|tel|email|url|search/.test(im)) return false;
    const ac = (el.getAttribute('autocomplete') || '').toLowerCase(); if (/user|email|password|nick|name|tel|url/.test(ac)) return false;
    const k = [el.id, el.name, el.placeholder, el.getAttribute('aria-label')].join(' ');
    if (NOPE.test(k) || /@/.test(el.placeholder || '')) return false;
    return (el.maxLength > 0 && el.maxLength >= 100) || WANT.test(k);
  };
  // já tem microfone perto (os campos da tela Ler, eco, anotação): não duplica
  const hasMic = (el) => { let n = el.parentElement; for (let i = 0; n && i < 3; i++, n = n.parentElement) { if ([...n.querySelectorAll('[data-a$=mic]')].some((b) => !b.classList.contains('wa-mic'))) return true; } return false; };
  const insert = (el, t) => { if (!el.isConnected || !t) return; const v = el.value || ''; let a = el.selectionStart, z = el.selectionEnd; if (a == null || document.activeElement !== el && el.getRootNode().activeElement !== el) { a = z = v.length; }
    const pre = v.slice(0, a), pos = v.slice(z); const sp = pre && !/\s$/.test(pre) ? ' ' : ''; let txt = sp + t; if (el.maxLength > 0) txt = txt.slice(0, Math.max(0, el.maxLength - pre.length - pos.length));
    el.value = pre + txt + pos; const c = (pre + txt).length; try { el.setSelectionRange(c, c); } catch {} el.dispatchEvent(new Event('input', { bubbles: true })); };
  const place = (el) => { const b = el._waMic; if (!b || !b.isConnected) return; const tall = el.tagName === 'TEXTAREA';
    b.style.top = (el.offsetTop + (tall ? Math.max(4, el.offsetHeight - 44) : Math.max(0, (el.offsetHeight - 40) / 2))) + 'px';
    b.style.left = (el.offsetLeft + el.offsetWidth - 44) + 'px'; };
  const setup = (el) => { if (el._waMic !== undefined) { place(el); return; } if (!isText(el) || hasMic(el)) { el._waMic = null; return; }
    const par = el.parentElement; if (!par) return; if (getComputedStyle(par).position === 'static') par.style.position = 'relative';
    const b = document.createElement('button'); b.type = 'button'; b.className = 'wa-mic'; b.dataset.a = 'wamic'; b.setAttribute('aria-label', 'Ditar'); b.setAttribute('aria-pressed', 'false'); b.innerHTML = MIC;
    b.addEventListener('click', (ev) => { ev.preventDefault(); ev.stopPropagation(); try { v4DictBtn = b; } catch {} try { v4Dictate((t) => insert(el, t)); } catch (e) { console.warn('ditar', e); } });
    el._waMic = b; el.after(b);
    const pr = parseFloat(getComputedStyle(el).paddingRight) || 0; if (pr < 44) el.style.paddingRight = (el._v4x ? 44 : 44) + 'px';
    if (el._v4x) el.style.paddingRight = '44px';
    el.addEventListener('input', () => place(el)); requestAnimationFrame(() => place(el)); };
  const styled = new WeakSet();
  const style = (r) => { if (styled.has(r)) return; styled.add(r); const st = document.createElement('style'); st.textContent = WA_CSS; (r === document ? document.head : r).append(st); };
  const roots = () => { const out = [TR, document]; [...TR.querySelectorAll('*')].forEach((n) => { if (n.shadowRoot) out.push(n.shadowRoot); }); [...TR.children].forEach((n) => { if (n.shadowRoot && !out.includes(n.shadowRoot)) out.push(n.shadowRoot); }); return out; };
  const watched = new WeakSet();
  let t = 0;
  const scan = () => { clearTimeout(t); t = setTimeout(() => roots().forEach((r) => { style(r);
    if (r !== TR && r !== document && !watched.has(r)) { watched.add(r); new MutationObserver(scan).observe(r, { childList: true, subtree: true }); }
    r.querySelectorAll('textarea, input').forEach(setup); }), 60); };
  new MutationObserver(scan).observe(TR, { childList: true, subtree: true });
  new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
  window.addEventListener('resize', scan); scan(); }
