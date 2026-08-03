import { Router } from 'express';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';
import * as horaController from '../controllers/hora.controller';
import { Rol } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.get('/', horaController.listarHoras);
router.get('/mias', horaController.obtenerMiasHoras);

router.post('/', authorizeRoles(Rol.ESTUDIANTE, Rol.COORDINADOR, Rol.ADMINISTRADOR), horaController.registrarHora);
router.patch('/:id/validar', authorizeRoles(Rol.TUTOR, Rol.COORDINADOR, Rol.ADMINISTRADOR), horaController.validarHora);
router.patch('/:id/observar', authorizeRoles(Rol.TUTOR, Rol.COORDINADOR, Rol.ADMINISTRADOR), horaController.observarHora);
router.delete('/:id', horaController.eliminarHora);

export default router;
