/**
 * Las guardas del banco de "¿Qué tipo de ricotero sos?" (`US-06`, `D-57`, `BR-36`).
 *
 * **Se escribieron antes que el banco, a propósito.** El banco de este juego se rehízo dos
 * veces por defectos de conjunto (`REV-07`), y en el panel del ciclo 18 las tres propuestas
 * rompían sus propios vetos en sus propios ejemplos ("Cantando con todo el micro"). Lo que se
 * puede medir se mide acá; lo demás —si las dos opciones se dicen con el mismo orgullo, si una
 * escena es más "de adentro" que otra— lo lee `revisor` en `REV-19`.
 *
 * Lo que este archivo NO mira, porque ya lo mira otro: la forma (`esquemas.test.ts` contra el
 * schema de `CTR-08`), las siete reglas de voz (`voz.test.ts`, que recorre el banco), y el
 * sorteo (`partida.test.ts`).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { POLOS } from './copy.ts';

interface Opcion {
  readonly texto: string;
  readonly polo: string;
}
interface Item {
  readonly id: string;
  readonly eje: 'luz-oscuridad' | 'orden-caos';
  readonly momento?: string;
  readonly enunciado: string;
  readonly opciones: readonly Opcion[];
  readonly estado: string;
}
interface Momento {
  readonly id: string;
  readonly nombre: string;
  readonly canta: string;
}
interface Cuadrante {
  readonly id: string;
  readonly luzOscuridad: string;
  readonly ordenCaos: string;
  readonly nombre: string;
  readonly bajada: string;
}
interface Banco {
  readonly contratoVersion: number;
  readonly preguntasPorEje: number;
  readonly momentos: readonly Momento[];
  readonly cuadrantes: readonly Cuadrante[];
  readonly items: readonly Item[];
}

const BANCO = JSON.parse(readFileSync('src/data/dos-ejes.json', 'utf-8')) as Banco;
const LISTOS = BANCO.items.filter((i) => i.estado === 'listo');
const EJES = ['luz-oscuridad', 'orden-caos'] as const;

/** Las palabras de un texto, sin signos: lo que la gente cuenta cuando dice "cinco palabras". */
const palabras = (t: string): string[] => t.split(/\s+/).filter((p) => /[\p{L}\p{N}]/u.test(p));

/** Baja a minúsculas y saca tildes, para que un veto no se escape por una mayúscula o un acento. */
const plano = (t: string): string =>
  t
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '');

/** ¿Aparece la palabra (o el arranque de palabra, si termina en `*`) en el texto? */
function aparece(texto: string, veto: string): boolean {
  const raiz = plano(veto.replace(/\*$/, ''));
  const cola = veto.endsWith('*') ? '\\p{L}*' : '';
  return new RegExp(`(^|[^\\p{L}])${raiz.replace(/ /g, '\\s+')}${cola}($|[^\\p{L}])`, 'u').test(plano(texto));
}

/* ------------------------------------------------------------------
   La noche: cinco momentos, en orden (`D-57` punto 1).
   ------------------------------------------------------------------ */

test('la noche tiene sus cinco momentos, en orden, y uno por pregunta de cada eje', () => {
  assert.equal(BANCO.contratoVersion, 2);
  assert.deepEqual(
    BANCO.momentos.map((m) => m.id),
    ['previa', 'ida', 'vereda', 'adentro', 'vuelta'],
  );
  // Un ítem de cada eje por momento: con esto las cinco por eje salen solas, y siguen impares.
  assert.equal(BANCO.momentos.length, BANCO.preguntasPorEje);
});

test('el sello del momento es seco y la línea que canta entra en un verso', () => {
  for (const m of BANCO.momentos) {
    assert.ok(palabras(m.nombre).length <= 3, `${m.id}: el sello "${m.nombre}" no es un rótulo`);
    // Registro 1 (voz-ricotera §4.1): techo duro de ocho palabras.
    assert.ok(palabras(m.canta).length <= 8, `${m.id}: "${m.canta}" pasa de ocho palabras`);
    assert.ok(!m.canta.includes('…') && !m.canta.includes('...'), `${m.id}: la línea que canta no se deja abierta`);
  }
});

/* ------------------------------------------------------------------
   El piso (`US-06` enmendada por `D-57`): tres por celda, treinta en total.
   ------------------------------------------------------------------ */

test('cada ítem listo es de un momento de la noche', () => {
  const ids = new Set(BANCO.momentos.map((m) => m.id));
  const sueltos = LISTOS.filter((i) => !i.momento || !ids.has(i.momento)).map((i) => i.id);
  assert.deepEqual(sueltos, [], 'ítems listos sin momento, o con uno que la noche no tiene');
});

test('cada celda momento × eje tiene al menos tres ítems listos', () => {
  // Tres por celda es lo que da tres noches seguidas sin repetir una escena (`BR-37`).
  const flacas: string[] = [];
  for (const m of BANCO.momentos) {
    for (const eje of EJES) {
      const n = LISTOS.filter((i) => i.momento === m.id && i.eje === eje).length;
      if (n < 3) flacas.push(`${m.id} × ${eje}: ${n}`);
    }
  }
  assert.deepEqual(flacas, []);
  assert.ok(LISTOS.length >= 30, `hay ${LISTOS.length} listos y el piso es 30`);
});

test('los ids no se repiten y los retirados se quedan donde estaban', () => {
  const ids = BANCO.items.map((i) => i.id);
  assert.equal(new Set(ids).size, ids.length, 'hay un id repetido');
  // `Docs/IDS.md`: un id no se recicla. Los veinte del banco viejo siguen en el archivo.
  for (let n = 1; n <= 28; n++) {
    const id = `EJ-${String(n).padStart(3, '0')}`;
    const viejo = BANCO.items.find((i) => i.id === id);
    assert.ok(viejo, `${id} desapareció del archivo`);
    assert.equal(viejo.estado, 'retirado', `${id} sigue listo: la noche lo reemplaza (D-57 punto 4)`);
  }
});

/* ------------------------------------------------------------------
   Los presupuestos de `UX-06` §7, que hasta acá no medía nadie.
   ------------------------------------------------------------------ */

test('enunciados y opciones entran en la hoja', () => {
  const largos: string[] = [];
  for (const i of LISTOS) {
    if (palabras(i.enunciado).length > 14) largos.push(`${i.id}: enunciado de ${palabras(i.enunciado).length} palabras`);
    for (const o of i.opciones) {
      if (palabras(o.texto).length > 5) largos.push(`${i.id}: "${o.texto}" pasa de cinco palabras`);
      if (o.texto.length > 28) largos.push(`${i.id}: "${o.texto}" pasa de 28 caracteres`);
    }
  }
  assert.deepEqual(largos, []);
});

test('las cuatro maneras entran en la tarjeta', () => {
  for (const c of BANCO.cuadrantes) {
    assert.ok(c.nombre.length <= 26, `${c.id}: "${c.nombre}" pasa de 26 caracteres`);
    assert.ok(palabras(c.bajada).length <= 36, `${c.id}: la bajada pasa de 36 palabras`);
  }
});

/* ------------------------------------------------------------------
   Las cuatro maneras (`D-57` punto 5).
   ------------------------------------------------------------------ */

test('cada CU-n conserva sus polos: un enlace viejo no puede cambiar de identidad', () => {
  // Viaja el id, no el nombre (`ADR-02`). Si alguien reordena los cuadrantes, `r=CU-3` pasaría
  // a decir otra cosa sin que nada falle. Esto es lo que falla.
  const polos = Object.fromEntries(BANCO.cuadrantes.map((c) => [c.id, `${c.luzOscuridad}+${c.ordenCaos}`]));
  assert.deepEqual(polos, {
    'CU-1': 'luz+orden',
    'CU-2': 'luz+caos',
    'CU-3': 'oscuridad+orden',
    'CU-4': 'oscuridad+caos',
  });
});

test('los nombres no tienen persona: se dicen igual en me, te y le salió', () => {
  // La excepción declarada a voz-ricotera §4.2 (`D-57` punto 5). Un nombre en segunda persona
  // se rompe justo al compartir: "Me salió «Tu rincón de siempre»".
  for (const c of BANCO.cuadrantes) {
    for (const p of ['tu', 'tus', 'te', 'vos', 'mi', 'mis', 'me', 'nos', 'nuestro*']) {
      assert.ok(!aparece(c.nombre, p), `${c.id}: "${c.nombre}" lleva "${p}"`);
    }
  }
});

/* ------------------------------------------------------------------
   Los vetos de `BR-36`, con la noche ricotera de `D-62`. Cada lista dice por qué está.

   `D-62` (el usuario, 2026-10-04) metió en la noche lo que `D-57` había dejado afuera: la
   previa en la esquina, la birra, el porro, la merca, el barro, el reviente, los rituales.
   Por eso los vetos se parten en dos: **los de la noche entera**, que valen para todo lo que la
   gente lee (enunciado, opciones, sello, línea que canta, bajadas), y **los de las opciones**,
   que valen solo donde quien juega elige: ahí ninguna opción le pide plata, un cuerpo capaz,
   saber de la banda ni consumir algo que la otra opción no trae.
   ------------------------------------------------------------------ */

const VETOS_DE_LA_NOCHE: ReadonlyArray<readonly [string, readonly string[]]> = [
  // Registro 3 entero (`CNT-04`, `CNT-06`) y lo que lo evoca. `D-62` no lo toca: el barro sí,
  // Olavarría no; el humo sí, las bengalas no.
  ['muertes y tragedias', ['bulacio', 'olavarria', 'cromanon', 'bengala*', 'fuego', 'murio', 'muerte', 'despedida', 'velorio']],
  // Las personas de la banda: el Indio murió el 5 de junio de 2026, y una escena con él en el
  // escenario es un velorio aunque no lo diga (`D-57` punto 9). La banda y sus rituales sí
  // entran a la escena desde `D-62`; las personas no.
  ['las personas de la banda', ['indio', 'solari', 'skay', 'beilinson', 'poli', 'patricio rey']],
  // Ni la policía, que no pidió nadie y parte a la gente por historia propia. Ojo: `aparece`
  // saca la tilde de la ñ, así que *caña* (la bebida) también cae acá. Si algún día hace falta,
  // se afina la lista; hoy el banco no la usa.
  ['policía', ['policia', 'cana', 'yuta', 'gorra']],
  // Seguridad disfrazada de temperamento: hablar con desconocidos, a dedo, y la opción de luz
  // que apunta a quien está cerca o mira (`BR-36` veto 6).
  ['seguridad', ['a dedo', 'desconocid*', 'extrano', 'extrana', 'quien tenga', 'quien me mira', 'quien este', 'a quien me']],
  // La épica de tribuna y la psicodelia de utilería (voz-ricotera §3.6 y §7).
  ['épica y psicodelia', ['lucha', 'resistencia', 'delirio', 'caleidoscopio', 'viaje', 'aguante']],
  // "Nunca cansa el volumen" (el usuario, 2026-10-05, mirando "El volumen cansa los oídos"): en
  // la noche ricotera la música no molesta, no aturde y no hay que taparla (`D-62` enmienda 1).
  // El volumen, el ruido y el estruendo solos no caen: a todo volumen es de la noche; lo que cae
  // es la queja. "Tap*" suelto no entra: *me tapo con un amigo* es la llovizna (`EJ-042`).
  [
    'la música que molesta',
    [
      'algodon', 'tapon*', 'aturd*', 'ensordec*', 'zumbid*', 'molest*', 'demasiado fuerte',
      'volumen cansa', 'cansa los oidos', 'oidos cansad*', 'duelen los oidos', 'me duele el oido',
      'tapo los oidos', 'tapa los oidos', 'tapan los oidos', 'tapar los oidos', 'taparse los oidos', 'tapo con los dedos',
      'baja el volumen', 'bajen el volumen', 'bajar el volumen',
    ],
  ],
];

const VETOS_DE_LAS_OPCIONES: ReadonlyArray<readonly [string, readonly string[]]> = [
  // Los molinetes (`CLAUDE.md` §6): el chori, la birra y el micro pueden estar en la escena;
  // ninguna opción pide haber pagado.
  ['plata', ['plata', 'guita', 'entrada', 'entradas', 'compr*', 'pag*', 'precio']],
  ['vehículo y pasaje', ['micro', 'micros', 'pasaje*', 'colectivo*', 'bondi*', 'tren', 'trenes']],
  // Un cuerpo capaz de algo no es temperamento (`BR-36` veto 5): el pogo puede sonar adelante,
  // pero ninguna opción es meterse.
  ['el cuerpo y la multitud', ['paras', 'parado', 'saltar', 'salto', 'salt*', 'corro', 'corres', 'hombro con hombro', 'apretad*', 'empuj*', 'avalancha', 'en el medio', 'pogo']],
  // La banda como credencial: en la escena la misa y los trapos son paisaje; en una opción,
  // "la misa" o "los Redondos" puntúan quién es más de adentro (`BR-36`, la regla en una línea).
  ['la banda como credencial', ['banda', 'redondos', 'redonditos', 'ricota', 'misa', 'misas', 'ricoter*']],
  // La merca está en la noche (`D-62`) como paisaje, nunca como lo que hace quien juega: es la
  // línea editorial del hilo principal sobre el pedido del usuario, dicha en `D-62`.
  ['la merca como elección', ['merca', 'cocaina', 'falopa', 'saque', 'pala', 'raya', 'rayas', 'tiro', 'tiros']],
];

/** Lo que se toma o se fuma (`D-62`). En una opción puede estar, pero nunca de un solo lado. */
const CONSUMO = ['birra*', 'cerveza*', 'vino', 'vinito', 'tetra', 'fernet', 'escabi*', 'porro*', 'faso*', 'seca', 'pitada', 'chupi*', 'trago*', 'whisky', 'petaca'];

test('ningún enunciado ni opción cae en un veto de la noche (BR-36, D-62)', () => {
  const caidos: string[] = [];
  for (const i of LISTOS) {
    for (const texto of [i.enunciado, ...i.opciones.map((o) => o.texto)]) {
      for (const [porque, lista] of VETOS_DE_LA_NOCHE) {
        for (const v of lista) if (aparece(texto, v)) caidos.push(`${i.id}: "${texto}" (${porque}: ${v})`);
      }
    }
  }
  assert.deepEqual(caidos, []);
});

test('los sellos, las líneas que cantan y las bajadas tampoco (los vetos de la noche valen para todo lo que se lee)', () => {
  const textos = [
    ...BANCO.momentos.flatMap((m) => [`${m.id}: ${m.nombre}`, `${m.id}: ${m.canta}`]),
    ...BANCO.cuadrantes.map((c) => `${c.id}: ${c.bajada}`),
  ];
  const caidos: string[] = [];
  for (const t of textos) for (const [porque, lista] of VETOS_DE_LA_NOCHE) for (const v of lista) if (aparece(t, v)) caidos.push(`"${t}" (${porque}: ${v})`);
  assert.deepEqual(caidos, []);
});

test('ninguna opción cae en un veto de las opciones (BR-36, D-62)', () => {
  const caidos: string[] = [];
  for (const i of LISTOS) {
    for (const o of i.opciones) {
      for (const [porque, lista] of VETOS_DE_LAS_OPCIONES) {
        for (const v of lista) if (aparece(o.texto, v)) caidos.push(`${i.id}: "${o.texto}" (${porque}: ${v})`);
      }
    }
  }
  assert.deepEqual(caidos, []);
});

/** Si un texto cae en un veto de la noche. Aparte, para probar la lista contra la hoja vieja. */
const vetadoDeNoche = (texto: string, cual: string): boolean =>
  VETOS_DE_LA_NOCHE.find(([porque]) => porque === cual)![1].some((v) => aparece(texto, v));

test('la música que molesta sabe ver: la hoja vieja de EJ-052 cae entera', () => {
  // Es la hoja que el usuario vio en el sitio publicado y marcó: "no va, nunca cansa el volumen".
  for (const t of ['El volumen cansa los oídos.', 'Me tapo con los dedos', 'Traje algodón por las dudas']) {
    assert.ok(vetadoDeNoche(t, 'la música que molesta'), t);
  }
  // Y lo que es de la noche no cae: el volumen alto, la llovizna, la campera.
  for (const t of ['El cantito sube a todo volumen.', 'Me tapo con un amigo', 'Una pareja se tapa con una campera.']) {
    assert.ok(!vetadoDeNoche(t, 'la música que molesta'), t);
  }
});

/**
 * Lo sucio de la noche (`BR-38`, `D-62` punto 1): el barro, la mugre, el humo, el reviente y lo
 * que se toma o se fuma. *"Lo primero no puede faltar tampoco"* (el usuario): cada momento, en
 * cada eje, lo trae en algún enunciado, así una noche sorteada no sale tierna de punta a punta.
 * Es `CONSUMO` sin *seca* (*la boca seca* no es una pitada) y **sin la merca**: si la merca
 * sirviera para cumplir el piso, pasaría de paisaje a protagonista. Solo enunciados: en las
 * opciones lo sucio está vigilado por la guarda del consumo, no pedido.
 */
const SUCIO = [
  'barro', 'embarrad*', 'mugre', 'humo', 'reviente',
  ...CONSUMO.filter((v) => v !== 'seca'),
];

test('cada celda momento × eje trae lo sucio en algún enunciado (BR-38, D-62)', () => {
  const sinSucio: string[] = [];
  for (const m of BANCO.momentos) {
    for (const eje of EJES) {
      const celda = LISTOS.filter((i) => i.momento === m.id && i.eje === eje);
      if (!celda.some((i) => SUCIO.some((v) => aparece(i.enunciado, v)))) sinSucio.push(`${m.id} × ${eje}`);
    }
  }
  assert.deepEqual(sinSucio, []);
});

test('lo sucio no se cumple con la merca', () => {
  for (const v of ['merca', 'cocaina', 'falopa', 'raya']) assert.ok(!SUCIO.some((s) => aparece(`Alguien pide ${v} en el baño.`, s)), v);
});

/** Si una opción nombra lo que se toma o se fuma. Aparte, para probarla contra un caso falso. */
const consume = (texto: string): boolean => CONSUMO.some((v) => aparece(texto, v));

test('lo que se toma o se fuma nunca separa los polos (D-62)', () => {
  // "Ir un rato antes a escabiar o no, eso es un recital ricotero" (el usuario): las dos cosas
  // son de la noche. Si una opción toma y la otra no, el eje deja de medir cómo te movés y pasa
  // a medir si tomás, y el que no toma —por salud, por los hijos, porque dejó— cae siempre del
  // mismo lado. La birra y el porro van en la escena, o en las dos opciones, nunca en una sola.
  // Cuenta palabras, no pronombres: *lo paso y aplaudo* (`EJ-048`) pasa el porro con un "lo" y
  // la guarda no lo ve. Eso lo lee `REV-20` (`CNT-31` §4).
  const caidos: string[] = [];
  for (const i of LISTOS) {
    const [a, b] = i.opciones.map((o) => consume(o.texto));
    if (a !== b) caidos.push(`${i.id}: "${i.opciones[0]!.texto}" / "${i.opciones[1]!.texto}"`);
  }
  assert.deepEqual(caidos, []);
});

test('la guarda del consumo sabe ver: una birra de un solo lado la marca', () => {
  assert.ok(consume('Me tomo una birra en la esquina') !== consume('Llego justo para entrar'));
  assert.ok(consume('Paso el faso y sigo la charla') === consume('Le doy una seca y miro'));
});

test('ninguna opción nombra un parentesco ni una pareja propia (D-57 enmienda 7, D-62)', () => {
  // La familia y el amor están en la noche (`D-62`), en la escena: "un padre le enseña la
  // canción a su hija". En una opción en primera persona le cierran la elección a quien no los
  // tiene.
  const propios = ['mi vieja', 'mi viejo', 'mis viejos', 'mi mama', 'mi papa', 'mi hermana', 'mi hermano', 'mis hermanos', 'mi prima', 'mi primo', 'mi tia', 'mi tio', 'mi hija', 'mi hijo', 'mis hijos', 'mi novia', 'mi novio', 'mi pareja', 'mi mujer', 'mi marido', 'mi abuel*'];
  const caidos: string[] = [];
  for (const i of LISTOS) for (const o of i.opciones) for (const v of propios) if (aparece(o.texto, v)) caidos.push(`${i.id}: "${o.texto}" (${v})`);
  assert.deepEqual(caidos, []);
});

test('a la vuelta nadie vuelve a pie: de noche es seguridad, no temperamento', () => {
  const caidos: string[] = [];
  for (const i of LISTOS.filter((x) => x.momento === 'vuelta')) {
    for (const texto of [i.enunciado, ...i.opciones.map((o) => o.texto)]) {
      for (const v of ['a pie', 'caminando', 'camino', 'caminás', 'caminas']) {
        if (aparece(texto, v)) caidos.push(`${i.id}: "${texto}" (${v})`);
      }
    }
  }
  assert.deepEqual(caidos, []);
});

test('ninguna opción delata su eje con la palabra del eje', () => {
  // `EJ-002` decía "Se te corta la luz"; `FIND-25` lo marcó. Y "lista", "horario", "reviso" y
  // "todo" eran la firma del polo orden en el banco viejo.
  // El verificador del ciclo 18 (vuelta 1) sumó los que el banco nuevo repetía: once de quince
  // opciones de orden decían "fijo", "pensado" o "marcado", y cinco de caos "ver". "Sigo" no
  // entra a la lista: en el banco de la vuelta 1 aparece en orden, en caos y en oscuridad, y una
  // palabra que está en tres polos no delata ninguno. Lo que sí vigila la repetición en un solo
  // polo es el test de abajo, "ninguna palabra es la firma de un polo".
  const delatores = [
    'luz', 'oscur*', 'orden*', 'caos', 'caotic*', 'plan', 'planes', 'planific*', 'lista', 'horario*', 'reviso',
    'todo', 'todos', 'toda', 'todas',
    'fij*', 'pensad*', 'pense', 'marcad*', 'vera', 'veamos', 'veremos',
  ];
  const caidos: string[] = [];
  for (const i of LISTOS) {
    for (const v of ['luz', 'oscur*', 'orden*', 'caos']) if (aparece(i.enunciado, v)) caidos.push(`${i.id}: el enunciado nombra el eje (${v})`);
    for (const o of i.opciones) for (const v of delatores) if (aparece(o.texto, v)) caidos.push(`${i.id}: "${o.texto}" (${v})`);
  }
  assert.deepEqual(caidos, []);
});

test('ninguna opción dice la palabra con la que el resultado traduce su polo', () => {
  // El resultado y la grilla traducen los polos (`POLOS`: "con la gente", "con lo propio",
  // "con plan", "sobre la marcha"). Desde la segunda noche, una opción que dice "mi gente" se
  // lee como "la de luz": es el mismo delator que "luz", escrito con la palabra de la traducción.
  const traduccion = new Set<string>();
  for (const frase of Object.values(POLOS)) for (const p of palabras(plano(frase))) if (p.length > 3) traduccion.add(p);
  const caidos: string[] = [];
  for (const i of LISTOS) for (const o of i.opciones) for (const w of traduccion) if (aparece(o.texto, w)) caidos.push(`${i.id}: "${o.texto}" (${w})`);
  assert.deepEqual(caidos, []);
});

test('ninguna palabra es la firma de un polo', () => {
  // Una lista de delatores solo caza lo que alguien ya vio. Esto caza lo que nadie vio todavía:
  // una palabra que aparece en tres o más opciones de un polo y en ninguna del polo de enfrente
  // se aprende en la segunda noche, y el jugador deja de elegir y empieza a apuntar. Así se
  // escribieron "fijo" y "pensado" en orden: once veces en quince.
  // "Por", "me" y "mi" cuentan aunque sean cortas: son firmas de forma, como el "Ya sé… /
  // Tengo…" del banco viejo. La vuelta 1 tenía "por" en cinco opciones de orden y en ninguna de
  // caos ("punto por punto", "una por una"), y "me + verbo" en cuatro de caos y ninguna de orden.
  // "Que" y "cuando" tampoco son vacías: son la forma subordinada, que la vuelta 2 tenía en doce
  // de quince opciones de caos. Y se compara por raíz (cinco letras de las palabras de seis o
  // más), así "pensado" y "pensás" cuentan juntas.
  const vacias = new Set(['con', 'los', 'las', 'una', 'uno', 'del', 'para', 'como', 'mas', 'sin', 'hay', 'esta', 'este', 'eso', 'esa', 'ese', 'mis', 'tus', 'sus', 'les', 'nos', 'ahi', 'aca', 'alla', 'muy', 'pero', 'donde']);
  const cortasQueCuentan = new Set(['me', 'mi']);
  const raiz = (p: string): string => (p.length >= 6 ? p.slice(0, 5) : p);
  const firmas: string[] = [];
  for (const eje of ['luz-oscuridad', 'orden-caos']) {
    const cuenta = new Map<string, Map<string, number>>();
    for (const i of LISTOS.filter((x) => x.eje === eje)) {
      for (const o of i.opciones) {
        const unicas = new Set(palabras(plano(o.texto)).map((p) => p.replace(/[^\p{L}]/gu, '')).filter((p) => (p.length > 2 || cortasQueCuentan.has(p)) && !vacias.has(p)).map(raiz));
        for (const p of unicas) {
          const porPolo = cuenta.get(p) ?? new Map<string, number>();
          porPolo.set(o.polo, (porPolo.get(o.polo) ?? 0) + 1);
          cuenta.set(p, porPolo);
        }
      }
    }
    for (const [p, porPolo] of cuenta) {
      const polos = [...porPolo];
      if (polos.length === 1 && polos[0]![1] >= 3) firmas.push(`${eje}: "${p}" en ${polos[0]![1]} opciones de ${polos[0]![0]} y en ninguna de enfrente`);
    }
  }
  assert.deepEqual(firmas, []);
});

test('la firma de un polo sabe ver: "fijo" tres veces en orden la marca', () => {
  // El caso en rojo, para que el test de arriba no pase por no saber buscar.
  const palabrasDe = (t: string) => palabras(plano(t)).map((p) => p.replace(/[^\p{L}]/gu, ''));
  const orden = ['Voy a lo fijo', 'Lo fijo de antes', 'Hora fija, lugar fijo'].map(palabrasDe);
  assert.ok(orden.filter((ps) => ps.some((p) => p.startsWith('fij'))).length >= 3);
});

test('ninguna opción en primera persona le pone género a quien juega', () => {
  // `CNT-09` dio por resuelto el género dos veces y volvió dos veces ("Vuelvo solo", "camino
  // tranquilo"). Una máquina lo agarra antes que el ojo.
  const conGenero = [
    'solo', 'sola', 'tranquilo', 'tranquila', 'nervioso', 'nerviosa', 'sentado', 'sentada', 'metido', 'metida',
    'cansado', 'cansada', 'contento', 'contenta', 'callado', 'callada', 'apurado', 'apurada', 'preparado', 'preparada',
    'atento', 'atenta', 'mojado', 'mojada', 'empapado', 'empapada', 'dormido', 'dormida', 'despierto', 'despierta',
  ];
  const caidos: string[] = [];
  for (const i of LISTOS) for (const o of i.opciones) for (const v of conGenero) if (aparece(o.texto, v)) caidos.push(`${i.id}: "${o.texto}" (${v})`);
  for (const c of BANCO.cuadrantes) for (const v of conGenero) if (aparece(c.bajada, v)) caidos.push(`${c.id}: la bajada dice "${v}"`);
  assert.deepEqual(caidos, []);
});

test('los enunciados no cierran todos igual', () => {
  // En el banco viejo, 11 de 20 cerraban con "¿Qué hacés?": plantilla, no voz.
  const cierre = (t: string): string => plano(t.slice(t.lastIndexOf('¿') >= 0 ? t.lastIndexOf('¿') : t.lastIndexOf('.') + 1).trim());
  const veces = new Map<string, number>();
  for (const i of LISTOS) veces.set(cierre(i.enunciado), (veces.get(cierre(i.enunciado)) ?? 0) + 1);
  const repetidos = [...veces].filter(([c, n]) => c && n > 3).map(([c, n]) => `"${c}" ×${n}`);
  assert.deepEqual(repetidos, []);
  assert.ok(!veces.has(plano('¿Qué hacés?')), '"¿Qué hacés?" pelado no vuelve');
});

test('las dos opciones de un ítem no son la misma frase con otra punta', () => {
  // Si una opción contiene a la otra, la diferencia es una palabra y el eje queda a la vista.
  for (const i of LISTOS) {
    const [a, b] = i.opciones.map((o) => plano(o.texto));
    assert.ok(a !== b && !a!.includes(b!) && !b!.includes(a!), `${i.id}: "${a}" y "${b}"`);
  }
});

test('ninguna opción apunta al nombre de una manera', () => {
  // Desde la segunda noche, con la grilla ya leída, una opción que dice "hora" o "rincón" se
  // reconoce como la de «Radio bajita, misma hora»: el jugador deja de elegir y empieza a apuntar.
  const delNombre = new Set<string>();
  for (const c of BANCO.cuadrantes) {
    for (const p of palabras(plano(c.nombre))) if (p.replace(/[^\p{L}]/gu, '').length > 3) delNombre.add(p.replace(/[^\p{L}]/gu, ''));
  }
  // Más los objetos de los nombres que el nombre no dice entero (`CNT-30` §2, la lista (O)).
  // Solo en opciones: en un enunciado, "hora" o "camino" son escena.
  for (const extra of ['rincon', 'hora', 'horas', 'horario', 'horarios', 'libro']) delNombre.add(extra);
  // Y las palabras de las bajadas, que se leen en la grilla: "saco la cuenta" apuntaba a la
  // bajada que decía "rehacer la cuenta" (vuelta 3). Pasan las que están en las cuatro por la
  // forma común del costo ("Pero cuando alguien…") y las que no nombran nada.
  const deLaForma = new Set(['pero', 'cuando', 'alguien', 'noche', 'vos', 'toca', 'esta', 'este', 'para', 'como', 'desde', 'donde', 'otro', 'otra', 'cada', 'algo']);
  for (const c of BANCO.cuadrantes) {
    for (const p of palabras(plano(c.bajada))) {
      const w = p.replace(/[^\p{L}]/gu, '');
      if (w.length > 3 && !deLaForma.has(w)) delNombre.add(w);
    }
  }
  const caidos: string[] = [];
  for (const i of LISTOS) {
    for (const o of i.opciones) for (const w of delNombre) if (aparece(o.texto, w)) caidos.push(`${i.id}: "${o.texto}" (${w})`);
  }
  assert.deepEqual(caidos, []);
});
