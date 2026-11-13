/**
 * La baldosa del casco del último bondi (`D-85`), servida en el build como archivo estático.
 * El dibujo vive en `lib/sitio/casco.ts`; acá solo se entrega.
 */

import type { APIRoute } from 'astro';
import { cascoSvg } from '../../lib/sitio/casco.ts';

export const GET: APIRoute = () =>
  new Response(cascoSvg(), { headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' } });
