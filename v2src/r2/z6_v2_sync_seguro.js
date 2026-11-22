// As três escolhas da sincronização (dados sem dono no aparelho, conflito entre aparelhos, primeira conexão com dados nos dois
// lados) usavam a janela do navegador: dispensar a janela respondia "Cancelar" e apagava ou sobrescrevia dados (Bia, 22/11).
// Agora viram uma folha do app. Fechar, Esc, voltar ou sair da tela não apaga nada: a sincronização só espera.
// Qualquer opção que descarta uma versão guarda essa versão neste aparelho por 30 dias (IndexedDB) e oferece Desfazer.
// Como pull()/push() chamam confirm() no meio do caminho, a pergunta interrompe a sincronização (sem mexer em nada)
// e, com a resposta, a sincronização roda de novo e recebe a escolha.
{
  const KINDS = [
    { k: 'own', re: /^Este aparelho já tem metas salvas/ },
    { k: 'conf', re: /^Outro aparelho salvou mudanças/ },
    { k: 'first', re: /^Já existem dados na nuvem/ },
  ];
  const ans = {}; let asking = null, snoozed = false;
  // cópia de segurança local (30 dias)
  const DB_NAME = 'lv-backup', DAYS = 30;
  const idb = () => new Promise((res, rej) => { const r = indexedDB.open(DB_NAME, 1); r.onupgradeneeded = () => r.result.createObjectStore('b', { keyPath: 'id' }); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
  const tx = async (mode, fn) => { const d = await idb(); return new Promise((res, rej) => { const t = d.transaction('b', mode), s = t.objectStore('b'), out = fn(s); t.oncomplete = () => res(out && out.result !== undefined ? out.result : out); t.onerror = () => rej(t.error); }); };
  const backup = async (kind, data) => { const id = kind + '-' + Date.now(); try { await tx('readwrite', (s) => s.put({ id, kind, at: Date.now(), data: JSON.parse(JSON.stringify(data)) })); return id; } catch (e) { console.warn('cópia de segurança', e); return null; } };
  const getB = (id) => tx('readonly', (s) => s.get(id));
  const prune = async () => { try { const lim = Date.now() - DAYS * 864e5; const all = await tx('readonly', (s) => s.getAll()); await tx('readwrite', (s) => all.filter((x) => x.at < lim).forEach((x) => s.delete(x.id))); } catch {} };
  setTimeout(prune, 8000);
  window.lvBackups = { list: () => tx('readonly', (s) => s.getAll()).then((a) => a.map(({ id, kind, at }) => ({ id, kind, at: new Date(at).toISOString() }))), restore: (id) => restoreFrom(id) };
  const restoreFrom = async (id) => {
    const b = id && await getB(id).catch(() => null); if (!b || !b.data) { toast('Não achei a cópia de segurança'); return false; }
    applyingRemote = true; db = JSON.parse(JSON.stringify(b.data)); save(); applyingRemote = false;
    localOwnerKnown = true; syncSoon(); try { renderGoals(); } catch {} try { refresh(); } catch {} return true; };
  const undoToast = (msg, id) => setTimeout(() => { try { toast(msg, id ? { label: 'Desfazer', fn: async () => { if (await restoreFrom(id)) toast('Desfeito'); } } : undefined); } catch {} }, 400);
  const resync = () => setTimeout(() => { try { pull(); } catch {} }, 0);
  const remoteNow = async () => { try { const r = await apiCall('GET', '/v1/state'); return r.status === 200 && r.data ? r.data.data : null; } catch { return null; } };

  const open = (kind, msg) => {
    const when = (String(msg).match(/\(salv[oa]s? em ([^)]+)\)/) || String(msg).match(/mudanças \(([^)]+)\)/) || [])[1] || '';
    const T = {
      own: { h: 'Já existem dados neste aparelho', p: 'Eles não estão ligados a nenhuma conta. Você pode levá-los para a sua conta ou apagá-los deste aparelho.\nSe fechar, nada é apagado: o app pergunta de novo da próxima vez.',
        a: [['lev', 'Levar para minha conta', 'ok'], ['apg', 'Apagar deste aparelho', 'dng']] },
      conf: { h: 'Mudanças em dois aparelhos', p: `Outro aparelho salvou mudanças${when ? ' em ' + when : ''}, e este tem mudanças que ainda não foram enviadas. Escolha qual versão fica.\nA outra fica guardada neste aparelho por 30 dias, e dá para desfazer.`,
        a: [['meu', 'Manter as deste aparelho', 'ok'], ['out', 'Usar as do outro aparelho', '']] },
      first: { h: 'Você já tem dados na nuvem', p: `A sua conta tem dados salvos${when ? ' em ' + when : ''}, e este aparelho também tem dados. Escolha qual versão fica.\nA outra fica guardada neste aparelho por 30 dias, e dá para desfazer.`,
        a: [['out', 'Usar os da nuvem', 'ok'], ['meu', 'Usar os deste aparelho', '']] },
    }[kind];
    const prev = TR.activeElement || document.activeElement, d = document.createElement('div'); d.className = 'v10dlg v11sync'; d.dataset.kind = kind;
    d.innerHTML = `<div class="bx" role="alertdialog" aria-modal="true" aria-labelledby="v11t" aria-describedby="v11b"><h3 id="v11t"></h3><p id="v11b"></p><div class="bt v11bt"></div><button type="button" class="v11no">Agora não</button></div>`;
    d.querySelector('h3').textContent = T.h; d.querySelector('p').textContent = T.p;
    const bt = d.querySelector('.v11bt');
    T.a.forEach(([v, lab, cls]) => { const b = document.createElement('button'); b.type = 'button'; b.dataset.v = v; b.textContent = lab; if (cls) b.className = cls; bt.append(b); });
    asking = d;
    const close = () => { d.remove(); asking = null; try { prev && prev.focus && prev.focus(); } catch {} };
    const later = () => { close(); snoozed = true; try { setSync('Sem sincronizar'); } catch {} };
    d.addEventListener('click', (ev) => { if (ev.target === d) later(); });
    d.querySelector('.v11no').addEventListener('click', (ev) => { ev.stopPropagation(); later(); });
    d.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') { ev.stopPropagation(); later(); }
      if (ev.key === 'Tab') { const f = [...d.querySelectorAll('button')]; const i = f.indexOf(TR.activeElement || document.activeElement); if (ev.shiftKey && i <= 0) { ev.preventDefault(); f[f.length - 1].focus(); } else if (!ev.shiftKey && i === f.length - 1) { ev.preventDefault(); f[0].focus(); } } });
    bt.addEventListener('click', async (ev) => {
      const b = ev.target.closest('button[data-v]'); if (!b) return; ev.stopPropagation();
      if (b.dataset.v === 'apg' && !b.dataset.sure) { b.dataset.sure = '1'; b.textContent = 'Toque de novo para apagar'; return; }
      [...d.querySelectorAll('button')].forEach((x) => { x.disabled = true; });
      const v = b.dataset.v; let id = null, msg = '';
      if (kind === 'own') {
        if (v === 'apg') { id = await backup('aparelho', db); ans.own = false; msg = 'Dados apagados deste aparelho'; }
        else { ans.own = true; msg = 'Dados levados para a sua conta'; }
      } else if (v === 'out') { id = await backup('aparelho', db); ans[kind] = kind === 'conf'; msg = kind === 'conf' ? 'Agora com as mudanças do outro aparelho' : 'Agora com os dados da nuvem';
        if (kind === 'first') ans.first = true; }
      else { const r = await remoteNow(); if (r) id = await backup('nuvem', r); ans[kind] = false; msg = 'Mantidos os dados deste aparelho'; }
      close(); resync(); undoToast(msg, id);
    });
    TR.append(d); setTimeout(() => { const f = d.querySelector('.ok'); f && f.focus(); }, 30);
  };
  const st = document.createElement('style'); st.textContent = `
.v11sync .v11bt{display:grid;gap:8px;justify-content:stretch}.v11sync .v11bt button{width:100%}
.v11sync .v11bt .dng{color:var(--danger,#d0574a);border-color:currentColor}.v11sync .v11bt .ok{background:var(--acc,#c76b2a);border-color:transparent;color:#fff}
.v11sync .v11no{justify-self:center;min-height:44px;padding:0 18px;border:0;background:none;color:var(--ink-2,#666);font:inherit;font-weight:800;cursor:pointer}`; TR.append(st);

  const prevC = window.confirm;
  window.confirm = function (msg) {
    const m = String(msg == null ? '' : msg), K = KINDS.find((x) => x.re.test(m));
    if (!K) return prevC.apply(this, arguments);
    if (K.k in ans) { const v = ans[K.k]; delete ans[K.k]; return v; }
    if (asking && !asking.isConnected) { asking = null; snoozed = true; } // a folha foi fechada por fora (sair da tela): vale como "Agora não"
    if (!asking && !snoozed) open(K.k, m);
    setTimeout(() => { try { setSync(snoozed ? 'Sem sincronizar' : 'Aguardando sua escolha'); } catch {} }, 0);
    // interrompe a sincronização antes de qualquer mudança; a resposta faz ela rodar de novo
    throw new Error('lv-sync-ask');
  };
  // na próxima abertura do app, volta a perguntar
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') snoozed = false; });
}
