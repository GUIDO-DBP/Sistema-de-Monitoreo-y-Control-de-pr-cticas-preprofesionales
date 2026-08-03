import { Request, Response, NextFunction } from 'express';
import * as postulacionService from '../services/postulacion.service';
import type {
  CreatePostulacionInput,
  PatchEstadoPostulacionInput,
  AddObservacionInput,
} from '../validators/postulacion.validator';

/** GET /api/postulaciones */
export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await postulacionService.findAll(req.user!);
    res.json({ data });
  } catch (err) { next(err); }
}

/** GET /api/postulaciones/:id */
export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await postulacionService.findById(req.params.id, req.user!);
    res.json({ data });
  } catch (err) { next(err); }
}

/** POST /api/postulaciones */
export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await postulacionService.create(req.body as CreatePostulacionInput, req.user!);
    res.status(201).json({ data });
  } catch (err) { next(err); }
}

/** PATCH /api/postulaciones/:id/estado */
export async function patchEstado(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await postulacionService.patchEstado(req.params.id, req.body as PatchEstadoPostulacionInput, req.user!);
    res.json({ data });
  } catch (err) { next(err); }
}

/** POST /api/postulaciones/:id/observaciones */
export async function addObservacion(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await postulacionService.addObservacion(req.params.id, req.body as AddObservacionInput, req.user!);
    res.json({ data });
  } catch (err) { next(err); }
}
