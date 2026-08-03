import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

/** Custom application error with HTTP status code */
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'AppError';
    // Maintains proper stack trace in V8
    Error.captureStackTrace(this, this.constructor);
  }
}

/** Type guard for Prisma known errors */
function isPrismaKnownError(
  err: unknown,
): err is Prisma.PrismaClientKnownRequestError {
  return (
    err instanceof Error &&
    err.name === 'PrismaClientKnownRequestError'
  );
}

/** Global error handling middleware — must be registered last */
export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Custom application errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      ...(err.code && { code: err.code }),
    });
    return;
  }

  // Prisma-specific errors
  if (isPrismaKnownError(err)) {
    switch (err.code) {
      case 'P2002': {
        // Unique constraint violation
        const fields = (err.meta?.target as string[] | undefined)?.join(', ') ?? 'campo';
        res.status(409).json({
          error: `El valor del campo '${fields}' ya existe.`,
          code: 'UNIQUE_CONSTRAINT',
        });
        return;
      }
      case 'P2025':
        // Record not found
        res.status(404).json({
          error: 'Registro no encontrado.',
          code: 'NOT_FOUND',
        });
        return;
      case 'P2003':
        res.status(400).json({
          error: 'Referencia a registro inexistente.',
          code: 'FOREIGN_KEY',
        });
        return;
      default:
        console.error('[Prisma Error]', err.code, err.message);
    }
  }

  // Zod validation errors (should be caught by validate middleware, but just in case)
  if (err instanceof Error && err.name === 'ZodError') {
    res.status(400).json({ error: 'Datos de entrada inválidos.', code: 'VALIDATION' });
    return;
  }

  // Unknown errors
  if (err instanceof Error) {
    console.error('[Unhandled Error]', err.name, err.message, err.stack);
  } else {
    console.error('[Unknown Error]', err);
  }

  res.status(500).json({
    error: 'Error interno del servidor.',
    code: 'INTERNAL_ERROR',
  });
}
