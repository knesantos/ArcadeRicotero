/**
 * El salón del infierno, en el camino (`D-91`, tanda 2).
 *
 * *"El infierno está encantador esta noche"*: es un salón de baile. En el recinto ya era fuerte (la
 * pared de fuego de *Gulp!*, el damero), pero le faltaba aire y fondo: el fuego era una foto quieta y
 * el piso, un plano. Esto le suma, **solo en el camino** (el recinto del plano sigue igual):
 *
 * - **La arcada**: las columnas y los arcos del salón, negros contra el fuego, con el canto encendido.
 *   Le ponen medida a la pared: ahora se sabe qué tan alto arde.
 * - **Los que bailan**: parejas chicas, lejos, a contraluz, entre columna y columna.
 * - **Las lenguas**: dos filas de llamas sopladas que la isla estira y afloja desde la base. El fuego respira.
 * - **El que asoma**: una cabeza enorme, de cuernos largos, detrás de las llamas. No está. Si te quedás
 *   quieto unos segundos, va apareciendo; si caminás, se hunde.
 * - **El piso**: el mismo damero, con más filas y más apretadas contra la pared (se va de verdad), el
 *   fuego que se refleja roto en lo encerado, y **la alfombra** que baja de la piedra de Luzbelito hasta
 *   quien mira: es el punto de fuga de la región.
 *
 * Aerógrafo, como el recinto: soplo y rociado. Los colores, por token.
 */

import { enmascarado, forma, nube, soplo, trazo, type Pieza } from './aerografo.ts';
import { azar } from './pincel.ts';

const f = (v: number): string => (Math.round(v * 10) / 10).toString();

const F = {
  negro: 'var(--fondo)',
  brasa: 'var(--entorno-infierno-brasa)',
  rojo: 'var(--disco-gulp-tinta)',
  vivo: 'var(--marca-rojo)',
  fuego: 'var(--entorno-infierno-fuego)',
  oro: 'var(--acento-2)',
  sombra: 'var(--bestia-lobo-oscuro)',
  piedra: 'var(--bestia-lobo-sombra)',
};

const ANCHO = 900;
const ALTO = 640;
/** Donde la pared se junta con el piso, y hacia dónde se va el damero (los mismos del recinto, `arte.ts`). */
export const SALON = { zocalo: 340, fuga: { x: 450, y: 236 }, columnas: [42, 318, 596], capitel: 128, clave: 34 } as const;

const elipse = (x: number, y: number, rx: number, ry: number): string =>
  `M${f(x - rx)} ${f(y)} a${f(rx)} ${f(ry)} 0 1 0 ${f(rx * 2)} 0 a${f(rx)} ${f(ry)} 0 1 0 ${f(-rx * 2)} 0 Z`;
const poli = (ps: readonly (readonly [number, number])[]): string => `M${ps.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L')} Z`;
const hoja = (x: number, y: number, w: number, h: number): string => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${F.negro}" fill-opacity="0"/>`;

/* ------------------------------------------------------------------
   La arcada y los que bailan
   ------------------------------------------------------------------ */

/** Una pareja que baila, a contraluz: él, ella y los brazos en alto. `t`, el tamaño; `cuernos`, si él los tiene. */
function pareja(x: number, pie: number, t: number, giro: number, cuernos: boolean): string {
  const el = x - 7 * t;
  const ella = x + 8 * t;
  let d =
    // Él: las piernas, el saco, la cabeza.
    poli([[el - 5 * t, pie], [el - 4 * t, pie - 30 * t], [el + 4 * t, pie - 30 * t], [el + 6 * t, pie]]) +
    poli([[el - 8 * t, pie - 28 * t], [el - 7 * t, pie - 56 * t], [el + 7 * t, pie - 56 * t], [el + 8 * t, pie - 28 * t]]) +
    elipse(el, pie - 63 * t, 5.4 * t, 6.4 * t) +
    // Ella: la pollera en campana, el talle, la cabeza con el rodete.
    poli([[ella - 16 * t, pie], [ella - 4 * t, pie - 36 * t], [ella + 4 * t, pie - 36 * t], [ella + 18 * t, pie - 2 * t]]) +
    poli([[ella - 5 * t, pie - 34 * t], [ella - 6 * t, pie - 52 * t], [ella + 6 * t, pie - 52 * t], [ella + 5 * t, pie - 34 * t]]) +
    elipse(ella, pie - 58 * t, 5 * t, 5.8 * t) + elipse(ella + 3 * t, pie - 64 * t, 3 * t, 3 * t) +
    // Los brazos: uno en la cintura de ella, el otro arriba, tomados de la mano.
    poli([[el + 5 * t, pie - 52 * t], [ella - 3 * t, pie - 42 * t], [ella - 3 * t, pie - 38 * t], [el + 5 * t, pie - 46 * t]]) +
    poli([[el - 6 * t, pie - 54 * t], [x - 2 * t, pie - 78 * t], [x + 2 * t, pie - 76 * t], [el - 2 * t, pie - 50 * t]]) +
    poli([[ella + 5 * t, pie - 50 * t], [x + 2 * t, pie - 78 * t], [x - 1 * t, pie - 75 * t], [ella + 2 * t, pie - 47 * t]]);
  if (cuernos) d += poli([[el - 4 * t, pie - 67 * t], [el - 9 * t, pie - 78 * t], [el - 1.6 * t, pie - 69 * t]]) + poli([[el + 4 * t, pie - 67 * t], [el + 9 * t, pie - 78 * t], [el + 1.6 * t, pie - 69 * t]]);
  return `<g transform="rotate(${f(giro)} ${f(x)} ${f(pie)})"><path d="${d}"/></g>`;
}

/**
 * La arcada del salón y los que bailan. Las columnas son finas (el fuego tiene que seguir siendo la
 * pared), negras, con el canto que les prende el fuego de atrás de los dos lados; los arcos, una
 * costilla y nada más. Entre columna y columna, lejos, las parejas.
 */
function salon(): string {
  const { zocalo, columnas, capitel, clave } = SALON;
  let piedra = '';
  let cantos = '';
  for (const x of columnas) {
    // Finas (segunda vuelta): con 26 de ancho, en un teléfono parado una columna partía la pantalla en dos.
    const g = 7.5;
    piedra +=
      forma(poli([[x - g, zocalo + 6], [x - g + 2, capitel + 12], [x + g - 2, capitel + 12], [x + g, zocalo + 6]]), F.negro) +
      forma(poli([[x - g - 7, capitel + 10], [x - g - 4, capitel - 2], [x + g + 4, capitel - 2], [x + g + 7, capitel + 10]]), F.negro) +
      forma(poli([[x - g - 5, zocalo + 8], [x - g - 2, zocalo - 9], [x + g + 2, zocalo - 9], [x + g + 5, zocalo + 8]]), F.negro);
    // El canto encendido: una raya fina de cada lado, cortada, no de regla.
    for (const lado of [-1, 1]) {
      const rnd = azar(4001 + x * lado);
      for (let y = capitel + 18; y < zocalo - 16; y += 16 + rnd() * 30) cantos += trazo(`M${f(x + lado * (g - 1.2))} ${f(y)} l${f(lado * 0.4)} ${f(8 + rnd() * 16)}`, F.fuego, 1.5, 0.5 + rnd() * 0.4);
    }
  }
  // Los arcos: de capitel a capitel, apuntados, con la clave arriba. Costilla gruesa, y otra fina de brasa por abajo.
  for (let i = -1; i < columnas.length; i++) {
    const a = i < 0 ? columnas[0]! - 276 : columnas[i]!;
    const b = i + 1 >= columnas.length ? columnas[columnas.length - 1]! + 276 : columnas[i + 1]!;
    const m = (a + b) / 2;
    const arco = `M${f(a + 8)} ${capitel} Q${f(a + 14)} ${f(clave + 40)} ${f(m)} ${clave} Q${f(b - 14)} ${f(clave + 40)} ${f(b - 8)} ${capitel}`;
    piedra += trazo(arco, F.negro, 11);
    cantos += trazo(`M${f(a + 16)} ${capitel + 2} Q${f(a + 22)} ${f(clave + 50)} ${f(m)} ${clave + 9} Q${f(b - 22)} ${f(clave + 50)} ${f(b - 16)} ${capitel + 2}`, F.brasa, 2.4, 0.9);
    // La enjuta: lo que queda entre arco y arco, arriba de cada columna, macizo.
    if (i >= 0) piedra += forma(poli([[a - 26, -20], [a + 26, -20], [a + 13, capitel - 34], [a + 8, capitel], [a - 8, capitel], [a - 13, capitel - 34]]), F.negro);
  }
  // El techo: lo de arriba de todo se cierra en negro, para que los arcos tengan de dónde colgar.
  const techo = soplo(`M-20 -30 L${ANCHO + 20} -30 L${ANCHO + 20} 16 L-20 16 Z`, F.negro, 'm', 0.95);

  // Los que bailan: lejos y chicos, cada pareja en su vano y ninguna detrás de la puerta (140 a 220).
  const rnd = azar(4013);
  let lejos = '';
  let cerca = '';
  for (const [x, t] of [[96, 0.62], [262, 0.7], [384, 0.6], [540, 0.72], [668, 0.62], [752, 0.74], [836, 0.6]] as const) {
    const p = pareja(x, zocalo - 2, t, -4 + rnd() * 8, rnd() < 0.6);
    if (t < 0.66) lejos += p;
    else cerca += p;
  }
  return (
    `<g filter="url(#rociado)">${hoja(0, 0, ANCHO, zocalo + 10)}` +
    techo +
    // Las de más atrás, medio comidas por el resplandor; las de adelante, negras.
    `<g fill="${F.brasa}" opacity="0.9">${lejos}</g>` +
    `<g fill="${F.negro}" opacity="0.92">${cerca}</g>` +
    piedra +
    cantos +
    `</g>`
  );
}

/* ------------------------------------------------------------------
   Las lenguas, que respiran
   ------------------------------------------------------------------ */

/** Una fila de lenguas de fuego, sopladas: rojo afuera, naranja adentro y oro en el corazón. */
function lenguas(semilla: number, base: number, alto: readonly [number, number], paso: readonly [number, number], o: number): string {
  const rnd = azar(semilla);
  let s = '';
  for (let x = -20 + rnd() * 30; x < ANCHO + 20; x += paso[0] + rnd() * (paso[1] - paso[0])) {
    // En hogueras, no en fila: la altura sube y baja a lo largo de la pared, con huecos donde casi no arde.
    // (Primera prueba: parejas y derechas, eran una guirnalda de triángulos.)
    const hoguera = 0.22 + 0.78 * Math.sin(x * 0.0123 + semilla) ** 2;
    const h = alto[0] + rnd() ** 1.5 * (alto[1] - alto[0]) * hoguera;
    const w = 15 + h * 0.17 + rnd() * 13;
    // Cada lengua es una ese: se va para un lado y la punta vuelve.
    const lado = rnd() < 0.5 ? -1 : 1;
    const torcida = lado * w * (0.5 + rnd() * 0.9);
    const ese = (k: number, hh: number): string =>
      `M${f(x - (w * k) / 2)} ${base} C${f(x - w * k * 0.9 - torcida * 0.5)} ${f(base - hh * 0.34)} ${f(x + torcida * 1.1 - w * k * 0.2)} ${f(base - hh * 0.62)} ${f(x + torcida * 0.3)} ${f(base - hh)} ` +
      `C${f(x + torcida * 1.3 + w * k * 0.3)} ${f(base - hh * 0.58)} ${f(x + w * k * 0.9 - torcida * 0.4)} ${f(base - hh * 0.3)} ${f(x + (w * k) / 2)} ${base} Z`;
    const d = ese(1, h);
    const d2 = ese(0.5, h * 0.66);
    s += soplo(d, F.vivo, 's', o * 0.85) + soplo(d2, F.fuego, 's', o) + nube(x, base - h * 0.12, w * 0.16, h * 0.14, F.oro, 's', o * 0.8);
  }
  return s;
}

/** La caja de las lenguas, y la línea de donde se estiran. */
export const LENGUAS = { caja: [0, 110, ANCHO, 240] as const, base: SALON.zocalo + 6 } as const;

const fila = (semilla: number, alto: readonly [number, number], paso: readonly [number, number], o: number): string =>
  `<g filter="url(#rociado)">${hoja(...LENGUAS.caja)}${lenguas(semilla, LENGUAS.base, alto, paso, o)}</g>`;

/* ------------------------------------------------------------------
   El que asoma
   ------------------------------------------------------------------ */

/** Dónde está el que asoma: la caja de su pieza. */
export const GIGANTE = { caja: [247, 0, 420, 346] as const } as const;

/**
 * El que asoma detrás de las llamas: la cabeza y los hombros de alguien demasiado grande, de cuernos
 * largos. Casi no tiene tinta: es lo más oscuro del fuego con forma, y dos tajos de brasa por ojos.
 */
function gigante(): string {
  const [x0, y0, w, h] = GIGANTE.caja;
  const cx = x0 + w * 0.5;
  // En el vano del medio (segunda vuelta: estaba detrás de una columna), justo arriba de Luzbelito: se le
  // ve la cara por encima de la llama, y los hombros llenan el vano de columna a columna.
  const cabeza = y0 + h * 0.6;
  const silueta =
    // Los hombros, que se pierden por abajo.
    `M${f(cx - 200)} ${y0 + h + 20} Q${f(cx - 190)} ${f(cabeza + 60)} ${f(cx - 70)} ${f(cabeza + 44)} L${f(cx + 70)} ${f(cabeza + 44)} Q${f(cx + 190)} ${f(cabeza + 60)} ${f(cx + 200)} ${y0 + h + 20} Z ` +
    // La cabeza, larga, de mentón en punta.
    `M${f(cx - 56)} ${f(cabeza - 30)} Q${f(cx - 60)} ${f(cabeza - 96)} ${f(cx)} ${f(cabeza - 100)} Q${f(cx + 60)} ${f(cabeza - 96)} ${f(cx + 56)} ${f(cabeza - 30)} Q${f(cx + 46)} ${f(cabeza + 40)} ${f(cx)} ${f(cabeza + 74)} Q${f(cx - 46)} ${f(cabeza + 40)} ${f(cx - 56)} ${f(cabeza - 30)} Z ` +
    // Los cuernos: salen de la frente, se abren y vuelven hacia adentro.
    `M${f(cx - 40)} ${f(cabeza - 84)} Q${f(cx - 136)} ${f(cabeza - 96)} ${f(cx - 118)} ${f(cabeza - 172)} Q${f(cx - 102)} ${f(cabeza - 120)} ${f(cx - 16)} ${f(cabeza - 96)} Z ` +
    `M${f(cx + 40)} ${f(cabeza - 84)} Q${f(cx + 136)} ${f(cabeza - 96)} ${f(cx + 118)} ${f(cabeza - 172)} Q${f(cx + 102)} ${f(cabeza - 120)} ${f(cx + 16)} ${f(cabeza - 96)} Z`;
  // El canto: lo que el fuego de adelante le marca. Sin esto era una mancha más oscura y nada más.
  const canto =
    `M${f(cx - 118)} ${f(cabeza - 172)} Q${f(cx - 136)} ${f(cabeza - 96)} ${f(cx - 40)} ${f(cabeza - 84)} M${f(cx + 118)} ${f(cabeza - 172)} Q${f(cx + 136)} ${f(cabeza - 96)} ${f(cx + 40)} ${f(cabeza - 84)} ` +
    `M${f(cx - 56)} ${f(cabeza - 30)} Q${f(cx - 60)} ${f(cabeza - 96)} ${f(cx)} ${f(cabeza - 100)} Q${f(cx + 60)} ${f(cabeza - 96)} ${f(cx + 56)} ${f(cabeza - 30)} ` +
    `M${f(cx - 192)} ${f(cabeza + 110)} Q${f(cx - 176)} ${f(cabeza + 62)} ${f(cx - 72)} ${f(cabeza + 46)} M${f(cx + 192)} ${f(cabeza + 110)} Q${f(cx + 176)} ${f(cabeza + 62)} ${f(cx + 72)} ${f(cabeza + 46)}`;
  const ojo = (lado: number): string =>
    nube(cx + lado * 24, cabeza - 34, 16, 8, F.fuego, 's', 0.5) +
    forma(`M${f(cx + lado * 10)} ${f(cabeza - 30)} Q${f(cx + lado * 26)} ${f(cabeza - 46)} ${f(cx + lado * 42)} ${f(cabeza - 42)} Q${f(cx + lado * 28)} ${f(cabeza - 30)} ${f(cx + lado * 10)} ${f(cabeza - 30)} Z`, F.oro) +
    forma(elipse(cx + lado * 26, cabeza - 37, 1.6, 4.6), F.negro);
  return (
    `<g filter="url(#rociado)">${hoja(x0, y0, w, h)}` +
    `<g filter="url(#soplo-xs)" opacity="0.8"><path d="${silueta}" fill="${F.negro}"/></g>` +
    trazo(canto, F.fuego, 2.4, 0.55) +
    nube(cx, cabeza - 96, 40, 5, F.brasa, 's', 0.7) +
    ojo(-1) + ojo(1) +
    // La boca: una raya de brasa, torcida.
    trazo(`M${f(cx - 20)} ${f(cabeza + 30)} Q${f(cx)} ${f(cabeza + 40)} ${f(cx + 24)} ${f(cabeza + 26)}`, F.fuego, 2.2, 0.7) +
    `</g>`
  );
}

/* ------------------------------------------------------------------
   El piso: el damero que se va, los reflejos rotos y la alfombra
   ------------------------------------------------------------------ */

function damero(desde: number): string {
  const { fuga } = SALON;
  const fondo = ALTO + 30;
  const N = 15;
  const filas: number[] = [];
  // Más filas, y mucho más apretadas contra la pared: la primera mide tres unidades y la última, ochenta.
  for (let j = 0; j <= N; j++) filas.push(desde + (fondo - desde) * Math.pow(j / N, 2.25));
  const enY = (xb: number, y: number): number => fuga.x + (xb - fuga.x) * ((y - fuga.y) / (fondo - fuga.y));
  const paso = 66;
  let baldosas = '';
  for (let c = -18; c < 18; c++) {
    const [b0, b1] = [ANCHO / 2 + c * paso, ANCHO / 2 + (c + 1) * paso];
    for (let j = 0; j < N; j++) {
      if ((c + j) % 2 === 0) continue;
      const [y0, y1] = [filas[j]!, filas[j + 1]!];
      baldosas += `M${f(enY(b0, y0))} ${f(y0)} L${f(enY(b1, y0))} ${f(y0)} L${f(enY(b1, y1))} ${f(y1)} L${f(enY(b0, y1))} ${f(y1)} Z `;
    }
  }
  // Los reflejos del fuego en lo encerado: manchas acostadas, cada vez más cortas y más flojas, que
  // bajan desde la pared. Rotas: ninguna cruza una junta entera.
  const rnd = azar(4027);
  let reflejos = '';
  for (const x of [70, 250, 400, 520, 690, 820]) {
    const largo = 5 + Math.floor(rnd() * 4);
    for (let i = 0; i < largo; i++) {
      const y = desde + 8 + i * (9 + i * 3.4) + rnd() * 4;
      const w = (30 - i * 3) * (0.7 + rnd() * 0.6);
      reflejos += nube(enY(x + (rnd() - 0.5) * 30, y) + (rnd() - 0.5) * 8, y, w, 2.2 + i * 0.5, i % 3 ? F.fuego : F.oro, 's', 0.42 - i * 0.04);
    }
  }
  // La alfombra: de la piedra de Luzbelito hasta quien mira, entre dos líneas que salen del punto de fuga.
  const y0 = 466;
  const [a0, a1] = [404, 506];
  const alfombra = poli([[a0, y0], [a1, y0], [enY(fuga.x + (a1 - fuga.x) * ((fondo - fuga.y) / (y0 - fuga.y)), fondo), fondo], [enY(fuga.x + (a0 - fuga.x) * ((fondo - fuga.y) / (y0 - fuga.y)), fondo), fondo]]);
  const orilla = (u: number): string => {
    const xa = a0 + (a1 - a0) * u;
    const xb = fuga.x + (xa - fuga.x) * ((fondo - fuga.y) / (y0 - fuga.y));
    return `M${f(xa)} ${y0} L${f(xb)} ${fondo}`;
  };
  let arrugas = '';
  for (let i = 0; i < 5; i++) {
    const y = y0 + 24 + i * 30 + rnd() * 12;
    const k = (y - fuga.y) / (y0 - fuga.y);
    arrugas += nube(fuga.x + (rnd() - 0.5) * 40 * k, y, 46 * k * (0.5 + rnd() * 0.5), 2.4 + i * 0.6, F.negro, 's', 0.4);
  }
  const piso = `M-20 ${desde} L${ANCHO + 20} ${desde} L${ANCHO + 20} ${ALTO + 20} L-20 ${ALTO + 20} Z`;
  return enmascarado('sl-damero', piso,
    forma(piso, F.negro) +
    forma(baldosas, F.brasa, 0.88) +
    // Lo lejano del piso se enciende y se empasta: contra la pared las baldosas ya no se cuentan.
    nube(ANCHO / 2, desde + 4, ANCHO * 0.62, 14, F.rojo, 'm', 0.6) +
    nube(ANCHO / 2, desde + 2, ANCHO * 0.5, 6, F.fuego, 's', 0.4) +
    reflejos +
    enmascarado('sl-alfombra', alfombra,
      forma(alfombra, F.rojo) +
      trazo(orilla(0.1), F.oro, 2.6, 0.7) + trazo(orilla(0.9), F.oro, 2.6, 0.7) +
      trazo(orilla(0.16), F.brasa, 1.6, 0.9) + trazo(orilla(0.84), F.brasa, 1.6, 0.9) +
      arrugas +
      nube(fuga.x, y0 + 4, 70, 16, F.negro, 'm', 0.6)) +
    nube(ANCHO / 2, ALTO, ANCHO * 0.7, 120, F.negro, 'xl', 0.7));
}

/** El piso del salón en el camino: el del recinto (`infiernoCerca` en `arte.ts`), con el damero nuevo. */
function pisoDelSalon(): string {
  return (
    `<g filter="url(#rociado)">` +
    soplo(`M-20 336 C300 322, 600 322, ${ANCHO + 20} 336 L${ANCHO + 20} ${ALTO + 20} L-20 ${ALTO + 20} Z`, F.negro, 's') +
    damero(SALON.zocalo) +
    nube(ANCHO / 2, 350, 520, 22, F.brasa, 'l', 0.8) +
    // La puerta del salón, encendida por dentro.
    forma('M140 352 L140 262 Q180 214 220 262 L220 352 Z', F.negro) +
    soplo('M152 352 L152 270 Q180 234 208 270 L208 352 Z', F.brasa, 'xs', 0.95) +
    nube(180, 316, 18, 34, F.fuego, 'm', 0.5) +
    nube(180, 380, 20, 40, F.fuego, 'l', 0.3) +
    // La piedra de Luzbelito: oscura, con el canto rojo del fuego.
    nube(456, 474, 120, 10, F.negro, 's', 0.8) +
    enmascarado('sl-piedra', 'M360 470 Q380 404 452 398 Q530 396 548 470 Z',
      forma('M360 470 Q380 404 452 398 Q530 396 548 470 Z', F.piedra) + nube(430, 408, 70, 12, F.rojo, 'm', 0.6) + nube(500, 460, 70, 30, F.negro, 'm', 0.85)) +
    `</g>`
  );
}

/** Las piezas del salón: las imprime la imprenta con las del camino. */
export const PIEZAS_DEL_SALON: readonly Pieza[] = [
  { nombre: 'camino-infierno-salon', caja: [0, 0, ANCHO, SALON.zocalo + 10], dibujo: salon(), densidad: 2 },
  { nombre: 'camino-infierno-gigante', caja: GIGANTE.caja, dibujo: gigante(), densidad: 1.5, calidad: 70 },
  { nombre: 'camino-infierno-lenguas-a', caja: LENGUAS.caja, dibujo: fila(4031, [50, 220], [16, 40], 0.8), densidad: 1.25, calidad: 62 },
  { nombre: 'camino-infierno-lenguas-b', caja: LENGUAS.caja, dibujo: fila(4049, [20, 100], [13, 30], 0.9), densidad: 1.25, calidad: 62 },
  { nombre: 'camino-infierno-piso', caja: [0, 300, ANCHO, ALTO - 300], dibujo: pisoDelSalon(), densidad: 2 },
];
