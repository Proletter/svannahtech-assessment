import React from 'react';

interface Game {
  gameId: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  timeElapsed: number;
  events: Array<{
    type: string;
    team: string;
    player: string;
    minute: number;
  }>;
}

interface LiveGamesProps {
  games: Game[];
  onSelectGame: (game: Game) => void;
}

const LiveGames: React.FC<LiveGamesProps> = ({ games, onSelectGame }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Live Games</h2>
      <div className="grid gap-4 md:grid-cols-2">
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
            {game.events[game.events.length - 1]?.type === 'goal' && (
              <div className="mt-2 text-sm text-green-600">
                GOAL! {game.events[game.events.length - 1].player} ({game.events[game.events.length - 1].minute}')
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveGames;