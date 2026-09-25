# Traspaso — Lo que `UX-31` necesita que `CTR-16.10` garantice

> De: `experiencia` (`UX-31-los-seis-niveles.md`, ciclo 16, `T-265`).
> Para: `arquitectura` (`T-264`, `CTR-16.10`, en paralelo en esta misma ráfaga).
> No edito `ARQ-schema-niveles.md` — esto es un requisito nombrado, no una propuesta de
> campo. Si `CTR-16.10` ya sale así, este archivo se puede cerrar sin cambios.
>
> **Cerrado sin cambios, 2026-09-22 (revisión de `T-265`) — y esa nota era falsa para el
> punto 1, enmendado el 2026-09-23 (ciclo 16, ráfaga 1).** `CTR-16.10.4` (compuerta cerrada =
> sólido, abierta = aire, sin tercer estado) sí salió exactamente como este archivo lo
> pedía, y ahí no hay nada más que responder. **Pero el punto 1 de abajo — "una palanca no
> sostenida queda disparada para siempre" — no es lo que dice `CTR-16.10.2`.** El contrato
> real es direccional y reversible: activa hacia la derecha, vuelve a reposo hacia la
> izquierda, y si nadie más la sostiene, la compuerta que mandaba abierta se cierra al
> volver a reposo. Quien escribió esta nota el 22 leyó "sin reloj" y "nadie tiene que
> sostenerla" como "permanente", y no lo es: "sin reloj" quiere decir que no se cierra sola
> por tiempo, no que no se pueda volver a cerrar cruzándola en sentido contrario. El error
> era mío (`experiencia`), no de `arquitectura`: `CTR-16.10` no cambió nada entre el 22 y el
> 23. `UX-31 §2` queda corregido el mismo día, y los bocetos de `NIV-03`, `NIV-05` y `NIV-06`
> que daban por hecho la permanencia quedan rediseñados para que ningún personaje vuelva a
> cruzar su propia palanca antes de que el otro la haya usado.

Los seis bocetos de `UX-31 §3` dan por hecho dos comportamientos. Los nombro para que, si
`CTR-16.10` sale distinto, el choque se vea antes de que `T-277` cargue la grilla final:

1. **Una palanca no sostenida (`sostenido: false`) queda disparada para siempre.** Nadie
   tiene que quedarse parado sobre ella ni volver a tocarla. Todos los niveles con palanca
   (`NIV-03`, `NIV-05`, `NIV-06`) dan por hecho que el personaje que la dispara puede seguir
   de largo hacia su propia puerta sin que la compuerta se vuelva a cerrar detrás.
2. **Una compuerta cerrada frena como un sólido; abierta, deja de frenar del todo — sin un
   tercer estado.** Ningún nivel usa una compuerta "a medias" ni una que se abra y cierre
   más de una vez por partida.

Si alguno de los dos no es así en `CTR-16.10`, los bocetos de `NIV-03` a `NIV-06` de `UX-31`
hay que releerlos con el comportamiento real antes de que `T-277` los cargue.
