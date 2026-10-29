// Lo que comparten los reels: la base de marca, la chapa, el cartel final y el reloj de cada pieza.
import { readFileSync } from 'node:fs';
import { REPO, tokens } from './motor.mjs';

/** Lo que se cuenta en los carteles sale de los datos, no se escribe a mano. */
export const datos = (archivo) => JSON.parse(readFileSync(`${REPO}/src/data/${archivo}`, 'utf-8'));

export const CSS_BASE = `
${tokens()}
*{box-sizing:border-box;margin:0}
html,body{width:360px;height:640px;overflow:hidden;background:var(--fondo);color:var(--texto);font-family:var(--fuente)}
body::after{content:'';position:fixed;inset:0;background-image:var(--textura-grano);background-size:140px;opacity:.22;pointer-events:none;z-index:50}
.capa{position:absolute;inset:0}
.logo{position:absolute;top:22px;left:22px;width:62px;rotate:-4deg}
.sello{position:absolute;font-family:var(--fuente-rotulada);text-transform:uppercase;letter-spacing:.04em;border:2px solid currentColor;border-radius:3px;padding:4px 9px;opacity:0}
.premios{position:absolute;left:22px;width:316px;border-collapse:collapse;table-layout:fixed;background:var(--papel);color:var(--fondo);border:2px solid var(--papel-borde);rotate:-.8deg;font-family:var(--fuente-rotulada);text-align:center}
.premios::before{content:'';position:absolute;top:-12px;left:42%;width:70px;height:22px;background:color-mix(in srgb,var(--papel) 35%,transparent);rotate:3deg;border-radius:2px}
.premios th,.premios td{padding:.5rem 0}
.premios th{width:3.6rem;padding-inline:.45rem;text-align:left;font-weight:400;font-size:.58rem;letter-spacing:.08em;color:var(--papel-tenue)}
.premios td{font-size:.74rem;white-space:nowrap;position:relative}
.premios th,.premios td:not(:last-child){border-right:1px dashed var(--papel-borde)}
.premios tr+tr>*{border-top:2px solid var(--papel-borde)}
.premios tr+tr td{font-size:.95rem}
/* El escalón en juego: recuadro de tinta encima de la celda, no solo color. */
.premios td.ahora{background:var(--fondo);color:var(--papel)}
.premios td.paso{color:var(--papel-tenue);text-decoration:line-through 2px}
.cartel{position:absolute;inset:0;background:var(--fondo);padding:150px 30px 0;opacity:0;z-index:20}
.cartel .logo{position:static;width:84px;display:block;margin-bottom:26px}
.cartel h1{font-weight:400;line-height:.95;margin-bottom:18px}
.cartel .canta{font-size:1.06rem;line-height:1.35;margin-bottom:10px}
.cartel .nombra{color:var(--texto-tenue);font-size:.95rem;line-height:1.4}
.cartel .url{display:inline-block;margin-top:30px;font-family:var(--fuente-rotulada);font-size:1.02rem;letter-spacing:.02em;padding:10px 14px;border:3px solid currentColor;border-radius:3px;rotate:-2deg}
`;

/** El reloj de cada pieza: aparecer, sellar, desaparecer. Todo depende de t, nada del reloj real. */
export const JS_BASE = `
const cl=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const suave=x=>1-Math.pow(1-cl(x),3);
const $=s=>document.querySelector(s);
/* Un golpe de sello: entra grande y torcido y se asienta en 0,18 s. */
function sellar(el,t,t0,giro=-2,t1=1e9){
  if(t<t0||t>=t1){el.style.opacity=0;return}
  const k=suave((t-t0)/.18);
  el.style.opacity=1;
  el.style.transform='rotate('+(giro+(1-k)*4)+'deg) scale('+(1.3-.3*k)+')';
}
/* Corte seco con un respiro de 0,12 s: así entra y sale el texto. */
function ver(el,t,t0,t1=1e9,d=.12){el.style.opacity=cl((t-t0)/d)*(1-cl((t-t1)/d))}
`;

export function cartel({ titulo, fuente, color, canta, nombra, url }) {
  return `<section class="cartel" id="cartel" style="color:${color}">
  <img class="logo" src="/marca/fr.svg" alt="">
  <h1 style="font-family:${fuente};font-size:${titulo.length > 16 ? 2.7 : 3.1}rem">${titulo}</h1>
  <p class="canta" style="color:var(--texto)">— ${canta}</p>
  <p class="nombra">${nombra}</p>
  <div class="url">${url}</div>
</section>`;
}

export const pagina = (css, cuerpo, js) =>
  `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=360,initial-scale=1"><style>${CSS_BASE}${css}</style></head><body>${cuerpo}<script>${JS_BASE}${js}</script></body></html>`;
