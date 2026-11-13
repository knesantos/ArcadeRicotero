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
import { mirarVigias } from './vigia.ts';
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
import { armarDinamita } from './dinamita.ts';
import { armarZippo } from './zippo.ts';
import { armarVeloz } from './veloz.ts';
import { armarFumador } from './fumador.ts';
import { armarColgado } from './colgado.ts';
import { armarDesencarnada } from './desencarnada.ts';
import { armarEncadenado } from './encadenado.ts';
import { armarMaton } from './maton.ts';
import { armarAmorcito } from './amorcito.ts';
import { armarSirenas } from './sirenas.ts';
import { armarMandinga } from './mandinga.ts';
import { armarAlien } from './alien.ts';
import { armarChivato } from './chivato.ts';
import { armarGallos } from './gallos.ts';
import { armarAnguila } from './anguila.ts';
import { armarLechuza } from './lechuza.ts';
import { armarAnzuelo } from './anzuelo.ts';
import { armarPiba } from './piba.ts';
import { armarLobas } from './lobas.ts';
import { armarCuernos } from './cuernos.ts';
import { armarSapito } from './sapito.ts';
import { armarRapaz } from './rapaz.ts';
import { armarRaton } from './raton.ts';
import { armarPolilla } from './polilla.ts';
import { armarBotija } from './botija.ts';
import { armarJocker } from './jocker.ts';
import { armarRey } from './rey.ts';
import { armarAhogado } from './ahogado.ts';
import { armarPichon } from './pichon.ts';
import { armarMantis } from './mantis.ts';
import { armarCielo } from './cielo.ts';
import { armarGarufa } from './garufa.ts';
import { armarJoven } from './joven.ts';
import { armarReo } from './reo.ts';
import { armarMoscon } from './moscon.ts';
import { armarOvejero } from './ovejero.ts';

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
  'mi-perro-dinamita': armarDinamita,
  'zippo': armarZippo,
  'el-diablo-mas-veloz': armarVeloz,
  'el-santo-fumador': armarFumador,
  'el-que-duerme-colgado': armarColgado,
  'la-bella-senora-desencarnada': armarDesencarnada,
  'el-esclavo-encadenado': armarEncadenado,
  'el-gato-maton': armarMaton,
  'el-amorcito-que-mordio-el-vidrio': armarAmorcito,
  'las-sirenas': armarSirenas,
  'mandinga': armarMandinga,
  'el-alien-duce': armarAlien,
  'el-chivato': armarChivato,
  'los-gallos-sofocados': armarGallos,
  'la-anguila': armarAnguila,
  'la-lechuza-que-circula': armarLechuza,
  'el-que-mordio-el-anzuelo': armarAnzuelo,
  'la-piba-de-greenpeace': armarPiba,
  'las-antiguas-lobas': armarLobas,
  'el-diablo-de-muchos-cuernos': armarCuernos,
  'la-princesita-sapito': armarSapito,
  'la-tipa-rapaz': armarRapaz,
  'el-raton': armarRaton,
  'la-polilla': armarPolilla,
  'el-botija-rapado': armarBotija,
  'el-jocker-burlon': armarJocker,
  'el-rey-de-esta-jungla': armarRey,
  'el-ahogado-y-su-fiel-fantasma': armarAhogado,
  'el-pichon': armarPichon,
  'el-club-de-mantis': armarMantis,
  'el-que-no-se-cayo-del-cielo': armarCielo,
  'el-rey-garufa': armarGarufa,
  'el-joven-lobo': armarJoven,
  'el-reo-semental': armarReo,
  'el-moscon-zumbon': armarMoscon,
  'el-ovejero': armarOvejero,
};

/** Los ids que tienen conducta: el test mira que coincidan con los que tienen dibujo. */
export const CON_CONDUCTA: readonly string[] = Object.keys(CONDUCTAS).filter((id) => CONDUCTAS[id]);

/** Cada cuántos cuadros se mira quién del elenco está a la vista: un tercio de segundo. */
export const MIRAR_CADA = 20;

/** Suma a la vida de una escena los personajes del elenco que viven en ella. */
export function conElenco(vida: Vida, raiz: ParentNode, ctx: Contexto): Vida {
  const vivos: Vivo[] = [];
  /** Los marcos de cada uno, y si está a la vista: el que no se ve no se mueve (`D-90`, cuarta ronda). */
  const marcosDe: SVGGElement[][] = [];
  const aLaVista: boolean[] = [];
  let cuadros = 0;
  for (const [id, armar] of Object.entries(CONDUCTAS)) {
    if (!armar) continue;
    const marcos = [...raiz.querySelectorAll<SVGGElement>(`[data-marco="${id}"]`)];
    if (!marcos.length) continue;
    const dx = Number(marcos[0]!.dataset.dx ?? 0);
    marcosDe.push(marcos);
    aLaVista.push(true);
    vivos.push(
      armar(marcos, {
        hablar: (b, x, y, abajo) => ctx.hablar(b, x + dx, y, abajo),
        quieto: ctx.quieto,
        reloj: ctx.reloj,
      }),
    );
  }
  if (!vivos.length && !ctx.seVe) return vida;
  return {
    mover: (t, dt) => {
      // Cada tanto, y antes de que nadie escriba nada en este cuadro (así el navegador no tiene que
      // recalcular a mitad de camino), se mira quién está a la vista. Se miden todos juntos.
      if (ctx.seVe && dt > 0 && cuadros++ % MIRAR_CADA === 0) {
        for (let i = 0; i < vivos.length; i++) aLaVista[i] = marcosDe[i]!.some((m) => ctx.seVe!(m));
        // Y a los títeres grandes del recinto (`vigia.ts`), en la misma lectura.
        mirarVigias(ctx);
      }
      vida.mover(t, dt);
      // La pose quieta (`dt` 0) va para todos; andando, solo para los que se ven.
      for (let i = 0; i < vivos.length; i++) if (dt === 0 || aLaVista[i]) vivos[i]!.mover(t, dt);
    },
    // Si ninguno del elenco lo reconoce como suyo, reacciona el recinto (los ojos, los fierros).
    reaccionar: (id, t) => {
      if (!vivos.some((v) => v.reaccionar(id, t))) vida.reaccionar(id, t);
    },
  };
}
