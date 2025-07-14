# FM Digital Web API

Este es el web service para manejar el envío de datos del formulario de contacto a una base de datos en Notion.

## Requisitos

- Node.js (versión 18 o superior)
- TypeScript
- Cuenta en Render para el despliegue

## Configuración

1. Clona este repositorio.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
   ```
   NOTION_TOKEN=tu_token_de_integracion_de_notion
   NOTION_DATABASE_ID=tu_id_de_base_de_datos_en_notion
   ```
4. Compila el código TypeScript:
   ```bash
   npm run build
   ```
5. Inicia el servidor:
   ```bash
   npm start
   ```

## Despliegue en Render

1. Crea un nuevo web service en Render.
2. Conecta tu repositorio de GitHub (`fm-digital-web-api`).
3. Configura las variables de entorno (`NOTION_TOKEN` y `NOTION_DATABASE_ID`).
4. Establece el Build Command como `npm install && npm run build`.
5. Establece el Start Command como `npm start`.
6. Despliega el servicio.

Una vez desplegado, obtendrás una URL como `https://fm-digital-web-api.onrender.com`, que podrás usar en tu formulario de contacto.