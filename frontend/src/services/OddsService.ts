export interface GameOdds {
    gameId: string;
    homeOdds: number;
    awayOdds: number;
    timestamp: number;
  }
  
  class OddsService {
    private odds: Map<string, GameOdds> = new Map();
    private listeners: Set<(odds: GameOdds) => void> = new Set();
  
    updateOdds(gameId: string, homeOdds: number, awayOdds: number) {
      const newOdds: GameOdds = {
        gameId,
        homeOdds,
        awayOdds,
        timestamp: Date.now()
      };
      
      this.odds.set(gameId, newOdds);
      this.notifyListeners(newOdds);
    }
  
    getOdds(gameId: string): GameOdds | undefined {
      return this.odds.get(gameId);
    }
  
    subscribeToOdds(callback: (odds: GameOdds) => void): () => void {
      this.listeners.add(callback);
      return () => this.listeners.delete(callback);
    }
  
    private notifyListeners(odds: GameOdds) {
      this.listeners.forEach(listener => listener(odds));
    }
  }
  
  export const oddsService = new OddsService();