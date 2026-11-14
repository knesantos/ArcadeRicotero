/**
 * El héroe del whisky (`D-73`, vigesimoctava vuelta), tirado en la caja de un camión que vuelve a su ciudad.
 *
 * *"Y regresará a su ciudad, en la caja de un camión / las estrellas ahí nomás, a su alcance, frías"* y *"Un héroe del
 * whisky más, el perro se hace notar"* son de *Héroe del whisky*, en *Bang! Bang! Estás liquidado* (1989). Es un fierro
 * de la ruta, como la Mariposa Pontiac: el títere reemplaza la imagen de `ruta-camion` y viaja en el tránsito.
 *
 * Se toma al pie de la letra, verso por verso. **Las estrellas ahí nomás, a su alcance, frías**: cuelgan de una varilla
 * clavada en el techo de la cabina, como la zanahoria de un burro, a una mano de su mano, de papel cortado, facetadas y
 * con escarcha. Él estira el brazo y no llega nunca, porque la varilla viaja con el camión. **Tiene metido hasta las
 * cejas un triste papel / en un menú muy complicado de Tony Soirée**: lleva un gorro hecho con el menú, hasta las cejas,
 * con una carita triste dibujada y los renglones del menú. **De boca floja**: la boca abierta, y la lengua afuera de
 * sed. **Un héroe del whisky más**: la botella en la panza, y las vacías que ruedan por la caja con cada bache.
 * **El nuevo rock de las cavernas**: una guitarra hecha con un hueso, con tres cuerdas, apoyada contra la cabina. **El
 * perro se hace notar**: un perro sentado en la caja, con un pañuelo colorado, que mira las estrellas y les ladra; tocado,
 * ladra con todo el cuerpo y el héroe se levanta el gorro para mirarlo. Lleva puestas la boina y la gabardina del hombre
 * de la tapa.
 *
 * De la letra son el camión, la caja, las estrellas, el menú, la boca floja, la botella, el rock de las cavernas y el
 * perro. Del dibujo son la varilla, el hueso, las botellas vacías, los sacos, el pañuelo del perro y el chofer.
 *
 * Viste *Bang! Bang! Estás liquidado*, medido con sharp: la gabardina y la boina son las del hombre del frente, la cabina
 * es el rojo de los fusilados, las estrellas son el gris celeste del vestido de uno de ellos, y el perro es el naranja
 * del cuadro (`--bestia-heroe-*`).
 *
 * Coordenadas: el (0, 0) es donde las ruedas tocan el carril, y la trompa va a la derecha (`rig-heroe.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, soplo, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { caja, conGrano, curva, elipse, f, poli, type P } from './trazos.ts';
import { HEROE_ARMADO as A, LADRA, QUIETO, marcas, type Momento } from './rig-heroe.ts';

const ID = 'el-heroe-del-whisky';

/** Las tintas de *Bang! Bang! Estás liquidado* (`tokens.css`). */
const C = {
  gab: 'var(--bestia-heroe-gabardina)',
  gabClara: 'var(--bestia-heroe-gabardina-clara)',
  gabHonda: 'var(--bestia-heroe-gabardina-honda)',
  boina: 'var(--bestia-heroe-boina)',
  boinaClara: 'var(--bestia-heroe-boina-clara)',
  piel: 'var(--bestia-heroe-piel)',
  pielClara: 'var(--bestia-heroe-piel-clara)',
  rojo: 'var(--bestia-heroe-rojo)',
  rojoHondo: 'var(--bestia-heroe-rojo-hondo)',
  violeta: 'var(--bestia-heroe-violeta)',
  negro: 'var(--bestia-heroe-negro)',
  frio: 'var(--bestia-heroe-frio)',
  frioClaro: 'var(--bestia-heroe-frio-claro)',
  frioHondo: 'var(--bestia-heroe-frio-hondo)',
  blanco: 'var(--bestia-heroe-blanco)',
  perro: 'var(--bestia-heroe-perro)',
  perroHondo: 'var(--bestia-heroe-perro-hondo)',
  sepia: 'var(--bestia-heroe-sepia)',
};

/** El piso de la caja: donde se apoya todo lo que va arriba. */
const PISO = -34;

/* ------------------------------------------------------------------
   El camión: la sombra, el haz, el chasis, las ruedas, la caja y la cabina
   ------------------------------------------------------------------ */

const sombra = (): string => nube(0, -1, 130, 5, C.negro, 's', 0.85) + nube(A.ruedas[0]![0], -1, 20, 3.4, C.negro, 'xs', 0.9) + nube(A.ruedas[2]![0], -1, 20, 3.4, C.negro, 'xs', 0.9);

/** El haz de la luz de adelante: frío y largo, sobre lo oscuro. */
const haz = (): string =>
  soplo('M126 -47 L126 -41 L262 -16 L262 -66 Z', C.frioClaro, 'm', 0.14) + soplo('M126 -45 L126 -43 L220 -34 L220 -54 Z', C.blanco, 'm', 0.12) + nube(130, -44, 10, 7, C.gabClara, 'm', 0.5);

/** Lo de abajo: los largueros, el hueco de cada rueda, las elásticas, el tanque y los barros. */
function chasis(): string {
  return conGrano(
    forma(caja(-134, -24, 262, 11), C.negro) +
    forma(caja(-134, -24, 262, 2.4), C.violeta, 0.8) +
    A.ruedas.map(([x, y]) => forma(`M${f(x - 21)} ${f(y + 16)} L${f(x - 21)} ${f(y)} Q${f(x)} ${f(y - 26)} ${f(x + 21)} ${f(y)} L${f(x + 21)} ${f(y + 16)} Z`, C.negro)).join('') +
    // Las elásticas, que se abren sobre los ejes de atrás.
    [A.ruedas[0]!, A.ruedas[1]!].map(([x]) => trazo(`M${f(x - 20)} -18 Q${f(x)} -12 ${f(x + 20)} -18`, C.frioHondo, 1.6, 0.9)).join('') +
    // El tanque, colgado abajo, con las correas.
    forma(`M20 -23 L52 -23 L52 -12 L20 -12 Q16 -17 20 -23 Z`, C.frioHondo) + trazo('M28 -23 L28 -12 M44 -23 L44 -12', C.negro, 1.4) + trazo('M22 -21 L50 -21', C.frio, 1, 0.7) +
    // El faldón de goma de atrás, con una luz roja, y el paragolpes de adelante.
    forma(poli([[-130, -16], [-122, -16], [-121, -2], [-130, -2]]), C.negro) + forma(circulo(-133, -19, 2.6), C.rojo) + nube(-133, -19, 6, 5, C.rojo, 'xs', 0.7) +
    forma(caja(122, -26, 14, 7), C.frio) + forma(caja(122, -26, 14, 2), C.frioClaro, 0.8),
  );
}

const circulo = (x: number, y: number, r: number): string => elipse(x, y, r, r);

/** La rueda: la cubierta con la marca que gira, la llanta con las seis tuercas. */
function rueda(): string {
  const r = A.radioRueda;
  return conGrano(
    forma(circulo(0, 0, r), C.negro) +
    nube(5, -7, 8, 5, C.violeta, 's', 0.5) +
    // Las bandas del dibujo de la cubierta y la marca de la costura: se ve girar.
    `<circle cx="0" cy="0" r="14" fill="none" stroke="${C.violeta}" stroke-width="1.4" opacity="0.8"/>` +
    trazo('M0 -15.6 L0 -11', C.gabClara, 1.8, 0.9) + trazo('M-12.6 -4 L-9 -2.6', C.gabClara, 1.2, 0.6) +
    forma(circulo(0, 0, 9), C.frioHondo) + forma(circulo(0.3, -0.3, 8), C.frio) + nube(2.6, -3, 4, 3, C.frioClaro, 's', 0.9) + nube(-3, 3.4, 4, 3, C.frioHondo, 's', 0.8) +
    [0, 60, 120, 180, 240, 300].map((g) => {
      const a = (g * Math.PI) / 180;
      return forma(circulo(Math.cos(a) * 5.4, Math.sin(a) * 5.4, 1.2), C.negro, 0.8);
    }).join('') +
    forma(circulo(0, 0, 2.6), C.frioClaro) + forma(circulo(0, 0, 1.1), C.negro),
  );
}

/** Lo que va tirado en la caja y se queda quieto: el tablón del fondo y los sacos donde descansa el héroe. */
function cajaFondo(): string {
  const sacos = (x: number, y: number, w: number, h: number, g: number): string => {
    const d = curva([[x, y + h], [x + 2, y + h * 0.3], [x + w * 0.4, y], [x + w * 0.9, y + 2], [x + w, y + h * 0.5], [x + w - 2, y + h]]);
    return enmascarado(`m-heroe-saco-${g}`, d, forma(d, C.boina) + nube(x + w * 0.35, y + h * 0.3, w * 0.4, h * 0.3, C.boinaClara, 's', 0.7) + nube(x + w * 0.6, y + h, w * 0.5, h * 0.3, C.gabHonda, 's', 0.6) +
      trazo(`M${f(x + 3)} ${f(y + h * 0.55)} l${f(w - 6)} 1 M${f(x + w * 0.5)} ${f(y + 2)} l1 ${f(h - 3)}`, C.gabHonda, 0.8, 0.6));
  };
  return conGrano(
    // El tablón de este lado del fondo y su borde de arriba.
    forma(caja(-132, -42, 192, 10), C.violeta) + forma(caja(-132, -42, 192, 2), C.frioHondo, 0.7) +
    [-100, -60, -20, 20].map((x) => trazo(`M${x} -42 L${x} -32`, C.negro, 1, 0.7)).join('') +
    // Los sacos: un colchón de arpillera, más alto de este lado, donde apoya la cabeza.
    sacos(-124, -53, 36, 21, 1) + sacos(-92, -51, 40, 19, 2) + sacos(-56, -50, 38, 17, 3) + sacos(-26, -48, 32, 15, 4) +
    // El hilo de los sacos, que cuelga por un costado.
    trazo('M-93 -35 q-2 6 1 8', C.gabHonda, 0.9, 0.8),
  );
}

/** El costado de la caja, que va adelante de lo que va tirado: las tablas, la soga y la cola que cuelga. */
function cajaFrente(): string {
  let tablas = '';
  for (let x = -131; x < 56; x += 24) tablas += trazo(`M${f(x)} -35 L${f(x)} -23`, C.negro, 1.1, 0.7);
  return conGrano(
    forma(caja(-134, -36, 194, 13), C.violeta) +
    nube(-60, -26, 90, 4, C.negro, 's', 0.6) +
    forma(caja(-134, -36, 194, 2.2), C.boinaClara, 0.55) + tablas +
    // La soga que ata la carga, con el nudo, y la punta suelta.
    trazo('M-134 -31 Q-70 -28 -4 -31 T58 -29', C.boina, 1.8, 0.95) + forma(circulo(-4, -31, 2.6), C.boina) + trazo('M-4 -30 q-2 7 1 10', C.boina, 1.4, 0.9) +
    // Los parantes de las esquinas.
    forma(caja(-135, -66, 5, 44), C.violeta) + forma(caja(-135, -66, 1.4, 44), C.boinaClara, 0.6) + forma(caja(54, -70, 6, 48), C.violeta) + forma(caja(54, -70, 1.4, 48), C.boinaClara, 0.6),
  );
}

/** Las botellas vacías: tres, de vidrio, tiradas en el piso de la caja, que ruedan con cada bache. */
function vacias(): string {
  const botella = (x: number, y: number, g: number): string => {
    const d = curva([[x - 11, y], [x - 10, y - 4.2], [x + 2, y - 4.6], [x + 7, y - 2.2], [x + 17, y - 1.6], [x + 19, y], [x + 17, y + 1.6], [x + 7, y + 2.2], [x + 2, y + 4.6], [x - 10, y + 4.2]]);
    return `<g transform="rotate(${g} ${x} ${y})">` +
      enmascarado(`m-heroe-vacia-${Math.round(x)}`, d, forma(d, C.frio, 0.95) + nube(x - 2, y + 3, 10, 2, C.frioHondo, 'xs', 0.9) + nube(x - 2, y - 3, 8, 1, C.blanco, 'xs', 0.95) + forma(caja(x - 12, y - 4, 6, 8), C.gab, 0.5)) +
      trazo(d, C.frioHondo, 0.7, 0.9) + forma(poli([[x - 5, y - 2.6], [x + 3, y - 2.8], [x + 3, y + 2.4], [x - 5, y + 2.6]]), C.blanco) + trazo(`M${f(x - 3.6)} ${f(y - 0.6)} l5 0`, C.sepia, 0.6, 0.8) + forma(caja(x + 18.4, y - 1.2, 1.8, 2.4), C.negro) + `</g>`;
  };
  return conGrano(botella(14, -38.4, -8) + botella(-18, -38.4, 8) + botella(2, -38.8, 172));
}

/** La cabina: el rojo, la ventanilla con el chofer, la trompa con la luz, y el caño de escape parado atrás. */
function cabina(): string {
  const chapa = 'M62 -22 L62 -98 Q62 -106 70 -106 L100 -106 L120 -74 Q128 -72 128 -62 L128 -22 Z';
  const ventana = poli([[86, -100], [108, -100], [118, -76], [86, -76]]);
  return conGrano(
    enmascarado('m-heroe-cabina', chapa,
      forma(chapa, C.rojo) +
      nube(112, -40, 28, 36, C.rojoHondo, 'm', 0.7) + nube(70, -96, 20, 8, C.gabClara, 's', 0.45) + nube(96, -24, 40, 8, C.negro, 's', 0.6) +
      // El filete del costado y el desgaste.
      forma(caja(62, -62, 70, 2.6), C.gabClara, 0.7) + trazo('M64 -90 q10 6 16 1', C.rojoHondo, 1, 0.6)) +
    trazo(chapa, C.negro, 1.2, 0.6) +
    // La ventanilla: afuera la noche, y adentro el chofer, una silueta con la brasa del cigarrillo.
    forma(ventana, C.negro) + forma('M92 -76 Q92 -92 100 -94 Q106 -90 104 -76 Z', C.violeta) + forma(circulo(98, -88, 6), C.sepia) + forma(poli([[91, -84], [104, -84], [102, -90], [93, -91]]), C.negro, 0.9) + forma(circulo(106, -84, 1.6), C.gabClara) + nube(106, -84, 4, 3, C.gab, 'xs', 0.9) +
    trazo(ventana, C.frio, 1.6, 0.8) + trazo('M88 -98 L100 -98', C.frioClaro, 1, 0.6) +
    // La puerta, la manija, el escalón.
    trazo('M84 -72 L84 -28 L112 -28 L112 -72', C.rojoHondo, 1.2, 0.9) + forma(caja(104, -62, 6, 2.4), C.frio) + forma(caja(86, -26, 26, 3), C.negro) +
    // La trompa: la luz redonda, la parrilla cromada y la cadena de la patente.
    forma(circulo(125, -50, 6), C.negro) + forma(circulo(125, -50, 4.6), C.gabClara) + nube(125, -50, 8, 6, C.frioClaro, 's', 0.9) +
    forma(caja(120, -42, 9, 16), C.negro) + [-40, -36, -32, -28].map((y) => trazo(`M120.4 ${y} L128.4 ${y}`, C.frio, 1.2)).join('') +
    // El caño de escape parado atrás, con el sombrerito y los dos soportes.
    forma(caja(64, -128, 6, 96), C.frioHondo) + forma(caja(64, -128, 2, 96), C.frioClaro, 0.8) + forma(`M62 -130 L72 -130 L70 -134 L64 -134 Z`, C.frio) +
    forma(caja(62, -96, 10, 3), C.frio) + forma(caja(62, -60, 10, 3), C.frio),
  );
}

/** Una bocanada del escape, dibujada en su punto de partida: la isla la sube, la ensancha y la deshace. */
function humo(): string {
  const [x, y] = A.escape;
  return soplo(`M${f(x - 6)} ${f(y)} C${f(x - 14)} ${f(y - 8)} ${f(x - 4)} ${f(y - 16)} ${f(x + 6)} ${f(y - 12)} C${f(x + 14)} ${f(y - 6)} ${f(x + 6)} ${f(y + 2)} ${f(x - 6)} ${f(y)} Z`, C.frioHondo, 's', 0.8) + nube(x - 2, y - 7, 6, 4, C.frio, 's', 0.7);
}

/* ------------------------------------------------------------------
   Las estrellas, a su alcance y frías, colgadas de la varilla
   ------------------------------------------------------------------ */

/** La varilla clavada en el techo de la cabina: una caña, con la prensa que la agarra. */
function varilla(): string {
  const [bx, by] = A.varilla;
  const [tx, ty] = [-104, -169.5];
  return conGrano(
    trazo(`M${bx} ${by} L${tx} ${ty}`, C.negro, 3.4, 0.85) + trazo(`M${bx} ${by - 0.8} L${tx} ${ty - 0.8}`, C.boinaClara, 1.2, 0.8) +
    // Los nudos de la caña, y la bolita de la punta.
    [0.2, 0.42, 0.64, 0.84].map((t) => forma(circulo(bx + (tx - bx) * t, by + (ty - by) * t, 1.6), C.boina)).join('') + forma(circulo(tx, ty, 2.4), C.frioClaro) +
    // La prensa del techo.
    forma(poli([[bx - 7, by + 2], [bx + 7, by + 2], [bx + 5, by - 4], [bx - 5, by - 4]]), C.frioHondo) + forma(caja(bx - 8, by + 1, 16, 2.6), C.frio) + forma(circulo(bx - 5, by - 7, 1.6), C.frioClaro),
  );
}

/** Una estrella con su hilo, colgada de `hilo` y con el centro `cuelga` más abajo: de papel cortado, facetada, con escarcha. */
function estrella(i: number): string {
  const [hx, hy] = A.hilos[i]!;
  const R = A.estrellas[i]!;
  const cx = hx;
  const cy = hy + A.cuelgan[i]!;
  const punta = (k: number, r: number): P => {
    const a = ((k * 36 - 90) * Math.PI) / 180;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  };
  const fuera = [0, 2, 4, 6, 8].map((k) => punta(k, R));
  const dentro = [1, 3, 5, 7, 9].map((k) => punta(k, R * 0.46));
  const contorno: P[] = [];
  for (let k = 0; k < 5; k++) contorno.push(fuera[k]!, dentro[k]!);
  // Las facetas: cada punta tiene su lado de luz y su lado de sombra.
  let facetas = '';
  for (let k = 0; k < 5; k++) {
    const ant = dentro[(k + 4) % 5]!;
    const sig = dentro[k]!;
    facetas += forma(poli([[cx, cy], ant, fuera[k]!]), C.frioClaro, 0.9) + forma(poli([[cx, cy], fuera[k]!, sig]), C.frioHondo, 0.55);
  }
  const brillo = (x: number, y: number, r: number): string => trazo(`M${f(x - r)} ${f(y)} L${f(x + r)} ${f(y)} M${f(x)} ${f(y - r)} L${f(x)} ${f(y + r)}`, C.blanco, 0.9, 0.95);
  const cuelgan: P[] = [punta(4, R * 0.95), punta(6, R * 0.95)];
  return conGrano(
    trazo(`M${f(hx)} ${f(hy)} L${f(cx)} ${f(cy - R)}`, C.frio, 0.9, 0.9) +
    enmascarado(`m-heroe-estrella-${i}`, poli(contorno), forma(poli(contorno), C.frio) + nube(cx - R * 0.3, cy - R * 0.3, R * 0.5, R * 0.4, C.frioClaro, 'xs', 0.9) + facetas) +
    trazo(poli(contorno), C.frioClaro, 0.7, 0.8) +
    // La escarcha: cristales en las puntas y dos carámbanos que cuelgan de abajo.
    brillo(punta(0, R * 1.1)[0] + 1, punta(0, R * 1.1)[1] + 1, R * 0.34) + brillo(fuera[2]![0] + 1, fuera[2]![1] - 1, R * 0.26) +
    cuelgan.map(([x, y], n) => forma(poli([[x - 1.1, y], [x + 1.1, y], [x + (n ? 0.4 : -0.4), y + R * 0.5]]), C.frioClaro, 0.95)).join(''),
  );
}

/* ------------------------------------------------------------------
   El héroe: el cuerpo tirado, la cabeza, el gorro de menú, los brazos, la botella
   ------------------------------------------------------------------ */

/** El cuerpo tirado de espaldas: la gabardina con solapa, cinturón anudado y pliegues, y las piernas cruzadas con los zapatos. */
function cuerpo(): string {
  const torso = curva([[-93, -58], [-92, -71], [-84, -79], [-68, -79], [-56, -73], [-46, -66], [-38, -67], [-28, -65], [-24, -57], [-32, -50], [-46, -52], [-58, -49], [-78, -49], [-90, -51]]);
  const faldon = curva([[-36, -68], [-12, -73], [8, -66], [10, -55], [-12, -50], [-36, -51]]);
  // La pierna de lejos, estirada, con el zapato con la punta para arriba.
  const lejos = curva([[-30, -58], [-6, -60], [14, -58], [20, -55], [20, -49.5], [-6, -50], [-30, -50]]);
  // La de cerca, con la rodilla para arriba y el pie cruzado sobre la otra pierna.
  const muslo = curva([[-34, -62], [-22, -76], [-8, -90], [3, -87], [-2, -74], [-14, -61], [-26, -52]]);
  const canilla = curva([[-2, -90], [8, -87], [14, -70], [16, -60], [7, -60], [3, -72], [-6, -80]]);
  const zapato = (x: number, y: number, g: number, giro: number): string => {
    const d = curva([[x - 3, y - 6], [x + 8, y - 7], [x + 16, y - 3], [x + 25, y + 2], [x + 26, y + 7], [x + 22, y + 9], [x - 3, y + 9]]);
    return `<g transform="rotate(${giro} ${x} ${y + 8})">` +
      enmascarado(`m-heroe-zapato-${g}`, d, forma(d, C.negro) + nube(x + 12, y - 3, 8, 1.8, C.frioClaro, 'xs', 0.75) + nube(x + 22, y + 4, 4, 2, C.violeta, 'xs', 0.8) + nube(x + 2, y + 2, 4, 4, C.violeta, 'xs', 0.6)) +
      // La suela con el tacón, y los cordones.
      forma(poli([[x - 3, y + 8], [x + 24, y + 8], [x + 25, y + 10.6], [x - 3, y + 10.6]]), C.gabHonda) + forma(caja(x - 3, y + 8, 7, 4), C.gabHonda) +
      [3, 7, 11].map((dx) => trazo(`M${x + dx} ${y - 6.4} l1.6 3.2`, C.blanco, 0.9, 0.9)).join('') + `</g>`;
  };
  return conGrano(
    enmascarado('m-heroe-lejos', lejos, forma(lejos, C.violeta) + nube(2, -51, 24, 3, C.negro, 's', 0.85) + nube(2, -58.6, 18, 2, C.frioHondo, 'xs', 0.6) + trazo('M-24 -58 q4 4 2 8 M-4 -59 q4 4 2 9', C.negro, 0.9, 0.7)) +
    zapato(14, -59, 1, -6) +
    enmascarado('m-heroe-muslo', muslo, forma(muslo, C.violeta) + nube(-10, -66, 8, 8, C.negro, 's', 0.8) + nube(-2, -88, 5, 3, C.frioHondo, 'xs', 0.5) + trazo('M-20 -62 Q-8 -76 2 -88 M-14 -70 q5 0 7 4', C.frioHondo, 0.9, 0.7)) +
    enmascarado('m-heroe-canilla', canilla, forma(canilla, C.violeta) + nube(11, -68, 3, 10, C.negro, 'xs', 0.8) + trazo('M2 -82 q5 8 7 18 M6 -72 q3 1 5 4', C.frioHondo, 0.8, 0.6)) +
    zapato(5, -62, 2, 6) +
    // El tapado: el lomo con lustre, el hombro, el pliegue hondo del costado y la caída de la tela.
    enmascarado('m-heroe-torso', torso,
      forma(torso, C.gab) + nube(-70, -76, 20, 4, C.gabClara, 's', 0.9) + nube(-44, -53, 40, 5, C.gabHonda, 's', 0.85) + nube(-90, -62, 5, 10, C.gabHonda, 's', 0.6) + nube(-84, -70, 7, 5, C.gabClara, 'xs', 0.6) +
      trazo('M-76 -78 q5 8 3 24 M-62 -75 q4 7 2 20 M-86 -70 q-2 8 0 16 M-34 -66 q-5 6 -4 15', C.gabHonda, 1.3, 0.85)) +
    // La solapa: un panel más claro con el borde marcado, del cuello hacia el cinturón, y el ojal.
    forma(poli([[-88, -75], [-72, -74], [-56, -66], [-60, -60], [-80, -62]]), C.gabClara, 0.9) + trazo('M-88 -75 L-72 -74 L-56 -66 L-60 -60 L-80 -62', C.gabHonda, 1.1, 0.9) + forma(circulo(-66, -66, 1.4), C.gabHonda) +
    // El cinturón anudado: la tira, el nudo y las dos puntas que cuelgan.
    forma(caja(-50, -67, 7, 17), C.gabHonda) + trazo('M-49 -66 l0 15', C.gabClara, 0.7, 0.6) +
    forma(poli([[-46, -58], [-39, -49], [-42, -47], [-48, -54]]), C.gabHonda) + forma(poli([[-46, -58], [-52, -49], [-49, -47], [-44, -54]]), C.gabHonda) + trazo('M-45 -56 L-40 -49 M-46 -56 L-50 -49', C.gabClara, 0.7, 0.7) +
    forma(circulo(-46, -59, 3.6), C.gabHonda) + forma(circulo(-46.6, -59.6, 1.4), C.gabClara, 0.8) +
    // El bolsillo con la tapa.
    forma(poli([[-40, -62], [-27, -61], [-27, -55], [-40, -56]]), C.gabHonda, 0.75) + trazo('M-40 -59 L-27 -58', C.gabClara, 0.8, 0.7) + [-26.6, -26.6].map((x) => forma(circulo(x, -58.6, 1), C.boinaClara)).join('') +
    enmascarado('m-heroe-faldon', faldon, forma(faldon, C.gab) + nube(-10, -58, 18, 8, C.gabHonda, 's', 0.8) + nube(-20, -71, 14, 3, C.gabClara, 's', 0.8) + trazo('M-26 -68 q6 8 2 16 M-8 -70 q4 8 0 18 M4 -64 q2 6 -1 10', C.gabHonda, 1, 0.8)) +
    // La camisa blanca del cuello, asomando, y el cuello levantado.
    forma(poli([[-90, -62], [-84, -74], [-76, -73], [-80, -62]]), C.blanco) + trazo('M-90 -62 L-84 -74 L-76 -73', C.gabHonda, 0.9, 0.7) +
    forma(poli([[-93, -64], [-88, -77], [-80, -77], [-84, -66]]), C.gabHonda, 0.9),
  );
}

/** La cabeza de espaldas, mirando para arriba: la cara de perfil, la boca floja con la lengua afuera, la oreja, la barba. */
function cabeza(): string {
  const cara = curva([[-115, -64], [-114, -76], [-107, -84], [-101, -87], [-98, -92], [-94, -89], [-92, -83], [-88, -79], [-86, -70], [-88, -62], [-96, -57], [-108, -58]]);
  return conGrano(
    enmascarado('m-heroe-cara', cara,
      forma(cara, C.piel) + nube(-98, -76, 10, 8, C.pielClara, 's', 0.9) + nube(-110, -62, 7, 10, C.gabHonda, 's', 0.65) + nube(-90, -62, 6, 6, C.gabHonda, 's', 0.6) +
      // La barba de dos días, a punto.
      [[-92, -66], [-95, -63], [-89, -64], [-98, -66], [-93, -60], [-101, -62]].map(([x, y]) => forma(circulo(x!, y!, 0.8), C.sepia, 0.7)).join('')) +
    // La oreja, del lado que da a la cámara.
    forma(elipse(-107, -68, 3.4, 5), C.piel) + trazo('M-108.6 -71 q3 3 0 6', C.gabHonda, 0.9, 0.8) +
    // La boca floja: abierta, el labio caído y la lengua que cuelga de sed.
    forma(`M-92 -82 Q-89 -83 -87 -79 Q-87 -75 -90 -75 Q-93 -77 -92 -82 Z`, C.sepia) + trazo('M-92 -82 Q-89 -83.6 -87 -79', C.rojoHondo, 1.3, 0.9) +
    forma(`M-90.4 -76 Q-88 -74.5 -87.6 -70 Q-87.4 -67 -89.4 -67.6 Q-90.8 -70 -90.4 -76 Z`, C.rojo) + trazo('M-89 -75 L-88.6 -69', C.rojoHondo, 0.6, 0.8) +
    // El ojo, entornado abajo del gorro: la raya del párpado.
    trazo('M-99 -80 Q-96 -78.4 -93.6 -80', C.sepia, 1.3, 0.95) + trazo('M-100 -81.4 l-2 -1.4 M-97 -80.6 l-0.6 -1.8', C.sepia, 0.7, 0.8),
  );
}

/** El ojo abierto, que asoma cuando se levanta el gorro: blanco, el iris, y el susto. */
function ojo(): string {
  return conGrano(
    forma(elipse(-96.2, -79.6, 3.6, 2.8), C.blanco) + forma(circulo(-97.6, -79.4, 1.9), C.sepia) + forma(circulo(-98, -79.8, 0.7), C.blanco) +
    trazo('M-100.4 -82.2 Q-96.4 -85 -92.4 -82.2', C.sepia, 1.1, 0.9),
  );
}

/** El gorro: un menú doblado como gorro de albañil, hasta las cejas, con la carita triste y los renglones del menú. */
function gorro(): string {
  const d = curva([[-121, -73], [-119, -88], [-110, -96], [-98, -94], [-93, -86], [-97, -82], [-103, -83], [-111, -77]]);
  return conGrano(
    enmascarado('m-heroe-gorro', d,
      forma(d, C.boinaClara) + nube(-112, -92, 12, 5, C.blanco, 's', 0.75) + nube(-100, -84, 8, 4, C.gabHonda, 's', 0.45) +
      // El doblez de arriba, y la mancha de grasa.
      trazo('M-120 -80 Q-108 -88 -95 -84', C.gabHonda, 0.9, 0.6) + forma(elipse(-103, -91, 3, 1.6), C.gab, 0.45)) +
    trazo(d, C.gabHonda, 0.9, 0.7) +
    // La carita triste, grande, con la boca para abajo, y la lágrima.
    forma(circulo(-114, -86, 1.8), C.sepia) + forma(circulo(-106, -88, 1.8), C.sepia) + trazo('M-115 -79 Q-110.4 -83.6 -105 -80', C.sepia, 1.5, 0.95) + forma(poli([[-104, -86], [-102.6, -86], [-103.4, -82.6]]), C.frio, 0.9) +
    // Los renglones del menú, que no se leen, y un sello colorado.
    trazo('M-118 -73.6 l9 -1.2 M-104.6 -96 l7 3', C.sepia, 0.8, 0.7) + `<rect x="-111" y="-77.4" width="6.6" height="3.6" fill="none" stroke="${C.rojo}" stroke-width="0.9" transform="rotate(-8 -108 -75)"/>`,
  );
}

/** El brazo de la botella: la manga, el puño, la mano y la botella de whisky, acostada sobre la panza. */
function brazoBotella(): string {
  const [hx, hy] = A.hombro;
  const manga = curva([[hx - 6, hy - 2], [hx + 6, hy - 8], [hx + 20, hy - 4], [hx + 24, hy + 3], [hx + 12, hy + 6], [hx - 4, hy + 4]]);
  const botella = curva([[hx + 22, hy - 7], [hx + 40, hy - 8], [hx + 54, hy - 5], [hx + 60, hy - 2.4], [hx + 60, hy + 0.4], [hx + 54, hy + 3], [hx + 40, hy + 6], [hx + 22, hy + 5]]);
  return conGrano(
    enmascarado('m-heroe-botella', botella,
      forma(botella, C.negro) + nube(hx + 44, hy - 4, 16, 2.4, C.frioClaro, 'xs', 0.85) + nube(hx + 44, hy + 4, 18, 3, C.violeta, 's', 0.8) +
      // El whisky que queda: lo ámbar de abajo, casi en el fondo.
      forma(caja(hx + 20, hy + 0.6, 22, 6), C.gab, 0.9)) +
    trazo(botella, C.frioHondo, 0.8, 0.8) +
    // La etiqueta, con el renglón, y el tapón colorado.
    forma(poli([[hx + 28, hy - 6.6], [hx + 40, hy - 7.4], [hx + 40, hy + 4.6], [hx + 28, hy + 5]]), C.blanco) + trazo(`M${hx + 30} ${hy - 3} l8 -0.4 M${hx + 30} ${hy + 0.6} l8 -0.4 M${hx + 30} ${hy + 3} l5 -0.2`, C.sepia, 0.7, 0.8) + forma(caja(hx + 59.4, hy - 2.2, 4, 3.6), C.rojo) +
    enmascarado('m-heroe-manga-b', manga, forma(manga, C.gab) + nube(hx + 8, hy + 4, 10, 3, C.gabHonda, 's', 0.8) + trazo(`M${hx + 2} ${hy - 6} q4 4 2 10`, C.gabHonda, 0.9, 0.7)) +
    forma(poli([[hx + 20, hy - 4], [hx + 24, hy - 4.6], [hx + 24, hy + 5], [hx + 20, hy + 4.6]]), C.blanco) +
    // La mano de adelante, que agarra la botella por el medio: nudillos y el pulgar.
    forma(curva([[hx + 22, hy - 5], [hx + 32, hy - 8.6], [hx + 36, hy - 5], [hx + 34, hy + 0.4], [hx + 26, hy + 3]]), C.piel) + [26, 29.6, 33].map((dx) => trazo(`M${hx + dx} ${hy - 7.6} l0 5`, C.gabHonda, 0.6, 0.7)).join('') + nube(hx + 29, hy - 5, 4, 2, C.pielClara, 'xs', 0.8),
  );
}

/** El brazo que alcanza las estrellas: la manga hacia arriba, el puño blanco y la mano abierta (los dedos son aparte). */
function brazoAlto(): string {
  const [hx, hy] = A.hombro;
  const [mx, my] = A.muneca;
  const manga = curva([[hx - 5, hy + 2], [hx - 5.4, hy - 22], [hx - 4, my + 8], [hx + 4, my + 8], [hx + 5.4, hy - 22], [hx + 5, hy + 2]]);
  return conGrano(
    enmascarado('m-heroe-manga-a', manga, forma(manga, C.gab) + nube(hx - 3, hy - 22, 3, 20, C.gabClara, 'xs', 0.8) + nube(hx + 4, hy - 20, 3, 18, C.gabHonda, 'xs', 0.7) + trazo(`M${hx - 2} ${hy - 14} q-4 4 -1 8 M${hx + 2} ${hy - 30} q4 3 1 8`, C.gabHonda, 0.9, 0.8)) +
    forma(caja(mx - 4.6, my + 2, 9.2, 3.6), C.blanco) +
    forma(curva([[mx - 4, my + 2], [mx - 5, my - 4], [mx - 2, my - 8], [mx + 3, my - 8], [mx + 5, my - 4], [mx + 4.4, my + 2]]), C.piel) + nube(mx - 1, my - 2, 3.4, 3.4, C.pielClara, 'xs', 0.8) +
    forma(curva([[mx + 3.6, my - 1], [mx + 7.4, my - 2], [mx + 8, my + 1], [mx + 4, my + 3]]), C.piel),
  );
}

/** Los dedos: cuatro, abiertos hacia la estrella, que la isla cierra sobre el aire. */
function dedos(): string {
  const [mx, my] = A.muneca;
  return conGrano(
    [-3.6, -1.2, 1.2, 3.6].map((dx, i) => {
      const l = 8 + (i === 1 || i === 2 ? 2 : 0);
      return trazo(`M${f(mx + dx)} ${f(my - 6)} L${f(mx + dx * 1.7)} ${f(my - 6 - l)}`, C.piel, 2.4) + forma(circulo(mx + dx * 1.7, my - 6 - l, 1.5), C.piel) + trazo(`M${f(mx + dx * 1.7)} ${f(my - 6 - l)} l0 -0.4`, C.pielClara, 1.1, 0.9);
    }).join(''),
  );
}

/* ------------------------------------------------------------------
   El perro: el cuerpo sentado, la cabeza, la mandíbula, la cola y el ladrido
   ------------------------------------------------------------------ */

/** El perro sentado sobre las patas de atrás, mirando para el lado de las estrellas, con el pañuelo colorado. */
function perro(): string {
  const cuerpo = curva([[27, -74], [37, -70], [47, -58], [48, -42], [40, -35], [22, -35], [19, -50], [21, -64]]);
  const pataAtras = curva([[27, -46], [42, -48], [50, -40], [49, -34], [29, -34]]);
  return conGrano(
    enmascarado('m-heroe-perro', cuerpo,
      forma(cuerpo, C.perro) + nube(25, -58, 6, 14, C.boinaClara, 's', 0.8) + nube(40, -46, 10, 12, C.perroHondo, 's', 0.9) + nube(30, -72, 8, 4, C.gabClara, 's', 0.45) +
      // El pelaje, a rayitas.
      trazo('M36 -68 l4 5 M40 -60 l4 4 M38 -52 l4 3', C.perroHondo, 1, 0.7)) +
    enmascarado('m-heroe-pata-atras', pataAtras, forma(pataAtras, C.perro) + nube(41, -40, 8, 4, C.perroHondo, 's', 0.8)) +
    // Las patas de adelante, largas y derechas, con los deditos.
    forma(curva([[19, -66], [26, -64], [26, -46], [24, -34], [15.6, -34], [16.6, -48]]), C.perro) + nube(20, -44, 3, 9, C.boinaClara, 'xs', 0.6) + trazo('M16.6 -35 l0 -2 M19.6 -35 l0 -2 M22.6 -35 l0 -2', C.perroHondo, 0.8, 0.9) +
    // El pañuelo colorado, anudado, con la punta.
    forma(poli([[18, -76], [30, -79], [32, -72], [20, -69]]), C.rojo) + forma(poli([[27, -73], [33, -68], [30, -64]]), C.rojo) + trazo('M18 -76 L30 -79', C.gabClara, 0.9, 0.6) + nube(24, -71, 6, 2, C.rojoHondo, 'xs', 0.8),
  );
}

/** La cola, dibujada en reposo, apuntando para arriba y para atrás: el perro está contento de que lo miren. */
function perroCola(): string {
  const [x, y] = A.perroCola;
  const d = curva([[x - 3, y - 1], [x + 5, y - 6], [x + 11, y - 16], [x + 9, y - 25], [x + 6, y - 17], [x + 1, y - 10], [x - 3, y + 4]]);
  return conGrano(enmascarado('m-heroe-cola', d, forma(d, C.perro) + nube(x + 9, y - 22, 3, 4, C.boinaClara, 'xs', 0.9) + nube(x + 2, y - 4, 4, 4, C.perroHondo, 'xs', 0.7)));
}

/** La cabeza, de hocico largo, mirando para el lado de las estrellas (la izquierda): la oreja parada, la caída, el ojo, los dientes. */
function perroCabeza(): string {
  const cabeza = curva([[28, -80], [30, -91], [23, -99], [14, -100], [6, -96], [-3, -94.4], [-5, -91], [0, -88.4], [10, -88.4], [17, -86], [23, -81]]);
  return conGrano(
    // La oreja caída, rota en la punta, del lado de atrás.
    forma(curva([[22, -97], [30, -96], [36, -86], [33, -80], [27, -88]]), C.perroHondo) +
    enmascarado('m-heroe-perro-cabeza', cabeza,
      forma(cabeza, C.perro) + nube(14, -97, 12, 3.4, C.gabClara, 's', 0.6) + nube(24, -86, 8, 5, C.perroHondo, 's', 0.8) + nube(0, -91, 6, 3, C.boinaClara, 'xs', 0.6) + nube(22, -92, 4, 6, C.boinaClara, 'xs', 0.4)) +
    // La trufa negra con su brillo, la boca de arriba, los dientes.
    forma(elipse(-3.6, -92, 3, 2.7), C.negro) + nube(-4.4, -93.2, 1.4, 1, C.blanco, 'xs', 0.8) +
    trazo('M-2 -88.6 Q8 -87.4 18 -85.6', C.sepia, 1.1, 0.9) + forma(poli([[2, -88.4], [4.2, -88.4], [3.2, -85.2]]), C.blanco) + forma(poli([[8, -88], [10.2, -87.8], [9.2, -84.8]]), C.blanco) +
    // El ojo abierto con el brillo, la ceja de preocupado y los bigotes.
    forma(circulo(12, -93.6, 2.4), C.sepia) + forma(circulo(12.8, -94.4, 0.85), C.blanco) + trazo('M7.6 -97.6 L15.4 -96', C.perroHondo, 1.3, 0.9) + trazo('M0 -90 l-6 -1 M0 -89 l-6 1.6', C.blanco, 0.6, 0.8) +
    // La oreja de adelante, parada, en punta.
    forma(poli([[17, -99], [20.6, -113], [27, -98]]), C.perro) + forma(poli([[19.6, -100], [21, -108], [24, -100]]), C.rojoHondo, 0.85),
  );
}

/** La mandíbula de abajo, con la lengua: se abre para ladrar, girando sobre la bisagra de la cara. */
function perroBoca(): string {
  const [x, y] = A.perroMandibula;
  return conGrano(
    forma(curva([[x + 3, y - 1.4], [x - 5, y - 2], [x - 15, y - 3.6], [x - 18, y - 0.8], [x - 12, y + 1.6], [x - 3, y + 3], [x + 4, y + 2.6]]), C.perroHondo) +
    forma(curva([[x - 1, y - 2], [x - 9, y - 3.4], [x - 14, y - 2], [x - 9, y + 0.4]]), C.rojo) + nube(x - 8, y - 2, 4, 1, C.gabClara, 'xs', 0.6) + forma(poli([[x - 13, y - 3.4], [x - 11.4, y - 3.4], [x - 12.4, y - 0.6]]), C.blanco),
  );
}

/** El ladrido: tres arcos que se abren desde el hocico para el lado de las estrellas. */
function ladrido(): string {
  const [x, y] = A.trompa;
  return (
    trazo(`M${f(x - 8)} ${f(y - 4)} Q${f(x - 14)} ${f(y - 11)} ${f(x - 9)} ${f(y - 17)}`, C.gabClara, 2, 0.95) +
    trazo(`M${f(x - 14)} ${f(y - 1)} Q${f(x - 23)} ${f(y - 10)} ${f(x - 16)} ${f(y - 22)}`, C.gabClara, 1.8, 0.85) +
    trazo(`M${f(x - 21)} ${f(y + 2)} Q${f(x - 33)} ${f(y - 10)} ${f(x - 22)} ${f(y - 27)}`, C.gabClara, 1.5, 0.7) +
    trazo(`M${f(x - 7)} ${f(y - 4)} Q${f(x - 12)} ${f(y - 10)} ${f(x - 8)} ${f(y - 15)}`, C.blanco, 0.8, 0.9)
  );
}

/** La guitarra del rock de las cavernas: un hueso con tres cuerdas, clavijas y una soga de correa, apoyado contra la cabina. */
function guitarra(): string {
  const [bx, by] = A.guitarra;
  const hueso = [
    curva([[bx - 3.4, by - 14], [bx - 3, by - 58], [bx + 3, by - 58], [bx + 3.4, by - 14]]),
    elipse(bx - 4.2, by - 6, 5.4, 6), elipse(bx + 4.6, by - 7, 5.8, 6.2), elipse(bx - 4.6, by - 63, 5, 4.8), elipse(bx + 4.8, by - 64.4, 5.2, 5),
  ];
  const todo = hueso.join(' ');
  return conGrano(
    enmascarado('m-heroe-hueso', todo, forma(todo, C.boinaClara) + nube(bx - 5, by - 6, 5, 6, C.boina, 's', 0.7) + nube(bx + 5, by - 40, 2, 22, C.gabHonda, 'xs', 0.45) + nube(bx - 1, by - 66, 7, 3, C.boina, 'xs', 0.6) + nube(bx - 2, by - 40, 1.2, 20, C.blanco, 'xs', 0.55)) +
    // Las tres cuerdas, tirantes, el puente y las clavijas de arriba.
    [-2, 0, 2].map((dx) => trazo(`M${f(bx + dx)} ${f(by - 14)} L${f(bx + dx)} ${f(by - 60)}`, C.negro, 0.7, 0.95)).join('') + forma(caja(bx - 4, by - 15.4, 8, 1.8), C.gabHonda) +
    forma(circulo(bx - 7.8, by - 64, 1.5), C.rojo) + forma(circulo(bx + 8.6, by - 66, 1.5), C.rojo) +
    // La grieta del hueso, y la soga de correa.
    trazo(`M${f(bx + 1)} ${f(by - 30)} l1.6 3 l-1.6 3`, C.gabHonda, 0.8, 0.8) + trazo(`M${f(bx - 9)} ${f(by - 8)} Q${f(bx - 16)} ${f(by - 30)} ${f(bx - 8)} ${f(by - 60)}`, C.boina, 1, 0.8),
  );
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 2.6;
const [ex, ey] = A.escape;
const [hxh, hyh] = A.hombro;

export const PIEZAS_HEROE: readonly Pieza[] = [
  { nombre: 'heroe-sombra', caja: [-156, -10, 316, 18], dibujo: sombra(), densidad: 0.8 },
  { nombre: 'heroe-haz', caja: [120, -76, 148, 66], dibujo: haz(), densidad: 0.6 },
  { nombre: 'heroe-chasis', caja: [-142, -42, 290, 44], dibujo: chasis(), densidad: 1.6 },
  { nombre: 'heroe-rueda', caja: [-18, -18, 36, 36], dibujo: rueda(), densidad: 3.2 },
  { nombre: 'heroe-caja-fondo', caja: [-134, -56, 196, 24], dibujo: cajaFondo(), densidad: D },
  { nombre: 'heroe-caja-frente', caja: [-138, -72, 202, 52], dibujo: cajaFrente(), densidad: D },
  { nombre: 'heroe-vacias', caja: [-36, -46, 76, 16], dibujo: vacias(), densidad: D * 1.2 },
  { nombre: 'heroe-guitarra', caja: [A.guitarra[0] - 20, A.guitarra[1] - 76, 36, 84], dibujo: guitarra(), densidad: D * 1.6 },
  { nombre: 'heroe-cabina', caja: [58, -138, 78, 118], dibujo: cabina(), densidad: D },
  { nombre: 'heroe-humo', caja: [ex - 30, ey - 36, 60, 48], dibujo: humo(), densidad: 1.4 },
  { nombre: 'heroe-varilla', caja: [-112, -178, 204, 80], dibujo: varilla(), densidad: D },
  ...[0, 1, 2, 3].map((i): Pieza => {
    const [hx, hy] = A.hilos[i]!;
    const R = A.estrellas[i]!;
    return { nombre: `heroe-estrella-${i + 1}`, caja: [hx - R - 4, hy - 2, R * 2 + 8, A.cuelgan[i]! + R * 1.6 + 8], dibujo: estrella(i), densidad: D * 2.4 };
  }),
  { nombre: 'heroe-cuerpo', caja: [-96, -96, 154, 52], dibujo: cuerpo(), densidad: D * 1.5 },
  { nombre: 'heroe-cabeza', caja: [-119, -92, 38, 38], dibujo: cabeza(), densidad: D * 2 },
  { nombre: 'heroe-ojo', caja: [-104, -86, 14, 12], dibujo: ojo(), densidad: D * 3 },
  { nombre: 'heroe-gorro', caja: [-126, -100, 38, 30], dibujo: gorro(), densidad: D * 2.4 },
  { nombre: 'heroe-brazo-botella', caja: [hxh - 12, hyh - 14, 82, 28], dibujo: brazoBotella(), densidad: D * 1.8 },
  { nombre: 'heroe-brazo-alto', caja: [hxh - 12, A.muneca[1] - 14, 24, 84], dibujo: brazoAlto(), densidad: D * 1.8 },
  { nombre: 'heroe-dedos', caja: [A.muneca[0] - 16, A.muneca[1] - 26, 32, 26], dibujo: dedos(), densidad: D * 2.6 },
  { nombre: 'heroe-perro', caja: [10, -84, 48, 52], dibujo: perro(), densidad: D * 1.8 },
  { nombre: 'heroe-perro-cola', caja: [A.perroCola[0] - 10, A.perroCola[1] - 36, 34, 44], dibujo: perroCola(), densidad: D * 2 },
  { nombre: 'heroe-perro-cabeza', caja: [-2, -114, 42, 42], dibujo: perroCabeza(), densidad: D * 2.4 },
  { nombre: 'heroe-perro-boca', caja: [A.perroMandibula[0] - 22, A.perroMandibula[1] - 8, 30, 20], dibujo: perroBoca(), densidad: D * 3 },
  { nombre: 'heroe-ladrido', caja: [A.trompa[0] - 40, A.trompa[1] - 36, 40, 42], dibujo: ladrido(), densidad: D * 1.6 },
];

const img = imagenesDe(PIEZAS_HEROE);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** El camión armado con las marcas de un momento. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  return (
    parte('sombra', img('heroe-sombra')) +
    parte(
      'entero',
      img('heroe-haz') +
        img('heroe-chasis') +
        img('heroe-caja-fondo') +
        parte('vacias', img('heroe-vacias'), t.vacias) +
        parte('guitarra', img('heroe-guitarra'), t.guitarra) +
        img('heroe-caja-frente') +
        parte(
          'perro',
          img('heroe-perro') + parte('perro-cola', img('heroe-perro-cola'), t['perro-cola']) + parte('perro-cabeza', img('heroe-perro-cabeza') + parte('perro-boca', img('heroe-perro-boca'), t['perro-boca']) + parte('ladrido', img('heroe-ladrido'), t.ladrido, o.ladrido), t['perro-cabeza']),
          t.perro,
        ) +
        parte(
          'hombre',
          parte('brazo-alto', img('heroe-brazo-alto') + parte('dedos', img('heroe-dedos'), t.dedos), t['brazo-alto']) +
            img('heroe-cuerpo') +
            parte('brazo-botella', img('heroe-brazo-botella'), t['brazo-botella']) +
            parte('cabeza', img('heroe-cabeza') + parte('ojo', img('heroe-ojo'), '', o.ojo) + parte('gorro', img('heroe-gorro'), t.gorro), t.cabeza),
          t.hombre,
        ) +
        img('heroe-cabina') +
        parte('humo-1', img('heroe-humo'), t['humo-1'], o['humo-1']) +
        parte('humo-2', img('heroe-humo'), t['humo-2'], o['humo-2']) +
        [1, 2, 3].map((n) => parte(`rueda-${n}`, `<g transform="translate(${A.ruedas[n - 1]![0]} ${A.ruedas[n - 1]![1]})">${img('heroe-rueda')}</g>`, t[`rueda-${n}`])).join('') +
        parte(
          'varilla',
          img('heroe-varilla') + [1, 2, 3, 4].map((n) => parte(`estrella-${n}`, img(`heroe-estrella-${n}`), t[`estrella-${n}`])).join(''),
          t.varilla,
        ),
      t.entero,
    )
  );
}

/** El camión en un momento, sin lo que lo hace tocable: para el test, el retrato y para mirarlo. */
export const heroeEn = (m: Momento = QUIETO): string => `<g class="heroe-del-whisky">${armado(m)}</g>`;

/** El retrato de la ficha: el perro ladrando y el héroe levantándose el gorro. */
export const RETRATO = { caja: [-142, -186, 280, 196] as const };

export const HEROE: Personaje = {
  id: ID,
  region: 'la-ruta',
  ancla: 760,
  piezas: PIEZAS_HEROE,
  // Vive adentro de su fierro, que lo lleva el tránsito: no dibuja nada en las capas del recinto.
  capas: {},
  fierro: () => heroeEn(QUIETO),
  retrato: { caja: RETRATO.caja, cuerpo: () => heroeEn(LADRA) },
};
