# UX-40 — El almanaque del portal: un mes, un afiche

> Rol dueño: `experiencia`. `T-520`. Primera versión 2026-10-29.
>
> **Consume:** `D-84` (la decisión del usuario, 2026-10-29, "Sí, armalo"); `Docs/SUGERENCIAS/HILO-para-todos-el-almanaque-del-portal.md`
> (la propuesta, fuente principal); `D-49` (el afiche de octubre y sus tres reglas); `D-19` (la mezcla
> sección→disco); `D-14` (las tres casillas); `D-65` (Patricio Rey Fan con tildes); `D-17` (voz);
> `UX-25` §1 (el presupuesto de alto del portal); `UX-35` §2.4 (el frente del portal en escritorio);
> `UX-04` (mapa sección→disco); `.claude/rules/diseno-marca.md`; `.claude/rules/voz-ricotera.md` §5.
> Historia que resuelve: la de entrada del portal (`UX-01`, primera pantalla sin muro); no abre una nueva.
>
> **No toco código ni el lienzo.** Esta hoja fija el componente y los textos; el hilo principal pega la
> hoja 18 y construye. Lo que digo "se audita" lo corre `revisor` o el hilo principal (`D-12`).

---

## 1. Qué es

El afiche de octubre (`D-49`) deja de ser una pieza de un mes y pasa a ser **un componente: un mes,
un afiche**. Lo prende la fecha de quien mira (`data-mes` en la cabeza del portal, antes del primer
cuadro, sin build ni deploy). Los datos salen de las fichas de la Redondopedia (discos e hitos) y
**solo entra lo rotulado `hecho`**, con una excepción declarada (§5).

| Mes | Afiche |
|---|---|
| Octubre | el que ya existe |
| Noviembre | HURACÁN (§4) |
| Diciembre | CINCUENTA (§5) |
| Mayo | cuando se construya, con el mismo componente |
| Marzo, abril, junio | **nunca**: son duelo (Olavarría, Bulacio, la muerte del Indio) y viven en la Redondopedia, en registro 3 |
| El resto | el portal corto de `UX-25`, sin relleno de efemérides flojas |

Un mes sin afiche no es un hueco: es la regla. Tres de doce meses con afiche hoy, cuatro con mayo.

## 2. El componente

Igual en todos los meses. De arriba abajo, en el teléfono:

1. **Borde fino** en la tinta del mes, giro de **−0,6°**, **cinta** arriba a la derecha. Recorte
   pegado, sin sombra ni elevación (`diseno-marca.md`).
2. **Sello grande**, en la letra del mes (§3).
3. **Estampa hueca del cumpleaños**: `EL 19 CUMPLE 33` antes del día, `HOY CUMPLE 33` el día,
   `CUMPLIÓ 33 EL 19` después. Siempre en `--fuente-rotulada`. Los años los cuenta la fecha de quien mira.
4. **La línea que canta**, en `--fuente`, en el texto.
5. **La línea que cuenta**, en `--fuente` y `--texto-tenue`.
6. **El almanaque de tacos**: día grande en la tinta del disco o del hito, año chico, nombre abajo.
   **Tres por renglón a 320 px.** Cada taco es un enlace a su ficha, con `--toque-min` ≥ 48 px.
7. **El botón**: sello entintado en la tinta del mes, letra `--fondo`, un tap, a una sola cosa.

**Lo único que cambia por mes:** la tinta, la letra del sello, los textos y los tacos. Si un mes pide
otro borde, otro giro o otra estructura, no es el almanaque: es una pantalla nueva y vuelve acá.

## 3. Tintas y letras por mes

| Mes | Tinta (borde, sello, botón) | Por qué | Letra del sello |
|---|---|---|---|
| Octubre | `--marca-rojo` | como hoy (`D-49`) | `--fuente-titular` (el calco de la tapa de *Oktubre*) |
| Noviembre | `--disco-lobo-suelto-tinta` | el disco que se presentó en Huracán esas noches; mitología en `D-19` | `--fuente-marca-firma` |
| Diciembre | `--disco-gulp-tinta` | historia en `D-19`, el primer disco | `--fuente-marca-firma` |

**Ningún hex nuevo.** Los pares tinta/`--fondo` de las tres tintas ya están en `contraste.test.ts`; el
botón usa el mismo par invertido (letra `--fondo` sobre tinta). Los tacos usan la tinta de su disco
(`--disco-momo-sampler-tinta`, `--disco-ultimo-bondi-a-finisterre-tinta`, también testeadas).

**Por qué la firma y no el calco en noviembre y diciembre.** El calco de *Oktubre* no tiene Á ni S, y
además es la letra de *ese* disco: prestársela a otro mes es disfrazarlo. Patricio Rey Fan tiene las
tildes desde `D-65` y se lee desde ~19 px; el sello va de 29 para arriba. Descarté `--fuente-rotulada`
para el sello: es el repuesto de todo y no dice nada de la banda.

## 4. Noviembre: HURACÁN

Cumpleaños: **19 y 20 de noviembre de 1993**, ficha `huracan-93-94`, `hecho`. La estampa cuenta desde el 19.

| Pieza | Texto | Registro |
|---|---|---|
| Sello | HURACÁN | 1 |
| Estampa | `EL 19 CUMPLE 33` · `HOY CUMPLE 33` · `CUMPLIÓ 33 EL 19` | 3 |
| Canta | Trepate al alambrado, que ya salen. | 1 |
| Cuenta | El 19 y el 20 de noviembre del 93, más de setenta mil personas en el Ducó, para presentar el disco doble. | 2 |
| Tacos (seis) | `2` La separación 2001 · `17` Momo Sampler 2000 · `18` Último bondi 1998 · `19` Huracán 1993 · `20` Huracán 1993 · `26` El Lozanazo 1977 | 3 |
| Botón | MIRÁ QUÉ SE TOCÓ EL 19 | 1 |

Los tacos de Huracán van en la tinta de *Lobo suelto*; el Lozanazo y la separación, en `--texto` (no
tienen disco). La separación (ficha `la-separacion`, "oficialización = 2 de noviembre de 2001", `hecho`)
entra aunque no festeje nada: el mes tiene principio y final, el Lozanazo del 77 y la separación del
2001. **El almanaque es el mes como fue; lo que festeja es el cumpleaños, no cada taco.**

El botón lleva a la lista del 19/11/93 en `/redondopedia/en-vivo/#lista-1993-11-19`. Dice "mirá" y no
"escuchá la noche" porque es una lista que se mira (y suena por recortes), no la grabación: no promete
un audio que el sitio no tiene. El ancla es estable por fecha (`lista-<fecha>`; si dos cargas comparten
noche, la segunda lleva `-2`) y la isla abre el `<details>` al llegar por el `#`. **Ya está construido,
con test**, en la misma rama.

Descarté "ARMÁ TU HURACÁN" (el juego no acepta un lugar por URL) y los dos discos de cumpleaños (cumplen
26 y 28: nada que *Oktubre* no tenga mejor).

## 5. Diciembre: CINCUENTA, con el rótulo a la vista

Cumpleaños: la fundación del **28 de diciembre de 1976**, ficha `la-formacion`, rotulada **`leyenda`**.
Es la única excepción a "solo `hecho`", y entra porque va **rotulada a la vista**, que es lo que `D-14` pide.

| Pieza | Texto | Registro |
|---|---|---|
| Sello | CINCUENTA (en letras: la firma no tiene números) | 1 |
| Rótulo | `◆ LEYENDA`, al lado de la estampa | 3 |
| Estampa | `EL 28 CUMPLE 50` · `HOY CUMPLE 50` · `CUMPLIÓ 50 EL 28` | 3 |
| Canta | Soplá las velitas, por las dudas. | 1 |
| Cuenta | Circula que la banda nació el 28 de diciembre de 1976, Día de los Inocentes. Nadie lo confirmó ni lo desmintió del todo. (El rótulo ya dice qué es; la línea no lo repite.) | 2 |
| Tacos | `2` Obras 1989 · `16 y 17` Huracán 1994 · `28` La formación 1976 (este, con el ◆) | 3 |
| Botón | LEÉ CÓMO EMPEZÓ, a `/redondopedia/la-formacion/` | 1 |

**El rótulo.** Es el sello de goma de la Redondopedia, con `--rotulo-leyenda`: **no se disfraza de
disco**, ni siquiera dentro de un afiche que viste a *Gulp!*. Va con símbolo y palabra, nunca solo color.
Pegado a la estampa, no al pie: tiene que leerse antes de leer la fecha como hecho. El taco del 28 lleva
el ◆ por la misma razón.

**Concordia 95 no entra:** no tiene ficha propia en la Redondopedia (vive en "En vivo") y un taco sin
destino es un enlace roto. Si alguna vez tiene ficha, se suma como taco sin tocar el componente.

## 6. Las dos líneas y los registros (`voz-ricotera.md` §5)

Sello, canta y botón son registro 1; la que cuenta, registro 2; estampa, rótulo y tacos, registro 3
(seco, sin imagen, sin chiste, sin suspensivos). **La prueba:** tapada la que canta, el afiche sigue
diciendo qué es (el sello, la estampa y la que cuenta) y qué botón tocar (el botón dice a dónde va). En
diciembre, además, el rótulo no puede quedar fuera de lo que se lee tapando la que canta.

## 7. Escritorio (`UX-35` §2.4)

No cambia: desde 64 rem el afiche va al lado de la cabecera en el frente del portal, proporción 1 a
1,12 y centrados en alto. Cambia solo la condición: **"hay afiche" lo dice cualquier mes con afiche**, no
octubre. Sin afiche, la cabecera ocupa sola el renglón. El componente no tiene versión ancha: el
almanaque de tacos se reparte con el ancho que le toque, sin romper los tres por renglón del teléfono.

## 8. El costo, declarado contra `UX-25`

El afiche suma **~370 px a 375×812** (medido en `D-49`) y se lo suma al presupuesto de `UX-25` §1
(~1486 px para el portal con el casete rediseñado). Con el almanaque pasa de "un mes" a **un cuarto del
año hoy (tres meses) y un tercio con mayo (cuatro)**. Se acepta, por decisión del usuario (`D-84`), y se anota acá
para que `UX-25` no se lea como si el techo valiera todo el año. Los otros ocho meses el portal sigue
siendo el corto. Descarté un segundo afiche "chico" fuera de la semana del cumpleaños: es otro
componente para ahorrar una pantalla. El mes sin afiche cuesta cero: `display: none`, no se deja un hueco.

## 9. El lienzo: hoja 18

El almanaque va como **hoja 18** del lienzo "Sistema de marca Fichín Ricotero" (la pega el hilo
principal, **antes** del código: `diseno-marca.md`, el circuito). Muestra los tres afiches lado a lado
(octubre, noviembre, diciembre): **el mismo componente con tres tintas y dos letras**. Tiene que verse
además: la estampa en sus tres funciones, el rótulo `◆ LEYENDA` en diciembre y un taco con ◆, y a 320 px
los tres tacos por renglón. Si algo se ve distinto de lo que dice esta hoja, manda el lienzo y se corrige acá.

## 10. Qué se audita

- **`voz.test.ts`**: sello de ≤ 8 palabras; botón en imperativo (`MIRÁ`, `LEÉ`, nunca infinitivo);
  sin suspensivos en botón ni rótulo; sin anglicismos ni fórmulas de folleto en las líneas que cantan.
- **`contraste.test.ts`**: los pares tinta/`--fondo` de las tres tintas y `--rotulo-leyenda`; si un taco
  usa una tinta como texto, su par ya existe.
- **`fuentes.test.ts`**: que nadie le pida al calco una letra que no tiene (por eso noviembre y diciembre
  van en la firma).
- **`estilos.test.ts`**: sin sombras, sin pastilla, sin barra lateral.
- **El test del almanaque**: falla si la ficha del cumpleaños pierde el rótulo que el afiche dice
  (`hecho` en octubre y noviembre; `leyenda` el 28 de diciembre). Si `la-formacion` pasara a `hecho`, el
  afiche tiene que sacar el rótulo: el test lo marca en los dos sentidos. También, que cada taco tenga
  ficha de destino.
- **A ojo (`revisor`)**: que un mes de duelo no tenga afiche; que el rótulo se lea antes que la fecha;
  que la hoja 18 y el sitio digan lo mismo.

## 11. Checklist

- [ ] 375×812 y 320 de ancho: el afiche entero, tres tacos por renglón, ningún taco por debajo de 48 px.
- [ ] Con la fecha del teléfono en noviembre y diciembre: aparece el afiche del mes y ninguno más.
- [ ] En marzo, abril y junio: ni un píxel de afiche.
- [ ] Noviembre muestra seis tacos (2, 17, 18, 19, 20, 26) sin romper los tres por renglón.
- [ ] El botón de noviembre abre la lista del 19/11/93 ya desplegada; el de diciembre llega a `la-formacion`.
- [ ] Primera pantalla sin muro: el que llega sin idea ve qué es y qué tocar, y los casetes quedan
      un scroll más abajo, nunca fuera de alcance.
- [ ] Ningún estado se dice solo con color: el ◆, la palabra LEYENDA y el año acompañan a la tinta.
