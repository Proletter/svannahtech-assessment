import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import { initializeDatabase } from './config/database';
import { GameService } from './services/GameService';
import { liveGameData } from './models';
import { Game as GameModel } from './models/database/Game';
import { authRoutes } from './routes/auth';

const app = express();
const server = createServer(app);
app.use(cors({
  origin: 'http://localhost:3002', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
const wss = new WebSocketServer({ 
  server,
  path: '/ws',  
  verifyClient: (info, callback) => {
    const origin = info.origin;
    const allowed = origin === 'http://localhost:3002';
    callback(allowed);
  }
});

const gameService = new GameService(liveGameData);

app.use(express.json());
app.use('/api/auth', authRoutes);
app.get('/api/test-db', async (req, res) => {
  try {
    const User = require('./models/database/User').User;
    const testUser = await User.create({
      username: 'testuser',
      email: 'test@test.com',
      passwordHash: 'test',
      balance: 1000
    });
    res.json({ message: 'Database working', user: testUser });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message || 'An unknown error occurred' });
  }
});


app.get('/api/games', async (req, res) => {
  try {
    let games = await GameModel.findAll({
      include: ['events']
    });

    if (games.length === 0) {
      console.log('No games found in database, initializing with sample data...');
      games = await GameModel.bulkCreate(liveGameData.map(game => ({
        ...game,
        events: game.events
      })), {
        include: ['events']
      });
    }

    res.json(games);
  } catch (err) {
    const error = err as Error;
    console.error('Error fetching games:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch games' });
  }
});

wss.on('connection', (ws) => {
  console.log('Client connected');

  gameService.getAllGames().then(games => {
    ws.send(JSON.stringify({
      type: 'initialState',
      games
    }));
  });

  const updateHandler = (update: any) => {
    console.log('Sending update to client:', update);
    ws.send(JSON.stringify(update));
  };

  gameService.on('gameUpdate', updateHandler);

  ws.on('close', () => {
    console.log('Client disconnected');
    gameService.off('gameUpdate', updateHandler);
  });
});

async function startServer() {
  try {
    console.log('Initializing database...');
    const dbInitialized = await initializeDatabase();
    if (!dbInitialized) {
      throw new Error('Failed to initialize database');
    }
    console.log('Database initialized successfully');

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    const error = err as Error;
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();

export { app, server };


