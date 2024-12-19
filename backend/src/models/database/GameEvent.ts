import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Game } from './Game';

@Table({
  tableName: 'GameEvents'
})
export class GameEvent extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  })
  id!: number;

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
  type!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  team!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  player!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  minute!: number;

  @BelongsTo(() => Game)
  game!: Game;
}