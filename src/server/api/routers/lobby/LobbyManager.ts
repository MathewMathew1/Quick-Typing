import type { LobbyUser } from "~/types/lobby";


export class LobbyManager {
  private users: Map<string, LobbyUser>;

  constructor() {
    this.users = new Map();
  }

  join(user: LobbyUser): boolean {
    if (this.users.has(user.id)) {
      return false;
    }
    this.users.set(user.id, user);
    return true;
  }

  leave(userId: string): void {
    this.users.delete(userId);
  }

  getUsers(): LobbyUser[] {
    return Array.from(this.users.values());
  }
}
