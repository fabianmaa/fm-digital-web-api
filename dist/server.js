"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@notionhq/client");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Configure Notion with environment variables
const notion = new client_1.Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID;
// Endpoint to handle form submissions
app.post('/submit-contact', async (req, res) => {
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
    }
    catch (error) {
        console.error('Error sending to Notion:', error);
        res.status(500).json({ success: false, message: 'Error sending data to Notion' });
    }
});
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
