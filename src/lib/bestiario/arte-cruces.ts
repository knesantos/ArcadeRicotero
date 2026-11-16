/**
 * Lo que cada región deja en su cruce (`D-91`, tanda 2, segunda vuelta).
 *
 * El cruce del final era igual en las trece: la noche, el descampado y las picadas. Está bien que sea
 * la noche de afuera (es lo que une el mundo), pero **por dónde se sale** es de cada lugar. Acá va lo
 * que queda parado en el borde, entre la escena y los carteles: del galpón se sale por el portón de
 * chapa, pisando vasos; del salón del infierno, por su arco, con la alfombra que sigue un trecho; de
 * la mesa, por la puerta del pasillo, con las baldosas de la cocina y la pila de platos.
 *
 * Todo va a la izquierda del primer cartel y nada abajo de los postes. Lo pinta `piezaDelCruce`
 * (`arte-camino.ts`) adentro de su rociado, después de la noche y antes de apagar el borde de abajo.
 */

import { forma, nube, trazo } from './aerografo.ts';
import { azar } from './pincel.ts';

const f = (v: number): string => (Math.round(v * 10) / 10).toString();
const poli = (ps: readonly (readonly [number, number])[]): string => `M${ps.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L')} Z`;
const elipse = (x: number, y: number, rx: number, ry: number): string =>
  `M${f(x - rx)} ${f(y)} a${f(rx)} ${f(ry)} 0 1 0 ${f(rx * 2)} 0 a${f(rx)} ${f(ry)} 0 1 0 ${f(-rx * 2)} 0 Z`;

const N = 'var(--fondo)';
const GA = { brasa: 'var(--entorno-galpon-brasa)', rojo: 'var(--entorno-galpon-rojo)', luz: 'var(--entorno-galpon-luz)', noche: 'var(--entorno-galpon-noche)', papel: 'var(--papel)' };
const IN = { brasa: 'var(--entorno-infierno-brasa)', fuego: 'var(--entorno-infierno-fuego)', rojo: 'var(--disco-gulp-tinta)', oro: 'var(--acento-2)' };
const ME = { papel: 'var(--entorno-mesa-papel)', sepia: 'var(--entorno-mesa-sepia)', honda: 'var(--entorno-mesa-sepia-honda)', clara: 'var(--entorno-mesa-sepia-clara)', rojo: 'var(--entorno-mesa-rojo)', naranja: 'var(--disco-la-mosca-y-la-sopa-tinta)' };

/** Hasta dónde llega el adorno de un cruce, desde el final de la escena: más allá están los carteles. */
export const ANCHO_DEL_ADORNO = 164;

/** El portón del galpón: dos hojas de chapa abiertas para afuera, el dintel con su foco, y lo que quedó en el piso. */
function salidaDelGalpon(e: number): string {
  const rnd = azar(5003);
  const [a, b] = [e + 2, e + 116];
  const hojaDeChapa = (x: number, lado: number): string => {
    const ps: [number, number][] = [[x, 172], [x + lado * 44, 196], [x + lado * 44, 622], [x, 600]];
    let costillas = '';
    for (let i = 1; i < 6; i++) costillas += trazo(`M${f(x + lado * i * 7.4)} ${f(172 + i * 4)} L${f(x + lado * i * 7.4)} ${f(600 + i * 3.6)}`, GA.brasa, 1.4, 0.7);
    return forma(poli(ps), GA.noche) + costillas + trazo(`M${f(x + lado * 44)} 196 L${f(x + lado * 44)} 622`, GA.rojo, 1.6, 0.6);
  };
  // Vasos pisados y volantes, sembrados del portón para afuera y cada vez más ralos.
  let basura = '';
  for (let i = 0; i < 20; i++) {
    const x = a - 30 + rnd() ** 1.4 * 190;
    const y = 566 + rnd() * 56;
    const g = rnd() * 180;
    basura +=
      i % 3
        ? `<g transform="rotate(${f(g)} ${f(x)} ${f(y)})">${forma(poli([[x - 4, y - 2.4], [x + 5, y - 3], [x + 6, y + 2.6], [x - 3, y + 2]]), GA.papel, 0.55 + rnd() * 0.3)}</g>`
        : `<g transform="rotate(${f(g)} ${f(x)} ${f(y)})">${forma(poli([[x - 5, y - 3.4], [x + 5, y - 3.4], [x + 3.6, y + 3.4], [x - 3.6, y + 3.4]]), GA.luz, 0.5 + rnd() * 0.3)}</g>`;
  }
  return (
    hojaDeChapa(a, -1) +
    hojaDeChapa(b, 1) +
    // El marco: dos parantes y el dintel, de fierro.
    forma(poli([[a - 5, 160], [a + 5, 160], [a + 5, 604], [a - 5, 600]]) + poli([[b - 5, 160], [b + 5, 160], [b + 5, 604], [b - 5, 600]]) + poli([[a - 12, 152], [b + 12, 152], [b + 12, 170], [a - 12, 170]]), N) +
    trazo(`M${f(a - 12)} 170.6 L${f(b + 12)} 170.6`, GA.rojo, 1.4, 0.7) +
    // El foco de la salida, arriba del dintel: un tubo que alumbra para abajo.
    forma(poli([[(a + b) / 2 - 16, 172], [(a + b) / 2 + 16, 172], [(a + b) / 2 + 14, 178], [(a + b) / 2 - 14, 178]]), GA.papel, 0.9) +
    nube((a + b) / 2, 200, 44, 34, GA.luz, 'l', 0.3) +
    nube((a + b) / 2, 596, 60, 12, GA.luz, 'm', 0.22) +
    basura
  );
}

/** La puerta del salón: un arco apuntado, negro, con el canto de adentro prendido, y la alfombra que sigue un trecho. */
function puertaDelSalon(e: number): string {
  const rnd = azar(5009);
  const [a, b] = [e + 8, e + 122];
  const m = (a + b) / 2;
  const arco = `M${f(a - 12)} 606 L${f(a - 12)} 250 Q${f(a - 8)} 150 ${f(m)} 104 Q${f(b + 8)} 150 ${f(b + 12)} 250 L${f(b + 12)} 606 L${f(b - 8)} 602 L${f(b - 8)} 256 Q${f(b - 10)} 176 ${f(m)} 138 Q${f(a + 10)} 176 ${f(a + 8)} 256 L${f(a + 8)} 602 Z`;
  // La alfombra sale por el arco y sigue la picada, cada vez más angosta, hasta deshilacharse.
  // Arranca en punta, adentro de lo oscuro: un canto derecho ahí se leía como un cajón rojo.
  const alfombra = poli([[a - 96, 598], [a - 40, 580], [a + 30, 572], [b + 34, 584], [b + 40, 598], [a + 30, 606], [a - 44, 614]]);
  let flecos = '';
  for (let i = 0; i < 9; i++) flecos += trazo(`M${f(b + 36)} ${f(585 + i * 1.6)} l${f(5 + rnd() * 9)} ${f(-1 + rnd() * 2)}`, IN.oro, 0.9, 0.7);
  let brasas = '';
  for (let i = 0; i < 26; i++) {
    const x = a - 40 + rnd() * 200;
    const y = 540 + rnd() * 84;
    brasas += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(0.7 + rnd() * 1.3)}" fill="${i % 4 ? IN.fuego : IN.oro}" opacity="${f(0.45 + rnd() * 0.5)}"/>`;
  }
  return (
    // Lo que el salón le tira a la noche: un resplandor en el piso, del lado de adentro.
    nube(a - 10, 590, 70, 16, IN.fuego, 'l', 0.22) +
    forma(alfombra, IN.rojo, 0.92) +
    trazo(`M${f(a - 40)} 583 L${f(a + 30)} 575.4 L${f(b + 34)} 586.6`, IN.oro, 1.3, 0.7) +
    trazo(`M${f(a - 44)} 611 L${f(a + 30)} 603 L${f(b + 38)} 596`, IN.oro, 1.3, 0.7) +
    flecos +
    forma(arco, N) +
    // El canto de adentro del arco, del lado del fuego: una raya cortada, como en las columnas del salón.
    trazo(`M${f(a + 8.6)} 600 L${f(a + 8.6)} 256 Q${f(a + 10.6)} 177 ${f(m)} 139`, IN.fuego, 1.8, 0.75) +
    trazo(`M${f(b - 8.6)} 470 L${f(b - 8.6)} 256 Q${f(b - 10.6)} 177 ${f(m)} 139`, IN.brasa, 1.8, 0.9) +
    brasas
  );
}

/** La puerta del pasillo: el marco de madera, la hoja entornada, las baldosas de la cocina y los platos apilados. */
function pasilloDeLaMesa(e: number): string {
  const [a, b] = [e + 6, e + 112];
  // Las baldosas: un damero en escorzo, que se ralea hacia la noche.
  let baldosas = '';
  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 9; i++) {
      if ((i + j) % 2 || (i > 5 && (i + j) % 4)) continue;
      const y0 = 566 + j * 13;
      const sesgo = (y: number): number => (y - 566) * 0.5;
      const x0 = a - 44 + i * 26;
      baldosas += forma(poli([[x0 - sesgo(y0), y0], [x0 + 26 - sesgo(y0), y0], [x0 + 26 - sesgo(y0 + 13), y0 + 13], [x0 - sesgo(y0 + 13), y0 + 13]]), ME.papel, 0.5 - i * 0.045);
    }
  }
  // La pila de platos, al lado del marco, con una cuchara encima.
  let platos = '';
  for (let i = 0; i < 9; i++) platos += forma(elipse(b + 30 + Math.sin(i * 1.7) * 2.4, 600 - i * 4.4, 15, 3.6), i % 2 ? ME.papel : ME.clara, 0.9);
  return (
    baldosas +
    // La hoja de la puerta, entornada para afuera.
    forma(poli([[b, 182], [b + 34, 200], [b + 34, 616], [b, 600]]), ME.honda) +
    trazo(`M${f(b + 6)} 214 L${f(b + 28)} 224 L${f(b + 28)} 384 L${f(b + 6)} 380 Z M${f(b + 6)} 404 L${f(b + 28)} 410 L${f(b + 28)} 586 L${f(b + 6)} 576 Z`, ME.sepia, 1.3, 0.8) +
    forma(elipse(b + 26, 398, 2.4, 2.4), ME.naranja) +
    // El marco.
    forma(poli([[a - 8, 174], [a + 6, 174], [a + 6, 604], [a - 8, 600]]) + poli([[b - 6, 174], [b + 8, 174], [b + 8, 604], [b - 6, 600]]) + poli([[a - 16, 162], [b + 16, 162], [b + 16, 182], [a - 16, 182]]), ME.honda) +
    trazo(`M${f(a + 6.6)} 600 L${f(a + 6.6)} 182.6 L${f(b - 6.6)} 182.6 L${f(b - 6.6)} 600`, ME.sepia, 1.6, 0.9) +
    // Del pasillo viene la luz de la cocina: una cuña plana en el piso.
    forma(poli([[a + 8, 600], [b - 8, 600], [b + 6, 626], [a - 30, 626]]), ME.naranja, 0.22) +
    platos +
    trazo(`M${f(b + 24)} 562 l22 -7`, ME.clara, 2, 0.9) + forma(elipse(b + 23, 562.6, 4.6, 2.6), ME.clara, 0.9)
  );
}

/* Tanda 3 de `D-91`: los astilleros, Cybersiberia y el árbol. */

const PU = { noche: 'var(--entorno-astillero-noche)', clara: 'var(--entorno-astillero-tiza-clara)', naranja: 'var(--entorno-pastura)', sodio: 'var(--disco-cordero-atado-tinta)', papel: 'var(--papel)' };
const CY = { hondo: 'var(--entorno-cyber-acero-hondo)', acero: 'var(--entorno-cyber-acero)', claro: 'var(--entorno-cyber-acero-claro)', nieve: 'var(--entorno-cyber-nieve)', lente: 'var(--entorno-cyber-lente)', rojo: 'var(--marca-rojo)' };
const AB = { hondo: 'var(--entorno-arbol-marmol-hondo)', marmol: 'var(--entorno-arbol-marmol)', claro: 'var(--entorno-arbol-marmol-claro)', veta: 'var(--entorno-arbol-veta)', cobre: 'var(--entorno-arbol-cobre)', peltre: 'var(--disco-momo-sampler-apoyo)', plata: 'var(--disco-momo-sampler-tinta)' };

/** La salida del puerto: la garita con su ventana prendida y la barrera levantada, a rayas, con el farol de sodio arriba. */
function barreraDelPuerto(e: number): string {
  const [g, eje] = [e + 8, e + 84];
  let rayas = '';
  for (let i = 0; i < 6; i++) {
    const [x, y] = [eje + 6 + i * 11, 498 - i * 17.4];
    rayas += forma(poli([[x, y], [x + 11, y - 17.4], [x + 15, y - 14.6], [x + 4, y + 2.8]]), i % 2 ? PU.papel : PU.naranja, 0.9);
  }
  return (
    // La garita: una caja de chapa con techo a un agua, la ventana prendida y el canto de tiza.
    forma(poli([[g, 412], [g + 56, 404], [g + 56, 606], [g, 600]]), PU.noche) + forma(poli([[g - 6, 414], [g + 62, 400], [g + 62, 408], [g - 6, 422]]), N) +
    forma(poli([[g + 14, 446], [g + 44, 443], [g + 44, 484], [g + 14, 486]]), PU.sodio, 0.85) + trazo(`M${f(g + 29)} 444.6 L${f(g + 29)} 485 M${f(g + 14)} 466 L${f(g + 44)} 464`, N, 1.6) +
    nube(g + 29, 466, 34, 30, PU.sodio, 'l', 0.26) +
    trazo(`M${f(g)} 412 L${f(g + 56)} 404 L${f(g + 56)} 606`, PU.clara, 1.4, 0.55) +
    // La barrera, levantada: el pie, el contrapeso y el brazo a rayas.
    forma(poli([[eje - 5, 606], [eje - 5, 500], [eje + 7, 500], [eje + 7, 606]]) + poli([[eje - 22, 508], [eje + 2, 494], [eje + 8, 504], [eje - 16, 518]]), N) +
    rayas +
    trazo(`M${f(eje - 5)} 500 L${f(eje - 5)} 606`, PU.clara, 1.2, 0.5) +
    nube(e + 60, 600, 80, 12, PU.sodio, 'm', 0.2)
  );
}

/** La compuerta de Cybersiberia: un aro de chapa remachado, parado en la nieve, con la hoja abierta y la luz de adentro. */
function compuertaDeLaChapa(e: number): string {
  const [cx, cy, r] = [e + 74, 486, 74];
  let remaches = '';
  for (let i = 0; i < 20; i++) {
    const a = (i / 20) * Math.PI * 2;
    remaches += forma(elipse(cx + Math.cos(a) * (r + 9), cy + Math.sin(a) * (r + 9), 2.6, 2.6), CY.claro);
  }
  return (
    nube(cx, cy, r * 0.9, r * 0.9, CY.lente, 'l', 0.3) +
    `<circle cx="${cx}" cy="${cy}" r="${r + 9}" fill="none" stroke="${CY.acero}" stroke-width="18"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r + 17}" fill="none" stroke="${CY.hondo}" stroke-width="3"/>` +
    trazo(`M${f(cx - (r + 9) * 0.9)} ${f(cy - (r + 9) * 0.42)} A${r + 9} ${r + 9} 0 0 1 ${f(cx + (r + 9) * 0.3)} ${f(cy - (r + 9) * 0.95)}`, CY.claro, 2.4, 0.7) +
    remaches +
    // La hoja, abierta para este lado: se ve de canto, con su volante.
    forma(elipse(cx - r - 4, cy, 13, r + 4), CY.hondo) + trazo(`M${f(cx - r - 4)} ${f(cy - r)} L${f(cx - r - 4)} ${f(cy + r)}`, CY.claro, 1.6, 0.6) +
    `<circle cx="${f(cx - r - 8)}" cy="${cy}" r="9" fill="none" stroke="${CY.claro}" stroke-width="2.4"/>` +
    forma(elipse(cx + r + 14, cy - 44, 3, 3), CY.rojo) + nube(cx + r + 14, cy - 44, 7, 7, CY.rojo, 's', 0.5) +
    // La nieve que se juntó al pie, y la que la luz de adentro prende.
    forma(`M${f(cx - r - 40)} 606 Q${f(cx - 30)} 548 ${f(cx + 10)} 566 Q${f(cx + 60)} 552 ${f(cx + r + 30)} 606 Z`, CY.claro) +
    nube(cx - 10, 572, 50, 9, CY.nieve, 'm', 0.7) + nube(cx + 8, 590, 60, 10, CY.lente, 'm', 0.3)
  );
}

/** La última rama del árbol: baja hasta el borde con un bonete colgando, y en el piso quedó un huevo de plata roto. */
function ultimaRama(e: number): string {
  const rama = `M${f(e - 30)} 130 C${f(e + 20)} 150 ${f(e + 60)} 196 ${f(e + 86)} 250 Q${f(e + 96)} 276 ${f(e + 120)} 286 Q${f(e + 90)} 284 ${f(e + 74)} 262 C${f(e + 50)} 214 ${f(e + 14)} 176 ${f(e - 30)} 164 Z`;
  const [bx, by] = [e + 92, 362];
  const [hx, hy] = [e + 70, 596];
  return (
    forma(rama, AB.hondo) + nube(e + 30, 168, 40, 12, AB.marmol, 'm', 0.9) +
    trazo(`M${f(e - 20)} 146 C${f(e + 24)} 160 ${f(e + 56)} 200 ${f(e + 80)} 248 M${f(e + 10)} 170 C${f(e + 36)} 186 ${f(e + 58)} 216 ${f(e + 74)} 250`, AB.claro, 1.2, 0.8) +
    trazo(`M${f(e + 2)} 152 C${f(e + 30)} 166 ${f(e + 50)} 190 ${f(e + 66)} 220`, AB.veta, 0.9, 0.5) +
    // El bonete, colgado del codo de la rama.
    trazo(`M${f(bx)} ${f(by)} L${f(bx - 4)} 270`, AB.veta, 0.9, 0.55) +
    forma(poli([[bx, by], [bx - 15, by + 46], [bx + 15, by + 46]]), AB.cobre) + trazo(`M${f(bx - 6)} ${f(by + 20)} l13 -6 M${f(bx - 11)} ${f(by + 36)} l24 -11`, AB.veta, 4, 0.85) + forma(elipse(bx, by - 2, 4.6, 4.6), AB.veta) +
    // El huevo roto: las dos cáscaras, y lo de adentro, negro.
    nube(hx + 6, hy + 4, 34, 6, N, 's', 0.8) +
    forma(`M${f(hx - 22)} ${f(hy)} Q${f(hx - 24)} ${f(hy - 22)} ${f(hx - 12)} ${f(hy - 30)} l4 9 l6 -8 l5 10 l6 -7 Q${f(hx + 14)} ${f(hy - 12)} ${f(hx + 8)} ${f(hy)} Z`, AB.peltre) +
    nube(hx - 14, hy - 16, 4, 7, AB.plata, 'xs', 0.9) +
    forma(`M${f(hx + 18)} ${f(hy + 4)} q10 -20 26 -8 q-4 12 -26 8 Z`, AB.peltre, 0.9) + forma(elipse(hx - 6, hy - 3, 9, 2.4), N, 0.8)
  );
}

/** El adorno de cada cruce: recibe dónde termina la escena. Las regiones que no están, no tienen (todavía). La tanda 3 sumó la barrera del puerto, la compuerta de la chapa y la última rama del árbol. */
export const ADORNOS_DEL_CRUCE: Readonly<Record<string, (escena: number) => string>> = {
  'el-galpon': salidaDelGalpon,
  'el-infierno': puertaDelSalon,
  'la-mesa': pasilloDeLaMesa,
  'los-astilleros': barreraDelPuerto,
  cybersiberia: compuertaDeLaChapa,
  'el-arbol': ultimaRama,
};
