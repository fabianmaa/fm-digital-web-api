import express, { Request, Response } from 'express';
import { Client } from '@notionhq/client';

const app = express();

app.use(express.json());

// Configure Notion with environment variables
const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID;

// Endpoint to handle form submissions
app.post('/submit-contact', async (req: Request, res: Response) => {
  const { name, email, phone, website, message } = req.body;

  try {
    await notion.pages.create({
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
    res.status(200).json({ success: true, message: 'Data sent to Notion successfully' });
  } catch (error) {
    console.error('Error sending to Notion:', error);
    res.status(500).json({ success: false, message: 'Error sending data to Notion' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
