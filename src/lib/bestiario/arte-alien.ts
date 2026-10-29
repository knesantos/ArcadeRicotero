/**
 * El Alien Duce (`D-73`, vigesimosegunda vuelta), adentro de la pantalla de ojo de buey de la tele grande de
 * Cybersiberia. Lo pidió el usuario.
 *
 * *"Alien Duce dice desde la TV que no quiere estar jamás en la TV"* es de *Alien Duce*, en *Último bondi a
 * Finisterre* (1998). Por eso viste esa tapa, medida con sharp: el uniforme es el acero remachado del marco,
 * las charreteras y los botones el cromo, la cara la piel de los de la foto del ojo de buey, y las lamparitas
 * de las antenas el rojo de la gorra del de la izquierda. La pantalla, que es la de la tele del recinto, ya es
 * el ojo de buey de esa tapa.
 *
 * De la letra son el que habla desde la tele y no quiere estar en la tele (por eso se aplasta contra el
 * vidrio), el look *bola de efectos*, que acá es el cráneo hecho de espejitos que tiran puntos de luz por
 * toda la nieve, el evangelio escrito en los tickets del súper, el pequeño gran matón (la quijada para arriba,
 * el puño), y que chupa y escupe al fin. Del dibujo, el uniforme de dictador de opereta y las antenas con
 * lamparita, que son de marciano de historieta.
 *
 * Coordenadas: el (0, 0) es el medio de la pantalla (`rig-alien.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, soplo, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { caja, cajaRedonda, conGrano, curva, elipse, poli, type P } from './trazos.ts';
import { ALIEN, ALIEN_ARMADO as A, EVANGELIO, PANTALLA, QUIETO, TICKET, marcas, type Momento } from './rig-alien.ts';

/** Las tintas de *Último bondi a Finisterre* (`tokens.css`), y la luz de la pantalla de la tele. */
const C = {
  acero: 'var(--bestia-alien-acero)',
  aceroHondo: 'var(--bestia-alien-acero-hondo)',
  aceroClaro: 'var(--bestia-alien-acero-claro)',
  cromo: 'var(--bestia-alien-cromo)',
  cromoClaro: 'var(--bestia-alien-cromo-claro)',
  cuero: 'var(--bestia-alien-cuero)',
  piel: 'var(--bestia-alien-piel)',
  pielHonda: 'var(--bestia-alien-piel-honda)',
  pielClara: 'var(--bestia-alien-piel-clara)',
  pielSombra: 'var(--bestia-alien-piel-sombra)',
  rojo: 'var(--bestia-alien-rojo)',
  rojoHondo: 'var(--bestia-alien-rojo-hondo)',
  papel: 'var(--bestia-alien-papel)',
  lente: 'var(--entorno-cyber-lente)',
  vidrio: 'var(--entorno-cyber-vidrio)',
};

/** Un azar fijo, para que los espejitos y los puntos salgan siempre iguales. */
function azar(semilla: number): () => number {
  let a = semilla;
  return () => {
    a = (a * 16807) % 2147483647;
    return a / 2147483647;
  };
}

/* ------------------------------------------------------------------
   La pantalla: el fondo prendido, las rayas, el vidrio y la interferencia
   ------------------------------------------------------------------ */

function fondo(): string {
  const r = PANTALLA.r;
  let rayas = '';
  for (let y = -r; y < r; y += 5) rayas += trazo(`M${-r} ${y} L${r} ${y}`, C.aceroHondo, 1.4, 0.35);
  return forma(elipse(0, 0, r + 4, r + 4), C.aceroHondo) + nube(0, -10, r * 0.8, r * 0.7, C.lente, 'l', 0.55) + nube(-30, -40, 40, 30, C.cromoClaro, 'l', 0.3) + rayas;
}

/** El vidrio de la pantalla, abombado: el reflejo de la nieve arriba a la izquierda y lo oscuro del borde. */
function vidrio(): string {
  const r = PANTALLA.r;
  return enmascarado('m-alien-vidrio', elipse(0, 0, r, r),
    soplo(`M${-r} ${-r} L${r * 0.2} ${-r} Q${-r * 0.5} ${-r * 0.4} ${-r * 0.6} ${r * 0.3} L${-r} ${r * 0.3} Z`, C.cromoClaro, 'm', 0.22) +
    nube(-r * 0.5, -r * 0.55, r * 0.18, r * 0.08, C.cromoClaro, 's', 0.6, -30) +
    `<circle cx="0" cy="0" r="${r - 6}" fill="none" stroke="${C.aceroHondo}" stroke-width="22" opacity="0.55" filter="url(#soplo-m)"/>`);
}

/** La interferencia: una franja corrida y blanca que pasa por la pantalla. */
function ruido(): string {
  const r = PANTALLA.r;
  const rnd = azar(77);
  let s = forma(caja(-r, -14, r * 2, 28), C.cromoClaro, 0.3);
  for (let i = 0; i < 40; i++) s += forma(caja(-r + rnd() * r * 2, -14 + rnd() * 28, 4 + rnd() * 30, 1 + rnd() * 3), rnd() < 0.5 ? C.cromoClaro : C.lente, 0.8);
  return s;
}

/* ------------------------------------------------------------------
   El busto: el uniforme, el brazo del puño y la cabeza con la bola de efectos
   ------------------------------------------------------------------ */

function uniforme(): string {
  const d = curva([[-120, 160], [-118, 100], [-96, 74], [-40, 60], [0, 66], [40, 60], [96, 74], [118, 100], [120, 160]]);
  const cuello = curva([[-26, 52], [26, 52], [30, 76], [0, 84], [-30, 76]]);
  // La charretera: el cromo con los flecos que cuelgan.
  const charretera = (s: number): string => {
    const x = s * 82;
    const d0 = cajaRedonda(x - 24, 70, 48, 14, 6);
    const flecos = Array.from({ length: 9 }, (_, i) => trazo(`M${x - 20 + i * 5} 82 l${s * 1} 14`, i % 2 ? C.cromo : C.cromoClaro, 1.6));
    return enmascarado(`m-alien-charretera-${s}`, d0, forma(d0, C.cromo) + nube(x - 8, 73, 12, 3, C.cromoClaro, 's', 0.9) + nube(x + 10, 82, 12, 4, C.aceroHondo, 's', 0.6)) + flecos.join('');
  };
  // Los botones de cromo, en dos filas, y la banda roja cruzada.
  const botones = [-1, 1].flatMap((s) => [96, 116, 136].map((y) => forma(elipse(s * 22, y, 4.6, 4.6), C.cromo) + nube(s * 22 - 1.4, y - 1.4, 1.6, 1.4, C.cromoClaro, 'xs', 0.95))).join('');
  const banda = poli([[-110, 100], [-92, 88], [96, 156], [76, 164]]);
  // Las medallas: un disquito plateado (Dios es digital), un ticket doblado y una tecla.
  const medallas =
    trazo('M-64 104 l0 14 M-48 104 l0 14 M-32 104 l0 14', C.rojo, 3) +
    forma(elipse(-64, 124, 7, 7), C.cromo) + forma(elipse(-64, 124, 2, 2), C.aceroHondo) + nube(-66, 122, 3, 2, C.cromoClaro, 'xs', 0.9) +
    forma(poli([[-54, 118], [-42, 118], [-42, 134], [-48, 130], [-54, 134]]), C.papel) + trazo('M-52 122 l8 0 M-52 126 l6 0', C.aceroClaro, 0.8) +
    forma(cajaRedonda(-38, 118, 12, 12, 2), C.aceroClaro) + forma(cajaRedonda(-36, 119, 8, 8, 1.4), C.cromo);
  return conGrano(
    enmascarado('m-alien-uniforme', d, forma(d, C.acero) + nube(-70, 120, 40, 50, C.aceroHondo, 'l', 0.8) + nube(50, 100, 30, 30, C.aceroClaro, 'm', 0.5) +
      // Los remaches del acero de la tapa, en la costura de los hombros.
      [-100, -80, 60, 80, 100].map((x) => forma(elipse(x, 98 - Math.abs(x) * 0.1, 1.6, 1.6), C.cromo)).join('') +
      enmascarado('m-alien-banda', banda, forma(banda, C.rojo) + nube(0, 128, 90, 6, C.rojoHondo, 'm', 0.7, 24)) +
      trazo('M0 70 L0 160', C.aceroHondo, 1.6)) +
    enmascarado('m-alien-cuello', cuello, forma(cuello, C.acero) + nube(0, 60, 24, 6, C.aceroClaro, 's', 0.6)) + trazo('M-26 52 L-30 76 L0 84 L30 76 L26 52', C.cromo, 1.4) +
    charretera(-1) + charretera(1) + botones + medallas,
  );
}

/** El brazo del puño: la manga del uniforme y el guante de cuero, con el puño en alto. */
function brazo(): string {
  const [sx, sy] = A.hombro;
  const [hx, hy] = A.puno;
  const ang = Math.atan2(hy - sy, hx - sx);
  const [nx, ny] = [-Math.sin(ang), Math.cos(ang)];
  const d = poli([[sx + nx * 20, sy + ny * 20], [hx + nx * 13, hy + ny * 13 + 14], [hx - nx * 13, hy - ny * 13 + 14], [sx - nx * 20, sy - ny * 20]]);
  const puno = curva([[hx - 16, hy - 10], [hx + 4, hy - 18], [hx + 18, hy - 8], [hx + 18, hy + 10], [hx + 6, hy + 18], [hx - 14, hy + 12]]);
  return conGrano(
    enmascarado('m-alien-manga', d, forma(d, C.acero) + nube(sx + 10, (sy + hy) / 2, 10, 40, C.aceroHondo, 'm', 0.7) + nube(sx - 10, (sy + hy) / 2, 4, 30, C.aceroClaro, 's', 0.6)) +
    // El puño de la manga, con galón de cromo.
    forma(cajaRedonda(hx - 16, hy + 12, 32, 10, 3), C.cromo) +
    enmascarado('m-alien-puno', puno, forma(puno, C.cuero) + nube(hx - 4, hy - 8, 10, 4, C.aceroClaro, 's', 0.8) + nube(hx + 8, hy + 8, 8, 8, C.aceroHondo, 's', 0.8)) +
    [-8, -2, 4, 10].map((dx) => trazo(`M${hx + dx} ${hy - 14} l1 8`, C.aceroHondo, 1)).join(''),
  );
}

/** La bola de efectos: el cráneo hecho de espejitos, cada uno de un acero distinto, algunos prendidos. */
function bola(): string {
  const [bx, by] = A.bola;
  const r = A.radioBola;
  const rnd = azar(1998);
  const d = elipse(bx, by, r, r * 0.92);
  let espejos = '';
  // La grilla de espejitos sigue la esfera: las filas se achican hacia arriba y hacia los costados.
  for (let fila = -6; fila <= 6; fila++) {
    const lat = (fila / 7) * (Math.PI / 2);
    const y = by + Math.sin(lat) * r * 0.92;
    const ancho = Math.cos(lat) * r;
    const cuantos = Math.max(3, Math.round(ancho / 7));
    for (let i = 0; i < cuantos; i++) {
      const lon = -Math.PI / 2 + ((i + 0.5) / cuantos) * Math.PI;
      const x = bx + Math.sin(lon) * ancho;
      const w = Math.max(1.4, Math.cos(lon) * 9);
      const h = Math.max(1.4, Math.cos(lat) * 9);
      const v = rnd();
      const tinta = v < 0.18 ? C.aceroHondo : v < 0.42 ? C.acero : v < 0.72 ? C.aceroClaro : v < 0.92 ? C.cromo : C.cromoClaro;
      espejos += forma(caja(x - w / 2, y - h / 2, w - 0.8, h - 0.8), tinta);
    }
  }
  return conGrano(enmascarado('m-alien-bola', d, forma(d, C.aceroHondo) + espejos + nube(bx - r * 0.4, by - r * 0.4, r * 0.3, r * 0.2, C.cromoClaro, 'm', 0.5) + nube(bx + r * 0.5, by + r * 0.3, r * 0.4, r * 0.5, C.aceroHondo, 'l', 0.7)));
}

/** Los destellos de la bola: los espejitos que agarran la luz, que la isla prende y apaga. */
function brillos(): string {
  const [bx, by] = A.bola;
  const r = A.radioBola;
  const rnd = azar(7);
  let s = '';
  for (let i = 0; i < 14; i++) {
    const a = rnd() * Math.PI * 2;
    const q = Math.sqrt(rnd()) * r * 0.85;
    const [x, y] = [bx + Math.cos(a) * q, by + Math.sin(a) * q * 0.9];
    s += nube(x, y, 4, 4, C.cromoClaro, 's', 0.9) + trazo(`M${x - 6} ${y} L${x + 6} ${y} M${x} ${y - 6} L${x} ${y + 6}`, C.cromoClaro, 0.8, 0.9);
  }
  return s;
}

/** La cara: la quijada de matón para arriba, el ceño, los ojos chicos, y la piel de los de la foto. */
function cara(): string {
  const d = curva([[-52, -24], [-30, -14], [0, -12], [30, -14], [52, -24], [54, 8], [44, 30], [30, 48], [0, 56], [-30, 48], [-44, 30], [-54, 8]]);
  const [cx] = [0];
  const ojo = ([x, y]: P, i: number): string => {
    const s = i ? 1 : -1;
    return forma(elipse(x, y, 8, 4.4), C.pielClara) + forma(elipse(x - s * 1.4, y + 0.4, 3, 3.4), C.aceroHondo) + forma(elipse(x - s * 2, y - 0.8, 0.9, 0.9), C.cromoClaro) +
      // El ceño: la ceja gruesa que baja hacia el medio, de mandón.
      forma(poli([[x - s * 14, y - 12], [x + s * 10, y - 6], [x + s * 10, y - 2], [x - s * 14, y - 7]]), C.pielSombra) +
      trazo(`M${x - 9} ${y + 1} Q${x} ${y + 5} ${x + 9} ${y + 1}`, C.pielHonda, 1.2);
  };
  return conGrano(
    enmascarado('m-alien-cara', d, forma(d, C.piel) +
      // La luz de la pantalla le pega de abajo, como a los de la foto: la frente en sombra y la quijada prendida.
      nube(cx, -14, 50, 10, C.pielSombra, 'm', 0.75) + nube(-40, 14, 12, 26, C.pielHonda, 'm', 0.7) + nube(40, 14, 12, 26, C.pielHonda, 'm', 0.8) +
      nube(0, 44, 26, 10, C.pielClara, 'm', 0.55) + nube(20, 20, 8, 6, C.pielClara, 's', 0.5) +
      A.ojos.map(ojo).join('') +
      // La nariz chata, y los pómulos de alien, altos.
      forma(poli([[-6, 8], [6, 8], [8, 18], [-8, 18]]), C.pielHonda, 0.6) + nube(0, 14, 6, 3, C.pielClara, 's', 0.6) +
      trazo('M-44 10 Q-34 2 -24 14 M44 10 Q34 2 24 14', C.pielSombra, 1.4, 0.8)) +
    trazo('M-52 -24 Q0 -10 52 -24', C.pielSombra, 1.6, 0.8),
  );
}

/** La quijada con la boca cerrada: la mandíbula de matón, los labios apretados para abajo. */
function quijada(): string {
  const [bx, by] = A.boca;
  const d = curva([[-40, 28], [-28, 46], [-14, 58], [0, 62], [14, 58], [28, 46], [40, 28], [30, 50], [0, 66], [-30, 50]]);
  return conGrano(enmascarado('m-alien-quijada', curva([[-42, 26], [42, 26], [34, 54], [0, 70], [-34, 54]]), forma(curva([[-42, 26], [42, 26], [34, 54], [0, 70], [-34, 54]]), C.piel) + nube(0, 60, 26, 8, C.pielClara, 'm', 0.7) + nube(30, 46, 10, 10, C.pielHonda, 'm', 0.7)) +
    forma(d, C.pielHonda, 0.25) +
    trazo(`M${bx - 16} ${by + 2} Q${bx} ${by - 3} ${bx + 16} ${by + 2}`, C.pielSombra, 2.6) + trazo(`M${bx - 16} ${by + 2} l-3 3 M${bx + 16} ${by + 2} l3 3`, C.pielSombra, 1.6) +
    // El hoyuelo del mentón, de prócer.
    trazo(`M0 ${by + 22} l0 6`, C.pielHonda, 1.4, 0.8));
}

/** La boca abierta de arenga: lo oscuro, los dientes y la lengua. */
function boca(): string {
  const [bx, by] = A.boca;
  const d = curva([[bx - 18, by - 2], [bx, by - 6], [bx + 18, by - 2], [bx + 12, by + 14], [bx, by + 18], [bx - 12, by + 14]]);
  return conGrano(enmascarado('m-alien-boca', d, forma(d, C.aceroHondo) + forma(caja(bx - 14, by - 4, 28, 5), C.pielClara) + forma(elipse(bx, by + 14, 9, 5), C.rojoHondo)) + trazo(`M${bx - 18} ${by - 2} Q${bx} ${by - 7} ${bx + 18} ${by - 2}`, C.pielHonda, 1.6));
}

/** Una antena de marciano, con la lamparita en la punta. */
function antena(n: 0 | 1): string {
  const [[x0, y0], [x1, y1]] = A.antenas[n];
  const s = n ? 1 : -1;
  return conGrano(trazo(`M${x0} ${y0} Q${x0 + s * 4} ${y0 - 14} ${x1} ${y1}`, C.cromo, 3) + trazo(`M${x0} ${y0} Q${x0 + s * 4} ${y0 - 14} ${x1} ${y1}`, C.cromoClaro, 1, 0.7) + forma(elipse(x0, y0 + 2, 6, 3), C.acero) + forma(elipse(x1, y1, 7, 7), C.rojoHondo) + nube(x1 - 2, y1 - 2, 2.4, 2, C.cromoClaro, 'xs', 0.9));
}

function lamparas(): string {
  return A.antenas.map(([, [x, y]]) => nube(x, y, 16, 16, C.rojo, 'm', 0.85) + nube(x, y, 5, 5, C.papel, 's', 0.9)).join('');
}

/** Las palmas aplastadas contra el vidrio: el guante de cuero chato, con la luz de la pantalla alrededor. */
function palmas(): string {
  return [-1, 1].map((s) => {
    const [x, y] = [s * 92, 30];
    const d = curva([[x - 18, y + 26], [x - 22, y - 4], [x - 16, y - 30], [x - 8, y - 34], [x - 2, y - 14], [x + 2, y - 38], [x + 10, y - 36], [x + 10, y - 12], [x + 18, y - 30], [x + 24, y - 24], [x + 18, y + 2], [x + 30, y - 6], [x + 32, y + 4], [x + 16, y + 28]]);
    return conGrano(enmascarado(`m-alien-palma-${s}`, d, forma(d, C.cuero) + nube(x, y, 14, 18, C.aceroClaro, 'm', 0.6) + nube(x + 4, y + 6, 6, 6, C.cromo, 's', 0.6))) + nube(x, y, 34, 40, C.lente, 'm', 0.35);
  }).join('');
}

/* ------------------------------------------------------------------
   Lo que se sale de la tele: el ticket, el bollo y los puntos de luz
   ------------------------------------------------------------------ */

/** El ticket del súper, larguísimo, con el evangelio garabateado en renglones, que se enrula al llegar a la nieve. */
function ticket(): string {
  const [bx, by] = A.boca;
  const { largo, ancho } = TICKET;
  const d = `M${bx - ancho / 2} ${by} L${bx + ancho / 2} ${by} L${bx + ancho / 2 + 4} ${by + largo - 30} Q${bx + ancho / 2 + 30} ${by + largo} ${bx + ancho / 2 + 50} ${by + largo - 14} L${bx + ancho / 2 + 46} ${by + largo + 4} Q${bx + 20} ${by + largo + 14} ${bx - ancho / 2 + 4} ${by + largo - 26} Z`;
  const rnd = azar(2001);
  let renglones = '';
  for (let y = by + 16; y < by + largo - 40; y += 7) {
    const largoR = 6 + rnd() * (ancho - 14);
    renglones += trazo(`M${bx - ancho / 2 + 4} ${y} q${largoR / 4} -1.4 ${largoR / 2} 0 t${largoR / 2} 0`, C.aceroHondo, 1, 0.75);
    if (rnd() < 0.2) renglones += trazo(`M${bx + ancho / 2 - 9} ${y} l5 0`, C.aceroHondo, 1.4, 0.8);
  }
  // Arriba, el encabezado del ticket con las estrellitas; y al final, el total, subrayado dos veces.
  const encabezado = trazo(`M${bx - 8} ${by + 8} l16 0`, C.rojo, 2.4) + trazo(`M${bx - 10} ${by + largo - 52} l20 0 M${bx - 10} ${by + largo - 49} l20 0`, C.aceroHondo, 0.9);
  // Los dientes del borde cortado, donde lo arrancó.
  const dientes = Array.from({ length: 6 }, (_, i) => `M${bx - ancho / 2 + i * 5} ${by} l2.5 -3 l2.5 3`).join(' ');
  return conGrano(
    soplo(d, C.aceroHondo, 's', 0.5) +
    enmascarado('m-alien-ticket', d, forma(d, C.papel) + nube(bx + 10, by + largo / 2, 6, largo / 2, C.vidrio, 'm', 0.35) + renglones + encabezado + nube(bx + ancho / 2 + 30, by + largo - 6, 16, 8, C.aceroClaro, 's', 0.6)) +
    trazo(dientes, C.papel, 1),
  );
}

/** El bollo del ticket escupido: el papel arrugado. */
function bollo(): string {
  const [bx, by] = A.boca;
  const d = curva([[bx - 12, by - 6], [bx - 4, by - 13], [bx + 8, by - 11], [bx + 13, by - 2], [bx + 9, by + 10], [bx - 3, by + 12], [bx - 12, by + 6]]);
  return conGrano(enmascarado('m-alien-bollo', d, forma(d, C.papel) + nube(bx + 5, by + 4, 7, 7, C.aceroClaro, 's', 0.7) + trazo(`M${bx - 8} ${by - 2} l6 3 l5 -4 l4 6 M${bx - 4} ${by + 6} l5 -3 l4 3`, C.aceroClaro, 0.9) + trazo(`M${bx - 6} ${by - 8} l8 0`, C.aceroHondo, 0.8, 0.7)));
}

/** Los puntos de luz de la bola de efectos, regados por la nieve y el acero alrededor de la tele. */
function puntos(): string {
  const rnd = azar(42);
  let s = '';
  for (let i = 0; i < 46; i++) {
    const a = rnd() * Math.PI * 2;
    const r = 170 + rnd() * 420;
    const [x, y] = [Math.cos(a) * r, Math.sin(a) * r * 0.62 + 40];
    const t = 6 + rnd() * 9;
    s += nube(x, y, t * 1.6, t * 1.2, rnd() < 0.15 ? C.rojo : C.lente, 'm', 0.7) + forma(caja(x - t * 0.4, y - t * 0.4, t * 0.8, t * 0.8), C.cromoClaro, 0.95);
  }
  return s;
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 2.6;
const R = PANTALLA.r;
const [BX, BY] = A.boca;
const [HX, HY] = A.hombro;
const [PX, PY] = A.puno;
const [CX, CY] = A.cae;

export const PIEZAS_ALIEN: readonly Pieza[] = [
  { nombre: 'alien-puntos', caja: [-620, -340, 1240, 760], dibujo: puntos(), densidad: 0.4 },
  { nombre: 'alien-fondo', caja: [-R - 6, -R - 6, R * 2 + 12, R * 2 + 12], dibujo: fondo(), densidad: D, opaca: true },
  { nombre: 'alien-uniforme', caja: [-124, 46, 248, 120], dibujo: uniforme(), densidad: D },
  { nombre: 'alien-antena-1', caja: [-62, -150, 40, 36], dibujo: antena(0), densidad: D * 1.3 },
  { nombre: 'alien-antena-2', caja: [22, -150, 42, 36], dibujo: antena(1), densidad: D * 1.3 },
  { nombre: 'alien-lamparas', caja: [-80, -158, 160, 54], dibujo: lamparas(), densidad: D },
  { nombre: 'alien-bola', caja: [-82, -150, 164, 150], dibujo: bola(), densidad: D * 1.3 },
  { nombre: 'alien-brillos', caja: [-80, -148, 160, 146], dibujo: brillos(), densidad: D },
  { nombre: 'alien-cara', caja: [-58, -28, 116, 88], dibujo: cara(), densidad: D * 1.3 },
  { nombre: 'alien-quijada', caja: [-44, 22, 88, 52], dibujo: quijada(), densidad: D * 1.3 },
  { nombre: 'alien-boca', caja: [BX - 20, BY - 8, 40, 28], dibujo: boca(), densidad: D * 1.3 },
  { nombre: 'alien-brazo', caja: [Math.min(HX, PX) - 30, PY - 22, Math.abs(HX - PX) + 64, HY - PY + 50], dibujo: brazo(), densidad: D },
  { nombre: 'alien-palmas', caja: [-136, -36, 272, 106], dibujo: palmas(), densidad: 1.6 },
  { nombre: 'alien-ruido', caja: [-R, -16, R * 2, 32], dibujo: ruido(), densidad: D },
  { nombre: 'alien-vidrio', caja: [-R, -R, R * 2, R * 2], dibujo: vidrio(), densidad: 1.2 },
  { nombre: 'alien-ticket', caja: [BX - TICKET.ancho / 2 - 6, BY - 6, TICKET.ancho + 64, TICKET.largo + 30], dibujo: ticket(), densidad: 2 },
  { nombre: 'alien-bollo', caja: [BX - 16, BY - 16, 32, 32], dibujo: bollo(), densidad: D * 1.4 },
];

const img = imagenesDe(PIEZAS_ALIEN);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** El Alien armado con las marcas de un momento: lo de adentro de la pantalla, cortado, y lo que se sale. */
function armado(m: Momento, sufijo = ''): string {
  const { transform: t, opacity: o } = marcas(m);
  const corte = `alien-pantalla${sufijo}`;
  return (
    parte('puntos', img('alien-puntos'), t.puntos, o.puntos) +
    `<clipPath id="${corte}"><circle cx="0" cy="0" r="${R}"/></clipPath>` +
    `<g clip-path="url(#${corte})">` +
    img('alien-fondo') +
    parte('busto',
      img('alien-uniforme') +
      parte('cabeza',
        img('alien-cara') +
        parte('quijada', img('alien-quijada'), t.quijada) +
        parte('boca', img('alien-boca'), t.quijada, o.boca) +
        // La bola de efectos va delante de la frente: es el cráneo, que le tapa hasta las cejas.
        img('alien-bola') + parte('brillos', img('alien-brillos'), t.brillos, o.brillos) +
        parte('antena-1', img('alien-antena-1'), t['antena-1']) + parte('antena-2', img('alien-antena-2'), t['antena-2']) +
        parte('lamparas', img('alien-lamparas'), '', o.lamparas),
        t.cabeza) +
      parte('brazo', img('alien-brazo'), t.brazo),
      t.busto) +
    parte('palmas', img('alien-palmas'), '', o.palmas) +
    parte('ruido', img('alien-ruido'), t.franja, o.ruido) +
    img('alien-vidrio') +
    `</g>` +
    parte('ticket', img('alien-ticket'), t.ticket, o.ticket) +
    parte('bollo', img('alien-bollo'), t.bollo, o.bollo)
  );
}

/** El Alien en un momento, sin lo que lo hace tocable: para el test, el retrato y para mirarlo. */
export function alienEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m, '-r')}</g>`;
}

/** El títere que se toca, en la pose quieta: en la pantalla, con la quijada para arriba. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--alien" data-id="el-alien-duce" role="button" tabindex="0" aria-label="${nombres.get('el-alien-duce') ?? 'El Alien Duce'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: arengando con el ticket afuera y la bola prendida, en la tele de la nieve. */
export const RETRATO = { caja: [ALIEN.x - 110, ALIEN.y - 90, 220, 200] as const };
function retrato(): string {
  return `<image href="/bestiario/cyber-lejos.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>` +
    `<image href="/bestiario/cyber-piso.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>` + alienEn(EVANGELIO);
}

export const ALIEN_PERSONAJE: Personaje = {
  id: 'el-alien-duce',
  region: 'cybersiberia',
  ancla: ALIEN.x,
  piezas: PIEZAS_ALIEN,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};

// Lo que cae en la nieve: para el test, que el bollo quede afuera de la tele y adentro del recinto.
export const BOLLO_EN_LA_NIEVE: P = [ALIEN.x + CX * ALIEN.escala, ALIEN.y + CY * ALIEN.escala];
