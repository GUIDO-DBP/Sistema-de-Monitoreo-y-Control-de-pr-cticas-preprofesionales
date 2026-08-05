import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { env } from '../config/env';
import { AppError } from '../middlewares/error.middleware';
import type { LoginInput } from '../validators/auth.validator';
import { Rol } from '@prisma/client';

interface TokenPayload {
  sub: string;
  email: string;
  rol: Rol;
}

interface AuthResult {
  token: string;
  user: {
    id: string;
    nombre: string;
    email: string;
    rol: Rol;
    estudiante: { id: string; codigo: string; escuela: string } | null;
    tutor: { id: string; empresaId: string } | null;
  };
}

function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

export async function login(input: LoginInput): Promise<AuthResult> {
  const targetEmail = input.email || input.correo;
  const user = await prisma.usuario.findUnique({
    where: { email: targetEmail },
    include: {
      estudiante: {
        select: {
          id: true,
          codigo: true,
          escuela: true,
          ciclo: true,
          telefono: true,
          postulaciones: {
            include: {
              empresa: { select: { nombre: true } },
              tutor: { include: { usuario: { select: { nombre: true } } } },
              responsable: { select: { nombre: true } },
            },
            take: 1,
          },
        },
      },
      tutorEmpresarial: {
        select: {
          id: true,
          cargo: true,
          empresa: { select: { nombre: true } },
          _count: { select: { postulaciones: true } },
        },
      },
    },
  });

  if (!user) {
    throw new AppError(401, 'Credenciales incorrectas.', 'INVALID_CREDENTIALS');
  }

  if (!user.activo) {
    throw new AppError(403, 'Tu cuenta está desactivada. Contacta al administrador.', 'ACCOUNT_INACTIVE');
  }

  const passwordMatch = await bcrypt.compare(input.password, user.passwordHash);
  if (!passwordMatch) {
    throw new AppError(401, 'Credenciales incorrectas.', 'INVALID_CREDENTIALS');
  }

  const token = signToken({
    sub: user.id,
    email: user.email,
    rol: user.rol,
  });

  return {
    token,
    user: {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      activo: user.activo,
      createdAt: user.createdAt.toISOString(),
      estudiante: user.estudiante ? {
        id: user.estudiante.id,
        codigo: user.estudiante.codigo,
        escuela: user.estudiante.escuela,
        ciclo: user.estudiante.ciclo,
        telefono: user.estudiante.telefono || undefined,
        postulacion: user.estudiante.postulaciones[0] ? {
          empresa: user.estudiante.postulaciones[0].empresa?.nombre,
          area: user.estudiante.postulaciones[0].area,
          tutor: user.estudiante.postulaciones[0].tutor?.usuario?.nombre,
          coordinador: user.estudiante.postulaciones[0].responsable?.nombre,
        } : undefined,
      } : null,
      tutor: user.tutorEmpresarial ? {
        id: user.tutorEmpresarial.id,
        cargo: user.tutorEmpresarial.cargo || undefined,
        empresa: user.tutorEmpresarial.empresa?.nombre,
        estudiantesAsignados: user.tutorEmpresarial._count.postulaciones,
      } : null,
    } as any,
  };
}

export async function getMe(userId: string): Promise<any> {
  const user = await prisma.usuario.findUnique({
    where: { id: userId },
    include: {
      estudiante: {
        select: {
          id: true,
          codigo: true,
          escuela: true,
          ciclo: true,
          telefono: true,
          postulaciones: {
            include: {
              empresa: { select: { nombre: true } },
              tutor: { include: { usuario: { select: { nombre: true } } } },
              responsable: { select: { nombre: true } },
            },
            take: 1,
          },
        },
      },
      tutorEmpresarial: {
        select: {
          id: true,
          cargo: true,
          empresa: { select: { nombre: true } },
          _count: { select: { postulaciones: true } },
        },
      },
    },
  });

  if (!user || !user.activo) {
    throw new AppError(404, 'Usuario no encontrado.', 'NOT_FOUND');
  }

  return {
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    rol: user.rol,
    activo: user.activo,
    createdAt: user.createdAt.toISOString(),
    estudiante: user.estudiante ? {
      id: user.estudiante.id,
      codigo: user.estudiante.codigo,
      escuela: user.estudiante.escuela,
      ciclo: user.estudiante.ciclo,
      telefono: user.estudiante.telefono || undefined,
      postulacion: user.estudiante.postulaciones[0] ? {
        empresa: user.estudiante.postulaciones[0].empresa?.nombre,
        area: user.estudiante.postulaciones[0].area,
        tutor: user.estudiante.postulaciones[0].tutor?.usuario?.nombre,
        coordinador: user.estudiante.postulaciones[0].responsable?.nombre,
      } : undefined,
    } : null,
    tutor: user.tutorEmpresarial ? {
      id: user.tutorEmpresarial.id,
      cargo: user.tutorEmpresarial.cargo || undefined,
      empresa: user.tutorEmpresarial.empresa?.nombre,
      estudiantesAsignados: user.tutorEmpresarial._count.postulaciones,
    } : null,
  };
}

