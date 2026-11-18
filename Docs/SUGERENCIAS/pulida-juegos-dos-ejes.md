# Pulida de los juegos, juego 2, ronda 1: la noche se ve

> Propuesta del constructor de la ronda (2026-11-18), para que el hilo principal la convierta en
> decisión o la corrija. Juego: «¿Qué tipo de ricotero sos?» (`US-06`). Sigue a las tres
> `pulida-juegos-*.md` de «Adiviná el tema». No toca `ESTADO.md`, `Docs/DECISIONES.md` ni la
> carpeta de ningún rol.

## 1. Lo que necesita decisión

1. **La marca que se mueve en el plano mientras jugás: no la hice, y propongo no hacerla.**
   El encargo pedía una ficha o una aguja que se corriera con cada respuesta. Choca con tres cosas
   que ya están decididas: `BR-17` (el test devuelve una identidad, no un puntaje), el plano «sin
   punto» de `UX-38` y `D-62` («un punto invita a medir a qué distancia queda del eje») y
   `isla.test.ts`, que falla si la isla cuenta polos. Una marca que se corre con cada respuesta
   es el conteo dibujado, y además canta el resultado en la hoja 6.
   Lo que hice en su lugar:
   - **mientras jugás**, la casilla de la opción elegida se llena y la marca vuela a la fila de la
     noche, que ahora se llena de a mitades. Avanza igual con cualquier respuesta: es el folio;
   - **en el resultado**, el plano se arma cuando lo llegás a ver: los dos ejes se trazan desde el
     cruce y el recuadro de tu manera cae como un sello en su cuadrante.
   Si el usuario igual quiere algo que se intuya durante la partida, la salida que no mide es un
   rastro sin posición (por ejemplo, que el lugar cambie según lo elegido: una ventana que se
   prende, alguien que se suma a la ronda). Es contenido además de código, y es una ronda.
2. **El juego ahora tiene un lugar dibujado.** Siete máscaras SVG en `public/arte/dos-ejes/`
   (`noche-*.svg`), dibujo propio de recorte, generadas por `npm run generar-noche-dos-ejes`. No
   salen de ninguna tapa. `UX-36` dice que el sello del momento era «el único movimiento de la
   noche»: dejó de serlo, por el pedido del usuario.
3. **La gente es la multitud de *Oktubre* adentro de un juego que viste *Luzbelito*.** Uso las
   máscaras `multitud-lejos-*.png` del portal (la cola de la vereda y el pogo), con la tinta de
   *Luzbelito* en las banderas en vez del rojo. Dos cosas a resolver: si la mezcla `D-19` lo
   admite, y **el crédito**: el pie de esta página acredita solo *Luzbelito* y no lo toqué.
4. **Tokens nuevos, sin pasar por el lienzo**: siete pesos de tinta (`--peso-noche-*`, mezclas
   del papel y del cuero contra el fondo, sin texto encima) y cuatro tiempos de bucle
   (`--duracion-llama`, `-ruta`, `-pogo`, `-haz`). El circuito dice lienzo primero.
5. **El juego hace ruido**: `tecla` al elegir, `sello` al llegar a un momento, al caer el nombre y
   al armarse el plano, `clac` al empezar. Mismo interruptor que «Adiviná el tema» (las dos
   cadenas están copiadas en `dos-ejes/copy.ts`: las confirma `contenido`). Nadie los escuchó.
6. **«Empezá la noche» cambió de forma, no de color.** Sigue en el cuero del disco (`D-19`, par
   testeado); ahora va en la letra del juego, en mayúsculas y con un filete de papel. Si igual
   se ve apagado, la decisión es de color y es del lienzo: propongo el papel con letra de tinta.
7. **La línea que canta se mudó de la hoja al cielo del lugar.** En ventanas de menos de 700 px
   de alto y en el modo incrustado vuelve a la hoja (no hay cielo donde ponerla).
8. **La hoja bajó del medio al pie de la pantalla** en el teléfono: las dos opciones quedan
   siempre a la misma altura. Deshace la mitad de la nota del 2026-11-04 («la hoja va en el medio»).

## 2. Detalles vivos de esta ronda

| Detalle | Estado | Con movimiento reducido |
|---|---|---|
| La tira del camino se corre un tramo | cada hoja | salta a su parada |
| La luna cruza el cielo | cada hoja | salta |
| El sello grande del momento cae sobre el cielo y se va | llegar a un momento | no aparece; queda el de la hoja |
| El fuego de la ronda, en tres cuadros | la previa | prendido, quieto |
| Los postes pasan, el micro entra, traquetea y se va | la ida | postes plantados, micro parado |
| La gente sube desde abajo y salta; los haces barren a los saltos | cuando suena | de pie; haces a media fuerza |
| Nada | la vuelta | — |
| La casilla de la opción se llena y la marca vuela a la fila | elegir | se llena sin vuelo |
| La hoja contestada se va de costado; al volver, entra desde ahí | pasar de hoja | cambio directo |
| La tapa del libro viaja a la hoja y se abre sobre su lomo | «Empezá la noche» | no viaja |
| La última hoja se apoya y el nombre cae | resultado | ya apoyado |
| Los ejes se trazan y el recuadro de tu manera cae | el plano entra en pantalla | entero desde el principio |

Solo `transform` y `opacity`, sin ningún `requestAnimationFrame`.

## 3. Hallazgos que no son de esta ronda

- **La leyenda de las teclas no estaba en el teléfono**: el sitio ya la mostraba solo con puntero
  fino. Era de la captura, que se presentaba como compu angosta. `mirar-juego.mjs` ahora presenta
  las ventanas de menos de 768 px como teléfono (`--sin-dedo` lo apaga).
- **El botón de la portada ya caía bajo el pliegue antes de esta ronda**, medido con el
  navegador presentado como teléfono: a 320 × 568 termina en 598 (ahora 594), y en la postal a
  360 × 640 y 375 × 667 en 686 y 672 (ahora 682 y 668). No lo arreglé: quedó cuatro píxeles mejor.
