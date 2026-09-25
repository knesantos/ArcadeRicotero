# De `arquitectura` para el hilo principal: lo que arrastra `T-291`

> 2026-09-24, ciclo 16, ráfaga 4. **No toco `src/`.** Los contratos enmendados están en
> `Docs/ARQ/ARQ-schema-recitales.md` (`CTR-19.5` paso 5, `CTR-19.13` t16 y t17, `CTR-19.14`,
> `CTR-19.15`, `CTR-19.16`), `Docs/ARQ/ARQ-schema-adivinar-por-la-letra.md` (`CTR-09.2`,
> `CTR-09.8`, `CTR-09.9`, `CTR-09.11`) y `Docs/ARQ/ARQ-schema-niveles.md` (`CTR-16.10.5`).
> En `Docs/ARQ/ARQ-schema-adivinar-tema.md` hay tres notas que no cambian el contrato: una en
> `CTR-03.11`, una en Consecuencias y otra en "Qué NO decide". Las dos últimas las sumé al
> volver sobre la verificación de `REV-15`. Cada enmienda dice qué decía antes.

## 1. `T-292` (ya está en el plan): `FIND-71` en código

Todo está en el recuadro *"Enmendado el 2026-09-24 por `T-291`"* de `CTR-19.5`. En corto:

- **El paso 5 de `repartirEnVivo()`**: el resto del pozo (lo que no quedó Fácil) pasa por
  `repartirEnTercios(resto, conteo)`. `dificil` queda Difícil, y `facil` o `media` quedan Media.
  De ese paso **no sale ningún Fácil**. La firma de `repartirEnVivo()`, `CorteEnVivo` y
  `catalogo()` no cambian.
- **t16 y t17** en `src/lib/en-vivo.test.ts` (`CTR-19.13`), con sus rojos: la regla vieja da
  8/6/1 en la sala de t16, y copiar los tercios tal cual da 10 Fáciles.
- **El rojo que se tiene que ver:** `src/lib/tema/catalogo.test.ts`, test *"CTR-19.5: con conteo
  aparecen los 8 Fáciles…"*. Espera `{ facil: 8, media: 12, dificil: 10 }` y con la regla nueva da
  `{ facil: 8, media: 8, dificil: 14 }`, contado a mano.
- **Comentarios que quedarían mintiendo:**
  - `en-vivo.ts`: la tabla del encabezado, la línea de los tercios, y el comentario de
    `repartirEnVivo()` y el de `repartirEnTercios()` (*"La usa solo…"*);
  - `src/scripts/partida-tema.ts:218`.
- **Lo que da hoy, para comparar una vez:** 8 / 56 / 31. Si t17 da otra cosa, manda t17 y avisame
  para corregir el recuadro.

## 2. Un `comment` del schema de `US-07` (sin tarea, sin apuro)

`src/data/_schema/por-la-letra.schema.json`, `item.desde.comment`. Dice *"(los que pasan
sirveComoVerso)"*, y no es lo que escribe el generador. El texto nuevo está en `CTR-09.8`, y
este documento manda sobre la copia. **No cambia la validación ni obliga a regenerar el banco**:
se copia la próxima vez que alguien toque ese archivo.

## 3. Propuesta: que el comando (3) de `CTR-09.11` sea un test

`FIND-75` pasó porque el comando (3) es un comando: nadie lo corre en `npm test`, y quedó viejo
desde que el generador empezó a filtrar con `CNT-11`. Ya lo reescribí para que importe las
funciones de `filtro.ts` en vez de copiarlas. Pero sigue siendo un comando.

Si entra como test en `src/lib/por-la-letra/banco.test.ts`, corre en cada build:

- rearmar cada ítem con `versosUtilizables()` → `elegirVentana()` → `ventanaValida()`, y comparar
  `desde` y los 8 versos;
- **en rojo**: una copia del banco con un verso tocado, o con `desde` corrido en uno, tiene que
  nombrar el ítem y decir `npm run generar-por-la-letra`;
- control en verde: el banco real, con lista vacía.

Hoy no lo pide ninguna tarea del plan, y no lo pido para esta ráfaga. Lo decide el orquestador
en el próximo ciclo. El costo es leer `cancionero.json` en un test, que `generar-por-la-letra`
ya lee entero en cada corrida.

## 4. Nada para `mundo.ts`

`FIND-72` era solo de contrato: `CTR-16.10.5` ahora dice los tres casos de "el empujón no
arranca" que el código ya hacía (5, 6 y 7). El 7, el camino reservado y dos cajas que piden el
mismo lugar, no lo nombraba `FIND-72`: lo sumé al leer el mismo código. Los tres tienen su prueba
en `mundo.test.ts`.

## Verificación

```bash
rg -c "T-291" Docs/ARQ/ARQ-schema-recitales.md Docs/ARQ/ARQ-schema-niveles.md Docs/ARQ/ARQ-schema-adivinar-por-la-letra.md Docs/ARQ/ARQ-schema-adivinar-tema.md
```

Se espera 13, 2, 10 y 3, en ese orden (contado con Grep al cerrar la segunda vuelta). En la
primera vuelta el reporte decía 12 para `ARQ-schema-recitales.md`, y estaba mal contado: eran
13. El 3 de `ARQ-schema-adivinar-tema.md` era 1 hasta que sumé las dos notas de Consecuencias
y "Qué NO decide". La línea de `T-291` en `ARQ-schema-completar-letra.md` no es mía: es una
referencia de otra tarea, y no entra en esta cuenta.
