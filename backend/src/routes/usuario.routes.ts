import { Router } from 'express';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';
import * as usuarioController from '../controllers/usuario.controller';
import { Rol } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.get('/', authorizeRoles(Rol.COORDINADOR, Rol.ADMINISTRADOR), usuarioController.listarUsuarios);
router.get('/:id', authorizeRoles(Rol.COORDINADOR, Rol.ADMINISTRADOR), usuarioController.obtenerUsuario);

router.post('/', authorizeRoles(Rol.ADMINISTRADOR), usuarioController.crearUsuario);
router.put('/:id', authorizeRoles(Rol.ADMINISTRADOR), usuarioController.actualizarUsuario);
router.patch('/:id/estado', authorizeRoles(Rol.ADMINISTRADOR), usuarioController.cambiarEstado);
router.patch('/:id/reset-password', authorizeRoles(Rol.ADMINISTRADOR), usuarioController.resetPassword);

export default router;
