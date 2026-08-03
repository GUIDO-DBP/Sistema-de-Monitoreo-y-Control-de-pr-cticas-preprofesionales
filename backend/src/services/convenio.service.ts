import { prisma } from '../config/prisma';
import { AppError } from '../middlewares/error.middleware';
import type {
  CreateConvenioInput,
  UpdateConvenioInput,
  PatchEstadoConvenioInput,
} from '../validators/convenio.validator';

const convenioSelect = {
  id: true,
  codigo: true,
  empresaId: true,
  rubro: true,
  inicio: true,
  vencimiento: true,
  vacantes: true,
  estudiantesActivos: true,
  estado: true,
  activo: true,
  createdAt: true,
  updatedAt: true,
  empresa: { select: { id: true, nombre: true, ubicacion: true } },
} as const;

export async function findAll() {
  return prisma.convenio.findMany({
    where: { activo: true },
    select: convenioSelect,
    orderBy: { vencimiento: 'asc' },
  });
}

export async function create(data: CreateConvenioInput) {
  // Verify empresa exists
  const empresa = await prisma.empresa.findUnique({ where: { id: data.empresaId } });
  if (!empresa) {
    throw new AppError(404, 'Empresa no encontrada.', 'NOT_FOUND');
  }

  return prisma.convenio.create({
    data: {
      codigo: data.codigo,
      empresaId: data.empresaId,
      rubro: data.rubro,
      inicio: new Date(data.inicio),
      vencimiento: new Date(data.vencimiento),
      vacantes: data.vacantes,
    },
    select: convenioSelect,
  });
}

export async function update(id: string, data: UpdateConvenioInput) {
  const exists = await prisma.convenio.findUnique({ where: { id } });
  if (!exists) throw new AppError(404, 'Convenio no encontrado.', 'NOT_FOUND');

  return prisma.convenio.update({
    where: { id },
    data: {
      ...data,
      ...(data.vencimiento && { vencimiento: new Date(data.vencimiento) }),
    },
    select: convenioSelect,
  });
}

export async function patchEstado(id: string, data: PatchEstadoConvenioInput) {
  const exists = await prisma.convenio.findUnique({ where: { id } });
  if (!exists) throw new AppError(404, 'Convenio no encontrado.', 'NOT_FOUND');

  return prisma.convenio.update({
    where: { id },
    data: { estado: data.estado },
    select: convenioSelect,
  });
}
