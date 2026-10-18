/**
 * La vaca cubana en la punta de la pastura, con su cielo (`D-73`).
 *
 * La pastura está en dos lugares: el recinto del monte (`escena-monte.ts`) y el camino con cruces
 * (`pages/redondopedia/bestiario/[region].astro`), corrida adentro del piso largo. Las dos ponen
 * esto adentro del claro, en coordenadas del recinto (`rig.ts`), y la isla lo mueve con
 * `scripts/bestiario/vaca.ts`.
 *
 * De atrás para adelante: la tele de la tapa hecha satélite, que cruza el cielo; la vaca; el pozo
 * con su humo; la estela, el pedazo prendido fuego y el golpe. Lo que solo aparece cuando la tocan
 * arranca con opacidad cero, así sin JavaScript se ve la vaca mirando el satélite y nada más.
 */

import { imagen, vaca } from './titeres.ts';
import { CIELO_VACA as C, VACA } from './rig.ts';

/** Dónde queda quieto el satélite: en lo que se ve sin JavaScript y con movimiento reducido. */
export const SATELITE_QUIETO = { x: 600, y: 92 } as const;

/** La pantalla de la tele, en el marco del satélite: la isla la hace titilar. */
const PANTALLA = 'M-38 -17 L7 -24 L10 21 L-34 28 Z';

export function vacaEnElClaro(nombre: string): string {
  const [ix, iy] = C.impacto;
  return (
    `<g class="vaca-cielo" aria-hidden="true" pointer-events="none">` +
    `<g class="vaca-satelite" transform="translate(${SATELITE_QUIETO.x} ${SATELITE_QUIETO.y}) scale(${C.satelite.escala})">` +
    imagen('vaca-satelite') +
    `<path class="vaca-pantalla" d="${PANTALLA}" opacity="0"/></g></g>` +
    `<g class="titere titere--vaca" data-id="aquella-solitaria-vaca-cubana" role="button" tabindex="0" aria-label="${nombre}" transform="translate(${VACA.x} ${VACA.y}) scale(${VACA.escala})">${vaca()}</g>` +
    `<g class="vaca-golpe" aria-hidden="true" pointer-events="none">` +
    `<g class="vaca-pozo" transform="translate(${ix} ${iy}) scale(${C.pozo})" opacity="0">${imagen('vaca-pozo')}<g class="vaca-humo">${imagen('vaca-humo')}</g></g>` +
    `<path class="vaca-estela" d="M0 0" opacity="0"/>` +
    `<g class="vaca-pedazo" opacity="0">${imagen('vaca-pedazo')}</g>` +
    `<g class="vaca-estallido" opacity="0">${imagen('vaca-estallido')}</g>` +
    `</g>`
  );
}
