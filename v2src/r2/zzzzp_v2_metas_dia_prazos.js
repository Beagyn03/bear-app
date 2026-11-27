// ---------- v2: meta do dia vem dos prazos dos livros (Bia, 27/11) ----------
// "No lugar dessa meta por dia, não tem que ser o prazo para terminar o livro? Ele que gera a meta diária de páginas.
// Não faz sentido eu definir todo dia uma meta diária manualmente." / "Por que o prazo aparece em todas as metas?"
// Aba Dia: o anel mostra as páginas lidas hoje nos livros com prazo contra a soma do que cada prazo pede para hoje
// (a mesma conta do "Hoje, leia até a pág. X" do Início; dia de folga não pede nada). Embaixo, um livro por linha. Sem
// livro com prazo, convida a dar um prazo. A meta diária manual sai da tela (o valor antigo fica guardado, sem uso).
// "Prazos dos livros" (e as metas antigas com data) aparecem só na aba Dia; Mês e Ano ficam com o que é delas.
{ const st = document.createElement('style'); st.textContent = `.mtn .mpz{display:grid;gap:6px;margin:4px 0 14px}.mtn .mpz .mrow small b{color:var(--acc)}`; TR.append(st); }
{ const _dia = mtnDia; mtnDia = function () {
    let tail = ''; try { const old = _dia.apply(this, arguments); const i = old.indexOf('<div class="orbs">'); tail = i >= 0 ? old.slice(i) : ''; } catch {}
    const t = todayISO(), P = lib().filter((e) => e.status === 'LENDO' && e.dueAt && e.dueAt >= t).map((e) => { let d = null; try { d = dueToday(e); } catch {} return { e, d }; }).filter((x) => x.d);
    let n = 0, v = 0; P.forEach(({ d }) => { if (!d.todayOff) n += Math.max(0, d.target - d.start); v += Math.max(0, Math.min(d.now, d.target) - d.start); });
    const falta = Math.max(0, n - v);
    let h = mtnRing(v, n, 'páginas hoje');
    if (!P.length) h += `<p class="mfr">Dê um prazo para um livro e o app calcula quantas páginas ler por dia</p><button type="button" class="mlink" data-mt="novo">+ Prazo para um livro</button>`;
    else {
      h += `<p class="mfr">${!n ? 'Hoje é folga nos seus prazos' : falta > 0 ? `Faltam <span>${falta} ${falta === 1 ? 'página' : 'páginas'}</span> para os prazos de hoje` : 'Meta de hoje cumprida'}</p>`;
      h += '<div class="mpz">' + P.map(({ e, d }) => { const k = Math.max(0, d.target - d.now);
        const sub = d.todayOff ? 'folga hoje' : d.done ? `feito: pág. ${d.now} de ${d.target}` : `hoje até a <b>pág. ${d.target}</b> · faltam ${k}`;
        return `<button type="button" class="mrow" data-mt="prazo" data-id="${esc(e.id)}">${mtnCv(e)}<span class="t"><b>${esc(e.title)}</b><small>${sub}</small></span>${v4ic('chev', 16)}</button>`; }).join('') + '</div>';
    }
    return h + tail; }; }
{ const _b = mtnBaixo; mtnBaixo = function () { const h = _b.apply(this, arguments); if ((S.mtnTab || 'ano') === 'dia') return h;
    const a = h.indexOf('<div class="msec msec-h"><span>Prazos dos livros</span>'), z = h.indexOf('<div class="msec">Metas concluídas</div>');
    return a >= 0 && z > a ? h.slice(0, a) + h.slice(z) : h; }; }
