import React from 'react';
import { Trophy } from 'lucide-react';

interface LeaderboardEntry {
  userId: string;
  username: string;
  totalWinnings: number;
  totalBets: number;
  winRate: number;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ entries }) => {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-yellow-500" />
        <h3 className="text-lg font-semibold">Leaderboard</h3>
      </div>
      {entries.length > 0 ? (
        <div className="space-y-2">
          {entries.map((entry, index) => (
            <div key={entry.userId} className="flex justify-between items-center p-2 hover:bg-gray-50">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{index + 1}.</span>
                <span>{entry.username}</span>
              </div>
              <span className="text-green-600 font-medium">
                ${entry.totalWinnings.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">No entries yet</div>
      )}
    </div>
  );
};

export default Leaderboard;