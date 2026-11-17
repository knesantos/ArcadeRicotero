/**
 * El aire del plano (`D-91`, tanda 6): el mundo redondo, visto desde arriba, tiene cielo entre el que mira y él.
 *
 * El plano era un diagrama perfecto: las trece porciones, las figuras y los carteles, todo a la misma
 * distancia del ojo. Lo que le faltaba para ser un lugar es lo mismo que les faltaba a los caminos antes
 * de `D-90`: **algo en el medio**. Acá el medio es el cielo de la noche, mirado desde arriba:
 *
 * - **Las nubes** (`plano-nubes`): bancos de niebla en jirones por el borde del disco y sobre la ruta,
 *   acostados a lo largo de su vuelta. No tapan ninguna porción: el disco queda con su color. Están quietas (girando
 *   costaban cuadros y no se notaba). Con la lupa se abren del todo: acercarse es meterse abajo de ellas.
 * - **La lechuza** (`plano-lechuza`): muy cada tanto cruza el plano un pájaro grande, visto desde arriba,
 *   con su mancha en el piso corrida para un lado. Es lo que cruza lejos, raro, de a uno.
 *
 * Es aerógrafo con grano, impreso, en las tintas de la entrada (`arte-portal.ts`): la niebla y la luna.
 * La página las pone arriba del dibujo y debajo de los carteles, que son lo que se toca; solo se mueven
 * con `transform` y `opacity`, y con movimiento reducido la lechuza no pasa.
 */

import { forma, nube, type Pieza } from './aerografo.ts';
import { azar } from './pincel.ts';
import { dibujarGrupo, type Dibujo } from './figuras.ts';
import { AUMENTO_DEL_PLANO, LAS_DEL_PLANO } from './plano-elenco.ts';

const T = {
  niebla: 'var(--portal-niebla)',
  luna: 'var(--portal-luna)',
  cielo: 'var(--portal-cielo)',
  negro: 'var(--fondo)',
};

const f = (v: number): string => (Math.round(v * 10) / 10).toString();
/** El plano mide 1000 de lado (`LADO` en `mapa.ts`) y el disco entra justo: el medio, y hasta dónde llegan las nubes. */
// Segunda vuelta: el claro del medio pasó de 150 a 372. Con las nubes sobre las porciones el disco quedaba lavado en el
// teléfono; ahora andan por el borde y sobre la ruta (que va de 432 a 476), y las trece porciones quedan con su color.
export const DISCO = { medio: 500, radio: 484, claro: 372 } as const;

/** Los bancos de nubes: `[ángulo en grados, distancia al medio, largo, alto]`. Siete, desparejos, con dos huecos grandes entre ellos. */
export const BANCOS: readonly (readonly [number, number, number, number])[] = [
  [18, 444, 230, 30],
  [64, 436, 150, 24],
  [118, 448, 260, 32],
  [176, 438, 170, 26],
  [214, 450, 200, 30],
  [282, 442, 250, 32],
  [326, 434, 140, 22],
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
    `<circle cx="${medio}" cy="${medio}" r="${radio - 8}" fill="white" filter="url(#soplo-m)"/>` +
    `<circle cx="${medio}" cy="${medio}" r="${claro}" fill="black" filter="url(#soplo-l)"/></mask>` +
    `<g filter="url(#rociado)"><rect x="0" y="0" width="1000" height="1000" fill="${T.negro}" fill-opacity="0"/>` +
    `<g mask="url(#pl-disco)">${BANCOS.map(([ang, dist, largo, alto], i) => banco(ang, dist, largo, alto, 8100 + i)).join('')}</g></g>`
  );
}

/* El cierre (cuarta vuelta): el cielo cerrado. Al tocar un cartel, las nubes del borde se cerraban achicándose, y un
   anillo fino de jirones no tapa nada: casi no se veía. Esto es una segunda imagen, impresa chica, con treinta bancos gordos
   repartidos del galpón al borde. Espera apagada y entra girando cuando se baja a una región. */
export const BANCOS_DEL_CIERRE: readonly (readonly [number, number, number, number])[] = (() => {
  // Desparejos a propósito: en vueltas prolijas (la primera prueba) se leían como sogas trenzadas, no como cielo.
  const rnd = azar(8399);
  const bancos: [number, number, number, number][] = [];
  for (let i = 0; i < 30; i++) bancos.push([Math.round(i * 137.5 + rnd() * 40) % 360, Math.round(60 + Math.sqrt((i + 0.5) / 30) * 380 + (rnd() - 0.5) * 50), Math.round(130 + rnd() * 90), Math.round(84 + rnd() * 44)]);
  return bancos;
})();

function cierre(): string {
  const { medio, radio } = DISCO;
  return (
    `<mask id="pl-cierre"><rect x="0" y="0" width="1000" height="1000" fill="black"/><circle cx="${medio}" cy="${medio}" r="${radio - 10}" fill="white" filter="url(#soplo-m)"/></mask>` +
    `<g filter="url(#rociado)"><rect x="0" y="0" width="1000" height="1000" fill="${T.negro}" fill-opacity="0"/>` +
    `<g mask="url(#pl-cierre)">${BANCOS_DEL_CIERRE.map(([ang, dist, largo, alto], i) => banco(ang, dist, largo, alto, 8400 + i)).join('')}</g></g>`
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

/* ------------------------------------------------------------------
   Los hitos (segunda vuelta): lo que las tandas le sumaron a cada región, en chiquito, para la lupa
   ------------------------------------------------------------------
   Tres dibujos de 44 unidades (eran cinco hasta la cuarta vuelta), cada uno en el borde de afuera de su porción, del lado de la ruta. En un teléfono
   miden dieciocho píxeles: de lejos son una mancha, y con la lupa se leen. Tinta plana con grano, como las figuras
   del plano; cada uno con una sola tinta de su región además del negro y el papel.
*/

const PAPEL = 'var(--papel)';
/** Ángulo desde el norte, en el sentido del reloj, como `polar` en `mapa.ts`. */
const enElPlano = (ang: number, r: number): readonly [number, number] => [500 + r * Math.sin((ang * Math.PI) / 180), 500 - r * Math.cos((ang * Math.PI) / 180)];
const linea = (d: string, ancho: number, color = T.negro): string => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${ancho}" stroke-linecap="round" stroke-linejoin="round"/>`;

/** Qué hito va en cada región, en el medio de su porción y a qué distancia del centro. Las porciones llegan hasta 425. */
// Van corridos del medio de la porción, del lado contrario al títere de afuera (`LUGAR_EN_EL_PLANO`).
export const HITOS: readonly { region: string; ang: number; r: number; dibujo: () => string }[] = [
  // La prisión: el arco de las cárceles, con su escalera y su puente.
  { region: 'la-prision', ang: 225, r: 398, dibujo: () => forma('M-16 18 L-16 -6 Q-16 -19 0 -19 Q16 -19 16 -6 L16 18 Z', T.negro) + linea('M-16 18 L-16 -6 Q-16 -19 0 -19 Q16 -19 16 -6 L16 18', 2, PAPEL) + linea('M-15 -3 L15 -6 M-14 16 l0 -5 l5 0 l0 -5 l5 0 l0 -5 l5 0 l0 -5 l6 0', 1.4, PAPEL) + linea('M6 -4 l0 9 q0 3 -3 2', 1, PAPEL) },
  // Los astilleros: el carguero, con su chimenea y la grúa.
  { region: 'los-astilleros', ang: 113, r: 400, dibujo: () => forma('M-20 6 L20 6 L15 15 L-16 15 Z', T.negro) + forma('M-12 6 l0 -8 l12 0 l0 8 Z M3 6 l0 -14 l5 0 l0 14 Z', T.negro) + linea('M-19 7 L19 7', 1.2, 'var(--entorno-astillero-tiza-clara)') + linea('M12 6 L12 -17 L-2 -10 M12 -17 l6 5', 1.4) + linea('M-9 -1 l2 0 M-5 -1 l2 0', 1, PAPEL) },
  // Cuarta vuelta: la puerta del templo y el arco del potrero se fueron. No se leían ni con la lupa al máximo, y al doble
  // (88 unidades) quedaban más grandes que el protagonista de su zona (unas 70) y se le encimaban: Momo está a 107 del
  // lugar de la puerta. Quedan los tres que sí se leen.
  // El bajo: el pasillo que se pierde, con la lamparita y su escalera de rayas en el agua.
  { region: 'el-bajo', ang: 152, r: 398, dibujo: () => forma('M-13 18 L-13 -17 L13 -17 L13 18 Z', T.negro) + linea('M-13 18 L-13 -17 L13 -17 L13 18 M-8 14 L-8 -11 L8 -11 L8 14 M-4 9 L-4 -6 L4 -6 L4 9', 1.3, PAPEL) + `<circle cx="0" cy="-1" r="2" fill="var(--entorno-bajo-llama-clara)"/>` + linea('M-2 5 l4 0 M-4 10 l8 0 M-6 15 l12 0', 1.3, 'var(--entorno-bajo-llama)') },
];

/** La caja de un hito en el plano: 44 de lado, centrada en su lugar. */
export const cajaDelHito = (h: { ang: number; r: number }): readonly [number, number, number, number] => {
  const [x, y] = enElPlano(h.ang, h.r);
  return [Math.round(x) - 22, Math.round(y) - 22, 44, 44];
};

function hito(h: (typeof HITOS)[number]): string {
  const [x, y, w, alto] = cajaDelHito(h);
  return `<g filter="url(#grano)"><rect x="${x}" y="${y}" width="${w}" height="${alto}" fill="${T.negro}" fill-opacity="0"/><g transform="translate(${x + 22} ${y + 22})">${h.dibujo()}</g></g>`;
}

/* ------------------------------------------------------------------
   Los títeres del plano (segunda vuelta): cartón recortado, dos por zona
   ------------------------------------------------------------------
   Pedido del usuario: *"que mejore los títeres en mapa"*. Las figuras del plano eran los `<symbol>` de `figuras.ts`
   en tinta negra pareja. Siguen siendo esas figuras (las fichas las usan igual, sin tocar), pero las dos de cada zona
   se **imprimen** como un títere de cartón: el recorte de papel alrededor de la silueta, un canto en la tinta de su
   región, el palito que lo sostiene y el grano de la cartulina. La página las pone como imagen, más grandes.
*/

/** Lo que pinta cada clase de `figuras.ts` (`sitio.css`, «Las figuras»), para la imprenta. `TR` es la tinta de la región. */
const TINTAS: Readonly<Record<string, string>> = {
  'b-tn': 'fill:var(--fondo)',
  'b-osc': 'fill:var(--borde)',
  'b-pp': 'fill:var(--papel)',
  'b-ac': 'fill:TR',
  'b-ac2': 'fill:TR;fill-opacity:0.55',
  'b-oro': 'fill:var(--acento-2)',
  'b-az': 'fill:var(--disco-un-baion-para-el-ojo-idiota-apoyo)',
  'b-ag': 'fill:var(--disco-un-baion-para-el-ojo-idiota-tinta);fill-opacity:0.6',
  'b-barro': 'fill:var(--disco-luzbelito-apoyo)',
  'b-borde': 'stroke:var(--fondo);stroke-width:2.5',
  'b-borde-grueso': 'stroke:var(--fondo);stroke-width:5;stroke-linejoin:round',
  'b-lana': 'fill:var(--papel);stroke:var(--fondo);stroke-width:2',
  'b-tz': 'fill:none;stroke-linecap:round;stroke-linejoin:round;stroke:var(--fondo)',
  'b-tz-pp': 'fill:none;stroke-linecap:round;stroke-linejoin:round;stroke:var(--papel)',
  'b-tz-oro': 'fill:none;stroke-linecap:round;stroke-linejoin:round;stroke:var(--acento-2);stroke-width:2.5',
  'b-pun': 'fill:none;stroke-linecap:round;stroke-linejoin:round;stroke:var(--fondo);stroke-width:2;stroke-dasharray:3 3',
};

/** El marcado de una figura con las tintas puestas en cada pieza, en vez de las clases que pinta la hoja de estilos. */
export function conTinta(marcado: string, tr: string): string {
  return marcado.replace(/class="([^"]+)"/g, (_, clases: string) => {
    const estilo = clases.split(' ').map((c) => {
      const t = TINTAS[c];
      if (t === undefined) throw new Error(`arte-plano.ts no sabe pintar la clase "${c}" de figuras.ts`);
      return t.replaceAll('TR', tr);
    });
    return `style="${estilo.join(';')}"`;
  });
}

/** La caja del títere impreso, en las unidades de la figura (que va de −10 a 110 y de −15 a 100): con lugar para el recorte y el palito. */
export const CAJA_DEL_TITERE = [-18, -23, 136, 146] as const;

export interface TitereDelPlano {
  id: string;
  dibujo: Dibujo;
  cantidad?: number;
  tam: number;
}

/* Tercera vuelta: el gesto. Cinco protagonistas se redibujan acá, cada uno en su pose, en vez de salir del molde de
   `figuras.ts` (que sigue igual para las fichas): el gordo Pierre brindando con el agua a la cintura, Barbazul con la
   barba hasta la panza y la llave, Luzbelito con la llama en la cabeza, Momo como el medallón que cuelga, y el lobo
   aullando. En la cuarta vuelta se sumaron los otros ocho protagonistas: los trece tienen dibujo propio. Las trece
   segundas figuras salen del molde. Todos, propios o de molde, pasan por el mismo aerógrafo. */

const N = 'var(--fondo)';
const P_ = 'var(--papel)';
const ORO = 'var(--acento-2)';
const raya = (d: string, color: string, ancho: number): string => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${ancho}" stroke-linecap="round" stroke-linejoin="round"/>`;
const lleno = (d: string, color: string): string => `<path d="${d}" fill="${color}"/>`;

/** Los que tienen dibujo propio: en la caja de 100 × 100 de las figuras, con el piso en 92. */
export const PROPIOS: Readonly<Record<string, (tr: string) => string>> = {
  // *"El gordo Pierre"*: una panza enorme con el agua a la cintura, la cabeza chica echada para atrás, y la botella en alto.
  'el-gordo-pierre': () =>
    `<ellipse cx="50" cy="64" rx="37" ry="29" fill="${N}"/>` +
    lleno('M22 54 Q4 40 12 16 L22 19 Q20 36 34 46 Z', N) +
    lleno('M9 0 l9 1 l-1 19 l-10 -1 Z', 'var(--bestia-pierre-verde)') + lleno('M9.6 8 l8 1 l-0.4 6 l-8 -1 Z', P_) +
    `<circle cx="52" cy="27" r="17.5" fill="${P_}"/>` +
    raya('M40 21 q5 -4 9 0 M56 21 q5 -4 9 0', N, 2.6) +
    lleno('M41 32 Q52 46 65 31 Q52 37 41 32 Z', N) +
    `<ellipse cx="53" cy="28.4" rx="4.4" ry="3.2" fill="var(--disco-gulp-tinta)"/>` +
    lleno('M49 44.6 l7 0 l4 25 l-7.4 7 l-6.6 -7 Z', 'var(--disco-gulp-tinta)') +
    `<path d="M10 82 q40 13 80 0" fill="none" stroke="${P_}" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="8 5"/>`,
  // Barbazul: alto, el pelo hasta los hombros, la barba azul hasta la panza, y la llave del cuarto colgando de la mano.
  barbazul: () =>
    lleno('M28 92 L33 40 Q50 30 67 40 L73 92 Z', N) +
    lleno('M32 12 Q50 -4 68 12 L72 54 L62 30 L38 30 L28 54 Z', N) +
    lleno('M38 13 Q50 7 62 13 L62 30 L38 30 Z', P_) +
    `<circle cx="45" cy="20.6" r="2.4" fill="${N}"/><circle cx="56" cy="20.6" r="2.4" fill="${N}"/>` + raya('M41 15.6 l7 2 M60 15.6 l-7 2', N, 1.8) +
    lleno('M36 26 Q50 21 64 26 Q68 54 50 76 Q32 54 36 26 Z', 'var(--disco-un-baion-para-el-ojo-idiota-apoyo)') +
    raya('M43 34 q2 16 6 32 M57 34 q-2 15 -5 30 M50 30 l0 20', N, 1.5) +
    raya('M69 46 L80 58', N, 6.4) +
    `<circle cx="82" cy="63" r="4.4" fill="none" stroke="${ORO}" stroke-width="2.6"/>` + raya('M82 67.4 l0 15 l4.4 0 M82 77 l4 0', ORO, 2.4),
  // Luzbelito: el busto, los cuernitos, la cara de nene serio y la llama prendida arriba de la cabeza.
  luzbelito: () =>
    lleno('M20 92 Q23 62 50 57 Q77 62 80 92 Z', N) +
    lleno('M36 34 L29 15 L43 29 Z M64 34 L71 15 L57 29 Z', N) +
    `<circle cx="50" cy="43" r="17.6" fill="${P_}"/>` +
    raya('M41 39 l7 2.4 M59 39 l-7 2.4', N, 2.4) + `<circle cx="44.6" cy="44.6" r="2.2" fill="${N}"/><circle cx="55.4" cy="44.6" r="2.2" fill="${N}"/>` + raya('M44 53 q6 -3 12 0', N, 2) +
    lleno('M50 27 Q38 14 50 -8 Q54 5 61 10 Q63 21 50 27 Z', 'var(--entorno-infierno-fuego)') + lleno('M50 25 Q45 16 50 5 Q56 14 50 25 Z', ORO),
  // Momo: el medallón de la tapa, colgado de su cordón, con el ceño y la boca para abajo.
  momo: () =>
    raya('M50 -14 L50 14', N, 2.6) + `<circle cx="50" cy="12" r="4" fill="none" stroke="${N}" stroke-width="2.4"/>` +
    `<circle cx="50" cy="53" r="38" fill="var(--disco-momo-sampler-tinta)"/><circle cx="50" cy="53" r="38" fill="none" stroke="${N}" stroke-width="3.2"/>` +
    raya('M30 30 q20 -10 40 0 M35 24 q15 -6 30 0', 'var(--disco-momo-sampler-apoyo)', 1.8) +
    raya('M25 41 Q36 30 46 43 M54 43 Q64 30 75 41', N, 3.6) +
    `<ellipse cx="37" cy="49.4" rx="6.4" ry="4.2" fill="${N}"/><ellipse cx="63" cy="49.4" rx="6.4" ry="4.2" fill="${N}"/>` +
    lleno('M50 45 L43.6 63 L56.4 63 Z', 'var(--disco-momo-sampler-apoyo)') +
    lleno('M31 78 Q50 62 69 78 Q50 71 31 78 Z', N),
  // El lobo suelto: parado en las cuatro patas, el hocico para el cielo, aullando. El ojo, de oro.
  'el-lobo-suelto': (tr) =>
    lleno('M12 54 Q-7 57 2 82 Q8 67 19 63 Z', N) +
    lleno('M10 70 Q4 50 16 44 L44 40 L57 29 L63 4 L71 21 L84 8 L80 29 L93 33 L79 40 L74 47 L70 60 L74 92 L64 92 L60 68 L40 70 L36 92 L26 92 L26 70 Q18 74 10 70 Z', N) +
    lleno('M57 44 Q66 52 62 65 L55 58 Z', tr) +
    `<circle cx="72.4" cy="26" r="2.6" fill="${ORO}"/>` + lleno('M83 30 l3 5.4 l2.2 -5 Z', P_),

  /* Cuarta vuelta: los ocho protagonistas que quedaban con el molde. De cada uno, primero lo que dice su letra o su
     estampa; lo que es del dibujo se dice. */

  // *"Quiero verte huir como un ladrón… hundido en tu gabán"*: corre en zancada, el cuello del gabán le tapa media cara
  // y los faldones le vuelan atrás. Del dibujo: el forro en la tinta de los techos.
  'el-negro-atila': (tr) =>
    lleno('M30 58 L2 62 L8 74 L0 84 L30 78 Z', tr) +
    raya('M52 62 L36 78 L20 80', N, 8) + raya('M62 62 L80 76 L92 72', N, 8) + lleno('M86 66 l10 2 l-2 10 l-10 -4 Z', N) + lleno('M22 74 l-10 4 l2 8 l10 -2 Z', N) +
    `<circle cx="60" cy="16" r="11" fill="${P_}"/>` +
    raya('M51 9 Q60 3 70 9', N, 3) +
    `<circle cx="59" cy="14.6" r="2.3" fill="${N}"/><circle cx="67" cy="14.6" r="2.3" fill="${N}"/>` +
    lleno('M40 30 L45 15 L56 24 L69 24 L77 13 L80 32 L76 52 L72 68 L44 70 L28 82 L6 66 L30 52 Z', N) +
    raya('M74 32 L88 40 L92 28', N, 7) + raya('M46 34 L30 44 L22 36', N, 7) +
    raya('M60 26 L57 66', tr, 1.8) + `<circle cx="62" cy="36" r="1.8" fill="${ORO}"/><circle cx="61" cy="46" r="1.8" fill="${ORO}"/><circle cx="60" cy="56" r="1.8" fill="${ORO}"/>`,

  // *"Soy un gourmet que huele eternamente mal"*: en la cabecera, la servilleta atada al cuello y los cubiertos parados
  // en los puños (eso es de su estampa), el plato vacío y el olor que le sube. Del dibujo: la sonrisa de dientes.
  'el-canibal': (tr) =>
    raya('M30 6 q-5 -6 0 -11 q5 -5 0 -10 M70 6 q5 -6 0 -11 q-5 -5 0 -10', N, 2.6) +
    lleno('M24 70 Q24 40 50 38 Q76 40 76 70 Z', N) +
    raya('M30 52 L15 62', N, 9) + raya('M70 52 L85 62', N, 9) +
    raya('M15 64 L15 28 M9 28 L9 12 M15 28 L15 12 M21 28 L21 12 M9 28 L21 28', N, 3.4) +
    raya('M85 64 L85 34', N, 3.4) + lleno('M81.6 36 L81.6 8 Q92 18 90 36 Z', N) +
    `<circle cx="50" cy="25" r="16" fill="${P_}"/>` +
    raya('M39 17 l8 2 M61 17 l-8 2', N, 2.4) + `<circle cx="43.6" cy="22" r="2.4" fill="${N}"/><circle cx="56.4" cy="22" r="2.4" fill="${N}"/>` +
    lleno('M38 28 Q50 44 62 28 Z', N) + raya('M42 29.4 l0 3 M46 29.6 l0 5 M50 29.6 l0 5.6 M54 29.6 l0 5 M58 29.4 l0 3', P_, 1.5) +
    lleno('M39 41 L61 41 L50 64 Z', P_) + lleno('M36 38 l7 3 l-6 5 Z M64 38 l-7 3 l6 5 Z', P_) +
    lleno('M2 66 L98 66 L92 91 L8 91 Z', N) + raya('M4 70 L96 70', tr, 2.6) +
    `<ellipse cx="50" cy="72" rx="17" ry="4.6" fill="${P_}"/><ellipse cx="50" cy="72" rx="10" ry="2.4" fill="none" stroke="${N}" stroke-width="1.2"/>`,

  // *"Sentado, en bolas, watcheando la tele"*: de costado, sentado en el piso, desnudo, y lo dibuja la luz de la tele
  // (el filo celeste de adelante). La capa sale del cómic que contó el Indio. La gorra es del dibujo.
  'el-capitan-buscapina': () =>
    lleno('M40 28 Q16 48 6 91 L52 91 Q44 60 52 30 Z', 'var(--bestia-buscapina-rojo)') +
    raya('M30 44 Q20 62 16 86', 'var(--bestia-buscapina-violeta)', 2.4) +
    `<ellipse cx="44" cy="79" rx="15" ry="12" fill="var(--bestia-buscapina-piel)"/>` +
    lleno('M40 30 Q60 26 63 44 L61 74 Q50 82 40 76 Q35 50 40 30 Z', 'var(--bestia-buscapina-piel)') +
    raya('M48 80 L76 58', 'var(--bestia-buscapina-piel)', 12) + raya('M76 58 L82 86', 'var(--bestia-buscapina-piel)', 9.6) + raya('M82 88 L93 88', 'var(--bestia-buscapina-piel)', 7) +
    raya('M54 38 L66 56 L78 54', 'var(--bestia-buscapina-piel-honda)', 7) +
    raya('M36 72 q5 8 2 17', 'var(--bestia-buscapina-piel-honda)', 2) +
    `<circle cx="57" cy="17" r="11.6" fill="var(--bestia-buscapina-piel)"/>` +
    lleno('M44 16 Q45 1 58 2 Q70 3 70 13 L84 15.6 L84 19.6 L44 19.6 Z', N) + `<circle cx="62" cy="10" r="2.4" fill="${ORO}"/>` +
    `<circle cx="63.6" cy="23" r="1.9" fill="${N}"/>` +
    raya('M64.6 40 L62.6 62 M81 60 L86.6 84', 'var(--entorno-cyber-lente)', 2.4),

  // *"Rapiñaba montado a los containers"*: sentado en el canto del container, las piernas colgando, la strato roja a
  // la espalda con el mango para arriba y el pucho (la guitarra y el pucho son de su estampa, que los saca de la letra).
  'el-pibe-de-los-astilleros': () =>
    raya('M56 44 L84 2', 'var(--bestia-pibe-strato)', 5) + lleno('M80 -1 L90 -8 L93 -2 L86 6 Z', N) +
    `<ellipse cx="54" cy="47" rx="11" ry="15" transform="rotate(34 54 47)" fill="var(--bestia-pibe-strato)"/>` +
    lleno('M34 58 L37 34 Q46 25 55 34 L58 58 Z', N) +
    raya('M38 38 L27 56', N, 6.4) + raya('M55 38 L67 56', N, 6.4) +
    `<circle cx="46" cy="21" r="10.6" fill="${P_}"/>` + lleno('M35 20 Q36 7 47 8 Q58 8 57 20 Q48 13 35 20 Z', N) +
    `<circle cx="42.6" cy="22.6" r="1.9" fill="${N}"/><circle cx="50.4" cy="22.6" r="1.9" fill="${N}"/>` +
    raya('M51 28.6 l9 1.6', P_, 2) + `<circle cx="61.6" cy="30.6" r="1.8" fill="var(--acento)"/>` +
    lleno('M6 56 L94 56 L94 91 L6 91 Z', 'var(--entorno-astillero-azul)') + lleno('M4 54 L96 54 L96 61 L4 61 Z', N) + lleno('M4 87 L96 87 L96 92 L4 92 Z', N) +
    raya('M16 64 l0 21 M26 64 l0 21 M66 64 l0 21 M76 64 l0 21 M86 64 l0 21', N, 2.4) +
    raya('M40 58 L39 76', N, 7.6) + raya('M53 58 L55 76', N, 7.6) + lleno('M33 75 l11 0 l0 6 l-13 0 Z M50 75 l11 0 l2 6 l-13 0 Z', P_),

  // *"Miren lo que este bicho logró"*: trepado al tronco, la cola larga enroscada, estirándose al fruto dulce y raro
  // de su estampa. El bonete sale del nombre (y de los que cuelgan del árbol en su región). La tinta de la región es un
  // beige que sobre el papel no se ve: el bonete va en el rojo de la tierra del árbol.
  'el-bicho-del-gran-bonete': () =>
    lleno('M46 -12 L60 -12 L62 92 L44 92 Z', 'var(--entorno-arbol-cobre-hondo)') + raya('M50 -6 L51 86 M56 4 L56 60', 'var(--entorno-arbol-cobre)', 1.4) +
    raya('M60 40 Q78 36 88 22', 'var(--entorno-arbol-cobre-hondo)', 5.4) +
    `<circle cx="88" cy="31" r="8.6" fill="${ORO}"/>` + lleno('M88 23 q6 -8 12 -4 q-5 6 -12 4 Z', 'var(--bestia-pierre-verde)') +
    raya('M30 72 Q4 86 8 62 Q10 50 20 54', N, 5) +
    `<ellipse cx="36" cy="54" rx="14" ry="21" transform="rotate(-8 36 54)" fill="${N}"/>` +
    raya('M40 44 L64 40', N, 6.4) + raya('M38 70 L64 72', N, 7.4) + raya('M42 36 Q62 28 78 30', N, 5.4) +
    `<circle cx="24" cy="22" r="6" fill="${N}"/><circle cx="44" cy="18" r="6" fill="${N}"/><circle cx="34" cy="28" r="12.6" fill="${N}"/>` +
    lleno('M40 30 L52 31 L44 37 Z', N) +
    `<circle cx="38.6" cy="26" r="3" fill="${ORO}"/><circle cx="39.6" cy="26" r="1.3" fill="${N}"/>` +
    lleno('M22 18 L26 -14 L44 13 Z', 'var(--entorno-arbol-tierra-viva)') + raya('M24 9 L38 4 M25.4 -2 L31.6 -4', P_, 2.4) + `<circle cx="26" cy="-14" r="3" fill="${P_}"/>`,

  // El cordero atado: la soga tirante de la estaca al cogote, las patas clavadas, la lana en copos. Todo de su estampa.
  'el-cordero-atado': (tr) =>
    lleno('M3 56 L13 56 L12 92 L4 92 Z', N) + raya('M8 62 L44 53', ORO, 3) +
    raya('M50 70 L44 91 M60 72 L56 91 M76 72 L75 91 M85 68 L86 91', N, 6) +
    [[50, 58, 11], [62, 51, 13], [75, 53, 12], [85, 60, 10], [66, 65, 12], [54, 67, 9], [78, 67, 10], [93, 55, 4.6], [43, 33, 5.4], [37, 32, 4.4]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r! + 2.6}" fill="${N}"/>`).join('') +
    [[50, 58, 11], [62, 51, 13], [75, 53, 12], [85, 60, 10], [66, 65, 12], [54, 67, 9], [78, 67, 10], [93, 55, 4.6], [43, 33, 5.4], [37, 32, 4.4]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${P_}"/>`).join('') +
    raya('M58 56 q4 -4 8 0 M70 62 q4 -4 8 0 M60 68 q3 -3 6 0', N, 1.4) +
    lleno('M46 36 Q38 31 30 37 L21 44 Q17 50 23 54 L35 54 Q46 52 48 43 Z', N) +
    lleno('M43 40 Q55 41 53 55 Q46 52 42 46 Z', N) +
    `<circle cx="33" cy="42.6" r="2.4" fill="${P_}"/><circle cx="32.4" cy="42.8" r="1.1" fill="${N}"/>` + raya('M22 50 l4 0.6', P_, 1.4) +
    raya('M43 47 L48 57', tr, 3.4),

  // Patricio Rey: la silla vacía, de frente, con el tapizado rojo del galpón, y nadie. Del dibujo: los rayos (que ya
  // traía la figura) y la corona colgada del respaldo, que sale del nombre. La cara no se le inventa.
  'patricio-rey': () =>
    raya('M50 -6 l0 -9 M88 2 l8 -7 M97 24 l10 -2 M3 24 l-10 -2', ORO, 3.4) +
    raya('M28 6 L28 62 M72 6 L72 62', N, 8) + lleno('M28 6 Q50 -2 72 6 L72 20 L28 20 Z', N) +
    lleno('M33 24 L67 24 L67 50 L33 50 Z', 'var(--entorno-galpon-rojo)') + lleno('M28 50 L72 50 L72 56 L28 56 Z', N) +
    `<circle cx="42" cy="32" r="1.6" fill="${N}"/><circle cx="58" cy="32" r="1.6" fill="${N}"/><circle cx="42" cy="42" r="1.6" fill="${N}"/><circle cx="58" cy="42" r="1.6" fill="${N}"/>` +
    lleno('M22 58 L78 58 L88 71 L12 71 Z', 'var(--entorno-galpon-rojo)') + lleno('M12 71 L88 71 L88 78 L12 78 Z', N) +
    raya('M17 78 L17 91 M83 78 L83 91', N, 8) + raya('M33 78 L33 86 M67 78 L67 86', N, 5.4) +
    `<g transform="rotate(-16 28 4)">` + lleno('M15 6 L12 -12 L21 -4 L28 -15 L35 -4 L44 -12 L41 6 Z', ORO) + raya('M16 3 L40 3', N, 1.6) + `</g>`,

  // *"El zumba se colgó del Bondi a Finisterre"*: el colectivo de lomo redondo y, colgado del estribo de atrás con una
  // mano, el zumba, con la otra mano y una pierna en el aire.
  'el-zumba': (tr) =>
    lleno('M24 34 Q24 20 38 20 L88 20 Q100 20 100 36 L100 76 L24 76 Z', N) +
    lleno('M44 28 h13 v15 h-13 Z M61 28 h13 v15 h-13 Z M78 28 h15 q3 0 3 4 v11 h-18 Z', P_) +
    lleno('M42 52 L100 52 L100 58 L42 58 Z', tr) + lleno('M28 28 h11 v44 h-11 Z', 'var(--portal-farol)') +
    lleno('M66 11 h24 v9 h-24 Z', N) + raya('M70 15.6 l16 0', P_, 1.8) +
    `<circle cx="44" cy="78" r="9.6" fill="${N}"/><circle cx="84" cy="78" r="9.6" fill="${N}"/><circle cx="44" cy="78" r="3.6" fill="${P_}"/><circle cx="84" cy="78" r="3.6" fill="${P_}"/>` +
    lleno('M16 74 h14 v5 h-14 Z', N) +
    raya('M14 44 L19 63', N, 8.4) + raya('M15 45 L30 37', N, 4.8) + raya('M13 45 L-2 34', N, 4.8) + raya('M20 62 L25 74', N, 5.4) + raya('M18 63 L3 78', N, 5.4) +
    `<circle cx="10" cy="33" r="8.6" fill="${N}"/><circle cx="10" cy="33" r="6" fill="${P_}"/><circle cx="12.6" cy="32" r="1.5" fill="${N}"/>`,
};

function titere(b: TitereDelPlano, tr: string): string {
  const [x, y, w, h] = CAJA_DEL_TITERE;
  const id = `rc-${b.id}`;
  const figura = PROPIOS[b.id]?.(tr) ?? conTinta(dibujarGrupo(b.dibujo, b.cantidad ?? 1), tr);
  return (
    // El aerógrafo y el recorte, en un solo filtro. **La luz**: lo que la silueta tiene y su copia soplada y corrida no,
    // que es el canto de arriba a la izquierda; se sopla y se tiñe con la tinta de la región, así lo negro deja de ser
    // un plano y tiene bulto. **El recorte**: la silueta engordada dos veces, el canto en esa tinta y adentro el papel.
    `<filter id="${id}" x="-25%" y="-25%" width="150%" height="150%" color-interpolation-filters="sRGB">` +
    `<feGaussianBlur in="SourceAlpha" stdDeviation="3" result="soplada"/><feOffset in="soplada" dx="3.4" dy="4" result="corrida"/>` +
    `<feComposite in="SourceAlpha" in2="corrida" operator="out" result="filo"/><feGaussianBlur in="filo" stdDeviation="1.8" result="filoSoplado"/>` +
    `<feFlood flood-color="${tr}" flood-opacity="0.72"/><feComposite in2="filoSoplado" operator="in" result="tinta"/><feComposite in="tinta" in2="SourceAlpha" operator="in" result="luz"/>` +
    `<feMorphology in="SourceAlpha" operator="dilate" radius="5.4" result="gordo"/><feFlood flood-color="${tr}"/><feComposite in2="gordo" operator="in" result="canto"/>` +
    `<feMorphology in="SourceAlpha" operator="dilate" radius="3.2" result="medio"/><feFlood flood-color="var(--papel)"/><feComposite in2="medio" operator="in" result="papel"/>` +
    `<feMerge><feMergeNode in="canto"/><feMergeNode in="papel"/><feMergeNode in="SourceGraphic"/><feMergeNode in="luz"/></feMerge></filter>` +
    // El grano es el grueso, el del rociado: es cartulina pintada a soplete, no un ícono.
    `<g filter="url(#rociado)"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${T.negro}" fill-opacity="0"/>` +
    // El palito, de madera, que asoma por abajo.
    `<path d="M50 84 L51 ${y + h - 3}" fill="none" stroke="var(--portal-madera)" stroke-width="5" stroke-linecap="round"/>` +
    `<path d="M48.6 96 L49.4 ${y + h - 5}" fill="none" stroke="var(--portal-madera-honda)" stroke-width="1.4"/>` +
    `<g filter="url(#${id})">${figura}</g>` +
    `</g>`
  );
}

/** Dónde va la imagen de un títere en el plano: la caja de la figura de siempre, agrandada, con el margen del recorte. */
export function cajaEnElPlano(b: { tam: number }, medio: { x: number; y: number }, aumento: number): { x: number; y: number; ancho: number; alto: number } {
  const u = (b.tam * aumento * AUMENTO_DEL_PLANO) / 100;
  // El `<use>` de siempre ponía el (−10, −15) de la figura en (x − 0,6·t, y − 0,65·t), con t = 100·u.
  return { x: medio.x - 60 * u + (CAJA_DEL_TITERE[0] + 10) * u, y: medio.y - 65 * u + (CAJA_DEL_TITERE[1] + 15) * u, ancho: CAJA_DEL_TITERE[2] * u, alto: CAJA_DEL_TITERE[3] * u };
}

/** Las piezas de los títeres del plano. Necesitan el JSON (qué figura es cada una y de qué disco es su región): se lo pasa la imprenta. */
export function piezasDeLosTiteres(bestias: readonly (TitereDelPlano & { region: string })[], tintaDeRegion: (region: string) => string): Pieza[] {
  return bestias.filter((b) => LAS_DEL_PLANO.has(b.id)).map((b) => ({ nombre: `plano-titere-${b.id}`, caja: CAJA_DEL_TITERE, dibujo: titere(b, tintaDeRegion(b.region)), densidad: 2.4 }));
}

/** Las piezas del aire del plano. Las imprime `scripts/imprimir-bestiario.mjs` con las del camino. */
export const PIEZAS_DEL_PLANO: readonly Pieza[] = [
  // Es niebla: no tiene filo que cuidar. A 0,8 píxeles por unidad ocupa 2,4 MB decodificada.
  { nombre: 'plano-nubes', caja: [0, 0, 1000, 1000], dibujo: nubes(), densidad: 0.8, calidad: 60 },
  { nombre: 'plano-lechuza', caja: LECHUZA.caja, dibujo: lechuza(), densidad: 1.2 },
  // El cielo cerrado se ve medio segundo y es todo niebla: a 0,45 píxeles por unidad ocupa 0,8 MB decodificado.
  { nombre: 'plano-cierre', caja: [0, 0, 1000, 1000], dibujo: cierre(), densidad: 0.45, calidad: 55 },
  // Los hitos se imprimen finos: son para mirarlos con la lupa al máximo.
  ...HITOS.map((h): Pieza => ({ nombre: `plano-hito-${h.region}`, caja: cajaDelHito(h), dibujo: hito(h), densidad: 5 })),
];
