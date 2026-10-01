/**
 * Compartir un resultado con su enlace de desafío, para los juegos que no tienen tarjeta.
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
 * Nada se escribe con `innerHTML`, igual que en el resto de las islas.
 */

export interface TextosDeCompartir {
  /** El rótulo del botón. Lleva tilde (`Compartí`), así que va con `con-tilde`. */
  readonly compartir: string;
  readonly copiado: string;
  readonly aManoTitulo: string;
}

export interface LoQueSeComparte {
  readonly texto: string;
  readonly url: string;
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
  const boton = el('button', 'primario firma con-tilde', textos.compartir) as HTMLButtonElement;
  boton.type = 'button';
  const salida = el('div', 'compartir-salida');
  salida.setAttribute('aria-live', 'polite');
  boton.addEventListener('click', () => void compartir(textos, armar(), salida));
  return { boton, salida };
}

async function compartir(textos: TextosDeCompartir, que: LoQueSeComparte, salida: HTMLElement): Promise<void> {
  if (navigator.share) {
    try {
      await navigator.share({ text: que.texto, url: que.url });
      return;
    } catch {
      // Canceló, o el navegador no quiso. Cae al respaldo.
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
