import express, { Request, Response } from 'express';
import { Client } from '@notionhq/client';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

const app = express();

app.use(express.json());

// Configuración de Notion con variables de entorno
const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID;

// Endpoint para recibir datos del formulario
app.post('/submit-contact', async (req: Request, res: Response) => {
  const { name, email, phone, website, message } = req.body;

  try {
    const response: PageObjectResponse = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Name: { title: [{ text: { content: name } }] },
        Email: { email: email },
        Phone: { rich_text: [{ text: { content: phone || '' } }] },
        Website: { url: website || '' },
        Message: { rich_text: [{ text: { content: message || '' } }] },
        'Registration Date': { date: { start: new Date().toISOString() } },
        Status: { select: { name: 'Pre-registered' } }
      }
    });
    res.status(200).json({ success: true, message: 'Datos enviados a Notion con éxito' });
  } catch (error) {
    console.error('Error al enviar a Notion:', error);
    res.status(500).json({ success: false, message: 'Error al enviar datos a Notion' });
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});