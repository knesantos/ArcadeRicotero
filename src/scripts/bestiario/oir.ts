/**
 * Para oír los ruidos del bestiario uno por uno (`src/pages/diagnostico-bestiario.astro`).
 *
 * Existe porque nadie puede probar un sonido sin oírlo, y en el camino suenan mezclados y cuando
 * se les canta. Acá cada región se prende sola, se camina sin tocar la pantalla, y cada efecto
 * tiene su botón. Al lado de cada uno queda escrito si sonó el archivo o la síntesis de respaldo:
 * así se ve de un vistazo qué archivos ya llegaron y cuáles faltan.
 */

import { contextoDeAudio, despertarSalida } from '../../lib/audio/contexto.ts';
import { sonarAunqueEsteEnSilencio } from '../../lib/audio/sesion.ts';
import { RECETAS, type Suelo } from '../../lib/bestiario/sonido.ts';
import { crearEntorno, type Entorno, type Sono } from './entorno.ts';

/** Un paso cada tanto, a paso tranquilo: unidades de escena cada veinte de segundo. */
const AVANCE = 6;

const DICE: Record<Sono, string> = {
  archivo: 'Sonó el archivo',
  sintesis: 'Sonó la síntesis',
  nada: 'No sonó',
};

/** Un entorno mudo, para los botones sueltos cuando no hay ninguna región prendida. */
const banco = crearEntorno({ suelo: 'tierra', zancada: 85, viento: 0, grillos: 0 });
const regiones = new Map<string, Entorno>();
let activa: string | null = null;
let x = 0;
let andando = 0;

async function despertar(): Promise<AudioContext | null> {
  sonarAunqueEsteEnSilencio();
  const c = contextoDeAudio();
  if (!c) return null;
  return (await despertarSalida()) === 'running' ? c : null;
}

function entornoDe(id: string): Entorno {
  let e = regiones.get(id);
  if (!e) {
    e = crearEntorno(RECETAS[id]!);
    regiones.set(id, e);
  }
  return e;
}

function pintarRegiones(): void {
  for (const b of document.querySelectorAll<HTMLButtonElement>('[data-region]')) {
    const si = b.dataset.region === activa;
    b.setAttribute('aria-pressed', String(si));
    b.textContent = si ? b.dataset.apagar! : b.dataset.prender!;
  }
  const caminar = document.getElementById('caminar') as HTMLButtonElement | null;
  if (caminar) {
    caminar.disabled = activa === null;
    caminar.setAttribute('aria-pressed', String(andando !== 0));
    caminar.textContent = andando ? caminar.dataset.parar! : caminar.dataset.andar!;
  }
}

function pararDeCaminar(): void {
  clearInterval(andando);
  andando = 0;
}

for (const boton of document.querySelectorAll<HTMLButtonElement>('[data-region]')) {
  boton.addEventListener('click', async () => {
    const id = boton.dataset.region!;
    const c = await despertar();
    if (!c) return;
    if (activa) entornoDe(activa).apagar();
    pararDeCaminar();
    if (activa === id) {
      activa = null;
    } else {
      banco.apagar();
      activa = id;
      entornoDe(id).prender(c);
      x = 0;
      entornoDe(id).caminar(x);
    }
    pintarRegiones();
  });
}

document.getElementById('caminar')?.addEventListener('click', () => {
  if (andando) pararDeCaminar();
  else if (activa) {
    const e = entornoDe(activa);
    andando = window.setInterval(() => e.caminar((x += AVANCE)), 50);
  }
  pintarRegiones();
});

for (const boton of document.querySelectorAll<HTMLButtonElement>('[data-efecto]')) {
  boton.addEventListener('click', async () => {
    const c = await despertar();
    const salida = boton.parentElement?.querySelector('output');
    if (!c) {
      if (salida) salida.textContent = DICE.nada;
      return;
    }
    const e = activa ? entornoDe(activa) : banco;
    if (!activa) e.prender(c);
    const nombre = boton.dataset.efecto!;
    const suelo = boton.dataset.suelo as Suelo | undefined;
    const sono = suelo ? await e.pisar(suelo) : await e.oir(nombre);
    if (salida) salida.textContent = DICE[sono];
  });
}

pintarRegiones();
