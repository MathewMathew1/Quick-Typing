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

export type UserRoundData = {
  wordsWritten: number;
  wordsAccurate: number;
  timeWritten: number;
  currentWord: string;
  roundStart?: number;
};

export type LobbyUserWithRound = {
  user: LobbyUser;
  roundData: UserRoundData;
};
