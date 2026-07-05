import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const USER_DATA_DIR = path.join(__dirname, '.auth', 'notebooklm-profile');

async function main() {
  console.log('Abriendo un Chromium visible para que inicies sesión en NotebookLM...');
  console.log('La sesión quedará guardada localmente en:', USER_DATA_DIR);
  console.log('(Esa carpeta nunca debe subirse a git — ya está en .gitignore)\n');

  const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: false,
    viewport: { width: 1280, height: 800 },
  });

  const page = context.pages()[0] ?? (await context.newPage());
  await page.goto('https://notebooklm.google.com');

  console.log('Inicia sesión con tu cuenta de Google en la ventana que se abrió.');
  console.log('Cuando veas la pantalla principal de NotebookLM (tu lista de notebooks),');
  console.log('vuelve a esta terminal y presiona Enter.\n');

  await new Promise((resolve) => {
    process.stdin.once('data', resolve);
  });

  console.log('Sesión guardada. Ya puedes cerrar la ventana.');
  console.log('A partir de ahora, create-notebook.js y list-notebooks.js reusarán esta sesión.');
  await context.close();
}

main();
