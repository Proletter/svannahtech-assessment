import { Bet, User, Game } from '../models/database';
import { withTransaction } from '../config/database';

export class BettingService {
  async placeBet(userId: number, betData: any) {
    return withTransaction(async (transaction) => {
      const user = await User.findByPk(userId, { transaction });
      if (!user || user.balance < betData.amount) {
        throw new Error('Insufficient balance');
      }

      const bet = await Bet.create({
        userId,
        gameId: betData.gameId,
        betType: betData.betType,
        pick: betData.pick,
        amount: betData.amount,
        odds: betData.odds,
        status: 'pending'
      }, { transaction });
      await user.update({
        balance: user.balance - betData.amount
      }, { transaction });

      return bet;
    });
  }

  async settleBet(betId: number) {
    return withTransaction(async (transaction) => {
      const bet = await Bet.findByPk(betId, {
        include: [User, Game],
        transaction
      });

      if (!bet || bet.status !== 'pending') {
        throw new Error('Invalid bet');
      }

      const won = this.determineBetOutcome(bet);

      await bet.update({
        status: won ? 'won' : 'lost'
      }, { transaction });

      if (won) {
        await bet.user.update({
          balance: bet.user.balance + (bet.amount * bet.odds)
        }, { transaction });
      }

      return bet;
    });
  }

  private determineBetOutcome(bet: Bet): boolean {
    const game = bet.game;
    if (bet.betType === 'winner') {
      if (bet.pick === 'home') {
        return game.homeScore > game.awayScore;
      } else {
        return game.awayScore > game.homeScore;
      }
    }
    return false;
  }
}