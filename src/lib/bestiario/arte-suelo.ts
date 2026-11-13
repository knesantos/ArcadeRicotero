/**
 * Lo que hay tirado en el piso (`D-90`, segunda ronda).
 *
 * El piso de cada camino era liso: una mancha oscura con pastos de crayón. En un teléfono parado,
 * media pantalla de eso. Acá se siembra lo que el piso de cada región tendría que tener: charcos
 * que reflejan la tinta de lo que hay detrás, raíces, piedras, huesos, hielo, chapas, cadenas.
 *
 * No son capas nuevas: se pintan **adentro del piso impreso** de cada camino (`arte-camino.ts`), así
 * no le cuestan nada al teléfono y quedan debajo de los bichos. Todo con el aerógrafo y sus dos
 * gestos: la máscara de papel (el charco, la piedra y la placa de hielo son siluetas duras con el
 * volumen soplado adentro) y el trazo fino.
 *
 * El charco es la pieza: un óvalo aplastado, negro, y adentro lo de atrás dado vuelta, en las tintas
 * de lo lejano de esa región. En el monte, las puntas de las tiras; en la nieve, la luz de la tele;
 * en el muelle, el sodio de los faroles.
 */

import { enmascarado, forma, nube, soplo, trazo } from './aerografo.ts';
import { M, azar } from './arte.ts';

const f = (v: number): string => (Math.round(v * 10) / 10).toString();

type Azar = () => number;

/**
 * Un charco: la silueta dura, el agua negra, y adentro los reflejos, que son lengüetas que bajan
 * desde el borde de atrás (lo de atrás, dado vuelta). El borde de adelante agarra un pelo de luz.
 */
function charco(id: string, x: number, y: number, rx: number, ry: number, rnd: Azar, agua: string, reflejos: readonly string[], brillo: string, como: 'puntas' | 'rayas' = 'puntas', reflejados = 0): string {
  // Un óvalo que no es de compás: cuatro curvas con el radio movido.
  const k = (): number => 0.86 + rnd() * 0.28;
  const [a, b, c, d] = [k(), k(), k(), k()];
  const silueta =
    `M${f(x - rx * a)} ${f(y)} C${f(x - rx * a)} ${f(y - ry * b * 0.9)} ${f(x - rx * 0.4)} ${f(y - ry * b)} ${f(x + rx * 0.1)} ${f(y - ry * b)} ` +
    `C${f(x + rx * 0.7)} ${f(y - ry * b)} ${f(x + rx * c)} ${f(y - ry * 0.6)} ${f(x + rx * c)} ${f(y + ry * 0.1)} ` +
    `C${f(x + rx * c)} ${f(y + ry * d)} ${f(x + rx * 0.3)} ${f(y + ry * d)} ${f(x - rx * 0.2)} ${f(y + ry * d)} ` +
    `C${f(x - rx * 0.7)} ${f(y + ry * d)} ${f(x - rx * a)} ${f(y + ry * 0.7)} ${f(x - rx * a)} ${f(y)} Z`;
  let adentro = forma(silueta, agua);
  const cuantos = reflejados || 3 + Math.floor(rnd() * 4);
  for (let i = 0; i < cuantos; i++) {
    const lx = x - rx * 0.75 + ((i + rnd() * 0.7) / cuantos) * rx * 1.5;
    const ancho = rx * (0.07 + rnd() * 0.1);
    const largo = ry * (0.9 + rnd() * 1.0);
    const color = reflejos[Math.floor(rnd() * reflejos.length)]!;
    // La lengüeta: ancha contra el borde de atrás, en punta para adelante, y un poco movida por el agua.
    const corre = (rnd() - 0.5) * ancho;
    const o = 0.5 + rnd() * 0.35;
    // En el monte se reflejan las puntas de las tiras; donde lo que hay atrás son luces, rayas finas
    // que bajan temblando, como se ve un farol en el agua.
    if (como === 'puntas') {
      // El reflejo de una tira (`D-90`, quinta ronda): **roto**. Antes era un triángulo limpio de punta
      // abajo, y varios en fila eran una guirnalda de cumpleaños. El agua no devuelve la forma: devuelve
      // pedazos. Tres o cuatro manchas acostadas, cada vez más angostas y más corridas, que arrancan
      // contra el canto de atrás (ahí las corta la máscara) y no llegan a la mitad del charco.
      const pedazos = 3 + Math.floor(rnd() * 2);
      for (let k = 0; k < pedazos; k++) {
        const u = k / pedazos;
        const w = ancho * (1.5 - u * 1.15) * (0.7 + rnd() * 0.5);
        const yy = y - ry * 1.05 + u * Math.min(largo, ry * 1.25) + (rnd() - 0.5) * ry * 0.12;
        const xx = lx + corre * u + (rnd() - 0.5) * ancho * 0.9;
        adentro += nube(xx, yy, Math.max(1.6, w), Math.max(0.9, ry * 0.11), color, 'xs', o * (0.75 - u * 0.4));
      }
    } else {
      for (let k = 0; k < 4; k++) {
        const yy = y - ry * 0.8 + k * ry * 0.42;
        adentro += trazo(`M${f(lx - ancho * (0.9 - k * 0.15) + (rnd() - 0.5) * 2)} ${f(yy)} l${f(ancho * (1.8 - k * 0.3))} 0`, color, Math.max(0.9, ry * 0.16), o * (1 - k * 0.18));
      }
    }
  }
  return (
    // La tierra mojada alrededor, apenas más oscura.
    nube(x, y + ry * 0.2, rx * 1.15, ry * 1.5, agua, 's', 0.45) +
    enmascarado(id, silueta, adentro) +
    trazo(`M${f(x - rx * 0.55)} ${f(y + ry * d * 0.92)} Q${f(x)} ${f(y + ry * d * 1.08)} ${f(x + rx * 0.5)} ${f(y + ry * d * 0.86)}`, brillo, 1.1, 0.5)
  );
}

/**
 * El asiento (`D-90`, cuarta ronda): lo tirado en el piso flotaba como una figurita pegada. Tres cosas
 * lo apoyan, y las tres son dibujo de aerógrafo: la **mancha húmeda** donde toca el suelo, la
 * **tierra que lo tapa** por abajo (está un poco enterrado, no posado), y la **distancia**: lo de
 * atrás se apaga hacia la tinta del piso. `hondura` va de 0 (lejos) a 1 (cerca); `cx` y `ancho`, el
 * medio y lo que mide el objeto.
 */
function asentar(dibujo: string, cx: number, y: number, ancho: number, hondura: number, tierra: string, mancha: string): string {
  const w = Math.max(10, ancho);
  return (
    nube(cx, y + 1.5, w * 0.66, Math.max(2.4, w * 0.075), mancha, 's', 0.8) +
    `<g opacity="${f(0.5 + 0.5 * hondura)}">${dibujo}</g>` +
    nube(cx, y + 2.6, w * 0.52, Math.max(2, w * 0.05), tierra, 'xs', 0.92)
  );
}

/** Acostado: lo que está tirado se ve de arriba y en escorzo, no de frente como un cartel. */
const acostado = (dibujo: string, x: number, y: number, k = 0.6, sesgo = 0): string =>
  `<g transform="translate(${f(x)} ${f(y)})${sesgo ? ` skewX(${sesgo})` : ''} scale(1 ${k}) translate(${f(-x)} ${f(-y)})">${dibujo}</g>`;

/** Una piedra: la silueta dura, la luz arriba y la panza en sombra, y su mancha en el piso. */
function piedra(id: string, x: number, y: number, w: number, rnd: Azar, cuerpo: string, luz: string, sombra: string): string {
  const h = w * (0.45 + rnd() * 0.25);
  const d =
    `M${f(x - w / 2)} ${f(y)} L${f(x - w * 0.42)} ${f(y - h * 0.6)} L${f(x - w * (0.1 + rnd() * 0.15))} ${f(y - h)} ` +
    `L${f(x + w * (0.15 + rnd() * 0.15))} ${f(y - h * 0.85)} L${f(x + w * 0.46)} ${f(y - h * 0.35)} L${f(x + w / 2)} ${f(y)} Z`;
  return (
    nube(x + w * 0.1, y + 1, w * 0.62, h * 0.22, sombra, 's', 0.7) +
    enmascarado(id, d, forma(d, cuerpo) + nube(x - w * 0.12, y - h * 0.95, w * 0.3, h * 0.3, luz, 's', 0.8) + nube(x + w * 0.2, y - h * 0.1, w * 0.5, h * 0.45, sombra, 's', 0.85))
  );
}

/* ------------------------------------------------------------------
   El monte (y la pastura)
   ------------------------------------------------------------------ */

/** Una raíz que sale del piso, cruza y se vuelve a meter: el lomo oscuro y un pelo de luz arriba. */
function raiz(x: number, y: number, largo: number, rnd: Azar, gorda = 1): string {
  const sube = 5 + rnd() * 9;
  const d = `M${f(x)} ${f(y)} C${f(x + largo * 0.25)} ${f(y - sube * 1.6)} ${f(x + largo * 0.45)} ${f(y + sube * 0.5)} ${f(x + largo * 0.62)} ${f(y - sube)} S${f(x + largo * 0.9)} ${f(y + 2)} ${f(x + largo)} ${f(y + 3)}`;
  return (
    nube(x + largo / 2, y + 3, largo * 0.5, 4, M.negro, 's', 0.6) +
    trazo(d, M.negro, (5.5 + rnd() * 3) * gorda) +
    `<g transform="translate(0 ${f(-1.6 * gorda)})">${trazo(d, M.hondo, 1.3 * gorda, 0.6)}</g>`
  );
}

/** Un costillar a medio enterrar: lo que dejó el lobo. Cinco costillas que salen de la tierra y el espinazo. */
function costillar(x: number, y: number, rnd: Azar): string {
  const hueso = M.claro;
  let s = nube(x + 22, y + 3, 34, 5, M.negro, 's', 0.7) + trazo(`M${f(x)} ${f(y)} Q${f(x + 22)} ${f(y - 5)} ${f(x + 46)} ${f(y - 1)}`, hueso, 2.4, 0.75);
  for (let i = 0; i < 5; i++) {
    const cx = x + 5 + i * 9;
    const alto = 12 + rnd() * 6 - Math.abs(i - 2) * 2;
    s += trazo(`M${f(cx)} ${f(y - 1.5)} Q${f(cx + 7)} ${f(y - alto)} ${f(cx + 4)} ${f(y - alto - 5)}`, hueso, 1.9, 0.7);
  }
  return s;
}

/** Una tira del monte caída: la misma hoja de sierra, acostada en el piso. */
function hojaCaida(x: number, y: number, largo: number, rnd: Azar): string {
  let d = `M${f(x)} ${f(y)} L${f(x + largo)} ${f(y - 2 - rnd() * 3)}`;
  const dientes = Math.round(largo / 7);
  for (let i = dientes; i >= 0; i--) {
    const px = x + (largo * i) / dientes;
    d += ` L${f(px + 2)} ${f(y + 5.5)} L${f(px - 1.5)} ${f(y + 2.5)}`;
  }
  return forma(`${d} Z`, M.sombra, 0.85) + trazo(`M${f(x + 2)} ${f(y - 0.5)} L${f(x + largo - 2)} ${f(y - 3)}`, M.medio, 1, 0.5);
}

/**
 * Lo tirado en el piso del monte, entre `desde` y `hasta`: charcos que reflejan las tiras de atrás,
 * raíces, piedras, tiras caídas y, cada mucho, un costillar.
 */
/**
 * Un claro con peso (tercera ronda): lo suelto y parejo no llenaba el medio del piso. Un charco
 * grande, que refleja media docena de tiras; una raíz gorda que lo cruza por atrás y se le mete
 * adentro; dos piedras contra el borde, y del otro lado lo que quedó de alguien.
 */
function claroDelMonte(id: string, x: number, y: number, rnd: Azar): string {
  const rx = 120 + rnd() * 40;
  const ry = 20 + rnd() * 6;
  return (
    raiz(x - rx * 1.25, y - ry * 0.9, rx * 1.5, rnd, 2.1) +
    charco(`${id}-ch`, x, y, rx, ry, rnd, M.negro, [M.hondo, M.sombra, M.hondo, M.medio, M.sombra], M.medio, 'puntas', 6) +
    piedra(`${id}-p1`, x - rx * 0.9, y + ry * 0.7, 40 + rnd() * 12, rnd, M.hondo, M.medio, M.negro) +
    piedra(`${id}-p2`, x - rx * 0.62, y + ry * 1.05, 24 + rnd() * 8, rnd, M.hondo, M.medio, M.negro) +
    asentar(
      `<g transform="translate(${f(x + rx * 0.7)} ${f(y + ry * 1.5)}) skewX(-14) scale(1.5 1.2) translate(${f(-(x + rx * 0.7))} ${f(-(y + ry * 1.5))})">${costillar(x + rx * 0.7, y + ry * 1.5, rnd)}</g>`,
      x + rx * 0.7 + 30, y + ry * 1.5, 80, 0.9, M.oscuro, M.negro,
    ) +
    asentar(acostado(hojaCaida(x + rx * 0.2, y + ry * 1.9, 60 + rnd() * 20, rnd), x + rx * 0.2, y + ry * 1.9), x + rx * 0.2 + 35, y + ry * 1.9, 70, 0.95, M.oscuro, M.negro)
  );
}

export function sueloDelMonte(desde: number, hasta: number, semilla: number): string {
  const rnd = azar(semilla);
  let s = '';
  let n = 0;
  // Tres claros a lo largo, en el medio del piso (arriba de la picada), cada uno a su altura.
  [0.17, 0.5, 0.82].forEach((u, i) => {
    s += claroDelMonte(`sm-cl-${i}`, desde + (hasta - desde) * (u + (rnd() - 0.5) * 0.06), 392 + rnd() * 50, rnd);
  });
  // De atrás para adelante, así lo de más cerca tapa a lo de más lejos. Lo de atrás es más chico.
  for (let x = desde + 40 + rnd() * 60; x < hasta - 60; x += 38 + rnd() * 62) {
    const hondura = rnd();
    const y = 348 + hondura * 255;
    const escala = 0.7 + hondura * 1.0;
    const que = rnd();
    // Cada cosa, apoyada: su mancha, la tierra que la tapa por abajo, y más apagada cuanto más lejos.
    const apoya = (dibujo: string, cx: number, w: number): string => asentar(dibujo, cx, y, w, hondura, M.oscuro, M.negro);
    if (que < 0.24) s += `<g opacity="${f(0.55 + 0.45 * hondura)}">${charco(`sm-ch-${n}`, x, y, (38 + rnd() * 50) * escala, (6 + rnd() * 6) * escala, rnd, M.negro, [M.hondo, M.sombra, M.hondo, M.medio], M.hondo)}</g>`;
    else if (que < 0.46) {
      const largo = (50 + rnd() * 70) * escala;
      s += apoya(raiz(x, y, largo, rnd), x + largo / 2, largo);
    } else if (que < 0.72) {
      const w = (14 + rnd() * 22) * escala;
      s += apoya(piedra(`sm-pi-${n}`, x, y, w, rnd, M.hondo, M.medio, M.negro), x, w);
    } else if (que < 0.93) {
      const largo = (26 + rnd() * 30) * escala;
      s += apoya(acostado(hojaCaida(x, y, largo, rnd), x, y), x + largo / 2, largo);
    } else s += apoya(`<g transform="translate(${f(x)} ${f(y)}) skewX(-14) scale(${f(escala)} ${f(escala * 0.8)}) translate(${f(-x)} ${f(-y)})">${costillar(x, y, rnd)}</g>`, x + 23 * escala, 50 * escala);
    n++;
  }
  return s;
}

/* ------------------------------------------------------------------
   Cybersiberia
   ------------------------------------------------------------------ */

const C = {
  hondo: 'var(--entorno-cyber-acero-hondo)',
  acero: 'var(--entorno-cyber-acero)',
  claro: 'var(--entorno-cyber-acero-claro)',
  nieve: 'var(--entorno-cyber-nieve)',
  lente: 'var(--entorno-cyber-lente)',
  vidrio: 'var(--entorno-cyber-vidrio)',
  rojo: 'var(--marca-rojo)',
};

/** Una chapa remachada a medio tapar por la nieve, torcida. */
function chapa(x: number, y: number, w: number, rnd: Azar): string {
  const giro = -14 + rnd() * 28;
  const h = w * 0.32;
  let s = forma(`M${f(x)} ${f(y)} L${f(x + w)} ${f(y - 3)} L${f(x + w * 0.94)} ${f(y - h)} L${f(x + w * 0.08)} ${f(y - h * 0.9)} Z`, C.acero) +
    trazo(`M${f(x + w * 0.08)} ${f(y - h * 0.9)} L${f(x + w * 0.94)} ${f(y - h)}`, C.claro, 1.2, 0.8);
  for (let i = 0; i < 3; i++) s += `<circle cx="${f(x + w * (0.2 + i * 0.3))}" cy="${f(y - h * 0.55)}" r="${f(Math.max(1, w * 0.03))}" fill="${C.hondo}"/>`;
  // La nieve que la tapa por delante.
  s += nube(x + w / 2, y + 1, w * 0.62, h * 0.4, C.nieve, 's', 0.9);
  return `<g transform="rotate(${f(giro)} ${f(x + w / 2)} ${f(y)})">${nube(x + w / 2, y + 2, w * 0.6, 4, C.acero, 's', 0.6)}${s}</g>`;
}

/** Un cable que asoma de la nieve y se vuelve a hundir. */
function cable(x: number, y: number, largo: number, rnd: Azar): string {
  const d = `M${f(x)} ${f(y)} Q${f(x + largo * 0.3)} ${f(y - 8 - rnd() * 8)} ${f(x + largo * 0.55)} ${f(y - 2)} T${f(x + largo)} ${f(y + 2)}`;
  return `<g transform="translate(2 2)">${trazo(d, C.acero, 3, 0.5)}</g>` + trazo(d, C.hondo, 2.4);
}

/** Lo tirado en la nieve: placas de hielo que reflejan la tele y la luz roja, chapas, cables y cascotes de hielo. */
export function sueloDeCybersiberia(ancho: number): string {
  const rnd = azar(2203);
  let s = '';
  let n = 0;
  for (let x = 40 + rnd() * 60; x < ancho - 60; x += 42 + rnd() * 66) {
    const hondura = rnd();
    const y = 368 + hondura * 240;
    const escala = 0.7 + hondura * 1.0;
    const que = rnd();
    if (que < 0.3) s += charco(`sc-ch-${n}`, x, y, (40 + rnd() * 50) * escala, (6 + rnd() * 6) * escala, rnd, C.acero, [C.lente, C.claro, C.nieve, n % 4 === 0 ? C.rojo : C.vidrio], C.nieve, 'rayas');
    else if (que < 0.5) {
      const w = (34 + rnd() * 30) * escala;
      s += asentar(chapa(x, y, w, rnd), x + w / 2, y, w, hondura, C.nieve, C.acero);
    } else if (que < 0.72) {
      const largo = (50 + rnd() * 60) * escala;
      s += asentar(cable(x, y, largo, rnd), x + largo / 2, y, largo, hondura, C.nieve, C.acero);
    } else {
      const w = (12 + rnd() * 18) * escala;
      s += asentar(piedra(`sc-pi-${n}`, x, y, w, rnd, C.nieve, C.nieve, C.acero), x, y, w, hondura, C.nieve, C.acero);
    }
    n++;
  }
  return s;
}

/* ------------------------------------------------------------------
   Los astilleros
   ------------------------------------------------------------------ */

const T = {
  noche: 'var(--entorno-astillero-noche)',
  tiza: 'var(--entorno-astillero-tiza)',
  azul: 'var(--entorno-astillero-azul)',
  clara: 'var(--entorno-astillero-tiza-clara)',
  sodio: 'var(--disco-cordero-atado-tinta)',
  negro: 'var(--fondo)',
};

/** Un tramo de cadena tirado en los tablones. */
function cadenaTirada(x: number, y: number, largo: number, rnd: Azar): string {
  let s = '';
  const pasos = Math.round(largo / 8);
  const onda = 3 + rnd() * 5;
  for (let i = 0; i <= pasos; i++) {
    const px = x + i * 8;
    const py = y + Math.sin(i * 0.7 + x) * onda;
    s += `<ellipse cx="${f(px)}" cy="${f(py)}" rx="${i % 2 ? 4.6 : 2.2}" ry="${i % 2 ? 1.8 : 3}" fill="none" stroke="${T.negro}" stroke-width="2"/>`;
    if (i % 4 === 1) s += `<ellipse cx="${f(px - 0.6)}" cy="${f(py - 0.8)}" rx="3.6" ry="1" fill="none" stroke="${T.sodio}" stroke-width="0.8" opacity="0.6"/>`;
  }
  return nube(x + largo / 2, y + 3, largo * 0.55, 4, T.negro, 's', 0.6) + s;
}

/** Una mancha de aceite: anillos finos, uno adentro del otro, que agarran el sodio y la tiza. */
function aceite(x: number, y: number, rx: number, rnd: Azar): string {
  const ry = rx * 0.2;
  let s = nube(x, y, rx, ry, T.negro, 's', 0.8);
  [T.sodio, T.clara, T.tiza].forEach((color, i) => {
    const k = 0.82 - i * 0.24;
    s += `<ellipse cx="${f(x + (rnd() - 0.5) * 4)}" cy="${f(y)}" rx="${f(rx * k)}" ry="${f(ry * k)}" fill="none" stroke="${color}" stroke-width="0.9" opacity="${f(0.3 + rnd() * 0.25)}"/>`;
  });
  return s;
}

/** Un tablón suelto, cruzado. */
function tablon(x: number, y: number, largo: number, rnd: Azar): string {
  const giro = -18 + rnd() * 36;
  return (
    `<g transform="rotate(${f(giro)} ${f(x + largo / 2)} ${f(y)})">` +
    nube(x + largo / 2, y + 3, largo * 0.55, 4, T.negro, 's', 0.7) +
    forma(`M${f(x)} ${f(y)} L${f(x + largo)} ${f(y - 1)} L${f(x + largo - 2)} ${f(y - 6)} L${f(x + 3)} ${f(y - 5)} Z`, T.noche) +
    trazo(`M${f(x + 3)} ${f(y - 5)} L${f(x + largo - 2)} ${f(y - 6)}`, T.azul, 1, 0.8) +
    `</g>`
  );
}

/** Lo tirado en el muelle, del canto para abajo: charcos que reflejan el sodio, cadenas, aceite y tablones. */
export function sueloDeLosAstilleros(ancho: number, muelle: number): string {
  const rnd = azar(3301);
  let s = '';
  let n = 0;
  for (let x = 40 + rnd() * 60; x < ancho - 60; x += 40 + rnd() * 64) {
    const hondura = rnd();
    const y = muelle + 26 + hondura * (606 - muelle - 26);
    const escala = 0.75 + hondura * 0.95;
    const que = rnd();
    if (que < 0.38) s += charco(`sa-ch-${n}`, x, y, (40 + rnd() * 55) * escala, (6 + rnd() * 6) * escala, rnd, T.noche, [T.sodio, T.sodio, T.clara, T.azul], T.clara, 'rayas');
    else if (que < 0.6) {
      const largo = (40 + rnd() * 50) * escala;
      s += asentar(acostado(cadenaTirada(x, y, largo, rnd), x, y, 0.7), x + largo / 2, y, largo, hondura, T.negro, T.negro);
    } else if (que < 0.8) s += `<g opacity="${f(0.55 + 0.45 * hondura)}">${aceite(x, y, (22 + rnd() * 26) * escala, rnd)}</g>`;
    else {
      const largo = (44 + rnd() * 40) * escala;
      s += asentar(acostado(tablon(x, y, largo, rnd), x, y, 0.7), x + largo / 2, y, largo, hondura, T.negro, T.negro);
    }
    n++;
  }
  return s;
}

/* ------------------------------------------------------------------
   La ruta
   ------------------------------------------------------------------ */

const RU = { negro: 'var(--fondo)', noche: 'var(--entorno-astillero-noche)', papel: 'var(--papel)', tenue: 'var(--papel-tenue)', topo: 'var(--disco-luzbelito-apoyo)', vivo: 'var(--marca-rojo)' };

/** Una lata aplastada en la banquina. */
function lata(x: number, y: number, rnd: Azar): string {
  const giro = -30 + rnd() * 60;
  return (
    `<g transform="rotate(${f(giro)} ${f(x)} ${f(y)})">` + nube(x + 2, y + 4, 12, 3, RU.negro, 's', 0.8) +
    forma(`M${f(x - 9)} ${f(y - 4)} L${f(x + 8)} ${f(y - 5)} L${f(x + 10)} ${f(y + 3)} L${f(x - 8)} ${f(y + 4)} Z`, RU.topo) +
    forma(`M${f(x - 2)} ${f(y - 4.6)} L${f(x + 3)} ${f(y - 4.8)} L${f(x + 4)} ${f(y + 3.4)} L${f(x - 1)} ${f(y + 3.6)} Z`, RU.vivo, 0.8) +
    trazo(`M${f(x - 9)} ${f(y - 4)} L${f(x + 8)} ${f(y - 5)}`, RU.tenue, 0.9, 0.7) + `</g>`
  );
}

/** Lo tirado en la banquina de abajo: charcos que reflejan las estrellas, latas, piedras y algún parche de brea. */
export function sueloDeLaRuta(ancho: number, desde: number): string {
  const rnd = azar(5501);
  let s = '';
  let n = 0;
  for (let x = 40 + rnd() * 60; x < ancho - 60; x += 46 + rnd() * 70) {
    const hondura = rnd();
    const y = desde + hondura * (612 - desde);
    const escala = 0.8 + hondura * 0.7;
    const que = rnd();
    if (que < 0.34) s += charco(`sr-ch-${n}`, x, y, (36 + rnd() * 46) * escala, (5 + rnd() * 4) * escala, rnd, RU.noche, [RU.papel, RU.tenue, RU.papel], RU.tenue, 'rayas');
    else if (que < 0.58) s += asentar(lata(x, y, rnd), x, y, 22, hondura, RU.negro, RU.negro);
    else if (que < 0.84) {
      const w = (10 + rnd() * 16) * escala;
      s += asentar(piedra(`sr-pi-${n}`, x, y, w, rnd, RU.topo, RU.tenue, RU.negro), x, y, w, hondura, RU.negro, RU.negro);
    }
    else s += nube(x, y, (24 + rnd() * 20) * escala, 4 * escala, RU.negro, 's', 0.85);
    n++;
  }
  return s;
}

/* ------------------------------------------------------------------
   El árbol, la mesa y el galpón (sexta ronda), cada uno con la mano de su tapa
   ------------------------------------------------------------------ */

const AR = { claro: 'var(--entorno-arbol-marmol-claro)', marmol: 'var(--entorno-arbol-marmol)', hondo: 'var(--entorno-arbol-marmol-hondo)', cobre: 'var(--entorno-arbol-cobre)', cobreHondo: 'var(--entorno-arbol-cobre-hondo)', veta: 'var(--entorno-arbol-veta)', tierra: 'var(--entorno-arbol-tierra)', honda: 'var(--entorno-arbol-tierra-honda)', viva: 'var(--entorno-arbol-tierra-viva)' };

/** Una hoja del árbol caída: una almendra con su nervio. */
function hojaDelArbol(x: number, y: number, largo: number, giro: number, color: string): string {
  const d = `M${f(x - largo / 2)} ${f(y)} Q${f(x)} ${f(y - largo * 0.36)} ${f(x + largo / 2)} ${f(y)} Q${f(x)} ${f(y + largo * 0.3)} ${f(x - largo / 2)} ${f(y)} Z`;
  return `<g transform="rotate(${f(giro)} ${f(x)} ${f(y)})">${forma(d, color)}${trazo(`M${f(x - largo * 0.4)} ${f(y)} L${f(x + largo * 0.4)} ${f(y)}`, AR.veta, 0.7, 0.5)}</g>`;
}

/**
 * Lo tirado en la llanura del árbol: las hojas que se le cayeron (en montoncitos, no una por una),
 * raíces que asoman, algún fruto podrido y piedras de mármol. Aerógrafo, como la tapa. No se pinta
 * nada contra el pie del tronco (`tronco`, en x), que es donde se apoyan los que viven en él.
 */
export function sueloDelArbol(ancho: number, tronco: number): string {
  const rnd = azar(7703);
  let s = '';
  let n = 0;
  for (let x = 50 + rnd() * 60; x < ancho - 60; x += 46 + rnd() * 70) {
    if (Math.abs(x - tronco) < 110) continue;
    const hondura = rnd();
    // El horizonte de la llanura está en 452: de ahí para abajo.
    const y = 464 + hondura * 144;
    const escala = 0.7 + hondura * 0.9;
    const que = rnd();
    if (que < 0.45) {
      // Un montoncito de hojas.
      let monton = '';
      const cuantas = 3 + Math.floor(rnd() * 5);
      for (let k = 0; k < cuantas; k++) monton += hojaDelArbol(x + (rnd() - 0.5) * 34 * escala, y + (rnd() - 0.5) * 9 * escala, (9 + rnd() * 9) * escala, rnd() * 180, [AR.cobre, AR.claro, AR.cobreHondo, AR.marmol][k % 4]!);
      s += asentar(acostado(monton, x, y, 0.62), x, y, 44 * escala, hondura, AR.honda, AR.honda);
    } else if (que < 0.66) {
      const largo = (50 + rnd() * 60) * escala;
      const sube = 5 + rnd() * 8;
      const d = `M${f(x)} ${f(y)} C${f(x + largo * 0.25)} ${f(y - sube * 1.6)} ${f(x + largo * 0.45)} ${f(y + sube * 0.5)} ${f(x + largo * 0.62)} ${f(y - sube)} S${f(x + largo * 0.9)} ${f(y + 2)} ${f(x + largo)} ${f(y + 3)}`;
      s += asentar(trazo(d, AR.hondo, 5 + rnd() * 3) + `<g transform="translate(0 -1.5)">${trazo(d, AR.claro, 1.2, 0.6)}</g>`, x + largo / 2, y, largo, hondura, AR.honda, AR.honda);
    } else if (que < 0.82) {
      // Un fruto caído, con la mancha de lo que soltó.
      const r = (5 + rnd() * 4) * escala;
      s += asentar(nube(x + r, y + 1, r * 1.6, r * 0.5, AR.viva, 's', 0.6) + `<circle cx="${f(x)}" cy="${f(y - r * 0.7)}" r="${f(r)}" fill="${AR.viva}"/>` + nube(x - r * 0.3, y - r * 1.1, r * 0.4, r * 0.3, AR.veta, 'xs', 0.6), x, y, r * 2.6, hondura, AR.honda, AR.honda);
    } else {
      const w = (14 + rnd() * 18) * escala;
      s += asentar(piedra(`sb-pi-${n}`, x, y, w, rnd, AR.marmol, AR.claro, AR.honda), x, y, w, hondura, AR.honda, AR.honda);
    }
    n++;
  }
  return s;
}

const ME = { papel: 'var(--entorno-mesa-papel)', sepia: 'var(--entorno-mesa-sepia)', clara: 'var(--entorno-mesa-sepia-clara)', honda: 'var(--entorno-mesa-sepia-honda)', rojo: 'var(--entorno-mesa-rojo)', negro: 'var(--fondo)' };

/**
 * Lo que se cayó de la mesa, abajo del mantel. La tapa es un afiche: **tinta plana**, sin un soplo.
 * Migas, una cuchara, un corcho, una servilleta hecha un bollo, y la fila de hormigas que va para la
 * miel. De `desde` para abajo.
 */
export function sueloDeLaMesa(ancho: number, desde: number): string {
  const rnd = azar(8803);
  let s = '';
  for (let x = 40 + rnd() * 70; x < ancho - 50; x += 54 + rnd() * 84) {
    const y = desde + rnd() * (608 - desde);
    const que = rnd();
    if (que < 0.34) {
      // Migas: un puñado de puntos.
      for (let k = 0; k < 9; k++) s += `<circle cx="${f(x + (rnd() - 0.5) * 40)}" cy="${f(y + (rnd() - 0.5) * 9)}" r="${f(0.9 + rnd() * 1.5)}" fill="${k % 3 ? ME.clara : ME.papel}" opacity="${f(0.6 + rnd() * 0.3)}"/>`;
    } else if (que < 0.52) {
      // La cuchara.
      const giro = -25 + rnd() * 50;
      s += `<g transform="rotate(${f(giro)} ${f(x)} ${f(y)})"><ellipse cx="${f(x)}" cy="${f(y)}" rx="7" ry="3.6" fill="${ME.clara}"/><ellipse cx="${f(x + 0.8)}" cy="${f(y + 0.3)}" rx="4.4" ry="1.9" fill="${ME.honda}"/>${trazo(`M${f(x + 6.5)} ${f(y)} l22 1`, ME.clara, 2.2)}</g>`;
    } else if (que < 0.68) {
      // Un corcho, con su marca de vino.
      s += forma(`M${f(x - 5)} ${f(y - 3.4)} L${f(x + 5)} ${f(y - 4)} L${f(x + 5.6)} ${f(y + 3)} L${f(x - 4.6)} ${f(y + 3.6)} Z`, ME.sepia) + forma(`M${f(x + 2.4)} ${f(y - 3.8)} L${f(x + 5)} ${f(y - 4)} L${f(x + 5.6)} ${f(y + 3)} L${f(x + 3)} ${f(y + 3.2)} Z`, ME.rojo, 0.8);
    } else if (que < 0.84) {
      // La servilleta, hecha un bollo: un polígono con sus dobleces.
      const w = 14 + rnd() * 8;
      s += forma(`M${f(x - w)} ${f(y + 3)} L${f(x - w * 0.6)} ${f(y - 6)} L${f(x - w * 0.1)} ${f(y - 3)} L${f(x + w * 0.4)} ${f(y - 8)} L${f(x + w)} ${f(y - 1)} L${f(x + w * 0.5)} ${f(y + 5)} L${f(x - w * 0.2)} ${f(y + 3)} Z`, ME.papel) + trazo(`M${f(x - w * 0.1)} ${f(y - 3)} l${f(w * 0.3)} ${f(7)} M${f(x + w * 0.4)} ${f(y - 8)} l${f(-w * 0.2)} 6`, ME.sepia, 1, 0.8);
    } else {
      // Las hormigas, en fila.
      for (let k = 0; k < 7; k++) {
        const hx = x + k * 9;
        const hy = y + Math.sin(k * 0.9) * 2.4;
        s += `<ellipse cx="${f(hx)}" cy="${f(hy)}" rx="2.6" ry="1.2" fill="${ME.clara}" opacity="0.85"/><circle cx="${f(hx + 3)}" cy="${f(hy - 0.2)}" r="1" fill="${ME.clara}" opacity="0.85"/>`;
      }
    }
  }
  return s;
}

const GA = { luz: 'var(--entorno-galpon-luz)', rojo: 'var(--entorno-galpon-rojo)', brasa: 'var(--entorno-galpon-brasa)', noche: 'var(--entorno-galpon-noche)', negro: 'var(--fondo)' };

/**
 * Lo que quedó en el tablado del galpón, contra el borde: los cables, la lista de temas pegada con
 * cinta, una púa, un vaso. Tinta plana, en la mano de la trama de *En directo*. `ocupado`: dónde no
 * se pinta, porque ahí hay algo parado (la silla, la mesita, la bestia pop).
 */
export function sueloDelGalpon(ancho: number, borde: number, ocupado: readonly number[]): string {
  const rnd = azar(9901);
  let s = '';
  let lista = -900;
  for (let x = 60 + rnd() * 80; x < ancho - 60; x += 70 + rnd() * 110) {
    if (ocupado.some((o) => Math.abs(x - o) < 120)) continue;
    const y = borde - 6 - rnd() * 44;
    const que = rnd();
    if (que < 0.4) {
      // Un cable que cruza, con su ficha.
      const largo = 70 + rnd() * 90;
      const d = `M${f(x)} ${f(y)} C${f(x + largo * 0.3)} ${f(y - 12)} ${f(x + largo * 0.5)} ${f(y + 10)} ${f(x + largo)} ${f(y - 2)}`;
      s += trazo(d, GA.negro, 2.6) + `<g transform="translate(0 -1)">${trazo(d, GA.brasa, 0.8, 0.8)}</g>` + forma(`M${f(x - 7)} ${f(y - 2.6)} L${f(x)} ${f(y - 2.6)} L${f(x)} ${f(y + 2.6)} L${f(x - 7)} ${f(y + 2.6)} Z`, GA.luz, 0.8);
    } else if (que < 0.62 && x - lista > 1100) {
      // La lista de temas: una hoja en escorzo, con renglones, pegada con una cinta roja. Una cada
      // tanto: es la lista del show, no un volanteo.
      lista = x;
      const giro = -12 + rnd() * 24;
      let renglones = '';
      for (let k = 0; k < 5; k++) renglones += trazo(`M${f(x - 9)} ${f(y - 5 + k * 2.4)} l${f(10 + rnd() * 8)} 0`, GA.noche, 0.8, 0.8);
      s += `<g transform="rotate(${f(giro)} ${f(x)} ${f(y)})">` + forma(`M${f(x - 13)} ${f(y - 8)} L${f(x + 12)} ${f(y - 8)} L${f(x + 15)} ${f(y + 7)} L${f(x - 16)} ${f(y + 7)} Z`, GA.luz) + renglones + forma(`M${f(x - 6)} ${f(y - 10)} L${f(x + 6)} ${f(y - 10)} L${f(x + 6)} ${f(y - 6.6)} L${f(x - 6)} ${f(y - 6.6)} Z`, GA.rojo) + `</g>`;
    } else if (que < 0.8) {
      // Una púa.
      s += forma(`M${f(x - 4)} ${f(y - 2)} Q${f(x)} ${f(y - 4)} ${f(x + 4)} ${f(y - 2)} L${f(x)} ${f(y + 3)} Z`, GA.rojo);
    } else {
      // Un vaso de plástico, volcado.
      s += forma(`M${f(x - 9)} ${f(y - 4)} L${f(x + 8)} ${f(y - 3)} L${f(x + 8)} ${f(y + 3)} L${f(x - 9)} ${f(y + 5)} Z`, GA.luz, 0.85) + `<ellipse cx="${f(x - 9)}" cy="${f(y + 0.5)}" rx="1.6" ry="4.6" fill="${GA.noche}"/>` + forma(`M${f(x + 8)} ${f(y - 3)} L${f(x + 22)} ${f(y - 1)} L${f(x + 20)} ${f(y + 3)} L${f(x + 8)} ${f(y + 3)} Z`, GA.brasa, 0.6);
    }
  }
  return s;
}
