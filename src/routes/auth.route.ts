import { Router } from 'express';
import { register, login, profile } from '../controllers/auth.controller';
import { authenticate } from "../middlewares/auth.middleware"

const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login)
authRouter.get('/profile', authenticate, profile)

export { authRouter } 