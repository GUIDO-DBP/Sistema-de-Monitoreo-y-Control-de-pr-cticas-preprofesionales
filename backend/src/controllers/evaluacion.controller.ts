import { Request, Response } from 'express';
import * as evaluacionService from '../services/evaluacion.service';

export async function listarEvaluaciones(req: Request, res: Response) {
  try {
    const data = await evaluacionService.listarEvaluaciones(req.user!);
    return res.json(data);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function obtenerMiaEvaluacion(req: Request, res: Response) {
  try {
    const data = await evaluacionService.obtenerMiaEvaluacion(req.user!.id);
    return res.json(data);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function obtenerEvaluacionPorId(req: Request, res: Response) {
  try {
    const data = await evaluacionService.obtenerEvaluacionPorId(req.params.id, req.user!);
    return res.json(data);
  } catch (error: any) {
    return res.status(404).json({ error: error.message });
  }
}

export async function guardarDetalles(req: Request, res: Response) {
  try {
    const { detalles, fortalezas, aspectosMejorar } = req.body;
    if (!Array.isArray(detalles)) {
      return res.status(400).json({ error: 'Formato de detalles inválido.' });
    }

    const evaluacion = await evaluacionService.guardarDetallesEvaluacion(
      req.params.id,
      detalles,
      fortalezas,
      aspectosMejorar,
      req.user!.id
    );

    return res.json(evaluacion);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function enviarEvaluacion(req: Request, res: Response) {
  try {
    const evaluacion = await evaluacionService.enviarEvaluacion(req.params.id, req.user!.id);
    return res.json(evaluacion);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}
