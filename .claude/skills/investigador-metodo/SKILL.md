---
name: investigador-metodo
description: Método para producir fichas RES-XX con hallazgo, URL y fecha, o rotular explícitamente una leyenda ricotera. Usar cuando el rol investigador reciba una pregunta puntual de otro rol sobre discografía, cronología, derechos o APIs de terceros.
argument-hint: [pregunta puntual a investigar]
---

<objetivo>
Traer un hecho verificable con su fuente, o declarar con todas las letras que lo que
circula es una leyenda. Las dos salidas son válidas; lo que no es válido es afirmar algo
sin ninguna de las dos.
</objetivo>

<contexto>
Leé antes de empezar:
- `Docs/BRIEF.md` — el riesgo de mitología repetida como hecho, y la regla de veracidad.
- `Docs/INVESTIGACION/` — fichas ya escritas, para no repetir búsquedas.
- La pregunta puntual que te delegó el rol que la necesita: no investigues en general.
</contexto>

<procedimiento>
1. Reformulá la pregunta como algo verificable: no "¿es cierto que tocaron en Huracán en
   el 89?" sino "¿qué fecha y qué fuente confirman el recital de Huracán del 89?".
2. Buscá con `WebSearch` / `WebFetch`. Preferí fuentes primarias o especializadas por
   sobre foros y redes sociales.
3. Si encontrás confirmación con fuente confiable: registrá el hallazgo, la URL exacta y
   la fecha de consulta (no la fecha del hecho, además de esa).
4. Si lo que encontrás son versiones contradictorias o sin fuente confiable: no elijas
   una al azar. Rotulalo explícitamente como **leyenda** y anotá qué versiones circulan.
   Una leyenda rotulada es contenido válido para el quiz; una leyenda sin rotular es un
   error.
5. Si la pregunta es sobre una API de terceros (Spotify), fechá la verificación: estas
   cosas cambian, y una ficha vieja es peor que ninguna ficha.
</procedimiento>

<criterios_de_calidad>
- Toda ficha tiene URL y fecha de consulta, o la marca explícita "no verificado".
- Ninguna ficha mezcla opinión con hallazgo: lo que dice la fuente va aparte de lo que
  vos interpretás de ella.
- Una ficha responde exactamente la pregunta que te hicieron, ni más ni menos.

Transversales a todo el proyecto:
- Cada afirmación tiene fundamento: un ID de otro rol, una fuente con fecha, o la marca
  explícita *supuesto*.
- Nada de relleno. Si una sección no aporta una decisión, se borra.
- Escribí para el vos de dentro de tres meses, que no se acuerda de nada.
</criterios_de_calidad>

<validacion>
Si dos fuentes independientes no confirman el mismo dato, no es un hecho: es, como
mucho, una leyenda con buena prensa. Rotulala como tal.

Y siempre: ningún placeholder sin resolver, ningún ID referenciado que no exista.
</validacion>

<entregable>
Como sos read-only, no escribís el archivo: devolvés la ficha `RES-XX` completa, lista
para pegar en `Docs/INVESTIGACION/`, en tu mensaje de reporte.

Al terminar, reportá en el chat, en máximo 10 líneas: la ficha completa, y qué rol la
necesita ahora.
</entregable>
