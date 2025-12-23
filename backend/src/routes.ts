import { Router } from 'express';
import { db } from './services/db.js';
import { generateReply } from './services/llm.js';
import { v4 as uuidv4 } from 'uuid';

export const router = Router();

router.post('/chat/message', async (req, res) => {
    try {
        const { message, sessionId } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        let conversationId = sessionId;

        // 1. Find or create conversation
        if (!conversationId) {
            conversationId = uuidv4();
            db.prepare('INSERT INTO Conversation (id) VALUES (?)').run(conversationId);
        } else {
            const exists = db.prepare('SELECT id FROM Conversation WHERE id = ?').get(conversationId);
            if (!exists) {
                // If client sends an ID that doesn't exist, create it or treat as new.
                // For simplicity, let's create it.
                db.prepare('INSERT INTO Conversation (id) VALUES (?)').run(conversationId);
            }
        }

        // 2. Save user message
        db.prepare('INSERT INTO Message (id, conversationId, sender, text) VALUES (?, ?, ?, ?)').run(uuidv4(), conversationId, 'user', message);

        // 3. Fetch history
        const history = db.prepare('SELECT sender, text FROM Message WHERE conversationId = ? ORDER BY timestamp ASC LIMIT 10').all(conversationId) as { sender: string, text: string }[];

        const formattedHistory = history.map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
        })) as { role: 'user' | 'assistant', content: string }[];

        // 4. Generate AI reply
        const aiReply = await generateReply(formattedHistory, message);

        // 5. Save AI message
        db.prepare('INSERT INTO Message (id, conversationId, sender, text) VALUES (?, ?, ?, ?)').run(uuidv4(), conversationId, 'ai', aiReply);

        res.json({ reply: aiReply, sessionId: conversationId });

    } catch (error) {
        console.error('Chat Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/chat/history/:sessionId', (req, res) => {
    try {
        const { sessionId } = req.params;
        const messages = db.prepare('SELECT * FROM Message WHERE conversationId = ? ORDER BY timestamp ASC').all(sessionId);
        res.json({ messages });
    } catch (error) {
        console.error('History Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
