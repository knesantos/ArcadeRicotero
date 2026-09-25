/**
 * Arma el cancionero que el jugador se lleva.
 *
 * Baja solo los temas elegidos (`/cancionero/<slug>.json`, generados en build), arma un
 * HTML autocontenido y se lo entrega. Sin backend, sin cuenta, sin pedirle nada (`D-14`).
 *
 * **La decisión de fondo: el archivo que sale no depende del sitio.** Nada de enlaces a
 * `/styles/`, nada de fuentes de un CDN, nada que se rompa cuando no hay internet. Todo
 * va adentro. El caso de uso real es una ronda en una casa con mal wifi, y un cancionero
 * que necesita conexión para mostrar los acordes no sirve para eso.
 */

import { renglonDeAcordes, type Marca } from '../lib/cancionero/acordes.ts';
import { tituloDelDisco } from '../lib/letra/discos.ts';

interface LineaJson {
  t: 'letra' | 'tab' | 'anotacion' | 'instrumental';
  texto?: string;
  acordes?: Marca[];
}
interface SeccionJson {
  tipo: string;
  etiqueta: string | null;
  lineas: LineaJson[];
}
interface TemaJson {
  slug: string;
  titulo: string;
  disco: string;
  pista: number;
  anio: number;
  tono: string | null;
  capo: number | null;
  acordesUsados: string[];
  fuente: { sitio: string | null; url: string | null; consultado: string | null };
  secciones: SeccionJson[];
}

const formulario = document.querySelector<HTMLFormElement>('[data-armador]');
const botonArmar = document.querySelector<HTMLButtonElement>('[data-armar]');
const botonLimpiar = document.querySelector<HTMLButtonElement>('[data-limpiar]');
const cuenta = document.querySelector<HTMLElement>('[data-cuenta]');
const estado = document.querySelector<HTMLElement>('[data-estado]');

if (formulario && botonArmar) {
  const marcados = (): HTMLInputElement[] =>
    [...formulario.querySelectorAll<HTMLInputElement>('input[name="tema"]:checked')];

  function actualizar(): void {
    const n = marcados().length;
    if (cuenta) cuenta.textContent = n === 1 ? '1 elegido' : `${n} elegidos`;
    botonArmar!.disabled = n === 0;
  }

  formulario.addEventListener('change', actualizar);

  botonLimpiar?.addEventListener('click', () => {
    for (const c of marcados()) c.checked = false;
    if (estado) estado.textContent = '';
    actualizar();
  });

  botonArmar.addEventListener('click', async () => {
    const elegidos = marcados();
    botonArmar.disabled = true;
    if (estado) estado.textContent = 'Juntando los temas…';

    try {
      // En orden de disco y pista, que es el orden en que están en la página: el que
      // eligió de arriba hacia abajo espera encontrarlos así.
      const slugs = elegidos.map((c) => c.value);
      const temas: TemaJson[] = [];
      for (const slug of slugs) {
        const r = await fetch(`/cancionero/${slug}.json`);
        if (!r.ok) throw new Error(`no pude traer ${slug}`);
        temas.push((await r.json()) as TemaJson);
      }

      const html = armarHtml(temas);
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `cancionero-ricotero-${temas.length}-temas.html`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      // Se libera tarde: en algunos navegadores revocar enseguida cancela la descarga.
      setTimeout(() => URL.revokeObjectURL(url), 60_000);

      if (estado) estado.textContent = `Listo: ${temas.length} temas en un archivo.`;
    } catch (error) {
      if (estado) estado.textContent = 'No pude armarlo. Probá de nuevo.';
      console.error(error);
    } finally {
      actualizar();
    }
  });

  actualizar();
}

/** Escapa para meter texto en HTML. El material viene de un JSON, no de un editor. */
function escapar(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** El renglón de acordes ya espaciado, igual que en la ficha del tema. */
function renglonTexto(marcas: Marca[], tono: string | null): string {
  return renglonDeAcordes(marcas, 0, tono)
    .map((c) => ' '.repeat(c.hueco) + c.acorde)
    .join('');
}

function cuerpoDeTema(tema: TemaJson): string {
  const partes: string[] = [];
  for (const seccion of tema.secciones) {
    partes.push('<section class="sec">');
    const etiqueta = seccion.etiqueta?.replace(/^\[|\]$/g, '').replace(/:$/, '').trim();
    if (etiqueta) partes.push(`<span class="eti">${escapar(etiqueta)}</span>`);
    for (const linea of seccion.lineas) {
      if (linea.t === 'tab' || linea.t === 'anotacion') {
        const clase = linea.t === 'tab' ? 'tab' : 'ano';
        partes.push(`<div class="${clase}">${escapar(linea.texto ?? '')}</div>`);
        continue;
      }
      if (linea.acordes?.length) {
        partes.push(`<div class="ac">${escapar(renglonTexto(linea.acordes, tema.tono))}</div>`);
      }
      if (linea.t === 'letra') partes.push(`<div class="le">${escapar(linea.texto ?? '')}</div>`);
    }
    partes.push('</section>');
  }
  return partes.join('\n');
}

/**
 * El HTML autocontenido.
 *
 * Simplificado a propósito: papel, tinta y monoespaciada. No lleva la marca del sitio ni
 * las tapas — pesarían y el archivo tiene que abrir en cualquier lado. Lo que sí lleva,
 * porque es lo único que no se negocia, es **de dónde salió cada letra**.
 */
function armarHtml(temas: TemaJson[]): string {
  const indice = temas
    .map(
      (t, i) =>
        `<li><a href="#t${i}">${escapar(t.titulo)}</a> <span class="disco">${escapar(
          tituloDelDisco(t.disco),
        )}</span></li>`,
    )
    .join('\n');

  const cuerpos = temas
    .map((tema, i) => {
      const datos = [
        tema.tono ? `tono ${escapar(tema.tono)}` : null,
        tema.capo ? `cejilla en ${tema.capo}` : null,
        `${tema.anio}`,
      ]
        .filter(Boolean)
        .join(' · ');
      const fuente = tema.fuente.sitio
        ? `<p class="fte">Letra y cifrado transcriptos por fans en ${escapar(tema.fuente.sitio)}${
            tema.fuente.consultado ? `, consultada el ${escapar(tema.fuente.consultado)}` : ''
          }.</p>`
        : '';
      return `<article class="tema" id="t${i}">
<h2>${escapar(tema.titulo)}</h2>
<p class="dat">${datos}</p>
${cuerpoDeTema(tema)}
${fuente}
<p class="arriba"><a href="#indice">↑ Volver al índice</a></p>
</article>`;
    })
    .join('\n');

  // El autoscroll del archivo: la misma idea que en el sitio, escrita sin dependencias.
  const isla = `
var andando=false,vel=2,resto=0,ultimo=0;
var b=document.getElementById('solo'),v=document.getElementById('vel');
function paso(ahora){
  if(!andando)return;
  var d=ultimo?ahora-ultimo:16;ultimo=ahora;
  var av=(vel*12*d)/1000+resto,ent=Math.floor(av);resto=av-ent;
  var antes=window.scrollY;
  if(ent>0)window.scrollBy(0,ent);
  if(window.scrollY===antes&&ent>0){frenar();return;}
  requestAnimationFrame(paso);
}
function arrancar(){andando=true;ultimo=0;resto=0;b.textContent='Frenar';b.setAttribute('aria-pressed','true');requestAnimationFrame(paso);}
function frenar(){andando=false;b.textContent='Bajar solo';b.setAttribute('aria-pressed','false');}
b.addEventListener('click',function(){andando?frenar():arrancar();});
document.getElementById('mas').addEventListener('click',function(){vel=Math.min(6,vel+1);v.textContent=vel;});
document.getElementById('menos').addEventListener('click',function(){vel=Math.max(1,vel-1);v.textContent=vel;});
document.addEventListener('visibilitychange',function(){
  if(document.visibilityState!=='visible'||!andando)return;
  ultimo=0;resto=0;requestAnimationFrame(paso);
});
window.addEventListener('wheel',function(){if(andando)frenar();},{passive:true});
window.addEventListener('touchstart',function(){if(andando)frenar();},{passive:true});
`;

  const estilo = `
:root{--fondo:#14100e;--texto:#f4efe2;--tenue:#b7ab99;--tinta:#f0761f;--borde:#3b302a}
*{box-sizing:border-box}
body{margin:0;padding:1rem;background:var(--fondo);color:var(--texto);
 font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;line-height:1.5}
h1{font-size:1.8rem;margin:0 0 .3rem;text-transform:uppercase;color:var(--tinta)}
.sub{color:var(--tenue);margin:0 0 1.5rem;font-size:.9rem}
#indice{max-width:46rem;margin:0 auto 2.5rem}
#indice ol{padding-left:1.2rem}
#indice li{margin:.35rem 0}
#indice a{color:var(--texto)}
.disco{color:var(--tenue);font-size:.8rem}
.tema{max-width:46rem;margin:0 auto 3rem;border-top:3px solid var(--borde);padding-top:1rem}
h2{font-size:1.4rem;margin:0 0 .2rem;text-transform:uppercase;color:var(--tinta)}
.dat{margin:0 0 1rem;color:var(--tenue);font-size:.85rem}
.sec{margin:0 0 1.2rem}
.eti{display:inline-block;margin-bottom:.3rem;padding:2px 8px;border:1px solid var(--borde);
 border-radius:3px;font-size:.62rem;letter-spacing:.1em;text-transform:uppercase;color:var(--tenue)}
.ac,.le,.tab,.ano{font-family:ui-monospace,'Consolas',monospace;font-size:.95rem;line-height:1.35;white-space:pre;overflow-x:auto}
.ac{color:var(--tinta);font-weight:700}
.tab{color:var(--tenue)}
.ano{color:var(--tenue);font-style:italic}
.fte{color:var(--tenue);font-size:.8rem;font-style:italic;margin-top:1rem}
.arriba{font-size:.85rem}
.arriba a{color:var(--tenue)}
#barra{position:sticky;top:0;z-index:2;display:flex;gap:.5rem;align-items:center;
 padding:.5rem 0;margin-bottom:1rem;background:var(--fondo);border-bottom:1px solid var(--borde)}
#barra button{min-height:44px;min-width:44px;padding:0 .8rem;border:2px solid var(--borde);
 border-radius:4px;background:var(--fondo);color:var(--texto);font-size:.9rem;cursor:pointer}
#barra button[aria-pressed=true]{background:var(--tinta);color:var(--fondo)}
#barra span{color:var(--tenue);font-size:.8rem}
@media print{#barra{display:none}body{background:#fff;color:#000}
 h1,h2,.ac{color:#000}.tema{page-break-inside:avoid}}
`;

  const hoy = new Date().toISOString().slice(0, 10);

  return `<!doctype html>
<html lang="es-AR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Cancionero ricotero — ${temas.length} temas</title>
<style>${estilo}</style>
</head>
<body>
<div id="barra">
<button id="solo" type="button" aria-pressed="false">Bajar solo</button>
<button id="menos" type="button" aria-label="Más lento">−</button>
<span id="vel">2</span>
<button id="mas" type="button" aria-label="Más rápido">+</button>
</div>
<div id="indice">
<h1>Cancionero ricotero</h1>
<p class="sub">${temas.length} temas · armado el ${hoy} en Arcade Ricotero</p>
<ol>
${indice}
</ol>
</div>
${cuerpos}
<script>${isla}<\/script>
</body>
</html>`;
}
