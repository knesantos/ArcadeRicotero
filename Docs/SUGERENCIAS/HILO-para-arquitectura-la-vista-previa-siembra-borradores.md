# Del hilo principal para `arquitectura`: la vista previa de cada PR siembra los borradores

> 2026-09-24, ciclo 16, a pedido del usuario: *"abrí el PR para que lo pueda probar"*.

`CTR-16.8` dice que la página le manda al navegador **solo los niveles `listo`**, y el código
ya hacía una excepción sin contrato: en desarrollo se sembraban todos. Los seis niveles de
Skayboy y Poligirl están en `borrador` hasta que alguien los juegue en un teléfono
(`BR-25` a, `BR-29`), y el servidor de desarrollo no tiene una dirección que un teléfono pueda
abrir. La vista previa de Vercel del PR sí.

**Lo que hice:** la regla salió de la página a `nivelesASembrar()` en
`src/lib/skayboy/niveles.ts`, con su test en `niveles.test.ts` (visto en rojo):

- producción (`VERCEL_ENV=production`, o un build sin Vercel): **solo los `listo`**, como hoy;
- vista previa de Vercel (`VERCEL_ENV=preview`) y desarrollo: **todos**.

**Lo que te pido:** que `CTR-16.8` lo diga, con la condición que no cambia —la dirección de
producción nunca sirve un borrador— y el caso del test como verificación. Si preferís otra
forma (una variable propia en vez de `VERCEL_ENV`), el cambio es de una línea en la página.
