// Lembretes (Bia, 20/11; protótipo v3: Ajustes › Seu app › "Lembretes · prazo e órbita").
// Uma página só para o que o app avisa no celular:
//  1. Prazo de leitura: o lembrete que já existia (57_lembrete_prazo.js, /v1/me/reminder). Vale para um livro por vez, o do Hoje;
//     com mais de um livro com prazo, "Lembrar deste" troca o livro do Hoje e passa o lembrete para ele.
//  2. Órbita (novo): "se eu ainda não li hoje, me lembre às HH:MM". O app manda à API (/v1/me/orbit-reminder) a hora, os dias
//     de folga, a data da última leitura e a sequência; o servidor só avisa se a última leitura não for de hoje.
//  3. Avisos que já existem (presentes e empréstimos), só como informação, com atalho.
//  4. Permissão do aparelho: sem permissão, cartão "Ativar notificações neste aparelho".
{ const st = document.createElement('style'); st.textContent = `
.v4lb{font-size:.68rem;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-2);margin:1.1rem 0 .45rem}
.v4lm{display:grid;gap:.55rem;padding:.75rem 0;border-top:1px solid var(--line)}.v4lm:first-child{border-top:0}
.v4lm .hd{display:grid;grid-template-columns:auto 1fr auto;gap:.65rem;align-items:center}
.v4lm .hd .cv,.v4lm .hd img{width:34px;height:51px;border-radius:3px 5px 5px 3px;object-fit:cover;font-size:0}
.v4lm .hd b{display:block;font-size:.9rem}.v4lm .hd small{display:block;font-size:.74rem;color:var(--ink-2);margin-top:.1rem}
.v4lm .row{display:flex;gap:.5rem;align-items:center;flex-wrap:wrap;font-size:.84rem;font-weight:700;color:var(--ink-2)}
.v4lm select{height:36px;border-radius:10px;border:1.5px solid var(--line);background:var(--bg);color:var(--ink);font:inherit;font-weight:800;padding:0 .45rem}
.v4dw{display:flex;gap:.3rem;flex-wrap:wrap}.v4dw button{min-width:38px;height:32px;border-radius:99px;border:1.5px solid var(--line);background:var(--panel);color:var(--ink-2);font:inherit;font-size:.74rem;font-weight:800;padding:0 .5rem;cursor:pointer}
.v4dw button.off{background:var(--soft,var(--line));color:var(--ink-2);text-decoration:line-through;opacity:.75}
.v4lm .lnk,.v4ok .lnk{border:0;background:none;color:var(--acc);font:inherit;font-size:.8rem;font-weight:800;padding:0;cursor:pointer}
.v4lm .alt{display:grid;grid-template-columns:auto 1fr auto;gap:.6rem;align-items:center;font-size:.84rem}
.v4perm{display:grid;gap:.5rem;border:1px solid var(--acc);border-radius:16px;padding:.8rem;background:color-mix(in srgb,var(--acc) 8%,var(--panel));margin-bottom:.4rem}
.v4perm b{font-size:.92rem}.v4perm small{font-size:.78rem;color:var(--ink-2);line-height:1.4}
.v4perm button{justify-self:start;border:0;border-radius:12px;background:var(--acc);color:var(--on-acc,#fff);font:inherit;font-weight:900;padding:.6rem 1rem;cursor:pointer}
.v4ok{display:grid;grid-template-columns:auto 1fr auto;gap:.6rem;align-items:center;min-height:52px;border-top:1px solid var(--line);font-size:.86rem}.v4ok:first-child{border-top:0}
.v4ok small{display:block;font-size:.74rem;color:var(--ink-2)}
`; TR.append(st); }
const V4DOW = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'], V4DOWN = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const v4hhmm = (h, m) => String(h).padStart(2, '0') + ':' + String(m || 0).padStart(2, '0');
const v4times = () => { const t = []; for (let h = 6; h <= 23; h++) for (const m of [0, 15, 30, 45]) t.push(v4hhmm(h, m)); return t; };
// última leitura (dia com páginas ou sessão) e sequência, do mesmo jeito que a Órbita conta
const v4lastRead = () => { let d = ''; try { for (const x of readingEvents()) if (x.pages > 0 && x.date > d) d = x.date; } catch {} for (const f of db.focus || []) if (f.date && f.date > d) d = f.date; return d || null; };
const v4orb = () => (db.prefs || {}).orbitRem || null;
async function v4orbSync(force) {
  try { if (!connected()) return; const o = v4orb();
    if (!o || !o.on) { if (o && o.sent) { await sapi('DELETE', '/v1/me/orbit-reminder'); delete o.sent; save(); } return; }
    let streak = 0; try { streak = streakNow(); } catch {}
    const body = { hour: o.hour, minute: o.minute || 0, tz: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo', off: (o.off || []).slice(0, 7), lastRead: v4lastRead(), streak };
    const sig = JSON.stringify(body); if (!force && o.sent === sig) return;
    const r = await sapi('PUT', '/v1/me/orbit-reminder', body); if (r && r.status < 300) { o.sent = sig; save(); }
  } catch {}
}
setInterval(() => { try { if (v4Mod('orbita')) v4orbSync(false); } catch {} }, 30000);
setTimeout(() => { try { v4orbSync(false); } catch {} }, 6000);
function openLembretes() {
  const draw = () => {
    const perm = typeof pushOk === 'function' && pushOk() ? Notification.permission : 'none';
    const tsel = (cls, cur) => '<select class="' + cls + '" aria-label="Hora">' + v4times().map((t) => '<option' + (t === cur ? ' selected' : '') + '>' + t + '</option>').join('') + '</select>';
    const days = (cls, off) => '<div class="v4dw ' + cls + '">' + V4DOW.map((d, i) => '<button type="button" data-d="' + i + '" class="' + ((off || []).includes(i) ? 'off' : '') + '" aria-pressed="' + !(off || []).includes(i) + '" aria-label="' + V4DOWN[i] + '">' + d + '</button>').join('') + '</div>';
    let h = '<p class="v4pg-intro">Avisos no celular para não perder o prazo nem a órbita. Nada é avisado em dia de folga.</p>';
    if (perm === 'none') h += '<div class="v4perm"><b>Este navegador não recebe notificações</b><small>No iPhone, instale o Livroverso na tela de início para receber os avisos.</small></div>';
    else if (perm !== 'granted') h += '<div class="v4perm"><b>Ativar notificações neste aparelho</b><small>Sem isso, os lembretes ficam guardados mas não chegam neste celular.</small><button type="button" data-a="perm">Ativar</button></div>';
    // 1. prazo
    const R = (() => { try { return reading(); } catch { return null; } })(), cur = R && R.e;
    const due = lib().filter((e) => e.status === 'LENDO' && e.dueAt);
    h += '<div class="v4lb">Prazo de leitura</div><div class="v4card">';
    if (!due.length) h += '<div class="v4lm"><div class="hd"><span></span><span><b>Nenhum livro com prazo</b><small>Defina um prazo no menu do livro (segure a capa) e o lembrete aparece aqui.</small></span><span></span></div></div>';
    else {
      const main = due.find((e) => e === cur) || null;
      if (main) {
        const on = !!main.remind, t = on ? v4hhmm(main.remind.hour, main.remind.minute) : '20:00', d = String(main.dueAt);
        h += '<div class="v4lm" data-id="' + esc(String(main.id)) + '"><div class="hd">' + cvh(main.title, main.cover, '') + '<span><b>' + esc(main.title) + '</b><small>prazo ' + d.slice(8, 10) + '/' + d.slice(5, 7) + ' · avisa quantas páginas faltam</small></span>'
          + '<button type="button" class="v2fn-tg' + (on ? ' on' : '') + '" data-a="pz-on" role="switch" aria-checked="' + on + '" aria-label="Lembrete do prazo"></button></div>'
          + (on ? '<div class="row">todo dia às ' + tsel('pz-h', t) + '<button type="button" class="lnk" data-a="test">Testar</button></div><div class="row">Dias de leitura</div>' + days('pz-d', main.dueOff) : '') + '</div>';
      }
      due.filter((e) => e !== main).forEach((e) => { const d = String(e.dueAt);
        h += '<div class="v4lm"><div class="alt">' + cvh(e.title, e.cover, '') + '<span><b>' + esc(e.title) + '</b><small>prazo ' + d.slice(8, 10) + '/' + d.slice(5, 7) + (main ? ' · o lembrete vale para um livro por vez' : '') + '</small></span><button type="button" class="lnk" data-a="pz-use" data-id="' + esc(String(e.id)) + '">Lembrar deste</button></div></div>'; });
    }
    h += '</div>';
    // 2. órbita
    if (v4Mod('orbita')) {
      const o = v4orb() || { on: false, hour: 21, minute: 0, off: [] }; let n = 0; try { n = streakNow(); } catch {}
      h += '<div class="v4lb">Órbita</div><div class="v4card"><div class="v4lm"><div class="hd"><span></span><span><b>Se eu ainda não li hoje</b><small>' + (n ? 'sua órbita está em ' + plural(n, 'dia', 'dias') : 'uma página por dia mantém a sequência') + '</small></span>'
        + '<button type="button" class="v2fn-tg' + (o.on ? ' on' : '') + '" data-a="ob-on" role="switch" aria-checked="' + !!o.on + '" aria-label="Lembrete da órbita"></button></div>'
        + (o.on ? '<div class="row">me lembre às ' + tsel('ob-h', v4hhmm(o.hour, o.minute)) + '<button type="button" class="lnk" data-a="test">Testar</button></div><div class="row">Dias</div>' + days('ob-d', o.off) : '') + '</div></div>';
    }
    // 3. avisos que já existem
    const rows = [];
    if (v4Mod('presentes')) rows.push(['gift', 'Presentes', 'uma semana antes do prazo de entrega', 'gifts']);
    if (v4Mod('emprest')) rows.push(['swap', 'Empréstimos', 'no dia combinado para devolver', 'loans']);
    // "Outros avisos" saiu (Bia, 20/11): presentes e empréstimos não são lembretes configuráveis; os avisos continuam funcionando.
    if (false && rows.length) h += '<div class="v4lb">Outros avisos</div><div class="v4card">' + rows.map(([i, t, s, k]) => '<div class="v4ok"><i class=v3e data-i=' + i + '></i><span><b>' + t + '</b><small>' + s + '</small></span><button type="button" class="lnk" data-a="go" data-k="' + k + '">Ver</button></div>').join('') + '</div>';
    const v = v4Page('Lembretes', h, () => openLembretes());
    const L = (sel, fn, ev = 'click') => v.querySelectorAll(sel).forEach((b) => b.addEventListener(ev, (e) => fn(b, e)));
    const ensure = async () => { try { await Promise.race([pushSubscribe(), new Promise((_, no) => setTimeout(() => no(new Error('tempo')), 9000))]); return true; } catch (err) { toast(err.message === 'negado' ? 'Sem permissão para notificar. Libere nas configurações do navegador.' : 'Este aparelho não aceitou notificações'); return false; } };
    L('[data-a=perm]', async () => { if (await ensure()) { toast('Notificações ativadas'); draw(); } });
    const pz = () => due.find((e) => e === cur);
    L('[data-a=pz-on]', async () => { const e = pz(); if (!e) return;
      if (e.remind) { delete e.remind; save(); setTimeout(() => reminderSync(null), 50); return draw(); }
      if (!(await ensure())) return; e.remind = { hour: 20, minute: 0 }; save(); setTimeout(() => reminderSync(e), 50); toast('Lembrete todo dia às 20:00'); draw(); });
    L('.pz-h', (s) => { const e = pz(); if (!e || !e.remind) return; const [hh, mm] = s.value.split(':').map(Number); e.remind = { hour: hh, minute: mm }; save(); setTimeout(() => reminderSync(e), 50); toast('Lembrete às ' + s.value); }, 'change');
    L('.pz-d button', (b) => { const e = pz(); if (!e) return; const i = Number(b.dataset.d), off = new Set(e.dueOff || []); off.has(i) ? off.delete(i) : off.add(i); if (off.size >= 7) return toast('Deixe pelo menos um dia de leitura'); e.dueOff = [...off].sort(); save(); if (e.remind) { delete e.remind.sent; setTimeout(() => reminderSync(e), 50); } draw(); });
    L('[data-a=pz-use]', async (b) => { const e = lib().find((x) => String(x.id) === b.dataset.id); if (!e) return; const old = pz(), hm = old && old.remind ? { hour: old.remind.hour, minute: old.remind.minute || 0 } : { hour: 20, minute: 0 };
      if (!(await ensure())) return; if (old) delete old.remind; try { setCurrent(e.id); } catch {} e.remind = hm; save(); setTimeout(() => reminderSync(e), 300); toast('Agora o lembrete é de ' + e.title); setTimeout(draw, 350); });
    L('[data-a=ob-on]', async () => { const o = v4orb() || { hour: 21, minute: 0, off: [] };
      if (o.on) { o.on = false; db.prefs = { ...(db.prefs || {}), orbitRem: o }; save(); v4orbSync(true); return draw(); }
      if (!(await ensure())) return; o.on = true; db.prefs = { ...(db.prefs || {}), orbitRem: o }; save(); v4orbSync(true); toast('Lembrete da órbita às ' + v4hhmm(o.hour, o.minute)); draw(); });
    L('.ob-h', (s) => { const o = v4orb(); if (!o) return; const [hh, mm] = s.value.split(':').map(Number); o.hour = hh; o.minute = mm; save(); v4orbSync(true); toast('Lembrete da órbita às ' + s.value); }, 'change');
    L('.ob-d button', (b) => { const o = v4orb(); if (!o) return; const i = Number(b.dataset.d), off = new Set(o.off || []); off.has(i) ? off.delete(i) : off.add(i); if (off.size >= 7) return toast('Deixe pelo menos um dia'); o.off = [...off].sort(); save(); v4orbSync(true); draw(); });
    L('[data-a=test]', async () => { try { if (!(await ensure())) return; const reg = await navigator.serviceWorker.ready; await reg.showNotification('Livroverso', { body: 'É assim que o lembrete vai aparecer.', tag: 'bear-teste', icon: 'icon-192.png', badge: 'notif-badge.png' }); toast('Notificação de teste enviada'); } catch { toast('Não deu para testar neste aparelho'); } });
    L('[data-a=go]', (b) => { if (b.dataset.k === 'gifts') { try { openGifts(); } catch {} } else { try { openLoans(); } catch {} } });
  };
  S.listRedraw = draw; draw();
}
// Ajustes › Seu app: "Lembretes · prazo e órbita", logo depois de Funções do app
{ const _da = drawAjustes; drawAjustes = function (box) { const r = _da.apply(this, arguments);
  try { if (S.ajMode === 'perfil' || !box || box.querySelector('#aj-v4lem')) return r;
    const fn = box.querySelector('#aj-fn'); if (!fn) return r;
    const b = document.createElement('button'); b.type = 'button'; b.className = 'aj-row'; b.id = 'aj-v4lem'; b.innerHTML = '<span><b>Lembretes</b><small>prazo e órbita</small></span>›';
    b.addEventListener('click', () => openLembretes()); fn.after(b);
  } catch (err) { console.warn('lembretes', err); }
  return r; }; }
