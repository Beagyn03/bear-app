// v2 "Resumo do mês" (Bia, 19/11, branch livroverso-2): nos 7 primeiros dias do mês, um cartão no Hoje abre o resumo do mês
// anterior; o resumo também fica no menu lateral (Minha leitura) o mês todo. Livros terminados, páginas, minutos de sessão,
// melhor dia, gênero que mais apareceu e um trecho do mês. "Compartilhar" gera uma imagem (só texto: capas de outros sites
// não podem entrar no desenho da imagem).
const V2MES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
function v2RsMonth(off = 1) { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - off); return { ym: d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'), nome: V2MES[d.getMonth()], ano: d.getFullYear() }; }
function v2RsData(ym) {
  const L = lib(), fin = L.filter((e) => e.status === 'LIDO' && String(e.finishedAt || '').startsWith(ym));
  const byDay = new Map(); let pages = 0;
  L.filter((e) => !e.link).forEach((e) => (e.readLog || []).forEach((l) => { if (String(l.date || '').startsWith(ym)) { const p = Number(l.pages) || 0; pages += p; byDay.set(l.date, (byDay.get(l.date) || 0) + p); } }));
  (db.goals || []).forEach((g) => (g.logs || []).forEach((l) => { if (String(l.date || '').startsWith(ym)) { const p = Number(l.pages) || 0; pages += p; byDay.set(l.date, (byDay.get(l.date) || 0) + p); } }));
  const minutes = (db.focus || []).filter((f) => String(f.date || '').startsWith(ym)).reduce((a, f) => a + (Number(f.minutes) || 0), 0);
  const best = [...byDay.entries()].sort((a, b) => b[1] - a[1])[0] || null;
  const g = new Map(); fin.forEach((e) => { const x = typeof v2Genre === 'function' ? v2Genre(e) : ''; if (x) g.set(x, (g.get(x) || 0) + 1); });
  const genre = [...g.entries()].sort((a, b) => b[1] - a[1])[0];
  let quote = null; L.forEach((e) => (e.quotes || []).forEach((q) => { if (String(q.at || '').startsWith(ym) && q.t && (!quote || q.t.length < quote.t.length)) quote = { t: q.t, b: e.title }; }));
  return { fin, pages, minutes, best, genre: genre ? genre[0] : null, quote, days: byDay.size, any: !!(fin.length || pages || minutes) };
}
{ const st = document.createElement('style'); st.textContent = `
.v3-colA.v2h > .v2rs-card{order:1}
.v2rs-card{display:flex;align-items:center;gap:.8rem;width:100%;text-align:left;margin:0 0 var(--v2-gap);padding:.85rem .95rem;border:0;border-radius:var(--v2-r);background:linear-gradient(135deg,#2a1f4a,#4a3585);color:#fff;font:inherit;box-shadow:var(--v2-sh);cursor:pointer}
.v2rs-card b{display:block;font-family:var(--v2-disp);font-size:1.05rem}.v2rs-card small{display:block;color:#d9cffc;font-size:.76rem;font-weight:700;margin-top:.1rem}.v2rs-card em{margin-left:auto;font-style:normal;font-size:1.2rem;color:#ffd6a3}
.v2rs{padding:.2rem 0 1.5rem}
.v2rs .hero{border-radius:var(--v2-r);padding:1.1rem 1rem;background:linear-gradient(150deg,#2a1f4a,#4a3585 60%,#7e4a8c);color:#fff;box-shadow:var(--v2-sh)}
.v2rs .hero .k{font-size:.68rem;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:#d9cffc}.v2rs .hero h2{margin:.2rem 0 .8rem;font-family:var(--v2-disp);font-size:1.6rem;line-height:1.15}
.v2rs .nums{display:grid;grid-template-columns:repeat(3,1fr);gap:.45rem}.v2rs .nums div{background:rgba(255,255,255,.1);border-radius:14px;padding:.6rem .3rem;text-align:center}.v2rs .nums b{display:block;font-family:var(--v2-disp);font-size:1.45rem}.v2rs .nums small{font-size:.66rem;font-weight:800;color:#e4dcff}
.v2rs .sec{margin:1rem .1rem .45rem;font-family:var(--v2-disp);font-size:1.05rem;font-weight:700;color:var(--ink)}
.v2rs .covers{display:flex;gap:.55rem;overflow-x:auto;padding-bottom:.3rem}.v2rs .covers .v2rs-cv{width:72px;height:108px;border-radius:4px 7px 7px 4px;flex:none;box-shadow:0 6px 14px rgba(40,20,5,.2)}
.v2rs .facts{display:grid;gap:.45rem}.v2rs .facts div{display:flex;justify-content:space-between;gap:.6rem;padding:.7rem .85rem;border:1px solid var(--line);border-radius:var(--v2-r-s);background:var(--panel);font-size:.86rem}.v2rs .facts span{color:var(--ink-2);font-weight:700}.v2rs .facts b{color:var(--ink);text-align:right}
.v2rs blockquote{margin:0;padding:.85rem 1rem;border-left:3px solid var(--acc);border-radius:0 var(--v2-r-s) var(--v2-r-s) 0;background:var(--panel);font-family:var(--v2-disp);font-style:italic;font-size:1rem;line-height:1.4;color:var(--ink)}
.v2rs blockquote small{display:block;margin-top:.35rem;font-family:inherit;font-style:normal;font-size:.74rem;color:var(--ink-2)}
.v2rs .share{display:block;width:100%;margin-top:1.1rem;height:48px;border:0;border-radius:14px;background:var(--acc);color:var(--on-acc,#fff);font:inherit;font-weight:900;font-size:.95rem}
.v2rs .empty{padding:1.2rem;border:1.5px dashed var(--line);border-radius:var(--v2-r);text-align:center;color:var(--ink-2);font-size:.86rem;margin-top:1rem}
`; TR.append(st); }
function v2ResumoOpen(off = 1) {
  const v = $('#shelflist'), M = v2RsMonth(off), d = v2RsData(M.ym), h = Math.floor(d.minutes / 60), mm = d.minutes % 60;
  const draw = () => {
    v.querySelector('.sl-body').innerHTML = `<div class="sl-top"><button type="button" class="sl-back">‹ Voltar</button><b>Resumo do mês</b><span></span></div>
    <div class="v2rs"><section class="hero"><div class="k">Seu ${M.nome} em livros</div><h2>${d.fin.length ? `${d.fin.length} ${d.fin.length === 1 ? 'livro terminado' : 'livros terminados'}` : d.any ? 'Um mês de leitura' : 'Um mês tranquilo'}</h2>
      ${(() => { const t = [d.pages ? [d.pages.toLocaleString('pt-BR'), 'páginas'] : null, d.minutes ? [h ? h + 'h' + (mm ? String(mm).padStart(2, '0') : '') : mm + 'min', 'em sessões'] : null, d.days ? [d.days, d.days === 1 ? 'dia lendo' : 'dias lendo'] : null, d.fin.length ? [d.fin.reduce((x, e) => x + (Number(e.totalPages) || 0), 0).toLocaleString('pt-BR'), 'páginas nos terminados'] : null].filter(Boolean).slice(0, 3); return t.length ? `<div class="nums" style="grid-template-columns:repeat(${t.length},1fr)">${t.map(([b, sm]) => `<div><b>${b}</b><small>${sm}</small></div>`).join('')}</div>` : ''; })()}</section>
    ${d.fin.length ? `<div class="sec">Terminados</div><div class="covers">${d.fin.map((e) => `<button type="button" data-id="${esc(e.id)}" style="border:0;background:none;padding:0">${cvh(e.title, e.cover, 'v2rs-cv')}</button>`).join('')}</div>` : ''}
    ${d.best || d.genre ? `<div class="sec">Destaques</div><div class="facts">${d.best ? `<div><span>Melhor dia</span><b>${esc(d.best[0].slice(8, 10) + '/' + d.best[0].slice(5, 7))} · ${d.best[1]} páginas</b></div>` : ''}${d.genre ? `<div><span>Gênero do mês</span><b>${esc(d.genre)}</b></div>` : ''}</div>` : ''}
    ${d.quote ? `<div class="sec">Um trecho do mês</div><blockquote>“${esc(d.quote.t.slice(0, 280))}”<small>${esc(d.quote.b)}</small></blockquote>` : ''}
    ${d.any ? '<button type="button" class="share">Compartilhar o resumo</button>' : `<p class="empty">Nenhum registro de leitura em ${M.nome}. Quando você atualizar páginas ou fizer sessões de leitura, o resumo aparece aqui.</p>`}</div>`;
    v.querySelector('.sl-back').addEventListener('click', () => { v.hidden = true; });
    $$('.v2rs .covers [data-id]', v).forEach((b) => b.addEventListener('click', () => openBook(b.dataset.id)));
    v.querySelector('.v2rs .share')?.addEventListener('click', () => v2RsShare(M, d));
    paintCv(v);
  };
  S.listRedraw = draw; S.navView = { t: 'resumo', a: [] }; closeEd(); v.classList.remove('feedview', 'tabroot', 'mine-page'); S.v4fromMe = S.tab === 'eu' || S.v4fromMe; draw(); v.hidden = false; v.scrollTop = 0;
}
async function v2RsShare(M, d) {
  const W = 1080, H = 1350, c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
  const gr = x.createLinearGradient(0, 0, W, H); gr.addColorStop(0, '#2a1f4a'); gr.addColorStop(.6, '#4a3585'); gr.addColorStop(1, '#7e4a8c'); x.fillStyle = gr; x.fillRect(0, 0, W, H);
  x.fillStyle = 'rgba(255,255,255,.6)'; for (let i = 0; i < 90; i++) { x.globalAlpha = Math.random() * .6 + .2; x.fillRect(Math.random() * W, Math.random() * H, 3, 3); } x.globalAlpha = 1;
  x.fillStyle = '#d9cffc'; x.font = '900 34px Nunito, sans-serif'; x.fillText(('Meu ' + M.nome + ' em livros').toUpperCase(), 90, 190);
  x.fillStyle = '#fff'; x.font = '700 92px Georgia, serif'; x.fillText(d.fin.length ? `${d.fin.length} ${d.fin.length === 1 ? 'livro' : 'livros'}` : 'Lendo', 90, 320);
  const tile = (i, big, small) => { const tx = 90 + i * 310; x.fillStyle = 'rgba(255,255,255,.12)'; x.beginPath(); x.roundRect(tx, 400, 280, 210, 28); x.fill(); x.fillStyle = '#fff'; x.font = '700 72px Georgia, serif'; x.fillText(big, tx + 30, 505); x.fillStyle = '#e4dcff'; x.font = '800 30px Nunito, sans-serif'; x.fillText(small, tx + 30, 565); };
  tile(0, d.pages.toLocaleString('pt-BR'), 'páginas'); tile(1, d.minutes ? Math.round(d.minutes / 60) + 'h' : '—', 'em sessões'); tile(2, String(d.days), 'dias lendo');
  x.fillStyle = '#fff'; x.font = '700 44px Georgia, serif'; let y = 720; d.fin.slice(0, 6).forEach((e) => { const t = String(e.title); x.fillText('• ' + (t.length > 34 ? t.slice(0, 33) + '…' : t), 90, y); y += 70; });
  if (d.quote) { x.fillStyle = '#ffd6a3'; x.font = 'italic 40px Georgia, serif'; const q = '“' + d.quote.t.slice(0, 90) + (d.quote.t.length > 90 ? '…' : '') + '”'; x.fillText(q.length > 46 ? q.slice(0, 46) : q, 90, Math.max(y + 40, 1130)); if (q.length > 46) x.fillText(q.slice(46), 90, Math.max(y + 95, 1185)); }
  x.fillStyle = '#ffd6a3'; x.font = '700 40px Georgia, serif'; x.fillText('Livroverso', 90, 1280);
  const blob = await new Promise((r) => c.toBlob(r, 'image/png')); if (!blob) return toast('Não consegui gerar a imagem');
  const file = new File([blob], `livroverso-${M.ym}.png`, { type: 'image/png' });
  try { if (navigator.canShare && navigator.canShare({ files: [file] })) return await navigator.share({ files: [file], title: 'Meu mês em livros' }); } catch {}
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = file.name; document.body.append(a); a.click(); a.remove(); toast('Imagem salva');
}
// cartão no Hoje (dias 1 a 7) e item no menu lateral
{ let tm = 0; const put = () => {
    const col = TR.querySelector('.v3-colA.v2h'); let force = false; try { force = !!localStorage.getItem('lv.rsForce'); } catch {}
    if (col && !col.querySelector('.v2rs-card') && (new Date().getDate() <= 7 || force)) { const M = v2RsMonth(1), d = v2RsData(M.ym); if (d.any || force) {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'v2rs-card'; b.innerHTML = `<span><b>Seu ${M.nome} em livros</b><small>${d.fin.length ? d.fin.length + (d.fin.length === 1 ? ' livro terminado' : ' livros terminados') + ' · ' : ''}${d.pages} páginas</small></span><em>›</em>`;
      b.addEventListener('click', () => v2ResumoOpen(1)); const h = col.querySelector(':scope > .v2hero'); if (h) h.after(b); else col.prepend(b); } }
    const drw = TR.querySelector('.drw'); if (drw && drw.dataset.v2 && !drw.querySelector('[data-go2="resumo"]')) { const st = drw.querySelector('[data-go="stats"]'); if (st) {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'drw-it'; b.dataset.go2 = 'resumo';
      b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><image href="img/mn_novidades.webp" x="0" y="0" width="24" height="24"/></svg>Resumo do mês';
      b.addEventListener('click', () => { try { closeDrawer(); } catch {} v2ResumoOpen(1); }); st.after(b); } }
  };
  new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; put(); }, 80); }).observe(TR, { childList: true, subtree: true }); }
