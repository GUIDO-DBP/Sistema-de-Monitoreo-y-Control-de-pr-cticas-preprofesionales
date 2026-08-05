import { Request, Response } from 'express';
import * as horaService from '../services/hora.service';
import { crearHoraSchema } from '../validators/hora.validator';

export async function registrarHora(req: Request, res: Response) {
  try {
    const validatedData = crearHoraSchema.parse(req.body);
    const data = await horaService.registrarHora({
      usuarioId: req.user!.id,
      postulacionId: validatedData.postulacionId,
      fechaStr: validatedData.fecha,
      horaEntrada: validatedData.horaEntrada,
      horaSalida: validatedData.horaSalida,
      minutosPausa: validatedData.minutosPausa,
      actividad: validatedData.actividad,
      semana: validatedData.semana,
    });

    return res.status(201).json({ data });
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Error al registrar horas.' });
  }
}

export async function listarHoras(req: Request, res: Response) {
  try {
    const data = await horaService.listarHoras(req.user!);
    return res.json({ data });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function obtenerMiasHoras(req: Request, res: Response) {
  try {
    const data = await horaService.listarHoras(req.user!);
    return res.json({ data });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function validarHora(req: Request, res: Response) {
  try {
    const { observacion } = req.body;
    const data = await horaService.validarHora(req.params.id, req.user!.id, observacion);
    return res.json({ data });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function observarHora(req: Request, res: Response) {
  try {
    const { observacion } = req.body;
    if (!observacion) {
      return res.status(400).json({ error: 'Debes ingresar un motivo de observación.' });
    }
    const data = await horaService.observarHora(req.params.id, observacion, req.user!.id);
    return res.json({ data });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function eliminarHora(req: Request, res: Response) {
  try {
    const data = await horaService.eliminarHora(req.params.id, req.user!);
    return res.json({ data });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}
