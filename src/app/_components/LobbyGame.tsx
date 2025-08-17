import React, { useEffect, useState } from "react";
import { api } from "~/trpc/react";


type GameState = "idle" | "preGame" | "game";

export const LobbyGame: React.FC = () => {
  const [quote, setQuote] = useState<string>("");
  const [timer, setTimer] = useState<number>(0);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [inputValue, setInputValue] = useState<string>("");


  api.lobby.onPreGame.useSubscription(undefined, {
    onData: (payload) => {
        console.log("log")
      setQuote(payload.quote);
      setTimer(Math.max(0, Math.floor((payload.endsAt - Date.now()) / 1000)));
      setGameState("preGame");
      setInputValue("");
    },
  });

  api.lobby.onStartGame.useSubscription(undefined, {
    onData: (payload) => {
      setQuote(payload.quote);
      setTimer(Math.ceil(payload.durationMs / 1000));
      setGameState("game");
      setInputValue("");
    },
  });

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div className="min-h-[500px] bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-lg p-6 w-full max-w-xl flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center">
          {gameState === "preGame" && "Pre-Game"}
          {gameState === "game" && "Game"}
          {gameState === "idle" && "Waiting..."}
        </h1>

        <div className="text-center text-lg p-4 bg-gray-700 rounded-lg">
          {quote || "Waiting for quote..."}
        </div>

        <div className="text-center text-3xl font-mono">{timer}s</div>

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={gameState !== "game"}
          className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white"
          placeholder={gameState !== "game" ? "Wait for the game to start..." : "Type here..."}
        />
      </div>
    </div>
  );
};
