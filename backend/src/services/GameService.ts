// backend/src/services/GameService.ts
import { EventEmitter } from 'events';
import { LiveGame, GameUpdate } from '../types';
import { generateLiveUpdate } from '../models';

export class GameService extends EventEmitter {
  private games: Map<string, LiveGame>;
  private updateInterval: NodeJS.Timeout | null = null;

  constructor(initialGames: LiveGame[]) {
    super();
    this.games = new Map(initialGames.map(game => [game.gameId, game]));
    
    // Start periodic updates
    this.startUpdates();
  }

  private startUpdates() {
    // Generate updates every 10 seconds
    this.updateInterval = setInterval(() => {
      // Randomly select a game to update
      const gameIds = Array.from(this.games.keys());
      const randomGameId = gameIds[Math.floor(Math.random() * gameIds.length)];
      
      // Generate and process update
      const update = generateLiveUpdate(randomGameId);
      if (update) {
        this.processUpdate(update);
      }
    }, 10000);
  }

  private processUpdate(update: GameUpdate) {
    const game = this.games.get(update.gameId);
    if (!game) return;

    // Update game state
    game.timeElapsed = update.timeElapsed;
    
    if (update.eventType === 'goal') {
      // Add event to the game's events array
      game.events.push({
        type: update.eventType,
        team: update.team,
        player: update.scorer || 'Unknown Player',
        minute: Math.floor(update.timeElapsed)
      });

      // Update score
      if (update.team === 'home') {
        game.homeScore++;
      } else {
        game.awayScore++;
      }
    }

    // Emit update event
    this.emit('gameUpdate', update);
  }

  public getGame(gameId: string): LiveGame | undefined {
    return this.games.get(gameId);
  }

  public getAllGames(): LiveGame[] {
    return Array.from(this.games.values());
  }

  public cleanup() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }
}