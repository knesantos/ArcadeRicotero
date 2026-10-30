/**
 * El piso de cada tramo del camino, con sus bichos (`D-73`, séptima vuelta; `D-77`).
 *
 * El piso es la capa que va a la par del dedo: la de los bichos. Lo arma la página en build, y la
 * isla (`scripts/camino.ts`) lo mueve. Hay tres formas, las de `camino.ts`:
 *
 * - **largo** (el monte y la pastura): el piso impreso, los ojos que aparecen al llegar, el lobo
 *   hundido detrás del borde, y en la pastura el claro del recinto corrido adentro del piso.
 * - **entorno** (los seis de la décima vuelta): el piso impreso a lo largo y los mismos bichos del
 *   recinto (`rig-entornos.ts`), corridos con `k` como corre el dibujo sus cosas fijas.
 * - **recinto** (los cinco de títeres): la escena del recinto, entera, la misma del bestiario, con
 *   el ancho de su recinto (`MARCO_DEL_RECINTO` en `rig.ts`).
 *
 * Los dos últimos terminan en la pieza del cruce, que no se toca: los bichos de abajo se tocan igual.
 */

import { rutaDePieza, type Pieza } from './aerografo.ts';
import { PIEZAS_CAMINO, cajaDelCruce } from './arte-camino.ts';
import { K_ENTORNO, RECINTO, type Tramo } from './camino.ts';
import { escenaBajo, escenaBaldio, escenaInfierno, escenaPrision, escenaTemplo, ojos, type Tinta } from './escenas.ts';
import { cosa, VELOCIDAD_DE_CARRIL } from './escenas-entornos.ts';
import { capasCorridas, capasDe, fierroDe, sinTitere, type Personaje } from './elenco.ts';
import { vacaEnElClaro } from './escena-vaca.ts';
import { ARMADO } from './recortes.ts';
import { ACECHO, ACHATE, ESCALA_CORDERO, ESCALA_LOBO, PALO, marcoDelRecinto, profundidad } from './rig.ts';
import {
  ALTO, COSAS_DE_CYBERSIBERIA, COSAS_DE_LA_MESA, COSAS_DE_LA_RUTA, COSAS_DE_LOS_ASTILLEROS, COSAS_DEL_ARBOL, COSAS_DEL_GALPON, FIERROS,
  OJOS_DE_CYBERSIBERIA, OJOS_DE_LA_MESA, OJOS_DE_LA_RUTA, OJOS_DE_LOS_ASTILLEROS, OJOS_DEL_ARBOL, OJOS_DEL_GALPON, RUTA,
  type Cosa,
} from './rig-entornos.ts';
import { cordero, imagen, lobo } from './titeres.ts';

type Nombres = ReadonlyMap<string, string>;

const f = (v: number): string => (Math.round(v * 10) / 10).toString();

/** Una pieza impresa del camino, en su caja. `quieta`: no se toca, los toques pasan de largo. */
export function imagenDePieza(p: Pieza, quieta = false): string {
  const [x, y, ancho, alto] = p.caja;
  return `<image href="${rutaDePieza(p.nombre)}" x="${x}" y="${y}" width="${ancho}" height="${alto}" preserveAspectRatio="none"${quieta ? ' pointer-events="none"' : ''}/>`;
}

const piezaDelCamino = (nombre: string): Pieza => {
  const p = PIEZAS_CAMINO.find((q) => q.nombre === nombre);
  if (!p) throw new Error(`no hay pieza "${nombre}" en arte-camino.ts`);
  return p;
};

/** Unos ojos en lo oscuro, envueltos para que la isla los haga aparecer al llegar. */
const ojosQueAparecen = (lugares: Readonly<Record<string, readonly [number, number, Tinta]>>, nombres: Nombres, dx = 0, k = 1): string =>
  Object.entries(lugares)
    .map(([b, [x, y, t]]) => `<g class="aparece" data-x="${f(x * k + dx)}">${ojos(b, nombres.get(b) ?? b, Math.round(x * k + dx), y, t)}</g>`)
    .join('');

/** La pieza del cruce, al final de la escena: no se toca. */
const cruce = (t: Tramo): string => {
  const [x, y, ancho, alto] = cajaDelCruce(t);
  return `<image href="${rutaDePieza(t.piezas.cruce!)}" x="${x}" y="${y}" width="${ancho}" height="${alto}" preserveAspectRatio="none" pointer-events="none"/>`;
};

/* ------------------------------------------------------------------
   El monte y la pastura (séptima vuelta)
   ------------------------------------------------------------------ */

/**
 * La pose quieta de los títeres, puesta desde el HTML: es la que se ve sin JavaScript (el lobo
 * asomado, el cordero al lado del palo). Con la isla andando, la isla la pisa en el primer cuadro.
 */
const AL = ARMADO.lobo;
const AC = ARMADO.cordero;
const poseDelLobo = (x: number): string =>
  `translate(${x} ${ACECHO.piso}) scale(${ESCALA_LOBO}) translate(${-AL.piso[0]} ${-AL.piso[1]})`;
const poseDelCordero = (): string => {
  const x = PALO.x + 24;
  const y = PALO.y + 18 * ACHATE;
  const e = (ESCALA_CORDERO * profundidad(y)).toFixed(4);
  return `translate(${x} ${y.toFixed(1)}) scale(${e}) translate(${-AC.piso[0]} ${-AC.piso[1]})`;
};
const titereLobo = (x: number, nombres: Nombres): string =>
  `<g class="titere titere--lobo" data-id="el-lobo-suelto" role="button" tabindex="0" aria-label="${nombres.get('el-lobo-suelto')}" transform="${poseDelLobo(x)}">${lobo()}</g>`;

/**
 * El piso largo, que es la capa de los bichos. De atrás para adelante: el lobo hundido (asoma desde
 * atrás del borde del piso), el piso, y los que están parados en él. En la pastura, el claro va
 * corrido `dx` y adentro valen las coordenadas del recinto: la isla mueve al lobo y al cordero
 * con la misma lógica que en el bestiario.
 */
function pisoLargo(t: Tramo, nombres: Nombres): string {
  const piso = imagenDePieza(piezaDelCamino(t.piezas.piso!));
  const claro = t.claro;
  if (!claro) {
    // Los del elenco que viven en el tramo (tu animal, en el monte) van donde estaban sus ojos, corridos enteros.
    const dxDe = (p: Personaje): number => (t.ojos[p.id]?.[0] ?? p.ancla) - p.ancla;
    // Y bajan lo que haga falta para pisar el piso del camino, que está más abajo que la ladera del recinto.
    const dyDe = (p: Personaje): number => t.bajan?.[p.id] ?? 0;
    return (
      capasCorridas(t.region, 'atras', nombres, dxDe, dyDe) +
      `<g class="acecho">${t.lobo ? titereLobo(t.lobo.x, nombres) : ''}</g>` + piso + ojosQueAparecen(sinTitere(t.ojos), nombres) +
      capasCorridas(t.region, 'figura', nombres, dxDe, dyDe) +
      capasCorridas(t.region, 'delante', nombres, dxDe, dyDe)
    );
  }
  return (
    `<g class="acecho" transform="translate(${claro.dx} 0)">${titereLobo(560, nombres)}</g>` +
    piso +
    `<g class="claro" transform="translate(${claro.dx} 0)">` +
    ojosQueAparecen(claro.ojos, nombres, claro.dx) +
    `<path id="soga" class="bt-trazo-soga" stroke-width="2.8" d="M${PALO.x} ${PALO.y - 46} L${PALO.x + 40} ${PALO.y}"/>` +
    `<g class="actores"><g class="titere titere--cordero" data-id="el-cordero-atado" role="button" tabindex="0" aria-label="${nombres.get('el-cordero-atado')}" transform="${poseDelCordero()}">${cordero()}</g></g>` +
    vacaEnElClaro(nombres.get('aquella-solitaria-vaca-cubana') ?? '') +
    `</g>`
  );
}

/* ------------------------------------------------------------------
   Los seis entornos, a lo largo
   ------------------------------------------------------------------ */

const HABITANTES: Readonly<Record<string, { ojos: Readonly<Record<string, readonly [number, number, Tinta]>>; cosas: Readonly<Record<string, Cosa>> }>> = {
  'el-galpon': { ojos: OJOS_DEL_GALPON, cosas: COSAS_DEL_GALPON },
  'el-arbol': { ojos: OJOS_DEL_ARBOL, cosas: COSAS_DEL_ARBOL },
  cybersiberia: { ojos: OJOS_DE_CYBERSIBERIA, cosas: COSAS_DE_CYBERSIBERIA },
  'los-astilleros': { ojos: OJOS_DE_LOS_ASTILLEROS, cosas: COSAS_DE_LOS_ASTILLEROS },
  'la-mesa': { ojos: OJOS_DE_LA_MESA, cosas: COSAS_DE_LA_MESA },
  'la-ruta': { ojos: OJOS_DE_LA_RUTA, cosas: COSAS_DE_LA_RUTA },
};

/**
 * Un fierro que pasa, como en el recinto de la ruta (`escenas-entornos.ts`), corrido a lo largo.
 * La imagen, el toque y la marca van adentro de `.cuerpo`, así viajan juntos.
 */
function fierro(id: string, nombre: string): string {
  const { pieza, carril, caja } = FIERROS[id as keyof typeof FIERROS];
  const x = Math.round(FIERROS[id as keyof typeof FIERROS].x * K_ENTORNO);
  const y = RUTA.carriles[carril];
  const arriba = y + caja[1] + caja[3] * 0.35;
  return (
    `<g class="bestia bestia--fierro" data-id="${id}" data-x="${x}" data-y="${f(arriba)}" data-velocidad="${VELOCIDAD_DE_CARRIL[carril]}" role="button" tabindex="0" aria-label="${nombre}">` +
    `<g class="cuerpo">` +
    `<circle class="toque" cx="${x}" cy="${f(y - 40)}" r="56"/>` +
    `<g transform="translate(${x} ${y})">${fierroDe(id) ?? imagen(pieza)}</g>` +
    `<g class="marca-anotada" transform="translate(${x + 40} ${f(arriba - 10)})"><circle r="6" class="b-pp b-borde"/><path d="M-3 0 l2 2.5 l4 -5" class="b-tz" stroke-width="2"/></g>` +
    `</g></g>`
  );
}

function pisoDeEntorno(t: Tramo, nombres: Nombres): string {
  // Los del elenco que ya tienen títere no van como ojos ni como cosa: van en sus capas, corridas con k.
  const { ojos: todos, cosas: todas } = HABITANTES[t.region]!;
  const [losOjos, cosas] = [sinTitere(todos), sinTitere(todas)];
  const quietas = t.region === 'la-ruta';
  const lasCosas = Object.entries(cosas)
    .map(([id, [x, y, r]]) => cosa(id, nombres.get(id) ?? id, [Math.round(x * K_ENTORNO), y, r], quietas))
    .join('');
  // En la ruta, lo que espera en la banquina no se mueve con el tránsito (`data-quieto`).
  const ojosDelEntorno = ojosQueAparecen(losOjos, nombres, 0, K_ENTORNO);
  let extra = '';
  if (t.region === 'la-ruta') {
    const porCarril = (c: number): string =>
      Object.keys(FIERROS)
        .filter((id) => FIERROS[id as keyof typeof FIERROS].carril === c)
        .map((id) => fierro(id, nombres.get(id) ?? id))
        .join('');
    // Los fierros se pierden en la noche del cruce y vuelven a entrar por la izquierda.
    extra =
      `<clipPath id="camino-ruta"><rect x="-10" y="-10" width="${t.escena + 30}" height="${ALTO + 20}"/></clipPath>` +
      `<g class="fierros" clip-path="url(#camino-ruta)">${porCarril(0)}${porCarril(1)}</g>`;
  }
  if (t.region === 'cybersiberia') {
    // La nieve del recinto, una al lado de la otra a lo largo: dos copias, una arriba de la otra.
    let copos = '';
    for (let x = 0; x < t.escena; x += RECINTO) {
      copos += `<g transform="translate(${x} 0)">${imagen('cyber-nieve')}</g><g transform="translate(${x} -640)">${imagen('cyber-nieve')}</g>`;
    }
    extra = `<g class="cyber-nevada" pointer-events="none"><g class="cyber-nevada-copos">${copos}</g></g>`;
  }
  return (
    capasDe(t.region, 'atras', nombres, K_ENTORNO) +
    imagenDePieza(piezaDelCamino(t.piezas.piso!)) +
    cruce(t) +
    `<g class="ojos-del-recinto">${quietas ? ojosDelEntorno.replaceAll('class="bestia bestia--ojos"', 'class="bestia bestia--ojos" data-quieto=""') : ojosDelEntorno}${lasCosas}</g>` +
    extra +
    capasDe(t.region, 'figura', nombres, K_ENTORNO) +
    capasDe(t.region, 'delante', nombres, K_ENTORNO)
  );
}

/* ------------------------------------------------------------------
   Los cinco recintos de títeres, enteros
   ------------------------------------------------------------------ */

/** La escena de cada recinto de títeres: la misma del bestiario (`escenas.ts`). */
export const ESCENA_DEL_RECINTO: Readonly<Record<string, (n: Nombres) => string>> = {
  'los-techos': escenaBaldio,
  'el-infierno': escenaInfierno,
  'el-templo': escenaTemplo,
  'el-bajo': escenaBajo,
  'la-prision': escenaPrision,
};

/**
 * El recinto va entero, y el que se agrandó para los dos lados arranca antes del cero
 * (`MARCO_DEL_RECINTO`): se corre para que su borde izquierdo caiga en el principio del piso. Adentro
 * valen las coordenadas del recinto, y la isla las pasa a la pantalla con el marco.
 */
function pisoDeRecinto(t: Tramo, nombres: Nombres): string {
  const { x } = marcoDelRecinto(t.region);
  const corre = x ? ` transform="translate(${-x} 0)"` : '';
  return `<g class="recinto-en-camino" data-recinto="${t.region}"${corre}>${ESCENA_DEL_RECINTO[t.region]!(nombres)}</g>` + cruce(t);
}

/** El piso de un tramo, con todos los que viven en él. */
export function pisoDelCamino(t: Tramo, nombres: Nombres): string {
  if (t.forma === 'largo') return pisoLargo(t, nombres);
  if (t.forma === 'entorno') return pisoDeEntorno(t, nombres);
  return pisoDeRecinto(t, nombres);
}
