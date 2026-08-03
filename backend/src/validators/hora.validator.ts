import { z } from 'zod';

export const crearHoraSchema = z.object({
  postulacionId: z.string().min(1, 'La postulación es requerida.'),
  fecha: z.string().refine(val => !isNaN(Date.parse(val)), { message: 'Fecha inválida.' }),
  horaEntrada: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Formato HH:mm inválido (ej. 08:00).'),
  horaSalida: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Formato HH:mm inválido (ej. 16:00).'),
  minutosPausa: z.number().min(0).max(240).default(60),
  actividad: z.string().min(5, 'Describe la actividad realizada (mínimo 5 caracteres).'),
  semana: z.string().optional(),
});
