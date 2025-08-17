import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { db } from "~/server/db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;   
      isGuest: boolean;    
    } & DefaultSession["user"];
  }
}

export const authConfig = {
  providers: [GoogleProvider],
  adapter: PrismaAdapter(db),
  callbacks: {
    session: ({ session, user }) => {
      console.log(session);
      if (user) {
        return {
          ...session,
          user: {
            ...session.user,
            id: user.id,
            isGuest: false,
          },
        };
      } else {
        const guestId = `guest_${Math.random().toString(36).substring(2, 10)}`;
        return {
          ...session,
          user: {
            ...session.user,
            id: guestId,
            isGuest: true,
          },
        };
      }
    },
  },
} satisfies NextAuthConfig;
