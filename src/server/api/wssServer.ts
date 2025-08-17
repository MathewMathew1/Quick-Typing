// wssServer.ts
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { appRouter } from './root';
import { WebSocketServer } from "ws";
import { createContext } from './context';


const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
const wss = new WebSocketServer({ port: PORT });

const handler = applyWSSHandler({
  wss,
  router: appRouter,
  createContext,
  keepAlive: { enabled: true, pingMs: 30000, pongWaitMs: 5000 },
});

wss.on('connection', (ws) => {
  console.log(`➕ Connection (${wss.clients.size})`);
  ws.once('close', () => {
    console.log(`➖ Connection (${wss.clients.size})`);
  });
});

console.log(`✅ WebSocket Server listening on ws://localhost:${PORT}`);
process.on('SIGTERM', () => {
  handler.broadcastReconnectNotification();
  wss.close();
});