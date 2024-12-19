import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { auth } from '../middleware/auth';

const router = Router();
const authController = new AuthController();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', auth, authController.getMe);

export { router as authRoutes };