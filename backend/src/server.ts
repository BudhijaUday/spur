import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router } from './routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from frontend/dist
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDist = path.join(process.cwd(), '../frontend/dist');
console.log('Frontend Dist Path:', frontendDist);

import fs from 'fs';
if (!fs.existsSync(frontendDist)) {
  console.error('Frontend dist not found at:', frontendDist);
} else {
  console.log('Frontend dist found at:', frontendDist);
}

app.use(express.static(frontendDist));
app.use('/api', router);

// Handle SPA routing
// app.get('*', (req, res) => {
//   if (req.path.startsWith('/api')) return res.status(404).json({ error: 'Not Found' });
//   res.sendFile('index.html', { root: frontendDist });
// });

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
