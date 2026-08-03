import { prisma } from '../config/prisma';
import { EstadoEvaluacion, Rol, CategoriaNotificacion, Prioridad } from '@prisma/client';
import { registrarAuditoria } from './auditoria.service';

export async function listarEvaluaciones(user: { id: string; rol: Rol }) {
  const where: any = {};

  if (user.rol === Rol.ESTUDIANTE) {
    const estudiante = await prisma.estudiante.findUnique({ where: { usuarioId: user.id } });
    if (!estudiante) return [];
    where.estudianteId = estudiante.id;
  } else if (user.rol === Rol.TUTOR) {
    const tutor = await prisma.tutorEmpresarial.findUnique({ where: { usuarioId: user.id } });
    if (tutor) where.tutorId = tutor.id;
  }

  return prisma.evaluacion.findMany({
    where,
    include: {
      estudiante: { include: { usuario: { select: { nombre: true, email: true } } } },
      tutor: { include: { usuario: { select: { nombre: true } } } },
      postulacion: { select: { codigo: true, empresa: { select: { nombre: true } } } },
      detalles: { include: { criterio: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function obtenerMiaEvaluacion(usuarioId: string) {
  const estudiante = await prisma.estudiante.findUnique({ where: { usuarioId } });
  if (!estudiante) throw new Error('Perfil de estudiante no encontrado.');

  const evaluacion = await prisma.evaluacion.findFirst({
    where: { estudianteId: estudiante.id },
    include: {
      estudiante: { include: { usuario: { select: { nombre: true, email: true } } } },
      tutor: { include: { usuario: { select: { nombre: true } } } },
      postulacion: { select: { codigo: true, empresa: { select: { nombre: true } } } },
      detalles: { include: { criterio: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const criterios = await prisma.criterioEvaluacion.findMany({ where: { activo: true } });

  return { evaluacion, criterios };
}

export async function obtenerEvaluacionPorId(id: string, user: { id: string; rol: Rol }) {
  const evaluacion = await prisma.evaluacion.findUnique({
    where: { id },
    include: {
      estudiante: { include: { usuario: true } },
      tutor: { include: { usuario: true } },
      postulacion: { select: { codigo: true, empresa: { select: { nombre: true } } } },
      detalles: { include: { criterio: true } },
    },
  });

  if (!evaluacion) throw new Error('Evaluación no encontrada.');

  if (user.rol === Rol.ESTUDIANTE) {
    const estudiante = await prisma.estudiante.findUnique({ where: { usuarioId: user.id } });
    if (!estudiante || evaluacion.estudianteId !== estudiante.id) {
      throw new Error('No tienes permiso para ver esta evaluación.');
    }
  }

  const criterios = await prisma.criterioEvaluacion.findMany({ where: { activo: true } });

  return { evaluacion, criterios };
}

export async function guardarDetallesEvaluacion(
  evaluacionId: string,
  detallesInputs: { criterioId: string; puntaje: number; comentario?: string }[],
  fortalezas?: string,
  aspectosMejorar?: string,
  usuarioId?: string
) {
  const evaluacion = await prisma.evaluacion.findUnique({ where: { id: evaluacionId } });
  if (!evaluacion) throw new Error('Evaluación no encontrada.');

  for (const item of detallesInputs) {
    if (item.puntaje < 1 || item.puntaje > 5) {
      throw new Error('El puntaje debe estar entre 1 y 5.');
    }

    await prisma.detalleEvaluacion.upsert({
      where: {
        evaluacionId_criterioId: {
          evaluacionId,
          criterioId: item.criterioId,
        },
      },
      update: {
        puntaje: item.puntaje,
        comentario: item.comentario,
      },
      create: {
        evaluacionId,
        criterioId: item.criterioId,
        puntaje: item.puntaje,
        comentario: item.comentario,
      },
    });
  }

  const todosDetalles = await prisma.detalleEvaluacion.findMany({
    where: { evaluacionId },
    include: { criterio: true },
  });

  const totalCriterios = await prisma.criterioEvaluacion.count({ where: { activo: true } });
  const avance = Math.min(100, Math.round((todosDetalles.length / Math.max(totalCriterios, 1)) * 100));

  let sumaPesos = 0;
  let sumaPonderada = 0;
  todosDetalles.forEach((d: any) => {
    const peso = d.criterio.peso || 1;
    sumaPesos += peso;
    sumaPonderada += d.puntaje * peso;
  });

  const resultado = sumaPesos > 0 ? parseFloat((sumaPonderada / sumaPesos).toFixed(2)) : 0;

  const actualizado = await prisma.evaluacion.update({
    where: { id: evaluacionId },
    data: {
      avance,
      resultado,
      fortalezas: fortalezas !== undefined ? fortalezas : evaluacion.fortalezas,
      aspectosMejorar: aspectosMejorar !== undefined ? aspectosMejorar : evaluacion.aspectosMejorar,
      estado: avance === 100 ? EstadoEvaluacion.EN_PROCESO : EstadoEvaluacion.PENDIENTE,
    },
    include: { detalles: { include: { criterio: true } } },
  });

  if (usuarioId) {
    await registrarAuditoria({
      usuarioId,
      accion: 'GUARDAR_DETALLES_EVALUACION',
      entidad: 'Evaluacion',
      entidadId: evaluacionId,
      detalles: { avance, resultado },
    });
  }

  return actualizado;
}

export async function enviarEvaluacion(evaluacionId: string, usuarioId: string) {
  const evaluacion = await prisma.evaluacion.findUnique({
    where: { id: evaluacionId },
    include: { estudiante: true, detalles: true },
  });

  if (!evaluacion) throw new Error('Evaluación no encontrada.');

  const actualizado = await prisma.evaluacion.update({
    where: { id: evaluacionId },
    data: {
      estado: EstadoEvaluacion.COMPLETADA,
      fechaEnvio: new Date(),
    },
  });

  await registrarAuditoria({
    usuarioId,
    accion: 'ENVIAR_EVALUACION',
    entidad: 'Evaluacion',
    entidadId: evaluacionId,
    detalles: { resultado: evaluacion.resultado },
  });

  await prisma.notificacion.create({
    data: {
      usuarioId: evaluacion.estudiante.usuarioId,
      categoria: CategoriaNotificacion.EVALUACIONES,
      titulo: 'Evaluación de desempeño completada',
      resumen: `Tu tutor ha finalizado tu evaluación de prácticas con una nota global de ${evaluacion.resultado || 5.0}/5.0.`,
      prioridad: Prioridad.MEDIA,
      accionUrl: '/mi-evaluacion',
    },
  });

  return actualizado;
}
