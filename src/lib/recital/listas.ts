/**
 * Lo que la página "En vivo" (`D-72`) necesita de los datos, ya cocinado: las fechas en
 * castellano, los bises que marca la fuente, el nombre de las licencias y las noches por año.
 *
 * **Puro**: recibe los datos ya leídos. Lo usa en build `en-vivo.astro`, y nunca importa un
 * JSON: la frontera de licencias de `CTR-19.8` la cruza la página que lee el archivo, no este
 * módulo.
 */

const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

/**
 * "8 de diciembre de 1995". Acepta las tres precisiones que `CTR-19.7` permite —`AAAA-MM-DD`,
 * `AAAA-MM` y `AAAA`— y escribe solo lo que la fuente dio: una fecha a medias no se completa.
 */
export function fechaLarga(fecha: string): string {
  const [a, m, d] = fecha.split('-');
  const mes = m ? MESES[Number(m) - 1] : undefined;
  if (d && mes) return `${Number(d)} de ${mes} de ${a}`;
  if (mes) return `${mes} de ${a}`;
  return a ?? fecha;
}

/** "24-09-2026", la forma de los rótulos de consulta (`CTR-19.9`). */
export function fechaDeConsulta(fecha: string): string {
  const [a, m, d] = fecha.split('-');
  return d && m ? `${d}-${m}-${a}` : fecha;
}

/**
 * El número de bis que la fuente le pone a un tema en su nota (`«Encore»` es el primero,
 * `«Encore 2»` el segundo), o `null` si la nota no marca bis. Es lo que la fuente dice, y la
 * pantalla lo muestra como lo que la fuente dice.
 */
export function bisDeLaNota(nota: string | undefined): number | null {
  if (!nota) return null;
  const m = /«Encore(?: (\d+))?»/.exec(nota);
  if (!m) return null;
  return m[1] ? Number(m[1]) : 1;
}

/**
 * El nombre corto de una licencia, como se escribe en un rótulo: `cc0-1.0` → "CC0 1.0",
 * `cc-by-sa-4.0` → "CC BY-SA 4.0". Acepta la salida del archivo y la familia con su versión.
 */
export function nombreDeLicencia(id: string, version?: string): string {
  const conVersion = version ? `${id}-${version}` : id;
  const m = /^(.*?)-(\d+(?:\.\d+)?)$/.exec(conVersion);
  const familia = (m ? m[1]! : conVersion).toUpperCase();
  const legible = familia === 'CC0' ? 'CC0' : familia.replace(/^CC-/, 'CC ');
  return m ? `${legible} ${m[2]}` : legible;
}

/** Las noches agrupadas por año, en orden de fecha. */
export function porAnio<T extends { readonly fecha: string }>(noches: readonly T[]): ReadonlyMap<string, readonly T[]> {
  const ordenadas = [...noches].sort((a, b) => a.fecha.localeCompare(b.fecha));
  const salida = new Map<string, T[]>();
  for (const n of ordenadas) {
    const anio = n.fecha.slice(0, 4);
    const lista = salida.get(anio);
    if (lista) lista.push(n);
    else salida.set(anio, [n]);
  }
  return salida;
}
