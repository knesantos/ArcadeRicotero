# INV-06 — Vercel: cómo garantizar costo cero teniendo Pro pago en paralelo

> Producida por `investigador` el 2026-08-19. Escrita por el hilo principal:
> `investigador` es read-only por diseño.
>
> Consume: `D-15`. Responde una pregunta operativa del usuario, que ya desplegó el sitio.
> Numeración: `RES-15`, del rango `RES-11`..`RES-19` reservado a esta sesión.

---

## RES-15 — Hobby contra Pro, el scope del proyecto, y el tope de gasto

### La respuesta corta, porque corrige la hipótesis del usuario

El usuario preguntó si **no activar Speed Insights ni Analytics** alcanza para que el
sitio sea gratis. **Es necesario, pero no es lo que decide.** Lo que decide es
**en qué scope vive el proyecto**:

- **En Hobby (cuenta personal) nunca hay cargo.** No hay tarjeta que cobre de más: al
  agotar un cupo, el recurso se **frena**. Es una pared, no un medidor.
- **En un equipo Pro sí se factura el excedente**, y eso pasa con transferencia y edge
  requests, **aunque nunca se toque un add-on**.

Y hay una vuelta de tuerca contraintuitiva: **el mecanismo de tope de gasto de Vercy —
Spend Management— solo existe en Pro, no en Hobby.** En Hobby no existe porque no hace
falta.

### (a) Hobby contra Pro, y la cláusula de uso comercial

- **Hallazgo:** Hobby es gratis. Cupos: **1M edge requests/mes**, **100 GB de Fast Data
  Transfer/mes**, 4 CPU-hrs de Active CPU, 1M invocaciones de función, 5K
  transformaciones de imagen, 100 deployments/día, y un tope duro de **45 min por
  build**. Pro cuesta 20 USD por asiento y sube los pisos (10M requests, 1 TB), y a
  partir de ahí **cobra excedente**: ~0,15 USD/GB, ~2 USD por millón de requests.
  URLs: https://vercel.com/docs/plans/hobby · https://vercel.com/docs/limits
  Consultado: 2026-08-19 · **verificado — documentación oficial**

- **La cláusula de uso comercial, textual:** *"Hobby teams are restricted to
  non-commercial personal use only… Commercial usage is defined as any Deployment that
  is used for the purpose of financial gain of anyone involved in any part of the
  production of the project"*. Los ejemplos que da: cobrar, publicitar venta de un
  producto o servicio, cobrar por construir o alojar el sitio, afiliados como propósito
  principal, o incluir anuncios tipo AdSense.
  **Excepción explícita: *"Asking for Donations does not fall under commercial usage."***
  URL: https://vercel.com/docs/limits/fair-use-guidelines
  Consultado: 2026-08-19 · **verificado — documentación oficial**

- **Encaje con RicotaArcade:** no cobra, no tiene anuncios, no hay afiliados, nadie cobra
  por construirlo. **Encaja limpio en no-comercial.** El único cuidado a futuro es no
  meter AdSense ni cobrar nada. Un link de donación, si algún día se suma, está
  explícitamente permitido y no rompe el encaje.

### (b) Se puede tener Hobby personal y Pro en paralelo

- **Hallazgo:** una cuenta puede tener varios *scopes* — la cuenta personal, que es en sí
  misma un equipo Hobby, y aparte uno o más equipos Pro. **Cada proyecto vive en un solo
  scope, y se factura según el scope donde vive**, no según la cuenta. Tener un equipo Pro
  pago en otro lado **no arrastra** a un proyecto que está en el scope personal.
  URLs: https://vercel.com/docs/accounts · https://vercel.com/docs/plans/hobby
  Consultado: 2026-08-19 · **verificado — documentación oficial**
- **Dónde se ve:** proyecto → **Settings → General**, el campo del equipo o scope. El
  selector arriba a la izquierda del dashboard también muestra el scope activo.
- **Se puede mover sin downtime:** Settings → General → **Transfer Project**.
  URLs: https://vercel.com/docs/projects/transferring-projects ·
  https://vercel.com/changelog/projects-can-now-be-transferred-to-personal-accounts
  Consultado: 2026-08-19 · **verificado — documentación y changelog oficiales**

### (c) Spend Management — y por qué su ausencia en Hobby es buena noticia

- **Hallazgo:** existe un tope de gasto llamado **Spend Management**, en **Team Settings
  → Billing → Spend Management** (rol Owner o Billing). Se fija un monto en USD por ciclo
  y se elige qué pasa al alcanzarlo: notificar (50%, 75%, 100%), disparar un webhook, y/o
  **pausar el deployment de producción de todos los proyectos del equipo**.
  **Solo existe en Pro y Enterprise: en Hobby la tabla oficial lo marca "N/A".**
  URL: https://vercel.com/docs/spend-management
  Consultado: 2026-08-19 · **verificado — documentación oficial**
- **Qué pasa al pausar:** el visitante ve `503 DEPLOYMENT_PAUSED`. **No hay
  auto-recuperación**: cada proyecto se reactiva a mano, aunque subas el tope o empiece
  un ciclo nuevo.
- **Advertencia de la propia documentación:** el chequeo corre cada pocos minutos, no en
  tiempo real — *"notifications, webhooks, and project pausing can trigger several
  minutes after you cross your spend amount"*. O sea que el tope se fija **por debajo**
  del máximo tolerable, no en el máximo.
- **La consecuencia para `D-15`:** si el proyecto vive en Hobby, Spend Management no
  existe **porque no hace falta**. Si quedó bajo el equipo Pro, es el único mecanismo que
  convierte un pico en una pausa en vez de en una factura.

### (d) Qué métricas aplican a un sitio 100% estático

- **Aplican:** **Fast Data Transfer** (cada byte servido) y **Edge Requests** (cada
  request al edge). Más el tiempo de build y el conteo de deployments.
- **No aplican**, dado que `D-15` fija salida estática sin adapter: Active CPU,
  Provisioned Memory y Function Invocations quedan en cero porque no hay funciones
  desplegadas; Image Optimization no se activa porque el proyecto no usa el servicio; ISR
  no aplica a salida estática pura.
  URLs: https://vercel.com/docs/limits · https://vercel.com/docs/plans/hobby
  Consultado: 2026-08-19 · **verificado — documentación oficial**
- **Contra los números reales del proyecto**, medidos sobre el `dist/`: el sitio pesa
  **11 KB comprimidos por visita**, 3 archivos. Un millón de visitas serían unos **10 GB**
  contra los **100 GB** que incluye Hobby, y un millón de requests de página contra el
  cupo de **1M edge requests** — ese último es el que se agotaría primero, y aun así hace
  falta un millón de visitas mensuales.

### (e) Protección contra un pico o un ataque

- **Hallazgo:** la mitigación de DDoS está **activada por defecto en todos los planes,
  gratis y sin configurar nada**. Además existe **Attack Mode** (Firewall → Bot Management
  → Attack Mode), que exige un challenge antes de servir la página. Es **gratis en todos
  los planes, incluido Hobby**, y —el dato que importa— **el tráfico bloqueado por Attack
  Mode no cuenta contra ningún cupo**. Textual: *"All mitigations by Attack Mode are free
  and unlimited, and there are zero costs associated with traffic blocked by Attack
  Mode."*
  URL: https://vercel.com/docs/vercel-firewall/attack-mode
  Consultado: 2026-08-19 · **verificado — documentación oficial**
- **Matiz:** Attack Mode protege de bots, **no** de un pico de tráfico legítimo. Si el
  sitio se vuelve viral en Twitter, el cupo se consume igual. La diferencia real entre
  planes no es la protección —es la misma— sino **qué pasa al agotar el cupo**: en Hobby
  se frena, en Pro se factura.

---

## Qué hacer, en orden

1. **Abrir el proyecto en Vercel → Settings → General y mirar a qué scope pertenece.**
   Es lo único que decide si puede haber un cargo.
2. **Si está en el equipo Pro:** usar **Transfer Project** en esa misma pantalla para
   moverlo a la cuenta personal. Eso hace literal la promesa de `D-15` — dar de baja el
   Pro cualquier día no cambia nada del sitio. Es fácil que haya quedado ahí sin querer,
   porque el proyecto se crea en el scope que esté seleccionado.
3. **Si tiene que quedarse en Pro:** Team Settings → Billing → **Spend Management**,
   activarlo, poner el monto más bajo posible y **encender "Pause production
   deployment"**. Recordar que la detección tarda unos minutos.
4. **No agregar AdSense ni cobros.** Un link de donación no rompe el encaje en Hobby.
5. **No hay nada que tocar en Attack Mode ni DDoS**: ya está activo y es gratis.

## Sin resolver

- El **monto mínimo configurable** en Spend Management no está documentado en USD. Solo
  se ve en el panel.
- La cifra de **"6.000 minutos de build al mes"** que circula en blogs de terceros sobre
  Hobby **no tiene respaldo en la documentación oficial vigente**. Queda rotulada como no
  verificada, posiblemente de un plan anterior. Lo que sí está documentado es el tope de
  45 min por build y 100 deployments por día.
- Si Vercel llegara a considerar comercial este fan site en algún escenario límite es
  criterio de su soporte, no algo que la documentación resuelva por adelantado.
