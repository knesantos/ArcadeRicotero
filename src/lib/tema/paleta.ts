/**
 * Cada tema revelado viste **la tinta real de su disco**.
 *
 * ## Qué problema resuelve, y por qué no es decoración
 *
 * `RES-37` muestreó por conteo de píxeles las diez tapas y dejó los veinte valores en
 * `tokens.css` — diez `-tinta` que pasan AA sobre `--fondo` y diez `-apoyo` que son
 * borde y relleno. La sección de letras y acordes ya los usa: cada disco se viste con el
 * suyo.
 *
 * En "adiviná el tema" no se usaba ninguno. Los 105 temas se revelaban todos con el
 * mismo naranja de Lobo suelto, que es el color de la **sección**, no del tema. Y acá el
 * tema no es el contenido de la pantalla: **es la respuesta**. Que Oktubre se revele en
 * el rojo de Oktubre y *Susanita* en el naranja quemado de La mosca y la sopa es el
 * premio más barato y más grande que el sitio puede dar: el jugador se lleva el disco,
 * no un número.
 *
 * ## Cómo convive con `D-19`, que reparte un disco por sección
 *
 * `D-19` viste **categorías**: esta pantalla es `mitologia` y le toca Lobo suelto. Eso no
 * se toca — la portada, la barra, el botón de escuchar y el de arriesgar siguen siendo
 * `--cat-mitologia`, y la base (fondo, grano, zona pulgar, acierto, error) no rota nunca.
 * Lo que rota es **la ficha del tema revelado**, que es un objeto del catálogo y no una
 * parte de la pantalla.
 *
 * El precedente es el cancionero, y está escrito en `tokens.css`: *"la mezcla de `D-19`
 * vestía cuatro categorías con cuatro discos; el cancionero necesita más, y cada sección
 * se viste con el suyo — los diez. Es la misma idea llevada a su conclusión, no una idea
 * nueva."* Acá pasa exactamente eso.
 *
 * ## Por qué una clase y no un color
 *
 * Este módulo **no devuelve ningún color**: devuelve el nombre de una clase. El valor lo
 * pone `juego.css` con `var(--disco-<slug>-tinta)`, y el hex sigue viviendo únicamente en
 * `tokens.css`, que es lo que exige `.claude/rules/diseno-marca.md` y lo que audita
 * `estilos.test.ts`. Si mañana se remuestrea una tapa, esta pantalla cambia sola y este
 * archivo no se toca.
 */

/*
 * De `discos.ts` y NO de `temas.ts`, aunque `temas.ts` re-exporte lo mismo.
 *
 * `temas.ts` importa `node:fs` para parsear la ficha `RES-20`, y este modulo corre en el
 * navegador: la primera version importaba de alla y **el juego entero dejo de arrancar**.
 * No lo vio ningun test —Node tiene `fs`— ni el chequeo de tipos. Lo vio abrir la pagina.
 * `islas.test.ts` existe desde entonces para que no vuelva a pasar en silencio.
 */
import { DISCOS, type Disco } from '../letra/discos.ts';

export { DISCOS, type Disco };

/**
 * El prefijo de las clases que pinta `juego.css`. Está acá y no escrito a mano en la
 * isla para que el test pueda cruzar las diez clases contra la hoja de estilo.
 */
export const PREFIJO = 'disco--';

/**
 * La clase que viste una pieza con la tinta de su disco, o `''` si el slug no es uno de
 * los diez.
 *
 * **Devolver `''` ante lo desconocido es la parte importante.** Un disco que no está en
 * la lista no puede pintar la pantalla de un color inventado: se queda con la tinta de la
 * sección, que es un valor medido igual. Es el mismo criterio con el que `arte.ts`
 * devuelve `null` cuando el recorte todavía no existe — un hueco declarado nunca rompe
 * la pantalla.
 */
export function claseDisco(slug: string): string {
  return (DISCOS as readonly string[]).includes(slug) ? `${PREFIJO}${slug}` : '';
}

/** Las diez clases, en el orden cronológico de `DISCOS`. Es lo que el test recorre. */
export function clases(): readonly string[] {
  return DISCOS.map((d) => `${PREFIJO}${d}`);
}
