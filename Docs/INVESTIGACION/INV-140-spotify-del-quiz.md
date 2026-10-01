# INV-140 — IDs de pista de Spotify (estudio original) para el botón del quiz

> Pedido del hilo principal, 2026-10-01: el botón "Escuchalo en Spotify" del quiz
> (`src/data/quiz.json`) solo aparece si el ítem trae `spotify.trackId`, y ninguna de las
> 43 preguntas lo tenía. `ADR-01` opción B: el botón es un enlace a
> `https://open.spotify.com/track/<id>`.
>
> **Consume:** `ADR-01`, `INV-22` (catálogo en Spotify desde 2017 vía The Orchard, titular
> Erks S.A.), `RES-20` (Gulp!: 11 o 12 temas, según se cuente "Pianito - Jam").
> **Afecta:** `quiz.json`.
> **Fecha de consulta de todo lo de esta ficha: 2026-10-01.**
> **Escrita por `investigador`; pegada por el hilo principal** (el rol es de solo lectura).

## Cómo se verificó, y qué no se pudo

- `WebFetch` está bloqueado por la política de salida de red de este entorno en todos los
  hosts probados (open.spotify.com incluido). No se abrió ninguna página de pista ni de álbum.
- Evidencia usada: (a) la URL `open.spotify.com/track/<ID>` con su título de página y el
  artista en un resultado de búsqueda; (b) para el álbum, el resumen del buscador y páginas
  de terceros cuya URL lleva el mismo ID de Spotify (Tunebat, Chosic, Musicstax).
- No se puede confirmar que cada ID siga activo hoy: vienen del índice del buscador.

## Hallazgo general (supuesto, no verificado)

El catálogo parece estar **dos veces** en Spotify: dos álbumes de *Un baión para el ojo
idiota* (`3bSPbmYHqouqpTO2dw0EW5`, con tilde, y `5DjVlzc8sVHJqAU2Pdp35B`, sin tilde), dos
pistas no en vivo para "Ji ji ji" y dos para "Mi perro dinamita". Lo más probable es una
segunda entrega con los títulos corregidos; en ningún resultado se vio "Remasterizado".

## RES-140 — por tema

| Tema | Disco | trackId | Estado | Qué se vio |
|---|---|---|---|---|
| Ji ji ji | *Oktubre* (1986) | `1tW6LiJGXGlReuNP38wrKb` | **verificado** | "Ji Ji Ji - song and lyrics by Patricio Rey y sus Redonditos de Ricota"; Tunebat con el mismo ID: *Oktubre*, 1986, 5:35. Alternativa sin desambiguar: `5QdtKxsOZ5abspqB8Eplma` ("Jijiji") — no usar sin abrirla |
| Mi perro dinamita | *La mosca y la sopa* (1991) | — | **ambiguo** | Dos candidatos con título y artista correctos, ninguno con álbum visto: `6D7Ss3H1k1SZTVGx0GPcUB` y `2ySokxMhynpB3Vb8UWKvO0` |
| Criminal mambo | *Gulp!* (1985) | `44LkNJpEVO5PiX08RQaVCC` | **verificado** (estudio por inferencia) | "Criminal Mambo - música y letra de Patricio Rey y sus Redonditos de Ricota"; la versión de *En Directo* es otro ID (`6tv0UEpi5OZDIjV3t3Y04Q`, "En Vivo") |
| Todo un palo | *Un baión para el ojo idiota* (1988) | `0HQMAExgp4BiKGq6UM3u9X` | **verificado** | "Todo un Palo - song and lyrics by…"; Tunebat: *Un Baión para el Ojo Idiota*, 1988, 7:21. No usar `7DWlu0RSXcUxRXSm4xSBjS` ("En Vivo") |
| Luzbelito y las sirenas | *Luzbelito* (1996) | `2ybNy7okIb11z8czxvxoEg` | **verificado** (álbum no visto) | "Luzbelito y las Sirenas - song and lyrics by…"; el álbum (`6pd1SqXVhDwFIq6R7HL1rW`) figura con 11 temas, entre ellos este |
| La bestia pop | *Gulp!* (1985) | — | **solo terceros** | `5WeBnrDPyLhxruxVryHCkn` aparece en Tunebat, Chosic y Musicstax (*Gulp!*, pista 2, 4:07), pero ninguna URL de Spotify con ese ID en resultados. No usar `6MozpSKmmkhAsOvcpXdjcz` (en vivo, *Stud Free Pub 85*) |
| Pianito (pista oculta) | *Gulp!* (1985) | — | **no encontrado** | Ninguna búsqueda devolvió la pista. No probado que no exista |
| Capitán Buscapina | *Último bondi a Finisterre* (1998) | `2GvbPdseVUYzQHWlgxnxXm` | **verificado** | "Las Increibles Andanzas del Capitán Buscapina en Cybersiberia - song and lyrics by…"; el buscador lo da en "Ultimo Bondi a Finisterre", 1998 |

## Lo que cargó el hilo principal (2026-10-01)

Solo los cinco verificados, en las siete preguntas que hablan de esos temas:

| Pregunta | Tema | trackId |
|---|---|---|
| `QZ-011`, `QZ-015`, `QZ-042` | Ji ji ji | `1tW6LiJGXGlReuNP38wrKb` |
| `QZ-033` | Capitán Buscapina | `2GvbPdseVUYzQHWlgxnxXm` |
| `QZ-036` | Criminal mambo | `44LkNJpEVO5PiX08RQaVCC` |
| `QZ-038` | Todo un palo | `0HQMAExgp4BiKGq6UM3u9X` |
| `QZ-039` | Luzbelito y las sirenas | `2ybNy7okIb11z8czxvxoEg` |

`QZ-031` (Mi perro dinamita) y `QZ-043` (La bestia pop) quedan sin `spotify` hasta que
alguien abra los candidatos en un navegador: un ID equivocado manda al jugador a otro tema.
Sin ID el botón no aparece y la partida sigue entera (`src/scripts/spotify.ts`).

## Sin resolver

- Cuál de los dos IDs de "Mi perro dinamita" es el de *La mosca y la sopa*: un clic en cada uno.
- Si la URL de Spotify de "La bestia pop" existe con el ID de terceros.
- Si "Pianito" existe como pista en Spotify.
- Que los IDs sigan activos: si Spotify da de baja una de las dos entregas del catálogo, el
  daño es quedarse sin botón, no mandar a otro tema.
