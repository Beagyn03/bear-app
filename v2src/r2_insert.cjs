// Insere (ou reinsere) os blocos de r2/*.js antes do drawAll final do index.html, entre marcadores.
const fs = require('fs'), path = require('path'); // rodar com: node v2src/r2_insert.cjs (a partir da raiz do bear-app)
const root = path.join(__dirname, '..'), file = path.join(root, 'index.html');
let s = fs.readFileSync(file, 'utf8');
const B = '// ==== 4.4 rodada 2 (início) ====', E = '// ==== 4.4 rodada 2 (fim) ====';
const i = s.indexOf(B); if (i >= 0) { const j = s.indexOf(E, i); s = s.slice(0, i) + s.slice(j + E.length + 1); }
const dir = path.join(__dirname, 'r2');
// blocos *_v2_* entram na versão nova: livroverso-2, suas worktrees e, desde 26/11/2026, a main (v2 em produção)
const branch = require('child_process').execSync('git branch --show-current', { cwd: root }).toString().trim();
const parts = fs.readdirSync(dir).filter((f) => f.endsWith('.js') && (branch === 'livroverso-2' || branch === 'main' || branch === 'lv2-a' || branch === 'lv2-foco' || !/_v2_/.test(f))).sort().map((f) => `// --- ${f} ---\n` + fs.readFileSync(path.join(dir, f), 'utf8').trim() + '\n');
const block = B + '\n' + parts.join('') + E + '\n';
const M = "try { drawAll(); } catch (err) { console.error('v3g', err); }";
if (s.split(M).length !== 2) throw new Error('marcador final não único');
s = s.split(M).join(block + M);
fs.writeFileSync(file, s);
let bad = 0; for (const x of [...s.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1])) { try { new Function(x); } catch (err) { bad++; console.log('ERRO de sintaxe:', err.message); } }
console.log(bad ? 'COM ERRO' : 'inserido, sintaxe ok', parts.length, 'blocos', 'branch ' + branch);
