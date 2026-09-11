/**
 * Verificación de la púa (`ADR-07.7`, `T-218`).
 *
 * Lo que se prueba acá **no es que suene a púa**: eso lo decide un oído en un teléfono, y esa
 * lista está al final de `ARQ-rocola.md`. Lo que se prueba es todo lo que, si está mal, **no
 * se descubre escuchando**:
 *
 * - Que **no toque `destination`**. Un ruido colgado del destino sobrevive al apagón de la
 *   cinta y sigue sonando solo. Nadie reporta eso como defecto de la púa: lo reporta como
 *   "el sitio hace ruido".
 * - Que **todo lo que arranca tenga freno programado**. Una fuente en bucle sin `stop()` no
 *   es un ruido de más: es un ruido para siempre.
 * - Que **el gesto entero entre en `PUA_SEG`**. La rocola programa el tema contra ese
 *   número; si la púa se pasa, se le monta encima al primer acorde.
 * - Que **no use un solo `setTimeout`**. `ADR-04.10` prohíbe las dos formas de mirar el
 *   reloj, y esto se programa en el del audio.
 * - Que el módulo **no importe nada** (`D-29`): lo que nunca importa, nunca arrastra un
 *   `node:*` al teléfono de la gente.
 *
 * Los dobles son propios y no los de `cinta.test.ts`, por una razón concreta: acá hace falta
 * registrar **el instante y el desplazamiento de cada `start()`**, y las rampas
 * exponenciales, que aquel doble no guarda porque la cama no las usa.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  BARRIDO_DESDE_HZ,
  BARRIDO_HASTA_HZ,
  BARRIDO_SEG,
  CHASQUIDOS,
  GANANCIA_PUA,
  GOLPE_SEG,
  LARGO_RUIDO_PUA_SEG,
  PUA_SEG,
  SURCO_SEG,
  pua,
  reiniciarPuaParaPruebas,
} from './pua.ts';

const TASA = 48000;

// ---------------------------------------------------------------------------------------
// Los dobles
// ---------------------------------------------------------------------------------------

interface ParametroFalso {
  value: number;
  fijados: Array<{ a: number; en: number }>;
  rampas: Array<{ a: number; en: number; tipo: 'lineal' | 'exponencial' }>;
  setValueAtTime(a: number, en: number): void;
  linearRampToValueAtTime(a: number, en: number): void;
  exponentialRampToValueAtTime(a: number, en: number): void;
}

function parametroFalso(valor: number): ParametroFalso {
  const p: ParametroFalso = {
    value: valor,
    fijados: [],
    rampas: [],
    setValueAtTime(a, en) {
      p.fijados.push({ a, en });
      p.value = a;
    },
    linearRampToValueAtTime(a, en) {
      p.rampas.push({ a, en, tipo: 'lineal' });
      p.value = a;
    },
    exponentialRampToValueAtTime(a, en) {
      p.rampas.push({ a, en, tipo: 'exponencial' });
      p.value = a;
    },
  };
  return p;
}

interface NodoFalso {
  clase: 'fuente' | 'gain' | 'biquad';
  type: string;
  loop: boolean;
  buffer: unknown;
  gain: ParametroFalso;
  frequency: ParametroFalso;
  Q: ParametroFalso;
  onended: null | (() => void);
  arrancadoEn: number | null;
  desplazamiento: number | null;
  detenidoEn: number | null;
  desconexiones: number;
  connect(destino: NodoFalso | object): NodoFalso | object;
  disconnect(): void;
  start(en?: number, desplazamiento?: number): void;
  stop(en?: number): void;
}

interface Registro {
  nodos: NodoFalso[];
  buffers: Array<{ muestras: number }>;
  conexiones: Array<{ de: NodoFalso; a: unknown }>;
}

function nodoFalso(clase: NodoFalso['clase'], registro: Registro): NodoFalso {
  const nodo: NodoFalso = {
    clase,
    type: '',
    loop: false,
    buffer: null,
    gain: parametroFalso(1),
    frequency: parametroFalso(350),
    Q: parametroFalso(1),
    onended: null,
    arrancadoEn: null,
    desplazamiento: null,
    detenidoEn: null,
    desconexiones: 0,
    connect(destino) {
      registro.conexiones.push({ de: nodo, a: destino });
      return destino;
    },
    disconnect() {
      nodo.desconexiones++;
    },
    start(en, desplazamiento) {
      nodo.arrancadoEn = en ?? 0;
      nodo.desplazamiento = desplazamiento ?? 0;
    },
    stop(en) {
      nodo.detenidoEn = en ?? 0;
    },
  };
  registro.nodos.push(nodo);
  return nodo;
}

interface ContextoFalso {
  currentTime: number;
  sampleRate: number;
  destination: object;
  createBuffer(canales: number, muestras: number, tasa: number): unknown;
  createBufferSource(): NodoFalso;
  createGain(): NodoFalso;
  createBiquadFilter(): NodoFalso;
}

function contextoFalso(registro: Registro, ahora = 0): ContextoFalso {
  return {
    currentTime: ahora,
    sampleRate: TASA,
    destination: { esLaSalida: true },
    createBuffer(_canales, muestras) {
      registro.buffers.push({ muestras });
      const datos = new Float32Array(muestras);
      return { duration: muestras / TASA, length: muestras, getChannelData: () => datos };
    },
    createBufferSource: () => nodoFalso('fuente', registro),
    createGain: () => nodoFalso('gain', registro),
    createBiquadFilter: () => nodoFalso('biquad', registro),
  };
}

/** Un caso armado: contexto, destino y registro, con el módulo ya reiniciado. */
function caso(ahora = 0): { ctx: ContextoFalso; destino: NodoFalso; reg: Registro } {
  reiniciarPuaParaPruebas();
  const reg: Registro = { nodos: [], buffers: [], conexiones: [] };
  const ctx = contextoFalso(reg, ahora);
  const destino = nodoFalso('gain', reg);
  return { ctx, destino, reg };
}

const fuentes = (reg: Registro): NodoFalso[] => reg.nodos.filter((n) => n.clase === 'fuente');

// ---------------------------------------------------------------------------------------
// Las pruebas
// ---------------------------------------------------------------------------------------

test('devuelve el instante en que termina, que es cuando + PUA_SEG', () => {
  const { ctx, destino } = caso();
  const fin = pua(ctx as unknown as AudioContext, destino as unknown as AudioNode, 10);
  assert.equal(fin, 10 + PUA_SEG);
  assert.ok(fin > 10, 'el instante devuelto tiene que ser mayor que `cuando`');
});

test('sin `cuando`, arranca en el reloj del contexto', () => {
  const { ctx, destino } = caso(7.5);
  assert.equal(pua(ctx as unknown as AudioContext, destino as unknown as AudioNode), 7.5 + PUA_SEG);
});

test('🔴 nunca programa en el pasado: un `cuando` vencido se corre al presente', () => {
  const { ctx, destino, reg } = caso(20);
  const fin = pua(ctx as unknown as AudioContext, destino as unknown as AudioNode, 3);
  assert.equal(fin, 20 + PUA_SEG, 'se corre al presente, no arranca en el 3');
  for (const f of fuentes(reg)) {
    assert.ok(f.arrancadoEn! >= 20, `una fuente arrancó en ${f.arrancadoEn}, antes del presente`);
  }
});

test('🔴 no conecta nada a `destination`: todo va al nodo que le pasan', () => {
  const { ctx, destino, reg } = caso();
  pua(ctx as unknown as AudioContext, destino as unknown as AudioNode);
  for (const c of reg.conexiones) {
    assert.notEqual(c.a, ctx.destination, 'algo se colgó del destino y sobreviviría al apagón');
  }
  assert.ok(
    reg.conexiones.some((c) => c.a === destino),
    'nada llegó al destino que se le pasó',
  );
});

test('🔴 todo lo que arranca tiene freno programado, y ninguna fuente queda sin `stop`', () => {
  const { ctx, destino, reg } = caso();
  pua(ctx as unknown as AudioContext, destino as unknown as AudioNode, 5);
  const todas = fuentes(reg);
  assert.ok(todas.length > 0, 'no arrancó ni una fuente');
  for (const f of todas) {
    assert.notEqual(f.detenidoEn, null, 'una fuente en bucle quedó sin freno: sonaría para siempre');
    assert.ok(f.loop, 'la fuente tiene que estar en bucle para que el desplazamiento no se caiga del final');
  }
});

test('🔴 el gesto entero entra en PUA_SEG: la rocola programa el tema contra ese número', () => {
  const { ctx, destino, reg } = caso();
  const t0 = 4;
  pua(ctx as unknown as AudioContext, destino as unknown as AudioNode, t0);
  for (const f of fuentes(reg)) {
    assert.ok(
      f.detenidoEn! <= t0 + PUA_SEG + 1e-9,
      `un gesto termina en ${f.detenidoEn}, pasado el techo de ${t0 + PUA_SEG}: se le monta al primer acorde`,
    );
  }
});

test('el barrido baja de arriba hasta donde apoya, y lo hace en rampa exponencial', () => {
  const { ctx, destino, reg } = caso();
  pua(ctx as unknown as AudioContext, destino as unknown as AudioNode, 0);
  const conBarrido = reg.nodos.filter((n) =>
    n.frequency.rampas.some((r) => r.a === BARRIDO_HASTA_HZ && r.tipo === 'exponencial'),
  );
  assert.equal(conBarrido.length, 1, 'tiene que haber exactamente un barrido');
  const b = conBarrido[0]!;
  assert.ok(
    b.frequency.fijados.some((f) => f.a === BARRIDO_DESDE_HZ),
    'el barrido no arranca arriba',
  );
  const rampa = b.frequency.rampas.find((r) => r.a === BARRIDO_HASTA_HZ)!;
  const desde = b.frequency.fijados.find((f) => f.a === BARRIDO_DESDE_HZ)!;
  assert.ok(
    Math.abs(rampa.en - desde.en - BARRIDO_SEG) < 1e-9,
    'el barrido no dura BARRIDO_SEG',
  );
});

test('el surco arranca cuando la púa ya apoyó, no antes', () => {
  const { ctx, destino, reg } = caso();
  const t0 = 2;
  pua(ctx as unknown as AudioContext, destino as unknown as AudioNode, t0);
  const surcoDesde = t0 + GOLPE_SEG + BARRIDO_SEG;
  const surco = fuentes(reg).find(
    (f) => Math.abs(f.detenidoEn! - (surcoDesde + SURCO_SEG)) < 1e-9,
  );
  assert.ok(surco, 'no hay ningún gesto que termine donde termina el surco');
  assert.ok(Math.abs(surco.arrancadoEn! - surcoDesde) < 1e-9, 'el surco no arranca donde apoya la púa');
});

test('el polvo son exactamente CHASQUIDOS, y ninguno pisa el arranque del tema', () => {
  const { ctx, destino, reg } = caso();
  const t0 = 1;
  pua(ctx as unknown as AudioContext, destino as unknown as AudioNode, t0);
  const surcoDesde = t0 + GOLPE_SEG + BARRIDO_SEG;
  // Un chasquido es lo único que dura menos de 3 ms.
  const polvo = fuentes(reg).filter((f) => f.detenidoEn! - f.arrancadoEn! < 0.003);
  assert.equal(polvo.length, CHASQUIDOS, `el polvo tiene que ser ${CHASQUIDOS} pinchazos`);
  for (const p of polvo) {
    assert.ok(p.arrancadoEn! >= surcoDesde - 1e-9, 'un chasquido cayó antes del surco');
    assert.ok(p.detenidoEn! <= t0 + PUA_SEG + 1e-9, 'un chasquido se monta sobre el primer acorde');
  }
});

test('🔴 ninguna ganancia pasa del techo duro de ADR-07.7', () => {
  const { ctx, destino, reg } = caso();
  pua(ctx as unknown as AudioContext, destino as unknown as AudioNode);
  assert.ok(GANANCIA_PUA <= 0.3, 'la constante ya pasa el techo duro de 0,3');
  for (const n of reg.nodos) {
    for (const r of [...n.gain.rampas, ...n.gain.fijados]) {
      assert.ok(r.a <= GANANCIA_PUA + 1e-9, `una rampa de ganancia llegó a ${r.a}`);
    }
  }
});

test('el ruido se genera una sola vez por página, aunque suene muchas veces', () => {
  const { ctx, destino, reg } = caso();
  pua(ctx as unknown as AudioContext, destino as unknown as AudioNode, 0);
  pua(ctx as unknown as AudioContext, destino as unknown as AudioNode, 1);
  pua(ctx as unknown as AudioContext, destino as unknown as AudioNode, 2);
  assert.equal(reg.buffers.length, 1, 'regeneró el ruido: es trabajo por nada cada diez segundos');
  assert.equal(reg.buffers[0]!.muestras, Math.floor(LARGO_RUIDO_PUA_SEG * TASA));
});

test('`reiniciarPuaParaPruebas()` suelta el ruido, si no el módulo no se puede probar dos veces', () => {
  const a = caso();
  pua(a.ctx as unknown as AudioContext, a.destino as unknown as AudioNode);
  assert.equal(a.reg.buffers.length, 1);
  const b = caso();
  pua(b.ctx as unknown as AudioContext, b.destino as unknown as AudioNode);
  assert.equal(b.reg.buffers.length, 1, 'con otro contexto tiene que volver a generarlo');
});

test('🔴 si el contexto tira, devuelve igual el instante de fin y no deja nada colgado', () => {
  reiniciarPuaParaPruebas();
  const reg: Registro = { nodos: [], buffers: [], conexiones: [] };
  const ctx = contextoFalso(reg);
  const destino = nodoFalso('gain', reg);
  let creados = 0;
  ctx.createBiquadFilter = () => {
    creados++;
    if (creados > 2) throw new Error('este navegador no sabe');
    return nodoFalso('biquad', reg);
  };
  const fin = pua(ctx as unknown as AudioContext, destino as unknown as AudioNode, 9);
  assert.equal(fin, 9 + PUA_SEG, 'el tema tiene que arrancar aunque la púa no suene');
  for (const n of reg.nodos.filter((x) => x !== destino)) {
    assert.ok(n.desconexiones > 0, 'quedó un nodo colgado después de la falla');
  }
});

test('🔴 el surco avisa cuando termina, y ahí se suelta el grafo entero', () => {
  const { ctx, destino, reg } = caso();
  pua(ctx as unknown as AudioContext, destino as unknown as AudioNode, 0);
  const conAviso = reg.nodos.filter((n) => n.onended !== null);
  assert.equal(conAviso.length, 1, 'el aviso tiene que colgarse de un solo gesto, el que termina último');
  const antes = reg.nodos.reduce((s, n) => s + n.desconexiones, 0);
  assert.equal(antes, 0, 'no se soltó nada antes de tiempo');
  conAviso[0]!.onended!();
  const despues = reg.nodos.reduce((s, n) => s + n.desconexiones, 0);
  assert.ok(despues > 0, 'el aviso no soltó nada');
});

// ---------------------------------------------------------------------------------------
// Lo que se audita leyendo el archivo, porque no se puede probar corriéndolo
// ---------------------------------------------------------------------------------------

test('🔴 `pua.ts` no importa nada: es módulo hoja (D-29, ADR-07.9)', () => {
  const fuente = readFileSync(new URL('./pua.ts', import.meta.url), 'utf8');
  const importaciones = fuente.match(/^\s*import\s/gm) ?? [];
  assert.equal(
    importaciones.length,
    0,
    'importó algo: un módulo hoja que importa puede arrastrar `node:*` al navegador',
  );
});

test('🔴 `pua.ts` no usa ninguna de las formas prohibidas por ADR-04.1 y ADR-07.7', () => {
  const fuente = readFileSync(new URL('./pua.ts', import.meta.url), 'utf8');
  // Se mira solo el código: los comentarios las nombran a propósito, para que se sepa qué
  // está prohibido. Una prueba que mire el archivo entero prohibiría explicarlo.
  const codigo = fuente
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');
  for (const prohibida of [
    'ConvolverNode',
    'createConvolver',
    'AudioWorkletNode',
    'audioWorklet',
    'ScriptProcessorNode',
    'createScriptProcessor',
    'setTimeout',
    'setInterval',
    'requestAnimationFrame',
    'fetch(',
    'destination',
  ]) {
    assert.ok(!codigo.includes(prohibida), `usa ${prohibida}, que ADR-07.7 prohíbe adentro de este módulo`);
  }
});
