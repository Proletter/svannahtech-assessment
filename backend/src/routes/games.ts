import { Router } from 'express';
import { GameController } from '../controllers/gameController';
import { auth } from '../middleware/auth';

export const gameRoutes = (gameController: GameController) => {
  const router = Router();

  router.get('/', gameController.getAllGames);
  router.get('/:gameId', gameController.getGame);

  return router;
};