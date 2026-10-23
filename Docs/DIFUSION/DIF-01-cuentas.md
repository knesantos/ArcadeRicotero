# DIF-01 — Las cuentas, el perfil y la cola

> Consume: `D-81`, `D-60` (el nombre), `D-14` (la postura), `RES-400` … `RES-408` (`INV-400`).
> Dueño: `difusion`. Las cuentas las abre el usuario: Claude no crea cuentas ni escribe
> contraseñas.

## Los nombres

| Red | Usuario | Nombre visible |
|---|---|---|
| Instagram | `@fichinricotero` (si está tomado: `@fichin.ricotero`) | Fichín Ricotero |
| X | `@fichinricotero` (14 letras: entra en el tope de 15) | Fichín Ricotero |

Es el dominio sin el punto, así alcanza con acordarse de uno.

## El perfil

**Foto:** `public/redes/perfil.jpg`, la FR coronada en el disco de tinta (`fr-redondo`, `D-82`).
Entra en el círculo de las dos redes. **Banner de X:** `public/redes/banner-x.jpg`, la marca con el
nombre abajo. Las dos se vuelven a imprimir con `npm run redes -- perfil` si cambia la marca.

**Bio de Instagram** (tope 150):

```
Juegos sobre Patricio Rey y sus Redonditos de Ricota. Gratis, sin cuenta, desde el teléfono. Sitio de fans.
```

**Bio de X** (tope 160): la misma.

**Enlace:** `https://fichinricotero.com.ar` en los dos.

Cuenta de Instagram **profesional, tipo creador** (es gratis y no pide página de
Facebook): sin eso no se puede programar desde afuera (`RES-401`, `RES-408`).

## La cola: Buffer, plan gratis

Por qué Buffer y no otra está en `D-81`. Lo que importa para operar:

- Plan gratis: **3 canales y 10 posteos en cola por canal**; el lugar se libera cuando sale
  (`RES-402`). Con tres posteos por semana (`DIF-02`) la cola cubre tres semanas.
- La API es gratis también: una clave personal, 250 pedidos por día (`RES-407`).
- X en el plan gratis **no está confirmado** (`RES-402`). Si al conectar X lo pide pago, el
  camino B está en `D-81`.

## Paso a paso (lo hace el usuario, una sola vez)

1. **Instagram.** Abrí la cuenta con el usuario de arriba. En Configuración → Tipo de
   cuenta, pasala a **profesional → creador**, categoría "Sitio web de entretenimiento" o
   parecida. Cargá foto, bio y enlace.
2. **X.** Abrí la cuenta con el usuario de arriba. Cargá foto, banner, bio y enlace.
3. **Buffer.** Abrí una cuenta en buffer.com (plan Free). Conectá los dos canales:
   Instagram (con login de Instagram) y X.
4. **La clave.** En https://publish.buffer.com/settings/api generá una clave y pegala en
   el archivo `.env` de la raíz del repo, en una línea:
   `BUFFER_API_KEY=...`. El `.env` no se sube (está en `.gitignore`), y Claude no lo lee.
5. Avisale a Claude. Corre `npm run redes -- canales` para ver que aparezcan los dos.

Después de eso, cada semana es `/redes`.
