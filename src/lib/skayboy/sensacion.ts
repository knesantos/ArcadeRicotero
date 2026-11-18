/**
 * La sensación de Skayboy y Poligirl (ronda de pulida de los juegos, 2026-11-18): **qué se
 * siente de lo que pasó en un tic**, dicho en golpes que la isla convierte en polvo, chispas y
 * pasadas. No decide nada del juego y no toca el mundo: lo mira antes y después.
 *
 * ## Por qué vive acá y no en la isla
 *
 * Lo mismo que `escena.ts`: la isla no se carga en Node, y cada regla de esto —que caer de un
 * escalón no levante polvo, que volver a la entrada no cuente como aterrizar, que el nivel nuevo
 * arranque sin golpes heredados— tiene que poder verse en rojo. `sensacion.test.ts` la juega.
 *
 * ## Qué mira
 *
 * - **Los sucesos del mundo** (`Suceso`): el salto, el favorito, la vuelta y las puertas.
 * - **Lo que el mundo no avisa**, comparando con la foto del tic anterior: el aterrizaje (un
 *   cuerpo que venía cayendo y ahora pisa), la caja que arranca su tramo, la caja que apoya
 *   después de caer, y la palanca que cambió de lado.
 *
 * ## Las barandas (`D-32`, `UX-29 §3`, `UX-32 §2.3`)
 *
 * - **El que responde es el lugar.** El polvo sale del piso, la chispa del objeto, la viruta de
 *   la palanca. El muñeco no hace ninguna morisqueta: lo único suyo es el peso al caer
 *   (`hundimiento()`), uno o dos píxeles durante un instante.
 * - **Volver a la entrada no castiga** (`UX-29`): ni temblor ni estallido. Es `vuelta`, y la isla
 *   le pasa el rodillo al área —la pasada de imprenta de `UX-29 §3`, fila 2, que estaba escrita
 *   desde el 2026-09-23 y nunca se había construido—.
 * - **Nada espera a nada** (`D-32` límite 3): un golpe se dibuja encima de un juego que sigue
 *   respondiendo desde el cuadro cero.
 */

import { CUERPO_ALTO, CUERPO_ANCHO, PERSONAJES, TILE, type Mundo, type Suceso } from './mundo.ts';
import { celdasDeTipo, type IdPersonaje } from './niveles.ts';

/** Lo que se siente, en píxeles nativos del área. `x`, `y` son el punto de donde sale. */
export type Golpe =
  /** Los pies tocan el piso después de una caída de verdad. `fuerte` es de más alto que un salto. */
  | { readonly tipo: 'aterrizaje'; readonly x: number; readonly y: number; readonly fuerte: boolean }
  /** Los pies dejan el piso en un salto. */
  | { readonly tipo: 'despegue'; readonly x: number; readonly y: number }
  /** Un favorito juntado: el centro de su celda. */
  | { readonly tipo: 'favorito'; readonly x: number; readonly y: number; readonly de: IdPersonaje }
  /** Una caja arranca su tramo: la esquina de abajo que queda atrás. `lado` es hacia dónde va. */
  | { readonly tipo: 'empuje'; readonly x: number; readonly y: number; readonly lado: -1 | 1 }
  /** Una caja apoya después de caer: el medio de su base. */
  | { readonly tipo: 'cajaApoya'; readonly x: number; readonly y: number }
  /** Una palanca cambió de lado: la punta. `lado` es para dónde quedó. */
  | { readonly tipo: 'palanca'; readonly x: number; readonly y: number; readonly lado: -1 | 1 }
  /** Se ganó: uno por puerta, en el dintel que se acaba de abrir. */
  | { readonly tipo: 'puerta'; readonly x: number; readonly y: number; readonly de: IdPersonaje }
  /** Alguien volvió a la entrada: la pasada del área (`UX-29 §3`). No lleva lugar: es de la sala. */
  | { readonly tipo: 'vuelta' };

export type TipoDeGolpe = Golpe['tipo'];

/**
 * **Desde qué velocidad de caída el piso contesta**, en px/s. Bajar un escalón de un tile deja
 * al cuerpo en unos 150; un salto parado aterriza a 270 (`IMPULSO_SALTO`). Por debajo de esto no
 * hay polvo: un piso que contesta a cada pasito es ruido.
 */
export const CAIDA_QUE_SE_SIENTE = 200;

/**
 * **Desde cuál es un golpe fuerte.** Un salto parado vuelve con la velocidad con que salió (270);
 * para pasar de 300 hay que caer de más alto que eso. El tope es `CAIDA_MAXIMA` (320).
 */
export const CAIDA_FUERTE = 300;

/** Cuánto dura el peso de un aterrizaje, en segundos del reloj de la partida. */
export const PESO_SEG = 0.1;
/** En un golpe fuerte, el primer tramo se hunde dos píxeles en vez de uno. */
export const PESO_FUERTE_SEG = 0.05;

interface FotoDelCuerpo {
  x: number;
  y: number;
  vy: number;
  enSuelo: boolean;
}

interface FotoDeLaCaja {
  estado: 'quieta' | 'tramo' | 'cae';
}

/** Lo que la sensación recuerda del tic anterior. Se arma sola con el primer mundo que ve. */
export interface Memoria {
  /** De qué mundo es la foto: con otro mundo —el nivel que sigue—, se empieza de cero y sin golpes. */
  mundo: Mundo | null;
  cuerpos: Record<IdPersonaje, FotoDelCuerpo>;
  cajas: FotoDeLaCaja[];
  palancas: boolean[];
  juntados: Set<string>;
  /** Cuándo aterrizó cada uno por última vez, con el reloj de la partida, y si fue fuerte. */
  peso: Record<IdPersonaje, { desde: number; fuerte: boolean } | null>;
}

export function crearMemoria(): Memoria {
  const nada = (): FotoDelCuerpo => ({ x: 0, y: 0, vy: 0, enSuelo: true });
  return {
    mundo: null,
    cuerpos: { skayboy: nada(), poligirl: nada() },
    cajas: [],
    palancas: [],
    juntados: new Set(),
    peso: { skayboy: null, poligirl: null },
  };
}

function fotografiar(memoria: Memoria, mundo: Mundo): void {
  memoria.mundo = mundo;
  for (const id of PERSONAJES) {
    const c = mundo.cuerpos[id];
    const f = memoria.cuerpos[id];
    f.x = c.x;
    f.y = c.y;
    f.vy = c.vy;
    f.enSuelo = c.enSuelo;
  }
  memoria.cajas = mundo.cajas.map((k) => ({ estado: k.estado }));
  memoria.palancas = mundo.palancas.map((p) => p.activa);
  memoria.juntados = new Set(mundo.juntados);
}

/** El medio de los pies de un cuerpo, en enteros. */
function pies(c: { readonly x: number; readonly y: number }): { x: number; y: number } {
  return { x: Math.round(c.x + CUERPO_ANCHO / 2), y: Math.round(c.y + CUERPO_ALTO) };
}

/**
 * **Lo que se sintió en este tic.** La isla la llama después de cada avance del mundo, con los
 * sucesos que ese avance devolvió, y dibuja lo que vuelve. Actualiza la memoria.
 *
 * Con un mundo que no es el de la foto —se cambió de nivel, se repitió— no devuelve nada: el
 * nivel nuevo no hereda el polvo del anterior, y un cuerpo que "aparece" en su entrada no aterrizó.
 */
export function sentir(memoria: Memoria, mundo: Mundo, sucesos: readonly Suceso[]): Golpe[] {
  if (memoria.mundo !== mundo) {
    fotografiar(memoria, mundo);
    memoria.peso.skayboy = null;
    memoria.peso.poligirl = null;
    return [];
  }
  const golpes: Golpe[] = [];
  const volvieron = new Set<IdPersonaje>();
  for (const s of sucesos) if (s.tipo === 'vuelta') volvieron.add(s.quien);
  // Una sola pasada por tic, aunque vuelvan los dos en el mismo cuadro.
  if (volvieron.size > 0) golpes.push({ tipo: 'vuelta' });

  for (const s of sucesos) {
    if (s.tipo === 'salto') {
      // De donde salió: la foto de antes, que todavía tenía los pies en el piso.
      golpes.push({ tipo: 'despegue', ...pies(memoria.cuerpos[s.quien]) });
    } else if (s.tipo === 'puerta') {
      for (const { columna, fila } of celdasDeTipo(mundo.banco, mundo.nivel, 'puerta')) {
        const de = mundo.banco.leyenda[mundo.nivel.grilla[fila]?.[columna] ?? '']?.de ?? 'skayboy';
        golpes.push({ tipo: 'puerta', x: columna * TILE + TILE / 2, y: fila * TILE + 2, de });
      }
    }
  }

  // El favorito: la celda que entró a `juntados` en este tic.
  for (const clave of mundo.juntados) {
    if (memoria.juntados.has(clave)) continue;
    const [columna = 0, fila = 0] = clave.split(',').map(Number);
    const de = sucesos.find((s): s is Extract<Suceso, { tipo: 'tesoro' }> => s.tipo === 'tesoro')?.quien ?? 'skayboy';
    golpes.push({ tipo: 'favorito', x: columna * TILE + TILE / 2, y: fila * TILE + TILE / 2, de });
  }

  for (const id of PERSONAJES) {
    const antes = memoria.cuerpos[id];
    const c = mundo.cuerpos[id];
    // El que volvió no cayó: lo devolvió el lugar (`UX-29 §3`).
    if (volvieron.has(id)) {
      memoria.peso[id] = null;
      continue;
    }
    if (!antes.enSuelo && c.enSuelo && antes.vy >= CAIDA_QUE_SE_SIENTE) {
      const fuerte = antes.vy >= CAIDA_FUERTE;
      golpes.push({ tipo: 'aterrizaje', ...pies(c), fuerte });
      memoria.peso[id] = { desde: mundo.tiempo, fuerte };
    }
  }

  mundo.cajas.forEach((k, i) => {
    const antes = memoria.cajas[i]?.estado ?? 'quieta';
    if (antes === 'quieta' && k.estado === 'tramo' && k.direccion !== 0) {
      // La esquina de abajo que queda atrás: de ahí raspa.
      const x = Math.round(k.direccion > 0 ? k.x : k.x + TILE);
      golpes.push({ tipo: 'empuje', x, y: Math.round(k.y + TILE), lado: k.direccion });
    } else if (antes === 'cae' && k.estado === 'quieta') {
      golpes.push({ tipo: 'cajaApoya', x: Math.round(k.x + TILE / 2), y: Math.round(k.y + TILE) });
    }
  });

  mundo.palancas.forEach((p, i) => {
    if (memoria.palancas[i] === p.activa) return;
    golpes.push({ tipo: 'palanca', x: p.columna * TILE + TILE / 2, y: p.fila * TILE + 4, lado: p.activa ? 1 : -1 });
  });

  fotografiar(memoria, mundo);
  return golpes;
}

/**
 * **El peso al caer**: cuántos píxeles se hunde el muñeco en este cuadro, 0, 1 o 2. Es todo el
 * aplastamiento que hay —el atlas no se escala (`ADR-08.3`)—: el dibujo baja y los pies se
 * pierden contra el piso, que se dibuja antes y es de la misma tinta, así que lo que se ve es la
 * cabeza que cede. Dura `PESO_SEG` del reloj de la partida y nada más.
 *
 * Con movimiento reducido (`reducido`), cero: el muñeco no hace nada que un dedo no haya pedido.
 */
export function hundimiento(memoria: Memoria, id: IdPersonaje, mundo: Mundo, reducido: boolean): 0 | 1 | 2 {
  const peso = memoria.peso[id];
  if (reducido || peso === null || memoria.mundo !== mundo || mundo.terminado) return 0;
  // En el aire otra vez (saltó apenas tocó), el peso ya no es de este piso.
  if (!mundo.cuerpos[id].enSuelo) return 0;
  const hace = mundo.tiempo - peso.desde;
  if (hace < 0 || hace >= PESO_SEG) return 0;
  return peso.fuerte && hace < PESO_FUERTE_SEG ? 2 : 1;
}
