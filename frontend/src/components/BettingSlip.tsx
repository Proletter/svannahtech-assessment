// frontend/src/components/BettingSlip.tsx
import React, { useState } from 'react';
import { Game } from '../types';

interface BettingSlipProps {
  game: Game | null;
  onPlaceBet: (bet: any) => void;
}

const BettingSlip: React.FC<BettingSlipProps> = ({ game, onPlaceBet }) => {
  const [amount, setAmount] = useState<string>('');
  const [pick, setPick] = useState<'home' | 'away'>('home');

  if (!game) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-400">Select a game to place a bet</h3>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPlaceBet({
      gameId: game.gameId,
      amount: Number(amount),
      pick,
      betType: 'winner',
      odds: pick === 'home' ? 1.8 : 2.0
    });
    setAmount('');
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
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
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Place Bet
        </button>
      </form>
    </div>
  );
};

export default BettingSlip;