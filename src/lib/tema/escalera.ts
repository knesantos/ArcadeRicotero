/**
 * La escalera del reveal de "adiviná el tema" (`US-02`): seis pasos, de 0,1 s a 10 s
 * (eran 15 — ver `D-26` sobre la constante de abajo).
 *
 * ## De dónde salen estos números, y qué contradicen
 *
 * Los fija el usuario el 2026-08-23, con el juego de referencia a la vista
 * (`Docs/INVESTIGACION/` no lo ficha: lo relevó el hilo principal, mapa en
 * `Docs/SUGERENCIAS/HILO-mapa-del-juego-de-referencia.md`). **Reemplazan a los cinco pasos de `CTR-01.9`**
 * (0,1 / 0,5 / 2,0 / 5,0 / 10,0) y a la tabla de cinco filas de `BR-02`. La decisión
 * está escrita en `D-24`; los pedidos formales a `arquitectura` y a `producto` están
 * en `Docs/SUGERENCIAS/`.
 *
 * Los tres primeros pasos son los mismos que ya tenía `CTR-01.9`. Lo que cambia es la
 * cola: donde el contrato viejo iba 5 → 10, éste iba 4 → 8 → 15 (`D-26` la topea hoy
 * en 10). Es una escalera que
 * **duplica**, y esa es toda su lógica: cada paso te da el doble de lo que tenías, así
 * que la sensación de "me están dando más" no se apaga nunca.
 *
 * ## La mecánica cambió, y es el cambio grande
 *
 * `BR-02` decía **un intento por ítem**: errás y el tema se cierra en 0. Acá no. El
 * modelo del juego de referencia es el que pidió el usuario y es el opuesto:
 * **errar es lo que te desbloquea más audio**. Seis intentos, uno por paso; cada
 * respuesta equivocada —o cada "pasar"— te abre el escalón siguiente. Se acaban los
 * seis y ahí sí el tema se cierra en 0.
 *
 * El motivo por el que un error no puede seguir costando el ítem entero: con 105 títulos
 * en el buscador, errar al azar en el paso 1 no es "arriesgar", es "no saber". Cerrar el
 * tema ahí deja al que entró sin idea escuchando 0,1 segundos y nada más — que es
 * exactamente cerrar un molinete (`D-14`).
 *
 * ## Este archivo es la única fuente de la escalera
 *
 * Ni el JSON de datos ni el motor guardan duraciones (`CTR-03.4`). Si mañana la escalera
 * cambia, cambia acá y en ningún otro lado: no hay migración de datos, porque los seis
 * pasos salen del **mismo archivo de audio** — el motor reproduce `[0, segundos]` sobre
 * el buffer que ya tiene decodificado.
 */

export interface Paso {
  /** 1 a 6. */
  readonly n: number;
  /** Cuánto audio se escucha en este paso, desde el arranque del fragmento. */
  readonly segundos: number;
  /** Lo que vale acertar acá. */
  readonly puntos: number;
  /** Cómo se escribe el número en pantalla. Coma decimal: se lee en castellano. */
  readonly etiqueta: string;
}

/**
 * La duración del fragmento que sirve el sitio, en segundos.
 * Tiene que ser **igual o mayor** que el último paso, o el escalón más caro devolvería
 * silencio — y `catalogo.ts` rechaza el manifiesto entero si no se cumple.
 *
 * **`D-26`: es 10 y no los 15 de `D-23`, porque los fragmentos reales miden 10.** El
 * PR #8 trajo 95 fragmentos recortados a mano (10 s, 64 kbps, mono) y el usuario pidió
 * terminar el juego con ellos. Entre una escalera que promete 15 y reproduce 10, y una
 * que promete 10 y cumple, gana la que no miente. Si algún día los fragmentos se
 * regeneran a 15 s (`generar-fragmentos.mjs`, con ffmpeg), esto vuelve a 15 y el último
 * paso también — son las dos únicas líneas que cambian.
 */
export const DURACION_FRAGMENTO_SEG = 10;

export const ESCALERA: readonly Paso[] = [
  { n: 1, segundos: 0.1, puntos: 100, etiqueta: '0,1 s' },
  { n: 2, segundos: 0.5, puntos: 80, etiqueta: '0,5 s' },
  { n: 3, segundos: 2, puntos: 60, etiqueta: '2 s' },
  { n: 4, segundos: 4, puntos: 40, etiqueta: '4 s' },
  { n: 5, segundos: 8, puntos: 20, etiqueta: '8 s' },
  // `D-26`: 10 y no los 15 de `D-24`, mientras los fragmentos del PR #8 midan 10.
  { n: 6, segundos: 10, puntos: 10, etiqueta: '10 s' },
];

/** Cuántos intentos tiene el jugador por tema. Es la altura de la escalera, no un tope
 *  aparte: cada intento gastado abre el paso siguiente, y el último no abre nada. */
export const INTENTOS = ESCALERA.length;

/** El paso número `n`. Fuera de rango, el último — nunca `undefined` en el motor. */
export function paso(n: number): Paso {
  if (n <= 1) return ESCALERA[0]!;
  if (n >= ESCALERA.length) return ESCALERA[ESCALERA.length - 1]!;
  return ESCALERA[n - 1]!;
}

/**
 * Los puntos de acertar en el paso `n`. Fallar los seis da 0, y **0 es solo eso**:
 * nunca el resultado de haber tardado (es la parte de `BR-02` que no se toca).
 */
export function puntos(n: number): number {
  return paso(n).puntos;
}

/** El puntaje máximo de una ronda de `temas` temas: sirve para el "x de y". */
export function puntajeMaximo(temas: number): number {
  return temas * ESCALERA[0]!.puntos;
}

/**
 * El ancho de cada tramo de la barra, en porcentaje.
 *
 * La barra se lee como una línea de tiempo: el tramo `n` ocupa **lo que agrega** ese
 * paso sobre el anterior, no su duración total. Por eso el último tramo se come casi la
 * mitad de la barra — porque de 8 a 15 segundos hay siete segundos de audio nuevo, y
 * dibujarlos del mismo ancho que el salto de 0,1 a 0,5 sería mentir sobre lo que te
 * están dando.
 *
 * Los dos primeros tramos dan menos del 3% juntos y en un celular eso es medio píxel:
 * el CSS les pone un `min-width`, que es un ajuste de dibujo y no de aritmética.
 */
export function anchosDeTramos(): readonly number[] {
  const total = ESCALERA[ESCALERA.length - 1]!.segundos;
  let previo = 0;
  return ESCALERA.map((p) => {
    const ancho = ((p.segundos - previo) / total) * 100;
    previo = p.segundos;
    return ancho;
  });
}

/**
 * Qué porción de la barra necesita un tramo para que le quepa el número escrito debajo.
 *
 * La barra se lee como una regla graduada: abajo de cada tramo va, alineado a su borde
 * derecho, **cuánto audio llevás acumulado si llegaste hasta ahí**. Eso convierte la
 * escalera de una idea abstracta —"te van dando más"— en algo que se ve antes de
 * gastarlo, que es lo mismo que ya hacen los seis renglones de intento.
 *
 * Diez por ciento no es un número redondo elegido de arriba: un número como `0,5 s` mide
 * unos 34 px al cuerpo chico del rótulo, y la barra más angosta que dibuja el sitio es la
 * de un celular de 375 px, donde el tablero mide 343. El 10% de eso son 34 px justos.
 * Arriba de ese piso el número entra a cualquier ancho; abajo, se pisaría con el vecino.
 */
export const PISO_ETIQUETA_PCT = 10;

/**
 * Cuáles de los seis tramos llevan su número escrito.
 *
 * Los dos primeros no: `0,1 s` y `0,5 s` se llevan el 1% y el 4% de la barra, que en un
 * celular son tres píxeles y trece. **Y que no lo lleven está bien**, porque el número
 * que importa mientras se juega ya está escrito grande en el rótulo del paso actual; la
 * regla de abajo es para ver la forma de la escalera, no para leerla renglón por renglón.
 *
 * Se decide acá y no con una consulta de contenedor en CSS a propósito: es aritmética de
 * la escalera, sale del mismo lugar que los anchos, y así queda testeada.
 */
export function tramosConEtiqueta(): readonly boolean[] {
  return anchosDeTramos().map((ancho) => ancho >= PISO_ETIQUETA_PCT);
}
