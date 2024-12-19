import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './User';
import { Game } from './Game';

@Table({
  tableName: 'Bets'
})
export class Bet extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  })
  id!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  userId!: number;

  @ForeignKey(() => Game)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  gameId!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  betType!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  pick!: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false
  })
  amount!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false
  })
  odds!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'pending'
  })
  status!: 'pending' | 'won' | 'lost';

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Game)
  game!: Game;
}