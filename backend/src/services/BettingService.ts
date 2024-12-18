import { Bet, User } from '../types';
import { EventEmitter } from 'events';

export class BettingService extends EventEmitter {
  private bets: Map<string, Bet>;
  private users: Map<string, User>;

  constructor(initialUsers: User[]) {
    super();
    this.bets = new Map();
    this.users = new Map(initialUsers.map(user => [user.id, user]));
  }

  public placeBet(bet: Omit<Bet, 'id' | 'status' | 'createdAt'>): Bet | null {
    const user = this.users.get(bet.userId);
    if (!user || user.balance < bet.amount) return null;

    const newBet: Bet = {
      ...bet,
      id: `B${this.bets.size + 1}`,
      status: 'pending',
      createdAt: new Date()
    };

    this.bets.set(newBet.id, newBet);
    user.balance -= bet.amount;
    this.emit('betPlaced', newBet);

    return newBet;
  }

  public settleBet(betId: string, outcome: 'won' | 'lost'): void {
    const bet = this.bets.get(betId);
    if (!bet || bet.status !== 'pending') return;

    bet.status = outcome;
    const user = this.users.get(bet.userId);
    if (!user) return;

    if (outcome === 'won') {
      user.balance += bet.amount * bet.odds;
    }

    this.emit('betSettled', { bet, user });
  }

  public getUserBets(userId: string): Bet[] {
    return Array.from(this.bets.values())
      .filter(bet => bet.userId === userId);
  }
}