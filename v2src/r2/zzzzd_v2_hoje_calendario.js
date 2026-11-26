// ---------- v2: calendário de leitura no Hoje (Bia, 26/11) ----------
// "No Sobre não faz sentido mostrar o calendário. Coloca no início." O calendário do mês da Órbita (capa do que leu em cada
// dia, setas para os meses) sai da aba Sobre do perfil e fica no Hoje, logo abaixo dos cartões Órbita e Meta.
// Some junto com a Órbita quando ela está desligada em Funções do app.
{ const st = document.createElement('style'); st.textContent = `.h3cal{margin:.9rem 0 .4rem}.h3cal .orb-cal{margin:0}`; TR.append(st); }
{ let tm = 0;
  const mount = () => {
    const H = TR.host || document.body; if (H.classList && H.classList.contains('v2off-orbita')) { TR.querySelectorAll('.h3cal').forEach((c) => c.remove()); return; }
    const day = TR.querySelector('.v3day'); if (!day || !day.offsetParent) return;
    S.h3calYM = S.h3calYM || todayISO().slice(0, 7);
    let html = ''; try { html = orbCalHTML(S.h3calYM); } catch { html = ''; }
    let c = day.nextElementSibling && day.nextElementSibling.classList.contains('h3cal') ? day.nextElementSibling : null;
    if (!html) { if (c) c.remove(); return; }
    if (!c) { TR.querySelectorAll('.h3cal').forEach((x) => x.remove()); c = document.createElement('section'); c.className = 'h3cal'; c.setAttribute('aria-label', 'Calendário de leitura'); day.after(c); }
    if (c.dataset.h !== html) { c.innerHTML = html; c.dataset.h = html; try { paintCv(c); } catch {}
      orbCalWire(c, () => S.h3calYM, (ym) => { S.h3calYM = ym; c.dataset.h = ''; mount(); }); }
  };
  new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; try { mount(); } catch (err) { console.warn('calendário no Hoje', err); } }, 120); }).observe(TR, { childList: true, subtree: true });
}
