import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
});

const SYSTEM_PROMPT = `
You are a helpful support agent for a small e-commerce store called "Spur Store".
Answer clearly and concisely.
We sell cool gadgets and accessories.
Shipping Policy: Free shipping on orders over $50. We ship worldwide.
Return Policy: 30-day return policy for unused items.
Support Hours: Mon-Fri 9am-5pm EST.
`;

export async function generateReply(history: { role: 'user' | 'assistant', content: string }[], userMessage: string) {
    try {
        const messages = [
            { role: 'system', content: SYSTEM_PROMPT } as const,
            ...history.map(msg => ({ role: msg.role, content: msg.content } as const)),
            { role: 'user', content: userMessage } as const
        ];

        const completion = await openai.chat.completions.create({
            messages: messages,
            model: 'llama-3.1-8b-instant',
        });

        return completion.choices[0].message.content || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
        console.error('LLM Error:', JSON.stringify(error, null, 2));
        return "I'm having trouble connecting to my brain right now. Please try again later.";
    }
}
