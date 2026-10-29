// Reel 3 — Bestiario redondo: se caminan dos regiones de verdad, con su reloj, y cierra el cartel.
// La prisión de Barbazul y la pastura del cordero: bestias que se reconocen y entornos que lucen.
import { CSS_BASE, JS_BASE, cartel, datos } from './comun.mjs';
import { FFMPEG, REPO, SITIO, correr, grabar, juntar, trabajo } from './motor.mjs';

const DESTINO = process.argv[2];
if (!DESTINO) throw new Error('Uso: npm run reels -- bestiario <destino.mp4>');
const T = trabajo();
const BICHOS = datos('bestiario.json').bestias.length;

/**
 * Cada tramo es una región: de dónde a dónde se camina (px de scroll a 360 de ancho), cuánto
 * dura, qué se lee encima y qué suena de lejos (`D-76`: recortes apagados, como en el camino).
 * El último trae el cartel.
 */
const TRAMOS = [
  {
    region: 'la-prision',
    desde: 140,
    hasta: 720,
    dura: 8,
    tinta: 'var(--texto)',
    lineas: [[0.3, 3.7, 'Una barba azul detrás de las rejas.'], [4.0, 7.8, `${BICHOS} bichos salen de las letras.`]],
    suena: 'barbazul-versus-el-amor-letal',
  },
  {
    region: 'la-pastura',
    desde: 760,
    hasta: 1240,
    dura: 11.5,
    tinta: 'var(--entorno-pastura)',
    lineas: [[0.3, 3.8, 'Un lobo, un cordero y una vaca.'], [4.1, 7.6, 'Algunos dicen su verso solos.']],
    cartel: 8,
    suena: 'aquella-solitaria-vaca-cubana',
  },
];

// Solo las líneas y el cartel sobre la escena; la base de marca ya la trae la página.
const css = (tinta) => CSS_BASE.slice(CSS_BASE.indexOf('*{box-sizing'))
  .replace(/html,body\{[^}]*\}/, '').replace(/body::after\{[^}]*\}/, '') + `
#reel .linea{position:fixed;left:22px;right:22px;top:34px;z-index:45;opacity:0;font-family:var(--fuente-rotulada);font-size:1.45rem;line-height:1.12;color:var(--texto);
  background:var(--fondo);border:3px solid ${tinta};border-radius:3px;padding:12px 14px;rotate:-1.5deg}
#reel .cartel{position:fixed;z-index:46}
.bocadillo,#bocadillo,.camino-saltar,#tablero,.cabecera-sitio,astro-dev-toolbar{visibility:hidden!important;display:none!important}
.camino-escenario{transform:scale(1.15);transform-origin:50% 55%}
`;

function capa(tr) {
  return `<div id="reel">
${tr.lineas.map(([, , texto], i) => `<p class="linea" id="l${i}">${texto}</p>`).join('\n')}
${tr.cartel === undefined ? '<div id="cartel"></div>' : cartel({
    titulo: 'Bestiario redondo',
    // La letra de Lobo suelto, por pedido del usuario: el título va grande, de 28 px para arriba como pide la fuente.
    fuente: 'var(--fuente-lobo-suelto)',
    color: 'var(--entorno-pastura)',
    canta: 'Un cordero azul pasta al lado del lobo.',
    nombra: `${BICHOS} bichos y personajes de los diez discos, cada uno en su rincón de un mundo redondo que se camina.`,
    url: 'fichinricotero.com.ar',
  })}</div>`;
}

function js(tr) {
  return `${JS_BASE}
const esc=document.querySelector('.camino-escenario');
const TR=${JSON.stringify(tr)};
let ultimo=-1;
window.__cuadro=t=>{
  // La cámara camina parejo, con un arranque y una llegada suaves, como el dedo.
  const fin=TR.cartel??TR.dura;
  const k=cl(t/fin), paso=k<.15?suave(k/.15)*.15*.5:(k>.85?1-suave((1-k)/.15)*.15*.5:.075+(k-.15)/.7*.85);
  esc.scrollLeft=Math.round(TR.desde+(TR.hasta-TR.desde)*paso);
  esc.dispatchEvent(new Event('scroll'));
  // El reloj de la página avanza un cuadro por cuadro de video (mismo dt que un teléfono a 30).
  const pasos=ultimo<0?1:Math.max(1,Math.round((t-ultimo)*30)); ultimo=t;
  for(let i=0;i<pasos;i++) window.__avanzar(1000/30);
  TR.lineas.forEach(([a,b],i)=>ver($('#l'+i),t,a,b));
  $('#cartel').style.opacity=TR.cartel!==undefined&&t>=TR.cartel?1:0;
};`;
}

// Con FOTOS, se mira un solo tramo (TRAMO=0 por defecto), antes de grabar todo.
const elegidos = process.env.FOTOS ? [TRAMOS[Number(process.env.TRAMO ?? 0)]] : TRAMOS;
const videos = [];
for (const [i, tr] of elegidos.entries()) {
  const video = `${T}/tramo-${i}.mp4`;
  await grabar({
    url: `${SITIO}/redondopedia/bestiario/${tr.region}/`,
    virtual: true,
    duracion: tr.dura,
    salida: video,
    antes: async (page) => {
      await page.evaluate((css, capa, js) => {
        const s = document.createElement('style'); s.textContent = css; document.head.append(s);
        document.body.insertAdjacentHTML('beforeend', capa);
        // Que la página arranque su reloj y se asiente antes del primer cuadro.
        for (let i = 0; i < 45; i++) window.__avanzar(1000 / 30);
        (0, eval)(js);
      }, css(tr.tinta), capa(tr), js(tr));
      await page.evaluate(() => document.fonts.ready);
    },
  });
  videos.push(video);
}

// Los tramos, uno detrás del otro: mismo tamaño y mismos cuadros, se pegan sin recodificar.
const lista = `${T}/lista.txt`;
const { writeFileSync } = await import('node:fs');
writeFileSync(lista, videos.map((v) => `file '${v.replace(/\\/g, '/')}'`).join('\n'));
const video = `${T}/video.mp4`;
await correr(FFMPEG, ['-y', '-f', 'concat', '-safe', '0', '-i', lista, '-c', 'copy', video]);

// El sonido: un recorte por región, lejos y apagado, que se cruza en el corte de una a la otra.
const total = TRAMOS.reduce((s, tr) => s + tr.dura, 0);
const entradas = TRAMOS.flatMap((tr) => ['-i', `${REPO}/public/audio/fragmentos/${tr.suena}.mp3`]);
let inicio = 0;
const capas = TRAMOS.map((tr, i) => {
  const ms = Math.round(Math.max(0, inicio - 0.4) * 1000);
  const largo = Math.min(10, tr.dura + 0.4);
  inicio += tr.dura;
  return `[${i}:a]atrim=0:${largo},asetpts=PTS-STARTPTS,lowpass=f=900,lowpass=f=900,aecho=0.8:0.7:120|260:0.35|0.2,afade=t=in:d=0.8,afade=t=out:st=${largo - 1.2}:d=1.2,adelay=${ms}|${ms}[r${i}]`;
});
const filtro = `${capas.join(';')};anullsrc=r=44100:cl=stereo,atrim=0:${total}[silencio];[silencio]${TRAMOS.map((_, i) => `[r${i}]`).join('')}amix=inputs=${TRAMOS.length + 1}:normalize=0:duration=first,volume=1.4,alimiter=limit=0.9[out]`;
const audio = `${T}/audio.m4a`;
await correr(FFMPEG, ['-y', ...entradas, '-filter_complex', filtro, '-map', '[out]', '-ac', '2', '-c:a', 'aac', '-b:a', '192k', audio]);
await juntar(video, audio, DESTINO);
console.log(`listo: ${DESTINO}`);
