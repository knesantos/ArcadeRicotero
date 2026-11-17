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

function titere(b: TitereDelPlano, tr: string): string {
  const [x, y, w, h] = CAJA_DEL_TITERE;
  const id = `rc-${b.id}`;
  return (
    // El recorte: la silueta engordada dos veces. Afuera, el canto en la tinta de la región; adentro, el papel.
    `<filter id="${id}" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">` +
    `<feMorphology in="SourceAlpha" operator="dilate" radius="5.4" result="gordo"/><feFlood flood-color="${tr}"/><feComposite in2="gordo" operator="in" result="canto"/>` +
    `<feMorphology in="SourceAlpha" operator="dilate" radius="3.2" result="medio"/><feFlood flood-color="var(--papel)"/><feComposite in2="medio" operator="in" result="papel"/>` +
    `<feMerge><feMergeNode in="canto"/><feMergeNode in="papel"/><feMergeNode in="SourceGraphic"/></feMerge></filter>` +
    `<g filter="url(#grano)"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${T.negro}" fill-opacity="0"/>` +
    // El palito, de madera, que asoma por abajo.
    `<path d="M50 84 L51 ${y + h - 3}" fill="none" stroke="var(--portal-madera)" stroke-width="5" stroke-linecap="round"/>` +
    `<path d="M48.6 96 L49.4 ${y + h - 5}" fill="none" stroke="var(--portal-madera-honda)" stroke-width="1.4"/>` +
    `<g filter="url(#${id})">${conTinta(dibujarGrupo(b.dibujo, b.cantidad ?? 1), tr)}</g>` +
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
