/**
 * Genera el banco candidato de "completar la letra" (`US-03`, `CTR-04`).
 *
 * ─── Lo que este script NO hace, y es lo más importante ─────────────────────────────
 *
 * **No marca nada como `listo`.** Todo sale `borrador`. `CTR-04` pide, para que un ítem
 * entre a la partida, o dos fuentes de letra o una confirmación de oído contra el disco
 * — y ninguna de las dos cosas la puede producir un programa. Ponerle `listo` a un verso
 * que nadie escuchó sería exactamente la mentira que `CLAUDE.md` declara como lo único
 * estricto que le queda al proyecto: si la respuesta está mal, **el juego le marca error
 * al que se sabe el tema**.
 *
 * La confirmación entra por `src/data/letra-confirmaciones.json`, que llena una persona
 * con la fecha, dónde escuchó y en qué minuto. Este script la lee y promueve solo eso.
 *
 * **Y no genera de todo el cancionero, sino de los 14 temas cuya letra salió de
 * letras.com**, que es la única fuente de letras con ficha propia (`RES-23`). Los otros
 * 82 vienen de cifraclub, que todavía no tiene ficha: citarle una inventada sería el
 * mismo problema de rótulo por otra puerta. Hay 337 versos ahí, muy por encima del piso
 * de 15 de `US-03`. La propuesta para fichar cifraclub quedó en `Docs/SUGERENCIAS/`.
 *
 * ─── Lo que sí hace ────────────────────────────────────────────────────────────────
 *
 * Elegir el hueco. Un hueco es bueno cuando la palabra que falta es adivinable por rima,
 * por sentido o por saberse el tema, y es malo cuando es intercambiable ("de", "que",
 * "y"): ahí el juego premia la suerte, no el saber. Los filtros de `sirveDeRespuesta()`
 * son esa distinción hecha código, y son deliberadamente duros — de 337 versos entran
 * los que pasan, no los que hagan falta para llegar a un número.
 *
 * Correr desde la raíz:  node --experimental-strip-types scripts/generar-letra.mjs
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const CANCIONERO = 'src/data/cancionero.json';
const CONFIRMACIONES = 'src/data/letra-confirmaciones.json';
const SALIDA = 'src/data/letra.json';

/** La ficha que evaluó letras.com como fuente de letras. */
const FICHA_LETRA = 'RES-23';

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

/** Los versos de letra de un tema, en orden, con la sección a la que pertenecen. */
function versosDe(tema) {
  const salida = [];
  for (const seccion of tema.secciones) {
    const lineas = seccion.lineas.filter((l) => l.t === 'letra' && (l.texto ?? '').trim());
    lineas.forEach((linea, i) => {
      salida.push({ texto: linea.texto.trim(), enSeccion: i, deSeccion: lineas });
    });
  }
  return salida;
}

function main() {
  const cancionero = JSON.parse(readFileSync(CANCIONERO, 'utf-8'));
  const confirmaciones = existsSync(CONFIRMACIONES)
    ? JSON.parse(readFileSync(CONFIRMACIONES, 'utf-8')).confirmados ?? {}
    : {};

  const temas = cancionero.temas.filter(
    (t) => t.contenido === 'letra' && t.fuente.sitio === 'letras.com',
  );

  // El vocabulario por disco, para que los distractores suenen del mismo mundo. Un
  // distractor sacado de otro disco se nota y se descarta solo: tiene que ser plausible.
  const vocabulario = new Map();
  for (const tema of temas) {
    const pozo = vocabulario.get(tema.disco) ?? new Set();
    for (const { texto } of versosDe(tema)) {
      for (const palabra of texto.split(/\s+/)) {
        if (sirveDeRespuesta(palabra, texto)) pozo.add(pelar(palabra));
      }
    }
    vocabulario.set(tema.disco, pozo);
  }

  const items = [];
  let n = 0;
  const descartes = { sinPalabra: 0, sinDistractores: 0 };

  for (const tema of temas) {
    for (const verso of versosDe(tema)) {
      const palabras = verso.texto.split(/\s+/).filter(Boolean);
      const idx = elegirPalabra(verso.texto);
      if (idx < 0) {
        descartes.sinPalabra++;
        continue;
      }

      const respuesta = pelar(palabras[idx]);
      const antes = palabras.slice(0, idx).join(' ');
      // La puntuación que colgaba de la palabra se queda del lado de "después", para que
      // la respuesta sea la palabra pelada y no "sombra," con la coma pegada.
      const cola = palabras[idx].slice(palabras[idx].indexOf(respuesta) + respuesta.length);
      const despues = (cola + ' ' + palabras.slice(idx + 1).join(' ')).trim();

      // CTR-04 acota los tres campos. Un verso larguísimo no entra: se descarta entero
      // en vez de recortarlo, porque recortarlo cambiaría el verso.
      if (antes.length > 70 || despues.length > 70 || respuesta.length > 40) continue;
      if (!antes && !despues) continue;

      // BR-03: el contexto lo fija el nivel, no lo elige quien carga.
      const previos = verso.deSeccion.slice(Math.max(0, verso.enSeccion - 2), verso.enSeccion);
      const siguientes = verso.deSeccion.slice(verso.enSeccion + 1, verso.enSeccion + 3);
      let dificultad;
      let ctxAntes;
      let ctxDespues;
      if (previos.length >= 2 && siguientes.length >= 2) {
        dificultad = 'facil';
        ctxAntes = previos.slice(-2);
        ctxDespues = siguientes.slice(0, 2);
      } else if (previos.length >= 1 && siguientes.length >= 1) {
        dificultad = 'media';
        ctxAntes = previos.slice(-1);
        ctxDespues = siguientes.slice(0, 1);
      } else {
        dificultad = 'dificil';
        ctxAntes = [];
        ctxDespues = [];
      }
      // Los versos de contexto también están acotados por CTR-04.
      if ([...ctxAntes, ...ctxDespues].some((l) => l.texto.trim().length > 90)) continue;

      // Los distractores: del mismo disco, de largo parecido, y que no estén a la vista.
      const aLaVista = new Set(
        [verso.texto, ...ctxAntes.map((l) => l.texto), ...ctxDespues.map((l) => l.texto)]
          .join(' ')
          .split(/\s+/)
          .map(normalizar),
      );
      const pozo = [...(vocabulario.get(tema.disco) ?? [])].filter(
        (p) =>
          normalizar(p) !== normalizar(respuesta) &&
          !aLaVista.has(normalizar(p)) &&
          Math.abs(p.length - respuesta.length) <= 3 &&
          p.length <= 40,
      );
      const id = `CL-${String(n + 1).padStart(3, '0')}`;
      const distractores = barajar(pozo, id + respuesta).slice(0, 3);
      if (distractores.length < 3) {
        descartes.sinDistractores++;
        continue;
      }

      const opciones = barajar(
        [
          { texto: respuesta, correcta: true },
          ...distractores.map((d) => ({ texto: d, correcta: false })),
        ],
        id,
      );

      const confirmada = confirmaciones[id];
      n++;
      items.push({
        id,
        us: ['US-03'],
        dificultad,
        tema: {
          slug: tema.slug,
          titulo: tema.titulo,
          disco: tema.disco,
          pista: tema.pista,
          anio: tema.anio,
        },
        hueco: { antes, respuesta, despues },
        contexto: { antes: ctxAntes.map((l) => l.texto.trim()), despues: ctxDespues.map((l) => l.texto.trim()) },
        opciones,
        fuentes: ['RES-20'],
        fuenteLetra: [FICHA_LETRA],
        ...(confirmada ? { confirmadoDeOido: confirmada } : {}),
        sensibleA: ['letra'],
        // Sin confirmación de oído no hay `listo`, y no lo decide un programa.
        estado: confirmada ? 'listo' : 'borrador',
        notaInterna: `Hueco elegido a máquina desde ${tema.fuente.sitio}. Confirmar de oído antes de jugarlo.`,
      });
    }
  }

  const hoy = new Date().toISOString().slice(0, 10);
  writeFileSync(
    SALIDA,
    JSON.stringify(
      {
        contrato: 'CTR-04',
        contratoVersion: 1,
        juego: 'completar-la-letra',
        actualizado: hoy,
        modoRespuesta: 'opciones',
        items,
      },
      null,
      2,
    ),
    'utf-8',
  );

  const listos = items.filter((i) => i.estado === 'listo').length;
  const porNivel = { facil: 0, media: 0, dificil: 0 };
  for (const i of items) porNivel[i.dificultad]++;

  console.log(`temas usados:   ${temas.length} (letras.com, la fuente con ficha RES-23)`);
  console.log(`candidatos:     ${items.length}  ${JSON.stringify(porNivel)}`);
  console.log(`descartados:    ${descartes.sinPalabra} sin palabra buena, ${descartes.sinDistractores} sin distractores`);
  console.log(`LISTOS:         ${listos}${listos === 0 ? '  ← ninguno: falta confirmar de oído (CTR-04)' : ''}`);
  console.log(`\nPara habilitar el juego, confirmá versos en ${CONFIRMACIONES} y volvé a correr esto.`);
}

main();
