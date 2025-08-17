import React, { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { useTypingRace } from "../hooks/useTypeRacer";

type GameState = "idle" | "preGame" | "game";

export const LobbyGame: React.FC = () => {
  const [quote, setQuote] = useState<string>("");
  const [timer, setTimer] = useState<number>(0);
  const [gameState, setGameState] = useState<GameState>("idle");
  const {
    inputValue,
    handleInputChange,
    currentWordIndex,
    isCurrentWordCorrect,
    words,
  } = useTypingRace(quote);

  api.lobby.onPreGame.useSubscription(undefined, {
    onData: (payload) => {
      setQuote(payload.quote);
      setTimer(Math.max(0, Math.floor((payload.endsAt - Date.now()) / 1000)));
      setGameState("preGame");
      handleInputChange("");
    },
  });

  api.lobby.onStartGame.useSubscription(undefined, {
    onData: (payload) => {
      setQuote(payload.quote);
      setTimer(Math.ceil(payload.durationMs / 1000));
      setGameState("game");
      handleInputChange("");
    },
  });

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(
      () => setTimer((t) => Math.max(0, t - 1)),
      1000,
    );
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center bg-gray-900 p-4 text-white">
      <div className="flex w-full max-w-xl flex-col gap-4 rounded-2xl bg-gray-800 p-6 shadow-lg">
        <h1 className="text-center text-2xl font-bold">
          {gameState === "preGame" && "Pre-Game"}
          {gameState === "game" && "Game"}
          {gameState === "idle" && "Waiting..."}
        </h1>
        <div className="rounded-lg bg-gray-700 p-4 text-center text-lg break-words whitespace-normal">
          {words.length === 0 ? (
            <span>Waiting for quote...</span>
          ) : (
            words.map((word, index) => {
              let colorClass = "text-white";
              if (index < currentWordIndex) colorClass = "text-green-400";
              else if (index === currentWordIndex)
                colorClass = isCurrentWordCorrect
                  ? "text-white underline"
                  : "text-red-400 underline";
              return (
                <span key={index} className={`${colorClass} mr-1`}>
                  {word}
                </span>
              );
            })
          )}
        </div>

        <div className="text-center font-mono text-3xl">{timer}s</div>

        <input
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onPaste={(e) => e.preventDefault()}
          disabled={gameState !== "game"}
          className={`w-full rounded-lg border p-3 text-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
            isCurrentWordCorrect
              ? "border-gray-600 bg-gray-700 focus:border-indigo-500"
              : "border-red-500 bg-red-700 focus:border-red-400"
          }`}
          placeholder={
            gameState !== "game"
              ? "Wait for the game to start..."
              : "Type here..."
          }
        />
      </div>
    </div>
  );
};
