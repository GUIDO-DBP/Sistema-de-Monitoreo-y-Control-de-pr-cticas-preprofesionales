import { Request, Response, NextFunction } from 'express';
import * as notificacionService from '../services/notificacion.service';

/** GET /api/notificaciones */
export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await notificacionService.findAll(req.user!.id);
    res.json({ data });
  } catch (err) { next(err); }
}

/** PATCH /api/notificaciones/:id/leida */
export async function patchLeida(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await notificacionService.patchLeida(req.params.id, req.user!.id);
    res.json({ data });
  } catch (err) { next(err); }
}
