import { EventEmitter } from 'events';
import { Game as GameModel } from '../models/database/Game';
import { GameEvent as GameEventModel } from '../models/database/GameEvent';
import { generateLiveUpdate } from '../models';

interface GameUpdate {
  gameId: string;
  timeElapsed: number;
  eventType?: string;
  team?: 'home' | 'away';
  scorer?: string;
}

export class GameService extends EventEmitter {
  private updateInterval: NodeJS.Timeout | null = null;

  constructor(initialGames: any[]) {
    super();
    this.initializeGames(initialGames);
    this.startUpdates();
  }

  private async initializeGames(initialGames: any[]) {
    try {
      await GameModel.destroy({ 
        where: {},
        truncate: true,
        cascade: true
      });

      for (const gameData of initialGames) {
        try {
          const game = await GameModel.create({
            gameId: gameData.gameId,
            homeTeam: gameData.homeTeam,
            awayTeam: gameData.awayTeam,
            homeScore: gameData.homeScore,
            awayScore: gameData.awayScore,
            timeElapsed: gameData.timeElapsed
          });

          if (gameData.events && gameData.events.length > 0) {
            for (const event of gameData.events) {
              await GameEventModel.create({
                gameId: game.id, // Use the auto-generated id
                type: event.type,
                team: event.team,
                player: event.player,
                minute: event.minute
              });
            }
          }
        } catch (error) {
          console.error('Error creating game:', error);
        }
      }
      console.log('Games initialized successfully');
    } catch (error) {
      console.error('Error initializing games:', error);
    }
  }

  private async startUpdates() {
    this.updateInterval = setInterval(async () => {
      try {
        const games = await GameModel.findAll();
        if (games.length === 0) return;

        const randomGame = games[Math.floor(Math.random() * games.length)];
        const update = generateLiveUpdate(randomGame.gameId);
        
        if (update) {
          await this.processUpdate(update);
        }
      } catch (error) {
        console.error('Error generating update:', error);
      }
    }, 5000);
  }

  private async processUpdate(update: GameUpdate) {
    try {
      const game = await GameModel.findOne({
        where: { gameId: update.gameId },
        include: ['events']
      });

      if (!game) return;

      // Update game state
      await game.update({
        timeElapsed: update.timeElapsed
      });

      if (update.eventType === 'goal') {
        // Update score
        await game.update({
          homeScore: update.team === 'home' ? game.homeScore + 1 : game.homeScore,
          awayScore: update.team === 'away' ? game.awayScore + 1 : game.awayScore
        });

        // Add new event
        await GameEventModel.create({
          gameId: game.id, // Use the auto-generated id
          type: update.eventType,
          team: update.team,
          player: update.scorer || 'Unknown Player',
          minute: Math.floor(update.timeElapsed)
        });
      }

      await game.reload({ include: ['events'] });
      this.emit('gameUpdate', {
        type: 'gameUpdate',
        gameId: game.gameId,
        update: {
          ...update,
          currentState: {
            homeScore: game.homeScore,
            awayScore: game.awayScore,
            timeElapsed: game.timeElapsed,
            events: game.events
          }
        }
      });

    } catch (error) {
      console.error('Error processing update:', error);
    }
  }

  public async getAllGames() {
    try {
      return await GameModel.findAll({
        include: ['events']
      });
    } catch (error) {
      console.error('Error fetching games:', error);
      return [];
    }
  }

  public cleanup() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }
}