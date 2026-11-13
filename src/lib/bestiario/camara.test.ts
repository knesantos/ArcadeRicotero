/**
 * La cámara del camino (`D-80`): que se mueva cuando tiene que moverse, que se calme sola y que
 * nunca muestre el borde de la escena.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CAMARA, MARGEN, PRIMER_PASO, crearCamara, primerPaso, transformDe } from './camara.ts';

const ANCHO = 375;
const ALTO = 640;
const DT = 1 / 60;

/** Corre la cámara `segundos`, caminando `porSegundo` unidades, y junta los encuadres. */
function correr(cam: ReturnType<typeof crearCamara>, segundos: number, porSegundo: number, desde = 0) {
  const salida = [];
  for (let k = 0; k < Math.round(segundos / DT); k++) {
    cam.caminar(porSegundo * DT, DT);
    salida.push(cam.encuadre(desde + k * DT, DT, ANCHO, ALTO));
  }
  return salida;
}

test('caminando, la cámara va y viene; quieta, apenas respira', () => {
  const andando = correr(crearCamara(85), 3, 400);
  const quieta = correr(crearCamara(85), 3, 0);
  const rango = (xs: number[]) => Math.max(...xs) - Math.min(...xs);
  assert.ok(rango(andando.map((e) => e.y)) > 2.5, 'caminar tiene que notarse');
  assert.ok(rango(andando.map((e) => e.giro)) > 0.2, 'y bambolearse de lado a lado');
  assert.ok(rango(quieta.map((e) => e.y)) < 2.5, 'quieta solo respira');
  assert.ok(rango(quieta.map((e) => e.giro)) < 0.01, 'y no se bambolea');
});

test('el vaivén va atado a lo caminado: un paso cada zancada, no cada tanto tiempo', () => {
  // Al doble de velocidad, el mismo tramo se camina en la mitad de cuadros, con los mismos topes.
  const topes = (porSegundo: number, segundos: number) => {
    const ys = correr(crearCamara(85), segundos, porSegundo).map((e) => e.y);
    return ys.filter((y, i) => i > 0 && i < ys.length - 1 && y > ys[i - 1]! && y >= ys[i + 1]!).length;
  };
  const lento = topes(300, 4);
  const ligero = topes(600, 2);
  assert.ok(Math.abs(lento - ligero) <= 2, `${lento} contra ${ligero}`);
});

test('el sacudón tiembla fuerte y se apaga solo en un par de segundos', () => {
  const cam = crearCamara(85);
  cam.sacudir(0.95);
  const primero = correr(cam, 0.3, 0);
  assert.ok(Math.max(...primero.map((e) => Math.abs(e.giro))) > 0.3, 'el golpe se tiene que sentir');
  correr(cam, 2, 0, 0.3);
  assert.equal(cam.trauma(), 0);
});

test('un golpe chico casi no se siente: tiembla con el cuadrado del trauma', () => {
  const chico = crearCamara(85);
  chico.sacudir(0.15);
  const grande = crearCamara(85);
  grande.sacudir(0.9);
  const giro = (c: ReturnType<typeof crearCamara>) => Math.max(...correr(c, 0.4, 0).map((e) => Math.abs(e.giro)));
  assert.ok(giro(grande) > giro(chico) * 8);
});

test('por más que tiemble, nunca se ve el borde de la escena', () => {
  const cam = crearCamara(85, 0);
  for (let k = 0; k < 6; k++) cam.sacudir(1);
  cam.acercarse(10, 10, 0);
  for (const e of correr(cam, 4, 900)) {
    assert.ok(e.escala >= 1 + MARGEN * 0.5, 'la escala nunca baja del margen');
    // Lo que se corre no puede pasar lo que agranda la escala.
    assert.ok(Math.abs(e.x) <= ((e.escala - 1) * ANCHO) / 2 + 0.01);
    assert.ok(e.y <= (e.escala - 1) * e.oy + 0.01, 'no asoma el borde de arriba');
    assert.ok(-e.y <= (e.escala - 1) * (ALTO - e.oy) + 0.01, 'no asoma el borde de abajo');
  }
});

test('lo que agranda se lo come el cielo: el piso casi no se corta', () => {
  const cam = crearCamara(85);
  for (const e of correr(cam, 2, 300)) {
    // Lo que queda afuera por abajo: lo que agranda la escena debajo de `oy`, más lo que se sube.
    const afuera = (e.escala - 1) * (ALTO - e.oy) - e.y;
    assert.ok(afuera <= ALTO * 0.012, `se cortan ${afuera.toFixed(1)} px del piso`);
  }
});

test('tocar un bicho arrima la cámara y después vuelve', () => {
  const cam = crearCamara(85);
  cam.acercarse(300, 200, 0);
  const durante = correr(cam, 0.8, 0);
  const A = CAMARA.acercarse;
  const despues = correr(cam, 3, 0, A.entra + A.queda + 0.1);
  assert.ok(Math.max(...durante.map((e) => e.escala)) > 1 + MARGEN + A.cuanto * 0.9);
  assert.ok(Math.abs(despues.at(-1)!.escala - (1 + MARGEN)) < 0.002);
});

test('la entrada arranca más cerca y se asienta', () => {
  const cam = crearCamara(85, 0);
  const e = correr(cam, CAMARA.entrada.dura + 0.5, 0);
  assert.ok(e[0]!.escala > e.at(-1)!.escala + CAMARA.entrada.cerca * 0.8);
});

test('el transform gira alrededor del punto de la vista, con el paralaje adentro', () => {
  const t = transformDe({ x: 0, y: 0, giro: 0, escala: 1, ox: 100, oy: 50 }, 0, -30);
  assert.match(t, /^translate\(100\.0px, 50\.0px\) rotate\(0\.000deg\) scale\(1\.0000\) translate\(-100\.0px, -50\.0px\) translate3d\(-30\.0px, 0, 0\)$/);
});

test('el camino usa la cámara solo sin movimiento reducido, y la vaca la sacude', () => {
  const camino = readFileSync('src/scripts/camino.ts', 'utf-8');
  assert.match(camino, /if \(!quieto\(\)\) \{[\s\S]*camara\.encuadre/);
  assert.match(readFileSync('src/scripts/bestiario/pastura.ts', 'utf-8'), /sacudir\(0\.9/);
});


test('el primer paso (D-83): arranca y llega despacio, de cero a uno, y no se pasa', () => {
  assert.equal(primerPaso(0), 0);
  assert.equal(primerPaso(1), 1);
  assert.equal(primerPaso(-0.5), 0, 'antes de arrancar, quieto');
  assert.equal(primerPaso(1.5), 1, 'después de llegar, quieto');
  const pasos = Array.from({ length: 11 }, (_, i) => primerPaso(i / 10));
  for (let i = 1; i < pasos.length; i++) assert.ok(pasos[i]! >= pasos[i - 1]!, 'no vuelve para atrás');
  assert.ok(pasos[1]! < 0.1 && pasos[9]! > 0.9, 'despacio en las dos puntas');
  assert.ok(PRIMER_PASO.cuanto < 0.5 && PRIMER_PASO.tope <= 200 && PRIMER_PASO.dura >= 1, 'es un paso corto, no un paseo');
});
