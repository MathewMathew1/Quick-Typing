import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const healthCheckRouter = createTRPCRouter({
  hello: publicProcedure.query(() => {
    return { message: "hello from user router" };
  }),
});