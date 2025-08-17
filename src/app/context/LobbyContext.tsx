"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

import type { LobbyUser, LobbyUserStats } from "~/types/lobby";
import useArray from "../hooks/useArray";

import { api } from "~/trpc/react";

type LobbyContextProps = {
  users: LobbyUserStats[];
  currentUser: LobbyUserStats | null;
  loadedData: boolean;
  isError: boolean; // can later add more info
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
  const {
    array: users,
    push,
    removeByKey,
    updateObjectByKey,
  } = useArray<LobbyUserStats>([]);

  const [currentUser, setCurrentUser] = useState<LobbyUserStats | null>(null);
  const [loadedData, setLoadedData] = useState(false);
  const [isError, setIsError] = useState(false);

  const addUser = (user: LobbyUserStats) => {
    if (!users.find((u) => u.id === user.id)) {
      push(user);
    }
  };

  const removeUser = (userId: string) => {
    removeByKey("id", userId);
  };

  const updateUser = (
    userId: string,
    updatedFields: Partial<LobbyUserStats>,
  ) => {
    const updates = Object.entries(updatedFields).map(
      ([field, fieldValue]) => ({
        field: field as keyof LobbyUserStats,
        fieldValue,
      }),
    );
    updateObjectByKey("id", userId, updates);
  };

  api.lobby.onUpdateStats.useSubscription(undefined, {
    onData: (user: LobbyUser) => {
      const accuracy =
        user.wordsWritten > 0
          ? (user.wordsAccurate / user.wordsWritten) * 100
          : 0;

      const minutes = user.timeWritten / 1000 / 60;
      const wordsPerMinute = minutes > 0 ? user.wordsWritten / minutes : 0;

      const updatedStats: Partial<LobbyUserStats> = {
        ...user,
        accuracy,
        wordsPerMinute,
      };

      updateUser(user.id, updatedStats);

      if (currentUser?.id === user.id) {
        setCurrentUser((prev) => (prev ? { ...prev, ...updatedStats } : prev));
      }
    },
  });

  api.lobby.onJoin.useSubscription(undefined, {
    onData: (user: LobbyUser) => {
      if (!users.find((u) => u.id === user.id)) {
        const accuracy =
          user.wordsWritten > 0
            ? (user.wordsAccurate / user.wordsWritten) * 100
            : 0;

        const minutes = user.timeWritten / 1000 / 60;
        const wordsPerMinute = minutes > 0 ? user.wordsWritten / minutes : 0;

        push({ ...user, accuracy, wordsPerMinute });
      }
    },
  });

  const joinMutation = api.lobby.join.useMutation({
    onSuccess: (result) => {
      if (!result?.success || !result.users) {
        setIsError(true);
        return;
      }

      result.users.forEach((user: LobbyUser) => {
        const accuracy =
          user.wordsWritten > 0
            ? (user.wordsAccurate / user.wordsWritten) * 100
            : 0;

        const minutes = user.timeWritten / 1000 / 60;
        const wordsPerMinute = minutes > 0 ? user.wordsWritten / minutes : 0;

        const userStats: LobbyUserStats = { ...user, accuracy, wordsPerMinute };
        push(userStats);

        if (user.id === result.users.find((u) => u.id)?.id)
          setCurrentUser(userStats);
      });
    },
    onError: () => {
      setIsError(true);
    },
    onSettled: () => {
      setLoadedData(true);
    },
  });

  useEffect(() => {
    joinMutation.mutate({});
  }, []);

  return (
    <LobbyContext.Provider value={{ users, currentUser, isError, loadedData }}>
      <LobbyUpdate.Provider value={{ addUser, removeUser, updateUser }}>
        {children}
      </LobbyUpdate.Provider>
    </LobbyContext.Provider>
  );
}
