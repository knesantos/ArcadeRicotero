/**
 * El lobo caído (`D-73`, vigesimoctava vuelta), tirado entre las raíces en el borde de abajo del monte.
 *
 * *"Dije que el lobo estaba sordo, que no escuchaba más"* es de *El lobo caído*, en *Lobo suelto, cordero atado*
 * (1993). Se toma al pie de la letra: es un lobo viejo y flaco, color arena, que se tiró de panza y no oye nada, ni
 * al otro lobo (el de plata de la tapa, que cada tanto le pasa por detrás, entero, sin que a él se le mueva una
 * oreja). Sordo de verdad: lleva una trompetilla de latón atada a la oreja con un piolín magenta, y sigue sin oír.
 * Del mismo tema: *"maté... y maté... y maté"* (tiene los tantos marcados a rayas en una rodilla de raíz, cuatro y
 * la tacha; los marca él, con la uña, de a uno, y nunca llega a terminar), *"tu careta es injusta, lobo"* (la
 * cara de pelo gastado y las cejas caídas de tener cara de otro) y *"el lobo caído"* mismo: intenta pararse y no
 * puede. Tocado, no se entera; después de un rato levanta la cabeza, para la oreja de la trompetilla para el lado
 * del que toca y pregunta a los gritos, sin voz: abre la boca y no sale nada.
 *
 * De la letra son el lobo, lo sordo, los tantos, la careta y que esté caído. Del dibujo son la trompetilla con el
 * piolín, la rodilla de raíz y el otro lobo que cruza.
 *
 * Viste *Lobo suelto*, medido con sharp: el pelo es el arena del pecho del lobo de la tapa, la montura de la espalda
 * es su gris hondo, el hocico y la panza son su crema, las raíces son el topo del fondo, el otro lobo es el gris plata
 * de su pelo, y el piolín y el adentro de la oreja son el magenta del sello de la contratapa.
 *
 * Coordenadas: el (0, 0) es el piso debajo del medio del cuerpo, y la cabeza va a la derecha (`rig-lobocaido.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { conGrano, curva, elipse, f, poli } from './trazos.ts';
import { GRITA, LOBO, LOBO_ARMADO as A, QUIETO, marcas, type Momento } from './rig-lobocaido.ts';

const ID = 'el-lobo-caido';

/** Las tintas de *Lobo suelto* (`tokens.css`). */
const C = {
  arena: 'var(--bestia-lobocaido-arena)',
  arenaClara: 'var(--bestia-lobocaido-arena-clara)',
  gris: 'var(--bestia-lobocaido-gris)',
  grisHondo: 'var(--bestia-lobocaido-gris-hondo)',
  noche: 'var(--bestia-lobocaido-noche)',
  topo: 'var(--bestia-lobocaido-topo)',
  crema: 'var(--bestia-lobocaido-crema)',
  marfil: 'var(--bestia-lobocaido-marfil)',
  magenta: 'var(--bestia-lobocaido-magenta)',
  rosa: 'var(--bestia-lobocaido-rosa)',
};

function azar(semilla: number): () => number {
  let a = semilla;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------------------------------------------
   El piso, la raíz y la rodilla con los tantos
   ------------------------------------------------------------------ */

/** La tierra pisada donde está tirado: el hueco que dejó el cuerpo, polvo y unos pelos que se le cayeron. */
function piso(): string {
  const rnd = azar(503);
  let pelos = '';
  for (let i = 0; i < 20; i++) {
    const x = -140 + rnd() * 280;
    pelos += trazo(`M${f(x)} ${f(-1 + rnd() * 8)} q${f(3 + rnd() * 5)} ${f(-3 - rnd() * 3)} ${f(8 + rnd() * 8)} ${f(-1 + rnd() * 3)}`, i % 2 ? C.arena : C.crema, 0.9, 0.55);
  }
  return conGrano(nube(0, 5, 150, 8, C.noche, 's', 0.7) + nube(-20, 3, 90, 4, C.topo, 's', 0.7) + pelos);
}

/** La raíz que cuelga arriba como un arco: gruesa, nudosa, con la punta colgando, y el canto de luz que la despega del fondo. */
function raiz(): string {
  const arco = curva([[-206, 2], [-198, -50], [-172, -104], [-116, -134], [-44, -138], [10, -120], [30, -92], [24, -80], [4, -100], [-40, -116], [-96, -114], [-142, -86], [-174, -34], [-182, 2]]);
  const rnd = azar(509);
  let nudos = '';
  for (let i = 0; i < 9; i++) {
    const x = -190 + i * 26 + rnd() * 6;
    nudos += trazo(`M${f(x)} ${f(-110 + rnd() * 30)} q${f(4 + rnd() * 6)} ${f(10 + rnd() * 10)} ${f(rnd() * 6 - 3)} ${f(18 + rnd() * 14)}`, C.noche, 1.3, 0.55);
  }
  return conGrano(
    enmascarado('m-lobocaido-raiz', arco,
      forma(arco, C.topo) + nube(-100, -122, 100, 8, C.arena, 's', 0.55) + nube(-188, -50, 7, 44, C.arena, 's', 0.45) + nube(-60, -108, 80, 7, C.noche, 'xs', 0.7) + nudos) +
    // El canto de luz, que recorre el lomo del arco y la pata de la izquierda.
    trazo('M-199 -46 Q-172 -104 -116 -135 Q-44 -139 10 -121 Q28 -104 30 -92', C.arenaClara, 2.2, 0.9) + trazo('M-196 -52 Q-170 -100 -116 -130', C.marfil, 0.9, 0.6) +
    trazo('M-194 0 q-10 6 -22 4 M-176 -2 q4 8 14 10 M30 -90 q10 10 8 22 M24 -100 q14 4 16 14', C.topo, 2.4, 0.9) + trazo('M-196 2 q-10 5 -22 3 M32 -92 q9 10 7 20', C.arena, 1, 0.7),
  );
}

/** La rodilla de raíz donde marca los tantos: un nudo que asoma de la tierra, con la cara raspada. */
function rodilla(): string {
  const { x } = A.rodilla;
  const d = curva([[x - 26, 2], [x - 22, -26], [x - 8, -42], [x + 12, -40], [x + 24, -22], [x + 30, 2]]);
  return conGrano(
    enmascarado('m-lobocaido-rodilla', d, forma(d, C.topo) + nube(x - 4, -20, 16, 22, C.arena, 's', 0.35) + nube(x + 22, -12, 10, 18, C.noche, 's', 0.75) + nube(x, 0, 30, 6, C.noche, 's', 0.7)) +
    // La parte raspada: más clara, donde tantos y tantos años de marcar.
    forma(poli([[x - 20, -4], [x - 18, -30], [x + 2, -34], [x + 10, -8]]), C.arena, 0.55) + nube(x - 6, -18, 14, 12, C.crema, 'xs', 0.3),
  );
}

/** Un tanto: la raya que marca con la uña, de arriba para abajo; el quinto es la tacha en diagonal. Va en el (0, 0). */
function tanto(i: number): string {
  const cruz = i === 4;
  const d = cruz ? 'M-14 -2 L12 6' : 'M0 -9 q1.4 9 0 17';
  return trazo(d, C.marfil, 1.9, 0.95) + trazo(d, C.noche, 0.7, 0.45);
}

/* ------------------------------------------------------------------
   El lobo: el cuerpo, la cola, las patas, el cogote, la cabeza, la quijada, las orejas y el ojo
   ------------------------------------------------------------------ */

function cuerpo(): string {
  const d = curva([[-124, -24], [-106, -60], [-72, -80], [-20, -82], [30, -72], [62, -58], [62, -30], [42, -12], [-10, -6], [-70, -6], [-112, -10]]);
  const rnd = azar(521);
  // El pelo: mechones cortos y sucios, cada uno para su lado, donde las rayas de las costillas dejaban un armadillo.
  let mechones = '';
  for (let i = 0; i < 64; i++) {
    const x = -112 + rnd() * 170;
    const y = -78 + rnd() * 66;
    const l = 6 + rnd() * 8;
    mechones += trazo(`M${f(x)} ${f(y)} l${f(-l * 0.45)} ${f(l)}`, i % 3 === 0 ? C.arenaClara : i % 3 === 1 ? C.grisHondo : C.noche, 1.3, 0.5 + rnd() * 0.35);
  }
  const muslo = curva([[-104, -32], [-84, -58], [-52, -54], [-42, -30], [-60, -10], [-96, -10]]);
  // La melena del lomo: mechones parados de largo desparejo, de la cola al cogote, cada uno un poco echado para atrás.
  const lomoPts: Array<[number, number]> = [[-104, -58]];
  const tufos: string[] = [];
  const rl = azar(527);
  for (let i = 0; i <= 26; i++) {
    const t = i / 26;
    const x = -104 + t * 164;
    const y = -58 - 26 * Math.sin(Math.PI * Math.min(1, t * 1.05)) * (1 - 0.25 * t) + 8 * t;
    const alto = 6 + rl() * 9;
    lomoPts.push([x - 2, y - alto * 0.3], [x - 3 - rl() * 3, y - alto]);
    tufos.push(`M${f(x - 1)} ${f(y)} l${f(-3 - rl() * 3)} ${f(-alto)}`);
  }
  lomoPts.push([60, -62], [30, -60], [-40, -56], [-98, -50]);
  const lomo = poli(lomoPts);
  return conGrano(
    forma(poli([[-56, -14], [-18, -12], [-12, -2], [-58, -2]]), C.grisHondo) +
    forma(lomo, C.arena) + nube(-40, -80, 70, 8, C.noche, 'xs', 0.55) +
    trazo(tufos.join(' '), C.arenaClara, 1.4, 0.95) + trazo(tufos.filter((_, i) => i % 2 === 0).join(' '), C.noche, 0.8, 0.7) +
    enmascarado('m-lobocaido-cuerpo', d,
      forma(d, C.arena) + nube(-30, -76, 90, 12, C.noche, 'm', 0.8) + nube(-10, -66, 60, 9, C.grisHondo, 's', 0.55) + nube(-30, -12, 80, 12, C.arenaClara, 's', 0.7) + nube(44, -60, 18, 22, C.grisHondo, 's', 0.4) +
      nube(-84, -62, 12, 8, C.topo, 's', 0.7) + nube(-6, -50, 10, 7, C.topo, 's', 0.5) + mechones +
      // Las costillas se le adivinan apenas, bajo el pelo.
      trazo('M-20 -62 q-6 22 -2 40 M-4 -64 q-6 22 -2 42 M12 -64 q-6 22 -2 40', C.noche, 1.6, 0.3)) +
    enmascarado('m-lobocaido-muslo', muslo, forma(muslo, C.arenaClara) + nube(-72, -34, 26, 20, C.arena, 's', 0.8) + nube(-52, -14, 16, 8, C.grisHondo, 's', 0.6) + trazo('M-90 -40 l5 8 M-76 -48 l4 9 M-62 -44 l4 9', C.arena, 1.2, 0.7)) +
    forma(curva([[-60, -14], [-26, -14], [-6, -8], [-6, -1], [-30, 1], [-64, -2]]), C.arena) + nube(-34, -4, 20, 3, C.grisHondo, 'xs', 0.7) +
    trazo('M-12 -6 l5 5 M-20 -7 l4 6 M-4 -5 l5 4', C.noche, 1.2, 0.9) +
    // El filo de luz de la espalda.
    trazo('M-110 -50 L-100 -74 M-96 -66 Q-60 -84 -20 -84 Q24 -80 56 -62', C.marfil, 1.1, 0.55),
  );
}

/** La cola: grande, peluda, tirada en el piso detrás de las patas de atrás, con la punta clara y la banda oscura. */
function cola(): string {
  const [kx, ky] = A.cola;
  const d = curva([[kx + 8, ky - 16], [kx - 28, ky - 28], [kx - 64, ky - 20], [kx - 80, ky - 2], [kx - 70, ky + 14], [kx - 40, ky + 20], [kx - 8, ky + 14], [kx + 6, ky + 6]]);
  const rnd = azar(523);
  let pelo = '';
  for (let i = 0; i < 30; i++) {
    const x = kx - 76 + rnd() * 82;
    const y = ky - 22 + rnd() * 40;
    pelo += trazo(`M${f(x)} ${f(y)} l${f(-8 - rnd() * 6)} ${f(-2 + rnd() * 6)}`, i % 2 ? C.arenaClara : C.grisHondo, 1.3, 0.65);
  }
  return conGrano(
    enmascarado('m-lobocaido-cola', d, forma(d, C.arena) + nube(kx - 30, ky + 16, 50, 7, C.grisHondo, 's', 0.8) + nube(kx - 30, ky - 20, 46, 5, C.arenaClara, 's', 0.85) + nube(kx - 68, ky + 2, 14, 16, C.crema, 's', 0.95) + nube(kx - 46, ky, 6, 18, C.noche, 's', 0.8) + pelo) +
    trazo(`M${kx + 8} ${ky - 16} Q${kx - 30} ${ky - 30} ${kx - 66} ${ky - 20} Q${kx - 80} ${ky - 8} ${kx - 80} ${ky - 2}`, C.marfil, 1.5, 0.7),
  );
}

/** Las patas de adelante, estiradas, con la cabeza apoyada encima: la de lejos más oscura y corrida. */
function pata(): string {
  const [hx, hy] = A.hombro;
  const lejos = curva([[hx + 6, hy - 14], [hx + 40, hy - 12], [hx + 92, hy + 14], [hx + 128, hy + 18], [hx + 134, hy + 28], [hx + 110, hy + 28], [hx + 70, hy + 26], [hx + 26, hy + 8]]);
  const cerca = curva([[hx - 2, hy - 8], [hx + 36, hy - 4], [hx + 82, hy + 14], [hx + 120, hy + 20], [hx + 126, hy + 31], [hx + 96, hy + 33], [hx + 50, hy + 30], [hx + 8, hy + 12]]);
  return conGrano(
    enmascarado('m-lobocaido-pata-lejos', lejos, forma(lejos, C.grisHondo) + nube(hx + 70, hy + 14, 30, 6, C.noche, 's', 0.7)) +
    enmascarado('m-lobocaido-pata-cerca', cerca, forma(cerca, C.arena) + nube(hx + 50, hy + 26, 50, 6, C.grisHondo, 's', 0.8) + nube(hx + 40, hy + 4, 34, 5, C.arenaClara, 's', 0.7) + nube(hx + 118, hy + 26, 10, 6, C.arenaClara, 'xs', 0.7)) +
    // Los dedos y las uñas, largas, que se le curvan.
    trazo(`M${hx + 114} ${hy + 22} l0 10 M${hx + 120} ${hy + 22} l2 10 M${hx + 126} ${hy + 24} l4 8`, C.noche, 1.4, 0.9) +
    trazo(`M${hx + 123} ${hy + 33} q4 2 7 -1 M${hx + 128} ${hy + 33} q4 2 8 -1`, C.marfil, 1.1, 0.9),
  );
}

/** El cogote: la melena gastada que une la cabeza con el cuerpo, a mechones. Gira la mitad que la cabeza, en el mismo punto. */
function cuello(): string {
  const [nx, ny] = A.cuello;
  const d = curva([[nx - 26, ny - 28], [nx + 4, ny - 30], [nx + 26, ny - 20], [nx + 26, ny + 8], [nx - 4, ny + 16], [nx - 28, ny + 2]]);
  const melena = poli([[nx - 30, ny - 20], [nx - 22, ny - 38], [nx - 14, ny - 24], [nx - 6, ny - 42], [nx + 2, ny - 26], [nx + 12, ny - 40], [nx + 20, ny - 24], [nx + 28, ny - 30], [nx + 26, ny + 6], [nx - 20, ny + 8]]);
  return conGrano(
    forma(melena, C.arena) + trazo(`M${nx - 30} ${ny - 20} L${nx - 22} ${ny - 38} L${nx - 14} ${ny - 24} L${nx - 6} ${ny - 42} L${nx + 2} ${ny - 26} L${nx + 12} ${ny - 40} L${nx + 20} ${ny - 24}`, C.arenaClara, 1.5, 0.9) +
    enmascarado('m-lobocaido-cuello', d, forma(d, C.arena) + nube(nx - 6, ny - 18, 24, 6, C.noche, 's', 0.7) + nube(nx + 10, ny + 10, 18, 8, C.arenaClara, 's', 0.6) + trazo(`M${nx - 20} ${ny - 10} l5 9 M${nx - 8} ${ny - 14} l5 10 M${nx + 6} ${ny - 10} l5 9`, C.grisHondo, 1.2, 0.6)),
  );
}

/** La cabeza de lobo: el hocico largo y afilado, la frente con su escalón, la mejilla de mechones y las cejas caídas del que tuvo cara de otro. */
function cabeza(): string {
  const d = curva([[58, -84], [84, -98], [110, -92], [124, -76], [148, -60], [180, -46], [188, -38], [178, -32], [144, -31], [110, -28], [84, -34], [60, -50]]);
  const { centro: [ex, ey], radio: [rx, ry] } = A.ojo;
  return conGrano(
    enmascarado('m-lobocaido-cabeza', d,
      forma(d, C.arena) + nube(92, -90, 34, 8, C.noche, 's', 0.8) + nube(166, -40, 26, 9, C.crema, 's', 0.95) + nube(130, -62, 14, 10, C.grisHondo, 's', 0.4) + nube(86, -50, 16, 12, C.arenaClara, 's', 0.5) + nube(150, -56, 22, 4, C.noche, 'xs', 0.55) +
      trazo('M70 -84 l4 8 M82 -92 l3 9 M96 -94 l2 9 M106 -90 l4 8', C.arenaClara, 1.2, 0.8)) +
    // La nariz seca, la comisura caída, los bigotes y los colmillos.
    forma(elipse(184, -41, 6.4, 5), C.noche) + nube(183, -43, 2.6, 1.6, C.marfil, 'xs', 0.55) +
    trazo('M146 -44 l32 -8 M148 -39 l32 -2', C.marfil, 0.8, 0.8) + trazo('M126 -30 Q150 -26 176 -34', C.noche, 1.3, 0.85) +
    forma(poli([[160, -31], [163, -24], [166, -31]]), C.marfil) + forma(poli([[172, -33], [174, -27], [177, -33]]), C.marfil) +
    // La melena de la mejilla, a mechones: lo que lo hace lobo.
    forma(poli([[70, -40], [76, -22], [86, -34], [92, -18], [102, -32], [110, -20], [118, -30], [100, -42]]), C.arenaClara) + trazo('M80 -32 l4 7 M96 -30 l4 7', C.arena, 1, 0.8) +
    // El ojo almendrado, de párpado pesado, con la ojera hundida y la ceja caída.
    nube(ex, ey + 2, rx + 8, ry + 5, C.grisHondo, 'xs', 0.75) + forma(elipse(ex, ey, rx, ry), C.marfil) + forma(elipse(ex + 1, ey + 0.4, 2.8, 2.8), C.noche) + forma(elipse(ex + 1.8, ey - 0.8, 0.9, 0.9), C.marfil) +
    trazo(`M${ex - 10} ${ey - 8} Q${ex - 2} ${ey - 9} ${ex + 12} ${ey - 2}`, C.noche, 1.8, 0.9) +
    trazo('M150 -50 l4 -2 M140 -44 l4 -2 M128 -48 l4 -3', C.marfil, 0.9, 0.7),
  );
}

function quijada(): string {
  const d = curva([[100, -34], [128, -30], [158, -30], [174, -28], [170, -21], [142, -16], [114, -16], [102, -24]]);
  return conGrano(enmascarado('m-lobocaido-quijada', d, forma(d, C.crema) + nube(138, -18, 30, 4, C.grisHondo, 'xs', 0.7)) + [[150, -29], [157, -29], [164, -28]].map(([x, y]) => forma(poli([[x!, y!], [x! + 3.4, y!], [x! + 1.7, y! - 6]]), C.marfil)).join(''));
}

/** Una oreja de lobo: un triángulo largo, de puntas de pelo, caído para atrás sobre el cogote. */
function triangulo(ox: number, oy: number, largo: number): string {
  return poli([[ox + 10, oy - 12], [ox + 14, oy + 6], [ox + 2, oy + 12], [ox - largo * 0.5, oy + 12], [ox - largo, oy + 14], [ox - largo * 0.55, oy - 2], [ox - largo * 0.3, oy - 10]]);
}

/** La oreja de cerca, de lobo, caída para atrás, con la trompetilla de latón atada con el piolín magenta: tubo curvo, campana y brillo. */
function oreja1(): string {
  const [ox, oy] = A.orejas[0];
  const oreja = triangulo(ox, oy, 44);
  const tubo = `M${ox + 2} ${oy - 12} C${ox - 6} ${oy - 36} ${ox - 22} ${oy - 44} ${ox - 36} ${oy - 38}`;
  const [bx, by] = [ox - 36, oy - 38];
  return conGrano(
    forma(oreja, C.noche) + enmascarado('m-lobocaido-oreja', oreja, forma(oreja, C.grisHondo) + nube(ox - 16, oy + 4, 20, 6, C.rosa, 'xs', 0.75) + nube(ox - 30, oy + 10, 14, 4, C.noche, 'xs', 0.9) + nube(ox + 4, oy - 6, 10, 6, C.arena, 'xs', 0.9)) + trazo(oreja, C.arenaClara, 1.2, 0.8) +
    trazo(`M${ox - 6} ${oy + 10} l-8 6 M${ox - 18} ${oy + 12} l-8 5 M${ox - 30} ${oy + 13} l-7 4`, C.arenaClara, 1, 0.8) +
    // La trompetilla: el tubo de latón con su canto oscuro, su brillo y los aros; la boquilla en la oreja y la campana abierta.
    trazo(tubo, C.noche, 11.4) + trazo(tubo, C.arenaClara, 9) + trazo(tubo, C.arena, 4.4, 0.85) + trazo(`M${ox} ${oy - 15} C${ox - 8} ${oy - 38} ${ox - 22} ${oy - 47} ${ox - 36} ${oy - 41}`, C.marfil, 1.8, 0.95) +
    trazo(`M${ox - 4} ${oy - 28} l7 -2 M${ox - 14} ${oy - 38} l5 -4`, C.noche, 1.8, 0.85) +
    forma(elipse(ox + 2, oy - 11, 7, 4.4), C.noche) + forma(elipse(ox + 2, oy - 11, 5.6, 3.2), C.arenaClara) +
    `<g transform="translate(${bx} ${by}) rotate(-150)">` +
    forma(poli([[0, -5], [0, 5], [24, 20], [24, -20]]), C.noche) + forma(poli([[0, -3.6], [0, 3.6], [23, 17.6], [23, -17.6]]), C.arenaClara) + nube(10, -6, 9, 2.6, C.marfil, 'xs', 0.95) + nube(12, 8, 9, 3.4, C.topo, 'xs', 0.8) +
    forma(elipse(24, 0, 5.4, 20), C.noche) + forma(elipse(24, 0, 4, 17.6), C.topo) + trazo(elipse(24, 0, 5, 19), C.marfil, 1.6, 0.95) + nube(25, 0, 2.4, 12, C.noche, 'xs', 0.9) +
    `</g>` +
    // El piolín, dos vueltas alrededor de la base de la oreja, con el moño.
    trazo(`M${ox + 6} ${oy - 8} q-8 6 -4 18 M${ox + 10} ${oy - 6} q-8 6 -4 18`, C.magenta, 1.9, 0.95) + forma(elipse(ox + 3, oy - 10, 3.4, 2.2), C.magenta) + trazo(`M${ox + 3} ${oy - 9} l-6 6 M${ox + 4} ${oy - 9} l1 7`, C.rosa, 1.2, 0.9),
  );
}

/** La oreja de lejos, más oscura, asomando detrás de la cabeza: el mismo triángulo, caído. */
function oreja2(): string {
  const [ox, oy] = A.orejas[1];
  const d = triangulo(ox, oy, 38);
  return conGrano(enmascarado('m-lobocaido-oreja-2', d, forma(d, C.grisHondo) + nube(ox - 14, oy + 2, 12, 5, C.noche, 'xs', 0.8) + nube(ox - 2, oy - 6, 8, 3, C.arena, 'xs', 0.5)));
}

function parpado(): string {
  const { centro: [ex, ey], radio: [rx, ry] } = A.ojo;
  return conGrano(forma(elipse(ex, ey, rx + 1.8, ry + 2.4), C.arena) + trazo(`M${ex - rx - 1} ${ey + 1} Q${ex} ${ey + ry + 2} ${ex + rx + 1} ${ey + 1}`, C.noche, 1.3, 0.9));
}

/* ------------------------------------------------------------------
   El otro lobo, el de plata, que le pasa por detrás
   ------------------------------------------------------------------ */

/** El lobo de plata de perfil mirando a la izquierda, caminando, con una de las dos posiciones de las patas. */
function otroLobo(fase: 0 | 1): string {
  const pata = (x: number, adelante: boolean, lejos: boolean): string => {
    const k = (fase === 0) === adelante ? -12 : 12;
    return forma(poli([[x - 5, -44], [x + 5, -44], [x + 4 + k * 0.5, -22], [x + 3 + k, -2], [x - 8 + k, -2], [x - 4 + k * 0.5, -22]]), lejos ? C.grisHondo : C.gris);
  };
  const cuerpoD = curva([[20, -62], [-10, -80], [-50, -80], [-84, -70], [-96, -54], [-80, -42], [-40, -42], [0, -44], [26, -48]]);
  const cabezaD = curva([[24, -84], [8, -88], [-8, -78], [-36, -66], [-38, -58], [-10, -56], [14, -62], [28, -70]]);
  return conGrano(
    pata(-62, true, true) + pata(14, false, true) +
    forma(curva([[-90, -66], [-124, -58], [-142, -36], [-134, -30], [-110, -42], [-88, -52]]), C.gris) +
    enmascarado(`m-lobocaido-paso-${fase}`, cuerpoD, forma(cuerpoD, C.gris) + nube(-30, -78, 56, 8, C.noche, 's', 0.8) + nube(-30, -46, 50, 6, C.crema, 's', 0.7)) +
    pata(-80, false, false) + pata(-4, true, false) +
    // La cabeza baja, con la orejas paradas: es el que sí oye.
    enmascarado(`m-lobocaido-paso-cabeza-${fase}`, cabezaD, forma(cabezaD, C.gris) + nube(-26, -60, 14, 4, C.crema, 'xs', 0.8)) +
    forma(poli([[14, -86], [22, -104], [26, -84]]), C.gris) + forma(poli([[2, -88], [6, -104], [14, -88]]), C.grisHondo) +
    forma(elipse(-36, -60, 2.6, 2), C.noche) + forma(elipse(2, -76, 2, 1.6), C.marfil),
  );
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 2.4;
const [OX, OY] = A.orejas[0];
const [EX, EY] = A.ojo.centro;
const cajaDeTanto = ([x, y]: readonly [number, number]): readonly [number, number, number, number] => [x - 16, y - 12, 32, 22];

export const PIEZAS_LOBOCAIDO: readonly Pieza[] = [
  { nombre: 'lobocaido-piso', caja: [-190, -16, 400, 30], dibujo: piso(), densidad: 1.8 },
  { nombre: 'lobocaido-paso-1', caja: [-150, -112, 190, 120], dibujo: otroLobo(0), densidad: 1.8 },
  { nombre: 'lobocaido-paso-2', caja: [-150, -112, 190, 120], dibujo: otroLobo(1), densidad: 1.8 },
  { nombre: 'lobocaido-raiz', caja: [-222, -150, 280, 162], dibujo: raiz(), densidad: 1.8 },
  { nombre: 'lobocaido-rodilla', caja: [A.rodilla.x - 34, -50, 70, 56], dibujo: rodilla(), densidad: D },
  ...[0, 1, 2, 3, 4].map((i) => ({ nombre: `lobocaido-tanto-${i + 1}`, caja: cajaDeTanto(A.tantos[i]!), dibujo: `<g transform="translate(${A.tantos[i]![0]} ${A.tantos[i]![1]})">${tanto(i)}</g>`, densidad: D * 2 })),
  { nombre: 'lobocaido-cola', caja: [A.cola[0] - 90, A.cola[1] - 36, 102, 62], dibujo: cola(), densidad: D },
  { nombre: 'lobocaido-oreja-2', caja: [A.orejas[1][0] - 44, A.orejas[1][1] - 22, 54, 42], dibujo: oreja2(), densidad: D * 1.4 },
  { nombre: 'lobocaido-cuerpo', caja: [-134, -96, 204, 102], dibujo: cuerpo(), densidad: D },
  { nombre: 'lobocaido-pata', caja: [A.hombro[0] - 12, A.hombro[1] - 24, 160, 76], dibujo: pata(), densidad: D },
  { nombre: 'lobocaido-cuello', caja: [A.cuello[0] - 36, A.cuello[1] - 46, 70, 70], dibujo: cuello(), densidad: D * 1.2 },
  { nombre: 'lobocaido-quijada', caja: [94, -40, 88, 36], dibujo: quijada(), densidad: D * 1.6 },
  { nombre: 'lobocaido-cabeza', caja: [54, -102, 142, 80], dibujo: cabeza(), densidad: D * 1.4 },
  { nombre: 'lobocaido-parpado', caja: [EX - 14, EY - 12, 28, 24], dibujo: parpado(), densidad: D * 2 },
  { nombre: 'lobocaido-oreja-1', caja: [OX - 84, OY - 92, 112, 116], dibujo: oreja1(), densidad: D * 1.4 },
];

const img = imagenesDe(PIEZAS_LOBOCAIDO);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** El lobo caído armado con las marcas de un momento. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  return (
    img('lobocaido-piso') +
    parte('paso', parte('paso-1', img('lobocaido-paso-1'), '', o['paso-1']) + parte('paso-2', img('lobocaido-paso-2'), '', o['paso-2']), t.paso) +
    img('lobocaido-raiz') +
    img('lobocaido-rodilla') +
    [1, 2, 3, 4, 5].map((n) => parte(`tanto-${n}`, img(`lobocaido-tanto-${n}`), '', o[`tanto-${n}`])).join('') +
    parte('cuerpo',
      parte('oreja-2', img('lobocaido-oreja-2'), t['oreja-2']) +
      parte('cola', img('lobocaido-cola'), t.cola) +
      parte('tronco', img('lobocaido-cuerpo'), t.tronco) +
      parte('cuello', img('lobocaido-cuello'), t.cuello) +
      parte('pata', img('lobocaido-pata'), t.pata) +
      parte('cabeza',
        parte('quijada', img('lobocaido-quijada'), t.quijada) +
        img('lobocaido-cabeza') +
        parte('parpado', img('lobocaido-parpado'), t.parpado) +
        parte('oreja-1', img('lobocaido-oreja-1'), t['oreja-1']),
        t.cabeza),
      t.cuerpo)
  );
}

/** El lobo en un momento, sin lo que lo hace tocable: para el test, el retrato y para mirarlo. */
export function lobocaidoEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--lobocaido" data-id="${ID}" role="button" tabindex="0" aria-label="${nombres.get(ID) ?? 'El lobo caído'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: gritando sin voz, con la trompetilla parada para quien lo toca. */
export const RETRATO = { caja: [LOBO.x - 100, LOBO.piso - 80, 230, 94] as const };
function retrato(): string {
  return (
    `<image href="/bestiario/monte-lejos.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>` +
    `<image href="/bestiario/monte-cerca.webp" x="0" y="240" width="900" height="400" preserveAspectRatio="none"/>` +
    lobocaidoEn(GRITA)
  );
}

export const LOBOCAIDO_PERSONAJE: Personaje = {
  id: ID,
  region: 'el-monte',
  ancla: LOBO.x,
  piezas: PIEZAS_LOBOCAIDO,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
