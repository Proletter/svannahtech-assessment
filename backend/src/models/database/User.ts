import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Bet } from './Bet';

@Table({
  tableName: 'Users'
})
export class User extends Model {
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
  username!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  passwordHash!: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 1000.00
  })
  balance!: number;

  @HasMany(() => Bet)
  bets!: Bet[];
}