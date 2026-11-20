// Perfil ao carregar (Bia, 20/11): recarregando o app na aba Você aparecia por um instante a tela antiga "Editar perfil ·
// Sem @usuário ainda". Causa: qualquer falha ao buscar o perfil (rede, limite da API) virava "não tem @usuário".
// Agora só a resposta 404 da API quer dizer "ainda não criou o @usuário"; falha mantém o perfil como "carregando", tenta
// de novo e, se não der, mostra "Não consegui abrir seu perfil" com "Tentar de novo". Editar perfil só abre quando a pessoa pede.
{ const st = document.createElement('style'); st.textContent = `
.v3pfwait{position:fixed;left:0;right:0;top:56px;bottom:64px;z-index:40;background:var(--bg);display:grid;place-content:center;justify-items:center;gap:.6rem;text-align:center;padding:2rem 1rem;color:var(--ink-2);font-weight:800}
.v3pfwait .sp{width:28px;height:28px;border-radius:50%;border:3px solid var(--line);border-top-color:var(--acc);animation:v3spin .8s linear infinite}
@keyframes v3spin{to{transform:rotate(360deg)}}
.v3pfwait button{border:0;border-radius:14px;background:var(--acc);color:var(--on-acc,#fff);font:inherit;font-weight:900;padding:.65rem 1.1rem}
`; TR.append(st); }
loadProfile = async function () {
  try {
    const r = await sapi('GET', '/v1/me/profile');
    if (r.status === 200 && r.data && r.data.handle) { socialProfile = r.data; SOC.semHandle = false; }
    else if (r.status === 404) { socialProfile = null; SOC.semHandle = true; }
    else if (!socialProfile) socialProfile = undefined; // falha: continua "carregando"
  } catch { if (!socialProfile) socialProfile = undefined; }
  try { renderProfile(); } catch {}
  return socialProfile;
};
{ let tk = 0; const _gt = goTab; goTab = function (tab, fromBar) {
    const my = ++tk;
    if (tab === 'eu' && connected() && socialProfile === undefined) {
      try { markEu(); } catch {}
      let box = TR.querySelector('.v3pfwait'); if (!box) { box = document.createElement('div'); box.className = 'v3pfwait'; TR.append(box); }
      const wait = (msg, err) => { box.innerHTML = '' + (err ? '' : '<span class="sp"></span>') + '<span>' + msg + '</span>' + (err ? '<button type="button" id="v3pf-retry">Tentar de novo</button>' : '')  ;
        const b = box.querySelector('#v3pf-retry'); if (b) b.addEventListener('click', () => goTab('eu', fromBar)); };
      wait('Abrindo seu perfil…');
      (async () => {
        for (let i = 0; i < 3 && socialProfile === undefined; i++) { await loadProfile(); if (socialProfile === undefined) await new Promise((r) => setTimeout(r, 1200 * (i + 1))); }
        if (my !== tk) return;
        if (socialProfile !== undefined) { box.remove(); return _gt.call(this, tab, fromBar); }
        wait('Não consegui abrir seu perfil agora.', true);
      })();
      return;
    }
    TR.querySelector('.v3pfwait')?.remove();
    return _gt.apply(this, arguments);
  }; }
// recarregar parado em Ajustes/Editar perfil volta para o perfil (o modo da tela não é guardado e caía em "Editar perfil")
if (S.tab === 'perfil' && connected()) setTimeout(() => goTab('eu'), 0);

// Recarregar com o perfil aberto: restoreNav chama openMyProfile direto, que sem perfil carregado caía em Editar perfil.
// Enquanto o perfil não chegou, vai pelo caminho da aba Você (espera com "Abrindo seu perfil…").
{ const _om = openMyProfile; openMyProfile = function () { if (connected() && socialProfile === undefined) return goTab('eu'); return _om.apply(this, arguments); }; }
