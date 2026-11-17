/**
 * El aire del plano (`D-91`, tanda 6): el mundo redondo, visto desde arriba, tiene cielo entre el que mira y él.
 *
 * El plano era un diagrama perfecto: las trece porciones, las figuras y los carteles, todo a la misma
 * distancia del ojo. Lo que le faltaba para ser un lugar es lo mismo que les faltaba a los caminos antes
 * de `D-90`: **algo en el medio**. Acá el medio es el cielo de la noche, mirado desde arriba:
 *
 * - **Las nubes** (`plano-nubes`): bancos de niebla en jirones que pasan despacio por encima del disco,
 *   dando la vuelta con él como da la vuelta un disco. No tapan: tienen huecos, y en el medio (el galpón)
 *   casi no hay. Con la lupa se abren del todo: acercarse es meterse abajo de ellas.
 * - **La lechuza** (`plano-lechuza`): muy cada tanto cruza el plano un pájaro grande, visto desde arriba,
 *   con su mancha en el piso corrida para un lado. Es lo que cruza lejos, raro, de a uno.
 *
 * Es aerógrafo con grano, impreso, en las tintas de la entrada (`arte-portal.ts`): la niebla y la luna.
 * La página las pone arriba del dibujo y debajo de los carteles, que son lo que se toca; solo se mueven
 * con `transform` y `opacity`, y con movimiento reducido quedan quietas.
 */

import { forma, nube, type Pieza } from './aerografo.ts';
import { azar } from './pincel.ts';

const T = {
  niebla: 'var(--portal-niebla)',
  luna: 'var(--portal-luna)',
  cielo: 'var(--portal-cielo)',
  negro: 'var(--fondo)',
};

const f = (v: number): string => (Math.round(v * 10) / 10).toString();
/** El plano mide 1000 de lado (`LADO` en `mapa.ts`) y el disco entra justo: el medio, y hasta dónde llegan las nubes. */
export const DISCO = { medio: 500, radio: 484, claro: 150 } as const;

/** Los bancos de nubes: `[ángulo en grados, distancia al medio, largo, alto]`. Siete, desparejos, con dos huecos grandes entre ellos. */
export const BANCOS: readonly (readonly [number, number, number, number])[] = [
  [18, 350, 210, 62],
  [64, 250, 130, 40],
  [118, 400, 250, 70],
  [176, 300, 160, 48],
  [214, 420, 190, 54],
  [282, 330, 230, 66],
  [326, 230, 120, 38],
];

/** Un banco: un lomo claro arriba, la panza más oscura, y jirones que se le escapan por las puntas. Va acostado a lo largo de su vuelta. */
function banco(ang: number, dist: number, largo: number, alto: number, semilla: number): string {
  const rnd = azar(semilla);
  const a = (ang * Math.PI) / 180;
  const [cx, cy] = [DISCO.medio + Math.cos(a) * dist, DISCO.medio + Math.sin(a) * dist];
  let s = '';
  for (let i = 0; i < 7; i++) {
    const u = i / 6 - 0.5;
    const x = u * largo + (rnd() - 0.5) * 14;
    const y = (rnd() - 0.5) * alto * 0.7 - Math.cos(u * Math.PI) * alto * 0.2;
    const [rx, ry] = [largo * (0.13 + rnd() * 0.1), alto * (0.34 + rnd() * 0.3)];
    s += nube(x + 5, y + ry * 0.7, rx * 1.1, ry, T.negro, 'l', 0.4) + nube(x, y, rx * 1.15, ry * 1.2, T.niebla, 'm', 0.92) + nube(x - rx * 0.2, y - ry * 0.4, rx * 0.7, ry * 0.5, T.luna, 'm', 0.7);
  }
  // Los jirones: tiras finas y rotas, a las puntas y por debajo.
  for (let i = 0; i < 5; i++) {
    const lado = i % 2 ? 1 : -1;
    const x = lado * largo * (0.46 + rnd() * 0.3);
    const y = (rnd() - 0.3) * alto;
    s += nube(x, y, 20 + rnd() * 34, 2.6 + rnd() * 3.4, T.niebla, 's', 0.7 + rnd() * 0.2, (rnd() - 0.5) * 16);
  }
  // Acostado sobre la tangente: da la vuelta con el disco sin quedar atravesado.
  return `<g transform="translate(${f(cx)} ${f(cy)}) rotate(${f(ang + 90)})">${s}</g>`;
}

function nubes(): string {
  const { medio, radio, claro } = DISCO;
  return (
    // La máscara: el disco, con el canto y el medio soplados. Las nubes no llegan al borde ni tapan el galpón.
    `<mask id="pl-disco"><rect x="0" y="0" width="1000" height="1000" fill="black"/>` +
    `<circle cx="${medio}" cy="${medio}" r="${radio - 26}" fill="white" filter="url(#soplo-l)"/>` +
    `<circle cx="${medio}" cy="${medio}" r="${claro}" fill="black" filter="url(#soplo-xl)"/></mask>` +
    `<g filter="url(#rociado)"><rect x="0" y="0" width="1000" height="1000" fill="${T.negro}" fill-opacity="0"/>` +
    `<g mask="url(#pl-disco)">${BANCOS.map(([ang, dist, largo, alto], i) => banco(ang, dist, largo, alto, 8100 + i)).join('')}</g></g>`
  );
}

/** La lechuza, vista desde arriba: las alas abiertas, la cabeza redonda adelante, la cola en abanico. Vuela para la derecha. */
export const LECHUZA = { caja: [0, 0, 150, 120] as const } as const;

function lechuza(): string {
  const [, , w, h] = LECHUZA.caja;
  const cuerpo = (dx: number, dy: number, color: string, o: number): string =>
    `<g transform="translate(${dx} ${dy})" opacity="${o}">` +
    // Las dos alas, con las plumas de la punta abiertas, y el cuerpo con la cabeza.
    forma('M70 50 C52 30 34 12 8 6 C14 16 18 22 12 24 C22 28 24 34 18 37 C30 40 34 45 30 49 C44 50 58 54 70 58 Z', color) +
    forma('M70 58 C58 64 44 68 30 69 C34 73 30 78 18 81 C24 84 22 90 12 94 C18 96 14 102 8 112 C34 106 52 88 70 68 Z', color) +
    forma('M58 59 C58 50 68 46 82 48 C96 48 106 53 106 59 C106 65 96 70 82 70 C68 72 58 68 58 59 Z', color) +
    forma('M60 54 L40 48 L44 59 L40 70 L60 64 Z', color) +
    `</g>`;
  return (
    `<g filter="url(#rociado)"><rect x="0" y="0" width="${w}" height="${h}" fill="${T.negro}" fill-opacity="0"/>` +
    // La mancha en el piso, corrida y soplada: es lo que dice que vuela alto.
    `<g filter="url(#soplo-s)">${cuerpo(26, 10, T.negro, 0.5)}</g>` +
    cuerpo(0, 0, T.luna, 0.92) +
    // El lomo, más oscuro, y los dos discos de la cara.
    nube(74, 59, 16, 8, T.niebla, 's', 0.7) +
    `<circle cx="96" cy="55.4" r="3" fill="${T.negro}" opacity="0.8"/><circle cx="96" cy="63" r="3" fill="${T.negro}" opacity="0.8"/>` +
    `</g>`
  );
}

/** Las piezas del aire del plano. Las imprime `scripts/imprimir-bestiario.mjs` con las del camino. */
export const PIEZAS_DEL_PLANO: readonly Pieza[] = [
  // Es niebla: no tiene filo que cuidar. A 0,8 píxeles por unidad ocupa 2,4 MB decodificada.
  { nombre: 'plano-nubes', caja: [0, 0, 1000, 1000], dibujo: nubes(), densidad: 0.8, calidad: 60 },
  { nombre: 'plano-lechuza', caja: LECHUZA.caja, dibujo: lechuza(), densidad: 1.2 },
];
