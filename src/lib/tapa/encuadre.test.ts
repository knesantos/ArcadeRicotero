/**
 * Que la tapa no conteste sola.
 *
 * **Por que existe este archivo.** `US-04` promete reconocer una tapa. Hasta el 2026-08-28
 * **ocho de las diez tapas traen el titulo impreso en la cara frontal y ocho de los diez
 * items mostraban la tapa entera**: no habia que reconocer nada, habia que leer. Es el
 * mismo defecto que el quiz tenia con los enunciados que regalaban la respuesta, pero
 * peor, porque aca la respuesta estaba escrita en la propia imagen.
 *
 * **Como quedo resuelto.** El usuario pidio, el mismo dia, que el juego funcione como los
 * juegos de splash: *"no mostrar la tapa entera sino un zoom alto como para que sea
 * dificil"*. Eso convierte la regla en una sola linea y sin excepciones:
 *
 * > **Ningun item muestra la tapa entera.** Todos juegan con un zoom, y el lado del
 * > recorte sale de la dificultad (`facil` 0.40 del master, `media` 0.26, `dificil` 0.22).
 *
 * Un zoom que no llega al titulo no tiene nada que leer, asi que la fuga muere sola.
 *
 * `TP-010` ya venia haciendo lo correcto sin que nadie lo hubiera escrito como regla: usaba
 * un recorte «sin titulo ni lista de temas a la vista». Este archivo lo hace corrible para
 * los diez.
 *
 * **Lo que este test NO puede ver** es que el recorte caiga sobre el titulo: eso hay que
 * mirarlo. Los diez estan mirados uno por uno el 2026-08-28, y los centros viven en
 * `scripts/generar-tapas.mjs`, no aca.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { rutaImagen } from './banco.ts';

interface Item {
  readonly id: string;
  readonly dificultad: 'facil' | 'media' | 'dificil';
  readonly imagen: { readonly archivo: string; readonly encuadre: 'entera' | 'detalle' };
  readonly estado: string;
}

const items: readonly Item[] = (
  JSON.parse(readFileSync('src/data/tapa.json', 'utf-8')) as { items: readonly Item[] }
).items.filter((i) => i.estado === 'listo');

test('US-04: ningun item muestra la tapa entera — todos juegan con un zoom', () => {
  const enteras = items.filter((i) => i.imagen.encuadre !== 'detalle');
  assert.deepEqual(
    enteras.map((i) => `${i.id} (${i.imagen.archivo})`),
    [],
    'estos items muestran la tapa entera: ocho de las diez traen el titulo impreso, asi que se contestan leyendo',
  );
});

test('el zoom de cada item sale del generador, no de un archivo suelto', () => {
  for (const i of items) {
    assert.ok(
      i.imagen.archivo.endsWith('-zoom'),
      `${i.id} usa «${i.imagen.archivo}»: la imagen que juega tiene que ser un zoom de ` +
        `scripts/generar-tapas.mjs, no un recorte decorativo del sistema visual`,
    );
  }
});

test('la imagen que el item promete existe en disco', () => {
  for (const i of items) {
    const ruta = rutaImagen(i.imagen);
    assert.ok(
      existsSync(`public${ruta}`),
      `${i.id} apunta a ${ruta} y ese archivo no existe: la pantalla mostraria un hueco`,
    );
  }
});
