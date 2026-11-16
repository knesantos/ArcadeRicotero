/**
 * La mesa servida, a lo largo (`D-91`, tanda 2).
 *
 * Lo que se vio: es la región más quieta y la más chata. Pared roja, mantel, sillas. Y es de **tinta
 * plana**, que es su mano (el afiche de *La mosca y la sopa* y el collage de la contratapa): la
 * profundidad no puede venir de un soplo. Viene de lo que tiene un afiche para dar fondo: **la
 * perspectiva dibujada** y **el recorte pegado encima de otro**.
 *
 * - **La puerta del fondo**: un vano en la pared por donde se ve otra sala, y en esa sala la misma mesa
 *   que se va, larga, hasta un punto: sillas y lámparas cada vez más chicas, y al final otra puerta
 *   con alguien parado. Es el punto de fuga de la región.
 * - **El zócalo** de madera y **los retratos** de la familia (son moscas), que le dan a la pared un
 *   arriba y un abajo.
 * - **La ventana** deja de ser un rectángulo con un resplandor: cortinas de papel, la luna, el molino de
 *   la pastura, y abajo, contra el marco, dos ojos.
 * - **Debajo del mantel** pasa lo que arriba no se ve: las patas de la mesa, los pies de cada uno de los
 *   que cenan (las pezuñas de la mula, los tacos de Pituca), un papelito que pasa de mano en mano, el
 *   perro con su hueso, y la cueva del ratón, que tiene su propia mesa servida.
 * - **La lámpara** que cuelga y se hamaca, con su cono de papel; y **las moscas**.
 *
 * Todo plano, con el grano encima. El recinto de 900 no se toca: esto es solo del camino.
 */

import { enmascarado, forma, trazo } from './aerografo.ts';
import type { CapaDeAire } from './aire.ts';
import { TINTAS_DE_LA_MESA as M2, mesaLejos, rasgado, recorte } from './arte-entornos.ts';
import { azar } from './pincel.ts';
import { MESA, OJOS_DE_LA_MESA } from './rig-entornos.ts';

const f = (v: number): string => (Math.round(v * 10) / 10).toString();
type Punto = readonly [number, number];

const elipse = (x: number, y: number, rx: number, ry: number): string =>
  `M${f(x - rx)} ${f(y)} a${f(rx)} ${f(ry)} 0 1 0 ${f(rx * 2)} 0 a${f(rx)} ${f(ry)} 0 1 0 ${f(-rx * 2)} 0 Z`;
const poli = (ps: readonly Punto[]): string => `M${ps.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L')} Z`;
const caja = (x: number, y: number, w: number, h: number): string => `M${f(x)} ${f(y)} h${f(w)} v${f(h)} h${f(-w)} Z`;

/* ------------------------------------------------------------------
   La pared: la puerta del fondo, el zócalo, los retratos, la ventana
   ------------------------------------------------------------------ */

/** Dónde está la puerta del fondo, en lo lejano del camino largo: el vano y su punto de fuga. */
export const PUERTA = { x: 640, ancho: 168, arriba: 62, fuga: { x: 716, y: 196 } } as const;

/**
 * La puerta del fondo. Adentro, una sala en perspectiva de un solo punto, toda en planos: las paredes
 * que se cierran, el techo, y la mesa larga que se va. Cada cosa que se repite (silla, lámpara) se
 * achica hacia el punto: es la única manera que tiene un afiche de irse lejos.
 */
function puertaDelFondo(piso: number): string {
  const { x, ancho, arriba, fuga } = PUERTA;
  const [x0, x1] = [x, x + ancho];
  /** Un punto del vano, llevado hacia la fuga: `u` de 0 (acá) a 1 (en el punto). */
  const hacia = (px: number, py: number, u: number): Punto => [px + (fuga.x - px) * u, py + (fuga.y - py) * u];
  const fondo = 0.8;
  const esquinas: Punto[] = [[x0, arriba], [x1, arriba], [x1, piso], [x0, piso]];
  const lejos = esquinas.map(([px, py]) => hacia(px, py, fondo));
  const pared = (a: number, b: number, color: string, o = 1): string => forma(poli([esquinas[a]!, esquinas[b]!, lejos[b]!, lejos[a]!]), color, o);
  let s =
    forma(poli(esquinas), M2.negro) +
    pared(0, 1, M2.negro) + // el techo
    pared(3, 0, M2.petroleo) + // la pared de la izquierda
    pared(1, 2, M2.petroleo, 0.62) + // la de la derecha, en sombra
    pared(2, 3, M2.sepiaHonda); // el piso
  // Las tablas del piso, que se juntan en el punto.
  for (let i = 1; i < 7; i++) {
    const px = x0 + (ancho * i) / 7;
    s += trazo(`M${f(px)} ${piso} L${f(hacia(px, piso, fondo)[0])} ${f(hacia(px, piso, fondo)[1])}`, M2.negro, 0.9, 0.6);
  }
  // Los cuadros de la pared de la izquierda, cada vez más chicos: paralelogramos de papel.
  for (let i = 0; i < 4; i++) {
    const [u0, u1] = [0.1 + i * 0.18, 0.2 + i * 0.18];
    s += forma(poli([hacia(x0, arriba + 60, u0), hacia(x0, arriba + 60, u1), hacia(x0, arriba + 130, u1), hacia(x0, arriba + 130, u0)]), i % 2 ? M2.sepiaClara : M2.rojo, 0.85);
  }
  // La mesa larga: el tablero es un trapecio de papel que se angosta hacia el punto, con su faldón.
  const [m0, m1] = [x0 + ancho * 0.26, x0 + ancho * 0.8];
  const alturaMesa = piso - 46;
  const tablero = [hacia(m0, alturaMesa, 0), hacia(m1, alturaMesa, 0), hacia(m1, alturaMesa, 0.76), hacia(m0, alturaMesa, 0.76)];
  s +=
    forma(poli([[m0, alturaMesa], [m1, alturaMesa], [m1, piso], [m0, piso]]), M2.sepiaClara) +
    forma(poli(tablero), M2.papel) +
    trazo(`M${f((m0 + m1) / 2)} ${alturaMesa} L${f(hacia((m0 + m1) / 2, alturaMesa, 0.76)[0])} ${f(hacia((m0 + m1) / 2, alturaMesa, 0.76)[1])}`, M2.naranja, 2.2, 0.8);
  // Las sillas de los dos lados y los platos, de adelante para atrás.
  for (let i = 0; i < 7; i++) {
    const u = 1 - Math.pow(0.74, i + 0.4);
    if (u > 0.74) break;
    const k = 1 - u;
    for (const lado of [-1, 1]) {
      const bx = lado < 0 ? m0 - 9 : m1 + 9;
      const [sx, sy] = hacia(bx, alturaMesa - 4, u);
      const [px, py] = hacia(lado < 0 ? m0 + 22 : m1 - 22, alturaMesa, u);
      s += forma(caja(sx - 7 * k, sy - 40 * k, 14 * k, 52 * k), M2.negro) + forma(elipse(sx, sy - 40 * k, 7 * k, 5 * k), M2.negro) + forma(elipse(px, py, 9 * k, 2.6 * k), M2.rojo, 0.9);
    }
  }
  // Las lámparas del techo: un cordón, la pantalla y el redondel de luz que deja en el mantel.
  for (let i = 0; i < 5; i++) {
    const u = 1 - Math.pow(0.7, i + 0.7);
    if (u > 0.76) break;
    const k = 1 - u;
    const [lx, ly] = hacia((m0 + m1) / 2, arriba, u);
    const [, my] = hacia((m0 + m1) / 2, alturaMesa, u);
    s +=
      trazo(`M${f(lx)} ${f(ly)} L${f(lx)} ${f(ly + 44 * k)}`, M2.sepiaClara, Math.max(0.5, 1.2 * k), 0.7) +
      forma(poli([[lx - 5 * k, ly + 44 * k], [lx + 5 * k, ly + 44 * k], [lx + 14 * k, ly + 58 * k], [lx - 14 * k, ly + 58 * k]]), M2.naranja) +
      forma(elipse(lx, my, 20 * k, 4 * k), M2.blanco, 0.8);
  }
  // Al fondo, la otra puerta, prendida, con alguien parado en el vano.
  const [fx0, fy0] = hacia(x0 + ancho * 0.36, arriba + 76, fondo);
  const [fx1, fy1] = hacia(x0 + ancho * 0.66, piso, fondo);
  s +=
    forma(poli(lejos), M2.negro) +
    forma(caja(fx0, fy0, fx1 - fx0, fy1 - fy0), M2.naranja) +
    forma(caja((fx0 + fx1) / 2 - 1.6, fy0 + (fy1 - fy0) * 0.38, 3.2, (fy1 - fy0) * 0.62), M2.negro) +
    forma(elipse((fx0 + fx1) / 2, fy0 + (fy1 - fy0) * 0.3, 1.9, 2.1), M2.negro);
  // El marco: jambas y dintel de madera, con el canto claro del lado de la sala.
  const marco =
    forma(caja(x0 - 12, arriba - 12, ancho + 24, 12), M2.sepiaHonda) +
    forma(caja(x0 - 12, arriba - 12, 12, piso - arriba + 12), M2.sepiaHonda) +
    forma(caja(x1, arriba - 12, 12, piso - arriba + 12), M2.sepiaHonda) +
    trazo(`M${x0 - 1} ${piso} L${x0 - 1} ${arriba - 1} L${x1 + 1} ${arriba - 1} L${x1 + 1} ${piso}`, M2.sepia, 2) +
    forma(caja(x0 - 18, arriba - 18, ancho + 36, 7), M2.sepia);
  return enmascarado('ms-puerta', poli(esquinas), s) + marco;
}

/** El zócalo: tablas paradas hasta media pared, con su moldura. Plano, apenas más oscuro que el rojo. */
function zocalo(desde: number, hasta: number, arriba: number, abajo: number, huecos: readonly (readonly [number, number])[]): string {
  let s = '';
  const libre = (x: number): boolean => !huecos.some(([a, b]) => x > a - 8 && x < b + 8);
  // Por tramos entre hueco y hueco (la puerta corta el zócalo).
  const cortes = [desde, ...huecos.flatMap(([a, b]) => [a - 12, b + 12]), hasta];
  for (let i = 0; i < cortes.length; i += 2) {
    const [a, b] = [cortes[i]!, cortes[i + 1]!];
    s += forma(caja(a, arriba, b - a, abajo - arriba), M2.negro, 0.26) + forma(caja(a, arriba - 5, b - a, 5), M2.sepiaHonda, 0.9) + trazo(`M${a} ${arriba - 5.6} L${b} ${arriba - 5.6}`, M2.sepia, 1.2, 0.8);
  }
  for (let x = desde + 14; x < hasta; x += 46) {
    if (!libre(x) || !libre(x + 30)) continue;
    s += trazo(caja(x, arriba + 9, 32, abajo - arriba - 16), M2.negro, 1.4, 0.34);
  }
  return s;
}

/** De quién es cada retrato: lo que le asoma al busto por arriba. */
type Pariente = 'mosca' | 'mula' | 'mantis' | 'sombrero';

/**
 * Un retrato de la familia: un recorte pegado, con su óvalo, y adentro un busto de espaldas a la luz.
 * Los parientes son los de la mesa: una mosca de ojos rojos, la mula, la mantis, uno de sombrero.
 */
function retrato(id: string, x: number, y: number, w: number, giro: number, quien: Pariente, semilla: number): string {
  const h = w * 1.3;
  const [cx, cy] = [x + w / 2, y + h / 2];
  const busto = forma(`M${f(cx - w * 0.34)} ${f(y + h)} Q${f(cx - w * 0.32)} ${f(cy + h * 0.14)} ${f(cx)} ${f(cy + h * 0.1)} Q${f(cx + w * 0.32)} ${f(cy + h * 0.14)} ${f(cx + w * 0.34)} ${f(y + h)} Z`, M2.negro);
  const r = w * 0.17;
  const [hx, hy] = [cx, cy - h * 0.06];
  let cabeza = forma(elipse(hx, hy, r, r * 1.14), M2.negro);
  if (quien === 'mosca') cabeza += forma(elipse(hx - r * 0.62, hy - r * 0.2, r * 0.52, r * 0.66), M2.vivo) + forma(elipse(hx + r * 0.62, hy - r * 0.2, r * 0.52, r * 0.66), M2.vivo) + trazo(`M${f(hx - r * 0.3)} ${f(hy - r)} l${f(-r * 0.5)} ${f(-r * 0.9)} M${f(hx + r * 0.3)} ${f(hy - r)} l${f(r * 0.5)} ${f(-r * 0.9)}`, M2.negro, 1.1);
  if (quien === 'mula') cabeza += forma(poli([[hx - r * 0.7, hy - r * 0.7], [hx - r * 1.3, hy - r * 2.5], [hx - r * 0.1, hy - r * 1]]) + poli([[hx + r * 0.7, hy - r * 0.7], [hx + r * 1.3, hy - r * 2.5], [hx + r * 0.1, hy - r * 1]]), M2.negro) + forma(elipse(hx, hy + r * 0.9, r * 0.6, r * 0.8), M2.negro);
  if (quien === 'mantis') cabeza = forma(poli([[hx - r * 1.2, hy - r * 0.6], [hx + r * 1.2, hy - r * 0.6], [hx, hy + r * 1.2]]), M2.negro) + forma(elipse(hx - r * 0.9, hy - r * 0.6, r * 0.4, r * 0.5), M2.oro) + forma(elipse(hx + r * 0.9, hy - r * 0.6, r * 0.4, r * 0.5), M2.oro);
  if (quien === 'sombrero') cabeza += forma(caja(hx - r * 1.5, hy - r * 0.9, r * 3, r * 0.3), M2.negro) + forma(caja(hx - r * 0.9, hy - r * 2.1, r * 1.8, r * 1.3), M2.negro);
  const adentro =
    forma(caja(x - 10, y - 10, w + 20, h + 20), M2.sepiaClara) +
    forma(elipse(cx, cy, w * 0.42, h * 0.43), M2.sepiaHonda) +
    forma(elipse(cx, cy, w * 0.37, h * 0.39), M2.petroleo) +
    enmascarado(`${id}-ov`, elipse(cx, cy, w * 0.37, h * 0.39), busto + cabeza);
  // El piolín del que cuelga, hasta el clavo.
  return trazo(`M${f(cx - w * 0.2)} ${f(y)} L${f(cx)} ${f(y - 16)} L${f(cx + w * 0.2)} ${f(y)}`, M2.negro, 1.2, 0.8) + recorte(id, x, y, w, h, giro, adentro, semilla);
}

/** Lo que se ve por la ventana, y sus cortinas. `x0`, `x1`, `arriba`, `abajo`: el vidrio. */
function porLaVentana(x0: number, x1: number, arriba: number, abajo: number): string {
  const w = x1 - x0;
  const medio = (x0 + x1) / 2;
  // La luna, el molino de la pastura y el alambrado, recortados contra el resplandor de abajo.
  const mx = x0 + w * 0.76;
  const my = abajo - 30;
  let aspas = '';
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 + 0.2;
    aspas += poli([[mx, my - 40], [mx + Math.cos(a - 0.16) * 12, my - 40 + Math.sin(a - 0.16) * 12], [mx + Math.cos(a + 0.16) * 12, my - 40 + Math.sin(a + 0.16) * 12]]);
  }
  let postes = '';
  for (let x = x0 + 8; x < x1; x += 26) postes += caja(x, abajo - 16, 2, 16);
  const afuera =
    forma(elipse(x0 + w * 0.26, arriba + 34, 13, 13), M2.haz) +
    forma(elipse(x0 + w * 0.26 + 6, arriba + 30, 11, 11), M2.petroleo) +
    forma(poli([[mx - 5, abajo], [mx - 1.6, my - 40], [mx + 1.6, my - 40], [mx + 5, abajo]]) + aspas + postes, M2.negro) +
    trazo(`M${x0} ${abajo - 11} L${x1} ${abajo - 11} M${x0} ${abajo - 5} L${x1} ${abajo - 5}`, M2.negro, 0.8) +
    // Los ojos: alguien mira para adentro, apoyado en el marco.
    forma(elipse(x0 + w * 0.42, abajo - 20, 3.4, 2), M2.oro) + forma(elipse(x0 + w * 0.42 + 12, abajo - 20, 3.4, 2), M2.oro) +
    forma(elipse(x0 + w * 0.42, abajo - 20, 0.8, 1.8), M2.negro) + forma(elipse(x0 + w * 0.42 + 12, abajo - 20, 0.8, 1.8), M2.negro);
  // La cruz del marco, otra vez encima de lo de afuera.
  const cruz = trazo(`M${f(medio)} ${arriba} L${f(medio)} ${abajo} M${f(x0)} ${f((arriba + abajo) / 2)} L${f(x1)} ${f((arriba + abajo) / 2)}`, M2.negro, 6);
  // Las cortinas: dos tiras de papel rasgado, recogidas, que tapan los costados.
  const cortina = (lado: number, semilla: number): string => {
    const bx = lado < 0 ? x0 - 12 : x1 + 12;
    const ps: Punto[] = [[bx, arriba - 16], [bx - lado * w * 0.3, arriba - 16], [bx - lado * w * 0.12, arriba + (abajo - arriba) * 0.62], [bx - lado * w * 0.16, abajo + 22], [bx, abajo + 22]];
    const d = rasgado(ps, 2.4, semilla, 7);
    let pliegues = '';
    for (let i = 1; i < 4; i++) pliegues += trazo(`M${f(bx - lado * w * 0.07 * i)} ${arriba - 14} Q${f(bx - lado * w * 0.05 * i)} ${f((arriba + abajo) / 2)} ${f(bx - lado * w * 0.04 * i)} ${abajo + 18}`, M2.sepia, 1.3, 0.6);
    return forma(d, M2.papel) + pliegues;
  };
  return (
    enmascarado('ms-vidrio', caja(x0, arriba, w, abajo - arriba), afuera) + cruz + cortina(-1, 3511) + cortina(1, 3517) +
    forma(caja(x0 - 26, arriba - 22, w + 52, 7), M2.sepiaHonda)
  );
}

/**
 * Lo lejano de la mesa larga: la pared del recinto, estirada como siempre, y encima lo que le da fondo.
 * Todo lo nuevo va de la línea de la mesa para arriba y por fuera de los recortes que ya estaban.
 */
export function mesaLejosLarga(ancho: number, alto: number): string {
  const k = ancho / 900;
  const piso = MESA.tablero.atras - 6;
  const { x0, x1, arriba, abajo } = MESA.ventana;
  const puerta: readonly [number, number] = [PUERTA.x, PUERTA.x + PUERTA.ancho];
  return (
    mesaLejos(ancho, alto) +
    `<g filter="url(#grano)">` +
    zocalo(-10, ancho + 10, 246, piso, [puerta]) +
    puertaDelFondo(piso) +
    retrato('ms-r1', 452, 92, 62, -3, 'mosca', 3521) +
    retrato('ms-r2', 536, 60, 50, 2.5, 'mula', 3527) +
    retrato('ms-r3', 866, 84, 58, 3, 'sombrero', 3533) +
    retrato('ms-r4', 946, 116, 44, -4, 'mosca', 3539) +
    // Los dos últimos, a la derecha de donde nace el seguidor: el haz baja para el otro lado.
    retrato('ms-r5', 2212, 70, 60, -2.5, 'mantis', 3541) +
    retrato('ms-r6', 2292, 114, 46, 4, 'mosca', 3547) +
    porLaVentana(x0 * k, x1 * k, arriba, abajo) +
    `</g>`
  );
}

/* ------------------------------------------------------------------
   Debajo del mantel
   ------------------------------------------------------------------ */

const X = (x: number, ancho: number): number => (x * ancho) / 900;

/** Dónde está la cueva del ratón, en el piso del camino largo: lo que premia a la lupa. */
export const CUEVA = { x: 1992, y: 590 } as const;

/** La cueva del ratón: un arco prendido en lo negro, y adentro su mesa servida, con vela y dos sillas. */
export function cuevaDelRaton(x: number, y: number): string {
  const arco = `M${f(x - 13)} ${f(y)} L${f(x - 13)} ${f(y - 13)} Q${f(x - 13)} ${f(y - 26)} ${f(x)} ${f(y - 26)} Q${f(x + 13)} ${f(y - 26)} ${f(x + 13)} ${f(y - 13)} L${f(x + 13)} ${f(y)} Z`;
  return (
    forma(`M${f(x - 16)} ${f(y)} L${f(x - 16)} ${f(y - 14)} Q${f(x - 16)} ${f(y - 30)} ${f(x)} ${f(y - 30)} Q${f(x + 16)} ${f(y - 30)} ${f(x + 16)} ${f(y - 14)} L${f(x + 16)} ${f(y)} Z`, M2.sepiaHonda) +
    enmascarado('ms-cueva', arco,
      forma(arco, M2.luz) +
      forma(elipse(x, y - 13, 9, 8), M2.naranja) +
      // El mantel, la vela y las dos sillitas.
      forma(caja(x - 6, y - 8, 12, 8), M2.papel) + forma(caja(x - 7, y - 9, 14, 2), M2.blanco) +
      forma(caja(x - 0.7, y - 14, 1.4, 5), M2.blanco) + forma(elipse(x, y - 15.4, 1, 1.7), M2.oro) +
      forma(caja(x - 11, y - 12, 2.4, 12) + caja(x + 8.6, y - 12, 2.4, 12), M2.negro) +
      // El ratón, sentado: la oreja, el hocico y la cola que sale de la cueva.
      forma(elipse(x + 6.6, y - 11.6, 2.4, 2.2) + elipse(x + 7.8, y - 14, 1.5, 1.5) + poli([[x + 4.4, y - 11.8], [x + 2.2, y - 10.8], [x + 4.6, y - 10.4]]), M2.negro)) +
    trazo(`M${f(x + 9)} ${f(y - 1.4)} q7 -1 10 3 q2 3 7 1.6`, M2.sepia, 1, 0.9) +
    // La luz que la cueva tira al piso: una cuña plana.
    forma(poli([[x - 12, y], [x + 12, y], [x + 26, y + 12], [x - 26, y + 12]]), M2.luz, 0.3)
  );
}

/** Una pata de la mesa, torneada. `lejos`: las de atrás, más finas y más apagadas. */
function pata(x: number, desde: number, hasta: number, lejos: boolean): string {
  const g = lejos ? 5 : 8;
  const o = lejos ? 0.55 : 0.95;
  const h = hasta - desde;
  return (
    forma(caja(x - g, desde, g * 2, h * 0.24) + poli([[x - g, desde + h * 0.24], [x + g, desde + h * 0.24], [x + g * 0.5, desde + h * 0.42], [x - g * 0.5, desde + h * 0.42]]) + elipse(x, desde + h * 0.5, g * 0.9, h * 0.07) + poli([[x - g * 0.5, desde + h * 0.56], [x + g * 0.5, desde + h * 0.56], [x + g * 0.34, hasta - 5], [x - g * 0.34, hasta - 5]]) + caja(x - g * 0.8, hasta - 5, g * 1.6, 5), M2.sepiaHonda, o) +
    trazo(`M${f(x - g + 1.4)} ${f(desde)} L${f(x - g + 1.4)} ${f(desde + h * 0.24)}`, M2.sepia, 1.4, o * 0.8)
  );
}

/** Un zapato visto de costado, apuntando para donde diga `lado`. */
const zapato = (x: number, y: number, lado: number, t: number, color: string, o: number): string =>
  forma(`M${f(x - lado * 7 * t)} ${f(y)} L${f(x - lado * 7 * t)} ${f(y - 7 * t)} L${f(x - lado * 1 * t)} ${f(y - 7 * t)} Q${f(x + lado * 9 * t)} ${f(y - 5 * t)} ${f(x + lado * 11 * t)} ${f(y)} Z`, color, o);

/**
 * Lo que pasa debajo del mantel. Va en el piso impreso, de donde cuelga el mantel para abajo, en lo
 * oscuro: sepia sobre negro, que se adivina más que se ve. Cada par de pies está debajo de su dueño
 * (`OJOS_DE_LA_MESA`): si alguien se corre de silla, sus pies se corren con él.
 */
export function bajoElMantel(ancho: number): string {
  const { izq, der, cuelga } = MESA.tablero;
  const de = (id: string): number => X(OJOS_DE_LA_MESA[id]![0], ancho);
  const lejos = cuelga + 36;
  const cerca = cuelga + 96;
  let s = '';
  // Las patas: las de atrás primero, corridas hacia adentro (están más lejos), y las de adelante.
  const [ti, td] = [X(izq, ancho), X(der, ancho)];
  for (const u of [0.04, 0.36, 0.67, 0.97]) s += pata(ti + (td - ti) * (0.03 + u * 0.94), cuelga - 8, lejos + 8, true);
  for (const u of [0.0, 0.335, 0.665, 1]) s += pata(ti + (td - ti) * u, cuelga - 8, cerca, false);
  // El caníbal, descalzo: dos pies anchos con las uñas claras.
  const c = de('el-canibal');
  for (const dx of [-13, 11]) s += forma(elipse(c + dx, lejos + 4, 9, 4.4), M2.sepia, 0.85) + [-5, -1.6, 1.8, 5].map((d) => forma(elipse(c + dx + d, lejos + 0.6, 1.3, 1.5), M2.sepiaClara, 0.9)).join('');
  // El desdentado, en pantuflas con pompón.
  const d0 = de('el-canibal-desdentado');
  for (const dx of [-12, 10]) s += zapato(d0 + dx, lejos + 8, 1, 0.9, M2.sepia, 0.8) + forma(elipse(d0 + dx + 2, lejos + 0.6, 2.6, 2.6), M2.sepiaClara, 0.85);
  // La mula: las cuatro pezuñas, partidas.
  const m = de('la-mula-de-la-enfermedad');
  for (const dx of [-17, -6, 7, 18]) s += forma(caja(m + dx - 2.2, lejos - 16, 4.4, 17), M2.sepiaHonda) + forma(poli([[m + dx - 4.4, lejos + 8], [m + dx - 3, lejos + 1], [m + dx + 3, lejos + 1], [m + dx + 4.4, lejos + 8]]), M2.sepiaClara, 0.85) + trazo(`M${f(m + dx)} ${f(lejos + 2)} l0 6`, M2.negro, 1);
  // Pituca: los tacos, uno caído. Corridos del chimpancé, que mira desde ahí al lado.
  const p = de('pituca') - 24;
  s += forma(`M${f(p - 9)} ${f(lejos + 8)} L${f(p - 9)} ${f(lejos - 6)} L${f(p - 6)} ${f(lejos - 6)} L${f(p - 5)} ${f(lejos + 2)} Q${f(p + 4)} ${f(lejos + 3)} ${f(p + 9)} ${f(lejos + 8)} Z`, M2.vivo, 0.9) + forma(`M${f(p + 14)} ${f(lejos + 9)} L${f(p + 28)} ${f(lejos + 4)} L${f(p + 29)} ${f(lejos + 7)} L${f(p + 22)} ${f(lejos + 9)} Q${f(p + 26)} ${f(lejos + 16)} ${f(p + 14)} ${f(lejos + 13)} Z`, M2.vivo, 0.9);
  // La mantis: patas de alambre, muchas.
  const t = de('el-club-de-mantis');
  for (const dx of [-16, -8, 1, 9, 17]) s += trazo(`M${f(t + dx)} ${f(lejos - 18)} l${f(dx * 0.2)} 14 l${f(3 + dx * 0.1)} 10`, M2.oro, 1.3, 0.75);
  // El verdugo: los borceguíes, con la puntera clara.
  const v = de('el-verdugo-que-cena');
  for (const dx of [-14, 9]) s += zapato(v + dx, lejos + 9, -1, 1.25, M2.sepiaHonda, 1) + forma(caja(v + dx - 4, lejos - 18, 9, 20), M2.sepiaHonda) + forma(elipse(v + dx - 10, lejos + 6.6, 3.6, 2.4), M2.sepia, 0.9);
  // El papelito: dos manos que se lo pasan por abajo, entre el desdentado y la mula.
  const n = (d0 + m) / 2;
  const yn = cuelga + 22;
  s +=
    forma(poli([[d0 + 26, yn - 12], [n - 12, yn - 3], [n - 12, yn + 4], [d0 + 26, yn + 2]]), M2.sepia, 0.9) + forma(elipse(n - 9, yn + 0.4, 5.4, 4.4), M2.sepiaClara, 0.9) +
    forma(poli([[m - 30, yn - 10], [n + 16, yn - 2], [n + 16, yn + 5], [m - 30, yn + 4]]), M2.sepiaHonda) + forma(elipse(n + 13, yn + 1.4, 5.4, 4.4), M2.sepia, 0.9) +
    forma(poli([[n - 7, yn - 5], [n + 7, yn - 4], [n + 6, yn + 4], [n - 6, yn + 3]]), M2.blanco) + trazo(`M${f(n - 3)} ${f(yn - 2)} l6 0.6 M${f(n - 3)} ${f(yn + 0.6)} l4 0.4`, M2.negro, 0.6, 0.8);
  // El perro, echado entre la olla y la mantis, con su hueso: un bulto con una oreja y un ojo.
  const px = ancho * 0.59;
  const py = cerca - 14;
  s +=
    forma(`M${f(px - 44)} ${f(py + 12)} Q${f(px - 46)} ${f(py - 10)} ${f(px - 18)} ${f(py - 12)} Q${f(px + 10)} ${f(py - 16)} ${f(px + 22)} ${f(py - 6)} L${f(px + 40)} ${f(py - 2)} Q${f(px + 48)} ${f(py + 4)} ${f(px + 40)} ${f(py + 10)} L${f(px + 14)} ${f(py + 12)} Z`, M2.sepiaHonda) +
    forma(poli([[px + 20, py - 7], [px + 14, py + 6], [px + 26, py - 2]]), M2.negro, 0.7) +
    forma(elipse(px + 31, py, 1.5, 1.5), M2.oro) +
    trazo(`M${f(px - 44)} ${f(py + 8)} q-12 -2 -14 -12`, M2.sepiaHonda, 3.4) +
    trazo(`M${f(px + 50)} ${f(py + 10)} l16 -2`, M2.blanco, 2.6, 0.85) + forma(elipse(px + 50, py + 9, 2.6, 2.2) + elipse(px + 50, py + 12, 2.4, 2) + elipse(px + 66, py + 7, 2.6, 2.2) + elipse(px + 66, py + 10, 2.4, 2), M2.blanco, 0.85);
  return s + cuevaDelRaton(CUEVA.x, CUEVA.y);
}

/* ------------------------------------------------------------------
   La lámpara, las moscas y el moscardón
   ------------------------------------------------------------------ */

/**
 * La lámpara que cuelga sobre la mesa. El clavo está en el cero; para abajo, el cordón, la pantalla y
 * el cono. El cono es de papel: dos cantos cortados a mano (nunca de regla), muy poca tinta, y la
 * máscara cruzada con rayas de luz que se abren desde la bombita, así no es un plano parejo.
 */
export function lamparaDeLaMesa(): string {
  const rnd = azar(3557);
  const largo = 118;
  const pie = 420;
  const canto = (lado: number): string[] => {
    const ps: string[] = [];
    for (let u = 0.02; u < 0.99; u += 0.03 + rnd() * 0.07) {
      const muerde = (rnd() < 0.2 ? 5 + rnd() * 8 : rnd() * 3) * (0.3 + u);
      ps.push(`L${f(lado * (30 + 104 * u - muerde))} ${f(largo + 26 + (pie - largo - 26) * u)}`);
    }
    return ps;
  };
  const silueta = `M-30 ${largo + 26} ${canto(1).join(' ')} L134 ${pie} L-134 ${pie} ${canto(-1).reverse().join(' ')} Z`;
  let rayas = '';
  for (let i = 0; i < 11; i++) {
    const a = (rnd() - 0.5) * 230;
    const w = 5 + rnd() * 20;
    rayas += `<path d="M${f(a * 0.1)} ${largo + 20} L${f(a + w / 2)} ${pie} L${f(a - w / 2)} ${pie} Z" fill="black" opacity="${f(0.3 + rnd() * 0.4)}"/>`;
  }
  // El pie del cono se deshace en flecos: dientes negros en la máscara, desparejos.
  let flecos = '';
  for (let x = -140; x < 140; x += 7 + rnd() * 12) flecos += `<path d="M${f(x)} ${pie + 2} L${f(x + 4 + rnd() * 5)} ${f(pie - 14 - rnd() * 44)} L${f(x + 9 + rnd() * 8)} ${pie + 2} Z" fill="black"/>`;
  return (
    `<mask id="lz-mesa"><path d="${silueta}" fill="white"/>${rayas}${flecos}</mask>` +
    `<g mask="url(#lz-mesa)">${forma(silueta, M2.papel, 0.2)}${forma(`M-16 ${largo + 26} L16 ${largo + 26} L62 ${pie} L-62 ${pie} Z`, M2.blanco, 0.1)}</g>` +
    trazo(`M0 0 L0 ${largo}`, M2.negro, 2) +
    // La pantalla: un cono de chapa, naranja por fuera, con el borde claro y la bombita que asoma.
    forma(elipse(0, largo + 28, 9, 7), M2.blanco) +
    forma(`M-7 ${largo - 2} L7 ${largo - 2} L33 ${largo + 27} L-33 ${largo + 27} Z`, M2.naranja) +
    forma(`M6 ${largo - 2} L7 ${largo - 2} L33 ${largo + 27} L18 ${largo + 27} Z`, M2.sepiaHonda, 0.55) +
    forma(caja(-34, largo + 25, 68, 4), M2.sepiaClara) +
    forma(caja(-5, largo - 8, 10, 7), M2.negro)
  );
}

/** Una mosca chica, vista de arriba, girada a gusto: el cuerpo, la cabeza y las dos alas de vidrio. */
function mosquita(x: number, y: number, t: number, giro: number, o: number): string {
  return (
    `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(giro)})"${o < 1 ? ` opacity="${f(o)}"` : ''}>` +
    forma(elipse(-t * 0.9, t * 0.2, t * 0.95, t * 0.42), M2.haz, 0.55) + forma(elipse(t * 0.9, t * 0.2, t * 0.95, t * 0.42), M2.haz, 0.55) +
    forma(elipse(0, t * 0.2, t * 0.42, t * 0.74) + elipse(0, -t * 0.66, t * 0.36, t * 0.34), M2.negro) +
    `</g>`
  );
}

/**
 * Las moscas: un puñado suelto que anda sobre la mesa, más juntas del lado de la olla. La baldosa se
 * corre con el viento, se hamaca y salta (`aire.ts`), así que el enjambre nunca hace dos veces lo mismo.
 */
export function mesaMoscas(c: CapaDeAire): string {
  const rnd = azar(3559);
  let s = '';
  for (let i = 0; i < 19; i++) {
    // Tres montones y algunas sueltas.
    const monton = i % 4;
    const cx = monton === 3 ? rnd() * c.ancho : c.ancho * (0.18 + monton * 0.3) + (rnd() - 0.5) * 150;
    const x = Math.min(c.ancho - 14, Math.max(14, cx));
    const y = c.y + 30 + rnd() ** 1.4 * (c.alto - 70);
    s += mosquita(x, y, 2.6 + rnd() * 2.8, rnd() * 360, 0.75 + rnd() * 0.25);
  }
  return `<g filter="url(#grano)"><rect x="-200" y="${c.y - 40}" width="${c.ancho + 400}" height="${c.alto + 80}" fill="${M2.negro}" fill-opacity="0"/>${s}</g>`;
}

/** El moscardón que cruza: gordo, de perfil, con el ala levantada y el ojo rojo. */
export function moscardon(): string {
  return (
    `<g filter="url(#grano)"><rect x="0" y="0" width="34" height="22" fill="${M2.negro}" fill-opacity="0"/>` +
    forma(`M9 9 Q14 -3 24 2 Q21 8 14 11 Z`, M2.haz, 0.7) + forma(`M12 10 Q20 0 28 6 Q22 10 15 12 Z`, M2.haz, 0.5) +
    forma(elipse(13, 14, 9.5, 5.4) + elipse(25.4, 13, 5, 4.6), M2.negro) +
    forma(elipse(27.6, 12, 2.4, 2.6), M2.vivo) +
    trazo('M5 13 l4 0 M6 15.6 l4 0', M2.sepia, 1, 0.8) +
    trazo('M14 19 l-2 3 M18 19 l0 3 M23 17 l3 4', M2.negro, 0.9) +
    `</g>`
  );
}
