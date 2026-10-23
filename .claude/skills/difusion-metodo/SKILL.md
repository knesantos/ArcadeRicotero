---
name: difusion-metodo
description: Método para escribir posteos DIF-XX de Instagram y X en el calendario de RicotaArcade, con texto por red, pieza y enlace al sitio. Usar cuando el rol difusion tenga que llenar la semana de publicaciones o contar en las redes algo nuevo del sitio.
argument-hint: [qué hay que contar o qué semana llenar]
---

<objetivo>
Dejar en `Docs/DIFUSION/calendario.json` posteos en `borrador` que el usuario pueda aprobar
de un vistazo y que el hilo principal pueda mandar a la cola sin tocar una coma.
</objetivo>

<contexto>
Leé antes de empezar:
- `Docs/DIFUSION/DIF-02-linea-editorial.md` — qué se publica, cada cuánto y a qué hora.
- `Docs/DIFUSION/calendario.json` — lo que ya salió y lo que está en cola, para no repetir.
- `ESTADO.md`, arriba de todo — lo último que se construyó es la noticia.
- `.claude/rules/voz-ricotera.md` — rige entera.
- `src/lib/difusion/calendario.ts` — la forma de un posteo y lo que se valida a máquina.
</contexto>

<procedimiento>
1. Elegí qué contar: un juego, una pieza nueva del sitio, una pregunta del quiz (sin la
   respuesta), una bestia del bestiario, una efeméride **con ficha `RES-`**.
2. Tomá el número siguiente: el `DIF-` más alto del calendario más uno. Del 01 al 09 son las
   hojas; los posteos arrancan en `DIF-10`.
3. Fecha: los días y la hora de `DIF-02`, con zona `-03:00`, nunca en el pasado.
4. Escribí la pieza: `disco` (el de la sección que se cuenta, `D-19`), `titulo` que canta
   (≤ 8 palabras), `bajada` que nombra (qué es, dónde se juega). Si va imagen, una ruta de
   `public/` que exista (`tapas/oktubre.jpg`, `bestiario/...`).
5. Texto de X: ≤ 280 caracteres (el enlace cuenta 23), sin hashtags, **con** el enlace.
6. Texto de Instagram: la misma idea con más aire, el enlace **no** (no se toca): "El
   enlace está en la bio". Hasta tres hashtags, al final.
7. `alt`: qué se ve en la imagen, para quien no la ve.
8. Si el posteo afirma un dato de la banda, `fuentes` con la ficha `RES-`.
9. Estado `borrador`. No lo apruebes vos.
</procedimiento>

<criterios_de_calidad>
- Tapá la primera línea: si igual se entiende qué hay del otro lado del enlace, está bien.
- Ningún posteo promete algo que el sitio no hace. Mirá el juego antes de describirlo
  (su `copy.ts` en `src/lib/<juego>/`): lo que dice la pantalla 0 es la descripción buena.
- Un número que cambia con los datos (cuántas preguntas, cuántos temas) no se escribe.
- Sin emoji, sin signos de exclamación, sin *los fans*, sin fórmulas de folleto.
</criterios_de_calidad>

<validacion>
No corrés nada (`D-12`). Dejá escrito para el hilo principal:

```
npm run redes -- validar
node --test src/lib/voz.test.ts src/lib/difusion/calendario.test.ts
```
</validacion>

<entregable>
Los posteos en el calendario, y en el chat el reporte del agente `difusion`: id, fecha,
redes y primera línea de cada uno, y qué falta.
</entregable>
