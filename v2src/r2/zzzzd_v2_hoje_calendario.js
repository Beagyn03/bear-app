// ---------- v2: calendário de leitura no Hoje (Bia, 26/11) ----------
// "No Sobre não faz sentido mostrar o calendário. Coloca no início." O calendário do mês da Órbita (capa do que leu em cada
// dia, setas para os meses) sai da aba Sobre do perfil e fica no Hoje, logo abaixo dos cartões Órbita e Meta.
// Some junto com a Órbita quando ela está desligada em Funções do app.
{ const st = document.createElement('style'); st.textContent = `.h3cal{margin:.9rem 0 .4rem}.h3cal .orb-cal{margin:0}`; TR.append(st); }
{ let tm = 0;
  const mount = () => {
    const H = TR.host || document.body; if (H.classList && H.classList.contains('v2off-orbita')) { TR.querySelectorAll('.h3cal').forEach((c) => c.remove()); return; }
    // fica DEPOIS do bloco do livro (.v3x-a), que o Hoje reescreve quando chegam dados: dentro dele o calendário era
    // apagado e recolocado a cada redesenho e a tela tremia (portão de QA 26/11)
    // só com o Hoje na frente: com o perfil (ou outra tela) por cima, o Hoje escondido redesenhava e o calendário entrava e
    // saía sem parar, fazendo o perfil redesenhar 7 vezes por segundo (portão de QA 26/11)
    if (S.tab !== 'inicio') return; const sl = $('#shelflist'); if (sl && !sl.hidden) return;
    const day = TR.querySelector('.v3day'), blk = day && (day.closest('.v3x') || day); if (!day || !blk.offsetParent) return;
    S.h3calYM = S.h3calYM || todayISO().slice(0, 7);
    let html = ''; try { html = orbCalHTML(S.h3calYM); } catch { html = ''; }
    let c = blk.nextElementSibling && blk.nextElementSibling.classList.contains('h3cal') ? blk.nextElementSibling : null;
    if (!html) { if (c) c.remove(); return; }
    if (!c) { TR.querySelectorAll('.h3cal').forEach((x) => x.remove()); c = document.createElement('section'); c.className = 'h3cal'; c.setAttribute('aria-label', 'Calendário de leitura'); blk.after(c); }
    if (c.dataset.h !== html) { c.innerHTML = html; c.dataset.h = html; try { paintCv(c); } catch {}
      orbCalWire(c, () => S.h3calYM, (ym) => { S.h3calYM = ym; c.dataset.h = ''; mount(); }); }
  };
  // ao voltar para o Hoje sem nada mudar na página o observador não disparava e o calendário não voltava: confere a cada 1 s
  setInterval(() => { try { if (S.tab === 'inicio' && !TR.querySelector('.h3cal')) mount(); } catch {} }, 1000);
  new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; try { mount(); } catch (err) { console.warn('calendário no Hoje', err); } }, 120); }).observe(TR, { childList: true, subtree: true });
}
