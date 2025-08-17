
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { healthCheckRouter } from "./routers/healthCheck";
import { lobbyRouter } from "./routers/lobby/lobby";


export const appRouter = createTRPCRouter({
  health: healthCheckRouter,
  lobby: lobbyRouter
});

export type AppRouter = typeof appRouter;


export const createCaller = createCallerFactory(appRouter);
