import { z } from 'zod';

export const patchLeidaSchema = {
  params: z.object({ id: z.string().cuid('ID inválido.') }),
};

export const idParamSchema = {
  params: z.object({ id: z.string().cuid('ID inválido.') }),
};
