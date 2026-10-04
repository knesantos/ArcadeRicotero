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
   Los vetos de `BR-36`. Cada lista dice por qué está.
   ------------------------------------------------------------------ */

const VETOS: ReadonlyArray<readonly [string, readonly string[]]> = [
  // La noche es de cualquiera que sale a ver música, no de la banda (`D-57` punto 2).
  ['la banda por su nombre', ['banda', 'redondos', 'redonditos', 'ricota', 'patricio rey', 'indio', 'solari', 'skay', 'misa', 'pogo', 'aguante', 'ricoter*']],
  // Registro 3 entero (`CNT-04`, `CNT-06`) y lo que lo evoca.
  ['muertes y tragedias', ['bulacio', 'olavarria', 'cromanon', 'bengala*', 'fuego', 'murio', 'muerte', 'despedida', 'velorio']],
  // Los molinetes (`CLAUDE.md` §6): nada que pida plata para entrar a la escena.
  ['plata', ['plata', 'guita', 'entrada', 'entradas', 'compr*', 'pag*', 'puesto', 'remera*', 'precio']],
  // Ni alcohol ni drogas ni la policía.
  ['alcohol, drogas, policía', ['birra*', 'cerveza*', 'vino', 'fernet', 'escabio', 'porro', 'faso', 'policia', 'cana', 'yuta', 'borrach*']],
  // Un cuerpo capaz de algo no es temperamento (`BR-36`): "te ubicás", no "te parás".
  ['el cuerpo y la multitud', ['paras', 'parado', 'saltar', 'salto', 'salt*', 'corro', 'corres', 'hombro con hombro', 'apretad*', 'empuj*', 'avalancha', 'en el medio']],
  // Seguridad disfrazada de temperamento: hablar con desconocidos, a dedo, y la opción de luz
  // que apunta a quien está cerca o mira (`BR-36` veto 6; la vuelta 1 de `CNT-30` encontró
  // cuatro). La luz apunta a "los míos" o a alguien a distancia, nunca al de al lado.
  ['seguridad', ['a dedo', 'desconocid*', 'extrano', 'extrana', 'quien tenga', 'quien me mira', 'quien este', 'a quien me']],
  // Un vehículo o un pasaje es un transporte pago: el veto 3 de `BR-36` por el sentido (la
  // primera versión tenía tres micros de larga distancia en la ida).
  ['vehículo y pasaje', ['micro', 'micros', 'pasaje*', 'colectivo*', 'tren', 'trenes']],
  // La épica de tribuna y la psicodelia de utilería (voz-ricotera §3.6 y §7).
  ['épica y psicodelia', ['lucha', 'resistencia', 'delirio', 'caleidoscopio', 'viaje']],
];

test('ningún enunciado ni opción cae en un veto de BR-36', () => {
  const caidos: string[] = [];
  for (const i of LISTOS) {
    for (const texto of [i.enunciado, ...i.opciones.map((o) => o.texto)]) {
      for (const [porque, lista] of VETOS) {
        for (const v of lista) if (aparece(texto, v)) caidos.push(`${i.id}: "${texto}" (${porque}: ${v})`);
      }
    }
  }
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
  const vacias = new Set(['que', 'con', 'los', 'las', 'una', 'uno', 'del', 'por', 'para', 'como', 'mas', 'sin', 'hay', 'esta', 'este', 'eso', 'esa', 'ese', 'mis', 'tus', 'sus', 'les', 'nos', 'ahi', 'aca', 'alla', 'muy', 'pero', 'cuando', 'donde']);
  const firmas: string[] = [];
  for (const eje of ['luz-oscuridad', 'orden-caos']) {
    const cuenta = new Map<string, Map<string, number>>();
    for (const i of LISTOS.filter((x) => x.eje === eje)) {
      for (const o of i.opciones) {
        const unicas = new Set(palabras(plano(o.texto)).map((p) => p.replace(/[^\p{L}]/gu, '')).filter((p) => p.length > 2 && !vacias.has(p)));
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
  const caidos: string[] = [];
  for (const i of LISTOS) {
    for (const o of i.opciones) for (const w of delNombre) if (aparece(o.texto, w)) caidos.push(`${i.id}: "${o.texto}" (${w})`);
  }
  assert.deepEqual(caidos, []);
});
