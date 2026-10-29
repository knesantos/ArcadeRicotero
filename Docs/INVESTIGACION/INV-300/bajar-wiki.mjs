import fs from 'node:fs'; import path from 'node:path';
const out = process.argv[2]; const API='https://redonditos.fandom.com/es/api.php';
const H={headers:{'User-Agent':'Mozilla/5.0 FichinRicotero-research (fan site)'}};
const j = async q => (await fetch(API+'?'+new URLSearchParams({...q,format:'json',formatversion:'2'}),H)).json();
let titles=[], cont={};
do { const r=await j({action:'query',list:'allpages',apnamespace:'0',aplimit:'500',apfilterredir:'nonredirects',...cont}); titles.push(...r.query.allpages.map(p=>p.title)); cont=r.continue||null; } while(cont);
fs.writeFileSync(path.join(out,'titulos.json'),JSON.stringify(titles,null,1));
const pages={};
for(let i=0;i<titles.length;i+=50){ const r=await j({action:'query',prop:'revisions|categories',rvprop:'content|timestamp',rvslots:'main',cllimit:'max',titles:titles.slice(i,i+50).join('|')});
 for(const p of r.query.pages){ pages[p.title]={ts:p.revisions?.[0]?.timestamp, cats:(p.categories||[]).map(c=>c.title), text:p.revisions?.[0]?.slots?.main?.content||''}; } }
fs.writeFileSync(path.join(out,'paginas.json'),JSON.stringify(pages));
const sizes=Object.entries(pages).map(([t,p])=>[t,p.text.length]).sort((a,b)=>b[1]-a[1]);
console.log(titles.length,'paginas', sizes.reduce((s,x)=>s+x[1],0),'chars'); console.log(sizes.slice(0,40).map(x=>x[1]+'\t'+x[0]).join('\n'));
