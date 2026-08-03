import { z } from 'zod';

export const createEmpresaSchema = {
  body: z.object({
    nombre: z.string().min(2).max(200).trim(),
    rubro: z.string().min(2).max(100).trim(),
    ubicacion: z.string().min(2).max(200).trim(),
    modalidad: z.enum(['Presencial', 'Híbrido', 'Remoto']),
    vacantes: z.number().int().min(0).default(0),
  }),
};

export const updateEmpresaSchema = {
  body: z.object({
    nombre: z.string().min(2).max(200).trim().optional(),
    rubro: z.string().min(2).max(100).trim().optional(),
    ubicacion: z.string().min(2).max(200).trim().optional(),
    modalidad: z.enum(['Presencial', 'Híbrido', 'Remoto']).optional(),
    vacantes: z.number().int().min(0).optional(),
    activo: z.boolean().optional(),
  }),
  params: z.object({ id: z.string().cuid('ID inválido.') }),
};

export const idParamSchema = {
  params: z.object({ id: z.string().cuid('ID inválido.') }),
};

export type CreateEmpresaInput = z.infer<typeof createEmpresaSchema.body>;
export type UpdateEmpresaInput = z.infer<typeof updateEmpresaSchema.body>;
