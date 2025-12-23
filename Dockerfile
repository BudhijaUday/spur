FROM node:18-alpine

WORKDIR /app

# Copy root package files if any (skipping for now as we have separate folders)

# Setup Backend
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install
COPY backend/ ./

# Setup Frontend
WORKDIR /app
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm install
COPY frontend/ ./
RUN npm run build

# Finalize
WORKDIR /app/backend
ENV PORT=3000
EXPOSE 3000

# Start command
CMD ["npx", "tsx", "src/server.ts"]
