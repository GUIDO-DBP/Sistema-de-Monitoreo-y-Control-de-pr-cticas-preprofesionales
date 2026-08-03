import { z } from 'zod';
import { EstadoConvenio } from '@prisma/client';

export const createConvenioSchema = {
  body: z.object({
    codigo: z.string().min(3).max(50).trim(),
    empresaId: z.string().cuid('ID de empresa inválido.'),
    rubro: z.string().min(2).max(100).trim(),
    inicio: z.string().datetime({ message: 'Fecha de inicio inválida.' }),
    vencimiento: z.string().datetime({ message: 'Fecha de vencimiento inválida.' }),
    vacantes: z.number().int().min(0).default(0),
  }).refine(
    d => new Date(d.vencimiento) > new Date(d.inicio),
    { message: 'La fecha de vencimiento debe ser posterior al inicio.', path: ['vencimiento'] },
  ),
};

export const updateConvenioSchema = {
  body: z.object({
    rubro: z.string().min(2).max(100).trim().optional(),
    vencimiento: z.string().datetime().optional(),
    vacantes: z.number().int().min(0).optional(),
    activo: z.boolean().optional(),
  }),
  params: z.object({ id: z.string().cuid('ID inválido.') }),
};

export const patchEstadoSchema = {
  body: z.object({
    estado: z.nativeEnum(EstadoConvenio),
  }),
  params: z.object({ id: z.string().cuid('ID inválido.') }),
};

export const idParamSchema = {
  params: z.object({ id: z.string().cuid('ID inválido.') }),
};

export type CreateConvenioInput = z.infer<typeof createConvenioSchema.body>;
export type UpdateConvenioInput = z.infer<typeof updateConvenioSchema.body>;
export type PatchEstadoConvenioInput = z.infer<typeof patchEstadoSchema.body>;
