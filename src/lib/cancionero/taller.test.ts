import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  senalDeTaller,
  motivosDeTaller,
  sinEtiquetaFinal,
  esTituloDePagina,
} from './taller.ts';

/** Atajo: qué líneas de una tanda quedan marcadas como nota. */
function marcadas(textos: readonly string[]): string[] {
  const lineas = textos.map((texto) => ({ t: 'letra', texto }));
  const motivos = motivosDeTaller(lineas);
  return textos.filter((_, i) => motivos[i] !== null);
}

test('el vocabulario de taller marca la linea sola', () => {
  for (const x of [
    'Hay que tocar acordes',
    'En la 5ta cuerda traste 8',
    'un arpegio con los mismos tonos así:',
    'A este tema lo tienen que tocar con cejilla para que suene bien',
    'Es mejor hacerlo con quintas y, obviamente, bastante distorsionado.',
    'pentatonica de Am',
    'En una transcripcion dice F#m pero queda mejo F#',
  ]) {
    assert.equal(senalDeTaller(x), 'fuerte', `deberia ser fuerte: ${JSON.stringify(x)}`);
  }
});

test('el mensaje que no es del tema se marca solo', () => {
  for (const x of [
    'Espero que les guste :)',
    'TodoUnPalo:Si Tecabe, mandame un mail asi nos intercambiamos temasos.',
    'un saludo para el fan n°1 de los redondos , para vos yamo',
    'Tabbed by maria de los angeles cambra : *',
    'Escuchen el tema. Se van a dar cuenta.',
    '*yo tampoco crei que se podia tocar con guitarra...',
  ]) {
    assert.equal(senalDeTaller(x), 'fuerte', `deberia ser fuerte: ${JSON.stringify(x)}`);
  }
});

test('el tramo sin voz se marca: era el caso que rompia el juego de la letra', () => {
  for (const x of ['Instrumental en Bbm - F# - F', '[Interludio] Am  F  G  E7', '[Instrumental]']) {
    assert.equal(senalDeTaller(x), 'fuerte', `deberia ser fuerte: ${JSON.stringify(x)}`);
  }
});

test('el acorde escrito solo no alcanza: hace falta que algo lo explique', () => {
  // Una cifra suelta ya la caza `anotacion.ts`; acá se busca la prosa del que explica.
  assert.equal(senalDeTaller('Solo con base en E5'), 'fuerte');
  assert.equal(senalDeTaller('Un LAm. se repite durante 3'), 'fuerte');
  assert.equal(senalDeTaller('Acá sigue con la misma base'), 'fuerte');
});

test('el verso cantado no se marca, aunque hable de guitarras y de bajos', () => {
  for (const x of [
    'y bajo nuestro pulgar.',
    'Bajo este pulso',
    'Solo un buen gesto',
    'Contra las cuerdas vas a desafinar',
    'Quien toca asi el tambior',
    'Y ahora tiro yo, porque me toca',
    'Toda esa batería',
    'Y gracias por el trago, man.',
    'Y aquí ¡gracias a Dios!',
    'sheriff! sheriff! sheriff!',
    'De viejas feas como monos, puaj.',
  ]) {
    assert.notEqual(senalDeTaller(x), 'fuerte', `no deberia ser fuerte: ${JSON.stringify(x)}`);
  }
});

test('el rotulo de tramo adentro de una frase larga no alcanza para marcar', () => {
  // *Pool, Averna y papusa*: "Un killer riff en su contestador / dejo sonando como
  // confesión" es un verso. La misma palabra en un rótulo corto sí marca.
  assert.notEqual(senalDeTaller('Un killer riff en su contestador'), 'fuerte');
  assert.equal(senalDeTaller('Con Riff 2'), 'fuerte');
  assert.equal(senalDeTaller('En la intro'), 'fuerte');
  assert.equal(senalDeTaller('- En el estribillo es regido'), 'fuerte');
});

test('la etiqueta pegada al final se corta y el verso se queda', () => {
  assert.equal(
    sinEtiquetaFinal('Ay, ay, ay que risa le da! Riff 1'),
    'Ay, ay, ay que risa le da!',
  );
  assert.equal(sinEtiquetaFinal('Ay! Ay! Ay! ésa lágrima! Riff 1'), 'Ay! Ay! Ay! ésa lágrima!');
  assert.notEqual(senalDeTaller('Ay, ay, ay que risa le da! Riff 1'), 'fuerte');
});

test('la etiqueta no se corta si podria ser la ultima palabra cantada', () => {
  // Sin puntuación ni sangría de por medio no hay etiqueta: hay una frase que termina.
  for (const x of [
    'y repite hasta el final',
    'Y ya no queres que te',
    'Que ruede la bola! El zumba se va',
  ]) {
    assert.equal(sinEtiquetaFinal(x), x, `no se deberia cortar: ${JSON.stringify(x)}`);
  }
});

test('el bloque arrastra a los renglones que solos no tienen firma', () => {
  // El párrafo de *Salando las heridas*. "Compases" y "El bajo" no tienen ninguna señal
  // propia; caen porque el bloque entero es una nota.
  const bloque = [
    'Aclaración',
    'La parte en la que',
    'Hay que tocar acordes',
    'Que no sean desplegados',
    'El acorde base es un Lam',
    'Que va cambiando',
    'El bajo',
  ];
  assert.deepEqual(marcadas(bloque), bloque);
});

test('un renglon de taller pegado a versos cantados cae solo, y los versos se quedan', () => {
  // La mayoría es lo que protege la letra: 1 de 9 no arrastra a nadie.
  const lineas = [
    'Acá sigue con la misma base',
    'Apuntamos a tu nariz',
    'Undimos tus pomulos',
    'Y vos resplandecias',
    'No te quedo',
    'Sueño por vengar',
    'Y ya no esperas',
    'Que te jueguen',
    'Limpio nunca mas!',
  ];
  assert.deepEqual(marcadas(lineas), ['Acá sigue con la misma base']);
});

test('el renglon en blanco y la tablatura cortan el bloque', () => {
  // Sin el corte, una nota contagiaría la estrofa de al lado.
  const lineas = [
    { t: 'letra', texto: 'Hay que tocar acordes' },
    { t: 'letra', texto: 'El bajo' },
    { t: 'tab', texto: 'E|---3---5---|' },
    { t: 'letra', texto: 'Un dia el bote volco' },
    { t: 'letra', texto: 'Y el premio a pique se fue' },
  ];
  const motivos = motivosDeTaller(lineas);
  assert.notEqual(motivos[0], null);
  assert.notEqual(motivos[1], null);
  assert.equal(motivos[3], null);
  assert.equal(motivos[4], null);
});

test('el FIN. del transcriptor no es un verso, pero el fin cantado si', () => {
  assert.equal(senalDeTaller('FIN.'), 'fuerte');
  assert.equal(senalDeTaller('FIN'), 'fuerte');
  assert.notEqual(senalDeTaller('y este es el fin de la joda'), 'fuerte');
  assert.notEqual(senalDeTaller('Fin de semana'), 'fuerte');
});

test('el titulo de la pagina no es el primer verso', () => {
  assert.ok(esTituloDePagina('SAN TELMO', 'San Telmo'));
  // Angosta a propósito: un tema puede cantar su nombre, y varios lo hacen.
  assert.ok(!esTituloDePagina('Lavi Rap', 'Lavi rap'));
  assert.ok(!esTituloDePagina('Drogocop, oh', 'Drogocop'));
});

test('el cancionero publicado no tiene notas del transcriptor sueltas en la letra', () => {
  // La red sobre la ingesta: si alguien regenera `cancionero.json` con la regla vieja,
  // o si una fuente nueva trae un párrafo de taller, esto lo agarra antes del build.
  const d = JSON.parse(readFileSync('src/data/cancionero.json', 'utf-8'));
  const sueltas: string[] = [];
  for (const tema of d.temas) {
    for (const seccion of tema.secciones) {
      const motivos = motivosDeTaller(seccion.lineas);
      seccion.lineas.forEach((l: { t: string; texto?: string }, i: number) => {
        if (l.t === 'letra' && motivos[i] !== null) sueltas.push(`${tema.slug}: ${l.texto}`);
      });
    }
  }
  assert.deepEqual(sueltas, [], 'correr `npm run ingerir` y regenerar los bancos');
});

test('en la letra publicada no quedo ningun retorno de carro', () => {
  const d = JSON.parse(readFileSync('src/data/cancionero.json', 'utf-8'));
  for (const tema of d.temas) {
    for (const seccion of tema.secciones) {
      for (const l of seccion.lineas) {
        assert.ok(!/\r/.test(l.texto ?? ''), `${tema.slug} trae \\r: ${JSON.stringify(l.texto)}`);
      }
    }
  }
});
