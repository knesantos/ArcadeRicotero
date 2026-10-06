"""
Le da a Lobo Suelto Fan las tildes, la Ñ y los signos que le faltan para gritar en castellano.

    python scripts/derivar-lobo-suelto.py

Lee `Docs/INVESTIGACION/Tipografia/Lobo-Suelto-Cordero-Ata-Regular.zip` (la digitalización
fan de Benjamín Zavala del alfabeto de Semilla Bucciarelli, `RES-42`: la A-Z, la Ñ y nada más)
y escribe `public/fuentes/lobo-suelto.woff`. Con una ruta de argumento escribe ahí (`.otf` sale
sin comprimir). Pide `fonttools` y `skia-pathops`, igual que `derivar-patricio-rey.py`.

**Por qué.** El usuario pidió, textual: *"vamos a seguir integrando las otras dos que no estan
en el sistema, la de lobo suelto y la otra que es medio luz belito"* (`D-67`). Con `D-19`,
mitología viste *Lobo suelto*, y su juego se llama ADIVINÁ EL TEMA: sin la Á no podía
escribirlo, y `D-17` no deja sacarle la tilde.

**Cómo, y con qué material.** Igual que el calco y la letra de la banda: lo que falta no se
dibuja de cero, se recorta y se pega de la propia letra, con operaciones booleanas reales. Acá
todo sale de la I, que en esta letra es un palo de pelo con una bocha en cada punta y un
travesaño cerca de cada bocha.

- **La tilde** es un pedazo del palo, inclinado como cae una tilde a mano, con la bocha de
  arriba de la I achicada en la punta: el mismo remate que tienen las letras.
- **El punto** es la bocha de arriba de la I, sola.
- **La coma** es el punto con un pedazo de palo que cuelga hacia la izquierda.
- **El signo de admiración** es la I sin travesaños y cortada antes de la bocha de abajo.
- **El de apertura**, ¡, es el de cierre dado vuelta, como en la imprenta.
- **La Ñ no se deriva**: Zavala la dibujó y estaba en el TTF, pero se había perdido cuando se
  recortó la `.woff` que servía el sitio. Vuelve tal cual.

**Lo que no se deriva, a propósito.** Los signos de pregunta (la letra no tiene una curva que
sirva sin inventarla, y ningún texto que use esta letra los pide), los números y la U: la U de
esta letra se dibuja como una W ("SWELTO"), y así se queda, porque es la de la tapa. Por eso
`fuentes.test.ts` vigila cada texto que va en esta letra: uno con un signo que no está falla ahí.

**El renglón.** Zavala apoyó las letras unas cien unidades por debajo de la línea de base, y
la letra que caía al repuesto saltaba de renglón. Todo sube lo que mide la mediana del pie de
las letras, y las métricas verticales se rehacen con lo que de verdad ocupa cada glifo.
"""

import io
import math
import statistics
import sys
import zipfile
from pathlib import Path

import pathops
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.cu2quPen import Cu2QuPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

RAIZ = Path(__file__).resolve().parent.parent
ORIGEN = RAIZ / 'Docs/INVESTIGACION/Tipografia/Lobo-Suelto-Cordero-Ata-Regular.zip'
DESTINO = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else RAIZ / 'public/fuentes/lobo-suelto.woff'
VERSION = 'Version 1.100; Lobo Suelto Fan con tildes y signos derivados (D-67)'

with zipfile.ZipFile(ORIGEN) as z:
    ttf = next(n for n in z.namelist() if n.lower().endswith('.ttf'))
    fuente = TTFont(io.BytesIO(z.read(ttf)))
glifos = fuente.getGlyphSet()
metricas = fuente['hmtx'].metrics
cmap_original = fuente.getBestCmap()
nombre_de = {chr(c): n for c, n in cmap_original.items()}


def camino(nombre, transformacion=(1, 0, 0, 1, 0, 0)):
    """El contorno de un glifo existente como camino de pathops, transformado."""
    p = pathops.Path()
    glifos[nombre].draw(TransformPen(p.getPen(), transformacion))
    return p


def caja(p):
    pen = BoundsPen(None)
    p.draw(pen)
    return pen.bounds


def transformar(p, t):
    q = pathops.Path()
    p.draw(TransformPen(q.getPen(), t))
    return q


def mover(p, dx, dy):
    return transformar(p, (1, 0, 0, 1, dx, dy))


def escalar(p, sx, sy, cx=0, cy=0):
    return transformar(p, (sx, 0, 0, sy, cx - sx * cx, cy - sy * cy))


def girar(p, grados, cx, cy):
    a = math.radians(grados)
    c, s = math.cos(a), math.sin(a)
    return transformar(p, (c, s, -s, c, cx - c * cx + s * cy, cy - s * cx - c * cy))


def girar_180(p, cx, cy):
    return transformar(p, (-1, 0, 0, -1, 2 * cx, 2 * cy))


def rect(x0, y0, x1, y1):
    p = pathops.Path()
    pen = p.getPen()
    pen.moveTo((x0, y0))
    pen.lineTo((x1, y0))
    pen.lineTo((x1, y1))
    pen.lineTo((x0, y1))
    pen.closePath()
    return p


def union(*caminos):
    r = caminos[0]
    for c in caminos[1:]:
        r = pathops.op(r, c, pathops.PathOp.UNION)
    return r


def corte(a, b):
    return pathops.op(a, b, pathops.PathOp.INTERSECTION)


# ---------------------------------------------------------------- el material

# La I, medida de abajo hacia arriba (unidades del original): bocha de -99 a 32, travesaño de
# 35 a 72, palo de pelo de 75 a 452 (unas 36 de ancho), travesaño de 455 a 496 y bocha de
# 497 a 598, más chica que la de abajo.
I = camino(nombre_de['I'])
ix0, iy0, ix1, iy1 = caja(I)
BOCHA_ARRIBA = corte(I, rect(ix0 - 10, 500, ix1 + 10, iy1 + 10))
BOCHA_ABAJO = corte(I, rect(ix0 - 10, iy0 - 10, ix1 + 10, 30))
PALO = corte(I, rect(ix0 - 10, 90, ix1 + 10, 440))
px0, py0, px1, py1 = caja(PALO)
CENTRO_PALO = (px0 + px1) / 2

# El pie: dónde apoyan de verdad las letras. La mediana y no el mínimo, porque las bochas y
# las colas de cada letra bajan cada una a su manera.
PIE = statistics.median(
    caja(camino(nombre_de[c]))[1] for c in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
)

# El punto: la bocha de arriba, sola, apoyada donde apoyan las letras.
bx0, by0, bx1, by1 = caja(BOCHA_ARRIBA)
PUNTO = mover(BOCHA_ARRIBA, 40 - bx0, PIE - by0)
qx0, qy0, qx1, qy1 = caja(PUNTO)

# La coma: el punto y un pedazo de palo que sale de su panza y cuelga hacia la izquierda.
cola = corte(PALO, rect(px0 - 10, 200, px1 + 10, 330))
cx0, cy0, cx1, cy1 = caja(cola)
cola = girar(cola, -24, (cx0 + cx1) / 2, cy1)
cx0, cy0, cx1, cy1 = caja(cola)
cola = mover(cola, (qx0 + qx1) / 2 - cx1 + 10, (qy0 + qy1) / 2 - cy1)
COMA = union(PUNTO, cola)

# La tilde: un pedazo de palo, inclinado, con la bocha de arriba a la mitad en la punta.
trazo = corte(PALO, rect(px0 - 10, 150, px1 + 10, 330))
tx0, ty0, tx1, ty1 = caja(trazo)
trazo = girar(trazo, -48, CENTRO_PALO, ty0)  # la punta de arriba se va a la derecha
bocha = escalar(BOCHA_ARRIBA, 0.62, 0.62)
tx0, ty0, tx1, ty1 = caja(trazo)
gx0, gy0, gx1, gy1 = caja(bocha)
bocha = mover(bocha, tx1 - (gx0 + gx1) / 2 - 8, ty1 - (gy0 + gy1) / 2 - 8)
TILDE = union(trazo, bocha)
tx0, ty0, tx1, ty1 = caja(TILDE)

# La admiración: el palo entero sin travesaños, con la bocha de arriba pegada en la punta, y la
# bocha de abajo despegada lo que mide el travesaño que se fue.
largo = corte(I, rect(px0 - 1, 75, px1 + 1, 500))
puente = mover(corte(PALO, rect(px0 - 10, 200, px1 + 10, 300)), 0, 270)
palo_alto = union(largo, puente, BOCHA_ARRIBA)
palo_alto = corte(palo_alto, rect(ix0 - 10, 120, ix1 + 10, iy1 + 10))
ADMIRACION = union(palo_alto, BOCHA_ABAJO)
ax0, ay0, ax1, ay1 = caja(ADMIRACION)
ADMIRACION = mover(ADMIRACION, 40 - ax0, PIE - ay0)


def avance_de(p, aire=60):
    x0, _, x1, _ = caja(p)
    return int(round(x1 + aire))


def con_tilde(vocal):
    """La vocal y su tilde arriba, corrida a la derecha como cae a mano."""
    base = camino(nombre_de[vocal])
    bx0, by0, bx1, by1 = caja(base)
    centro = bx0 + (bx1 - bx0) * 0.58
    t = mover(TILDE, centro - (tx0 + tx1) / 2, by1 + 45 - ty0)
    return union(base, t), metricas[nombre_de[vocal]][0]


NUEVOS = {}
for vocal, nombre in (('A', 'Aacute'), ('E', 'Eacute'), ('I', 'Iacute'), ('O', 'Oacute'), ('U', 'Uacute')):
    NUEVOS[nombre] = con_tilde(vocal)
NUEVOS['period'] = (PUNTO, avance_de(PUNTO))
NUEVOS['comma'] = (COMA, avance_de(COMA))
NUEVOS['exclam'] = (ADMIRACION, avance_de(ADMIRACION))
# El de apertura: el de cierre dado vuelta sobre su centro y bajado, para que la bocha quede
# arriba y el palo cuelgue bajo la línea, como en la imprenta española.
x0, y0, x1, y1 = caja(ADMIRACION)
NUEVOS['exclamdown'] = (girar_180(ADMIRACION, (x0 + x1) / 2, (y0 + y1) / 2 - 60), NUEVOS['exclam'][1])

CARACTERES = {
    'Á': 'Aacute', 'É': 'Eacute', 'Í': 'Iacute', 'Ó': 'Oacute', 'Ú': 'Uacute',
    '.': 'period', ',': 'comma', '!': 'exclam', '¡': 'exclamdown',
}

# ---------------------------------------------------------------- armar la fuente

# Sin los glifos de control que traía el original (.null, CR): una fuente web no los usa.
SOBRAN = {'.null', 'nonmarkingreturn', 'CR'}
orden = [n for n in fuente.getGlyphOrder() if n not in SOBRAN]
orden += [n for n in NUEVOS if n not in orden]
cmap = {c: n for c, n in cmap_original.items() if n not in SOBRAN}
for car, nombre in CARACTERES.items():
    cmap[ord(car)] = nombre
    if car.lower() != car:
        cmap[ord(car.lower())] = nombre

SUBIR = -PIE  # el renglón: todo sube hasta que el pie de las letras quede en la línea de base

# Contornos TrueType, como el original: pathops devuelve cúbicas, y pasadas a cuadráticas con un
# error de una unidad la fuente pesa un tercio menos que en CFF.
contornos = {}
anchos = {}
for nombre in orden:
    if nombre in NUEVOS:
        p, ancho = NUEVOS[nombre]
    else:
        p, ancho = camino(nombre), metricas[nombre][0]
    p = mover(p, 0, SUBIR)
    p.simplify()
    pen = TTGlyphPen(None)
    p.draw(Cu2QuPen(pen, max_err=1.0, reverse_direction=True))
    contornos[nombre] = pen.glyph()
    anchos[nombre] = ancho

fb = FontBuilder(1000, isTTF=True)
fb.setupGlyphOrder(orden)
fb.setupCharacterMap(cmap)
fb.setupGlyf(contornos)

lsb = {}
alto, hondo = 0, 0
for nombre in orden:
    g = fb.font['glyf'][nombre]
    g.recalcBounds(fb.font['glyf'])
    lsb[nombre] = getattr(g, 'xMin', 0)
    if g.numberOfContours:
        alto, hondo = max(alto, g.yMax), min(hondo, g.yMin)
fb.setupHorizontalMetrics({n: (anchos[n], lsb[n]) for n in orden})

# Las métricas verticales, con lo que de verdad ocupa la letra ya subida: la tilde arriba y la
# cola de ¡ abajo. Si no, la caja de la línea no las contiene y una máscara se las corta.
ASCENDENTE = int(math.ceil(alto)) + 20
DESCENDENTE = int(math.floor(hondo)) - 20
fb.setupHorizontalHeader(ascent=ASCENDENTE, descent=DESCENDENTE, lineGap=0)
fb.setupNameTable({
    'familyName': 'Lobo Suelto Fan',
    'styleName': 'Regular',
    'uniqueFontIdentifier': 'LoboSueltoFan-Regular-1.100',
    'fullName': 'Lobo Suelto Fan',
    'psName': 'LoboSueltoFan-Regular',
    'version': VERSION,
})
os2 = fuente['OS/2']
fb.setupOS2(
    version=4,
    sTypoAscender=ASCENDENTE,
    sTypoDescender=DESCENDENTE,
    sTypoLineGap=0,
    usWinAscent=ASCENDENTE,
    usWinDescent=-DESCENDENTE,
    sCapHeight=int(round(statistics.median(caja(camino(nombre_de[c]))[3] for c in 'EHIKLMNTZ') + SUBIR)),
    usWeightClass=os2.usWeightClass,
    fsSelection=0x40 | 0x80,  # REGULAR y USE_TYPO_METRICS: que todos los navegadores midan igual
)
fb.setupPost()

DESTINO.parent.mkdir(parents=True, exist_ok=True)
if DESTINO.suffix == '.woff':
    fb.font.flavor = 'woff'
fb.font.save(DESTINO)
print(f'{DESTINO.relative_to(RAIZ) if DESTINO.is_relative_to(RAIZ) else DESTINO}: '
      f'{len(orden)} glifos, sube {SUBIR:.0f}, ascendente {ASCENDENTE}, descendente {DESCENDENTE}, '
      f'{DESTINO.stat().st_size / 1024:.1f} KB')
