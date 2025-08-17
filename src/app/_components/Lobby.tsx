"use client";

import { useLobby } from "../context/LobbyContext";
import LobbyTable from "./LobbyTable";

const Lobby = () => {
  const { isError } = useLobby();
  if (isError) {
    return (
      <div className="rounded-md border border-red-500 bg-red-100 p-4 text-red-700 shadow-sm">
        Failed to load lobby data. Only one instance of the same user/computer
        can be in the lobby.
      </div>
    );
  }
  return (
    <div className="flex w-full justify-center">
      <LobbyTable />
    </div>
  );
};

export default Lobby;
