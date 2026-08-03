import { Request, Response } from 'express';
import * as usuarioService from '../services/usuario.service';
import { crearUsuarioSchema, editarUsuarioSchema } from '../validators/usuario.validator';

export async function listarUsuarios(req: Request, res: Response) {
  try {
    const rolFilter = req.query.rol as string | undefined;
    const usuarios = await usuarioService.listarUsuarios(req.user!, rolFilter);
    return res.json(usuarios);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function obtenerUsuario(req: Request, res: Response) {
  try {
    const usuario = await usuarioService.obtenerUsuarioPorId(req.params.id);
    return res.json(usuario);
  } catch (error: any) {
    return res.status(404).json({ error: error.message });
  }
}

export async function crearUsuario(req: Request, res: Response) {
  try {
    const validated = crearUsuarioSchema.parse(req.body);
    const usuario = await usuarioService.crearUsuario(validated, req.user!.id);
    return res.status(201).json(usuario);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function actualizarUsuario(req: Request, res: Response) {
  try {
    const validated = editarUsuarioSchema.parse(req.body);
    const usuario = await usuarioService.actualizarUsuario(req.params.id, validated, req.user!.id);
    return res.json(usuario);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function cambiarEstado(req: Request, res: Response) {
  try {
    const { activo } = req.body;
    if (typeof activo !== 'boolean') {
      return res.status(400).json({ error: 'El parámetro activo debe ser booleano.' });
    }
    const usuario = await usuarioService.cambiarEstadoUsuario(req.params.id, activo, req.user!.id);
    return res.json(usuario);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const { password } = req.body;
    const result = await usuarioService.resetPassword(req.params.id, password, req.user!.id);
    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}
