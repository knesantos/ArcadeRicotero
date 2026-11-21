/**
 * El papel de «Sacalo por la letra», impreso (ronda de pulida de los juegos, 2026-11-18).
 *
 *   npm run imprimir-papel-por-la-letra
 *
 * El lugar de este juego lo dice su portada: "un papel arrugado te pesa en el bolsillo". Deja en
 * `public/arte/por-la-letra/` las piezas de ese papel y de ese bolsillo. Son **máscaras**: cada
 * archivo trae solo la forma de una pasada, y la tinta la pone `juego.css` desde `tokens.css`
 * (el papel de las etiquetas, el peltre de *Momo Sampler* para el lápiz y el hilo, el rojo del
 * error para el tachón). Ningún color nuevo.
 *
 *   · `arrugas.webp`   — los quiebres del papel arrugado y sus pecas. Baldosa que se repite: los
 *                        quiebres no tocan el borde, así que no hay costura.
 *   · `garabato.webp`  — renglones de letra que no se llega a leer: lo escrito del lado de
 *                        adentro, visto con el papel doblado. No es ninguna letra de ningún tema.
 *   · `tachon.webp`    — el tachón de lápiz, de ida y vuelta, para lo que se arriesgó y no era.
 *   · `birome-cuerpo.webp`, `birome-clip.webp` — la birome que asoma del bolsillo.
 *   · `sarga.webp`     — la tela del jean, en baldosa que cierra: la banda de la partida y la
 *                        mesa del resultado.
 *   · `bolsillo-tela.webp`, `bolsillo-costura.webp` — el bolsillo de atrás del jean: la sarga y
 *                        el pespunte doble con sus remaches.
 *
 * El canto irregular y la falta de tinta **se imprimen acá, una vez** (un desplazamiento y un
 * ruido de SVG que `sharp` vuelve píxeles); el teléfono no filtra nada, solo mueve
 * (`bestiario-inmersion.md` §1). Es dibujo propio. El azar tiene semilla: correrlo dos veces da
 * los mismos archivos.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const SALIDA = 'public/arte/por-la-letra';
mkdirSync(SALIDA, { recursive: true });

function azar(semilla) {
  let a = semilla >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const r1 = (n) => Math.round(n * 10) / 10;

/**
 * La mano: el trazo se corre un poco (el pulso) y pierde tinta a manchas (el grano del papel).
 * `falta` es cuánta tinta se pierde: 0 nada, 1 casi toda.
 */
const mano = (id, { pulso = 2.2, grano = 0.9, falta = 0.35, semilla = 3 } = {}) => `
  <filter id="${id}" x="-5%" y="-5%" width="110%" height="110%">
    <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="${semilla}" result="p"/>
    <feDisplacementMap in="SourceGraphic" in2="p" scale="${pulso}" xChannelSelector="R" yChannelSelector="G" result="t"/>
    <feTurbulence type="fractalNoise" baseFrequency="${grano}" numOctaves="2" seed="${semilla + 8}" result="g"/>
    <feColorMatrix in="g" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 8 ${r1(-8 * (0.27 + falta * 0.22))}" result="h"/>
    <feComposite in="t" in2="h" operator="in"/>
  </filter>`;

async function imprimir(nombre, ancho, alto, cuerpo, defs = '', escala = 1) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ancho}" height="${alto}" viewBox="0 0 ${ancho} ${alto}"><defs>${defs}</defs>${cuerpo}</svg>`;
  const datos = await sharp(Buffer.from(svg))
    .resize(Math.round(ancho * escala))
    .webp({ quality: 82, alphaQuality: escala < 1 ? 45 : 88, effort: 6 }).toBuffer();
  writeFileSync(`${SALIDA}/${nombre}.webp`, datos);
  console.log(`${nombre}.webp`, `${ancho}×${alto}`, `${(datos.length / 1024).toFixed(1)} KiB`);
}

// ---------------------------------------------------------------- las arrugas

{
  const rnd = azar(1998);
  const L = 420;
  const M = 26; // nada toca el borde: la baldosa cierra sin costura
  const tramos = [];
  // Quiebres largos: una línea quebrada en dos o tres tramos, casi recta, como queda un papel
  // que se hizo un bollo y se alisó con la mano.
  for (let i = 0; i < 11; i++) {
    let x = M + rnd() * (L - 2 * M);
    let y = M + rnd() * (L - 2 * M);
    let ang = rnd() * Math.PI;
    const pts = [[x, y]];
    const cuantos = 2 + Math.floor(rnd() * 2);
    for (let k = 0; k < cuantos; k++) {
      const largo = 50 + rnd() * 110;
      ang += (rnd() - 0.5) * 0.9;
      const nx = x + Math.cos(ang) * largo;
      const ny = y + Math.sin(ang) * largo;
      // El quiebre que se sale de la baldosa se corta ahí (ronda 2): aplastarlo contra el
      // margen dejaba líneas rectas, verticales y horizontales, que se leían como una caja.
      if (nx < M || nx > L - M || ny < M || ny > L - M) break;
      x = nx;
      y = ny;
      pts.push([x, y]);
    }
    if (pts.length < 2) continue;
    const d = `M${pts.map(([a, b]) => `${r1(a)} ${r1(b)}`).join('L')}`;
    tramos.push(`<path d="${d}" stroke-width="${r1(1.1 + rnd() * 0.8)}"/>`);
    // De cada quiebre sale alguno más corto.
    if (rnd() > 0.35) {
      const [bx, by] = pts[1];
      const a2 = ang + 1.2 + rnd();
      const l2 = 24 + rnd() * 46;
      const ex = bx + Math.cos(a2) * l2;
      const ey = by + Math.sin(a2) * l2;
      if (ex > M && ex < L - M && ey > M && ey < L - M)
        tramos.push(`<path d="M${r1(bx)} ${r1(by)}L${r1(ex)} ${r1(ey)}" stroke-width="1.3"/>`);
    }
  }
  // Las pecas del papel: puntos sueltos, pocos.
  const pecas = [];
  for (let i = 0; i < 30; i++) {
    pecas.push(`<circle cx="${r1(M + rnd() * (L - 2 * M))}" cy="${r1(M + rnd() * (L - 2 * M))}" r="${r1(0.5 + rnd() * 0.9)}"/>`);
  }
  await imprimir(
    'arrugas',
    L,
    L,
    `<g filter="url(#m)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round">${tramos.join('')}</g>
     <g fill="#fff" opacity="0.8">${pecas.join('')}</g>`,
    mano('m', { pulso: 3, grano: 0.5, falta: 0.55, semilla: 5 }),
  );
}

// ---------------------------------------------------------------- el garabato

{
  const rnd = azar(1987);
  const W = 520;
  const H = 300;
  const renglones = [];
  for (let n = 0; n < 5; n++) {
    const base = 44 + n * 54;
    let x = 22 + rnd() * 14;
    const fin = W - 30 - (n === 4 ? 190 : rnd() * 120);
    let d = '';
    while (x < fin) {
      // Una palabra: una seguidilla de lomos, con algún palo que sube o que baja.
      const letras = 3 + Math.floor(rnd() * 6);
      d += `M${r1(x)} ${r1(base)}`;
      for (let k = 0; k < letras; k++) {
        const paso = 9 + rnd() * 7;
        const tipo = rnd();
        const alto = tipo > 0.82 ? -30 - rnd() * 8 : tipo < 0.1 ? 16 + rnd() * 6 : -9 - rnd() * 9;
        d += `q${r1(paso * 0.35)} ${r1(alto)} ${r1(paso * 0.6)} ${r1(alto * 0.15)}t${r1(paso * 0.4)} ${r1(-alto * 0.15)}`;
        x += paso;
      }
      x += 15 + rnd() * 13;
    }
    renglones.push(`<path d="${d}"/>`);
  }
  await imprimir(
    'garabato',
    W,
    H,
    `<g filter="url(#m)" fill="none" stroke="#fff" stroke-width="3.1" stroke-linecap="round" stroke-linejoin="round">${renglones.join('')}</g>`,
    mano('m', { pulso: 2.4, grano: 0.8, falta: 0.3, semilla: 9 }),
  );
}

// ---------------------------------------------------------------- el tachón

{
  const rnd = azar(1991);
  const W = 640;
  const H = 96;
  // Tres pasadas de lápiz de ida y vuelta, apretando: cada una un poco más corta y más corrida.
  let d = `M14 ${r1(H / 2 + 6)}`;
  let ida = true;
  for (let k = 0; k < 5; k++) {
    const x = ida ? W - 16 - rnd() * 26 : 14 + rnd() * 30;
    const y = H / 2 + (rnd() - 0.5) * 30;
    const cx = W / 2 + (rnd() - 0.5) * 90;
    const cy = y + (rnd() - 0.5) * 22;
    d += `Q${r1(cx)} ${r1(cy)} ${r1(x)} ${r1(y)}`;
    ida = !ida;
  }
  await imprimir(
    'tachon',
    W,
    H,
    `<g filter="url(#m)" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></g>`,
    mano('m', { pulso: 4, grano: 0.7, falta: 0.5, semilla: 4 }),
  );
}

// ---------------------------------------------------------------- la birome

{
  /*
   * La birome que asoma del bolsillo (ronda 3): la mitad de arriba, que es lo que se ve. El
   * cuerpo —el pulsador, la virola y el caño facetado— va en una máscara y el clip en otra,
   * porque llevan tintas distintas (la plata y el peltre de la tapa).
   */
  const W = 120;
  const H = 300;
  await imprimir(
    'birome-cuerpo',
    W,
    H,
    `<g filter="url(#m)" fill="#fff">
       <rect x="36" y="8" width="26" height="40" rx="6"/>
       <rect x="26" y="46" width="46" height="254" rx="5"/>
     </g>
     <g stroke="#000" stroke-width="3" fill="none" opacity="0.55">
       <path d="M26 76H72M40 84V300M58 84V300"/>
     </g>`,
    mano('m', { pulso: 1.6, grano: 0.7, falta: 0.12, semilla: 31 }),
  );
  await imprimir(
    'birome-clip',
    W,
    H,
    `<g filter="url(#m)" fill="#fff">
       <path d="M68 52H92Q100 52 100 60V214Q100 226 91 226Q82 226 82 214V70H68Z"/>
       <rect x="24" y="64" width="50" height="10" rx="2"/>
     </g>`,
    mano('m', { pulso: 1.4, grano: 0.7, falta: 0.1, semilla: 33 }),
  );
}

// ---------------------------------------------------------------- la sarga del jean

{
  /*
   * La tela del jean, en una baldosa que cierra (ronda 2): la banda del medio de la partida y la
   * mesa del resultado son jean de lado a lado, y el bolsillo va cosido encima. Las rayas van a
   * 45° con un paso que divide justo al lado de la baldosa, y la falta de tinta sale de un ruido
   * cosido (`stitchTiles`), sin desplazamiento: así no hay costura al repetir.
   */
  const L = 416;
  const rayas = [];
  for (let x = -L; x < L; x += 13) rayas.push(`M${x} 0L${x + L} ${L}`);
  await imprimir(
    'sarga',
    L,
    L,
    `<g filter="url(#s)"><path d="${rayas.join('')}" stroke="#fff" stroke-width="5.2" fill="none"/></g>`,
    `<filter id="s" x="0" y="0" width="1" height="1">
       <feTurbulence type="fractalNoise" baseFrequency="0.3" numOctaves="2" seed="12" stitchTiles="stitch" result="g"/>
       <feColorMatrix in="g" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 8 -3.3" result="h"/>
       <feComposite in="SourceGraphic" in2="h" operator="in"/>
     </filter>`,
    0.5,
  );
}

// ---------------------------------------------------------------- el bolsillo

{
  const W = 760;
  const H = 860;
  // El bolsillo de atrás de un jean: boca arriba, costados que cierran apenas y la punta abajo.
  const forma = (m) =>
    `M${m} ${m}L${W - m} ${m}L${W - m - 22} ${H * 0.74}L${W / 2} ${H - m * 1.25}L${m + 22} ${H * 0.74}Z`;
  // La sarga: rayas en diagonal, parejas, que la falta de tinta rompe.
  const rayas = [];
  for (let x = -H; x < W; x += 13) rayas.push(`M${x} 0L${x + H} ${H}`);
  await imprimir(
    'bolsillo-tela',
    W,
    H,
    `<clipPath id="c"><path d="${forma(8)}"/></clipPath>
     <g clip-path="url(#c)"><g filter="url(#m)"><path d="${rayas.join('')}" stroke="#fff" stroke-width="5.2" fill="none"/></g></g>`,
    mano('m', { pulso: 2, grano: 0.3, falta: 0.62, semilla: 12 }),
    // La sarga es una trama pareja: a mitad de tamaño pesa la cuarta parte y se ve igual.
    0.5,
  );
  // El pespunte: doble, de puntada larga, y el dobladillo de la boca. Dos remaches arriba.
  const remache = (x, y) =>
    `<circle cx="${x}" cy="${y}" r="13" fill="none" stroke="#fff" stroke-width="5"/><circle cx="${x}" cy="${y}" r="3.5" fill="#fff"/>`;
  await imprimir(
    'bolsillo-costura',
    W,
    H,
    `<g filter="url(#m)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round">
       <path d="${forma(8)}" stroke-width="3.4"/>
       <path d="${forma(30)}" stroke-width="3.6" stroke-dasharray="19 11"/>
       <path d="${forma(46)}" stroke-width="3.6" stroke-dasharray="19 11" stroke-dashoffset="9"/>
       <path d="M30 86H${W - 30}" stroke-width="3.6" stroke-dasharray="19 11"/>
       ${remache(32, 32)}${remache(W - 32, 32)}
     </g>`,
    mano('m', { pulso: 2.6, grano: 0.8, falta: 0.2, semilla: 21 }),
  );
}
