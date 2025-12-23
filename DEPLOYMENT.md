# Deployment Guide

## Option 1: Docker (Recommended)
This project is set up to be deployed as a single Docker container (Monolith).

1.  **Build the Image**:
    ```bash
    docker build -t spur-chat .
    ```

2.  **Run the Container**:
    ```bash
    docker run -p 3000:3000 -e GROQ_API_KEY=your_key_here spur-chat
    ```

## Option 2: Render / Railway / Heroku
Use the provided `Dockerfile` to deploy to any platform that supports Docker.

- **Render**: Create a "Web Service", connect your repo, and choose "Docker" as the environment. Add `GROQ_API_KEY` environment variable.
- **Railway**: Connect repo, it will auto-detect Dockerfile.

## Option 3: Manual (VPS)
1.  Build frontend: `cd frontend && npm run build`
2.  Start backend: `cd backend && npm start`
    - Ensure `PORT` and `GROQ_API_KEY` are set in `.env`.
