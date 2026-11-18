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
    async tira(nombre, disparar, { ms = 400, lento = 0.1, cuadros = 6 } = {}) {
      if (quieto) {
        // Con movimiento reducido no hay animación que mirar: se dispara y se saca una sola.
        await disparar();
        await espera(250);
        return ctx.foto(`${nombre}-quieto`);
      }
      await cdp.send('Animation.setPlaybackRate', { playbackRate: lento });
      const total = ms / lento;
      const fotos = [];
      const momentos = [];
      const t0 = Date.now();
      await disparar();
      for (let i = 0; i < cuadros; i++) {
        const cuando = (total * i) / (cuadros - 1);
        const falta = cuando - (Date.now() - t0);
        if (falta > 0) await espera(falta);
        fotos.push(await pagina.screenshot({ optimizeForSpeed: true }));
        momentos.push(Date.now() - t0);
      }
      // A velocidad real una captura tarda lo suyo: se dice cuándo cayó cada cuadro de verdad.
      if (lento === 1) console.log(`   (${nombre}: cuadros a ${momentos.join(', ')} ms)`);
      await cdp.send('Animation.setPlaybackRate', { playbackRate: 1 });
      // Lo que quedó a medio camino termina a velocidad real antes de seguir.
      await espera(Math.min(ms * 2, 1500));
      const hueco = 6;
      const ruta = join(salida, `${prefijo}-tira-${numero()}-${nombre}${lento < 1 ? `-lento-x${Math.round(1 / lento)}` : ''}.png`);
      await sharp({
        create: { width: cuadros * ancho + (cuadros - 1) * hueco, height: alto, channels: 3, background: '#ff00ff' },
      })
        .composite(fotos.map((f, i) => ({ input: f, left: i * (ancho + hueco), top: 0 })))
        .png()
        .toFile(ruta);
      console.log('tira', ruta);
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
  if (await pagina.$('.ruidos')) {
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
        return f && f.textContent.trim().startsWith(`${m} de`) && o && o.getAttribute('aria-disabled') !== 'true';
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
      // El pase que entra a «Cuando suena».
      await tira('pasa-a-cuando-suena', () => opcion(0), { ms: 1900, lento: 1 });
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
