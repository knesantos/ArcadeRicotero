/**
 * Lo que necesitan los tests de los títeres de la vigésima vuelta (`D-73`) para correr una isla sin
 * navegador: un DOM de juguete armado con el marcado de la escena, un azar que se puede fijar y un
 * escenario que anota lo que se dice. Los de antes llevan su copia adentro del test; es la misma cuenta.
 */

export interface Juguete {
  dataset: Record<string, string>;
  atributos: Map<string, string>;
  setAttribute(n: string, v: string): void;
  getAttribute(n: string): string | null;
}

/**
 * Un DOM de juguete: cada `data-parte` del marcado es un elemento que guarda sus atributos. `marcos` son
 * los grupos de cada capa (`data-marco`), en orden; el títere (`clase`) está en el de la figura.
 */
export function domDeJuguete(capas: readonly string[], clase: string) {
  const partes: Juguete[] = [];
  const oyentes = new Map<string, (ev: unknown) => void>();
  const titere = { querySelectorAll: (sel: string) => (sel === '[data-parte]' ? partes : []), addEventListener: (tipo: string, fn: (ev: unknown) => void) => oyentes.set(tipo, fn) };
  const marcos = capas.map((html) => {
    const suyas: Juguete[] = [];
    for (const m of html.matchAll(/<g\b([^>]*\bdata-parte="([^"]+)"[^>]*)>/g)) {
      const atributos = new Map([...m[1]!.matchAll(/([a-z-]+)="([^"]*)"/g)].map((a) => [a[1]!, a[2]!] as const));
      const j: Juguete = { dataset: { parte: m[2]! }, atributos, setAttribute(n, v) { this.atributos.set(n, v); }, getAttribute(n) { return this.atributos.get(n) ?? null; } };
      suyas.push(j);
      partes.push(j);
    }
    const tiene = html.includes(`class="titere ${clase}"`);
    return {
      dataset: { dx: '0' },
      querySelector: (sel: string) => (sel === `.${clase}` && tiene ? titere : null),
      querySelectorAll: (sel: string) => (sel === '[data-parte]' ? suyas : []),
    };
  });
  const foto = (): Record<string, string> => Object.fromEntries(partes.map((p) => [p.dataset.parte!, `${p.getAttribute('transform') ?? ''}|${p.getAttribute('opacity') ?? ''}`]));
  const de = (nombre: string, at: string): string => partes.find((p) => p.dataset.parte === nombre)?.getAttribute(at) ?? '';
  return { marcos: marcos as unknown as SVGGElement[], partes, oyentes, foto, de };
}

/** Un azar con semilla (mulberry32), para que el test vea siempre lo mismo. */
export function azar(semilla: number): () => number {
  let a = semilla;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Un escenario que anota lo que dice cada uno y deja poner la hora. */
export function escenario(quieto: boolean) {
  const dichos: Array<[string, number, number]> = [];
  let reloj = 0;
  return { esc: { hablar: (id: string, x: number, y: number) => void dichos.push([id, x, y]), quieto: () => quieto, reloj: () => reloj }, dichos, poner: (t: number) => void (reloj = t) };
}

/** El primer número de un `translate(x y)`, y el segundo. */
export const trasladoDe = (transform: string): [number, number] => {
  const m = /translate\(([-\d.]+) ([-\d.]+)\)/.exec(transform);
  return m ? [Number(m[1]), Number(m[2])] : [NaN, NaN];
};
