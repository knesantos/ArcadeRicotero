/**
 * El almanaque del portal (`D-84`): un mes, un afiche.
 *
 * Nació como el afiche de octubre (`D-49`, `oktubre.ts`) y el mecanismo era general desde el
 * primer día: lo prende la fecha de quien mira, y lo que dice sale de las fichas de la
 * Redondopedia, no de alguien que se acuerde. Acá viven los dos trabajos puros, y los dos son
 * puros de verdad: no leen archivos ni la hora por su cuenta. El portal les pasa las fichas en
 * el build y la isla les pasa la fecha del teléfono.
 *
 * 1. **Qué fechas tiene un mes**, sacadas de las fichas de disco y de hito. Solo cuenta un dato
 *    rotulado `hecho` —si mañana una fecha pasa a discutida, sale del afiche sin que nadie
 *    toque el portal—, salvo las leyendas que un mes **declara** que entran con su rótulo a la
 *    vista (la fundación del 28 de diciembre, `D-84`). Es lo único estricto del proyecto
 *    (`D-14`) aplicado a un adorno: el afiche no puede decir "pasó en noviembre" de algo que
 *    no se sabe, y lo que es leyenda lo dice.
 * 2. **Qué dice la estampa del cumpleaños** según el día: antes, el día, o después.
 */

import { ESTAMPA } from './copy.ts';

/** Lo que el almanaque necesita de una ficha. */
export interface FichaCruda {
  readonly slug: string;
  readonly tipo: string;
  readonly titulo: string;
  readonly datos?: readonly { readonly etiqueta: string; readonly valor: string; readonly rotulo: string }[];
}

/** Los doce, en el orden de `Date#getMonth()`. */
export const MESES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
] as const;

export type Mes = (typeof MESES)[number];

/** Con qué rótulo entra una fecha al almanaque. */
export type RotuloDeTaco = 'hecho' | 'leyenda';

/** Un taco del almanaque: un día de un mes, con el año y la ficha de donde sale. */
export interface Taco {
  readonly slug: string;
  readonly tipo: string;
  readonly titulo: string;
  readonly dia: number;
  readonly anio: number;
  readonly rotulo: RotuloDeTaco;
  /** La etiqueta del dato en la ficha: "Salida", "Fechas 1993", "Fecha de fundación que circula"… */
  readonly etiqueta: string;
}

/** Lo que un mes puede pedirle al almanaque además de los hechos. */
export interface OpcionesDelMes {
  /** Las fichas cuyas fechas rotuladas `leyenda` entran igual, con su rótulo a la vista. */
  readonly leyendas?: readonly string[];
}

/** Las dos etiquetas con que las fichas de disco nombran la fecha de salida (`D-49`). */
const ETIQUETA_SALIDA = /^(fecha de )?salida$/i;

/**
 * "4 de octubre de 1986", "19 y 20 de noviembre" (el año viene en la etiqueta), con o sin
 * aclaración después. Lo que no empieza con un día —"1982", "Desde 1987"— no es una fecha
 * del almanaque.
 */
const FECHA = /^(\d{1,2})(?:\s+y\s+(\d{1,2}))?\s+de\s+([a-záéíóú]+)(?:\s+de\s+(\d{4}))?\b/i;
/** Un año suelto en la etiqueta: "Fechas 1993". */
const ANIO_EN_ETIQUETA = /\b(1[89]\d{2}|20\d{2})\b/;

/** El nombre del mes de una fecha, en el calendario de quien mira. */
export function mesDe(fecha: Date): Mes {
  return MESES[fecha.getMonth()]!;
}

/**
 * Las fechas de un mes, del 1 al 31, sacadas de las fichas de disco y de hito.
 *
 * Un disco entra por su fecha de salida y nada más: *Gulp!* tiene tres fechas en discusión,
 * cada una rotulada `hecho` *como versión*, y ninguna es "Salida" — por eso no cumple años en
 * ningún mes. Un hito entra por cualquier dato que empiece con un día: "2 de diciembre de
 * 1989", "19 y 20 de noviembre" (dos tacos, el año de la etiqueta "Fechas 1993"), "28 de
 * diciembre de 1976 — nunca confirmada…" (solo si el mes lo declara en `leyendas`).
 *
 * Se devuelve también cuántos discos tiene la Redondopedia y cuántos salieron ese mes: es lo
 * que cuenta la línea de octubre ("De los diez discos, seis salieron en octubre.").
 */
export function fechasDelMes(
  fichas: readonly FichaCruda[],
  mes: Mes,
  opciones: OpcionesDelMes = {},
): { readonly tacos: readonly Taco[]; readonly discosDelMes: number; readonly totalDiscos: number } {
  const leyendas = new Set(opciones.leyendas ?? []);
  const tacos: Taco[] = [];
  let totalDiscos = 0;
  for (const f of fichas) {
    if (f.tipo !== 'disco' && f.tipo !== 'hito') continue;
    if (f.tipo === 'disco') totalDiscos += 1;
    for (const d of f.datos ?? []) {
      const etiqueta = d.etiqueta.trim();
      if (f.tipo === 'disco' && !ETIQUETA_SALIDA.test(etiqueta)) continue;
      const rotulo = d.rotulo === 'hecho' ? 'hecho' : d.rotulo === 'leyenda' && leyendas.has(f.slug) ? 'leyenda' : null;
      if (!rotulo) continue;
      const m = FECHA.exec(d.valor.trim());
      if (!m || m[3]!.toLowerCase() !== mes) continue;
      const anio = m[4] ?? ANIO_EN_ETIQUETA.exec(etiqueta)?.[1];
      if (!anio) continue;
      for (const dia of [m[1], m[2]].filter((x): x is string => x !== undefined)) {
        tacos.push({ slug: f.slug, tipo: f.tipo, titulo: f.titulo, dia: Number(dia), anio: Number(anio), rotulo, etiqueta });
      }
    }
  }
  // Se lee como almanaque: por día. A igual día, el más viejo primero.
  tacos.sort((a, b) => a.dia - b.dia || a.anio - b.anio);
  const discosDelMes = new Set(tacos.filter((t) => t.tipo === 'disco').map((t) => t.slug)).size;
  return { tacos, discosDelMes, totalDiscos };
}

/**
 * El taco que hace de cumpleaños del mes: el de la ficha pedida, con el rótulo que el afiche
 * declara. Si la ficha cambió de rótulo, no hay cumpleaños, y sin cumpleaños no hay afiche: el
 * portal no festeja en el mes equivocado ni con el rótulo equivocado.
 */
export function cumpleDelMes(
  tacos: readonly Taco[],
  cumple: { readonly slug: string; readonly rotulo: RotuloDeTaco },
): Taco | null {
  return tacos.find((t) => t.slug === cumple.slug && t.rotulo === cumple.rotulo) ?? null;
}

/**
 * La estampa del cumpleaños, para la fecha dada.
 *
 * Los años los cuenta la fecha y no el build: el mismo sitio, sin tocarlo, dice 40 en 2026 y
 * 41 en 2027. Es la misma para todos los meses.
 */
export function cumpleDelDia(fecha: Date, salida: { readonly dia: number; readonly anio: number }): string {
  const anios = fecha.getFullYear() - salida.anio;
  const hoy = fecha.getDate();
  if (hoy < salida.dia) return ESTAMPA.cumpleAntes(salida.dia, anios);
  if (hoy === salida.dia) return ESTAMPA.cumpleHoy(salida.dia, anios);
  return ESTAMPA.cumplio(salida.dia, anios);
}
