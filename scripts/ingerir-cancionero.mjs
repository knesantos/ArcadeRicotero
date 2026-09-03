/**
 * Ingesta del cancionero: 149 archivos raspados → el dataset propio del sitio.
 *
 * **Por qué hay una ingesta y no se leen los archivos directamente.** Tres razones, y
 * ninguna es de comodidad:
 *
 *  1. **`D-13` exige una puerta.** El error demostrado de las fuentes de fans es mezclar
 *     material del Indio solista y de Skay con el de la banda: 149 entradas contra 105
 *     temas reales. La puerta es `resolverTema()`; lo que no pasa queda apartado en un
 *     archivo de cuarentena **con su motivo**, porque un descarte silencioso no se puede
 *     auditar y este proyecto ya decidió que el rótulo diga la verdad.
 *  2. **El material de origen es del usuario, no del repo.** Vive en otra carpeta de su
 *     máquina y se re-raspa con su propio scraper. Copiarlo a mano crearía dos verdades;
 *     esto lo copia una vez, deja registro de cuándo, y se vuelve a correr cuando cambie.
 *  3. **La forma raspada no es la forma que el sitio quiere.** La fuente no sabe de qué
 *     disco es cada tema — eso lo pone `RES-20`, que es la autoridad del proyecto.
 *
 * Correr desde la raíz:
 *   node scripts/ingerir-cancionero.mjs [--origen <carpeta>]
 */

import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { leerTemas, resolverTema, indiceDuro, normalizarDuro } from '../src/lib/letra/temas.ts';
import { normalizarAcorde, normalizarAcordes } from '../src/lib/cancionero/notacion.ts';
import { esAnotacion } from '../src/lib/cancionero/anotacion.ts';
import { motivosDeTaller, esTituloDePagina } from '../src/lib/cancionero/taller.ts';

const ORIGEN_POR_DEFECTO = 'C:/Users/santi/Proyectos/TemasRedo/cancionero/data';
const SALIDA = 'src/data/cancionero.json';
const CUARENTENA = 'src/data/cancionero-cuarentena.json';
const NOTAS = 'src/data/cancionero-notas.json';

/** El año de cada disco. Los mismos que hace cumplir `letra.schema.json`. */
const ANIO = {
  gulp: 1985,
  oktubre: 1986,
  'un-baion-para-el-ojo-idiota': 1988,
  'bang-bang-estas-liquidado': 1989,
  'la-mosca-y-la-sopa': 1991,
  'lobo-suelto': 1993,
  'cordero-atado': 1993,
  luzbelito: 1996,
  'ultimo-bondi-a-finisterre': 1998,
  'momo-sampler': 2000,
};

/** Slug estable, derivado SIEMPRE del título canónico de `RES-20`, nunca del raspado. */
function aSlug(titulo) {
  return titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Qué nos dio la fuente para este tema. Tres estados, y el rótulo dice cuál es.
 *
 * **Por qué tres y no un booleano.** La primera versión preguntaba "¿tiene letra?" y
 * metía en la misma bolsa dos cosas distintas: un instrumental de verdad (*Capricho
 * Magyar*, que no tiene letra porque no la tuvo nunca) y una página de cifraclub que
 * transcribió solo la tablatura de guitarra (*Etiqueta negra*, que sí tiene letra —
 * simplemente nadie la escribió ahí). Tratarlos igual le hace decir al sitio que
 * seis temas de los Redondos son instrumentales, y es falso.
 *
 *  · `instrumental`     — la fuente dice con todas las letras que no tiene letra.
 *  · `solo-tablatura`   — hay transcripción, pero es pentagrama: ni un verso.
 *  · `letra`            — el caso normal.
 */
function clasificar(crudo, secciones) {
  const plano = (crudo.texto_plano || '').trim();
  if (!plano || /^esta canci[oó]n no tiene letra$/i.test(plano)) return 'instrumental';
  const versos = secciones.some((s) => s.lineas.some((l) => l.t === 'letra' && (l.texto || '').trim()));
  return versos ? 'letra' : 'solo-tablatura';
}

/**
 * El retorno de carro que dejó el raspado.
 *
 * Solo lo trae `san-telmo` —27 renglones—, y no es cosmético: `"SAN TELMO\r"` viaja hasta
 * el HTML y hasta el banco de los juegos como parte del texto. La sangría de adelante **no
 * se toca**: la fuente alineó los acordes contando caracteres, y recortarla los corre.
 */
function limpiar(texto) {
  return String(texto ?? '').replace(/\r/g, '');
}

/**
 * Pasa una línea de la forma raspada a la del sitio.
 * Los acordes viajan como `[nombre, columna]`: es la mitad de bytes que un objeto y son
 * ~14.000 líneas. La columna es la que la fuente ya calculó alineando contra la letra.
 */
function aLinea(l) {
  // `normalizarAcorde` hace dos cosas y las dos importan: pasa la notacion latina de
  // lacuerda.net a la anglosajona que entiende el transpositor, y tira lo que nunca fue
  // un acorde ("Intro", "Solo de saxo", una secuencia entera sin separar). Lo que no es
  // acorde no se convierte en uno: se descarta, y la linea queda sin esa columna.
  const acordes = (l.acordes || [])
    .map((a) => [normalizarAcorde(a.acorde), a.col])
    .filter(([nombre]) => nombre !== null);
  if (l.tipo_linea === 'tab') return { t: 'tab', texto: limpiar(l.texto), ...(acordes.length ? { acordes } : {}) };
  if (l.tipo_linea === 'instrumental') return { t: 'instrumental', acordes };
  // La fuente marca como letra todo lo que no es tablatura, y en una pagina de cifras eso
  // incluye lo que escribio el transcriptor: `GUITARRA:`, `(X4)`, `VERSO 1: (Riff 2) X7`.
  // No se tira —le sirve al que toca— pero no entra como verso: el banco de `US-03` elige
  // huecos de aca, y sobre esto llego a producir un item que decia `VERSO 1: [Riff] 2) X7`.
  const texto = limpiar(l.letra);
  const t = esAnotacion(texto) ? 'anotacion' : 'letra';
  return { t, texto, ...(acordes.length ? { acordes } : {}) };
}

/** Cuántas líneas movió a `anotacion` la segunda pasada, para que la corrida lo diga. */
const despegadas = [];

/**
 * La segunda pasada: la que mira el párrafo entero.
 *
 * Nada se borra —la línea queda con `t: "anotacion"` y se sigue pintando en la página, que
 * es lo que le sirve al que toca—, pero deja de ser letra: fuera del cancionero cantado y
 * fuera de los bancos de `US-03` y `US-07`.
 */
function despegarNotas(lineas, titulo) {
  const motivos = motivosDeTaller(lineas);
  return lineas.map((l, i) => {
    if (l.t !== 'letra') return l;
    const motivo = esTituloDePagina(l.texto, titulo)
      ? 'el titulo de la pagina, no un verso'
      : motivos[i];
    if (motivo === null || motivo === undefined) return l;
    despegadas.push({ slug: aSlug(titulo), titulo, texto: l.texto.trim(), motivo });
    return { ...l, t: 'anotacion' };
  });
}

function main() {
  const i = process.argv.indexOf('--origen');
  const origen = i >= 0 ? process.argv[i + 1] : ORIGEN_POR_DEFECTO;
  if (!existsSync(origen)) {
    console.error(`no encuentro la carpeta de origen: ${origen}`);
    process.exit(1);
  }

  const catalogo = leerTemas();
  const indice = indiceDuro(catalogo);
  const archivos = readdirSync(origen).filter((f) => f.endsWith('.json')).sort();

  /** slug → tema del sitio. Un tema, un archivo: si dos apuntan al mismo, gana el que trae cifra. */
  const porSlug = new Map();
  const cuarentena = [];

  for (const archivo of archivos) {
    const crudo = JSON.parse(readFileSync(join(origen, archivo), 'utf-8'));
    const canonico = resolverTema(crudo.titulo, indice);

    if (!canonico) {
      // D-13: no está entre los 105, así que no es de Patricio Rey — o al menos no de
      // los diez discos. Se aparta con el motivo escrito, nunca se borra.
      cuarentena.push({
        archivo,
        titulo: crudo.titulo,
        sitio: crudo.fuente?.sitio ?? null,
        url: crudo.fuente?.url ?? null,
        acordes: crudo.estadisticas?.n_acordes ?? 0,
        motivo: 'no figura entre los 105 temas de RES-20 (D-13)',
      });
      continue;
    }

    const slug = aSlug(canonico.titulo);
    const nAcordes = crudo.estadisticas?.n_acordes ?? 0;
    const previo = porSlug.get(slug);
    if (previo && previo._acordes >= nAcordes) {
      cuarentena.push({
        archivo,
        titulo: crudo.titulo,
        sitio: crudo.fuente?.sitio ?? null,
        url: crudo.fuente?.url ?? null,
        acordes: nAcordes,
        motivo: `duplicado de "${canonico.titulo}"; se quedó la versión con más acordes`,
      });
      continue;
    }

    const secciones = (crudo.secciones || [])
      .map((s) => ({
        tipo: s.tipo ?? 'desconocida',
        etiqueta: s.etiqueta ?? null,
        // Dos pasadas y en este orden. `aLinea` mira el renglon solo, que es lo unico que
        // `anotacion.ts` sabe hacer; `despegarNotas` mira el parrafo, que es la forma real
        // en que el transcriptor escribe. Sin la segunda, "El bajo" y "Compases" seguian
        // siendo versos porque solos no tienen ninguna firma — ver `taller.ts`.
        lineas: despegarNotas((s.lineas || []).map(aLinea), canonico.titulo),
      }))
      .filter((s) => s.lineas.length > 0);

    const contenido = clasificar(crudo, secciones);

    porSlug.set(slug, {
      _acordes: nAcordes,
      slug,
      titulo: canonico.titulo,
      disco: canonico.disco,
      pista: canonico.pista,
      anio: ANIO[canonico.disco],
      tono: crudo.metadata_musical?.tono ?? null,
      capo: crudo.metadata_musical?.capo ?? null,
      acordesUsados: normalizarAcordes(crudo.acordes_usados ?? []),
      // Un tema sin letra no es un tema roto. El índice dice cuál de los tres es.
      contenido,
      fuente: {
        sitio: crudo.fuente?.sitio ?? null,
        url: crudo.fuente?.url ?? null,
        consultado: (crudo.fuente?.scraped_at ?? '').slice(0, 10) || null,
      },
      // El instrumental no guarda secciones; la tablatura sí, que es lo único que hay.
      secciones: contenido === 'instrumental' ? [] : secciones,
    });
  }

  const temas = [...porSlug.values()]
    .map(({ _acordes, ...t }) => t)
    .sort((a, b) => {
      const oa = Object.keys(ANIO).indexOf(a.disco);
      const ob = Object.keys(ANIO).indexOf(b.disco);
      return oa - ob || a.pista - b.pista;
    });

  const hoy = new Date().toISOString().slice(0, 10);
  writeFileSync(
    SALIDA,
    JSON.stringify({ contrato: 'CTR-06', contratoVersion: 1, actualizado: hoy, origen, temas }, null, 1),
    'utf-8',
  );
  // La segunda pasada tambien deja registro: que renglon se saco de la letra y por que.
  // Un descarte silencioso no se puede auditar, y aca se despegan renglones que alguien
  // podria querer de vuelta — el archivo es la unica forma de discutirlo.
  const vivos = new Set(temas.map((t) => t.slug));
  const notas = despegadas.filter((n) => vivos.has(n.slug));
  writeFileSync(
    NOTAS,
    JSON.stringify(
      {
        actualizado: hoy,
        regla: 'src/lib/cancionero/taller.ts',
        explicacion:
          'Renglones que la fuente guardo en la columna de la letra y son del que transcribio. No se borraron: en cancionero.json quedaron como t: "anotacion", se siguen viendo en la pagina y no entran a los juegos.',
        despegados: notas,
      },
      null,
      1,
    ),
    'utf-8',
  );
  writeFileSync(
    CUARENTENA,
    JSON.stringify(
      { actualizado: hoy, regla: 'D-13', explicacion: 'Apartados por no figurar entre los 105 temas de RES-20.', apartados: cuarentena },
      null,
      1,
    ),
    'utf-8',
  );

  // El informe: sin esto la corrida es un acto de fe.
  const cubiertos = new Set(temas.map((t) => normalizarDuro(t.titulo)));
  const faltantes = catalogo.filter((t) => !cubiertos.has(normalizarDuro(t.titulo)));
  const conCifra = temas.filter((t) => t.acordesUsados.length > 0).length;

  console.log(`leídos:      ${archivos.length} archivos de ${origen}`);
  console.log(`entraron:    ${temas.length} / ${catalogo.length} temas de RES-20`);
  console.log(`con cifra:   ${conCifra}`);
  console.log(`instrumentales:        ${temas.filter((t) => t.contenido === 'instrumental').length}`);
  console.log(`solo tablatura:        ${temas.filter((t) => t.contenido === 'solo-tablatura').length}`);
  console.log(`cuarentena:  ${cuarentena.length} apartados → ${CUARENTENA}`);
  console.log(`notas:       ${notas.length} renglones despegados de la letra → ${NOTAS}`);
  if (faltantes.length) {
    console.log(`\nsin material (${faltantes.length}):`);
    for (const t of faltantes) console.log(`  · ${t.disco} ${t.pista} — ${t.titulo}`);
  }
}

main();
