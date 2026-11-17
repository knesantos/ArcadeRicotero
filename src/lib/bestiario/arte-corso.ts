/**
 * La nave del templo de Momo (`D-91`, tanda 4): el 40 % de abajo, que era negro liso.
 *
 * El templo (`temploLejos`: las cuatro columnas, la guirnalda, las serpentinas, el papel picado) y todos
 * los que viven ahí son de `arte.ts` y `escenas.ts`, y acá no se editan: otra sesión los está tocando
 * (`T-529`). Lo que el camino pinta por su cuenta entra justo después del telón (`EN_EL_RECINTO`, en
 * `escenas-camino.ts`), debajo de todos los bichos:
 *
 * - **El piso que se va** (`corsoNave`): un damero de baldosas en escorzo, apenas más claras que lo
 *   negro, que fuga a una puerta del fondo. De la puerta sale **una lengua de luz** que cruza el piso
 *   hasta acá: es el punto de fuga y es lo que brilla al fondo.
 * - **Las columnas de atrás**: dos filas que se achican hacia la puerta, con su espiral cada vez más chico.
 *   Las cuatro del recinto quedan como el primer plano.
 * - **Los cabezudos**: las cabezas de cartón de la murga, guardadas en lo oscuro arriba de su palo, entre
 *   las columnas. Les pega la guirnalda de arriba y nada más.
 * - **Lo pisado**: serpentina aplastada y papel picado a media distancia, más chico cuanto más lejos.
 * - **El que mira** (`OJOS`): si te quedás quieto, al cabezudo de la entrada se le prenden los ojos.
 *
 * Es aerógrafo con grano, en el negro, la plata y el peltre de *Momo Sampler*, con el foco del galpón.
 * Los cabezudos son invento: ninguna letra los nombra. Son de corso, que es de lo que es el templo.
 */

import { forma, nube, trazo, type Pieza } from './aerografo.ts';
import { azar } from './pincel.ts';
import { cinta, fuga } from './escorzo.ts';
import { marcoDelRecinto } from './rig.ts';

const P = {
  negro: 'var(--fondo)',
  plata: 'var(--disco-momo-sampler-tinta)',
  peltre: 'var(--disco-momo-sampler-apoyo)',
  foco: 'var(--entorno-templo-foco)',
  papel: 'var(--papel)',
};

const f = (v: number): string => (Math.round(v * 10) / 10).toString();
const TEMPLO = marcoDelRecinto('el-templo');
const [D0, D1] = [TEMPLO.x, TEMPLO.x + TEMPLO.ancho];
const ALTO = 640;

/** La puerta del fondo: a donde fuga el piso. `x` es su medio y `y` el horizonte del piso. */
export const PUERTA_DEL_FONDO = { x: 340, y: 448, ancho: 26, alto: 46 } as const;
/** La lengua de luz: de acá (ancha, abajo de la pantalla) a la puerta. */
export const LENGUA = { desde: [296, 664], hasta: [PUERTA_DEL_FONDO.x, PUERTA_DEL_FONDO.y], cerca: 168, lejos: 12 } as const;
/** La caja de la nave. */
export const CAJA_DE_LA_NAVE = [D0, 300, TEMPLO.ancho, ALTO - 300] as const;

let cuenta = 0;
const recortado = (silueta: string, adentro: string): string => {
  const id = `cs-${cuenta++}`;
  return `<clipPath id="${id}"><path d="${silueta}"/></clipPath><g clip-path="url(#${id})">${adentro}</g>`;
};

/** Dónde cae en el piso algo que está a hondura `t` (0, acá abajo; 1, el horizonte) y que acá abajo estaría en `x`. */
const enElPiso = (x: number, t: number): readonly [number, number] => [PUERTA_DEL_FONDO.x + (x - PUERTA_DEL_FONDO.x) * (1 - t), PUERTA_DEL_FONDO.y + (ALTO + 30 - PUERTA_DEL_FONDO.y) * (1 - t)];

/** El damero: baldosas en escorzo. Las claras apenas se despegan de lo negro, y se apagan hacia los costados y hacia el fondo. */
function damero(): string {
  const filas = [0, 0.2, 0.37, 0.51, 0.62, 0.71, 0.78, 0.84, 0.89, 0.93];
  const PASO = 132;
  let s = '';
  for (let k = 0; k < filas.length - 1; k++) {
    const [t0, t1] = [filas[k]!, filas[k + 1]!];
    for (let i = -14; i < 14; i++) {
      if ((i + k) % 2) continue;
      const [x0, x1] = [PUERTA_DEL_FONDO.x + i * PASO, PUERTA_DEL_FONDO.x + (i + 1) * PASO];
      const [a, b, c, d] = [enElPiso(x0, t0), enElPiso(x1, t0), enElPiso(x1, t1), enElPiso(x0, t1)];
      const medio = (a[0] + b[0] + c[0] + d[0]) / 4;
      if (medio < D0 - 80 || medio > D1 + 80) continue;
      // Más clara cerca de la lengua de luz y cerca del que mira.
      // Segunda vuelta: en las alas el damero no se veía (bajaba a 0,16 de su fuerza). Ahora no baja de la mitad, y es más claro en todos lados.
      const luz = Math.max(0.5, 1 - Math.abs(medio - (LENGUA.desde[0] + PUERTA_DEL_FONDO.x) / 2) / 900);
      s += forma(`M${f(a[0])} ${f(a[1])} L${f(b[0])} ${f(b[1])} L${f(c[0])} ${f(c[1])} L${f(d[0])} ${f(d[1])} Z`, P.peltre, (0.2 + 0.34 * (1 - t0)) * luz);
    }
  }
  // Las juntas que fugan: unas pocas, finas, que se pierden antes de llegar.
  for (let i = -14; i <= 14; i++) {
    const [a, b] = [enElPiso(PUERTA_DEL_FONDO.x + i * PASO, 0), enElPiso(PUERTA_DEL_FONDO.x + i * PASO, 0.9)];
    s += trazo(`M${f(a[0])} ${f(a[1])} L${f(b[0])} ${f(b[1])}`, P.plata, 0.8, 0.2);
  }
  return s;
}

/** Una columna de atrás, a hondura `t`: más angosta, más corta de espiral y más gris cuanto más lejos. */
function columnaLejana(x: number, t: number, semilla: number): string {
  const k = 1 - t;
  const w = 70 * k * 0.7;
  const pie = enElPiso(0, t)[1] - 34 * k;
  const d = `M${f(x - w / 2)} 290 L${f(x + w / 2)} 290 L${f(x + w / 2)} ${f(pie)} L${f(x - w / 2)} ${f(pie)} Z`;
  let espirales = '';
  for (let y = pie - 46 * k; y > 300; y -= 110 * k) {
    let e = '';
    const r = 24 * k * 0.7;
    for (let q = 0; q <= 36; q++) {
      const a = (q / 36) * Math.PI * 4.2 + semilla;
      e += `${q ? 'L' : 'M'}${f(x + Math.cos(a) * ((r * q) / 36))} ${f(y + Math.sin(a) * ((r * q) / 36))} `;
    }
    espirales += trazo(e, P.peltre, 2.2 * k + 0.4, 0.8) + trazo(e, P.plata, 0.8 * k + 0.2, 0.5 * k + 0.1);
  }
  return (
    // Donde apoya: una mancha en el piso.
    nube(x + w * 0.2, pie + 1, w * 0.9, 3 + 3 * k, P.negro, 's', 0.9) +
    recortado(
      d,
      // Lo lejano es más claro: la bruma de incienso que hay en el medio.
      forma(d, P.negro) + `<path d="${d}" fill="${P.peltre}" opacity="${f(0.1 + t * 0.2)}"/>` + nube(x - w * 0.22, 420, w * 0.2, 200, P.peltre, k > 0.5 ? 's' : 'xs', 0.55) + nube(x + w * 0.4, 420, w * 0.3, 200, P.negro, 's', 0.6) + espirales +
        // Para arriba se pierde en lo negro: el techo no se ve, y la pieza no termina en un canto.
        nube(x, 296, w, 62, P.negro, 'l'),
    )
  );
}

/** Un cabezudo guardado: la cabeza de cartón en la punta de su palo. `gesto`: cómo tiene la boca. */
function cabezudo(x: number, pie: number, r: number, gesto: 'rie' | 'serio' | 'grita', sombrero = true, caido = false): string {
  const cy = pie - r * 2.6;
  const cabeza = `M${f(x - r)} ${f(cy)} C${f(x - r)} ${f(cy - r * 1.3)} ${f(x + r)} ${f(cy - r * 1.3)} ${f(x + r)} ${f(cy)} C${f(x + r)} ${f(cy + r * 0.9)} ${f(x + r * 0.5)} ${f(cy + r * 1.25)} ${f(x)} ${f(cy + r * 1.25)} C${f(x - r * 0.5)} ${f(cy + r * 1.25)} ${f(x - r)} ${f(cy + r * 0.9)} ${f(x - r)} ${f(cy)} Z`;
  const boca =
    gesto === 'rie'
      ? forma(`M${f(x - r * 0.52)} ${f(cy + r * 0.5)} Q${f(x)} ${f(cy + r * 0.66)} ${f(x + r * 0.52)} ${f(cy + r * 0.5)} Q${f(x + r * 0.3)} ${f(cy + r * 1)} ${f(x)} ${f(cy + r * 1)} Q${f(x - r * 0.3)} ${f(cy + r * 1)} ${f(x - r * 0.52)} ${f(cy + r * 0.5)} Z`, P.negro) +
        // Los dientes: una fila de arriba, despareja.
        [-0.36, -0.2, -0.04, 0.12, 0.28].map((d, i) => forma(`M${f(x + r * d)} ${f(cy + r * 0.56)} l${f(r * 0.13)} 0 l${f(-r * 0.01)} ${f(r * (0.13 + (i % 2) * 0.05))} l${f(-r * 0.11)} 0 Z`, P.plata, 0.5)).join('')
      : gesto === 'grita'
        ? `<ellipse cx="${f(x + r * 0.04)}" cy="${f(cy + r * 0.72)}" rx="${f(r * 0.26)}" ry="${f(r * 0.34)}" fill="${P.negro}"/>`
        : trazo(`M${f(x - r * 0.4)} ${f(cy + r * 0.74)} Q${f(x)} ${f(cy + r * 0.62)} ${f(x + r * 0.42)} ${f(cy + r * 0.78)}`, P.negro, r * 0.09);
  const adentro =
    forma(cabeza, P.peltre) +
    // La frente y el cachete que mira a la guirnalda, soplados: es cartón pintado, con bulto.
    nube(x - r * 0.24, cy - r * 0.36, r * 0.66, r * 0.7, P.plata, 'm', 0.26) +
    nube(x - r * 0.56, cy + r * 0.34, r * 0.3, r * 0.24, P.foco, 's', 0.26) +
    nube(x + r * 0.5, cy + r * 0.36, r * 0.3, r * 0.26, P.negro, 's', 0.5) +
    // El volumen: oscuro de abajo y del lado de lo negro; arriba, el foco tibio de la guirnalda.
    nube(x + r * 0.3, cy + r * 0.7, r * 1.1, r * 0.9, P.negro, 'm', 0.85) +
    nube(x + r * 0.9, cy, r * 0.5, r * 1.2, P.negro, 's', 0.8) +
    nube(x - r * 0.3, cy - r * 0.95, r * 0.8, r * 0.36, P.foco, 's', 0.42) +
    nube(x - r * 0.36, cy - r * 0.5, r * 0.4, r * 0.3, P.plata, 's', 0.3) +
    // Las cuencas, la nariz gorda y los cachetes pintados.
    `<ellipse cx="${f(x - r * 0.4)}" cy="${f(cy - r * 0.1)}" rx="${f(r * 0.24)}" ry="${f(r * 0.2)}" fill="${P.negro}"/><ellipse cx="${f(x + r * 0.42)}" cy="${f(cy - r * 0.1)}" rx="${f(r * 0.24)}" ry="${f(r * 0.2)}" fill="${P.negro}"/>` +
    nube(x + r * 0.02, cy + r * 0.26, r * 0.22, r * 0.2, P.plata, 'xs', 0.34) +
    nube(x + r * 0.1, cy + r * 0.4, r * 0.22, r * 0.1, P.negro, 'xs', 0.8) +
    trazo(`M${f(x - r * 0.68)} ${f(cy - r * 0.44)} Q${f(x - r * 0.4)} ${f(cy - r * 0.6)} ${f(x - r * 0.14)} ${f(cy - r * 0.4)} M${f(x + r * 0.16)} ${f(cy - r * 0.4)} Q${f(x + r * 0.44)} ${f(cy - r * 0.62)} ${f(x + r * 0.7)} ${f(cy - r * 0.42)}`, P.negro, r * 0.08) +
    boca +
    // El cartón rajado: un tajo que baja de la coronilla al ojo, un pedazo que saltó y la pintura descascarada.
    trazo(`M${f(x + r * 0.2)} ${f(cy - r * 1.06)} l${f(-r * 0.12)} ${f(r * 0.26)} l${f(r * 0.14)} ${f(r * 0.16)} l${f(-r * 0.1)} ${f(r * 0.3)} l${f(r * 0.1)} ${f(r * 0.1)}`, P.negro, r * 0.045) +
    forma(`M${f(x + r * 0.7)} ${f(cy + r * 0.6)} l${f(r * 0.3)} ${f(-r * 0.3)} l${f(r * 0.1)} ${f(r * 0.5)} Z`, P.negro) +
    [[-0.7, 0.5, 0.16], [0.3, -0.7, 0.12], [-0.1, 1, 0.1]].map(([dx, dy, t]) => nube(x + r * dx!, cy + r * dy!, r * t!, r * t! * 0.7, P.papel, 'xs', 0.3)).join('');
  // El sombrero: una galerita abollada, o el bonete.
  const galera = sombrero
    ? forma(`M${f(x - r * 0.9)} ${f(cy - r * 0.86)} L${f(x + r * 0.84)} ${f(cy - r * 1)} L${f(x + r * 0.5)} ${f(cy - r * 1.04)} L${f(x + r * 0.42)} ${f(cy - r * 1.66)} L${f(x - r * 0.5)} ${f(cy - r * 1.56)} L${f(x - r * 0.5)} ${f(cy - r * 0.94)} Z`, P.negro) +
      trazo(`M${f(x - r * 0.5)} ${f(cy - r * 1.56)} L${f(x + r * 0.42)} ${f(cy - r * 1.66)}`, P.foco, 1.2, 0.5) +
      trazo(`M${f(x - r * 0.5)} ${f(cy - r * 1.04)} L${f(x + r * 0.5)} ${f(cy - r * 1.14)}`, P.plata, r * 0.07, 0.5)
    : forma(`M${f(x - r * 0.6)} ${f(cy - r * 0.92)} L${f(x + r * 0.1)} ${f(cy - r * 2.2)} L${f(x + r * 0.62)} ${f(cy - r * 0.96)} Z`, P.negro) + trazo(`M${f(x - r * 0.44)} ${f(cy - r * 1.14)} L${f(x + r * 0.1)} ${f(cy - r * 2.2)}`, P.foco, 1.2, 0.5) + nube(x + r * 0.1, cy - r * 2.2, r * 0.12, r * 0.12, P.plata, 'xs', 0.7);
  const tunica = `M${f(x - r * 1.04)} ${f(cy + r * 1.3)} L${f(x + r * 1.04)} ${f(cy + r * 1.26)} L${f(x + r * 0.84)} ${f(pie - 7)} L${f(x + r * 0.4)} ${f(pie - 3)} L${f(x)} ${f(pie - 9)} L${f(x - r * 0.44)} ${f(pie - 4)} L${f(x - r * 0.9)} ${f(pie - 8)} Z`;
  const cara = recortado(cabeza, adentro) + galera;
  // El que se cayó: quedó la cabeza sola en el piso, de costado, mirando para acá.
  if (caido) return nube(x + r * 0.2, pie + 1, r * 1.3, 4, P.negro, 's', 0.95) + `<g transform="translate(0 ${f(pie - r * 0.86 - cy)}) rotate(72 ${f(x)} ${f(cy)})">${cara}</g>`;
  return (
    // El palo, el travesaño de los hombros y la túnica colgando; al pie, la mancha.
    nube(x + 4, pie, r * 0.6, 3, P.negro, 's', 0.9) +
    trazo(`M${f(x)} ${f(pie)} L${f(x + 1)} ${f(cy + r)}`, P.negro, 3.4) +
    trazo(`M${f(x - 1.2)} ${f(pie - 4)} L${f(x - 0.2)} ${f(cy + r * 1.2)}`, P.peltre, 1, 0.6) +
    // La túnica, vacía, colgada del travesaño de los hombros: llega casi al piso y adentro no hay nadie.
    recortado(
      tunica,
      forma(tunica, P.negro) + `<path d="${tunica}" fill="${P.peltre}" opacity="0.3"/>` + nube(x + r * 0.5, cy + r * 2.4, r * 0.7, r * 1.4, P.negro, 's', 0.8) + nube(x - r * 0.6, cy + r * 1.6, r * 0.5, r * 0.5, P.foco, 's', 0.16) +
        [-0.6, -0.2, 0.24, 0.62].map((d, i) => trazo(`M${f(x + r * d)} ${f(cy + r * 1.36)} Q${f(x + r * d * 1.2 + (i % 2 ? 2 : -2))} ${f(cy + r * 2.2)} ${f(x + r * d * 1.3)} ${f(pie - 5)}`, P.negro, 1.6, 0.7)).join('') +
        // Los botones del disfraz, enormes.
        [1.64, 2.04, 2.44].map((d) => `<circle cx="${f(x + r * 0.04)}" cy="${f(cy + r * d)}" r="${f(r * 0.1)}" fill="${P.plata}" opacity="0.4"/>`).join(''),
    ) +
    trazo(`M${f(x - r * 1.04)} ${f(cy + r * 1.32)} L${f(x + r * 1.04)} ${f(cy + r * 1.26)}`, P.peltre, 1.4, 0.7) +
    cara
  );
}

/** Los cabezudos: `[x, pie, radio, gesto, con galera]`. El primero es el de la entrada, al que se le prenden los ojos. */
export const CABEZUDOS: readonly (readonly [number, number, number, 'rie' | 'serio' | 'grita', boolean, boolean])[] = [
  [-4, 562, 30, 'rie', true, false],
  // El del medio se cayó del palo (segunda vuelta): la cabeza sola, en el piso, entre el Morta y el doctor Saturno.
  [760, 574, 31, 'serio', false, true],
  [1092, 478, 27, 'grita', true, false],
];

/** La mano de abajo del templo: entra después del telón (`templo-lejos`) y antes de todos los demás. */
export function corsoNave(): string {
  const [x0, y0, w, h] = CAJA_DE_LA_NAVE;
  const { x: px, y: py, ancho: pw, alto: ph } = PUERTA_DEL_FONDO;
  const rnd = azar(6101);
  const ps = fuga(LENGUA.desde, LENGUA.hasta, LENGUA.cerca, LENGUA.lejos, 26, 20, 0.2);
  // Las columnas de atrás: dos filas que se cierran sobre la puerta.
  let columnas = '';
  [0.4, 0.62, 0.78].forEach((t, i) => {
    const abre = 236 * (1 - t) + 14;
    // Entre un par y el que tiene adelante, la bruma del incienso: lo de atrás queda más claro y más borrado.
    const bruma = i ? nube(px, enElPiso(0, t)[1] - 70 * (1 - t), 250 * (1 - t) + 70, 46 * (1 - t) + 16, P.peltre, 'l', 0.24) : '';
    columnas = columnaLejana(px - abre, t, i) + columnaLejana(px + abre, t, i + 3) + bruma + columnas;
  });
  // Serpentina pisada: aplastada contra el piso, más grande cuanto más cerca.
  let serpentinas = '';
  for (const [sx, t, largo, giro] of [[120, 0.5, 60, -8], [520, 0.56, 50, 12], [640, 0.3, 90, -4], [-140, 0.36, 80, 6], [930, 0.44, 70, -10], [1080, 0.2, 100, 5], [250, 0.16, 110, -3]] as const) {
    const [x, y] = enElPiso(sx, t);
    const k = 1 - t;
    let d = '';
    for (let q = 0; q <= 40; q++) {
      const u = q / 40;
      d += `${q ? 'L' : 'M'}${f(x + u * largo * k + Math.sin(u * 23) * 3 * k)} ${f(y + Math.sin(u * Math.PI * 9) * 5 * k * 0.36 + Math.sin(u * 3) * 4 * k)} `;
    }
    serpentinas += `<g transform="rotate(${giro} ${f(x)} ${f(y)})">${trazo(d, rnd() < 0.5 ? P.plata : P.peltre, 1 + k * 1.2, 0.3 + k * 0.4)}</g>`;
  }
  // Papel picado a media distancia: el del recinto está todo en los últimos 90 de abajo.
  let picado = '';
  for (let i = 0; i < 230; i++) {
    const t = 0.24 + rnd() ** 0.8 * 0.6;
    const [x, y] = enElPiso(D0 - 300 + rnd() * (TEMPLO.ancho + 600), t);
    if (x < D0 || x > D1) continue;
    const k = 1 - t;
    const tam = 1.2 + k * 4.4;
    picado += `<rect x="${f(x)}" y="${f(y)}" width="${f(tam)}" height="${f(tam * 0.34)}" fill="${[P.plata, P.foco, P.peltre, P.papel][i % 4]}" opacity="${f(0.22 + rnd() * 0.4 * (0.5 + k))}" transform="rotate(${Math.round(rnd() * 50 - 25)} ${f(x)} ${f(y)})"/>`;
  }
  const telon = (lado: 1 | -1): string =>
    forma(`M${px + lado * pw * 0.5} ${py - ph} C${px + lado * pw * 1.4} ${py - ph + 6} ${px + lado * pw * 1.2} ${py - 12} ${px + lado * pw * 1.9} ${py} L${px + lado * pw * 0.5} ${py} Z`, P.negro) +
    trazo(`M${px + lado * pw * 0.62} ${py - ph + 4} C${px + lado * pw * 1.2} ${py - ph + 10} ${px + lado * pw * 1.06} ${py - 14} ${px + lado * pw * 1.6} ${py - 2}`, P.foco, 1, 0.4);
  return (
    `<g filter="url(#rociado)">` +
    `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="var(--fondo)" fill-opacity="0"/>` +
    // La pared del fondo, apenas: una franja de humo claro arriba del horizonte, así el piso tiene dónde terminar.
    nube(px, py - 30, 520, 34, P.peltre, 'xl', 0.2) +
    nube(px + 420, py - 22, 300, 26, P.peltre, 'xl', 0.12) +
    damero() +
    // El piso devuelve la guirnalda en tres charcos de luz, y se apaga hacia los costados.
    nube(450, 556, 360, 48, P.peltre, 'xl', 0.34) +
    nube(D0 + 150, 566, 200, 44, P.peltre, 'xl', 0.3) +
    nube(D1 - 220, 566, 240, 44, P.peltre, 'xl', 0.3) +
    nube(880, 520, 200, 30, P.peltre, 'xl', 0.2) +
    // La bruma del incienso, baja, en dos bancos a media nave.
    nube(110, 474, 170, 16, P.plata, 'l', 0.1) +
    nube(900, 480, 220, 18, P.plata, 'l', 0.1) +
    // La puerta del fondo: el resplandor, el vano prendido y los telones recogidos.
    nube(px, py - ph * 0.5, pw * 3.4, ph * 1.3, P.foco, 'l', 0.3) +
    forma(`M${px - pw / 2} ${py} L${px - pw / 2 + 1} ${py - ph + 5} Q${px} ${py - ph - 6} ${px + pw / 2 - 1} ${py - ph + 5} L${px + pw / 2} ${py} Z`, P.foco, 0.92) +
    nube(px, py - ph * 0.3, pw * 0.34, ph * 0.3, P.papel, 's', 0.7) +
    telon(1) +
    telon(-1) +
    // La lengua de luz: sale de la puerta y cruza el piso hasta acá, con el canto roto por las baldosas.
    `<path d="${cinta(ps)}" fill="${P.foco}" filter="url(#soplo-m)" opacity="0.2"/>` +
    `<path d="${cinta(ps, 0.4)}" fill="${P.foco}" filter="url(#soplo-s)" opacity="0.22"/>` +
    nube(px, py + 8, 30, 7, P.foco, 's', 0.6) +
    columnas +
    serpentinas +
    picado +
    CABEZUDOS.map(([x, pie, r, gesto, galera, caido]) => cabezudo(x, pie, r, gesto, galera, caido)).join('') +
    `</g>`
  );
}

/* ------------------------------------------------------------------
   El que mira, y la careta pisada
   ------------------------------------------------------------------ */

const [EX, EPIE, ER] = CABEZUDOS[0]!;
const ECY = EPIE - ER * 2.6;
/** La caja de los ojos del cabezudo de la entrada: las dos cuencas y la boca. */
export const OJOS = { caja: [Math.round(EX - ER), Math.round(ECY - ER * 0.5), ER * 2, Math.round(ER * 1.7)] as const } as const;

function ojosPrendidos(): string {
  const [x0, y0, w, h] = OJOS.caja;
  const [x, cy, r] = [EX, ECY, ER];
  return (
    `<g filter="url(#rociado)"><rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="var(--fondo)" fill-opacity="0"/>` +
    // Alguien prendió una vela adentro de la cabeza: las cuencas y los dientes, tibios.
    [-0.4, 0.42].map((d) => nube(x + r * d, cy - r * 0.1, r * 0.3, r * 0.26, P.foco, 's', 0.6) + `<ellipse cx="${f(x + r * d)}" cy="${f(cy - r * 0.1)}" rx="${f(r * 0.2)}" ry="${f(r * 0.16)}" fill="${P.foco}"/>` + `<circle cx="${f(x + r * d + 1.4)}" cy="${f(cy - r * 0.08)}" r="${f(r * 0.08)}" fill="${P.negro}"/>`).join('') +
    forma(`M${f(x - r * 0.46)} ${f(cy + r * 0.56)} Q${f(x)} ${f(cy + r * 0.7)} ${f(x + r * 0.46)} ${f(cy + r * 0.56)} Q${f(x + r * 0.26)} ${f(cy + r * 0.94)} ${f(x)} ${f(cy + r * 0.94)} Q${f(x - r * 0.26)} ${f(cy + r * 0.94)} ${f(x - r * 0.46)} ${f(cy + r * 0.56)} Z`, P.foco, 0.7) +
    [-0.3, -0.1, 0.1, 0.3].map((d) => trazo(`M${f(x + r * d)} ${f(cy + r * 0.6)} l0 ${f(r * 0.3)}`, P.negro, 1.2)).join('') +
    `</g>`
  );
}

/** La careta pisada, en el piso, a la izquierda de la lengua de luz. */
const CARETA = [104, 568, 44, 24] as const;

function careta(): string {
  const [x0, y0, w, h] = CARETA;
  const [x, y] = [x0 + 21, y0 + 13];
  return (
    `<g filter="url(#grano)"><rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="var(--fondo)" fill-opacity="0"/>` +
    nube(x + 2, y + 6, 17, 2.6, P.negro, 'xs', 0.9) +
    // Un antifaz de cartón, aplastado: partido al medio por un taco.
    `<g transform="translate(${x} ${y}) rotate(-7) scale(1 0.46)">` +
    forma('M-16 -3 Q-12 -10 -5 -8 Q0 -5 5 -8 Q12 -10 16 -3 Q14 7 6 6 Q1 4 0 0 Q-1 4 -6 6 Q-14 7 -16 -3 Z', P.plata, 0.9) +
    `<ellipse cx="-8" cy="-1.4" rx="3.6" ry="2.6" fill="${P.negro}"/><ellipse cx="8" cy="-1.4" rx="3.6" ry="2.6" fill="${P.negro}"/>` +
    trazo('M-1 -6 l2 4 l-2.4 3 l2 4', P.negro, 0.9) +
    trazo('M-15 -4 Q-12 -9 -6 -7.6', P.papel, 0.7, 0.8) +
    // Las lentejuelas, y el elástico cortado.
    [-12, -4, 4, 12].map((d) => `<circle cx="${d}" cy="${d % 8 ? 3.4 : -6}" r="0.8" fill="${P.foco}"/>`).join('') +
    trazo('M16 -3 q5 -3 8 2 q2 4 -1 6', P.peltre, 0.6) +
    `</g></g>`
  );
}

/** Las piezas sueltas del templo: la nave, lo que asoma y lo que premia a la lupa. */
export const PIEZAS_DEL_CORSO: readonly Pieza[] = [
  // El grano del rociado sobre el damero pesa: se comprime un poco más, que acá no hay filo que cuidar.
  // Segunda vuelta: de 2 a 1,5 píxeles por unidad. Es aerógrafo: no tiene filo que cuidar, y así pesa la mitad y ocupa 3,5 MB menos decodificada.
  { nombre: 'camino-templo-nave', caja: CAJA_DE_LA_NAVE, dibujo: corsoNave(), densidad: 1.5, calidad: 72 },
  { nombre: 'camino-templo-ojos', caja: OJOS.caja, dibujo: ojosPrendidos(), densidad: 3 },
  { nombre: 'fino-templo-careta', caja: CARETA, dibujo: careta(), densidad: 4 },
];
