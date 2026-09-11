# Del hilo principal para `arquitectura` — el motor, el sonido que se acaba de autorizar, y cuatro candados que un canvas no tiene

> Escrito el 2026-09-11, sobre el relevamiento de `Docs/INVESTIGACION/INV-60-skayboy-poligirl.md`
> (`RES-60`..`RES-65`). La idea es `IDEA-14` en `Docs/PRODUCTO/PRD-backlog-ideas.md`, **sin
> promover** (`BR-16`), así que esto no traza `T-XX`. Es el traspaso de lo que quedó con tu
> nombre.
>
> **Se escribió con el sonido prohibido y el usuario lo autorizó horas después**
> (`D-39`, y `D-38` para los personajes). La sección 2 está corregida adentro; el resto vale
> igual. El juego se juega **de a dos en un teléfono en horizontal** y el par elemental es
> **cielo / infierno**, las dos cosas decididas el mismo día.

## 1. La licencia del motor ya no es el bloqueo, y conviene saber qué sí lo es

`BR-15` consecuencia 1 mandaba chequear la licencia **antes**. Está hecho: `RES-62` trae
ocho licencias leídas en el archivo `LICENSE` crudo, y las de riesgo alto releídas por una
segunda vía independiente.

El orden que dejó el relevamiento, filtrado por lo que este sitio puede usar:

| | Motor | Licencia | Peso gzip | Por qué |
|---|---|---|---|---|
| 1 | **Kaplay** 3001.0.19 | MIT | ~65 KB | Cero dependencias; el modelo por componentes (`area`, `body`, `solid`) mapea casi literal a "dos personajes + plataformas + zonas que matan + puerta cooperativa" |
| 2 | **LittleJS** | MIT | ~46 KB | El más liviano; trae ejemplo *Platformer* armado; API más manual |
| 3 | **Phaser pineado a 3.90.0** | MIT | ~347 KB | El más pesado y el de comunidad más grande. La v4 tiene cinco meses y renderer WebGL reescrito: razón para no tomar el `latest` |

Afuera, con motivo: PlayCanvas por peso (~600 KB, motor 3D), melonJS por peso y porque cinco
fuentes dan cinco versiones distintas, Excalibur por física de cuerpo rígido innecesaria y un
bug táctil histórico, y **Matter.js / Planck.js por no ser motores** — son solo física, sin
renderer ni input, y adoptarlos obliga a escribir el resto a mano, que es lo que `BR-15` dice
que no se hace. Ninguno de los dos falla por licencia: las dos son MIT limpias.

Editor de niveles: **LDtk, MIT de punta a punta**, y su JSON se versiona igual que el resto de
los datos. Ojo con la razón, que cambió: **Tiled ya no está en la lista negra.** `RES-63.8`
cerró que un mapa TMX/JSON **no** hereda la GPL del editor, con la página oficial del formato
(CC-BY-SA), el foro oficial y la FAQ de la FSF. Si te conviene Tiled por otra cosa, podés.

**Lo que sí sigue abierto, y es tuyo:**

- Ninguno de los tres se probó **dentro de una isla de Astro con salida estática**. Los
  números de peso son de import completo, sin tree-shaking.
- **`eval()` / `new Function()` contra una CSP estricta en Vercel.** Nadie lo miró.
- `npm run check` es `astro check && tsc --noEmit`: un paquete sin tipos obliga a un `.d.ts`
  propio o a aflojar el `tsconfig`, y aflojarlo toca los 45 archivos de test.
- **Código vendorizado adentro del paquete del motor**, con licencia propia. `BR-15` dice "la
  licencia del motor" y eso debería incluir lo que trae adentro. No se miró.
- **Los assets que el motor trae por defecto.** Kaplay trae una fuente propia que aparece en
  pantalla con cualquier `text()`. Una fuente de motor dibujada en canvas es el símil exacto
  que `D-18` retiró y el "slop" que `diseno-marca.md` veta.
- Dato del repo que pesa: `package.json` declara **una sola dependencia de producción,
  `astro`**, y hoy no hay ni un paquete de npm del lado del cliente. El motor sería el primero.

## 2. El juego suena entero: eso ya se decidió, y te deja tres condiciones

> ✅ **CONTESTADA el mismo día, `D-39`.** Esta sección se escribió con el sonido prohibido
> por `D-37` punto 4 (*"Una pantalla de juego no pone temas. Ninguna, sin excepción"*). El
> usuario abrió la excepción para este juego. **No la discutas de nuevo: implementala.**

Las tres condiciones de `D-39`, que salen del fundamento de `D-37` y no se negocian por
separado:

1. **Se transmite, no se decodifica, y no se precarga nunca** (`D-37` punto 7). Esa parte no
   se tocó: es la que evita que el navegador mate la pestaña.
2. **La ruta entra al censo igual que todas.** La excepción se escribe **ahí**, a la vista de
   `rutas-sonoras.ts`, nunca como un caso especial escondido en la isla del juego.
3. **El tema no se nombra en pantalla durante la partida si eso sopla algo de otro juego** —
   la misma cautela que `UX-26` ya resolvió para la rocola.

Y la deuda que `D-39` deja anotada con nombre, porque es tuya el día que llegue el noveno
juego: **`dos-ejes` pidió esta misma excepción con este mismo argumento** —"no tiene
respuesta correcta, no hay nada que soplar"— y `D-37` se la negó por escrito, en su propia
tabla. Hoy hay dos pantallas con el mismo fundamento y distinta respuesta. O el criterio se
vuelve a escribir para que diga qué las separa, o vuelve la discusión caso por caso.

**Y hay un hueco que no cubre ninguna decisión del repo: los efectos de sonido.** Salto,
muerte, moneda, puerta. Un efecto no es un tema, no es la cama y no es un fragmento de
`CTR-01.3`. No hay una sola línea que diga si puede sonar, de dónde sale, si se decodifica
—`D-37` punto 7 prohíbe `decodeAudioData` sobre un tema entero y no dice nada de un sample de
200 ms— ni quién lo produce. Cero de nueve frentes lo cubrían. **Es tuyo.**

Nota operativa: una ruta nueva **nace muda sola**, porque `modoEnRuta()` devuelve `cama` por
defecto. Pero hay que declararla en `PAGINAS_DECLARADAS` de `rutas-sonoras.ts` o el censo
rompe el build. Y de paso: el comentario de `rutas-sonoras.test.ts` dice "las ocho pantallas
donde se juega" y su propio array tiene **siete**.

## 3. Cuatro candados del repo que un `<canvas>` atraviesa sin que nadie se entere

Ninguno rompe el build hoy si alguien no los extiende. Es el hueco silencioso.

1. **`islas.test.ts` deja de proteger lo que protegía.** Recorre el grafo desde `src/scripts/`
   contando solo importaciones **relativas** y busca `from 'node:…'`. Su comentario dice
   textual que *"un paquete de node_modules es problema del empaquetador, y este proyecto no
   tiene ninguno del lado del cliente"*. **Adoptar un motor invalida esa premisa.**
2. **Los dos auditores de estética miran CSS, no JavaScript.** `movimiento.test.ts` y
   `estilos.test.ts` escanean `tokens.css`, `juego.css`, `sitio.css` y `cancionero.css` por
   literal. Un `src/styles/skayboy.css` se escapa de **los dos** sin tocar canvas. Y adentro
   del canvas no hay vara corrible: no existe hoy regla escrita que reemplace a la tabla de
   `diseno-marca.md` para lo que se dibuja a mano.
3. **`prefers-reduced-motion` no existe en JavaScript en este repo.** El corte es 100% CSS. Un
   bucle de `requestAnimationFrame` ni se audita ni se apaga. Es accesibilidad, no estilo.
4. **`contraste.test.ts` no tiene par que medir sobre una superficie dibujada.** Mide pares
   texto/fondo leyendo el CSS de verdad; en un plataformas el fondo del puntaje es el tileset,
   que cambia píxel a píxel. Hace falta un mecanismo —como el velo plano que `D-21` inventó
   para las tapas—, no una excepción.

Y un defecto que ya está cobrado y no es de este juego: `MODULOS` de `voz.test.ts` tiene ocho
entradas para nueve módulos de copy (`dos-ejes/copy.ts` está fuera del barrido), y
`estilos.test.ts` tiene cuatro bloques por juego para siete islas. Un `src/lib/skayboy/copy.ts`
que nadie agregue pasa el build con anglicismos y botones en infinitivo adentro. Ya pasó dos
veces: *"Link copiado"* estuvo tres ciclos en producción.

## 4. Lo que nadie midió, y se siente en la mano

Los nueve frentes midieron **peso de archivo** y nada más. Falta todo lo demás, y es tuyo:

- **Batería y CPU en un teléfono viejo.** Sería el único juego del sitio con un bucle a 60 fps
  corriendo minutos. Cero mediciones, cero proxy.
- **RAM de imagen decodificada**, que no es el peso del PNG. Un atlas a DPR 3 son megabytes de
  bitmap vivo. Es el mismo error que `D-37` punto 7 ya evita para el audio, sin trasladar.
- **El juego corriendo junto a la cama**, que `D-37` deja prendida en las pantallas de juego:
  un `AudioContext` vivo contra un `requestAnimationFrame` en gama baja.
- **Tiempo hasta jugable.** `D-32` límite 3 exige 0 ms hasta que la acción principal es
  tocable. Nadie midió parse + init del motor ni la precarga de sprites.
- **Latencia y comportamiento del toque**: `touch-action`, listeners pasivos, toque sostenido.
  El repo no tiene un solo control que se mantenga apretado.
- **Qué se ve si el motor no carga.** Sería el primer paquete de terceros corriendo en el
  teléfono de la gente. Hoy la respuesta es: pantalla en blanco.
- **La vara de peso está vencida.** Los 113 KB de JS se midieron sobre un `dist/` del 3 de
  septiembre, sin las ~2.000 líneas de cliente del ciclo 14. Antes de comparar un motor contra
  esa vara hay que correr `npm run build` de nuevo.
