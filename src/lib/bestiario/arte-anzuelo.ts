/**
 * El que mordió el anzuelo (`D-73`, vigesimotercera vuelta), colgando de la línea de la caña del muelle.
 *
 * *"Mordí el anzuelo una vez más / Siempre un iluso"* es de *Esa estrella era mi lujo*, en *Bang! Bang!
 * Estás liquidado* (1989). La letra lo dice de una persona; acá es un pescado, clavado del labio de arriba,
 * que cuelga feliz. Lo que mordió es una cucharita de lata en forma de estrella, enhebrada en la línea justo
 * arriba de su nariz: *"nuestra estrella se agotó, y era mi lujo"*. La mira con los ojos entornados, colorado,
 * con la sonrisa boba de *"la más linda del amor que un tonto ha visto soñar"*. *"Una vez más"*: en el
 * cachete y en la quijada le quedan los anzuelos de las otras veces, oxidados, con su pedazo de tanza.
 *
 * Viste la tapa de *Bang! Bang!*, medida con sharp: el lomo es el sobretodo del tipo de la gorra, el
 * costado su gorra, la panza el vestido de la mujer del cuadro y las aletas el marco naranja. Los ojos son
 * la camisa del fusilado, los anzuelos el acero de la pistola y la estrella el farol del cuadro.
 *
 * Coordenadas: el (0, 0) es la punta de la caña, y el pescado cuelga del labio (`rig-anzuelo.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, soplo, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { conGrano, curva, elipse, f, poli, type P } from './trazos.ts';
import { AGUA, ANZUELO_ARMADO as A, PUNTA, QUIETO, TOCADO, alRecinto, marcas, type Momento } from './rig-anzuelo.ts';

/** Las tintas de *Bang! Bang! Estás liquidado* (`tokens.css`). */
const C = {
  piloto: 'var(--bestia-anzuelo-piloto)',
  pilotoHondo: 'var(--bestia-anzuelo-piloto-hondo)',
  pilotoClaro: 'var(--bestia-anzuelo-piloto-claro)',
  gorra: 'var(--bestia-anzuelo-gorra)',
  panza: 'var(--bestia-anzuelo-panza)',
  camisa: 'var(--bestia-anzuelo-camisa)',
  marco: 'var(--bestia-anzuelo-marco)',
  marcoHondo: 'var(--bestia-anzuelo-marco-hondo)',
  sangre: 'var(--bestia-anzuelo-sangre)',
  tinta: 'var(--bestia-anzuelo-tinta)',
  pared: 'var(--bestia-anzuelo-pared)',
  acero: 'var(--bestia-anzuelo-acero)',
  aceroClaro: 'var(--bestia-anzuelo-acero-claro)',
  agua: 'var(--bestia-anzuelo-agua)',
  aguaClara: 'var(--bestia-anzuelo-agua-clara)',
  farol: 'var(--bestia-anzuelo-farol)',
  farolClaro: 'var(--bestia-anzuelo-farol-claro)',
};

/** Del pescado (el 0 es el labio) a la línea (el 0 es la punta de la caña). */
const [, LY] = A.labio;
const L = ([x, y]: P): P => [x, y + LY];
const Ls = (pts: readonly P[]): P[] => pts.map(L);

/* ------------------------------------------------------------------
   El cuerpo, colgado de la boca, con los anzuelos de las otras veces
   ------------------------------------------------------------------ */

const SILUETA: readonly P[] = Ls([[1, -1], [-5, 2], [-11, 9], [-15, 19], [-17, 30], [-15.5, 42], [-11, 53], [-5.5, 61], [-3.6, 66], [3.6, 66], [5.5, 61], [11, 53], [15.5, 42], [17, 30], [15.5, 19], [11, 8], [6, 1.5]]);

/** Un anzuelo viejo, oxidado, con su pedazo de tanza deshilachada y lo que le haya quedado colgando. */
function anzueloViejo([x, y]: P, giro: number, tanza: readonly P[], plomo: boolean): string {
  const g = `<g transform="rotate(${giro} ${f(x)} ${f(y)})">`;
  const gancho = `M${f(x)} ${f(y - 5)} L${f(x)} ${f(y + 1)} Q${f(x)} ${f(y + 4)} ${f(x + 2.6)} ${f(y + 4)} Q${f(x + 4.4)} ${f(y + 4)} ${f(x + 4)} ${f(y + 1)}`;
  const [tx, ty] = tanza[tanza.length - 1]!;
  return g + trazo(gancho, C.marcoHondo, 1.3) + trazo(gancho, C.acero, 0.5, 0.7) + forma(elipse(x, y - 5.4, 1, 1), C.marcoHondo) + `</g>` +
    trazo(`M${f(x)} ${f(y - 5)} ` + tanza.map(([a, b]) => `L${f(a)} ${f(b)}`).join(' '), C.aceroClaro, 0.45, 0.75) +
    // La punta deshilachada, o el plomito que le quedó.
    (plomo ? forma(elipse(tx, ty + 1.4, 1.4, 2), C.acero) + nube(tx - 0.4, ty + 0.8, 0.5, 0.8, C.aceroClaro, 'xs', 0.9)
      : trazo(`M${f(tx)} ${f(ty)} l-1.4 1.6 M${f(tx)} ${f(ty)} l0.2 2 M${f(tx)} ${f(ty)} l1.4 1.2`, C.aceroClaro, 0.35, 0.6));
}

function cuerpo(): string {
  const d = curva(SILUETA);
  const [ex, ey] = A.ojo;
  // Las escamas: medias lunas en fila, que en el lomo agarran la luz del farol y en la panza casi no se ven.
  let escamas = '';
  for (let fila = 0; fila < 9; fila++) {
    const y = LY + 22 + fila * 4.6;
    for (let col = -3; col <= 3; col++) {
      const x = col * 5 + (fila % 2 ? 2.5 : 0);
      escamas += trazo(`M${f(x - 2.4)} ${f(y)} Q${f(x)} ${f(y + 2.6)} ${f(x + 2.4)} ${f(y)}`, x < 2 ? C.pilotoHondo : C.gorra, 0.55, x < 2 ? 0.5 : 0.3) +
        (x < 0 ? trazo(`M${f(x - 1.6)} ${f(y + 0.6)} Q${f(x)} ${f(y + 2)} ${f(x + 1.6)} ${f(y + 0.6)}`, C.pilotoClaro, 0.4, 0.35) : '');
    }
  }
  const adentro =
    forma(d, C.gorra) +
    // El lomo en el sobretodo, hondo en el borde; la panza en el vestido; la luz del farol de arriba a la izquierda.
    nube(-14, LY + 34, 9, 34, C.pilotoHondo, 'm', 0.95) + nube(-7, LY + 30, 8, 30, C.piloto, 'm', 0.9) +
    nube(12, LY + 36, 8, 28, C.panza, 'm', 0.95) + nube(15, LY + 30, 3, 16, C.camisa, 's', 0.5) +
    escamas +
    nube(-8, LY + 18, 6, 14, C.pilotoClaro, 's', 0.55) +
    // Abajo, contra la cola, se oscurece: la pared violeta de la tapa.
    nube(0, LY + 64, 14, 10, C.pared, 'm', 0.9) +
    // La línea del costado, de la cabeza a la cola.
    trazo(`M-4 ${LY + 24} Q-7 ${LY + 44} -1 ${LY + 63}`, C.pilotoHondo, 0.8, 0.55) +
    // La agalla, debajo del ojo: el borde del opérculo con su sombra.
    soplo(`M-15 ${LY + 26} Q0 ${LY + 36} 16 ${LY + 27} L16 ${LY + 30} Q0 ${LY + 40} -15 ${LY + 30} Z`, C.pilotoHondo, 's', 0.6) +
    trazo(`M-15 ${LY + 24.5} Q0 ${LY + 34} 16 ${LY + 25.5}`, C.marcoHondo, 1.1, 0.85) +
    // La cabeza, más clara, y la nariz donde está clavado.
    nube(4, LY + 6, 9, 8, C.panza, 's', 0.55) + nube(1, LY + 1, 4, 3, C.sangre, 's', 0.7);
  // El ojo grande de enamorado: el blanco de la camisa, con su aro.
  const blanco = elipse(ex, ey, 6.6, 6.8);
  const ojo = forma(elipse(ex, ey, 7.8, 8), C.pilotoHondo) +
    enmascarado('m-anzuelo-ojo', blanco, forma(blanco, C.camisa) + nube(ex + 2, ey + 4, 5, 3, C.agua, 's', 0.55));
  // La sonrisa boba: el borde de la agalla, que se le sube en las dos puntas como una boca de enamorado, y el
  // labio hinchado de tanto morder, alrededor de la nariz.
  const sonrisa = trazo(`M-15.6 ${LY + 22} q0.2 2.6 1.6 3.4 M15.2 ${LY + 24.2} q1.4 -0.6 1.8 -3.2`, C.marcoHondo, 1.1, 0.9) +
    trazo(`M-12 ${LY + 27.4} Q0 ${LY + 35.6} 13 ${LY + 28}`, C.sangre, 0.7, 0.5) +
    trazo(`M-4.6 ${LY + 3} Q1 ${LY + 6.4} 7.4 ${LY + 2.4}`, C.sangre, 1.2, 0.8);
  // La aleta de abajo, detrás del cuerpo.
  const anal = curva(Ls([[9, 50], [17, 53], [19, 60], [11, 58]]));
  // Los anzuelos de las otras veces: uno en el cachete, con la tanza cortada; otro en la quijada, con el plomo.
  const viejos = anzueloViejo([-9, LY + 12], -20, [[-13, LY + 6], [-16, LY + 1], [-15.4, LY - 3]], false) +
    anzueloViejo([14.6, LY + 15], 30, [[17, LY + 20], [18.2, LY + 25]], true);
  return conGrano(
    enmascarado('m-anzuelo-anal', anal, forma(anal, C.marco) + nube(16, LY + 57, 4, 4, C.marcoHondo, 's', 0.8)) +
    trazo(`M10 ${LY + 51} L17 ${LY + 57} M11 ${LY + 54} L15 ${LY + 59}`, C.marcoHondo, 0.6, 0.8) +
    enmascarado('m-anzuelo-cuerpo', d, adentro) +
    ojo + sonrisa + viejos,
  );
}

/** La aleta del lomo, espinosa, que se para del susto y se acuesta de contento. */
function dorsal(): string {
  const pts = Ls([[-14, 17], [-23, 15.5], [-21, 22], [-27.5, 25], [-22, 30], [-28, 35], [-21.5, 39.5], [-25.5, 46], [-17, 49], [-12, 46], [-11, 30]]);
  const d = poli(pts);
  const espinas = [[-23, 15.5], [-27.5, 25], [-28, 35], [-25.5, 46]].map(([x, y]) => trazo(`M-13 ${f(L([0, 32])[1])} L${f(x!)} ${f(y! + LY)}`, C.marcoHondo, 0.9, 0.9)).join('');
  return conGrano(enmascarado('m-anzuelo-dorsal', d, forma(d, C.marco) + nube(-24, LY + 30, 5, 18, C.marcoHondo, 's', 0.8) + nube(-16, LY + 28, 4, 12, C.farol, 's', 0.45)) + espinas);
}

/** La cola en tijera, que aletea. */
function cola(): string {
  const d = curva(Ls([[-3.6, 62], [-11, 72], [-16.6, 85], [-14, 91], [-7, 84.6], [0, 79], [7, 84.6], [14, 91], [16.6, 85], [11, 72], [3.6, 62]]));
  const radios = [-14, -9, -4, 4, 9, 14].map((x) => trazo(`M${x * 0.15} ${LY + 64} Q${x * 0.6} ${LY + 76} ${x} ${LY + 87}`, C.marcoHondo, 0.6, 0.75)).join('');
  return conGrano(enmascarado('m-anzuelo-cola', d, forma(d, C.marco) + nube(0, LY + 64, 6, 6, C.gorra, 's', 0.9) + nube(-12, LY + 84, 6, 6, C.marcoHondo, 's', 0.8) + nube(10, LY + 80, 4, 6, C.farol, 's', 0.5)) + radios);
}

/** La aleta del pecho, que rema en el aire. */
function pectoral(): string {
  const d = curva(Ls([[7, 27.6], [12, 28], [19, 34], [21, 42], [15, 40.4], [9, 34]]));
  return conGrano(enmascarado('m-anzuelo-pectoral', d, forma(d, C.marco) + nube(17, LY + 39, 4, 4, C.marcoHondo, 's', 0.8) + nube(10, LY + 30, 3, 2, C.farolClaro, 'xs', 0.7)) +
    trazo(`M9 ${LY + 30} L19 ${LY + 37} M8.6 ${LY + 32} L16.6 ${LY + 40}`, C.marcoHondo, 0.5, 0.8));
}

/** La pupila grande, con dos brillos: la del que mira la estrella. */
function pupila(): string {
  const [ex, ey] = A.ojo;
  return enmascarado('m-anzuelo-pupila', elipse(ex, ey, 6.6, 6.8), forma(elipse(ex, ey, 3.8, 4.2), C.tinta) + forma(elipse(ex - 1.3, ey - 1.6, 1.3, 1.3), C.camisa) + forma(elipse(ex + 1.4, ey + 1.4, 0.6, 0.6), C.camisa, 0.9));
}

/** El medio párpado del enamorado: baja desde arriba y la isla lo estira. */
function ensueno(): string {
  const [ex, ey] = A.ojo;
  const d = `M${f(ex - 9)} ${f(ey - 8)} L${f(ex + 9)} ${f(ey - 8)} L${f(ex + 9)} ${f(ey)} Q${f(ex)} ${f(ey + 1.6)} ${f(ex - 9)} ${f(ey)} Z`;
  return enmascarado('m-anzuelo-ensueno', elipse(ex, ey, 7, 7.2), forma(d, C.gorra) + nube(ex - 2, ey - 6, 6, 3, C.piloto, 's', 0.8)) +
    trazo(`M${f(ex - 6.6)} ${f(ey - 0.4)} Q${f(ex)} ${f(ey + 1.4)} ${f(ex + 6.6)} ${f(ey - 0.4)}`, C.pilotoHondo, 1.1) +
    // Las pestañas largas, de enamorado.
    [-4, 0, 4].map((dx) => trazo(`M${f(ex + dx)} ${f(ey + 0.8)} l${f(dx * 0.25)} 2`, C.pilotoHondo, 0.6)).join('');
}

/** El párpado entero, para pestañear. */
function parpado(): string {
  const [ex, ey] = A.ojo;
  return enmascarado('m-anzuelo-parpado', elipse(ex, ey, 7, 7.2), forma(elipse(ex, ey, 8, 8), C.gorra) + nube(ex - 2, ey - 3, 5, 4, C.piloto, 's', 0.8)) +
    trazo(`M${f(ex - 6.6)} ${f(ey + 1)} Q${f(ex)} ${f(ey + 4)} ${f(ex + 6.6)} ${f(ey + 1)}`, C.pilotoHondo, 1.1);
}

/** Los cachetes colorados. */
function rubor(): string {
  return nube(10.6, LY + 23, 4.6, 3, C.sangre, 's', 0.75) + nube(-3, LY + 26, 3, 2, C.sangre, 's', 0.4);
}

/** La boca que boquea: el agujero redondo, abajo del anzuelo. */
function boca(): string {
  const [bx, by] = A.boca;
  const d = elipse(bx, by, 4.4, 3.6);
  return conGrano(forma(elipse(bx, by, 5.4, 4.6), C.sangre) + enmascarado('m-anzuelo-boca', d, forma(d, C.tinta) + nube(bx + 0.6, by + 2, 3, 1.6, C.sangre, 's', 0.8)));
}

/** El anzuelo nuevo, el de hoy: el ojal atado a la línea, el gancho y la punta que le sale por el labio. */
function anzuelo(): string {
  const [, oy] = A.ojal;
  const gancho = `M0 ${oy + 1.6} L0 ${LY + 4} Q0 ${LY + 9} 3.4 ${LY + 9} Q6.6 ${LY + 9} 6.4 ${LY + 4} L5.6 ${LY - 0.6}`;
  return conGrano(
    trazo(gancho, C.tinta, 2, 0.5) + trazo(gancho, C.acero, 1.4) + trazo(`M-0.4 ${oy + 2} L-0.4 ${LY + 3}`, C.aceroClaro, 0.5, 0.85) +
    forma(poli([[5.6, LY - 0.6], [7.4, LY + 2], [6, LY + 2.2]]), C.acero) +
    forma(elipse(0, oy, 1.8, 1.8), C.acero) + forma(elipse(0, oy, 0.8, 0.8), C.tinta) +
    // Una gota de sangre en la punta: la de hoy.
    forma(elipse(6.4, LY + 3.4, 0.7, 1), C.sangre, 0.9),
  );
}

/** La cucharita de lata en forma de estrella, enhebrada en la línea. Gira sola. */
function estrella(): string {
  const [x, y] = A.estrella;
  const pts: P[] = Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 ? 2.6 : 6.2;
    return [x + Math.cos(a) * r, y + Math.sin(a) * r];
  });
  const d = poli(pts);
  return conGrano(enmascarado('m-anzuelo-estrella', d, forma(d, C.farol) + nube(x - 2, y - 2, 3, 3, C.farolClaro, 's', 0.9) + nube(x + 3, y + 3, 4, 3, C.marcoHondo, 's', 0.55)) +
    trazo(d, C.marcoHondo, 0.5, 0.6) + forma(elipse(x, y, 1, 1), C.tinta));
}

/** El brillo de la estrella: su lujo. Es luz y se suma a la noche. */
function brillo(): string {
  const [x, y] = A.estrella;
  return nube(x, y, 9, 9, C.farol, 'm', 0.7) + nube(x, y, 3, 3, C.farolClaro, 's', 1) +
    trazo(`M${x - 13} ${y} L${x + 13} ${y} M${x} ${y - 13} L${x} ${y + 13}`, C.farolClaro, 0.8, 0.85) + trazo(`M${x - 5} ${y - 5} L${x + 5} ${y + 5} M${x - 5} ${y + 5} L${x + 5} ${y - 5}`, C.farolClaro, 0.5, 0.6);
}

/** El chapuzón: la corona de agua que salta, en el (0, 0) del agua. */
function salpica(): string {
  const gota = (x: number, y: number, r: number, giro: number, color: string): string =>
    `<g transform="rotate(${giro} ${f(x)} ${f(y)})">${forma(`M${f(x)} ${f(y - r * 2.4)} Q${f(x + r)} ${f(y - r * 0.4)} ${f(x)} ${f(y + r)} Q${f(x - r)} ${f(y - r * 0.4)} ${f(x)} ${f(y - r * 2.4)} Z`, color)}</g>`;
  const corona = curva([[-22, 0], [-18, -10], [-12, -6], [-8, -18], [-3, -9], [0, -22], [4, -9], [9, -17], [12, -6], [18, -11], [22, 0]]);
  return conGrano(
    enmascarado('m-anzuelo-corona', corona, forma(corona, C.agua) + nube(0, -4, 16, 6, C.aguaClara, 's', 0.9) + nube(-8, -14, 3, 6, C.camisa, 's', 0.7) + nube(8, -12, 3, 5, C.camisa, 's', 0.6)) +
    gota(-16, -22, 1.8, -30, C.aguaClara) + gota(-6, -30, 1.4, -10, C.camisa) + gota(5, -33, 1.6, 12, C.aguaClara) + gota(15, -24, 1.4, 34, C.camisa) + gota(22, -14, 1.2, 60, C.aguaClara) + gota(-23, -12, 1.2, -58, C.agua),
  );
}

/** Las ondas que se abren en el agua, aplastadas por la vista de costado. */
function ondas(): string {
  return trazo(curva([[-26, 0], [0, -4.6], [26, 0], [0, 4.6]]), C.aguaClara, 1, 0.8) + trazo(curva([[-15, 0], [0, -2.8], [15, 0], [0, 2.8]]), C.agua, 1.2, 0.9) + trazo(curva([[-6, 0], [0, -1.2], [6, 0], [0, 1.2]]), C.camisa, 0.8, 0.7);
}

/** Una gota que se le cae. */
function gota(): string {
  return forma('M0 -2.6 Q1.3 -0.4 0 1.3 Q-1.3 -0.4 0 -2.6 Z', C.aguaClara) + forma(elipse(-0.3, -0.2, 0.35, 0.5), C.camisa);
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 5;
const [OX, OY] = A.ojo;
const [EX, EY] = A.estrella;

export const PIEZAS_ANZUELO: readonly Pieza[] = [
  { nombre: 'anzuelo-dorsal', caja: [-30, LY + 13, 20, 39], dibujo: dorsal(), densidad: D },
  { nombre: 'anzuelo-cola', caja: [-19, LY + 60, 38, 32], dibujo: cola(), densidad: D },
  { nombre: 'anzuelo-cuerpo', caja: [-19, LY - 9, 40, 78], dibujo: cuerpo(), densidad: D },
  { nombre: 'anzuelo-pectoral', caja: [5, LY + 25, 18, 19], dibujo: pectoral(), densidad: D },
  { nombre: 'anzuelo-pupila', caja: [OX - 7, OY - 7, 14, 14], dibujo: pupila(), densidad: D * 1.4 },
  { nombre: 'anzuelo-ensueno', caja: [OX - 9, OY - 9, 18, 13], dibujo: ensueno(), densidad: D * 1.4 },
  { nombre: 'anzuelo-parpado', caja: [OX - 9, OY - 9, 18, 15], dibujo: parpado(), densidad: D * 1.4 },
  { nombre: 'anzuelo-rubor', caja: [-8, LY + 17, 24, 12], dibujo: rubor(), densidad: D * 0.6 },
  { nombre: 'anzuelo-boca', caja: [-4, LY - 4, 13, 11], dibujo: boca(), densidad: D * 1.4 },
  { nombre: 'anzuelo-anzuelo', caja: [-3, A.ojal[1] - 3, 12, LY + 13 - A.ojal[1]], dibujo: anzuelo(), densidad: D * 1.4 },
  { nombre: 'anzuelo-estrella', caja: [EX - 7, EY - 7, 14, 14], dibujo: estrella(), densidad: D * 1.4 },
  { nombre: 'anzuelo-brillo', caja: [EX - 22, EY - 22, 44, 44], dibujo: brillo(), densidad: 2 },
  { nombre: 'anzuelo-salpica', caja: [-30, -40, 60, 44], dibujo: salpica(), densidad: 3 },
  { nombre: 'anzuelo-ondas', caja: [-30, -8, 60, 16], dibujo: ondas(), densidad: 3 },
  { nombre: 'anzuelo-gota', caja: [-2, -3.4, 4, 5.4], dibujo: gota(), densidad: D * 1.4 },
];

const img = imagenesDe(PIEZAS_ANZUELO);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** El pescado armado con las marcas de un momento. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  // Lo que baja del canto del muelle se hunde: el agua tapa todo lo colgado de ahí para abajo.
  return (
    `<clipPath id="anzuelo-agua"><rect x="-140" y="-200" width="280" height="${f(200 + AGUA)}"/></clipPath>` +
    `<g clip-path="url(#anzuelo-agua)">` +
    parte('colgado',
      `<path d="M0 0 L0 ${A.ojal[1] - 1.6}" class="bt-anzuelo-linea"/>` +
      A.gotas.map((_, i) => parte(`gota-${i + 1}`, img('anzuelo-gota'), t[`gota-${i + 1}`], o[`gota-${i + 1}`])).join('') +
      parte('pez',
        parte('dorsal', img('anzuelo-dorsal'), t.dorsal) +
        parte('cola', img('anzuelo-cola'), t.cola) +
        img('anzuelo-cuerpo') +
        parte('rubor', img('anzuelo-rubor'), '', o.rubor) +
        parte('pupila', img('anzuelo-pupila'), t.pupila) +
        parte('ensueno', img('anzuelo-ensueno'), t.ensueno, o.ensueno) +
        parte('parpado', img('anzuelo-parpado'), '', o.parpado) +
        parte('boca', img('anzuelo-boca'), '', o.boca) +
        parte('pectoral', img('anzuelo-pectoral'), t.pectoral),
        t.pez) +
      img('anzuelo-anzuelo') +
      parte('estrella', img('anzuelo-estrella'), t.estrella) +
      parte('brillo', img('anzuelo-brillo'), '', o.brillo),
      t.colgado) +
    `</g>` +
    parte('ondas', img('anzuelo-ondas'), t.ondas, o.ondas) +
    parte('salpica', img('anzuelo-salpica'), t.salpica, o.salpica)
  );
}

/** El pescado en un momento, sin lo que lo hace tocable: para el test, el retrato y para mirarlo. */
export function anzueloEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/** El títere que se toca, en la pose quieta: colgado del labio, mirando la estrella de reojo. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--anzuelo" data-id="el-que-mordio-el-anzuelo" role="button" tabindex="0" aria-label="${nombres.get('el-que-mordio-el-anzuelo') ?? 'El que mordió el anzuelo'}">` +
    // Lo que se toca: el pescado es finito, y en el teléfono un dedo tiene que alcanzarlo.
    `<rect x="${PUNTA[0] - 30}" y="${PUNTA[1] + 8}" width="60" height="${f(AGUA - 8)}" class="bt-anzuelo-toque"/>` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: recién mordido otra vez, colorado, con la estrella brillando, sobre su pedazo de muelle. */
export const RETRATO = (() => {
  const [x0, y0] = alRecinto([-60, -14]);
  const [x1, y1] = alRecinto([60, AGUA + 6]);
  return { caja: [x0, y0, x1 - x0, y1 - y0] as const };
})();
function retrato(): string {
  const fondo = (nombre: string): string => `<image href="/bestiario/${nombre}.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>`;
  return fondo('astillero-lejos') + fondo('astillero-piso') + anzueloEn(TOCADO);
}

export const ANZUELO_PERSONAJE: Personaje = {
  id: 'el-que-mordio-el-anzuelo',
  region: 'los-astilleros',
  ancla: PUNTA[0],
  piezas: PIEZAS_ANZUELO,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
