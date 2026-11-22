// Novo post com Trecho (Bia, 22/11: "Trecho é sempre spoiler não?"). A regra aprovada é que trecho é SEMPRE spoiler:
// o cartão "Tem spoiler" vem ligado e travado mesmo antes de escolher o livro, com o texto de até onde cobre (página
// informada, ou até terminar o livro). O campo do trecho perde a borda dupla (foco dentro do cartão com barra lateral),
// "pág." vira campo numérico no padrão do app, os chips Sentimentos/Nota apagados dizem por que estão apagados e
// "Publicar" sem livro leva direto à escolha do livro.
{
  const st = document.createElement('style');
  st.textContent = `
.rdc2-q{gap:.5rem;border:1px solid var(--line);border-left:3px solid var(--acc);border-radius:4px 14px 14px 4px}
.rdc2-q:focus-within{border-color:var(--acc)}
.rdc2-q textarea,.rdc2-q textarea:focus,.rdc2-q textarea:focus-visible{outline:none!important;box-shadow:none!important;border:0!important;padding:.2rem 2.6rem .2rem .1rem}
.rdc2-q label{display:flex;align-items:center;gap:.5rem;font-size:.86rem;font-weight:800;color:var(--ink-2)}
.rdc2-q input#rdc-pg{width:96px;min-height:40px;box-sizing:border-box;border:1px solid var(--line);border-radius:10px;background:var(--bg);color:var(--ink);font:inherit;font-weight:700;padding:0 .6rem;text-align:center;-moz-appearance:textfield}
.rdc2-q input#rdc-pg::-webkit-outer-spin-button,.rdc2-q input#rdc-pg::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
.rdc2-q input#rdc-pg:focus-visible{outline:2px solid var(--acc);outline-offset:1px}
.rdc2-q label small{font-weight:600;font-size:.78rem;color:var(--ink-2)}
.rdc-sp.zd-lock .rdc-spt{cursor:default}
.rdc-sp.zd-lock input#rdc-sp{display:none}
.rdc-spt .zd-lk,.zd-lk{flex:none;display:inline-flex!important;white-space:nowrap;align-items:center;gap:.3rem;min-height:30px;padding:0 .7rem;border-radius:99px;background:color-mix(in srgb,var(--acc) 16%,var(--panel));color:var(--tx-acc,var(--acc));font-size:.8rem;font-weight:900}
.zd-lk svg{width:13px;height:13px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.rdc2-t.zd-why{opacity:.45;cursor:pointer}
`;
  (typeof TR !== 'undefined' && TR ? TR : document.head).appendChild(st);

  const pgLine = (pg) => pg > 0 ? `Trecho fica escondido para quem ainda não chegou na pág. ${pg}.` : 'Trecho fica escondido para quem ainda não terminou o livro.';
  const _auto = rdAutoSp;
  rdAutoSp = function (R) {
    if (R && R.kind === 'quote') {
      const pg = Math.round(Number(R.page)) || 0;
      return { on: true, forced: true, spoiler: pg > 0 ? { kind: 'page', at: pg } : { kind: 'end' }, line: pgLine(pg) };
    }
    return _auto(R);
  };

  const LOCK = '<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
  const hasBook = (v) => !!v.querySelector('.rdc2 .rdc2-bk');
  const quoteOn = (v) => !!v.querySelector('.rdc2-t[data-t=quote].on');
  // depois de cada desenho do composer: trava visível do spoiler, rótulo do "pág." e chips apagados com motivo
  const fix = (v) => {
    const box = v.querySelector('.rdc2 .rdc-sp'); const cb = box && box.querySelector('#rdc-sp');
    if (box && cb) {
      const lock = cb.disabled && quoteOn(v);
      box.classList.toggle('zd-lock', lock);
      let lk = box.querySelector('.zd-lk');
      if (lock && !lk) { lk = document.createElement('span'); lk.className = 'zd-lk'; lk.innerHTML = LOCK + 'Sempre'; cb.after(lk); }
      if (!lock && lk) lk.remove();
      if (lock) box.querySelector('.rdc-spt b') && (box.querySelector('.rdc-spt b').textContent = 'Trecho é sempre spoiler');
    }
    const pgL = v.querySelector('.rdc2-q label');
    if (pgL && !pgL.dataset.zd) {
      pgL.dataset.zd = '1';
      const inp = pgL.querySelector('#rdc-pg');
      if (inp) {
        inp.setAttribute('inputmode', 'numeric'); inp.setAttribute('pattern', '[0-9]*'); inp.setAttribute('enterkeyhint', 'done');
        inp.setAttribute('placeholder', '—'); inp.setAttribute('aria-label', 'Página do trecho');
        [...pgL.childNodes].forEach((n) => { if (n.nodeType === 3) n.remove(); });
        const t = document.createElement('span'); t.textContent = 'Página'; pgL.insertBefore(t, inp);
        const s = document.createElement('small'); s.textContent = 'opcional'; inp.after(s);
        inp.addEventListener('input', () => { const l = v.querySelector('#rdc-spl'); if (l && quoteOn(v)) l.textContent = pgLine(Math.round(Number(inp.value)) || 0); });
      }
    }
    // chips apagados: continuam apagados, mas tocáveis para explicar
    v.querySelectorAll('.rdc2-t[data-t=fe],.rdc2-t[data-t=pw]').forEach((b) => {
      if (b.disabled) { b.disabled = false; b.classList.add('zd-why'); b.setAttribute('aria-disabled', 'true'); }
    });
  };
  const why = (v, k) => {
    const q = !!v.querySelector('.rdc2-t[data-t=question].on'), quote = quoteOn(v), rec = !!v.querySelector('.rdc2-t[data-t=rec].on');
    if (k === 'pw' && (quote || q || rec)) return toast(quote ? 'Nota fica para comentário. Tire o Trecho para dar nota.' : q ? 'Nota fica para comentário. Tire a Pergunta para dar nota.' : 'Nota fica para comentário. Tire a Indicação para dar nota.');
    if (k === 'fe' && q) return toast('Sentimentos ficam para comentário e trecho.');
    if (!hasBook(v)) { toast(k === 'pw' ? 'Escolha o livro para dar nota' : 'Escolha o livro para marcar sentimentos'); v.querySelector('.rdc2 [data-pick="1"]')?.click(); }
  };
  const hook = () => {
    const v = $('#shelflist'); if (!v || v.dataset.zdHook) return; v.dataset.zdHook = '1';
    new MutationObserver(() => { if (v.querySelector('.rdc2')) fix(v); }).observe(v, { childList: true, subtree: true });
    v.addEventListener('click', (e) => {
      const b = e.target.closest && e.target.closest('.rdc2-t.zd-why'); if (b) { e.stopImmediatePropagation(); e.preventDefault(); return why(v, b.dataset.t); }
      const go = e.target.closest && e.target.closest('#rdc-go');
      if (go && v.querySelector('.rdc2') && !hasBook(v) && (quoteOn(v) || v.querySelector('.rdc2-t[data-t=rec].on'))) {
        e.stopImmediatePropagation(); e.preventDefault();
        toast(quoteOn(v) ? 'Escolha de que livro é o trecho' : 'Escolha o livro que você leu');
        v.querySelector('.rdc2 [data-pick="1"]')?.click();
      }
    }, true);
    if (v.querySelector('.rdc2')) fix(v);
  };
  hook(); setTimeout(hook, 600); setTimeout(hook, 2000);
  const _open = openRdComposer;
  openRdComposer = function (...a) { const r = _open.apply(this, a); hook(); const v = $('#shelflist'); v && v.querySelector('.rdc2') && fix(v); return r; };
}
