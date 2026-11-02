import fs from 'fs';
import path from 'path';

/**
 * Publica contenido en TikTok usando el contexto de navegador persistente
 * @param {import('playwright').BrowserContext} context
 * @param {Object} options
 * @param {string} options.caption - Descripción del post con hashtags
 * @param {string} [options.videoPath] - Ruta local del video (.mp4, .mov, etc.)
 * @param {string} [options.imagePath] - Ruta local de la imagen para formato foto
 * @param {string} [options.mediaPath] - Ruta genérica de archivo multimedia
 */
export async function publishToTikTok(context, { caption, videoPath, imagePath, mediaPath }) {
  const targetFile = videoPath || mediaPath || imagePath;

  if (!targetFile || !fs.existsSync(targetFile)) {
    throw new Error(`TikTok requiere un archivo de video o imagen válido. Archivo no encontrado: ${targetFile}`);
  }

  const page = await context.newPage();

  try {
    console.log('[TikTok] Navegando a TikTok Studio Upload...');
    await page.goto('https://www.tiktok.com/tiktokstudio/upload', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    await page.waitForTimeout(4000);

    // 1. Verificar si la sesión está activa
    const currentUrl = page.url();
    if (currentUrl.includes('/login') || currentUrl.includes('redirect_url')) {
      throw new Error(
        'No has iniciado sesión en TikTok con este perfil. Ejecuta "npm run login" para autenticarte y guardar la sesión persistente.'
      );
    }

    const loginModal = await page.$('div[id*="login-modal" i], div[class*="login-modal" i]');
    if (loginModal) {
      throw new Error(
        'TikTok solicita inicio de sesión. Ejecuta "npm run login" para autenticarte y guardar la sesión persistente.'
      );
    }

    console.log(`[TikTok] Localizando selector de subida para: ${targetFile}`);

    // 2. Localizar el input type="file" (página principal o iframe)
    let fileInput = await page.$('input[type="file"]');
    let targetFrame = page;

    if (!fileInput) {
      for (const frame of page.frames()) {
        const found = await frame.$('input[type="file"]');
        if (found) {
          fileInput = found;
          targetFrame = frame;
          console.log('[TikTok] Input de subida localizado dentro de iframe.');
          break;
        }
      }
    }

    if (!fileInput) {
      fileInput = await page.waitForSelector('input[type="file"]', { state: 'attached', timeout: 15000 });
    }

    // 3. Subir el archivo
    console.log(`[TikTok] Cargando archivo multimedia al selector...`);
    await fileInput.setInputFiles(path.resolve(targetFile));
    console.log('[TikTok] Archivo inyectado, esperando procesamiento inicial...');
    await page.waitForTimeout(6000);

    // 4. Escribir descripción / Caption
    if (caption) {
      console.log('[TikTok] Localizando editor de descripción / caption...');
      const captionSelectors = [
        '[data-e2e="comment-input"]',
        'div.public-DraftEditor-content[contenteditable="true"]',
        'div[contenteditable="true"]',
        'div[role="textbox"]',
        'textarea[placeholder*="caption" i]',
        'textarea[placeholder*="descripción" i]',
      ];

      let captionEditor = null;
      for (const sel of captionSelectors) {
        captionEditor = await targetFrame.$(sel);
        if (captionEditor && await captionEditor.isVisible()) {
          console.log(`[TikTok] Editor encontrado con selector: ${sel}`);
          break;
        }
      }

      if (captionEditor) {
        await captionEditor.click({ force: true });
        await page.waitForTimeout(1000);

        // Limpiar contenido previo si existe
        await page.keyboard.press('Control+A');
        await page.keyboard.press('Backspace');
        await page.waitForTimeout(500);

        await captionEditor.type(caption, { delay: 30 });
        console.log('[TikTok] Caption y hashtags ingresados correctamente.');
        await page.waitForTimeout(2000);
      } else {
        console.warn('[TikTok] No se pudo localizar el editor de texto directamente; continuando.');
      }
    }

    // 5. Esperar a que el video termine de subir y el botón "Publicar" se habilite
    console.log('[TikTok] Esperando a que el botón "Publicar" esté habilitado...');
    const postButtonSelectors = [
      'button[data-e2e="post_video_button"]',
      'button:has-text("Post")',
      'button:has-text("Publicar")',
      'div[role="button"]:has-text("Post")',
      'div[role="button"]:has-text("Publicar")',
    ];

    let postButton = null;
    let finalSelector = '';

    for (const sel of postButtonSelectors) {
      postButton = await targetFrame.$(sel);
      if (postButton) {
        finalSelector = sel;
        break;
      }
    }

    if (!postButton) {
      for (const sel of postButtonSelectors) {
        try {
          postButton = await targetFrame.waitForSelector(sel, { timeout: 10000 });
          if (postButton) {
            finalSelector = sel;
            break;
          }
        } catch (_) {}
      }
    }

    if (!postButton) {
      throw new Error('Botón de publicar en TikTok no encontrado.');
    }

    console.log('[TikTok] Esperando confirmación de subida y procesamiento...');
    try {
      await page.waitForFunction(
        (sel) => {
          const btn = document.querySelector(sel);
          if (!btn) return false;
          const isDisabled = btn.disabled || btn.getAttribute('aria-disabled') === 'true' || btn.classList.contains('disabled');
          return !isDisabled;
        },
        finalSelector,
        { timeout: 90000 }
      );
    } catch (waitErr) {
      console.warn('[TikTok] Aviso de tiempo de espera en botón activo, ejecutando clic...');
    }

    // 6. Hacer clic en Publicar
    console.log('[TikTok] Haciendo clic en el botón Publicar...');
    await postButton.click({ force: true });
    await page.waitForTimeout(5000);

    // 7. Esperar confirmación
    console.log('[TikTok] Esperando confirmación de publicación...');
    for (let i = 1; i <= 6; i++) {
      await page.waitForTimeout(4000);
      const pageText = await page.evaluate(() => document.body.innerText).catch(() => '');
      if (
        pageText.includes('Your video has been uploaded') ||
        pageText.includes('Tu video se ha subido') ||
        pageText.includes('Manage your posts') ||
        pageText.includes('Gestionar publicaciones') ||
        pageText.includes('Subido con éxito')
      ) {
        console.log('🎉 [TikTok] Confirmación recibida: ¡Post publicado con éxito en TikTok!');
        break;
      }
    }

    return {
      success: true,
      platform: 'tiktok',
      timestamp: new Date().toISOString(),
      file: path.basename(targetFile),
    };
  } catch (error) {
    console.error('❌ [TikTok] Error publicando:', error.message);
    throw error;
  } finally {
    await page.close();
  }
}
