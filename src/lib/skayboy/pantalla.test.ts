/**
 * El encuadre de la pantalla completa (`ADR-10.4`, `ADR-10.6`, `T-301`).
 *
 * Tres cosas, y las tres se vieron en rojo antes de quedar en verde:
 *
 * 1. **Los seis casos de la tabla de `ADR-10.4`**, con los números que la decisión escribió a
 *    mano. El 1 es el que caza el `round` en lugar del `floor`: con `round` da `E = 8` y un área
 *    de 1152 px de dispositivo de alto en una ventana de 1125.
 * 2. **Una grilla de ventanas y densidades** (1, 2, 2,625 y 3): el área entra siempre salvo en el
 *    piso, `E` es el entero más grande que entra (con uno más ya no entra), y la esquina cae en
 *    un píxel de dispositivo entero.
 * 3. **La caja de `UX-33`** (`cajaDelArea()`): qué se le descuenta a la ventana de costado y
 *    parado.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { NATIVO_ALTO, NATIVO_ANCHO, cajaDelArea, encuadre, type Encuadre } from './pantalla.ts';

/** Dos px CSS son "iguales" si difieren en menos de lo que la tabla de `ADR-10.4` redondea. */
function cerca(real: number, esperado: number, campo: string, caso: string): void {
  assert.ok(Math.abs(real - esperado) < 0.01, `${caso}: ${campo} dio ${real} y la tabla de ADR-10.4 dice ${esperado}`);
}

/** Un múltiplo de `1/dpr`, con la tolerancia de coma flotante que pide `ADR-10.6`. */
function esEnteroDeDispositivo(valorCss: number, dpr: number): boolean {
  const disp = valorCss * dpr;
  return Math.abs(disp - Math.round(disp)) < 1e-9 * Math.max(1, Math.abs(disp));
}

/* --------------------------------------------------------------------------
   1. La tabla de ADR-10.4, caso por caso
   -------------------------------------------------------------------------- */

const TABLA: ReadonlyArray<{
  caso: string;
  ventana: readonly [number, number, number];
  espera: Omit<Encuadre, 'escala'> & { escala: number };
}> = [
  {
    caso: '1 · 812 × 375 @ 3 (con round en vez de floor daría E = 8: 1152 px de dispositivo en 1125)',
    ventana: [812, 375, 3],
    espera: { escala: 7, ancho: 560, alto: 336, izquierda: 126, arriba: 19.67 },
  },
  {
    caso: '2 · 844 × 390 @ 3 (el que decide: 98 % del alto contra 74 % con escala CSS entera)',
    ventana: [844, 390, 3],
    espera: { escala: 8, ancho: 640, alto: 384, izquierda: 102, arriba: 3 },
  },
  {
    caso: '3 · 390 × 844 @ 3, vertical',
    ventana: [390, 844, 3],
    espera: { escala: 4, ancho: 320, alto: 192, izquierda: 35, arriba: 326 },
  },
  {
    caso: '4 · 915 × 412 @ 2,625, dpr fraccionario',
    ventana: [915, 412, 2.625],
    espera: { escala: 7, ancho: 640, alto: 384, izquierda: 137.52, arriba: 14.1 },
  },
  {
    caso: '5 · 1280 × 720 @ 1, escritorio',
    ventana: [1280, 720, 1],
    espera: { escala: 5, ancho: 1200, alto: 720, izquierda: 40, arriba: 0 },
  },
  {
    caso: '6 · 200 × 100 @ 1, el piso declarado',
    ventana: [200, 100, 1],
    espera: { escala: 1, ancho: 240, alto: 144, izquierda: -20, arriba: -22 },
  },
];

for (const { caso, ventana, espera } of TABLA) {
  test(`ADR-10.4, caso ${caso}`, () => {
    const [ancho, alto, dpr] = ventana;
    const e = encuadre(ancho, alto, dpr);
    assert.equal(e.escala, espera.escala, `${caso}: E dio ${e.escala} y la tabla dice ${espera.escala}`);
    cerca(e.ancho, espera.ancho, 'el ancho', caso);
    cerca(e.alto, espera.alto, 'el alto', caso);
    cerca(e.izquierda, espera.izquierda, 'la izquierda', caso);
    cerca(e.arriba, espera.arriba, 'el arriba', caso);
  });
}

/* --------------------------------------------------------------------------
   2. La grilla: entra, es la más grande, y arranca en un píxel entero
   -------------------------------------------------------------------------- */

const DENSIDADES = [1, 2, 2.625, 3] as const;
/** Anchos y altos en px CSS: teléfonos de costado y parados, tabletas, escritorio, y raros. */
const LADOS = [200, 240, 320, 360, 375, 390, 400.38, 412, 430, 568, 667, 720, 812, 844, 915, 932, 1024, 1280, 1920];

test('la grilla de ADR-10.6: el área entra salvo en el piso, E es la más grande, y la esquina cae en un px de dispositivo', () => {
  const fallas: string[] = [];
  let casos = 0;
  for (const dpr of DENSIDADES) {
    for (const ancho of LADOS) {
      for (const alto of LADOS) {
        casos++;
        const e = encuadre(ancho, alto, dpr);
        const donde = `${ancho} × ${alto} @ ${dpr}`;
        if (!Number.isInteger(e.escala) || e.escala < 1) fallas.push(`${donde}: E = ${e.escala} no es un entero ≥ 1`);
        const entra = NATIVO_ANCHO * e.escala <= ancho * dpr + 1e-9 && NATIVO_ALTO * e.escala <= alto * dpr + 1e-9;
        if (!entra && e.escala > 1) fallas.push(`${donde}: con E = ${e.escala} el área no entra y no es el piso`);
        // La más grande: con una más ya no entra. Sin esto, un `E = 1` fijo pasaría todo.
        const unaMas = e.escala + 1;
        if (NATIVO_ANCHO * unaMas <= ancho * dpr && NATIVO_ALTO * unaMas <= alto * dpr) {
          fallas.push(`${donde}: E = ${e.escala} y también entraba ${unaMas}`);
        }
        if (!esEnteroDeDispositivo(e.izquierda, dpr)) fallas.push(`${donde}: la izquierda (${e.izquierda}) cae entre dos px de dispositivo`);
        if (!esEnteroDeDispositivo(e.arriba, dpr)) fallas.push(`${donde}: el arriba (${e.arriba}) cae entre dos px de dispositivo`);
        // El área a E enteros ocupa E px de dispositivo por nativo, ni uno más.
        if (Math.abs(e.ancho * dpr - NATIVO_ANCHO * e.escala) > 1e-6) fallas.push(`${donde}: el ancho no es 240 · E px de dispositivo`);
        if (Math.abs(e.alto * dpr - NATIVO_ALTO * e.escala) > 1e-6) fallas.push(`${donde}: el alto no es 144 · E px de dispositivo`);
      }
    }
  }
  assert.ok(casos > 1000, `la grilla se achicó a ${casos} casos: no está mirando lo que dice`);
  assert.deepEqual(fallas, [], `\n  ${fallas.slice(0, 20).join('\n  ')}`);
});

test('un cociente exacto no pierde un entero por la coma flotante', () => {
  // 720 px CSS @ 1,4 son 1008 de dispositivo, exactamente 7 · 144; pero en coma flotante
  // 720 · 1,4 / 144 da 6,999999999999999, y el piso solo daría 6. Lo mismo de ancho con 1,3
  // (buscados a propósito: son de los pocos que caen del lado de abajo).
  assert.equal(encuadre(2000, 720, 1.4).escala, 7);
  assert.equal(encuadre((240 * 7) / 1.3, 2000, 1.3).escala, 7);
});

test('el origen de la caja se suma antes de redondear: la esquina final cae en un px entero', () => {
  // Con el bisel de 4 px CSS a 2,625 la caja arranca en 10,5 px de dispositivo. Redondear el
  // centrado y después sumar el origen dejaría el área en medio píxel: el caso feo, pero móvil.
  for (const dpr of DENSIDADES) {
    const e = encuadre(907, 376, dpr, { x: 4, y: 4 });
    assert.ok(esEnteroDeDispositivo(e.izquierda, dpr), `@ ${dpr}: izquierda ${e.izquierda}`);
    assert.ok(esEnteroDeDispositivo(e.arriba, dpr), `@ ${dpr}: arriba ${e.arriba}`);
  }
  // Y sin origen es la fórmula de ADR-10.4 tal cual.
  assert.deepEqual(encuadre(812, 375, 3, { x: 0, y: 0 }), encuadre(812, 375, 3));
});

/* --------------------------------------------------------------------------
   3. La caja de UX-33: lo que se le descuenta a la ventana
   -------------------------------------------------------------------------- */

const RESERVA = { bisel: 4, pie: 24, mando: 340 } as const;

test('UX-33 §1.3 y §1.7, de costado: se descuentan el pie y el bisel de los cuatro lados, y las teclas no', () => {
  assert.deepEqual(cajaDelArea(844, 390, RESERVA), { x: 4, y: 4, ancho: 836, alto: 358 });
  // Y con esa caja, en el teléfono común el área es de ×7 y no de ×8: el pie no se tapa.
  const caja = cajaDelArea(844, 390, RESERVA);
  const e = encuadre(caja.ancho, caja.alto, 3, caja);
  assert.equal(e.escala, 7);
  assert.ok(e.arriba + e.alto <= 390 - RESERVA.pie - RESERVA.bisel + 1e-9, 'el área pisa la chapa del pie');
  assert.ok(e.arriba >= RESERVA.bisel - 1e-9, 'el área pisa el bisel de arriba');
});

test('UX-33, parado: además se reserva el mando abajo, y el área queda arriba de las teclas', () => {
  assert.deepEqual(cajaDelArea(390, 844, RESERVA), { x: 4, y: 4, ancho: 382, alto: 472 });
  const caja = cajaDelArea(390, 844, RESERVA);
  const e = encuadre(caja.ancho, caja.alto, 3, caja);
  assert.equal(e.escala, 4);
  assert.ok(e.arriba + e.alto <= 844 - RESERVA.pie - RESERVA.mando, 'el área se mete debajo de las teclas');
});

test('una ventana más chica que lo reservado da una caja de cero, no negativa', () => {
  assert.deepEqual(cajaDelArea(6, 20, RESERVA), { x: 4, y: 4, ancho: 0, alto: 0 });
  assert.equal(encuadre(0, 0, 1).escala, 1);
});
