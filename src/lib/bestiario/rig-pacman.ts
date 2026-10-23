/**
 * Los números del pac-man (`D-73`, decimoséptima vuelta): el pasillo de puntos en la nieve de
 * Cybersiberia, los cuadros de pixel del pac-man y del fantasma, y la pose de un momento. Los lee el
 * dibujo (`arte-pacman.ts`), para la pose quieta del HTML y para el retrato, y la conducta
 * (`scripts/bestiario/pacman.ts`), que se lleva esto y nada que dibuje.
 *
 * Todo va en las coordenadas del recinto (900 × 640), sin escala: el pixel del fichín tiene su medida
 * (`CELDA`), y un pixel no se agranda ni se achica por el camino. En el camino la nieve se estira con `k`
 * y el pasillo entero se corre con su marco, así que queda del mismo largo.
 */

import { CYBER } from './rig-entornos.ts';

export type Punto = readonly [number, number];

/** Lo que mide un pixel del fichín en el recinto. */
export const CELDA = 3;

/**
 * El pasillo: la fila de puntos que ya estaba pintada en la nieve (`CYBER.puntos`), con la pastilla de
 * poder en la punta de la izquierda. El pac-man va y viene entre `desde` y `hasta`.
 */
export const PASILLO = {
  y: CYBER.puntos.y,
  desde: CYBER.puntos.desde - 18,
  hasta: CYBER.pacman.x + 12,
  /** Dónde está la pastilla de poder. */
  pastilla: CYBER.puntos.desde - 22,
  /** De dónde a dónde van los puntos, y cada cuánto. */
  puntos: { desde: CYBER.puntos.desde, hasta: CYBER.puntos.hasta, cada: 22 },
} as const;

/** El ancla del personaje: el medio del pasillo. */
export const ANCLA = Math.round((PASILLO.desde + PASILLO.hasta) / 2);

/** Las x de cada punto. */
export const PUNTOS: readonly number[] = Array.from(
  { length: Math.floor((PASILLO.puntos.hasta - PASILLO.puntos.desde) / PASILLO.puntos.cada) + 1 },
  (_, i) => PASILLO.puntos.desde + i * PASILLO.puntos.cada,
);

/* ------------------------------------------------------------------
   Los cuadros de pixel
   ------------------------------------------------------------------ */

/** Un cuadro: filas de texto, `#` es pixel prendido. El (0, 0) del cuadro es su centro. */
export type Cuadro = readonly string[];

/** El pac-man, de 13 × 13, mirando a la derecha, con la boca abierta `abre` grados para cada lado. */
export function pacman(abre: number): Cuadro {
  const n = 13;
  const c = (n - 1) / 2;
  const filas: string[] = [];
  for (let j = 0; j < n; j++) {
    let fila = '';
    for (let i = 0; i < n; i++) {
      const [dx, dy] = [i - c, j - c];
      const adentro = dx * dx + dy * dy <= 6.6 * 6.6;
      const ang = (Math.atan2(Math.abs(dy) + 0.5, dx) * 180) / Math.PI;
      // La boca: la cuña que se abre desde el medio para la derecha. El centro siempre queda.
      const boca = abre > 0 && (dx > 0 || abre > 90) && ang < abre && !(dx === 0 && dy === 0 && abre < 180);
      fila += adentro && !boca ? '#' : '.';
    }
    filas.push(fila);
  }
  return filas;
}

/** Los tres cuadros del pac-man comiendo: cerrada, a medias y abierta. */
export const BOCAS: readonly Cuadro[] = [pacman(0), pacman(28), pacman(52)];
/** Los seis cuadros de cuando se muere: la boca se abre hasta que no queda nada. */
export const MUERTE: readonly Cuadro[] = [74, 96, 118, 140, 160, 176].map((a) => pacman(a));
/** La chispa del final, cuando se muere. */
export const CHISPA: Cuadro = [
  '#...#...#',
  '.#.....#.',
  '.........',
  '...#.#...',
  '#.......#',
  '...#.#...',
  '.........',
  '.#.....#.',
  '#...#...#',
];

/** El fantasma, de 14 × 14, con las dos faldas que se turnan. Las filas de arriba son las mismas. */
const CABEZA_FANTASMA = [
  '.....####.....',
  '...########...',
  '..##########..',
  '.############.',
  '.############.',
  '.############.',
  '##############',
  '##############',
  '##############',
  '##############',
  '##############',
  '##############',
];
export const FANTASMA: readonly [Cuadro, Cuadro] = [
  [...CABEZA_FANTASMA, '##.###..###.##', '#...##..##...#'],
  [...CABEZA_FANTASMA, '###.##..##.###', '.#...#..#...#.'],
];
/** Los blancos de los ojos del fantasma, mirando de costado. */
export const OJOS: Cuadro = [
  '..............',
  '..............',
  '..............',
  '..##....##....',
  '.####..####...',
  '.####..####...',
  '.####..####...',
  '..##....##....',
];
/** Las pupilas, en el medio de cada blanco: la conducta las corre para el lado que mira. */
export const PUPILAS: Cuadro = [
  '..............',
  '..............',
  '..............',
  '..............',
  '..............',
  '..##....##....',
  '..##....##....',
];
/** La cara del fantasma asustado: dos ojitos y la boca en zigzag. */
export const CARA_ASUSTADA: Cuadro = [
  '..............',
  '..............',
  '..............',
  '..............',
  '....##..##....',
  '....##..##....',
  '..............',
  '..............',
  '.##..##..##.#.',
  '#..##..##..#..',
];
/** La pastilla de poder, y un punto. */
export const PASTILLA: Cuadro = ['.####.', '######', '######', '######', '######', '.####.'];
export const PUNTO: Cuadro = ['##', '##'];
/** El 200 que sale cuando se come al fantasma, en la letra de tres por cinco del fichín. */
export const DOSCIENTOS: Cuadro = [
  '###.###.###',
  '..#.#.#.#.#',
  '###.#.#.#.#',
  '#...#.#.#.#',
  '###.###.###',
];

/** El ancho y el alto de un cuadro, en celdas. */
export const medida = (c: Cuadro): readonly [number, number] => [Math.max(...c.map((f) => f.length)), c.length];

/* ------------------------------------------------------------------
   El momento: lo que la conducta decide en cada cuadro
   ------------------------------------------------------------------ */

export type ModoFantasma = 'fuera' | 'persigue' | 'asustado' | 'titila' | 'ojos';

export interface Momento {
  /** El pac-man: dónde está en el pasillo, para dónde mira, qué boca tiene y, si se muere, en qué cuadro va (1 a 6, y 7 la chispa). */
  pac: { x: number; dir: 1 | -1; boca: 0 | 1 | 2; muere: number; visible: boolean };
  /** El fantasma: dónde está, para dónde mira, qué hace y cuál de las dos faldas tiene. */
  fantasma: { x: number; dir: 1 | -1; modo: ModoFantasma; falda: 0 | 1 };
  /** Qué puntos quedan sin comer, y si la pastilla está (y prendida: titila). */
  puntos: readonly boolean[];
  pastilla: boolean;
  /** El 200, donde se comió al fantasma, y cuánto se ve. */
  puntaje: { x: number; o: number };
}

/** La pose quieta, la del HTML: el pac-man en la punta de la derecha, a punto de empezar la fila, y sin fantasma. */
export const QUIETA: Momento = {
  pac: { x: CYBER.pacman.x, dir: -1, boca: 1, muere: 0, visible: true },
  fantasma: { x: PASILLO.desde - 40, dir: 1, modo: 'fuera', falda: 0 },
  puntos: PUNTOS.map(() => true),
  pastilla: true,
  puntaje: { x: 0, o: 0 },
};

/** *"Todo el hambre del nuevo pac-man"*: con la boca abierta, persiguiendo al fantasma asustado. Es la del toque quieto y la del retrato. */
export const HAMBRE: Momento = {
  ...QUIETA,
  pac: { x: 420, dir: 1, boca: 2, muere: 0, visible: true },
  fantasma: { x: 486, dir: 1, modo: 'asustado', falda: 0 },
  puntos: PUNTOS.map((x) => x < 410 || x > 520),
  pastilla: false,
};

/* ------------------------------------------------------------------
   La pose: del momento a cada pieza
   ------------------------------------------------------------------ */

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();
const vis = (si: boolean): string => (si ? '1' : '0');

/**
 * Las transformaciones y las opacidades de cada parte para un momento: las escribe el dibujo en el
 * HTML (la pose quieta) y la isla en cada cuadro, con la misma cuenta. El pixel va siempre en la grilla
 * del recinto: la x se redondea a la celda, para que no tiemble entre dos.
 */
export function marcas(m: Momento): { transform: Record<string, string>; opacity: Record<string, string> } {
  const enGrilla = (x: number): number => Math.round(x / CELDA) * CELDA;
  const transform: Record<string, string> = {
    pacman: `translate(${n2(enGrilla(m.pac.x))} ${PASILLO.y}) scale(${m.pac.dir} 1)`,
    fantasma: `translate(${n2(enGrilla(m.fantasma.x))} ${PASILLO.y - 2})`,
    pupilas: `translate(${m.fantasma.dir * CELDA} 0)`,
    puntaje: `translate(${n2(enGrilla(m.puntaje.x))} ${PASILLO.y - 30})`,
  };
  const f = m.fantasma;
  const muere = m.pac.muere;
  const opacity: Record<string, string> = {
    pacman: vis(m.pac.visible),
    'boca-0': vis(!muere && m.pac.boca === 0),
    'boca-1': vis(!muere && m.pac.boca === 1),
    'boca-2': vis(!muere && m.pac.boca === 2),
    chispa: vis(muere === 7),
    fantasma: vis(f.modo !== 'fuera'),
    'fantasma-rojo-0': vis(f.modo === 'persigue' && f.falda === 0),
    'fantasma-rojo-1': vis(f.modo === 'persigue' && f.falda === 1),
    'fantasma-azul-0': vis(f.modo === 'asustado' && f.falda === 0),
    'fantasma-azul-1': vis(f.modo === 'asustado' && f.falda === 1),
    'fantasma-blanco-0': vis(f.modo === 'titila' && f.falda === 0),
    'fantasma-blanco-1': vis(f.modo === 'titila' && f.falda === 1),
    ojos: vis(f.modo === 'persigue' || f.modo === 'ojos'),
    'halo-fantasma': f.modo === 'persigue' ? '0.8' : f.modo === 'ojos' ? '0' : '0.55',
    pastilla: vis(m.pastilla),
    puntaje: n2(m.puntaje.o),
  };
  for (let i = 1; i <= 6; i++) opacity[`muere-${i}`] = vis(muere === i);
  m.puntos.forEach((si, i) => (opacity[`punto-${i + 1}`] = vis(si)));
  return { transform, opacity };
}

/** Dónde dice su verso: arriba del pasillo, donde esté el pac-man, debajo de la tele. */
export const VERSO: Punto = [0, PASILLO.y - 52];
