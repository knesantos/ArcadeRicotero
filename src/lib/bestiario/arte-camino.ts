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
import { M, azar, claroDeLaPastura, filaDeTiras } from './arte.ts';
import { ENTORNOS, PIEZAS_ENTORNOS } from './arte-entornos.ts';
import { ALTO, CAMINOS, CRUCE, K_ENTORNO, SOLAPE, VELOCIDAD, anchoDeCapa, type Tramo } from './camino.ts';
import { tintaDe } from './mapa.ts';
import { sueloDeCybersiberia, sueloDeLaMesa, sueloDeLaPastura, sueloDeLaRuta, sueloDeLosAstilleros, sueloDelArbol, sueloDelGalpon, sueloDelMonte } from './arte-suelo.ts';
import { CAMPO, MONTE, alambrado, arado, brumaEntrePlanos, calaveraDeVaca, cardo, mataDePasto, pasturaLejos, planoLejano, planoMedio } from './arte-arboles.ts';
import { ARBOL, GALPON, MESA, RUTA } from './rig-entornos.ts';
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
  // Los pastos (`D-91`, segunda vuelta): eran rayitas sueltas repartidas parejo, y se leían como
  // lluvia. Ahora son matas de tres o cuatro hojas que se abren desde un punto, juntas de a varias.
  let pastos = '';
  for (let i = 0; i < (hasta - desde) / 46; i++) {
    const cx = desde + rnd() * (hasta - desde);
    const cy = 340 + rnd() * 270;
    const cuantas = 2 + Math.floor(rnd() * 4);
    for (let k = 0; k < cuantas; k++) {
      const x = cx + (rnd() - 0.5) * 70;
      const y = cy + (rnd() - 0.5) * 24;
      const largo = (5 + rnd() * 7) * (0.7 + ((y - 330) / 290) * 0.8);
      const color = rnd() < 0.75 ? M.hondo : M.sombra;
      for (const cae of [-0.7, -0.1, 0.6]) {
        const dx = (cae + (rnd() - 0.5) * 0.4) * largo * 0.8;
        pastos += trazo(`M${x.toFixed(1)} ${y.toFixed(1)} q${(dx * 0.2).toFixed(1)} ${(-largo * 0.7).toFixed(1)} ${dx.toFixed(1)} ${(-largo * (1 - Math.abs(cae) * 0.3)).toFixed(1)}`, color, 1.3, 0.6);
      }
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

/** Un sendero que nace adelante, ancho, y se pierde angosto entre los troncos: tierra pisada, más clara. */
function sendero(x: number, cae: number, semilla: number): string {
  const rnd = azar(semilla);
  const ps: [number, number, number][] = [];
  for (let i = 0; i <= 8; i++) {
    const u = i / 8;
    ps.push([x + cae * u + Math.sin(u * Math.PI * 1.6 + rnd()) * 34 * (1 - u * 0.6), 624 - u * 314, 74 * (1 - u) ** 1.5 + 5]);
  }
  const ida = ps.map(([px, py, w], i) => `${i ? 'L' : 'M'}${(px - w / 2).toFixed(1)} ${py.toFixed(1)}`).join(' ');
  const vuelta = [...ps].reverse().map(([px, py, w]) => `L${(px + w / 2).toFixed(1)} ${py.toFixed(1)}`).join(' ');
  return soplo(`${ida} ${vuelta} Z`, M.sombra, 'm', 0.55) + soplo(`${ida} ${vuelta} Z`, M.medio, 'l', 0.16);
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
    nube(x + 6.4, y + gordo * 0.5, 0.9, 0.9, MONTE.ojo, 'xs', 0.9)
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
    // Segunda vuelta: dos senderos que se pierden entre los troncos. (Las raíces sueltas en el borde se
    // probaron y se sacaron: sin tronco encima, en la captura eran una araña.)
    // Nada de esto cae cerca de (660, 262), que es de otro bicho (`T-529`), ni debajo de los del elenco.
    sendero(232, 70, 821) +
    sendero(1936, -90, 823) +
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
    if (enElClaro(x) && y > 350 && y < 596) continue;
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
    if (enElClaro(x) || y < 348 || y > 604) continue;
    const hondura = (y - 348) / 256;
    const alto = 12 + hondura * 28;
    matas += nube(x + 2, y + 1, alto * 0.5, 2.4, M.negro, 's', 0.6);
    matas += que < 0.16 ? cardo(x, y, alto * 1.2, rnd) : mataDePasto(x, y, alto, rnd, que < 0.6 ? CAMPO.hondo : CAMPO.cielo, CAMPO.claro);
  }
  // Lo que pesa: a la entrada, la calavera clavada en el poste de la tranquera; a la salida, el arado.
  const cosas =
    calaveraDeVaca(desde + 166, 272, 0.95) +
    arado(hasta - 300, 468, 1.25) +
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
 * La orilla del claro (`D-91`, segunda vuelta). El claro del recinto es un óvalo de canto liso con un
 * aro negro: de noche y con la luna atrás, se leía como un segundo sol. Acá el pasto se lo come: la
 * orilla es de mordidas desparejas, con matas encima, y el naranja se enfría y se apaga hacia afuera.
 * Lo de adentro (la soga, el palo, los bichos) no cambia de lugar.
 */
const CORTE_DEL_CLARO = 306;

function orillaDelClaro(): string {
  const rnd = azar(431);
  const { x: px, y: py } = PALO;
  const rx = 262;
  const ry = 138;
  let mordidas = '';
  let matas = '';
  for (let i = 0; i < 54; i++) {
    const a = (i / 54) * Math.PI * 2 + rnd() * 0.1;
    const afuera = 6 + rnd() * 30;
    const x = px + Math.cos(a) * (rx + afuera);
    const y = py + Math.sin(a) * (ry + afuera * 0.6);
    const r = 12 + rnd() * 22;
    // Lo de arriba del borde del piso no se muerde: ahí atrás hay cielo, y la mordida sería una nube negra.
    if (y < 322) continue;
    // En la tinta del campo, no en negro: es pasto que avanza, no humo.
    mordidas += nube(x, y, r * (1 + Math.abs(Math.cos(a)) * 0.2), r * 0.62, CAMPO.cielo, i % 2 ? 'm' : 's', 0.92);
    // El pasto que avanza sobre la orilla: más en el canto de adelante, que es el que se ve.
    if (Math.sin(a) > -0.5 && rnd() < 0.62) matas += mataDePasto(x + (rnd() - 0.5) * 16, y + r * 0.2, 10 + Math.max(0, Math.sin(a)) * 18 + rnd() * 6, rnd, rnd() < 0.5 ? CAMPO.hondo : CAMPO.cielo, CAMPO.claro, 7);
  }
  // El canto de atrás: el claro del recinto sube más que el borde del piso (ahí lo tapaba su halo). Acá
  // se recorta en el borde (`CORTE_DEL_CLARO`) y el pasto del fondo le pasa por delante.
  for (let x = px - 176; x <= px + 176; x += 15 + rnd() * 12) mordidas += nube(x, CORTE_DEL_CLARO + 6 + rnd() * 8, 15 + rnd() * 12, 8 + rnd() * 5, CAMPO.cielo, 'm', 0.95);
  return (
    // Se enfría y se apaga: es tierra pelada de noche, no una brasa.
    nube(px, py, rx * 0.95, ry * 0.95, CAMPO.azul, 'xl', 0.2) +
    mordidas +
    matas
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
    `<g transform="translate(${dx} 0)"><clipPath id="cp-claro"><rect x="-200" y="${CORTE_DEL_CLARO}" width="1400" height="${ALTO}"/></clipPath><g clip-path="url(#cp-claro)">${claroDeLaPastura(true)}</g>${orillaDelClaro()}</g>` +
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
  if (tramo.region === 'la-mesa') return piso + `<g filter="url(#grano)">${sueloDeLaMesa(tramo.escena, MESA.tablero.cuelga + 22)}</g>`;
  // El galpón: tinta plana contra el borde del tablado, lejos de lo que está parado ahí.
  if (tramo.region === 'el-galpon') {
    return piso + `<g filter="url(#grano)">${sueloDelGalpon(tramo.escena, GALPON.tablado.borde, [GALPON.silla.x, GALPON.fuente.x, GALPON.bestiaPop.x].map((x) => x * K_ENTORNO))}</g>`;
  }
  return piso;
}

function piezasDeEntorno(tramo: Tramo): Pieza[] {
  const capas = ENTORNOS[tramo.region as keyof typeof ENTORNOS];
  const pieza = tramo.piezas.piso!.replace(/^camino-|-piso$/g, '');
  const frente = anchoDeCapa(tramo.velocidad.frente, tramo.ancho);
  const yPiso = arribaDe(`${pieza}-piso`);
  const yFrente = arribaDe(`${pieza}-frente`);
  return [
    { nombre: tramo.piezas.lejos!, caja: [0, 0, tramo.escena, ALTO], dibujo: capas.lejos(tramo.escena, ALTO), opaca: true, densidad: 1.25 },
    { nombre: tramo.piezas.piso!, caja: [0, yPiso, tramo.escena, ALTO - yPiso], dibujo: conSuelo(tramo, capas.piso(tramo.escena, ALTO)), densidad: 1.25 },
    { nombre: tramo.piezas.frente!, caja: [0, yFrente, frente, ALTO - yFrente], dibujo: capas.frente(frente, ALTO), densidad: 1.25 },
  ];
}

export const PIEZAS_CAMINO: readonly Pieza[] = [
  { nombre: 'camino-monte-lejos', caja: [0, 0, LEJOS, ALTO], dibujo: lejos(), opaca: true, densidad: 1.25 },
  { nombre: 'camino-monte-piso', caja: [0, PISO, ANCHO, ALTO - PISO], dibujo: pisoMonte(), densidad: 1.5 },
  { nombre: 'camino-pastura-lejos', caja: [0, 0, LEJOS, ALTO], dibujo: pasturaLejos(LEJOS, ALTO), opaca: true, densidad: 1.25 },
  { nombre: 'camino-pastura-piso', caja: [0, PISO, ANCHO, ALTO - PISO], dibujo: pisoPastura(), densidad: 1.5 },
  { nombre: 'camino-pastura-frente', caja: [0, 0, FRENTE, ALTO], dibujo: frentePastura(), densidad: 1.25 },
  { nombre: 'camino-monte-frente', caja: [0, 0, FRENTE, ALTO], dibujo: frente(), densidad: 1.25 },
  ...DE_ENTORNO.flatMap(piezasDeEntorno),
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
