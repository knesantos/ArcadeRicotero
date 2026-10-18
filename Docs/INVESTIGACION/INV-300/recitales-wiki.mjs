import fs from 'node:fs';
const [,,dump,canc,out]=process.argv;
const P=JSON.parse(fs.readFileSync(dump,'utf8')); const C=JSON.parse(fs.readFileSync(canc,'utf8')).temas;
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\(.*?\)/g,'').replace(/[^a-z0-9ñ ]/g,' ').replace(/\b(versus|vs)\b/g,'vs').replace(/\s+/g,' ').trim();
const idx={}; for(const t of C) idx[norm(t.titulo)]=t;
const alias={'nam fi frufi fali fru':'nam fri frufi fali fru','el templo de momo':'templo de momo','eso es to to todo amigos':'esto es to to todo amigos','la murga de la virgencita':'murga de la virgencita','murga punga':'murga purga','nuotatori profesionisti':'nuotatori professionisti','la parebellum del buen psicopata':'la parabellum del buen psicopata','divina tv furher':'divina tv fuhrer','mi perro dinamtia':'mi perro dinamita','mariposa pontiac rock de pais':'mariposa pontiac rock del pais','jijiji':'ji ji ji','un pacman en el savoy':null,'la vaca cubana':'aquella solitaria vaca cubana','el gordo tramposo':'ese gordo tramposo','nene nena':'nene nena','barbazul vs el amor letal':'barbazul vs el amor letal'};
const find=raw=>{let n=norm(raw); if(idx[n])return idx[n]; if(alias[n]&&idx[alias[n]])return idx[alias[n]]; const k=Object.keys(idx).find(k=>k.replace(/ /g,'')===n.replace(/ /g,'')); if(k)return idx[k]; const k2=Object.keys(idx).find(k=>k.startsWith(n)||n.startsWith(k)); return k2?idx[k2]:null;};
const rec=[];
for(const [t,v] of Object.entries(P)){
 if(!/^\d{1,2}[.,]\d\d[.,]\d{4}/.test(t))continue;
 if(!v.cats.some(c=>/Recitales de Patricio Rey/i.test(c)) && !v.text.slice(0,400).includes('banda=[[Patricio Rey'))continue;
 const m=t.match(/^(\d{1,2})[.,](\d\d)[.,](\d{4}) (.*)$/); const fecha=`${m[3]}-${m[2]}-${m[1].padStart(2,'0')}`;
 const tx=v.text; const ib=(k)=>{const r=tx.match(new RegExp('[|][ ]*'+k+'[ ]*=([^|}]*)','i'));return r?r[1].trim():null};
 const rep=(tx.split(/==\s*Repertorio\s*==/i)[1]||'').split(/\n==[^=]/)[0];
 const temas=[];let set=1;
 for(const line of rep.split('\n')){ if(/^=+\s*(Set|Bis|Encore)/i.test(line)){set++;continue}
  const mm=line.match(/^\*\s*(\d+)?\.?\s*(.*)$/); if(!mm)continue; let s=mm[2].replace(/\[\[([^\]|]*)\|([^\]]*)\]\]/g,'$2').replace(/\[\[([^\]]*)\]\]/g,'$1').replace(/''+/g,'').trim(); if(!s)continue;
  const f=find(s.split(/\s[\/–-]\s|\(/)[0]); temas.push({titulo:s,set,slug:f?.slug||null}); }
 const notas=((tx.split(/==\s*Notas\s*==/i)[1]||'').split(/\n==[^=]/)[0]).trim();
 rec.push({pagina:t,fecha,lugar:m[4],recinto:ib('recinto'),asistencia:ib('aistencia')||ib('asistencia'),temas,notas:notas.slice(0,1500),cats:v.cats});
}
rec.sort((a,b)=>a.fecha.localeCompare(b.fecha));
const con=rec.filter(r=>r.temas.length); const cnt={},prim={},ult={},abre={},cierra={};
for(const r of con){const ts=r.temas.filter(x=>x.slug); if(!ts.length)continue; abre[ts[0].slug]=(abre[ts[0].slug]||0)+1; cierra[ts.at(-1).slug]=(cierra[ts.at(-1).slug]||0)+1;
 for(const x of new Set(ts.map(x=>x.slug))){cnt[x]=(cnt[x]||0)+1; prim[x]??=r.fecha; ult[x]=r.fecha;}}
const nunca=C.filter(t=>!cnt[t.slug]).map(t=>t.titulo+' ('+t.anio+')');
const sinCruzar=[...new Set(con.flatMap(r=>r.temas.filter(x=>!x.slug).map(x=>x.titulo)))];
const top=Object.entries(cnt).sort((a,b)=>b[1]-a[1]);
const res={total:rec.length,conLista:con.length,top,abre:Object.entries(abre).sort((a,b)=>b[1]-a[1]).slice(0,10),cierra:Object.entries(cierra).sort((a,b)=>b[1]-a[1]).slice(0,10),prim,ult,nunca,sinCruzar,
 largos:con.map(r=>[r.temas.length,r.fecha,r.lugar]).sort((a,b)=>b[0]-a[0]).slice(0,8),
 asist:rec.filter(r=>r.asistencia).map(r=>[r.fecha,r.lugar,r.asistencia])};
fs.writeFileSync(out+'/recitales-wiki.json',JSON.stringify(rec,null,1)); fs.writeFileSync(out+'/stats-wiki.json',JSON.stringify(res,null,1));
console.log('recitales',rec.length,'con lista',con.length,'sin cruzar',sinCruzar.length);
console.log('TOP',top.slice(0,25).map(x=>x[1]+' '+x[0]).join(' | '));
console.log('ABRE',JSON.stringify(res.abre));console.log('CIERRA',JSON.stringify(res.cierra));
console.log('NUNCA en la muestra:',nunca.length,nunca.join(' | '));console.log('SIN CRUZAR:',sinCruzar.join(' | '));
console.log('LARGOS',JSON.stringify(res.largos));console.log('ASIST',JSON.stringify(res.asist));
console.log('POR ANIO',JSON.stringify(con.reduce((o,r)=>(o[r.fecha.slice(0,4)]=(o[r.fecha.slice(0,4)]||0)+1,o),{})));
