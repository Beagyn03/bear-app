// Avisos › Notificações (Bia, 20/11): "Limpar tudo" no alto (com Desfazer), apagar uma (deslizar para a esquerda revela
// "Apagar"; segurar abre Apagar / Marcar como lida), tocar continua abrindo. Novidades dos amigos não são notificações:
// segurar = "Ocultar" (fica oculta neste aparelho) e, no fim, "Não mostrar novidades aqui" leva ao ajuste que já existe.
{ const st = document.createElement('style'); st.textContent = `
#editor.ntpage .nt-list{display:grid;gap:.45rem}
#editor.ntpage .row.end #nt-clear{display:none!important}
.v6ntbar{display:flex;justify-content:flex-end;margin:.2rem 0 .1rem}
.v6ntbar button{border:0;background:none;color:var(--acc);font:inherit;font-weight:800;font-size:.84rem;min-height:36px}
.nt-it.v6sw{position:relative;overflow:hidden;touch-action:pan-y}
.nt-it.v6sw > *:not(.v6del){transition:transform .18s ease}
.nt-it.v6sw.v6open > *:not(.v6del){transform:translateX(-84px)}
.v6del{position:absolute;right:0;top:0;bottom:0;width:80px;border:0;background:#c0392b;color:#fff;font:inherit;font-weight:900;font-size:.84rem;transform:translateX(100%);transition:transform .18s ease}
.nt-it.v6open .v6del{transform:none}
.nt-it .nt-x{display:none!important}
.nt-fd.v6hid{display:none!important}
.v6nofd{border:0;background:none;color:var(--ink-2);font:inherit;font-weight:700;font-size:.8rem;text-decoration:underline;min-height:40px;justify-self:start}
`; TR.append(st); }
{ const ed = $('#editor');
  const HID = () => (L.fdHidden = L.fdHidden || []);
  const redraw = () => { try { openNotif(); } catch {} };
  const del = (id) => { if (String(id).startsWith('req:')) L.reqHidden = [...(L.reqHidden || []), String(id).slice(4)]; else L.list = L.list.filter((x) => x.id !== id); saveL(); };
  const longPress = (el, fn) => { let t = 0, x0 = 0, y0 = 0, fired = false;
    el.addEventListener('pointerdown', (ev) => { fired = false; x0 = ev.clientX; y0 = ev.clientY; clearTimeout(t); t = setTimeout(() => { fired = true; fn(el); }, 480); });
    el.addEventListener('pointermove', (ev) => { if (Math.abs(ev.clientX - x0) > 8 || Math.abs(ev.clientY - y0) > 8) clearTimeout(t); });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach((n) => el.addEventListener(n, () => clearTimeout(t)));
    el.addEventListener('click', (ev) => { if (fired) { ev.stopImmediatePropagation(); ev.preventDefault(); fired = false; } }, true);
    el.addEventListener('contextmenu', (ev) => { ev.preventDefault(); fired = true; fn(el); }); };
  const swipe = (el) => { let x0 = 0, y0 = 0, on = false;
    el.addEventListener('pointerdown', (ev) => { x0 = ev.clientX; y0 = ev.clientY; on = true; });
    el.addEventListener('pointerup', (ev) => { if (!on) return; on = false; const dx = ev.clientX - x0, dy = Math.abs(ev.clientY - y0); if (dy > 30) return;
      if (dx < -40) { el.classList.add('v6open'); el.dataset.v6sw = Date.now(); } else if (dx > 30) el.classList.remove('v6open'); });
    el.addEventListener('click', (ev) => { if (Date.now() - (+el.dataset.v6sw || 0) < 400) { ev.stopImmediatePropagation(); ev.preventDefault(); } else if (el.classList.contains('v6open') && !ev.target.closest('.v6del')) { el.classList.remove('v6open'); ev.stopImmediatePropagation(); ev.preventDefault(); } }, true); };
  const enhance = () => {
    if (!ed || ed.hidden || !ed.classList.contains('ntpage')) return; const body = ed.querySelector('.ed-body'); if (!body || body.dataset.v6) return; body.dataset.v6 = '1';
    const list = body.querySelector('.nt-list'), items = [...body.querySelectorAll('.nt-it[data-id]')];
    if (list && items.length && !body.querySelector('.v6ntbar')) {
      list.insertAdjacentHTML('beforebegin', '<div class="v6ntbar"><button type="button" id="v6-clear">Limpar tudo</button></div>');
      body.querySelector('#v6-clear').addEventListener('click', () => { const snap = JSON.stringify({ list: L.list, reqHidden: L.reqHidden || [] });
        L.reqHidden = [...new Set([...(L.reqHidden || []), ...items.filter((n) => n.dataset.id.startsWith('req:')).map((n) => n.dataset.id.slice(4))])]; L.list = []; saveL(); redraw();
        toast('Notificações apagadas', { label: 'Desfazer', fn: () => { const b = JSON.parse(snap); L.list = b.list; L.reqHidden = b.reqHidden; saveL(); redraw(); } }); });
    }
    items.forEach((n) => { if (n.dataset.v6) return; n.dataset.v6 = '1'; const id = n.dataset.id;
      if (!id.startsWith('req:')) { n.classList.add('v6sw'); const d = document.createElement('button'); d.type = 'button'; d.className = 'v6del'; d.textContent = 'Apagar';
        d.addEventListener('click', (ev) => { ev.stopPropagation(); del(id); redraw(); }); n.append(d); swipe(n); }
      longPress(n, () => { try { popMenu(n, [{ label: 'Apagar', danger: true, fn: () => { del(id); redraw(); } }, ...(id.startsWith('req:') ? [] : [{ label: 'Marcar como lida', fn: () => { const x = L.list.find((y) => y.id === id); if (x) { x.read = true; saveL(); } toast('Marcada como lida'); } }])]); } catch {} });
    });
    // Novidades dos amigos
    const fds = [...body.querySelectorAll('.nt-fd[data-fid]')];
    fds.forEach((b) => { if (HID().includes(b.dataset.fid)) b.classList.add('v6hid'); if (b.dataset.v6) return; b.dataset.v6 = '1';
      longPress(b, () => { try { popMenu(b, [{ label: 'Ocultar', fn: () => { HID().push(b.dataset.fid); L.fdHidden = HID().slice(-200); saveL(); b.classList.add('v6hid'); toast('Novidade oculta'); } }]); } catch {} }); });
    if (fds.length && !body.querySelector('.v6nofd')) { const all = body.querySelector('#nt-all'), x = document.createElement('button'); x.type = 'button'; x.className = 'v6nofd'; x.textContent = 'Não mostrar novidades aqui';
      x.addEventListener('click', () => { try { closeEd(); } catch {} setTimeout(() => { try { feedPrefsSheet(); } catch { toast('Comunidade › engrenagem › Novidades no feed'); } }, 60); }); (all || fds[fds.length - 1]).after(x); }
  };
  const _on = openNotif; openNotif = function () { const r = _on.apply(this, arguments); const b = ed && ed.querySelector('.ed-body'); if (b) delete b.dataset.v6; setTimeout(enhance, 0); setTimeout(enhance, 120); return r; };
}
