/**
 * La estampa del cumpleaños en el afiche del mes, en el portal (`D-84`; antes `D-49`).
 *
 * Los afiches vienen impresos del build con la estampa del día en que se construyó el sitio.
 * Esto la corrige con la fecha del teléfono de quien mira, que es la que vale: el sitio no se
 * reconstruye todos los días, y "EL 19 CUMPLE 33" leído el 20 sería mentira.
 *
 * Qué afiche se ve lo decide la cabeza del portal, antes del primer cuadro; esta isla solo
 * cambia una palabra en el afiche del mes, así que puede llegar tarde sin que se note.
 */

import { cumpleDelDia, mesDe } from '../lib/sitio/almanaque.ts';

const ahora = new Date();
const estampa = document.querySelector<HTMLElement>(`.afiche--${mesDe(ahora)} [data-cumple-dia]`);

if (estampa) {
  estampa.textContent = cumpleDelDia(ahora, {
    dia: Number(estampa.dataset.cumpleDia),
    anio: Number(estampa.dataset.cumpleAnio),
  });
}
