# Spur AI Chat Agent
<img width="606" height="821" alt="image" src="https://github.com/user-attachments/assets/1587f31d-4505-4646-b536-958a14eedf6a" />


A mini AI support agent for a live chat widget, built with Node.js, TypeScript, SQLite, and SvelteKit.

## Features
- Live chat interface with auto-scroll and loading states.
- AI agent powered by Groq (Llama 3).
- Conversation persistence using SQLite.
- Context-aware replies (history + system prompt).

## Tech Stack
- **Backend**: Node.js, Express, TypeScript, better-sqlite3.
- **Frontend**: Vanilla TypeScript (Vite).
- **Database**: SQLite (local file `dev.db`).
- **LLM**: Groq API.

## Setup & Run

### Prerequisites
- Node.js (v18+)
- Groq API Key

### 1. Backend
```bash
cd backend
# Create .env file
echo "GROQ_API_KEY=your_key_here" > .env
echo "PORT=3434" >> .env

npm install
npx tsx src/server.ts
```
Server runs on `http://localhost:3434`.

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
App runs on `http://localhost:5173`.

## Architecture
- **Backend**: Simple Express server with `better-sqlite3` for synchronous, fast DB operations. `llm.ts` handles OpenAI integration.
- **Frontend**: SvelteKit app. `+page.svelte` handles UI state and API calls.
- **Database**: Two tables: `Conversation` and `Message`.

## Notes
- I used `better-sqlite3` instead of Prisma to avoid environment/migration complexity in this demo.
- The `System Prompt` in `backend/src/services/llm.ts` defines the agent's persona and knowledge.
- Switched to Groq API for faster inference.
