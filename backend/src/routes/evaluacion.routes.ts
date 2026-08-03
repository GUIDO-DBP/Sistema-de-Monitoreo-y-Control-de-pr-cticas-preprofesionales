import { Router } from 'express';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';
import * as evaluacionController from '../controllers/evaluacion.controller';
import { Rol } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.get('/', evaluacionController.listarEvaluaciones);
router.get('/mia', evaluacionController.obtenerMiaEvaluacion);
router.get('/:id', evaluacionController.obtenerEvaluacionPorId);

router.post('/:id/detalles', authorizeRoles(Rol.TUTOR, Rol.COORDINADOR, Rol.ADMINISTRADOR), evaluacionController.guardarDetalles);
router.put('/:id', authorizeRoles(Rol.TUTOR, Rol.COORDINADOR, Rol.ADMINISTRADOR), evaluacionController.guardarDetalles);
router.patch('/:id/enviar', authorizeRoles(Rol.TUTOR, Rol.COORDINADOR, Rol.ADMINISTRADOR), evaluacionController.enviarEvaluacion);
router.patch('/:id/cerrar', authorizeRoles(Rol.TUTOR, Rol.COORDINADOR, Rol.ADMINISTRADOR), evaluacionController.enviarEvaluacion);

export default router;
