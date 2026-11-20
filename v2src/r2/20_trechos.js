// Meus trechos (rodada 2): adicionar, editar, apagar, copiar, ver o livro e usar como frase do perfil.
{ const st = document.createElement('style'); st.textContent = `
.qt-bar{display:grid;grid-template-columns:1fr auto;gap:.5rem;align-items:center;margin-bottom:.6rem}
.qt-bar .qt-search{margin:0}
.qt-new{height:44px;border:0;border-radius:12px;background:var(--acc);color:var(--on-acc,#fff);font:inherit;font-weight:800;font-size:.86rem;padding:0 .9rem;white-space:nowrap}
.qt-it{position:relative}.qt-it .qt-bio{display:inline-block;margin-left:.4rem;font-size:.66rem;font-weight:900;letter-spacing:.04em;text-transform:uppercase;color:var(--acc)}
.qt-form{display:grid;gap:.5rem}.qt-form label{font-size:.78rem;font-weight:800;color:var(--ink-2)}
.qt-form textarea,.qt-form select,.qt-form input{width:100%;box-sizing:border-box;border:1px solid var(--line);border-radius:12px;background:var(--panel);color:var(--ink);font:inherit;font-size:.92rem;padding:.6rem .7rem}
.qt-form textarea{min-height:6rem;resize:vertical}
.qt-form .qt-btns{display:grid;grid-template-columns:auto 1fr;gap:.5rem;margin-top:.3rem}.qt-form .qt-btns button{height:44px;border-radius:12px;font:inherit;font-weight:800;border:1px solid var(--line);background:var(--panel);color:var(--ink);padding:0 1rem}.qt-form .qt-btns .ok{background:var(--acc);border-color:var(--acc);color:var(--on-acc,#fff)}
.qt-form .cnt{font-size:.72rem;color:var(--ink-2);text-align:right;margin-top:-.3rem}
.qt-feels{display:flex;flex-wrap:wrap;gap:.35rem}
.qt-fe{display:inline-flex;align-items:center;gap:.3rem;height:34px;padding:0 .7rem 0 .45rem;border-radius:99px;border:1px solid var(--line);background:var(--panel);color:var(--ink);font:inherit;font-size:.8rem;font-weight:800}
.qt-fe:not(:has(img)){padding-left:.7rem}.qt-fe img{width:24px;height:24px;object-fit:contain}
.qt-fe.on{background:color-mix(in srgb,var(--acc) 16%,var(--panel));border-color:var(--acc)}
.qt-it .qt-fl{display:flex;flex-wrap:wrap;gap:.3rem;margin-top:.15rem}
.qt-it .qt-fl span{display:inline-flex;align-items:center;gap:.2rem;font-size:.68rem;font-weight:800;padding:.1rem .5rem .1rem .3rem;border-radius:99px;background:color-mix(in srgb,var(--acc) 12%,transparent);color:var(--ink)}
.qt-it .qt-fl span:not(:has(img)){padding-left:.5rem}.qt-it .qt-fl img{width:18px;height:18px;object-fit:contain}
.qt-ff{display:flex;gap:.35rem;overflow-x:auto;scrollbar-width:none;margin:-.2rem 0 .6rem;padding-bottom:2px}.qt-ff::-webkit-scrollbar{display:none}.qt-ff[hidden]{display:none}
.qt-ff .qt-fe{flex:none;height:30px;font-size:.74rem}
`; TR.append(st); }
// sentimentos do trecho: o que a pessoa sentiu ao ler (os 4 primeiros usam os ursinhos das reações)
// Lista única de emoções (Bia, 20/11; a mesma do protótipo em Atualizar, Terminei, sessão, trechos, posts e Top 3).
// Chaves antigas que coincidem foram mantidas (naoparo, tensao, euforia...). As outras antigas continuam nos dados salvos e
// contam pela tabela EMO_OLD (null = não é emoção, fica fora do ranking).
const QT_GROUPS = [['Principais', [['naoparo', 'Me prendeu'], ['tensao', 'Tensão'], ['reviravolta', 'Reviravolta'], ['chorei', 'Chorei'], ['ri', 'Ri alto'], ['arrastado', 'Arrastado']]],
  ['Mais', [['apaixonei', 'Me apaixonei'], ['emocionei', 'Me emocionei'], ['surpreendente', 'Surpreendente'], ['encanto', 'Encanto'], ['euforia', 'Euforia'], ['ansiedade', 'Ansiedade'], ['medo', 'Medo'], ['angustia', 'Angústia'], ['arrepio', 'Arrepio'], ['confusao', 'Confusão'], ['doeu', 'Doeu'], ['raiva', 'Raiva'], ['identifiquei', 'Me identifiquei'], ['tedio', 'Tédio'], ['cringe', 'Vergonha alheia'], ['ressaca', 'Ressaca'], ['frustracao', 'Frustração'], ['nojo', 'Nojo']]]];
const QT_PICK = QT_GROUPS.flatMap((g) => g[1]); // o que se escolhe hoje
const EMO_OLD = { alegria: 'euforia', paixao: 'apaixonei', excitacao: 'euforia', borboletas: 'apaixonei', shippando: 'apaixonei', rindo: 'ri', conforto: null,
  curiosidade: 'naoparo', intensidade: 'tensao', arrepios: 'arrepio', plot_surpresa: 'surpreendente', plot_previsivel: 'tedio', plot_fraco: 'tedio',
  coracao_partido: 'doeu', chorei_litros: 'chorei', raiva_personagem: 'raiva',
  amei: 'apaixonei', choque: 'surpreendente', arrepiei: 'arrepio', pensando: 'emocionei', inspirou: null, saudade: 'doeu',
  // rótulos antigos da sessão de leitura (db.focus[].feel) e da primeira versão da lista única
  '😱 Chocante': 'surpreendente', '🥹 Emocionante': 'emocionei', '😍 Apaixonante': 'apaixonei', '😴 Arrastado': 'arrastado', '🤯 Reviravolta': 'reviravolta', '😌 Tranquilo': null };
// qualquer valor salvo (chave nova, chave antiga, rótulo) → chave da lista única, ou null
const emoKey = (k) => { if (k == null) return null; if (QT_PICK.some((y) => y[0] === k)) return k; if (k in EMO_OLD) return EMO_OLD[k]; const byLabel = QT_PICK.find((y) => y[1] === k); return byLabel ? byLabel[0] : null; };
// para mostrar: chaves antigas aparecem com o nome novo
const QT_FEELS = [...QT_PICK, ...Object.keys(EMO_OLD).filter((k) => EMO_OLD[k]).map((k) => [k, QT_PICK.find((y) => y[0] === EMO_OLD[k])[1]])];
const qtFeel = (k, cls = '', on = false) => { const x = QT_FEELS.find((y) => y[0] === k); if (!x) return ''; const im = ''; return cls ? `<button type="button" class="${cls}${on ? ' on' : ''}" data-fe="${k}" aria-pressed="${on}">${im}${x[1]}</button>` : `<span>${im}${x[1]}</span>`; };
{
  const bioOf = (x) => { const tail = ` — ${x.e.title}`, room = 160 - tail.length - 2; const t = x.t.length > room ? x.t.slice(0, Math.max(10, room - 1)).trim() + '…' : x.t; return `“${t}”${tail}`.slice(0, 160); };
  const setBio = async (bio) => { T().bio = bio; save(); refresh(); if (connected() && socialProfile) { const r = await sapi('PUT', '/v1/me/bio', { bio }); toast(r.status === 200 ? 'Agora é a frase do seu perfil' : 'Frase salva só neste aparelho por enquanto'); } else toast('Agora é a frase do seu perfil'); };
  // folha de criar/editar: x = { e, i } para editar; sem x = novo
  const form = (x, after) => {
    const ed = $('#editor'); ed.classList.add('compact');
    const books = lib().filter((e) => e.status !== 'QUERO').sort((a, b) => (a.status === 'LENDO' ? -1 : 0) - (b.status === 'LENDO' ? -1 : 0) || String(a.title).localeCompare(String(b.title), 'pt-BR'));
    if (!x && !books.length) return toast('Adicione um livro primeiro');
    const q = x ? x.e.quotes[x.i] : null;
    ed.querySelector('.ed-body').innerHTML = `<div class="dd qt-form"><h3>${x ? 'Editar trecho' : 'Novo trecho'}</h3>
      ${x ? `<p style="margin:0;font-size:.82rem">${esc(x.e.title)}</p>` : `<label for="qf-b">Livro</label><select id="qf-b">${books.map((e) => `<option value="${esc(e.id)}">${esc(e.title)}${e.status === 'LENDO' ? ' (lendo)' : ''}</option>`).join('')}</select>`}
      <label for="qf-t">Trecho</label><textarea id="qf-t" maxlength="1000" placeholder="Copie a frase do jeito que está no livro">${esc(q ? q.t : '')}</textarea><span class="cnt" id="qf-c"></span>
      <label>O que você sentiu? <small style="font-weight:600">(até 3)</small></label><div class="qt-feels" id="qf-f">${QT_PICK.map((y) => qtFeel(y[0], 'qt-fe', !!(q && (q.f || []).includes(y[0])))).join('')}</div>
      <label for="qf-p">Página (opcional)</label><input id="qf-p" type="number" min="1" inputmode="numeric" value="${q && q.p ? esc(q.p) : ''}">
      <div class="qt-btns"><button type="button" id="qf-x">Cancelar</button><button type="button" class="ok" id="qf-ok">Salvar</button></div></div>`;
    const feels = [...((q && q.f) || [])];
    $$('#qf-f .qt-fe', ed).forEach((b) => b.addEventListener('click', () => { const k = b.dataset.fe, i = feels.indexOf(k); if (i >= 0) feels.splice(i, 1); else { if (feels.length >= 3) return toast('Escolha até 3'); feels.push(k); } b.classList.toggle('on', feels.includes(k)); b.setAttribute('aria-pressed', String(feels.includes(k))); }));
    const t = $('#qf-t', ed), c = $('#qf-c', ed), cnt = () => { c.textContent = `${t.value.length}/1000`; }; cnt(); t.addEventListener('input', cnt);
    $('#qf-x', ed).addEventListener('click', closeEd);
    $('#qf-ok', ed).addEventListener('click', () => {
      const txt = t.value.trim(); if (!txt) return toast('Escreva o trecho'); const p = Number($('#qf-p', ed).value) || null;
      if (x) { x.e.quotes[x.i] = { ...x.e.quotes[x.i], t: txt, p, f: feels.length ? feels : undefined }; }
      else { const e = byId($('#qf-b', ed).value); if (!e) return; e.quotes = [...(e.quotes || []), { t: txt, p, ...(feels.length ? { f: feels } : {}), at: new Date().toISOString() }]; }
      save(); closeEd(); toast(x ? 'Trecho atualizado' : 'Trecho salvo'); after && after();
    });
    ed.hidden = false; setTimeout(() => t.focus(), 50);
  };
  openAllQuotes = function () {
    const v = $('#shelflist'); let q = '', fe = '';
    const all = () => lib().flatMap((e) => (e.quotes || []).map((x, i) => ({ e, i, t: x.t, p: x.p, f: x.f || [], at: x.at || '' }))).sort((a, b) => String(b.at).localeCompare(String(a.at)));
    const ff = () => { const box = $('#qt-ff', v); if (!box) return; const used = new Set(all().flatMap((x) => x.f)); if (fe && !used.has(fe)) fe = '';
      box.hidden = !used.size; box.innerHTML = QT_FEELS.filter((y) => used.has(y[0])).map((y) => qtFeel(y[0], 'qt-fe', fe === y[0])).join('');
      $$('.qt-fe', box).forEach((b) => b.addEventListener('click', () => { fe = fe === b.dataset.fe ? '' : b.dataset.fe; drawList(); })); };
    const drawList = () => {
      ff();
      const n = normT(q), bio = (T().bio || '').trim(), list = all().filter((x) => !fe || x.f.includes(fe)).filter((x) => !n || normT(x.t).includes(n) || normT(x.e.title).includes(n) || normT(x.e.author || '').includes(n));
      const grp = []; list.forEach((x, k) => { let g = grp.find((y) => y.e === x.e); if (!g) { g = { e: x.e, its: [] }; grp.push(g); } g.its.push({ x, k }); });
      v.querySelector('.qt-list').innerHTML = list.length ? grp.map((g) => `<div class="qt-g"><button type="button" class="qt-gh" data-book="${esc(g.e.id)}">${cvh(g.e.title, g.e.cover, '')}<span><b>${esc(g.e.title)}</b><small>${esc(g.e.author || '')}${g.e.author ? ' · ' : ''}${g.its.length} ${g.its.length > 1 ? 'trechos' : 'trecho'}</small></span></button>${g.its.map(({ x, k }) => `<button type="button" class="qt-it qt-in" data-k="${k}" data-bid="${esc(x.e.id)}" data-qi="${x.i}"><q>${esc(x.t)}</q><small>❝ ${x.p ? `pág. ${x.p}` : 'sem página'}${x.at ? ` · ${String(x.at).slice(8, 10)}/${String(x.at).slice(5, 7)}${String(x.at).slice(0, 4) !== todayISO().slice(0, 4) ? '/' + String(x.at).slice(0, 4) : ''}` : ''}${bio && bio === bioOf(x) ? '<span class="qt-bio">frase do perfil</span>' : ''}</small>${x.f.length ? `<span class="qt-fl">${x.f.map((kk) => qtFeel(kk)).join('')}</span>` : ''}</button>`).join('')}</div>`).join('')
        : `<p class="sl-empty">${all().length ? (fe ? 'Nenhum trecho com esse sentimento.' : 'Nenhum trecho com esse texto.') : 'Toque em “+ Novo” para guardar uma frase de um livro. Também dá para salvar pelo menu do livro (Trechos e anotação).'}</p>`;
      try { paintCv(v.querySelector('.qt-list')); } catch {}
      $$('.qt-gh', v).forEach((b) => b.addEventListener('click', () => { const e = byId(b.dataset.book); if (e) openBookPage(e); }));
      $$('.qt-it', v).forEach((b) => b.addEventListener('click', () => {
        if (S.qnSelOn) return;
        const x = list[Number(b.dataset.k)]; if (!x) return; const isBio = bio && bio === bioOf(x);
        popMenu(b, [
          { label: 'Editar', fn: () => form(x, drawList) },
          { label: isBio ? 'Tirar da frase do perfil' : 'Usar na frase do perfil', sub: isBio ? 'volta para a frase automática' : 'até 160 letras, com o nome do livro', fn: () => setBio(isBio ? '' : bioOf(x)).then(drawList) },
          { label: 'Copiar', fn: async () => { try { await navigator.clipboard.writeText(`“${x.t}” — ${x.e.title}${x.e.author ? `, ${x.e.author}` : ''}`); toast('Trecho copiado'); } catch { toast('Não consegui copiar'); } } },
          { label: 'Ver o livro', fn: () => openBookPage(x.e, 'trechos') },
          0,
          { label: 'Apagar trecho', danger: true, fn: () => sheetList('Apagar este trecho?', [{ label: 'Apagar', danger: true, fn: () => { x.e.quotes.splice(x.i, 1); save(); toast('Trecho apagado'); drawList(); } }]) },
        ]);
      }));
    };
    const draw = () => {
      v.querySelector('.sl-body').innerHTML = `<div class="sl-top"><button type="button" class="sl-back">‹ Voltar</button><b>Meus trechos</b><span></span></div>
        <div class="qt-bar"><input type="search" class="fs-input qt-search" id="qt-q" placeholder="Buscar por texto, livro ou autor" value="${esc(q)}" autocomplete="off"><button type="button" class="qt-new" id="qt-new">+ Novo</button></div><div class="qt-ff" id="qt-ff" hidden></div><div class="qt-list"></div>`;
      v.querySelector('.sl-back').addEventListener('click', () => { v.hidden = true; });
      $('#qt-q', v).addEventListener('input', (ev) => { q = ev.target.value; drawList(); });
      $('#qt-new', v).addEventListener('click', () => form(null, drawList));
      drawList(); syncTopTitle();
    };
    S.listRedraw = draw; closeEd(); v.classList.remove('feedview', 'tabroot'); draw(); v.hidden = false; v.scrollTop = 0;
  };
}
