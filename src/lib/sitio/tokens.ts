/**
 * Leer un token de marca desde el codigo, sin copiarlo.
 *
 * `tokens.css` es el UNICO lugar del repo donde puede vivir un hex — lo dice la regla de
 * marca y lo verifica `estilos.test.ts`. Pero hay dos lugares donde un color tiene que
 * salir del CSS: la etiqueta `theme-color` (que pinta la barra del navegador en el
 * celular) y los archivos de marca social que genera `scripts/generar-marca-social.mjs`.
 *
 * La salida facil era escribir `#14100e` en el `<head>` y seguir. Eso deja dos verdades
 * sobre el mismo color, y la de afuera del CSS no la ve nadie cuando el token cambia.
 * Esto lee el valor del propio `tokens.css` en build: si manana el fondo se aclara, la
 * barra del navegador se aclara sola.
 *
 * Corre en build (frontmatter de Astro y scripts de node), nunca en el navegador.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const CACHE = new Map<string, string>();

/** El valor de un token (`--fondo`, `--marca-rojo`) tal como esta escrito en tokens.css. */
export function token(nombre: string): string {
  const guardado = CACHE.get(nombre);
  if (guardado) return guardado;

  const css = readFileSync(join(process.cwd(), 'src', 'styles', 'tokens.css'), 'utf-8');
  // Solo la primera declaracion, que es la de :root. El nombre va anclado para que
  // `--fondo` no matchee `--fondo-elevado`.
  const hallado = new RegExp(`${nombre}\\s*:\\s*([^;]+);`).exec(css);
  if (!hallado) throw new Error(`tokens.css no declara ${nombre}`);

  const valor = hallado[1]!.trim();
  CACHE.set(nombre, valor);
  return valor;
}
