/**
 * Dónde se abre la ficha (`D-80`): del lado donde no tapa al bicho que se está mirando.
 *
 * Pedido del usuario: *"que las fichas se abran de una pero sin tapar nunca a la bestia de la ficha,
 * es decir ver dónde la ficha no molesta para ver a la bestia y que se abra ahí"*. En el teléfono la
 * ficha va a lo ancho, así que se elige arriba o abajo, y se achica hasta el lugar que queda libre.
 * En la compu va de costado: izquierda o derecha, y si el bicho igual queda debajo, se pide correr
 * la escena lo justo para que salga.
 *
 * Solo cuentas, con rectángulos en píxeles de la ventana: lo usa `scripts/camino.ts` y lo mira
 * `hoja.test.ts`.
 */

export interface Caja {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export type Lado = 'arriba' | 'abajo' | 'izquierda' | 'derecha';

export interface Lugar {
  lado: Lado;
  /** El alto máximo de la ficha, en píxeles, cuando va arriba o abajo. */
  alto?: number;
  /** Cuánto correr la escena, en píxeles (positivo: el bicho se va para la izquierda). */
  correr: number;
}

/** El aire entre la ficha y el bicho, y entre la ficha y el borde. */
const AIRE = 12;
/** La ficha nunca más chica que esto del alto de la vista: con menos no se lee. */
const MINIMO = 0.26;
/** Ni más grande que esto: la escena tiene que seguir ahí. */
const MAXIMO = 0.46;

/**
 * El lugar de la ficha. `bicho`: la caja del bicho en pantalla. `vista`: la de la escena. `ancha`: si
 * la ficha va de costado (la compu). `ancho`: el de la ficha de costado. `tope`: hasta dónde llega el
 * renglón de arriba del camino, que la ficha no pisa.
 */
export function lugarDeLaFicha(bicho: Caja, vista: Caja, ancha: boolean, ancho: number, tope: number): Lugar {
  if (ancha) {
    const izquierda = bicho.left - vista.left;
    const derecha = vista.right - bicho.right;
    const lado: Lado = derecha >= izquierda ? 'derecha' : 'izquierda';
    const libre = lado === 'derecha' ? derecha : izquierda;
    const falta = ancho + AIRE * 2 - libre;
    // Si no entra, el bicho se corre para el lado contrario a la ficha.
    const correr = falta > 0 ? (lado === 'derecha' ? falta : -falta) : 0;
    return { lado, correr };
  }
  const alto = vista.bottom - vista.top;
  const arriba = bicho.top - Math.max(vista.top, tope);
  const abajo = vista.bottom - bicho.bottom;
  const lado: Lado = abajo >= arriba ? 'abajo' : 'arriba';
  const libre = (lado === 'abajo' ? abajo : arriba) - AIRE * 2;
  return { lado, alto: Math.round(Math.min(alto * MAXIMO, Math.max(alto * MINIMO, libre))), correr: 0 };
}
