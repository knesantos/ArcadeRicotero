# CNT → hilo principal — vuelta 2 de arreglos de `dos-ejes`: lo que hay que pegar, regenerar y decidir

- **De:** `contenido`, vuelta 2 del ciclo 18 sobre `CNT-30` (2026-10-04).
- **Para:** hilo principal (dueño de `src/lib/sitio/copy.ts`, `src/lib/dos-ejes/banco.test.ts`,
  `Docs/DECISIONES.md` y del taller de tarjetas).
- **Por qué está acá y no hecho:** ninguno de esos archivos es de `contenido`. El banco
  (`src/data/dos-ejes.json`) y `CNT-30` sí, y ya están cambiados. Lo de la vuelta 1 que sigue
  pendiente está resumido en el punto 1.

## 1. Un texto de `copy.ts`

| Dónde | Hoy | Pasa a | Por qué |
|---|---|---|---|
| `src/lib/sitio/copy.ts` línea 129, `LUGARES.dosEjes` | `'Nadie te pide nada en la puerta.'` | `'Se entra con las manos vacías.'` | La lectura de la vuelta 2: el aviso del molinete ya se dice con *nada/nadie* en el subtítulo, el casete y la vista previa (el renglón era la cuarta vez), y *la puerta* de un recital es donde se pide la entrada: se lee como un chiste sobre colarse. 6 palabras, entra en el techo de 8 de `voz.test.ts`. Alternativa si suena a pobreza: `Pasá, nadie te pide nada` (5 palabras). Si el renglón ya no vive en la página, no hace falta nada |

Los demás cambios de copy de la vuelta 1 (`POLOS.oscuridad`, `PANTALLA_0.subtitulo`,
`CONTRASTE`) ya están pegados. **La vuelta 2 no toca ninguna cadena de
`src/lib/dos-ejes/copy.ts`.**

## 2. Regenerar las tarjetas

`huellaDelTaller()` entra con las **bajadas** de los cuatro cuadrantes, y la vuelta 2 cambió las
cuatro (costos con un molde nuevo, y placeres nuevos en `CU-3` y `CU-4`). `tarjetas.test.ts`
("el manifiesto está al día…") va a fallar hasta que corra:

```
npm run generar-dos-ejes
node --test src/lib/dos-ejes/tarjetas.test.ts
```

Las bajadas nuevas miden entre 136 y 169 caracteres (la más larga de antes medía 167) y la
tarjeta tiene un tope de cinco renglones: deberían ocupar cuatro. `«por ahí»` lleva guillemets: la sans
de la tarjeta (DejaVu) los tiene. Si el taller falla por una bajada, la reescribo; no la achiques
a mano.

Después, en este orden:

```
node --test src/lib/dos-ejes/banco.test.ts
node --test src/lib/voz.test.ts
node --test src/lib/esquemas.test.ts
node --test src/lib/pisos.test.ts
node --test src/lib/dos-ejes/partida.test.ts
```

## 3. `banco.test.ts`: dos huecos que la lectura encontró (no rompe nada sumarlos)

Hoy el test de firma de un polo («ninguna palabra es la firma de un polo») descarta las palabras
de dos letras y las que están en `vacias`, y con eso no ve dos firmas de forma que el banco de la
vuelta 1 tenía de verdad: **`por`** en cinco de quince opciones de orden y en ninguna de caos, y
**`Me` + verbo** en cuatro de caos y en ninguna de orden (y otras cuatro de oscuridad contra
ninguna de luz). Es el mismo delator por la forma que el «Ya sé… / Tengo…» del banco viejo.

- **Qué sumar:** que la prueba cuente también `por` (sacarlo de `vacias`) y `me` / `mi` (bajar el
  mínimo de largo a 2 solo para esas dos palabras).
- **Estado del banco de la vuelta 2:** `por` en una opción de orden y en ninguna de caos; `me`
  en dos de caos, dos de oscuridad y ninguna de orden ni de luz; `mi` en dos de luz y una de
  oscuridad. Con el test ampliado, hoy pasa (nadie llega a tres con cero enfrente).
- **El veto de `vino`** (grupo «alcohol, drogas, policía») lee el pasado de *venir*: *Hablo con
  quien vino conmigo* cae ahí. No es un problema del banco (se resolvió con otra palabra); si se
  prefiere acotar el veto a *vino* con `el`/`un`/`de` delante, queda dicho. Lo mismo con `salt*`
  y *Salto de una a otra*: ahí el veto es correcto (el cuerpo), y se deja.

## 4. El sello `Adentro` y el veto 3 de `BR-36` por el sentido

Esto no lo resuelve ningún texto de `contenido`: el sello `Adentro`, la línea que canta del
momento (*Bombo en el pecho, primer acorde.*) y las seis escenas de ese momento dan por hecho
que quien juega entró, y `BR-36` veto 3 dice que «una escena de adentro que se da por la normal
los deja afuera otra vez» (`RES-154`). Las seis escenas se oyen igual desde la vereda (la vuelta
2 sacó «Abren tarde» y el dato técnico de los instrumentos), pero el sello las llama *Adentro*.

Dos salidas, las dos del lado de `D-57` punto 1:

1. **Enmendar `D-57`:** renombrar el **sello** a *Cuando suena* (12 caracteres, 2 palabras: entra
   en el techo de 24 y 3). El `id` sigue siendo `adentro` (lo ata el schema). Costo: la tapa de
   la portada lista los cinco sellos en una etiqueta (`Las hojas de la noche`), así que
   `experiencia` tendría que mirar cómo queda ahí.
2. **Dejarlo y escribirlo:** una línea en `D-57` que diga que *adentro* también es la vereda
   del que no entró. No cambia ningún texto.

Mientras no se decida, no hay nada roto: el banco no depende de cuál sea.

## 5. Dos recordatorios que ya estaban

- Los comentarios de `src/lib/sitio/copy.ts` (`LUGARES`) siguen diciendo «el noveno» y «los
  ocho» (ya lo anoté en `CNT-26` §6).
- El posteo 5 del hilo de Twitter describe el rombo y los nombres viejos (`D-57`,
  Consecuencias).
