"""
El logo del Fichín Ricotero: la FR coronada, en la letra de Patricio Rey (`D-82`).

    python scripts/generar-logo.py

Escribe en `public/marca/`:

  · fr.svg                — la marca: la corona y la FR, a color, para apoyar sobre la tinta
  · fichin-ricotero.svg   — la marca con FICHÍN RICOTERO abajo, como PATRICIO REY en el original
  · fr-redondo.svg        — la marca adentro del disco de tinta: avatar, favicon, sello de esquina
  · fr-tinta.svg          — la marca a una tinta (`--fondo`), para apoyar sobre el papel
  · fr-papel.svg          — la marca a una tinta (`--papel`), para apoyar sobre una tapa o un color

**Es un homenaje al PR coronado.** La composición es la del logo de la banda —la letra grande
que baja a la izquierda, la R más chica y más alta a la derecha, apenas tocándose, y la corona
torcida arriba—, con la F en el lugar de la P. La referencia es la imagen que trae la fuente
(`RES-42`, `FOTO.png` en `Docs/INVESTIGACION/Tipografia/Patricio-Rey-Regular.zip`).

**La corona es la misma del original**: se vectoriza de esa imagen cada vez que corre esto
(contornos del blanco, con lo negro calado), así que las joyas, el filete y el adentro del ala
dejan ver el fondo. El usuario la pidió así: *"que sea la misma corona"*. Una corona dibujada a
mano, la primera versión, se veía cortada.

**Las letras salen de la fuente**: son los glifos de `public/fuentes/patricio-rey.woff` pasados
a trazo, girados y escalados hasta calzar en el lugar de la P y la R del original. **Los
colores salen de `tokens.css`**, como en `generar-marca-social.mjs`.

Las coordenadas son las de la referencia a 2000 × 1600 (dos tercios de la imagen): así se
puede volver a calcar encima. Necesita `fonttools`, `numpy`, `pillow` y `contourpy`.
"""
import io
import re
import zipfile
from pathlib import Path

import numpy as np
from contourpy import FillType, contour_generator
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont
from PIL import Image, ImageFilter

RAIZ = Path(__file__).resolve().parent.parent
TOKENS = (RAIZ / 'src/styles/tokens.css').read_text(encoding='utf-8')
SALIDA = RAIZ / 'public/marca'
REFERENCIA = RAIZ / 'Docs/INVESTIGACION/Tipografia/Patricio-Rey-Regular.zip'


def token(nombre: str) -> str:
    hallado = re.search(rf'{nombre}\s*:\s*(#[0-9a-fA-F]{{6}})', TOKENS)
    if not hallado:
        raise SystemExit(f'tokens.css no declara {nombre} como hex')
    return hallado.group(1).lower()


ROJO = token('--marca-rojo')
TINTA = token('--fondo')
PAPEL = token('--papel')

fuente = TTFont(RAIZ / 'public/fuentes/patricio-rey.woff')
glifos = fuente.getGlyphSet()
mapa = fuente.getBestCmap()


def glifo(letra: str) -> tuple[str, float]:
    nombre = mapa[ord(letra)]
    trazo = SVGPathPen(glifos)
    glifos[nombre].draw(trazo)
    return trazo.getCommands(), glifos[nombre].width


# ---------------------------------------------------------------- la corona

# La caja de la corona en la imagen original (3000 × 2400), y cuánto se suaviza el borde.
CAJA_CORONA = (870, 150, 1700, 880)
UMBRAL = 110
TOLERANCIA = 0.9  # en píxeles de la imagen: lo que se le permite a la simplificación


def simplificar(puntos: np.ndarray, tolerancia: float) -> np.ndarray:
    """Douglas-Peucker: saca los puntos que no cambian la forma más que la tolerancia."""
    if len(puntos) < 4:
        return puntos
    guardar = np.zeros(len(puntos), dtype=bool)
    guardar[0] = guardar[-1] = True
    pila = [(0, len(puntos) - 1)]
    while pila:
        i, j = pila.pop()
        a, b = puntos[i], puntos[j]
        tramo = puntos[i + 1:j]
        if not len(tramo):
            continue
        ab = b - a
        largo = np.hypot(*ab) or 1.0
        dist = np.abs(ab[0] * (tramo[:, 1] - a[1]) - ab[1] * (tramo[:, 0] - a[0])) / largo
        k = int(np.argmax(dist))
        if dist[k] > tolerancia:
            guardar[i + 1 + k] = True
            pila += [(i, i + 1 + k), (i + 1 + k, j)]
    return puntos[guardar]


def trazar_corona() -> str:
    """Los contornos del blanco de la corona del original, en coordenadas de la referencia."""
    with zipfile.ZipFile(REFERENCIA) as z:
        imagen = Image.open(io.BytesIO(z.read('FOTO.png'))).convert('L')
    x0, y0, x1, y1 = CAJA_CORONA
    gris = np.asarray(imagen.crop(CAJA_CORONA).filter(ImageFilter.GaussianBlur(1.2)), dtype=float)
    polis, codigos = contour_generator(z=gris, fill_type=FillType.OuterCode).filled(UMBRAL, 256)
    trazo = []
    for pts, cods in zip(polis, codigos):
        # Cada polígono trae su borde de afuera y sus agujeros: se parte en anillos.
        inicios = list(np.flatnonzero(cods == 1)) + [len(pts)]
        for i, j in zip(inicios, inicios[1:]):
            # El anillo cierra repitiendo el primer punto: se parte en el punto más lejano y se
            # simplifica cada mitad, que si no Douglas-Peucker ve un tramo de largo cero.
            anillo = pts[i:j - 1] if np.allclose(pts[i], pts[j - 1]) else pts[i:j]
            if len(anillo) < 3:
                continue
            k = int(np.argmax(np.hypot(*(anillo - anillo[0]).T)))
            anillo = np.vstack([simplificar(anillo[:k + 1], TOLERANCIA)[:-1],
                                simplificar(np.vstack([anillo[k:], anillo[:1]]), TOLERANCIA)[:-1]])
            if len(anillo) < 3:
                continue
            xy = [f'{(x + x0) / 1.5:.1f},{(y + y0) / 1.5:.1f}' for x, y in anillo]
            trazo.append('M' + 'L'.join(xy) + 'Z')
    return ''.join(trazo)


CORONA = trazar_corona()


def corona(tinta: str) -> str:
    return f'<path fill="{tinta}" fill-rule="evenodd" d="{CORONA}"/>'


# ---------------------------------------------------------------- las letras

# Dónde cae cada letra: centro en la referencia, escala y giro. El centro del glifo es el de
# su caja en la fuente (y para arriba). Calcado sobre la P y la R del PR coronado.
LETRAS = {
    'F': {'centro': (735, 895), 'escala': 0.95, 'giro': 13, 'glifo': (366, 233)},
    'R': {'centro': (1345, 795), 'escala': 0.86, 'giro': -1, 'glifo': (405, 227)},
}


def letra(c: str, tinta: str) -> str:
    d, _ = glifo(c)
    l = LETRAS[c]
    (cx, cy), s, giro, (gx, gy) = l['centro'], l['escala'], l['giro'], l['glifo']
    return (f'<g transform="translate({cx},{cy}) rotate({giro}) scale({s},{-s}) translate({-gx},{-gy})">'
            f'<path d="{d}" fill="{tinta}"/></g>')


def nombre(tinta: str) -> str:
    """FICHÍN RICOTERO en una línea, debajo, como PATRICIO REY en el original."""
    partes, cursor = [], 0.0
    for c in 'FICHÍN RICOTERO':
        if c == ' ':
            cursor += 300
            continue
        d, avance = glifo(c)
        partes.append(f'<path transform="translate({cursor:.0f},0)" d="{d}"/>')
        cursor += avance - 40
    ancho = 1460
    s = ancho / cursor
    return (f'<g transform="translate({1010 - ancho / 2:.0f},1400) scale({s:.4f},{-s:.4f})" fill="{tinta}">'
            + ''.join(partes) + '</g>')


def marca(letras: str, cabeza: str) -> str:
    return corona(cabeza) + letra('F', letras) + letra('R', letras)


def svg(caja: tuple[int, int, int, int], cuerpo: str) -> str:
    x, y, w, h = caja
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x} {y} {w} {h}" role="img" '
            f'aria-label="Fichín Ricotero"><title>Fichín Ricotero</title>\n{cuerpo}\n</svg>\n')


ISOTIPO = (370, 70, 1290, 1170)
COMPLETO = (240, 70, 1540, 1450)


def main() -> None:
    SALIDA.mkdir(parents=True, exist_ok=True)
    # A color: las letras en el rojo de Oktubre y la corona en el papel, que es el blanco de la marca.
    color = marca(ROJO, PAPEL)
    salidas = {
        'fr.svg': svg(ISOTIPO, color),
        'fichin-ricotero.svg': svg(COMPLETO, color + nombre(ROJO)),
        'fr-tinta.svg': svg(ISOTIPO, marca(TINTA, TINTA)),
        'fr-papel.svg': svg(ISOTIPO, marca(PAPEL, PAPEL)),
        # El disco de tinta, como el del original: la marca entra entera en el círculo.
        'fr-redondo.svg': svg((300, -50, 1400, 1400),
                              f'<circle cx="1000" cy="650" r="700" fill="{TINTA}"/>'
                              f'<g transform="translate(1000 650) scale(0.76) translate(-1015 -655)">{color}</g>'),
    }
    for archivo, texto in salidas.items():
        (SALIDA / archivo).write_text(texto, encoding='utf-8')
        print(f'  public/marca/{archivo}  {len(texto.encode()) // 1024} KB')


if __name__ == '__main__':
    main()
