# Los recortes, tal como llegaron

Acá viven los **másteres** de los recortes que recorta el usuario: el archivo grande, sin
tocar, antes de que `scripts/optimizar-arte.mjs` lo ajuste al hueco en que se dibuja.

Están afuera de `public/` a propósito, y es la misma regla que ya cumplen las tapas
(`Docs/INVESTIGACION/TapasDiscos/`): **al sitio sólo llega la versión chica**. Un máster de
320 px que nadie referencia igual viaja al deploy si está en `public/`, y son 400 KB que
nadie baja a propósito.

| Máster | Llegó el | Se convirtió en | Dónde se ve |
|---|---|---|---|
| `cordero-recortado.png` | 2026-09-02 | `public/arte/cordero-rulo.png` (252 px) | Ficha de *Cordero atado* en la Redondopedia |
| `luz-belito-recortado.png` | 2026-09-02 | `public/arte/luzbelito-vela.png` (252 px) | Ficha de *Luzbelito* |
| `momo-recortado.png` | 2026-09-02 | `public/arte/momo-medallon.png` (252 px) | Ficha de *Momo Sampler* |
| `esclavo-encadenado.png` | 2026-10-24 | `esclavo-encadenado-silueta.png` (`scripts/preparar-encadenado.mjs`), que la imprenta del bestiario corta en las siete piezas `public/bestiario/encadenado-*.webp` (`D-73`, 21) | El esclavo encadenado, en la prisión del bestiario |

Los tres llegaron a `public/tapas/recortes/`, que era una carpeta nueva, con nombres que el
código no buscaba. El despiece que fija los nombres es `public/arte/README.md`; ahí está
qué pieza va en qué hueco y de qué tapa sale cada una.

**Para volver a correr el ajuste**: copiar el máster a `public/arte/` con el nombre del
despiece y correr

```
node scripts/optimizar-arte.mjs
```
