/**
 * El copy de "Sacalo por la letra" (`US-07`).
 *
 * Escrito por el hilo principal siguiendo `voz-ricotera.md` y el molde del hermano de
 * audio (`src/lib/tema/copy.ts`); lo audita `voz.test.ts`. Queda pedido a `contenido`
 * el pase fino — `UX-08` dejó anotado que este juego no tiene `CNT-XX` propio todavía.
 *
 * La regla de las dos líneas: el título nombra ("Sacalo por la letra"), la bajada canta
 * (primera frase ≤ 8 palabras). Botones en voseo, sin excepción (`D-17`).
 */

export const PANTALLA_0 = {
  titulo: 'Sacalo por la letra',
  subtitulo: 'Un verso te tiene que alcanzar. Si no, te damos más: dos, cuatro, ocho. Cuanto antes lo saques, más vale.',
  boton: 'JUGÁ',
  hay: (n: number) => `${n} temas en el pozo`,
} as const;

export const PARTIDA = {
  tema: (n: number, total: number) => `Tema ${n} de ${total}`,
  intentos: (n: number) => (n === 1 ? 'Te queda 1 intento' : `Te quedan ${n} intentos`),
  versos: (n: number) => (n === 1 ? 'Tenés 1 verso' : `Tenés ${n} versos`),
  ayuda: 'Empezá a escribir y elegí de la lista. Sin tildes anda igual, y con el título por la mitad también.',
  arriesga: 'Arriesgá',
  pasa: 'Pasá',
  paso: 'pasaste',
  ok: '¡Lo sacaste!',
  no: 'No era ese.',
  era: (titulo: string) => `Era ${titulo}`,
  deDonde: (disco: string, anio: number) => `${disco} (${anio})`,
  puntos: (p: number, versos: number) =>
    p > 0 ? `${p} puntos · Con ${versos === 1 ? '1 verso' : `${versos} versos`}` : 'Esta vez no salió',
  verLetra: 'Mirá la letra y los acordes',
  seguir: 'Seguí',
  /** La fuente del verso, registro 3 — mismo mecanismo que `US-03` (`T-145`, `D-25`). */
  fuenteDe: (sitio: string) => `Letra transcripta por ${sitio}`,
} as const;

export const RESULTADO = {
  titulo: 'Cómo te fue',
  de: (puntos: number, maximo: number) => `${puntos} de ${maximo}`,
  compartir: 'COMPARTÍ',
  deNuevo: 'JUGÁ DE NUEVO',
  copiado: 'Link copiado.',
  paraCompartir: (puntos: number, maximo: number) =>
    `Saqué ${puntos} de ${maximo} sacando temas por la letra en el arcade ricotero. ¿Vos cuántos sacás?`,
} as const;
