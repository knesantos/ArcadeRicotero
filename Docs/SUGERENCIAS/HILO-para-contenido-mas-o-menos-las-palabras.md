# Para `contenido`: las palabras de "Más o menos" (`US-10`), medidas

> De: hilo principal · Fecha: 2026-09-25 · Consume: `D-48`, `IDEA-11`,
> `src/lib/mas-o-menos/conteo.ts`, `src/data/cancionero.json` (100 temas con letra).
> Para: `CNT-25`. **Desde la reescritura de `D-48` las palabras son una familia entre siete**:
> alcanzan 15 a 25 bien elegidas (`HILO-para-todos-mas-o-menos-el-modelo.md`).

## Qué es esta tabla

Cada fila es una **forma escrita** tal como aparece en la letra que el cancionero del sitio
muestra, con **en cuántos temas aparece** (la regla de `D-48`, punto 4, familia "las palabras"). La corrió el hilo
principal con la función que va a usar el juego (`armarCorpus` + `temasDe`), así que el
número de la segunda columna es el que el juego va a mostrar si elegís esa forma sola.

- **temas**: en cuántos temas aparece esa forma exacta.
- **plural en el corpus**: formas `+s` / `+es` que también existen.
- **variantes de tilde**: formas que sin tildes se escriben igual. **Cada una la tenés que
  clasificar** en el dato: cuenta (es la misma palabra mal tipeada, *corazon*) o no cuenta
  (es otra palabra: *esta* / *está*). Si no la clasificás, el test falla. Los homónimos que
  se escriben igual (*vino*) son otro problema, y está abajo.
- **con todo**: en cuántos temas aparece sumando la forma, sus plurales y sus variantes.
  Es el número si declarás todas esas formas juntas.

## Lo que la tabla no filtra y vos sí

1. **Vocabulario de taller.** Todavía se cuelan palabras que son del transcriptor y no de la
   canción: *primera*, *tercera*, *cuarta*, *intermedio*, *fill*, *repite*, *toca*, *par*,
   *letra*, *tema*, *man*, *com*. Ninguna puede ser palabra del juego. El test ya prohíbe
   la jerga de guitarra de `anotacion.ts`; lo demás es tu ojo.
2. **Homónimos.** *sol* puede ser el astro o el acorde escrito en castellano; *vino* es
   bebida o verbo; *mal* es sustantivo y adverbio. **Si una palabra tiene dos
   sentidos, el número cuenta los dos**, y el jugador piensa en uno. Descartala o elegila
   sabiendo. Para mirar dónde aparece: `Grep` sobre `src/data/cancionero.json`.
3. **Los temas con letra rota.** *La bestia pop* y *Criminal mambo* tienen letra a medias o
   con basura (`ESTADO.md`, "lo barato que se ve"). Una palabra que solo suma por esos dos
   es sospechosa.
4. **La regla de `D-48` punto 4**: las formas que declares se muestran al revelar. *perro,
   perros* se lee bien; *perro, perros, perra, perrito* también, si las cuatro están. Lo
   que no se puede es que el número cuente una forma que la pantalla no nombra.

## La tabla (formas con 3 temas o más)

| forma | temas | plural en el corpus | variantes de tilde | con todo |
|---|---|---|---|---|
| amor | 33 | amores | — | 34 |
| dios | 16 | — | — | 16 |
| rock | 15 | — | — | 15 |
| siempre | 15 | — | — | 15 |
| fin | 14 | — | — | 14 |
| ojos | 14 | — | — | 14 |
| corazón | 12 | — | corazon | 14 |
| mal | 12 | — | — | 12 |
| tiempo | 12 | tiempos | — | 13 |
| sol | 11 | — | — | 11 |
| suerte | 11 | — | — | 11 |
| dolor | 10 | dolores | — | 12 |
| mundo | 10 | — | — | 10 |
| par | 10 | — | — | 10 |
| primera | 10 | — | — | 10 |
| fuego | 9 | — | — | 9 |
| tercera | 9 | — | — | 9 |
| vida | 9 | — | — | 9 |
| cielo | 8 | cielos | — | 9 |
| día | 8 | días | dia | 14 |
| diablo | 8 | diablos | — | 9 |
| feliz | 8 | felices | — | 9 |
| noche | 8 | noches | — | 10 |
| cruel | 7 | crueles | — | 8 |
| linda | 7 | lindas | — | 10 |
| luz | 7 | luces | — | 8 |
| nuevo | 7 | nuevos | — | 8 |
| perro | 7 | perros | — | 8 |
| pite | 7 | — | — | 7 |
| sueño | 7 | sueños | — | 10 |
| buena | 6 | buenas | — | 9 |
| dulce | 6 | dulces | — | 8 |
| guita | 6 | — | — | 6 |
| intermedio | 6 | — | — | 6 |
| lengua | 6 | lenguas | — | 7 |
| miedo | 6 | — | — | 6 |
| nariz | 6 | narices | — | 7 |
| negro | 6 | — | — | 6 |
| vivir | 6 | — | — | 6 |
| boca | 5 | — | — | 5 |
| buen | 5 | — | — | 5 |
| estilo | 5 | — | — | 5 |
| manos | 5 | — | — | 5 |
| muerte | 5 | — | — | 5 |
| oro | 5 | — | — | 5 |
| paso | 5 | — | pasó | 6 |
| redondos | 5 | — | — | 5 |
| tipos | 5 | — | — | 5 |
| toca | 5 | — | — | 5 |
| tormenta | 5 | — | — | 5 |
| ver | 5 | — | — | 5 |
| ves | 5 | veses | — | 5 |
| vieja | 5 | viejas | — | 8 |
| vino | 5 | vinos | — | 6 |
| aguanten | 4 | — | — | 4 |
| animal | 4 | — | — | 4 |
| brillo | 4 | — | — | 4 |
| cara | 4 | caras | — | 5 |
| carne | 4 | — | — | 4 |
| cerebro | 4 | — | — | 4 |
| ciego | 4 | ciegos | — | 6 |
| ciudad | 4 | — | — | 4 |
| copa | 4 | — | — | 4 |
| corriendo | 4 | — | — | 4 |
| culo | 4 | culos | — | 6 |
| dan | 4 | — | — | 4 |
| destino | 4 | — | — | 4 |
| detrás | 4 | — | — | 4 |
| días | 4 | — | dias | 5 |
| dormir | 4 | — | — | 4 |
| especial | 4 | — | — | 4 |
| fiel | 4 | fieles | — | 5 |
| fiero | 4 | — | — | 4 |
| fill | 4 | — | — | 4 |
| flor | 4 | flores | — | 5 |
| frío | 4 | — | frio | 5 |
| gato | 4 | gatos | — | 5 |
| grito | 4 | gritos | — | 5 |
| hecho | 4 | — | — | 4 |
| infierno | 4 | — | — | 4 |
| juego | 4 | juegos | — | 4 |
| junto | 4 | — | — | 4 |
| licor | 4 | licores | — | 4 |
| loca | 4 | — | — | 4 |
| lugar | 4 | — | — | 4 |
| man | 4 | — | — | 4 |
| miel | 4 | — | — | 4 |
| milagro | 4 | — | — | 4 |
| nueva | 4 | nuevas | — | 7 |
| preso | 4 | — | — | 4 |
| promesas | 4 | — | — | 4 |
| pudo | 4 | — | — | 4 |
| pueden | 4 | — | — | 4 |
| pura | 4 | — | — | 4 |
| repite | 4 | — | — | 4 |
| risa | 4 | risas | — | 8 |
| risas | 4 | — | — | 4 |
| roll | 4 | — | — | 4 |
| ruta | 4 | — | — | 4 |
| sangre | 4 | — | — | 4 |
| silencio | 4 | — | — | 4 |
| soledad | 4 | — | — | 4 |
| sombra | 4 | — | — | 4 |
| soñar | 4 | — | — | 4 |
| tambien | 4 | — | también | 7 |
| tanta | 4 | — | — | 4 |
| tibia | 4 | — | — | 4 |
| tipo | 4 | tipos | — | 9 |
| tuvo | 4 | — | — | 4 |
| unos | 4 | — | — | 4 |
| verte | 4 | — | — | 4 |
| viejo | 4 | — | — | 4 |
| volver | 4 | — | — | 4 |
| abajo | 3 | — | — | 3 |
| alguna | 3 | — | — | 3 |
| alli | 3 | — | allí | 10 |
| amigo | 3 | amigos | — | 6 |
| amigos | 3 | — | — | 3 |
| amores | 3 | — | — | 3 |
| baila | 3 | — | — | 3 |
| banda | 3 | bandas | — | 4 |
| baño | 3 | — | — | 3 |
| barrio | 3 | — | — | 3 |
| blanco | 3 | blancos | — | 4 |
| bobo | 3 | bobos | — | 4 |
| bola | 3 | bolas | — | 4 |
| buenas | 3 | — | — | 3 |
| buenos | 3 | — | — | 3 |
| caja | 3 | — | — | 3 |
| calles | 3 | — | — | 3 |
| camino | 3 | — | — | 3 |
| campeón | 3 | — | campeon | 4 |
| canción | 3 | — | cancion | 4 |
| canta | 3 | — | — | 3 |
| caricias | 3 | — | — | 3 |
| com | 3 | — | — | 3 |
| comer | 3 | — | — | 3 |
| contra | 3 | — | — | 3 |
| cuarta | 3 | — | — | 3 |
| cuenta | 3 | — | — | 3 |
| cuerpo | 3 | — | — | 3 |
| das | 3 | — | — | 3 |
| demas | 3 | — | demás | 4 |
| dia | 3 | dias | día | 11 |
| dientes | 3 | — | — | 3 |
| esperar | 3 | — | — | 3 |
| estaba | 3 | — | — | 3 |
| están | 3 | — | estan | 4 |
| estirar | 3 | — | — | 3 |
| estos | 3 | — | — | 3 |
| falta | 3 | — | — | 3 |
| fantasma | 3 | fantasmas | — | 5 |
| favor | 3 | — | — | 3 |
| felicidad | 3 | — | — | 3 |
| fiebre | 3 | — | — | 3 |
| fuera | 3 | — | — | 3 |
| gira | 3 | — | — | 3 |
| golpe | 3 | — | — | 3 |
| gusto | 3 | — | — | 3 |
| hundido | 3 | — | — | 3 |
| juega | 3 | — | — | 3 |
| jugando | 3 | — | — | 3 |
| labios | 3 | — | — | 3 |
| lado | 3 | — | — | 3 |
| lejos | 3 | — | — | 3 |
| letra | 3 | — | — | 3 |
| limpio | 3 | — | — | 3 |
| lindas | 3 | — | — | 3 |
| llamas | 3 | — | llamás | 4 |
| llorar | 3 | — | — | 3 |
| lobo | 3 | — | — | 3 |
| loco | 3 | — | — | 3 |
| lujo | 3 | — | — | 3 |
| lunar | 3 | — | — | 3 |
| mala | 3 | malas | — | 4 |
| manzana | 3 | manzanas | — | 4 |
| maravilla | 3 | — | — | 3 |
| menú | 3 | — | — | 3 |
| mierda | 3 | — | — | 3 |
| mil | 3 | — | — | 3 |
| minutos | 3 | — | — | 3 |
| mirada | 3 | — | — | 3 |
| mojado | 3 | — | — | 3 |
| mucha | 3 | — | — | 3 |
| muerto | 3 | muertos | — | 5 |
| murga | 3 | — | — | 3 |
| nena | 3 | nenas | — | 5 |
| nene | 3 | nenes | — | 4 |
| nuevas | 3 | — | — | 3 |
| ojo | 3 | ojos | — | 17 |
| oscuridad | 3 | — | — | 3 |
| paredes | 3 | — | — | 3 |
| pasan | 3 | — | — | 3 |
| penas | 3 | — | — | 3 |
| pequeño | 3 | — | — | 3 |
| plata | 3 | — | — | 3 |
| pone | 3 | — | — | 3 |
| porno | 3 | — | — | 3 |
| prisión | 3 | — | — | 3 |
| punto | 3 | — | — | 3 |
| quiera | 3 | — | — | 3 |
| rato | 3 | — | — | 3 |
| rico | 3 | — | — | 3 |
| rio | 3 | — | rió | 4 |
| rojo | 3 | — | — | 3 |
| seca | 3 | secas | — | 4 |
| secreto | 3 | secretos | — | 4 |
| será | 3 | serás | — | 4 |
| show | 3 | — | — | 3 |
| soportar | 3 | — | — | 3 |
| sueños | 3 | — | — | 3 |
| también | 3 | — | tambien | 7 |
| tele | 3 | — | — | 3 |
| tema | 3 | — | — | 3 |
| temor | 3 | — | — | 3 |
| tener | 3 | — | — | 3 |
| tierra | 3 | — | — | 3 |
| tiro | 3 | tiros | — | 5 |
| tonto | 3 | tontos | — | 5 |
| triste | 3 | tristes | — | 5 |
| tristes | 3 | — | — | 3 |
| turco | 3 | — | — | 3 |
| veloz | 3 | veloces | — | 4 |
| veo | 3 | — | — | 3 |
| vidrio | 3 | — | — | 3 |
| viejas | 3 | — | — | 3 |
| viene | 3 | — | — | 3 |
| viento | 3 | — | — | 3 |
| zumba | 3 | — | — | 3 |

## Cómo se reproduce

```
npm run medir-mas-o-menos
```

Lo dejó el hilo principal junto con el juego; imprime cada palabra del dato con su número,
sus temas y las variantes sin clasificar. Lo corre `revisor` o el hilo principal (`D-12`).
