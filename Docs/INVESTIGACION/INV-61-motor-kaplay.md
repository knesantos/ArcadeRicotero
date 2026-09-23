# INV-61 — La licencia del motor: qué dice el paquete que se instala, y no la rama que se mira

> Pedido del hilo principal el 2026-09-18, en mitad de `T-226`, la compuerta de `ADR-08.1`.
> Al correr la condición 4 —*"no trae código vendorizado con licencia propia adentro del
> paquete"*— apareció algo que esa condición no estaba buscando: **la licencia del motor
> mismo no es la que dice el contrato**.
>
> **Responde:** qué licencia tiene realmente `kaplay@3001.0.19`, desde cuándo, si el uso que
> le da este sitio cae dentro de sus restricciones, y si el repuesto declarado está limpio.
>
> **Consume:** `ADR-08` y su compuerta `ADR-08.1` (`ARQ-motor-de-juego.md`), `RES-62`
> (`INV-60`), `BR-15` consecuencia 1, `D-14`, `D-12`,
> `Docs/SUGERENCIAS/ARQ-para-investigador-motor-kaplay.md`.
>
> **Numeración:** `RES-70` … `RES-72`, del rango `RES-70`+ que `Docs/IDS.md` reserva al
> ciclo 15. Sub-hallazgos en `RES-70.1`, `RES-70.2`, y así.
>
> **Quién hizo qué, porque `D-12` parte el trabajo en dos.** Las fichas las levantó el rol
> `investigador`, que es el único con salida a la web; las **pegó acá el hilo principal**,
> porque ese rol no tiene con qué escribir un archivo. Las mediciones sobre el paquete
> instalado —las que dicen "medido en disco"— son del hilo principal, corriendo comandos, y
> por eso **no llevan número `RES-`**: una ficha `RES-` es un hecho externo con URL, y leer
> un archivo de `node_modules/` no lo es.
>
> **Aviso de método, y es el hallazgo más transferible de todo el archivo.** La ficha que
> esto corrige no inventó nada: **leyó el archivo equivocado.** `RES-62.4` consultó
> `raw.githubusercontent.com/kaplayjs/kaplay/`**`master`**`/LICENSE`, y en `master` la
> licencia sí es MIT plano. Lo que se instala no sale de `master`: sale del **tag de la
> versión**. Los dos archivos existen, dicen cosas distintas, y el que manda es el del tag.
> De ahí sale la regla del final de este archivo.

---

## RES-70 — `kaplay@3001.0.19` no es MIT: es MIT con una cláusula anti-IA agregada

| Ficha | Hallazgo | Fuente | Fecha | Estado |
|---|---|---|---|---|
| `RES-70` | **El `LICENSE.md` de `kaplay@3001.0.19` no es MIT puro.** Es el texto MIT con un bloque agregado, encabezado *"In addition, the following restrictions apply"*, de tres puntos: **(1)** el software y sus modificaciones no pueden usarse para entrenar ni mejorar algoritmos de aprendizaje automático —IA, procesamiento de lenguaje natural, minería de datos—, y la condición alcanza a derivados y actualizaciones; **(2)** no puede incluirse en ningún conjunto de datos de entrenamiento; **(3)** quien viole eso queda sujeto a acción legal | https://raw.githubusercontent.com/kaplayjs/kaplay/3001.0.19/LICENSE.md | 2026-09-18 | **verificado**, por tres vías independientes: el tag en GitHub, el tarball en unpkg, y el archivo en disco tras instalarlo |
| `RES-70.1` | **El metadato del registro miente.** El `package.json` del mismo paquete declara `"license": "MIT"`. Cualquier auditoría automática de licencias —la que lee el campo y no el archivo— informa MIT y no ve nada | https://registry.npmjs.org/kaplay/3001.0.19 | 2026-09-18 | **verificado**, y confirmado en disco: `npm view kaplay@3001.0.19 license` devuelve `MIT` |
| `RES-70.2` | **Cuándo entró la cláusula.** El PR #580, *"Swap To MIT With No-AI Clause(s)"*, la agregó el 2025-01-07 (commit `3892b29`): borró el `LICENSE` plano y creó `LICENSE.md`. El tag `3001.0.19` se cortó el 2025-06-15 (commit `dda4c9d`) y en ese árbol **existe solo `LICENSE.md`** con la cláusula | https://github.com/kaplayjs/kaplay/commit/3892b29 | 2026-09-18 | **verificado** |
| `RES-70.3` | **🔑 Y después la sacaron — pero en la otra rama.** El 2025-05-11 (commit `1897cc1`) el proyecto revirtió a MIT plano, sin cláusula. Ese revert vive en `master` y en la línea `next` (`4000.0.0-alpha.27.1`), **no en la rama de mantenimiento 3001.x**, que se tagueó un mes más tarde arrastrando la versión restrictiva. O sea: la versión que instala cualquiera por ser `latest` quedó del lado viejo de un revert que ya había ocurrido | https://github.com/kaplayjs/kaplay/commits?path=LICENSE | 2026-09-18 | **verificado** |
| `RES-70.4` | No hay changelog, issue ni anuncio que explique por qué 3001.x nunca recibió el revert, ni por qué el `package.json` sigue declarando MIT | — | 2026-09-18 | **sin fuente** — se buscó y no apareció |
| `RES-70.5` | La familia de licencias "MIT Non-AI" —mismo patrón de cláusula— **no está en la lista SPDX ni aprobada por OSI**, porque una restricción de campo de uso es incompatible con la Open Source Definition | https://github.com/non-ai-licenses/non-ai-licenses · https://news.ycombinator.com/item?id=34778237 | 2026-09-18 | **interpretación**, rotulada como tal: es la lectura del rol, no un dictamen |

### Lo que esto refuta, escrito completo

`RES-62.4` (`INV-60`, 2026-09-11) afirmaba, textual: *"**Kaplay: MIT**, Copyright (c) 2025
KAPLAY Team"*, con estado **verificado** y con esta fuente:
`raw.githubusercontent.com/kaplayjs/kaplay/master/LICENSE`.

**Qué pasó:** esa URL apunta a `master`, y en `master` la afirmación es cierta — el revert de
`RES-70.3` ya había ocurrido cuando se consultó. La ficha leyó un archivo real y lo transcribió
bien. **Lo que no hizo fue leer el archivo de la versión que `ADR-08` iba a pinear.**

**Estado corregido:** `RES-62.4` queda **refutada para `3001.0.19`**. Sigue siendo cierta para
`master` y para la línea `4000.x-alpha`. La diferencia no es un detalle de archivo: es la
diferencia entre lo que se mira y lo que se instala.

**Y el error se propagó hacia arriba**, que es lo que lo hace caro: `ADR-08` abre diciendo
*"Kaplay `3001.0.19`, MIT, cero dependencias"* y repite "MIT (`RES-62.4`)" en su tabla de
finalistas. Las dos líneas heredan la refutación.

---

## RES-71 — El repuesto está limpio, y trae algo que nadie había mirado

| Ficha | Hallazgo | Fuente | Fecha | Estado |
|---|---|---|---|---|
| `RES-71` | **LittleJS sigue MIT sin adiciones**, confirmado en el `LICENSE` del **tarball publicado** de `littlejsengine@1.18.29` —no en la rama— y también en el repo | https://unpkg.com/littlejsengine@1.18.29/LICENSE | 2026-09-18 | **verificado** |
| `RES-71.1` | **Dato nuevo que `RES-62.7` no había mirado: LittleJS vendoriza Box2D**, bajo licencia **zlib** (Erin Catto, 2006-2013), declarada en un `COPYRIGHT.txt` dentro del propio paquete. zlib está aprobada por OSI y es permisiva, **sin restricción de campo de uso**: no dispara la condición 4 de `ADR-08.1`. Pero *"LittleJS: MIT"* a secas era incompleto | https://unpkg.com/littlejsengine@1.18.29/COPYRIGHT.txt | 2026-09-18 | **verificado** |
| `RES-72` | Phaser 3.90.0 y Excalibur 0.32.0 siguen MIT / BSD-2-Clause sin cláusulas agregadas, re-chequeado en sus tags exactos. melonJS igual que en `RES-62.11`. Ninguno cambió desde `INV-60` | — | 2026-09-18 | **verificado** |

### Medido en disco, sin número `RES-`: el repuesto engordó

`RES-62.7` fichó LittleJS en **~46 KB gzip**. Medido hoy sobre el tarball publicado de
`1.18.29` (`npm pack littlejsengine`, y `gzip -c` sobre cada build):

| Build | Bruto | Gzip |
|---|---|---|
| `littlejs.esm.min.js` | 249 KB | **62 KB** |
| `littlejs.min.js` | 185 KB | 52 KB |
| `littlejs.esm.js` (sin minificar) | 661 KB | 147 KB |
| `box2d.wasm.js` (aparte, opcional) | 293 KB | 36 KB |

**Consecuencia para `ADR-08`:** su tabla de finalistas justifica la elección diciendo que
LittleJS es *"19 KB más liviano"* y que *"el ahorro de 19 KB no paga el motor que habría que
escribir"*. Ese ahorro **hoy no existe**: contra los 66,8 KB gzip que Kaplay midió en el
bundle real de este sitio (`T-226`, condición 5), el módulo ESM de LittleJS está a 62 KB. Son
**menos de 5 KB de diferencia**. El argumento de `ADR-08` sobrevive —sigue sin pagar el motor
que habría que escribir a mano— pero **ya no se apoya en el peso**, y conviene que lo diga así
en vez de repetir un número que envejeció.

---

## Lo que queda sin resolver, y no se rellena

- **Si el uso concreto de este sitio cae dentro de la restricción textual.** El uso es:
  importar el paquete sin modificarlo, servirlo en un sitio estático de fans, sin lucro, sin
  entrenar ningún modelo y sin incluir el código en ningún conjunto de datos. La lectura
  literal del texto no alcanza a ese uso. **Pero eso es lectura, no hecho verificado**, y el
  rol que la hizo no da consejo legal. La decisión de si `RES-70` dispara o no la condición 4
  es de `arquitectura` y, por el tamaño que tiene, del usuario.
- **Por qué el mantenedor no corrigió el metadato `"MIT"` del registro** sabiendo que el
  `LICENSE.md` del mismo paquete dice otra cosa. No hay fuente pública.

---

## La regla de método que deja este archivo

> **Una licencia se lee en el tag de la versión que se va a instalar, nunca en `master`.**

`RES-62.4` fue verificada de buena fe, por un rol que hizo bien su trabajo, y estuvo mal
igual. Lo que falló fue el recorte de la pregunta: se preguntó *"¿qué licencia tiene
Kaplay?"* cuando lo que había que preguntar era *"¿qué licencia tiene el archivo que va a
quedar adentro de `node_modules/` cuando corra `npm i -E kaplay@3001.0.19`?"*.

Las dos preguntas tienen respuestas distintas y solo una importa. Vale para cualquier
paquete que este proyecto vuelva a fichar: **el tag, el tarball publicado, o el archivo en
disco después de instalar. La rama no.**

Y un corolario que este caso regala: **el campo `license` del `package.json` no es una
fuente.** Acá dice MIT y el archivo de al lado dice otra cosa. Si una ficha futura se apoya
en `npm view <paquete> license`, eso es un metadato declarado por quien publica, no un
hallazgo verificado — y hay que rotularlo así.
