// Reel 3 — Bestiario redondo: se camina el infierno de verdad, con su reloj, y se corta antes de verlo todo.
import { CSS_BASE, JS_BASE, cartel, datos } from './comun.mjs';
import { FFMPEG, REPO, SITIO, correr, grabar, juntar, trabajo } from './motor.mjs';

const DESTINO = process.argv[2];
if (!DESTINO) throw new Error('Uso: npm run reels -- bestiario <destino.mp4>');
const T = trabajo();
const REGION = process.argv[3] ?? 'el-infierno';
const LLEGA = Number(process.argv[4] ?? 520); // hasta dónde se camina, en px de scroll
const DURACION = 15;
const NEGRO = 9.6; // se apaga antes de mostrar de más
const BICHOS = datos('bestiario.json').bestias.length;

// Solo el cartel y las líneas sobre la escena; la base de marca ya la trae la página.
const css = CSS_BASE.slice(CSS_BASE.indexOf('*{box-sizing'))
  .replace(/html,body\{[^}]*\}/, '').replace(/body::after\{[^}]*\}/, '') + `
#reel-velo{position:fixed;inset:0;background:var(--fondo);opacity:0;z-index:40;pointer-events:none}
#reel .linea{position:fixed;left:22px;right:22px;top:64px;z-index:45;opacity:0;font-family:var(--fuente-rotulada);font-size:1.45rem;line-height:1.12;color:var(--texto);
  background:var(--fondo);border:3px solid var(--entorno-infierno-fuego);border-radius:3px;padding:12px 14px;rotate:-1.5deg}
#reel .linea.sola{background:none;border:none;top:290px;text-align:center;rotate:0deg}
#reel .cartel{position:fixed;z-index:46}
.bocadillo,#bocadillo,.camino-saltar,#tablero,.cabecera-sitio,astro-dev-toolbar{visibility:hidden!important;display:none!important}
.camino-escenario{transform:scale(1.6);transform-origin:42% 50%}
`;

const capa = `<div id="reel">
<div id="reel-velo"></div>
<p class="linea" id="l1">Algo te mira desde la puerta.</p>
<p class="linea" id="l2">${BICHOS} bichos salen de las letras.</p>
<p class="linea" id="l3">Algunos dicen su verso solos.</p>
<p class="linea sola" id="l4">No todos se dejan ver.</p>
${cartel({
  titulo: 'Bestiario redondo',
  fuente: 'var(--fuente-marca-firma)',
  color: 'var(--entorno-infierno-fuego)',
  canta: 'Ojos amarillos detrás de la puerta.',
  nombra: `${BICHOS} bichos y personajes de los diez discos, cada uno en su rincón de un mundo redondo que se camina.`,
  url: 'fichinricotero.com.ar',
})}</div>`;

const js = `${JS_BASE}
const esc=document.querySelector('.camino-escenario');
const LLEGA=${LLEGA}, NEGRO=${NEGRO};
let ultimo=-1;
window.__cuadro=t=>{
  // La cámara: quieta frente a la puerta, después camina despacio hacia la derecha.
  const k=suave(cl((t-3)/(NEGRO-3)));
  esc.scrollLeft=Math.round(LLEGA*(k*.85+.15*cl((t-3)/(NEGRO-3))));
  esc.dispatchEvent(new Event('scroll'));
  // El reloj de la página avanza un cuadro por cuadro de video (mismo dt que un teléfono a 30).
  const pasos=ultimo<0?1:Math.max(1,Math.round((t-ultimo)*30)); ultimo=t;
  for(let i=0;i<pasos;i++) window.__avanzar(1000/30);
  ver($('#l1'),t,.4,3.0); ver($('#l2'),t,3.4,6.3); ver($('#l3'),t,6.7,NEGRO-.2);
  $('#reel-velo').style.opacity=t<NEGRO?0:1;
  ver($('#l4'),t,NEGRO+.3,NEGRO+2);
  $('#cartel').style.opacity=t>=NEGRO+2.2?1:0;
};`;

const video = `${T}/video.mp4`;
await grabar({
  url: `${SITIO}/redondopedia/bestiario/${REGION}/`,
  virtual: true,
  duracion: DURACION,
  salida: video,
  antes: async (page) => {
    await page.evaluate((css, capa, js) => {
      const s = document.createElement('style'); s.textContent = css; document.head.append(s);
      document.body.insertAdjacentHTML('beforeend', capa);
      // Que la página arranque su reloj y se asiente antes del primer cuadro.
      for (let i = 0; i < 45; i++) window.__avanzar(1000 / 30);
      (0, eval)(js);
    }, css, capa, js);
    await page.evaluate(() => document.fonts.ready);
  },
});

// El sonido: un recorte del tema del infierno, lejos y apagado, como suena en el camino (D-76).
const frag = `${REPO}/public/audio/fragmentos/el-infierno-esta-encantador-esta-noche.mp3`;
const audio = `${T}/audio.m4a`;
const filtro = `[0:a]atrim=0:${NEGRO},asetpts=PTS-STARTPTS,lowpass=f=650,lowpass=f=650,aecho=0.8:0.7:120|260:0.35|0.2,volume=0.55,afade=t=in:d=1.2,afade=t=out:st=${NEGRO - 0.25}:d=0.25,apad=whole_dur=${DURACION}[out]`;
await correr(FFMPEG, ['-y', '-i', frag, '-filter_complex', filtro, '-map', '[out]', '-ac', '2', '-c:a', 'aac', '-b:a', '192k', audio]);
await juntar(video, audio, DESTINO);
console.log(`listo: ${DESTINO}`);
