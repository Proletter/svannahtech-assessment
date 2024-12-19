import { sequelize } from '../models/database';

export async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized successfully.');

    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
}

export async function withTransaction<T>(
  callback: (transaction: any) => Promise<T>
): Promise<T> {
  const transaction = await sequelize.transaction();
  try {
    const result = await callback(transaction);
    await transaction.commit();
    return result;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}