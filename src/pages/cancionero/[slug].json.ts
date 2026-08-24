/**
 * Un JSON por tema, generado en build.
 *
 * **Por qué esto existe.** "Armar cancionero" es lo único del sitio que necesita el texto
 * de una canción **en el navegador**: hasta que el jugador no elige, no se sabe cuáles.
 * Las tres salidas posibles eran mandarle el corpus entero (1,4 MB para que se lleve
 * cuatro temas — inaceptable en el celular, que es el aparato de este proyecto),
 * pre-generar cada combinación (imposible: son 2^104), o servir un archivo por tema y
 * bajar solo los elegidos. Es la tercera.
 *
 * Sale en build como archivo estático: sigue sin haber backend (`D-15`).
 */

import type { APIRoute } from 'astro';
import crudo from '../../data/cancionero.json';
import { cargar, type Cancionero } from '../../lib/cancionero/banco.ts';

export function getStaticPaths() {
  return cargar(crudo as unknown as Cancionero).map((tema) => ({
    params: { slug: tema.slug },
    props: { tema },
  }));
}

export const GET: APIRoute = ({ props }) =>
  new Response(JSON.stringify(props.tema), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
