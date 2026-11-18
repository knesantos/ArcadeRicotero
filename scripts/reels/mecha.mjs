// Reel — La mecha corta: el perro de la mecha juega a "Adiviná el tema" y cada error le quema la cola.
// No se graba el bestiario: la pieza se arma de cero con las piezas impresas del perro y del baldío, y
// la pose de cada cuadro la calcula `marcas()` (`rig-dinamita.ts`), la misma que mueve al títere en el sitio.
// Ningún cartel dice quién es: lo dicen la mecha, el cartucho y el baldío.
import { CSS_BASE, JS_BASE, cartel, datos, estilosDeTiteres } from './comun.mjs';
import { CSS_JUEGO, conToques, jsJuego, markupJuego, mezclar, ruidos, sonidosDeTipeo } from './juego.mjs';
import { FFMPEG, FPS, REPO, correr, grabar, juntar, trabajo } from './motor.mjs';
import { LUGAR, QUIETO, marcas } from '../../src/lib/bestiario/rig-dinamita.ts';
import { dinamitaEn } from '../../src/lib/bestiario/arte-dinamita.ts';
import { explosion } from '../../src/scripts/bestiario/dinamita.ts';

const DESTINO = process.argv[2];
if (!DESTINO) throw new Error('Uso: npm run reels -- mecha <destino.mp4>');
const T = trabajo();
const DURACION = 21;
const TEMA = 'juguetes-perdidos';
const titulo = datos('adivinar-tema.json').fragmentos.find((f) => f.slug === TEMA).titulo;

// La partida: dos errores y el acierto a los 2 segundos.
const PASOS = [{ paso: 0, t: 1.5 }, { paso: 1, t: 3.9 }, { paso: 2, t: 6.4 }];
// Tipea unas letras y toca la sugerencia, como se juega en el teléfono.
const INTENTOS = conToques([
  { texto: 'Jijiji', desde: 2.0, tipea: 0.95, sugiere: 3, arriesga: 3.3, bien: false, paso: 0 },
  { texto: 'Todo un palo', desde: 4.6, tipea: 1.0, sugiere: 4, arriesga: 5.8, bien: false, paso: 1 },
  { texto: titulo, desde: 8.45, tipea: 1.15, sugiere: 4, arriesga: 9.9, bien: true, paso: 2 },
]);
const [E1, E2] = INTENTOS.slice(0, 2).map((i) => i.arriesga + 0.2);
const ACIERTO = INTENTOS[2].arriesga + 0.2;
const CARTEL = 16;

/* ------------------------------------------------------------------ la coreografía del perro */
const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const suave = (x) => { const k = cl(x); return k * k * (3 - 2 * k); };
const rampa = (t, a, b) => suave((t - a) / (b - a));
const meseta = (t, a, b, c, d) => Math.min(rampa(t, a, b), 1 - rampa(t, c, d));
const PARPADEOS = [0.9, 4.4, 7.3, 9.2, 15.4, 17.5];
const FIN_BUM = 6.6;

function momento(t) {
  const m = { ...QUIETO, temblor: [0, 0], pupila: [-0.9, 0.3] };
  // Jadea mirando la pantalla, con la trufa que le late.
  m.respira = Math.sin(t * 11) * 0.6;
  m.boca = 0.24 + 0.1 * Math.sin(t * 11);
  m.fiebre = 0.5 + 0.45 * Math.sin(t * 2.3) ** 2;
  if (PARPADEOS.some((p) => t > p && t < p + 0.13)) m.parpado = 1;

  // Cuando suena, para la oreja y ladea el hocico, escuchando.
  for (const p of PASOS) {
    const e = meseta(t, p.t - 0.2, p.t + 0.1, p.t + 1.4, p.t + 1.9);
    if (e > 0) { m.oreja = QUIETO.oreja + (1 - QUIETO.oreja) * e; m.cabeza = 9 * e; }
  }

  // La mecha: cada error quema un pedazo, y desde el segundo ya no se apaga.
  const quema = (t0, de, a) => de + (a - de) * rampa(t, t0, t0 + 0.6);
  m.mecha = t < E2 ? quema(E1, 1, 0.78) : t < 6.4 ? quema(E2, 0.78, 0.56) : 0.56 - 0.26 * rampa(t, 6.4, ACIERTO);
  const ardiendo = (t >= E1 && t < E1 + 0.7) || (t >= E2 && t < ACIERTO);
  if (ardiendo) m.chispa = { k: 1.05 + 0.3 * Math.sin(t * 61), o: t >= E2 ? 0.85 + 0.15 * Math.sin(t * 23) : 1 };

  // Cada error: el respingo, la oreja aplastada y la boca que se cierra.
  for (const e of [E1, E2]) {
    const golpe = meseta(t, e, e + 0.05, e + 0.35, e + 0.5);
    const susto = meseta(t, e, e + 0.1, e + 1.0, e + 1.4);
    if (golpe > 0) m.temblor = [Math.sin(t * 90) * 3 * golpe, Math.cos(t * 77) * 1.6 * golpe];
    if (susto > 0) { m.oreja = m.oreja + (-1 - m.oreja) * susto; m.boca = 0.04; m.parpado = Math.max(m.parpado, 0.55 * susto); m.cabeza = -6 * susto; }
  }
  // Desde el segundo error se agacha y se mira la cola de reojo; el temblor crece hasta el acierto.
  if (t >= E2 && t < ACIERTO) {
    const miedo = rampa(t, E2, E2 + 0.6);
    m.agacha = 0.3 * miedo + 0.2 * rampa(t, 6.4, ACIERTO);
    const reojo = Math.sin(t * 2.2) > 0.1 ? 1 : 0;
    m.pupila = [-0.9 + 3.1 * reojo, 0.3 - 0.7 * reojo];
    m.pupilaK = 0.75;
    const tiembla = 0.4 + 1.6 * rampa(t, 6.4, ACIERTO);
    if (t > E2 + 0.5) m.temblor = [Math.sin(t * 83) * tiembla, Math.cos(t * 71) * 0.6 * tiembla];
  }
  // El acierto: la mecha llega al cartucho igual, y explota de contento. Se arma tiznado y aúlla.
  // Cuando la explosión termina, la pose sigue de ahí y no vuelve a la de antes: la mecha entera y
  // apagada, el tizne que se le va yendo de a poco, y contento, con la boca abierta.
  if (t >= ACIERTO) {
    const u = 1.4 + t - ACIERTO;
    const e = explosion(Math.min(u, FIN_BUM - 0.01));
    if (u < FIN_BUM) Object.assign(m, Object.fromEntries(Object.entries(e).filter(([, v]) => v !== undefined)));
    else {
      m.mecha = e.mecha;
      m.hollin = Math.max(0, e.hollin - 0.04 * (u - FIN_BUM));
      m.fiebre = 1;
      m.boca = 0.36 + 0.12 * Math.sin(t * 11);
      m.oreja = 0.9;
    }
  }
  return m;
}

/** La cámara: [centro x, centro y, ancho] en el baldío, más el sacudón del estallido. */
function camara(t) {
  const cerca = rampa(t, 6.2, ACIERTO) * (1 - rampa(t, ACIERTO, ACIERTO + 0.25));
  const lejos = meseta(t, ACIERTO, ACIERTO + 0.15, ACIERTO + 1.6, ACIERTO + 2.6);
  let w = 235 - 55 * cerca + 110 * lejos;
  let [x, y] = [762 - 10 * cerca, 552 - 6 * cerca - 40 * lejos];
  const u = t - ACIERTO;
  if (u > 0 && u < 0.9) { const f = (1 - u / 0.9) * 9; x += Math.sin(u * 97) * f; y += Math.cos(u * 83) * f; }
  // Un respingo de cámara en cada error.
  for (const e of [E1, E2]) { const u2 = t - e; if (u2 > 0 && u2 < 0.3) x += Math.sin(u2 * 120) * 4 * (1 - u2 / 0.3); }
  return [x, y, w];
}

const ANCHO = 332, ALTO = 270;
const cuadros = Array.from({ length: Math.round(DURACION * FPS) }, (_, i) => {
  const t = i / FPS;
  const { transform, opacity, d } = marcas(momento(t));
  const [cx, cy, w] = camara(t);
  const h = (w * ALTO) / ANCHO;
  return { transform, opacity, d, vista: [cx - w / 2, cy - h / 2, w, h].map((v) => +v.toFixed(1)).join(' ') };
});

/* ------------------------------------------------------------------ la pieza */
const css = `
${estilosDeTiteres()}
.logo{top:14px;left:14px;width:40px}
#canta{position:absolute;left:66px;right:14px;top:10px;height:44px;display:flex;align-items:center}
#canta p{position:absolute;font-family:var(--fuente-rotulada);font-size:1.05rem;line-height:1.1;color:var(--texto);opacity:0}
#ventana{position:absolute;left:14px;top:62px;width:${ANCHO}px;height:${ALTO}px;border:3px solid var(--cat-mitologia);border-radius:3px;overflow:hidden;rotate:-.6deg;background:var(--fondo)}
#ventana svg{display:block;width:100%;height:100%}
#ventana::after{content:'';position:absolute;top:-9px;left:40%;width:74px;height:20px;background:color-mix(in srgb,var(--papel) 40%,transparent);rotate:-3deg}
#blanco{position:absolute;inset:0;background:var(--papel);opacity:0;pointer-events:none}
${CSS_JUEGO}
`;

const cuerpo = `
<img class="logo" src="/marca/fr.svg" alt="">
<div id="canta"><p id="c1">Cada error te quema la mecha.</p><p id="c2">Dos segundos. Ni uno más.</p></div>
<div id="ventana"><svg id="escena" viewBox="0 0 900 640" preserveAspectRatio="xMidYMid slice">
<image href="/bestiario/baldio-lejos.webp" x="0" y="0" width="1500" height="640" preserveAspectRatio="none"/>
<image href="/bestiario/baldio-chapa.webp" x="0" y="284" width="1500" height="42" preserveAspectRatio="none"/>
<g id="perro">${dinamitaEn(QUIETO)}</g>
<image href="/bestiario/baldio-frente.webp" x="0" y="520" width="1500" height="120" preserveAspectRatio="none"/>
</svg><div id="blanco"></div></div>
${markupJuego(INTENTOS)}
${cartel({
  titulo: 'Adiviná el tema',
  fuente: 'var(--fuente-lobo-suelto)',
  color: 'var(--cat-mitologia)',
  canta: 'Sacala antes de que te explote.',
  nombra: `${datos('adivinar-tema.json').fragmentos.length} temas, de una décima de segundo para arriba. Gratis y sin cuenta, desde el teléfono.`,
  url: 'fichinricotero.com.ar',
})}`;

const js = `${JS_BASE}
${jsJuego(PASOS, INTENTOS)}
const CUADROS=${JSON.stringify(cuadros)};
const perro=$('#perro'), escena=$('#escena');
const piezas={};
perro.querySelectorAll('[data-parte]').forEach(el=>{(piezas[el.dataset.parte]??=[]).push(el)});
const entero=perro.firstElementChild;
window.__cuadro=t=>{
  const c=CUADROS[Math.min(CUADROS.length-1,Math.round(t*${FPS}))];
  escena.setAttribute('viewBox',c.vista);
  for(const [k,v] of Object.entries(c.transform)){ if(k==='entero') entero.setAttribute('transform',v); else piezas[k]?.forEach(el=>el.setAttribute('transform',v)); }
  for(const [k,v] of Object.entries(c.opacity)) piezas[k]?.forEach(el=>el.setAttribute('opacity',v));
  for(const [k,v] of Object.entries(c.d)) [...(piezas[k]??[]),...(piezas[k+'-trenza']??[])].forEach(el=>el.setAttribute('d',v));
  $('#blanco').style.opacity=t>=${ACIERTO}?.85*(1-cl((t-${ACIERTO})/.22)):0;
  ver($('#c1'),t,.2,6.2); ver($('#c2'),t,6.4,${ACIERTO});
  juego(t);
  $('#cartel').style.opacity=t>=${CARTEL}?1:0;
};`;

const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=360,initial-scale=1"><style>${CSS_BASE}${css}</style></head><body>${cuerpo}<script>${js}</script></body></html>`;
const video = `${T}/video.mp4`;
await grabar({ html, local: true, duracion: DURACION, salida: video });

// El sonido: la escalera del tema, las teclas, el "no era", el acierto y el estallido.
const r = await ruidos(T, correr, FFMPEG);
const golpes = [...sonidosDeTipeo(INTENTOS, r), [r.nada, E1], [r.nada, E2], [r.bien, ACIERTO, 0.8], [r.bum, ACIERTO + 0.02, 1.1]];
const audio = `${T}/audio.m4a`;
await mezclar({ fragmento: `${REPO}/public/audio/fragmentos/${TEMA}.mp3`, pasos: PASOS, sigue: { t: ACIERTO + 0.3, desde: 2, dura: 8 }, golpes, duracion: DURACION, salida: audio, correr, FFMPEG });
await juntar(video, audio, DESTINO);
console.log(`listo: ${DESTINO}`);
