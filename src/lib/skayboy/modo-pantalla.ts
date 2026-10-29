/**
 * El modo de pantalla completa (`ADR-10.1` a `ADR-10.3`, `UX-33 §1`, `T-301`): `entrar()`,
 * `salir()`, el pedido al sistema, las tres puertas y el `ResizeObserver`.
 *
 * ## Por qué vive acá y no suelto en la isla
 *
 * `ADR-10.6` pone estas funciones en la isla. Viven en un módulo aparte por una sola razón: que
 * se puedan **jugar en Node con un DOM de utilería** (`modo-pantalla.test.ts`). La revisión de la
 * primera entrega mostró que un auditor que lee el texto no alcanza: una flecha `async` en el
 * manejador del botón, el contenedor sacado de otra línea o una puerta de salida vaciada pasaban
 * en verde. Una prueba de conducta los ve a todos, porque mira lo que pasa y no cómo se escribió.
 *
 * Por eso este módulo **no lee ningún global**: el documento, la ventana, la orientación, el
 * `ResizeObserver`, el contenedor y el botón le llegan en `EntornoDelModo`. La isla le pasa los de
 * verdad; la prueba, los de utilería. Las prohibiciones de `ADR-10.6` siguen enteras y las sigue
 * mirando `motor.test.ts`, ahora sobre la isla y este archivo juntos: ni `setFullscreen` ni
 * `isFullscreen` del motor, ningún pedido sobre el canvas, y acá **ni un `async` ni un `await`**,
 * porque este módulo no tiene nada que esperar.
 *
 * ## Lo que hace
 *
 * El modo es **un atributo en `<html>`** —`data-pantalla="completa"`— que la hoja lee para fijar
 * `.fichin` a la ventana, cortar todo gesto del navegador y agrandar el área. **Además**, en el
 * mismo toque y sin esperar nada antes, se le pide al sistema su pantalla completa **sobre
 * `.fichin`, nunca sobre el canvas** —si la pidiera el canvas, desaparecerían las teclas, el
 * botón de salir y el pie de homenaje—, y la orientación horizontal, solo si el sistema dio la
 * pantalla. En iPhone no existen: el modo es todo lo que hay, y alcanza (`D-47` consecuencia 2).
 *
 * Se sale por tres puertas que llegan a `salir()`: el mismo botón, `Escape` cuando no hay API, y
 * el sistema cuando termina la suya. **El motor no se entera**: no se reinicia el nivel ni se toca
 * el reloj; cambia solo la caja CSS del canvas, que calcula `encuadre()` (`pantalla.ts`).
 */

import { PANTALLA_COMPLETA } from './copy.ts';
import { cajaDelArea, encuadre } from './pantalla.ts';

/** Safari de iPad anterior a 16.4 la tiene con prefijo y sin promesa. */
type ConPrefijo = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void };
type DocumentoConPrefijo = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
};
/** `lock` no está en los tipos de todas las versiones de TypeScript: se lee como opcional. */
type Orientacion = ScreenOrientation & { lock?: (o: string) => Promise<void>; unlock?: () => void };

/** Todo lo de afuera que el modo toca. La isla pasa lo de verdad; la prueba, utilería. */
export interface EntornoDelModo {
  readonly documento: Document;
  readonly ventana: Pick<Window, 'scrollX' | 'scrollY' | 'scrollTo' | 'devicePixelRatio' | 'getComputedStyle'>;
  /** `screen.orientation`, que en Safari de iPhone anterior a 16.4 no existe. */
  readonly orientacion: ScreenOrientation | undefined;
  readonly Observador: typeof ResizeObserver;
  /** El contenedor del modo: el canvas, las seis teclas, los dos botones y el pie (`ADR-10.5`). */
  readonly fichin: HTMLElement;
  /** El interruptor: el mismo botón entra y sale (`UX-33 §1.5`). */
  readonly boton: HTMLButtonElement;
  /**
   * Otros botones que hacen exactamente lo mismo (`D-61`): el del menú. El pedido al sistema sale de
   * su toque, en el mismo manejador y sin esperar nada, igual que del sello. **Llevan el verbo
   * entero a la vista** —el `aria-label` del sello—, porque tienen lugar: en el menú, un `SALÍ`
   * solo al lado de `Jugá` se lee como salir del juego.
   */
  readonly otros?: readonly HTMLButtonElement[];
  /** Una tecla que se muda de lugar con un dedo encima no puede quedar apretada (`UX-28 §3`). */
  readonly soltarTodas: () => void;
}

export interface ModoDePantalla {
  readonly enElModo: () => boolean;
  readonly entrar: () => void;
  readonly salir: () => void;
}

/**
 * Engancha el interruptor, las tres puertas y el observador, y devuelve las dos funciones del
 * modo. Se llama una vez, cuando la isla arranca.
 */
export function montarPantallaCompleta(entorno: EntornoDelModo): ModoDePantalla {
  const { documento, ventana, Observador, fichin, boton, soltarTodas } = entorno;
  const botones = [boton, ...(entorno.otros ?? [])];
  const d = documento as DocumentoConPrefijo;
  const orientacion = entorno.orientacion as Orientacion | undefined;

  /**
   * Si el modo había entrado con la pantalla completa del sistema. Solo entonces que el sistema la
   * termine saca del modo (`ADR-10.3`): mientras hay API, el modo sigue a `fullscreenElement` y no
   * hay dos verdades sobre si la pantalla es completa.
   */
  let entroPorElSistema = false;

  /**
   * Dónde estaba la página al entrar. En el modo el documento se achica —`.fichin` queda fijo— y
   * el navegador la lleva arriba de todo; al salir, la persona vuelve al mueble donde estaba, no
   * al título.
   */
  let dondeEstaba = { x: 0, y: 0 };

  const enElModo = (): boolean => documento.documentElement.dataset.pantalla === 'completa';
  const enPantallaDelSistema = (): Element | null => d.fullscreenElement ?? d.webkitFullscreenElement ?? null;

  /**
   * La estampa dice lo que hace el toque y el `aria-label` lo mismo con el verbo entero (`CNT-40`,
   * que enmendó `CNT-22 §1`: la estampa nombraba el estado, y el usuario no la encontró). Todos los
   * botones del modo, igual. **Sin `aria-pressed`**: un botón de alternancia no cambia de nombre, y
   * este cambia; con los dos, el lector decía "Salí de pantalla completa, presionado".
   */
  function pintarBoton(): void {
    const adentro = enElModo();
    const verbo = adentro ? PANTALLA_COMPLETA.salir : PANTALLA_COMPLETA.entrar;
    for (const b of botones) {
      b.textContent = b === boton ? (adentro ? PANTALLA_COMPLETA.completa : PANTALLA_COMPLETA.ventana) : verbo;
      b.setAttribute('aria-label', verbo);
    }
  }

  /** Una medida de la hoja, en px CSS. Sin ella, cero: el encuadre sigue andando, con menos aire. */
  function medidaDeLaHoja(nombre: string): number {
    const valor = parseFloat(ventana.getComputedStyle(fichin).getPropertyValue(nombre));
    return Number.isFinite(valor) ? valor : 0;
  }

  /**
   * Las cuatro propiedades del encuadre (`ADR-10.4`), escritas en `.fichin`: la hoja las lee solo
   * debajo de `[data-pantalla="completa"]`. La caja sale de `UX-33`: la ventana del modo menos la
   * chapa del pie —lo que mida de verdad, porque envuelve si no entra en un renglón— y el bisel de
   * los cuatro lados, y parada también menos el mando (`cajaDelArea()`).
   */
  function encuadrar(): void {
    if (!enElModo()) return;
    const pie = fichin.querySelector('.chapa-pie')?.getBoundingClientRect().height ?? 0;
    const mando = fichin.querySelector('.mando')?.getBoundingClientRect().height ?? 0;
    const caja = cajaDelArea(fichin.clientWidth, fichin.clientHeight, {
      bisel: medidaDeLaHoja('--bisel'),
      pie,
      mando: mando + 2 * medidaDeLaHoja('--tecla-aire'),
    });
    const e = encuadre(caja.ancho, caja.alto, ventana.devicePixelRatio || 1, caja);
    fichin.style.setProperty('--encuadre-ancho', `${e.ancho}px`);
    fichin.style.setProperty('--encuadre-alto', `${e.alto}px`);
    fichin.style.setProperty('--encuadre-izquierda', `${e.izquierda}px`);
    fichin.style.setProperty('--encuadre-arriba', `${e.arriba}px`);
  }

  /**
   * Entrar al modo (`ADR-10.2` paso 1): el atributo, las teclas sueltas y el encuadre. Es lo único
   * que no depende del sistema, y por eso va primero: si todo lo demás falla, el modo ya está.
   */
  function entrar(): void {
    if (!enElModo()) dondeEstaba = { x: ventana.scrollX, y: ventana.scrollY };
    documento.documentElement.dataset.pantalla = 'completa';
    soltarTodas();
    pintarBoton();
    encuadrar();
  }

  /**
   * Salir del modo (`ADR-10.3`), llegue por donde llegue. **El nivel sigue donde estaba**: volver a
   * entrar es un toque. Y la página vuelve adonde estaba. Los rechazos del sistema se tragan.
   */
  function salir(): void {
    entroPorElSistema = false;
    if (enPantallaDelSistema() !== null) {
      const soltarLaDelSistema = d.exitFullscreen ?? d.webkitExitFullscreen;
      try {
        Promise.resolve(soltarLaDelSistema?.call(d)).catch(() => {});
      } catch {
        /* ya no estaba: sigue la salida */
      }
    }
    try {
      orientacion?.unlock?.();
    } catch {
      /* sin orientación que soltar */
    }
    const estaba = enElModo();
    delete documento.documentElement.dataset.pantalla;
    soltarTodas();
    pintarBoton();
    if (estaba) ventana.scrollTo(dondeEstaba.x, dondeEstaba.y);
  }

  /**
   * El toque del botón para entrar (`ADR-10.2`, en este orden): el modo, siempre; la pantalla
   * completa del sistema **sobre el contenedor**, en este mismo manejador y sin esperar nada antes
   * —el navegador la da solo con el gesto de la persona todavía vivo—; y la orientación, solo si el
   * sistema la dio. Cada rechazo se traga y el modo sigue igual.
   */
  function pedirPantallaCompleta(): void {
    entrar();
    const contenedor = fichin as ConPrefijo;
    const pedir = contenedor.requestFullscreen ?? contenedor.webkitRequestFullscreen;
    // Sin API —Safari de iPhone— queda el modo, y es suficiente para lo que se pidió.
    if (typeof pedir !== 'function') return;
    try {
      Promise.resolve(pedir.call(contenedor))
        .then(() => {
          if (enPantallaDelSistema() !== contenedor) return;
          try {
            Promise.resolve(orientacion?.lock?.('landscape')).catch(() => {});
          } catch {
            /* sin orientación que fijar */
          }
        })
        .catch(() => {});
    } catch {
      /* sin permiso: sigue el modo */
    }
  }

  pintarBoton();

  // Puerta 1: el mismo botón, dado vuelta. Y los otros que hacen lo mismo (`D-61`: el del menú).
  for (const b of botones) {
    b.addEventListener('click', () => {
      if (enElModo()) salir();
      else pedirPantallaCompleta();
    });
  }

  // Puerta 2: `Escape`. Con la API, el navegador la consume y avisa por la puerta 3.
  documento.addEventListener('keydown', (e) => {
    if ((e as KeyboardEvent).key === 'Escape' && enElModo() && enPantallaDelSistema() === null) salir();
  });

  // Puerta 3: el sistema la terminó (el gesto de volver, cambiar de aplicación, `Escape`).
  for (const evento of ['fullscreenchange', 'webkitfullscreenchange']) {
    documento.addEventListener(evento, () => {
      if (enPantallaDelSistema() === fichin) entroPorElSistema = true;
      else if (entroPorElSistema && enElModo()) salir();
    });
  }

  // El encuadre se rehace cada vez que el contenedor cambia de tamaño: al girar, cuando la barra
  // del navegador aparece o se va, al entrar o salir de la del sistema. Se mide la caja que
  // importa, no la ventana (`ADR-10.1`). Y el pie, que envuelve distinto con cada ancho.
  const observador = new Observador(() => encuadrar());
  observador.observe(fichin);
  const pie = fichin.querySelector('.chapa-pie');
  if (pie !== null) observador.observe(pie);

  return { enElModo, entrar, salir };
}
