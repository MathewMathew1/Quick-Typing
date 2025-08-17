// hooks/useSortedLobbyUsers.ts
import { useMemo } from "react";
import type { LobbyUserStats } from "~/types/lobby";
import type { SortCategory, SortOrder } from "./useSortCategory";


export function useSortedLobbyUsers(
  users: LobbyUserStats[],
  sortCategory: SortCategory,
  sortOrder: SortOrder,
  limit: number = 1000
) {
  const sortedUsers = useMemo(() => {
    const usersCopy = [...users];

    usersCopy.sort((a, b) => {
      let valueA: string | number = a[sortCategory];
      let valueB: string | number = b[sortCategory];

      if (typeof valueA === "string") valueA = valueA.toLowerCase();
      if (typeof valueB === "string") valueB = valueB.toLowerCase();

      if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
      if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return usersCopy.slice(0, limit);
  }, [users, sortCategory, sortOrder, limit]);

  return sortedUsers;
}
