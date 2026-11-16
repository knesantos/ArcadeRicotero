// Reel — El duelo: el lobo y el cordero juegan la misma partida de "Adiviná el tema". El lobo muerde
// rápido y erra dos veces; el cordero cierra los ojos, escucha y la saca, y el acierto le corta la soga.
// Se arma de cero con los recortes de las dos tapas (`titeres.ts`) y el monte impreso; nadie se nombra:
// se reconocen por la tapa de la que salieron.
import { CSS_BASE, JS_BASE, cartel, datos, estilosDeTiteres } from './comun.mjs';
import { CSS_JUEGO, jsJuego, markupJuego, mezclar, ruidos } from './juego.mjs';
import { FFMPEG, FPS, REPO, correr, grabar, juntar, trabajo } from './motor.mjs';
import { lobo, cordero, imagen } from '../../src/lib/bestiario/titeres.ts';
import { ARMADO } from '../../src/lib/bestiario/recortes.ts';
import { ACECHO, ESCALA_CORDERO, ESCALA_LOBO, PALO } from '../../src/lib/bestiario/rig.ts';

const DESTINO = process.argv[2];
if (!DESTINO) throw new Error('Uso: npm run reels -- duelo <destino.mp4>');
const T = trabajo();
const DURACION = 20.5;
const TEMA = 'todo-un-palo';
const titulo = datos('adivinar-tema.json').fragmentos.find((f) => f.slug === TEMA).titulo;
const CARA_LOBO = '/bestiario/lobo-real-cabeza.webp';
const CARA_CORDERO = '/bestiario/cordero-real-cabeza.webp';

const PASOS = [{ paso: 0, t: 1.9 }, { paso: 1, t: 3.5 }, { paso: 2, t: 5.6 }];
const INTENTOS = [
  { texto: 'Jijiji', desde: 2.15, tipea: 0.45, arriesga: 2.8, bien: false, paso: 0, quien: CARA_LOBO },
  { texto: 'Juguetes perdidos', desde: 3.75, tipea: 0.7, arriesga: 4.75, bien: false, paso: 1, quien: CARA_LOBO },
  { texto: titulo, desde: 7.9, tipea: 1.3, arriesga: 9.5, bien: true, paso: 2, quien: CARA_CORDERO },
];
const [E1, E2] = INTENTOS.slice(0, 2).map((i) => i.arriesga + 0.2);
const A = INTENTOS[2].arriesga + 0.2;
const CARTEL = 15.5;
const SALTOS = [A, A + 1.5, A + 2.7];

const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const suave = (x) => { const k = cl(x); return k * k * (3 - 2 * k); };
const rampa = (t, a, b) => suave((t - a) / (b - a));
const meseta = (t, a, b, c, d) => Math.min(rampa(t, a, b), 1 - rampa(t, c, d));
const f = (v) => (+v).toFixed(2);
const AL = ARMADO.lobo;
const AC = ARMADO.cordero;
const rot = (ang, [px, py], mas = '') => `${mas}rotate(${f(ang)} ${px} ${py})`;
const parpado = ([cx, cy], [, ry], k) => `translate(${cx} ${cy - ry}) scale(1 ${f(k)}) translate(${-cx} ${-(cy - ry)})`;
const ciego = (t, lista) => (lista.some((p) => t > p && t < p + 0.15) ? 1 : 0);

/** Todo lo que se mueve en un cuadro: atributos por id de elemento. */
function cuadro(t) {
  const a = {};
  /* El lobo: sube desde atrás del monte, se apura, erra, se hunde. */
  const sube = rampa(t, 0.5, 1.6);
  const baja = 0.28 * rampa(t, E2, E2 + 0.5);
  const seVa = rampa(t, A + 0.25, A + 1.1);
  const alzado = cl(sube - baja - seVa * 0.8, 0, 1);
  const lx = 318;
  const ly = ACECHO.piso + (1 - alzado) * ACECHO.hundido - 34 * alzado;
  a.lobo = { transform: `translate(${lx} ${f(ly)}) scale(${ESCALA_LOBO}) translate(${-AL.piso[0]} ${-AL.piso[1]})` };
  const aire = Math.sin(t * (t > 5.6 && t < A ? 4.2 : 1.8));
  a['lobo-pecho'] = { transform: `translate(${AL.piso[0]} ${AL.piso[1]}) scale(1 ${f(1 + aire * 0.018)}) translate(${-AL.piso[0]} ${-AL.piso[1]})` };
  // Cada error: sacude la cabeza como quien se saca una mosca; después la cabeza gacha y la impaciencia.
  let ladeo = 3 + Math.sin(t * 0.7) * 1.2;
  for (const e of [E1, E2]) { const s = meseta(t, e, e + 0.05, e + 0.45, e + 0.6); ladeo += Math.sin(t * 34) * 9 * s; }
  ladeo += 6 * rampa(t, E2 + 0.3, E2 + 0.8) * (1 - rampa(t, 5.6, 6));
  if (t > 5.6 && t < A) ladeo += Math.sin(t * 5.5) * 4;
  ladeo += Math.sin(t * 30) * 7 * meseta(t, A + 0.2, A + 0.3, A + 0.7, A + 0.9);
  a['lobo-cabeza'] = { transform: rot(ladeo, AL.cabeza, `translate(0 ${f(-aire * 5)}) `) };
  const entorna = Math.max(ciego(t, [1.2, 6.4, 8.8]), 0.5 * rampa(t, E2, E2 + 0.3) * (1 - rampa(t, 5.6, 5.9)), 0.35 * meseta(t, E1, E1 + 0.1, E1 + 0.5, E1 + 0.7));
  a['lobo-p1'] = { transform: parpado(AL.ojos[0].centro, AL.ojos[0].radio, entorna) };
  a['lobo-p2'] = { transform: parpado(AL.ojos[1].centro, AL.ojos[1].radio, entorna) };

  /* El cordero: pasta, levanta la cabeza cuando suena, cierra los ojos para escuchar, acierta y salta. */
  let salto = 0;
  for (const s of SALTOS) { const u = (t - s) / 0.55; if (u > 0 && u < 1) salto = Math.max(salto, Math.sin(u * Math.PI) * (s === A ? 34 : 18)); }
  const anda = rampa(t, A + 0.6, A + 1.0) * (1 - rampa(t, A + 3.4, A + 3.8));
  const cx = 520 + 70 * rampa(t, A + 0.6, A + 3.6);
  const cy = 424 - salto;
  const s = ESCALA_CORDERO * 1.08;
  const mira = 1;
  a.cordero = { transform: `translate(${f(cx)} ${f(cy)}) scale(${f(mira * s)} ${f(s)}) translate(${-AC.piso[0]} ${-AC.piso[1]})` };
  const pasta = t < PASOS[0].t - 0.1 ? 1 : 0;
  const atento = Math.max(...PASOS.map((p) => meseta(t, p.t - 0.15, p.t, p.t + 1.2, p.t + 1.6)));
  const cab = pasta ? 6 + Math.sin(t * 3) * 1.5 : -5 * atento + Math.sin(t * 0.8) * 2 + (salto > 0 ? -10 : 0);
  a['cordero-cabeza'] = { transform: rot(cab, AC.cabeza) };
  const patas = (salto > 0 ? 14 : 0) + Math.sin(t * 11) * 10 * anda;
  a['cordero-pata-tras'] = { transform: rot(patas, AC['pata-tras']) };
  a['cordero-pata-del'] = { transform: rot(-patas, AC['pata-del']) };
  a['cordero-cuerpo'] = { transform: `translate(${AC.piso[0]} 700) scale(1 ${f(1 + Math.sin(t * 2.2) * 0.012)}) translate(${-AC.piso[0]} -700)` };
  const escucha = meseta(t, 5.75, 6.0, 7.6, 7.8);
  const cierra = Math.max(escucha, ciego(t, [0.7, 3.2, 12.6]));
  a['cordero-p1'] = { transform: parpado(AC.ojos[0].centro, AC.ojos[0].radio, cierra) };
  a['cordero-p2'] = { transform: parpado(AC.ojos[1].centro, AC.ojos[1].radio, cierra) };

  /* La soga: del palo al cogote, hasta que el acierto la corta; las dos puntas caen. */
  const ax = PALO.x, ay = PALO.y - 46;
  const nx = cx + (AC.nudo[0] - AC.piso[0]) * mira * s;
  const ny = cy + (AC.nudo[1] - AC.piso[1]) * s;
  if (t < A + 0.05) {
    a.soga = { d: `M${ax} ${ay} Q${f((ax + nx) / 2)} ${f((ay + ny) / 2 + 6)} ${f(nx)} ${f(ny)}`, opacity: 1 };
    a.cola = { opacity: 0 };
  } else {
    const k = rampa(t, A + 0.05, A + 0.6);
    const mx = ax + 26 - 12 * k, my = ay + 10 + 36 * k;
    a.soga = { d: `M${ax} ${ay} Q${f(ax + 18 - 10 * k)} ${f(ay + 8 + 20 * k)} ${f(mx)} ${f(my)}`, opacity: 1 };
    // La punta que queda en el cogote cuelga y se va con el cordero.
    a.cola = { d: `M${f(nx)} ${f(ny)} q${f(-8 * mira)} 10 ${f(-12 * mira)} ${f(22 * k + 4)}`, opacity: 1 };
  }

  /* La cámara: el claro entero; se arrima al cordero cuando escucha y lo sigue cuando sale. */
  const cerca = meseta(t, 5.6, 6.4, A + 0.3, A + 1.2);
  const w = 470 - 110 * cerca;
  let vx = 440 + 75 * cerca + 50 * rampa(t, A + 0.8, A + 3.8);
  let vy = 318 + 62 * cerca;
  for (const e of [E1, E2]) { const u = t - e; if (u > 0 && u < 0.3) vx += Math.sin(u * 120) * 5 * (1 - u / 0.3); }
  return { a, vista: [vx - w / 2, vy - (w * 270) / 332 / 2, w, (w * 270) / 332].map(f).join(' ') };
}

const cuadros = Array.from({ length: Math.round(DURACION * FPS) }, (_, i) => cuadro(i / FPS));

const css = `
${estilosDeTiteres()}
.logo{top:14px;left:14px;width:40px}
#canta{position:absolute;left:66px;right:14px;top:10px;height:44px;display:flex;align-items:center}
#canta p{position:absolute;font-family:var(--fuente-rotulada);font-size:1.05rem;line-height:1.1;color:var(--texto);opacity:0}
#ventana{position:absolute;left:14px;top:62px;width:332px;height:270px;border:3px solid var(--cat-mitologia);border-radius:3px;overflow:hidden;rotate:.6deg;background:var(--fondo)}
#ventana svg{display:block;width:100%;height:100%}
#ventana::after{content:'';position:absolute;top:-9px;left:36%;width:74px;height:20px;background:color-mix(in srgb,var(--papel) 40%,transparent);rotate:3deg}
#cola{fill:none}
${CSS_JUEGO}
`;

// Los ids van en las piezas que se mueven: el lobo y el cordero vienen de `titeres.ts` tal cual.
const conIds = (svg, quien) => svg
  .replace(/data-parte="(pecho|cabeza|pata-tras|pata-del|cuerpo)"/g, (m, p) => `${m} id="${quien}-${p}"`)
  .replace(/data-parte="parpado-(\d)"/g, (m, n) => `${m} id="${quien}-p${n}"`);

const cuerpo = `
<img class="logo" src="/marca/fr.svg" alt="">
<div id="canta"><p id="c1">¿Vos mordés rápido o escuchás?</p><p id="c2">Cerrá los ojos y escuchá.</p></div>
<div id="ventana"><svg id="escena" viewBox="0 0 900 640" preserveAspectRatio="xMidYMid slice">
${imagen('monte-lejos')}
<g id="lobo">${conIds(lobo(), 'lobo')}</g>
${imagen('monte-cerca')}
<path id="soga" class="bt-trazo-soga" stroke-width="4.5" d=""/>
<g id="cordero">${conIds(cordero(), 'cordero')}</g>
<path id="cola" class="bt-trazo-soga" stroke-width="4.5" d=""/>
${imagen('monte-frente')}
</svg></div>
${markupJuego(INTENTOS)}
${cartel({
  titulo: 'Adiviná el tema',
  fuente: 'var(--fuente-lobo-suelto)',
  color: 'var(--cat-mitologia)',
  canta: 'Escuchá antes de morder.',
  nombra: `${datos('adivinar-tema.json').fragmentos.length} temas, de una décima de segundo para arriba. Gratis y sin cuenta, desde el teléfono.`,
  url: 'fichinricotero.com.ar',
})}`;

const js = `${JS_BASE}
${jsJuego(PASOS, INTENTOS)}
const CUADROS=${JSON.stringify(cuadros)};
const escena=$('#escena');
const els={};
window.__cuadro=t=>{
  const c=CUADROS[Math.min(CUADROS.length-1,Math.round(t*${FPS}))];
  escena.setAttribute('viewBox',c.vista);
  for(const [id,at] of Object.entries(c.a)){const el=els[id]??=document.getElementById(id); if(!el) continue; for(const [k,v] of Object.entries(at)) el.setAttribute(k,v)}
  ver($('#c1'),t,.2,5.3); ver($('#c2'),t,5.6,${A});
  juego(t);
  $('#cartel').style.opacity=t>=${CARTEL}?1:0;
};`;

const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=360,initial-scale=1"><style>${CSS_BASE}${css}</style></head><body>${cuerpo}<script>${js}</script></body></html>`;
const video = `${T}/video.mp4`;
await grabar({ html, local: true, duracion: DURACION, salida: video });

const r = await ruidos(T, correr, FFMPEG);
const teclas = INTENTOS.flatMap((it) => Array.from(it.texto, (_, i) => [r.tecla, it.desde + (i / it.texto.length) * it.tipea, 0.5]));
const golpes = [...teclas, [r.nada, E1], [r.nada, E2], [r.bien, A, 0.8], [r.soga, A + 0.05, 0.9], ...SALTOS.map((s) => [r.salto, s, 0.6])];
const audio = `${T}/audio.m4a`;
await mezclar({ fragmento: `${REPO}/public/audio/fragmentos/${TEMA}.mp3`, pasos: PASOS, sigue: { t: A + 0.3, desde: 2, dura: 8 }, golpes, duracion: DURACION, salida: audio, correr, FFMPEG });
await juntar(video, audio, DESTINO);
console.log(`listo: ${DESTINO}`);
