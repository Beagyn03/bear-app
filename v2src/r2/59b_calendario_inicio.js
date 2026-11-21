{ const st = document.createElement('style'); st.textContent = ".dk-row{display:flex;gap:.35rem;overflow-x:auto;padding:.1rem 0 .35rem;scrollbar-width:none;max-width:100%}.dk-row::-webkit-scrollbar{display:none}\n.dk{flex:0 0 62px;display:grid;justify-items:center;gap:.12rem;border:1px solid var(--line)!important;background:var(--panel)!important;color:var(--ink)!important;border-radius:12px!important;padding:.35rem .2rem!important;font:inherit;height:auto!important;min-height:0!important;box-shadow:none!important;cursor:pointer}\n.dk small{font-size:.62rem;font-weight:900;text-transform:uppercase;color:var(--ink-2)}.dk em{font-style:normal;font-size:.62rem;font-weight:700;color:var(--ink-2)}\n.dk-c{position:relative;width:38px;height:56px;border-radius:5px;overflow:hidden;display:block}.dk-c > .dk-cv{position:absolute;inset:0}\n.dk-c .dk-cv{background-size:cover!important;background-position:center!important;background-repeat:no-repeat!important;width:100%!important;height:100%!important;margin:0!important;border-radius:0!important;box-shadow:none!important;font-size:.36rem!important}.dk-c .dk-cv img{width:100%;height:100%;object-fit:cover}\n.dk-c > .dk-gray{position:absolute;left:0;right:0;top:0;bottom:auto;z-index:1;-webkit-backdrop-filter:grayscale(1) brightness(.95);backdrop-filter:grayscale(1) brightness(.95);background:rgba(128,128,128,.18);transition:height .4s ease}\n.dk-c u{position:absolute;top:1px;right:2px;z-index:2;text-decoration:none;font-size:.7rem;color:#f5b84a;text-shadow:0 1px 2px rgba(0,0,0,.6)}\n.dk b{font-size:.68rem;font-weight:900;white-space:nowrap}.dk i{font-style:normal;font-size:.6rem;font-weight:800;color:var(--acc);white-space:nowrap}\n.dk.hoje{border:2px solid var(--acc)!important}.dk.off{border-style:dashed!important;background:none!important;opacity:.6}.dk.ok{border-color:#2f8a52!important}.dk.ok b{color:#2f8a52}\n.dk-c .dk-cv{display:grid!important;place-items:center;background:#8a6a4a;color:#fff;text-align:center;line-height:1.1;padding:2px;box-sizing:border-box;overflow:hidden}\n.dk-rib{position:relative;display:block;width:22px;height:46px;background:color-mix(in srgb,var(--ink) 12%,transparent);clip-path:polygon(0 0,100% 0,100% 100%,50% 80%,0 100%);overflow:hidden}\n.dk-rib i{position:absolute;left:0;right:0;bottom:0;background:linear-gradient(var(--acc),color-mix(in srgb,var(--acc) 70%,#000));transition:height .4s ease}\n.dk-rib.ok i{background:linear-gradient(#ffe08a,#e2a92c)}.dk-rib.off{background:none;outline:1.5px dashed var(--line);outline-offset:-2px;clip-path:none;border-radius:3px}\n.dk-rib u{position:absolute;left:0;right:0;top:4px;text-align:center;text-decoration:none;font-size:.7rem;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.4)}.dk-rib u.fim{color:var(--acc);text-shadow:none}"; TR.append(st); const st3 = document.createElement('style'); st3.textContent = ".dk-c .dk-cv{display:grid!important;place-items:center;background:#8a6a4a;color:#fff;text-align:center;line-height:1.1;padding:2px;box-sizing:border-box;overflow:hidden}"; document.head.append(st3); }
// Placar do prazo no Hoje vira calendário do mês (Bia, 17/11): cada dia mostra quantas páginas foram lidas
// (todos os livros); nos dias do prazo, fica verde quando bateu a meta do livro do prazo; dias que vêm mostram
// até qual página ler; folga tracejada; hoje com contorno; prazo com estrela.
{ const st = document.createElement('style'); st.textContent = `
.ic-hs,.ic-g{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:3px}.ic-hs{margin-bottom:3px}
.ic-hs span{text-align:center;font-size:.64rem;font-weight:800;color:var(--ink-2)}
.ic-d{position:relative;display:grid;place-items:center;height:42px;border-radius:9px;background:color-mix(in srgb,var(--ink) 5%,transparent);overflow:hidden}
.ic-d i{position:absolute;top:3px;left:5px;font-style:normal;font-size:.6rem;font-weight:800;color:var(--ink-2)}
.ic-d b{font-size:.8rem;font-weight:900;color:var(--ink);margin-top:8px}.ic-d small{font-size:.58rem;font-weight:800;color:var(--acc);margin-top:8px;white-space:nowrap}
.ic-d.blank{background:none}.ic-d.fut{background:none;border:1px solid var(--line)}.ic-d.pz{box-shadow:inset 0 -3px 0 color-mix(in srgb,var(--acc) 55%,transparent)}
.ic-d.ok{background:color-mix(in srgb,#2f8a52 22%,transparent)}.ic-d.ok b{color:#2f8a52}.ic-d.miss b{color:var(--acc)}
.ic-d.off{background:none;border:1px dashed var(--line)}.ic-d.hj{outline:2px solid var(--acc);outline-offset:-2px}.ic-d.fim i::after{content:' ★';color:var(--acc)}
.ic-d{height:58px!important}.ic-d .ic-cv{position:absolute;inset:0;width:100%!important;height:100%!important;border-radius:0!important;margin:0!important;box-shadow:none!important;font-size:.42rem!important;overflow:hidden}
.ic-d .ic-cv img{width:100%;height:100%;object-fit:cover}
.ic-d.has::after{content:'';position:absolute;inset:0;background:linear-gradient(transparent 35%,rgba(0,0,0,.6))}
.ic-d.has i{z-index:2;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.7)}.ic-d.has b{position:absolute;bottom:2px;left:0;right:0;z-index:2;margin:0;text-align:center;color:#fff!important;font-size:.72rem;text-shadow:0 1px 2px rgba(0,0,0,.8)}
.ic-d.has u{position:absolute;top:3px;right:4px;z-index:2;text-decoration:none;font-size:.55rem;font-weight:900;color:#fff;background:rgba(0,0,0,.55);border-radius:99px;padding:0 4px}
.ic-d.has.ok{box-shadow:inset 0 0 0 2px #2f8a52}.ic-d.has.ok b{color:#9fe3b6!important}
.ic-lg{display:flex;flex-wrap:wrap;gap:.7rem;margin-top:.45rem;font-size:.66rem;font-weight:800;color:var(--ink-2)}.ic-lg i{display:inline-block;width:9px;height:9px;border-radius:3px;margin-right:.25rem;vertical-align:-1px}`; TR.append(st); }
function prazoRowHTML(e, R) {
  const t = todayISO();
    const book = new Map(bookSeries(e).map((x) => [x.d, x.p])), off = e.dueOff || [];
    const since = e.dueSince && e.dueSince <= t ? e.dueSince : t, total = R.total || Number(e.totalPages) || 0;
    // meta de cada dia do prazo: dias passados pela conta do dia em que foi marcado; de hoje em diante pela conta atual
    const pd = []; for (let d = since; d <= e.dueAt; d = inAddDays(d, 1)) pd.push(d);
    const isOff = (d) => off.includes(new Date(d + 'T12:00:00Z').getUTCDay());
    const base = total ? Math.ceil(Math.max(0, total - (e.dueStartPage || 0)) / (pd.filter((d) => !isOff(d)).length || pd.length)) : 0;
    const h = dueToday(e), plan = duePlan(e, e.dueAt); const ateMap = new Map(); if (h) ateMap.set(t, h.target); { let acc = Math.max(R.now || 0, h ? h.target : 0); for (const x of plan.list) { if (x.iso === t) continue; acc += x.n; ateMap.set(x.iso, Math.min(acc, total || acc)); } }
    const rowDays = pd.length > 21 ? pd.slice(Math.max(0, pd.indexOf(t) - 3), Math.max(0, pd.indexOf(t) - 3) + 21) : pd; let hit = 0, due = 0;
    const cardsH = rowDays.map((d) => { const w = new Date(d + 'T12:00:00Z').getUTCDay(), off1 = isOff(d), fut = d > t, br = book.get(d) || 0;
      const tg = off1 ? 0 : d < t ? base : d === t && h ? h.per : (plan.list.find((x) => x.iso === d) || {}).n || 0;
      if (!off1 && d < t) { due++; if (br >= tg) hit++; }
      return dueCard(e, { iso: d, w, off: off1, tg, r: br, ate: d < t ? '' : (ateMap.get(d) || ''), hoje: d === t, fim: d === e.dueAt, fut, compact: true }, false).replace('<i>até </i>', ''); }).join('');
    let hint = false; try { hint = !localStorage.getItem('lv.capaDica'); if (hint) localStorage.setItem('lv.capaDica', '1'); } catch {}
    const info = [due ? 'Meta batida em ' + hit + ' de ' + due + ' dias' : '', ''].filter(Boolean).join(' · ');
    return (info ? '<div class="pz-mn" style="font-size:.7rem;font-weight:700;color:var(--ink-2);margin:.4rem 0 .25rem">' + info + '</div>' : '<div style="height:.4rem"></div>') + '<div class="dk-row">' + cardsH + '</div>';
}
// com prazo, o bloco separado some do Hoje (os dias ficam dentro do cartão da leitura)
{ const _isw2 = inSemana; inSemana = function () { try { const R = reading(), e = R && R.e; if (e && e.status === 'LENDO' && e.dueAt && e.dueAt >= todayISO()) return ''; } catch {} return _isw2.apply(this, arguments); }; }
{ const st3 = document.createElement('style'); st3.textContent = '.due-hd{display:flex;justify-content:space-between;align-items:center;gap:.5rem;margin:.1rem 0 .4rem}.due-hd button{margin-left:auto}.due-hd button{border:0;background:none;color:var(--acc);font:inherit;font-weight:800;font-size:.76rem;padding:0;cursor:pointer}.due-cards + .due-ln > button{display:none}.due-cards + .due-ln{justify-content:flex-start}'; TR.append(st3); }
{ let tm = 0; const paint = () => {
    const R = (() => { try { return reading(); } catch { return null; } })(); if (!R || !R.e || R.e.status !== 'LENDO' || !R.e.dueAt || R.e.dueAt < todayISO()) return;
    TR.querySelectorAll('.due-ln').forEach((ln) => { if (ln.previousElementSibling && ln.previousElementSibling.classList.contains('due-cards')) return;
      const box = document.createElement('div'); box.className = 'due-cards'; try { box.innerHTML = prazoRowHTML(R.e, R); } catch (err) { console.warn('dias do prazo', err); return; }
      const hd = document.createElement('div'); hd.className = 'due-hd'; hd.innerHTML = '<button type="button">Editar prazo</button>'; const mn = box.querySelector('.pz-mn'); if (mn) { mn.style.margin = '0'; hd.prepend(mn); } else { const sp = box.firstElementChild; if (sp && !sp.className) sp.remove(); } box.prepend(hd);
      hd.querySelector('button').addEventListener('click', (ev) => { ev.stopPropagation(); dueSheet(R.e); });
      ln.before(box); try { paintCv(box); } catch {} });
    TR.querySelectorAll('.v3-now:not(.empty)').forEach((card) => {
      card.querySelectorAll('.v3-au').forEach((x) => { if (/No seu ritmo/.test(x.textContent)) x.style.display = 'none'; });
    });
  };
  new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(paint, 90); }).observe(TR, { childList: true, subtree: true }); setTimeout(paint, 1600); }

// "Convidar alguém para ler junto" vira um ícone ao lado do ••• (sempre, não só com prazo)
{ const st = document.createElement('style'); st.textContent = '.v3-now .v3-bud:has(> .v3-bud-inv:only-child){display:none!important}.v3-inv-ic{position:absolute;top:.45rem;right:2.6rem;width:34px;height:34px;border-radius:50%;border:0;background:none;color:var(--ink-2);display:grid;place-items:center;padding:0;cursor:pointer}.v3-inv-ic svg{width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}'; TR.append(st);
  let tm = 0; const put = () => TR.querySelectorAll('.v3-now:not(.empty)').forEach((card) => {
    const inv = card.querySelector('#v3-bud-inv'); if (!inv || card.querySelector('.v3-inv-ic')) return;
    const b = document.createElement('button'); b.type = 'button'; b.className = 'v3-inv-ic'; b.setAttribute('aria-label', 'Convidar alguém para ler junto'); b.title = 'Ler junto';
    b.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.2"/><path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5"/><path d="M18 8v6M15 11h6"/></svg>';
    b.addEventListener('click', (ev) => { ev.stopPropagation(); inv.click(); }); card.append(b); });
  new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(put, 80); }).observe(TR, { childList: true, subtree: true }); setTimeout(put, 1500); }
