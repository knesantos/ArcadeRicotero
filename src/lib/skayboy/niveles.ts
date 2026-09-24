/**
 * Los tipos del dato de niveles (`CTR-16`) y las funciones puras que lo leen.
 *
 * **Lo que este módulo no puede importar, y no es una preferencia** (`CTR-16.8`): nada de
 * `node:*`, nada de `sitio/arte.ts`, nada del motor. Lo lee la página en build y lo lee la
 * isla en el navegador, así que cualquiera de esas tres cosas lo rompería de un lado o del
 * otro. Por eso ninguna función de acá abre un archivo: el banco entra por parámetro.
 *
 * **Y lo que hace, que es la mitad que el schema no puede hacer.** `skayboy.schema.json`
 * mide el largo de cada renglón contra un número escrito en el schema; acá se mide contra
 * `ancho` y `alto` del propio dato, que es para lo que `CTR-16.2` los puso adentro del
 * archivo. Y sobre todo: **que cada caracter de la grilla esté declarado en la leyenda** no
 * lo puede ver ningún schema, porque JSON Schema no sabe mirar un valor hermano. Si esa
 * regla no vive acá, no vive en ninguna parte.
 *
 * Desde `CTR-16.10` (`T-272`) viven acá también **las reglas de la sala que miran una celda
 * vecina o cruzan dos arreglos** (`E1` a `E6` y `E8` de `CTR-16.10.10`): que cada mecanismo esté
 * sobre su pieza, que cada compuerta tenga nombre y quien la abra, que todo esté apoyado, y que
 * cada entrada tenga dónde pararse. Un nivel que rompe una no entra al banco, con el nivel, la
 * celda y lo que hay al lado escritos en el mensaje.
 */

/** Los dos, y son dos (`CTR-16.3`). */
export type IdPersonaje = 'skayboy' | 'poligirl';

/**
 * El enum de `tipo` de la leyenda (`CTR-16.4`, enmendado por `CTR-16.10`): diez.
 *
 * **No hay `letal` ni `mata`**: `FIND-58` los sacó y `UX-29 §7.2` dice por qué — el terreno
 * ajeno no lastima, devuelve a la entrada. Es el molinete otra vez. Un `letal` acá termina
 * siendo una clase de CSS y, tarde o temprano, una palabra en pantalla.
 *
 * **Tampoco hay `mecanismo`**: se partió en `palanca` y `placa`, porque la física las corre
 * distinto y la diferencia vivía en un booleano del arreglo (`sostenido`, que se fue con él).
 * Ahora lo dice la celda, que es lo que corre la física.
 */
export type TipoDeTerreno =
  | 'aire'
  | 'solido'
  | 'molinete'
  | 'tesoro'
  | 'entrada'
  | 'puerta'
  | 'palanca'
  | 'placa'
  | 'compuerta'
  | 'caja';

/** De qué es el molinete que devuelve a uno solo (`CTR-16.10`). Nombra el lugar, no a quién rechaza. */
export type Elemento = 'cielo' | 'infierno';

/**
 * Qué es un caracter de la grilla.
 *
 * `devuelve` es **la única** declaración de quién no pasa por dónde, y vive del lado del
 * terreno. Un campo gemelo en la ficha del personaje era `FIND-58`: dos lugares que dicen lo
 * mismo son un lugar donde se van a contradecir.
 */
export interface Terreno {
  readonly tipo: TipoDeTerreno;
  /** Solo en `molinete`: a quién devuelve a la entrada. Uno o los dos. */
  readonly devuelve?: readonly IdPersonaje[];
  /**
   * Solo en el molinete que devuelve a uno solo: `cielo` o `infierno` (`CTR-16.4` enmendado).
   * `C` es cielo e `I` infierno porque lo dice este campo, no la inicial. A quién rechaza lo
   * sigue diciendo `devuelve`, y eso es de `experiencia` (`UX-30 §3`).
   */
  readonly elemento?: Elemento;
  /** Solo en `tesoro`: quién lo puede juntar. */
  readonly para?: readonly IdPersonaje[];
  /** Solo en `entrada` y `puerta`: de quién es. */
  readonly de?: IdPersonaje;
}

export interface Personaje {
  readonly id: IdPersonaje;
  readonly atlas: string;
}

/**
 * Lo que el nivel escribe de una palanca o una placa (`CTR-16.10.1`): **con qué compuertas se
 * conecta, y nada más**. Cuál de las dos es lo dice la celda `en` de la grilla, y ningún otro
 * lugar (`sostenido` era ese segundo lugar, y se fue con `CTR-16.6` enmendado).
 */
export interface MecanismoDelNivel {
  readonly id: string;
  readonly en: readonly [number, number];
  /** Ids `COM-NN` de compuertas **de este nivel** (`E3`). */
  readonly abre: readonly string[];
}

/**
 * El nombre de una compuerta (`CTR-16.10.1`): un `id` y la celda de arriba de su tramo. Hasta
 * dónde llega lo dibuja la grilla. En el mundo, la compuerta viva es otra cosa —con su estado—,
 * y se llama `Compuerta` en `mundo.ts`.
 */
export interface CompuertaDelNivel {
  readonly id: string;
  readonly en: readonly [number, number];
}

/**
 * La pasada que se escribe a mano (`CTR-16.7`, versión 2): **dos personas a la vez, en un
 * teléfono, lo terminaron** (`BR-25` a, `BR-29` punto 1). La escribe el que jugó, no el que
 * dibujó.
 *
 * La otra pasada, la de uno, no vive acá: la prueba la traza grabada en cada build, para todo
 * nivel del banco (`CTR-18`, `soluciones.test.ts`). Por eso `solo` se retiró (`BR-29` punto 4,
 * `ADR-09.3`), y el schema no lo deja volver.
 */
export interface Verificaciones {
  readonly deDos: boolean;
}

export interface Nivel {
  readonly id: string;
  readonly nombre: string;
  readonly escalon: number;
  readonly estado: 'borrador' | 'listo';
  readonly grilla: readonly string[];
  readonly mecanismos: readonly MecanismoDelNivel[];
  /** Una entrada por tramo de compuerta. Obligatorio aunque vaya vacío (`CTR-16.10.9`). */
  readonly compuertas: readonly CompuertaDelNivel[];
  readonly verificaciones: Verificaciones;
}

export interface Banco {
  readonly contrato: string;
  readonly contratoVersion: number;
  readonly tile: number;
  readonly ancho: number;
  readonly alto: number;
  /** El tema que la cinta repite, o `null` mientras no esté elegido (`D-39`). */
  readonly temaFijo: string | null;
  readonly personajes: readonly Personaje[];
  readonly leyenda: Readonly<Record<string, Terreno>>;
  readonly niveles: readonly Nivel[];
}

/** Columna y fila en tiles, contadas desde arriba a la izquierda. */
export interface Posicion {
  readonly columna: number;
  readonly fila: number;
}

/**
 * Lo que la página le siembra al navegador: **solo los `listo`**, igual que `dos-ejes`
 * (`CTR-08`). Un `borrador` que se escapa al bundle es un nivel sin jugar en el teléfono de
 * alguien.
 */
export function nivelesListos(banco: Banco): readonly Nivel[] {
  return banco.niveles.filter((n) => n.estado === 'listo');
}

/** Dónde se está construyendo la página: la única pregunta que decide qué se siembra. */
export interface Entorno {
  /** `import.meta.env.DEV`: el servidor de desarrollo. */
  readonly desarrollo: boolean;
  /** `process.env.VERCEL_ENV` al construir: `'production'`, `'preview'` o nada. */
  readonly vercel?: string;
}

/**
 * Qué niveles le llegan al navegador. **En producción, solo los `listo`** (`nivelesListos`).
 * En desarrollo **y en las vistas previas de Vercel** —la de cada PR—, todos: un borrador
 * pasa a `listo` recién cuando alguien lo juega en un teléfono (`BR-25` a, `BR-29`), y para
 * jugarlo en un teléfono tiene que estar en una dirección que el teléfono pueda abrir. El
 * servidor de desarrollo no la tiene; la vista previa del PR sí.
 *
 * Lo que no cambia: la dirección de producción nunca sirve un borrador. Esa es la frase de
 * arriba y la que cuida el test.
 */
export function nivelesASembrar(banco: Banco, entorno: Entorno): readonly Nivel[] {
  return entorno.desarrollo || entorno.vercel === 'preview' ? banco.niveles : nivelesListos(banco);
}

/** Qué hay en esa celda, o `undefined` si la coordenada cae afuera de la sala. */
export function terrenoEn(banco: Banco, nivel: Nivel, en: Posicion): Terreno | undefined {
  const renglon = nivel.grilla[en.fila];
  if (renglon === undefined) return undefined;
  const caracter = renglon[en.columna];
  if (caracter === undefined) return undefined;
  return banco.leyenda[caracter];
}

/**
 * Si ese terreno devuelve a ese personaje a la entrada.
 *
 * Se lee de la leyenda y de ningún otro lado, que es todo el punto de `FIND-58`. Un terreno
 * que no es molinete no devuelve a nadie.
 */
export function devuelveA(terreno: Terreno | undefined, personaje: IdPersonaje): boolean {
  if (terreno === undefined || terreno.tipo !== 'molinete') return false;
  return (terreno.devuelve ?? []).includes(personaje);
}

/** Dónde está la entrada, o la puerta, de ese personaje. La busca por la leyenda. */
export function posicionDe(
  banco: Banco,
  nivel: Nivel,
  tipo: 'entrada' | 'puerta',
  personaje: IdPersonaje,
): Posicion | undefined {
  const caracteres = Object.entries(banco.leyenda)
    .filter(([, t]) => t.tipo === tipo && t.de === personaje)
    .map(([c]) => c);
  for (let fila = 0; fila < nivel.grilla.length; fila++) {
    const renglon = nivel.grilla[fila] ?? '';
    for (let columna = 0; columna < renglon.length; columna++) {
      const caracter = renglon[columna];
      if (caracter !== undefined && caracteres.includes(caracter)) return { columna, fila };
    }
  }
  return undefined;
}

/** Todas las celdas de la grilla que son de ese tipo, renglón por renglón. */
export function celdasDeTipo(banco: Banco, nivel: Nivel, tipo: TipoDeTerreno): Posicion[] {
  const celdas: Posicion[] = [];
  nivel.grilla.forEach((renglon, fila) => {
    for (let columna = 0; columna < renglon.length; columna++) {
      if (banco.leyenda[renglon[columna] ?? '']?.tipo === tipo) celdas.push({ columna, fila });
    }
  });
  return celdas;
}

/**
 * Un tramo de compuerta (`CTR-16.10.4`): una columna de celdas `compuerta` seguidas, con el
 * `id` de la entrada de `compuertas` que apunta a su celda de arriba. Si ninguna apunta ahí, el
 * id dice que no tiene (`E2` lo rechaza antes de que llegue al mundo).
 */
export interface TramoDeCompuerta {
  readonly id: string;
  readonly columna: number;
  readonly desdeFila: number;
  readonly hastaFila: number;
}

/**
 * Los tramos de compuerta del nivel, leídos de la grilla: **la grilla dibuja, el arreglo
 * nombra** (`CTR-16.10.1`). Columna por columna y de arriba abajo, que es un orden que no
 * depende de cómo esté escrito el arreglo. Lo usan tres: el mundo, que les da estado; las
 * reglas de abajo; y la cuenta de la paridad de `soluciones.ts`.
 */
export function tramosDeCompuertas(banco: Banco, nivel: Nivel): TramoDeCompuerta[] {
  const esCompuerta = (columna: number, fila: number): boolean =>
    terrenoEn(banco, nivel, { columna, fila })?.tipo === 'compuerta';
  const tramos: TramoDeCompuerta[] = [];
  const ancho = Math.max(0, ...nivel.grilla.map((renglon) => renglon.length));
  for (let columna = 0; columna < ancho; columna++) {
    for (let fila = 0; fila < nivel.grilla.length; fila++) {
      if (!esCompuerta(columna, fila) || esCompuerta(columna, fila - 1)) continue;
      let hasta = fila;
      while (esCompuerta(columna, hasta + 1)) hasta++;
      const nombre = nivel.compuertas.find((c) => c.en[0] === columna && c.en[1] === fila);
      tramos.push({ id: nombre?.id ?? `(sin id, [${columna}, ${fila}])`, columna, desdeFila: fila, hastaFila: hasta });
    }
  }
  return tramos;
}

/* =========================================================================================
   Las reglas del banco
   ========================================================================================= */

/** `[columna, fila]`, como se escribe en el dato. */
const celda = (columna: number, fila: number): string => `[${columna}, ${fila}]`;

/** Qué hay en una celda, dicho para un mensaje: el caracter y su tipo, o que es el borde. */
function queHay(banco: Banco, nivel: Nivel, columna: number, fila: number): string {
  const caracter = nivel.grilla[fila]?.[columna];
  if (caracter === undefined) return 'el borde de la sala';
  const tipo = banco.leyenda[caracter]?.tipo;
  return tipo === undefined ? `«${caracter}»` : `«${caracter}» (${tipo})`;
}

/** Sólido o el borde de la sala: lo único que ancla (`E4`) y lo único donde se para una entrada (`E8`). */
function solidoOBorde(banco: Banco, nivel: Nivel, columna: number, fila: number): boolean {
  const t = terrenoEn(banco, nivel, { columna, fila });
  return t === undefined || t.tipo === 'solido';
}

/**
 * `E1` a `E6` y `E8` de `CTR-16.10.10` para un nivel. `E6` mira el banco entero y va aparte.
 * Cada mensaje trae el número de la regla al final, para que el que lee sepa a qué párrafo del
 * contrato ir.
 */
function problemasDeLaSala(banco: Banco, nivel: Nivel): string[] {
  const problemas: string[] = [];
  const n = nivel.id;
  const tipoEn = (columna: number, fila: number): TipoDeTerreno | undefined =>
    terrenoEn(banco, nivel, { columna, fila })?.tipo;

  // E1: cada mecanismo cae en una palanca o una placa, y cada una de esas tiene exactamente uno.
  for (const m of nivel.mecanismos) {
    const [columna, fila] = m.en;
    const tipo = tipoEn(columna, fila);
    if (tipo !== 'palanca' && tipo !== 'placa') {
      problemas.push(
        `${n}: ${m.id} está en ${celda(columna, fila)}, donde hay ${queHay(banco, nivel, columna, fila)}, ` +
          'y un mecanismo va en una palanca o una placa (E1)',
      );
    }
  }
  for (const tipo of ['palanca', 'placa'] as const) {
    for (const { columna, fila } of celdasDeTipo(banco, nivel, tipo)) {
      const cuantos = nivel.mecanismos.filter((m) => m.en[0] === columna && m.en[1] === fila).length;
      if (cuantos !== 1) {
        problemas.push(
          `${n}: la ${tipo} de ${celda(columna, fila)} tiene ${cuantos} mecanismos en «mecanismos», y tiene que tener uno (E1)`,
        );
      }
    }
  }

  // E2: cada tramo tiene exactamente una entrada en `compuertas`, en su celda de arriba; ninguna
  // entrada apunta a otra cosa.
  const tramos = tramosDeCompuertas(banco, nivel);
  for (const t of tramos) {
    const cuantas = nivel.compuertas.filter((c) => c.en[0] === t.columna && c.en[1] === t.desdeFila).length;
    if (cuantas !== 1) {
      problemas.push(
        `${n}: el tramo de compuerta de la columna ${t.columna} (filas ${t.desdeFila} a ${t.hastaFila}) tiene ` +
          `${cuantas} entradas en «compuertas» con «en» ${celda(t.columna, t.desdeFila)}, y tiene que tener una (E2)`,
      );
    }
  }
  for (const c of nivel.compuertas) {
    const [columna, fila] = c.en;
    if (!tramos.some((t) => t.columna === columna && t.desdeFila === fila)) {
      problemas.push(
        `${n}: ${c.id} apunta a ${celda(columna, fila)}, donde hay ${queHay(banco, nivel, columna, fila)}, ` +
          'y no es la celda de arriba de ningún tramo de compuerta (E2)',
      );
    }
  }

  // E3: ids únicos; cada `abre` nombra una compuerta de este nivel; toda compuerta la abre alguien.
  for (const [cuales, ids] of [
    ['mecanismos', nivel.mecanismos.map((m) => m.id)],
    ['compuertas', nivel.compuertas.map((c) => c.id)],
  ] as const) {
    const repetidos = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
    for (const id of repetidos) problemas.push(`${n}: ${id} está dos veces en «${cuales}», y los ids no se repiten dentro del nivel (E3)`);
  }
  const deEsteNivel = new Set(nivel.compuertas.map((c) => c.id));
  for (const m of nivel.mecanismos) {
    for (const id of m.abre) {
      if (!deEsteNivel.has(id)) problemas.push(`${n}: ${m.id} abre ${id}, que no es una compuerta de este nivel (E3)`);
    }
  }
  for (const c of nivel.compuertas) {
    if (!nivel.mecanismos.some((m) => m.abre.includes(c.id))) {
      problemas.push(`${n}: ${c.id} no la abre ningún mecanismo: es una pared disfrazada de puerta (E3)`);
    }
  }

  // E4: la compuerta va de sólido a sólido; palanca y placa, con sólido abajo.
  for (const t of tramos) {
    if (!solidoOBorde(banco, nivel, t.columna, t.desdeFila - 1)) {
      problemas.push(
        `${n}: arriba del tramo de compuerta de ${celda(t.columna, t.desdeFila)} hay ` +
          `${queHay(banco, nivel, t.columna, t.desdeFila - 1)}, y tiene que haber sólido o el borde: ` +
          'abrirla le sacaría el piso al que esté parado encima (E4)',
      );
    }
    if (!solidoOBorde(banco, nivel, t.columna, t.hastaFila + 1)) {
      problemas.push(
        `${n}: abajo del tramo de compuerta de ${celda(t.columna, t.hastaFila)} hay ` +
          `${queHay(banco, nivel, t.columna, t.hastaFila + 1)}, y tiene que haber sólido o el borde (E4)`,
      );
    }
  }
  for (const tipo of ['palanca', 'placa'] as const) {
    for (const { columna, fila } of celdasDeTipo(banco, nivel, tipo)) {
      if (!solidoOBorde(banco, nivel, columna, fila + 1)) {
        problemas.push(
          `${n}: abajo de la ${tipo} de ${celda(columna, fila)} hay ${queHay(banco, nivel, columna, fila + 1)}, ` +
            'y tiene que haber sólido o el borde (E4)',
        );
      }
    }
  }

  // E5: toda caja arranca apoyada.
  for (const { columna, fila } of celdasDeTipo(banco, nivel, 'caja')) {
    if (!solidoOBorde(banco, nivel, columna, fila + 1) && tipoEn(columna, fila + 1) !== 'caja') {
      problemas.push(
        `${n}: la caja de ${celda(columna, fila)} arranca en el aire: abajo hay ` +
          `${queHay(banco, nivel, columna, fila + 1)}, y tiene que haber sólido, otra caja o el borde (E5)`,
      );
    }
  }

  // E8, que es la regla 3 de CTR-16.5: cada entrada tiene dónde pararse.
  for (const { columna, fila } of celdasDeTipo(banco, nivel, 'entrada')) {
    const de = terrenoEn(banco, nivel, { columna, fila })?.de;
    const quien = de ?? 'nadie';
    if (!solidoOBorde(banco, nivel, columna, fila + 1)) {
      problemas.push(
        `${n}: la entrada de ${quien} (${celda(columna, fila)}) no tiene dónde pararse: abajo hay ` +
          `${queHay(banco, nivel, columna, fila + 1)}, y tiene que haber sólido o el borde (CTR-16.5 regla 3, E8)`,
      );
    }
    const arriba = terrenoEn(banco, nivel, { columna, fila: fila - 1 });
    if (fila === 0) {
      problemas.push(
        `${n}: la entrada de ${quien} (${celda(columna, fila)}) está en la fila 0, y el cuerpo mide 20 px ` +
          'nativos: asoma 4 por arriba de la sala (CTR-16.5 regla 3, E8)',
      );
    } else if (arriba?.tipo === 'solido' || (de !== undefined && devuelveA(arriba, de))) {
      problemas.push(
        `${n}: arriba de la entrada de ${quien} (${celda(columna, fila)}) hay ${queHay(banco, nivel, columna, fila - 1)}, ` +
          'y el cuerpo mide 20 px nativos: asoma 4 en esa celda (CTR-16.5 regla 3, E8)',
      );
    }
  }

  return problemas;
}

/**
 * `E6`: **en Difícil no entra un mecanismo que no se haya enseñado antes** (la regla del último
 * escalón, `PRD-skayboy-y-poligirl.md`, "Qué enseña cada escalón"). Un nivel de escalón 3 no
 * usa ningún `tipo` que no aparezca en algún nivel de escalón menor del mismo banco.
 */
function problemasDelUltimoEscalon(banco: Banco): string[] {
  const tiposDe = (nivel: Nivel): Set<TipoDeTerreno> => {
    const tipos = new Set<TipoDeTerreno>();
    for (const renglon of nivel.grilla) {
      for (const caracter of renglon) {
        const t = banco.leyenda[caracter];
        if (t !== undefined) tipos.add(t.tipo);
      }
    }
    return tipos;
  };
  const antes = new Set<TipoDeTerreno>();
  for (const nivel of banco.niveles) if (nivel.escalon < 3) for (const t of tiposDe(nivel)) antes.add(t);
  const problemas: string[] = [];
  for (const nivel of banco.niveles) {
    if (nivel.escalon !== 3) continue;
    for (const tipo of tiposDe(nivel)) {
      if (!antes.has(tipo)) {
        problemas.push(
          `${nivel.id} (escalón 3) usa «${tipo}», que no aparece en ningún nivel de escalón menor: ` +
            'en Difícil no entra nada que no se haya enseñado antes (E6)',
        );
      }
    }
  }
  return problemas;
}

/**
 * Las reglas de `CTR-16.5` y de `CTR-16.10.10` que un schema no puede correr, devueltas como
 * una lista de problemas en castellano. Vacía quiere decir que el banco está sano.
 *
 * Las dos primeras se miden contra el propio dato: que la grilla mida `alto` renglones de
 * `ancho` caracteres, y que **todo caracter que aparezca esté declarado en la leyenda**. Un
 * caracter sin declarar no es un error de tipeo inofensivo: es un tile que el motor va a
 * pintar como aire, y una pared que desaparece el día que alguien la dibuje.
 *
 * Después, las de la sala (`E1` a `E6` y `E8`): miran celdas vecinas y cruzan la grilla con los
 * arreglos, que es justo lo que JSON Schema no sabe hacer. `E7` —cielo e infierno— vive en
 * `esquemas.test.ts`, adentro de la cuenta de los tres molinetes, porque es de la leyenda y no
 * de un nivel.
 */
export function problemasDelBanco(banco: Banco): readonly string[] {
  const problemas: string[] = [];
  for (const nivel of banco.niveles) {
    if (nivel.grilla.length !== banco.alto) {
      problemas.push(
        `${nivel.id}: la grilla trae ${nivel.grilla.length} renglones y el alto es ${banco.alto}`,
      );
    }
    nivel.grilla.forEach((renglon, fila) => {
      if (renglon.length !== banco.ancho) {
        problemas.push(
          `${nivel.id}, renglón ${fila}: mide ${renglon.length} caracteres y el ancho es ${banco.ancho}`,
        );
      }
      for (const caracter of renglon) {
        if (banco.leyenda[caracter] === undefined) {
          problemas.push(`${nivel.id}, renglón ${fila}: «${caracter}» no está en la leyenda`);
        }
      }
    });
    problemas.push(...problemasDeLaSala(banco, nivel));
  }
  problemas.push(...problemasDelUltimoEscalon(banco));
  return problemas;
}
