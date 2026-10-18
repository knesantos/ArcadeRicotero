/**
 * La vaca cubana en la punta de la pastura (`D-73`): rumia, mira el cielo, y le cae un pedazo de
 * satélite al lado.
 *
 * - **Rumia de verdad**: cada tanto le sube el bolo por el pescuezo, traga, y mastica de costado.
 *   Cuando no pasa nada por arriba baja la cabeza y pasta.
 * - **Mira el cielo**: por arriba cruza la tele de la tapa de *Un baión* hecha satélite. La vaca la
 *   sigue con la cabeza hasta donde le da el cogote, y después con el ojo.
 * - **Tocada**, mira para arriba justo a tiempo: al satélite se le suelta un pedazo prendido fuego
 *   (la llama de la contratapa), que silba al bajar y cae en la pastura, al lado. La vaca se
 *   sobresalta, mira el pozo, y vuelve a rumiar mirando el cielo. El cordero bala y el lobo se
 *   esconde (`alGolpe`, que lo hace la pastura).
 *
 * Como la pastura, vive en el recinto del monte y en el camino con cruces: todo va en coordenadas
 * del recinto (`rig.ts`), y lo arma `pastura.ts`. Con movimiento reducido queda quieta mirando el
 * satélite, y tocarla solo le hace decir su verso.
 */

import { CIELO_VACA as C, VACA, VACA_ARMADO as A } from '../../lib/bestiario/rig.ts';
import { girar, hacia, parpado, partes, suave } from './articular.ts';
import type { Escenario } from './pastura.ts';

const ID = 'aquella-solitaria-vaca-cubana';
type Punto = { x: number; y: number };

export interface Vaca {
  mover(t: number, dt: number): void;
  /** Lo tocaron: si es la vaca, reacciona y devuelve `true`. */
  reaccionar(id: string, t: number): boolean;
}

/** El cogote, en el recinto: de ahí sale todo lo que la vaca mira. */
const COGOTE: Punto = { x: VACA.x + A.cuello[0] * VACA.escala, y: VACA.y + A.cuello[1] * VACA.escala };

/** Cuánto puede girar la cabeza: para arriba hasta mirar el cielo de frente, para abajo hasta el pasto. */
const TOPE = { arriba: 64, abajo: A.pasta } as const;

/** Una cúbica de cuatro puntos, en `s` de 0 a 1, con su dirección. */
function enCubica(pts: ReadonlyArray<readonly [number, number]>, s: number): { x: number; y: number; ang: number } {
  const [a, b, c, d] = pts as [readonly [number, number], readonly [number, number], readonly [number, number], readonly [number, number]];
  const m = 1 - s;
  const x = m * m * m * a[0] + 3 * m * m * s * b[0] + 3 * m * s * s * c[0] + s * s * s * d[0];
  const y = m * m * m * a[1] + 3 * m * m * s * b[1] + 3 * m * s * s * c[1] + s * s * s * d[1];
  const dx = 3 * m * m * (b[0] - a[0]) + 6 * m * s * (c[0] - b[0]) + 3 * s * s * (d[0] - c[0]);
  const dy = 3 * m * m * (b[1] - a[1]) + 6 * m * s * (c[1] - b[1]) + 3 * s * s * (d[1] - c[1]);
  return { x, y, ang: (Math.atan2(dy, dx) * 180) / Math.PI };
}

export function armarVaca(raiz: ParentNode, esc: Escenario, alGolpe: (t: number) => void): Vaca | null {
  const g = raiz.querySelector<SVGGElement>('.titere--vaca') as SVGGElement | null;
  if (!g) return null;
  const vacaG: SVGGElement = g;
  const p = partes(g);
  const satelite = raiz.querySelector<SVGGElement>('.vaca-satelite')!;
  const pantalla = raiz.querySelector<SVGPathElement>('.vaca-pantalla')!;
  const pozo = raiz.querySelector<SVGGElement>('.vaca-pozo')!;
  const humo = raiz.querySelector<SVGGElement>('.vaca-humo')!;
  const estela = raiz.querySelector<SVGPathElement>('.vaca-estela')!;
  const pedazo = raiz.querySelector<SVGGElement>('.vaca-pedazo')!;
  const estallido = raiz.querySelector<SVGGElement>('.vaca-estallido')!;

  const S = C.satelite;
  const ciclo = S.dura + S.pausa;
  /** El satélite arranca entrando, así el que llega lo ve pasar enseguida. */
  const desfase = S.dura * 0.18;

  function satEn(t: number): Punto & { visible: boolean } {
    const u = ((t + desfase) % ciclo) / S.dura;
    if (u > 1) return { x: S.hasta[0], y: S.hasta[1], visible: false };
    return {
      x: S.desde[0] + (S.hasta[0] - S.desde[0]) * u,
      y: S.desde[1] + (S.hasta[1] - S.desde[1]) * u - Math.sin(Math.PI * u) * 22,
      visible: u > 0.02 && u < 0.98,
    };
  }

  const estado = {
    cabeza: A.mira as number,
    /** Rumia, pasta, o la caída y lo que sigue. */
    modo: 'rumia' as 'rumia' | 'pasta',
    hastaModo: 9,
    masca: 0,
    /** El bolo: cuándo empezó a subir, y cuándo sube el próximo. */
    bolo: -10,
    proximoBolo: 6,
    parpadeo: 2.6,
    oreja: -10,
    proximaOreja: 3.5,
    coletazo: -10,
    proximoColetazo: 5,
    /** La caída: de dónde sale, por dónde pasa y cuándo; y cuándo pegó. */
    caida: null as null | { desde: number; s: Punto; c: Punto },
    golpe: -100,
    rastro: [] as Punto[],
    ultimoToque: -100,
  };
  const [ix, iy] = C.impacto;

  /** Dónde está el pedazo en `u` de 0 a 1: una parábola que arranca de costado y cae a pique. */
  function pedazoEn(u: number): Punto {
    const k = Math.pow(u, 1.25);
    const { s, c } = estado.caida!;
    const m = 1 - k;
    return { x: m * m * s.x + 2 * m * k * c.x + k * k * ix, y: m * m * s.y + 2 * m * k * c.y + k * k * iy };
  }

  /** El ángulo de cabeza para mirar un punto del recinto, dentro de lo que da el cogote. */
  const apuntar = ({ x, y }: Punto): number =>
    Math.max(TOPE.abajo, Math.min(TOPE.arriba, (Math.atan2(-(y - COGOTE.y), -(x - COGOTE.x)) * 180) / Math.PI));

  function soltarPedazo(t: number): void {
    const sat = satEn(t);
    const s: Punto = sat.visible ? { x: sat.x, y: sat.y } : { x: C.arriba[0], y: C.arriba[1] };
    estado.caida = { desde: t, s, c: { x: s.x + (ix - s.x) * 0.55, y: s.y + (iy - s.y) * 0.08 } };
    estado.rastro = [];
  }

  function tocar(): void {
    const t = esc.reloj();
    reaccionar(ID, t);
    esc.hablar(ID, COGOTE.x - 30, COGOTE.y - 56);
  }

  function reaccionar(id: string, t: number): boolean {
    if (id !== ID) return false;
    estado.ultimoToque = t;
    // Si ya viene cayendo uno, o el pozo todavía humea, no se cae otro: mira y listo.
    if (!esc.quieto() && !estado.caida && t - estado.golpe > 3) soltarPedazo(t);
    if (esc.quieto()) pintar(t, 0);
    return true;
  }

  function pintar(t: number, dt: number): void {
    const quieto = esc.quieto();
    const sat = quieto ? { x: 600, y: 92, visible: true } : satEn(t);

    // El satélite: cruza meciéndose, con la pantalla que titila. Si le acaban de arrancar el
    // pedazo, la pantalla se prende entera un momento.
    if (!quieto) {
      const mece = Math.sin(t * 0.9) * 4;
      satelite.setAttribute('transform', `translate(${sat.x.toFixed(1)} ${sat.y.toFixed(1)}) rotate(${mece.toFixed(2)}) scale(${S.escala})`);
      const recien = estado.caida && t - estado.caida.desde < 0.5 ? 0.9 : 0;
      const titila = 0.5 + 0.5 * Math.sin(t * 13) * Math.sin(t * 3.1);
      pantalla.setAttribute('opacity', Math.max(recien, titila * 0.4).toFixed(2));
    }

    // Qué mira: el pedazo que cae, el pozo después del golpe, el satélite si pasa, o el pasto.
    let meta: number;
    let mirada: Punto | null = null;
    const desdeGolpe = t - estado.golpe;
    if (estado.caida) {
      const u = Math.min(1, (t - estado.caida.desde) / C.cae);
      mirada = pedazoEn(Math.min(1, u + 0.12));
      meta = apuntar(mirada);
    } else if (desdeGolpe < 2.6) {
      mirada = { x: ix, y: iy };
      meta = desdeGolpe < 0.5 ? estado.cabeza : apuntar(mirada);
    } else if (sat.visible) {
      mirada = sat;
      meta = apuntar(sat);
    } else {
      if (t > estado.hastaModo) {
        estado.modo = estado.modo === 'pasta' ? 'rumia' : 'pasta';
        estado.hastaModo = t + (estado.modo === 'pasta' ? 5 + Math.random() * 4 : 6 + Math.random() * 5);
      }
      meta = estado.modo === 'pasta' ? A.pasta + Math.sin(t * 2.6) * 3 : 8 + Math.sin(t * 0.5) * 3;
    }
    if (quieto) meta = apuntar(sat);
    estado.cabeza = quieto ? meta : hacia(estado.cabeza, meta, dt * (estado.caida ? 120 : 34));

    // El susto: al golpe, un respingo, las orejas para atrás y la cola para arriba.
    const susto = desdeGolpe >= 0 && desdeGolpe < 1.2 ? 1 - suave(desdeGolpe / 1.2) : 0;
    const respingo = desdeGolpe >= 0 && desdeGolpe < 0.45 ? -Math.sin((desdeGolpe / 0.45) * Math.PI) * 14 : 0;

    // Respira, desde las patas.
    const respira = Math.sin(t * 1.4) * 0.008;
    g.setAttribute('transform', `translate(${VACA.x} ${(VACA.y + respingo * VACA.escala).toFixed(1)}) scale(${VACA.escala})`);
    p.get('cuerpo')?.setAttribute('transform', `translate(0 -150) scale(1 ${(1 + respira).toFixed(4)}) translate(0 150)`);
    girar(p.get('cabeza'), estado.cabeza + susto * -8, A.cuello, `translate(0 ${(-respira * 150).toFixed(2)}) `);

    // La mandíbula: rumia de costado; pastando arranca de abajo, más lento. Para un rato al tragar.
    const sube = t - estado.bolo;
    const traga = sube >= 0 && sube < 1.4;
    const pastando = !mirada && estado.modo === 'pasta';
    if (!quieto && !traga && desdeGolpe > 1) estado.masca += dt * (pastando ? 6 : 8.4);
    const fase = estado.masca;
    const abre = traga || quieto ? 0 : (0.5 + 0.5 * Math.sin(fase)) * (pastando ? 5 : 3.4);
    const corre = traga || quieto ? 0 : Math.sin(fase + Math.PI / 2) * (pastando ? 1.2 : 2.6);
    const [bx, by] = A.bisagra;
    p.get('mandibula')?.setAttribute('transform', `translate(${corre.toFixed(2)} 0) rotate(${(-abre).toFixed(2)} ${bx} ${by})`);

    // El bolo: sube por abajo del pescuezo, de la panza al cogote, y después mastica.
    const bolo = p.get('bolo');
    if (bolo) {
      if (!quieto && !mirada && estado.modo === 'rumia' && t > estado.proximoBolo) {
        estado.bolo = t;
        estado.proximoBolo = t + 11 + Math.random() * 8;
      }
      const s = sube / 0.9;
      if (s >= 0 && s <= 1) {
        const q = enCubica(A.bolo, suave(s));
        bolo.setAttribute('opacity', (Math.min(1, s * 6, (1 - s) * 6)).toFixed(2));
        bolo.setAttribute('transform', `translate(${q.x.toFixed(1)} ${q.y.toFixed(1)}) rotate(${(q.ang + 180).toFixed(1)})`);
      } else bolo.setAttribute('opacity', '0');
    }

    // El ojo: la pupila va hacia lo que mira; si la cabeza no llega, llega el ojo.
    const pupila = p.get('pupila');
    if (pupila) {
      const objetivo = mirada ?? { x: COGOTE.x - 200, y: COGOTE.y + (pastando ? 160 : -20) };
      const angMundo = Math.atan2(objetivo.y - COGOTE.y, objetivo.x - COGOTE.x);
      const angOjo = angMundo - ((estado.cabeza + A.ojo.giro) * Math.PI) / 180;
      pupila.setAttribute('transform', `translate(${(Math.cos(angOjo) * A.pupila).toFixed(2)} ${(Math.sin(angOjo) * A.pupila * 0.6).toFixed(2)})`);
    }
    if (t > estado.parpadeo + 0.18) estado.parpadeo = t + 2.8 + Math.random() * 3.6;
    const cierra = quieto ? 0 : t > estado.parpadeo && t < estado.parpadeo + 0.18 ? 1 : susto > 0.7 ? 1 : 0;
    parpado(p.get('parpado'), cierra);

    // La oreja: se sacude cada tanto, y con el susto se va para atrás.
    if (!quieto && t > estado.proximaOreja) {
      estado.oreja = t;
      estado.proximaOreja = t + 3.5 + Math.random() * 5;
    }
    const sacude = t - estado.oreja < 0.36 ? Math.sin(((t - estado.oreja) / 0.36) * Math.PI * 2) * -16 : 0;
    girar(p.get('oreja'), sacude + susto * 22, A.oreja);

    // La cola: se mece, de a ratos espanta una mosca, y con el susto se levanta.
    if (!quieto && t > estado.proximoColetazo) {
      estado.coletazo = t;
      estado.proximoColetazo = t + 6 + Math.random() * 7;
    }
    const c = t - estado.coletazo;
    const coletazo = c < 0.9 ? Math.sin((c / 0.9) * Math.PI * 2) * 16 * (1 - c / 0.9) : 0;
    const cola = quieto ? 0 : Math.sin(t * 1.1) * 3 + coletazo - susto * 34;
    girar(p.get('cola'), cola, A.cola);
    girar(p.get('borla'), quieto ? 0 : Math.sin(t * 1.1 - 0.7) * 7 + coletazo * 0.6, A.borla);

    pintarCielo(t);
  }

  /** El pedazo que cae, la estela que deja, el golpe y el pozo que humea. */
  function pintarCielo(t: number): void {
    const caida = estado.caida;
    if (caida) {
      const u = (t - caida.desde) / C.cae;
      if (u >= 1) {
        estado.caida = null;
        estado.golpe = t;
        alGolpe(t);
      } else {
        const q = pedazoEn(u);
        const antes = pedazoEn(Math.max(0, u - 0.02));
        // La llama queda del lado de donde viene: el pedazo se gira contra su marcha.
        const ang = (Math.atan2(antes.y - q.y, antes.x - q.x) * 180) / Math.PI;
        const crece = C.pedazo * (0.75 + u * 0.4);
        pedazo.setAttribute('opacity', '1');
        pedazo.setAttribute('transform', `translate(${q.x.toFixed(1)} ${q.y.toFixed(1)}) rotate(${ang.toFixed(1)}) scale(${crece.toFixed(3)})`);
        estado.rastro.unshift(q);
        if (estado.rastro.length > 26) estado.rastro.pop();
        // Al soltarse, un chispazo chico en el satélite.
        const chispa = t - caida.desde;
        if (chispa < 0.3) {
          estallido.setAttribute('opacity', (1 - chispa / 0.3).toFixed(2));
          estallido.setAttribute('transform', `translate(${caida.s.x.toFixed(1)} ${caida.s.y.toFixed(1)}) scale(${(0.15 + chispa).toFixed(2)})`);
        } else estallido.setAttribute('opacity', '0');
      }
    }
    // La estela: un garabato que sigue al pedazo y se abre para atrás, como la luz de la tele.
    if (estado.rastro.length > 1) {
      const desdeGolpe = t - estado.golpe;
      const apaga = estado.caida ? 1 : Math.max(0, 1 - desdeGolpe / 0.7);
      if (apaga <= 0) {
        estado.rastro = [];
        estela.setAttribute('opacity', '0');
      } else {
        let d = '';
        estado.rastro.forEach((q, k) => {
          const sig = estado.rastro[Math.min(estado.rastro.length - 1, k + 1)]!;
          const dx = q.x - sig.x;
          const dy = q.y - sig.y;
          const m = Math.hypot(dx, dy) || 1;
          const abre = (k % 2 ? 1 : -1) * (1 + k * 0.6);
          d += `${k ? 'L' : 'M'}${(q.x - (dy / m) * abre).toFixed(1)} ${(q.y + (dx / m) * abre).toFixed(1)}`;
        });
        estela.setAttribute('d', d);
        estela.setAttribute('opacity', (0.85 * apaga).toFixed(2));
      }
    }
    if (!estado.caida) pedazo.setAttribute('opacity', '0');

    // El golpe: la luz de la tele que se abre en el pasto, y se apaga.
    const desdeGolpe = t - estado.golpe;
    if (desdeGolpe >= 0 && desdeGolpe < 0.6) {
      const k = desdeGolpe / 0.6;
      estallido.setAttribute('opacity', (1 - k * k).toFixed(2));
      estallido.setAttribute('transform', `translate(${ix} ${iy - 12}) scale(${(0.35 + k * 0.85).toFixed(3)})`);
    } else if (!estado.caida) estallido.setAttribute('opacity', '0');

    // El pozo queda humeando, y se borra de a poco.
    if (desdeGolpe >= 0 && desdeGolpe < C.humea) {
      const queda = desdeGolpe < C.humea - 2 ? 1 : (C.humea - desdeGolpe) / 2;
      pozo.setAttribute('opacity', queda.toFixed(2));
      const h = (desdeGolpe * 0.9) % 1;
      humo.setAttribute('transform', `translate(${(Math.sin(desdeGolpe * 1.3) * 4).toFixed(1)} ${(-h * 26).toFixed(1)})`);
      humo.setAttribute('opacity', (Math.min(1, desdeGolpe * 3) * (1 - h) * queda).toFixed(2));
    } else pozo.setAttribute('opacity', '0');
  }

  g.addEventListener('click', tocar);
  g.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      tocar();
    }
  });

  pintar(0, 0);
  return { mover: (t, dt) => pintar(t, dt), reaccionar };
}
