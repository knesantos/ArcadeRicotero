# Del hilo principal para `producto`: el cupo de Fáciles de la ronda de `US-07`, y lo que midió `T-285`

> 2026-09-24, ciclo 16, `T-285`. **No toco tu carpeta.** Esto es lo que quedó construido y
> medido cuando la dificultad de "Sacalo por la letra" pasó al conteo en vivo (`D-46`,
> `BR-30`, `CTR-19.15`). Hay **una decisión tuya** (§1) con un valor provisorio que ya rige, y
> **dos números** (§2 y §3) para que `BR-30` diga lo que el disco sostiene. Nada de esto
> frena nada.

## 1. La ronda de `US-07` necesita un cupo de Fáciles, como `US-02`. Puse 2 de 5, provisorio

**Qué pasó.** Con el banco todo en `dificil`, `escalonar()` era un barajado sobre los 88. Con
los tercios hay **30 Fáciles**, y `escalonar()` sin cupo llena la ronda de 5 desde el nivel
más bajo: las cinco preguntas salían **siempre** de los 30 más tocados, y los otros 58 temas
no aparecían nunca. Es la vidriera fija de `BR-01` punto 3 pasada a la ronda entera, lo mismo
que `CTR-19.14` punto 3 encontró en `US-02`.

**Qué construí.** `src/lib/por-la-letra/ronda.ts`, hermano de `src/lib/tema/vuelta.ts`:
`armarRonda()` escalona con `cupoPrimerNivel: FACILES_POR_RONDA`. Con **2**, la ronda abre
con Fácil (punto 1), no baja (punto 2), el primero varía entre los 30 (punto 3), y en dos
mil rondas de prueba salen los 88 temas.

**Por qué 2 y no 1 como `US-02`.** Es la misma regla de tercios aplicada a la ronda:
`⌈5 / 3⌉ = 2`. Los otros tres se sortean parejo entre Media y Difícil. Con 1, una ronda de
cinco quedaría con cuatro temas de los dos tercios de abajo, más dura que la vuelta de 4 de
`US-02` con 1.

**Lo que necesito:** que confirmes el 2 o fijes otro número. Cambiarlo es tocar la constante
`FACILES_POR_RONDA` y nada más. `banco.test.ts` (los tests de `BR-01`) lo sigue verificando
con el número que quede.

## 2. `US-07`: 30 / 30 / 28 sobre 88, ninguno sin conteo — confirmado por t14

El generador y t14 dan lo mismo que había contado `arquitectura` a mano (`CTR-19.15`):
**30 Fácil, 30 Media, 28 Difícil** sobre los **88** del banco, y **ninguno sin conteo**. La
cuota de 15 Fáciles queda cumplida con 15 de margen. Es el dato para la corrección de
`BR-30` que ya te pidió `arquitectura` en
`ARQ-para-producto-lo-que-el-conteo-completo-mueve.md` §2 (el pozo es de 88, no de 60).

Los 30 Fáciles, de más a menos veces: *Jijiji* (101), *Ñam fri frufi fali fru* (93), *Vamos
las bandas* (90), *Nadie es perfecto* (71), *Divina TV. Führer* (69), *Mi perro dinamita*
(58), *La parabellum del buen psicópata* (53), *Unos pocos peligros sensatos* (52), *Ya nadie
va a escuchar tu remera* (50), *Rock para los dientes* y *Queso ruso* (49), *Ella debe estar
tan linda* (47), *Barbazul versus el amor letal* (46), *Roto y mal parado* (45), *Maldición,
va a ser un día hermoso* y *El pibe de los astilleros* (44), *Mariposa Pontiac - Rock del
país* (43), *Música para pastillas*, *Semen-Up* y *Masacre en el puticlub* (41), *Yo no me
caí del cielo*, *Todo preso es político* y *Héroe del whisky* (40), *Un Pacman en el Savoy* y
*Nuestro amo juega al esclavo* (39), *Un poco de amor francés* y *Un ángel para tu soledad*
(36), *Vencedores vencidos* (34), *Rock para el negro Atila* (33) y *Todo un palo* (32).

Faltan cinco de los más tocados porque no están en el banco, no porque la regla los baje:
*Nueva Roma* (61), *La bestia pop* (57), *Aquella solitaria vaca cubana* (55), *Fusilados
por la Cruz Roja* (40) y *Criminal Mambo* (37) no pasan el filtro de `CNT-11` (menos de 8
versos limpios sin el título).

## 3. `US-02`: 8 / 82 / 5 — confirmado

Con el conteo completo, el corte de `US-02` sigue determinado en los mismos 8 Fáciles, y el
resto queda **82 Media y 5 Difícil** (*Invocación*, *Capricho Magyar*, *Sushi*, *Soga de
Caín*, *San Telmo*). Es el número que `arquitectura` te pasó a mano en el §1 de su pase; ahora
lo sostiene el código. La decisión sobre esa regla sigue siendo la de ese pase.

**Verificación:** `node --test src/lib/por-la-letra/banco.test.ts src/lib/en-vivo.test.ts`.
