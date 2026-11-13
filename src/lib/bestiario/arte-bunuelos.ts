/**
 * Los redonditos de ricota (`D-73`, vigesimoctava vuelta): la fuente de buñuelos en la mesita, al lado de la silla vacía.
 *
 * No salen en ninguna letra: son del mito. El nombre de la banda salió de la receta de unos buñuelos redondos de
 * ricota, de un libro de la ecónoma Patricia Rey (`RES-05`: la fuente dice Patricia, la banda dijo Patricio), y en la
 * estampa están para que agarre el que pase. Se toma al pie de la letra: la fuente está servida y nadie la cuida, humea
 * todavía, tiene la receta apoyada contra el plato con sus renglones y un tachón, un buñuelo ya se salió de la pila, y
 * al lado hay unas pinzas para el que quiera. Solas, a veces el de arriba se va rodando hasta el borde de la mesa y no
 * se cae, cae el azúcar, la pila se asienta, y las pinzas le van a uno y le erran. Tocada, ofrece: el de arriba sale de
 * la pila hacia quien mira, grande, en las pinzas, con el azúcar cayendo (*«Agarrá uno. Son de quien pase.»*).
 *
 * De la mitología son la fuente, la ricota, el apellido y la receta de Patricia. Del dibujo son las pinzas, el vapor, el
 * buñuelo que rueda y el que se salió de la pila. Nadie le pone cara a Patricio Rey: la silla no se toca.
 *
 * Viste *En directo*, medido con sharp en su interior y su contratapa: el dorado de los buñuelos es el ocre del interior,
 * su sombra y el tostado son su marrón, el azúcar es el blanco de la contratapa, el plato es su gris lavanda, el filete
 * del plato es el rojo del tablado y las pinzas son su acero azul.
 *
 * Coordenadas: el (0, 0) es la tapa de la mesita, debajo del medio del plato (`rig-bunuelos.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { conGrano, curva, elipse, f, poli } from './trazos.ts';
import { FUENTE, FUENTE_ARMADA as A, LINEA, OFRECE, QUIETO, marcas, type Momento } from './rig-bunuelos.ts';

const ID = 'redonditos-de-ricota';

/** Las tintas de *En directo* (`tokens.css`). */
const C = {
  dorado: 'var(--bestia-bunuelos-dorado)',
  doradoClaro: 'var(--bestia-bunuelos-dorado-claro)',
  doradoHondo: 'var(--bestia-bunuelos-dorado-hondo)',
  tostado: 'var(--bestia-bunuelos-tostado)',
  sombra: 'var(--bestia-bunuelos-sombra)',
  azucar: 'var(--bestia-bunuelos-azucar)',
  loza: 'var(--bestia-bunuelos-loza)',
  rojo: 'var(--bestia-bunuelos-rojo)',
  acero: 'var(--bestia-bunuelos-acero)',
};

function azar(semilla: number): () => number {
  let a = semilla;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Un buñuelo de ricota: irregular, no redondo (la masa se hincha para cualquier lado), dorado de fritura con la costra
 * más oscura abajo, globitos de la masa, hoyuelos y una lluvia de azúcar impalpable. Con `mordido` le falta un cacho y
 * se le ve el adentro, blanco y esponjoso.
 */
function bunuelo(x: number, y: number, r: number, semilla: number, id: string, mordido = false): string {
  const rnd = azar(semilla);
  const n = 11;
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const k = 0.84 + rnd() * 0.3;
    pts.push([x + Math.cos(a) * r * k * 1.04, y + Math.sin(a) * r * k * 0.94]);
  }
  const d = curva(pts);
  let globitos = '';
  for (let i = 0; i < 6; i++) {
    const a = rnd() * Math.PI * 2;
    const k = 0.15 + rnd() * 0.6;
    const [gx, gy] = [x + Math.cos(a) * r * k, y + Math.sin(a) * r * k * 0.9];
    const gr = r * (0.13 + rnd() * 0.12);
    globitos += forma(elipse(gx, gy, gr, gr * 0.9), C.doradoClaro, 0.85) + trazo(elipse(gx, gy, gr, gr * 0.9), C.doradoHondo, 0.9, 0.7) + forma(elipse(gx - gr * 0.3, gy - gr * 0.3, gr * 0.3, gr * 0.25), C.azucar, 0.9);
  }
  let azucar = '';
  for (let i = 0; i < 26; i++) {
    const a = rnd() * Math.PI * 2;
    const k = rnd() * 0.95;
    azucar += forma(elipse(x + Math.cos(a) * r * k, y + Math.sin(a) * r * k * 0.85 - r * 0.15, 0.7 + rnd() * 0.9, 0.6 + rnd() * 0.6), C.azucar, 0.8 + rnd() * 0.2);
  }
  // El mordisco: una media luna sacada del borde, con el adentro blanco y esponjoso (la ricota) a la vista.
  const mordisco = mordido
    ? forma(elipse(x + r * 0.7, y - r * 0.2, r * 0.55, r * 0.5), C.azucar) + forma(elipse(x + r * 0.62, y - r * 0.2, r * 0.4, r * 0.36), C.doradoClaro) + trazo(`M${f(x + r * 0.35)} ${f(y - r * 0.5)} q${f(r * 0.2)} ${f(r * 0.3)} 0 ${f(r * 0.6)}`, C.doradoHondo, 1.1, 0.8) +
      [[0.5, -0.4], [0.6, -0.05], [0.45, -0.1]].map(([a, b]) => forma(elipse(x + r * a!, y + r * b!, 1, 0.9), C.doradoHondo, 0.6)).join('')
    : '';
  return (
    enmascarado(id, d,
      forma(d, C.dorado) + nube(x + r * 0.35, y + r * 0.5, r * 0.95, r * 0.7, C.doradoHondo, 's', 0.95) + nube(x + r * 0.6, y + r * 0.85, r * 0.8, r * 0.35, C.tostado, 's', 0.75) +
      nube(x - r * 0.35, y - r * 0.4, r * 0.55, r * 0.4, C.doradoClaro, 's', 0.9) + globitos +
      trazo(`M${f(x - r * 0.25)} ${f(y + r * 0.15)} q${f(r * 0.25)} ${f(r * 0.3)} ${f(r * 0.5)} ${f(r * 0.05)}`, C.doradoHondo, 1, 0.55) +
      // El aceite brilla en un lado, y encima, el azúcar: una nevada que no tapa el dorado.
      trazo(`M${f(x - r * 0.65)} ${f(y - r * 0.15)} q${f(r * 0.1)} ${f(-r * 0.4)} ${f(r * 0.45)} ${f(-r * 0.6)}`, C.azucar, 1.2, 0.45) + nube(x - r * 0.1, y - r * 0.55, r * 0.8, r * 0.4, C.azucar, 's', 0.6) + azucar) + mordisco
  );
}

/** La pila entera sobre el plato: el plato con su filete rojo, la receta de Patricia contra el borde, los buñuelos amontonados como cayeron, y el que se salió. */
function pila(): string {
  const { y: py, rx } = A.plato;
  const plato =
    nube(0, 2, rx + 14, 7, C.sombra, 's', 0.8) +
    forma(elipse(0, py + 4, rx * 0.8, 6), C.tostado) +
    forma(elipse(0, py, rx, 11), C.loza) + nube(-20, py - 4, rx * 0.6, 4, C.azucar, 's', 0.6) + nube(30, py + 6, rx * 0.6, 4, C.tostado, 's', 0.4) +
    trazo(elipse(0, py, rx - 3, 9), C.rojo, 2.4, 0.95) + forma(elipse(0, py - 1, rx * 0.8, 7), C.doradoHondo, 0.55) +
    // Azúcar en el plato: lo que se cayó de la pila.
    nube(-10, py - 2, 48, 4, C.azucar, 's', 0.75) + [[-36, -9], [-20, -6], [4, -8], [22, -6], [40, -9], [-4, -5], [30, -4]].map(([a, b]) => forma(elipse(a!, py + b! + 2, 1.4, 0.9), C.azucar, 0.9)).join('');
  // La receta de Patricia: un cartón con renglones, un tachón y una manchita de aceite, apoyada contra el plato.
  const receta =
    `<g transform="rotate(-9 -64 -30)">` +
    forma(poli([[-92, -62], [-58, -60], [-60, -14], [-94, -16]]), C.azucar) + nube(-80, -26, 12, 16, C.doradoClaro, 's', 0.35) + nube(-68, -14, 8, 6, C.doradoHondo, 'xs', 0.6) +
    trazo('M-88 -52 l24 1 M-88 -44 l26 1 M-88 -36 l20 1 M-88 -28 l24 1', C.tostado, 1, 0.8) + trazo('M-88 -52 l22 -2 M-88 -44 l24 3', C.rojo, 1.2, 0.85) +
    `</g>`;
  // Los buñuelos, de atrás para adelante y sin orden: los de arriba apoyan donde pueden, y no hay dos del mismo tamaño.
  const lista: Array<[number, number, number]> = [
    [-6, -82, 12], [14, -76, 10],
    [-26, -66, 13], [4, -64, 14], [28, -62, 12],
    [-42, -44, 14], [-14, -46, 15], [16, -43, 13], [40, -40, 14],
    [-54, -22, 13], [-28, -20, 15], [0, -19, 14], [27, -17, 16], [53, -15, 12],
  ];
  let filas = '';
  lista.forEach(([x, y, r], i) => (filas += bunuelo(x, y, r, 610 + i, `m-bunuelos-${i}`)));
  // El que se salió de la pila: está en la mesa, al lado del plato, con un mordisco que le deja ver el adentro.
  const suelto = bunuelo(rx + 8, -12, 12, 633, 'm-bunuelos-suelto', true);
  return conGrano(plato + receta + filas + suelto + nube(0, -52, 60, 20, C.azucar, 'm', 0.3));
}

/** El buñuelo de arriba, solo, centrado en el (0, 0): sale de la pila. */
function tope(): string {
  return conGrano(bunuelo(0, 0, 15, 640, 'm-bunuelos-tope'));
}

/** Un hilo de vapor: una S de humo blanco que se afloja, centrada en el (0, 0). */
function vapor(): string {
  const d = 'M0 18 C-12 10 10 2 0 -8 C-8 -16 6 -22 -2 -30';
  return nube(0, -6, 8, 22, C.azucar, 's', 0.5) + trazo(d, C.azucar, 5, 0.55).replace('<path', '<path filter="url(#soplo-xs)"') + trazo(d, C.azucar, 1.8, 0.8);
}

/** El azúcar impalpable cayendo: una nubecita y granitos que se van para abajo. Centrada arriba de la pila. */
function azucar(): string {
  const rnd = azar(647);
  let granos = '';
  for (let i = 0; i < 46; i++) granos += forma(elipse(-58 + rnd() * 116, -128 + rnd() * 74, 0.9 + rnd() * 1, 0.9 + rnd() * 0.8), C.azucar, 0.7 + rnd() * 0.3);
  return nube(0, -106, 46, 20, C.azucar, 'm', 0.7) + nube(0, -86, 40, 10, C.azucar, 's', 0.55) + granos;
}

/** Un brazo de las pinzas de resorte: una cinta de acero ancha que sale del resorte, se afina y termina en una cuchara plana. */
function brazo(arriba: boolean): string {
  const [jx, jy] = A.bisagra;
  const s = arriba ? -1 : 1;
  const [tx, ty] = [jx - 112, jy + s * 5];
  const cinta = curva([[jx + 8, jy + s * 0.8 - 2.4], [jx - 26, jy + s * 2.6 - 2.2], [jx - 76, ty - 2.2], [tx, ty - 1.8], [tx, ty + 1.8], [jx - 76, ty + 2.2], [jx - 26, jy + s * 2.6 + 2.4], [jx + 8, jy + s * 0.8 + 2.6]], true);
  return conGrano(
    enmascarado(`m-bunuelos-brazo-${arriba ? 1 : 2}`, cinta, forma(cinta, C.acero) + nube(jx - 56, jy + s * 3.4 - 1, 40, 1.5, C.azucar, 'xs', 0.85) + nube(jx - 30, jy + s * 3.4 + 1.6, 26, 1.4, C.sombra, 'xs', 0.7)) +
    trazo(cinta, C.sombra, 0.8, 0.55) +
    forma(elipse(tx - 2, ty, 11, 6), C.acero) + trazo(elipse(tx - 2, ty, 11, 6), C.sombra, 1, 0.8) + nube(tx - 5, ty - 1.6, 5, 1.8, C.azucar, 'xs', 0.85) +
    // El resorte: el codo donde se unen los dos brazos, con el remache.
    (arriba ? trazo(`M${jx + 8} ${jy - 3} q13 2 13 8 q0 5 -13 8`, C.acero, 4) + trazo(`M${jx + 8} ${jy - 3} q13 2 13 8 q0 5 -13 8`, C.azucar, 1.1, 0.55) + forma(elipse(jx + 2, jy + 1, 3, 3), C.loza) : ''),
  );
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 2.6;

export const PIEZAS_BUNUELOS: readonly Pieza[] = [
  { nombre: 'bunuelos-pila', caja: [-104, -102, 196, 110], dibujo: pila(), densidad: D },
  { nombre: 'bunuelos-tope', caja: [-22, -22, 44, 44], dibujo: tope(), densidad: D * 2.4 },
  { nombre: 'bunuelos-vapor', caja: [-24, -40, 48, 64], dibujo: vapor(), densidad: D * 1.4 },
  { nombre: 'bunuelos-azucar', caja: [-76, -140, 152, 100], dibujo: azucar(), densidad: D * 1.4 },
  { nombre: 'bunuelos-pinza-1', caja: [A.bisagra[0] - 130, A.bisagra[1] - 26, 170, 52], dibujo: brazo(true), densidad: D * 1.6 },
  { nombre: 'bunuelos-pinza-2', caja: [A.bisagra[0] - 130, A.bisagra[1] - 26, 170, 52], dibujo: brazo(false), densidad: D * 1.6 },
];

const img = imagenesDe(PIEZAS_BUNUELOS);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** La fuente armada con las marcas de un momento. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  return (
    parte('pila', img('bunuelos-pila'), t.pila) +
    parte('tope', img('bunuelos-tope'), t.tope) +
    parte('vapor-1', img('bunuelos-vapor'), t['vapor-1'], o['vapor-1']) +
    parte('vapor-2', img('bunuelos-vapor'), t['vapor-2'], o['vapor-2']) +
    parte('pinza', parte('pinza-2', img('bunuelos-pinza-2'), t['pinza-2']) + parte('pinza-1', img('bunuelos-pinza-1'), t['pinza-1']), t.pinza) +
    parte('azucar', img('bunuelos-azucar'), t.azucar, o.azucar)
  );
}

/** La fuente en un momento, sin lo que la hace tocable: para el test, el retrato y para mirarla. */
export function bunuelosEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/** Se toca la fuente entera. El toque no tiene verso: lo que dice es su línea (`LINEA`), que va de descripción para quien lee con lector. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--bunuelos" data-id="${ID}" role="button" tabindex="0" aria-label="${nombres.get(ID) ?? 'Los redonditos de ricota'}" aria-description="${LINEA}">` +
    // Un blanco para el dedo: la fuente es chica.
    `<ellipse cx="${FUENTE.x}" cy="${FUENTE.piso - 24}" rx="46" ry="34" fill="transparent"/>` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: el buñuelo de arriba, grande, en las pinzas. */
export const RETRATO = { caja: [FUENTE.x - 90, FUENTE.piso - 120, 180, 130] as const };
function retrato(): string {
  return (
    `<image href="/bestiario/galpon-lejos.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>` +
    `<image href="/bestiario/galpon-piso.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>` +
    bunuelosEn(OFRECE)
  );
}

export const BUNUELOS_PERSONAJE: Personaje = {
  id: ID,
  region: 'el-galpon',
  ancla: FUENTE.x,
  piezas: PIEZAS_BUNUELOS,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
