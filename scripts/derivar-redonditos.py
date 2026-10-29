"""
Arma Redonditos de Ricota Fan, la letra que viste *Luzbelito*, con las tildes, la Ñ y los
signos que le faltan para gritar en castellano.

    python scripts/derivar-redonditos.py

Lee `Docs/INVESTIGACION/Tipografia/Redonditos-De-Ricota-Regular.zip` (la digitalización fan de
Benjamín Zavala, `RES-42`: A-Z y 0-9, sin una tilde ni un signo) y escribe
`public/fuentes/redonditos-de-ricota.woff`. Con una ruta de argumento escribe ahí (`.otf` sale
sin comprimir). Pide `fonttools` y `skia-pathops`, igual que `derivar-patricio-rey.py`.

**Por qué esta letra para *Luzbelito*.** El usuario, textual: *"vamos a seguir integrando las
otras dos que no estan en el sistema, la de lobo suelto y la otra que es medio luz belito"*
(`D-67`). No es la letra de la tapa —esa es un trazo fino de pluma, y nadie la digitalizó—: es
la que se le parece. Comparten la mano alzada, las alturas desparejas y la i con su punto en
medio de las mayúsculas. Por eso se llama por lo que es y no por el disco: el disco lo pone
`tokens.css`, en `--fuente-luzbelito`.

**Cómo, y con qué material.** Igual que el calco y la letra de la banda: lo que falta no se
dibuja de cero, se recorta y se pega de la propia letra, con operaciones booleanas reales. Casi
todo sale de la I, que en esta letra es una i: un punto suelto arriba y un palo de pincel que
termina en un pie de dos dedos.

- **El punto** es el punto de la i.
- **La coma** es el punto con el dedo derecho del pie colgando debajo.
- **La tilde** es el mismo dedo, más grande y girado: grueso arriba a la derecha y afinado
  abajo a la izquierda, como cae una tilde de pincel.
- **La Í** es la i sin su punto y con la tilde en su lugar, como se escribe a mano.
- **El signo de admiración** es la i dada vuelta: el palo arriba y el punto abajo.
- **El signo de pregunta** es la cabeza del 2 —la curva de arriba— con el punto debajo.
- **La virgulilla de la Ñ** es la S acostada y aplastada, que es de donde sale la forma.
- **Los de apertura**, ¡ y ¿, son los de cierre dados vuelta, como en la imprenta.

**La medida y el renglón.** Zavala la dibujó grande —la mayúscula mide 787 unidades, contra las
688 de Archivo Black, del calco y de Lobo suelto— y apoyada 91 unidades por debajo de la línea
de base. Se escala a la mayúscula del sistema y se sube al renglón, así en el mismo cuerpo mide
lo mismo que las otras y la letra que cae al repuesto no salta.
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
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import TTFont

RAIZ = Path(__file__).resolve().parent.parent
ORIGEN = RAIZ / 'Docs/INVESTIGACION/Tipografia/Redonditos-De-Ricota-Regular.zip'
DESTINO = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else RAIZ / 'public/fuentes/redonditos-de-ricota.woff'
VERSION = 'Version 1.100; Redonditos de Ricota Fan con tildes y signos derivados (D-67)'

# La altura de mayúscula del sistema: la de Archivo Black, que es también la del calco de
# Oktubre (688) y la de Lobo suelto (686).
MAYUSCULA_DEL_SISTEMA = 688

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


def resta(a, b):
    return pathops.op(a, b, pathops.PathOp.DIFFERENCE)


# ---------------------------------------------------------------- el material

# El pie: dónde apoyan de verdad las letras. La mediana y no el mínimo, porque cada pie de
# pincel baja a su manera.
PIE = statistics.median(caja(camino(nombre_de[c]))[1] for c in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')

# La I, medida (unidades del original): el punto suelto de 594 a 687, el remate de arriba de
# 500 a 583, el palo de pincel con su ranura y el pie, que se abre en dos dedos de -10 a -101.
I = camino(nombre_de['I'])
ix0, iy0, ix1, iy1 = caja(I)
PUNTO_I = corte(I, rect(ix0 - 10, 590, ix1 + 10, iy1 + 10))
PALO_I = resta(I, PUNTO_I)
DEDO = corte(I, rect(150, iy0 - 10, ix1 + 10, 10))

# El punto, apoyado donde apoyan las letras.
dx0, dy0, dx1, dy1 = caja(PUNTO_I)
PUNTO = mover(PUNTO_I, 40 - dx0, PIE - dy0)
px0, py0, px1, py1 = caja(PUNTO)

# La coma: el punto y el dedo del pie, colgando de su lado derecho y apenas torcido.
cola = escalar(DEDO, 0.85, 1.9)
cx0, cy0, cx1, cy1 = caja(cola)
cola = girar(cola, -18, (cx0 + cx1) / 2, cy1)
cx0, cy0, cx1, cy1 = caja(cola)
cola = mover(cola, px1 - cx1 - 6, py0 + 30 - cy1)
COMA = union(PUNTO, cola)

# La tilde: el dedo, estirado y girado para que la punta mire abajo a la izquierda.
TILDE = girar(escalar(DEDO, 1.05, 2.3), -38, 0, 0)
tx0, ty0, tx1, ty1 = caja(TILDE)

# La admiración: la i dada vuelta sobre su centro, apoyada en el renglón.
ADMIRACION = girar_180(I, (ix0 + ix1) / 2, (iy0 + iy1) / 2)
ax0, ay0, ax1, ay1 = caja(ADMIRACION)
ADMIRACION = mover(ADMIRACION, 40 - ax0, PIE - ay0)

# La pregunta: la cabeza del 2 —su mitad de arriba—, y el punto debajo de donde termina.
dos = camino(nombre_de['2'])
dx0, dy0, dx1, dy1 = caja(dos)
cabeza = corte(dos, rect(dx0 - 50, dy0 + (dy1 - dy0) * 0.42, dx1 + 50, dy1 + 50))
cabeza = escalar(cabeza, 0.82, 1.32)  # estirada: el signo llega a la altura de la mayúscula
hx0, hy0, hx1, hy1 = caja(cabeza)
cabeza = mover(cabeza, 40 - hx0, (py1 + 70) - hy0)
hx0, hy0, hx1, hy1 = caja(cabeza)
PREGUNTA = union(cabeza, mover(PUNTO, (hx0 + hx1) / 2 - (px0 + px1) / 2 - 30, 0))

# La virgulilla: la S acostada (girada un cuarto) y aplastada.
ese = camino(nombre_de['S'])
sx0, sy0, sx1, sy1 = caja(ese)
VIRGULILLA = girar(ese, 90, (sx0 + sx1) / 2, (sy0 + sy1) / 2)
VIRGULILLA = escalar(VIRGULILLA, 0.5, 0.34)
vx0, vy0, vx1, vy1 = caja(VIRGULILLA)


def avance_de(p, aire=60):
    x0, _, x1, _ = caja(p)
    return int(round(x1 + aire))


def con_marca(base, marca, mx0, my0, mx1, my1, donde=0.55, despegue=45):
    """La letra y su marca arriba, despegada lo que despega una tilde a mano."""
    bx0, by0, bx1, by1 = caja(base)
    centro = bx0 + (bx1 - bx0) * donde
    return union(base, mover(marca, centro - (mx0 + mx1) / 2, by1 + despegue - my0))


NUEVOS = {}
for vocal, nombre in (('A', 'Aacute'), ('E', 'Eacute'), ('O', 'Oacute'), ('U', 'Uacute')):
    NUEVOS[nombre] = (con_marca(camino(nombre_de[vocal]), TILDE, tx0, ty0, tx1, ty1),
                      metricas[nombre_de[vocal]][0])
# La Í: la i pierde el punto, y la tilde va donde estaba él.
NUEVOS['Iacute'] = (con_marca(PALO_I, TILDE, tx0, ty0, tx1, ty1, donde=0.42, despegue=20),
                    metricas[nombre_de['I']][0])
NUEVOS['Ntilde'] = (con_marca(camino(nombre_de['N']), VIRGULILLA, vx0, vy0, vx1, vy1, donde=0.5, despegue=40),
                    metricas[nombre_de['N']][0])
NUEVOS['period'] = (PUNTO, avance_de(PUNTO))
NUEVOS['comma'] = (COMA, avance_de(COMA))
NUEVOS['exclam'] = (ADMIRACION, avance_de(ADMIRACION))
NUEVOS['question'] = (PREGUNTA, avance_de(PREGUNTA))
# Los de apertura: el de cierre dado vuelta sobre su centro y bajado, para que el punto quede
# arriba y la cola cuelgue bajo la línea, como en la imprenta española.
for nombre, de in (('exclamdown', 'exclam'), ('questiondown', 'question')):
    p = NUEVOS[de][0]
    x0, y0, x1, y1 = caja(p)
    NUEVOS[nombre] = (girar_180(p, (x0 + x1) / 2, (y0 + y1) / 2 - 70), NUEVOS[de][1])

CARACTERES = {
    'Á': 'Aacute', 'É': 'Eacute', 'Í': 'Iacute', 'Ó': 'Oacute', 'Ú': 'Uacute', 'Ñ': 'Ntilde',
    '.': 'period', ',': 'comma', '!': 'exclam', '?': 'question', '¡': 'exclamdown', '¿': 'questiondown',
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

# La medida y el renglón: primero sube hasta que el pie quede en la línea de base, después se
# escala a la mayúscula del sistema. Los anchos se escalan con la letra.
MAYUSCULA = statistics.median(caja(camino(nombre_de[c]))[3] for c in 'EHKLMNTZ') - PIE
ESCALA = MAYUSCULA_DEL_SISTEMA / MAYUSCULA


def a_la_medida(p):
    return escalar(mover(p, 0, -PIE), ESCALA, ESCALA)


# Contornos TrueType, como el original: pathops devuelve cúbicas, y se pasan a cuadráticas con
# un error de una unidad.
contornos = {}
anchos = {}
for nombre in orden:
    if nombre in NUEVOS:
        p, ancho = NUEVOS[nombre]
    else:
        p, ancho = camino(nombre), metricas[nombre][0]
    p = a_la_medida(p)
    p.simplify()
    pen = TTGlyphPen(None)
    p.draw(Cu2QuPen(pen, max_err=1.0, reverse_direction=True))
    contornos[nombre] = pen.glyph()
    anchos[nombre] = int(round(ancho * ESCALA))

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

# Las métricas verticales, con lo que de verdad ocupa la letra ya en su medida: la tilde arriba
# y las colas de ¡ y ¿ abajo. Si no, la caja de la línea no las contiene y una máscara se las
# corta.
ASCENDENTE = int(math.ceil(alto)) + 20
DESCENDENTE = int(math.floor(hondo)) - 20
fb.setupHorizontalHeader(ascent=ASCENDENTE, descent=DESCENDENTE, lineGap=0)
fb.setupNameTable({
    'familyName': 'Redonditos de Ricota Fan',
    'styleName': 'Regular',
    'uniqueFontIdentifier': 'RedonditosDeRicotaFan-Regular-1.100',
    'fullName': 'Redonditos de Ricota Fan',
    'psName': 'RedonditosDeRicotaFan-Regular',
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
    sCapHeight=MAYUSCULA_DEL_SISTEMA,
    usWeightClass=os2.usWeightClass,
    fsSelection=0x40 | 0x80,  # REGULAR y USE_TYPO_METRICS: que todos los navegadores midan igual
)
fb.setupPost()

DESTINO.parent.mkdir(parents=True, exist_ok=True)
if DESTINO.suffix == '.woff':
    fb.font.flavor = 'woff'
fb.font.save(DESTINO)
print(f'{DESTINO.relative_to(RAIZ) if DESTINO.is_relative_to(RAIZ) else DESTINO}: '
      f'{len(orden)} glifos, escala {ESCALA:.3f}, sube {-PIE:.0f}, ascendente {ASCENDENTE}, '
      f'descendente {DESCENDENTE}, {DESTINO.stat().st_size / 1024:.1f} KB')
