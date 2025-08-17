import type { LobbyUser, LobbyUserWithRound } from "~/types/lobby";
import { GameLoop } from "./GameManager/GameManager";
import { EventEmitter } from "events";
import { db } from "~/server/db";
import { LobbyEvents } from "./LobbyEvents";

export class LobbyManager {
  private users: Map<string, LobbyUserWithRound>;
  private gameManager: GameLoop = new GameLoop();
  private emitter?: EventEmitter;

  constructor() {
    this.users = new Map();
  }

  join(user: LobbyUser): boolean {
    if (this.users.has(user.id)) return false;

    if (this.users.size === 0) {
      this.gameManager.setGameOnOff(true);
    }

    this.users.set(user.id, {
      user,
      roundData: {
        wordsWritten: 0,
        wordsAccurate: 0,
        timeWritten: 0,
        currentWord: "",
      },
    });

    return true;
  }

  leave(userId: string): void {
    console.log(userId);
    const entry = this.users.get(userId);

    if (entry) {
      this.updateUserData(entry);
    }

    this.users.delete(userId);
    if (this.users.size === 0) {
      this.gameManager.setGameOnOff(false);
    }
  }

  getUsers(): LobbyUser[] {
    return Array.from(this.users.values()).map((entry) => entry.user);
  }

  initEmitter(emitter: EventEmitter) {
    this.gameManager.initEmitter(emitter);
    this.emitter = emitter;
  }
  checkWord(userId: string, word: string): boolean {
    const entry = this.users.get(userId);
    if (!entry || !this.gameManager.currentQuote) return false;

    const currentWords = this.gameManager.currentQuote.text.split(" ");
    const currentIndex = entry.roundData.wordsWritten;
    const correctWord = currentWords[currentIndex] || "";

    const isCorrect = word === correctWord;

    const now = Date.now();
    if (entry.roundData.roundStart) {
      const timeSpent = now - entry.roundData.roundStart;
      entry.roundData.timeWritten += timeSpent;
    }

    entry.roundData.roundStart = now;

    if (isCorrect) {
      entry.roundData.wordsWritten += 1;
      entry.roundData.wordsAccurate += 1;
      entry.roundData.currentWord =
        currentWords[entry.roundData.wordsWritten] || "";
    } else {
      entry.roundData.currentWord = correctWord;
    }

    if (entry.roundData.wordsWritten >= currentWords.length) {
      this.updateUserData(entry);
    }

    return isCorrect;
  }

  updateCurrentWord(userId: string, word: string) {
    const entry = this.users.get(userId);
    if (!entry) return;
    entry.roundData.currentWord = word;
  }

  async resetRoundData() {
    for (const entry of this.users.values()) {
      await this.updateUserData(entry);
      entry.roundData = {
        wordsWritten: 0,
        wordsAccurate: 0,
        timeWritten: 0,
        currentWord: "",
      };
    }
  }

  async updateUserData(entry: LobbyUserWithRound) {
    entry.user.timeWritten += entry.roundData.timeWritten;
    entry.user.wordsAccurate += entry.roundData.wordsAccurate;
    entry.user.wordsWritten += entry.roundData.wordsWritten;

    if (this.emitter) {
      this.emitter.emit(LobbyEvents.UPDATE_STATS, entry.user);
    }

    if (!entry.user.isGuest) {
      await db.user.update({
        where: { id: entry.user.id },
        data: {
          secondsWritten: entry.user.timeWritten,
          accurateWords: entry.user.wordsAccurate,
          wordsWritten: entry.user.wordsWritten,
        },
      });
    }
  }
}

export const lobbyManager = new LobbyManager();
