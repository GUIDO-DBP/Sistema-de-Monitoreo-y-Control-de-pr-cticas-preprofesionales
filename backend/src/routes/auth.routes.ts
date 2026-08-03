import { Router } from 'express';
import { login, me } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { loginSchema } from '../validators/auth.validator';

const router = Router();

/** POST /api/auth/login — Public */
router.post('/login', validate(loginSchema), login);

/** GET /api/auth/me — Requires valid JWT */
router.get('/me', authenticate, me);

export default router;
