# Automatización de NotebookLM (uso local únicamente)

Scripts de Playwright para crear y abrir notebooks de Google NotebookLM
desde la línea de comandos. **Deben ejecutarse en tu propia máquina**, no
en un entorno remoto/en la nube, porque necesitas ver e interactuar con
una ventana real de Chromium para iniciar sesión con tu cuenta de Google.

## Advertencias antes de empezar

- NotebookLM no tiene una API pública: esto controla la página web como lo
  haría una persona. Google puede cambiar la interfaz en cualquier momento
  y romper estos scripts.
- Usa esto bajo tu propia cuenta y bajo tu propio criterio respecto a los
  Términos de Servicio de Google.
- La sesión iniciada se guarda localmente en `.auth/` (ignorado por git).
  Nunca subas esa carpeta a un repositorio ni la compartas.

## Requisitos

- Node.js instalado en tu máquina (v18 o superior).
- Ejecutar estos comandos **en local**, no en este entorno remoto.

## Instalación

```bash
cd notebooklm-automation
npm install
npx playwright install chromium
```

## Uso

1. **Iniciar sesión (una sola vez):**

   ```bash
   node login.js
   ```

   Se abrirá una ventana de Chromium. Inicia sesión con tu cuenta de
   Google normalmente. Cuando veas tu lista de notebooks, vuelve a la
   terminal y presiona Enter. La sesión queda guardada para los siguientes
   comandos.

2. **Crear un notebook y subir fuentes:**

   ```bash
   node create-notebook.js "Mi primer proyecto" ../notebooklm/sources/readme.md
   ```

3. **Abrir tu lista de notebooks:**

   ```bash
   node list-notebooks.js
   ```

Si algún paso falla (por ejemplo, "no encontré el botón"), copia el
mensaje de error y describe qué ves en la ventana del navegador —el
selector se puede ajustar sin tener que rehacer todo el script.
