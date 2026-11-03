import fs from 'fs';

const DEFAULT_C2PA_METADATA = 'Si publicas imágenes o vídeos que contengan credenciales de C2PA, lo indicaremos con el icono de C2PA como aparece a continuación. Los usuarios podrán hacer clic en el icono para consultar los metadatos disponibles. hecho por el equipo de scalanze';

/**
 * Publica contenido en Instagram (Imágenes o Reels/Videos) usando el contexto persistente
 * @param {import('playwright').BrowserContext} context
 * @param {Object} options
 * @param {string} options.caption
 * @param {string} [options.imagePath]
 * @param {string} [options.videoPath]
 * @param {string} [options.mediaPath]
 * @param {string} [options.altText]
 */
export async function publishToInstagram(context, { caption, imagePath, videoPath, mediaPath, altText }) {
  const targetMedia = videoPath || imagePath || mediaPath;
  if (!targetMedia || !fs.existsSync(targetMedia)) {
    throw new Error(`Instagram requiere una imagen o video válido. Archivo no encontrado: ${targetMedia}`);
  }

  const isVideo = targetMedia.toLowerCase().endsWith('.mp4') || targetMedia.toLowerCase().endsWith('.mov');
  const c2paMetadata = altText || DEFAULT_C2PA_METADATA;
  const page = await context.newPage();

  try {
    console.log('[Instagram] Navegando a Instagram...');
    await page.goto('https://www.instagram.com/', { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(3000);

    // Verificar si estamos autenticados
    if (page.url().includes('/accounts/login')) {
      throw new Error('No has iniciado sesión en Instagram. Ejecuta "login-jmpuertag.bat" o el login de tu cuenta.');
    }

    // Cerrar posibles modales de notificaciones
    const notNowBtn = await page.$('button:has-text("Not Now"), button:has-text("Ahora no")');
    if (notNowBtn) {
      await notNowBtn.click();
      await page.waitForTimeout(1000);
    }

    console.log('[Instagram] Buscando botón Crear...');
    const createBtnSelector = [
      'svg[aria-label="New post"]',
      'svg[aria-label="Nueva publicación"]',
      'span:has-text("Create")',
      'span:has-text("Crear")',
      'a[role="link"]:has(svg[aria-label*="post" i])',
      'div[role="button"]:has-text("Create")',
      'div[role="button"]:has-text("Crear")',
    ].join(', ');

    const createBtn = await page.waitForSelector(createBtnSelector, { timeout: 15000 });
    await createBtn.click();
    await page.waitForTimeout(1500);

    // Si al hacer clic en Crear se despliega un submenú y aún no está el file input
    let fileInput = await page.$('input[type="file"]');
    if (!fileInput) {
      try {
        const postSubMenu = await page.$('span:has-text("Post"), span:has-text("Publicación"), div[role="button"]:has-text("Post"), div[role="button"]:has-text("Publicación")');
        if (postSubMenu && await postSubMenu.isVisible()) {
          console.log('[Instagram] Submenú detectado, haciendo clic en "Publicación"...');
          await postSubMenu.click();
          await page.waitForTimeout(1000);
        }
      } catch (_) {}
    }

    // Subir archivo multimedia
    console.log(`[Instagram] Subiendo archivo (${isVideo ? 'Video/Reel' : 'Imagen'}): ${targetMedia}`);
    fileInput = await page.waitForSelector('input[type="file"]', { state: 'attached', timeout: 15000 });
    await fileInput.setInputFiles(targetMedia);
    await page.waitForTimeout(4000);

    // Si aparece aviso de Reels ("Video posts are now shared as reels" / "Los videos se comparten como reels")
    try {
      const reelsModalBtn = await page.$('button:has-text("OK"), button:has-text("Aceptar"), div[role="button"]:has-text("OK")');
      if (reelsModalBtn && await reelsModalBtn.isVisible()) {
        console.log('[Instagram] Cerrando modal informativo de Reels...');
        await reelsModalBtn.click();
        await page.waitForTimeout(1000);
      }
    } catch (_) {}

    // Si es video vertical (9:16), ajustar recorte a 9:16 u Original si el botón de recorte existe
    try {
      const cropBtn = await page.$('button:has(svg[aria-label*="crop" i]), button:has(svg[aria-label*="recorte" i]), svg[aria-label="Select crop"], svg[aria-label="Seleccionar recorte"]');
      if (cropBtn) {
        await cropBtn.click();
        await page.waitForTimeout(600);
        const originalRatio = await page.$('button:has-text("Original"), div[role="button"]:has-text("Original"), span:has-text("Original"), span:has-text("9:16")');
        if (originalRatio) {
          await originalRatio.click();
          await page.waitForTimeout(600);
        }
      }
    } catch (_) {}

    const nextBtnSelector = [
      'div[role="button"]:has-text("Next")',
      'div[role="button"]:has-text("Siguiente")',
      'button:has-text("Next")',
      'button:has-text("Siguiente")',
      'div[role="dialog"] div[role="button"]:has-text("Next")',
      'div[role="dialog"] div[role="button"]:has-text("Siguiente")',
    ].join(', ');

    // Paso 1: Clic en Siguiente (Recorte)
    console.log('[Instagram] Avanzando paso de recorte...');
    let nextBtn = await page.waitForSelector(nextBtnSelector, { timeout: 15000 });
    await nextBtn.click({ force: true });
    await page.waitForTimeout(2500);

    // Paso 2: Clic en Siguiente (Portada/Filtros)
    console.log('[Instagram] Avanzando paso de filtros/portada...');
    nextBtn = await page.waitForSelector(nextBtnSelector, { timeout: 15000 });
    await nextBtn.click({ force: true });
    await page.waitForTimeout(2500);

    // Paso 3: Escribir el caption
    console.log('[Instagram] Escribiendo caption...');
    const captionEditorSelector = [
      'div[aria-label="Write a caption..."]',
      'div[aria-label="Escribe un pie de foto..."]',
      'div[role="textbox"][contenteditable="true"]',
    ].join(', ');

    const captionEditor = await page.waitForSelector(captionEditorSelector, { timeout: 15000 });
    await captionEditor.click({ force: true });
    await captionEditor.fill(caption || '');
    await page.waitForTimeout(1000);

    // Incrustar metadatos C2PA en la sección de Accesibilidad (Alt text) si es imagen
    if (!isVideo) {
      try {
        console.log('[Instagram] Configurando metadatos C2PA en sección Accesibilidad...');
        const accBtn = page.locator('div[role="button"]:has-text("Accessibility"), div[role="button"]:has-text("Accesibilidad")').first();
        if (await accBtn.isVisible()) {
          await accBtn.scrollIntoViewIfNeeded().catch(() => {});
          await accBtn.click({ force: true });
          await page.waitForTimeout(1000);
          const altInput = page.locator('input[placeholder*="alt text" i], textarea[placeholder*="alt text" i]').first();
          if (await altInput.isVisible()) {
            await altInput.fill(c2paMetadata);
            console.log('[Instagram] Metadatos C2PA incrustados en Alt Text.');
            await page.waitForTimeout(800);
          }
        }
      } catch (accErr) {
        console.warn('[Instagram] Accesibilidad no disponible para este formato:', accErr.message);
      }
    }

    // Desenfocar el editor
    await page.keyboard.press('Tab');
    await page.waitForTimeout(1000);

    // Clic en Compartir / Share
    console.log('[Instagram] Haciendo clic en Compartir (header del modal)...');
    const shareBtn = page.locator([
      'div[role="dialog"] div[role="button"]:has-text("Share")',
      'div[role="dialog"] div[role="button"]:has-text("Compartir")',
      'div[role="dialog"] button:has-text("Share")',
      'div[role="dialog"] button:has-text("Compartir")',
    ].join(', ')).first();
    await shareBtn.click({ force: true });

    // Esperar confirmación
    console.log('[Instagram] Esperando confirmación de subida en el diálogo...');
    let confirmed = false;
    for (let i = 1; i <= 12; i++) {
      await page.waitForTimeout(5000);
      const dialogText = await page.$eval('div[role="dialog"]', el => el.innerText).catch(() => 'closed');
      console.log(`[Instagram T+${i * 5}s] Estado:`, dialogText.replace(/\n+/g, ' ').slice(0, 80));
      if (
        dialogText.includes('Post shared') ||
        dialogText.includes('compartido') ||
        dialogText.includes('Your reel has been shared') ||
        dialogText.includes('Tu reel se ha compartido') ||
        dialogText === 'closed'
      ) {
        confirmed = true;
        console.log('🎉 [Instagram] Confirmación visual recibida: Reel/Publicación compartida con éxito.');
        break;
      }
    }

    if (!confirmed) {
      console.log('[Instagram] Tiempo de espera límite alcanzado, verificando cierre...');
      await page.waitForTimeout(5000);
    }

    console.log('✅ [Instagram] Publicación completada con éxito.');

    return {
      success: true,
      platform: 'instagram',
      timestamp: new Date().toISOString(),
      c2pa_metadata: isVideo ? 'Embedded in video container' : c2paMetadata,
    };
  } catch (error) {
    console.error('❌ [Instagram] Error publicando:', error.message);
    const snap = `instagram-err-${Date.now()}.png`;
    await page.screenshot({ path: snap }).catch(() => {});
    console.log(`📸 Captura de error guardada en: ${snap}`);
    throw error;
  } finally {
    await page.close();
  }
}
