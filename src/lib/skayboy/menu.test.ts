import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SIN_AVANCE, conPasado } from './avance.ts';
import { CUADRO_SEG, QUIETO, crearMundo, paso } from './mundo.ts';
import type { Banco, IdPersonaje, Nivel } from './niveles.ts';
import {
  actualDelMenu,
  alElegirNivel,
  alRepetir,
  alTocarFicha,
  dondeSeRetoma,
  enLaFila,
  fichasDelMenu,
  finDeNivel,
  momentoDe,
  mostrarFinDeNivel,
  nivelDelBotonGrande,
  numeroDelNivel,
  pasadosDeLaFila,
  regionDelMenu,
  seTocan,
} from './menu.ts';

const BANCO: Banco = JSON.parse(readFileSync('src/data/skayboy.json', 'utf-8')) as Banco;
const FILA = BANCO.niveles;
const [PRIMERO, SEGUNDO, TERCERO] = FILA as [Nivel, Nivel, Nivel];
const SEXTO = FILA[FILA.length - 1]!;

/** Un mundo de ese nivel, ganado a mano: el menú no juega la física, la lee. */
function ganado(nivel: Nivel) {
  const m = crearMundo(BANCO, nivel);
  m.terminado = true;
  return m;
}

const QUIETOS = { skayboy: QUIETO, poligirl: QUIETO };

test('la fila tiene los seis niveles listos, en orden: lo que el menú muestra', () => {
  assert.equal(FILA.length, 6);
  assert.deepEqual(
    FILA.map((n) => numeroDelNivel(FILA, n.id)),
    [1, 2, 3, 4, 5, 6],
  );
  assert.equal(numeroDelNivel(FILA, 'NIV-99'), undefined);
});

test('enLaFila nombra el nivel con su número y el total; uno no sembrado, nada', () => {
  assert.deepEqual(enLaFila(FILA, TERCERO), { id: TERCERO.id, numero: 3, total: 6, nombre: TERCERO.nombre });
  assert.equal(enLaFila(FILA, { id: 'NIV-99', nombre: 'x' }), undefined);
  assert.equal(enLaFila(FILA.slice(0, 2), TERCERO), undefined, 'en producción solo se siembran los listos');
});

test('las fichas: una por nivel, todas tocables, las pasadas lo dicen y la armada también (D-61 punto 2)', () => {
  const avance = conPasado(conPasado(SIN_AVANCE, PRIMERO.id), TERCERO.id);
  const fichas = fichasDelMenu(FILA, avance, SEGUNDO.id);
  assert.equal(fichas.length, 6);
  assert.deepEqual(
    fichas.map((f) => [f.numero, f.pasado, f.actual]),
    [
      [1, true, false],
      [2, false, true],
      [3, true, false],
      [4, false, false],
      [5, false, false],
      [6, false, false],
    ],
  );
  // Los nombres son los de `CNT-21`, tal cual, y nadie queda bloqueado: una ficha no tiene ningún
  // campo más que estos seis, así que no hay con qué trabarla (se llame como se llame el candado).
  assert.deepEqual(
    fichas.map((f) => f.nombre),
    FILA.map((n) => n.nombre),
  );
  for (const f of fichas) assert.deepEqual(Object.keys(f).sort(), ['actual', 'id', 'nombre', 'numero', 'pasado', 'total']);
});

test('dónde se retoma no cambió: el primero sin pasar, y con los seis pasados el primero', () => {
  assert.equal(dondeSeRetoma(FILA, SIN_AVANCE), PRIMERO);
  assert.equal(dondeSeRetoma(FILA, conPasado(SIN_AVANCE, PRIMERO.id)), SEGUNDO);
  const todos = FILA.reduce((a, n) => conPasado(a, n.id), SIN_AVANCE);
  assert.equal(dondeSeRetoma(FILA, todos), PRIMERO);
  assert.equal(dondeSeRetoma([], SIN_AVANCE), undefined);
});

test('el momento del menú: entrada con el reloj en cero, pausa empezado, ganado al ganar', () => {
  const m = crearMundo(BANCO, PRIMERO);
  assert.equal(momentoDe(m), 'entrada');
  paso(m, QUIETOS, CUADRO_SEG);
  assert.equal(momentoDe(m), 'pausa');
  m.terminado = true;
  assert.equal(momentoDe(m), 'ganado');
});

test('"acá estás" va en el nivel armado en pausa y recién ganado; en la entrada, en ninguno (CNT-40 §1.2)', () => {
  const m = crearMundo(BANCO, TERCERO);
  assert.equal(actualDelMenu(m), null, 'en la entrada nadie está en ningún lado');
  paso(m, QUIETOS, CUADRO_SEG);
  assert.equal(actualDelMenu(m), TERCERO.id, 'en pausa');
  assert.equal(actualDelMenu(ganado(TERCERO)), TERCERO.id, 'recién ganado');
});

test('el botón grande juega el nivel armado, y con el mundo ganado el que sigue (en el sexto, el primero)', () => {
  const m = crearMundo(BANCO, TERCERO);
  assert.equal(nivelDelBotonGrande(m, FILA), TERCERO);
  assert.equal(nivelDelBotonGrande(ganado(TERCERO), FILA), FILA[3]);
  assert.equal(nivelDelBotonGrande(ganado(SEXTO), FILA), PRIMERO);
});

test('elegir un nivel arma ese nivel de cero y vacía deFrente; uno no sembrado no arma nada', () => {
  const deFrente = new Set<IdPersonaje>(['skayboy']);
  const m = crearMundo(BANCO, PRIMERO);
  const elegido = alElegirNivel(m, FILA, 'NIV-04', deFrente);
  assert.equal(elegido?.nivel.id, 'NIV-04');
  assert.equal(elegido?.tiempo, 0);
  assert.equal(elegido?.terminado, false);
  assert.equal(deFrente.size, 0);

  const intacto = new Set<IdPersonaje>(['poligirl']);
  assert.equal(alElegirNivel(m, FILA, 'NIV-99', intacto), undefined);
  assert.equal(alElegirNivel(m, FILA.slice(0, 3), 'NIV-04', intacto), undefined, 'en producción un borrador no se sirve');
  assert.equal(intacto.size, 1, 'un toque que no arma nada no toca nada');
});

test('tocar la ficha del nivel en pausa sigue la partida donde estaba; las demás arman de cero', () => {
  const deFrente = new Set<IdPersonaje>();
  const m = crearMundo(BANCO, SEGUNDO);
  paso(m, QUIETOS, CUADRO_SEG);
  assert.equal(alTocarFicha(m, FILA, SEGUNDO.id, deFrente), m, 'el mismo mundo, sin tocar');
  const otro = alTocarFicha(m, FILA, TERCERO.id, deFrente);
  assert.notEqual(otro, m);
  assert.equal(otro?.nivel.id, TERCERO.id);
  // Ganado, la misma ficha lo juega de nuevo: no hay partida que seguir.
  const g = ganado(SEGUNDO);
  const otraVez = alTocarFicha(g, FILA, SEGUNDO.id, deFrente);
  assert.notEqual(otraVez, g);
  assert.equal(otraVez?.terminado, false);
});

test('repetir arma el mismo nivel de cero', () => {
  const deFrente = new Set<IdPersonaje>(['skayboy']);
  const m = ganado(TERCERO);
  const otra = alRepetir(m, deFrente);
  assert.notEqual(otra, m);
  assert.equal(otra.nivel, TERCERO);
  assert.equal(otra.terminado, false);
  assert.equal(otra.tiempo, 0);
  assert.equal(deFrente.size, 0);
});

test('la tarjeta de fin de nivel: solo ganado, nombra el pasado y el que sigue', () => {
  assert.equal(finDeNivel(crearMundo(BANCO, PRIMERO), FILA), null, 'sin ganar no hay tarjeta');
  assert.deepEqual(finDeNivel(ganado(PRIMERO), FILA), {
    pasado: { id: PRIMERO.id, numero: 1, total: 6, nombre: PRIMERO.nombre },
    sigue: { id: SEGUNDO.id, numero: 2, total: 6, nombre: SEGUNDO.nombre },
    ultimo: false,
  });
});

test('en el sexto la tarjeta dice que era el último y que lo que sigue es el primero (BR-31)', () => {
  const fin = finDeNivel(ganado(SEXTO), FILA);
  assert.equal(fin?.ultimo, true);
  assert.equal(fin?.sigue.id, PRIMERO.id);
  assert.equal(fin?.pasado.numero, 6);
});

test('un nivel ganado que no está en lo sembrado no tiene tarjeta: no hay a dónde seguir', () => {
  assert.equal(finDeNivel(ganado(TERCERO), FILA.slice(0, 2)), null);
});

test('la tarjeta se ve desde el cuadro en que se gana, y se esconde con el menú abierto o jugando', () => {
  const tarjeta = { hidden: true };
  const m = crearMundo(BANCO, PRIMERO);
  assert.equal(mostrarFinDeNivel(tarjeta, m, FILA, false), false);
  assert.equal(tarjeta.hidden, true);
  m.terminado = true;
  assert.equal(mostrarFinDeNivel(tarjeta, m, FILA, false), true);
  assert.equal(tarjeta.hidden, false, 'en el mismo cuadro (D-32 límite 3)');
  assert.equal(mostrarFinDeNivel(tarjeta, m, FILA, true), false);
  assert.equal(tarjeta.hidden, true, 'el menú la tapa');
  assert.equal(mostrarFinDeNivel(null, m, FILA, false), true, 'sin tarjeta en la página no rompe');
});

test('mostrarFinDeNivel no escribe si no cambia: el DOM no se toca sesenta veces por segundo', () => {
  let escrituras = 0;
  let valor = true;
  const tarjeta = {
    get hidden() {
      return valor;
    },
    set hidden(v: boolean) {
      escrituras++;
      valor = v;
    },
  };
  const m = ganado(PRIMERO);
  for (let i = 0; i < 5; i++) mostrarFinDeNivel(tarjeta, m, FILA, false);
  assert.equal(escrituras, 1);
});

/* ---- Dónde va el menú (`UX-37` §3.3): nunca encima del pie de homenaje (`BR-26`) ---- */

const rect = (izquierda: number, arriba: number, ancho: number, alto: number) => ({ izquierda, arriba, ancho, alto });

/** Parado, a 375 x 667 (medido): el mueble arriba, el pie debajo del tubo, las columnas abajo. */
const PARADO = {
  recorte: rect(64, 107, 248, 152),
  pie: rect(64, 259, 248, 30),
  mandos: [rect(44, 303, 140, 324), rect(192, 303, 140, 324)],
  ventana: { ancho: 375, alto: 667 },
  enElModo: false,
  aire: 8,
};

/** De costado, a 740 x 360 (x1): las columnas a los lados del mueble. */
const COSTADO = {
  recorte: rect(250, 120, 248, 152),
  pie: rect(246, 272, 256, 30),
  mandos: [rect(110, 20, 140, 324), rect(498, 20, 140, 324)],
  ventana: { ancho: 740, alto: 360 },
  enElModo: false,
  aire: 8,
};

/** En el modo, de costado, a 844 x 390: la sala y el pie abajo. */
const MODO = {
  recorte: rect(178, 20, 488, 296),
  pie: rect(0, 366, 844, 24),
  mandos: [rect(8, 34, 112, 324), rect(724, 34, 112, 324)],
  ventana: { ancho: 844, alto: 390 },
  enElModo: true,
  aire: 8,
};

test('parado, el menú va en la zona de las teclas, hasta el borde de la ventana: el tubo queda arriba', () => {
  // 667 - 8 de aire = 659; desde 303, 356 de alto.
  assert.deepEqual(regionDelMenu(PARADO), rect(44, 303, 288, 356));
  // Con el pie del sitio a la vista, el menú termina antes: no tapa la firma ni los créditos.
  assert.deepEqual(regionDelMenu({ ...PARADO, tope: 650 }), rect(44, 303, 288, 339));
  // Pero nunca más corto que las teclas.
  assert.deepEqual(regionDelMenu({ ...PARADO, tope: 500 }), rect(44, 303, 288, 324));
  // Con la página desplazada y las teclas más abajo que la ventana, manda el borde de las teclas.
  const desplazada = { ...PARADO, mandos: [rect(44, 400, 140, 324), rect(192, 400, 140, 324)] };
  assert.deepEqual(regionDelMenu(desplazada), rect(44, 400, 288, 324));
});

test('de costado, de borde a borde de las columnas y a la altura del tubo', () => {
  assert.deepEqual(regionDelMenu(COSTADO), rect(110, 120, 528, 152));
});

test('apilado y acostado (568 x 320): las teclas caen afuera de la pantalla, y el menú va en la franja del tubo', () => {
  const chico = {
    recorte: rect(160, 80, 248, 152),
    pie: rect(156, 232, 256, 30),
    mandos: [rect(140, 278, 140, 324), rect(288, 278, 140, 324)],
    ventana: { ancho: 568, alto: 320 },
    enElModo: false,
    aire: 8,
  };
  assert.deepEqual(regionDelMenu(chico), rect(8, 80, 552, 152));
  assert.equal(seTocan(regionDelMenu(chico), chico.pie), false);
});

test('en el modo, la sala entera: la ventana menos el pie, con aire', () => {
  assert.deepEqual(regionDelMenu(MODO), rect(8, 8, 828, 350));
});

test('con mouse las columnas llevan la leyenda (D-55) y cuentan igual; escondidas, no', () => {
  const leyenda = { ...COSTADO, mandos: [rect(110, 170, 140, 60), rect(498, 170, 140, 60)] };
  assert.deepEqual(regionDelMenu(leyenda), rect(110, 120, 528, 152));
  const sinColumnas = { ...COSTADO, mandos: [rect(0, 0, 0, 0), rect(0, 0, 0, 0)] };
  assert.deepEqual(regionDelMenu(sinColumnas), COSTADO.recorte);
});

test('en ningún reparto el menú pisa el pie de homenaje (BR-26)', () => {
  for (const [nombre, piezas] of [
    ['parado', PARADO],
    ['de costado', COSTADO],
    ['en el modo', MODO],
  ] as const) {
    assert.equal(seTocan(regionDelMenu(piezas), piezas.pie), false, nombre);
  }
});

test('seTocan: compartir un borde no es cruzarse', () => {
  assert.equal(seTocan(rect(0, 0, 10, 10), rect(10, 0, 10, 10)), false);
  assert.equal(seTocan(rect(0, 0, 10, 10), rect(9, 9, 10, 10)), true);
});

/* ---- Los casos de `CTR-16.11.2` (enmienda de `D-61`), cada uno con su rojo ---- */

test('ganar fuera de orden: la ficha del 4 sale pasada y el botón grande lleva al 1', () => {
  const avance = conPasado(SIN_AVANCE, 'NIV-04');
  const fichas = fichasDelMenu(FILA, avance, null);
  assert.equal(fichas.find((f) => f.id === 'NIV-04')?.pasado, true, 'se sella por pasados, no por hastaDonde()');
  assert.equal(dondeSeRetoma(FILA, avance), PRIMERO);
  assert.equal(pasadosDeLaFila(FILA, avance), 1);
});

test('los dos "siguiente": la tarjeta nombra el que sigue en la fila; el botón grande, el primero sin pasar', () => {
  const avance = conPasado(SIN_AVANCE, 'NIV-01');
  const cuarto = ganado(FILA[3]!);
  assert.equal(finDeNivel(cuarto, FILA)?.sigue.id, 'NIV-05');
  assert.equal(dondeSeRetoma(FILA, avance)?.id, 'NIV-02');
});

test('la fila manda qué se lista: un id que la fila no tiene no aparece ni cuenta', () => {
  const produccion = FILA.slice(0, 4);
  const avance = conPasado(conPasado(SIN_AVANCE, 'NIV-06'), 'NIV-02');
  const fichas = fichasDelMenu(produccion, avance, null);
  assert.equal(fichas.length, 4);
  assert.ok(!fichas.some((f) => f.id === 'NIV-06'));
  assert.equal(pasadosDeLaFila(produccion, avance), 1);
});

test('el menú no escribe el avance: no tiene con qué', () => {
  // Las funciones del menú no reciben almacén, y el fuente no llama a guardarPasado( ni toca
  // localStorage: el avance se escribe al ganar y en ningún otro lado (CTR-16.11.1).
  const fuente = readFileSync('src/lib/skayboy/menu.ts', 'utf-8').replace(/\/\*[\s\S]*?\*\//g, '');
  assert.doesNotMatch(fuente, /guardarPasado\s*\(/);
  assert.doesNotMatch(fuente, /localStorage/);
});
