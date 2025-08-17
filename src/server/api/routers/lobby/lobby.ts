import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { observable } from "@trpc/server/observable";
import { EventEmitter } from "events";
import { LobbyEvents } from "./LobbyEvents";

export const lobbyEmitter = new EventEmitter();

export const lobbyRouter = createTRPCRouter({
  onJoin: publicProcedure.subscription(({ ctx }) => {
    return observable<{ joinData: any }>((emit) => {
      const listener = (joinData: any) => {
        emit.next(joinData);
      };

      lobbyEmitter.on(LobbyEvents.JOIN, listener);

      return () => {
        lobbyEmitter.off(LobbyEvents.JOIN, listener);
      };
    });
  }),

  join: publicProcedure.input(z.object({})).mutation(async ({ ctx }) => {
    lobbyEmitter.emit("new-post", {});
    return {};
  }),
});
