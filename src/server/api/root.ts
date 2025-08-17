
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { healthCheckRouter } from "./routers/healthCheck";


export const appRouter = createTRPCRouter({
  health: healthCheckRouter,
});

export type AppRouter = typeof appRouter;


export const createCaller = createCallerFactory(appRouter);
