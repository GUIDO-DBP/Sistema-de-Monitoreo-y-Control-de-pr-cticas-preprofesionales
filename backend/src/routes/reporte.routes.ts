import { Router } from 'express';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';
import * as reporteController from '../controllers/reporte.controller';
import { Rol } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.get('/resumen', authorizeRoles(Rol.COORDINADOR, Rol.ADMINISTRADOR, Rol.TUTOR), reporteController.obtenerResumen);
router.get('/postulaciones', authorizeRoles(Rol.COORDINADOR, Rol.ADMINISTRADOR), reporteController.obtenerPostulaciones);
router.get('/horas', authorizeRoles(Rol.COORDINADOR, Rol.ADMINISTRADOR, Rol.TUTOR), reporteController.obtenerHoras);
router.get('/evaluaciones', authorizeRoles(Rol.COORDINADOR, Rol.ADMINISTRADOR, Rol.TUTOR), reporteController.obtenerEvaluaciones);
router.get('/convenios', authorizeRoles(Rol.COORDINADOR, Rol.ADMINISTRADOR), reporteController.obtenerConvenios);

export default router;
