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

  onUpdateStats: publicProcedure.subscription(() => {
    return observable<LobbyUser>((emit) => {
      const listener = (user: LobbyUser) => {
        emit.next(user);
      };

      lobbyEmitter.on(LobbyEvents.UPDATE_STATS, listener);

      return () => {
        lobbyEmitter.off(LobbyEvents.UPDATE_STATS, listener);
      };
    });
  }),

  join: publicProcedure.input(z.object({})).mutation(async ({ ctx }) => {
    if (!ctx.session?.user) return null;

    let wordsWritten = 0;
    let wordsAccurate = 0;
    let timeWritten = 0;

    if (!ctx.session.user.isGuest) {
      const dbUser = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: {
          wordsWritten: true,
          accurateWords: true,
          secondsWritten: true,
          name: true,
        },
      });

      if (dbUser) {
        wordsWritten = dbUser.wordsWritten;
        wordsAccurate = dbUser.accurateWords;
        timeWritten = dbUser.secondsWritten;
      }
    }

    const user: LobbyUser = {
      id: ctx.session.user.id,
      name: ctx.session.user.name ?? "Guest",
      isGuest: ctx.session.user.isGuest ?? false,
      wordsWritten,
      wordsAccurate,
      timeWritten,
    };

    const joined = lobbyManager.join(user);
    if (!joined) return { success: false };

    return { success: true, users: lobbyManager.getUsers() };
  }),

  submitWord: publicProcedure
    .input(
      z.object({
        word: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const user = ctx.session?.user!;
      const isCorrect = lobbyManager.checkWord(user?.id, input.word);

      return {
        success: true,
        isCorrect,
        user,
      };
    }),
});
