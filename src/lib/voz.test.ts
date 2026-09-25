import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

import * as sitio from './sitio/copy.ts';
import * as quiz from './quiz/copy.ts';
import * as tema from './tema/copy.ts';
import * as letra from './letra/copy.ts';
import * as tapa from './tapa/copy.ts';
import * as porLaLetra from './por-la-letra/copy.ts';
import * as correccion from './correccion/copy.ts';
import * as dosEjes from './dos-ejes/copy.ts';
import * as ponelos from './ponelos/copy.ts';
import * as skayboy from './skayboy/copy.ts';
import * as masOMenos from './mas-o-menos/copy.ts';
import { FILAS } from './ponelos/filas.ts';

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
  // Los dos del ciclo 9. `US-07` es un juego nuevo, y el copy de correccion es todo
  // registro 3 — el que mas tienta decorar, y el que menos puede.
  ['por-la-letra', porLaLetra],
  ['correccion', correccion],
  // `US-08`. Entra con el juego y no despues: el copy de "Ponelos en fila" son treinta
  // cadenas y **la mitad solo las escucha quien usa lector de pantalla**, que es justo la
  // mitad que nadie revisa mirando.
  ['ponelos', ponelos],
  // `US-06`. **Estuvo importado y fuera del barrido hasta el censo de mas abajo**, que es
  // justo el defecto que el censo existe para que no vuelva a pasar: el modulo se importaba
  // arriba para sacarle el `h1` a la prueba de largo, asi que desde afuera parecia
  // auditado. Su propio docstring lo afirmaba —"Las audita `voz.test.ts`"— y era falso: lo
  // que audita el recolector de mas abajo son las 44 cadenas del **JSON**, no las once de
  // este archivo.
  ['dos-ejes', dosEjes],
  // `US-09`, el juego del ciclo 15. Entra con el primer archivo del juego y no despues,
  // que es la leccion de `dos-ejes`: un modulo que llega tarde al barrido pasa un tiempo
  // pareciendo auditado sin estarlo. Las cadenas salen de `CNT-17`..`CNT-19`.
  ['skayboy', skayboy],
  // `US-10`, el del 2026-09-25. Entra con el juego, por la misma lección. Las cadenas son
  // de `CNT-25`; las preguntas de los datos a mano viven en el JSON y las mira el recolector
  // del banco, más abajo.
  ['mas-o-menos', masOMenos],
];

/*
 * El censo de modulos de copy, y por que no alcanza con la lista de arriba.
 *
 * La lista de arriba es una declaracion: dice quien entra al barrido. Lo que no puede hacer
 * sola es **enterarse de lo que existe**. Mientras fue lo unico que habia, un `copy.ts`
 * nuevo no rompia nada — simplemente dejaba de mirarse, y el build seguia verde con
 * anglicismos y botones en infinitivo adentro. Es el mismo agujero por el que `"Link
 * copiado"` estuvo tres ciclos en produccion, corrido un nivel: antes se escapaba la cadena
 * suelta adentro de una isla, ahora se escapa el archivo entero.
 *
 * El mecanismo esta copiado del censo de paginas de `sitio/rutas-sonoras.test.ts`, y el
 * criterio es el mismo: **no declara nada solo —eso seria adivinar— pero tampoco deja pasar
 * de largo**. Quien sume un modulo tiene que abrir este archivo, importarlo y ponerlo en
 * `MODULOS`. Si no lo hace, el build se cae aca con el nombre del archivo.
 */

/** Todos los `copy.ts` que hay en disco, nombrados igual que las claves de `MODULOS`. */
function copyEnDisco(): string[] {
  const raiz = 'src/lib';
  const encontrados: string[] = [];
  const recorrer = (dir: string): void => {
    for (const entrada of readdirSync(dir, { withFileTypes: true })) {
      const completa = join(dir, entrada.name);
      if (entrada.isDirectory()) recorrer(completa);
      else if (entrada.name === 'copy.ts') {
        encontrados.push(relative(raiz, completa).split(sep).join('/'));
      }
    }
  };
  recorrer(raiz);
  return encontrados.sort();
}

/** Lo que esta de un lado y no del otro. Aparte, para poder probarlo contra un caso falso. */
function sinDeclarar(enDisco: readonly string[], declarados: readonly string[]): string[] {
  return enDisco.filter((p) => !declarados.includes(p));
}

const DECLARADOS = MODULOS.map(([nombre]) => `${nombre}/copy.ts`).sort();

test('el censo: no hay un modulo de copy que nadie audite', () => {
  assert.deepEqual(
    sinDeclarar(copyEnDisco(), DECLARADOS),
    [],
    'hay modulos de copy fuera del barrido: importalos arriba y agregalos a `MODULOS`',
  );
});

test('el censo tampoco deja un modulo declarado que ya no existe', () => {
  // El reves, y no es simetria por prolijidad: una entrada fantasma en `MODULOS` no audita
  // nada y ademas **miente sobre la cobertura**, que es peor que el hueco declarado.
  assert.deepEqual(sinDeclarar(DECLARADOS, copyEnDisco()), []);
});

test('ese censo sabe encontrar: se prueba contra un modulo que nadie declaro', () => {
  /*
   * Un test que solo verifica ausencias no demuestra que sepa buscar, y se vuelve verde por
   * vago sin que nadie se entere. El caso es el que viene: un juego nuevo trae su `copy.ts`
   * y nadie se acuerda de esta lista.
   *
   * **Las dos listas son inventadas a proposito, y no mezcladas con el disco.** La primera
   * version de esta prueba le sumaba el intruso a `copyEnDisco()`, y eso la hacia depender
   * de que el nombre inventado no existiera: cuando se creo `src/lib/skayboy/copy.ts` de
   * verdad —para demostrar que el censo rompia— el intruso aparecio dos veces y el caso de
   * prueba fallo por una razon que no tenia nada que ver con lo que mide.
   */
  const enDisco = ['quiz/copy.ts', 'skayboy/copy.ts', 'tema/copy.ts'];
  const declarados = ['quiz/copy.ts', 'tema/copy.ts'];
  assert.deepEqual(sinDeclarar(enDisco, declarados), ['skayboy/copy.ts']);
  // Y no se queja cuando esta todo declarado, ni cuando sobra una declaracion.
  assert.deepEqual(sinDeclarar(declarados, declarados), []);
  assert.deepEqual(sinDeclarar(declarados, enDisco), []);
});

/**
 * El banco del test de dos ejes (`US-06`), que no vive en un `copy.ts` sino en un JSON.
 *
 * **Por que hay un recolector aparte.** El `cadenas()` de arriba recorre todo y sirve para
 * un modulo de copy, donde todo lo que hay es texto que se lee. En este JSON conviven las
 * cadenas visibles con identificadores —`EJ-001`, `luz-oscuridad`, `orden`, `listo`— que
 * `D-17` deja explicitamente afuera: son nombres de cosas del codigo, no algo que alguien
 * lea en pantalla. Recorrerlo entero llenaria la auditoria de falsos positivos.
 *
 * **Y por que existe.** Hasta el ciclo 8 este archivo miraba solo los cinco `copy.ts`, asi
 * que las 44 cadenas que el test de dos ejes le muestra al jugador —20 enunciados, 40
 * opciones, 4 nombres de cuadrante y 4 bajadas— no pasaban por ninguna de las siete reglas
 * de la seccion 8. En un proyecto cuya postura es que **se audita a maquina lo auditable**,
 * eso era un hueco: pasaba lo que nadie mirara.
 */
function cadenasDelBanco(): string[] {
  interface Crudo {
    readonly items: readonly {
      readonly enunciado: string;
      readonly opciones: readonly { readonly texto: string }[];
      readonly estado: string;
    }[];
    readonly cuadrantes: readonly { readonly nombre: string; readonly bajada: string }[];
  }
  const banco = JSON.parse(readFileSync('src/data/dos-ejes.json', 'utf-8')) as Crudo;
  const salida: string[] = [];
  // Un item retirado ya no se le muestra a nadie: auditarlo seria pedirle correccion a algo
  // que el juego no sirve. El historial se conserva; la vara se aplica a lo que se lee.
  for (const i of banco.items.filter((x) => x.estado === 'listo')) {
    salida.push(i.enunciado, ...i.opciones.map((o) => o.texto));
  }
  for (const c of banco.cuadrantes) salida.push(c.nombre, c.bajada);
  return salida;
}

/**
 * Los cuatro nombres de fila de `US-08`, que no viven en un `copy.ts` sino en `filas.ts`.
 *
 * **Por que estan aca y no importados con el resto.** `filas.ts` es un modulo hoja que no
 * importa nada —esa es la condicion para que lo puedan leer la pagina, la isla y el
 * empaquetado del link—, asi que los nombres viven con los numeros de fila y con la clave
 * de cada una. Recorrer el modulo entero con `cadenas()` auditaria tambien `valla`,
 * `medio`, `atras` y `vereda`, que son identificadores del codigo y `D-17` los deja
 * explicitamente afuera. Mismo criterio, y mismo recolector aparte, que el banco de dos
 * ejes de mas arriba.
 *
 * **Y por que hay que auditarlos igual, que es lo que este bloque cierra.** Son las cuatro
 * cadenas mas sensibles del juego: nombran los cuatro lugares que `BR-22` prohibe
 * jerarquizar, y se leen en tres lados —el sello de la fila, el nombre accesible del boton
 * de destino, y la lamina impresa que sale del sitio—. Estuvieron fuera del barrido hasta
 * que `revisor` lo encontro (`FIND-54`): cumplian las siete reglas de la seccion 8 por
 * decision de quien las escribio, no porque algo lo verificara.
 */
function cadenasDeLasFilas(): string[] {
  return FILAS.map((f) => f.nombre);
}

const VISIBLE: ReadonlyArray<readonly [string, string]> = [
  ...MODULOS.flatMap(([donde, modulo]) => cadenas(modulo).map((texto) => [donde, texto] as const)),
  ...cadenasDelBanco().map((texto) => ['dos-ejes', texto] as const),
  ...cadenasDeLasFilas().map((texto) => ['ponelos/filas', texto] as const),
];

const sinTilde = (s: string): string => s.normalize('NFD').replace(/[̀-ͯ]/g, '');

/** Busca un patron en todo lo visible y devuelve donde aparecio. */
function infracciones(patron: RegExp): string[] {
  return VISIBLE.filter(([, texto]) => patron.test(sinTilde(texto).toLowerCase())).map(
    ([donde, texto]) => `${donde}: "${texto}"`,
  );
}

/*
 * `tier`, `list` y `top` entraron al glosario con `US-08`, y por un caso real: el juego
 * nuevo es del genero que la web llama "tier list", y hasta ese ciclo esas palabras
 * **pasaban el build** — el glosario tenia `ranking` y `score` pero no las del formato. Es
 * el mismo motivo por el que `borrar` entro al set de infinitivos: no se agrega lo que uno
 * imagina, se agrega lo que ya se colo una vez.
 *
 * Los limites de palabra estan puestos a proposito: `\blist\b` no toca "lista" ni
 * "listo", y `\btop\b` no toca "tope". La regla es contra el anglicismo, no contra el
 * castellano que se le parece.
 */
test('D-17: no entra un anglicismo en lo que se lee', () => {
  const glosario = /\b(feedback|reveal|display|quiz|link|score|player|gaming|ranking|challenge|share|tips?|loading|hint|combo|streak|highscore|tier|list|top)\b/;
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
    // Sumados en el ciclo de `US-07`. 'borrar' entro por un caso real: el boton de la cruz
    // del buscador decia "Borrar lo escrito" en los dos juegos, y como solo lo lee quien
    // usa lector de pantalla, nadie lo habia mirado nunca. `D-17` no distingue entre texto
    // a la vista y texto para el lector.
    'borrar', 'sacar', 'mostrar', 'enviar', 'guardar', 'corregir', 'subir', 'entrar',
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
    // `T-167` del ciclo 10. Los seis `h1` de portada faltaban en esta lista, y no por
    // olvido: sumarlos rompia el build por **una sola linea** — el `h1` del quiz, que
    // tenia diez palabras. Cerrar el auditor dejando afuera al unico que fallaba habria
    // sido escribir un test que mira para otro lado, asi que la linea se fue a `producto`
    // (`T-166`) y el hueco se cerro despues, no antes.
    ['h1 quiz', quiz.PANTALLA_0.titulo],
    ['h1 adivinar el tema', tema.PANTALLA_0.titulo],
    ['h1 completar la letra', letra.PANTALLA_0.titulo],
    ['h1 adivinar la tapa', tapa.PANTALLA_0.titulo],
    ['h1 sacalo por la letra', porLaLetra.PANTALLA_0.titulo],
    ['h1 dos ejes', dosEjes.PANTALLA_0.titulo],
    ['h1 ponelos en fila', ponelos.PANTALLA_0.titulo],
    // `US-10`: lo pidió `CNT-25` y `REV-16` (`FIND-85`) vio que no había quedado.
    ['h1 más o menos', masOMenos.PANTALLA_0.titulo],
    ...Object.entries(masOMenos.TRAMOS).map(([k, v]) => [`más o menos tramo ${k}`, v] as [string, string]),
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

/**
 * Las cadenas que producen las **funciones** del copy.
 *
 * `cadenas()` las saltea a proposito, con un motivo escrito: "se invocan con datos y no se
 * pueden auditar sin inventarlos". Pero inventar los datos es exactamente lo que hace un
 * test, y el agujero no era chico: en `por-la-letra/copy.ts` son 10 de 25 claves, y entre
 * ellas esta `paraCompartir`, que es **la unica cadena de ese modulo que sale del sitio**.
 *
 * Se las llama con dos juegos de comodines —un numero y un texto— porque desde afuera no
 * se sabe que espera cada una, y se junta lo que salga de cualquiera de los dos.
 *
 * **Solo se les aplican las reglas que no dependen del dato**: anglicismos, formulas de
 * folleto y como se nombra a la gente. Las de largo y las de puntuacion quedan afuera a
 * proposito — con un comodin adentro, contar palabras no mide el texto, mide el comodin.
 */
function cadenasDeFunciones(): Array<readonly [string, string]> {
  const salida: Array<readonly [string, string]> = [];
  for (const [donde, modulo] of MODULOS) {
    for (const [clave, valor] of Object.entries(modulo)) {
      if (typeof valor !== 'object' || valor === null) continue;
      for (const [sub, fn] of Object.entries(valor as Record<string, unknown>)) {
        if (typeof fn !== 'function') continue;
        for (const comodin of [1, 'X'] as const) {
          try {
            const r = (fn as (...a: unknown[]) => unknown)(comodin, comodin, comodin);
            if (typeof r === 'string') salida.push([`${donde}.${clave}.${sub}()`, r] as const);
          } catch {
            // Una funcion que no aguanta el comodin no se audita: no es su culpa.
          }
        }
      }
    }
  }
  return salida;
}

test('las funciones del copy tampoco pueden traer un anglicismo ni una formula de folleto', () => {
  const glosario = /\b(feedback|reveal|display|quiz|link|score|player|gaming|ranking|challenge|share|tips?|loading|hint|combo|streak|highscore|tier|list|top)\b/;
  const folleto =
    /(descubri todo|sumergite|la experiencia (definitiva|unica)|y listo!|a jugar!|increible|imperdible|la mejor forma de)/;
  const gente = /\b(los fans|las? usuarios?|los? usuarios?|nuestra comunidad)\b/;

  const malas: string[] = [];
  for (const [donde, texto] of cadenasDeFunciones()) {
    const limpio = sinTilde(texto).toLowerCase();
    for (const [nombre, patron] of [['anglicismo', glosario], ['folleto', folleto], ['la gente', gente]] as const) {
      if (patron.test(limpio)) malas.push(`${donde} [${nombre}]: "${texto}"`);
    }
  }
  assert.deepEqual(malas, []);
});

test('voz 3.7: no hay puntos suspensivos en un boton ni en un rotulo', () => {
  // El suspensivo es de la prosa que cuenta. En una instruccion no es estilo, es
  // ambiguedad.
  const cortos = VISIBLE.filter(
    ([, texto]) => texto.trim().split(/\s+/).length <= 4 && /(…|\.\.\.)/.test(texto),
  ).map(([donde, texto]) => `${donde}: "${texto}"`);
  assert.deepEqual(cortos, []);
});

/**
 * Ninguna isla escribe a mano un texto que alguien va a leer.
 *
 * Es la red que faltaba, y la escribio un caso real que se repitio dos veces. Primero
 * `"Link copiado."`, que estuvo **tres ciclos en produccion** con un anglicismo que `D-17`
 * veta, escondido de este auditor por vivir en la isla y no en un `copy.ts`. `ESTADO.md`
 * lo dejo anotado: *"una cadena visible fuera de un copy.ts es una cadena que nadie
 * audita"*. Y despues, en `US-07`, cuatro mas: el placeholder del buscador, su rotulo, el
 * "no hay resultados" y el boton de borrar — este ultimo, encima, en infinitivo.
 *
 * Se miran los dos lugares por donde entra texto que este auditor no puede ver de otra
 * forma: `placeholder` y `aria-label`. Son justo los que **solo lee quien no ve la
 * pantalla**, o sea los que nadie revisa mirando.
 */
test('ninguna isla escribe a mano un placeholder ni un aria-label', () => {
  const islas = readdirSync('src/scripts').filter((f) => f.endsWith('.ts'));
  const malas: string[] = [];
  for (const isla of islas) {
    const fuente = readFileSync(`src/scripts/${isla}`, 'utf-8');
    for (const m of fuente.matchAll(/\.placeholder\s*=\s*(['"])/g)) {
      malas.push(`${isla}: placeholder escrito a mano`);
      void m;
    }
    for (const m of fuente.matchAll(/setAttribute\(\s*['"]aria-label['"]\s*,\s*(['"])/g)) {
      malas.push(`${isla}: aria-label escrito a mano`);
      void m;
    }
  }
  assert.deepEqual(malas, [], `cadenas visibles fuera de un copy.ts:\n  ${malas.join('\n  ')}`);
});

test('ese control sabe encontrar: se prueba contra las dos formas que ya aparecieron', () => {
  // Un test que solo verifica ausencias no demuestra que sepa buscar, y se vuelve verde
  // por vago sin que nadie se entere. Las dos primeras lineas son textuales las que
  // estaban en `partida-por-la-letra.ts` antes de este ciclo.
  const placeholder = /\.placeholder\s*=\s*(['"])/;
  const rotulo = /setAttribute\(\s*['"]aria-label['"]\s*,\s*(['"])/;
  assert.match("  entrada.placeholder = 'Escribi el tema';", placeholder);
  assert.match("  entrada.setAttribute('aria-label', 'Escribi el tema');", rotulo);
  // Y no se queja de la forma correcta, que es la que quedo.
  assert.doesNotMatch('  entrada.placeholder = PARTIDA.buscar;', placeholder);
  assert.doesNotMatch("  entrada.setAttribute('aria-label', PARTIDA.buscar);", rotulo);
});

test('BR-22: ningun nombre de fila califica — son lugares, no notas', () => {
  /*
   * La regla propia de `US-08`, y la unica de este archivo que no sale de
   * `voz-ricotera.md`: las cuatro filas ordenan **sin decir cual es el bueno**.
   *
   * Vive aca y no solo en `tablero.test.ts` —donde ya hay un caso igual sobre `FILAS`—
   * porque acá alcanza a **todo el texto visible del juego**, no solo a los cuatro nombres:
   * el dia que alguien escriba "la mejor" en una bajada o en un rotulo, lo frena esto.
   * Es la contracara textual de lo que `estilos.test.ts` audita en el color.
   */
  const juicio = /\b(mejor(es)?|peor(es)?|bueno|malo|excelente|pesimo|superior|inferior|nivel|puesto|podio|campeon|ganador)\b/;
  const malas = VISIBLE.filter(
    ([donde, texto]) => donde.startsWith('ponelos') && juicio.test(sinTilde(texto).toLowerCase()),
  ).map(([donde, texto]) => `${donde}: "${texto}"`);
  assert.deepEqual(malas, [], `US-08 no puede decir que una fila vale mas que otra: ${malas.join(' / ')}`);
});

test('ese control sabe encontrar: se prueba contra una fila que si calificaria', () => {
  // Un test que solo verifica ausencias no demuestra que sepa buscar. Estas cuatro son las
  // que se descartaron al elegir los lugares, y las cuatro tienen que dar positivo.
  const juicio = /\b(mejor(es)?|peor(es)?|bueno|malo|excelente|pesimo|superior|inferior|nivel|puesto|podio|campeon|ganador)\b/;
  for (const mala of ['LAS MEJORES', 'NIVEL ALTO', 'EL PODIO', 'LAS PEORES']) {
    assert.ok(juicio.test(sinTilde(mala).toLowerCase()), `no atrapo "${mala}"`);
  }
  // Y no se queja de los cuatro que quedaron.
  for (const buena of FILAS.map((f) => f.nombre)) {
    assert.ok(!juicio.test(sinTilde(buena).toLowerCase()), `falso positivo con "${buena}"`);
  }
});
