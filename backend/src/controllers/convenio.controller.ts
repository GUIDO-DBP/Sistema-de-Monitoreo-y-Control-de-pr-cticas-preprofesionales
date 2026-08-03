import { Request, Response, NextFunction } from 'express';
import * as convenioService from '../services/convenio.service';
import type {
  CreateConvenioInput,
  UpdateConvenioInput,
  PatchEstadoConvenioInput,
} from '../validators/convenio.validator';

/** GET /api/convenios */
export async function list(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await convenioService.findAll();
    res.json({ data });
  } catch (err) { next(err); }
}

/** POST /api/convenios */
export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await convenioService.create(req.body as CreateConvenioInput);
    res.status(201).json({ data });
  } catch (err) { next(err); }
}

/** PUT /api/convenios/:id */
export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await convenioService.update(req.params.id, req.body as UpdateConvenioInput);
    res.json({ data });
  } catch (err) { next(err); }
}

/** PATCH /api/convenios/:id/estado */
export async function patchEstado(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await convenioService.patchEstado(req.params.id, req.body as PatchEstadoConvenioInput);
    res.json({ data });
  } catch (err) { next(err); }
}
