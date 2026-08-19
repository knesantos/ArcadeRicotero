// @ts-check
import { defineConfig } from 'astro/config';

// Salida estatica pura (D-15): sin adapter, sin serverless, sin runtime.
// Entra en el tier gratuito de Vercel, asi que el sitio sobrevive aunque la
// suscripcion Pro no. Arquitectura de islas por D-02: HTML estatico por defecto
// y JavaScript solo adentro de cada juego.
export default defineConfig({
  output: 'static',
  build: { format: 'directory' },
  compressHTML: true,
});
