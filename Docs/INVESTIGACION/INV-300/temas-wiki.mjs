import fs from 'node:fs';
const [,,dump,out]=process.argv; const P=JSON.parse(fs.readFileSync(dump,'utf8'));
const plano=t=>t.replace(/\{\{[^{}]*\}\}/g,'').replace(/<ref[^>]*\/>/g,'').replace(/<ref[^>]*>[\s\S]*?<\/ref>/g,'').replace(/\[\[(Archivo|File|Imagen|Categoría)[^\]]*\]\]/gi,'').replace(/\[\[([^\]|]*)\|([^\]]*)\]\]/g,'$2').replace(/\[\[([^\]]*)\]\]/g,'$1').replace(/\[(https?:[^ \]]+) ([^\]]*)\]/g,'$2').replace(/'''?/g,'').replace(/<[^>]+>/g,'').replace(/\n{2,}/g,'\n').trim();
const keep=/Sobre la canci|Historia|En vivo|Interpretaci|Variaciones|Versi[oó]n de|Ficha t/i; let o='';
for(const [t,v] of Object.entries(P)){ if(!v.cats.some(c=>/Canciones|Inéditos|nunca|reditadas/i.test(c)))continue;
 const parts=v.text.split(/^(==+[^=\n]+==+)\s*$/m); let s=plano(parts[0]).slice(0,600)+'\n';
 for(let i=1;i<parts.length;i+=2){ if(keep.test(parts[i])) s+='['+parts[i].replace(/=/g,'').trim()+'] '+plano(parts[i+1]||'')+'\n'; }
 o+='\n#### '+t+' {'+v.cats.map(c=>c.replace('Categoría:','')).join('; ')+'}\n'+s; }
fs.writeFileSync(out,o); console.log(o.length);
