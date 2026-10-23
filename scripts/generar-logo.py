"""
El logo del Fichín Ricotero: la FR coronada, en la letra de Patricio Rey (`D-82`).

    python scripts/generar-logo.py

Escribe en `public/marca/`:

  · fr.svg                — la marca: la corona y la FR, a color, para apoyar sobre la tinta
  · fichin-ricotero.svg   — la marca con FICHÍN RICOTERO abajo, como PATRICIO REY en el original
  · fr-redondo.svg        — la marca adentro del disco de tinta: avatar, favicon, sello de esquina
  · fr-tinta.svg          — la marca a una tinta (`--fondo`), para apoyar sobre el papel
  · fr-papel.svg          — la marca a una tinta (`--papel`), para apoyar sobre una tapa o un color

**Es un homenaje al PR coronado, no una copia.** La composición sigue el logo de la banda —la
letra grande que baja a la izquierda, la R más chica y más alta a la derecha, apenas
tocándose, y la corona torcida arriba con sus joyas y su ala vista desde abajo—, calcada sobre
la referencia que trae la fuente (`RES-42`, `Docs/INVESTIGACION/Tipografia/Patricio-Rey-Regular.zip`).
Pero la F reemplaza a la P y la corona está dibujada acá, trazo por trazo; la banda no firma
nada del sitio.

**Las letras salen de la fuente**: son los glifos de `public/fuentes/patricio-rey.woff` pasados
a trazo, girados y escalados hasta calzar en el lugar de la P y la R del original. **Los
colores salen de `tokens.css`**, como en `generar-marca-social.mjs`.

Las coordenadas son las de la referencia (2000 × 1600): así se puede volver a calcar encima.
"""
import re
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont

RAIZ = Path(__file__).resolve().parent.parent
TOKENS = (RAIZ / 'src/styles/tokens.css').read_text(encoding='utf-8')
SALIDA = RAIZ / 'public/marca'


def token(nombre: str) -> str:
    hallado = re.search(rf'{nombre}\s*:\s*(#[0-9a-fA-F]{{6}})', TOKENS)
    if not hallado:
        raise SystemExit(f'tokens.css no declara {nombre} como hex')
    return hallado.group(1).lower()


ROJO = token('--marca-rojo')
TINTA = token('--fondo')
PAPEL = token('--papel')
CANTO = token('--papel-borde')

fuente = TTFont(RAIZ / 'public/fuentes/patricio-rey.woff')
glifos = fuente.getGlyphSet()
mapa = fuente.getBestCmap()


def glifo(letra: str) -> tuple[str, float]:
    nombre = mapa[ord(letra)]
    trazo = SVGPathPen(glifos)
    glifos[nombre].draw(trazo)
    return trazo.getCommands(), glifos[nombre].width


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


def corona(cuerpo: str, cara: str, detalle: str) -> str:
    """La corona torcida, vista un poco desde abajo: cuatro puntas de llama, tres joyas, dos
    perlas y el ala ovalada con el adentro oscuro y sus rayas."""
    return f'''<g transform="translate(590,100)">
<path fill="{cuerpo}" d="M5,252 L125,168 L190,195 C175,130 180,60 215,50 C250,45 300,110 330,140 L370,62 L425,122 C450,80 480,20 515,10 C510,70 512,140 518,200 L525,270 L180,420 C120,370 60,300 5,252 Z"/>
<path fill="{cara}" d="M5,252 L125,168 L150,200 L120,330 C80,310 40,280 5,252 Z"/>
<ellipse cx="355" cy="375" rx="198" ry="66" transform="rotate(-22 355 375)" fill="{cuerpo}" stroke="{detalle}" stroke-width="6"/>
<ellipse cx="358" cy="378" rx="172" ry="46" transform="rotate(-22 358 378)" fill="{detalle}"/>
<g fill="none" stroke="{cuerpo}" stroke-width="7" stroke-linecap="round" transform="rotate(-22 358 378)">
<path d="M230,380 C280,392 340,394 400,388"/><path d="M215,365 C270,376 330,380 380,372"/><path d="M245,395 C300,404 350,404 420,398"/><path d="M300,360 L320,350"/>
</g>
<circle cx="170" cy="318" r="14" fill="{detalle}"/><circle cx="290" cy="250" r="14" fill="{detalle}"/><circle cx="415" cy="203" r="14" fill="{detalle}"/>
<circle cx="512" cy="198" r="14" fill="{cuerpo}" stroke="{detalle}" stroke-width="5"/>
<circle cx="112" cy="362" r="12" fill="{cuerpo}" stroke="{detalle}" stroke-width="4"/>
</g>'''


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


def marca(letras: str, cuerpo: str, cara: str, detalle: str) -> str:
    return corona(cuerpo, cara, detalle) + letra('F', letras) + letra('R', letras)


def svg(caja: tuple[int, int, int, int], cuerpo: str) -> str:
    x, y, w, h = caja
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x} {y} {w} {h}" role="img" '
            f'aria-label="Fichín Ricotero"><title>Fichín Ricotero</title>\n{cuerpo}\n</svg>\n')


ISOTIPO = (370, 70, 1290, 1170)
COMPLETO = (240, 70, 1540, 1450)


def main() -> None:
    SALIDA.mkdir(parents=True, exist_ok=True)
    color = marca(ROJO, PAPEL, CANTO, TINTA)
    salidas = {
        'fr.svg': svg(ISOTIPO, color),
        'fichin-ricotero.svg': svg(COMPLETO, color + nombre(ROJO)),
        # A una tinta: los detalles de la corona se recortan con la tinta de donde va a apoyar.
        'fr-tinta.svg': svg(ISOTIPO, marca(TINTA, TINTA, TINTA, PAPEL)),
        'fr-papel.svg': svg(ISOTIPO, marca(PAPEL, PAPEL, PAPEL, TINTA)),
        # El disco de tinta, como el del original: la marca entra entera en el círculo.
        'fr-redondo.svg': svg((300, -50, 1400, 1400),
                              f'<circle cx="1000" cy="650" r="700" fill="{TINTA}"/>'
                              f'<g transform="translate(1000 650) scale(0.76) translate(-1015 -655)">{color}</g>'),
    }
    for archivo, texto in salidas.items():
        (SALIDA / archivo).write_text(texto, encoding='utf-8')
        print(f'  public/marca/{archivo}')


if __name__ == '__main__':
    main()
