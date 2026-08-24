# INV-23 — cifraclub.com como fuente de letras

> Ficha pedida por el hilo principal en
> `Docs/SUGERENCIAS/HILO-para-investigador-fichar-cifraclub.md`, tarea `T-97` del ciclo 7.
> Responde las mismas tres preguntas que `RES-23` respondió sobre letras.com
> (`INV-21-letras-y-fuimos-reyes.md`), para que las dos fichas se puedan comparar.
>
> Consume: `RES-20` (105 temas canónicos), `RES-23` (metodología espejo), `D-13`,
> `src/data/cancionero-cuarentena.json` y `src/data/cancionero.json` (cruce verificado acá).
> Afecta: `CTR-04`, `scripts/generar-letra.mjs`, `US-03`.
>
> **Escrita por `investigador` en `T-97`; pegada por el hilo principal**, porque el rol es
> de solo lectura y no puede escribir en su propia carpeta (`D-12` visto del otro lado).

---

## RES-49 — cifraclub.com es la misma clase de fuente que letras.com, con la mitad del problema y el doble de trazabilidad

Responde el pedido de `Docs/SUGERENCIAS/HILO-para-investigador-fichar-cifraclub.md`: si
`CTR-04` puede citar esta ficha como `fuenteLetra` para los 82 temas que cifraclub aportó
al cancionero.

### 1. Qué es cifraclub y qué tan confiable es su transcripción de letra

- **Hallazgo:** cifraclub (`cifraclub.com.br`, dominio real detrás del `cifraclub.com` del
  scraper — mismas rutas `/los-redonditos-de-ricota/<tema>/`, mismo catálogo) es una
  plataforma **colaborativa**: "la gran mayoría de las cifras y transcripciones fueron
  enviadas por nuestros usuarios". Existe desde 1996.
  URL: https://www.cifraclub.com.br/blog/curiosidades-sobre-o-cifra-club/ · Consultado:
  2026-08-24 · **verificado**
- **Hallazgo:** hay un equipo de moderación que revisa envíos "hasta en 5 días hábiles" y
  un **sello de calidad**, pero el propio instructivo de envío aclara que el sello se pone
  en **"las principales cifras"** — no dice que sea todo el catálogo.
  URL: https://suporte.cifraclub.com.br/pt-BR/support/solutions/articles/64000236814-guia-para-envio-de-cifras-tablaturas-e-outras-transcricoes
  Consultado: 2026-08-24 · **verificado**
- **Hallazgo:** en la página real de un tema de la banda ("Cruz Diablo") **no hay sello de
  revisado visible**, aunque el snippet de búsqueda de otro resultado sí mencionaba un
  sello para el catálogo de la banda en general. Contradicción no resuelta — ver "Sin
  resolver".
  URL: https://www.cifraclub.com.br/los-redonditos-de-ricota/cruz-diablo/letra/
  Consultado: 2026-08-24 · **verificado — con contradicción anotada**
- **Hallazgo — el dato que más importa para las cinco mitigaciones de `RES-23`:**
  cifraclub.com.br y letras.com (`letras.mus.br`) son del **mismo dueño**, Studio Sol, junto
  con Palco MP3. No son dos fuentes independientes: son dos productos de la misma empresa.
  Esto no invalida la mitigación 2 de `RES-23` ("dos fuentes que coincidan") — el contenido
  lo siguen subiendo usuarios distintos por producto —, pero le baja el valor: coincidir
  entre hermanas corporativas pesa menos que coincidir entre desconocidas.
  URL: https://www.cifraclub.com.br/blog/curiosidades-sobre-o-cifra-club/ · Consultado:
  2026-08-24 · **verificado**
- **Hallazgo:** el aviso legal de cifraclub es genérico — se declara "mero proveedor de
  aplicativos", pone la responsabilidad del contenido en el usuario que lo sube, y **no
  menciona ningún acuerdo con editoriales musicales, SADAIC ni entidad de gestión.** Es el
  mismo hallazgo que `RES-23` hizo sobre letras.com, con el mismo método.
  URL: https://www.cifraclub.com.br/aviso-legal.html · Consultado: 2026-08-24 ·
  **verificado — ausencia constatada, no inferida**

**Conclusión de la pregunta 1:** cifraclub **no tiene más respaldo editorial que
letras.com** para el texto de la letra (para los acordes tiene un moderador humano, que es
un dato aparte y no lo pidió esta ficha). Es fan-contribution con revisión parcial, sin
licencia documentada.

### 2. ¿Arrastra el mismo error de mezclar catálogos que letras.com?

Cruce hecho a mano sobre `src/data/cancionero.json` y `src/data/cancionero-cuarentena.json`
(ambos del repo, generados por `scripts/ingerir-cancionero.mjs` aplicando `D-13`).

| Fuente | Entraron (en los 105 de `RES-20`) | Cuarentena (fuera de los 105) | Total raspado | Tasa de contaminación |
|---|---|---|---|---|
| cifraclub.com | 88 | 17 | 105 | **16 %** |
| letras.com | 16 | 28 | 44 | **64 %** |

(88+17=105, 16+28=44, 105+44=149 — cuadra con los 149 archivos originales.)

> **Ojo con dos pares de números que conviven en esta ficha y no son el mismo.** Los 88 y
> 16 de la tabla son **temas ingeridos**; los 82 y 14 que usa el pedido y la recomendación
> de abajo son **temas con letra de verdad** (`contenido: "letra"`). La diferencia son los
> ocho instrumentales y los de solo tablatura, que entraron al cancionero pero no aportan
> un verso. Los dos pares están verificados contra el repo por el hilo principal el
> 2026-08-24.

**Hallazgo — cálculo propio sobre datos del repo, no un hecho externo:** el error que
`RES-23` demostró para letras.com (mezclar Indio solista, Skay y variantes con el catálogo
de la banda) **existe en las dos fuentes, pero es cuatro veces más frecuente en
letras.com que en cifraclub.** De cada archivo que cifraclub raspó, 1 de cada 6 no era de
Patricio Rey; en letras.com, casi 2 de cada 3.

**Conclusión de la pregunta 2:** el error es del corpus combinado, como ya sabíamos, pero
**no es parejo entre las dos fuentes** — cifraclub es comparativamente más limpio. El
mecanismo que ya lo neutraliza para las dos por igual es `D-13`/`resolverTema()`: es
obligatorio y automático, y ya corrió sobre los 149 archivos antes de que esta ficha
existiera.

### 3. ¿Hay atribución de quién transcribió, y cambia algo para el rótulo?

- **Hallazgo:** sí, a diferencia de lo que `RES-23` encontró en letras.com, la página de un
  tema en cifraclub muestra **un nombre de usuario que envió la letra** (ej.: "Romina
  Lopez" en "Cruz Diablo"), junto con el crédito de autoría de la canción (Skay
  Beilinson/Indio Solari) y un botón para reportar si está mal.
  URL: https://www.cifraclub.com.br/los-redonditos-de-ricota/cruz-diablo/letra/
  Consultado: 2026-08-24 · **verificado**

**Conclusión de la pregunta 3 — no cambia el rótulo.** Un nombre de usuario en un formulario
de carga **no es** lo que `D-14` y `.claude/rules/contenido-json.md` definen como
`testimonio`: eso pide alguien con nombre y apellido contando algo en primera persona, con
ficha. Acá no hay relato, hay una transcripción anónima con seudónimo verificable de
ninguna manera. Sigue siendo, en el mejor caso, **leyenda** (o material sin rotular hasta
que alguien lo confirme de oído) — nunca **hecho**.

### Recomendación para `CTR-04`

**Sí: `CTR-04` puede citar `RES-49` como `fuenteLetra` para los 82 temas de cifraclub, con
el mismo estatus y las mismas cinco mitigaciones que `RES-23` ya tiene aceptadas para
letras.com** — cruce contra `RES-20` (ya corrido, automático), y confirmación de oído antes
de `listo`. No es una fuente mejor; es la misma clase de fuente, algo más limpia en el
cruce de catálogo y con trazabilidad de usuario que letras.com no tiene. Citarla no saca a
ningún ítem de `borrador`: eso lo sigue decidiendo la escucha, como ya deja escrito el
hilo del pedido.

### Sin resolver

- **El sello de calidad:** un snippet de búsqueda sugiere que el catálogo de la banda en
  cifraclub tiene sello de revisado; la página que se abrió (Cruz Diablo) no lo muestra. No
  se determinó si aplica a alguno de los 82 temas del cancionero. Si `contenido` necesita
  saber cuáles, hay que abrir las 82 páginas una por una — no se hizo por ser fuera del
  alcance puntual de esta ficha.
- **Si "Romina Lopez" u otros usuarios de cifraclub son cuentas reales o seudónimos** — no
  verificable desde afuera, y no cambia la recomendación.

---

## Nota del hilo principal, 2026-08-24: la ficha existe y el generador todavía no la usa

`T-105` iba a aprovechar esta recomendación para que el banco de `US-03` dejara de salir de
13 temas y pasara a salir de ~95. **Se canceló en el mismo ciclo**, y no por la ficha: el
usuario avisó que **el cancionero se está rehaciendo en otra sesión**, en
`C:\Users\santi\Proyectos\TemasRedo\cancionero`. Regenerar el banco sobre un corpus que
está por cambiar es trabajo que se tira.

**Lo que queda listo y esperando**, sin nada que investigar de por medio:
`scripts/generar-letra.mjs` tiene la fuente en la constante `FICHA_LETRA` y filtra por
`t.fuente.sitio === 'letras.com'` en un solo lugar. Cuando el cancionero nuevo aterrice,
son dos líneas y una corrida.
