/**
 * Octubre, el mes del disco (`D-49`).
 *
 * Dos trabajos, y los dos son puros: no leen archivos ni la hora por su cuenta. El portal le
 * pasa las fichas de la Redondopedia en el build, y la isla le pasa la fecha del teléfono.
 *
 * 1. **Qué discos salieron en octubre**, sacado de las fichas y no escrito a mano. Solo
 *    cuenta un dato de salida rotulado `hecho`: si mañana una fecha pasa a discutida, sale
 *    del afiche sin que nadie toque el portal. Es lo único estricto del proyecto (`D-14`):
 *    el afiche no le puede decir "salió en octubre" de un disco que no se sabe.
 * 2. **Qué dice la estampa del cumpleaños** según el día: antes del 4, el 4, o después.
 */

import { OKTUBRE } from './copy.ts';

/** Lo que el afiche necesita de una ficha de disco. */
export interface FichaCruda {
  readonly slug: string;
  readonly tipo: string;
  readonly titulo: string;
  readonly datos?: readonly { readonly etiqueta: string; readonly valor: string; readonly rotulo: string }[];
}

/** Un disco que salió en octubre, con el día y el año de su ficha. */
export interface SalidaDeOktubre {
  readonly slug: string;
  readonly titulo: string;
  readonly dia: number;
  readonly anio: number;
}

/** Las dos etiquetas con que las fichas nombran la fecha de salida. */
const ETIQUETA_SALIDA = /^(fecha de )?salida$/i;
/** "4 de octubre de 1986", con o sin aclaración después. */
const EN_OKTUBRE = /^(\d{1,2}) de octubre de (\d{4})\b/;

/** Los discos de las fichas que salieron en octubre, del más viejo al más nuevo. */
export function discosDeOktubre(fichas: readonly FichaCruda[]): {
  readonly deOktubre: readonly SalidaDeOktubre[];
  readonly total: number;
} {
  const discos = fichas.filter((f) => f.tipo === 'disco');
  const deOktubre: SalidaDeOktubre[] = [];
  for (const f of discos) {
    const salida = f.datos?.find((d) => ETIQUETA_SALIDA.test(d.etiqueta.trim()) && d.rotulo === 'hecho');
    const m = salida ? EN_OKTUBRE.exec(salida.valor.trim()) : null;
    if (m) deOktubre.push({ slug: f.slug, titulo: f.titulo, dia: Number(m[1]), anio: Number(m[2]) });
  }
  deOktubre.sort((a, b) => a.anio - b.anio || a.dia - b.dia);
  return { deOktubre, total: discos.length };
}

/** Si la fecha cae en octubre. Es la misma pregunta que se hace en la cabeza del portal. */
export function esOktubre(fecha: Date): boolean {
  return fecha.getMonth() === 9;
}

/**
 * La estampa del cumpleaños de un disco, para la fecha dada.
 *
 * Los años los cuenta la fecha y no el build: el mismo sitio, sin tocarlo, dice 40 en 2026 y
 * 41 en 2027.
 */
export function cumpleDelDia(fecha: Date, salida: { readonly dia: number; readonly anio: number }): string {
  const anios = fecha.getFullYear() - salida.anio;
  const hoy = fecha.getDate();
  if (hoy < salida.dia) return OKTUBRE.cumpleAntes(salida.dia, anios);
  if (hoy === salida.dia) return OKTUBRE.cumpleHoy(salida.dia, anios);
  return OKTUBRE.cumplio(salida.dia, anios);
}
