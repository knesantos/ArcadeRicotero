"""
Le da a Patricio Rey Fan las tildes y los signos que le faltan para gritar en castellano.

    python scripts/derivar-patricio-rey.py

Lee `Docs/INVESTIGACION/Tipografia/Patricio-Rey-Regular.zip` (la digitalización fan de
Benjamín Zavala, `RES-42`: A-Z y 0-9, 42 glifos, sin una sola tilde) y escribe
`public/fuentes/patricio-rey.woff`. Con una ruta de argumento escribe ahí (`.otf` sale sin
comprimir). Pide `fonttools` y `skia-pathops`, igual que `derivar-oktubre-calco.py`.

**Por qué.** El usuario pidió, textual: *"hay que usar la tipografia de los discos en mas
lados"* (`D-65`). La letra de la banda es la única de las tres que tiene el abecedario
entero, pero sin tildes no puede escribir ni JUGÁ, ni COMPARTÍ, ni ADIVINÁ, y `D-17` no deja
sacarle la tilde a una palabra para que entre en la fuente. Lo que no tenía glifo caía a la
rotulada en el medio de la palabra, y se notaba el parche.

**Cómo, y con qué material.** Igual que el calco: lo que falta no se dibuja de cero, se
recorta y se pega de letras que ya están, con operaciones booleanas reales, así cada glifo
nuevo hereda el canto y el giro de la letra de la que sale.

- **La tilde** es una cuña: la punta de arriba del palo de la I —que en esta letra ya es una
  cuña inclinada con su ranura—, recortada, achicada y puesta sobre cada vocal, del lado
  derecho, como cae una tilde escrita a mano.
- **El punto** es la base de la misma I, cortada en un bloque chico: un pedazo de palo.
- **La coma** es el punto con una cola que baja a la izquierda, del mismo grosor.
- **El signo de admiración** es la I entera achicada a dos tercios, con el punto abajo.
- **El signo de pregunta** es la cabeza del 2 —la curva de arriba—, con el punto abajo.
- **Los de apertura**, ¡ y ¿, son los de cierre dados vuelta, como en la imprenta.

Las minúsculas apuntan a las mismas mayúsculas, como en el original: es una letra de
titular. Las métricas verticales suben para que la tilde entre en la caja de la línea: sin
eso, el título enmascarado de `D-64` le cortaría la punta.
"""

import io
import sys
import zipfile
from pathlib import Path

import pathops
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.t2CharStringPen import T2CharStringPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

RAIZ = Path(__file__).resolve().parent.parent
ORIGEN = RAIZ / 'Docs/INVESTIGACION/Tipografia/Patricio-Rey-Regular.zip'
DESTINO = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else RAIZ / 'public/fuentes/patricio-rey.woff'
VERSION = 'Version 1.100; Patricio Rey Fan con tildes y signos derivados (D-65)'

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


def mover(p, dx, dy):
    q = pathops.Path()
    p.draw(TransformPen(q.getPen(), (1, 0, 0, 1, dx, dy)))
    return q


def escalar(p, sx, sy, cx=0, cy=0):
    q = pathops.Path()
    p.draw(TransformPen(q.getPen(), (sx, 0, 0, sy, cx - sx * cx, cy - sy * cy)))
    return q


def girar_180(p, cx, cy):
    q = pathops.Path()
    p.draw(TransformPen(q.getPen(), (-1, 0, 0, -1, 2 * cx, 2 * cy)))
    return q


def poligono(*puntos):
    p = pathops.Path()
    pen = p.getPen()
    pen.moveTo(puntos[0])
    for punto in puntos[1:]:
        pen.lineTo(punto)
    pen.closePath()
    return p


def rect(x0, y0, x1, y1):
    return poligono((x0, y0), (x1, y0), (x1, y1), (x0, y1))


def union(*caminos):
    r = caminos[0]
    for c in caminos[1:]:
        r = pathops.op(r, c, pathops.PathOp.UNION)
    return r


def corte(a, b):
    return pathops.op(a, b, pathops.PathOp.INTERSECTION)


# ---------------------------------------------------------------- el material

I = camino(nombre_de['I'])
ix0, iy0, ix1, iy1 = caja(I)

# La tilde: la I entera en miniatura, girada para que se recueste como una tilde. Conserva
# su ranura, que es lo que hace que se lea de esta letra y no de un repuesto.
def girar(p, grados, cx, cy):
    import math
    a = math.radians(grados)
    c, s_ = math.cos(a), math.sin(a)
    q = pathops.Path()
    p.draw(TransformPen(q.getPen(), (c, s_, -s_, c, cx - c * cx + s_ * cy, cy - s_ * cx - c * cy)))
    return q


TILDE = girar(escalar(I, 0.36, 0.36), -32, 0, 0)
tx0, ty0, tx1, ty1 = caja(TILDE)

# El punto: una cuña casi cuadrada, apenas torcida como todo en esta letra. Es geometría y
# no recorte, porque cualquier pedazo de palo de la I sale apaisado y se lee como raya.
PUNTO = poligono((40, -18), (182, 0), (168, 142), (28, 124))
px0, py0, px1, py1 = caja(PUNTO)
ANCHO_PUNTO = px1 - px0

# La coma: el mismo punto con la cola que baja hacia la izquierda, del ancho del punto.
COMA = union(PUNTO, poligono((112, 10), (182, 0), (96, -190), (40, -176)))

# La admiración: la I a dos tercios, arriba; el punto, abajo.
alta = escalar(I, 0.5, 0.66)
ax0, ay0, ax1, ay1 = caja(alta)
alta = mover(alta, 40 - ax0 + (ANCHO_PUNTO - (ax1 - ax0)) / 2 + 20, (py1 + 70) - ay0)
ADMIRACION = union(alta, PUNTO)

# La pregunta: la cabeza del 2 —su mitad de arriba—, y el punto debajo de donde termina.
dos = camino(nombre_de['2'])
dx0, dy0, dx1, dy1 = caja(dos)
cabeza = corte(dos, rect(dx0 - 50, dy0 + (dy1 - dy0) * 0.45, dx1 + 50, dy1 + 50))
cabeza = escalar(cabeza, 0.78, 0.78)
cx0, cy0, cx1, cy1 = caja(cabeza)
cabeza = mover(cabeza, 40 - cx0, (py1 + 80) - cy0)
cx0, cy0, cx1, cy1 = caja(cabeza)
PREGUNTA = union(cabeza, mover(PUNTO, (cx0 + cx1) / 2 - (px0 + px1) / 2 - 20, 0))


def avance_de(p, aire=60):
    x0, _, x1, _ = caja(p)
    return int(round(x1 + aire))


def con_tilde(vocal):
    """La vocal y su tilde arriba a la derecha, despegada lo que despega una tilde a mano."""
    base = camino(nombre_de[vocal])
    bx0, by0, bx1, by1 = caja(base)
    centro = bx0 + (bx1 - bx0) * 0.55
    t = mover(TILDE, centro - (tx0 + tx1) / 2, by1 + 40 - ty0)
    return union(base, t), metricas[nombre_de[vocal]][0]


NUEVOS = {}
for vocal, nombre in (('A', 'Aacute'), ('E', 'Eacute'), ('I', 'Iacute'), ('O', 'Oacute'), ('U', 'Uacute')):
    NUEVOS[nombre] = con_tilde(vocal)
NUEVOS['period'] = (PUNTO, avance_de(PUNTO))
NUEVOS['comma'] = (COMA, avance_de(COMA))
NUEVOS['exclam'] = (ADMIRACION, avance_de(ADMIRACION))
NUEVOS['question'] = (PREGUNTA, avance_de(PREGUNTA))
# Los de apertura: el de cierre dado vuelta sobre su propio centro, y bajado para que el
# punto quede arriba a la altura de las mayúsculas y la cola cuelgue bajo la línea, como en
# la imprenta española.
for nombre, de in (('exclamdown', 'exclam'), ('questiondown', 'question')):
    p = NUEVOS[de][0]
    x0, y0, x1, y1 = caja(p)
    NUEVOS[nombre] = (girar_180(p, (x0 + x1) / 2, (y0 + y1) / 2 - 120), NUEVOS[de][1])

CARACTERES = {
    'Á': 'Aacute', 'É': 'Eacute', 'Í': 'Iacute', 'Ó': 'Oacute', 'Ú': 'Uacute',
    '.': 'period', ',': 'comma', '!': 'exclam', '?': 'question', '¡': 'exclamdown', '¿': 'questiondown',
}

# ---------------------------------------------------------------- armar la fuente

orden = fuente.getGlyphOrder() + [n for n in NUEVOS if n not in fuente.getGlyphOrder()]
cmap = dict(cmap_original)
for car, nombre in CARACTERES.items():
    cmap[ord(car)] = nombre
    if car.lower() != car:
        cmap[ord(car.lower())] = nombre

trazos = {}
anchos = {}
for nombre in orden:
    if nombre in NUEVOS:
        p, ancho = NUEVOS[nombre]
        p.simplify()
        grabado = RecordingPen()
        p.draw(grabado)
    else:
        ancho = metricas[nombre][0]
        grabado = RecordingPen()
        glifos[nombre].draw(grabado)
    pen = T2CharStringPen(ancho, None)
    grabado.replay(pen)
    trazos[nombre] = pen.getCharString()
    anchos[nombre] = ancho

fb = FontBuilder(1000, isTTF=False)
fb.setupGlyphOrder(orden)
fb.setupCharacterMap(cmap)
fb.setupCFF('PatricioReyFan-Regular', {'FullName': 'Patricio Rey Fan', 'version': '1.100'}, trazos, {})

lsb = {}
alto_max = 0
for nombre in orden:
    c = fb.font['CFF '].cff.topDictIndex[0].CharStrings[nombre].calcBounds(None)
    lsb[nombre] = int(round(c[0])) if c else 0
    if c:
        alto_max = max(alto_max, c[3])
fb.setupHorizontalMetrics({n: (anchos[n], lsb[n]) for n in orden})

# La tilde sube por encima del alto original (666): la caja de la línea tiene que llegar
# hasta ella, o la máscara del título se la corta. El descendente queda como estaba.
ASCENDENTE = max(fuente['hhea'].ascent, int(alto_max) + 20)
hhea = fuente['hhea']
fb.setupHorizontalHeader(ascent=ASCENDENTE, descent=hhea.descent, lineGap=hhea.lineGap)
fb.setupNameTable({
    'familyName': 'Patricio Rey Fan',
    'styleName': 'Regular',
    'uniqueFontIdentifier': 'PatricioReyFan-Regular-1.100',
    'fullName': 'Patricio Rey Fan',
    'psName': 'PatricioReyFan-Regular',
    'version': VERSION,
})
os2 = fuente['OS/2']
fb.setupOS2(
    sTypoAscender=ASCENDENTE,
    sTypoDescender=os2.sTypoDescender,
    sTypoLineGap=os2.sTypoLineGap,
    usWinAscent=max(os2.usWinAscent, ASCENDENTE),
    usWinDescent=os2.usWinDescent,
    usWeightClass=os2.usWeightClass,
)
fb.setupPost()

DESTINO.parent.mkdir(parents=True, exist_ok=True)
if DESTINO.suffix == '.woff':
    fb.font.flavor = 'woff'
fb.font.save(DESTINO)
print(f'{DESTINO.relative_to(RAIZ) if DESTINO.is_relative_to(RAIZ) else DESTINO}: '
      f'{len(orden)} glifos, ascendente {ASCENDENTE}, {DESTINO.stat().st_size / 1024:.1f} KB')
