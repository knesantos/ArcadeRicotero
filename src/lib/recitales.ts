/**
 * `CTR-19` pieza 2: los recitales enteros, de fuentes cuya licencia deja guardarlos.
 *
 * **Lo que vive acá es lo que tienen que compartir el script que escribe el archivo y el
 * test que lo revisa** (`CTR-19.8`): la tabla de qué licencia de fuente entra en qué
 * licencia de salida, la función que elige la salida más abierta, y la que junta los
 * problemas del archivo. Dos copias de una regla es el modo de falla del motivo 3 de
 * `CTR-03.8`: el día que la tabla cambie, la copia que nadie se acuerda de tocar queda
 * mintiendo.
 *
 * **Puro**, como `en-vivo.ts`: sin `node:fs` y sin importar ningún JSON. Lo importan solo
 * `scripts/ingerir-recitales.mjs` y su test. **Ninguna página, isla ni `catalogo.ts`**: en
 * este ciclo el sitio no lee la pieza 2 en build (`CTR-19.8`, regla 4), así el "compartir
 * igual" de una licencia termina en el borde del archivo y el corte de Fáciles no puede
 * salir de acá. Lo vigila t8 de `en-vivo.test.ts`.
 *
 * **La tabla es *supuesto*** hasta que haya ficha sobre qué exige cada licencia
 * (`CTR-19.14` punto 1). Está escrita para la lectura más estricta: si la ficha dice
 * menos, se afloja esta tabla y ningún campo del archivo cambia.
 */

export type FamiliaLicencia =
  | 'cc0'
  | 'dominio-publico'
  | 'cc-by'
  | 'cc-by-sa'
  | 'cc-by-nc'
  | 'cc-by-nc-sa'
  | 'permiso-escrito';

export type SalidaLicencia = 'cc0-1.0' | 'cc-by-4.0' | 'cc-by-sa-4.0' | 'cc-by-nc-sa-4.0';

export interface LicenciaDeFuente {
  readonly familia: FamiliaLicencia;
  readonly version?: string;
  readonly textual: string;
  readonly url: string;
  readonly consultada: string;
  readonly redistribuible?: true;
}

export interface Fuente {
  readonly id: string;
  readonly nombre: string;
  readonly sitio: string;
  readonly licencia: LicenciaDeFuente;
  readonly atribucion?: string;
  readonly ficha: string;
}

export interface TemaDeRecital {
  readonly titulo: string;
  readonly slug?: string;
  readonly fuera?: 'inedito' | 'cover' | 'intro' | 'cantico' | 'sin-identificar';
  readonly pegadoAlAnterior?: true;
  readonly nota?: string;
}

export interface Recital {
  readonly fecha: string;
  readonly orden?: number;
  readonly lugar: string;
  readonly ciudad: string;
  readonly fuente: string;
  readonly url: string;
  readonly consultado: string;
  readonly completitud: 'completa' | 'parcial' | 'sin-declarar';
  readonly temas: readonly TemaDeRecital[];
  readonly nota?: string;
}

export interface ArchivoDeRecitales {
  readonly contrato: 'CTR-19';
  readonly pieza: 'recitales';
  readonly contratoVersion: 1;
  readonly actualizado: string;
  readonly licencia: { readonly id: SalidaLicencia; readonly url: string };
  readonly cambios: string;
  readonly nota?: string;
  readonly fuentes: readonly Fuente[];
  readonly recitales: readonly Recital[];
}

/** De la más abierta a la más cerrada. El orden es el que usa `salidaMasAbierta`. */
export const SALIDAS: readonly SalidaLicencia[] = ['cc0-1.0', 'cc-by-4.0', 'cc-by-sa-4.0', 'cc-by-nc-sa-4.0'];

/** La URL de cada salida. `licencia.url` del archivo tiene que ser exactamente esta. */
export const URL_DE_SALIDA: Readonly<Record<SalidaLicencia, string>> = {
  'cc0-1.0': 'https://creativecommons.org/publicdomain/zero/1.0/',
  'cc-by-4.0': 'https://creativecommons.org/licenses/by/4.0/',
  'cc-by-sa-4.0': 'https://creativecommons.org/licenses/by-sa/4.0/',
  'cc-by-nc-sa-4.0': 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
};

/** Las versiones de CC BY-SA y CC BY-NC-SA que pueden salir bajo la 4.0 (`CTR-19.8`). */
const SA_COMPATIBLES = new Set(['3.0', '4.0']);

/**
 * La tabla de la regla 2 de `CTR-19.8`, **como dato y una sola vez**: ¿esta licencia de
 * fuente puede salir dentro de un archivo que se ofrece bajo esta salida?
 */
export function entraEn(licencia: LicenciaDeFuente, salida: SalidaLicencia): boolean {
  const { familia, version } = licencia;
  const libre = familia === 'cc0' || familia === 'dominio-publico';
  const permiso = familia === 'permiso-escrito' && licencia.redistribuible === true;

  switch (salida) {
    case 'cc0-1.0':
      // Todo lo que pida atribución queda afuera: el sitio no puede renunciar a ella en
      // nombre de otro.
      return libre;
    case 'cc-by-4.0':
      return libre || permiso || familia === 'cc-by';
    case 'cc-by-sa-4.0':
      return libre || permiso || familia === 'cc-by' || (familia === 'cc-by-sa' && SA_COMPATIBLES.has(version ?? ''));
    case 'cc-by-nc-sa-4.0':
      return (
        libre ||
        permiso ||
        familia === 'cc-by' ||
        familia === 'cc-by-nc' ||
        (familia === 'cc-by-nc-sa' && SA_COMPATIBLES.has(version ?? ''))
      );
  }
}

/**
 * La salida más abierta que aceptan todas las fuentes, o `null` si no hay ninguna (BY-SA
 * con NC-SA: eso es `CTR-19` v2 y lo decide el usuario, no un script).
 */
export function salidaMasAbierta(fuentes: readonly Fuente[]): SalidaLicencia | null {
  return SALIDAS.find((s) => fuentes.every((f) => entraEn(f.licencia, s))) ?? null;
}

const nombreDe = (r: Recital): string => `${r.fecha}${r.orden ? ` (${r.orden})` : ''} de ${r.fuente}`;

/**
 * Lo que el schema no puede ver de la pieza 2 (`CTR-19.13`, t10 a t12), en una lista de
 * textos. Cada texto nombra el recital o la fuente que lo causa. Vacía = archivo sano.
 *
 * `resolver` es la puerta de `D-13` (`resolverTema()` + `slugDeTitulo()`); `hoy` es la
 * fecha contra la que se mira que nada esté consultado en el futuro. Los dos entran como
 * parámetro para que este módulo siga puro.
 */
export function problemasDelArchivo(
  archivo: ArchivoDeRecitales,
  resolver: (titulo: string) => string | null,
  hoy: string,
): readonly string[] {
  const problemas: string[] = [];

  // t10. Cada tema cruza como dice la puerta, y lo de afuera sigue afuera.
  for (const r of archivo.recitales) {
    for (const t of r.temas) {
      const dice = resolver(t.titulo);
      if (t.slug !== undefined && dice !== t.slug) {
        problemas.push(
          dice === null
            ? `recital ${nombreDe(r)}: «${t.titulo}» no es ninguno de los 105 de RES-20 y está guardado con slug "${t.slug}"`
            : `recital ${nombreDe(r)}: «${t.titulo}» guarda el slug "${t.slug}" y la puerta de D-13 dice "${dice}"`,
        );
      }
      if (t.slug === undefined && dice !== null) {
        problemas.push(
          `recital ${nombreDe(r)}: «${t.titulo}» está marcado fuera (${t.fuera ?? 'sin clase'}) y ahora resuelve a "${dice}"`,
        );
      }
    }
  }

  // t11. Cada fuente entra en la salida declarada, y la URL es la de esa salida.
  const salida = archivo.licencia.id;
  for (const f of archivo.fuentes) {
    if (!entraEn(f.licencia, salida)) {
      problemas.push(
        `la fuente ${f.id} (${f.licencia.familia}${f.licencia.version ? ` ${f.licencia.version}` : ''}) ` +
          `no puede salir bajo ${salida} (CTR-19.8, regla 2)`,
      );
    }
  }
  if (archivo.licencia.url !== URL_DE_SALIDA[salida]) {
    problemas.push(`la licencia del archivo dice ${salida} y su URL es ${archivo.licencia.url}, no ${URL_DE_SALIDA[salida]}`);
  }

  // t12. Integridad.
  const ids = new Set(archivo.fuentes.map((f) => f.id));
  const usadas = new Set(archivo.recitales.map((r) => r.fuente));
  for (const r of archivo.recitales) {
    if (!ids.has(r.fuente)) problemas.push(`recital ${nombreDe(r)}: la fuente ${r.fuente} no está declarada en fuentes`);
  }
  for (const f of archivo.fuentes) {
    if (!usadas.has(f.id)) problemas.push(`la fuente ${f.id} está declarada y ningún recital la usa`);
  }

  const claves = new Map<string, number>();
  for (const r of archivo.recitales) {
    const clave = `${r.fecha}|${r.orden ?? 1}|${r.fuente}`;
    claves.set(clave, (claves.get(clave) ?? 0) + 1);
  }
  for (const [clave, n] of claves) {
    if (n > 1) problemas.push(`(fecha, orden, fuente) = (${clave.split('|').join(', ')}) está ${n} veces`);
  }
  for (const r of archivo.recitales) {
    if (r.orden !== undefined) {
      const hermanos = archivo.recitales.filter((x) => x.fecha === r.fecha && x.fuente === r.fuente).length;
      if (hermanos < 2) problemas.push(`recital ${nombreDe(r)}: lleva orden y es el único de esa fecha en esa fuente`);
    }
  }

  for (const r of archivo.recitales) {
    if (r.temas[0]?.pegadoAlAnterior) problemas.push(`recital ${nombreDe(r)}: el primer tema no puede ir pegado al anterior`);
    if (r.consultado > hoy) problemas.push(`recital ${nombreDe(r)}: consultado el ${r.consultado}, que está en el futuro`);
    if (r.fecha > r.consultado) problemas.push(`recital ${nombreDe(r)}: la fecha del recital es posterior a su consulta`);
  }
  for (const f of archivo.fuentes) {
    if (f.licencia.consultada > hoy) {
      problemas.push(`la licencia de ${f.id} dice consultada el ${f.licencia.consultada}, que está en el futuro`);
    }
  }
  if (archivo.actualizado > hoy) problemas.push(`el archivo dice actualizado el ${archivo.actualizado}, que está en el futuro`);

  return problemas;
}
