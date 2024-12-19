import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';

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

interface BettingSlipProps {
  game: Game | null;
  onPlaceBet: (betData: any) => void;
}

const BettingSlip: React.FC<BettingSlipProps> = ({ game, onPlaceBet }) => {
  const [amount, setAmount] = useState<string>('');
  const [pick, setPick] = useState<'home' | 'away'>('home');
  const { isAuthenticated, user } = useAuth();

  if (!game) {
    return (
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-400">Select a game to place a bet</h3>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    onPlaceBet({
      gameId: game.gameId,
      amount: Number(amount),
      pick,
      userId: user?.id
    });
    setAmount('');
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Place Bet</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Pick Winner</label>
          <select 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={pick}
            onChange={(e) => setPick(e.target.value as 'home' | 'away')}
          >
            <option value="home">{game.homeTeam}</option>
            <option value="away">{game.awayTeam}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            required
          />
        </div>
        {isAuthenticated ? (
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Place Bet
          </button>
        ) : (
          <div className="text-center text-red-500">
            Please log in to place bets
          </div>
        )}
      </form>
    </div>
  );
};

export default BettingSlip;