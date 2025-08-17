import { parse } from "cookie";
import { db } from "../db";
import type { Session } from "next-auth";
import type { CreateWSSContextFnOptions } from "@trpc/server/adapters/ws";

function mapPrismaUserToSessionUser(user: any) {
  // to remove later any
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    isGuest: false,
  };
}

export const createContext = async (opts: CreateWSSContextFnOptions) => {
  const cookies = parse(opts.req.headers.cookie ?? "");
  const sessionToken = cookies["authjs.session-token"];

  let session: Session | null = null;

  if (sessionToken) {
    const prismaSession = await db.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });

    if (prismaSession) {
      session = {
        user: mapPrismaUserToSessionUser(prismaSession.user),
        expires: prismaSession.expires.toISOString(),
      };
    }
  }

  if (!session) {
    session = {
      user: {
        id: `guest_${Math.random().toString(36).substring(2, 10)}`,
        name: null,
        email: null,
        image: null,
        isGuest: true,
      },
      expires: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    };
  }

  const headers = new Headers();
  for (const [key, value] of Object.entries(opts.req.headers)) {
    if (value) headers.set(key, Array.isArray(value) ? value.join(",") : value);
  }

  return { db, session, headers };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
