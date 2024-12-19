import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class UserController {
  public register = async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body;
      const passwordHash = await bcrypt.hash(password, 10);
      // Add user to database TODO
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(400).json({ error: 'Registration failed' });
    }
  };

  public login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      // Verify user and password TODO
      const token = jwt.sign({ userId: 'user_id' }, process.env.JWT_SECRET || 'secret');
      res.json({ token });
    } catch (error) {
      res.status(401).json({ error: 'Authentication failed' });
    }
  };
}