import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import Navbar from "./_components/Navbar";
import { LobbyProvider } from "./context/LobbyContext";
import Lobby from "./_components/Lobby";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <Navbar />
        <LobbyProvider>
          <Lobby/>
        </LobbyProvider>
      </main>
    </HydrateClient>
  );
}
