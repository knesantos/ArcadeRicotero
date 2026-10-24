/**
 * El motor de los reels: graba una página cuadro por cuadro y la pasa a mp4 (`D-81`).
 *
 * La página expone `window.__cuadro(t)` y el motor le saca una foto por cuadro, a 30 por
 * segundo, en 1080x1920. Nada depende del reloj real: el mismo comando da el mismo video. Las
 * páginas usan `tokens.css` y las fuentes del sitio, que sirve `astro dev`, así el rojo y la
 * letra salen del sistema (`diseno-marca.md`) y no de un editor de video.
 *
 * Hacen falta tres cosas afuera del repo, por variable de entorno:
 *   NAVEGADOR   un Chrome sin ventana. En esta PC Edge con --headless no levanta, así que va
 *               `chrome-headless-shell` (npx @puppeteer/browsers install chrome-headless-shell@131.0.6778.204).
 *               Ojo con la ruta: con más de 260 caracteres Windows no lo encuentra.
 *   FFMPEG      el ejecutable de ffmpeg.
 *   SITIO_LOCAL dónde corre `npm run dev` (por defecto http://localhost:4321).
 */
import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import puppeteer from 'puppeteer-core';

function requerida(nombre) {
  const v = process.env[nombre];
  if (!v) throw new Error(`Falta la variable ${nombre}. Mirá la cabecera de scripts/reels/motor.mjs.`);
  return v;
}

export const FFMPEG = process.env.FFMPEG ?? 'ffmpeg';
export const REPO = resolve('.');
export const SITIO = process.env.SITIO_LOCAL ?? 'http://localhost:4321';
/** Una carpeta de trabajo por corrida, para el video mudo y el audio antes de juntarlos. */
export const trabajo = () => mkdtempSync(join(tmpdir(), 'reel-'));
const FPS = 30;

export function correr(bin, args) {
  return new Promise((ok, mal) => {
    const p = spawn(bin, args, { stdio: ['ignore', 'ignore', 'pipe'] });
    let err = '';
    p.stderr.on('data', (d) => (err += d));
    p.on('close', (c) => (c === 0 ? ok() : mal(new Error(err.slice(-2000)))));
  });
}

/** El CSS de marca, con las fuentes apuntando al sitio (misma origen que la página). */
export function tokens() {
  return readFileSync(`${REPO}/src/styles/tokens.css`, 'utf-8');
}

/**
 * opciones: { url, html, duracion, salida, antes(page), virtual }
 * Con `html`, va a la raíz del sitio y reemplaza el documento (las fuentes quedan en el mismo origen).
 */
export async function grabar({ url, html, duracion, salida, antes, virtual = false }) {
  // En un solo proceso el arranque a veces se cae a la primera; con un segundo intento alcanza.
  const lanzar = () => puppeteer.launch({
    executablePath: requerida('NAVEGADOR'),
    headless: 'shell',
    protocolTimeout: 240000,
    // Un solo proceso y sin GPU: así arranca también donde no puede abrir procesos hijos.
    args: ['--no-sandbox', '--single-process', '--disable-gpu', '--disable-software-rasterizer', '--in-process-gpu', '--hide-scrollbars', '--mute-audio', '--autoplay-policy=no-user-gesture-required'],
  });
  const nav = await lanzar().catch(lanzar);
  const page = await nav.newPage();
  await page.setViewport({ width: 360, height: 640, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  if (virtual) {
    // El reloj de mentira: rAF y performance.now avanzan solo cuando el motor lo pide.
    await page.evaluateOnNewDocument(() => {
      let ahora = 0;
      let cola = [];
      let id = 0;
      performance.now = () => ahora;
      window.requestAnimationFrame = (cb) => (cola.push([++id, cb]), id);
      window.cancelAnimationFrame = (x) => (cola = cola.filter(([i]) => i !== x));
      window.__avanzar = (ms) => {
        ahora += ms;
        const c = cola;
        cola = [];
        for (const [, cb] of c) {
          try { cb(ahora); } catch (e) { console.error(e); }
        }
      };
    });
  }
  page.on('pageerror', (e) => console.error('página:', e.message));
  if (html) {
    // La pieza se sirve como si fuera una página del sitio: mismo origen para las fuentes, sin el cliente de Vite.
    url = SITIO + '/__reel.html';
    await page.setRequestInterception(true);
    page.on('request', (r) => (r.url() === url ? r.respond({ status: 200, contentType: 'text/html; charset=utf-8', body: html }) : r.continue()));
  }
  // Algunos caminos nunca dejan la red quieta (la rocola pide recortes): se espera la carga y un rato de calma.
  await page.goto(url, { waitUntil: 'load', timeout: 120000 });
  await page.waitForNetworkIdle({ idleTime: 500, timeout: 15000 }).catch(() => {});
  await page.evaluate(() => document.fonts.ready);
  if (antes) await antes(page);
  if (process.env.FOTOS) {
    // Modo prueba: unas fotos sueltas en vez del video.
    for (const t of process.env.FOTOS.split(',').map(Number)) {
      if (virtual) for (let x = 0; x < Math.round(t * FPS); x++) await page.evaluate((t) => window.__cuadro(t), x / FPS);
      await page.evaluate((t) => window.__cuadro(t), t);
      await page.screenshot({ path: `${salida}-${t}.png` });
      console.log(`  ${salida}-${t}.png`);
    }
    await nav.close();
    process.exit(0);
  }

  const ff = spawn(FFMPEG, ['-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(FPS), salida],
    { stdio: ['pipe', 'ignore', 'pipe'] });
  let err = '';
  ff.stderr.on('data', (d) => (err += d));
  const cerrado = new Promise((ok, mal) => ff.on('close', (c) => (c === 0 ? ok() : mal(new Error(err.slice(-1500))))));

  const total = Math.round(duracion * FPS);
  for (let i = 0; i < total; i++) {
    const t = i / FPS;
    await page.evaluate((t) => window.__cuadro(t), t);
    const foto = await page.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(foto)) await new Promise((r) => ff.stdin.once('drain', r));
    if (i % 60 === 0) process.stdout.write(`  ${salida.split('/').pop()} ${t.toFixed(1)}s\n`);
  }
  ff.stdin.end();
  await cerrado;
  await nav.close();
}

/** Junta video y audio en el mp4 final. */
export async function juntar(video, audio, salida) {
  await correr(FFMPEG, ['-y', '-i', video, '-i', audio, '-vf', 'scale=out_range=tv,format=yuv420p', '-c:v', 'libx264', '-crf', '18', '-c:a', 'aac', '-b:a', '192k',
    '-shortest', '-movflags', '+faststart', salida]);
}
