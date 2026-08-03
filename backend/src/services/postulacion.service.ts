import { prisma } from '../config/prisma';
import { AppError } from '../middlewares/error.middleware';
import { Rol } from '@prisma/client';
import type {
  CreatePostulacionInput,
  PatchEstadoPostulacionInput,
  AddObservacionInput,
} from '../validators/postulacion.validator';

const estudianteInclude = {
  id: true, nombre: true, email: true,
  estudiante: { select: { id: true, codigo: true, escuela: true, iniciales: true, color: true } },
} as const;

const postulacionInclude = {
  estudiante: {
    include: { usuario: { select: estudianteInclude } },
  },
  empresa: { select: { id: true, nombre: true, rubro: true, modalidad: true } },
  convenio: { select: { id: true, codigo: true, estado: true } },
  responsable: { select: { id: true, nombre: true } },
  tutor: { include: { usuario: { select: { id: true, nombre: true } } } },
  _count: { select: { documentos: true, registrosHoras: true, evaluaciones: true } },
} as const;

interface AuthUser {
  id: string;
  rol: Rol;
}

/** Generate a unique SMCPP code */
async function generateCodigo(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.postulacion.count();
  return `SMCPP-${year}-${String(count + 1).padStart(3, '0')}`;
}

export async function findAll(user: AuthUser) {
  // Students only see their own postulations
  if (user.rol === Rol.ESTUDIANTE) {
    const estudiante = await prisma.estudiante.findFirst({
      where: { usuarioId: user.id },
    });
    if (!estudiante) return [];
    return prisma.postulacion.findMany({
      where: { estudianteId: estudiante.id, activo: true },
      include: postulacionInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  // Coordinadores / Administradores / Tutores see all
  return prisma.postulacion.findMany({
    where: { activo: true },
    include: postulacionInclude,
    orderBy: { createdAt: 'desc' },
  });
}

export async function findById(id: string, user: AuthUser) {
  const postulacion = await prisma.postulacion.findUnique({
    where: { id },
    include: postulacionInclude,
  });

  if (!postulacion || !postulacion.activo) {
    throw new AppError(404, 'Postulación no encontrada.', 'NOT_FOUND');
  }

  // Student can only access their own
  if (user.rol === Rol.ESTUDIANTE) {
    const estudiante = await prisma.estudiante.findFirst({ where: { usuarioId: user.id } });
    if (postulacion.estudianteId !== estudiante?.id) {
      throw new AppError(403, 'No tienes acceso a esta postulación.', 'FORBIDDEN');
    }
  }

  return postulacion;
}

export async function create(input: CreatePostulacionInput, user: AuthUser) {
  let estudianteId: string;

  if (user.rol === Rol.ESTUDIANTE) {
    // Student creates their own postulation
    const estudiante = await prisma.estudiante.findFirst({ where: { usuarioId: user.id } });
    if (!estudiante) {
      throw new AppError(400, 'No tienes perfil de estudiante configurado.', 'NO_STUDENT_PROFILE');
    }
    estudianteId = estudiante.id;

    // A student can only have one active postulation
    const existing = await prisma.postulacion.findFirst({
      where: { estudianteId, activo: true, estado: { notIn: ['RECHAZADA'] } },
    });
    if (existing) {
      throw new AppError(409, 'Ya tienes una postulación activa.', 'ALREADY_EXISTS');
    }
  } else {
    // Coordinator must provide estudianteId
    if (!input.estudianteId) {
      throw new AppError(400, 'El campo estudianteId es requerido para coordinadores.', 'MISSING_FIELD');
    }
    estudianteId = input.estudianteId;
  }

  const codigo = await generateCodigo();

  const postulacion = await prisma.postulacion.create({
    data: {
      codigo,
      estudianteId,
      empresaId: input.empresaId,
      convenioId: input.convenioId,
      responsableId: user.rol !== Rol.ESTUDIANTE ? user.id : undefined,
      area: input.area,
      modalidad: input.modalidad,
      fechaInicio: input.fechaInicio ? new Date(input.fechaInicio) : undefined,
      fechaFin: input.fechaFin ? new Date(input.fechaFin) : undefined,
      horasSemanales: input.horasSemanales,
      motivacion: input.motivacion,
      descripcion: input.descripcion,
    },
    include: postulacionInclude,
  });

  return postulacion;
}

export async function patchEstado(id: string, input: PatchEstadoPostulacionInput, user: AuthUser) {
  // Only coordinators / admins can change the state
  if (user.rol === Rol.ESTUDIANTE || user.rol === Rol.TUTOR) {
    throw new AppError(403, 'No tienes permisos para cambiar el estado de la postulación.', 'FORBIDDEN');
  }

  const exists = await prisma.postulacion.findUnique({ where: { id } });
  if (!exists || !exists.activo) {
    throw new AppError(404, 'Postulación no encontrada.', 'NOT_FOUND');
  }

  return prisma.postulacion.update({
    where: { id },
    data: {
      estado: input.estado,
      ...(input.observaciones && { observaciones: input.observaciones }),
    },
    include: postulacionInclude,
  });
}

export async function addObservacion(id: string, input: AddObservacionInput, user: AuthUser) {
  if (user.rol === Rol.ESTUDIANTE) {
    throw new AppError(403, 'No tienes permisos para agregar observaciones.', 'FORBIDDEN');
  }

  const exists = await prisma.postulacion.findUnique({ where: { id } });
  if (!exists || !exists.activo) {
    throw new AppError(404, 'Postulación no encontrada.', 'NOT_FOUND');
  }

  return prisma.postulacion.update({
    where: { id },
    data: {
      observaciones: input.observacion,
      estado: 'OBSERVADA',
    },
    include: postulacionInclude,
  });
}
