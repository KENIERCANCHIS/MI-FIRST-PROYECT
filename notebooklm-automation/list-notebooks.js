import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const USER_DATA_DIR = path.join(__dirname, '.auth', 'notebooklm-profile');

async function main() {
  if (!fs.existsSync(USER_DATA_DIR)) {
    console.error('No hay una sesión guardada. Ejecuta primero: node login.js');
    process.exit(1);
  }

  const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: false,
    viewport: { width: 1280, height: 800 },
  });
  const page = context.pages()[0] ?? (await context.newPage());

  await page.goto('https://notebooklm.google.com');
  await page.waitForLoadState('networkidle');

  console.log('Se abrió tu lista de notebooks en la ventana del navegador.');
  console.log('Como la lista de NotebookLM cambia de diseño con frecuencia, esta ventana');
  console.log('se deja abierta para que la veas directamente en vez de intentar leerla');
  console.log('a ciegas por código (evita depender de selectores frágiles que no pude verificar).');
}

main();
