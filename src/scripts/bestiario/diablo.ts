/**
 * El diablo que mea en todas partes (`D-73`, decimoquinta vuelta), contra la pared de fuego del salón.
 *
 * *"Sin ese diablo que mea en todas partes / Y en ningún lado hace espuma!"*, hecho conducta:
 *
 * - **Mea.** De espaldas, las piernas abiertas, la cola levantada de gusto. El chorro es un arco de
 *   brasa que va y viene por el damero, de cerca a lejos: marca en todas partes. Y en ningún lado hace
 *   espuma: donde cae queda un brillo que se seca enseguida, saltan dos chispas y sube un vapor. Mira
 *   para arriba del alivio, y para abajo a ver dónde cae.
 * - **Se sacude**, dos veces, y se queda un rato.
 * - **Se palpa la pelada**: sube la mano, se toca entre los cuernos y no está el gorro. Se da vuelta por
 *   encima del hombro y mira con desconfianza para el lado de Luzbelito y del diablo más veloz.
 * - **Se corre de costado** a otro pedazo de pared, y vuelve a empezar. Nunca en el mismo lugar dos
 *   veces seguidas.
 * - Si a Luzbelito se le aviva la vela, o alguien toca al diablo de muchos cuernos de la puerta, se da
 *   vuelta a mirar quién anda ahí.
 *
 * **Tocado, lo pescaste**: se da vuelta por encima del hombro con el ojo grande, lo achica, se lleva la
 * mano a la pelada (¿y el gorro? ¿lo tenés vos?) y dice su verso. Si estaba meando, sigue meando:
 * es el diablo. Después vuelve a lo suyo, o se va a otra pared.
 *
 * Con movimiento reducido no se mueve nada: tocarlo lo pasa de la pose quieta de espaldas a la de
 * mirarte por encima del hombro, y dice el verso. Se lleva números (`rig-diablo.ts`) y nada que dibuje.
 */

import {
  DIABLO, GESTOS, VERSO, brazoAlzado, chorro, manoALaVista, palpaEn, poseQuieta, transformes, vapor,
  type P, type Pose,
} from '../../lib/bestiario/rig-diablo.ts';
import { hacia, suave } from './articular.ts';
import type { Armar, Escenario, Vivo } from './vivos.ts';

const ID = 'el-diablo-que-mea-en-todas-partes';

export type Modo = 'mea' | 'sacude' | 'espera' | 'camina';
export type Gesto = 'ninguno' | 'gorro' | 'pescado' | 'mira';

/** Cuánto tardan las cosas, en segundos: lo que se repite varía entre el mínimo y el máximo. */
export const TIEMPOS = {
  /** La meada de la pose quieta, con la que arranca la isla, termina antes que las otras. */
  primera: [2.6, 4],
  mea: [4.6, 7.6],
  sacude: 0.9,
  espera: [2.2, 4.6],
  /** Lo que se queda después de llegar a otra pared, antes de mear. */
  llega: [0.7, 1.5],
  gorro: 3.9,
  pescado: 3.3,
  mira: 1.8,
  vapor: [0.26, 0.46],
  parpadeo: [2.6, 6],
} as const;

/** Lo que vive un vapor, y una chispa, en segundos. */
const VIDA_VAPOR = 1.5;
const VIDA_CHISPA = 0.55;

export interface Estado {
  modo: Modo;
  gesto: Gesto;
  x: number;
  fuerza: number;
}

/** Hasta dónde puede barrer el chorro estando en `x`, sin meterse en el busto de Luzbelito. */
export function barridoMaximo(x: number): number {
  const llega = (DIABLO.hastaX - x) / DIABLO.escala;
  // `chorro` cae en `27 + (46 + 70 b)`, en el títere, con toda la fuerza.
  return Math.max(0, Math.min(1, (llega - 27 - 46) / 70));
}

/**
 * Arma al diablo con un azar que se puede fijar (el test lo fija). La isla usa `armarDiablo`.
 */
export function armarDiabloCon(marcos: readonly SVGGElement[], esc: Escenario, azar: () => number = Math.random): Vivo & { estado(): Estado } {
  const titere = marcos.map((m) => m.querySelector<SVGGElement>('.titere--diablo')).find((x): x is SVGGElement => !!x);
  if (!titere) return { mover: () => {}, reaccionar: () => false, estado: () => ({ modo: 'espera', gesto: 'ninguno', x: DIABLO.x, fuerza: 0 }) };
  // Las partes de las dos capas: la figura (que se toca) y el piso de atrás (el chorro, el vapor).
  const partes = new Map<string, SVGGraphicsElement>();
  for (const m of marcos) for (const el of m.querySelectorAll<SVGGraphicsElement>('[data-parte]')) partes.set(el.dataset.parte!, el);
  const entre = ([a, b]: readonly [number, number]): number => a + (b - a) * azar();

  const e = {
    modo: 'mea' as Modo,
    desde: 0,
    dura: entre(TIEMPOS.primera),
    gesto: 'ninguno' as Gesto,
    gestoDesde: -10,
    x: DIABLO.x as number,
    destino: DIABLO.x as number,
    ultimo: DIABLO.x as number,
    fase: azar() * 6,
    fase2: azar() * 6,
    corre: 0,
    respiro: 0,
    proximoVapor: 0.1,
    parpadeo: entre(TIEMPOS.parpadeo),
    charco: 0.6,
    caeCharco: chorro(1, 0.45).cae as P,
    /** Cuándo se acuerda del gorro en esta espera (si se acuerda). */
    gorroEn: Number.POSITIVE_INFINITY,
    /** Para qué lado se da vuelta a mirar cuando pasa algo: a la vela (derecha) o a la puerta. */
    miraA: 'vela' as 'vela' | 'puerta',
    // Con movimiento reducido: si está mirándote por encima del hombro.
    pescadoQuieto: false,
  };
  const quieta = poseQuieta();
  // Lo que se suaviza de cuadro en cuadro: arranca en la pose quieta.
  const s = {
    piernas: [...quieta.piernas] as [number, number],
    /** El reposo del brazo derecho (meando o colgando), del que se alza para palparse. */
    reposo: { ...GESTOS.mea.brazo } as { arriba: number; abajo: number },
    ve: quieta.brazo.ve,
    izq: quieta.izq,
    cabeza: quieta.cabeza,
    vuelta: quieta.vuelta,
    mira: [...quieta.mira] as [number, number],
    parpado: quieta.parpado,
    cola: quieta.cola,
    punta: quieta.punta,
    fuerza: quieta.chorro.fuerza,
    barrido: quieta.chorro.barrido,
  };
  // Los vapores arrancan donde los deja la pose quieta: dos subiendo y uno que ya se fue.
  const vapores = [0.32, 0.7, 1].map((u, i) => ({ nace: -u * VIDA_VAPOR, de: [quieta.charco.x, quieta.charco.y] as P, deriva: [6, -4, 0][i]! }));
  const chispas = [0, 1, 2].map(() => ({ nace: -10, de: [0, 0] as P, v: [0, 0] as P }));
  let siguienteVapor = 0;

  function empezar(m: Modo, t: number, dura = 0): void {
    e.modo = m;
    e.desde = t;
    e.dura = dura;
  }

  function gesto(g: Gesto, t: number): void {
    e.gesto = g;
    e.gestoDesde = t;
  }

  /** A qué pared se va: a otra, nunca a la misma, y de a poco a todas. */
  function otraPared(): number {
    const otras = DIABLO.lugares.filter((x) => Math.abs(x - e.x) > 4 && x !== e.ultimo);
    const lista = otras.length ? otras : DIABLO.lugares.filter((x) => Math.abs(x - e.x) > 4);
    return lista[Math.floor(azar() * lista.length)] ?? DIABLO.x;
  }

  function decidir(t: number): void {
    const u = t - e.desde;
    switch (e.modo) {
      case 'mea':
        if (u > e.dura && e.gesto !== 'pescado') empezar('sacude', t, TIEMPOS.sacude);
        break;
      case 'sacude':
        if (u > e.dura) {
          empezar('espera', t, entre(TIEMPOS.espera));
          // Casi siempre, a la vuelta de sacudirse, se acuerda del gorro.
          e.gorroEn = azar() < 0.6 ? t + e.dura * (0.2 + azar() * 0.3) : Number.POSITIVE_INFINITY;
        }
        break;
      case 'espera':
        if (e.gesto !== 'ninguno') break;
        if (t > e.gorroEn) {
          e.gorroEn = Number.POSITIVE_INFINITY;
          gesto('gorro', t);
          e.dura = Math.max(e.dura, u + TIEMPOS.gorro + 0.6);
          break;
        }
        if (u > e.dura) {
          e.ultimo = e.x;
          e.destino = otraPared();
          empezar('camina', t);
        }
        break;
      case 'camina':
        if (Math.abs(e.destino - e.x) < 0.05) {
          e.x = e.destino;
          // Llega, se planta, y mea otra vez.
          empezar('mea', t + entre(TIEMPOS.llega), entre(TIEMPOS.mea));
        }
        break;
    }
    if (e.gesto !== 'ninguno') {
      const dura = e.gesto === 'gorro' ? TIEMPOS.gorro : e.gesto === 'pescado' ? TIEMPOS.pescado : TIEMPOS.mira;
      if (t - e.gestoDesde > dura) {
        // Pescado sin estar meando: se ofende y se va a otra pared.
        if (e.gesto === 'pescado' && e.modo === 'espera') e.dura = Math.min(e.dura, t - e.desde + 0.3);
        gesto('ninguno', t);
      }
    }
  }

  /** La fuerza del chorro en este cuadro: arranca, se sostiene con un temblor, y se acaba de a poco. */
  function fuerzaDelChorro(t: number): number {
    if (e.modo !== 'mea') return 0;
    const u = t - e.desde;
    if (u < 0) return 0;
    const sube = suave(u / 0.35);
    const baja = 1 - suave((u - (e.dura - 0.9)) / 0.9);
    const tiembla = 1 + 0.04 * Math.sin(t * 17) + 0.03 * Math.sin(t * 7.3);
    return Math.max(0, Math.min(1, sube * baja * tiembla));
  }

  function pintar(t: number, dt: number): void {
    if (esc.quieto() || dt === 0) {
      aplicar(poseQuieta(e.pescadoQuieto));
      return;
    }
    const paso = Math.min(dt, 0.1);
    decidir(t);
    const u = t - e.desde;
    const ug = t - e.gestoDesde;
    const G = GESTOS;

    // Dónde está parado: se corre de costado, a pasitos, y el cuerpo sube y baja con cada uno.
    let bob = 0;
    let piernas: [number, number] = e.modo === 'mea' || e.modo === 'sacude' ? [...G.mea.piernas] : [...G.espera.piernas];
    if (e.modo === 'camina' && e.gesto !== 'pescado') {
      const antes = e.x;
      e.x = hacia(e.x, e.destino, DIABLO.velocidad * paso);
      const lado = Math.sign(e.destino - antes) || 1;
      const fase = (Math.abs(e.x - DIABLO.lugares[0]!) / DIABLO.zancada) * Math.PI;
      const abre = Math.sin(fase);
      // La pierna del lado adonde va se abre primero, y la otra la sigue.
      piernas = lado > 0 ? [G.espera.piernas[0] + Math.max(0, -abre) * 5, G.espera.piernas[1] - Math.max(0, abre) * 6] : [G.espera.piernas[0] + Math.max(0, abre) * 6, G.espera.piernas[1] - Math.max(0, -abre) * 5];
      bob = -1.8 * Math.abs(abre);
    }
    if (e.modo === 'sacude') bob = -2.6 * Math.abs(Math.sin((u / TIEMPOS.sacude) * Math.PI * 2));

    // Los brazos: meando, las dos manos adelante; si no, colgando. El gesto alza el derecho desde ahí.
    const meando = e.modo === 'mea' && u > -0.2;
    const reposo = meando ? G.mea.brazo : { arriba: G.espera.brazo.arriba + Math.sin(t * 0.9) * 1.5, abajo: G.espera.brazo.abajo };
    let alza = 0;
    let palmea = 0;
    let izq = meando || e.modo === 'sacude' ? G.mea.izq : G.espera.izq + Math.sin(t * 0.8 + 1) * 1.2;
    let cabeza = meando ? (Math.sin(t * 0.7 + e.fase) > 0.2 ? -6 : 5) : Math.sin(t * 0.5 + e.fase2) * 3;
    let vuelta = 0;
    let mira: P = [0, 0];
    let parpado = 0.2;
    let cola = (meando ? G.mea.cola : G.espera.cola) + Math.sin(t * 1.3 + e.fase) * 5;
    let punta = (meando ? G.mea.punta : G.espera.punta) + Math.sin(t * 2.1 + e.fase2) * 9;

    if (e.gesto === 'gorro') {
      // Sube la mano a la pelada, se palpa dos veces, no está. Se da vuelta a mirar quién fue.
      alza = Math.min(1, ug / 0.6) * (1 - Math.max(0, Math.min(1, (ug - 3.1) / 0.7)));
      palmea = ug > 0.6 && ug < 1.4 ? 3 * Math.abs(Math.sin((ug - 0.6) * Math.PI * 2.5)) : 0;
      vuelta = suave((ug - 1.4) / 0.22) * (1 - suave((ug - 2.7) / 0.22));
      mira = ug < 2.1 ? [1, -0.4] : [0.8, 0.4];
      parpado = 0.55;
      cabeza = palmea ? 4 : cabeza;
      punta += Math.sin(t * 9) * 6 * alza;
    }
    if (e.gesto === 'pescado') {
      // Lo pescaste: se da vuelta de golpe con el ojo grande, lo achica, se lleva la mano a la pelada.
      vuelta = suave(ug / 0.2) * (1 - suave((ug - 2.8) / 0.25));
      alza =Math.min(1, Math.max(0, (ug - 0.15) / 0.6)) * (1 - Math.max(0, Math.min(1, (ug - 2.6) / 0.6)));
      palmea = ug > 1.1 && ug < 1.5 ? 2.6 * Math.abs(Math.sin((ug - 1.1) * Math.PI * 2.5)) : 0;
      mira = [-0.55, 0.15];
      parpado = ug < 0.8 ? 0 : 0.45;
      // La cola se pone tiesa, y la punta da un chicotazo.
      cola = 4;
      punta = 18 + (ug < 0.6 ? Math.sin(ug * 30) * 14 : 0);
      bob = ug < 0.12 ? -1.6 : bob;
    }
    if (e.gesto === 'mira') {
      // Alguien anda por ahí: se da vuelta a mirar, por si fue ese el del gorro. A la vela, por encima
      // del hombro; a la puerta, que le queda del otro lado, nada más gira la nuca.
      const k = suave(ug / 0.22) * (1 - suave((ug - (TIEMPOS.mira - 0.3)) / 0.25));
      if (e.miraA === 'vela') {
        vuelta = k;
        mira = [0.9, -0.3];
        parpado = 0.5;
      } else cabeza = -11 * k;
    }

    // Lo que se suaviza: nada salta, todo pesa.
    const v = paso * 6;
    s.piernas = [hacia(s.piernas[0], piernas[0], paso * 30), hacia(s.piernas[1], piernas[1], paso * 30)];
    s.reposo = { arriba: hacia(s.reposo.arriba, reposo.arriba, paso * 60), abajo: hacia(s.reposo.abajo, reposo.abajo, paso * 90) };
    const brazo = brazoAlzado(s.reposo, palpaEn(vuelta, palmea), alza);
    // Meando, la mano está adelante y no se ve; subiendo, pasa por delante del pecho, y asoma por
    // encima del hombro.
    const ve = alza > 0 ? (manoALaVista(brazo.arriba, brazo.abajo) ? 1 : 0) : meando ? 0 : 1;
    s.ve = hacia(s.ve, ve, paso * 7);
    s.izq = hacia(s.izq, izq, paso * 40);
    s.cabeza = hacia(s.cabeza, cabeza, paso * 18);
    s.vuelta = vuelta;
    s.mira = [hacia(s.mira[0], mira[0], v), hacia(s.mira[1], mira[1], v)];
    if (t > e.parpadeo + 0.14) e.parpadeo = t + entre(TIEMPOS.parpadeo);
    const ciego = t > e.parpadeo && t < e.parpadeo + 0.14;
    s.parpado = hacia(s.parpado, parpado, paso * 4);
    s.cola = hacia(s.cola, cola, paso * 60);
    s.punta = hacia(s.punta, punta, paso * 110);

    // El chorro: la fuerza, el barrido que lo pasea por el damero, y las gotas que corren.
    const fuerza = fuerzaDelChorro(t);
    s.fuerza = hacia(s.fuerza, fuerza, paso * 5);
    const tope = barridoMaximo(e.x);
    const barrido = Math.min(tope, Math.max(0, 0.5 + 0.32 * Math.sin(t * 1.1 + e.fase) + 0.18 * Math.sin(t * 2.7 + e.fase2)));
    s.barrido = hacia(s.barrido, barrido, paso * 1.5);
    e.corre += paso * 70 * s.fuerza;
    const { cae } = chorro(s.fuerza, s.barrido);

    // Donde cae: un brillo que se seca enseguida (ni charco que dure), vapor y chispas.
    if (s.fuerza > 0.3) {
      e.charco = Math.min(0.65, e.charco + paso * 3);
      e.caeCharco = cae;
      if (t > siguienteVapor) {
        const libre = vapores.reduce((a, b) => (a.nace < b.nace ? a : b));
        libre.nace = t;
        libre.de = cae;
        libre.deriva = -6 + azar() * 16;
        if (azar() < 0.7) {
          const c = chispas.reduce((a, b) => (a.nace < b.nace ? a : b));
          c.nace = t;
          c.de = cae;
          c.v = [-30 + azar() * 60, -80 + azar() * 34];
        }
        siguienteVapor = t + entre(TIEMPOS.vapor);
      }
    } else e.charco = Math.max(0, e.charco - paso * 1.6);

    e.respiro += paso * (e.modo === 'camina' ? 2.6 : 1.7);
    aplicar({
      x: e.x,
      bob,
      inclina: meando ? -1.2 + Math.sin(t * 0.6) * 0.6 : 0,
      respira: Math.sin(e.respiro),
      piernas: s.piernas,
      brazo: { ...brazo, ve: s.ve },
      izq: s.izq,
      cabeza: s.cabeza,
      vuelta: s.vuelta,
      mira: s.mira,
      parpado: ciego && s.vuelta > 0.5 ? 1 : s.parpado,
      cola: s.cola,
      punta: s.punta,
      chorro: { fuerza: s.fuerza, barrido: s.barrido, corre: e.corre },
      charco: { x: e.caeCharco[0], y: e.caeCharco[1], s: 0.4 + e.charco, o: e.charco },
      vapores: vapores.map((p) => vapor(p.de, (t - p.nace) / VIDA_VAPOR, p.deriva)),
      chispas: chispas.map((c) => {
        const k = (t - c.nace) / VIDA_CHISPA;
        if (k < 0 || k >= 1) return { x: c.de[0], y: c.de[1], o: 0 };
        const tt = t - c.nace;
        return { x: c.de[0] + c.v[0] * tt, y: c.de[1] + c.v[1] * tt + 110 * tt * tt, o: 1 - k };
      }),
    });
  }

  function aplicar(p: Pose): void {
    for (const [nombre, atributos] of Object.entries(transformes(p))) {
      const el = partes.get(nombre);
      if (!el) continue;
      for (const [k, v] of Object.entries(atributos)) el.setAttribute(k, v);
    }
  }

  function pescar(t: number): void {
    if (esc.quieto()) {
      e.pescadoQuieto = !e.pescadoQuieto;
      pintar(t, 0);
      return;
    }
    gesto('pescado', t);
    // Si estaba meando, sigue meando: que termine después de mirarte.
    if (e.modo === 'mea') e.dura = Math.max(e.dura, t - e.desde + TIEMPOS.pescado + 0.6);
    // Si estaba caminando, se planta donde está.
    if (e.modo === 'camina') {
      e.destino = e.x;
      empezar('espera', t, TIEMPOS.pescado + 0.4);
    }
  }

  const tocar = (): void => {
    const t = esc.reloj();
    pescar(t);
    const [vx, vy] = VERSO(e.x);
    esc.hablar(ID, vx, vy);
  };
  titere.addEventListener('click', tocar);
  titere.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      tocar();
    }
  });

  // Si a Luzbelito se le aviva la vela, se da vuelta a ver qué pasa.
  const escena = (titere as SVGGElement & { ownerSVGElement?: SVGSVGElement | null }).ownerSVGElement ?? null;
  escena?.querySelector('.titere--luzbelito')?.addEventListener('click', () => {
    if (esc.quieto() || e.gesto !== 'ninguno') return;
    e.miraA = 'vela';
    gesto('mira', esc.reloj());
  });

  pintar(0, 0);
  return {
    mover: pintar,
    reaccionar: (id, t) => {
      if (id === ID) {
        pescar(t);
        return true;
      }
      // El de muchos cuernos, en la puerta: no es suyo, pero lo mira.
      if (id === 'el-diablo-de-muchos-cuernos' && !esc.quieto() && e.gesto === 'ninguno') {
        e.miraA = 'puerta';
        gesto('mira', t);
      }
      return false;
    },
    estado: () => ({ modo: e.modo, gesto: e.gesto, x: e.x, fuerza: s.fuerza }),
  };
}

export const armarDiablo: Armar = (marcos, esc) => armarDiabloCon(marcos, esc);
