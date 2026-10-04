# CNT → hilo principal — vuelta 3 de arreglos de `dos-ejes`: lo que hay que regenerar, pegar y sumar a las guardas

- **De:** `contenido`, vuelta 3 del ciclo 18 sobre `CNT-30` (2026-10-04).
- **Para:** hilo principal (dueño de `src/lib/sitio/copy.ts`, `src/lib/dos-ejes/copy.ts`,
  `src/lib/dos-ejes/banco.test.ts` y del taller de tarjetas). El punto 4 es para `experiencia`,
  que pasa por el hilo principal.
- **Por qué está acá y no hecho:** ninguno de esos archivos es de `contenido`. El banco
  (`src/data/dos-ejes.json`) y `CNT-30` sí, y ya están cambiados.

## 1. Regenerar las tarjetas (obligatorio: el build queda rojo hasta hacerlo)

`huellaDelTaller()` entra con las **bajadas** de los cuatro cuadrantes, y la vuelta 3 cambió las
cuatro (los costos pasan a "Pero cuando alguien…, a vos te toca…", y los placeres de `CU-2`,
`CU-3` y `CU-4` son otros). `tarjetas.test.ts` ("el manifiesto está al día…") va a fallar hasta
que corra:

```
npm run generar-dos-ejes
node --test src/lib/dos-ejes/tarjetas.test.ts
```

Las bajadas nuevas miden entre 124 y 160 caracteres (la más larga de antes medía 169) y la
tarjeta tiene un tope de cinco renglones: deberían ocupar cuatro. Ninguna lleva `«»`; `CU-2` lleva
`—`, que ya estaba. Si el taller falla por una bajada, me la devuelven y la reescribo; no la
achiquen a mano.

Después, en este orden:

```
node --test src/lib/dos-ejes/banco.test.ts
node --test src/lib/voz.test.ts
node --test src/lib/esquemas.test.ts
node --test src/lib/pisos.test.ts
node --test src/lib/dos-ejes/partida.test.ts
```

## 2. Dos textos de `copy.ts`

| Dónde | Hoy | Pasa a | Por qué |
|---|---|---|---|
| `src/lib/dos-ejes/copy.ts`, `RESULTADO.lasCuatroCanta` | `'Cuatro puertas a la misma noche.'` | `'Cuatro puntas de la misma hoja.'` | La puerta de un recital es donde se pide la entrada: contradice el argumento de `CNT-30` §6.2 (y por eso ya se había sacado del renglón del lugar). *Esquinas* apuntaría a «Ronda en cualquier esquina». Las cuatro puntas de una hoja son iguales y salen del libro (*Las hojas de la noche*). 6 palabras, entra en el techo de 8 de `voz.test.ts` |
| `src/lib/sitio/copy.ts`, `LUGARES.dosEjes` | `'Se entra con las manos vacías.'` | `'Entrá con la campera puesta.'` | *Manos vacías* es en castellano llegar sin regalo o volver fracasado, no entrar sin pagar. *Campera puesta* es la imagen de la previa (`canta` de `previa`), no habla de plata ni de puerta y no repite *nada/nadie*. 5 palabras, imperativo voseado. Si el renglón ya no vive en la página, no hace falta nada |

`sinNoche` (`PANTALLA_0.sinNoche`) queda **tal como está**: la confirmo (`CNT-30` §6.2). La fila
`marca` del §6.2 se corrigió en el documento: `copy.ts` tiene `Arcade Ricotero` en un renglón y
el título debajo (`UX-36` §5.1), que es lo que vale.

## 3. `banco.test.ts`: tres huecos que la lectura encontró (ninguno rompe nada sumarlo)

1. **La firma de un polo cuenta palabras exactas, no raíces.** Con eso no vio que en el banco de
   la vuelta 2 doce de quince opciones de caos llevaban subordinada (siete en subjuntivo: *caiga,
   salga, pase, llegue, avise, pinte, haga*) contra una de orden, ni que *sal-* (*salir, salgo,
   sale, salga*) estaba en cuatro de caos y en ninguna de orden. **Qué sumar:** comparar por raíz
   (los primeros cinco o seis caracteres de la forma sin tildes, con cuidado con las palabras
   cortas) y el mismo umbral de tres con cero enfrente.
2. **`que` y `cuando` están en `vacias`**, y por eso la forma subordinada no se cuenta. **Qué
   sumar:** sacarlos de `vacias`. Estado del banco de la vuelta 3: *cuando* aparece en una sola
   opción (`EJ-040`, caos); *que* aparece en `luz-oscuridad` dos veces en luz (`EJ-037`, `047`) y
   una en oscuridad (`EJ-035`), y en `orden-caos` una en orden (`EJ-034`) y una en caos
   (`EJ-057`). Con el test ampliado, **nadie llega a tres con cero enfrente**; lo conté a mano y
   no lo puedo asegurar sin correrlo.
3. **La guarda de «ninguna opción apunta al nombre de una manera» mira solo los nombres.** No
   vio que *Saco la cuenta* repetía *rehacer la cuenta* (`CU-3`), *con las manos* repetía *manos
   libres* (`CU-4`), *una charla* repetía `CU-2` y *lo primero que sale* repetía *te sale* (`CU-4`).
   **Qué sumar:** que también compare las palabras de más de tres letras de las **bajadas**,
   **dejando pasar `pero`, `cuando` y `alguien`** (están en las cuatro por la forma común, "Pero
   cuando alguien…", y no apuntan a ninguna). Estado del banco de la vuelta 3: pasa, salvo
   `alguien` en `EJ-041` y `EJ-054` y `cuando` en `EJ-040`, que son esas excepciones.

Un cuarto, que ninguna máquina puede ver y queda para `REV-19`: que haya **a lo sumo una luz con
alguien presente por celda** (cuatro en todo el banco, la vuelta ninguna). Está en `CNT-30` §2.

## 4. Para `experiencia` (`UX-36`)

La línea que canta de la grilla de las cuatro maneras (`UX-36`, la fila `La que canta`, hoy
`"Cuatro puertas a la misma noche." (CNT-30)`) pasa a **`"Cuatro puntas de la misma hoja."`**. No
cambia ningún otro texto de la pantalla; el sello del cuarto momento ya dice *Cuando suena*.

## 5. Dos recordatorios que ya estaban

- Los comentarios de `src/lib/sitio/copy.ts` (`LUGARES`) siguen diciendo «el noveno» y «los
  ocho» (ya lo anoté en `CNT-26` §6).
- El posteo 5 del hilo de Twitter describe el rombo y los nombres viejos (`D-57`,
  Consecuencias).
