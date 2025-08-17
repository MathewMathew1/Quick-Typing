"use client";

import { useLobby } from "../context/LobbyContext";
import { SortCategory, useLobbySort } from "../hooks/useSortCategory";

export default function LobbyTable() {
  const { users, loadedData } = useLobby();

  const { sortCategory, sortOrder, changeSortCategory } = useLobbySort();

  if (!loadedData) {
    return <div className="p-4 text-white">Loading lobby data...</div>;
  }

  if (users.length === 0) {
    return <div className="p-4 text-white">No users in lobby.</div>;
  }

   const displayedUsers = [...users];

  return (
    <div className="w-full overflow-x-auto p-4 sm:w-[80%]">
      <table className="min-w-full border border-gray-700 text-left">
        <thead className="bg-gray-900 text-white">
          <tr>
            <th
              className="cursor-pointer border-b border-gray-700 px-4 py-2"
              onClick={() => changeSortCategory(SortCategory.NAME)}
            >
              Name{" "}
              {sortCategory === SortCategory.NAME
                ? sortOrder === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </th>
            <th
              className="cursor-pointer border-b border-gray-700 px-4 py-2"
              onClick={() => changeSortCategory(SortCategory.ACCURACY)}
            >
              Accuracy (%){" "}
              {sortCategory === SortCategory.ACCURACY
                ? sortOrder === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </th>
            <th
              className="cursor-pointer border-b border-gray-700 px-4 py-2"
              onClick={() => changeSortCategory(SortCategory.WORDS_PER_MINUTE)}
            >
              Words / Minute{" "}
              {sortCategory === SortCategory.WORDS_PER_MINUTE
                ? sortOrder === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 text-white">
          {displayedUsers.map((user) => (
            <tr key={user.id} className="hover:bg-gray-700">
              <td className="border-b border-gray-700 px-4 py-2">
                {user.name}
              </td>
              <td className="border-b border-gray-700 px-4 py-2">
                {user.accuracy.toFixed(2)}
              </td>
              <td className="border-b border-gray-700 px-4 py-2">
                {user.wordsPerMinute.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
