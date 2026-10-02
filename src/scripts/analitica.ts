/**
 * Cuánta gente entra y a qué pantalla: Vercel Web Analytics (`D-56`).
 *
 * Es esta y no otra porque ya vive en el mismo lugar que el sitio: el script sale del
 * propio dominio (`/_vercel/insights/script.js`), no deja cookies y no le pide nada a nadie
 * —ni consentimiento, ni cuenta—. No es un molinete (`D-14`).
 *
 * Va por isla y no con el `<Analytics />` que trae el paquete por dos razones:
 *
 * - **Ese componente pone una etiqueta propia (`<vercel-analytics>`) adentro del `<head>`**,
 *   y el navegador cierra la cabecera al encontrarla: todo lo que viene después —las
 *   etiquetas de `Cabeza.astro` para la tarjeta compartida, la ranura `cabeza` de `Base`—
 *   pasaría al cuerpo.
 * - **Por isla lo ve `islas.test.ts`**, que es el que lleva la cuenta de qué paquete de npm
 *   llega al teléfono de la gente.
 *
 * Solo corre en el sitio publicado. En `astro dev` ese archivo no existe, y el paquete en
 * modo desarrollo se bajaría su versión de depuración de un CDN ajeno. Si un bloqueador lo
 * frena, no se pierde nada: ninguna pantalla depende de esto.
 */
import { inject } from '@vercel/analytics';

if (import.meta.env.PROD) inject({ mode: 'production', framework: 'astro' });
