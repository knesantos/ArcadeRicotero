# Los sonidos del bestiario: qué se sintetiza, qué se graba y qué se baja

> Del hilo principal para `contenido` y `experiencia`, y para el usuario. 2026-10-18, con `D-76`.
> Pedido del usuario, textual: *"que se escuchen otras cosas, pasos, sonidos de los personajes,
> ruidos del entorno, que sea todo bien inmersivo. Los sonidos analiza cuales podes hacer vos bien y
> cuales conviene que grabe yo, nose la risa del gordo pier por ejemplo. Analiza tambien si genericos
> como cristales rotos, agua, gatos pasos podes bajarlos de algun lado o alguna libreria gratis"*.

## Lo que ya suena (`D-76`)

En el monte y la pastura, con el botón "Escuchá de lejos":

- **El recital de lejos.** Son los recortes del disco del entorno, pasados por un filtro que les saca
  los agudos y los graves, con un eco corto. Se van acercando a medida que se camina.
- **Los ruidos, sintetizados** (`src/scripts/bestiario/entorno.ts`). No usan ningún archivo:
  - pasos atados a lo caminado, sobre hojas en el monte y sobre pasto en la pastura;
  - viento con ráfagas;
  - grillos;
  - una lechuza que pasa cada tanto;
  - el cencerro de la vaca cubana, que suena solo y también cuando se la toca.

## La regla para decidir

| Va por | Cuándo | Por qué |
|---|---|---|
| **Síntesis** (Web Audio, cero bytes) | Ruido con forma: viento, agua, fuego, pasos, insectos, golpes de metal, campanas, zumbidos, motores lejanos | Suena bien, no pesa nada, se adapta a lo que pasa (el paso sigue al dedo) y no tiene licencia que cuidar |
| **Grabado por vos** | Voces y risas de un personaje; todo lo que tiene que sonar *a alguien* | Una voz sintetizada suena a juguete. Y la risa de un personaje es parte de quién es: tiene que ser una decisión, no un archivo de banco |
| **Banco libre (CC0)** | Animales y objetos con timbre propio: perros, gatos, balidos, mugidos, cristales, chapa, colectivo, multitud | La síntesis los hace mal y grabarlos uno por uno no tiene sentido |

## Los bancos (lo verificó `investigador`, 2026-10-18)

- **Freesound, filtrando solo CC0** (freesound.org). Es el mejor catálogo para esto: animales, pasos,
  fuego, agua, multitudes y bombo. Con CC0 no pide créditos. Hay que crearse una cuenta para bajar.
  Un sonido que solo esté en CC-BY también se puede usar, pero hay que poner una página de créditos.
  **Nunca BY-NC.**
- **Sonniss GDC Game Audio Bundle**, de segundo: calidad profesional y sin atribución. Su licencia deja
  usarlo adentro del sitio, pero no publicar los sonidos como un paquete suelto. Pesa varios GB: antes
  hay que mirar el libre de C:, y quedarse solo con los archivos que se usen.
- **Pixabay**, de repuesto. No pide créditos, pero falta leer su licencia completa para audio.
- **Evitar:**
  - BBC Sound Effects: su licencia (RemArc) es para uso personal, educativo o de investigación.
  - Zapsplat: exige crédito y sus términos no se pudieron verificar.
  - Mixkit: su licencia no se pudo leer entera y mezcla una variante no comercial.
  - Kenney: es CC0, pero no tiene animales ni ambientes.

Cada archivo que entre se anota con su URL, su autor y su licencia en la nota de derechos (`CNT-01`),
para poder contestar rápido si alguien pregunta (`D-14`). **Bajar es un paso que hace el usuario o
que aprueba, archivo por archivo**: ninguna sesión baja sonidos por su cuenta.

## Región por región

**S** = síntesis, **G** = grabalo vos, **B** = banco CC0. ✔ = ya suena.

| Región | Ambiente | Al tocar o al llegar a un personaje |
|---|---|---|
| **El monte** | ✔ S viento, grillos, lechuza, pasos en hojas, ramas que crujen, sala casi seca | **B** aullido para el lobo suelto (la síntesis lo hace de dibujito); **S** un gruñido grave sí se puede hacer |
| **La pastura** | ✔ S pasto, grillos, cencerro | ✔ S cencerro de la vaca; **B** balido para el cordero y las ovejas, mugido para la vaca; **B** ladrido para el ovejero |
| **Los techos** | ✔ S viento, pasos en chapa, la canaleta que gotea, la sirena de lejos | **B** gatos peleando (*Gatos arriba, perros abajo*); **B** ladridos lejanos; **G** el negro Atila |
| **El bajo** | ✔ S agua que corre, goteo, el chapoteo de los pasos, una botella que se rompe cada tanto | **G** **la risa del gordo Pierre** (es el ejemplo justo: tiene que ser una risa de alguien); ✔ S el vidrio al tocar a Pierre y al amorcito que mordió el vidrio (**B** si se consigue uno mejor) |
| **El infierno** | ✔ S fuego crepitando, brasas, eco de caverna | **G** Luzbelito, y las sirenas si cantan; ✔ S campanadas, también al tocar a Mandinga |
| **El templo** | ✔ S el bombo de lejos, eco largo de salón; **B** murga lejana | **G** Momo; **S** platillos y sonajas |
| **Los astilleros** | ✔ S viento, el río contra los pilotes, las olas, el metal que golpea, la bocina del ferry | **B** grúa y cadenas; ✔ S el metal al tocar al pibe; **G** los personajes que hablan |
| **Cybersiberia** | ✔ S viento helado, zumbido eléctrico, la estática de la tele | ✔ S la estática de la tele y de los buitres, la sirena de Drogocop; **S** el beep del Alien Duce; **G** su voz, si alguna vez habla |
| **El árbol** | ✔ S viento seco, grillos, crujido de ramas, la lechuza | ✔ S la rama al tocar al monito y al que duerme colgado; **G** el ángel; **S** juguetes a cuerda (un clic mecánico) |
| **La mesa** | ✔ S cubiertos, una olla que hierve, las moscas | ✔ S el zumbido de la mosca; ✔ S los cubiertos del caníbal, el verdugo y Pituca; **G** el caníbal |
| **El galpón** | ✔ S la gente que espera, eco de galpón grande; **B** multitud lejana | **G** nada: la silla de Patricio Rey va en silencio, y ese silencio es el sonido |
| **La ruta** | ✔ S el viento de la ruta, grillos, un motor que pasa | **B** el colectivo viejo y la bocina de la Pontiac; ✔ S el taxi que pasa |

**Desde el pedido de archivos (2026-10-23):** cada ruido tiene nombre en el manifiesto `EFECTOS` de
`src/lib/bestiario/sonido.ts` y busca sus variantes en `public/audio/bestiario/fx/<nombre>-<n>.mp3`
(desde el 1). Mientras `variantes` está en 0, o si el archivo no carga, suena la síntesis de la tabla.
Todas las regiones tienen además su sala (eco) y, donde corresponde, una cama de fondo. Para oírlos de
a uno: `/diagnostico-bestiario/`, que dice al lado de cada botón si sonó el archivo o la síntesis.

## Lo que hay que grabar

Hay que grabar todo lo marcado con **G**. Para que entre sin vueltas:

- **Formato:** cualquiera que el teléfono grabe (m4a, wav, mp3). Se pasa a mp3 mono de 96 kbps,
  igual que los recortes.
- **Largo:** de 1 a 4 segundos por sonido. Una risa entera no hace falta: alcanza con el arranque y
  el remate.
- **Toma:** en un lugar callado, a un palmo del micrófono, con dos o tres tomas de cada cosa. Se
  elige después.
- **Dónde dejarlos:** en una carpeta fuera del repo. Se recortan y se suben a
  `public/audio/bestiario/`, con un nombre por personaje (`pierre-el-vitricida.mp3`).

## La parte del tema que habla de cada personaje

Sigue pendiente (`T-481`). Los recortes que hay son los primeros 15 segundos de cada tema, no el verso
que nombra al personaje. Hacen falta dos cosas:

1. **El minuto de cada verso.** Lo puede traer `investigador` de letras sincronizadas de uso libre, o
   sale de escucharlo.
2. **Los temas enteros en disco:**
   `npm run generar-fragmentos -- "<carpeta con los discos>" --enteros`. Hace falta ffmpeg, que hoy no
   está en el PATH.

Con eso, un script corta 6 a 8 segundos por personaje, y el camino los hace sonar de cerca: el
recital de lejos se aparta, igual que hoy cuando suena la ficha.
