import { z } from 'zod';

export const loginSchema = {
  body: z.object({
    email: z.string().email('Formato de correo inválido.').toLowerCase().trim().optional(),
    correo: z.string().email('Formato de correo inválido.').toLowerCase().trim().optional(),
    password: z.string({ required_error: 'La contraseña es requerida.' })
      .min(8, 'La contraseña debe tener al menos 8 caracteres.'),
  }).refine(data => !!(data.email || data.correo), {
    message: 'El correo es requerido.',
    path: ['correo'],
  }),
};

export type LoginInput = {
  email?: string;
  correo?: string;
  password: string;
};

