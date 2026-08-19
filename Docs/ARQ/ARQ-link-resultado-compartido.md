# ARQ — Formato del link de resultado compartido

> Rol dueño: `arquitectura`. Consume: `D-02` (sin backend), `D-09`, `D-10`, `UX-01`,
> `UX-02`, `Docs/SUGERENCIAS/UX-para-arquitectura-formato-link-resultado.md`.
> Produce: `ADR-02`. Última actualización: 2026-08-19.

---

## ADR-02 — Cómo viaja un puntaje dentro de una URL, sin backend

- **Fecha:** 2026-08-19
- **Estado:** **aceptada.** No depende de ninguna evidencia externa: se decide y listo.
- **Pedido por:** `experiencia`, para `UX-01` Pantalla 0 Variante B y `UX-02`.

### Contexto

`D-10` puso la difusión adentro de la v1, y el brief dice que el resultado compartido
**es** la puerta de entrada, no el final de la partida. Para que el que recibe el link vea
"Fulano sacó 7/8, ¿te la bancás?", el puntaje tiene que viajar en la propia URL: no hay
backend donde guardarlo (`D-02`).

### Decisión

**Parámetros de consulta en claro, cortos y legibles.**

```
https://<sitio>/?g=quiz&p=7&t=8&n=Santi
```

| Param | Qué es | Validación |
|---|---|---|
| `g` | juego | enum: `quiz` · `tema` · `letra` · `tapa` |
| `p` | puntaje o aciertos | entero, `0 ≤ p ≤ t` |
| `t` | total posible | entero, `1 ≤ t ≤ 50` |
| `n` | nombre de quien comparte | opcional, ≤ 20 caracteres |

**Todos los parámetros son opcionales.** Sin ninguno, es una visita normal (Variante A de
`UX-01`). El desafío es una capa encima de la entrada, no un modo aparte.

### Reglas duras

1. **Si algo no valida, se ignora el desafío entero y se entra como visita normal.**
   Nunca un mensaje de error, nunca una pantalla rota por una URL mal copiada. Un link
   truncado por un cliente de mensajería tiene que degradar a "home", no a "algo salió
   mal".
2. **`n` es entrada no confiable y se trata como tal.** Se renderiza con `textContent`,
   **nunca** con `innerHTML`, y se filtra a letras, números, espacios, guiones y
   apóstrofos antes de mostrarlo. Es el único agujero de seguridad real que tiene un sitio
   estático: un nombre inyectado desde la URL es XSS reflejado de manual. No es paranoia,
   es la única superficie que existe.
3. **La URL entera se mantiene por debajo de ~100 caracteres**, para que entre cómoda en
   un tuit junto al texto.
4. **El puntaje recibido no se mezcla con el propio.** El de uno vive en `localStorage`;
   el del otro vive en la URL y se olvida al navegar. Nunca se escribe el puntaje ajeno
   en el almacenamiento local.

### El dato es manipulable, y está aceptado

Cualquiera puede editar `p=7` a `p=8` en la barra de direcciones. **Sin backend no hay
forma de impedirlo**, y firmar el número con una clave que viaja en el propio JavaScript
sería teatro: la clave está a la vista de quien abra el bundle.

Lo dejo escrito para que sea una decisión y no un descuido, como pidió `experiencia`. No
agrego checksum: daría sensación de integridad sin darla, y le arruinaría el chiste al que
quiere compartir un 8/8 editado a mano. El desafío es social, no competitivo.

### Alternativas descartadas

- **Payload codificado en base64url** (`?r=eyJwIjo3fQ`). Descartada porque agrega un
  decodificador y un modo de falla nuevo (payload corrupto) a cambio de ocultar un dato
  que no es secreto. Y porque un link opaco da menos ganas de tocarlo: `p=7&t=8` se
  entiende de un vistazo, y eso juega a favor del bucle de compartir.
- **Fragmento de hash** (`#g=quiz&p=7`). Descartada porque en un sitio estático no aporta
  nada que el query no dé, y *supuesto:* algunos generadores de vista previa normalizan o
  descartan el fragmento. Ante dos opciones equivalentes, la convencional.
- **Acortador de URLs externo.** Descartada por lo que ya dijo `experiencia`: mete una
  dependencia de red y de un tercero que el proyecto no tiene en ningún otro lado, y de
  paso le filtra a ese tercero quién comparte qué.
- **Firmar el puntaje con HMAC.** Descartada: ver arriba. La clave estaría en el cliente.

### Consecuencias, y una que `experiencia` necesita saber ya

- **Fácil:** implementarlo. Es `new URLSearchParams(location.search)` y cuatro
  validaciones. Sirve igual para los cuatro juegos.
- **Fácil:** extenderlo. Si `producto` decide agregar la racha o el tiempo, es un
  parámetro más con la misma regla de "si no valida, se ignora".
- **Difícil — y esto cambia una expectativa:** **la vista previa del tuit no va a mostrar
  el puntaje.** Un sitio estático sirve las mismas metaetiquetas Open Graph para todas las
  URLs, así que la tarjeta que arma Twitter es fija: el "Fulano sacó 7/8" aparece recién
  **al abrir el sitio**, no en el timeline. Generar una vista previa por resultado exigiría
  un servicio de imágenes o renderizado en servidor, las dos cosas fuera de alcance
  (`D-02`, costo recurrente cero). *Supuesto verificable si a alguien le importa mucho:
  no pedí ficha porque no cambia la decisión, solo la expectativa.*
  Consecuencia práctica: la imagen compartible de `UX-02` gana peso, porque **la imagen es
  el único canal que lleva el puntaje al timeline**. El link lleva el desafío; la imagen
  lleva el número.
