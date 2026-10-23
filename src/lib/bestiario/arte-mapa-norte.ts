/**
 * Las escenas del plano de el-galpon, el-arbol, cybersiberia, el-templo (`arte-mapa.ts`).
 *
 * Cada una se pinta con la paleta de la tapa de su disco (`D-19`), vista desde arriba como un plano
 * pintado a mano: el galpón de Patricio Rey con su luz roja, el árbol de *Luzbelito* con el mármol
 * verde y el marco de cobre, la estepa de *Último bondi* con su tele prendida en la nieve, y el
 * salón de *Momo sampler* con la guirnalda de focos. Debajo de cada sello de bicho y de cada rótulo
 * se deja un valor medio o claro con poco dibujo; lo oscuro y lo recargado va en los huecos y hacia
 * el borde de la zona, que se quema.
 */

import { enmascarado, forma, nube, soplo, trazo } from './aerografo.ts';
import { azar, contorno, f, polar, type Escena, type Forma } from './arte-mapa-base.ts';

/* ------------------------------------------------------------------
   Herramientas chicas
   ------------------------------------------------------------------ */

const fo = (v: number): string => (Math.round(v * 100) / 100).toString();
const op = (o: number): string => (o < 1 ? ` opacity="${fo(o)}"` : '');

/** Un círculo de borde duro. */
const circ = (x: number, y: number, r: number, color: string, o = 1): string =>
  `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${color}"${op(o)}/>`;

/** Un anillo de borde duro. */
const aro = (x: number, y: number, r: number, color: string, ancho: number, o = 1): string =>
  `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="none" stroke="${color}" stroke-width="${f(ancho)}"${op(o)}/>`;

/** Un rectángulo como camino. */
const caja = (x: number, y: number, w: number, h: number): string => `M${f(x)} ${f(y)}h${f(w)}v${f(h)}h${f(-w)}Z`;

/** Un polígono como camino. */
const poli = (ps: ReadonlyArray<readonly [number, number]>): string =>
  `M${ps.map(([x, y]) => `${f(x)} ${f(y)}`).join('L')}Z`;

/** Una línea de puntos o de rayas: remaches, huellas, durmientes. */
const raya = (d: string, color: string, ancho: number, dash: string, o = 1): string =>
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${f(ancho)}" stroke-dasharray="${dash}" stroke-linecap="round"${op(o)}/>`;

/** Un trazo soplado: la sombra larga de un mástil, el humo de una grieta. */
const trazoSoplado = (d: string, color: string, ancho: number, tam: 'xs' | 's' | 'm' | 'l', o = 1): string =>
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${f(ancho)}" stroke-linecap="round" filter="url(#soplo-${tam})"${op(o)}/>`;

/** Un punto cualquiera adentro de un sector. */
function enSector(rnd: () => number, desde: number, hasta: number, adentro: number, afuera: number): { x: number; y: number } {
  return polar(desde + rnd() * (hasta - desde), adentro + rnd() * (afuera - adentro));
}

/** El borde quemado de una zona: la sombra honda que se come la orilla, adentro del recorte. */
const bordeHondo = (forma: Forma, color: string, o = 0.5): string =>
  `<path d="${contorno(forma)}" fill="none" stroke="${color}" stroke-width="50" stroke-linejoin="round" filter="url(#soplo-l)"${op(o)}/>`;

/** Un claro de luz bajo un sello: valor claro y blando donde va el bicho. */
const claro = (x: number, y: number, rx: number, ry: number, color: string, o = 0.4): string => nube(x, y, rx, ry, color, 'm', o);

/* ------------------------------------------------------------------
   El galpón: el de Patricio Rey, visto desde arriba, con la luz roja
   ------------------------------------------------------------------ */

const G = {
  noche: 'var(--entorno-galpon-noche)',
  rojo: 'var(--entorno-galpon-rojo)',
  brasa: 'var(--entorno-galpon-brasa)',
  luz: 'var(--entorno-galpon-luz)',
  marca: 'var(--marca-rojo)',
  fuego: 'var(--entorno-infierno-fuego)',
  hondo: 'var(--entorno-infierno-brasa)',
  farol: 'var(--portal-farol)',
  fondo: 'var(--fondo)',
  tierra: 'var(--portal-quemado)',
} as const;

function galpon(): string {
  const rnd = azar(101);
  const centro: Forma = { tipo: 'centro', radio: 135 };
  const techo = { x: 414, y: 400, w: 172, h: 160 };
  const cumbre = techo.y + techo.h / 2;
  let s = '';

  // El patio: tierra pisada, grava y las huellas de los camiones del equipo.
  s += nube(500, 500, 150, 150, G.hondo, 'xl', 0.4);
  for (let i = 0; i < 48; i++) {
    const p = polar(rnd() * 360, Math.sqrt(rnd()) * 132);
    s += nube(p.x, p.y, 3 + rnd() * 7, 2 + rnd() * 4, rnd() < 0.5 ? G.luz : G.tierra, 'xs', 0.22 + rnd() * 0.3, rnd() * 180);
  }
  s += trazoSoplado('M372 574 Q420 628 520 640', G.noche, 9, 's', 0.32);
  s += trazoSoplado('M382 556 Q432 612 530 626', G.noche, 6, 's', 0.28);
  s += trazoSoplado('M630 440 Q604 396 548 372', G.noche, 8, 's', 0.28);

  // Los parlantes de punta a punta del galpón, con el cable que se mete por el techo.
  for (const x of [378, 602]) {
    s += soplo(caja(x + 5, 456, 20, 52), G.fondo, 's', 0.55);
    s += forma(caja(x, 450, 20, 52), G.noche);
    s += circ(x + 10, 465, 6, G.brasa) + circ(x + 10, 465, 2.4, G.fondo);
    s += circ(x + 10, 487, 6, G.brasa) + circ(x + 10, 487, 2.4, G.fondo);
    s += trazo(`M${x + 2} 452 L${x + 18} 452`, G.luz, 1.2, 0.5);
  }
  s += trazo('M398 480 Q406 500 414 492 M602 480 Q594 504 586 494', G.fondo, 3, 0.8);

  // La sombra del techo sobre el patio, corrida hacia el sur.
  s += soplo(caja(techo.x + 10, techo.y + 18, techo.w, techo.h), G.fondo, 's', 0.6);

  // El techo, a dos aguas: arriba la que pega la luz del lado de la puerta, abajo la que se queda en sombra.
  const silueta = caja(techo.x, techo.y, techo.w, techo.h);
  let chapa = forma(silueta, G.rojo);
  chapa += nube(470, 424, 96, 28, G.luz, 'm', 0.3);
  chapa += forma(caja(techo.x, cumbre, techo.w, techo.h / 2), G.brasa, 0.5);
  chapa += nube(500, cumbre + 52, 110, 24, G.hondo, 'l', 0.45);
  // Las chapas acanaladas: una raya oscura y una clara al lado, de punta a punta.
  let oscuras = '';
  let claras = '';
  for (let x = techo.x + 4; x < techo.x + techo.w; x += 9) {
    oscuras += `M${f(x)} ${techo.y}V${techo.y + techo.h}`;
    claras += `M${f(x + 2.6)} ${techo.y}V${techo.y + techo.h}`;
  }
  chapa += trazo(oscuras, G.noche, 1.6, 0.42) + trazo(claras, G.luz, 1.2, 0.2);
  // Las uniones entre filas de chapas y sus tornillos.
  for (const y of [techo.y + 41, techo.y + 123]) {
    chapa += trazo(`M${techo.x} ${y}H${techo.x + techo.w}`, G.noche, 2.4, 0.55);
    chapa += raya(`M${techo.x + 3} ${y - 3}H${techo.x + techo.w - 3}`, G.luz, 2.4, '0.1 10', 0.55);
  }
  // Chapas nuevas, remiendos más claros, y el óxido que chorrea.
  chapa += forma(caja(420, 410, 46, 28), G.luz, 0.2) + forma(caja(536, 500, 40, 36), G.luz, 0.18) + forma(caja(424, 508, 34, 30), G.fondo, 0.2);
  for (let i = 0; i < 16; i++) {
    const x = techo.x + 10 + rnd() * (techo.w - 20);
    const y = techo.y + 10 + rnd() * (techo.h - 50);
    chapa += nube(x, y + 12, 2.6, 10 + rnd() * 16, G.tierra, 's', 0.5);
  }
  // El claro de cada sello: sin esto el bicho queda negro sobre rojo.
  chapa += claro(500, 470, 40, 36, G.luz, 0.45) + claro(452, 532, 30, 26, G.luz, 0.42) + claro(548, 528, 36, 32, G.luz, 0.42);
  // La claraboya: por ahí revienta la luz roja que se ve desde todos lados.
  chapa += nube(560, 424, 74, 56, G.marca, 'l', 0.8) + nube(560, 424, 40, 30, G.farol, 'm', 0.5);
  chapa += forma(poli([[540, 412], [580, 408], [584, 436], [544, 440]]), G.farol);
  chapa += nube(562, 424, 18, 11, G.luz, 'xs', 0.9);
  chapa += trazo('M552 411 L554 439 M564 410 L566 438 M574 409 L576 437', G.noche, 1.4, 0.6);
  chapa += trazo('M540 412 L580 408 L584 436 L544 440 Z', G.noche, 2.2, 0.8);
  chapa += forma(poli([[432, 540], [452, 538], [454, 552], [434, 554]]), G.farol, 0.8) + nube(443, 546, 22, 18, G.marca, 's', 0.5);
  // Los extractores redondos, con su cruz de paletas, y la escalera de gato del costado.
  for (const [x, y] of [[436, 422], [500, 416], [440, 500], [572, 520]] as const) {
    chapa += circ(x + 2, y + 3, 9, G.fondo, 0.45) + circ(x, y, 8, G.noche) + circ(x, y, 6, G.brasa) + trazo(`M${x - 5} ${y}H${x + 5}M${x} ${y - 5}V${y + 5}`, G.luz, 1.2, 0.7) + circ(x, y, 1.4, G.luz);
  }
  chapa += trazo('M578 440V548M586 440V548', G.noche, 1.8, 0.85);
  let peldanos = '';
  for (let y = 444; y < 548; y += 8) peldanos += `M578 ${y}H586`;
  chapa += trazo(peldanos, G.luz, 1.2, 0.5);
  // La cumbrera: la costura gruesa de arriba, con sus remaches.
  chapa += forma(caja(techo.x - 2, cumbre - 4, techo.w + 4, 8), G.noche);
  chapa += trazo(`M${techo.x} ${cumbre - 2}H${techo.x + techo.w}`, G.luz, 1.4, 0.5);
  chapa += raya(`M${techo.x + 4} ${cumbre + 1}H${techo.x + techo.w - 4}`, G.luz, 2, '0.1 9', 0.5);
  s += enmascarado('n-galpon-techo', silueta, chapa);

  // La pared del sur, con la puerta corrediza abierta: la luz sale en cono hacia la fila.
  s += forma(caja(techo.x, techo.y + techo.h, techo.w, 13), G.noche);
  s += soplo('M470 573 L530 573 L604 650 L396 650 Z', G.farol, 'm', 0.5);
  s += forma(caja(474, techo.y + techo.h + 1, 52, 11), G.farol);
  s += nube(500, 600, 60, 24, G.farol, 'm', 0.6);
  // La gente haciendo cola de espaldas: óvalo de hombros y la cabeza.
  let gente = '';
  for (let i = 0; i < 30; i++) {
    const t = rnd();
    const lado = rnd() < 0.5 ? -1 : 1;
    const x = 500 + lado * (50 + rnd() * 36 + t * 6);
    const y = 580 + t * 34;
    gente += `M${f(x - 4)} ${f(y)}a4 2.8 0 1 0 8 0a4 2.8 0 1 0 -8 0ZM${f(x - 2.1)} ${f(y - 0.8)}a2.1 2.1 0 1 0 4.2 0a2.1 2.1 0 1 0 -4.2 0Z`;
  }
  s += forma(gente, G.fondo, 0.85);

  // Los tachos con fuego en los rincones, que es donde se calienta la gente.
  for (const [x, y] of [[418, 598], [588, 606], [600, 392]] as const) {
    s += nube(x, y, 24, 22, G.fuego, 'm', 0.5) + circ(x, y, 7, G.fondo) + circ(x, y, 4.5, G.fuego) + nube(x, y, 3, 3, G.farol, 'xs');
  }

  s += bordeHondo(centro, G.fondo, 0.78);
  return s;
}

/* ------------------------------------------------------------------
   El árbol: el de Luzbelito, con el mármol, los huevos de plata y el marco de cobre
   ------------------------------------------------------------------ */

const A = {
  tierra: 'var(--entorno-arbol-tierra)',
  viva: 'var(--entorno-arbol-tierra-viva)',
  honda: 'var(--entorno-arbol-tierra-honda)',
  cielo: 'var(--entorno-arbol-cielo)',
  violeta: 'var(--entorno-arbol-violeta)',
  nube: 'var(--entorno-arbol-nube)',
  marmol: 'var(--entorno-arbol-marmol)',
  marmolHondo: 'var(--entorno-arbol-marmol-hondo)',
  marmolClaro: 'var(--entorno-arbol-marmol-claro)',
  veta: 'var(--entorno-arbol-veta)',
  vetaVerde: 'var(--bestia-pontiac-veta)',
  cobre: 'var(--entorno-arbol-cobre)',
  cobreHondo: 'var(--entorno-arbol-cobre-hondo)',
  cromo: 'var(--bestia-pontiac-cromo)',
  cromoHondo: 'var(--bestia-pontiac-cromo-hondo)',
  brillo: 'var(--bestia-pontiac-brillo)',
  cuero: 'var(--disco-luzbelito-tinta)',
  topo: 'var(--disco-luzbelito-apoyo)',
  fondo: 'var(--fondo)',
} as const;

const SECTOR_ARBOL: Forma = { tipo: 'sector', desde: -20, hasta: 20, adentro: 140, afuera: 425 };

function arbol(): string {
  const rnd = azar(202);
  let s = '';

  // La llanura: cuero claro, con la tierra roja asomando por los costados y el aire violeta del cielo.
  s += nube(500, 300, 90, 150, A.nube, 'xl', 0.3);
  s += nube(425, 345, 70, 110, A.viva, 'xl', 0.5) + nube(580, 335, 70, 110, A.viva, 'xl', 0.5) + nube(500, 380, 60, 30, A.tierra, 'l', 0.4);
  s += nube(500, 120, 150, 70, A.violeta, 'xl', 0.22);
  // El pasto seco, en mechones: una sola mancha de rayitas.
  let pasto = '';
  for (let i = 0; i < 70; i++) {
    const p = enSector(rnd, -19, 19, 150, 270);
    const h = 5 + rnd() * 6;
    pasto += `M${f(p.x)} ${f(p.y)}l${f(-2.2)} ${f(-h)}M${f(p.x)} ${f(p.y)}l${f(0.4)} ${f(-h - 2)}M${f(p.x)} ${f(p.y)}l${f(2.4)} ${f(-h + 1)}`;
  }
  s += trazo(pasto, A.topo, 1.3, 0.6);

  // El camino de tierra pisada que sube desde el galpón hasta las raíces.
  const camino = 'M498 372 C470 346 536 322 502 296 C482 282 514 272 500 262';
  s += trazoSoplado(camino, A.honda, 30, 's', 0.28);
  s += trazo(camino, A.cobre, 18, 0.6);
  s += trazo(camino, A.nube, 8, 0.42);
  for (let i = 0; i < 14; i++) {
    const t = rnd();
    s += nube(486 + rnd() * 30, 276 + t * 90, 1.8 + rnd() * 2, 1.4 + rnd() * 1.6, rnd() < 0.5 ? A.cobreHondo : A.nube, 'xs', 0.7, rnd() * 90);
  }

  // Los huevos de plata, tirados en el pasto con su sombra y su brillo.
  for (const [x, y, r] of [[447, 358, 9], [557, 352, 8], [462, 300, 7], [543, 298, 8], [432, 272, 6], [570, 262, 7], [530, 340, 5], [470, 330, 5]] as const) {
    s += nube(x + 3, y + 5, r * 1.1, r * 0.6, A.fondo, 's', 0.45);
    s += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(r * 0.78)}" ry="${f(r)}" fill="${A.cromo}"/>`;
    s += `<ellipse cx="${f(x + r * 0.22)}" cy="${f(y + r * 0.3)}" rx="${f(r * 0.5)}" ry="${f(r * 0.62)}" fill="${A.cromoHondo}" opacity="0.7"/>`;
    s += nube(x - r * 0.25, y - r * 0.38, r * 0.22, r * 0.34, A.brillo, 'xs', 0.95);
  }

  // La sombra de la copa, corrida hacia el oeste y el sur: cae violeta, no negra.
  s += nube(436, 236, 110, 46, A.cielo, 'l', 0.2, -14);

  // Las raíces: tapered, se abren sobre el camino y se hunden en la tierra.
  let raices = '';
  let rayosRaiz = '';
  for (const [dx, dy] of [[-46, 8], [-30, 22], [-10, 26], [14, 28], [34, 20], [48, 6]] as const) {
    const lado = dx < 0 ? -1 : 1;
    raices += `M${500 - 12 * lado * 0.4 - 7} 268Q${f(500 + dx * 0.5)} ${f(270 + dy * 0.2)} ${f(500 + dx)} ${f(272 + dy)}Q${f(500 + dx * 0.6)} ${f(278 + dy * 0.7)} ${500 + 8} 280Z`;
    rayosRaiz += `M${f(500 + dx * 0.15)} 270Q${f(500 + dx * 0.5)} ${f(271 + dy * 0.2)} ${f(500 + dx * 0.9)} ${f(272 + dy * 0.95)}`;
  }
  s += soplo(`M440 282Q500 304 560 282L540 262L460 262Z`, A.fondo, 's', 0.5);
  s += forma(raices, A.marmolHondo) + trazo(rayosRaiz, A.vetaVerde, 1, 0.55);
  // El tronco de mármol: ancho en la base, con la veta que sube en espiral.
  const tronco = 'M470 282C486 272 486 250 486 232C486 218 487 206 488 194L512 194C513 206 514 218 514 232C514 250 514 272 530 282Z';
  s += forma(tronco, A.marmol);
  s += forma('M502 282C505 258 503 220 503 194L512 194C513 206 514 218 514 232C514 250 514 272 530 282Z', A.marmolHondo, 0.85);
  s += nube(492, 240, 4, 38, A.marmolClaro, 'xs', 0.7);
  s += trazo('M486 278C490 254 484 226 490 198M494 280C498 256 492 230 497 200M508 278C511 254 505 230 510 200M518 280C516 262 520 240 513 210', A.marmolHondo, 1.4, 0.8);
  s += trazo('M490 276C494 252 488 226 493 200M501 274C503 250 498 228 502 204', A.veta, 0.9, 0.5);
  s += `<ellipse cx="500" cy="236" rx="5" ry="8" fill="${A.fondo}" opacity="0.8"/>`;
  s += nube(498, 233, 2, 4, A.vetaVerde, 'xs', 0.7);

  // Las ramas gruesas, que salen del cruce y suben a la copa: afinadas hacia la punta.
  const ramas: ReadonlyArray<readonly [string, number]> = [
    ['M497 202C478 176 448 156 420 124', 12],
    ['M500 202C502 166 497 134 500 100', 11],
    ['M503 202C524 176 554 156 580 124', 12],
    ['M492 226C462 212 440 206 416 210', 8],
    ['M508 226C538 214 562 208 586 214', 8],
  ];
  for (const [d, w] of ramas) s += trazo(d, A.marmolHondo, w, 1) + trazo(d, A.marmol, w * 0.62, 1) + trazo(d, A.vetaVerde, 1, 0.55);
  let ramitas = '';
  for (let i = 0; i < 24; i++) {
    const p = polar(-14 + rnd() * 28, 270 + rnd() * 150);
    ramitas += `M${f(p.x)} ${f(p.y)}q${f(rnd() * 20 - 10)} ${f(-8 - rnd() * 14)} ${f(rnd() * 30 - 15)} ${f(-14 - rnd() * 20)}`;
  }
  s += trazo(ramitas, A.marmolHondo, 2.2, 0.9);

  // El marco de cobre colgado de la rama de la derecha, con el cielo violeta adentro.
  s += trazo('M541 164L532 175M541 164L550 175', A.fondo, 1, 0.8);
  s += `<ellipse cx="541" cy="188" rx="11" ry="14" fill="${A.cielo}"/>`;
  s += `<ellipse cx="541" cy="188" rx="11" ry="14" fill="none" stroke="${A.cobre}" stroke-width="4"/>`;
  s += `<ellipse cx="541" cy="188" rx="11" ry="14" fill="none" stroke="${A.cobreHondo}" stroke-width="1.2" opacity="0.8"/>`;
  s += nube(536, 181, 2, 4, A.nube, 'xs', 0.8);

  // La copa: la silueta es de borde duro (la máscara de papel de Rocambole), hecha de lóbulos de
  // hoja, y adentro se sopla libre: sombra abajo a la izquierda, luz arriba a la derecha.
  const masas: Array<{ x: number; y: number; r: number }> = [];
  for (let i = 0; i < 30; i++) {
    const a = rnd() * Math.PI * 2;
    const d = Math.sqrt(rnd());
    masas.push({ x: 500 + Math.cos(a) * d * 138, y: 140 + Math.sin(a) * d * 66, r: 21 + rnd() * 15 });
  }
  let lobulos = '';
  for (const m of masas) {
    lobulos += `M${f(m.x - m.r)} ${f(m.y)}a${f(m.r)} ${f(m.r)} 0 1 0 ${f(m.r * 2)} 0a${f(m.r)} ${f(m.r)} 0 1 0 ${f(-m.r * 2)} 0Z`;
    for (let k = 0; k < 3; k++) {
      const a = rnd() * Math.PI * 2;
      const rr = 7 + rnd() * 6;
      const cx = m.x + Math.cos(a) * m.r * 0.95;
      const cy = m.y + Math.sin(a) * m.r * 0.95;
      lobulos += `M${f(cx - rr)} ${f(cy)}a${f(rr)} ${f(rr)} 0 1 0 ${f(rr * 2)} 0a${f(rr)} ${f(rr)} 0 1 0 ${f(-rr * 2)} 0Z`;
    }
  }
  s += `<path d="${lobulos}" fill="${A.fondo}" opacity="0.42" filter="url(#soplo-m)" transform="translate(-9 14)"/>`;
  let pintura = forma(lobulos, A.marmol);
  for (const m of masas) pintura += nube(m.x - 7, m.y + 10, m.r * 0.95, m.r * 0.7, A.marmolHondo, 's', 0.95);
  for (const m of masas) pintura += nube(m.x + 3, m.y - 5, m.r * 0.72, m.r * 0.56, A.marmolClaro, 's', 0.95);
  for (const m of masas) pintura += nube(m.x + 6, m.y - 9, m.r * 0.4, m.r * 0.28, A.vetaVerde, 'xs', 0.95);
  let tapas = '';
  for (const m of masas) {
    const rr = m.r * 0.5;
    tapas += `M${f(m.x + 5 - rr)} ${f(m.y - 8)}a${f(rr)} ${f(rr * 0.8)} 0 1 0 ${f(rr * 2)} 0a${f(rr)} ${f(rr * 0.8)} 0 1 0 ${f(-rr * 2)} 0Z`;
  }
  pintura += forma(tapas, A.marmolClaro, 0.7);
  let hojitas = '';
  let hojitasClaras = '';
  for (let i = 0; i < 90; i++) {
    const m = masas[Math.floor(rnd() * masas.length)];
    const a = rnd() * Math.PI * 2;
    const d = Math.sqrt(rnd()) * m.r * 0.85;
    const x = m.x + Math.cos(a) * d;
    const y = m.y + Math.sin(a) * d;
    const rr = 1.8 + rnd() * 2.2;
    const hoja = `M${f(x - rr)} ${f(y)}a${f(rr)} ${f(rr * 0.7)} 0 1 0 ${f(rr * 2)} 0a${f(rr)} ${f(rr * 0.7)} 0 1 0 ${f(-rr * 2)} 0Z`;
    if (rnd() < 0.55) hojitas += hoja;
    else hojitasClaras += hoja;
  }
  pintura += forma(hojitas, A.marmolHondo, 0.8) + forma(hojitasClaras, A.veta, 0.5);
  for (const [x, y] of [[470, 126], [536, 118], [522, 170], [450, 162], [500, 190]] as const) pintura += nube(x, y, 6, 5, A.violeta, 'xs', 0.95);
  s += enmascarado('n-arbol-copa', lobulos, pintura);

  // Los claros de los que viven ahí arriba: valor claro bajo cada sello.
  for (const [x, y] of [[500, 96], [457, 151], [558, 205], [447, 230], [559, 121], [600, 152], [415, 181]] as const) s += claro(x, y, 28, 24, A.veta, 0.26);
  // Los nidos y las hamacas: un aro de ramitas con el hueco hondo.
  for (const [x, y] of [[470, 108], [548, 150], [430, 150]] as const) s += aro(x, y, 9, A.marmolHondo, 3.2, 0.9) + circ(x, y, 5.6, A.fondo, 0.6);

  // Las hojas caídas alrededor del tronco.
  for (let i = 0; i < 26; i++) {
    const p = polar(-20 + rnd() * 40, 200 + rnd() * 90);
    s += nube(p.x, p.y, 3 + rnd() * 2, 1.6 + rnd(), rnd() < 0.5 ? A.marmolClaro : A.viva, 'xs', 0.7, rnd() * 180);
  }
  // Claros bajo los ángeles y los sellos del pie del árbol.
  for (const [x, y] of [[512, 330], [483, 333], [445, 285], [558, 291]] as const) s += claro(x, y, 26, 22, A.nube, 0.4);

  s += bordeHondo(SECTOR_ARBOL, A.honda, 0.7);
  return s;
}

/* ------------------------------------------------------------------
   Cybersiberia: la estepa nevada del último bondi, con la tele prendida
   ------------------------------------------------------------------ */

const C = {
  hondo: 'var(--entorno-cyber-acero-hondo)',
  acero: 'var(--entorno-cyber-acero)',
  claro: 'var(--entorno-cyber-acero-claro)',
  nieve: 'var(--entorno-cyber-nieve)',
  vidrio: 'var(--entorno-cyber-vidrio)',
  lente: 'var(--entorno-cyber-lente)',
  oxido: 'var(--entorno-cyber-oxido)',
  luz: 'var(--bestia-vaca-luz)',
  lila: 'var(--bestia-vaca-lila)',
  lilaHonda: 'var(--bestia-vaca-lila-honda)',
  mancha: 'var(--bestia-vaca-mancha)',
  marca: 'var(--marca-rojo)',
  fondo: 'var(--fondo)',
} as const;

const SECTOR_CYBER: Forma = { tipo: 'sector', desde: 20, hasta: 65, adentro: 140, afuera: 425 };

/** Un mástil de antena visto de frente: reticulado, travesaños, vientos y la luz que avisa. */
function mastil(x: number, y: number, alto: number): string {
  let s = '';
  s += trazoSoplado(`M${f(x)} ${f(y)}L${f(x + alto * 0.6)} ${f(y + alto * 0.34)}`, C.fondo, 5, 'xs', 0.4);
  for (const [dx, dy] of [[-44, 10], [46, 14], [-30, -26], [34, -24]] as const) {
    s += trazo(`M${f(x)} ${f(y - alto * 0.62)}L${f(x + dx)} ${f(y + dy)}`, C.hondo, 0.9, 0.7);
    s += circ(x + dx, y + dy, 2.2, C.oxido);
  }
  let reticulado = `M${f(x - 3)} ${f(y)}V${f(y - alto)}M${f(x + 3)} ${f(y)}V${f(y - alto)}`;
  for (let k = 0; k < alto / 11; k++) {
    reticulado += `M${f(x - 3)} ${f(y - k * 11)}L${f(x + 3)} ${f(y - k * 11 - 11)}M${f(x + 3)} ${f(y - k * 11)}L${f(x - 3)} ${f(y - k * 11 - 11)}`;
  }
  s += trazo(reticulado, C.hondo, 1.2, 0.9);
  s += trazo(`M${f(x - 15)} ${f(y - alto + 8)}H${f(x + 15)}M${f(x - 10)} ${f(y - alto + 18)}H${f(x + 10)}M${f(x - 8)} ${f(y - alto * 0.5)}H${f(x + 8)}`, C.hondo, 2, 0.95);
  s += circ(x, y, 7, C.oxido) + circ(x, y, 3.2, C.hondo);
  s += nube(x, y - alto - 2, 16, 16, C.marca, 's', 0.5) + circ(x, y - alto - 2, 2.4, C.marca);
  return s;
}

function cybersiberia(): string {
  const rnd = azar(303);
  let s = '';

  // La estepa: nieve vieja sobre acero, con el hielo oscuro asomando donde el viento barrió.
  s += nube(690, 300, 190, 190, C.acero, 'xl', 0.45) + nube(560, 300, 110, 90, C.nieve, 'xl', 0.4) + nube(660, 400, 100, 70, C.nieve, 'xl', 0.35);
  s += nube(640, 380, 70, 50, C.lente, 'xl', 0.22) + nube(750, 260, 60, 40, C.lente, 'xl', 0.18);
  s += nube(800, 330, 60, 80, C.acero, 'xl', 0.55) + nube(580, 200, 80, 50, C.acero, 'xl', 0.45) + nube(640, 430, 60, 40, C.hondo, 'xl', 0.4) + nube(760, 180, 50, 50, C.hondo, 'xl', 0.4);

  // La chapa remachada de debajo: pistas de circuito en relieve, una sombra y una luz al lado.
  let sombras = '';
  let luces = '';
  let pads = '';
  for (let i = 0; i < 14; i++) {
    const p = enSector(rnd, 22, 63, 150, 415);
    let x = p.x;
    let y = p.y;
    let d = `M${f(x)} ${f(y)}`;
    const pasos = 3 + Math.floor(rnd() * 3);
    for (let k = 0; k < pasos; k++) {
      const largo = 14 + rnd() * 34;
      const sg = rnd() < 0.5 ? -1 : 1;
      if (k % 2 === 0) x += sg * largo;
      else y += sg * largo;
      d += `L${f(x)} ${f(y)}`;
      if (rnd() < 0.4) {
        x += sg * 9;
        y += sg * 9;
        d += `L${f(x)} ${f(y)}`;
      }
    }
    sombras += d;
    luces += d;
    pads += circ(x, y, 4, C.claro, 0.8) + circ(x, y, 1.6, C.hondo, 0.8);
  }
  s += `<path d="${sombras}" fill="none" stroke="${C.hondo}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" transform="translate(1.8 2.2)" opacity="0.55"/>`;
  s += trazo(luces, C.claro, 2.8, 0.75) + pads;

  // La vía muerta del último bondi: los durmientes, y dos rieles que se pierden bajo la nieve.
  const via = 'M570 400C610 368 640 330 668 300C700 268 730 236 760 176';
  s += raya(via, C.oxido, 11, '2.4 10', 0.6);
  s += trazo(via, C.claro, 1.8, 0.7);
  s += `<path d="${via}" fill="none" stroke="${C.claro}" stroke-width="1.8" transform="translate(5 3)" opacity="0.7" stroke-linecap="round"/>`;

  // Las dunas de nieve: el lomo claro y el lado del viento, hondo.
  for (let i = 0; i < 22; i++) {
    const p = enSector(rnd, 22, 63, 150, 415);
    const rx = 24 + rnd() * 32;
    const ry = 7 + rnd() * 8;
    const giro = 18 + rnd() * 26;
    s += nube(p.x + 5, p.y + 7, rx, ry, C.hondo, 'xs', 0.55, giro);
    s += nube(p.x, p.y, rx, ry, C.nieve, 's', 0.95, giro);
    s += nube(p.x - 4, p.y - 4, rx * 0.55, ry * 0.4, C.nieve, 'xs', 0.9, giro);
  }

  // Los surcos que deja el viento en la nieve: rayas largas, una clara y una honda al lado.
  let surcos = '';
  let surcosHondos = '';
  for (let i = 0; i < 22; i++) {
    const p = enSector(rnd, 22, 63, 150, 415);
    const l = 20 + rnd() * 30;
    surcos += `M${f(p.x)} ${f(p.y)}q${f(l * 0.5)} ${f(-4 - rnd() * 4)} ${f(l)} ${f(-rnd() * 6)}`;
    surcosHondos += `M${f(p.x)} ${f(p.y + 3)}q${f(l * 0.5)} ${f(-4 - rnd() * 4)} ${f(l)} ${f(-rnd() * 6)}`;
  }
  s += trazo(surcosHondos, C.acero, 1.3, 0.55) + trazo(surcos, C.nieve, 1.8, 0.9);

  // Los bloques de hielo y chatarra que sobresalen: facetas de acero con la nieve arriba.
  for (const [ang, r, tam] of [[24, 200, 15], [58, 190, 13], [63, 330, 14], [21, 415, 12], [47, 404, 13], [33, 168, 10], [60, 405, 11]] as const) {
    const c = polar(ang, r);
    s += soplo(poli([[c.x - tam, c.y + tam * 0.6], [c.x + tam * 1.5, c.y + tam * 0.6], [c.x + tam * 1.9, c.y + tam * 1.1], [c.x - tam * 0.6, c.y + tam * 1.1]]), C.fondo, 's', 0.45);
    s += forma(poli([[c.x - tam, c.y + tam * 0.6], [c.x - tam * 0.5, c.y - tam * 0.8], [c.x + tam * 0.4, c.y - tam], [c.x + tam * 1.2, c.y - tam * 0.1], [c.x + tam * 1.1, c.y + tam * 0.6]]), C.acero);
    s += forma(poli([[c.x + tam * 0.4, c.y - tam], [c.x + tam * 1.2, c.y - tam * 0.1], [c.x + tam * 1.1, c.y + tam * 0.6], [c.x + tam * 0.1, c.y + tam * 0.6]]), C.hondo, 0.8);
    s += forma(poli([[c.x - tam * 0.5, c.y - tam * 0.8], [c.x + tam * 0.4, c.y - tam], [c.x + tam * 0.2, c.y - tam * 0.4], [c.x - tam * 0.6, c.y - tam * 0.3]]), C.nieve, 0.95);
  }

  // Los matorrales secos que asoman de la nieve.
  let secos = '';
  for (let i = 0; i < 14; i++) {
    const p = enSector(rnd, 22, 63, 150, 415);
    const h = 6 + rnd() * 7;
    secos += `M${f(p.x)} ${f(p.y)}l-3 ${f(-h)}M${f(p.x)} ${f(p.y)}l0 ${f(-h - 3)}M${f(p.x)} ${f(p.y)}l3.4 ${f(-h)}`;
  }
  s += trazo(secos, C.oxido, 1.3, 0.75);

  // El estanque congelado, con sus grietas: ahí se asoma la princesita.
  s += nube(631, 307, 36, 26, C.hondo, 's', 0.35);
  s += `<ellipse cx="631" cy="305" rx="32" ry="22" fill="${C.lente}" opacity="0.6"/>`;
  s += nube(624, 298, 16, 8, C.nieve, 's', 0.6);
  s += `<ellipse cx="631" cy="305" rx="32" ry="22" fill="none" stroke="${C.nieve}" stroke-width="5" opacity="0.8" filter="url(#soplo-xs)"/>`;
  s += trazo('M631 305L612 296L604 298M631 305L654 312L664 308M631 305L626 322M631 305L640 288', C.hondo, 1, 0.55);

  // Las huellas que van del mástil a la tele, de a una pisada.
  const huellas = 'M716 168C706 196 690 214 688 238';
  s += raya(huellas, C.hondo, 3.2, '0.1 9', 0.55);
  s += `<path d="${huellas}" fill="none" stroke="${C.hondo}" stroke-width="3.2" stroke-dasharray="0.1 9" stroke-dashoffset="4.5" stroke-linecap="round" transform="translate(5 0)" opacity="0.55"/>`;

  // Los mástiles.
  s += mastil(724, 168, 100) + mastil(792, 372, 86);

  // La tele gigante, prendida en la nieve: la luz de la pantalla se derrama sobre todo lo de abajo.
  s += nube(694, 350, 150, 72, C.lila, 'xl', 0.38) + nube(694, 300, 120, 100, C.luz, 'xl', 0.24);
  s += soplo('M612 350L790 350L846 394L670 394Z', C.fondo, 'm', 0.5);
  s += forma(poli([[608, 222], [778, 222], [800, 204], [630, 204]]), C.claro) + trazo('M610 221L632 205L798 205', C.nieve, 1.4, 0.7);
  s += forma(poli([[778, 222], [800, 204], [800, 330], [778, 348]]), C.hondo);
  s += trazo('M778 224L778 346', C.claro, 1.2, 0.5);
  s += `<rect x="608" y="222" width="170" height="126" rx="10" fill="${C.hondo}"/>`;
  s += `<rect x="609" y="223" width="168" height="124" rx="10" fill="none" stroke="${C.claro}" stroke-width="2.2" opacity="0.8"/>`;
  s += forma(caja(626, 342, 8, 8), C.hondo) + forma(caja(750, 342, 8, 8), C.hondo);
  const pantalla = `M621 234h144a14 14 0 0 1 14 14v70a14 14 0 0 1 -14 14h-144a14 14 0 0 1 -14 -14v-70a14 14 0 0 1 14 -14Z`;
  let luzTele = forma(pantalla, C.lilaHonda);
  luzTele += nube(693, 283, 78, 50, C.lila, 'm') + nube(693, 283, 46, 30, C.luz, 'm');
  luzTele += nube(630, 240, 24, 18, C.mancha, 's', 0.5) + nube(760, 330, 24, 14, C.mancha, 's', 0.5);
  let lineas = '';
  for (let y = 238; y < 334; y += 5) lineas += `M609 ${y}H779`;
  luzTele += trazo(lineas, C.fondo, 1.2, 0.1);
  luzTele += nube(693, 292, 76, 5, C.luz, 'xs', 0.7);
  luzTele += forma(poli([[640, 236], [668, 236], [638, 300], [616, 300]]), C.luz, 0.16);
  for (let i = 0; i < 40; i++) luzTele += circ(612 + rnd() * 166, 236 + rnd() * 94, 0.9, rnd() < 0.5 ? C.fondo : C.luz, 0.4);
  s += enmascarado('n-cyber-tele', pantalla, luzTele);
  // Los botones y la rejilla del parlante, abajo de la pantalla.
  s += circ(742, 340.5, 3, C.vidrio) + circ(755, 340.5, 3, C.oxido) + trazo('M650 337H718M650 341H718', C.claro, 1, 0.5);
  // Las orejas de conejo: dos varillas con la bolita de vidrio y el cable que baja.
  s += trazo('M696 204L656 150M708 204L752 146', C.claro, 2.8, 1) + circ(656, 150, 3.6, C.vidrio) + circ(752, 146, 3.6, C.vidrio);
  s += trazo('M702 206Q690 190 700 180', C.hondo, 1.4, 0.8);
  // El cable que sale de atrás y cruza la nieve hasta el mástil de abajo.
  s += trazoSoplado('M800 340C830 360 810 372 792 368', C.hondo, 3.6, 'xs', 0.6);
  // Los claros bajo los sellos de la zona de la tele y del resto.
  // Un manto de nieve bajo cada sello: sin esto el bicho queda negro sobre acero.
  for (const [ang, r] of [[30, 330], [44, 380], [56, 335], [47, 270], [35, 240], [59, 215], [52, 405], [26, 398], [42, 190], [62, 292], [24, 262], [29, 180], [38, 292], [52, 158], [61, 375]] as const) {
    const c = polar(ang, r);
    s += nube(c.x, c.y + 3, 30, 22, C.nieve, 's', 0.55, 20);
  }

  // Una chapa de bondi medio enterrada: el techo con sus ventanas y la nieve encima.
  s += bondi(588, 238);

  s += bordeHondo(SECTOR_CYBER, C.hondo, 0.62);
  return s;
}

/** Lo que queda del último bondi: el techo de chapa remachada, las ventanillas y la nieve sobre el lomo. */
function bondi(x: number, y: number): string {
  let s = '';
  s += soplo(poli([[x - 30, y - 10], [x + 36, y - 6], [x + 38, y + 20], [x - 28, y + 22]]), C.fondo, 's', 0.45);
  s += `<rect x="${x - 34}" y="${y - 12}" width="66" height="30" rx="7" fill="${C.claro}" transform="rotate(-8 ${x} ${y})"/>`;
  s += `<rect x="${x - 34}" y="${y - 12}" width="66" height="30" rx="7" fill="none" stroke="${C.hondo}" stroke-width="1.6" transform="rotate(-8 ${x} ${y})"/>`;
  let ventanas = '';
  for (let k = 0; k < 5; k++) ventanas += caja(x - 28 + k * 12, y - 6, 8, 8);
  s += `<path d="${ventanas}" fill="${C.hondo}" transform="rotate(-8 ${x} ${y})"/>`;
  s += nube(x - 6, y - 12, 26, 6, C.nieve, 's', 0.85, -8) + nube(x + 14, y + 8, 12, 4, C.nieve, 'xs', 0.75, -8);
  return s;
}

/* ------------------------------------------------------------------
   El templo: el salón de Momo sampler, con la plaza de baldosas, la guirnalda y la murga
   ------------------------------------------------------------------ */

const T = {
  plata: 'var(--disco-momo-sampler-tinta)',
  peltre: 'var(--disco-momo-sampler-apoyo)',
  foco: 'var(--entorno-templo-foco)',
  oro: 'var(--acento-2)',
  farol: 'var(--portal-farol)',
  rojo: 'var(--marca-rojo)',
  lila: 'var(--entorno-baion-lila)',
  rosa: 'var(--entorno-baion-rosa)',
  noche: 'var(--entorno-baion-noche)',
  violeta: 'var(--entorno-baion-violeta)',
  luz: 'var(--entorno-baion-luz)',
  madera: 'var(--portal-madera)',
  maderaHonda: 'var(--portal-madera-honda)',
  metal: 'var(--bestia-morta-metal)',
  metalHondo: 'var(--bestia-morta-metal-hondo)',
  papel: 'var(--papel)',
  fondo: 'var(--fondo)',
} as const;

const SECTOR_TEMPLO: Forma = { tipo: 'sector', desde: 65, hasta: 105, adentro: 140, afuera: 425 };

/** Una guirnalda de banderines entre dos postes: los colores se juntan por camino para no pesar. */
function guirnalda(x0: number, y0: number, x1: number, y1: number, sagx: number, sagy: number, n: number): string {
  const cx = (x0 + x1) / 2 + sagx;
  const cy = (y0 + y1) / 2 + sagy;
  const colores = [T.foco, T.rojo, T.lila, T.rosa];
  const grupos = colores.map(() => '');
  let focos = '';
  for (let k = 1; k <= n; k++) {
    const t = k / (n + 1);
    const x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x1;
    const y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * y1;
    const tx = 2 * (1 - t) * (cx - x0) + 2 * t * (x1 - cx);
    const ty = 2 * (1 - t) * (cy - y0) + 2 * t * (y1 - cy);
    const largo = Math.hypot(tx, ty) || 1;
    // La normal apunta hacia donde cuelga la guirnalda.
    let nx = -ty / largo;
    let ny = tx / largo;
    if (nx * sagx + ny * sagy < 0) {
      nx = -nx;
      ny = -ny;
    }
    const ux = tx / largo;
    const uy = ty / largo;
    const base1 = `${f(x - ux * 6.5)} ${f(y - uy * 6.5)}`;
    const base2 = `${f(x + ux * 6.5)} ${f(y + uy * 6.5)}`;
    grupos[k % colores.length] += `M${base1}L${base2}L${f(x + nx * 17)} ${f(y + ny * 17)}Z`;
    if (k % 3 === 0) focos += nube(x, y, 2.6, 2.6, T.farol, 'xs') + nube(x, y, 11, 11, T.foco, 's', 0.45);
  }
  const hilo = `M${f(x0)} ${f(y0)}Q${f(cx)} ${f(cy)} ${f(x1)} ${f(y1)}`;
  return trazo(hilo, T.fondo, 1.4, 0.8) + grupos.map((d, i) => forma(d, colores[i])).join('') + focos;
}

function templo(): string {
  const rnd = azar(404);
  let s = '';

  // La plaza de baldosas: el tablero lleva un cuadrado sí y otro no en peltre.
  s += nube(760, 470, 130, 100, T.foco, 'xl', 0.3);
  let baldosas = '';
  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
      if ((i + j) % 2 === 0) baldosas += caja(626 + i * 22, 330 + j * 22, 22, 22);
    }
  }
  s += forma(baldosas, T.peltre, 0.34);
  s += nube(668, 372, 70, 26, T.noche, 'l', 0.4) + nube(660, 560, 60, 30, T.noche, 'l', 0.38) + nube(900, 590, 40, 30, T.noche, 'l', 0.4);
  // Las juntas se ven de a pedazos, por lo gastadas.
  let juntas = '';
  for (let k = 0; k < 14; k++) {
    const x = 626 + k * 22;
    juntas += `M${x} 330V660`;
  }
  s += trazo(juntas, T.peltre, 1, 0.26);
  // Charcos en la plaza que devuelven el foco.
  for (const [x, y, rx, ry] of [[690, 392, 20, 6], [784, 590, 24, 7], [742, 520, 14, 5]] as const) {
    s += `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${T.violeta}" opacity="0.55"/>` + nube(x - rx * 0.2, y - 1, rx * 0.5, ry * 0.4, T.luz, 'xs', 0.8);
  }

  // El salón, de frente: el cuerpo, las columnas, la puerta con su luz y el frontón con el medallón.
  const x0 = 836;
  const y0 = 462;
  s += soplo(poli([[x0 + 2, y0 + 62], [x0 + 92, y0 + 62], [x0 + 112, y0 + 76], [x0 + 22, y0 + 76]]), T.fondo, 's', 0.5);
  s += forma(caja(x0, y0, 88, 60), T.peltre);
  s += forma(caja(x0, y0, 88, 60), T.noche, 0.22);
  // Las ventanas con luz y la puerta arqueada.
  for (const vx of [x0 + 8, x0 + 62]) s += forma(caja(vx, y0 + 12, 18, 22), T.foco) + nube(vx + 9, y0 + 24, 16, 18, T.foco, 's', 0.5);
  s += forma(`M${x0 + 34} ${y0 + 60}V${y0 + 30}a10 10 0 0 1 20 0V${y0 + 60}Z`, T.foco);
  s += nube(x0 + 44, y0 + 46, 22, 22, T.foco, 's', 0.6);
  s += trazo(`M${x0 + 44} ${y0 + 20}V${y0 + 60}`, T.noche, 1.2, 0.6);
  // Las columnas de adelante, con su sombra al costado.
  for (let k = 0; k < 6; k++) {
    const cx = x0 + 6 + k * 15.2;
    s += forma(caja(cx, y0 + 4, 5, 56), T.plata) + forma(caja(cx + 3.4, y0 + 4, 1.6, 56), T.metalHondo, 0.5);
  }
  // El frontón: el triángulo, su friso, y el medallón de plata en el medio.
  s += forma(poli([[x0 - 8, y0 + 1], [x0 + 96, y0 + 1], [x0 + 44, y0 - 40]]), T.plata);
  s += forma(poli([[x0 + 44, y0 - 40], [x0 + 96, y0 + 1], [x0 + 44, y0 + 1]]), T.peltre, 0.45);
  s += trazo(`M${x0 - 8} ${y0 + 1}H${x0 + 96}`, T.metalHondo, 2.2, 0.8);
  s += trazo(`M${x0 + 44} ${y0 - 40}L${x0 - 8} ${y0 + 1}M${x0 + 44} ${y0 - 40}L${x0 + 96} ${y0 + 1}`, T.metalHondo, 1.4, 0.7);
  s += circ(x0 + 44, y0 - 15, 11, T.metalHondo) + circ(x0 + 44, y0 - 15, 9, T.metal) + circ(x0 + 44, y0 - 15, 5.6, T.plata, 0.8) + nube(x0 + 41, y0 - 18, 3, 3, T.papel, 'xs');
  // El mástil con una banderita, arriba del frontón.
  s += trazo(`M${x0 + 44} ${y0 - 40}V${y0 - 58}`, T.fondo, 1.6) + forma(poli([[x0 + 44, y0 - 58], [x0 + 60, y0 - 53], [x0 + 44, y0 - 48]]), T.rojo);
  // Los escalones y la alfombra de luz que sale por la puerta.
  s += soplo(poli([[x0 + 30, y0 + 62], [x0 + 58, y0 + 62], [x0 + 80, y0 + 98], [x0 + 8, y0 + 98]]), T.foco, 'm', 0.45);
  for (let k = 0; k < 3; k++) s += forma(caja(x0 + 22 - k * 3, y0 + 60 + k * 4, 44 + k * 6, 3), T.plata) + forma(caja(x0 + 22 - k * 3, y0 + 63 + k * 4, 44 + k * 6, 1.6), T.metalHondo, 0.5);

  // Los faroles y las guirnaldas que cruzan la plaza.
  s += guirnalda(700, 414, 700, 548, 28, 0, 9);
  s += guirnalda(766, 392, 766, 566, -30, 0, 11);
  s += guirnalda(640, 447, 640, 530, -22, 0, 6);
  s += guirnalda(766, 392, 836, 436, 0, -16, 6);
  s += guirnalda(766, 566, 836, 530, 0, 18, 6);
  for (const [x, y] of [[700, 414], [700, 548], [766, 392], [766, 566]] as const) {
    s += nube(x, y, 66, 66, T.foco, 'xl', 0.42);
    s += soplo(`M${x + 3} ${y + 3}l9 8`, T.fondo, 'xs', 0.6);
    s += circ(x, y, 4.5, T.fondo) + circ(x, y, 2.6, T.farol) + nube(x, y, 6, 6, T.farol, 'xs');
  }
  // Las polillas alrededor de los focos.
  for (let i = 0; i < 6; i++) {
    const [x, y] = ([[700, 414], [700, 548], [766, 392], [766, 566]] as const)[i % 4];
    s += circ(x + (rnd() - 0.5) * 36, y + (rnd() - 0.5) * 36, 0.9, T.papel, 0.8);
  }

  // El tablado de la murga: tablas de madera, aro de luces y los bombos al costado.
  const bx = 797;
  const by = 548;
  s += nube(bx, by + 4, 44, 40, T.fondo, 's', 0.45);
  s += circ(bx, by, 32, T.maderaHonda) + circ(bx, by, 29, T.madera);
  let tablas = '';
  for (let k = -4; k <= 4; k++) tablas += `M${f(bx + k * 6.4)} ${f(by - Math.sqrt(Math.max(0, 841 - k * k * 41)))}V${f(by + Math.sqrt(Math.max(0, 841 - k * k * 41)))}`;
  s += trazo(tablas, T.maderaHonda, 1, 0.55);
  s += nube(bx - 8, by - 8, 14, 12, T.foco, 'm', 0.35);
  for (let k = 0; k < 12; k++) {
    const a = (k / 12) * Math.PI * 2;
    s += nube(bx + Math.cos(a) * 33, by + Math.sin(a) * 33, 2.2, 2.2, T.farol, 'xs') + nube(bx + Math.cos(a) * 33, by + Math.sin(a) * 33, 7, 7, T.foco, 's', 0.35);
  }
  for (const [dx, dy, r] of [[-46, -18, 9], [44, 20, 10], [-34, 34, 8]] as const) {
    s += circ(bx + dx + 2, by + dy + 3, r, T.fondo, 0.4) + circ(bx + dx, by + dy, r, T.rojo) + aro(bx + dx, by + dy, r, T.metal, 2.2) + circ(bx + dx - 2, by + dy - 2, r * 0.4, T.papel, 0.55);
  }

  // Las mesas de la cantina, en el borde de arriba, con sus banquitos.
  for (const [x, y] of [[798, 396], [828, 380], [872, 372], [912, 384]] as const) {
    s += nube(x + 3, y + 4, 12, 9, T.fondo, 's', 0.45);
    for (let k = 0; k < 4; k++) {
      const a = (k / 4) * Math.PI * 2 + 0.5;
      s += circ(x + Math.cos(a) * 15, y + Math.sin(a) * 15, 3.6, T.madera) + circ(x + Math.cos(a) * 15, y + Math.sin(a) * 15, 1.4, T.maderaHonda);
    }
    s += circ(x, y, 9.5, T.papel) + aro(x, y, 9.5, T.maderaHonda, 1.4) + circ(x + 2, y - 2, 2.4, T.rojo);
  }

  // Los claros bajo los sellos de la plaza y del salón.
  for (const [x, y] of [[809, 473], [744, 417], [737, 463], [797, 543], [682, 455], [700, 507], [654, 441], [662, 506], [855, 405], [878, 540], [893, 569]] as const) s += claro(x, y, 26, 22, T.papel, 0.38);

  // El confeti y las serpentinas que quedaron de la noche anterior.
  const cc = [T.foco, T.rojo, T.lila, T.rosa, T.oro];
  for (let i = 0; i < 38; i++) {
    const p = enSector(rnd, 66, 104, 150, 420);
    s += nube(p.x, p.y, 1.8 + rnd() * 1.8, 1.2 + rnd(), cc[i % cc.length], 'xs', 0.85, rnd() * 180);
  }
  for (const [x, y, c] of [[640, 470, 0], [670, 560, 1], [840, 360, 2], [760, 480, 3], [720, 360, 4], [884, 590, 0]] as const) {
    s += trazo(`M${x} ${y}q10 -14 18 -2t18 -4t18 6`, cc[c], 1.8, 0.8);
  }

  s += bordeHondo(SECTOR_TEMPLO, T.noche, 0.75);
  return s;
}

/** Las cuatro escenas del norte, por id de región. */
export const ESCENAS_NORTE: Readonly<Record<string, Escena>> = {
  'el-galpon': galpon,
  'el-arbol': arbol,
  cybersiberia,
  'el-templo': templo,
};
