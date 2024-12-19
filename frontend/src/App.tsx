import React, { useState, useEffect, useRef } from 'react';
import { Bell, DollarSign } from 'lucide-react';
import LiveGames from './components/LiveGames.tsx';
import BettingSlip from './components/BettingSlip.tsx';
import Leaderboard from './components/Leaderboard.tsx';
import AuthModal from './components/AuthModal.tsx';
import { useAuth } from './contexts/AuthContext.tsx';

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

function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [leaders] = useState<LeaderboardEntry[]>([]);
  const [wsConnected, setWsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const wsRef = useRef<WebSocket | null>(null);
  const mountedRef = useRef(true);
  const { isAuthenticated, user, logout } = useAuth();

  // Fetch initial game data
  useEffect(() => {
    async function fetchGames() {
      try {
        setIsLoading(true);
        setError(null);
        console.log('Fetching games from:', `${process.env.REACT_APP_API_URL}/api/games`);
        
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/games`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Received games data:', data);
        
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received');
        }
  
        setGames(data);
      } catch (err) {
        const error = err as Error;
        console.error('Error fetching games:', error);
        setError('Failed to load games. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
  
    fetchGames();
  }, []);

  useEffect(() => {
    function connectWebSocket() {
      if (!wsRef.current) {
        console.log('Establishing WebSocket connection...');
        // Properly format the WebSocket URL
        const wsUrl = new URL('/ws', process.env.REACT_APP_WS_URL || 'ws://localhost:3000');
        const ws = new WebSocket(wsUrl.toString());
  
        ws.onopen = () => {
          console.log('WebSocket connection established');
          setWsConnected(true);
        };
  
        ws.onmessage = (event) => {
          if (!mountedRef.current) return;
  
          try {
            const data = JSON.parse(event.data);
            console.log('Received WebSocket message:', data);
  
            if (data.type === 'initialState' && Array.isArray(data.games)) {
              console.log('Setting initial games state:', data.games);
              setGames(data.games);
            } else if (data.type === 'gameUpdate') {
              console.log('Processing game update:', data);
              setGames(prevGames => {
                return prevGames.map(game => {
                  if (game.gameId === data.gameId) {
                    // Create updated game object
                    const updatedGame = {
                      ...game,
                      timeElapsed: data.update.timeElapsed,
                      homeScore: data.update.currentState?.homeScore ?? game.homeScore,
                      awayScore: data.update.currentState?.awayScore ?? game.awayScore,
                      events: data.update.currentState?.events ?? game.events,
                    };
  
                    // If this is the selected game, update it too
                    if (selectedGame?.gameId === game.gameId) {
                      setSelectedGame(updatedGame);
                    }
  
                    console.log(`Game ${game.gameId} updated:`, updatedGame);
                    return updatedGame;
                  }
                  return game;
                });
              });
            }
          } catch (error) {
            console.error('Error processing WebSocket message:', error);
          }
        };
  
        ws.onclose = (event) => {
          console.log('WebSocket connection closed:', event.reason);
          setWsConnected(false);
          wsRef.current = null;
  
          // Attempt to reconnect after 3 seconds if the component is still mounted
          if (mountedRef.current) {
            console.log('Attempting to reconnect in 3 seconds...');
            setTimeout(connectWebSocket, 3000);
          }
        };
  
        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setWsConnected(false);
        };
  
        wsRef.current = ws;
      }
    }
  
    // Only connect WebSocket if we're not loading and have games
    if (!isLoading) {
      connectWebSocket();
    }
  
    // Cleanup function
    return () => {
      console.log('Cleaning up WebSocket connection...');
      mountedRef.current = false;
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [isLoading, selectedGame?.gameId]);
  const handlePlaceBet = async (betData: { gameId: string; pick: string; amount: number }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/bets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(betData),
      });

      if (!response.ok) {
        throw new Error('Failed to place bet');
      }

      const result = await response.json();
      console.log('Bet placed successfully:', result);
    } catch (error) {
      console.error('Error placing bet:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 text-gray-900">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Sports Betting</h1>
            <span 
              className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-500' : 'bg-red-500'}`} 
              title={wsConnected ? 'Connected' : 'Disconnected'}
            />
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600">
                  Balance: ${user?.balance.toFixed(2)}
                </span>
                <button 
                  onClick={logout}
                  className="text-red-600 hover:text-red-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Login
              </button>
            )}
            <button className="p-2 hover:bg-gray-200 rounded-full">
              <Bell className="w-5 h-5" />
            </button>
            <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
              <DollarSign className="w-4 h-4" />
              <span>Deposit</span>
            </button>
          </div>
        </header>
        
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
            {error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading games...</div>
            ) : games.length > 0 ? (
              <LiveGames games={games} onSelectGame={setSelectedGame} />
            ) : (
              <div className="text-center py-8 text-gray-500">
                No live games available at the moment
              </div>
            )}
          </div>
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow">
              <BettingSlip game={selectedGame} onPlaceBet={handlePlaceBet} />
            </div>
            <div className="bg-white rounded-lg shadow">
              <Leaderboard entries={leaders} />
            </div>
          </div>
        </div>

        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </div>
    </div>
  );
}

export default App;