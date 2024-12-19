export interface Game {
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
  
  export interface LeaderboardEntry {
    userId: string;
    username: string;
    totalWinnings: number;
    totalBets: number;
    winRate: number;
  }
  
  export interface Bet {
    gameId: string;
    amount: number;
    pick: 'home' | 'away';
    betType: string;
    odds: number;
  }