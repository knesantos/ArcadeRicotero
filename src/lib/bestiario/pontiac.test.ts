import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { CONTORNOS_PONTIAC, PIEZAS_PONTIAC, PONTIAC } from './arte-pontiac.ts';
import { ASUSTADA, PONTIAC_ARMADO, PONTIAC_VIDA, QUIETA, transformaciones } from './rig-pontiac.ts';
import { escenaRuta } from './escenas-entornos.ts';
import { pisoDelCamino } from './escenas-camino.ts';
import { CAMINOS } from './camino.ts';
import { FIERROS, OJOS_DE_LA_RUTA, RUTA } from './rig-entornos.ts';
import { armarRecinto } from '../../scripts/bestiario/recintos.ts';
import { vuelo } from '../../scripts/bestiario/pontiac.ts';

/**
 * La Mariposa Pontiac (`D-73`, decimoquinta vuelta): el primer fierro de la ruta que es títere. Lo que
 * se mide acá es lo suyo: que el títere esté entero, que pise su carril y no le tape la cara a nadie,
 * que la pose quieta sea la de sin JavaScript, y que viva como dice su conducta —respira, pliega,
 * mira al que pasa— y, tocada, despegue y vuelva al carril sin que el fierro pegue su saltito.
 */

const datos = JSON.parse(readFileSync('src/data/bestiario.json', 'utf-8')) as { bestias: Array<{ id: string; nombre: string; estampa: string; cuenta?: Array<{ rotulo: string; fuente?: string; quien?: string }> }> };
const nombres = new Map(datos.bestias.map((b) => [b.id, b.nombre]));
const ID = 'la-mariposa-pontiac';
type P = readonly [number, number];

/* ------------------------------------------------------------------
   Un DOM de juguete: lo justo para que la isla corra en Node
   ------------------------------------------------------------------ */

const kebab = (s: string): string => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
const camel = (s: string): string => s.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

class Nodo {
  attrs = new Map<string, string>();
  hijos: Nodo[] = [];
  parentElement: Nodo | null = null;
  dataset: Record<string, string | undefined>;
  classList = { contains: (c: string): boolean => (this.attrs.get('class') ?? '').split(/\s+/).includes(c) };
  tagName: string;
  constructor(tagName: string) {
    this.tagName = tagName;
    this.dataset = new Proxy({} as Record<string, string | undefined>, {
      get: (_, k: string) => this.attrs.get(`data-${kebab(k)}`),
      set: (_, k: string, v: string) => (this.attrs.set(`data-${kebab(k)}`, String(v)), true),
    });
  }
  getAttribute(n: string): string | null {
    return this.attrs.get(n) ?? null;
  }
  setAttribute(n: string, v: string): void {
    this.attrs.set(n, v);
  }
  addEventListener(): void {}
  /** Un selector simple: `tag`, `.clase`, `[attr]`, `[attr="v"]`, juntos o separados por comas. */
  coincide(sel: string): boolean {
    return sel.split(',').some((s) => {
      const m = s.trim().match(/^([a-zA-Z]*)((?:\.[\w-]+)*)((?:\[[^\]]+\])*)$/);
      if (!m) throw new Error(`selector que el juguete no entiende: ${s}`);
      if (m[1] && m[1] !== this.tagName) return false;
      for (const c of m[2]!.split('.').filter(Boolean)) if (!this.classList.contains(c)) return false;
      for (const a of m[3]!.match(/\[[^\]]+\]/g) ?? []) {
        const [, n, v] = a.match(/^\[([\w-]+)(?:="([^"]*)")?\]$/)!;
        if (!this.attrs.has(n!) || (v !== undefined && this.attrs.get(n!) !== v)) return false;
      }
      return true;
    });
  }
  querySelectorAll<T = Nodo>(sel: string): T[] {
    const salida: Nodo[] = [];
    const recorrer = (n: Nodo): void => n.hijos.forEach((h) => (h.coincide(sel) && salida.push(h), recorrer(h)));
    recorrer(this);
    return salida as T[];
  }
  querySelector<T = Nodo>(sel: string): T | null {
    return (this.querySelectorAll<T>(sel)[0] ?? null) as T | null;
  }
  closest<T = Nodo>(sel: string): T | null {
    for (let n: Nodo | null = this; n; n = n.parentElement) if (n.coincide(sel)) return n as T;
    return null;
  }
}

function armar(marcado: string): Nodo {
  const raiz = new Nodo('svg');
  const pila = [raiz];
  for (const m of marcado.matchAll(/<(\/?)([a-zA-Z][\w:-]*)((?:\s+[\w:-]+="[^"]*")*)\s*(\/?)>/g)) {
    if (m[1]) {
      pila.pop();
      continue;
    }
    const n = new Nodo(m[2]!);
    for (const a of m[3]!.matchAll(/([\w:-]+)="([^"]*)"/g)) n.attrs.set(a[1]!, a[2]!);
    n.parentElement = pila[pila.length - 1]!;
    n.parentElement.hijos.push(n);
    if (!m[4]) pila.push(n);
  }
  return raiz;
}

/** La escena del recinto de la ruta, viva: el tránsito de verdad y la conducta de verdad. */
function rutaViva(quieto = false, marcado = escenaRuta(nombres), ancho = 900) {
  const raiz = armar(marcado);
  const hablados: string[] = [];
  let reloj = 0;
  const vida = armarRecinto('la-ruta', raiz as unknown as SVGSVGElement, {
    hablar: (id) => hablados.push(id),
    quieto: () => quieto,
    reloj: () => reloj,
    ancho,
  });
  const parte = (n: string): Nodo => raiz.querySelector(`[data-marco="${ID}"]`)!.querySelector(`[data-parte="${n}"]`)!;
  const fierro = raiz.querySelector(`.bestia--fierro[data-id="${ID}"]`)!;
  return {
    raiz,
    vida,
    parte,
    fierro,
    hablados,
    correr(hasta: number, cada: (t: number) => void = () => {}) {
      const dt = 1 / 60;
      while (reloj < hasta) {
        reloj += dt;
        vida.mover(reloj, dt);
        cada(reloj);
      }
    },
    get reloj() {
      return reloj;
    },
  };
}

/* ------------------------------------------------------------------
   Las cuentas de los transform
   ------------------------------------------------------------------ */

type M = [number, number, number, number, number, number];
const mult = (a: M, b: M): M => [a[0] * b[0] + a[2] * b[1], a[1] * b[0] + a[3] * b[1], a[0] * b[2] + a[2] * b[3], a[1] * b[2] + a[3] * b[3], a[0] * b[4] + a[2] * b[5] + a[4], a[1] * b[4] + a[3] * b[5] + a[5]];
function matriz(t: string): M {
  let m: M = [1, 0, 0, 1, 0, 0];
  for (const [, op, args] of t.matchAll(/(translate|scale|rotate)\(([^)]*)\)/g)) {
    const v = args!.trim().split(/[\s,]+/).map(Number);
    if (op === 'translate') m = mult(m, [1, 0, 0, 1, v[0]!, v[1] ?? 0]);
    else if (op === 'scale') m = mult(m, [v[0]!, 0, 0, v[1] ?? v[0]!, 0, 0]);
    else {
      const a = (v[0]! * Math.PI) / 180;
      const [cx, cy] = [v[1] ?? 0, v[2] ?? 0];
      m = mult(mult(mult(m, [1, 0, 0, 1, cx, cy]), [Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0]), [1, 0, 0, 1, -cx, -cy]);
    }
  }
  return m;
}
const aplicar = (m: M, [x, y]: P): P => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
const achica = ({ raiz: [rx, ry], k }: { raiz: P; k: number }): M => matriz(`translate(${rx} ${ry}) scale(${k}) translate(${-rx} ${-ry})`);

/** Los contornos de las alas en la escena, en una pose, con el fierro parado en `x`. */
function alasEnLaEscena(pose = QUIETA, x = FIERROS[ID].x): Array<{ parte: string; puntos: P[] }> {
  const t = transformaciones(pose);
  const E = PONTIAC_ARMADO.escalaAlas;
  const afuera = mult(matriz(`translate(${x} ${RUTA.carriles[FIERROS[ID].carril]})`), matriz(t.entero!.transform));
  const cadena: Record<string, M> = {
    'ala-anterior': mult(mult(afuera, matriz(t['ala-anterior']!.transform)), achica(E.anterior)),
    'ala-posterior': mult(mult(afuera, matriz(t['ala-posterior']!.transform)), achica(E.posterior)),
    cola: mult(mult(mult(afuera, matriz(t['ala-posterior']!.transform)), achica(E.posterior)), matriz(t.cola!.transform)),
    'ala-lejos': mult(mult(afuera, matriz(t['ala-lejos']!.transform)), achica(E.anterior)),
  };
  return Object.entries(CONTORNOS_PONTIAC).flatMap(([parte, polis]) => polis.map((pts) => ({ parte, puntos: pts.map((q) => aplicar(cadena[parte]!, q)) })));
}

function adentro([x, y]: P, poli: readonly P[]): boolean {
  let si = false;
  for (let i = 0, j = poli.length - 1; i < poli.length; j = i++) {
    const [xi, yi] = poli[i]!;
    const [xj, yj] = poli[j]!;
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) si = !si;
  }
  return si;
}

/* ------------------------------------------------------------------
   El títere
   ------------------------------------------------------------------ */

test('la Mariposa Pontiac es un títere entero: cada parte que mueve la isla, con su imagen y su pivote', () => {
  const marcado = PONTIAC!.fierro!();
  assert.ok(PIEZAS_PONTIAC.length >= 5 && PIEZAS_PONTIAC.length <= 14, `tiene ${PIEZAS_PONTIAC.length} piezas`);
  for (const nombre of Object.keys(transformaciones(QUIETA))) assert.ok(marcado.includes(`data-parte="${nombre}"`), `le falta ${nombre}`);
  const imagenes = new Set([...marcado.matchAll(/href="\/bestiario\/([a-z0-9-]+)\.webp"/g)].map((m) => m[1]!));
  assert.deepEqual([...imagenes].sort(), PIEZAS_PONTIAC.map((p) => p.nombre).sort(), 'usa piezas que no se imprimen, o le sobra una');
  // No se toca por su cuenta: el que se toca es el fierro que la lleva.
  assert.ok(!/data-id=/.test(marcado) && !/class="titere/.test(marcado));
  const caja = (n: string): readonly [number, number, number, number] => PIEZAS_PONTIAC.find((p) => p.nombre === n)!.caja;
  const en = (n: string, [x, y]: P): boolean => {
    const [x0, y0, w, h] = caja(n);
    return x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
  };
  const A = PONTIAC_ARMADO;
  for (const ala of ['pontiac-ala-anterior', 'pontiac-ala-posterior', 'pontiac-alas-lejos']) assert.ok(en(ala, A.bisagra), `${ala} no se agarra del lomo`);
  assert.ok(en('pontiac-cuerpo', A.bisagra), 'el lomo no está en el techo');
  assert.ok(en('pontiac-cola', A.cola) && en('pontiac-ala-posterior', A.cola), 'la cola no cuelga del ala de atrás');
  for (const r of A.ruedas) assert.ok(en('pontiac-chasis', r) && en('pontiac-cuerpo', r), 'una rueda gira en el aire');
  for (const a of A.antenas) assert.ok(en('pontiac-cuerpo', a), 'una antena no sale de la trompa');
  assert.ok(en('pontiac-cuerpo', A.llama), 'la vela no está en el busto');
  assert.ok(en('pontiac-ala-anterior', A.ojos[0].centro) && en('pontiac-ala-posterior', A.ojos[1].centro), 'un ojo se salió de su ala');
  // Cada ojo, con su iris y su párpado, adentro de su óvalo de cobre.
  A.ojos.forEach((o, i) => {
    const [rx, ry] = A.ovalos[i]!;
    assert.ok(o.radio[0] + 1 < rx * 0.76 && o.radio[1] < ry, `el ojo ${i + 1} no entra en su óvalo`);
    assert.ok(o.mira[0] + 3.6 <= o.radio[0] + 0.5, `el iris ${i + 1} se sale del blanco`);
  });
  for (const m of marcado.matchAll(/data-parte="parpado-\d"[^>]*>/g)) assert.match(m[0], /data-pivote="-?[\d.]+ -?[\d.]+"/);
  // Ningún hex: las tintas son tokens.
  for (const p of PIEZAS_PONTIAC) assert.ok(!/(fill|stroke|stop-color|flood-color)="#/.test(p.dibujo), `${p.nombre} tiene un hex`);
  // Las alas son el mármol de la tapa de verdad, y los ocelos, su óvalo de cobre.
  for (const n of ['pontiac-ala-anterior', 'pontiac-ala-posterior', 'pontiac-cola', 'pontiac-alas-lejos']) {
    assert.ok(PIEZAS_PONTIAC.find((p) => p.nombre === n)!.dibujo.includes('href="tapa:luzbelito-frontal"'), `${n} no es de la tapa`);
  }
});

test('el peso de las piezas está en lo que se pide', () => {
  let total = 0;
  for (const p of PIEZAS_PONTIAC) total += readFileSync(`public/bestiario/${p.nombre}.webp`).length;
  assert.ok(total >= 80 * 1024 && total <= 250 * 1024, `pesan ${Math.round(total / 1024)} kB`);
});

test('pisa su carril con las ruedas, y la caja no se va lejos de la del fierro viejo', () => {
  const t = transformaciones(QUIETA);
  const A = PONTIAC_ARMADO;
  A.ruedas.forEach((_, i) => {
    const [, y] = aplicar(mult(matriz(t.entero!.transform), matriz(t[`rueda-${i + 1}`]!.transform)), [0, A.radioRueda]);
    assert.ok(Math.abs(y) < 0.01, `la rueda ${i + 1} no toca el carril`);
  });
  // Lo que se ve de ella, en las cuentas del fierro: lo del fierro viejo, y un poco más para arriba y
  // para atrás (las alas y la cola), sin pasarse.
  const [cx, cy, cw, ch] = FIERROS[ID].caja;
  const x = FIERROS[ID].x;
  const y = RUTA.carriles[FIERROS[ID].carril];
  const pts = alasEnLaEscena().flatMap((a) => a.puntos).map(([px, py]) => [px - x, py - y] as const);
  const [x0, y0] = [Math.min(...pts.map((p) => p[0])), Math.min(...pts.map((p) => p[1]))];
  const x1 = Math.max(...pts.map((p) => p[0]));
  assert.ok(x0 > cx - 90 && y0 > cy - 50 && x1 < cx + cw, `se va de la caja del fierro: (${x0.toFixed(0)}, ${y0.toFixed(0)}) a ${x1.toFixed(0)}`);
  assert.ok(cy + ch > 0, 'la caja del fierro no llega al carril');
});

test('entra entera en el recinto y no le tapa la cara a nadie de la banquina', () => {
  for (const pose of [QUIETA, ASUSTADA]) {
    for (const { parte, puntos } of alasEnLaEscena(pose)) {
      for (const [px, py] of puntos) assert.ok(px > 0 && px < 900 && py > 0 && py < 640, `${parte} se sale de la escena`);
      // Los ojos de los que esperan en la banquina, que la escena deja quietos.
      for (const [id, [ox, oy]] of Object.entries(OJOS_DE_LA_RUTA)) {
        for (const dx of [-6, 6]) assert.ok(!adentro([ox + dx, oy], puntos), `${parte} le tapa la cara a ${id}`);
      }
    }
  }
});

test('el bocadillo cuelga arriba de las alas: no le tapa los ojos cuando la tocan', () => {
  const r = rutaViva();
  const cuelga = Number(r.fierro.dataset.y) - 26;
  const arriba = Math.min(...alasEnLaEscena().flatMap((a) => a.puntos.map((q) => q[1])));
  assert.ok(cuelga < arriba, `el bocadillo cuelga en ${cuelga}, y las alas llegan a ${arriba.toFixed(0)}`);
  assert.ok(cuelga > 150, 'arriba del bocadillo no queda lugar');
  // Los ojos, en el susto, quedan debajo de donde cuelga.
  const t = transformaciones(ASUSTADA);
  const y = RUTA.carriles[FIERROS[ID].carril];
  for (const [i, ala] of [[0, 'ala-anterior'], [1, 'ala-posterior']] as const) {
    const k = i ? PONTIAC_ARMADO.escalaAlas.posterior : PONTIAC_ARMADO.escalaAlas.anterior;
    const [, oy] = aplicar(mult(mult(matriz(t[ala]!.transform), achica(k)), matriz('')), PONTIAC_ARMADO.ojos[i]!.centro);
    assert.ok(y + oy - PONTIAC_ARMADO.ovalos[i]![1] > cuelga + 20, `el bocadillo le tapa el ojo ${i + 1}`);
  }
});

test('la pose quieta es la de sin JavaScript, en el recinto y en el camino', () => {
  for (const [marcado, ancho] of [[escenaRuta(nombres), 900], [pisoDelCamino(CAMINOS['la-ruta']!, nombres), CAMINOS['la-ruta']!.escena]] as const) {
    const html = armar(marcado);
    const antes = new Map(html.querySelector(`[data-marco="${ID}"]`)!.querySelectorAll('[data-parte]').map((n) => [n.dataset.parte!, n.getAttribute('transform')]));
    assert.ok(antes.size >= 16, 'faltan partes en el marcado');
    const r = rutaViva(true, marcado, ancho);
    r.vida.mover(0, 0);
    for (const [n, t] of antes) assert.equal(r.parte(n).getAttribute('transform'), t, `${n} cambia de pose con la isla quieta`);
    assert.deepEqual(Object.fromEntries([...antes].filter(([n]) => n in transformaciones(QUIETA)).map(([n, t]) => [n, t])), Object.fromEntries(Object.entries(transformaciones(QUIETA)).map(([n, a]) => [n, a.transform])));
  }
});

/* ------------------------------------------------------------------
   La vida
   ------------------------------------------------------------------ */

/** El ángulo de abrir que se lee de la altura del ala de este lado, para medirlo desde afuera. */
const alturaDelAla = (r: ReturnType<typeof rutaViva>): number => matriz(r.parte('ala-anterior').getAttribute('transform')!)[3];
const altoDe = (r: ReturnType<typeof rutaViva>): number => -matriz(r.parte('entero').getAttribute('transform')!)[5];

test('viaja con el tránsito y respira con las alas, cada vez distinto, y cada tanto las pliega', () => {
  const r = rutaViva();
  const alturas: number[] = [];
  const xs: number[] = [];
  const antena: string[] = [];
  let parpadeos = 0;
  let cerrado = false;
  r.correr(40, () => {
    alturas.push(alturaDelAla(r));
    xs.push(Number(r.fierro.dataset.ahora));
    antena.push(r.parte('antena-1').getAttribute('transform')!);
    const k = matriz(r.parte('parpado-1').getAttribute('transform')!)[3];
    if (k > 0.95 && !cerrado) parpadeos++;
    cerrado = k > 0.95;
    assert.ok(Math.abs(altoDe(r)) < 0.01, 'despegó sin que la toquen');
  });
  // El tránsito la lleva: avanza a la velocidad del carril de adelante.
  assert.ok(xs[60]! > xs[0]! + 40, 'no viaja con el tránsito');
  // Respira: abre y cierra, y no siempre igual.
  const minimos: number[] = [];
  for (let i = 1; i < alturas.length - 1; i++) if (alturas[i]! > alturas[i - 1]! && alturas[i]! >= alturas[i + 1]!) minimos.push(i / 60);
  const entre = minimos.slice(1).map((t, i) => t - minimos[i]!);
  assert.ok(entre.length >= 6, `respiró ${entre.length} veces en 40 segundos`);
  const media = entre.reduce((s, v) => s + v, 0) / entre.length;
  assert.ok(Math.sqrt(entre.reduce((s, v) => s + (v - media) ** 2, 0) / entre.length) > 0.15, 'respira como un metrónomo');
  // Pliega del todo al menos una vez (el ala de este lado se ve casi entera).
  assert.ok(Math.max(...alturas) > 0.97, 'nunca pliega las alas');
  assert.ok(Math.min(...alturas) < 0.82, 'nunca abre las alas');
  assert.ok(new Set(antena).size > 200, 'las antenas no tantean');
  assert.ok(parpadeos >= 5, `parpadeó ${parpadeos} veces en 40 segundos`);
});

test('en el camino de la ruta también viaja con el tránsito y vive, corrida con k', () => {
  const tramo = CAMINOS['la-ruta']!;
  const r = rutaViva(false, pisoDelCamino(tramo, nombres), tramo.escena);
  const desde = Number(r.fierro.dataset.x);
  assert.ok(desde > FIERROS[ID].x * 2, 'en el camino no está corrida con k');
  const alas = new Set<string>();
  r.correr(4, () => alas.add(r.parte('ala-anterior').getAttribute('transform')!));
  assert.ok(Number(r.fierro.dataset.ahora) > desde + 150, 'en el camino no viaja');
  assert.ok(alas.size > 12, `en el camino no respira (${alas.size} poses en 4 segundos)`);
  r.vida.reaccionar(ID, r.reloj);
  let alto = 0;
  r.correr(r.reloj + 2, () => (alto = Math.max(alto, altoDe(r))));
  assert.ok(alto > 20, 'en el camino no despega');
});

test('cuando alcanza al bondi, el viento le tira las alas para atrás y mira al zumba colgado', () => {
  const r = rutaViva();
  // Los dos corren en el recinto: el carril de adelante va más rápido y lo alcanza a los 97 segundos.
  let visto = false;
  r.correr(100, (t) => {
    const yo = Number(r.fierro.dataset.ahora);
    const bondi = Number(r.raiz.querySelector('.bestia--fierro[data-id="el-zumba"]')!.dataset.ahora);
    if (t > 60 && Math.abs(yo - bondi) < 40) {
      const iris = matriz(r.parte('iris-1').getAttribute('transform')!);
      const giro = r.parte('ala-anterior').getAttribute('transform')!.match(/rotate\((-?[\d.]+)/)![1];
      // Mira para atrás (el zumba va colgado de la cola del bondi) y las alas van barridas.
      assert.ok(iris[4] < PONTIAC_ARMADO.ojos[0].centro[0] - 1.5, 'no mira al zumba');
      assert.ok(Number(giro) < -QUIETA.barre - 6, 'el viento del bondi no le mueve las alas');
      visto = true;
    }
  });
  assert.ok(visto, 'no lo alcanzó nunca');
});

test('tocada, se asusta, despega a los aletazos y vuelve al carril, sin el saltito de los fierros', () => {
  const r = rutaViva();
  r.correr(2);
  r.vida.reaccionar(ID, r.reloj);
  const desde = r.reloj;
  let alto = 0;
  let colgadas = false;
  let aletazos = 0;
  let abriendo = false;
  let antes = alturaDelAla(r);
  let asustada = false;
  let alCielo = false;
  r.correr(desde + PONTIAC_VIDA.asienta + 1.5, (t) => {
    const u = t - desde;
    alto = Math.max(alto, altoDe(r));
    // El fierro no salta: el traqueteo y nada más.
    const cuerpo = r.fierro.querySelector('.cuerpo')!.getAttribute('transform')!;
    assert.ok(Math.abs(Number(cuerpo.match(/translate\(-?[\d.]+ (-?[\d.]+)\)/)![1])) < 0.75, 'el fierro pegó su saltito');
    if (u < PONTIAC_VIDA.susto && u > 0.2) asustada ||= matriz(r.parte('parpado-1').getAttribute('transform')!)[3] < 0.05;
    if (altoDe(r) > 12) {
      colgadas ||= matriz(r.parte('rueda-1').getAttribute('transform')!)[5] > PONTIAC_ARMADO.ruedas[0]![1] + 5;
      alCielo ||= matriz(r.parte('iris-1').getAttribute('transform')!)[5] < PONTIAC_ARMADO.ojos[0].centro[1] - 0.5;
    }
    const h = alturaDelAla(r);
    if (h < antes - 0.004 && !abriendo) aletazos++;
    abriendo = h < antes - 0.004;
    antes = h;
  });
  assert.ok(asustada, 'no abre los ojos del susto');
  assert.ok(alto > PONTIAC_VIDA.alto * 0.85, `despegó apenas ${alto.toFixed(1)}`);
  assert.ok(colgadas, 'en el aire no le cuelgan las ruedas');
  assert.ok(alCielo, 'en el aire no mira para arriba');
  assert.ok(aletazos >= 3, `dio ${aletazos} aletazos`);
  assert.ok(Math.abs(altoDe(r)) < 0.01, 'no volvió al carril');
});

test('el vuelo es de títere con peso: sube despacio, se hunde una vez al bajar y no rebota', () => {
  const V = PONTIAC_VIDA;
  let anterior = 0;
  let maxSalto = 0;
  for (let u = 0; u < V.asienta; u += 1 / 120) {
    const v = vuelo(u);
    maxSalto = Math.max(maxSalto, Math.abs(v.alto - anterior) * 120);
    anterior = v.alto;
    if (v.tramo === 'asienta') assert.ok(v.alto <= 0.001 && v.alto > -3, 'al bajar rebota o se hunde de más');
  }
  assert.ok(maxSalto < 120, `sube a ${maxSalto.toFixed(0)} por segundo: es un rebote, no un vuelo`);
  assert.equal(vuelo(V.asienta).tramo, 'nada');
  assert.equal(vuelo(-1).alto, 0);
});

test('con movimiento reducido no se mueve, y tocada queda en el susto', () => {
  const r = rutaViva(true);
  r.vida.mover(0, 0);
  const quieta = r.parte('ala-anterior').getAttribute('transform');
  r.vida.reaccionar(ID, 0);
  assert.equal(r.parte('ala-anterior').getAttribute('transform'), transformaciones(ASUSTADA)['ala-anterior']!.transform);
  assert.notEqual(quieta, r.parte('ala-anterior').getAttribute('transform'));
  assert.equal(r.parte('parpado-1').getAttribute('transform'), transformaciones(ASUSTADA)['parpado-1']!.transform);
  r.vida.mover(0, 0);
  assert.equal(r.parte('ala-anterior').getAttribute('transform'), transformaciones(ASUSTADA)['ala-anterior']!.transform, 'la pose quieta se olvidó del susto');
  assert.ok(Math.abs(altoDe(r)) < 1e-9, 'despegó con la isla quieta');
});

test('la ficha la cuenta con su rótulo y su ficha, y dice qué es del dibujo', () => {
  const b = datos.bestias.find((x) => x.id === ID)!;
  assert.match(b.estampa, /del dibujo/);
  assert.ok(b.cuenta?.length, 'no cuenta nada');
  const fichas = readdirSync('Docs/INVESTIGACION').filter((n) => n.endsWith('.md')).map((n) => readFileSync(`Docs/INVESTIGACION/${n}`, 'utf-8')).join('\n');
  for (const c of b.cuenta!) {
    assert.ok(['hecho', 'testimonio', 'leyenda'].includes(c.rotulo));
    assert.ok(c.fuente && new RegExp(`^#+ ${c.fuente} `, 'm').test(fichas), `${c.fuente} no es una ficha de Docs/INVESTIGACION`);
    if (c.rotulo === 'testimonio') assert.ok(c.quien && c.fuente === 'RES-21', 'lo que contó el Indio va con su nombre y su ficha');
  }
});
