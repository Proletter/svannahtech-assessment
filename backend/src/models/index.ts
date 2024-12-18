// Sample data for testing the Real-time Sports Betting and Leaderboard System

// Sample live game data
const liveGameData = [
    {
      gameId: "G1",
      homeTeam: "Team A",
      awayTeam: "Team B",
      homeScore: 2,
      awayScore: 1,
      timeElapsed: 65, // minutes
      events: [
        { type: "goal", team: "home", player: "Player 1", minute: 23 },
        { type: "goal", team: "away", player: "Player 5", minute: 41 },
        { type: "goal", team: "home", player: "Player 2", minute: 62 }
      ]
    },
    {
      gameId: "G2",
      homeTeam: "Team C",
      awayTeam: "Team D",
      homeScore: 0,
      awayScore: 0,
      timeElapsed: 30, // minutes
      events: [
        { type: "yellowCard", team: "away", player: "Player 8", minute: 17 }
      ]
    }
  ];
  
  // Sample user data
  const users = [
    { id: "U1", username: "JohnDoe", balance: 1000 },
    { id: "U2", username: "JaneSmith", balance: 1500 },
    { id: "U3", username: "MikeJohnson", balance: 800 }
  ];
  
  // Sample bet data
  const bets = [
    { id: "B1", userId: "U1", gameId: "G1", betType: "winner", pick: "home", amount: 50, odds: 1.8 },
    { id: "B2", userId: "U2", gameId: "G1", betType: "scoreExact", pick: "2-1", amount: 20, odds: 6.5 },
    { id: "B3", userId: "U3", gameId: "G2", betType: "winner", pick: "away", amount: 30, odds: 2.1 }
  ];
  
  // Function to simulate live game updates
  function generateLiveUpdate(gameId: string): any {
    const game = liveGameData.find(g => g.gameId === gameId);
    if (!game) return null;
  
    const eventTypes = ["goal", "yellowCard", "redCard", "substitution"];
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const team = Math.random() > 0.5 ? "home" : "away";
  
    let update: any = {
      gameId,
      timeElapsed: game.timeElapsed + Math.floor(Math.random() * 5),
      eventType,
      team
    };
  
    if (eventType === "goal") {
      update.scorer = `Player ${Math.floor(Math.random() * 11) + 1}`;
      if (team === "home") game.homeScore++;
      else game.awayScore++;
      update.newScore = `${game.homeScore}-${game.awayScore}`;
    }
  
    return update;
  }
  
  // Function to simulate bet placement
  function simulateBetPlacement(userId: string, gameId: string, betType: string, pick: string, amount: number): any {
    const user = users.find(u => u.id === userId);
    if (!user || user.balance < amount) return null;
  
    const betId = `B${bets.length + 1}`;
    const odds = 1 + Math.random() * 4; // Generate random odds between 1.00 and 5.00
  
    const newBet = {
      id: betId,
      userId,
      gameId,
      betType,
      pick,
      amount,
      odds: Number(odds.toFixed(2))
    };
  
    bets.push(newBet);
    user.balance -= amount;
  
    return newBet;
  }
  
  // Example usage:
  console.log("Live game update:", generateLiveUpdate("G1"));
  console.log("New bet placed:", simulateBetPlacement("U1", "G2", "winner", "home", 25));
  
  // Export the data and functions for use in the main application
  export {
    liveGameData,
    users,
    bets,
    generateLiveUpdate,
    simulateBetPlacement
  };
  