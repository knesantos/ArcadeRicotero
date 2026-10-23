/**
 * La vida del elenco de la decimoquinta vuelta (`D-73`): los diez títeres nuevos, uno por entorno
 * (`lib/bestiario/elenco.ts`). Cada uno trae su conducta en su archivo (`<slug>.ts`, al lado de este);
 * acá solo se los encuentra en la escena y se los suma a la vida del recinto.
 *
 * Lo llama `armarRecinto` (`recintos.ts`) para toda escena: la del bestiario, la del camino que mete
 * el recinto entero y el piso largo de los seis entornos. Un personaje se encuentra por sus marcos
 * (`[data-marco="<id>"]`); si en esa escena no está, no se arma.
 *
 * Solo números, como las islas: cada conducta lee su `rig-<slug>.ts` y nada que dibuje.
 */

import type { Contexto, Vida } from './recintos.ts';
import { armarBestiaPop } from './bestia-pop.ts';
import { armarMonito } from './monito.ts';
import { armarBuscapina } from './buscapina.ts';
import { armarPibe } from './pibe.ts';
import { armarCanibal } from './canibal.ts';
import { armarPontiac } from './pontiac.ts';
import { armarDiablo } from './diablo.ts';
import { armarRato } from './rato.ts';
import { armarMorta } from './morta.ts';
import { armarEsclavo } from './esclavo.ts';
import { armarHija } from './hija.ts';
import { armarPsicopata } from './psicopata.ts';
import { armarPorco } from './porco.ts';
import { armarAngel } from './angel.ts';
import { armarPacman } from './pacman.ts';
import { armarMosca } from './mosca.ts';
import { armarVerdugo } from './verdugo.ts';
import { armarSaturno } from './saturno.ts';
import { armarAnimal } from './animal.ts';

/**
 * Lo que la escena le presta a un personaje. Las coordenadas de `hablar` van en las del recinto
 * (900 × 640), como las dibuja `arte-<slug>.ts`: si el camino corrió el marco, acá se suma.
 */
export interface Escenario {
  hablar(id: string, x: number, y: number, abajo?: boolean): void;
  quieto(): boolean;
  reloj(): number;
}

/** Lo que hace un personaje vivo. */
export interface Vivo {
  /** Avanza un cuadro. `t` en segundos, `dt` lo que pasó desde el anterior. Con `dt` 0, la pose quieta. */
  mover(t: number, dt: number): void;
  /** Lo tocaron: si es este personaje reacciona y devuelve `true`; si no, no es suyo. */
  reaccionar(id: string, t: number): boolean;
}

/**
 * Arma a un personaje. `marcos` son sus grupos en la escena (`[data-marco]`), uno por capa, en el
 * orden en que se dibujan; ahí adentro están sus piezas (`[data-parte]`).
 */
export type Armar = (marcos: readonly SVGGElement[], esc: Escenario) => Vivo;

/** La conducta de cada uno: `null` mientras no tenga títere. */
const CONDUCTAS: Readonly<Record<string, Armar | null>> = {
  'la-bestia-pop': armarBestiaPop,
  'el-monito-que-trepa': armarMonito,
  'el-capitan-buscapina': armarBuscapina,
  'el-pibe-de-los-astilleros': armarPibe,
  'el-canibal': armarCanibal,
  'la-mariposa-pontiac': armarPontiac,
  'el-diablo-que-mea-en-todas-partes': armarDiablo,
  'el-rato-molhado': armarRato,
  'el-morta': armarMorta,
  'el-esclavo-sensible-y-chillon': armarEsclavo,
  'la-hija-del-fletero': armarHija,
  'el-buen-psicopata': armarPsicopata,
  'porco-rex': armarPorco,
  'el-angel-de-la-soledad': armarAngel,
  'el-pac-man': armarPacman,
  'la-mosca': armarMosca,
  'el-verdugo-que-cena': armarVerdugo,
  'el-doctor-saturno': armarSaturno,
  'tu-animal': armarAnimal,
};

/** Los ids que tienen conducta: el test mira que coincidan con los que tienen dibujo. */
export const CON_CONDUCTA: readonly string[] = Object.keys(CONDUCTAS).filter((id) => CONDUCTAS[id]);

/** Suma a la vida de una escena los personajes del elenco que viven en ella. */
export function conElenco(vida: Vida, raiz: ParentNode, ctx: Contexto): Vida {
  const vivos: Vivo[] = [];
  for (const [id, armar] of Object.entries(CONDUCTAS)) {
    if (!armar) continue;
    const marcos = [...raiz.querySelectorAll<SVGGElement>(`[data-marco="${id}"]`)];
    if (!marcos.length) continue;
    const dx = Number(marcos[0]!.dataset.dx ?? 0);
    vivos.push(
      armar(marcos, {
        hablar: (b, x, y, abajo) => ctx.hablar(b, x + dx, y, abajo),
        quieto: ctx.quieto,
        reloj: ctx.reloj,
      }),
    );
  }
  if (!vivos.length) return vida;
  return {
    mover: (t, dt) => {
      vida.mover(t, dt);
      for (const v of vivos) v.mover(t, dt);
    },
    // Si ninguno del elenco lo reconoce como suyo, reacciona el recinto (los ojos, los fierros).
    reaccionar: (id, t) => {
      if (!vivos.some((v) => v.reaccionar(id, t))) vida.reaccionar(id, t);
    },
  };
}
