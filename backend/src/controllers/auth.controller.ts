import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import type { LoginInput } from '../validators/auth.validator';

/** POST /api/auth/login */
export async function login(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await authService.login(req.body as LoginInput);
    res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
}

/** GET /api/auth/me */
export async function me(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // req.user is guaranteed by the authenticate middleware
    const user = await authService.getMe(req.user!.id);
    res.status(200).json({ data: user });
  } catch (err) {
    next(err);
  }
}
