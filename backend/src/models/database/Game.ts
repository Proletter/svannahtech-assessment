import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { GameEvent } from './GameEvent';
import { Bet } from './Bet';

@Table({
  tableName: 'Games'
})
export class Game extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  gameId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  homeTeam!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  awayTeam!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0
  })
  homeScore!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0
  })
  awayScore!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0
  })
  timeElapsed!: number;

  @HasMany(() => GameEvent)
  events!: GameEvent[];

  @HasMany(() => Bet)
  bets!: Bet[];
}