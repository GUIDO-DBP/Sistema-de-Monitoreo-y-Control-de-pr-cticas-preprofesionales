import { Request, Response, NextFunction } from 'express';
import * as empresaService from '../services/empresa.service';
import type { CreateEmpresaInput, UpdateEmpresaInput } from '../validators/empresa.validator';

/** GET /api/empresas */
export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Coordinadores/administradores ven todas; estudiantes solo las activas
    const soloActivas = req.user?.rol === 'ESTUDIANTE';
    const data = await empresaService.findAll(soloActivas);
    res.json({ data });
  } catch (err) { next(err); }
}

/** GET /api/empresas/:id */
export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await empresaService.findById(req.params.id);
    res.json({ data });
  } catch (err) { next(err); }
}

/** POST /api/empresas */
export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await empresaService.create(req.body as CreateEmpresaInput);
    res.status(201).json({ data });
  } catch (err) { next(err); }
}

/** PUT /api/empresas/:id */
export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await empresaService.update(req.params.id, req.body as UpdateEmpresaInput);
    res.json({ data });
  } catch (err) { next(err); }
}
