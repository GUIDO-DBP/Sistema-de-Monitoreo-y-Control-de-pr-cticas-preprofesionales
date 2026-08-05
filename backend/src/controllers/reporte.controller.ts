import { Request, Response } from 'express';
import * as reporteService from '../services/reporte.service';

export async function obtenerResumen(req: Request, res: Response) {
  try {
    const data = await reporteService.obtenerResumenReportes();
    return res.json({ data });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function obtenerPostulaciones(req: Request, res: Response) {
  try {
    const data = await reporteService.obtenerReportePostulaciones();
    return res.json({ data });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function obtenerHoras(req: Request, res: Response) {
  try {
    const data = await reporteService.obtenerReporteHoras();
    return res.json({ data });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function obtenerEvaluaciones(req: Request, res: Response) {
  try {
    const data = await reporteService.obtenerReporteEvaluaciones();
    return res.json({ data });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function obtenerConvenios(req: Request, res: Response) {
  try {
    const data = await reporteService.obtenerReporteConvenios();
    return res.json({ data });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function obtenerSeguimiento(req: Request, res: Response) {
  try {
    const data = await reporteService.obtenerSeguimientoEstudiantes();
    return res.json({ data });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}
