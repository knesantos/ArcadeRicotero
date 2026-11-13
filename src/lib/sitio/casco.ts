/**
 * El casco del último bondi (`D-85`): la chapa de la nave, detrás de toda la portada en noviembre.
 *
 * La tapa de *Último bondi a Finisterre* es una chapa repujada —el Indio cuenta que salió de una
 * caja de whisky con relieve plateado (ficha del disco, testimonio)— con caños que doblan en
 * ángulo recto, remaches en fila y terminales redondas. Esto es esa chapa leída en nuestra
 * línea: una baldosa que se repite sin costura, hecha solo de trazo, que el portal usa como
 * máscara sobre la tinta plana del disco (`--disco-ultimo-bondi-a-finisterre-tinta`). No es
 * una foto, y por eso no lleva velo: lo que la deja leer el texto es el peso (`--peso-casco`), y
 * lo mide `contraste.test.ts`.
 *
 * **Sin relieve.** El repujado de la tapa es luz y sombra; acá no hay ni una ni otra (`D-64`): el
 * caño es hueco porque se dibuja con dos líneas, no porque haga sombra.
 *
 * La sirve `pages/arte/casco-bondi.svg.ts` en el build: no hay un archivo que regenerar a mano.
 */

/** El lado de la baldosa. */
export const LADO_CASCO = 320;

/** Lo que nada que no sea una costura puede pisar, para que el mosaico no tenga corte. */
export const MARGEN_CASCO = 10;

/** Las costuras de la chapa: una horizontal y una vertical, de borde a borde. */
const COSTURA_Y = 40;
const COSTURA_X = 232;

/** Los caños: doblan en ángulo recto, con la esquina redondeada, como los de la tapa. */
const CANOS = [
  'M22 92H118Q130 92 130 104V146Q130 158 142 158H198',
  'M262 66V124Q262 136 274 136H298',
  'M42 298V234Q42 222 54 222H166Q178 222 178 210V190',
  'M254 298V258Q254 246 266 246H298',
  'M150 66V74Q150 82 158 82H204',
];

/** Las terminales: un aro en la punta de cada caño. */
const TERMINALES: ReadonlyArray<readonly [number, number]> = [
  [22, 92], [198, 158], [298, 136], [42, 298], [178, 190], [298, 246], [204, 82],
];

/** Las ranuras de tres agujeros, como el "ooo" de arriba a la izquierda de la tapa. */
const RANURAS: ReadonlyArray<readonly [number, number]> = [
  [56, 126],
  [196, 286],
];

/** Las cajitas sueltas. */
const CAJAS: ReadonlyArray<readonly [number, number, number, number]> = [
  [100, 260, 26, 20],
  [276, 182, 22, 30],
];

function remaches(): string {
  const puntos: string[] = [];
  for (let x = 10; x < LADO_CASCO; x += 20) {
    if (Math.abs(x - COSTURA_X) < 12) continue;
    puntos.push(`<circle cx="${x}" cy="${COSTURA_Y + 9}" r="2.6"/>`);
  }
  for (let y = 10; y < LADO_CASCO; y += 20) {
    if (Math.abs(y - COSTURA_Y) < 12) continue;
    puntos.push(`<circle cx="${COSTURA_X + 9}" cy="${y}" r="2.6"/>`);
  }
  return puntos.join('');
}

/** El SVG de la baldosa: trazo blanco sobre nada, para usarlo de máscara. */
export function cascoSvg(): string {
  const huecos = [
    ...CANOS.map((d) => `<path d="${d}" stroke-width="3"/>`),
    ...TERMINALES.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.6" fill="#000" stroke="none"/>`),
  ].join('');
  const ranuras = RANURAS.map(
    ([x, y]) =>
      `<rect x="${x}" y="${y}" width="44" height="16" rx="8" fill="none" stroke-width="2"/>` +
      [10, 22, 34].map((dx) => `<circle cx="${x + dx}" cy="${y + 8}" r="3.4" fill="none" stroke-width="1.6"/>`).join(''),
  ).join('');
  const cajas = CAJAS.map(
    ([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="none" stroke-width="2"/>`,
  ).join('');
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${LADO_CASCO}" height="${LADO_CASCO}" viewBox="0 0 ${LADO_CASCO} ${LADO_CASCO}">` +
    `<defs><mask id="h" maskUnits="userSpaceOnUse"><rect width="${LADO_CASCO}" height="${LADO_CASCO}" fill="#fff"/>` +
    `<g fill="none" stroke="#000" stroke-linecap="round">${huecos}</g></mask></defs>` +
    `<g stroke="#fff" fill="#fff">` +
    // Las costuras pasan de borde a borde: son lo único que toca el corte de la baldosa.
    `<path d="M0 ${COSTURA_Y}H${LADO_CASCO}M${COSTURA_X} 0V${LADO_CASCO}" stroke-width="2" fill="none"/>` +
    remaches() +
    `<g mask="url(#h)" fill="none" stroke-linecap="round">${CANOS.map((d) => `<path d="${d}" stroke-width="9"/>`).join('')}` +
    TERMINALES.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8" fill="#fff" stroke="none"/>`).join('') +
    `</g>${ranuras}${cajas}</g></svg>`
  );
}

/** Lo que cada pieza ocupa, para que el test mire que nada salvo las costuras toca el borde. */
export function piezasDelCasco(): { readonly puntos: ReadonlyArray<readonly [number, number]> } {
  const puntos: Array<readonly [number, number]> = [];
  for (const d of CANOS) {
    for (const m of d.matchAll(/([MHVQ])([\d .]+)/g)) {
      const n = m[2]!.trim().split(/\s+/).map(Number);
      if (m[1] === 'M' || m[1] === 'Q') for (let i = 0; i + 1 < n.length; i += 2) puntos.push([n[i]!, n[i + 1]!]);
    }
  }
  for (const [x, y] of TERMINALES) puntos.push([x - 8, y - 8], [x + 8, y + 8]);
  for (const [x, y] of RANURAS) puntos.push([x, y], [x + 44, y + 16]);
  for (const [x, y, w, h] of CAJAS) puntos.push([x, y], [x + w, y + h]);
  return { puntos };
}
