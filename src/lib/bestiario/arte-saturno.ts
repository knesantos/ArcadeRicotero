/**
 * El Dr. Saturno (`D-73`, decimoctava vuelta), atendiendo al costado del templo de Momo.
 *
 * *"Dr. Saturno, dame un turno!"* es de *Dr. Saturno*, el cuarto tema de *Momo sampler* (2000), el disco
 * del templo. Por eso está soplado a aerógrafo en las tintas de ese disco, medidas en la tapa: la cara es
 * la máscara de murga de la contratapa, violeta y honda, con los dientes que brillan; el guardapolvo es la
 * plata del envase; y el anillo es el oro y el cobre de las letras de *MOMO SAMPLER*. En la contratapa, los
 * créditos dicen que las estampas del disco son *saturnales*.
 *
 * De la letra son el doctor, la cueva y el turno. Del dibujo, todo lo demás: que no pisa el piso (flota, y
 * el guardapolvo termina en jirones), el anillo del planeta puesto en la cabeza con sus tres lunitas, el
 * espejo de frente de los doctores de antes, el estetoscopio y el turnero de donde salen los boletos.
 *
 * Coordenadas del títere: el (0, 0) es el punto del piso debajo de él (`rig-saturno.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, soplo, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { azar } from './pincel.ts';
import { QUIETO, SATURNO, SATURNO_ARMADO as A, TURNO, marcas, type Momento, type Punto } from './rig-saturno.ts';

type P = Punto;
const f = (v: number): string => (Math.round(v * 100) / 100).toString();

/** Las tintas de *Momo sampler* (`tokens.css`), y la luz del templo. */
const C = {
  hondo: 'var(--bestia-saturno-hondo)',
  violeta: 'var(--bestia-saturno-violeta)',
  lila: 'var(--bestia-saturno-lila)',
  lilaClara: 'var(--bestia-saturno-lila-clara)',
  brillo: 'var(--bestia-saturno-brillo)',
  plata: 'var(--bestia-saturno-plata)',
  plataClara: 'var(--bestia-saturno-plata-clara)',
  oro: 'var(--bestia-saturno-oro)',
  cobre: 'var(--bestia-saturno-cobre)',
  cobreHondo: 'var(--bestia-saturno-cobre-hondo)',
  foco: 'var(--entorno-templo-foco)',
  negro: 'var(--fondo)',
};

/* ------------------------------------------------------------------
   Herramientas
   ------------------------------------------------------------------ */

function curva(pts: readonly P[], cerrada = true): string {
  const n = pts.length;
  const en = (i: number): P => (cerrada ? pts[(i + n) % n]! : pts[Math.min(n - 1, Math.max(0, i))]!);
  let d = `M${f(pts[0]![0])} ${f(pts[0]![1])}`;
  for (let i = 0; i < (cerrada ? n : n - 1); i++) {
    const [p0, p1, p2, p3] = [en(i - 1), en(i), en(i + 1), en(i + 2)];
    d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return cerrada ? `${d} Z` : d;
}
const elipse = (x: number, y: number, rx: number, ry: number): string =>
  `M${f(x - rx)} ${f(y)} a${f(rx)} ${f(ry)} 0 1 0 ${f(rx * 2)} 0 a${f(rx)} ${f(ry)} 0 1 0 ${f(-rx * 2)} 0 Z`;
const caja = (x: number, y: number, w: number, h: number): string => `M${f(x)} ${f(y)}h${f(w)}v${f(h)}h${f(-w)}Z`;
const conGrano = (s: string): string => `<g filter="url(#grano)">${s}</g>`;

/* ------------------------------------------------------------------
   El anillo: dos mitades, la de atrás de la cabeza y la de adelante
   ------------------------------------------------------------------ */

/**
 * Las bandas del anillo: de afuera para adentro, el oro y el cobre de las letras del disco, con la raya
 * honda en el medio, como la división que se le ve al de verdad.
 */
function bandas(): string {
  const { centro: [cx, cy], rx, ry, banda } = A.anillo;
  const k = ry / rx;
  const aro = (r: number, ancho: number, color: string, o = 1): string =>
    `<ellipse cx="${cx}" cy="${cy}" rx="${f(r)}" ry="${f(r * k)}" fill="none" stroke="${color}" stroke-width="${f(ancho)}"${o < 1 ? ` opacity="${f(o)}"` : ''}/>`;
  const r0 = rx - banda / 2;
  return (
    aro(r0, banda, C.cobre) +
    aro(rx - banda * 0.2, banda * 0.36, C.oro) +
    aro(rx - banda * 0.52, banda * 0.12, C.cobreHondo) +
    aro(rx - banda * 0.78, banda * 0.32, C.oro, 0.85) +
    aro(rx - banda * 0.97, banda * 0.08, C.cobreHondo, 0.8) +
    // El soplado: la luz del templo arriba a la izquierda, y lo hondo de la otra punta.
    nube(cx - rx * 0.55, cy - ry * 0.4, rx * 0.4, ry * 0.6, C.foco, 'm', 0.55) +
    nube(cx + rx * 0.8, cy + ry * 0.2, rx * 0.25, ry * 0.9, C.hondo, 'm', 0.6)
  );
}

/** Una mitad del anillo: la de arriba va detrás de la cabeza, la de abajo adelante. Las dos ladeadas. */
function mitad(lado: 'atras' | 'delante'): string {
  const { centro: [cx, cy], rx, ladeo } = A.anillo;
  const corte = lado === 'atras' ? caja(cx - rx - 20, cy - 80, (rx + 20) * 2, 80) : caja(cx - rx - 20, cy, (rx + 20) * 2, 80);
  const adentro = `<g transform="rotate(${ladeo} ${cx} ${cy})">${enmascarado(`m-sat-${lado}`, corte, bandas())}</g>`;
  // La de atrás queda en la sombra de la cabeza: se apaga en el medio.
  const sombra = lado === 'atras' ? nube(cx, cy - 6, 34, 18, C.hondo, 's', 0.55) : '';
  return conGrano(adentro + sombra);
}

/* ------------------------------------------------------------------
   El cuerpo: el guardapolvo de plata, abierto, y el estetoscopio colgado
   ------------------------------------------------------------------ */

/** El guardapolvo: hombros redondos, se abre en campana y termina en jirones, en el aire. */
function siluetaGuardapolvo(): string {
  const rnd = azar(2101);
  // El ruedo, de izquierda a derecha: puntas que cuelgan y entradas que suben, como tela gastada.
  const jirones: P[] = [];
  for (let i = 0, x = -66; x <= 66; x += 9, i++) jirones.push([x, A.ruedo - (i % 2 ? 22 + rnd() * 14 : rnd() * 6)]);
  const pts: P[] = [[-11, -308], [-28, -300], [-46, -290], [-52, -274], [-54, -230], [-58, -160], [-64, -90], ...jirones, [64, -90], [58, -160], [54, -230], [52, -274], [46, -290], [28, -300], [11, -308]];
  return `M${pts.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L')} Z`;
}

function cuerpo(): string {
  const G = siluetaGuardapolvo();
  // Lo de adentro del guardapolvo abierto: una V honda que baja del cuello y se abre.
  const abierto = `M-12 -300 L12 -300 L22 -150 L30 ${A.ruedo - 10} L-30 ${A.ruedo - 10} L-22 -150 Z`;
  const solapas = curva([[-12, -302], [-28, -290], [-24, -250], [-12, -232], [-6, -270]]) + curva([[12, -302], [28, -290], [24, -250], [12, -232], [6, -270]]);
  const bolsillo = (x: number, y: number): string =>
    forma(caja(x - 14, y, 28, 22), C.lila, 0.75) + trazo(`M${x - 14} ${y} l28 0`, C.plataClara, 1.6, 0.8);
  // En el bolsillo, el termómetro y una lapicera, asomando.
  const termometro = trazo(`M-38 -128 L-36 -156`, C.plataClara, 2.4) + forma(elipse(-36, -157, 2, 2), C.cobre) + trazo(`M-30 -128 L-31 -150`, C.cobreHondo, 2.2);
  const botones = [-210, -170, -130].map((y) => forma(elipse(25 - (y + 210) * 0.02, y, 2.4, 2.4), C.plataClara) + forma(elipse(24.6 - (y + 210) * 0.02, y - 0.6, 1, 1), C.brillo)).join('');
  // El estetoscopio, colgado del cuello: el cobre en U sobre el pecho.
  const tubo = `M-16 -302 C-24 -270 -16 -236 0 -232 C16 -236 24 -270 16 -302`;
  const adentro =
    forma(G, C.plata) +
    // La luz del templo arriba a la izquierda; abajo y a la derecha la plata se hunde en violeta.
    nube(-24, -250, 40, 50, C.plataClara, 'l', 0.7) +
    nube(40, -150, 40, 120, C.violeta, 'l', 0.75) +
    nube(-56, -120, 18, 90, C.lila, 'm', 0.6) +
    nube(0, A.ruedo, 90, 50, C.violeta, 'l', 0.85) +
    // Los pliegues de la campana, soplados.
    [-44, -20, 18, 42].map((x, i) => nube(x, -100, 5, 70, i % 2 ? C.lila : C.plataClara, 'm', 0.5, x * 0.12)).join('') +
    forma(abierto, C.hondo) + nube(0, -220, 14, 60, C.violeta, 'm', 0.7) +
    forma(solapas, C.plataClara) + nube(-20, -280, 8, 16, C.brillo, 's', 0.4) +
    bolsillo(-34, -128) + termometro + bolsillo(34, -108) + botones;
  return conGrano(
    enmascarado('m-sat-guardapolvo', G, adentro) +
    // El cuello, en la sombra de la cabeza.
    forma(caja(-11, -318, 22, 16), C.hondo) +
    trazo(tubo, C.cobreHondo, 4.2) + trazo(tubo, C.cobre, 2.6) + trazo(`M-14 -294 C-20 -270 -14 -246 0 -242`, C.oro, 0.9, 0.7),
  );
}

/* ------------------------------------------------------------------
   La cara: la máscara de murga de la contratapa, con la vincha y el espejo
   ------------------------------------------------------------------ */

/** La cara se dibuja a una medida y se agranda desde el medio: chica, en la escena se perdía. */
const agrandada = (s: string): string => `<g transform="translate(${A.cara[0]} ${A.cara[1]}) scale(${A.agranda}) translate(${-A.cara[0]} ${-A.cara[1]})">${s}</g>`;
/** Dónde queda un punto de la cara ya agrandada. */
const enLaCara = ([x, y]: P): P => [A.cara[0] + (x - A.cara[0]) * A.agranda, A.cara[1] + (y - A.cara[1]) * A.agranda];

function cara(): string {
  const [cx, cy] = A.cara;
  const [rx, ry] = A.radioCara;
  const OVALO = curva([[cx, cy - ry], [cx + rx * 0.8, cy - ry * 0.72], [cx + rx, cy - ry * 0.05], [cx + rx * 0.82, cy + ry * 0.55], [cx + rx * 0.34, cy + ry * 0.96], [cx, cy + ry], [cx - rx * 0.34, cy + ry * 0.96], [cx - rx * 0.82, cy + ry * 0.55], [cx - rx, cy - ry * 0.05], [cx - rx * 0.8, cy - ry * 0.72]]);
  const ojos = [-1, 1].map((s) => {
    const [ox, oy] = [cx + s * 12, cy - 6];
    return (
      // La cuenca honda, y adentro un puntito de luz que mira.
      forma(elipse(ox, oy, 9, 7), C.hondo) + nube(ox, oy - 4, 10, 4, C.negro, 's', 0.6) +
      forma(elipse(ox + 1, oy + 0.5, 1.5, 1.5), C.brillo) + nube(ox + 1, oy + 0.5, 4, 4, C.brillo, 's', 0.3)
    );
  }).join('');
  // Las rayas de murga que bajan por los cachetes, como en la contratapa.
  const rayas = [-1, 1].map((s) => soplo(`M${cx + s * 10} ${cy + 2} L${cx + s * 16} ${cy + 2} L${cx + s * 18} ${cy + 30} L${cx + s * 12} ${cy + 30} Z`, C.hondo, 's', 0.75)).join('');
  // La boca: una raja honda con tres dientes que brillan, como los de la contratapa.
  const boca = forma(`M${cx - 13} ${cy + 20} Q${cx} ${cy + 26} ${cx + 13} ${cy + 20} Q${cx} ${cy + 30} ${cx - 13} ${cy + 20} Z`, C.negro) +
    [-5, 0, 5].map((dx) => forma(caja(cx + dx - 1.6, cy + 21.6, 3.2, 3), C.brillo, 0.9)).join('') + nube(cx, cy + 23, 6, 2, C.brillo, 'xs', 0.4);
  const vincha = `M${cx - rx - 1} ${cy - 22} Q${cx} ${cy - 32} ${cx + rx + 1} ${cy - 22} L${cx + rx + 1} ${cy - 16} Q${cx} ${cy - 26} ${cx - rx - 1} ${cy - 16} Z`;
  const [ex, ey] = A.espejo;
  const espejo = forma(elipse(ex, ey, 12, 11), C.cobreHondo) + forma(elipse(ex, ey, 10.5, 9.6), C.oro) + nube(ex - 3, ey - 3, 5, 4, C.brillo, 's', 0.8) + nube(ex + 4, ey + 4, 5, 4, C.cobre, 's', 0.8) + forma(elipse(ex, ey, 2, 2), C.hondo);
  const adentro =
    forma(OVALO, C.violeta) +
    // La frente donde le pega la luz, y el lomo de la nariz; lo demás se hunde.
    nube(cx - 8, cy - 24, 22, 10, C.lila, 'm', 0.9) + nube(cx - 12, cy - 26, 10, 5, C.lilaClara, 's', 0.8) +
    nube(cx, cy + 6, 4, 14, C.lilaClara, 's', 0.7) + nube(cx - 18, cy + 8, 8, 12, C.lila, 'm', 0.6) +
    nube(cx + 20, cy + 6, 10, 26, C.hondo, 'm', 0.8) + nube(cx, cy + ry, 30, 10, C.hondo, 'm', 0.8) +
    rayas + ojos + boca;
  return conGrano(agrandada(enmascarado('m-sat-cara', OVALO, adentro) + forma(vincha, C.cobreHondo) + trazo(`M${cx - rx} ${cy - 21} Q${cx} ${cy - 30.4} ${cx + rx} ${cy - 21}`, C.cobre, 1, 0.8) + espejo));
}

/** El destello del espejo de frente: una estrella de luz del oro del anillo. */
function destello(): string {
  const [ex, ey] = enLaCara(A.espejo);
  const rayo = (a: number, l: number): string => {
    const r = (a * Math.PI) / 180;
    return `M${f(ex)} ${f(ey)} L${f(ex + Math.cos(r + 0.06) * l)} ${f(ey + Math.sin(r + 0.06) * l)} L${f(ex + Math.cos(r - 0.06) * l)} ${f(ey + Math.sin(r - 0.06) * l)} Z`;
  };
  return nube(ex, ey, 22, 20, C.oro, 'm', 0.8) + nube(ex, ey, 9, 9, C.brillo, 's', 0.9) + soplo([0, 90, 180, 270].map((a) => rayo(a, 34)).join(''), C.brillo, 'xs', 0.85) + soplo([45, 135, 225, 315].map((a) => rayo(a, 18)).join(''), C.oro, 'xs', 0.8);
}

/** El halo de atrás de la cabeza: la luz del templo que junta el anillo. */
function halo(): string {
  const [cx, cy] = A.anillo.centro;
  return nube(cx, cy, 96, 70, C.foco, 'xl', 0.35) + nube(cx, cy, 60, 44, C.oro, 'l', 0.3) + nube(cx, cy + 10, 120, 40, C.lila, 'xl', 0.35);
}

/* ------------------------------------------------------------------
   Los brazos: el del turnero y el del estetoscopio
   ------------------------------------------------------------------ */

/** Una manga del guardapolvo que cuelga del hombro hasta la muñeca, con la mano violeta de la máscara. */
function manga(n: 0 | 1): string {
  const [sx, sy] = A.hombros[n];
  const [hx, hy] = A.manos[n];
  const s = n === 0 ? -1 : 1;
  const [wx, wy] = [hx - s * 1, hy - 10];
  const M = curva([[sx - 12, sy - 4], [sx + 12, sy - 4], [sx + s * 4 + 10, sy + 40], [wx + 11, wy - 4], [wx + 10, wy + 4], [wx - 10, wy + 4], [wx - 11, wy - 4], [sx + s * 4 - 10, sy + 40]]);
  const mano = curva([[wx - 8, wy + 2], [wx + 8, wy + 2], [hx + 9, hy + 6], [hx + 6, hy + 14], [hx - 6, hy + 14], [hx - 9, hy + 6]]);
  return (
    enmascarado(`m-sat-manga-${n}`, M,
      forma(M, C.plata) + nube(sx - s * 6, sy + 30, 10, 40, n ? C.violeta : C.plataClara, 'm', 0.75) + nube(wx, wy, 16, 14, C.violeta, 'm', 0.7) +
      nube(sx + s * 10, sy + 70, 6, 50, C.lila, 'm', 0.6) +
      // El canto de adentro de la manga, hundido en violeta, para que se despegue del guardapolvo.
      nube((sx + wx) / 2 - s * 9, (sy + wy) / 2, 5, 80, C.hondo, 's', 0.8, s * -6)) +
    trazo(`M${f(wx - 10)} ${f(wy + 3)} L${f(wx + 10)} ${f(wy + 3)}`, C.plataClara, 2) +
    enmascarado(`m-sat-mano-${n}`, mano, forma(mano, C.violeta) + nube(hx - 3, hy + 4, 6, 6, C.lila, 's', 0.9) + nube(hx + 4, hy + 12, 6, 4, C.hondo, 's', 0.8))
  );
}

/** El turnero: la cajita de bronce con el rollo de boletos, y la lengua del que sigue asomando. */
function turnero(): string {
  const [tx, ty] = A.turnero;
  const cajita = caja(tx - 13, ty - 4, 26, 20);
  return (
    enmascarado('m-sat-turnero', cajita, forma(cajita, C.cobre) + nube(tx - 6, ty, 10, 8, C.oro, 's', 0.8) + nube(tx + 8, ty + 12, 10, 8, C.cobreHondo, 's', 0.9)) +
    forma(elipse(tx, ty - 6, 11, 5), C.plataClara) + forma(elipse(tx, ty - 6, 4, 2), C.lila) +
    forma(caja(tx - 6, ty - 14, 12, 8), C.plataClara) + trazo(`M${tx - 6} ${ty - 14} l12 0`, C.lila, 1, 0.8) +
    trazo(`M${tx - 9} ${ty + 6} l18 0`, C.cobreHondo, 1.4)
  );
}

/** La campana del estetoscopio en la mano 2, y el tubo que sube hasta el pecho. */
function estetoscopio(): string {
  const [hx, hy] = A.manos[1];
  const tubo = `M${hx} ${hy - 2} C${hx + 4} ${hy - 50} ${hx - 10} ${hy - 80} ${30} ${-240}`;
  return (
    trazo(tubo, C.cobreHondo, 4) + trazo(tubo, C.cobre, 2.4) +
    forma(elipse(hx, hy + 4, 9, 9), C.cobreHondo) + forma(elipse(hx, hy + 4, 7.4, 7.4), C.plataClara) + nube(hx - 2, hy + 2, 3.4, 3.4, C.brillo, 's', 0.9) + forma(elipse(hx + 2, hy + 6, 2.4, 2.4), C.lila, 0.8)
  );
}

/* ------------------------------------------------------------------
   Las lunitas y el boleto
   ------------------------------------------------------------------ */

function luna(): string {
  const r = A.radioLuna;
  return conGrano(enmascarado('m-sat-luna', elipse(0, 0, r, r), forma(elipse(0, 0, r, r), C.lilaClara) + nube(-2, -2, r * 0.6, r * 0.6, C.plataClara, 's', 0.9) + nube(r * 0.6, r * 0.5, r * 0.8, r * 0.8, C.hondo, 's', 0.85)));
}

/** El boleto: un papelito de la plata del envase, picado arriba y abajo, con el número en cobre. */
function boleto(): string {
  const [w, h] = [26, 14];
  const picado = Array.from({ length: 7 }, (_, i) => forma(elipse(-w / 2 + 2 + i * ((w - 4) / 6), -h / 2, 0.9, 0.9), C.violeta) + forma(elipse(-w / 2 + 2 + i * ((w - 4) / 6), h / 2, 0.9, 0.9), C.violeta)).join('');
  // El número: dos cifras de turnero, hechas con rayas, que no se leen pero se entienden.
  const numero = trazo(`M-5 -3 L-2 -4 L-2 4 M1 -3 Q4 -5 5 -2 Q5 0 1 4 L6 4`, C.cobreHondo, 1.3);
  return conGrano(forma(caja(-w / 2, -h / 2, w, h), C.plataClara) + nube(4, 3, 10, 5, C.lila, 's', 0.4) + picado + trazo(`M${-w / 2 + 3} -5 l0 10`, C.cobre, 0.8, 0.8) + numero);
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 3.2;
const { centro: [AX, AY], rx: ARX } = A.anillo;

export const PIEZAS_SATURNO: readonly Pieza[] = [
  { nombre: 'saturno-halo', caja: [AX - 140, AY - 100, 280, 200], dibujo: halo(), densidad: 1 },
  { nombre: 'saturno-anillo-atras', caja: [AX - ARX - 8, AY - 44, (ARX + 8) * 2, 54], dibujo: mitad('atras'), densidad: D },
  { nombre: 'saturno-cuerpo', caja: [-72, -322, 144, 300], dibujo: cuerpo(), densidad: D * 0.8 },
  { nombre: 'saturno-cara', caja: [-42, -404, 84, 104], dibujo: cara(), densidad: D * 1.2 },
  { nombre: 'saturno-espejo', caja: [enLaCara(A.espejo)[0] - 38, enLaCara(A.espejo)[1] - 38, 76, 76], dibujo: destello(), densidad: 1.6 },
  { nombre: 'saturno-anillo-delante', caja: [AX - ARX - 8, AY - 10, (ARX + 8) * 2, 54], dibujo: mitad('delante'), densidad: D },
  { nombre: 'saturno-brazo-1', caja: [-80, -298, 48, 180], dibujo: conGrano(manga(0) + turnero()), densidad: D },
  { nombre: 'saturno-brazo-2', caja: [24, -298, 52, 174], dibujo: conGrano(manga(1) + estetoscopio()), densidad: D },
  { nombre: 'saturno-luna', caja: [-9, -9, 18, 18], dibujo: luna(), densidad: 5 },
  { nombre: 'saturno-boleto', caja: [-15, -9, 30, 18], dibujo: boleto(), densidad: 5 },
];

const img = imagenesDe(PIEZAS_SATURNO);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** El Dr. Saturno armado con las marcas de un momento (`marcas`, `rig-saturno.ts`). */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  const lunas = (lado: 'atras' | 'delante'): string => A.lunas.map((_, i) => parte(`luna-${lado}-${i + 1}`, img('saturno-luna'), t[`luna-${lado}-${i + 1}`], o[`luna-${lado}-${i + 1}`])).join('');
  return (
    parte('sombra', `<ellipse cx="0" cy="0" rx="52" ry="9" class="bt-saturno-sombra"/>`, t.sombra, o.sombra) +
    parte('flota',
      parte('halo', img('saturno-halo'), '', o.halo) +
      img('saturno-cuerpo') +
      parte('brazo-2', img('saturno-brazo-2'), t['brazo-2']) +
      parte('cabeza',
        parte('anillo-atras', img('saturno-anillo-atras'), t['anillo-atras']) +
        lunas('atras') +
        img('saturno-cara') +
        parte('espejo', img('saturno-espejo'), '', o.espejo) +
        parte('anillo-delante', img('saturno-anillo-delante'), t['anillo-delante']) +
        lunas('delante'),
        t.cabeza) +
      parte('brazo-1', img('saturno-brazo-1'), t['brazo-1']),
      t.flota) +
    parte('boleto', img('saturno-boleto'), t.boleto, o.boleto)
  );
}

/** El Dr. Saturno en un momento, sin lo que lo hace tocable: para el test, el retrato y para mirarlo. */
export function saturnoEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/** El títere que se toca, en la pose quieta: flotando al costado del templo, con el anillo ladeado. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--saturno" data-id="el-doctor-saturno" role="button" tabindex="0" aria-label="${nombres.get('el-doctor-saturno') ?? 'El Dr. Saturno'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: dándote un turno, con el anillo desbocado, en su rincón del templo. */
export const RETRATO = { caja: [SATURNO.x - 86, SATURNO.piso - 280, 170, 292] as const };
function retrato(): string {
  const fondo = (nombre: string): string => `<image href="/bestiario/${nombre}.webp" x="-300" y="0" width="1500" height="640" preserveAspectRatio="none"/>`;
  return fondo('templo-lejos') + saturnoEn(TURNO);
}

export const SATURNO_DOCTOR: Personaje = {
  id: 'el-doctor-saturno',
  region: 'el-templo',
  ancla: SATURNO.x,
  piezas: PIEZAS_SATURNO,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
