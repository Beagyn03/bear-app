// Conquistas saíram da v2 (Bia, 19/11): as últimas menções somem (teste 20/11 itens 28 e 42):
// Comunidade › Novidades no feed e Ajustes › O que aparece no meu perfil.
{ const i = FEED_KINDS.findIndex(([k]) => k === 'achievement'); if (i >= 0) FEED_KINDS.splice(i, 1);
  const clean = () => { TR.querySelectorAll('label.ck-row, .dd label, .dd .ck-row').forEach((l) => { if ((l.textContent || '').trim() === 'Conquistas') l.remove(); }); };
  new MutationObserver(clean).observe(TR, { childList: true, subtree: true }); }
// Tour com os rótulos da v2 (teste 20/11 item 45): Hoje, Estante (Livros/Estantes/Trechos), Ler, Comunidade, Você; sem conquistas,
// sem "Minha biblioteca", "Amigos" ou o menu antigo. A busca é a lupa do topo.
TOUR.splice(0, TOUR.length,
  [null, 'Boas-vindas ao Livroverso', 'Um passeio rápido pelo app. Leva menos de um minuto.'],
  ['#tabbar [data-tab=inicio]', 'Hoje', 'O livro que você está lendo, seu prazo, a órbita, a meta e a Pergunta do dia. Use Atualizar no cartão do livro para marcar a página.'],
  ['#tabbar [data-tab=estante]', 'Estante', 'Todos os seus livros em Livros, suas estantes em Estantes e o que você guardou em Trechos. Toque na capa para abrir; segure para o menu.'],
  ['#tabbar [data-tab=ler]', 'Ler', 'Comece uma sessão de leitura com cronômetro, luz e ecos de quem leu a mesma página.'],
  ['#tabbar [data-tab=comunidade]', 'Comunidade', 'Comentários, trechos e avaliações de quem lê, com controle de spoiler, e as leituras conjuntas.'],
  ['#tabbar [data-tab=eu]', 'Você', 'Seu perfil, metas, estatísticas, resumo do mês e ajustes.'],
  ['#g-find', 'Buscar', 'Ache um livro ou um leitor pela lupa.'],
  [null, 'Pronto!', 'Boa leitura!']);
// Menus "•••" no padrão (teste 20/11 itens 27 e 33): cada item com ícone de traço e ação destrutiva na cor de alerta,
// em qualquer menu que ainda chegue só com texto (post, Conversa, perfil de outra pessoa…).
Object.assign(V3EMO, {
  trash: '<path d="M4.5 7h15M9.5 7V4.8h5V7M6.5 7l.9 12.2h9.2L17.5 7M10 10.5v6M14 10.5v6"/>',
  block: '<circle cx="12" cy="12" r="8.5"/><path d="M6 6l12 12"/>',
  mute: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4zM16 9.5l4.5 5M20.5 9.5l-4.5 5"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l2.8-2.8a4 4 0 0 0-5.7-5.7L11.5 6.8M14 10a4 4 0 0 0-5.7 0L5.5 12.8a4 4 0 0 0 5.7 5.7l1.3-1.3"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeoff: '<path d="M3 3l18 18M10.6 6a9.6 9.6 0 0 1 1.4-.1C18 5.9 21.5 12 21.5 12a17 17 0 0 1-3 3.7M6.6 6.7C4 8.4 2.5 12 2.5 12S6 18.5 12 18.5c1.7 0 3.2-.5 4.4-1.2M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  book: '<path d="M12 6.5C10 5 7.5 4.5 4 4.8v13c3.5-.3 6 .2 8 1.7 2-1.5 4.5-2 8-1.7v-13c-3.5-.3-6 .2-8 1.7zM12 6.5v13"/>',
  pen2: '<path d="M4 20l1-4L16 5l3 3L8 19z"/>' });
{ const ICO = [[/^(Apagar|Excluir)/i, 'trash', 1], [/^Bloquear/i, 'block', 1], [/^Denunciar/i, 'alert', 1], [/^(Silenciar|Deixar de silenciar|Tirar silêncio)/i, 'mute'], [/^Ocultar/i, 'eyeoff'],
    [/^Copiar link/i, 'link'], [/^Ver o livro|^Abrir o livro/i, 'book'], [/^Editar/i, 'pen2'], [/^Quem vê|^Visibilidade/i, 'globe'], [/spoiler/i, 'alert'], [/^Responder/i, 'reply'], [/^Compartilhar/i, 'swap'], [/^Salvar/i, 'heart']];
  const _pm = popMenu; popMenu = function (anchor, items) {
    const L = (items || []).map((x) => { if (!x || typeof x !== 'object' || typeof x.label !== 'string' || /<(i|svg)\b/.test(x.label)) return x;
      const m = ICO.find(([re]) => re.test(x.label.trim())); if (!m) return x;
      return { ...x, label: '<i class=v3e data-i=' + m[1] + '></i>' + x.label, danger: x.danger || !!m[2] }; });
    return _pm.call(this, anchor, L); }; }
{ const st = document.createElement('style'); st.textContent = '.pop-it > span{display:inline-flex;align-items:center;gap:.55rem}.pop-it svg{width:18px;height:18px;flex:none;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.pop-it.danger{color:#d4573d!important}'; TR.append(st); }
// Avisos: as abas Notificações/Mensagens ficam na mesma altura nas duas telas (teste 20/11 item 23: pulava 9 px)
{ const st = document.createElement('style'); st.textContent = '#shelflist .sl-body > .av-tabs:first-child,#shelflist .sl-body > .av-tabs{margin-top:12px!important}'; TR.append(st); }
// Comunidade abre na hora (teste 20/11 item 24: "Carregando a Comunidade…" por 3–4 s): o último feed de cada aba fica guardado
// no aparelho (30 posts, por conta) e aparece logo; a resposta nova do servidor substitui sem piscar.
{ const key = (sc) => 'v6c:' + ((socialProfile && socialProfile.handle) || '') + ':' + sc;
  const hydrate = () => { if (!socialProfile || !socialProfile.handle) return; ['rede', 'amigos'].forEach((sc) => { const F = v6Feed(sc); if (F.items.length || F.at) return;
    try { const c = JSON.parse(localStorage.getItem(key(sc)) || 'null'); if (c && Array.isArray(c.items) && c.items.length) { F.items = c.items; F.at = 1; F.more = false; if (sc === 'rede') { S.rd.items = F.items; } } } catch {} }); };
  const _p = v6Paint; v6Paint = function () { try { hydrate(); } catch {} return _p.apply(this, arguments); };
  const _l = v6Load; v6Load = async function (sc, more) { const r = await _l.apply(this, arguments);
    try { const F = v6Feed(sc); if (!more && F.at > 1 && !F.err && socialProfile && socialProfile.handle) localStorage.setItem(key(sc), JSON.stringify({ t: Date.now(), items: F.items.slice(0, 30) })); } catch {}
    return r; }; }
// Buscar capas: avisos curtos, numa linha (teste 20/11 item 44: quebrava em duas linhas e cobria "Ver o tour")
{ const short = (s) => s.replace(/^Procurando capas para (\d+) livros?…$/, 'Buscando $1 capas…').replace(/^(\d+ capas? encontradas?) · \d+ sem capa em português$/, '$1')
    .replace(/^Não encontrei capas em português para esses livros$/, 'Nenhuma capa nova').replace(/^Todos os seus livros já têm capa$/, 'Todos têm capa');
  const fix = () => { const t = TR.querySelector('#toast'); if (!t) return; const n = t.firstChild; if (n && n.nodeType === 3) { const v = short(n.nodeValue || ''); if (v !== n.nodeValue) n.nodeValue = v; } };
  const t0 = TR.querySelector('#toast'); if (t0) new MutationObserver(fix).observe(t0, { childList: true }); }
