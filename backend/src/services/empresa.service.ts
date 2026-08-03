import { prisma } from '../config/prisma';
import { AppError } from '../middlewares/error.middleware';
import type { CreateEmpresaInput, UpdateEmpresaInput } from '../validators/empresa.validator';

const empresaSelect = {
  id: true,
  nombre: true,
  rubro: true,
  ubicacion: true,
  modalidad: true,
  vacantes: true,
  activo: true,
  createdAt: true,
  updatedAt: true,
  _count: { select: { convenios: true, postulaciones: true } },
} as const;

export async function findAll(soloActivas = true) {
  return prisma.empresa.findMany({
    where: soloActivas ? { activo: true } : undefined,
    select: empresaSelect,
    orderBy: { nombre: 'asc' },
  });
}

export async function findById(id: string) {
  const empresa = await prisma.empresa.findUnique({
    where: { id },
    include: {
      convenios: {
        where: { activo: true },
        select: {
          id: true, codigo: true, estado: true,
          inicio: true, vencimiento: true, vacantes: true, estudiantesActivos: true,
        },
        orderBy: { vencimiento: 'desc' },
      },
      _count: { select: { postulaciones: true, tutores: true } },
    },
  });

  if (!empresa) {
    throw new AppError(404, 'Empresa no encontrada.', 'NOT_FOUND');
  }
  return empresa;
}

export async function create(data: CreateEmpresaInput) {
  return prisma.empresa.create({
    data,
    select: empresaSelect,
  });
}

export async function update(id: string, data: UpdateEmpresaInput) {
  const exists = await prisma.empresa.findUnique({ where: { id } });
  if (!exists) {
    throw new AppError(404, 'Empresa no encontrada.', 'NOT_FOUND');
  }

  return prisma.empresa.update({
    where: { id },
    data,
    select: empresaSelect,
  });
}
