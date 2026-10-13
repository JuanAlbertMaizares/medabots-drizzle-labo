import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { medabotController } from './controllers/medabot.controller.js';
import { pool } from './db/index.js';
import type { Server } from 'node:http';

const app = new Hono();

// Health check (útil para Render)
app.get('/health', (c) => c.json({ status: 'ok' }));

app.route('/api/medabots', medabotController);

const port = Number(process.env.PORT) || 3000;

const server = serve(
  {
    fetch: app.fetch,
    port,
    hostname: process.env.HOSTNAME_BIND || undefined,
  },
  (info) => {
    console.log(`🚀 API de Medabots escuchando en http://localhost:${info.port}`);
  }
);

// Cierre limpio con tope de tiempo
let closing = false;

const shutdown = async () => {
  if (closing) return;
  closing = true;

  // Si algo se cuelga, salimos igual a los 3 segundos
  setTimeout(() => process.exit(1), 3000).unref();

  (server as Server).closeAllConnections?.(); // corta las keep-alive
  server.close();
  await pool.end();
  process.exit(0);
};