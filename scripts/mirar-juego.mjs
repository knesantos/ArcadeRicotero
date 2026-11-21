/**
 * Para mirar un juego estado por estado (ronda de pulida de los juegos, 2026-11-17).
 *
 *   node scripts/mirar-juego.mjs <juego> <carpeta-de-salida> [opciones]
 *
 *   <juego>               `adivinar-el-tema`, o cualquier ruta del sitio (`/quiz/`): de las que no
 *                         tienen recorrido propio saca la portada y la primera pantalla de partida.
 *   --base <url>          Dónde está servido el sitio. Por defecto http://localhost:4340.
 *   --tamanos 430x860,1280x800   Las ventanas. Por defecto, esas dos.
 *   --sin-quieto          Saltea la pasada con movimiento reducido.
 *   --solo-quieto         Hace solo esa.
 *   --perfil <carpeta>    El perfil del navegador. Por defecto, `edge-perfil` al lado de la salida.
 *   --sin-dedo            En las ventanas angostas el navegador se presenta como un teléfono
 *                         (pantalla táctil, sin mouse): así no sale lo que el sitio muestra solo
 *                         con puntero fino. Con esto, se presenta como una compu angosta.
 *   --peor                En "Más o menos" y en "Armá tu recital": el peor dato (lo más largo
 *                         que el juego puede mostrar), para mirarlo en los diez tamaños.
 *   --entero              Hace de cuenta que todos los temas tienen el archivo entero (`D-22`),
 *                         para mirar cómo queda la revelación con el reproductor del tema.
 *
 * Recorre los estados de una partida —portada, partida, sonando, error, acierto, revelación,
 * el paso de un tema al otro y el resultado— y deja dos clases de imagen:
 *
 *   <ancho>[-quieto]-NN-<estado>.png        una captura quieta del estado;
 *   <ancho>[-quieto]-tira-NN-<momento>.png  seis cuadros seguidos de una animación, lado a lado.
 *
 * **Una animación se juzga en una tira, no en una captura quieta** (`bestiario-inmersion.md`
 * §7). Para que los seis cuadros caigan adentro de una animación de 300 ms, el navegador corre
 * las animaciones de CSS más lentas mientras se saca la tira (`lento`), y la tira lo dice en su
 * nombre. Lo que mueve un reloj de JavaScript —la cuenta del puntaje, la inercia del carrete— no
 * se frena: esas tiras se sacan a velocidad real.
 *
 * El sitio tiene que estar servido (`npm run build` y `npx astro preview --port 4340`). El
 * perfil del navegador va adentro de la carpeta temporal de la tarea, nunca suelto en %TEMP%
 * (`bestiario-inmersion.md` §10). No escribe nada en el repo.
 */

import { mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';

const args = process.argv.slice(2);
const opcion = (nombre, porDefecto) => {
  const i = args.indexOf(nombre);
  return i >= 0 ? args[i + 1] : porDefecto;
};
const bandera = (nombre) => args.includes(nombre);
const posicionales = args.filter((a, i) => !a.startsWith('--') && !(args[i - 1] ?? '').match(/^--(base|tamanos|perfil)$/));

const [juego, salidaCruda] = posicionales;
if (!juego || !salidaCruda) {
  console.error('uso: node scripts/mirar-juego.mjs <juego> <carpeta-de-salida> [--base url] [--tamanos 430x860,1280x800]');
  process.exit(1);
}
const salida = resolve(salidaCruda);
const base = opcion('--base', 'http://localhost:4340').replace(/\/$/, '');
const tamanos = opcion('--tamanos', '430x860,1280x800')
  .split(',')
  .map((t) => t.split('x').map(Number));
const perfil = resolve(opcion('--perfil', join(salida, '..', 'edge-perfil')));
const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
if (perfil.startsWith(raiz)) throw new Error('el perfil del navegador no va adentro del repo');
mkdirSync(salida, { recursive: true });

const EDGE = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
].find((r) => existsSync(r));
if (!EDGE) throw new Error('no encontré Edge ni Chrome para sacar las capturas');

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

/** Lo que cada recorrido recibe: la página y las dos maneras de mirar. */
async function abrir(nav, ancho, alto, quieto) {
  const pagina = await nav.newPage();
  // Un teléfono no tiene mouse. Sin esto, a 430 px el navegador decía `pointer: fine` y salía
  // en la foto lo que el sitio guarda para la compu (la leyenda de las teclas de «¿Qué tipo de
  // ricotero sos?» se vio así en la auditoría de base, y en el teléfono no está).
  const dedo = ancho < 768 && !bandera('--sin-dedo');
  await pagina.setViewport({ width: ancho, height: alto, deviceScaleFactor: 1, hasTouch: dedo, isMobile: dedo });
  await pagina.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: quieto ? 'reduce' : 'no-preference' }]);
  // Contra `astro dev` (--base), la barra de herramientas de Astro flota abajo y se come los
  // toques de la zona del pulgar: no es del sitio, así que no sale en la foto ni recibe clics.
  await pagina.evaluateOnNewDocument(() => {
    const estilo = document.createElement('style');
    estilo.textContent = 'astro-dev-toolbar{display:none!important}';
    document.addEventListener('DOMContentLoaded', () => document.head.append(estilo));
  });
  const cdp = await pagina.createCDPSession();
  await cdp.send('Animation.enable');
  const prefijo = `${ancho}${quieto ? '-quieto' : ''}`;
  let n = 0;
  const numero = () => String(++n).padStart(2, '0');

  const ctx = {
    pagina,
    ancho,
    alto,
    quieto,
    espera,
    /** Una captura quieta. Con `entera`, la hoja completa y no solo la ventana. */
    async foto(nombre, { entera = false } = {}) {
      const ruta = join(salida, `${prefijo}-${numero()}-${nombre}.png`);
      /*
       * El grano de la pantalla es una capa FIJA (`body::after`). En una captura de la hoja
       * entera el navegador la pinta solo sobre la primera ventana, y lo que queda más abajo
       * sale sin grano: un botón que cruza esa línea se ve de dos tonos. No es un defecto del
       * sitio (así se vio "Volvé al fichín" en las rondas 1 y 2): es de la captura. Para la
       * foto entera la capa pasa a medir la hoja, y después vuelve a como estaba.
       */
      let parche = null;
      if (entera) {
        parche = await pagina.addStyleTag({
          content: 'html{position:relative}body::after{position:absolute!important;inset:0!important;height:auto!important}',
        });
      }
      await pagina.screenshot({ path: ruta, fullPage: entera });
      if (parche) await parche.evaluate((n) => n.remove());
      console.log('foto', ruta);
    },
    /**
     * Seis cuadros de una animación, lado a lado. `disparar` es lo que la arranca; `ms` es lo
     * que dura de verdad; `lento` es cuánto se frenan las animaciones de CSS para sacarla (1 es
     * velocidad real, y es lo que va para lo que mueve un reloj de JavaScript o el audio).
     */
    async tira(nombre, disparar, { ms = 400, lento = 0.1, cuadros = 6, asentar = true, sobre = null } = {}) {
      if (quieto) {
        // Con movimiento reducido no hay animación que mirar: se dispara y se saca una sola.
        await disparar();
        await espera(250);
        return ctx.foto(`${nombre}-quieto`);
      }
      await cdp.send('Animation.setPlaybackRate', { playbackRate: lento });
      const total = ms / lento;
      // `sobre`: la tira se saca solo de esa pieza (el tubo de un juego de pixel), no de la
      // ventana entera. Recortada, cada captura tarda menos —entran más cuadros adentro de un
      // salto— y se agranda sin suavizar para poder contarle los píxeles.
      const caja = sobre ? await (await pagina.$(sobre))?.boundingBox() : null;
      const clip = caja
        ? { x: Math.max(0, Math.floor(caja.x) - 4), y: Math.max(0, Math.floor(caja.y) - 4), width: Math.ceil(caja.width) + 8, height: Math.ceil(caja.height) + 8 }
        : null;
      const zoom = clip ? Math.max(1, Math.min(3, Math.floor(820 / clip.width))) : 1;
      const fotos = [];
      const momentos = [];
      const t0 = Date.now();
      await disparar();
      for (let i = 0; i < cuadros; i++) {
        const cuando = (total * i) / (cuadros - 1);
        const falta = cuando - (Date.now() - t0);
        if (falta > 0) await espera(falta);
        fotos.push(await pagina.screenshot({ optimizeForSpeed: true, ...(clip ? { clip } : {}) }));
        momentos.push(Date.now() - t0);
      }
      // A velocidad real una captura tarda lo suyo: se dice cuándo cayó cada cuadro de verdad.
      if (lento === 1) console.log(`   (${nombre}: cuadros a ${momentos.join(', ')} ms)`);
      await cdp.send('Animation.setPlaybackRate', { playbackRate: 1 });
      // Lo que quedó a medio camino termina a velocidad real antes de seguir.
      // (Salvo que la tira siga en otra: `asentar: false` las encadena sin soltar el reloj.)
      if (asentar) await espera(Math.min(ms * 2, 1500));
      const hueco = 6;
      const ruta = join(salida, `${prefijo}-tira-${numero()}-${nombre}${lento < 1 ? `-lento-x${Math.round(1 / lento)}` : ''}.png`);
      const anchoCuadro = clip ? clip.width * zoom : ancho;
      const altoCuadro = clip ? clip.height * zoom : alto;
      const piezas = clip
        ? await Promise.all(fotos.map((f) => sharp(f).resize(anchoCuadro, altoCuadro, { kernel: 'nearest' }).png().toBuffer()))
        : fotos;
      // Recortada, la tira va en dos renglones de tres: seis tubos en fila no entran en una pantalla.
      const porRenglon = clip ? Math.ceil(cuadros / 2) : cuadros;
      const renglones = Math.ceil(cuadros / porRenglon);
      await sharp({
        create: {
          width: porRenglon * anchoCuadro + (porRenglon - 1) * hueco,
          height: renglones * altoCuadro + (renglones - 1) * hueco,
          channels: 3,
          background: '#ff00ff',
        },
      })
        .composite(
          piezas.map((f, i) => ({
            input: f,
            left: (i % porRenglon) * (anchoCuadro + hueco),
            top: Math.floor(i / porRenglon) * (altoCuadro + hueco),
          })),
        )
        .png()
        .toFile(ruta);
      console.log('tira', ruta);
    },
    /**
     * **Una ráfaga**: todos los cuadros que el navegador pinta en un rato, uno detrás del otro, en
     * una grilla. Para lo que dura menos que el hueco entre dos capturas de una tira —el peso de
     * un aterrizaje son seis cuadros— no alcanza con seis fotos: acá se le pide al navegador su
     * propia filmación (`Page.startScreencast`) y se pegan los cuadros entre `desde` y `hasta`
     * milisegundos después de `disparar`. `sobre` recorta a una pieza y `zoom` la agranda sin
     * suavizar (1 es tal cual se ve). A velocidad real, siempre.
     */
    async rafaga(nombre, disparar, { desde = 0, hasta = 600, sobre = null, zoom = 1, porRenglon = 6, tope = 24, cada = 1 } = {}) {
      if (quieto) {
        await disparar();
        await espera(hasta);
        return ctx.foto(`${nombre}-quieto`);
      }
      const caja = sobre ? await (await pagina.$(sobre))?.boundingBox() : null;
      const clip = caja
        ? { left: Math.max(0, Math.floor(caja.x) - 4), top: Math.max(0, Math.floor(caja.y) - 4), width: Math.ceil(caja.width) + 8, height: Math.ceil(caja.height) + 8 }
        : { left: 0, top: 0, width: ancho, height: alto };
      const cuadros = [];
      const alLlegar = async (c) => {
        cuadros.push({ t: Date.now(), datos: c.data });
        await cdp.send('Page.screencastFrameAck', { sessionId: c.sessionId }).catch(() => {});
      };
      cdp.on('Page.screencastFrame', alLlegar);
      await cdp.send('Page.startScreencast', { format: 'png', everyNthFrame: 1 });
      await espera(120);
      const t0 = Date.now();
      await disparar();
      await espera(hasta + 60);
      await cdp.send('Page.stopScreencast');
      cdp.off('Page.screencastFrame', alLlegar);
      // `cada`: de un momento largo se queda con uno de cada tantos cuadros, para que la grilla se lea.
      const elegidos = cuadros
        .filter((c) => c.t - t0 >= desde && c.t - t0 <= hasta)
        .filter((_, i) => i % cada === 0)
        .slice(0, tope);
      if (elegidos.length === 0) throw new Error(`la ráfaga «${nombre}» no trajo ningún cuadro`);
      console.log(`   (${nombre}: ${elegidos.length} cuadros de ${cuadros.length}, a ${elegidos.map((c) => c.t - t0).join(', ')} ms)`);
      const piezas = await Promise.all(
        elegidos.map(async (c) => {
          const imagen = sharp(Buffer.from(c.datos, 'base64'));
          const meta = await imagen.metadata();
          // La filmación viene en píxeles de dispositivo: se lleva el recorte a esa escala.
          const k = (meta.width ?? ancho) / ancho;
          return imagen
            .extract({
              left: Math.round(clip.left * k),
              top: Math.round(clip.top * k),
              width: Math.min(Math.round(clip.width * k), (meta.width ?? 0) - Math.round(clip.left * k)),
              height: Math.min(Math.round(clip.height * k), (meta.height ?? 0) - Math.round(clip.top * k)),
            })
            .resize(clip.width * zoom, clip.height * zoom, { kernel: 'nearest' })
            .png()
            .toBuffer();
        }),
      );
      const hueco = 4;
      const anchoCuadro = clip.width * zoom;
      const altoCuadro = clip.height * zoom;
      const renglones = Math.ceil(piezas.length / porRenglon);
      const ruta = join(salida, `${prefijo}-rafaga-${numero()}-${nombre}.png`);
      await sharp({
        create: {
          width: porRenglon * anchoCuadro + (porRenglon - 1) * hueco,
          height: renglones * altoCuadro + (renglones - 1) * hueco,
          channels: 3,
          background: '#ff00ff',
        },
      })
        .composite(piezas.map((f, i) => ({ input: f, left: (i % porRenglon) * (anchoCuadro + hueco), top: Math.floor(i / porRenglon) * (altoCuadro + hueco) })))
        .png()
        .toFile(ruta);
      console.log('rafaga', ruta);
    },
  };
  return ctx;
}

// ---------------------------------------------------------------- los recorridos

/** "Adiviná el tema": la partida entera, con un error, un acierto, un tema que se escapa y el resultado. */
async function adivinarElTema(ctx) {
  const { pagina, foto, tira } = ctx;
  const url = `${base}/juegos/adivinar-el-tema/`;

  // El juego no dice cuál es el tema que suena, pero lo baja: el orden en que pide los
  // fragmentos es el orden de la vuelta (el que suena primero, después los dos que siguen).
  const vuelta = [];
  pagina.on('request', (pedido) => {
    const m = pedido.url().match(/\/audio\/fragmentos\/([^/]+)\.mp3/);
    if (m && !vuelta.includes(m[1])) vuelta.push(m[1]);
  });

  if (bandera('--entero')) {
    await pagina.setRequestInterception(true);
    pagina.on('request', async (pedido) => {
      if (pedido.isInterceptResolutionHandled()) return;
      // El tema "entero" de mentira: el fragmento de diez segundos, servido en su lugar. Así
      // el reproductor del tema entero tiene con qué sonar aunque no haya ningún mp3 entero.
      const entero = pedido.url().match(/\/audio\/temas\/([^/]+)\.mp3/);
      if (entero) {
        const fragmento = await fetch(`${base}/audio/fragmentos/${entero[1]}.mp3`);
        return pedido.respond({
          status: 200,
          contentType: 'audio/mpeg',
          body: Buffer.from(await fragmento.arrayBuffer()),
        });
      }
      if (pedido.resourceType() !== 'document') return pedido.continue();
      const respuesta = await fetch(pedido.url());
      const html = (await respuesta.text()).replaceAll('"entero":false', '"entero":true');
      return pedido.respond({ status: 200, contentType: 'text/html; charset=utf-8', body: html });
    });
  }

  await pagina.goto(url, { waitUntil: 'networkidle0' });
  await tira('portada-entra', () => pagina.reload({ waitUntil: 'domcontentloaded' }), { ms: 900 });
  await foto('portada');
  await foto('portada-entera', { entera: true });

  // La tecla apretada: se baja el dedo sobre "Empezá" y no se levanta.
  const jugar = await pagina.$('#jugar');
  const caja = await jugar.boundingBox();
  await pagina.mouse.move(caja.x + caja.width / 2, caja.y + caja.height / 2);
  await pagina.mouse.down();
  await ctx.espera(150);
  await foto('portada-tecla-apretada');
  // Al soltar, el casete de la portada arranca y la pantalla pasa a la partida.
  // Al soltar, el casete de la portada viaja a su lugar en la partida.
  await tira('casete-viaja', () => pagina.mouse.up(), { ms: 420 });
  await ctx.espera(900);

  const catalogo = await pagina.evaluate(() => JSON.parse(document.getElementById('catalogo').textContent));
  const tituloDe = (slug) => catalogo.find((t) => t.slug === slug)?.titulo;
  const elQueSuena = async (i) => {
    for (let k = 0; k < 40 && !vuelta[i]; k++) await ctx.espera(100);
    if (!vuelta[i]) throw new Error(`no pude saber cuál es el tema ${i + 1} de la vuelta`);
    return vuelta[i];
  };

  const escribir = async (texto) => {
    await pagina.click('.buscador-caja', { clickCount: 3 });
    await pagina.keyboard.press('Backspace');
    await pagina.type('.buscador-caja', texto);
    await ctx.espera(250);
  };
  const elegir = async (titulo) => {
    const botones = await pagina.$$('.sugerencia:not(:disabled)');
    for (const b of botones) {
      const t = await b.$eval('.sugerencia-titulo', (n) => n.textContent);
      if (t === titulo) return b.click();
    }
    throw new Error(`"${titulo}" no salió en la lista`);
  };
  const boton = () => pagina.click('.arriesgar');

  await foto('partida');
  await foto('partida-entera', { entera: true });

  // ---- tema 1: un error, dos pases, se escucha, y se saca.
  const uno = await elQueSuena(0);
  const otro = catalogo.find((t) => t.slug !== uno && t.titulo.length > 8 && t.titulo.length < 22);
  await escribir(otro.titulo.slice(0, 5));
  await foto('sugerencias');
  await escribir(otro.titulo);
  await foto('sugerencia-exacta');
  // Elegir: la ficha se pega en el campo.
  await tira('elige', () => elegir(otro.titulo), { ms: 420 });
  await foto('elegido');
  // El interruptor de los ruidos: se apaga, se mira, y se vuelve a prender.
  // En el teléfono, mientras el buscador tiene el foco (el teclado abierto) las dos puertas
  // chicas de la cabina se esconden a propósito (`.partida--tecleando`): se suelta el foco antes.
  await pagina.evaluate(() => document.activeElement instanceof HTMLElement && document.activeElement.blur());
  await ctx.espera(200);
  // Solo si está a la vista: presentado como teléfono, el interruptor puede no tener caja.
  if (await (await pagina.$('.ruidos'))?.boundingBox()) {
    await pagina.click('.ruidos');
    await ctx.espera(150);
    await foto('ruidos-apagados');
    console.log(
      'ruidos:',
      await pagina.$eval('.ruidos', (b) => `${b.textContent} | aria-pressed=${b.getAttribute('aria-pressed')}`),
      '| guardado:',
      await pagina.evaluate(() => {
        try {
          return localStorage.getItem('fichin:ruidos');
        } catch {
          return 'sin almacenamiento';
        }
      }),
    );
    await pagina.click('.ruidos');
    await ctx.espera(150);
  }
  await tira('error', boton, { ms: 440 });
  await ctx.espera(900);
  await foto('tras-el-error');
  await tira('pasar', boton, { ms: 420 });
  await ctx.espera(2400);
  await boton();
  await ctx.espera(4600);
  await foto('con-tres-gastados');

  // Sonando: el fragmento de cuatro segundos, a velocidad real.
  await tira('sonando', () => pagina.click('.escuchar'), { ms: 3000, lento: 1 });
  await ctx.espera(400);
  await pagina.click('.escuchar');
  await ctx.espera(900);
  // Y parar a mitad de camino: el carrete frena con inercia.
  await tira('frena', () => pagina.click('.escuchar'), { ms: 700, lento: 1 });
  await ctx.espera(600);

  await escribir(tituloDe(uno));
  await elegir(tituloDe(uno));
  await ctx.espera(200);
  await tira('acierto', boton, { ms: 1400 });
  await ctx.espera(1200);
  await foto('revelacion-acierto');
  await foto('revelacion-acierto-entera', { entera: true });
  // El tema entero (`--entero`): suena, se avanza con el teclado y se para.
  if (await pagina.$('.entero-tecla')) {
    await pagina.click('.entero-tecla');
    await ctx.espera(1600);
    await foto('entero-sonando');
    await pagina.focus('.entero-avance');
    for (let i = 0; i < 4; i++) await pagina.keyboard.press('ArrowRight');
    await ctx.espera(400);
    await foto('entero-avanzado-con-teclado');
    console.log(
      'entero:',
      await pagina.$eval('.entero-avance', (r) =>
        [r.getAttribute('aria-label'), r.getAttribute('aria-valuetext'), r.value].join(' | '),
      ),
      '·',
      await pagina.$eval('.entero-tecla', (b) => b.textContent),
    );
    await pagina.click('.entero-tecla');
    await ctx.espera(500);
  }
  if (await pagina.$('.estampa-girar')) {
    await pagina.click('.estampa-girar');
    await ctx.espera(700);
    await foto('revelacion-dada-vuelta');
    await pagina.click('.estampa-girar');
    await ctx.espera(400);
  }

  // ---- el paso al tema 2: la cinta se rebobina.
  await tira('tema-siguiente', () => pagina.click('.seguir'), { ms: 420 });
  await foto('tema-2');

  // ---- tema 2: un pase y se saca. Dos seguidos: aparece la racha.
  const dos = await elQueSuena(1);
  await boton();
  await ctx.espera(900);
  await escribir(tituloDe(dos));
  await elegir(tituloDe(dos));
  await ctx.espera(200);
  await boton();
  await ctx.espera(2600);
  // La racha está en la cabecera: se sube la hoja para que entre en la foto.
  await pagina.evaluate(() => window.scrollTo(0, 0));
  await ctx.espera(150);
  await foto('racha-de-dos');
  await pagina.click('.seguir');
  await ctx.espera(700);

  // ---- tema 3: de una, con la décima. La hazaña.
  const tres = await elQueSuena(2);
  await escribir(tituloDe(tres));
  await elegir(tituloDe(tres));
  await ctx.espera(200);
  await tira('hazana', boton, { ms: 1500 });
  await ctx.espera(1500);
  await foto('hazana');
  await foto('hazana-entera', { entera: true });
  await pagina.click('.seguir');
  await ctx.espera(700);

  // ---- tema 4: se escapa. Seis pases; el último es la revelación en una tinta.
  for (let i = 0; i < 5; i++) {
    await boton();
    await ctx.espera(350);
  }
  await pagina.click('.escuchar').catch(() => {});
  await ctx.espera(300);
  await foto('ultimo-intento');
  await tira('se-escapa', boton, { ms: 900 });
  await ctx.espera(800);
  await foto('revelacion-fallo');
  await foto('revelacion-fallo-entera', { entera: true });
  await tira('resultado-entra', () => pagina.click('.seguir'), { ms: 1000 });
  await ctx.espera(900);
  await foto('resultado');
  await foto('resultado-entero', { entera: true });
}

/**
 * «¿Qué tipo de ricotero sos?»: la noche entera. La portada, el libro que se abre, cada uno de
 * los cinco momentos, elegir, volver a la anterior, el pase de una hoja a la otra y de un
 * momento al otro, y el resultado con su plano, su grilla y su tarjeta.
 *
 * Elegir tiene una pausa que lleva un reloj de JavaScript (`--pausa-eleccion`), así que sus
 * tiras van a velocidad real.
 */
async function dosEjes(ctx) {
  const { pagina, foto, tira, quieto } = ctx;
  await pagina.goto(`${base}/juegos/dos-ejes/`, { waitUntil: 'networkidle0' });
  await tira('portada-entra', () => pagina.reload({ waitUntil: 'domcontentloaded' }), { ms: 900 });
  await foto('portada');
  await foto('portada-entera', { entera: true });

  // Toques de verdad, no `click()` desde un script: con un clic de script el navegador cree que
  // se llegó por teclado y le dibuja el foco punteado al enunciado, que en el teléfono no se ve.
  const tocar = (sel) => pagina.click(sel);
  const opcion = async (k) => (await pagina.$$('.ejes-hoja:not(.ejes-hoja--fantasma) .ejes-opcion'))[k].click();
  const hojaLista = async (n) => {
    // La hoja n (de 1 a 10) ya está y se puede tocar.
    await pagina.waitForFunction(
      (m) => {
        const f = document.querySelector('.ejes-hoja:not(.ejes-hoja--fantasma) .ejes-folio');
        const o = document.querySelector('.ejes-hoja:not(.ejes-hoja--fantasma) .ejes-opcion');
        // En el pase de momento la hoja nueva espera sin verse hasta que la tira caminó y cayó el cartel.
        return f && f.textContent.trim().startsWith(`${m} de`) && o && o.getAttribute('aria-disabled') !== 'true' && !document.querySelector('.ejes-hoja--espera');
      },
      { timeout: 8000 },
      n,
    );
    await ctx.espera(quieto ? 120 : 1100);
  };

  // El libro se abre.
  await tira('empieza', () => tocar('#empezar'), { ms: 760, lento: 0.2 });
  await hojaLista(1);
  await foto('momento-1-la-previa');
  await foto('momento-1-entera', { entera: true });

  // Elegir, de cerca: lo que pasa en la pausa, antes de que cambie la hoja.
  await tira('elige', () => opcion(0), { ms: 520, lento: 1 });
  await hojaLista(2);
  await foto('hoja-2-mismo-momento');

  // El pase al momento siguiente: elegir, la hoja que se va, el lugar que cambia y el sello.
  await tira('pasa-de-momento', () => opcion(1), { ms: 1900, lento: 1 });
  await hojaLista(3);
  await foto('momento-2-la-ida');

  // Volver a la anterior: la que se había elegido queda marcada.
  if (await pagina.$('.ejes-anterior')) {
    await tira('vuelve', () => tocar('.ejes-anterior'), { ms: 900, lento: 1 });
    await ctx.espera(500);
    await foto('volvio-a-la-anterior');
    await opcion(0);
    await hojaLista(3);
  }

  const NOMBRES = { 5: 'momento-3-la-vereda', 7: 'momento-4-cuando-suena', 9: 'momento-5-la-vuelta' };
  for (let n = 3; n <= 9; n++) {
    if (n === 6) {
      // El pase que entra a «Cuando suena», parte por parte. Sus cuatro tiempos salen de tokens
      // y los lleva un reloj de JavaScript, así que no se frena el navegador: se estiran los
      // tokens por cuatro, y la isla y el CSS van lentos juntos.
      const LENTO = 4;
      const freno = quieto
        ? null
        : await pagina.addStyleTag({ content: `:root{--duracion-umbral:${380 * LENTO}ms;--duracion-inercia:${900 * LENTO}ms;--duracion-pasada:${300 * LENTO}ms}` });
      await opcion(0);
      await ctx.espera(quieto ? 0 : 640);
      const nada = async () => {};
      await tira('pase-1-la-hoja-se-va', nada, { ms: 380 * LENTO, lento: 1, asentar: false });
      await tira('pase-2-la-tira-camina', nada, { ms: 900 * LENTO, lento: 1, asentar: false });
      await tira('pase-3-cae-el-cartel', nada, { ms: 600 * LENTO, lento: 1, asentar: false });
      await tira('pase-4-entra-la-hoja', nada, { ms: 380 * LENTO, lento: 1 });
      if (freno) await freno.evaluate((n) => n.remove());
    } else {
      await opcion(n % 2);
    }
    await hojaLista(n + 1);
    if (NOMBRES[n + 1]) await foto(NOMBRES[n + 1]);
  }

  // La última: de la hoja al resultado.
  await tira('resultado-entra', () => opcion(0), { ms: 2200, lento: 1 });
  await ctx.espera(quieto ? 300 : 1600);
  await foto('resultado');
  await foto('resultado-entero', { entera: true });

  // El plano: se baja hasta él y se mira cómo se arma.
  if (await pagina.$('.ejes-plano')) {
    await tira(
      'plano',
      () => pagina.$eval('.ejes-plano', (n) => n.scrollIntoView({ block: 'center', behavior: 'instant' })),
      { ms: 1300, lento: 1 },
    );
    await ctx.espera(600);
    await foto('plano');
  }
  if (await pagina.$('.ejes-manera summary')) {
    await pagina.$eval('.ejes-manera summary', (n) => {
      n.scrollIntoView({ block: 'center', behavior: 'instant' });
      n.click();
    });
    await ctx.espera(300);
    await foto('manera-abierta');
  }

  // Otra noche, desde el resultado.
  await pagina.evaluate(() => window.scrollTo(0, 0));
  await pagina.click('#resultado .secundario');
  await ctx.espera(quieto ? 200 : 1300);
  await foto('otra-noche');

  // La postal de quien mandó el enlace.
  await pagina.goto(`${base}/juegos/dos-ejes/cu-2/`, { waitUntil: 'networkidle0' });
  await ctx.espera(quieto ? 200 : 900);
  await foto('postal');
}

/**
 * «Sacalo por la letra»: la vuelta entera. La portada con su papel, el papel que viaja, un
 * error que cae sobre el papel, dos pases que abren dobleces, un acierto, la hazaña (sacarlo
 * con un renglón) con su racha, un tema que se escapa y el resultado.
 *
 * El juego no dice cuál es el tema, pero el banco viaja en la página: el primer verso que se
 * ve alcanza para saber cuál es.
 */
async function porLaLetra(ctx) {
  const { pagina, foto, tira, quieto } = ctx;
  const url = `${base}/juegos/adivinar-por-la-letra/`;
  await pagina.goto(url, { waitUntil: 'networkidle0' });
  await tira('portada-entra', () => pagina.reload({ waitUntil: 'domcontentloaded' }), { ms: 900 });
  await foto('portada');
  await foto('portada-entera', { entera: true });

  // La tecla apretada: se baja el dedo sobre "Jugá" y no se levanta.
  const jugar = await pagina.$('#jugar');
  const caja = await jugar.boundingBox();
  await pagina.mouse.move(caja.x + caja.width / 2, caja.y + caja.height / 2);
  await pagina.mouse.down();
  await ctx.espera(150);
  await foto('portada-tecla-apretada');
  // Al soltar, el papel de la portada viaja a su lugar en la partida y el verso se escribe.
  await tira('papel-viaja', () => pagina.mouse.up(), { ms: 900 });
  await ctx.espera(600);

  const banco = await pagina.evaluate(() => JSON.parse(document.getElementById('banco').textContent));
  const catalogo = await pagina.evaluate(() => JSON.parse(document.getElementById('catalogo').textContent));
  /** El tema en curso, por su primer verso. */
  const elDeAhora = async () => {
    const primero = await pagina.$eval('.hoja-versos .verso', (v) => v.textContent);
    const item = banco.find((i) => i.versos[0] === primero);
    if (!item) throw new Error(`no encuentro en el banco el verso "${primero}"`);
    return item;
  };
  const soltarFoco = async () => {
    // En el teléfono, con el foco en el buscador la pantalla es otra a propósito
    // (`.partida--tecleando`): se suelta el foco antes de mirar el tablero.
    await pagina.evaluate(() => document.activeElement instanceof HTMLElement && document.activeElement.blur());
    await ctx.espera(200);
  };
  const escribir = async (texto) => {
    await pagina.click('.buscador-caja', { clickCount: 3 });
    await pagina.keyboard.press('Backspace');
    await pagina.type('.buscador-caja', texto);
    await ctx.espera(250);
  };
  const elegir = async (titulo) => {
    const botones = await pagina.$$('.sugerencia:not(:disabled)');
    for (const b of botones) {
      const t = await b.$eval('.sugerencia-titulo', (n) => n.textContent);
      if (t === titulo) return b.click();
    }
    throw new Error(`"${titulo}" no salió en la lista`);
  };
  const boton = () => pagina.click('.arriesgar');
  const sacar = async (item) => {
    await escribir(item.titulo);
    await elegir(item.titulo);
    await ctx.espera(200);
  };

  await foto('partida');
  await foto('partida-entera', { entera: true });

  // ---- tema 1: un error, dos pases (ocho versos) y se saca.
  const uno = await elDeAhora();
  const otro = catalogo.find((t) => t.titulo !== uno.titulo && t.titulo.length > 8 && t.titulo.length < 22);
  await escribir(otro.titulo.slice(0, 5));
  await foto('sugerencias-con-teclado');
  await escribir(otro.titulo);
  // Elegir: la ficha se pega en el campo.
  await tira('elige', () => elegir(otro.titulo), { ms: 420 });
  await soltarFoco();
  await foto('elegido');
  // El error: el papel se sacude, lo arriesgado queda tachado y recién ahí se abre el doblez.
  await tira('error', boton, { ms: 1500 });
  await soltarFoco();
  await ctx.espera(700);
  await foto('tras-el-error');
  // Pasar: la marca, y el doblez que se abre con sus dos versos.
  await tira('pasar', boton, { ms: 1100 });
  await soltarFoco();
  await ctx.espera(900);
  await foto('cuatro-versos');
  await boton();
  await soltarFoco();
  await ctx.espera(quieto ? 200 : 2200);
  await foto('ocho-versos-ultimo-intento');
  await foto('ocho-versos-entera', { entera: true });
  // En un teléfono más bajo el papel no entra y desplaza por dentro: se mira el canto rayado
  // que avisa que sigue, abajo del todo y a media altura.
  if (ctx.ancho < 768) {
    await pagina.setViewport({ width: ctx.ancho, height: 640, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
    await ctx.espera(300);
    await pagina.$eval('.hoja-versos', (h) => {
      h.scrollTop = h.scrollHeight;
    });
    await ctx.espera(200);
    await foto('telefono-bajo-papel-abajo');
    await pagina.$eval('.hoja-versos', (h) => {
      h.scrollTop = Math.round((h.scrollHeight - h.clientHeight) / 2);
    });
    await ctx.espera(200);
    await foto('telefono-bajo-papel-al-medio');
    await pagina.setViewport({ width: ctx.ancho, height: ctx.alto, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
    await ctx.espera(300);
    await pagina.$eval('.hoja-versos', (h) => {
      h.scrollTop = h.scrollHeight;
    });
  }
  await sacar(uno);
  // El acierto tiene dos tiempos que lleva un reloj de JavaScript (el sello y la respuesta
  // sobre el papel; después el papel se pliega y llega la ficha): la tira va a velocidad real.
  await tira('acierto', boton, { ms: 2600, lento: 1 });
  await ctx.espera(1500);
  await foto('revelacion-acierto');
  await foto('revelacion-acierto-entera', { entera: true });
  // El papel plegado se vuelve a abrir: los versos no se pierden.
  if (await pagina.$('.hoja-releer')) {
    await pagina.click('.hoja-releer');
    await ctx.espera(600);
    await foto('papel-reabierto');
    await pagina.click('.hoja-releer');
    await ctx.espera(600);
  }

  // ---- el pase al tema 2: el papel nuevo sale del bolsillo.
  // El pase lo lleva un reloj de JavaScript (el papel usado se guarda, y recién ahí sale el
  // nuevo): la tira va a velocidad real.
  await tira('tema-siguiente', () => pagina.click('.seguir'), { ms: 1100, lento: 1 });
  await ctx.espera(900);
  await foto('tema-2');
  // ---- tema 2: de una, con un renglón. La hazaña, y dos al hilo.
  await sacar(await elDeAhora());
  await tira('hazana', boton, { ms: 2600, lento: 1 });
  await ctx.espera(1800);
  await foto('hazana');
  await foto('hazana-entera', { entera: true });
  await pagina.evaluate(() => window.scrollTo(0, 0));
  await ctx.espera(150);
  await foto('racha-de-dos');
  await pagina.click('.seguir');
  await ctx.espera(900);

  // ---- tema 3: un pase y se saca. Tres al hilo.
  await boton();
  await ctx.espera(quieto ? 200 : 900);
  await sacar(await elDeAhora());
  await boton();
  await ctx.espera(3400);
  await pagina.click('.seguir');
  await ctx.espera(900);

  // ---- tema 4: se escapa. Un error, dos pases y el último intento.
  const cuatro = await elDeAhora();
  const errado = catalogo.find((t) => t.titulo !== cuatro.titulo && t.titulo.length > 14 && t.titulo.length < 30);
  await sacar(errado);
  await boton();
  await ctx.espera(quieto ? 200 : 1300);
  await boton();
  await ctx.espera(quieto ? 200 : 900);
  await boton();
  await soltarFoco();
  await ctx.espera(quieto ? 200 : 2200);
  await foto('ultimo-intento');
  await tira('se-escapa', boton, { ms: 2600, lento: 1 });
  await ctx.espera(1500);
  await foto('revelacion-fallo');
  await foto('revelacion-fallo-entera', { entera: true });
  await pagina.click('.seguir');
  await ctx.espera(900);

  // ---- tema 5: se saca de una, y el resultado.
  await sacar(await elDeAhora());
  await boton();
  await ctx.espera(3400);
  await tira('resultado-entra', () => pagina.click('.seguir'), { ms: 1000 });
  await ctx.espera(900);
  await foto('resultado');
  await foto('resultado-entero', { entera: true });
}

/**
 * Skayboy y Poligirl: el único que no es de preguntas. Se juega de verdad, con el teclado en la
 * compu y con los dedos sobre las seis teclas en el teléfono, y **todo se saca a velocidad real**
 * (`lento: 1`): lo que se mueve adentro del tubo lo mueve el reloj del motor, no una animación de
 * CSS que se pueda frenar.
 *
 * El nivel 1 es un piso liso (cada uno camina a su puerta), así que alcanza para el salto, el
 * favorito, la victoria y el pase. La caja se mira en el 10, la palanca en el 8 y la vuelta a la
 * entrada en el 2: se eligen desde el menú, que los tiene todos abiertos. Ninguna secuencia de
 * acá sale de las trazas grabadas, que no viajan al navegador (`ADR-09.2`).
 */
async function skayboy(ctx) {
  const { pagina, foto, ancho } = ctx;
  /**
   * Con movimiento reducido la tira genérica saca una sola foto a los 250 ms, y acá lo que se
   * mira tarda lo que tarda el muñeco en llegar: se deja pasar el momento entero y se saca al final.
   */
  const tira = async (nombre, disparar, opciones) => {
    if (!ctx.quieto) return ctx.tira(nombre, disparar, opciones);
    await disparar();
    await ctx.espera(opciones.ms);
    return foto(`${nombre}-quieto`);
  };
  const url = `${base}/juegos/skayboy-y-poligirl/`;
  const dedo = ancho < 768 && !bandera('--sin-dedo');
  const CODIGOS = {
    izquierda: { izquierda: 'KeyA', derecha: 'KeyD', salto: 'KeyW' },
    derecha: { izquierda: 'ArrowLeft', derecha: 'ArrowRight', salto: 'ArrowUp' },
  };
  const dedos = new Map();
  /** Aprieta una tecla de una columna y la deja apretada: con el dedo o con el teclado. */
  const bajar = async (lado, tecla) => {
    if (!dedo) return pagina.keyboard.down(CODIGOS[lado][tecla]);
    const boton = await pagina.$(`button[data-mando="${lado}"][data-tecla="${tecla}"]`);
    const caja = await boton.boundingBox();
    dedos.set(`${lado}/${tecla}`, await pagina.touchscreen.touchStart(caja.x + caja.width / 2, caja.y + caja.height / 2));
  };
  const subir = async (lado, tecla) => {
    if (!dedo) return pagina.keyboard.up(CODIGOS[lado][tecla]);
    await dedos.get(`${lado}/${tecla}`)?.end();
    dedos.delete(`${lado}/${tecla}`);
  };
  /**
   * Un clic de verdad, con puntero: `elemento.click()` llega con `detail` en cero, que la isla lee
   * como teclado y le dibuja el anillo de foco al menú. Puppeteer trae el botón a la vista antes.
   */
  const tocar = (selector) => pagina.click(selector);
  const elegirNivel = async (id) => {
    if (await pagina.$('#menu-juego[hidden]')) await tocar('#abrir-menu');
    await ctx.espera(200);
    await tocar(`.ficha-nivel[data-nivel="${id}"]`);
    await ctx.espera(500);
  };
  const real = { lento: 1, asentar: false };
  // Lo que pasa adentro del tubo se mira en el tubo, agrandado.
  const tubo = { ...real, sobre: '.recorte' };

  // El avance vive en el aparato y el perfil se reusa: sin esto, la segunda corrida abre en el 2.
  await pagina.goto(url, { waitUntil: 'networkidle0' });
  await pagina.evaluate(() => localStorage.clear());
  // El fichín se prende una vez, al cargar: el tubo abre y la marquesina enciende sus palabras.
  await ctx.rafaga('se-prende', () => pagina.goto(url, { waitUntil: 'domcontentloaded' }), {
    desde: 0,
    hasta: 2600,
    sobre: '.gabinete',
    zoom: ancho < 768 ? 2 : 1,
    porRenglon: 6,
    tope: 30,
  }).catch((e) => console.log('   (sin ráfaga de encendido:', e.message, ')'));
  // Y la marquesina sola, que se prende después del tubo, palabra por palabra.
  if (await pagina.$eval('.marquesina', (m) => m.getClientRects().length > 0)) {
    await ctx.rafaga('marquesina-se-prende', () => pagina.goto(url, { waitUntil: 'domcontentloaded' }), {
      desde: 0,
      hasta: 3200,
      sobre: '.marquesina',
      zoom: 2,
      porRenglon: 4,
      tope: 60,
    });
  }
  await pagina.goto(url, { waitUntil: 'networkidle0' });
  await pagina.waitForSelector('#menu-juego:not([hidden])', { timeout: 20000 });
  await ctx.espera(600);
  await foto('portada');
  await foto('portada-entera', { entera: true });
  // La vidriera: lo que pasa en el tubo mientras nadie tocó nada.
  await tira('portada-vive', async () => {}, { ms: 2600, ...tubo });

  await tira('juga', () => tocar('#menu-jugar'), { ms: 900, ...tubo });
  await foto('inicio-de-nivel');
  await ctx.espera(2800);

  // Nivel 1. El salto entero, parado: despegue, aire y aterrizaje.
  await tira('salto-y-aterrizaje', () => bajar('izquierda', 'salto'), { ms: 760, ...tubo });
  await subir('izquierda', 'salto');
  await ctx.espera(500);
  // Y el aterrizaje cuadro por cuadro, **al tamaño en que se ve** (sin agrandar): el polvo se
  // juzga a ×1, que es como llega al teléfono.
  await ctx.rafaga('aterrizaje-tal-cual', () => bajar('derecha', 'salto'), { desde: 480, hasta: 900, sobre: '.recorte', zoom: 1, porRenglon: 6, tope: 24 });
  await subir('derecha', 'salto');
  await ctx.espera(300);
  if (dedo) {
    await bajar('derecha', 'salto');
    await ctx.espera(120);
    await foto('tecla-apretada');
    await subir('derecha', 'salto');
    await ctx.espera(700);
  }
  // Skayboy camina a su guitarra (dos celdas) y sigue hasta su puerta.
  await tira('junta-el-favorito', () => bajar('izquierda', 'izquierda'), { ms: 700, ...tubo });
  await ctx.espera(700);
  await subir('izquierda', 'izquierda');
  await foto('uno-en-su-puerta');
  // Poligirl llega a la suya: se gana en ese cuadro.
  await tira('gana', () => bajar('derecha', 'derecha'), { ms: 1500, ...tubo });
  await pagina.waitForSelector('#fin-nivel:not([hidden])', { timeout: 5000 });
  await subir('derecha', 'derecha');
  await foto('nivel-completado');
  await ctx.espera(1500);
  await foto('nivel-completado-asentado');
  await tira('pase-al-siguiente', () => tocar('#fin-seguir'), { ms: 1300, ...tubo });
  await foto('nivel-2');
  await ctx.espera(2600);

  // Nivel 2: Skayboy pisa el charco que no es suyo y vuelve a la entrada.
  await tira('vuelta-a-la-entrada', () => bajar('izquierda', 'derecha'), { ms: 1500, ...tubo });
  await subir('izquierda', 'derecha');
  await ctx.espera(300);

  await tocar('#abrir-menu');
  await ctx.espera(300);
  await foto('menu-en-pausa');
  await foto('menu-en-pausa-entero', { entera: true });

  // Nivel 10: la caja está a dos celdas a la izquierda de Skayboy.
  await tira('elige-nivel', () => tocar('.ficha-nivel[data-nivel="NIV-10"]'), { ms: 900, ...tubo });
  await ctx.espera(2700);
  // Antes de tocar la caja: Skayboy sube de un salto al escalón de su derecha y se tira de ahí.
  // Cae de más alto que un salto: es el golpe fuerte, con el peso de dos pixeles y el tubo que se
  // sacude. Se mira cuadro por cuadro.
  await bajar('izquierda', 'derecha');
  await bajar('izquierda', 'salto');
  await ctx.espera(750);
  await subir('izquierda', 'salto');
  await subir('izquierda', 'derecha');
  await ctx.espera(350);
  await ctx.rafaga(
    'golpe-fuerte',
    async () => {
      await bajar('izquierda', 'izquierda');
      await bajar('izquierda', 'salto');
      // Suelta la dirección en el aire: cae parado, lejos de la caja, que se empuja después.
      setTimeout(() => void subir('izquierda', 'izquierda'), 380);
    },
    { desde: 520, hasta: 1000, sobre: '.gabinete', zoom: ancho < 768 ? 2 : 1, porRenglon: 6, tope: 24 },
  );
  await subir('izquierda', 'salto');
  await ctx.espera(300);
  await tira('empuje', () => bajar('izquierda', 'izquierda'), { ms: 700, ...tubo });
  // Sigue empujando: la caja llega a la placa de la columna 1 y la reja de arriba se abre. Uno de
  // cada tres cuadros, desde ya: la placa cede y la reja suelta sus virutas en menos de medio segundo.
  await ctx.rafaga('placa-y-compuerta', async () => {}, { desde: 0, hasta: 2400, sobre: '.recorte', zoom: ancho < 768 ? 2 : 1, porRenglon: 6, tope: 42, cada: 3 });
  await subir('izquierda', 'izquierda');
  await foto('caja-empujada');

  // Nivel 8: la palanca queda a dos celdas a la derecha de Skayboy.
  await elegirNivel('NIV-08');
  await ctx.espera(2700);
  await tira('palanca', () => bajar('izquierda', 'derecha'), { ms: 1000, ...tubo });
  await subir('izquierda', 'derecha');
  await foto('palanca-puesta');

  // La pantalla completa es un modo de la página: se ve aunque el sistema no dé la suya.
  await tocar('#pantalla-completa');
  await ctx.espera(700);
  await foto('pantalla-completa');
  await tira('pantalla-completa-salto', () => bajar('derecha', 'salto'), { ms: 760, ...tubo });
  await subir('derecha', 'salto');
  await tocar('#abrir-menu');
  await ctx.espera(300);
  await foto('pantalla-completa-menu');

  /*
   * El final del juego. Pasar el nivel 12 a mano no se puede guionar sin su traza, que no viaja al
   * navegador; así que **para la foto se le cambia el orden a la fila**: el nivel 1, que se pasa
   * caminando, va último. La página es la misma y el banco tiene los mismos doce niveles: lo único
   * distinto es cuál es el último. Se hace interceptando el HTML, sin tocar nada del sitio.
   */
  await pagina.setRequestInterception(true);
  pagina.on('request', async (pedido) => {
    if (pedido.resourceType() !== 'document' || !pedido.url().includes('/juegos/skayboy-y-poligirl')) return pedido.continue();
    try {
      const html = await (await fetch(pedido.url())).text();
      const cambiado = html.replace(/(<script type="application\/json" id="banco-skayboy">)([\s\S]*?)(<\/script>)/, (_, abre, json, cierra) => {
        const banco = JSON.parse(json);
        banco.niveles = [...banco.niveles.filter((n) => n.id !== 'NIV-01'), ...banco.niveles.filter((n) => n.id === 'NIV-01')];
        return abre + JSON.stringify(banco).replace(/</g, '\\u003c') + cierra;
      });
      await pedido.respond({ status: 200, contentType: 'text/html; charset=utf-8', body: cambiado });
    } catch {
      await pedido.continue();
    }
  });
  await pagina.goto(url, { waitUntil: 'networkidle0' });
  await pagina.evaluate(() => localStorage.clear());
  await pagina.goto(url, { waitUntil: 'networkidle0' });
  await pagina.waitForSelector('#menu-juego:not([hidden])', { timeout: 20000 });
  await ctx.espera(800);
  await tocar('.ficha-nivel[data-nivel="NIV-01"]');
  await ctx.espera(2900);
  await bajar('izquierda', 'izquierda');
  await ctx.espera(1300);
  await subir('izquierda', 'izquierda');
  // Poligirl llega a su puerta: es el último de la fila, y se terminó el juego.
  await ctx.rafaga('final-llega', () => bajar('derecha', 'derecha'), { desde: 700, hasta: 1700, sobre: '.gabinete', zoom: ancho < 768 ? 2 : 1, porRenglon: 6, tope: 30, cada: 2 });
  await pagina.waitForSelector('#final-juego:not([hidden])', { timeout: 5000 });
  await subir('derecha', 'derecha');
  await tira('creditos-suben', async () => {}, { ms: 6500, ...real, sobre: '.gabinete' });
  await foto('final');
  await tocar('#final-volver');
  await ctx.espera(1200);
  await foto('final-vuelve-al-primero');
}

/**
 * "Completá la letra": la portada, la partida, elegir una plantilla, el error (con su tachón),
 * el acierto (con la chorreada), el pase con el rodillo, la racha, el resultado y compartir.
 * Este juego no tiene tarjeta: comparte texto y enlace.
 */
async function completarLaLetra(ctx) {
  const { pagina, foto, tira, rafaga, quieto } = ctx;
  await pagina.goto(`${base}/juegos/completar-la-letra/`, { waitUntil: 'networkidle0' });
  await tira('portada-entra', () => pagina.reload({ waitUntil: 'domcontentloaded' }), { ms: 900 });
  await foto('portada');
  await foto('portada-entera', { entera: true });

  const banco = await pagina.evaluate(() => JSON.parse(document.getElementById('banco').textContent));
  /** El verso en curso: se busca en el banco por lo que hay pintado y por sus cuatro opciones. */
  const elDeAhora = async () => {
    const opciones = await pagina.$$eval('#partida .plantilla', (bs) => bs.map((b) => b.textContent));
    const item = banco.find((i) => i.opciones.length === opciones.length && i.opciones.every((o) => opciones.includes(o.texto)));
    if (!item) throw new Error(`no encuentro en el banco las opciones ${opciones.join(', ')}`);
    return item;
  };
  const plantilla = async (texto) => {
    for (const b of await pagina.$$('#partida .plantilla:not(:disabled)')) {
      if ((await b.evaluate((n) => n.textContent)) === texto) return b;
    }
    throw new Error(`no hay plantilla "${texto}"`);
  };
  const laQueEs = async () => plantilla((await elDeAhora()).hueco.respuesta);
  const unaQueNoEs = async () => {
    const item = await elDeAhora();
    return plantilla(item.opciones.find((o) => o.texto !== item.hueco.respuesta).texto);
  };
  const fichaLista = () => pagina.waitForSelector('.ficha-verso .seguir', { timeout: 8000 });

  // Empezá, por la plantilla apoyada en la pared de la portada: va al hueco, se apoya, la
  // pared se abre, el rodillo destapa la primera pintada y las plantillas se apoyan. A
  // velocidad real (el arranque lo dispara la isla a mitad del vuelo).
  await rafaga('empieza-por-la-plantilla', () => pagina.click('#plantilla-portada'), { desde: 0, hasta: 1300, cada: 5, tope: 12 });
  await ctx.espera(700);
  await foto('partida');
  await foto('partida-entera', { entera: true });

  // ---- verso 1: el error. La plantilla va al hueco, lo elegido queda tachado y se pinta la que era.
  const mala = await unaQueNoEs();
  // A velocidad real: la plantilla y los tiempos del cierre los lleva la isla, no el CSS.
  await rafaga('error', () => mala.click(), { desde: 0, hasta: 1750, cada: 6, tope: 18 });
  await fichaLista();
  await ctx.espera(quieto ? 200 : 1300);
  await foto('error-ficha');
  await foto('error-ficha-entera', { entera: true });

  // El pase: el rodillo tapa la pintada vieja y destapa la nueva.
  await rafaga('pase', () => pagina.click('.ficha-verso .seguir'), { desde: 0, hasta: 900, cada: 4, tope: 12 });
  await ctx.espera(500);
  await foto('verso-2');

  // ---- verso 2: el acierto, a velocidad real (la plantilla la mueve la isla, no el CSS).
  const buena = await laQueEs();
  await rafaga('acierto-plantilla', () => buena.click(), { desde: 0, hasta: 1000, cada: 4, tope: 12 });
  await fichaLista();
  await ctx.espera(quieto ? 200 : 1300);
  await foto('acierto-ficha');
  await pagina.click('.ficha-verso .seguir');
  await ctx.espera(quieto ? 200 : 1000);

  // ---- verso 3: otro acierto, mirando solo la pintada: la palabra, la chorreada y el sello.
  const otraBuena = await laQueEs();
  await rafaga('acierto-chorrea', () => otraBuena.click(), { desde: 300, hasta: 1900, sobre: '.pintada', cada: 8, tope: 12, porRenglon: 3 });
  await fichaLista();
  await ctx.espera(quieto ? 200 : 1300);
  await foto('racha');
  await pagina.click('.ficha-verso .seguir');
  await ctx.espera(quieto ? 200 : 1000);

  // ---- el resto de la vuelta: uno mal y los demás bien. En el 4 y en el 5 el cierre se
  // adelanta con un toque en la pared: tiene que llegar la ficha con todo en su lugar.
  let n = 3;
  for (;;) {
    const quedan = await pagina.$('#partida .plantilla:not(:disabled)');
    if (!quedan) break;
    n += 1;
    const b = n === 5 ? await unaQueNoEs() : await laQueEs();
    if (n === 4 || n === 5) {
      const tocarLaPared = async () => {
        await b.click();
        await ctx.espera(140);
        const caja = await (await pagina.$('#partida .pared-ladrillos')).boundingBox();
        await pagina.touchscreen.tap(caja.x + caja.width / 2, caja.y + 30).catch(() => pagina.mouse.click(caja.x + caja.width / 2, caja.y + 30));
      };
      await rafaga(n === 4 ? 'adelantar-acierto' : 'adelantar-error', tocarLaPared, { desde: 0, hasta: 700, cada: 3, tope: 12 });
      await fichaLista();
      await ctx.espera(quieto ? 150 : 700);
      await foto(n === 4 ? 'adelantado-acierto' : 'adelantado-error');
      const estado = await pagina.evaluate(() => ({
        casillas: document.querySelectorAll('.vuelta-casilla--ok, .vuelta-casilla--no').length,
        marca: !!document.querySelector('.sello-marca'),
        pintada: !!document.querySelector('#partida .hueco.resuelto'),
        llevas: document.querySelector('.restantes--llevas')?.textContent,
      }));
      console.log(`   (adelantado, verso ${n}: ${JSON.stringify(estado)})`);
      await pagina.click('.ficha-verso .seguir');
      await ctx.espera(quieto ? 200 : 1000);
      continue;
    }
    await b.click();
    await fichaLista();
    await ctx.espera(quieto ? 150 : 900);
    const ultimo = await pagina.$eval('.ficha-verso .seguir', (s) => s.textContent);
    if (n === 8) {
      await foto('ultimo-verso');
      await rafaga('resultado-entra', () => pagina.click('.ficha-verso .seguir'), { desde: 300, hasta: 1900, cada: 8, tope: 12 });
      console.log(`   (el último botón dice "${ultimo}")`);
      break;
    }
    await pagina.click('.ficha-verso .seguir');
    await ctx.espera(quieto ? 200 : 1000);
  }
  await pagina.waitForSelector('#resultado:not([hidden])', { timeout: 8000 });
  await ctx.espera(1200);
  await foto('resultado');
  await foto('resultado-entera', { entera: true });
  // La tarjeta que asoma, mirada entera: se la pone encima de la ventana un momento.
  await pagina.waitForSelector('.tarjeta-asoma img', { timeout: 8000 }).catch(() => {});
  const hayTarjeta = await pagina.evaluate(() => {
    const img = document.querySelector('.tarjeta-asoma img');
    if (!img) return false;
    const copia = img.cloneNode();
    copia.id = 'ver-tarjeta';
    copia.className = '';
    copia.style.cssText = 'position:fixed;inset:0;z-index:99;width:100vw;height:100vh;object-fit:contain;background:#000';
    document.body.append(copia);
    return true;
  });
  if (hayTarjeta) {
    await ctx.espera(300);
    await foto('tarjeta');
    await pagina.evaluate(() => document.getElementById('ver-tarjeta')?.remove());
  } else console.log('   (no hay tarjeta que mirar)');
  // Compartir: en la compu cae el aviso de copiado; en el teléfono de la captura no hay menú.
  await pagina.evaluate(() => document.querySelector('#resultado .primario.firma')?.click());
  await ctx.espera(700);
  await foto('compartido-entera', { entera: true });

  // ---- otra vuelta, entera: la hazaña. De paso, el sello y el polvo en ráfaga.
  await pagina.evaluate(() => document.querySelector('#resultado .pie-resultado button.secundario')?.click());
  await ctx.espera(quieto ? 300 : 1200);
  for (let v = 1; v <= 8; v++) {
    const b = await laQueEs();
    if (v === 1) await rafaga('sello-y-polvo', () => b.click(), { desde: 780, hasta: 1750, cada: 4, tope: 12 });
    else await b.click();
    await fichaLista();
    await ctx.espera(quieto ? 120 : 700);
    if (v === 8) await rafaga('hazana-entra', () => pagina.click('.ficha-verso .seguir'), { desde: 300, hasta: 2100, cada: 9, tope: 12 });
    else {
      await pagina.click('.ficha-verso .seguir');
      await ctx.espera(quieto ? 200 : 900);
    }
  }
  await pagina.waitForSelector('#resultado:not([hidden])', { timeout: 8000 });
  await ctx.espera(1200);
  await foto('hazana');
  await foto('hazana-entera', { entera: true });
}

/**
 * "Ponelos en fila": la portada con la pila, la batea de elegir, una partida entera de las diez
 * tapas (poner fichas, mover una, abrir el mazo, nombrar una fila y sumar otra), el cierre con la
 * lámina, y los ciento cinco a medio repartir.
 */
async function ponelosEnFila(ctx) {
  const { pagina, foto, tira, rafaga, quieto } = ctx;
  const url = `${base}/juegos/ponelos-en-fila/`;
  const pausa = (ms) => ctx.espera(quieto ? Math.min(ms, 200) : ms);

  // Sin menú del sistema para compartir (en Windows el navegador lo tiene y se queda esperando):
  // así "Compartí" cae en la dirección copiada y la lámina para bajar, que es lo que se mira.
  await pagina.evaluateOnNewDocument(() => {
    try {
      delete Navigator.prototype.share;
      delete Navigator.prototype.canShare;
    } catch {
      /* queda el del navegador */
    }
  });
  /** Un toque que no desplaza la hoja: el mazo va pegado abajo y un clic "de verdad" la corre. */
  const tocar = (selector) => pagina.evaluate((s) => document.querySelector(s)?.click(), selector);
  /** La hoja, arriba de todo: una captura entera o recortada la deja corrida, y quien juega no lo está. */
  const arriba = async () => {
    await pagina.evaluate(() => window.scrollTo(0, 0));
    await ctx.espera(120);
  };

  await pagina.goto(url, { waitUntil: 'networkidle0' });
  // De cero: sin partidas a medias ni filas propias de otra corrida.
  await pagina.evaluate(() => {
    try {
      for (const k of Object.keys(localStorage)) if (k.startsWith('ponelos:')) localStorage.removeItem(k);
    } catch {
      /* sin almacenamiento */
    }
  });
  await tira('portada-entra', () => pagina.reload({ waitUntil: 'domcontentloaded' }), { ms: 900 });
  await foto('portada');
  await foto('portada-entera', { entera: true });

  // La pila se reparte: de la portada a la batea.
  await rafaga('se-reparte', () => tocar('#empezar'), { desde: 0, hasta: 900, cada: 4, tope: 12 });
  await pagina.waitForSelector('#eleccion:not([hidden])', { timeout: 8000 });
  await pausa(900);
  await foto('eleccion');
  await foto('eleccion-entera', { entera: true });

  /** Toca un conjunto por su id (o, en una versión vieja del sitio, por su título). */
  const elegir = async (id, titulo) => {
    const ok = await pagina.evaluate(
      (id, titulo) => {
        const porId = document.querySelector(`#eleccion [data-conjunto="${id}"]`);
        const porTitulo = [...document.querySelectorAll('#eleccion .conjunto')].find(
          (b) => b.querySelector('.conjunto-titulo')?.textContent?.trim().toLowerCase() === titulo.toLowerCase(),
        );
        const b = porId ?? porTitulo;
        b?.scrollIntoView({ block: 'center' });
        b?.click();
        return Boolean(b);
      },
      id,
      titulo,
    );
    if (!ok) throw new Error(`no encontré el conjunto «${titulo}»`);
    await pagina.waitForSelector('#tablero:not([hidden]) .reparto-boton', { timeout: 8000 });
  };
  const fila = (n) => `#tablero .reparto-boton[data-fila="${n}"]`;
  const herramienta = (i) => pagina.evaluate((i) => document.querySelectorAll('#tablero .tablero-herramientas .herramienta')[i]?.click(), i);

  // ---- una partida de las diez tapas
  await elegir('tapas', 'Las diez tapas');
  await pausa(900);
  await foto('partida');
  await foto('partida-entera', { entera: true });
  // El disco de la carta mientras suena el recorte (a velocidad real: lo mueve el audio).
  if (await pagina.$('#tablero .carta')) {
    await tira('disco-suena', async () => {}, { ms: 900, lento: 1, sobre: '#tablero .carta' });
    // "Pará": el disco no clava, frena en escalones y recién ahí vuelve a la funda.
    await tira('disco-frena', () => tocar('#tablero .carta-escuchar'), { ms: 1150, lento: 1, sobre: '#tablero .carta' });
    await tocar('#tablero .carta-escuchar');
    await pausa(400);
  }
  // La ficha que llega a su fila: entera en ráfaga, y frenada en tira.
  await arriba();
  await rafaga('ficha-llega', () => tocar(fila(1)), { desde: 0, hasta: 760, cada: 3, tope: 12 });
  await pausa(500);
  await arriba();
  await tira('ficha-llega', () => tocar(fila(2)), { ms: 700 });
  await pausa(300);
  await tocar(fila(3));
  await pausa(450);
  await tocar(fila(1));
  await pausa(700);
  await arriba();
  await foto('cuatro-puestas');

  // Mover una que ya estaba puesta.
  await pagina.evaluate(() => document.querySelector('#tablero .pieza--puesta')?.click());
  await pausa(500);
  await foto('moviendo');
  await tocar(fila(4));
  await pausa(600);
  await foto('movida');

  // El mazo abierto, para elegir cuál sigue.
  const abrio = await pagina.evaluate(() => {
    const b = [...document.querySelectorAll('#tablero .carta-accion')].at(-1);
    b?.click();
    return Boolean(document.querySelector('#tablero .mazo-abierto'));
  });
  if (abrio) {
    await pausa(500);
    await foto('mazo-abierto');
    await pagina.evaluate(() => document.querySelector('#tablero .mazo-abierto > .secundario')?.click());
    await pausa(300);
  }

  // Nombrar una fila y sumar otra.
  await herramienta(0);
  await pagina.waitForSelector('#tablero .fila-nombre', { timeout: 4000 });
  await pausa(500);
  await foto('filas-editando');
  await pagina.click('#tablero .fila-nombre', { clickCount: 3 });
  await pagina.keyboard.type('de cabecera');
  await pagina.keyboard.press('Enter');
  await pausa(400);
  await pagina.evaluate(() => document.querySelector('#tablero .filas-edicion .secundario')?.click());
  await pausa(500);
  await foto('fila-nombrada-y-sumada', { entera: true });
  await arriba();
  await rafaga('pestanas-estampadas', () => herramienta(0), { desde: 0, hasta: 520, cada: 3, tope: 12 });
  await pausa(600);
  await arriba();
  await foto('filas-propias');

  // Lo que falta, hasta el cierre. La última, en ráfaga.
  for (let k = 0; k < 20; k++) {
    const quedan = await pagina.evaluate(() => document.querySelectorAll('#tablero .mazo .reparto-boton').length > 0);
    if (!quedan) break;
    const ultima = await pagina.evaluate(() => /\b1 de\b/.test(document.querySelector('#tablero .bandeja-rotulo .fila-cuenta')?.textContent ?? ''));
    const n = (k % 5) + 1;
    if (ultima) await rafaga('cierre', () => pagina.click(fila(n)), { desde: 0, hasta: 1500, cada: 6, tope: 12 });
    else await tocar(fila(n));
    await pausa(380);
  }
  await pausa(1200);
  await foto('resultado-donde-quedo');
  await pagina.evaluate(() => window.scrollTo(0, 0));
  await foto('resultado');
  await foto('resultado-entera', { entera: true });

  // Compartir: sin menú del sistema cae la dirección copiada y la lámina para bajar. Se la mira entera.
  await pagina.evaluate(() => document.querySelector('#tablero .lamina .firma')?.click());
  const hayLamina = await pagina
    .waitForSelector('#tablero .compartir-bajar', { timeout: 15000 })
    .then(() => true)
    .catch(() => false);
  if (hayLamina) {
    await pagina.evaluate(() => {
      const a = document.querySelector('#tablero .compartir-bajar');
      const img = document.createElement('img');
      img.id = 'ver-tarjeta';
      img.src = a.href;
      img.style.cssText = 'position:fixed;inset:0;z-index:99;width:100vw;height:100vh;object-fit:contain;background:#000';
      document.body.append(img);
      return img.decode().catch(() => {});
    });
    await ctx.espera(300);
    await foto('tarjeta');
    await pagina.evaluate(() => document.getElementById('ver-tarjeta')?.remove());
  } else console.log('   (no hubo lámina que mirar)');
  await foto('compartido-entera', { entera: true });

  // ---- los ciento cinco, a medio repartir: el caso pesado
  await pagina.evaluate(() => {
    const b = [...document.querySelectorAll('#tablero .lamina button.secundario')].at(-1);
    b?.click();
  });
  await pagina.waitForSelector('#eleccion:not([hidden])', { timeout: 8000 });
  await pausa(600);
  await rafaga('tapa-viaja', () => elegir('todos', 'Todos los temas'), { desde: 0, hasta: 700, cada: 3, tope: 12 });
  await pausa(600);
  const filas = await pagina.evaluate(() => document.querySelectorAll('#tablero .mazo .reparto-boton').length);
  for (let k = 0; k < 34; k++) {
    // De a tres filas, para que alguna pase de las nueve y se pliegue.
    await tocar(fila((k % Math.min(3, filas)) + 1));
    await ctx.espera(quieto ? 30 : 90);
  }
  await pausa(900);
  await foto('todos-a-medias-donde-quedo');
  await arriba();
  await foto('todos-a-medias');
  await foto('todos-a-medias-entera', { entera: true });
  // Una fila larga, abierta entera y vuelta a plegar.
  if (await pagina.$('#tablero .pliegue')) {
    await tocar('#tablero .pliegue');
    await pausa(500);
    await foto('fila-desplegada', { entera: true });
    await tocar('#tablero .pliegue');
    await pausa(400);
  }

  // Y al volver, la batea ofrece seguir.
  await pagina.goto(url, { waitUntil: 'networkidle0' });
  await pagina.click('#empezar');
  await pagina.waitForSelector('#eleccion:not([hidden])', { timeout: 8000 });
  await pausa(1000);
  await foto('eleccion-con-una-a-medias');
}

/**
 * "Preguntas ricoteras": la portada con la ficha en la ranura, una partida que se pierde (un
 * error, tres aciertos al hilo, y los dos errores que faltan), el resultado con su tarjeta, una
 * partida entera sin errar (la pregunta con rótulo, el aviso de escalón, la victoria) y una
 * retirada.
 */
async function preguntasRicoteras(ctx) {
  const { pagina, foto, tira, rafaga, quieto } = ctx;
  await pagina.goto(`${base}/quiz/`, { waitUntil: 'networkidle0' });
  // El menú de compartir del sistema se queda esperando en el navegador de las capturas.
  await pagina.evaluate(() => {
    try {
      delete Navigator.prototype.share;
    } catch {}
  });
  await tira('portada-entra', () => pagina.reload({ waitUntil: 'domcontentloaded' }), { ms: 900 });
  await pagina.evaluate(() => {
    try {
      delete Navigator.prototype.share;
    } catch {}
  });
  await foto('portada');
  await foto('portada-entera', { entera: true });

  const banco = await pagina.evaluate(() => JSON.parse(document.getElementById('banco').textContent));
  const elDeAhora = async () => {
    const enunciado = await pagina.$eval('#partida .enunciado', (n) => n.textContent);
    const item = banco.find((i) => i.enunciado === enunciado);
    if (!item) throw new Error(`no encuentro en el banco «${enunciado}»`);
    return item;
  };
  const opcion = async (buena) => {
    const item = await elDeAhora();
    const texto = item.opciones.find((o) => !!o.correcta === buena).texto;
    for (const b of await pagina.$$('#partida .opcion:not(:disabled)')) {
      if ((await b.evaluate((n) => n.dataset.texto)) === texto) return b;
    }
    throw new Error(`no hay opción "${texto}"`);
  };
  const fichaLista = () => pagina.waitForSelector('#partida .ficha-respuesta .seguir-ficha', { timeout: 8000 });
  const seguir = async () => {
    await pagina.click('#partida .ficha-respuesta .seguir-ficha');
    await ctx.espera(quieto ? 120 : 900);
    // Si el toque no pasó de pregunta, se dice qué había debajo del dedo: es un defecto del sitio.
    const trabado = await pagina.evaluate(() => {
      const b = document.querySelector('#partida .ficha-respuesta .seguir-ficha');
      if (!b) return null;
      const c = b.getBoundingClientRect();
      const e = document.elementFromPoint(c.left + c.width / 2, c.top + c.height / 2);
      return { caja: [Math.round(c.top), Math.round(c.bottom)], alto: innerHeight, debajo: e ? `${e.tagName}.${e.className}` : null };
    });
    if (trabado) {
      console.log(`   (¡"Seguí" no avanzó! ${JSON.stringify(trabado)})`);
      await pagina.$eval('#partida .ficha-respuesta .seguir-ficha', (b) => b.click());
      await ctx.espera(quieto ? 120 : 520);
    }
  };
  const asentar = () => ctx.espera(quieto ? 150 : 1100);
  const estado = () =>
    pagina.evaluate(() => ({
      vidas: document.querySelector('#partida .vidas')?.getAttribute('aria-label'),
      numero: document.querySelector('#numero-pregunta .solo-lector')?.textContent,
      llevas: document.querySelector('#partida .restantes--llevas')?.textContent,
      racha: document.querySelector('#partida .racha:not([hidden])')?.textContent ?? null,
      boton: document.querySelector('#partida .seguir-ficha')?.textContent,
      desborda: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }));

  // ---- Jugá: la ficha gira de canto, cae por la ranura y el contador da la vuelta.
  await rafaga('mete-la-ficha', () => pagina.click('#jugar'), { desde: 0, hasta: 1000, sobre: '.maquina', zoom: 2, cada: 2, tope: 12, porRenglon: 4 });
  await pagina.waitForSelector('#partida:not([hidden]) .opcion', { timeout: 8000 });
  await ctx.espera(quieto ? 200 : 900);
  await foto('partida');
  await foto('partida-entera', { entera: true });

  // ---- pregunta 1: el error. Se pierde una ficha, la pantalla da un golpe, cae el sello.
  const mala = await opcion(false);
  await rafaga('error-pierde-una', () => mala.click(), { desde: 0, hasta: 1500, cada: 6, tope: 12 });
  await fichaLista();
  await asentar();
  await foto('error-ficha');
  await foto('error-ficha-entera', { entera: true });
  console.log(`   (error: ${JSON.stringify(await estado())})`);

  // El pase: la pantalla se apaga, la rueda del contador da la vuelta, y la pantalla prende.
  await rafaga('pase', () => pagina.click('#partida .ficha-respuesta .seguir-ficha'), { desde: 0, hasta: 1100, cada: 3, tope: 12 });
  await ctx.espera(500);
  await foto('pregunta-2');

  // ---- pregunta 2: el acierto.
  await rafaga('acierto', async () => (await opcion(true)).click(), { desde: 0, hasta: 1900, cada: 8, tope: 12 });
  await fichaLista();
  await asentar();
  await foto('acierto-ficha');
  await foto('acierto-ficha-entera', { entera: true });
  await seguir();

  // ---- preguntas 3 y 4: la racha. En la 3 el cierre se adelanta con un toque.
  await (await opcion(true)).click();
  await ctx.espera(140);
  await pagina.mouse.click(ctx.ancho / 2, 60);
  await fichaLista();
  await asentar();
  await foto('racha-dos-al-hilo');
  console.log(`   (adelantado: ${JSON.stringify(await estado())})`);
  await seguir();
  await (await opcion(true)).click();
  await fichaLista();
  await asentar();
  await foto('racha-tres-al-hilo');
  await seguir();

  // ---- pregunta 5: otro error, mirando solo el tablero: la ficha que se parte y se cae.
  const otraMala = await opcion(false);
  await rafaga('ficha-se-rompe', () => otraMala.click(), { desde: 0, hasta: 950, sobre: '#partida .tablero', zoom: 2, cada: 4, tope: 12, porRenglon: 2 });
  await fichaLista();
  await asentar();
  await seguir();

  // ---- pregunta 6: el tercer error, la última ficha. Fin de la partida.
  const ultimaMala = await opcion(false);
  await rafaga('ultima-ficha', () => ultimaMala.click(), { desde: 0, hasta: 1500, cada: 6, tope: 12 });
  await fichaLista();
  await asentar();
  await foto('sin-fichas');
  console.log(`   (sin fichas: ${JSON.stringify(await estado())})`);
  await rafaga('resultado-entra', () => pagina.click('#partida .ficha-respuesta .seguir-ficha'), { desde: 0, hasta: 1500, cada: 6, tope: 12 });
  await pagina.waitForSelector('#resultado:not([hidden])', { timeout: 8000 });
  await ctx.espera(1200);
  await foto('derrota');
  await foto('derrota-entera', { entera: true });

  // La tarjeta que asoma, mirada entera: se la pone encima de la ventana un momento.
  const mirarLaTarjeta = async (nombre) => {
    await pagina.waitForSelector('.tarjeta-asoma img', { timeout: 8000 }).catch(() => {});
    const hay = await pagina.evaluate(() => {
      const img = document.querySelector('.tarjeta-asoma img');
      if (!img) return false;
      const copia = img.cloneNode();
      copia.id = 'ver-tarjeta';
      copia.className = '';
      copia.style.cssText = 'position:fixed;inset:0;z-index:99;width:100vw;height:100vh;object-fit:contain;background:#000';
      document.body.append(copia);
      return true;
    });
    if (!hay) return console.log('   (no hay tarjeta que mirar)');
    await ctx.espera(300);
    await foto(nombre);
    await pagina.evaluate(() => document.getElementById('ver-tarjeta')?.remove());
  };
  await mirarLaTarjeta('tarjeta-derrota');
  await pagina.evaluate(() => document.querySelector('#resultado .primario.firma')?.click());
  await ctx.espera(700);
  await foto('compartido-entera', { entera: true });

  // ---- otra partida, entera y sin errar: la pregunta con rótulo, el escalón y la victoria.
  await pagina.evaluate(() => document.querySelector('#resultado .pie-resultado button.secundario')?.click());
  await pagina.waitForSelector('#partida:not([hidden]) .opcion', { timeout: 8000 });
  await ctx.espera(quieto ? 200 : 700);
  const vistos = new Set();
  for (let n = 1; n <= banco.length + 2; n++) {
    if (!(await pagina.$('#partida:not([hidden]) .opcion:not(:disabled)'))) break;
    const conRotulo = await pagina.$('#partida .ficha-sellos .insignia');
    const conEscalon = await pagina.$('#partida .escalon');
    const item = await elDeAhora();
    const mirar = [];
    if (conRotulo && !vistos.has('rotulo')) mirar.push('rotulo');
    if (conEscalon && !vistos.has('escalon')) mirar.push('escalon');
    if (!item.disco && !vistos.has('sin-tapa')) mirar.push('sin-tapa');
    if (item.enunciado.length > 110 && !vistos.has('larga')) mirar.push('larga');
    if (item.spotify && !vistos.has('spotify')) mirar.push('spotify');
    for (const m of mirar) vistos.add(m);
    if (mirar.length) {
      await ctx.espera(quieto ? 100 : 500);
      await foto(`pregunta-${mirar.join('-')}`);
    }
    await (await opcion(true)).evaluate((b) => b.click());
    await fichaLista();
    if (mirar.length) {
      await asentar();
      await foto(`ficha-${mirar.join('-')}`, { entera: true });
    }
    if (n === 10) {
      await asentar();
      await foto('racha-diez');
    }
    await pagina.$eval('#partida .ficha-respuesta .seguir-ficha', (b) => b.click());
    await pagina.waitForFunction(() => !document.querySelector('#partida .ficha-respuesta') || document.querySelector('#partida').hidden, { timeout: 8000 });
    await pagina.waitForFunction(() => document.querySelector('#partida').hidden || document.querySelector('#partida .opcion:not(:disabled)'), { timeout: 8000 });
    if (!vistos.has('escalon-cae') && (await pagina.$('#partida:not([hidden]) .escalon'))) {
      vistos.add('escalon-cae');
      await ctx.espera(quieto ? 100 : 900);
      await foto('escalon-como-momento');
    }
  }
  await pagina.waitForSelector('#resultado:not([hidden])', { timeout: 8000 });
  await ctx.espera(1400);
  await foto('victoria');
  await foto('victoria-entera', { entera: true });
  await mirarLaTarjeta('tarjeta-victoria');

  // ---- y una retirada: dos preguntas, "Cerrá la partida", la confirmación y el resultado.
  await pagina.evaluate(() => document.querySelector('#resultado .pie-resultado button.secundario')?.click());
  await pagina.waitForSelector('#partida:not([hidden]) .opcion', { timeout: 8000 });
  await ctx.espera(quieto ? 200 : 700);
  await (await opcion(true)).evaluate((b) => b.click());
  await fichaLista();
  await pagina.$eval('#partida .ficha-respuesta .seguir-ficha', (b) => b.click());
  await ctx.espera(quieto ? 100 : 900);
  await pagina.$eval('#partida .retirada-disparador', (b) => b.click());
  await ctx.espera(300);
  await foto('retirada-confirma');
  await pagina.$eval('#partida .retirada--confirma .secundario', (b) => b.click());
  await pagina.waitForSelector('#resultado:not([hidden])', { timeout: 8000 });
  await ctx.espera(1200);
  await foto('retirada');
}

/**
 * "Adiviná la tapa": la mesa de serigrafía. La portada y la racleta que pasa; una vuelta con
 * error (la prueba en una tinta), acierto (la tirada entera), el pase que cuelga la hoja en la
 * soga, un recorte de nivel difícil, un rótulo de leyenda o de testimonio si sale, el resultado
 * con la tirada colgada y la tarjeta; y otra vuelta sin errar, para la hazaña. Avisa si "Seguí"
 * queda fuera de la ventana y cuánto desborda la hoja de costado.
 */
async function adivinarLaTapa(ctx) {
  const { pagina, foto, tira, rafaga, quieto } = ctx;
  const sinMenu = () =>
    pagina.evaluate(() => {
      try {
        delete Navigator.prototype.share;
      } catch {}
    });
  await pagina.goto(`${base}/juegos/adivinar-la-tapa/`, { waitUntil: 'networkidle0' });
  await tira('portada-entra', () => pagina.reload({ waitUntil: 'domcontentloaded' }), { ms: 900 });
  // El menú de compartir del sistema se queda esperando en el navegador de las capturas.
  await sinMenu();
  await ctx.espera(400);
  await foto('portada');
  await foto('portada-entera', { entera: true });

  const banco = await pagina.evaluate(() => JSON.parse(document.getElementById('banco').textContent));
  const elDeAhora = async () => {
    const ruta = await pagina.$eval('#partida .estampa-papel .tapa-juego', (n) => new URL(n.src).pathname);
    const item = banco.find((i) => i.imagen.ruta === ruta);
    if (!item) throw new Error(`no encuentro en el banco «${ruta}»`);
    return item;
  };
  const opcion = async (buena) => {
    const item = await elDeAhora();
    const texto = item.opciones.find((o) => !!o.correcta === buena).texto;
    for (const b of await pagina.$$('#partida .opcion:not(:disabled)')) {
      if ((await b.evaluate((n) => n.dataset.texto)) === texto) return b;
    }
    throw new Error(`no hay opción "${texto}"`);
  };
  const fichaLista = () => pagina.waitForSelector('#partida .ficha-respuesta .seguir-ficha', { timeout: 8000 });
  const asentar = () => ctx.espera(quieto ? 150 : 1100);
  const estado = () =>
    pagina.evaluate(() => {
      const b = document.querySelector('#partida .seguir-ficha');
      const c = b?.getBoundingClientRect();
      return {
        paso: document.querySelector('#partida .tablero-imprenta-paso')?.textContent,
        llevas: document.querySelector('#partida .restantes--llevas')?.textContent,
        racha: document.querySelector('#partida .racha:not([hidden])')?.textContent ?? null,
        boton: b?.textContent,
        seguiALaVista: c ? c.top >= 0 && c.bottom <= innerHeight : null,
        altoDeLaHoja: document.documentElement.scrollHeight,
        desborda: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });
  const pasar = async () => {
    await pagina.$eval('#partida .ficha-respuesta .seguir-ficha', (b) => b.click());
    await pagina.waitForFunction(
      () => document.querySelector('#partida').hidden || document.querySelector('#partida .opcion:not(:disabled)'),
      { timeout: 8000 },
    );
  };

  // ---- Empezá: la racleta baja y deja la segunda tinta, vuelve y deja la clave.
  await rafaga('pasa-la-racleta', () => pagina.click('#jugar'), { desde: 0, hasta: 1000, sobre: '#mesa-portada', zoom: 1, cada: 3, tope: 18, porRenglon: 6 });
  await pagina.waitForSelector('#partida:not([hidden]) .opcion', { timeout: 8000 });
  await ctx.espera(quieto ? 200 : 900);
  await foto('partida');
  await foto('partida-entera', { entera: true });
  console.log(`   (partida: ${JSON.stringify(await estado())})`);

  // ---- tapa 1: el error. La mesa da un golpe, el pedazo va a su lugar y sale una sola tinta.
  const mala = await opcion(false);
  await rafaga('error-una-tinta', () => mala.evaluate((b) => b.click()), { desde: 0, hasta: 1300, cada: 5, tope: 12 });
  await fichaLista();
  await asentar();
  await foto('error-ficha');
  await foto('error-ficha-entera', { entera: true });
  console.log(`   (error: ${JSON.stringify(await estado())})`);

  // El pase: la hoja sale de la mesa, vuela a la soga y se queda hamacando.
  await rafaga('pase-cuelga-la-hoja', () => pagina.$eval('#partida .ficha-respuesta .seguir-ficha', (b) => b.click()), {
    desde: 0,
    hasta: 1500,
    cada: 5,
    tope: 12,
  });
  await ctx.espera(500);
  await foto('tapa-2');

  // ---- tapa 2: el acierto. El zoom se abre y la racleta pasa cuatro veces.
  const buena = await opcion(true);
  await rafaga('acierto-la-tirada', () => buena.evaluate((b) => b.click()), {
    desde: 0,
    hasta: 1700,
    sobre: '#partida .mesa-imprenta',
    cada: 5,
    tope: 15,
    porRenglon: 5,
  });
  await fichaLista();
  await asentar();
  await foto('acierto-ficha');
  await foto('acierto-ficha-entera', { entera: true });
  console.log(`   (acierto: ${JSON.stringify(await estado())})`);

  // La soga de cerca, mientras llega la hoja: el vuelo y la hamaca.
  await rafaga('pase-la-soga-de-cerca', () => pagina.$eval('#partida .ficha-respuesta .seguir-ficha', (b) => b.click()), {
    desde: 250,
    hasta: 1500,
    sobre: '#partida .tablero-imprenta',
    zoom: 2,
    cada: 5,
    tope: 12,
    porRenglon: 3,
  });
  await ctx.espera(500);

  // ---- lo que queda de la vuelta: acierto y error, de a uno. Se mira lo que vaya saliendo.
  const vistos = new Set();
  const mirarLoQueSale = async (item) => {
    const mirar = [];
    if (item.dificultad === 'dificil' && !vistos.has('nivel-dificil')) mirar.push('nivel-dificil');
    if (item.rotulo && !vistos.has(item.rotulo.tipo)) mirar.push(item.rotulo.tipo);
    for (const m of mirar) vistos.add(m);
    return mirar;
  };
  for (let n = 3; n <= 8; n++) {
    if (!(await pagina.$('#partida:not([hidden]) .opcion:not(:disabled)'))) break;
    const item = await elDeAhora();
    const mirar = await mirarLoQueSale(item);
    if (mirar.includes('nivel-dificil')) {
      await ctx.espera(quieto ? 100 : 500);
      await foto('pregunta-nivel-dificil');
    }
    await (await opcion(n % 2 === 1)).evaluate((b) => b.click());
    await fichaLista();
    if (mirar.length) {
      await asentar();
      await foto(`ficha-${mirar.join('-')}`);
      await foto(`ficha-${mirar.join('-')}-entera`, { entera: true });
      console.log(`   (${mirar.join(', ')}: ${JSON.stringify(await estado())})`);
    }
    // La explicación plegada, y abierta con "Leé más" (una vez).
    if (!vistos.has('leer-mas') && (await pagina.$('#partida .leer-mas'))) {
      vistos.add('leer-mas');
      await asentar();
      await foto('ficha-plegada');
      await pagina.$eval('#partida .leer-mas', (b) => b.click());
      await ctx.espera(300);
      await foto('ficha-abierta-entera', { entera: true });
    }
    const ultima = await pagina.$eval('#partida .tablero-imprenta-paso', (p) => /^(\d+) de \1$/.test(p.textContent));
    if (ultima) {
      await asentar();
      await foto('ultima-ficha');
      await rafaga('llega-el-resultado', () => pagina.$eval('#partida .ficha-respuesta .seguir-ficha', (b) => b.click()), {
        desde: 0,
        hasta: 1800,
        cada: 7,
        tope: 12,
      });
    } else {
      await pasar();
      await ctx.espera(quieto ? 100 : 700);
    }
  }
  await pagina.waitForSelector('#resultado:not([hidden])', { timeout: 8000 });
  await ctx.espera(1400);
  await foto('resultado');
  await foto('resultado-entera', { entera: true });
  console.log(
    `   (resultado: ${JSON.stringify(
      await pagina.evaluate(() => ({
        puntaje: document.querySelector('#resultado .puntaje')?.textContent,
        soga: document.querySelector('#resultado .tendedero')?.getAttribute('aria-label'),
        desborda: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      })),
    )})`,
  );

  // La tarjeta que asoma, mirada entera: se la pone encima de la ventana un momento.
  const mirarLaTarjeta = async (nombre) => {
    await pagina.waitForSelector('.tarjeta-asoma img', { timeout: 8000 }).catch(() => {});
    const hay = await pagina.evaluate(() => {
      const img = document.querySelector('.tarjeta-asoma img');
      if (!img) return false;
      const copia = img.cloneNode();
      copia.id = 'ver-tarjeta';
      copia.className = '';
      copia.style.cssText = 'position:fixed;inset:0;z-index:99;width:100vw;height:100vh;object-fit:contain;background:#000';
      document.body.append(copia);
      return true;
    });
    if (!hay) return console.log('   (no hay tarjeta que mirar)');
    await ctx.espera(300);
    await foto(nombre);
    await pagina.evaluate(() => document.getElementById('ver-tarjeta')?.remove());
  };
  await mirarLaTarjeta('tarjeta');
  await pagina.evaluate(() => document.querySelector('#resultado .primario.firma')?.click());
  await ctx.espera(700);
  await foto('compartido-entera', { entera: true });

  // ---- otra vuelta, sin errar: lo que no haya salido antes, y la hazaña.
  await pagina.evaluate(() => document.querySelector('#resultado .pie-resultado button.secundario')?.click());
  await pagina.waitForSelector('#partida:not([hidden]) .opcion', { timeout: 8000 });
  await ctx.espera(quieto ? 200 : 700);
  for (let n = 1; n <= 8; n++) {
    if (!(await pagina.$('#partida:not([hidden]) .opcion:not(:disabled)'))) break;
    const item = await elDeAhora();
    const mirar = await mirarLoQueSale(item);
    if (mirar.includes('nivel-dificil')) {
      await ctx.espera(quieto ? 100 : 500);
      await foto('pregunta-nivel-dificil');
    }
    // En la compu se contesta con el teclado de verdad: el número de la tecla buena.
    if (ctx.ancho >= 768) {
      const cual = item.opciones.findIndex((o) => o.correcta) + 1;
      await pagina.keyboard.press(String(cual));
      if (n === 1) console.log('   (teclado: se apretó el ' + cual + ')');
    } else await (await opcion(true)).evaluate((b) => b.click());
    await fichaLista();
    if (mirar.length || n === 3) {
      await asentar();
      await foto(`ficha-${mirar.length ? mirar.join('-') : 'tres-al-hilo'}`);
      if (mirar.length) await foto(`ficha-${mirar.join('-')}-entera`, { entera: true });
    }
    await pasar();
    await ctx.espera(quieto ? 100 : 600);
  }
  await pagina.waitForSelector('#resultado:not([hidden])', { timeout: 8000 });
  await ctx.espera(1500);
  await foto('hazana');
  await foto('hazana-entera', { entera: true });
  await mirarLaTarjeta('tarjeta-hazana');
  if (!vistos.has('leyenda')) console.log('   (en estas dos vueltas no salió ninguna tapa con leyenda)');

  // ---- y una tercera, errando todas: el cierre de menos de la mitad.
  await pagina.evaluate(() => document.querySelector('#resultado .pie-resultado button.secundario')?.click());
  await pagina.waitForSelector('#partida:not([hidden]) .opcion', { timeout: 8000 });
  await ctx.espera(quieto ? 200 : 700);
  for (let n = 1; n <= 8; n++) {
    if (!(await pagina.$('#partida:not([hidden]) .opcion:not(:disabled)'))) break;
    await (await opcion(false)).evaluate((b) => b.click());
    await fichaLista();
    const ultima = await pagina.$eval('#partida .tablero-imprenta-paso', (p) => /^(d+) de $/.test(p.textContent));
    if (ultima) {
      await asentar();
      await rafaga('cierre-flojo', () => pagina.$eval('#partida .ficha-respuesta .seguir-ficha', (b) => b.click()), { desde: 0, hasta: 2600, cada: 9, tope: 12 });
    } else {
      await pasar();
      await ctx.espera(quieto ? 100 : 500);
    }
  }
  await pagina.waitForSelector('#resultado:not([hidden])', { timeout: 8000 });
  await ctx.espera(1200);
  await foto('resultado-flojo');
}

/**
 * "Más o menos": la portada, la ficha que se tira, la pregunta, un acierto con "más" y otro con
 * "menos" (los que salgan), el pase de la ficha a la pila, la racha larga (con la mejor racha
 * del aparato pasada en el camino), el error con la pila que se cae, el resultado, la tarjeta,
 * lo compartido y una segunda vuelta errando la primera.
 *
 * Con `--peor`, le cambia al navegador el pozo para que **todas** las preguntas lleven el
 * enunciado, el nombre y la explicación más largos, números de cinco cifras con unidad y el
 * detalle de las palabras; recorre lo justo y dice, por tamaño, si la hoja desborda, si "Jugá"
 * y las dos teclas entran en la ventana y si "Seguí" queda a la vista. Pensado para correrlo
 * con los diez tamaños (`--tamanos 320x568,360x640,…`).
 */
async function masOMenos(ctx) {
  const { pagina, foto, tira, rafaga, quieto, ancho, alto } = ctx;
  const peor = bandera('--peor');
  const ruta = `${base}/juegos/mas-o-menos/`;
  const prefijo = `${ancho}${quieto ? '-quieto' : ''}`;

  if (peor) {
    const empeorar = (isla) => {
      const mas = (campo) => isla.datos.map((d) => d[campo] ?? '').sort((a, b) => b.length - a.length)[0];
      const palabra = isla.datos.filter((d) => d.temas).sort((a, b) => b.temas.length - a.temas.length)[0];
      const pregunta = mas('pregunta');
      const sujeto = mas('sujeto');
      const explicacion = mas('explicacion');
      return {
        ...isla,
        datos: isla.datos.map((d, i) => ({
          ...d,
          // El enunciado tiene que seguir siendo único: por él se busca el dato.
          pregunta: `${pregunta.replace(/\?$/, '')} (${i})?`,
          sujeto,
          explicacion,
          medida: 'peor',
          escala: 'entero',
          unidad: ['persona', 'personas'],
          valor: 10000 + i * 257,
          techo: undefined,
          formas: palabra?.formas,
          temas: palabra?.temas,
        })),
      };
    };
    await pagina.setRequestInterception(true);
    pagina.on('request', async (pedido) => {
      if (pedido.resourceType() !== 'document' || !pedido.url().includes('/juegos/mas-o-menos')) return pedido.continue();
      try {
        const html = await (await fetch(pedido.url())).text();
        const cambiado = html.replace(/(<script[^>]*id="pozo"[^>]*>)([\s\S]*?)(<\/script>)/, (_, abre, json, cierra) => abre + JSON.stringify(empeorar(JSON.parse(json))) + cierra);
        await pedido.respond({ status: 200, contentType: 'text/html; charset=utf-8', body: cambiado });
      } catch (e) {
        console.log(`   (no pude empeorar el pozo: ${e.message})`);
        await pedido.continue();
      }
    });
  }

  const sinMenuDeCompartir = () =>
    pagina.evaluate(() => {
      try {
        delete Navigator.prototype.share;
      } catch {}
    });
  const ponerMejor = (n) =>
    pagina.evaluate((valor) => {
      try {
        if (valor > 0) localStorage.setItem('arcade.mas-o-menos.mejor', String(valor));
        else localStorage.removeItem('arcade.mas-o-menos.mejor');
      } catch {}
    }, n);

  await pagina.goto(ruta, { waitUntil: 'networkidle0' });
  // La mejor racha del aparato: 3, para que la portada la muestre y la partida la pase.
  await ponerMejor(peor ? 0 : 3);
  if (peor) await pagina.reload({ waitUntil: 'networkidle0' });
  else await tira('portada-entra', () => pagina.reload({ waitUntil: 'domcontentloaded' }), { ms: 900 });
  await sinMenuDeCompartir();
  await ctx.espera(300);
  await foto('portada');
  if (!peor) await foto('portada-entera', { entera: true });

  const pozo = await pagina.evaluate(() => JSON.parse(document.getElementById('pozo').textContent).datos);
  /** Cuál es la tecla buena, leyendo la pantalla como la lee quien juega: la pregunta y la ficha a la vista. */
  const elDeAhora = async () => {
    const visto = await pagina.evaluate(() => ({
      enunciado: document.querySelector('#pregunta .enunciado')?.textContent,
      referencia: document.querySelector('#pregunta .ficha-mm--vista .ficha-mm-numero')?.textContent,
    }));
    const dato = pozo.find((d) => d.pregunta === visto.enunciado);
    if (!dato) throw new Error(`no encuentro en el pozo «${visto.enunciado}»`);
    const texto = visto.referencia ?? '';
    const referencia =
      dato.escala === 'segundos'
        ? texto.split(':').reduce((minutos, segundos) => Number(minutos) * 60 + Number(segundos))
        : Number(texto.replace(/\./g, ''));
    if (!Number.isFinite(referencia)) throw new Error(`no entiendo la referencia «${texto}»`);
    return { dato, buena: dato.valor > referencia ? 'mas' : 'menos' };
  };
  const tecla = async (acertar) => {
    const { buena } = await elDeAhora();
    const cual = acertar ? buena : buena === 'mas' ? 'menos' : 'mas';
    const boton = await pagina.$(`#pregunta .opcion[data-eleccion="${cual}"]:not(:disabled)`);
    if (!boton) throw new Error(`no hay tecla "${cual}"`);
    return { boton, cual };
  };
  const fichaLista = () => pagina.waitForSelector('#revelado .seguir-ficha', { timeout: 8000 });
  const asentar = () => ctx.espera(quieto ? 200 : 1300);
  const estado = () =>
    pagina.evaluate(() => {
      const caja = (sel) => {
        const n = document.querySelector(sel);
        if (!n) return null;
        const c = n.getBoundingClientRect();
        return [Math.round(c.top), Math.round(c.bottom)];
      };
      return {
        racha: document.querySelector('#partida .racha-cuenta .solo-lector')?.textContent ?? null,
        pila: document.querySelector('#partida .apilada')?.getAttribute('aria-label') ?? null,
        hazana: !!document.querySelector('#partida .mejor-chapa--pasada'),
        clases: document.getElementById('partida').className,
        ficha: Math.round(document.querySelector('#pregunta .ficha-mm--tuya')?.offsetHeight ?? 0),
        plegada: !!document.querySelector('#revelado .ficha-respuesta--plegada'),
        alto: innerHeight,
        desliza: Math.round(scrollY),
        teclas: caja('#pregunta .masomenos-opciones'),
        mesa: caja('#pregunta .mesa'),
        seguir: caja('#revelado .seguir-ficha'),
        desborda: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });
  const seguir = async () => {
    await pagina.click('#revelado .seguir-ficha');
    await ctx.espera(quieto ? 150 : 700);
  };

  // ---- Jugá: la ficha salta, da una vuelta entera en el aire y cae boca abajo.
  const jugar = await pagina.evaluate(() => {
    const c = document.getElementById('jugar').getBoundingClientRect();
    return { abajo: Math.round(c.bottom), alto: innerHeight, desborda: document.documentElement.scrollWidth - document.documentElement.clientWidth };
  });
  console.log(`   (portada: "Jugá" termina en ${jugar.abajo} de ${jugar.alto}; desborda ${jugar.desborda})`);
  if (peor) await pagina.click('#jugar');
  else await rafaga('tira-la-ficha', () => pagina.click('#jugar'), { desde: 0, hasta: 700, sobre: '.en-mano', zoom: 1, cada: 3, tope: 12, porRenglon: 4 });
  await pagina.waitForSelector('#partida:not([hidden]) .opcion', { timeout: 8000 });
  await ctx.espera(quieto ? 200 : 900);
  await foto('pregunta');
  console.log(`   (pregunta: ${JSON.stringify(await estado())})`);

  if (peor) {
    // Lo justo: un acierto con la ficha de la respuesta, el error, y el resultado.
    await (await tecla(true)).boton.click();
    await fichaLista();
    await asentar();
    await foto('peor-acierto');
    console.log(`   (peor, acierto: ${JSON.stringify(await estado())})`);
    await seguir();
    await (await tecla(false)).boton.click();
    await fichaLista();
    await asentar();
    await foto('peor-error');
    console.log(`   (peor, error: ${JSON.stringify(await estado())})`);
    await seguir();
    await pagina.waitForSelector('#resultado:not([hidden])', { timeout: 8000 });
    await ctx.espera(quieto ? 300 : 1600);
    await foto('peor-resultado', { entera: true });
    const fin = await pagina.evaluate(() => ({ desborda: document.documentElement.scrollWidth - document.documentElement.clientWidth, altoHoja: document.documentElement.scrollHeight }));
    console.log(`   (peor, resultado: ${JSON.stringify(fin)})`);
    return;
  }

  // ---- El primer acierto: la ficha se da vuelta, cae el sello y llega la ficha de la respuesta.
  {
    const { boton, cual } = await tecla(true);
    await rafaga(`acierto-${cual}-se-da-vuelta`, () => boton.click(), { desde: 0, hasta: 1100, cada: 4, tope: 12 });
    await fichaLista();
    await asentar();
    await foto(`acierto-${cual}`);
    await foto(`acierto-${cual}-entera`, { entera: true });
    console.log(`   (acierto 1: ${JSON.stringify(await estado())})`);
  }
  // ---- El pase: la ficha ganada vuela a la pila y se reparten las dos que siguen.
  await rafaga('pase-a-la-pila', () => pagina.click('#revelado .seguir-ficha'), { desde: 0, hasta: 800, cada: 3, tope: 12 });
  await ctx.espera(quieto ? 150 : 500);
  await foto('pregunta-2');

  // ---- La racha larga: seis seguidas. En la cuarta se pasa la mejor racha del aparato (3).
  const vistas = new Set();
  for (let i = 2; i <= 6; i++) {
    const { boton, cual } = await tecla(true);
    if (i === 2 && !quieto) {
      // La vuelta de la ficha, de cerca y lenta: el canto se tiene que ver.
      await tira('la-ficha-se-da-vuelta', () => boton.click(), { ms: 380, sobre: '#pregunta .mesa' });
    } else if (ancho >= 768) {
      // En la compu se juega con el teclado: ← y → por el lado de la tecla, ↑ y ↓ por lo que dice.
      const orden = await pagina.$$eval('#pregunta .opcion', (teclas) => teclas.map((t) => t.dataset.eleccion));
      const flecha = i % 2 === 1 ? (cual === 'mas' ? 'ArrowUp' : 'ArrowDown') : orden[0] === cual ? 'ArrowLeft' : 'ArrowRight';
      await pagina.keyboard.press(flecha);
      console.log(`   (con el teclado: ${flecha})`);
    } else {
      await boton.click();
    }
    await fichaLista();
    await asentar();
    if (!vistas.has(cual) || i === 4) {
      vistas.add(cual);
      await foto(`acierto-${i}-${cual}`);
    }
    console.log(`   (acierto ${i}: ${JSON.stringify(await estado())})`);
    if (i === 6) break;
    await seguir();
  }
  await seguir();
  await ctx.espera(quieto ? 150 : 600);
  await foto('racha-larga');

  // ---- El error: la ficha se da vuelta, cae la cruz, la partida da un golpe y la pila se viene abajo.
  {
    const { boton, cual } = await tecla(false);
    await rafaga(`error-${cual}-se-cae-la-pila`, () => boton.click(), { desde: 0, hasta: 1500, cada: 5, tope: 12 });
    await fichaLista();
    await asentar();
    await foto('error-ficha');
    await foto('error-ficha-entera', { entera: true });
    console.log(`   (error: ${JSON.stringify(await estado())})`);
  }

  // ---- El resultado: la pila se arma ficha por ficha y la cifra sube con ella.
  await rafaga('resultado-entra', () => pagina.click('#revelado .seguir-ficha'), { desde: 0, hasta: 1500, cada: 6, tope: 12 });
  await pagina.waitForSelector('#resultado:not([hidden])', { timeout: 8000 });
  await ctx.espera(quieto ? 400 : 1500);
  await foto('resultado');
  await foto('resultado-entera', { entera: true });
  // La tarjeta, tal cual se comparte.
  await pagina.waitForSelector('#resultado .tarjeta-asoma img', { timeout: 8000 }).catch(() => console.log('   (¡la tarjeta no asomó!)'));
  const tarjeta = await pagina.evaluate(async () => {
    const foto = document.querySelector('#resultado .tarjeta-asoma img');
    if (!foto) return null;
    const bytes = new Uint8Array(await (await fetch(foto.src)).arrayBuffer());
    let crudo = '';
    for (const b of bytes) crudo += String.fromCharCode(b);
    return btoa(crudo);
  });
  if (tarjeta) {
    const destino = join(salida, `${prefijo}-tarjeta.png`);
    await sharp(Buffer.from(tarjeta, 'base64')).png().toFile(destino);
    console.log('tarjeta', destino);
  }
  await pagina.$eval('#resultado .pie-resultado .primario', (b) => b.click());
  await ctx.espera(500);
  await pagina.$eval('#resultado .pie-resultado', (n) => n.scrollIntoView({ block: 'center' }));
  await ctx.espera(200);
  await foto('compartido');

  // ---- Otra vuelta, errando la primera: el cierre de cero.
  await pagina.$eval('#resultado .pie-resultado .secundario', (b) => b.click());
  await pagina.waitForSelector('#partida:not([hidden]) .opcion', { timeout: 8000 });
  await ctx.espera(quieto ? 200 : 800);
  await (await tecla(false)).boton.click();
  await fichaLista();
  await asentar();
  await foto('error-en-la-primera');
  await seguir();
  await pagina.waitForSelector('#resultado:not([hidden])', { timeout: 8000 });
  await ctx.espera(quieto ? 400 : 1300);
  await foto('resultado-cero');
}

/**
 * "Armá tu recital": la portada con la hoja en blanco, la boletería (las cuatro pestañas), la
 * entrada que viaja, el armado (un tema que se escribe, el papelito a la cuenta, mover, bises,
 * el casete del pie), el cierre en dos tiempos, la noche sonando, la tarjeta, y la vuelta a la
 * portada con la lista guardada.
 *
 * Con `--peor`, arma el peor caso: el lugar de nombre más largo y los veinticinco temas de
 * título más largo, con los bises llenos. Es lo que se mira en los diez tamaños.
 */
async function armaTuRecital(ctx) {
  const { pagina, foto, tira, rafaga, quieto, ancho } = ctx;
  const peor = bandera('--peor');
  const url = `${base}/juegos/arma-tu-recital/`;
  const prefijo = `${ancho}${quieto ? '-quieto' : ''}`;
  const pausa = (ms) => ctx.espera(quieto ? Math.min(ms, 200) : ms);

  // Sin menú del sistema para compartir: en el navegador de las capturas se queda esperando.
  await pagina.evaluateOnNewDocument(() => {
    try {
      delete Navigator.prototype.share;
      delete Navigator.prototype.canShare;
    } catch {
      /* queda el del navegador */
    }
  });
  /** Un toque que no desplaza la hoja: el pie va pegado abajo y un clic "de verdad" la corre. */
  const tocar = (selector) => pagina.evaluate((s) => document.querySelector(s)?.click(), selector);
  const arriba = async () => {
    await pagina.evaluate(() => window.scrollTo(0, 0));
    await ctx.espera(120);
  };
  const medidas = () =>
    pagina.evaluate(() => {
      const visible = [...document.querySelectorAll('main > section.pantalla')].find((s) => !s.hidden);
      const chicos = [...(visible?.querySelectorAll('button, a[href], input') ?? [])]
        .filter((n) => n.offsetParent !== null && getComputedStyle(n).visibility !== 'hidden')
        .map((n) => ({ n, r: n.getBoundingClientRect() }))
        .filter(({ r }) => r.width > 0 && (r.height < 47.5 || r.width < 47.5))
        .map(({ n, r }) => `${(n.textContent ?? '').trim().slice(0, 18) || n.className}:${Math.round(r.width)}x${Math.round(r.height)}`);
      return {
        pantalla: visible?.id,
        alto: document.documentElement.scrollHeight,
        desborda: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        chicos: [...new Set(chicos)].slice(0, 6),
      };
    });
  const anotar = async (que) => console.log(`   (${que}: ${JSON.stringify(await medidas())})`);

  await pagina.goto(url, { waitUntil: 'networkidle0' });
  await pagina.evaluate(() => {
    try {
      for (const k of Object.keys(localStorage)) if (k.startsWith('fichin.recital.')) localStorage.removeItem(k);
    } catch {
      /* sin almacenamiento */
    }
  });

  // ---- el peor caso: se entra por la dirección, que es como llega una lista compartida
  if (peor) {
    const armado = await pagina.evaluate(() => {
      const c = JSON.parse(document.getElementById('catalogo').textContent);
      const porLargo = c.temas.map((t, i) => ({ i, n: t.titulo.length })).sort((a, b) => b.n - a.n).map((t) => t.i);
      const lugar = [...c.lugares].sort((a, b) => (b.nombre + b.ciudad).length - (a.nombre + a.ciudad).length)[0];
      return { lugar, temas: porLargo };
    });
    // Se arma a mano, tocando: así el peor caso pasa también por el armado.
    await pagina.click('#empezar');
    await pagina.waitForSelector('#eleccion:not([hidden]) .recital-entrada', { timeout: 8000 });
    await anotar('peor, la boletería');
    if (armado.lugar.tipo === 'teatro') await tocar('[data-clave="pestana-teatro"]');
    await ctx.espera(200);
    await tocar(`[data-clave="lugar-${armado.lugar.slug}"]`);
    await pagina.waitForSelector('#tablero:not([hidden]) .recital-funda-boton', { timeout: 8000 });
    await tocar('[data-clave="sonido"]');
    for (const i of armado.temas) {
      const pudo = await pagina.evaluate((i) => {
        // El cajón está plegado por disco: se abre la funda del tema antes de tocarlo.
        const disco = JSON.parse(document.getElementById('catalogo').textContent).temas[i].disco;
        const funda = document.querySelector(`[data-clave="funda-${disco}"]`);
        if (funda?.getAttribute('aria-expanded') === 'false') funda.click();
        const b = document.querySelector(`[data-clave="tema-${i}"]`);
        if (!b || b.disabled) return false;
        b.click();
        return true;
      }, i);
      if (!pudo) break;
      await ctx.espera(30);
    }
    // Los últimos de la lista bajan a los bises hasta llenarlos.
    for (let k = 0; k < 8; k++) {
      const pudo = await pagina.evaluate(() => {
        const ultimo = [...document.querySelectorAll('#tablero .recital-hoja .recital-lista')][0]?.lastElementChild?.querySelector('.recital-renglon-boton');
        if (!ultimo) return false;
        ultimo.click();
        const alBis = document.querySelector('.recital-accion--tira');
        const antes = document.querySelectorAll('.recital-hoja .recital-renglon').length;
        alBis?.click();
        document.querySelector('.recital-renglon--marcado .recital-renglon-boton')?.click();
        return antes > 0;
      });
      if (!pudo) break;
      await ctx.espera(40);
    }
    await ctx.espera(500);
    await arriba();
    await foto('peor-armado-abierto');
    // Plegada, que es como se elige: la hoja pegada arriba, el cajón y el pie.
    if ((await pagina.$eval('[data-clave="pliegue"]', (b) => b.getAttribute('aria-expanded'))) === 'true') await tocar('[data-clave="pliegue"]');
    await pagina.evaluate(() => document.querySelector('#tablero .recital-cajon')?.scrollIntoView({ block: 'start' }));
    await ctx.espera(300);
    console.log(
      `   (peor, plegada: ${JSON.stringify(
        await pagina.evaluate(() => {
          const hoja = document.querySelector('.recital-hoja-caja').getBoundingClientRect();
          const pie = document.querySelector('.recital-pie').getBoundingClientRect();
          return { hoja: Math.round(hoja.height), pie: Math.round(pie.height), libre: Math.round(pie.top - hoja.bottom), ventana: innerHeight };
        }),
      )})`,
    );
    await foto('peor-armado');
    await foto('peor-armado-entera', { entera: true });
    await anotar('peor, el armado');
    console.log(
      `   (peor, el pie: ${JSON.stringify(
        await pagina.evaluate(() => {
          const pie = document.querySelector('.recital-pie')?.getBoundingClientRect();
          const cerrar = document.querySelector('[data-clave="cerrar"]')?.getBoundingClientRect();
          return { pie: Math.round(pie?.height ?? 0), cerrarAbajo: Math.round(cerrar?.bottom ?? 0), ventana: innerHeight, cuenta: document.querySelector('.recital-cuenta .solo-lector')?.textContent };
        }),
      )})`,
    );
    await tocar('[data-clave="cerrar"]');
    await pagina.waitForSelector('#resultado:not([hidden]) .recital-hoja--noche', { timeout: 8000 });
    await pagina.click('#resultado .recital-noche-titulo');
    await pagina.waitForSelector('#resultado .pie-resultado', { timeout: 8000 });
    await pagina.waitForSelector('#resultado .tarjeta-asoma img', { timeout: 15000 }).catch(() => console.log('   (¡la hoja no asomó!)'));
    await ctx.espera(600);
    await arriba();
    await foto('peor-noche');
    await foto('peor-noche-entera', { entera: true });
    await anotar('peor, la noche');
    return;
  }

  // ---- la portada: la hoja en blanco se escribe
  await tira('portada-entra', () => pagina.reload({ waitUntil: 'domcontentloaded' }), { ms: 2400, lento: 0.25 });
  await ctx.espera(quieto ? 300 : 1500);
  await foto('portada');
  await foto('portada-entera', { entera: true });
  await anotar('portada');
  console.log(
    `   (portada, el botón: ${JSON.stringify(await pagina.evaluate(() => ({ abajo: Math.round(document.getElementById('empezar').getBoundingClientRect().bottom), ventana: innerHeight })))})`,
  );

  // ---- dónde tocan: las cuatro pestañas
  await pagina.click('#empezar');
  await pagina.waitForSelector('#eleccion:not([hidden]) .recital-entrada', { timeout: 8000 });
  await pausa(900);
  await foto('lugar-estadios');
  await foto('lugar-estadios-entera', { entera: true });
  await anotar('estadios');
  await tocar('[data-clave="pestana-teatro"]');
  await pausa(700);
  await foto('lugar-teatros-entera', { entera: true });
  await anotar('teatros');
  await tocar('[data-clave="pestana-descampado"]');
  await pausa(300);
  await foto('lugar-descampado');
  await tocar('[data-clave="pestana-otro"]');
  await pausa(300);
  await foto('lugar-otro');
  await tocar('[data-clave="pestana-estadio"]');
  await pausa(700);
  await arriba();

  // ---- la entrada viaja a la cabecera del armado
  await rafaga('la-entrada-viaja', () => tocar('[data-clave="lugar-obras"], .recital-talonario .recital-entrada'), { desde: 0, hasta: 900, cada: 4, tope: 12 });
  await pagina.waitForSelector('#tablero:not([hidden]) .recital-funda-boton', { timeout: 8000 });
  await pausa(700);
  await foto('armado-vacio');
  await foto('armado-vacio-entera', { entera: true });
  await anotar('armado vacío');

  // ---- el cajón: diez fundas cerradas, y una que se abre
  await pagina.evaluate(() => document.querySelector('#tablero .recital-cajon')?.scrollIntoView({ block: 'start' }));
  await ctx.espera(250);
  await foto('cajon-diez-fundas');
  await arriba();
  await rafaga('la-funda-se-abre', () => tocar('#tablero .recital-funda-boton'), { desde: 0, hasta: 600, cada: 3, tope: 12 });
  await pausa(400);
  await foto('funda-abierta');

  // ---- el primer tema: el renglón se escribe
  const libres = () => pagina.$$eval('#tablero .recital-tema-cajon:not(:disabled)', (bs) => bs.map((b) => b.dataset.clave));
  const sumar = async (k = 0) => {
    const claves = await libres();
    const clave = claves[Math.min(k, claves.length - 1)];
    await tocar(`[data-clave="${clave}"]`);
    return clave;
  };
  await tira('renglon-se-escribe', () => sumar(0), { ms: 420, sobre: '#tablero .recital-hoja' });
  await pausa(600);
  await foto('un-tema-sonando');
  // El casete del pie, girando mientras suena (a velocidad real: lo mueve un reloj).
  await tira('casete-del-pie', async () => {}, { ms: 1000, lento: 1, sobre: '#tablero .recital-pie' });
  await anotar('un tema');

  // ---- eligiendo, con la hoja plegada y pegada arriba: el renglón nuevo se escribe a la vista
  for (const k of [1, 2]) {
    await sumar(k);
    await pausa(500);
  }
  await pagina.evaluate(() => document.querySelector('#tablero .recital-funda--abierta')?.scrollIntoView({ block: 'start' }));
  await ctx.espera(300);
  await rafaga('eligiendo-con-la-hoja-plegada', () => sumar(2), { desde: 0, hasta: 800, cada: 4, tope: 12 });
  await pausa(400);
  await foto('eligiendo');
  for (const k of [3, 4, 4]) {
    await sumar(k);
    await pausa(260);
  }
  await pausa(600);
  await foto('eligiendo-siete-temas');
  console.log(
    `   (eligiendo: ${JSON.stringify(
      await pagina.evaluate(() => {
        const hoja = document.querySelector('.recital-hoja-caja').getBoundingClientRect();
        const pie = document.querySelector('.recital-pie').getBoundingClientRect();
        return { hojaArriba: Math.round(hoja.top), hoja: Math.round(hoja.height), pie: Math.round(pie.height), libre: Math.round(pie.top - hoja.bottom), ventana: innerHeight };
      }),
    )})`,
  );
  await tocar('[data-clave="pie-parar"]');
  await pausa(900);

  // ---- la hoja abierta: marcar, mover, tachar y mandar a los bises
  await arriba();
  await foto('hoja-plegada');
  await tocar('[data-clave="pliegue"]');
  await pausa(400);
  await arriba();
  await foto('hoja-abierta');
  await pagina.evaluate(() => document.querySelectorAll('#tablero .recital-renglon-boton')[2]?.click());
  await pausa(400);
  await foto('renglon-marcado');
  await rafaga('renglon-sube', () => tocar('.recital-accion--subir'), { desde: 0, hasta: 520, cada: 3, tope: 12, sobre: '#tablero .recital-hoja' });
  await pausa(300);
  await pagina.evaluate(() => document.querySelector('.recital-renglon--marcado .recital-renglon-boton')?.click());
  // Sacar: la fibra tacha el título, el tema sale y los de abajo suben. Después se lo vuelve a sumar.
  await pagina.evaluate(() => document.querySelectorAll('#tablero .recital-renglon-boton')[3]?.click());
  await pausa(300);
  // (En ráfaga y a velocidad real: el tachón dura lo que un reloj de la isla, que una tira lenta no frena.)
  await rafaga('tachon', () => tocar('.recital-accion--sacar'), { desde: 0, hasta: 1000, cada: 4, tope: 12, sobre: '#tablero .recital-hoja' });
  await pausa(700);
  await rafaga('sale-y-suben', async () => {
    await pagina.evaluate(() => document.querySelectorAll('#tablero .recital-renglon-boton')[1]?.click());
    await ctx.espera(150);
    await tocar('.recital-accion--sacar');
  }, { desde: 150, hasta: 1300, cada: 5, tope: 12, sobre: '#tablero .recital-hoja' });
  await pausa(500);
  for (const k of [0, 0]) {
    await sumar(k);
    await pausa(300);
  }
  await tocar('[data-clave="pie-parar"]');
  for (let k = 0; k < 2; k++) {
    await pagina.evaluate(() => {
      const lista = document.querySelector('#tablero .recital-hoja .recital-lista');
      lista?.lastElementChild?.querySelector('.recital-renglon-boton')?.click();
      document.querySelector('.recital-accion--tira')?.click();
      document.querySelector('.recital-renglon--marcado .recital-renglon-boton')?.click();
    });
    await pausa(450);
  }
  await arriba();
  await foto('hoja-con-bises');
  await foto('armado-entera', { entera: true });
  await anotar('armado con bises');
  await tocar('[data-clave="pliegue"]');
  await pausa(300);
  await foto('hoja-plegada-con-bises');

  // ---- buscar, y otra funda
  await pagina.type('#tablero .recital-buscador', 'ji');
  await pausa(400);
  await foto('buscando');
  await pagina.evaluate(() => {
    const b = document.querySelector('#tablero .recital-buscador');
    b.value = '';
    b.dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelectorAll('#tablero .recital-funda-boton')[2]?.click();
  });
  await pausa(400);
  await foto('otra-funda');
  await arriba();

  // ---- el cierre en dos tiempos: la lista se escribe sola y después entra el pie
  await rafaga('la-noche-se-escribe', () => tocar('[data-clave="cerrar"]'), { desde: 0, hasta: 2400, cada: 9, tope: 12 });
  await pagina.waitForSelector('#resultado:not([hidden]) .recital-hoja--noche', { timeout: 8000 });
  await pausa(1800);
  await pagina.waitForSelector('#resultado .tarjeta-asoma img', { timeout: 15000 }).catch(() => console.log('   (¡la hoja no asomó!)'));
  await pausa(600);
  await foto('noche');
  await foto('noche-entera', { entera: true });
  await anotar('la noche');

  // ---- suena la lista: el casete de la cabina y el sello en el renglón
  await tocar('[data-clave="escuchar-noche"]');
  await pausa(1500);
  await arriba();
  await foto('noche-sonando');
  await tira('casete-de-la-noche', async () => {}, { ms: 1000, lento: 1, sobre: '#resultado .recital-cabina' });
  if (ancho < 768) {
    // En el teléfono se la deja sonar entera (diez segundos por tema): el resaltador en el
    // renglón que suena, y al final la cinta que se rebobina y el sello que cae en la hoja.
    await ctx.espera(9000);
    await foto('noche-resaltador');
    await pagina.waitForFunction(() => document.querySelector('#resultado .recital-sello-fin'), { timeout: 150000, polling: 500 });
    await ctx.espera(quieto ? 300 : 900);
    await foto('noche-sono-entera');
    await arriba();
    await foto('noche-sono-entera-arriba');
  } else {
    await tira('casete-de-la-noche-frena', () => tocar('[data-clave="escuchar-noche"]'), { ms: 1100, lento: 1, sobre: '#resultado .recital-cabina' });
    await pausa(300);
  }

  // ---- la tarjeta, tal cual se comparte
  const tarjeta = await pagina.evaluate(async () => {
    const img = document.querySelector('#resultado .tarjeta-asoma img');
    if (!img) return null;
    const bytes = new Uint8Array(await (await fetch(img.src)).arrayBuffer());
    let crudo = '';
    for (const b of bytes) crudo += String.fromCharCode(b);
    return btoa(crudo);
  });
  if (tarjeta) {
    const destino = join(salida, `${prefijo}-tarjeta.png`);
    await sharp(Buffer.from(tarjeta, 'base64')).png().toFile(destino);
    console.log('tarjeta', destino);
  } else console.log('   (no hubo hoja que mirar)');
  await pagina.$eval('#resultado .pie-resultado .primario', (b) => b.click());
  await ctx.espera(600);
  await pagina.$eval('#resultado .pie-resultado', (n) => n.scrollIntoView({ block: 'center' }));
  await ctx.espera(200);
  await foto('compartido');

  // ---- la lista que te pasaron: se abre por la dirección, en otra pestaña sin nada guardado
  const direccion = pagina.url();
  await pagina.evaluate(() => {
    try {
      localStorage.removeItem('fichin.recital.partida');
    } catch {
      /* sin almacenamiento */
    }
  });
  await tira('lista-ajena-se-escribe', () => pagina.goto(direccion, { waitUntil: 'domcontentloaded' }), { ms: 1600, lento: 0.5 });
  await pausa(1500);
  await foto('lista-ajena');

  // ---- y la portada con una lista a medio armar: la hoja ya no está en blanco
  await pagina.evaluate(() => document.querySelector('#resultado .pie-resultado button.secundario')?.click());
  await pagina.waitForSelector('#eleccion:not([hidden]) .recital-entrada', { timeout: 8000 });
  await tocar('.recital-talonario .recital-entrada');
  await pagina.waitForSelector('#tablero:not([hidden]) .recital-funda-boton', { timeout: 8000 });
  await tocar('[data-clave="sonido"]');
  await tocar('#tablero .recital-funda-boton');
  for (const k of [0, 1, 2, 3, 4, 5]) {
    await sumar(k);
    await ctx.espera(60);
  }
  await pagina.goto(url, { waitUntil: 'networkidle0' });
  await pausa(2600);
  await foto('portada-con-lista-guardada');
}

/** Cualquier otra ruta: la portada, y lo que aparece al tocar el botón de empezar. */
async function generico(ctx, ruta) {
  const { pagina, foto, tira } = ctx;
  await pagina.goto(`${base}${ruta}`, { waitUntil: 'networkidle0' });
  await tira('portada-entra', () => pagina.reload({ waitUntil: 'domcontentloaded' }), { ms: 900 });
  await foto('portada');
  await foto('portada-entera', { entera: true });
  const empezar = (await pagina.$('#jugar')) ?? (await pagina.$('#portada .primario')) ?? (await pagina.$('.primario'));
  if (!empezar) return;
  await empezar.click();
  await ctx.espera(1200);
  await foto('partida');
  await foto('partida-entera', { entera: true });
  // Si la pantalla tiene buscador, se escribe algo para ver el campo y la lista.
  if (await pagina.$('.buscador-caja')) {
    await pagina.type('.buscador-caja', 'la ');
    await ctx.espera(400);
    await foto('sugerencias');
    const primera = await pagina.$('.sugerencia:not(:disabled)');
    if (primera) {
      await primera.click();
      await ctx.espera(500);
      await foto('elegido');
    }
  }
  // La primera respuesta, si la pantalla es de opciones.
  const opcionUno = await pagina.$('.opcion:not(:disabled)');
  if (opcionUno) {
    await tira('respuesta', () => opcionUno.click(), { ms: 600 });
    await foto('respondida');
    await foto('respondida-entera', { entera: true });
  }
}

const RECORRIDOS = {
  'adivinar-el-tema': adivinarElTema,
  'dos-ejes': dosEjes,
  'adivinar-por-la-letra': porLaLetra,
  'skayboy-y-poligirl': skayboy,
  'completar-la-letra': completarLaLetra,
  'ponelos-en-fila': ponelosEnFila,
  quiz: preguntasRicoteras,
  'preguntas-ricoteras': preguntasRicoteras,
  'adivinar-la-tapa': adivinarLaTapa,
  'mas-o-menos': masOMenos,
  'arma-tu-recital': armaTuRecital,
};

// ---------------------------------------------------------------- correr

const nav = await puppeteer.launch({
  executablePath: EDGE,
  headless: true,
  userDataDir: perfil,
  args: ['--autoplay-policy=no-user-gesture-required', '--mute-audio'],
});

let fallo = null;
try {
  const modos = bandera('--solo-quieto') ? [true] : bandera('--sin-quieto') ? [false] : [false, true];
  for (const [ancho, alto] of tamanos) {
    for (const quieto of modos) {
      const ctx = await abrir(nav, ancho, alto, quieto);
      const recorrido = RECORRIDOS[juego];
      console.log(`--- ${juego} a ${ancho}×${alto}${quieto ? ', movimiento reducido' : ''}`);
      if (recorrido) await recorrido(ctx);
      else await generico(ctx, juego.startsWith('/') ? juego : `/${juego}/`);
      await ctx.pagina.close();
    }
  }
} catch (e) {
  fallo = e;
} finally {
  await nav.close();
}
if (fallo) {
  console.error(fallo);
  process.exit(1);
}
