// Desafio da semana com página própria (Bia, 21/11): tocar na linha do desafio não abre mais o Novo post direto (confundia).
// Abre a página do desafio: tema, quanto falta (termina domingo), as respostas (posts que começam com "Desafio da semana: <tema>",
// com o mesmo filtro de spoiler do feed) e "Participar", que abre o Novo post já marcado com o desafio (etiqueta removível).
// Pendência: a API não tem marca própria de desafio nos posts; o app reconhece pelo começo do texto.
const WDES_CSS = `
.v6com .wdes{display:grid;gap:14px;padding:4px 0 24px}
.v6com .wdes-top{display:flex;align-items:center;gap:8px}
.v6com .wdes-top button{width:44px;height:44px;border:0;border-radius:12px;background:none;color:var(--ink);display:grid;place-items:center;cursor:pointer}
.v6com .wdes-top b{font-family:var(--v2-disp);font-size:1.15rem}
.v6com .wdes-card{display:grid;gap:8px;padding:16px;border:1px solid var(--line);border-radius:18px;background:color-mix(in srgb,var(--acc) 10%,var(--panel))}
.v6com .wdes-card .eb{font-size:.72rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:var(--acc)}
.v6com .wdes-card h2{margin:0;font-family:var(--v2-disp);font-size:1.4rem;line-height:1.2}
.v6com .wdes-card small{color:var(--ink-2);font-weight:700}
.v6com .wdes-go{justify-self:start;min-height:44px;padding:0 18px;border:0;border-radius:99px;background:var(--acc);color:var(--acc-ink,#fff);font:inherit;font-weight:900;cursor:pointer}
.v6com .wdes-h{font-weight:900;font-size:.8rem;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-2);margin-top:4px}
.v6com .wdes-empty{display:grid;justify-items:center;gap:6px;padding:20px 16px;border:1.5px dashed var(--line);border-radius:16px;text-align:center;color:var(--ink-2);line-height:1.45}
.v6com .wdes-empty b{color:var(--ink);font-size:15px}
.v6com .wdes-empty .btn{margin-top:6px}
.v6com .wdes-card small{font-size:13px}
.v6com .wdes-go.btn.p{color:var(--on-acc,#fff)}
`;
// o CSS precisa morar no shadow da Comunidade (no TR ele não alcança a página: Bia, 21/11, desafio aparecia sem estilo)
const wdesArm = (sr) => { if (sr && !sr.querySelector('style[data-wdes]')) { const st = document.createElement('style'); st.dataset.wdes = 1; st.textContent = WDES_CSS; sr.append(st); } };
const wdesQ = () => { try { return v2WkQ(); } catch { return ''; } };
const wdesLeft = () => { const d = new Date().getDay(); const n = d === 0 ? 0 : 7 - d; return n === 0 ? 'termina hoje (domingo)' : n === 1 ? 'termina amanhã (domingo)' : `termina domingo · faltam ${n} dias`; };
const wdesItems = () => { const q = wdesQ(), pre = ('Desafio da semana: ' + q).toLowerCase(), seen = new Set(), out = [];
  ['rede', 'amigos'].forEach((sc) => { try { v6Feed(sc).items.forEach((x) => { const k = x.type + x.id; if (seen.has(k)) return; if (String(x.text || '').toLowerCase().startsWith(pre)) { seen.add(k); out.push(x); } }); } catch {} });
  try { return rdVisible(out); } catch { return out; } };
{ const _p = v6Paint; v6Paint = function () {
    const r = _p.apply(this, arguments);
    try {
      if (!S.v6des || S.tab !== 'comunidade') return r;
      const host = $('#lista > .v6host'); if (!host) return r; const R = host.shadowRoot.querySelector('.v6com'), S6 = v6S(); if (!R) return r; wdesArm(host.shadowRoot);
      const q = wdesQ(), list = wdesItems(), F = v6Feed('rede'); S6.list = list;
      if (!F.at && !F.busy) setTimeout(() => { try { v6Load('rede'); } catch {} }, 0);
      // "Carregando…" só na primeira vez: ao recarregar o feed, a página mantinha a lista vazia/respostas trocando com "Carregando…" (tremor, 22/11)
      const posts = list.map((it, i) => v6PostHTML(it, i)).join('');
      R.innerHTML = `<div class="wdes"><div class="wdes-top"><button data-a="wdesback" aria-label="Voltar">${v4ic('back', 20)}</button><b>Desafio da semana</b></div>
        <div class="wdes-card"><span class="eb">Tema desta semana</span><h2>${esc(q)}</h2><small>${esc(wdesLeft())}</small><button class="wdes-go btn p" data-a="wdesgo">Participar</button></div>
        <div class="wdes-h">Respostas${list.length ? ' · ' + list.length : ''}</div>
        ${posts || (!F.at ? '<div class="wdes-empty">Carregando…</div>' : '<div class="wdes-empty"><b>Ninguém respondeu ainda</b><span>Conte qual livro você escolheria para este tema.</span><button class="btn s" data-a="wdesgo">Responder ao desafio</button></div>')}</div>`;
      R.querySelectorAll('[data-avh]').forEach((n) => { try { const d = avatarOf(n.dataset.avh); if (d) { n.style.backgroundImage = `url("${d}")`; n.textContent = ''; } } catch {} });
    } catch (err) { console.warn('desafio', err); }
    return r;
  }; }
// cliques do desafio: capturados antes do v6Click (no shadowRoot da Comunidade)
{ const hook = () => { const host = $('#lista > .v6host'); const sr = host && host.shadowRoot; if (!sr || sr.__wdes) return; sr.__wdes = true;
    sr.addEventListener('click', (ev) => { const b = ev.target.closest && ev.target.closest('[data-a]'); if (!b) return; const a = b.dataset.a;
      // (Bia, 22/11) o desafio virou aba da Comunidade: o atalho antigo leva à aba (a página própria não abre mais)
      if (a === 'v6des') { ev.stopImmediatePropagation(); ev.preventDefault(); S.v6des = false; v6S().f = 'desafio'; v6Paint(); try { window.scrollTo(0, 0); } catch {} return; }
      if (a === 'wdesback') { ev.stopImmediatePropagation(); ev.preventDefault(); S.v6des = false; v6Paint(); return; }
      if (a === 'wdesgo') { ev.stopImmediatePropagation(); ev.preventDefault(); openRdComposer({ kind: 'comment', desafio: wdesQ() }); return; }
    }, true); };
  new MutationObserver(hook).observe(TR, { childList: true, subtree: true }); hook();
  // sair da aba Comunidade fecha a página do desafio
  const _gt = goTab; goTab = function (t) { if (t !== 'comunidade') S.v6des = false; return _gt.apply(this, arguments); };
}
