import { Request, Response } from 'express';
import { BettingService } from '../services/BettingService';

export class BetController {
  constructor(private bettingService: BettingService) {}

  public placeBet = (req: Request, res: Response) => {
    const bet = this.bettingService.placeBet(req.body);
    if (!bet) {
      return res.status(400).json({ error: 'Invalid bet' });
    }
    res.status(201).json(bet);
  };

  public getUserBets = (req: Request, res: Response) => {
    const bets = this.bettingService.getUserBets(req.params.userId);
    res.json(bets);
  };
}