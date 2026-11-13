/**
 * Los velos de llegada, impresos (`D-90`, octava ronda; los números, en `velos.ts`).
 *
 * Cada velo es una hoja: un cuerpo que tapa la pantalla y un canto roto, del lado que arrastra. Se
 * pinta una sola vez "a lo largo" (`a`, de 0 a 900: de 0 a 640 tapa, de ahí en más es el canto) y
 * "de través" (`b`), y según el rumbo la hoja se acuesta o se da vuelta. Así la niebla que sube, el
 * agua que baja y la reja que se corre salen del mismo molde.
 *
 * La mano es la de la tapa de cada región, como todo el aire: soplado con grano donde la tapa es
 * aerógrafo; crayón, gubia o tinta plana, de canto duro, donde la tapa es eso.
 */
import { enmascarado, forma, nube, trazo, type Pieza } from './aerografo.ts';
import { azar } from './arte.ts';
import { EL_PLANO, HOJA, VELOS, piezaDelVelo, type Rumbo } from './velos.ts';

const f = (n: number): string => n.toFixed(1);

/** La hoja de un rumbo: pasa de "a lo largo y de través" a la imagen. */
function hoja(rumbo: Rumbo) {
  const B = HOJA.deTraves[rumbo];
  const L = HOJA.largo;
  const acostada = rumbo === 'corre';
  // El que baja arrastra el canto de arriba: la hoja se da vuelta.
  const xy = (a: number, b: number): readonly [number, number] => (acostada ? [a, b] : rumbo === 'baja' ? [b, L - a] : [b, a]);
  return {
    B,
    L,
    caja: (acostada ? [0, 0, L, B] : [0, 0, B, L]) as readonly [number, number, number, number],
    xy,
    /** Una mancha soplada: `ra` a lo largo, `rb` de través. */
    mancha: (a: number, b: number, ra: number, rb: number, color: string, tam: 's' | 'm' | 'l' | 'xl', o: number): string => {
      const [x, y] = xy(a, b);
      return acostada ? nube(x, y, ra, rb, color, tam, o) : nube(x, y, rb, ra, color, tam, o);
    },
    /** Un camino por puntos (a, b). */
    camino: (pts: readonly (readonly [number, number])[], cerrado = true): string =>
      pts.map(([a, b], i) => `${i ? 'L' : 'M'}${xy(a, b).map(f).join(' ')}`).join(' ') + (cerrado ? ' Z' : ''),
  };
}
type Hoja = ReturnType<typeof hoja>;

/**
 * El cuerpo con su canto: tapa hasta `HOJA.tapa` y de ahí sale desparejo. `diente`: cuánto entra y
 * sale el canto; `paso`: cada cuánto cambia.
 */
function cuerpo(h: Hoja, rnd: () => number, diente: readonly [number, number], paso: readonly [number, number]): string {
  const pts: [number, number][] = [[-20, -20], [-20, h.B + 20]];
  for (let b = h.B + 20; b > -20; b -= paso[0] + rnd() * (paso[1] - paso[0])) pts.push([HOJA.tapa + diente[0] + rnd() * (diente[1] - diente[0]), b]);
  return h.camino(pts);
}

/** Soplado: el cuerpo, con el canto deshecho en bocanadas, y adentro lo que lo llena. */
function soplado(h: Hoja, semilla: number, base: string, tintas: readonly (readonly [string, number])[], alargadas = 1, canto: string = base): string {
  const rnd = azar(semilla);
  let s = forma(h.camino([[-20, -20], [-20, h.B + 20], [HOJA.tapa + 10, h.B + 20], [HOJA.tapa + 10, -20]]), base);
  // El canto: bocanadas que salen del cuerpo, cada vez más chicas y más flojas. Nunca una línea.
  for (let b = -10; b < h.B + 10; b += 26 + rnd() * 30) {
    const largo = 40 + rnd() * 150;
    s += h.mancha(HOJA.tapa + largo * 0.3, b, largo * 0.75 * alargadas ** 0.5, 30 + rnd() * 34, canto, 'l', 0.95);
    s += h.mancha(HOJA.tapa + largo * 0.95, b + (rnd() - 0.5) * 30, largo * 0.4, 16 + rnd() * 20, canto, 'l', 0.55);
  }
  // Adentro: lo que hace que no sea un paño.
  for (let i = 0; i < 46; i++) {
    const [tinta, o] = tintas[i % tintas.length]!;
    const a = rnd() * (HOJA.tapa + 160);
    const r = 34 + rnd() * 80;
    s += h.mancha(a, rnd() * h.B, r * alargadas, r * (0.5 + rnd() * 0.5) / alargadas ** 0.5, tinta, i % 3 ? 'xl' : 'l', o * (0.6 + rnd() * 0.4) * (a > HOJA.tapa ? 0.6 : 1));
  }
  return `<g filter="url(#rociado)"><rect x="-40" y="-40" width="${h.caja[2] + 80}" height="${h.caja[3] + 80}" fill="${base}" fill-opacity="0"/>${s}</g>`;
}

/** De canto duro: el cuerpo cortado, y adentro lo que lo llena, recortado con él. */
function duro(h: Hoja, id: string, semilla: number, base: string, filtro: string, diente: readonly [number, number], paso: readonly [number, number], adentro: (rnd: () => number) => string, suelto = ''): string {
  const rnd = azar(semilla);
  const silueta = cuerpo(h, rnd, diente, paso);
  return `<g filter="url(#${filtro})"><rect x="-40" y="-40" width="${h.caja[2] + 80}" height="${h.caja[3] + 80}" fill="${base}" fill-opacity="0"/>${enmascarado(id, silueta, forma(silueta, base) + adentro(rnd))}${suelto}</g>`;
}

const T = (nombre: string): string => `var(--${nombre})`;

const PINTA: Readonly<Record<string, (h: Hoja) => string>> = {
  'el-monte': (h) => soplado(h, 3101, T('entorno-monte-hondo'), [[T('entorno-monte-medio'), 0.5], [T('entorno-monte-claro'), 0.34], [T('fondo'), 0.4]]),
  'la-pastura': (h) => soplado(h, 3103, T('entorno-pastura-honda'), [[T('entorno-monte-claro'), 0.3], [T('fondo'), 0.34], [T('entorno-monte-medio'), 0.4]], 2.2),
  'los-astilleros': (h) => soplado(h, 3105, T('entorno-astillero-noche'), [[T('entorno-astillero-azul'), 0.5], [T('disco-cordero-atado-tinta'), 0.2], [T('entorno-astillero-tiza-clara'), 0.2]], 1.8),
  cybersiberia: (h) => soplado(h, 3107, T('entorno-cyber-acero-claro'), [[T('entorno-cyber-nieve'), 0.62], [T('entorno-cyber-nieve'), 0.4], [T('entorno-cyber-acero'), 0.4]], 4.5, T('entorno-cyber-nieve')),
  'el-arbol': (h) => soplado(h, 3109, T('entorno-arbol-cielo'), [[T('entorno-arbol-violeta'), 0.6], [T('entorno-arbol-nube'), 0.3], [T('entorno-arbol-tierra'), 0.4]], 1.6),
  'la-ruta': (h) => soplado(h, 3111, T('entorno-astillero-noche'), [[T('fondo'), 0.5], [T('entorno-templo-foco'), 0.3], [T('papel'), 0.16]], 5, T('entorno-templo-foco')),
  'el-infierno': (h) => soplado(h, 3113, T('entorno-infierno-brasa'), [[T('fondo'), 0.55], [T('entorno-infierno-fuego'), 0.3], [T('fondo'), 0.4]]),
  'el-templo': (h) => soplado(h, 3115, T('fondo'), [[T('entorno-templo-foco'), 0.2], [T('entorno-mesa-papel'), 0.12], [T('entorno-templo-foco'), 0.12]], 0.6, T('entorno-mesa-sepia-honda')),

  // El mantel de la mesa: tinta plana, con su guarda roja y la puntilla del borde.
  'la-mesa': (h) =>
    duro(h, 'vl-mesa', 3121, T('entorno-mesa-papel'), 'grano', [6, 34], [22, 30], () => {
      let s = '';
      for (const a of [HOJA.tapa - 46, HOJA.tapa - 30]) s += forma(h.camino([[a, -20], [a + 8, -20], [a + 8, h.B + 20], [a, h.B + 20]]), T('entorno-mesa-rojo'));
      // Los dobleces de haber estado guardado.
      for (const a of [210, 430]) s += trazo(h.camino([[a, -20], [a, h.B + 20]], false), T('entorno-mesa-sepia-clara'), 3, 0.7);
      for (const b of [h.B * 0.33, h.B * 0.67]) s += trazo(h.camino([[-20, b], [HOJA.tapa, b]], false), T('entorno-mesa-sepia-clara'), 3, 0.7);
      return s;
    }),
  // El telón del galpón: rojo, con la trama de puntos del público.
  'el-galpon': (h) =>
    duro(h, 'vl-galpon', 3123, T('entorno-galpon-brasa'), 'grano', [10, 60], [40, 56], () => {
      let s = '';
      for (let a = 10, fila = 0; a < HOJA.largo; a += 15, fila++) {
        for (let b = fila % 2 ? 7 : 0; b < h.B + 10; b += 15) {
          const [x, y] = h.xy(a, b);
          s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(1.6 + 3.4 * (a / HOJA.largo))}" fill="${T('entorno-galpon-rojo')}"/>`;
        }
      }
      // Los pliegues, que caen a lo largo.
      for (let b = 30; b < h.B; b += 70) s += forma(h.camino([[-20, b], [HOJA.largo, b], [HOJA.largo, b + 16], [-20, b + 22]]), T('entorno-galpon-noche'), 0.5);
      return s;
    }),
  // El telón de crayón de los techos: la noche de *Un baión*, rayada.
  'los-techos': (h) =>
    duro(h, 'vl-techos', 3125, T('entorno-baion-noche'), 'xerox-fino', [0, 110], [14, 34], (rnd) => {
      let s = '';
      const tintas = [T('entorno-baion-violeta'), T('entorno-baion-azul'), T('entorno-baion-violeta'), T('entorno-baion-lila'), T('entorno-baion-rosa')];
      for (let i = 0; i < 260; i++) {
        const a = rnd() * HOJA.largo;
        const b = rnd() * h.B;
        const largo = 14 + rnd() * 40;
        const giro = (rnd() - 0.5) * 0.9;
        s += trazo(h.camino([[a, b], [a + Math.cos(giro) * largo, b + Math.sin(giro) * largo]], false), tintas[i % tintas.length]!, 3 + rnd() * 4, 0.5 + rnd() * 0.4);
      }
      return s;
    }),
  // El agua del bajo: el violeta del agua, con las rayas de crayón de la superficie.
  'el-bajo': (h) =>
    duro(h, 'vl-bajo', 3127, T('entorno-bajo-agua'), 'xerox-fino', [0, 46], [30, 60], (rnd) => {
      let s = '';
      for (let i = 0; i < 150; i++) {
        const a = Math.sqrt(rnd()) * HOJA.largo;
        const b = rnd() * h.B;
        const largo = 20 + rnd() * 60;
        s += trazo(h.camino([[a, b], [a + (rnd() - 0.5) * 5, b + largo]], false), i % 5 === 0 ? T('entorno-baion-luz') : i % 2 ? T('entorno-bajo-celeste') : T('fondo'), 2.4 + rnd() * 3, (0.3 + rnd() * 0.4) * (a > HOJA.tapa - 80 ? 1 : 0.6));
      }
      return s;
    }),
  // La hoja de la imprenta: papel, con la mugre del rodillo.
  [EL_PLANO]: (h) =>
    duro(h, 'vl-plano', 3129, T('papel'), 'grano', [0, 70], [10, 26], (rnd) => {
      let s = '';
      for (let i = 0; i < 26; i++) {
        const a = rnd() * HOJA.largo;
        const b = rnd() * h.B;
        s += trazo(h.camino([[a, b], [a + 20 + rnd() * 80, b + (rnd() - 0.5) * 6]], false), T('papel-tenue'), 1 + rnd() * 2.4, 0.3 + rnd() * 0.3);
      }
      return s + forma(h.camino([[HOJA.tapa - 30, -20], [HOJA.tapa - 24, -20], [HOJA.tapa - 24, h.B + 20], [HOJA.tapa - 30, h.B + 20]]), T('marca-rojo'), 0.9);
    }),
  // La reja de la prisión: lo negro, y los barrotes que siguen de largo. Entre barrote y barrote se ve la celda.
  'la-prision': (h) => {
    const rnd = azar(3131);
    const negro = forma(h.camino([[-20, -20], [-20, h.B + 20], [HOJA.tapa - 6, h.B + 20], [HOJA.tapa - 6, -20]]), T('fondo'));
    let barrotes = '';
    for (let a = 20; a < HOJA.largo - 10; a += 46) {
      const w = 9 + rnd() * 4;
      const chueco = (rnd() - 0.5) * 6;
      const adentro = a < HOJA.tapa - 6;
      barrotes += forma(h.camino([[a, -20], [a + w, -20], [a + w + chueco, h.B + 20], [a + chueco, h.B + 20]]), adentro ? T('disco-oktubre-apoyo') : T('bestia-dracula-papel'), adentro ? 0.5 : 1);
    }
    // Los dos travesaños, que agarran los barrotes que quedaron afuera.
    let travesanios = '';
    for (const b of [h.B * 0.2, h.B * 0.78]) travesanios += forma(h.camino([[HOJA.tapa - 40, b], [HOJA.largo - 14, b + 3], [HOJA.largo - 14, b + 17], [HOJA.tapa - 40, b + 15]]), T('bestia-dracula-papel'));
    // El rayado de gubia sobre lo negro: cortes cortos, todos para el mismo lado.
    let cortes = '';
    for (let i = 0; i < 120; i++) {
      const a = rnd() * (HOJA.tapa - 30);
      const b = rnd() * h.B;
      cortes += trazo(h.camino([[a, b], [a + 12 + rnd() * 30, b - 4 - rnd() * 8]], false), T('bestia-dracula-papel'), 1.6 + rnd() * 1.6, 1);
    }
    return `<g filter="url(#gubia)"><rect x="-40" y="-40" width="${h.caja[2] + 80}" height="${h.caja[3] + 80}" fill="${T('fondo')}" fill-opacity="0"/>${negro}${cortes}${barrotes}${travesanios}</g>`;
  },
};

/** Las piezas de los velos: una por región, y la del plano. */
export const PIEZAS_DE_VELO: readonly Pieza[] = Object.entries(VELOS).map(([region, v]) => {
  const pinta = PINTA[region];
  if (!pinta) throw new Error(`nadie pinta el velo de "${region}" (arte-velos.ts)`);
  const h = hoja(v.rumbo);
  // Lo soplado aguanta agrandarse y el grano pesa: se imprime chico. Lo de canto duro, más fino.
  return { nombre: piezaDelVelo(region), caja: h.caja, dibujo: pinta(h), ...(v.mano === 'soplada' ? { densidad: 0.8, calidad: 52 } : { densidad: 1.5, calidad: 68 }) };
});
