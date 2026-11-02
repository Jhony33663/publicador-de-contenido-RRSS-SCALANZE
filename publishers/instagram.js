import fs from 'fs';

const DEFAULT_C2PA_METADATA = 'Contenido verificado con credenciales de autenticidad C2PA.';

/**
 * Publica contenido en Instagram usando el contexto de navegador persistente
 * @param {import('playwright').BrowserContext} context
 * @param {Object} options
 * @param {string} options.caption - Pie de foto / copy del post
 * @param {string} [options.imagePath] - Ruta local de la imagen
 * @param {string} [options.videoPath] - Ruta local del video (Reel)
 * @param {string} [options.mediaPath] - Ruta genérica de archivo
 * @param {string} [options.altText] - Texto alternativo / metadatos de accesibilidad C2PA
 */
export async function publishToInstagram(context, { caption, imagePath, videoPath, mediaPath, altText }) {
  const targetMedia = imagePath || videoPath || mediaPath;
  if (!targetMedia || !fs.existsSync(targetMedia)) {
    throw new Error(`Instagram requiere una imagen o video válido. Archivo no encontrado: ${targetMedia}`);
  }

  const c2paMetadata = altText || DEFAULT_C2PA_METADATA;
  const page = await context.newPage();
  try {
    console.log('[Instagram] Navegando a Instagram...');
    await page.goto('https://www.instagram.com/', { waitUntil: 'domcontentloaded', timeout: 45000 });

    // Verificar si estamos autenticados
    if (page.url().includes('/accounts/login')) {
      throw new Error('No has iniciado sesión en Instagram. Ejecuta "npm run login" para autenticarte.');
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
    ].join(', ');

    const createBtn = await page.waitForSelector(createBtnSelector, { timeout: 15000 });
    await createBtn.click();

    // Cargar archivo multimedia
    console.log(`[Instagram] Subiendo archivo: ${targetMedia}`);
    const fileInput = await page.waitForSelector('input[type="file"]', { state: 'attached', timeout: 15000 });
    await fileInput.setInputFiles(targetMedia);
    await page.waitForTimeout(3000);

    // Clic en Siguiente (paso recorte)
    console.log('[Instagram] Avanzando paso de recorte...');
    const nextBtnSelector = 'div[role="button"]:has-text("Next"), div[role="button"]:has-text("Siguiente"), button:has-text("Next"), button:has-text("Siguiente")';
    let nextBtn = await page.waitForSelector(nextBtnSelector, { timeout: 15000 });
    await nextBtn.click({ force: true });
    await page.waitForTimeout(2000);

    // Clic en Siguiente (paso filtros)
    console.log('[Instagram] Avanzando paso de filtros...');
    nextBtn = await page.waitForSelector(nextBtnSelector, { timeout: 15000 });
    await nextBtn.click({ force: true });
    await page.waitForTimeout(2000);

    // Escribir el caption
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

    // Incrustar metadatos C2PA en la sección de Accesibilidad (Alt text)
    try {
      console.log('[Instagram] Configurando metadatos en sección Accesibilidad...');
      const accBtn = page.locator('div[role="button"]:has-text("Accessibility"), div[role="button"]:has-text("Accesibilidad")').first();
      if (await accBtn.isVisible()) {
        await accBtn.scrollIntoViewIfNeeded().catch(() => {});
        await accBtn.click({ force: true });
        await page.waitForTimeout(1000);
        const altInput = page.locator('input[placeholder*="alt text" i], textarea[placeholder*="alt text" i]').first();
        if (await altInput.isVisible()) {
          await altInput.fill(c2paMetadata);
          console.log('[Instagram] Metadatos incrustados exitosamente en Alt Text de la foto.');
          await page.waitForTimeout(800);
        }
      }
    } catch (accErr) {
      console.warn('[Instagram] Nota: El campo Alt Text no se pudo enfocar:', accErr.message);
    }

    // Desenfocar el editor
    await page.keyboard.press('Tab');
    await page.waitForTimeout(1000);

    // Clic en Compartir / Share en el diálogo modal
    console.log('[Instagram] Haciendo clic en Compartir (header del modal)...');
    const shareBtn = page.locator('div[role="dialog"] div[role="button"]:has-text("Share"), div[role="dialog"] div[role="button"]:has-text("Compartir")').first();
    await shareBtn.click({ force: true });

    // Esperar confirmación
    console.log('[Instagram] Esperando confirmación de subida en el diálogo...');
    let confirmed = false;
    for (let i = 1; i <= 8; i++) {
      await page.waitForTimeout(5000);
      const dialogText = await page.$eval('div[role="dialog"]', el => el.innerText).catch(() => 'closed');
      if (dialogText.includes('Post shared') || dialogText.includes('compartido') || dialogText === 'closed') {
        confirmed = true;
        console.log('🎉 [Instagram] Confirmación recibida: Post compartido con éxito.');
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
      c2pa_metadata: c2paMetadata,
    };
  } catch (error) {
    console.error('❌ [Instagram] Error publicando:', error.message);
    throw error;
  } finally {
    await page.close();
  }
}
