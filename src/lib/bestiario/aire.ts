/**
 * El aire del camino (`D-90`): lo que hay entre la cámara y las cosas.
 *
 * Pedido del usuario: *"quiero mejorar la inmersión [...] que tenga más misterio y efectos,
 * nieblas"*. Hasta acá cada camino eran tres capas duras (lo lejano, el piso, lo de adelante) y
 * entre una y otra no había nada: se veía todo de una. El aire son capas sopladas que van en el
 * medio: la bruma que sale de atrás del borde del piso, la niebla que anda a ras del suelo, y lo
 * que queda pegado a la cámara, fuera de foco, tapando el borde de abajo de la pantalla (que en un
 * teléfono parado era medio metro de piso vacío).
 *
 * Esto son números, como `camino.ts` y `rig.ts`: los lee la página para poner cada capa y la isla
 * para moverla. El dibujo está en `arte-aire.ts` y **se imprime** (`scripts/imprimir-bestiario.mjs`):
 * el soplo y el grano se calculan una vez, y el teléfono solo corre la imagen y le cambia el alfa.
 * Ni un filtro en vivo, ni un degradé de CSS.
 *
 * ## Cómo es una capa de aire
 *
 * Una baldosa que se repite de costado (y para arriba, la que cae o sube), más ancha que cualquier
 * pantalla, que la isla corre con `transform`:
 *
 * - `f` es su velocidad de paralaje, como la de las capas del camino: lo que está atrás del piso
 *   va más despacio que él, lo que está pegado a la cámara pasa volando.
 * - `deriva` y `cae` son el viento: lo que se corre sola, en unidades de escena por segundo.
 * - `alfa` es lo espesa que está quieta; `late` y `ritmo`, lo que respira; `abre`, cuánto se
 *   deshace mientras se camina. La niebla del monte se abre al paso y se vuelve a cerrar cuando
 *   te quedás quieto: quedarse quieto tiene premio.
 *
 * Con movimiento reducido no se corre ni respira: queda impresa en su lugar, con su alfa.
 */

import { ALTO } from './camino.ts';

/** Dónde va una capa de aire entre las del camino. */
export type Plano =
  /** Entre lo lejano y el piso: sale de atrás del borde del piso. */
  | 'fondo'
  /** Encima del piso y de los bichos, debajo de lo de adelante. */
  | 'medio'
  /** Encima de todo: lo que está pegado a la cámara. */
  | 'cerca';

export interface CapaDeAire {
  /** La pieza impresa (`arte-aire.ts`). */
  pieza: string;
  plano: Plano;
  /** La velocidad de paralaje. */
  f: number;
  /** Dónde arranca y cuánto mide de alto, en unidades de escena. */
  y: number;
  alto: number;
  /** Lo ancho de la baldosa, en unidades de escena: se repite de costado. */
  ancho: number;
  /** El viento, en unidades por segundo: de costado (negativo, hacia la izquierda) y para abajo. */
  deriva: number;
  /** Solo en las capas de pantalla entera (`y` 0, `alto` `ALTO`): la baldosa se repite también para arriba. */
  cae: number;
  /** El alfa quieta, lo que late (se suma y se resta) y a qué ritmo, en radianes por segundo. */
  alfa: number;
  late: number;
  ritmo: number;
  /** Cuánto se deshace caminando, de 0 (nada) a 1 (del todo). */
  abre: number;
  /** Lo que se hamaca de costado, en unidades, y a qué ritmo: la ropa tendida, los juncos. */
  mece: number;
  ritmoMece: number;
  /**
   * Lo que salta (`D-91`, tanda 2): cuánto baja y vuelve a subir, en unidades, y a qué ritmo. Es el pogo
   * del galpón: la gente está impresa arriba del salto y cae `salta` unidades; el borde de abajo se pierde
   * afuera de la pantalla. `faseSalta` corre el compás, así dos filas no saltan juntas.
   */
  salta: number;
  ritmoSalta: number;
  faseSalta: number;
  /** La pieza ya la pinta y la imprime otro (`arte-entornos.ts`): acá solo se la mueve. */
  ajena?: boolean;
  /** Si suena (`entorno.ts`): el viento sube y baja con el alfa de la capa. */
  suena?: 'viento';
  /**
   * Una capa de `fondo` que el alivio no apaga (`D-91`): no es bruma, es dibujo. Los troncos gordos del
   * monte son la mitad del bosque; un teléfono flojo se queda sin la niebla, no sin los árboles.
   */
  firme?: boolean;
}

const capa = (c: Partial<CapaDeAire> & Pick<CapaDeAire, 'pieza' | 'plano' | 'f' | 'y' | 'alto' | 'ancho'>): CapaDeAire => ({
  deriva: 0,
  cae: 0,
  alfa: 1,
  late: 0,
  ritmo: 0.5,
  abre: 0,
  mece: 0,
  ritmoMece: 0.8,
  salta: 0,
  ritmoSalta: 6,
  faseSalta: 0,
  ...c,
});

/**
 * El monte (`D-91`): atrás del piso ya no hay una bruma suelta sino **los troncos de adelante** del
 * bosque, impresos en una baldosa que se corre más rápido que lo lejano y más despacio que el piso.
 * Es lo que da el fondo de verdad al caminar: tres planos de árboles que se cruzan. La bruma de atrás
 * está impresa entre los planos de lo lejano. La rasante y lo pegado a la cámara siguen.
 */
const DEL_MONTE: readonly CapaDeAire[] = [
  capa({ pieza: 'aire-monte-troncos', plano: 'fondo', f: 0.72, y: 0, alto: 360, ancho: 1400, firme: true }),
  capa({ pieza: 'aire-monte-rasante', plano: 'medio', f: 1.12, y: 300, alto: 340, ancho: 1400, deriva: -9, alfa: 0.82, late: 0.1, ritmo: 0.31, abre: 0.6 }),
  capa({ pieza: 'aire-monte-cerca', plano: 'cerca', f: 1.75, y: 380, alto: 260, ancho: 1600 }),
];

/**
 * La pastura (`D-91`) dejó de respirar el aire del monte: es campo abierto. **La ola**: el viento que
 * pasa por el pasto, frentes de puntas claras que cruzan rápido y se pierden. **La rasante**: niebla
 * baja, chata, que lame el piso y se abre al caminar. Y pegado a la cámara, pasto alto que se hamaca.
 */
const DE_LA_PASTURA: readonly CapaDeAire[] = [
  capa({ pieza: 'aire-pastura-ola', plano: 'medio', f: 1.04, y: 330, alto: 270, ancho: 1300, deriva: -64, alfa: 0.6, late: 0.3, ritmo: 0.43, suena: 'viento' }),
  capa({ pieza: 'aire-pastura-rasante', plano: 'medio', f: 1.12, y: 380, alto: 260, ancho: 1400, deriva: 8, alfa: 0.8, late: 0.1, ritmo: 0.27, abre: 0.6 }),
  capa({ pieza: 'aire-pastura-cerca', plano: 'cerca', f: 1.75, y: 420, alto: 220, ancho: 1600, mece: 5, ritmoMece: 0.8 }),
];

/**
 * El aire de cada región. La que no está, todavía no tiene: el sistema es el mismo para todas, y
 * sumar una es escribir su receta acá y pintar sus baldosas en `arte-aire.ts`.
 */
export const AIRE: Readonly<Record<string, readonly CapaDeAire[]>> = {
  'el-monte': DEL_MONTE,
  'la-pastura': DE_LA_PASTURA,
  // Cybersiberia: el vaho helado contra la chapa, la ventisca que cruza el piso y los médanos de nieve pegados a la cámara.
  cybersiberia: [
    capa({ pieza: 'aire-cyber-vaho', plano: 'fondo', f: 0.8, y: 110, alto: 320, ancho: 1200, deriva: -12, alfa: 0.75, late: 0.15, ritmo: 0.19 }),
    // La nevisca (sexta ronda): la nevada y la ventisca, fundidas en una sola capa que cae al sesgo.
    // La nevada vivía adentro del dibujo del piso y bajaba con una animación de CSS, que obligaba a
    // repintar el piso entero en cada cuadro (12 cuadros por segundo con la CPU ×4); en la tercera
    // ronda salió a una capa de aire, y con la ventisca eran dos capas de pantalla entera, una encima
    // de la otra. Ahora es una: copos y rachas en la misma baldosa, que el viento lleva para la
    // izquierda mientras caen. Una superficie menos para componer.
    capa({ pieza: 'aire-cyber-nevisca', plano: 'medio', f: 1.15, y: 0, alto: ALTO, ancho: 700, deriva: -74, cae: 44, alfa: 0.8, late: 0.18, ritmo: 0.47, suena: 'viento' }),
    capa({ pieza: 'aire-cyber-cerca', plano: 'cerca', f: 1.75, y: 420, alto: 220, ancho: 1600 }),
  ],
  // Los astilleros: la bruma del río detrás del muelle, el vaho que sube del agua y los fierros del muelle fuera de foco.
  'los-astilleros': [
    // Tanda 3 de `D-91`: la bruma de atrás ahora está impresa en lo lejano, entre la otra orilla y el carguero.
    // En su lugar va **el río**: una franja angosta, pegada al muelle, de destellos de sodio y rayas de tiza
    // que la corriente lleva de costado. Es chica: es agua que se mueve, no una capa de pantalla. Tercera vuelta: llega
    // hasta la otra orilla (128 de alto), y el carguero va pintado encima de ella, así no le corre por el casco.
    capa({ pieza: 'aire-astillero-rio', plano: 'fondo', f: 0.9, y: 312, alto: 128, ancho: 1200, deriva: 20, alfa: 0.86, late: 0.14, ritmo: 0.9 }),
    capa({ pieza: 'aire-astillero-vaho', plano: 'medio', f: 1.1, y: 300, alto: 340, ancho: 1400, deriva: 11, alfa: 0.75, late: 0.14, ritmo: 0.29, abre: 0.45 }),
    capa({ pieza: 'aire-astillero-cerca', plano: 'cerca', f: 1.75, y: 420, alto: 220, ancho: 1600 }),
  ],
  // El infierno: el humo que se arrastra por el damero y la ceniza encendida que sube. Es un recinto (una sola capa), y el aire le da el fondo que no tenía.
  'el-infierno': [
    // El calor que tiembla (hebras claras que vibraban contra la pared) se probó en la segunda vuelta de la
    // tanda 2 de `D-91` y se sacó en la tercera: en una tira de seis cuadros no se leía, y era una capa más.
    capa({ pieza: 'aire-infierno-humo', plano: 'medio', f: 1.15, y: 250, alto: 390, ancho: 1300, deriva: 8, alfa: 0.8, late: 0.14, ritmo: 0.27, abre: 0.4 }),
    capa({ pieza: 'aire-infierno-ceniza', plano: 'cerca', f: 1.5, y: 0, alto: ALTO, ancho: 800, deriva: 9, cae: -34, alfa: 0.9, late: 0.1, ritmo: 0.9 }),
  ],
  // La ruta (tercera ronda): la bruma baja del horizonte, el polvo que levantan los fierros y los pastos de la banquina.
  'la-ruta': [
    capa({ pieza: 'aire-ruta-bruma', plano: 'fondo', f: 0.6, y: 110, alto: 320, ancho: 1200, deriva: 4, alfa: 0.7, late: 0.1, ritmo: 0.2 }),
    capa({ pieza: 'aire-ruta-polvo', plano: 'medio', f: 1.2, y: 410, alto: 230, ancho: 1300, deriva: 46, alfa: 0.55, late: 0.25, ritmo: 0.41, abre: 0.2 }),
    capa({ pieza: 'aire-ruta-cerca', plano: 'cerca', f: 1.75, y: 420, alto: 220, ancho: 1600, mece: 3, ritmoMece: 0.9 }),
  ],
  // Los tres recintos que siguen son de una sola capa y cada uno viste la mano de su disco: el aire
  // no es aerógrafo ahí. En el bajo es crayón (*Gulp!* y la contratapa de *Un baión*): vaho rayado
  // sobre el agua y juncos.
  'el-bajo': [
    capa({ pieza: 'aire-bajo-vaho', plano: 'medio', f: 1.1, y: 380, alto: 260, ancho: 1300, deriva: 7, alfa: 0.7, late: 0.16, ritmo: 0.3, abre: 0.4 }),
    capa({ pieza: 'aire-bajo-cerca', plano: 'cerca', f: 1.75, y: 440, alto: 200, ancho: 1600, mece: 4, ritmoMece: 0.7 }),
  ],
  // Los techos (rehechos en la cuarta ronda): el humo de las chimeneas, a rayas de pastel claras como
  // el cielo de *Un baión*, y la ropa tendida que cruza arriba y lejos, de antena a antena, y se hamaca.
  // No llevan nada pegado a la cámara: abajo, el baldío ya tiene sus yuyos.
  'los-techos': [
    capa({ pieza: 'aire-techos-ropa', plano: 'medio', f: 0.72, y: 150, alto: 190, ancho: 1600, mece: 5, ritmoMece: 0.9, alfa: 0.9 }),
    capa({ pieza: 'aire-techos-humo', plano: 'medio', f: 0.85, y: 40, alto: 380, ancho: 1300, deriva: -11, alfa: 0.55, late: 0.14, ritmo: 0.33, mece: 6, ritmoMece: 0.5 }),
  ],
  // La prisión es madera tallada (*Oktubre*): el frío es un rayado de gubia a ras del piso, y lo
  // pegado a la cámara son los barrotes, de arriba abajo. Se mira desde otra celda.
  'la-prision': [
    capa({ pieza: 'aire-prision-frio', plano: 'medio', f: 1.1, y: 330, alto: 310, ancho: 1300, deriva: 5, alfa: 0.42, late: 0.14, ritmo: 0.26, abre: 0.45 }),
    capa({ pieza: 'aire-prision-rejas', plano: 'cerca', f: 1.75, y: 0, alto: ALTO, ancho: 1500 }),
  ],
  // Las cuatro que faltaban (quinta ronda). La mesa: el humo que sube, fino, del lado de la olla. Es
  // tinta plana con grano, como el afiche de *La mosca y la sopa*: volutas de papel, no una nube.
  'la-mesa': [
    capa({ pieza: 'aire-mesa-humo', plano: 'medio', f: 1.1, y: 0, alto: ALTO, ancho: 900, deriva: 4, cae: -15, alfa: 0.55, late: 0.12, ritmo: 0.3, mece: 5, ritmoMece: 0.5 }),
    // Las moscas en capa (un puñado suelto que derivaba sobre la mesa) entraron en la primera vuelta de la tanda 2
    // de `D-91` y se fueron en la tercera, por la cuenta: medida en pares contra main, la mesa pasaba del +15 %.
    // Quedan las moscas que importan: la del elenco, el moscón del vaso y el moscardón que cruza (`VIDAS`).
  ],
  // El templo: el incienso, que sube en hebras tibias entre los focos de la guirnalda.
  'el-templo': [
    // Las ofrendas (sexta ronda): velas, platitos y el humo que baja, en el piso, entre el medallón y el
    // papel picado. Van con el piso (`f` 1) y titilan apenas todas juntas.
    capa({ pieza: 'aire-templo-ofrendas', plano: 'medio', f: 1, y: 440, alto: 180, ancho: 1940, alfa: 0.94, late: 0.06, ritmo: 7 }),
    // El humo que bajaba (séptima ronda) se sacó en la octava: era la segunda capa de pantalla entera
    // del templo y, medido con la CPU ×4, costaba entre 2 y 5 ms por cuadro sobre una escena que sola ya gasta 15.
    capa({ pieza: 'aire-templo-incienso', plano: 'medio', f: 1.15, y: 0, alto: ALTO, ancho: 900, deriva: -3, cae: -11, alfa: 0.6, late: 0.14, ritmo: 0.26, mece: 7, ritmoMece: 0.4 }),
  ],
  // El árbol: las hojas que se le caen, y la racha que las lleva de costado cuando sopla en la copa.
  'el-arbol': [
    // Lo que cuelga de las ramas grandes se hamacó en una capa de aire en la segunda vuelta de la tanda 3 de `D-91`,
    // y en la tercera salió de acá: son piezas del piso que la isla gira desde su nudo (`COLGANTES`, `arte-bonete.ts`).
    capa({ pieza: 'aire-arbol-racha', plano: 'medio', f: 1.2, y: 60, alto: 400, ancho: 1300, deriva: -70, alfa: 0.34, late: 0.3, ritmo: 0.37, mece: 10, ritmoMece: 0.6, suena: 'viento' }),
    capa({ pieza: 'aire-arbol-hojas', plano: 'cerca', f: 1.4, y: 0, alto: ALTO, ancho: 900, deriva: -16, cae: 30, alfa: 0.95, mece: 12, ritmoMece: 0.9 }),
  ],
  // El galpón (`D-91`, tanda 2): la gente es la mitad del recital. El humo del escenario, que baja sobre
  // los del fondo (trae adentro el polvo que ya había), y el pogo, la fila del medio, que salta. La fila
  // grande va en `frente`.
  // Segunda vuelta: el pogo son **dos capas que se alternan**, montón por medio, y saltan a contratiempo:
  // el de al lado siempre está en otro momento del salto. Se probó partir una sola capa en ocho gajos con
  // su salto cada uno (una ola de verdad): medido con control, duplicaba el tiempo de cuadro, y se sacó.
  // Para hacerle lugar a la segunda se fue lo pegado a la cámara, que eran bultos negros y era lo que menos sumaba.
  'el-galpon': [
    // Tercera vuelta, por la cuenta: las tres capas se achicaron un tercio (lo que cuesta una capa es su
    // superficie). El humo ya no baja de la tercera fila, y el pogo termina donde lo tapa la fila grande:
    // de ahí para abajo era gente negra detrás de gente negra.
    capa({ pieza: 'aire-galpon-humo', plano: 'medio', f: 1.06, y: 296, alto: 176, ancho: 1300, deriva: -7, alfa: 0.74, late: 0.16, ritmo: 0.29, abre: 0.35 }),
    capa({ pieza: 'aire-galpon-pogo', plano: 'medio', f: 1.12, y: 400, alto: 164, ancho: 1400, salta: 13, ritmoSalta: 5.6 }),
    capa({ pieza: 'aire-galpon-pogo-b', plano: 'medio', f: 1.17, y: 400, alto: 164, ancho: 1400, salta: 15, ritmoSalta: 5.6, faseSalta: 1.25 }),
  ],
};

/** Las capas de aire de una región, de atrás para adelante adentro de cada plano; vacío si no tiene. */
export const aireDe = (region: string, plano: Plano): readonly CapaDeAire[] => (AIRE[region] ?? []).filter((c) => c.plano === plano);

/** Lo que una capa repite para arriba, en unidades; cero, la que no cae ni sube. */
export const altoDeBaldosa = (c: CapaDeAire): number => (c.cae !== 0 ? c.alto : 0);

/** El resto que siempre da entre 0 y `m`, también con números negativos. */
export const resto = (v: number, m: number): number => ((v % m) + m) % m;

/**
 * Cuánto se corre una capa de aire, en unidades de escena: de costado, entre `-ancho` y 0, y para
 * abajo, entre 0 y el alto de su baldosa. `cam` es lo caminado y `t` el reloj. `suelta`: la capa
 * está en la vista quieta y hay que correrla entera (`f · cam`); si no, viaja con la tira, que ya
 * se corrió `cam`, y solo le falta la diferencia.
 */
export function corridaDeAire(c: CapaDeAire, cam: number, t: number, suelta: boolean): { x: number; y: number } {
  const paralaje = (suelta ? c.f : c.f - 1) * cam;
  const alto = altoDeBaldosa(c);
  const hamaca = c.mece ? Math.sin(t * c.ritmoMece) * c.mece : 0;
  const x = -resto(paralaje - c.deriva * t - hamaca, c.ancho);
  return { x: x === 0 ? 0 : x, y: alto ? resto(c.cae * t, alto) : 0 };
}

/**
 * Cuánto bajó una capa que salta, en unidades de escena: de 0 (arriba, donde está impresa) a `salta`
 * (apoyada). Es el rebote de una pelota: sube rápido, cuelga y cae; y la fuerza va y viene, porque un
 * pogo no salta parejo toda la noche. Las que no saltan, cero.
 */
export function saltoDeAire(c: CapaDeAire, t: number): number {
  if (!c.salta) return 0;
  const ganas = 0.45 + 0.55 * Math.sin(t * 0.21 + c.faseSalta * 1.7) ** 2;
  return c.salta * (1 - Math.abs(Math.sin(t * c.ritmoSalta + c.faseSalta)) * ganas);
}

/**
 * El alfa de una capa en el momento `t`. `anda`, de 0 (quieto) a 1 (caminando a paso pleno), la
 * deshace lo que diga `abre`. Nunca menos que cero ni más que uno.
 */
export function alfaDeAire(c: CapaDeAire, t: number, anda: number): number {
  const a = (c.alfa + Math.sin(t * c.ritmo + c.ancho) * c.late) * (1 - c.abre * Math.min(1, Math.max(0, anda)));
  return Math.min(1, Math.max(0, a));
}

/**
 * Cuánto queda de una capa con la lupa en `z` (`lupa.ts`), de 0 a 1. Acercarse es meterse adentro
 * del aire: las matas pegadas a la cámara quedan atrás (si no, la lupa las agranda y tapan justo lo
 * que se fue a mirar), y la niebla del medio afloja. Lo de atrás del piso y lo que cae quedan igual.
 */
export function despejeDeLupa(plano: Plano, cae: boolean, z: number): number {
  const k = Math.min(1, Math.max(0, z - 1));
  if (plano === 'cerca' && !cae) return Math.max(0, 1 - k * 1.6);
  if (plano === 'medio') return 1 - k * 0.45;
  return 1;
}

/* ------------------------------------------------------------------
   La luz que se ve en el aire (segunda ronda)
   ------------------------------------------------------------------ */

/**
 * Una luz: una forma soplada **impresa** (un cono, un resplandor) clavada en un punto de una capa,
 * que la isla gira, agranda y le cambia el alfa. No es un `glow`, ni una sombra, ni un modo de
 * mezcla: es una mancha de aerógrafo con grano, como el resplandor de cualquier tapa, que se mueve.
 */
export interface Luz {
  pieza: string;
  /** La velocidad de la capa en la que está clavada: 1, el piso. */
  f: number;
  /** Dónde está clavada, en unidades de esa capa: la boca del farol, el centro de la brasa. */
  x: number;
  y: number;
  /** La caja de la pieza, medida desde ese punto: x, y, ancho, alto. */
  caja: readonly [number, number, number, number];
  /** El vaivén: cuántos grados para cada lado y a qué ritmo (radianes por segundo). */
  vaiven: number;
  ritmo: number;
  /** El alfa quieta y lo que cambia. */
  alfa: number;
  late: number;
  /** Cómo cambia: `titila` como un tubo viejo, `late` como un corazón (dos golpes y una pausa), `barre` parejo. */
  pulso: 'titila' | 'late' | 'barre';
  /** Cuánto crece con el pulso, en partes de su tamaño. */
  crece: number;
  /** Para dónde apunta, en grados: 0 para abajo (un farol), -90 para la derecha (un faro). */
  rumbo?: number;
  /** Si va colgada de un bicho que se mueve (el bondi): su `id`. Entonces `x` se mide desde él. */
  sigue?: string;
  /** Si suena (`entorno.ts`): el tubo que zumba y se corta cuando titila, la brasa que chisporrotea al latir. */
  suena?: 'zumbido' | 'chispa';
  /**
   * La luz toca a los bichos (quinta ronda): a cuántos de los que tiene cerca les prende un filo
   * cuando les pasa por encima, con qué pieza, y hasta qué ángulo (en grados, a cada lado del haz).
   */
  filo?: { pieza: string; cuantos: number; abre: number };
  /**
   * Lo que la luz le prende a lo impreso (`D-91`, tanda 2, tercera vuelta): piezas con el canto encendido
   * de algo que no es un títere (la gente del galpón), cada una en su zona. La isla le sube el alfa a la
   * zona a la que apunta el haz (`angulo`, en grados; `abre`, a cada lado). `f` y `caja`: la capa con la
   * que va y dónde, en unidades de esa capa.
   */
  cantos?: readonly { pieza: string; f: number; caja: readonly [number, number, number, number] }[];
  /** La altura, en unidades del piso, a la que el haz llega a lo que prende (las cabezas de la fila grande). */
  cantosEn?: number;
}

/**
 * Dónde cae el haz de una luz, en unidades de una capa que va a velocidad `f` (cuarta vuelta de la tanda 2
 * de `D-91`). El haz sale de `(x, y)` del piso apuntando `grados` (0, para abajo; positivo, para la
 * izquierda) y llega a la altura `hasta`. La luz va con el piso y lo que prende con otra capa: lo que en
 * el piso está en `x` se ve, con la cámara en `cam` (unidades de escena), donde esa capa tiene `x + (f − 1)·cam`.
 */
export function dondeCaeElHaz(x: number, y: number, grados: number, hasta: number, f: number, cam: number): number {
  return x - Math.tan((grados * Math.PI) / 180) * (hasta - y) + (f - 1) * cam;
}

/** Cuánto le toca a una zona de canto, de 0 a 1, con el haz cayendo en `xf` de su capa: de lleno en el medio y nada a tres cuartos de su ancho. */
export function tocaLaZona(xf: number, caja: readonly [number, number, number, number]): number {
  const k = 1 - Math.abs(xf - (caja[0] + caja[2] / 2)) / (caja[2] * 0.7);
  return k <= 0 ? 0 : k * k * (3 - 2 * k);
}

/**
 * Las zonas de la fila grande del galpón que el seguidor alcanza a barrer, en unidades de la capa de
 * adelante (que va a 1,3). Cubren todo lo que puede caer bajo el haz: el seguidor barre del 1640 al 2060
 * del piso, y eso, según por dónde vaya la cámara, es del 1880 al 2660 de la capa de adelante (lo mide el test, en un teléfono y a 1280).
 */
const CANTOS_DEL_GALPON = [
  { pieza: 'canto-galpon-0', f: 1.3, caja: [1830, 400, 380, 240] },
  { pieza: 'canto-galpon-1', f: 1.3, caja: [2110, 400, 380, 240] },
  { pieza: 'canto-galpon-2', f: 1.3, caja: [2390, 400, 380, 240] },
] as const;

/**
 * Las luces de cada región, una por región como mucho: es una superficie más que el teléfono compone.
 * En los astilleros, el cono del farol de sodio del muelle, que se hamaca con el viento y barre la
 * bruma. En el infierno, la brasa al pie de Luzbelito, que late sobre el humo. En Cybersiberia, el
 * haz de la cámara que vigila la nieve desde la chapa.
 */
export const LUCES: Readonly<Record<string, readonly Luz[]>> = {
  // El farol está en `ASTILLERO.farol` (440 de 900, a lo largo ×2400/900), y su boca a 30 a la derecha del poste.
  'los-astilleros': [{ pieza: 'luz-astillero-cono', f: 1, x: 1203, y: 244, caja: [-170, -14, 340, 380], vaiven: 8, ritmo: 0.55, alfa: 0.62, late: 0.16, pulso: 'titila', crece: 0, suena: 'zumbido', rumbo: -24, filo: { pieza: 'filo-sodio', cuantos: 3, abre: 60 } }],
  'el-infierno': [{ pieza: 'luz-infierno-brasa', f: 1, x: 452, y: 486, caja: [-260, -230, 520, 340], vaiven: 0, ritmo: 3.9, alfa: 0.56, late: 0.36, pulso: 'late', crece: 0.07, suena: 'chispa' }],
  cybersiberia: [{ pieza: 'luz-cyber-haz', f: 1, x: 1560, y: -6, caja: [-190, -14, 380, 600], vaiven: 15, ritmo: 0.33, alfa: 0.34, late: 0.05, pulso: 'barre', crece: 0 }],
  // La ruta: los faros del último bondi, que van con él y alumbran el polvo. El bondi anda para la derecha.
  'la-ruta': [{ pieza: 'luz-ruta-faros', f: 1, x: 286, y: 446, caja: [-110, -14, 220, 300], vaiven: 1.6, ritmo: 6.5, alfa: 0.72, late: 0.06, pulso: 'barre', crece: 0, rumbo: -90, sigue: 'el-zumba', filo: { pieza: 'filo-sodio', cuantos: 3, abre: 44 } }],
  // El bajo: el reflejo del pucho de Pierre en el agua, una escalerita de rayas de crayón que tiembla. Pierre está en 486, y el recinto arranca en -250.
  // La pastura (`D-91`, segunda vuelta): no es una luz, es la rueda del primer molino, que gira. Va clavada en
  // lo lejano (`f` de `VELOCIDAD.lejos`), en el eje (`EJE_DEL_MOLINO`, `arte-arboles.ts`). El vaivén es tan
  // ancho y tan lento que es una vuelta tras otra, y cada tanto afloja y cambia de mano, como con el viento.
  'la-pastura': [{ pieza: 'luz-pastura-rueda', f: 0.45, x: 188, y: 220, caja: [-24, -24, 48, 48], vaiven: 1500, ritmo: 0.03, alfa: 1, late: 0, pulso: 'barre', crece: 0 }],
  // La mesa (`D-91`, tanda 2): la lámpara que cuelga del techo y se hamaca. Es de papel, como todo ahí: el
  // cono cortado a mano y casi sin tinta. Segunda vuelta: va clavada en la pared (`f` de lo lejano), en el
  // paño libre entre la puerta del fondo y la ventana, así no le cruza por delante a la ventana ni a un
  // retrato en ninguna pantalla; y el cono termina en la línea de la mesa, que es donde termina la pared.
  'la-mesa': [{ pieza: 'luz-mesa-lampara', f: 0.8, x: 952, y: -8, caja: [-130, -4, 260, 340], vaiven: 5.5, ritmo: 0.66, alfa: 0.94, late: 0.04, pulso: 'barre', crece: 0 }],
  // El árbol (`D-91`, tanda 3): el farol de cobre que cuelga de la rama grande, en la primera pantalla. Se
  // hamaca apenas y titila como una llama. La boca es `FAROL` (`arte-bonete.ts`); el test mira que coincidan.
  'el-arbol': [{ pieza: 'luz-arbol-farol', f: 1, x: 322, y: 225, caja: [-100, -14, 200, 330], vaiven: 5, ritmo: 0.5, alfa: 0.46, late: 0.14, pulso: 'titila', crece: 0 }],
  'el-bajo': [{ pieza: 'luz-bajo-reflejo', f: 1, x: 806, y: 492, caja: [-70, -12, 140, 140], vaiven: 2.5, ritmo: 1.7, alfa: 0.62, late: 0.2, pulso: 'titila', crece: 0 }],
  // Los techos: el farol del baldío (650, 130 en su recinto), que titila.
  'los-techos': [{ pieza: 'luz-techos-farol', f: 1, x: 650, y: 140, caja: [-180, -14, 360, 420], vaiven: 2.5, ritmo: 0.7, alfa: 0.4, late: 0.16, pulso: 'titila', crece: 0, suena: 'zumbido', filo: { pieza: 'filo-lila', cuantos: 4, abre: 34 } }],
  // La prisión: el reflector del muro, que barre. Es de gubia: canto duro y rayado, sin soplo. Está
  // clavado lejos de donde se para la drácula (630) y barre ligero: las rayas le pasan por la cara, no se le quedan.
  'la-prision': [{ pieza: 'luz-prision-reflector', f: 1, x: 1010, y: -6, caja: [-220, -14, 440, 660], vaiven: 26, ritmo: 0.44, alfa: 0.32, late: 0.05, pulso: 'barre', crece: 0, filo: { pieza: 'filo-papel', cuantos: 4, abre: 18 } }],
  // El templo (quinta ronda): un foco de la guirnalda, el del medio, que cae sobre el medallón de Momo y
  // titila. La guirnalda está en (450, 240) de su recinto, que arranca en -300.
  'el-templo': [{ pieza: 'luz-templo-foco', f: 1, x: 556, y: 218, caja: [-170, -14, 340, 400], vaiven: 3, ritmo: 0.6, alfa: 0.42, late: 0.14, pulso: 'titila', crece: 0, suena: 'zumbido' }],
  // El galpón: el seguidor de atrás, arriba a la derecha (`GALPON.luz`, a lo largo), que barre el
  // escenario y le pega al polvo.
  'el-galpon': [{ pieza: 'luz-galpon-seguidor', f: 1, x: 2027, y: 64, caja: [-200, -14, 400, 460], vaiven: 22, ritmo: 0.36, alfa: 0.4, late: 0.06, pulso: 'barre', crece: 0, rumbo: 18, cantos: CANTOS_DEL_GALPON, cantosEn: 530 }],
};

/**
 * El filo a medida (sexta ronda). La medialuna de la quinta ronda era la misma para todos: un
 * arco estirado al ancho del bicho. Esto es el contorno de **cada títere**: de cada una de sus
 * piezas impresas se saca, en la imprenta, el canto que mira para arriba (lo que está en la pieza y
 * no está un poco más arriba), en la tinta de la luz de su región. La isla lo pone encima de la
 * pieza, adentro del mismo grupo, así que se mueve con ella; y lo prende cuando el haz le pasa.
 *
 * Solo sirve para los títeres hechos de piezas. Los bichos que están pintados adentro del piso (el
 * balde de las almejas, la jaula de la fiera) no tienen pieza de la que sacarlo: siguen con la medialuna.
 */
export const FILO_PROPIO: Readonly<Record<string, { prefijos: readonly string[]; tinta: string }>> = {
  // La prisión es blanco sobre negro: un canto blanco no se ve sobre una figura blanca. Va en el rojo
  // de las banderas de *Oktubre*, que corta sobre los dos (`D-90`, séptima ronda).
  'la-prision': { prefijos: ['esclavo-', 'pichon-', 'dracula-', 'encadenado-'], tinta: 'var(--disco-oktubre-tinta)' },
  'los-techos': { prefijos: ['atila-', 'limon-', 'psicopata-', 'perro-', 'dinamita-'], tinta: 'var(--entorno-baion-luz)' },
  // El botija es moreno y de remera azul, bajo una luz naranja: un canto naranja se le perdía. Va en
  // la tiza clara de los astilleros, que es la que dibuja los cantos de todo el muelle (octava ronda).
  'los-astilleros': { prefijos: ['botija-'], tinta: 'var(--entorno-astillero-tiza-clara)' },
  // `D-91`, segunda vuelta: los faros del bondi le prenden el canto a los que están en la banquina.
  'la-ruta': { prefijos: ['taxi-', 'desencarnada-', 'piba-'], tinta: 'var(--entorno-templo-foco)' },
};

/**
 * Lo que asoma lejos (`D-91`, tanda 2, segunda vuelta): una figura impresa, clavada en lo lejano, que no
 * se ve hasta que quien mira se queda quieto `espera` segundos. En la mesa, alguien que se para en la
 * puerta del fondo. Es una imagen más, chica, que se corre con la capa de atrás (`f`).
 */
export interface Visita {
  pieza: string;
  f: number;
  caja: readonly [number, number, number, number];
  espera: number;
}

export const VISITAS: Readonly<Record<string, Visita>> = {
  'la-mesa': { pieza: 'camino-mesa-visita', f: 0.8, caja: [644, 132, 84, 192], espera: 6 },
  // Tanda 3 de `D-91`, las tres en la primera pantalla. Los astilleros: un gato que se sube a la pila de
  // containers (va con el piso, y asoma de atrás del canto de la pila). Cybersiberia: algo enorme que camina
  // en el blanco del horizonte. El árbol: a la luna se le abre un ojo. Las cajas son las de `arte-puerto.ts`,
  // `arte-tundra.ts` y `arte-bonete.ts`, y `aire.test.ts` mira que coincidan.
  'los-astilleros': { pieza: 'camino-astillero-gato', f: 1, caja: [112, 138, 66, 62], espera: 6 },
  cybersiberia: { pieza: 'camino-cyber-coloso', f: 0.6, caja: [620, 160, 96, 176], espera: 6 },
  'el-arbol': { pieza: 'camino-arbol-ojo', f: 0.5, caja: [638, 210, 104, 104], espera: 7 },
};

/**
 * Lo que se va si lo mirás de cerca (cuarta vuelta): al revés que la visita, está siempre, y se apaga
 * cuando se saca la lupa. En la mesa, los dos ojos que miran para adentro por la ventana. `espera` no se usa.
 */
export const HUIDIZOS: Readonly<Record<string, Visita>> = {
  'la-mesa': { pieza: 'camino-mesa-ojos', f: 0.8, caja: [1212, 172, 30, 14], espera: 0 },
};

/**
 * Lo que está parado entre lo lejano y el piso (`D-91`, tanda 3, segunda vuelta): una imagen clavada, a la vista
 * siempre, que se corre a su propia velocidad. Es la lección de la tanda 1 (lo más cercano del fondo va aparte,
 * a otra velocidad) para algo que no se repite: una baldosa de aire lo mostraría de nuevo cada tantas pantallas.
 * En los astilleros, el carguero: va más rápido que la otra orilla y más despacio que el muelle.
 */
export const PLANOS: Readonly<Record<string, readonly { pieza: string; f: number; caja: readonly [number, number, number, number] }[]>> = {
  'los-astilleros': [{ pieza: 'camino-astillero-carguero', f: 0.72, caja: [820, -12, 420, 400] }],
};

/** Las piezas que no son cuerpo: el humo, los fogonazos, los ojos, la boca, los muebles. A esas la luz no les prende un canto. */
const SIN_FILO =
  /-(humo|chispa|fogonazo|esquirlas|luz|brillo|gotas|estrella|fiebre|copo|pluma|plumon|hollin-[a-z]+|canto|agujero|rayita|iris-\d|pupila|parpado|ceja|boca|sirena-chica|reja|catre|alfeizar|pizarra|jamba|lata|caballete|cuadro|bandera|boleto|forro-\d|haz|banquina|yuyos|pompas|zeta|rubor|dia|libre|doble|cuencas|ojo-\d|pupila-\d|cejas|almohadon)$/;

/** Si una pieza tiene su filo impreso, en esa región. */
export function tieneFiloPropio(pieza: string, region: string): boolean {
  const de = FILO_PROPIO[region];
  // Los recortes de la tapa real (`-real-`) no los imprime la casa: no tienen canto que sacarles.
  return !!de && de.prefijos.some((p) => pieza.startsWith(p)) && !SIN_FILO.test(pieza) && !pieza.includes('-real-');
}

/** Dónde queda el filo impreso de una pieza. */
export const rutaDelFilo = (pieza: string): string => `/bestiario/filo-de-${pieza}.webp`;

/** Cuánto mide el filo, en píxeles de la imagen impresa: lo que se corre la pieza para arriba para sacarlo. */
export const GROSOR_DEL_FILO = 12;

/** Cuánto le pega una luz a algo que está a `angulo` grados de su haz, de 0 a 1: de lleno en el medio y nada desde `abre`. */
export function tocaLaLuz(angulo: number, abre: number): number {
  const k = 1 - Math.abs(angulo) / abre;
  return k <= 0 ? 0 : k * k * (3 - 2 * k);
}

/** El latido: dos golpes seguidos y una pausa, de 0 a 1. `u` es la fase, en vueltas. */
export function latido(u: number): number {
  const k = u - Math.floor(u);
  const golpe = (centro: number, ancho: number): number => Math.exp(-(((k - centro) / ancho) ** 2));
  return Math.min(1, golpe(0.12, 0.07) + 0.7 * golpe(0.36, 0.08));
}

/** Cómo está una luz en el momento `t`: cuánto giró, su alfa y su tamaño. */
export function estadoDeLuz(l: Luz, t: number): { giro: number; alfa: number; escala: number } {
  const giro = l.vaiven ? Math.sin(t * l.ritmo) * l.vaiven + Math.sin(t * l.ritmo * 2.7 + 1.3) * l.vaiven * 0.12 : 0;
  // De -1 a 1 (o de 0 a 1 el latido): lo que el pulso le suma al alfa.
  const pulso =
    l.pulso === 'late'
      ? latido((t * l.ritmo) / (Math.PI * 2)) * 2 - 0.6
      : l.pulso === 'titila'
        ? Math.sin(t * 7.3) * 0.35 + Math.sin(t * 13.1 + 2) * 0.25 + (Math.sin(t * 1.9) > 0.93 ? -1.4 : 0.2)
        : Math.sin(t * l.ritmo * 2);
  const alfa = Math.min(1, Math.max(0, l.alfa + pulso * l.late));
  return { giro, alfa, escala: 1 + (l.crece ? l.crece * Math.max(0, pulso) : 0) };
}

/* ------------------------------------------------------------------
   Lo que aparece si te quedás quieto (segunda ronda)
   ------------------------------------------------------------------ */

/**
 * Los ojos sin dueño. Si te quedás quieto unos segundos, en lo oscuro se abren unos ojos que no son
 * de ningún bicho de la libreta. Parpadean, y **se apagan si los mirás**: caminar, tocarles cerca,
 * pasarles el mouse o sacar la lupa los cierra. Vuelven más tarde, en otro lado.
 *
 * No se tocan ni abren ficha: no son un bicho, son el monte mirando. Con movimiento reducido no están.
 */
export interface Acecho {
  /** La pieza impresa: el par de ojos de la región. */
  pieza: string;
  /** Lo que mide la pieza, en unidades de escena. */
  ancho: number;
  alto: number;
  /**
   * Dónde pueden abrirse: `[de costado, de 0 a 1 de la vista; altura, en unidades de escena; tamaño]`.
   * Siempre en lo oscuro: entre las matas de abajo, o lejos, entre lo de atrás.
   */
  lugares: readonly (readonly [number, number, number])[];
  /** Cuánto hay que quedarse quieto para que se abran, en segundos: entre tanto y tanto. */
  espera: readonly [number, number];
  /** Cuánto se quedan mirando, si nadie los mira. */
  dura: readonly [number, number];
}

export const ACECHOS: Readonly<Record<string, Acecho>> = {
  'el-monte': { pieza: 'acecho-monte', ancho: 46, alto: 20, lugares: [[0.16, 596, 1], [0.8, 604, 1.15], [0.5, 612, 0.9], [0.3, 268, 0.5], [0.72, 252, 0.45], [0.55, 196, 0.38], [0.12, 226, 0.42], [0.88, 172, 0.34]], espera: [5, 6.5], dura: [6, 9] },
  'la-pastura': { pieza: 'acecho-monte', ancho: 46, alto: 20, lugares: [[0.14, 600, 1], [0.84, 606, 1.1], [0.24, 299, 0.34], [0.66, 298, 0.32], [0.46, 332, 0.4]], espera: [5, 6.5], dura: [6, 9] },
  cybersiberia: { pieza: 'acecho-cyber', ancho: 46, alto: 20, lugares: [[0.14, 598, 1], [0.82, 606, 1.1], [0.36, 168, 0.6], [0.7, 232, 0.6]], espera: [5, 6.5], dura: [5, 8] },
  'los-astilleros': { pieza: 'acecho-astillero', ancho: 46, alto: 30, lugares: [[0.2, 600, 1], [0.78, 606, 1.1], [0.62, 372, 0.55], [0.3, 380, 0.5]], espera: [5, 6.5], dura: [6, 9] },
  'el-infierno': { pieza: 'acecho-infierno', ancho: 46, alto: 20, lugares: [[0.18, 606, 1.1], [0.8, 610, 1.2], [0.5, 616, 0.9]], espera: [5, 6.5], dura: [5, 8] },
  // La ruta: algo en la banquina, o lejos, al borde del asfalto.
  'la-ruta': { pieza: 'acecho-monte', ancho: 46, alto: 20, lugares: [[0.16, 600, 1], [0.82, 606, 1.1], [0.3, 404, 0.5], [0.7, 396, 0.45]], espera: [5, 6.5], dura: [6, 9] },
  // El bajo: lo que mira desde el agua, con su reflejo.
  'el-bajo': { pieza: 'acecho-astillero', ancho: 46, alto: 30, lugares: [[0.2, 560, 0.9], [0.78, 590, 1.1], [0.5, 610, 1]], espera: [5, 6.5], dura: [6, 9] },
  // Los techos: los gatos, en lo negro de las medianeras.
  'los-techos': { pieza: 'acecho-monte', ancho: 46, alto: 20, lugares: [[0.2, 300, 0.6], [0.7, 330, 0.65], [0.45, 340, 0.55], [0.84, 612, 1]], espera: [5, 6.5], dura: [6, 9] },
  // La prisión: desde la celda de enfrente, en lo negro de arriba.
  'la-prision': { pieza: 'acecho-prision', ancho: 46, alto: 20, lugares: [[0.18, 190, 0.8], [0.8, 210, 0.85], [0.5, 150, 0.7]], espera: [5, 6.5], dura: [5, 8] },
  // La mesa: abajo del mantel, entre las patas de las sillas.
  'la-mesa': { pieza: 'acecho-monte', ancho: 46, alto: 20, lugares: [[0.2, 590, 0.9], [0.76, 600, 1], [0.5, 610, 0.85]], espera: [5, 6.5], dura: [6, 9] },
  // El templo: en lo negro de abajo, lejos de los focos.
  'el-templo': { pieza: 'acecho-infierno', ancho: 46, alto: 20, lugares: [[0.18, 560, 0.9], [0.8, 590, 1], [0.5, 606, 0.9]], espera: [5, 6.5], dura: [5, 8] },
  // El árbol: entre los yuyos de la llanura.
  'el-arbol': { pieza: 'acecho-monte', ancho: 46, alto: 20, lugares: [[0.16, 596, 1], [0.8, 604, 1.1], [0.42, 566, 0.7]], espera: [5, 6.5], dura: [6, 9] },
  // El galpón: alguien del público que se dio vuelta.
  'el-galpon': { pieza: 'acecho-monte', ancho: 46, alto: 20, lugares: [[0.22, 520, 0.7], [0.74, 540, 0.75], [0.5, 500, 0.6]], espera: [5, 6.5], dura: [5, 8] },
};

/* ------------------------------------------------------------------
   La vida del fondo (tercera ronda)
   ------------------------------------------------------------------ */

/**
 * Lo que pasa solo, lejos, de a uno y muy cada tanto: un pájaro que cruza, una estrella que se cae,
 * un barquito de papel que se lleva el agua. No se toca ni dice nada: premia al que mira. Es una
 * imagen impresa que cruza la pantalla con `transform`; con movimiento reducido no pasa nada.
 */
export interface Vida {
  pieza: string;
  /** Lo que mide la pieza, en unidades de escena, y cuánto se la achica (lo lejos que está). */
  ancho: number;
  alto: number;
  tam: number;
  /** La altura por la que cruza: de dónde a dónde, en unidades de escena. */
  y: readonly [number, number];
  /** Cuánto tarda en cruzar la pantalla, en segundos, y cada cuánto pasa uno. */
  dura: readonly [number, number];
  espera: readonly [number, number];
  /** Cuánto aletea (0, nada: una estrella, un barco) y cuánto se bambolea, en grados. */
  aletea: number;
  bamboleo: number;
  alfa: number;
  /** Si puede venir de cualquiera de los dos lados, o siempre de la izquierda (la estrella cae para un lado). */
  deLosDosLados: boolean;
  /** Siempre de la derecha: lo que lleva el viento, que en la pastura sopla para la izquierda (`D-91`). */
  alReves?: boolean;
  /** Lo que sube en el medio del cruce, en unidades: lo que alguien tiró vuela en arco (`D-91`, tanda 2). */
  arco?: number;
  /** Pasa por detrás del piso y de lo que está parado en él: el tren de la ruta, detrás de los postes. */
  atras?: boolean;
}

const AVE = { pieza: 'vida-ave', ancho: 40, alto: 18, tam: 0.55, y: [70, 150], dura: [9, 14], espera: [22, 40], aletea: 1, bamboleo: 0, alfa: 0.8, deLosDosLados: true } as const;

export const VIDAS: Readonly<Record<string, Vida>> = {
  // La lechuza del monte y la gaviota del río son la misma silueta lejana.
  'el-monte': AVE,
  // La pastura (`D-91`, cuarta vuelta): no un pájaro sino un vellón que el viento lleva rodando por el pasto,
  // para el mismo lado que la ola. Raro: uno cada medio minuto o más.
  'la-pastura': { pieza: 'vida-vellon', ancho: 22, alto: 16, tam: 1, y: [468, 520], dura: [6, 9], espera: [26, 48], aletea: 0, bamboleo: 38, alfa: 0.9, deLosDosLados: false, alReves: true },
  // Los astilleros (`D-91`, tanda 3): ya no la gaviota sino una chata con sus luces, que cruza el río despacio
  // por detrás del muelle y del ferry. Tarda medio minuto; pasa una cada minuto o más.
  'los-astilleros': { pieza: 'vida-chata', ancho: 150, alto: 26, tam: 1, y: [358, 358], dura: [26, 34], espera: [36, 70], aletea: 0, bamboleo: 0, alfa: 0.92, deLosDosLados: false, atras: true },
  // Los techos: un murciélago, más bajo y más rápido.
  'los-techos': { ...AVE, tam: 0.45, y: [120, 240], dura: [5, 8] },
  // La prisión: un pájaro blanco, de gubia, que pasa por arriba del muro. El único que sale.
  'la-prision': { ...AVE, pieza: 'vida-ave-papel', y: [40, 110], dura: [10, 15], alfa: 0.9 },
  // La ruta: una estrella que se cae.
  // La ruta (`D-91`, cuarta vuelta): ya no la estrella fugaz sino un tren, lejos, por el horizonte. Tarda
  // casi medio minuto en cruzar y pasa uno cada minuto o más: el que se queda lo ve.
  'la-ruta': { pieza: 'vida-tren', ancho: 280, alto: 22, tam: 0.62, y: [304, 304], dura: [24, 30], espera: [44, 80], aletea: 0, bamboleo: 0, alfa: 0.9, deLosDosLados: false, atras: true },
  // El bajo: un barquito de papel que se lleva el agua, despacio.
  // El árbol: el pájaro que vuelve a la copa. La mesa: una polilla, chica y rápida, arriba.
  'el-arbol': { ...AVE, y: [50, 120] },
  // El galpón (`D-91`, tanda 2): una zapatilla, de las que se pierden en el pogo. Vuela en arco por arriba
  // de la gente, dando vueltas, en tres segundos; una cada medio minuto.
  'el-galpon': { pieza: 'vida-zapatilla', ancho: 30, alto: 18, tam: 1, y: [452, 470], dura: [2.6, 3.4], espera: [22, 44], aletea: 0, bamboleo: 170, alfa: 1, deLosDosLados: true, arco: 150 },
  // La mesa (`D-91`, tanda 2): ya no una polilla sino un moscardón, gordo, que cruza zumbando por arriba de los platos.
  'la-mesa': { pieza: 'vida-moscardon', ancho: 34, alto: 22, tam: 0.9, y: [170, 250], dura: [3.2, 4.6], espera: [18, 32], aletea: 1, bamboleo: 9, alfa: 1, deLosDosLados: true },
  'el-bajo': { pieza: 'vida-barquito', ancho: 40, alto: 30, tam: 0.7, y: [500, 506], dura: [34, 46], espera: [14, 26], aletea: 0, bamboleo: 5, alfa: 0.9, deLosDosLados: true },
};

/**
 * Dónde está lo que cruza, para un avance `u` de 0 a 1: de costado en partes de la vista (entra y
 * sale por afuera), la altura en unidades, lo que aletea (de 0,3 a 1) y lo que se bambolea.
 */
export function pasoDeVida(v: Vida, u: number, t: number, alReves: boolean): { fx: number; y: number; aleteo: number; giro: number } {
  const k = Math.min(1, Math.max(0, u));
  const fx = alReves ? 1.15 - k * 1.3 : -0.15 + k * 1.3;
  // Un pájaro sube y baja apenas mientras cruza; lo que cae, cae derecho.
  const onda = v.aletea ? Math.sin(k * Math.PI * 3) * 6 : 0;
  return {
    fx,
    y: v.y[0] + (v.y[1] - v.y[0]) * k + onda - (v.arco ? Math.sin(k * Math.PI) * v.arco : 0),
    aleteo: v.aletea ? 0.3 + 0.7 * Math.abs(Math.sin(t * 7.5)) : 1,
    giro: v.bamboleo ? Math.sin(t * 1.3) * v.bamboleo : 0,
  };
}

/* ------------------------------------------------------------------
   El alivio: cuando el teléfono no da (tercera ronda)
   ------------------------------------------------------------------ */

/**
 * Si los cuadros vienen lentos, el camino se saca peso de encima, de a un escalón: primero lo de
 * atrás del piso (la bruma: es lo que menos se extraña), después la luz y la vida del fondo. La
 * niebla del medio y lo pegado a la cámara, que son las que hacen la escena, se quedan.
 *
 * `LENTO`: milisegundos por cuadro, promediados en una tanda de `TANDA` cuadros. 30 fps son 33 ms;
 * por encima de 28 ya se nota a tirones.
 */
export const ALIVIO = { lento: 28, tanda: 90, niveles: 2, /** Una tanda no dura más que esto, en milisegundos: a 10 cuadros por segundo, 90 cuadros serían nueve segundos de espera. */ tope: 2500 } as const;

/** El nivel de alivio que toca después de una tanda: sube de a uno, y no vuelve a bajar en la visita. */
export function alivioTras(nivel: number, msPorCuadro: number): number {
  return msPorCuadro > ALIVIO.lento ? Math.min(ALIVIO.niveles, nivel + 1) : nivel;
}

/** Con qué nivel se arranca: un teléfono que ya avisa que es flojo empieza sin la bruma de atrás. */
export function alivioDeEntrada(nucleos: number | undefined, memoria: number | undefined, region = ''): number {
  const flojo = (nucleos !== undefined && nucleos <= 2) || (memoria !== undefined && memoria <= 1) ? 1 : 0;
  return Math.max(flojo, ALIVIO_DE_LA_REGION[region] ?? 0);
}

/**
 * Las regiones que arrancan aliviadas en cualquier teléfono, porque su escena sola ya gasta casi todo
 * el cuadro. Cybersiberia (`D-90`, sexta ronda): quince bichos y la nieve que cae en toda la pantalla;
 * medida con la CPU ×4, su escena sola ya pasa del tope, y con todo el aire se va un tercio más arriba.
 * Arranca sin el vaho de atrás, que es lo que menos se extraña. La nieve no se toca: es la región.
 */
export const ALIVIO_DE_LA_REGION: Readonly<Record<string, number>> = { cybersiberia: 1 };

/**
 * Las regiones donde lo de adelante se corre con la lupa (`D-91`, tanda 2, quinta vuelta). Es la regla de
 * siempre («con la lupa, lo pegado a la cámara se desvanece»), que hasta acá solo cumplía el aire `cerca`:
 * en la mesa, el respaldo de una silla de adelante quedaba agrandado justo encima de lo que se había ido a
 * mirar (la puerta del fondo, la ventana), y en el galpón, la fila grande. Las demás regiones quedan como
 * estaban hasta que alguien las mire con la lupa.
 */
export const FRENTE_QUE_SE_CORRE: readonly string[] = ['la-mesa', 'el-galpon', 'los-astilleros', 'cybersiberia', 'el-arbol'];

/** A cuántos píxeles de los ojos un dedo o un mouse ya los está mirando. */
export const MIRADA = 84;

/**
 * El párpado de los ojos sin dueño: 1 abierto, cerca de 0 cerrado. Parpadean cada tanto, corto, con
 * un compás que depende de dónde están (así dos regiones no parpadean igual).
 */
export function parpadeo(t: number, semilla: number): number {
  const ciclo = 3.1 + (semilla % 7) * 0.31;
  const k = (t + semilla) % ciclo;
  return k < 0.14 ? 0.12 + 0.88 * Math.abs(k - 0.07) / 0.07 : 1;
}

/** A qué paso la niebla ya está abierta del todo, en unidades de escena por segundo. */
export const PASO_PLENO = 380;
