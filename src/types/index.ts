export interface LiveGame {
    gameId: string;
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
    timeElapsed: number;
    events: GameEvent[];
  }
  
  export interface GameEvent {
    type: 'goal' | 'yellowCard' | 'redCard' | 'substitution';
    team: 'home' | 'away';
    player: string;
    minute: number;
  }
  
  export interface User {
    id: string;
    username: string;
    balance: number;
    email: string;
    passwordHash: string;
    createdAt: Date;
  }
  
  export interface Bet {
    id: string;
    userId: string;
    gameId: string;
    betType: 'winner' | 'scoreExact' | 'nextGoal';
    pick: string;
    amount: number;
    odds: number;
    status: 'pending' | 'won' | 'lost';
    createdAt: Date;
  }
  
  export interface LeaderboardEntry {
    userId: string;
    username: string;
    totalWinnings: number;
    totalBets: number;
    winRate: number;
  }
  