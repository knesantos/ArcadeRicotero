/**
 * Los vigías (`D-90`, quinta ronda): quién de los títeres grandes está a la vista.
 *
 * El elenco ya no se mueve cuando no se lo ve (`vivos.ts`). Faltaban los títeres grandes de
 * `recintos.ts` (Pierre, Momo, Luzbelito, Barbazul, la drácula), que son los que más piezas mueven.
 * Cada uno pide un vigía para su grupo; el vigía dice si se lo ve, y no mide nada por su cuenta:
 * la medición la hace `vivos.ts`, de a tandas y antes de que nadie escriba en ese cuadro, junto
 * con la del elenco. Así es una sola lectura del navegador cada tanto, no una por títere.
 *
 * Sin `seVe` (el recinto de la página del bestiario, que es chico y se ve entero), el vigía dice
 * siempre que sí.
 */

interface Mirador {
  seVe?(el: Element): boolean;
}

interface Vigia {
  el: Element;
  visible: boolean;
}

const puestos = new WeakMap<object, Vigia[]>();

/** Un vigía para `el`, en la escena de `ctx`. Devuelve la pregunta: ¿se lo ve? */
export function vigia(ctx: Mirador, el: Element | null | undefined): () => boolean {
  if (!el || !ctx.seVe) return () => true;
  const v: Vigia = { el, visible: true };
  const lista = puestos.get(ctx) ?? [];
  lista.push(v);
  puestos.set(ctx, lista);
  return () => v.visible;
}

/** Mira a todos los vigilados de una escena, juntos. Lo llama `vivos.ts` en su tanda. */
export function mirarVigias(ctx: Mirador): void {
  if (!ctx.seVe) return;
  for (const v of puestos.get(ctx) ?? []) v.visible = ctx.seVe(v.el);
}
