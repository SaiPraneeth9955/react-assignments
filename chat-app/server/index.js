import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import express from 'express';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 4000;
const USER_LIST = ['Alan', 'Bob', 'Carol', 'Dean', 'Elin'];
const MAX_HISTORY = 500;
const MAX_TEXT_LENGTH = 2000;

const app = express();
app.use(cors());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', messages: messages.length });
});

// Serve the production client build when it exists (npm run build && npm start).
const clientDist = join(dirname(fileURLToPath(import.meta.url)), '..', 'client', 'dist');
if (existsSync(clientDist)) {
  app.use(express.static(clientDist));
}

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

// In-memory store: enough for the assignment, resets when the server restarts.
const messages = [];

const randomUser = () => USER_LIST[Math.floor(Math.random() * USER_LIST.length)];

io.on('connection', (socket) => {
  // New subscriber gets the thread so far.
  socket.emit('chat:history', messages);

  // Publish: a client sends a message, every subscriber receives it.
  socket.on('chat:message', (payload) => {
    const text = typeof payload?.text === 'string' ? payload.text.trim() : '';
    if (!text) return;

    const message = {
      id: typeof payload.id === 'string' && payload.id ? payload.id : crypto.randomUUID(),
      user: USER_LIST.includes(payload.user) ? payload.user : randomUser(),
      text: text.slice(0, MAX_TEXT_LENGTH),
      time: Date.now(),
      likes: 0,
    };
    if (messages.some((m) => m.id === message.id)) return;

    messages.push(message);
    if (messages.length > MAX_HISTORY) messages.shift();
    io.emit('chat:message', message);
  });

  socket.on('chat:like', (id) => {
    const message = messages.find((m) => m.id === id);
    if (!message) return;
    message.likes += 1;
    io.emit('chat:like', { id: message.id, likes: message.likes });
  });
});

httpServer.listen(PORT, () => {
  console.log(`Chat server listening on http://localhost:${PORT}`);
});
