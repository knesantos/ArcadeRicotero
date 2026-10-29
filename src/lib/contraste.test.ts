import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { paletaDelArea, TOPE_DE_TINTAS } from './pixel/tokens.ts';

/**
 * Verifica que los tokens de `src/styles/tokens.css` cumplan WCAG AA.
 *
 * `UX-04` fija que la paleta es psicodelica saturada y **que eso no exime de
 * contraste**. Este test es la traduccion de esa frase a algo que falla el build.
 *
 * Lee el CSS de verdad en vez de repetir los hex: si alguien cambia un color y rompe
 * el contraste, el test lo agarra. Repetirlos aca seria probar una copia.
 */

const CSS = readFileSync('src/styles/tokens.css', 'utf-8');

function token(nombre: string): string {
  const m = CSS.match(new RegExp(`--${nombre}:\\s*(#[0-9a-fA-F]{6})`));
  assert.ok(m, `no se encontro el token --${nombre} en tokens.css`);
  return m![1]!;
}

/** Luminancia relativa segun WCAG 2.1. */
function luminancia(hex: string): number {
  const c = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0]! + 0.7152 * c[1]! + 0.0722 * c[2]!;
}

function contraste(a: string, b: string): number {
  const [x, y] = [luminancia(a), luminancia(b)].sort((p, q) => q - p);
  return (x! + 0.05) / (y! + 0.05);
}

/** Los pares que de verdad aparecen en pantalla. */
const PARES: Array<[string, string, string]> = [
  ['texto sobre fondo', 'texto', 'fondo'],
  ['texto sobre fondo elevado', 'texto', 'fondo-elevado'],
  ['texto tenue sobre fondo', 'texto-tenue', 'fondo'],
  ['texto tenue sobre fondo elevado', 'texto-tenue', 'fondo-elevado'],
  ['acento sobre fondo', 'acento', 'fondo'],
  ['acento-2 sobre fondo', 'acento-2', 'fondo'],
  ['acierto sobre fondo', 'acento-3', 'fondo'],
  ['error sobre fondo', 'acento-4', 'fondo'],
  ['rotulo de leyenda sobre fondo', 'rotulo-leyenda', 'fondo'],
  ['rotulo de leyenda sobre fondo elevado', 'rotulo-leyenda', 'fondo-elevado'],
  ['rotulo de testimonio sobre fondo', 'rotulo-testimonio', 'fondo'],
  ['rotulo de testimonio sobre fondo elevado', 'rotulo-testimonio', 'fondo-elevado'],
  // La mezcla (D-19): las categorias visten la paleta real de su disco. Solo el color
  // principal se usa como texto; el "apoyo" es de bordes y no entra aca.
  ['marca (rojo de Oktubre) sobre fondo', 'marca-rojo', 'fondo'],
  // El collage de cassette: las etiquetas de papel llevan la tinta del fondo encima.
  ['tinta sobre papel de etiqueta', 'fondo', 'papel'],
  // Y la tinta APAGADA del papel, que hasta el 2026-09-02 no existia: el rotulo de
  // fuente de la ficha de disco se pintaba con `--texto-tenue`, que esta calibrado para
  // el fondo oscuro, y sobre papel daba 1,78:1. Un par que no se declara es un par que
  // nadie mide.
  ['tinta apagada sobre papel de etiqueta', 'papel-tenue', 'papel'],
  ['historia (Gulp!) sobre fondo', 'cat-historia', 'fondo'],
  ['discos (Ultimo bondi) sobre fondo', 'cat-discos', 'fondo'],
  ['letras (La mosca) sobre fondo', 'cat-letras', 'fondo'],
  ['mitologia (Lobo suelto) sobre fondo', 'cat-mitologia', 'fondo'],
  // Las diez paletas de disco del cancionero (RES-37). La seccion de letras y acordes
  // se ordena por disco y cada seccion se viste con el suyo, asi que hay diez tintas
  // que llevan texto de verdad — titulo del disco, numero de pista, tono, acordes.
  // El `-apoyo` de cada una NO esta aca a proposito: es borde y relleno, y dos de ellos
  // (el ocre de ¡Bang! ¡Bang! y el azul de Un baion) no llegan a AA. Justamente por eso
  // son apoyo: si alguien los usa como texto, este test no lo agarra pero la regla de
  // `tokens.css` lo prohibe por escrito.
  ['Gulp! sobre fondo', 'disco-gulp-tinta', 'fondo'],
  ['Oktubre sobre fondo', 'disco-oktubre-tinta', 'fondo'],
  ['Un baion sobre fondo', 'disco-un-baion-para-el-ojo-idiota-tinta', 'fondo'],
  ['¡Bang! ¡Bang! sobre fondo', 'disco-bang-bang-estas-liquidado-tinta', 'fondo'],
  ['La mosca y la sopa sobre fondo', 'disco-la-mosca-y-la-sopa-tinta', 'fondo'],
  ['Lobo suelto sobre fondo', 'disco-lobo-suelto-tinta', 'fondo'],
  ['Cordero atado sobre fondo', 'disco-cordero-atado-tinta', 'fondo'],
  ['Luzbelito sobre fondo', 'disco-luzbelito-tinta', 'fondo'],
  ['Ultimo bondi sobre fondo', 'disco-ultimo-bondi-a-finisterre-tinta', 'fondo'],
  ['Momo Sampler sobre fondo', 'disco-momo-sampler-tinta', 'fondo'],
  // El boton primario de "sacalo por la letra": tinta del fondo SOBRE la plata de Momo.
  // Va invertido a proposito — el token es el relleno y `--fondo` es lo que se escribe
  // encima. Estaba pintado con el `-apoyo` de ese disco y daba **3,66:1**, el unico
  // primario del sitio debajo de AA; con la tinta da 13,29:1. `diseno-marca.md` dice que
  // un color sin par testeado no existe, y este par no estaba.
  ['boton primario de por-la-letra', 'fondo', 'disco-momo-sampler-tinta'],
  // El boton primario de "Ponelos en fila" (`US-08`), tambien invertido: la ceniza de
  // ¡Bang! ¡Bang! es el relleno y `--fondo` es lo que se escribe encima. Era el ultimo de
  // los diez discos que ninguna seccion habia tomado, y entra al test el mismo dia que
  // empieza a llevar texto — un color sin par testeado no existe (`diseno-marca.md`).
  ['boton primario de ponelos-en-fila', 'fondo', 'disco-bang-bang-estas-liquidado-tinta'],
  // `D-54`: el boton principal de cada juego va en la tinta de su disco, como ya iban cinco
  // de los ocho. Los otros tres usaban el rojo de la marca por defecto, sin haberlo elegido:
  // "¿Qué tipo de ricotero sos?" (Luzbelito), "Completá la letra" (La mosca y la sopa) y
  // "Adiviná la tapa" (Último bondi). Entran con el cambio, invertidos como los de arriba.
  ['boton primario de dos-ejes', 'fondo', 'disco-luzbelito-tinta'],
  ['boton primario de completar-la-letra', 'fondo', 'cat-letras'],
  ['boton primario de adivinar-la-tapa', 'fondo', 'cat-discos'],
  // Y los dos que ya iban en su tinta sin un par que nombrara el uso: "Adiviná el tema" (Lobo
  // suelto) y "Más o menos" (Un baión). El número es el mismo que el de su tinta sobre el
  // fondo —el contraste no tiene dirección—, pero la lista dice dónde se usa cada par.
  ['boton primario de adivinar-el-tema', 'fondo', 'cat-mitologia'],
  ['boton primario de mas-o-menos', 'fondo', 'disco-un-baion-para-el-ojo-idiota-tinta'],
];

/**
 * **La tinta de disco va sobre `--fondo` y sobre nada mas.**
 *
 * No es una regla de estilo: la escribio este test. El primer intento uso las tintas
 * tambien sobre `--fondo-elevado`, y el naranja quemado de *La mosca y la sopa* dio
 * **4,32:1** — debajo de AA. Habia dos salidas: aclarar el naranja, o no apoyarlo ahi.
 * Aclararlo lo habria vuelto un color inventado con coartada de medicion, justo lo que
 * el bloque de `tokens.css` prohibe. Asi que la ficha de cada tema pinta su tinta sobre
 * `--fondo`, y la regla anti-slop ya decia lo mismo por otro motivo ("la tinta queda
 * sobre --fondo, que es el par testeado").
 *
 * Este test deja constancia de por que ese par no esta en la lista de arriba.
 */
test('las tintas de disco NO llegan a AA sobre el fondo elevado: por eso no se usan ahi', () => {
  const r = contraste(token('disco-la-mosca-y-la-sopa-tinta'), token('fondo-elevado'));
  assert.ok(
    r < 4.5,
    `si este par ya pasa AA (${r.toFixed(2)}:1), la restriccion sobro y se puede levantar`,
  );
});

test('WCAG AA: todo par de texto y fondo llega a 4,5:1', () => {
  const fallas: string[] = [];
  for (const [nombre, frente, fondo] of PARES) {
    const r = contraste(token(frente), token(fondo));
    if (r < 4.5) fallas.push(`${nombre}: ${r.toFixed(2)}:1`);
  }
  assert.deepEqual(fallas, [], `pares por debajo de 4,5:1:\n  ${fallas.join('\n  ')}`);
});

/**
 * El velo de tapa (`D-21`, `UX-04`).
 *
 * Acá no alcanza con medir tinta contra token: debajo hay una foto, y una foto tiene mil
 * valores adentro. Lo que se mide es el **peor compuesto posible** — el velo apoyado
 * sobre un pixel blanco puro, que es lo mas claro que una tapa puede llegar a ser. Si el
 * texto pasa AA contra eso, pasa contra cualquier tapa. Es la unica forma de que este
 * test pruebe algo en vez de prometerlo.
 */
function velo(nombre: string): { rgb: string; alfa: number } {
  const m = CSS.match(new RegExp(`--${nombre}:\\s*rgba\\((\\d+),\\s*(\\d+),\\s*(\\d+),\\s*([\\d.]+)\\)`));
  assert.ok(m, `no se encontro el velo --${nombre} en tokens.css`);
  const hex = `#${[1, 2, 3].map((i) => Number(m![i]).toString(16).padStart(2, '0')).join('')}`;
  return { rgb: hex, alfa: Number(m![4]) };
}

/** El velo sobre el fondo mas claro que puede tener una tapa: blanco puro. */
function peorCaso(nombre: string): string {
  const { rgb, alfa } = velo(nombre);
  const canal = (i: number) => Math.round(alfa * parseInt(rgb.slice(i, i + 2), 16) + (1 - alfa) * 255);
  return `#${[1, 3, 5].map((i) => canal(i).toString(16).padStart(2, '0')).join('')}`;
}

test('el velo de tapa esta teñido con --fondo y no con un color suelto', () => {
  // Si alguien cambia --fondo y se olvida del velo, el sitio queda con dos negros
  // distintos y el peor caso deja de ser el que este test mide.
  for (const v of ['velo-tapa', 'velo-tapa-titular']) {
    assert.equal(velo(v).rgb, token('fondo'), `--${v} no usa los canales de --fondo`);
  }
});

test('D-21: sobre tapa velada, el texto de cuerpo llega a 4,5:1 en el peor caso', () => {
  const sobre = peorCaso('velo-tapa');
  const fallas: string[] = [];
  for (const tinta of ['texto', 'texto-tenue']) {
    const r = contraste(token(tinta), sobre);
    if (r < 4.5) fallas.push(`${tinta} sobre tapa velada (peor caso ${sobre}): ${r.toFixed(2)}:1`);
  }
  assert.deepEqual(fallas, [], `pares por debajo de 4,5:1:\n  ${fallas.join('\n  ')}`);
});

test('D-21: sobre tapa velada de titular, el texto grande llega a 3:1 en el peor caso', () => {
  const sobre = peorCaso('velo-tapa-titular');
  const r = contraste(token('texto'), sobre);
  assert.ok(r >= 3, `texto grande sobre tapa velada de titular: ${r.toFixed(2)}:1 (peor caso ${sobre})`);
});

/**
 * El título de cada juego va en la tinta de su disco (`D-54`), y en tres juegos se apoya
 * sobre una tapa velada: "Adiviná el tema" (Lobo suelto), "Adiviná la tapa" (Último bondi) y
 * "Completá la letra" (La mosca y la sopa). Es texto grande —la rotulada a 1,65 rem o más—,
 * así que el piso es el de texto grande (3:1), medido sobre el peor caso del velo de cuerpo:
 * el título no lleva velo propio, va sobre el mismo que el resto de la hoja.
 *
 * Dos de los tres ya iban así antes del ciclo 17 sin que ningún test lo midiera; el tercero
 * (la letra) pasó del texto claro a la tinta de su disco con este cambio. Ahora los tres
 * tienen su par.
 */
test('D-54: el título de un juego en la tinta de su disco llega a 3:1 sobre la tapa velada', () => {
  const sobre = peorCaso('velo-tapa');
  const fallas: string[] = [];
  for (const tinta of ['cat-mitologia', 'cat-discos', 'cat-letras']) {
    const r = contraste(token(tinta), sobre);
    if (r < 3) fallas.push(`${tinta} sobre tapa velada (peor caso ${sobre}): ${r.toFixed(2)}:1`);
  }
  assert.deepEqual(fallas, [], `títulos por debajo de 3:1:\n  ${fallas.join('\n  ')}`);
});

/**
 * El lugar de la Redondopedia (`D-75`): la tapa velada sube detrás del título de cada
 * artículo y de la portada. Arriba de ella van tres cosas, y cada una con su piso:
 *
 * - **El título**, en la tinta de su categoría o de su disco: texto grande, 3:1. Todas menos
 *   la de *Oktubre*, que es el rojo de marca y va en `--texto` (la regla de abajo).
 * - **Lo que hay adentro**, el renglón chico de abajo del título: 4,5:1, en la tinta tenue y
 *   en las dos de rótulo.
 * - **El sello del tipo** va sobre su propia chapa de `--fondo`, así que no entra acá: es el
 *   par de su tinta sobre el fondo, que ya está medido.
 */
const TINTAS_DE_TITULO_SOBRE_LUGAR = [
  'cat-historia',
  'cat-letras',
  'cat-mitologia',
  'disco-gulp-tinta',
  'disco-un-baion-para-el-ojo-idiota-tinta',
  'disco-bang-bang-estas-liquidado-tinta',
  'disco-la-mosca-y-la-sopa-tinta',
  'disco-lobo-suelto-tinta',
  'disco-cordero-atado-tinta',
  'disco-luzbelito-tinta',
  'disco-ultimo-bondi-a-finisterre-tinta',
  'disco-momo-sampler-tinta',
] as const;

test('D-75: el título de la Redondopedia en la tinta de su disco llega a 3:1 sobre su lugar', () => {
  const sobre = peorCaso('velo-tapa');
  const fallas = TINTAS_DE_TITULO_SOBRE_LUGAR.map((t) => [t, contraste(token(t), sobre)] as const)
    .filter(([, r]) => r < 3)
    .map(([t, r]) => `${t} sobre el lugar (peor caso ${sobre}): ${r.toFixed(2)}:1`);
  assert.deepEqual(fallas, [], `títulos por debajo de 3:1:\n  ${fallas.join('\n  ')}`);
});

test('D-75: lo que hay adentro, abajo del título, llega a 4,5:1 sobre el lugar', () => {
  const sobre = peorCaso('velo-tapa');
  const fallas = ['texto-tenue', 'rotulo-leyenda', 'rotulo-testimonio']
    .map((t) => [t, contraste(token(t), sobre)] as const)
    .filter(([, r]) => r < 4.5)
    .map(([t, r]) => `${t} sobre el lugar: ${r.toFixed(2)}:1`);
  assert.deepEqual(fallas, []);
});

test('D-75: Oktubre no escribe su título en el rojo de marca sobre su propia tapa', () => {
  // La tinta de Oktubre es el rojo de marca (el mismo hex), y la regla de abajo lo saca de
  // encima de una tapa velada. La hoja lo tiene que pasar a `--texto` en el artículo.
  assert.equal(token('disco-oktubre-tinta'), token('marca-rojo'));
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8').replace(/\/\*[\s\S]*?\*\//g, '');
  assert.match(sitio, /\.articulo--con-lugar\.de-disco--oktubre h1\s*\{[^}]*color:\s*var\(--texto\)/);
});

test('D-21: el velo de titular NO habilita texto de cuerpo', () => {
  // No es una curiosidad: es la razon por la que existen dos velos y no uno. Si algun
  // dia el velo de titular pasara 4,5:1 con la tinta tenue, la distincion se volveria
  // decorativa y alguien la usaria para parrafos. Que falle acá y se revise.
  const r = contraste(token('texto-tenue'), peorCaso('velo-tapa-titular'));
  assert.ok(r < 4.5, `el velo de titular ya da ${r.toFixed(2)}:1 con tinta tenue: revisar por que hay dos velos`);
});

test('D-21: el rojo de marca no se usa como texto sobre tapa velada', () => {
  // Queda escrito como test y no como comentario porque es la tentacion obvia: la marca
  // es roja y la tapa de Oktubre tambien. Sobre tapa velada ese rojo no llega a AA con
  // ningun alfa que deje ver la foto — va en --texto, o va sobre --fondo.
  const r = contraste(token('marca-rojo'), peorCaso('velo-tapa'));
  assert.ok(r < 4.5, `--marca-rojo ahora da ${r.toFixed(2)}:1 sobre tapa velada: revisar esta prohibicion`);
});

test('los rotulos de leyenda y testimonio se distinguen entre si', () => {
  // Si los dos rotulos se ven igual, el sistema de tres casillas se cae en la ultima
  // milla: el jugador no puede saber si le estan contando folclore o un testimonio.
  const r = contraste(token('rotulo-leyenda'), token('rotulo-testimonio'));
  assert.ok(r >= 1.2, `los dos rotulos son casi el mismo color: ${r.toFixed(2)}:1`);
});

/* ==================================================================
   El pie de imprenta (ciclo 13): el techo del peso de la pasada

   La franja con la que termina cada pantalla se pinta mezclando la tinta de ese disco con
   `--fondo`, en `--peso-pasada`. Es un color que **no existe como token** —lo arma
   `color-mix` en el navegador—, asi que si nadie lo calcula acá, nadie lo mide.

   Y hay que medirlo, porque es un piso nuevo debajo de texto real: el credito de `D-21` y
   el pie del sitio, los dos en `--texto-tenue`. El peso no es una preferencia de diseño:
   es lo mas alto que puede subir sin bajar ese texto de AA. Diez discos, diez pisos.
   ================================================================== */

/** El peso de la pasada, leido del token: `18%` -> 0,18. */
function pesoPasada(): number {
  const m = CSS.match(/--peso-pasada:\s*([\d.]+)%/);
  assert.ok(m, 'no se encontro el token --peso-pasada en tokens.css');
  return Number(m![1]) / 100;
}

/**
 * El piso que deja la pasada de un disco: `color-mix(in srgb, tinta p%, fondo)`.
 *
 * `in srgb` interpola en el espacio **con gamma**, o sea canal por canal sobre los valores
 * de 0 a 255 tal como se escriben. Es una interpolacion lineal simple: la misma cuenta que
 * hace el navegador, no una aproximacion.
 */
function pisoDePasada(slugDisco: string, peso: number): string {
  const tinta = token(`disco-${slugDisco}-tinta`);
  const fondo = token('fondo');
  const canal = (i: number) =>
    Math.round(peso * parseInt(tinta.slice(i, i + 2), 16) + (1 - peso) * parseInt(fondo.slice(i, i + 2), 16));
  return `#${[1, 3, 5].map((i) => canal(i).toString(16).padStart(2, '0')).join('')}`;
}

/** Los diez discos, con el slug con el que se nombran sus tokens. */
const DISCOS_DEL_PIE = [
  'gulp',
  'oktubre',
  'un-baion-para-el-ojo-idiota',
  'bang-bang-estas-liquidado',
  'la-mosca-y-la-sopa',
  'lobo-suelto',
  'cordero-atado',
  'luzbelito',
  'ultimo-bondi-a-finisterre',
  'momo-sampler',
];

test('el pie de imprenta: sobre la pasada de cualquier disco, el credito sigue en AA', () => {
  const peso = pesoPasada();
  const fallas: string[] = [];
  for (const disco of DISCOS_DEL_PIE) {
    const piso = pisoDePasada(disco, peso);
    for (const tinta of ['texto', 'texto-tenue']) {
      const r = contraste(token(tinta), piso);
      if (r < 4.5) fallas.push(`${tinta} sobre la pasada de ${disco} (${piso}): ${r.toFixed(2)}:1`);
    }
  }
  assert.deepEqual(
    fallas,
    [],
    `subir --peso-pasada dejo texto por debajo de 4,5:1:\n  ${fallas.join('\n  ')}\n` +
      'El peso de la pasada no se decide a ojo: este es el techo.',
  );
});

test('el pie de imprenta: la pasada se ve de verdad, no es relleno', () => {
  /*
   * El reverso del test de arriba, y hace falta tanto como el.
   *
   * Una atmosfera que "puede leerse como nada" no es sutileza: es relleno con coartada.
   * Es el argumento que hundio a la direccion de la plancha en el ciclo 13 — gastaba el
   * presupuesto entero de contraste para comprar entre 3 y 10 niveles de 255, o sea nada
   * en un celular al sol.
   *
   * El piso se mide contra `--fondo` en el canal donde mas se aparta. Doce niveles de 255
   * es poco y se ve; menos que eso, en una pantalla de telefono con brillo de calle, no.
   */
  const peso = pesoPasada();
  const flojas: string[] = [];
  const fondo = token('fondo');
  for (const disco of DISCOS_DEL_PIE) {
    const piso = pisoDePasada(disco, peso);
    const salto = Math.max(
      ...[1, 3, 5].map((i) => Math.abs(parseInt(piso.slice(i, i + 2), 16) - parseInt(fondo.slice(i, i + 2), 16))),
    );
    if (salto < 12) flojas.push(`${disco}: ${salto} niveles sobre el fondo (${piso})`);
  }
  assert.deepEqual(
    flojas,
    [],
    `pasadas que no se van a ver en un telefono:\n  ${flojas.join('\n  ')}\n` +
      'O sube --peso-pasada (mirando el techo del test de arriba), o esos discos van sin pasada.',
  );
});

/* ==================================================================
   La multitud que se acerca (`D-63` enmienda 1): el techo y el piso de su tinta

   Dos planos de gente fijos al pie de la ventana del portal, detras de todo, pintados como
   la pasada: tinta de `tokens.css` mezclada con `--fondo` por `color-mix`, recortada con una
   mascara. Son colores que no existen como token, asi que se calculan aca.

   Y todo el texto del portal pasa por encima al subir. El techo lo ponen dos cosas: el texto
   mas apagado (`--texto-tenue`, AA de 4,5:1) y la marca grande en `--marca-rojo`, que es letra
   grande y pide 3:1 — y que en un telefono acostado puede quedar sobre el plano de lejos.
   ================================================================== */

/** Un peso de la multitud, leido del token: `16%` -> 0,16. */
function pesoMultitud(nombre: string): number {
  const m = CSS.match(new RegExp(`--${nombre}:\\s*([\\d.]+)%`));
  assert.ok(m, `no se encontro el token --${nombre} en tokens.css`);
  return Number(m![1]) / 100;
}

/** `color-mix(in srgb, tinta p%, fondo)`, la misma cuenta que `pisoDePasada`. */
function mezclaConFondo(tinta: string, peso: number): string {
  const fondo = token('fondo');
  const canal = (i: number) =>
    Math.round(peso * parseInt(tinta.slice(i, i + 2), 16) + (1 - peso) * parseInt(fondo.slice(i, i + 2), 16));
  return `#${[1, 3, 5].map((i) => canal(i).toString(16).padStart(2, '0')).join('')}`;
}

/** Las cuatro tintas que pintan los dos planos: la gente y las banderas, lejos y cerca. */
function tintasDeLaMultitud(): Array<[string, string]> {
  return [
    ['la gente de lejos', mezclaConFondo(token('papel'), pesoMultitud('peso-multitud-lejos'))],
    ['las banderas de lejos', mezclaConFondo(token('disco-oktubre-tinta'), pesoMultitud('peso-bandera-lejos'))],
    ['la gente de cerca', mezclaConFondo(token('papel'), pesoMultitud('peso-multitud-cerca'))],
    ['las banderas de cerca', mezclaConFondo(token('disco-oktubre-tinta'), pesoMultitud('peso-bandera-cerca'))],
  ];
}

test('la multitud que se acerca: el texto del portal sigue en AA por encima de cualquier plano', () => {
  const fallas: string[] = [];
  for (const [que, piso] of tintasDeLaMultitud()) {
    for (const [tinta, minimo] of [['texto', 4.5], ['texto-tenue', 4.5], ['marca-rojo', 3]] as const) {
      const r = contraste(token(tinta), piso);
      if (r < minimo) fallas.push(`${tinta} sobre ${que} (${piso}): ${r.toFixed(2)}:1, pide ${minimo}`);
    }
  }
  assert.deepEqual(
    fallas,
    [],
    `un peso de la multitud dejo texto por debajo de AA:\n  ${fallas.join('\n  ')}\n` +
      'Los --peso-multitud-* y --peso-bandera-* no se suben a ojo: este es el techo.',
  );
});

test('la multitud que se acerca: se ve de verdad, y lo de cerca tiene mas tinta que lo de lejos', () => {
  // El mismo piso que la pasada: doce niveles de 255 en el canal que mas se aparta del fondo.
  const fondo = token('fondo');
  const salto = (hex: string) =>
    Math.max(...[1, 3, 5].map((i) => Math.abs(parseInt(hex.slice(i, i + 2), 16) - parseInt(fondo.slice(i, i + 2), 16))));
  const flojas = tintasDeLaMultitud()
    .filter(([, piso]) => salto(piso) < 12)
    .map(([que, piso]) => `${que}: ${salto(piso)} niveles sobre el fondo (${piso})`);
  assert.deepEqual(flojas, [], `planos que no se van a ver en un telefono:\n  ${flojas.join('\n  ')}`);

  // Lo lejano se apaga: si el plano de lejos tuviera mas tinta que el de cerca, la profundidad
  // se da vuelta y la multitud se lee como una pared.
  assert.ok(pesoMultitud('peso-multitud-lejos') < pesoMultitud('peso-multitud-cerca'), 'la gente de lejos pesa más que la de cerca');
  assert.ok(pesoMultitud('peso-bandera-lejos') < pesoMultitud('peso-bandera-cerca'), 'las banderas de lejos pesan más que las de cerca');
});

/* ==================================================================
   La etiqueta sellada (`D-64`): la tinta gastada y la mano, sobre el papel viejo

   La etiqueta del casete dejó de ser papel parejo: tiene manchas de humedad en
   `--papel-borde`, hasta un techo, y el título y el sello salen de una almohadilla que deja
   la tinta con huecos y la afloja hasta 0,8. Son colores que no existen como token —los
   arma la máscara en el navegador—, así que se calculan acá, en el peor lugar: sobre la
   mancha más oscura y con el grano de la pantalla encima (`.con-grano::after`).

   Lo que pone el techo es la pista (A1, A2…), que va en `--papel-tenue` porque es lo escrito
   a mano: con el grano encima queda apenas arriba de 4,5:1, y por eso el papel no puede
   ensuciarse más.
   ================================================================== */

/** Lo que pide la máscara de `nombre` en su última tabla de alfa (`tableValues='a b'`). */
function tablaDeTextura(nombre: string): number[] {
  const crudo = new RegExp(`--${nombre}:\\s*url\\("data:image\\/svg\\+xml,([^"]+)"`).exec(CSS);
  assert.ok(crudo, `no se encontro --${nombre} en tokens.css`);
  const tablas = [...decodeURIComponent(crudo![1]!).matchAll(/feFuncA type='table' tableValues='([^']+)'/g)];
  assert.ok(tablas.length > 0, `--${nombre} no tiene tabla de alfa`);
  return tablas.at(-1)![1]!.split(/\s+/).map(Number);
}

/** `frente` apoyado en `fondo` con opacidad `alfa`, canal por canal en sRGB. */
function mezclar(frente: string, fondo: string, alfa: number): string {
  const canal = (i: number) =>
    Math.round(alfa * parseInt(frente.slice(i, i + 2), 16) + (1 - alfa) * parseInt(fondo.slice(i, i + 2), 16));
  return `#${[1, 3, 5].map((i) => canal(i).toString(16).padStart(2, '0')).join('')}`;
}

test('D-64: la tinta del sello y la mano se leen sobre el papel viejo, con el grano encima', () => {
  const techo = Math.max(...tablaDeTextura('textura-papel-viejo'));
  const presion = Math.min(...tablaDeTextura('textura-tinta'));
  const grano = Number(/\.con-grano::after\s*\{[^}]*opacity:\s*([\d.]+)/.exec(readFileSync('src/styles/sitio.css', 'utf-8'))?.[1]);
  assert.ok(grano > 0 && grano < 1, 'no se encontro la opacidad del grano en sitio.css');

  const papelPeor = mezclar(token('papel-borde'), token('papel'), techo);
  const conGrano = (c: string) => mezclar('#000000', c, grano);
  const fallas: string[] = [];
  const pares: Array<[string, string, string]> = [
    ['el título gastado', conGrano(mezclar(token('fondo'), papelPeor, presion)), conGrano(papelPeor)],
    ['la bajada', conGrano(token('fondo')), conGrano(papelPeor)],
    ['la pista y "en la cocina"', conGrano(token('papel-tenue')), conGrano(papelPeor)],
  ];
  // Los sellos: la letra es `--fondo` entera, el macizo es la tinta del disco aflojada sobre
  // el papel. Sin grano, que es la convención de los pares de sello que ya existen.
  for (const sello of [
    'marca-rojo', 'disco-luzbelito-tinta', 'cat-mitologia', 'cat-historia', 'disco-momo-sampler-tinta',
    'cat-letras', 'disco-bang-bang-estas-liquidado-tinta', 'cat-discos', 'disco-un-baion-para-el-ojo-idiota-tinta',
  ]) {
    pares.push([`el sello en ${sello}`, token('fondo'), mezclar(token(sello), papelPeor, presion)]);
  }
  for (const [que, texto, fondo] of pares) {
    const r = contraste(texto, fondo);
    if (r < 4.5) fallas.push(`${que}: ${r.toFixed(2)}:1`);
  }
  assert.deepEqual(
    fallas,
    [],
    `el papel viejo o la almohadilla dejaron texto por debajo de AA:\n  ${fallas.join('\n  ')}\n` +
      'El techo del papel y el piso de la presión no se tocan a ojo: este es el límite.',
  );
});

test('D-64: el sello que va sobre el negro no lleva la presión, solo la sal', () => {
  // La presión afloja la tinta al 80 %: sobre papel la aclara, pero sobre el negro la oscurece.
  // El sello del afiche de octubre quedaba con la letra `--fondo` en 3,52:1. Con solo la sal la
  // tinta que queda es plena, y el par es el de la tinta del mes sobre el fondo, que ya se mide
  // arriba (`D-84`: el mismo sello sirve a cada mes con su tinta).
  const sitio = readFileSync('src/styles/sitio.css', 'utf-8').replace(/\/\*[\s\S]*?\*\//g, '');
  const conMascara = [...sitio.matchAll(/\.afiche-boton::before\s*\{([^}]*)\}/g)]
    .map((m) => m[1]!)
    .filter((cuerpo) => /mask-image/.test(cuerpo));
  assert.ok(conMascara.length > 0, 'no se encontró la máscara del macizo del sello de octubre');
  assert.match(conMascara.at(-1)!, /mask-image:\s*var\(--textura-tinta-sal\)/, 'el sello de octubre volvió a la presión');
  // Y la razón sigue siendo cierta: con la presión, ese par no llega.
  const conPresion = mezclar(token('marca-rojo'), token('fondo'), Math.min(...tablaDeTextura('textura-tinta')));
  assert.ok(contraste(token('fondo'), conPresion) < 4.5, 'la presión ya no oscurece el sello sobre negro: esta guarda sobra');
});

test('el area de toque minima cumple lo que pide jugable con el pulgar', () => {
  const m = CSS.match(/--toque-min:\s*(\d+)px/);
  assert.ok(m, 'no hay token de area de toque');
  assert.ok(Number(m![1]) >= 44, `el area de toque es ${m![1]}px, muy chica para el pulgar`);
});

test('la base es oscura, como fija UX-04', () => {
  assert.ok(luminancia(token('fondo')) < 0.1, 'el fondo no es una base oscura');
});

/**
 * La paleta del pixel (hoja 14 del lienzo, aprobada el 2026-09-24). Adentro del área no
 * hay texto (`UX-27 §5.1`): lo que tiene que distinguirse se distingue por contorno, y el
 * contorno es la clave. Por eso la vara no es 4,5:1 sino **3:1 contra `--px-clave`**
 * (`UX-27 §5.3`). Las tintas se resuelven con la misma función que usan la imprenta y el
 * auditor, siguiendo los alias: repetir los hex acá sería probar una copia.
 */
test('UX-27 §5.3: las quince tintas del pixel llegan a 3:1 contra la clave', () => {
  const { tintas, errores } = paletaDelArea(CSS);
  assert.deepEqual(errores, [], 'la paleta del pixel no se resuelve sin errores');
  assert.equal(tintas.size, TOPE_DE_TINTAS, `son ${tintas.size} tintas --px-* y UX-27 §4 fija ${TOPE_DE_TINTAS}`);
  const clave = tintas.get('--px-clave');
  assert.equal(clave, token('fondo').toLowerCase(), '--px-clave tiene que ser la tinta del sitio (alias de --fondo)');
  const flojas = [...tintas]
    .filter(([nombre]) => nombre !== '--px-clave')
    .map(([nombre, hex]) => [nombre, contraste(hex, clave!)] as const)
    .filter(([, r]) => r < 3)
    .map(([nombre, r]) => `${nombre}: ${r.toFixed(2)}:1`);
  assert.deepEqual(flojas, [], `tintas del pixel por debajo de 3:1 contra la clave:\n  ${flojas.join('\n  ')}`);
});
