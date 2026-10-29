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
import { LUGAR, ARMADO, NOCHE, IMPRESO } from '../lib/recital/copy.ts';
import { armarLinkRecital, leerRecital, limpiarLugar, LUGAR_DESCAMPADO, LUGAR_OTRO, type RecitalDelLink } from '../lib/desafio.ts';
import { claseDisco } from '../lib/tema/paleta.ts';
import { normalizar } from '../lib/texto.ts';
import { rutaFicha } from '../lib/tapa/pasadas.ts';
import { crearRocola } from './rocola.ts';
import { botonCompartir } from './compartir.ts';
import { dibujarLamina } from './lamina.ts';

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
/** El disco del cajón, o `null` para todos. */
let filtro: string | null = null;
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
  const titulo = zona.querySelector<HTMLElement>('h2, .recital-sello');
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
  rocola.tocar(t.slug, () => pintarSonido());
}

function pararTodo(): void {
  if (rocola.sonando) rocola.parar();
}

// ------------------------------------------------------------------ la puerta

function pintarInicio(): void {
  const retomar = $('retomar');
  retomar.replaceChildren();
  const guardada = leerPartida();
  if (guardada) {
    retomar.append(
      boton('secundario', ARMADO.retomar(lugarEnUnaLinea(guardada.lugar)), () => {
        lugar = guardada.lugar;
        armado = guardada.armado;
        irAlArmado();
      }),
      el('p', 'recital-retomar-cuenta', ARMADO.cuenta(cuantos(guardada.armado), formatoDuracion(duracion(guardada.armado, catalogo.temas).segundos))),
    );
  }
}

$('empezar').addEventListener('click', () => {
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

function elegirLugar(l: LugarElegido): void {
  lugar = l;
  guardarPartida();
  irAlArmado();
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
    const tipo = pestana;
    const lista = el('ul', 'recital-lugares');
    for (const l of catalogo.lugares.filter((x) => x.tipo === tipo)) {
      const li = el('li');
      const b = boton('recital-entrada', '', () => elegirLugar({ slug: l.slug, nombre: l.nombre, ciudad: l.ciudad }));
      b.append(el('span', 'recital-entrada-cuerpo', l.nombre), el('span', 'recital-entrada-talon', l.ciudad));
      if (lugar?.slug === l.slug) b.setAttribute('aria-current', 'true');
      li.append(b);
      lista.append(li);
    }
    zonaLugar.append(lista);
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
  readonly discos: HTMLElement;
  readonly etiqueta: HTMLElement;
  readonly temas: HTMLUListElement;
  readonly pie: HTMLElement;
}

let partes: PartesArmado | null = null;
/** Lo escrito en el buscador del cajón. */
let busqueda = '';
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
  const hoja = el('div', 'recital-hoja');

  const cajon = el('section', 'recital-cajon');
  cajon.setAttribute('aria-label', ARMADO.cajon);
  const cabezaCajon = el('div', 'recital-cajon-cabeza');
  const sorteo = boton('recital-chico', ARMADO.sortear, () => {
    const i = sortear(armado, visibles());
    if (i !== null) sumar(i);
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

  // Los discos como tapas: una tira que se corre de costado, en vez de once botones de texto.
  const discos = el('div', 'recital-discos');
  discos.setAttribute('role', 'group');
  discos.setAttribute('aria-label', ARMADO.discos);
  const elegirDisco = (slug: string | null): void => {
    filtro = slug;
    pintarControles();
    pintarTemas();
  };
  const todos = boton('recital-disco-boton recital-disco-boton--todos', ARMADO.todos, () => elegirDisco(null));
  todos.dataset.disco = '';
  discos.append(todos);
  for (const d of catalogo.discos) {
    const b = boton(`recital-disco-boton ${claseDisco(d.slug)}`, '', () => elegirDisco(d.slug));
    b.dataset.disco = d.slug;
    b.setAttribute('aria-label', d.titulo);
    const tapa = rutaFicha(d.slug);
    if (tapa) {
      const img = el('img');
      img.src = tapa;
      img.alt = '';
      img.loading = 'lazy';
      img.width = 52;
      img.height = 52;
      b.append(img);
    } else {
      b.textContent = d.titulo;
    }
    discos.append(b);
  }

  const etiqueta = el('p', 'recital-disco-elegido');
  const temas = el('ul', 'recital-temas');
  cajon.append(cabezaCajon, buscador, discos, etiqueta, temas);

  const pie = el('div', 'recital-pie');
  zonaArmado.append(cabecera, hoja, cajon, pie);
  return { cabecera, hoja, sorteo, silencio, buscador, discos, etiqueta, temas, pie };
}

/** Los temas que muestra el cajón: los del disco elegido y los que dicen lo buscado. */
function visibles(): number[] {
  const q = normalizar(busqueda);
  return catalogo.temas
    .map((_, i) => i)
    .filter((i) => {
      const t = catalogo.temas[i]!;
      return (filtro === null || t.disco === filtro) && (q === '' || normalizar(t.titulo).includes(q));
    });
}

function renglon(i: number, n: number, bis: boolean): HTMLLIElement {
  const t = catalogo.temas[i]!;
  const li = el('li', `recital-renglon ${claseDisco(t.disco)}`);
  if (marcado === i) li.classList.add('recital-renglon--marcado');
  if (rocola.sonando === t.slug) li.classList.add('recital-renglon--sonando');
  if (recienSumado === i) li.classList.add('recital-renglon--entra');
  const b = boton('recital-renglon-boton', '', () => {
    marcado = marcado === i ? null : i;
    pintarHoja();
    zonaArmado.querySelector<HTMLElement>('.recital-renglon--marcado .recital-renglon-boton')?.focus();
  });
  b.dataset.clave = `renglon-${i}`;
  b.setAttribute('aria-expanded', String(marcado === i));
  b.setAttribute('aria-label', ARMADO.renglon(n, t.titulo, bis));
  b.append(el('span', 'recital-numero', String(n)), el('span', 'recital-tema', t.titulo), el('span', 'recital-disco', tituloDeDisco.get(t.disco) ?? ''));
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
    pintarArmado();
    const tira = tiraDe(armado, i);
    const pos = tira === 'lista' ? armado.lista.indexOf(i) + 1 : armado.bises.indexOf(i) + 1;
    avisar(zonaArmado, ARMADO.movido(t.titulo, pos, tira === 'bises'));
    zonaArmado.querySelector<HTMLElement>('.recital-renglon--marcado .recital-renglon-boton')?.focus();
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
        pintarSonido();
      }),
    );
  }
  caja.append(
    accion('sacar', ARMADO.sacar, () => {
      if (rocola.sonando === t.slug) rocola.parar();
      armado = sacar(armado, i);
      marcado = null;
      guardarPartida();
      pintarArmado();
      avisar(zonaArmado, ARMADO.sacado(t.titulo));
    }),
  );
  return caja;
}

function sumar(i: number): void {
  const t = catalogo.temas[i]!;
  const antes = armado;
  armado = agregar(armado, i);
  if (armado === antes) return;
  guardarPartida();
  recienSumado = i;
  if (sonido) tocarTema(i);
  pintarArmado();
  recienSumado = null;
  // El botón tocado vuelve deshabilitado y no puede tener el foco (`FIND-154`): pasa al tema
  // que sigue en el cajón, así el teclado no vuelve al principio de los 105.
  const libres = [...zonaArmado.querySelectorAll<HTMLButtonElement>('.recital-tema-cajon:not(:disabled)')];
  const siguiente = libres.find((b) => Number(b.dataset.clave?.slice(5)) > i) ?? libres[libres.length - 1];
  siguiente?.focus({ preventScroll: true });
  const bis = tiraDe(armado, i) === 'bises';
  avisar(zonaArmado, ARMADO.sumado(t.titulo, bis ? armado.bises.length : armado.lista.length, bis));
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

/** Lo que cambia cuando algo empieza o deja de sonar: la hoja y el pie, nada más. */
function pintarSonido(): void {
  if (!partes || zonaArmado.hidden) return;
  conFoco(() => {
    pintarHoja();
    pintarPie();
  });
}

function conFoco(pintar: () => void): void {
  const antes = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const clave = antes?.dataset.clave;
  pintar();
  if (clave && (!antes || !antes.isConnected)) zonaArmado.querySelector<HTMLElement>(`[data-clave="${clave}"]`)?.focus({ preventScroll: true });
}

function pintarCabecera(): void {
  const p = partes!;
  p.cabecera.replaceChildren(
    el('p', 'recital-sello', ARMADO.sello(lugarEnUnaLinea(lugar!))),
    boton('recital-cambiar', ARMADO.cambiarLugar, () => irAlLugar()),
  );
}

function pintarHoja(): void {
  const hoja = partes!.hoja;
  hoja.replaceChildren(el('p', 'recital-rotulo', ARMADO.rotuloLista));
  if (armado.lista.length === 0) hoja.append(el('p', 'recital-vacia', ARMADO.vacia));
  else {
    const ol = el('ol', 'recital-lista');
    armado.lista.forEach((i, k) => ol.append(renglon(i, k + 1, false)));
    hoja.append(ol);
  }
  hoja.append(el('p', 'recital-rotulo recital-rotulo--bis', ARMADO.rotuloBises));
  if (armado.bises.length === 0) hoja.append(el('p', 'recital-vacia', ARMADO.sinBises));
  else {
    const ol = el('ol', 'recital-lista');
    armado.bises.forEach((i, k) => ol.append(renglon(i, k + 1, true)));
    hoja.append(ol);
  }
}

function pintarControles(): void {
  const p = partes!;
  p.sorteo.disabled = !hayLugar(armado);
  p.silencio.textContent = sonido ? ARMADO.silenciar : ARMADO.queSuene;
  p.silencio.setAttribute('aria-pressed', String(!sonido));
  for (const b of p.discos.querySelectorAll<HTMLButtonElement>('.recital-disco-boton')) {
    b.setAttribute('aria-pressed', String((b.dataset.disco || null) === filtro));
  }
  const elegido = filtro ? catalogo.discos.find((d) => d.slug === filtro) : undefined;
  p.etiqueta.textContent = elegido ? ARMADO.discoElegido(elegido.titulo, elegido.anio) : ARMADO.losCiento;
}

function pintarTemas(): void {
  const ul = partes!.temas;
  ul.replaceChildren();
  const ids = visibles();
  if (ids.length === 0) {
    ul.append(el('li', 'recital-temas-nada', ARMADO.sinResultados(busqueda.trim())));
    return;
  }
  // Sin búsqueda, los temas van agrupados bajo su disco, con la tapa una sola vez; buscando,
  // cada renglón dice de qué disco es.
  const agrupado = normalizar(busqueda) === '';
  let discoAnterior: string | null = null;
  for (const i of ids) {
    const t = catalogo.temas[i]!;
    if (agrupado && t.disco !== discoAnterior) {
      discoAnterior = t.disco;
      const cabeza = el('li', `recital-temas-disco ${claseDisco(t.disco)}`);
      const tapa = rutaFicha(t.disco);
      if (tapa) {
        const img = el('img');
        img.src = tapa;
        img.alt = '';
        img.loading = 'lazy';
        img.width = 36;
        img.height = 36;
        cabeza.append(img);
      }
      cabeza.append(el('strong', '', tituloDeDisco.get(t.disco) ?? ''), el('span', '', String(anioDeDisco.get(t.disco) ?? '')));
      ul.append(cabeza);
    }
    const li = el('li', claseDisco(t.disco));
    const esta = tiraDe(armado, i) !== null;
    const b = boton('recital-tema-cajon', '', () => sumar(i));
    b.dataset.clave = `tema-${i}`;
    b.disabled = esta || !hayLugar(armado);
    b.setAttribute('aria-label', esta ? `${t.titulo}. ${ARMADO.yaEsta}` : ARMADO.agregarAria(t.titulo));
    const texto = el('span', 'recital-tema-texto');
    const bajada = agrupado ? (t.segundos === null ? '' : minutos(t.segundos)) : `${tituloDeDisco.get(t.disco) ?? ''} · ${t.pista}`;
    texto.append(el('strong', '', t.titulo));
    if (bajada) texto.append(el('span', '', bajada));
    b.append(el('span', 'recital-pista', String(t.pista)), texto);
    if (esta) b.append(el('span', 'recital-ya', ARMADO.yaEsta));
    else if (!conAudio.has(t.slug)) b.append(el('span', 'recital-sin-recorte', ARMADO.sinRecorte));
    li.append(b);
    ul.append(li);
  }
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
  const pie = partes!.pie;
  pie.replaceChildren();
  const suena = rocola.sonando;
  const i = suena ? indicePorSlug.get(suena) : undefined;
  if (i !== undefined) {
    const fila = el('div', 'recital-suena');
    const parar = boton('recital-suena-parar', ARMADO.parar, () => rocola.parar());
    parar.dataset.clave = 'pie-parar';
    fila.append(el('span', 'recital-suena-sello', ARMADO.suenaSello), el('span', 'recital-suena-titulo', catalogo.temas[i]!.titulo), parar);
    pie.append(fila);
  }
  const faltan = MIN_TEMAS_RECITAL - armado.lista.length;
  const { segundos } = duracion(armado, catalogo.temas);
  const partesDeLinea = [
    cuantos(armado) > 0 ? ARMADO.cuenta(cuantos(armado), formatoDuracion(segundos)) : '',
    faltan > 0 ? ARMADO.faltan(faltan) : !hayLugar(armado) ? ARMADO.lleno : '',
  ].filter(Boolean);
  pie.append(el('p', 'recital-faltan', partesDeLinea.join(' · ')));
  const cerrar = boton('primario', ARMADO.cerrar, () => irALaNoche());
  cerrar.dataset.clave = 'cerrar';
  cerrar.disabled = !sePuedeCerrar(armado);
  pie.append(cerrar);
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

function pintarNoche(): void {
  if (!lugar) return;
  zonaNoche.replaceChildren();
  if (ajena) zonaNoche.append(el('p', 'recital-ajena', NOCHE.ajena));
  // El botón de escuchar va arriba de la hoja: con veinte temas la hoja es larga, y lo primero
  // que se hace con una lista cerrada es oírla. Se arma más abajo, cuando existen los renglones.
  const controles = el('div', 'recital-noche-controles');
  zonaNoche.append(controles);

  const hoja = el('div', 'recital-hoja recital-hoja--noche');
  hoja.append(el('h2', 'recital-noche-titulo', NOCHE.titulo), el('p', 'recital-noche-lugar', lugarEnUnaLinea(lugar)));
  const ol = el('ol', 'recital-lista recital-lista--noche');
  const renglones: HTMLLIElement[] = [];
  const pintarTira = (tira: readonly number[], destino: HTMLOListElement): void => {
    tira.forEach((i) => {
      const t = catalogo.temas[i]!;
      const li = el('li', `recital-renglon ${claseDisco(t.disco)}`);
      li.append(el('span', 'recital-tema', t.titulo), el('span', 'recital-disco', tituloDeDisco.get(t.disco) ?? ''));
      if (!conAudio.has(t.slug)) li.append(el('span', 'recital-sin-recorte', ARMADO.sinRecorte));
      renglones.push(li);
      destino.append(li);
    });
  };
  pintarTira(armado.lista, ol);
  hoja.append(ol);
  if (armado.bises.length > 0) {
    hoja.append(el('p', 'recital-rotulo recital-rotulo--bis', ARMADO.rotuloBises));
    const olBis = el('ol', 'recital-lista recital-lista--noche');
    olBis.start = armado.lista.length + 1;
    pintarTira(armado.bises, olBis);
    hoja.append(olBis);
  }
  const { segundos, sinMedir } = duracion(armado, catalogo.temas);
  hoja.append(el('p', 'recital-dura', NOCHE.dura(formatoDuracion(segundos), sinMedir)));
  zonaNoche.append(hoja);

  // Escuchar la noche: los temas con recorte, en orden, marcando el renglón que suena.
  const orden = enOrden(armado);
  const conRecorte = orden.map((i, k) => ({ i, k })).filter(({ i }) => conAudio.has(catalogo.temas[i]!.slug));
  const estado = el('p', 'recital-estado');
  estado.setAttribute('aria-live', 'polite');
  const escuchar = boton('primario', NOCHE.escuchar, () => {
    if (rocola.sonando) {
      rocola.parar();
      return;
    }
    escuchar.textContent = NOCHE.parar;
    rocola.tocarLista(
      conRecorte.map(({ i }) => catalogo.temas[i]!.slug),
      (pos) => {
        const k = conRecorte[pos]!.k;
        renglones.forEach((r, j) => r.classList.toggle('recital-renglon--sonando', j === k));
        // El sello "SUENA" se estampa en el renglón: el estado no es solo el subrayado.
        zonaNoche.querySelector('.recital-renglon .recital-suena-sello')?.remove();
        renglones[k]?.append(el('span', 'recital-suena-sello', ARMADO.suenaSello));
        renglones[k]?.scrollIntoView({ block: 'nearest', behavior: comoMoverse() });
        estado.textContent = NOCHE.sonando(k + 1, orden.length);
      },
      (completa) => {
        renglones.forEach((r) => r.classList.remove('recital-renglon--sonando'));
        zonaNoche.querySelector('.recital-renglon .recital-suena-sello')?.remove();
        escuchar.textContent = NOCHE.escuchar;
        // "Terminó" solo si sonó hasta el final; cortada con "Pará" o sin red, no dice nada
        // que no pasó (`FIND-165`).
        estado.textContent = completa ? NOCHE.termino : '';
      },
    );
  });
  escuchar.disabled = conRecorte.length === 0;
  controles.append(escuchar, estado, el('p', 'recital-como-suena', NOCHE.comoSuena));

  // Compartir: la hoja como imagen y la dirección para abrirla.
  let imagen: File | null = null;
  const { boton: compartir, salida } = botonCompartir(
    { compartir: NOCHE.compartir, copiado: NOCHE.copiado, aManoTitulo: NOCHE.aManoTitulo },
    () => ({ texto: (ajena ? NOCHE.paraReenviar : NOCHE.paraCompartir)(lugarEnUnaLinea(lugar!)), url: linkDeLaNoche(), archivo: imagen }),
  );
  zonaNoche.append(compartir, salida);
  // La hoja también se baja, para el que no tiene menú de compartir (una compu, casi siempre).
  // Entra recién cuando la imagen existe: `.secundario` pisa el `hidden` del navegador.
  const bajar = el('a', 'secundario compartir-bajar', NOCHE.bajar);
  void armarImagen().then((f) => {
    imagen = f;
    if (!f || !salida.isConnected) return;
    bajar.href = URL.createObjectURL(f);
    bajar.download = f.name;
    bajar.addEventListener('click', () => setTimeout(() => URL.revokeObjectURL(bajar.href), 60_000), { once: true });
    salida.after(bajar);
  });

  if (ajena) {
    zonaNoche.append(
      boton('secundario', NOCHE.laTuya, () => {
        armado = VACIO;
        lugar = null;
        irAlLugar();
      }),
    );
  } else {
    zonaNoche.append(
      boton('secundario', NOCHE.cambiar, () => irAlArmado()),
      boton('secundario', NOCHE.otra, () => {
        armado = VACIO;
        guardarPartida();
        irAlLugar();
      }),
    );
  }
  const deVerdad = el('a', 'secundario', NOCHE.deVerdad);
  deVerdad.href = '/redondopedia/en-vivo/';
  zonaNoche.append(deVerdad);
}

/** La hoja que sale del sitio: la misma lámina de "Ponelos en fila", con la tinta de *Oktubre*. */
async function armarImagen(): Promise<File | null> {
  if (!lugar) return null;
  try {
    const titulos = (tira: readonly number[], desde: number) => tira.map((i, k) => `${desde + k}. ${catalogo.temas[i]!.titulo}`);
    const blob = await dibujarLamina({
      juego: IMPRESO.juego,
      conjunto: lugarEnUnaLinea(lugar),
      bandas: [
        { nombre: IMPRESO.lista, fichas: titulos(armado.lista, 1) },
        { nombre: IMPRESO.bises, fichas: armado.bises.length > 0 ? titulos(armado.bises, armado.lista.length + 1) : [IMPRESO.sinBises] },
      ],
      repartidas: IMPRESO.cuenta(cuantos(armado), formatoDuracion(duracion(armado, catalogo.temas).segundos)),
      credito: IMPRESO.credito,
      sitio: location.host + location.pathname,
      tintaJuego: '--disco-oktubre-tinta',
      renglonPorFicha: true,
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
