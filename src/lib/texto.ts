/**
 * Normalizar títulos: lo mismo que hacía `letra/temas.ts`, pero sin `node:fs` al lado.
 *
 * **Por qué se mudó acá.** `temas.ts` lee la ficha `RES-20` del disco, así que importa
 * `node:fs` en la primera línea y **no puede entrar al navegador**. El buscador del juego
 * de `US-02` corre justamente ahí: el jugador tipea "jijiji" y tiene que encontrar
 * *Ji ji ji*. Copiar las funciones habría dado dos verdades que se desincronizan — el
 * error exacto que `temas.ts` evita al parsear la ficha en vez de copiar la lista.
 *
 * `temas.ts` las re-exporta, así que todo lo que ya las importaba de ahí sigue igual.
 */

/** Normaliza un título para comparar: sin tildes, sin puntuación, en minúscula. */
export function normalizar(titulo: string): string {
  return titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/**
 * Normalización dura: además de tildes y puntuación, **saca los espacios**.
 *
 * Existe porque la fuente raspada parte y pega palabras donde el tracklist no lo hace
 * (`Ji JiJi` / `Jijiji`, `Todo UnPalo` / `Todo un palo`). Y sirve dos veces: para el
 * cruce de `D-13` en build, y para que el buscador del juego perdone al que escribe
 * "todounpalo" de un tirón con el pulgar.
 */
export function normalizarDuro(titulo: string): string {
  return titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '');
}

/**
 * El slug de un tema, derivado del título y de nada más.
 *
 * Es el nombre del archivo de audio (`CTR-01.4`: `/audio/fragmentos/<slug>.mp3`). Se
 * deriva en vez de guardarse para que no exista un segundo lugar donde el nombre del
 * archivo pueda contradecir al título — la misma razón por la que `CTR-03.3` no
 * redeclara el tema.
 */
export function slugDeTitulo(titulo: string): string {
  return normalizar(titulo).replace(/ /g, '-');
}
