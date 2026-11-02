import fs from 'fs';

/**
 * Publica contenido en Facebook usando el contexto de navegador persistente
 * @param {import('playwright').BrowserContext} context
 * @param {Object} options
 * @param {string} options.text - Texto o copy de la publicación
 * @param {string} [options.imagePath] - Ruta local de la imagen adjunta
 * @param {string} [options.targetUrl] - URL de la Página de Facebook
 */
export async function publishToFacebook(context, { text, imagePath, targetUrl }) {
  const page = await context.newPage();
  const destUrl = targetUrl || 'https://www.facebook.com/';

  try {
    console.log(`[Facebook] Navegando a ${destUrl}...`);
    await page.goto(destUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(3500);

    // 1. Verificar si estamos autenticados
    if (page.url().includes('/login') || page.url().includes('/checkpoint')) {
      throw new Error('No has iniciado sesión en Facebook. Ejecuta "npm run login" para autenticarte.');
    }

    // 2. Gestionar cambio de perfil a la Página si aplica
    const initialSwitch = await page.$('div[role="button"]:has-text("Cambiar"), div[aria-label*="Cambiar" i]');
    if (initialSwitch) {
      console.log('[Facebook] Detectado botón para cambiar a perfil de la página...');
      await initialSwitch.click().catch(() => {});
      await page.waitForTimeout(2000);
    }

    const confirmSwitchBtn = await page.$('div[role="dialog"] div[role="button"]:has-text("Cambiar"), div[role="dialog"] [aria-label="Cambiar"]');
    if (confirmSwitchBtn) {
      console.log('[Facebook] Confirmando cambio de perfil...');
      await confirmSwitchBtn.click().catch(() => {});
      await page.waitForTimeout(4000);
    }

    // Modal de bienvenida
    const usePageBtn = await page.$('div[role="dialog"] div[role="button"]:has-text("Usar página"), div[role="dialog"] div[aria-label*="Usar página" i]');
    if (usePageBtn) {
      await usePageBtn.click().catch(() => {});
      await page.waitForTimeout(1500);
    }

    // Cerrar popups
    const closePopupBtn = await page.$('div[aria-label="Cerrar" i], div[aria-label="Close" i]');
    if (closePopupBtn) {
      await closePopupBtn.click().catch(() => {});
      await page.waitForTimeout(1000);
    }

    // 3. Abrir compositor de publicación
    console.log('[Facebook] Buscando compositor de post...');
    const composerTriggerSelector = [
      'div[role="button"]:has-text("¿Qué estás pensando?")',
      'div[role="button"]:has-text("Crear publicación")',
      'span:has-text("¿Qué estás pensando?")',
      'span:has-text("Crear publicación")',
      'div[role="button"]:has-text("Foto/video")',
    ].join(', ');

    const composerTrigger = await page.waitForSelector(composerTriggerSelector, { timeout: 15000 });
    await composerTrigger.click();
    await page.waitForTimeout(2500);

    // 4. Escribir texto
    console.log('[Facebook] Escribiendo texto de la publicación...');
    const textEditorSelector = [
      'div[role="dialog"] div[role="textbox"]',
      'div[role="textbox"][contenteditable="true"]',
    ].join(', ');

    const textEditor = await page.waitForSelector(textEditorSelector, { timeout: 15000 });
    await textEditor.click({ force: true });
    await textEditor.fill(text || '');
    await page.waitForTimeout(1000);

    // 5. Adjuntar imagen si existe
    if (imagePath && fs.existsSync(imagePath)) {
      console.log(`[Facebook] Adjuntando imagen: ${imagePath}`);
      const fileInput = await page.waitForSelector('div[role="dialog"] input[type="file"]', { state: 'attached', timeout: 15000 });
      await fileInput.setInputFiles(imagePath);
      await page.waitForTimeout(4000);
    }

    // 6. Hacer clic en Publicar / Siguiente
    console.log('[Facebook] Haciendo clic en Publicar...');
    const publishBtn = await page.waitForSelector('div[role="dialog"] div[aria-label="Publicar"], div[role="dialog"] div[aria-label="Siguiente"], div[role="dialog"] div[role="button"]:has-text("Publicar")', { timeout: 15000 });
    await publishBtn.click({ force: true });
    await page.waitForTimeout(5000);

    console.log('✅ [Facebook] Publicación completada con éxito.');

    return {
      success: true,
      platform: 'facebook',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('❌ [Facebook] Error publicando:', error.message);
    throw error;
  } finally {
    await page.close();
  }
}
