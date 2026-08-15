// src/data/constants.js — módulo central. Los datos pesados están en los submódulos de abajo.
export * from './animations.js'
export * from './timeline.js'
export * from './fotos.js'
export * from './cartas.js'
export * from './conquistas.js'
export * from './mapa.js'

// src/data/constants.js

/** URL pública del sitio (https://dominio.com, sin barra al final). Fallback del sitemap si SITE_URL no está en el .env / CI. */
export const SITE_ORIGIN = 'http://66.179.211.195'

/** Su nombre hoy (textos legales, créditos). */
export const NOME_ELA_COMPLETO = 'Maysa Sophia Ferreira da Silva'

/**
 * Nombre que ya acordaron (p. ej.: para cuando se casen).
 * Se usa en el slide "Futuro" y donde quieras celebrar ese acuerdo.
 */
export const NOME_ELA_FUTURO = 'Maysa Sophia Ferreira da Silva Antonaji'

/** Contador: 04/03/2026 00:00 (medianoche del día del noviazgo). */
export const INICIO_NAMORO = new Date(2026, 2, 4, 0, 0, 0)


/** Pasajes mostrados en el slide “Versículo” - `tipo`: numerados | destacado */
export const PASSAGENS_BIBLICAS = [
  {
    id: '1cor13',
    titulo: '1 Coríntios 13:4–7',
    principal: true,
    tipo: 'numerados',
    versiculos: [
      { n: '4', texto: 'El amor es paciente, el amor es bondadoso. No tiene envidia, no se jacta, no se enorgullece.' },
      { n: '5', texto: 'No maltrata, no busca sus propios intereses, no se irrita fácilmente, no guarda rencor.' },
      { n: '6', texto: 'El amor no se alegra de la injusticia, sino que se alegra con la verdad.' },
      { n: '7', texto: 'Todo lo sufre, todo lo cree, todo lo espera, todo lo soporta.' },
    ],
    nota: 'Este es uno de los versículos más importantes de nuestra historia, grabado en nuestra alianza.',
  },
  {
    id: 'ec4',
    titulo: 'Eclesiastes 4:9–12',
    tipo: 'numerados',
    versiculos: [
      { n: '9', texto: 'Mejores son dos que uno, porque tienen mejor paga de su trabajo.' },
      { n: '10', texto: 'Porque si uno cae, el otro levanta a su compañero; pero ¡ay del que está solo! Pues si cae, no habrá otro que lo levante.' },
      { n: '11', texto: 'También, si dos duermen juntos, se calientan; pero uno solo, ¿cómo se calentará?' },
      { n: '12', texto: 'Y si alguien prevalece contra uno, los dos le resistirán; y el cordón de tres dobleces no se rompe tan pronto.' },
    ],
    nota: 'Contigo, nunca camino solo. Somos más fuertes juntos.',
  },
  {
    id: 'col314',
    titulo: 'Colossenses 3:14',
    tipo: 'destaque',
    citacao: 'Por encima de todo, vístanse de amor, que es el vínculo perfecto.',
    reflexao: 'El amor como aquello que sostiene y mantiene firme la relación.',
  },
  {
    id: 'ef528',
    titulo: 'Efésios 5:28',
    tipo: 'destaque',
    citacao: 'Así deben los maridos amar a sus propias mujeres, como a sus propios cuerpos. Quien ama a su mujer, se ama a sí mismo.',
    reflexao: 'Mi promesa es amarte como Cristo amó a la Iglesia, con entrega, cuidado y fidelidad.',
  },
  {
    id: 'pv1914',
    titulo: 'Provérbios 19:14',
    tipo: 'destaque',
    citacao: 'La casa y los bienes son herencia de los padres; pero del Señor viene la esposa prudente.',
    reflexao:
      'Lo que se hereda puede medirse; lo que Dios une, no. Tú no eres una casualidad en mi vida - eres regalo de Él, sabiduría que bendice el hogar y el camino. Gratitud por cuidar nuestro amor con el corazón y con la fe.',
  },
  {
    id: 'gn224',
    titulo: 'Gênesis 2:24',
    tipo: 'destaque',
    citacao:
      'Por tanto, el hombre dejará a su padre y a su madre, y se unirá a su mujer, y serán ambos una sola carne.',
    reflexao:
      'El diseño de Dios para el amor: prioridad el uno en el otro, vínculo que no se divide. Eso es lo que quiero vivir contigo - unidad de verdad, con Cristo en el centro.',
  },
  {
    id: '1pe37',
    titulo: '1 Pedro 3:7',
    tipo: 'destaque',
    citacao:
      'De igual modo, ustedes, maridos, sean sabios en la convivencia con sus mujeres y trátenlas con honra, como a la parte más frágil y coherederas del don de la gracia de la vida, para que sus oraciones no sean interrumpidas.',
    reflexao:
      'El honor y el cuidado no son opcionales - son la manera de amar que abre espacio a Dios en medio de nosotros. Quiero ser ese esposo: presente, respetuoso y agradecido por caminar contigo en la misma herencia.',
  },
  {
    id: 'sl128',
    titulo: 'Salmos 128:1–4',
    tipo: 'numerados',
    versiculos: [
      { n: '1', texto: 'Bienaventurado aquel que teme al Señor y anda en sus caminos.' },
      { n: '2', texto: 'Pues comerás del trabajo de tus manos; feliz serás y te irá bien.' },
      { n: '3', texto: 'Tu mujer será como vid frutífera a los lados de tu casa; tus hijos, como plantas de olivo alrededor de tu mesa.' },
      { n: '4', texto: 'He aquí que así será bendecido el hombre que teme al Señor.' },
    ],
    nota: 'Cuando leo esto, solo consigo imaginar nuestro futuro con Dios en el centro.',
  },
]

export const SPOTIFY_URLS = [
  'https://open.spotify.com/embed/track/3pinR9iFoRAZvqirrRm4os',
  'https://open.spotify.com/embed/track/7FOPTUmEJ3ByYW9ag9cZJ3',
  'https://open.spotify.com/embed/track/0uwaiApk6k7k9POyFjTKeR',
  'https://open.spotify.com/embed/track/6ccKu0LwJzOhLAxBwP2PTk',
  'https://open.spotify.com/embed/track/2WViLEKp7hWDJQbowxqzba',
  'https://open.spotify.com/embed/track/0A8K5i1KBtY3ztMETimVCK',
  'https://open.spotify.com/embed/track/1DLKuppSYytOuxhtI6KBGu',
  'https://open.spotify.com/embed/track/352FuGmGJClPjojSYjNrXG',
  'https://open.spotify.com/embed/track/1og6YRY01JKaIDjSGVM8FZ',
  'https://open.spotify.com/embed/track/3PlKQNlbL4767rND3HnqSI',
  'https://open.spotify.com/embed/track/6eDApnV9Jdb1nYahOlbbUh',
]


export const SLIDE_IDS = [
  'intro', 'timer', 'antesdepois', 'musica', 'carta', 'tags',
  'versiculo', 'momentos',
  'historia', 'mapa',
  'presentefotos',
  'promessas', 'motivos', 'futuro', 'recado', 'creditos', 'cartas', 'bucketlist', 'conquistas', 'final',
]

/**
 * 100 motivos para amar - mostrados en el slide "Motivos".
 * ✏️ Edita, agrega o quita a gusto.
 */
export const MOTIVOS_TE_AMO = [
  'Porque me acercas a Dios.',
  'Porque tu sonrisa cambia mi día.',
  'Porque cuidas de quienes amas.',
  'Porque me haces querer ser mejor.',
  'Porque me traes paz.',
  'Porque crees en mí.',
  'Porque me animas a crecer.',
  'Porque tu abrazo parece casa.',
  'Porque eres amable con las personas.',
  'Porque tienes un corazón enorme.',
  'Porque me haces reír hasta en los días difíciles.',
  'Porque me escuchas de verdad.',
  'Porque eres fuerte incluso cuando crees que no lo eres.',
  'Porque estoy seguro de que serás la madre más increíble del mundo.',
  'Porque amas a Dios por encima de todo.',
  'Porque me haces sentir amado.',
  'Porque eres cariñosa en los detalles.',
  'Porque te preocupas por mí.',
  'Porque oras por mí.',
  'Porque me inspiras.',
  'Porque eres hermosa por dentro y por fuera.',
  'Porque eres sincera.',
  'Porque me entiendes.',
  'Porque me acoges en mis días malos.',
  'Porque celebras mis logros.',
  'Porque me ayudas a ver el lado bueno de las cosas.',
  'Porque tienes una sonrisa encantadora.',
  'Porque tu voz me calma.',
  'Porque eres dedicada.',
  'Porque eres determinada.',
  'Porque eres una mujer admirable.',
  'Porque me haces sentir especial.',
  'Porque me haces soñar con el futuro.',
  'Porque eres mi puerto seguro.',
  'Porque eres paciente conmigo.',
  'Porque tienes un corazón sensible.',
  'Porque valoras a la familia.',
  'Porque me aceptas tal como soy.',
  'Porque me ayudas a ser una mejor versión de mí.',
  'Porque eres compañera.',
  'Porque me apoyas en mis proyectos.',
  'Porque me haces creer en el amor.',
  'Porque me enseñas cosas nuevas.',
  'Porque te importan los pequeños detalles.',
  'Porque no te rindes fácilmente.',
  'Porque eres valiente.',
  'Porque tienes una fe inspiradora.',
  'Porque me haces sentir en paz.',
  'Porque cuidas tan bien a tus hermanas.',
  'Porque tienes una manera única de demostrar amor.',
  'Porque alegras mis días.',
  'Porque me haces sonreír sin que lo notes.',
  'Porque eres verdadera.',
  'Porque me tratas con respeto.',
  'Porque eres dulce.',
  'Porque tienes un corazón puro.',
  'Porque eres una bendición en mi vida.',
  'Porque me haces sentir en casa.',
  'Porque compartes tus sueños conmigo.',
  'Porque me permites compartir los míos.',
  'Porque eres mi mejor amiga.',
  'Porque me entiendes hasta cuando no logro explicarme.',
  'Porque me muestras el amor de Dios a través de tus actitudes.',
  'Porque te preocupas por quienes están a tu alrededor.',
  'Porque tienes una mirada que transmite cariño.',
  'Porque eres especial de una manera imposible de explicar.',
  'Porque eres fuerte en los momentos difíciles.',
  'Porque me das motivos para agradecer todos los días.',
  'Porque me ayudas a ver propósito en las cosas.',
  'Porque me animas espiritualmente.',
  'Porque eres humilde.',
  'Porque me haces sentir importante.',
  'Porque te importan mis sentimientos.',
  'Porque me ayudas a enfrentar los desafíos.',
  'Porque eres dedicada a lo que amas.',
  'Porque tienes un corazón de sierva.',
  'Porque me inspiras a amar más.',
  'Porque me inspiras a perdonar más.',
  'Porque me inspiras a confiar más en Dios.',
  'Porque tienes una forma hermosa de demostrar gratitud.',
  'Porque te alegras con las cosas simples.',
  'Porque haces que cualquier lugar sea mejor.',
  'Porque me ayudas a encontrar calma en el caos.',
  'Porque eres una mujer virtuosa.',
  'Porque me haces querer construir una vida a tu lado.',
  'Porque me haces creer que vale la pena luchar por el amor.',
  'Porque me haces sentir orgullo.',
  'Porque eres una respuesta a mis oraciones.',
  'Porque me haces ver belleza en la rutina.',
  'Porque eres paciente con la Duda.',
  'Porque tienes un amor genuino por las personas.',
  'Porque me enseñas con el ejemplo.',
  'Porque me haces sentir amado incluso en mis días más difíciles.',
  'Porque nunca dejas de intentar.',
  'Porque eres una guerrera.',
  'Porque me ayudas a ser un mejor hombre.',
  'Porque hiciste mi vida más hermosa.',
  'Porque formas parte de mis mejores sueños.',
  'Porque admiro a la mujer que eres.',
  'Porque, después de todo esto, sigo encontrando nuevos motivos para amarte todos los días. ❤️',
]

/**
 * Créditos finales - estilo cierre de película.
 * ✏️ Edita nombres y notas como quieras.
 */
export const CREDITOS = [
  {
    categoria: 'Un mensaje que lo cambió todo',
    itens: [
      {
        papel: 'La madre que no dejó ignorar al pobrecito',
        nome: 'Su madre',
        nota: 'Sin esa respuesta, nada de esto habría comenzado. Gracias desde el fondo del corazón.',
      },
    ],
  },
  {
    categoria: 'El pedido de noviazgo',
    itens: [
      {
        papel: 'La cómplice que hizo todo posible',
        nome: 'Talita',
        nota: 'Ayudó a acercarnos, ayudó a elegir las alianzas, los lugares, y estuvo en cada detalle que hizo posible este amor',
      },
      {
        papel: 'Camarero que entró en el plan sin dudarlo',
        nome: 'Camarero del João Julhão',
        nota: 'Por hacer que la escena más especial sucediera de la manera correcta',
      },
    ],
  },
  {
    categoria: 'Parte de nuestra historia',
    itens: [
      {
        papel: 'Donde dos corazones comenzaron a acercarse',
        nome: 'Comunidade Apascentar',
        nota: 'El campamento de febrero de 2026 que sembró todo esto',
      },
    ],
  },
  {
    categoria: 'Dirección general',
    itens: [
      {
        papel: 'Autor, Director y Realizador',
        nome: 'Dios',
        nota: 'Que escribió esta historia mucho antes que nosotros y cuidó cada detalle del camino',
      },
    ],
  },
]

/** Bloque Antes de ti / Después de ti (slide dedicado). */
export const ANTES_DEPOIS = {
  antesTitulo: 'Antes de ti',
  depoisTitulo: 'Después de ti',
  antes: [
    'Corría tras mis objetivos, pero muchas veces en automático',
    'La fe existía, pero no siempre guiaba mis decisiones',
    'Los logros eran importantes, pero faltaba algo que de verdad me llenara',
    'Días buenos… pero sin alguien con quien compartirlo todo de forma completa',
    'Sabía a dónde quería llegar, pero no con quién construir',
  ],
  depois: [
    'Mi vida ganó sentido, dirección y propósito de verdad',
    'Empecé a vivir con Dios en el centro y con el corazón más alineado',
    'Ya no se trata solo de lograr… se trata de construir juntos',
    'Encontré paz, ligereza y un amor que me acerca a quien quiero ser',
    'Hoy no camino solo… te tengo a ti, y eso lo cambia todo',
    'Los sueños dejaron de ser solo míos - ahora son nuestros 💍',
  ],
}

/** Emoji de ambiente por slide (mismo orden que SLIDE_IDS). glow = niebla del color del gradiente del fondo. */
export const SLIDE_AMBIENCE = [
  { emoji: '🌹', glow: 'rgba(251, 113, 133, 0.42)' },
  { emoji: '⏳', glow: 'rgba(212, 175, 55, 0.38)' },
  { emoji: '🌗', glow: 'rgba(52, 211, 153, 0.42)' },
  { emoji: '🎵', glow: 'rgba(167, 139, 250, 0.4)' },
  { emoji: '💌', glow: 'rgba(252, 211, 77, 0.38)' },
  { emoji: '✨', glow: 'rgba(244, 114, 182, 0.4)' },
  { emoji: '✝️', glow: 'rgba(129, 140, 248, 0.42)' },
  { emoji: '📸', glow: 'rgba(167, 139, 250, 0.28)' },
  { emoji: '📖', glow: 'rgba(212, 175, 55, 0.36)' },
  { emoji: '🗺️', glow: 'rgba(99, 102, 241, 0.38)' },
  { emoji: '💐', glow: 'rgba(251, 182, 193, 0.36)' },
  { emoji: '🌿', glow: 'rgba(52, 211, 153, 0.38)' },
  { emoji: '🦋', glow: 'rgba(244, 114, 182, 0.40)' },
  { emoji: '🌅', glow: 'rgba(59, 130, 246, 0.4)' },
  { emoji: '💬', glow: 'rgba(244, 114, 182, 0.35)' },
  { emoji: '🎬', glow: 'rgba(212, 175, 55, 0.38)' },
  { emoji: '📜', glow: 'rgba(212, 175, 55, 0.40)' },
  { emoji: '✅', glow: 'rgba(52, 211, 153, 0.38)' },
  { emoji: '🏆', glow: 'rgba(251, 191, 36, 0.44)' },
  { emoji: '💝', glow: 'rgba(251, 113, 133, 0.45)' },
]

/**
 * Lugares de nuestra historia mostrados en el slide "Mapa".
 * coords: [lat, lng]  (copiado de Google Maps / OpenStreetMap)
 * foto: ruta relativa a /public
 */
