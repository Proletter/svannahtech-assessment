import { Request, Response } from 'express';
import { GameService } from '../services/GameService';

export class GameController {
  constructor(private gameService: GameService) {}

  public getAllGames = (req: Request, res: Response) => {
    const games = this.gameService.getAllGames();
    res.json(games);
  };

  public getGame = (req: Request, res: Response) => {
    const game = this.gameService.getGame(req.params.gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.json(game);
  };
}
