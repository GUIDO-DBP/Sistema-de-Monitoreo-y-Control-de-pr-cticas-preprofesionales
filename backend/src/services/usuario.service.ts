import { prisma } from '../config/prisma';
import bcrypt from 'bcrypt';
import { Rol } from '@prisma/client';
import { registrarAuditoria } from './auditoria.service';

export async function listarUsuarios(currentUser: { id: string; rol: Rol }, filterRol?: string) {
  const where: any = {};

  if (currentUser.rol === Rol.COORDINADOR) {
    where.rol = { in: [Rol.ESTUDIANTE, Rol.TUTOR] };
  }

  if (filterRol && Object.values(Rol).includes(filterRol as Rol)) {
    where.rol = filterRol as Rol;
  }

  return prisma.usuario.findMany({
    where,
    select: {
      id: true,
      nombre: true,
      email: true,
      rol: true,
      activo: true,
      createdAt: true,
      updatedAt: true,
      estudiante: { select: { codigo: true, escuela: true, ciclo: true } },
      tutorEmpresarial: { select: { cargo: true, empresa: { select: { nombre: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function obtenerUsuarioPorId(id: string) {
  const user = await prisma.usuario.findUnique({
    where: { id },
    select: {
      id: true,
      nombre: true,
      email: true,
      rol: true,
      activo: true,
      createdAt: true,
      updatedAt: true,
      estudiante: true,
      tutorEmpresarial: { include: { empresa: true } },
    },
  });

  if (!user) throw new Error('Usuario no encontrado.');
  return user;
}

export async function crearUsuario(data: {
  nombre: string;
  email: string;
  password: string;
  rol: Rol;
  codigo?: string;
  escuela?: string;
  ciclo?: number;
  empresaId?: string;
  cargo?: string;
}, adminId: string) {
  const existe = await prisma.usuario.findUnique({ where: { email: data.email } });
  if (existe) throw new Error('Ya existe un usuario registrado con este correo.');

  const passwordHash = await bcrypt.hash(data.password, 12);

  const usuario = await prisma.usuario.create({
    data: {
      nombre: data.nombre,
      email: data.email,
      passwordHash,
      rol: data.rol,
    },
  });

  if (data.rol === Rol.ESTUDIANTE) {
    await prisma.estudiante.create({
      data: {
        usuarioId: usuario.id,
        codigo: data.codigo || `2026${Math.floor(100000 + Math.random() * 900000)}`,
        escuela: data.escuela || 'Ingeniería de Sistemas',
        ciclo: data.ciclo || 9,
        iniciales: data.nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      },
    });
  } else if (data.rol === Rol.TUTOR && data.empresaId) {
    await prisma.tutorEmpresarial.create({
      data: {
        usuarioId: usuario.id,
        empresaId: data.empresaId,
        cargo: data.cargo || 'Tutor de Prácticas',
      },
    });
  }

  await registrarAuditoria({
    usuarioId: adminId,
    accion: 'CREAR_USUARIO',
    entidad: 'Usuario',
    entidadId: usuario.id,
    detalles: { email: data.email, rol: data.rol },
  });

  return usuario;
}

export async function actualizarUsuario(id: string, data: { nombre?: string; email?: string; rol?: Rol; activo?: boolean }, adminId: string) {
  const usuario = await prisma.usuario.findUnique({ where: { id } });
  if (!usuario) throw new Error('Usuario no encontrado.');

  if (data.email && data.email !== usuario.email) {
    const existe = await prisma.usuario.findUnique({ where: { email: data.email } });
    if (existe) throw new Error('El nuevo correo ya está en uso por otro usuario.');
  }

  const actualizado = await prisma.usuario.update({
    where: { id },
    data,
  });

  await registrarAuditoria({
    usuarioId: adminId,
    accion: 'ACTUALIZAR_USUARIO',
    entidad: 'Usuario',
    entidadId: id,
    detalles: data,
  });

  return actualizado;
}

export async function cambiarEstadoUsuario(id: string, activo: boolean, adminId: string) {
  const usuario = await prisma.usuario.update({
    where: { id },
    data: { activo },
  });

  await registrarAuditoria({
    usuarioId: adminId,
    accion: activo ? 'ACTIVAR_USUARIO' : 'DESACTIVAR_USUARIO',
    entidad: 'Usuario',
    entidadId: id,
  });

  return usuario;
}

export async function resetPassword(id: string, nuevaPassword?: string, adminId?: string) {
  const pwd = nuevaPassword || 'Smcpp2026*';
  const passwordHash = await bcrypt.hash(pwd, 12);

  await prisma.usuario.update({
    where: { id },
    data: { passwordHash },
  });

  if (adminId) {
    await registrarAuditoria({
      usuarioId: adminId,
      accion: 'RESET_PASSWORD',
      entidad: 'Usuario',
      entidadId: id,
    });
  }

  return { message: 'Contraseña restablecida correctamente.', defaultPassword: pwd };
}
