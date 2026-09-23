/**
 * El mundo de Skayboy y Poligirl, sin motor: la sala, los dos cuerpos y la regla de la
 * puerta doble. Todo lo que el juego **decide** vive acá; lo que el motor hace es dibujarlo.
 *
 * ## Por qué existe, si el motor ya trae física
 *
 * Kaplay trae cuerpos, gravedad y colisión, y no se usan. Tres razones, y la tercera es la
 * que pesa:
 *
 * 1. **No se tree-shakea** (`T-226`): usar menos motor no baja un byte, así que apoyarse en
 *    su física no ahorra nada y ata la regla del juego a una versión que `ADR-08` ya dice
 *    que se va a cambiar ("actualizar de versión es una decisión").
 * 2. **La licencia de 3001.x no es MIT plana** (`RES-70`). Que la regla del juego no
 *    dependa del motor deja la salida a LittleJS en una tarde de dibujo, no en una
 *    reescritura.
 * 3. **Se puede probar con `node --test`.** Las reglas que sostienen `D-40`, `D-43` y
 *    `UX-29` —el que espera está a salvo, el fracaso devuelve a la entrada y no toca al
 *    otro, se gana con los dos en su puerta— son exactamente las que no se pueden dejar a
 *    "se ve bien en el teléfono". Acá cada una tiene su caso en rojo (`mundo.test.ts`).
 *
 * ## Quién lo consume, para que nadie lo escriba dos veces
 *
 * Nace en `T-254` (ciclo 15). **`T-248` —la puerta doble y el fin del nivel 1— consume
 * `paso()` y no reescribe la condición de victoria**: sus tres casos declarados viven en
 * `niveles.test.ts` y corren contra este módulo. **`T-247` —la isla— lo llama una vez por
 * cuadro** y dibuja lo que queda en `cuerpos`; los sucesos que devuelve son la única vía
 * por la que la isla se entera de algo. Ninguna de las dos decide física por su cuenta.
 *
 * ## Lo que este módulo no importa (`CTR-16.8`)
 *
 * Nada de `node:*`, nada del motor, nada del DOM, ningún reloj. Lo lee la isla en el
 * navegador y la prueba en Node. El tiempo entra por parámetro (`dt`, en segundos) y el
 * mando también: **el mundo no sabe qué es un dedo**, sabe qué teclas están apretadas.
 *
 * ## Unidades
 *
 * Píxeles **nativos** (`UX-27 §2`: el área es 240 × 144, tiles de 16) y segundos. La escala
 * ×2 del teléfono en horizontal es asunto del canvas (`ADR-08.3`), no de la física: un
 * salto mide lo mismo en vertical que en horizontal, que es lo que `UX-28 §4` promete
 * ("nada más aparece ni desaparece al girar").
 *
 * ## Las constantes son de partida, no de diseño
 *
 * Ningún documento fija la gravedad ni la velocidad, y no es un olvido: se fijan jugando
 * (`T-249`). Lo que sí está fijado, y la prueba lo hace cumplir, es **el alcance que un
 * nivel puede pedir**: dos tiles de alto y tres de hueco. Si alguien afina los números, que
 * afine sin romper eso, porque los niveles se dibujan contra el alcance, no contra la
 * gravedad.
 */

import {
  devuelveA,
  posicionDe,
  terrenoEn,
  type Banco,
  type IdPersonaje,
  type Nivel,
  type Terreno,
} from './niveles.ts';

/** Los dos, en el orden en que se reparten las columnas de mando (`UX-28 §2`). */
export const PERSONAJES: readonly IdPersonaje[] = ['skayboy', 'poligirl'];

/** El tile, en píxeles nativos (`CTR-16.2`). */
export const TILE = 16;

/**
 * La caja de colisión: **10 × 20** nativos, dentro de la celda de 16 × 24 (`UX-27 §2`,
 * cerrado en `REV-14`). Más angosta que el tile a propósito: entra por un hueco de un
 * tile sin rozar, que es "nada de precisión fina" dicho en píxeles.
 */
export const CAJA_ANCHO = 10;
export const CAJA_ALTO = 20;

/** px/s². Provisional (`T-249`). */
export const GRAVEDAD = 900;
/** px/s hacia arriba al despegar. Con `GRAVEDAD` da ~40 px de alto: dos tiles y medio. */
export const IMPULSO_SALTO = 270;
/** px/s al correr. Provisional (`T-249`). */
export const VELOCIDAD = 88;
/** px/s. El techo de la caída, para que nada atraviese un piso de un tile. */
export const CAIDA_MAXIMA = 320;

/**
 * Lo que el juego perdona del salto, porque `UX-28 §2.1` agrandó la tecla y eso cubre dónde
 * cae el dedo, no cuándo. Son las dos ventanas clásicas del género:
 *
 * - **Tarde:** se puede saltar un rato después de dejar el borde.
 * - **Temprano:** un toque un poco antes de tocar el piso se guarda y salta al aterrizar.
 */
export const PERDON_TARDE_SEG = 0.1;
export const PERDON_TEMPRANO_SEG = 0.12;

/** El sub-paso de la integración. A 1/120 nada cruza medio tile en un paso. */
export const SUBPASO_SEG = 1 / 120;
/**
 * El paso más largo que se acepta. Si la pestaña se escondió y volvió, el mundo **no**
 * simula los segundos perdidos: la isla pausa, y lo que llegue igual se topea acá. Un
 * cuerpo que salta tres tiles porque el teléfono se trabó es un fracaso que nadie causó.
 */
export const PASO_MAXIMO_SEG = 1 / 20;

/** Lo que el nivel le puede pedir a un salto, en tiles. Lo hace cumplir `mundo.test.ts`. */
export const ALCANCE_ALTO_TILES = 2;
export const ALCANCE_HUECO_TILES = 3;

/** Las tres teclas de una columna (`UX-28 §2.1`). Nada más: ni deslizar ni mantener. */
export interface Mando {
  readonly izquierda: boolean;
  readonly derecha: boolean;
  readonly saltar: boolean;
}

export const QUIETO: Mando = { izquierda: false, derecha: false, saltar: false };

/** Las dos columnas. La que no se toca llega como `QUIETO` (`D-43`: no hay botón de cambio). */
export type Mandos = Readonly<Record<IdPersonaje, Mando>>;

export interface Cuerpo {
  readonly id: IdPersonaje;
  /** Esquina de arriba a la izquierda de la caja, en píxeles nativos. */
  x: number;
  y: number;
  vx: number;
  vy: number;
  enSuelo: boolean;
  /** Hacia dónde mira: la pose de perfil necesita saberlo (`UX-28 §3`). */
  mira: -1 | 1;
  /**
   * Si tiene un dedo encima. Decide la pose: de perfil si sí, de frente si no
   * (`UX-28 §3`). No decide nada más — el que espera no vale menos que el otro.
   */
  conDedo: boolean;
  /** Si está parado en su puerta. */
  enPuerta: boolean;
  /** Estado interno de las dos ventanas de perdón y del flanco de la tecla. */
  desdeElSuelo: number;
  saltoGuardado: number;
  saltoApretado: boolean;
  yaSalto: boolean;
}

/**
 * Lo que pasó en un paso, para que la isla haga lo suyo: tres suenan (`CTR-17`, los mismos
 * tres nombres que `sonido.ts`) y uno solo se ve.
 *
 * **`vuelta` no suena** (`UX-29 §5`, `CTR-17.6`). Lo que hace la isla con ella es la pasada
 * de imprenta sobre el área (`UX-29 §3`) y el aviso para el lector de pantalla, que nombra
 * el lugar y no a la persona.
 */
export type Suceso =
  | { readonly tipo: 'salto'; readonly quien: IdPersonaje }
  | { readonly tipo: 'tesoro'; readonly quien: IdPersonaje }
  | { readonly tipo: 'vuelta'; readonly quien: IdPersonaje }
  | { readonly tipo: 'puerta' };

export interface Mundo {
  readonly banco: Banco;
  readonly nivel: Nivel;
  readonly cuerpos: Readonly<Record<IdPersonaje, Cuerpo>>;
  /** Tesoros ya juntados, como `"columna,fila"`. No vuelven al fallar: lo conseguido se queda. */
  readonly juntados: Set<string>;
  /**
   * El reloj de la partida, en segundos. **Es lo único que cuesta fallar** (`UX-29 §4`):
   * no hay contador y no hay pantallas. Corre igual para los dos y se congela al ganar.
   */
  tiempo: number;
  terminado: boolean;
}

/** Dónde aparece la caja cuando el personaje está en su entrada: parada en el piso del tile, centrada. */
export function puntoDeEntrada(banco: Banco, nivel: Nivel, id: IdPersonaje): { x: number; y: number } {
  const entrada = posicionDe(banco, nivel, 'entrada', id);
  if (entrada === undefined) {
    // `CTR-16.5` regla 1 lo hace imposible en un banco sano; si llega acá, el dato no pasó
    // por `problemasDelBanco()` y el juego no tiene dónde poner a nadie.
    throw new Error(`${nivel.id}: no hay entrada para ${id} (CTR-16.5 regla 1)`);
  }
  return {
    x: entrada.columna * TILE + (TILE - CAJA_ANCHO) / 2,
    y: (entrada.fila + 1) * TILE - CAJA_ALTO,
  };
}

function cuerpoNuevo(banco: Banco, nivel: Nivel, id: IdPersonaje): Cuerpo {
  const { x, y } = puntoDeEntrada(banco, nivel, id);
  return {
    id,
    x,
    y,
    vx: 0,
    vy: 0,
    enSuelo: true,
    mira: 1,
    conDedo: false,
    enPuerta: false,
    desdeElSuelo: 0,
    saltoGuardado: 0,
    saltoApretado: false,
    yaSalto: false,
  };
}

export function crearMundo(banco: Banco, nivel: Nivel): Mundo {
  return {
    banco,
    nivel,
    cuerpos: {
      skayboy: cuerpoNuevo(banco, nivel, 'skayboy'),
      poligirl: cuerpoNuevo(banco, nivel, 'poligirl'),
    },
    juntados: new Set(),
    tiempo: 0,
    terminado: false,
  };
}

function terreno(mundo: Mundo, columna: number, fila: number): Terreno | undefined {
  return terrenoEn(mundo.banco, mundo.nivel, { columna, fila });
}

/**
 * Si esa celda frena un cuerpo. **Afuera de la grilla es pared** (`UX-29 §7.1`: no hay
 * vacío, el nivel es una sala cerrada), así que aunque un nivel se dibuje sin borde nadie
 * sale del mundo.
 *
 * `caja` frena como un sólido quieto **por ahora**: empujarla llega con el escalón que la
 * introduce (`BR-25`), y hasta entonces una caja que se atraviesa sería peor que una que no
 * se mueve.
 */
function frena(mundo: Mundo, columna: number, fila: number): boolean {
  const t = terreno(mundo, columna, fila);
  if (t === undefined) return true;
  return t.tipo === 'solido' || t.tipo === 'caja';
}

/** Las celdas que toca la caja, con el borde derecho y el de abajo excluidos. */
function celdasDe(c: Cuerpo): { columna: number; fila: number }[] {
  const celdas: { columna: number; fila: number }[] = [];
  const c0 = Math.floor(c.x / TILE);
  const c1 = Math.floor((c.x + CAJA_ANCHO - 0.001) / TILE);
  const f0 = Math.floor(c.y / TILE);
  const f1 = Math.floor((c.y + CAJA_ALTO - 0.001) / TILE);
  for (let fila = f0; fila <= f1; fila++) {
    for (let columna = c0; columna <= c1; columna++) celdas.push({ columna, fila });
  }
  return celdas;
}

function moverEnX(mundo: Mundo, c: Cuerpo, dx: number): void {
  if (dx === 0) return;
  let x = c.x + dx;
  const f0 = Math.floor(c.y / TILE);
  const f1 = Math.floor((c.y + CAJA_ALTO - 0.001) / TILE);
  const columna = dx > 0 ? Math.floor((x + CAJA_ANCHO - 0.001) / TILE) : Math.floor(x / TILE);
  for (let fila = f0; fila <= f1; fila++) {
    if (frena(mundo, columna, fila)) {
      x = dx > 0 ? columna * TILE - CAJA_ANCHO : (columna + 1) * TILE;
      c.vx = 0;
      break;
    }
  }
  c.x = x;
}

function moverEnY(mundo: Mundo, c: Cuerpo, dy: number): void {
  if (dy === 0) return;
  let y = c.y + dy;
  const c0 = Math.floor(c.x / TILE);
  const c1 = Math.floor((c.x + CAJA_ANCHO - 0.001) / TILE);
  const fila = dy > 0 ? Math.floor((y + CAJA_ALTO - 0.001) / TILE) : Math.floor(y / TILE);
  for (let columna = c0; columna <= c1; columna++) {
    if (frena(mundo, columna, fila)) {
      y = dy > 0 ? fila * TILE - CAJA_ALTO : (fila + 1) * TILE;
      c.vy = 0;
      break;
    }
  }
  c.y = y;
}

/** Si hay piso justo abajo de los pies. */
function pisa(mundo: Mundo, c: Cuerpo): boolean {
  const fila = Math.floor((c.y + CAJA_ALTO) / TILE);
  const c0 = Math.floor(c.x / TILE);
  const c1 = Math.floor((c.x + CAJA_ANCHO - 0.001) / TILE);
  if ((c.y + CAJA_ALTO) % TILE !== 0) return false;
  for (let columna = c0; columna <= c1; columna++) {
    if (frena(mundo, columna, fila)) return true;
  }
  return false;
}

/**
 * Si el cuerpo está parado en su puerta: los pies en la celda de la puerta y en el piso.
 * Se mide con el punto del medio de los pies, no con la caja entera — pararse "casi
 * adentro" cuenta, que es otra vez "nada de precisión fina".
 */
function estaEnSuPuerta(mundo: Mundo, c: Cuerpo): boolean {
  if (!c.enSuelo) return false;
  const columna = Math.floor((c.x + CAJA_ANCHO / 2) / TILE);
  const fila = Math.floor((c.y + CAJA_ALTO - 1) / TILE);
  const t = terreno(mundo, columna, fila);
  return t !== undefined && t.tipo === 'puerta' && t.de === c.id;
}

/**
 * Devuelve el cuerpo a su entrada (`UX-29 §3`): **de una, sin animación propia y sin
 * bloquear el mando** — el dedo responde desde el cuadro cero. El otro no se entera
 * (`D-38` baranda 3), y los tesoros juntados se quedan juntados.
 */
function devolver(mundo: Mundo, c: Cuerpo): void {
  const { x, y } = puntoDeEntrada(mundo.banco, mundo.nivel, c.id);
  c.x = x;
  c.y = y;
  c.vx = 0;
  c.vy = 0;
  c.enSuelo = true;
  c.enPuerta = false;
  c.desdeElSuelo = 0;
  c.saltoGuardado = 0;
  c.yaSalto = false;
}

function subpaso(mundo: Mundo, c: Cuerpo, mando: Mando, dt: number, sucesos: Suceso[]): void {
  // Correr: se sostiene y perdona. Las dos a la vez se anulan, que es lo que un pulgar que
  // se apoya entre las dos teclas espera que pase.
  const direccion = (mando.derecha ? 1 : 0) - (mando.izquierda ? 1 : 0);
  c.vx = direccion * VELOCIDAD;
  if (direccion !== 0) c.mira = direccion > 0 ? 1 : -1;

  // Saltar: se toca. El flanco guarda el pedido; el pedido vive `PERDON_TEMPRANO_SEG`.
  if (mando.saltar && !c.saltoApretado) c.saltoGuardado = PERDON_TEMPRANO_SEG;
  c.saltoApretado = mando.saltar;

  if (c.enSuelo) {
    c.desdeElSuelo = 0;
    c.yaSalto = false;
  } else {
    c.desdeElSuelo += dt;
  }

  if (c.saltoGuardado > 0 && !c.yaSalto && c.desdeElSuelo <= PERDON_TARDE_SEG) {
    c.vy = -IMPULSO_SALTO;
    c.enSuelo = false;
    c.yaSalto = true;
    c.saltoGuardado = 0;
    sucesos.push({ tipo: 'salto', quien: c.id });
  }
  c.saltoGuardado = Math.max(0, c.saltoGuardado - dt);

  c.vy = Math.min(c.vy + GRAVEDAD * dt, CAIDA_MAXIMA);
  moverEnX(mundo, c, c.vx * dt);
  moverEnY(mundo, c, c.vy * dt);
  c.enSuelo = c.vy >= 0 && pisa(mundo, c);

  for (const { columna, fila } of celdasDe(c)) {
    const t = terreno(mundo, columna, fila);
    if (devuelveA(t, c.id)) {
      devolver(mundo, c);
      sucesos.push({ tipo: 'vuelta', quien: c.id });
      return;
    }
    if (t !== undefined && t.tipo === 'tesoro' && (t.para ?? []).includes(c.id)) {
      const clave = `${columna},${fila}`;
      if (!mundo.juntados.has(clave)) {
        mundo.juntados.add(clave);
        sucesos.push({ tipo: 'tesoro', quien: c.id });
      }
    }
  }
}

/**
 * Avanza el mundo `dt` segundos con esos mandos, y devuelve lo que pasó.
 *
 * **Se gana con los dos parados en su puerta al mismo tiempo** (`CTR-16.5` regla 2), y la
 * regla no se parametriza por nivel. El que llegó primero espera sin que le cueste nada más
 * que el reloj, que corre igual para los dos; y como el que no tiene dedo encima no se
 * mueve, esperar en la puerta es gratis y seguro (`D-40`, `UX-28 §3`).
 */
export function paso(mundo: Mundo, mandos: Mandos, dt: number): readonly Suceso[] {
  if (mundo.terminado || !(dt > 0)) return [];
  const total = Math.min(dt, PASO_MAXIMO_SEG);
  const n = Math.max(1, Math.ceil(total / SUBPASO_SEG - 1e-9));
  const h = total / n;
  const sucesos: Suceso[] = [];

  for (const id of PERSONAJES) {
    const m = mandos[id];
    mundo.cuerpos[id].conDedo = m.izquierda || m.derecha || m.saltar;
  }

  for (let i = 0; i < n; i++) {
    for (const id of PERSONAJES) subpaso(mundo, mundo.cuerpos[id], mandos[id], h, sucesos);
    mundo.tiempo += h;
    for (const id of PERSONAJES) {
      const c = mundo.cuerpos[id];
      c.enPuerta = estaEnSuPuerta(mundo, c);
    }
    if (PERSONAJES.every((id) => mundo.cuerpos[id].enPuerta)) {
      mundo.terminado = true;
      sucesos.push({ tipo: 'puerta' });
      break;
    }
  }
  return sucesos;
}

/**
 * La pose que dibuja la isla (`UX-28 §3`): **de perfil si tiene un dedo encima, de frente
 * si no.** Son dos formas y ninguna es un color. No hay pose de caída propia —la invertida
 * de la hoja no entra (`UX-29 §6`)— ni de espera que se duerma.
 */
export type Pose = 'frente' | 'perfil-quieto' | 'perfil-corre' | 'perfil-aire';

export function poseDe(c: Cuerpo): Pose {
  if (!c.conDedo) return 'frente';
  if (!c.enSuelo) return 'perfil-aire';
  return c.vx !== 0 ? 'perfil-corre' : 'perfil-quieto';
}
