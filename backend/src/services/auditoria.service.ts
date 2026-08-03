import { prisma } from '../config/prisma';

export async function registrarAuditoria(params: {
  usuarioId?: string;
  accion: string;
  entidad: string;
  entidadId?: string;
  detalles?: any;
  ip?: string;
}) {
  try {
    return await prisma.auditoria.create({
      data: {
        usuarioId: params.usuarioId,
        accion: params.accion,
        entidad: params.entidad,
        entidadId: params.entidadId,
        detalles: params.detalles ? params.detalles : undefined,
        ip: params.ip,
      },
    });
  } catch (error) {
    console.error('Error registrando auditoría:', error);
  }
}
