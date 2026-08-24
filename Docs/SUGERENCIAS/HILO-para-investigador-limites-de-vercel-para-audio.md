# Propuesta del hilo principal para `investigador`: los límites reales de servir audio

> Escrita el 2026-08-23, al tomar `D-23`. **Es un pedido acotado**, no una investigación
> abierta: hay una decisión tomada que depende de una sola respuesta, y `D-22` ya la había
> dejado anotada como "lo único de esta decisión que conviene chequear antes y no después".
>
> Numeración propuesta: **`RES-50`**. `RES-49` ya está pedida para fichar cifraclub, en
> `HILO-para-investigador-fichar-cifraclub.md`.

## Qué hay que decidir con esta ficha

`D-23` fijó que el sitio sirva su propio audio en dos niveles: **12,5 MB de fragmentos**
(los 104 temas, `CTR-01`) y **unos 160 MB de temas enteros** (~40 temas a 128 kbps).
Total del orden de **180 MB**.

La pregunta que decide todo: **¿esos 180 MB pueden vivir adentro del repo, con Vercel
construyendo desde GitHub, en el plan gratuito?** Si la respuesta es no, el audio se va a
un tercero y cambia el trabajo, no la decisión.

Con los 2,5 GB originales no hacía falta preguntar. Con 180 MB sí, y estamos justo en la
zona donde el número importa.

## Lo que ya está verificado — no lo repitas

Verificado por el hilo principal el 2026-08-23, con fuente:

| Hecho | Fuente |
|---|---|
| GitHub **bloquea** archivos de más de 100 MiB; avisa desde 50 MiB | `docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github` |
| GitHub **recomienda** repos < 1 GB y "fuertemente" < 5 GB | `docs.github.com/en/repositories/creating-and-managing-repositories/repository-limits` |
| Vercel: máximo **100 MB de fuente en Hobby** (1 GB en Pro) y 15.000 archivos — **documentado para el despliegue por CLI** | `vercel.com/docs/limits` |
| Git LFS pasó a facturación medida; sin medio de pago, al agotar el cupo se **deshabilita** hasta el mes siguiente | `docs.github.com/billing/.../about-billing-for-git-large-file-storage` |
| En Vercel Hobby **nunca hay cargo**: al agotar un cupo el recurso se frena, no se factura | `RES-15` |

## Las seis preguntas

Ordenadas por lo que puede tumbar la vía primero.

1. **¿Los términos de Hobby permiten servir audio?** Hay una cláusula de uso razonable que
   apunta a no usar la plataforma como almacenamiento o distribución de medios. **Esta es
   la que puede tumbar todo, así que va con cita textual y fecha de consulta**, no
   parafraseada. Ojo con la distinción: *usar la plataforma como CDN de medios* no es lo
   mismo que *un sitio que además tiene audio*.
2. **¿Cuál es el tope de un despliegue por git, no por CLI?** El número que se conoce
   —100 MB de fuente en Hobby— está documentado para el despliegue por comando. Este
   proyecto despliega desde GitHub. ¿Hay tope por esa vía, y cuál: tamaño total del repo,
   tamaño de la salida de build, cantidad de archivos?
3. **¿Los archivos estáticos de `public/` cuentan igual que la salida de build?** Vercel
   documenta que servir estáticos no es un build y no cae bajo los límites de las
   funciones. Falta saber si tampoco cae bajo el límite de tamaño del despliegue.
4. **¿Cuánto tráfico incluye Hobby por mes y qué pasa al agotarlo con audio?** `RES-15` ya
   dijo que se frena y no se cobra. Lo que falta es el número y si el audio consume del
   mismo cupo. Referencia útil para dimensionar: un tema entero son ~4 MB.
5. **Pasar de 1 GB en GitHub, ¿tiene consecuencia práctica o es solo una recomendación?**
   O sea: ¿hay algún punto donde GitHub deja de funcionar, o solo se pone lento? Para
   `D-23` no es urgente (180 MB están lejos), pero fija el techo de crecimiento.
6. **Si 1 o 2 salen mal: ¿qué alternativa gratuita sirve para ~180 MB de mp3**, con enlace
   directo reproducible desde el navegador y sin cuenta para el que escucha? Nombres y
   límites, no recomendación — la vía la elige `arquitectura` en `ADR-01`.

## Ojo con esto

**No hace falta que la respuesta sea buena para que la decisión siga en pie.** `D-23` está
tomada: los 2,5 GB no entran al repo y el sitio sirve dos niveles de audio. Lo único que
esta ficha decide es **dónde viven los archivos**. Si Vercel no los quiere, van a otro
lado y `arquitectura` lo resuelve en `ADR-01`.

Y lo de siempre: si algo de esto no tiene fuente publicada y solo circula como
experiencia de gente en foros, **entra rotulado como tal** (`D-14`). Una respuesta que
diga "no está documentado, lo que se ve en la práctica es X" es una respuesta útil; una
que invente un número es la que rompe la decisión.
