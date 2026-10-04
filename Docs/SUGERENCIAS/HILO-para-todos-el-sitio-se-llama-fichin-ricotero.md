# El sitio se llama Fichín Ricotero — lo que le toca a cada uno

**De:** hilo principal · **Para:** todos los roles · **Fecha:** 2026-10-04 · **Decisión:** `D-60`

El dominio de Arcade Ricotero no se pudo comprar y el usuario cambió el nombre: el sitio se
llama **Fichín Ricotero**, con tilde. El código ya está al día (rama `nombre/fichin-ricotero`):
las cuatro formas de la marca, los dos pinceles, las tarjetas del taller, los títulos de
pestaña, los textos para compartir ("en el fichín ricotero"), los botones que nombran el lugar
(*Volvé al fichín*, *← AL FICHÍN*) y el ícono. Oktubre Calco pasó a la v0.4, con la F, la H, la
N y la Í derivadas de sus propias letras.

Los papeles históricos **no se reescriben**: dicen Arcade Ricotero porque eso es lo que se
decidió en su momento. Lo que sigue es lo que conviene que cada rol mire en lo suyo, sin apuro:
nada de esto traba la publicación.

## `contenido`

- `CNT-13` (los nombres del lugar) describe el portal con el `h1` "ARCADE RICOTERO". Un pie de
  enmienda que diga que desde `D-60` es "FICHÍN RICOTERO" alcanza.
- La bajada del quiz (*"Se te cae una moneda en la ranura."*) se justificaba con "es un
  arcade". Con el nombre nuevo la imagen gana: la ficha es literalmente lo que se le mete al
  fichín. Si querés, una línea que lo diga.
- Los textos para compartir pasaron de "en el arcade ricotero" a "en el fichín ricotero",
  con minúscula, como nombre común. Si preferís el nombre propio con mayúscula, es una cadena
  por juego, en el `copy.ts` de cada uno.

## `experiencia`

- El lienzo (`diseno-marca.md`) se llama ahora "Sistema de marca Fichín Ricotero". Las hojas
  01 (marca) y 10 (tarjeta compartible) muestran el nombre viejo si no se actualizaron; la
  marca nueva está entera en Oktubre Calco v0.4 (`public/fuentes/oktubre-calco.woff`).
- `UX-24` y `UX-35` nombran la marca como "ARCADE RICOTERO" en sus medidas. Las medidas no
  cambian: FICHÍN es más angosta que ARCADE y la línea que manda el ancho sigue siendo
  RICOTERO (medido: la carátula de la mesa mide lo mismo con los dos nombres).

## `investigador`

- La v0.4 de Oktubre Calco no está en `Docs/INVESTIGACION/Tipografia/` (es tu carpeta). Para
  dejarla junto a la v0.3 y anotarla en `RES-43` (`INV-07`):

  ```
  python scripts/derivar-oktubre-calco.py Docs/INVESTIGACION/Tipografia/OktubreCalco-v0.4.otf
  ```

  Las cuatro letras nuevas son derivadas, no calcadas: el paso 5 de `RES-39`, hecho con
  pedazos de las letras de la tapa (detalle en `D-60`).

## `arquitectura`

- Nada que hacer. El espacio de nombres `arcade.` de `localStorage` (`ADR-04.5`) queda como
  está a propósito: cambiarlo borraría el avance guardado de la gente.

## Fuera de los roles

- **El dominio (`D-59`, rama `dominio/fichinricotero`).** Sigue esperando que
  `fichinricotero.com.ar` responda por HTTPS; al escribir esto no resuelve DNS. Cuando entre a
  `main` después de esta rama, las tarjetas del taller chocan como binario: se resuelve con
  `npm run generar-dos-ejes`. **Ojo:** `D-59` está reservado dos veces (esa rama y el ciclo
  19); uno de los dos tiene que renumerar antes de integrar.
- **El hilo de difusión (PR #26).** Ya usa el nombre nuevo. Las capturas muestran la marca
  vieja: se vuelven a sacar cuando esto esté publicado.
- **Skayboy (rama local `skayboy/menu-y-mando`).** El trabajo del menú y el pulgar choca de
  numeración con el ciclo 18 (`D-56`, `UX-36`, `CNT-30`, `BR-36`, `T-331`+). No entra en esta
  rama; su sesión está avisada.
