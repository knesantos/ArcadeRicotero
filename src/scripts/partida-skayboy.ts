/**
 * La isla de Skayboy y Poligirl (`US-09`, `T-247`). Isla de `skayboy-y-poligirl.astro`.
 *
 * **Lo que decide el juego no vive acá.** La física, la sala, quién vuelve a la entrada y
 * cuándo se gana están en `src/lib/skayboy/mundo.ts` (`T-254`), probados con `node --test`.
 * Esta isla hace tres cosas y nada más: **escucha las seis teclas, le pasa el mando al
 * mundo una vez por cuadro, y dibuja lo que el mundo dejó.** Si algún día hay que cambiar
 * de motor (`ADR-08.6`), se reescribe este archivo y el juego no se entera.
 *
 * ## Un cuadro es siempre un cuadro (`ADR-09.1`, `T-267`)
 *
 * El motor llama a la isla con el tiempo que pasó desde el tic anterior, y ese tiempo tiembla.
 * La isla no se lo pasa al mundo: se lo da a `jugarTic()`, que lo junta en un `Reloj` y le pasa
 * al mundo **cuadros enteros de `CUADRO_SEG`** —con tope de tres por tic, y lo que sobra del tope
 * se tira—. Es el mismo `dt` con que se juega la traza grabada de cada nivel en el build: sin
 * esto, la máquina probaría una física parecida a la del teléfono, no la misma. El tic entero
 * vive en `mundo.ts` y lo juega `mundo.test.ts`; `motor.test.ts` vigila que la isla no toque el
 * tiempo por su cuenta.
 *
 * ## El motor, con sus cuatro apagados (`ADR-08.2`) — y los vigila `motor.test.ts`
 *
 * 1. `global: false`: ni un nombre del motor en `window`.
 * 2. `canvas`: el `<canvas id="juego">` que ya está en el HTML, adentro del recorte impreso
 *    (`D-41` punto 3). El motor no crea el suyo.
 * 3. **El audio: `void k.audioCtx.close()` en la línea siguiente a `kaplay(`**, sincrónico y
 *    antes de cualquier otra cosa (`ADR-08.2.1`, condición 1). Ninguna opción del init lo
 *    apaga; esta línea sí. **Y `backgroundAudio: true`**, que no enciende nada: impide que
 *    el motor le haga `suspend()`/`resume()` al contexto cerrado cada vez que la pestaña se
 *    esconde y vuelve. Todo lo que suena sale del contexto del sitio: los tres efectos por
 *    `sonido.ts` (`CTR-17`). El tema de `ADR-08.9` lo ponía la cinta, y se fue con ella el
 *    2026-10-01.
 * 4. **Cero texto en el canvas.** Todo lo que se lee vive en el DOM, con las fuentes del
 *    sitio. Y `debug: false`, porque el inspector del motor también es texto.
 *
 * ## El dibujo sale de los atlas, y de nada más (`T-278`, `CTR-15`)
 *
 * Adentro del área no hay un solo rectángulo de tinta plana: todo lo que se ve es un cuadro de
 * `public/sprites/` —`skayboy.v2`, `poligirl.v2`, `sala.v3`—, cargado a tamaño nativo y
 * escalado por el motor con un entero y sin suavizado (`crisp`, `texFilter: 'nearest'`,
 * `ADR-08.3`). **Qué** se dibuja, en qué estado y dónde lo decide `escena.ts`, probado en Node
 * (`escena.test.ts`): el mapeo de `poseDe()` a los estados del atlas, el espejo según `mira`,
 * el tile de cada celda según el estado de palancas, placas, compuertas y cajas. La isla
 * recorre esos trazos y se los pasa al motor.
 *
 * **La única tinta que la isla lee de la hoja es el aire, `--px-luz`** (`UX-27 §1.1`): es el
 * fondo del motor, y el sólido (`--px-clave`) ya viene dibujado en el tile. Si no se deja leer,
 * o si un atlas no está o no es el que la escena espera, el juego no arranca y queda el rótulo
 * impreso: un área a medio pintar sería inventar lo que falta. Lo vigila `motor.test.ts`.
 *
 * ## Ganar se ve, se baila, y se sigue con un toque (`UX-32`, `UX-33 §2`, `T-290`, `T-302`)
 *
 * **Qué se ve lo decide `escena.ts`**, como todo el dibujo: con el mundo ganado, las dos puertas
 * son `puertaAbierta` en el mismo cuadro y **los dos muñecos bailan, cada uno el suyo, en su lugar**
 * (`D-47` punto 3). Ni cartel, ni cámara, ni sonido nuevo (`UX-32 §4`). El reloj del mundo se
 * congela al ganar, así que el cuadro del baile sale de otro: la `victoria` que la isla marca
 * después de cada tic con el reloj del motor (`marcarVictoria()`), y que `relojDelTrazo()` lee al
 * dibujar. Con movimiento reducido el baile queda en su cuadro 0 (`CTR-15.7`, `ADR-08.8`).
 *
 * **En el tic en que se gana, el avance se guarda** (`guardarPasado()`, `CTR-16.11`): no al tocar
 * Seguí, así quien cierra el teléfono con la victoria en pantalla no pierde el nivel. Y aparece el
 * contador de lo que juntó cada uno, uno junto a cada muñeco, en una capa de HTML encima del área
 * (`#contador-victoria`, `UX-33 §2.5`): qué dice y dónde lo decide `mostrarContador()`, llamada
 * después de cada `jugarTic(`, como `mostrarSeguir()`.
 *
 * **Seguir es tocar el área.** Encima del canvas hay un `<button>` del tamaño del recorte
 * (`#seguir-juego`, con el verbo del sitio de etiqueta), escondido mientras se juega. En el mismo
 * tic en que el mundo termina la isla lo muestra —`mostrarSeguir()`, llamada después de cada
 * `jugarTic(`—, y tocarlo cambia el mundo por el que arma `alTocarSeguir()`, el del nivel que sigue,
 * **ahí mismo**: sin recargar, sin bajar nada, con el mismo motor y los mismos atlas (`D-32`
 * límite 3). Las dos viven en `escena.ts` y se juegan en Node; la isla pone el pegamento y suelta
 * las teclas al cambiar de nivel: el que arranca tiene que estar quieto (`UX-28 §3`). En el último
 * nivel aparece igual y lleva al primero de la fila: la pieza compartible de `BR-27` (`BR-31`
 * punto 1), que es a donde el papel manda ese toque, todavía no existe.
 *
 * **Al entrar se juega el primero de la fila que falta** (`CTR-16.11.2`): `nivelAJugar()` con el
 * avance guardado, que `cargarAvance()` lee una vez, al arrancar.
 *
 * ## Se carga solo si hay un nivel que jugar
 *
 * El motor entra con `import()` y no arriba de todo: si la página no sembró ningún nivel,
 * el teléfono no baja 66,8 KB para mostrar el rótulo que ya estaba. Y en producción la
 * página siembra **solo los `listo`** (`nivelesListos()`): hasta que alguien juegue el nivel
 * 1 en un teléfono (`T-249`), lo que se ve publicado es el rótulo estático — que dice qué va
 * a haber ahí y no promete nada (`ADR-08.2`). Es lo honesto.
 *
 * **En desarrollo** la página siembra todos los niveles, borradores incluidos, y la isla juega el
 * primero que falta —o el que pida `?nivel=NIV-04` en la dirección, que le gana al avance—. Ese
 * pedido no existe en el build.
 *
 * ## Las teclas se mantienen apretadas, y eso el repo no lo tenía (`ADR-08.10`)
 *
 * El estado se lee por `pointerdown` / `pointerup` **con captura**, nunca por repetición de
 * eventos. Cada tecla lleva la cuenta de qué punteros la están apretando: dos dedos en la
 * misma tecla y uno que se levanta no la sueltan. Si la pestaña se esconde, se sueltan
 * todas — una tecla trabada es un personaje que camina solo, y el que espera tiene que
 * estar quieto (`UX-28 §3`).
 *
 * ## La pantalla completa es un modo de la página (`ADR-10`, `UX-33 §1`, `T-301`)
 *
 * El pedido de `D-47` no fue la API del sistema: fue que *el scroll no rompa los controles*. Por
 * eso el modo es **un atributo en `<html>`** —`data-pantalla="completa"`— que la hoja lee para
 * fijar `.fichin` a la ventana, cortar todo gesto del navegador y agrandar el área, y que ponen
 * y sacan solo `entrar()` y `salir()`. **Además**, en el mismo toque y sin ningún `await` antes,
 * se le pide al sistema su pantalla completa **sobre `.fichin`, nunca sobre el canvas** —si la
 * pidiera el canvas, desaparecerían las teclas, el botón de salir y el pie de homenaje—, y la
 * orientación horizontal, solo donde las dos existen. En iPhone no existen: el modo es todo lo
 * que hay, y alcanza (`D-47` consecuencia 2).
 *
 * Se sale por tres puertas que llegan a `salir()`: el mismo botón, `Escape`, y el sistema cuando
 * termina su pantalla completa. **El motor no se entera**: no se reinicia el nivel ni se toca el
 * reloj; cambia solo la caja CSS del canvas, que calcula `encuadre()` (`pantalla.ts`, probada en
 * Node) cada vez que el contenedor cambia de tamaño. Lo vigila `motor.test.ts`: ni
 * `setFullscreen` ni `isFullscreen` del motor, ni `stretch` ni `letterbox` en el init.
 *
 * Las funciones del modo viven en `modo-pantalla.ts`, que recibe el documento, la ventana y el
 * contenedor en vez de leerlos, y así `modo-pantalla.test.ts` las juega en Node con utilería:
 * que el pedido salga en el mismo toque, sobre `.fichin`, y que cada puerta saque de verdad.
 *
 * ## El menú, la tarjeta de fin de nivel y el rótulo de entrada (`D-61`)
 *
 * **El juego abre con el menú**, en la región del tubo y los mandos (`regionDelMenu()`): el botón
 * grande juega el nivel que corresponde —el mismo que elegía `nivelAJugar()` antes de `D-61`, ya
 * armado— y al lado están los seis niveles, todos abiertos. El sello `MENÚ` del mueble lo vuelve a
 * abrir, y **mientras está abierto el mundo no avanza**: el tic vuelve antes de `jugarTic(`, así que
 * el reloj de la partida no corre y nadie se mueve. Al ganar aparece la tarjeta de fin de nivel,
 * arriba del área; al empezar cada nivel, el rótulo con su número y su nombre.
 *
 * Qué dice cada cosa, qué nivel arma cada botón y cuándo se ve la tarjeta lo deciden `menu.ts` y
 * `escena.ts`, jugadas en Node (`menu.test.ts`). Acá queda el pegamento. **El toque de seguir sigue
 * siendo uno solo** (`#seguir-juego`): el "Seguí" de la tarjeta lo aprieta, no tiene un camino propio.
 *
 * ## El pulgar rueda (`D-61` punto 4)
 *
 * Desde `D-61` el puntero no lo captura cada botón sino **la columna** (`.mando`), y la tecla que
 * aprieta un dedo la decide `dedos.ts` por geometría: la más cercana, sin franjas muertas, y con la
 * dirección que viaja al subir el pulgar de una flecha a saltar. Así un pulgar por columna corre
 * saltando. Las seis teclas siguen siendo los mismos botones: el dedo, el teclado y la leyenda de
 * `D-55` leen y escriben el mismo estado (`apretadas`), y el motor lee lo de siempre (`mandoDe`).
 *
 * Y un toque más corto que un tic no se pierde: `pulsadas` guarda lo que se apretó desde la última
 * vez que el mundo avanzó, y se vacía recién cuando avanzó.
 *
 * ## `prefers-reduced-motion` (`ADR-08.8`, vara 1)
 *
 * El juego arranca **quieto por construcción**: los dos parados en su entrada, y nada se
 * mueve sin un dedo encima. **El único movimiento que nadie pidió con un dedo es el baile de la
 * victoria** (`D-47`), y por eso la isla consulta la preferencia (`movimientoReducido()`) y, con
 * movimiento reducido, lo deja fijo en su cuadro 0 (`CTR-15.7`). Lo demás no tiene nada que apagar.
 */

import type { KAPLAYCtx, SpriteData } from 'kaplay';
import { QUIETO, crearMundo, crearReloj, jugarTic, type Mando, type Mundo, type Suceso } from '../lib/skayboy/mundo.ts';
import type { Banco, IdPersonaje } from '../lib/skayboy/niveles.ts';
import type { JsonDelAtlas } from '../lib/pixel/fuente.ts';
import {
  PIEZAS,
  alTocarSeguir,
  atlasDe,
  avisoDelSuceso,
  crearVictoria,
  cuadroDelAtlas,
  esElUltimo,
  grillaDelAtlas,
  marcarVictoria,
  mostrarContador,
  mostrarSeguir,
  nivelAJugar,
  pidioMenosMovimiento,
  problemasDelAtlas,
  problemasDelCuadro,
  relojDelTrazo,
  rutaDe,
  trazosDe,
  type CapaDelContador,
  type Pieza,
  type Victoria,
} from '../lib/skayboy/escena.ts';
import { cargarAvance, guardarPasado } from '../lib/skayboy/avance.ts';
import { armarEfectos, sonar } from '../lib/skayboy/sonido.ts';
import { despertarSalida } from '../lib/audio/contexto.ts';
import { montarPantallaCompleta, type ModoDePantalla } from '../lib/skayboy/modo-pantalla.ts';
import { botonDelEvento, type TeclaDelMando } from '../lib/skayboy/teclado.ts';
import {
  SIN_TECLA,
  apoyarDedo,
  moverDedo,
  teclaBajoElDedo,
  teclasDelDedo,
  type CajaDeTecla,
  type CajasDelMando,
  type Dedo,
} from '../lib/skayboy/dedos.ts';
import {
  DURACION_DEL_ROTULO_MS,
  alRepetir,
  alTocarFicha,
  actualDelMenu,
  enLaFila,
  fichasDelMenu,
  finDeNivel,
  momentoDe,
  mostrarFinDeNivel,
  nivelDelBotonGrande,
  regionDelMenu,
  type Rectangulo,
} from '../lib/skayboy/menu.ts';
import { ENTRADA, FIN_DE_NIVEL, MENU, PANTALLA } from '../lib/skayboy/copy.ts';

/**
 * Qué columna maneja a quién. **Siempre la misma** (`D-43`): no hay botón de cambio y no
 * hay modo que elegir (`UX-28 §1`). La izquierda es de Skayboy porque en el nivel 1 su
 * puerta queda a la izquierda — la columna apunta hacia donde va el personaje.
 */
const COLUMNA: Readonly<Record<'izquierda' | 'derecha', IdPersonaje>> = {
  izquierda: 'skayboy',
  derecha: 'poligirl',
};

type Tecla = 'izquierda' | 'derecha' | 'salto';

/**
 * **El aire del área** (`UX-27 §1.1`, decisión `β`): todo lo que no es sólido, terreno pintado ni
 * sprite. Es el fondo del motor y la única tinta que esta isla lee de la hoja; el resto viene
 * dibujado en los atlas. El hex vive en `tokens.css` (`--px-luz: var(--papel)`), ni uno acá.
 */
const AIRE = '--px-luz';

function leerTinta(nombre: string): [number, number, number] {
  const valor = getComputedStyle(document.documentElement).getPropertyValue(nombre).trim();
  const hex = /^#([0-9a-f]{6})$/i.exec(valor)?.[1];
  // Sin el aire no se arranca: un gris de repuesto sería una tinta diecisiete (`UX-27 §4`).
  if (hex === undefined) throw new Error(`${nombre} no se deja leer como #rrggbb: «${valor}»`);
  return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
}

/* ==========================================================================
   Las teclas
   ========================================================================== */

/** Qué punteros aprietan cada tecla de cada columna. Vacío es suelta. */
const apretadas = new Map<HTMLButtonElement, Set<number>>();

/**
 * **Las teclas que se apretaron desde la última vez que el mundo avanzó**, aunque ya estén sueltas
 * (`D-61` punto 4). Un toque más corto que un tic —el hilo trabado en un teléfono de gama baja, o
 * un tic de una pantalla de 120 Hz que no llegó a jugar un cuadro— se perdía entero: el salto sale
 * por flanco y nunca veía el `true`. El tic las vacía recién cuando el reloj del mundo se movió.
 */
const pulsadas = new Set<HTMLButtonElement>();

function mandoDe(lado: 'izquierda' | 'derecha'): Mando {
  const m = { izquierda: false, derecha: false, saltar: false };
  for (const [boton, punteros] of apretadas) {
    if ((punteros.size === 0 && !pulsadas.has(boton)) || boton.dataset.mando !== lado) continue;
    const tecla = boton.dataset.tecla as Tecla;
    if (tecla === 'salto') m.saltar = true;
    else m[tecla] = true;
  }
  return m;
}

function pintarTecla(boton: HTMLButtonElement): void {
  boton.classList.toggle('tecla--apretada', (apretadas.get(boton)?.size ?? 0) > 0);
}

function apretar(boton: HTMLButtonElement, puntero: number): void {
  apretadas.get(boton)?.add(puntero);
  pulsadas.add(boton);
  pintarTecla(boton);
}

function soltar(boton: HTMLButtonElement, puntero: number): void {
  apretadas.get(boton)?.delete(puntero);
  pintarTecla(boton);
}

/**
 * Suelta todo. **Los dedos que siguen apoyados quedan mudos hasta levantarse** (`UX-28 §3`: el que
 * arranca tiene que estar quieto): se olvida qué apretaba cada uno, y la columna ya no los sigue.
 */
function soltarTodas(): void {
  dedos.clear();
  pulsadas.clear();
  for (const [boton, punteros] of apretadas) {
    punteros.clear();
    pintarTecla(boton);
  }
}

/* ---- El dedo: la columna lo sigue por geometría (`dedos.ts`, `D-61` punto 4) ---- */

/** Lo que aprieta cada dedo apoyado en una columna, por puntero. */
const dedos = new Map<number, { readonly mando: HTMLElement; readonly dedo: Dedo }>();

const TECLAS_DE_LA_COLUMNA: readonly TeclaDelMando[] = ['salto', 'izquierda', 'derecha'];

function botonDeLaTecla(mando: HTMLElement, tecla: TeclaDelMando): HTMLButtonElement | null {
  return mando.querySelector<HTMLButtonElement>(`button[data-tecla="${tecla}"]`);
}

/**
 * Las cajas de las tres teclas de la columna, medidas ahora: la pantalla completa, el giro del
 * teléfono o la barra del navegador las mueven. Una tecla escondida mide cero y no cuenta (`D-55`).
 */
function cajasDe(mando: HTMLElement): CajasDelMando {
  const cajas: Partial<Record<TeclaDelMando, CajaDeTecla>> = {};
  for (const tecla of TECLAS_DE_LA_COLUMNA) {
    const r = botonDeLaTecla(mando, tecla)?.getBoundingClientRect();
    if (r !== undefined) cajas[tecla] = { izquierda: r.left, arriba: r.top, ancho: r.width, alto: r.height };
  }
  return cajas;
}

/** Cambia lo que aprieta un dedo: suelta lo de antes y aprieta lo nuevo. Sin cambio, nada. */
function ponerDedo(mando: HTMLElement, puntero: number, dedo: Dedo): void {
  const antes = dedos.get(puntero)?.dedo ?? SIN_TECLA;
  if (antes === dedo) return;
  for (const tecla of teclasDelDedo(antes)) {
    const boton = botonDeLaTecla(mando, tecla);
    if (boton !== null) soltar(boton, puntero);
  }
  for (const tecla of teclasDelDedo(dedo)) {
    const boton = botonDeLaTecla(mando, tecla);
    if (boton !== null) apretar(boton, puntero);
  }
  dedos.set(puntero, { mando, dedo });
}

function levantarDedo(puntero: number): void {
  const d = dedos.get(puntero);
  if (d === undefined) return;
  ponerDedo(d.mando, puntero, SIN_TECLA);
  dedos.delete(puntero);
}

/** El teclado usa un puntero que ningún dedo puede tener. */
const TECLADO = -1;

/**
 * Y el teclado de la página, otro (`D-53`): W A D para Skayboy y las flechas para Poligirl
 * (`lib/skayboy/teclado.ts`). Distinto del de arriba para que soltar la tecla del botón
 * enfocado no suelte también la `A` que alguien sigue sosteniendo.
 */
const TECLADO_DE_LA_PAGINA = -2;

function escucharTeclas(): void {
  /*
   * El dedo (`D-61` punto 4). **La columna captura el puntero, no el botón**: un botón que captura
   * se queda con el dedo hasta que se levanta, y el pulgar que se corre de ← a → seguía caminando a
   * la izquierda. Ahora cada movimiento se vuelve a medir contra las tres cajas de la columna
   * (`teclaBajoElDedo()`), y lo que aprieta el dedo lo decide `moverDedo()`: la flecha que pisa,
   * o saltar llevándose la flecha de la que subió.
   */
  for (const mando of document.querySelectorAll<HTMLElement>('.mando')) {
    mando.addEventListener('pointerdown', (e) => {
      const tecla = teclaBajoElDedo(cajasDe(mando), e.clientX, e.clientY);
      // Lejos de toda tecla —con mouse, sobre la leyenda de `D-55`—, el toque no es del mando.
      if (tecla === null) return;
      // No pasivo a propósito: cancelar acá es lo que evita que el toque largo abra el menú
      // del sistema o seleccione texto mientras el pulgar sostiene la dirección.
      e.preventDefault();
      // La captura es lo que deja correr el pulgar por la columna. Si el navegador no la da (un
      // puntero que ya se fue), la tecla se aprieta igual y se suelta al salir de la columna.
      try {
        mando.setPointerCapture(e.pointerId);
      } catch {
        /* sigue sin captura */
      }
      ponerDedo(mando, e.pointerId, apoyarDedo(tecla));
    });
    mando.addEventListener('pointermove', (e) => {
      const d = dedos.get(e.pointerId);
      // Un dedo que nadie sigue: con mouse sin apretar, o uno que quedó mudo con `soltarTodas()`.
      if (d === undefined || d.mando !== mando) return;
      ponerDedo(mando, e.pointerId, moverDedo(d.dedo, teclaBajoElDedo(cajasDe(mando), e.clientX, e.clientY)));
    });
    for (const fin of ['pointerup', 'pointercancel', 'lostpointercapture'] as const) {
      mando.addEventListener(fin, (e) => levantarDedo(e.pointerId));
    }
    mando.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  for (const boton of document.querySelectorAll<HTMLButtonElement>('button[data-mando][data-tecla]')) {
    apretadas.set(boton, new Set());

    // Con teclado también se juega: la tecla del botón enfocado se mantiene como un dedo.
    boton.addEventListener('keydown', (e) => {
      if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
        e.preventDefault();
        apretar(boton, TECLADO);
      }
    });
    boton.addEventListener('keyup', (e) => {
      if (e.key === ' ' || e.key === 'Enter') soltar(boton, TECLADO);
    });
    boton.addEventListener('blur', () => soltar(boton, TECLADO));
  }

  /*
   * El teclado de la computadora (`D-53`). Aprieta **el mismo botón** que el dedo —el de su
   * columna y su dirección—, así que el juego no tiene un segundo camino: se ve la tecla
   * hundida (`.tecla--apretada`) y el motor lee lo mismo de siempre (`mandoDe`). La
   * repetición del sistema se ignora: la tecla se mantiene por estado, no por eventos
   * (`ADR-08.10`). Y se cancela lo que el navegador haría con esas teclas —las flechas
   * desplazan la página—, solo para las seis del mapa.
   */
  const botonDe = (mando: string, tecla: string): HTMLButtonElement | null =>
    document.querySelector<HTMLButtonElement>(`button[data-mando="${mando}"][data-tecla="${tecla}"]`);
  document.addEventListener('keydown', (e) => {
    // Con el menú abierto las flechas son del menú (desplazan la lista), no del mando.
    if (menuAbierto()) return;
    const t = botonDelEvento(e);
    if (!t) return;
    e.preventDefault();
    if (e.repeat) return;
    const boton = botonDe(t.mando, t.tecla);
    if (boton) apretar(boton, TECLADO_DE_LA_PAGINA);
  });
  document.addEventListener('keyup', (e) => {
    // Se suelta aunque ahora haya un Ctrl apretado: la tecla se apretó sin él.
    const t = botonDelEvento({ code: e.code });
    if (!t) return;
    const boton = botonDe(t.mando, t.tecla);
    if (boton) soltar(boton, TECLADO_DE_LA_PAGINA);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) soltarTodas();
  });
  // Si la ventana pierde el foco con una tecla apretada (un Alt+Tab), el `keyup` no llega
  // nunca: sin esto, el personaje sigue caminando solo.
  window.addEventListener('blur', soltarTodas);
}

/* ==========================================================================
   El sonido: se arma con el primer toque de la partida (`CTR-17`)
   ========================================================================== */

/**
 * Los tres efectos suenan desde el primer toque, sin interruptor.
 *
 * Hasta el 2026-10-01 se armaban con la cinta y se soltaban con ella (`CTR-17.5`): con la
 * cinta apagada este juego se jugaba en silencio entero. La cinta se sacó del sitio, y
 * dejarlo como estaba con ella apagada era dejarlo mudo para siempre. Así que suena como
 * sonaba con la cinta prendida —los efectos, sin la cama abajo— y **no hay un control propio
 * para callarlo**: si hace falta, es una decisión que todavía no se tomó.
 *
 * El contexto se construye acá, **adentro del gesto**, con `despertarSalida()`: ningún
 * navegador deja sonar nada que no haya pedido una persona, y `sonido.ts` solo mira el que
 * hay. Se escucha `pointerup` y no `pointerdown` porque en el celular el gesto que habilita
 * el audio es el que levanta el dedo; con el mouse, el `pointerup` llega todavía adentro
 * del gesto del `pointerdown`. Se sigue escuchando hasta que la salida queda corriendo: un
 * toque que el navegador no aceptó no cierra la puerta, la deja para el próximo.
 */
function engancharEfectos(): void {
  const eventos = ['pointerup', 'keydown'] as const;
  const despertar = (): void => {
    void despertarSalida().then((estado) => {
      // Corriendo, o sin Web Audio: un toque más no cambia nada, y se deja de escuchar.
      if (estado === null || estado === 'running') {
        for (const evento of eventos) document.removeEventListener(evento, despertar, true);
      }
    });
    armarEfectos();
  };
  for (const evento of eventos) document.addEventListener(evento, despertar, true);
}

/* ==========================================================================
   Lo que pasa con cada suceso
   ========================================================================== */

const aviso = document.querySelector<HTMLElement>('#aviso-juego');

/** El botón del recorte que lleva al nivel que sigue (`UX-32 §5`). Nace escondido en el HTML. */
const seguir = document.querySelector<HTMLButtonElement>('#seguir-juego');

/**
 * `deFrente` junta a los que volvieron a la entrada en este tic: el cuadro que sigue se dibujan
 * de frente (`UX-29 §3`, fila 1), y después la isla lo vacía.
 *
 * **Qué dice el lector de pantalla lo elige `avisoDelSuceso()`** (`escena.ts`, `CNT-18`, `CNT-22`):
 * la vuelta nombra el lugar, el coleccionable nombra el objeto, y ganar nombra las dos puertas;
 * nunca a la persona. Se escribe una vez por suceso, vaciando antes, para que el lector lo repita.
 * `ultimo` es si el nivel que se juega es el último de la fila (`esElUltimo()`): ahí el de ganar
 * dice también que era el último, porque el toque vuelve al primero.
 */
function atender(sucesos: readonly Suceso[], deFrente: Set<IdPersonaje>, ultimo: boolean): void {
  for (const s of sucesos) {
    const texto = avisoDelSuceso(s, ultimo);
    if (texto !== null && aviso !== null) {
      aviso.textContent = '';
      aviso.textContent = texto;
    }
    // Callado también: la compuerta no suena (`CTR-16.10.7`, cuatro motivos) y el dibujo lee el
    // estado del mundo, no el suceso. Lo consume la cuenta de la paridad (`CTR-18.8`), no la isla.
    if (s.tipo === 'compuerta') continue;
    if (s.tipo === 'vuelta') {
      deFrente.add(s.quien);
      // Callado: `vuelta` no suena (`UX-29 §5`, `CTR-17.6`).
      continue;
    }
    sonar(s.tipo);
  }
}

/**
 * La capa del contador de la victoria (`UX-33 §2.5`): nace escondida en el HTML, adentro del
 * recorte, con una etiqueta por personaje. Qué dice cada una, dónde va y cuándo se ve lo decide
 * `mostrarContador()`; acá solo se buscan los nodos. Sin la capa, `null`, y no se cuenta nada.
 */
function capaDelContador(): CapaDelContador | null {
  const capa = document.querySelector<HTMLElement>('#contador-victoria');
  const skayboy = capa?.querySelector<HTMLElement>('[data-de="skayboy"]');
  const poligirl = capa?.querySelector<HTMLElement>('[data-de="poligirl"]');
  if (capa === null || skayboy == null || poligirl == null) return null;
  return { capa, etiquetas: { skayboy, poligirl } };
}

/**
 * **Si la persona pidió menos movimiento** (`ADR-08.8` vara 1, `CTR-15.7`). Se lee en cada cuadro
 * y no una vez: la preferencia se puede cambiar con el juego abierto. Sin `matchMedia`, no.
 */
const preferencia = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null;

function movimientoReducido(): boolean {
  return pidioMenosMovimiento(preferencia);
}

/* ==========================================================================
   Los atlas (`CTR-15.6`): un PNG y su JSON por pieza, a tamaño nativo
   ========================================================================== */

/** Un atlas cargado: su JSON (qué fila es qué estado) y los cuadros que el motor cortó del PNG. */
interface Atlas {
  readonly json: JsonDelAtlas;
  readonly sprite: SpriteData;
}

/**
 * Los tres JSON, antes de bajar el motor: si alguno no está o no es el que la escena espera,
 * el motor ni se baja y queda el rótulo. Las rutas las arma `rutaDe()`, que no arma ninguna sin
 * versión en el nombre (`CTR-15.8`).
 */
async function leerLosJson(nombres: Readonly<Record<Pieza, string>>): Promise<Record<Pieza, JsonDelAtlas>> {
  const pares = await Promise.all(
    PIEZAS.map(async (pieza) => {
      const ruta = rutaDe(nombres[pieza], 'json');
      const respuesta = await fetch(ruta);
      if (!respuesta.ok) throw new Error(`${ruta}: ${respuesta.status}`);
      const json: unknown = await respuesta.json();
      const problemas = problemasDelAtlas(pieza, json);
      if (problemas.length > 0) throw new Error(problemas.join('\n'));
      return [pieza, json as JsonDelAtlas] as const;
    }),
  );
  return Object.fromEntries(pares) as Record<Pieza, JsonDelAtlas>;
}

/**
 * El PNG de una pieza, cortado en la grilla de su JSON: una fila por estado, una columna por
 * cuadro. **No se reescala**: cada cuadro tiene que medir la celda en nativos, y si el PNG vino
 * agrandado no entra (`CTR-15.6`). La escala la pone el motor al dibujar, entera.
 */
function cargarAtlas(k: KAPLAYCtx, pieza: Pieza, nombre: string, json: JsonDelAtlas): Promise<Atlas> {
  const { columnas, filas } = grillaDelAtlas(json);
  const asset = k.loadSprite(null, rutaDe(nombre, 'png'), { sliceX: columnas, sliceY: filas });
  return new Promise((resolver, rechazar) => {
    asset.onLoad((sprite) => {
      const problemas = problemasDelCuadro(pieza, json, sprite.width, sprite.height);
      if (problemas.length > 0) rechazar(new Error(problemas.join('\n')));
      else resolver({ json, sprite });
    });
    asset.onError(rechazar);
  });
}

/* ==========================================================================
   El dibujo: cada trazo de la escena, un cuadro de un atlas (`T-278`)
   ========================================================================== */

function dibujar(
  k: KAPLAYCtx,
  mundo: Mundo,
  atlas: Readonly<Record<Pieza, Atlas>>,
  deFrente: ReadonlySet<IdPersonaje>,
  victoria: Victoria,
): void {
  for (const t of trazosDe(mundo, deFrente)) {
    const { json, sprite } = atlas[t.pieza];
    k.drawSprite({
      sprite,
      // El reloj de cada trazo: el de la partida, salvo el baile, que cuenta desde que se ganó.
      frame: cuadroDelAtlas(json, t.estado, relojDelTrazo(t, mundo, victoria, movimientoReducido())),
      pos: k.vec2(t.x, t.y),
      flipX: t.espejo,
    });
  }
}

/* ==========================================================================
   El arranque
   ========================================================================== */

/**
 * `E` de `ADR-08.3`: cuántos píxeles de dispositivo ocupa un píxel nativo. Entero siempre;
 * con DPR fraccionario cede el buffer y no la caja CSS.
 */
function escalaCss(): number {
  const fichin = document.querySelector<HTMLElement>('.fichin');
  const valor = fichin === null ? 1 : Number(getComputedStyle(fichin).getPropertyValue('--escala'));
  return Number.isInteger(valor) && valor > 0 ? valor : 1;
}

async function arrancar(): Promise<void> {
  const canvas = document.querySelector<HTMLCanvasElement>('#juego');
  const datos = document.querySelector('#banco-skayboy')?.textContent;
  if (canvas === null || datos === undefined || datos === null) return;
  const banco = JSON.parse(datos) as Banco;
  // Solo en desarrollo, `?nivel=NIV-04` juega otro nivel sembrado (`nivelAJugar()`): sin esto, lo
  // único que se ve en el navegador es el nivel 1, que no tiene palancas, placas, compuertas ni
  // cajas. En el build `import.meta.env.DEV` es `false`, la rama se va, y se juega el primero.
  const pedido = import.meta.env.DEV ? new URLSearchParams(location.search).get('nivel') : null;
  // El primero de la fila que falta, con el avance guardado en el aparato (`CTR-16.11.2`); el
  // pedido de desarrollo le gana. Se lee una sola vez, acá.
  const nivel = nivelAJugar(banco.niveles, pedido, cargarAvance());
  // Sin un nivel sembrado queda el rótulo impreso, y el motor ni se baja.
  if (nivel === undefined) return;

  // El aire y los tres JSON, antes que el motor: si falta cualquiera, el motor ni se baja.
  const aire = leerTinta(AIRE);
  const nombres = atlasDe(banco);
  const jsons = await leerLosJson(nombres);

  const escala = escalaCss();
  const densidad = Math.max(escala, Math.round(escala * window.devicePixelRatio)) / escala;
  const { default: kaplay } = await import('kaplay');
  const k = kaplay({
    global: false,
    canvas,
    width: 240,
    height: 144,
    scale: escala,
    pixelDensity: densidad,
    // Sin suavizado, en las dos puntas: `crisp` es el `pixelated` del canvas, y `texFilter`
    // el muestreo de los atlas. Es el valor por defecto del motor y se escribe igual: un
    // `linear` que se cuele es barro (`CTR-15.2`), y así lo vigila `motor.test.ts`.
    crisp: true,
    texFilter: 'nearest',
    // Un píxel transparente entre pieza y pieza del atlas interno del motor: con densidad
    // fraccionaria (`ADR-08.3`, el caso feo) el muestreo no le roba un borde al vecino.
    spriteAtlasPadding: 1,
    debug: false,
    // Que el motor no enfoque el canvas al arrancar: el canvas cancela Tab, y el que juega con el
    // teclado quedaba trabado ahí al cerrar el menú (la revisión de `D-61`).
    focus: false,
    loadingScreen: false,
    burp: false,
    touchToMouse: false,
    // No es para que algo suene de fondo: es para que el motor **no toque** su contexto.
    // Sin esto, al esconderse la pestaña hace `suspend()` y al volver `resume()` sobre el
    // contexto que acabamos de cerrar, y cada vuelta tira un error sin atrapar ("Cannot
    // resume a closed AudioContext"). Medido en el navegador el 2026-09-22; es la mitad del
    // apagado que `ADR-08.2.1` no sabía que faltaba.
    backgroundAudio: true,
    background: aire,
  });
  void k.audioCtx.close();

  // El motor escribe el tamaño de la caja en línea; se lo sacamos para que lo mande la
  // hoja (`--escala`), que es la que sabe del reparto de `UX-28 §2`. Y el canvas no se
  // enfoca: las que se enfocan son las teclas, que tienen nombre.
  canvas.style.removeProperty('width');
  canvas.style.removeProperty('height');
  canvas.tabIndex = -1;

  const cargados = await Promise.all(PIEZAS.map((pieza) => cargarAtlas(k, pieza, nombres[pieza], jsons[pieza])));
  const atlas = Object.fromEntries(PIEZAS.map((pieza, i) => [pieza, cargados[i]])) as Record<Pieza, Atlas>;
  // `let`: seguir al próximo nivel es cambiar este mundo por otro. El reloj no se cambia: es el
  // del motor, y lo que guarda es menos de un cuadro de tiempo, no nada del nivel.
  let mundo = crearMundo(banco, nivel);
  const reloj = crearReloj();
  const deFrente = new Set<IdPersonaje>();
  // Cuándo se ganó, con el reloj del motor: el del baile (`CTR-15.7`). Una sola para toda la fila.
  const victoria = crearVictoria();
  const contador = capaDelContador();

  // Qué hace el toque y cuándo se ve el botón lo deciden `alTocarSeguir()` y `mostrarSeguir()`,
  // jugadas en Node; acá queda el pegamento con el DOM (`escena.test.ts` vigila que se llamen).
  seguir?.addEventListener('click', () => {
    const nuevo = alTocarSeguir(mundo, banco.niveles, deFrente);
    if (nuevo === undefined) return;
    // Si llegó con el teclado desde la tarjeta (`#seguir-juego` ya no se enfoca, `UX-37` §4.5), el
    // foco va al sello del menú: esconder la tarjeta enfocada lo mandaría al `body`.
    const conTeclado = focoConTecladoEn(tarjeta);
    mundo = nuevo;
    // El que arranca tiene que estar quieto (`UX-28 §3`): ningún dedo pasa de un nivel al otro.
    soltarTodas();
    mostrarSeguir(seguir, mundo, banco.niveles);
    mostrarContador(contador, mundo);
    // La tarjeta se va y el rótulo del nivel nuevo aparece (`D-61` punto 3).
    alCambiarDeNivel();
    if (conTeclado) focoAlSello();
  });

  /* ---- El menú, la tarjeta y el rótulo (`D-61`): el pegamento con el DOM ---- */

  /** Cambiar el mundo desde el menú o la tarjeta: lo mismo que hace el toque de seguir, con otro mundo. */
  function ponerMundo(nuevo: Mundo): void {
    mundo = nuevo;
    soltarTodas();
    mostrarSeguir(seguir, mundo, banco.niveles);
    mostrarContador(contador, mundo);
    alCambiarDeNivel();
  }

  /** Lo que pasa cada vez que arranca un nivel: la tarjeta se va y aparece el rótulo. */
  function alCambiarDeNivel(): void {
    tarjetaDe = null;
    mostrarFinDeNivel(tarjeta, mundo, banco.niveles, menuAbierto());
    mostrarRotulo();
  }

  /**
   * El rótulo de entrada: número y nombre, un rato, y se va solo. El lector de pantalla oye lo
   * mismo por `#aviso-juego`, en minúsculas. Con el menú abierto no aparece: se ve al cerrarlo.
   */
  function mostrarRotulo(): void {
    const enFila = enLaFila(banco.niveles, mundo.nivel);
    if (rotulo === null || enFila === undefined || menuAbierto()) return;
    const numero = rotulo.querySelector('.rotulo-nivel-numero');
    const nombre = rotulo.querySelector('.rotulo-nivel-nombre');
    if (numero !== null) numero.textContent = ENTRADA.rotulo(enFila.numero, enFila.total);
    if (nombre !== null) nombre.textContent = enFila.nombre;
    rotulo.hidden = false;
    window.clearTimeout(rotuloHasta);
    rotuloHasta = window.setTimeout(esconderRotulo, DURACION_DEL_ROTULO_MS);
    if (aviso !== null) {
      aviso.textContent = '';
      aviso.textContent = MENU.cualToca(enFila.numero, enFila.nombre);
    }
  }

  /** La tarjeta, cuando aparece: los textos del nivel que se pasó y del que sigue, una vez por mundo. */
  function pintarTarjeta(): void {
    const fin = finDeNivel(mundo, banco.niveles);
    if (fin === null || tarjetaDe === mundo) return;
    tarjetaDe = mundo;
    // Si se ganó con el rótulo todavía a la vista, la tarjeta lo esconde (`UX-37` §4.3 y §5.2).
    esconderRotulo();
    if (tarjetaRotulo !== null) tarjetaRotulo.textContent = FIN_DE_NIVEL.rotulo(fin.pasado.numero, fin.pasado.total);
    // En el sexto, en vez del que sigue, que era el último: el botón ya dice a dónde va (`CNT-40`).
    if (tarjetaSigue !== null) {
      tarjetaSigue.textContent = fin.ultimo ? FIN_DE_NIVEL.ultimo : FIN_DE_NIVEL.sigue(fin.sigue.nombre || MENU.numero(fin.sigue.numero));
    }
    if (tarjetaAvanza !== null) tarjetaAvanza.textContent = fin.ultimo ? FIN_DE_NIVEL.volverAlPrimero : PANTALLA.seguir;
    // **El foco no se mueve** (`UX-37` §4.5): la persona puede estar con las teclas apretadas, y un
    // Enter repetido tocaría "Seguí" sin que la tarjeta llegue a verse. Con el teclado se sigue con
    // un Enter nuevo (abajo, `alApretarEnter`) o se llega con Tab.
  }

  /**
   * El menú, pintado con el mundo de ahora: qué dice el botón grande, qué nivel es, y el estado de
   * cada ficha con el avance recién leído (otra pestaña puede haber ganado uno).
   */
  function pintarMenu(): void {
    const momento = momentoDe(mundo);
    const grande = enLaFila(banco.niveles, nivelDelBotonGrande(mundo, banco.niveles));
    if (menuJugar !== null) menuJugar.textContent = momento === 'pausa' ? MENU.seguirJugando : MENU.jugar;
    if (menuCual !== null) menuCual.textContent = grande === undefined ? '' : MENU.cualToca(grande.numero, grande.nombre);
    if (menuCualCorto !== null) menuCualCorto.textContent = grande === undefined ? '' : MENU.numero(grande.numero);
    if (menuRepetir !== null) menuRepetir.hidden = momento !== 'pausa';
    const fichas = fichasDelMenu(banco.niveles, cargarAvance(), actualDelMenu(mundo));
    for (const f of fichas) {
      const ficha = menu?.querySelector<HTMLButtonElement>(`.ficha-nivel[data-nivel="${f.id}"]`);
      if (ficha == null) continue;
      ficha.toggleAttribute('data-pasado', f.pasado);
      ficha.toggleAttribute('data-actual', f.actual);
      ficha.toggleAttribute('data-toca', grande !== undefined && f.id === grande.id && momento !== 'pausa');
      // Un sello a la vista por ficha (`UX-37` §3.1), y el lector dice lo que dice el sello (`CNT-40`
      // §1.1): en la de ahora, "acá estás", aunque esté pasada.
      ficha.setAttribute('aria-label', MENU.etiqueta(f.numero, f.nombre, f.pasado && !f.actual, f.actual));
      const sello = ficha.querySelector<HTMLElement>('.ficha-nivel-sello');
      if (sello !== null) {
        sello.textContent = f.actual ? MENU.estasAca : f.pasado ? MENU.pasado : '';
        sello.hidden = sello.textContent === '';
      }
    }
  }

  /** De dónde se abrió el menú: al cerrarlo, el foco vuelve ahí si sigue a la vista. */
  let abiertoDesde: HTMLElement | null = null;

  function abrirMenu(): void {
    if (menu === null || menuAbierto()) return;
    soltarTodas();
    pintarMenu();
    esconderRotulo();
    abiertoDesde = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    menu.hidden = false;
    ubicarMenu();
    lugaresInertes(true);
    mostrarFinDeNivel(tarjeta, mundo, banco.niveles, true);
    menuJugar?.focus({ preventScroll: true });
  }

  function cerrarMenu(): void {
    if (menu === null || !menuAbierto()) return;
    const empieza = momentoDe(mundo) === 'entrada';
    const conTeclado = focoConTecladoEn(menu);
    const teniaElFoco = menu.contains(document.activeElement);
    menu.hidden = true;
    lugaresInertes(false);
    // Nadie pasa del menú a la partida con un dedo apretado (`UX-28 §3`).
    soltarTodas();
    mostrarFinDeNivel(tarjeta, mundo, banco.niveles, false);
    if (finDeNivel(mundo, banco.niveles) !== null) pintarTarjeta();
    if (empieza) mostrarRotulo();
    // El foco vuelve a donde estaba si sigue a la vista (el sello, la tarjeta); si no, al sello del
    // menú con el teclado, y a ningún lado con el dedo. Nunca al canvas, que se traga Tab.
    const volver = abiertoDesde;
    abiertoDesde = null;
    if (volver !== null && volver.isConnected && volver !== document.body && volver.tagName !== 'CANVAS' && volver.getClientRects().length > 0) {
      volver.focus({ preventScroll: true });
    } else if (conTeclado) {
      focoAlSello();
    } else if (teniaElFoco && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  /** El botón grande: jugar o seguir el que está armado; con el mundo ganado, el que sigue. */
  menuJugar?.addEventListener('click', () => {
    if (momentoDe(mundo) === 'ganado') {
      const nuevo = alTocarFicha(mundo, banco.niveles, nivelDelBotonGrande(mundo, banco.niveles).id, deFrente);
      if (nuevo !== undefined) ponerMundo(nuevo);
    }
    cerrarMenu();
  });
  menuRepetir?.addEventListener('click', () => {
    ponerMundo(alRepetir(mundo, deFrente));
    cerrarMenu();
  });
  for (const ficha of menu?.querySelectorAll<HTMLButtonElement>('.ficha-nivel[data-nivel]') ?? []) {
    ficha.addEventListener('click', () => {
      const nuevo = alTocarFicha(mundo, banco.niveles, ficha.dataset.nivel ?? '', deFrente);
      if (nuevo === undefined) return;
      if (nuevo !== mundo) ponerMundo(nuevo);
      cerrarMenu();
    });
  }
  // La tarjeta: seguir es **el mismo toque** que el del área (`#seguir-juego`), no un camino aparte.
  tarjetaAvanza?.addEventListener('click', () => seguir?.click());
  tarjetaRepetir?.addEventListener('click', () => {
    const conTeclado = focoConTecladoEn(tarjeta);
    ponerMundo(alRepetir(mundo, deFrente));
    if (conTeclado) focoAlSello();
  });
  tarjetaMenu?.addEventListener('click', abrirMenu);
  abrirElMenu?.addEventListener('click', abrirMenu);
  /*
   * `Escape` (`UX-37` §3.5): con el menú abierto en pausa o recién ganado, lo cierra —el foco vuelve
   * al sello, o a la tarjeta—; en la entrada no hace nada, porque no hay partida a la que volver.
   * Jugando, lo abre. En la pantalla completa sin la del sistema, `Escape` es la puerta de salida del
   * modo (`ADR-10.3`) y el menú no se entera; con la del sistema, el navegador se la queda.
   */
  document.addEventListener(
    'keydown',
    (e) => {
      // Una pulsación larga hace una sola cosa: sin esto el menú titilaba con la repetición.
      if (e.key !== 'Escape' || e.repeat || modo?.enElModo()) return;
      if (!menuAbierto()) abrirMenu();
      else if (momentoDe(mundo) !== 'entrada') cerrarMenu();
    },
    true,
  );
  /*
   * **Enter con la tarjeta a la vista sigue** (`UX-37` §4.5), para quien juega con W A D y las
   * flechas y no tiene el foco en ningún botón. Solo un Enter nuevo —no uno que viene repitiendo
   * desde antes de ganar— y solo con el foco suelto: sobre un botón, Enter es de ese botón.
   */
  document.addEventListener('keydown', (e) => {
    const suelto = document.activeElement === null || document.activeElement === document.body;
    if (e.key !== 'Enter' || e.repeat || !suelto || menuAbierto() || tarjeta === null || tarjeta.hidden) return;
    e.preventDefault();
    seguir?.click();
  });

  /**
   * **Dónde va el menú** (`UX-37` §3.3): la región del tubo y los mandos, que decide
   * `regionDelMenu()` con lo que mide acá, y nunca el pie de homenaje. Se escribe relativa al bloque
   * que contiene al menú (`position: absolute`), así que baja y sube con la página. Se vuelve a medir
   * cada vez que algo del fichín cambia de tamaño: el giro, la pantalla completa, la barra del navegador.
   */
  function ubicarMenu(): void {
    if (menu === null || !menuAbierto()) return;
    const fichin = document.querySelector<HTMLElement>('.fichin');
    const aire = fichin === null ? 0 : parseFloat(getComputedStyle(fichin).getPropertyValue('--tecla-aire')) || 0;
    const region = regionDelMenu({
      recorte: medir(document.querySelector('.recorte')),
      mandos: [...document.querySelectorAll('.mando')].map(medir),
      pie: medir(document.querySelector('.chapa-pie')),
      // Sin la barra de desplazamiento (`clientWidth`), y lo que se ve de verdad de alto: en el
      // iPhone, con la barra del navegador a la vista, `innerHeight` es el más chico de los dos.
      ventana: {
        ancho: document.documentElement.clientWidth || window.innerWidth,
        alto: Math.min(window.innerHeight, document.documentElement.clientHeight || window.innerHeight),
      },
      enElModo: modo?.enElModo() ?? false,
      aire,
      // Parado, el menú baja hasta el borde de la ventana, pero no tapa la firma ni los créditos.
      tope: medir(document.querySelector('body > footer')).arriba || undefined,
    });
    const base = menu.offsetParent?.getBoundingClientRect() ?? { left: -window.scrollX, top: -window.scrollY };
    menu.style.left = `${region.izquierda - base.left}px`;
    menu.style.top = `${region.arriba - base.top}px`;
    menu.style.width = `${region.ancho}px`;
    menu.style.height = `${region.alto}px`;
  }
  const reubicar = new ResizeObserver(() => ubicarMenu());
  for (const pieza of document.querySelectorAll('.recorte, .mando, .chapa-pie, .fichin')) reubicar.observe(pieza);
  window.addEventListener('resize', ubicarMenu);

  k.onUpdate(() => {
    // Con el menú abierto la partida está en pausa: el mundo no avanza y su reloj no corre.
    if (menuAbierto()) return;
    // Las teclas se leen una vez por tic y valen para todos los cuadros de ese tic (ADR-09.1).
    const mandos = {
      [COLUMNA.izquierda]: mandoDe('izquierda'),
      [COLUMNA.derecha]: mandoDe('derecha'),
    } as Record<IdPersonaje, Mando>;
    const ambos = { skayboy: mandos.skayboy ?? QUIETO, poligirl: mandos.poligirl ?? QUIETO };
    // Paso fijo: el tiempo del motor se reparte en cuadros enteros, con tope, y el mundo avanza
    // siempre de a un CUADRO_SEG. Es el mismo paso con que la máquina prueba cada nivel en el
    // build, así que lo que se juega acá es, bit a bit, lo que se probó. Todo eso vive en
    // jugarTic(), probado en Node: la isla solo le da el tiempo del motor.
    const antes = mundo.tiempo;
    atender(jugarTic(reloj, mundo, ambos, k.dt()), deFrente, esElUltimo(mundo, banco.niveles));
    // Lo que se apretó ya llegó al mundo, si el mundo avanzó; si este tic no jugó ningún cuadro,
    // espera al que viene (`D-61` punto 4).
    if (mundo.tiempo !== antes) pulsadas.clear();
    // En el tic en que se gana: el avance se guarda ahí, no al tocar Seguí (`CTR-16.11.1`), y el
    // baile empieza a contar con el reloj del motor, porque el del mundo se congela.
    if (marcarVictoria(victoria, mundo, k.time())) guardarPasado(mundo.nivel.id);
    // En el mismo tic en que se gana, el toque para seguir ya es tocable (`D-32` límite 3), y el
    // contador de lo que juntó cada uno ya se ve (`UX-33 §2.5`).
    mostrarSeguir(seguir, mundo, banco.niveles);
    mostrarContador(contador, mundo);
    // Y la tarjeta de fin de nivel, arriba del área, en el mismo tic (`D-61` punto 3).
    if (mostrarFinDeNivel(tarjeta, mundo, banco.niveles, false)) pintarTarjeta();
  });
  k.onDraw(() => {
    dibujar(k, mundo, atlas, deFrente, victoria);
    // Un cuadro de frente y nada más (`UX-29 §3`): el dedo responde desde el cuadro cero.
    deFrente.clear();
  });

  // El rótulo se va cuando el motor ya dibuja, no antes: si el `import` falla, queda.
  document.querySelector('.rotulo-carga')?.setAttribute('hidden', '');
  // Y en el mismo momento aparecen los dos sellos del mueble (`ADR-10.1`): sin motor no hay nada
  // que agrandar ni que pausar, y un botón que no hace nada sería prometer lo que no hay (`ADR-08.2`).
  document.querySelector('.sellos-mueble')?.removeAttribute('hidden');
  // Y el juego abre con el menú (`D-61` punto 1): el nivel ya está armado y dibujado atrás, y el
  // botón grande lo juega.
  abrirMenu();
}

/* ==========================================================================
   Las piezas del menú, la tarjeta y el rótulo (`D-61`). Nacen escondidas en el HTML.
   ========================================================================== */

const menu = document.querySelector<HTMLElement>('#menu-juego');
const menuJugar = document.querySelector<HTMLButtonElement>('#menu-jugar');
const menuCual = document.querySelector<HTMLElement>('#menu-cual');
const menuCualCorto = document.querySelector<HTMLElement>('#menu-cual-corto');
const menuRepetir = document.querySelector<HTMLButtonElement>('#menu-repetir');
const abrirElMenu = document.querySelector<HTMLButtonElement>('#abrir-menu');
const tarjeta = document.querySelector<HTMLElement>('#fin-nivel');
const tarjetaRotulo = document.querySelector<HTMLElement>('#fin-nivel-rotulo');
const tarjetaSigue = document.querySelector<HTMLElement>('#fin-nivel-sigue');
const tarjetaAvanza = document.querySelector<HTMLButtonElement>('#fin-seguir');
const tarjetaRepetir = document.querySelector<HTMLButtonElement>('#fin-repetir');
const tarjetaMenu = document.querySelector<HTMLButtonElement>('#fin-menu');
const rotulo = document.querySelector<HTMLElement>('#rotulo-nivel');

/** De qué mundo tiene los textos la tarjeta: se llenan una vez, cuando aparece. */
let tarjetaDe: Mundo | null = null;
let rotuloHasta = 0;

function menuAbierto(): boolean {
  return menu !== null && !menu.hidden;
}

function esconderRotulo(): void {
  window.clearTimeout(rotuloHasta);
  if (rotulo !== null) rotulo.hidden = true;
}

/**
 * Con el menú abierto, el juego no se toca ni se enfoca: el foco no se escapa a las teclas que
 * quedaron abajo.
 */
function lugaresInertes(si: boolean): void {
  // Las piezas de juego: el tubo (con el toque de seguir y la tarjeta), los sellos y las dos
  // columnas de mando. La cabecera con el volver, el pie de homenaje (`BR-26`) y el aviso para el
  // lector de pantalla quedan vivos: el menú no los tapa (`UX-37` §3.3 y §3.5).
  for (const lugar of document.querySelectorAll<HTMLElement>('.fichin > .mando, .gabinete > .recorte, .gabinete > .sellos-mueble')) {
    lugar.toggleAttribute('inert', si);
  }
}

/** Un elemento medido en la ventana, o un rectángulo vacío si no está. */
function medir(el: Element | null): Rectangulo {
  const r = el?.getBoundingClientRect();
  return r === undefined ? { izquierda: 0, arriba: 0, ancho: 0, alto: 0 } : { izquierda: r.left, arriba: r.top, ancho: r.width, alto: r.height };
}

/**
 * Si el foco está adentro de ese lugar y llegó con el teclado (`:focus-visible`). Decide qué pasa con
 * el foco cuando ese lugar se esconde: con el teclado, al sello del menú; con el dedo, a ningún lado.
 */
function focoConTecladoEn(lugar: HTMLElement | null): boolean {
  const activo = document.activeElement;
  return lugar !== null && activo instanceof HTMLElement && lugar.contains(activo) && activo.matches(':focus-visible');
}

/** El lugar seguro del foco durante la partida: el sello del menú, que está siempre a la vista. */
function focoAlSello(): void {
  if (abrirElMenu !== null && abrirElMenu.getClientRects().length > 0) abrirElMenu.focus({ preventScroll: true });
}

/* ==========================================================================
   La pantalla completa (`ADR-10`, `UX-33 §1`)

   Todo el modo vive en `modo-pantalla.ts`, que no lee ningun global para poder jugarse en
   Node con un DOM de utileria. Aca solo se le pasa lo de verdad.
   ========================================================================== */

/**
 * El interruptor, y el botón del menú que hace lo mismo (`D-61` punto 5). El sello nace escondido en
 * el HTML, adentro de `.sellos-mueble`, y aparece cuando el motor ya dibuja.
 */
const botonPantalla = document.querySelector<HTMLButtonElement>('#pantalla-completa');
const botonPantallaDelMenu = document.querySelector<HTMLButtonElement>('#menu-pantalla');

function escucharPantallaCompleta(): ModoDePantalla | null {
  const fichin = document.querySelector<HTMLElement>('.fichin');
  if (fichin === null || botonPantalla === null) return null;
  return montarPantallaCompleta({
    documento: document,
    ventana: window,
    orientacion: screen.orientation,
    Observador: ResizeObserver,
    fichin,
    boton: botonPantalla,
    otros: botonPantallaDelMenu === null ? [] : [botonPantallaDelMenu],
    soltarTodas,
  });
}

escucharTeclas();
const modo = escucharPantallaCompleta();
engancharEfectos();
void arrancar();
