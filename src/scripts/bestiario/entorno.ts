/**
 * Los ruidos del camino (`D-76`): los pasos, el viento, los grillos y lo que anda suelto en lo
 * oscuro. Todo sintetizado con Web Audio, sin un solo archivo: ruido filtrado y osciladores.
 *
 * Pedido del usuario: *"que se escuchen otras cosas, pasos, sonidos de los personajes, ruidos
 * del entorno, que sea todo bien inmersivo"*. Acá está lo que la síntesis hace bien —ruido con
 * forma: hojas, pasto, viento, insectos, un cencerro, un pájaro de noche—. Desde `D-77` se caminan
 * las trece regiones, y cada una suma su suelo (tablas, baldosa, chapa, nieve, agua, tierra) y lo
 * suyo: una gotera, un motor que pasa, las moscas, la sirena de lejos, el bombo de la murga, las
 * llaves, las brasas, el agua del muelle, la bocina del ferry, la tele y la gente. Lo que no hace bien
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

  /**
   * Cada suelo: el golpe del talón (un pasabajos corto) y, encima, lo que suena según dónde se
   * pisa, que son unos cuantos golpecitos de ruido por un filtro. Las hojas crujen, el pasto roza,
   * la tabla golpea hueco, la baldosa taconea, la chapa resuena, la nieve chirría, el agua salpica
   * y la tierra raspa.
   */
  const SUELOS: Record<Receta['suelo'], { talon: readonly [number, number, number]; encima: { tipo: BiquadFilterType; f: number; q: number; dura: number; vol: number }; veces: number }> = {
    hojas: { talon: [380, 0.09, 0.5], encima: { tipo: 'bandpass', f: 3200, q: 0.9, dura: 0.16, vol: 0.22 }, veces: 3 },
    pasto: { talon: [380, 0.09, 0.5], encima: { tipo: 'bandpass', f: 5200, q: 0.5, dura: 0.12, vol: 0.1 }, veces: 2 },
    tablas: { talon: [220, 0.16, 0.6], encima: { tipo: 'bandpass', f: 880, q: 3, dura: 0.06, vol: 0.2 }, veces: 1 },
    baldosa: { talon: [600, 0.05, 0.35], encima: { tipo: 'highpass', f: 2800, q: 0.7, dura: 0.035, vol: 0.18 }, veces: 1 },
    chapa: { talon: [300, 0.08, 0.4], encima: { tipo: 'bandpass', f: 1750, q: 9, dura: 0.32, vol: 0.16 }, veces: 1 },
    nieve: { talon: [420, 0.07, 0.3], encima: { tipo: 'bandpass', f: 1400, q: 0.6, dura: 0.06, vol: 0.14 }, veces: 4 },
    agua: { talon: [260, 0.12, 0.35], encima: { tipo: 'bandpass', f: 720, q: 1.2, dura: 0.24, vol: 0.24 }, veces: 2 },
    tierra: { talon: [480, 0.08, 0.45], encima: { tipo: 'bandpass', f: 2500, q: 0.6, dura: 0.08, vol: 0.08 }, veces: 2 },
  };

  function paso(): void {
    if (!ctx || !general) return;
    const c = ctx;
    pie = -pie;
    const destino = paneo(c, pie * 0.18);
    destino.connect(general);
    const fuerza = 0.85 + Math.random() * 0.3;
    const { talon: [f, dura, vol], encima, veces } = SUELOS[receta.suelo];
    soplo(c, destino, { tipo: 'lowpass', f, q: 0.7, dura, vol: vol * fuerza });
    for (let i = 0; i < veces; i++) {
      soplo(c, destino, { ...encima, vol: encima.vol * fuerza, cuando: c.currentTime + 0.01 + i * (0.018 + Math.random() * 0.03) });
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

  /** Un oscilador con su envolvente: sube rápido, se sostiene y se apaga. */
  function tono(destino: AudioNode, o: { tipo: OscillatorType; f0: number; f1?: number; dura: number; vol: number; cuando?: number }): OscillatorNode {
    const c = ctx!;
    const t = o.cuando ?? c.currentTime;
    const osc = c.createOscillator();
    osc.type = o.tipo;
    osc.frequency.setValueAtTime(o.f0, t);
    if (o.f1 !== undefined) osc.frequency.exponentialRampToValueAtTime(o.f1, t + o.dura);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(o.vol, t + Math.min(0.03, o.dura / 4));
    g.gain.exponentialRampToValueAtTime(0.0001, t + o.dura);
    osc.connect(g);
    g.connect(destino);
    osc.start(t);
    osc.stop(t + o.dura + 0.05);
    return osc;
  }

  /** Un destino con paneo y, si se pide, lejos: un pasabajos que se come los agudos. */
  function salida(p: number, lejos?: number): AudioNode {
    const c = ctx!;
    const destino = paneo(c, p);
    destino.connect(general!);
    if (!lejos) return destino;
    const f = c.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = lejos;
    f.connect(destino);
    return f;
  }

  /** Un paneo que cruza de un lado al otro mientras dura el sonido. */
  function cruzando(dura: number, desde: number): AudioNode {
    const c = ctx!;
    const t = c.currentTime;
    const pan = c.createStereoPanner?.();
    const destino: AudioNode = pan ?? c.createGain();
    destino.connect(general!);
    if (pan) {
      pan.pan.setValueAtTime(desde, t);
      pan.pan.linearRampToValueAtTime(-desde, t + dura);
    }
    return destino;
  }

  /** Una gota que cae en el agua: un tono que baja de golpe. */
  function gota(): void {
    if (!ctx || !general) return;
    tono(salida(Math.random() * 1.2 - 0.6), { tipo: 'sine', f0: 1500 + Math.random() * 500, f1: 520, dura: 0.07, vol: 0.06 });
  }

  /** Las moscas: un zumbido que tiembla y cruza de un lado al otro. */
  function zumbido(): void {
    if (!ctx || !general) return;
    const c = ctx;
    const t = c.currentTime;
    const dura = 1.4 + Math.random() * 1.2;
    const filtro = c.createBiquadFilter();
    filtro.type = 'bandpass';
    filtro.frequency.value = 900;
    filtro.Q.value = 1.5;
    filtro.connect(cruzando(dura, Math.random() < 0.5 ? -0.8 : 0.8));
    const ala = tono(filtro, { tipo: 'sawtooth', f0: 200 + Math.random() * 40, dura, vol: 0.035 });
    const temblor = c.createOscillator();
    temblor.frequency.value = 9;
    const temblorG = c.createGain();
    temblorG.gain.value = 14;
    temblor.connect(temblorG);
    temblorG.connect(ala.frequency);
    temblor.start(t);
    temblor.stop(t + dura + 0.05);
  }

  /** La sirena de la cana, de lejos: un tono que sube y baja dos veces. */
  function sirena(): void {
    if (!ctx || !general) return;
    const c = ctx;
    const t = c.currentTime;
    const o = c.createOscillator();
    o.type = 'triangle';
    o.frequency.setValueAtTime(640, t);
    for (let i = 0; i < 2; i++) {
      o.frequency.linearRampToValueAtTime(940, t + i * 1.6 + 0.8);
      o.frequency.linearRampToValueAtTime(640, t + i * 1.6 + 1.6);
    }
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.04, t + 0.6);
    g.gain.setValueAtTime(0.04, t + 2.6);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 3.3);
    o.connect(g);
    g.connect(salida(Math.random() < 0.5 ? -0.7 : 0.7, 1200));
    o.start(t);
    o.stop(t + 3.4);
  }

  /** Las llaves y las cadenas: unos cuantos golpecitos metálicos, desparejos. */
  function cadena(): void {
    if (!ctx || !general) return;
    const c = ctx;
    const destino = salida(Math.random() * 1.2 - 0.6);
    const golpes = 4 + Math.floor(Math.random() * 4);
    for (let i = 0; i < golpes; i++) {
      soplo(c, destino, { tipo: 'bandpass', f: 4200 + Math.random() * 2400, q: 12, dura: 0.12, vol: 0.12, cuando: c.currentTime + i * (0.05 + Math.random() * 0.07) });
    }
  }

  /** Las brasas del infierno: chispazos cortos y secos, de a varios. */
  function brasas(): void {
    if (!ctx || !general) return;
    const c = ctx;
    const destino = salida(Math.random() * 1.4 - 0.7);
    const chispas = 2 + Math.floor(Math.random() * 5);
    for (let i = 0; i < chispas; i++) {
      soplo(c, destino, { tipo: 'highpass', f: 2200 + Math.random() * 2000, q: 0.8, dura: 0.02, vol: 0.12, cuando: c.currentTime + Math.random() * 0.6 });
    }
  }

  /** Un ruido largo con forma: el agua del muelle, la gente del galpón. */
  function oleada(o: { tipo: BiquadFilterType; f: readonly number[]; q: number; vol: number; dura: number; destino: AudioNode }): void {
    const c = ctx!;
    const t = c.currentTime;
    const s = c.createBufferSource();
    s.buffer = ruido;
    s.loop = true;
    const filtro = c.createBiquadFilter();
    filtro.type = o.tipo;
    filtro.Q.value = o.q;
    o.f.forEach((f, i) => filtro.frequency[i ? 'linearRampToValueAtTime' : 'setValueAtTime'](f, t + (o.dura * i) / (o.f.length - 1 || 1)));
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(o.vol, t + o.dura * 0.4);
    g.gain.exponentialRampToValueAtTime(0.0001, t + o.dura);
    s.connect(filtro);
    filtro.connect(g);
    g.connect(o.destino);
    s.start(t, Math.random() * 1.5);
    s.stop(t + o.dura + 0.05);
  }

  /** El agua contra los pilotes del muelle: una ola grave que va y viene. */
  function ola(): void {
    if (!ctx || !general) return;
    oleada({ tipo: 'lowpass', f: [300, 900, 250], q: 0.7, vol: 0.16, dura: 2.3, destino: salida(Math.random() * 1.2 - 0.6) });
  }

  /** La gente que espera en el galpón: un murmullo que crece y se va. */
  function gente(): void {
    if (!ctx || !general) return;
    oleada({ tipo: 'bandpass', f: [600, 700, 600], q: 0.8, vol: 0.05, dura: 4.5, destino: salida(0, 1400) });
  }

  /** La bocina del ferry que sale: dos notas graves, un poco desafinadas entre sí. */
  function bocina(): void {
    if (!ctx || !general) return;
    const destino = salida(0.5, 700);
    for (const f of [110, 113.5]) tono(destino, { tipo: 'sawtooth', f0: f, dura: 2.2, vol: 0.05 });
  }

  /** El bombo de la murga, de lejos: un golpe grave que se apaga, y su contratiempo. */
  function bombo(): void {
    if (!ctx || !general) return;
    const c = ctx;
    const destino = salida(-0.4, 500);
    for (const [cuando, vol] of [[0, 0.22], [0.42, 0.14], [0.63, 0.18]] as const) {
      tono(destino, { tipo: 'sine', f0: 92, f1: 48, dura: 0.35, vol, cuando: c.currentTime + cuando });
    }
  }

  /** La tele que se va de canal: chasquidos de estática. */
  function interferencia(): void {
    if (!ctx || !general) return;
    const c = ctx;
    const destino = salida(0);
    for (let i = 0; i < 3; i++) {
      soplo(c, destino, { tipo: 'highpass', f: 1800, q: 0.5, dura: 0.18 + Math.random() * 0.2, vol: 0.05, cuando: c.currentTime + i * 0.22 });
    }
  }

  /** Un fierro que pasa por la ruta: el motor viene de un lado, crece y se va para el otro. */
  function motor(): void {
    if (!ctx || !general) return;
    const c = ctx;
    const t = c.currentTime;
    const dura = 3.2;
    const filtro = c.createBiquadFilter();
    filtro.type = 'lowpass';
    filtro.frequency.setValueAtTime(260, t);
    filtro.frequency.linearRampToValueAtTime(900, t + dura / 2);
    filtro.frequency.linearRampToValueAtTime(220, t + dura);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.12, t + dura / 2);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dura);
    filtro.connect(g);
    g.connect(cruzando(dura, -0.9));
    const o = c.createOscillator();
    o.type = 'sawtooth';
    // Cuando pasa, el tono sube al acercarse y baja al irse.
    o.frequency.setValueAtTime(58, t);
    o.frequency.linearRampToValueAtTime(66, t + dura / 2);
    o.frequency.linearRampToValueAtTime(50, t + dura);
    o.connect(filtro);
    o.start(t);
    o.stop(t + dura + 0.05);
    const s = c.createBufferSource();
    s.buffer = ruido;
    s.connect(filtro);
    s.start(t, 0, dura);
  }

  const SONIDOS: Record<string, () => void> = {
    lechuza, cencerro, grillo, zumbido, sirena, cadena, gota, brasas, ola, bocina, bombo, interferencia, gente, motor,
  };

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
