// Novidades dos amigos (Bia, 17/11): cada cartão de outra pessoa ganha "•••" com Ocultar, Silenciar a pessoa e Denunciar
// (denúncia só para avaliação, que tem texto). Ocultar e silenciar usam as mesmas listas da Comunidade (rdHide / rdMute).
{ const st = document.createElement('style'); st.textContent = '.fd-post header{position:relative}.fd-dots{flex:none;border:0;background:none;color:var(--ink-2);font-weight:900;font-size:1rem;width:34px;height:34px;align-self:flex-start;cursor:pointer}'; TR.append(st);
  let tm = 0; const paint = () => {
    let P = { hide: [], mute: [] }; try { P = rdPrefs(); } catch {}
    TR.querySelectorAll('.fd-post[data-id]').forEach((a) => {
      const id = a.dataset.id, hd = a.querySelector('header'), tb = hd && hd.querySelector('p > b'), title = tb ? tb.textContent : '', key = normT(title);
      const h0 = (a.querySelector('.fd-who') || {}).dataset ? String((a.querySelector('.fd-who') || {}).dataset.h || '').toLowerCase() : '';
      if (P.hide.includes('fd' + id) || (key && P.mute.includes(key)) || (h0 && (P.muteU || []).includes(h0))) { a.style.display = 'none'; return; }
      if (!hd || a.querySelector('.fd-dots')) return; const who = (hd.querySelector('.fd-who') || {}).textContent || ''; if (who === 'Você') return;
      const isRev = !!a.querySelector('.fd-like');
      const b = document.createElement('button'); b.type = 'button'; b.className = 'fd-dots'; b.setAttribute('aria-label', 'Mais opções'); b.textContent = '•••'; hd.append(b);
      b.addEventListener('click', (ev) => { ev.stopPropagation(); const items = [
        { label: 'Ocultar esta novidade', fn: () => { rdSetPref('rdHide', [...rdPrefs().hide, 'fd' + id].slice(-300)); a.style.display = 'none'; toast('Ocultado'); } },
        ...(h0 ? [{ label: 'Silenciar @' + h0, fn: () => { rdSetPref('rdMuteU', [...new Set([...rdPrefs().muteU, h0])].slice(-300)); paint(); toast('Você não verá mais as novidades de @' + h0); } }] : []),
        ...(isRev ? [{ label: 'Denunciar', fn: () => sheet('Por que denunciar?', [['Spoiler sem aviso', 'spoiler'], ['Ofensa ou ataque', 'ofensa'], ['Spam ou propaganda', 'spam'], ['Outro motivo', 'outro']].map(([t, k]) => [t, async () => {
          const r = await sapi('POST', '/v1/report/review/' + id, { reason: k }); toast(r.status < 300 ? 'Denúncia enviada. Obrigado!' : 'Não consegui enviar agora');
          if (r.status < 300) { rdSetPref('rdHide', [...rdPrefs().hide, 'fd' + id].slice(-300)); a.style.display = 'none'; } }])) }] : []),
        ...(title ? [{ label: 'Ver o livro', fn: () => openAnyBook(title) }] : []),
      ]; popMenu(b, items); });
    }); };
  new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(paint, 70); }).observe(TR, { childList: true, subtree: true }); }
