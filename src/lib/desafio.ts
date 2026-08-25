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
  | { readonly forma: 'identidad'; readonly juego: string; readonly identidad: string; readonly nombre?: string };

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
 */
export function leerDesafio(query: string, juegoPropio: string): Desafio | null {
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
