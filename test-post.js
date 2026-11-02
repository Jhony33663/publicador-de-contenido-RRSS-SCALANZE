import axios from 'axios';

async function runTest() {
  const url = 'http://localhost:4000/api/post';

  const payload = {
    account: 'cuenta_principal',
    platforms: ['instagram', 'tiktok'],
    instagram_caption: 'Probando publicación automatizada multicanal 🚀 #SocialMediaAutomation',
    tiktok_caption: 'Automatizando contenido en TikTok con Playwright 🚀 #viral #creadores',
    // Especifica la ruta local de tu archivo multimedia (imagen o video .mp4):
    image_path: './temp/sample.jpg',
    // video_path: './temp/sample.mp4',
    headful: true, // true para ver la ventana en acción, false para segundo plano
  };

  console.log('===================================================================');
  console.log('🚀 TEST DE PUBLICACIÓN MULTICANAL (INSTAGRAM & TIKTOK)');
  console.log('===================================================================');
  console.log(`Enviando POST a ${url}...`);

  try {
    const res = await axios.post(url, payload, { timeout: 180000 });
    console.log('\n🎉 Respuesta recibida:', JSON.stringify(res.data, null, 2));
  } catch (err) {
    if (err.response) {
      console.error('\n❌ Error de la API:', err.response.status, err.response.data);
    } else {
      console.error('\n❌ Error de conexión:', err.message);
      console.log('💡 Asegúrate de iniciar la API con "npm start" antes de probar.');
    }
  }
}

runTest();
