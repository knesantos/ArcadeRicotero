/**
 * La entrada del bestiario (`D-79`): el plano clavado en un cartel, en la puerta de un mundo
 * de noche.
 *
 * Pedido del usuario: *"que el mapa tenga un diseño rocambolesco también y se vea como si
 * estuvieras parado en la entrada de un mundo misterioso con un mapa"*. Se está parado del lado
 * de afuera: atrás del cartel asoma el horizonte del mundo redondo (el árbol, el galpón con su
 * luz roja, el templo con la guirnalda, la grúa del astillero, la antena de Cybersiberia y el
 * resplandor del infierno), con la niebla del monte entre medio. Adelante, el molinete abierto:
 * los molinetes van abiertos (`CLAUDE.md`), y es por donde se entra.
 *
 * Cuatro piezas, que imprime `scripts/imprimir-bestiario.mjs`, como las escenas de los caminos:
 *
 * - `portal-fondo`: el cielo, el horizonte, el piso y el cartel de madera. Opaca.
 * - `mapa-tierra`: la tierra del plano, a aerógrafo sobre papel viejo, con el borde quemado. Va
 *   adentro del SVG del mapa, debajo de las regiones, los dibujos y las bestias, que siguen en
 *   tinta plana: es un plano pintado a mano con los sellos encima.
 * - `portal-luz`: el farol que alumbra el cartel, y lo oscuro que se come las esquinas. Va encima
 *   del plano y debajo de los rótulos, que se tocan y se leen igual.
 * - `portal-frente`: los pilares del portón, el arco de hierro, el molinete y la niebla del piso.
 *
 * Los colores se nombran por token y la imprenta los resuelve: acá no vive ni un hex.
 */

import { contorno, polar, type Forma } from './mapa.ts';
import { enmascarado, forma, nube, soplo, trazo, type Pieza } from './aerografo.ts';
import { ESCENAS } from './arte-mapa.ts';

const f = (v: number): string => (Math.round(v * 10) / 10).toString();

/** La escena entera, en unidades: la caja de las cuatro piezas y del CSS del portal. */
export const PORTAL = { ancho: 1000, alto: 1460 } as const;

/** Dónde va el plano adentro de la escena: un cuadrado, que es el `.bestiario-marco`. */
export const PLANO = { x: 20, y: 380, lado: 960 } as const;

/** La línea del horizonte, donde el mundo se apoya. */
const HORIZONTE = 336;

const T = {
  negro: 'var(--fondo)',
  hondo: 'var(--fondo-elevado)',
  cielo: 'var(--portal-cielo)',
  petroleo: 'var(--disco-lobo-suelto-apoyo)',
  niebla: 'var(--portal-niebla)',
  luna: 'var(--portal-luna)',
  madera: 'var(--portal-madera)',
  maderaHonda: 'var(--portal-madera-honda)',
  maderaLuz: 'var(--disco-luzbelito-tinta)',
  quemado: 'var(--portal-quemado)',
  farol: 'var(--portal-farol)',
  oro: 'var(--acento-2)',
  rojo: 'var(--marca-rojo)',
  brasa: 'var(--entorno-infierno-brasa)',
  fuego: 'var(--entorno-infierno-fuego)',
  foco: 'var(--entorno-templo-foco)',
  papel: 'var(--papel)',
  plata: 'var(--disco-momo-sampler-tinta)',
  acero: 'var(--disco-momo-sampler-apoyo)',
} as const;

/** Un azar con semilla: las mismas estrellas en cada impresión. */
function azar(semilla: number): () => number {
  let s = semilla >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/* ------------------------------------------------------------------
   El fondo: cielo, horizonte, piso y cartel
   ------------------------------------------------------------------ */

function cielo(): string {
  const { ancho } = PORTAL;
  const rnd = azar(7);
  let estrellas = '';
  for (let i = 0; i < 70; i++) {
    const x = rnd() * ancho;
    const y = rnd() * (HORIZONTE - 60);
    const r = 0.8 + rnd() * 1.6;
    estrellas += nube(x, y, r, r, T.luna, 'xs', 0.35 + rnd() * 0.5);
  }
  return (
    `<rect x="-10" y="-10" width="${ancho + 20}" height="${HORIZONTE + 80}" fill="${T.negro}"/>` +
    // La noche de *Lobo suelto*: petróleo arriba, que se apaga hacia el horizonte.
    nube(ancho / 2, 40, 760, 260, T.cielo, 'xl', 0.95) +
    nube(260, 120, 360, 140, T.petroleo, 'xl', 0.35) +
    nube(820, 70, 300, 120, T.petroleo, 'xl', 0.25) +
    estrellas +
    // La luna, apenas tapada por una nube larga.
    nube(808, 112, 120, 120, T.luna, 'xl', 0.12) +
    nube(808, 112, 40, 40, T.luna, 'm', 0.5) +
    `<circle cx="808" cy="112" r="30" fill="${T.luna}"/>` +
    nube(790, 120, 26, 30, T.niebla, 's', 0.35) +
    nube(760, 140, 170, 14, T.cielo, 'm', 0.85, -4) +
    // Lo que se prende del otro lado: el galpón, rojo; el infierno, brasa; el templo, foco.
    nube(470, HORIZONTE - 10, 320, 90, T.rojo, 'xl', 0.22) +
    nube(930, HORIZONTE, 200, 110, T.fuego, 'xl', 0.3) +
    nube(690, HORIZONTE - 20, 150, 60, T.foco, 'xl', 0.2)
  );
}

/** Las siluetas del mundo redondo contra el cielo, de izquierda a derecha. */
function horizonte(): string {
  const h = HORIZONTE;
  const sil = T.negro;
  let s = '';
  // El monte: pinos en fila, cada uno de su alto.
  const rnd = azar(13);
  let pinos = '';
  for (let x = -20; x < 300; x += 18 + rnd() * 14) {
    const alto = 46 + rnd() * 50;
    pinos += `M${f(x - 14)} ${h} L${f(x)} ${f(h - alto)} L${f(x + 14)} ${h} Z `;
  }
  s += forma(pinos, sil);
  // Los techos: chapas a dos aguas y antenas.
  s += forma(`M0 ${h} L0 ${h - 30} L40 ${h - 52} L80 ${h - 30} L80 ${h} Z M70 ${h} L70 ${h - 40} L130 ${h - 40} L130 ${h} Z`, sil);
  s += trazo(`M100 ${h - 40} l0 -36 M90 ${h - 66} l20 0 M94 ${h - 58} l12 0`, sil, 2.4);
  // El árbol: un tronco que se abre y la copa redonda, soplada en el borde.
  s += forma(`M262 ${h} L270 ${h - 110} Q246 ${h - 140} 222 ${h - 146} L226 ${h - 152} Q256 ${h - 146} 274 ${h - 124} L276 ${h - 170} L284 ${h - 170} L286 ${h - 124} Q304 ${h - 146} 334 ${h - 152} L338 ${h - 146} Q314 ${h - 140} 290 ${h - 110} L298 ${h} Z`, sil);
  for (const [x, y, r] of [[280, 196, 58], [234, 214, 38], [328, 212, 40], [256, 172, 34], [306, 170, 36]] as const) {
    s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${sil}"/>`;
  }
  s += nube(280, 196, 118, 84, T.petroleo, 'l', 0.18);
  // El galpón: el techo a dos aguas y la puerta que larga la luz roja.
  s += forma(`M396 ${h} L396 ${h - 62} L470 ${h - 104} L544 ${h - 62} L544 ${h} Z`, sil);
  s += forma(`M458 ${h} L458 ${h - 34} L482 ${h - 34} L482 ${h} Z`, T.rojo, 0.85);
  s += nube(470, h - 18, 30, 26, T.rojo, 'm', 0.6);
  for (const x of [418, 512]) s += `<rect x="${x}" y="${h - 50}" width="10" height="12" fill="${T.foco}" opacity="0.7"/>`;
  // El templo: el frontón y la guirnalda de focos que cuelga hasta el poste.
  s += forma(`M600 ${h} L600 ${h - 58} L590 ${h - 58} L652 ${h - 96} L714 ${h - 58} L704 ${h - 58} L704 ${h} Z`, sil);
  s += trazo(`M704 ${h - 70} Q740 ${h - 46} 774 ${h - 74}`, sil, 1.6);
  s += forma(`M772 ${h} L772 ${h - 80} L776 ${h - 80} L776 ${h} Z`, sil);
  for (let k = 1; k < 7; k++) {
    const t = k / 7;
    const x = 704 + 70 * t;
    const y = (1 - t) * (1 - t) * (h - 70) + 2 * (1 - t) * t * (h - 46) + t * t * (h - 74);
    s += nube(x, y + 3, 5, 5, T.foco, 'xs', 0.95) + nube(x, y + 3, 14, 14, T.foco, 's', 0.35);
  }
  // La grúa del astillero y la antena de Cybersiberia, con su luz que avisa.
  s += trazo(`M820 ${h} L820 ${h - 150} L900 ${h - 150} M820 ${h - 132} L884 ${h - 150} M892 ${h - 150} L892 ${h - 110}`, sil, 5);
  s += trazo(`M820 ${h} L806 ${h - 40} M820 ${h} L834 ${h - 40}`, sil, 3);
  s += trazo(`M954 ${h} L960 ${h - 190} L966 ${h} M944 ${h - 120} l32 0 M948 ${h - 156} l24 0`, sil, 3);
  s += nube(960, h - 194, 5, 5, T.rojo, 'xs') + nube(960, h - 194, 18, 18, T.rojo, 's', 0.5);
  return s;
}

/** El piso de este lado: el campo oscuro, el camino que va hasta el cartel y la niebla. */
function piso(): string {
  const { ancho, alto } = PORTAL;
  const h = HORIZONTE;
  return (
    `<rect x="-10" y="${h}" width="${ancho + 20}" height="${alto - h + 10}" fill="${T.negro}"/>` +
    nube(ancho / 2, h + 30, 620, 50, T.petroleo, 'xl', 0.28) +
    // La niebla del monte, en dos franjas que no se tocan.
    nube(200, h - 14, 420, 26, T.niebla, 'l', 0.28) +
    nube(760, h - 6, 380, 22, T.niebla, 'l', 0.22) +
    nube(ancho / 2, h + 24, 560, 30, T.niebla, 'xl', 0.2) +
    // El camino de tierra que sale del portón y se pierde atrás del cartel.
    soplo(`M380 ${alto + 10} L470 ${h + 40} L530 ${h + 40} L620 ${alto + 10} Z`, T.quemado, 'l', 0.55)
  );
}

/** El cartel: tablones verticales, el tejadito arriba, los postes y el farol que cuelga. */
function cartel(): string {
  const x0 = PLANO.x - 26;
  const x1 = PLANO.x + PLANO.lado + 26;
  const y0 = PLANO.y - 26;
  const y1 = PLANO.y + PLANO.lado + 26;
  const silueta = `M${x0} ${y0} L${x1} ${y0} L${x1} ${y1} L${x0} ${y1} Z`;
  const rnd = azar(23);
  let tablones = '';
  const ancho = (x1 - x0) / 7;
  for (let i = 0; i < 7; i++) {
    const x = x0 + i * ancho;
    tablones += nube(x + ancho / 2, (y0 + y1) / 2, ancho * 0.34, (y1 - y0) * 0.55, T.madera, 'l', 0.55 + rnd() * 0.25);
    tablones += trazo(`M${f(x)} ${y0} L${f(x)} ${y1}`, T.maderaHonda, 4);
    // Las vetas, finas y torcidas.
    for (let k = 0; k < 3; k++) {
      const vx = x + ancho * (0.25 + rnd() * 0.5);
      tablones += trazo(`M${f(vx)} ${y0} Q${f(vx + (rnd() - 0.5) * 24)} ${f((y0 + y1) / 2)} ${f(vx + (rnd() - 0.5) * 10)} ${y1}`, T.maderaHonda, 1.4, 0.5);
    }
    // Los clavos, arriba y abajo de cada tablón.
    for (const y of [y0 + 14, y1 - 14]) tablones += `<circle cx="${f(x + ancho / 2)}" cy="${y}" r="3.4" fill="${T.maderaHonda}"/>`;
  }
  const poste = (x: number): string =>
    forma(`M${x - 18} ${y0 - 90} L${x + 18} ${y0 - 90} L${x + 20} ${PORTAL.alto + 10} L${x - 20} ${PORTAL.alto + 10} Z`, T.maderaHonda) +
    nube(x - 4, (y0 + PORTAL.alto) / 2, 7, (PORTAL.alto - y0) / 2, T.madera, 'm', 0.5);
  return (
    poste(150) + poste(850) +
    // El tejadito: una chapa angosta sobre el cartel, para que no se lave el plano.
    forma(`M${x0 - 34} ${y0 - 40} L${x1 + 34} ${y0 - 40} L${x1 + 14} ${y0 - 4} L${x0 - 14} ${y0 - 4} Z`, T.hondo) +
    trazo(`M${x0 - 34} ${y0 - 40} L${x1 + 34} ${y0 - 40}`, T.niebla, 2, 0.4) +
    enmascarado('m-cartel', silueta, forma(silueta, T.maderaHonda) + tablones + nube((x0 + x1) / 2, y0 + 60, 420, 160, T.maderaLuz, 'xl', 0.35)) +
    // El farol: el brazo de hierro, el vidrio y su halo.
    trazo(`M500 ${y0 - 40} L500 ${y0 - 14}`, T.negro, 3) +
    forma(`M488 ${y0 - 14} L512 ${y0 - 14} L508 ${y0 + 14} L492 ${y0 + 14} Z`, T.negro) +
    nube(500, y0 + 2, 9, 10, T.farol, 's') +
    nube(500, y0 + 2, 60, 50, T.farol, 'l', 0.4)
  );
}

function fondo(): string {
  return `<g filter="url(#rociado)">${cielo()}${piso()}${horizonte()}${cartel()}</g>`;
}

/* ------------------------------------------------------------------
   La tierra del plano
   ------------------------------------------------------------------ */

export interface TierraDeRegion {
  id: string;
  forma: Forma;
  /** La tinta de su disco (`tintaDe`), y la de apoyo para lo hondo. */
  tinta: string;
  apoyo: string;
}

/**
 * La tierra del plano: papel viejo con cada región soplada en la tinta de su disco, lo hondo en
 * la de apoyo, el borde quemado y alguna mancha. Las regiones se sueltan por el borde, como el
 * aerógrafo sin máscara: el dibujo del plano marca el límite con su línea de puntos.
 */
function tierra(regiones: readonly TierraDeRegion[]): string {
  const c = 500;
  const r = 432;
  const rnd = azar(31);
  // El papel viejo: el crema, curtido con el cuero de *Luzbelito*.
  let s = `<circle cx="${c}" cy="${c}" r="${r}" fill="${T.papel}"/>` + nube(c, c, r, r, T.maderaLuz, 'xl', 0.3);
  regiones.forEach((reg, i) => {
    const d = contorno(reg.forma);
    let adentro = forma(d, reg.tinta, 0.58);
    if (reg.forma.tipo === 'sector') {
      const medio = (reg.forma.desde + reg.forma.hasta) / 2;
      const p = polar(medio + (rnd() - 0.5) * 10, reg.forma.afuera - 50);
      const q = polar(medio + (rnd() - 0.5) * 16, (reg.forma.adentro + reg.forma.afuera) / 2);
      adentro += nube(p.x, p.y, 100, 80, reg.apoyo, 'xl', 0.5) + nube(q.x, q.y, 70, 60, reg.tinta, 'l', 0.5) + nube(q.x, q.y, 26, 22, T.papel, 'l', 0.25);
    } else if (reg.forma.tipo !== 'anillo') {
      const p = reg.forma.tipo === 'centro' ? { x: c, y: c } : polar(reg.forma.angulo, reg.forma.distancia);
      adentro += nube(p.x, p.y + 10, reg.forma.radio * 0.8, reg.forma.radio * 0.6, reg.apoyo, 'l', 0.3);
    }
    // La escena de la zona (`arte-mapa.ts`), encima de su tinta y recortada con su contorno.
    adentro += ESCENAS[reg.id]?.() ?? '';
    s += enmascarado(`m-tierra-${i}`, d, adentro);
    // Lo que se sale del borde: el soplo suelto que junta una región con la de al lado.
    s += soplo(d, reg.tinta, 'l', 0.22);
  });
  // El galpón alumbra el medio; lo de afuera se va quemando hacia el borde del papel.
  s += nube(c, c, 150, 150, T.farol, 'xl', 0.18);
  const borde = `M${c - r} ${c} a${r} ${r} 0 1 0 ${r * 2} 0 a${r} ${r} 0 1 0 ${-r * 2} 0 Z`;
  let quemado = '';
  for (let a = 0; a < 360; a += 12) {
    const p = polar(a + rnd() * 8, r - 6);
    quemado += nube(p.x, p.y, 40 + rnd() * 24, 20 + rnd() * 12, T.quemado, 'l', 0.22 + rnd() * 0.15, a);
  }
  // Las manchas: una de café y una de humedad, donde no tapan un rótulo.
  quemado += `<circle cx="690" cy="300" r="46" fill="none" stroke="${T.quemado}" stroke-width="5" opacity="0.22" filter="url(#soplo-xs)"/>`;
  quemado += nube(300, 690, 60, 44, T.quemado, 'l', 0.16, 20);
  return enmascarado('m-papel', borde, s + quemado);
}

/* ------------------------------------------------------------------
   La luz del farol y el frente
   ------------------------------------------------------------------ */

/** Encima del plano: lo oscuro de las esquinas y el cono tibio del farol, que baja desde arriba. */
function luz(): string {
  const { lado } = PLANO;
  const m = lado / 2;
  let s = '';
  for (const [x, y] of [[0, 0], [lado, 0], [0, lado], [lado, lado]] as const) s += nube(x, y, 260, 260, T.negro, 'xl', 0.75);
  s += nube(m, lado + 40, 520, 140, T.negro, 'xl', 0.45);
  s += soplo(`M${m - 70} -10 L${m + 70} -10 L${lado - 40} ${lado * 0.7} L40 ${lado * 0.7} Z`, T.farol, 'xl', 0.09);
  return s;
}

/** Un caño cromado: el negro de afuera, el acero en el cuerpo y un brillo fino corrido arriba. */
function cano(x1: number, y1: number, x2: number, y2: number, grueso: number): string {
  const d = `M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}`;
  const largo = Math.hypot(x2 - x1, y2 - y1) || 1;
  // El brillo va corrido hacia arriba del caño, del lado del farol.
  const nx = ((y1 - y2) / largo) * grueso * 0.22;
  const ny = (-(x2 - x1) / largo) * grueso * 0.22;
  const arriba = ny < 0 ? 1 : -1;
  const b = `M${f(x1 + nx * arriba)} ${f(y1 + ny * arriba)} L${f(x2 + nx * arriba)} ${f(y2 + ny * arriba)}`;
  return trazo(d, T.negro, grueso + 4) + trazo(d, T.acero, grueso) + trazo(b, T.plata, grueso * 0.28, 0.85);
}

/**
 * El molinete de la cancha, abierto: el gabinete de chapa gastada, el cubo con los tres brazos
 * (el de arriba quedó levantado: alguien lo dejó pasar) y la lucecita de paso prendida. Va en la
 * esquina del cartel, donde el plano redondo deja lugar.
 */
function molinete(cx: number, base: number): string {
  const ancho = 92;
  const alto = 196;
  const x0 = cx - ancho / 2;
  const y0 = base - alto;
  const caja = `M${x0} ${base} L${x0} ${y0 + 26} L${x0 + 12} ${y0} L${x0 + ancho} ${y0} L${x0 + ancho} ${base} Z`;
  const tapa = `M${x0} ${y0 + 26} L${x0 + 12} ${y0} L${x0 + ancho} ${y0} L${x0 + ancho - 12} ${y0 + 26} Z`;
  const cubo = { x: x0 - 6, y: y0 + 74 };
  return (
    // La sombra en el piso, larga hacia afuera del farol.
    nube(cx - 40, base + 4, 150, 16, T.negro, 'm', 0.85) +
    // El gabinete: la chapa en sombra, el canto prendido por el farol y el óxido que chorrea.
    enmascarado('m-molinete', caja,
      forma(caja, T.maderaHonda) +
      nube(x0 + 18, y0 + alto / 2, 22, alto * 0.6, T.acero, 'l', 0.85) +
      nube(x0 + 10, y0 + alto / 2, 6, alto * 0.55, T.plata, 'm', 0.6) +
      nube(x0 + ancho - 10, y0 + alto / 2, 18, alto, T.negro, 'l', 0.8) +
      nube(x0 + 40, y0 + 120, 8, 40, T.quemado, 's', 0.7) +
      nube(x0 + 64, y0 + 70, 6, 30, T.quemado, 's', 0.6) +
      trazo(`M${x0} ${y0 + 150} L${x0 + ancho} ${y0 + 150}`, T.negro, 3, 0.7) +
      trazo(`M${x0 + 8} ${y0 + 160} l0 30 M${x0 + 20} ${y0 + 160} l0 30`, T.negro, 2, 0.6)) +
    forma(tapa, T.acero) + nube(x0 + 40, y0 + 12, 30, 7, T.plata, 's', 0.8) +
    // La ranura del boleto y la lucecita de paso, prendida.
    `<rect x="${x0 + 46}" y="${y0 + 36}" width="30" height="5" rx="1" fill="${T.negro}"/>` +
    nube(x0 + 62, y0 + 56, 7, 7, T.oro, 'xs') + nube(x0 + 62, y0 + 56, 22, 22, T.oro, 'm', 0.45) +
    // El eje que sale del gabinete y sostiene el cubo, con su collar.
    cano(cubo.x, cubo.y, x0 + 4, cubo.y - 6, 16) +
    forma(`M${x0 - 2} ${cubo.y - 24} L${x0 + 8} ${cubo.y - 24} L${x0 + 8} ${cubo.y + 14} L${x0 - 2} ${cubo.y + 14} Z`, T.negro) +
    // Los tres brazos: el levantado, el que cuelga hacia el piso y el que viene hacia acá.
    cano(cubo.x, cubo.y, cubo.x - 26, cubo.y - 132, 13) +
    cano(cubo.x, cubo.y, cubo.x - 118, cubo.y + 62, 13) +
    cano(cubo.x, cubo.y, cubo.x - 58, cubo.y + 122, 15) +
    // El cubo, con su tuerca.
    `<circle cx="${cubo.x}" cy="${cubo.y}" r="19" fill="${T.negro}"/>` +
    `<circle cx="${cubo.x}" cy="${cubo.y}" r="15" fill="${T.acero}"/>` +
    nube(cubo.x - 5, cubo.y - 6, 6, 5, T.plata, 'xs', 0.9) +
    `<circle cx="${cubo.x}" cy="${cubo.y}" r="4" fill="${T.negro}"/>` +
    // El tibio del farol que pega en el cromo.
    nube(cubo.x - 10, cubo.y - 20, 70, 70, T.farol, 'l', 0.14)
  );
}

/** Los pilares del portón, el arco de hierro de punta a punta, el molinete y la niebla del piso. */
function frente(): string {
  const { ancho, alto } = PORTAL;
  const pilar = (x: number): string =>
    forma(`M${x} 70 L${x + 24} 70 L${x + 24} ${alto + 10} L${x} ${alto + 10} Z`, T.negro) +
    forma(`M${x - 8} 50 L${x + 32} 50 L${x + 32} 76 L${x - 8} 76 Z`, T.negro) +
    nube(x + 16, alto / 2, 5, alto / 2, T.niebla, 'm', 0.18);
  let arco = '';
  // El arco: dos curvas de hierro y las puntas de lanza entre medio.
  arco += trazo(`M20 92 Q500 -10 980 92`, T.negro, 10) + trazo(`M20 132 Q500 40 980 132`, T.negro, 6);
  for (let k = 1; k < 20; k++) {
    const t = k / 20;
    const x = 20 + 960 * t;
    const yA = (1 - t) * (1 - t) * 92 + 2 * (1 - t) * t * -10 + t * t * 92;
    const yB = (1 - t) * (1 - t) * 132 + 2 * (1 - t) * t * 40 + t * t * 132;
    arco += trazo(`M${f(x)} ${f(yB)} L${f(x)} ${f(yA - 14)}`, T.negro, 3);
    arco += forma(`M${f(x - 5)} ${f(yA - 12)} L${f(x)} ${f(yA - 26)} L${f(x + 5)} ${f(yA - 12)} Z`, T.negro);
  }
  // Un rulo de herrería en cada esquina.
  arco += trazo(`M66 150 q30 0 30 -26 q0 -16 -16 -16 q-12 0 -12 12 M934 150 q-30 0 -30 -26 q0 -16 16 -16 q12 0 12 12`, T.negro, 4);
  const base = alto - 8;
  return (
    pilar(0) + pilar(ancho - 24) + arco +
    nube(ancho / 2, alto - 10, 600, 60, T.niebla, 'xl', 0.35) +
    // La niebla que queda detrás del molinete: sin ella, hierro negro sobre noche.
    nube(ancho - 150, base - 150, 210, 150, T.niebla, 'xl', 0.55) +
    `<g filter="url(#rociado)">${molinete(ancho - 110, base)}</g>` +
    nube(ancho / 2, alto + 20, 520, 26, T.negro, 'l', 0.7)
  );
}

/* ------------------------------------------------------------------
   Las piezas
   ------------------------------------------------------------------ */

/** La tierra de cada región del JSON: la ruta no, que es el surco y va dibujada aparte. */
export function tierrasDe(regiones: ReadonlyArray<{ id: string; disco: string; forma: Forma }>): TierraDeRegion[] {
  return regiones
    .filter((r) => r.forma.tipo !== 'anillo')
    .map((r) =>
      r.disco === 'marca'
        ? { id: r.id, forma: r.forma, tinta: T.rojo, apoyo: T.brasa }
        : { id: r.id, forma: r.forma, tinta: `var(--disco-${r.disco}-tinta)`, apoyo: `var(--disco-${r.disco}-apoyo)` },
    );
}

/** Las piezas del portal. La tierra necesita las regiones, que vienen del JSON. */
export function piezasDelPortal(regiones: readonly TierraDeRegion[]): Pieza[] {
  const { ancho, alto } = PORTAL;
  return [
    { nombre: 'portal-fondo', caja: [0, 0, ancho, alto], dibujo: fondo(), opaca: true, densidad: 1.1 },
    { nombre: 'mapa-tierra', caja: [0, 0, 1000, 1000], dibujo: `<g filter="url(#rociado)">${tierra(regiones)}</g>`, densidad: 2 },
    { nombre: 'portal-luz', caja: [0, 0, PLANO.lado, PLANO.lado], dibujo: luz(), densidad: 0.5 },
    { nombre: 'portal-frente', caja: [0, 0, ancho, alto], dibujo: frente(), densidad: 1.1 },
  ];
}
