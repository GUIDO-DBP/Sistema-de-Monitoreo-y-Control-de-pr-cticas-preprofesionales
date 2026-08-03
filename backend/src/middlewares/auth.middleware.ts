import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Rol } from '@prisma/client';
import { env } from '../config/env';
import { prisma } from '../config/prisma';
import { AppError } from './error.middleware';

interface JWTPayload {
  sub: string;
  email: string;
  rol: Rol;
  iat?: number;
  exp?: number;
}

/**
 * Verifies Bearer JWT token and attaches user to req.user.
 * Returns 401 if missing or invalid.
 */
export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new AppError(401, 'Token de autenticación requerido.', 'NO_TOKEN');
    }

    const token = header.slice(7);
    let payload: JWTPayload;

    try {
      payload = jwt.verify(token, env.JWT_SECRET) as JWTPayload;
    } catch {
      throw new AppError(401, 'Token inválido o expirado.', 'INVALID_TOKEN');
    }

    // Verify user still exists and is active
    const user = await prisma.usuario.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, nombre: true, rol: true, activo: true },
    });

    if (!user || !user.activo) {
      throw new AppError(401, 'Usuario no encontrado o inactivo.', 'USER_INACTIVE');
    }

    req.user = {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      rol: user.rol,
    };

    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Role-based access control middleware.
 * Must be used after authenticate.
 */
export function authorizeRoles(...roles: Rol[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError(401, 'No autenticado.', 'NO_AUTH'));
      return;
    }
    if (!roles.includes(req.user.rol)) {
      next(
        new AppError(
          403,
          'No tienes permisos para realizar esta acción.',
          'FORBIDDEN',
        ),
      );
      return;
    }
    next();
  };
}
