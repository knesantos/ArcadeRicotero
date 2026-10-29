// Reel 2 — Sacalo por la letra: los versos llegan tachados con fibra; se ve una palabra por renglón.
import { cartel, datos, pagina } from './comun.mjs';
import { FFMPEG, correr, grabar, juntar, trabajo } from './motor.mjs';

const DESTINO = process.argv[2];
if (!DESTINO) throw new Error('Uso: npm run reels -- letra <destino.mp4>');
const T = trabajo();
const DURACION = 14.5;
// Una palabra suelta por renglón, de los ocho versos que el juego da de "Un Pacman en el Savoy".
// [tachado antes, palabra, tachado después] en px. La última va tachada entera.
const RENGLONES = [
  [150, 'nube', 0], [70, 'sermón', 110], [120, 'ladrido', 0], [50, 'cuchillo', 130],
  [140, 'batería', 0], [80, 'rubia', 120], [40, 'supersticiones', 0], [260, '', 0],
];
// Cuándo se tacha cada renglón: 1, 2, 4, 8 versos, como la escalera del juego.
const CUANDO = [1.4, 3.0, 4.7, 4.95, 6.6, 6.85, 7.1, 7.35];
const PASOS = [{ t: 1.2 }, { t: 2.8 }, { t: 4.5 }, { t: 6.4 }];

const css = `
#grito{position:absolute;left:24px;right:24px;top:96px;height:60px;color:var(--disco-momo-sampler-tinta);font-family:var(--fuente-marca-firma);font-size:2.4rem;line-height:1}
#grito p{position:absolute;opacity:0}
.premios{top:168px}
#hoja{position:absolute;left:26px;top:258px;width:308px;height:300px;background:var(--papel);border:2px solid var(--papel-borde);rotate:1.6deg;padding:22px 18px 0;
  background-image:repeating-linear-gradient(transparent 0 32px,var(--papel-borde) 32px 33px);background-position:0 21px}
#hoja::before{content:'';position:absolute;top:-12px;left:38%;width:76px;height:22px;background:color-mix(in srgb,var(--papel) 35%,transparent);rotate:-4deg;border-radius:2px}
.renglon{height:33px;display:flex;align-items:center;gap:6px;opacity:0}
.renglon b{display:block;height:17px;background:var(--fondo);border-radius:2px;width:0;
  -webkit-mask-image:var(--textura-tinta);mask-image:var(--textura-tinta);-webkit-mask-size:240px;mask-size:240px}
.renglon span{font-family:var(--fuente-rotulada);font-size:.95rem;color:var(--fondo);opacity:0}
`;

const cuerpo = `
<img class="logo" src="/marca/fr.svg" alt="">
<div id="grito"><p id="g0">Un verso.</p><p id="g1">Dos.</p><p id="g2">Cuatro.</p><p id="g3">Ocho.</p><p id="g4">¿Ya lo sacaste?</p></div>
<table class="premios"><tr><th>Versos</th>${[1, 2, 4, 8].map((x) => `<td>${x}</td>`).join('')}</tr>
<tr><th>Vale</th>${[100, 80, 60, 40].map((x) => `<td>${x}</td>`).join('')}</tr></table>
<div id="hoja">${RENGLONES.map(([a, w, d]) => `<div class="renglon"><b data-w="${a}"></b><span>${w}</span><b data-w="${d}"></b></div>`).join('')}</div>
${cartel({
  titulo: 'Sacalo por la letra',
  fuente: 'var(--fuente-marca-firma)',
  color: 'var(--disco-momo-sampler-tinta)',
  canta: 'Un papel arrugado te pesa en el bolsillo.',
  nombra: `${datos('por-la-letra.json').items.length} temas. Un verso te tiene que alcanzar; si no, te damos más. Gratis y sin cuenta.`,
  url: 'fichinricotero.com.ar',
})}`;

const js = `
const CUANDO=${JSON.stringify(CUANDO)}, PASOS=${JSON.stringify(PASOS)};
const renglones=[...document.querySelectorAll('.renglon')];
const celdas=[...document.querySelectorAll('.premios tr')].map(tr=>[...tr.querySelectorAll('td')]);
window.__cuadro=t=>{
  ['#g0','#g1','#g2','#g3'].forEach((g,i)=>ver($(g),t,PASOS[i].t-.1,(PASOS[i+1]?.t??9.4)-.1));
  ver($('#g4'),t,9.6,11.2);
  let k=-1; PASOS.forEach((p,i)=>{if(t>=p.t)k=i});
  celdas.forEach(f=>f.forEach((td,i)=>{td.className=i===k?'ahora':(i<k?'paso':'')}));
  // Cada renglón: la fibra pasa de izquierda a derecha en 0,3 s y deja la palabra a la vista.
  renglones.forEach((r,i)=>{
    const t0=CUANDO[i]; r.style.opacity=t>=t0?1:0;
    const [a,s,d]=r.children; const k1=suave((t-t0)/.16), k2=suave((t-t0-.16)/.16);
    a.style.width=(+a.dataset.w*k1)+'px'; s.style.opacity=t>=t0+.12?1:0; d.style.width=(+d.dataset.w*k2)+'px';
  });
  $('#hoja').style.opacity=t>=1.1?1:0;
  $('#cartel').style.opacity=t>=11.2?1:0;
};`;

const video = `${T}/video.mp4`;
const audio = `${T}/audio.m4a`;
await grabar({ html: pagina(css, cuerpo, js), duracion: DURACION, salida: video });

// El sonido: una fibra raspando el papel por renglón, sobre el silencio de una pieza.
const trazos = CUANDO.map((t, i) => {
  const ms = Math.round(t * 1000);
  return `anoisesrc=d=0.34:c=pink:r=44100:a=0.5:seed=${i + 3},bandpass=f=${2600 + i * 180}:w=1800,afade=t=in:d=0.04,afade=t=out:st=0.24:d=0.1,volume=70,aformat=channel_layouts=stereo,adelay=${ms}|${ms}[m${i}]`;
});
const filtro = `${trazos.join(';')};anoisesrc=d=${DURACION}:c=brown:r=44100:a=0.02,aformat=channel_layouts=stereo[piso];[piso]${CUANDO.map((_, i) => `[m${i}]`).join('')}amix=inputs=${CUANDO.length + 1}:normalize=0:duration=first[out]`;
await correr(FFMPEG, ['-y', '-filter_complex', filtro, '-map', '[out]', '-c:a', 'aac', '-b:a', '192k', audio]);
await juntar(video, audio, DESTINO);
console.log(`listo: ${DESTINO}`);
