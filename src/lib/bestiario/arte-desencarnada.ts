/**
 * La bella señora desencarnada (`D-73`, vigésima vuelta), esperando al costado de la ruta.
 *
 * *"Esperando allí nomás, en el camino, la bella señora está desencarnada"* es de *Juguetes perdidos*, el
 * tema que cierra *Luzbelito* (1996). Por eso viste el interior de ese disco, medido con sharp: el vestido
 * es la tierra roja, los guantes el cielo violeta, el velo las nubes, la calavera el yeso del busto, las
 * perlas los huevos que hay tirados en la tierra; y el día que se le viene en el corazón es el resplandor
 * del horizonte de esa misma tapa.
 *
 * De la letra son la espera en el camino, que está desencarnada, el día que se viene en el corazón cuando
 * la noche es más oscura, las banderas rojas, negras y de lienzo blanco en el corazón, y las sedas que
 * guardan nombres. Del dibujo, todo lo demás: la mantilla con la peineta, los guantes largos, la cartera de
 * perla, el pañuelo con los nombres bordados, y el rouge que se pone igual, en los dientes.
 *
 * Coordenadas: el (0, 0) es el piso entre los pies (`rig-desencarnada.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, soplo, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { caja, cajaRedonda, conGrano, curva, elipse, poli, type P } from './trazos.ts';
import { EL_DIA, QUIETO, SENORA, SENORA_ARMADO as A, marcas, type Momento } from './rig-desencarnada.ts';

/** Las tintas del interior de *Luzbelito* (`tokens.css`). */
const C = {
  violeta: 'var(--bestia-desencarnada-violeta)',
  violetaClara: 'var(--bestia-desencarnada-violeta-clara)',
  tierra: 'var(--bestia-desencarnada-tierra)',
  tierraClara: 'var(--bestia-desencarnada-tierra-clara)',
  tierraHonda: 'var(--bestia-desencarnada-tierra-honda)',
  perla: 'var(--bestia-desencarnada-perla)',
  perlaClara: 'var(--bestia-desencarnada-perla-clara)',
  nube: 'var(--bestia-desencarnada-nube)',
  nubeSombra: 'var(--bestia-desencarnada-nube-sombra)',
  yeso: 'var(--bestia-desencarnada-yeso)',
  yesoClaro: 'var(--bestia-desencarnada-yeso-claro)',
  cobre: 'var(--bestia-desencarnada-cobre)',
  alba: 'var(--bestia-desencarnada-alba)',
  albaClara: 'var(--bestia-desencarnada-alba-clara)',
};

/* ------------------------------------------------------------------
   El vestido de seda: la pollera larga y el corpiño
   ------------------------------------------------------------------ */

const POLLERA: readonly P[] = [[-20, -172], [20, -172], [30, -120], [44, -60], [60, -6], [40, 4], [10, 0], [-14, 4], [-42, 2], [-62, -6], [-46, -60], [-32, -120]];

function pollera(): string {
  const d = curva(POLLERA);
  // La seda: pliegues largos que agarran la luz de los faros de la ruta en el lomo y se hunden en la tierra honda.
  const pliegues = [-38, -22, -6, 10, 26, 42].map((x, i) => nube(x * 0.9, -70, 4, 70, i % 2 ? C.tierraHonda : C.tierraClara, 's', i % 2 ? 0.85 : 0.65, x * 0.18)).join('');
  return conGrano(
    nube(0, 2, 70, 8, C.tierraHonda, 's', 0.7) +
    enmascarado('m-des-pollera', d,
      forma(d, C.tierra) + pliegues +
      // El brillo violeta de la seda, que viene del cielo de la tapa, y el ruedo que se arrastra en la banquina.
      nube(-20, -110, 16, 50, C.violetaClara, 'm', 0.6) + nube(30, -40, 20, 40, C.violeta, 'm', 0.55) + nube(0, -4, 70, 10, C.tierraHonda, 'm', 0.85)) +
    trazo('M-60 -6 Q-30 6 0 0 Q30 6 58 -6', C.tierraClara, 1.2, 0.5),
  );
}

function torso(): string {
  const d = curva([[-18, -170], [18, -170], [24, -200], [26, -226], [14, -232], [6, -222], [0, -218], [-6, -222], [-14, -232], [-26, -226], [-24, -200]]);
  // Desencarnada: arriba del escote, las clavículas y el esternón de yeso.
  const huesos = trazo('M-22 -232 Q-10 -228 -2 -232 M22 -232 Q10 -228 2 -232', C.yeso, 2.6) + trazo('M0 -232 L0 -222', C.yeso, 2.2) + [-1, 1].map((s) => trazo(`M${s * 3} ${-228} q${s * 6} 2 ${s * 10} 0`, C.yesoClaro, 0.8, 0.7)).join('');
  // Las banderas en el corazón: un broche con tres banderitas, roja, negra y de lienzo blanco.
  const [hx, hy] = A.corazon;
  const bandera = (dx: number, color: string): string => trazo(`M${hx + dx} ${hy - 2} l0 -12`, C.perla, 0.8) + forma(poli([[hx + dx, hy - 14], [hx + dx + 7, hy - 12], [hx + dx, hy - 9]]), color);
  return conGrano(
    enmascarado('m-des-torso', d, forma(d, C.tierra) + nube(-10, -210, 10, 14, C.tierraClara, 'm', 0.6) + nube(16, -186, 10, 20, C.tierraHonda, 'm', 0.85) + nube(hx, hy, 8, 8, C.cobre, 's', 0.5)) +
    huesos + bandera(-4, C.cobre) + bandera(0, C.tierraHonda) + bandera(4, C.nube) + forma(elipse(hx, hy, 2.4, 2.4), C.perlaClara) +
    // La cintura, ceñida con una faja.
    forma(caja(-20, -176, 40, 7), C.tierraHonda) + nube(-6, -174, 8, 2, C.violetaClara, 'xs', 0.5),
  );
}

/* ------------------------------------------------------------------
   Los brazos con los guantes largos, y la cartera de perla
   ------------------------------------------------------------------ */

function brazo(n: 0 | 1): string {
  const [sx, sy] = A.hombros[n];
  const [hx, hy] = A.manos[n];
  const s = n === 0 ? -1 : 1;
  // Desde el hombro baja el húmero de yeso, y desde arriba del codo, el guante largo del violeta del cielo.
  const codo: P = [sx + s * 6, sy + 40];
  const hueso = trazo(`M${sx} ${sy + 2} L${codo[0]} ${codo[1] - 4}`, C.yeso, 5) + trazo(`M${sx - s} ${sy + 4} L${codo[0] - s} ${codo[1] - 8}`, C.yesoClaro, 1.2, 0.7) + forma(elipse(sx, sy + 1, 5, 4), C.yeso);
  const guante = curva([[codo[0] - 6, codo[1] - 8], [codo[0] + 6, codo[1] - 8], [hx + 6, hy - 4], [hx + 5, hy + 8], [hx - 1, hy + 12], [hx - 6, hy + 6], [hx - 5, hy - 4]]);
  return conGrano(
    hueso +
    enmascarado(`m-des-guante-${n}`, guante, forma(guante, C.violeta) + nube(codo[0] - s * 3, codo[1] + 10, 4, 20, C.violetaClara, 'm', 0.7) + nube(hx + s * 3, hy + 4, 5, 6, C.tierraHonda, 's', 0.7)) +
    trazo(`M${codo[0] - 6} ${codo[1] - 8} l12 0`, C.perla, 1.4, 0.8),
  );
}

/** La cartera de perla, colgando de la mano 1 de la cadenita. */
function cartera(): string {
  const [hx, hy] = A.manos[0];
  const [bx, by] = [hx - 2, hy + 30];
  const d = curva([[bx - 13, by - 6], [bx + 13, by - 6], [bx + 15, by + 10], [bx, by + 14], [bx - 15, by + 10]]);
  return conGrano(
    trazo(`M${hx - 2} ${hy + 8} L${bx - 9} ${by - 6} M${hx + 2} ${hy + 8} L${bx + 9} ${by - 6}`, C.perlaClara, 0.9) +
    enmascarado('m-des-cartera', d, forma(d, C.perla) + nube(bx - 5, by - 2, 7, 4, C.perlaClara, 's', 0.9) + nube(bx + 7, by + 8, 7, 5, C.tierraHonda, 's', 0.6) +
      [-8, -3, 2, 7].map((dx) => forma(elipse(bx + dx, by + 3, 1.6, 1.6), C.perlaClara)).join('')) +
    forma(cajaRedonda(bx - 4, by - 9, 8, 4, 1.4), C.yeso) + nube(bx - 1, by - 8, 2, 1, C.yesoClaro, 'xs', 0.9),
  );
}

/* ------------------------------------------------------------------
   La cabeza: la calavera, la peineta y la mantilla
   ------------------------------------------------------------------ */

const CRANEO: readonly P[] = [[0, -296], [14, -290], [19, -274], [16, -258], [9, -250], [6, -244], [-6, -244], [-9, -250], [-16, -258], [-19, -274], [-14, -290]];

function calavera(): string {
  const d = curva(CRANEO);
  const [cx, cy] = A.cara;
  const cuenca = ([x, y]: P): string => forma(curva([[x - 5, y - 3], [x + 5, y - 4], [x + 6, y + 2], [x, y + 5], [x - 6, y + 2]]), C.tierraHonda) + nube(x, y, 3, 2, C.violeta, 'xs', 0.6);
  // Los dientes, pintados de rouge: es bella, y se arregla igual.
  const dientes = Array.from({ length: 6 }, (_, i) => forma(cajaRedonda(cx - 7.5 + i * 2.6, cy + 12, 2.2, 4, 0.8), C.perla)).join('');
  const rouge = trazo(`M${cx - 8} ${cy + 12} Q${cx} ${cy + 10.4} ${cx + 8} ${cy + 12}`, C.cobre, 1.6) + trazo(`M${cx - 7} ${cy + 16.4} Q${cx} ${cy + 17.6} ${cx + 7} ${cy + 16.4}`, C.cobre, 1.4);
  const adentro =
    forma(d, C.yeso) + nube(cx - 6, cy - 12, 10, 10, C.yesoClaro, 'm', 0.85) + nube(cx + 12, cy + 2, 6, 14, C.nubeSombra, 'm', 0.8) + nube(cx, cy + 10, 14, 6, C.nubeSombra, 's', 0.6) +
    A.cuencas.map(cuenca).join('') +
    // La nariz, un agujero en corazón dado vuelta.
    forma(poli([[cx, cy + 2], [cx - 2.6, cy + 7], [cx + 2.6, cy + 7]]), C.tierraHonda) +
    dientes + rouge +
    trazo(`M${cx - 14} ${cy - 2} q2 6 4 8 M${cx + 14} ${cy - 2} q-2 6 -4 8`, C.nubeSombra, 0.8, 0.7);
  // Los aros de perla, colgando.
  const aros = [-1, 1].map((s) => trazo(`M${cx + s * 18} ${cy - 2} l0 6`, C.perlaClara, 0.7) + forma(elipse(cx + s * 18, cy + 7, 2.2, 2.8), C.perlaClara) + nube(cx + s * 18 - 0.6, cy + 6, 0.8, 1, C.nube, 'xs', 0.9)).join('');
  // El cuello: las vértebras de yeso, una arriba de la otra.
  const vertebras = [-246, -240, -234].map((y) => forma(cajaRedonda(-4, y, 8, 5, 2), C.yeso) + trazo(`M-4 ${y + 5} l8 0`, C.nubeSombra, 0.8)).join('');
  return conGrano(vertebras + enmascarado('m-des-craneo', d, adentro) + aros);
}

/** La luz que se le prende en las cuencas cuando se viene el día. */
function cuencas(): string {
  return A.cuencas.map(([x, y]) => nube(x, y, 5, 4, C.alba, 's', 0.9) + forma(elipse(x, y + 0.5, 1.3, 1.3), C.albaClara)).join('');
}

/** La peineta, alta, de carey, detrás de la mantilla. */
function peineta(): string {
  const [kx, ky] = A.coronilla;
  const d = curva([[kx - 20, ky + 4], [kx - 18, ky - 10], [kx - 8, ky - 22], [kx, ky - 26], [kx + 8, ky - 22], [kx + 18, ky - 10], [kx + 20, ky + 4]]);
  const calado = [-10, -3, 4, 11].map((dx) => forma(elipse(kx + dx * 0.9, ky - 8 - Math.abs(dx) * -0.2, 2, 4), C.tierra)).join('');
  return conGrano(enmascarado('m-des-peineta', d, forma(d, C.tierraHonda) + nube(kx - 6, ky - 14, 6, 6, C.tierraClara, 's', 0.6) + calado));
}

/** La mantilla: encaje blanco como las nubes de la tapa, que cae de la peineta y tapa la cara. */
function velo(): string {
  const [kx, ky] = A.coronilla;
  const d = curva([[kx, ky - 18], [kx + 22, ky - 10], [kx + 30, ky + 20], [kx + 38, ky + 60], [kx + 40, ky + 90], [kx + 24, ky + 84], [kx + 8, ky + 92], [kx - 8, ky + 86], [kx - 24, ky + 92], [kx - 40, ky + 86], [kx - 36, ky + 58], [kx - 30, ky + 20], [kx - 22, ky - 10]]);
  // El encaje: florcitas caladas, chicas y un poco corridas, como hechas a mano; y el borde festoneado.
  let encaje = '';
  for (let fila = 0; fila < 9; fila++) {
    for (let i = -4; i <= 4; i++) {
      const j = Math.sin(fila * 12.9 + i * 78.2) * 1.6;
      const [x, y] = [kx + i * 8 + (fila % 2) * 4 + j, ky + 4 + fila * 9.6 - j * 0.6];
      encaje += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.5" fill="none" stroke="${C.perlaClara}" stroke-width="0.5" opacity="0.4"/>`;
      if ((fila + i) % 3 === 0) encaje += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="0.5" fill="${C.nube}" opacity="0.5"/>`;
    }
  }
  const festones = Array.from({ length: 9 }, (_, i) => {
    const x = kx - 38 + i * 9.5;
    const y = ky + 88 - (i % 2) * 4;
    return `<path d="M${x - 4.5} ${y} q4.5 6 9 0" fill="none" stroke="${C.nube}" stroke-width="1.4" opacity="0.9"/>`;
  }).join('');
  return (
    `<g opacity="0.72">` +
    enmascarado('m-des-velo', d, forma(d, C.nube, 0.82) + nube(kx - 14, ky + 10, 16, 30, C.nube, 'm', 0.6) + nube(kx + 26, ky + 50, 14, 40, C.nubeSombra, 'm', 0.6) + nube(kx, ky + 28, 18, 14, C.perla, 's', 0.35) + encaje) +
    festones + `</g>`
  );
}

/** El pañuelo de seda anudado al cuello, con los nombres bordados en las puntas que flamean. */
function panuelo(): string {
  const [nx, ny] = A.nudo;
  // Las dos puntas de seda cuelgan del nudo, una más larga, y se las lleva el viento de los fierros.
  const punta = (dx: number, largo: number, ancho: number): string =>
    curva([[nx - ancho * 0.5, ny + 1], [nx + ancho * 0.5, ny], [nx + dx + ancho * 0.6, ny + largo * 0.6], [nx + dx + ancho * 0.4, ny + largo], [nx + dx - ancho * 0.5, ny + largo - 2], [nx + dx * 0.4 - ancho * 0.5, ny + largo * 0.5]]);
  // Los nombres bordados, que no se leen: el pañuelo los guarda.
  const nombres = (dx: number, largo: number): string => trazo(`M${nx + dx * 0.5 - 1} ${ny + largo * 0.45} q1.4 -1.2 2.6 0 t2.6 0 M${nx + dx * 0.8 - 1} ${ny + largo * 0.72} q1.2 -1 2.2 0 t2.2 0`, C.alba, 0.6, 0.9);
  return conGrano(
    enmascarado('m-des-panuelo-1', punta(10, 30, 7), forma(punta(10, 30, 7), C.violetaClara) + nube(nx + 4, ny + 10, 3, 8, C.perlaClara, 's', 0.45) + nube(nx + 10, ny + 24, 4, 6, C.violeta, 's', 0.7)) + nombres(10, 30) +
    enmascarado('m-des-panuelo-2', punta(16, 22, 6), forma(punta(16, 22, 6), C.violeta) + nube(nx + 10, ny + 12, 3, 6, C.violetaClara, 's', 0.5)) + nombres(16, 22) +
    forma(elipse(nx, ny, 4, 3.4), C.violetaClara) + nube(nx - 1, ny - 1, 1.6, 1.2, C.perlaClara, 'xs', 0.7),
  );
}

/** El día que se viene en el corazón: el resplandor del horizonte de la tapa, que crece desde el pecho. */
function dia(): string {
  const [hx, hy] = A.corazon;
  return nube(hx, hy, 90, 90, C.alba, 'xl', 0.5) + nube(hx, hy, 40, 40, C.albaClara, 'l', 0.7) + nube(hx, hy, 12, 12, C.albaClara, 's', 0.95) +
    soplo(Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * Math.PI * 2;
      return `M${hx} ${hy} L${hx + Math.cos(a + 0.05) * 70} ${hy + Math.sin(a + 0.05) * 70} L${hx + Math.cos(a - 0.05) * 70} ${hy + Math.sin(a - 0.05) * 70} Z`;
    }).join(' '), C.albaClara, 's', 0.5);
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 3.4;
const [KX, KY] = A.coronilla;
const [HX, HY] = A.corazon;
const [M1x, M1y] = A.manos[0];
const [M2x] = A.manos[1];

export const PIEZAS_DESENCARNADA: readonly Pieza[] = [
  { nombre: 'desencarnada-pollera', caja: [-72, -180, 144, 192], dibujo: pollera(), densidad: D * 0.8 },
  { nombre: 'desencarnada-torso', caja: [-32, -248, 64, 84], dibujo: torso(), densidad: D },
  { nombre: 'desencarnada-panuelo', caja: [A.nudo[0] - 8, A.nudo[1] - 6, 34, 42], dibujo: panuelo(), densidad: D },
  { nombre: 'desencarnada-peineta', caja: [KX - 24, KY - 30, 48, 38], dibujo: peineta(), densidad: D },
  { nombre: 'desencarnada-calavera', caja: [-24, -300, 48, 70], dibujo: calavera(), densidad: D * 1.4 },
  { nombre: 'desencarnada-cuencas', caja: [-14, -280, 28, 12], dibujo: cuencas(), densidad: D * 1.4 },
  { nombre: 'desencarnada-velo', caja: [KX - 46, KY - 22, 92, 120], dibujo: velo(), densidad: D },
  { nombre: 'desencarnada-dia', caja: [HX - 120, HY - 120, 240, 240], dibujo: dia(), densidad: 1 },
  { nombre: 'desencarnada-brazo-1', caja: [M1x - 14, A.hombros[0][1] - 10, 34, 100], dibujo: brazo(0), densidad: D },
  { nombre: 'desencarnada-cartera', caja: [M1x - 22, M1y + 4, 36, 46], dibujo: cartera(), densidad: D * 1.2 },
  { nombre: 'desencarnada-brazo-2', caja: [M2x - 18, A.hombros[1][1] - 10, 34, 96], dibujo: brazo(1), densidad: D },
];

const img = imagenesDe(PIEZAS_DESENCARNADA);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** La señora armada con las marcas de un momento. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  return (
    `<ellipse cx="0" cy="2" rx="58" ry="9" class="bt-desencarnada-sombra"/>` +
    parte('pollera', img('desencarnada-pollera'), t.pollera) +
    parte('torso',
      img('desencarnada-torso') +
      parte('panuelo', img('desencarnada-panuelo'), t.panuelo) +
      parte('cabeza',
        img('desencarnada-peineta') + img('desencarnada-calavera') +
        parte('cuencas', img('desencarnada-cuencas'), '', o.cuencas) +
        parte('velo', img('desencarnada-velo'), t.velo),
        t.cabeza) +
      parte('dia', img('desencarnada-dia'), t.dia, o.dia) +
      parte('brazo-1', img('desencarnada-brazo-1') + img('desencarnada-cartera'), t['brazo-1']) +
      parte('brazo-2', img('desencarnada-brazo-2'), t['brazo-2']),
      t.torso)
  );
}

/** La señora en un momento, sin lo que la hace tocable: para el test, el retrato y para mirarla. */
export function desencarnadaEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/** El títere que se toca, en la pose quieta: esperando, con el velo caído. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--desencarnada" data-id="la-bella-senora-desencarnada" role="button" tabindex="0" aria-label="${nombres.get('la-bella-senora-desencarnada') ?? 'La bella señora desencarnada'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: con el velo levantado y el día en el pecho, al costado de la ruta. */
export const RETRATO = { caja: [SENORA.x - 70, SENORA.piso - 200, 140, 210] as const };
function retrato(): string {
  const fondo = (nombre: string): string => `<image href="/bestiario/${nombre}.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>`;
  return fondo('ruta-lejos') + fondo('ruta-piso') + desencarnadaEn(EL_DIA);
}

export const DESENCARNADA: Personaje = {
  id: 'la-bella-senora-desencarnada',
  region: 'la-ruta',
  ancla: SENORA.x,
  piezas: PIEZAS_DESENCARNADA,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
