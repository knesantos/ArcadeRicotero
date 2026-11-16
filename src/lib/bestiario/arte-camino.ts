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
import { CAMPO, MONTE, alambrado, brumaEntrePlanos, cardo, mataDePasto, pasturaLejos, planoLejano, planoMedio } from './arte-arboles.ts';
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
  let pastos = '';
  for (let i = 0; i < (hasta - desde) / 9; i++) {
    const x = desde + rnd() * (hasta - desde);
    const y = 330 + rnd() * 290;
    const largo = 6 + rnd() * 10;
    const cae = -4 + rnd() * 8;
    pastos += trazo(`M${x.toFixed(1)} ${y.toFixed(1)} q${(cae * 0.2).toFixed(1)} ${(-largo * 0.7).toFixed(1)} ${cae.toFixed(1)} ${(-largo).toFixed(1)}`, rnd() < 0.75 ? M.hondo : M.sombra, 1.3, 0.6);
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
  let luz = '';
  for (let x = desde + 60; x < hasta; x += 200 + rnd() * 220) luz += nube(x, 400 + rnd() * 110, 150 + rnd() * 130, 34 + rnd() * 30, CAMPO.azul, 'xl', 0.5 + rnd() * 0.3);
  let noche = '';
  for (let x = desde + 140; x < hasta; x += 260 + rnd() * 260) noche += nube(x, 420 + rnd() * 170, 120 + rnd() * 140, 40 + rnd() * 40, M.negro, 'xl', 0.4 + rnd() * 0.25);
  // El pasto: hileras de crayón, cortas atrás y largas adelante, todas peinadas para el mismo lado.
  let pasto = '';
  for (let i = 0; i < (hasta - desde) / 3.2; i++) {
    const x = desde + rnd() * (hasta - desde);
    const hondura = rnd() ** 0.8;
    const y = 336 + hondura * 290;
    if (enElClaro(x) && y > 360 && y < 590) continue;
    const largo = 4 + hondura * 13 + rnd() * 4;
    const que = rnd();
    pasto += trazo(`M${x.toFixed(1)} ${y.toFixed(1)} q${(-1 - rnd() * 2).toFixed(1)} ${(-largo * 0.6).toFixed(1)} ${(-3 - rnd() * 5).toFixed(1)} ${(-largo).toFixed(1)}`, que < 0.5 ? CAMPO.escama : que < 0.8 ? CAMPO.azul : CAMPO.claro, 1 + hondura * 0.7, que < 0.8 ? 0.7 : 0.5);
  }
  let matas = '';
  const lugares: [number, number][] = [];
  for (let i = 0; i < 74; i++) lugares.push([desde + rnd() * (hasta - desde), rnd()]);
  lugares.sort((a, b) => a[1] - b[1]);
  for (const [x, hondura] of lugares) {
    const y = 350 + hondura * 250;
    if (enElClaro(x)) continue;
    const alto = 10 + hondura * 26;
    matas += nube(x + 2, y + 1, alto * 0.5, 2.4, M.negro, 's', 0.6);
    matas += rnd() < 0.2 ? cardo(x, y, alto * 1.2, rnd) : mataDePasto(x, y, alto, rnd, rnd() < 0.5 ? CAMPO.hondo : CAMPO.cielo, CAMPO.claro);
  }
  return (
    soplo(borde(300), CAMPO.cielo, 'l') +
    soplo(borde(318), CAMPO.cielo, 'm') +
    nube((desde + hasta) / 2, 600, (hasta - desde) * 0.6, 80, M.negro, 'xl', 0.5) +
    luz +
    noche +
    // El alambrado, en el fondo del campo: se corta donde está el claro (ahí asoma el lobo).
    alambrado(desde - 10, claro[0] + 30, 327, 42, 78, semilla + 3, desde + 240) +
    alambrado(claro[1] - 30, hasta - 190, 327, 42, 78, semilla + 5) +
    sueloDeLaPastura(desde, hasta, semilla + 7, [claro[0] - 110, claro[1] + 110]) +
    pasto +
    matas +
    soplo(`M${desde - 40} 592 L${hasta + 40} 592 L${hasta + 40} ${ALTO + 40} L${desde - 40} ${ALTO + 40} Z`, M.negro, 'l', 0.7)
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
    `<g transform="translate(${dx} 0)">${claroDeLaPastura()}</g>` +
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
