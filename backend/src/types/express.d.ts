import { Rol } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      /** Authenticated user attached by the auth middleware */
      user?: {
        id: string;
        email: string;
        nombre: string;
        rol: Rol;
      };
    }
  }
}

export {};
