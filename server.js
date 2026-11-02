import express from 'express';
import cors from 'cors';
import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { CONFIG } from './config.js';
import { publishToLinkedIn } from './publishers/linkedin.js';
import { publishToInstagram } from './publishers/instagram.js';
import { publishToFacebook } from './publishers/facebook.js';
import { publishToTikTok } from './publishers/tiktok.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ACCOUNTS_FILE = path.join(__dirname, 'accounts.json');
const ACCOUNTS_EXAMPLE = path.join(__dirname, 'accounts.example.json');

function getAccounts() {
  const target = fs.existsSync(ACCOUNTS_FILE) ? ACCOUNTS_FILE : ACCOUNTS_EXAMPLE;
  if (fs.existsSync(target)) {
    try {
      return JSON.parse(fs.readFileSync(target, 'utf-8'));
    } catch (e) {
      console.error('Error leyendo archivo de cuentas:', e);
    }
  }
  return {};
}

const app = express();
app.use(cors());
app.use(express.json());

// Helper para resolver archivos locales o descargar URLs remotas
async function resolveMediaPath(urlOrPath, filename = 'temp-media.jpg') {
  if (!urlOrPath) return null;
  if (fs.existsSync(urlOrPath)) return path.resolve(urlOrPath);

  if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://')) {
    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    const dest = path.join(tempDir, filename);

    const response = await axios({
      method: 'GET',
      url: urlOrPath,
      responseType: 'stream',
    });
    const writer = fs.createWriteStream(dest);
    response.data.pipe(writer);
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
    return dest;
  }
  return null;
}

// Función central para ejecutar la publicación en las redes seleccionadas
export async function executePublish({
  account = 'cuenta_principal',
  account_id,
  platforms = [],
  linkedin_text,
  instagram_caption,
  facebook_text,
  facebook_url,
  tiktok_caption,
  image_path,
  image_url,
  video_path,
  video_url,
  media_path,
  pdf_path,
  c2pa_metadata,
  headful = false,
}) {
  if (!Array.isArray(platforms) || platforms.length === 0) {
    throw new Error('Debes especificar al menos una plataforma en "platforms": ["instagram", "tiktok", "facebook", "linkedin"]');
  }

  const selectedAccountId = account_id || account || 'cuenta_principal';
  const accounts = getAccounts();
  const accountConfig = accounts[selectedAccountId] || {};

  console.log(`\n📬 [Ayrshare Engine] Cuenta: [${selectedAccountId}] | Publicando en: ${platforms.join(', ')}`);

  let context = null;
  try {
    const resolvedImage = await resolveMediaPath(image_path || image_url || media_path, 'post-image.jpg');
    const resolvedVideo = await resolveMediaPath(video_path || video_url, 'post-video.mp4');
    const resolvedPdf = await resolveMediaPath(pdf_path, 'document.pdf');

    let profileDir = CONFIG.USER_DATA_DIR;
    if (accountConfig.profile_dir) {
      profileDir = path.resolve(__dirname, accountConfig.profile_dir);
    }

    const runHeadless = headful ? false : CONFIG.HEADLESS;
    console.log(`[Browser] Iniciando Chromium (headless: ${runHeadless}) con perfil: ${profileDir}`);

    context = await chromium.launchPersistentContext(profileDir, {
      headless: runHeadless,
      viewport: { width: 1280, height: 800 },
      args: ['--disable-blink-features=AutomationControlled'],
    });

    const results = {};

    // 1. Instagram
    if (platforms.includes('instagram')) {
      try {
        const resInstagram = await publishToInstagram(context, {
          caption: instagram_caption || tiktok_caption || facebook_text || linkedin_text || '',
          imagePath: resolvedImage,
          videoPath: resolvedVideo,
          mediaPath: resolvedVideo || resolvedImage,
          altText: c2pa_metadata || accountConfig.c2pa_author,
        });
        results.instagram = resInstagram;
      } catch (err) {
        results.instagram = { success: false, error: err.message };
      }
    }

    // 2. TikTok
    if (platforms.includes('tiktok')) {
      try {
        const resTikTok = await publishToTikTok(context, {
          caption: tiktok_caption || instagram_caption || facebook_text || linkedin_text || '',
          videoPath: resolvedVideo,
          imagePath: resolvedImage,
          mediaPath: resolvedVideo || resolvedImage,
        });
        results.tiktok = resTikTok;
      } catch (err) {
        results.tiktok = { success: false, error: err.message };
      }
    }

    // 3. Facebook
    if (platforms.includes('facebook')) {
      try {
        const resFacebook = await publishToFacebook(context, {
          text: facebook_text || instagram_caption || linkedin_text || tiktok_caption || '',
          imagePath: resolvedImage,
          targetUrl: facebook_url || accountConfig.facebook_url || null,
        });
        results.facebook = resFacebook;
      } catch (err) {
        results.facebook = { success: false, error: err.message };
      }
    }

    // 4. LinkedIn
    if (platforms.includes('linkedin')) {
      try {
        const resLinkedin = await publishToLinkedIn(context, {
          text: linkedin_text || instagram_caption || facebook_text || tiktok_caption || '',
          imagePath: resolvedImage,
          pdfPath: resolvedPdf,
        });
        results.linkedin = resLinkedin;
      } catch (err) {
        results.linkedin = { success: false, error: err.message };
      }
    }

    const anyFailed = Object.values(results).some((r) => r.success === false);

    return {
      status: anyFailed ? 'partial_success' : 'success',
      account: selectedAccountId,
      platforms_requested: platforms,
      results,
    };
  } finally {
    if (context) {
      await context.close();
      console.log('[Browser] Contexto de navegador cerrado.');
    }
  }
}

// 1. Estado del servicio
app.get('/health', (req, res) => {
  const accounts = getAccounts();
  res.json({
    status: 'ok',
    service: 'Multi-Account Social Media Publisher Engine',
    port: CONFIG.PORT,
    configured_accounts: Object.keys(accounts),
    supported_platforms: ['instagram', 'tiktok', 'facebook', 'linkedin'],
    timestamp: new Date().toISOString(),
  });
});

// 2. Publicación Inmediata
app.post('/api/post', async (req, res) => {
  try {
    const outcome = await executePublish(req.body);
    const code = outcome.status === 'partial_success' ? 207 : 200;
    res.status(code).json(outcome);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.listen(CONFIG.PORT, () => {
  console.log('=====================================================');
  console.log(`🚀 MOTOR SOCIAL MEDIA ACTIVO EN: http://localhost:${CONFIG.PORT}`);
  console.log(`👉 Estado y salud:        GET  /health`);
  console.log(`👉 Publicar Contenido:    POST /api/post`);
  console.log('=====================================================');
});
