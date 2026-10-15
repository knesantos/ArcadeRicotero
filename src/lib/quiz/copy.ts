/**
 * El copy del quiz. Transcribe `CNT-05` (Docs/CONTENIDO/CNT-05-copy-quiz.md).
 *
 * Vive en un modulo aparte por la misma razon por la que el contenido vive en JSON: el
 * texto es de `contenido`, no del componente. Si una pantalla escribe una cadena a mano,
 * la proxima vez que `contenido` cambie el tono nadie va a encontrarla.
 *
 * Los identificadores (`A1`, `B3`, `C1`...) son los de `CNT-05`, para que un cambio alla
 * se pueda rastrear aca sin leer los dos archivos enteros.
 */

import type { ClaseDeFuente, Item } from './banco.ts';
import type { Tramo } from './tramo.ts';
import type { Resultado } from './vidas.ts';
import type { DesafioDeQuery } from '../desafio.ts';

/** A1, A2, A3, A4 — Pantalla 0. */
export const PANTALLA_0 = {
  titulo: 'Entrá, sepas lo que sepas.',
  /** `CNT-41` A2', primera mitad: qué es. Es lo que reemplaza un desafío. */
  subtitulo: 'Preguntas sobre los Redondos.',
  botón: 'JUGÁ',
  /** `CNT-41` A2', segunda mitad: cómo se juega, al lado de las tres fichas (`D-71`). Va
   *  aparte del subtítulo para que siga a la vista cuando un desafío lo reemplaza. */
  comoSeJuega: 'Tenés tres vidas: arranca fácil y se pone bravo.',
} as const;

/**
 * A3 — reemplaza al subtitulo cuando alguien llega por un desafio.
 *
 * Con `BR-19` el quiz dejo de tener "6 de 8": lo que se manda es **hasta donde llegaste**.
 * Por eso la invitacion cambio de "saco X/Y" a "llego a la pregunta N", que es lo unico
 * que un desafio de partida por vidas puede afirmar sin mentir.
 *
 * La forma `marcador` sigue existiendo para los links de la v1, que circulan desde antes
 * del ciclo 9 porque el sitio ya estaba desplegado (`ADR-02` v2). Un link viejo dice lo
 * que decia; no se lo reinterpreta como si fuera una partida por vidas.
 */
export function subtituloDesafio(d: DesafioDeQuery): string {
  const quien = d.nombre ?? 'Alguien';
  if (d.forma === 'identidad') return `${quien} ya se lo hizo. ¿Y vos qué sos?`;
  if (d.forma === 'marcador') return `${quien} sacó ${d.puntaje}/${d.total}. ¿Te la bancás?`;
  return `${quien} llegó a la pregunta ${d.puntaje} de ${d.total}. ¿Te la bancás?`;
}

/** B1' — seis variantes que rotan (`CNT-41` §5, reemplaza a `CNT-05` B1). El único grito
 *  del sitio. Salió «¡Sabés, che!»: la regla de voz 3.4 veta el *che* de disfraz. */
export const ACIERTOS = [
  '¡Adentro!',
  '¡La clavaste!',
  '¡Como en el disco!',
  '¡De memoria!',
  '¡Esa te la sabías!',
  '¡Justo en el hueso!',
] as const;

/** B2' — seis variantes, en voz baja (`CNT-41` §5). Ninguna dice "mal" ni "perdiste": el
 *  que pierde la vida ya lo ve en el marcador. */
export const ERRORES = [
  'No era esa.',
  'Esa se te escapó.',
  'Pasó de largo.',
  'Te falta escuchar disco.',
  'La próxima la sacás.',
  'Quedó para la vuelta.',
] as const;

/** B3, B4 — las etiquetas de rotulo. B4 es plantilla: el testigo no siempre es el Indio. */
export const ETIQUETA_LEYENDA = 'Esto es leyenda:';
export function etiquetaTestimonio(quien: string): string {
  return `Lo contó ${quien}:`;
}

/** B5 — el paso a la pregunta que sigue.
 *
 * Nacio como reemplazo del auto-avance **solo en los items con rotulo** (`UX-01` v2).
 * Desde la auditoria de detalles del 2026-08-24 vale para todos, y el timer no existe
 * mas: el argumento de `UX-01` —"un timer fijo no puede servir a la vez a un rotulo de 15
 * caracteres y a uno de 200"— era igual de cierto para la explicacion, que es mas larga
 * que varios rotulos. Medido: el panel duraba 1.577 ms con un texto de seis segundos de
 * lectura, y eso pasaba en 22 de los 40 items. */
export const BOTON_SEGUIR = 'SEGUÍ';

/**
 * Como se lee cada categoria en pantalla.
 *
 * El JSON las guarda como identificador (`mitologia`) y la cabecera las escribe en
 * mayusculas, asi que sin esta tabla el jugador leia **MITOLOGIA**, sin tilde. En
 * castellano la mayuscula lleva el acento, y este rotulo va en la pila del sistema, que
 * los tiene todos: no es la deuda de tildes de las letras de disco, es un identificador
 * que se estaba imprimiendo crudo. Mismo mecanismo que `REDONDOPEDIA.secciones`.
 */
export const CATEGORIAS: Record<string, string> = {
  historia: 'Historia',
  discos: 'Discos',
  letras: 'Letras',
  mitologia: 'Mitología',
};

export function etiquetaCategoria(categoria: string): string {
  return CATEGORIAS[categoria] ?? categoria;
}

/** C1, C2, C3 — los tres tramos de `BR-05`. */
export const TRAMOS: Record<Tramo, { titulo: string; bajada: string }> = {
  bajo: {
    titulo: 'Los molinetes siguen abiertos',
    bajada: 'Jugá las veces que quieras — acá no hay examen que aprobar.',
  },
  medio: {
    titulo: 'Ya la vas agarrando',
    bajada: 'Ya sabés más de lo que creías. Una vuelta más y los tenés.',
  },
  alto: {
    titulo: 'Sos de la vieja guardia',
    bajada: 'Te la sabés de memoria. Sos de los que abren el molinete.',
  },
};

/** C4, C5 — botones del resultado. */
/**
 * El aviso de que el enlace quedó copiado.
 *
 * Estaba escrito a mano en `partida.ts` como "Link copiado.", y por eso **el auditor de
 * voz nunca lo vio**: `voz.test.ts` recorre los módulos de copy, no las cadenas sueltas
 * de una isla. Un anglicismo que `D-17` veta llevaba tres ciclos en producción escondido
 * ahí. Vive acá para que se audite.
 */
export const ENLACE_COPIADO = 'Se copió el enlace.';

export const BOTON_COMPARTIR = 'COMPARTÍ';
export const BOTON_DE_NUEVO = 'JUGÁ DE NUEVO';

/**
 * D2 — el mensaje que ve quien llego por un desafio, comparado con quien lo mando.
 *
 * `FIND-17`: esto no estaba implementado y la pantalla mostraba un string inventado en
 * el componente. Las tres variantes son de `CNT-05`, y la del medio importa: **no dice
 * "perdiste"**, invita a otra vuelta, mismo espiritu que el tramo bajo.
 */
export function comparacion(r: Resultado, d: DesafioDeQuery): string {
  const quien = d.nombre ?? 'quien te lo mando';
  const mio = `Vos: llegaste a la pregunta ${r.pregunta} (${r.aciertos}/${r.respondidas} acertadas)`;

  // `ADR-02` v2: **se compara si coinciden `g`, forma y `t`.** Un link de otra epoca
  // —forma `marcador`, o una escala distinta— se muestra como invitacion y no se compara.
  // Comparar 23-sobre-40 contra 6-sobre-8 seria inventar un numero que nadie saco.
  if (d.forma !== 'recorrido' || d.total !== r.total) {
    return `${mio}. El desafío de ${quien} venía con otra cuenta, así que no hay con qué compararlo.`;
  }

  const suN = d.puntaje;
  if (r.pregunta > suN) return `${mio} — le ganaste a ${quien}, que llegó a la ${suN}.`;
  if (r.pregunta < suN) return `${mio} — todavía no alcanzás a ${quien}, que llegó a la ${suN}. Dale una más.`;

  // Empate en la pregunta alcanzada. El desenlace **no ordena** (retirada y derrota
  // empatan: `BR-19` apartado 6, retirarse no es perder), con una sola excepcion que fijo
  // el usuario en el apartado 3: llegar al final **sin morir** le gana a llegar al final.
  if (r.pregunta === r.total && r.desenlace !== d.desenlace) {
    if (r.desenlace === 'victoria') return `${mio} — los dos llegaron al final, pero vos sin perder las vidas.`;
    if (d.desenlace === 'victoria') return `${mio} — ${quien} también llegó al final, y sin perder las vidas.`;
  }
  return `${mio} — empate con ${quien}. Van a tener que desempatar.`;
}

/** D1 — texto del tuit, uno por desenlace (`CNT-10` S1, S2, S3). */
export function textoParaCompartir(r: Resultado): string {
  if (r.desenlace === 'victoria') {
    return `Agoté las ${r.total} preguntas del fichín ricotero sin perder una vida. ¿Vos cuántas aguantás?`;
  }
  if (r.desenlace === 'derrota') {
    return `Las tres vidas se me apagaron en la pregunta ${r.pregunta} del fichín ricotero. ¿Vos hasta dónde llegás?`;
  }
  return `Llegué hasta la pregunta ${r.pregunta} del fichín ricotero, con ${r.vidasRestantes} vidas en pie. ¿Vos hasta dónde llegás?`;
}

/** E1, E2, E3 — el encabezado de cada desenlace (`CNT-10`, registro 1). */
export const DESENLACES: Record<Resultado['desenlace'], { titulo: string; rotulo: string }> = {
  derrota: { titulo: 'Se te apagaron las tres vidas.', rotulo: 'DERROTA' },
  victoria: { titulo: 'Llegaste con las tres vidas prendidas.', rotulo: 'VICTORIA' },
  retirada: { titulo: 'Te vas con las vidas que te quedan.', rotulo: 'RETIRADA' },
};

/** N2, N3, N4 — el dato, en registro 3: dice qué hay y se calla. */
export const NOMBRE_NIVEL: Record<string, string> = {
  facil: 'Fácil',
  media: 'Media',
  dificil: 'Difícil',
};
export function lineaRecorrido(r: Resultado): string {
  const n = r.nivel ? ` · nivel ${NOMBRE_NIVEL[r.nivel] ?? r.nivel}` : '';
  return `Pregunta ${r.pregunta} de ${r.total}${n}`;
}
export function lineaAciertos(r: Resultado): string {
  return `${r.aciertos} de ${r.respondidas} acertadas`;
}
export function lineaVidas(r: Resultado): string | null {
  return r.vidasRestantes === null ? null : `Vidas al cerrar: ${r.vidasRestantes} de 3`;
}

/** R1 — el botón que cierra la partida. Ni `Salir` (infinitivo) ni `Rendite` (no es
 *  derrota): nombra el objeto completo, y su raíz no se parece a la de `SEGUÍ`. */
export const BOTON_RETIRARSE = 'Cerrá la partida';
export const RETIRADA_CONFIRMA = {
  pregunta: '¿Cerrás acá?',
  aceptar: 'Cerrá igual',
  volver: 'Seguí jugando',
} as const;

/** L1, L2 — el aviso de escalón, registro 3. Rótulo seco, sin festejo. */
export function avisoEscalon(nivel: string): string {
  return `NIVEL ${(NOMBRE_NIVEL[nivel] ?? nivel).toUpperCase()}`;
}

/** La etiqueta ambiente de la cabecera (`UX-07`): reemplaza al viejo "N de 8". */
export function etiquetaNivel(nivel: string, enElNivel: number, delNivel: number): string {
  return `${(NOMBRE_NIVEL[nivel] ?? nivel).toUpperCase()} · ${enElNivel}/${delNivel}`;
}

/** El rótulo del marcador de vidas. Ningún estado se comunica solo con color (`UX-07`). */
export const VIDAS_ROTULO = 'VIDAS';

/**
 * La insignia de una palabra que va **antes** de responder (`UX-01` v2).
 *
 * Va antes y no despues por una razon concreta: el jugador que conoce la historia real
 * mejor que el folclore tiene que saber, antes de tocar, que se le pregunta "que se
 * cuenta" y no "que paso". Si no, es justo el que mas sabe el que el juego marca mal.
 */
export function insignia(clase: ClaseDeFuente): string | null {
  if (clase === 'leyenda') return 'LEYENDA';
  if (clase === 'testimonio') return 'TESTIMONIO';
  return null;
}

/**
 * El sello completo que se revela **despues** de responder.
 *
 * De `testimonio` se muestran solo `quien` y `obra`: `ubicacion` y `afirmacion` son
 * insumo de auditoria de `revisor`, no de disfrute del jugador (`UX-01` v2).
 */
export function selloRevelado(item: Item): { etiqueta: string; detalle: string } | null {
  if (item.clase === 'leyenda' && item.rotuloLeyenda) {
    return { etiqueta: ETIQUETA_LEYENDA, detalle: item.rotuloLeyenda };
  }
  if (item.clase === 'testimonio' && item.testimonio) {
    return {
      etiqueta: etiquetaTestimonio(item.testimonio.quien),
      detalle: item.testimonio.obra,
    };
  }
  return null;
}

/** Elige una variante sin repetir la anterior. */
export function variante(opciones: readonly string[], anterior: string | null, azar: () => number): string {
  const posibles = opciones.filter((o) => o !== anterior);
  const pozo = posibles.length > 0 ? posibles : opciones;
  return pozo[Math.floor(azar() * pozo.length)]!;
}

/* ==========================================================================
   `D-71` — el tablero, la racha, el escalón que canta y la planilla del resultado.
   ========================================================================== */

/** El número grande del tablero. `Nº` y no "Pregunta": el número es la ficha del fichín. */
export function numeroDePregunta(n: number): string {
  return `Nº ${n}`;
}

/** Lo mismo, para quien no ve la pantalla: el `Nº` solo no dice de cuántas. */
export function numeroDePreguntaLeido(n: number, total: number): string {
  return `Pregunta ${n} de ${total}`;
}

/** K1–K3 (`CNT-41` §5) — la racha: se estampa al llegar justo a estos aciertos seguidos. */
export const RACHAS: Readonly<Record<number, string>> = {
  3: 'TRES AL HILO',
  5: 'CINCO AL HILO',
  10: 'DIEZ AL HILO',
};

/** L1, L2 (`CNT-41` §5) — la línea que canta al abrir un escalón, debajo del rótulo seco de
 *  `avisoEscalon`. Dicen quién pregunta, no qué tan difícil es: eso ya lo dice el rótulo. */
export const ESCALON_CANTA: Readonly<Record<string, string>> = {
  media: 'Ahora pregunta el que tiene los discos.',
  dificil: 'Ahora pregunta la vieja guardia.',
};

/** La planilla del resultado: pregunta por pregunta, con símbolo y no solo color. */
export const PLANILLA = {
  rotulo: 'Pregunta por pregunta',
  acertada: 'acertada',
  errada: 'errada',
  sinJugar: 'sin jugar',
} as const;

/** El texto alternativo de la tapa que acompaña la respuesta. */
export function altTapa(titulo: string): string {
  return `Tapa de ${titulo}`;
}

/**
 * La planilla en el texto que se comparte: `◆` por acierto, `✕` por error, un espacio entre
 * escalones. Es lo que hace que el resultado se pueda mirar en un grupo sin abrir el link.
 * Los dos son símbolos de texto y no emoji (U+25C6 y U+2715), los mismos de las vidas.
 */
export function planillaParaCompartir(escalones: readonly (readonly boolean[])[]): string {
  return escalones
    .filter((e) => e.length > 0)
    .map((e) => e.map((acierto) => (acierto ? '◆' : '✕')).join(''))
    .join(' ');
}
