/**
 * La guarda del taller de "¿Qué tipo de ricotero sos?" (`D-57` puntos 8 y 10).
 *
 * Las tarjetas y las piezas del libro son archivos fijos. Este test es lo que impide que
 * queden viejos o que crezcan sin que nadie lo note, y lo que vigila la única regla de arte
 * que no se negocia: **ningún recorte toca el óvalo con la figura ni el título** (`RES-168`).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { PIEZAS, PROHIBIDO, LADO_MASTER, TARJETA, VISTA_PREVIA, sePisan, rutaDeTarjeta, rutaDeVistaPrevia, VISTA_PREVIA_JUEGO, rutaDePieza, type Pieza } from './arte.ts';
import { MANIFIESTO, huellaDelTaller, cuadrantesDelBanco } from './taller.ts';

const PUBLICO = (ruta: string): string => `public${ruta}`;

/** El ancho y el alto de un PNG, de su cabecera: sin dependencias. */
function medidaPNG(ruta: string): [number, number] {
  const b = readFileSync(ruta);
  assert.equal(b.toString('ascii', 1, 4), 'PNG', `${ruta} no es un PNG`);
  return [b.readUInt32BE(16), b.readUInt32BE(20)];
}

test('el manifiesto está al día con lo que entra al taller', () => {
  assert.ok(existsSync(MANIFIESTO), 'falta el manifiesto: corré `npm run generar-dos-ejes`');
  const m = JSON.parse(readFileSync(MANIFIESTO, 'utf-8')) as { huella: string; salidas: string[] };
  assert.equal(
    m.huella,
    huellaDelTaller(),
    'cambió un texto, un color, una caja, el máster o una fuente y las tarjetas quedaron viejas: corré `npm run generar-dos-ejes`',
  );
});

test('están las cuatro tarjetas, las cinco vistas previas y las cuatro piezas, y nada más', () => {
  const m = JSON.parse(readFileSync(MANIFIESTO, 'utf-8')) as { salidas: string[] };
  const esperadas = [
    ...Object.keys(PIEZAS).map((p) => PUBLICO(rutaDePieza(p as Pieza))),
    ...cuadrantesDelBanco().flatMap((c) => [PUBLICO(rutaDeTarjeta(c.id)), PUBLICO(rutaDeVistaPrevia(c.id))]),
    PUBLICO(VISTA_PREVIA_JUEGO),
  ].sort();
  assert.deepEqual([...m.salidas].sort(), esperadas);
  for (const s of esperadas) assert.ok(existsSync(s), `falta ${s}`);
});

test('cada tarjeta y cada vista previa mide lo que tiene que medir', () => {
  for (const c of cuadrantesDelBanco()) {
    assert.deepEqual(medidaPNG(PUBLICO(rutaDeTarjeta(c.id))), [TARJETA.ancho, TARJETA.alto], c.id);
    assert.deepEqual(medidaPNG(PUBLICO(rutaDeVistaPrevia(c.id))), [VISTA_PREVIA.ancho, VISTA_PREVIA.alto], c.id);
  }
  assert.deepEqual(medidaPNG(PUBLICO(VISTA_PREVIA_JUEGO)), [VISTA_PREVIA.ancho, VISTA_PREVIA.alto]);
});

test('nada pesa de más: la tarjeta se baja al pintar el resultado, en un teléfono', () => {
  const pesados: string[] = [];
  const tope = (ruta: string, kb: number) => {
    const peso = statSync(ruta).size / 1024;
    if (peso > kb) pesados.push(`${ruta}: ${peso.toFixed(0)} KB, el tope es ${kb}`);
  };
  for (const c of cuadrantesDelBanco()) {
    tope(PUBLICO(rutaDeTarjeta(c.id)), 160);
    tope(PUBLICO(rutaDeVistaPrevia(c.id)), 120);
  }
  tope(PUBLICO(VISTA_PREVIA_JUEGO), 120);
  for (const p of Object.keys(PIEZAS)) tope(PUBLICO(rutaDePieza(p as Pieza)), 30);
  assert.deepEqual(pesados, []);
});

test('ningún recorte toca el óvalo con la figura ni el título, y todos caen adentro del máster', () => {
  for (const [nombre, p] of Object.entries(PIEZAS)) {
    const { caja } = p;
    assert.ok(caja.x >= 0 && caja.y >= 0 && caja.x + caja.ancho <= LADO_MASTER && caja.y + caja.alto <= LADO_MASTER, `${nombre} se sale`);
    for (const [cual, prohibida] of Object.entries(PROHIBIDO)) {
      assert.ok(!sePisan(caja, prohibida), `${nombre} toca ${cual}`);
    }
    // Se achica, nunca se agranda: un recorte estirado es un recorte roto.
    assert.ok(p.ancho <= caja.ancho && p.alto <= caja.alto, `${nombre} se agranda`);
  }
});

test('la guarda de lo prohibido sabe ver: una caja encima del óvalo la marca', () => {
  // Un test que solo verifica ausencias no demuestra que sepa buscar.
  assert.ok(sePisan({ x: 400, y: 300, ancho: 10, alto: 10 }, PROHIBIDO.ovalo));
  assert.ok(!sePisan({ x: 0, y: 700, ancho: 953, alto: 253 }, PROHIBIDO.ovalo));
});

/** Lo que midió el taller al dibujar (`UX-36` §6.5). La huella de arriba garantiza que es de hoy. */
function medidas(): { altoDeLaHojaDeLaTarjeta: number; altoDeLaHojaDeLaVista: number; ordenDeLaPortada: string[] } {
  return (JSON.parse(readFileSync(MANIFIESTO, 'utf-8')) as { medidas: ReturnType<typeof medidas> }).medidas;
}

test('las cuatro hojas de la tarjeta miden lo mismo, entre 740 y 860 (US-06 c4a)', () => {
  // El taller dibuja las cuatro con un solo alto, el de la más larga: cuatro hojas de cuatro
  // alturas dejarían una "más completa". Lo que se vigila acá es que ese alto no pase el
  // tope: por encima de 860 el libro deja de asomar y la pregunta de abajo se aprieta.
  const { altoDeLaHojaDeLaTarjeta: alto, altoDeLaHojaDeLaVista: vista } = medidas();
  assert.ok(alto >= 740 && alto <= 860, `la hoja de la tarjeta mide ${alto}`);
  assert.equal(vista, 440);
});

test('la vista previa de la portada pone las cuatro maneras en orden alfabético, no en el de los ids', () => {
  // El orden de los ids deja las dos de luz arriba: la jerarquía que `D-57` punto 7 sacó.
  const nombres = cuadrantesDelBanco().map((c) => c.nombre);
  const { ordenDeLaPortada } = medidas();
  assert.deepEqual(ordenDeLaPortada, [...nombres].sort((a, b) => a.localeCompare(b, 'es')));
});
