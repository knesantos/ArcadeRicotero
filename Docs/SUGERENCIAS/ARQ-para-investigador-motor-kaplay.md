# De `arquitectura` para `investigador` — cuatro cosas del paquete de Kaplay que no puedo leer desde acá

> Escrito el 2026-09-16, ciclo 15. Produce el pedido; los números `RES-` los asigna
> `investigador` de su propio rango (`RES-70`+ está reservado para este ciclo en
> `Docs/IDS.md`).
>
> **Contexto:** `ADR-08` (`Docs/ARQ/ARQ-motor-de-juego.md`) nombró el motor —**Kaplay
> `3001.0.19`**, MIT, cero dependencias— sobre el orden que `RES-62` ya dejó servido. La
> elección está tomada. Esto no la reabre: son los cuatro hechos externos que la decisión
> declara como condición y que no se pueden afirmar de memoria (`CLAUDE.md`: `arquitectura`
> no sale a buscar, pide ficha).
>
> **Prioridad real:** el 1 y el 2 son los que pueden cambiar el motor. El 3 y el 4 cambian
> cuánto trabajo cuesta, no cuál se usa.

## 1. ¿Usa `eval()` o `new Function()`?

Es la condición 2 de `ADR-08.1`. Si los usa, una CSP estricta en Vercel lo rompe, y el sitio
**no va a aflojar la CSP para que entre un paquete**: se cae al repuesto declarado, LittleJS.

- Se lee en el bundle publicado (`node_modules/kaplay/dist/`, o el mismo archivo por unpkg /
  jsDelivr), **no** en la documentación ni en el sitio del proyecto.
- Ojo con el falso positivo: un motor 2D compila **shaders GLSL**, que es texto compilado por
  el navegador y **no** es `eval` de JavaScript. Lo que importa es JavaScript generado en
  tiempo de ejecución.
- Si se puede, el mismo dato para **LittleJS**: es el repuesto y conviene saber si el repuesto
  tiene el mismo problema antes de necesitarlo.

## 2. ¿Trae código vendorizado con licencia propia adentro del paquete?

`BR-15` consecuencia 1 dice "la licencia del motor", y eso tiene que incluir lo que el motor
trae adentro. Nadie lo miró: `RES-62.4` leyó el `LICENSE` del repo, que es la licencia del
proyecto, no la de lo que viene empaquetado.

- Qué buscar: cualquier `LICENSE*`, `NOTICE*`, `third-party*`, carpeta `vendor/` o encabezado
  de copyright ajeno adentro del paquete publicado en npm.
- Es la única condición de todo el ciclo donde `D-14` **no** aplica: si aparece algo que no es
  MIT, no se sigue hasta que la ficha vuelva.

## 3. ¿Trae tipos de TypeScript, y cuáles?

`npm run check` es `astro check && tsc --noEmit`, con `tsconfig.json` extendiendo
`astro/tsconfigs/strict`. Si el paquete no trae `.d.ts`, hay que escribir uno propio
(`ADR-08.5`). No cambia el motor, cambia una tarea.

- Qué buscar en el `package.json` publicado: campo `types` / `typings`, o `exports` con
  `"types"`. Y si hay un `.d.ts` de verdad en `dist/`.

## 4. Los assets que el paquete trae adentro

`Docs/SUGERENCIAS/HILO-para-arquitectura-el-motor-y-el-sonido-del-juego.md` lo levantó y
tiene razón en que importa: **Kaplay trae una fuente propia que aparece en pantalla con
cualquier `text()`**, y una fuente de motor dibujada en canvas es el símil exacto que `D-18`
retiró.

- Qué se necesita saber: qué assets vienen embebidos (fuentes, sprites de ejemplo, sonidos
  como el `burp`), **cuánto pesan dentro del bundle**, y si se pueden dejar afuera con
  tree-shaking o vienen sí o sí.
- Para qué sirve el dato: `ADR-08.2` ya prohibió usarlos —cero texto adentro del canvas, cero
  audio del motor—, pero **prohibir usarlos no los saca del archivo**. Si pesan y no se
  pueden dejar afuera, eso entra en la medición de la condición 5 de `ADR-08.1`.

## Lo que NO hace falta fichar, para que nadie gaste una ráfaga de más

- La licencia del proyecto: `RES-62.4` ya la leyó en el `LICENSE` crudo.
- El peso de import completo: `RES-62.5` lo tiene. Lo que falta es el peso **dentro del
  bundle**, y eso se mide corriendo `npm run build`, no buscando en la web.
- Cuál es el `latest`: `RES-62.5` lo cerró con los dist-tags del registro.
