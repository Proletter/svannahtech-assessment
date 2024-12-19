import { Sequelize } from 'sequelize-typescript';
import { User } from './User';
import { Game } from './Game';
import { Bet } from './Bet';
import { GameEvent } from './GameEvent';

const sequelize = new Sequelize({
  database: 'sports_betting',
  username: 'postgres',
  password: 'Oluwaseun1@', 
  host: 'localhost',
  dialect: 'postgres',
  logging: false
});

sequelize.addModels([User, Game, Bet, GameEvent]);


export {
  sequelize,
  User,
  Game,
  Bet,
  GameEvent
};


export async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    await sequelize.sync({ force: true });
    console.log('Database models synchronized successfully.');
    
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
}