# INV-141 — lacuerda.net como segunda fuente de letra, y el cotejo que la red no dejó hacer

> 2026-10-01. Pedido del hilo principal: cruzar 437 versos de "Completá la letra" (77 temas,
> hasta seis por tema) contra una segunda transcripción **independiente**, para que suban a
> `cotejo: dos-fuentes` (`CTR-04.6`) — que es exactamente lo que `D-25` dice que la revierte.
> cifraclub (`RES-49`) y letras.com (`RES-23`) no sirven entre sí: son del mismo dueño, Studio
> Sol (`INV-23`). La candidata fue lacuerda.net, que el cancionero ya usa para 21 temas y que
> nunca se fichó.
>
> **Escrita por `investigador` (cuatro instancias en paralelo); pegada por el hilo principal.**

## Lo que pasó: la red de este entorno bloquea el sitio

Las cuatro instancias recibieron lo mismo al primer pedido:

```
WebFetch https://acordes.lacuerda.net/patricio_rey/
-> {"error_type":"EGRESS_BLOCKED","domain":"acordes.lacuerda.net",
    "message":"Access to acordes.lacuerda.net is blocked by the network egress proxy."}
```

Una de ellas probó además `lacuerda.net`, `es.wikipedia.org`, `pt.wikipedia.org`,
`www.studiosol.com.br`, `www.cifraclub.com.br` y otros: todos bloqueados. El 2026-08-24 `RES-49`
sí había abierto `cifraclub.com.br`, así que la política del entorno cambió desde entonces.
Ninguna instancia rodeó el bloqueo (espejos, cachés, fragmentos de buscador): un `coincide`
armado con un resumen de buscador le marcaría error al que se sabe el tema.

**Para hacerlo:** habilitar `acordes.lacuerda.net` y `lacuerda.net` en el acceso de red del
entorno (configuración del entorno en la nube → Network access) y volver a correr el cotejo.
Los cuatro lotes quedaron armados por el hilo principal y se regeneran desde `letra.json`.

## RES-141 — lacuerda.net: dueño distinto de Studio Sol según indicios; **PROVISIONAL**

Ningún dato sale de una página abierta: todo viene de resúmenes de `WebSearch` del
2026-10-01. **No se suma a `FICHA_POR_SITIO` hasta abrir las páginas primarias.**

- **Cómo se carga:** comunidad semiabierta; colaboradores registrados envían
  transcripciones, cada una "una versión personal", con puntuación y reportes de error
  (https://lacuerda.net/Recursos/informacion/?page=2, https://lacuerda.net/Evolucion/colabora.php).
  Puede haber varias versiones por tema (URLs tipo `<tema>-6.shtml`; inferido).
- **Dueño:** el Aviso Legal (https://lacuerda.net/Extras/legal.php) la atribuye a **NARROI
  WEBS SC**, empresa mexicana, copyright desde 2000 a nombre de Roberto Ochoa; lo corroboran
  las tiendas de apps (https://apps.apple.com/us/developer/narroi-webs-sc/id406136984,
  paquete `com.narroi.acordes`). WHOIS con privacidad.
- **Relación con Studio Sol:** el aviso legal de cifraclub lista sus propiedades y lacuerda no
  figura; no apareció ninguna fuente que las vincule. **Ausencia en resúmenes, no constatada.**
- **Términos** (https://lacuerda.net/Extras/condiciones.php): el que sube declara autoría y
  conserva la propiedad, **libre de publicarla en otros sitios**. O sea: dueño distinto no
  garantiza texto independiente — el mismo transcriptor puede haber subido lo mismo a los dos.
- **Índice de la banda:** `https://acordes.lacuerda.net/patricio_rey/` (no se pudo abrir).

## RES-142 … RES-145 — [CANCELADO]

Reservados para el cotejo de los lotes 1 a 4 (110, 109, 109 y 109 versos). **No se
ejecutaron**: cero páginas abiertas, cero versos comparados. No se reutilizan (`Docs/IDS.md`);
el cotejo real, cuando haya red, sale con número nuevo.

## Lo que se aprovechó igual

Leyendo los lotes, sin web, los investigadores marcaron versos del banco que **no son letra**
(anotaciones de la cifra, dedicatorias, indicaciones de acordes) o que traen erratas de la
transcripción. Pasaron a `contenido` para que no entren a la selección curada de `CNT-27`:
`CL-018`, `CL-023`, `CL-045`, `CL-103`, `CL-281`, `CL-305`, `CL-321`, `CL-325`, `CL-328`,
`CL-338`, `CL-427`, `CL-445`, `CL-491`, `CL-507`, `CL-556`, `CL-581`, `CL-624`, `CL-634`,
`CL-658`, `CL-778`, `CL-784`, `CL-790`, `CL-979`, `CL-1122`, `CL-1218`, `CL-1259`, `CL-1261`.
