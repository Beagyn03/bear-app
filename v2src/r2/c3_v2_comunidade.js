// v2 Comunidade (Bia, 19/11, branch livroverso-2): "Desafio da semana" no cartão do post novo, no topo da Rede (um por semana, sempre o mesmo na semana;
// Responder abre o post novo já com o desafio no texto, sem publicar sozinho); curtir/reagir "pula" ao tocar;
// posts e leitura conjunta no cartão novo (cantos, sombra e títulos em serifa do padrão v2).
const V2WK = [
  'Um livro que te fez chorar em lugar público', 'O personagem que você mais queria ter como amizade', 'Uma capa que você comprou só pela beleza',
  'Um livro que você recomenda para todo mundo', 'O final que você não esperava de jeito nenhum', 'Uma leitura que mudou o seu jeito de pensar',
  'O livro mais curto que te marcou', 'Uma série que merece uma adaptação', 'O livro que você leu numa sentada só', 'Um clássico que surpreendeu',
  'A frase de livro que você levaria tatuada', 'O livro que você releria agora', 'Uma autora ou autor que você lê tudo', 'O vilão mais bem escrito',
  'Um livro para ler nas férias', 'O livro que te tirou de uma ressaca literária', 'Uma leitura que você abandonou e voltou', 'O cenário onde você queria morar',
  'Um romance que te deixou sem ar', 'O livro que você daria de presente hoje',
];
function v2Week() { const d = new Date(), t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())), day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day); const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1)); return t.getUTCFullYear() * 100 + Math.ceil(((t - y0) / 864e5 + 1) / 7); }
const v2WkQ = () => V2WK[v2Week() % V2WK.length];
{ const st = document.createElement('style'); st.textContent = `
.v2wk{margin:0 0 .9rem;padding:.9rem .95rem;border-radius:var(--v2-r);background:linear-gradient(135deg,color-mix(in srgb,var(--acc) 14%,var(--panel)),color-mix(in srgb,#7e63c9 14%,var(--panel)));border:1px solid var(--line);box-shadow:var(--v2-sh)}
.v2wk .k{font-size:.66rem;font-weight:900;letter-spacing:.09em;text-transform:uppercase;color:var(--acc)}
.v2wk .q{font-family:var(--v2-disp);font-size:1.18rem;font-weight:700;line-height:1.25;color:var(--ink);margin:.2rem 0 .65rem}
.v2wk .row{display:flex;align-items:center;gap:.6rem}.v2wk .row button{border:0;border-radius:99px;background:var(--acc);color:var(--on-acc,#fff);font:inherit;font-weight:900;font-size:.84rem;padding:.5rem 1rem}
.v2wk .row small{font-size:.74rem;color:var(--ink-2);font-weight:700}
#rd-host .rd-new{border-radius:var(--v2-r)!important;box-shadow:var(--v2-sh)}
#lista .rd-new.v2wk-new{background:linear-gradient(135deg,color-mix(in srgb,var(--acc) 12%,var(--panel)),color-mix(in srgb,#7e63c9 12%,var(--panel)))}
#lista .rd-new em{display:block;font-style:normal;font-size:.62rem;font-weight:900;letter-spacing:.09em;text-transform:uppercase;color:var(--acc);margin-bottom:.1rem}
#rd-host article,#rd-host .rd2{border-radius:var(--v2-r)!important;box-shadow:var(--v2-sh)!important;border:1px solid var(--line)!important}
#rd-host .rd-day,#rd-host h3{font-family:var(--v2-disp)}
#rd-host .rd-like.v2pop,#rd-host [class*=rx].v2pop,.bud-rx.v2pop{animation:v2pop .38s cubic-bezier(.2,.9,.3,1.4)}
@keyframes v2pop{40%{transform:scale(1.35)}100%{transform:scale(1)}}
.bud-prog i,.bud-bar i,.bp-prog i{border-radius:9px}
`; TR.append(st); }
// reação "pula" ao tocar (curtir da Rede, reações do Ler junto)
TR.addEventListener('click', (ev) => { const b = ev.target.closest && ev.target.closest('.rd-like, [data-rx], .rx-b, .bud-rx, [class*="rx-"]'); if (!b || b.closest('.v2wk')) return;
  b.classList.remove('v2pop'); void b.offsetWidth; b.classList.add('v2pop'); }, true);
// Desafio da semana mora no próprio cartão do post novo (19/11): antes eram dois cartões seguidos pedindo para postar.
{ let tm = 0; const put = () => { const nw = TR.querySelector('#lista > .cm-new'); if (!nw || nw.dataset.wk) return; const q = v2WkQ(); nw.dataset.wk = '1'; nw.classList.add('v2wk-new');
    const sp = nw.querySelector('span'); if (sp) sp.innerHTML = `<em>${DEB.nome}</em><b>${esc(q)}</b><small>Responda ou escreva o que quiser</small>`;
    nw.addEventListener('click', (ev) => { ev.stopImmediatePropagation(); openRdComposer({ kind: 'comment', text: `${DEB.nome}: ${q}\n` }); }, true); };
  new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; put(); }, 60); }).observe(TR, { childList: true, subtree: true }); setInterval(put, 600); }
