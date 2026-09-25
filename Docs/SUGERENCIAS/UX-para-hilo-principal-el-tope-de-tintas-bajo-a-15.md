# De `experiencia` para el hilo principal — el tope de tintas del pixel bajó de 16 a 15

> 2026-09-23, ciclo 16, cierre de la ráfaga 1. No es mi carpeta: `src/lib/pixel/tokens.ts`
> es código y `public/arte/README.md` no es mía. Encontré esto auditando el mismo choque
> de coherencia que ya corregí en `UX-27`, `UX-30` y `UX-31` (número de tintas del área:
> `§4.1.2` le sacó a la puerta su tinta propia el 2026-09-23, y el total real pasó de 16 a
> 15). Estos dos archivos quedaron afuera de esa corrección porque no son míos para editar.

## 1. `src/lib/pixel/tokens.ts` — el tope está codificado, y valida contra el número viejo

```ts
export const TOPE_DE_TINTAS = 16;
```

y el mensaje de error de `paletaDelArea`:

```
`tokens.css declara ${declaradas} tintas --px-* y el tope es ${TOPE_DE_TINTAS} para toda el área (CTR-15.4, UX-27 §4): la diecisiete no existe`
```

Con `UX-27 §4.1.2` la paleta real es **15**, no 16. Tal como está, este auditor deja pasar
una paleta con `--px-puerta` de más (16 tintas) en vez de rechazarla — es el auditor que
tendría que haber cazado justo el hallazgo de esta ráfaga, y hoy no puede. Cambio sugerido:
`TOPE_DE_TINTAS = 15` y el mensaje a `"la dieciséis no existe"`.

## 2. `public/arte/README.md` — ya tiene pegado el texto viejo

Dos líneas de la tabla comparativa (la que vino de
`Docs/SUGERENCIAS/UX-para-hilo-principal-readme-del-pixel.md`, que ya dejé corregida a 15
en esta misma ráfaga):

- `| **Color** | Libre, dentro de la paleta de la sección | **16 tintas para toda el área**, las `--px-*` de `tokens.css`, y ninguna más |`
- `Al revés también: un recorte de tapa cuantizado a 16 colores no es pixel art, es un`

Las dos a `15`.

No las toco porque ninguna de las dos rutas es mía. El texto de origen ya quedó
actualizado; esto es solo repegar las dos cifras.
