# Cómo se baja el sitio

> Esto existe por `D-14`. La postura del proyecto es que **el riesgo se asume y si llega un
> reclamo se baja**, y eso solo es honesto si bajarlo cuesta un minuto de verdad. Si estás
> leyendo esto porque alguien reclamó, andá directo a la sección 1 y después leé el resto.

---

## 1. Bajarlo ya

**La vía más rápida, y no requiere nada instalado:** entrar al panel de Vercel, abrir el
proyecto, y en *Settings → General* usar **Delete Project**. El sitio deja de responder al
instante.

Si preferís no borrarlo y solo sacarlo de circulación, en *Settings → Deployment Protection*
podés dejarlo detrás de una contraseña. Sigue existiendo pero no lo ve nadie.

Desde la terminal, con la CLI ya autenticada:

```bash
npx vercel remove arcade-ricotero --yes
```

El proyecto de Vercel conserva el nombre de cuando el sitio se llamaba Arcade Ricotero
(`D-60`): por eso el comando dice `arcade-ricotero`. Borrarlo baja todas las direcciones del
proyecto a la vez: `arcade-ricotero.vercel.app` y, una vez conectado, el dominio propio
**fichinricotero.com.ar**. El dominio sigue registrado en NIC Argentina y no muestra nada
mientras no apunte a ningún proyecto; no hace falta darlo de baja para bajar el sitio.

**Lo que NO hace falta hacer, y conviene decirlo para que nadie pierda tiempo:** no hay que
tocar el repositorio de GitHub, ni borrar archivos, ni revertir commits. El sitio publicado
y el código son dos cosas distintas: bajar el primero no toca el segundo. Si además querés
que el código deje de ser público, en GitHub es *Settings → Change visibility → Private*.

---

## 2. Si el reclamo es sobre una sola cosa

No siempre hace falta bajar todo. Según qué sea:

| Si el reclamo es sobre… | Se saca así |
|---|---|
| **Un tema alojado en mp3** | **Es lo primero que hay que mirar, porque es lo de mayor exposición del sitio.** `D-22` (2026-08-22) sacó "alojar los temas completos" de fuera de alcance: el sitio sirve los temas enteros. Sacar el archivo de `public/audio/` y el ítem que lo usa. Si el reclamo es sobre el catálogo y no sobre un tema, se vacía la carpeta entera: el resto del sitio sigue funcionando sin ella |
| Una tapa puntual | Sacar el archivo de `public/tapas/` y su fila de `scripts/generar-tapas.mjs`. Si es una tapa que usa un ítem de "adivinar la tapa", sacar también ese ítem de `src/data/tapa.json` — el banco no carga si apunta a una imagen que no está |
| Un verso o una letra | Sacar los ítems de `src/data/letra.json` y las preguntas de categoría `letras` de `src/data/quiz.json` |
| Un artículo de la Redondopedia | Sacarlo de `src/data/redondopedia.json`. **Ojo:** `npm test` va a fallar si otro artículo lo enlazaba (`BR-09`, sin callejones) — el test te dice cuál, y hay que sacar ese enlace también |
| Una pregunta del quiz | Cambiar su `estado` a `"retirado"` en `src/data/quiz.json`. No hace falta borrarla: se retira y no llega al jugador |

Después de cualquiera de esas: `npm test`, `npm run build`, y volver a desplegar.

---

## 3. Qué hay publicado, para poder responder rápido

Quien pregunte va a querer saber qué se está usando y de dónde salió. Eso está mapeado, no
hay que reconstruirlo:

- **`Docs/CONTENIDO/CNT-01-nota-derechos.md`** es el mapa. Desde `D-14` dejó de ser un
  cerrojo y pasa a ser exactamente esto: qué se usa, de dónde vino, y con qué crédito.
- **`Docs/INVESTIGACION/INV-44-tapas-coveralia.md`** (`RES-44`) tiene las 35 imágenes de
  tapas una por una, con su edición auditada.
- El **crédito a Rocambole (Ricardo Cohen)** viaja en cada pantalla que muestre una tapa:
  en el pie del sitio, nombrando los discos de esa pantalla, y pegado a la imagen en el
  juego. Es la condición 1 de `D-21` y hay tests que impiden publicar una tapa sin firma.

---

## 4. Volver a subirlo

Si el asunto se resuelve, es un comando:

```bash
npx vercel --prod
```

No se pierde nada bajándolo. Por eso la postura de `D-14` se banca: la puerta se abre y se
cierra las veces que haga falta.
