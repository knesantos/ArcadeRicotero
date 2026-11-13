/**
 * El Rey Garufa (`D-73`, vigesimosexta vuelta), vagando por la nieve de Cybersiberia.
 *
 * *"Así el fiestero Rey Garufa viaja solo / Y vaga con su corazón entre las manos"* es de *Las increíbles
 * andanzas del Capitán Buscapina en Cybersiberia*, en *Último bondi a Finisterre* (1998). Garufa es joda:
 * es un rey de fiesta al que se le terminó la fiesta. Lleva el frac de la noche anterior con la camisa
 * afuera y el moño desatado, una corona de lata con una punta doblada y confeti pegado, serpentina enredada
 * en los hombros y nieve encima. Y camina con el corazón en las manos, al pie de la letra: un corazón de
 * verdad, con la aorta cortada, que late y gotea, y en el pecho le quedó el agujero de donde lo sacó, que
 * brilla cada vez que late. Vaga solo por la nieve, de ida y de vuelta, siguiendo sus propias huellas.
 *
 * De la letra son el corazón entre las manos, la corona y la soledad. Del dibujo son el frac, la
 * serpentina, el confeti que se le cae de la corona cuando se tuerce, el vaho del frío y la sonrisa de
 * fiestero que le vuelve cuando alguien lo mira.
 *
 * Viste *Último bondi*, medido con sharp: el frac es el acero negro de la chapa de la tapa, la cara la piel
 * de los de la ventanilla, la corona el bronce del panel de PSICONAUTAS, el corazón la vincha roja y el as
 * de corazones, el confeti el naipe, y la serpentina y el vaho, la lente de la cámara.
 *
 * Coordenadas: el (0, 0) es la nieve entre los zapatos, y mira a la derecha (`rig-garufa.ts`).
 */

import { enmascarado, forma, imagenesDe, nube, trazo, type Pieza } from './aerografo.ts';
import type { Personaje } from './elenco.ts';
import { cajaRedonda, conGrano, curva, elipse, f, poli, type P } from './trazos.ts';
import { GARUFA, GARUFA_ARMADO as A, OFRECE, QUIETO, marcas, type Momento } from './rig-garufa.ts';

/** Las tintas de *Último bondi* (`tokens.css`). */
const C = {
  metal: 'var(--bestia-garufa-metal)',
  metalHondo: 'var(--bestia-garufa-metal-hondo)',
  cromo: 'var(--bestia-garufa-cromo)',
  cromoClaro: 'var(--bestia-garufa-cromo-claro)',
  piel: 'var(--bestia-garufa-piel)',
  pielClara: 'var(--bestia-garufa-piel-clara)',
  pielHonda: 'var(--bestia-garufa-piel-honda)',
  pelo: 'var(--bestia-garufa-pelo)',
  rojo: 'var(--bestia-garufa-rojo)',
  rojoHondo: 'var(--bestia-garufa-rojo-hondo)',
  rojoVivo: 'var(--bestia-garufa-rojo-vivo)',
  rosa: 'var(--bestia-garufa-rosa)',
  oro: 'var(--bestia-garufa-oro)',
  oroHondo: 'var(--bestia-garufa-oro-hondo)',
  oliva: 'var(--bestia-garufa-oliva)',
  naipe: 'var(--bestia-garufa-naipe)',
  lente: 'var(--bestia-garufa-lente)',
  lenteClara: 'var(--bestia-garufa-lente-clara)',
  amarillo: 'var(--bestia-garufa-amarillo)',
  nieve: 'var(--bestia-garufa-nieve)',
};

/** Un azar con semilla (mulberry32): el confeti cae siempre en el mismo lugar. */
function azar(semilla: number): () => number {
  let a = semilla;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Un papelito de confeti: un redondel o un rectángulo torcido, de una de las tintas de la fiesta. */
function papelito(x: number, y: number, rnd: () => number): string {
  const tinta = [C.naipe, C.rojoVivo, C.lente, C.amarillo, C.oro][Math.floor(rnd() * 5)]!;
  const giro = rnd() * 90;
  return rnd() < 0.5
    ? forma(elipse(x, y, 2.2, 2.2), tinta, 0.9)
    : `<g transform="rotate(${f(giro)} ${f(x)} ${f(y)})">${forma(cajaRedonda(x - 2.6, y - 1.4, 5.2, 2.8, 0.4), tinta, 0.9)}</g>`;
}

/* ------------------------------------------------------------------
   La sombra en la nieve y la capa
   ------------------------------------------------------------------ */

function sombra(): string {
  return nube(4, 2, 40, 6, C.metalHondo, 'm', 0.45);
}

/** La capa: un mantel de la fiesta anudado al cuello, que le llega a las rodillas, con el ruedo roto. */
function capa(): string {
  const [px, py] = A.capa;
  const d = curva([[px - 16, py - 2], [px + 14, py - 2], [px + 22, py + 40], [px + 18, py + 90], [px + 8, py + 112], [px - 8, py + 118], [px - 24, py + 110], [px - 40, py + 112], [px - 46, py + 80], [px - 38, py + 30]]);
  const pliegue = (x0: number): string => trazo(`M${f(x0)} ${f(py + 10)} Q${f(x0 - 6)} ${f(py + 60)} ${f(x0 - 4)} ${f(py + 108)}`, C.metalHondo, 2.2, 0.7);
  return conGrano(
    enmascarado('m-garufa-capa', d,
      forma(d, C.metal) + nube(px - 30, py + 70, 14, 50, C.metalHondo, 'm', 0.9) + nube(px + 8, py + 50, 12, 40, C.cromo, 'm', 0.35) +
      // Las manchas de la fiesta: vino y una quemadura de cigarrillo.
      nube(px - 12, py + 84, 8, 6, C.rojoHondo, 's', 0.6) + forma(elipse(px + 4, py + 96, 2.2, 2.2), C.metalHondo) +
      pliegue(px - 10) + pliegue(px - 26)) +
    // El ruedo roto, deshilachado.
    trazo(`M${f(px - 44)} ${f(py + 100)} l-3 12 M${f(px - 20)} ${f(py + 112)} l-1 10 M${f(px + 4)} ${f(py + 114)} l2 9`, C.cromo, 0.9, 0.7),
  );
}

/* ------------------------------------------------------------------
   Las piernas: el pantalón del frac con la franja, y los zapatos de baile
   ------------------------------------------------------------------ */

function muslo(n: 0 | 1): string {
  const [cx, cy] = A.caderas[n];
  const [rx, ry] = A.rodillas[n];
  const w = n ? 13 : 12;
  const d = curva([[cx - w, cy - 6], [cx + w, cy - 4], [rx + w - 2, ry + 4], [rx - w + 2, ry + 4]]);
  return conGrano(
    enmascarado(`m-garufa-muslo-${n}`, d, forma(d, n ? C.metal : C.metalHondo) + nube(cx + 4, (cy + ry) / 2, 5, 24, C.cromo, 'm', n ? 0.35 : 0.2) +
      // La franja de raso del costado.
      trazo(`M${f(cx + w - 3)} ${f(cy - 2)} L${f(rx + w - 5)} ${f(ry + 2)}`, C.cromo, 1.8, 0.8)),
  );
}

function canilla(n: 0 | 1): string {
  const [rx, ry] = A.rodillas[n];
  const w = n ? 11 : 10;
  const px = rx + 2;
  const d = curva([[rx - w, ry - 4], [rx + w, ry - 4], [px + w - 3, -8], [px - w + 3, -8]]);
  // El zapato de baile, en punta, con la hebilla y nieve en la puntera.
  const zapato = curva([[px - w, -9], [px + w - 1, -9], [px + 26, -4], [px + 30, 0], [px + 22, 2], [px - w - 2, 2]]);
  return conGrano(
    enmascarado(`m-garufa-canilla-${n}`, d, forma(d, n ? C.metal : C.metalHondo) + nube(px + 2, (ry - 8) / 2, 5, 22, C.cromo, 'm', n ? 0.32 : 0.18) +
      trazo(`M${f(rx + w - 3)} ${f(ry - 2)} L${f(px + w - 4)} -8`, C.cromo, 1.8, 0.8)) +
    // La media caída, que asoma entre el ruedo y el zapato.
    forma(cajaRedonda(px - w + 2, -13, w * 2 - 4, 5, 1.5), C.rojo, n ? 0.9 : 0.6) +
    enmascarado(`m-garufa-zapato-${n}`, zapato, forma(zapato, C.metalHondo) + nube(px + 8, -5, 14, 3, C.cromo, 's', 0.5) + nube(px + 24, -2, 6, 2, C.nieve, 's', 0.8)) +
    forma(cajaRedonda(px + 2, -8, 5, 4, 1), C.cromo, 0.9),
  );
}

/* ------------------------------------------------------------------
   El cuerpo: el frac abierto, la camisa afuera, el moño desatado y el hueco del pecho
   ------------------------------------------------------------------ */

const TORSO: readonly P[] = [[-24, -170], [-8, -176], [10, -178], [26, -170], [30, -140], [26, -108], [12, -96], [-8, -96], [-24, -110], [-28, -142]];

function cuerpo(): string {
  const d = curva(TORSO);
  const [hx, hy] = A.hueco;
  const hueco = elipse(hx, hy, 12, 13);
  // La camisa, que asoma entre las solapas y por abajo del saco, afuera del pantalón.
  const camisa = curva([[-6, -176], [12, -178], [16, -150], [14, -118], [8, -92], [-4, -94], [-8, -120], [-10, -150]]);
  return conGrano(
    enmascarado('m-garufa-torso', d,
      forma(d, C.metal) + nube(-18, -140, 10, 34, C.metalHondo, 'm', 0.9) + nube(20, -150, 8, 30, C.cromo, 'm', 0.3) +
      enmascarado('m-garufa-camisa', camisa, forma(camisa, C.cromoClaro) + nube(4, -110, 10, 10, C.cromo, 's', 0.5) + nube(10, -160, 6, 14, C.nieve, 's', 0.6) +
        // Los botones, y uno que falta.
        [-168, -156, -132, -120].map((y) => forma(elipse(2, y, 1.5, 1.5), C.metalHondo)).join('') + trazo('M0 -144 l4 0', C.metalHondo, 0.8)) +
      // Las solapas de raso.
      trazo('M-6 -176 L-14 -150 L-8 -128', C.cromo, 2.4, 0.8) + trazo('M12 -178 L22 -152 L16 -128', C.cromo, 2.4, 0.8) +
      // El hueco del pecho, de donde sacó el corazón: hondo, con el borde húmedo.
      enmascarado('m-garufa-hueco', hueco, forma(hueco, C.metalHondo) + nube(hx, hy + 4, 9, 8, C.rojoHondo, 's', 0.9) + nube(hx - 2, hy - 2, 5, 4, C.rojoVivo, 's', 0.5)) +
      trazo(`M${f(hx - 11)} ${f(hy + 4)} Q${f(hx)} ${f(hy + 16)} ${f(hx + 11)} ${f(hy + 2)}`, C.rojoHondo, 1.6, 0.8)) +
    // La nieve en los hombros.
    nube(-18, -172, 10, 3, C.nieve, 's', 0.9) + nube(20, -173, 9, 3, C.nieve, 's', 0.9) +
    // El moño desatado, colgando de un lado del cuello.
    trazo('M-2 -176 q-8 10 -4 22 M-2 -176 q6 12 2 24', C.rojo, 3, 0.95) + forma(elipse(-2, -176, 3, 2.4), C.rojoHondo),
  );
}

/** El brillo del hueco cuando late: una nube roja que la isla prende y apaga. */
function latido(): string {
  const [hx, hy] = A.hueco;
  return nube(hx, hy, 14, 14, C.rojoVivo, 'm', 0.9) + nube(hx, hy, 6, 6, C.rosa, 's', 0.8);
}

/* ------------------------------------------------------------------
   Los brazos: la manga del frac, el puño de la camisa y la mano
   ------------------------------------------------------------------ */

function brazo(n: 0 | 1): string {
  const [hx, hy] = A.hombros[n];
  const [cx, cy] = A.codos[n];
  const w = n ? 9 : 8;
  const d = curva([[hx - w, hy - 8], [hx + w, hy - 6], [cx + w - 1, cy + 4], [cx - w + 1, cy + 4]]);
  return conGrano(enmascarado(`m-garufa-brazo-${n}`, d, forma(d, n ? C.metal : C.metalHondo) + nube(hx + 2, (hy + cy) / 2, 4, 22, C.cromo, 'm', n ? 0.35 : 0.15) + nube(hx, hy - 4, 8, 4, C.nieve, 's', n ? 0.5 : 0.3)));
}

function antebrazo(n: 0 | 1): string {
  const [cx, cy] = A.codos[n];
  const [mx, my] = A.manos[n];
  const w = n ? 8 : 7;
  const ang = Math.atan2(my - cy, mx - cx);
  const [ux, uy] = [-Math.sin(ang), Math.cos(ang)];
  const d = curva([[cx + ux * w, cy + uy * w], [mx + ux * (w - 2) - Math.cos(ang) * 6, my + uy * (w - 2) - Math.sin(ang) * 6], [mx - ux * (w - 2) - Math.cos(ang) * 6, my - uy * (w - 2) - Math.sin(ang) * 6], [cx - ux * w, cy - uy * w]]);
  // El puño de la camisa y la mano, con los dedos apretando el corazón.
  const punio = `<g transform="rotate(${f((ang * 180) / Math.PI)} ${f(mx)} ${f(my)})">${forma(cajaRedonda(mx - 9, my - w + 1, 5, w * 2 - 2, 1), C.cromoClaro)}</g>`;
  const dedos = [-0.9, -0.3, 0.3, 0.9].map((a) => {
    const [dx, dy] = [Math.cos(ang + a * 0.9) * 7, Math.sin(ang + a * 0.9) * 7];
    return trazo(`M${f(mx)} ${f(my)} l${f(dx)} ${f(dy)}`, n ? C.piel : C.pielHonda, 2.6);
  }).join('');
  return conGrano(
    enmascarado(`m-garufa-antebrazo-${n}`, d, forma(d, n ? C.metal : C.metalHondo) + nube((cx + mx) / 2, (cy + my) / 2, 4, 14, C.cromo, 's', n ? 0.3 : 0.12)) +
    punio + forma(elipse(mx, my, 5, 4.4), n ? C.piel : C.pielHonda) + dedos + nube(mx - 1, my - 1, 2.4, 1.6, C.pielClara, 'xs', n ? 0.7 : 0.3),
  );
}

/* ------------------------------------------------------------------
   El corazón, entre las manos, y las gotas
   ------------------------------------------------------------------ */

function corazon(): string {
  const [cx, cy] = A.corazon;
  // Un corazón de verdad: la bolsa, la aorta cortada arriba, dos venas gordas y el brillo húmedo.
  const d = curva([[cx - 2, cy - 18], [cx + 12, cy - 16], [cx + 17, cy - 4], [cx + 12, cy + 10], [cx + 2, cy + 20], [cx - 10, cy + 10], [cx - 16, cy - 2], [cx - 12, cy - 14]]);
  const aorta = curva([[cx - 4, cy - 16], [cx + 4, cy - 16], [cx + 6, cy - 26], [cx - 2, cy - 27]]);
  return conGrano(
    enmascarado('m-garufa-aorta', aorta, forma(aorta, C.rojoHondo) + nube(cx + 2, cy - 26, 4, 2, C.rosa, 'xs', 0.6)) +
    forma(elipse(cx + 1, cy - 27, 4, 1.6), C.rojoHondo) + forma(elipse(cx + 1, cy - 27, 2, 0.8), C.metalHondo) +
    enmascarado('m-garufa-corazon', d,
      forma(d, C.rojo) + nube(cx + 4, cy + 6, 10, 10, C.rojoHondo, 'm', 0.9) + nube(cx - 6, cy - 6, 6, 6, C.rojoVivo, 's', 0.8) +
      // Las venas, que se ramifican por encima.
      trazo(`M${f(cx - 6)} ${f(cy - 12)} q4 8 0 18 q-2 6 2 10 M${f(cx - 4)} ${f(cy - 4)} q6 2 10 8`, C.rojoVivo, 1.4, 0.8) +
      trazo(`M${f(cx + 6)} ${f(cy - 14)} q-2 8 4 14`, C.rojoHondo, 1, 0.7) +
      nube(cx - 7, cy - 9, 3, 2, C.rosa, 'xs', 0.9)),
  );
}

function gotas(): string {
  const [cx, cy] = A.corazon;
  const gota = (x: number, y: number, r: number): string => `<path d="M${f(x)} ${f(y - r * 1.6)} Q${f(x + r)} ${f(y)} ${f(x)} ${f(y + r)} Q${f(x - r)} ${f(y)} ${f(x)} ${f(y - r * 1.6)} Z" fill="${C.rojoVivo}"/>`;
  return gota(cx + 2, cy + 28, 2.4) + gota(cx - 6, cy + 36, 1.8) + gota(cx + 8, cy + 40, 1.4);
}

/* ------------------------------------------------------------------
   La cabeza: la cara de tres cuartos, el pelo engominado y la corona de lata
   ------------------------------------------------------------------ */

function cabeza(): string {
  const [nx, ny] = A.cuello;
  const cara = curva([[-20, -230], [-4, -234], [14, -230], [24, -214], [24, -196], [16, -182], [4, -178], [-10, -182], [-20, -196], [-24, -214]]);
  const pelo = curva([[-24, -216], [-20, -232], [-6, -240], [12, -238], [24, -228], [26, -218], [16, -224], [2, -226], [-12, -224]]);
  const [bx, by] = A.boca;
  const ojo = (n: 0 | 1): string => {
    const { centro: [ex, ey], radio: [rx, ry] } = A.ojos[n];
    return forma(elipse(ex, ey, rx, ry), C.nieve) + forma(elipse(ex + 1.5, ey, rx * 0.5, ry * 0.9), C.pelo) + forma(elipse(ex + 2.2, ey - 1, 1, 1), C.nieve, 0.9) +
      // La ojera de la noche sin dormir.
      nube(ex, ey + ry + 3, rx, 2.6, C.pielHonda, 's', 0.7);
  };
  return conGrano(
    // El cuello, que entra en el saco.
    forma(cajaRedonda(nx - 8, ny - 10, 16, 16, 4), C.pielHonda) +
    enmascarado('m-garufa-cara', cara,
      forma(cara, C.piel) + nube(-14, -200, 10, 18, C.pielHonda, 'm', 0.8) + nube(10, -214, 10, 10, C.pielClara, 'm', 0.7) +
      // Los cachetes colorados del frío y la barba de dos días.
      nube(-8, -192, 6, 4, C.rosa, 's', 0.5) + nube(16, -194, 5, 4, C.rosa, 's', 0.5) + nube(6, -182, 12, 6, C.pielHonda, 's', 0.45)) +
    ojo(0) + ojo(1) +
    // Las cejas, caídas.
    trazo('M-12 -213 q6 -3 11 0 M6 -215 q7 -3 13 1', C.pelo, 1.8, 0.9) +
    // La nariz de tres cuartos, y el bigote finito de galán.
    trazo('M14 -206 q8 10 2 18', C.pielHonda, 1.6, 0.9) + nube(20, -194, 3, 2, C.pielClara, 'xs', 0.7) +
    trazo(`M${f(bx - 10)} ${f(by - 4)} q6 -3 12 -1 q4 1 8 -1`, C.pelo, 1.6, 0.95) +
    // La boca, con la comisura caída.
    trazo(`M${f(bx - 8)} ${f(by)} q6 -1 12 2`, C.rojoHondo, 1.8, 0.9) +
    // La oreja de este lado, y el pelo con gomina, con un rulo suelto en la frente.
    forma(elipse(-22, -206, 4, 6), C.piel) + trazo('M-22 -209 q-2 3 0 6', C.pielHonda, 1) +
    enmascarado('m-garufa-pelo', pelo, forma(pelo, C.pelo) + nube(0, -236, 14, 3, C.cromo, 's', 0.35) + trazo('M-16 -228 q10 -6 24 -2', C.metalHondo, 0.8, 0.6)) +
    trazo('M12 -230 q8 4 4 12 q-3 4 2 6', C.pelo, 2.2, 0.95),
  );
}

/** Un párpado, del color de la piel, con la pestaña abajo. */
function parpado(n: 0 | 1): string {
  const { centro: [ex, ey], radio: [rx, ry] } = A.ojos[n];
  return conGrano(forma(elipse(ex, ey, rx + 0.8, ry + 0.8), C.piel) + trazo(`M${f(ex - rx)} ${f(ey + 1)} Q${f(ex)} ${f(ey + ry + 1)} ${f(ex + rx)} ${f(ey + 1)}`, C.pelo, 0.9));
}

/** La sonrisa de fiestero: la boca abierta de costado, con los dientes, que tapa la triste. */
function sonrisa(): string {
  const [bx, by] = A.boca;
  const d = `M${f(bx - 9)} ${f(by - 1)} Q${f(bx + 2)} ${f(by + 9)} ${f(bx + 10)} ${f(by - 2)} Q${f(bx + 2)} ${f(by + 1)} ${f(bx - 9)} ${f(by - 1)} Z`;
  return conGrano(forma(d, C.rojoHondo) + forma(`M${f(bx - 6)} ${f(by)} Q${f(bx + 2)} ${f(by + 3)} ${f(bx + 8)} ${f(by - 1)} L${f(bx + 7)} ${f(by - 2)} Q${f(bx + 2)} ${f(by + 1)} ${f(bx - 6)} ${f(by - 1)} Z`, C.nieve) + trazo(`M${f(bx - 9)} ${f(by - 1)} Q${f(bx + 2)} ${f(by + 9)} ${f(bx + 10)} ${f(by - 2)}`, C.rojoHondo, 1.2));
}

/** La corona de lata: cinco puntas, una doblada, abolladuras, y confeti pegado. */
function corona(): string {
  const [kx, ky] = A.corona;
  const w = 24;
  const puntas: P[] = [[kx - w, ky], [kx - w, ky - 22], [kx - w * 0.55, ky - 10], [kx - w * 0.2, ky - 30], [kx + w * 0.2, ky - 12], [kx + w * 0.55, ky - 26], [kx + w * 0.8, ky - 8], [kx + w + 4, ky - 14], [kx + w, ky]];
  const d = poli(puntas);
  const rnd = azar(77);
  return conGrano(
    enmascarado('m-garufa-corona', d,
      forma(d, C.oro) + nube(kx - 12, ky - 6, 14, 10, C.oroHondo, 'm', 0.9) + nube(kx + 10, ky - 16, 8, 6, C.nieve, 's', 0.45) +
      // El óxido de las juntas y las abolladuras.
      nube(kx - 20, ky - 4, 4, 8, C.oliva, 's', 0.8) + nube(kx + 14, ky - 4, 5, 6, C.oliva, 's', 0.6) + nube(kx, ky - 4, 6, 3, C.oliva, 'xs', 0.5) +
      // La banda de abajo, remachada.
      trazo(`M${f(kx - w)} ${f(ky - 4)} L${f(kx + w)} ${f(ky - 4)}`, C.oroHondo, 1.6, 0.9) +
      [-18, -6, 6, 18].map((x) => forma(elipse(kx + x, ky - 2, 1.2, 1.2), C.oliva)).join('')) +
    // La punta doblada, que cae hacia adelante.
    forma(poli([[kx + w * 0.8, ky - 8], [kx + w + 4, ky - 14], [kx + w + 12, ky - 4], [kx + w + 6, ky - 2]]), C.oroHondo) +
    // El confeti pegado y una serpentina colgando de una punta.
    Array.from({ length: 6 }, () => papelito(kx - 18 + rnd() * 36, ky - 20 + rnd() * 14, rnd)).join('') +
    trazo(`M${f(kx - w * 0.2)} ${f(ky - 30)} q-8 6 -4 14 q3 6 -3 12`, C.lente, 1.6, 0.9),
  );
}

/* ------------------------------------------------------------------
   La serpentina, el vaho y el confeti que cae
   ------------------------------------------------------------------ */

function serpentina(): string {
  const [sx, sy] = A.serpentina;
  const rulo = (x: number, y: number, tinta: string, s: number): string =>
    trazo(`M${f(x)} ${f(y)} q${f(6 * s)} 4 ${f(4 * s)} 10 t${f(-4 * s)} 10 t${f(4 * s)} 10 t${f(-2 * s)} 12`, tinta, 2.2, 0.95);
  return conGrano(
    // Enredada por los hombros, de un lado celeste y del otro amarilla.
    trazo(`M${f(sx - 26)} ${f(sy - 2)} q14 10 30 2 q10 -6 22 4`, C.lente, 2.6, 0.95) +
    trazo(`M${f(sx - 22)} ${f(sy + 6)} q12 8 28 0`, C.amarillo, 2.2, 0.9) +
    rulo(sx + 26, sy + 2, C.amarillo, 1) + rulo(sx - 26, sy - 2, C.lente, -1) +
    forma(elipse(sx + 20, sy - 4, 2, 2), C.naipe) + forma(elipse(sx - 14, sy + 2, 2, 2), C.rojoVivo),
  );
}

function vaho(): string {
  const [bx, by] = A.boca;
  return nube(bx + 20, by - 10, 14, 9, C.lente, 'm', 0.6) + nube(bx + 26, by - 14, 9, 6, C.lenteClara, 's', 0.7) + nube(bx + 14, by - 6, 6, 4, C.lenteClara, 's', 0.6);
}

/** El confeti que se cae de la corona: una lluvia corta, que la isla baja y apaga. */
function confeti(): string {
  const rnd = azar(131);
  return Array.from({ length: 22 }, () => papelito(-40 + rnd() * 100, -270 + rnd() * 90, rnd)).join('');
}

/* ------------------------------------------------------------------
   Las piezas y el títere
   ------------------------------------------------------------------ */

const D = 2.4;

export const PIEZAS_GARUFA: readonly Pieza[] = [
  { nombre: 'garufa-sombra', caja: [-50, -8, 110, 20], dibujo: sombra(), densidad: 1.6 },
  { nombre: 'garufa-capa', caja: [-70, -190, 100, 150], dibujo: capa(), densidad: D },
  { nombre: 'garufa-muslo-1', caja: [-34, -112, 48, 72], dibujo: muslo(0), densidad: D },
  { nombre: 'garufa-canilla-1', caja: [-30, -66, 76, 72], dibujo: canilla(0), densidad: D },
  { nombre: 'garufa-muslo-2', caja: [-20, -110, 50, 72], dibujo: muslo(1), densidad: D },
  { nombre: 'garufa-canilla-2', caja: [-8, -64, 60, 70], dibujo: canilla(1), densidad: D },
  { nombre: 'garufa-cuerpo', caja: [-40, -190, 82, 104], dibujo: cuerpo(), densidad: D },
  { nombre: 'garufa-latido', caja: [-16, -158, 40, 40], dibujo: latido(), densidad: 1.6 },
  { nombre: 'garufa-brazo-1', caja: [-32, -182, 50, 64], dibujo: brazo(0), densidad: D },
  { nombre: 'garufa-antebrazo-1', caja: [-22, -146, 62, 44], dibujo: antebrazo(0), densidad: D },
  { nombre: 'garufa-cabeza', caja: [-34, -246, 66, 86], dibujo: cabeza(), densidad: D * 1.4 },
  { nombre: 'garufa-parpado-1', caja: [A.ojos[0].centro[0] - 8, A.ojos[0].centro[1] - 7, 16, 14], dibujo: parpado(0), densidad: D * 2 },
  { nombre: 'garufa-parpado-2', caja: [A.ojos[1].centro[0] - 9, A.ojos[1].centro[1] - 7, 18, 14], dibujo: parpado(1), densidad: D * 2 },
  { nombre: 'garufa-sonrisa', caja: [A.boca[0] - 12, A.boca[1] - 6, 26, 18], dibujo: sonrisa(), densidad: D * 2 },
  { nombre: 'garufa-corona', caja: [A.corona[0] - 30, A.corona[1] - 36, 72, 40], dibujo: corona(), densidad: D * 1.4 },
  { nombre: 'garufa-vaho', caja: [A.boca[0] + 2, A.boca[1] - 28, 48, 34], dibujo: vaho(), densidad: 1.6 },
  { nombre: 'garufa-serpentina', caja: [-34, -176, 76, 60], dibujo: serpentina(), densidad: D },
  { nombre: 'garufa-corazon', caja: [A.corazon[0] - 22, A.corazon[1] - 32, 44, 56], dibujo: corazon(), densidad: D * 1.6 },
  { nombre: 'garufa-gotas', caja: [A.corazon[0] - 12, A.corazon[1] + 22, 26, 24], dibujo: gotas(), densidad: D * 1.6 },
  { nombre: 'garufa-brazo-2', caja: [-2, -178, 52, 58], dibujo: brazo(1), densidad: D },
  { nombre: 'garufa-antebrazo-2', caja: [20, -148, 40, 48], dibujo: antebrazo(1), densidad: D },
  { nombre: 'garufa-confeti', caja: [-46, -276, 112, 102], dibujo: confeti(), densidad: 1.6 },
];

const img = imagenesDe(PIEZAS_GARUFA);
const parte = (nombre: string, cuerpo: string, transform = '', opacidad = ''): string =>
  `<g data-parte="${nombre}"${transform ? ` transform="${transform}"` : ''}${opacidad ? ` opacity="${opacidad}"` : ''}>${cuerpo}</g>`;

/** El rey armado con las marcas de un momento. */
function armado(m: Momento): string {
  const { transform: t, opacity: o } = marcas(m);
  return parte('anda',
    img('garufa-sombra') +
    parte('lado',
      parte('figura',
        parte('capa', img('garufa-capa'), t.capa) +
        parte('muslo-1', img('garufa-muslo-1') + parte('canilla-1', img('garufa-canilla-1'), t['canilla-1']), t['muslo-1']) +
        parte('muslo-2', img('garufa-muslo-2') + parte('canilla-2', img('garufa-canilla-2'), t['canilla-2']), t['muslo-2']) +
        img('garufa-cuerpo') +
        parte('latido', img('garufa-latido'), '', o.latido) +
        parte('brazo-1', img('garufa-brazo-1') + parte('antebrazo-1', img('garufa-antebrazo-1'), t['antebrazo-1']), t['brazo-1']) +
        parte('cabeza',
          img('garufa-cabeza') +
          parte('parpado-1', img('garufa-parpado-1'), t['parpado-1']) +
          parte('parpado-2', img('garufa-parpado-2'), t['parpado-2']) +
          parte('sonrisa', img('garufa-sonrisa'), '', o.sonrisa) +
          parte('corona', img('garufa-corona'), t.corona) +
          parte('vaho', img('garufa-vaho'), t.vaho, o.vaho),
          t.cabeza) +
        parte('serpentina', img('garufa-serpentina'), t.serpentina) +
        parte('corazon', img('garufa-corazon') + parte('gotas', img('garufa-gotas'), t.gotas, o.gotas), t.corazon) +
        parte('brazo-2', img('garufa-brazo-2') + parte('antebrazo-2', img('garufa-antebrazo-2'), t['antebrazo-2']), t['brazo-2']) +
        parte('confeti', img('garufa-confeti'), t.confeti, o.confeti),
        t.figura),
      t.lado),
    t.anda);
}

/** El rey en un momento, sin lo que lo hace tocable: para el test, el retrato y para mirarlo. */
export function garufaEn(m: Momento = QUIETO): string {
  return `<g transform="${marcas(m).transform.entero}">${armado(m)}</g>`;
}

/** El títere que se toca, en la pose quieta: parado en la nieve, con el corazón entre las manos. */
function titere(nombres: ReadonlyMap<string, string>): string {
  return (
    `<g class="titere titere--garufa" data-id="el-rey-garufa" role="button" tabindex="0" aria-label="${nombres.get('el-rey-garufa') ?? 'El Rey Garufa'}">` +
    `<g data-parte="entero" transform="${marcas(QUIETO).transform.entero}">${armado(QUIETO)}</g>` +
    `</g>`
  );
}

/** El retrato de la ficha: ofreciendo el corazón, que late, con la sonrisa de la fiesta y el vaho del frío. */
export const RETRATO = { caja: [GARUFA.x - 70, GARUFA.piso - 162, 140, 176] as const };
function retrato(): string {
  const fondo = (nombre: string): string => `<image href="/bestiario/${nombre}.webp" x="0" y="0" width="900" height="640" preserveAspectRatio="none"/>`;
  return fondo('cyber-lejos') + fondo('cyber-piso') + garufaEn(OFRECE);
}

export const GARUFA_PERSONAJE: Personaje = {
  id: 'el-rey-garufa',
  region: 'cybersiberia',
  ancla: GARUFA.x,
  piezas: PIEZAS_GARUFA,
  capas: { figura: titere },
  retrato: { caja: RETRATO.caja, cuerpo: retrato },
};
