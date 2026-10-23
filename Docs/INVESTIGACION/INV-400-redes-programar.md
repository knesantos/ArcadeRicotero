# INV-400 — Cómo programar Instagram y X gratis, para las redes del sitio

> Fichas `RES-400` … `RES-408`, para `D-81`. Las trajo `investigador` el 2026-10-23 y las
> pegó el hilo principal. **Se escribieron como `RES-380` … `RES-389`** y se renumeraron
> antes de commitear: `RES-381` … `RES-386` ya eran los lugares míticos de `INV-361`.
> `RES-409` queda libre. Son datos de terceros: **vencen rápido**, volver a mirar antes de
> confiar en uno que tenga más de unos meses.

## RES-400 — Metricool: una marca gratis, sin X

Plan gratis: 1 marca, hasta 20 publicaciones programadas por mes, Instagram sí, **X no**.
Una segunda marca pide Starter, desde 16 EUR por mes (hasta 5 marcas). La página no aclara si
el precio es mensual o anual.
https://metricool.com/pricing/ — consultada 2026-10-23 — verificado.
(El usuario ya tenía Metricool con una marca de otro proyecto y lo descartó: no le gustó.)

## RES-401 — Metricool e Instagram: cuenta profesional

No admite cuentas personales: hace falta profesional (empresa o creador). Se conecta por
Facebook (con página) o solo con el login de Instagram.
https://help.metricool.com/how-to-connect-instagram-to-metricool-sermi — 2026-10-23 —
verificado según el resumen de la ayuda.

## RES-402 — Buffer gratis: 3 canales, 10 en cola por canal

Plan Free: hasta 3 canales, 10 posteos programados por canal; el lugar se libera al
publicarse. La página oficial lista X e Instagram sin restringirlos a pago; una reseña de
terceros dice que X podría estar limitado. Pago: 5 USD por mes por canal (Essentials).
https://buffer.com/pricing y https://napoleoncat.com/blog/buffer-pricing/ — 2026-10-23 —
verificado para Instagram; **X sin confirmar: se ve al conectarlo.**

## RES-403 — El programador propio de Instagram y Meta Business Suite

Gratis: programan posteos, reels y carruseles. Piden cuenta profesional; Business Suite pide
además página de Facebook. La ventana de anticipación no está clara (30 o 75 días según la
fuente). Fuentes secundarias:
https://pctechmag.com/2026/05/how-to-schedule-posts-on-instagram-2026-the-complete-guide-for-creators-brands-agencies/
— 2026-10-23 — **no verificado** (no se pudo abrir la ayuda oficial de Meta).

## RES-404 — El programador propio de X es de Premium

Según guías de 2026, el botón de programar del compositor de X es de X Premium.
https://socialk.it/en/how-to/how-to-schedule-x-twitter-posts-free — 2026-10-23 —
**no verificado** (blogs de vendedores de programadores; no se miró la ayuda de X).

## RES-405 — La API de X cobra por posteo

No hay plan gratis documentado: pago por uso con créditos prepagos. Crear un posteo cuesta
0,015 USD; **un posteo con enlace, 0,20 USD**. Se puede poner tope de gasto.
https://docs.x.com/x-api/getting-started/pricing — 2026-10-23 — verificado.

## RES-406 — La API de Instagram por Facebook: página y sin reloj

Publicar por la Graph API con login de Facebook pide cuenta profesional conectada a una
página. Solo JPEG en una URL pública. Carruseles de hasta 20. 100 publicaciones por día.
**No programa**: un contenedor que no se publica en 24 horas vence, así que alguien tiene
que tener el reloj.
https://developers.facebook.com/docs/instagram-platform/content-publishing/ — 2026-10-23 —
verificado.

## RES-407 — Buffer tiene API, y el plan gratis la usa

GraphQL en `https://api.buffer.com`, con clave personal (`Authorization: Bearer`), generada
en https://publish.buffer.com/settings/api. El plan Free tiene 1 clave; límites: 100
pedidos cada 15 minutos, 250 por día, 3.000 por mes. `createPost` con
`schedulingType: automatic`, `mode: customScheduled`, `dueAt` en ISO UTC, imagen por URL
pública en `assets`, `altText` en su `metadata`, e Instagram con
`metadata: { instagram: { type: post, shouldShareToFeed: true } }`.
https://developers.buffer.com/guides/getting-started.html,
https://developers.buffer.com/guides/api-limits.md,
https://developers.buffer.com/examples/create-scheduled-post.html,
https://developers.buffer.com/examples/create-image-post.html — 2026-10-23 — verificado
(los ejemplos los leyó el hilo principal). Que acepte la imagen de X por URL **se confirma
con el primer posteo**.

## RES-408 — La API de Instagram con login de Instagram no pide página

Pide cuenta profesional y no menciona página de Facebook (sí la piden las otras dos vías).
Mismos límites que `RES-406`, y tampoco programa. No aclara si publicar en la cuenta propia
pide revisión de la app.
https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/content-publishing
— 2026-10-23 — verificado (lo de la página, por omisión).
