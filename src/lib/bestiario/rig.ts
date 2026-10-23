/**
 * La geometría de los recintos de noche y lo que la isla necesita para mover a los títeres
 * (`D-73`). Vive aparte de `arte.ts` y de `escenas.ts` a propósito: aquellos arman todos los
 * dibujos al cargarse, y si la isla los importara se llevaría el aerógrafo entero al teléfono y
 * lo correría al abrir la página. Esto son números, y `bestiario.test.ts` vigila que la isla
 * no importe otra cosa.
 */

import { ARMADO } from './recortes.ts';

/** La escena: un claro de noche, más ancho que un teléfono. Se recorre de costado. */
export const ESCENA = { ancho: 900, alto: 640 } as const;

/**
 * Lo que mide cada recinto de noche, de costado. Todos nacieron de 900; los que estaban muy
 * cargados se agrandan (pedido del usuario: *"agrandar el espacio de los entornos que están muy
 * cargados, o separar un poco bestias"*). Se agrandan **sin mover lo que ya estaba**: la escena de
 * 900 queda donde estaba, con su protagonista en el medio, y el dibujo sigue para afuera. Por eso
 * un recinto puede arrancar antes del cero: `x` es dónde empieza y `ancho` lo que mide. El baldío
 * crece solo a la derecha, porque el perro entra por el borde izquierdo, como en la tapa.
 */
export const MARCO_DEL_RECINTO: Readonly<Record<string, { readonly x: number; readonly ancho: number }>> = {
  'los-techos': { x: 0, ancho: 1500 },
  'la-prision': { x: -250, ancho: 1400 },
  'el-bajo': { x: -250, ancho: 1450 },
  'el-templo': { x: -300, ancho: 1500 },
};

/** El marco de un recinto de noche: los que no se agrandaron miden los 900 de siempre. */
export const marcoDelRecinto = (region: string): { readonly x: number; readonly ancho: number } =>
  MARCO_DEL_RECINTO[region] ?? { x: 0, ancho: ESCENA.ancho };
/** El palo, clavado en el medio de la pastura. */
export const PALO = { x: 450, y: 418 } as const;
/** Cuánto se aplasta el piso al verlo de costado: un punto (u, v) se ve en (x + u, y + v · ACHATE). */
export const ACHATE = 0.55;
/** El largo de la soga, en el piso: hasta acá llega el cordero. */
export const SOGA = 84;
/** La pastura, en pantalla. */
export const PASTURA = { rx: 262, ry: 138 } as const;

/**
 * Dónde acecha el lobo: detrás de la pastura, entre el monte y el piso. Asoma subiendo desde
 * atrás del borde de `monte-cerca` y se hunde de nuevo; `hundido` es cuánto baja para no verse.
 */
export const ACECHO = { desde: 200, hasta: 700, piso: 326, hundido: 190 } as const;

/** De píxeles de la tapa a unidades de la escena. */
export const ESCALA_LOBO = 0.2;
export const ESCALA_CORDERO = 0.15;

/** El cordero, más cerca cuanto más abajo en la pastura. */
export const profundidad = (y: number): number => 0.82 + 0.32 * ((y - (PALO.y - PASTURA.ry)) / (2 * PASTURA.ry));

/* ------------------------------------------------------------------
   Los protagonistas de tapa de la quinta vuelta: dónde va cada uno en su escena
   ------------------------------------------------------------------ */

/** Dónde entra el perro: por el borde izquierdo, como en la tapa. */
export const PERRO = { x: 0, y: 470, escala: 1.15 } as const;

/* ------------------------------------------------------------------
   Limón, por los techos del baldío (`D-73`, décima vuelta)
   ------------------------------------------------------------------ */

/**
 * Dónde gira cada pieza de Limón, en coordenadas de títere: el (0, 0) es la chapa entre los dos
 * pies, arriba es negativo, y mira para la derecha (la isla lo da vuelta cuando corre para el otro
 * lado). Lo dibuja `arte-baldio.ts` y lo mueve la isla.
 */
export const LIMON_ARMADO = {
  /** El limón: el centro de la fruta y sus dos radios. La punta, la del pezón, va adelante. */
  fruta: { centro: [0, -66], radio: [36, 31] },
  /** De acá cuelgan las piernas y los brazos. */
  caderas: [[-9, -40], [9, -40]],
  hombros: [[-30, -56], [18, -42]],
  /** El largo de una pierna, de la cadera a la suela, y de un brazo, del hombro a la mano. */
  pierna: 40,
  brazo: 28,
  /** El cabito con la hoja, arriba: la hoja gira acá. */
  cabito: [-6, -96],
  /** La boca abierta, que jadea: se achica y se agranda de arriba para abajo. */
  boca: [14, -52],
  /** Los ojos: el blanco, que se imprime, y la pupila, que la isla corre para mirar para atrás. */
  ojos: [
    { centro: [1, -75], radio: [8, 9.5] },
    { centro: [18, -74], radio: [7, 8.5] },
  ],
} as const;

/**
 * Por dónde corre: la chapa que remata la medianera del baldío (`baldio-chapa`). `piso` es el filo
 * de arriba, donde pisa, y es el mismo canto por donde camina el negro Atila (`ATILA.piso`); corre de `desde` a `hasta`, sin meterse arriba del perro.
 */
export const CHAPA = { arriba: 288, piso: 300, abajo: 314 } as const;
// Con los techos agrandados a la derecha (`MARCO_DEL_RECINTO`), Limón corre por la chapa nueva:
// arranca después del Atila y llega hasta el otro farol, y parado queda lejos de los gatos.
export const LIMON = { desde: 560, hasta: 1340, escala: 1.2, velocidad: 200 } as const;

/**
 * Las linternas del bloque: salen de afuera de la escena, arriba, una de cada lado, y barren los
 * techos entre dos ángulos (en grados, como `rotate()`: 0 es para la derecha, y crece hacia abajo).
 */
export const LINTERNAS = {
  largo: 900,
  der: { x: 1560, y: 70, barre: [140, 172] },
  izq: { x: -60, y: 70, barre: [8, 34] },
} as const;

/** Dónde está la piedra de Luzbelito, y de qué tamaño va el busto. */
export const LUZBELITO = { x: 452, y: 418, escala: 0.95 } as const;

/** Dónde queda la llama de Luzbelito en la escena, para el resplandor. */
export function llamaEnEscena(): { x: number; y: number } {
  const [px, py] = ARMADO.luzbelito.piso;
  const [lx, ly] = ARMADO.luzbelito.llama;
  return { x: LUZBELITO.x + (lx - px) * LUZBELITO.escala, y: LUZBELITO.y + (ly - py) * LUZBELITO.escala };
}

/** De dónde cuelga el cordón de Momo, dónde queda la argolla y de qué tamaño va el medallón. */
export const MOMO = { cuelga: { x: 450, y: -10 }, argolla: { x: 450, y: 212 }, escala: 0.62 } as const;

/* ------------------------------------------------------------------
   El bajo inundado y el gordo Pierre (`D-73`, sexta vuelta)
   ------------------------------------------------------------------ */

/**
 * Dónde gira cada pieza del gordo Pierre, en coordenadas de títere: el (0, 0) es el agua
 * debajo del medio de la panza, y arriba es negativo. Lo dibuja `arte-bajo.ts` y lo mueve la isla.
 */
export const PIERRE_ARMADO = {
  /** El cogote: de acá se ladea la cabeza. */
  cuello: [0, -226],
  /** El hombro y el codo del brazo de la botella. */
  hombro: [-150, -188],
  codo: [-222, -116],
  /** El pico de la botella, con el brazo quieto, y la boca, adonde lo lleva el trago. */
  pico: [-210, -342],
  boca: [-4, -242],
  /** Cuánto giran el brazo y el antebrazo para empinarse la botella: el pico llega a la boca. */
  trago: { brazo: 80, antebrazo: 9 },
  /**
   * Los ojos: el centro de cada uno (de ahí los pinta `arte-bajo.ts`) y el párpado de papel que
   * lo tapa al parpadear, un poco más arriba, porque el ojo achinado es una medialuna.
   */
  ojos: [
    { centro: [-38, -304], parpado: [-38, -309], radio: [28, 10] },
    { centro: [38, -304], parpado: [38, -309], radio: [28, 10] },
  ],
} as const;

/** El bajo: dónde está el agua contra la pared y dónde la toca Pierre, y de qué tamaño va. */
export const BAJO = {
  /** La línea del agua contra la pared del fondo. */
  fondo: 372,
  /** La puerta del vidrio roto: el agujero, por donde entra el agua. */
  agujero: { x: 196, y: 176 },
} as const;
export const PIERRE = { x: 486, agua: 476, escala: 0.9 } as const;

/* ------------------------------------------------------------------
   La vaca cubana, en la punta de la pastura (`D-73`)
   ------------------------------------------------------------------ */

/**
 * Dónde gira cada pieza de la vaca, en coordenadas de títere: el (0, 0) es el piso debajo del
 * medio de la panza, arriba es negativo, y mira para la izquierda. La cabeza se dibuja derecha
 * en su propio marco, con el (0, 0) en el cogote, y se para en `cuello` girada `mira` grados:
 * así mira el cielo. Lo dibuja `arte-vaca.ts` y lo mueve la isla.
 */
export const VACA_ARMADO = {
  /** El cogote, en el títere: de acá cuelga la cabeza. */
  cuello: [-202, -304],
  /** La cabeza se dibuja en su marco y se agranda al pararla en el cogote. */
  cabeza: 1.2,
  /** Cuánto levanta la cabeza para mirar el cielo, y cuánto la baja para pastar o mirar el pozo. */
  mira: 36,
  pasta: -34,
  /** En el marco de la cabeza: la bisagra de la mandíbula, la oreja y el ojo. */
  bisagra: [-50, 16],
  oreja: [-12, -18],
  ojo: { centro: [-58, -14], radio: [15, 9.5], giro: -8 },
  /** Cuánto se corre la pupila adentro del ojo. */
  pupila: 4.5,
  /** La cola cuelga de acá, y la borla de la punta. */
  cola: [170, -256],
  borla: [190, -136],
  /** Por dónde sube el bolo cuando rumia: del pecho al cogote, por abajo del pescuezo. */
  bolo: [
    [-168, -164],
    [-196, -212],
    [-214, -252],
    [-226, -284],
  ],
} as const;

/** Dónde está la vaca: en la punta de la pastura, con las patas de atrás en el pasto del borde. */
// Corrida de 652 a 712 (`D-80`): el hocico del cordero, en la punta de la soga, le tocaba el de la
// vaca. Pedido del usuario: *"el cordero y la vaca se enciman mucho"*.
export const VACA = { x: 712, y: 470, escala: 0.5 } as const;

/**
 * El cielo de la vaca. Por arriba cruza la tele de la tapa de *Un baión* hecha satélite, de
 * derecha a izquierda; cuando a la vaca la tocan, se le cae un pedazo prendido fuego, que cae
 * en `impacto`, en el pasto, al lado de las patas de adelante. Todo en coordenadas del recinto.
 */
export const CIELO_VACA = {
  satelite: { desde: [1010, 66], hasta: [-110, 122], dura: 34, pausa: 16, escala: 0.4 },
  /** Si cuando la tocan el satélite no se ve, el pedazo viene de acá, de arriba, fuera de cuadro. */
  arriba: [760, -40],
  impacto: [626, 510],
  /** Lo que tarda en caer el pedazo, y de qué tamaño va. */
  cae: 1.7,
  pedazo: 0.5,
  /** El pozo y el humo: de qué tamaño, y cuánto tardan en irse. */
  pozo: 0.55,
  humea: 7,
} as const;

/* ------------------------------------------------------------------
   La prisión de Barbazul y la drácula con tacones (`D-73`, octava vuelta)
   ------------------------------------------------------------------ */

/**
 * Dónde gira cada pieza de la drácula, en coordenadas de títere: el (0, 0) es el piso entre los
 * dos tacos, y arriba es negativo. Lo dibuja `arte-prision.ts` y lo mueve la isla.
 */
export const DRACULA_ARMADO = {
  /** El medio de la cara, entre los ojos y la boca: de acá se mide todo lo de la cabeza. */
  cara: [0, -502],
  /** El cogote: de acá se ladea la cabeza. */
  cuello: [0, -446],
  /**
   * Los ojos: el centro de cada uno y el tamaño de la almendra, que tapa el párpado al parpadear.
   * El párpado nunca sube del todo (`entornados`): mira con los ojos a media asta.
   */
  entornados: 0.3,
  ojos: [
    { centro: [-17, -508], radio: [9.4, 3.5] },
    { centro: [17, -508], radio: [9.4, 3.5] },
  ],
  /**
   * Las bisagras de la capa, en cada hombro: cada mitad negra se da vuelta contra la suya como una
   * puerta de papel, y del otro lado aparece el forro rojo.
   */
  hombros: [
    [-80, -412],
    [80, -412],
  ],
  /** De dónde se mueve cada pierna al caminar, escondido debajo del vestido. */
  caderas: [
    [-17, -250],
    [17, -250],
  ],
  /** La mano que agarra el borde de la capa abierta, en la punta del ala de la derecha (la otra, espejada). */
  punta: [300, -478],
  /** La mano que cierra la capa sobre el pecho. */
  mano: [-6, -384],
} as const;

/**
 * La prisión de Barbazul: un pasillo de celdas visto de frente, con el punto de fuga en el medio.
 * Al fondo, la ventana enrejada, y detrás la calle de *Oktubre*: la tapa misma, con su gente.
 */
export const PRISION = {
  /** El punto de fuga del pasillo. */
  fuga: [450, 250],
  /** La pared del fondo: de dónde a dónde, el techo y el piso. */
  fondo: { x0: 250, x1: 650, techo: 70, piso: 400 },
  /** La ventana: el hueco, con el arco arriba. */
  ventana: { x0: 322, x1: 578, hombro: 158, clave: 116, abajo: 334 },
  /**
   * Dónde cae la tapa de *Oktubre* detrás de la ventana: el (0, 0) de la tapa y cuánto se achica.
   * Lo de abajo de la tapa (la gente y las banderas) queda en el hueco.
   */
  tapa: { x: 306.3, y: 4.1, escala: 0.342 },
  /** La jaula vacía de la fiera más fiera, adelante a la derecha, y la bisagra de su puerta. */
  jaula: { x0: 712, x1: 880, arriba: 318, piso: 628, puerta: { x: 726, arriba: 404, abajo: 616, ancho: 70 } },
} as const;

/**
 * Las banderas de la tapa, que flamean afuera de la ventana: el polígono que las recorta de la
 * tapa (en píxeles de la tapa, 953 × 953) y el punto del asta de donde flamean.
 */
export const BANDERAS: ReadonlyArray<{ poligono: ReadonlyArray<readonly [number, number]>; asta: readonly [number, number] }> = [
  { poligono: [[58, 438], [190, 438], [190, 662], [58, 662]], asta: [72, 452] },
  { poligono: [[282, 422], [338, 422], [338, 672], [282, 672]], asta: [300, 664] },
  { poligono: [[390, 432], [602, 432], [602, 502], [470, 574], [390, 600]], asta: [584, 450] },
  { poligono: [[408, 672], [470, 576], [602, 504], [652, 504], [656, 556], [560, 580], [528, 592], [470, 672]], asta: [426, 656] },
  { poligono: [[528, 594], [560, 582], [656, 558], [700, 498], [762, 498], [762, 672], [528, 672]], asta: [652, 630] },
];

/** De píxeles de la tapa a la escena. */
export const deLaTapa = ([x, y]: readonly [number, number]): [number, number] => [PRISION.tapa.x + x * PRISION.tapa.escala, PRISION.tapa.y + y * PRISION.tapa.escala];

/**
 * La drácula: dónde arranca (y dónde queda quieta con movimiento reducido), el piso por donde
 * camina, de dónde a dónde, y de qué tamaño va.
 */
export const DRACULA = { x: 380, piso: 624, desde: 296, hasta: 590, escala: 0.8 } as const;

/* ------------------------------------------------------------------
   Barbazul, el dueño de la prisión (`D-73`, undécima vuelta)
   ------------------------------------------------------------------ */

/**
 * Dónde gira cada pieza de Barbazul, en coordenadas de títere: el (0, 0) es el piso entre los
 * dos zapatos, y arriba es negativo. Lo dibuja `arte-barbazul.ts` y lo mueve la isla.
 */
export const BARBAZUL_ARMADO = {
  /** El medio de la cara, entre los ojos y el bigote: de acá se mide todo lo de la cabeza. */
  cara: [0, -540],
  /** La cabeza y la barba se dibujan a su medida y se agrandan desde la cara: en la tapa la cabeza pesa. */
  agranda: 1.25,
  /** El cogote: de acá cabecea. */
  cuello: [0, -468],
  /** De dónde cuelga la barba, debajo de la nariz: se mece con retraso, como un péndulo. */
  barba: [0, -510],
  /**
   * Los ojos: el centro de cada uno y el tamaño del blanco. Las pupilas no están impresas: las
   * dibuja la página y las mueve la isla, porque miran a la drácula cuando pasa.
   */
  ojos: [
    { centro: [-23.8, -555], radio: [12, 5.5] },
    { centro: [23.8, -555], radio: [12, 5.5] },
  ],
  /** Hasta dónde se corre una pupila adentro del blanco. */
  mira: [6.4, 2.2],
  /** Los hombros, los codos y el medio de cada mano, con el brazo colgando. */
  hombros: [
    [-90, -436],
    [90, -436],
  ],
  codos: [
    [-104, -318],
    [104, -318],
  ],
  manos: [
    [-100, -186],
    [100, -186],
  ],
  /** De dónde cuelga el manojo, en el puño de la mano de la derecha. */
  llavero: [101, -176],
  /** Adónde lleva la mano de la izquierda: a la barba para alisarla, y al pecho en la reverencia. */
  alisa: { desde: [-16, -452], hasta: [-10, -356] },
  pecho: [-34, -392],
} as const;

/** Barbazul recibe en la entrada, adelante a la izquierda, entre la columna y el pasillo. */
export const BARBAZUL = { x: 122, piso: 634, escala: 0.8 } as const;

/**
 * La puerta de Barbazul, al fondo a la izquierda de la ventana: el hueco con su arco y la bisagra
 * del lado de la pared. Adentro está el cuarto; cuando él hace la reverencia, se entreabre.
 */
export const PUERTA_DE_BARBAZUL = { x0: 262, x1: 300, arriba: 262, arco: 246, piso: 400 } as const;

/* ------------------------------------------------------------------
   El negro Atila, en la medianera del baldío (`D-73`, duodécima vuelta)
   ------------------------------------------------------------------ */

/**
 * Dónde gira cada pieza del Atila, en coordenadas de títere: el (0, 0) es el piso entre los
 * zapatos, y arriba es negativo. Lo dibuja `arte-atila.ts` y lo mueve la isla.
 */
export const ATILA_ARMADO = {
  /** El cogote: de acá se hunde la cabeza adentro del cuello del gabán, y se ladea. */
  cuello: [0, -330],
  /** De dónde se mueve cada pierna, escondido debajo del gabán. */
  caderas: [
    [-18, -176],
    [18, -176],
  ],
  /** Las bisagras del gabán, en la costura de cada costado: cada hoja se abre contra la suya. */
  bisagras: [
    [-82, -210],
    [82, -210],
  ],
  /**
   * Los ojos de la tapa del lobo: el grande de la luz y el chico de la sombra. El iris se corre
   * adentro del blanco hasta `mira` (lo que mira de reojo), y el párpado lo tapa al parpadear.
   */
  ojos: [
    { centro: [-14, -414], radio: [10, 8.6], mira: [4.2, 2.6] },
    { centro: [15, -413], radio: [7.5, 6.5], mira: [3, 2] },
  ],
  /** Por dónde sale el vaho: la boca, debajo de la bufanda. */
  boca: [8, -374],
  /** La lucecita de la sirena del forro, y el brillo del bolsillo. */
  sirena: [-146, -256],
  brillo: [56, -170],
} as const;

/**
 * El Atila camina por arriba de la medianera del baldío (`piso`, el canto del muro), de `desde` a
 * `hasta`, lejos del perro y antes del tanque. Cuando pasa la sirena se tira del otro lado: baja
 * hasta `escondido` (no se ve nada) y después asoma hasta `asoma` (el funyi y los ojos). Del gato
 * matón, a la izquierda, no pasa: lo huele desde `olfatea`. La luz de la sirena barre los techos a
 * la altura `sirena`, de afuera a afuera.
 */
export const ATILA = { x: 610, piso: 300, escala: 0.5, desde: 470, hasta: 716, olfatea: 520, escondido: 270, asoma: 196, sirena: 236 } as const;
