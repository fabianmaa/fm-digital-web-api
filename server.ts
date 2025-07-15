import express, { Request, Response } from 'express';
import { Client } from '@notionhq/client';
import cors from 'cors';

const app = express();

// Configura CORS
app.use(cors({
  origin: 'https://fmdigitalai.com',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

// Verificación de variables de entorno
if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) {
  console.error('Error: Faltan variables de entorno NOTION_TOKEN o NOTION_DATABASE_ID.');
  process.exit(1);
}

const notion = new Client({ auth: process.env.NOTION_TOKEN! });
const databaseId = process.env.NOTION_DATABASE_ID!;

app.post('/submit-contact', async (req: Request, res: Response) => {
  const { name, email, phone = '', website = '', message = '' } = req.body;

  // Validación básica
  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Name and email are required.' });
  }

  try {
    console.log('Datos recibidos:', { name, email, phone, website, message });
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Name: { 
          title: [{ 
            text: { 
              content: name 
            } 
          }] 
        },
        Email: { email: email },
        Phone: { phone_number: phone || null }, // Enviar como cadena o null
        Website: { url: website || 'https://default.com' },
        Message: { rich_text: [{ text: { content: message } }] },
        'Registration Date': { date: { start: new Date().toISOString() } },
        Status: { select: { name: 'Pre-registered' } }
      }
    });
    res.status(200).json({ success: true, message: 'Data sent to Notion successfully' });
  } catch (error) {
    console.error('Error sending to Notion:', error);
    if (error instanceof Error) {
      res.status(500).json({ success: false, message: `Error sending data to Notion: ${error.message}` });
    } else {
      res.status(500).json({ success: false, message: 'Error sending data to Notion: Unknown error' });
    }
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
