import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const USER_DATA_DIR = path.join(__dirname, '.auth', 'notebooklm-profile');

const [, , title, ...sourceFiles] = process.argv;

if (!title) {
  console.error('Uso: node create-notebook.js "Título del notebook" [archivo1.md archivo2.txt ...]');
  process.exit(1);
}

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

  console.log('Buscando el botón para crear un notebook nuevo...');
  console.log('(Si esto falla, dime qué texto/botón ves en pantalla para ajustar el selector)\n');

  const newNotebookButton = page
    .getByRole('button', { name: /new notebook|nuevo cuaderno|crear notebook|create/i })
    .first();
  await newNotebookButton.click({ timeout: 15000 });
  await page.waitForTimeout(2000);

  console.log(`Notebook en creación. Si NotebookLM te pide un nombre, escribe: "${title}"`);

  for (const filePath of sourceFiles) {
    const absolutePath = path.resolve(filePath);
    if (!fs.existsSync(absolutePath)) {
      console.warn(`Archivo no encontrado, se omite: ${filePath}`);
      continue;
    }
    console.log(`Subiendo fuente: ${filePath}`);
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(absolutePath);
    await page.waitForTimeout(3000);
  }

  console.log('\nRevisa la ventana del navegador para confirmar que el notebook y las fuentes quedaron bien.');
  console.log('La ventana se deja abierta para que verifiques visualmente.');
}

main();
