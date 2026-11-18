/**
 * La vidriera de Skayboy y Poligirl (ronda de pulida de los juegos, 2026-11-18): **lo que pasa
 * en el tubo mientras nadie tocó Jugá.** Es el modo de exhibición de un fichín: los dos, en su
 * entrada, saltan de a uno, dan unos pasos hacia el otro y vuelven.
 *
 * ## Lo que no es
 *
 * - **No es la solución.** La traza grabada de cada nivel no viaja al teléfono (`ADR-09.2`,
 *   regla 10 de `soluciones.test.ts`), y además sería contarle el nivel al que todavía no lo jugó.
 *   Este módulo no importa `soluciones.ts`, y su guion es el mismo para los doce niveles.
 * - **No es la partida.** Corre sobre **un mundo aparte**, armado con `crearMundo()`; el mundo
 *   que el botón grande va a jugar no se toca, y sigue en el cuadro cero (`momentoDe()` sigue
 *   diciendo `entrada`). Lo que pasa acá no se guarda, no suena y no se le avisa a nadie.
 * - **No toca nada.** Antes de mostrarse, el guion se ensaya entero sobre ese nivel
 *   (`guionPara()`): si en el ensayo alguien junta un favorito, vuelve a la entrada, mueve una
 *   caja, cruza una palanca, pisa una placa o no termina donde empezó, se prueba el guion sin
 *   pasos —solo saltos en el lugar—, después el de uno solo, y si ninguno sale limpio, no hay vidriera. Así el tubo de la
 *   portada muestra el nivel como es, y al tocar Jugá no cambió nada de lugar.
 *
 * ## El mismo paso que la partida (`ADR-09.1`)
 *
 * El tiempo del motor se reparte en cuadros enteros con `repartirEnCuadros()` y cada cuadro es un
 * `paso(…, CUADRO_SEG)`: la misma física, con los mismos números. No se usa `jugarTic()` porque
 * acá cada cuadro lleva su propio mando —el del guion—, y un tic puede traer más de un cuadro.
 *
 * ## Atada al estado
 *
 * Da `VUELTAS` vueltas y se queda quieta, con los dos parados en su entrada: un fichín que nadie
 * mira no baila toda la noche. Con movimiento reducido la isla ni la arma.
 */

import {
  CUADRO_SEG,
  PERSONAJES,
  QUIETO,
  crearMundo,
  crearReloj,
  paso,
  repartirEnCuadros,
  type Mando,
  type Mandos,
  type Mundo,
  type Reloj,
  type Suceso,
} from './mundo.ts';
import type { Banco, IdPersonaje, Nivel } from './niveles.ts';

/** Cuántos cuadros dura una vuelta del guion: siete segundos. */
export const CUADROS_POR_VUELTA = 420;

/** Cuántas vueltas da antes de quedarse quieta. */
export const VUELTAS = 4;

/** Un tramo del guion: quién, qué tecla, desde qué cuadro y hasta cuál (sin incluirlo). */
interface Tramo {
  readonly quien: IdPersonaje;
  readonly tecla: 'saltar' | 'hacia' | 'desde';
  readonly de: number;
  readonly a: number;
}

/** Los saltos en el lugar: uno, la otra, y al final los dos juntos. */
const SALTOS: readonly Tramo[] = [
  { quien: 'skayboy', tecla: 'saltar', de: 40, a: 70 },
  { quien: 'poligirl', tecla: 'saltar', de: 110, a: 140 },
  { quien: 'skayboy', tecla: 'saltar', de: 372, a: 402 },
  { quien: 'poligirl', tecla: 'saltar', de: 372, a: 402 },
];

/** Los pasos: cada uno camina hacia el otro un cuarto de segundo, espera, y vuelve. */
const PASOS: readonly Tramo[] = [
  { quien: 'skayboy', tecla: 'hacia', de: 190, a: 205 },
  { quien: 'skayboy', tecla: 'desde', de: 228, a: 243 },
  { quien: 'poligirl', tecla: 'hacia', de: 280, a: 295 },
  { quien: 'poligirl', tecla: 'desde', de: 318, a: 333 },
];

/** Los guiones, del más vivo al más quieto. Los dos últimos son para el nivel donde uno, saltando, toca algo. */
export const GUIONES = ['con-pasos', 'solo-saltos', 'salta-poligirl', 'salta-skayboy'] as const;
export type Guion = (typeof GUIONES)[number];

const TRAMOS: Readonly<Record<Guion, readonly Tramo[]>> = {
  'con-pasos': [...SALTOS, ...PASOS],
  'solo-saltos': SALTOS,
  'salta-poligirl': SALTOS.filter((t) => t.quien === 'poligirl'),
  'salta-skayboy': SALTOS.filter((t) => t.quien === 'skayboy'),
};

/**
 * Los mandos del guion en ese cuadro de la vuelta. `haciaElOtro` es para qué lado tiene cada uno
 * al otro al empezar: caminar "hacia" es para ese lado, y "desde", para el contrario.
 */
export function mandosDelGuion(guion: Guion, cuadro: number, haciaElOtro: Readonly<Record<IdPersonaje, -1 | 1>>): Mandos {
  const mandos: Record<IdPersonaje, Mando> = { skayboy: QUIETO, poligirl: QUIETO };
  for (const t of TRAMOS[guion]) {
    if (cuadro < t.de || cuadro >= t.a) continue;
    const m = { ...mandos[t.quien] };
    if (t.tecla === 'saltar') m.saltar = true;
    else {
      const lado = t.tecla === 'hacia' ? haciaElOtro[t.quien] : -haciaElOtro[t.quien];
      if (lado > 0) m.derecha = true;
      else m.izquierda = true;
    }
    mandos[t.quien] = m;
  }
  return mandos;
}

function ladosDe(mundo: Mundo): Record<IdPersonaje, -1 | 1> {
  const s = mundo.cuerpos.skayboy.x;
  const p = mundo.cuerpos.poligirl.x;
  return { skayboy: p >= s ? 1 : -1, poligirl: s > p ? 1 : -1 };
}

/** La sala, en lo que el guion no puede cambiar: dónde está cada uno y cada pieza. */
function huella(mundo: Mundo): string {
  return JSON.stringify({
    cuerpos: PERSONAJES.map((id) => [Math.round(mundo.cuerpos[id].x * 100), Math.round(mundo.cuerpos[id].y * 100), mundo.cuerpos[id].enSuelo]),
    juntados: [...mundo.juntados].sort(),
    palancas: mundo.palancas.map((p) => p.activa),
    placas: mundo.placas.map((l) => l.pisada),
    compuertas: mundo.compuertas.map((g) => g.abierta),
    cajas: mundo.cajas.map((k) => [k.columna, k.fila, k.estado]),
  });
}

/**
 * **Si ese guion pasa por ese nivel sin tocar nada**: una vuelta entera, ensayada. Lo único que
 * puede pasar es saltar; cualquier otro suceso, una caja que se mueve en cualquier cuadro, o
 * terminar distinto de como se empezó, y el guion no sirve para ese nivel.
 */
export function guionLimpio(banco: Banco, nivel: Nivel, guion: Guion): boolean {
  const mundo = crearMundo(banco, nivel);
  const lados = ladosDe(mundo);
  const alEmpezar = huella(mundo);
  for (let cuadro = 0; cuadro < CUADROS_POR_VUELTA; cuadro++) {
    const sucesos = paso(mundo, mandosDelGuion(guion, cuadro, lados), CUADRO_SEG);
    if (sucesos.some((s) => s.tipo !== 'salto')) return false;
    if (mundo.cajas.some((k) => k.estado !== 'quieta')) return false;
    if (mundo.terminado) return false;
  }
  return huella(mundo) === alEmpezar;
}

/** El guion que le toca a ese nivel: el más vivo de los que salen limpios, o ninguno. */
export function guionPara(banco: Banco, nivel: Nivel): Guion | null {
  return GUIONES.find((guion) => guionLimpio(banco, nivel, guion)) ?? null;
}

export interface Vidriera {
  readonly banco: Banco;
  readonly nivel: Nivel;
  readonly guion: Guion;
  readonly lados: Readonly<Record<IdPersonaje, -1 | 1>>;
  readonly reloj: Reloj;
  /** El mundo que se dibuja. Se cambia por uno nuevo al terminar cada vuelta. */
  mundo: Mundo;
  cuadro: number;
  vueltas: number;
}

/** La vidriera de ese nivel, o `null` si ningún guion pasa limpio por él. */
export function crearVidriera(banco: Banco, nivel: Nivel): Vidriera | null {
  const guion = guionPara(banco, nivel);
  if (guion === null) return null;
  const mundo = crearMundo(banco, nivel);
  return { banco, nivel, guion, lados: ladosDe(mundo), reloj: crearReloj(), mundo, cuadro: 0, vueltas: 0 };
}

/** Si todavía le quedan vueltas. Terminadas, queda quieta en el cuadro cero de un mundo nuevo. */
export function vidrieraViva(v: Vidriera): boolean {
  return v.vueltas < VUELTAS;
}

/**
 * Avanza la vidriera el tiempo que trajo el motor, en cuadros enteros, y devuelve lo que pasó en
 * ellos —para el polvo, no para el sonido—. Al terminar una vuelta el mundo se cambia por uno
 * recién armado: el ensayo ya dijo que es igual, y así no se acumula ni un redondeo.
 */
export function avanzarVidriera(v: Vidriera, dt: number): readonly Suceso[] {
  if (!vidrieraViva(v)) return [];
  const reparto = repartirEnCuadros(v.reloj.acumulado, dt);
  v.reloj.acumulado = reparto.acumulado;
  const sucesos: Suceso[] = [];
  for (let i = 0; i < reparto.cuadros; i++) {
    sucesos.push(...paso(v.mundo, mandosDelGuion(v.guion, v.cuadro, v.lados), CUADRO_SEG));
    v.cuadro++;
    if (v.cuadro >= CUADROS_POR_VUELTA) {
      v.cuadro = 0;
      v.vueltas++;
      v.mundo = crearMundo(v.banco, v.nivel);
      break;
    }
  }
  return sucesos;
}
