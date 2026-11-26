// ---------- v2: botão Ler vira "orelha de página" (Bia, 26/11: "amei a orelha de página") ----------
// O canto inferior direito da tela fica dobrado, como a orelha que a gente faz no livro. Por baixo aparece a capa do
// livro atual com o %; na dobra, a página onde parou. Tocar: a orelha levanta e abre a leitura. Arrastar o canto para
// cima/esquerda vira a página (a dobra cresce até cobrir a tela) e abre a leitura. Enter/Espaço também abrem.
// Continua sendo o mesmo #v5ler: quando aparece (só no Hoje, sem sessão aberta), a altura acima da barra e a ação
// (v2Ler) são as de antes; muda só o desenho e o gesto. Movimento reduzido: sem animação, abre direto.
{ const st = document.createElement('style'); st.textContent = `
#v5ler.ear{right:0!important;left:auto!important;translate:0 16px;width:var(--s,64px);height:var(--s,64px);min-width:0;padding:0;border:0;border-radius:0;background:none;box-shadow:none;overflow:visible;touch-action:none;cursor:grab;transform:none!important}
#v5ler.ear > .pl,#v5ler.ear > .lb{display:none}
#v5ler.ear::after{display:none}
#v5ler.ear .eu{position:absolute;inset:0;clip-path:polygon(100% 0,100% 100%,0 100%);background:#2a2433 center/cover no-repeat;background-image:var(--cv,linear-gradient(160deg,#6b5a8e,#2a2140 55%,#15111e))}
#v5ler.ear .eu::after{content:"";position:absolute;inset:0;background:linear-gradient(315deg,rgba(0,0,0,0) 35%,rgba(0,0,0,.6))}
#v5ler.ear .eu b{position:absolute;right:6px;bottom:5px;z-index:1;font-family:var(--f-disp,Georgia,serif);font-size:11px;font-weight:700;color:#f3c56b;text-shadow:0 1px 2px rgba(0,0,0,.7)}
#v5ler.ear .ef{position:absolute;inset:0;clip-path:polygon(0 0,100% 0,0 100%);background:linear-gradient(135deg,#e9dcc0,#f6eedc 55%,#fffaf0);filter:drop-shadow(-3px -3px 6px rgba(0,0,0,.45))}
#v5ler.ear .ef span{position:absolute;left:7px;top:6px;font-size:10px;font-weight:900;color:#6a5426;white-space:nowrap}
#v5ler.ear.lift{transition:width .25s cubic-bezier(.3,1.6,.5,1),height .25s cubic-bezier(.3,1.6,.5,1)}
#v5ler.ear.go{transition:width .45s ease-in,height .45s ease-in}
#v5ler.ear:focus-visible{outline:3px solid var(--acc);outline-offset:-3px}
.v5shade{position:fixed;inset:0;z-index:39;pointer-events:none;background:radial-gradient(circle at 100% 100%,rgba(0,0,0,.4),transparent 60%);opacity:0}
@media (prefers-reduced-motion:reduce){#v5ler.ear.lift,#v5ler.ear.go{transition:none}}
`; TR.append(st); }
{ const ear = jnPl_, S0 = 64, OPEN = 150, RM = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  ear.classList.add('ear'); ear.insertAdjacentHTML('beforeend', '<span class="eu"><b></b></span><span class="ef"><span></span></span>');
  const shade = document.createElement('div'); shade.className = 'v5shade'; TR.append(shade);
  const set = (s) => { ear.style.setProperty('--s', s + 'px'); shade.style.opacity = String(Math.max(0, Math.min(1, (s - S0) / 220))); };
  let d = null, busy = false, skipClick = false;
  // conteúdo: capa, % e página do livro atual (atualiza só quando muda)
  let sig = '';
  const fill = () => { if (ear.hidden) return; let e = null, pct = 0, now = 0; try { const R = reading(); e = R && R.e; if (e) { const i = readingInfo(e); pct = Math.round(i.pct || 0); now = i.now || 0; } } catch {}
    const cv = e && e.cover && !/^data:/.test(e.cover) ? e.cover : (e && e.cover) || '';
    const s = [e && e.id, pct, now, cv.length].join('|'); if (s === sig) return; sig = s;
    if (cv) ear.style.setProperty('--cv', `url("${cv.replace(/"/g, '%22')}")`); else ear.style.removeProperty('--cv');
    ear.querySelector('.eu b').textContent = e ? pct + '%' : '';
    ear.querySelector('.ef span').textContent = e && now ? 'pág. ' + now : 'Ler';
    ear.setAttribute('aria-label', e ? `Continuar leitura de ${e.title}, ${pct}%` : 'Ler: abrir a sessão de leitura'); };
  setInterval(fill, 1500); setTimeout(fill, 300);
  const reset = () => { busy = false; ear.classList.remove('go'); ear.classList.add('lift'); set(S0); };
  const openNow = () => { try { v2Ler(); } catch (err) { console.error('ler', err); } setTimeout(reset, RM() ? 0 : 500); };
  const finish = () => { if (busy) return; busy = true; ear.classList.remove('lift'); ear.classList.add('go'); set(Math.max(innerWidth, innerHeight) * 1.6); setTimeout(openNow, RM() ? 0 : 380); };
  ear.addEventListener('pointerdown', (e) => { if (busy) return; d = { x: e.clientX, y: e.clientY, moved: false }; try { ear.setPointerCapture(e.pointerId); } catch {} ear.classList.remove('lift'); });
  ear.addEventListener('pointermove', (e) => { if (!d) return; const m = Math.max(d.x - e.clientX, d.y - e.clientY, 0); if (m > 6) d.moved = true; if (!RM()) set(S0 + m * 1.1); });
  const up = () => { if (!d) return; const s = parseFloat(ear.style.getPropertyValue('--s')) || S0, moved = d.moved; d = null;
    if (moved) { skipClick = true; setTimeout(() => { skipClick = false; }, 400); if (s > OPEN) return finish(); ear.classList.add('lift'); set(S0); } };
  ear.addEventListener('pointerup', up); ear.addEventListener('pointercancel', () => { d = null; ear.classList.add('lift'); set(S0); });
  // toque (e Enter/Espaço, que viram click): a orelha levanta e abre. Captura: roda antes do click antigo e o substitui.
  ear.addEventListener('click', (e) => { e.stopImmediatePropagation(); e.preventDefault(); if (skipClick || busy) return;
    if (RM()) return openNow(); ear.classList.add('lift'); set(100); setTimeout(finish, 240); }, true);
  set(S0);
}
