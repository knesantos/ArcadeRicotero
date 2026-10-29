/**
 * Compartir un resultado con su enlace de desafío, y con su tarjeta si el juego la tiene.
 *
 * ## Por qué existe
 *
 * Hasta el 2026-10-01 compartían cinco juegos y no compartían tres: "Adiviná la tapa",
 * "Completá la letra" y "¿Qué tipo de ricotero sos?" terminaban en "Otra vuelta" y nada
 * más. El texto de dos ejes ya estaba escrito; faltaba el botón. Los tres que se suman
 * hacen lo mismo que "Más o menos" (`D-48` punto 11): **texto y enlace, sin imagen**. Por
 * eso es un módulo y no tres copias de la misma escalera.
 *
 * ## La escalera, que es la de `D-14`
 *
 * 1. El menú de compartir del sistema, si el teléfono lo tiene. Ahí termina casi siempre.
 * 2. El portapapeles, con el texto y la dirección juntos.
 * 3. El texto a la vista, seleccionable. No puede fallar: **nadie se queda sin poder
 *    compartir** porque su navegador no tenga una de las dos anteriores.
 *
 * El enlace lo arma quien llama con `armarLink` (`ADR-02`): este módulo no sabe de qué
 * juego es ni qué forma de desafío lleva, y así no puede inventarle un puntaje a un juego
 * que no lo tiene (`BR-17`).
 *
 * ## La tarjeta, cuando hay (`D-57` punto 10)
 *
 * "¿Qué tipo de ricotero sos?" pasa un `archivo`: la tarjeta de su identidad, que la isla
 * bajó al pintar el resultado. Si el teléfono acepta archivos, va primero con la imagen; si
 * no, el escalón de siempre. El archivo tiene que llegar **ya bajado**: esperar una descarga
 * entre el toque y `navigator.share` pierde el gesto en Safari.
 *
 * ## Cancelar es cancelar
 *
 * Hasta el ciclo 18, cerrar el menú del sistema sin elegir nada caía al respaldo: copiaba el
 * enlace y avisaba "Se copió", que nadie había pedido. Ahora un `AbortError` —la persona
 * canceló— termina ahí, y el botón queda desactivado mientras el menú está abierto: un
 * segundo toque daba `InvalidStateError` y hacía lo mismo.
 *
 * Nada se escribe con `innerHTML`, igual que en el resto de las islas.
 */

import { incrustado, postearEnX } from './en-x.ts';

export interface TextosDeCompartir {
  /** El rótulo del botón. Lleva tilde (`Compartí`), y la letra de la firma la tiene desde `D-65`. */
  readonly compartir: string;
  readonly copiado: string;
  readonly aManoTitulo: string;
}

export interface LoQueSeComparte {
  readonly texto: string;
  readonly url: string;
  /** La imagen, si el juego tiene tarjeta y ya está bajada. */
  readonly archivo?: File | null;
}

function el(tag: string, clase: string, texto?: string): HTMLElement {
  const n = document.createElement(tag);
  n.className = clase;
  if (texto !== undefined) n.textContent = texto;
  return n;
}

/**
 * El botón y la caja donde cae lo que compartir tenga para decir. Se devuelven los dos
 * para que cada juego los ponga en su lugar; la caja existe vacía desde el arranque
 * (`.compartir-salida:empty` no ocupa lugar) y **se reemplaza, nunca se apila**.
 *
 * `armar` se llama al tocar, no al pintar: el enlace sale con la partida terminada.
 */
export function botonCompartir(
  textos: TextosDeCompartir,
  armar: () => LoQueSeComparte,
): { readonly boton: HTMLButtonElement; readonly salida: HTMLElement } {
  const boton = el('button', 'primario firma', textos.compartir) as HTMLButtonElement;
  boton.type = 'button';
  const salida = el('div', 'compartir-salida');
  salida.setAttribute('aria-live', 'polite');
  boton.addEventListener('click', () => {
    if (boton.disabled) return;
    boton.disabled = true;
    void compartir(textos, armar(), salida).finally(() => {
      boton.disabled = false;
    });
  });
  return { boton, salida };
}

/** La persona cerró el menú, o ya había uno abierto: no hay nada que rescatar. */
const cancelo = (e: unknown): boolean =>
  e instanceof DOMException && (e.name === 'AbortError' || e.name === 'InvalidStateError');

async function compartir(textos: TextosDeCompartir, que: LoQueSeComparte, salida: HTMLElement): Promise<void> {
  // Adentro de X, el posteo ya escrito va primero (`en-x.ts`). Antes de cualquier `await`.
  if (incrustado() && postearEnX(que.texto, que.url)) return;
  const conArchivo = que.archivo && navigator.canShare?.({ files: [que.archivo] }) ? que.archivo : null;
  if (conArchivo) {
    try {
      await navigator.share({ files: [conArchivo], text: que.texto, url: que.url });
      return;
    } catch (e) {
      if (cancelo(e)) return;
      // El navegador no quiso la imagen. Sigue el escalón de texto y enlace.
    }
  }
  if (navigator.share) {
    try {
      await navigator.share({ text: que.texto, url: que.url });
      return;
    } catch (e) {
      if (cancelo(e)) return;
      // El navegador no quiso. Cae al respaldo.
    }
  }
  salida.replaceChildren();
  try {
    await navigator.clipboard.writeText(`${que.texto} ${que.url}`);
    salida.append(el('p', 'compartir-aviso', textos.copiado));
  } catch {
    salida.append(el('p', 'compartir-aviso', textos.aManoTitulo));
    salida.append(el('p', 'link', `${que.texto} ${que.url}`));
  }
}
