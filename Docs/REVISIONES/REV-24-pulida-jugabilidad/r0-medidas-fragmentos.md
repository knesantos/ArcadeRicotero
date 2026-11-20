# Arranque real de los 95 fragmentos de "Adiviná el tema"

Medido por el hilo principal el 2026-11-19, decodificando cada `public/audio/fragmentos/<slug>.mp3`
con `OfflineAudioContext.decodeAudioData` en la vista previa (no hay ffmpeg en la PC, ni masters).
Ventanas de 10 ms, RMS en dBFS. Todos los fragmentos miden 10,00 s.

Columnas: primer instante sobre -45 dB (algo suena) · sobre -30 dB (se oye) · sobre -20 dB (fuerte)
· nivel medio 0–0,1 s · 0–0,5 s · 0–10 s. `-1` = nunca llega.

Los graves (paso 1 y 2 son silencio o casi):
criminal-mambo 3.43/5.81/-1 · sheriff 2.17/9.29/-1 · susanita 1.77/5.04/6.66 · gualicho 0.86/3.00/-1
· un-poco-de-amor-frances 0.84/0.90/1.80 · murga-de-la-virgencita 0.25/3.42/3.51 · el-arbol-del-gran-bonete 0.42/0.79/0.79
· invocacion 0.24/1.46/2.85 · nuotatori-professionisti 0.00/0.97/7.38 · toxi-taxi 0.12/0.77/-1 · drogocop 0.20/0.58/2.36
Bajos en el paso 1 (0–0,1 s bajo -40 dB): blues-de-la-libertad, el-lobo-caido, ella-debe-estar-tan-linda,
espejismo, pensando-como-una-acelga, rato-molhado, scaramanzia, tarea-fina, dr-saturno (todo el fragmento a -34 dB).

Tabla completa (TSV):

slug	t-45	t-30	t-20	dB0-0.1	dB0-0.5	dB0-10
alien-duce	0.02	0.03	0.03	-13.7	-15.1	-14.2
aquella-solitaria-vaca-cubana	0.01	0.02	0.03	-11.5	-12.4	-13.8
barbazul-versus-el-amor-letal	0.01	0.02	0.07	-21.3	-15.9	-15.2
blues-de-la-artilleria	0.01	0.01	0.01	-10.6	-12.7	-16.8
blues-de-la-libertad	0.09	0.11	0.13	-49.5	-21.4	-20.8
buenas-noticias	0.05	0.07	1.26	-35.2	-25.5	-23.3
cancion-para-naufragios	0.01	0.01	0.01	-10.1	-15.8	-16.5
capricho-magyar	0.01	0.01	0.01	-10.8	-16.9	-17.8
criminal-mambo	3.43	5.81	-1	-69.5	-66.7	-33.9
cruz-diablo	0.05	0.06	0.09	-26.1	-14.8	-14.7
divina-tv-fuhrer	0.01	0.02	0.04	-12.6	-15.2	-17.2
dr-saturno	0	0.26	-1	-36.5	-34.4	-34
drogocop	0.2	0.58	2.36	-68.2	-39.8	-13.6
el-arbol-del-gran-bonete	0.42	0.79	0.79	-68.5	-47.3	-21.1
el-infierno-esta-encantador-esta-noche	0	0	0	-11.2	-17.7	-17.3
el-lobo-caido	0.13	0.33	2.61	-53.1	-41.2	-19.3
el-pibe-de-los-astilleros	0.01	0.03	0.04	-11.5	-14.6	-14.4
ella-baila-con-todos	0.03	0.03	0.15	-28.3	-21.2	-24.3
ella-debe-estar-tan-linda	0.04	0.14	2.14	-43.4	-29.5	-16.2
esa-estrella-era-mi-lujo	0.01	0.02	0.03	-14.6	-16.3	-15.8
espejismo	0	0.13	0.13	-46	-15.6	-18.9
estas-frito-angelito	0.02	0.02	1.13	-23.1	-26.1	-16.5
esto-es-to-to-todo-amigos	0.01	0.03	9.66	-24.9	-24.2	-23.6
fanfarria-del-cabrio	0.08	0.08	0.09	-17	-11.4	-13.3
fuegos-de-octubre	0.01	0.01	0.03	-15.5	-14.1	-18.4
fusilados-por-la-cruz-roja	0.02	0.18	0.18	-33.5	-17	-16.5
gran-lady	0.03	0.03	1.27	-25.2	-22.9	-17.7
gualicho	0.86	3	-1	-68.6	-57.7	-30.9
heroe-del-whisky	0.01	0.02	0.06	-22.9	-21.3	-16.9
invocacion	0.24	1.46	2.85	-48.6	-47.1	-17.2
jijiji	0	0	0	-13.9	-17.5	-18.9
juguetes-perdidos	0.03	0.04	0.27	-29.1	-25.8	-21.9
la-bestia-pop	0.01	0.01	0.01	-9.8	-13.7	-17.2
la-dicha-no-es-una-cosa-alegre	0.03	0.04	0.35	-23.8	-21	-15.4
la-hija-del-fletero	0.06	0.08	3.13	-34.8	-24.1	-21.3
la-murga-de-los-renegados	0.01	0.07	0.35	-32.1	-24.2	-20.4
la-parabellum-del-buen-psicopata	0.01	0.04	0.08	-22.2	-18.3	-16.9
la-pequena-novia-del-carioca	0.02	0.03	0.03	-14.8	-15.6	-19.1
ladron-de-mi-cerebro	0	0.01	0.57	-27.9	-26.5	-22.9
las-increibles-andanzas-del-capitan-buscapina-en-cybersiberia	0.01	0.01	0.02	-12.4	-16.9	-19.5
luzbelito-y-las-sirenas	0.01	0.36	9.33	-34.1	-33	-31.8
maldicion-va-a-ser-un-dia-hermoso	0.02	0.04	0.05	-22.7	-18.3	-15.7
mariposa-pontiac-rock-del-pais	0.04	0.08	0.08	-21.2	-17.6	-15.7
masacre-en-el-puticlub	0.01	0.01	0.04	-21.7	-24.3	-20.7
me-matan-limon	0.03	0.04	0.06	-19.6	-18.3	-15.1
mi-perro-dinamita	0.01	0.01	0.01	-18.1	-20.4	-17
morta-punto-com	0.01	0.01	0.01	-12.8	-13.4	-13.7
motor-psico	0.01	0.02	1.44	-28.4	-27.1	-16.5
murga-de-la-virgencita	0.25	3.42	3.51	-68.7	-39.3	-29.7
murga-purga	0.04	0.06	9.73	-28.8	-26.3	-26
musica-para-pastillas	0.01	0.02	0.06	-21.4	-22.3	-16.6
nadie-es-perfecto	0.02	0.03	0.09	-23.7	-21	-16.7
nam-fri-frufi-fali-fru	0.01	0.04	5.2	-31.6	-32.7	-19.2
noticias-de-ayer	0.01	0.02	0.03	-13.5	-13.8	-14.1
nuestro-amo-juega-al-esclavo	0.02	0.04	0.3	-27.4	-22.7	-18.1
nueva-roma	0.02	0.07	0.07	-19.3	-14.8	-15.4
nuotatori-professionisti	0	0.97	7.38	-45.8	-42	-21.4
pensando-como-una-acelga	0.06	0.16	1.37	-42	-25.6	-21
pierre-el-vitricida	0.01	0.01	0.01	-15.4	-16.2	-17.3
pogo	0.02	0.02	0.02	-11.1	-13	-15.6
pool-averna-y-papusa	0	0.01	0.03	-21.1	-21.4	-19.7
preso-en-mi-ciudad	0.01	0.01	0.01	-12.9	-18.8	-19.1
queso-ruso	0.02	0.06	0.08	-15.5	-18.3	-20.4
rato-molhado	0.09	0.12	0.93	-41.5	-27.1	-17.9
rock-para-el-negro-atila	0.01	0.01	0.01	-15.3	-16.9	-17.2
rock-para-los-dientes	0.01	0.02	0.04	-14.2	-16.4	-15.9
rock-yugular	0.04	0.05	0.05	-11.4	-17.2	-15.8
ropa-sucia	0.02	0.02	0.05	-14.9	-14.4	-14.6
roto-y-mal-parado	0.04	0.15	3.68	-34.1	-30	-20.4
salando-las-heridas	0.04	0.07	0.08	-25.3	-20.2	-16.4
san-telmo	0.03	0.06	2.21	-31	-27.9	-21.4
scaramanzia	0.14	0.36	0.38	-58.9	-15.7	-16.8
semen-up	0.02	0.03	0.03	-21.9	-20	-18.1
sheriff	2.17	9.29	-1	-70.7	-68.3	-40
shopping-disco-zen	0.03	0.06	5.52	-29.1	-26.6	-21.4
soga-de-cain	0.06	0.17	9.1	-38.6	-31.2	-28.9
sorpresa-de-shangai	0	0.01	0.01	-12.6	-16.1	-16.3
superlogico	0.01	0.02	0.26	-33.6	-18.7	-18
susanita	1.77	5.04	6.66	-68.5	-62.8	-21.4
sushi	0.01	0.01	0.73	-25	-24.1	-20.8
tarea-fina	0.12	0.15	8.76	-51.9	-30.6	-25.9
te-voy-a-atornillar	0	0.01	0.42	-34.4	-18.8	-15.4
templo-de-momo	0.02	0.02	0.03	-12.3	-16	-13.4
todo-preso-es-politico	0.01	0.01	0.01	-13.7	-16	-13.7
todo-un-palo	0.03	0.05	0.05	-23.7	-24.2	-17.6
toxi-taxi	0.12	0.77	-1	-57.9	-44.3	-31.2
un-angel-para-tu-soledad	0.08	0.09	0.09	-26.7	-16.9	-16.3
un-pacman-en-el-savoy	0.01	0.02	0.03	-13.3	-13.9	-14.5
un-poco-de-amor-frances	0.84	0.9	1.8	-73.1	-60.2	-18.4
una-piba-con-la-remera-de-greenpeace	0.05	0.06	0.06	-12.3	-16	-18.6
unos-pocos-peligros-sensatos	0.02	0.04	0.06	-20.4	-17.7	-15.1
vamos-las-bandas	0.02	0.05	0.09	-25.3	-16.8	-14.3
vencedores-vencidos	0	0	0.01	-13.6	-17.8	-15.7
ya-nadie-va-a-escuchar-tu-remera	0.01	0.01	0.03	-12.4	-14.3	-14.5
yo-no-me-cai-del-cielo	0.01	0.01	0.01	-15.4	-18.3	-18.9
