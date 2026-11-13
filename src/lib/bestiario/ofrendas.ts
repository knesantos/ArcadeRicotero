/**
 * Dónde van las ofrendas del templo (`D-90`, octava ronda).
 *
 * Las velas se imprimen en una sola pieza del ancho del templo (`aire-templo-ofrendas`) y van por
 * encima del piso: si una tanda cae donde hay alguien parado, le tapa las patas. En la séptima ronda
 * los lugares estaban escritos a mano, medidos en la página. Acá salen de los datos de la escena: el
 * ancla de cada títere del elenco (`elenco.ts`) y el lugar de cada vecino sin títere
 * (`VECINOS_DEL_TEMPLO`), corridos como los corre el camino (`marcoDelRecinto`). Si alguien se muda,
 * las velas se corren solas la próxima vez que se imprime.
 */
import { ELENCO } from './elenco.ts';
import { VECINOS_DEL_TEMPLO } from './escenas.ts';
import { marcoDelRecinto } from './rig.ts';

/** Cuánto lugar se le deja a cada lado a un títere del elenco (son anchos, y su ancla no es su medio) y a un vecino. */
export const AIRE_DEL_PARADO = { titere: 120, vecino: 70 } as const;
/** De qué altura para abajo un vecino está parado en el piso, y de cuál para arriba un títere vuela. */
const PISA = 500;
const VUELA = 200;

/** Los que pisan el piso del templo: el medio y el lugar que ocupan a cada lado, en unidades del camino. */
export function paradosEnElTemplo(): readonly (readonly [number, number])[] {
  const corre = -marcoDelRecinto('el-templo').x;
  const elenco = ELENCO.filter((p) => p.region === 'el-templo');
  const deTitere = new Set(elenco.map((p) => p.id));
  const parados: [number, number][] = [];
  for (const p of elenco) {
    // La polilla anda por el aire, contra los focos: no le pisa nada a nadie.
    if ((VECINOS_DEL_TEMPLO[p.id]?.[1] ?? PISA) < VUELA) continue;
    parados.push([p.ancla + corre, AIRE_DEL_PARADO.titere]);
  }
  for (const [id, [x, y]] of Object.entries(VECINOS_DEL_TEMPLO)) {
    if (deTitere.has(id) || y < PISA) continue;
    parados.push([x + corre, AIRE_DEL_PARADO.vecino]);
  }
  return parados.sort((a, b) => a[0] - b[0]);
}

export interface Ofrendas {
  /** Las tandas de adelante: dónde, cuántas velas y si llevan botella. */
  cerca: readonly (readonly [number, number, boolean])[];
  /** La fila de atrás: dónde. */
  lejos: readonly number[];
}

/**
 * Los huecos entre los que están parados, y qué entra en cada uno. `hasta`: dónde termina la escena;
 * de ahí en adelante está el cruce, con sus carteles, y ahí no se le prende una vela a nadie.
 */
export function ofrendasDelTemplo(hasta: number = marcoDelRecinto('el-templo').ancho): Ofrendas {
  const cerca: [number, number, boolean][] = [];
  const lejos: number[] = [];
  let desde = 0;
  const hueco = (a: number, b: number): void => {
    const w = b - a;
    // Cada vela de adelante pide unos 28 de ancho, más el platito.
    const entran = Math.min(5, Math.floor((w - 60) / 28));
    if (w >= 300) {
      cerca.push([Math.round(a + w * 0.3), Math.min(4, entran), true], [Math.round(a + w * 0.75), 3, false]);
      lejos.push(Math.round(a + w * 0.12), Math.round(a + w * 0.52));
    } else if (entran >= 3) {
      cerca.push([Math.round(a + w / 2), entran, cerca.length % 2 === 0]);
      if (w >= 200) lejos.push(Math.round(a + 34), Math.round(b - 34));
    } else if (w >= 50) lejos.push(Math.round(a + w / 2));
  };
  for (const [x, medio] of paradosEnElTemplo()) {
    if (x - medio > desde) hueco(desde, x - medio);
    desde = Math.max(desde, x + medio);
  }
  if (hasta > desde) hueco(desde, hasta);
  return { cerca, lejos };
}
