// backend/src/server.ts
import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import { GameService } from './services/GameService';
import { liveGameData } from './models';  // Using the original export name

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Initialize GameService with the original liveGameData
const gameService = new GameService(liveGameData);

app.use(cors());
app.use(express.json());

// Routes
app.get('/api/games', (req, res) => {
  const games = gameService.getAllGames();
  res.json(games);
});

app.get('/api/games/:gameId', (req, res) => {
  const game = gameService.getGame(req.params.gameId);
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }
  res.json(game);
});

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('Client connected');
  
  // Send initial game state
  ws.send(JSON.stringify({
    type: 'initialState',
    games: gameService.getAllGames()
  }));

  // Subscribe to game updates
  gameService.on('gameUpdate', (update) => {
    ws.send(JSON.stringify({
      type: 'gameUpdate',
      update
    }));
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Cleanup on server shutdown
process.on('SIGTERM', () => {
  gameService.cleanup();
  server.close();
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});