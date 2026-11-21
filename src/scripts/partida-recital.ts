/**
 * La isla de "Armá tu recital" (`D-72`).
 *
 * Cuatro pantallas: la puerta, el lugar, el armado y la noche. La lógica de la lista vive en
 * `lib/recital/armado.ts`, que es puro y tiene sus tests; acá se pinta y se escucha.
 *
 * ## Lo que suena, y cuándo
 *
 * El pedido del usuario fue aprovechar los recortes: que un tema, cuando aparece en
 * pantalla, suene. Así que suena **al sumarlo** a la lista (el toque es el gesto que el
 * navegador pide), suena **al marcarlo** con "Escuchala", y al cerrar la lista suena **la
 * noche entera**, diez segundos por tema, marcando en la hoja el renglón que suena. Se
 * apaga con "Silenciá", y la elección queda guardada en el navegador.
 *
 * ## Lo que se guarda
 *
 * La lista a medio armar, en `localStorage`: el que cierra la pestaña la encuentra al
 * volver. Y la lista cerrada, en la dirección (`desafio.ts`, la quinta forma), que es lo que
 * se comparte. Las dos cosas pueden fallar —modo privado, almacenamiento lleno— y ninguna
 * frena el juego.
 */

import {
  VACIO,
  agregar,
  sacar,
  subir,
  bajar,
  cambiarDeTira,
  esPosible,
  tiraDe,
  cuantos,
  hayLugar,
  sePuedeCerrar,
  sortear,
  enOrden,
  duracion,
  formatoDuracion,
  MIN_TEMAS_RECITAL,
  type Armado,
  type TemaDelCatalogo,
} from '../lib/recital/armado.ts';
import { PANTALLA_0, LUGAR, ARMADO, NOCHE, IMPRESO } from '../lib/recital/copy.ts';
import { armarLinkRecital, leerRecital, limpiarLugar, LUGAR_DESCAMPADO, LUGAR_OTRO, type RecitalDelLink } from '../lib/desafio.ts';
import { claseDisco } from '../lib/tema/paleta.ts';
import { normalizar } from '../lib/texto.ts';
import { rutaFicha } from '../lib/tapa/pasadas.ts';
import { armarCasete, correrCasete, frenarCasete, ponerAvance, ponerContador, rebobinarCasete } from '../lib/tema/casete.ts';
import { crearRocola, SEGUNDOS_POR_TEMA } from './rocola.ts';
import { armarContador, armarInterruptorDeRuidos, duracionDe, estampar, pegar, rodarContador, volarPieza } from './jugo.ts';
import { sonarEfecto } from '../lib/audio/efectos.ts';
import { despertarSalida } from '../lib/audio/contexto.ts';
import { botonCompartir } from './compartir.ts';
import { dibujarHojaRecital } from './hoja-recital.ts';

/** El nombre del juego en el link (`g=`). */
const JUEGO = 'recital';
const CLAVE_PARTIDA = 'fichin.recital.partida';
const CLAVE_SONIDO = 'fichin.recital.sonido';

interface Catalogo {
  readonly temas: readonly TemaDelCatalogo[];
  readonly discos: readonly { readonly slug: string; readonly titulo: string; readonly anio: number }[];
  readonly conAudio: readonly string[];
  readonly lugares: readonly LugarDelCatalogo[];
}

/** Un estadio o un teatro de `lugares-recital.json`. */
interface LugarDelCatalogo {
  readonly slug: string;
  readonly tipo: 'estadio' | 'teatro';
  readonly nombre: string;
  readonly ciudad: string;
}

/**
 * El lugar de esta noche: uno del catálogo, un descampado en la localidad que se escribió, u
 * otro lugar escrito a mano (`D-72`: es una expresión de deseo, no una noche que pasó). Lo
 * escrito a mano llega siempre limpio por `limpiarLugar`.
 */
interface LugarElegido {
  readonly slug: string;
  readonly nombre: string;
  readonly ciudad: string;
}

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const catalogo = JSON.parse($('catalogo').textContent ?? '{}') as Catalogo;
const conAudio = new Set(catalogo.conAudio);
const tituloDeDisco = new Map(catalogo.discos.map((d) => [d.slug, d.titulo]));
const lugarPorSlug = new Map(catalogo.lugares.map((l) => [l.slug, l]));

const zonaInicio = $('inicio');
const zonaLugar = $('eleccion');
const zonaArmado = $('tablero');
const zonaNoche = $('resultado');

const rocola = crearRocola();

// ------------------------------------------------------------------ estado

let lugar: LugarElegido | null = null;
/** La pestaña del lugar: estadios, teatros, un descampado u otro lugar. */
let pestana: 'estadio' | 'teatro' | 'descampado' | 'otro' = 'estadio';

/** Cómo se nombra el lugar en una línea: "Estadio Obras, Buenos Aires", "Un descampado en Tandil". */
function lugarEnUnaLinea(l: LugarElegido): string {
  if (l.slug === LUGAR_DESCAMPADO) return LUGAR.enDescampado(l.ciudad);
  return l.ciudad ? `${l.nombre}, ${l.ciudad}` : l.nombre;
}

/**
 * Arma un lugar elegido desde un slug y lo escrito a mano, con las reglas del link: el
 * descampado necesita localidad, otro lugar necesita nombre, y el del catálogo sale del
 * catálogo. `null` si no cierra.
 */
function lugarDesde(slug: string, nombre = '', ciudad = ''): LugarElegido | null {
  const n = limpiarLugar(nombre);
  const c = limpiarLugar(ciudad);
  if (slug === LUGAR_DESCAMPADO) return c ? { slug, nombre: LUGAR.descampado, ciudad: c } : null;
  if (slug === LUGAR_OTRO) return n ? { slug, nombre: n, ciudad: c } : null;
  const l = lugarPorSlug.get(slug);
  return l ? { slug: l.slug, nombre: l.nombre, ciudad: l.ciudad } : null;
}

function lugarDelLink(r: RecitalDelLink): LugarElegido | null {
  return lugarDesde(r.lugar, r.nombre, r.ciudad);
}
let armado: Armado = VACIO;
/** El tema marcado en la hoja, el que muestra sus acciones. */
let marcado: number | null = null;
/** La funda abierta del cajón (un disco), o `null` si están las diez cerradas. */
let filtro: string | null = null;
/** La hoja del armado, plegada: se ven los últimos de la lista y queda pegada arriba mientras se elige. */
let plegada = true;
let sonido = leerSonido();
/** La lista llegó por un enlace y todavía no se tocó. */
let ajena = false;

function el<K extends keyof HTMLElementTagNameMap>(tag: K, clase = '', texto?: string): HTMLElementTagNameMap[K] {
  const n = document.createElement(tag);
  if (clase) n.className = clase;
  if (texto !== undefined) n.textContent = texto;
  return n;
}

function boton(clase: string, texto: string, alTocar: () => void): HTMLButtonElement {
  const b = el('button', clase, texto);
  b.type = 'button';
  b.addEventListener('click', alTocar);
  return b;
}

/** Si la persona pidió menos movimiento, los desplazamientos van de un salto (`D-34`). */
const conCalma = (): boolean => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
const comoMoverse = (): ScrollBehavior => (conCalma() ? 'auto' : 'smooth');

/**
 * Cambia de pantalla y **lleva el foco al título de la nueva** (`REV-23`, `FIND-153`): el
 * botón que se tocó queda escondido, y sin esto el foco cae al `<body>` y el que usa teclado o
 * lector de pantalla arranca de cero. El mismo arreglo que `enfocarTitulo` de "Ponelos en fila".
 */
function mostrar(zona: HTMLElement): void {
  for (const z of [zonaInicio, zonaLugar, zonaArmado, zonaNoche]) z.hidden = z !== zona;
  window.scrollTo({ top: 0 });
}

function enfocarTitulo(zona: HTMLElement): void {
  const titulo = zona.querySelector<HTMLElement>('h2, .recital-entrada--elegida');
  if (!titulo) return;
  titulo.tabIndex = -1;
  titulo.focus({ preventScroll: true });
}

/**
 * La región viva: lo que pasa, para quien no lo ve. **Una sola y fuera de las pantallas**:
 * las pantallas se repintan enteras, y una región viva que nace con el texto ya puesto no la
 * anuncia ningún lector.
 */
const viva = el('p', 'solo-lector');
viva.setAttribute('aria-live', 'polite');
$('app').append(viva);

function avisar(_zona: HTMLElement, texto: string): void {
  viva.textContent = texto;
}

// ------------------------------------------------------------------ guardar

function leerSonido(): boolean {
  try {
    return localStorage.getItem(CLAVE_SONIDO) !== 'no';
  } catch {
    return true;
  }
}

function guardarSonido(): void {
  try {
    localStorage.setItem(CLAVE_SONIDO, sonido ? 'si' : 'no');
  } catch {
    /* sin almacenamiento, el sonido vuelve a prenderse la próxima: nada se rompe */
  }
}

function guardarPartida(): void {
  try {
    if (!lugar || cuantos(armado) === 0) localStorage.removeItem(CLAVE_PARTIDA);
    else
      localStorage.setItem(
        CLAVE_PARTIDA,
        JSON.stringify({ lugar: lugar.slug, nombre: lugar.nombre, ciudad: lugar.ciudad, lista: armado.lista, bises: armado.bises }),
      );
  } catch {
    /* ídem */
  }
}

/** La partida guardada, validada entera: si algo no cierra, no hay partida. */
function leerPartida(): { lugar: LugarElegido; armado: Armado } | null {
  try {
    const crudo = JSON.parse(localStorage.getItem(CLAVE_PARTIDA) ?? 'null') as unknown;
    if (!crudo || typeof crudo !== 'object') return null;
    const { lugar: slug, nombre, ciudad, lista, bises } = crudo as {
      lugar?: unknown;
      nombre?: unknown;
      ciudad?: unknown;
      lista?: unknown;
      bises?: unknown;
    };
    const texto = (x: unknown): string => (typeof x === 'string' ? x : '');
    const l = typeof slug === 'string' ? lugarDesde(slug, texto(nombre), texto(ciudad)) : null;
    const valido = (t: unknown): t is number[] =>
      Array.isArray(t) && t.every((i) => Number.isInteger(i) && i >= 0 && i < catalogo.temas.length);
    if (!l || !valido(lista) || !valido(bises)) return null;
    // Se restaura tal cual y se valida con las reglas del juego: rearmarla con las operaciones
    // la cambiaba (`FIND-157`: una lista vacía con bises volvía con un bis en la lista).
    const a: Armado = { lista, bises };
    return esPosible(a) && cuantos(a) > 0 ? { lugar: l, armado: a } : null;
  } catch {
    return null;
  }
}

// ------------------------------------------------------------------ lo que suena

function tocarTema(i: number): void {
  const t = catalogo.temas[i];
  if (!t || !conAudio.has(t.slug)) return;
  sonandoDesde = Date.now();
  rocola.tocar(t.slug, () => pintarSonido());
  pintarSonido();
}

/** Cuándo arrancó el recorte que suena en el armado: de ahí sale cuánta cinta pasó. */
let sonandoDesde = 0;

function pararTodo(): void {
  if (rocola.sonando) rocola.parar();
}

/**
 * El casete que anda mientras suena un recorte (ronda de pulida, 2026-11-21). Es el de
 * "Adiviná el tema" (`lib/tema/casete.ts`): toma velocidad, la cinta se pasa de un carrete al
 * otro y frena con inercia. Acá lo mueve un reloj propio y no el audio, porque la rocola es un
 * `<audio>` que no cuenta por dónde va: `avance` dice cuánta cinta pasó (de 0 a 1) y
 * `segundos`, lo que marca el contador. Con movimiento reducido el carrete no gira; que suena
 * lo dice siempre un texto al lado.
 */
function armarCabina(casete: HTMLElement): { correr(avance: () => number, segundos: () => number): void; frenar(): void; rebobinar(): void } {
  let anda = false;
  let reloj = 0;
  return {
    correr(avance, segundos) {
      if (!anda) {
        anda = true;
        correrCasete(casete);
      }
      window.clearInterval(reloj);
      const paso = (): void => {
        if (!casete.isConnected) return window.clearInterval(reloj);
        ponerAvance(casete, avance());
        ponerContador(casete, segundos());
      };
      paso();
      reloj = window.setInterval(paso, 200);
    },
    frenar() {
      window.clearInterval(reloj);
      if (!anda) return;
      anda = false;
      frenarCasete(casete);
    },
    /** La cinta llegó al final: suelta la tecla y vuelve al principio, rápido y para atrás. */
    rebobinar() {
      window.clearInterval(reloj);
      anda = false;
      casete.classList.remove('casete-vivo--play');
      ponerContador(casete, 0);
      rebobinarCasete(casete);
    },
  };
}

/**
 * Un renglón escrito con fibra: el texto, y el fibrón que lo va escribiendo. El fibrón es
 * dibujo (un `span` vacío) y solo se ve mientras el renglón se escribe; cuándo se escribe lo
 * dice la hoja de estilos (`renglon-se-escribe`), no este nodo.
 */
function escrito(texto: string): HTMLElement {
  const caja = el('span', 'recital-escrito');
  caja.append(el('span', 'recital-tema', texto), el('span', 'recital-fibron'));
  return caja;
}

// ------------------------------------------------------------------ la puerta

/** La hoja de la portada: dibujo, y atajo del botón de al lado. */
const hojaPortada = document.getElementById('hoja-portada');

function retomarGuardada(guardada: { lugar: LugarElegido; armado: Armado }): void {
  void despertarSalida();
  lugar = guardada.lugar;
  armado = guardada.armado;
  irAlArmado();
}

function pintarInicio(): void {
  const retomar = $('retomar');
  retomar.replaceChildren();
  const guardada = leerPartida();
  if (guardada) {
    retomar.append(
      boton('secundario', ARMADO.retomar(lugarEnUnaLinea(guardada.lugar)), () => retomarGuardada(guardada)),
      el('p', 'recital-retomar-cuenta', ARMADO.cuenta(cuantos(guardada.armado), formatoDuracion(duracion(guardada.armado, catalogo.temas).segundos))),
    );
    // Con una lista a medio armar, la hoja de la portada es esa lista: lo que ya escribiste.
    if (hojaPortada) {
      const orden = enOrden(guardada.armado);
      const A_LA_VISTA = 4;
      const ol = el('ol', 'recital-pasos');
      orden.slice(0, A_LA_VISTA).forEach((i, k) => {
        const li = el('li', 'recital-paso');
        li.style.setProperty('--orden', String(k + 1));
        li.append(el('span', 'recital-numero', String(k + 1)), escrito(catalogo.temas[i]!.titulo));
        ol.append(li);
      });
      hojaPortada.replaceChildren(el('p', 'recital-rotulo', lugarEnUnaLinea(guardada.lugar)), ol);
      if (orden.length > A_LA_VISTA) {
        const mas = el('p', 'recital-paso recital-paso--bis');
        mas.style.setProperty('--orden', String(A_LA_VISTA + 1));
        mas.append(escrito(PANTALLA_0.yMas(orden.length - A_LA_VISTA)));
        hojaPortada.append(mas);
      }
    }
  }
}

hojaPortada?.addEventListener('click', () => {
  const guardada = leerPartida();
  if (guardada) retomarGuardada(guardada);
  else $('empezar').click();
});

// El interruptor de los ruidos de interfaz (el fibrón, la entrada que se corta, el sello): en la
// portada, como en los otros juegos. No toca lo que suena de la banda.
document.getElementById('ruidos')?.append(armarInterruptorDeRuidos({ apagar: PANTALLA_0.ruidosApagar, prender: PANTALLA_0.ruidosPrender }));

$('empezar').addEventListener('click', () => {
  // Los ruidos salen por el audio del sitio, que solo se despierta adentro de un toque.
  void despertarSalida();
  // Con una lista guardada, elegir lugar no la borra (`FIND-156`): la lista es de quien la
  // armó, y lo único que cambia es dónde se toca. Para empezar de cero está "Armá otra".
  const guardada = leerPartida();
  if (guardada && cuantos(armado) === 0) armado = guardada.armado;
  irAlLugar();
});

// ------------------------------------------------------------------ el lugar

function irAlLugar(): void {
  pararTodo();
  pintarLugar();
  mostrar(zonaLugar);
  enfocarTitulo(zonaLugar);
}

/**
 * Elegir el lugar. Si se eligió tocando una entrada (`origen`), **esa entrada viaja** a la
 * cabecera del armado: es la que queda en la mano toda la noche. Se mide dónde estaba antes de
 * cambiar de pantalla, y una copia suelta vuela hasta la de arriba, que espera escondida.
 */
function elegirLugar(l: LugarElegido, origen?: HTMLElement): void {
  const desde = origen?.getBoundingClientRect();
  const copia = origen ? (origen.cloneNode(true) as HTMLElement) : null;
  lugar = l;
  guardarPartida();
  irAlArmado();
  const destino = partes?.cabecera.querySelector<HTMLElement>('.recital-entrada');
  if (!destino) return;
  if (!copia || !desde) return pegar(destino);
  // La entrada se corta del talonario: el roce del cartón.
  sonarEfecto('carton');
  copia.removeAttribute('aria-current');
  copia.removeAttribute('data-clave');
  destino.style.visibility = 'hidden';
  volarPieza(copia, { getBoundingClientRect: () => desde } as Element, destino, () => {
    destino.style.visibility = '';
    pegar(destino);
  });
}

/**
 * Dónde tocan esta noche (`D-72`): una expresión de deseo, no una noche que pasó. Cuatro
 * pestañas —estadios, teatros, un descampado, otro lugar—, así la pantalla no es una lista de
 * treinta y cuatro. Cada estadio y cada teatro es una entrada de papel: el nombre en el cuerpo
 * y la ciudad en el talón, separado por la línea de puntos por donde se corta.
 */
function pintarLugar(): void {
  zonaLugar.replaceChildren();
  zonaLugar.append(el('h2', 'recital-titulo', LUGAR.titulo), el('p', 'recital-fuente', LUGAR.fuente));

  const pestanas = el('div', 'recital-pestanas');
  pestanas.setAttribute('role', 'group');
  pestanas.setAttribute('aria-label', LUGAR.titulo);
  const opciones = [
    ['estadio', LUGAR.estadios],
    ['teatro', LUGAR.teatros],
    ['descampado', LUGAR.descampadoPestana],
    ['otro', LUGAR.otro],
  ] as const;
  for (const [clave, texto] of opciones) {
    const b = boton('recital-pestana', texto, () => {
      pestana = clave;
      pintarLugar();
      zonaLugar.querySelector<HTMLElement>(`[data-clave="pestana-${clave}"]`)?.focus();
    });
    b.dataset.clave = `pestana-${clave}`;
    b.setAttribute('aria-pressed', String(pestana === clave));
    pestanas.append(b);
  }
  zonaLugar.append(pestanas);

  if (pestana === 'estadio' || pestana === 'teatro') {
    // La boletería (ronda de pulida, 2026-11-21). Eran veinte cajas iguales, una abajo de la
    // otra: 1800 px de formulario. Ahora las ciudades con más de un lugar son un talonario
    // —el nombre de la ciudad una sola vez, en el talón de arriba, y sus entradas en dos
    // columnas— y las demás son entradas sueltas, con su ciudad en el talón de cada una. Va en
    // el orden del catálogo, que no se toca.
    const tipo = pestana;
    const porCiudad = new Map<string, LugarDelCatalogo[]>();
    for (const l of catalogo.lugares.filter((x) => x.tipo === tipo)) {
      const lista = porCiudad.get(l.ciudad) ?? [];
      lista.push(l);
      porCiudad.set(l.ciudad, lista);
    }
    const boleteria = el('div', 'recital-boleteria');
    let orden = 0;
    const entrada = (l: LugarDelCatalogo, conCiudad: boolean): HTMLLIElement => {
      const li = el('li');
      const b = boton('recital-entrada', '', () => elegirLugar({ slug: l.slug, nombre: l.nombre, ciudad: l.ciudad }, b));
      b.dataset.clave = `lugar-${l.slug}`;
      b.setAttribute('aria-label', LUGAR.entradaAria(l.nombre, l.ciudad));
      b.append(el('span', 'recital-entrada-cuerpo', l.nombre));
      if (conCiudad) b.append(el('span', 'recital-entrada-troquel'), el('span', 'recital-entrada-talon', l.ciudad));
      if (lugar?.slug === l.slug) b.setAttribute('aria-current', 'true');
      li.append(b);
      return li;
    };
    let sueltas: HTMLUListElement | null = null;
    for (const [ciudad, lista] of porCiudad) {
      if (lista.length > 1) {
        sueltas = null;
        const talonario = el('section', 'recital-talonario jugo-pega');
        talonario.style.setProperty('--orden', String(Math.min(orden++, 8)));
        const cabeza = el('h3', 'recital-talonario-ciudad');
        cabeza.append(el('span', '', ciudad), el('span', 'recital-talonario-cuantos', LUGAR.cuantos(lista.length)));
        const ul = el('ul', 'recital-lugares');
        for (const l of lista) ul.append(entrada(l, false));
        talonario.append(cabeza, ul);
        boleteria.append(talonario);
      } else {
        if (!sueltas) {
          sueltas = el('ul', 'recital-lugares recital-lugares--sueltas');
          boleteria.append(sueltas);
        }
        const li = entrada(lista[0]!, true);
        li.className = 'jugo-pega';
        li.style.setProperty('--orden', String(Math.min(orden++, 8)));
        sueltas.append(li);
      }
    }
    zonaLugar.append(boleteria);
  } else if (pestana === 'descampado') {
    const ya = lugar?.slug === LUGAR_DESCAMPADO ? lugar.ciudad : '';
    zonaLugar.append(
      escribirLugar(LUGAR.descampadoBajada, [{ clave: 'localidad', rotulo: LUGAR.localidad, valor: ya }], LUGAR.elegirDescampado, (v) => {
        const l = lugarDesde(LUGAR_DESCAMPADO, '', v[0] ?? '');
        if (!l) return LUGAR.faltaLocalidad;
        elegirLugar(l);
        return null;
      }),
    );
  } else {
    const propio = lugar?.slug === LUGAR_OTRO ? lugar : null;
    zonaLugar.append(
      escribirLugar(
        LUGAR.otroBajada,
        [
          { clave: 'nombre', rotulo: LUGAR.nombre, valor: propio?.nombre ?? '' },
          { clave: 'ciudad', rotulo: LUGAR.ciudad, valor: propio?.ciudad ?? '' },
        ],
        LUGAR.elegirOtro,
        (v) => {
          const l = lugarDesde(LUGAR_OTRO, v[0] ?? '', v[1] ?? '');
          if (!l) return LUGAR.faltaNombre;
          elegirLugar(l);
          return null;
        },
      ),
    );
  }

  const volver = el('a', 'secundario', NOCHE.volver);
  volver.href = '/';
  zonaLugar.append(volver);
}

/**
 * Un formulario para escribir el lugar. `alElegir` recibe lo escrito y devuelve `null` si
 * entró, o el aviso de lo que falta. Se manda con el botón o con Enter.
 */
function escribirLugar(
  bajada: string,
  campos: readonly { readonly clave: string; readonly rotulo: string; readonly valor: string }[],
  textoBoton: string,
  alElegir: (valores: readonly string[]) => string | null,
): HTMLFormElement {
  const form = el('form', 'recital-escribir');
  form.noValidate = true;
  form.append(el('p', 'recital-escribir-bajada', bajada));
  const entradas = campos.map((c) => {
    const etiqueta = el('label', 'recital-escribir-campo');
    const id = `recital-${c.clave}`;
    etiqueta.htmlFor = id;
    etiqueta.append(el('span', '', c.rotulo));
    const input = el('input', 'buscador-caja');
    input.id = id;
    input.type = 'text';
    input.maxLength = 60;
    input.autocomplete = 'off';
    input.value = c.valor;
    input.dataset.clave = `escribir-${c.clave}`;
    etiqueta.append(input);
    form.append(etiqueta);
    return input;
  });
  const aviso = el('p', 'recital-escribir-aviso');
  aviso.setAttribute('aria-live', 'polite');
  const enviar = el('button', 'primario', textoBoton);
  enviar.type = 'submit';
  form.append(aviso, enviar);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const falta = alElegir(entradas.map((i) => i.value));
    if (falta === null) return;
    aviso.textContent = falta;
    entradas[0]!.setAttribute('aria-invalid', 'true');
    entradas[0]!.focus();
  });
  return form;
}

// ------------------------------------------------------------------ el armado

/**
 * Las partes de la pantalla del armado. Se arman una vez y se repintan por separado: así el
 * buscador no pierde el foco ni lo escrito cuando termina un recorte o se suma un tema, y lo
 * que cambia cuando algo suena (la hoja y el pie) no rehace los 105 del cajón.
 */
interface PartesArmado {
  readonly cabecera: HTMLElement;
  readonly hoja: HTMLElement;
  readonly sorteo: HTMLButtonElement;
  readonly silencio: HTMLButtonElement;
  readonly buscador: HTMLInputElement;
  readonly hojaCaja: HTMLElement;
  readonly temas: HTMLUListElement;
  readonly pie: HTMLElement;
  /** El pie se arma una vez (ronda de pulida): el casete tiene que seguir girando y el contador, rodar. */
  readonly cabina: ReturnType<typeof armarCabina>;
  readonly suenaTitulo: HTMLElement;
  readonly faltan: HTMLElement;
  readonly parar: HTMLButtonElement;
  readonly cuenta: HTMLElement;
  readonly contador: HTMLElement;
  readonly cuentaRotulo: HTMLElement;
  readonly cuentaLector: HTMLElement;
  readonly cerrar: HTMLButtonElement;
}

let partes: PartesArmado | null = null;
/** Lo escrito en el buscador del cajón. */
let busqueda = '';
/** Hay un papelito volando a la cuenta del pie: la rueda gira cuando llega, no antes. */
let cuentaEnVuelo = false;
/** El último tema sumado: su renglón entra a la hoja como un papel que se pega. */
let recienSumado: number | null = null;

const indicePorSlug = new Map(catalogo.temas.map((t, i) => [t.slug, i]));
const anioDeDisco = new Map(catalogo.discos.map((d) => [d.slug, d.anio]));

function irAlArmado(): void {
  pararTodo();
  ajena = false;
  limpiarDireccion();
  mostrar(zonaArmado);
  pintarArmado();
  enfocarTitulo(zonaArmado);
}

function montarArmado(): PartesArmado {
  zonaArmado.replaceChildren();
  const cabecera = el('div', 'recital-cabecera');
  // La hoja va en una caja que se pega arriba cuando está plegada: se la ve siempre mientras se
  // elige, y el renglón nuevo se escribe a la vista.
  const hojaCaja = el('div', 'recital-hoja-caja');
  const hoja = el('div', 'recital-hoja');
  hojaCaja.append(hoja);

  const cajon = el('section', 'recital-cajon');
  cajon.setAttribute('aria-label', ARMADO.cajon);
  const cabezaCajon = el('div', 'recital-cajon-cabeza');
  const sorteo = boton('recital-chico', ARMADO.sortear, () => {
    const i = sortear(armado, visibles());
    if (i !== null) sumar(i, sorteo);
  });
  sorteo.dataset.clave = 'sortear';
  const silencio = boton('recital-chico', '', () => {
    sonido = !sonido;
    guardarSonido();
    if (!sonido) pararTodo();
    pintarControles();
    pintarPie();
  });
  silencio.dataset.clave = 'sonido';
  cabezaCajon.append(el('h2', 'recital-titulo', ARMADO.cajon), sorteo, silencio);

  // El buscador: el que se sabe el nombre lo escribe, sin pasar por los diez discos.
  const buscador = el('input', 'buscador-caja recital-buscador');
  buscador.type = 'search';
  buscador.placeholder = ARMADO.buscar;
  buscador.setAttribute('aria-label', ARMADO.buscar);
  buscador.autocomplete = 'off';
  buscador.enterKeyHint = 'search';
  buscador.dataset.clave = 'buscar';
  buscador.value = busqueda;
  buscador.addEventListener('input', () => {
    busqueda = buscador.value;
    pintarTemas();
  });

  const temas = el('ul', 'recital-temas');
  cajon.append(cabezaCajon, buscador, temas);

  // El pie: el casete, lo que suena, cuántos van y salir a tocar. Mide siempre lo mismo: lo que
  // está debajo del pulgar no se corre cuando algo empieza a sonar.
  const pie = el('div', 'recital-pie');
  const fila = el('div', 'recital-suena');
  const casete = armarCasete();
  casete.classList.add('recital-casete');
  const textos = el('div', 'recital-suena-textos');
  const suenaTitulo = el('p', 'recital-suena-titulo');
  const faltan = el('p', 'recital-faltan');
  textos.append(suenaTitulo, faltan);
  const parar = boton('recital-suena-parar', ARMADO.parar, () => rocola.parar());
  parar.dataset.clave = 'pie-parar';
  const cuenta = el('div', 'recital-cuenta');
  const contador = armarContador(cuantos(armado), 2);
  const cuentaRotulo = el('span', 'recital-cuenta-rotulo');
  cuentaRotulo.setAttribute('aria-hidden', 'true');
  const cuentaLector = el('span', 'solo-lector');
  cuenta.append(contador, cuentaRotulo, cuentaLector);
  fila.append(casete, textos, parar, cuenta);
  const cerrar = boton('primario', ARMADO.cerrar, () => irALaNoche());
  cerrar.dataset.clave = 'cerrar';
  pie.append(fila, cerrar);
  zonaArmado.append(cabecera, hojaCaja, cajon, pie);
  return {
    cabecera,
    hoja,
    sorteo,
    silencio,
    buscador,
    hojaCaja,
    temas,
    pie,
    cabina: armarCabina(casete),
    suenaTitulo,
    faltan,
    parar,
    cuenta,
    contador,
    cuentaRotulo,
    cuentaLector,
    cerrar,
  };
}

/** Los temas a mano en el cajón: los que dicen lo buscado, o los de la funda abierta (o todos). */
function visibles(): number[] {
  const q = normalizar(busqueda);
  return catalogo.temas
    .map((_, i) => i)
    .filter((i) => {
      const t = catalogo.temas[i]!;
      return q === '' ? filtro === null || t.disco === filtro : normalizar(t.titulo).includes(q);
    });
}

function renglon(i: number, n: number, bis: boolean): HTMLLIElement {
  const t = catalogo.temas[i]!;
  const li = el('li', `recital-renglon ${claseDisco(t.disco)}`);
  li.dataset.slug = t.slug;
  if (marcado === i) li.classList.add('recital-renglon--marcado');
  if (rocola.sonando === t.slug) li.classList.add('recital-renglon--sonando');
  if (recienSumado === i) li.classList.add('recital-renglon--entra');
  const b = boton('recital-renglon-boton', '', () => {
    marcado = marcado === i ? null : i;
    // Marcar un renglón es para moverlo o sacarlo: la hoja se abre entera.
    if (marcado !== null) plegada = false;
    pintarHoja();
    zonaArmado.querySelector<HTMLElement>('.recital-renglon--marcado .recital-renglon-boton')?.focus();
  });
  b.dataset.clave = `renglon-${i}`;
  b.setAttribute('aria-expanded', String(marcado === i));
  b.setAttribute('aria-label', ARMADO.renglon(n, t.titulo, bis));
  b.append(el('span', 'recital-numero', String(n)), escrito(t.titulo), el('span', 'recital-disco', tituloDeDisco.get(t.disco) ?? ''));
  li.append(b);
  if (marcado === i) li.append(acciones(i));
  return li;
}

/** Las acciones del tema marcado. Debajo del renglón, a mano del pulgar. */
function acciones(i: number): HTMLElement {
  const t = catalogo.temas[i]!;
  const caja = el('div', 'recital-acciones');
  const mover = (nuevo: Armado): void => {
    if (nuevo === armado) return;
    armado = nuevo;
    guardarPartida();
    // Abierta, para ver a dónde va; y los renglones se corren de verdad a su lugar nuevo.
    conDeslizamiento(() => pintarArmado());
    const tira = tiraDe(armado, i);
    const pos = tira === 'lista' ? armado.lista.indexOf(i) + 1 : armado.bises.indexOf(i) + 1;
    avisar(zonaArmado, ARMADO.movido(t.titulo, pos, tira === 'bises'));
    const movido = zonaArmado.querySelector<HTMLElement>('.recital-renglon--marcado .recital-renglon-boton');
    movido?.focus();
  };
  const enBis = tiraDe(armado, i) === 'bises';
  const sonando = rocola.sonando === t.slug;
  const accion = (clave: string, texto: string, alTocar: () => void): HTMLButtonElement => {
    const b = boton(`recital-accion recital-accion--${clave}`, texto, alTocar);
    b.dataset.clave = `accion-${clave}`;
    return b;
  };
  caja.append(
    accion('subir', ARMADO.subir, () => mover(subir(armado, i))),
    accion('bajar', ARMADO.bajar, () => mover(bajar(armado, i))),
    accion('tira', enBis ? ARMADO.aLaLista : ARMADO.alBis, () => mover(cambiarDeTira(armado, i))),
  );
  if (conAudio.has(t.slug)) {
    caja.append(
      accion('escuchar', sonando ? ARMADO.parar : ARMADO.escuchar, () => {
        if (rocola.sonando === t.slug) rocola.parar();
        else tocarTema(i);
      }),
    );
  }
  caja.append(
    accion('sacar', ARMADO.sacar, () => {
      if (rocola.sonando === t.slug) rocola.parar();
      const quitar = (): void => {
        if (tiraDe(armado, i) === null) return;
        armado = sacar(armado, i);
        marcado = null;
        guardarPartida();
        conDeslizamiento(() => pintarArmado());
        avisar(zonaArmado, ARMADO.sacado(t.titulo));
      };
      // Primero se lo tacha con la fibra, a la vista; después sale y los de abajo suben.
      const li = caja.closest<HTMLElement>('.recital-renglon');
      const ms = duracionDe('--duracion-golpe');
      if (!li || ms <= 0) return quitar();
      li.classList.add('recital-renglon--tachado');
      sonarEfecto('racleta');
      for (const b of caja.querySelectorAll('button')) b.disabled = true;
      window.setTimeout(quitar, ms + 140);
    }),
  );
  return caja;
}

/**
 * Suma un tema. `origen` es lo que se tocó (el tema del cajón, o "Sorteá uno"): de ahí sale el
 * papelito que vuela hasta la cuenta del pie cuando la hoja no está a la vista, que es casi
 * siempre —se elige con el cajón en pantalla y la hoja arriba—. Si el renglón nuevo sí se ve,
 * no vuela nada: se lo ve escribirse.
 *
 * **Se rehace solo lo que cambió** (lo aprendido en "Ponelos en fila"): la hoja, y del cajón,
 * el tema tocado. Los ciento cinco se rehacen solo cuando la lista se llena, que los apaga a todos.
 */
function sumar(i: number, origen?: HTMLElement): void {
  const t = catalogo.temas[i]!;
  const antes = armado;
  armado = agregar(armado, i);
  if (armado === antes) return;
  guardarPartida();
  const p = partes!;
  // El papelito sale del título tocado, a la medida de sus letras (no del ancho del renglón).
  const letras = origen?.querySelector('.recital-tema-texto strong');
  let desde = origen?.getBoundingClientRect();
  if (letras) {
    const rango = document.createRange();
    rango.selectNodeContents(letras);
    desde = rango.getBoundingClientRect();
  }
  recienSumado = i;
  conFoco(() => {
    pintarHoja();
    pintarControles();
    if (!hayLugar(armado) || !parcharTema(i)) pintarTemas();
  });
  recienSumado = null;
  // El trazo del fibrón, detrás del interruptor de los ruidos.
  sonarEfecto('racleta');
  cuentaEnVuelo = true;
  pintarPie();
  if (sonido) tocarTema(i);

  const renglonNuevo = p.hoja.querySelector<HTMLElement>(`[data-clave="renglon-${i}"]`)?.getBoundingClientRect();
  const techo = p.pie.getBoundingClientRect().top;
  const seVe = renglonNuevo !== undefined && renglonNuevo.top >= 0 && renglonNuevo.bottom <= techo;
  const llegar = (): void => {
    cuentaEnVuelo = false;
    if (rodarContador(p.contador, cuantos(armado))) estampar(p.cuenta);
  };
  if (seVe || !desde || desde.width === 0) llegar();
  else {
    const papelito = el('span', 'recital-papelito', t.titulo);
    volarPieza(papelito, { getBoundingClientRect: () => desde } as Element, p.contador, llegar);
  }

  // El botón tocado vuelve deshabilitado y no puede tener el foco (`FIND-154`): pasa al tema
  // que sigue en el cajón, así el teclado no vuelve al principio de los 105.
  const libres = [...zonaArmado.querySelectorAll<HTMLButtonElement>('.recital-tema-cajon:not(:disabled)')];
  const siguiente = libres.find((b) => Number(b.dataset.clave?.slice(5)) > i) ?? libres[libres.length - 1];
  siguiente?.focus({ preventScroll: true });
  const bis = tiraDe(armado, i) === 'bises';
  avisar(zonaArmado, ARMADO.sumado(t.titulo, bis ? armado.bises.length : armado.lista.length, bis));
}

/**
 * Repinta y **corre cada renglón de donde estaba a donde quedó** (se mide antes y después, y se
 * anima la diferencia; solo `transform`). Es lo que hace que "Subila" y "Bajala" se vean como
 * mover un renglón y no como una lista que cambia. Con movimiento reducido, de un salto.
 */
function conDeslizamiento(pintar: () => void): void {
  const ms = duracionDe('--duracion-umbral');
  const hoja = partes?.hoja;
  if (!hoja || ms <= 0) return pintar();
  // Los renglones se reconocen por su tema; el corte y los avisos de la hoja, por lo que son:
  // si no se corrieran con los renglones, los de abajo les pasarían por encima.
  const PIEZAS = '.recital-renglon, .recital-corte, .recital-vacia';
  const nombre = (n: HTMLElement): string => n.dataset.slug ?? n.className + (n.previousElementSibling?.className ?? '');
  const antes = new Map<string, number>();
  for (const li of hoja.querySelectorAll<HTMLElement>(PIEZAS)) antes.set(nombre(li), li.getBoundingClientRect().top);
  const altoAntes = hoja.offsetHeight;
  pintar();
  const curva = getComputedStyle(document.documentElement).getPropertyValue('--curva-cinta').trim() || 'linear';
  for (const li of (partes?.hoja ?? hoja).querySelectorAll<HTMLElement>(PIEZAS)) {
    const estaba = antes.get(nombre(li));
    if (estaba === undefined || typeof li.animate !== 'function') continue;
    const corre = estaba - li.getBoundingClientRect().top;
    if (Math.abs(corre) < 1) continue;
    li.animate([{ transform: `translateY(${corre}px)` }, { transform: 'translateY(0)' }], { duration: ms, easing: curva });
  }
  // Y el papel acompaña: si la hoja cambió de alto (se sacó un tema), se achica en el mismo
  // tiempo. Sin esto los de abajo subían por afuera de un papel que ya se había cortado. Es la
  // única medida que se anima acá que no es `transform`, y es una sola pieza.
  const papel = partes?.hoja ?? hoja;
  const altoDespues = papel.offsetHeight;
  if (Math.abs(altoAntes - altoDespues) > 1 && typeof papel.animate === 'function') {
    papel.animate([{ height: `${altoAntes}px` }, { height: `${altoDespues}px` }], { duration: ms, easing: curva });
  }
}

/** Marca en el cajón el tema recién sumado, sin rehacer los demás. `false` si no lo encontró. */
function parcharTema(i: number): boolean {
  const b = partes!.temas.querySelector<HTMLButtonElement>(`[data-clave="tema-${i}"]`);
  if (!b) return false;
  const t = catalogo.temas[i]!;
  b.disabled = true;
  b.setAttribute('aria-label', `${t.titulo}. ${ARMADO.yaEsta}`);
  estampar(tildar(b));
  // La funda abierta dice cuántos de los suyos ya están.
  const puestos = b.closest('.recital-funda')?.querySelector<HTMLElement>('.recital-funda-puestos');
  if (puestos) puestos.textContent = ARMADO.enLaLista(catalogo.temas.filter((x, k) => x.disco === t.disco && tiraDe(armado, k) !== null).length);
  return true;
}

/** Repinta todo el armado. El foco vuelve al control que lo tenía, si se rehízo. */
function pintarArmado(): void {
  if (!lugar) return irAlLugar();
  if (!partes || !partes.hoja.isConnected) partes = montarArmado();
  conFoco(() => {
    pintarCabecera();
    pintarHoja();
    pintarControles();
    pintarTemas();
    pintarPie();
  });
}

/**
 * Lo que cambia cuando algo empieza o deja de sonar: qué renglón va subrayado, lo que dice su
 * "Escuchala" y el pie. **La hoja no se rehace**: rehacerla cortaba el renglón que se estaba
 * escribiendo.
 */
function pintarSonido(): void {
  if (!partes || zonaArmado.hidden) return;
  const suena = rocola.sonando;
  for (const li of partes.hoja.querySelectorAll<HTMLElement>('.recital-renglon')) {
    li.classList.toggle('recital-renglon--sonando', suena !== null && li.dataset.slug === suena);
  }
  const escuchar = partes.hoja.querySelector<HTMLElement>('[data-clave="accion-escuchar"]');
  if (escuchar && marcado !== null) escuchar.textContent = catalogo.temas[marcado]?.slug === suena ? ARMADO.parar : ARMADO.escuchar;
  pintarPie();
}

function conFoco(pintar: () => void): void {
  const antes = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const clave = antes?.dataset.clave;
  pintar();
  if (clave && (!antes || !antes.isConnected)) zonaArmado.querySelector<HTMLElement>(`[data-clave="${clave}"]`)?.focus({ preventScroll: true });
}

function pintarCabecera(): void {
  const p = partes!;
  // La entrada que se eligió, en la mano: el nombre en el cuerpo y la ciudad en el talón.
  const l = lugar!;
  const entrada = el('p', 'recital-entrada recital-entrada--elegida');
  entrada.setAttribute('aria-label', ARMADO.sello(lugarEnUnaLinea(l)));
  const cuerpo = el('span', 'recital-entrada-cuerpo');
  cuerpo.append(el('span', 'recital-entrada-rotulo', LUGAR.entrada), el('span', '', l.nombre));
  entrada.append(cuerpo);
  if (l.ciudad) entrada.append(el('span', 'recital-entrada-troquel'), el('span', 'recital-entrada-talon', l.ciudad));
  p.cabecera.replaceChildren(entrada, boton('recital-cambiar', ARMADO.cambiarLugar, () => irAlLugar()));
}

/** Hasta qué renglón la hoja muestra los que faltan, en blanco. */
const EN_BLANCO = 3;
/** Cuántos renglones de la lista deja ver la hoja plegada: los últimos, que son los recién escritos. */
const A_LA_VISTA_PLEGADA = 2;

/**
 * La hoja del armado. **Plegada** (como arranca) deja ver los últimos de la lista y queda pegada
 * arriba mientras se elige en el cajón: el tema que se suma se escribe a la vista. Con el botón
 * del doblez se abre entera —para mover, mandar a los bises o sacar— y se vuelve a plegar.
 * Con pocos temas no hay nada que plegar.
 */
function pintarHoja(): void {
  const p = partes!;
  const hoja = p.hoja;
  const sePliega = armado.lista.length > A_LA_VISTA_PLEGADA;
  const cerrada = plegada && sePliega;
  p.hojaCaja.classList.toggle('recital-hoja-caja--plegada', cerrada);
  p.hojaCaja.classList.toggle('recital-hoja-caja--pegada', plegada);
  const cabeza = el('div', 'recital-hoja-cabeza');
  cabeza.append(el('p', 'recital-rotulo', ARMADO.rotuloLista));
  if (sePliega) {
    const doblez = boton('recital-pliegue', cerrada ? ARMADO.desplegar(armado.lista.length - A_LA_VISTA_PLEGADA) : ARMADO.plegar, () => {
      plegada = !plegada;
      if (plegada) marcado = null;
      conFoco(() => pintarHoja());
      if (!plegada) window.scrollTo({ top: 0, behavior: comoMoverse() });
    });
    doblez.dataset.clave = 'pliegue';
    doblez.setAttribute('aria-expanded', String(!cerrada));
    cabeza.append(doblez);
  }
  hoja.replaceChildren(cabeza);
  if (cerrada) {
    const ol = el('ol', 'recital-lista');
    const desde = armado.lista.length - A_LA_VISTA_PLEGADA;
    armado.lista.slice(desde).forEach((i, k) => ol.append(renglon(i, desde + k + 1, false)));
    hoja.append(ol);
    const raya = corte();
    if (armado.bises.length > 0) raya.append(el('span', 'recital-corte-cuenta', String(armado.bises.length)));
    hoja.append(raya);
    return;
  }
  // Con menos de tres, la hoja muestra los renglones que faltan, numerados y en blanco: es una
  // lista por escribir, no un aviso. (Son dibujo: lo que hay que hacer lo dice la línea de arriba.)
  if (armado.lista.length === 0) hoja.append(el('p', 'recital-vacia', ARMADO.vacia));
  const ol = el('ol', 'recital-lista');
  armado.lista.forEach((i, k) => ol.append(renglon(i, k + 1, false)));
  for (let n = armado.lista.length + 1; n <= EN_BLANCO; n++) {
    const li = el('li', 'recital-renglon recital-renglon--blanco');
    li.setAttribute('aria-hidden', 'true');
    li.append(el('span', 'recital-numero', String(n)));
    ol.append(li);
  }
  hoja.append(ol);
  hoja.append(corte());
  if (armado.bises.length === 0) hoja.append(el('p', 'recital-vacia', ARMADO.sinBises));
  else {
    const ol = el('ol', 'recital-lista');
    armado.bises.forEach((i, k) => ol.append(renglon(i, k + 1, true)));
    hoja.append(ol);
  }
}

/** El corte de la hoja: la raya de fibra y la palabra, que separa la lista de los bises. */
function corte(): HTMLElement {
  const p = el('p', 'recital-corte');
  p.append(el('span', '', ARMADO.rotuloBises));
  return p;
}

function pintarControles(): void {
  const p = partes!;
  p.sorteo.disabled = !hayLugar(armado);
  p.silencio.textContent = sonido ? ARMADO.silenciar : ARMADO.queSuene;
  p.silencio.setAttribute('aria-pressed', String(!sonido));
}

/**
 * El cajón: **diez fundas**, una por disco, y adentro de la que se abre, sus temas. Eran los
 * ciento cinco a la vista, 8000 px de lista; cerrado mide lo que diez tapas. Se abre una por
 * vez. Con algo escrito en el buscador no hay fundas: van los temas que lo dicen, de todos los
 * discos, cada uno con el nombre del suyo.
 */
function pintarTemas(): void {
  const ul = partes!.temas;
  ul.replaceChildren();
  if (normalizar(busqueda) !== '') {
    const ids = visibles();
    if (ids.length === 0) ul.append(el('li', 'recital-temas-nada', ARMADO.sinResultados(busqueda.trim())));
    else {
      // Lo encontrado va en un solo recuadro, con los mismos renglones que una contratapa.
      const caja = el('li');
      const adentro = el('ul', 'recital-funda-temas recital-funda-temas--sueltos');
      for (const i of ids) adentro.append(temaDelCajon(i, false));
      caja.append(adentro);
      ul.append(caja);
    }
    return;
  }
  for (const d of catalogo.discos) {
    const abierta = filtro === d.slug;
    const suyos = catalogo.temas.map((t, i) => ({ t, i })).filter(({ t }) => t.disco === d.slug);
    const li = el('li', `recital-funda ${claseDisco(d.slug)}`);
    const b = boton('recital-funda-boton', '', () => {
      filtro = abierta ? null : d.slug;
      conFoco(() => pintarTemas());
      if (abierta) return;
      const funda = partes!.temas.querySelector<HTMLElement>('.recital-funda--abierta');
      pegar(funda?.querySelector('.recital-funda-temas'));
      // La página se acomoda: la funda abierta queda justo debajo de la hoja pegada (o arriba
      // de todo, si la hoja está abierta y corrida), con sus temas a la vista.
      if (!funda) return;
      const caja = partes!.hojaCaja;
      const techo = caja.classList.contains('recital-hoja-caja--pegada') ? Math.max(0, caja.getBoundingClientRect().bottom) : 0;
      const corre = funda.getBoundingClientRect().top - techo - 6;
      if (Math.abs(corre) > 4) window.scrollBy({ top: corre, behavior: comoMoverse() });
    });
    b.dataset.clave = `funda-${d.slug}`;
    b.setAttribute('aria-expanded', String(abierta));
    const tapa = rutaFicha(d.slug);
    if (tapa) {
      const img = el('img', 'recital-funda-tapa');
      img.src = tapa;
      img.alt = '';
      img.loading = 'lazy';
      img.width = 44;
      img.height = 44;
      b.append(img);
    }
    const texto = el('span', 'recital-funda-texto');
    texto.append(el('strong', '', d.titulo), el('span', '', ARMADO.funda(d.anio, suyos.length)));
    const puestos = suyos.filter(({ i }) => tiraDe(armado, i) !== null).length;
    b.append(texto, el('span', 'recital-funda-puestos', puestos > 0 ? ARMADO.enLaLista(puestos) : ''));
    li.append(b);
    if (abierta) {
      li.classList.add('recital-funda--abierta');
      const adentro = el('ul', 'recital-funda-temas');
      for (const { i } of suyos) adentro.append(temaDelCajon(i, true));
      li.append(adentro);
    }
    ul.append(li);
  }
}

/**
 * Un tema del cajón: **un renglón de la contratapa** de su funda. El número de pista, el título
 * y lo que dura. El que ya está en la lista va **tildado y tachado con fibra**, en tinta plena:
 * es una marca de quien arma la lista, no un control apagado (antes iba punteado y gris, con un
 * sello, y se leía como deshabilitado). `enSuFunda`: va debajo de su disco; si no (buscando),
 * dice de qué disco es.
 */
function temaDelCajon(i: number, enSuFunda: boolean): HTMLLIElement {
  const t = catalogo.temas[i]!;
  const li = el('li', claseDisco(t.disco));
  const esta = tiraDe(armado, i) !== null;
  const b = boton('recital-tema-cajon', '', () => sumar(i, b));
  b.dataset.clave = `tema-${i}`;
  b.disabled = esta || !hayLugar(armado);
  b.setAttribute('aria-label', esta ? `${t.titulo}. ${ARMADO.yaEsta}` : ARMADO.agregarAria(t.titulo));
  const texto = el('span', 'recital-tema-texto');
  texto.append(el('strong', '', t.titulo));
  if (!enSuFunda) texto.append(el('span', '', `${tituloDeDisco.get(t.disco) ?? ''} · ${t.pista}`));
  const pista = el('span', 'recital-pista', enSuFunda ? String(t.pista) : '');
  b.append(pista, texto);
  if (!conAudio.has(t.slug)) b.append(el('span', 'recital-sin-recorte', ARMADO.sinRecorte));
  if (t.segundos !== null) b.append(el('span', 'recital-dura-tema', minutos(t.segundos)));
  if (esta) tildar(b);
  li.append(b);
  return li;
}

/** Tilda un tema del cajón: la tilde de fibra en el lugar del número, y el título tachado. */
function tildar(b: HTMLButtonElement): HTMLElement | null {
  b.classList.add('recital-tema-cajon--puesto');
  const pista = b.querySelector<HTMLElement>('.recital-pista');
  if (pista) {
    pista.textContent = '';
    pista.classList.add('recital-pista--tilde');
  }
  return pista;
}

/** "4:02": lo que dura un tema en su disco. */
function minutos(segundos: number): string {
  return `${Math.floor(segundos / 60)}:${String(segundos % 60).padStart(2, '0')}`;
}

/**
 * El pie pegado abajo: lo que suena ahora (con su "Pará"), cuántos temas y cuánto dura, y
 * salir a tocar. Lo que suena va acá y no en la hoja porque la hoja, mientras se elige en el
 * cajón, queda fuera de la pantalla: el pedido era que el tema que aparece se escuche, y que
 * se sepa cuál es.
 */
function pintarPie(): void {
  const p = partes!;
  const suena = rocola.sonando;
  const i = suena ? indicePorSlug.get(suena) : undefined;
  p.pie.classList.toggle('recital-pie--suena', i !== undefined);
  p.suenaTitulo.replaceChildren();
  if (i !== undefined) {
    p.suenaTitulo.append(el('span', 'recital-suena-sello', ARMADO.suenaSello), el('span', '', catalogo.temas[i]!.titulo));
    p.cabina.correr(
      () => (Date.now() - sonandoDesde) / (SEGUNDOS_POR_TEMA * 1000),
      () => Math.min((Date.now() - sonandoDesde) / 1000, SEGUNDOS_POR_TEMA),
    );
  } else {
    p.suenaTitulo.textContent = ARMADO.pieQuieto;
    p.cabina.frenar();
  }
  // "Pará" guarda su lugar aunque nada suene: el pie no cambia de ancho ni de alto.
  p.parar.disabled = i === undefined;
  const n = cuantos(armado);
  const faltan = MIN_TEMAS_RECITAL - armado.lista.length;
  const { segundos } = duracion(armado, catalogo.temas);
  p.faltan.textContent = [n > 0 ? formatoDuracion(segundos) : '', faltan > 0 ? ARMADO.faltan(faltan) : !hayLugar(armado) ? ARMADO.lleno : '']
    .filter(Boolean)
    .join(' · ');
  // La cuenta de ruedas: al sumar un tema la gira quien lo suma, cuando llega el papelito.
  if (!cuentaEnVuelo) rodarContador(p.contador, n);
  p.cuentaRotulo.textContent = ARMADO.temas(n);
  p.cuentaLector.textContent = ARMADO.cuenta(n, formatoDuracion(segundos));
  p.cerrar.disabled = !sePuedeCerrar(armado);
}

// ------------------------------------------------------------------ la noche

function linkDeLaNoche(): string {
  const l = lugar!;
  return armarLinkRecital(location.origin + location.pathname, JUEGO, {
    lugar: l.slug,
    ...(l.slug === LUGAR_OTRO ? { nombre: l.nombre } : {}),
    ...(l.slug === LUGAR_OTRO || l.slug === LUGAR_DESCAMPADO ? { ciudad: l.ciudad } : {}),
    lista: armado.lista,
    bises: armado.bises,
  });
}

function limpiarDireccion(): void {
  try {
    history.replaceState(null, '', location.pathname);
  } catch {
    /* una dirección que no se puede escribir no frena el juego */
  }
}

function irALaNoche(): void {
  if (!lugar || !sePuedeCerrar(armado)) return;
  pararTodo();
  sonarEfecto('sello');
  marcado = null;
  try {
    history.replaceState(null, '', linkDeLaNoche());
  } catch {
    /* ídem */
  }
  mostrar(zonaNoche);
  pintarNoche();
  enfocarTitulo(zonaNoche);
}

/**
 * La noche: la hoja terminada, que es lo que se comparte.
 *
 * **Se cierra en dos tiempos** (ronda de pulida, 2026-11-21): primero la lista se escribe sola,
 * renglón por renglón, con el fibrón; cuando termina, entra el pie con la hoja que asoma y
 * "Compartí". Un toque en cualquier lado lo adelanta: todo queda escrito y a la vista. Con
 * movimiento reducido no hay primer tiempo.
 */
function pintarNoche(): void {
  if (!lugar) return;
  zonaNoche.replaceChildren();
  zonaNoche.classList.add('recital-noche--escribe');
  const orden = enOrden(armado);
  zonaNoche.style.setProperty('--renglones', String(orden.length));
  // Un renglón atrás del otro, con un solo fibrón a la vista. Hasta doce van al paso; con más,
  // se apura el paso para que la lista entera se escriba en lo mismo que doce.
  zonaNoche.style.setProperty('--ritmo', String(Math.min(1, 12 / orden.length)));
  if (ajena) zonaNoche.append(el('p', 'recital-ajena', NOCHE.ajena));

  // La cabina va arriba de la hoja: con veinte temas la hoja es larga, y lo primero que se hace
  // con una lista cerrada es oírla. El casete anda mientras suena y la cinta pasa de un carrete
  // al otro con la lista entera.
  const cabinaCaja = el('div', 'recital-cabina');
  const casete = armarCasete();
  casete.classList.add('recital-casete');
  const cabina = armarCabina(casete);
  const lado = el('div', 'recital-cabina-lado');
  cabinaCaja.append(casete, lado);
  zonaNoche.append(cabinaCaja, el('p', 'recital-como-suena', NOCHE.comoSuena));

  const hoja = el('div', 'recital-hoja recital-hoja--noche');
  hoja.append(el('h2', 'recital-noche-titulo', NOCHE.titulo), el('p', 'recital-noche-lugar', lugarEnUnaLinea(lugar)));
  const ol = el('ol', 'recital-lista recital-lista--noche');
  const renglones: HTMLLIElement[] = [];
  const pintarTira = (tira: readonly number[], destino: HTMLOListElement): void => {
    tira.forEach((i) => {
      const t = catalogo.temas[i]!;
      const li = el('li', `recital-renglon ${claseDisco(t.disco)}`);
      li.style.setProperty('--orden', String(renglones.length));
      li.append(escrito(t.titulo), el('span', 'recital-disco', tituloDeDisco.get(t.disco) ?? ''));
      if (!conAudio.has(t.slug)) li.append(el('span', 'recital-sin-recorte', ARMADO.sinRecorte));
      renglones.push(li);
      destino.append(li);
    });
  };
  pintarTira(armado.lista, ol);
  hoja.append(ol);
  if (armado.bises.length > 0) {
    hoja.append(corte());
    const olBis = el('ol', 'recital-lista recital-lista--noche');
    olBis.start = armado.lista.length + 1;
    pintarTira(armado.bises, olBis);
    hoja.append(olBis);
  }
  const { segundos, sinMedir } = duracion(armado, catalogo.temas);
  hoja.append(el('p', 'recital-dura', NOCHE.dura(formatoDuracion(segundos), sinMedir)));
  zonaNoche.append(hoja);

  // Escuchar la noche: los temas con recorte, en orden, marcando el renglón que suena.
  const conRecorte = orden.map((i, k) => ({ i, k })).filter(({ i }) => conAudio.has(catalogo.temas[i]!.slug));
  const estado = el('p', 'recital-estado');
  estado.setAttribute('aria-live', 'polite');
  const escuchar = boton('primario', NOCHE.escuchar, () => {
    if (rocola.sonando) {
      rocola.parar();
      return;
    }
    escuchar.textContent = NOCHE.parar;
    hoja.querySelector('.recital-sello-fin')?.remove();
    let va = 0;
    let desde = Date.now();
    const pasado = (): number => Math.min((Date.now() - desde) / 1000, SEGUNDOS_POR_TEMA);
    rocola.tocarLista(
      conRecorte.map(({ i }) => catalogo.temas[i]!.slug),
      (pos) => {
        const k = conRecorte[pos]!.k;
        va = pos;
        desde = Date.now();
        cabina.correr(() => (va + pasado() / SEGUNDOS_POR_TEMA) / conRecorte.length, pasado);
        renglones.forEach((r, j) => r.classList.toggle('recital-renglon--sonando', j === k));
        // El sello "SUENA" se estampa en el renglón: el estado no es solo el subrayado.
        zonaNoche.querySelector('.recital-renglon .recital-suena-sello')?.remove();
        renglones[k]?.append(el('span', 'recital-suena-sello', ARMADO.suenaSello));
        renglones[k]?.scrollIntoView({ block: 'nearest', behavior: comoMoverse() });
        estado.textContent = NOCHE.sonando(k + 1, orden.length);
      },
      (completa) => {
        // Sonó entera: la cinta se rebobina, y en la hoja cae el sello. Cortada, frena y nada más.
        if (completa) {
          cabina.rebobinar();
          const fin = el('p', 'recital-sello-hoja recital-sello-fin', NOCHE.finSello);
          fin.setAttribute('aria-hidden', 'true');
          hoja.append(fin);
          sonarEfecto('sello');
          fin.scrollIntoView({ block: 'nearest', behavior: comoMoverse() });
        } else cabina.frenar();
        renglones.forEach((r) => r.classList.remove('recital-renglon--sonando'));
        zonaNoche.querySelector('.recital-renglon .recital-suena-sello')?.remove();
        escuchar.textContent = NOCHE.escuchar;
        // "Terminó" solo si sonó hasta el final; cortada con "Pará" o sin red, no dice nada
        // que no pasó (`FIND-165`).
        estado.textContent = completa ? NOCHE.termino : '';
      },
    );
  });
  escuchar.dataset.clave = 'escuchar-noche';
  escuchar.disabled = conRecorte.length === 0;
  lado.append(escuchar, estado);

  // El pie se arma un cuadro después: entra cuando la lista terminó de escribirse, así que no
  // tiene por qué pesar en el cuadro del toque de "SALÍ A TOCAR".
  const esta = hoja;
  window.setTimeout(() => {
    if (!esta.isConnected || !lugar) return;
    // El pie, igual que en los otros juegos: la hoja que asoma, "Compartí", lo que compartir
    // tenga para decir, y la otra vuelta. La hoja es la misma imagen que se comparte.
    const pie = el('div', 'pie-resultado');
    const asoma = el('div', 'tarjeta-asoma');
    asoma.setAttribute('aria-hidden', 'true');
    let imagen: File | null = null;
    const { boton: compartir, salida } = botonCompartir(
      { compartir: NOCHE.compartir, copiado: NOCHE.copiado, aManoTitulo: NOCHE.aManoTitulo },
      () => ({ texto: (ajena ? NOCHE.paraReenviar : NOCHE.paraCompartir)(lugarEnUnaLinea(lugar!)), url: linkDeLaNoche(), archivo: imagen }),
    );
    asoma.addEventListener('click', () => compartir.click());
    pie.append(asoma, compartir, salida);
    // La hoja también se baja, para el que no tiene menú de compartir (una compu, casi siempre).
    // Entra recién cuando la imagen existe: `.secundario` pisa el `hidden` del navegador.
    const bajar = el('a', 'secundario compartir-bajar', NOCHE.bajar);
    // Se dibuja un momento después: pintar la hoja en el mismo cuadro del toque de "SALÍ A TOCAR"
    // lo alargaba justo cuando la lista empieza a escribirse.
    const dibujada = new Promise<File | null>((listo) => window.setTimeout(() => void armarImagen().then(listo), 500));
    void dibujada.then((f) => {
      imagen = f;
      if (!f || !salida.isConnected) return asoma.remove();
      const url = URL.createObjectURL(f);
      const foto = el('img', 'jugo-pega');
      foto.alt = '';
      foto.src = url;
      asoma.append(foto);
      bajar.href = url;
      bajar.download = f.name;
      salida.after(bajar);
    });

    if (ajena) {
      pie.append(
        boton('secundario', NOCHE.laTuya, () => {
          armado = VACIO;
          lugar = null;
          irAlLugar();
        }),
      );
    } else {
      pie.append(
        boton('secundario', NOCHE.otra, () => {
          armado = VACIO;
          guardarPartida();
          irAlLugar();
        }),
      );
    }
    zonaNoche.append(pie);

    // Las salidas, chicas y al final: volver al fichín, retocar la lista y las listas de verdad.
    const salidas = el('p', 'salida-resultado recital-salidas');
    const volver = el('a', 'volver', `← ${NOCHE.volver}`);
    volver.href = '/';
    salidas.append(volver);
    if (!ajena) salidas.append(boton('recital-cambiar', NOCHE.cambiar, () => irAlArmado()));
    const deVerdad = el('a', 'recital-cambiar', NOCHE.deVerdad);
    deVerdad.href = '/redondopedia/en-vivo/';
    salidas.append(deVerdad);
    zonaNoche.append(salidas);
  }, 80);
}

// Un toque adelanta el cierre: la lista queda escrita y el pie, a la vista.
zonaNoche.addEventListener('click', () => zonaNoche.classList.remove('recital-noche--escribe'), true);

/** La hoja que sale del sitio: la de la pantalla, hecha imagen (`hoja-recital.ts`, con su planta propia). */
async function armarImagen(): Promise<File | null> {
  if (!lugar) return null;
  try {
    const titulos = (tira: readonly number[]) => tira.map((i) => catalogo.temas[i]!.titulo);
    const blob = await dibujarHojaRecital({
      titulo: NOCHE.titulo,
      lugar: lugarEnUnaLinea(lugar),
      lista: titulos(armado.lista),
      bises: titulos(armado.bises),
      rotuloBises: ARMADO.rotuloBises,
      cuenta: IMPRESO.cuenta(cuantos(armado), formatoDuracion(duracion(armado, catalogo.temas).segundos)),
      credito: IMPRESO.credito,
      sitio: location.host + location.pathname,
    });
    return blob ? new File([blob], `fichin-ricotero-arma-tu-recital-${lugar.slug}.png`, { type: 'image/png' }) : null;
  } catch {
    // Sin imagen se comparte igual, con texto y dirección (`D-14`).
    return null;
  }
}

// ------------------------------------------------------------------ arranque

function arrancar(): void {
  const delLink = leerRecital(location.href, JUEGO, catalogo.temas.length, (s) => lugarPorSlug.has(s));
  const delLinkLugar = delLink ? lugarDelLink(delLink) : null;
  if (delLink && delLinkLugar) {
    lugar = delLinkLugar;
    armado = { lista: delLink.lista, bises: delLink.bises };
    // Si es la misma lista que este navegador tiene guardada, es la propia recargada, no una
    // que te pasaron (`REV-23`, diferido).
    const propia = leerPartida();
    ajena = !(
      propia &&
      lugarEnUnaLinea(propia.lugar) === lugarEnUnaLinea(delLinkLugar) &&
      propia.armado.lista.join() === delLink.lista.join() &&
      propia.armado.bises.join() === delLink.bises.join()
    );
    if (sePuedeCerrar(armado)) {
      mostrar(zonaNoche);
      pintarNoche();
      return;
    }
    // Una lista ajena demasiado corta para ser una noche se abre para seguir armándola.
    ajena = false;
    irAlArmado();
    return;
  }
  pintarInicio();
}

arrancar();
