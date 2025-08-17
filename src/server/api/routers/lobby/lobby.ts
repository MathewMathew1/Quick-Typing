import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { observable } from "@trpc/server/observable";
import { EventEmitter } from "events";
import { LobbyEvents } from "./LobbyEvents";
import type { LobbyUser } from "~/types/lobby";
import { lobbyManager } from "./LobbyManager";

export const lobbyEmitter = new EventEmitter();
lobbyManager.initEmitter(lobbyEmitter);

export const lobbyRouter = createTRPCRouter({
  onJoin: publicProcedure.subscription(() => {
    return observable<LobbyUser>((emit) => {
      const listener = (user: LobbyUser) => {
        emit.next(user);
      };

      lobbyEmitter.on(LobbyEvents.JOIN, listener);

      return () => {
        lobbyEmitter.off(LobbyEvents.JOIN, listener);
      };
    });
  }),

  onPreGame: publicProcedure.subscription(() => {
    return observable<{ quote: string; endsAt: number }>((emit) => {
      const listener = (payload: { quote: string; endsAt: number }) => {
        emit.next(payload);
      };

      lobbyManager.initEmitter(lobbyEmitter);
      lobbyEmitter.on(LobbyEvents.PRE_GAME, listener);

      return () => {
        lobbyEmitter.off(LobbyEvents.PRE_GAME, listener);
      };
    });
  }),

  onStartGame: publicProcedure.subscription(() => {
    return observable<{ quote: string; durationMs: number }>((emit) => {
      const listener = (payload: { quote: string; durationMs: number }) => {
        emit.next(payload);
      };

      lobbyManager.initEmitter(lobbyEmitter);
      lobbyEmitter.on(LobbyEvents.START_GAME, listener);

      return () => {
        lobbyEmitter.off(LobbyEvents.START_GAME, listener);
      };
    });
  }),

  join: publicProcedure.input(z.object({})).mutation(async ({ ctx }) => {
    if (!ctx.session?.user) return null;

    const user: LobbyUser = {
      id: ctx.session.user.id,
      name: ctx.session.user.name ?? "Guest",
      isGuest: ctx.session.user.isGuest ?? false,
      wordsWritten: 0,
      timeWritten: 0,
      wordsAccurate: 0,
    };

    const joined = lobbyManager.join(user);
    if (!joined) return { success: false };

    return { success: true, users: lobbyManager.getUsers() };
  }),

  leave: publicProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(({ input }) => {
      lobbyManager.leave(input.userId);
      return { success: true };
    }),

  submitWord: publicProcedure
    .input(
      z.object({
        word: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const user = ctx.session?.user!;
      const isCorrect = lobbyManager.checkWord(
        user?.id,
        input.word
      );

      

      return {
        success: true,
        isCorrect,
        user,
      };
    }),
});
