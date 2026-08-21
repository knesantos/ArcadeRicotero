import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  BancoInvalido,
  aPayload,
  cargarBanco,
  rutaImagen,
  verificarInvariantes,
  type BancoCrudo,
  type ItemCrudo,
} from './banco.ts';
import { armarRonda, cumpleBR01 } from '../quiz/ronda.ts';

const CRUDO = JSON.parse(readFileSync('src/data/tapa.json', 'utf-8')) as BancoCrudo;

/** Un ítem válido de referencia. Cada test rompe una sola cosa de esta base. */
const base: ItemCrudo = {
  id: 'TP-999',
  us: ['US-04'],
  dificultad: 'facil',
  imagen: {
    archivo: 'oktubre',
    encuadre: 'entera',
    disco: 'Oktubre',
    edicion: 'LP argentino, 1986',
    auditoria: 'original confirmada',
    credito: { autor: 'Rocambole (Ricardo Cohen)' },
  },
  opciones: [
    { texto: 'Oktubre', correcta: true },
    { texto: 'Gulp!', correcta: false },
    { texto: 'Luzbelito', correcta: false },
    { texto: 'Momo Sampler', correcta: false },
  ],
  fuentes: ['RES-44'],
  sensibleA: ['tapa'],
  estado: 'listo',
};

const con = (cambio: Partial<ItemCrudo>): ItemCrudo => ({ ...base, ...cambio });

test('US-04: el banco real cumple el piso de 10 items jugables', () => {
  const items = cargarBanco(CRUDO);
  assert.ok(items.length >= 10, `el piso de US-04 es 10 y el banco tiene ${items.length}`);
});

test('el banco real carga sin romper ninguna invariante', () => {
  assert.doesNotThrow(() => cargarBanco(CRUDO));
});

test('BR-04: cuatro opciones, ni tres ni cinco', () => {
  const tres = base.opciones.slice(0, 3);
  assert.throws(() => verificarInvariantes([con({ opciones: tres })]), BancoInvalido);
  const cinco = [...base.opciones, { texto: 'Gulp!', correcta: false }];
  assert.throws(() => verificarInvariantes([con({ opciones: cinco })]), BancoInvalido);
});

test('tiene que haber exactamente una opcion correcta', () => {
  const ninguna = base.opciones.map((o) => ({ ...o, correcta: false }));
  assert.throws(() => verificarInvariantes([con({ opciones: ninguna })]), BancoInvalido);
  const dos = base.opciones.map((o, i) => ({ ...o, correcta: i < 2 }));
  assert.throws(() => verificarInvariantes([con({ opciones: dos })]), BancoInvalido);
});

test('D-21: ninguna tapa entra sin credito a Rocambole', () => {
  const sinCredito = { ...base.imagen, credito: { autor: '  ' } };
  assert.throws(() => verificarInvariantes([con({ imagen: sinCredito })]), BancoInvalido);
});

test('D-21: una imagen "no determinable" no puede ser la respuesta correcta', () => {
  // Es lo unico estricto que le queda al proyecto: si no se sabe que es la imagen, no se
  // puede premiar a nadie por acertarla.
  const dudosa = { ...base.imagen, auditoria: 'no determinable' as const };
  assert.throws(() => verificarInvariantes([con({ imagen: dudosa })]), BancoInvalido);
});

test('una reedicion SI puede ser la respuesta correcta, y tiene que declarar cual es', () => {
  // RES-44 veta la reedicion solo cuando la pregunta depende de la edicion, y acá la
  // pregunta es de que disco es la tapa. Lo que no se perdona es no decir que es.
  const reedicion = { ...base.imagen, auditoria: 'reedicion confirmada' as const };
  assert.doesNotThrow(() => verificarInvariantes([con({ imagen: reedicion })]));
  assert.throws(
    () => verificarInvariantes([con({ imagen: { ...reedicion, edicion: '' } })]),
    BancoInvalido,
  );
});

test('un item sin ficha citada no entra', () => {
  assert.throws(() => verificarInvariantes([con({ fuentes: [] })]), BancoInvalido);
});

test('no se repiten los ids', () => {
  assert.throws(() => verificarInvariantes([base, con({})]), BancoInvalido);
});

test('el payload no le manda al navegador las notas internas', () => {
  // Mismo criterio que el quiz (FIND-16): lo que ninguna pantalla muestra, no viaja.
  const conNotas = con({
    notaInterna: 'ojo con la edicion de este',
    opciones: base.opciones.map((o) => ({ ...o, nota: 'por que es falso' })),
  });
  const p = aPayload(conNotas);
  const serializado = JSON.stringify(p);
  assert.ok(!serializado.includes('ojo con la edicion'), 'la nota interna llego al cliente');
  assert.ok(!serializado.includes('por que es falso'), 'la nota del distractor llego al cliente');
});

test('el payload real del banco no filtra ninguna nota interna', () => {
  const serializado = JSON.stringify(cargarBanco(CRUDO));
  assert.ok(!serializado.includes('notaInterna'), 'hay notas internas en el payload');
  assert.ok(!serializado.includes('"nota"'), 'hay notas de distractor en el payload');
});

test('los borradores y los retirados no llegan al jugador', () => {
  const banco: BancoCrudo = {
    ...CRUDO,
    items: [base, con({ id: 'TP-998', estado: 'borrador' }), con({ id: 'TP-997', estado: 'retirado' })],
  };
  const items = cargarBanco(banco);
  assert.deepEqual(items.map((i) => i.id), ['TP-999']);
});

test('la ruta de la imagen sale de donde generar-tapas.mjs la deja', () => {
  assert.equal(rutaImagen({ archivo: 'oktubre', encuadre: 'entera' }), '/tapas/oktubre.jpg');
  assert.equal(rutaImagen({ archivo: 'mosca-olla', encuadre: 'detalle' }), '/tapas/detalle/mosca-olla.jpg');
});

test('toda imagen del banco real existe de verdad en public/', () => {
  // Una tapa que no carga deja al jugador con una pregunta sin pregunta.
  const faltan = cargarBanco(CRUDO)
    .map((i) => i.imagen.ruta)
    .filter((r) => {
      try {
        readFileSync(`public${r}`);
        return false;
      } catch {
        return true;
      }
    });
  assert.deepEqual(faltan, [], `imagenes del banco que no existen: ${faltan.join(', ')}`);
});

test('BR-01: la ronda de US-04 abre facil y no baja de dificultad', () => {
  // El juego reusa el armado del quiz en vez de copiarlo, asi que hereda el barajado
  // de opciones. Esto verifica que la herencia funciona con este banco.
  const items = cargarBanco(CRUDO);
  let azar = 0;
  const secuencia = () => ((azar = (azar * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < 20; i++) {
    const ronda = armarRonda(items, 6, secuencia);
    assert.equal(ronda.length, 6);
    assert.ok(cumpleBR01(ronda), 'la ronda no cumple BR-01');
  }
});

test('la correcta no cae siempre en la misma posicion', () => {
  // El defecto que documenta ronda.ts: tocar siempre la primera no puede ganar.
  const items = cargarBanco(CRUDO);
  let azar = 7;
  const secuencia = () => ((azar = (azar * 9301 + 49297) % 233280) / 233280);
  const posiciones = new Set<number>();
  for (let i = 0; i < 30; i++) {
    for (const it of armarRonda(items, 6, secuencia)) {
      posiciones.add(it.opciones.findIndex((o) => o.correcta));
    }
  }
  assert.ok(posiciones.size >= 3, `la correcta solo cayo en ${posiciones.size} posiciones distintas`);
});
