// Avaliação guardada fora de Lido (Bia, 21/11: Battle Royale em Quero ler aparecia com ★★★★ na grade da Biblioteca).
// A nota só aparece em livro lido (grade, perfil, atividade, estantes, Vocês combinam). Quando o livro sai de Lido, a avaliação
// fica guardada e volta se terminar (G1); em Minha leitura aparece uma linha discreta dizendo isso, com "Apagar".
{ const st = document.createElement('style'); st.textContent = `
.v9guard{display:flex;align-items:center;gap:10px;margin:8px 0;padding:10px 12px;border:1px dashed var(--line);border-radius:14px;color:var(--ink-2);font-size:.86rem;line-height:1.35}
.v9guard span{flex:1;min-width:0}.v9guard button{flex:none;min-height:40px;padding:0 14px;border:1px solid var(--line);border-radius:12px;background:none;color:var(--red,#c0392b);font:inherit;font-weight:800;cursor:pointer}`; TR.append(st); }
{ let tm = 0;
  const has = (e) => { const r = (e && reviewOfLib(e)) || null; return !!(r && (Number(r.paws) > 0 || String(r.texto || r.text || '').trim())); };
  const fix = () => { tm = 0; const v = TR.querySelector('#shelflist'); if (!v || v.hidden) return;
    const t = ((v.querySelector('.bp-ht h2') || v.querySelector('.bp-hero h2') || {}).textContent || '').trim(); if (!t) return;
    let e = null; try { e = lib().find((x) => normT(x.title) === normT(t)); } catch {}
    const old = v.querySelector('.v9guard'), want = !!e && e.status !== 'LIDO' && has(e);
    if (!want) { if (old) old.remove(); return; }
    if (old && old.dataset.id === String(e.id)) return; if (old) old.remove();
    const rate = v.querySelector('.sl-body > .bp-card [data-a=rate]'); const card = rate && rate.closest('.bp-card'); if (!card) return;
    const d = document.createElement('div'); d.className = 'v9guard'; d.dataset.id = String(e.id);
    d.innerHTML = '<span>Você tem uma avaliação guardada · volta se terminar</span><button type="button" data-a="v9guarddel">Apagar</button>';
    card.after(d); };
  new MutationObserver(() => { if (!tm) tm = setTimeout(fix, 80); }).observe(TR, { childList: true, subtree: true });
  TR.addEventListener('click', (ev) => { const p = ev.composedPath ? ev.composedPath() : []; const b = p.find((n) => n && n.dataset && n.dataset.a === 'v9guarddel'); if (!b) return;
    ev.stopPropagation(); ev.preventDefault(); const row = b.closest('.v9guard'); const e = row && lib().find((x) => String(x.id) === row.dataset.id); if (!e) return;
    const go = () => { try { v9DelReview(e); } catch (err) { console.warn('apagar avaliação guardada', err); } try { row.remove(); } catch {} toast('Avaliação apagada'); };
    if (typeof lvDialog === 'function') lvDialog({ title: 'Apagar avaliação guardada?', html: '<p style="margin:.4rem 0 0;line-height:1.45">A nota e o texto deste livro serão apagados.</p>', actions: [{ label: 'Apagar', cls: 'dng', fn: go }, { label: 'Cancelar' }] });
    else go(); }, true); }
