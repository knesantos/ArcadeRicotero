/**
 * El botón de corrección, compartido por los juegos. `T-153`.
 *
 * Implementa `BR-21` (qué promete el sitio), `CTR-10` (el payload y los transportes),
 * `CNT-12` (el texto) y `UX-09` (dónde vive y cómo se comporta).
 *
 * ## Por qué existe
 *
 * Es la primera de las tres mitigaciones de **`D-25`**, la decisión de sacar `US-03` con
 * letras de fuente única sin que nadie las haya cotejado. El usuario lo dijo así: *"si hay
 * que cambiar algo lo veo jugando el juego"*. Este archivo convierte esa intención en un
 * mecanismo, y lo extiende a cualquiera que juegue — no solo a quien mantiene el sitio.
 *
 * ## La regla que atraviesa todo el archivo
 *
 * **La confirmación solo puede confirmar el hecho mecánico.** `BR-21` apartado 2: se
 * copió, se abrió el mail, está a la vista. **Nunca** un estado de revisión que el sitio
 * no tiene cómo sostener. Por eso los textos salen de `CONFIRMACION` indexado por el
 * `resultado` que devuelve el transporte, y no de una cadena escrita acá.
 *
 * Y nada se escribe con `innerHTML`, igual que en el resto de las islas.
 */

import { armar, type Correccion } from '../lib/correccion/armar.ts';
import { disponibles, enviar, type Via } from '../lib/correccion/transporte.ts';
import { CORRECCION, SALIDA, CONFIRMACION, RECORTADO } from '../lib/correccion/copy.ts';

type DatosDelItem = Omit<Correccion, 'contrato' | 'v' | 'deberiaDecir'>;

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  clase?: string,
  texto?: string,
): HTMLElementTagNameMap[K] {
  const n = document.createElement(tag);
  if (clase) n.className = clase;
  if (texto !== undefined) n.textContent = texto;
  return n;
}

/**
 * El disparador: enlace secundario, **después de `Seguí` y afuera del panel de respuesta**.
 *
 * `UX-09` fijó las dos cosas, y la segunda importa más de lo que parece: el panel de
 * respuesta es `role="status"`, una región viva que se lee sola. Meterle un control
 * adentro repetiría el defecto que `UX-01` ya evitó una vez sacando `SEGUÍ` de ahí — el
 * lector de pantalla anunciaría "Corregí esto, botón" mezclado con el resultado.
 *
 * **No lleva la fricción del botón de retirada** (esquina lejana, confirmación de dos
 * pasos), y `UX-09` lo fundamentó: allá un toque accidental termina la partida; acá abre
 * un panel que se cierra. Transplantar la fricción sería cobrar un costo que no existe.
 */
export function botonCorreccion(datos: () => DatosDelItem): HTMLElement {
  const caja = el('p', 'correccion');
  const b = el('button', 'correccion-disparador', CORRECCION.disparador);
  b.type = 'button';
  b.addEventListener('click', () => abrirPanel(caja, datos()));
  caja.append(b);
  return caja;
}

function abrirPanel(ancla: HTMLElement, datos: DatosDelItem): void {
  const previo = ancla.querySelector('.correccion-panel');
  if (previo) return;

  const panel = el('div', 'correccion-panel');
  panel.setAttribute('role', 'group');
  panel.setAttribute('aria-label', CORRECCION.titulo);

  const titulo = el('p', 'correccion-titulo', CORRECCION.titulo);
  titulo.id = 'correccion-titulo';
  panel.append(titulo);
  panel.append(el('p', 'tenue', CORRECCION.instruccion));

  const etiqueta = el('label', 'correccion-etiqueta', CORRECCION.etiquetaCampo);
  etiqueta.htmlFor = 'correccion-texto';
  panel.append(etiqueta);

  const campo = el('textarea', 'correccion-campo');
  campo.id = 'correccion-texto';
  campo.rows = 3;
  campo.placeholder = CORRECCION.ejemplo;
  panel.append(campo);

  // La línea de no-promesa va junto a las salidas, que es donde se decide mandar.
  panel.append(el('p', 'correccion-nota', CORRECCION.noPromesa));

  const salidas = el('div', 'correccion-salidas');
  const vias = disponibles();
  for (const via of vias) {
    // El componente no nombra transportes: los pide y busca su etiqueta por clave.
    const b = el('button', 'secundario', SALIDA[via]);
    b.type = 'button';
    b.addEventListener('click', () => void mandar(panel, datos, campo, via));
    salidas.append(b);
  }
  panel.append(salidas);

  const cerrar = el('button', 'correccion-cerrar', CORRECCION.cerrar);
  cerrar.type = 'button';
  cerrar.addEventListener('click', () => {
    panel.remove();
    ancla.querySelector<HTMLButtonElement>('.correccion-disparador')?.focus();
  });
  panel.append(cerrar);

  ancla.append(panel);
  // El foco aterriza en el **título**, no en el campo (`UX-09`): quien usa lector de
  // pantalla necesita saber qué está corrigiendo antes de que le pidan que escriba.
  // Es el mismo patrón que `enfocar(enunciado)` en el resto del sitio.
  titulo.tabIndex = -1;
  titulo.focus();
}

async function mandar(
  panel: HTMLElement,
  datos: DatosDelItem,
  campo: HTMLTextAreaElement,
  via: Via,
): Promise<void> {
  const texto = campo.value.trim();
  if (!texto) {
    campo.focus();
    return;
  }

  const correccion = armar({ ...datos, deberiaDecir: texto });
  const entrega = await enviar(correccion, via);

  // Se reemplaza el panel por la confirmación: el hecho mecánico y nada más.
  panel.replaceChildren();
  const aviso = el('p', 'correccion-confirmacion', CONFIRMACION[entrega.resultado] ?? CORRECCION.sinVias);
  aviso.setAttribute('role', 'status');
  panel.append(aviso);
  if (entrega.recortado) panel.append(el('p', 'tenue', RECORTADO));

  // `a-la-vista` es el piso de `D-14`: si no hubo mail ni portapapeles, el texto queda
  // en pantalla, seleccionable, para llevarlo a mano adonde sea.
  if (entrega.resultado === 'a-la-vista' || entrega.resultado === 'no-pudo') {
    const pre = el('pre', 'correccion-texto', entrega.texto);
    pre.tabIndex = 0;
    panel.append(pre);
  }

  const cerrar = el('button', 'correccion-cerrar', CORRECCION.cerrarSolo);
  cerrar.type = 'button';
  cerrar.addEventListener('click', () => {
    const ancla = panel.parentElement;
    panel.remove();
    ancla?.querySelector<HTMLButtonElement>('.correccion-disparador')?.focus();
  });
  panel.append(cerrar);
  aviso.tabIndex = -1;
  aviso.focus();
}
