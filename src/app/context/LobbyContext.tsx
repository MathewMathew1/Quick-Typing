"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type LobbyContextProps = {};

type LobbyUpdateProps = {};

const LobbyContext = createContext({} as LobbyContextProps);
const LobbyUpdate = createContext({} as LobbyUpdateProps);

export function useLobby() {
  return useContext(LobbyContext);
}

export function useUpdateLobby() {
  return useContext(LobbyUpdate);
}

export function LobbyProvider({ children }: { children: ReactNode }) {
  return (
    <LobbyContext.Provider value={{}}>
      <LobbyUpdate.Provider value={{}}>{children}</LobbyUpdate.Provider>
    </LobbyContext.Provider>
  );
}
