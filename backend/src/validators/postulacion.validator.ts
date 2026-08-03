import { z } from 'zod';
import { EstadoPostulacion } from '@prisma/client';

export const createPostulacionSchema = {
  body: z.object({
    empresaId: z.string().cuid('ID de empresa inválido.'),
    convenioId: z.string().cuid().optional(),
    area: z.string().min(2).max(100).trim(),
    modalidad: z.enum(['Presencial', 'Híbrido', 'Remoto']),
    fechaInicio: z.string().datetime().optional(),
    fechaFin: z.string().datetime().optional(),
    horasSemanales: z.number().int().min(10).max(40).default(30),
    motivacion: z.string().max(1000).optional(),
    descripcion: z.string().max(2000).optional(),
    // Coordinador can assign a different student
    estudianteId: z.string().cuid().optional(),
  }),
};

export const patchEstadoSchema = {
  body: z.object({
    estado: z.nativeEnum(EstadoPostulacion),
    observaciones: z.string().max(1000).optional(),
  }),
  params: z.object({ id: z.string().cuid('ID inválido.') }),
};

export const addObservacionSchema = {
  body: z.object({
    observacion: z.string().min(5).max(1000).trim(),
  }),
  params: z.object({ id: z.string().cuid('ID inválido.') }),
};

export const idParamSchema = {
  params: z.object({ id: z.string().cuid('ID inválido.') }),
};

export type CreatePostulacionInput = z.infer<typeof createPostulacionSchema.body>;
export type PatchEstadoPostulacionInput = z.infer<typeof patchEstadoSchema.body>;
export type AddObservacionInput = z.infer<typeof addObservacionSchema.body>;
