/**
 * El negro Atila en la medianera del baldío (`D-73`, undécima vuelta).
 *
 * *"Quiero verte huir como un ladrón / al que nunca pueden atrapar"*: camina por el canto del muro
 * hundido en el gabán, mascando el frío —le sale vaho—, mira de reojo y olfatea; del gato matón no
 * pasa, lo huele antes. Cada tanto pasa la sirena de la cana barriendo los techos —una luz de
 * ocasión, que falla— y él se tira del otro lado del muro. No lo agarran nunca, pero el vaho sube
 * igual desde atrás de la pared. Cuando la luz pasó, asoma el funyi y los ojos, mira para los dos
 * lados y vuelve a subir.
 *
 * Tocado, abre el gabán como un vendedor de vereda: el forro con todo lo que se fue llevando, la
 * sirena vieja que se prende, y un guiño. Después lo cierra y sigue como si nada.
 *
 * Vive aparte de la isla, como la pastura: se lleva números (`rig.ts`) y nada que dibuje.
 */

import { ATILA, ATILA_ARMADO } from '../../lib/bestiario/rig.ts';
import { girar, hacia, parpado, partes, suave } from './articular.ts';

export interface EscenarioAtila {
  /** El bicho tocado dice su verso: el punto va en coordenadas del recinto. */
  hablar(id: string, x: number, y: number): void;
  quieto(): boolean;
  reloj(): number;
}

export interface Atila {
  mover(t: number, dt: number): void;
  /** Lo tocaron: si es el Atila reacciona y devuelve `true`; si no, no es de acá. */
  reaccionar(id: string, t: number): boolean;
}

const ID = 'el-negro-atila';

/** Cuánto está abierto el gabán: se abre rápido, se sostiene para que se vea todo, y se cierra. */
const ABRE = 0.4;
const SOSTIENE = 2.6;
const CIERRA = 0.45;
/** Lo que tarda la luz de la sirena en cruzar la escena. */
const CRUZA = 4.4;

export function armarAtila(raiz: ParentNode, esc: EscenarioAtila): Atila {
  const g = raiz.querySelector<SVGGElement>('.titere--atila')!;
  const entero = raiz.querySelector<SVGGElement>('#atila-entero')!;
  const luz = raiz.querySelector<SVGGElement>('.atila-sirena');
  const vahos = [...raiz.querySelectorAll<SVGGElement>('[data-vaho]')].map((el) => ({ el, desde: -10, x: 0, y: 0 }));
  const p = partes(g);
  const A = ATILA_ARMADO;
  const { piso, escala, desde: izquierda, hasta: derecha } = ATILA;

  type Modo = 'para' | 'camina' | 'huele' | 'baja' | 'escondido' | 'asoma' | 'sube' | 'abre';
  let modo: Modo = 'para';
  let x: number = ATILA.x;
  let meta = x;
  let hasta = 2.5;
  let desdeModo = 0;
  let fase = 0;
  let hundido = 0;
  let abreDesde = -10;
  let parpadeo = 1.8;
  let mira: [number, number] = [0, 0];
  let miraMeta: [number, number] = [0, 0];
  let proximaMirada = 1;
  let proximoVaho = 0.6;
  let vahoN = 0;
  let sirenaDesde = -100;
  let proximaSirena = 9;
  // Cuánto mete la cabeza en el cuello del gabán: de 0 (afuera) a 1 (hasta los ojos).
  let hundidoCabeza = 0.3;

  const empezar = (m: Modo, t: number): void => {
    modo = m;
    desdeModo = t;
  };

  function abierta(t: number): number {
    const u = t - abreDesde;
    if (u < 0 || u > ABRE + SOSTIENE + CIERRA) return 0;
    if (u < ABRE) return suave(u / ABRE);
    if (u < ABRE + SOSTIENE) return 1;
    return 1 - suave((u - ABRE - SOSTIENE) / CIERRA);
  }

  /** Una hoja del gabán: se da vuelta contra la costura y del otro lado se despliega el forro. */
  function hoja(n: 1 | 2, k: number): void {
    const [hx, hy] = A.bisagras[n - 1];
    const c = Math.cos(k * Math.PI * 0.94);
    const tela = p.get(`hoja-${n}`);
    const forro = p.get(`forro-${n}`);
    if (c > 0) {
      tela?.setAttribute('transform', `translate(${hx} 0) scale(${c.toFixed(3)} 1) translate(${-hx} 0)`);
      forro?.setAttribute('transform', `translate(${hx} 0) scale(0.001 1) translate(${-hx} 0)`);
    } else {
      tela?.setAttribute('transform', `translate(${hx} 0) scale(0.001 1) translate(${-hx} 0)`);
      // Abierto, el forro se sacude apenas con lo que lleva colgado.
      const sacude = Math.sin((k + n) * 9) * 1.2 * k;
      forro?.setAttribute('transform', `translate(${hx} ${hy}) rotate(${sacude.toFixed(2)}) scale(${(-c).toFixed(3)} 1) translate(${-hx} ${-hy})`);
    }
  }

  /** La luz de la sirena: cruza de afuera a afuera, gira (late) y, como es de ocasión, se corta. */
  function pintarSirena(t: number): void {
    if (!luz) return;
    const u = (t - sirenaDesde) / CRUZA;
    if (u < 0 || u > 1) {
      luz.setAttribute('opacity', '0');
      return;
    }
    const sx = -320 + u * 1540;
    const gira = 0.5 + 0.5 * Math.sin(t * Math.PI * 2 * 1.8);
    const falla = Math.sin(t * 13.7) + Math.sin(t * 7.3 + 1) > 1.45 ? 0.15 : 1;
    const entra = Math.min(1, u / 0.08, (1 - u) / 0.08);
    luz.setAttribute('opacity', (0.85 * (0.35 + 0.65 * gira) * falla * entra).toFixed(2));
    luz.setAttribute('transform', `translate(${sx.toFixed(1)} ${ATILA.sirena}) scale(${(0.9 + 0.2 * gira).toFixed(2)} 1)`);
  }

  /** Una bocanada de vaho: sale de la boca, sube torcida con el viento, crece y se apaga. */
  function soplar(t: number, bajo: number): void {
    const v = vahos[vahoN++ % vahos.length];
    if (!v) return;
    v.desde = t;
    v.x = x + A.boca[0] * escala;
    v.y = piso + bajo + A.boca[1] * escala;
  }

  function pintarVahos(t: number): void {
    for (const v of vahos) {
      const u = (t - v.desde) / 1.9;
      if (u < 0 || u > 1) {
        v.el.setAttribute('opacity', '0');
        continue;
      }
      const crece = 0.5 + 1.4 * u;
      v.el.setAttribute('opacity', (Math.sin(Math.PI * Math.min(1, u * 1.6)) * 0.85 * (1 - u)).toFixed(2));
      v.el.setAttribute('transform', `translate(${(v.x + 14 * u).toFixed(1)} ${(v.y - 34 * u).toFixed(1)}) scale(${crece.toFixed(2)})`);
    }
  }

  function pintar(t: number, dt: number): void {
    const k = abierta(t);
    const quieto = esc.quieto();

    // Lo que decide: la sirena manda sobre todo, menos sobre el gabán abierto.
    if (!quieto && t > proximaSirena && modo !== 'abre') {
      sirenaDesde = t + 0.5;
      proximaSirena = t + 16 + Math.random() * 10;
      empezar('baja', t);
    }
    const u = t - desdeModo;
    switch (modo) {
      case 'abre':
        if (t - abreDesde > ABRE + SOSTIENE + CIERRA) {
          empezar('para', t);
          hasta = t + 1.4;
        }
        break;
      case 'para':
        if (t > hasta && !quieto) {
          // A otro punto del muro, lejos de donde está.
          let otra = izquierda + Math.random() * (derecha - izquierda);
          if (Math.abs(otra - x) < 70) otra = x < (izquierda + derecha) / 2 ? Math.min(derecha, x + 90 + Math.random() * 70) : Math.max(izquierda, x - 90 - Math.random() * 70);
          meta = otra;
          empezar('camina', t);
        }
        break;
      case 'camina': {
        const paso = Math.sign(meta - x) * Math.min(Math.abs(meta - x), 30 * dt);
        x += paso;
        fase += (Math.abs(paso) / 16) * Math.PI;
        if (Math.abs(meta - x) < 0.5) {
          fase = Math.round(fase / Math.PI) * Math.PI;
          // Del lado del gato matón, huele el peligro y se vuelve.
          if (x < ATILA.olfatea) empezar('huele', t);
          else {
            empezar('para', t);
            hasta = t + 1.6 + Math.random() * 2.4;
          }
        }
        break;
      }
      case 'huele':
        miraMeta = [-1, 0];
        if (u > 1.5) {
          meta = ATILA.olfatea + 90 + Math.random() * 80;
          empezar('camina', t);
        }
        break;
      case 'baja':
        // Se tira del otro lado del muro: rápido, como el que ya lo hizo mil veces.
        hundido = ATILA.escondido * suave(u / 0.45);
        if (u > 0.45) empezar('escondido', t);
        break;
      case 'escondido':
        hundido = ATILA.escondido;
        if (t > sirenaDesde + CRUZA + 0.4) empezar('asoma', t);
        break;
      case 'asoma':
        // Asoman el funyi y los ojos por arriba del muro, miran para los dos lados.
        hundido = ATILA.escondido + (ATILA.asoma - ATILA.escondido) * suave(u / 0.7);
        miraMeta = u < 1.3 ? [-1, 0] : u < 2.4 ? [1, 0] : [0, 0];
        if (u > 2.8) empezar('sube', t);
        break;
      case 'sube':
        hundido = ATILA.asoma * (1 - suave(u / 0.55));
        if (u > 0.55) {
          hundido = 0;
          empezar('para', t);
          hasta = t + 1.2;
        }
        break;
    }

    // Los ojos: de reojo, siempre. Cada tanto cambian de lado; a veces miran el farol, como un lunático.
    if (modo !== 'huele' && modo !== 'asoma' && t > proximaMirada) {
      const r = Math.random();
      miraMeta = r < 0.3 ? [-1, 0.2] : r < 0.6 ? [1, 0.2] : r < 0.8 ? [0.6, -1] : [0, 0];
      proximaMirada = t + 0.8 + Math.random() * 1.8;
    }
    mira = [hacia(mira[0], miraMeta[0], dt * 6), hacia(mira[1], miraMeta[1], dt * 6)];
    A.ojos.forEach((o, i) => {
      const [cx, cy] = o.centro;
      p.get(`iris-${i + 1}`)?.setAttribute('transform', `translate(${(cx + mira[0] * o.mira[0]).toFixed(2)} ${(cy + mira[1] * o.mira[1]).toFixed(2)})`);
    });
    if (t > parpadeo + 0.15) parpadeo = t + 2 + Math.random() * 3.5;
    const ciego = t > parpadeo && t < parpadeo + 0.15 ? 1 : 0;
    // Con el gabán abierto guiña el ojo de la luz, una vez, a mitad de la muestra.
    const guino = k > 0.9 && t - abreDesde > ABRE + 0.9 && t - abreDesde < ABRE + 1.35 ? 1 : 0;
    parpado(p.get('parpado-1'), Math.max(ciego, guino, 0.18));
    parpado(p.get('parpado-2'), Math.max(ciego, 0.28));

    // El gabán, y lo que pasa con él abierto: la sirena del forro se prende, las manos lo sostienen.
    hoja(1, k);
    hoja(2, k);
    p.get('manos')?.setAttribute('opacity', (1 - suave(k / 0.25)).toFixed(2));
    const gira = 0.5 + 0.5 * Math.sin(t * Math.PI * 2 * 2.2);
    p.get('sirena-luz')?.setAttribute('opacity', (k * gira).toFixed(2));
    // El bolsillo: el metálico brillo, que se escapa cada tanto aunque lo apriete.
    const destello = Math.max(0, Math.sin(t * 1.3) * Math.sin(t * 2.9)) ** 6;
    p.get('brillo')?.setAttribute('opacity', (destello * (1 - k)).toFixed(2));
    p.get('brillo')?.setAttribute('transform', `translate(${A.brillo[0]} ${A.brillo[1]}) rotate(${(t * 40) % 90}) scale(${(0.6 + destello * 0.6).toFixed(2)})`);

    // Las piernas: un paso corto, de puntillas, como se camina por un muro.
    const andar = modo === 'camina' ? 1 : 0;
    const s = Math.sin(fase) * andar;
    const levanta = (lado: number): number => Math.max(0, Math.cos(fase) * lado) * 8 * andar;
    girar(p.get('pierna-1'), s * 9, A.caderas[0], `translate(0 ${(-levanta(1)).toFixed(2)}) `);
    girar(p.get('pierna-2'), -s * 9, A.caderas[1], `translate(0 ${(-levanta(-1)).toFixed(2)}) `);

    // La cabeza: masca (sube y baja chiquito), olfatea (tres golpes), se hunde en el gabán cuando
    // la sirena está cerca, y con el gabán abierto sale orgullosa.
    const masca = Math.abs(Math.sin(t * Math.PI * 1.6)) * 2.2;
    const olfatea = modo === 'huele' ? Math.max(0, Math.sin(u * Math.PI * 2 * 3)) * 3 : 0;
    const sirenaCerca = t > sirenaDesde - 0.6 && t < sirenaDesde + CRUZA ? 1 : 0;
    const seHunde = Math.max(sirenaCerca * 0.7, modo === 'para' || modo === 'camina' ? 0.25 + 0.15 * Math.sin(t * 0.4) : 0);
    hundidoCabeza = hacia(hundidoCabeza, seHunde * (1 - k), dt * 2.5);
    const [cx, cy] = A.cuello;
    const ladea = Math.sin(t * 0.7) * 2 + mira[0] * 3 - 4 * k;
    p.get('cabeza')?.setAttribute('transform', `translate(0 ${(hundidoCabeza * 30 - 6 * k + masca - olfatea).toFixed(2)}) rotate(${ladea.toFixed(2)} ${cx} ${cy})`);
    // La bufanda masca con él.
    p.get('cuello')?.setAttribute('transform', `translate(0 ${(masca * 0.4).toFixed(2)})`);

    // El cuerpo entero: rebota con el paso, se inclina adonde va, y se hunde detrás del muro.
    const rebota = -Math.abs(Math.sin(fase)) * 4 * andar + Math.sin(t * 1.4) * 1;
    const inclina = Math.sign(meta - x) * 2.4 * andar;
    entero.setAttribute('transform', `translate(${x.toFixed(1)} ${(piso + hundido + rebota).toFixed(2)}) rotate(${inclina.toFixed(2)}) scale(${escala})`);

    // El vaho: cada dos segundos, más seguido cuando camina; escondido, sale igual por arriba del muro.
    if (!quieto && t > proximoVaho) {
      soplar(t, hundido);
      proximoVaho = t + (modo === 'camina' ? 1.2 : 1.9) + Math.random() * 0.6;
    }
    pintarVahos(t);
    pintarSirena(t);
  }

  function abrirElGaban(t: number): void {
    if (modo === 'abre' && t - abreDesde < ABRE + SOSTIENE) abreDesde = Math.max(abreDesde, t - ABRE);
    else abreDesde = t;
    // Si estaba escondido, sube de un salto: hay un cliente.
    hundido = 0;
    empezar('abre', t);
    miraMeta = [0, 0];
  }

  const tocar = (): void => {
    const t = esc.reloj();
    abrirElGaban(t);
    if (esc.quieto()) {
      // Sin movimiento, queda el gabán abierto y quieto: todo a la vista.
      abreDesde = t - ABRE;
      pintar(t, 0);
    }
    // El bocadillo va arriba del funyi, del lado del farol: que se le vea lo que muestra.
    esc.hablar(ID, x + 34, piso - 236);
  };
  g.addEventListener('click', tocar);
  g.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      tocar();
    }
  });
  pintar(0, 0);
  return {
    mover: pintar,
    reaccionar: (id, t) => {
      if (id !== ID) return false;
      abrirElGaban(t);
      return true;
    },
  };
}
