# Del hilo principal para `contenido` y `arquitectura`: "Completá la letra" se regalaba por dos puertas

> 2026-09-25, rama `ciclo-16/lo-barato-que-se-ve`. **No toco `Docs/CONTENIDO/` ni `Docs/ARQ/`.**
> Toqué `scripts/generar-letra.mjs`, regeneré `src/data/letra.json` y aparté cinco anclas en
> `src/data/letra-confirmaciones.json` (como en `T-288`); `contenido` eligió los reemplazos en
> `CNT-23`. Consume `CTR-04.8`, `CTR-04.12` chequeo 4, `BR-03` y `D-14` (lo único estricto:
> premiar al que sabe).

## Lo que se veía jugando en producción

**Puerta 1, los distractores.** 11 de los 19 ítems `listo` traían al menos una opción que se
descartaba sin saber nada del tema:

| Tipo | Ejemplos (banco de `b1a5bb4`) | De dónde salía |
|---|---|---|
| Mayúscula sostenida | `GUITARRA` en `CL-039` y `CL-044` | el rótulo `GUITARRA:` de una tablatura |
| Sílaba cortada | `tiem` en `CL-103` | "¡Cómo corre el tiem - po!" |
| Caja distinta de la respuesta | `Muchachitas`, `Saludable` al lado de *educaditos* | la mayúscula de arrancar el verso |
| Sin tilde | `estan`, `huerfano`, `alla` | la transcripción de cifraclub |
| Nombre propio bajado de caja | `kenzo`, `momo`, `lionel` | "Lionel Ritchie en el Bar Prince" |

**Puerta 2, la respuesta a la vista.** 5 de los 19 `listo` (80 de los 1404 candidatos) mostraban
la respuesta escrita en un verso de contexto del propio ítem. «Rockeros bonitos, [educaditos]»
salía debajo de otro «Rockeros bonitos, educaditos». `sirveDeRespuesta()` prometía evitarlo en su
comentario, pero solo miraba el verso del hueco.

## Lo que cambió en el generador

- `sirveDeDistractor()`: lo de `sirveDeRespuesta()` más tres filtros. Sin mayúscula sostenida,
  sin guion adentro, sin sílaba cortada por un `-` suelto.
- `registrarForma()`: sobre los diez discos juntos, anota si la palabra aparece alguna vez en
  minúscula y la escritura con tilde si existe en algún tema. Una mayúscula en la mitad de la
  frase, o seguida de otra mayúscula, es un nombre.
- `formaDelDistractor()`: la misma caja que la respuesta. Un nombre propio no se baja de caja, y
  al lado de una respuesta en minúscula no entra.
- **`respuestaALaVista`** en `armarItems()`: un hueco cuya respuesta está en su contexto no da
  ítem. Va antes de la huella, así un verso repetido puede dar ítem en otra aparición.
- **La semilla del sorteo es la huella del verso, no el id.** Con el id, cualquier corrimiento
  volvía a sortear los distractores de todo el banco, incluidos los que ya miraste: pasó hoy
  mismo, entre tu `CNT-23` y el `--reanclar`. Con la huella, un ítem conserva sus opciones
  mientras su verso, su contexto y el vocabulario de su disco no cambien.

`src/lib/letra/distractores.test.ts` mira las dos puertas sobre el banco entero, borradores
incluidos. El banco de `b1a5bb4` falla cinco de sus seis casos.

## Cómo quedó el banco

**21 `listo`: 9 fáciles, 7 medias y 5 difíciles** (antes: 19, con 11 / 4 / 4). Las cinco anclas que
caían (`aquí`, `mambo`, `Superlógico`, `Superrígido`, `educaditos`) y las dos que esperaban desde
`T-288` tienen reemplazo en `CNT-23`, y `enEspera` quedó vacía. Los distractores de abajo son los
definitivos, sorteados con la huella. **No son los que miraste en `CNT-23`**: esos se volvieron a
sortear con el `--reanclar`. Los revisé uno por uno buscando una opción que complete el verso. No
hay ninguna; hay algunas plausibles, que es lo que tiene que hacer un distractor.

```
CL-058   facil    Muchachitas [fatales]                     | *fatales / secuestro / suerte / nunca
CL-081   facil    Y se [ofreció]                            | música / rockeros / *ofreció / cristal
CL-083   facil    No mires, por [favor]                     | *favor / gastos / alcanza / secas
CL-147   facil    Vencedores [vencidos] !                   | negro / acabo / llegó / *vencidos
CL-148   facil    Te has fugado ! me hago [humo] !          | *humo / acabo / amaba / linda
CL-297   facil    Violencia es [mentir]                     | usas / cielo / ganar / *mentir
CL-307   facil    Un poco de amor [francés]                 | hablar / *francés / versos / culo
CL-317   facil    De esa miel no comen las [hormigas]       | truchas / importa / *hormigas / ocultando
CL-343   media    tu breto y tus ojos [grises] .            | *grises / guita / filas / escuchen
CL-344   media    yo no soy de [aconsejar]                  | acechándome / *aconsejar / ocultando / acompaña
CL-407   media    Y el premio a [pique] se fue              | *pique / parte / guita / hielo
CL-510   facil    Cuando [anochezca]                        | *anochezca / siguen / invaden / apretar
CL-537   media    Llegan buenas nuevas de los [escondidos] ,| patéticos / *escondidos / cambiado / infinita
CL-601   dificil  Recuerdo como su mirada me [volteo]       | guinda / brujas / milagro / *volteo
CL-619   media    tanta [infidelidad] .                     | inconsolable / corazones / recordar / *infidelidad
CL-646   media    Mi racha de novato nunca [cambiará] .     | presa / tapete / *cambiará / huele
CL-657   media    él es el [peligro] ,                      | vida / viejas / acaban / *peligro
CL-667   dificil  Que iban al [grano]                       | recibido / *grano / alargue / rama
CL-671   dificil  Y el carozo del asunto es tu [temor]      | mejor / duerme / nunca / *temor
CL-1154  dificil  Estoy hasta la [pasta] !                  | *pasta / tanta / letargo / vienen
CL-1158  dificil  Dr. Saturno, dame un [turno] !            | pases / *turno / licor / marita
```

## Lo que les queda

1. **`contenido`: mirar la tabla de arriba con tu vara.** Las más plausibles son `licor` en
   `CL-1158` ("dame un licor", Difícil y sin contexto) y `patéticos` en `CL-537`. A mí me parecen
   buenas: el que se sabe el tema no duda. La decisión es tuya.
2. **`contenido`: la ortografía que el script no inventa.** `CL-601` tiene la **respuesta** sin
   tilde (*volteo* por *volteó*), porque así está en la transcripción. Y el contexto de `CL-407` dice
   "Un dia el bote volco". Si se corrige la letra en el cancionero, el ítem se corrige solo; como
   la ingesta pisaría un arreglo a mano, va como errata en `scripts/ingerir-cancionero.mjs`
   (`ERRATAS`, donde ya está la de "para ,l mi viejo").
3. **`arquitectura`: el contrato y la práctica no dicen lo mismo, y no es de hoy.** `CTR-04.8`
   decide que *"los tres distractores los escribe `contenido`, uno por uno… No los genera el
   motor"*. En disco los genera el script. Lo que hice mejora lo que hay, no resuelve esa
   diferencia. Si manda el contrato, los 21 `listo` necesitan distractores escritos a mano. Si
   manda la práctica, conviene que `CTR-04.8` diga que el generador los saca, con qué filtros y
   con qué semilla.
4. **Las trampas de los distractores también pueden caer en la respuesta.** Una respuesta en
   mayúscula sostenida o cortada por un guion daría un hueco roto. Hoy ningún `listo` la tiene, y
   no lo toqué para no mover más ids.

## Verificación

```bash
npm run generar-letra                       # 21 listo, "Piso de US-03 cumplido", en espera vacía
node --test src/lib/letra/*.test.ts         # distractores.test.ts incluido
```
