/**
 * Los astilleros, a lo largo (`D-91`, tanda 3): el puerto de noche con escala.
 *
 * El recinto de 900 sigue siendo de `arte-entornos.ts`, y su piso (la pila, el farol, el ferry, el
 * lanchón) se usa tal cual: otra sesión lo está tocando (`T-529`) y acá no se edita. Lo que el camino
 * largo pinta por su cuenta:
 *
 * - **Lo lejano**, entero: la otra orilla en dos planos. Atrás, grúas de pórtico pálidas que se salen
 *   por arriba del cuadro; entre los dos, la bruma del río; adelante, el casco de un carguero que
 *   corta la vista, con su ancla, sus ojos de buey y el óxido que le chorrea (desde la segunda vuelta va
 *   en su propia capa, `PLANOS`). El agua devuelve cada luz en una columna de rayas rotas.
 * - **Debajo del piso** (`puertoBajo`): un espigón que sale del muelle y se va al horizonte, con sus
 *   faroles cada vez más chicos. Es el punto de fuga de la región.
 * - **Encima del piso** (`puertoSobre`): las vías de la grúa, que cruzan los tablones hasta el
 *   espigón; y la tiza de la contratapa de *Cordero atado* donde la dejaría un pibe: la cara que se
 *   ríe y la escalera en los containers, y una rayuela en el muelle.
 *
 * Todo es tiza sobre noche, con el naranja del sodio: las tintas son las del recinto.
 */

import { forma, nube, soplo, trazo, type Pieza } from './aerografo.ts';
import { azar } from './pincel.ts';
import { ASTILLERO } from './rig-entornos.ts';
import { cinta, enLaFuga, fuga, linea } from './escorzo.ts';

const T = {
  noche: 'var(--entorno-astillero-noche)',
  tiza: 'var(--entorno-astillero-tiza)',
  azul: 'var(--entorno-astillero-azul)',
  clara: 'var(--entorno-astillero-tiza-clara)',
  naranja: 'var(--entorno-pastura)',
  naranjaHonda: 'var(--entorno-pastura-honda)',
  sodio: 'var(--disco-cordero-atado-tinta)',
  negro: 'var(--fondo)',
  papel: 'var(--papel)',
  rojo: 'var(--marca-rojo)',
};

const f = (v: number): string => (Math.round(v * 10) / 10).toString();
const caja = (x: number, y: number, w: number, h: number): string => `M${f(x)} ${f(y)} h${f(w)} v${f(h)} h${f(-w)} Z`;
const circulo = (x: number, y: number, r: number): string => `M${f(x - r)} ${f(y)} a${f(r)} ${f(r)} 0 1 0 ${f(r * 2)} 0 a${f(r)} ${f(r)} 0 1 0 ${f(-r * 2)} 0 Z`;

/** La tiza del recinto (`arte-entornos.ts`): el trazo corrido por un ruido fino y con pedazos comidos. */
const filtroTiza = (): string =>
  `<defs><filter id="tiza" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">` +
  `<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="9" result="ruido"/>` +
  `<feDisplacementMap in="SourceGraphic" in2="ruido" scale="3.2" xChannelSelector="R" yChannelSelector="G" result="corrido"/>` +
  `<feColorMatrix in="ruido" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -2.6 0 0 0 1.75" result="huecos"/>` +
  `<feComposite in="corrido" in2="huecos" operator="in"/></filter></defs>`;

function espiral(cx: number, cy: number, r: number, vueltas: number, color: string, ancho: number, o = 1, achate = 1): string {
  let d = '';
  const n = Math.round(vueltas * 40);
  for (let i = 0; i <= n; i++) {
    const a = (i / 40) * Math.PI * 2;
    const rr = (r * i) / n;
    d += `${i ? 'L' : 'M'}${f(cx + Math.cos(a) * rr)} ${f(cy + Math.sin(a) * rr * achate)} `;
  }
  return trazo(d, color, ancho, o);
}

/** La columna de luz que una lámpara deja en el agua: rayas cortas, corridas, más anchas y más flojas cuanto más abajo. */
function reflejo(rnd: () => number, x: number, desde: number, largo: number, color: string, fuerza = 1): string {
  let s = '';
  for (let y = desde; y < desde + largo; y += 4 + rnd() * 5 + (y - desde) * 0.08) {
    const u = (y - desde) / largo;
    const medio = 2 + u * 9 + rnd() * 3;
    s += trazo(`M${f(x - medio + (rnd() - 0.5) * 5)} ${f(y)} l${f(medio * 2)} ${f((rnd() - 0.5) * 1.2)}`, color, 1.2 + u * 1.2, (0.55 - u * 0.4) * fuerza);
  }
  return s;
}

/**
 * Una grúa de pórtico de la otra orilla: las dos patas, las cruces, la casilla y la pluma, que sube
 * en diagonal y **se sale del cuadro**. `k` es el tamaño (lo lejos que está).
 */
function grua(x: number, pie: number, k: number, color: string, o: number, paraAlla = 1): string {
  const X = (v: number): string => f(x + v * k * paraAlla);
  const Y = (v: number): string => f(pie - v * k);
  const fierros =
    `M${X(0)} ${Y(0)} L${X(12)} ${Y(250)} M${X(70)} ${Y(0)} L${X(58)} ${Y(250)} ` +
    `M${X(4)} ${Y(70)} L${X(66)} ${Y(70)} M${X(8)} ${Y(150)} L${X(62)} ${Y(150)} M${X(4)} ${Y(70)} L${X(62)} ${Y(150)} M${X(66)} ${Y(70)} L${X(8)} ${Y(150)} ` +
    `M${X(8)} ${Y(150)} L${X(58)} ${Y(250)} M${X(62)} ${Y(150)} L${X(12)} ${Y(250)} ` +
    // La pluma y sus tensores, desde el caballete.
    `M${X(62)} ${Y(272)} L${X(-270)} ${Y(430)} M${X(62)} ${Y(258)} L${X(-270)} ${Y(416)} ` +
    `M${X(36)} ${Y(360)} L${X(62)} ${Y(272)} M${X(36)} ${Y(360)} L${X(12)} ${Y(278)} M${X(36)} ${Y(360)} L${X(-120)} ${Y(352)} M${X(36)} ${Y(360)} L${X(96)} ${Y(262)}`;
  let celosia = '';
  for (let i = 0; i < 12; i++) celosia += `M${X(62 - i * 27)} ${Y(272 + i * 12.8)} L${X(62 - i * 27 - 14)} ${Y(258 + i * 12.8 + 6.4)} `;
  return (
    trazo(fierros, color, Math.max(1.6, 5 * k), o) +
    trazo(celosia, color, Math.max(1, 2.2 * k), o) +
    forma(`M${X(0)} ${Y(250)} L${X(70)} ${Y(250)} L${X(70)} ${Y(282)} L${X(0)} ${Y(282)} Z M${X(70)} ${Y(254)} L${X(104)} ${Y(254)} L${X(104)} ${Y(270)} L${X(70)} ${Y(270)} Z`, color, o) +
    forma(caja(x + (paraAlla > 0 ? 8 : -22) * k, pie - 274 * k, 14 * k, 10 * k), T.sodio, 0.8) +
    // El cable y el gancho, colgando de la pluma.
    trazo(`M${X(-150)} ${Y(372)} L${X(-150)} ${Y(190)}`, color, Math.max(0.8, 1.4 * k), o) +
    trazo(`M${X(-150)} ${Y(190)} q${f(7 * k)} 0 ${f(7 * k)} ${f(8 * k)} q0 ${f(8 * k)} ${f(-8 * k)} ${f(6 * k)}`, color, Math.max(1, 2.4 * k), o)
  );
}

/**
 * El carguero (`PLANOS` en `aire.ts`): dónde arranca la proa y hasta dónde le llega el agua, en las unidades
 * de su capa. La caja es la de la pieza. Segunda vuelta: salió de lo lejano (era un bloque negro en tres de
 * cinco pantallas del teléfono, y tapaba las grúas) y va en una capa propia, más corto, que se corre más
 * rápido que la otra orilla y más despacio que el muelle.
 */
export const CARGUERO = { x: 850, agua: 345, largo: 340, caja: [820, -12, 420, 400] as const } as const;

/**
 * El casco no es negro parejo: la traca de arriba es del azul de la noche, las chapas tienen sus costuras, el
 * óxido chorrea de los imbornales y del escobén, y abajo, contra la línea de flotación, la panza agarra el
 * sodio de los faroles del muelle. La franja de la flotación es el naranja hondo de la tapa; el canto, tiza.
 */
function carguero(): string {
  const { x: b, agua, largo: L } = CARGUERO;
  const rnd = azar(3089);
  const casco = `M${b - 24} 122 L${b + L} 136 Q${b + L + 30} 148 ${b + L + 22} ${agua} L${b + 76} ${agua} Q${b + 22} 262 ${b - 24} 122 Z`;
  let ojos = '';
  let enElAgua = '';
  for (let x = b + 104, i = 0; x < b + L - 14; x += 31, i++) {
    const prendido = i === 1 || i === 4 || i === 5;
    ojos += forma(circulo(x, 196, 4.6), prendido ? T.sodio : T.noche) + trazo(circulo(x, 196, 5.6), T.clara, 0.8, 0.35) + (prendido ? nube(x, 196, 10, 10, T.sodio, 's', 0.55) + forma(circulo(x, 196, 1.7), T.papel) : '');
    if (prendido) enElAgua += reflejo(rnd, x, agua + 5, 34, T.sodio, 0.9);
  }
  let chapas = '';
  for (let x = b + 30; x < b + L + 10; x += 38 + rnd() * 10) chapas += `M${f(x)} 132 L${f(x + (rnd() - 0.5) * 3)} ${agua - 22} `;
  let oxido = '';
  for (let i = 0; i < 14; i++) {
    const x = b + 50 + rnd() * (L - 40);
    oxido += nube(x, 214 + rnd() * 70, 2.4 + rnd() * 3, 24 + rnd() * 44, i % 3 ? T.naranjaHonda : T.naranja, 's', 0.34 + rnd() * 0.3);
  }
  let calado = '';
  for (let y = 262; y < agua - 24; y += 9) calado += `M${f(b + 58 + (agua - y) * -0.12)} ${y} l${y % 18 < 9 ? 8 : 4} 0 `;
  let ventanas = '';
  for (let x = b + 232; x < b + 326; x += 15) ventanas += forma(caja(x, 84, 9, 10), T.sodio, rnd() < 0.3 ? 0.2 : 0.9);
  for (let x = b + 250; x < b + 310; x += 13) ventanas += forma(caja(x, 52, 9, 7), T.clara, 0.65);
  const arriba = `${caja(b + 218, 70, 118, 62)} ${caja(b + 238, 44, 78, 28)}`;
  const chimenea = `M${b + 262} 44 L${b + 268} -6 L${b + 298} -6 L${b + 302} 44 Z`;
  return (
    // Lo que el casco le tapa al agua.
    nube(b + 180, agua + 12, 190, 11, T.negro, 'm', 0.8) +
    // El palo de carga, con su pluma, y el puente con la chimenea: del azul de la noche, no negros.
    trazo(`M${b + 128} 128 L${b + 128} 16 M${b + 110} 42 L${b + 146} 42 M${b + 128} 58 L${b + 210} 96 M${b + 128} 20 L${b + 210} 96 M${b + 128} 20 L${b + 84} 126`, T.negro, 4) +
    forma(arriba, T.noche) + nube(b + 300, 100, 40, 40, T.negro, 'm', 0.6) + nube(b + 240, 62, 30, 14, T.azul, 'm', 0.4) +
    forma(chimenea, T.naranjaHonda) + forma(caja(b + 266, -8, 34, 16), T.negro) + forma(caja(b + 266, 20, 34, 6), T.papel, 0.5) +
    nube(b + 274, -8, 26, 10, T.clara, 'l', 0.22) +
    ventanas +
    `<clipPath id="pt-casco"><path d="${casco}"/></clipPath><g clip-path="url(#pt-casco)">` +
    forma(casco, T.negro) +
    // La traca de arriba, azul; el brillo de la amura; las costuras de las chapas.
    forma(caja(b - 30, 116, L + 70, 50), T.noche) +
    nube(b + 64, 190, 100, 80, T.azul, 'l', 0.55) + nube(b + 250, 176, 120, 30, T.azul, 'l', 0.28) +
    trazo(chapas, T.azul, 1, 0.3) + trazo(`M${b - 20} 166 L${b + L + 30} 172 M${b + 30} 250 L${b + L + 30} 254`, T.azul, 1, 0.3) +
    // El óxido: una mancha grande bajo el escobén, otra a media eslora, y los chorretes.
    nube(b + 44, 226, 16, 46, T.naranjaHonda, 'm', 0.6) + nube(b + 214, 262, 40, 34, T.naranjaHonda, 'l', 0.4) +
    oxido +
    // La panza agarra el sodio de los faroles del muelle.
    nube(b + 250, agua - 44, 110, 40, T.sodio, 'l', 0.3) + nube(b + 120, agua - 36, 60, 26, T.sodio, 'l', 0.2) +
    forma(caja(b - 30, agua - 20, L + 90, 22), T.naranjaHonda, 0.9) +
    nube(b + 220, agua - 4, 170, 7, T.negro, 'm', 0.5) +
    `</g>` +
    ojos +
    // El escobén y el ancla, colgada a medio izar.
    forma(circulo(b + 36, 168, 5.4), T.negro) +
    trazo(`M${b + 37} 172 L${b + 40} 222`, T.clara, 1.6, 0.6) +
    trazo(`M${b + 40} 222 L${b + 40} 250 M${b + 30} 228 L${b + 50} 228 M${b + 26} 240 Q${b + 40} 258 ${b + 54} 240`, T.clara, 2.4, 0.8) +
    `<g filter="url(#tiza)">` +
    trazo(`M${b - 24} 122 L${b + L} 136 Q${b + L + 30} 148 ${b + L + 22} ${agua}`, T.clara, 1.8, 0.75) +
    trazo(`M${b - 24} 122 Q${b + 22} 262 ${b + 76} ${agua}`, T.clara, 1.4, 0.55) +
    trazo(`M${b + 70} ${agua - 21} L${b + L + 26} ${agua - 21}`, T.clara, 1, 0.5) +
    trazo(`${arriba} ${chimenea}`, T.clara, 1.2, 0.5) +
    trazo(calado, T.clara, 1.2, 0.6) +
    // El nombre, que no se llega a leer: un garabato y su espiral.
    trazo(`M${b + 84} 150 l7 -9 l6 9 l7 -9 l6 9 m6 -4 l16 0 m6 4 l5 -9 l6 9 l6 -9`, T.clara, 1.6, 0.65) +
    espiral(b + 176, 146, 8, 2, T.clara, 1.4, 0.6) +
    // La baranda de la borda.
    Array.from({ length: Math.floor(L / 20) + 1 }, (_, i) => trazo(`M${b + i * 20} ${f(123.2 + i * 0.78)} l0 -9`, T.clara, 1, 0.45)).join('') +
    trazo(`M${b - 20} 113 L${b + L} 127`, T.clara, 1, 0.45) +
    enElAgua +
    `</g>`
  );
}

/** Una boya del canal: el cono, la luz roja que pica y su reflejo roto. */
function boya(x: number, y: number): string {
  const rnd = azar(3103);
  return (
    forma(`M${x - 9} ${y} L${x - 4} ${y - 22} L${x + 4} ${y - 22} L${x + 9} ${y} Z`, T.negro) +
    forma(caja(x - 6.4, y - 13, 12.8, 5), T.naranja, 0.9) +
    trazo(`M${x} ${y - 22} l0 -9`, T.negro, 2) +
    nube(x, y - 33, 8, 8, T.rojo, 's', 0.6) + forma(circulo(x, y - 33, 2), T.rojo) +
    `<g filter="url(#tiza)">${reflejo(rnd, x, y + 4, 34, T.rojo, 0.9)}${trazo(`M${x - 22} ${y + 2} q22 5 44 0`, T.clara, 1.2, 0.5)}</g>`
  );
}

/** Lo lejano de los astilleros, a lo largo. */
export function puertoLejos(ancho: number, alto: number): string {
  const { orilla, muelle } = ASTILLERO;
  const k = ancho / 900;
  const rnd = azar(3071);
  let rayado = '';
  for (let i = 0; i < Math.round(200 * k); i++) {
    const l = 10 + rnd() * 30;
    rayado += trazo(`M${f(rnd() * ancho)} ${f(rnd() * orilla)} l${f(l * 0.5)} ${f(-l * 0.86)}`, T.tiza, 1.4 + rnd() * 1.8, 0.07 + rnd() * 0.12);
  }
  let espirales = '';
  for (let x = 60, n = 0; x < ancho; x += 170 + rnd() * 190, n++) espirales += espiral(x, 30 + rnd() * 150, 16 + rnd() * 36, 2.4 + rnd() * 1.4, n % 3 ? T.tiza : T.clara, 2.2 + rnd() * 2.2, 0.45 + rnd() * 0.3);

  // El plano de atrás: la otra orilla, pálida. Pilas bajas, luces de sodio, y las grúas que se pierden arriba.
  let orillaLejos = '';
  let luces = '';
  let reflejos = '';
  for (let x = -20; x < ancho + 20;) {
    const w = 30 + rnd() * 90;
    const t = orilla - 8 - rnd() * 34;
    orillaLejos += forma(caja(x, t, w, orilla - t + 2), T.azul, 0.5) + trazo(`M${f(x)} ${f(t)} l${f(w)} 0`, T.clara, 1, 0.3);
    if (rnd() < 0.42) {
      const lx = x + rnd() * w;
      luces += nube(lx, t + 6, 9, 7, T.sodio, 'm', 0.55) + forma(circulo(lx, t + 6, 1.5), T.papel);
      reflejos += reflejo(rnd, lx, orilla + 5, 36 + rnd() * 70, T.sodio);
    }
    x += w + rnd() * 44;
  }
  const gruas = ([[150, 0.8, 1], [392, 1, 1], [566, 0.6, -1], [1500, 0.84, 1], [1700, 1.06, -1], [1960, 0.7, 1], [2230, 0.9, 1]] as const)
    .map(([x, tam, lado]) => grua(x, orilla, tam, T.azul, 0.36 + tam * 0.24, lado)).join('');

  // La bruma del río, entre los dos planos: bancos sueltos, ninguno cruza la vista.
  let bruma = '';
  for (let x = 80, n = 0; x < ancho; x += 230 + rnd() * 240, n++) bruma += nube(x, 250 + rnd() * 44, 130 + rnd() * 110, 12 + rnd() * 16, n % 2 ? T.clara : T.azul, 'xl', n % 2 ? 0.16 : 0.4);

  // El agua: rayas de tiza que se agrandan hacia el muelle, y cada tanto un remolino.
  let agua = '';
  for (let i = 0; i < Math.round(150 * k); i++) {
    const hondura = rnd() ** 1.3;
    const y = orilla + 6 + hondura * (muelle - orilla + 14);
    agua += trazo(`M${f(rnd() * ancho)} ${f(y)} l${f(8 + hondura * 46 + rnd() * 10)} ${f((rnd() - 0.5) * 2)}`, T.tiza, 0.9 + hondura * 1.5, 0.1 + rnd() * 0.2);
  }
  for (let i = 0; i < Math.round(4 * k); i++) agua += espiral(rnd() * ancho, orilla + 50 + rnd() * 70, 10 + rnd() * 12, 1.6, T.tiza, 1.4, 0.3, 0.3);
  let velo = '';
  for (let x = 140; x < ancho; x += 300 + rnd() * 260) velo += nube(x, 338 + rnd() * 30, 150 + rnd() * 90, 9 + rnd() * 8, T.clara, 'xl', 0.09);

  return (
    filtroTiza() +
    `<g filter="url(#rociado)">` +
    `<rect x="-10" y="-10" width="${ancho + 20}" height="${alto + 20}" fill="${T.noche}"/>` +
    nube(ancho / 2, -40, ancho * 0.7, 150, T.negro, 'xl', 0.7) +
    // El resplandor del puerto contra el cielo bajo: más claro donde termina el agua.
    nube(ancho * 0.3, orilla - 14, ancho * 0.3, 60, T.azul, 'xl', 0.45) +
    nube(ancho * 0.78, orilla - 20, ancho * 0.34, 74, T.azul, 'xl', 0.5) +
    `</g>` +
    `<g filter="url(#tiza)">${rayado}${espirales}</g>` +
    `<g filter="url(#rociado)">${gruas}${orillaLejos}${luces}${bruma}` +
    forma(caja(-10, orilla, ancho + 20, alto - orilla + 10), T.negro, 0.55) +
    velo +
    `</g>` +
    `<g filter="url(#tiza)">${reflejos}${agua}</g>` +
    `<g filter="url(#rociado)">${boya(700, 392)}${boya(1790, 366)}</g>`
  );
}

/* ------------------------------------------------------------------
   El espigón y las vías: el punto de fuga
   ------------------------------------------------------------------ */

/** El espigón: de dónde sale en el canto del muelle y dónde se pierde, contra la otra orilla. */
const ESPIGON = { desde: [1256, 436], hasta: [1348, 307], cerca: 62, lejos: 5 } as const;

/** Lo que va **debajo** del piso del recinto: el espigón, sobre el agua, detrás de todo lo del muelle. */
export function puertoBajo(): string {
  const rnd = azar(3119);
  // Los reflejos de los faroles del espigón van quietos. En la tercera vuelta se probó hacerlos temblar (piezas
  // sueltas que la isla ensanchaba desde su eje): en la tira de seis cuadros no se leían, y se sacaron.
  let enElAgua = '';
  const ps = fuga(ESPIGON.desde, ESPIGON.hasta, ESPIGON.cerca, ESPIGON.lejos, 22);
  let tablas = '';
  for (const [x, y, w] of ps) tablas += `M${f(x - w / 2)} ${f(y)} l${f(w)} 0 `;
  let faroles = '';
  for (const hondo of [0.1, 0.38, 0.58, 0.73, 0.84, 0.92]) {
    const [x, y] = enLaFuga(ESPIGON.desde, ESPIGON.hasta, hondo);
    const cerca = 1 - hondo;
    const w = ESPIGON.lejos + (ESPIGON.cerca - ESPIGON.lejos) * cerca ** 1.6;
    const px = x - w / 2;
    const alto = 8 + cerca * 76;
    faroles +=
      trazo(`M${f(px)} ${f(y)} L${f(px)} ${f(y - alto)} l${f(4 + cerca * 9)} ${f(-1 - cerca * 3)}`, T.negro, 1 + cerca * 2.6) +
      nube(px + 4 + cerca * 9, y - alto - cerca * 2, 3 + cerca * 12, 3 + cerca * 10, T.sodio, 'm', 0.6) +
      forma(circulo(px + 4 + cerca * 9, y - alto - cerca * 2, 0.8 + cerca * 2), T.papel) +
      // El charco de luz sobre las tablas.
      nube(x, y - 1, w * 0.5, 1.5 + cerca * 5, T.sodio, 's', 0.3);
    enElAgua += reflejo(rnd, px - 5 - cerca * 22, y - cerca * 30 + 4, 8 + cerca * 30, T.sodio, 0.8);
  }
  const [fx, fy] = ESPIGON.hasta;
  return (
    `<g filter="url(#rociado)">` +
    // El espigón le tapa el agua: una mancha oscura al costado, que es su sombra en el río.
    soplo(cinta(ps, 1.5, 0.3), T.negro, 's', 0.5) +
    forma(cinta(ps), T.negro) +
    faroles +
    // La baliza de la punta.
    trazo(`M${fx} ${fy} l0 -9`, T.negro, 1.6) + nube(fx, fy - 11, 5, 5, T.rojo, 's', 0.7) + forma(circulo(fx, fy - 11, 1.3), T.rojo) +
    `</g>` +
    `<g filter="url(#tiza)">${trazo(tablas, T.tiza, 1.1, 0.4)}${trazo(linea(ps, -0.5), T.clara, 1.6, 0.7)}${trazo(linea(ps, 0.5), T.clara, 1.2, 0.5)}${enElAgua}</g>`
  );
}

/** La rayuela de tiza en los tablones, en escorzo: siete casilleros, el cielo arriba, el tejo en el tercero. */
function rayuela(cx: number, cerca: number): string {
  const filas = [0, 20, 37, 51, 63, 73, 81, 88].map((d) => cerca - d);
  const medio = (y: number): number => 15 + (y - (cerca - 88)) * 0.22;
  const eje = (y: number): number => cx + (cerca - y) * 0.26;
  const dobles = [false, false, true, false, true, false, true];
  let d = '';
  dobles.forEach((doble, i) => {
    const [y0, y1] = [filas[i]!, filas[i + 1]!];
    const k = doble ? 2 : 1;
    d += `M${f(eje(y0) - medio(y0) * k)} ${f(y0)} L${f(eje(y0) + medio(y0) * k)} ${f(y0)} L${f(eje(y1) + medio(y1) * k)} ${f(y1)} L${f(eje(y1) - medio(y1) * k)} ${f(y1)} Z `;
    if (doble) d += `M${f(eje(y0))} ${f(y0)} L${f(eje(y1))} ${f(y1)} `;
  });
  const arriba = filas[7]!;
  const [ax, am] = [eje(arriba), medio(arriba) * 2];
  d += `M${f(ax - am)} ${f(arriba)} A${f(am)} ${f(am * 0.42)} 0 0 1 ${f(ax + am)} ${f(arriba)}`;
  const [ty, tx] = [(filas[2]! + filas[3]!) / 2, eje(filas[2]!) - 12];
  return (
    trazo(d, T.clara, 1.7, 0.72) +
    // El cielo: un espiral, como los de la contratapa. Y los palotes de quién va ganando.
    espiral(ax, arriba - am * 0.2, am * 0.3, 1.8, T.clara, 1.1, 0.7, 0.5) +
    trazo(`M${f(cx + 44)} ${f(cerca - 6)} l2 -9 m4 9 l2 -9 m4 9 l2 -9 m4 9 l2 -9 m-18 -3 l22 -3`, T.clara, 1.3, 0.65) +
    // El tejo (una tapita, en el naranja de la tapa) y la tiza, que quedó tirada.
    forma(`M${f(tx - 4)} ${f(ty)} a4 2.2 0 1 0 8 0 a4 2.2 0 1 0 -8 0 Z`, T.naranja) + trazo(`M${f(tx - 3)} ${f(ty - 0.6)} l5 -0.6`, T.papel, 0.8, 0.6) +
    `<g transform="rotate(-24 ${f(cx - 46)} ${f(cerca - 14)})">${forma(caja(cx - 52, cerca - 16, 12, 3.6), T.papel, 0.9)}</g>`
  );
}

/**
 * El corderito atado, en tiza, en el tercer container: alguien dibujó la tapa del disco. Es el segundo
 * premio de la lupa (`fino-astillero-cordero`): el vellón de garabato, las cuatro patas, la soga y la estaca.
 */
const CORDERITO = { x: 190, y: 352, caja: [158, 330, 76, 46] as const };
function corderito(): string {
  const { x, y } = CORDERITO;
  return (
    `<g transform="translate(${x} ${y})">` +
    trazo('M-14 2 q-5 -8 4 -10 q3 -8 10 -3 q8 -5 11 3 q8 1 4 8 q2 7 -6 7 l-18 0 q-8 -1 -5 -5 Z', T.clara, 1.7, 0.9) +
    trazo('M-15 -4 q-8 -4 -9 3 q1 6 8 3 M-21 -5 l-4 -4 M-9 9 l-1 8 M-3 9 l0 8 M7 9 l0 8 M13 8 l1 8 M17 -1 q5 -2 5 3', T.clara, 1.5, 0.9) +
    trazo('M-22 -1 l0.4 0.4', T.clara, 1.6, 1) +
    // La soga, floja, y la estaca.
    trazo('M-14 4 Q4 26 31 12 M31 -2 l0 20 M27 -2 l8 0', T.clara, 1.4, 0.8) +
    `</g>`
  );
}

/** Dónde está la rayuela, en el piso: la caja de la pieza fina. */
const RAYUELA = { x: 168, cerca: 608, caja: [96, 508, 150, 108] as const };

/** Lo que va **encima** del piso del recinto: las vías, y la tiza de los pibes. Nada cae donde espera el as del Club París (x de 600 a 760). */
export function puertoSobre(): string {
  const vias = fuga([1196, 642], [ESPIGON.desde[0], ESPIGON.desde[1] + 2], 112, 56, 14);
  let durmientes = '';
  for (const [x, y, w] of vias) durmientes += `M${f(x - w * 0.5)} ${f(y)} l${f(w)} 0 `;
  // La cara que se ríe, de la contratapa: en el container azul, a la altura de un pibe subido a un cajón.
  const [cx, cy] = [196, 288];
  const cara =
    `<circle cx="${cx}" cy="${cy}" r="30" fill="none" stroke="${T.clara}" stroke-width="3" opacity="0.9"/>` +
    espiral(cx - 11, cy - 8, 6, 1.6, T.clara, 2, 0.9) + espiral(cx + 11, cy - 8, 6, 1.6, T.clara, 2, 0.9) +
    trazo(`M${cx - 18} ${cy + 5} Q${cx} ${cy + 28} ${cx + 18} ${cy + 5} Q${cx} ${cy + 12} ${cx - 18} ${cy + 5} M${cx - 9} ${cy + 9} l1 9 M${cx} ${cy + 10} l0 11 M${cx + 9} ${cy + 9} l-1 9`, T.clara, 2.4, 0.9) +
    trazo(`M${cx - 12} ${cy - 29} l-5 -11 M${cx} ${cy - 31} l0 -13 M${cx + 12} ${cy - 29} l5 -11`, T.clara, 2.4, 0.85);
  const escalera = `M264 432 L286 334 M290 434 L312 336 ` + Array.from({ length: 7 }, (_, i) => `M${f(266.6 + i * 3)} ${f(420 - i * 13.4)} l26 2`).join(' ');
  const palotes = [0, 1].map((n) => `M${108 + n * 34} 398 l1 24 m5 -24 l1 24 m5 -24 l1 24 m5 -24 l1 24 m-21 -6 l25 -12`).join(' ');
  return (
    `<g filter="url(#rociado)">` +
    // Las vías: la huella oscura de la canaleta y, encima, el riel que agarra el sodio.
    trazo(linea(vias, -0.42), T.negro, 6, 0.7) + trazo(linea(vias, 0.42), T.negro, 6, 0.7) +
    nube(1236, 470, 60, 22, T.sodio, 'l', 0.16) +
    `</g>` +
    `<g filter="url(#tiza)">` +
    trazo(durmientes, T.tiza, 1.3, 0.3) +
    trazo(linea(vias, -0.42), T.clara, 2.4, 0.8) + trazo(linea(vias, 0.42), T.clara, 2.4, 0.8) +
    trazo(linea(vias.slice(6), 0.4), T.sodio, 1.4, 0.6) +
    cara +
    trazo(escalera, T.clara, 2.4, 0.8) +
    trazo(palotes, T.clara, 2.2, 0.8) +
    trazo(`M318 356 l64 -5 m-13 -9 l13 9 l-11 11`, T.clara, 2.6, 0.8) +
    espiral(446, 300, 15, 2.4, T.clara, 1.6, 0.55) +
    corderito() +
    rayuela(RAYUELA.x, RAYUELA.cerca) +
    `</g>`
  );
}

/* ------------------------------------------------------------------
   Lo que aparece si te quedás quieto, y lo que premia a la lupa
   ------------------------------------------------------------------ */

/** El gato del puerto: se sube a la pila de containers cuando nadie se mueve. La caja, en unidades del piso; asoma por atrás del canto de la pila. */
export const GATO = { caja: [112, 138, 66, 62] as const, canto: ASTILLERO.pila.arriba } as const;

function gato(): string {
  const [x0, y0, w, h] = GATO.caja;
  const x = x0 + 36;
  const y = GATO.canto;
  const cuerpo =
    `M${x - 13} ${y + 4} Q${x - 16} ${y - 18} ${x - 5} ${y - 27} L${x - 9} ${y - 43} L${x - 2} ${y - 36} Q${x + 3} ${y - 38} ${x + 8} ${y - 36} L${x + 15} ${y - 43} L${x + 13} ${y - 27} Q${x + 17} ${y - 16} ${x + 14} ${y + 4} Z`;
  return (
    `<g filter="url(#rociado)"><rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="${T.negro}" fill-opacity="0"/>` +
    forma(cuerpo, T.negro) +
    // La cola, que le cuelga por el canto y hace gancho.
    trazo(`M${x - 12} ${y - 2} Q${x - 30} ${y - 4} ${x - 27} ${y - 18} q1 -7 7 -5`, T.negro, 4.4) +
    // El canto que le prende el farol, del lado del muelle, y los dos ojos.
    trazo(`M${x + 13.6} ${y - 27} Q${x + 17} ${y - 16} ${x + 14} ${y + 2}`, T.sodio, 1.3, 0.75) + trazo(`M${x + 14.4} ${y - 42} L${x + 13} ${y - 29}`, T.sodio, 1.1, 0.6) +
    forma(`M${x - 4.6} ${y - 30} q2.6 -2.6 5 0 q-2.6 2.2 -5 0 Z M${x + 4} ${y - 30} q2.6 -2.6 5 0 q-2.6 2.2 -5 0 Z`, T.sodio) +
    forma(caja(x - 2.6, y - 31.6, 1, 3) + caja(x + 6, y - 31.6, 1, 3), T.negro) +
    `</g>`
  );
}

/** Las piezas sueltas de los astilleros largos: el gato que asoma y la rayuela, fina, para la lupa. */
export const PIEZAS_DEL_PUERTO: readonly Pieza[] = [
  {
    nombre: 'camino-astillero-carguero',
    caja: CARGUERO.caja,
    dibujo: filtroTiza() + `<g filter="url(#rociado)"><rect x="${CARGUERO.caja[0]}" y="${CARGUERO.caja[1]}" width="${CARGUERO.caja[2]}" height="${CARGUERO.caja[3]}" fill="${T.negro}" fill-opacity="0"/>${carguero()}</g>`,
    densidad: 1.6,
  },
  { nombre: 'camino-astillero-gato', caja: GATO.caja, dibujo: gato(), densidad: 4 },
  {
    nombre: 'fino-astillero-rayuela',
    caja: RAYUELA.caja,
    dibujo: filtroTiza() + `<g filter="url(#tiza)"><rect x="${RAYUELA.caja[0]}" y="${RAYUELA.caja[1]}" width="${RAYUELA.caja[2]}" height="${RAYUELA.caja[3]}" fill="${T.negro}" fill-opacity="0"/>${rayuela(RAYUELA.x, RAYUELA.cerca)}</g>`,
    densidad: 4,
  },
  {
    nombre: 'fino-astillero-cordero',
    caja: CORDERITO.caja,
    dibujo: filtroTiza() + `<g filter="url(#tiza)"><rect x="${CORDERITO.caja[0]}" y="${CORDERITO.caja[1]}" width="${CORDERITO.caja[2]}" height="${CORDERITO.caja[3]}" fill="${T.negro}" fill-opacity="0"/>${corderito()}</g>`,
    densidad: 4,
  },
];
