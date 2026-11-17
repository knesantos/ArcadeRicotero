/**
 * El potrero de los techos (`D-91`, tanda 4): la mitad de abajo del baldío, que era un piso violeta vacío.
 *
 * El recinto (`baldioLejos`, la chapa, los yuyos de adelante y todos los que viven ahí) es de `arte.ts`,
 * `arte-baldio.ts` y `escenas.ts`, y acá no se edita: otra sesión lo está tocando (`T-529`). Los techos son
 * un recinto entero, sin capas: no tienen un «lejos» ni un «piso» a los que sumarles. Lo que el camino pinta
 * por su cuenta va en **una mano que entra justo después del telón** (`EN_EL_RECINTO`, en
 * `escenas-camino.ts`): queda arriba del fondo y debajo de todos los bichos, de la chapa y de los yuyos.
 *
 * - **La senda**: tierra pisada que cruza el baldío en escorzo y se mete por **un boquete en la medianera**.
 *   Es el punto de fuga. Del otro lado se ve la otra cuadra, con su farol.
 * - **El potrero**: un arco pintado con cal en la medianera, el área gastada adelante, una pelota de trapo.
 * - **Los charcos**: devuelven, rotas, las chispas de los dos faroles.
 * - **El pasto crecido** contra la medianera, en matas con huecos, y los ladrillos que se cayeron del boquete.
 * - **Las ventanas prendidas** en lo negro de los techos, en tres montones: amarillas como la llama de la
 *   contratapa de *Un baión*, y alguna con la luz fría de una tele.
 * - **El que espía** (`VECINO`): si te quedás quieto, alguien se asoma por el boquete. Una sombra con dos ojos.
 *
 * Todo es crayón, como la tapa: rayones cortos que acá apuntan al boquete, así el piso entero fuga para ahí.
 * Nada de esto viene de una letra: es el baldío de cualquier barrio.
 */

import { forma, nube, trazo, type Pieza } from './aerografo.ts';
import { azar } from './pincel.ts';
import { cinta, fuga, linea } from './escorzo.ts';
import { CHAPA } from './rig.ts';

const B = {
  noche: 'var(--entorno-baion-noche)',
  violeta: 'var(--entorno-baion-violeta)',
  lila: 'var(--entorno-baion-lila)',
  luz: 'var(--entorno-baion-luz)',
  azul: 'var(--entorno-baion-azul)',
  rosa: 'var(--entorno-baion-rosa)',
  llama: 'var(--entorno-bajo-llama)',
  llamaClara: 'var(--entorno-bajo-llama-clara)',
  negro: 'var(--fondo)',
};

const f = (v: number): string => (Math.round(v * 10) / 10).toString();

/** Lo que se ve de la medianera: de abajo de la chapa al piso del baldío. */
export const MEDIANERA = { arriba: CHAPA.abajo + 12, pie: 386 } as const;
/** El boquete: el hueco en la medianera por donde se va la senda. `x` es su medio. */
export const BOQUETE = { x: 968, ancho: 62, alto: 50 } as const;
/** La senda: de acá (ancha, abajo de la pantalla) al pie del boquete. */
export const SENDA = { desde: [1064, 664], hasta: [968, 388], cerca: 176, lejos: 16 } as const;
/** El arco pintado en la medianera, y su pelota. */
export const ARCO = { x0: 1066, x1: 1180, pelota: [1104, 404] } as const;
/** La caja de la mano de abajo: de las ventanas para abajo. */
export const CAJA_DEL_POTRERO = [0, 240, 1500, 400] as const;

/** Rayones de crayón. Con `hacia`, cada uno apunta a ese punto y se alarga cuanto más lejos está de él. */
function rayones(
  [x0, y0, x1, y1]: readonly [number, number, number, number],
  cuantos: number,
  colores: readonly string[],
  semilla: number,
  o: { hacia?: readonly [number, number]; angulo?: number; largo?: readonly [number, number]; grueso?: readonly [number, number]; fuerza?: number; temblor?: number; donde?: (x: number, y: number) => boolean } = {},
): string {
  const { hacia, angulo = 0, largo = [8, 28], grueso = [2, 4.4], fuerza = 1, temblor = 0.4, donde } = o;
  const rnd = azar(semilla);
  let s = '';
  for (let i = 0; i < cuantos; i++) {
    const x = x0 + rnd() * (x1 - x0);
    const y = y0 + rnd() * (y1 - y0);
    let a = (angulo * Math.PI) / 180 + (rnd() - 0.5) * temblor;
    let k = 1;
    if (hacia) {
      a = Math.atan2(y - hacia[1], x - hacia[0]) + (rnd() - 0.5) * temblor * 0.5;
      // Lo que está cerca del que mira es más grande: es el mismo escorzo de la senda.
      k = 0.35 + Math.min(1.4, Math.hypot(x - hacia[0], y - hacia[1]) / 190);
    }
    const l = (largo[0] + rnd() * (largo[1] - largo[0])) * k;
    const color = colores[Math.floor(rnd() * colores.length)]!;
    const w = (grueso[0] + rnd() * (grueso[1] - grueso[0])) * Math.min(1.2, 0.5 + k * 0.5);
    const op = (0.45 + rnd() * 0.45) * fuerza;
    if (donde && !donde(x, y)) continue;
    s += trazo(`M${f(x)} ${f(y)} l${f(Math.cos(a) * l)} ${f(Math.sin(a) * l)}`, color, w, op);
  }
  return s;
}

/** Una mata de pasto crecido: rayones para arriba, abiertos en abanico, más oscuros al pie. */
function mata(x: number, pie: number, alto: number, ancho: number, semilla: number): string {
  const rnd = azar(semilla);
  let s = nube(x, pie + 1, ancho * 0.7, 3.4, B.negro, 's', 0.7);
  const n = Math.round(ancho / 2.6);
  for (let i = 0; i < n; i++) {
    const u = i / Math.max(1, n - 1) - 0.5;
    const h = alto * (0.5 + rnd() * 0.6) * (1 - Math.abs(u) * 0.7);
    const cae = u * ancho * 0.9 + (rnd() - 0.5) * 7;
    const color = rnd() < 0.55 ? B.negro : rnd() < 0.6 ? B.violeta : B.azul;
    s += trazo(`M${f(x + u * ancho)} ${f(pie + 2)} q${f(cae * 0.2)} ${f(-h * 0.6)} ${f(cae * 0.6)} ${f(-h)}`, color, 1.8 + rnd() * 1.8, 0.75 + rnd() * 0.25);
  }
  // Dos o tres puntas que agarran la luz del farol.
  for (let i = 0; i < 3; i++) {
    const u = rnd() - 0.5;
    const h = alto * (0.7 + rnd() * 0.4);
    s += trazo(`M${f(x + u * ancho * 0.8)} ${f(pie - h * 0.5)} q${f(u * 4)} ${f(-h * 0.3)} ${f(u * ancho * 0.5)} ${f(-h * 0.5)}`, B.lila, 1.3, 0.55);
  }
  return s;
}

/** Un charco: agua negra de canto roto, con las chispas de un farol devueltas en manchas acostadas y cortadas. */
function charco(x: number, y: number, rx: number, ry: number, semilla: number, id: string): string {
  const rnd = azar(semilla);
  const pts: string[] = [];
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2;
    const k = 0.82 + rnd() * 0.3;
    pts.push(`${f(x + Math.cos(a) * rx * k)} ${f(y + Math.sin(a) * ry * k)}`);
  }
  const silueta = `M${pts.join(' L')} Z`;
  let adentro = forma(silueta, B.negro) + nube(x - rx * 0.2, y, rx * 0.7, ry * 0.8, B.azul, 'm', 0.35);
  // Las chispas: más anchas y claras en el medio, y cada una corrida de la de arriba.
  for (let i = 0; i < 9; i++) {
    const cy = y - ry * 0.7 + (i / 8) * ry * 1.5;
    const w = rx * (0.5 - Math.abs(i - 3.5) * 0.07) * (0.6 + rnd() * 0.7);
    const cx = x + rx * 0.12 + (rnd() - 0.5) * rx * 0.5;
    adentro += trazo(`M${f(cx - w / 2)} ${f(cy)} l${f(w)} ${f((rnd() - 0.5) * 1.2)}`, i % 3 ? B.lila : B.luz, 1.4 + rnd() * 1.4, 0.5 + rnd() * 0.4);
  }
  return (
    // La tierra mojada alrededor, y el agua.
    nube(x, y + ry * 0.3, rx * 1.2, ry * 1.7, B.negro, 'm', 0.55) +
    `<clipPath id="${id}"><path d="${silueta}"/></clipPath><g clip-path="url(#${id})">${adentro}</g>` +
    // El canto de adelante agarra un pelo de luz.
    trazo(`M${f(x - rx * 0.7)} ${f(y + ry * 0.86)} Q${f(x)} ${f(y + ry * 1.2)} ${f(x + rx * 0.66)} ${f(y + ry * 0.8)}`, B.lila, 1.3, 0.5)
  );
}

/** Las ventanas prendidas, en tres montones: `[x, y, ancho, alto, tele]`. Todas de 246 para abajo, donde los techos ya son negro seguro. */
export const VENTANAS: readonly (readonly [number, number, number, number, boolean])[] = [
  [446, 250, 11, 14, false], [466, 252, 9, 12, false], [500, 262, 12, 10, true],
  [1006, 248, 12, 15, false], [1030, 256, 9, 11, false], [1052, 250, 10, 13, true], [1084, 262, 13, 9, false],
  [1272, 254, 11, 13, false], [1298, 250, 9, 14, false], [1326, 264, 12, 9, true],
];

function ventanas(): string {
  let s = '';
  for (const [x, y, w, h, tele] of VENTANAS) {
    const color = tele ? B.luz : B.llamaClara;
    s +=
      nube(x + w / 2, y + h / 2, w * 1.5, h * 1.3, tele ? B.lila : B.llama, 's', 0.4) +
      forma(`M${x} ${y} l${w} ${-0.8} l${0.6} ${h} l${-w - 0.8} ${0.6} Z`, color, tele ? 0.75 : 0.9) +
      // La cruz del marco, y una cortina a medio correr.
      trazo(`M${f(x + w / 2)} ${y} l0.3 ${h} M${x} ${f(y + h * 0.45)} l${w} -0.4`, B.negro, 1.3) +
      (tele ? '' : forma(`M${x} ${y} l${f(w * 0.34)} 0 l${f(-w * 0.1)} ${h} l${f(-w * 0.26)} 0 Z`, B.llama, 0.7));
  }
  return s;
}

/** El boquete: los ladrillos rotos, lo que se ve del otro lado y los cascotes al pie. */
function boquete(): string {
  const { x, ancho, alto } = BOQUETE;
  const pie = MEDIANERA.pie;
  const rnd = azar(4107);
  // El canto, mordido: sube a los saltos, hace el arco y baja.
  const pts: [number, number][] = [[x - ancho / 2, pie + 2]];
  for (let i = 0; i <= 12; i++) {
    const a = Math.PI * (1 - i / 12);
    const k = 0.84 + rnd() * 0.3;
    pts.push([x + Math.cos(a) * (ancho / 2) * k, pie - Math.sin(a) * alto * k - (i > 0 && i < 12 ? 6 : 0)]);
  }
  pts.push([x + ancho / 2, pie + 2]);
  const hueco = `M${pts.map(([px, py]) => `${f(px)} ${f(py)}`).join(' L')} Z`;
  // Del otro lado: la otra cuadra, más clara y más fría, con su farol chico y la senda que sigue.
  const otro = [x + 9, pie - alto * 0.62] as const;
  let chispas = '';
  // Pocas y cortas: a 1280 diez chispas largas se leían como una cruz blanca en una caja negra.
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + rnd();
    chispas += trazo(`M${f(otro[0] + Math.cos(a) * 3)} ${f(otro[1] + Math.sin(a) * 3)} l${f(Math.cos(a) * (2 + rnd() * 2.4))} ${f(Math.sin(a) * (2 + rnd() * 2.4))}`, B.luz, 0.9, 0.6);
  }
  const adentro =
    forma(hueco, B.violeta) +
    // La otra cuadra está más alumbrada que el baldío: el hueco es claro, no una caja negra.
    nube(x, pie - 8, ancho * 0.7, 20, B.lila, 'm', 0.8) +
    nube(otro[0], otro[1], 14, 12, B.luz, 's', 0.4) +
    chispas +
    nube(otro[0], otro[1], 2.4, 2.4, B.luz, 'xs') +
    // Un techo lejano y su antena, del otro lado.
    forma(`M${x - ancho / 2} ${pie - 16} l14 -9 l12 8 l8 -5 l10 6 l${ancho} 2 l0 8 l${-ancho - 44} 0 Z`, B.negro, 0.85) +
    trazo(`M${x - 12} ${pie - 22} l0 -11 m-4 3 l8 0`, B.negro, 1.1) +
    // La senda, que sigue.
    forma(`M${x - 10} ${pie + 2} L${x - 2} ${pie - 9} L${x + 4} ${pie - 9} L${x + 12} ${pie + 2} Z`, B.rosa, 0.5);
  let ladrillos = '';
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i]!;
    if (rnd() < 0.75) ladrillos += trazo(`M${f(px - 4)} ${f(py + 1)} l${f(7 + rnd() * 5)} ${f((rnd() - 0.5) * 2)}`, rnd() < 0.6 ? B.rosa : B.lila, 2.6, 0.85);
  }
  let cascotes = '';
  for (let i = 0; i < 9; i++) {
    const cx = x + (rnd() - 0.5) * ancho * 1.9;
    const cy = pie + 4 + rnd() * 16;
    if (Math.abs(cx - x) < 12) continue;
    const w = 4 + rnd() * 6;
    cascotes += nube(cx + 1, cy + 2, w * 0.9, 1.6, B.negro, 'xs', 0.7) + forma(`M${f(cx - w / 2)} ${f(cy)} l${f(w * 0.2)} ${f(-w * 0.5)} l${f(w * 0.7)} ${f(-0.6)} l${f(w * 0.1)} ${f(w * 0.56)} Z`, i % 3 ? B.rosa : B.violeta, 0.9);
  }
  return `<clipPath id="pt-boquete"><path d="${hueco}"/></clipPath><g clip-path="url(#pt-boquete)">${adentro}</g>` + trazo(hueco, B.negro, 2.2, 0.9) + ladrillos + cascotes;
}

/** El arco, pintado con cal a brocha gorda: dos palos, el travesaño torcido y la cal que chorreó. */
function arco(): string {
  const { x0, x1, pelota } = ARCO;
  const [arriba, pie] = [MEDIANERA.arriba + 10, MEDIANERA.pie];
  const rnd = azar(4211);
  let chorreado = '';
  for (let i = 0; i < 7; i++) {
    const x = x0 + rnd() * (x1 - x0);
    chorreado += trazo(`M${f(x)} ${f(arriba + 2)} l${f((rnd() - 0.5) * 1.4)} ${f(5 + rnd() * 12)}`, B.luz, 1.2, 0.4);
  }
  const [bx, by] = pelota;
  return (
    trazo(`M${x0} ${pie} L${x0 + 2} ${arriba + 1} L${x1 - 1} ${arriba - 2} L${x1 + 1} ${pie}`, B.luz, 4.6, 0.8) +
    trazo(`M${x0 + 1.5} ${pie - 4} L${x0 + 3} ${arriba + 3} L${x1 - 2} ${arriba}`, B.lila, 1.6, 0.6) +
    chorreado +
    // El área: la tierra gastada de tanto atajar, apenas más clara y sin un pasto.
    nube((x0 + x1) / 2, pie + 22, (x1 - x0) * 0.62, 15, B.violeta, 'm', 0.85) +
    nube((x0 + x1) / 2 - 8, pie + 20, (x1 - x0) * 0.3, 7, B.rosa, 'm', 0.35) +
    // La pelota de trapo, apoyada.
    nube(bx + 2, by + 6, 9, 2.4, B.negro, 'xs', 0.8) +
    `<circle cx="${bx}" cy="${by}" r="6.4" fill="${B.lila}"/>` +
    nube(bx + 2, by + 2, 4, 4, B.noche, 'xs', 0.6) +
    trazo(`M${bx - 6} ${by - 1} q6 -3 12 1 M${bx - 2} ${by - 6} q-2 6 3 12 M${bx - 5} ${by + 3} q5 2 10 -2`, B.noche, 1, 0.85) +
    nube(bx - 2, by - 3, 2, 1.6, B.luz, 'xs', 0.8)
  );
}

/** La mano de abajo de los techos: entra después del telón (`baldio-lejos`) y antes de todos los demás. */
export function potreroBajo(): string {
  const [x0, y0, w, h] = CAJA_DEL_POTRERO;
  const pie = MEDIANERA.pie;
  const fugaEn = [BOQUETE.x, pie - 10] as const;
  const ps = fuga(SENDA.desde, SENDA.hasta, SENDA.cerca, SENDA.lejos, 28, 44, 0.9);
  const enLaSenda = (x: number, y: number): boolean => {
    const p = ps.find(([, py]) => py <= y) ?? ps[ps.length - 1]!;
    return Math.abs(x - p[0]) < p[2] * 0.56;
  };
  // El pasto contra la medianera, en montones con huecos: tupido a los lados del boquete, nada adelante del arco.
  let pasto = '';
  const rnd = azar(4003);
  for (let x = 596; x < 1500; x += 16 + rnd() * 30) {
    const lejosDelBoquete = Math.abs(x - BOQUETE.x);
    if (lejosDelBoquete < BOQUETE.ancho * 0.62 || (x > ARCO.x0 - 12 && x < ARCO.x1 + 12)) continue;
    // Tres montones (contra el boquete, pasando el arco y al fondo) y, entre ellos, algún pelo suelto.
    const tupido = Math.max(1 - lejosDelBoquete / 130, 1 - Math.abs(x - 1260) / 90, 1 - Math.abs(x - 640) / 60, 0.12);
    if (rnd() > tupido + 0.1) continue;
    pasto += mata(x, pie + 2 + rnd() * 5, 12 + tupido * 26 + rnd() * 8, 9 + tupido * 10, 4300 + Math.round(x));
  }
  // Matas sueltas en el baldío, más grandes cuanto más cerca, en dos montones a los lados de la senda.
  let matas = '';
  for (const [mx, my, k] of [[902, 452, 0.7], [924, 468, 0.9], [1108, 520, 1.25], [1136, 512, 1], [1210, 438, 0.6], [624, 446, 0.7], [1128, 592, 1.5]] as const) {
    matas += mata(mx, my, 26 * k, 15 * k, 4400 + mx);
  }
  // Una chapa caída de los techos, acostada en la tierra: se ve de canto, en escorzo.
  const chapa =
    nube(1196, 500, 44, 6, B.negro, 's', 0.8) +
    forma('M1150 492 L1226 480 L1244 492 L1166 506 Z', B.violeta) +
    [0, 1, 2, 3, 4, 5, 6].map((i) => trazo(`M${1156 + i * 11} ${f(492 - i * 1.8)} l17 12.6`, i % 2 ? B.lila : B.noche, 2, 0.75)).join('') +
    trazo('M1150 492 L1226 480 L1244 492', B.luz, 1.3, 0.55);
  return (
    `<g filter="url(#rociado)">` +
    `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="var(--fondo)" fill-opacity="0"/>` +
    ventanas() +
    // La medianera: húmeda y más oscura contra el piso, así se despega de la tierra.
    rayones([590, pie - 16, 1500, pie - 2], 150, [B.noche, B.noche, B.violeta], 4011, { angulo: 0, largo: [10, 30], grueso: [2, 4], fuerza: 0.8, temblor: 0.1 }) +
    arco() +
    boquete() +
    // El piso: más negro contra la pared y abajo de todo; en el medio, donde cae el farol, se ve la tierra.
    nube(1050, pie + 14, 520, 15, B.negro, 'l', 0.55) +
    nube(1040, 480, 200, 46, B.violeta, 'xl', 0.55) +
    // Todos los rayones del piso apuntan al boquete: el baldío entero fuga para ahí.
    rayones([600, pie + 8, 1500, 640], 300, [B.violeta, B.violeta, B.azul, B.noche, B.rosa], 4021, { hacia: fugaEn, largo: [10, 26], grueso: [2, 4.2], fuerza: 0.62, donde: (x, y) => !enLaSenda(x, y) }) +
    // La senda: tierra pisada, apenas más clara y rosada, con dos surcos y el canto comido por el pasto.
    `<path d="${cinta(ps)}" fill="${B.violeta}" filter="url(#soplo-s)"/>` +
    `<path d="${cinta(ps, 0.7)}" fill="${B.rosa}" filter="url(#soplo-m)" opacity="0.42"/>` +
    `<path d="${cinta(ps, 0.3, 0.02)}" fill="${B.lila}" filter="url(#soplo-m)" opacity="0.22"/>` +
    trazo(linea(ps, -0.24), B.noche, 2.4, 0.5) +
    trazo(linea(ps, 0.22), B.noche, 2.4, 0.5) +
    rayones([880, pie + 6, 1160, 640], 110, [B.lila, B.rosa, B.violeta], 4031, { hacia: fugaEn, largo: [7, 18], grueso: [1.4, 2.8], fuerza: 0.5, donde: enLaSenda }) +
    charco(1150, 466, 66, 10, 4041, 'pt-charco-a') +
    charco(612, 416, 40, 6.5, 4043, 'pt-charco-b') +
    chapa +
    pasto +
    matas +
    `</g>`
  );
}

/* ------------------------------------------------------------------
   El que espía por el boquete, y lo que premia a la lupa
   ------------------------------------------------------------------ */

/** La caja del vecino que se asoma: adentro del boquete. */
export const VECINO = { caja: [BOQUETE.x - 26, MEDIANERA.pie - 46, 52, 48] as const } as const;

function vecino(): string {
  const [x0, y0, w, h] = VECINO.caja;
  const cx = BOQUETE.x - 4;
  const pie = MEDIANERA.pie;
  return (
    `<g filter="url(#grano)"><rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="var(--fondo)" fill-opacity="0"/>` +
    // Una sombra: la gorra, la cabeza ladeada, un hombro y la mano agarrada del canto.
    forma(`M${cx - 15} ${pie + 2} L${cx - 14} ${pie - 16} Q${cx - 13} ${pie - 22} ${cx - 8} ${pie - 23} Q${cx - 12} ${pie - 36} ${cx} ${pie - 38} Q${cx + 11} ${pie - 38} ${cx + 9} ${pie - 27} L${cx + 15} ${pie - 28} L${cx + 15} ${pie - 25} L${cx + 8} ${pie - 23} Q${cx + 16} ${pie - 18} ${cx + 17} ${pie + 2} Z`, B.negro) +
    forma(`M${cx + 19} ${pie - 20} q4 -2 6 1 l0 9 l-6 0 Z`, B.negro) +
    // Dos ojos, que es todo lo que se le ve.
    `<ellipse cx="${cx - 3.4}" cy="${pie - 30}" rx="2.1" ry="1.5" fill="${B.llamaClara}"/><ellipse cx="${cx + 4}" cy="${pie - 30.4}" rx="2.1" ry="1.5" fill="${B.llamaClara}"/>` +
    `<circle cx="${cx - 3}" cy="${pie - 30}" r="0.8" fill="${B.negro}"/><circle cx="${cx + 4.4}" cy="${pie - 30.4}" r="0.8" fill="${B.negro}"/>` +
    `</g>`
  );
}

/** La caja de lo fino: la pelota, y lo que hay al lado. */
const FINO_PELOTA = [ARCO.pelota[0] - 46, ARCO.pelota[1] - 24, 86, 38] as const;

function pelotaFina(): string {
  const [x0, y0, w, h] = FINO_PELOTA;
  const [bx, by] = ARCO.pelota;
  // Lo que deja un picado: la pelota de trapo con su costura, tres chapitas y un caracol que le sube al palo.
  let chapitas = '';
  for (const [dx, dy, giro] of [[16, 5, 20], [24, 8, -30], [30, 3, 70]] as const) {
    chapitas += `<g transform="translate(${bx + dx} ${by + dy}) rotate(${giro}) scale(1 0.5)"><circle r="2.6" fill="${B.lila}"/><circle r="1.5" fill="${B.noche}"/></g>`;
  }
  return (
    `<g filter="url(#grano)"><rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="var(--fondo)" fill-opacity="0"/>` +
    nube(bx + 2, by + 6, 9, 2.4, B.negro, 'xs', 0.8) +
    `<circle cx="${bx}" cy="${by}" r="6.4" fill="${B.lila}"/>` +
    nube(bx + 2, by + 2, 4, 4, B.noche, 'xs', 0.6) +
    trazo(`M${bx - 6} ${by - 1} q6 -3 12 1 M${bx - 2} ${by - 6} q-2 6 3 12 M${bx - 5} ${by + 3} q5 2 10 -2`, B.noche, 0.9, 0.9) +
    // Las puntadas de la costura.
    [-4, -1.4, 1.2, 3.8].map((d) => trazo(`M${f(bx + d)} ${f(by - 2.6 + Math.abs(d) * 0.2)} l0.6 2.2`, B.luz, 0.5, 0.9)).join('') +
    nube(bx - 2, by - 3, 2, 1.6, B.luz, 'xs', 0.8) +
    chapitas +
    // El caracol, en el palo del arco, con su rastro.
    trazo(`M${bx - 36.4} ${by - 4} l0.3 -9`, B.luz, 0.7, 0.6) +
    `<circle cx="${bx - 36}" cy="${by - 15}" r="2.4" fill="${B.rosa}"/>` +
    trazo(`M${bx - 36} ${by - 15} m-1.2 0 a1.2 1.2 0 1 1 1.2 1.2 M${bx - 36.6} ${by - 17.2} l-0.4 -3 l-1.6 -1.4 M${bx - 37} ${by - 20.2} l1.6 -1.6`, B.luz, 0.5, 0.9) +
    `</g>`
  );
}

/** Las piezas sueltas de los techos: lo que asoma y lo que premia a la lupa. La mano de abajo va en `arte-camino.ts`. */
export const PIEZAS_DEL_POTRERO: readonly Pieza[] = [
  { nombre: 'camino-techos-bajo', caja: CAJA_DEL_POTRERO, dibujo: potreroBajo(), densidad: 1.5 },
  { nombre: 'camino-techos-vecino', caja: VECINO.caja, dibujo: vecino(), densidad: 3 },
  { nombre: 'fino-techos-pelota', caja: FINO_PELOTA, dibujo: pelotaFina(), densidad: 4 },
];
