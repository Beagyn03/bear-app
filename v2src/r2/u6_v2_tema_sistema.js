// Aparência › "Sistema" (reteste da Bia, 20/11, M9): segue o tema do celular (claro = Papel, escuro = Escuro) e muda junto
// quando o celular muda. É o padrão de quem nunca escolheu um tema. A escolha fica em T().theme = 'sistema'; o
// localStorage "bear.theme" guarda o tema já resolvido, para a primeira pintura (script do topo da página) não piscar.
{ const st = document.createElement('style'); st.textContent = `.th-dots button[data-th=sistema]{background:linear-gradient(135deg,#f5efe4 50%,#1a1613 50%)!important}`; TR.append(st); }
{ const MQ = (() => { try { return matchMedia('(prefers-color-scheme: dark)'); } catch { return null; } })();
  if (!THEMES.some((t) => t[0] === 'sistema')) THEMES.unshift(['sistema', 'Sistema', '#f5efe4', '#c46f2b']);
  const real = () => (MQ && MQ.matches ? 'escuro' : 'papel');
  const _at = applyTheme;
  applyTheme = function (k, persist) {
    if (k !== 'sistema') { try { localStorage.removeItem('lv.temaSis'); } catch {} return _at.apply(this, arguments); }
    _at.call(this, real(), false); try { localStorage.setItem('lv.temaSis', '1'); } catch {}
    if (persist && T().theme !== 'sistema') { T().theme = 'sistema'; save(); }
  };
  const isSis = () => { try { return T().theme === 'sistema' || (!T().theme && localStorage.getItem('lv.temaSis') !== '0'); } catch { return false; } };
  // quem nunca escolheu (sem T().theme) passa a seguir o celular; escolher qualquer tema grava a escolha
  if (isSis()) applyTheme('sistema');
  if (MQ) { const ch = () => { if (isSis()) applyTheme('sistema'); }; try { MQ.addEventListener('change', ch); } catch { try { MQ.addListener(ch); } catch {} } }
  // Ajustes: a bolinha acesa e o nome acompanham "Sistema"
  let tm = 0; const sync = () => { tm = 0; const box = TR.querySelector('.th-dots'); if (!box) return; const sis = isSis(), k = sis ? 'sistema' : document.documentElement.dataset.pal;
    box.querySelectorAll('button[data-th]').forEach((b) => { const on = b.dataset.th === k; if (b.classList.contains('on') !== on) b.classList.toggle('on', on); });
    const n = TR.querySelector('#aj-thn'), nm = (THEMES.find((t) => t[0] === k) || [])[1]; if (n && nm && n.textContent !== nm) n.textContent = nm; };
  new MutationObserver(() => { if (!tm) tm = setTimeout(sync, 60); }).observe(TR, { childList: true, subtree: true });
  TR.addEventListener('click', (ev) => { const b = ev.target.closest && ev.target.closest('.th-dots button[data-th]'); if (!b) return; if (b.dataset.th !== 'sistema') { try { localStorage.setItem('lv.temaSis', '0'); } catch {} } setTimeout(sync, 30); }, true); }
