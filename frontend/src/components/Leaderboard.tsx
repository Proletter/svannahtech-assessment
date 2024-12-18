import React from 'react';
import { Trophy } from 'lucide-react';
import { LeaderboardEntry } from '../types';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

const Leaderboard = ({ entries }: LeaderboardProps) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-yellow-500" />
        <h3 className="text-lg font-semibold">Leaderboard</h3>
      </div>
      <div className="space-y-2">
        {entries.map((entry, index) => (
          <div key={entry.userId} className="flex justify-between items-center p-2 hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{index + 1}.</span>
              <span>{entry.username}</span>
            </div>
            <span className="text-green-600 font-medium">${entry.totalWinnings.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;