"use client";

import { useLobby } from "../context/LobbyContext";

export default function LobbyTable() {
  const { users, loadedData} = useLobby();

  if (!loadedData) {
    return <div className="text-white p-4">Loading lobby data...</div>;
  }

 

  if (users.length === 0) {
    return <div className="text-white p-4">No users in lobby.</div>;
  }

  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full text-left border border-gray-700">
        <thead className="bg-gray-900 text-white">
          <tr>
            <th className="px-4 py-2 border-b border-gray-700">Name</th>
            <th className="px-4 py-2 border-b border-gray-700">Accuracy (%)</th>
            <th className="px-4 py-2 border-b border-gray-700">Words / Minute</th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 text-white">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-700">
              <td className="px-4 py-2 border-b border-gray-700">{user.name}</td>
              <td className="px-4 py-2 border-b border-gray-700">
                {user.accuracy.toFixed(2)}
              </td>
              <td className="px-4 py-2 border-b border-gray-700">
                {user.wordsPerMinute.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
