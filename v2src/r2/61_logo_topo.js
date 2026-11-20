// Logo do Livroverso no topo (Bia, 17/11): onde o título é a marca (#g-t.g-brand), mostra a imagem do logo (clara/escura pelo tema, via --logo).
{ const css = `#g-t.g-brand{display:inline-block;width:132px;height:36px;vertical-align:middle;background:var(--logo) left center/contain no-repeat;color:transparent!important;font-size:0!important;letter-spacing:0!important;overflow:hidden}`;
  const a = document.createElement('style'); a.textContent = css; TR.append(a); const b = document.createElement('style'); b.textContent = css; document.head.append(b); }
