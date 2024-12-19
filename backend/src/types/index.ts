export interface LiveGame {
    gameId: string;
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
    timeElapsed: number;
    events: Array<{
      type: string;
      team: string;
      player: string;
      minute: number;
    }>;
  }
  
  export interface User {
    id: string;
    username: string;
    balance: number;
  }
  
  export interface Bet {
    id: string;
    userId: string;
    gameId: string;
    betType: string;
    pick: string;
    amount: number;
    odds: number;
  }

  export interface GameUpdate {
    gameId: string;
    timeElapsed: number;
    eventType: string;
    team: string;
    scorer?: string;
    newScore?: string;
  }