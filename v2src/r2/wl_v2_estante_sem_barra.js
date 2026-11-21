// Organizar e Decorar sem a barra de abas (teste de estresse, 21/11): o painel do Decorar encostava no botão central "Ler".
// Enquanto um dos dois modos está aberto na Biblioteca, a barra de abas some e o painel desce até o fim da tela; ao concluir, volta.
{ const st = document.createElement('style'); st.textContent = '#tabbar.shx-off{display:none!important}'; TR.append(st);
  let raf = 0;
  const sync = () => { raf = 0; const tb = TR.querySelector('#tabbar'); if (!tb) return; let m = null; try { m = SHX_MODE; } catch {}
    const on = (m === 'org' || m === 'deco') && S.tab === 'estante'; if (tb.classList.contains('shx-off') !== on) tb.classList.toggle('shx-off', on);
    if (!on) return; const rs = [TR]; TR.querySelectorAll('*').forEach((h) => { if (h.shadowRoot) rs.push(h.shadowRoot); });
    rs.forEach((r) => r.querySelectorAll('[style*="--shx-tab"]').forEach((el) => { if (el.style.getPropertyValue('--shx-tab') !== '0px') el.style.setProperty('--shx-tab', '0px'); })); };
  const mo = new MutationObserver(() => { if (!raf) raf = requestAnimationFrame(sync); }); mo.observe(TR, { childList: true, subtree: true });
  // a estante desenha dentro de um shadow root (.v5host): observar também os que aparecerem
  const seen = new WeakSet(); setInterval(() => { TR.querySelectorAll('*').forEach((h) => { if (h.shadowRoot && !seen.has(h.shadowRoot)) { seen.add(h.shadowRoot); mo.observe(h.shadowRoot, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] }); } }); }, 1500);
  const _gt = goTab; goTab = function () { const r = _gt.apply(this, arguments); try { if (!raf) raf = requestAnimationFrame(sync); } catch {} return r; }; }
