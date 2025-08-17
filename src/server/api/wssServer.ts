import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { appRouter } from "./root";
import { WebSocketServer, type WebSocket } from "ws";
import { createContext, type Context } from "./context";
import { lobbyManager } from "./routers/lobby/LobbyManager";
import type { IncomingMessage } from "http";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
const wss = new WebSocketServer({ port: PORT });

const wsUserMap = new Map<WebSocket, string>();

const handler = applyWSSHandler({
  wss,
  router: appRouter,
  createContext,
  keepAlive: { enabled: true, pingMs: 30000, pongWaitMs: 5000 },
});

wss.on("connection", async (ws: WebSocket, req: IncomingMessage) => {
  const ctx: Context = await createContext({
    req,
    res: {} as any,
    info: {} as any, 
  });
  const userId = ctx.session?.user?.id ?? `guest_${req.socket.remoteAddress}`;
  wsUserMap.set(ws, userId);

  ws.once("close", () => {
    lobbyManager.leave(userId);
    wsUserMap.delete(ws);
  });
});

process.on("SIGTERM", () => {
  handler.broadcastReconnectNotification();
  wss.close();
});
