/**
 * Los nenes de oro (`D-73`, vigesimonovena vuelta, `T-529`), en su podio, a la derecha de Pierre, con el agua al tobillo.
 *
 * *"Cuando la marea los quiere tapar en el corazón de la noche, pagan con promesas los nenes de oro"* es de
 * *Nuotatori professionisti*, en *Luzbelito* (1996). Se toma al pie de la letra: *"varoncitos de oro"*, *"sanos, muy
 * fuertes y azucarados"*, son de oro de verdad. Son dos **trofeos de natación**, de los de vitrina de club: tiesos,
 * con los brazos arriba, gorra, antiparras y la mueca fundida (*"cómo brillan sus muecas festivas"*), cada uno en su
 * pedestal, arriba de un podio de mármol trucho que tiene dos primeros puestos (*"retiran mientras van ganando"*).
 * *"La marea los quiere tapar"*: el agua sube por el podio y tapa la plaquita. *"Pagan con promesas"*: cada uno
 * suelta un pagaré firmado, doblado en barquito, y la marea baja. *"Pepsi inyectable (dame más, dame más)"* es el
 * suero que tienen colgado entre los dos, con una botella de gaseosa sin marca y una manguera de goma a la aguja de cada uno. *"Adidas digitales"* son las tiras de
 * la malla, que son dos y no tres. Y como el tema se llama *nadadores profesionales*, cuando los tocan se tiran: un
 * clavado para cada lado, y quedan clavados de cabeza, tiesos, con las piernas de oro afuera del agua.
 *
 * De la letra son los nenes de oro, la marea, las promesas, las muecas que brillan, la gaseosa inyectable y que nadan.
 * Del dibujo son que sean trofeos, el podio con dos unos, el barquito de papel y que vuelvan trepando por atrás.
 *
 * Visten *Luzbelito*, medido con sharp: el oro es el del marco ovalado de la tapa; el podio y los pedestales, su
 * mármol verde; los pagarés, la cera de la vela de la contratapa, y el sello, el rojo del candelabro. La espuma es la
 * luz del bajo.
 *
 * Coordenadas: el (0, 0) es la línea del agua al medio del podio (`rig-nenes.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { caja, cajaRedonda, conGrano, curva, elipse, f, poli } from './trazos.ts';
import { CLAVADO, NENES, NENES_ARMADO as A, QUIETO, marcas, type Momento } from './rig-nenes.ts';

const ID = 'los-nenes-de-oro';

/** Las tintas de *Luzbelito* (`tokens.css`), y la luz del bajo para la espuma. */
const C = {
  oro: 'var(--bestia-nenes-oro)',
  oroClaro: 'var(--bestia-nenes-oro-claro)',
  oroSombra: 'var(--bestia-nenes-oro-sombra)',
  oroHondo: 'var(--bestia-nenes-oro-hondo)',
  cobre: 'var(--bestia-nenes-cobre)',
  marmol: 'var(--bestia-nenes-marmol)',
  marmolClaro: 'var(--bestia-nenes-marmol-claro)',
  marmolHondo: 'var(--bestia-nenes-marmol-hondo)',
  negro: 'var(--bestia-nenes-negro)',
  papel: 'var(--bestia-nenes-papel)',
  papelSombra: 'var(--bestia-nenes-papel-sombra)',
  lacre: 'var(--bestia-nenes-lacre)',
  gaseosa: 'var(--bestia-nenes-gaseosa)',
  vidrio: 'var(--bestia-nenes-vidrio)',
  espuma: 'var(--entorno-bajo-celeste)',
  agua: 'var(--entorno-bajo-agua)',
};

/** Un azar con semilla, para que las vetas del mármol caigan siempre igual. */
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
   El trofeo: dibujado una vez, con los pies en el (0, 0) y mirando a la derecha
   ------------------------------------------------------------------ */

/**
 * El cuerpo, de perfil, tieso: un trofeo de nadador. Las piernas juntas en punta, con los gemelos marcados; la malla con
 * sus dos tiras; el pecho afuera; la gorra de natación con las antiparras subidas; y la mueca festiva, fundida: una
 * sonrisa fija de metal, con todos los dientes. El brillo es duro, de canto vivo: es metal, no tiene halo.
 */
function elCuerpo(): string {
  const d = curva([
    [-4, 0], [9, 0], [10, -2.6], [3, -5], [5.4, -14], [3.6, -24], [6, -36], [7.4, -48], [6.4, -56], [9.6, -64], [7, -70.5], [3, -72.5],
    [-3, -72.5], [-6, -68], [-6.8, -58], [-5, -51], [-8.4, -44], [-6.4, -34], [-3.4, -25], [-7.6, -16], [-5.6, -9], [-3.2, -5],
  ]);
  const cabeza = curva([[-6, -80], [-5, -87.4], [0, -91.4], [6, -91], [10.4, -86.6], [11, -82.4], [13.6, -80.2], [11.6, -78.2], [11.8, -74.2], [7, -71.4], [0, -71.6], [-4.6, -75]]);
  const [ax, ay] = A.aguja;
  return conGrano(
    // La base del trofeo, fundida con los pies.
    forma(cajaRedonda(-9, -1, 21, 4.4, 1.6), C.oroHondo) + trazo('M-8 -0.4 h19', C.oroClaro, 0.8, 0.8) +
    enmascarado('m-nenes-cuerpo', d,
      forma(d, C.oro) +
      // La sombra del lomo y el brillo del frente: dos franjas de canto duro.
      forma(poli([[-10, -73], [-3.4, -73], [-2.6, -58], [-1, -50], [-3.8, -44], [-2, -34], [0.4, -25], [-2.8, -16], [-1, -6], [-1, 1], [-10, 1]]), C.oroSombra, 0.5) +
      forma(poli([[5.4, -62], [7.8, -64.4], [5.8, -56], [6.4, -48], [5, -36], [2.8, -25], [4.2, -14], [2.8, -6], [1.6, -6], [2.8, -14], [1.4, -25], [3.6, -36], [4.8, -48], [4.2, -56]]), C.oroClaro) +
      // La malla, con sus dos tiras al costado.
      forma(caja(-10, -53, 20, 11), C.oroHondo) + trazo('M1 -53 v11 M4 -53 v11', C.oroClaro, 1.2, 0.95) +
      // El óxido picado del marco.
      forma(elipse(-2, -18, 1.4, 2), C.oroHondo, 0.6) + forma(elipse(1.6, -66, 1.3, 1.3), C.oroHondo, 0.55) + forma(elipse(3, -30, 1, 1.4), C.oroHondo, 0.5)) +
    // Los gemelos, las rodillas y los tobillos, marcados: son de molde.
    trazo('M-7 -17.4 q3.4 3.6 1.8 9.4 M-3.2 -24.8 q3.6 1.6 6.6 0 M-3 -5.6 q3 1.2 6 0 M-1 -60 q4 2.4 7.6 0.4', C.oroSombra, 0.8, 0.85) +
    // La aguja del suero, con su cinta, atrás del hombro.
    forma(caja(ax - 2.6, ay - 2.4, 5.2, 4.6), C.papel) + trazo(`M${ax - 2.6} ${ay - 0.2} h5.2`, C.papelSombra, 0.6, 0.9) +
    enmascarado('m-nenes-cabeza', cabeza,
      forma(cabeza, C.oro) + forma(poli([[-7, -92], [-2.6, -92], [-1.6, -80], [-3, -71], [-7, -71]]), C.oroSombra, 0.5) +
      // La gorra de natación: lisa, le tapa hasta la oreja.
      forma(curva([[-6.6, -81], [-5.2, -88], [0, -92.4], [6.6, -91.8], [11.2, -86.2], [8, -84.4], [2, -84.2], [-1.6, -80.6], [-4, -76.6]]), C.oroHondo) +
      forma(poli([[-0.6, -90.6], [3.6, -91], [1.6, -88.6], [-1.6, -88]]), C.oroClaro, 0.9)) +
    trazo('M10.6 -85.8 Q5 -83.6 2 -84 Q-1.4 -81 -3.8 -76.8', C.oroSombra, 0.8, 0.9) +
    // Las antiparras, subidas a la gorra: el lente con su reflejo de canto duro, y el elástico que da la vuelta.
    forma(elipse(7, -88.8, 3.1, 2.1), C.oroSombra) + forma(poli([[5.2, -89.6], [7.6, -90.2], [6.2, -88.6]]), C.oroClaro) + trazo('M4 -89 L-5.4 -86.4', C.oroSombra, 1.2) +
    // El ojo, una raja en el metal, con la ceja.
    trazo('M6.6 -81.4 h3.8', C.oroSombra, 1.2) + trazo('M6 -83.2 q2.4 -1 4.6 0', C.oroSombra, 0.7, 0.9) +
    // La mueca festiva: la sonrisa fija, de oreja a oreja, con todos los dientes.
    forma(poli([[4.6, -78.2], [12, -77.6], [11.2, -73.8], [5.8, -74.2]]), C.oroSombra) +
    [5.6, 7.1, 8.6, 10.1].map((x) => forma(caja(x, -77.6, 1.1, 2.9), C.papel)).join('') +
    trazo('M4.6 -78.2 q-1.6 1.6 -0.8 4', C.oroSombra, 0.7, 0.9),
  );
}

/**
 * Los brazos, en flecha arriba de la cabeza: se ven los dos (el de lejos asoma atrás, más oscuro) y las dos manos,
 * juntas, palma con palma, con los dedos marcados. Giran de los hombros.
 */
function losBrazos(): string {
  const lejos = curva([[-7.6, -66], [-3, -66], [-1.8, -86], [0.2, -100], [0.6, -104], [-3, -104.4], [-4.4, -98], [-6.8, -86]]);
  const cerca = curva([[-5, -65], [1.6, -65], [2.6, -84], [4.4, -98], [5.2, -104], [1.4, -104.4], [-0.4, -98], [-3.6, -84]]);
  const manoLejos = poli([[-3, -104], [0.8, -104], [1.4, -112], [0.2, -116.8], [-1.8, -115.4], [-3, -110]]);
  const manoCerca = poli([[1.2, -103.6], [5.4, -103.6], [6.6, -109.6], [5, -115.4], [3.2, -117], [1.6, -113], [0.8, -108]]);
  return conGrano(
    forma(lejos, C.oroHondo) + forma(manoLejos, C.oroHondo) + trazo('M-1.6 -114 v-6 M-0.2 -113.4 v-6', C.oroSombra, 0.5, 0.9) +
    enmascarado('m-nenes-brazos', cerca, forma(cerca, C.oro) + forma(poli([[-6, -64], [-2, -64], [-1.2, -84], [0.6, -98], [-1, -105], [-5, -86]]), C.oroSombra, 0.5) + forma(poli([[0.8, -68], [1.8, -68], [2.8, -84], [4.4, -97], [3.4, -97], [1.8, -84]]), C.oroClaro)) +
    // La muñeca, y la mano de cerca: los cuatro dedos juntos y el pulgar.
    trazo('M1 -103.6 h4.6', C.oroSombra, 0.9, 0.9) +
    forma(manoCerca, C.oro) + trazo(manoCerca, C.oroSombra, 0.6, 0.9) + trazo('M2.6 -105 L3 -115.6 M4 -105 L4.2 -114.6', C.oroSombra, 0.5, 0.9) + forma(poli([[5.6, -104.6], [7.6, -106.4], [7, -109.4], [5.8, -108.4]]), C.oro) +
    forma(poli([[2.2, -104.6], [3, -104.6], [3.4, -112], [2.6, -112]]), C.oroClaro, 0.9) +
    // El codo.
    trazo('M-3.2 -84 q3 1.2 5.6 0', C.oroSombra, 0.7, 0.8),
  );
}

/** El destello: una raya de luz de canto vivo que le cruza el cuerpo, y una estrella en el hombro. Tinta plana, sin halo. */
function elBrillo(): string {
  const d = 'M10 -72 l1.8 8 l8 1.8 l-8 1.8 l-1.8 8 l-1.8 -8 l-8 -1.8 l8 -1.8 Z';
  return forma(poli([[6.6, -58], [8.4, -58], [4.4, -12], [2.6, -12]]), C.papel, 0.85) + forma(poli([[2, -46], [3, -46], [0.4, -20], [-0.6, -20]]), C.papel, 0.7) + forma(d, C.papel) + forma('M15 -50 l0.8 3.4 l3.4 0.8 l-3.4 0.8 l-0.8 3.4 l-0.8 -3.4 l-3.4 -0.8 l3.4 -0.8 Z', C.papel);
}

/* ------------------------------------------------------------------
   El podio, los pedestales y el suero
   ------------------------------------------------------------------ */

/** Un uno de podio, de oro incrustado. */
const uno = (x: number, y: number): string => trazo(`M${x - 5} ${y - 10} l6 -6 v24 M${x - 5} ${y + 8} h12`, C.oro, 3.4) + trazo(`M${x + 0.2} ${y - 13} v19`, C.oroClaro, 0.9, 0.9);

/** El podio de mármol trucho: un solo escalón, con dos primeros puestos, la plaquita en el medio y los dos pedestales arriba. */
function elPodio(): string {
  const { desde, hasta, tapa } = A.podio;
  const [px, py, pw, ph] = A.placa;
  const bloque = caja(desde, tapa, hasta - desde, 96);
  const rnd = azar(431);
  let vetas = '';
  for (let i = 0; i < 12; i++) {
    const x = desde + rnd() * (hasta - desde - 30);
    const y = tapa + 6 + rnd() * 70;
    vetas += trazo(`M${f(x)} ${f(y)} q${f(8 + rnd() * 10)} ${f(-6 + rnd() * 12)} ${f(20 + rnd() * 16)} ${f(-4 + rnd() * 8)}`, i % 3 ? C.marmolClaro : C.marmolHondo, 0.7 + rnd() * 0.9, 0.35 + rnd() * 0.35);
  }
  const pedestal = (x: number): string => {
    const d = caja(x - 14, A.pisan + 4, 28, tapa - A.pisan - 4);
    return (
      enmascarado(`m-nenes-pedestal-${x > 0 ? 'b' : 'a'}`, d, forma(d, C.marmolHondo) + nube(x - 8, A.pisan + 14, 5, 14, C.marmol, 's', 0.9) + trazo(`M${x - 12} ${A.pisan + 12} q8 4 22 -1`, C.marmolClaro, 0.7, 0.5)) +
      forma(cajaRedonda(x - 17, A.pisan, 34, 5, 1.2), C.marmol) + trazo(`M${x - 16} ${A.pisan + 0.7} h32`, C.marmolClaro, 1, 0.9) +
      // La chapita del pedestal.
      forma(caja(x - 7, A.pisan + 9, 14, 6), C.cobre) + trazo(`M${x - 5} ${A.pisan + 11} h10 M${x - 5} ${A.pisan + 13} h6`, C.oroSombra, 0.7, 0.9)
    );
  };
  return conGrano(
    pedestal(-A.pedestal) + pedestal(A.pedestal) +
    enmascarado('m-nenes-podio', bloque,
      forma(bloque, C.marmol) + nube(0, tapa + 80, 80, 40, C.marmolHondo, 'm', 0.95) + nube(desde + 4, tapa + 30, 6, 60, C.marmolHondo, 's', 0.7) + nube(hasta - 4, tapa + 30, 6, 60, C.marmolHondo, 's', 0.8) + nube(-10, tapa + 6, 50, 5, C.marmolClaro, 's', 0.35) + vetas) +
    // La tapa del escalón, con su canto claro.
    forma(cajaRedonda(desde - 3, tapa - 1, hasta - desde + 6, 5.4, 1.4), C.marmol) + trazo(`M${desde - 2} ${tapa - 0.2} H${hasta + 2}`, C.marmolClaro, 1.1, 0.95) + nube(0, tapa + 6, 70, 2, C.negro, 'xs', 0.6) +
    // Dos primeros puestos: retiran mientras van ganando.
    uno(-A.pedestal - 2, tapa + 24) + uno(A.pedestal + 6, tapa + 24) +
    // La plaquita de bronce: lo que la marea viene a tapar.
    forma(cajaRedonda(px, py, pw, ph, 1.4), C.cobre) + nube(px + pw / 2, py + 3, pw / 2, 3, C.oroClaro, 'xs', 0.6) + trazo(cajaRedonda(px, py, pw, ph, 1.4), C.oroSombra, 0.9) +
    trazo(`M${px + 5} ${py + 6} h${pw - 10} M${px + 5} ${py + 10} h${pw - 16} M${px + 5} ${py + 14} h${pw - 12}`, C.oroSombra, 1, 0.9) +
    forma(elipse(px + 3, py + 3, 0.9, 0.9), C.oroSombra) + forma(elipse(px + pw - 3, py + 3, 0.9, 0.9), C.oroSombra),
  );
}

/** El palo del suero, con su gancho. La botella y las dos mangueras van aparte. */
function elSuero(): string {
  const [sx, sy] = A.suero;
  const tapa = A.podio.tapa;
  return (
    trazo(`M${sx} ${tapa} V${sy}`, C.negro, 3.4) + trazo(`M${sx - 0.8} ${tapa} V${sy}`, C.papelSombra, 0.8, 0.7) +
    // El gancho de arriba y la base.
    trazo(`M${sx - 9} ${sy + 3} q0 -6 9 -6 q9 0 9 6`, C.negro, 2.4) + forma(cajaRedonda(sx - 9, tapa - 4, 18, 4, 1.2), C.negro)
  );
}

/**
 * Una manguera del suero, de goma, dibujada acostada del (0, 0) para la derecha, con su panza. La isla la pone en el
 * gotero, la apunta a la aguja y la estira. En la punta lleva el pico, que es lo que queda colgando cuando salta.
 */
function laManguera(): string {
  const L = A.manguera;
  return trazo(`M0 0 Q${L * 0.5} 7 ${L} 0`, C.negro, 2.6, 0.8) + trazo(`M0 0 Q${L * 0.5} 7 ${L} 0`, C.papelSombra, 1.5) + trazo(`M${L * 0.2} 2.4 Q${L * 0.5} 5.4 ${L * 0.8} 2.4`, C.papel, 0.5, 0.8) + forma(caja(L - 3.4, -1.4, 3.8, 2.8), C.lacre);
}

/** La botella de gaseosa, colgada boca abajo: vidrio oscuro, etiqueta en blanco, sin marca. Y el gotero. */
function laBotella(): string {
  const [sx, sy] = A.suero;
  const d = curva([[sx - 7.6, sy + 4], [sx + 7.6, sy + 4], [sx + 8, sy + 26], [sx + 3, sy + 34], [sx + 2.4, sy + 40], [sx - 2.4, sy + 40], [sx - 3, sy + 34], [sx - 8, sy + 26]]);
  return (
    trazo(`M${sx} ${sy - 2} v6`, C.papelSombra, 1) +
    conGrano(
      enmascarado('m-nenes-botella', d, forma(d, C.vidrio) + forma(caja(sx - 9, sy + 11, 18, 31), C.gaseosa) + nube(sx - 4, sy + 20, 1.6, 12, C.cobre, 'xs', 0.8) +
        // La etiqueta: una faja en blanco, sin nada escrito.
        forma(caja(sx - 9, sy + 14, 18, 8), C.papel) + trazo(`M${sx - 9} ${sy + 16} h18 M${sx - 9} ${sy + 20} h18`, C.lacre, 0.9, 0.8)) +
      trazo(d, C.papelSombra, 0.8, 0.8) + forma(caja(sx - 3.2, sy + 39, 6.4, 3.4), C.lacre) +
      // El gotero.
      forma(cajaRedonda(sx - 2.6, sy + 42.4, 5.2, 7, 2), C.papelSombra, 0.9) + forma(elipse(sx, sy + 47, 1, 1.5), C.gaseosa),
    )
  );
}

/** La burbuja que sube por la botella cuando chupan. */
function laBurbuja(): string {
  const [sx, sy] = A.suero;
  return forma(elipse(sx + 2, sy + 32, 1.8, 1.8), C.papel, 0.9) + forma(elipse(sx - 2, sy + 36, 1.2, 1.2), C.papel, 0.8) + forma(elipse(sx + 3.4, sy + 38, 0.9, 0.9), C.papel, 0.8);
}

/* ------------------------------------------------------------------
   El agua: la espuma, la salpicadura, las burbujas y el barquito
   ------------------------------------------------------------------ */

/** La línea del agua contra el podio: una raya de espuma de canto roto, y dos aros que se abren. */
function laEspuma(): string {
  const { desde, hasta } = A.podio;
  const rnd = azar(433);
  let s = '';
  for (let x = desde - 8; x < hasta + 6; x += 6 + rnd() * 5) s += forma(elipse(x, -0.6 + rnd() * 1.6, 3 + rnd() * 3.4, 1 + rnd() * 1.2), i3(rnd) ? C.papel : C.espuma, 0.75 + rnd() * 0.25);
  return (
    nube(0, 3, 58, 2.6, C.marmolHondo, 's', 0.5) + s +
    trazo(`M${desde - 22} 4 q10 -3 24 0 M${hasta - 4} 5 q12 -3 26 0 M${desde - 34} 8.4 q16 -3 30 0 M${hasta + 6} 9 q10 -2 22 0`, C.espuma, 1, 0.7)
  );
}
const i3 = (rnd: () => number): boolean => rnd() < 0.34;

/** La salpicadura de una entrada de cabeza, con el agua en el (0, 0): una corona de gotas de espuma clara. */
function laSalpicadura(): string {
  let s = '';
  for (const [x, alto, ancho] of [[-15, 10, 3], [-9, 20, 3.4], [-3, 27, 3], [3, 30, 3.4], [9, 21, 3], [15, 11, 2.6]] as const) {
    s += forma(`M${x - ancho} 0 Q${x * 1.3} ${-alto * 0.6} ${x * 1.5} ${-alto} Q${x * 1.3 + ancho} ${-alto * 0.5} ${x + ancho} 0 Z`, C.papel, 0.95) + trazo(`M${x} -1 Q${x * 1.25} ${-alto * 0.5} ${x * 1.45} ${-alto + 2}`, C.espuma, 0.8, 0.9) + forma(elipse(x * 1.6, -alto - 4, 1.6, 2), C.papel);
  }
  return s + forma(elipse(0, 0, 20, 2.6), C.papel, 0.95) + trazo('M-28 2 q8 -3 16 0 M12 2 q8 -3 16 0', C.papel, 1, 0.85);
}

/** El aro de espuma clara que le queda alrededor de las piernas al que está clavado: el agua lo corta ahí. */
function elAro(): string {
  const rnd = azar(439);
  let s = '';
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    s += forma(elipse(Math.cos(a) * (11 + rnd() * 3), Math.sin(a) * 2.2 + 0.4, 2.2 + rnd() * 2, 0.9 + rnd() * 0.8), C.papel, 0.9);
  }
  return s + trazo(elipse(0, 0.6, 19, 3.6), C.papel, 0.8, 0.7) + trazo('M-27 2 q5 -2 9 0 M18 3 q5 -2 9 0', C.espuma, 0.9, 0.9);
}

/**
 * La marea: una franja de agua que le sube por la base al podio, con la cresta de espuma clara. El canto de arriba y
 * los dos costados van rotos a mano, para que no sea un paño; el agua es la del bajo.
 */
function laMarea(): string {
  const { desde, hasta } = A.podio;
  const rnd = azar(443);
  const arriba: Array<readonly [number, number]> = [];
  for (let x = desde - 16; x <= hasta + 16; x += 7) arriba.push([x, -1.6 + rnd() * 3.2]);
  // Finita: de la cresta para abajo mide lo que sube, y nada más. Así, a medio subir, no deja un manchón debajo del podio.
  const d = poli([[desde - 22, 4], ...arriba, [hasta + 23, 3.6], [hasta + 12, 7], [hasta + 2, 9.6], [36, 8.6], [0, 10], [-40, 8.8], [desde - 2, 10], [desde - 14, 7.4]]);
  let cresta = '';
  for (const [x, y] of arriba) cresta += forma(elipse(x + rnd() * 3, y - 0.2, 4 + rnd() * 3, 1.7 + rnd() * 1.2), C.papel, 0.86 + rnd() * 0.14);
  // La espuma que trepa por la base: unos copos más arriba, sueltos, contra el mármol.
  for (let i = 0; i < 9; i++) cresta += forma(elipse(desde + 8 + rnd() * (hasta - desde - 16), -3.4 - rnd() * 2.6, 1.6 + rnd() * 1.6, 0.9 + rnd() * 0.6), C.papel, 0.85);
  return (
    forma(d, C.agua, 0.92) + trazo(`M${desde - 6} 5 q12 -2 24 0 M-14 6 q14 -2 30 0 M${hasta - 30} 5.2 q12 -2 24 0`, C.espuma, 0.9, 0.85) + cresta
  );
}

/** Las burbujas del que se va a pique. */
function lasBurbujas(): string {
  return [[-5, -3, 2.6], [3, -7, 2], [-1, -12, 1.5], [6, -1, 1.4]].map(([x, y, r]) => trazo(elipse(x!, y!, r!, r!), C.papel, 0.9, 0.9)).join('') + forma(elipse(0, 0.6, 9, 1.6), C.espuma, 0.6);
}

/** El pagaré, doblado en barquito de papel: la firma, garabateada, y el sello de lacre. Con el agua en el (0, 0). */
function elBarco(): string {
  const casco = poli([[-13, -7], [13, -7], [8, 1], [-8, 1]]);
  const vela = poli([[-7, -7], [0, -19], [7, -7]]);
  return conGrano(
    forma(vela, C.papel) + forma(poli([[0, -19], [7, -7], [0, -7]]), C.papelSombra, 0.5) +
    forma(casco, C.papel) + trazo('M-13 -7 H13 M0 -7 V1', C.papelSombra, 0.8, 0.9) + trazo(vela, C.papelSombra, 0.6, 0.8) +
    // La firma y el sello.
    trazo('M-10 -3.4 q1.6 -3 3 0 q1.4 3 2.6 -1 q1 -2 2 1', C.negro, 0.8) + forma(elipse(7, -3.4, 2.1, 2.1), C.lacre) + forma(elipse(6.6, -3.8, 0.7, 0.7), C.papel, 0.7),
  ) + forma(elipse(0, 1.6, 14, 1.4), C.espuma, 0.55);
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 2.6;
const [SX, SY] = A.suero;

export const PIEZAS_NENES: readonly Pieza[] = [
  { nombre: 'nenes-suero', caja: [-36, SY - 8, 72, A.podio.tapa - SY + 10], dibujo: elSuero(), densidad: D },
  { nombre: 'nenes-botella', caja: [SX - 11, SY - 4, 22, 56], dibujo: laBotella(), densidad: D * 1.6 },
  { nombre: 'nenes-burbuja', caja: [SX - 6, SY + 28, 12, 14], dibujo: laBurbuja(), densidad: D * 2 },
  { nombre: 'nenes-manguera', caja: [-2, -4, A.manguera + 5, 12], dibujo: laManguera(), densidad: D * 1.8 },
  { nombre: 'nenes-cuerpo', caja: [-12, -95, 28, 101], dibujo: elCuerpo(), densidad: D * 1.7 },
  { nombre: 'nenes-brazos', caja: [-10, -120, 20, 58], dibujo: losBrazos(), densidad: D * 1.7 },
  { nombre: 'nenes-brillo', caja: [-6, -76, 28, 70], dibujo: elBrillo(), densidad: D },
  { nombre: 'nenes-podio', caja: [A.podio.desde - 6, A.pisan - 2, A.podio.hasta - A.podio.desde + 12, A.podio.tapa - A.pisan + 100], dibujo: elPodio(), densidad: D },
  { nombre: 'nenes-espuma', caja: [A.podio.desde - 40, -6, A.podio.hasta - A.podio.desde + 80, 20], dibujo: laEspuma(), densidad: D },
  { nombre: 'nenes-marea', caja: [A.podio.desde - 28, -8, A.podio.hasta - A.podio.desde + 58, 30], dibujo: laMarea(), densidad: D },
  { nombre: 'nenes-aro', caja: [-30, -5, 60, 12], dibujo: elAro(), densidad: D * 1.4 },
  { nombre: 'nenes-salpica', caja: [-32, -40, 64, 46], dibujo: laSalpicadura(), densidad: D },
  { nombre: 'nenes-burbujas', caja: [-12, -16, 24, 20], dibujo: lasBurbujas(), densidad: D * 1.6 },
  { nombre: 'nenes-barco', caja: [-16, -22, 32, 26], dibujo: elBarco(), densidad: D * 1.8 },
];

const img = imagenesDe(PIEZAS_NENES);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** Los nenes armados con las marcas de un momento. `seco` es el `id` del recorte de la línea del agua. */
function armado(m: Momento, seco: string): string {
  const { transform: t, opacity: o } = marcas(m);
  const nene = (n: 'a' | 'b'): string =>
    parte(n, img('nenes-cuerpo') + parte(`brazos-${n}`, img('nenes-brazos'), t[`brazos-${n}`]) + parte(`brillo-${n}`, img('nenes-brillo'), '', o[`brillo-${n}`]), t[n]);
  return (
    // Todo lo que está en el agua se corta en la línea del agua: el podio que se hunde y el que se clava no se ven de ahí para abajo.
    `<clipPath id="${seco}"><rect x="-400" y="-400" width="800" height="401"/></clipPath>` +
    `<g clip-path="url(#${seco})">` +
    parte('podio-fondo', img('nenes-suero') + parte('botella', img('nenes-botella') + parte('burbuja', img('nenes-burbuja'), t.burbuja, o.burbuja), t.botella), t['podio-fondo']) +
    // Las mangueras, de goma: del gotero a la aguja de cada uno.
    (['a', 'b'] as const).map((n) => parte(`manguera-${n}`, img('nenes-manguera'), t[`manguera-${n}`])).join('') +
    // Los nenes van detrás del podio: cuando vuelven, trepan por atrás del pedestal.
    nene('a') + nene('b') +
    parte('podio', img('nenes-podio'), t.podio) +
    `</g>` +
    parte('marea', img('nenes-marea'), t.marea, o.marea) +
    parte('espuma', img('nenes-espuma'), t.espuma) +
    (['a', 'b'] as const).map((n) =>
      parte(`aro-${n}`, img('nenes-aro'), t[`aro-${n}`], o[`aro-${n}`]) +
      parte(`salpica-${n}`, img('nenes-salpica'), t[`salpica-${n}`], o[`salpica-${n}`]) +
      parte(`burbujas-${n}`, img('nenes-burbujas'), t[`burbujas-${n}`], o[`burbujas-${n}`]) +
      parte(`barco-${n}`, img('nenes-barco'), t[`barco-${n}`], o[`barco-${n}`])).join('')
  );
}

/** Los nenes en un momento, sin lo que los hace tocables: para el test, el retrato y para mirarlos. */
export function nenesEn(m: Momento = QUIETO, seco = 'nenes-seco'): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m, seco)}</g>`;
}

/** El títere que se toca, en la pose quieta: los dos trofeos en su podio, espalda con espalda. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--nenes" data-id="${ID}" role="button" tabindex="0" aria-label="${nombres.get(ID) ?? 'Los nenes de oro'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO, 'nenes-seco')}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: la marea a medio subir, los pagarés flotando, uno clavado de cabeza y el otro en su pedestal. */
export const RETRATO = { caja: [NENES.x - 96, NENES.piso - 158, 192, 176] as const };
function retrato(): string {
  return (
    `<image href="/bestiario/bajo-lejos.webp" x="-250" y="0" width="1450" height="640" preserveAspectRatio="none"/>` +
    `<image href="/bestiario/bajo-agua.webp" x="-250" y="368" width="1450" height="272" preserveAspectRatio="none"/>` +
    nenesEn(CLAVADO, 'nenes-seco-retrato')
  );
}

export const NENES_PERSONAJE: Personaje = {
  id: ID,
  region: 'el-bajo',
  ancla: NENES.x,
  piezas: PIEZAS_NENES,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
