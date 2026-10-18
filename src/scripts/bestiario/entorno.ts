/**
 * Los ruidos del camino (`D-76`): los pasos, el viento, los grillos y lo que anda suelto en lo
 * oscuro. Todo sintetizado con Web Audio, sin un solo archivo: ruido filtrado y osciladores.
 *
 * Pedido del usuario: *"que se escuchen otras cosas, pasos, sonidos de los personajes, ruidos
 * del entorno, que sea todo bien inmersivo"*. Acá está lo que la síntesis hace bien —ruido con
 * forma: hojas, pasto, viento, insectos, un cencerro, un pájaro de noche—. Lo que no hace bien
 * (una voz, una risa, un aullido, un balido) no se finge con osciladores: queda pedido en
 * `Docs/SUGERENCIAS/HILO-sonidos-del-bestiario.md`, para grabarlo o bajarlo.
 *
 * Los pasos van atados a lo caminado, no al reloj: un paso cada tantos píxeles de escena,
 * con un tope de velocidad (bajar de un golpe es correr, no teletransportarse a pasitos).
 *
 * Lo prende el mismo botón que el recital de lejos (`lejos.ts`), y comparte su contexto.
 */

import type { Receta } from '../../lib/bestiario/sonido.ts';

/** El volumen de todo el entorno, debajo del recital y por arriba del silencio. */
const VOLUMEN = 0.7;
/** Entre paso y paso, como mínimo: más rápido que esto ya es correr. */
const PASO_MIN_SEG = 0.2;

export interface Entorno {
  prender(ctx: AudioContext): void;
  apagar(): void;
  /** Lo caminado, en unidades de escena: de acá salen los pasos. */
  caminar(x: number): void;
  /** Un toque a un bicho que tiene sonido propio en la receta. */
  tocar(id: string): void;
}

export function crearEntorno(receta: Receta): Entorno {
  let ctx: AudioContext | null = null;
  let general: GainNode | null = null;
  let ruido: AudioBuffer | null = null;
  let prendido = false;
  const relojes: number[] = [];
  const fuentesFijas: AudioScheduledSourceNode[] = [];

  let ultimoX: number | null = null;
  let andado = 0;
  let ultimoPaso = 0;
  let pie = 1;

  /** Dos segundos de ruido blanco: la materia prima de casi todo. */
  function armarRuido(c: AudioContext): AudioBuffer {
    const b = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return b;
  }

  function paneo(c: AudioContext, p: number): AudioNode {
    const n = c.createStereoPanner?.();
    if (!n) return c.createGain();
    n.pan.value = Math.max(-1, Math.min(1, p));
    return n;
  }

  /** Un golpe de ruido filtrado: el ladrillo de los pasos y del crujido. */
  function soplo(c: AudioContext, destino: AudioNode, o: { tipo: BiquadFilterType; f: number; q: number; dura: number; vol: number; cuando?: number }): void {
    const t = o.cuando ?? c.currentTime;
    const s = c.createBufferSource();
    s.buffer = ruido;
    const filtro = c.createBiquadFilter();
    filtro.type = o.tipo;
    filtro.frequency.value = o.f;
    filtro.Q.value = o.q;
    const g = c.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(o.vol, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0008, t + o.dura);
    s.connect(filtro);
    filtro.connect(g);
    g.connect(destino);
    s.start(t, Math.random() * 1.5, o.dura + 0.05);
  }

  function paso(): void {
    if (!ctx || !general) return;
    const c = ctx;
    pie = -pie;
    const destino = paneo(c, pie * 0.18);
    destino.connect(general);
    const fuerza = 0.85 + Math.random() * 0.3;
    // El golpe sordo del talón y, encima, lo que cruje: hojas secas o pasto.
    soplo(c, destino, { tipo: 'lowpass', f: 380, q: 0.7, dura: 0.09, vol: 0.5 * fuerza });
    const suelo = receta.suelo;
    const cruje = suelo === 'hojas' ? { f: 3200, q: 0.9, dura: 0.16, vol: 0.22 } : { f: 5200, q: 0.5, dura: 0.12, vol: 0.1 };
    for (let i = 0; i < (suelo === 'hojas' ? 3 : 2); i++) {
      soplo(c, destino, { tipo: 'bandpass', ...cruje, vol: cruje.vol * fuerza, cuando: c.currentTime + 0.01 + i * (0.018 + Math.random() * 0.03) });
    }
  }

  /** El viento: ruido por un pasabanda que respira despacio. */
  function viento(c: AudioContext): void {
    const s = c.createBufferSource();
    s.buffer = ruido;
    s.loop = true;
    const filtro = c.createBiquadFilter();
    filtro.type = 'bandpass';
    filtro.frequency.value = 420;
    filtro.Q.value = 0.9;
    const g = c.createGain();
    g.gain.value = receta.viento;
    // Dos osciladores lentos: uno mueve el tono, el otro las ráfagas.
    const tono = c.createOscillator();
    tono.frequency.value = 0.07;
    const tonoG = c.createGain();
    tonoG.gain.value = 180;
    tono.connect(tonoG);
    tonoG.connect(filtro.frequency);
    const rafaga = c.createOscillator();
    rafaga.frequency.value = 0.11;
    const rafagaG = c.createGain();
    rafagaG.gain.value = receta.viento * 0.6;
    rafaga.connect(rafagaG);
    rafagaG.connect(g.gain);
    s.connect(filtro);
    filtro.connect(g);
    g.connect(general!);
    s.start();
    tono.start();
    rafaga.start();
    fuentesFijas.push(s, tono, rafaga);
  }

  /** Un grillo: tres o cuatro pulsos de una nota aguda, de un lado del monte. */
  function grillo(): void {
    if (!ctx || !general) return;
    const c = ctx;
    const t = c.currentTime;
    const destino = paneo(c, Math.random() * 1.6 - 0.8);
    destino.connect(general);
    const o = c.createOscillator();
    o.frequency.value = 4100 + Math.random() * 600;
    const g = c.createGain();
    g.gain.value = 0;
    const pulsos = 3 + Math.floor(Math.random() * 2);
    for (let i = 0; i < pulsos; i++) {
      const a = t + i * 0.045;
      g.gain.setValueAtTime(0, a);
      g.gain.linearRampToValueAtTime(receta.grillos, a + 0.006);
      g.gain.linearRampToValueAtTime(0, a + 0.03);
    }
    o.connect(g);
    g.connect(destino);
    o.start(t);
    o.stop(t + pulsos * 0.045 + 0.05);
  }

  /** La lechuza: dos ululares graves, el segundo más largo y cayendo. */
  function lechuza(): void {
    if (!ctx || !general) return;
    const c = ctx;
    const destino = paneo(c, Math.random() < 0.5 ? -0.6 : 0.6);
    destino.connect(general);
    const lejos = c.createBiquadFilter();
    lejos.type = 'lowpass';
    lejos.frequency.value = 900;
    lejos.connect(destino);
    const t = c.currentTime;
    for (const [desde, dura, f0, f1] of [[0, 0.22, 410, 400], [0.42, 0.75, 420, 360]] as const) {
      const o = c.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(f0, t + desde);
      o.frequency.linearRampToValueAtTime(f1, t + desde + dura);
      const g = c.createGain();
      g.gain.setValueAtTime(0, t + desde);
      g.gain.linearRampToValueAtTime(0.09, t + desde + 0.06);
      g.gain.setValueAtTime(0.09, t + desde + dura - 0.15);
      g.gain.linearRampToValueAtTime(0, t + desde + dura);
      o.connect(g);
      g.connect(lejos);
      o.start(t + desde);
      o.stop(t + desde + dura + 0.05);
    }
  }

  /** El cencerro de la vaca: dos parciales que no son armónicos, y se apagan rápido. */
  function cencerro(): void {
    if (!ctx || !general) return;
    const c = ctx;
    const destino = paneo(c, 0.3);
    destino.connect(general);
    const t = c.currentTime;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.12, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
    const cuerpo = c.createBiquadFilter();
    cuerpo.type = 'bandpass';
    cuerpo.frequency.value = 820;
    cuerpo.Q.value = 2;
    for (const f of [545, 815]) {
      const o = c.createOscillator();
      o.type = 'square';
      o.frequency.value = f;
      o.connect(cuerpo);
      o.start(t);
      o.stop(t + 1);
    }
    cuerpo.connect(g);
    g.connect(destino);
  }

  const SONIDOS: Record<string, () => void> = { lechuza, cencerro, grillo };

  /** Agenda algo que vuelve cada tanto, con azar para que no se oiga la cuenta. */
  function cadaTanto(hacer: () => void, min: number, max: number): void {
    const vuelta = (): void => {
      if (!prendido) return;
      if (document.visibilityState === 'visible') hacer();
      relojes.push(window.setTimeout(vuelta, (min + Math.random() * (max - min)) * 1000));
    };
    relojes.push(window.setTimeout(vuelta, (min / 2 + Math.random() * min) * 1000));
  }

  return {
    prender(c) {
      if (prendido) return;
      ctx = c;
      ruido ??= armarRuido(c);
      general = c.createGain();
      general.gain.value = 0;
      general.gain.setTargetAtTime(VOLUMEN, c.currentTime, 0.6);
      general.connect(c.destination);
      prendido = true;
      if (receta.viento > 0) viento(c);
      if (receta.grillos > 0) cadaTanto(grillo, 0.4, 1.6);
      for (const [nombre, [min, max]] of Object.entries(receta.cadaTanto ?? {})) {
        const hacer = SONIDOS[nombre];
        if (hacer) cadaTanto(hacer, min, max);
      }
    },
    apagar() {
      if (!prendido || !ctx || !general) return;
      prendido = false;
      for (const r of relojes.splice(0)) clearTimeout(r);
      const g = general;
      g.gain.setTargetAtTime(0, ctx.currentTime, 0.3);
      const fijas = fuentesFijas.splice(0);
      window.setTimeout(() => {
        for (const f of fijas) {
          try {
            f.stop();
          } catch {
            // Ya estaba parada.
          }
        }
        g.disconnect();
      }, 1500);
      general = null;
      ultimoX = null;
    },
    caminar(x) {
      if (!prendido || !ctx) return;
      if (ultimoX === null) {
        ultimoX = x;
        return;
      }
      andado += Math.abs(x - ultimoX);
      ultimoX = x;
      if (andado < receta.zancada) return;
      andado = 0;
      const ahora = ctx.currentTime;
      if (ahora - ultimoPaso < PASO_MIN_SEG) return;
      ultimoPaso = ahora;
      paso();
    },
    tocar(id) {
      if (!prendido) return;
      const nombre = receta.alTocar?.[id];
      if (nombre) SONIDOS[nombre]?.();
    },
  };
}
