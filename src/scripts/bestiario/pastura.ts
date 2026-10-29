/**
 * El lobo y el cordero en la pastura (`D-73`): el lobo suelto acecha asomándose desde lo oscuro
 * detrás del claro, del lado del cordero, y el cordero atado pasta hasta que el lobo asoma cerca y
 * huye hasta donde le da la soga. El cordero se arrastra con el dedo, pero no más allá de la soga.
 *
 * Vive aparte de la isla del bestiario desde la séptima vuelta, porque el claro aparece en dos
 * lugares: en el recinto del monte y en el camino con cruces, corrido adentro del piso largo. En
 * los dos vale la geometría del recinto (`rig.ts`): `marco` es el elemento cuyas coordenadas son
 * las del recinto, sea el `<svg>` entero o el `<g>` corrido del camino.
 */

import { ACECHO, ACHATE, ESCALA_CORDERO, ESCALA_LOBO, PALO, SOGA, profundidad } from '../../lib/bestiario/rig.ts';
import { ARMADO } from '../../lib/bestiario/recortes.ts';
import { girar, hacia, parpado, partes, suave } from './articular.ts';
import { armarVaca } from './vaca.ts';
import { sacudir } from './sacudon.ts';

export interface Escenario {
  /** El elemento cuyas coordenadas son las del recinto. */
  marco: SVGGraphicsElement;
  /** El bicho tocado dice su verso: el punto va en coordenadas del recinto. */
  hablar(id: string, x: number, y: number): void;
  quieto(): boolean;
  reloj(): number;
}

export interface Pastura {
  mover(t: number, dt: number): void;
  /** Lo tocaron: si es el lobo o el cordero reacciona y devuelve `true`; si no, no es de acá. */
  reaccionar(id: string, t: number): boolean;
}

/** Del piso de la pastura (u, v) a las coordenadas del recinto. */
const enPantalla = (u: number, v: number): { x: number; y: number } => ({ x: PALO.x + u, y: PALO.y + v * ACHATE });

export function armarPastura(raiz: ParentNode, esc: Escenario): Pastura {
  const gLobo = raiz.querySelector<SVGGElement>('.titere--lobo')!;
  const gCordero = raiz.querySelector<SVGGElement>('.titere--cordero')!;
  const soga = raiz.querySelector<SVGPathElement>('#soga')!;
  const pl = partes(gLobo);
  const pc = partes(gCordero);
  const AL = ARMADO.lobo;
  const AC = ARMADO.cordero;

  /**
   * El lobo acecha: está hundido detrás del borde del piso, se corre sin que se vea, sube
   * despacio, mira al cordero un rato y se vuelve a hundir. `alzado` va de 0 (no se ve) a 1.
   */
  const lobo = { x: 300, alzado: 0, modo: 'hundido' as 'hundido' | 'sube' | 'mira' | 'baja', desde: 0, hasta: 1.5, parpadeo: 2 };
  const oveja = { u: 24, v: 18, mu: 24, mv: 18, mira: 1, paso: 0, patas: 0, cambio: 1, modo: 'pasta' as string, balaHasta: -1, parpadeo: 3.4, s: 1 };
  let arrastre: { id: number; x0: number; y0: number; movido: boolean } | null = null;

  const pantallaOveja = (): { x: number; y: number } => enPantalla(oveja.u, oveja.v);

  function aPiso(ev: PointerEvent): { u: number; v: number } {
    const p = new DOMPoint(ev.clientX, ev.clientY).matrixTransform(esc.marco.getScreenCTM()!.inverse());
    return { u: p.x - PALO.x, v: (p.y - PALO.y) / ACHATE };
  }

  function atar(u: number, v: number): { u: number; v: number; r: number } {
    const r = Math.hypot(u, v);
    const tope = SOGA - 4;
    return r > tope ? { u: (u / r) * tope, v: (v / r) * tope, r: tope } : { u, v, r };
  }

  gCordero.addEventListener('pointerdown', (ev) => {
    arrastre = { id: ev.pointerId, x0: ev.clientX, y0: ev.clientY, movido: false };
    gCordero.setPointerCapture(ev.pointerId);
  });
  gCordero.addEventListener('pointermove', (ev) => {
    if (!arrastre || arrastre.id !== ev.pointerId) return;
    if (!arrastre.movido && Math.hypot(ev.clientX - arrastre.x0, ev.clientY - arrastre.y0) < 6) return;
    arrastre.movido = true;
    const piso = aPiso(ev);
    const p = atar(piso.u, piso.v);
    if (Math.abs(p.u - oveja.u) > 0.3) oveja.mira = Math.sign(p.u - oveja.u);
    oveja.u = p.u;
    oveja.v = p.v;
    oveja.modo = 'arrastrado';
    if (esc.quieto()) pintar(esc.reloj());
    ev.preventDefault();
  });
  const soltar = (ev: PointerEvent): void => {
    if (!arrastre || arrastre.id !== ev.pointerId) return;
    const fueToque = !arrastre.movido;
    arrastre = null;
    oveja.modo = 'mira';
    oveja.cambio = esc.reloj() + 1.2;
    oveja.mu = oveja.u;
    oveja.mv = oveja.v;
    if (fueToque) tocar('el-cordero-atado');
  };
  gCordero.addEventListener('pointerup', soltar);
  gCordero.addEventListener('pointercancel', soltar);

  /** Dónde está la punta de arriba de cada títere, para el bocadillo. */
  function arribaDe(id: string): { x: number; y: number } {
    if (id === 'el-lobo-suelto') {
      return { x: lobo.x, y: ACECHO.piso + (1 - lobo.alzado) * ACECHO.hundido - (AL.piso[1] - 40) * ESCALA_LOBO };
    }
    const o = pantallaOveja();
    return { x: o.x, y: o.y - (AC.piso[1] + 40) * ESCALA_CORDERO * oveja.s };
  }

  function tocar(id: string): void {
    reaccionar(id, esc.reloj());
    const p = arribaDe(id);
    esc.hablar(id, p.x, p.y);
  }

  function reaccionar(id: string, t: number): boolean {
    if (id === 'el-lobo-suelto') {
      // Tocado, asoma ya, y se queda mirando más tiempo.
      if (lobo.modo !== 'mira') {
        lobo.modo = 'sube';
        lobo.desde = t - lobo.alzado * 1.4;
      }
      lobo.hasta = t + 7;
    } else if (id === 'el-cordero-atado') oveja.balaHasta = t + 1.2;
    else return false;
    if (esc.quieto()) pintar(t);
    return true;
  }

  function moverLobo(t: number): void {
    const objetivo = Math.min(ACECHO.hasta, Math.max(ACECHO.desde, pantallaOveja().x + (Math.random() - 0.5) * 220));
    switch (lobo.modo) {
      case 'hundido':
        lobo.alzado = 0;
        if (t > lobo.hasta) {
          lobo.x = objetivo;
          lobo.modo = 'sube';
          lobo.desde = t;
        }
        break;
      case 'sube':
        lobo.alzado = suave((t - lobo.desde) / 1.6);
        if (lobo.alzado >= 1) {
          lobo.modo = 'mira';
          lobo.hasta = Math.max(lobo.hasta, t + 4 + Math.random() * 3);
        }
        break;
      case 'mira':
        lobo.alzado = 1;
        if (t > lobo.hasta) {
          lobo.modo = 'baja';
          lobo.desde = t;
        }
        break;
      case 'baja':
        lobo.alzado = 1 - suave((t - lobo.desde) / 1.4);
        if (lobo.alzado <= 0) {
          lobo.modo = 'hundido';
          lobo.hasta = t + 1.5 + Math.random() * 2.5;
        }
        break;
    }
  }

  function moverOveja(t: number, dt: number): void {
    if (oveja.modo === 'arrastrado') {
      oveja.paso += dt * 9;
      oveja.patas = 1;
      return;
    }
    // Si el lobo asoma cerca, huye para adelante y al otro lado, hasta donde le dé la soga.
    const asoma = lobo.alzado > 0.6 && Math.abs(lobo.x - pantallaOveja().x) < 200;
    if (asoma && oveja.modo !== 'huye') {
      const lu = lobo.x - PALO.x;
      oveja.mu = -Math.sign(lu || 1) * (SOGA * 0.5);
      oveja.mv = SOGA + 30;
      oveja.modo = 'huye';
      oveja.cambio = t + 3;
    } else if (t > oveja.cambio && oveja.modo !== 'huye') {
      const a = Math.random() * Math.PI * 2;
      const d = Math.random() * (SOGA * 0.8);
      const quedarse = Math.random() < 0.45;
      oveja.mu = quedarse ? oveja.u : Math.cos(a) * d;
      oveja.mv = quedarse ? oveja.v : Math.sin(a) * d;
      oveja.modo = quedarse ? 'pasta' : 'camina';
      oveja.cambio = t + 3 + Math.random() * 3;
    }
    const velocidad = oveja.modo === 'huye' ? 44 : 16;
    const du = oveja.mu - oveja.u;
    const dv = oveja.mv - oveja.v;
    const falta = Math.hypot(du, dv);
    let anda = false;
    if (falta > 2) {
      const paso = Math.min(falta, velocidad * dt);
      const p = atar(oveja.u + (du / falta) * paso, oveja.v + (dv / falta) * paso);
      anda = Math.hypot(p.u - oveja.u, p.v - oveja.v) > 0.05;
      if (Math.abs(p.u - oveja.u) > 0.05) oveja.mira = Math.sign(p.u - oveja.u);
      oveja.u = p.u;
      oveja.v = p.v;
    } else if (oveja.modo === 'camina') oveja.modo = 'pasta';
    if (oveja.modo === 'huye' && !anda && t > oveja.cambio) oveja.modo = 'mira';
    if (anda) oveja.paso += dt * (oveja.modo === 'huye' ? 11 : 7);
    oveja.patas = hacia(oveja.patas, anda ? 1 : 0, dt * 5);
  }

  function pintar(t: number): void {
    // El lobo: el busto sube desde atrás del piso; la cabeza se ladea hacia el cordero.
    const o = pantallaOveja();
    const y = ACECHO.piso + (1 - lobo.alzado) * ACECHO.hundido;
    gLobo.setAttribute('transform', `translate(${lobo.x.toFixed(1)} ${y.toFixed(1)}) scale(${ESCALA_LOBO}) translate(${-AL.piso[0]} ${-AL.piso[1]})`);
    const respira = Math.sin(t * 1.7) * 0.012;
    pl.get('pecho')?.setAttribute('transform', `translate(${AL.piso[0]} ${AL.piso[1]}) scale(1 ${(1 + respira).toFixed(4)}) translate(${-AL.piso[0]} ${-AL.piso[1]})`);
    const ladeo = Math.max(-7, Math.min(7, (o.x - lobo.x) / 30)) + Math.sin(t * 0.7) * 1.2;
    girar(pl.get('cabeza'), ladeo, AL.cabeza, `translate(0 ${(-respira * 300).toFixed(2)}) `);
    if (t > lobo.parpadeo + 0.15) lobo.parpadeo = t + 2.5 + Math.random() * 4;
    const ciega = t > lobo.parpadeo && t < lobo.parpadeo + 0.15 ? 1 : 0;
    parpado(pl.get('parpado-1'), ciega);
    parpado(pl.get('parpado-2'), ciega);

    // El cordero: las dos patas de la tapa, que se turnan al andar.
    oveja.s = profundidad(o.y);
    const s = ESCALA_CORDERO * oveja.s;
    const bala = t < oveja.balaHasta;
    const salto = bala ? -Math.sin(((oveja.balaHasta - t) / 1.2) * Math.PI) * 12 : 0;
    const bote = -Math.abs(Math.sin(oveja.paso)) * 2.4 * oveja.patas;
    gCordero.setAttribute(
      'transform',
      `translate(${o.x.toFixed(1)} ${(o.y + salto + bote).toFixed(1)}) scale(${(oveja.mira * s).toFixed(4)} ${s.toFixed(4)}) translate(${-AC.piso[0]} ${-AC.piso[1]})`,
    );
    const b = Math.sin(oveja.paso) * 9 * oveja.patas;
    girar(pc.get('pata-tras'), b, AC['pata-tras']);
    girar(pc.get('pata-del'), -b, AC['pata-del']);
    const respiraC = Math.sin(t * 2.2) * 0.012;
    pc.get('cuerpo')?.setAttribute('transform', `translate(${AC.piso[0]} 700) scale(1 ${(1 + respiraC).toFixed(4)}) translate(${-AC.piso[0]} -700)`);
    const pasta = oveja.modo === 'pasta' && !bala;
    girar(pc.get('cabeza'), bala ? -8 : pasta ? 6 + Math.sin(t * 3) * 1.5 : Math.sin(t * 0.8) * 2.5, AC.cabeza);
    if (t > oveja.parpadeo + 0.17) oveja.parpadeo = t + 2 + Math.random() * 4;
    const cierra = t > oveja.parpadeo && t < oveja.parpadeo + 0.17 ? 1 : 0;
    parpado(pc.get('parpado-1'), cierra);
    parpado(pc.get('parpado-2'), cierra);

    // La soga: del palo al cogote. Tensa cuando el cordero está en la punta.
    const [nx0, ny0] = AC.nudo;
    const nx = o.x + (nx0 - AC.piso[0]) * oveja.mira * s;
    const ny = o.y + salto + bote + (ny0 - AC.piso[1]) * s;
    const ax = PALO.x;
    const ay = PALO.y - 46;
    const tension = Math.min(1, Math.hypot(oveja.u, oveja.v) / (SOGA - 4));
    const comba = (1 - tension) * 24 + 2;
    soga.setAttribute('d', `M${ax} ${ay} Q${((ax + nx) / 2).toFixed(1)} ${((ay + ny) / 2 + comba).toFixed(1)} ${nx.toFixed(1)} ${ny.toFixed(1)}`);
    soga.classList.toggle('soga--tensa', tension > 0.97);
  }

  gLobo.addEventListener('click', () => tocar('el-lobo-suelto'));
  for (const g of [gLobo, gCordero]) {
    g.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        tocar(g.dataset.id!);
      }
    });
  }

  // Con movimiento reducido el lobo queda asomado y quieto, y el cordero en su lugar.
  if (esc.quieto()) {
    lobo.alzado = 1;
    lobo.modo = 'mira';
    lobo.x = 560;
  }
  // La vaca cubana vive en la punta de la pastura: cuando le cae el pedazo al lado, el cordero
  // bala y el lobo se esconde.
  const vaca = armarVaca(raiz, esc, (t) => {
    // El pedazo de satélite pega en la pastura: en el camino, la cámara se sacude entera (`D-80`).
    sacudir(0.95);
    oveja.balaHasta = t + 1.2;
    if (lobo.alzado > 0.2 && lobo.modo !== 'baja') {
      lobo.modo = 'baja';
      lobo.desde = t - (1 - lobo.alzado) * 1.4;
    }
  });

  pintar(0);

  return {
    mover: (t, dt) => {
      vaca?.mover(t, dt);
      moverLobo(t);
      moverOveja(t, dt);
      pintar(t);
    },
    reaccionar: (id, t) => vaca?.reaccionar(id, t) || reaccionar(id, t),
  };
}
