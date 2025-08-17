export type LobbyUser = {
  id: string;
  name: string;
  isGuest: boolean;
  wordsWritten: number;
  timeWritten: number;
  wordsAccurate: number;
};

export type LobbyUserStats = LobbyUser & {
  accuracy: number;
  wordsPerMinute: number;
};