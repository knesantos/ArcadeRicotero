import { test } from 'node:test';
import assert from 'node:assert/strict';
import { puenteDe, enlaceDePosteo } from './en-x.ts';

const SITIO = 'https://fichinricotero.com.ar';

test('el juego de siempre se postea por su puente, con el desafío detrás', () => {
  assert.equal(puenteDe(`${SITIO}/juegos/adivinar-el-tema/`), `${SITIO}/en-x/adivinar-el-tema/`);
  assert.equal(
    puenteDe(`${SITIO}/juegos/adivinar-el-tema/?d=abc`),
    `${SITIO}/en-x/adivinar-el-tema/?d=abc`,
  );
  assert.equal(puenteDe(`${SITIO}/juegos/dos-ejes/`), `${SITIO}/en-x/que-tipo-de-ricotero-sos/`);
});

test('cada postal de dos ejes va a su propia puente', () => {
  assert.equal(
    puenteDe(`${SITIO}/juegos/dos-ejes/cu-3/`),
    `${SITIO}/en-x/que-tipo-de-ricotero-sos/cu-3/`,
  );
});

test('el bestiario va por su puente, región por región y con la bestia detrás', () => {
  assert.equal(puenteDe(`${SITIO}/redondopedia/bestiario/`), `${SITIO}/en-x/bestiario/`);
  assert.equal(
    puenteDe(`${SITIO}/redondopedia/bestiario/el-monte/#lobo-suelto`),
    `${SITIO}/en-x/bestiario/el-monte/#lobo-suelto`,
  );
});

test('el resto de la Redondopedia no tiene puente', () => {
  assert.equal(puenteDe(`${SITIO}/redondopedia/oktubre/`), `${SITIO}/redondopedia/oktubre/`);
});

test('un juego sin puente vuelve como llegó', () => {
  assert.equal(puenteDe(`${SITIO}/juegos/mas-o-menos/?r=4`), `${SITIO}/juegos/mas-o-menos/?r=4`);
});

test('el posteo lleva el texto y la dirección escapados, no pegados', () => {
  const enlace = new URL(enlaceDePosteo('Me salió «Mochila liviana». ¿Y vos?', `${SITIO}/en-x/x/?a=1&b=2`));
  assert.equal(enlace.origin + enlace.pathname, 'https://x.com/intent/post');
  assert.equal(enlace.searchParams.get('text'), 'Me salió «Mochila liviana». ¿Y vos?');
  assert.equal(enlace.searchParams.get('url'), `${SITIO}/en-x/x/?a=1&b=2`);
});
