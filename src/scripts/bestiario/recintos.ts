/**
 * La vida de los recintos del bestiario (`D-73`): cómo se mueve cada escena de noche y qué hace
 * cada títere cuando lo tocan. La usan las dos islas: el bestiario (`scripts/bestiario.ts`), con
 * los recintos uno detrás del otro, y el camino (`scripts/camino.ts`), que muestra cada escena a
 * pantalla completa (`D-77`).
 *
 * Cada controlador recibe la raíz de su escena (el `<svg>` del recinto, o el grupo que la lleva
 * adentro del camino) y un contexto con lo que es de la isla: cómo se cuelga un bocadillo, el
 * reloj y si hay que quedarse quieto. Las coordenadas que pasa a `hablar` son las de la escena.
 *
 * Solo números, como las islas: la geometría vive en `rig.ts` y `recortes.ts`, nunca en los
 * módulos que dibujan (`camino.test.ts` lo vigila).
 */

import {
  BAJO, BARBAZUL, BARBAZUL_ARMADO, CHAPA, DRACULA, DRACULA_ARMADO, LIMON, LIMON_ARMADO, LINTERNAS, LUZBELITO as LUZ, MOMO as MOMO_ESC, PIERRE, PIERRE_ARMADO, PRISION,
} from '../../lib/bestiario/rig.ts';
import { ARMADO } from '../../lib/bestiario/recortes.ts';
import { girar, hacia, parpado, partes, suave } from './articular.ts';
import { armarPastura } from './pastura.ts';
import { armarAtila } from './atila.ts';
import { conElenco } from './vivos.ts';

/** La raíz de una escena: el `<svg>` del recinto, o el grupo que la lleva adentro del camino. */
export type Raiz = SVGSVGElement | SVGGElement;

/** Lo que cada isla le presta a la escena. */
export interface Contexto {
  /** El bicho tocado dice su verso: el punto va en coordenadas de la escena; `abajo` lo cuelga debajo. */
  hablar(id: string, x: number, y: number, abajo?: boolean): void;
  quieto(): boolean;
  reloj(): number;
  /** El ancho de la escena, en sus unidades: por ahí salen los fierros de la ruta. */
  ancho: number;
}

/** Lo que hace una escena viva. */
export interface Vida {
  /** Avanza un cuadro. `t` en segundos, `dt` lo que pasó desde el anterior. */
  mover(t: number, dt: number): void;
  /** Lo tocaron: la bestia de ese id reacciona. */
  reaccionar(id: string, t: number): void;
}

/* ------------------------------------------------------------------
   Los bichos del mapa, en su recinto: respiran, se balancean, saltan
   ------------------------------------------------------------------ */

interface Pieza {
  g: SVGGElement;
  cuerpo: SVGGElement;
  x: number;
  y: number;
  pie: number;
  semilla: number;
  saltoDesde: number;
  proximoSalto: number;
}

function piezas(raiz: ParentNode): Pieza[] {
  return [...raiz.querySelectorAll<SVGGElement>('.bestia')].map((g, i) => {
    const toque = g.querySelector('circle.toque');
    const r = toque ? Number(toque.getAttribute('r')) : 20;
    return {
      g,
      cuerpo: g.querySelector<SVGGElement>('.cuerpo')!,
      x: Number(g.dataset.x),
      y: Number(g.dataset.y),
      pie: Number(g.dataset.y) + r * 0.9,
      semilla: i * 1.7 + (g.dataset.id?.length ?? 0),
      saltoDesde: -10,
      proximoSalto: 3 + ((i * 2.3) % 7),
    };
  });
}

/** Un saltito: medio segundo de parábola. */
const salto = (p: Pieza, t: number): number => {
  const s = (t - p.saltoDesde) / 0.45;
  return s >= 0 && s <= 1 ? -9 * 4 * s * (1 - s) : 0;
};

function vivir(p: Pieza, t: number, extra = ''): void {
  if (p.g.classList.contains('bestia--ojos')) {
    // Unos ojos en lo oscuro no saltan: parpadean, y a veces se corren un poco.
    const ciclo = (t + p.semilla * 1.9) % (4 + (p.semilla % 3));
    const cerrados = ciclo < 0.16 || (t - p.saltoDesde > 0 && t - p.saltoDesde < 0.5) ? 0.1 : 1;
    const corre = Math.sin(t * 0.35 + p.semilla) * 3;
    p.cuerpo.setAttribute('transform', `${extra}translate(${corre.toFixed(2)} 0) translate(${p.x} ${p.y}) scale(1 ${cerrados}) translate(${-p.x} ${-p.y})`);
    return;
  }
  if (t > p.proximoSalto) {
    p.saltoDesde = t;
    p.proximoSalto = t + 5 + ((p.semilla * 3.1) % 8);
  }
  const respira = Math.sin(t * 2.1 + p.semilla) * 1.2;
  const balanceo = Math.sin(t * 1.3 + p.semilla * 0.7) * 2.2;
  p.cuerpo.setAttribute(
    'transform',
    `${extra}translate(0 ${(respira + salto(p, t)).toFixed(2)}) rotate(${balanceo.toFixed(2)} ${p.x} ${p.pie.toFixed(1)})`,
  );
}

function recintoDeMapa(svg: Raiz, ctx: Contexto): Vida {
  const lista = piezas(svg);
  return {
    mover: (t) => lista.forEach((p) => vivir(p, t)),
    reaccionar: (id, t) => {
      const p = lista.find((x) => x.g.dataset.id === id);
      if (p) p.saltoDesde = t;
    },
  };
}

/**
 * La ruta (`D-73`, décima vuelta): los fierros pasan, cada uno a la velocidad de su carril, salen
 * por la derecha y vuelven a entrar por la izquierda; traquetean un poco y, tocados, pegan un salto.
 * Lo que espera en la banquina (`data-quieto`) no se mueve con el tránsito: vive como en cualquier
 * recinto. Todos dan la misma vuelta, así los del mismo carril nunca se pasan por encima.
 */
const VUELTA_DE_LA_RUTA = 480;

function recintoDeRuta(svg: Raiz, ctx: Contexto): Vida {
  const lista = piezas(svg);
  const ancho = ctx.ancho;
  return {
    mover: (t) =>
      lista.forEach((p) => {
        if (p.g.dataset.quieto !== undefined) {
          vivir(p, t);
          return;
        }
        const velocidad = Number(p.g.dataset.velocidad);
        const x = ((p.x + t * velocidad + VUELTA_DE_LA_RUTA) % (ancho + VUELTA_DE_LA_RUTA * 2)) - VUELTA_DE_LA_RUTA;
        const traqueteo = Math.sin(t * 11 + p.semilla) * 0.7 + salto(p, t) * 0.6;
        p.cuerpo.setAttribute('transform', `translate(${(x - p.x).toFixed(1)} ${traqueteo.toFixed(2)})`);
        p.g.dataset.ahora = x.toFixed(1);
      }),
    reaccionar: (id, t) => {
      const p = lista.find((x) => x.g.dataset.id === id);
      if (p) p.saltoDesde = t;
    },
  };
}

/* ------------------------------------------------------------------
   Los títeres: el lobo suelto y el cordero atado, recortados de las tapas
   ------------------------------------------------------------------ */

/**
 * El recinto del monte: los ojos del monte respiran como en los otros recintos, y el lobo y el
 * cordero viven en la pastura (`bestiario/pastura.ts`, que comparte con el camino con cruces).
 */
function recintoDelMonte(svg: Raiz, ctx: Contexto): Vida {
  const deMapa = recintoDeMapa(svg, ctx);
  const pastura = armarPastura(svg, { marco: svg, hablar: (id, x, y) => ctx.hablar(id, x, y), quieto: ctx.quieto, reloj: ctx.reloj });
  return {
    mover: (t, dt) => {
      deMapa.mover(t, dt);
      pastura.mover(t, dt);
    },
    reaccionar: (id, t) => {
      if (!pastura.reaccionar(id, t)) deMapa.reaccionar(id, t);
    },
  };
}

/* ------------------------------------------------------------------
   Los protagonistas de tapa de los otros recintos: el perro, Luzbelito y Momo
   ------------------------------------------------------------------ */

/**
 * El perro de *Un baión*, en el borde del baldío: sigue ahí, y de a ratos ladra. Arriba, por la
 * medianera, anda el negro Atila (`bestiario/atila.ts`).
 */
function recintoDelPerro(svg: Raiz, ctx: Contexto): Vida {
  const deMapa = recintoDeMapa(svg, ctx);
  const atila = armarAtila(svg, ctx);
  const g = svg.querySelector<SVGGElement>('.titere--perro')!;
  const p = partes(g);
  const base = g.getAttribute('transform') ?? '';
  const AP = ARMADO.perro;
  let ladraDesde = -10;
  let ladridos = 0;
  let proximo = 2.5;

  function pintar(t: number): void {
    if (t > proximo) {
      ladraDesde = t;
      ladridos = 2 + Math.floor(Math.random() * 2);
      proximo = t + 4 + Math.random() * 4;
    }
    // Cada ladrido es una abierta y cerrada de la mandíbula, de un cuarto de segundo.
    const s = (t - ladraDesde) / 0.26;
    const abre = s >= 0 && s < ladridos ? Math.sin((s % 1) * Math.PI) : 0;
    girar(p.get('mandibula'), abre * 16, AP.mandibula);
    girar(p.get('cabeza'), -abre * 3 + Math.sin(t * 1.1) * 0.8, AP.cabeza);
    // Respira y se asoma un poco más o un poco menos, sin dejar el borde.
    const asoma = Math.sin(t * 0.45) * 8 + abre * 4;
    g.setAttribute('transform', `translate(${asoma.toFixed(1)} ${(Math.sin(t * 1.9) * 1.5).toFixed(1)}) ${base}`);
  }

  const tocar = (): void => {
    ladraDesde = ctx.reloj();
    ladridos = 3;
    if (ctx.quieto()) pintar(ctx.reloj());
    ctx.hablar('ese-perro-que-sigue-alli', 150, 300);
  };
  g.addEventListener('click', tocar);
  g.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      tocar();
    }
  });
  pintar(0);
  return {
    mover: (t, dt) => {
      deMapa.mover(t, dt);
      pintar(t);
      atila.mover(t, dt);
    },
    reaccionar: (id, t) => {
      if (id === 'ese-perro-que-sigue-alli') {
        ladraDesde = t;
        ladridos = 3;
      } else if (!atila.reaccionar(id, t)) deMapa.reaccionar(id, t);
    },
  };
}

/**
 * El baldío entero (`D-73`, décima vuelta): el perro en su borde, y Limón por las chapas. Por los
 * techos viene el bloque: una linterna asoma de un lado y barre los techos, Limón la ve y sale
 * corriendo para la otra punta, con la luz atrás. Allá se para a jadear y mira para atrás; la luz
 * se apaga, y al rato el bloque asoma del otro lado. Tocado, pega un salto.
 */
function recintoDelBaldio(svg: Raiz, ctx: Contexto): Vida {
  const perro = recintoDelPerro(svg, ctx);
  const g = svg.querySelector<SVGGElement>('.titere--limon')!;
  const p = partes(g);
  const A = LIMON_ARMADO;
  const luz = {
    der: svg.querySelector<SVGGElement>('.baldio-linterna[data-lado="der"]')!,
    izq: svg.querySelector<SVGGElement>('.baldio-linterna[data-lado="izq"]')!,
  };
  const brillo = { der: 0.85, izq: 0 };
  const angulo = { der: (LINTERNAS.der.barre[0] + LINTERNAS.der.barre[1]) / 2, izq: (LINTERNAS.izq.barre[0] + LINTERNAS.izq.barre[1]) / 2 };

  let x = (LIMON.desde + LIMON.hasta) / 2;
  /** De qué lado viene el bloque. Limón corre para el otro. */
  let bloque: 'der' | 'izq' = 'der';
  let estado: 've' | 'corre' | 'jadea' = 've';
  let desde = 0;
  let fase = 0;
  let saltoDesde = -10;
  let parpadeo = 2.5;

  const meta = (): number => (bloque === 'der' ? LIMON.desde : LIMON.hasta);

  function pintar(t: number, dt: number): void {
    const enEstado = t - desde;
    if (estado === 've' && enEstado > 1.5) [estado, desde] = ['corre', t];
    if (estado === 'corre') {
      const dir = Math.sign(meta() - x);
      x = hacia(x, meta(), LIMON.velocidad * dt);
      fase += (dt * LIMON.velocidad) / 26;
      if (x === meta() || dir === 0) [estado, desde] = ['jadea', t];
    }
    if (estado === 'jadea' && enEstado > 3.4) {
      bloque = bloque === 'der' ? 'izq' : 'der';
      [estado, desde] = ['ve', t];
    }

    // Para dónde mira: en 've' para la luz que viene; corriendo y jadeando, para donde va.
    const deLaLuz = bloque === 'der' ? 1 : -1;
    const frente = estado === 've' ? deLaLuz : -deLaLuz;
    const corre = estado === 'corre';
    const jadea = estado === 'jadea';

    // El salto: dos tercios de segundo de parábola, con las piernas recogidas.
    const s = (t - saltoDesde) / 0.66;
    const vuela = s >= 0 && s <= 1;
    const alto = vuela ? -4 * 70 * s * (1 - s) : 0;
    const paso = Math.sin(fase);
    const zancada = corre ? paso * 40 : jadea ? 9 : 0;
    // Con las piernas abiertas la cadera baja, así las zapatillas no se despegan de la chapa; y en
    // el medio del paso, con una pierna derecha, pega el saltito de la carrera.
    const pisa = A.pierna * (1 - Math.cos((zancada * Math.PI) / 180));
    const bote = corre ? pisa - Math.abs(Math.cos(fase)) * 5 : jadea ? pisa + Math.sin(t * 9) * 1.4 : Math.sin(t * 2.2) * 1;

    girar(p.get('pierna-1'), vuela ? -48 : jadea ? -zancada : zancada, [0, 0]);
    girar(p.get('pierna-2'), vuela ? 34 : jadea ? zancada : -zancada, [0, 0]);
    girar(p.get('brazo-1'), vuela ? -150 : corre ? -paso * 50 : jadea ? 18 : Math.sin(t * 2.2) * 4, [0, 0]);
    girar(p.get('brazo-2'), vuela ? 150 : corre ? paso * 50 : jadea ? -14 : -Math.sin(t * 2.2) * 4, [0, 0]);
    // Corriendo se inclina para adelante; jadeando se dobla un poco, con la cabeza gacha.
    const [, fy] = A.fruta.centro;
    girar(p.get('fruta'), corre ? 10 : jadea ? 6 + Math.sin(t * 9) * 1.5 : vuela ? -6 : Math.sin(t * 1.3) * 2, [0, fy + A.fruta.radio[1]]);
    girar(p.get('hoja'), corre ? -16 + Math.sin(fase * 2) * 14 : Math.sin(t * 2.6) * 6, A.cabito);

    // La boca: jadea abriéndose y cerrándose; corriendo, abierta; parado, a medias.
    const [bx, by] = (p.get('boca')?.dataset.pivote ?? '0 0').split(' ').map(Number) as [number, number];
    const abre = jadea ? 0.45 + Math.abs(Math.sin(t * 9)) * 0.55 : corre ? 0.85 + Math.sin(fase * 2) * 0.15 : 0.5;
    p.get('boca')?.setAttribute('transform', `translate(${bx} ${by}) scale(1 ${abre.toFixed(2)}) translate(${-bx} ${-by})`);

    // Los ojos: corriendo y jadeando mira para atrás, a la luz que lo sigue.
    const mira = estado === 've' ? 2 : -3.2;
    for (const i of [1, 2]) p.get(`pupila-${i}`)?.setAttribute('transform', `translate(${mira} ${jadea ? 1 : 0})`);
    if (t > parpadeo) parpadeo = t + 2.5 + Math.random() * 3;
    const cierra = parpadeo - t > 0 && parpadeo - t < 0.14 ? 1 : 0;
    parpado(p.get('parpado-1'), cierra);
    parpado(p.get('parpado-2'), cierra);

    g.setAttribute('transform', `translate(${x.toFixed(1)} ${(CHAPA.piso + bote + alto).toFixed(1)}) scale(${frente * LIMON.escala} ${LIMON.escala})`);

    // Las linternas: la del bloque se prende y lo busca; la otra se apaga.
    for (const lado of ['der', 'izq'] as const) {
      const L = LINTERNAS[lado];
      const prendida = lado === bloque && estado !== 'jadea';
      brillo[lado] = hacia(brillo[lado], prendida ? 0.85 : 0, dt * (prendida ? 1.4 : 0.7));
      const busca = (Math.atan2(CHAPA.piso - 50 - L.y, x - L.x) * 180) / Math.PI;
      const meta = Math.min(L.barre[1], Math.max(L.barre[0], busca + Math.sin(t * 1.7 + (lado === 'der' ? 0 : 2)) * 4));
      angulo[lado] = hacia(angulo[lado], meta, dt * 40);
      luz[lado].setAttribute('transform', `translate(${L.x} ${L.y}) rotate(${angulo[lado].toFixed(2)})`);
      luz[lado].setAttribute('opacity', brillo[lado].toFixed(2));
    }
  }

  const saltar = (t: number): void => {
    saltoDesde = t;
    // Si estaba viendo venir la luz, el susto lo larga a correr.
    if (estado === 've') [estado, desde] = ['corre', t];
  };
  const tocar = (): void => {
    saltar(ctx.reloj());
    if (ctx.quieto()) pintar(ctx.reloj(), 0);
    ctx.hablar('limon', x, CHAPA.piso - 124);
  };
  g.addEventListener('click', tocar);
  g.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      tocar();
    }
  });
  pintar(0, 0);
  return {
    mover: (t, dt) => {
      perro.mover(t, dt);
      pintar(t, dt);
    },
    reaccionar: (id, t) => {
      if (id === 'limon') saltar(t);
      else perro.reaccionar(id, t);
    },
  };
}

/** Luzbelito en su piedra: la llama titila, el resplandor la sigue, y el busto se mece apenas. */
function recintoDeLuzbelito(svg: Raiz, ctx: Contexto): Vida {
  const deMapa = recintoDeMapa(svg, ctx);
  const g = svg.querySelector<SVGGElement>('.titere--luzbelito')!;
  const p = partes(g);
  const luz = svg.querySelector<SVGGElement>('.luz-de-vela')!;
  const lx = Number(luz.dataset.x);
  const ly = Number(luz.dataset.y);
  const AL = ARMADO.luzbelito;
  let avivaHasta = -1;

  function pintar(t: number): void {
    const aviva = t < avivaHasta ? 1 : 0;
    // La llama: un temblor que no se repite, hecho de dos senos que no se encuentran.
    const temblor = Math.sin(t * 13) * 0.5 + Math.sin(t * 7.3) * 0.5;
    const alto = 1 + temblor * 0.12 + aviva * 0.6;
    const ladeo = Math.sin(t * 5.1) * 5;
    const [fx, fy] = [AL.llama[0], AL.llama[1] + 8];
    p.get('llama')?.setAttribute('transform', `translate(${fx} ${fy}) rotate(${ladeo.toFixed(1)}) scale(${(1 + aviva * 0.3).toFixed(2)} ${alto.toFixed(3)}) translate(${-fx} ${-fy})`);
    const brillo = 0.75 + temblor * 0.15 + aviva * 0.25;
    luz.setAttribute('transform', `translate(${lx} ${ly}) scale(${(0.9 + temblor * 0.08 + aviva * 0.35).toFixed(3)})`);
    luz.setAttribute('opacity', brillo.toFixed(2));
    girar(p.get('busto'), Math.sin(t * 0.6) * 1.4, AL.cuello);
  }

  const tocar = (): void => {
    avivaHasta = ctx.reloj() + 0.9;
    if (ctx.quieto()) pintar(ctx.reloj());
    ctx.hablar('luzbelito', LUZ.x, LUZ.y - 250 * LUZ.escala);
  };
  g.addEventListener('click', tocar);
  g.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      tocar();
    }
  });
  pintar(0);
  return {
    mover: (t, dt) => {
      deMapa.mover(t, dt);
      pintar(t);
    },
    reaccionar: (id, t) => {
      if (id === 'luzbelito') avivaHasta = t + 0.9;
      else deMapa.reaccionar(id, t);
    },
  };
}

/** El medallón de Momo cuelga de su cordón: se mece, le pasa un brillo, y tocado, gira. */
function recintoDeMomo(svg: Raiz, ctx: Contexto): Vida {
  const deMapa = recintoDeMapa(svg, ctx);
  const g = svg.querySelector<SVGGElement>('.titere--momo')!;
  const p = partes(g);
  const AM = ARMADO.momo;
  let giraDesde = -10;
  let empujon = 0;

  function pintar(t: number): void {
    // El péndulo, con el empujón del toque que se va apagando.
    const gira = (t - giraDesde) / 1.3;
    const amplitud = 4 + empujon * Math.exp(-(t - giraDesde) * 0.8);
    const angulo = Math.sin(t * 1.5) * amplitud;
    p.get('pendulo')?.setAttribute('transform', `rotate(${angulo.toFixed(2)} ${MOMO_ESC.cuelga.x} ${MOMO_ESC.cuelga.y})`);
    // El giro: el medallón se da vuelta como una moneda, una vez.
    const ancho = gira >= 0 && gira < 1 ? Math.cos(gira * Math.PI * 2) : 1;
    const [cx, cy] = AM.centro;
    p.get('medallon')?.setAttribute('transform', `translate(${cx} ${cy}) scale(${ancho.toFixed(3)} 1) translate(${-cx} ${-cy})`);
    // El brillo: cruza el medallón cada tanto, de izquierda a derecha.
    const pasada = (t % 4.5) / 1.2;
    const dx = pasada < 1 ? -420 + pasada * 840 : 600;
    p.get('brillo')?.setAttribute('transform', `translate(${(cx + dx).toFixed(1)} ${cy}) scale(1.6)`);
  }

  const tocar = (): void => {
    giraDesde = ctx.reloj();
    empujon = 10;
    if (ctx.quieto()) pintar(ctx.reloj());
    ctx.hablar('momo', MOMO_ESC.argolla.x, MOMO_ESC.argolla.y - 20);
  };
  g.addEventListener('click', tocar);
  g.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      tocar();
    }
  });
  pintar(0);
  return {
    mover: (t, dt) => {
      deMapa.mover(t, dt);
      pintar(t);
    },
    reaccionar: (id, t) => {
      if (id === 'momo') {
        giraDesde = t;
        empujon = 10;
      } else deMapa.reaccionar(id, t);
    },
  };
}


/* ------------------------------------------------------------------
   El gordo Pierre, en la sala inundada (sexta vuelta)
   ------------------------------------------------------------------ */

const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * Pierre flota con el agua y respira; cada tanto se empina la botella o se ríe solo. Tocado, se
 * ríe a carcajadas hasta que tose, que es lo que dice la letra: *"Cómo se ríe el gordo Pierre /
 * [...] y cómo tose el gordo Pierre"*. Cuando se sacude, la panza le hace ondas en el agua.
 * Mientras tanto el agua entra por el vidrio roto sin parar, y afuera llueve.
 */
function recintoDePierre(svg: Raiz, ctx: Contexto): Vida {
  const deMapa = recintoDeMapa(svg, ctx);
  const g = svg.querySelector<SVGGElement>('.titere--pierre')!;
  const entero = svg.querySelector<SVGGElement>('#pierre-entero')!;
  const p = partes(g);
  const reflejo = svg.querySelector<SVGGElement>('[data-parte="reflejo"]');
  const lluvia = svg.querySelector<SVGGElement>('[data-parte="lluvia"]');
  const chorros = [...svg.querySelectorAll<SVGPathElement>('.bajo-chorro')];
  const capas = new Map([...svg.querySelectorAll<SVGGElement>('.bajo-ondas-vivas')].map((c) => [c.dataset.onda ?? '', c]));
  const AP = PIERRE_ARMADO;
  const { x: px, agua, escala } = PIERRE;

  type Modo = 'quieto' | 'trago' | 'risa' | 'tos';
  let modo: Modo = 'quieto';
  let desde = 0;
  let dura = 0;
  let tosDespues = false;
  let proximo = 5;
  let parpadeo = 2.2;
  let proximaOnda = 0;
  let proximaGota = 0;

  function empezar(m: Modo, t: number, segundos: number): void {
    modo = m;
    desde = t;
    dura = segundos;
  }

  /**
   * Las ondas en el agua: anillos que se abren y se apagan, y se reciclan. Las de Pierre van
   * partidas en dos capas: la mitad de atrás pasa por detrás de él y la de adelante, por delante.
   */
  interface Onda { anillos: SVGEllipseElement[]; x: number; y: number; desde: number; vida: number; r0: number; r1: number }
  const pozos: Record<'pierre' | 'puerta', Onda[]> = { pierre: [], puerta: [] };
  function onda(cual: 'pierre' | 'puerta', x: number, y: number, t: number, r0: number, r1: number, vida: number): void {
    const pozo = pozos[cual];
    let o = pozo.find((w) => t - w.desde > w.vida);
    if (!o) {
      if (pozo.length >= 7) return;
      const anillos = (cual === 'pierre' ? ['pierre-atras', 'pierre'] : ['puerta']).map((n) => {
        const e = document.createElementNS(SVG_NS, 'ellipse');
        e.setAttribute('class', 'bajo-onda');
        capas.get(n)?.append(e);
        return e;
      });
      o = { anillos, x, y, desde: t, vida, r0, r1 };
      pozo.push(o);
    }
    Object.assign(o, { x, y, desde: t, vida, r0, r1 });
  }

  function pintarOndas(t: number): void {
    for (const o of [...pozos.pierre, ...pozos.puerta]) {
      const k = (t - o.desde) / o.vida;
      const rx = o.r0 + (o.r1 - o.r0) * suave(k);
      for (const e of o.anillos) {
        if (k < 0 || k > 1) {
          e.setAttribute('opacity', '0');
          continue;
        }
        e.setAttribute('cx', o.x.toFixed(1));
        e.setAttribute('cy', o.y.toFixed(1));
        e.setAttribute('rx', rx.toFixed(1));
        e.setAttribute('ry', (rx * 0.13).toFixed(1));
        e.setAttribute('opacity', ((1 - k) * 0.75).toFixed(2));
      }
    }
  }

  function pintar(t: number): void {
    // Lo que cambia según qué hace: la boca, la cabeza, el brazo, los ojos y el temblor.
    let boca = 0;
    let cabezaDy = 0;
    let cabezaGiro = Math.sin(t * 0.7) * 1.4;
    let cabezaSy = 1;
    let brazo = Math.sin(t * 0.5) * 2;
    let antebrazo = Math.sin(t * 0.8 + 1) * 1.5;
    let achina = 0;
    let sacude = 0;
    let encoge = 0;
    const k = dura ? (t - desde) / dura : 1;
    if (modo !== 'quieto' && k >= 1) {
      if (modo === 'risa' && tosDespues) {
        tosDespues = false;
        empezar('tos', t, 1.35);
      } else {
        modo = 'quieto';
        proximo = t + 6 + Math.random() * 6;
      }
    } else if (modo === 'trago') {
      // Levanta la botella, se la empina con la cabeza para atrás, traga dos veces y la baja.
      const sube = k < 0.3 ? suave(k / 0.3) : k < 0.72 ? 1 : 1 - suave((k - 0.72) / 0.28);
      const traga = k > 0.34 && k < 0.7 ? Math.max(0, Math.sin((k - 0.34) * Math.PI * 2 * 2.8)) : 0;
      brazo = AP.trago.brazo * sube;
      antebrazo = AP.trago.antebrazo * sube;
      cabezaDy = -7 * sube + traga * 2;
      cabezaGiro = -5 * sube;
      cabezaSy = 1 - 0.03 * sube;
      boca = 7 * sube;
      achina = 0.7 * sube;
    } else if (modo === 'risa') {
      // La carcajada: la boca se abre y se cierra a cuatro por segundo, la cabeza se va para
      // atrás, la panza tiembla al doble, y los ojos se achinan.
      const entra = Math.min(1, (t - desde) / 0.18, (desde + dura - t) / 0.25);
      const fase = (t - desde) * Math.PI * 2 * 4.4;
      boca = (5 + (0.5 + 0.5 * Math.sin(fase)) * 14) * entra;
      cabezaDy = -5 * entra + Math.sin(fase) * 1.5 * entra;
      cabezaGiro = (-3 + Math.sin(fase * 0.5) * 3) * entra;
      brazo = (-8 + Math.sin(fase) * 4) * entra;
      antebrazo = Math.sin(fase + 1) * 5 * entra;
      achina = 0.62 * entra;
      sacude = Math.sin(fase * 2) * 2 * entra;
      if (t > proximaOnda && !ctx.quieto()) {
        onda('pierre', px, agua + 2, t, 140 * escala, 270 * escala, 1.4);
        proximaOnda = t + 0.24;
      }
    } else if (modo === 'tos') {
      // Tres golpes de tos: se encoge, cierra los ojos, abre la boca y la cabeza se le va abajo.
      const u = ((t - desde) / (dura / 3)) % 1;
      const golpe = u < 0.28 ? suave(u / 0.28) : 1 - suave((u - 0.28) / 0.72);
      boca = 13 * golpe;
      cabezaDy = 9 * golpe;
      cabezaSy = 1 - 0.05 * golpe;
      cabezaGiro = 3 * golpe;
      brazo = 6 * golpe;
      antebrazo = -10 * golpe;
      achina = Math.max(0.6, golpe);
      encoge = golpe;
      if (u < 0.1 && t > proximaOnda && !ctx.quieto()) {
        onda('pierre', px, agua + 2, t, 150 * escala, 240 * escala, 1.1);
        proximaOnda = t + 0.3;
      }
    } else if (t > proximo && !ctx.quieto()) {
      // Solo: se empina la botella, o se ríe de algo que se acordó.
      if (Math.random() < 0.6) empezar('trago', t, 3.4);
      else empezar('risa', t, 1.3);
    }

    // Flota: sube y baja con el agua, y se mece apenas. El temblor de la risa va encima.
    const bob = Math.sin(t * 0.9) * 2.4 + sacude + encoge * 3;
    const mece = Math.sin(t * 0.6) * 0.7;
    entero.setAttribute('transform', `translate(${px} ${(agua + bob).toFixed(2)}) rotate(${mece.toFixed(2)}) scale(${escala})`);
    // Respira: la panza crece y se achica desde el agua; la cabeza y el brazo la siguen.
    const sy = 1 + Math.sin(t * 1.6) * 0.008 + sacude * 0.006 - encoge * 0.02;
    p.get('cuerpo')?.setAttribute('transform', `scale(1 ${sy.toFixed(4)})`);
    const [cx, cy] = AP.cuello;
    const alza = cy * (sy - 1);
    p.get('cabeza')?.setAttribute(
      'transform',
      `translate(0 ${(alza + cabezaDy).toFixed(2)}) rotate(${cabezaGiro.toFixed(2)} ${cx} ${cy}) translate(${cx} ${cy}) scale(1 ${cabezaSy.toFixed(3)}) translate(${-cx} ${-cy})`,
    );
    p.get('mandibula')?.setAttribute('transform', `translate(0 ${boca.toFixed(2)})`);
    girar(p.get('brazo'), brazo, AP.hombro, `translate(0 ${(AP.hombro[1] * (sy - 1)).toFixed(2)}) `);
    girar(p.get('antebrazo'), antebrazo, AP.codo);
    if (t > parpadeo + 0.16) parpadeo = t + 2.4 + Math.random() * 3.6;
    const ciego = t > parpadeo && t < parpadeo + 0.16 ? 1 : 0;
    parpado(p.get('parpado-1'), Math.max(ciego, achina));
    parpado(p.get('parpado-2'), Math.max(ciego, achina));

    // El reflejo se corre un poco de costado, como se corre en el agua que se mueve.
    reflejo?.setAttribute('transform', `translate(${(Math.sin(t * 1.3) * 2.2).toFixed(2)} 0)`);
    // La lluvia de afuera baja en diagonal, y el agua del agujero cae por la puerta.
    const cae = (t * 210) % 70;
    lluvia?.setAttribute('transform', `translate(${(-cae * 0.36).toFixed(1)} ${cae.toFixed(1)})`);
    chorros.forEach((c, i) => c.setAttribute('stroke-dashoffset', (-((t * (88 + i * 9)) % 17)).toFixed(1)));
    if (t > proximaGota && !ctx.quieto()) {
      onda('puerta', BAJO.agujero.x + 10 + (Math.random() - 0.5) * 24, BAJO.fondo + 3, t, 3, 26, 0.9);
      proximaGota = t + 0.35 + Math.random() * 0.3;
    }
    if (modo === 'quieto' && t > proximaOnda && !ctx.quieto()) {
      onda('pierre', px, agua + 2, t, 150 * escala, 230 * escala, 2.4);
      proximaOnda = t + 2 + Math.random() * 1.5;
    }
    pintarOndas(t);
  }

  function reirse(t: number): void {
    // Se ríe hasta que tose. Si ya se estaba riendo, sigue un rato más.
    if (modo === 'risa') dura = Math.max(dura, t - desde + 1.6);
    else empezar('risa', t, 2.4);
    tosDespues = true;
  }

  const tocar = (): void => {
    reirse(ctx.reloj());
    if (ctx.quieto()) {
      // Sin movimiento, queda la carcajada quieta: la boca abierta y los ojos achinados.
      p.get('mandibula')?.setAttribute('transform', 'translate(0 14)');
      parpado(p.get('parpado-1'), 0.62);
      parpado(p.get('parpado-2'), 0.62);
    }
    // Le cuelga de la papada, sobre la panza: que se le vea la cara mientras se ríe.
    ctx.hablar('el-gordo-pierre', px, agua - 150 * escala, true);
  };
  g.addEventListener('click', tocar);
  g.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      tocar();
    }
  });
  pintar(0);
  return {
    mover: (t, dt) => {
      deMapa.mover(t, dt);
      pintar(t);
    },
    reaccionar: (id, t) => {
      if (id === 'el-gordo-pierre') reirse(t);
      else deMapa.reaccionar(id, t);
    },
  };
}

/* ------------------------------------------------------------------
   Barbazul, el dueño de la prisión (undécima vuelta)
   ------------------------------------------------------------------ */

/** El ángulo de un vector, en grados. */
const angulo = (x: number, y: number): number => (Math.atan2(y, x) * 180) / Math.PI;
const vuelta = (a: number): number => ((((a + 180) % 360) + 360) % 360) - 180;

/**
 * Un brazo de dos tramos que lleva la mano a un punto: devuelve cuánto gira el brazo en el hombro
 * y cuánto gira el antebrazo adentro del brazo, que es como están anidados en la página. El codo
 * queda del lado más cerca de donde estaba (`antes`): arranca donde está cuando el brazo cuelga, y
 * de ahí en más sigue de cuadro en cuadro sin saltar a la otra solución.
 */
function alcanzar(
  [sx, sy]: readonly [number, number],
  [ex, ey]: readonly [number, number],
  [hx, hy]: readonly [number, number],
  [tx, ty]: readonly [number, number],
  [ax, ay]: readonly [number, number],
): { brazo: number; antebrazo: number; codo: [number, number] } {
  const l1 = Math.hypot(ex - sx, ey - sy);
  const l2 = Math.hypot(hx - ex, hy - ey);
  const d = Math.min(l1 + l2 - 1, Math.max(Math.abs(l1 - l2) + 1, Math.hypot(tx - sx, ty - sy)));
  const phi = Math.atan2(ty - sy, tx - sx);
  const alfa = Math.acos(Math.min(1, Math.max(-1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d))));
  const codos = [phi + alfa, phi - alfa].map((a) => [sx + Math.cos(a) * l1, sy + Math.sin(a) * l1] as const);
  const lejos = ([x, y]: readonly [number, number]): number => Math.hypot(x - ax, y - ay);
  const [cx, cy] = lejos(codos[0]!) < lejos(codos[1]!) ? codos[0]! : codos[1]!;
  const brazo = vuelta(angulo(cx - sx, cy - sy) - angulo(ex - sx, ey - sy));
  const absoluto = angulo(tx - cx, ty - cy) - angulo(hx - ex, hy - ey);
  return { brazo, antebrazo: vuelta(absoluto - brazo), codo: [cx, cy] };
}

/** Lo que cuelga (la barba, el manojo) sigue a su meta con retraso y se mece: un resorte con freno. */
interface Resorte {
  v: number;
  p: number;
}
function resorte(r: Resorte, meta: number, dt: number, rigidez: number, freno: number): number {
  r.v += ((meta - r.p) * rigidez - r.v * freno) * dt;
  r.p += r.v * dt;
  return r.p;
}

/**
 * Barbazul recibe en la entrada de su prisión, adelante a la izquierda. Respira, parpadea y mira
 * a la drácula cuando taconea por el pasillo, y de a ratos te mira a vos. Cada tanto se alisa la
 * barba con la mano, o sacude el manojo, que se mece colgado del puño. Tocado, **hace la
 * reverencia del anfitrión**: inclina la cabeza, se lleva la mano al pecho y con la otra te abre
 * el paso, manojo en mano, mirándote por debajo de las cejas. Y al fondo, detrás de él, la puerta
 * de su cuarto se entreabre sola: sale una luz roja que se derrama por el piso, y se cierra antes
 * de que él se enderece. Si la drácula está quieta, se da vuelta a mirarlo (`alSaludar`).
 */
function barbazulDeLaPrision(svg: Raiz, ctx: Contexto, laDracula: () => number, alSaludar: () => void): { pintar(t: number, dt: number): void; reverencia(t: number): void } {
  const g = svg.querySelector<SVGGElement>('.titere--barbazul')!;
  const entero = svg.querySelector<SVGGElement>('#barbazul-entero')!;
  const p = partes(g);
  const cuarto = svg.querySelector<SVGGElement>('[data-parte="cuarto"]');
  const hoja = svg.querySelector<SVGGElement>('[data-parte="hoja"]');
  const AB = BARBAZUL_ARMADO;
  const { x: bx, piso, escala } = BARBAZUL;

  /** La reverencia: se inclina en menos de un segundo, la sostiene, y se endereza. */
  const BAJA = 0.7;
  const SOSTIENE = 1.8;
  const SUBE = 0.9;
  let reverenciaDesde = -10;
  function inclinado(t: number): number {
    const u = t - reverenciaDesde;
    if (u < 0 || u > BAJA + SOSTIENE + SUBE) return 0;
    if (u < BAJA) return suave(u / BAJA);
    if (u < BAJA + SOSTIENE) return 1;
    return 1 - suave((u - BAJA - SOSTIENE) / SUBE);
  }
  /**
   * La puerta del cuarto: se abre un poco después de que él se inclina y se cierra de un golpe
   * antes de que se enderece. Tiene su propio arranque: si lo tocan de nuevo mientras está
   * inclinado, la reverencia se estira y la puerta sigue abierta, no vuelve a empezar.
   */
  let puertaDesde = -10;
  function entreabierta(t: number): number {
    const fin = reverenciaDesde + BAJA + SOSTIENE - 0.1;
    if (t < puertaDesde + 0.35 || t > fin) return 0;
    const abre = suave((t - puertaDesde - 0.35) / 0.8);
    const cierra = t > fin - 0.2 ? (fin - t) / 0.2 : 1;
    return Math.min(abre, cierra);
  }

  /** La mano que se alisa la barba: va al bigote (`k` sube), baja por la barba (`s` de 0 a 1) y vuelve. */
  const ALISA = 2.4;
  let alisaDesde = -10;
  function alisa(t: number): { k: number; s: number } {
    const u = (t - alisaDesde) / ALISA;
    if (u < 0 || u > 1) return { k: 0, s: 0 };
    const k = u < 0.25 ? suave(u / 0.25) : u < 0.78 ? 1 : 1 - suave((u - 0.78) / 0.22);
    return { k, s: suave((u - 0.25) / 0.5) };
  }

  let proximo = 4 + Math.random() * 3;
  let parpadeo = 2;
  // A quién mira: a la drácula (1) o a vos (0). Cambia cada tanto.
  let aElla = 1;
  let cambiaMirada = 3;
  let mirada = 0;
  const barba: Resorte = { v: 0, p: 0 };
  const manojo: Resorte = { v: 0, p: 0 };
  let cabezaAntes = 0;
  let brazoAntes = 0;
  let codo: [number, number] = [...BARBAZUL_ARMADO.codos[0]];

  function pintar(t: number, dt: number): void {
    const k = inclinado(t);
    if (!k && t > proximo && !ctx.quieto()) {
      if (Math.random() < 0.55) alisaDesde = t;
      // O sacude el manojo: un golpe de muñeca, y las llaves se mecen.
      else manojo.v += (Math.random() < 0.5 ? -1 : 1) * 150;
      proximo = t + 6 + Math.random() * 6;
    }

    // Respira, y en la reverencia se inclina hacia el pasillo, del lado del que te abre el paso.
    const respira = Math.sin(t * 1.15);
    entero.setAttribute('transform', `translate(${bx} ${(piso + respira * 0.6).toFixed(2)}) rotate(${(2.6 * k).toFixed(2)}) scale(${escala})`);

    // La mirada: a la drácula o a vos; en la reverencia, a vos, de abajo para arriba.
    if (t > cambiaMirada) {
      aElla = aElla ? 0 : 1;
      cambiaMirada = t + (aElla ? 5 + Math.random() * 4 : 2.5 + Math.random() * 2.5);
    }
    const haciaElla = Math.min(1, Math.max(-1, (laDracula() - bx) / 360));
    const meta = k ? 0 : aElla * haciaElla;
    mirada = dt ? hacia(mirada, meta, dt * 2.2) : meta;
    const [mx, my] = AB.mira;
    const pupila = `translate(${(mirada * mx).toFixed(2)} ${(-my * 0.9 * k + Math.sin(t * 0.4) * 0.3).toFixed(2)})`;
    p.get('pupila-1')?.setAttribute('transform', pupila);
    p.get('pupila-2')?.setAttribute('transform', pupila);
    if (t > parpadeo + 0.15) parpadeo = t + 2.8 + Math.random() * 3.6;
    const ciego = t > parpadeo && t < parpadeo + 0.15 ? 1 : 0;
    // Los párpados pesan, y en la reverencia bajan un poco más.
    parpado(p.get('parpado-1'), Math.max(ciego, 0.18 + 0.22 * k));
    parpado(p.get('parpado-2'), Math.max(ciego, 0.18 + 0.22 * k));

    // La cabeza sigue un poco la mirada; en la reverencia cabecea y se ladea hacia el pasillo.
    const [nx, ny] = AB.cuello;
    const ladea = mirada * 2.2 + Math.sin(t * 0.5) * 0.8 + 6 * k;
    p.get('cabeza')?.setAttribute('transform', `translate(${(4 * k).toFixed(2)} ${(16 * k).toFixed(2)}) rotate(${ladea.toFixed(2)} ${nx} ${ny})`);
    // La barba cuelga de la cara y llega tarde a cada movimiento de la cabeza: se mece.
    const giroCabeza = dt ? (ladea - cabezaAntes) / dt : 0;
    cabezaAntes = ladea;
    const [ax, ay] = AB.barba;
    const mece = dt ? resorte(barba, -ladea * 0.55 - giroCabeza * 0.04, dt, 30, 4.5) : -ladea * 0.55;
    p.get('barba')?.setAttribute('transform', `rotate(${mece.toFixed(2)} ${ax} ${ay})`);

    // La mano de la izquierda: colgando, alisando la barba, o en el pecho en la reverencia.
    const { k: ka, s } = alisa(t);
    const [h1, h2] = AB.hombros;
    const [c1, c2] = AB.codos;
    const [m1] = AB.manos;
    const { desde: ad, hasta: ah } = AB.alisa;
    const peso = Math.max(ka, k);
    const destino: readonly [number, number] = k >= ka ? [AB.pecho[0], AB.pecho[1] + 12 * k] : [ad[0] + (ah[0] - ad[0]) * s, ad[1] + (ah[1] - ad[1]) * s];
    const meta1: [number, number] = [m1[0] + (destino[0] - m1[0]) * peso, m1[1] + (destino[1] - m1[1]) * peso];
    const izq = peso > 0.001 ? alcanzar(h1, c1, m1, meta1, codo) : { brazo: Math.sin(t * 1.15) * 0.5, antebrazo: 0, codo: [...c1] as [number, number] };
    codo = izq.codo;
    girar(p.get('brazo-1'), izq.brazo, h1);
    girar(p.get('antebrazo-1'), izq.antebrazo, c1);
    // Mientras la mano baja por la barba, la tira para su lado; cuando la suelta, la barba se mece.
    if (dt && ka > 0.5 && s > 0 && s < 1) barba.v += 18 * dt;

    // La mano de la derecha, con el manojo: en la reverencia se abre hacia el pasillo; quieta, cuelga.
    const brazo2 = -40 * k + Math.sin(t * 1.15 + 1) * 0.6;
    const antebrazo2 = -24 * k;
    girar(p.get('brazo-2'), brazo2, h2);
    girar(p.get('antebrazo-2'), antebrazo2, c2);
    // El manojo cuelga derecho aunque el brazo gire, y se mece con cada movimiento del brazo.
    const giroBrazo = dt ? (brazo2 + antebrazo2 - brazoAntes) / dt : 0;
    brazoAntes = brazo2 + antebrazo2;
    const balanceo = dt ? resorte(manojo, -giroBrazo * 0.05, dt, 22, 2.6) : 0;
    girar(p.get('llaves'), -(brazo2 + antebrazo2) + balanceo, AB.llavero);

    // Al fondo, la puerta del cuarto: la hoja se achica contra su bisagra y sale la luz roja.
    const abre = entreabierta(t);
    if (hoja) {
      const hx = Number(hoja.dataset.bisagra);
      hoja.setAttribute('transform', `translate(${hx} 0) scale(${(1 - 0.78 * abre).toFixed(3)} 1) translate(${-hx} 0)`);
    }
    cuarto?.setAttribute('opacity', (abre * (0.92 + Math.sin(t * 9) * 0.04)).toFixed(2));
  }

  function reverencia(t: number): void {
    // Si ya está inclinado, sostiene la reverencia un rato más.
    const u = t - reverenciaDesde;
    if (u >= 0 && u < BAJA + SOSTIENE) reverenciaDesde = Math.max(reverenciaDesde, t - BAJA);
    else {
      reverenciaDesde = t;
      puertaDesde = t;
    }
    alisaDesde = -10;
    alSaludar();
  }

  const tocar = (): void => {
    reverencia(ctx.reloj());
    if (ctx.quieto()) {
      // Sin movimiento, queda en la reverencia, con la puerta del cuarto entreabierta.
      reverenciaDesde = ctx.reloj() - BAJA - 0.9;
      puertaDesde = reverenciaDesde;
      pintar(ctx.reloj(), 0);
    }
    // El bocadillo le cuelga de la barba, sobre el pecho: que se le vea la cara.
    ctx.hablar('barbazul', bx, piso - 330 * escala, true);
  };
  g.addEventListener('click', tocar);
  g.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      tocar();
    }
  });
  return { pintar, reverencia };
}

/* ------------------------------------------------------------------
   La drácula con tacones, en la prisión de Barbazul (octava vuelta)
   ------------------------------------------------------------------ */

/**
 * La drácula taconea por el pasillo de las celdas: camina un tramo, se para, mira, parpadea, y
 * vuelve a caminar; cada taco que apoya suena en el piso con dos cortes blancos. Tocada, abre la
 * capa como dos puertas de papel —la mitad negra se achica contra el hombro y del otro lado se
 * despliega el forro, rojo como las banderas de la ventana— y muestra los colmillos. Afuera, las
 * banderas de *Oktubre* flamean detrás de la reja, y la puerta de la jaula vacía de la fiera se
 * mece; tocada la jaula, chirría.
 */
function recintoDeLaPrision(svg: Raiz, ctx: Contexto): Vida {
  const deMapa = recintoDeMapa(svg, ctx);
  const g = svg.querySelector<SVGGElement>('.titere--dracula')!;
  const entera = svg.querySelector<SVGGElement>('#dracula-entera')!;
  const p = partes(g);
  const sombra = svg.querySelector<SVGEllipseElement>('[data-parte="sombra"]');
  const taco = svg.querySelector<SVGPathElement>('[data-parte="taco"]');
  const puerta = svg.querySelector<SVGGElement>('[data-parte="puerta-jaula"]');
  const banderas = [...svg.querySelectorAll<SVGGElement>('[data-bandera]')].map((b) => ({
    g: b,
    asta: (b.dataset.asta ?? '0 0').split(' ').map(Number) as [number, number],
    fase: Number(b.dataset.bandera) * 1.3,
  }));
  const AD = DRACULA_ARMADO;
  const { piso, escala, desde: izquierda, hasta: derecha } = DRACULA;

  type Modo = 'camina' | 'para' | 'abre';
  let modo: Modo = 'para';
  let x: number = DRACULA.x;
  let meta = x;
  let hasta = 2;
  let fase = 0;
  let abreDesde = -10;
  let parpadeo = 1.5;
  let tacoEn = -10;
  let tacoX = 0;
  let chirria = -10;
  let ultimoPaso = 0;
  // Quieta, hace una de dos: se acomoda la capa (asoma el forro) o mira para la ventana.
  let acomodaDesde = -10;
  let mira = 0;
  let mirando = 0;
  // El ctx.reloj() de las banderas: corre más rápido cuando sopla, sin saltar de fase.
  let soplo = 0;

  /** Cuánto está abierta la capa, de 0 a 1: se abre en medio segundo, se sostiene y se cierra. */
  const ABRE = 0.55;
  const SOSTIENE = 1.9;
  const CIERRA = 0.6;
  function abierta(t: number): number {
    const u = t - abreDesde;
    if (u < 0 || u > ABRE + SOSTIENE + CIERRA) return 0;
    if (u < ABRE) return suave(u / ABRE);
    if (u < ABRE + SOSTIENE) return 1;
    return 1 - suave((u - ABRE - SOSTIENE) / CIERRA);
  }

  /** Se acomoda la capa: la abre un poco y la cierra, en menos de un segundo. */
  function acomoda(t: number): number {
    const u = (t - acomodaDesde) / 0.9;
    return u < 0 || u > 1 ? 0 : Math.sin(Math.PI * u) * 0.34;
  }

  /** Una mitad de la capa: la negra se da vuelta contra el hombro y del otro lado aparece el forro. */
  function capa(n: 1 | 2, k: number, t: number, mece: number): void {
    const [hx, hy] = AD.hombros[n - 1];
    const lado = n === 1 ? -1 : 1;
    const c = Math.cos(k * Math.PI * 0.94);
    const negra = p.get(`capa-${n}`);
    const forro = p.get(`forro-${n}`);
    if (c > 0) {
      negra?.setAttribute('transform', `translate(${hx} ${hy}) rotate(${(mece * lado).toFixed(2)}) scale(${c.toFixed(3)} 1) translate(${-hx} ${-hy})`);
      forro?.setAttribute('transform', `translate(${hx} 0) scale(0.001 1) translate(${-hx} 0)`);
    } else {
      negra?.setAttribute('transform', `translate(${hx} 0) scale(0.001 1) translate(${-hx} 0)`);
      // Abierta, el ala sube un poco y flamea como las banderas de afuera.
      const sube = -lado * 6 * k;
      const flamea = Math.sin(t * 6.5 + n * 1.7) * 2.6 * k;
      forro?.setAttribute('transform', `translate(${hx} ${hy}) rotate(${sube.toFixed(2)}) skewY(${flamea.toFixed(2)}) scale(${(-c).toFixed(3)} 1) translate(${-hx} ${-hy})`);
    }
  }

  function pintar(t: number, dt: number): void {
    const k = abierta(t);
    const capaAbierta = Math.max(k, acomoda(t));
    if (modo === 'abre' && t - abreDesde > ABRE + SOSTIENE + CIERRA) {
      modo = 'para';
      hasta = t + 1.2;
    } else if (modo === 'para' && t > hasta && !ctx.quieto()) {
      // A otro lado del pasillo, lejos de donde está.
      let otra = izquierda + Math.random() * (derecha - izquierda);
      if (Math.abs(otra - x) < 140) otra = x < (izquierda + derecha) / 2 ? Math.min(derecha, x + 160 + Math.random() * 120) : Math.max(izquierda, x - 160 - Math.random() * 120);
      meta = otra;
      modo = 'camina';
      mira = 0;
    } else if (modo === 'camina') {
      const paso = Math.sign(meta - x) * Math.min(Math.abs(meta - x), 46 * dt);
      x += paso;
      fase += (Math.abs(paso) / 34) * Math.PI;
      // Cada vez que apoya un taco: el golpe en el piso.
      const pasos = Math.floor(fase / Math.PI);
      if (pasos !== ultimoPaso) {
        ultimoPaso = pasos;
        tacoEn = t;
        tacoX = x + (pasos % 2 ? 1 : -1) * 18 * escala;
      }
      if (Math.abs(meta - x) < 0.5) {
        modo = 'para';
        hasta = t + 1.8 + Math.random() * 2.2;
        if (Math.random() < 0.4) acomodaDesde = t + 0.5;
        else mira = x < (PRISION.ventana.x0 + PRISION.ventana.x1) / 2 ? 1 : -1;
        // Termina el paso con los dos pies juntos.
        fase = Math.round(fase / Math.PI) * Math.PI;
      }
    }

    // Las piernas: una adelante y otra atrás, como se camina en el teatro de papel; la que se
    // adelanta se levanta un poco. Quieta, las dos juntas.
    const andar = modo === 'camina' ? 1 : 0;
    const s = Math.sin(fase) * andar;
    const levanta = (lado: number): number => Math.max(0, Math.cos(fase) * lado) * 5 * andar;
    girar(p.get('pierna-1'), s * 7, AD.caderas[0], `translate(0 ${(-levanta(1)).toFixed(2)}) `);
    girar(p.get('pierna-2'), -s * 7, AD.caderas[1], `translate(0 ${(-levanta(-1)).toFixed(2)}) `);
    const rebota = -Math.abs(Math.sin(fase)) * 3 * andar + Math.sin(t * 1.3) * 0.8;
    const inclina = Math.sign(meta - x) * 1.4 * andar;
    entera.setAttribute('transform', `translate(${x.toFixed(1)} ${(piso + rebota).toFixed(2)}) rotate(${inclina.toFixed(2)}) scale(${escala})`);

    // La capa: cerrada se mece con el paso; tocada, se abre.
    const mece = Math.sin(fase) * 1.6 * andar + Math.sin(t * 0.9) * 0.4;
    capa(1, capaAbierta, t, mece);
    capa(2, capaAbierta, t, mece);
    p.get('mano')?.setAttribute('opacity', (1 - suave(capaAbierta / 0.2)).toFixed(2));

    // La cabeza: se ladea apenas; con la capa abierta se va para atrás, abre la boca y entorna los ojos.
    const [cx, cy] = AD.cuello;
    mirando = hacia(mirando, mira, dt * 1.6);
    const ladea = Math.sin(t * 0.55) * 1.6 - 4 * k + 5 * suave(Math.abs(mirando)) * Math.sign(mirando);
    const cabeza = `translate(0 ${(-2 * k).toFixed(2)}) rotate(${ladea.toFixed(2)} ${cx} ${cy})`;
    p.get('cabeza')?.setAttribute('transform', cabeza);
    p.get('pelo')?.setAttribute('transform', cabeza);
    p.get('mandibula')?.setAttribute('transform', `translate(0 ${(7 * k).toFixed(2)})`);
    if (t > parpadeo + 0.16) parpadeo = t + 2.6 + Math.random() * 3.4;
    const ciega = t > parpadeo && t < parpadeo + 0.16 ? 1 : 0;
    parpado(p.get('parpado-1'), Math.max(ciega, AD.entornados + 0.3 * k));
    parpado(p.get('parpado-2'), Math.max(ciega, AD.entornados + 0.3 * k));

    // La sombra en el piso, más ancha con las alas abiertas, y el golpe del taco.
    sombra?.setAttribute('cx', x.toFixed(1));
    sombra?.setAttribute('rx', (64 * escala * (1 + 1.6 * k)).toFixed(1));
    const golpe = 1 - (t - tacoEn) / 0.22;
    taco?.setAttribute('opacity', golpe > 0 ? golpe.toFixed(2) : '0');
    if (golpe > 0) taco?.setAttribute('transform', `translate(${tacoX.toFixed(1)} ${piso}) scale(${escala})`);

    // Afuera flamean las banderas, más fuerte cuando ella abre la capa; y la puerta de la jaula
    // se mece: tocada, chirría y va y viene.
    const viento = 1 + 1.6 * k;
    soplo += dt * viento;
    for (const b of banderas) {
      const [ax, ay] = b.asta;
      const rota = Math.sin(soplo * 1.6 + b.fase) * 2.6 * viento;
      const tuerce = Math.sin(soplo * 2.4 + b.fase * 1.7) * 5 * viento;
      b.g.setAttribute('transform', `translate(${ax} ${ay}) rotate(${rota.toFixed(2)}) skewY(${tuerce.toFixed(2)}) translate(${-ax} ${-ay})`);
    }
    if (puerta) {
      const bx = Number(puerta.dataset.bisagra);
      const u = t - chirria;
      const vaivien = u >= 0 && u < 4 ? Math.sin(u * 5.5) * 0.36 * Math.exp(-u * 1.1) : 0;
      const abre = 0.9 + Math.sin(t * 0.7) * 0.05 + vaivien;
      puerta.setAttribute('transform', `translate(${bx} 0) scale(${Math.min(1, Math.max(0.25, abre)).toFixed(3)} 1) translate(${-bx} 0)`);
    }
  }

  function abrirLaCapa(t: number): void {
    // Si ya la tiene abierta, la sostiene un rato más.
    if (modo === 'abre' && t - abreDesde < ABRE + SOSTIENE) abreDesde = Math.max(abreDesde, t - ABRE);
    else abreDesde = t;
    modo = 'abre';
  }

  const tocar = (): void => {
    abrirLaCapa(ctx.reloj());
    if (ctx.quieto()) {
      // Sin movimiento, queda abierta y quieta: las alas rojas, la boca abierta.
      abreDesde = ctx.reloj() - ABRE;
      pintar(ctx.reloj(), 0);
    }
    // El bocadillo le cuelga del mentón, sobre el pecho: que se le vea la cara.
    ctx.hablar('la-dracula-con-tacones', x, piso - 440 * escala, true);
  };
  g.addEventListener('click', tocar);
  g.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      tocar();
    }
  });
  // Barbazul, en la entrada: mira a la drácula por dónde va, y cuando saluda, ella lo mira a él.
  const barbazul = barbazulDeLaPrision(svg, ctx, () => x, () => {
    if (modo === 'para') {
      mira = -1;
      hasta = Math.max(hasta, ctx.reloj() + 2.5);
    }
  });
  pintar(0, 0);
  barbazul.pintar(0, 0);
  return {
    mover: (t, dt) => {
      deMapa.mover(t, dt);
      pintar(t, dt);
      barbazul.pintar(t, dt);
    },
    reaccionar: (id, t) => {
      if (id === 'la-dracula-con-tacones') abrirLaCapa(t);
      else if (id === 'barbazul') barbazul.reverencia(t);
      else if (id === 'la-fiera-mas-fiera') {
        chirria = t;
        if (ctx.quieto()) pintar(t + 0.3, 0);
      } else deMapa.reaccionar(id, t);
    },
  };
}


/** El controlador de cada recinto; los que no figuran viven como los bichos del mapa. */
const CONTROLADORES: Readonly<Record<string, (svg: Raiz, ctx: Contexto) => Vida>> = {
  'monte-pastura': recintoDelMonte,
  'los-techos': recintoDelBaldio,
  'el-infierno': recintoDeLuzbelito,
  'el-templo': recintoDeMomo,
  'el-bajo': recintoDePierre,
  'la-prision': recintoDeLaPrision,
  'la-ruta': recintoDeRuta,
};

/** Arma la vida de un recinto: `recinto` es el id del recinto en el plano (`recintoDe` en `camino.ts`). */
export function armarRecinto(recinto: string, svg: Raiz, ctx: Contexto): Vida {
  // Los títeres de la decimoquinta vuelta viven en su archivo y se suman acá (`vivos.ts`).
  return conElenco((CONTROLADORES[recinto] ?? recintoDeMapa)(svg, ctx), svg, ctx);
}
