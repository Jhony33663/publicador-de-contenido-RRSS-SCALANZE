import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import fs from 'fs';
import { CONFIG } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ACCOUNTS_FILE = path.join(__dirname, 'accounts.json');
const ACCOUNTS_EXAMPLE = path.join(__dirname, 'accounts.example.json');

function getAccounts() {
  const target = fs.existsSync(ACCOUNTS_FILE) ? ACCOUNTS_FILE : ACCOUNTS_EXAMPLE;
  if (fs.existsSync(target)) {
    try {
      return JSON.parse(fs.readFileSync(target, 'utf-8'));
    } catch (_) {}
  }
  return {};
}

async function main() {
  const accounts = getAccounts();
  const accountKeys = Object.keys(accounts);

  console.log('===================================================================');
  console.log('🔐 GESTOR DE SESIÓN PERSISTENTE (INSTAGRAM, TIKTOK, FB, LINKEDIN)');
  console.log('===================================================================');

  let selectedAccountId = process.argv[2] || accountKeys[0] || 'cuenta_principal';
  const accountConfig = accounts[selectedAccountId] || {};
  const profileDir = accountConfig.profile_dir
    ? path.resolve(__dirname, accountConfig.profile_dir)
    : CONFIG.USER_DATA_DIR;

  console.log(`📁 Directorio de perfil persistente: ${profileDir}`);
  console.log(`👤 Cuenta seleccionada: [${selectedAccountId}]`);
  console.log('🌐 Abriendo Chromium en modo visible...');

  const context = await chromium.launchPersistentContext(profileDir, {
    headless: false,
    viewport: { width: 1300, height: 850 },
    args: [
      '--disable-blink-features=AutomationControlled',
      '--start-maximized',
    ],
  });

  const pageInstagram = await context.newPage();
  await pageInstagram.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'domcontentloaded' }).catch(() => {});

  const pageTikTok = await context.newPage();
  await pageTikTok.goto('https://www.tiktok.com/login/phone-or-email/email', { waitUntil: 'domcontentloaded' }).catch(() => {});

  const pageFacebook = await context.newPage();
  await pageFacebook.goto('https://www.facebook.com/', { waitUntil: 'domcontentloaded' }).catch(() => {});

  const pageLinkedIn = await context.newPage();
  await pageLinkedIn.goto('https://www.linkedin.com/login', { waitUntil: 'domcontentloaded' }).catch(() => {});

  console.log('\n===================================================================');
  console.log('👉 INSTRUCCIONES:');
  console.log('1. Inicia sesión en las redes sociales que desees automatizar.');
  console.log('2. Si te solicitan verificación 2FA, código OTP por correo o puzzle CAPTCHA, resuélvelo.');
  console.log('3. Marca "Recordar inicio de sesión / Guardar credenciales" si aparece.');
  console.log('4. Una vez estés dentro de tu feed o perfil de tus cuentas, regresa aquí');
  console.log('   y presiona [ENTER] para guardar las cookies y tokens de sesión.\n');
  console.log('===================================================================\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  await new Promise((resolve) => {
    rl.question('👉 Presiona [ENTER] cuando hayas iniciado sesión: ', () => {
      rl.close();
      resolve();
    });
  });

  console.log('\n💾 Consolidando cookies y almacenamiento local...');
  await new Promise((r) => setTimeout(r, 3000));

  console.log('🔒 Cerrando navegador y guardando perfil permanentemente...');
  await context.close();

  console.log('\n✅ ¡Sesión guardada exitosamente! Ya puedes publicar automáticamente en segundo plano.\n');
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Error durante el login:', err.message);
  process.exit(1);
});
