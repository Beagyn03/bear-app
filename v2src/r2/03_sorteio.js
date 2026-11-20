// Sorteio animado sem urso (Bia, 17/11): uma carta com o verso estrelado gira e revela a capa sorteada.
{ const st = document.createElement('style'); st.textContent = `
.srt-stage{position:relative;width:min(150px,44vw);aspect-ratio:2/3;margin:.2rem auto .6rem;perspective:700px}
.srt-flip{position:absolute;inset:0;transform-style:preserve-3d;transition:transform .7s cubic-bezier(.3,1.4,.5,1)}
.srt-stage.spin .srt-flip{animation:srtSpin 1.1s ease-in-out}
@keyframes srtSpin{0%{transform:rotateY(0)}100%{transform:rotateY(720deg)}}
.srt-stage.done .srt-flip{transform:rotateY(180deg)}
.srt-back,.srt-card{position:absolute;inset:0;border-radius:10px;overflow:hidden;backface-visibility:hidden;box-shadow:0 8px 22px rgba(0,0,0,.22)}
.srt-back{display:grid;place-items:center;background:radial-gradient(circle at 30% 25%,#3c2a52,#1d1430 70%);color:#f5c04a;font-weight:900;font-size:1.05rem;letter-spacing:.02em}
.srt-back::before{content:"";position:absolute;inset:8px;border:1.5px solid rgba(245,192,74,.55);border-radius:6px}
.srt-back::after{content:"✦  ✧  ✦";position:absolute;bottom:14px;font-size:.7rem;letter-spacing:.2em;opacity:.8}
.srt-card{transform:rotateY(180deg)}
.srt-card .cv{width:100%!important;height:100%!important;border-radius:0!important;font-size:.7rem;background-size:cover!important;background-position:center!important}
.srt-stage ~ .srt-bk .srt-cv{display:none}.srt-stage ~ .srt-bk{justify-content:center;text-align:center}
#editor .srt-wait{opacity:0;transform:translateY(6px);pointer-events:none;transition:opacity .3s,transform .3s}
#editor .srt-show{opacity:1;transform:none;pointer-events:auto}
@media (prefers-reduced-motion:reduce){.srt-flip{transition:none}.srt-stage.spin .srt-flip{animation:none}}
`; TR.append(st); }
{
  const _ss = sortShelf;
  sortShelf = async function (key, lastId) {
    _ss(key, lastId);
    const ed = $('#editor'); if (ed.hidden) return;
    const bk = ed.querySelector('.srt-bk'); if (!bk) return;
    const cov = [...bk.children].find((c) => !c.querySelector('b') && c.tagName !== 'B');
    const stage = document.createElement('div'); stage.className = 'srt-stage';
    const flip = document.createElement('div'); flip.className = 'srt-flip';
    const back = document.createElement('div'); back.className = 'srt-back'; back.textContent = 'Livroverso';
    const card = document.createElement('div'); card.className = 'srt-card'; if (cov) { card.append(cov.cloneNode(true)); bk.querySelectorAll(':scope > :not(div), :scope > .cv, :scope > .srt-cv').forEach((n) => n.remove()); cov.remove(); }
    flip.append(back, card); stage.append(flip); bk.before(stage); try { paintCv(card); } catch {}
    const rest = [...ed.querySelectorAll('.dd > *')].filter((n) => n !== stage && n.tagName !== 'H3');
    const h3 = ed.querySelector('.dd > h3'); const h3t = h3 ? h3.textContent : '';
    const finish = () => { stage.classList.remove('spin'); stage.classList.add('done'); if (h3) h3.textContent = h3t; rest.forEach((n) => n.classList.add('srt-show')); };
    rest.forEach((n) => n.classList.add('srt-wait'));
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return finish();
    if (h3) h3.textContent = 'Sorteando…';
    stage.classList.add('spin');
    const token = (S.srtTok = (S.srtTok || 0) + 1);
    setTimeout(() => { if (S.srtTok === token && !ed.hidden) finish(); }, 1150);
  };
  drawLot = (key) => sortShelf(key);
}
