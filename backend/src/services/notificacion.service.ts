import { prisma } from '../config/prisma';
import { AppError } from '../middlewares/error.middleware';

export async function findAll(usuarioId: string) {
  return prisma.notificacion.findMany({
    where: { usuarioId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function patchLeida(id: string, usuarioId: string) {
  const notificacion = await prisma.notificacion.findUnique({ where: { id } });

  if (!notificacion) {
    throw new AppError(404, 'Notificación no encontrada.', 'NOT_FOUND');
  }

  if (notificacion.usuarioId !== usuarioId) {
    throw new AppError(403, 'No tienes permisos para modificar esta notificación.', 'FORBIDDEN');
  }

  return prisma.notificacion.update({
    where: { id },
    data: { leida: true },
  });
}
