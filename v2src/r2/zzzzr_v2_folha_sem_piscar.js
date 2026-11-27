// ---------- v2: folha não pisca ao tocar nas opções (Bia, 27/11) ----------
// "Arruma essa porcaria de piscar a tela quando clicamos nas opções da mesma página."
// Cada toque numa opção (Página/%, Hoje/Ontem, Quem vê, emoções, detalhes...) chama v4Draw, que refaz a folha inteira:
// o fundo escuro e a folha recomeçavam a animação de entrada (piscada) e a rolagem voltava ao topo.
// Agora, se a mesma folha já estava aberta, o redesenho sai sem animação de entrada e com a rolagem onde estava.
// A animação continua só quando a folha abre (ou troca de folha).
const V4KEEP_CSS = `.v4ler.v4keep .veil,.v4ler.v4keep .sheet,.v4ler.v4keep .sheet.upfullpg,.v4ler.v4keep .sheet.lerfull{animation:none!important}`;
{ const _d = v4Draw; v4Draw = function () {
    const R0 = V4 && V4.isConnected ? V4 : null, st = v4State();
    const key = st.sheet ? st.sheet + '|' + (st.sheetE || st.e || '') : '';
    const sh0 = R0 && R0.querySelector('.sheet');
    const same = !!(sh0 && key && R0.dataset.v4k === key);
    // rolagem de tudo que estiver rolado dentro da folha (pela posição no desenho)
    const scr = []; if (same) { [sh0, ...sh0.querySelectorAll('*')].forEach((el, i) => { if (el.scrollTop > 0) scr.push([el.className, i, el.scrollTop]); }); }
    const r = _d.apply(this, arguments);
    try { const R = V4; if (!R) return r;
      const root = R.getRootNode && R.getRootNode(); if (root && root !== document && !root.querySelector('style.v4keepcss')) { const s = document.createElement('style'); s.className = 'v4keepcss'; s.textContent = V4KEEP_CSS; root.append(s); }
      R.classList.toggle('v4keep', same); R.dataset.v4k = key;
      if (same && scr.length) { const sh = R.querySelector('.sheet'); if (sh) { const all = [sh, ...sh.querySelectorAll('*')];
        scr.forEach(([cls, i, top]) => { const el = all[i] && all[i].className === cls ? all[i] : all.find((x) => x.className === cls); if (el) el.scrollTop = top; }); } }
    } catch (err) { console.warn('folha sem piscar', err); }
    return r; }; }
