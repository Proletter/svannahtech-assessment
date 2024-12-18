import { LeaderboardEntry, Bet, User } from '../types';

export class LeaderboardService {
  private leaderboard: Map<string, LeaderboardEntry>;
  private bettingService: BettingService;

  constructor(bettingService: BettingService) {
    this.leaderboard = new Map();
    this.bettingService = bettingService;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.bettingService.on('betSettled', ({ bet, user }) => {
      this.updateLeaderboard(bet, user);
    });
  }

  private updateLeaderboard(bet: Bet, user: User): void {
    let entry = this.leaderboard.get(user.id) || {
      userId: user.id,
      username: user.username,
      totalWinnings: 0,
      totalBets: 0,
      winRate: 0
    };

    entry.totalBets++;
    if (bet.status === 'won') {
      entry.totalWinnings += bet.amount * bet.odds - bet.amount;
    }
    entry.winRate = entry.totalWinnings / entry.totalBets;

    this.leaderboard.set(user.id, entry);
  }

  public getTopBettors(limit: number = 10): LeaderboardEntry[] {
    return Array.from(this.leaderboard.values())
      .sort((a, b) => b.totalWinnings - a.totalWinnings)
      .slice(0, limit);
  }
}