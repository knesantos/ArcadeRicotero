# INV-24 — qué banca Vercel Hobby con ~180 MB de mp3 en el repo

> Ficha pedida por el hilo principal en
> `Docs/SUGERENCIAS/HILO-para-investigador-limites-de-vercel-para-audio.md`, tarea `T-98`
> del ciclo 7. Responde las seis preguntas de ese pedido, en su orden — el de lo que puede
> tumbar la vía primero.
>
> Consume: `RES-15` (`INV-06-vercel-costo-cero.md`), `D-22`, `D-23`.
> Afecta: `ADR-01`, `D-23`.
>
> **Escrita por `investigador` en `T-98`; pegada por el hilo principal**, porque el rol es
> de solo lectura y no puede escribir en su propia carpeta.
>
> **Lo que esta ficha NO decide:** `D-23` está tomada y sigue en pie — los 2,5 GB no entran
> al repo y el sitio sirve dos niveles de audio. Acá se decide **dónde viven los archivos**,
> nada más.

---

## RES-50 — nada documentado bloquea servir ~180 MB de audio propio desde Vercel Hobby, y lo único que podría hacerlo no está definido

Consultado el **2026-08-24**.

### 1. ¿Los términos de Hobby permiten servir audio? — la que puede tumbar todo

**No está en las Fair Use Guidelines** que ya fichó `RES-15`. Está en un documento distinto,
el **Acceptable Use Policy** (última actualización 21-abr-2026), sección 2, "Prohibited
Activities". Cita textual:

> "Scrape, proxy, act as a VPN, or **host media for hot-linking**"

URL: `vercel.com/legal/acceptable-use-policy` · Consultado: 2026-08-24 · **verificado —
documento legal oficial**. Está listada entre las conductas prohibidas en **todos los
planes**, no solo Hobby.

**Y acá está el agujero: Vercel no define "hot-linking" en ningún lugar del documento.**

Lectura razonable, **rotulada como interpretación de `investigador` y no como veredicto de
Vercel**: hot-linking es cuando *otro* sitio referencia tu archivo para servirlo en *su*
página, usando tu ancho de banda como si fueras su CDN. RicotaArcade sirve el mp3 adentro
de sus propias páginas, para su propia reproducción. Eso encaja con "un sitio que además
tiene audio", que es exactamente la distinción que el pedido marcó, y no con "usar la
plataforma como CDN de medios de terceros".

**No es un "sí" garantizado.** Es un "no hay nada documentado que lo prohíba, y la única
cláusula que podría apuntó a otra cosa".

### 2. ¿Cuál es el tope de un despliegue por git, no por CLI?

`docs.vercel.com/limits`, sección "Static file uploads". Cita:

> "When using the CLI to deploy, the maximum size of the source files that can be uploaded
> is limited to 100 MB for Hobby..."

El número está **explícitamente acotado a CLI**, igual que el tope de 15.000 archivos
(sección "Files"). **Ninguna página oficial** (`/docs/git`, `/docs/deployments`) da un
número equivalente para el despliegue automático desde GitHub, y tampoco lo dio personal de
Vercel en los foros revisados.

**No documentado.** Ojo con la diferencia, que importa: no se confirmó que no haya tope —
se confirmó que no hay tope publicado. Consultado: 2026-08-24 · **verificado**.

### 3. ¿Los estáticos de `public/` cuentan igual que la salida de build?

Misma página, sección "Files". Cita:

> "Although there is no upper limit for output files created during a build... If the build
> time exceeds 45 minutes then the build will fail."

Los estáticos de `public/` son **output**, no source. **No tienen techo de tamaño
documentado**; lo único que los acota indirectamente es el build de 45 minutos y el disco
de build de 32 GB en Hobby. Consultado: 2026-08-24 · **verificado — documentación oficial**.

### 4. ¿Cuánto tráfico incluye Hobby, y qué pasa al agotarlo con audio?

Confirma `RES-15` sin novedad: **100 GB de Fast Data Transfer por mes en Hobby**, y al
agotarlo el recurso se frena, no se factura.

**El audio no tiene cupo propio**: cuenta como cualquier byte servido, del mismo pool que
HTML, JS e imágenes. No hay categoría de "medios" separada en la documentación. Con 180 MB
totales y unos 40 temas de ~4 MB, hace falta un volumen de escuchas muy superior al que
maneja este sitio para acercarse al techo — el orden de magnitud ya está estimado en
`RES-15`. Consultado: 2026-08-24 · **verificado**.

### 5. Pasar de 1 GB en GitHub, ¿tiene consecuencia práctica?

La misma página que ya fichó el `1 GB / 5 GB` agrega el dato que faltaba. Cita:

> "When repositories become excessively large and strain infrastructure, you might receive
> an email from GitHub Support asking you to take corrective action."

**No hay bloqueo automático** a 1 GB ni a 5 GB: es un aviso humano cuando el repo se pone
"excesivamente" grande, sin cifra exacta.

**Y hay una contradicción que se deja anotada, no resuelta a ojo:** otra página oficial de
GitHub (`repository-limits`) da números distintos — **10 GB recomendados** para el `.git`
empaquetado y **2 GB** como tope duro de push — sin aclarar si mide lo mismo que la que
dice "less than 1 GB". Dos páginas oficiales, dos cifras. Para 180 MB estamos lejos de
cualquiera de las dos. Ambas URLs bajo `docs.github.com/en/repositories/` · Consultado:
2026-08-24 · **verificado**.

### 6. Si 1 o 2 salen mal: alternativas gratuitas para ~180 MB de mp3

Nombres y límites, **sin recomendación** — la vía la elige `arquitectura` en `ADR-01`.

| Vía | Límite | Estado de la fuente |
|---|---|---|
| **Cloudflare R2** | 10 GB de almacenamiento gratis/mes, egress $0 siempre | **No verificado en fuente primaria.** Sale de trackers de pricing de 2026, no de la doc de Cloudflare |
| **GitHub Releases** | Asset de hasta 2 GiB por archivo, separado del límite de tamaño del repo. URL directa reproducible, sin cuenta para el que escucha. Sin límite de ancho de banda documentado | **Verificado** — doc oficial "About releases" |
| **Internet Archive** | Sin límite de tamaño ni de tráfico; link directo de streaming, sin cuenta para el que escucha (solo la necesita el que sube) | **No verificado en fuente oficial.** Entra como práctica extendida y conocida (podcasters), rotulada como tal |

---

## Los seis veredictos, en una línea cada uno

1. **No hay bloqueo documentado** para servir audio propio. La única cláusula que podría
   aplicar apunta a hotlinking de terceros — pero Vercel no lo aclara, así que no es un sí
   garantizado.
2. **Sin número oficial** para el despliegue por git. El 100 MB que se conoce es
   explícitamente de CLI.
3. **Los estáticos de salida de build no tienen techo de tamaño documentado.**
4. **180 MB es insignificante** contra los 100 GB/mes de Hobby, y el audio no tiene cupo
   separado.
5. **Pasar 1 GB en GitHub no bloquea nada por sí solo**; a volúmenes mucho mayores puede
   llegar un mail de soporte. Hay dos cifras oficiales que no coinciden entre sí.
6. **Hay alternativas gratis viables** (R2, GitHub Releases, archive.org) si Vercel no
   sirve, y ninguna le pide cuenta al que escucha — que es lo que `D-14` no negocia.

## Sin resolver

- **La definición exacta de "hot-linking"** en el Acceptable Use Policy de Vercel. No está
  en el documento. Solo se cierra contactando a soporte de Vercel, o aceptando la lectura
  razonable de arriba con su rótulo.
- **El tope de tamaño de despliegue por Git.** Es ausencia de documentación, no ausencia de
  límite confirmada.
- **La contradicción entre las dos páginas oficiales de GitHub** sobre el techo del repo
  (1–5 GB contra 10 GB en disco).
- **Cloudflare R2** no se verificó contra la documentación primaria de Cloudflare.
