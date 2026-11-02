import fs from 'fs';

/**
 * Publica contenido en LinkedIn usando el contexto de navegador persistente
 * @param {import('playwright').BrowserContext} context
 * @param {Object} options
 * @param {string} options.text - Texto del post
 * @param {string} [options.imagePath] - Ruta local de la imagen adjunta
 * @param {string} [options.pdfPath] - Ruta local del documento PDF adjunto
 */
export async function publishToLinkedIn(context, { text, imagePath, pdfPath }) {
  const page = await context.newPage();
  try {
    console.log('[LinkedIn] Navegando a LinkedIn Feed...');
    await page.goto('https://www.linkedin.com/feed/', { waitUntil: 'domcontentloaded', timeout: 45000 });

    // Verificar si estamos autenticados
    if (page.url().includes('/login') || page.url().includes('/checkpoint')) {
      throw new Error('No has iniciado sesión en LinkedIn. Ejecuta "npm run login" para autenticarte.');
    }

    console.log('[LinkedIn] Abriendo modal de creación de post...');
    const startPostBtnSelector = 'button:has-text("Start a post"), button:has-text("Crear publicación"), button.artdeco-button--muted';
    const startPostBtn = await page.waitForSelector(startPostBtnSelector, { timeout: 15000 });
    await startPostBtn.click();
    await page.waitForTimeout(2000);

    // Escribir texto
    console.log('[LinkedIn] Escribiendo texto del post...');
    const editorSelector = 'div.ql-editor, div[role="textbox"][contenteditable="true"]';
    const editor = await page.waitForSelector(editorSelector, { timeout: 15000 });
    await editor.click();
    await editor.fill(text || '');
    await page.waitForTimeout(1000);

    // Adjuntar multimedia si existe
    if (imagePath && fs.existsSync(imagePath)) {
      console.log(`[LinkedIn] Adjuntando imagen: ${imagePath}`);
      const fileInput = await page.waitForSelector('input[type="file"]', { state: 'attached', timeout: 10000 });
      await fileInput.setInputFiles(imagePath);
      await page.waitForTimeout(2000);

      // Botón "Next" / "Siguiente" en el modal de previsualización
      const nextBtnSelector = 'button:has-text("Next"), button:has-text("Siguiente"), button.share-box-footer__primary-btn';
      const nextBtn = await page.waitForSelector(nextBtnSelector, { timeout: 10000 });
      await nextBtn.click();
      await page.waitForTimeout(1500);
    } else if (pdfPath && fs.existsSync(pdfPath)) {
      console.log(`[LinkedIn] Adjuntando documento PDF: ${pdfPath}`);
      const docBtn = await page.$('button[aria-label*="document" i], button[aria-label*="documento" i]');
      if (docBtn) {
        await docBtn.click();
        const fileInput = await page.waitForSelector('input[type="file"]', { state: 'attached', timeout: 10000 });
        await fileInput.setInputFiles(pdfPath);
        await page.waitForTimeout(2000);

        const doneBtn = await page.waitForSelector('button:has-text("Done"), button:has-text("Hecho"), button:has-text("Next")', { timeout: 10000 });
        await doneBtn.click();
        await page.waitForTimeout(1500);
      }
    }

    // Clic en Post / Publicar
    console.log('[LinkedIn] Haciendo clic en Publicar...');
    const postBtnSelector = 'button.share-actions__primary-action, button:has-text("Post"), button:has-text("Publicar")';
    const postBtn = await page.waitForSelector(postBtnSelector, { timeout: 15000 });
    await postBtn.click();
    await page.waitForTimeout(5000);

    console.log('✅ [LinkedIn] Publicación completada con éxito.');

    return {
      success: true,
      platform: 'linkedin',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('❌ [LinkedIn] Error publicando:', error.message);
    throw error;
  } finally {
    await page.close();
  }
}
