/**
 * El arte del camino con cruces (`D-73`, séptima vuelta): el monte y la pastura, largos.
 *
 * Es el mismo monte de la segunda vuelta (`arte.ts`): las tiras de la contratapa de *Lobo
 * suelto*, de noche, a aerógrafo, y la pastura naranja de *Cordero atado*. Lo que cambia es el
 * largo: acá se camina, así que cada capa es una tira de varias pantallas, con el ancho que
 * pide su velocidad (`anchoDeCapa`, en `camino.ts`).
 *
 * Lo lejano y lo de adelante son del monte y sirven para los dos tramos: la pastura es un claro
 * adentro del monte, y el que pasa de una a la otra sigue viendo los mismos árboles. Lo que
 * cambia es el piso. Al final de cada piso se ve lo que viene: la luz naranja de la pastura
 * entre los árboles del monte, y la vela de la mesa servida al salir del claro.
 *
 * `scripts/imprimir-bestiario.mjs` imprime estas piezas junto con las de `arte.ts`.
 */

import { forma, nube, soplo, trazo, type Pieza } from './aerografo.ts';
import { M, azar, filaDeTiras, paloDeLaPastura } from './arte.ts';
import { ENTORNOS, PIEZAS_ENTORNOS, santuario } from './arte-entornos.ts';
import { ALTO, CAMINOS, CRUCE, K_ENTORNO, SOLAPE, VELOCIDAD, anchoDeCapa, type Tramo } from './camino.ts';
import { tintaDe } from './mapa.ts';
import { sueloDeCybersiberia, sueloDeLaMesa, sueloDeLaPastura, sueloDeLaRuta, sueloDeLosAstilleros, sueloDelArbol, sueloDelGalpon, sueloDelMonte } from './arte-suelo.ts';
import { CAMPO, MONTE, alambrado, arado, carroVolcado, brumaEntrePlanos, calaveraDeVaca, cardo, mataDePasto, pasturaLejos, planoLejano, planoMedio } from './arte-arboles.ts';
import { ARBOL, GALPON, MESA, RUTA } from './rig-entornos.ts';
import { galponFrenteLargo, galponLejosLargo, galponPisoLargo } from './arte-recital.ts';
import { PIEZAS_DEL_SALON } from './arte-salon.ts';
import { ADORNOS_DEL_CRUCE } from './arte-cruces.ts';
import { CUEVA, PIEZAS_DE_LA_SOBREMESA, bajoElMantel, candelabro, cuevaDelRaton, mesaLejosLarga } from './arte-sobremesa.ts';
import { ASTILLERO } from './rig-entornos.ts';
import { PALO } from './rig.ts';

const ANCHO = CAMINOS['el-monte']!.ancho;
/**
 * Lo lejano llega hasta el final del piso aunque su velocidad pida menos: en la vista quieta
 * (con movimiento reducido o sin JavaScript) las capas van todas juntas, y si no, al final
 * quedaría la noche vacía.
 */
const LEJOS = Math.max(anchoDeCapa(VELOCIDAD.lejos, ANCHO), ANCHO);
const FRENTE = anchoDeCapa(VELOCIDAD.frente, ANCHO);
/** Desde dónde empieza el piso: arriba de esto, lo lejano se ve entero. */
const PISO = 240;

/** La luz de la mesa servida: una vela, en la tinta de *La mosca y la sopa*. */
const VELA = 'var(--disco-la-mosca-y-la-sopa-tinta)';

/**
 * Lo lejano del monte (`D-91`, `T-530`): ya no es una fila de tiras. Son árboles de papel rasgado
 * (`arte-arboles.ts`) en dos planos que se separan por valor y por bruma: atrás, palos finos y grises
 * contra el frío petróleo de *Lobo suelto*; en el medio, árboles enteros con brazos y manos. Los
 * troncos gordos de adelante van aparte, en el aire (`aire-monte-troncos`), para que se corran a
 * otra velocidad. En un claro, la luna, que no se ve nunca entera.
 */
function lejos(): string {
  const luna = { x: Math.round(LEJOS * 0.34), y: 138, r: 46 };
  return (
    `<g filter="url(#rociado)">` +
    `<rect x="-10" y="-10" width="${LEJOS + 20}" height="${ALTO + 20}" fill="${M.negro}"/>` +
    // El fondo del fondo: frío arriba, pardo abajo. La noche no es negra pareja.
    brumaEntrePlanos(0, LEJOS, 120, 90, MONTE.frio, 0.26, 73) +
    brumaEntrePlanos(0, LEJOS, 232, 60, M.hondo, 0.5, 75) +
    // La luna entre los palos: el resplandor, el disco, y la mitad de abajo comida por la bruma.
    nube(luna.x, luna.y, luna.r * 3.4, luna.r * 2.6, M.medio, 'xl', 0.3) +
    `<circle cx="${luna.x}" cy="${luna.y}" r="${luna.r}" fill="${M.claro}" opacity="0.86"/>` +
    nube(luna.x + 14, luna.y + 12, luna.r * 0.7, luna.r * 0.6, M.medio, 'm', 0.6) +
    nube(luna.x - 6, luna.y + luna.r * 0.9, luna.r * 1.5, luna.r * 0.5, M.hondo, 'l', 0.7) +
    planoLejano(-30, LEJOS + 30, 316, 79) +
    brumaEntrePlanos(0, LEJOS, 250, 40, M.medio, 0.24, 81) +
    brumaEntrePlanos(0, LEJOS, 296, 26, MONTE.frio, 0.2, 83) +
    planoMedio(-30, LEJOS + 30, 326, 87) +
    // El pie de los árboles se hunde en la niebla, en vez de cortarse contra el piso.
    brumaEntrePlanos(0, LEJOS, 312, 22, M.hondo, 0.62, 89) +
    brumaEntrePlanos(0, LEJOS, 330, 14, M.medio, 0.3, 91) +
    `</g>`
  );
}

/**
 * El piso del monte: oscuro, con el borde de arriba soplado (detrás se hunde el lobo), y una
 * picada más clara, pisada, que lo cruza entero. Unos pastos de crayón para que se note que el
 * piso pasa.
 */
function pisoDelMonte(desde: number, hasta: number, semilla: number): string {
  const rnd = azar(semilla);
  // Dos bordes, como en el recinto: el de atrás sube un poco más que el de adelante.
  const borde = (y: number): string => {
    let d = `M${desde - 40} ${y + 4}`;
    for (let x = desde; x <= hasta + 40; x += 120) d += ` C${x + 30} ${(y - 8 + rnd() * 16).toFixed(1)}, ${x + 90} ${(y - 8 + rnd() * 16).toFixed(1)}, ${x + 120} ${(y + rnd() * 8).toFixed(1)}`;
    return d + ` L${hasta + 40} ${ALTO + 40} L${desde - 40} ${ALTO + 40} Z`;
  };
  let picada = `M${desde - 40} 520`;
  for (let x = desde; x <= hasta + 40; x += 200) picada += ` C${x + 60} ${(500 + rnd() * 30).toFixed(1)}, ${x + 140} ${(506 + rnd() * 30).toFixed(1)}, ${x + 200} ${(512 + rnd() * 20).toFixed(1)}`;
  // Los pastos (`D-91`, tercera vuelta). Primero eran rayitas (lluvia), después brotes sueltos
  // repartidos parejo (regla §3: salpicado). Ahora son **matas con peso**: pocas, cada una un manojo
  // apretado de varias matas de hojas anchas con su sombra, y entre mata y mata, nada.
  let pastos = '';
  for (let cx = desde + 60 + rnd() * 90; cx < hasta - 40; cx += 150 + rnd() * 170) {
    const hondura = rnd();
    const cy = 352 + hondura * 244;
    const alto = 9 + hondura * 20;
    const cuantas = 3 + Math.floor(rnd() * 4);
    pastos += nube(cx, cy + 3, alto * 1.9, alto * 0.3, M.negro, 'm', 0.6);
    for (let k = 0; k < cuantas; k++) {
      const u = k / Math.max(1, cuantas - 1) - 0.5;
      pastos += mataDePasto(cx + u * alto * 3 + (rnd() - 0.5) * 6, cy + Math.abs(u) * -4 + (rnd() - 0.5) * 4, alto * (0.7 + rnd() * 0.5), rnd, rnd() < 0.6 ? M.oscuro : M.hondo, rnd() < 0.5 ? M.sombra : MONTE.ocre, 8);
    }
  }
  let noche = '';
  for (let x = desde + 80; x < hasta; x += 220 + rnd() * 240) {
    noche += nube(x, 400 + rnd() * 180, 140 + rnd() * 160, 50 + rnd() * 50, M.negro, 'xl', 0.35 + rnd() * 0.3);
  }
  return (
    // El canto de atrás, bien soplado: el piso no arranca con una raya.
    soplo(borde(300), M.oscuro, 'l') +
    soplo(borde(320), M.oscuro, 'm') +
    nube((desde + hasta) / 2, 600, (hasta - desde) * 0.6, 80, M.negro, 'xl', 0.5) +
    noche +
    soplo(`${picada} L${hasta + 40} 600 L${desde - 40} 600 Z`, M.sombra, 'l', 0.5) +
    // Lo tirado en el piso (`D-90`): charcos que reflejan las tiras, raíces, piedras, un costillar.
    sueloDelMonte(desde, hasta, semilla + 7) +
    pastos +
    // Abajo, lo más cerca, se apaga: la noche se come el borde de la vista.
    soplo(`M${desde - 40} 590 L${hasta + 40} 590 L${hasta + 40} ${ALTO + 40} L${desde - 40} ${ALTO + 40} Z`, M.negro, 'l', 0.7)
  );
}

/**
 * Un sendero, **en escorzo** (`D-91`, tercera vuelta). El de la segunda vuelta subía casi derecho y
 * claro: en la captura era un haz de luz. Este se ve desde arriba y de costado, como todo el piso:
 * cerca es ancho y cruza la pantalla acostado; a medida que se aleja se angosta rápido, hace dos
 * curvas cada vez más apretadas y se pierde en el borde, entre los troncos. `va` es para qué lado.
 *
 * Es tierra pisada, no luz: apenas más clara que el barro, con dos surcos, cascotes, y el canto
 * comido por matas que le crecen encima.
 */
function sendero(x: number, va: number, semilla: number): string {
  const rnd = azar(semilla);
  const ps: [number, number, number][] = [];
  const n = 26;
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    // La perspectiva: lo lejos se apila contra el borde. `hondo` va de 0 (acá) a 1 (el borde del piso).
    const hondo = 1 - (1 - u) ** 2.2;
    const y = 632 - hondo * 312;
    // Lo que se corre de costado se achica con la distancia, y las curvas se aprietan.
    const lejos = 1 - hondo * 0.86;
    const px = x + va * (u * 250 + Math.sin(u * Math.PI * 2.4 + 0.4) * 96 * lejos);
    ps.push([px, y, 108 * lejos ** 1.7 + 3.5]);
  }
  const canto = (lado: number, k = 1): string => ps.map(([px, py, w], i) => `${i ? 'L' : 'M'}${(px + lado * w * 0.5 * k).toFixed(1)} ${(py + lado * w * 0.07).toFixed(1)}`).join(' ');
  const vuelta = (k = 1): string => [...ps].reverse().map(([px, py, w]) => `L${(px + w * 0.5 * k).toFixed(1)} ${(py + w * 0.07).toFixed(1)}`).join(' ');
  const cuerpo = `${canto(-1)} ${vuelta()} Z`;
  let s = soplo(cuerpo, M.sombra, 's', 0.42) + soplo(`${canto(-1, 0.6)} ${vuelta(0.6)} Z`, M.hondo, 'm', 0.2);
  // Los dos surcos, más oscuros: por donde pasa todo.
  for (const lado of [-0.28, 0.26]) s += `<path d="${ps.map(([px, py, w], i) => `${i ? 'L' : 'M'}${(px + lado * w).toFixed(1)} ${(py + lado * w * 0.14).toFixed(1)}`).join(' ')}" fill="none" stroke="${M.negro}" stroke-width="2.4" opacity="0.4" filter="url(#soplo-xs)"/>`;
  // Cascotes y matas en el canto, más grandes cuanto más cerca.
  for (let i = 0; i < n; i++) {
    const [px, py, w] = ps[i]!;
    const cerca = w / 108;
    if (rnd() < 0.75) {
      const lado = rnd() < 0.5 ? -1 : 1;
      s += mataDePasto(px + lado * w * (0.44 + rnd() * 0.14), py + 2 + lado * w * 0.07, 6 + cerca * 22 + rnd() * 4, rnd, rnd() < 0.6 ? M.oscuro : M.hondo, M.sombra, 7);
    }
    if (rnd() < 0.5 && w > 9) {
      const cx = px + (rnd() - 0.5) * w * 0.7;
      const r = 1.2 + cerca * 3.4 * rnd();
      s += nube(cx + 1, py + 1, r * 1.4, r * 0.5, M.negro, 'xs', 0.6) + forma(`M${(cx - r).toFixed(1)} ${py.toFixed(1)} L${(cx - r * 0.3).toFixed(1)} ${(py - r * 0.8).toFixed(1)} L${(cx + r * 0.7).toFixed(1)} ${(py - r * 0.6).toFixed(1)} L${(cx + r).toFixed(1)} ${py.toFixed(1)} Z`, M.hondo, 0.85);
    }
  }
  return s;
}

/** Hojarasca: un montón de hojas caídas, chicas, cada una para su lado, en los pardos del lobo. Más apretadas en el medio. */
function hojarasca(x: number, y: number, ancho: number, semilla: number): string {
  const rnd = azar(semilla);
  const tintas = [MONTE.ocre, M.sombra, M.sombra, MONTE.crema, 'var(--bestia-lobo-boca)', M.hondo];
  const escala = 0.6 + ((y - 340) / 280) * 0.9;
  let s = nube(x, y, ancho * 0.6, ancho * 0.14, M.negro, 'l', 0.45);
  for (let i = 0; i < Math.round(ancho * 0.7); i++) {
    const a = rnd() * Math.PI * 2;
    const d = rnd() ** 1.6;
    const hx = x + Math.cos(a) * d * ancho * 0.56;
    const hy = y + Math.sin(a) * d * ancho * 0.15;
    const l = (2.6 + rnd() * 3.4) * escala;
    const giro = rnd() * 180;
    const color = tintas[Math.floor(rnd() * tintas.length)]!;
    s += `<path d="M${(-l).toFixed(1)} 0 Q0 ${(-l * 0.62).toFixed(1)} ${l.toFixed(1)} 0 Q0 ${(l * 0.5).toFixed(1)} ${(-l).toFixed(1)} 0 Z" fill="${color}" opacity="${(0.45 + rnd() * 0.45).toFixed(2)}" transform="translate(${hx.toFixed(1)} ${hy.toFixed(1)}) rotate(${giro.toFixed(0)}) scale(1 0.6)"/>`;
  }
  return s;
}

/** Una piedra con musgo: la piedra parda, enterrada, y encima el musgo en el verde del ojo del cordero, que es el único verde de las dos tapas. */
function piedraConMusgo(x: number, y: number, w: number, semilla: number): string {
  const rnd = azar(semilla);
  const h = w * (0.5 + rnd() * 0.2);
  const d = `M${x - w / 2} ${y} L${(x - w * 0.44).toFixed(1)} ${(y - h * 0.62).toFixed(1)} L${(x - w * 0.12).toFixed(1)} ${(y - h).toFixed(1)} L${(x + w * 0.24).toFixed(1)} ${(y - h * 0.86).toFixed(1)} L${(x + w * 0.47).toFixed(1)} ${(y - h * 0.34).toFixed(1)} L${x + w / 2} ${y} Z`;
  const musgo = 'var(--bestia-cordero-ojo)';
  let motas = '';
  for (let i = 0; i < 7; i++) motas += nube(x - w * 0.3 + rnd() * w * 0.55, y - h * (0.72 + rnd() * 0.26), w * (0.07 + rnd() * 0.08), h * 0.1, musgo, 'xs', 0.6 + rnd() * 0.3);
  return (
    nube(x + w * 0.08, y + 2, w * 0.68, h * 0.2, M.negro, 's', 0.85) +
    `<clipPath id="pm-${semilla}"><path d="${d}"/></clipPath><g clip-path="url(#pm-${semilla})">` +
    forma(d, M.hondo) + nube(x - w * 0.1, y - h * 0.9, w * 0.4, h * 0.34, M.medio, 's', 0.7) + nube(x + w * 0.2, y - h * 0.1, w * 0.5, h * 0.5, M.negro, 's', 0.85) + motas +
    `</g>` +
    // El musgo que desborda, y la tierra que la tapa por abajo.
    nube(x - w * 0.2, y - h * 0.98, w * 0.22, h * 0.09, musgo, 'xs', 0.6) +
    nube(x, y + 2.4, w * 0.5, 2.2, M.oscuro, 'xs', 0.9)
  );
}

/** Barro mojado: una mancha oscura, chata, con dos pelos de luz donde el agua agarra la luna. */
function barroMojado(x: number, y: number, ancho: number, semilla: number): string {
  const rnd = azar(semilla);
  let s = nube(x, y, ancho, ancho * 0.13, M.negro, 'm', 0.72) + nube(x + ancho * 0.2, y + 2, ancho * 0.6, ancho * 0.08, M.negro, 's', 0.6);
  for (let i = 0; i < 4; i++) {
    const bx = x - ancho * 0.6 + rnd() * ancho * 1.1;
    s += trazo(`M${bx.toFixed(1)} ${(y - 2 + rnd() * 6).toFixed(1)} q${(8 + rnd() * 14).toFixed(1)} -1.6 ${(18 + rnd() * 26).toFixed(1)} 0.4`, i % 2 ? M.medio : MONTE.frio, 1, 0.28 + rnd() * 0.2);
  }
  return s;
}

/**
 * El charco grande del monte (`D-91`, cuarta vuelta): agua quieta en el tercio de abajo, que era lo más
 * vacío. Devuelve lo que tiene atrás, dado vuelta y roto: la luna en tajadas, y los troncos como
 * bandas oscuras que bajan temblando. El canto de adelante agarra un pelo de luz.
 */
function charcoDeLaLuna(x: number, y: number, rx: number, ry: number): string {
  const rnd = azar(877);
  const silueta = `M${x - rx} ${y} C${x - rx} ${y - ry * 0.9} ${x - rx * 0.4} ${y - ry * 1.1} ${x + rx * 0.1} ${y - ry} C${x + rx * 0.7} ${y - ry * 0.9} ${x + rx * 1.04} ${y - ry * 0.4} ${x + rx} ${y + ry * 0.1} C${x + rx * 0.94} ${y + ry} ${x + rx * 0.3} ${y + ry * 1.1} ${x - rx * 0.2} ${y + ry} C${x - rx * 0.7} ${y + ry * 0.96} ${x - rx} ${y + ry * 0.6} ${x - rx} ${y} Z`;
  let adentro = forma(silueta, M.negro) + nube(x, y - ry * 0.3, rx * 0.8, ry * 0.7, MONTE.frio, 'l', 0.3);
  // Los troncos: bandas que bajan desde el canto de atrás, en tramos corridos.
  for (let i = 0; i < 7; i++) {
    const tx = x - rx * 0.8 + ((i + rnd() * 0.6) / 7) * rx * 1.6;
    const w = 4 + rnd() * 9;
    for (let k = 0; k < 5; k++) adentro += forma(`M${(tx + (k % 2 ? 2.4 : -2)).toFixed(1)} ${(y - ry + k * ry * 0.36).toFixed(1)} l${w.toFixed(1)} 0 l${(-0.6).toFixed(1)} ${(ry * 0.3).toFixed(1)} l${(-w).toFixed(1)} 0 Z`, M.negro, 0.9 - k * 0.12);
  }
  // La luna: cuatro tajadas claras, cada vez más angostas, que el agua corre de lugar.
  const lx = x + rx * 0.22;
  for (let k = 0; k < 5; k++) {
    const w = (26 - k * 3.6) * (0.8 + rnd() * 0.3);
    adentro += `<ellipse cx="${(lx + (k % 2 ? 4 : -3)).toFixed(1)}" cy="${(y - ry * 0.52 + k * ry * 0.3).toFixed(1)}" rx="${w.toFixed(1)}" ry="${(ry * 0.1).toFixed(1)}" fill="${M.claro}" opacity="${(0.8 - k * 0.12).toFixed(2)}"/>`;
  }
  return (
    nube(x, y + ry * 0.2, rx * 1.12, ry * 1.5, M.negro, 'm', 0.6) +
    `<clipPath id="ch-luna"><path d="${silueta}"/></clipPath><g clip-path="url(#ch-luna)">${adentro}</g>` +
    trazo(`M${x - rx * 0.62} ${y + ry * 0.95} Q${x} ${y + ry * 1.16} ${x + rx * 0.56} ${y + ry * 0.9}`, M.medio, 1.2, 0.5) +
    // Dos hojas flotando, y un junco.
    forma(`M${x - rx * 0.5} ${y + ry * 0.2} q8 -5 16 0 q-8 4 -16 0 Z`, MONTE.ocre, 0.7) + forma(`M${x + rx * 0.6} ${y - ry * 0.1} q6 -4 12 0 q-6 3 -12 0 Z`, M.sombra, 0.8)
  );
}

/**
 * Un tronco caído, hueco, con la boca para este lado (`D-91`): adentro, lejos de todo, dos puntos
 * que devuelven la luz. Es para el que saca la lupa.
 */
function troncoHueco(x: number, y: number, largo: number, gordo: number): string {
  const lomo = `M${x} ${y} C${x + largo * 0.3} ${y - gordo * 0.25} ${x + largo * 0.7} ${y - gordo * 0.2} ${x + largo} ${y + 3} L${x + largo + 6} ${y + gordo * 0.7} C${x + largo * 0.7} ${y + gordo * 0.92} ${x + largo * 0.3} ${y + gordo * 1.02} ${x} ${y + gordo} Z`;
  let dientes = '';
  for (let px = x + 14; px < x + largo - 8; px += 9 + ((px * 7) % 6)) {
    const sube = 3 + ((px * 13) % 6);
    dientes += `M${px} ${y - gordo * 0.14} l4 ${-sube} l5 ${sube + 1} Z `;
  }
  return (
    nube(x + largo * 0.5, y + gordo + 2, largo * 0.62, 7, M.negro, 's', 0.85) +
    forma(lomo, M.negro) +
    soplo(`M${x + 8} ${y + 2} C${x + largo * 0.3} ${y - gordo * 0.2} ${x + largo * 0.7} ${y - gordo * 0.16} ${x + largo - 6} ${y + 5} L${x + largo - 6} ${y + gordo * 0.3} L${x + 8} ${y + gordo * 0.36} Z`, M.oscuro, 's', 0.9) +
    forma(dientes, M.negro) +
    soplo(dientes, MONTE.ocre, 'xs', 0.7) +
    // La boca: el canto de la corteza, los anillos, y lo negro de adentro.
    `<ellipse cx="${x + 2}" cy="${y + gordo * 0.5}" rx="${gordo * 0.3}" ry="${gordo * 0.52}" fill="${M.sombra}"/>` +
    `<ellipse cx="${x + 3}" cy="${y + gordo * 0.5}" rx="${gordo * 0.24}" ry="${gordo * 0.44}" fill="${M.oscuro}"/>` +
    `<ellipse cx="${x + 4}" cy="${y + gordo * 0.52}" rx="${gordo * 0.17}" ry="${gordo * 0.34}" fill="${M.negro}"/>` +
    trazo(`M${x - gordo * 0.26} ${y + gordo * 0.3} Q${x - gordo * 0.2} ${y - gordo * 0.02} ${x + 4} ${y - gordo * 0.02}`, MONTE.ocre, 1.1, 0.6) +
    nube(x + 2.6, y + gordo * 0.5, 0.9, 0.9, MONTE.ojo, 'xs', 0.9) +
    nube(x + 6.4, y + gordo * 0.5, 0.9, 0.9, MONTE.ojo, 'xs', 0.9) +
    // Tercera vuelta: lo tallado también acá, en el lomo. El «P.R.» del tronco parado va en una capa que
    // se corre a otra velocidad, y con la lupa se escapa del punto que se agranda; este está en el piso.
    `<g transform="translate(${x + largo * 0.56} ${y + gordo * 0.42}) rotate(-3) scale(0.8)">` +
    trazo('M-9 4 L-9 -6 L-5.5 -6 Q-3 -6 -3 -3.4 Q-3 -1 -5.5 -1 L-9 -1 M-0.6 4 l0.1 0.1 M3 4 L3 -6 L6.5 -6 Q9 -6 9 -3.4 Q9 -1 6.5 -1 L3 -1 M6 -1 L9.4 4 M11.6 4 l0.1 0.1', MONTE.crema, 1.2, 0.75) +
    `</g>`
  );
}

/** El piso del monte, con la luz naranja de la pastura asomando al final, entre los árboles. */
function pisoMonte(): string {
  return (
    `<g filter="url(#rociado)">` +
    // La luz del claro, detrás del borde del piso: se ve antes de llegar al cruce.
    nube(ANCHO - 120, 330, 260, 70, M.naranja, 'xl', 0.55) +
    nube(ANCHO - 60, 320, 120, 36, M.naranjaHonda, 'l', 0.6) +
    pisoDelMonte(0, ANCHO, 101) +
    // El piso también tiene planos (`D-91`): atrás, la bruma fría al pie de los troncos; en el medio,
    // manchones tibios donde entra la luna. Antes era barro de un solo valor.
    brumaEntrePlanos(0, ANCHO, 342, 15, MONTE.frio, 0.34, 811) +
    brumaEntrePlanos(0, ANCHO, 366, 13, M.medio, 0.2, 813) +
    brumaEntrePlanos(0, ANCHO, 462, 26, MONTE.ocre, 0.12, 817) +
    brumaEntrePlanos(0, ANCHO, 556, 22, M.negro, 0.42, 819) +
    // Tercera vuelta: el barro deja de ser un plano de un valor. Dos senderos en escorzo; barro mojado
    // en los bajos; hojarasca juntada donde no pisa nadie; piedras con musgo. Nada cae cerca de
    // (660, 262), que es de otro bicho (`T-529`): todo esto está de y = 350 para abajo.
    charcoDeLaLuna(1500, 560, 176, 25) +
    barroMojado(430, 566, 120, 841) +
    barroMojado(1180, 420, 150, 843) +
    barroMojado(1640, 584, 130, 845) +
    barroMojado(2260, 380, 90, 847) +
    sendero(40, 1, 821) +
    sendero(2140, -1, 823) +
    hojarasca(560, 436, 150, 851) +
    hojarasca(1010, 590, 190, 853) +
    hojarasca(1400, 372, 120, 855) +
    hojarasca(1800, 470, 170, 857) +
    hojarasca(2330, 560, 130, 859) +
    piedraConMusgo(318, 388, 44, 861) +
    piedraConMusgo(1296, 544, 62, 863) +
    piedraConMusgo(1352, 556, 30, 865) +
    piedraConMusgo(2040, 372, 38, 867) +
    troncoHueco(790, 356, 150, 30) +
    `</g>`
  );
}

/**
 * El piso del campo (`D-91`): pasto de noche en los azules del cordero, peinado en hileras que se
 * agrandan hacia adelante; el alambrado en el fondo, con la tranquera abierta a la entrada; matas,
 * cardos y lo tirado (`sueloDeLaPastura`). En el claro no hay nada de esto: ahí manda el naranja.
 */
function pisoDelCampo(desde: number, hasta: number, semilla: number, claro: readonly [number, number]): string {
  const rnd = azar(semilla);
  const borde = (y: number): string => {
    let d = `M${desde - 40} ${y + 4}`;
    for (let x = desde; x <= hasta + 40; x += 150) d += ` C${x + 40} ${(y - 7 + rnd() * 12).toFixed(1)}, ${x + 110} ${(y - 7 + rnd() * 12).toFixed(1)}, ${x + 150} ${(y + rnd() * 6).toFixed(1)}`;
    return d + ` L${hasta + 40} ${ALTO + 40} L${desde - 40} ${ALTO + 40} Z`;
  };
  const enElClaro = (x: number): boolean => x > claro[0] && x < claro[1];
  // Lo pelado es redondo (`PELADO`): el pasto llega hasta el redondel, no hasta una caja alrededor.
  const cx = (claro[0] + claro[1]) / 2;
  const enLoPelado = (x: number, y: number): boolean => Math.hypot((x - cx) / PELADO.rx, (y - PALO.y - PELADO.dy) / PELADO.ry) < 0.9;
  /**
   * Segunda vuelta: el campo no es una alfombra. Se compone en **manchones** de pasto alto (cada uno
   * con su centro, más tupido adentro) y, entre ellos, tierra pisada y oscura por donde va la huella.
   * `tupido` dice cuánto pasto hay en un punto, de 0 a 1.
   */
  const manchones: [number, number, number, number][] = [];
  for (let x = desde + 40 + rnd() * 80; x < hasta; x += 210 + rnd() * 230) manchones.push([x, 372 + rnd() * 200, 90 + rnd() * 90, 26 + rnd() * 34]);
  const tupido = (x: number, y: number): number => {
    let t = 0;
    for (const [cx, cy, rx, ry] of manchones) t = Math.max(t, 1 - Math.hypot((x - cx) / rx, (y - cy) / ry));
    return t;
  };
  let luz = '';
  for (const [cx, cy, rx, ry] of manchones) luz += nube(cx, cy, rx * 1.1, ry * 1.2, CAMPO.azul, 'xl', 0.75);
  // La huella: de la tranquera al claro, y del claro a la salida. Tierra pisada, apenas más clara, que se angosta hacia el fondo.
  const huella = (ps: readonly (readonly [number, number, number])[]): string => {
    const arriba = ps.map(([x, y, w], i) => `${i ? 'L' : 'M'}${x} ${y - w / 2}`).join(' ');
    const abajo = [...ps].reverse().map(([x, y, w]) => `L${x} ${y + w / 2}`).join(' ');
    return soplo(`${arriba} ${abajo} Z`, M.negro, 'm', 0.5) + soplo(`${arriba} ${abajo} Z`, CAMPO.pezunia, 'l', 0.07);
  };
  const huellas =
    huella([[desde + 244, 334, 6], [desde + 300, 372, 14], [desde + 420, 410, 22], [desde + 600, 430, 26], [claro[0] + 60, 440, 30]]) +
    huella([[claro[1] - 60, 452, 30], [claro[1] + 150, 480, 28], [hasta - 420, 500, 30], [hasta - 150, 470, 22], [hasta - 40, 420, 12]]);
  let pasto = '';
  for (let i = 0; i < (hasta - desde) / 2.2; i++) {
    const x = desde + rnd() * (hasta - desde);
    const hondura = rnd() ** 0.8;
    const y = 336 + hondura * 290;
    if (enLoPelado(x, y)) continue;
    const t = tupido(x, y);
    // Fuera de los manchones casi no hay: algún pelo suelto.
    if (rnd() > t * 1.5 + 0.05) continue;
    const largo = (4 + hondura * 13 + rnd() * 4) * (0.7 + t * 0.6);
    const que = rnd();
    pasto += trazo(`M${x.toFixed(1)} ${y.toFixed(1)} q${(-1 - rnd() * 2).toFixed(1)} ${(-largo * 0.6).toFixed(1)} ${(-3 - rnd() * 5).toFixed(1)} ${(-largo).toFixed(1)}`, que < 0.5 ? CAMPO.escama : que < 0.8 ? CAMPO.azul : CAMPO.claro, 1 + hondura * 0.7, que < 0.8 ? 0.7 : 0.5);
  }
  let matas = '';
  const lugares: [number, number, number][] = [];
  for (const [cx, cy, rx, ry] of manchones) {
    const cuantas = 3 + Math.floor(rnd() * 4);
    for (let i = 0; i < cuantas; i++) lugares.push([cx + (rnd() - 0.5) * rx * 1.5, cy + (rnd() - 0.5) * ry * 1.5, rnd()]);
  }
  lugares.sort((a, b) => a[1] - b[1]);
  for (const [x, y, que] of lugares) {
    if (enLoPelado(x, y) || y < 348 || y > 604) continue;
    const hondura = (y - 348) / 256;
    const alto = 12 + hondura * 28;
    matas += nube(x + 2, y + 1, alto * 0.5, 2.4, M.negro, 's', 0.6);
    matas += que < 0.16 ? cardo(x, y, alto * 1.2, rnd) : mataDePasto(x, y, alto, rnd, que < 0.6 ? CAMPO.hondo : CAMPO.cielo, CAMPO.claro);
  }
  // Lo que pesa: a la entrada, la calavera clavada en el poste de la tranquera; a la salida, el arado.
  const cosas =
    calaveraDeVaca(desde + 166, 272, 0.95) +
    arado(hasta - 330, 474, 1.25) +
    carroVolcado(hasta - 196, 446, 1.15) +
    [0, 1, 2, 3].map((i) => mataDePasto(hasta - 372 + i * 44 + rnd() * 10, 470 + (i % 2) * 5, 26 + rnd() * 12, rnd, CAMPO.hondo, CAMPO.claro, 11)).join('');
  return (
    soplo(borde(300), CAMPO.cielo, 'l') +
    soplo(borde(318), CAMPO.cielo, 'm') +
    nube((desde + hasta) / 2, 600, (hasta - desde) * 0.6, 80, M.negro, 'xl', 0.5) +
    // La tierra pisada, oscura; y encima, los manchones donde el pasto agarra la luna.
    nube((desde + hasta) / 2, 470, (hasta - desde) * 0.6, 110, M.negro, 'xl', 0.42) +
    luz +
    huellas +
    // El alambrado, en el fondo del campo: se corta donde está el claro (ahí asoma el lobo).
    alambrado(desde - 10, claro[0] + 30, 327, 42, 78, semilla + 3, desde + 240) +
    alambrado(claro[1] - 30, hasta - 190, 327, 42, 78, semilla + 5) +
    sueloDeLaPastura(desde, hasta, semilla + 7, [claro[0] - 110, claro[1] + 110]) +
    pasto +
    matas +
    cosas +
    soplo(`M${desde - 40} 592 L${hasta + 40} 592 L${hasta + 40} ${ALTO + 40} L${desde - 40} ${ALTO + 40} Z`, M.negro, 'l', 0.7)
  );
}

/**
 * El círculo pelado (`D-91`). La pastura se presenta como «un palo, una soga, un círculo pelado».
 *
 * - Primera vuelta: era el claro del recinto, un disco naranja de canto liso que competía con la luna
 *   (se aisló escondiendo capas: era del piso impreso).
 * - Tercera: tierra parda con el canto movido, pero recortada con una caja en el borde del piso y
 *   tapada ahí con una fila de manchas: en la captura, un rectángulo ocre con un canto recto.
 * - Cuarta, esta: **no tiene canto**. Es un redondel de tierra pisada hecho de manchas sopladas que
 *   se van raleando hacia afuera, hasta que es pasto. Entra entero adentro del piso (no sube hasta
 *   el borde: no hay nada que recortar), y es de noche: pardo oscuro, apenas más claro donde más se pisó.
 *
 * Adentro: **la huella**, el anillo que deja el cordero dando vueltas al largo de la soga, con pisadas
 * de pezuña; cascotes; contra el palo, las matas que quedaron; y de la tapa de *Cordero atado*, una
 * veladura naranja apenas, y un espiral de crayón rayado en la tierra. El palo está donde siempre
 * (`PALO`): la soga, el cordero y los demás no se enteran.
 */
export const PELADO = { dy: 22, rx: 236, ry: 92 } as const;

function circuloPelado(): string {
  const rnd = azar(431);
  const px = PALO.x;
  const py = PALO.y + PELADO.dy;
  const { rx, ry } = PELADO;
  // La tierra: manchas sopladas. Tupidas en el medio; hacia afuera, más chicas, más ralas y más flojas.
  let tierra = '';
  for (let i = 0; i < 150; i++) {
    const a = rnd() * Math.PI * 2;
    const d = rnd() ** 0.62 * 1.16;
    const x = px + Math.cos(a) * rx * d;
    const y = py + Math.sin(a) * ry * d;
    const afuera = Math.max(0, d - 0.72) / 0.44;
    const r = (34 + rnd() * 26) * (1 - afuera * 0.55);
    tierra += nube(x, y, r, r * 0.42, afuera > 0.5 ? M.oscuro : i % 3 ? M.oscuro : M.sombra, afuera > 0.4 ? 'l' : 'm', (i % 3 ? 0.62 : 0.4) * (1 - afuera * 0.75));
  }
  // La huella: el anillo pisado, a lo que da la soga. No es parejo: tramos más gastados que otros.
  let huella = '';
  let pisadas = '';
  for (let i = 0; i < 44; i++) {
    const a = (i / 44) * Math.PI * 2 + rnd() * 0.1;
    const k = 0.66 + (rnd() - 0.5) * 0.08;
    const x = px + Math.cos(a) * rx * k;
    const y = py + Math.sin(a) * ry * k;
    huella += nube(x, y, 18 + rnd() * 14, 4 + rnd() * 4, MONTE.ocre, 'm', 0.1 + rnd() * 0.14);
    // Las pezuñas: dos medias lunas juntas, en el sentido de la vuelta.
    if (i % 2 === 0) {
      const giro = (Math.atan2(Math.cos(a) * ry, -Math.sin(a) * rx) * 180) / Math.PI;
      const escala = 0.7 + ((y - py + ry) / (2 * ry)) * 0.6;
      pisadas += `<g transform="translate(${x.toFixed(1)} ${(y + (rnd() - 0.5) * 5).toFixed(1)}) rotate(${giro.toFixed(0)}) scale(${escala.toFixed(2)} ${(escala * 0.6).toFixed(2)})">` + forma('M-3.4 -2.4 Q0.6 -3.4 3 -1.4 Q0 -1 -3.4 -0.6 Z M-3.4 2.4 Q0.6 3.4 3 1.4 Q0 1 -3.4 0.6 Z', M.negro, 0.7) + `</g>`;
    }
  }
  let cascotes = '';
  for (let i = 0; i < 24; i++) {
    const a = rnd() * Math.PI * 2;
    const k = Math.sqrt(rnd()) * 0.86;
    const x = px + Math.cos(a) * rx * k;
    const y = py + Math.sin(a) * ry * k;
    if (Math.hypot(x - px, y - PALO.y) < 30) continue;
    const w = 2 + rnd() * 4;
    cascotes += nube(x + 1, y + 1, w * 1.3, w * 0.5, M.negro, 'xs', 0.6) + forma(`M${(x - w).toFixed(1)} ${y.toFixed(1)} L${(x - w * 0.4).toFixed(1)} ${(y - w * 0.7).toFixed(1)} L${(x + w * 0.6).toFixed(1)} ${(y - w * 0.6).toFixed(1)} L${(x + w).toFixed(1)} ${y.toFixed(1)} Z`, rnd() < 0.6 ? M.hondo : M.sombra, 0.8);
  }
  // El pasto que se le mete: matas todo alrededor, a distinta distancia del centro (no en fila sobre un canto).
  let orilla = '';
  const matas: [number, number, number][] = [];
  for (let i = 0; i < 70; i++) {
    const a = rnd() * Math.PI * 2;
    const k = 0.8 + rnd() * 0.42;
    matas.push([px + Math.cos(a) * rx * k, py + Math.sin(a) * ry * k, a]);
  }
  matas.sort((p, q) => p[1] - q[1]);
  for (const [x, y, a] of matas) {
    orilla += nube(x, y + 2, 12 + rnd() * 12, 3.5 + rnd() * 3, CAMPO.cielo, 's', 0.7);
    orilla += mataDePasto(x, y + 3, 8 + Math.max(0, Math.sin(a)) * 18 + rnd() * 7, rnd, rnd() < 0.5 ? CAMPO.hondo : CAMPO.cielo, CAMPO.claro, 7);
  }
  // Contra el palo, donde la soga no deja llegar al cordero: lo único que no se comió.
  let alPie = '';
  for (let i = 0; i < 5; i++) alPie += mataDePasto(px - 22 + i * 11 + rnd() * 6, PALO.y + 6 + (i % 2) * 5, 9 + rnd() * 7, rnd, CAMPO.hondo, CAMPO.claro, 6);
  let espiral = '';
  for (let k = 0; k <= 60; k++) {
    const a = (k / 60) * Math.PI * 5;
    espiral += `${k ? 'L' : 'M'}${(px + 128 + Math.cos(a) * ((22 * k) / 60)).toFixed(1)} ${(py + 44 + Math.sin(a) * ((22 * k) / 60) * 0.5).toFixed(1)} `;
  }
  return (
    tierra +
    // Lo más pisado, un pelo más claro; y la veladura del naranja de la tapa, que no llega a ser luz.
    nube(px - 10, py + 4, rx * 0.5, ry * 0.5, MONTE.ocre, 'xl', 0.14) +
    nube(px, py, rx * 0.4, ry * 0.4, M.naranjaHonda, 'xl', 0.12) +
    // Tierra húmeda donde vive un bicho atado.
    nube(px + 96, py + 34, 54, 12, M.negro, 'l', 0.4) +
    nube(px - 130, py - 20, 46, 10, M.negro, 'l', 0.35) +
    huella +
    trazo(espiral, M.negro, 2, 0.45) +
    pisadas +
    cascotes +
    orilla +
    alPie
  );
}

/**
 * El piso de la pastura: se entra por la tranquera, el claro se abre en el medio (el mismo del
 * recinto, corrido `dx`), y a la salida, del otro lado, titila la vela de la mesa servida.
 */
function pisoPastura(): string {
  const { dx } = CAMINOS['la-pastura']!.claro!;
  return (
    `<g filter="url(#rociado)">` +
    nube(ANCHO - 140, 336, 150, 50, VELA, 'xl', 0.5) +
    nube(ANCHO - 140, 330, 26, 30, 'var(--entorno-templo-foco)', 'l', 0.8) +
    pisoDelCampo(0, ANCHO, 203, [dx + PALO.x - 320, dx + PALO.x + 320]) +
    `<g transform="translate(${dx} 0)">${circuloPelado()}${paloDeLaPastura()}</g>` +
    `</g>`
  );
}

/**
 * Lo de adelante de la pastura (`D-91`): pasto alto en matas, con huecos, y cada tanto un poste del
 * alambrado de este lado, vencido, con su hilo de púas. Nada sube más que un quinto de la pantalla.
 */
function frentePastura(): string {
  const rnd = azar(137);
  let s = '';
  let n = 0;
  for (let x = 300; x < FRENTE - 100; x += 380 + rnd() * 340) {
    const ancho = 120 + rnd() * 110;
    for (let i = 0; i < 5; i++) s += mataDePasto(x + (i / 4 - 0.5) * ancho, ALTO + 12, 70 + rnd() * 50, rnd, i % 2 ? M.negro : CAMPO.cielo, CAMPO.claro, 12);
    if (n % 2 === 0) {
      const px = x + ancho * 0.5 + 60 + rnd() * 50;
      const cae = -8 + rnd() * 16;
      s +=
        `<g transform="rotate(${cae.toFixed(1)} ${px.toFixed(1)} ${ALTO})">` +
        forma(`M${px - 7} ${ALTO + 10} L${px - 6} ${ALTO - 108} L${px + 5} ${ALTO - 114} L${px + 7} ${ALTO + 10} Z`, M.negro) +
        trazo(`M${px - 5} ${ALTO} L${px - 4.5} ${ALTO - 106}`, CAMPO.pezunia, 1.6, 0.5) +
        `</g>` +
        [92, 58].map((h) => trazo(`M${px - 150} ${ALTO - h + 30} Q${px - 70} ${ALTO - h + 14} ${px} ${ALTO - h} Q${px + 70} ${ALTO - h + 16} ${px + 150} ${ALTO - h + 34}`, M.negro, 1.6, 0.9)).join('') +
        // Las púas, y un vellón enganchado.
        [-96, -52, 44, 88].map((d) => trazo(`M${px + d - 3} ${ALTO - 92 + Math.abs(d) * 0.16 - 3} l6 6 M${px + d + 3} ${ALTO - 92 + Math.abs(d) * 0.16 - 3} l-6 6`, M.negro, 1.2)).join('') +
        nube(px + 60, ALTO - 78, 6, 4, CAMPO.papel, 'xs', 0.7);
    }
    n++;
  }
  return `<g filter="url(#rociado)">${s}</g>`;
}

/**
 * Lo de adelante: matas de tiras que pasan más rápido que el piso, con huecos entre una y
 * otra, y cada tanto una tira alta que cruza toda la vista. Es lo que hace sentir que se camina.
 */
function frente(): string {
  const rnd = azar(131);
  let s = '';
  let n = 0;
  for (let x = 260; x < FRENTE - 100; x += 420 + rnd() * 360) {
    const ancho = 150 + rnd() * 140;
    s += filaDeTiras(540 + rnd() * 30, ALTO + 10, M.hondo, M.medio, 300 + n, `fr-a-${n}`, x, x + ancho);
    s += filaDeTiras(580 + rnd() * 20, ALTO + 10, M.oscuro, M.sombra, 400 + n, `fr-b-${n}`, x + 30, x + ancho + 40);
    // Acá había, cada tanto, una tira alta que cruzaba la vista: en un teléfono parado era una losa
    // (`D-90`, tercera y cuarta ronda). Lo de adelante no sube más que un quinto de la pantalla, y
    // `aire.test.ts` lo mide en la imagen impresa de todas las regiones.
    n++;
  }
  return `<g filter="url(#rociado)">${s}</g>`;
}

/** El palo de la pastura queda donde dice el recinto: `camino.test.ts` lo mide contra esto. */
export const PALO_EN_EL_CAMINO = { x: PALO.x + CAMINOS['la-pastura']!.claro!.dx, y: PALO.y } as const;

/* ------------------------------------------------------------------
   Los seis entornos de la décima vuelta, a lo largo (`D-77`)
   ------------------------------------------------------------------
   Los pinta la misma mano que pinta su recinto (`arte-entornos.ts`): cada función recibe el ancho,
   corre las cosas fijas con `k` y siembra lo suelto a lo ancho. Lo lejano y el piso van a lo largo
   de la escena, con el mismo `k`, así el disco sigue colgado arriba de la silla; lo de adelante va
   más largo, porque pasa más rápido, y llega hasta el final del cruce. Cada capa conserva la caja
   de arriba que tiene en el recinto.
*/

/** De qué pieza del recinto sale cada tramo largo, y la función que lo pinta. */
const DE_ENTORNO = Object.values(CAMINOS).filter((t) => t.forma === 'entorno');

/** La altura donde empieza una capa en su recinto (`PIEZAS_ENTORNOS`). */
const arribaDe = (nombre: string): number => PIEZAS_ENTORNOS.find((p) => p.nombre === nombre)!.caja[1];

/**
 * Lo tirado en el piso de un entorno caminable (`D-90`, `arte-suelo.ts`), con el grano del rociado.
 * En la nieve va debajo de las cosas del piso (la tele, los de la nieve), que no pintan el suelo. En
 * el muelle, que sí lo pinta (los tablones), va encima y de la mitad para abajo, donde no hay nada apoyado.
 */
function conSuelo(tramo: Tramo, piso: string): string {
  const rociado = (s: string): string => `<g filter="url(#rociado)">${s}</g>`;
  if (tramo.region === 'cybersiberia') return rociado(sueloDeCybersiberia(tramo.escena)) + piso;
  if (tramo.region === 'los-astilleros') return piso + rociado(sueloDeLosAstilleros(tramo.escena, ASTILLERO.muelle + 60));
  // En la ruta, lo tirado va en la banquina de abajo: el asfalto es de los fierros.
  if (tramo.region === 'la-ruta') return piso + rociado(sueloDeLaRuta(tramo.escena, RUTA.asfalto.abajo + 14));
  // Sexta ronda. El árbol es aerógrafo: con el rociado, y sin nada contra el pie del tronco.
  if (tramo.region === 'el-arbol') return piso + rociado(sueloDelArbol(tramo.escena, ARBOL.tronco.x * K_ENTORNO));
  // La mesa es un afiche: tinta plana con el grano fino, abajo de donde cuelga el mantel.
  if (tramo.region === 'la-mesa') return piso + `<g filter="url(#grano)">${sueloDeLaMesa(tramo.escena, MESA.tablero.cuelga + 22)}${bajoElMantel(tramo.escena)}${candelabro(204, MESA.olla.piso + 12)}</g>`;
  // El galpón: tinta plana contra el borde del tablado, lejos de lo que está parado ahí.
  if (tramo.region === 'el-galpon') {
    return piso + `<g filter="url(#grano)">${sueloDelGalpon(tramo.escena, GALPON.tablado.borde, [GALPON.silla.x, GALPON.fuente.x, GALPON.bestiaPop.x].map((x) => x * K_ENTORNO))}</g>`;
  }
  return piso;
}

/**
 * Las capas que el camino pinta por su cuenta (`D-91`, tanda 2): el recinto de 900 sigue con las de
 * `arte-entornos.ts`, y el tramo largo se lleva las suyas. No reutilizar la pieza del recinto en el
 * camino fue la lección más cara de la tanda 1.
 */
type Capa = (ancho: number, alto: number) => string;
const A_LO_LARGO: Readonly<Record<string, Partial<Record<'lejos' | 'piso' | 'frente', Capa>>>> = {
  'el-galpon': { lejos: galponLejosLargo, piso: galponPisoLargo, frente: galponFrenteLargo },
  'la-mesa': { lejos: mesaLejosLarga },
};

function piezasDeEntorno(tramo: Tramo): Pieza[] {
  const capas = { ...ENTORNOS[tramo.region as keyof typeof ENTORNOS], ...A_LO_LARGO[tramo.region] };
  const pieza = tramo.piezas.piso!.replace(/^camino-|-piso$/g, '');
  const frente = anchoDeCapa(tramo.velocidad.frente, tramo.ancho);
  const yPiso = arribaDe(`${pieza}-piso`);
  const yFrente = arribaDe(`${pieza}-frente`);
  return [
    { nombre: tramo.piezas.lejos!, caja: [0, 0, tramo.escena, ALTO], dibujo: capas.lejos(tramo.escena, ALTO), opaca: true, densidad: 1.25 },
    { nombre: tramo.piezas.piso!, caja: [0, yPiso, tramo.escena, ALTO - yPiso], dibujo: conSuelo(tramo, capas.piso(tramo.escena, ALTO)), densidad: 1.25 },
    // La gente del galpón es pura trama de puntos, que pesa: se comprime un poco más, que el punto lo aguanta.
    { nombre: tramo.piezas.frente!, caja: [0, yFrente, frente, ALTO - yFrente], dibujo: capas.frente(frente, ALTO), densidad: 1.25, ...(tramo.region === 'el-galpon' ? { calidad: 70 } : {}) },
  ];
}

/* ------------------------------------------------------------------
   Lo que premia a la lupa, impreso fino (`D-91`, cuarta vuelta)
   ------------------------------------------------------------------
   Con la lupa al máximo el teléfono pide más de tres píxeles por unidad, y el piso está impreso a
   1,5: lo que hay para encontrar se veía blando. Subir el piso entero cuesta 300 kB por región. En
   cambio, lo que premia va **otra vez**, en una pieza chica y fina, encima del piso y en el mismo
   lugar: el tronco hueco con sus ojos y lo tallado, la calavera de la tranquera, el santuario.
   `FINAS_DE` dice cuáles lleva cada región; las pone `escenas-camino.ts` arriba del piso impreso.
*/

const fina = (nombre: string, caja: readonly [number, number, number, number], dibujo: string, mano = 'rociado'): Pieza => ({
  nombre,
  caja,
  dibujo: `<g filter="url(#${mano})"><rect x="${caja[0]}" y="${caja[1]}" width="${caja[2]}" height="${caja[3]}" fill="var(--fondo)" fill-opacity="0"/>${dibujo}</g>`,
  densidad: 4,
});

export const PIEZAS_FINAS: readonly Pieza[] = [
  fina('fino-monte-hueco', [764, 328, 196, 74], troncoHueco(790, 356, 150, 30)),
  fina('fino-pastura-calavera', [140, 244, 54, 50], calaveraDeVaca(166, 272, 0.95)),
  fina('fino-ruta-santuario', [208, 388, 86, 48], santuario(250, RUTA.asfalto.arriba - 1)),
  // La cueva del ratón, debajo de la mesa (`D-91`, tanda 2): tinta plana, con el grano fino del afiche.
  fina('fino-mesa-cueva', [CUEVA.x - 30, CUEVA.y - 34, 64, 50], cuevaDelRaton(CUEVA.x, CUEVA.y), 'grano'),
];

/** Las piezas finas de cada región, en el orden en que van sobre el piso. */
export const FINAS_DE: Readonly<Record<string, readonly string[]>> = {
  'el-monte': ['fino-monte-hueco'],
  'la-pastura': ['fino-pastura-calavera'],
  'la-ruta': ['fino-ruta-santuario'],
  'la-mesa': ['fino-mesa-cueva'],
};

export const PIEZAS_CAMINO: readonly Pieza[] = [
  // Lo lejano del monte y de la pastura se imprime más fino (`D-91`, tercera vuelta): con la lupa al máximo
  // el teléfono pide más de tres píxeles por unidad, y a 1,25 lo tallado y el lobito de la lomada se veían
  // blandos. 1,7 deja la imagen justo por debajo de los 4096 px de ancho.
  { nombre: 'camino-monte-lejos', caja: [0, 0, LEJOS, ALTO], dibujo: lejos(), opaca: true, densidad: 1.7 },
  { nombre: 'camino-monte-piso', caja: [0, PISO, ANCHO, ALTO - PISO], dibujo: pisoMonte(), densidad: 1.5 },
  { nombre: 'camino-pastura-lejos', caja: [0, 0, LEJOS, ALTO], dibujo: pasturaLejos(LEJOS, ALTO), opaca: true, densidad: 1.7 },
  { nombre: 'camino-pastura-piso', caja: [0, PISO, ANCHO, ALTO - PISO], dibujo: pisoPastura(), densidad: 1.5 },
  { nombre: 'camino-pastura-frente', caja: [0, 0, FRENTE, ALTO], dibujo: frentePastura(), densidad: 1.25 },
  { nombre: 'camino-monte-frente', caja: [0, 0, FRENTE, ALTO], dibujo: frente(), densidad: 1.25 },
  ...DE_ENTORNO.flatMap(piezasDeEntorno),
  ...PIEZAS_FINAS,
  ...PIEZAS_DEL_SALON,
  ...PIEZAS_DE_LA_SOBREMESA,
];

/* ------------------------------------------------------------------
   El cruce del final (`D-77`)
   ------------------------------------------------------------------
   Los entornos y los recintos terminan en la noche de afuera. Entra soplada sobre el final de la
   escena, como la noche que se come el borde de la vista en el monte, y es un descampado oscuro: la
   picada que venía se abre en tantas como vecinas tiene la región, y cada una se va hacia la luz de
   su disco, que asoma en el horizonte. Ahí, sin ningún bicho abajo, se paran los carteles.
*/

/** La caja del cruce, en coordenadas del piso: arranca `SOLAPE` antes del final de la escena. */
export const cajaDelCruce = (t: Tramo): readonly [number, number, number, number] => [t.escena - SOLAPE, 0, SOLAPE + CRUCE, ALTO];

/** Donde el descampado se junta con el cielo, y donde nace la picada. */
export const HORIZONTE = 404;
const PICADA = 590;

/**
 * Dónde termina cada picada del cruce, en x del piso: una por vecina, repartidas en el descampado.
 * La página clava ahí el poste de cada cartel, así el cartel queda arriba de su camino.
 */
export function destinosDelCruce(t: Tramo, n: number): number[] {
  const [x0, , ancho] = cajaDelCruce(t);
  const fin = x0 + ancho;
  // Juntas al final: un teléfono parado ve menos de 300 de ancho, y los carteles tienen que entrar.
  const tramo = Math.min(fin - (t.escena + 56) - 80, ABANICO);
  const paso = tramo / Math.max(1, n);
  return Array.from({ length: n }, (_, i) => fin - 30 - tramo + paso * (i + 0.5));
}

/** Lo ancho que se abren las picadas del cruce, en unidades del piso. */
const ABANICO = 250;

/**
 * La pieza del cruce de un tramo. `luces`: la tinta del disco de cada vecina, en el orden de los
 * carteles; cada una asoma en el horizonte, al final de su picada.
 */
export function piezaDelCruce(t: Tramo, luces: readonly string[]): Pieza {
  const [x0, , ancho] = cajaDelCruce(t);
  const rnd = azar([...t.region].reduce((s, c) => (s * 31 + c.charCodeAt(0)) >>> 0, 7));
  // Desde acá, la noche es negra del todo.
  const borde = t.escena + 56;
  const fin = x0 + ancho;
  const rect = (a: number, b: number): string => `M${a} -40 L${b} -40 L${b} ${ALTO + 40} L${a} ${ALTO + 40} Z`;
  const xs = destinosDelCruce(t, luces.length);
  const destinos = luces.map((_, i) => ({ x: xs[i]!, y: HORIZONTE - 8 + rnd() * 16 }));

  // Las luces de las vecinas, detrás del horizonte: un resplandor ancho y un centro chico.
  let luz = '';
  luces.forEach((color, i) => {
    const { x, y } = destinos[i]!;
    luz += nube(x, y - 26, 74, 52, color, 'xl', 0.5) + nube(x, y - 12, 26, 13, color, 'm', 0.75);
  });

  // La picada: entra desde la escena y se abre, una lengua por vecina que se angosta hacia su luz.
  const nace = { x: borde - 40, y: PICADA };
  let picadas = '';
  for (const { x, y } of destinos) {
    const medio = { x: (nace.x + x) / 2 + (rnd() - 0.5) * 40, y: (nace.y + y) / 2 + 30 };
    picadas += soplo(
      `M${nace.x} ${nace.y - 26} Q${medio.x} ${medio.y - 12} ${x - 3} ${y} L${x + 3} ${y} Q${medio.x + 16} ${medio.y + 14} ${nace.x + 30} ${nace.y + 30} Z`,
      M.sombra,
      'm',
      0.5,
    );
  }

  // Unos pastos de crayón, para que el descampado no sea un hueco.
  let pastos = '';
  for (let i = 0; i < 70; i++) {
    const x = borde + rnd() * (fin - borde);
    const y = HORIZONTE + 30 + rnd() * (ALTO - HORIZONTE - 40);
    pastos += trazo(`M${x.toFixed(1)} ${y.toFixed(1)} l${(-2 + rnd() * 4).toFixed(1)} ${(-(5 + rnd() * 9)).toFixed(1)}`, rnd() < 0.6 ? M.hondo : M.sombra, 1.2, 0.6);
  }

  return {
    nombre: t.piezas.cruce!,
    caja: cajaDelCruce(t),
    dibujo:
      `<g filter="url(#rociado)">` +
      // La noche que se come el borde: dos soplos que se van cerrando, y después negro de verdad.
      soplo(rect(t.escena - 8, fin + 60), M.negro, 'xl') +
      soplo(rect(t.escena + 24, fin + 60), M.negro, 'l') +
      forma(rect(borde, fin + 10), M.negro) +
      // El descampado: apenas más claro que el cielo, con la línea del horizonte soplada.
      soplo(`M${borde - 30} ${HORIZONTE} L${fin + 40} ${HORIZONTE} L${fin + 40} ${ALTO + 40} L${borde - 30} ${ALTO + 40} Z`, M.oscuro, 'l', 0.35) +
      luz +
      picadas +
      pastos +
      // Por dónde se sale es de cada lugar (`arte-cruces.ts`): el portón, el arco, la puerta del pasillo.
      (ADORNOS_DEL_CRUCE[t.region]?.(t.escena) ?? '') +
      // Abajo, lo más cerca, se apaga, como en el monte.
      soplo(`M${borde - 60} ${ALTO - 50} L${fin + 40} ${ALTO - 50} L${fin + 40} ${ALTO + 40} L${borde - 60} ${ALTO + 40} Z`, M.negro, 'l', 0.7) +
      `</g>`,
    densidad: 1.25,
  };
}

/**
 * Las piezas de todos los cruces. Necesitan saber quién es vecino de quién y de qué disco es cada
 * uno: se lo pasa quien lee `bestiario.json` (la imprenta y el test), y `tintaDe` pone la tinta.
 */
export function piezasDeLosCruces(regiones: readonly { id: string; disco: string; vecinas: readonly string[] }[]): Pieza[] {
  const discoDe = new Map(regiones.map((r) => [r.id, r.disco]));
  return Object.values(CAMINOS)
    .filter((t) => t.piezas.cruce)
    .map((t) => piezaDelCruce(t, regiones.find((r) => r.id === t.region)!.vecinas.map((v) => tintaDe(discoDe.get(v)!))));
}
