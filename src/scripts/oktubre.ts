/**
 * La estampa del cumpleaños de *Oktubre*, en el afiche del portal (`D-49`).
 *
 * El afiche ya viene impreso del build con la estampa del día en que se construyó el sitio.
 * Esto la corrige con la fecha del teléfono de quien mira, que es la que vale: el sitio no
 * se reconstruye todos los días, y "EL 4 CUMPLE 40" leído el 5 sería mentira.
 *
 * Que el afiche se vea o no lo decide la cabeza del portal, antes del primer cuadro; esta
 * isla solo cambia una palabra, así que puede llegar tarde sin que se note.
 */

import { cumpleDelDia, esOktubre } from '../lib/sitio/oktubre.ts';

const estampa = document.querySelector<HTMLElement>('[data-cumple-dia]');
const ahora = new Date();

if (estampa && esOktubre(ahora)) {
  estampa.textContent = cumpleDelDia(ahora, {
    dia: Number(estampa.dataset.cumpleDia),
    anio: Number(estampa.dataset.cumpleAnio),
  });
}
