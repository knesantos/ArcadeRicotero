/**
 * La tarjeta que se lleva el jugador cuando comparte una vuelta. **La usan los dos
 * juegos de sacar temas**: "Adiviná el tema" (`US-02`) y "Sacalo por la letra" (`US-07`).
 *
 * ## Qué es y por qué existe
 *
 * Hasta hoy compartir era una línea de texto y una dirección: *"160 de 400 — https://…"*.
 * Un número que nadie puede leer sin abrir el juego. El pedido del usuario (2026-08-27)
 * fue explícito: **"más que el puntaje es importante y divertido saber en cuánto tiempo y
 * qué temas adivinó"**. Eso no entra en una línea de texto: es una lista, y una lista se
 * comparte como imagen o no se comparte.
 *
 * Así que la vuelta sale en dos piezas que van juntas y dicen lo mismo:
 *
 * - **La dirección**, que ya existía (`armarLink`, `ADR-02`): es el molinete abierto. El
 *   que la recibe toca y juega, sin cuenta y sin bajar nada.
 * - **La tarjeta**, que es esto: la lista de los temas, con cuánto audio le hizo falta a
 *   cada uno y cuánto tardó, y el tiempo total abajo de todo.
 *
 * ## Este archivo no dibuja: planifica
 *
 * No hay un solo `ctx.` acá adentro. Este módulo calcula **dónde va cada cosa** y
 * devuelve una lista de bloques con su `y` y su alto; la isla los pinta. La separación no
 * es prolijidad: un canvas no existe en Node, así que todo lo que viva del lado del
 * dibujo es código que **ningún test puede mirar**. Del lado de acá, en cambio, se puede
 * probar que la última fila no se cae de la tarjeta y que dos bloques no se pisan — que
 * es exactamente lo que se rompe cuando alguien agrega un renglón.
 *
 * Es el mismo reparto que ya usa `correccion/armar.ts`, y por el mismo motivo.
 *
 * ## Las medidas
 *
 * **1080 × 1350**, el vertical de celular. Lo eligió el usuario sobre el apaisado de
 * 1200 × 630: el apaisado es el formato de la previsualización de un enlace —y para eso
 * el sitio ya tiene `public/tarjeta.png`, que no cambia—, pero lo que se manda por
 * teléfono se mira en vertical, y en vertical entran las filas del setlist enteras en vez
 * de apretadas en dos columnas.
 *
 * ## Una sola tarjeta para dos juegos, y qué cambia entre ellas
 *
 * Nació para `US-02` y en el mismo ciclo la pidió `US-07`. En vez de un segundo módulo
 * casi igual, este quedó **sin saber de qué juego es**: recibe el nombre del juego, el
 * token que lo viste, y un número grande con su rótulo. Lo que cambia entre los dos no es
 * la maqueta, es **qué se cuenta**:
 *
 * - En el de audio el número grande es **el tiempo**, porque escuchar una décima de
 *   segundo y decidir es una carrera.
 * - En el de la letra es **cuántos versos gastaste**, porque leer ocho versos tarda lo que
 *   tarde cada uno: cronometrar ahí castigaría al lector lento sin medir nada del juego.
 *
 * Por eso el campo se llama `hero` y no `tiempo`. Un módulo que hablara de milisegundos
 * obligaría al juego de la letra a inventarse un reloj que no le sirve.
 *
 * ## El setlist reparte una banda, no apila alturas
 *
 * Es la decisión que ordena todo el módulo, y salió de un test que falló: el título más
 * largo del cancionero —*"Las increíbles andanzas del Capitán Buscapina en
 * Cybersiberia"*, 61 caracteres— **no entra en un renglón a ningún cuerpo legible**.
 * Necesita dos, y un renglón de dos líneas es más alto que uno de una.
 *
 * Con alturas apiladas, cuatro títulos largos desbordaban la tarjeta por 60 px — sin
 * error, sin aviso: salía la imagen con el pie cortado y se compartía igual. Así que las
 * filas no declaran su alto: **se reparten en partes iguales la banda que queda libre
 * entre el encabezado y el pie**. La tarjeta no puede desbordar porque el espacio se
 * decide antes de saber qué dice adentro, y de paso las rayas del setlist quedan
 * parejas, que es como se ve una lista de temas escrita a mano.
 *
 * ## Lo que la tarjeta NO hace
 *
 * No lleva ningún dato de la persona: ni nombre, ni aparato, ni de dónde entró. Lo mismo
 * que `armar.ts` para el botón de corrección, y por el mismo motivo escrito allá — lo que
 * no se junta no se puede filtrar. La tarjeta dice qué temas salieron y cuánto tardaron,
 * y se calla.
 */

/** El lienzo, en píxeles. Vertical de celular. */
export const LIENZO = { ancho: 1080, alto: 1350 } as const;

/** El aire de los cuatro costados. Generoso a propósito: la tarjeta se mira chiquita. */
export const MARGEN = 88;

/** El ancho útil, que es lo que tiene que respetar todo lo que se escriba. */
export const ANCHO_UTIL = LIENZO.ancho - MARGEN * 2;

/**
 * La franja del pie, que ancla la composición y trae el rojo de Oktubre.
 *
 * Es el mismo recurso que ya usa `scripts/generar-marca-social.mjs` para la tarjeta de
 * previsualización del sitio. Que las dos piezas compartan la franja no es repetición:
 * es lo que hace que se reconozcan como del mismo lugar.
 */
export const FRANJA = 14;

/** Una fila del setlist: un tema de la vuelta. */
export interface FilaTarjeta {
  readonly acerto: boolean;
  readonly titulo: string;
  /** El renglón chico de abajo: disco, audio que hizo falta y reloj. Registro 3. */
  readonly pie: string;
  /** El slug del disco, para que la fila se raye con la tinta real de su tapa. */
  readonly disco: string;
}

/** Todo lo que la tarjeta necesita saber de una vuelta. */
export interface DatosTarjeta {
  /** El nombre del juego, tal como lo escribe su `copy.ts`. */
  readonly juego: string;
  /** El token con el que se pinta ese nombre, p. ej. `--cat-mitologia`. */
  readonly tinteJuego: string;
  /** La línea que canta: uno de los tres tramos. */
  readonly tramo: string;
  readonly filas: readonly FilaTarjeta[];
  /**
   * El número grande y su rótulo, ya formateados por el juego.
   *
   * **Este módulo no sabe de milisegundos ni de versos**, y ahí está la gracia: es lo que
   * le permite servir a los dos juegos sin una sola rama adentro.
   */
  readonly rotuloHero: string;
  readonly hero: string;
  readonly puntaje: string;
  /** Dónde se juega. Es la única forma de volver que tiene una imagen suelta. */
  readonly sitio: string;
}

/** Un bloque ya ubicado. `y` es el borde de arriba. */
export interface Bloque {
  readonly clave: string;
  readonly y: number;
  readonly alto: number;
}

/** El alto fijo de las piezas que no se reparten nada. */
export const ALTOS = {
  marca: 72,
  titulo: 66,
  tramo: 54,
  rotuloHero: 34,
  hero: 132,
  puntaje: 40,
  sitio: 38,
} as const;

/** El aire entre piezas. */
export const AIRES = {
  trasMarca: 18,
  trasTitulo: 26,
  trasTramo: 44,
  trasSetlist: 44,
  trasHero: 10,
} as const;

/**
 * Cuántas filas entran sin que una quede demasiado flaca para leerse.
 *
 * Hoy la vuelta es de cuatro (`LARGO_RONDA`), pero el largo de la ronda es una constante
 * de la isla y podría cambiar; que la tarjeta se rompa en silencio cuando alguien la
 * suba es exactamente el defecto que este módulo existe para hacer imposible.
 */
export const MAX_FILAS = 6;

/** El título de un tema puede tomar dos renglones. Tres ya no es un título: es un párrafo. */
export const LINEAS_MAX = 2;

/**
 * Ubica cada bloque de la tarjeta y devuelve la lista en orden de dibujo.
 *
 * El encabezado va arriba y el pie queda **anclado abajo**, no colgando del último
 * renglón; el setlist se reparte lo que queda en el medio. Es lo que hace que una vuelta
 * de tres temas y una de cuatro se vean como la misma pieza y no como dos maquetas.
 */
export function planificar(filas: number): readonly Bloque[] {
  if (!Number.isInteger(filas) || filas < 1 || filas > MAX_FILAS) {
    throw new RangeError(`la tarjeta no sabe dibujar ${filas} filas`);
  }

  const bloques: Bloque[] = [];
  let y = MARGEN;
  const poner = (clave: string, alto: number, aire = 0): void => {
    bloques.push({ clave, y, alto });
    y += alto + aire;
  };

  poner('marca', ALTOS.marca, AIRES.trasMarca);
  poner('titulo', ALTOS.titulo, AIRES.trasTitulo);
  poner('tramo', ALTOS.tramo, AIRES.trasTramo);

  const banda = bandaDelSetlist();
  // Reparto en partes iguales, con la ultima fila comiendose el resto de la division:
  // asi la suma de las filas es EXACTAMENTE la banda y no queda un pixel bailando.
  const alto = Math.floor(banda.alto / filas);
  for (let i = 0; i < filas; i++) {
    const ultima = i === filas - 1;
    poner(`fila-${i}`, ultima ? banda.alto - alto * i : alto);
  }

  y = LIENZO.alto - MARGEN - ALTOS.sitio - ALTOS.puntaje - AIRES.trasHero - ALTOS.hero - ALTOS.rotuloHero;
  poner('rotuloHero', ALTOS.rotuloHero);
  poner('hero', ALTOS.hero, AIRES.trasHero);
  poner('puntaje', ALTOS.puntaje);
  poner('sitio', ALTOS.sitio);

  return bloques;
}

/** Dónde empieza y cuánto mide la banda que se reparte el setlist. */
export function bandaDelSetlist(): { readonly y: number; readonly alto: number } {
  const arriba =
    MARGEN +
    ALTOS.marca + AIRES.trasMarca +
    ALTOS.titulo + AIRES.trasTitulo +
    ALTOS.tramo + AIRES.trasTramo;
  const pie =
    ALTOS.rotuloHero + ALTOS.hero + AIRES.trasHero + ALTOS.puntaje + ALTOS.sitio + MARGEN;
  return { y: arriba, alto: LIENZO.alto - pie - AIRES.trasSetlist - arriba };
}

/**
 * El cuerpo tipográfico que hace entrar un texto en el ancho disponible.
 *
 * El canvas mide, este módulo decide. Se le pasa **cuánto mide el texto a un cuerpo de
 * referencia** y devuelve el cuerpo a usar, nunca abajo del piso: encoger sin límite
 * termina en un renglón que nadie puede leer, y a esa altura conviene partirlo en dos.
 *
 * Por qué encoger y partir en vez de recortar con puntos suspensivos: cortar el título
 * sería tapar el dato justo en la pieza que existe para mostrar qué temas salieron. Y
 * `voz-ricotera.md` 3.7 no quiere suspensivos donde no cuentan nada.
 */
export function cuerpoQueEntra(
  anchoMedido: number,
  anchoMax: number,
  cuerpoBase: number,
  piso: number,
): number {
  if (anchoMedido <= anchoMax || anchoMedido <= 0) return cuerpoBase;
  const encogido = Math.floor((cuerpoBase * anchoMax) / anchoMedido);
  return Math.max(piso, encogido);
}

/** Los cuerpos de cada renglón, con su piso. */
export const CUERPOS = {
  tituloFila: { base: 42, piso: 26 },
  pieFila: { base: 26, piso: 20 },
  marcaSitio: { base: 62, piso: 34 },
  tituloJuego: { base: 54, piso: 32 },
  tramo: { base: 38, piso: 24 },
  hero: { base: 128, piso: 72 },
} as const;

/** Cuánto ocupa un renglón respecto de su cuerpo. Ajustado, que es como grita este sitio. */
export const INTERLINEA = 1.12;

/**
 * Parte un texto en a lo sumo `LINEAS_MAX` renglones que entren en `anchoMax`.
 *
 * Se le pasa **la función que mide**, así el módulo sigue sin tocar el canvas y el test
 * puede medir con una regla de mentira. Si ni partido entra, devuelve lo que pudo: la
 * decisión de encoger el cuerpo es de `cuerpoQueEntra`, no de acá.
 */
export function partirEnLineas(
  texto: string,
  anchoMax: number,
  medir: (s: string) => number,
  maximo: number = LINEAS_MAX,
): readonly string[] {
  if (medir(texto) <= anchoMax) return [texto];

  const palabras = texto.split(/\s+/).filter(Boolean);
  const lineas: string[] = [];
  let actual = '';

  for (const palabra of palabras) {
    const probada = actual ? `${actual} ${palabra}` : palabra;
    if (actual && medir(probada) > anchoMax && lineas.length < maximo - 1) {
      lineas.push(actual);
      actual = palabra;
    } else {
      actual = probada;
    }
  }
  if (actual) lineas.push(actual);

  // Nunca mas de `maximo`: lo que sobre se junta en el ultimo renglon, que el cuerpo
  // encoge hasta que entre. Preferimos chico y entero antes que grande y cortado.
  if (lineas.length > maximo) {
    const cola = lineas.slice(maximo - 1).join(' ');
    return [...lineas.slice(0, maximo - 1), cola];
  }
  return lineas;
}

/**
 * El nombre del archivo que se baja. Sin espacios ni acentos: viaja por todos lados.
 *
 * Lleva el juego adentro porque desde que la tarjeta es compartida, dos vueltas de dos
 * juegos distintos terminarían en la misma carpeta de descargas con el mismo nombre.
 */
export function nombreArchivo(juego: string): string {
  return `arcade-ricotero-${juego}.png`;
}
