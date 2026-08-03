import { prisma } from '../config/prisma';
import { EstadoHoras, Rol, CategoriaNotificacion, Prioridad } from '@prisma/client';
import { registrarAuditoria } from './auditoria.service';

function calcularHorasNetas(horaEntrada: string, horaSalida: string, minutosPausa: number): number {
  const [eH, eM] = horaEntrada.split(':').map(Number);
  const [sH, sM] = horaSalida.split(':').map(Number);

  const entradaMin = eH * 60 + eM;
  const salidaMin = sH * 60 + sM;

  if (salidaMin <= entradaMin) {
    throw new Error('La hora de salida debe ser posterior a la hora de entrada.');
  }

  const minutosTotales = salidaMin - entradaMin - minutosPausa;
  if (minutosTotales <= 0) {
    throw new Error('El tiempo de pausa supera las horas trabajadas.');
  }

  const horas = parseFloat((minutosTotales / 60).toFixed(2));
  if (horas > 12) {
    throw new Error('No se pueden registrar más de 12 horas trabajadas por día.');
  }

  return horas;
}

export async function registrarHora(params: {
  usuarioId: string;
  postulacionId: string;
  fechaStr: string;
  horaEntrada: string;
  horaSalida: string;
  minutosPausa: number;
  actividad: string;
  semana?: string;
}) {
  const estudiante = await prisma.estudiante.findUnique({
    where: { usuarioId: params.usuarioId },
  });

  if (!estudiante) throw new Error('Perfil de estudiante no encontrado.');

  const fechaReg = new Date(params.fechaStr);
  const ahora = new Date();
  if (fechaReg > ahora) {
    throw new Error('No se pueden registrar horas con fechas futuras.');
  }

  const horasCalculadas = calcularHorasNetas(params.horaEntrada, params.horaSalida, params.minutosPausa);

  const inicioDia = new Date(fechaReg.setHours(0, 0, 0, 0));
  const finDia = new Date(fechaReg.setHours(23, 59, 59, 999));

  const existeDuplicado = await prisma.registroHora.findFirst({
    where: {
      estudianteId: estudiante.id,
      fecha: { gte: inicioDia, lte: finDia },
    },
  });

  if (existeDuplicado) {
    throw new Error('Ya registraste horas para esta fecha. Edita o elimina el registro previo.');
  }

  const ultimoRegistro = await prisma.registroHora.findFirst({
    where: { estudianteId: estudiante.id, estado: EstadoHoras.APROBADA },
    orderBy: { createdAt: 'desc' },
  });

  const acumuladoPrevio = ultimoRegistro ? ultimoRegistro.horasAcumuladas : 0;
  const nuevasAcumuladas = acumuladoPrevio + Math.round(horasCalculadas);

  const postulacion = await prisma.postulacion.findUnique({
    where: { id: params.postulacionId },
  });

  const registro = await prisma.registroHora.create({
    data: {
      postulacionId: params.postulacionId,
      estudianteId: estudiante.id,
      tutorId: postulacion?.tutorId,
      fecha: new Date(params.fechaStr),
      horaEntrada: params.horaEntrada,
      horaSalida: params.horaSalida,
      minutosPausa: params.minutosPausa,
      horasCalculadas,
      horasRegistradas: Math.round(horasCalculadas),
      horasAcumuladas: nuevasAcumuladas,
      actividad: params.actividad,
      semana: params.semana || `Día ${new Date(params.fechaStr).toLocaleDateString()}`,
      estado: EstadoHoras.PENDIENTE,
    },
  });

  await registrarAuditoria({
    usuarioId: params.usuarioId,
    accion: 'REGISTRAR_HORAS',
    entidad: 'RegistroHora',
    entidadId: registro.id,
    detalles: { horasCalculadas, fecha: params.fechaStr },
  });

  return registro;
}

export async function listarHoras(user: { id: string; rol: Rol }) {
  const where: any = {};

  if (user.rol === Rol.ESTUDIANTE) {
    const estudiante = await prisma.estudiante.findUnique({ where: { usuarioId: user.id } });
    if (!estudiante) return { registros: [], resumen: { acumuladas: 0, meta: 320, aprobadas: 0, pendientes: 0, observadas: 0 } };
    where.estudianteId = estudiante.id;
  } else if (user.rol === Rol.TUTOR) {
    const tutor = await prisma.tutorEmpresarial.findUnique({ where: { usuarioId: user.id } });
    if (tutor) where.tutorId = tutor.id;
  }

  const registros = await prisma.registroHora.findMany({
    where,
    include: {
      estudiante: { include: { usuario: { select: { nombre: true, email: true } } } },
      postulacion: { select: { codigo: true, empresa: { select: { nombre: true } } } },
    },
    orderBy: { fecha: 'desc' },
  });

  const aprobadas = registros.filter(r => r.estado === EstadoHoras.APROBADA).reduce((sum: number, r: any) => sum + r.horasRegistradas, 0);
  const pendientes = registros.filter(r => r.estado === EstadoHoras.PENDIENTE).reduce((sum: number, r: any) => sum + r.horasRegistradas, 0);
  const observadas = registros.filter(r => r.estado === EstadoHoras.OBSERVADA).reduce((sum: number, r: any) => sum + r.horasRegistradas, 0);

  return {
    registros,
    resumen: {
      acumuladas: aprobadas,
      meta: 320,
      aprobadas,
      pendientes,
      observadas,
      porcentaje: Math.min(100, Math.round((aprobadas / 320) * 100)),
    },
  };
}

export async function validarHora(id: string, usuarioId: string, observacion?: string) {
  const hora = await prisma.registroHora.findUnique({
    where: { id },
    include: { estudiante: true },
  });

  if (!hora) throw new Error('Registro de hora no encontrado.');

  const actualizado = await prisma.registroHora.update({
    where: { id },
    data: {
      estado: EstadoHoras.APROBADA,
      comentario: observacion || null,
      fechaValidacion: new Date(),
    },
  });

  await registrarAuditoria({
    usuarioId,
    accion: 'VALIDAR_HORA',
    entidad: 'RegistroHora',
    entidadId: id,
  });

  await prisma.notificacion.create({
    data: {
      usuarioId: hora.estudiante.usuarioId,
      categoria: CategoriaNotificacion.HORAS,
      titulo: 'Horas validadas',
      resumen: `Tu registro de ${hora.horasRegistradas} horas del ${new Date(hora.fecha).toLocaleDateString()} fue aprobado.`,
      prioridad: Prioridad.MEDIA,
      accionUrl: '/mis-horas',
    },
  });

  return actualizado;
}

export async function observarHora(id: string, observacion: string, usuarioId: string) {
  const hora = await prisma.registroHora.findUnique({
    where: { id },
    include: { estudiante: true },
  });

  if (!hora) throw new Error('Registro de hora no encontrado.');

  const actualizado = await prisma.registroHora.update({
    where: { id },
    data: {
      estado: EstadoHoras.OBSERVADA,
      comentario: observacion,
      fechaValidacion: new Date(),
    },
  });

  await registrarAuditoria({
    usuarioId,
    accion: 'OBSERVAR_HORA',
    entidad: 'RegistroHora',
    entidadId: id,
    detalles: { observacion },
  });

  await prisma.notificacion.create({
    data: {
      usuarioId: hora.estudiante.usuarioId,
      categoria: CategoriaNotificacion.HORAS,
      titulo: 'Horas observadas',
      resumen: `Tu registro de horas del ${new Date(hora.fecha).toLocaleDateString()} fue observado: ${observacion}`,
      prioridad: Prioridad.ALTA,
      accionUrl: '/mis-horas',
    },
  });

  return actualizado;
}

export async function eliminarHora(id: string, user: { id: string; rol: Rol }) {
  const hora = await prisma.registroHora.findUnique({
    where: { id },
    include: { estudiante: true },
  });

  if (!hora) throw new Error('Registro de hora no encontrado.');

  if (user.rol === Rol.ESTUDIANTE) {
    const estudiante = await prisma.estudiante.findUnique({ where: { usuarioId: user.id } });
    if (!estudiante || hora.estudianteId !== estudiante.id) {
      throw new Error('No tienes permiso para eliminar este registro.');
    }
    if (hora.estado !== EstadoHoras.PENDIENTE) {
      throw new Error('Solo puedes eliminar registros que estén en estado pendiente.');
    }
  }

  await prisma.registroHora.delete({ where: { id } });

  await registrarAuditoria({
    usuarioId: user.id,
    accion: 'ELIMINAR_HORA',
    entidad: 'RegistroHora',
    entidadId: id,
  });

  return { message: 'Registro de horas eliminado exitosamente.' };
}
