import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * El guardián del movimiento (`T-179`, ciclo 11).
 *
 * ## Por qué existe
 *
 * Este repo audita a máquina el contraste, los estilos y la voz, y por eso está limpio.
 * El movimiento entró en el ciclo 11 sin ningún auditor, y es **la materia donde más
 * fácil se cuela la estética genérica de IA**: un rebote acá, un fundido allá, una
 * duración escrita a mano, y en tres ciclos el sitio se ve como cualquier plantilla.
 *
 * Lo que este archivo puede y lo que no, dicho de frente para que nadie le pida de más:
 *
 * - **Puede** exigir que ni un tiempo ni una curva vivan fuera de `tokens.css`, que toda
 *   animación tenga su equivalente quieto, y que el mecanismo del tránsito siga siendo el
 *   que decidió `ADR-03`.
 * - **No puede** opinar sobre si una duración está bien elegida ni sobre si un paso se
 *   siente como entrar a un lugar. Eso lo mide el ojo de quien revisa, con `UX-20` §6
 *   como vara. Un test que pretendiera juzgarlo mentiría.
 *
 * ## Las tres reglas, y de dónde salen
 *
 * 1. **Ni un tiempo ni una curva fuera de `tokens.css`** — es la regla del hex de
 *    `.claude/rules/diseno-marca.md` extendida al tiempo, y `UX-20` §4 la pide por
 *    escrito al fijar el catálogo de nombres.
 * 2. **Toda animación declara su equivalente quieto** — `UX-20` §5. El corte de
 *    `prefers-reduced-motion` dejó de ser un `*` con `!important` (que apagaba también la
 *    respuesta al toque, `P3` del 2026-08-24) y pasó a operar por familia de token. Un
 *    corte preciso es mejor que una guillotina **solo si alguien vigila que nadie quede
 *    afuera**, y ese alguien es este archivo.
 * 3. **El tránsito sigue siendo el de `ADR-03`** — cero JavaScript, una sola adhesión,
 *    tres nombres. Las cuatro aserciones están dictadas en su apartado 8.
 *
 * ## Una medición que este test deja escrita
 *
 * `ADR-03` §6.4 dejó abierto si el navegador acepta `@view-transition` anidado adentro de
 * `@media (prefers-reduced-motion: reduce)` o si había que apagar las pseudo a mano. **Se
 * probó el 2026-09-01 en el navegador**, leyendo `document.styleSheets`: la forma anidada
 * parsea y queda en el CSSOM como `CSSViewTransitionRule` adentro de la `CSSMediaRule`.
 * Quedó la forma preferida del ADR, y es la que este test exige.
 */

// El checkout de Windows deja CRLF: se normaliza igual que en `estilos.test.ts`.
const leer = (ruta: string): string => readFileSync(ruta, 'utf-8').replace(/\r\n/g, '\n');

/** Sin comentarios: un ejemplo escrito en una explicación no es una declaración. */
const sinComentarios = (css: string): string => css.replace(/\/\*[\s\S]*?\*\//g, '');

const TOKENS = 'src/styles/tokens.css';

/**
 * Las hojas de componentes: acá no puede vivir ni un tiempo ni una curva.
 *
 * **Se barren del disco, no se escriben a mano**, desde el ciclo 15. Eran tres literales, y
 * `ADR-08.8` marcó lo que pasaba con la cuarta: una hoja nueva quedaba afuera de este
 * escáner y del de `estilos.test.ts` sin romper nada — o sea, con sus `@keyframes` sin
 * equivalente quieto y sus duraciones escritas a mano, que es exactamente lo que este
 * archivo existe para impedir. El mecanismo es el mismo que usa `estilos.test.ts` para su
 * lista de hojas y `voz.test.ts` para su censo de módulos.
 *
 * `tokens.css` va aparte y no acá: es el único lugar donde un tiempo y una curva pueden
 * vivir, así que mezclarlo con las hojas que se auditan sería auditarlo contra sí mismo.
 */
const COMPONENTES = readdirSync('src/styles')
  .filter((f) => f.endsWith('.css') && f !== 'tokens.css')
  .map((f) => `src/styles/${f}`)
  .sort();

const cssTokens = leer(TOKENS);
const cssComponentes = COMPONENTES.map((h) => ({ hoja: h, css: sinComentarios(leer(h)) }));

test('el barrido de hojas no se vuelve verde por vago: encuentra las que hay en disco', () => {
  // Con una lista vacia, las tres reglas de este archivo pasarian sin mirar nada. Las tres
  // hojas de abajo son un piso, no un techo: la que entre manana entra sola.
  for (const hoja of ['juego.css', 'sitio.css', 'cancionero.css']) {
    assert.ok(COMPONENTES.includes(`src/styles/${hoja}`), `el barrido perdio ${hoja}`);
  }
  assert.ok(!COMPONENTES.includes(TOKENS), 'tokens.css no se audita contra si mismo');
});

/** El bloque de `prefers-reduced-motion` de `tokens.css`, que es el corte del sitio. */
function corteDeMovimiento(): string {
  const desde = cssTokens.indexOf('@media (prefers-reduced-motion: reduce)');
  assert.ok(desde > 0, 'tokens.css ya no tiene el corte de movimiento reducido');
  return cssTokens.slice(desde);
}

/* ==================================================================
   Regla 1 — ni un tiempo ni una curva sueltos
   ================================================================== */

test('ni un tiempo suelto en las hojas de componentes: todo sale de un token', () => {
  // Un tiempo escrito a mano es el mismo defecto que un hex escrito a mano: dos verdades
  // sobre el mismo valor, y la de afuera de `tokens.css` no la ve nadie cuando cambia.
  const sueltos: string[] = [];
  for (const { hoja, css } of cssComponentes) {
    for (const linea of css.split('\n')) {
      // Solo las declaraciones que hablan de tiempo. Un `140px` o un `17ch` no son esto.
      if (!/(animation|transition)[a-z-]*\s*:/.test(linea)) continue;
      const tiempos = linea.match(/(?<![\w.-])\d+(\.\d+)?m?s(?![\w-])/g) ?? [];
      for (const t of tiempos) sueltos.push(`${hoja}: "${linea.trim()}" → ${t}`);
    }
  }
  assert.deepEqual(sueltos, [], `tiempos escritos a mano fuera de tokens.css:\n  ${sueltos.join('\n  ')}`);
});

test('ni una curva suelta: la aceleracion la fija --curva-cinta y nadie mas', () => {
  // `linear` queda permitido y no es una excepción de compromiso: la deriva de las capas
  // de fondo corre sobre la línea de tiempo del desplazamiento, donde una curva de
  // aceleración haría que el fondo se adelante y se atrase respecto del dedo.
  const sueltas: string[] = [];
  for (const { hoja, css } of cssComponentes) {
    for (const linea of css.split('\n')) {
      if (!/(animation|transition)[a-z-]*\s*:/.test(linea)) continue;
      const curvas = linea.match(/cubic-bezier\(|(?<![\w-])ease(-in|-out|-in-out)?(?![\w-])|steps\(/g) ?? [];
      for (const c of curvas) sueltas.push(`${hoja}: "${linea.trim()}" → ${c}`);
    }
  }
  assert.deepEqual(sueltas, [], `curvas escritas a mano fuera de tokens.css:\n  ${sueltas.join('\n  ')}`);
});

test('los tokens de movimiento que UX-20 §4 nombra existen de verdad', () => {
  const pedidos = [
    '--duracion-toque',
    '--duracion-paso',
    '--duracion-umbral',
    '--duracion-vuelo',
    '--curva-cinta',
    '--hondura-transito',
    '--deriva-capa-fondo',
    // La imprenta (`UX-22` §13).
    '--duracion-pasada',
    '--escalon-pasada',
    '--duracion-giro',
    '--duracion-carrete',
    '--registro',
    '--registro-angulo',
    '--fuente-lobo-suelto',
  ];
  const faltan = pedidos.filter((t) => !new RegExp(`^\\s*${t}\\s*:`, 'm').test(cssTokens));
  assert.deepEqual(faltan, [], `UX-20 §4 y UX-22 §13 los nombran y tokens.css no los declara: ${faltan.join(', ')}`);
});

/* ==================================================================
   Regla 2 — toda animacion tiene su equivalente quieto
   ================================================================== */

/**
 * Cada animación del sitio, con **cómo se apaga**. Es el corazón de este archivo.
 *
 * El corte de `prefers-reduced-motion` dejó de ser un `*` que apagaba todo —incluida la
 * respuesta al toque, que es información— y pasó a ser preciso. Un corte preciso deja
 * fuera lo que nadie anotó, así que la lista se declara acá y el test verifica **las dos
 * direcciones**: que cada entrada se apague de verdad, y que no exista en el CSS ninguna
 * animación que no esté en esta lista.
 *
 * Tres mecanismos, y ninguno es un comodín:
 *
 * - `token`: la duración sale de un token que el corte lleva a cero. La animación
 *   "corre" en cero cuadros y su relleno `both` deja el estado final. Es el mecanismo
 *   preferido, porque es el que describe `UX-20` §5.
 * - `regla`: una animación en bucle no se apaga bajando su duración —quedaría girando
 *   rapidísimo—, así que su selector declara `animation: none` adentro del corte.
 * - `recorrido`: la animación corre igual, pero lo que interpola sale de un token que el
 *   corte pone en cero. Se mueve de acá hasta acá.
 */
const ANIMACIONES = [
  { nombre: 'paso-sale', apaga: 'token', valor: '--duracion-paso', hoja: TOKENS },
  { nombre: 'paso-entra', apaga: 'token', valor: '--duracion-paso', hoja: TOKENS },
  { nombre: 'umbral-grano', apaga: 'token', valor: '--duracion-umbral', hoja: 'src/styles/sitio.css' },
  { nombre: 'umbral-figura', apaga: 'token', valor: '--duracion-umbral', hoja: 'src/styles/sitio.css' },
  { nombre: 'umbral-sello', apaga: 'token', valor: '--duracion-umbral', hoja: 'src/styles/sitio.css' },
  { nombre: 'vuelo-de-mosca', apaga: 'regla', valor: '.mosca-viva', hoja: 'src/styles/sitio.css' },
  { nombre: 'deriva-de-capa', apaga: 'recorrido', valor: '--deriva-capa-fondo', hoja: 'src/styles/sitio.css' },
  // La imprenta (`UX-22`, ciclo 12). Las cuatro son barridos de `clip-path`: sin opacidad.
  { nombre: 'pasada', apaga: 'token', valor: '--duracion-pasada', hoja: 'src/styles/juego.css' },
  { nombre: 'fijado', apaga: 'token', valor: '--duracion-pasada', hoja: 'src/styles/juego.css' },
  { nombre: 'sala', apaga: 'token', valor: '--duracion-paso', hoja: 'src/styles/juego.css' },
  { nombre: 'carrete', apaga: 'regla', valor: '.casete-carrete', hoja: 'src/styles/juego.css' },
  // El grito estampado de "adivina el tema": el sello del acierto y el de lo que sumaste.
  // Corre en el compas de una pasada, asi que el mismo token lo apaga.
  { nombre: 'sello-golpe', apaga: 'token', valor: '--duracion-pasada', hoja: 'src/styles/juego.css' },
] as const;

test('no hay ninguna animacion que esta lista no conozca', () => {
  // El reverso del test de abajo, y el que de verdad protege: una animación nueva sin
  // entrada acá es una animación que el corte de movimiento reducido no apaga.
  const declaradas = new Set<string>();
  for (const css of [sinComentarios(cssTokens), ...cssComponentes.map((c) => c.css)]) {
    for (const m of css.matchAll(/@keyframes\s+([\w-]+)/g)) declaradas.add(m[1]!);
  }
  // `Set<string>` y no el `Set` de literales que infiere el `as const`: acá se compara
  // contra lo que hay escrito en el CSS, que es texto cualquiera. Sin esto, `has()` solo
  // acepta los siete nombres que ya conocemos — o sea, justo los que este test no busca.
  const conocidas = new Set<string>(ANIMACIONES.map((a) => a.nombre));
  const huerfanas = [...declaradas].filter((n) => !conocidas.has(n));
  assert.deepEqual(
    huerfanas,
    [],
    `animaciones sin entrada en ANIMACIONES: ${huerfanas.join(', ')}.\n` +
      'Agregala a la lista con su mecanismo de apagado, o no la agregues al sitio.',
  );
  const fantasmas = [...conocidas].filter((n) => !declaradas.has(n));
  assert.deepEqual(fantasmas, [], `la lista nombra animaciones que ya no existen: ${fantasmas.join(', ')}`);
});

test('toda animacion se apaga con movimiento reducido, y cada una por su mecanismo', () => {
  const corte = corteDeMovimiento();
  const fallas: string[] = [];

  for (const anim of ANIMACIONES) {
    if (anim.apaga === 'token' || anim.apaga === 'recorrido') {
      // El token que la gobierna tiene que estar puesto en cero adentro del corte.
      const enCero = new RegExp(`${anim.valor}\\s*:\\s*0(ms|s|%)?\\s*;`).test(corte);
      if (!enCero) fallas.push(`${anim.nombre}: el corte no lleva ${anim.valor} a cero`);
      // Y la animación tiene que usarlo de verdad, no solo declararlo.
      const usa = sinComentarios(leer(anim.hoja)).includes(`var(${anim.valor})`);
      if (!usa) fallas.push(`${anim.nombre}: ${anim.hoja} no usa var(${anim.valor})`);
    } else {
      // Una animación en bucle se apaga, no se acelera: `animation: none` en su selector.
      const css = sinComentarios(leer(anim.hoja));
      const desde = css.indexOf('@media (prefers-reduced-motion: reduce)');
      const bloque = desde < 0 ? '' : css.slice(desde);
      const apagada = new RegExp(`${anim.valor.replace('.', '\\.')}\\s*\\{[^}]*animation:\\s*none`).test(bloque);
      if (!apagada) fallas.push(`${anim.nombre}: ${anim.valor} no declara "animation: none" bajo movimiento reducido`);
    }
  }

  assert.deepEqual(fallas, [], `animaciones sin equivalente quieto:\n  ${fallas.join('\n  ')}`);
});

test('el corte NO apaga la respuesta al toque: es el defecto que cerro el ciclo 11', () => {
  // El P3 del 2026-08-24, hecho test. El corte viejo llevaba `*` a 0,01 ms y se comía los
  // 120 ms del borde de `.opcion`, que son la única confirmación de que el sitio recibió
  // el dedo. Reducir movimiento no es borrar la respuesta al toque.
  const corte = corteDeMovimiento();
  assert.ok(
    !/--duracion-toque\s*:/.test(corte),
    'el corte de movimiento reducido volvio a tocar --duracion-toque',
  );
  assert.match(
    sinComentarios(leer('src/styles/juego.css')),
    /\.opcion\s*\{[^}]*transition:[^;]*var\(--duracion-toque\)/,
    '.opcion dejo de usar --duracion-toque para su transicion',
  );
});

test('el corte no volvio a ser una guillotina: sin selector universal', () => {
  const corte = corteDeMovimiento();
  assert.ok(
    !/^\s*\*\s*,?\s*$/m.test(corte) && !/\*\s*::(before|after)/.test(corte),
    'volvio el `*, *::before, *::after` al corte de movimiento: apaga tambien lo que es informacion',
  );
});

/* ==================================================================
   Regla 3 — el transito sigue siendo el de ADR-03
   ================================================================== */

/** Todos los `.astro` y `.ts` de la parte del repo que llega al navegador. */
function fuentesDelNavegador(): string[] {
  const salida: string[] = [];
  const recorrer = (dir: string) => {
    for (const entrada of readdirSync(dir)) {
      const ruta = join(dir, entrada);
      if (statSync(ruta).isDirectory()) recorrer(ruta);
      else if (/\.(astro|ts)$/.test(entrada) && !entrada.endsWith('.test.ts')) salida.push(ruta);
    }
  };
  for (const raiz of ['src/pages', 'src/layouts', 'src/scripts', 'src/components']) recorrer(raiz);
  return salida;
}

test('ADR-03: nadie mete un enrutador de cliente', () => {
  // Las seis islas capturan el DOM en el ambito del modulo y estan escritas contra la
  // suposicion de que cada pantalla es un documento nuevo. Un enrutador de cliente
  // reabre el ciclo de vida de las seis de una, y `islas.test.ts` no lo ve: mira el grafo
  // de importaciones, no el ciclo de vida.
  const prohibido = /ClientRouter|astro:transitions|astro:page-load|transition:persist|startViewTransition/;
  const culpables = fuentesDelNavegador().filter((f) => prohibido.test(leer(f)));
  assert.deepEqual(
    culpables,
    [],
    `el transito entre documentos es ADR-03, con cero JavaScript. Estos archivos lo rompen: ${culpables.join(', ')}`,
  );
});

test('ADR-03: una sola adhesion al transito, y en tokens.css', () => {
  const adhesiones: string[] = [];
  for (const hoja of [TOKENS, ...COMPONENTES]) {
    const css = sinComentarios(leer(hoja));
    for (const _ of css.matchAll(/navigation:\s*auto/g)) adhesiones.push(hoja);
  }
  assert.deepEqual(
    adhesiones,
    [TOKENS],
    'el transito entre documentos exige que los DOS documentos adhieran: una adhesion por ' +
      'pagina es una matriz de pares que nadie mantiene. Va una sola, en tokens.css.',
  );
});

test('ADR-03: el transito tiene su equivalente quieto, y es el mecanismo, no el sintoma', () => {
  // Verificado en el navegador el 2026-09-01: la forma anidada parsea y queda en el
  // CSSOM. Ver el comentario de cabecera de este archivo.
  const corte = corteDeMovimiento();
  assert.match(
    corte,
    /@view-transition\s*\{[^}]*navigation:\s*none/,
    'el selector universal NO alcanza a las pseudo del transito: quien pide menos ' +
      'movimiento recibiria el unico movimiento nuevo del ciclo. Se apaga el mecanismo.',
  );
});

test('ADR-03: tres nombres de transito, ni uno mas, y ninguno en una zona de partida', () => {
  const nombres = new Set<string>();
  const enZonaProhibida: string[] = [];
  for (const hoja of [TOKENS, ...COMPONENTES]) {
    const css = sinComentarios(leer(hoja));
    for (const regla of css.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
      const cuerpo = regla[2]!;
      const m = /view-transition-name:\s*([\w-]+)/.exec(cuerpo);
      if (!m) continue;
      nombres.add(m[1]!);
      const selector = regla[1]!.trim();
      // Las zonas que las islas vacian y rellenan con `replaceChildren()` no participan:
      // nombrarlas es pedirle al navegador que interpole algo que la isla esta por borrar.
      if (/(^|[\s,])(main|#portada|#partida|#resultado|\.pantalla)([\s,]|$)/.test(selector)) {
        enZonaProhibida.push(selector);
      }
    }
  }
  assert.deepEqual(
    [...nombres].sort(),
    ['lugar', 'marca', 'mosca'],
    'el vocabulario del transito lo fija ADR-03 §6.3: un nombre nuevo es una modificacion ' +
      'del ADR, no una linea de CSS',
  );
  assert.deepEqual(enZonaProhibida, [], `nombre de transito sobre una zona de partida: ${enZonaProhibida.join(', ')}`);
});
