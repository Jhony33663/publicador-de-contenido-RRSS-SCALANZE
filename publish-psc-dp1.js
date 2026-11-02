import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';
import { publishToInstagram } from './publishers/instagram.js';
import { publishToTikTok } from './publishers/tiktok.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JMPUERTAG_PROFILE = path.join(__dirname, 'jmpuertag-profile');
const VIDEOS_DIR = 'C:\\Users\\jhony\\Downloads\\PSC DP1';

export const PSC_POSTS = [
  {
    id: 1,
    title: 'Desnormalización de la violencia y maltrato laboral',
    file: 'WhatsApp Video 2026-10-30 at 12.26.17 PM.mp4',
    videoPath: path.join(VIDEOS_DIR, 'WhatsApp Video 2026-10-30 at 12.26.17 PM.mp4'),
    tiktok_caption: `¿Te han dicho alguna vez "es solo una broma, no te lo tomes personal"? 🚫🛑

La humillación constante, los comentarios despectivos y la presión indebida NO son gajes del oficio ni cultura laboral. El respeto en el trabajo no es un favor que te hacen: es tu derecho humano y laboral fundamental. 🧠💼

Aprender a identificar estas conductas a tiempo es el primer paso para no tolerarlas jamás. Guarda este video y compártelo con tu equipo de trabajo. ✨

#SaludMentalLaboral #ClimaLaboral #PrestaSaludMental #AcosoLaboral #DerechosLaborales #BienestarLaboral #CulturaLaboral`,
    instagram_caption: `«Es que aquí nos llevamos pesado» o «no te tomes todo tan a pecho»... ¿te suena familiar? 👀

Normalizar el maltrato bajo la etiqueta de "broma" o "carácter fuerte" destruye silenciosamente la salud mental, desgasta la autoestima y contamina equipos enteros.

📌 Grábate esto:
1️⃣ El respeto no es un beneficio extra: es el punto de partida básico.
2️⃣ Ningún salario justifica la humillación ni la transgresión de tus límites.
3️⃣ Reconocer la violencia psicológica es el primer paso para ponerle freno.

En @prestaSaludmental promovemos entornos de trabajo donde la dignidad, la seguridad psicológica y el respeto mutuo sean la regla, nunca la excepción. 💙

💬 ¿Has presenciado o vivido situaciones así en tu empleo? Te leemos en comentarios.
📲 Guarda este Reel para cuando necesites recordar tus límites.

#SaludMentalLaboral #PrestaSaludMental #BienestarLaboral #ClimaOrganizacional #AcosoLaboral #SeguridadPsicologica #LiderazgoConsciente #RecursosHumanos #DignidadLaboral #PsicologiaOrganizacional`,
  },
  {
    id: 2,
    title: 'Cero tolerancia al acoso sexual laboral e insinuaciones',
    file: 'WhatsApp Video 2026-10-30 at 12.26.18 PM.mp4',
    videoPath: path.join(VIDEOS_DIR, 'WhatsApp Video 2026-10-30 at 12.26.18 PM.mp4'),
    tiktok_caption: `Un piropo no deseado o un mensaje fuera de lugar NO es un halago: es acoso. 🛑✋

En el ámbito laboral, los límites de tu cuerpo, tu espacio y tu tranquilidad jamás son negociables. Si una conducta, broma de doble sentido o mensaje te hace sentir incómodo o intimidado, no tienes que justificarlo ni tolerarlo.

No estás solo. Identifícalo, pon límites y alza tu voz. 🤝 Guardar y compartir para proteger tu espacio de trabajo.

#NoEsNormal #AcosoSexualLaboral #PrestaSaludMental #LimitesSanos #EspaciosSeguros #SaludMental #EmpoderamientoLaboral`,
    instagram_caption: `«Solo fue un cumplido inocente»... Cuando un comentario invade tu privacidad, tus límites o tu intimidad, NO es halago: es hostigamiento. 🚫

El acoso sexual en el ámbito laboral muchas veces se disfraza de "amabilidad", insinuaciones en pasillos o mensajes fuera de horario. 

Ten claro esto siempre:
✨ Tu derecho al respeto en el trabajo no se negocia.
✨ Tus límites personales y corporales son sagrados.
✨ No tienes la culpa ni la responsabilidad de las conductas del agresor.

Si atraviesas por esto, no guardes silencio. Existen canales y redes de apoyo listas para respaldarte. En @prestaSaludmental defendemos espacios laborales 100% seguros y con cero tolerancia al acoso. 🛡️

Comparte este mensaje: puede ser el salvavidas que alguien en tu círculo necesita hoy.

#AcosoLaboral #CeroTolerancia #PrestaSaludMental #DerechosHumanos #SaludMentalEnElTrabajo #TrabajoDigno #EspacioSeguro #PsicologiaLaboral #LimitesClaros`,
  },
  {
    id: 3,
    title: 'El rol del testigo y romper el silencio (Bystander effect)',
    file: 'WhatsApp Video 2026-10-30 at 12.26.19 PM.mp4',
    videoPath: path.join(VIDEOS_DIR, 'WhatsApp Video 2026-10-30 at 12.26.19 PM.mp4'),
    tiktok_caption: `Mirar hacia otro lado también deja consecuencias. 👁️⚡

Cuando presenciamos burlas, exclusión o humillaciones a un compañero y elegimos el silencio, la hostilidad gana terreno. Romper la indiferencia es un acto de valentía y empatía humana. 

Un solo compañero que diga "eso no está bien" o se acerque a apoyar puede cambiarlo todo. ¿Te animas a marcar la diferencia en tu oficina? 💪

#EfectoEspectador #SolidaridadLaboral #PrestaSaludMental #EmpatiaEnElTrabajo #Compañerismo #NoTeQuedesCallado #CulturaDePaz`,
    instagram_caption: `¿Qué haces cuando ves que humillan o aíslan a un compañero de trabajo? 🤔

El silencio colectivo es el terreno fértil donde florecen los agresores. En psicología laboral conocemos bien el "efecto espectador": asumir que "alguien más intervendrá" solo prolonga el daño a la víctima.

¿Cómo actuar como un aliado seguro?
🤝 Valida lo ocurrido en privado: «Vi lo que pasó, no fue justo y cuentas conmigo».
🤝 No te unas a la risa cómplice ni celebres chistes hostiles.
🤝 Si la situación lo exige, sé testigo formal en los canales institucionales.

La empatía y la solidaridad activa transforman oficinas tóxicas en comunidades humanas seguras. 🌿 @prestaSaludmental

Guarda este post y etiquétalo a ese colega que siempre cuida a los demás. 👇

#SolidaridadLaboral #EmpatiaOrganizacional #PrestaSaludMental #ClimaLaboralPositivo #CulturaOrganizacional #SaludMental #CompañerismoSano #AliadosEnElTrabajo`,
  },
  {
    id: 4,
    title: 'Comunicación consciente vs. apodos, burlas y microagresiones',
    file: 'WhatsApp Video 2026-10-30 at 12.26.21 PM.mp4',
    videoPath: path.join(VIDEOS_DIR, 'WhatsApp Video 2026-10-30 at 12.26.21 PM.mp4'),
    tiktok_caption: `"Es solo un apodo cariñoso"... ¿Seguro que a la otra persona le causa gracia? 🤐

Opinar del cuerpo ajeno, poner apodos que incomodan o lanzar comentarios machistas o discriminatorios rompe la confianza de cualquier equipo. Tus palabras tienen un impacto real y profundo: pueden impulsar o destruir la seguridad de alguien. 

Antes de hablar hoy, hazte esta pregunta: ¿Lo que voy a decir respeta la dignidad del otro? Elige construir. 🏗️✨

#ComunicacionAsertiva #PalabrasQueSuman #PrestaSaludMental #Microagresiones #RespetoLaboral #CrecimientoProfesional #LiderazgoPositivo`,
    instagram_caption: `¿Tus palabras en el trabajo construyen puentes o levantan barreras? 🗣️⚖️

Los comentarios sobre la apariencia física, los apodos no deseados y las bromas basadas en roles de género no son muestras de confianza: son microagresiones que erosionan el sentido de pertenencia y dañan la salud psicológica.

Antes de emitir un juicio en tu jornada laboral, filtra tus palabras con 3 preguntas:
1. ¿Es necesario y respetuoso?
2. ¿Respeta la dignidad y diversidad de mi colega?
3. ¿Aporta valor al clima de convivencia del equipo?

El lenguaje crea realidades. En @prestaSaludmental te invitamos a liderar con una comunicación consciente, asertiva y digna. 🤍

Comenta: ¿Qué frase te gustaría que se escuchara más seguido en tu oficina? 👇

#ComunicacionConsciente #ComunicacionAsertiva #PrestaSaludMental #SaludMentalLaboral #NoAlBullyingLaboral #InteligenciaEmocional #EquiposSanos #LiderazgoEmpatico`,
  },
  {
    id: 5,
    title: 'Rutas de atención, apoyo institucional y confidencialidad',
    file: 'WhatsApp Video 2026-10-30 at 12.26.22 PM.mp4',
    videoPath: path.join(VIDEOS_DIR, 'WhatsApp Video 2026-10-30 at 12.26.22 PM.mp4'),
    tiktok_caption: `No tienes que cargar con esto en soledad ni con miedo a represalias. 🤍🛡️

Si estás pasando por una situación de hostigamiento o violencia en tu empleo, existen protocolos estrictos de confidencialidad diseñados exclusivamente para protegerte, orientarte y brindarte apoyo profesional.

Tu voz es importante y tu bienestar emocional es la prioridad absoluta. Da el paso: acércate a los canales de atención y permite que te acompañemos. 🤝

#CanalesDeAyuda #RutasDeAtencion #PrestaSaludMental #SaludMentalLaboral #ApoyoPsicologico #NoEstasSolo #EspacioSeguro`,
    instagram_caption: `El miedo a hablar o a perder el trabajo jamás debería obligarte a tolerar situaciones que vulneren tu integridad. 🕊️

Muchas personas que experimentan violencia laboral o de género sufren en silencio porque desconocen que existen rutas formales creadas para su protección inmediata.

Lo que debes saber sobre los canales de reporte institucional:
🔒 Confidencialidad garantizada: tu testimonio y privacidad están protegidos por protocolo.
🔒 Acompañamiento integral: contención psicológica, orientación y debido proceso.
🔒 Cero tolerancia a represalias: denunciar es un derecho amparado por la ley.

Tu voz tiene poder y tu bienestar emocional es insustituible. En @prestaSaludmental estamos contigo en cada paso hacia un entorno digno y seguro. 🌿

Guarda esta publicación en tus colecciones de emergencia y compártela a quien pueda necesitar esta red de seguridad hoy mismo.

#RutasDeAtencion #CanalesSeguros #PrestaSaludMental #ApoyoEmocional #SaludMental #BienestarLaboral #RecursosHumanos #Confidencialidad #DerechoLaboral #PrevencionAcoso`,
  },
];

async function runPublisher() {
  const args = process.argv.slice(2);
  const videoArg = args.find(a => a.startsWith('--video='));
  const targetVideoId = videoArg ? parseInt(videoArg.split('=')[1], 10) : null;
  const platformArg = args.find(a => a.startsWith('--platform='));
  const targetPlatform = platformArg ? platformArg.split('=')[1].toLowerCase() : 'all'; // 'all', 'instagram', 'tiktok'
  const isHeadful = !args.includes('--headless');

  console.log('===================================================================');
  console.log('🚀 MOTOR DE PUBLICACIÓN MULTICANAL PSC DP1 · PRESTA SALUD MENTAL');
  console.log('===================================================================');
  console.log(`📁 Perfil activo: ${JMPUERTAG_PROFILE}`);
  console.log(`🎯 Modo visual: ${isHeadful ? 'Visible (Headful con bypass)' : 'Headless'}`);
  console.log(`🌐 Plataforma: ${targetPlatform.toUpperCase()}`);

  const postsToPublish = targetVideoId 
    ? PSC_POSTS.filter(p => p.id === targetVideoId)
    : PSC_POSTS;

  if (postsToPublish.length === 0) {
    console.error(`❌ No se encontró ningún post con el ID especificado (--video=${targetVideoId})`);
    process.exit(1);
  }

  console.log(`📋 Posts programados para publicar: ${postsToPublish.length}`);
  postsToPublish.forEach(p => console.log(`   [#${p.id}] ${p.title} (${p.file})`));

  console.log('\n🌐 Inicializando contexto de navegador persistente...');
  const context = await chromium.launchPersistentContext(JMPUERTAG_PROFILE, {
    headless: !isHeadful,
    viewport: { width: 1300, height: 850 },
    args: [
      '--disable-blink-features=AutomationControlled',
      '--start-maximized',
    ],
  });

  const results = [];

  try {
    for (const post of postsToPublish) {
      console.log('\n-------------------------------------------------------------------');
      console.log(`🎬 INICIANDO PUBLICACIÓN: Video #${post.id} - ${post.title}`);
      console.log(`📁 Archivo: ${post.videoPath}`);
      console.log('-------------------------------------------------------------------');

      // 1. TikTok
      if (targetPlatform === 'all' || targetPlatform === 'tiktok') {
        console.log('\n🎵 [TikTok] Publicando video...');
        try {
          const ttRes = await publishToTikTok(context, {
            caption: post.tiktok_caption,
            videoPath: post.videoPath,
          });
          results.push({ post_id: post.id, platform: 'tiktok', success: true, detail: ttRes });
          console.log(`✅ [TikTok] Video #${post.id} publicado exitosamente.`);
        } catch (ttErr) {
          console.error(`❌ [TikTok] Fallo al publicar Video #${post.id}:`, ttErr.message);
          results.push({ post_id: post.id, platform: 'tiktok', success: false, error: ttErr.message });
        }
        await new Promise(r => setTimeout(r, 6000));
      }

      // 2. Instagram
      if (targetPlatform === 'all' || targetPlatform === 'instagram') {
        console.log('\n📸 [Instagram] Publicando reel...');
        try {
          const igRes = await publishToInstagram(context, {
            caption: post.instagram_caption,
            videoPath: post.videoPath,
          });
          results.push({ post_id: post.id, platform: 'instagram', success: true, detail: igRes });
          console.log(`✅ [Instagram] Video #${post.id} publicado exitosamente.`);
        } catch (igErr) {
          console.error(`❌ [Instagram] Fallo al publicar Video #${post.id}:`, igErr.message);
          results.push({ post_id: post.id, platform: 'instagram', success: false, error: igErr.message });
        }
        await new Promise(r => setTimeout(r, 6000));
      }
    }

    console.log('\n===================================================================');
    console.log('📊 RESUMEN FINAL DE EJECUCIÓN PSC DP1:');
    console.log('===================================================================');
    console.table(results);
  } finally {
    console.log('\n🔒 Cerrando navegador persistente...');
    await context.close();
    console.log('🏁 Proceso finalizado.');
  }
}

if (process.argv[1] && process.argv[1].endsWith('publish-psc-dp1.js')) {
  runPublisher().catch(err => {
    console.error('❌ Error fatal en el motor de publicación:', err);
    process.exit(1);
  });
}
