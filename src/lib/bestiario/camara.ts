/**
 * La cámara del camino (`D-80`): el cuerpo de quien camina, puesto en la pantalla.
 *
 * Pedido del usuario: *"agreguemos también unas animaciones de caminata para la cámara y cosas así,
 * que con el meteorito que cae de la vaca cubana se mueva la cámara [...] pensá las que hacen falta
 * para que sea más inmersiva la aventura"*. Son siete, y todas se suman en un solo encuadre:
 *
 * 1. **La caminata**: un vaivén atado a lo caminado, no al reloj, con la misma zancada de los pasos
 *    que suenan (`sonido.ts`, `zancada`): cada paso cae en el fondo del vaivén. Crece con la velocidad.
 * 2. **La inercia**: caminando ligero, la cámara se adelanta un poco y abre el plano; al frenar se
 *    acomoda con un resorte, que se pasa apenas y vuelve.
 * 3. **El respirar**: quieto, un vaivén lentísimo, para que la escena no quede de foto.
 * 4. **El sacudón**: un trauma que se suma y se apaga (el meteorito de la vaca, el grito del pibe, el
 *    bombo). Tiembla con el cuadrado del trauma, así un golpe chico casi no se siente y uno grande sí.
 * 5. **El retumbo**: un temblor grave y parejo mientras dura algo pesado, como un fierro que te pasa
 *    cerca en la ruta.
 * 6. **El acercarse**: tocar un bicho arrima un poco la cámara hacia él, y vuelve sola.
 * 7. **La entrada**: al llegar, la cámara se asoma un poco más cerca y más abajo, y se asienta.
 *
 * El encuadre siempre va un poco agrandado (`MARGEN`), y el corrimiento nunca pasa ese margen: por
 * más que tiemble, no se ve el borde de la escena. Esto es solo cuentas, sin DOM: lo usa
 * `scripts/camino.ts` y lo mira `camara.test.ts`. Con movimiento reducido, la isla no la usa.
 */

/** Cuánto se agranda siempre la escena, para tener margen donde moverse sin mostrar el borde. */
export const MARGEN = 0.06;

/**
 * A qué altura de la vista se agranda la escena, de 0 (arriba) a 1 (abajo). No en el medio: lo que
 * agranda se lo come el cielo, que arriba igual queda debajo del tablero, y el piso casi no se corta.
 * Agrandando desde el medio, los bichos del piso (los perros del baldío, los náufragos, el taxi)
 * quedaban con los pies afuera de la pantalla.
 */
export const APOYO = 0.86;

/** Los números de cada movimiento, en fracciones del alto de la vista y en grados. */
export const CAMARA = {
  caminata: { vaiven: 0.007, bamboleo: 0.35, plena: 420 },
  inercia: { adelanto: 0.012, abre: 0.012, rigidez: 60, freno: 9 },
  respira: { vaiven: 0.0016, ritmo: 0.9 },
  sacudon: { corre: 0.03, gira: 1.4, rapidez: 26, apaga: 1.3 },
  retumbo: { corre: 0.006, rapidez: 17 },
  acercarse: { cuanto: 0.05, entra: 0.35, queda: 0.9, sale: 1.4 },
  entrada: { cerca: 0.05, baja: 0.02, dura: 1.8 },
} as const;

/**
 * El primer paso (`D-83`): al llegar a un camino, la cámara da un paso sola, corto y despacio, para
 * que se vea que el mundo se corre de costado y asome lo primero que hay. Es la invitación a caminar
 * sin decirla. `cuanto` es la parte de la vista que se camina, con un tope en píxeles, en `dura`
 * segundos. Cualquier gesto lo corta, y con movimiento reducido no se da.
 */
export const PRIMER_PASO = { cuanto: 0.3, tope: 150, dura: 1.6 } as const;

/** Cuánto del primer paso ya se dio, de 0 a 1, para un tiempo `u` de 0 a 1: arranca y llega despacio. */
export function primerPaso(u: number): number {
  return suave(u);
}

export interface Encuadre {
  /** El corrimiento, en píxeles de pantalla. */
  x: number;
  y: number;
  /** El giro, en grados. */
  giro: number;
  /** La escala, con el margen adentro: nunca menos que `1 + MARGEN`. */
  escala: number;
  /** El punto alrededor del cual escala y gira, en píxeles desde la esquina de la vista. */
  ox: number;
  oy: number;
}

/** Un ruido suave y barato: tres senos que no se repiten entre sí, de -1 a 1. */
export function ruido(t: number, semilla: number): number {
  return (Math.sin(t * 1.0 + semilla) * 0.5 + Math.sin(t * 2.31 + semilla * 1.7) * 0.3 + Math.sin(t * 4.17 + semilla * 2.9) * 0.2);
}

/** Una curva que arranca y llega despacio, de 0 a 1. */
const suave = (u: number): number => {
  const k = Math.min(1, Math.max(0, u));
  return k * k * (3 - 2 * k);
};

export interface Camara {
  /** Lo caminado en este cuadro, en unidades de escena (con signo), y el tiempo que pasó. */
  caminar(dx: number, dt: number): void;
  /** Un golpe: se suma al trauma, de 0 a 1. */
  sacudir(fuerza: number): void;
  /** Lo que retumba ahora, de 0 a 1. Se pide cada cuadro: si nadie lo pide, se apaga. */
  retumbar(nivel: number): void;
  /** Arrimarse a un punto de la vista, en píxeles desde su esquina. */
  acercarse(x: number, y: number, t: number): void;
  /** El encuadre de este cuadro, para una vista de `ancho` × `alto` píxeles. */
  encuadre(t: number, dt: number, ancho: number, alto: number): Encuadre;
  /** El trauma que queda, para el test. */
  trauma(): number;
}

/**
 * Una cámara nueva. `zancada`: la de los pasos de la región, en unidades de escena. `llegada`: el
 * momento en que se entra, para la asomada; sin él, no se asoma. `apoyo`: a qué altura agranda
 * (`APOYO`), para el tramo que tiene algo importante bien arriba.
 */
export function crearCamara(zancada: number, llegada: number | null = null, apoyo: number = APOYO): Camara {
  let fase = 0;
  let velocidad = 0;
  let sentido = 0;
  let trauma = 0;
  let retumbo = 0;
  let pedidoRetumbo = 0;
  let cerca: { x: number; y: number; desde: number } | null = null;
  // La inercia es un resorte: `adelanto` persigue a la velocidad, con su propia velocidad.
  let adelanto = 0;
  let adelantoV = 0;

  return {
    caminar(dx, dt) {
      if (dt <= 0) return;
      // Media pasada por cada zancada: un paso, un vaivén.
      fase += (Math.abs(dx) / zancada) * Math.PI;
      const v = Math.abs(dx) / dt;
      velocidad += (v - velocidad) * Math.min(1, dt * 6);
      if (dx !== 0) sentido = Math.sign(dx);
    },
    sacudir(fuerza) {
      trauma = Math.min(1, trauma + Math.max(0, fuerza));
    },
    retumbar(nivel) {
      pedidoRetumbo = Math.max(pedidoRetumbo, Math.min(1, Math.max(0, nivel)));
    },
    acercarse(x, y, t) {
      cerca = { x, y, desde: t };
    },
    trauma: () => trauma,
    encuadre(t, dt, ancho, alto) {
      const C = CAMARA;
      // Si no se camina, la velocidad se apaga sola.
      velocidad *= Math.max(0, 1 - dt * 4);
      const anda = suave(velocidad / C.caminata.plena);

      // 1. La caminata: dos topes por vuelta (un paso de cada pie) y el bamboleo de lado a lado. El
      // vaivén baja la escena, para el lado donde sobra margen (`APOYO`).
      let y = Math.abs(Math.sin(fase)) * C.caminata.vaiven * alto * anda;
      let giro = Math.sin(fase) * C.caminata.bamboleo * anda;

      // 2. La inercia: el resorte persigue el adelanto que pide la velocidad.
      const quiere = sentido * anda;
      adelantoV += ((quiere - adelanto) * C.inercia.rigidez - adelantoV * C.inercia.freno) * dt;
      adelanto += adelantoV * dt;
      let x = -adelanto * C.inercia.adelanto * ancho;
      let escala = 1 + MARGEN - Math.abs(adelanto) * C.inercia.abre;

      // 3. El respirar, que se va cuando se camina.
      y += Math.sin(t * C.respira.ritmo) * C.respira.vaiven * alto * (1 - anda);

      // 4. El sacudón: con el cuadrado del trauma, y el trauma se apaga.
      const s = trauma * trauma;
      x += ruido(t * C.sacudon.rapidez, 1.3) * C.sacudon.corre * alto * s;
      y += ruido(t * C.sacudon.rapidez, 7.1) * C.sacudon.corre * alto * s;
      giro += ruido(t * C.sacudon.rapidez, 4.4) * C.sacudon.gira * s;
      trauma = Math.max(0, trauma - dt * C.sacudon.apaga);

      // 5. El retumbo: llega y se va de a poco, para que no corte.
      retumbo += (pedidoRetumbo - retumbo) * Math.min(1, dt * 5);
      pedidoRetumbo = 0;
      y += ruido(t * C.retumbo.rapidez, 2.2) * C.retumbo.corre * alto * retumbo;

      // 6. El acercarse: entra, se queda y sale; escala alrededor del punto tocado.
      let ox = ancho / 2;
      let oy = alto * apoyo;
      if (cerca) {
        const A = C.acercarse;
        const u = t - cerca.desde;
        const k = u < A.entra ? suave(u / A.entra) : u < A.entra + A.queda ? 1 : 1 - suave((u - A.entra - A.queda) / A.sale);
        if (k <= 0 && u > A.entra) cerca = null;
        else {
          // El punto de giro se corre hacia lo tocado en la misma medida en que se arrima.
          ox += (cerca.x - ancho / 2) * k;
          oy += (cerca.y - alto * apoyo) * k;
          escala += A.cuanto * k;
        }
      }

      // 7. La entrada: arranca más cerca y más abajo, y se asienta.
      if (llegada !== null) {
        const u = (t - llegada) / C.entrada.dura;
        if (u < 1) {
          const k = 1 - suave(u);
          escala += C.entrada.cerca * k;
          y += C.entrada.baja * alto * k;
        }
      }

      // Nunca más corrimiento que el margen que da la escala, descontado lo que se come el giro.
      // Para abajo hay tanto margen como agranda la escena por encima de `oy`; para arriba, por debajo.
      const seno = Math.abs(Math.sin((giro * Math.PI) / 180));
      const sobraX = ((escala - 1) * ancho) / 2 - seno * alto * 0.5;
      const sobraArriba = (escala - 1) * oy - seno * ancho * 0.5;
      const sobraAbajo = (escala - 1) * (alto - oy) - seno * ancho * 0.5;
      x = Math.max(-Math.max(0, sobraX), Math.min(Math.max(0, sobraX), x));
      y = Math.max(-Math.max(0, sobraAbajo), Math.min(Math.max(0, sobraArriba), y));
      return { x, y, giro, escala: Math.max(1 + MARGEN * 0.5, escala), ox, oy };
    },
  };
}

/** El encuadre como `transform` de CSS para una capa cuya esquina está en `(capaX, 0)` de la vista. */
export function transformDe(e: Encuadre, capaX: number, corrida: number): string {
  // Alrededor del punto (ox, oy) de la vista: se lleva la capa a ese origen, se gira y escala, y se
  // vuelve. `corrida` es el paralaje de la capa, que va adentro de todo.
  const ox = e.ox - capaX;
  return (
    `translate(${(ox + e.x).toFixed(1)}px, ${(e.oy + e.y).toFixed(1)}px) rotate(${e.giro.toFixed(3)}deg) ` +
    `scale(${e.escala.toFixed(4)}) translate(${(-ox).toFixed(1)}px, ${(-e.oy).toFixed(1)}px) translate3d(${corrida.toFixed(1)}px, 0, 0)`
  );
}
