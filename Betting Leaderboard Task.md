# Real-time Sports Betting and Leaderboard System

## Objective
Develop a real-time sports betting and leaderboard system that can handle high-volume data processing for live games. The system should allow users to place bets, update odds in real-time, and maintain a live leaderboard of top bettors.

## Requirements

### 1. Backend Setup
- Set up a Node.js/Express application using TypeScript.
- Implement a WebSocket server for real-time communications.

### 2. Data Processing
- Create an efficient system to process large payloads of incoming live game data.
- Implement a mechanism to update betting odds in real-time based on the incoming data.

### 3. Betting System
- Design and implement RESTful APIs for user registration and authentication.
- Create endpoints for placing bets and retrieving bet history.
- Implement a simple odds calculation system that updates based on betting patterns and incoming game data.

### 4. Real-time Leaderboard
- Develop a real-time leaderboard system that ranks users based on their betting performance.
- The leaderboard should update instantly when bets are settled.

### 5. Performance Optimization
- Implement caching strategies to optimize data retrieval for frequently accessed data (e.g., leaderboard, current odds).
- Design the system to handle concurrent connections and high-frequency updates efficiently.

### 6. Data Persistence
- Use a database of your choice (e.g., PostgreSQL, MongoDB) to store user data, bets, and game information.
- Implement database transactions to ensure data integrity when processing bets and updating user balances.

### 7. Testing
- Write unit tests for critical components of the system.
- Implement integration tests for the main workflows.

### 8. Documentation
- Provide API documentation for the endpoints created.
- Include setup instructions and any necessary environment configurations.

## Bonus Challenges (if time permits)
- Implement a simple simulation to generate mock live game data and test the system's real-time capabilities.
- Add a feature to detect and prevent potential betting fraud or unusual betting patterns.

## Evaluation Criteria
- Code quality, organization, and adherence to TypeScript best practices
- Scalability and performance of the data processing system
- Effectiveness of the real-time updates for odds and leaderboard
- API design and documentation
- Error handling and edge case management
- Testing coverage and quality

## Time Limit
4 hours

Good luck!
