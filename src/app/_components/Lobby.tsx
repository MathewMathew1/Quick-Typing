"use client"

import { useLobby } from "../context/LobbyContext";
import LobbyTable from "./LobbyTable";

const Lobby = () => {
  const { users, loadedData, isError } = useLobby();

  if (isError) {
    return <div className="p-4 text-red-500">Failed to load lobby data.</div>;
  }
  return <div>
    <LobbyTable/>
  </div>;
};

export default Lobby;
