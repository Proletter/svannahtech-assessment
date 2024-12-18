// frontend/src/App.tsx
import React, { useState, useEffect } from 'react';
import { Bell,  DollarSign } from 'lucide-react';
import LiveGames from './components/LiveGames.tsx';
import BettingSlip from './components/BettingSlip.tsx';
import Leaderboard from './components/Leaderboard.tsx';

// Define our main data interfaces
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

interface LeaderboardEntry {
  userId: string;
  username: string;
  totalWinnings: number;
  totalBets: number;
  winRate: number;
}

// Our main App component
function App() {
  // State management for our application
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);

  // Effect to establish WebSocket connection
  useEffect(() => {
    // Create WebSocket connection to our backend
    const ws = new WebSocket('ws://localhost:3000');

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    // Handle incoming WebSocket messages
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'initialState':
          setGames(data.games);
          break;
        case 'gameUpdate':
          // Update the specific game that changed
          setGames(prevGames => 
            prevGames.map(game => 
              game.gameId === data.update.gameId 
                ? { ...game, ...data.update }
                : game
            )
          );
          break;
        case 'leaderboardUpdate':
          setLeaders(data.leaderboard);
          break;
      }
    };

    // Cleanup WebSocket connection on component unmount
    return () => {
      ws.close();
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // Handler for placing bets
  const handlePlaceBet = async (betData: any) => {
    try {
      const response = await fetch('http://localhost:3000/api/bets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(betData),
      });

      if (!response.ok) {
        throw new Error('Failed to place bet');
      }

      const result = await response.json();
      console.log('Bet placed successfully:', result);
      
      // You might want to show a success message to the user here
    } catch (error) {
      console.error('Error placing bet:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header section */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Sports Betting</h1>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-200 rounded-full">
              <Bell className="w-5 h-5" />
            </button>
            <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
              <DollarSign className="w-4 h-4" />
              <span>Deposit</span>
            </button>
          </div>
        </header>
        
        {/* Main content grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Live games section */}
          <div className="lg:col-span-2">
            <LiveGames 
              games={games} 
              onSelectGame={setSelectedGame} 
            />
          </div>
          
          {/* Betting slip and leaderboard section */}
          <div className="space-y-8">
            <BettingSlip 
              game={selectedGame} 
              onPlaceBet={handlePlaceBet} 
            />
            <Leaderboard entries={leaders} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
