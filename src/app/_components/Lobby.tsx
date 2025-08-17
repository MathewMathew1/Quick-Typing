"use client"

import { useLobby } from "../context/LobbyContext";
import LobbyTable from "./LobbyTable";

const Lobby = () => {
  const {  isError } = useLobby();

  if (isError) {
    return <div className="p-4 text-red-500">Failed to load lobby data.</div>;
  }
  return <div className="w-full flex justify-center">
    <LobbyTable/>
  </div>;
};

export default Lobby;
