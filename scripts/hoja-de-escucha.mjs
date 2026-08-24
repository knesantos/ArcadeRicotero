/**
 * Arma la hoja de escucha del juego de completar la letra (`US-03`, `CTR-04`).
 *
 * ─── Para qué existe ───────────────────────────────────────────────────────────────
 *
 * `CTR-04` no deja jugar un verso que nadie escuchó, y no hay atajo: los 105 temas de
 * `RES-20` tienen **una sola** fuente de letra cada uno —letras.com aportó 16 y
 * cifraclub 88, con solapamiento cero—, así que la puerta de "dos fichas de letra" hoy
 * no la cruza ningún ítem. Queda la otra: alguien pone el disco.
 *
 * El costo real de eso no es escuchar, es la contabilidad. Confirmar veinte versos a
 * mano son veinte objetos JSON idénticos salvo un campo, y lo que se copia veinte veces
 * se llena por inercia — que es exactamente lo que `minuto` fue diseñado para impedir.
 *
 * Este script se lleva la contabilidad. Elige un puñado de versos bien repartidos, los
 * deja anotados en `letra-confirmaciones.json` con el minuto en blanco (`_:__`), e
 * imprime la lista para tener al lado mientras suena el disco. Después se completa un
 * minuto por renglón y se corre `npm run generar-letra`.
 *
 * **Lo que no hace, y no lo va a hacer nunca: poner el minuto.** Ese campo es la
 * diferencia entre una confirmación y un tilde.
 *
 * ─── Cómo elige ────────────────────────────────────────────────────────────────────
 *
 * Reparte por tema y por nivel. Por tema, para que la primera partida no sean diez
 * versos del mismo tema. Por nivel, porque `BR-03` mezcla los tres y los difíciles son
 * los escasos: de 313 candidatos hay 262 fáciles, y si se elige al azar salen todos
 * fáciles.
 *
 * Correr desde la raíz:  npm run hoja-de-escucha [cuántos]
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const BANCO = 'src/data/letra.json';
const CONFIRMACIONES = 'src/data/letra-confirmaciones.json';

/** El piso de `US-03` es 15. Se anotan algunos de más porque alguno no se va a encontrar. */
const CUANTOS_POR_DEFECTO = 24;

/** Difícil primero: es el nivel escaso y el que hay que ir a buscar a propósito. */
const NIVELES = ['dificil', 'media', 'facil'];

/** El verso como se lee en la hoja, con la respuesta a la vista para poder verificarla. */
function renglon(item) {
  const { antes, respuesta, despues } = item.hueco;
  return `${antes} [${respuesta}] ${despues}`.replace(/\s+/g, ' ').trim();
}

/**
 * Elige `cuantos` ítems repartidos por nivel y por tema.
 *
 * Va por rondas: en cada ronda toma un ítem de cada tema, empezando por el nivel más
 * escaso. Si un nivel se agota antes de llenar su cupo, lo que sobra se reparte entre
 * los otros — mejor una hoja completa con la mezcla torcida que una hoja corta.
 */
function elegir(items, cuantos) {
  const porTemaYNivel = new Map();
  for (const it of items) {
    const clave = `${it.tema.slug}|${it.dificultad}`;
    (porTemaYNivel.get(clave) ?? porTemaYNivel.set(clave, []).get(clave)).push(it);
  }
  const temas = [...new Set(items.map((i) => i.tema.slug))].sort();

  // Cuántos versos lleva cada tema. **Siempre gana el tema que menos lleva**: es lo que
  // hace que 24 versos toquen los 14 temas en vez de agotar los primeros ocho, que es lo
  // que pasaba recorriendo los temas en orden dentro de cada nivel.
  const lleva = new Map(temas.map((t) => [t, 0]));
  const elegidos = [];
  const cupos = NIVELES.map(
    (_, i) => Math.floor(cuantos / NIVELES.length) + (i === NIVELES.length - 1 ? cuantos % NIVELES.length : 0),
  );

  for (const [i, nivel] of NIVELES.entries()) {
    let faltan = cupos[i];
    while (faltan > 0) {
      const conStock = temas.filter((t) => porTemaYNivel.get(`${t}|${nivel}`)?.length);
      if (!conStock.length) break;
      conStock.sort((a, b) => lleva.get(a) - lleva.get(b) || a.localeCompare(b));
      const tema = conStock[0];
      elegidos.push(porTemaYNivel.get(`${tema}|${nivel}`).shift());
      lleva.set(tema, lleva.get(tema) + 1);
      faltan--;
    }
    // Lo que este nivel no pudo llenar se lo queda el siguiente. Los difíciles son
    // escasos y se agotan: mejor una hoja completa con la mezcla torcida que una corta.
    if (faltan > 0 && i + 1 < NIVELES.length) cupos[i + 1] += faltan;
  }

  return elegidos;
}

function main() {
  if (!existsSync(BANCO)) {
    console.error(`✕ No existe ${BANCO}. Corré primero: npm run generar-letra`);
    process.exit(1);
  }

  const cuantos = Number(process.argv[2]) || CUANTOS_POR_DEFECTO;
  const banco = JSON.parse(readFileSync(BANCO, 'utf-8'));
  const archivo = existsSync(CONFIRMACIONES)
    ? JSON.parse(readFileSync(CONFIRMACIONES, 'utf-8'))
    : {};
  const yaAnotados = archivo.confirmados ?? {};

  // Un verso ya anotado no se vuelve a anotar, esté escuchado o no.
  const candidatos = banco.items.filter((i) => i.estado === 'borrador' && !(i.id in yaAnotados));
  if (candidatos.length === 0) {
    console.log('No queda ningún candidato sin anotar. Todo lo que hay ya está en la hoja.');
    return;
  }

  const elegidos = elegir(candidatos, Math.min(cuantos, candidatos.length));
  const hoy = new Date().toISOString().slice(0, 10);

  archivo.porDefecto = {
    quien: archivo.porDefecto?.quien ?? 'Santiago',
    fecha: hoy,
    donde: archivo.porDefecto?.donde ?? 'streaming',
  };
  archivo.confirmados = { ...yaAnotados };
  // El verso queda anotado al lado de la confirmación por dos motivos: para que al abrir
  // el JSON se vea qué hay que escuchar sin ir a buscarlo, y como huella — `generar-letra`
  // la compara y avisa si un banco regenerado corrió los ids debajo de una confirmación.
  archivo.versos = { ...(archivo.versos ?? {}) };
  for (const it of elegidos) {
    archivo.confirmados[it.id] = '_:__';
    archivo.versos[it.id] = renglon(it);
  }

  writeFileSync(CONFIRMACIONES, JSON.stringify(archivo, null, 2) + '\n', 'utf-8');

  // ─── La hoja ─────────────────────────────────────────────────────────────────────
  const porTema = new Map();
  for (const it of elegidos) {
    const clave = `${it.tema.titulo}|${it.tema.disco}|${it.tema.pista}`;
    (porTema.get(clave) ?? porTema.set(clave, []).get(clave)).push(it);
  }

  console.log(`\nHOJA DE ESCUCHA — ${elegidos.length} versos, ${porTema.size} temas`);
  console.log(`Escuchá cada uno, anotá el minuto en ${CONFIRMACIONES} y corré: npm run generar-letra`);
  console.log('='.repeat(78));

  for (const [clave, items] of porTema) {
    const [titulo, disco, pista] = clave.split('|');
    console.log(`\n  ${titulo.toUpperCase()}   ·   ${disco}, pista ${pista}`);
    for (const it of items) {
      console.log(`    ${it.id}  _:__   (${it.dificultad})`);
      console.log(`            ${renglon(it)}`);
    }
  }

  console.log('\n' + '='.repeat(78));
  console.log(`Quién y dónde salen de "porDefecto" (${archivo.porDefecto.quien}, ${archivo.porDefecto.donde}).`);
  console.log('Si escuchaste alguno en otro lado, reemplazá el "_:__" por el objeto entero.');
  console.log('El minuto no tiene defecto y no se autocompleta: es lo que separa el haber');
  console.log('escuchado del haber puesto un tilde. Un verso que no encontrás, se deja en _:__.\n');
}

main();
