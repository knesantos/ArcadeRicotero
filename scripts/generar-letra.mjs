/**
 * Genera el banco candidato de "completar la letra" (`US-03`, `CTR-04`).
 *
 * ─── Quién decide qué pasa a `listo`, y es lo más importante ────────────────────────
 *
 * **Este script no elige nada: promueve lo que una persona decidió.** Hasta el ciclo 8
 * la única vía era la confirmación de oído; `D-25` (decisión del usuario) abrió la
 * tercera: salir con **fuente única declarada**. Las dos entran por
 * `src/data/letra-confirmaciones.json` — `confirmados` para el oído, `fuenteUnica.items`
 * para la selección curada de `T-138` — y todo lo que no esté en ninguna de las dos
 * queda en `borrador`. Un programa que promoviera los 1.500 candidatos porque "tienen
 * una fuente" convertiría la curaduría en un pase de lista, y `D-25` en barra libre.
 *
 * Cada ítem `listo` declara su vía en `cotejo` (`CTR-04.6` v2), con el régimen **más
 * fuerte que su evidencia permita**: `oido` si alguien escuchó, `dos-fuentes` si hay dos
 * fichas, y recién si no, `fuente-unica` con la referencia a `D-25`.
 *
 * ─── De dónde sale el nivel: del conteo en vivo, no de nadie (`CTR-04` v3) ─────────
 *
 * **El nivel de un ítem es el de su tema** (`D-46` con su precisión del 2026-09-24,
 * `BR-30`, `CTR-04.14`). Los temas del banco se parten en tercios por lo más tocado en vivo
 * con `repartirEnTercios()` (`src/lib/en-vivo.ts`, `CTR-19.15`) —la misma regla de
 * `US-07`, llamada y no copiada—, sobre el conteo citado de `src/data/setlistfm.json`. Un
 * tema sin línea en el conteo es `dificil` y queda marcado `sin-conteo` (`D-27`). Hasta
 * `CTR-04` v2 el nivel lo daba la posición del verso en su estrofa: elegir un verso era
 * elegir su nivel. Eso se perdió a sabiendas (`BR-30`, "Lo que se pierde").
 *
 * Y **el contexto sigue al nivel** (`BR-03`, que no cambió una celda): 2 versos de cada
 * lado en Fácil, 1 en Media, 0 en Difícil, tomados de la lista de versos del **tema** y no
 * de la estrofa (`src/lib/letra/versos.ts`). Un verso que no tiene esos vecinos no da ítem.
 *
 * Si falta `setlistfm.json` o no trae `conteo`, **aborta**: el conteo está commiteado, y que
 * falte es un repo roto, no un dato que todavía no llegó (`CTR-04.14` paso 1).
 *
 * **Y no genera de todo el cancionero, sino de los temas cuya fuente tiene ficha.**
 * `CTR-04` obliga a que cada ítem declare `fuenteLetra` como una lista de fichas `RES-XX`,
 * y citarle una ficha inventada a un sitio es el mismo problema de rótulo por otra puerta.
 * El mapa está en `FICHA_POR_SITIO`, abajo, y es lo único que hay que tocar cuando aparece
 * una fuente nueva: sin entrada ahí, un tema no entra al banco y el script lo dice.
 *
 * ─── Lo que sí hace ────────────────────────────────────────────────────────────────
 *
 * Elegir el hueco. Un hueco es bueno cuando la palabra que falta es adivinable por rima,
 * por sentido o por saberse el tema, y es malo cuando es intercambiable ("de", "que",
 * "y"): ahí el juego premia la suerte, no el saber. Los filtros de `sirveDeRespuesta()`
 * son esa distinción hecha código, y son deliberadamente duros — de 337 versos entran
 * los que pasan, no los que hagan falta para llegar a un número.
 *
 * Correr desde la raíz:  npm run generar-letra
 * Si se corrieron los ids (cambió el filtro, el cancionero o un nivel):  npm run generar-letra -- --reanclar
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { versosDelTema, vecinos } from '../src/lib/letra/versos.ts';
import { CONTEXTO_POR_NIVEL } from '../src/lib/letra/banco.ts';
import { repartirEnTercios } from '../src/lib/en-vivo.ts';

const CANCIONERO = 'src/data/cancionero.json';
const CONFIRMACIONES = 'src/data/letra-confirmaciones.json';
const SALIDA = 'src/data/letra.json';
const CONTEO = 'src/data/setlistfm.json';

/**
 * Qué ficha respalda a cada sitio del que sale una letra.
 *
 * **Una fuente sin entrada acá no entra al banco.** No es prolijidad: `CTR-04` pide que el
 * ítem declare de dónde salió la letra, y un sitio sin ficha no tiene con qué responder.
 *
 * · `letras.com` → `RES-23` (`INV-21`), la primera que se evaluó.
 * · `cifraclub.com` → `RES-49` (`INV-23`), escrita en el ciclo 7. Su recomendación es
 *   explícita: mismo estatus y mismas mitigaciones que letras.com.
 * · `lacuerda.net` → **sin ficha.** Apareció con el cancionero rehecho del 2026-08-24 y
 *   trae 20 temas con letra que quedan afuera hasta que `investigador` la fiche. El pedido
 *   está en `Docs/SUGERENCIAS/HILO-para-investigador-fichar-lacuerda.md`.
 */
const FICHA_POR_SITIO = {
  'letras.com': 'RES-23',
  'cifraclub.com': 'RES-49',
};

/** `M:SS` o `MM:SS`, el mismo patrón de `letra.schema.json` y de `banco.ts`. */
const MINUTO = /^\d{1,2}:[0-5]\d$/;
const FECHA = /^\d{4}-\d{2}-\d{2}$/;
const DONDES = ['disco-fisico', 'streaming', 'video'];

/** Lo que escribe `hoja-de-escucha` en un verso que todavía nadie escuchó. */
const PENDIENTE = /^[_?\s:]+$/;

/**
 * El verso como se lee en la hoja de escucha, con la respuesta a la vista.
 *
 * Tiene que dar exactamente lo mismo que `hoja-de-escucha.mjs`: es la huella con la que
 * se detecta que los ids se corrieron. Si las dos versiones se separan, el chequeo pasa
 * a fallar siempre y deja de servir.
 */
function renglon(item) {
  const { antes, respuesta, despues } = item.hueco;
  return `${antes} [${respuesta}] ${despues}`.replace(/\s+/g, ' ').trim();
}

/**
 * Convierte lo que hay en `letra-confirmaciones.json` en confirmaciones válidas.
 *
 * Acepta dos formas para el mismo hecho:
 *
 *   "CL-034": "1:24"                                    ← el minuto, y nada más
 *   "CL-034": { quien, fecha, donde, minuto }           ← la forma larga de CTR-04
 *
 * La corta existe porque confirmar veinte versos con la forma larga es transcribir el
 * mismo objeto veinte veces, y lo que se repite se llena por inercia — que es justo lo
 * que `CTR-04` quiso evitar con `minuto`. Los tres campos repetidos salen de
 * `porDefecto`; **el minuto no tiene defecto posible y por eso nunca se autocompleta.**
 *
 * Devuelve `{ confirmadas, pendientes, errores }`. Un error aborta la corrida: es mejor
 * no escribir nada que escribir un banco donde no se sabe qué está confirmado.
 */
function resolverConfirmaciones(crudas, porDefecto, renglones, versosAnotados) {
  const confirmadas = new Map();
  const pendientes = [];
  const errores = [];

  for (const [id, valor] of Object.entries(crudas)) {
    if (!renglones.has(id)) {
      errores.push(`${id}: no existe en el banco. ¿Se regeneró y se corrieron los ids?`);
      continue;
    }

    // El guardián que importa. Los ids son posicionales (`CL-001`, `CL-002`...), así que
    // un banco regenerado con otro filtro los corre: el verso que hoy es `CL-045` mañana
    // puede ser otro, y la confirmación se mudaría sola a un verso que nadie escuchó.
    // Eso es justo lo que `CTR-04` existe para impedir, y en silencio.
    const anotado = versosAnotados[id];
    if (anotado && anotado !== renglones.get(id)) {
      errores.push(
        `${id}: se corrieron los ids. Cuando lo anotaste era «${anotado}» y ahora es ` +
          `«${renglones.get(id)}». Esa confirmación ya no es de este verso: borrala y ` +
          `sacá la hoja de nuevo.`,
      );
      continue;
    }

    const esTexto = typeof valor === 'string';
    if (esTexto && PENDIENTE.test(valor)) {
      pendientes.push(id);
      continue;
    }
    if (!esTexto && (valor === null || typeof valor !== 'object')) {
      errores.push(`${id}: se esperaba el minuto ("1:24") o el objeto entero de CTR-04`);
      continue;
    }

    const conf = esTexto ? { ...porDefecto, minuto: valor.trim() } : { ...porDefecto, ...valor };

    if (!MINUTO.test(conf.minuto ?? '')) {
      errores.push(
        `${id}: minuto "${conf.minuto ?? ''}" — va M:SS o MM:SS. Es el campo que separa ` +
          `haber escuchado de haber puesto un tilde, así que no se autocompleta.`,
      );
      continue;
    }
    if (!FECHA.test(conf.fecha ?? '')) {
      errores.push(`${id}: fecha "${conf.fecha ?? ''}" — va AAAA-MM-DD (o poné porDefecto.fecha)`);
      continue;
    }
    if (!DONDES.includes(conf.donde)) {
      errores.push(`${id}: donde "${conf.donde ?? ''}" — va ${DONDES.join(' | ')}`);
      continue;
    }
    if (!conf.quien || conf.quien.trim().length < 3 || !/^[A-ZÁÉÍÓÚÑ]/.test(conf.quien.trim())) {
      errores.push(`${id}: quien "${conf.quien ?? ''}" — el nombre de quien escuchó, con mayúscula`);
      continue;
    }

    confirmadas.set(id, {
      quien: conf.quien.trim(),
      fecha: conf.fecha,
      donde: conf.donde,
      minuto: conf.minuto,
    });
  }

  return { confirmadas, pendientes, errores };
}

/**
 * Palabras que nunca son una buena respuesta.
 *
 * No es una lista de "palabras cortas": es la lista de palabras **intercambiables**. Si
 * el hueco cae en una de estas, el que se sabe el tema no tiene ninguna ventaja sobre el
 * que adivina, y el juego deja de premiar lo que dice premiar.
 */
const VACIAS = new Set([
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'lo', 'al', 'del',
  'de', 'a', 'en', 'con', 'por', 'para', 'sin', 'sobre', 'entre', 'hasta', 'desde', 'hacia',
  'y', 'o', 'u', 'e', 'ni', 'que', 'qué', 'como', 'cómo', 'cuando', 'cuándo', 'donde', 'dónde',
  'si', 'sí', 'no', 'ya', 'muy', 'más', 'mas', 'pero', 'porque', 'aunque', 'también', 'tan',
  'yo', 'tu', 'tú', 'te', 'me', 'se', 'mi', 'mí', 'su', 'sus', 'nos', 'les', 'le', 'él', 'ella',
  'este', 'esta', 'esto', 'ese', 'esa', 'eso', 'aquel', 'todo', 'toda', 'todos', 'todas',
  'es', 'son', 'era', 'fue', 'ser', 'está', 'están', 'estar', 'hay', 'ha', 'he', 'han',
  'soy', 'eres', 'somos', 'voy', 'va', 'van', 'ir', 'te', 'nos', 'os', 'vos',
]);

/** Saca puntuación de los bordes para comparar y para medir. */
function pelar(palabra) {
  return palabra.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
}

function normalizar(palabra) {
  return pelar(palabra).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/**
 * ¿Esta palabra sirve como respuesta?
 *
 * Los cuatro filtros, y por qué cada uno:
 *  · 4 letras o más — abajo de eso casi siempre es una palabra funcional.
 *  · no está en `VACIAS` — intercambiable, ver arriba.
 *  · no lleva número ni signo raro adentro — la respuesta se escribe o se elige, y un
 *    token con paréntesis no se escribe igual dos veces.
 *  · no se repite en el mismo verso — si la palabra está a la vista dos renglones más
 *    arriba, no hay nada que adivinar.
 */
function sirveDeRespuesta(palabra, versoEntero) {
  const limpia = pelar(palabra);
  if (limpia.length < 4) return false;
  if (VACIAS.has(normalizar(limpia))) return false;
  if (!/^[\p{L}\p{M}'-]+$/u.test(limpia)) return false;
  const veces = versoEntero.split(/\s+/).filter((p) => normalizar(p) === normalizar(limpia)).length;
  return veces === 1;
}

/**
 * Elige qué palabra del verso se tapa.
 *
 * **Prefiere la última**, porque es la que rima: el que se sabe el tema la completa aunque
 * no recuerde el verso entero, y el que no se lo sabe puede llegar por la rima con el
 * verso anterior. Es el hueco que más premia saber y menos premia el azar. Si la última
 * no sirve, se prueba hacia atrás.
 */
function elegirPalabra(verso) {
  const palabras = verso.split(/\s+/).filter(Boolean);
  for (let i = palabras.length - 1; i >= 0; i--) {
    if (sirveDeRespuesta(palabras[i], verso)) return i;
  }
  return -1;
}

/** Hash estable: los distractores tienen que salir iguales en cada corrida. */
function hash(texto) {
  let h = 2166136261;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Baraja determinística a partir de una semilla de texto. */
function barajar(lista, semilla) {
  const copia = [...lista];
  let h = hash(semilla);
  for (let i = copia.length - 1; i > 0; i--) {
    h = (Math.imul(h, 1103515245) + 12345) >>> 0;
    const j = h % (i + 1);
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/**
 * Primera pasada (`CTR-04.14` paso 2): los huecos de un tema, **sin nivel y sin contexto**.
 *
 * Recorre la lista de versos del tema —aplanada, `versosDelTema()`— y parte cada verso en
 * `antes` / `respuesta` / `despues`. Lo que no da hueco se cuenta en `descartes` y no
 * vuelve: no depende del nivel, así que tampoco cambia cuando el nivel cambia.
 */
function huecosDe(versos, descartes) {
  const salida = [];
  versos.forEach((texto, i) => {
    const palabras = texto.split(/\s+/).filter(Boolean);
    const idx = elegirPalabra(texto);
    if (idx < 0) {
      descartes.sinPalabra++;
      return;
    }

    const respuesta = pelar(palabras[idx]);
    // La puntuación que colgaba de la palabra se queda afuera del hueco, de su lado: la de
    // atrás en "después", para que la respuesta sea "sombra" y no "sombra," con la coma
    // pegada; y la de adelante en "antes". Hasta `T-288` la de adelante se perdía
    // —"(Rápido!)" quedaba "____ !)", con el paréntesis que cierra y sin el que abre—, y
    // el verso del ítem ya no era el del cancionero (lo encontró `n3`).
    const inicio = palabras[idx].indexOf(respuesta);
    const cabeza = palabras[idx].slice(0, inicio);
    const antes = [...palabras.slice(0, idx), cabeza].filter(Boolean).join(' ');
    const cola = palabras[idx].slice(inicio + respuesta.length);
    const despues = (cola + ' ' + palabras.slice(idx + 1).join(' ')).trim();

    // CTR-04 acota los tres campos. Un verso larguísimo no entra: se descarta entero
    // en vez de recortarlo, porque recortarlo cambiaría el verso.
    if (antes.length > 70 || despues.length > 70 || respuesta.length > 40) {
      descartes.largos++;
      return;
    }
    if (!antes && !despues) return;

    // Un verso que, sacada la respuesta, no deja ni una palabra a la vista no es una
    // pregunta: es una palabra suelta con un signo al lado. La `Invocación` de Lobo
    // suelto daba tres ítems cuyo enunciado entero era "____ !", uno por cada nivel.
    // El jugador que se sabe el tema no tiene ahí ninguna ventaja sobre el que tira.
    if (!(antes + ' ' + despues).replace(/[^\p{L}\p{N}]+/gu, ' ').trim()) {
      descartes.versoPelado++;
      return;
    }

    salida.push({ i, texto, hueco: { antes, respuesta, despues } });
  });
  return salida;
}

/**
 * Segunda pasada (`CTR-04.14` pasos 4 y 5): el nivel del tema, y lo que depende de él.
 *
 * Para cada hueco de un tema del pozo: N es `CONTEXTO_POR_NIVEL[nivel del tema]`,
 * **importado de `banco.ts`** —la tabla de `BR-03` vive en un solo lugar—; si el verso no
 * tiene N vecinos de cada lado, no da ítem. Siguen los descartes que dependen del contexto
 * (un verso de contexto de más de 90 caracteres, menos de 3 distractores: los distractores
 * excluyen lo que está a la vista, y lo que está a la vista depende del contexto). **Recién
 * después se deduplica por huella**: así la huella queda en la primera aparición que puede
 * llevar el contexto de su nivel, y el estribillo que abre la canción no se pierde si
 * vuelve más abajo con sus vecinos completos.
 */
function armarItems(temas, pozo, tercios, vocabulario) {
  const sinConteo = new Set(tercios.sinConteo);
  const items = [];
  const descartes = { sinVecinos: 0, contextoLargo: 0, sinDistractores: 0, repetidos: 0 };
  /** Versos que no dieron ítem por falta de vecinos, por renglón: para nombrarlos si un ancla los busca. */
  const sinVecinos = new Map();
  const repetidos = new Set();

  for (const { tema, versos, huecos } of temas) {
    if (!pozo.has(tema.slug)) continue;
    const dificultad = tercios.porSlug.get(tema.slug);
    const n = CONTEXTO_POR_NIVEL[dificultad];

    for (const { i, texto, hueco } of huecos) {
      const { antes, respuesta, despues } = hueco;
      const ctx = vecinos(versos, i, n);
      if (ctx === null) {
        descartes.sinVecinos++;
        const clave = renglon({ hueco });
        if (!sinVecinos.has(clave)) {
          sinVecinos.set(clave, {
            titulo: tema.titulo,
            dificultad,
            faltanAntes: Math.max(0, n - i),
            faltanDespues: Math.max(0, n - (versos.length - 1 - i)),
          });
        }
        continue;
      }

      // Los versos de contexto también están acotados por CTR-04.
      if ([...ctx.antes, ...ctx.despues].some((l) => l.length > 90)) {
        descartes.contextoLargo++;
        continue;
      }

      // Los distractores: del mismo disco, de largo parecido, y que no estén a la vista.
      const aLaVista = new Set([texto, ...ctx.antes, ...ctx.despues].join(' ').split(/\s+/).map(normalizar));
      const candidatos = [...(vocabulario.get(tema.disco) ?? [])].filter(
        (p) =>
          normalizar(p) !== normalizar(respuesta) &&
          !aLaVista.has(normalizar(p)) &&
          Math.abs(p.length - respuesta.length) <= 3 &&
          p.length <= 40,
      );
      const id = `CL-${String(items.length + 1).padStart(3, '0')}`;
      const distractores = barajar(candidatos, id + respuesta).slice(0, 3);
      if (distractores.length < 3) {
        descartes.sinDistractores++;
        continue;
      }

      // El mismo verso repetido en el estribillo es el mismo ítem. Tres preguntas
      // idénticas en el banco son una sola pregunta y dos rondas regaladas.
      const huella = `${tema.slug}|${antes}|${respuesta}|${despues}`;
      if (repetidos.has(huella)) {
        descartes.repetidos++;
        continue;
      }
      repetidos.add(huella);

      const opciones = barajar(
        [
          { texto: respuesta, correcta: true },
          ...distractores.map((d) => ({ texto: d, correcta: false })),
        ],
        id,
      );

      items.push({
        id,
        us: ['US-03'],
        // CTR-04.14: el nivel del tema, no del verso. Nadie lo elige.
        dificultad,
        dificultadSegun: sinConteo.has(tema.slug) ? 'sin-conteo' : 'en-vivo',
        tema: {
          slug: tema.slug,
          titulo: tema.titulo,
          disco: tema.disco,
          pista: tema.pista,
          anio: tema.anio,
        },
        hueco: { antes, respuesta, despues },
        // BR-03: el contexto lo fija el nivel, y el nivel lo fija el conteo del tema. Ni
        // quien carga ni la posición del verso en su estrofa (`CTR-04.7` enmendado).
        contexto: { antes: ctx.antes, despues: ctx.despues },
        opciones,
        fuentes: ['RES-20'],
        // CTR-04.6 v2: la ficha que respalda al sitio, y el enlace exacto que T-145
        // muestra en el panel. sitio/url/consultado salen tal cual del cancionero.
        fuenteLetra: [{
          ficha: FICHA_POR_SITIO[tema.fuente.sitio],
          sitio: tema.fuente.sitio,
          url: tema.fuente.url,
          consultado: tema.fuente.consultado,
        }],
        sensibleA: ['letra'],
        // Sin confirmación de oído no hay `listo`, y no lo decide un programa. La
        // promoción es un paso aparte, más abajo, y solo la mueve una escucha.
        estado: 'borrador',
        notaInterna: `Hueco elegido a máquina desde ${tema.fuente.sitio}. Confirmar de oído antes de jugarlo.`,
      });
    }
  }

  // Un verso que no dio ítem en una posición pero sí en otra (el estribillo) no está perdido.
  for (const it of items) sinVecinos.delete(renglon(it));
  return { items, descartes, sinVecinos };
}

/** Por qué un verso anclado no está en el banco, si es por falta de vecinos (`CTR-04.14` paso 8). */
function faltaDeVecinos(verso, sinVecinos) {
  const f = sinVecinos.get(verso);
  if (!f) return null;
  const faltan = [
    f.faltanAntes ? `${f.faltanAntes} antes` : '',
    f.faltanDespues ? `${f.faltanDespues} después` : '',
  ].filter(Boolean).join(' y ');
  return (
    `sigue en el cancionero, pero «${f.titulo}» quedó ${f.dificultad} (conteo en vivo, CTR-04.14) y a ese verso ` +
    `le faltan ${faltan} para el contexto que pide BR-03 (${CONTEXTO_POR_NIVEL[f.dificultad]} de cada lado). ` +
    'No es un corrimiento de ids: hay que elegir otro verso de ese tema (contenido).'
  );
}

function main() {
  // ─── Paso 1: el conteo citado, o nada se genera ───────────────────────────────────
  const conteo = existsSync(CONTEO) ? JSON.parse(readFileSync(CONTEO, 'utf-8')).conteo : undefined;
  if (!conteo || !Array.isArray(conteo.temas) || !conteo.ficha || !conteo.consultado) {
    console.error(`
  ${CONTEO} no existe o no trae el bloque "conteo" con su ficha y su fecha. El nivel de
  US-03 sale de ahi (D-46, BR-30, CTR-04.14), y el archivo esta commiteado: si falta, el
  repo esta roto. No se genera un banco todo en "dificil" para taparlo.
`);
    process.exit(1);
  }

  const cancionero = JSON.parse(readFileSync(CANCIONERO, 'utf-8'));
  const archivoConf = existsSync(CONFIRMACIONES)
    ? JSON.parse(readFileSync(CONFIRMACIONES, 'utf-8'))
    : {};
  const confirmaciones = archivoConf.confirmados ?? {};
  const porDefecto = archivoConf.porDefecto ?? {};
  const anterior = existsSync(SALIDA) ? JSON.parse(readFileSync(SALIDA, 'utf-8')) : { items: [] };

  const conFicha = cancionero.temas.filter(
    (t) => t.contenido === 'letra' && FICHA_POR_SITIO[t.fuente.sitio] !== undefined,
  );
  const sinFicha = cancionero.temas.filter(
    (t) => t.contenido === 'letra' && FICHA_POR_SITIO[t.fuente.sitio] === undefined,
  );

  // ─── Paso 2: los huecos, sin nivel y sin contexto ─────────────────────────────────
  const descartesHueco = { sinPalabra: 0, largos: 0, versoPelado: 0 };
  const temas = conFicha.map((tema) => {
    const versos = versosDelTema(tema);
    return { tema, versos, huecos: huecosDe(versos, descartesHueco) };
  });

  // El vocabulario por disco, para que los distractores suenen del mismo mundo. Un
  // distractor sacado de otro disco se nota y se descarta solo: tiene que ser plausible.
  const vocabulario = new Map();
  for (const { tema, versos } of temas) {
    const pozo = vocabulario.get(tema.disco) ?? new Set();
    for (const texto of versos) {
      for (const palabra of texto.split(/\s+/)) {
        if (sirveDeRespuesta(palabra, texto)) pozo.add(pelar(palabra));
      }
    }
    vocabulario.set(tema.disco, pozo);
  }

  // ─── Pasos 3 a 6: el pozo, los tercios, y el punto fijo ───────────────────────────
  //
  // El pozo son los temas con al menos un hueco (`BR-30`: "los temas de los que salen los
  // huecos ya cargados", no los 105). Pero el nivel decide el contexto, y el contexto
  // decide si un verso da ítem: un tema puede quedarse sin ítems y salir del pozo que le
  // dio su nivel. Entonces se saca y se reparte de nuevo, hasta que el pozo no cambie.
  // Como el pozo solo achica, termina; y al terminar vale lo que mira `n1`: los niveles son
  // los de `repartirEnTercios` sobre exactamente los temas que quedaron en el archivo.
  let pozo = new Set(temas.filter((t) => t.huecos.length > 0).map((t) => t.tema.slug));
  const sacados = [];
  let tercios;
  let armado;
  for (;;) {
    tercios = repartirEnTercios(pozo, conteo);
    armado = armarItems(temas, pozo, tercios, vocabulario);
    const quedaron = new Set(armado.items.map((i) => i.tema.slug));
    if (quedaron.size === pozo.size) break;
    for (const slug of pozo) if (!quedaron.has(slug)) sacados.push(`${slug} (era ${tercios.porSlug.get(slug)})`);
    pozo = quedaron;
  }
  const { items, descartes, sinVecinos } = armado;

  // ─── El único paso que mueve un ítem a `listo` ────────────────────────────────────
  const { confirmadas, pendientes, errores } = resolverConfirmaciones(
    confirmaciones,
    porDefecto,
    new Map(items.map((i) => [i.id, renglon(i)])),
    archivoConf.versos ?? {},
  );

  if (errores.length) {
    console.error(`\n✕ ${CONFIRMACIONES} tiene ${errores.length} problema(s). No escribí nada.\n`);
    for (const e of errores) console.error(`   · ${e}`);
    console.error('');
    process.exit(1);
  }

  for (const item of items) {
    const conf = confirmadas.get(item.id);
    if (!conf) continue;
    item.confirmadoDeOido = conf;
    item.cotejo = { regimen: 'oido' };
    item.estado = 'listo';
    item.notaInterna = `Verso confirmado de oído por ${conf.quien} el ${conf.fecha} (${conf.donde}, ${conf.minuto}).`;
  }

  // ─── La tercera vía: la selección curada de `T-138`, bajo `D-25` ──────────────────
  //
  // Solo los ids que `contenido` eligió a mano. Si el ítem ya está `listo` por oído, el
  // régimen fuerte gana y la selección no lo pisa. `dos-fuentes` se evalúa por si algún
  // día una segunda ficha aparece: hoy no puede darse (solapamiento cero, `D-25`).
  //
  // Las anclas son del verso, no del nivel (`CTR-04.14` paso 8): elegir un verso ya no
  // mueve su nivel, y un cambio de nivel no mueve el ancla.
  const seleccion = archivoConf.fuenteUnica?.items ?? [];
  const porId = new Map(items.map((i) => [i.id, i]));

  // ─── `--reanclar`: mover el ancla al id nuevo, sin tocar qué verso eligió nadie ────
  //
  // El guardián de abajo tiene razón en abortar, pero deja al que limpió el cancionero
  // sin salida: los ids son posicionales, así que **cualquier** cambio del filtro —o del
  // nivel de un tema, que cambia qué versos dan ítem— los corre y las anclas de `T-138`
  // quedan colgadas. Rehacer la curaduría a mano sería repetir un trabajo que ya se hizo, y
  // sobre los mismos versos.
  //
  // Este atajo mueve el ancla **solo si el verso elegido sigue existiendo, idéntico y en
  // un único ítem**. Lo que se conserva es la decisión —*este verso va*—, que es lo que
  // `contenido` eligió; el número nunca fue el dato. Si el verso ya no está, o está dos
  // veces, no se adivina: se informa y se aborta, como siempre.
  if (process.argv.includes('--reanclar')) {
    const porVerso = new Map();
    for (const i of items) {
      const r = renglon(i);
      porVerso.set(r, porVerso.has(r) ? null : i.id); // null = ambiguo, no se toca
    }
    const movidas = [];
    const perdidas = [];
    for (const ancla of seleccion) {
      if (!ancla.verso) continue;
      if (porId.get(ancla.id) && renglon(porId.get(ancla.id)) === ancla.verso) continue;
      const nuevo = porVerso.get(ancla.verso);
      if (!nuevo) {
        const vecinosQueFaltan = nuevo === undefined ? faltaDeVecinos(ancla.verso, sinVecinos) : null;
        perdidas.push(
          `${ancla.id}: «${ancla.verso}» ` +
            (nuevo === null ? 'aparece en más de un ítem' : vecinosQueFaltan ?? 'ya no está en el banco'),
        );
        continue;
      }
      movidas.push(`${ancla.id} → ${nuevo}: «${ancla.verso}»`);
      ancla.id = nuevo;
    }
    if (perdidas.length) {
      console.error(`\n✕ --reanclar: ${perdidas.length} ancla(s) no se pueden mover solas. No escribí nada.\n`);
      for (const p of perdidas) console.error(`   · ${p}`);
      console.error('   Esas hay que rehacerlas a mano: el verso que eligió contenido ya no da ítem igual.\n');
      process.exit(1);
    }
    writeFileSync(CONFIRMACIONES, JSON.stringify(archivoConf, null, 2), 'utf-8');
    console.log(`↻ ${CONFIRMACIONES}: ${movidas.length} ancla(s) movidas al id nuevo.`);
    for (const m of movidas) console.log(`   · ${m}`);
    console.log('');
  }

  const noEncontrados = [];
  const corridos = [];
  for (const { id, motivo, verso } of seleccion) {
    const item = porId.get(id);
    if (!item) {
      noEncontrados.push(id);
      continue;
    }

    // **El mismo guardian que `confirmados`, y hacia falta.** Los ids son posicionales,
    // asi que un banco regenerado con otro filtro los corre: el verso que hoy es
    // `CL-045` manana puede ser otro, y la curaduria de `T-138` se mudaria sola a un
    // verso que nadie eligio. `REV-08` lo encontro de la peor manera — al endurecer el
    // filtro por `FIND-30`, varias anclas apuntaban a ruido (`"[Parte] 1 de 2"`,
    // `"[fill] 1"`). Bajo `D-25` esos items van directo a la pantalla sin que nadie los
    // coteje, asi que un corrimiento silencioso es exactamente el dano que `CTR-04`
    // existe para impedir.
    if (verso && verso !== renglon(item)) {
      const vecinosQueFaltan = faltaDeVecinos(verso, sinVecinos);
      corridos.push(
        vecinosQueFaltan
          ? `${id}: «${verso}» ${vecinosQueFaltan}`
          : `${id}: elegiste «${verso}» y ahora ahi hay «${renglon(item)}»`,
      );
      continue;
    }
    if (item.estado === 'listo') continue; // ya promovido por oído
    if (item.fuenteLetra.length >= 2) {
      item.cotejo = { regimen: 'dos-fuentes' };
    } else {
      item.cotejo = { regimen: 'fuente-unica', decision: 'D-25' };
    }
    item.estado = 'listo';
    item.notaInterna = `Promovido por T-138 bajo D-25 (fuente unica). Motivo: ${motivo}`;
  }
  if (corridos.length) {
    console.error(`\n✕ ${CONFIRMACIONES}, fuenteUnica: ${corridos.length} seleccion(es) apuntan a otro verso. No escribi nada.`);
    for (const c of corridos) console.error(`   · ${c}`);
    console.error('   Si es un corrimiento de ids, corré con --reanclar. Si al verso le faltan vecinos, elegí otro.\n');
    process.exit(1);
  }
  if (noEncontrados.length) {
    console.error(`\n✕ ${CONFIRMACIONES}, fuenteUnica: ${noEncontrados.length} id(s) no existen en el banco generado: ${noEncontrados.join(', ')}.`);
    console.error('   Los ids cambian si cambia el cancionero o el nivel de un tema. Corré con --reanclar. No escribi nada.\n');
    process.exit(1);
  }

  // ─── Paso 7: escribir ─────────────────────────────────────────────────────────────
  const hoy = new Date().toISOString().slice(0, 10);
  writeFileSync(
    SALIDA,
    JSON.stringify(
      {
        contrato: 'CTR-04',
        contratoVersion: 3,
        juego: 'completar-la-letra',
        actualizado: hoy,
        modoRespuesta: 'opciones',
        // El sello del conteo con el que se calcularon los niveles. El número de cada tema
        // no se copia: vive en setlistfm.json y en ningún otro lado (CTR-04.1 v3).
        conteo: { ficha: conteo.ficha, consultado: conteo.consultado },
        items,
      },
      null,
      2,
    ),
    'utf-8',
  );

  // ─── Paso 9: lo que `contenido` y `producto` tienen que poder ver ─────────────────
  const listos = items.filter((i) => i.estado === 'listo');
  const contar = (lista) => {
    const c = { facil: 0, media: 0, dificil: 0 };
    for (const i of lista) c[i.dificultad]++;
    return c;
  };

  const porSitio = {};
  for (const t of conFicha) porSitio[t.fuente.sitio] = (porSitio[t.fuente.sitio] ?? 0) + 1;
  console.log(`conteo:         ${conteo.ficha} del ${conteo.consultado} (setlistfm.json)`);
  console.log(`temas usados:   ${conFicha.length} con ficha ${JSON.stringify(porSitio)}, ${pozo.size} en el pozo`);
  if (sinFicha.length) {
    const faltan = {};
    for (const t of sinFicha) faltan[t.fuente.sitio] = (faltan[t.fuente.sitio] ?? 0) + 1;
    console.log(`sin ficha:      ${sinFicha.length} temas afuera ${JSON.stringify(faltan)}`);
  }
  console.log(`temas por nivel: ${JSON.stringify(tercios.porNivel)} (tercios de CTR-19.15 sobre ${tercios.conConteo} con conteo)`);
  if (tercios.sinConteo.length) {
    const titulo = new Map(conFicha.map((t) => [t.slug, t.titulo]));
    console.log(`sin conteo:     ${tercios.sinConteo.length} → dificil (D-27): ${tercios.sinConteo.map((s) => titulo.get(s) ?? s).join(', ')}`);
  }
  if (sacados.length) {
    console.log(`fuera del pozo: ${sacados.join(', ')} — ningún verso con el contexto de su nivel`);
  }
  console.log(`candidatos:     ${items.length}  ${JSON.stringify(contar(items))}`);
  console.log(
    `descartados:    ${descartesHueco.sinPalabra} sin palabra buena, ${descartesHueco.largos} largos, ` +
      `${descartesHueco.versoPelado} sin verso alrededor, ${descartes.sinVecinos} sin los vecinos de su nivel, ` +
      `${descartes.contextoLargo} con contexto largo, ${descartes.sinDistractores} sin distractores, ` +
      `${descartes.repetidos} repetidos`,
  );
  if (pendientes.length) {
    console.log(`en la hoja:     ${pendientes.length} verso(s) anotados sin escuchar todavía`);
  }
  const porNivelListos = contar(listos);
  console.log(`LISTOS:         ${listos.length}  ${JSON.stringify(porNivelListos)}`);

  // Las anclas que `contenido` eligió y el contrato dejó sin ítem, apartadas sin borrarse.
  // No se promueven: esperan que `contenido` elija otro verso. Si alguna vuelve a dar ítem
  // (el tema cambió de nivel con un conteo nuevo), se dice, y devolverla es de `contenido`.
  const enEspera = archivoConf.fuenteUnica?.enEspera ?? [];
  if (enEspera.length) {
    const hay = new Set(items.map(renglon));
    console.log(`en espera:      ${enEspera.length} ancla(s) de fuenteUnica sin ítem, para que contenido las reemplace:`);
    for (const a of enEspera) {
      console.log(`   · «${a.verso}» ${hay.has(a.verso) ? '— ahora SÍ da ítem: se puede devolver a items' : ''}`.trimEnd());
    }
  }

  const CUOTA_FACILES = 4; // US-03, "Piso de ítems". Se mide, no se fuerza.
  if (porNivelListos.facil < CUOTA_FACILES) {
    console.log(
      `\n⚠ Fáciles jugables: ${porNivelListos.facil} de ${CUOTA_FACILES}. No es un banco roto: es trabajo de ` +
        'contenido, cargar huecos de temas del tercio de arriba (BR-30).',
    );
  } else {
    console.log(`Fáciles jugables: ${porNivelListos.facil}, la cuota de US-03 es ${CUOTA_FACILES}.`);
  }

  // Los `listo` que cambiaron de nivel, cruzados por tema y verso —no por id, que se corre—.
  const antes = new Map(
    (anterior.items ?? []).filter((i) => i.estado === 'listo').map((i) => [`${i.tema.slug}|${renglon(i)}`, i.dificultad]),
  );
  const cambiaron = listos
    .filter((i) => antes.has(`${i.tema.slug}|${renglon(i)}`) && antes.get(`${i.tema.slug}|${renglon(i)}`) !== i.dificultad)
    .map((i) => `${i.id} «${renglon(i)}» (${i.tema.titulo}): ${antes.get(`${i.tema.slug}|${renglon(i)}`)} → ${i.dificultad}`);
  if (cambiaron.length) {
    console.log(`\ncambiaron de nivel (${cambiaron.length} listo), y con el nivel su contexto (BR-03):`);
    for (const c of cambiaron) console.log(`   · ${c}`);
  }

  // La cota de CTR-04.4, sobre lo que el sitio publica.
  const versosPorTema = new Map();
  for (const i of listos) {
    const s = versosPorTema.get(i.tema.slug) ?? new Set();
    for (const v of [...i.contexto.antes, ...i.contexto.despues]) s.add(v);
    s.add(`${i.hueco.antes}${i.hueco.respuesta}${i.hueco.despues}`);
    versosPorTema.set(i.tema.slug, s);
  }
  const pasados = [...versosPorTema].filter(([, s]) => s.size > 8).map(([slug, s]) => `${slug} (${s.size})`);
  if (pasados.length) {
    console.log(`\n⚠ temas listo con más de 8 versos distintos (CTR-04.4, precaución, no cerrojo): ${pasados.join(', ')}`);
  }

  const PISO = 15; // US-03
  if (listos.length === 0) {
    console.log(`\nEl juego sigue apagado: ningún verso confirmado (CTR-04).`);
    console.log(`Sacá la hoja de escucha con:  npm run hoja-de-escucha`);
  } else if (listos.length < PISO) {
    console.log(`\nEl juego se prende, pero falta el piso de US-03: ${listos.length} de ${PISO}.`);
    console.log(`Quedan ${pendientes.length} verso(s) anotados esperando el minuto.`);
  } else {
    console.log(`\n✔ Piso de US-03 cumplido: ${listos.length} ítems jugables (pedía ${PISO}).`);
    if (pendientes.length) console.log(`  Quedan ${pendientes.length} anotados sin escuchar, que suman cuando quieras.`);
  }
}

main();
