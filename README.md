# Spur AI Chat Agent
<img width="606" height="821" alt="image" src="https://github.com/user-attachments/assets/1587f31d-4505-4646-b536-958a14eedf6a" />

A mini AI support agent for a live chat widget, built with Node.js, TypeScript, SQLite, and Vanilla TS (Vite).

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18+)
- A Groq API Key (Get one at [console.groq.com](https://console.groq.com))

### Step 1: Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment Variables:
    Create a `.env` file in the `backend` directory:
    ```env
    PORT=3434
    GROQ_API_KEY=your_groq_api_key_here
    ```
4.  Start the server:
    ```bash
    npx tsx src/server.ts
    ```
    The server will start on `http://localhost:3434`.

### Step 2: Frontend Setup
1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The app will run on `http://localhost:5173`.

---

## 🗄️ Database Setup
This project uses **SQLite** with `better-sqlite3` for simplicity and speed.

-   **No manual migrations required**: The database schema is automatically initialized in `src/services/db.ts` when the server starts.
-   **File Location**: The database file is created at `backend/dev.db`.
-   **Schema**:
    -   `Conversation`: Stores session IDs.
    -   `Message`: Stores individual messages linked to a conversation.

---

## ⚙️ Configuration (Env Vars)

| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Port for the backend server | `3434` |
| `GROQ_API_KEY` | API Key for Groq LLM | `gsk_...` |

---

## 🏗️ Architecture Overview

### Backend Structure
-   **`src/server.ts`**: Entry point. Sets up Express, CORS, and serves frontend static files (for production).
-   **`src/routes.ts`**: Defines API endpoints (`POST /chat/message`, `GET /chat/history`).
-   **`src/services/db.ts`**: Database layer. Handles SQLite connection and schema initialization.
-   **`src/services/llm.ts`**: LLM integration layer. Wraps the Groq API call.

### Design Decisions
-   **Monolith-ready**: The backend is configured to serve the frontend build (`dist`) in production, allowing for single-container deployment.
-   **`better-sqlite3` vs Prisma**: I chose `better-sqlite3` for this assignment to avoid the overhead of Prisma's binary management and migration workflow in a portable, "boring" setup. It's faster and requires zero setup steps for the user.
-   **Vanilla TypeScript Frontend**: Switched from SvelteKit to Vanilla TS + Vite to keep the frontend lightweight and dependency-free for this specific chat widget use case.

---

## 🤖 LLM Notes

-   **Provider**: **Groq** (via OpenAI SDK compatibility).
-   **Model**: `llama-3.1-8b-instant` (chosen for extreme speed and low latency, ideal for chat).
-   **Prompting**:
    -   Uses a **System Prompt** to define the persona ("Spur Support Agent") and domain knowledge (Shipping Policy, Return Policy).
    -   Passes the last 10 messages of conversation history to maintain context.
    -   Includes a fallback error message if the LLM fails.

