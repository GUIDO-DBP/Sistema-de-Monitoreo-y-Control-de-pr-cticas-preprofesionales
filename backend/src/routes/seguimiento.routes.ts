import { Router } from 'express';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';
import * as reporteController from '../controllers/reporte.controller';
import { Rol } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.get('/estudiantes', authorizeRoles(Rol.COORDINADOR, Rol.ADMINISTRADOR), reporteController.obtenerSeguimiento);

export default router;
