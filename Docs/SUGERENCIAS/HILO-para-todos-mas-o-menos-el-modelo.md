# Para `producto`, `arquitectura`, `contenido` y `experiencia`: el modelo de "Más o menos"

> De: hilo principal · Fecha: 2026-09-25 · Consume: `D-48` (reescrita), `INV-93`,
> `RES-20`, `RES-90`, `src/lib/mas-o-menos/conteo.ts`, `src/lib/letra/temas.ts`
> (`leerDuraciones`, `leerDiscos`).
> **Por qué existe:** los cuatro roles escriben en paralelo sobre el mismo juego, y el hilo
> principal ya está programando el motor contra lo que dice acá. Si alguno cambia un nombre
> o un número, lo dice en su entrega y el hilo principal ajusta; lo que no se puede es que
> cada uno invente el suyo.

---

## 1. Un paso de la partida

Una **pregunta con respuesta de número** y una **referencia de la misma unidad**. El
jugador dice si la respuesta real es más o menos que la referencia (para años: antes o
después). Un toque. Se revela de golpe el número real, ✔ o ✕, y la fuente.

La referencia es de dos clases:

| Clase | Qué se ve | Cuándo |
|---|---|---|
| **número** | "¿Cuántos años tocaron juntos?" + "¿Más o menos que 12?" | siempre se puede |
| **par** | "*Jijiji* dura 5:34." + "¿*Juguetes perdidos* dura más o menos?" | solo si hay otro dato de la **misma medida** sin usar a la distancia justa |

El motor elige par la mitad de las veces que puede, y número el resto.

## 2. El dato, como lo ve el motor

```ts
type Escala = 'anio' | 'entero' | 'segundos';
type Familia = 'la-banda' | 'la-gente' | 'los-recitales' | 'los-discos' | 'lo-que-dura' | 'en-vivo' | 'las-palabras';

interface Dato {
  id: string;          // 'MM-01' (a mano) o derivado: 'dura-jijiji', 'anio-oktubre', 'temas-luzbelito', 'vivo-jijiji', 'palabra-perro'
  familia: Familia;    // para rotar: dos pasos seguidos nunca son de la misma familia (si hay otra)
  medida: string;      // la llave de los pares: solo se enfrentan datos de la misma medida
  pregunta: string;    // "¿Cuánto dura «Juguetes perdidos»?"
  sujeto?: string;     // lo que se nombra cuando el dato es la referencia de un par: "Jijiji"
  valor: number;       // la respuesta
  escala: Escala;      // cómo se aleja la referencia y cómo se escribe el número
  unidad?: [string, string]; // ['año', 'años'] — singular y plural; sin unidad en 'anio' y 'segundos'
  fuente: string;      // registro 3: "RES-20, Wikipedia de cada disco" / "Según setlist.fm, de 256 setlists cargados"
  temas?: { slug: string; titulo: string }[]; // solo las palabras: en cuáles aparece
  formas?: string[];   // solo las palabras: qué se contó
}
```

## 3. De dónde sale cada familia

| Familia | Medida | De dónde | Cuántos hay hoy | Ojo |
|---|---|---|---|---|
| `la-banda`, `la-gente`, `los-recitales` | la que declare el dato (compartida si dos datos se pueden comparar, ej. `anio-nacimiento`) | **a mano**, en `src/data/mas-o-menos.json`, cada uno con su `RES-` de `INV-100` | los que traiga `INV-100` | hecho o "según X"; nunca leyenda; nada sobre muertes |
| `los-discos` | `anio-disco` y `temas-disco` | `leerDiscos()` de `RES-20` | 10 años, 9 cantidades | *Gulp!* fuera de `temas-disco` (11 o 12); nunca "cuántos discos" |
| `lo-que-dura` | `duracion` | `leerDuraciones()` de `RES-20` | 94 | los 11 sin duración del vol. 2 no entran |
| `en-vivo` | `en-vivo` | `setlistfm.json` (`RES-90`), solo los temas de los 105 | ~100 | "figura en N setlists cargados", no "se tocó N veces" |
| `las-palabras` | `palabra` | `conteo.ts` sobre el cancionero, con las palabras de `contenido` | las que cure `contenido` | temas, no veces; formas a la vista; lista auditable |

**Las familias derivadas no se escriben a mano en el JSON.** Solo sus textos (las
plantillas de pregunta) viven en `src/lib/mas-o-menos/copy.ts`, y los escribe `contenido`.

## 4. El dato a mano, en `src/data/mas-o-menos.json`

```json
{
  "contrato": "CTR-20",
  "contratoVersion": 1,
  "actualizado": "2026-09-25",
  "datos": [
    {
      "id": "MM-01",
      "familia": "la-banda",
      "medida": "MM-01",
      "pregunta": "¿Cuántos años tocaron juntos?",
      "valor": 25,
      "escala": "entero",
      "unidad": ["año", "años"],
      "firmeza": "hecho",
      "fuente": "RES-101",
      "estado": "listo"
    },
    {
      "id": "MM-02",
      "familia": "la-gente",
      "medida": "anio-nacimiento",
      "pregunta": "¿En qué año nació Skay Beilinson?",
      "sujeto": "Skay Beilinson",
      "valor": 0,
      "escala": "anio",
      "firmeza": "hecho",
      "fuente": "RES-1xx",
      "estado": "borrador",
      "notaInterna": "ejemplo de forma: el número y la ficha los trae INV-100"
    }
  ],
  "palabras": [
    { "id": "MP-01", "palabra": "perro", "formas": ["perro", "perros"], "estado": "listo" }
  ]
}
```

- `firmeza`: `hecho` o `segun`. Si es `segun`, va `segun` con el nombre de quien lo dijo
  ("Clarín") y la pantalla lo muestra así.
- `medida`: si nadie más la comparte, es el propio `id` (el dato nunca va en par).
- `sujeto`: obligatorio si la medida la comparten dos o más datos.
- Los valores de ejemplo de arriba **no son datos**: los números los trae `INV-100`.
- Las palabras mantienen todo lo de la tabla de
  `HILO-para-contenido-mas-o-menos-las-palabras.md` (formas, `noCuentan`, ≥ 2 temas, nada de
  taller). Alcanzan **15 a 25** bien elegidas: ahora son una familia entre siete.

## 5. La referencia número: cómo se aleja según la racha

Cuatro escalones de racha: **0–2 · 3–5 · 6–9 · 10+**.

| Escala | 0–2 | 3–5 | 6–9 | 10+ | Redondeo |
|---|---|---|---|---|---|
| `anio` | 8 a 12 años | 4 a 6 | 2 a 3 | 1 | entero |
| `segundos` | 120 a 180 s | 60 a 90 | 30 a 45 | 10 a 20 | a 5 s, y nunca menos de 10 s |
| `entero` | ×/÷ 2,5 a 3,5 | ×/÷ 1,7 a 2 | ×/÷ 1,3 a 1,5 | ×/÷ 1,1 a 1,2 (al menos ±1) | < 20 entero · < 200 a 5 · < 2000 a 50 · si no, dos cifras significativas |

El lado (más o menos) se sortea. **La referencia nunca es igual a la respuesta, nunca es
menor que 1 en `entero`, y en `anio` nunca pasa de 2026.** Si el redondeo la hace caer
sobre la respuesta, se corre un paso para su lado.

## 6. El par: a qué distancia

El mismo escalón, medido entre los dos valores: `anio` ≥ 8 / 4 / 2 / 1 años; `segundos` ≥
120 / 60 / 30 / 10 s; `entero` cociente ≥ 2,5 / 1,7 / 1,3 / cualquiera distinto. Si ningún
dato de la misma medida cumple, el paso va con número.

## 7. La partida

- Un error corta. Puntaje = racha. Mejor racha en `localStorage`, clave
  `arcade.mas-o-menos.mejor`.
- La familia rota: nunca dos seguidas iguales si hay otra con datos. Cada familia con datos
  tiene la misma chance.
- Un dato usado (como pregunta o como referencia de un par) no vuelve en la partida.
- Si se acaban los datos, ganaste.
- Tramos del encabezado del resultado: **bajo 0–2, medio 3–7, alto 8+**.
- Compartir: `ADR-02` forma `marcador`, `g=mas-o-menos`, `p` la racha, `t` la cantidad de
  datos del pozo.

## 8. Lo que ve el que perdió

La pregunta que lo cortó, con la respuesta real, la referencia que tenía y la fuente. Si
era una palabra: las formas contadas y la lista de temas, cada uno enlazado a su letra en
`/letras-y-acordes/<slug>/`.
