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
   Cinco dibujos de 44 unidades, cada uno en el borde de afuera de su porción, del lado de la ruta. En un teléfono
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
  // El templo: la puerta del fondo, prendida, con los telones recogidos.
  { region: 'el-templo', ang: 74, r: 398, dibujo: () => forma('M-7 16 L-7 -8 Q0 -17 7 -8 L7 16 Z', 'var(--entorno-templo-foco)') + forma('M-7 -10 C-16 -8 -13 10 -19 16 L-7 16 Z M7 -10 C16 -8 13 10 19 16 L7 16 Z', T.negro) + linea('M-4 18 L-9 22 M4 18 L9 22', 1.2, 'var(--entorno-templo-foco)') },
  // Los techos: el arco pintado con cal, y la pelota.
  { region: 'los-techos', ang: 291, r: 400, dibujo: () => linea('M-15 14 L-14 -10 L15 -12 L16 14', 3, PAPEL) + linea('M-15 14 L-14 -10 L15 -12 L16 14', 1) + `<circle cx="2" cy="12" r="4" fill="${T.negro}"/>` + linea('M0 10 q2 2 4 0', 0.8, PAPEL) },
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
   aullando. Los otros veintiuno salen del molde. Todos, propios o de molde, pasan por el mismo aerógrafo. */

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
  // Los hitos se imprimen finos: son para mirarlos con la lupa al máximo.
  ...HITOS.map((h): Pieza => ({ nombre: `plano-hito-${h.region}`, caja: cajaDelHito(h), dibujo: hito(h), densidad: 5 })),
];
