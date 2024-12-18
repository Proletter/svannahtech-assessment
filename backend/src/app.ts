import express from 'express';
import cors from 'cors';
import { gameRoutes } from './routes/games';
import { betRoutes } from './routes/bets';
import { userRoutes } from './routes/users';
import { errorHandler } from './middleware/errorHandler';
import { GameController } from './controllers/gameController';
import { BetController } from './controllers/betController';
import { GameService } from './services/GameService';
import { BettingService } from './services/BettingService';
import { liveGameData, users } from './models';

const app = express();

// Services
const gameService = new GameService(liveGameData);
const bettingService = new BettingService(users);

// Controllers
const gameController = new GameController(gameService);
const betController = new BetController(bettingService);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/games', gameRoutes(gameController));
app.use('/api/bets', betRoutes(betController));
app.use('/api/users', userRoutes);

// Error handling
app.use(errorHandler);

export { app, gameService, bettingService };