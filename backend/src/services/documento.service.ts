import { prisma } from '../config/prisma';
import { EstadoDocumento, CategoriaNotificacion, Prioridad, Rol } from '@prisma/client';
import { registrarAuditoria } from './auditoria.service';
import fs from 'fs';
import path from 'path';

export async function subirDocumento(params: {
  postulacionId: string;
  usuarioId: string;
  nombre: string;
  file: Express.Multer.File;
}) {
  const postulacion = await prisma.postulacion.findUnique({
    where: { id: params.postulacionId },
    include: { estudiante: true },
  });

  if (!postulacion) {
    throw new Error('Postulante o postulación no encontrada.');
  }

  const docExistente = await prisma.documento.findFirst({
    where: { postulacionId: params.postulacionId, nombre: params.nombre },
    orderBy: { version: 'desc' },
  });

  const nuevaVersion = docExistente ? docExistente.version + 1 : 1;

  const doc = await prisma.documento.create({
    data: {
      postulacionId: params.postulacionId,
      estudianteId: postulacion.estudianteId,
      nombre: params.nombre,
      nombreInterno: params.file.filename,
      tipo: params.file.mimetype || 'application/pdf',
      ruta: `uploads/${params.file.filename}`,
      tamano: params.file.size,
      version: nuevaVersion,
      estado: EstadoDocumento.PENDIENTE,
      cargadoPorId: params.usuarioId,
    },
  });

  await registrarAuditoria({
    usuarioId: params.usuarioId,
    accion: 'SUBIR_DOCUMENTO',
    entidad: 'Documento',
    entidadId: doc.id,
    detalles: { nombre: params.nombre, version: nuevaVersion },
  });

  if (postulacion.responsableId) {
    await prisma.notificacion.create({
      data: {
        usuarioId: postulacion.responsableId,
        categoria: CategoriaNotificacion.DOCUMENTOS,
        titulo: 'Nuevo documento subido',
        resumen: `El estudiante cargó ${params.nombre} (v${nuevaVersion}) para la postulación ${postulacion.codigo}.`,
        prioridad: Prioridad.MEDIA,
        accionUrl: '/documentos',
      },
    });
  }

  return doc;
}

export async function listarDocumentos(user: { id: string; rol: Rol }, postulacionId?: string) {
  const where: any = {};

  if (postulacionId) {
    const postulacion = await prisma.postulacion.findUnique({
      where: { id: postulacionId },
      include: { estudiante: true },
    });

    if (!postulacion) {
      throw new Error('Postulación no encontrada.');
    }

    if (user.rol === Rol.ESTUDIANTE) {
      const estudiante = await prisma.estudiante.findUnique({ where: { usuarioId: user.id } });
      if (!estudiante || postulacion.estudianteId !== estudiante.id) {
        throw new Error('No tienes permiso para ver los documentos de esta postulación.');
      }
    }

    where.postulacionId = postulacionId;
  } else if (user.rol === Rol.ESTUDIANTE) {
    const estudiante = await prisma.estudiante.findUnique({ where: { usuarioId: user.id } });
    if (!estudiante) return [];
    where.estudianteId = estudiante.id;
  }

  return prisma.documento.findMany({
    where,
    include: {
      estudiante: { include: { usuario: { select: { nombre: true, email: true } } } },
      postulacion: { select: { codigo: true, empresa: { select: { nombre: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  });
}


export async function obtenerDocumentoPorId(id: string, user: { id: string; rol: Rol }) {
  const doc = await prisma.documento.findUnique({
    where: { id },
    include: {
      estudiante: { include: { usuario: true } },
      postulacion: true,
    },
  });

  if (!doc) throw new Error('Documento no encontrado.');

  if (user.rol === Rol.ESTUDIANTE) {
    const estudiante = await prisma.estudiante.findUnique({ where: { usuarioId: user.id } });
    if (!estudiante || doc.estudianteId !== estudiante.id) {
      throw new Error('No tienes permiso para acceder a este documento.');
    }
  }

  return doc;
}

export async function cambiarEstadoDocumento(
  docId: string,
  estado: EstadoDocumento,
  comentario: string | undefined,
  usuarioId: string
) {
  const doc = await prisma.documento.findUnique({
    where: { id: docId },
    include: { estudiante: true, postulacion: true },
  });

  if (!doc) throw new Error('Documento no encontrado.');

  const actualizado = await prisma.documento.update({
    where: { id: docId },
    data: {
      estado,
      comentario: comentario !== undefined ? comentario : doc.comentario,
    },
  });

  await registrarAuditoria({
    usuarioId,
    accion: `DOCUMENTO_${estado}`,
    entidad: 'Documento',
    entidadId: docId,
    detalles: { estado, comentario },
  });

  await prisma.notificacion.create({
    data: {
      usuarioId: doc.estudiante.usuarioId,
      categoria: CategoriaNotificacion.DOCUMENTOS,
      titulo: estado === EstadoDocumento.APROBADO ? 'Documento aprobado' : 'Documento observado',
      resumen: `Tu documento ${doc.nombre} ha sido marcado como ${estado.toLowerCase()}.${comentario ? ` Observación: ${comentario}` : ''}`,
      prioridad: estado === EstadoDocumento.OBSERVADO ? Prioridad.ALTA : Prioridad.MEDIA,
      accionUrl: '/mis-documentos',
    },
  });

  return actualizado;
}

export async function descargarDocumento(id: string, user: { id: string; rol: Rol }) {
  const doc = await obtenerDocumentoPorId(id, user);

  const fullPath = path.resolve(__dirname, '../../', doc.ruta);
  if (!fs.existsSync(fullPath)) {
    throw new Error('El archivo físico no se encuentra en el servidor.');
  }

  return { doc, fullPath };
}
