export interface Game {
    gameId: string;
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
    timeElapsed: number;
    events: GameEvent[];
  }
  
  export interface GameEvent {
    type: string;
    team: 'home' | 'away';
    player: string;
    minute: number;
  }
  
  export interface Bet {
    id: string;
    gameId: string;
    betType: string;
    pick: string;
    amount: number;
    odds: number;
    status: 'pending' | 'won' | 'lost';
  }
  
  export interface LeaderboardEntry {
    userId: string;
    username: string;
    totalWinnings: number;
    totalBets: number;
    winRate: number;
  }