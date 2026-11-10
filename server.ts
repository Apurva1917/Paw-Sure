/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * PAWSURE FULL-STACK EXPRESS SERVER
 * - Hosts /api routes with server-side authentication, RBAC, and data isolation
 * - Mounts Vite middleware in development mode on port 3000
 * - Serves production build in production
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiRouter } from './src/server/routes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
const PORT = 3000;

// Middleware for parsing JSON requests
app.use(express.json());

// Mount API router
app.use('/api', apiRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Pawsure Backend',
    version: 'v1.3',
    time: new Date().toISOString()
  });
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // Dynamic import of Vite for development middleware mode
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Production static file serving
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  // Only start listening if not running under a test runner
  if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[Pawsure Server] Listening on http://0.0.0.0:${PORT} (Mode: ${isProduction ? 'production' : 'development'})`);
    });
  }
}

// Start server if executed directly
if (process.argv[1] && process.argv[1].endsWith('server.ts')) {
  startServer().catch((err) => {
    console.error('[Pawsure Server] Failed to start:', err);
    process.exit(1);
  });
}
