import type { LobbyUser } from "~/types/lobby";
import { GameLoop } from "./GameManager/GameManager";

export class LobbyManager {
  private users: Map<string, LobbyUser>;
  private gameManager: GameLoop = new GameLoop();

  constructor() {
    this.users = new Map();
  }

  join(user: LobbyUser): boolean {
    if (this.users.has(user.id)) {
      return false;
    }
    if (this.users.size == 0) {
      this.gameManager.setGameOnOff(true);
    }
    this.users.set(user.id, user);
    return true;
  }

  leave(userId: string): void {
    this.users.delete(userId);
    if (this.users.size == 0) {
      this.gameManager.setGameOnOff(false);
    }
  }

  getUsers(): LobbyUser[] {
    return Array.from(this.users.values());
  }
}

export const lobbyManager = new LobbyManager();
