import { z } from 'zod';
import { Rol } from '@prisma/client';

export const crearUsuarioSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres.'),
  email: z.string().email('Correo electrónico inválido.'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres.'),
  rol: z.nativeEnum(Rol).default(Rol.ESTUDIANTE),
  codigo: z.string().optional(),
  escuela: z.string().optional(),
  ciclo: z.number().optional(),
  empresaId: z.string().optional(),
  cargo: z.string().optional(),
});

export const editarUsuarioSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres.').optional(),
  email: z.string().email('Correo electrónico inválido.').optional(),
  rol: z.nativeEnum(Rol).optional(),
  activo: z.boolean().optional(),
});
