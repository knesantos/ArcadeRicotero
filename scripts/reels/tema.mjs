// Reel 1 — Adiviná el tema: la escalera de audio sube, el tema nunca se nombra.
import { cartel, datos, pagina } from './comun.mjs';
import { FFMPEG, REPO, correr, grabar, juntar, trabajo } from './motor.mjs';

const DESTINO = process.argv[2];
if (!DESTINO) throw new Error('Uso: npm run reels -- tema <destino.mp4>');
const T = trabajo();
// El tema que suena: uno que se reconoce entre los 2 y los 4 segundos, no en la décima.
const TEMA = process.argv[3] ?? 'juguetes-perdidos';
const DURACION = 19;
// Después del "¿Ya la tenés?" el tema sigue desde donde quedó, bajo el cartel, y nadie dice cuál es.
const SIGUE = { desde: 4, t: 12.6 };
// Los cuatro primeros escalones de la escalera del juego (src/lib/tema/escalera.ts).
const PASOS = [
  { s: 0.1, t: 1.5, rotulo: '0,1 s' },
  { s: 0.5, t: 3.1, rotulo: '0,5 s' },
  { s: 2, t: 4.9, rotulo: '2 s' },
  { s: 4, t: 7.9, rotulo: '4 s' },
];

const barras = Array.from({ length: 50 }, (_, i) => 18 + Math.round(52 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.43))));

const css = `
#grito{position:absolute;left:24px;right:24px;top:108px;font-size:2.15rem;line-height:1.02;color:var(--cat-mitologia)}
#grito p{position:absolute;opacity:0}
.lobo{font-family:var(--fuente-lobo-suelto);font-size:2.5rem}
.rot{font-family:var(--fuente-rotulada);font-size:1.75rem}
#cuenta{position:absolute;left:0;right:0;top:232px;text-align:center;font-family:var(--fuente-rotulada);font-size:5.6rem;color:var(--texto);letter-spacing:-.02em}
#surco{position:absolute;left:22px;right:22px;top:372px;height:72px;display:flex;align-items:center;gap:2px}
#surco i{flex:1;background:var(--borde);border-radius:1px}
#surco i.suena{background:var(--cat-mitologia)}
#aguja{position:absolute;top:362px;width:3px;height:92px;background:var(--texto);left:22px}
.premios{top:486px}
`;

const cuerpo = `
<img class="logo" src="/marca/fr.svg" alt="">
<div id="grito">
  <p class="lobo" id="g1">Una décima te tiene que alcanzar.</p>
  <p class="rot" id="g2">¿Nada? Te damos más.</p>
  <p class="rot" id="g3">¿Ya la tenés?</p>
</div>
<div id="cuenta"></div>
<div id="surco">${barras.map((h) => `<i style="height:${h}px"></i>`).join('')}</div>
<div id="aguja"></div>
<table class="premios"><tr><th>Audio</th>${['0,1 s', '0,5 s', '2 s', '4 s', '8 s', '10 s'].map((x) => `<td>${x}</td>`).join('')}</tr>
<tr><th>Vale</th>${[100, 80, 60, 40, 20, 10].map((x) => `<td>${x}</td>`).join('')}</tr></table>
${cartel({
  titulo: 'Adiviná el tema',
  fuente: 'var(--fuente-lobo-suelto)',
  color: 'var(--cat-mitologia)',
  canta: 'La aguja te tiembla sobre el surco.',
  nombra: `${datos('adivinar-tema.json').fragmentos.length} temas, de una décima de segundo para arriba. Gratis y sin cuenta, desde el teléfono.`,
  url: 'fichinricotero.com.ar',
})}`;

const js = `
const PASOS=${JSON.stringify(PASOS)};
const barras=[...document.querySelectorAll('#surco i')];
const celdas=[...document.querySelectorAll('.premios tr')].map(tr=>[...tr.querySelectorAll('td')]);
window.__cuadro=t=>{
  ver($('#g1'),t,.2,2.9);
  ver($('#g2'),t,2.7,4.7);
  ver($('#g3'),t,12.2,13.2);
  // El escalón vigente: el último que ya empezó (con un respiro antes de sonar).
  let k=-1; PASOS.forEach((p,i)=>{if(t>=p.t-.35)k=i});
  const c=$('#cuenta');
  if(k<0){c.style.opacity=0}else{sellar(c,t,PASOS[k].t-.35,-1.5);c.textContent=PASOS[k].rotulo}
  celdas.forEach(fila=>fila.forEach((td,i)=>{td.className=i===k?'ahora':(i<k?'paso':'')}));
  // Lo que ya sonó del paso en curso, sobre 10 s: una décima prende una sola rayita.
  let sono=0; if(k>=0){const p=PASOS[k];sono=cl(t-p.t,0,p.s)}
  const prendidas=k<0?0:Math.max(t>=PASOS[k].t?1:0,Math.round(sono/10*barras.length));
  barras.forEach((b,i)=>b.classList.toggle('suena',i<prendidas));
  $('#aguja').style.left=(22+316*prendidas/barras.length)+'px';
  $('#aguja').style.opacity=k<0?0:1;
  $('#cartel').style.opacity=t>=13.2?1:0;
};`;

const video = `${T}/video.mp4`;
const audio = `${T}/audio.m4a`;
await grabar({ html: pagina(css, cuerpo, js), duracion: DURACION, salida: video });

// El audio: el mismo archivo del juego, cortado en cada escalón y puesto en su lugar.
const frag = `${REPO}/public/audio/fragmentos/${TEMA}.mp3`;
const partes = PASOS.map((p, i) =>
  `[s${i}]atrim=0:${p.s},asetpts=PTS-STARTPTS,afade=t=out:st=${Math.max(0, p.s - 0.03)}:d=0.03,adelay=${Math.round(p.t * 1000)}|${Math.round(p.t * 1000)}[a${i}]`);
const n = PASOS.length;
const ms = Math.round(SIGUE.t * 1000);
const sigue = `[s${n}]atrim=${SIGUE.desde},asetpts=PTS-STARTPTS,afade=t=in:d=0.04,afade=t=out:st=${10 - SIGUE.desde - 1.2}:d=1.2,adelay=${ms}|${ms}[a${n}]`;
// Fuerte: en el teléfono suena por el parlante chico, y los pasos cortos se tienen que oír.
const filtro = `[0:a]asplit=${n + 1}${PASOS.concat(SIGUE).map((_, i) => `[s${i}]`).join('')};${partes.join(';')};${sigue};anullsrc=r=44100:cl=stereo,atrim=0:${DURACION}[silencio];[silencio]${PASOS.concat(SIGUE).map((_, i) => `[a${i}]`).join('')}amix=inputs=${n + 2}:normalize=0:duration=first,volume=1.9,alimiter=limit=0.95[out]`;
await correr(FFMPEG, ['-y', '-i', frag, '-filter_complex', filtro, '-map', '[out]', '-c:a', 'aac', '-b:a', '192k', audio]);
await juntar(video, audio, DESTINO);
console.log(`listo: ${DESTINO}`);
