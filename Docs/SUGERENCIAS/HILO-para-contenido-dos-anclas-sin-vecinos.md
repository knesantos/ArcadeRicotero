# Del hilo principal para `contenido`: dos anclas sin vecinos, y lo que movió `T-288`

> 2026-09-24, ciclo 16, ráfaga 4, `T-288`. Sigue a
> `Docs/SUGERENCIAS/ARQ-para-contenido-la-letra-con-el-conteo.md` (`T-287`), que avisaba
> todo esto como posible. Acá está lo que pasó de verdad al regenerar el banco con
> `CTR-04` v3.

## 1. Dos anclas quedaron sin ítem, y las aparté sin borrarlas

El punto 2 del traspaso de `arquitectura` pasó con dos versos. Sus temas quedaron **Fácil**
por el conteo en vivo, y a esos versos les falta un vecino para los 2 de cada lado que pide
`BR-03`:

| Id viejo | Verso | Tema | Qué falta |
|---|---|---|---|
| `CL-383` | «Con sus muecas rotas [cromadas]» | *Nuestro amo juega al esclavo* | 1 verso antes. Es el segundo verso del tema |
| `CL-096` | «Que los buenos [volvieron]» | *Música para pastillas* | 1 verso después. Es el anteúltimo |

`CTR-04.14` paso 8 dice que el generador aborta en este caso, y aborta. Para no dejar el
banco en v2 y el build en rojo, **las moví de `fuenteUnica.items` a `fuenteUnica.enEspera`**
en `src/data/letra-confirmaciones.json`, con el verso, tu motivo y el id viejo. No elegí
ningún verso en su lugar: eso es tuyo. El generador no las promueve, las lista en cada
corrida y avisa si alguna vuelve a dar ítem (por ejemplo, si un conteo nuevo baja el tema a
Media).

**Lo que te pido:** elegí dos versos de reemplazo, del mismo tema o de otro, y sumalos a
`fuenteUnica.items` con su `verso` como ancla. Después, `npm run generar-letra -- --reanclar`.
El banco jugable quedó en **19**, arriba del piso de 15, así que esto no frena nada.

## 2. Ocho `listo` cambiaron de nivel, y con el nivel su contexto

Cruzados por verso, no por id. Los ids se corrieron: los nuevos van entre paréntesis.

| Verso | Tema | Antes → ahora |
|---|---|---|
| «[Superlógico] , sí, sí, sí.» (`CL-039`) | *Superlógico* | facil → media |
| «[Superrígido] , sí.» (`CL-044`) | *Superlógico* | facil → media |
| «Rockeros bonitos, [educaditos]» (`CL-086`) | *Música para pastillas* | dificil → **facil** |
| «tu breto y tus ojos [grises] .» (`CL-395`) | *Blues de la artillería* | facil → media |
| «yo no soy de [aconsejar]» (`CL-396`) | *Blues de la artillería* | facil → media |
| «Que iban al [grano]» (`CL-736`) | *¡Es hora de levantarse querido!* | facil → **dificil** |
| «Y el carozo del asunto es tu [temor]» (`CL-740`) | *¡Es hora de levantarse querido!* | facil → **dificil** |
| «Dr. Saturno, dame un [turno] !» (`CL-1241`) | *Dr. Saturno* | facil → **dificil** |

**`CL-086` es el que más te toca mirar.** Lo promoviste con el motivo *"Dificultad dificil,
sin contexto mostrado"*. Ahora muestra dos versos de cada lado. El filtro de `CNT-11` los
limpió, pero si el verso sigue siendo de bajo riesgo es juicio tuyo.

## 3. La cota de 8 versos por tema

Dos temas `listo` pasan de 8 versos distintos (`CTR-04.4`): *Jijiji* (9) y *Un poco de amor
francés* (9). Es el punto 3 del traspaso de `arquitectura`: los dos ítems de cada tema son
Fáciles y se solapan poco. Precaución, no cerrojo (`D-14`). Si querés que bajen, dejá uno solo
de cada tema, o elegí dos que se solapen.

## 4. Dos cosas del cancionero que salieron a la vista

- ***La bestia pop* quedó afuera del banco.** Tiene **un solo** verso que pasa el filtro
  («Vamos a brillar, mi amor»). Como tema Fácil, ese verso no tiene vecinos, así que no da
  ítem y el tema sale del pozo. Es uno de los más tocados. Si se retranscribe o se limpia su
  letra en el cancionero, vuelve solo.
- **Un borrador con ruido de transcripción:** «POS-VERSO: [PArte] B)», de *Te voy a
  atornillar*. Es borrador, no llega a la pantalla, pero pasó el filtro de `CNT-11`. Si
  alguien lo promueve, el hueco cae sobre `PArte`.

## Cómo se verifica

```bash
npm run generar-letra        # lista "en espera", los que cambiaron y la cota de 8
node --test src/lib/letra/*.test.ts
```
