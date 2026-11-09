import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

// Vite Plugin to provide local file system storage for TOEIC dictionary
function localJsonStoragePlugin(): Plugin {
  const dataDir = path.resolve(process.cwd(), 'data');
  const dataFilePath = path.join(dataDir, 'dictionary.json');

  const ensureFileExists = () => {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  };

  return {
    name: 'vite-local-json-storage',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        // GET /api/entries: load entries from local disk file
        if (req.url === '/api/entries' && req.method === 'GET') {
          ensureFileExists();
          if (fs.existsSync(dataFilePath)) {
            try {
              const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.end(fileContent);
              return;
            } catch (err) {
              console.error('Error reading local dictionary.json:', err);
            }
          }
          // If not exist, initialize empty array
          fs.writeFileSync(dataFilePath, '[]', 'utf-8');
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end('[]');
          return;
        }

        // POST /api/entries: save entries directly to local disk file
        if (req.url === '/api/entries' && req.method === 'POST') {
          ensureFileExists();
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              // Parse to validate JSON
              const parsed = JSON.parse(body);
              fs.writeFileSync(dataFilePath, JSON.stringify(parsed, null, 2), 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, count: parsed.length, path: dataFilePath }));
            } catch (err: any) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        // GET /api/file-info
        if (req.url === '/api/file-info' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            dataFilePath,
            exists: fs.existsSync(dataFilePath),
            size: fs.existsSync(dataFilePath) ? fs.statSync(dataFilePath).size : 0
          }));
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), localJsonStoragePlugin()],
  server: {
    port: 5173,
    host: '127.0.0.1'
  }
});
