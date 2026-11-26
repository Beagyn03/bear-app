// ---------- v2: calendário de leitura no Hoje (Bia, 26/11) ----------
// "No Sobre não faz sentido mostrar o calendário. Coloca no início." O calendário do mês da Órbita (capa do que leu em cada
// dia, livros terminados com ✓, setas para os meses) fica no Hoje, logo abaixo dos cartões Órbita e Meta.
// Ele faz parte do HTML do próprio bloco do livro (v3HeroHTML), então o Hoje o desenha junto em todo redesenho. As versões
// anteriores colocavam o calendário de fora e ele saía e voltava a cada redesenho: a tela encolhia e crescia (portão 26/11).
// Some junto com a Órbita quando ela está desligada em Funções do app.
{ const st = document.createElement('style'); st.textContent = `.h3cal{margin:.9rem 0 .2rem}.h3cal .orb-cal{margin:0}`; TR.append(st); }
const h3CalHTML = () => { const H = TR.host || document.body; if (H.classList && H.classList.contains('v2off-orbita')) return '';
  S.h3calYM = S.h3calYM || todayISO().slice(0, 7); let html = ''; try { html = orbCalHTML(S.h3calYM); } catch { html = ''; }
  return html ? `<section class="h3cal" aria-label="Calendário de leitura">${html}</section>` : ''; };
{ const _h = v3HeroHTML; v3HeroHTML = function () { const r = _h.apply(this, arguments); try { if (typeof r === 'string' && r.includes('class="v3day"')) return r + h3CalHTML(); } catch (err) { console.warn('calendário no Hoje', err); } return r; }; }
// setas de mês: troca só o calendário na hora (o próximo redesenho do Hoje já usa o mês novo)
TR.addEventListener('click', (ev) => { const b = ev.target.closest && ev.target.closest('.h3cal .orb-mn [data-m]'); if (!b || b.disabled) return;
  ev.stopPropagation(); const [y, m] = (S.h3calYM || todayISO().slice(0, 7)).split('-').map(Number), d = new Date(y, m - 1 + Number(b.dataset.m), 1);
  S.h3calYM = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
  const c = b.closest('.h3cal'); try { c.innerHTML = orbCalHTML(S.h3calYM); paintCv(c); } catch {} }, true);
