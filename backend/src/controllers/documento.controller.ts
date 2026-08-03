import { Request, Response } from 'express';
import * as documentoService from '../services/documento.service';
import { EstadoDocumento } from '@prisma/client';

export async function subirDocumento(req: Request, res: Response) {
  try {
    const postulacionId = req.params.id;
    const file = req.file;
    const { nombre } = req.body;

    if (!file) {
      return res.status(400).json({ error: 'Debes seleccionar un archivo PDF.' });
    }

    const doc = await documentoService.subirDocumento({
      postulacionId,
      usuarioId: req.user!.id,
      nombre: nombre || file.originalname.replace(/\.[^/.]+$/, ''),
      file,
    });

    return res.status(201).json(doc);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function listarDocumentosPostulacion(req: Request, res: Response) {
  try {
    const docs = await documentoService.listarDocumentos(req.user!, req.params.id);
    return res.json(docs);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function listarTodosDocumentos(req: Request, res: Response) {
  try {
    const docs = await documentoService.listarDocumentos(req.user!);
    return res.json(docs);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function obtenerDocumento(req: Request, res: Response) {
  try {
    const doc = await documentoService.obtenerDocumentoPorId(req.params.id, req.user!);
    return res.json(doc);
  } catch (error: any) {
    return res.status(404).json({ error: error.message });
  }
}

export async function cambiarEstado(req: Request, res: Response) {
  try {
    const { estado, comentario } = req.body;
    if (!Object.values(EstadoDocumento).includes(estado)) {
      return res.status(400).json({ error: 'Estado de documento inválido.' });
    }

    const doc = await documentoService.cambiarEstadoDocumento(
      req.params.id,
      estado as EstadoDocumento,
      comentario,
      req.user!.id
    );

    return res.json(doc);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function agregarObservacion(req: Request, res: Response) {
  try {
    const { observacion } = req.body;
    if (!observacion) {
      return res.status(400).json({ error: 'La observación no puede estar vacía.' });
    }

    const doc = await documentoService.cambiarEstadoDocumento(
      req.params.id,
      EstadoDocumento.OBSERVADO,
      observacion,
      req.user!.id
    );

    return res.json(doc);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function descargarDocumento(req: Request, res: Response) {
  try {
    const { doc, fullPath } = await documentoService.descargarDocumento(req.params.id, req.user!);
    res.setHeader('Content-Type', doc.tipo);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(doc.nombre)}.pdf"`);
    return res.sendFile(fullPath);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}
