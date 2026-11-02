import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const CONFIG = {
  PORT: process.env.PORT || 4000,
  USER_DATA_DIR: process.env.USER_DATA_DIR
    ? path.resolve(__dirname, process.env.USER_DATA_DIR)
    : path.join(__dirname, 'browser-profile'),
  HEADLESS: process.env.HEADLESS !== 'false', // headless por defecto en API, visible en login
  TIMEOUT: parseInt(process.env.TIMEOUT, 10) || 60000,
};
