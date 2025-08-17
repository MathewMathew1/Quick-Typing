"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";

import type { LobbyUserStats } from "~/types/lobby";
import useArray from "../hooks/useArray";

type LobbyContextProps = {
  users: LobbyUserStats[];
};

type LobbyUpdateProps = {
  addUser: (user: LobbyUserStats) => void;
  removeUser: (userId: string) => void;
  updateUser: (userId: string, updatedFields: Partial<LobbyUserStats>) => void;
};

const LobbyContext = createContext({} as LobbyContextProps);
const LobbyUpdate = createContext({} as LobbyUpdateProps);

export function useLobby() {
  return useContext(LobbyContext);
}

export function useUpdateLobby() {
  return useContext(LobbyUpdate);
}

export function LobbyProvider({ children }: { children: ReactNode }) {
  const { array: users, push, removeByKey, updateObjectByKey } = useArray<LobbyUserStats>([]);

  const addUser = (user: LobbyUserStats) => {
    if (!users.find(u => u.id === user.id)) {
      push(user);
    }
  };

  const removeUser = (userId: string) => {
    removeByKey("id", userId);
  };

  const updateUser = (userId: string, updatedFields: Partial<LobbyUserStats>) => {
    const updates = Object.entries(updatedFields).map(([field, fieldValue]) => ({
      field: field as keyof LobbyUserStats,
      fieldValue,
    }));
    updateObjectByKey("id", userId, updates);
  };

  return (
    <LobbyContext.Provider value={{ users }}>
      <LobbyUpdate.Provider value={{ addUser, removeUser, updateUser }}>
        {children}
      </LobbyUpdate.Provider>
    </LobbyContext.Provider>
  );
}
