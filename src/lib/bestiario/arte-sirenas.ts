/**
 * Las sirenas (`D-73`, vigesimosegunda vuelta), en el agua del bajo, del lado que da al fuego.
 *
 * *"Gatas lindas, sirenas llenas. Camisa apretada, pezón radioactivo. Reclamando el botín para la prisión"* es
 * de *Barbazul versus el amor letal*, en *Gulp!* (1985). Por eso visten esa tapa, medida con sharp: la piel es
 * el blanco de las manchas de la fotocopia, el pelo la tinta, y las escamas el verde ácido de las letras de
 * *Patricio Rey* escritas a mano, de lo hondo a lo que brilla. Las bocas pintadas, el rojo del sello de la
 * contratapa.
 *
 * Son dos, y la letra las dice de a dos: **la gata linda**, con orejas y bigotes de gata, la camisa apretada y
 * el prendedor radioactivo que brilla en el pecho; y **la llena**, redonda como una luna, que tiene en la mano
 * el botín que reclaman para la prisión: un botín de verdad, de cordones, que ninguna de las dos se puede
 * poner. Les cantan a Luzbelito, que está para el lado del fuego, y él no se da vuelta.
 *
 * Coordenadas: el (0, 0) de cada una es donde la corta el agua (`rig-sirenas.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, soplo, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { caja, cajaRedonda, conGrano, curva, elipse, poli, type P } from './trazos.ts';
import { AGUA, CANTAN, QUIETO, SIRENAS, SIRENA_ARMADO as A, alRecinto, marcas, type Momento } from './rig-sirenas.ts';

/** Las tintas de *Gulp!* (`tokens.css`). */
const C = {
  piel: 'var(--bestia-sirenas-piel)',
  sombra: 'var(--bestia-sirenas-sombra)',
  tinta: 'var(--bestia-sirenas-tinta)',
  tintaHonda: 'var(--bestia-sirenas-tinta-honda)',
  escama: 'var(--bestia-sirenas-escama)',
  escamaClara: 'var(--bestia-sirenas-escama-clara)',
  verde: 'var(--bestia-sirenas-verde)',
  agua: 'var(--bestia-sirenas-agua)',
  radio: 'var(--bestia-sirenas-radio)',
  radioClaro: 'var(--bestia-sirenas-radio-claro)',
  boca: 'var(--bestia-sirenas-boca)',
  espuma: 'var(--entorno-bajo-celeste)',
};

/* ------------------------------------------------------------------
   Los cuerpos: la gata linda con la camisa apretada, y la llena
   ------------------------------------------------------------------ */

/** Las escamas que suben de la cola hasta la cintura, sopladas en el verde de las letras. */
function escamas(x0: number, x1: number, y0: number, y1: number): string {
  let s = '';
  for (let y = y1; y > y0; y -= 5) {
    const fila = Math.round((y1 - y) / 5);
    for (let x = x0 + (fila % 2) * 3; x < x1; x += 6) s += trazo(`M${x - 3} ${y} q3 4 6 0`, fila % 3 ? C.escamaClara : C.verde, 0.9, 0.5 + 0.4 * ((y1 - y) / (y1 - y0)));
  }
  return s;
}

function cuerpoGata(): string {
  const d = curva([[-20, -50], [-8, -54], [8, -54], [20, -50], [22, -30], [18, -12], [20, 8], [-20, 8], [-18, -12], [-22, -30]]);
  // La camisa apretada, del blanco de la fotocopia, con los botones que tiran y los ojales que se abren.
  const camisa = curva([[-21, -50], [-8, -54], [0, -46], [8, -54], [21, -50], [22, -30], [17, -14], [-17, -14], [-22, -30]]);
  const botones = [-42, -34, -26, -18].map((y, i) => trazo(`M-2 ${y} q2 ${-1 - i * 0.3} 4 0`, C.sombra, 0.8) + forma(elipse(0, y, 1.4, 1.4), C.tinta)).join('');
  const tirantes = [-38, -30, -22].map((y) => trazo(`M-14 ${y + 2} Q-6 ${y - 1} 0 ${y} M14 ${y + 2} Q6 ${y - 1} 0 ${y}`, C.sombra, 0.7, 0.8)).join('');
  return conGrano(
    enmascarado('m-sir-gata', d, forma(d, C.piel) + forma(caja(-24, -16, 48, 30), C.escama) + escamas(-22, 22, -16, 10) + nube(14, -4, 8, 16, C.tintaHonda, 'm', 0.7)) +
    enmascarado('m-sir-camisa', camisa, forma(camisa, C.piel) + nube(-12, -32, 6, 14, C.sombra, 'm', 0.45) + nube(16, -28, 6, 14, C.sombra, 'm', 0.7) + tirantes) +
    trazo('M-8 -54 L0 -46 L8 -54', C.tinta, 1) + botones +
    // El cuello de la camisa, levantado, y el cinturón de escamas.
    forma(poli([[-8, -54], [-14, -50], [-4, -47]]), C.piel) + forma(poli([[8, -54], [14, -50], [4, -47]]), C.piel) + trazo('M-18 -14 Q0 -11 18 -14', C.tinta, 1.4),
  );
}

/** El prendedor radioactivo, en el pecho de la camisa: el trébol, y el brillo que se le prende. */
function prendedor(): string {
  const [px, py] = A.prendedor;
  const aspa = (a: number): string => {
    const r = (deg: number, rad: number): string => `${(px + Math.cos((deg * Math.PI) / 180) * rad).toFixed(2)} ${(py + Math.sin((deg * Math.PI) / 180) * rad).toFixed(2)}`;
    return `<path d="M${r(a - 30, 1.6)} L${r(a - 30, 5)} A5 5 0 0 1 ${r(a + 30, 5)} L${r(a + 30, 1.6)} Z" fill="${C.tinta}"/>`;
  };
  return forma(elipse(px, py, 6, 6), C.radio) + aspa(-90) + aspa(30) + aspa(150) + forma(elipse(px, py, 1, 1), C.tinta);
}

function brilloRadio(): string {
  const [px, py] = A.prendedor;
  return nube(px, py, 18, 18, C.radio, 'm', 0.8) + nube(px, py, 7, 7, C.radioClaro, 's', 0.9);
}

function cuerpoLlena(): string {
  // Redonda: el torso es casi una luna llena, con un corpiño de escamas.
  const d = curva([[-26, -48], [-10, -54], [10, -54], [26, -48], [32, -26], [28, -4], [22, 8], [-22, 8], [-28, -4], [-32, -26]]);
  const corpino = curva([[-24, -38], [-4, -40], [0, -34], [4, -40], [24, -38], [22, -28], [-22, -28]]);
  return conGrano(
    enmascarado('m-sir-llena', d, forma(d, C.piel) + nube(-14, -30, 10, 16, C.sombra, 'm', 0.4) + nube(20, -20, 12, 20, C.sombra, 'm', 0.7) + nube(-6, -44, 10, 4, C.piel, 's', 0.9) +
      forma(caja(-34, -8, 68, 20), C.escama) + escamas(-34, 34, -8, 10) + forma(elipse(0, -14, 2, 2.6), C.sombra)) +
    enmascarado('m-sir-corpino', corpino, forma(corpino, C.escama) + escamas(-24, 24, -40, -28) + nube(-12, -36, 6, 2, C.escamaClara, 's', 0.8)) +
    trazo('M-24 -38 Q-12 -42 0 -34 Q12 -42 24 -38', C.tinta, 1.2),
  );
}

/* ------------------------------------------------------------------
   Las cabezas
   ------------------------------------------------------------------ */

/** El pelo largo y mojado, de tinta, pegado a los hombros, con el reflejo verde del agua. */
function pelo(n: 0 | 1, [cx, cy]: P): string {
  const ancho = n ? 26 : 22;
  const d = curva([[cx, cy - 24], [cx + ancho, cy - 16], [cx + ancho + 4, cy + 10], [cx + ancho + 8, cy + 44], [cx + ancho - 6, cy + 40], [cx + 12, cy + 6], [cx - 12, cy + 6], [cx - ancho + 4, cy + 42], [cx - ancho - 8, cy + 46], [cx - ancho - 4, cy + 10], [cx - ancho, cy - 16]]);
  const mechones = [-1, 1].flatMap((s) => [0, 1, 2].map((i) => trazo(`M${cx + s * (8 + i * 5)} ${cy - 14 + i * 4} Q${cx + s * (ancho + i * 2)} ${cy + 10} ${cx + s * (ancho - 2 + i * 3)} ${cy + 40}`, C.agua, 1.2, 0.8))).join('');
  // Las gotas que le caen de las puntas.
  const gotas = [-1, 1].map((s) => forma(elipse(cx + s * (ancho + 2), cy + 48, 1.2, 1.8), C.espuma, 0.8)).join('');
  return conGrano(enmascarado(`m-sir-pelo-${n}`, d, forma(d, C.tinta) + nube(cx - 6, cy - 18, 12, 4, C.escama, 's', 0.9) + nube(cx - 8, cy - 19, 6, 1.4, C.escamaClara, 'xs', 0.7) + mechones) + gotas);
}

function cara(n: 0 | 1): string {
  const [cx, cy] = A.cara[n];
  const [bx, by] = A.boca[n];
  const r = n ? 16 : 13;
  const d = n ? elipse(cx, cy, r, r) : curva([[cx, cy - 15], [cx + 12, cy - 10], [cx + 13, cy + 2], [cx + 6, cy + 12], [cx, cy + 14], [cx - 6, cy + 12], [cx - 13, cy + 2], [cx - 12, cy - 10]]);
  // Ojos de sirena que mira lejos: la gata los tiene rasgados, de gata, con la pupila de rendija verde.
  const ojo = (x: number, y: number, s: number): string =>
    n === 0
      ? forma(curva([[x - 5, y], [x, y - 3], [x + 5, y - 1], [x, y + 2]]), C.radio) + forma(elipse(x - 0.4, y - 0.4, 0.8, 2.4), C.tinta) + trazo(`M${x - 6} ${y + 0.4} Q${x} ${y - 4} ${x + 6} ${y - 2} l${s * 2} -2`, C.tinta, 1.4)
      : forma(elipse(x, y, 3.6, 2.6), C.piel) + forma(elipse(x - 0.8, y, 1.6, 1.8), C.tinta) + trazo(`M${x - 4.6} ${y - 1} Q${x} ${y - 4.4} ${x + 4.6} ${y - 1}`, C.tinta, 1.2) + trazo(`M${x - 3} ${y - 6} q3 -1.4 6 0`, C.tinta, 0.8);
  const labios = forma(curva([[bx - 5, by], [bx - 1.6, by - 1.8], [bx, by - 1.2], [bx + 1.6, by - 1.8], [bx + 5, by], [bx, by + 2.4]]), C.boca);
  const bigotes = n === 0 ? [-1, 1].map((s) => [0, 1, 2].map((i) => trazo(`M${cx + s * 5} ${by - 4 + i * 1.6} l${s * 12} ${i * 2 - 2}`, C.tinta, 0.5, 0.8)).join('')).join('') : '';
  const orejas = n === 0 ? [-1, 1].map((s) => {
    const o = poli([[cx + s * 4, cy - 13], [cx + s * 14, cy - 28], [cx + s * 13, cy - 8]]);
    const adentro = poli([[cx + s * 6, cy - 14], [cx + s * 13, cy - 24], [cx + s * 12, cy - 11]]);
    return enmascarado(`m-sir-oreja-${s}`, o, forma(o, C.tinta) + forma(adentro, C.sombra) + nube(cx + s * 11, cy - 16, 2, 5, C.boca, 's', 0.8)) + trazo(`M${cx + s * 4} ${cy - 13} L${cx + s * 14} ${cy - 28}`, C.escamaClara, 0.6, 0.6);
  }).join('') : '';
  // La llena es una luna: los cráteres soplados en el blanco.
  const crateres = n === 1 ? [[-8, -8, 3], [7, -10, 2], [9, 6, 2.4]].map(([x, y, rr]) => nube(cx + x!, cy + y!, rr!, rr!, C.sombra, 's', 0.45)).join('') : '';
  return conGrano(
    orejas +
    forma(cajaRedonda(cx - 5, cy + (n ? 12 : 10), 10, 12, 3), C.piel) +
    enmascarado(`m-sir-cara-${n}`, d, forma(d, C.piel) + nube(cx + 9, cy + 2, 6, 14, C.sombra, 'm', 0.85) + nube(cx - 11, cy + 2, 3, 10, C.sombra, 'm', 0.45) +
      // Las cuencas hondas, el pómulo que agarra luz y la sombra del pelo en la frente: aerógrafo de tapa.
      nube(cx - 5, cy - 3, 5, 3.4, C.sombra, 's', 0.7) + nube(cx + 5, cy - 3, 5, 3.4, C.sombra, 's', 0.8) + nube(cx - 6, cy + 4, 4, 2, C.piel, 's', 0.9) +
      nube(cx, cy - 14, 14, 4, C.tinta, 'm', 0.55) + nube(cx + 2, cy + 7, 3, 2, C.sombra, 's', 0.5) + crateres) +
    ojo(cx - 5, cy - 3, -1) + ojo(cx + 5, cy - 3, 1) + trazo(`M${cx} ${cy - 1} q1.4 3 -0.6 4`, C.sombra, 0.8) + labios + bigotes,
  );
}

/** La boca abierta, cantando: el sello rojo estirado y lo oscuro. */
function bocaAbierta(n: 0 | 1): string {
  const [bx, by] = A.boca[n];
  return forma(elipse(bx, by + 1, 4.6, 4.4), C.boca) + forma(elipse(bx, by + 1.4, 3, 3), C.tintaHonda) + forma(caja(bx - 2.4, by - 2.4, 4.8, 1.2), C.piel);
}

/* ------------------------------------------------------------------
   Los brazos, el botín, las colas y el agua
   ------------------------------------------------------------------ */

function brazo(n: 0 | 1): string {
  const [sx, sy] = A.hombro[n];
  const [hx, hy] = A.mano[n];
  const ang = Math.atan2(hy - sy, hx - sx);
  const [nx, ny] = [-Math.sin(ang), Math.cos(ang)];
  const d = poli([[sx + nx * 5, sy + ny * 5], [hx + nx * 3.6, hy + ny * 3.6], [hx - nx * 3.6, hy - ny * 3.6], [sx - nx * 5, sy - ny * 5]]);
  // La manga arremangada de la camisa, en la gata.
  const manga = n === 0 ? forma(poli([[sx + nx * 7, sy + ny * 7], [sx + (hx - sx) * 0.3 + nx * 6, sy + (hy - sy) * 0.3 + ny * 6], [sx + (hx - sx) * 0.3 - nx * 6, sy + (hy - sy) * 0.3 - ny * 6], [sx - nx * 7, sy - ny * 7]]), C.piel) + trazo(`M${sx + (hx - sx) * 0.3 + nx * 6} ${sy + (hy - sy) * 0.3 + ny * 6} L${sx + (hx - sx) * 0.3 - nx * 6} ${sy + (hy - sy) * 0.3 - ny * 6}`, C.sombra, 1) : '';
  // La mano de la gata tiene uñas de gata; la de la llena aprieta el botín.
  const mano = forma(elipse(hx, hy, 4.6, 5), C.piel) + (n === 0 ? [-2, 0, 2].map((dx) => trazo(`M${hx + dx} ${hy + 4} l${dx * 0.3} 3`, C.tinta, 0.7)).join('') : '');
  return conGrano(enmascarado(`m-sir-brazo-${n}`, d, forma(d, C.piel) + nube((sx + hx) / 2 + 3, (sy + hy) / 2, 3, 14, C.sombra, 'm', 0.6)) + manga + mano);
}

/** El botín que reclaman para la prisión: de cuero, de cordones, con la suela gastada. Ninguna se lo puede poner. */
function botin(): string {
  const [hx, hy] = A.mano[1];
  const d = curva([[hx - 6, hy - 4], [hx + 6, hy - 6], [hx + 8, hy + 14], [hx + 22, hy + 18], [hx + 24, hy + 26], [hx - 6, hy + 26], [hx - 8, hy + 14]]);
  const cordones = [0, 1, 2, 3].map((i) => trazo(`M${hx - 3} ${hy + i * 4} l7 2`, C.verde, 0.9)).join('');
  return conGrano(
    enmascarado('m-sir-botin', d, forma(d, C.tinta) + nube(hx, hy + 8, 4, 12, C.sombra, 's', 0.5) + nube(hx + 16, hy + 20, 6, 3, C.sombra, 's', 0.45) + nube(hx + 18, hy + 22, 3, 1, C.piel, 'xs', 0.6)) +
    forma(caja(hx - 7, hy + 25, 32, 3), C.tintaHonda) + trazo(`M${hx - 6} ${hy + 25} l30 0`, C.sombra, 0.6) + cordones +
    // Las puntas del cordón que cuelgan, y una gota que cae del cuero mojado.
    trazo(`M${hx + 3} ${hy - 2} q4 6 2 12 M${hx + 4} ${hy - 2} q7 4 8 10`, C.verde, 0.8) + forma(elipse(hx + 25, hy + 32, 1.2, 1.8), C.espuma, 0.8) +
    // La mano que lo agarra, por arriba de la caña.
    forma(elipse(hx, hy - 3, 5, 4.6), C.piel),
  );
}

/** La cola de cada una, que asoma lejos del cuerpo: la aleta abierta, verde de las letras. */
function cola(n: 0 | 1): string {
  const [qx] = A.cola[n];
  const s = n ? -1 : 1;
  const tallo = curva([[qx - 6, 6], [qx + 6, 6], [qx + s * 4, -30], [qx + s * 2, -46], [qx - s * 4, -44], [qx - s * 4, -30]]);
  const aleta = curva([[qx + s * 2, -44], [qx + s * 26, -72], [qx + s * 16, -50], [qx + s * 6, -48], [qx - s * 6, -56], [qx - s * 18, -76], [qx - s * 8, -46]]);
  return conGrano(
    enmascarado(`m-sir-tallo-${n}`, tallo, forma(tallo, C.escama) + escamas(qx - 8, qx + 8, -46, 6) + nube(qx + s * 4, -20, 3, 20, C.tintaHonda, 'm', 0.6)) +
    enmascarado(`m-sir-aleta-${n}`, aleta, forma(aleta, C.verde) + nube(qx, -52, 10, 6, C.escama, 'm', 0.8) +
      [-16, -8, 0, 8, 16].map((dx) => trazo(`M${qx} -48 L${qx + dx * s} -72`, C.escama, 0.9, 0.8)).join('')) +
    forma(elipse(qx - s * 18, -78, 1.4, 2), C.espuma, 0.8),
  );
}

/** Las salpicaduras de la cola cuando golpea el agua. */
function salpica(n: 0 | 1): string {
  const [qx] = A.cola[n];
  return Array.from({ length: 11 }, (_, i) => {
    const a = Math.PI * (1.1 + (i / 10) * 0.8);
    const r = 20 + (i % 3) * 10;
    const [x, y] = [qx + Math.cos(a) * r, Math.sin(a) * r * 1.4];
    return forma(elipse(x, y, 1.6 + (i % 2), 2.6 + (i % 3)), i % 3 ? C.espuma : C.piel, 0.85);
  }).join('') + soplo(`M${qx - 20} 0 Q${qx} -36 ${qx + 20} 0 Z`, C.espuma, 's', 0.5);
}

/** Las ondas del agua alrededor de la cintura: delante de ellas, sin cortar. */
function ondas(n: 0 | 1): string {
  const w = n ? 40 : 34;
  return trazo(`M${-w} ${AGUA - 1} Q0 ${AGUA + 6} ${w} ${AGUA - 1}`, C.espuma, 2, 0.8) + trazo(`M${-w - 12} ${AGUA + 5} Q0 ${AGUA + 14} ${w + 12} ${AGUA + 5}`, C.espuma, 1.2, 0.5) + nube(0, AGUA + 2, w, 3, C.agua, 's', 0.7);
}

/** Lo que cantan: arcos que salen para el lado del fuego, en el verde de las letras, y unas letras a mano. */
function canto(): string {
  const [bx, by] = alRecinto(0, A.boca[0]);
  const arcos = [0, 1, 2, 3].map((i) => trazo(`M${bx - 8 - i * 14} ${by - 10 - i * 5} q-${12 + i * 3} ${10 + i * 5} 0 ${20 + i * 10}`, C.verde, 2.4 - i * 0.3, 0.9 - i * 0.15)).join('');
  // Lo que se le entiende: una A larga, garabateada.
  const letra = trazo(`M${bx - 72} ${by + 6} L${bx - 66} ${by - 12} L${bx - 60} ${by + 6} M${bx - 70} ${by} L${bx - 62} ${by} M${bx - 58} ${by - 2} q6 -4 12 0 t12 0`, C.verde, 1.8, 0.9);
  return arcos + letra;
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 3.6;
const [P1x, P1y] = A.prendedor;
const [B2x, B2y] = A.mano[1];
const [CANx, CANy] = alRecinto(0, A.boca[0]);

export const PIEZAS_SIRENAS: readonly Pieza[] = [
  { nombre: 'sirenas-canto', caja: [CANx - 110, CANy - 30, 112, 60], dibujo: canto(), densidad: 2 },
  ...([0, 1] as const).flatMap((n): Pieza[] => {
    const [cx, cy] = A.cara[n];
    const [qx] = A.cola[n];
    const [sx, sy] = A.hombro[n];
    const [hx, hy] = A.mano[n];
    const k = n + 1;
    return [
      { nombre: `sirena-${k}-cola`, caja: [qx - 32, -86, 64, 96], dibujo: cola(n), densidad: D },
      { nombre: `sirena-${k}-salpica`, caja: [qx - 52, -56, 104, 64], dibujo: salpica(n), densidad: D * 0.7 },
      { nombre: `sirena-${k}-pelo`, caja: [cx - 38, cy - 28, 76, 80], dibujo: pelo(n, [cx, cy]), densidad: D },
      { nombre: `sirena-${k}-cuerpo`, caja: [-36, -58, 72, 70], dibujo: n ? cuerpoLlena() : cuerpoGata(), densidad: D },
      { nombre: `sirena-${k}-cara`, caja: [cx - 22, cy - 30, 44, 56], dibujo: cara(n), densidad: D * 1.3 },
      { nombre: `sirena-${k}-boca`, caja: [A.boca[n][0] - 6, A.boca[n][1] - 5, 12, 12], dibujo: bocaAbierta(n), densidad: D * 1.3 },
      { nombre: `sirena-${k}-brazo`, caja: [Math.min(sx, hx) - 10, Math.min(sy, hy) - 10, Math.abs(hx - sx) + 20, Math.abs(hy - sy) + 20], dibujo: brazo(n), densidad: D },
      { nombre: `sirena-${k}-ondas`, caja: [-60, AGUA - 8, 120, 26], dibujo: ondas(n), densidad: D * 0.7 },
    ];
  }),
  { nombre: 'sirena-1-prendedor', caja: [P1x - 8, P1y - 8, 16, 16], dibujo: prendedor(), densidad: D * 1.6 },
  { nombre: 'sirena-1-radio', caja: [P1x - 40, P1y - 40, 80, 80], dibujo: brilloRadio(), densidad: 1.4 },
  { nombre: 'sirena-2-botin', caja: [B2x - 12, B2y - 12, 40, 50], dibujo: botin(), densidad: D },
];

const img = imagenesDe(PIEZAS_SIRENAS);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** Lo que se ve de una sirena arriba del agua: el corte va en sus coordenadas, y se zambulle por adentro. */
const debajo = (id: string): string => `<clipPath id="${id}"><rect x="-120" y="-260" width="240" height="${260 + AGUA}"/></clipPath>`;

/** Una sirena armada con las marcas de un momento. */
function sirena(n: 0 | 1, m: Momento, sufijo: string): string {
  const { transform: t, opacity: o } = marcas(m);
  const k = n + 1;
  const corte = `sirena-agua-${k}${sufijo}`;
  const corteCola = `sirena-cola-${k}${sufijo}`;
  const delPecho = n === 0 ? img('sirena-1-prendedor') + parte('radio', img('sirena-1-radio'), '', o.radio) : '';
  const enLaMano = n === 1 ? img('sirena-2-botin') : '';
  return (
    `<g data-parte="entera-${k}" transform="${t[`entera-${k}`]}">` +
    debajo(corteCola) +
    `<g clip-path="url(#${corteCola})">${parte(`cola-${k}`, img(`sirena-${k}-cola`), t[`cola-${k}`])}</g>` +
    parte(`salpica-${k}`, img(`sirena-${k}-salpica`), t[`salpica-${k}`], o[`salpica-${k}`]) +
    debajo(corte) +
    `<g clip-path="url(#${corte})">` +
    parte(`cuerpo-${k}`,
      parte(`pelo-${k}`, img(`sirena-${k}-pelo`), t[`pelo-${k}`]) +
      img(`sirena-${k}-cuerpo`) + delPecho +
      parte(`cabeza-${k}`, img(`sirena-${k}-cara`) + parte(`boca-${k}`, img(`sirena-${k}-boca`), t[`boca-${k}`], o[`boca-${k}`]), t[`cabeza-${k}`]) +
      parte(`brazo-${k}`, img(`sirena-${k}-brazo`) + enLaMano, t[`brazo-${k}`]),
      t[`cuerpo-${k}`]) +
    `</g>` +
    parte(`ondas-${k}`, img(`sirena-${k}-ondas`), t[`ondas-${k}`], o[`ondas-${k}`]) +
    `</g>`
  );
}

/** Las dos armadas, la de atrás primero, y lo que cantan. */
function armado(m: Momento, sufijo = ''): string {
  const { transform: t, opacity: o } = marcas(m);
  return sirena(1, m, sufijo) + sirena(0, m, sufijo) + parte('canto', img('sirenas-canto'), t.canto, o.canto);
}

/** Las sirenas en un momento, sin lo que las hace tocables: para el test, el retrato y para mirarlas. */
export function sirenasEn(m: Momento = QUIETO): string {
  return armado(m, '-r');
}

/** El títere que se toca, en la pose quieta: las dos asomadas en el agua. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--sirenas" data-id="las-sirenas" role="button" tabindex="0" aria-label="${nombres.get('las-sirenas') ?? 'Las sirenas'}">` +
    armado(QUIETO) +
    `</g>`
  );
}

/** El retrato de la ficha: las dos cantando, con la cola afuera, delante de la tarima. */
export const RETRATO = { caja: [SIRENAS[0].x - 96, SIRENAS[1].agua - 76, 210, 120] as const };
function retrato(): string {
  // La sala y el agua, en sus cajas de `arte-bajo.ts`.
  return `<image href="/bestiario/bajo-lejos.webp" x="-250" y="0" width="1450" height="640" preserveAspectRatio="none"/>` +
    `<image href="/bestiario/bajo-agua.webp" x="-250" y="368" width="1450" height="272" preserveAspectRatio="none"/>` + sirenasEn(CANTAN);
}

export const SIRENAS_PERSONAJE: Personaje = {
  id: 'las-sirenas',
  region: 'el-bajo',
  ancla: Math.round((SIRENAS[0].x + SIRENAS[1].x) / 2),
  piezas: PIEZAS_SIRENAS,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
