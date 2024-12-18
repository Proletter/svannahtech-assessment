import { Router } from 'express';
import { BetController } from '../controllers/betController';
import { auth } from '../middleware/auth';

export const betRoutes = (betController: BetController) => {
  const router = Router();

  router.post('/', auth, betController.placeBet);
  router.get('/user/:userId', auth, betController.getUserBets);

  return router;
};