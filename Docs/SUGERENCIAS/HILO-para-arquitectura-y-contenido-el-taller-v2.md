# HILO → `arquitectura` y `contenido` — el taller de dos ejes cambió al construir: lo que quedó desfasado en sus papeles

- **De:** hilo principal, ciclo 18, al aplicar `UX-36` §10 (2026-10-04).
- **Para:** `arquitectura` (`CTR-08` v2.6, `ADR-02`) y `contenido` (`CNT-01`, `CNT-29` §4).
- **Por qué está acá:** son documentos de cada rol. El código ya está; esto dice qué dejó de ser
  cierto en el papel. Las razones están en `D-57`, enmiendas del 2026-10-04.

## Para `arquitectura` (`CTR-08` v2.6 y v2.9)

1. **Las piezas son cuatro, no tres.** `PIEZAS` (`src/lib/dos-ejes/arte.ts`) es ahora `marmol`
   (125, 700, 540 × 253 → 540 × 253), `lomo` (0, 0, 100 × 953 → 40 × 380), `esquinero` (sin
   cambios) y `franja` (sin cambios, **solo la usa el taller**). `canto` se retiró y su archivo
   se borró. La guarda de lo prohibido no cambió y las cuatro cajas la pasan.
2. **Las fuentes del taller son cuatro, no dos.** A Oktubre Calco y Archivo Black se suman
   `scripts/fuentes/dejavu-sans.ttf` y `dejavu-sans-bold.ttf` (DejaVu recortada al latín, con
   `LICENCIA-DEJAVU.txt`). La sans de la tarjeta dejó de salir de la fuente del sistema: se
   dibuja como trazos y se **mide**, y el taller falla si un renglón no entra en el papel. La
   huella las cuenta a las cuatro.
3. **El manifiesto suma `medidas`**: `altoDeLaHojaDeLaTarjeta` (hoy 769), `altoDeLaHojaDeLaVista`
   (440) y `ordenDeLaPortada` (los cuatro nombres en orden alfabético). `tarjetas.test.ts`
   vigila que el alto quede entre 740 y 860 y que el orden sea el alfabético (`UX-36` §6.5,
   guardas 3 y 4). Son los dos "agujeros recomendados" de v2.6, ya cerrados.
4. **Los rojos e1–e11 de v2.9 están en `esquemas.test.ts`**, cada uno en su lugar, con el
   control en verde (un retirado y un borrador sin momento). Y la guarda `disposicion`↔`relacion`
   está en `partida.test.ts`. v2.9 los da por faltantes: ya no faltan.
5. **El enlace viejo**: se respetó `ADR-02` punto 6 (no se redirige). La isla le pega a la tapa
   la etiqueta del amigo, sin pisar el subtítulo. `UX-36` §3.3 proponía `location.replace()`;
   quedó su alternativa.

## Para `contenido`

1. **`CNT-01`**: falta la fila de DejaVu Sans (licencia Bitstream Vera, con los cambios de
   DejaVu en dominio público), **solo para el taller**, no se sirve al navegador. Mismo formato
   que la fila G de Archivo Black.
2. **`CNT-29` §4**: `PANTALLA_0.desafio` se retiró del código. El enlace viejo ya no muestra
   esa línea: muestra la etiqueta del amigo (rótulo `POSTAL.rotulo`, nombre, sello y línea que
   nombra). La tabla de §4 queda como historia; si querés, marcala reemplazada.
3. **`PANTALLA_0.sinNoche`** es una cadena nueva que propuso el hilo (`UX-36` §4.8, registro 3):
   *"Esta noche no se pudo armar. Volvé a cargar la página."* Confirmala o cambiala.
