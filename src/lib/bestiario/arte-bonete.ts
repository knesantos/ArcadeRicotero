/**
 * El árbol del gran bonete, a lo largo (`D-91`, tanda 3): el árbol es el lugar.
 *
 * El recinto de 900 y su piso (el tronco, la copa, el marco, el fruto, los que viven ahí) son de
 * `arte-entornos.ts` y acá no se editan: otra sesión los está tocando (`T-529`). En el camino largo el
 * árbol quedaba en el medio de 2400 unidades de llanura: en un teléfono, cuatro pantallas de cada
 * cinco no lo tenían. Lo que el camino pinta por su cuenta:
 *
 * - **Dos ramas enormes** (`boneteBajo`), del mismo mármol veteado, que salen de atrás de la copa
 *   para los dos lados, se van del cuadro por arriba y vuelven a bajar: una llega hasta la entrada y
 *   la otra hasta el cruce. De las dos **cuelgan cosas**: bonetes, una jaula con la puerta abierta,
 *   llaves, campanas, un huevo de plata en su red, y un farol de cobre (que es la luz de la región).
 * - **La huella** (`boneteSobre`): tierra pisada que cruza la llanura hasta el horizonte, con los
 *   huevos de plata de la tapa a los costados, cada vez más chicos. Es el punto de fuga.
 * - **Lo lejano**, entero: el cielo de *Luzbelito* con las nubes en tres filas que se achican hacia
 *   el horizonte, una luna enorme que sale medio tapada, lluvia que no llega al piso, mesetas en
 *   dos planos y, muy lejos, otro árbol.
 * - **La luna mira** (`VISITAS`): si te quedás quieto, se le abre un ojo.
 *
 * Del juego de ronda sale lo que cuelga: al gran bonete se le perdió un pajarito, y acá hay una
 * jaula abierta y, arriba de ella, por afuera, un pajarito que no piensa volver. Es invento, no letra.
 */

import { forma, nube, soplo, trazo, type Pieza } from './aerografo.ts';
import { azar } from './pincel.ts';
import { ARBOL } from './rig-entornos.ts';
import { cinta, fuga, linea } from './escorzo.ts';

const A = {
  marmol: 'var(--entorno-arbol-marmol)',
  hondo: 'var(--entorno-arbol-marmol-hondo)',
  claro: 'var(--entorno-arbol-marmol-claro)',
  veta: 'var(--entorno-arbol-veta)',
  cobre: 'var(--entorno-arbol-cobre)',
  cobreHondo: 'var(--entorno-arbol-cobre-hondo)',
  tierra: 'var(--entorno-arbol-tierra)',
  tierraHonda: 'var(--entorno-arbol-tierra-honda)',
  tierraViva: 'var(--entorno-arbol-tierra-viva)',
  cielo: 'var(--entorno-arbol-cielo)',
  violeta: 'var(--entorno-arbol-violeta)',
  nube: 'var(--entorno-arbol-nube)',
  plata: 'var(--disco-momo-sampler-tinta)',
  peltre: 'var(--disco-momo-sampler-apoyo)',
  papel: 'var(--papel)',
  negro: 'var(--fondo)',
};

const f = (v: number): string => (Math.round(v * 10) / 10).toString();
const caja = (x: number, y: number, w: number, h: number): string => `M${f(x)} ${f(y)} h${f(w)} v${f(h)} h${f(-w)} Z`;
const circulo = (x: number, y: number, r: number): string => `M${f(x - r)} ${f(y)} a${f(r)} ${f(r)} 0 1 0 ${f(r * 2)} 0 a${f(r)} ${f(r)} 0 1 0 ${f(-r * 2)} 0 Z`;
const elipse = (x: number, y: number, rx: number, ry: number): string => `M${f(x - rx)} ${f(y)} a${f(rx)} ${f(ry)} 0 1 0 ${f(rx * 2)} 0 a${f(rx)} ${f(ry)} 0 1 0 ${f(-rx * 2)} 0 Z`;
let cuenta = 0;
const recortado = (silueta: string, adentro: string): string => {
  const id = `bn-${cuenta++}`;
  return `<clipPath id="${id}"><path d="${silueta}"/></clipPath><g clip-path="url(#${id})">${adentro}</g>`;
};

/** Un nubarrón del interior del disco: panza oscura y lomo prendido por una luz baja. */
function nubarron(x: number, y: number, w: number, h: number, semilla: number): string {
  const rnd = azar(semilla);
  let [cuerpo, lomo, panza] = ['', '', ''];
  const tam = h > 34 ? 'l' : 'm';
  for (let i = 0; i < 8; i++) {
    const cx = x + (i / 7 - 0.5) * w + (rnd() - 0.5) * w * 0.1;
    const cy = y + (rnd() - 0.5) * h * 0.5;
    const rx = w * (0.12 + rnd() * 0.1);
    const ry = h * (0.35 + rnd() * 0.3);
    cuerpo += nube(cx, cy, rx, ry, A.nube, tam, 0.75);
    lomo += nube(cx - rx * 0.2, cy - ry * 0.45, rx * 0.7, ry * 0.4, A.papel, tam, 0.55);
    panza += nube(cx + rx * 0.1, cy + ry * 0.55, rx * 0.9, ry * 0.4, A.violeta, tam, 0.8);
  }
  return cuerpo + panza + lomo;
}

/** Un huevo de plata de la tapa, apoyado, con su sombra. */
function huevo(x: number, piso: number, r: number): string {
  const d = elipse(x, piso - r * 1.1, r * 0.85, r * 1.1);
  return (
    nube(x + r * 0.5, piso, r * 1.3, r * 0.3, A.negro, r > 6 ? 's' : 'xs', 0.6) +
    recortado(d, forma(d, A.peltre) + nube(x + r * 0.4, piso - r * 0.6, r * 0.7, r * 0.8, A.tierraHonda, r > 6 ? 's' : 'xs', 0.6) + nube(x - r * 0.25, piso - r * 1.45, r * 0.35, r * 0.4, A.plata, 'xs', 0.95))
  );
}

/** Dónde está la luna, en lo lejano: el ojo que se le abre va en el medio (`OJO`). */
const LUNA = { x: 690, y: 262, r: 118 } as const;

/** Lo lejano del árbol, a lo largo. */
export function boneteLejos(ancho: number, alto: number): string {
  const h = ARBOL.horizonte;
  const rnd = azar(1311);
  // Las nubes, en tres filas: arriba, pocas y enormes; contra el horizonte, muchas, chatas y chicas.
  let nubes = '';
  let n = 0;
  for (let x = 160; x < ancho + 200; x += 440 + rnd() * 220) nubes += nubarron(x, 44 + rnd() * 46, 360 + rnd() * 160, 64 + rnd() * 30, 17 + n++);
  for (let x = 40; x < ancho + 100; x += 300 + rnd() * 190) nubes += nubarron(x, 150 + rnd() * 44, 210 + rnd() * 110, 36 + rnd() * 16, 17 + n++);
  let bajas = '';
  for (let x = 20; x < ancho + 60; x += 150 + rnd() * 150) bajas += nubarron(x, 262 + rnd() * 50, 100 + rnd() * 80, 13 + rnd() * 9, 17 + n++);
  // La lluvia que no llega: cuelga de una nube del medio y se deshace antes del piso.
  let lluvia = '';
  for (const lx of [1480, 2020]) for (let i = 0; i < 34; i++) {
    const x = lx + rnd() * 190;
    const y = 182 + rnd() * 26;
    const l = 60 + rnd() * 80;
    lluvia += trazo(`M${f(x)} ${f(y)} l${f(-l * 0.28)} ${f(l)}`, A.nube, 1 + rnd() * 1.4, 0.07 + rnd() * 0.1);
  }
  const { x: lx, y: ly, r } = LUNA;
  const disco = circulo(lx, ly, r);
  const luna =
    nube(lx, ly - 20, r * 2.1, r * 1.5, A.violeta, 'xl', 0.75) +
    nube(lx, ly, r * 1.3, r * 1.2, A.nube, 'xl', 0.34) +
    recortado(disco,
      forma(disco, A.nube, 0.72) +
      nube(lx - r * 0.3, ly - r * 0.4, r * 0.7, r * 0.6, A.papel, 'xl', 0.4) +
      // Los mares: manchas violetas, y abajo la que le sube del horizonte.
      nube(lx + r * 0.34, ly - r * 0.3, r * 0.26, r * 0.2, A.violeta, 'l', 0.4) + nube(lx - r * 0.4, ly + r * 0.1, r * 0.2, r * 0.26, A.violeta, 'l', 0.34) + nube(lx + r * 0.1, ly - r * 0.66, r * 0.16, r * 0.1, A.violeta, 'm', 0.3) +
      nube(lx, ly + r * 0.9, r * 1.2, r * 0.5, A.cielo, 'xl', 0.8));
  // Las mesetas, en dos planos. Las de atrás, del violeta del cielo; las de adelante, de la tierra honda.
  const meseta = (x: number, w: number, t: number, color: string, o: number): string =>
    forma(`M${f(x)} ${h + 2} L${f(x + w * 0.12)} ${f(h - t * 0.7)} L${f(x + w * 0.2)} ${f(h - t)} L${f(x + w * 0.74)} ${f(h - t * 0.94)} L${f(x + w * 0.82)} ${f(h - t * 0.5)} L${f(x + w)} ${h + 2} Z`, color, o);
  let lejanas = '';
  for (let x = -60; x < ancho; x += 200 + rnd() * 260) lejanas += meseta(x, 160 + rnd() * 200, 9 + rnd() * 14, A.violeta, 0.85);
  let cercanas = '';
  for (let x = 120 + rnd() * 200; x < ancho; x += 420 + rnd() * 420) cercanas += meseta(x, 90 + rnd() * 120, 8 + rnd() * 12, A.tierraHonda, 0.92);
  // El otro árbol: muy lejos, del lado del cruce. Un tronco, una copa redonda y un bonete arriba.
  const [ox, op] = [1790, h + 1];
  const otro =
    forma(`M${ox - 2.4} ${op} L${ox - 1.6} ${op - 26} L${ox + 1.6} ${op - 26} L${ox + 2.4} ${op} Z ${circulo(ox, op - 32, 10)} ${circulo(ox - 9, op - 27, 6.4)} ${circulo(ox + 9, op - 28, 6)}`, A.tierraHonda) +
    forma(`M${ox - 3} ${op - 41} L${ox} ${op - 51} L${ox + 3} ${op - 41} Z`, A.cobre, 0.9);
  let manchas = '';
  for (let i = 0; i < 90; i++) {
    const y = h + rnd() ** 1.4 * (alto - h);
    const hondo = (y - h) / (alto - h);
    manchas += nube(rnd() * ancho, y, 16 + hondo * 130, 2.4 + hondo * 14, rnd() < 0.5 ? A.tierraHonda : A.tierraViva, hondo > 0.3 ? 'm' : 's', 0.5 + rnd() * 0.4);
  }
  // La luna en la llanura: tajadas pálidas que bajan del horizonte, corridas, cada vez más anchas y más flojas.
  let estela = '';
  for (let i = 0; i < 9; i++) estela += nube(lx + (i % 2 ? 9 : -7) * (1 + i * 0.3), h + 7 + i * i * 1.5, 26 + i * 15, 1.6 + i * 0.7, A.nube, i > 4 ? 'm' : 's', 0.4 - i * 0.035);
  let huevos = '';
  for (let i = 0; i < 12; i++) {
    const y = h + 8 + rnd() ** 1.8 * 120;
    let x = rnd() * ancho;
    // Ninguno queda a la altura de la cabeza del ángel guardián (`T-529`), en ninguna pantalla: lo lejano se corre a otra velocidad.
    if (y > 370 && x > 1040 && x < 1640) x += 620;
    huevos += huevo(x, y, 2 + (y - h) * 0.07);
  }
  return (
    `<g filter="url(#rociado)">` +
    `<rect x="-10" y="-10" width="${ancho + 20}" height="${alto + 20}" fill="${A.cielo}"/>` +
    nube(ancho * 0.3, 110, ancho * 0.5, 150, A.violeta, 'xl', 0.8) +
    nube(ancho * 0.84, 60, ancho * 0.24, 110, A.tierraHonda, 'xl', 0.5) +
    nubes +
    lluvia +
    luna +
    // La luz baja del horizonte, como en la tapa: el cielo se aclara justo donde termina la tierra.
    nube(ancho / 2, h - 20, ancho * 0.7, 44, A.nube, 'xl', 0.6) +
    bajas +
    nube(ancho / 2, h - 7, ancho * 0.6, 12, A.papel, 'l', 0.4) +
    lejanas +
    nube(ancho / 2, h - 2, ancho * 0.7, 9, A.nube, 'l', 0.34) +
    cercanas + otro +
    forma(caja(-10, h, ancho + 20, alto - h + 10), A.tierra) +
    nube(ancho / 2, h + 10, ancho * 0.7, 18, A.tierraViva, 'l', 0.8) +
    manchas +
    estela +
    huevos +
    `</g>`
  );
}

/* ------------------------------------------------------------------
   Las dos ramas, y lo que cuelga
   ------------------------------------------------------------------ */

type Nudo = readonly [x: number, y: number, gordo: number];

/** Los pasos de una rama: los nudos, unidos con una curva que pasa por todos. */
function pasosDeRama(nudos: readonly Nudo[]): Nudo[] {
  const ps: Nudo[] = [];
  const en = (i: number): Nudo => nudos[Math.min(nudos.length - 1, Math.max(0, i))]!;
  for (let i = 0; i < nudos.length - 1; i++) {
    for (let t = 0; t < 1; t += 0.1) {
      const cr = (k: 0 | 1 | 2): number => {
        const [a, b, c, d] = [en(i - 1)[k], en(i)[k], en(i + 1)[k], en(i + 2)[k]];
        return 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t);
      };
      ps.push([cr(0), cr(1), cr(2)]);
    }
  }
  ps.push(nudos.at(-1)!);
  return ps;
}

/** La rama de la entrada: sale de atrás de la copa, se va por arriba y vuelve a bajar sobre la primera pantalla. */
const RAMA_IZQ = pasosDeRama([[968, 150, 62], [830, 66, 56], [700, -6, 50], [560, -28, 46], [430, 34, 42], [310, 112, 38], [200, 140, 34], [90, 104, 30], [-30, 52, 26]]);
/** La del cruce: lo mismo para el otro lado, y se va antes de la rama seca de la lechuza (2133). */
const RAMA_DER = pasosDeRama([[1432, 150, 62], [1580, 80, 56], [1700, 10, 50], [1790, -22, 46], [1880, 54, 42], [1960, 116, 38], [2040, 86, 33], [2110, 10, 29], [2165, -34, 26]]);

/** La altura de la panza de una rama en `x`: de ahí cuelgan las cosas. Se busca del lado de afuera, donde la rama baja. */
function panzaDe(pasos: readonly Nudo[], x: number): number {
  let mejor = pasos[0]!;
  for (const p of pasos) if (p[1] > 0 && Math.abs(p[0] - x) < Math.abs(mejor[0] - x)) mejor = p;
  return mejor[1] + mejor[2] * 0.42;
}

/** El mármol de una rama: el mismo del tronco. Verde hondo, con las vetas claras que corren a lo largo. */
function rama(pasos: readonly Nudo[], semilla: number): string {
  const rnd = azar(semilla);
  const normal = (i: number): readonly [number, number] => {
    const [a, b] = [pasos[Math.max(0, i - 1)]!, pasos[Math.min(pasos.length - 1, i + 1)]!];
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    return [-(b[1] - a[1]) / l, (b[0] - a[0]) / l];
  };
  const canto = (lado: number): string[] => pasos.map(([x, y, w], i) => `${f(x + normal(i)[0] * w * 0.5 * lado)} ${f(y + normal(i)[1] * w * 0.5 * lado)}`);
  const silueta = `M${canto(1).join(' L')} L${canto(-1).reverse().join(' L')} Z`;
  let adentro = forma(silueta, A.hondo);
  for (let i = 3; i < pasos.length; i += 6) adentro += nube(pasos[i]![0], pasos[i]![1] - pasos[i]![2] * 0.2, 54, pasos[i]![2] * 0.42, A.marmol, 'm', 0.9);
  // Las vetas: cada una sigue la rama un tramo, corrida a un costado, y tiembla.
  for (let v = 0; v < Math.round(pasos.length * 1.5); v++) {
    const desde = Math.floor(rnd() * (pasos.length - 6));
    const largo = 4 + Math.floor(rnd() * 12);
    const corre = (rnd() - 0.5) * 0.8;
    let d = '';
    for (let i = desde; i < Math.min(pasos.length, desde + largo); i++) {
      const [x, y, w] = pasos[i]!;
      const [nx, ny] = normal(i);
      const c = (corre + (rnd() - 0.5) * 0.14) * w;
      d += `${d ? 'L' : 'M'}${f(x + nx * c)} ${f(y + ny * c)} `;
    }
    const que = rnd();
    adentro += trazo(d, que < 0.3 ? A.veta : que < 0.7 ? A.claro : A.marmol, 0.7 + rnd() * 1.6, que < 0.3 ? 0.3 + rnd() * 0.3 : 0.5 + rnd() * 0.4);
  }
  // La panza en sombra y el lomo prendido por el cielo: los dos van adentro del recorte.
  const corrida = (dy: number): string => `M${pasos.map(([x, y, w]) => `${f(x)} ${f(y + w * dy)}`).join(' L')}`;
  adentro += `<path d="${corrida(0.34)}" fill="none" stroke="${A.negro}" stroke-width="15" opacity="0.55" filter="url(#soplo-s)"/>` + `<path d="${corrida(-0.42)}" fill="none" stroke="${A.nube}" stroke-width="4" opacity="0.34" filter="url(#soplo-xs)"/>`;
  return recortado(silueta, adentro);
}

/* Lo que cuelga. Cada cosa se dibuja colgada del cero: el hilo sube `largo` hasta la rama. */

const hilo = (largo: number): string => trazo(`M0 0 L0 ${f(-largo)}`, A.veta, 0.8, 0.55);

/** Un bonete de cumpleaños, de punta para arriba: a rayas, con el pompón y el elástico suelto. */
const bonete = (rayas: string): string =>
  recortado('M0 0 L-10 30 Q0 34 10 30 Z', forma('M0 0 L-10 30 Q0 34 10 30 Z', A.cobre) + trazo('M-12 14 L8 4 M-12 26 L12 12 M-6 36 L14 24', rayas, 3.4, 0.85) + nube(6, 20, 5, 14, A.negro, 's', 0.4)) +
  forma(circulo(0, -1, 3.2), A.veta) + trazo('M-9 30 q-4 9 2 15', A.veta, 0.7, 0.6);

/** La jaula de cobre, con la puerta abierta. Arriba, por afuera, el pajarito. */
const jaula = (): string =>
  forma(elipse(0, 34, 13, 3.4), A.cobreHondo) +
  trazo('M0 2 Q-14 6 -13 34 M0 2 Q-7 8 -6.5 36 M0 2 L0 37 M0 2 Q7 8 6.5 36 M0 2 Q14 6 13 34 M-12.6 20 Q0 24 12.6 20', A.cobre, 1.1, 0.95) +
  // La puerta, abierta para afuera.
  trazo('M13 22 L22 19 L22 31 L13 34 M17.4 20.6 L17.4 32.6', A.cobre, 1, 0.9) +
  forma(circulo(0, 1, 2.2), A.cobreHondo) +
  // El pajarito del gran bonete: chiquito, del color de la veta, mirando para abajo.
  forma('M-9 3.6 Q-8.6 -1.6 -4.4 -1 Q-1.6 -0.6 -1.4 2.4 Q-4 5 -9 3.6 Z', A.veta) + forma(circulo(-7.6, 0.4, 2), A.veta) +
  forma('M-9.4 0.6 l-2.6 1 l2.4 0.8 Z', A.cobre) + forma(circulo(-8.2, 0, 0.5), A.negro) + trazo('M-1.6 2 l4 -2.4', A.veta, 1, 0.9);

const llave = (): string =>
  `<circle cx="0" cy="5" r="4.4" fill="none" stroke="${A.plata}" stroke-width="1.8"/>` + trazo('M0 9.4 L0 27 M0 21 l4.4 0 M0 25.6 l3.4 0', A.plata, 1.8) + trazo('M-0.8 10 L-0.8 26', A.papel, 0.5, 0.6);

const campana = (): string =>
  recortado('M0 0 Q-3 9 -9 17 L9 17 Q3 9 0 0 Z', forma('M0 0 Q-3 9 -9 17 L9 17 Q3 9 0 0 Z', A.cobre) + nube(5, 12, 4, 9, A.cobreHondo, 'xs', 0.9) + nube(-3, 8, 1.6, 5, A.veta, 'xs', 0.6)) +
  forma(elipse(0, 17.4, 10, 2), A.cobreHondo) + forma(circulo(0, 21, 2), A.cobreHondo);

/** Un huevo de plata en su red. */
const huevoEnRed = (): string =>
  huevo(0, 26, 10) + trazo('M0 0 Q-13 8 -8.6 22 M0 0 Q13 8 8.6 22 M0 0 L0 27 M-9.6 12 Q0 16 9.6 12 M-8 20 Q0 24 8 20', A.veta, 0.7, 0.6);

/** El farol de cobre: la tapa, el vidrio con la llama, la base. La luz que tira es de `LUCES` (`aire.ts`), clavada en `FAROL`. */
const farol = (): string =>
  forma('M-9 6 L0 -2 L9 6 Z', A.cobreHondo) + forma(caja(-7, 6, 14, 22), A.negro) +
  nube(0, 18, 7, 9, A.cobre, 's', 0.9) + forma('M0 11 Q4 18 0 25 Q-4 18 0 11 Z', A.veta) + forma(elipse(0, 20.4, 1.4, 3), A.papel) +
  trazo('M-7 6 L-7 28 M7 6 L7 28 M0 6 L0 10', A.cobre, 1.4) + forma(caja(-9, 28, 18, 3.6), A.cobreHondo);

/** Dónde cuelga el farol y de qué largo es el hilo: la boca de la luz (`LUCES['el-arbol']`) va en `x`, `y`. */
const CUELGA_EL_FAROL = { x: 322, largo: 52 } as const;
export const FAROL = { x: CUELGA_EL_FAROL.x, y: Math.round(panzaDe(RAMA_IZQ, CUELGA_EL_FAROL.x) + CUELGA_EL_FAROL.largo + 30 * 1.7) } as const;

/** Dónde cuelga la jaula: la mira la lupa (`fino-arbol-jaula`). */
const CUELGA_LA_JAULA = { x: 470, largo: 150 } as const;
const JAULA = { x: CUELGA_LA_JAULA.x, y: Math.round(panzaDe(RAMA_IZQ, CUELGA_LA_JAULA.x) + CUELGA_LA_JAULA.largo) } as const;

/** Lo que se agranda lo que cuelga: dibujado mide treinta unidades, que en un teléfono es una miga. */
const TAM = 1.7;

const colgado = (pasos: readonly Nudo[], x: number, largo: number, cosa: string, giro = 0, deMas = 8): string => {
  const y = panzaDe(pasos, x);
  return `<g transform="translate(${f(x)} ${f(y + largo)}) rotate(${giro}) scale(${TAM})">${hilo((largo + deMas) / TAM)}${cosa}</g>`;
};

/**
 * Lo que se hamaca (tercera vuelta). En la segunda iba todo junto en una capa de aire que la isla corría de
 * costado: se movía, pero el hilo no se inclinaba. Ahora cada cosa es una pieza chica del piso, con su hilo, que
 * la isla **gira desde el nudo** (`.pendula`, `scripts/camino.ts`): un péndulo, cada uno con su compás según el
 * largo. El nudo queda adentro de la rama, que va pintada encima. Siete piezas chicas pesan menos que la baldosa.
 */
export interface Colgante {
  pieza: string;
  /** El nudo: de ahí gira. */
  x: number;
  y: number;
  /** Del nudo a la cosa: el largo del péndulo. */
  largo: number;
  caja: readonly [number, number, number, number];
  dibujo: string;
}

const NUDO = 14;
const pendulo = (n: number, pasos: readonly Nudo[], x: number, largo: number, cosa: string, giro: number): Colgante => {
  const y = Math.round(panzaDe(pasos, x) - NUDO);
  const caja = [x - 34, y, 68, Math.round(largo + NUDO + 40 * TAM + 6)] as const;
  return {
    pieza: `cuelga-arbol-${n}`,
    x,
    y,
    largo: largo + NUDO,
    caja,
    dibujo: `<g filter="url(#rociado)"><rect x="${caja[0]}" y="${caja[1]}" width="${caja[2]}" height="${caja[3]}" fill="${A.negro}" fill-opacity="0"/>${colgado(pasos, x, largo, cosa, giro, NUDO)}</g>`,
  };
};

export const COLGANTES: readonly Colgante[] = [
  pendulo(0, RAMA_IZQ, 124, 96, bonete(A.veta), -5),
  pendulo(1, RAMA_IZQ, 276, 38, huevoEnRed(), 2),
  pendulo(2, RAMA_IZQ, 404, 56, bonete(A.plata), 6),
  pendulo(3, RAMA_DER, 1846, 96, campana(), -4),
  pendulo(4, RAMA_DER, 1912, 140, bonete(A.veta), 5),
  pendulo(5, RAMA_DER, 1972, 70, llave(), -3),
  pendulo(6, RAMA_DER, 2034, 118, huevoEnRed(), 2),
];

/** Lo que va **debajo** del piso del recinto: las dos ramas y lo que cuelga. Asoman de atrás de la copa. */
export function boneteBajo(): string {
  // Lo que cuelga quieto: la llave del borde, el farol (de ahí sale la luz) y la jaula (la mira la lupa). El resto se hamaca aparte.
  const loQueCuelga =
    colgado(RAMA_IZQ, 50, 50, llave(), 4) +
    colgado(RAMA_IZQ, CUELGA_EL_FAROL.x, CUELGA_EL_FAROL.largo, farol()) +
    colgado(RAMA_IZQ, CUELGA_LA_JAULA.x, CUELGA_LA_JAULA.largo, jaula(), -2);
  return (
    `<g filter="url(#rociado)">` +
    rama(RAMA_IZQ, 1327) +
    rama(RAMA_DER, 1361) +
    loQueCuelga +
    `</g>`
  );
}

/**
 * El gran bonete (segunda vuelta): el que le da nombre al árbol, caído en la llanura, enorme, acostado con la boca
 * para la derecha. Es lo que pesa en el tercio de abajo de la primera pantalla, justo donde cae la luz del farol.
 * A rayas de cobre y veta, medio enterrado, con el pompón en la punta. Adentro está oscuro: un huevo de plata
 * que rodó hasta ahí, y dos ojos (el segundo premio de la lupa, `fino-arbol-bonete`).
 */
const GRAN_BONETE = { punta: [112, 566], arriba: [286, 462], abajo: [302, 586], caja: [258, 450, 76, 148] as const } as const;

function bocaDelBonete(): string {
  const [[ax, ay], [bx, by]] = [GRAN_BONETE.arriba, GRAN_BONETE.abajo];
  const [cx, cy] = [(ax + bx) / 2, (ay + by) / 2];
  const boca = `<ellipse cx="${cx}" cy="${cy}" rx="24" ry="${f(Math.hypot(bx - ax, by - ay) / 2)}" transform="rotate(-8 ${cx} ${cy})"`;
  return (
    `${boca} fill="${A.tierraHonda}"/>` + nube(cx + 6, cy + 10, 14, 40, A.negro, 's', 0.7) +
    huevo(cx + 3, by - 14, 11) +
    // Los dos ojos, en lo más hondo.
    forma(elipse(cx - 5, cy - 18, 2.6, 1.7) + elipse(cx + 4, cy - 19, 2.6, 1.7), A.veta) + forma(elipse(cx - 5, cy - 18, 0.7, 1.5) + elipse(cx + 4, cy - 19, 0.7, 1.5), A.negro) +
    `${boca} fill="none" stroke="${A.veta}" stroke-width="3.4" opacity="0.9"/>` + `${boca} fill="none" stroke="${A.cobreHondo}" stroke-width="1.2"/>`
  );
}

function granBonete(): string {
  const { punta: [px, py], arriba: [ax, ay], abajo: [bx, by] } = GRAN_BONETE;
  const cono = `M${px} ${py} L${ax} ${ay} L${bx} ${by} Z`;
  let rayas = '';
  for (const k of [0.2, 0.42, 0.64, 0.86]) rayas += trazo(`M${f(px + (ax - px) * k)} ${f(py + (ay - py) * k - 4)} L${f(px + (bx - px) * k + 6)} ${f(py + (by - py) * k + 4)}`, A.veta, 5 + k * 16, 0.88);
  return (
    nube(px + 110, by + 4, 120, 11, A.negro, 'm', 0.7) +
    recortado(cono, forma(cono, A.cobre) + rayas + nube(px + 110, py - 50, 90, 22, A.nube, 'l', 0.3) + nube(px + 120, by - 10, 110, 30, A.negro, 'l', 0.6) + nube(px + 20, py + 6, 40, 12, A.cobreHondo, 'm', 0.7)) +
    bocaDelBonete() +
    // El pompón, y el elástico, que quedó tirado.
    nube(px - 4, py + 8, 13, 4, A.negro, 's', 0.6) + forma(circulo(px - 6, py - 2, 10), A.veta) + nube(px - 3, py + 2, 6, 5, A.cobreHondo, 's', 0.5) +
    trazo(`M${bx - 6} ${by} q16 12 34 4 q14 -7 22 4`, A.veta, 1.1, 0.6) +
    // Medio enterrado: la tierra le tapa el canto de abajo de a manchones.
    nube(px + 60, py + 16, 34, 6, A.tierraHonda, 's', 0.9) + nube(px + 150, by - 4, 30, 6, A.tierraHonda, 's', 0.9) + nube(bx - 10, by + 3, 22, 5, A.tierraHonda, 's', 0.9)
  );
}

/** La huella, y los huevos que la bordean. */
const HUELLA = { desde: [596, 646], hasta: [784, ARBOL.horizonte + 2], cerca: 150, lejos: 4 } as const;

/** Lo que va **encima** del piso del recinto: la huella que cruza la llanura. Pasa entre el angelito frito (469) y el jocker (848). */
export function boneteSobre(): string {
  const ps = fuga(HUELLA.desde, HUELLA.hasta, HUELLA.cerca, HUELLA.lejos, 30, 58);
  let huevos = '';
  [1, 7, 11, 15, 19, 23, 26].forEach((paso, i) => {
    const [x, y, w, hondo] = ps[paso]!;
    huevos += huevo(x + (i % 2 ? 0.66 : -0.7) * w, y + 2, 1.8 + (1 - hondo) * 12);
  });
  let pisadas = '';
  for (const [x, y, w, hondo] of fuga(HUELLA.desde, HUELLA.hasta, HUELLA.cerca, HUELLA.lejos, 40, 58)) {
    if (hondo > 0.9) continue;
    const lado = Math.round(hondo * 97) % 2 ? 1 : -1;
    pisadas += nube(x + lado * w * 0.16, y, w * 0.07 + 1, w * 0.025 + 0.6, A.tierraHonda, 'xs', 0.55);
  }
  return (
    `<g filter="url(#rociado)">` +
    // El piso del recinto oscurece la tierra de cerca con un paño que en el camino largo termina en un canto recto,
    // justo en el borde de la entrada: se lo tapa con una mancha de la misma tierra (no se toca el recinto, `T-529`).
    nube(-6, 560, 44, 130, A.tierraHonda, 'l', 0.8) +
    soplo(cinta(ps, 1.1), A.tierraHonda, 'm', 0.5) +
    // Es tierra pisada, no luz: apenas más viva que la llanura, y torcida. Derecha y clara se leía como un haz.
    soplo(cinta(ps, 0.8), A.tierraViva, 's', 0.3) +
    soplo(cinta(ps, 0.4, -0.1), A.nube, 'm', 0.13) +
    trazo(linea(ps, -0.4), A.tierraHonda, 1.6, 0.45) + trazo(linea(ps, 0.4), A.tierraHonda, 1.6, 0.45) +
    pisadas +
    huevos +
    granBonete() +
    `</g>`
  );
}

/**
 * Lo de adelante, a lo largo. El del recinto estirado era una fila pareja de pastos negros de punta a punta.
 * Acá son **matas**, pocas y separadas: cada una un manojo de cardos secos que se abre en abanico, con las
 * cabezas en el cobre de la tapa, y entre mata y mata se ve la llanura. Tres huevos de plata fuera de foco.
 * Nada sube más que un quinto de la pantalla.
 */
export function boneteFrente(ancho: number, alto: number): string {
  const rnd = azar(1399);
  let s = '';
  for (let x = 200 + rnd() * 120; x < ancho - 80; x += 400 + rnd() * 400) {
    const tallos = 4 + Math.floor(rnd() * 5);
    const abre = 60 + rnd() * 70;
    s += nube(x, alto + 8, abre * 0.7, 18, A.negro, 's', 0.9);
    for (let i = 0; i < tallos; i++) {
      const u = i / (tallos - 1) - 0.5;
      const bx = x + u * abre * 0.5;
      const h = 44 + rnd() * 72;
      const tx = bx + u * abre + (rnd() - 0.5) * 16;
      const color = i % 3 ? A.negro : A.tierraHonda;
      s += trazo(`M${f(bx)} ${alto + 4} Q${f(bx + (tx - bx) * 0.2)} ${f(alto - h * 0.6)} ${f(tx)} ${f(alto - h)}`, color, 2.2 + rnd() * 2.2);
      if (rnd() < 0.6) {
        const y = alto - h;
        s += trazo(`M${f(tx - 7)} ${f(y - 5)} l14 10 M${f(tx + 7)} ${f(y - 5)} l-14 10 M${f(tx)} ${f(y - 9)} l0 18`, color, 1.3) + forma(circulo(tx, y, 3.6 + rnd() * 3.4), A.cobreHondo) + forma(circulo(tx - 1.4, y - 1.4, 1.5), A.cobre, 0.8);
      }
    }
  }
  return `<g filter="url(#soplo-xs)">${s}</g>` + `<g filter="url(#soplo-s)">${huevo(64, alto + 10, 34)}${huevo(ancho * 0.47, alto + 28, 40)}${huevo(ancho - 150, alto + 30, 46)}</g>`;
}

/* ------------------------------------------------------------------
   La luna que mira, y la jaula para la lupa
   ------------------------------------------------------------------ */

/** El ojo de la luna: la caja, en lo lejano, centrada en el disco. */
export const OJO = { caja: [LUNA.x - 52, LUNA.y - 52, 104, 104] as const } as const;

function ojoDeLaLuna(): string {
  const [x0, y0, w, h] = OJO.caja;
  const { x, y } = LUNA;
  const rnd = azar(1373);
  let rayos = '';
  for (let i = 0; i < 40; i++) {
    const a = (i / 40) * Math.PI * 2 + rnd() * 0.1;
    rayos += `M${f(x + Math.cos(a) * 15)} ${f(y + Math.sin(a) * 15)} L${f(x + Math.cos(a) * (28 + rnd() * 9))} ${f(y + Math.sin(a) * (28 + rnd() * 9))} `;
  }
  const almendra = `M${x - 48} ${y} Q${x} ${y - 44} ${x + 48} ${y} Q${x} ${y + 38} ${x - 48} ${y} Z`;
  return (
    `<g filter="url(#rociado)"><rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="${A.negro}" fill-opacity="0"/>` +
    recortado(almendra,
      forma(almendra, A.papel, 0.5) +
      forma(circulo(x, y, 38), A.cobreHondo, 0.9) + nube(x, y, 30, 30, A.cobre, 'm', 0.7) + trazo(rayos, A.veta, 1, 0.5) +
      forma(circulo(x, y, 15), A.tierraHonda) + nube(x - 12, y - 14, 5, 4, A.papel, 'xs', 0.9) +
      // El párpado de arriba, que le hace sombra.
      nube(x, y - 40, 60, 16, A.violeta, 'm', 0.7)) +
    trazo(`M${x - 48} ${y} Q${x} ${y - 44} ${x + 48} ${y}`, A.cielo, 2.4, 0.7) + trazo(`M${x - 48} ${y} Q${x} ${y + 38} ${x + 48} ${y}`, A.violeta, 1.4, 0.6) +
    `</g>`
  );
}

const CAJA_DE_LA_JAULA = [JAULA.x - 34, JAULA.y - 22, 84, 96] as const;

/** Las piezas sueltas del árbol largo: el ojo de la luna, que asoma, y la jaula con su pajarito, fina, para la lupa. */
export const PIEZAS_DEL_BONETE: readonly Pieza[] = [
  ...COLGANTES.map((c): Pieza => ({ nombre: c.pieza, caja: c.caja, dibujo: c.dibujo, densidad: 2.5 })),
  { nombre: 'camino-arbol-ojo', caja: OJO.caja, dibujo: ojoDeLaLuna(), densidad: 2.5 },
  {
    nombre: 'fino-arbol-jaula',
    caja: CAJA_DE_LA_JAULA,
    dibujo: `<g filter="url(#rociado)"><rect x="${CAJA_DE_LA_JAULA[0]}" y="${CAJA_DE_LA_JAULA[1]}" width="${CAJA_DE_LA_JAULA[2]}" height="${CAJA_DE_LA_JAULA[3]}" fill="${A.negro}" fill-opacity="0"/>${colgado(RAMA_IZQ, CUELGA_LA_JAULA.x, CUELGA_LA_JAULA.largo, jaula(), -2)}</g>`,
    densidad: 4,
  },
  {
    nombre: 'fino-arbol-bonete',
    caja: GRAN_BONETE.caja,
    dibujo: `<g filter="url(#rociado)"><rect x="${GRAN_BONETE.caja[0]}" y="${GRAN_BONETE.caja[1]}" width="${GRAN_BONETE.caja[2]}" height="${GRAN_BONETE.caja[3]}" fill="${A.negro}" fill-opacity="0"/>${bocaDelBonete()}</g>`,
    densidad: 3,
  },
];
