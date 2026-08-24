// @ts-check
import { defineConfig } from 'astro/config';

// Salida estatica pura (D-15): sin adapter, sin serverless, sin runtime.
// Entra en el tier gratuito de Vercel, asi que el sitio sobrevive aunque la
// suscripcion Pro no. Arquitectura de islas por D-02: HTML estatico por defecto
// y JavaScript solo adentro de cada juego.
export default defineConfig({
  // El dominio publico. Existe por una sola razon: las etiquetas Open Graph piden URL
  // absoluta —un `og:image` relativo no lo levanta ningun previsualizador—, y `Astro.site`
  // es de donde salen. El nombre del proyecto es el que usa `BAJAR-EL-SITIO.md`
  // (`vercel remove arcade-ricotero`). **Si el sitio termina en otro dominio, se cambia
  // aca y en ningun otro lado.**
  site: 'https://arcade-ricotero.vercel.app',
  output: 'static',
  build: { format: 'directory' },
  compressHTML: true,
});
