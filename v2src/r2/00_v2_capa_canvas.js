// Capa para canvas (Bia, 22/11): o Google Livros não manda CORS, então o canvas não pode ler os pixels dessas capas
// (imagem de compartilhar da retrospectiva/resumo e cor predominante da prateleira). Onde o canvas lê pixels, a capa
// passa pelo proxy da bear-api (/v1/cover-img), que só busca em hosts de capa conhecidos. Na exibição normal das capas
// nada muda: continua a URL direta, para não passar todo o tráfego pela API.
// Versão do cache de cores: subir aqui invalida as cores que tinham caído no fallback (lombada) ou ficado sem cor.
const LV_CORS_OK = /^(data:|blob:)|^https?:\/\/(covers\.openlibrary\.org|[^/]*\.archive\.org|archive\.org)\//i;
function coverCanvasUrl(u) {
  u = String(u || '').trim(); if (!u) return '';
  if (LV_CORS_OK.test(u) || !/^https?:\/\//i.test(u)) return u;
  let api = ''; try { api = String((typeof apiCfg !== 'undefined' && apiCfg && apiCfg.api) || (typeof DEFAULT_API !== 'undefined' ? DEFAULT_API : '')).trim().replace(/\/+$/, ''); } catch {}
  return api ? api + '/v1/cover-img?url=' + encodeURIComponent(u.replace(/^http:\/\//i, 'https://')) : u;
}
window.coverCanvasUrl = coverCanvasUrl;
// cores que caíram no fallback antes do proxy: apaga uma vez para recalcular pela capa real
try { if (localStorage.getItem('lv.ccv') !== '2') {
  const sc = JSON.parse(localStorage.getItem('lv.shsc') || '{}') || {}; Object.keys(sc).forEach((k) => { if (sc[k] === 1) delete sc[k]; }); localStorage.setItem('lv.shsc', JSON.stringify(sc));
  const cc = JSON.parse(localStorage.getItem('lv.cvcol') || '{}') || {}; Object.keys(cc).forEach((k) => { if (cc[k] === 0) delete cc[k]; }); localStorage.setItem('lv.cvcol', JSON.stringify(cc));
  localStorage.setItem('lv.ccv', '2'); } } catch {}
