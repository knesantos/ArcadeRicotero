// La pantalla de "Adiviná el tema" armada para los reels de títeres (`D-81`): no se graba el juego, se
// compone con su mismo idioma (la escalera de `src/lib/tema/escalera.ts`, los botones de `copy.ts`).
// Todo depende de `t`: el guion es una lista de momentos y la pantalla se deduce de ella en cada cuadro.

/** La escalera del juego: lo que suena en cada paso y lo que vale acertar ahí. */
export const ESCALERA = [
  { s: 0.1, rotulo: '0,1 s', vale: 100 },
  { s: 0.5, rotulo: '0,5 s', vale: 80 },
  { s: 2, rotulo: '2 s', vale: 60 },
  { s: 4, rotulo: '4 s', vale: 40 },
  { s: 8, rotulo: '8 s', vale: 20 },
  { s: 10, rotulo: '10 s', vale: 10 },
];

const barras = Array.from({ length: 46 }, (_, i) => 10 + Math.round(26 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.43))));

export const CSS_JUEGO = `
#juego{position:absolute;left:14px;right:14px;top:344px;bottom:8px}
#surco{position:absolute;left:0;right:0;top:0;height:40px;display:flex;align-items:center;gap:2px}
#surco i{flex:1;background:var(--borde);border-radius:1px}
#surco i.suena{background:var(--cat-mitologia)}
#aguja{position:absolute;top:-4px;width:3px;height:48px;background:var(--texto);left:0;opacity:0}
#juego .premios{top:48px;left:0;width:332px}
#intentos{position:absolute;left:0;right:0;top:142px;list-style:none;padding:0;font-family:var(--fuente);font-size:.92rem}
#intentos li{display:flex;align-items:center;gap:8px;height:22px;opacity:0}
#intentos li .marca{width:20px;font-weight:700;text-align:center}
#intentos li .quien{width:22px;height:22px;border:2px solid var(--borde);border-radius:3px;background-size:cover;background-position:center}
#intentos li.mal .titulo{text-decoration:line-through 2px;color:var(--texto-tenue)}
#intentos li.mal .marca{color:var(--acento-4)}
#intentos li.bien .marca,#intentos li.bien .titulo{color:var(--acento-3)}
#intentos li .vale{margin-left:auto;font-family:var(--fuente-rotulada);font-size:.8rem;color:var(--texto-tenue)}
#intentos li.bien .vale{color:var(--acento-3)}
#caja{position:absolute;left:0;right:0;top:212px;height:38px;border:2px solid var(--borde);border-radius:3px;background:var(--fondo);
  padding:0 12px;display:flex;align-items:center;font-size:1rem;color:var(--texto)}
#caja.vacia{color:var(--texto-tenue)}
#caja .cursor{display:inline-block;width:2px;height:1.15em;background:var(--texto);margin-left:2px;vertical-align:middle}
#boton{position:absolute;left:0;right:0;top:256px;height:40px;border-radius:var(--radio);background:var(--cat-mitologia);color:var(--fondo);
  font-family:var(--fuente-rotulada);font-size:1.12rem;display:flex;align-items:center;justify-content:center;letter-spacing:.02em}
#boton.apretado{scale:.96}
#grito{position:absolute;right:18px;top:262px;z-index:30;font-family:var(--fuente-rotulada);font-size:2.6rem;color:var(--acento-3);
  border:4px solid currentColor;border-radius:3px;padding:2px 14px;background:var(--fondo);opacity:0}
#tacha{position:absolute;right:22px;top:276px;z-index:30;font-family:var(--fuente-rotulada);font-size:1.4rem;color:var(--acento-4);
  border:3px solid currentColor;border-radius:3px;padding:2px 10px;background:var(--fondo);opacity:0}
`;

/**
 * El guion de la partida: `pasos` (cuándo suena cada escalón) y `intentos` (quién tipea qué, desde
 * cuándo, cuándo arriesga, y si acierta). `quien` es la imagen chiquita del que juega, sin nombre.
 */
export function markupJuego(intentos) {
  return `<div id="juego">
<div id="surco">${barras.map((h) => `<i style="height:${h}px"></i>`).join('')}</div>
<div id="aguja"></div>
<table class="premios"><tr><th>Audio</th>${ESCALERA.map((x) => `<td>${x.rotulo}</td>`).join('')}</tr>
<tr><th>Vale</th>${ESCALERA.map((x) => `<td>${x.vale}</td>`).join('')}</tr></table>
<ul id="intentos">${intentos.map((it, i) => `<li id="i${i}" class="${it.bien ? 'bien' : 'mal'}"><span class="marca">${it.bien ? '✔' : '✕'}</span>${it.quien ? `<span class="quien" style="background-image:url(${it.quien})"></span>` : ''}<span class="titulo">${it.texto}</span><span class="vale">${it.bien ? '+' + ESCALERA[it.paso].vale : ''}</span></li>`).join('')}</ul>
<div id="caja" class="vacia"></div>
<div id="boton">Pasá</div>
</div>
<div id="grito">¡ESA!</div>
<div id="tacha">NO ERA</div>`;
}

/** El reloj de la pantalla: va dentro del `<script>` de la pieza, después de JS_BASE. */
export function jsJuego(pasos, intentos) {
  return `
const ESC=${JSON.stringify(ESCALERA)};
const PASOS=${JSON.stringify(pasos)};
const INT=${JSON.stringify(intentos)};
const barrasJ=[...document.querySelectorAll('#surco i')];
const celdasJ=[...document.querySelectorAll('#juego .premios tr')].map(tr=>[...tr.querySelectorAll('td')]);
function juego(t){
  // El escalón vigente: el último que ya empezó.
  let k=-1; PASOS.forEach((p,i)=>{if(t>=p.t-.3)k=i});
  celdasJ.forEach(f=>f.forEach((td,i)=>{td.className=i===k?'ahora':(i<k?'paso':'')}));
  let prendidas=0;
  if(k>=0){const p=PASOS[k];const sono=cl(t-p.t,0,ESC[p.paso].s);prendidas=Math.max(t>=p.t?1:0,Math.round(sono/10*barrasJ.length))}
  barrasJ.forEach((b,i)=>b.classList.toggle('suena',i<prendidas));
  const ag=$('#aguja');ag.style.opacity=k<0?0:1;ag.style.left=(332*prendidas/barrasJ.length)+'px';
  // La caja: lo que se está tipeando ahora, letra por letra.
  const caja=$('#caja'),boton=$('#boton');
  let texto='',escribe=false;
  INT.forEach(it=>{
    if(t>=it.desde&&t<it.arriesga+.25){escribe=true;const n=Math.round(cl((t-it.desde)/(it.tipea??1))*it.texto.length);texto=it.texto.slice(0,n)}
  });
  caja.className=texto?'':'vacia';
  const cursor=Math.floor(t*2.4)%2===0||escribe?'<span class="cursor"></span>':'';
  caja.innerHTML=texto?texto+cursor:'Escribí el tema'+(escribe?cursor:'');
  boton.textContent=texto?'Arriesgá':'Pasá';
  boton.className=INT.some(it=>t>=it.arriesga&&t<it.arriesga+.18)?'apretado':'';
  // Lo que ya se arriesgó queda en la lista; el sello grande dice cómo salió.
  INT.forEach((it,i)=>ver($('#i'+i),t,it.arriesga+.2));
  const ultimo=INT.filter(it=>t>=it.arriesga+.2).pop();
  const g=$('#grito'),x=$('#tacha');
  if(ultimo&&ultimo.bien) sellar(g,t,ultimo.arriesga+.2,-6,ultimo.arriesga+2.6); else g.style.opacity=0;
  if(ultimo&&!ultimo.bien) sellar(x,t,ultimo.arriesga+.2,5,ultimo.arriesga+1.2); else x.style.opacity=0;
}`;
}

/**
 * Los ruidos de la pieza, hechos con ffmpeg y nada bajado de ningún lado: la tecla, el "no era", el
 * acierto, el estallido y el salto. Devuelve la ruta de cada uno.
 */
export async function ruidos(dir, correr, FFMPEG) {
  const hechos = {
    tecla: "aevalsrc='0.5*(random(0)*2-1)*exp(-t*260)':s=44100:d=0.04",
    nada: "aevalsrc='0.45*sin(2*PI*t*(150-60*t))*(0.8+0.2*gt(sin(2*PI*t*55),0))*exp(-t*5)':s=44100:d=0.42",
    bien: "aevalsrc='0.32*(sin(2*PI*660*t)*lt(t,0.11)+sin(2*PI*990*t)*gte(t,0.11))*exp(-t*4)':s=44100:d=0.5",
    bum: "aevalsrc='0.95*((random(0)*2-1)*exp(-t*3.2)+0.8*sin(2*PI*t*(70-40*t))*exp(-t*2.2))':s=44100:d=1.8",
    salto: "aevalsrc='0.35*sin(2*PI*t*(300+900*t))*exp(-t*7)':s=44100:d=0.35",
    soga: "aevalsrc='0.6*(random(0)*2-1)*exp(-t*40)+0.3*sin(2*PI*180*t)*exp(-t*18)':s=44100:d=0.25",
  };
  const rutas = {};
  for (const [nombre, src] of Object.entries(hechos)) {
    rutas[nombre] = `${dir}/${nombre}.wav`;
    const filtro = nombre === 'bum' ? ['-af', 'lowpass=f=1400,lowpass=f=1400'] : [];
    await correr(FFMPEG, ['-y', '-f', 'lavfi', '-i', src, ...filtro, '-ac', '2', rutas[nombre]]);
  }
  return rutas;
}

/**
 * Junta la música de la partida y los ruidos (cada uno `[ruta, segundo, volumen]`) en un solo audio.
 */
export async function mezclar({ fragmento, pasos, sigue, golpes, duracion, salida, correr, FFMPEG }) {
  const a = audioPartida(pasos, sigue);
  const entradas = ['-i', fragmento, ...golpes.flatMap(([ruta]) => ['-i', ruta])];
  const capas = golpes.map(([, t, vol], i) => {
    const ms = Math.round(t * 1000);
    return `[${i + 1}:a]volume=${vol ?? 1},adelay=${ms}|${ms}[g${i}]`;
  });
  const todas = [...a.etiquetas, ...golpes.map((_, i) => `[g${i}]`)];
  const filtro = `${a.filtro};${capas.join(';')}${capas.length ? ';' : ''}anullsrc=r=44100:cl=stereo,atrim=0:${duracion}[silencio];[silencio]${todas.join('')}amix=inputs=${todas.length + 1}:normalize=0:duration=first,volume=1.7,alimiter=limit=0.95[out]`;
  await correr(FFMPEG, ['-y', ...entradas, '-filter_complex', filtro, '-map', '[out]', '-ac', '2', '-c:a', 'aac', '-b:a', '192k', salida]);
}

/**
 * El audio de la partida: cada escalón cortado del mismo archivo del juego y puesto en su segundo, y desde
 * el acierto el tema sigue (`D-22`: al revelar, el tema se escucha). Devuelve el filtro de ffmpeg para
 * la entrada 0 (el fragmento) y la etiqueta de salida.
 */
export function audioPartida(pasos, sigue, salida = 'musica') {
  const n = pasos.length;
  const partes = pasos.map((p, i) => {
    const s = ESCALERA[p.paso].s;
    const ms = Math.round(p.t * 1000);
    return `[m${i}]atrim=0:${s},asetpts=PTS-STARTPTS,afade=t=out:st=${Math.max(0, s - 0.03)}:d=0.03,adelay=${ms}|${ms}[p${i}]`;
  });
  const ms = Math.round(sigue.t * 1000);
  const resto = `[m${n}]atrim=${sigue.desde},asetpts=PTS-STARTPTS,afade=t=in:d=0.04,afade=t=out:st=${sigue.dura - 1.4}:d=1.4,atrim=0:${sigue.dura},adelay=${ms}|${ms}[p${n}]`;
  return {
    filtro: `[0:a]asplit=${n + 1}${Array.from({ length: n + 1 }, (_, i) => `[m${i}]`).join('')};${partes.join(';')};${resto}`,
    etiquetas: Array.from({ length: n + 1 }, (_, i) => `[p${i}]`),
    salida,
  };
}
