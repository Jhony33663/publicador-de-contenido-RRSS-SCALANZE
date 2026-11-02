# 🚀 Publicador de Contenido Multicanal en Redes Sociales (RRSS)

Motor open-source de automatización y publicación simultánea en redes sociales (**Instagram, TikTok, Facebook y LinkedIn**) desarrollado con **Node.js** y **Playwright**.

Permite programar y disparar publicaciones automáticas sin pagar costos de suscripción mensual ni depender de las estrictas limitaciones de las APIs oficiales (Meta Graph API, TikTok Developers, etc.), empleando **sesiones persistentes seguras**.

---

## 🌟 Características Principales

- **Multi-Plataforma**:
  - 📸 **Instagram**: Publicación en feed y Reels (imagen o video), pie de foto y metadatos de accesibilidad (Alt text).
  - 🎵 **TikTok**: Subida directa a TikTok Studio, título/descripción con hashtags, validación de procesamiento y publicación.
  - 📘 **Facebook**: Cambio automático a perfil de página oficial y publicación con imagen/texto.
  - 💼 **LinkedIn**: Publicación en feed con soporte de texto, imágenes y documentos PDF.
- **Sesiones Persistentes**: Inicia sesión manualmente una sola vez para resolver 2FA o CAPTCHAs; todas las cookies y tokens se conservan permanentemente en perfiles aislados.
- **Arquitectura Multi-Cuenta**: Soporta múltiples marcas o perfiles simultáneos mediante configuración desacoplada en `accounts.json`.
- **API REST Integrable**: Se conecta directamente con **n8n**, Make, Zapier, cron jobs o webhooks locales a través de endpoints HTTP.
- **Privacidad y Seguridad Garantizada**: Ningún token, contraseña o archivo de sesión se almacena en el control de versiones.

---

## 📁 Estructura del Proyecto

```text
├── config.js               # Configuración general y variables de entorno
├── server.js               # API REST principal (Express + Playwright)
├── login.js                # Gestor interactivo de autenticación y sesiones
├── test-post.js            # Script de prueba rápida de publicación
├── accounts.example.json   # Plantilla para registrar cuentas y redes
├── publishers/             # Módulos de automatización por red social
│   ├── instagram.js        # Automatización de Instagram
│   ├── tiktok.js           # Automatización de TikTok Studio
│   ├── facebook.js         # Automatización de Facebook Pages
│   └── linkedin.js         # Automatización de LinkedIn
├── package.json            # Dependencias del proyecto
├── .env.example            # Ejemplo de variables de entorno
└── .gitignore              # Exclusión estricta de credenciales, perfiles y temporales
```

---

## 🛠️ Instalación y Requisitos

### Requisitos previos:
- **Node.js** v18 o superior.
- **npm** (incluido con Node.js).

### 1. Clonar e instalar dependencias:
```bash
git clone https://github.com/Jhony33663/publicador-de-contenido-RRSS-SCALANZE.git
cd publicador-de-contenido-RRSS-SCALANZE
npm install
npx playwright install chromium
```

### 2. Configurar el entorno:
Copia el archivo de ejemplo de variables de entorno:
```bash
cp .env.example .env
```

### 3. Configurar tus cuentas:
Crea tu archivo `accounts.json` a partir de la plantilla:
```bash
cp accounts.example.json accounts.json
```
Edita `accounts.json` con los datos de tus cuentas y plataformas deseadas:
```json
{
  "mi_marca": {
    "id": "mi_marca",
    "name": "Mi Marca Digital",
    "instagram_user": "mi_usuario_ig",
    "tiktok_user": "mi_usuario_tiktok",
    "facebook_name": "Nombre de mi Página",
    "facebook_url": "https://www.facebook.com/mi-pagina",
    "profile_dir": "./browser-profile",
    "platforms": ["instagram", "tiktok", "facebook", "linkedin"],
    "default_hashtags": "#Marketing #Growth #Reels #TikTok"
  }
}
```

---

## 🔐 Paso 1: Autenticar tus Cuentas (Una sola vez)

Para evitar bloqueos de bots, el sistema utiliza un navegador visible para el inicio de sesión inicial:

```bash
npm run login
```
*(O en Windows, haz doble clic en `iniciar-login.bat`)*

1. Se abrirán las pestañas de **Instagram, TikTok, Facebook y LinkedIn**.
2. Ingresa tus credenciales en las redes que vayas a utilizar.
3. Si la red social solicita código SMS, autenticación en 2 pasos (2FA) o resolución de rompecabezas (CAPTCHA), complétalo en pantalla.
4. Una vez estés dentro de tu feed o perfil, regresa a la terminal y presiona **[ENTER]**.
5. Las cookies y tokens quedarán guardados permanentemente en tu carpeta de perfil (`browser-profile/`).

---

## 🚀 Paso 2: Iniciar el Servidor de Publicación

Ejecuta el servidor de la API REST:
```bash
npm start
```
*(O en Windows, haz doble clic en `iniciar-servidor.bat`)*

El servidor quedará escuchando en `http://localhost:4000`.

---

## 📬 Paso 3: Disparar Publicaciones

Puedes disparar publicaciones haciendo una petición HTTP `POST` a `/api/post`:

### Ejemplo en cURL:
```bash
curl -X POST http://localhost:4000/api/post \
  -H "Content-Type: application/json" \
  -d '{
    "account": "mi_marca",
    "platforms": ["instagram", "tiktok"],
    "instagram_caption": "¡Nuevo lanzamiento disponible ya! 🔥 #Reels #Instagram",
    "tiktok_caption": "Tutorial completo paso a paso 🚀 #fyp #viral #tiktok",
    "image_path": "C:/ruta/a/tu/imagen.jpg",
    "video_path": "C:/ruta/a/tu/video.mp4"
  }'
```

### Ejemplo en JavaScript / Node.js:
```javascript
import axios from 'axios';

await axios.post('http://localhost:4000/api/post', {
  account: 'mi_marca',
  platforms: ['instagram', 'tiktok', 'facebook', 'linkedin'],
  instagram_caption: 'Contenido para Instagram',
  tiktok_caption: 'Contenido para TikTok #viral',
  facebook_text: 'Post para la comunidad de Facebook',
  linkedin_text: 'Análisis profesional en LinkedIn',
  image_path: './imagenes/post.jpg',
});
```

---

## 🛡️ Seguridad y Buenas Prácticas

- **Sin contraseñas en código**: No almacenes contraseñas en scripts. Las sesiones se guardan de forma local mediante cookies seguras en carpetas ignoradas por Git.
- **Protección `.gitignore`**: Los directorios `*-profile/`, archivos `accounts.json`, scripts locales `.ps1` y capturas de depuración están estrictamente excluidos del repositorio para evitar filtraciones accidentales.

---

## 📄 Licencia

Este proyecto está bajo la Licencia **MIT**. Consulta el archivo `LICENSE` para más información.
