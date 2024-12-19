import { Request, Response } from 'express';
import { User } from '../models/database/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthController {
  public async register(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;
      const existingUser = await User.findOne({
        where: { username }
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Username already taken' });
      }
      const passwordHash = await bcrypt.hash(password, 10);

      const user = await User.create({
        username,
        passwordHash,
        balance: 1000, // Starting balance
      });

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'secret-key',
        { expiresIn: '24h' }
      );

      res.status(201).json({
        token,
        user: {
          id: user.id,
          username: user.username,
          balance: user.balance
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }

  public async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({
        where: { username }
      });

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(password, user.passwordHash);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          balance: user.balance
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }

  public async getMe(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        id: user.id,
        username: user.username,
        balance: user.balance
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: 'Failed to get user data' });
    }
  }
}