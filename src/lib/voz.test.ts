import { test } from 'node:test';
import assert from 'node:assert/strict';

import * as sitio from './sitio/copy.ts';
import * as quiz from './quiz/copy.ts';
import * as tema from './tema/copy.ts';
import * as letra from './letra/copy.ts';
import * as tapa from './tapa/copy.ts';

/**
 * La auditoria a maquina de `.claude/rules/voz-ricotera.md`, seccion 8.
 *
 * El mismo criterio que `estilos.test.ts` aplicado al texto en vez de al pixel: lo
 * auditable se audita solo, y lo demas lo escucha el que revisa. Un anglicismo, un boton
 * en infinitivo o una formula de folleto entran por costumbre, no por decision — y si no
 * hay nada que los frene, vuelven en la proxima pantalla.
 *
 * Solo mira lo que **se lee**. Los identificadores del codigo quedan afuera por el limite
 * explicito de `D-17`.
 */

/** Todas las cadenas visibles de un modulo de copy. Las funciones se saltean: se
 *  invocan con datos y no se pueden auditar sin inventarlos. */
function cadenas(modulo: Record<string, unknown>): string[] {
  const salida: string[] = [];
  // Una ruta o un archivo de arte no es texto que alguien lea: `/quiz/` es el nombre de
  // una carpeta, y `D-17` manda sobre lo que se lee, no sobre como se llama una carpeta.
  const esRuta = (s: string): boolean => /^[/#]|^https?:|\.(svg|png|jpg|webp|mp3|json)$/.test(s);
  const recorrer = (valor: unknown): void => {
    if (typeof valor === 'string') {
      if (!esRuta(valor)) salida.push(valor);
    }
    else if (Array.isArray(valor)) valor.forEach(recorrer);
    else if (valor && typeof valor === 'object') Object.values(valor).forEach(recorrer);
  };
  recorrer(modulo);
  return salida;
}

const MODULOS: ReadonlyArray<readonly [string, Record<string, unknown>]> = [
  ['sitio', sitio],
  ['quiz', quiz],
  ['tema', tema],
  ['letra', letra],
  ['tapa', tapa],
];

const VISIBLE: ReadonlyArray<readonly [string, string]> = MODULOS.flatMap(([donde, modulo]) =>
  cadenas(modulo).map((texto) => [donde, texto] as const),
);

const sinTilde = (s: string): string => s.normalize('NFD').replace(/[̀-ͯ]/g, '');

/** Busca un patron en todo lo visible y devuelve donde aparecio. */
function infracciones(patron: RegExp): string[] {
  return VISIBLE.filter(([, texto]) => patron.test(sinTilde(texto).toLowerCase())).map(
    ([donde, texto]) => `${donde}: "${texto}"`,
  );
}

test('D-17: no entra un anglicismo en lo que se lee', () => {
  const glosario = /\b(feedback|reveal|display|quiz|link|score|player|gaming|ranking|challenge|share|tips?|loading|hint|combo|streak|highscore)\b/;
  assert.deepEqual(infracciones(glosario), []);
});

test('voz 7: ninguna formula de folleto', () => {
  const folleto =
    /(descubri todo|sumergite|la experiencia (definitiva|unica)|y listo!|a jugar!|no es solo .+,? es |increible|imperdible|unico e|la mejor forma de)/;
  assert.deepEqual(infracciones(folleto), []);
});

test('voz 3.8: a la gente se la nombra "la gente", no "los fans" ni "los usuarios"', () => {
  // 333 veces "la gente" contra 2 "los fans" en el memoir. El pie puede decir "sitio de
  // fans" —ahi el sitio se nombra a si mismo—, asi que la regla mira el articulo.
  assert.deepEqual(infracciones(/\b(los fans|las? usuarios?|los? usuarios?|nuestra comunidad)\b/), []);
});

test('voz 4.2 (D-17): ningun boton ni enlace en infinitivo', () => {
  // Se mira la primera palabra: un boton empieza por el verbo. "Escuchalo entero" pasa,
  // "Escuchar entero" no.
  const INFINITIVOS = new Set([
    'empezar', 'comenzar', 'jugar', 'seguir', 'continuar', 'volver', 'compartir', 'escuchar',
    'parar', 'arriesgar', 'pasar', 'ver', 'mirar', 'ir', 'elegir', 'buscar', 'copiar',
    'descargar', 'bajar', 'armar', 'tocar', 'leer', 'probar', 'reintentar', 'cerrar', 'abrir',
  ]);
  const malos = VISIBLE.filter(([, texto]) => {
    const primera = sinTilde(texto.trim().split(/\s+/)[0] ?? '').toLowerCase().replace(/[^a-z]/g, '');
    return INFINITIVOS.has(primera);
  }).map(([donde, texto]) => `${donde}: "${texto}"`);
  assert.deepEqual(malos, []);
});

test('voz 4.1: la linea grande no pasa de ocho palabras', () => {
  // El verso mediano de los 104 temas tiene 5 palabras y el 90% no pasa de 8. Lo que no
  // entra en ocho no es un titulo: es una explicacion disfrazada.
  const grandes: Array<[string, string]> = [
    ['portal.titulo', sitio.PORTAL.titulo],
    ['redondopedia.titulo', sitio.REDONDOPEDIA.titulo],
    ...sitio.JUEGOS.map((c) => [`casete "${c.titulo}"`, c.titulo] as [string, string]),
    ['casete cancionero', sitio.CASETE_CANCIONERO.titulo],
    ['casete redondopedia', sitio.CASETE_REDONDOPEDIA.titulo],
    ...Object.entries(quiz.TRAMOS).map(([k, v]) => [`quiz tramo ${k}`, v.titulo] as [string, string]),
    ...Object.entries(sitio.COCINA).map(([k, v]) => [`cocina ${k}`, v.titulo] as [string, string]),
  ];
  const largos = grandes
    .filter(([, texto]) => texto.trim().split(/\s+/).length > 8)
    .map(([donde, texto]) => `${donde}: "${texto}"`);
  assert.deepEqual(largos, []);
});

test('voz 5: la bajada de un casete arranca cantando, y el verso no pasa de ocho', () => {
  // La regla de las dos lineas: el titulo nombra ("Adivina la tapa") y la bajada canta.
  // Lo que canta es la primera frase; lo que viene despues explica y puede ser largo.
  const bajadas: Array<[string, string]> = [
    ['portal', sitio.PORTAL.bajada],
    ...sitio.JUEGOS.map((c) => [`casete "${c.titulo}"`, c.baja] as [string, string]),
    ['casete cancionero', sitio.CASETE_CANCIONERO.baja],
    ['casete redondopedia', sitio.CASETE_REDONDOPEDIA.baja],
  ];
  const largos = bajadas
    .filter(([, texto]) => (texto.split(/(?<=\.)\s+/)[0] ?? '').trim().split(/\s+/).length > 8)
    .map(([donde, texto]) => `${donde}: "${texto.split(/(?<=\.)\s+/)[0]}"`);
  assert.deepEqual(largos, []);
});

test('voz 3.7: no hay puntos suspensivos en un boton ni en un rotulo', () => {
  // El suspensivo es de la prosa que cuenta. En una instruccion no es estilo, es
  // ambiguedad.
  const cortos = VISIBLE.filter(
    ([, texto]) => texto.trim().split(/\s+/).length <= 4 && /(…|\.\.\.)/.test(texto),
  ).map(([donde, texto]) => `${donde}: "${texto}"`);
  assert.deepEqual(cortos, []);
});
