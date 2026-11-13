/**
 * La lupa del plano redondo (`D-90`): pellizcar, la ruedita con Ctrl o el doble toque acercan el
 * plano adentro de su cartel; con la lupa puesta, el dedo lo lleva para donde quiera.
 *
 * En un teléfono el plano mide lo que mide la pantalla, y los trece carteles son sellos de siete
 * milímetros. Acercado, se leen. Los carteles siguen siendo los enlaces de siempre: un toque
 * entra caminando a la región.
 *
 * Lo que se agranda es la lente (`#lente`: el dibujo, la luz y los carteles); el marco es la
 * ventana y la recorta. Solo `transform`. Las cuentas son las de `lib/bestiario/lupa.ts`, las
 * mismas del camino. El viaje del doble toque dura un tercio de segundo y pide sus propios
 * cuadros nada más que mientras dura; con movimiento reducido, llega de una.
 */

import { ENTERA, LUPA, acotar, centrar, conLupa, enElMundo, enfocar, entreLentes, type Lente, type Medida } from '../../lib/bestiario/lupa.ts';
import { leerGestos } from './pellizco.ts';

export function armarLupaDelPlano(quieto: () => boolean): void {
  const marco = document.getElementById('marco');
  const cristal = document.getElementById('lente');
  if (!marco || !cristal) return;
  const grupo = document.getElementById('lupa');
  const todo = document.getElementById('lupa-todo') as HTMLButtonElement | null;
  const mas = document.getElementById('lupa-mas') as HTMLButtonElement | null;
  const menos = document.getElementById('lupa-menos') as HTMLButtonElement | null;

  let lente: Lente = { ...ENTERA };
  let viaje: { desde: Lente; hasta: Lente; t0: number } | null = null;
  const medida = (): Medida => ({ ancho: marco.clientWidth, alto: marco.clientHeight });
  const esquina = (): DOMRect => marco.getBoundingClientRect();

  function poner(l: Lente): void {
    const m = medida();
    lente = acotar(l, m, m);
    const puesta = conLupa(lente);
    cristal!.style.transform = puesta ? `scale(${lente.z.toFixed(4)}) translate3d(${(-lente.x).toFixed(1)}px, ${(-lente.y).toFixed(1)}px, 0)` : '';
    marco!.classList.toggle('bestiario-marco--lupa', puesta);
    if (todo) todo.hidden = !puesta;
    if (menos) menos.disabled = !puesta;
    if (mas) mas.disabled = lente.z >= LUPA.max - 0.01;
  }

  function cuadro(ahora: number): void {
    if (!viaje) return;
    const u = (ahora - viaje.t0) / 1000 / LUPA.dura;
    poner(entreLentes(viaje.desde, viaje.hasta, u));
    if (u >= 1) viaje = null;
    else requestAnimationFrame(cuadro);
  }

  function viajar(hasta: Lente): void {
    if (quieto()) {
      viaje = null;
      poner(hasta);
      return;
    }
    const andaba = viaje !== null;
    viaje = { desde: { ...lente }, hasta, t0: performance.now() };
    if (!andaba) requestAnimationFrame(cuadro);
  }

  const paso = (factor: number): void => {
    const m = medida();
    const desde = viaje?.hasta ?? lente;
    viajar(enfocar(desde, desde.z * factor, m.ancho / 2, m.alto / 2, m, m));
  };
  const mirarTodo = (): void => viajar({ ...ENTERA });

  mas?.addEventListener('click', () => paso(LUPA.paso));
  menos?.addEventListener('click', () => paso(1 / LUPA.paso));
  todo?.addEventListener('click', mirarTodo);
  if (grupo) grupo.hidden = false;

  let pellizcado: { z: number; mx: number; my: number } | null = null;
  /** El dedo o el mouse que lleva el plano con la lupa puesta. */
  let agarre: { id: number; x: number; y: number; lx: number; ly: number; movio: boolean } | null = null;
  let soltadoSinTocar = false;

  leerGestos(marco, {
    empieza(cx, cy) {
      viaje = null;
      agarre = null;
      const r = esquina();
      const m = enElMundo(lente, cx - r.left, cy - r.top);
      pellizcado = { z: lente.z, mx: m.x, my: m.y };
    },
    pellizco(factor, cx, cy) {
      if (!pellizcado) return;
      const r = esquina();
      const z = Math.min(LUPA.max, Math.max(LUPA.min, pellizcado.z * factor));
      poner({ z, x: pellizcado.mx - (cx - r.left) / z, y: pellizcado.my - (cy - r.top) / z });
    },
    termina() {
      pellizcado = null;
      if (conLupa(lente) && lente.z < LUPA.suelta) mirarTodo();
    },
    rueda(factor, x, y) {
      viaje = null;
      const r = esquina();
      const m = medida();
      poner(enfocar(lente, lente.z * factor, x - r.left, y - r.top, m, m));
      if (conLupa(lente) && lente.z < LUPA.suelta && factor < 1) poner({ ...ENTERA });
    },
    doble(x, y) {
      if (lente.z > 1.2) return mirarTodo();
      const r = esquina();
      const m = medida();
      const p = enElMundo(lente, x - r.left, y - r.top);
      viajar(centrar(LUPA.doble, p.x, p.y, m, m));
    },
  });

  marco.addEventListener('pointerdown', (ev) => {
    soltadoSinTocar = false;
    if (!conLupa(lente) || pellizcado || (ev.pointerType === 'mouse' && ev.button !== 0)) return;
    viaje = null;
    agarre = { id: ev.pointerId, x: ev.clientX, y: ev.clientY, lx: lente.x, ly: lente.y, movio: false };
  });
  marco.addEventListener('pointermove', (ev) => {
    if (!agarre || ev.pointerId !== agarre.id) return;
    const dx = ev.clientX - agarre.x;
    const dy = ev.clientY - agarre.y;
    if (!agarre.movio) {
      if (Math.hypot(dx, dy) < 6) return;
      agarre.movio = true;
      marco.setPointerCapture(agarre.id);
    }
    poner({ z: lente.z, x: agarre.lx - dx / lente.z, y: agarre.ly - dy / lente.z });
  });
  const soltar = (ev: PointerEvent): void => {
    if (!agarre || ev.pointerId !== agarre.id) return;
    soltadoSinTocar = agarre.movio;
    agarre = null;
  };
  marco.addEventListener('pointerup', soltar);
  marco.addEventListener('pointercancel', soltar);
  // Soltar después de llevar el plano no es tocar un cartel.
  marco.addEventListener(
    'click',
    (ev) => {
      if (!soltadoSinTocar) return;
      soltadoSinTocar = false;
      ev.stopPropagation();
      ev.preventDefault();
    },
    true,
  );

  window.addEventListener('resize', () => poner(lente));
}
