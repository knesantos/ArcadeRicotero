# INV-371 — Bancos de efectos de sonido que se bajan sin cuenta

> Ficha `RES-371`, para los ruidos del bestiario (`D-79`). Pedido del usuario, 2026-10-23: *"Los
> efectos de sonido van a quedar mejor si buscas una libreria con efectos ya hechos y cargados, que
> hacerlos vos"*. Lo buscó `investigador` el 2026-10-23 (subagente, con la web). Lo pasó a este archivo
> el hilo principal, porque el rol no tiene con qué escribir (`D-12`). El subagente propuso el número
> 361, pero ese mismo día otra sesión tomó del `RES-361` al `RES-370`, así que esta ficha va con el 371.
> Todas las URL se consultaron el **2026-10-23**. **No se bajó nada ni se abrió ningún zip**: los
> nombres de los archivos de adentro de los paquetes **no están verificados**.

## RES-371 — Ninguna fuente sola cubre la lista

La condición era que se baje sin cuenta y con licencia CC0. CC-BY se acepta solo con crédito; NC, nunca.

- **El candidato único más completo** es Nox Sound Design, *Essentials*, CC0. Pesa **988 MB**.
- **La combinación liviana** son tres paquetes CC0 de OpenGameArt y Kenney, de unos **150 MB** en total.

| Fuente | Licencia | Peso | Qué trae | ¿Cuenta? |
|---|---|---|---|---|
| [Nox Essentials](https://nox-sound-design.itch.io/essentials-series-sfx-nox-sound) (itch.io, pagá lo que quieras) | CC0, dice la página | 988 MB, WAV 24 bit / 48 kHz | Pasos en 13 superficies (grava, hojas, metal, barro, nieve, agua, madera, baldosa, pasto, tierra); naturaleza (fogata, río, viento, cascada, cigarras); vehículos (motor, bocinas); voces | Sin verificar. Lo común en itch.io es poder bajar sin donar |
| [OpenGameArt, *Sound Effects Pack*](https://opengameart.org/content/sound-effects-pack) (OwlishMedia) | CC0 | 142,4 MB, WAV | Pasos, agua, ambientes, golpes de metal y cerámica | No, según la página |
| [OpenGameArt, *100 CC0 SFX*](https://opengameart.org/content/100-cc0-sfx) (rubberduck) | CC0 | 2,9 MB | 5 vidrios, 3 campanas, 4 platos o cubiertos, 12 metales | No |
| [Kenney, *Impact Sounds*](https://kenney.nl/assets/impact-sounds) | CC0 | 130 archivos, sin peso listado | Pasos por material y vidrio (de memoria, sin verificar) | No: "Continuar sin donar" |
| [OpenGameArt, *Sirens and Alarm Noise*](https://opengameart.org/content/sirens-and-alarm-noise) (aquinn) | CC0 | `siren.mp3`, 661 KB | Sirena | No |
| [OpenGameArt, *Crickets ambient noise loopable*](https://opengameart.org/content/crickets-ambient-noise-loopable) (Wolfgang_) | CC0 | ~11 s en bucle | Grillos | No |
| [OpenGameArt, *cc0 sounds library*](https://opengameart.org/content/cc0-sounds-library) (ETTiNGRiNDER) | Índice de 54 paquetes CC0 | — | Cubiertos, agua que hierve en bucle, gota en bucle, cadena de cabrestante, bocina, metal; pasos en madera, piedra, hojas, grava y barro | No |

## Qué efecto sale de dónde

Los nombres de efecto son los del manifiesto `EFECTOS` de `src/lib/bestiario/sonido.ts`.

| Efecto | Candidato |
|---|---|
| `pasos-*` (los ocho suelos) | Nox, *Footsteps*: es lo único CC0 seguro que trae nieve y baldosa. Si no, Kenney, OwlishMedia o el paquete 46 de *cc0 sounds library* |
| `vidrio` | *100 CC0 SFX*, que trae 5. *Breaking bottle* de OpenGameArt es CC-BY 3.0: se puede usar con crédito |
| `gota` | Paquete 26 de *cc0 sounds library*, o el agua de OwlishMedia |
| `agua-corriendo`, `rio` | Nox, *Nature* (River) y *Iceland - Flows* |
| `fuego` | Nox, *Nature* (Campfire). El único fuego de OpenGameArt es CC-BY 4.0 |
| `viento` | Nox, *Nature* (Wind), o *Birds and Wind* de OpenGameArt (CC0) |
| `grillos` | *Crickets ambient noise loopable* |
| `campana` | *100 CC0 SFX*, que trae 3. Evitar *Church Bell*: es CC-BY-SA |
| `metal`, `cubiertos` | *100 CC0 SFX*, OwlishMedia, y los paquetes 14 y 28 de *cc0 sounds library* |
| `olla` | Paquete 23 de *cc0 sounds library* (agua que hierve, en bucle) |
| `sirena` | `siren.mp3` de aquinn |
| `cadenas` | Paquete 45 de *cc0 sounds library* (cabrestante) |
| `motor`, `bocina` | Nox, *Vehicle* |

## Lo que no apareció en CC0 sin cuenta

- **Sin candidato CC0:** cencerro, mosca, bombo, murmullo de gente, bocina de barco, estática de tele
  y rama que cruje.
- **La lechuza:** lo único que apareció es un chillido de lechuza de campanario, en CC-BY-SA 4.0. No es
  un ululato y obliga a compartir igual.
- **Freesound** pide cuenta para bajar ([su FAQ](https://freesound.org/help/faq/)). Cubriría todo lo
  que falta.
- **Pixabay** no pide crédito, pero prohíbe distribuir el audio suelto ([términos](https://pixabay.com/service/terms/)).
  No se pudo confirmar si pide cuenta para bajar.
- **BigSoundBank** dice ser CC0 o equivalente ([licencias](https://bigsoundbank.com/licenses.html)).
  Su página no aclara si se baja sin cuenta: hay que probar un archivo.
- **Sonniss** queda descartado por el peso: el paquete de 2024 son 23,5 GB y el de 2026, 7,47 GB.

Cada archivo que entre se anota en `CNT-01` con su URL, su autor y su licencia (`D-14`).
