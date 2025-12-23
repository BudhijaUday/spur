import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve('dev.db');
export const db = new Database(dbPath);

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS Conversation (
    id TEXT PRIMARY KEY,
    createdAt TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS Message (
    id TEXT PRIMARY KEY,
    conversationId TEXT,
    sender TEXT,
    text TEXT,
    timestamp TEXT DEFAULT (datetime('now')),
    FOREIGN KEY(conversationId) REFERENCES Conversation(id)
  );
`);
