/**
 * El link de resultado compartido. Implementa `ADR-02`
 * (Docs/ARQ/ARQ-link-resultado-compartido.md).
 *
 * Forma: `https://<sitio>/?g=quiz&p=7&t=8&n=Santi`
 *
 *   g  juego        obligatorio
 *   p  puntaje      obligatorio, entero >= 0
 *   t  total        obligatorio, entero > 0
 *   n  nombre       opcional, <= 20 caracteres
 *
 * Y desde `ADR-06` hay una cuarta forma que **no viaja en la query sino en el fragmento**,
 * porque lo que comparte `US-08` no es un puntaje sino donde quedo cada ficha:
 *
 * Forma: `https://<sitio>/juegos/ponelos-en-fila/?g=ponelos#o=1.<conjunto>.<carga>`
 *    o:  `https://<sitio>/juegos/ponelos-en-fila/?g=ponelos#o=2.<conjunto>.<carga>&f=<fila>&f=…`
 *
 *   g  juego        obligatorio, en la query, igual que las otras tres
 *   o  reparto      en el fragmento: version, conjunto, y tres bits por ficha
 *   f  fila         solo en la version 2 (`D-69`): el nombre de cada fila, en orden
 *
 * Vive en la mitad de abajo de este archivo, con su propio encabezado.
 *
 * **Este archivo es la unica puerta por la que entra dato de afuera a todo el sitio.**
 * No hay backend, no hay login, no hay formularios: la URL es la unica superficie de
 * entrada que existe. Por eso las dos reglas de abajo no son celo, son la superficie
 * completa de seguridad del proyecto.
 *
 * **1. El nombre es texto, nunca HTML.** `ADR-02` lo dice sin vueltas: un nombre
 * inyectado desde la URL es XSS reflejado de manual. `leerDesafio` devuelve un string
 * limpio y quien lo use tiene que escribirlo con `textContent`, jamas con `innerHTML`.
 * La funcion no puede impedir el mal uso, pero deja el valor lo mas inofensivo posible.
 *
 * **2. El puntaje no se puede confiar, y esta bien.** Cualquiera edita la URL y se pone
 * 8 de 8. `ADR-02` lo acepto explicitamente: sin backend no hay forma de impedirlo, y
 * firmarlo con una clave que viaja en el propio JavaScript seria teatro. El puntaje del
 * desafio se muestra como **"lo que dice tu amigo que hizo"**, no como un hecho — y el
 * unico costo de que alguien mienta es que se enganie a si mismo.
 */

export const LARGO_MAX_NOMBRE = 20;

/**
 * El tope de `t`, subido de 100 a 9999 por `ADR-02` v2.
 *
 * No es holgura por las dudas: la escalera de `US-02` puntua sobre 400, y con el tope
 * viejo el juego no podia mandar puntos, asi que mandaba aciertos. El resultado era que
 * el tuit decia "160 de 400" y su propio link decia "3 de 4" — dos numeros para la misma
 * partida.
 */
export const TOTAL_MAX = 9999;

/** Los tres desenlaces de una partida por vidas (`BR-19` apartado 6). Enum cerrado. */
export const DESENLACES = ['victoria', 'derrota', 'retirada'] as const;
export type DesenlaceDesafio = (typeof DESENLACES)[number];

/**
 * Un desafio, en las tres formas que `ADR-02` v2 reconoce.
 *
 * **Es una union discriminada por `forma`, y eso es lo que hace el trabajo.** Mismo
 * mecanismo que ya usa `src/lib/dos-ejes/partida.ts`, y por la misma razon escrita alla:
 * *lo que no esta en el tipo no se puede mostrar*. Un `identidad` no tiene de donde sacar
 * un puntaje ni por accidente, asi que la pantalla de los dos ejes no puede inventar un
 * numero que ese juego no produce.
 */
export type Desafio =
  /** Cuanto saco sobre cuanto podia. `US-04`, y los links de la v1. */
  | { readonly forma: 'marcador'; readonly juego: string; readonly puntaje: number; readonly total: number; readonly nombre?: string }
  /** Hasta donde llego y como termino. `US-01` bajo `BR-19`. */
  | { readonly forma: 'recorrido'; readonly juego: string; readonly puntaje: number; readonly total: number; readonly desenlace: DesenlaceDesafio; readonly nombre?: string }
  /** Que le salio. Sin numero. `US-06`. */
  | { readonly forma: 'identidad'; readonly juego: string; readonly identidad: string; readonly nombre?: string }
  /**
   * Donde puso cada ficha. Sin numero y **sin nombre**. `US-08` bajo `ADR-06`.
   *
   * `casillas` son enteros que eligen una fila, y `conjunto` es un slug que **no se
   * muestra nunca** — se busca en el catalogo y lo que se pinta es el nombre propio del
   * conjunto, igual que hace `r` en la forma `identidad`.
   *
   * `filas` existe desde `D-69` y es **el unico texto libre de esta forma**: los nombres
   * que el jugador le puso a sus filas. Sin ellos, una lista con filas propias abriria del
   * otro lado con las cuatro de siempre — las fichas en su lugar y los carteles cambiados,
   * que es un rotulo que miente sobre lo que hay adentro. Se limpian con lista blanca al
   * entrar y al salir (`limpiarNombreFila`), y se escriben con `textContent`, como el `n`.
   * Cuando no viene, las filas son las cuatro de `FILAS` y el link es de la version 1.
   *
   * No lleva `n` a proposito. Las otras tres cuentan lo que hizo alguien, asi que el
   * nombre agrega algo; un reparto no es un logro de nadie (`BR-22`).
   */
  | {
      readonly forma: 'reparto';
      readonly juego: string;
      readonly conjunto: string;
      readonly casillas: readonly number[];
      readonly filas?: readonly string[];
    };

/**
 * Las tres formas que viajan **en la query**, o sea todo lo que `leerDesafio` puede
 * devolver.
 *
 * Existe como nombre propio para que las pantallas que muestran un desafio ajeno —el quiz,
 * y las que vengan— puedan pedir exactamente eso. Sin este alias tendrian que preguntar
 * por `reparto`, que por la query no entra nunca (`ADR-06.5`), y esa rama muerta se
 * volveria una invitacion a inventarle un puntaje al reparto.
 */
export type DesafioDeQuery = Exclude<Desafio, { forma: 'reparto' }>;

/**
 * Deja el nombre en algo seguro de mostrar como texto.
 *
 * Saca los caracteres de control y los que se usan para armar etiquetas. No es un
 * escape de HTML —eso lo hace el DOM al usar `textContent`— es reducir el material
 * disponible por si alguien, algun dia, lo escribe mal.
 */
function limpiarNombre(crudo: string): string {
  // FIND-21: `ADR-02` pide "letras, numeros, espacios, guiones y apostrofos", y la
  // version anterior filtraba el apostrofo junto con las comillas. Se llevaba puestos
  // apellidos reales -- O'Connor, D'Angelo -- por una regla que el documento no pedia.
  //
  // Es lista blanca y no lista negra a proposito: enumerar lo que se permite envejece
  // mejor que enumerar lo que se prohibe, sobre todo con Unicode de por medio. Deja
  // pasar acentos y la ene, que hacen falta, y no deja pasar nada de lo que sirve para
  // armar una etiqueta.
  return Array.from(crudo)
    .filter((c) => /[\p{L}\p{N}\p{M} \-']/u.test(c))
    .join('')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, LARGO_MAX_NOMBRE);
}

/**
 * Arma el link para compartir. Devuelve la URL completa.
 *
 * Tira `RangeError` ante lo imposible, y eso es a proposito: **un link invalido no se
 * genera.** Se rompe el build o el test, no la pantalla de la gente.
 */
export function armarLink(base: string, d: Desafio): string {
  const url = new URL(base);
  url.searchParams.set('g', d.juego);

  // `ADR-06`: el reparto sale por el fragmento y se va antes de tocar `n`, que esta forma
  // no tiene. `g` se queda en la query, que es lo que le permite a `leerReparto` rechazar
  // un reparto de otro juego sin repetir el descuido de `FIND-28`.
  if (d.forma === 'reparto') {
    if (!CONJUNTO.test(d.conjunto)) throw new RangeError('conjunto invalido');
    const filas = d.filas;
    if (filas !== undefined) {
      if (filas.length < MIN_FILAS_REPARTO || filas.length > MAX_FILAS_REPARTO) {
        throw new RangeError(`un reparto no puede tener ${filas.length} filas`);
      }
      for (const f of filas) {
        // Un nombre sucio no se limpia en silencio al escribir: se rechaza. Quien arma el
        // link ya tuvo que limpiarlo al recibirlo del teclado, y si no lo hizo es un error
        // del juego, no del jugador.
        if (!f || limpiarNombreFila(f) !== f) throw new RangeError('nombre de fila invalido');
      }
    }
    const techo = filas ? filas.length : MAX_CASILLA;
    for (const c of d.casillas) {
      if (!Number.isInteger(c) || c < 0 || c > techo) {
        throw new RangeError(`casilla fuera de las ${techo} filas: ${c}`);
      }
    }
    const carga = empaquetarReparto(d.casillas);
    if (!filas) {
      url.hash = `o=${VERSION_REPARTO}.${d.conjunto}.${carga}`;
      return url.toString();
    }
    const fragmento = new URLSearchParams();
    fragmento.set('o', `${VERSION_REPARTO_CON_FILAS}.${d.conjunto}.${carga}`);
    for (const f of filas) fragmento.append('f', f);
    url.hash = fragmento.toString();
    return url.toString();
  }

  if (d.forma === 'identidad') {
    if (!/^[A-Za-z0-9-]{1,12}$/.test(d.identidad)) throw new RangeError('identidad invalida');
    url.searchParams.set('r', d.identidad);
  } else {
    if (!Number.isInteger(d.puntaje) || d.puntaje < 0) throw new RangeError('puntaje invalido');
    if (!Number.isInteger(d.total) || d.total <= 0 || d.total > TOTAL_MAX) {
      throw new RangeError('total invalido');
    }
    if (d.puntaje > d.total) throw new RangeError('el puntaje no puede superar el total');
    url.searchParams.set('p', String(d.puntaje));
    url.searchParams.set('t', String(d.total));
    if (d.forma === 'recorrido') {
      if (!DESENLACES.includes(d.desenlace)) throw new RangeError('desenlace invalido');
      url.searchParams.set('d', d.desenlace);
    }
  }

  const n = d.nombre ? limpiarNombre(d.nombre) : '';
  if (n) url.searchParams.set('n', n);
  return url.toString();
}

/**
 * Lee un desafio de una query string. Devuelve `null` si no hay uno valido.
 *
 * `null` significa "entraste normal", no "hubo un error": la enorme mayoria de las
 * visitas no traen desafio, y el sitio tiene que abrir igual. Un link roto **nunca**
 * puede dejar a alguien afuera — eso seria cerrar un molinete (`D-14`).
 *
 * **Devuelve las tres formas de la query y nunca `reparto`**, y eso esta dicho en el tipo
 * y no solo en esta prosa: el reparto viaja en el fragmento, asi que por aca no puede
 * entrar (`ADR-06.5`). Sin esa exclusion, los seis juegos que ya usan esta funcion
 * tendrian que preguntar por una forma que jamas les va a llegar.
 */
export function leerDesafio(
  query: string,
  juegoPropio: string,
): DesafioDeQuery | null {
  let p: URLSearchParams;
  try {
    p = new URLSearchParams(query.startsWith('?') ? query.slice(1) : query);
  } catch {
    return null;
  }

  const juego = p.get('g');
  if (!juego || !/^[a-z-]{1,20}$/.test(juego)) return null;

  // `FIND-28`, y es la razon por la que `juegoPropio` es obligatorio y no opcional.
  //
  // Hasta el ciclo 9 esta funcion devolvia el campo `g` y **nadie lo miraba**: abrir
  // `/quiz/?g=tapa&p=10&t=10&n=Fulano` pintaba "Fulano saco 10/10" en el quiz, con un
  // puntaje imposible en una ronda de 8. Reproducido en el navegador el 2026-08-25, con
  // el sitio ya desplegado.
  //
  // Se arregla en la **firma** y no en cada sitio de llamada a proposito: mientras el
  // segundo parametro sea obligatorio, no se puede leer un desafio sin decir de que juego
  // sos, y la clase entera de bug pasa de improbable a imposible. Es el mismo criterio
  // con el que `ronda.ts` resolvio lo de la opcion correcta siempre primera.
  if (juego !== juegoPropio) return null;

  const nombre = limpiarNombre(p.get('n') ?? '');
  const conNombre = nombre ? { nombre } : {};

  const crudoR = p.get('r');
  const crudoP = p.get('p');
  const crudoT = p.get('t');
  const crudoD = p.get('d');

  // Forma `identidad`: `r` sola. Mezclarla con `p`/`t`/`d` no describe nada real, asi
  // que no se interpreta a medias — se rechaza entera.
  if (crudoR !== null) {
    if (crudoP !== null || crudoT !== null || crudoD !== null) return null;
    if (!/^[A-Za-z0-9-]{1,12}$/.test(crudoR)) return null;
    return { forma: 'identidad', juego, identidad: crudoR, ...conNombre };
  }

  const puntaje = Number(crudoP);
  const total = Number(crudoT);
  if (crudoP === null || crudoT === null) return null;
  if (!Number.isInteger(puntaje) || puntaje < 0) return null;
  if (!Number.isInteger(total) || total <= 0 || total > TOTAL_MAX) return null;
  if (puntaje > total) return null;

  // Sin `d` es un `marcador`, que es exactamente la forma de los links de la v1: un
  // `?g=quiz&p=6&t=8` de antes del ciclo 9 se sigue leyendo y no rompe nada.
  if (crudoD === null) return { forma: 'marcador', juego, puntaje, total, ...conNombre };

  if (!DESENLACES.includes(crudoD as DesenlaceDesafio)) return null;
  return { forma: 'recorrido', juego, puntaje, total, desenlace: crudoD as DesenlaceDesafio, ...conNombre };
}

/* ==================================================================
   `ADR-06` — la cuarta forma: `reparto`, y por qué viaja en el fragmento

   Las tres formas de arriba caben en la query porque son **un puñado de números**: un
   puntaje, un total, un desenlace de tres valores. `US-08` comparte otra cosa — dónde
   puso el jugador cada una de las fichas de un conjunto —, y eso no entra en ninguna de
   las tres: `identidad` acota `r` a doce caracteres y exige que resuelva contra un enum
   del juego, y un reparto arbitrario no resuelve contra nada.

   **Sigue siendo esta puerta y no otra.** El encabezado de este archivo dice que es la
   única por la que entra dato de afuera a todo el sitio, y partirla en dos módulos sería
   dejar la mitad del tráfico sin ese encabezado encima. Así que la forma nueva se escribe
   acá, con las mismas dos reglas:

   **1. Ningún campo es texto, salvo uno, y ese con lista blanca.** Un reparto es una tira
   de enteros de 0 a 7, y el id del conjunto es un slug de alfabeto cerrado. Desde `D-69`
   viajan además los nombres de las filas propias del jugador (`f=`, versión 2): es el
   único texto que alguien puede escribir y que termina en la pantalla de otro, y por eso
   entra por `limpiarNombreFila` y se pinta con `textContent`, como el `n` de las otras
   tres formas.

   **2. El reparto no se puede confiar, y acá ni siquiera importa.** Cualquiera edita el
   fragmento. En `marcador` eso era un puntaje inflado; acá no hay puntaje que inflar —
   `BR-22` prohíbe que el sitio tenga un orden correcto, así que un reparto "falso" es
   simplemente otro reparto. Lo único que un fragmento roto puede hacer es no abrir, y
   ante eso el juego abre vacío: **un link roto nunca deja a nadie afuera** (`D-14`).

   **Por qué el fragmento y no la query.** Lo que va después de `#` no se manda al
   servidor (RFC 3986 §3.5): no entra en el registro de acceso de Vercel ni en el
   `Referer` que el navegador le pasa al próximo sitio. Un reparto es una opinión sobre
   una banda, y no tiene por qué quedar escrita en el registro de nadie.

   **Lo que se pierde, dicho de frente:** ningún previsualizador de enlaces —WhatsApp,
   Telegram, X, Discord— lee lo que hay después del `#`, así que el enlace compartido
   muestra la tarjeta genérica del sitio. No es un defecto que haya que arreglar: es
   exactamente por qué existe la lámina. **La imagen es el previsualizador.**
   ================================================================== */

/** Tres bits por ficha: ocho valores, y hoy se usan cinco (sin ubicar más cuatro filas). */
export const BITS_POR_FICHA = 3;

/**
 * La versión del empaquetado, y es el campo más importante de los tres.
 *
 * La carga **no dice qué ficha es cada valor**: los valores van en el orden canónico del
 * conjunto, que vive en el código y no viaja. Si ese orden cambiara —un tema que se
 * renumera, un disco que se parte en dos—, los links viejos se leerían corridos un lugar
 * y **nadie se enteraría**: la lista abriría, sería una lista válida, y estaría mal. Subir
 * este número es lo que convierte ese defecto silencioso en un link que no abre.
 */
export const VERSION_REPARTO = 1;

/**
 * El techo de fichas de un reparto (`ADR-06.4`, paso 5). 120 son 45 bytes y 60 caracteres
 * de carga: el conjunto más grande que este juego puede llegar a tener —los 105 temas—
 * entra con lugar de sobra. Existe para que una carga inventada no haga trabajar al
 * navegador de balde.
 */
export const MAX_ITEMS_REPARTO = 120;

/**
 * La casilla más alta que se puede **escribir** hoy: la cuarta fila.
 *
 * Los tres bits aguantan hasta 7, y los tres valores de arriba quedan reservados para
 * filas que todavía no existen. Pero escribirlos ahora sería generar un link que esta
 * versión no sabe leer, así que `armarLink` los rechaza y `leerReparto` los descarta. El
 * día que haya una quinta fila, sube `VERSION_REPARTO` y sube esto.
 */
export const MAX_CASILLA = 4;

/* ------------------------------------------------------------------
   `D-69` — las filas propias, y la version 2 del empaquetado

   Hasta `D-69` las filas eran cuatro y fijas, y el link no las nombraba: las sabia el
   codigo. Desde que el jugador las renombra y suma, **el link tiene que llevarlas**, o la
   lista abre del otro lado con las fichas en su lugar y los carteles de otra persona.

   **Por que una version nueva y no un campo opcional en la 1.** Un lector de la version 1
   que no sabe de `f` leeria `o=1...`, ignoraria los nombres y pintaria las cuatro de
   siempre: una lista valida, abierta, y mal rotulada sin que nadie se entere — el defecto
   silencioso que `VERSION_REPARTO` existe para volver ruidoso. Con `o=2`, el que no sabe
   leerla no la abre. Y la version 1 se sigue escribiendo cuando las filas son las de
   siempre: los links viejos y los nuevos sin filas propias son el mismo link.

   **El unico texto libre que entra por el fragmento**, y por eso con las dos reglas del
   encabezado de este archivo enteras: lista blanca al leer (`limpiarNombreFila`), y quien
   lo pinta usa `textContent`. Un nombre que no sobrevive a la limpieza descarta el reparto
   entero, igual que una casilla reservada: media lista ajena es una lista inventada.
   ------------------------------------------------------------------ */

/** La version del empaquetado que ademas trae los nombres de las filas (`D-69`). */
export const VERSION_REPARTO_CON_FILAS = 2;

/**
 * Cuantas filas puede tener un reparto. El techo no es de diseño: tres bits son ocho
 * valores, el cero es "sin ubicar", y quedan siete filas. El piso es dos porque con una
 * sola fila no hay nada que repartir.
 */
export const MAX_FILAS_REPARTO = 7;
export const MIN_FILAS_REPARTO = 2;

/** El largo de un nombre de fila. Entra en el sello del tablero y en un renglon de la lamina. */
export const LARGO_MAX_NOMBRE_FILA = 24;

/**
 * Deja un nombre de fila en algo seguro de mostrar como texto y de imprimir en la lamina.
 *
 * Misma lista blanca que `limpiarNombre`, con la puntuacion que una fila necesita para
 * decir algo ("¡LA DE LA PREVIA!", "Ni a palos", "11 y 12") y nada de lo que sirve para
 * armar una etiqueta. La usan los dos lados: la isla, con lo que se escribe en el teclado,
 * y `leerReparto`, con lo que llega por el fragmento.
 */
export function limpiarNombreFila(crudo: string): string {
  const limpio = Array.from(crudo)
    .filter((c) => /[\p{L}\p{N}\p{M} \-'.,!?¡¿]/u.test(c))
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
  // El corte va por letras y no por unidades UTF-16: una letra de fuera del plano básico
  // (las 𝐀 de las redes) cortada al medio dejaba media letra, y la limpieza dejaba de dar lo
  // mismo dos veces seguidas — con eso, `armarLink` rechazaba el nombre y compartir no andaba.
  return Array.from(limpio).slice(0, LARGO_MAX_NOMBRE_FILA).join('').trim();
}

/** El id de un conjunto ordenable. Alfabeto cerrado, igual que `g` y que `r`. */
const CONJUNTO = /^[a-z0-9][a-z0-9-]{0,23}$/;

/** base64url (RFC 4648 §5), sin relleno: viaja entero por cualquier lado. */
const ALFABETO = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

/**
 * Empaqueta los valores en base64url. Cada valor ocupa tres bits, el menos significativo
 * primero, corridos byte a byte.
 *
 * Tira `RangeError` ante lo imposible, igual que `armarLink` y por el mismo motivo: **un
 * link inválido no se genera**. Se rompe el test, no la pantalla de la gente.
 */
export function empaquetarReparto(valores: readonly number[]): string {
  if (valores.length < 1 || valores.length > MAX_ITEMS_REPARTO) {
    throw new RangeError(`un reparto de ${valores.length} fichas no se puede empaquetar`);
  }
  for (const v of valores) {
    if (!Number.isInteger(v) || v < 0 || v > 7) {
      throw new RangeError(`valor fuera de tres bits: ${v}`);
    }
  }

  const bytes = new Uint8Array(Math.ceil((valores.length * BITS_POR_FICHA) / 8));
  valores.forEach((v, i) => {
    for (let k = 0; k < BITS_POR_FICHA; k++) {
      if (((v >> k) & 1) === 0) continue;
      const bit = i * BITS_POR_FICHA + k;
      bytes[bit >> 3] |= 1 << (bit & 7);
    }
  });

  let salida = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i]!;
    const b = i + 1 < bytes.length ? bytes[i + 1]! : null;
    const c = i + 2 < bytes.length ? bytes[i + 2]! : null;
    salida += ALFABETO[a >> 2]! + ALFABETO[((a & 3) << 4) | ((b ?? 0) >> 4)]!;
    if (b === null) break;
    salida += ALFABETO[((b & 15) << 2) | ((c ?? 0) >> 6)]!;
    if (c === null) break;
    salida += ALFABETO[c & 63]!;
  }
  return salida;
}

/**
 * Abre una carga y devuelve exactamente `cuantas` valores, o `null` si no cierra.
 *
 * **Es estricto con el largo, y ahí está el trabajo.** Una carga que da menos bytes de los
 * que el conjunto necesita se rechaza en vez de completarse con ceros: completar sería
 * inventarle al que compartió una lista que no armó. Una que da de más también, porque
 * significa que la carga es de otro conjunto.
 */
export function desempaquetarReparto(carga: string, cuantas: number): number[] | null {
  if (!Number.isInteger(cuantas) || cuantas < 1 || cuantas > MAX_ITEMS_REPARTO) return null;
  const bytesEsperados = Math.ceil((cuantas * BITS_POR_FICHA) / 8);
  if (carga.length !== Math.ceil((bytesEsperados * 4) / 3)) return null;

  const bytes = new Uint8Array(bytesEsperados);
  let acumulado = 0;
  let sueltos = 0;
  let escritos = 0;
  for (const c of carga) {
    const n = ALFABETO.indexOf(c);
    if (n < 0) return null;
    acumulado = (acumulado << 6) | n;
    sueltos += 6;
    if (sueltos < 8) continue;
    sueltos -= 8;
    if (escritos >= bytesEsperados) return null;
    bytes[escritos++] = (acumulado >> sueltos) & 0xff;
  }
  if (escritos !== bytesEsperados) return null;

  const valores: number[] = [];
  for (let i = 0; i < cuantas; i++) {
    let v = 0;
    for (let k = 0; k < BITS_POR_FICHA; k++) {
      const bit = i * BITS_POR_FICHA + k;
      v |= ((bytes[bit >> 3]! >> (bit & 7)) & 1) << k;
    }
    valores.push(v);
  }
  return valores;
}

/**
 * Lee un reparto de una dirección entera. Devuelve `null` si no hay uno válido.
 *
 * **Los siete pasos de `ADR-06.4`, en orden**: la dirección parsea, `g` es de este juego,
 * hay un `o=` en el fragmento, tiene las tres partes, la versión es la que este código
 * sabe leer, el conjunto existe *y dice cuántas fichas tiene*, y la carga abre en
 * exactamente esa cantidad de casillas válidas.
 *
 * `fichasDelConjunto` es **una función y no una tabla importada**, y ese detalle sostiene
 * todo el archivo: `desafio.ts` no importa nada, que es la condición para que lo puedan
 * importar los dos lados. El catálogo de `CTR-13` sale de `RES-20` y arrastra `node:fs`;
 * si entrara acá, `islas.test.ts` tendría razón en fallar y se llevaría puestos los siete
 * juegos que ya usan esta puerta.
 *
 * Y `juegoPropio` es obligatorio por lo mismo que en `leerDesafio`: `FIND-28` fue
 * exactamente esto —un desafío de otro juego pintado como propio— y se arregló en la
 * firma, no en cada sitio de llamada.
 *
 * Devolver `null` significa "entraste normal", no "hubo un error": un link roto **nunca**
 * puede dejar a alguien afuera (`D-14`). El juego abre con el tablero vacío.
 */
export function leerReparto(
  direccion: string,
  juegoPropio: string,
  fichasDelConjunto: (id: string) => number | null,
): Extract<Desafio, { forma: 'reparto' }> | null {
  let url: URL;
  try {
    url = new URL(direccion);
  } catch {
    return null;
  }

  const juego = url.searchParams.get('g');
  if (!juego || !/^[a-z-]{1,20}$/.test(juego) || juego !== juegoPropio) return null;

  const crudo = url.hash.startsWith('#') ? url.hash.slice(1) : url.hash;
  if (!crudo) return null;

  let p: URLSearchParams;
  try {
    p = new URLSearchParams(crudo);
  } catch {
    return null;
  }
  const valor = p.get('o');
  if (!valor) return null;

  const partes = valor.split('.');
  if (partes.length !== 3) return null;
  const [version, conjunto, carga] = partes as [string, string, string];
  if (version !== String(VERSION_REPARTO) && version !== String(VERSION_REPARTO_CON_FILAS)) return null;
  if (!CONJUNTO.test(conjunto)) return null;
  // 120 fichas son 45 bytes, y 45 bytes son 60 caracteres. El largo exacto lo decide el
  // conjunto un par de lineas mas abajo; esto solo acota lo que se mira.
  if (!/^[A-Za-z0-9_-]{1,80}$/.test(carga)) return null;

  // `D-69`: la version 2 trae los nombres de las filas, y sin ellos no es una version 2.
  let filas: string[] | null = null;
  if (version === String(VERSION_REPARTO_CON_FILAS)) {
    const crudas = p.getAll('f');
    if (crudas.length < MIN_FILAS_REPARTO || crudas.length > MAX_FILAS_REPARTO) return null;
    filas = crudas.map((f) => limpiarNombreFila(f));
    if (filas.some((f) => f.length === 0)) return null;
  }

  const cuantas = fichasDelConjunto(conjunto);
  if (cuantas === null) return null;

  const casillas = desempaquetarReparto(carga, cuantas);
  if (!casillas) return null;
  // Un valor por encima de la ultima fila es un reparto de una version que este codigo no
  // conoce, o un fragmento editado a mano. Se descarta **entero** y no la ficha suelta:
  // media lista ajena es una lista inventada.
  const techo = filas ? filas.length : MAX_CASILLA;
  if (casillas.some((c) => c > techo)) return null;

  return filas
    ? { forma: 'reparto', juego, conjunto, casillas, filas }
    : { forma: 'reparto', juego, conjunto, casillas };
}
