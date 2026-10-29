/**
 * El rey de esta jungla (`D-73`, vigesimoquinta vuelta): la tumba, en la ladera del monte, entre las tiras.
 *
 * *"A él, que era rey de esta jungla, / se le soltó un patín... / y ahora mira crecer las flores desde abajo"*
 * es de *Etiqueta negra*, en *Lobo suelto, cordero atado* (1993). El dibujo lo toma al pie de la letra: un
 * león viejo enterrado en un montículo de tierra removida, del que asoman nada más que la frente, la melena
 * desparramada y los ojos, que miran las flores que le crecen encima. Al lado, la cruz de dos palos atados
 * con alambre, torcida, con una etiqueta negra de botella clavada de epitafio; al pie, la corona, que es de
 * lata de tomate recortada con tijera; y tirado en el pasto el patín, uno de lata de los que se ajustaban
 * con llave, con la correa suelta, la llave colgando del hilo y una rueda floja que gira sola.
 *
 * Detalles que no están en la letra: la oreja mordida y la cicatriz de la frente, de cuando peleaba; un
 * colmillo partido, que se le ve cuando ruge; canas en la melena; un hueso que asoma de la tierra; y adentro
 * de la corona, el papel de la lata de tomate, desteñido.
 *
 * Viste *Lobo suelto, cordero atado*, medido con sharp (`tokens.css`): la tierra y la cara son los marrones
 * de la bestia de la tapa del cordero, la melena es la madera de sus pezuñas, los ojos son su verde, y las
 * flores son el naranja del fondo y el rojo de la lengua del interior.
 *
 * Coordenadas: el (0, 0) es el pie del montículo debajo de la cara del león (`rig-rey.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { cajaRedonda, conGrano, curva, elipse, poli, rot, type P } from './trazos.ts';
import { ASOMA, LOMA, QUIETO, REY, REY_ARMADO as A, cumbre, marcas, puntaDe, type Momento } from './rig-rey.ts';

/** Las tintas de *Lobo suelto, cordero atado* (`tokens.css`). */
const C = {
  tierra: 'var(--bestia-rey-tierra)',
  tierraClara: 'var(--bestia-rey-tierra-clara)',
  tierraHonda: 'var(--bestia-rey-tierra-honda)',
  melena: 'var(--bestia-rey-melena)',
  melenaClara: 'var(--bestia-rey-melena-clara)',
  melenaHonda: 'var(--bestia-rey-melena-honda)',
  piel: 'var(--bestia-rey-piel)',
  pielClara: 'var(--bestia-rey-piel-clara)',
  ojo: 'var(--bestia-rey-ojo)',
  tinta: 'var(--bestia-rey-tinta)',
  boca: 'var(--bestia-rey-boca)',
  rojo: 'var(--bestia-rey-flor-roja)',
  hueso: 'var(--bestia-rey-hueso)',
  flor: 'var(--bestia-rey-flor)',
  tallo: 'var(--bestia-rey-tallo)',
  lata: 'var(--bestia-rey-lata)',
  lataHonda: 'var(--bestia-rey-lata-honda)',
  etiqueta: 'var(--bestia-rey-etiqueta)',
  oro: 'var(--bestia-rey-oro)',
  palo: 'var(--bestia-rey-palo)',
};

/** Un azar fijo, para que los mechones y los terrones salgan siempre iguales. */
function semilla(s: number): () => number {
  let a = s >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), a | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------------------------------------------
   La cruz: dos palos atados con alambre, y la etiqueta negra clavada
   ------------------------------------------------------------------ */

/** Un palo torcido, de rama, con los nudos: de `a` a `b`, de ancho `w`. */
function palo(a: P, b: P, w: number, nudos: readonly number[], id: string): string {
  const [ax, ay] = a;
  const [bx, by] = b;
  const l = Math.hypot(bx - ax, by - ay);
  const [ux, uy] = [(bx - ax) / l, (by - ay) / l];
  const [nx, ny] = [-uy, ux];
  // El borde de un lado y del otro, con la rama que engorda y afina sin regla.
  const lado = (s: number): P[] => Array.from({ length: 7 }, (_, i) => {
    const k = i / 6;
    const g = w * (1 - 0.25 * k) * (0.5 + 0.08 * Math.sin(k * 17 + s * 3));
    const tuerce = 1.6 * Math.sin(k * 5.5);
    return [ax + ux * l * k + nx * (s * g + tuerce), ay + uy * l * k + ny * (s * g + tuerce)] as P;
  });
  const d = curva([...lado(1), ...lado(-1).reverse()]);
  const [mx, my] = [(ax + bx) / 2, (ay + by) / 2];
  const ang = (Math.atan2(uy, ux) * 180) / Math.PI;
  return enmascarado(id, d,
    forma(d, C.palo) +
    nube(mx + nx * w * 0.4, my + ny * w * 0.4, l * 0.55, w * 0.35, C.tierraHonda, 's', 0.9, ang) +
    nube(mx - nx * w * 0.3, my - ny * w * 0.3, l * 0.5, w * 0.18, C.melenaClara, 'xs', 0.8, ang) +
    // La corteza, en vetas, y los nudos.
    [0.15, 0.35, 0.55, 0.75].map((k, i) => trazo(`M${ax + ux * l * k + nx * (i % 2 ? 1.4 : -1.2)} ${ay + uy * l * k + ny * (i % 2 ? 1.4 : -1.2)} l${ux * l * 0.14} ${uy * l * 0.14}`, C.tierraHonda, 0.7, 0.7)).join('') +
    nudos.map((k) => forma(elipse(ax + ux * l * k, ay + uy * l * k, w * 0.3, w * 0.22), C.tierraHonda) + forma(elipse(ax + ux * l * k - 0.4, ay + uy * l * k - 0.4, w * 0.14, w * 0.1), C.melenaClara, 0.8)).join(''));
}

function cruz(): string {
  const pie: P = [-90, -40];
  const tope: P = [-106, -240];
  const [bi, bd]: [P, P] = [[-138, -194], [-64, -183]];
  // Donde se cruzan, el alambre: vueltas y vueltas, y las puntas retorcidas que sobran.
  const [x, y] = [-102, -190];
  const vueltas = [-4, -1.5, 1, 3.5].map((dy, i) =>
    trazo(`M${x - 6} ${y + dy - 2} Q${x} ${y + dy + 3} ${x + 6} ${y + dy + 1}`, C.lataHonda, 1.3) + trazo(`M${x - 5} ${y + dy - 2.4} Q${x} ${y + dy + 2.2} ${x + 5} ${y + dy + 0.6}`, C.lata, 0.5, i % 2 ? 0.8 : 0.5)).join('') +
    [-3, 2].map((dy) => trazo(`M${x - 6} ${y + dy} Q${x - 1} ${y + dy - 4} ${x + 7} ${y + dy - 2}`, C.lataHonda, 1.1)).join('') +
    trazo(`M${x + 6} ${y + 2} q4 -1 6 -6 q1 -3 -2 -4 q-2 0 -1 3`, C.lataHonda, 1) + trazo(`M${x - 6} ${y - 3} q-5 -2 -7 2 q-1 3 2 3`, C.lataHonda, 1);
  return conGrano(
    palo(pie, tope, 8, [0.42, 0.8], 'm-rey-palo') +
    // El muñón de una rama que le cortaron con el cuchillo, a media altura.
    trazo('M-94 -112 l-9 -7', C.palo, 3) + forma(elipse(-103.5, -119.5, 1.8, 1.4), C.melenaClara) +
    palo(bi, bd, 6.4, [0.2], 'm-rey-travesano') +
    vueltas,
  ) + etiqueta();
}

/** La etiqueta negra, de botella, despegada y clavada en el palo con un clavo que se oxida. */
function etiqueta(): string {
  const [cx, cy] = [-99, -158];
  const [w, h] = [34, 24];
  // La esquina de abajo a la derecha, arrancada.
  const d = poli([[cx - w / 2, cy - h / 2], [cx + w / 2, cy - h / 2], [cx + w / 2, cy + h / 2 - 7], [cx + w / 2 - 3, cy + h / 2 - 4], [cx + w / 2 - 5, cy + h / 2 - 5], [cx + w / 2 - 8, cy + h / 2], [cx - w / 2, cy + h / 2]]);
  const renglon = (yy: number, x0: number, x1: number, s: number): string => {
    const r = semilla(s);
    let x = x0;
    let out = '';
    while (x < x1) {
      const l = 1.2 + r() * 2.6;
      out += trazo(`M${x} ${yy + (r() - 0.5) * 0.5} l${Math.min(l, x1 - x)} 0`, C.oro, 0.6, 0.85);
      x += l + 0.9;
    }
    return out;
  };
  // Una coronita en la medalla: la marca de la botella, que acá es la del rey.
  const coronita = poli([[cx - 4, cy - 5.6], [cx - 4, cy - 9], [cx - 2, cy - 7.4], [cx, cy - 10], [cx + 2, cy - 7.4], [cx + 4, cy - 9], [cx + 4, cy - 5.6]]);
  return `<g transform="rotate(-8 ${cx} ${cy})">` + conGrano(
    enmascarado('m-rey-etiqueta', d,
      forma(d, C.etiqueta) + nube(cx - 6, cy - 4, 12, 6, C.lataHonda, 's', 0.5) + nube(cx + 8, cy + 6, 10, 5, C.tinta, 's', 0.8) +
      // El doble filete dorado del borde, gastado.
      trazo(cajaRedonda(cx - w / 2 + 1.6, cy - h / 2 + 1.6, w - 3.2, h - 3.2, 1.2), C.oro, 0.8, 0.85) +
      trazo(cajaRedonda(cx - w / 2 + 3.2, cy - h / 2 + 3.2, w - 6.4, h - 6.4, 0.8), C.oro, 0.4, 0.6) +
      // La medalla con la coronita y los renglones que ya no se leen.
      trazo(elipse(cx, cy - 7.4, 6, 3.6), C.oro, 0.6, 0.8) + forma(coronita, C.oro, 0.85) +
      renglon(cy + 0.4, cx - 11, cx + 11, 3) + renglon(cy + 3.6, cx - 9, cx + 9, 7) + renglon(cy + 6.6, cx - 10, cx + 4, 11) +
      // El agua que le corrió y la levantó en ampollas.
      nube(cx - 9, cy + 7, 4, 2.4, C.tierraClara, 's', 0.6) + nube(cx + 10, cy - 7, 3, 4, C.lataHonda, 'xs', 0.6)) +
    // La punta arrancada, que deja ver el papel de abajo.
    trazo(`M${cx + w / 2} ${cy + h / 2 - 7} L${cx + w / 2 - 3} ${cy + h / 2 - 4} L${cx + w / 2 - 5} ${cy + h / 2 - 5} L${cx + w / 2 - 8} ${cy + h / 2}`, C.pielClara, 0.8, 0.8) +
    // El clavo, y el óxido que chorrea.
    nube(cx, cy - h / 2 + 7, 1.6, 6, C.tierraClara, 'xs', 0.85) +
    forma(elipse(cx, cy - h / 2 + 2.6, 1.8, 1.8), C.lataHonda) + forma(elipse(cx - 0.5, cy - h / 2 + 2.1, 0.7, 0.7), C.lata),
  ) + `</g>`;
}

/* ------------------------------------------------------------------
   El león: la melena, la boca, la quijada y la cara
   ------------------------------------------------------------------ */

const [MX, MY] = A.cabeza;

/** Un mechón: una llama de pelo que sale a `r0` en el ángulo `a` y termina a `r1`, curvada. */
function mechon(a: number, r0: number, r1: number, w: number, tuerce: number, color: string, o = 1): string {
  const en = (ang: number, r: number): P => [MX + Math.cos(ang) * r * 1.1, MY + Math.sin(ang) * r];
  const [bx, by] = en(a, r0);
  const [tx, ty] = en(a + tuerce, r1);
  const [mx, my] = en(a + tuerce * 0.45, (r0 + r1) / 2);
  const [nx, ny] = [-(ty - by), tx - bx];
  const l = Math.hypot(nx, ny) || 1;
  const [ux, uy] = [(nx / l) * w, (ny / l) * w];
  return forma(curva([[bx + ux, by + uy], [mx + ux * 0.7, my + uy * 0.7], [tx, ty], [mx - ux * 0.5, my - uy * 0.5], [bx - ux, by - uy]]), color, o);
}

/** Una capa de mechones alrededor de la cabeza, entre los ángulos `a0` y `a1`. */
function capaDeMechones(r: () => number, n: number, r0: number, r1: number, w: number, color: string, o: number, gris = false, [a0, a1] = [0, Math.PI * 2]): string {
  return Array.from({ length: n }, (_, i) => {
    const a = a0 + ((i + 0.5) / n) * (a1 - a0) + (r() - 0.5) * 0.2;
    const largo = r1 * (0.86 + r() * 0.28);
    const cana = gris && i % 5 === 2;
    return mechon(a, r0, largo, w * (0.8 + r() * 0.4), (r() - 0.4) * 0.34, cana ? C.pielClara : color, cana ? o * 0.5 : o);
  }).join('');
}

function melena(): string {
  const r = semilla(41);
  const lumpy: P[] = Array.from({ length: 26 }, (_, i) => {
    const a = (i / 26) * Math.PI * 2;
    const k = 0.72 + r() * 0.1;
    return [MX + Math.cos(a) * 92 * k, MY + Math.sin(a) * 84 * k] as P;
  });
  const d = curva(lumpy);
  const grumos = Array.from({ length: 16 }, () => {
    const a = Math.PI * (1.05 + r() * 0.9);
    const rr = 48 + r() * 32;
    return forma(elipse(MX + Math.cos(a) * rr * 1.1, MY + Math.sin(a) * rr, 1.4 + r() * 1.8, 1 + r() * 1.2), r() < 0.5 ? C.tierra : C.tierraHonda);
  }).join('');
  return conGrano(
    // Tres capas de mechones: los de atrás largos y hondos, los del medio, y los de luz, finitos, algunos ya grises.
    capaDeMechones(r, 26, 48, 94, 14, C.melenaHonda, 1) +
    enmascarado('m-rey-melena', d,
      forma(d, C.melenaHonda) +
      nube(MX, MY - 44, 64, 26, C.melena, 'l', 0.9) + nube(MX - 46, MY - 14, 22, 34, C.melena, 'm', 0.7) + nube(MX + 46, MY - 14, 22, 34, C.melena, 'm', 0.7) +
      nube(MX, MY + 34, 60, 30, C.tinta, 'l', 0.7) + nube(MX, MY - 4, 44, 44, C.tinta, 'l', 0.45)) +
    capaDeMechones(r, 24, 46, 82, 10, C.melena, 0.9) +
    capaDeMechones(r, 30, 50, 78, 2.6, C.melenaClara, 0.45, true) +
    // La sombra de abajo, que la poca luz del monte viene de arriba.
    nube(MX, MY + 44, 90, 40, C.tinta, 'xl', 0.55) +
    grumos +
    trazo(`M${MX - 76} ${MY - 30} q10 -14 24 -10 q8 2 14 -6 q4 -6 12 -4`, C.palo, 1.1, 0.75) + trazo(`M${MX - 56} ${MY - 40} l-4 -8`, C.palo, 0.8, 0.7),
  );
}

/** La boca por dentro, abierta: lo hondo, la lengua y los dientes de arriba, con un colmillo partido. */
function boca(): string {
  const d = curva([[-26, -76], [0, -79], [26, -76], [22, -52], [0, -36], [-22, -52]]);
  const colmillo = (x: number, largo: number, partido = false): string => {
    const punta = partido ? poli([[x - 3.4, -74], [x + 3.4, -74], [x + 2.4, -74 + largo], [x + 0.6, -74 + largo - 1.6], [x - 0.8, -74 + largo + 0.6], [x - 2.4, -74 + largo - 1]]) : curva([[x - 3.4, -74], [x + 3.4, -74], [x + 1.4, -74 + largo * 0.7], [x, -74 + largo], [x - 1.4, -74 + largo * 0.7]]);
    return forma(punta, C.hueso) + nube(x + 1.6, -74 + largo * 0.5, 1.2, largo * 0.4, C.lata, 'xs', 0.8);
  };
  return conGrano(
    enmascarado('m-rey-boca', d,
      forma(d, C.boca) + nube(0, -56, 14, 10, C.tinta, 'm', 0.95) + nube(-14, -70, 8, 5, C.rojo, 's', 0.5) +
      // La lengua, gruesa, con la raya del medio.
      nube(0, -40, 18, 7, C.rojo, 's', 0.95) + trazo('M0 -46 L0 -38', C.boca, 0.8, 0.8) + nube(-4, -43, 5, 2, C.pielClara, 'xs', 0.35)) +
    [-6, -2, 2, 6].map((x) => forma(cajaRedonda(x - 1.6, -75, 3.2, 4.2, 1), C.hueso)).join('') +
    colmillo(-14, 14, true) + colmillo(14, 15),
  );
}

/** La quijada, con la barba, el labio de abajo y los colmillos de abajo (que no se ven con la boca cerrada). */
function quijada(): string {
  const d = curva([[-24, -79], [-12, -80], [0, -80], [12, -80], [24, -79], [18, -62], [10, -51], [0, -47], [-10, -51], [-18, -62]]);
  return conGrano(
    [-11, 11].map((x) => forma(curva([[x - 2.6, -76], [x + 2.6, -76], [x + 0.8, -84], [x, -88], [x - 0.8, -84]]), C.hueso)).join('') +
    enmascarado('m-rey-quijada', d,
      forma(d, C.piel) + nube(0, -60, 12, 8, C.pielClara, 'm', 0.6) + nube(0, -46, 26, 8, C.melenaHonda, 'm', 0.9) + nube(0, -74, 22, 4, C.tinta, 's', 0.7) +
      nube(-22, -66, 6, 12, C.melena, 's', 0.8) + nube(22, -66, 6, 12, C.melena, 's', 0.8) +
      // El labio de abajo, negro, y la barba rala.
      trazo('M-22 -78 Q0 -73 22 -78', C.tinta, 3) +
      [-12, -6, 0, 6, 12].map((x, i) => trazo(`M${x} -52 l${(i - 2) * 0.8} 6`, C.melenaClara, 0.9, 0.7)).join('')),
  );
}

/** Las orejas: redondas, chicas para lo que es, y la derecha mordida. */
function orejas(): string {
  return [-1, 1].map((s) => {
    const [ox, oy] = [s * 48, -158];
    const d = s > 0
      ? curva([[ox - 10, oy + 8], [ox - 11, oy - 4], [ox - 5, oy - 11], [ox - 1, oy - 7], [ox + 2, oy - 12], [ox + 9, oy - 7], [ox + 11, oy + 4], [ox + 6, oy + 10]])
      : curva([[ox - 10, oy + 8], [ox - 12, oy - 4], [ox - 5, oy - 12], [ox + 4, oy - 12], [ox + 10, oy - 5], [ox + 10, oy + 6]]);
    return enmascarado(`m-rey-oreja-${s > 0 ? 'd' : 'i'}`, d,
      forma(d, C.melena) + nube(ox, oy, 6, 6, C.melenaHonda, 's', 0.95) + nube(ox - s * 4, oy - 6, 5, 3, C.melenaClara, 's', 0.7)) +
      (s > 0 ? trazo(`M${ox - 5} ${oy - 11} l4 4 l3 -5`, C.tinta, 0.6, 0.7) : '');
  }).join('');
}

const CARA: readonly P[] = [[-36, -150], [-18, -158], [0, -160], [18, -158], [36, -150], [48, -130], [52, -108], [46, -92], [34, -80], [22, -74], [10, -72], [0, -73], [-10, -72], [-22, -74], [-34, -80], [-46, -92], [-52, -108], [-48, -130]];

/** Un ojo: almendra caída del lado de afuera, de viejo, con el blanco, el iris verde y el borde. */
const almendra = (s: number): string => {
  const [ex, ey] = A.ojos[s > 0 ? 1 : 0];
  return curva([[ex - s * 8, ey - 0.6], [ex - s * 2, ey - 4.6], [ex + s * 5, ey - 3.4], [ex + s * 8.6, ey + 2], [ex + s * 2, ey + 3.6], [ex - s * 4, ey + 3]]);
};

function cara(): string {
  const d = curva(CARA);
  const r = semilla(53);
  const ojos = [-1, 1].map((s) => {
    const [ex, ey] = A.ojos[s > 0 ? 1 : 0];
    const al = almendra(s);
    return nube(ex, ey - 1, 13, 9, C.tinta, 's', 0.75) +
      // El ojo de león es todo iris: verde, con el párpado que le hace sombra arriba y un brillo húmedo abajo.
      enmascarado(`m-rey-ojo-${s > 0 ? 'd' : 'i'}`, al, forma(al, C.ojo) + nube(ex, ey - 4, 9, 3, C.tinta, 's', 0.85) + nube(ex - s * 7, ey + 1, 2, 2, C.pielClara, 'xs', 0.5) + trazo(`M${ex - s * 4} ${ey + 2.6} Q${ex} ${ey + 3.6} ${ex + s * 5} ${ey + 2.4}`, C.pielClara, 0.5, 0.5)) +
      trazo(al, C.tinta, 1.1) +
      // La bolsa de abajo, de viejo, y la ceja pesada que se le cae para afuera.
      trazo(`M${ex - s * 7} ${ey + 5.4} Q${ex} ${ey + 9} ${ex + s * 9} ${ey + 5}`, C.melenaHonda, 0.8, 0.8) +
      nube(ex + s * 2, ey - 10, 12, 3.4, C.melenaHonda, 's', 0.9) +
      trazo(`M${ex - s * 10} ${ey - 9} Q${ex} ${ey - 13} ${ex + s * 12} ${ey - 5}`, C.melenaHonda, 2.6, 0.9) +
      trazo(`M${ex - s * 9} ${ey - 11} Q${ex} ${ey - 14.4} ${ex + s * 10} ${ey - 7.6}`, C.pielClara, 0.7, 0.45);
  }).join('');
  const nariz = curva([[-12, -97], [0, -99], [12, -97], [8, -88], [0, -83], [-8, -88]]);
  const bigotes = [-1, 1].map((s) => [-2, 1.5, 5].map((dy, i) => trazo(`M${s * 18} ${-79 + dy} q${s * 12} ${-2 + i * 2} ${s * (24 - i * 3)} ${2 + i * 3}`, C.hueso, 0.5, 0.4)).join('')).join('');
  return conGrano(
    orejas() +
    enmascarado('m-rey-cara', d,
      forma(d, C.piel) +
      // Lo hondo de los costados y de la frente; la luz solo en el caballete de la nariz y en el hocico.
      nube(-44, -110, 18, 40, C.melenaHonda, 'm', 0.9) + nube(44, -110, 18, 40, C.melenaHonda, 'm', 0.9) +
      nube(0, -158, 46, 10, C.melena, 'm', 0.9) +
      nube(0, -132, 7, 26, C.pielClara, 'm', 0.5) + nube(-14, -142, 10, 6, C.pielClara, 's', 0.3) + nube(0, -82, 22, 7, C.pielClara, 's', 0.6) +
      nube(0, -104, 30, 6, C.melenaHonda, 's', 0.6) +
      // Las arrugas de la frente, de tanto mirar para arriba.
      [0, 1, 2].map((i) => trazo(`M${-15 + i * 2} ${-138 + i * 5} Q0 ${-143 + i * 5} ${15 - i * 2} ${-138 + i * 5}`, C.melenaHonda, 0.9, 0.6)).join('') +
      ojos +
      // La cicatriz de cuando era rey, de la ceja izquierda a la frente, con los puntos.
      trazo('M-34 -100 L-8 -148', C.tinta, 2.4, 0.6) + trazo('M-33 -101 L-8 -148', C.pielClara, 0.8, 0.4) +
      [0.25, 0.5, 0.75].map((k) => trazo(`M${-34 + 26 * k - 2} ${-100 - 48 * k - 1} l4 2`, C.melenaHonda, 0.5, 0.8)).join('') +
      // La nariz: ancha, negra, con las fosas, y las almohadillas de los bigotes.
      forma(nariz, C.tinta) + nube(-2, -95, 5, 1.6, C.pielClara, 'xs', 0.4) + forma(elipse(-5, -89, 2, 1.2), C.boca) + forma(elipse(5, -89, 2, 1.2), C.boca) +
      trazo('M0 -83 L0 -77 M0 -77 Q-8 -72 -16 -74 M0 -77 Q8 -72 16 -74', C.tinta, 1.2) +
      [-1, 1].map((s) => [[10, -79], [15, -80], [20, -78], [13, -76], [18, -75]].map(([x, y]) => forma(elipse(s * x!, y!, 0.6, 0.6), C.melenaHonda)).join('')).join('') +
      // La tierra pegada en la frente.
      forma(elipse(-12, -150, 2, 1.4), C.tierra) + forma(elipse(20, -146, 1.4, 1), C.tierraHonda) + forma(elipse(30, -132, 1.8, 1.2), C.tierra)) +
    // El flequillo de la melena, que le cae sobre la frente, y la gola de los cachetes.
    capaDeMechones(r, 8, 44, 70, 8, C.melenaHonda, 1, false, [-Math.PI * 0.86, -Math.PI * 0.14]) +
    capaDeMechones(r, 9, 46, 66, 4.4, C.melena, 0.95, false, [-Math.PI * 0.82, -Math.PI * 0.18]) +
    capaDeMechones(r, 3, 44, 62, 4, C.melena, 0.9, false, [-0.5, 0.3]) + capaDeMechones(r, 3, 44, 62, 4, C.melena, 0.9, false, [Math.PI - 0.3, Math.PI + 0.5]) +
    trazo('M-26 -76 Q-12 -71 0 -73 Q12 -71 26 -76', C.melenaHonda, 1.2, 0.8) + bigotes,
  );
}

/** Las pupilas, que miran una flor y otra. */
function pupilas(): string {
  return [0, 1].map((i) => {
    const [ex, ey] = A.ojos[i]!;
    return forma(elipse(ex, ey, 2.5, 2.7), C.tinta) + forma(elipse(ex - 1, ey - 1.2, 0.8, 0.7), C.hueso, 0.9);
  }).join('');
}

/** Los párpados, pesados, del pelo de la cara. */
function parpado(): string {
  return conGrano([-1, 1].map((s) => {
    const [ex, ey] = A.ojos[s > 0 ? 1 : 0];
    const al = almendra(s);
    return enmascarado(`m-rey-parpado-${s > 0 ? 'd' : 'i'}`, al, forma(elipse(ex, ey, 11, 8), C.piel) + nube(ex, ey - 4, 8, 3, C.melena, 's', 0.8)) +
      trazo(`M${ex - s * 8} ${ey} Q${ex} ${ey + 3.4} ${ex + s * 8.6} ${ey + 2}`, C.melenaHonda, 1.1);
  }).join(''));
}

/* ------------------------------------------------------------------
   La tierra: el montículo, las grietas, los terrones
   ------------------------------------------------------------------ */

/** El borde de arriba del montículo, de punta a punta, con los terrones del borde. */
function borde(): P[] {
  const r = semilla(17);
  const pts: P[] = [];
  for (let x = -LOMA.ancho - 8; x <= LOMA.ancho + 8; x += 7) {
    const lomo = (Math.abs(x) < 50 ? 1.4 : 2.4) * (r() - 0.5);
    pts.push([x, Math.min(2, cumbre(x) + lomo)]);
  }
  return pts;
}

function tierra(): string {
  const arriba = borde();
  const d = curva([...arriba, [LOMA.ancho + 10, 4], [60, 8], [0, 9], [-60, 8], [-LOMA.ancho - 10, 4]]);
  const r = semilla(23);
  // Los terrones de la tierra removida: cada uno con su luz arriba y su sombra abajo.
  const terrones = Array.from({ length: 34 }, () => {
    const x = (r() - 0.5) * 250;
    const y = cumbre(x) * (0.15 + r() * 0.75);
    const [w, h] = [2 + r() * 5, 1.4 + r() * 3];
    return forma(elipse(x, y + h * 0.4, w, h), C.tierraHonda, 0.8) + forma(elipse(x, y, w, h), r() < 0.5 ? C.tierra : C.tierraClara) + nube(x - w * 0.2, y - h * 0.5, w * 0.6, h * 0.3, C.melenaClara, 'xs', 0.45);
  }).join('');
  const piedras = [[-70, -12], [38, -20], [118, -8], [-128, -4]].map(([x, y], i) => forma(elipse(x!, y!, 3.4 + i, 2.2 + i * 0.6), C.lataHonda) + nube(x! - 1, y! - 1, 2, 1, C.lata, 'xs', 0.5)).join('');
  // Un hueso que asoma de la tierra, del lado del patín: no se sabe de quién.
  const hueso = `<g transform="rotate(-24 104 -28)">` + forma(cajaRedonda(92, -30, 22, 4.4, 2), C.hueso) + forma(elipse(114, -30.4, 3, 2.4), C.hueso) + forma(elipse(114, -26.6, 3, 2.4), C.hueso) + nube(100, -26, 10, 1.4, C.lataHonda, 'xs', 0.7) + `</g>`;
  const pasto = [[-142, 2], [-100, -40], [-30, -12], [70, -58], [132, 0], [146, 3]].map(([x, y]) => [-3, 0, 3].map((dx, i) => trazo(`M${x! + dx} ${y!} q${dx * 0.5} -5 ${dx} ${-7 - i * 2}`, C.tallo, 0.9, 0.85)).join('')).join('');
  // Tres florcitas de nada, blancas, que ya estaban antes de que lo enterraran.
  const florcitas = [[-84, -54], [20, -36], [110, -40]].map(([x, y]) => trazo(`M${x} ${y! + 6} l0 -6`, C.tallo, 0.6) + [0, 72, 144, 216, 288].map((a) => {
    const [px, py] = rot([x! + 2, y!], [x!, y!], a);
    return forma(elipse(px, py, 1.2, 1.2), C.hueso, 0.9);
  }).join('') + forma(elipse(x!, y!, 0.8, 0.8), C.oro)).join('');
  return conGrano(
    nube(0, 6, 170, 7, C.tierraHonda, 'm', 0.9) +
    enmascarado('m-rey-tierra', d,
      forma(d, C.tierra) +
      nube(0, -84, 120, 22, C.tierraClara, 'l', 0.75) + nube(-40, -60, 40, 26, C.tierraClara, 'm', 0.4) +
      nube(0, 0, 170, 24, C.tierraHonda, 'l', 0.9) + nube(-130, -10, 20, 30, C.tierraHonda, 'm', 0.8) + nube(130, -10, 20, 30, C.tierraHonda, 'm', 0.8) +
      // El hueco donde asoma la cara: la tierra se abre y se ve lo hondo.
      nube(0, -102, 52, 5, C.tierraHonda, 's', 0.95) + nube(0, -98, 40, 8, C.tierra, 's', 0.6) +
      terrones + piedras + hueso +
      // Las raíces finas que salen del corte.
      trazo('M-60 -70 q6 8 2 16 q-2 4 2 8', C.melenaClara, 0.6, 0.5) + trazo('M70 -60 q-4 10 0 18', C.melenaClara, 0.6, 0.5)) +
    pasto + florcitas,
  );
}

/** Las grietas de la tierra que se levanta: salen del hueco de la cara para abajo. */
function grietas(): string {
  const rama = (pts: readonly P[]): string => {
    const d = `M${pts.map(([x, y]) => `${x} ${y}`).join(' L')}`;
    return trazo(d, C.tierraClara, 3.2, 0.7) + trazo(d, C.tierraHonda, 1.8) + trazo(d, C.tinta, 0.7, 0.8);
  };
  return conGrano(
    rama([[-30, -98], [-44, -84], [-46, -70], [-62, -56], [-70, -38]]) + rama([[-46, -70], [-36, -54], [-38, -40]]) +
    rama([[24, -99], [36, -86], [52, -80], [60, -62], [76, -50]]) + rama([[52, -80], [70, -76], [86, -72]]) +
    rama([[-4, -102], [-8, -86], [2, -74], [-4, -58]]) + rama([[10, -100], [18, -84], [14, -70]]) +
    nube(0, -100, 40, 6, C.tinta, 's', 0.6),
  );
}

/** Los terrones que salta la cabeza al salir. */
function terrones(): string {
  const r = semilla(61);
  return conGrano(Array.from({ length: 11 }, (_, i) => {
    const a = Math.PI * (1.08 + (i / 10) * 0.84) + (r() - 0.5) * 0.2;
    const rr = 30 + r() * 26;
    const [x, y] = [MX + Math.cos(a) * rr * 1.5, MY + Math.sin(a) * rr * 0.8 + 6];
    const [w, h] = [2.4 + r() * 3.6, 2 + r() * 2.6];
    return forma(poli([[x - w, y], [x - w * 0.4, y - h], [x + w * 0.8, y - h * 0.7], [x + w, y + h * 0.4], [x, y + h]]), i % 3 ? C.tierra : C.tierraClara) + forma(elipse(x - w * 0.2, y - h * 0.4, w * 0.4, h * 0.3), C.melenaClara, 0.5);
  }).join(''));
}

/* ------------------------------------------------------------------
   Las flores
   ------------------------------------------------------------------ */

const COLOR_FLOR = [C.flor, C.rojo, C.rojo, C.flor] as const;
const HONDO_FLOR = [C.melena, C.boca, C.boca, C.melena] as const;
const RADIO_FLOR = [11, 9, 13, 9] as const;

function tallo(n: number): string {
  const f = A.flores[n]!;
  const [bx, by] = f.base;
  const [tx, ty] = puntaDe(n);
  const d = `M${bx} ${by} C${bx - f.lean * 0.6} ${by - f.alto * 0.4} ${tx + f.lean * 0.4} ${ty + f.alto * 0.45} ${tx} ${ty}`;
  const hoja = (k: number, s: number, l: number): string => {
    const [x, y] = [bx + (tx - bx) * k - f.lean * 0.15, by + (ty - by) * k];
    const h = curva([[x, y], [x + s * l * 0.5, y - l * 0.5], [x + s * l, y - l * 0.3], [x + s * l * 0.5, y + 0.6]]);
    return forma(h, C.tallo) + trazo(`M${x} ${y} Q${x + s * l * 0.5} ${y - l * 0.3} ${x + s * l * 0.9} ${y - l * 0.28}`, C.melenaHonda, 0.5, 0.6) + nube(x + s * l * 0.4, y - l * 0.36, l * 0.3, 1, C.pielClara, 'xs', 0.35);
  };
  return conGrano(
    trazo(d, C.melenaHonda, 3.2, 0.6) + trazo(d, C.tallo, 2.2) + trazo(d, C.pielClara, 0.5, 0.35) +
    hoja(0.3, n % 2 ? 1 : -1, 12) + hoja(0.55, n % 2 ? -1 : 1, 10) +
    forma(elipse(bx, by + 1, 4, 1.6), C.tierraHonda, 0.8),
  );
}

function capullo(n: number): string {
  const [tx, ty] = puntaDe(n);
  const d = curva([[tx, ty + 2], [tx - 4, ty - 4], [tx - 1.4, ty - 11], [tx + 1.4, ty - 11], [tx + 4, ty - 4]]);
  return conGrano(
    enmascarado(`m-rey-capullo-${n + 1}`, d, forma(d, COLOR_FLOR[n]!) + nube(tx + 2, ty - 4, 2.4, 6, HONDO_FLOR[n]!, 's', 0.9) + nube(tx - 1.6, ty - 7, 1, 3, C.pielClara, 'xs', 0.5)) +
    // Los sépalos verdes que lo tienen apretado.
    [-1, 0, 1].map((s) => forma(curva([[tx, ty + 1.4], [tx + s * 4.4, ty - 3], [tx + s * 2, ty - 6.4 + Math.abs(s)], [tx + s * 0.6, ty - 1.6]]), C.tallo)).join(''),
  );
}

function corola(n: number): string {
  const [tx, ty] = puntaDe(n);
  const rr = RADIO_FLOR[n]!;
  const petalos = Array.from({ length: 6 }, (_, i) => {
    const a = i * 60 + n * 17;
    const [px, py] = rot([tx, ty - rr * 0.55], [tx, ty], a);
    const d = elipse(px, py, rr * 0.34, rr * 0.58);
    return `<g transform="rotate(${a} ${px} ${py})">` + enmascarado(`m-rey-petalo-${n + 1}-${i}`, d, forma(d, COLOR_FLOR[n]!) + nube(px, py + rr * 0.4, rr * 0.3, rr * 0.3, HONDO_FLOR[n]!, 's', 0.9) + nube(px - rr * 0.1, py - rr * 0.3, rr * 0.12, rr * 0.25, C.pielClara, 'xs', 0.4)) + `</g>`;
  }).join('');
  return conGrano(
    petalos +
    forma(elipse(tx, ty, rr * 0.28, rr * 0.28), C.tinta) + nube(tx, ty, rr * 0.2, rr * 0.2, C.boca, 'xs', 0.6) +
    [0, 1, 2, 3, 4].map((i) => {
      const [px, py] = rot([tx, ty - rr * 0.18], [tx, ty], i * 72);
      return forma(elipse(px, py, 0.7, 0.7), C.oro);
    }).join(''),
  );
}

/** El pétalo que se le cae a la flor 1. */
function petalo(): string {
  const [tx, ty] = puntaDe(0);
  const d = elipse(tx + 4, ty + 1, 2.6, 5);
  return conGrano(enmascarado('m-rey-petalo-suelto', d, forma(d, C.flor) + nube(tx + 4, ty + 4, 2, 2, C.melena, 's', 0.8)));
}

/** El escarabajo, un cascarudo negro con el brillo verde, que cruza el montículo para la derecha. */
function bicho(): string {
  const [x, y] = A.bicho;
  const lomo = elipse(x, y - 3, 6, 3.8);
  return conGrano(
    [-3, 0, 3].map((dx, i) => trazo(`M${x + dx} ${y - 1} l${-1 + i} 3.4`, C.tinta, 0.6)).join('') +
    enmascarado('m-rey-bicho', lomo, forma(lomo, C.tinta) + nube(x - 1, y - 5, 3, 1.4, C.ojo, 'xs', 0.9) + trazo(`M${x - 5} ${y - 3} L${x + 4} ${y - 3}`, C.lataHonda, 0.4, 0.8)) +
    forma(elipse(x + 6.6, y - 2.4, 1.8, 1.6), C.tinta) +
    trazo(`M${x + 7.6} ${y - 3.4} q2 -3 4 -2.4 M${x + 7.6} ${y - 3} q3 -1 4.4 0.6`, C.tinta, 0.4),
  );
}

/* ------------------------------------------------------------------
   La corona de lata y el patín
   ------------------------------------------------------------------ */

/** La corona, recortada con tijera de una lata de tomate: parada, con el medio en `A.corona`. */
function corona(): string {
  const [cx, cy] = A.corona;
  const [x0, x1] = [cx - 20, cx + 20];
  const base = cy + 12;
  const puntas: P[] = [[x0, base], [x0, cy - 2]];
  for (let i = 0; i < 5; i++) {
    const xm = x0 + 4 + i * 8;
    puntas.push([xm - 2, cy - 2 + (i % 2) * 1.4], [xm, cy - 14 + (i === 2 ? -3 : 0)], [xm + 2, cy - 2 + (i % 2) * 1.4]);
  }
  puntas.push([x1, cy - 2], [x1, base]);
  const d = poli(puntas);
  return conGrano(
    enmascarado('m-rey-corona', d,
      forma(d, C.lata) + nube(cx + 4, cy + 4, 26, 16, C.tinta, 'l', 0.45) +
      // Por dentro de la lata, del otro lado de las puntas: el papel desteñido de la lata de tomate.
      forma(cajaRedonda(x0, cy - 4, 40, 6, 1), C.rojo, 0.55) + trazo(`M${x0} ${cy - 1} L${x1} ${cy - 1}`, C.oro, 0.8, 0.5) +
      nube(cx + 12, cy + 2, 10, 12, C.lataHonda, 'm', 0.9) + nube(cx - 12, cy, 6, 10, C.hueso, 's', 0.6) +
      // Las abolladuras, el óxido de los cantos y las marcas de la tijera.
      nube(cx - 3, cy + 6, 4, 3, C.lataHonda, 's', 0.8) + nube(cx + 6, cy - 6, 2, 3, C.tierraClara, 'xs', 0.8) + nube(x1 - 1, base - 2, 3, 3, C.tierraClara, 's', 0.7) +
      trazo(`M${x0} ${cy + 3} L${x1} ${cy + 3} M${x0} ${cy + 9} L${x1} ${cy + 9}`, C.lataHonda, 0.7, 0.7)) +
    // Las bolitas de las puntas, de estaño, y una punta doblada para atrás.
    [0, 1, 3, 4].map((i) => forma(elipse(x0 + 4 + i * 8, cy - 14.6, 1.6, 1.6), C.oro)).join('') +
    trazo(`M${cx} ${cy - 15} q3 -3 6 -1`, C.lata, 1.6) + forma(elipse(cx + 6.4, cy - 16, 1.4, 1.4), C.oro) +
    trazo(`M${x0} ${base} L${x1} ${base}`, C.lataHonda, 1.1),
  );
}

function patin(): string {
  const plato = cajaRedonda(146, -21, 70, 6, 2);
  const talon = curva([[146, -15], [144, -30], [150, -37], [159, -35], [160, -20]]);
  const punta = poli([[204, -15], [206, -28], [210, -29], [212, -20], [216, -15]]);
  return conGrano(
    nube(182, 1, 40, 3, C.tierraHonda, 's', 0.9) +
    // Las ruedas de atrás, del otro lado, en la sombra.
    forma(elipse(166, -10, 6.4, 6.4), C.lataHonda) + forma(elipse(209, -8.4, 6.4, 6.4), C.lataHonda) +
    // Los ejes, debajo del plato.
    forma(poli([[154, -15], [166, -15], [163, -8], [157, -8]]), C.lataHonda) + forma(poli([[197, -15], [209, -15], [206, -6], [200, -6]]), C.lataHonda) +
    enmascarado('m-rey-plato', plato, forma(plato, C.lata) + nube(196, -18, 30, 6, C.tinta, 'm', 0.7) + nube(168, -16, 20, 4, C.tinta, 's', 0.4) + nube(182, -16, 34, 2, C.lataHonda, 's', 0.9) + nube(170, -21, 18, 1, C.hueso, 'xs', 0.7) +
      // La ranura para alargarlo, con la tuerca mariposa, y el óxido.
      trazo('M172 -18 L196 -18', C.tinta, 1.2) + forma(elipse(186, -18.4, 2, 1.6), C.lataHonda) + nube(152, -18, 4, 2, C.tierraClara, 'xs', 0.8)) +
    enmascarado('m-rey-talon', talon, forma(talon, C.lata) + nube(158, -24, 8, 12, C.tinta, 'm', 0.35) + nube(156, -26, 4, 8, C.lataHonda, 's', 0.9) + nube(149, -30, 2, 4, C.hueso, 'xs', 0.6) + nube(152, -20, 3, 3, C.tierraClara, 'xs', 0.7)) +
    forma(punta, C.lata) + trazo('M206 -26 L212 -22', C.lataHonda, 0.9) + forma(elipse(209, -20, 1.2, 1.2), C.lataHonda) +
    // La correa de cuero, suelta, que cuelga del talón con la hebilla.
    trazo('M150 -34 Q138 -30 140 -18 Q141 -10 136 -4', C.melenaHonda, 3.2) + trazo('M150 -34 Q138 -30 140 -18 Q141 -10 136 -4', C.melena, 2.2) +
    forma(cajaRedonda(137, -22, 6, 5, 1), C.oro) + forma(cajaRedonda(138.4, -20.8, 3.2, 2.6, 0.6), C.melenaHonda) +
    [-10, -6].map((y) => forma(elipse(139, y, 0.7, 0.7), C.melenaHonda)).join('') +
    // La llave del patín, colgada de un hilo, tirada en el pasto.
    trazo('M212 -22 Q220 -16 222 -4', C.palo, 0.6, 0.9) +
    forma(cajaRedonda(219, -5, 9, 2.6, 1), C.lataHonda) + forma(cajaRedonda(221, -9.4, 2.6, 8.4, 1), C.lataHonda) + forma(elipse(222.3, -8.4, 1, 1), C.lata),
  );
}

/** Una rueda de lata, con el eje, un remache y la mancha de pintura roja para verla girar. La 2 está torcida. */
function rueda(n: 1 | 2): string {
  const [x, y] = A.ruedas[n - 1]!;
  const r = A.rueda;
  const [rx, ry] = n === 2 ? [r * 0.88, r] : [r, r];
  return conGrano(
    forma(elipse(x, y, rx, ry), C.lataHonda) + forma(elipse(x, y, rx - 1.4, ry - 1.4), C.lata) + nube(x + 2, y + 2, rx * 0.6, ry * 0.6, C.lataHonda, 's', 0.9) + nube(x + 1, y + 3, rx * 0.8, ry * 0.5, C.tinta, 's', 0.4) +
    nube(x - 2, y - 2, 1.6, 1.4, C.hueso, 'xs', 0.7) +
    trazo(elipse(x, y, rx - 2.6, ry - 2.6), C.lataHonda, 0.5, 0.7) +
    forma(elipse(x, y, 2, 2), C.tinta) + forma(elipse(x, y - 4, 0.9, 0.9), C.lataHonda) + forma(elipse(x + 3.4, y + 2, 0.9, 0.9), C.lataHonda) +
    forma(elipse(x - 4.2, y + 3, 1.6, 1.2), C.rojo),
  );
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 3.4;
const [CX, CY] = A.corona;
const PT = puntaDe(0);

const caja4 = (n: number, w: number, h: number): readonly [number, number, number, number] => {
  const [tx, ty] = puntaDe(n);
  return [tx - w / 2, ty - h / 2, w, h];
};

export const PIEZAS_REY: readonly Pieza[] = [
  { nombre: 'rey-cruz', caja: [-146, -250, 96, 216], dibujo: cruz(), densidad: 2.6 },
  { nombre: 'rey-melena', caja: [-104, -200, 208, 192], dibujo: melena(), densidad: 1.5 },
  { nombre: 'rey-boca', caja: [-30, -84, 60, 52], dibujo: boca(), densidad: D },
  { nombre: 'rey-quijada', caja: [-32, -92, 64, 50], dibujo: quijada(), densidad: D },
  { nombre: 'rey-cara', caja: [-84, -192, 168, 126], dibujo: cara(), densidad: 3 },
  { nombre: 'rey-pupilas', caja: [-24, -120, 48, 16], dibujo: pupilas(), densidad: D * 2 },
  { nombre: 'rey-parpado', caja: [-30, -124, 60, 24], dibujo: parpado(), densidad: D * 1.5 },
  { nombre: 'rey-tierra', caja: [-170, -118, 340, 132], dibujo: tierra(), densidad: 2 },
  { nombre: 'rey-grietas', caja: [-76, -108, 168, 74], dibujo: grietas(), densidad: 1.5 },
  ...[0, 1, 2, 3].flatMap((n): Pieza[] => {
    const f = A.flores[n]!;
    const [tx, ty] = puntaDe(n);
    const [x0, x1] = [Math.min(f.base[0], tx) - 16, Math.max(f.base[0], tx) + 16];
    const rr = RADIO_FLOR[n]!;
    return [
      { nombre: `rey-tallo-${n + 1}`, caja: [x0, ty - 2, x1 - x0, f.base[1] - ty + 6], dibujo: tallo(n), densidad: D },
      { nombre: `rey-capullo-${n + 1}`, caja: caja4(n, 14, 30), dibujo: capullo(n), densidad: D * 1.5 },
      { nombre: `rey-corola-${n + 1}`, caja: caja4(n, rr * 2.6, rr * 2.6), dibujo: corola(n), densidad: D * 1.3 },
    ];
  }),
  { nombre: 'rey-bicho', caja: [A.bicho[0] - 8, A.bicho[1] - 9, 22, 12], dibujo: bicho(), densidad: D * 2 },
  { nombre: 'rey-terrones', caja: [-90, -160, 180, 86], dibujo: terrones(), densidad: 2 },
  { nombre: 'rey-petalo', caja: [PT[0] - 4, PT[1] - 8, 16, 18], dibujo: petalo(), densidad: D * 2 },
  { nombre: 'rey-corona', caja: [CX - 24, CY - 22, 48, 38], dibujo: corona(), densidad: D * 1.5 },
  { nombre: 'rey-patin', caja: [130, -42, 102, 48], dibujo: patin(), densidad: 2.8 },
  { nombre: 'rey-rueda-1', caja: [A.ruedas[0][0] - 8, A.ruedas[0][1] - 8, 16, 16], dibujo: rueda(1), densidad: D * 2 },
  { nombre: 'rey-rueda-2', caja: [A.ruedas[1][0] - 8, A.ruedas[1][1] - 8, 16, 16], dibujo: rueda(2), densidad: D * 2 },
];

const img = imagenesDe(PIEZAS_REY);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/**
 * La tumba armada con las marcas de un momento. La cabeza va detrás de la tierra: lo que baja del borde del
 * montículo lo tapa la tierra misma, así que no hace falta recorte (y el títere y el retrato no comparten ids).
 */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  const flor = (n: number): string =>
    parte(`flor-${n}`,
      img(`rey-tallo-${n}`) +
      parte(`capullo-${n}`, img(`rey-capullo-${n}`), '', o[`capullo-${n}`]) +
      parte(`corola-${n}`, img(`rey-corola-${n}`), t[`corola-${n}`], o[`corola-${n}`]),
      t[`flor-${n}`]);
  return (
    parte('cruz', img('rey-cruz'), t.cruz) +
    parte('cabeza',
      img('rey-melena') +
      parte('boca', img('rey-boca'), '', o.boca) +
      parte('quijada', img('rey-quijada'), t.quijada) +
      img('rey-cara') +
      parte('pupilas', img('rey-pupilas'), t.pupilas) +
      parte('parpado', img('rey-parpado'), '', o.parpado),
      t.cabeza) +
    parte('tierra',
      img('rey-tierra') +
      parte('grietas', img('rey-grietas'), '', o.grietas) +
      flor(4) + flor(1) + flor(2) + flor(3) +
      parte('bicho', img('rey-bicho'), t.bicho, o.bicho),
      t.tierra) +
    parte('terrones', img('rey-terrones'), t.terrones, o.terrones) +
    parte('petalo', img('rey-petalo'), t.petalo, o.petalo) +
    parte('corona', img('rey-corona'), t.corona) +
    parte('patin',
      img('rey-patin') +
      parte('rueda-1', img('rey-rueda-1'), t['rueda-1']) +
      parte('rueda-2', img('rey-rueda-2'), t['rueda-2']),
      t.patin)
  );
}

/** La tumba en un momento, sin lo que la hace tocable: para el test, el retrato y para mirarla. */
export function reyEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/** El títere que se toca, en la pose quieta: enterrado hasta los ojos, mirando las flores. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--rey" data-id="el-rey-de-esta-jungla" role="button" tabindex="0" aria-label="${nombres.get('el-rey-de-esta-jungla') ?? 'El rey de esta jungla'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: asomado hasta la boca, rugiendo sin voz, con la corona torcida, entre las tiras. */
export const RETRATO = { caja: [REY.x - 92, REY.piso - 140, 210, 150] as const };
function retrato(): string {
  return `<image href="/bestiario/monte-lejos.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>` +
    `<image href="/bestiario/monte-cerca.webp" x="0" y="240" width="900" height="400" preserveAspectRatio="none"/>` + reyEn(ASOMA);
}

export const REY_PERSONAJE: Personaje = {
  id: 'el-rey-de-esta-jungla',
  region: 'el-monte',
  ancla: REY.x,
  piezas: PIEZAS_REY,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
