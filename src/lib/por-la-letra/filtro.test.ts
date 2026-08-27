/**
 * Verificacion del filtro de `CNT-11` contra los casos REALES que esa regla documenta.
 *
 * Cada caso de ruido de aca abajo esta citado de `Docs/CONTENIDO/CNT-11-versos-de-us07.md`
 * o de la sugerencia de `CTR-09` — se encontraron leyendo el corpus, no se inventaron.
 * Si un patron nuevo aparece en el cancionero, el camino es: sumarlo a `CNT-11` (es de
 * `contenido`), subir `VERSION_FILTRO`, y recien ahi la clausula aca.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  motivoDescarteVerso,
  versosUtilizables,
  versoDelataTitulo,
  elegirVentana,
  ventanaValida,
  VERSION_FILTRO,
  type VersoDelTema,
} from './filtro.ts';

const v = (texto: string, seccion = 'verso'): VersoDelTema => ({ texto, seccion });

test('los cuatro patrones de ruido de CNT-11.1 se descartan, con su motivo', () => {
  // (a) rotulo de tramo con nombre libre — Aquella solitaria vaca cubana, seis veces
  assert.match(motivoDescarteVerso('TEMA (E7):') ?? '', /CNT-11 a/);
  // (b) secuencia de acordes en notacion latina — Gualicho
  assert.match(motivoDescarteVerso('RE REsus LAm DO (3 VECES)') ?? '', /CNT-11 b/);
  // (c) encabezado del sitio — el que estaba en la hoja de escucha como CL-242
  assert.match(motivoDescarteVerso('Patricio Rey Aquella solitaria vaca cubana (TAB)') ?? '', /CNT-11 c/);
  assert.match(motivoDescarteVerso('Tabbed by maria de los angeles cambra : *') ?? '', /CNT-11 c/);
  // (d) nota del transcriptor
  assert.match(motivoDescarteVerso('NOTA: el estribillo se toca dos veces') ?? '', /CNT-11 d/);
});

test('el caso medido de CTR-09: una linea que es toda un corchete no es un verso', () => {
  // `sirveComoVerso("[A  G]")` devuelve true — esta en letra.json como contexto de
  // CL-265/CL-266. Aca cae por la regla (b): A y G son nombres de acorde.
  assert.notEqual(motivoDescarteVerso('[A  G]'), null);
  assert.notEqual(motivoDescarteVerso('A  G'), null);
});

test('un verso cantado de verdad pasa, parentesis incluidos', () => {
  assert.equal(motivoDescarteVerso('Un ángel vino a verme esta mañana'), null);
  // CTR-09: el corpus tiene versos cantados entre parentesis (Dr. Saturno).
  assert.equal(motivoDescarteVerso('(En las calles no me muestro más)'), null);
  // "La" es nombre de acorde latino, pero un verso con palabras reales no es secuencia.
  assert.equal(motivoDescarteVerso('La sangre en el ojal era de él'), null);
});

test('CNT-11 (e): el estribillo repetido identico cuenta una sola vez', () => {
  // El caso citado: "Con lo que cuesta armar un full" aparece cuatro veces en Gualicho.
  const lineas = [
    v('Con lo que cuesta armar un full'),
    v('Otra linea cualquiera del tema'),
    v('Con lo que cuesta armar un full'),
    v('Con lo que cuesta armar un full!'), // difiere solo en puntuacion: es el mismo
  ];
  const u = versosUtilizables(lineas);
  assert.equal(u.length, 2);
});

test('la regla del titulo compara en forma dura: pega aunque la fuente parta palabras', () => {
  // El motivo de la forma dura (CTR-09.5): la fuente escribe `Ji JiJi` donde el
  // tracklist dice `Jijiji`. Con espacios no pegaria; sin espacios si.
  assert.ok(versoDelataTitulo('No lo sonaba... Ji jiji', 'Jijiji'));
  assert.ok(versoDelataTitulo('aquella solitaria VACA CUBANA se fue', 'Aquella solitaria vaca cubana'));
  assert.ok(!versoDelataTitulo('Un verso que no lo nombra', 'Jijiji'));
});

test('elegirVentana: nunca el primer verso, nunca estribillo, nunca interjectivo', () => {
  const lineas = [
    v('El primer verso reconocible del tema'), // puerta A lo salta
    v('Este es del estribillo que se canta', 'estribillo'), // puerta B lo salta
    v('uh uh uh ah ah'), // puerta C lo salta
    v('Una linea comun con cuatro palabras largas'), // <- el elegido
    v('Quinta linea del tema para la ventana'),
    v('Sexta linea del tema para la ventana'),
    v('Septima linea del tema para la ventana'),
    v('Octava linea del tema para la ventana'),
    v('Novena linea del tema para la ventana'),
    v('Decima linea del tema para la ventana'),
    v('Undecima linea del tema para la ventana'),
  ];
  const ven = elegirVentana(lineas, 'Otro titulo')!;
  assert.equal(ven.desde, 3);
  assert.equal(ven.versos.length, 8);
  assert.equal(ven.versos[0]!.texto, 'Una linea comun con cuatro palabras largas');
});

test('la cascada se relaja C -> B -> A cuando no alcanza, y con 8 justos abre en el primero', () => {
  // CNT-11.3: el caso de Aquella solitaria vaca cubana — exactamente 8 utilizables,
  // sin margen para saltear el primero.
  const ocho = Array.from({ length: 8 }, (_, i) => v(`Linea numero ${i + 1} del tema con palabras`));
  const ven = elegirVentana(ocho, 'Titulo ajeno')!;
  assert.equal(ven.desde, 0, 'con 8 justos se relaja hasta A y abre en el primero');
});

test('un tema al que la regla del titulo le deja menos de 8 versos queda afuera entero', () => {
  const lineas = Array.from({ length: 10 }, (_, i) => v(`El gato azul repite gato azul ${i}`));
  assert.equal(elegirVentana(lineas, 'Gato azul'), null, 'CNT-11.2: no hay escalera de menos pasos');
});

test('ventanaValida re-chequea la ventana entera y devuelve el motivo, no un booleano', () => {
  const buena = Array.from({ length: 8 }, (_, i) => v(`Linea limpia numero ${i + 1} del tema`));
  assert.equal(ventanaValida(buena, { slug: 'x', titulo: 'Otro' }), null);

  assert.match(ventanaValida(buena.slice(0, 7), { slug: 'x', titulo: 'Otro' }) ?? '', /7 versos/);

  const conRuido = [...buena.slice(0, 7), v('RE REsus LAm DO (3 VECES)')];
  assert.match(ventanaValida(conRuido, { slug: 'x', titulo: 'Otro' }) ?? '', /CNT-11 b/);

  const conTitulo = [...buena.slice(0, 7), v('y entonces canto gato azul fuerte')];
  assert.match(ventanaValida(conTitulo, { slug: 'gato-azul', titulo: 'Gato azul' }) ?? '', /delata el titulo/);
});

test('VERSION_FILTRO acompana cada endurecimiento de CNT-11', () => {
  // Subio a 2 con `REV-08` / `FIND-30`: la regla de acordes exigia que TODAS las palabras
  // lo fueran, y nueve de los 93 items publicados mostraban cifra como verso escapandose
  // por una sola palabra suelta. El numero es lo que impide que un banco generado con la
  // regla vieja se haga pasar por filtrado.
  assert.equal(VERSION_FILTRO, 6);
});

test('FIND-30: el ruido que se colaba por una palabra suelta ahora se caza', () => {
  // Los seis casos reales que `REV-08` encontro en el banco publicado. Cada uno se
  // escapaba porque `esSecuenciaDeAcordes` pedia que **todas** las palabras fueran
  // acordes, y una sola palabra suelta salvaba el renglon entero.
  const reales = [
    'D PITE PUENTE  X2',
    'Repite introducion',
    'Bm             G      A    Bm   +(riff1)',
    'E  amor...  G9         (C7 -C9 )    G9            G7',
    'A  (puente)',
    'C9                         puente1',
  ];
  for (const r of reales) {
    assert.notEqual(motivoDescarteVerso(r), null, `se escapa: ${JSON.stringify(r)}`);
  }
});

test('y el endurecimiento no se lleva puesto ningun verso cantado', () => {
  // La contracara: el filtro peca de descartar, pero no puede comerse letra real.
  for (const v of [
    'Un ángel vino a verme esta mañana',
    '(En las calles no me muestro más)',
    'La sangre en el ojal era de él',
    'Ella baila con todos pero duerme conmigo',
    'y el puente se cayó',
    'Nadie puede vivir del amor',
  ]) {
    assert.equal(motivoDescarteVerso(v), null, `perdido: ${JSON.stringify(v)}`);
  }
});
