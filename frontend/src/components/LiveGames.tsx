import React from 'react';
import { Game } from '../types';

interface LiveGamesProps {
  games: Game[];
  onSelectGame: (game: Game) => void;
}

const LiveGames = ({ games, onSelectGame }: LiveGamesProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {games.map(game => (
        <div 
          key={game.gameId} 
          className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onSelectGame(game)}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">{game.timeElapsed}'</span>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">LIVE</span>
          </div>
          <div className="text-center space-y-2">
            <div className="font-semibold">{game.homeTeam}</div>
            <div className="text-2xl font-bold">{game.homeScore} - {game.awayScore}</div>
            <div className="font-semibold">{game.awayTeam}</div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {game.events.slice(-1)[0]?.type === 'goal' && (
              <div className="text-green-600">
                GOAL! {game.events.slice(-1)[0]?.player} ({game.events.slice(-1)[0]?.minute}')
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
