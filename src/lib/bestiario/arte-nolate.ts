/**
 * El animal que no late (`D-73`, vigesimonovena vuelta, `T-529`), montado en su peana entre las tiras del monte.
 *
 * *"Por donde esas nubes van, ya no late el animal, no late más"* es de *¡¿Lobo estás?!*, en *Lobo suelto, cordero
 * atado* (1993). Se toma al pie de la letra: no late porque está **relleno**. Es un bicho embalsamado, de especie
 * dudosa (*"nunca supe de alguien como vos"*: por eso la etiqueta que le cuelga trae un signo de pregunta), montado
 * en una peana con rueditas, parado en las puntas de las pezuñas y con una pata en alto, porque *"la vas de
 * bailarín"*; la paja del relleno se le sale por la costura de la cintura y le hace el tutú. Arriba tiene **su
 * nube**, quieta, que llueve nada más que sobre él (*"fíjense señores, cuando esa tormenta suena"*). El viento le
 * mueve el mechón (*"el nene sopla el flequillo"*). Y donde iba el corazón tiene una puertita, entornada, con una
 * radio a transistores adentro (*"la radio… rata-ta-ta"*): cuando lo tocan, la nube le tira un rayo a la antena, la
 * puertita se abre, la radio suena y el bicho baila un compás, tieso, rodando en su peana (*"corrés…"*).
 *
 * De la letra son el animal que no late, las nubes, la tormenta, el flequillo que se sopla, la radio y su
 * rata-ta-ta, el bailarín y que nadie sepa qué es. Del dibujo son la peana con rueditas, la plaquita, los ojos de
 * vidrio (uno se le cae), la boca cosida y la cornamenta chica.
 *
 * Viste *Cordero atado*, medido con sharp: el cuero es el marrón de la cara del cordero, la nube el azul de su
 * plumaje, la radio el naranja del fondo, la paja el oro de las letras y los ojos de vidrio el verde de sus ojos.
 *
 * Coordenadas: el (0, 0) es el piso debajo del medio de la peana, y mira a la derecha (`rig-nolate.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { caja, cajaRedonda, conGrano, curva, elipse, f, poli } from './trazos.ts';
import { NOLATE, NOLATE_ARMADO as A, QUIETO, SUENA, marcas, type Momento } from './rig-nolate.ts';

const ID = 'el-animal-que-no-late';

/** Las tintas de *Cordero atado* (`tokens.css`). */
const C = {
  pelo: 'var(--bestia-nolate-pelo)',
  peloClaro: 'var(--bestia-nolate-pelo-claro)',
  peloHondo: 'var(--bestia-nolate-pelo-hondo)',
  negro: 'var(--bestia-nolate-negro)',
  azul: 'var(--bestia-nolate-azul)',
  azulClaro: 'var(--bestia-nolate-azul-claro)',
  azulHondo: 'var(--bestia-nolate-azul-hondo)',
  naranja: 'var(--bestia-nolate-naranja)',
  naranjaHondo: 'var(--bestia-nolate-naranja-hondo)',
  paja: 'var(--bestia-nolate-paja)',
  pajaHonda: 'var(--bestia-nolate-paja-honda)',
  madera: 'var(--bestia-nolate-madera)',
  maderaHonda: 'var(--bestia-nolate-madera-honda)',
  vidrio: 'var(--bestia-nolate-vidrio)',
  vidrioHondo: 'var(--bestia-nolate-vidrio-hondo)',
  hueso: 'var(--bestia-nolate-hueso)',
  gris: 'var(--bestia-nolate-gris)',
};

/** Un azar con semilla, para que la paja y la lluvia caigan siempre igual. */
function azar(semilla: number): () => number {
  let a = semilla;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** La hoja sin tinta: el grano mide lo que filtra por la caja de lo que no está soplado. */
const hoja = (x: number, y: number, w: number, h: number): string => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${C.negro}" fill-opacity="0"/>`;
/** Una costura: puntadas cortas a lo largo de un camino. */
const costura = (d: string, tinta = C.hueso, o = 0.85): string => `<path d="${d}" fill="none" stroke="${tinta}" stroke-width="1.5" stroke-dasharray="3.4 3" stroke-linecap="round" opacity="${o}"/>`;

/* ------------------------------------------------------------------
   La nube, la lluvia, la chispa y el rayo
   ------------------------------------------------------------------ */

const [NX, NY] = A.nube.centro;

/** La nube: negra de panza, con el canto de arriba apenas azul. No va a ningún lado. */
function laNube(): string {
  const d = curva([[NX - 78, NY + 14], [NX - 70, NY - 6], [NX - 48, NY - 12], [NX - 36, NY - 26], [NX - 8, NY - 28], [NX + 8, NY - 18], [NX + 30, NY - 24], [NX + 52, NY - 14], [NX + 60, NY], [NX + 78, NY + 6], [NX + 74, NY + 20], [NX + 40, NY + 26], [NX - 10, NY + 28], [NX - 52, NY + 26]]);
  return conGrano(
    hoja(NX - 100, NY - 44, 200, 88) +
    nube(NX, NY + 4, 82, 24, C.negro, 'm', 0.75) +
    enmascarado('m-nolate-nube', d,
      forma(d, C.azulHondo) + nube(NX - 30, NY - 20, 30, 10, C.azul, 's', 0.95) + nube(NX + 34, NY - 16, 24, 8, C.azul, 's', 0.9) + nube(NX - 6, NY - 24, 16, 5, C.azulClaro, 's', 0.7) +
      nube(NX, NY + 22, 80, 12, C.negro, 'm', 0.95) + nube(NX - 40, NY + 6, 18, 8, C.negro, 's', 0.5) + nube(NX + 26, NY + 4, 22, 8, C.negro, 's', 0.5)) +
    trazo(`M${NX - 66} ${NY - 6} q10 -10 24 -8 M${NX - 34} ${NY - 25} q12 -6 26 -2 M${NX + 12} ${NY - 20} q10 -6 20 -3`, C.azulClaro, 1.4, 0.7),
  );
}

/** La lluvia: rayas que bajan derechas. Mide dos tramos de más, así la isla la baja uno y vuelve sin salto. */
function laLluvia(): string {
  const rnd = azar(331);
  const T = A.tramo;
  let s = '';
  for (let i = 0; i < 22; i++) {
    const x = -70 + rnd() * 150;
    const y0 = rnd() * T;
    const largo = 9 + rnd() * 9;
    const tinta = i % 3 ? C.azulClaro : C.hueso;
    const o = 0.45 + rnd() * 0.4;
    // Cada gota se repite cada tramo, de arriba de la nube hasta la peana.
    for (let y = A.nube.panza - T + y0; y < 0; y += T) s += trazo(`M${f(x)} ${f(y)} l-1.2 ${f(largo)}`, tinta, 1.3, o);
  }
  return s;
}

/** La chispa que no llega a rayo: un chisporroteo en la panza de la nube. Tinta plana con su canto, sin halo. */
function laChispa(): string {
  const [x, y] = [NX + 8, A.nube.panza + 4];
  const d = `M${x - 8} ${y - 4} l5 6 l-4 1 l6 7 M${x + 6} ${y - 5} l-3 5 l4 1`;
  return trazo(d, C.azulHondo, 4.6) + trazo(d, C.paja, 2.6) + trazo(d, C.hueso, 1) + trazo(`M${x - 12} ${y + 4} l-5 3 M${x + 12} ${y + 2} l6 2`, C.paja, 1.4, 0.9);
}

/** El rayo: de la panza de la nube a la punta de la antena estirada. Tinta plana: el canto oscuro, el oro y el filo claro. Sin halo. */
function elRayo(): string {
  const [ax, ay] = A.antena.base;
  const punta = ay - A.antena.largo;
  const y0 = A.nube.panza + 2;
  const d = `M${NX + 10} ${y0} L${ax + 16} ${y0 + 20} L${ax + 6} ${y0 + 24} L${ax + 14} ${punta - 16} L${ax + 4} ${punta - 13} L${ax + 1} ${punta}`;
  const pega = `M${ax + 1} ${punta - 8} l2 5.4 l6 -1.4 l-4.4 4 l3.4 5 l-6 -2.4 l-4 4.4 l0.4 -6 l-6 -2 l6 -1.6 Z`;
  return `<path d="${d}" fill="none" stroke="${C.azulHondo}" stroke-width="9" stroke-linejoin="miter" stroke-linecap="square"/>` +
    `<path d="${d}" fill="none" stroke="${C.paja}" stroke-width="5.4" stroke-linejoin="miter" stroke-linecap="square"/>` +
    `<path d="${d}" fill="none" stroke="${C.hueso}" stroke-width="1.8" stroke-linejoin="miter"/>` + forma(pega, C.hueso);
}

/* ------------------------------------------------------------------
   El piso, la peana y las rueditas
   ------------------------------------------------------------------ */

/** Lo oscuro de abajo de la nube: una mancha de canto roto en el piso y un velo flojo detrás del bicho, que lo despega del monte. */
function elPiso(): string {
  // El canto, roto a mano: ni una curva pareja.
  const d = poli([[-116, 3], [-104, -5], [-92, -3], [-78, -9], [-60, -6.4], [-44, -12], [-20, -8.6], [-4, -12.4], [18, -8], [36, -11.4], [60, -7], [76, -10.4], [96, -5], [112, -6.4], [121, 1], [108, 5.6], [115, 11], [92, 9.4], [70, 14], [40, 11.4], [10, 15], [-22, 11.6], [-48, 15], [-74, 10.6], [-96, 13.4], [-106, 8], [-120, 7.4]]);
  return (
    nube(0, -120, 62, 96, C.negro, 'l', 0.62) + nube(-10, -50, 80, 44, C.negro, 'l', 0.5) +
    conGrano(hoja(-130, -20, 260, 40) + forma(d, C.negro, 0.94) + nube(10, 4, 60, 4, C.azulHondo, 's', 0.3) +
      // Los charquitos: llueve solo acá.
      forma(elipse(-96, 6, 12, 2.6), C.azul, 0.8) + forma(elipse(98, 7, 9, 2.2), C.azul, 0.8) + trazo('M-104 5.4 h10 M94 6.4 h7', C.azulClaro, 0.9, 0.8))
  );
}

/** La peana: una tabla de madera con la plaquita de bronce, y la varilla que le entra al bicho por la panza. */
function laPeana(): string {
  const { desde, hasta, lomo } = A.peana;
  const d = cajaRedonda(desde, lomo, hasta - desde, 11, 2.5);
  const [vx] = A.varilla;
  const rnd = azar(337);
  let vetas = '';
  for (let i = 0; i < 9; i++) {
    const x = desde + 6 + rnd() * (hasta - desde - 30);
    vetas += trazo(`M${f(x)} ${f(lomo + 3 + rnd() * 6)} q8 ${f(-1 + rnd() * 2)} ${f(12 + rnd() * 10)} 0`, C.maderaHonda, 0.9, 0.75);
  }
  return conGrano(
    // La varilla, oxidada, de la tabla a la panza.
    forma(caja(vx - 2.2, -84, 4.4, 84 + lomo), C.naranjaHondo) + trazo(`M${vx - 1} -82 V${lomo}`, C.paja, 0.9, 0.7) + forma(cajaRedonda(vx - 7, lomo - 4, 14, 5, 1.5), C.gris) +
    enmascarado('m-nolate-peana', d, forma(d, C.madera) + nube(0, lomo + 1, 90, 3, C.pajaHonda, 's', 0.55) + nube(0, lomo + 11, 90, 4, C.negro, 's', 0.7) + vetas) +
    trazo(`M${desde + 2} ${lomo + 0.8} H${hasta - 2}`, C.pajaHonda, 1.2, 0.8) +
    // La plaquita, atornillada: dice algo que no se llega a leer.
    forma(cajaRedonda(-34, lomo + 2, 40, 7.4, 1), C.pajaHonda) + trazo(`M-33 ${lomo + 2.8} h38`, C.paja, 0.9, 0.9) + trazo(`M-28 ${lomo + 5.2} h12 m3 0 h9 M-28 ${lomo + 7.4} h18`, C.maderaHonda, 0.9, 0.9) +
    forma(elipse(-32, lomo + 5.6, 0.9, 0.9), C.madera) + forma(elipse(4, lomo + 5.6, 0.9, 0.9), C.madera),
  );
}

/** Una ruedita de carrito, dibujada en el (0, 0): la isla la pone en su eje y la gira. */
function laRueda(): string {
  return conGrano(forma(elipse(0, 0, 6, 6), C.negro) + forma(elipse(0, 0, 4.4, 4.4), C.maderaHonda) + trazo('M-4 0 H4 M0 -4 V4', C.pajaHonda, 1.1, 0.9) + forma(elipse(0, 0, 1.4, 1.4), C.gris));
}

/* ------------------------------------------------------------------
   El bicho
   ------------------------------------------------------------------ */

/** Una pata parada en punta: `x` es dónde pisa, `arriba` la altura del muslo, `ancho` el del muslo. */
function pataParada(id: string, x: number, lejos: boolean, adelante: boolean): string {
  const y0 = A.peana.lomo;
  const top = adelante ? -98 : -94;
  const w = adelante ? 8 : 10;
  // El garrón quiebra para atrás, como en un perro flaco, y termina derecha, en punta.
  const k = adelante ? 1 : -3;
  const d = curva([[x - w, top], [x + w, top], [x + w - 2 + k, -66], [x + 4 + k * 1.6, -46], [x + 3.2, -30], [x + 2.6, y0 - 9], [x - 2.6, y0 - 9], [x - 3.4, -30], [x - 4 + k * 1.6, -46], [x - w + 1 + k, -66]]);
  const tinta = lejos ? C.peloHondo : C.pelo;
  return (
    enmascarado(id, d, forma(d, tinta) + nube(x - 3, -70, 3, 30, lejos ? C.pelo : C.peloClaro, 's', lejos ? 0.3 : 0.7) + nube(x + 5, -60, 3, 30, C.negro, 's', 0.45)) +
    // La pezuña, en punta, como una zapatilla.
    forma(poli([[x - 3.2, y0 - 10], [x + 3.2, y0 - 10], [x + 2.2, y0 - 3], [x, y0], [x - 2.2, y0 - 3]]), lejos ? C.gris : C.hueso) +
    trazo(`M${x - 3} ${y0 - 10} h6`, C.peloHondo, 1, 0.8)
  );
}

/** Las patas de lejos y la de atrás de cerca van detrás del cuerpo; se imprimen juntas. */
function patasLejos(): string {
  return conGrano(pataParada('m-nolate-pl-1', -30, true, false) + pataParada('m-nolate-pl-2', -44, false, false));
}

/** La pata en alto, la de lejos: dibujada levantada, con la pezuña colgando en punta. Gira del hombro. */
function pataEnAlto(): string {
  const [hx, hy] = A.hombro;
  const d = curva([[hx - 6, hy - 6], [hx + 6, hy - 8], [hx + 26, hy - 4], [hx + 34, hy + 2], [hx + 40, hy + 16], [hx + 42, hy + 30], [hx + 37, hy + 31], [hx + 33, hy + 18], [hx + 26, hy + 8], [hx + 4, hy + 6], [hx - 6, hy + 4]]);
  return conGrano(
    enmascarado('m-nolate-pata', d, forma(d, C.peloHondo) + nube(hx + 14, hy - 5, 14, 3, C.pelo, 's', 0.7) + nube(hx + 36, hy + 12, 3, 12, C.pelo, 's', 0.5)) +
    forma(poli([[hx + 36.6, hy + 29], [hx + 42.6, hy + 28], [hx + 42.4, hy + 35], [hx + 40.6, hy + 39], [hx + 37.8, hy + 36]]), C.gris),
  );
}

/** La cola: alambrada, tiesa para arriba, con el mechón apolillado. */
function laCola(): string {
  const [kx, ky] = A.cola;
  const d = curva([[kx + 4, ky - 6], [kx - 10, ky - 12], [kx - 19, ky - 28], [kx - 14, ky - 44], [kx - 8, ky - 42], [kx - 12, ky - 28], [kx - 6, ky - 16], [kx + 4, ky + 4]]);
  return conGrano(
    enmascarado('m-nolate-cola', d, forma(d, C.pelo) + nube(kx - 14, ky - 30, 3, 14, C.peloClaro, 'xs', 0.7)) +
    trazo(`M${kx - 12} ${ky - 44} l-4 -8 M${kx - 10} ${ky - 44} l1 -9 M${kx - 8} ${ky - 42} l5 -7`, C.peloClaro, 1.2, 0.9) +
    // El alambre que la sostiene, que asoma.
    trazo(`M${kx - 15} ${ky - 50} l-2 -7`, C.gris, 0.9),
  );
}

const [PX, PY, PW, PH] = A.puerta;

/** La radio a transistores, en el hueco del pecho: la parrilla del parlante, el dial prendido y las dos perillas. */
function laRadio(): string {
  return (
    forma(cajaRedonda(PX + 2, PY + 3, PW - 4, PH - 6, 2.5), C.naranja) + forma(cajaRedonda(PX + 2, PY + PH - 8, PW - 4, 5, 2), C.naranjaHondo) +
    // El parlante, a la izquierda: una parrilla de agujeritos.
    forma(cajaRedonda(PX + 4, PY + 6, 15, 15, 2), C.negro) +
    [0, 1, 2, 3].flatMap((i) => [0, 1, 2, 3].map((j) => forma(elipse(PX + 6.2 + i * 3.6, PY + 8.2 + j * 3.6, 0.9, 0.9), C.gris))).join('') +
    // El dial, a la derecha, contra el canto por donde se ve la rendija: prendido.
    forma(elipse(PX + PW - 8, PY + 10, 5.2, 5.2), C.paja) + forma(elipse(PX + PW - 8, PY + 10, 3, 3), C.hueso) + trazo(`M${PX + PW - 8} ${PY + 10} l2.6 -3`, C.naranjaHondo, 1) +
    forma(elipse(PX + PW - 11.4, PY + PH - 8, 1.8, 1.8), C.hueso) + forma(elipse(PX + PW - 5.4, PY + PH - 8, 1.8, 1.8), C.hueso)
  );
}

/** El cuerpo: el tronco flaco de galgo, el cogote estirado, las dos patas de cerca y el hueco del pecho con la radio. */
function elCuerpo(): string {
  const tronco = curva([[-58, -104], [-46, -119], [-16, -120], [14, -118], [36, -126], [52, -114], [53, -95], [36, -80], [8, -80], [-16, -89], [-38, -83], [-55, -91]]);
  const cogote = curva([[28, -120], [40, -146], [50, -168], [70, -160], [63, -140], [56, -112], [42, -104]]);
  const rnd = azar(347);
  let pelos = '';
  for (let i = 0; i < 20; i++) pelos += trazo(`M${f(-50 + rnd() * 96)} ${f(-118 + rnd() * 5)} l${f(-3 + rnd() * 2)} ${f(-3 - rnd() * 2)}`, C.paja, 0.9, 0.55);
  // Las calvas de polilla: está viejo.
  const calvas = [[-34, -104, 5], [26, -92, 4], [46, -128, 3.4]].map(([x, y, r]) => nube(x!, y!, r!, r! * 0.7, C.hueso, 'xs', 0.28)).join('');
  return conGrano(
    pataParada('m-nolate-pc', 34, false, true) +
    enmascarado('m-nolate-cogote', cogote, forma(cogote, C.pelo) + nube(44, -150, 6, 24, C.peloClaro, 's', 0.8, -22) + nube(62, -138, 5, 24, C.peloHondo, 's', 0.8, -22)) +
    enmascarado('m-nolate-tronco', tronco,
      forma(tronco, C.pelo) + nube(-4, -119, 60, 7, C.peloClaro, 's', 0.95) + nube(-2, -80, 60, 8, C.peloHondo, 's', 0.95) + nube(-52, -98, 8, 12, C.peloHondo, 's', 0.6) + nube(40, -122, 12, 5, C.paja, 's', 0.45) + calvas) +
    pelos +
    // El canto de luz del lomo: lo despega de lo oscuro.
    trazo('M-46 -119.4 Q-16 -121.6 14 -118.8 Q26 -121 36 -126.4', C.paja, 1.2, 0.75) +
    // La costura larga de la panza, y la que le cruza el cogote.
    costura('M-50 -88 Q-38 -81 -16 -87 Q8 -78 34 -79 Q46 -82 52 -94') + costura('M40 -138 q10 -6 22 -1', C.hueso, 0.7) +
    // El hueco del pecho, con la radio, y el marco cosido de la puertita.
    forma(cajaRedonda(PX - 1, PY - 1, PW + 2, PH + 2, 2), C.negro) + costura(`M${PX - 3} ${PY - 3} h${PW + 6} v${PH + 6} h${-PW - 6} Z`, C.hueso, 0.9),
  );
}

/** La paja del relleno, que se le sale por la costura de la cintura todo alrededor: le hace el tutú. */
function laPaja(): string {
  const [cx, cy] = A.cintura;
  const rnd = azar(349);
  let s = '';
  for (let i = 0; i < 46; i++) {
    const arriba = i % 2 === 0;
    const x = cx - 7 + rnd() * 14;
    const largo = 14 + rnd() * 18;
    const cae = -9 + rnd() * 18;
    const y0 = arriba ? cy - 20 + rnd() * 4 : cy + 9 + rnd() * 4;
    s += trazo(`M${f(x)} ${f(y0)} l${f(cae)} ${f(arriba ? -largo : largo * 0.8)}`, i % 3 ? C.paja : C.pajaHonda, 1 + rnd() * 0.9, 0.8 + rnd() * 0.2);
  }
  return conGrano(
    hoja(cx - 26, cy - 58, 52, 100) + s +
    // La costura abierta, de arriba a abajo, con dos puntadas que aguantaron.
    forma(curva([[cx - 3, cy - 21], [cx + 3, cy - 21], [cx + 4.4, cy], [cx + 2, cy + 12], [cx - 2, cy + 12], [cx - 4.4, cy]]), C.negro) +
    trazo(`M${cx - 6} ${cy - 10} h12 M${cx - 6} ${cy + 3} h12`, C.hueso, 1.3, 0.9),
  );
}

/** La puertita: el cuero del pecho, cosido alrededor, con sus dos bisagras a la izquierda y el pasador a la derecha. */
function laPuerta(): string {
  const d = cajaRedonda(PX, PY, PW, PH, 2);
  return conGrano(
    enmascarado('m-nolate-puerta', d, forma(d, C.pelo) + nube(PX + PW / 2, PY + 2, PW / 2, 5, C.peloClaro, 's', 0.9) + nube(PX + PW / 2, PY + PH, PW / 2, 6, C.peloHondo, 's', 0.8)) +
    trazo(d, C.peloHondo, 1.2, 0.9) + costura(cajaRedonda(PX + 3, PY + 3, PW - 6, PH - 6, 1.5), C.hueso, 0.75) +
    forma(caja(PX - 1.5, PY + 4, 5, 5), C.pajaHonda) + forma(caja(PX - 1.5, PY + PH - 9, 5, 5), C.pajaHonda) +
    forma(elipse(PX + PW - 4.4, PY + PH / 2, 2.6, 2.6), C.pajaHonda) + forma(elipse(PX + PW - 5, PY + PH / 2 - 0.6, 1, 1), C.paja),
  );
}

/** El revés de la puertita, que se ve cuando está abierta: forrado de arpillera, con la paja pegada. Va dibujado dado vuelta, del otro lado de la bisagra. */
function elReves(): string {
  const d = cajaRedonda(PX - PW, PY, PW, PH, 2);
  const rnd = azar(353);
  let briznas = '';
  for (let i = 0; i < 12; i++) briznas += trazo(`M${f(PX - PW + 4 + rnd() * (PW - 8))} ${f(PY + 4 + rnd() * (PH - 8))} l${f(-4 + rnd() * 8)} ${f(-4 + rnd() * 8)}`, C.paja, 1, 0.9);
  return conGrano(forma(d, C.madera) + nube(PX - PW / 2, PY + PH / 2, PW / 2 - 3, PH / 2 - 3, C.pajaHonda, 's', 0.7) + briznas + trazo(d, C.hueso, 1.3, 0.9) +
    forma(caja(PX - 3.5, PY + 4, 5, 5), C.pajaHonda) + forma(caja(PX - 3.5, PY + PH - 9, 5, 5), C.pajaHonda));
}

/** La antena telescópica, dibujada estirada: tres tramos y la bolita. La isla la achica desde la base. */
function laAntena(): string {
  const [ax, ay] = A.antena.base;
  const L = A.antena.largo;
  return (
    trazo(`M${ax} ${ay} V${ay - L * 0.4}`, C.gris, 3) + trazo(`M${ax} ${ay - L * 0.4} V${ay - L * 0.72}`, C.gris, 2.2) + trazo(`M${ax} ${ay - L * 0.72} V${ay - L + 3}`, C.hueso, 1.4) +
    trazo(`M${ax - 0.6} ${ay - 2} V${ay - L * 0.4}`, C.hueso, 0.8, 0.8) + forma(elipse(ax, ay - L + 2.4, 2.6, 2.6), C.hueso)
  );
}

const [EX, EY] = A.ojo.centro;
const ER = A.ojo.radio;

/**
 * La cabeza, de taxidermia trucha: el hocico largo y seco, para arriba; el belfo cosido en cruz, con una puntada que
 * tira y deja un colmillo a la vista; una oreja parada y la otra caída; la cornamenta chica; y los ojos desparejos. El
 * de este lado es la cuenca (el de vidrio verde va aparte, y se le cae); el otro, ámbar y más chico, quedó mal puesto,
 * arriba del hocico, con su cerco de puntadas.
 */
function laCabeza(): string {
  const d = curva([[50, -174], [56, -187], [70, -190], [84, -183], [100, -181.4], [114, -178], [119.4, -173.4], [114, -168.6], [100, -166], [84, -163.4], [68, -157], [54, -161]]);
  // Un asta chica: el tallo, que se abre para su lado, y una sola punta.
  const asta = (x: number, y: number, k: number): string =>
    trazo(`M${x} ${y} q${f(-2 * k)} -9 ${f(-9 * k)} -17 M${f(x - 3.4 * k)} ${y - 9} q${f(1 * k)} -5 ${f(5 * k)} -9`, C.hueso, 3) + trazo(`M${x} ${y - 1} q${f(-2 * k)} -8 ${f(-8 * k)} -15`, C.gris, 0.8, 0.6);
  // El ojo mal puesto: ámbar, chico, de vidrio duro, con el reflejo cortado a cuchillo.
  const [mx, my, mr] = [95, -179, 4.4];
  const malPuesto =
    forma(elipse(mx, my, mr + 2.2, mr + 2.2), C.peloHondo) + trazo(elipse(mx, my, mr + 1.1, mr + 1.1), C.hueso, 1.1) + forma(elipse(mx, my, mr, mr), C.naranjaHondo) + forma(elipse(mx, my, mr - 0.9, mr - 0.9), C.pajaHonda) + forma(elipse(mx + 1.1, my - 0.4, 1.5, 1.9), C.negro) +
    forma(poli([[mx - 3.2, my - 0.4], [mx - 0.8, my - 3.4], [mx - 0.2, my - 1]]), C.hueso) +
    [0, 1, 2, 3, 4, 5].map((i) => { const a = (i / 6) * Math.PI * 2 + 0.4; return trazo(`M${f(mx + Math.cos(a) * (mr + 1.8))} ${f(my + Math.sin(a) * (mr + 1.8))} l${f(Math.cos(a) * 2.8)} ${f(Math.sin(a) * 2.8)}`, C.hueso, 0.8, 0.9); }).join('');
  return conGrano(
    // La cornamenta chica, de dos puntas, y la oreja de lejos, parada.
    asta(59, -186, 1) + asta(69, -188, -1) +
    forma(curva([[48, -180], [40, -194], [46, -198], [56, -186]]), C.peloHondo) +
    enmascarado('m-nolate-cabeza', d,
      forma(d, C.pelo) + nube(76, -188, 26, 5, C.peloClaro, 's', 0.95) + nube(84, -160, 30, 5, C.peloHondo, 's', 0.9) + nube(110, -176, 9, 6, C.peloClaro, 's', 0.5) + nube(EX, EY, 9, 8, C.peloHondo, 's', 0.7) +
      // La quijada, chupada: el cuero se secó sobre el hueso.
      nube(92, -168, 12, 2.6, C.peloHondo, 'xs', 0.7)) +
    trazo('M56 -187.4 Q70 -191 84 -183.4 L100 -181.8 L113 -178.6', C.paja, 1.1, 0.7) + trazo('M88 -176 q8 2.4 16 1.4', C.peloHondo, 0.8, 0.7) +
    // La oreja de cerca, caída: se le venció el alambre.
    forma(curva([[51, -179], [43, -173], [38.6, -162], [44, -159.4], [51.4, -167], [56.4, -176]]), C.pelo) + trazo('M52 -176 q-7 6 -9 14', C.peloHondo, 1, 0.8) + trazo('M40.4 -161.4 l-2.6 2.6', C.gris, 0.8) +
    // La nariz, seca.
    forma(elipse(117.6, -173.6, 3.2, 2.8), C.negro) + forma(poli([[115.6, -174.6], [117, -175.4], [116.6, -173.8]]), C.gris) +
    // El belfo, cosido en cruz. La tercera puntada tira para arriba y deja un colmillo a la vista.
    trazo('M116 -169.4 Q108 -167.4 101 -168.4 Q98 -170.6 95 -166.4 Q90 -165.4 82 -164.4', C.peloHondo, 1.2, 0.95) +
    forma(poli([[96.4, -168.6], [98.6, -168.8], [97.8, -164.6]]), C.hueso) +
    [[86, -164.8], [91, -165.4], [98.2, -170], [105, -167.8], [111, -168.4]].map(([x, y], i) => trazo(`M${x! - 1.6} ${y! - 1.8} l3.2 3.6 M${x! + 1.6} ${y! - 1.8} l-3.2 3.6`, C.hueso, i === 2 ? 1.2 : 0.9, 0.95)).join('') +
    trazo('M98.2 -171.8 l-0.6 -3 M96.4 -171.4 l-2 -2 M100 -171.4 l1.6 -2.2', C.peloHondo, 0.7, 0.8) +
    malPuesto +
    // La cuenca: lo que queda cuando el ojo se cae. Negra, con dos briznas de paja.
    forma(elipse(EX, EY, ER + 1.5, ER + 1.5), C.peloHondo) + forma(elipse(EX, EY, ER, ER), C.negro) + trazo(`M${EX - 1.6} ${EY + 1} l-2.4 -4 M${EX + 1} ${EY + 1.6} l3 -3.4`, C.pajaHonda, 0.9, 0.9),
  );
}

/** El ojo de vidrio de este lado: verde, duro, con el reflejo cortado a cuchillo. Es más grande que el otro, y se le cae. */
function elOjo(): string {
  return (
    forma(elipse(EX, EY, ER, ER), C.vidrioHondo) + forma(elipse(EX, EY, ER - 0.9, ER - 0.9), C.vidrio) +
    // La pupila, corrida: mira para otro lado.
    forma(elipse(EX - 1, EY + 0.6, 1.5, 2.2), C.negro) +
    // El reflejo: una cuña de canto duro, y el filo del vidrio.
    forma(poli([[EX + 0.4, EY - 3.6], [EX + 3.4, EY - 1.6], [EX + 1, EY - 1]]), C.hueso) + trazo(`M${EX - 3.2} ${EY + 2.4} A${ER - 1} ${ER - 1} 0 0 0 ${EX + 1.6} ${EY + 3.5}`, C.hueso, 0.7, 0.8)
  );
}

/** El flequillo: un mechón largo que le cae para adelante, y que el viento sopla. */
function elFlequillo(): string {
  const [fx, fy] = A.flequillo;
  const d = curva([[fx - 6, fy + 3], [fx - 4, fy - 4], [fx + 4, fy - 9], [fx + 13, fy - 8], [fx + 19, fy - 2], [fx + 17, fy + 5], [fx + 13, fy + 1], [fx + 12, fy + 6], [fx + 7, fy + 1], [fx + 2, fy + 4]]);
  return conGrano(forma(d, C.peloClaro) + trazo(`M${fx - 2} ${fy} q6 -7 16 -3 M${fx} ${fy + 2} q5 -4 11 -1`, C.paja, 0.9, 0.85));
}

/** La etiqueta de museo, colgada de la oreja con un piolín: nadie supo qué es. */
function laEtiqueta(): string {
  const [ex, ey] = A.etiqueta;
  const d = poli([[ex - 12, ey + 14], [ex - 8, ey + 10], [ex, ey + 10], [ex, ey + 30], [ex - 16, ey + 30], [ex - 16, ey + 14]]);
  return (
    trazo(`M${ex} ${ey} Q${ex - 4} ${ey + 6} ${ex - 9} ${ey + 13}`, C.hueso, 0.9, 0.9) +
    conGrano(forma(d, C.hueso) + forma(elipse(ex - 9.6, ey + 14.4, 1.3, 1.3), C.peloHondo) +
      // El signo de pregunta, a pluma.
      trazo(`M${ex - 11} ${ey + 19} q3 -4 6 -1 q1.4 2.6 -2.8 5 v1.6`, C.maderaHonda, 1.5) + forma(elipse(ex - 7.8, ey + 27.4, 1, 1), C.maderaHonda))
  );
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 2.6;
const [AX, AY] = A.antena.base;

export const PIEZAS_NOLATE: readonly Pieza[] = [
  { nombre: 'nolate-nube', caja: [NX - 100, NY - 44, 200, 88], dibujo: laNube(), densidad: 1.8 },
  { nombre: 'nolate-lluvia', caja: [-80, A.nube.panza - A.tramo, 170, -A.nube.panza + A.tramo], dibujo: laLluvia(), densidad: 1.8 },
  { nombre: 'nolate-chispa', caja: [NX - 16, A.nube.panza - 10, 50, 30], dibujo: laChispa(), densidad: D },
  { nombre: 'nolate-rayo', caja: [AX - 16, A.nube.panza - 4, 60, AY - A.antena.largo - A.nube.panza + 18], dibujo: elRayo(), densidad: D },
  { nombre: 'nolate-piso', caja: [-130, -240, 260, 262], dibujo: elPiso(), densidad: 1.4 },
  { nombre: 'nolate-peana', caja: [A.peana.desde - 4, -88, A.peana.hasta - A.peana.desde + 8, 84], dibujo: laPeana(), densidad: D },
  { nombre: 'nolate-rueda', caja: [-7, -7, 14, 14], dibujo: laRueda(), densidad: D * 2 },
  { nombre: 'nolate-patas', caja: [-60, -102, 46, 86], dibujo: patasLejos(), densidad: D },
  { nombre: 'nolate-pata', caja: [A.hombro[0] - 10, A.hombro[1] - 12, 58, 54], dibujo: pataEnAlto(), densidad: D },
  { nombre: 'nolate-cola', caja: [A.cola[0] - 24, A.cola[1] - 60, 32, 68], dibujo: laCola(), densidad: D },
  { nombre: 'nolate-cuerpo', caja: [-64, -174, 142, 160], dibujo: elCuerpo(), densidad: D },
  { nombre: 'nolate-radio', caja: [PX, PY, PW, PH], dibujo: laRadio(), densidad: D * 1.6 },
  { nombre: 'nolate-paja', caja: [A.cintura[0] - 26, A.cintura[1] - 58, 52, 100], dibujo: laPaja(), densidad: D },
  { nombre: 'nolate-puerta', caja: [PX - 4, PY - 3, PW + 8, PH + 6], dibujo: laPuerta(), densidad: D * 1.4 },
  { nombre: 'nolate-reves', caja: [PX - PW - 3, PY - 3, PW + 8, PH + 6], dibujo: elReves(), densidad: D * 1.4 },
  { nombre: 'nolate-antena', caja: [AX - 5, AY - A.antena.largo - 2, 10, A.antena.largo + 4], dibujo: laAntena(), densidad: D * 1.4 },
  { nombre: 'nolate-cabeza', caja: [34, -212, 92, 62], dibujo: laCabeza(), densidad: D * 1.4 },
  { nombre: 'nolate-ojo', caja: [EX - ER - 2, EY - ER - 2, ER * 2 + 4, ER * 2 + 4], dibujo: elOjo(), densidad: D * 2.4 },
  { nombre: 'nolate-flequillo', caja: [A.flequillo[0] - 9, A.flequillo[1] - 13, 32, 24], dibujo: elFlequillo(), densidad: D * 1.6 },
  { nombre: 'nolate-etiqueta', caja: [A.etiqueta[0] - 20, A.etiqueta[1] - 2, 24, 36], dibujo: laEtiqueta(), densidad: D * 1.8 },
];

const img = imagenesDe(PIEZAS_NOLATE);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** La nube, con las marcas de un momento: va atrás, en su propia capa. */
function nubeArmada(m: Momento): string {
  const { transform: t } = marcas(m);
  return parte('nube', img('nolate-nube'), t.nube);
}

/** El bicho armado con las marcas de un momento. `seco` es el `id` del recorte de la lluvia. */
function armado(m: Momento, seco: string): string {
  const { transform: t, opacity: o } = marcas(m);
  const techo = A.nube.panza + 6;
  return (
    img('nolate-piso') +
    // La lluvia cae de la panza de la nube a la peana, y de ahí no pasa.
    `<clipPath id="${seco}"><rect x="-90" y="${techo}" width="190" height="${-techo - 8}"/></clipPath>` +
    `<g clip-path="url(#${seco})">${parte('lluvia', img('nolate-lluvia'), t.lluvia, o.lluvia)}</g>` +
    parte('chispa', img('nolate-chispa'), '', o.chispa) +
    parte('carro',
      img('nolate-peana') +
      ([1, 2] as const).map((n) => parte(`rueda-${n}`, img('nolate-rueda'), t[`rueda-${n}`])).join('') +
      parte('bicho',
        parte('cola', img('nolate-cola'), t.cola) +
        parte('patas', img('nolate-patas'), t.patas) +
        parte('pata', img('nolate-pata'), t.pata) +
        img('nolate-cuerpo') +
        parte('radio', img('nolate-radio'), t.radio) +
        parte('puerta', img('nolate-puerta'), t.puerta, o.puerta) +
        parte('paja', img('nolate-paja'), t.paja) +
        parte('reves', img('nolate-reves'), t.reves, o.reves) +
        parte('antena', img('nolate-antena'), t.antena) +
        parte('etiqueta', img('nolate-etiqueta'), t.etiqueta) +
        img('nolate-cabeza') +
        parte('ojo', img('nolate-ojo'), t.ojo) +
        parte('flequillo', img('nolate-flequillo'), t.flequillo),
        t.bicho),
      t.carro) +
    parte('rayo', img('nolate-rayo'), '', o.rayo)
  );
}

/** El bicho en un momento, con su nube, sin lo que lo hace tocable: para el test, el retrato y para mirarlo. */
export function nolateEn(m: Momento = QUIETO, seco = 'nolate-seco'): string {
  const entero = marcas(m).transform.entero;
  return `<g transform="${entero}">${nubeArmada(m)}</g><g transform="${entero}">${armado(m, seco)}</g>`;
}

/** La nube, atrás de todo: no se toca. */
function atras(): string {
  return `<g transform="${marcas(QUIETO).transform.entero}" pointer-events="none">${nubeArmada(QUIETO)}</g>`;
}

/** El títere que se toca, en la pose quieta: tieso en su peana, bajo la lluvia, con la puertita entornada. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--nolate" data-id="${ID}" role="button" tabindex="0" aria-label="${nombres.get(ID) ?? 'El animal que no late'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO, 'nolate-seco')}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: la puertita abierta, la radio sonando, el rayo en la antena y el bicho en medio compás. */
export const RETRATO = { caja: [NOLATE.x - 82, NOLATE.piso - 196, 164, 208] as const };
function retrato(): string {
  return `<image href="/bestiario/monte-lejos.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>` + nolateEn(SUENA, 'nolate-seco-retrato');
}

export const NOLATE_PERSONAJE: Personaje = {
  id: ID,
  region: 'el-monte',
  ancla: NOLATE.x,
  piezas: PIEZAS_NOLATE,
  capas: { atras, figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
