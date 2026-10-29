/**
 * El club de mantis (`D-73`, vigesimoquinta vuelta), sentado a la mesa servida, entre el moscardón y la tipa rapaz.
 *
 * *"El club de mantis muy nervioso está. / Sin descanso van a devorar"* es de *Superlógico*, en *Gulp!* (1985).
 * Acá son tres señoras de club de barrio a la hora del té, con la servilleta atada al cogote, que no se quedan
 * quietas nunca: se hamacan de un lado al otro, como se hamacan las mantis de verdad, dan vuelta la cabeza
 * de golpe y chasquean las pinzas. Tienen los ojos compuestos grandes, con la pseudopupila, el puntito negro
 * que parece que sigue al que mira (y acá lo sigue).
 *
 * Lo del dibujo, que no está en la letra: la de la izquierda tiene un abanico pintado y la servilleta con
 * puntilla; la del medio, un collar de perlas y una M bordada en la servilleta; la de la derecha mastica algo
 * que no se sabe qué es, y le asoma una pata de la boca, y tiene la servilleta manchada de tuco. Hay una fuente
 * de masitas que se pasan. Y llega el macho, más chico, de moño, con un clavel: viene contento por el mantel,
 * del lado de la tipa rapaz. Las patas de adelante de las tres tienen la mancha negra en la coxa.
 *
 * Viste *Gulp!*, medido con sharp: el cuero es el verde de las letras del frente, el del macho el verde que se
 * come el negro del interior; las servilletas y las perlas son el papel de la contratapa y el gris de su letra
 * de máquina; el clavel, el abanico y la boca son el rojo y el amarillo de las letras del interior.
 *
 * Coordenadas: el (0, 0) es el canto de atrás del tablero, debajo de los ojos de la del medio; cada mantis y el
 * macho tienen las suyas (`rig-mantis.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { conGrano, curva, elipse, f, poli, type P } from './trazos.ts';
import { ARMADA as A, CLUB, FUENTE, MACHO_ARMADO as H, PUNTA, QUIETO, marcas, type Momento } from './rig-mantis.ts';

/** Las tintas de *Gulp!* (`tokens.css`). */
const C = {
  tinta: 'var(--bestia-mantis-tinta)',
  noche: 'var(--bestia-mantis-noche)',
  hondo: 'var(--bestia-mantis-hondo)',
  medio: 'var(--bestia-mantis-medio)',
  verde: 'var(--bestia-mantis-verde)',
  luz: 'var(--bestia-mantis-luz)',
  oliva: 'var(--bestia-mantis-oliva)',
  papel: 'var(--bestia-mantis-papel)',
  papelHondo: 'var(--bestia-mantis-papel-hondo)',
  sucio: 'var(--bestia-mantis-papel-sucio)',
  grafito: 'var(--bestia-mantis-grafito)',
  grafitoHondo: 'var(--bestia-mantis-grafito-hondo)',
  rojo: 'var(--bestia-mantis-rojo)',
  rojoHondo: 'var(--bestia-mantis-rojo-hondo)',
  boca: 'var(--bestia-mantis-boca)',
  amarillo: 'var(--bestia-mantis-amarillo)',
  oro: 'var(--bestia-mantis-oro)',
};

/** El espejo: lo de la izquierda, dado vuelta para la derecha. */
const espejo = (cuerpo: string): string => `<g transform="scale(-1 1)">${cuerpo}</g>`;
const mitad = (izq: readonly P[]): P[] => [...izq, ...[...izq].reverse().map(([x, y]) => [-x, y] as P)];

/* ------------------------------------------------------------------
   Cada mantis: el cuerpo sentado detrás del canto, la servilleta, la cabeza
   ------------------------------------------------------------------ */

/** Las alas plegadas como un chal y el protórax largo, de cogote, que sube hasta la cabeza. */
const CUERPO: readonly P[] = mitad([[-21, -1], [-20, -14], [-14, -31], [-7, -44], [-5, -56], [-8, -65], [-4, -76]]);

function cuerpo(n: number): string {
  const d = curva(CUERPO);
  const tono = [C.verde, C.verde, C.medio][n]!;
  // Las nervaduras de las alas, que caen como los pliegues de un chal.
  const venas = [-16, -11, -6, 6, 11, 16].map((x) => trazo(`M${x * 0.5} -36 Q${x * 0.9} -16 ${x} 6`, C.hondo, 0.7, 0.55)).join('') +
    [-14, 14].map((x) => trazo(`M${x} -22 L${x * 0.7} -14 M${x} -10 L${x * 0.75} -2`, C.medio, 0.5, 0.6)).join('');
  return conGrano(
    enmascarado(`m-mantis-cuerpo-${n}`, d,
      forma(d, tono) +
      nube(-14, -6, 8, 22, C.medio, 'm', 0.9) + nube(14, -6, 8, 22, C.hondo, 'm', 0.8) +
      nube(0, 0, 6, 26, C.hondo, 'm', 0.85) + venas +
      // El cogote: la cresta de la luz y la sombra de debajo de la cabeza.
      nube(-2, -58, 2.6, 14, C.luz, 's', 0.85) + nube(0, -73, 8, 4, C.noche, 's', 0.7) + trazo('M-1 -70 L-1 -46', C.luz, 0.7, 0.7) +
      // El lado de la sombra, y lo de abajo, que se pierde en la sombra del canto.
      nube(16, -20, 8, 30, C.noche, 'm', 0.7) + nube(-6, -62, 6, 6, C.noche, 's', 0.5) + nube(0, 2, 30, 9, C.noche, 'm', 0.95)),
  );
}

/** La servilleta atada al cogote: con puntilla, con el collar y la M bordada, o manchada de tuco. */
function servilleta(n: number): string {
  const d = curva([[-13, -66], [-16, -56], [-12, -44], [-6, -34], [0, -28], [6, -34], [12, -44], [16, -56], [13, -66], [0, -63]]);
  const orejas = forma(poli([[-8, -67], [-15, -75], [-12, -66]]), C.papelHondo) + forma(poli([[8, -67], [15, -75], [12, -66]]), C.papelHondo);
  const pliegues = trazo('M-8 -62 Q-6 -46 -2 -32 M4 -62 Q5 -48 3 -33 M-12 -58 Q-11 -50 -8 -42', C.papelHondo, 1.1, 0.9);
  let propio = '';
  if (n === 0) {
    // La puntilla del borde, ondita por ondita.
    const borde: P[] = [[-16, -56], [-12, -44], [-6, -34], [0, -28], [6, -34], [12, -44], [16, -56]];
    for (let i = 0; i < borde.length - 1; i++) {
      const [x0, y0] = borde[i]!;
      const [x1, y1] = borde[i + 1]!;
      for (const t of [0.25, 0.75]) propio += trazo(elipse(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, 1.6, 1.6), C.grafito, 0.45, 0.8);
    }
  } else if (n === 1) {
    // La M bordada, punto atrás, con hilo gris.
    propio = trazo('M-5 -38 L-5 -45 L-2.5 -41 L0 -45 L0 -38', C.grafito, 0.7, 0.9) + trazo('M-6 -36 L1 -36', C.grafito, 0.4, 0.6);
  } else {
    // La mancha de tuco y las migas: es la que come sin parar.
    propio = nube(5, -46, 4.4, 3.6, C.rojoHondo, 's', 0.75) + nube(4, -46, 2.2, 1.8, C.rojo, 'xs', 0.7) + nube(-6, -38, 2, 1.4, C.oro, 'xs', 0.8) +
      forma(elipse(-3, -53, 0.8, 0.8), C.oro) + forma(elipse(7, -36, 0.7, 0.7), C.oro);
  }
  // El collar de perlas, por encima del nudo.
  const perlas = n === 1
    ? trazo('M-11 -64 Q0 -52 11 -64', C.grafitoHondo, 0.5) + Array.from({ length: 11 }, (_, i) => {
      const t = i / 10;
      const [x, y] = [-11 + 22 * t, -64 + 10 * Math.sin(Math.PI * t)];
      return forma(elipse(x, y, 1.7, 1.7), C.papel) + nube(x + 0.5, y + 0.6, 1.2, 1, C.grafito, 'xs', 0.7) + forma(elipse(x - 0.5, y - 0.6, 0.5, 0.5), C.papel);
    }).join('')
    : '';
  return conGrano(
    orejas +
    enmascarado(`m-mantis-servilleta-${n}`, d, forma(d, C.papel) + nube(9, -50, 6, 14, C.papelHondo, 'm', 0.9) + nube(0, -64, 10, 4, C.grafito, 's', 0.6) + nube(0, -30, 10, 5, C.sucio, 's', 0.8) + pliegues + propio) +
    // El nudo, apretado contra el cogote.
    forma(elipse(0, -66, 4, 2.6), C.papelHondo) + nube(0, -65, 3, 1.4, C.sucio, 'xs', 0.8) + perlas,
  );
}

/** El triángulo de la cabeza: los ojos grandes en las puntas, el escudo de la frente con los ocelos, la boca. */
function cabeza(n: number): string {
  const d = curva([[-23, -96], [-19, -102], [-9, -103], [0, -100], [9, -103], [19, -102], [23, -96], [18, -86], [8, -77], [0, -71], [-8, -77], [-18, -86]]);
  const frente = poli([[-6, -99], [6, -99], [7, -89], [0, -84], [-7, -89]]);
  // La del medio tiene los ojos de oro, los que se veían en lo oscuro.
  const [ojo, ojoLuz] = [[C.luz, C.amarillo], [C.oro, C.amarillo], [C.verde, C.luz]][n]!;
  const ojos = A.ojos.map(([x, y], k) => {
    const [rx, ry] = A.radioOjo;
    const giro = k ? 14 : -14;
    // Las facetas: una trama finita de puntos más claros.
    let facetas = '';
    for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) if (i * i + j * j < 11) facetas += forma(elipse(x + i * 2.2 + (j % 2) * 1.1, y + j * 2.4, 0.45, 0.45), C.luz, 0.45);
    return enmascarado(`m-mantis-ojo-${n}-${k}`, elipse(x, y, rx, ry),
      `<g transform="rotate(${giro} ${x} ${y})">` + forma(elipse(x, y, rx, ry), ojo) + nube(x, y - 4, rx * 0.8, ry * 0.5, ojoLuz, 's', 0.9) + nube(x, y + 6, rx, ry * 0.5, C.medio, 's', 0.9) + `</g>` + facetas +
      nube(x + (k ? 3 : -3), y + 1, 2.5, 6, C.hondo, 's', 0.5)) +
      trazo(elipse(x, y, rx + 0.3, ry + 0.3), C.hondo, 0.8, 0.8) +
      forma(elipse(x + (k ? -2.6 : -3.4), y - 4, 1.4, 0.9), C.papel, 0.9);
  }).join('');
  const migas = n === 2 ? forma(elipse(-3, -72, 0.7, 0.7), C.oro) + forma(elipse(2.6, -71.4, 0.6, 0.6), C.oro) + forma(elipse(4.4, -74, 0.5, 0.5), C.oro) : '';
  return conGrano(
    enmascarado(`m-mantis-cabeza-${n}`, d,
      forma(d, C.verde) + nube(0, -96, 16, 5, C.luz, 's', 0.8) + nube(-14, -84, 6, 6, C.medio, 's', 0.8) + nube(14, -84, 7, 7, C.hondo, 's', 0.9) + nube(6, -76, 6, 4, C.noche, 's', 0.6) +
      nube(0, -76, 6, 4, C.medio, 's', 0.9) +
      enmascarado(`m-mantis-frente-${n}`, frente, forma(frente, C.medio) + nube(0, -97, 6, 2.4, C.luz, 'xs', 0.9) + nube(0, -86, 4, 2, C.hondo, 'xs', 0.8)) +
      // Los tres ocelos, como tres cabezas de alfiler.
      forma(elipse(-2.6, -96.6, 0.9, 0.9), C.amarillo) + forma(elipse(2.6, -96.6, 0.9, 0.9), C.amarillo) + forma(elipse(0, -94, 0.9, 0.9), C.amarillo) +
      // El labro y los palpos, finitos, que no paran.
      forma(poli([[-4, -80], [4, -80], [3, -75], [-3, -75]]), C.oro, 0.85) + trazo('M-3 -76 l-3 3 l-1 3 M3 -76 l3 3 l1 3', C.hondo, 0.7)) +
    ojos + migas,
  );
}

/** Las pseudopupilas: un puntito negro en cada ojo, que parece seguir al que mira. Las comparten las tres. */
function pupilas(): string {
  return A.ojos.map(([x, y]) => nube(x, y, 3.2, 3.6, C.tinta, 'xs', 0.6) + forma(elipse(x, y, 1.9, 2.2), C.tinta)).join('');
}

/** La antena de la izquierda, larga y nerviosa; la de la derecha es esta en el espejo. */
function antena(): string {
  const [x, y] = A.antena;
  const d = `M${x} ${y} C${x - 3} ${y - 14} ${x - 14} ${y - 30} ${x - 28} ${y - 37}`;
  return trazo(d, C.hondo, 1.8) + trazo(d, C.medio, 0.8, 0.9) +
    [0.3, 0.55, 0.8].map((t) => forma(elipse(x - 28 * t * t - 2 * t, y - 37 * t + 3 * t * t, 0.6, 0.6), C.luz, 0.8)).join('');
}

/** La pata de adelante de la izquierda, del hombro al codo: la coxa con el ojo falso y el fémur con las espinas. */
function brazo(): string {
  const d = curva([[-10, -64], [-2, -64], [-1.6, -50], [-2.4, -40], [-1.6, -20], [-1.6, 0], [-3, 9], [-9, 9], [-11, -4], [-11.6, -24], [-11, -42], [-11, -54]]);
  const espinas = Array.from({ length: 7 }, (_, i) => {
    const y = -34 + i * 5.4;
    return forma(poli([[-1.6, y], [2.6, y - 2.4], [-1.4, y + 1.8]]), C.hondo) + forma(elipse(2.2, y - 2.2, 0.4, 0.4), C.tinta);
  }).join('');
  return conGrano(
    espinas +
    enmascarado('m-mantis-brazo', d,
      forma(d, C.verde) + nube(-12, -20, 3, 28, C.luz, 's', 0.8) + nube(-1, -14, 3, 30, C.hondo, 's', 0.9) + nube(-1, -14, 1.4, 26, C.noche, 'xs', 0.6) + nube(-6, -44, 6, 4, C.hondo, 's', 0.7) +
      // La mancha negra de la coxa, con el borde amarillo, de las que asustan al que se acerca.
      nube(-5, -54, 2.4, 4, C.amarillo, 'xs', 0.7) + forma(elipse(-5, -54, 1.5, 2.8), C.noche) +
      trazo('M-11 -44 Q-6 -41 -1 -44', C.hondo, 0.7, 0.8)) +
    nube(-6, 7, 4, 3, C.hondo, 's', 0.6),
  );
}

/** La tibia plegada, que sube del codo, con las espinas para adentro y la uña en gancho: la pinza. */
function pinza(): string {
  const d = curva([[-9, 6], [-4, 10], [0, -6], [1, -22], [0, -36], [-3, -40], [-5, -32], [-5, -18], [-7, -4]]);
  const espinas = Array.from({ length: 6 }, (_, i) => {
    const y = -30 + i * 5;
    return trazo(`M-4.6 ${y} l-3.2 1.6`, C.tinta, 0.7, 0.9);
  }).join('');
  return conGrano(
    espinas +
    enmascarado('m-mantis-pinza', d, forma(d, C.verde) + nube(1, -16, 2, 24, C.luz, 's', 0.8) + nube(-5, -10, 2, 20, C.hondo, 's', 0.9)) +
    // La uña en gancho y el tarso, que cuelga.
    trazo(`M${PUNTA[0]} ${PUNTA[1] - 1} Q5 -42 4 -33`, C.hondo, 1.8) + trazo('M4.4 -36 L4 -33', C.tinta, 1) +
    trazo('M-4 -34 l-4 -3 l-2 -4 l-1 -3', C.medio, 0.8, 0.9),
  );
}

/** El abanico de la del abanico: pintado de rojo y de amarillo, con las varillas negras y la puntilla de papel. */
function abanico(): string {
  const [px, py] = PUNTA;
  const r = 28;
  // Se dibuja abriéndose para abajo de la punta: con la pata levantada, queda abierto para arriba.
  const angulos = Array.from({ length: 9 }, (_, i) => 30 + i * 15);
  const en = (a: number, k = 1): P => [px + Math.cos((a * Math.PI) / 180) * r * k, py + Math.sin((a * Math.PI) / 180) * r * k];
  let gajos = '';
  for (let i = 0; i < angulos.length - 1; i++) {
    const [a0, a1] = [angulos[i]!, angulos[i + 1]!];
    const [p0, p1, q0, q1] = [en(a0), en(a1), en(a0, 0.35), en(a1, 0.35)];
    gajos += forma(poli([q0, p0, p1, q1]), i % 2 ? C.rojo : C.rojoHondo);
  }
  const contorno = poli([en(30, 0.35), ...angulos.map((a) => en(a)), en(150, 0.35)]);
  const [cx, cy] = en(90, 0.7);
  const puntilla = angulos.slice(0, -1).map((a) => {
    const [x, y] = en(a + 7.5, 1.02);
    return forma(elipse(x, y, 2, 2), C.papel);
  }).join('');
  return conGrano(
    puntilla +
    enmascarado('m-mantis-abanico', contorno, gajos +
      // La flor pintada en el medio, con el amarillo que asoma debajo del rojo.
      forma(elipse(cx, cy, 4, 3), C.amarillo) + [0, 72, 144, 216, 288].map((a) => {
        const [x, y] = [cx + Math.cos((a * Math.PI) / 180) * 5, cy + Math.sin((a * Math.PI) / 180) * 4];
        return forma(elipse(x, y, 2.2, 1.6), C.amarillo, 0.9);
      }).join('') + forma(elipse(cx, cy, 1.4, 1.2), C.rojoHondo) +
      nube(px, py, 12, 12, C.boca, 's', 0.6)) +
    angulos.map((a) => {
      const [x, y] = en(a, 0.98);
      return trazo(`M${f(px)} ${f(py)} L${f(x)} ${f(y)}`, C.grafitoHondo, 0.6, 0.8);
    }).join('') +
    forma(elipse(px, py, 1.6, 1.6), C.grafitoHondo),
  );
}

/** Las mandíbulas de la boca, que mastican. Las comparten las tres. */
function mandibulas(): string {
  const [bx, by] = A.boca;
  return trazo(`M${bx - 4} ${by - 3} Q${bx - 4} ${by + 1} ${bx - 0.6} ${by + 3}`, C.oro, 1.6) + trazo(`M${bx + 4} ${by - 3} Q${bx + 4} ${by + 1} ${bx + 0.6} ${by + 3}`, C.oro, 1.6) +
    trazo(`M${bx - 3.6} ${by + 0.4} L${bx - 1} ${by + 2.6} M${bx + 3.6} ${by + 0.4} L${bx + 1} ${by + 2.6}`, C.boca, 0.7) + forma(elipse(bx, by, 2, 1.4), C.boca, 0.8);
}

/** La pata de no se sabe qué que le asoma de la boca a la que mastica: negra, con la rodilla y los pelos. */
function pata(): string {
  const [bx, by] = A.boca;
  return conGrano(
    trazo(`M${bx} ${by} L${bx - 8} ${by + 10}`, C.grafitoHondo, 2) + forma(elipse(bx - 8, by + 10, 1.5, 1.5), C.oro) +
    trazo(`M${bx - 8} ${by + 10} L${bx - 5} ${by + 21} l-2 2 M${bx - 5.4} ${by + 19} l2 1`, C.tinta, 1.1) +
    trazo(`M${bx - 4} ${by + 5} l-2 -1 M${bx - 6} ${by + 8} l-2 -1 M${bx - 7} ${by + 14} l-2 0 M${bx - 6.2} ${by + 17} l-2 0`, C.grafito, 0.5, 0.9),
  );
}

/** El bocado que baja por el cogote, cuando traga. */
function bocado(): string {
  return nube(0, -71, 4.6, 3.6, C.verde, 'xs') + nube(-1, -72, 2, 1.4, C.luz, 'xs', 0.9) + nube(1, -69, 3, 1.4, C.hondo, 'xs', 0.6);
}

/* ------------------------------------------------------------------
   Lo del mantel: las masitas, y lo que queda en el plato
   ------------------------------------------------------------------ */

function fuente(): string {
  const [x, y] = FUENTE;
  const d = elipse(x, y, 20, 6.4);
  // La blonda de papel, con el borde calado.
  const calado = Array.from({ length: 18 }, (_, i) => {
    const a = (i / 18) * Math.PI * 2;
    return forma(elipse(x + Math.cos(a) * 20, y + Math.sin(a) * 6.4, 1.6, 1.1), C.papel);
  }).join('');
  const masita = (dx: number, dy: number, k: number): string => {
    const [mx, my] = [x + dx, y + dy];
    return forma(poli([[mx - 4, my], [mx + 4, my], [mx + 4, my - 4], [mx - 4, my - 4]]), C.oro) + forma(poli([[mx - 4, my - 4], [mx + 4, my - 4], [mx + 3, my - 5.6], [mx - 3, my - 5.6]]), k % 2 ? C.amarillo : C.papel) +
      nube(mx + 2, my - 1, 2, 1.6, C.rojoHondo, 'xs', 0.5) + (k % 2 ? '' : forma(elipse(mx, my - 6.6, 1.3, 1.3), C.rojo));
  };
  return conGrano(
    nube(x, y + 2, 22, 4, C.noche, 's', 0.6) + calado + forma(d, C.papel) + trazo(elipse(x, y, 15, 4.4), C.papelHondo, 0.6) +
    masita(-9, 1, 0) + masita(1, 2.4, 1) + masita(10, 0.6, 2) + masita(-3, -2.4, 3) + masita(6, -3, 4),
  );
}

/** El clavel que queda en el plato, caído, con el tallo quebrado. */
function florCaida(): string {
  return conGrano(
    trazo('M-6 26 Q2 22 10 22', C.medio, 1.4) + forma(poli([[0, 24], [4, 20], [6, 24]]), C.verde) +
    clavel(14, 20, 5.4) + nube(14, 24, 8, 2, C.noche, 's', 0.5),
  );
}

/** La antena del macho, que también queda. */
function antenaSuelta(): string {
  const d = 'M-22 28 C-16 24 -8 25 -2 20';
  return trazo(d, C.hondo, 1.4) + trazo(d, C.oliva, 0.6, 0.9) + forma(elipse(-22, 28, 0.9, 0.9), C.oliva);
}

/** Un clavel, de frente, con los bordes picados. */
function clavel(x: number, y: number, r: number): string {
  const borde: P[] = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2;
    const k = i % 2 ? 0.78 : 1;
    return [x + Math.cos(a) * r * k, y + Math.sin(a) * r * k * 0.86];
  });
  const d = poli(borde);
  return enmascarado(`m-mantis-clavel-${Math.round(x)}-${Math.round(y)}`, d,
    forma(d, C.rojo) + nube(x + r * 0.3, y + r * 0.3, r * 0.6, r * 0.5, C.rojoHondo, 'xs', 0.9) + nube(x - r * 0.3, y - r * 0.3, r * 0.4, r * 0.3, C.amarillo, 'xs', 0.45)) +
    trazo(`M${f(x - r * 0.4)} ${f(y)} q${f(r * 0.4)} ${f(-r * 0.3)} ${f(r * 0.8)} 0 M${f(x - r * 0.2)} ${f(y + r * 0.35)} q${f(r * 0.3)} ${f(-r * 0.2)} ${f(r * 0.6)} 0`, C.rojoHondo, 0.5, 0.8);
}

/* ------------------------------------------------------------------
   El macho: más chico, de moño, con el clavel
   ------------------------------------------------------------------ */

function macho(): string {
  const panza = curva([[0, -19], [16, -21], [34, -17], [43, -11], [37, -6], [18, -7], [2, -10]]);
  const alas = curva([[-2, -21], [20, -24], [40, -15], [30, -13], [10, -16]]);
  const pecho = curva([[0, -20], [5, -18], [-2, -46], [-6, -49], [-9, -46]]);
  const cara = curva([[-21, -60], [-16, -66], [-6, -65], [-2, -60], [-6, -53], [-11, -48], [-16, -52]]);
  const [ox, oy] = H.ojo;
  const ojos = [[ox - 5, oy, 4.2, 4.6], [ox + 6, oy, 3.4, 4]].map(([x, y, rx, ry]) =>
    forma(elipse(x!, y!, rx!, ry!), C.luz) + nube(x!, y! + 2, rx!, ry! * 0.5, C.medio, 'xs', 0.8) + forma(elipse(x! - 1.4, y! + 0.4, 1.3, 1.5), C.tinta) + forma(elipse(x! - 1.8, y! - 1.6, 0.6, 0.5), C.papel)).join('');
  // El moño amarillo con lunares, que se puso para la ocasión.
  const mono = forma(poli([[-4, -48], [-11, -51], [-11, -44]]), C.amarillo) + forma(poli([[-4, -48], [3, -51], [3, -44]]), C.amarillo) +
    forma(elipse(-4, -48, 1.6, 1.8), C.oro) + [[-8.6, -48], [0.6, -47], [-9.4, -45.6], [1.4, -49.4]].map(([x, y]) => forma(elipse(x!, y!, 0.6, 0.6), C.rojo)).join('');
  // La otra pata de adelante, plegada contra el pecho como quien se acomoda el saco.
  const plegada = trazo('M-4 -40 L-11 -29 L-7 -38', C.hondo, 2.2) + trazo('M-4 -40 L-11 -29 L-7 -38', C.oliva, 1, 0.9);
  return conGrano(
    // Las antenas largas, para atrás: la de atrás es la que va a quedar en el plato.
    trazo('M-11 -64 C-6 -82 6 -90 20 -86', C.hondo, 1.3) + trazo('M-9 -64 C0 -78 14 -80 26 -72', C.hondo, 1.1) +
    enmascarado('m-mantis-macho-panza', panza, forma(panza, C.oliva) + nube(20, -9, 18, 3, C.hondo, 's', 0.8) +
      [8, 14, 20, 26, 32].map((x) => trazo(`M${x} -19 q1 5 0 11`, C.medio, 0.6, 0.7)).join('')) +
    enmascarado('m-mantis-macho-alas', alas, forma(alas, C.medio) + nube(16, -21, 14, 2, C.luz, 's', 0.6) + trazo('M2 -19 Q20 -21 36 -15', C.hondo, 0.6, 0.8)) +
    enmascarado('m-mantis-macho-pecho', pecho, forma(pecho, C.oliva) + nube(-6, -36, 2, 12, C.luz, 's', 0.7) + nube(2, -24, 3, 6, C.hondo, 's', 0.8)) +
    plegada +
    enmascarado('m-mantis-macho-cara', cara, forma(cara, C.oliva) + nube(-12, -63, 8, 3, C.luz, 's', 0.7) + nube(-10, -51, 4, 3, C.hondo, 's', 0.8)) +
    ojos + mono +
    // La sonrisa de enamorado: las mandíbulas abiertas para arriba.
    trazo('M-14 -51 Q-11 -48.6 -8 -51', C.boca, 0.8),
  );
}

/** La pata de adelante con la que lleva el clavel, levantado, como quien llega a una cita. */
function machoBrazo(): string {
  const [sx, sy] = H.hombro;
  const [fx, fy] = H.flor;
  return conGrano(
    trazo(`M${sx} ${sy} L${sx - 9} ${sy - 20} L${fx + 2} ${fy + 16}`, C.hondo, 2.6) + trazo(`M${sx} ${sy} L${sx - 9} ${sy - 20} L${fx + 2} ${fy + 16}`, C.oliva, 1.2, 0.9) +
    trazo(`M${fx + 2} ${fy + 18} Q${fx - 1} ${fy + 10} ${fx} ${fy + 4}`, C.medio, 1.2) +
    forma(poli([[fx, fy + 10], [fx - 6, fy + 8], [fx - 1, fy + 13]]), C.verde) +
    clavel(fx, fy, 6.4) + trazo(`M${fx + 1} ${fy + 17} l3 -1`, C.tinta, 0.8),
  );
}

/** Las cuatro patas de caminar, en un paso y en el otro. */
function machoPatas(n: 0 | 1): string {
  const pies: ReadonlyArray<readonly [P, P, P]> = n === 0
    ? [[[0, -16], [-8, -21], [-13, 0]], [[3, -15], [6, -20], [4, 0]], [[8, -14], [18, -20], [22, 0]], [[10, -13], [26, -18], [34, 0]]]
    : [[[0, -16], [-6, -22], [-5, 0]], [[3, -15], [-2, -19], [-10, 0]], [[8, -14], [22, -20], [30, 0]], [[10, -13], [16, -18], [16, 0]]];
  return pies.map(([a, b, c]) => {
    const d = `M${a[0]} ${a[1]} L${b[0]} ${b[1]} L${c[0]} ${c[1]}`;
    return trazo(d, C.hondo, 1.8) + trazo(d, C.oliva, 0.7, 0.8) + forma(elipse(c[0], c[1] - 0.4, 1.4, 0.6), C.tinta, 0.6);
  }).join('');
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 2.8;

export const PIEZAS_MANTIS: readonly Pieza[] = [
  ...[0, 1, 2].flatMap((n): Pieza[] => [
    { nombre: `mantis-cuerpo-${n + 1}`, caja: [-22, -80, 44, 80], dibujo: cuerpo(n), densidad: D },
    { nombre: `mantis-servilleta-${n + 1}`, caja: [-18, -78, 36, 52], dibujo: servilleta(n), densidad: D * 1.1 },
    { nombre: `mantis-cabeza-${n + 1}`, caja: [-25, -105, 50, 36], dibujo: cabeza(n), densidad: D * 1.4 },
  ]),
  { nombre: 'mantis-pupilas', caja: [-20, -100, 40, 14], dibujo: pupilas(), densidad: D * 1.4 },
  { nombre: 'mantis-mandibulas', caja: [-6, -78, 12, 10], dibujo: mandibulas(), densidad: D * 1.6 },
  { nombre: 'mantis-antena', caja: [-34, -142, 34, 44], dibujo: antena(), densidad: D * 1.2 },
  { nombre: 'mantis-brazo', caja: [-16, -68, 22, 80], dibujo: brazo(), densidad: D * 1.2 },
  { nombre: 'mantis-pinza', caja: [-13, -46, 22, 58], dibujo: pinza(), densidad: D * 1.2 },
  { nombre: 'mantis-abanico', caja: [PUNTA[0] - 32, PUNTA[1] - 4, 64, 36], dibujo: abanico(), densidad: D * 1.2 },
  { nombre: 'mantis-pata', caja: [-11, -75, 14, 27], dibujo: pata(), densidad: D * 1.6 },
  { nombre: 'mantis-bocado', caja: [-8, -78, 16, 14], dibujo: bocado(), densidad: D },
  { nombre: 'mantis-fuente', caja: [FUENTE[0] - 24, FUENTE[1] - 12, 48, 22], dibujo: fuente(), densidad: D * 1.2 },
  { nombre: 'mantis-flor', caja: [-10, 12, 34, 16], dibujo: florCaida(), densidad: D * 1.2 },
  { nombre: 'mantis-antena-suelta', caja: [-25, 17, 26, 14], dibujo: antenaSuelta(), densidad: D },
  { nombre: 'mantis-macho', caja: [-25, -90, 72, 86], dibujo: macho(), densidad: D * 1.2 },
  { nombre: 'mantis-macho-brazo', caja: [-30, -102, 26, 62], dibujo: machoBrazo(), densidad: D * 1.4 },
  { nombre: 'mantis-patas-1', caja: [-16, -24, 52, 26], dibujo: machoPatas(0), densidad: D },
  { nombre: 'mantis-patas-2', caja: [-14, -24, 48, 26], dibujo: machoPatas(1), densidad: D },
];

const img = imagenesDe(PIEZAS_MANTIS);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** El club armado con las marcas de un momento. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  const una = (i: number): string => {
    const n = i + 1;
    const pataDe = (lado: 'a' | 'b', extra = ''): string =>
      parte(`brazo-${n}-${lado}`, img('mantis-brazo') + parte(`pinza-${n}-${lado}`, img('mantis-pinza') + extra, t[`pinza-${n}-${lado}`]), t[`brazo-${n}-${lado}`]);
    return parte(`mantis-${n}`,
      img(`mantis-cuerpo-${n}`) +
      (n === 3 ? parte('bocado', img('mantis-bocado'), t.bocado, o.bocado) : '') +
      parte(`servilleta-${n}`, img(`mantis-servilleta-${n}`), t[`servilleta-${n}`]) +
      parte(`cabeza-${n}`,
        parte(`antena-${n}-a`, img('mantis-antena'), t[`antena-${n}-a`]) +
        espejo(parte(`antena-${n}-b`, img('mantis-antena'), t[`antena-${n}-b`])) +
        img(`mantis-cabeza-${n}`) +
        parte(`pupilas-${n}`, img('mantis-pupilas'), t[`pupilas-${n}`]) +
        (n === 3 ? parte('pata', img('mantis-pata'), t.pata, o.pata) : '') +
        parte(`mandibulas-${n}`, img('mantis-mandibulas'), t[`mandibulas-${n}`]),
        t[`cabeza-${n}`]) +
      pataDe('a', n === 1 ? parte('abanico', img('mantis-abanico'), t.abanico) : '') +
      espejo(pataDe('b')),
      t[`mantis-${n}`]);
  };
  return (
    una(0) + una(2) + una(1) +
    parte('fuente', img('mantis-fuente'), t.fuente) +
    parte('flor', img('mantis-flor'), '', o.flor) +
    parte('antena-suelta', img('mantis-antena-suelta'), '', o['antena-suelta']) +
    parte('macho',
      parte('patas-1', img('mantis-patas-1'), '', o['patas-1']) +
      parte('patas-2', img('mantis-patas-2'), '', o['patas-2']) +
      parte('macho-cuerpo', img('mantis-macho') + parte('macho-brazo', img('mantis-macho-brazo'), t['macho-brazo']), t['macho-cuerpo']),
      t.macho, o.macho)
  );
}

/** El club en un momento, sin lo que lo hace tocable: para el test, el retrato y para mirarlo. */
export function mantisEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/** El títere que se toca, en la pose quieta: las tres a la mesa y el macho que ya está llegando. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--mantis" data-id="el-club-de-mantis" role="button" tabindex="0" aria-label="${nombres.get('el-club-de-mantis') ?? 'El club de mantis'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: las tres a la mesa, con el macho llegando con el clavel. */
export const RETRATO = { caja: [CLUB.x - 88, CLUB.mesa - 84, 172, 108] as const };
function retrato(): string {
  const fondo = (nombre: string): string => `<image href="/bestiario/${nombre}.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>`;
  return fondo('mesa-lejos') + fondo('mesa-piso') + mantisEn(QUIETO);
}

export const MANTIS_PERSONAJE: Personaje = {
  id: 'el-club-de-mantis',
  region: 'la-mesa',
  ancla: CLUB.x,
  piezas: PIEZAS_MANTIS,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
