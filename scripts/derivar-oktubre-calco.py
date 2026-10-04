"""
Deriva la F, la H, la N y la Í de Oktubre Calco a partir de las letras que ya tiene.

    python scripts/derivar-oktubre-calco.py

Lee `Docs/INVESTIGACION/Tipografia/OktubreCalco-v0.3.otf` (las siete letras calcadas de la
tapa de *Oktubre* más la A, la C, la D y la I de la v0.3, `RES-43`) y escribe
`public/fuentes/oktubre-calco.woff` en su v0.4. Con una ruta de argumento escribe ahí
(`.otf` sale sin comprimir). Pide `fonttools` y `skia-pathops`.

**Por qué hacen falta.** El sitio se llama Fichín Ricotero desde `D-60`, y la marca va en
esta letra en sus cuatro formas (la grande del portal, la chica del cascarón, la de la
cabecera de cada juego y la de la carátula) y en las dos imágenes que se comparten. FICHÍN
pide cuatro letras que la tapa no trae.

**Cómo se arman.** Es el paso 5 de `RES-39`: la letra que falta se dibuja con una del
original como plantilla. Acá ni siquiera se dibuja: se recorta y se pega, con operaciones
booleanas reales, así cada letra nueva hereda el borde comido del calco en vez de un borde
de compás.

- **F** = la E sin el brazo de abajo. El palo queda con el canto de la E.
- **H** = dos palos de I y, de travesaño, el brazo del medio de la E, que mide justo lo
  que tiene que cruzar.
- **N** = dos palos de I y una diagonal del mismo grosor que el palo, con el canto apenas
  movido para que no quede de regla.
- **Í** = la I con un acento de la misma tinta, inclinado como el corte de la K.

Las minúsculas apuntan a las mismas mayúsculas, igual que las otras once: es una letra de
titular, no de texto.
"""

import sys
from pathlib import Path

import pathops
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.t2CharStringPen import T2CharStringPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

RAIZ = Path(__file__).resolve().parent.parent
ORIGEN = RAIZ / 'Docs/INVESTIGACION/Tipografia/OktubreCalco-v0.3.otf'
DESTINO = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else RAIZ / 'public/fuentes/oktubre-calco.woff'
VERSION = 'Version 0.400; Oktubre Calco v0.4 (F H N Í derivadas, D-60)'

fuente = TTFont(ORIGEN)
glifos = fuente.getGlyphSet()
metricas = fuente['hmtx'].metrics


def camino(nombre, dx=0, dy=0):
    """El contorno de un glifo existente como camino de pathops, corrido (dx, dy)."""
    p = pathops.Path()
    pen = p.getPen()
    if dx or dy:
        pen = TransformPen(pen, (1, 0, 0, 1, dx, dy))
    glifos[nombre].draw(pen)
    return p


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
    resultado = caminos[0]
    for c in caminos[1:]:
        resultado = pathops.op(resultado, c, pathops.PathOp.UNION)
    return resultado


def menos(a, b):
    return pathops.op(a, b, pathops.PathOp.DIFFERENCE)


def corte(a, b):
    return pathops.op(a, b, pathops.PathOp.INTERSECTION)


# ---------------------------------------------------------------- las medidas del calco
#
# Salen de leer los contornos de la v0.3 (los números redondos son los del calco):
#   I: palo de x 40 a 228, de y 0 a 688.
#   E: palo de x 40 a ~245; brazo de arriba y 520–688, del medio y 273–435 (llega a x 451),
#      de abajo y 0–180 (llega a x 475).

PALO = 228  # el canto derecho del palo de la I
TAPA = 688  # la altura de las mayúsculas en la I y la E

# F: la E menos el brazo de abajo. El corte va por x 244, que es donde la E tiene el canto
# del palo en el hueco de abajo, así el palo de la F sigue derecho hasta el renglón.
F = menos(camino('E'), rect(244, -20, 520, 200))

# H: dos palos y el brazo del medio de la E de travesaño. El brazo va de x 249 a 451 (202);
# el hueco entre los palos de la H mide 200, así que entra tal cual, corrido 21 a la
# izquierda para que muerda los dos palos.
H_SEGUNDO = 388
travesano = corte(camino('E', dx=-21), rect(200, 268, 460, 440))
H = union(camino('I'), camino('I', dx=H_SEGUNDO), travesano)

# N: dos palos y la diagonal. La diagonal es un paralelogramo de 230 de ancho horizontal
# que baja del tope del primer palo al pie del segundo; el canto de arriba tiene un quiebre
# de 4 unidades a media altura, que es lo que separa un calco de una regla.
N_SEGUNDO = 378
N_DERECHA = 40 + N_SEGUNDO + (PALO - 40)  # 606
ANCHO_DIAGONAL = 230
diagonal = poligono(
    (40, TAPA),
    (40 + ANCHO_DIAGONAL, TAPA),
    (40 + ANCHO_DIAGONAL + (N_DERECHA - 40 - ANCHO_DIAGONAL) / 2 + 4, TAPA / 2),
    (N_DERECHA, 0),
    (N_DERECHA - ANCHO_DIAGONAL, 0),
    ((40 + N_DERECHA - ANCHO_DIAGONAL) / 2 - 3, TAPA / 2 + 2),
)
N = union(camino('I'), camino('I', dx=N_SEGUNDO), diagonal)

# Í: la I y un acento. El acento es un bloque inclinado de unas 100 unidades de grosor —la
# mitad del palo, que es lo que aguanta leerse a 17 px en la marca chica— con el canto de
# arriba un poco más angosto que el de abajo, como el corte de la K. Sube a 856, por encima
# del alto de ventana (`usWinAscent` 800), y las métricas **no se tocan a propósito**:
# subirlas corre la línea de base de la marca en Windows. Probado el 2026-10-04 en Chromium
# sobre Windows, en HTML y en canvas: con 800 el acento se dibuja entero, sin recorte.
ACENTO = poligono((60, 714), (180, 714), (252, 856), (140, 852))
I_TILDE = union(camino('I'), ACENTO)

# Los avances dejan a la derecha el mismo aire que las letras calcadas (33 a 35 unidades):
# la F el de la E de la que sale, la N el de la I de la que salen sus palos.
NUEVOS = {
    'F': (F, metricas['E'][0]),
    'H': (H, metricas['U'][0]),
    'N': (N, N_DERECHA + (metricas['I'][0] - PALO)),
    'Iacute': (I_TILDE, metricas['I'][0]),
}

# ---------------------------------------------------------------- armar la fuente

orden = fuente.getGlyphOrder() + list(NUEVOS)
cmap = dict(fuente.getBestCmap())
for letra, nombre in (('F', 'F'), ('H', 'H'), ('N', 'N'), ('Í', 'Iacute')):
    cmap[ord(letra)] = nombre
    cmap[ord(letra.lower())] = nombre

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
fb.setupCFF('OktubreCalco-Regular', {'FullName': 'Oktubre Calco', 'version': '0.400'}, trazos, {})

# El borde izquierdo de cada glifo, medido del contorno nuevo.
lsb = {}
for nombre in orden:
    caja = fb.font['CFF '].cff.topDictIndex[0].CharStrings[nombre].calcBounds(None)
    lsb[nombre] = int(round(caja[0])) if caja else 0
fb.setupHorizontalMetrics({n: (anchos[n], lsb[n]) for n in orden})

hhea = fuente['hhea']
fb.setupHorizontalHeader(ascent=hhea.ascent, descent=hhea.descent, lineGap=hhea.lineGap)
fb.setupNameTable({
    'familyName': 'Oktubre Calco',
    'styleName': 'Regular',
    'uniqueFontIdentifier': 'OktubreCalco-Regular-0.400',
    'fullName': 'Oktubre Calco',
    'psName': 'OktubreCalco-Regular',
    'version': VERSION,
})
os2 = fuente['OS/2']
fb.setupOS2(
    sTypoAscender=os2.sTypoAscender,
    sTypoDescender=os2.sTypoDescender,
    sTypoLineGap=os2.sTypoLineGap,
    usWinAscent=os2.usWinAscent,
    usWinDescent=os2.usWinDescent,
    usWeightClass=os2.usWeightClass,
    achVendID=os2.achVendID,
    fsSelection=0x40,
)
fb.setupPost()
fb.font['head'].fontRevision = 0.4
# Fechas fijas: si cambian, cambia el archivo, y con él la huella del taller de tarjetas
# (`src/lib/dos-ejes/taller.ts`), que pediría regenerar todo por una fuente idéntica.
FECHA = 3873999943  # 2026-10-04 23:05:43 UTC, en segundos desde 1904 (el reloj de `head`)
fb.font['head'].created = fb.font['head'].modified = FECHA
fb.font.recalcTimestamp = False

fb.font.flavor = 'woff' if DESTINO.suffix == '.woff' else None
fb.save(DESTINO)
print(f'{DESTINO.name}: {len(orden)} glifos, {DESTINO.stat().st_size} bytes')
