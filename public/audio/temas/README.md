# Los temas enteros

El nivel 2 del audio (`D-23`). Acá vive un mp3 por tema, **completo**, a 128 kbps estéreo,
con el nombre `<slug>.mp3` — el mismo slug que usa el fragmento de al lado, el que sale de
`resolverTema()` contra los 105 títulos de `RES-20`.

## Quién los pone

Vos, desde los discos que tenés en la máquina. **No salen de este repo y ningún rol los
puede producir**, igual que los recortes:

```
npm run generar-fragmentos -- "D:/Musica/Redonditos" --enteros
```

El script deja el fragmento de 15 s en `../fragmentos/` y el tema entero acá, normaliza los
dos al mismo volumen, y marca `"entero": true` en `src/data/adivinar-tema.json`. Lo que no
puede emparejar contra un título real no lo genera y te lo dice por consola: es preferible
un archivo sin emparejar que un mp3 con el nombre equivocado adentro del sitio, porque eso
último sería el juego revelando un título falso.

## Por qué la carpeta está vacía y versionada igual

Porque `.gitignore` ignora `*.mp3` en todo el repo —los másteres WAV y la discografía en
calidad de archivo se quedan afuera, `CTR-01` y `D-23`— y la excepción de esta carpeta es
una línea sola. Sin este archivo, git no guarda una carpeta vacía y la excepción queda
apuntando a un lugar que no existe.

**Y eso ya había mordido una vez:** hasta el ciclo 14 la excepción no estaba, así que
correr `--enteros` dejaba los archivos en disco, a la vista, y no llegaba ni uno a
producción. En silencio, que es la peor forma de fallar.

## Quién los usa

- **La revelación de "adiviná el tema"** (`D-22`): al cerrar un tema, si el archivo está,
  aparece el reproductor para escucharlo entero. Si no está, no se promete nada — la
  pantalla simplemente no lo muestra.

Hasta el 2026-10-01 los usaba también la rocola de la cinta (`ADR-07`), que se sacó del
sitio.

## El peso

Los 105 a 128 kbps son unos 160 MB. `RES-50` midió que eso no molesta ni a Vercel Hobby ni
a GitHub, y que hay alternativas gratis si algún día molestara. Lo que sí importa es del
lado del que escucha: son 3–4 MB por tema, así que nada de acá se precarga nunca.
