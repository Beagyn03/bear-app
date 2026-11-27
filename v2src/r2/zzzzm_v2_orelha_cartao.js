// ---------- v2: a orelha mora no cartão "Lendo", canto superior direito, escrito "Ler" (Bia, 26/11) ----------
// "A dobra de página pode ficar no card do lendo? No canto superior direito dele. E em vez de mostrar parte da capa,
// mostrar Ler." O #v5ler (orelha) entra dentro do cartão do livro atual (.v3x-a .v3hero) e acompanha a rolagem com ele.
// O triângulo revelado é da cor de destaque com "Ler"; a dobra de papel fica embaixo à esquerda. Tocar ou puxar o canto
// para baixo/esquerda abre a leitura em página inteira (entra pelo mesmo canto). Quando aparece continua igual: só no
// Hoje e sem sessão aberta. Sem cartão na tela (nenhum livro em leitura), a orelha não aparece.
{ const st = document.createElement('style'); st.textContent = `
.v3x-a .v3hero{position:relative}
#v5ler.ear.card{position:absolute!important;top:0!important;right:0!important;left:auto!important;bottom:auto!important;translate:none;z-index:3}
#v5ler.ear.card .eu{clip-path:polygon(0 0,100% 0,100% 100%);background:var(--acc,#b48cff)!important;border-top-right-radius:var(--v3r,22px)}
#v5ler.ear.card .eu::after{background:linear-gradient(225deg,rgba(255,255,255,.18),rgba(0,0,0,0) 55%)}
#v5ler.ear.card .eu b{left:auto;bottom:auto;right:8px;top:7px;font-family:inherit;font-size:13px;font-weight:900;color:var(--on-acc,#1b1426);text-shadow:none;letter-spacing:.02em}
#v5ler.ear.card .ef{clip-path:polygon(0 0,100% 100%,0 100%);background:linear-gradient(45deg,#e9dcc0,#f6eedc 55%,#fffaf0);filter:drop-shadow(-3px 3px 6px rgba(0,0,0,.45))}
#v5ler.ear.card .ef span{display:none}
.v5shade.card{display:none}
`; TR.append(st); }
{ const ear = jnPl_; ear.classList.remove('tl'); ear.classList.add('card');
  try { const sh = TR.querySelector('.v5shade'); if (sh) sh.classList.add('card'); } catch {}
  const place = () => { const hero = TR.querySelector('.v3x-a .v3hero');
    if (hero) { if (ear.parentElement !== hero) hero.append(ear); ear.style.visibility = ''; }
    else { if (ear.parentElement !== TR) TR.append(ear); ear.style.visibility = 'hidden'; } };
  let tm = 0; new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; try { place(); } catch {} }, 80); }).observe(TR, { childList: true, subtree: true });
  setInterval(() => { try { place(); } catch {} }, 1000); setTimeout(place, 300);
}
